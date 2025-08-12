import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    // Check if profile exists and has completed onboarding
    const hasProfile = !profileError && !!profile
    
    // Check for onboarding completion based on actual data structure
    // A profile is complete if it has the basic required fields from onboarding
    const isOnboardingComplete = hasProfile && (
      // Must have a name (either top-level or constructed from role/company)
      profile.name &&
      // Must have interests (top-level array)
      profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0 &&
      // Must have career goals (top-level field)
      profile.career_goals &&
      // Must have contact preferences (indicates completed onboarding flow)
      profile.contact_prefs && typeof profile.contact_prefs === 'object'
    )

    console.log('Profile check debug:', {
      hasProfile,
      profileExists: !!profile,
      profileError: profileError?.message,
      name: profile?.name,
      interests: profile?.interests,
      interestsLength: profile?.interests?.length,
      career_goals: profile?.career_goals,
      contact_prefs_exists: !!profile?.contact_prefs,
      isOnboardingComplete
    })
    
    return NextResponse.json({ 
      hasProfile, 
      isOnboardingComplete,
      userId: user.id,
      profile: hasProfile ? profile : null
    })
  } catch (error) {
    console.error('Profile check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH() {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // This would handle profile updates
    // For now, return a placeholder response
    return NextResponse.json({ 
      success: true,
      message: 'Profile update endpoint ready for implementation'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
