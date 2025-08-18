import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId } = await req.json();

  // Get total queued
  const { count: totalQueued } = await supabase
    .from('match_queue')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId)
    .eq('for_user_id', user.id);

  // Get interactions
  const { data: interactions } = await supabase
    .from('match_interactions')
    .select('action')
    .eq('room_id', roomId)
    .eq('user_id', user.id);

  const likesGiven = interactions?.filter(i => i.action === 'like').length || 0;
  const skipsGiven = interactions?.filter(i => i.action === 'skip').length || 0;
  const totalInteracted = likesGiven + skipsGiven;

  const remaining = (totalQueued || 0) - totalInteracted;

  // Get mutual matches count
  const { count: mutualCount } = await supabase
    .from('match_synergy')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

  const status = {
    remaining: Math.max(0, remaining),
    totalQueued: totalQueued || 0,
    likesGiven,
    skipsGiven,
    mutualCount: mutualCount || 0,
    completed: remaining <= 0
  };

  return NextResponse.json({ status });
}
