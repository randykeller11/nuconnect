import { supabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, Tag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import RoomClient from './RoomClient'

interface RoomPageProps {
  params: Promise<{ id: string }>
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch room details with event context
  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single()

  if (!room) {
    notFound()
  }

  // Fetch event details if room has event_id
  let event = null
  if (room.event_id) {
    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .eq('id', room.event_id)
      .single()
    event = eventData
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from('room_members')
    .select('*')
    .eq('room_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const isMember = !!membership

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Breadcrumb and Back Navigation */}
          {event && (
            <div className="flex items-center gap-2 text-sm text-lunar">
              <Link href="/events" className="hover:text-inkwell">
                Events
              </Link>
              <span>·</span>
              <Link href={`/events/${event.id}`} className="hover:text-inkwell">
                {event.name}
              </Link>
              <span>·</span>
              <span className="text-inkwell">{room.name}</span>
            </div>
          )}

          {/* Room Header */}
          <Card className="bg-white rounded-2xl shadow-sm border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl font-bold text-inkwell">
                      {room.name}
                    </CardTitle>
                    {room.topic && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4 text-lunar" />
                        <span className="px-3 py-1 bg-aulait/40 text-inkwell text-sm rounded-full">
                          {room.topic}
                        </span>
                      </div>
                    )}
                  </div>

                  {room.tagline && (
                    <p className="text-lg text-lunar">{room.tagline}</p>
                  )}

                  {/* Event Context */}
                  {event && (
                    <div className="flex flex-wrap items-center gap-4 text-sm text-lunar bg-aulait/20 rounded-lg p-3">
                      <span className="font-medium text-inkwell">Part of:</span>
                      <span className="font-medium">{event.name}</span>
                      {event.city && (
                        <>
                          <span>·</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.city}
                          </div>
                        </>
                      )}
                      {event.starts_at && (
                        <>
                          <span>·</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(event.starts_at)}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-lunar">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{room.member_count} members</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {event && (
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Event
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>


          {/* Desktop Layout with Better Spacing */}
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Room Content */}
              <RoomClient room={room} isMember={isMember} />
            </div>
            
            <div className="space-y-4">
              {/* What to Expect */}
              <Card className="bg-white rounded-2xl shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-inkwell">
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-lunar">
                    {room.tagline || 'Connect with like-minded professionals in this focused networking room. Share insights, build relationships, and discover new opportunities.'}
                  </p>
                </CardContent>
              </Card>

              {/* Room Stats */}
              <Card className="bg-white rounded-2xl shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-inkwell">
                    Room Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-lunar">Members</span>
                    <span className="font-medium text-inkwell">{room.member_count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-lunar">Visibility</span>
                    <span className="font-medium text-inkwell">
                      {room.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
