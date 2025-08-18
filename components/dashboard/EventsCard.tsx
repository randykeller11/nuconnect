'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EventWithRooms {
  id: string
  name: string
  summary?: string | null
  starts_at?: string | null
  city?: string | null
  participants_count?: number | null
  rooms: Array<{
    id: string
    name: string
    slug: string
    tagline?: string | null
    topic?: string | null
    member_count: number
  }>
}

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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-3">
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-md border text-center">
            <p className="text-lunar">No upcoming events</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl p-4 shadow-md border space-y-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">{event.name}</h3>
                
                <div className="flex items-center gap-3 text-sm text-lunar">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.starts_at)}
                  </div>
                  {event.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.city}
                    </div>
                  )}
                  {event.participants_count && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.participants_count}
                    </div>
                  )}
                </div>
                
                {event.summary && (
                  <p className="text-sm text-lunar line-clamp-2">{event.summary}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline" size="sm">
                    View Event →
                  </Button>
                </Link>
              </div>

              {/* Top rooms preview */}
              {event.rooms.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium text-lunar">Featured Rooms:</h4>
                  <div className="space-y-1">
                    {event.rooms.slice(0, 2).map((room) => (
                      <div key={room.id} className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium text-inkwell">{room.name}</div>
                          {room.tagline && (
                            <div className="text-lunar text-xs">{room.tagline}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-lunar">{room.member_count} members</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleJoinRoom(room.id)}
                          >
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
    </div>
  )
}
