import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Restrict to Randy Keller only
  if (user.email !== 'randykeller1193@gmail.com') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { enabled } = await req.json()

  if (enabled) {
    // Enable demo mode - trigger synergy generation
    await generateDemoMatches(supabase, user.id)
  }

  return NextResponse.json({ enabled })
}

async function generateDemoMatches(supabase: any, userId: string) {
  try {
    // Get all rooms the user is a member of
    const { data: userRooms } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', userId)

    if (!userRooms?.length) return

    // For each room, create some demo matches
    for (const { room_id } of userRooms) {
      // Get other members in the room
      const { data: otherMembers } = await supabase
        .from('room_members')
        .select('user_id')
        .eq('room_id', room_id)
        .neq('user_id', userId)
        .limit(3) // Limit to 3 demo matches per room

      if (!otherMembers?.length) continue

      // Get profiles for synergy generation
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', [userId, ...otherMembers.map((m: any) => m.user_id)])

      const userProfile = profiles?.find((p: any) => p.user_id === userId)
      const otherProfiles = profiles?.filter((p: any) => p.user_id !== userId)

      if (!userProfile || !otherProfiles?.length) continue

      // Create demo matches with synergy
      for (const otherProfile of otherProfiles) {
        const synergy = await generateSynergy(userProfile, otherProfile, room_id)
        
        // Create mutual match entries
        const userA = userId < otherProfile.user_id ? userId : otherProfile.user_id
        const userB = userId < otherProfile.user_id ? otherProfile.user_id : userId

        // Insert into match_synergy table
        await supabase
          .from('match_synergy')
          .upsert({
            room_id,
            user_a: userA,
            user_b: userB,
            summary: synergy,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'room_id,user_a,user_b'
          })

        // Also create the interaction records to simulate mutual likes
        await supabase
          .from('match_interactions')
          .upsert([
            {
              room_id,
              user_id: userId,
              target_user_id: otherProfile.user_id,
              action: 'like'
            },
            {
              room_id,
              user_id: otherProfile.user_id,
              target_user_id: userId,
              action: 'like'
            }
          ], {
            onConflict: 'room_id,user_id,target_user_id'
          })
      }
    }
  } catch (error) {
    console.error('Demo match generation failed:', error)
  }
}

async function generateSynergy(userProfile: any, otherProfile: any, roomId: string): Promise<string> {
  // Try OpenRouter first
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const { explainSynergyLLM } = await import('@/lib/ai/openrouter')
      const { topOverlap } = await import('@/lib/matching/score')
      
      const overlaps = {
        interests: topOverlap(userProfile.interests, otherProfile.interests),
        skills: topOverlap(userProfile.skills, otherProfile.skills),
        industries: topOverlap(userProfile.industries, otherProfile.industries)
      }

      const synergy = await explainSynergyLLM({
        me: {
          industries: userProfile?.industries ?? [],
          skills: userProfile?.skills ?? [],
          interests: userProfile?.interests ?? [],
          networking_goals: userProfile?.networking_goals ?? [],
          role: userProfile?.role ?? null,
          headline: userProfile?.headline ?? null,
        },
        other: {
          industries: otherProfile?.industries ?? [],
          skills: otherProfile?.skills ?? [],
          interests: otherProfile?.interests ?? [],
          networking_goals: otherProfile?.networking_goals ?? [],
          role: otherProfile?.role ?? null,
          headline: otherProfile?.headline ?? null,
        },
        overlaps,
        roomContext: { room: 'Demo Room' }
      })

      if (synergy && synergy.length > 20) {
        return synergy
      }
    } catch (error) {
      console.error('OpenRouter synergy generation failed:', error)
    }
  }

  // Fallback to rule-based synergy
  const sharedInterests = userProfile?.interests?.filter((i: string) => 
    otherProfile?.interests?.some((oi: string) => oi.toLowerCase() === i.toLowerCase())
  ) || []
  
  const sharedSkills = userProfile?.skills?.filter((s: string) => 
    otherProfile?.skills?.some((os: string) => os.toLowerCase() === s.toLowerCase())
  ) || []

  if (sharedInterests.length > 0 && sharedSkills.length > 0) {
    return `You both share interests in ${sharedInterests[0]} and have complementary ${sharedSkills[0]} skills. This creates excellent potential for collaboration and knowledge sharing. Consider exploring joint projects or mentorship opportunities.`
  } else if (sharedInterests.length > 0) {
    return `Both passionate about ${sharedInterests[0]}, you have great potential for collaboration. Your different skill sets could complement each other well in projects related to this shared interest.`
  } else if (sharedSkills.length > 0) {
    return `Your shared expertise in ${sharedSkills[0]} could lead to interesting discussions and potential collaboration. Consider sharing best practices and exploring joint opportunities in this area.`
  } else {
    return `Your complementary backgrounds create interesting opportunities for cross-functional collaboration. The diversity in your experiences could lead to innovative solutions and valuable professional connections.`
  }
}
