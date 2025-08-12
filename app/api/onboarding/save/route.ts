import { NextRequest, NextResponse } from 'next/server'

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
    
    // For now, just validate the input and return success
    // In a real implementation, this would save to Supabase
    const mockProfile = {
      user_id: userId,
      name: profileData.role ? `${profileData.role}${profileData.company ? ` at ${profileData.company}` : ''}` : 'Professional',
      interests: profileData.interests || [],
      career_goals: profileData.objectives?.[0],
      mentorship_pref: profileData.seeking?.includes('Mentor') ? 'seeking' : 
                      profileData.objectives?.includes('Mentor Others') ? 'offering' : 'none',
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
      }
    }
    
    return NextResponse.json({
      success: true,
      profile: mockProfile
    })
    
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
