'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Users, Calendar, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DemoSelection() {
  const router = useRouter()

  const demoOptions = [
    {
      id: 'onboarding',
      title: 'Profile Setup Demo',
      description: 'Experience our streamlined onboarding process',
      icon: Users,
      color: 'bg-inkwell',
      path: '/onboarding'
    },
    {
      id: 'rooms',
      title: 'Networking Rooms',
      description: 'Browse and join active networking rooms',
      icon: Calendar,
      color: 'bg-lunar',
      path: '/rooms'
    },
    {
      id: 'home',
      title: 'Dashboard Experience',
      description: 'See your personalized networking dashboard',
      icon: Zap,
      color: 'bg-creme',
      path: '/home'
    }
  ]

  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-inkwell mb-4">Choose Your Demo Experience</h1>
          <p className="text-xl text-lunar max-w-2xl mx-auto">
            Explore different aspects of NuConnect's professional networking platform
          </p>
          <Badge className="mt-4 bg-inkwell text-aulait">
            Demo Environment
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card 
                key={option.id}
                className="bg-white shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => router.push(option.path)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-aulait" />
                  </div>
                  <CardTitle className="text-inkwell text-xl group-hover:text-lunar transition-colors">
                    {option.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lunar mb-6">
                    {option.description}
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait group-hover:scale-105 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(option.path)
                    }}
                  >
                    Try Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-lunar mb-4">
            Need help getting started?
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/auth')}
            className="border-inkwell text-inkwell hover:bg-inkwell hover:text-aulait"
          >
            Sign In to Full Platform
          </Button>
        </div>
      </div>
    </div>
  )
}
