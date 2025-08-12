'use client'

import React, { useEffect, useState } from 'react'
import { HomeHero } from '@/components/home/HomeHero'
import { ProfileStrengthCard } from '@/components/home/ProfileStrengthCard'
import { RoomsGrid } from '@/components/home/RoomsGrid'
import { ConnectionsList } from '@/components/home/ConnectionsList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardData {
  profileStrength: any
  upcomingRooms: any[]
  recentConnections: any[]
  user: any
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/me/dashboard')
        if (response.ok) {
          const dashboardData = await response.json()
          setData(dashboardData)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-aulait">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-aulait">
      <HomeHero user={data?.user} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Strength */}
            {data?.profileStrength && (
              <ProfileStrengthCard strength={data.profileStrength} />
            )}

            {/* Upcoming Rooms */}
            <div>
              <h2 className="text-2xl font-bold text-inkwell mb-6">Upcoming Events & Rooms</h2>
              {data?.upcomingRooms ? (
                <RoomsGrid rooms={data.upcomingRooms} />
              ) : (
                <Card className="bg-white shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-lunar">No upcoming rooms available</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Networking Stats */}
            <Card className="bg-white shadow-xl border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-inkwell">Your Networking Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-inkwell mb-1">
                      {data?.recentConnections?.length || 0}
                    </div>
                    <div className="text-sm text-lunar">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-lunar mb-1">
                      {data?.upcomingRooms?.length || 0}
                    </div>
                    <div className="text-sm text-lunar">Active Rooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-creme mb-1">
                      {data?.profileStrength?.score || 0}%
                    </div>
                    <div className="text-sm text-lunar">Profile Strength</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-inkwell mb-6">Recent Connections</h2>
              {data?.recentConnections ? (
                <ConnectionsList connections={data.recentConnections} />
              ) : (
                <Card className="bg-white shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-lunar">No connections yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
