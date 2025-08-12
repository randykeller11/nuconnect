import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, profileData, isPartial = false } = body
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }
    
    // Check authentication by getting the user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Verify the user ID matches the authenticated user
    if (user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get existing profile to merge with
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    // Map profile data to database format
    const dbProfile = {
      user_id: userId,
      name: profileData.role ? `${profileData.role}${profileData.company ? ` at ${profileData.company}` : ''}` : 'Professional',
      interests: profileData.interests || [],
      career_goals: profileData.objectives?.[0], // Take first objective as primary goal
      mentorship_pref: profileData.seeking?.includes('Mentor') ? 'seeking' : 
                      profileData.objectives?.includes('Mentor Others') ? 'offering' : 'none',
      contact_prefs: {
        ...(existingProfile?.contact_prefs || {}),
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
      }
    }
    
    // Upsert profile (merge with existing data)
    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(dbProfile, {
        onConflict: 'user_id'
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      profile
    })
    
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
