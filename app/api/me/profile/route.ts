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
    // A complete profile should have at least: name, interests, career_goals
    const hasProfile = !profileError && !!profile
    
    // Check for onboarding completion based on actual data structure
    const isOnboardingComplete = hasProfile && (
      // Check if we have basic profile info
      (profile.name || (profile.contact_prefs?.role && profile.contact_prefs?.company)) &&
      // Check if we have interests (either top-level or in contact_prefs)
      ((profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0) ||
       (profile.contact_prefs?.interests && Array.isArray(profile.contact_prefs.interests) && profile.contact_prefs.interests.length > 0)) &&
      // Check if we have career goals (either top-level or in objectives)
      (profile.career_goals || 
       (profile.contact_prefs?.objectives && Array.isArray(profile.contact_prefs.objectives) && profile.contact_prefs.objectives.length > 0))
    )

    console.log('Profile check debug:', {
      hasProfile,
      profileExists: !!profile,
      profileError: profileError?.message,
      name: profile?.name,
      interests: profile?.interests,
      interestsLength: profile?.interests?.length,
      career_goals: profile?.career_goals,
      contact_prefs_role: profile?.contact_prefs?.role,
      contact_prefs_company: profile?.contact_prefs?.company,
      contact_prefs_objectives: profile?.contact_prefs?.objectives,
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
