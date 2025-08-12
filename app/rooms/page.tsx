'use client'

import { useState, useEffect, Suspense } from 'react'
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

function RoomsPageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [rooms, setRooms] = useState<MatchRoom[]>([])
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  // Always call useToast to maintain hook order
  const { toast: toastFn } = useToast()
  
  // Create a safe toast function that only works after mounting
  const toast = (options: any) => {
    if (mounted) {
      toastFn(options)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Get user from localStorage for demo
    const userData = localStorage.getItem('nuconnect_user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    fetchEventsAndRooms()
  }, [mounted])

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
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-xl">
            <span className="text-3xl font-bold text-aulait">N</span>
          </div>
          <h1 className="text-5xl font-bold text-inkwell mb-6 tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-2xl text-lunar max-w-3xl mx-auto">
            Discover networking events and connect with like-minded professionals
          </p>
        </div>

        {/* User Interests */}
        <Card className="mb-12 bg-gradient-to-br from-white to-aulait/20 shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-inkwell/5 to-lunar/5 pb-4">
            <CardTitle className="text-inkwell text-xl">Your Professional Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-inkwell mb-3">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests?.map((interest: string) => (
                  <Badge key={interest} className="bg-gradient-to-r from-inkwell to-lunar text-aulait px-3 py-1 font-medium">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-lunar/20">
              <p className="text-lunar">
                <span className="font-semibold text-inkwell">Career Goal:</span>{' '}
                <span className="font-medium capitalize text-lg">
                  {user.careerGoals?.replace('-', ' ')}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-inkwell mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-white shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-inkwell to-lunar"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-inkwell text-xl">{event.name}</CardTitle>
                  <p className="text-lunar text-base">{event.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-lunar">
                      <div className="w-8 h-8 bg-inkwell/10 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-inkwell" />
                      </div>
                      <span className="font-medium">{formatDate(event.date_time)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lunar">
                      <div className="w-8 h-8 bg-inkwell/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-inkwell" />
                      </div>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lunar">
                      <div className="w-8 h-8 bg-inkwell/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-inkwell" />
                      </div>
                      <span className="font-medium">{event.participant_count} participants</span>
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
              <Card key={room.id} className="bg-white shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                <div className="h-1 bg-gradient-to-r from-creme to-creme/60 group-hover:h-2 transition-all duration-300"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-inkwell text-xl flex items-center gap-2">
                    {room.name}
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </CardTitle>
                  <p className="text-lunar">{room.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-inkwell/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-inkwell" />
                      </div>
                      <span className="font-medium text-lunar">{room.member_count} members</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200 capitalize">
                      {room.visibility}
                    </Badge>
                  </div>
                  <PrimaryButton
                    onClick={() => handleJoinRoom(room.id)}
                    loading={loading}
                    className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
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

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-aulait flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-inkwell/30 border-t-inkwell rounded-full animate-spin" />
      </div>
    }>
      <RoomsPageContent />
    </Suspense>
  )
}
