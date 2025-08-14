import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { calculateProfileStrength } from '@/lib/profile/strength'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create service role client to bypass RLS for profile operations
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
    
    const body = await request.json()
    const { profileData, isPartial = false } = body
    
    if (!profileData) {
      return NextResponse.json(
        { error: 'Missing profileData' },
        { status: 400 }
      )
    }
    
    // Build the profile object to save - only include non-null values
    const profileToSave: any = {
      user_id: user.id,
      updated_at: new Date().toISOString()
    }
    
    // Always ensure we have a name - never allow null
    if (profileData.role && profileData.role.trim()) {
      profileToSave.name = `${profileData.role.trim()}${profileData.company && profileData.company.trim() ? ` at ${profileData.company.trim()}` : ''}`
    } else if (profileData.company && profileData.company.trim()) {
      profileToSave.name = `Professional at ${profileData.company.trim()}`
    } else {
      // Fallback name if no role or company provided
      profileToSave.name = 'Professional'
    }
    
    if (profileData.interests && profileData.interests.length > 0) {
      profileToSave.interests = profileData.interests
    }

    // Optional links & photo
    if (profileData.linkedin_url) profileToSave.linkedin_url = profileData.linkedin_url
    if (profileData.profile_photo_url) profileToSave.profile_photo_url = profileData.profile_photo_url
    
    if (profileData.objectives?.[0] || profileData.career_goals) {
      profileToSave.career_goals = profileData.objectives?.[0] || profileData.career_goals
    }
    
    // Determine mentorship preference
    if (profileData.objectives || profileData.seeking) {
      profileToSave.mentorship_pref = profileData.objectives?.includes('Mentor Others') ? 'offering' : 
                        profileData.seeking?.includes('Mentor') ? 'seeking' : 'none'
    }
    
    // Build contact preferences object
    const contactPrefs: any = {}
    if (profileData.role) contactPrefs.role = profileData.role
    if (profileData.company) contactPrefs.company = profileData.company
    if (profileData.location) contactPrefs.location = profileData.location
    if (profileData.headline) contactPrefs.headline = profileData.headline
    if (profileData.industries) contactPrefs.industries = profileData.industries
    if (profileData.skills) contactPrefs.skills = profileData.skills
    if (profileData.seniority) contactPrefs.seniority = profileData.seniority
    if (profileData.objectives) contactPrefs.objectives = profileData.objectives
    if (profileData.seeking) contactPrefs.seeking = profileData.seeking
    if (profileData.openness !== undefined) contactPrefs.openness = profileData.openness
    if (profileData.introStyle) contactPrefs.introStyle = profileData.introStyle
    if (profileData.enableIcebreakers !== undefined) contactPrefs.enableIcebreakers = profileData.enableIcebreakers
    if (profileData.showLinkedIn !== undefined) contactPrefs.showLinkedIn = profileData.showLinkedIn
    if (profileData.showCompany !== undefined) contactPrefs.showCompany = profileData.showCompany
    
    if (Object.keys(contactPrefs).length > 0) {
      profileToSave.contact_prefs = contactPrefs
    }
    
    // Try to upsert the profile using service role to bypass RLS
    const { data: profile, error: profileError } = await serviceSupabase
      .from('profiles')
      .upsert(profileToSave, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()
    
    if (profileError) {
      console.error('Profile save error:', profileError)
      return NextResponse.json(
        { error: 'Failed to save profile to database', details: profileError.message },
        { status: 500 }
      )
    }
    
    // Calculate and persist profile strength
    const strength = calculateProfileStrength(profile)
    if (strength.score !== profile.profile_strength) {
      const { error: strengthError } = await serviceSupabase
        .from('profiles')
        .update({ profile_strength: strength.score })
        .eq('user_id', user.id)
      if (!strengthError) {
        profile.profile_strength = strength.score
      }
    }
    return NextResponse.json({
      success: true,
      profile,
      profile_strength: profile.profile_strength,
      isOnboardingComplete:
        !isPartial &&
        profile.role &&
        (profile.company || profile.headline) &&
        (profile.objectives?.length ?? 0) > 0 &&
        (profile.seeking?.length ?? 0) > 0,
    })
    
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
