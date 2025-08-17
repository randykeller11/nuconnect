import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RoomsClient from './RoomsClient'

export default async function RoomsPage() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch all public rooms
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_public', true)
    .order('member_count', { ascending: false })

  return (
    <div className="min-h-screen bg-aulait">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-inkwell mb-2">Available Rooms</h1>
          <p className="text-lunar">Join a room to start discovering meaningful connections</p>
        </div>
        
        <RoomsClient rooms={rooms || []} />
      </div>
    </div>
  )
}
