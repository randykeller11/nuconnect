import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { roomId } = await req.json()
    const sb = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await sb.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is already a member
    const { data: existingMember } = await sb
      .from('room_members')
      .select('*')
      .eq('room_id', roomId)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ message: 'Already a member' })
    }

    // Add user to room
    const { error: insertError } = await sb
      .from('room_members')
      .insert({
        room_id: roomId,
        user_id: user.id,
        joined_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error joining room:', insertError)
      return NextResponse.json({ error: 'Failed to join room' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Successfully joined room' })
  } catch (error) {
    console.error('Unexpected error in /api/rooms/join:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
