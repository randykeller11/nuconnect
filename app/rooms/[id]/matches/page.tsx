import { supabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
        <div className="space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center gap-4">
            <Link href={`/rooms/${id}`}>
              <Button variant="ghost" size="sm" className="text-lunar hover:text-inkwell">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Room
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Matches in {room.name}</h1>
          </div>

          {/* Coming Soon Card */}
          <Card className="bg-white rounded-2xl shadow-md border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Matching Feature Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-lunar/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Anonymous Matching
                </h3>
                <p className="text-lunar mb-4">
                  We're building an intelligent matching system that will help you discover 
                  meaningful connections based on shared interests, complementary skills, 
                  and aligned networking goals.
                </p>
                <p className="text-sm text-lunar">
                  Check back soon for this exciting feature!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
