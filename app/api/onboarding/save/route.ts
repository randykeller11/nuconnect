import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
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
    
    // Only add fields that have values
    if (profileData.role || profileData.company) {
      profileToSave.name = profileData.role ? 
        `${profileData.role}${profileData.company ? ` at ${profileData.company}` : ''}` : 
        'Professional'
    }
    
    if (profileData.interests && profileData.interests.length > 0) {
      profileToSave.interests = profileData.interests
    }
    
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
    
    return NextResponse.json({
      success: true,
      profile: profile
    })
    
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
