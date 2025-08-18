import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { resolveRoomId } from '@/lib/rooms/resolve';
import { ensureMembership } from '@/lib/rooms/membership';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId: roomSlugOrId } = await req.json();
  const roomId = await resolveRoomId(roomSlugOrId);
  if (!roomId) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });

  const joined = await ensureMembership(roomId);
  if (!joined.ok) return NextResponse.json({ error: joined.reason }, { status: 400 });

  return NextResponse.json({ ok: true, roomId });
}
