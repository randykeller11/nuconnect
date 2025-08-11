'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/lib/hooks/use-toast'
import { Calendar, Users, MapPin } from 'lucide-react'

interface Event {
  id: string
  name: string
  description: string
  location: string
  date_time: string
  participant_count?: number
}

interface MatchRoom {
  id: string
  name: string
  description: string
  event_id: string
  member_count?: number
  visibility: 'public' | 'private'
}

export default function RoomsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [rooms, setRooms] = useState<MatchRoom[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage for demo
    const userData = localStorage.getItem('nuconnect_user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    fetchEventsAndRooms()
  }, [])

  const fetchEventsAndRooms = async () => {
    try {
      // For demo, we'll use mock data
      // In production, these would be API calls
      setEvents([
        {
          id: 'event-1',
          name: 'NuConnect Demo Night',
          description: 'Internal demo and networking event',
          location: 'Chicago, IL',
          date_time: new Date().toISOString(),
          participant_count: 25
        },
        {
          id: 'event-2',
          name: 'Tech Networking Meetup',
          description: 'Monthly tech professional networking',
          location: 'San Francisco, CA',
          date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          participant_count: 42
        }
      ])
      
      setRooms([
        {
          id: 'room-1',
          name: 'AI Enthusiasts',
          description: 'Connect with fellow AI professionals and enthusiasts',
          event_id: 'event-1',
          member_count: 12,
          visibility: 'public'
        },
        {
          id: 'room-2',
          name: 'Startup Founders',
          description: 'Network with other entrepreneurs and startup founders',
          event_id: 'event-1',
          member_count: 8,
          visibility: 'public'
        },
        {
          id: 'room-3',
          name: 'Climate Tech',
          description: 'Professionals working on climate solutions',
          event_id: 'event-2',
          member_count: 15,
          visibility: 'public'
        }
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load events and rooms.',
        variant: 'destructive'
      })
    }
  }

  const handleJoinRoom = async (roomId: string) => {
    if (!user) return
    
    setLoading(true)
    
    try {
      // For demo, we'll simulate joining and redirect
      toast({
        title: 'Joined Room!',
        description: 'You have successfully joined the networking room.'
      })
      
      // Redirect to the room page
      router.push(`/rooms/${roomId}`)
    } catch (error) {
      console.error('Error joining room:', error)
      toast({
        title: 'Error',
        description: 'Failed to join room. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-aulait flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-inkwell/30 border-t-inkwell rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lunar">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-inkwell mb-4">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xl text-lunar">
            Discover networking events and connect with professionals
          </p>
        </div>

        {/* User Interests */}
        <Card className="mb-8 bg-white shadow-lg border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-inkwell">Your Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.interests?.map((interest: string) => (
                <Badge key={interest} className="bg-inkwell/10 text-inkwell">
                  {interest}
                </Badge>
              ))}
            </div>
            <p className="text-lunar mt-2">
              Career Goal: <span className="font-medium capitalize">
                {user.careerGoals?.replace('-', ' ')}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-inkwell mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-inkwell">{event.name}</CardTitle>
                  <p className="text-lunar">{event.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-lunar">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date_time)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.participant_count} participants
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Match Rooms Section */}
        <div>
          <h2 className="text-2xl font-bold text-inkwell mb-6">Available Match Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-inkwell">{room.name}</CardTitle>
                  <p className="text-lunar text-sm">{room.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-lunar">
                      <Users className="w-4 h-4" />
                      {room.member_count} members
                    </div>
                    <Badge variant="outline" className="border-creme text-creme">
                      {room.visibility}
                    </Badge>
                  </div>
                  <PrimaryButton
                    onClick={() => handleJoinRoom(room.id)}
                    loading={loading}
                    className="w-full"
                  >
                    Join Room
                  </PrimaryButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
