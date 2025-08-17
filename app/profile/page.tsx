'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, MapPin, Building, Globe, Linkedin, Mail } from 'lucide-react'
import { getAvatarUrl } from '@/lib/storage'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/me/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data.profile)
        } else {
          console.error('Profile API error:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-aulait py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-inkwell">Your Profile</h1>
          <Button
            onClick={() => router.push('/profile/edit')}
            className="bg-inkwell text-aulait hover:bg-lunar flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {profile?.profile_photo_url || profile?.avatar_url ? (
                <img
                  src={profile.profile_photo_url || getAvatarUrl(profile.avatar_url) || ''}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-aulait">
                    {profile?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-inkwell mb-2">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}` 
                    : profile?.name || 'Your Name'}
                </h2>
                {profile?.bio && (
                  <p className="text-lg text-lunar mb-4">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-lunar">
                  {profile?.role && (
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{profile.role}</span>
                    </div>
                  )}
                </div>
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
            </CardContent>
          </Card>

          {/* Networking Intent */}
          <Card className="bg-white shadow-xl border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-inkwell">Networking Intent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.networking_goals && profile.networking_goals.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Networking Goals</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.networking_goals.map((goal: string) => (
                      <Badge key={goal} variant="outline" className="bg-inkwell/10">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.connection_preferences && profile.connection_preferences.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Who You Want to Meet</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.connection_preferences.map((pref: string) => (
                      <Badge key={pref} variant="outline" className="bg-lunar/10">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.mentorship_pref && profile.mentorship_pref !== 'none' && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Mentorship</h4>
                  <Badge variant="outline" className="bg-creme/10">
                    {profile.mentorship_pref === 'seeking' ? 'Seeking Mentor' :
                     profile.mentorship_pref === 'offering' ? 'Offering Mentorship' :
                     'Both Seeking & Offering'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
