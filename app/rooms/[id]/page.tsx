import { supabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import RoomClient from './RoomClient'

interface RoomPageProps {
  params: { id: string }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch room details
  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!room) {
    notFound()
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from('room_members')
    .select('*')
    .eq('room_id', params.id)
    .eq('user_id', user.id)
    .maybeSingle()

  const isMember = !!membership

  return (
    <div className="min-h-screen bg-aulait">
      <div className="container mx-auto px-4 py-8">
        <RoomClient room={room} isMember={isMember} />
      </div>
    </div>
  )
}
