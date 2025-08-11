'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Users, Calendar, TrendingUp, Network } from 'lucide-react'
import Link from 'next/link'

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

  useEffect(() => {
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
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-aulait py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-inkwell mb-8">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-aulait py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-inkwell mb-6">
            NuConnect Admin Dashboard
          </h1>
          <p className="text-xl text-lunar max-w-2xl mx-auto">
            Monitor platform usage and manage networking events and connections.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Active Users</CardTitle>
              <Users className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">{userProfiles.length}</div>
              <p className="text-xs text-lunar">
                Registered profiles
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">{events.length}</div>
              <p className="text-xs text-lunar">
                Networking events
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Match Rooms</CardTitle>
              <Network className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">{matchRooms.length}</div>
              <p className="text-xs text-lunar">
                Active rooms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-inkwell">Connections Made</CardTitle>
              <TrendingUp className="h-4 w-4 text-creme" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-inkwell">
                {matchRooms.reduce((sum, room) => sum + room.matchCount, 0)}
              </div>
              <p className="text-xs text-lunar">
                Total matches
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent User Profiles */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-inkwell">Recent User Profiles</CardTitle>
            <CardDescription className="text-lunar">
              Latest professionals joining the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProfiles.length === 0 ? (
              <p className="text-lunar text-center py-8">No user profiles yet.</p>
            ) : (
              <div className="space-y-4">
                {userProfiles.slice(0, 5).map((profile) => (
                  <div key={profile.id} className="border border-lunar/20 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-inkwell">{profile.name}</h3>
                        <p className="text-sm text-lunar">{profile.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-creme text-creme">
                          {new Date(profile.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-inkwell">Interests:</span> 
                        <span className="text-lunar"> {profile.interests.join(', ')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-inkwell">Career Goal:</span> 
                        <span className="text-lunar"> {profile.careerGoals}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Events */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-inkwell">Active Events</CardTitle>
            <CardDescription className="text-lunar">
              Current networking events and participation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-lunar text-center py-8">No active events.</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border border-lunar/20 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-inkwell">{event.name}</h3>
                        <p className="text-sm text-lunar">{event.location}</p>
                        <p className="text-sm text-lunar">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-creme text-creme mb-2">
                          {event.participantCount} participants
                        </Badge>
                        <p className="text-xs text-lunar">
                          {new Date(event.dateTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/">
            <Button className="bg-inkwell text-aulait hover:bg-lunar rounded-2xl px-8 py-3">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
