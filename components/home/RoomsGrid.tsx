'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, MapPin, ArrowRight } from 'lucide-react'

interface Room {
  id: string
  name: string
  description: string
  memberCount: number
  isLive: boolean
  location?: string
  tags: string[]
}

interface RoomsGridProps {
  rooms: Room[]
}

export function RoomsGrid({ rooms }: RoomsGridProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rooms.map((room) => (
        <Card 
          key={room.id}
          className="bg-white shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
          onClick={() => router.push(`/rooms/${room.id}`)}
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-inkwell text-lg group-hover:text-lunar transition-colors">
                  {room.name}
                </CardTitle>
                <p className="text-lunar text-sm mt-1 line-clamp-2">
                  {room.description}
                </p>
              </div>
              {room.isLive && (
                <Badge className="bg-green-500 text-white animate-pulse">
                  Live
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-lunar">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{room.memberCount} members</span>
              </div>
              {room.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{room.location}</span>
                </div>
              )}
            </div>

            {room.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {room.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {room.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{room.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <Button 
              className="w-full bg-inkwell text-aulait hover:bg-lunar group-hover:scale-105 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/rooms/${room.id}`)
              }}
            >
              Join Room
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
