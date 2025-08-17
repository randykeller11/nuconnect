import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function supabaseServer() {
  const jar = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => jar.get(name)?.value,
        set: (name, value, options) => { jar.set(name, value, options) },
        remove: (name, options) => { jar.set(name, '', options) },
      },
    }
  )
}

// Keep compatibility alias
export const createSupabaseServerClient = supabaseServer
