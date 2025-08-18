import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const sb = await createSupabaseServerClient()
    const roomId = params.id

    const { data: room, error: roomError } = await sb
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'room_not_found' }, { status: 404 })
    }

    let event = null
    if (room.event_id) {
      const { data, error: eventError } = await sb
        .from('events')
        .select('*')
        .eq('id', room.event_id)
        .single()
      
      if (!eventError && data) {
        event = data
      }
    }

    return NextResponse.json({ room, event })
  } catch (error) {
    console.error('Unexpected error in /api/rooms/[id]/summary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
