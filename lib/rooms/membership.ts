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

  // Use upsert for idempotent behavior as recommended in logs.md
  const { data, error } = await supabase
    .from('room_members')
    .upsert({ 
      room_id: roomId, 
      user_id: user.id,
      joined_at: new Date().toISOString()
    }, { 
      onConflict: 'room_id,user_id' 
    })
    .select('room_id, user_id')
    .single();

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

  // Update room member count - use direct query since RPC doesn't exist
  try {
    // Get current member count
    const { count: memberCount } = await supabase
      .from('room_members')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);

    // Update the room's member_count field
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ member_count: memberCount || 0 })
      .eq('id', roomId);

    if (updateError) {
      console.error('Failed to update room member count', { roomId, error: updateError });
    } else {
      console.log('Room member count updated', { roomId, newCount: memberCount });
    }
  } catch (countError) {
    console.error('Error updating room member count', { roomId, error: countError });
  }

  return { ok: true as const };
}
