import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Linkedin, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface MutualMatch {
  room_id: string
  user_a: string
  user_b: string
  summary: string
  updated_at: string
  room_name: string
  event_name?: string
  other_profile: {
    user_id: string
    name?: string
    first_name?: string
    last_name?: string
    role?: string
    headline?: string
    profile_photo_url?: string
    linkedin_url?: string
    industries?: string[]
    skills?: string[]
    interests?: string[]
    networking_goals?: string[]
  }
}

export default async function ConnectionsPage() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch mutual matches for the current user
  const { data: mutualMatches } = await supabase
    .from('match_synergy')
    .select(`
      room_id,
      user_a,
      user_b,
      summary,
      updated_at,
      rooms!inner(name, events(name))
    `)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  // Get the other user's profile for each match
  const connections: MutualMatch[] = []
  
  if (mutualMatches) {
    for (const match of mutualMatches) {
      const otherUserId = match.user_a === user.id ? match.user_b : match.user_a
      
      const { data: otherProfile } = await supabase
        .from('profiles')
        .select('user_id, name, first_name, last_name, role, headline, profile_photo_url, linkedin_url, industries, skills, interests, networking_goals')
        .eq('user_id', otherUserId)
        .single()

      if (otherProfile) {
        connections.push({
          ...match,
          room_name: Array.isArray(match.rooms) ? match.rooms[0]?.name : (match.rooms as any)?.name,
          event_name: Array.isArray(match.rooms) ? match.rooms[0]?.events?.name : (match.rooms as any)?.events?.name,
          other_profile: otherProfile
        })
      }
    }
  }

  const formatDate = (dateString: string) => {
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
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/home">
              <Button variant="ghost" className="text-lunar hover:text-inkwell">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Connections
            </h1>
            <p className="text-lunar">
              People you've mutually matched with across networking events
            </p>
          </div>

          {/* Connections List */}
          {connections.length > 0 ? (
            <div className="space-y-6">
              {connections.map((connection) => {
                const otherProfile = connection.other_profile
                const displayName = otherProfile.name || 
                  `${otherProfile.first_name || ''} ${otherProfile.last_name || ''}`.trim() || 
                  'Anonymous'

                return (
                  <Card key={`${connection.room_id}-${otherProfile.user_id}`} className="bg-white shadow-md border rounded-2xl">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {otherProfile.profile_photo_url && (
                              <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img 
                                  src={otherProfile.profile_photo_url} 
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-gray-800">
                                {displayName}
                              </CardTitle>
                              {otherProfile.role && (
                                <p className="text-sm text-lunar">{otherProfile.role}</p>
                              )}
                              {otherProfile.headline && (
                                <p className="text-xs text-lunar mt-1">{otherProfile.headline}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-xs text-lunar">
                            <span>Connected in {connection.room_name}</span>
                            {connection.event_name && (
                              <span> • {connection.event_name}</span>
                            )}
                            <span> • {formatDate(connection.updated_at)}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                          Mutual Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* AI-Generated Synergy */}
                        <div className="bg-aulait/10 rounded-lg p-4">
                          <h4 className="font-medium text-inkwell mb-2">Why you matched:</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {connection.summary}
                          </p>
                        </div>

                        {/* Profile Tags */}
                        <div className="space-y-3">
                          {otherProfile.industries && otherProfile.industries.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-lunar mb-1">Industries</h5>
                              <div className="flex flex-wrap gap-1">
                                {otherProfile.industries.slice(0, 3).map((industry) => (
                                  <Badge key={industry} variant="secondary" className="text-xs">
                                    {industry}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {otherProfile.skills && otherProfile.skills.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-lunar mb-1">Skills</h5>
                              <div className="flex flex-wrap gap-1">
                                {otherProfile.skills.slice(0, 4).map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {otherProfile.interests && otherProfile.interests.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-lunar mb-1">Interests</h5>
                              <div className="flex flex-wrap gap-1">
                                {otherProfile.interests.slice(0, 3).map((interest) => (
                                  <Badge key={interest} className="bg-creme/50 text-inkwell text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                          <Button 
                            className="flex-1 bg-inkwell hover:bg-inkwell/90 text-white"
                            onClick={() => {
                              // TODO: Implement chat functionality
                              console.log('Open chat with:', otherProfile.user_id)
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          
                          {otherProfile.linkedin_url && (
                            <Button 
                              variant="outline"
                              className="flex-1"
                              onClick={() => window.open(otherProfile.linkedin_url, '_blank')}
                            >
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="bg-white shadow-md border rounded-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-lunar/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-lunar" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No connections yet
                </h3>
                <p className="text-lunar mb-6">
                  Start matching in networking rooms to build your professional connections.
                </p>
                <Link href="/events">
                  <Button className="bg-inkwell hover:bg-inkwell/90 text-white">
                    Browse Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
