import { supabaseServer } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import EventRoomsClient from './EventRoomsClient'

interface EventPageProps {
  params: { id: string }
}

export default async function EventPage({ params }: EventPageProps) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Fetch rooms for this event
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('event_id', event.id)
    .order('member_count', { ascending: false })

  // Check which rooms user is already a member of
  const { data: memberships } = await supabase
    .from('room_members')
    .select('room_id')
    .eq('user_id', user.id)
    .in('room_id', rooms?.map(r => r.id) || [])

  const memberRoomIds = new Set(memberships?.map(m => m.room_id) || [])

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/events">
              <Button variant="ghost" size="sm" className="text-lunar hover:text-inkwell">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>

          {/* Event Header */}
          <Card className="bg-white rounded-2xl shadow-md border">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                {event.name}
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-aulait/20 px-4 py-2 rounded-full">
                  <Calendar className="w-5 h-5 text-inkwell" />
                  <span className="font-medium text-gray-800">{formatDate(event.starts_at)}</span>
                </div>
                {event.city && (
                  <div className="flex items-center gap-2 bg-aulait/20 px-4 py-2 rounded-full">
                    <MapPin className="w-5 h-5 text-inkwell" />
                    <span className="font-medium text-gray-800">{event.city}</span>
                  </div>
                )}
                {event.participants_count && (
                  <div className="flex items-center gap-2 bg-aulait/20 px-4 py-2 rounded-full">
                    <Users className="w-5 h-5 text-inkwell" />
                    <span className="font-medium text-gray-800">{event.participants_count} expected</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            {event.summary && (
              <CardContent className="pt-0">
                <div className="bg-aulait/10 rounded-lg p-6">
                  <p className="text-gray-700 text-lg leading-relaxed">{event.summary}</p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Rooms Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Networking Rooms</h2>
              <span className="text-sm text-lunar">
                {rooms?.length || 0} room{rooms?.length !== 1 ? 's' : ''} available
              </span>
            </div>
            
            {rooms?.length === 0 ? (
              <Card className="bg-white rounded-2xl shadow-md border">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-lunar/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-lunar" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">No Rooms Yet</h3>
                    <p className="text-lunar">Rooms for this event will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rooms?.map((room) => (
                  <Card key={room.id} className="bg-white rounded-2xl shadow-md border hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl font-bold text-gray-800 leading-tight">
                            {room.name}
                          </CardTitle>
                          {room.topic && (
                            <div className="flex items-center gap-1 ml-2">
                              <Tag className="w-4 h-4 text-lunar" />
                              <span className="px-2 py-1 bg-aulait/40 text-inkwell text-xs rounded-full whitespace-nowrap">
                                {room.topic}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {room.tagline && (
                          <p className="text-lunar leading-relaxed">{room.tagline}</p>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-lunar">
                          <Users className="w-4 h-4" />
                          <span>{room.member_count} member{room.member_count !== 1 ? 's' : ''}</span>
                        </div>
                        
                        <EventRoomsClient 
                          room={room}
                          isMember={memberRoomIds.has(room.id)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
