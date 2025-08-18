import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId, targetUserId } = await req.json();

  // Insert skip interaction
  await supabase
    .from('match_interactions')
    .upsert({
      room_id: roomId,
      user_id: user.id,
      target_user_id: targetUserId,
      action: 'skip'
    }, {
      onConflict: 'room_id,user_id,target_user_id'
    });

  return NextResponse.json({ ok: true });
}
