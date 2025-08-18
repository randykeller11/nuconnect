import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sb = await createSupabaseServerClient()
    
    const { data, error } = await sb
      .from('rooms')
      .insert({
        event_id: body.event_id,
        name: body.name,
        slug: body.slug,
        topic: body.topic ?? null,
        tagline: body.tagline ?? null,
        is_public: body.is_public ?? true,
        member_count: 0
      })
      .select('*')
      .single()
    
    if (error) {
      console.error('Error creating room:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ room: data })
  } catch (error) {
    console.error('Unexpected error in /api/admin/rooms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
