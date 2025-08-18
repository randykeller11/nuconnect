import { supabaseServer } from '@/lib/supabase/server';

export async function resolveRoomId(roomSlugOrId: string) {
  const supabase = await supabaseServer();

  // Try UUID
  let { data: byId } = await supabase
    .from('rooms')
    .select('id')
    .eq('id', roomSlugOrId)
    .maybeSingle();
  if (byId?.id) return byId.id;

  // Try slug
  const { data: bySlug } = await supabase
    .from('rooms')
    .select('id')
    .eq('slug', roomSlugOrId)
    .maybeSingle();
  return bySlug?.id ?? null;
}
