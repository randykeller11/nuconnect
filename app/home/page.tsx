'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  User, 
  Building, 
  MapPin, 
  Target, 
  Users, 
  Edit,
  Plus,
  CheckCircle
} from 'lucide-react'
import { getAvatarUrl } from '@/lib/storage'

interface Profile {
  name: string
  role?: string
  company?: string
  location?: string
  headline?: string
  interests?: string[]
  career_goals?: string
  contact_prefs?: any
  industries?: string[]
  skills?: string[]
  objectives?: string[]
  seeking?: string[]
  profile_photo_url?: string
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileStrength, setProfileStrength] = useState(0)

  useEffect(() => {
    const initializePage = async () => {
      try {
        const supabase = supabaseBrowser()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          router.replace('/auth')
          return
        }

        setUser(user)

        // Fetch profile data
        const response = await fetch('/api/me/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setProfile(data.profile)
            calculateProfileStrength(data.profile)
          } else {
            // No profile found, redirect to onboarding
            router.replace('/onboarding')
            return
          }
        } else {
          console.error('Failed to fetch profile:', response.status)
          // If profile fetch fails, redirect to onboarding
          router.replace('/onboarding')
          return
        }
      } catch (error) {
        console.error('Failed to initialize home page:', error)
        router.replace('/auth')
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [router])

  const calculateProfileStrength = (profile: Profile) => {
    let strength = 0
    const maxPoints = 100

    // Basic info (30 points)
    if (profile.name) strength += 10
    if (profile.role) strength += 10
    if (profile.company || profile.headline) strength += 10

    // Professional focus (40 points)
    if (profile.industries && profile.industries.length > 0) strength += 15
    if (profile.skills && profile.skills.length >= 3) strength += 15
    else if (profile.skills && profile.skills.length >= 1) strength += 10
    if (profile.interests && profile.interests.length > 0) strength += 10

    // Networking intent (30 points)
    if (profile.objectives && profile.objectives.length > 0) strength += 15
    if (profile.seeking && profile.seeking.length > 0) strength += 15

    setProfileStrength(Math.min(strength, maxPoints))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-aulait flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inkwell mx-auto mb-4"></div>
          <p className="text-lunar font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {profile?.profile_photo_url || profile?.avatar_url ? (
              <img
                src={profile.profile_photo_url || getAvatarUrl(profile.avatar_url) || ''}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-aulait">
                  {profile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-inkwell">
                Welcome back, {profile?.name || 'there'}!
              </h1>
              <p className="text-lunar">
                {profile?.role && profile?.company 
                  ? `${profile.role} at ${profile.company}`
                  : profile?.headline || 'Ready to network?'
                }
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/profile/edit')}
            className="bg-inkwell text-aulait hover:bg-lunar flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Strength Card */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-inkwell flex items-center gap-2">
              <Target className="w-5 h-5" />
              Profile Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Progress value={profileStrength} className="flex-1 h-3" />
              <span className="text-2xl font-bold text-inkwell">{profileStrength}%</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${profile?.name ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={profile?.name ? 'text-inkwell' : 'text-lunar'}>Basic Info</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${profile?.industries?.length ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={profile?.industries?.length ? 'text-inkwell' : 'text-lunar'}>Industries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${profile?.skills?.length ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={profile?.skills?.length ? 'text-inkwell' : 'text-lunar'}>Skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${profile?.objectives?.length ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={profile?.objectives?.length ? 'text-inkwell' : 'text-lunar'}>Goals</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Professional Focus */}
          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-inkwell">Professional Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.industries && profile.industries.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Industries</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.industries.map((industry: string) => (
                      <Badge key={industry} variant="outline" className="bg-creme/10">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.skills && profile.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="bg-lunar/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.interests && profile.interests.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.map((interest: string) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Networking Intent */}
          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-inkwell">Networking Intent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.objectives && profile.objectives.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Objectives</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.objectives.map((objective: string) => (
                      <Badge key={objective} variant="outline" className="bg-inkwell/10">
                        {objective}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.seeking && profile.seeking.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Seeking</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.seeking.map((item: string) => (
                      <Badge key={item} variant="outline" className="bg-lunar/10">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.career_goals && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Career Goals</h4>
                  <p className="text-sm text-inkwell">{profile.career_goals}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl mt-8">
          <CardHeader>
            <CardTitle className="text-inkwell">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push('/rooms')}
                className="bg-inkwell text-aulait hover:bg-lunar flex items-center gap-2 justify-center"
              >
                <Users className="w-4 h-4" />
                Browse Rooms
              </Button>
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
                className="border-lunar text-lunar hover:bg-lunar hover:text-aulait flex items-center gap-2 justify-center"
              >
                <User className="w-4 h-4" />
                View Profile
              </Button>
              <Button
                onClick={() => router.push('/onboarding')}
                variant="outline"
                className="border-creme text-inkwell hover:bg-creme hover:text-aulait flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
