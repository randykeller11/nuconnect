import { supabaseServer } from '@/lib/supabase/server';

export async function ensureMembership(roomId: string) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'unauthorized' as const };

  console.log('ensureMembership attempt', { roomId, userId: user.id });

  // First check if room exists
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id')
    .eq('id', roomId)
    .single();

  if (roomError || !room) {
    console.error('Room not found', { roomId, roomError });
    return { ok: false, reason: 'room_not_found' as const, error: roomError };
  }

  // Try to upsert membership
  const { data, error } = await supabase
    .from('room_members')
    .upsert(
      { room_id: roomId, user_id: user.id, joined_at: new Date().toISOString() },
      { onConflict: 'room_id,user_id' }
    )
    .select();

  if (error) {
    console.error('room_members upsert failed', { 
      roomId, 
      userId: user.id, 
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint 
    });
    return { ok: false, reason: 'insert_failed' as const, error };
  }

  console.log('room_members upsert success', { roomId, userId: user.id, data });
  return { ok: true as const };
}
