import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { insertRoomMemberSchema } from '../../../../shared/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = insertRoomMemberSchema.parse(body)
    
    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('room_members')
      .select('*')
      .eq('room_id', validatedData.room_id)
      .eq('user_id', validatedData.user_id)
      .single()
    
    if (existingMember) {
      return NextResponse.json(
        { message: 'User already in room' },
        { status: 200 }
      )
    }
    
    // Add user to room
    const { data: membership, error } = await supabase
      .from('room_members')
      .insert(validatedData)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    return NextResponse.json(membership, { status: 201 })
  } catch (error) {
    console.error('Error joining room:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid join data provided' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    )
  }
}
