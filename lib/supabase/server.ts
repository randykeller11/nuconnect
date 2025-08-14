import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const createSupabaseServerClient = async () => {
  const jar = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (k) => jar.get(k)?.value,
        set: (k, v, o) => jar.set(k, v, o as any),
        remove: (k, o) => jar.set(k, '', { ...o, maxAge: 0 } as any),
      }
    }
  )
}
