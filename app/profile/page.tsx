'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, MapPin, Building, Globe, Linkedin, Mail } from 'lucide-react'

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
              {profile?.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
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
                  {profile?.name || 'Your Name'}
                </h2>
                {profile?.headline && (
                  <p className="text-lg text-lunar mb-4">{profile.headline}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-lunar">
                  {profile?.contact_prefs?.role && profile?.contact_prefs?.company && (
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{profile.contact_prefs.role} at {profile.contact_prefs.company}</span>
                    </div>
                  )}
                  {profile?.contact_prefs?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.contact_prefs.location}</span>
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
              
              {profile?.contact_prefs?.skills && profile.contact_prefs.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.contact_prefs.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="bg-lunar/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.contact_prefs?.industries && profile.contact_prefs.industries.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Industries</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.contact_prefs.industries.map((industry: string) => (
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
              {profile?.contact_prefs?.objectives && profile.contact_prefs.objectives.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Objectives</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.contact_prefs.objectives.map((objective: string) => (
                      <Badge key={objective} variant="outline" className="bg-inkwell/10">
                        {objective}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.contact_prefs?.seeking && profile.contact_prefs.seeking.length > 0 && (
                <div>
                  <h4 className="font-medium text-lunar mb-2">Seeking</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.contact_prefs.seeking.map((item: string) => (
                      <Badge key={item} variant="outline" className="bg-lunar/10">
                        {item}
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
