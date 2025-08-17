import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
      },
    }
  );
}

export const createSupabaseServerClient = async () => {
  const jar = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            jar.set(name, value, options)
          })
        },
      }
    }
  )
}
