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
    const isOnboardingComplete = hasProfile && 
      profile.name && 
      profile.interests && 
      profile.interests.length > 0 && 
      profile.career_goals
    
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
