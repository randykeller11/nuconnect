import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId } = await req.json();

  // Delete existing queue items
  await supabase
    .from('match_queue')
    .delete()
    .eq('room_id', roomId)
    .eq('for_user_id', user.id);

  // Reset session status
  await supabase
    .from('match_sessions')
    .upsert({
      room_id: roomId,
      user_id: user.id,
      status: 'active',
      completed_at: null,
      last_refreshed_at: new Date().toISOString()
    }, {
      onConflict: 'room_id,user_id'
    });

  // Call the start logic to rebuild queue
  const startResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/matches/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.get('Authorization') || ''
    },
    body: JSON.stringify({ roomId })
  });

  const startData = await startResponse.json();

  return NextResponse.json({ 
    reset: true, 
    queued: startData.queued || 0 
  });
}
