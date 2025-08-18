import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId } = await req.json();

  // Check if user has a matching session and if it's completed
  const { data: session } = await supabase
    .from('match_sessions')
    .select('status, completed_at')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .maybeSingle();

  const completed = session?.status === 'completed' || !!session?.completed_at;

  return NextResponse.json({ completed });
}
