import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { toUserId, roomId } = await req.json()

  // Create or update match record
  const { data: existingMatch } = await supabase
    .from('matches')
    .select('*')
    .eq('room_id', roomId)
    .or(`and(profile_a.eq.${user.id},profile_b.eq.${toUserId}),and(profile_a.eq.${toUserId},profile_b.eq.${user.id})`)
    .maybeSingle()

  let matchId
  if (existingMatch) {
    matchId = existingMatch.id
  } else {
    const { data: newMatch } = await supabase
      .from('matches')
      .insert({
        room_id: roomId,
        profile_a: user.id,
        profile_b: toUserId,
        is_mutual: false
      })
      .select('id')
      .single()
    matchId = newMatch?.id
  }

  // Record contact share
  await supabase
    .from('contacts')
    .upsert({
      match_id: matchId,
      profile_id: user.id,
    })

  // Check if mutual
  const { data: contacts } = await supabase
    .from('contacts')
    .select('profile_id')
    .eq('match_id', matchId)

  const profileIds = new Set(contacts?.map(c => c.profile_id) || [])
  const isMutual = profileIds.has(user.id) && profileIds.has(toUserId)

  if (isMutual) {
    // Update match as mutual
    await supabase
      .from('matches')
      .update({ is_mutual: true })
      .eq('id', matchId)
    
    return NextResponse.json({ mutual: true, message: "It's a match! Contact info exchanged." })
  }

  return NextResponse.json({ mutual: false, message: 'Contact info shared. We'll notify you if they share back.' })
}
