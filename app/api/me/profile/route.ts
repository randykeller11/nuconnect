import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = await supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role client to bypass RLS policies completely
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: profile, error } = await serviceSupabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Profile fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const hasProfile = !!profile
    const isOnboardingComplete = profile?.onboarding_stage === 'complete'
    return NextResponse.json({ profile: profile || null, hasProfile, isOnboardingComplete })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role client to bypass RLS policies
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const body = await req.json()

    // Basic server-side validation
    const sanitize = (s?: string) => (typeof s === 'string' ? s.trim() : null)
    const isUrl = (u?: string) => !u || /^https?:\/\/\S+$/i.test(u)

    // Validate URL fields
    if (body.linkedin_url && !isUrl(body.linkedin_url)) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 })
    }

    // Normalize arrays
    const asArray = (v: unknown) => Array.isArray(v) ? v : []

    const update = {
      user_id: user.id,
      first_name: sanitize(body.first_name) || '',
      last_name: sanitize(body.last_name) || '',
      avatar_url: sanitize(body.avatar_url) || null,
      role: body.role || null,
      industries: asArray(body.industries),
      networking_goals: asArray(body.networking_goals),
      connection_preferences: asArray(body.connection_preferences),
      bio: sanitize(body.bio) || null,
      skills: asArray(body.skills),
      linkedin_url: sanitize(body.linkedin_url) || null,
      name: `${sanitize(body.first_name) || ''} ${sanitize(body.last_name) || ''}`.trim() || 'User',
      updated_at: new Date().toISOString()
    }

    const { data: profile, error } = await serviceSupabase
      .from('profiles')
      .upsert(update)
      .select('*')
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
