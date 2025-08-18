import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId } = await req.json();

  // Get existing interactions to exclude
  const { data: existingInteractions } = await supabase
    .from('match_interactions')
    .select('target_user_id')
    .eq('room_id', roomId)
    .eq('user_id', user.id);

  const interactedIds = (existingInteractions || []).map(i => i.target_user_id);

  // Get next candidate from queue
  let query = supabase
    .from('match_queue')
    .select(`
      candidate_user_id,
      score,
      rationale,
      profiles!match_queue_candidate_user_id_fkey (
        role,
        industries,
        skills,
        interests,
        networking_goals,
        profile_photo_url
      )
    `)
    .eq('room_id', roomId)
    .eq('for_user_id', user.id)
    .order('score', { ascending: false })
    .order('enqueued_at', { ascending: true })
    .limit(1);

  if (interactedIds.length > 0) {
    query = query.not('candidate_user_id', 'in', `(${interactedIds.join(',')})`);
  }

  const { data: queueItems } = await query;

  if (!queueItems || queueItems.length === 0) {
    return NextResponse.json({ candidate: null });
  }

  const item = queueItems[0];
  const profile = item.profiles;

  // Return anonymized candidate
  const candidate = {
    user_id: item.candidate_user_id,
    role: profile?.role || '',
    industries: (profile?.industries || []).slice(0, 2),
    skills: (profile?.skills || []).slice(0, 3),
    interests: (profile?.interests || []).slice(0, 2),
    networking_goals: (profile?.networking_goals || []).slice(0, 2),
    score: item.score,
    rationale: item.rationale,
    photo: profile?.profile_photo_url || null, // Client will blur this
  };

  return NextResponse.json({ candidate });
}
