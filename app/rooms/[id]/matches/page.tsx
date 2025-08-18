import { supabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Deck from '@/components/match/Deck'

interface MatchesPageProps {
  params: Promise<{ id: string }>
}

export default async function MatchesPage({ params }: MatchesPageProps) {
  const { id } = await params
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch room details
  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single()

  if (!room) {
    notFound()
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from('room_members')
    .select('*')
    .eq('room_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) {
    redirect(`/rooms/${id}`)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/rooms/${id}`}>
              <Button variant="ghost" size="sm" className="text-lunar hover:text-inkwell">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Room
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Discover Connections
            </h1>
            <p className="text-lunar">
              Swipe through potential matches in {room.name}
            </p>
            <div className="text-xs text-lunar/70 mt-2">
              Use ← to skip, → to connect, or click the buttons
            </div>
          </div>

          {/* Anonymous Match Deck */}
          <Deck roomId={id} />
        </div>
      </div>
    </div>
  )
}
