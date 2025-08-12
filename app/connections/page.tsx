'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/lib/hooks/use-toast'
import { ArrowLeft, Mail, Linkedin, Phone, Globe, Edit3, Save, X } from 'lucide-react'

interface Connection {
  id: string
  matchId: string
  profile: {
    name: string
    interests: string[]
    career_goals: string
    mentorship_pref: string
  }
  sharedTopics: string[]
  notes?: string
  contactInfo?: {
    email?: string
    linkedin?: string
    phone?: string
    website?: string
  }
  mutualContactShared: boolean
  connectedAt: string
}

function ConnectionsPageContent() {
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])
  const [user, setUser] = useState<any>(null)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
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
    fetchConnections()
  }, [mounted])

  const fetchConnections = async () => {
    try {
      // For demo, we'll use mock connections
      const mockConnections: Connection[] = [
        {
          id: 'conn-1',
          matchId: 'match-1',
          profile: {
            name: 'Sarah Chen',
            interests: ['AI', 'Education', 'Fintech'],
            career_goals: 'find-cofounder',
            mentorship_pref: 'offering'
          },
          sharedTopics: ['AI', 'Fintech'],
          notes: 'Interested in collaborating on AI education platform. Has experience with fintech startups.',
          contactInfo: {
            email: 'sarah.chen@example.com',
            linkedin: 'https://linkedin.com/in/sarahchen',
            phone: '+1 (555) 123-4567'
          },
          mutualContactShared: true,
          connectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'conn-2',
          matchId: 'match-2',
          profile: {
            name: 'Michael Rodriguez',
            interests: ['AI', 'Climate', 'Product'],
            career_goals: 'mentor-others',
            mentorship_pref: 'offering'
          },
          sharedTopics: ['AI'],
          notes: '',
          contactInfo: {
            email: 'michael.r@example.com',
            linkedin: 'https://linkedin.com/in/michaelrodriguez',
            website: 'https://michaelrodriguez.dev'
          },
          mutualContactShared: true,
          connectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      setConnections(mockConnections)
    } catch (error) {
      console.error('Error fetching connections:', error)
      toast({
        title: 'Error',
        description: 'Failed to load connections.',
        variant: 'destructive'
      })
    }
  }

  const handleSaveNotes = async (connectionId: string) => {
    try {
      // Update the connection with new notes
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, notes: noteText }
            : conn
        )
      )
      
      setEditingNotes(null)
      setNoteText('')
      
      toast({
        title: 'Notes Saved',
        description: 'Your notes have been saved successfully.'
      })
    } catch (error) {
      console.error('Error saving notes:', error)
      toast({
        title: 'Error',
        description: 'Failed to save notes.',
        variant: 'destructive'
      })
    }
  }

  const startEditingNotes = (connectionId: string, currentNotes: string) => {
    setEditingNotes(connectionId)
    setNoteText(currentNotes)
  }

  const cancelEditingNotes = () => {
    setEditingNotes(null)
    setNoteText('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-inkwell mb-2">
            Your Connections
          </h1>
          <p className="text-lunar">
            Manage your professional network and keep track of your conversations
          </p>
        </div>

        {/* Connections List */}
        {connections.length > 0 ? (
          <div className="space-y-6">
            {connections.map((connection) => (
              <Card key={connection.id} className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-inkwell">
                        {connection.profile.name}
                      </CardTitle>
                      <p className="text-sm text-lunar capitalize">
                        {connection.profile.career_goals?.replace('-', ' ')} • {connection.profile.mentorship_pref} mentorship
                      </p>
                      <p className="text-xs text-lunar mt-1">
                        Connected {formatDate(connection.connectedAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Shared Topics */}
                    <div>
                      <h4 className="font-medium text-inkwell mb-2">Shared Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {connection.sharedTopics.map((topic) => (
                          <Badge key={topic} className="bg-inkwell/10 text-inkwell">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact Information */}
                    {connection.mutualContactShared && connection.contactInfo && (
                      <div>
                        <h4 className="font-medium text-inkwell mb-2">Contact Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {connection.contactInfo.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-lunar" />
                              <a 
                                href={`mailto:${connection.contactInfo.email}`}
                                className="text-inkwell hover:underline"
                              >
                                {connection.contactInfo.email}
                              </a>
                            </div>
                          )}
                          {connection.contactInfo.linkedin && (
                            <div className="flex items-center gap-2 text-sm">
                              <Linkedin className="w-4 h-4 text-lunar" />
                              <a 
                                href={connection.contactInfo.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-inkwell hover:underline"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                          {connection.contactInfo.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-lunar" />
                              <a 
                                href={`tel:${connection.contactInfo.phone}`}
                                className="text-inkwell hover:underline"
                              >
                                {connection.contactInfo.phone}
                              </a>
                            </div>
                          )}
                          {connection.contactInfo.website && (
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="w-4 h-4 text-lunar" />
                              <a 
                                href={connection.contactInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-inkwell hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes Section */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-inkwell">Notes</h4>
                        {editingNotes !== connection.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingNotes(connection.id, connection.notes || '')}
                            className="text-lunar hover:text-inkwell"
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                      
                      {editingNotes === connection.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add notes about this connection..."
                            className="border-lunar/30 focus:ring-lunar rounded-xl"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveNotes(connection.id)}
                              className="bg-inkwell text-aulait hover:bg-lunar"
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEditingNotes}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-lunar">
                          {connection.notes ? (
                            <p className="whitespace-pre-wrap">{connection.notes}</p>
                          ) : (
                            <p className="italic">No notes yet. Click Edit to add notes about this connection.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-lunar/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-lunar" />
              </div>
              <h3 className="text-xl font-semibold text-inkwell mb-2">
                No connections yet
              </h3>
              <p className="text-lunar mb-6">
                Start networking in match rooms to build your professional connections.
              </p>
              <Button
                onClick={() => router.push('/rooms')}
                className="bg-inkwell text-aulait hover:bg-lunar"
              >
                Explore Rooms
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-aulait flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-inkwell/30 border-t-inkwell rounded-full animate-spin" />
      </div>
    }>
      <ConnectionsPageContent />
    </Suspense>
  )
}
