'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { ArrowLeft, Users, Sparkles, Network } from 'lucide-react'

interface Match {
  id: string
  profile: {
    user_id: string
    name: string
    interests: string[]
    career_goals: string
    mentorship_pref: string
  }
  score: number
  sharedTopics: string[]
  explanation: string
  hasPriorityBoost?: boolean
}

interface ContactInfo {
  email?: string
  linkedin?: string
  phone?: string
  website?: string
}

function RoomPageContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [roomId, setRoomId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [user, setUser] = useState<any>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [sharedContacts, setSharedContacts] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  // Create a safe toast function that only works after mounting
  const toast = (options: any) => {
    if (mounted && typeof window !== 'undefined') {
      try {
        const { toast: toastFn } = require('@/lib/hooks/use-toast').useToast()
        toastFn(options)
      } catch (error) {
        console.log('Toast not available:', error)
      }
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Unwrap params promise
    params.then(({ id }) => {
      setRoomId(id)
    })
    
    // Get user from localStorage for demo
    const userData = localStorage.getItem('nuconnect_user')

    if (userData) {
      setUser(JSON.parse(userData))
      setHasJoined(true)
    } else {
      // Fallback: fetch user from server session
      ;(async () => {
        try {
          const res = await fetch('/api/me/profile')
          if (res.ok) {
            const u = await res.json()
            setUser(u)
            setHasJoined(true)
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err)
        }
      })()
    }
  }, [params, mounted])

  const handleGetMatches = async () => {
    if (!user) return
    
    setLoading(true)
    
    try {
      // For demo, we'll use mock matches
      const mockMatches: Match[] = [
        {
          id: 'match-1',
          profile: {
            user_id: 'user-2',
            name: 'Sarah Chen',
            interests: ['AI', 'Education', 'Fintech'],
            career_goals: 'find-cofounder',
            mentorship_pref: 'offering'
          },
          score: 8.5,
          sharedTopics: ['AI', 'Fintech'],
          explanation: 'Great match! You both have shared interests in AI and Fintech and have complementary goals of seeking mentorship and finding co-founders.',
          hasPriorityBoost: false
        },
        {
          id: 'match-2',
          profile: {
            user_id: 'user-3',
            name: 'Michael Rodriguez',
            interests: ['AI', 'Climate', 'Product'],
            career_goals: 'mentor-others',
            mentorship_pref: 'offering'
          },
          score: 7.2,
          sharedTopics: ['AI'],
          explanation: 'Good potential connection. You have AI in common and Michael offers mentorship in your areas of interest.',
          hasPriorityBoost: true
        },
        {
          id: 'match-3',
          profile: {
            user_id: 'user-4',
            name: 'Emma Thompson',
            interests: ['Design', 'Product', 'Education'],
            career_goals: 'find-cofounder',
            mentorship_pref: 'seeking'
          },
          score: 6.8,
          sharedTopics: ['Education'],
          explanation: 'Potential connection based on shared interest in Education and both seeking co-founder opportunities.',
          hasPriorityBoost: false
        }
      ]
      
      setMatches(mockMatches)
      
      toast({
        title: 'Matches Found!',
        description: `Found ${mockMatches.length} potential connections for you.`
      })
    } catch (error) {
      console.error('Error getting matches:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate matches. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleShareContact = async (matchId: string) => {
    if (!user) return
    
    try {
      // For demo, we'll simulate contact sharing
      const contactInfo: ContactInfo = {
        email: user.email,
        linkedin: `https://linkedin.com/in/${user.name.toLowerCase().replace(' ', '')}`,
      }
      
      setSharedContacts(prev => new Set([...prev, matchId]))
      
      toast({
        title: 'Contact Shared!',
        description: 'Your contact information has been shared. You\'ll be notified when they share back.'
      })
    } catch (error) {
      console.error('Error sharing contact:', error)
      toast({
        title: 'Error',
        description: 'Failed to share contact. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const getRoomName = (roomId: string) => {
    const roomNames: Record<string, string> = {
      'room-1': 'AI Enthusiasts',
      'room-2': 'Startup Founders',
      'room-3': 'Climate Tech'
    }
    return roomNames[roomId] || 'Networking Room'
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/rooms')}
            className="text-lunar hover:text-inkwell"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-inkwell rounded-full flex items-center justify-center shadow-lg">
            <Network className="w-8 h-8 text-aulait" />
          </div>
          <h1 className="text-4xl font-bold text-inkwell mb-4 tracking-tight">
            {getRoomName(roomId)}
          </h1>
          <p className="text-xl text-lunar max-w-2xl mx-auto">
            Connect with professionals who share your interests and goals
          </p>
        </div>

        {/* Room Status */}
        {hasJoined && (
          <Card className="mb-12 bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-inkwell to-lunar p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-aulait" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-aulait">You're in the room!</h3>
                    <p className="text-aulait/80">Ready to discover your perfect matches</p>
                  </div>
                </div>
                <PrimaryButton
                  onClick={handleGetMatches}
                  loading={loading}
                  className="bg-aulait text-inkwell hover:bg-white flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Matches
                </PrimaryButton>
              </div>
            </div>
          </Card>
        )}

        {/* Matches */}
        {matches.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-inkwell">Your Matches</h2>
            
            {matches.map((match) => (
              <Card key={match.id} className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center text-aulait font-bold text-lg">
                        {match.profile.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-inkwell flex items-center gap-2 text-xl">
                          {match.profile.name}
                          {match.hasPriorityBoost && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-semibold">
                              ⭐ Boosted
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-lunar capitalize mt-1">
                          {match.profile.career_goals?.replace('-', ' ')} • {match.profile.mentorship_pref} mentorship
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-gradient-to-r from-creme to-creme/80 text-white font-semibold px-3 py-1">
                        {Math.round(match.score * 10)}% match
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Shared Topics */}
                    <div>
                      <h4 className="font-medium text-inkwell mb-2">Shared Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {match.sharedTopics.map((topic) => (
                          <Badge key={topic} className="bg-inkwell/10 text-inkwell">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* AI Explanation */}
                    <div>
                      <h4 className="font-medium text-inkwell mb-2">Why you should connect</h4>
                      <p className="text-lunar">{match.explanation}</p>
                    </div>

                    {/* All Interests */}
                    <div>
                      <h4 className="font-medium text-inkwell mb-2">Their Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {match.profile.interests.map((interest) => (
                          <Badge 
                            key={interest} 
                            variant="outline"
                            className={`${
                              match.sharedTopics.includes(interest)
                                ? 'border-inkwell text-inkwell bg-inkwell/5'
                                : 'border-lunar/30 text-lunar'
                            }`}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact Sharing */}
                    <div className="pt-4 border-t">
                      {sharedContacts.has(match.id) ? (
                        <div className="text-center py-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm text-green-600 font-medium">Contact shared!</p>
                          <p className="text-xs text-lunar">You'll be notified when they share back</p>
                        </div>
                      ) : (
                        <PrimaryButton
                          onClick={() => handleShareContact(match.id)}
                          className="w-full"
                        >
                          Share Contact Info
                        </PrimaryButton>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {matches.length === 0 && hasJoined && (
          <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-inkwell/10 to-lunar/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-inkwell" />
              </div>
              <h3 className="text-2xl font-bold text-inkwell mb-4 tracking-tight">
                Ready to discover your matches?
              </h3>
              <p className="text-lg text-lunar mb-8 max-w-md mx-auto">
                Our AI will analyze your profile and find professionals who share your interests and goals.
              </p>
              <PrimaryButton
                onClick={handleGetMatches}
                loading={loading}
                size="xl"
                className="flex items-center gap-3 mx-auto shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Get Matches
              </PrimaryButton>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-aulait flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-inkwell/30 border-t-inkwell rounded-full animate-spin" />
      </div>
    }>
      <RoomPageContent params={params} />
    </Suspense>
  )
}
