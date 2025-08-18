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
  const { data: roomMembers, error: roomMembersError } = await supabase
    .from('room_members')
    .select('user_id')
    .eq('room_id', roomId)
    .neq('user_id', user.id);

  console.log('Room members query:', { roomMembers, error: roomMembersError, roomId, userId: user.id });

  const candidateIds = (roomMembers || []).map(m => m.user_id);
  console.log('Candidate IDs:', candidateIds);

  if (candidateIds.length === 0) {
    console.log('No room members found - returning 0 queued');
    return NextResponse.json({ queued: 0 });
  }

  // Get existing interactions to exclude
  const { data: existingInteractions, error: interactionsError } = await supabase
    .from('match_interactions')
    .select('target_user_id')
    .eq('room_id', roomId)
    .eq('user_id', user.id);

  console.log('Existing interactions:', { existingInteractions, error: interactionsError });

  const interactedIds = new Set((existingInteractions || []).map(i => i.target_user_id));
  const newCandidateIds = candidateIds.filter(id => !interactedIds.has(id));

  console.log('Filtered candidate IDs:', { interactedIds: Array.from(interactedIds), newCandidateIds });

  if (newCandidateIds.length === 0) {
    console.log('No new candidates after filtering - returning 0 queued');
    return NextResponse.json({ queued: 0 });
  }

  // Get current user profile
  const { data: myProfile, error: myProfileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  console.log('My profile:', { myProfile, error: myProfileError });

  // Get candidate profiles
  const { data: candidateProfiles, error: candidateProfilesError } = await supabase
    .from('profiles')
    .select('user_id, role, industries, skills, interests, headline, networking_goals, linkedin_url, profile_photo_url')
    .in('user_id', newCandidateIds);

  console.log('Candidate profiles:', { candidateProfiles, error: candidateProfilesError, count: candidateProfiles?.length });

  // Score and queue candidates
  console.log('Building queue for candidates:', newCandidateIds.length);
  const queueItems = await Promise.all(
    (candidateProfiles || []).map(async (candidate) => {
      const score = scoreMatch(myProfile, candidate);
      let rationale = whySimple(myProfile, candidate, score);
      
      console.log(`Scoring candidate ${candidate.user_id}: ${score}`);
      
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
  console.log('Upserting queue items:', queueItems.length);
  if (queueItems.length > 0) {
    const { error: upsertError } = await supabase
      .from('match_queue')
      .upsert(queueItems, {
        onConflict: 'room_id,for_user_id,candidate_user_id'
      });
    
    if (upsertError) {
      console.error('Queue upsert error:', upsertError);
    }
  }

  console.log('Final queued count:', queueItems.length);
  return NextResponse.json({ queued: queueItems.length });
}
