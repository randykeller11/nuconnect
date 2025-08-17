import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// Calculate profile completion score based on filled fields
function calculateProfileCompletionScore(profile: any): number {
  if (!profile) return 0
  
  let score = 0
  const maxScore = 100
  
  // Basic identity (30 points)
  if (profile.first_name) score += 10
  if (profile.last_name) score += 10
  if (profile.avatar_url) score += 10
  
  // Professional info (40 points)
  if (profile.role) score += 15
  if (profile.industries && profile.industries.length > 0) score += 15
  if (profile.bio) score += 10
  
  // Networking goals (20 points)
  if (profile.networking_goals && profile.networking_goals.length > 0) score += 10
  if (profile.connection_preferences && profile.connection_preferences.length > 0) score += 10
  
  // Skills and extras (10 points)
  if (profile.skills && profile.skills.length > 0) score += 5
  if (profile.linkedin_url) score += 5
  
  return Math.min(score, maxScore)
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to get profile with better error handling for RLS issues
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Profile fetch error:', error)
      // If it's an RLS policy error, return empty profile instead of failing
      if (error.message.includes('infinite recursion') || 
          error.message.includes('policy') || 
          error.code === '42P17') {
        console.log('RLS policy issue detected, returning null profile')
        return NextResponse.json({ profile: null })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate completion score if profile exists
    let profileWithScore = profile
    if (profile) {
      const completionScore = calculateProfileCompletionScore(profile)
      profileWithScore = { ...profile, completion_score: completionScore }
    }
    
    return NextResponse.json({ profile: profileWithScore })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      updated_at: new Date().toISOString()
    }
    
    // Calculate and include completion score
    update.profile_completion_score = calculateProfileCompletionScore(update)

    const { data: profile, error } = await supabase
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
