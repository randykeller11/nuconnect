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

  // Check if already a member first to avoid RLS policy issues
  const { data: existingMember } = await supabase
    .from('room_members')
    .select('user_id')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingMember) {
    console.log('User already a member', { roomId, userId: user.id });
    return { ok: true as const };
  }

  // Try to insert new membership (avoid upsert due to RLS policy recursion)
  const { data, error } = await supabase
    .from('room_members')
    .insert({ 
      room_id: roomId, 
      user_id: user.id, 
      joined_at: new Date().toISOString() 
    })
    .select();

  if (error) {
    // If it's a duplicate key error, that's actually success
    if (error.code === '23505') {
      console.log('Duplicate membership insert (success)', { roomId, userId: user.id });
      return { ok: true as const };
    }
    
    console.error('room_members insert failed', { 
      roomId, 
      userId: user.id, 
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint 
    });
    return { ok: false, reason: 'insert_failed' as const, error };
  }

  console.log('room_members insert success', { roomId, userId: user.id, data });
  return { ok: true as const };
}
