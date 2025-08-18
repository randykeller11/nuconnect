import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sb = await createSupabaseServerClient()
    
    const { data, error } = await sb
      .from('events')
      .insert({
        name: body.name,
        summary: body.summary ?? null,
        starts_at: body.starts_at ?? null,
        city: body.city ?? null,
        participants_count: body.participants_count ?? 0
      })
      .select('*')
      .single()
    
    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ event: data })
  } catch (error) {
    console.error('Unexpected error in /api/admin/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
