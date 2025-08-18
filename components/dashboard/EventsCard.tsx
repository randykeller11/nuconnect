'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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

interface RoomMatchingStatus {
  [roomId: string]: {
    completed: boolean
    checking: boolean
  }
}

export default function EventsCard({ events }: EventsCardProps) {
  const router = useRouter()
  const [roomStatuses, setRoomStatuses] = useState<RoomMatchingStatus>({})

  // Check matching status for all rooms when component mounts
  useEffect(() => {
    const checkAllRoomStatuses = async () => {
      const allRooms = events.flatMap(event => event.rooms)
      
      for (const room of allRooms) {
        setRoomStatuses(prev => ({
          ...prev,
          [room.id]: { completed: false, checking: true }
        }))

        try {
          const res = await fetch('/api/matches/completed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId: room.id })
          })
          
          if (res.ok) {
            const data = await res.json()
            setRoomStatuses(prev => ({
              ...prev,
              [room.id]: { completed: data.completed, checking: false }
            }))
          } else {
            setRoomStatuses(prev => ({
              ...prev,
              [room.id]: { completed: false, checking: false }
            }))
          }
        } catch (error) {
          console.error('Failed to check matching status for room:', room.id, error)
          setRoomStatuses(prev => ({
            ...prev,
            [room.id]: { completed: false, checking: false }
          }))
        }
      }
    }

    if (events.length > 0) {
      checkAllRoomStatuses()
    }
  }, [events])

  const handleJoinRoom = async (roomId: string) => {
    const status = roomStatuses[roomId]
    
    // If matching is completed, go to room page, otherwise go to matches
    if (status?.completed) {
      router.push(`/rooms/${roomId}`)
    } else {
      try {
        const res = await fetch('/api/rooms/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId })
        })
        
        if (res.ok) {
          router.push(`/rooms/${roomId}/matches`)
        }
      } catch (error) {
        console.error('Failed to join room:', error)
      }
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
                    {event.rooms.slice(0, 2).map((room) => {
                      const status = roomStatuses[room.id]
                      const isChecking = status?.checking ?? true
                      const isCompleted = status?.completed ?? false
                      
                      return (
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
                              disabled={isChecking}
                              className="disabled:opacity-50"
                            >
                              {isChecking 
                                ? 'Checking...' 
                                : isCompleted 
                                  ? 'View Room' 
                                  : 'Join'
                              }
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
    </div>
  )
}
