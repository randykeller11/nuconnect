'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { EventWithRooms } from '@/lib/types/events'

interface EventsCardProps {
  events: EventWithRooms[]
}

export default function EventsCard({ events }: EventsCardProps) {
  const router = useRouter()

  const handleJoinRoom = async (roomId: string) => {
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId })
      })
      
      if (res.ok) {
        router.push(`/rooms/${roomId}`)
      }
    } catch (error) {
      console.error('Failed to join room:', error)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (!events.length) {
    return (
      <Card className="bg-white shadow-sm border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-inkwell">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lunar text-center py-8">No upcoming events at the moment.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm border-0 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-inkwell">Upcoming Events</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/events')}
            className="text-lunar hover:text-inkwell"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-inkwell">{event.name}</h4>
                <div className="flex items-center gap-4 text-sm text-lunar mt-1">
                  {event.starts_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(event.starts_at)}
                    </div>
                  )}
                  {event.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.city}
                    </div>
                  )}
                  {event.participants_count && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.participants_count}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                View Event
              </Button>
            </div>
            
            {event.summary && (
              <p className="text-sm text-lunar line-clamp-2">{event.summary}</p>
            )}
            
            {event.rooms.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-lunar">Top Rooms:</div>
                <div className="space-y-2">
                  {event.rooms.slice(0, 2).map((room) => (
                    <div key={room.id} className="flex items-center justify-between bg-aulait/20 rounded-lg p-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-inkwell">{room.name}</span>
                          {room.topic && (
                            <Badge variant="outline" className="text-xs bg-aulait/40 text-inkwell">
                              {room.topic}
                            </Badge>
                          )}
                        </div>
                        {room.tagline && (
                          <p className="text-xs text-lunar mt-1">{room.tagline}</p>
                        )}
                        <div className="text-xs text-lunar mt-1">
                          {room.member_count} members
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinRoom(room.id)}
                        className="bg-inkwell text-aulait hover:bg-lunar text-xs px-3 py-1"
                      >
                        Join Room
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
