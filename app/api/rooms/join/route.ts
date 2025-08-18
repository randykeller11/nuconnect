import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { resolveRoomId } from '@/lib/rooms/resolve';
import { ensureMembership } from '@/lib/rooms/membership';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId: roomSlugOrId } = await req.json();
  console.log('join room request', { roomSlugOrId, userId: user.id });

  const roomId = await resolveRoomId(roomSlugOrId);
  if (!roomId) {
    console.error('room resolution failed', { roomSlugOrId });
    return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
  }

  const joined = await ensureMembership(roomId);
  if (!joined.ok) {
    console.error('membership failed', { roomId, userId: user.id, reason: joined.reason, error: joined.error });
    return NextResponse.json({ 
      error: joined.reason,
      details: joined.error?.message || 'Unknown database error'
    }, { status: 400 });
  }

  console.log('join room success', { roomId, userId: user.id });
  return NextResponse.json({ ok: true, roomId });
}
