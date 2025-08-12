import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { matchingHeuristic } from '../../../../../lib/pipeline/match-heuristic'
import { insertMatchSchema } from '../../../../../shared/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { userId } = body
    const resolvedParams = await params
    const roomId = resolvedParams.id
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }
    
    // Get user's profile
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (userError || !userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }
    
    // Get all room members and their profiles
    const { data: roomMembers, error: membersError } = await supabase
      .from('room_members')
      .select(`
        user_id,
        profiles (*)
      `)
      .eq('room_id', roomId)
      .neq('user_id', userId)
    
    if (membersError) {
      throw new Error(`Failed to get room members: ${membersError.message}`)
    }
    
    // Extract profiles from the join
    const candidateProfiles = roomMembers
      ?.map(member => member.profiles)
      .filter(profile => profile !== null) || []
    
    // Check for existing boosts (simplified - in production would query boost_transactions)
    const hasExtraMatches = false // Placeholder
    
    // Generate matches using heuristic
    const matches = matchingHeuristic.rankCandidates(
      userProfile,
      candidateProfiles,
      {
        userId,
        maxMatches: 3,
        includeBoosts: hasExtraMatches
      }
    )
    
    // Store matches in database
    const matchInserts = matches.map(match => ({
      room_id: roomId,
      user_a: userId,
      user_b: match.profile.user_id,
      match_score: match.score / 10, // Normalize to 0-1 range
      shared_topics: match.sharedTopics,
      ai_explanation: match.explanation
    }))
    
    if (matchInserts.length > 0) {
      const { error: insertError } = await supabase
        .from('matches')
        .upsert(matchInserts, {
          onConflict: 'room_id,user_a,user_b'
        })
      
      if (insertError) {
        console.error('Error storing matches:', insertError)
        // Continue anyway - we can still return the matches
      }
    }
    
    return NextResponse.json({
      matches: matches.map(match => ({
        id: `${userId}-${match.profile.user_id}`,
        profile: match.profile,
        score: match.score,
        sharedTopics: match.sharedTopics,
        explanation: match.explanation,
        hasPriorityBoost: match.hasPriorityBoost
      }))
    })
  } catch (error) {
    console.error('Error generating matches:', error)
    return NextResponse.json(
      { error: 'Failed to generate matches' },
      { status: 500 }
    )
  }
}
