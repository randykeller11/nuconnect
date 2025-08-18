import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { EventRow, RoomRow } from '@/lib/types/events'

export async function GET() {
  try {
    const sb = await createSupabaseServerClient()
    
    // Get events in the future (or all; MVP keeps it simple)
    const { data: events, error: eventsError } = await sb
      .from('events')
      .select('*')
      .order('starts_at', { ascending: true })

    if (eventsError) {
      console.error('Error fetching events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    if (!events?.length) {
      return NextResponse.json({ events: [] })
    }

    // Load rooms by event in one round-trip
    const { data: rooms, error: roomsError } = await sb
      .from('rooms')
      .select('*')
      .in('event_id', events.map(e => e.id))

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError)
      return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
    }

    const roomsByEvent = new Map<string, RoomRow[]>()
    rooms?.forEach(r => {
      if (!r.event_id) return
      const arr = roomsByEvent.get(r.event_id) ?? []
      arr.push(r)
      roomsByEvent.set(r.event_id, arr)
    })

    const payload = events.map(e => ({
      ...e,
      rooms: (roomsByEvent.get(e.id) ?? []).sort((a, b) => b.member_count - a.member_count)
    }))

    return NextResponse.json({ events: payload })
  } catch (error) {
    console.error('Unexpected error in /api/events/list:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
