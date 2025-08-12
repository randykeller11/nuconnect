import { createSupabaseServerClient } from '@/lib/supabase/server'
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
    
    const body = await request.json()
    const { profileData, isPartial = false } = body
    
    if (!profileData) {
      return NextResponse.json(
        { error: 'Missing profileData' },
        { status: 400 }
      )
    }
    
    // Build the profile object to save
    const profileToSave = {
      user_id: user.id,
      name: profileData.role ? `${profileData.role}${profileData.company ? ` at ${profileData.company}` : ''}` : 'Professional',
      interests: profileData.interests || [],
      career_goals: profileData.objectives?.[0] || profileData.career_goals,
      mentorship_pref: profileData.objectives?.includes('Mentor Others') ? 'offering' : 
                      profileData.seeking?.includes('Mentor') ? 'seeking' : 'none',
      contact_prefs: {
        role: profileData.role,
        company: profileData.company,
        location: profileData.location,
        headline: profileData.headline,
        industries: profileData.industries,
        skills: profileData.skills,
        seniority: profileData.seniority,
        objectives: profileData.objectives,
        seeking: profileData.seeking,
        openness: profileData.openness,
        introStyle: profileData.introStyle,
        enableIcebreakers: profileData.enableIcebreakers,
        showLinkedIn: profileData.showLinkedIn,
        showCompany: profileData.showCompany
      },
      updated_at: new Date().toISOString()
    }
    
    // Upsert the profile (insert or update)
    const { data: profile, error: profileError } = await supabase
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
        { error: 'Failed to save profile to database' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      profile: profile
    })
    
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
