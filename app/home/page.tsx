'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, MessageCircle, Settings, Plus } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const quickActions = [
    {
      title: 'Browse Events',
      description: 'Find networking events near you',
      icon: Calendar,
      action: () => router.push('/events'),
      color: 'bg-inkwell'
    },
    {
      title: 'Join Match Rooms',
      description: 'Connect with professionals in your field',
      icon: Users,
      action: () => router.push('/rooms'),
      color: 'bg-lunar'
    },
    {
      title: 'View Connections',
      description: 'See your networking connections',
      icon: MessageCircle,
      action: () => router.push('/connections'),
      color: 'bg-creme'
    }
  ]

  const recentActivity = [
    {
      type: 'match',
      title: 'New match available',
      description: 'You have 3 new potential connections',
      time: '2 hours ago'
    },
    {
      type: 'event',
      title: 'Event reminder',
      description: 'Tech Networking Meetup starts tomorrow',
      time: '1 day ago'
    },
    {
      type: 'connection',
      title: 'Contact shared',
      description: 'Sarah Johnson shared their contact info',
      time: '2 days ago'
    }
  ]

  return (
    <div className="min-h-screen bg-aulait">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-aulait">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-inkwell">Welcome back!</h1>
                <p className="text-lunar">Ready to make new connections?</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Profile Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-inkwell mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="bg-white shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={action.action}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-aulait" />
                      </div>
                      <div>
                        <CardTitle className="text-inkwell text-lg">{action.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lunar">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Overview */}
            <Card className="bg-white shadow-xl border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-inkwell">Your Networking Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-inkwell mb-1">12</div>
                    <div className="text-sm text-lunar">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-lunar mb-1">3</div>
                    <div className="text-sm text-lunar">Events Joined</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-creme mb-1">8</div>
                    <div className="text-sm text-lunar">Matches Made</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-inkwell mb-6">Recent Activity</h2>
            <Card className="bg-white shadow-xl border-0 rounded-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-lunar/10 last:border-b-0 last:pb-0">
                      <div className="w-2 h-2 bg-inkwell rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-inkwell text-sm">{activity.title}</h4>
                        <p className="text-lunar text-sm mt-1">{activity.description}</p>
                        <p className="text-lunar/60 text-xs mt-2">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Create */}
            <Card className="bg-gradient-to-br from-inkwell to-lunar shadow-xl border-0 rounded-2xl mt-6">
              <CardContent className="p-6 text-center">
                <Plus className="w-8 h-8 text-aulait mx-auto mb-3" />
                <h3 className="font-semibold text-aulait mb-2">Create Event</h3>
                <p className="text-aulait/80 text-sm mb-4">Host your own networking event</p>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-aulait text-aulait hover:bg-aulait hover:text-inkwell"
                  onClick={() => router.push('/events/create')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
