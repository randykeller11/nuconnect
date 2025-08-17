import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { roomId } = await req.json()
  
  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from('room_members')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .maybeSingle()
  
  if (existingMember) {
    return NextResponse.json({ ok: true, message: 'Already a member' })
  }
  
  // Add user to room
  await supabase
    .from('room_members')
    .insert({ 
      room_id: roomId, 
      user_id: user.id, 
      joined_at: new Date().toISOString() 
    })

  return NextResponse.json({ ok: true })
}
