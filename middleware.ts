import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Refreshes the Supabase session and writes cookies for SSR.
 * Uses getUser() (not getSession) to force token revalidation.
 */
export async function updateSession(request: NextRequest) {
  // Prepare a response we can mutate cookies on
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Ensure httpOnly etc. are preserved
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: per docs, use getUser() to revalidate & refresh cookies
  await supabase.auth.getUser()

  return response
}

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // skip static assets & images; adjust as needed
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
