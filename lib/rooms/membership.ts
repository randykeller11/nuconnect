import { supabaseServer } from '@/lib/supabase/server';

export async function ensureMembership(roomId: string) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'unauthorized' as const };

  const { error } = await supabase
    .from('room_members')
    .upsert(
      { room_id: roomId, user_id: user.id, joined_at: new Date().toISOString() },
      { onConflict: 'room_id,user_id' }
    );

  if (error) return { ok: false, reason: 'insert_failed' as const, error };
  return { ok: true as const };
}
