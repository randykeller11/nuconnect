import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { toUserId, roomId } = await req.json();

  await supabase
    .from('contacts_shared')
    .upsert({
      room_id: roomId,
      from_user: user.id,
      to_user: toUserId,
      status: 'sent',
    }, { onConflict: 'room_id,from_user,to_user' });

  const { data: recip } = await supabase
    .from('contacts_shared')
    .select('*')
    .eq('room_id', roomId)
    .eq('from_user', toUserId)
    .eq('to_user', user.id)
    .maybeSingle();

  if (recip) {
    // mark both as mutual
    await supabase
      .from('contacts_shared')
      .update({ status: 'mutual' })
      .or(`and(room_id.eq.${roomId},from_user.eq.${user.id},to_user.eq.${toUserId}),and(room_id.eq.${roomId},from_user.eq.${toUserId},to_user.eq.${user.id})`);
    return NextResponse.json({ mutual: true, message: "It's a match! Contact info exchanged." });
  }

  return NextResponse.json({ mutual: false, message: 'Contact info shared. We'll notify you if they share back.' });
}
