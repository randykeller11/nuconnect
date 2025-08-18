import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { scoreMatch, whySimple } from '@/lib/matching/score';
import { explainMatchLLM } from '@/lib/ai/openrouter';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId } = await req.json();

  // Upsert session
  await supabase
    .from('match_sessions')
    .upsert({
      room_id: roomId,
      user_id: user.id,
      last_refreshed_at: new Date().toISOString(),
      status: 'active'
    }, {
      onConflict: 'room_id,user_id'
    });

  // Get room members excluding current user
  const { data: roomMembers } = await supabase
    .from('room_members')
    .select('user_id')
    .eq('room_id', roomId)
    .neq('user_id', user.id);

  const candidateIds = (roomMembers || []).map(m => m.user_id);

  if (candidateIds.length === 0) {
    return NextResponse.json({ queued: 0 });
  }

  // Get existing interactions to exclude
  const { data: existingInteractions } = await supabase
    .from('match_interactions')
    .select('target_user_id')
    .eq('room_id', roomId)
    .eq('user_id', user.id);

  const interactedIds = new Set((existingInteractions || []).map(i => i.target_user_id));
  const newCandidateIds = candidateIds.filter(id => !interactedIds.has(id));

  if (newCandidateIds.length === 0) {
    return NextResponse.json({ queued: 0 });
  }

  // Get current user profile
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Get candidate profiles
  const { data: candidateProfiles } = await supabase
    .from('profiles')
    .select('user_id, role, industries, skills, interests, headline, networking_goals, linkedin_url, profile_photo_url')
    .in('user_id', newCandidateIds);

  // Score and queue candidates
  const queueItems = await Promise.all(
    (candidateProfiles || []).map(async (candidate) => {
      const score = scoreMatch(myProfile, candidate);
      let rationale = whySimple(myProfile, candidate, score);
      
      // Try OpenRouter for better rationale
      try {
        const llmRationale = await explainMatchLLM({
          me: {
            industries: myProfile?.industries ?? [],
            skills: myProfile?.skills ?? [],
            interests: myProfile?.interests ?? [],
            networking_goals: myProfile?.networking_goals ?? [],
            role: myProfile?.role ?? null,
            headline: myProfile?.headline ?? null,
          },
          other: {
            industries: candidate?.industries ?? [],
            skills: candidate?.skills ?? [],
            interests: candidate?.interests ?? [],
            networking_goals: candidate?.networking_goals ?? [],
            role: candidate?.role ?? null,
            headline: candidate?.headline ?? null,
          },
          score
        });
        
        if (llmRationale && llmRationale.length > 10) {
          rationale = llmRationale;
        }
      } catch (error) {
        console.error('OpenRouter failed:', error);
      }

      return {
        room_id: roomId,
        for_user_id: user.id,
        candidate_user_id: candidate.user_id,
        score,
        rationale,
        enqueued_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    })
  );

  // Bulk upsert to queue
  if (queueItems.length > 0) {
    await supabase
      .from('match_queue')
      .upsert(queueItems, {
        onConflict: 'room_id,for_user_id,candidate_user_id'
      });
  }

  return NextResponse.json({ queued: queueItems.length });
}
