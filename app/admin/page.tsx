'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Users, Calendar, Mail, Network, Menu, X, Home, Lock } from 'lucide-react'
import Link from 'next/link'

function FloatingMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        onClick={toggleMenu}
        className="w-14 h-14 bg-inkwell/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 text-aulait hover:bg-lunar transition-all duration-200 flex items-center justify-center hover:scale-105"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 overflow-hidden">
          <nav className="py-2">
            <Link 
              href="/"
              className="flex items-center px-4 py-3 text-inkwell hover:bg-creme/10 hover:text-creme transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}

interface UserProfile {
  id: string
  name: string
  email: string
  interests: string[]
  careerGoals: string
  mentorshipPref: string
  createdAt: string
}

interface Event {
  id: string
  name: string
  description: string
  location: string
  dateTime: string
  participantCount: number
}

interface MatchRoom {
  id: string
  name: string
  eventName: string
  memberCount: number
  matchCount: number
  createdAt: string
}

export default function AdminDashboard() {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [matchRooms, setMatchRooms] = useState<MatchRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Check if already authenticated in session storage
    const isAuth = sessionStorage.getItem('nuconnect_admin_authenticated')
    if (isAuth === 'true') {
      setIsAuthenticated(true)
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'NuConnect2025Admin') {
      setIsAuthenticated(true)
      setAuthError('')
      sessionStorage.setItem('nuconnect_admin_authenticated', 'true')
      fetchData()
    } else {
      setAuthError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('nuconnect_admin_authenticated')
    setPassword('')
    setAuthError('')
  }

  const fetchData = async () => {
    try {
      // Mock data for now - will be replaced with real API calls
      setUserProfiles([
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          interests: ['AI', 'Fintech', 'Education'],
          careerGoals: 'find-cofounder',
          mentorshipPref: 'seeking',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael@example.com',
          interests: ['Climate', 'Health', 'Marketing'],
          careerGoals: 'find-mentor',
          mentorshipPref: 'seeking',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ])
      
      setEvents([
        {
          id: '1',
          name: 'Tech Networking Chicago',
          description: 'Monthly tech meetup',
          location: 'Chicago, IL',
          dateTime: new Date().toISOString(),
          participantCount: 45
        },
        {
          id: '2',
          name: 'Startup Founders Meetup',
          description: 'Connect with fellow entrepreneurs',
          location: 'San Francisco, CA',
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          participantCount: 32
        }
      ])
      
      setMatchRooms([
        {
          id: '1',
          name: 'AI Enthusiasts',
          eventName: 'Tech Networking Chicago',
          memberCount: 12,
          matchCount: 8,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Fintech Founders',
          eventName: 'Startup Founders Meetup',
          memberCount: 8,
          matchCount: 5,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-aulait py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-inkwell rounded-full flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-aulait" strokeWidth={2} />
              </div>
              <h1 className="text-3xl font-bold text-inkwell mb-4">
                NuConnect Admin
              </h1>
              <p className="text-lg text-lunar">
                Enter the admin password to access the dashboard
              </p>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full border-lunar/30 focus:ring-lunar rounded-xl h-12"
                  required
                />
              </div>
              {authError && (
                <p className="text-red-600 text-sm text-center">{authError}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-inkwell text-aulait hover:bg-lunar rounded-xl h-12 text-lg font-semibold"
              >
                Access Dashboard
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/">
                <Button className="bg-creme text-inkwell hover:bg-creme/80 rounded-xl px-6">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-aulait py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inkwell mx-auto"></div>
            <p className="mt-4 text-inkwell">Loading NuConnect admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FloatingMenu />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-inkwell mb-4">
                NuConnect Admin Dashboard
              </h1>
              <p className="text-lg text-lunar">
                Monitor platform usage and manage networking events
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 rounded-xl"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Active Users</CardTitle>
              <Users className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">{userProfiles.length}</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">{events.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Match Rooms</CardTitle>
              <Network className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">{matchRooms.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Total Matches</CardTitle>
              <Mail className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">
                {matchRooms.reduce((sum, room) => sum + room.matchCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="rounded-xl">
            <TabsTrigger value="users" className="rounded-lg">User Profiles</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg">Events</TabsTrigger>
            <TabsTrigger value="rooms" className="rounded-lg">Match Rooms</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4">
              {userProfiles.length === 0 ? (
                <Card className="rounded-2xl">
                  <CardContent className="pt-6">
                    <p className="text-center text-lunar">No user profiles yet.</p>
                  </CardContent>
                </Card>
              ) : (
                userProfiles.map((profile) => (
                  <Card key={profile.id} className="rounded-2xl border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-inkwell">{profile.name}</CardTitle>
                          <p className="text-sm text-lunar">{profile.email}</p>
                          <div className="mt-2 text-sm text-lunar">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Interests:</span>
                              <span>{profile.interests.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Career Goal:</span>
                              <span>{profile.careerGoals}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Mentorship:</span>
                              <span className="capitalize">{profile.mentorshipPref}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-creme text-creme">
                          {formatDate(profile.createdAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="grid gap-4">
              {events.length === 0 ? (
                <Card className="rounded-2xl">
                  <CardContent className="pt-6">
                    <p className="text-center text-lunar">No events yet.</p>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="rounded-2xl border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-inkwell">{event.name}</CardTitle>
                          <p className="text-sm text-lunar">{event.location}</p>
                          <p className="text-sm text-lunar">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-creme text-creme mb-2">
                            {event.participantCount} participants
                          </Badge>
                          <p className="text-xs text-lunar">
                            {formatDate(event.dateTime)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <div className="grid gap-4">
              {matchRooms.length === 0 ? (
                <Card className="rounded-2xl">
                  <CardContent className="pt-6">
                    <p className="text-center text-lunar">No match rooms yet.</p>
                  </CardContent>
                </Card>
              ) : (
                matchRooms.map((room) => (
                  <Card key={room.id} className="rounded-2xl border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-inkwell">{room.name}</CardTitle>
                          <p className="text-sm text-lunar">Event: {room.eventName}</p>
                          <div className="mt-2 text-sm text-lunar">
                            <span className="font-medium">{room.memberCount} members</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium">{room.matchCount} matches made</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-creme text-creme">
                          {formatDate(room.createdAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button 
            onClick={fetchData}
            className="bg-creme text-inkwell hover:bg-creme/80 rounded-xl px-8"
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  )
}
