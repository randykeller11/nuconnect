'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Settings, Edit, Users, Calendar } from 'lucide-react'

interface HomeHeroProps {
  user?: {
    name?: string
    profile_photo_url?: string
    email?: string
  }
}

export function HomeHero({ user }: HomeHeroProps) {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-br from-white to-aulait/30 border-b border-lunar/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt={user.name || 'Profile'}
                className="w-16 h-16 rounded-full object-cover border-2 border-inkwell/10"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-aulait">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-inkwell">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-lg text-lunar mt-1">Ready to make new connections?</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push('/profile/edit')}
              className="bg-inkwell text-aulait hover:bg-lunar flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Update Profile
            </Button>
            <Button
              onClick={() => router.push('/rooms')}
              variant="outline"
              className="border-inkwell text-inkwell hover:bg-inkwell hover:text-aulait flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Find Matches
            </Button>
            <Button
              onClick={() => router.push('/events')}
              variant="outline"
              className="border-lunar text-lunar hover:bg-lunar hover:text-aulait flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Join Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
