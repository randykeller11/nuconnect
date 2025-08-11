import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { insertMatchRoomSchema } from '../../../../shared/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = insertMatchRoomSchema.parse(body)
    
    // Create the match room
    const { data: room, error } = await supabase
      .from('match_rooms')
      .insert(validatedData)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid room data provided' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}
