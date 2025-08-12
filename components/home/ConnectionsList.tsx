'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Calendar, Star } from 'lucide-react'

interface Connection {
  id: string
  name: string
  headline: string
  company?: string
  profile_photo_url?: string
  sharedTopics: string[]
  matchScore: number
  lastInteraction: string
  isStarred?: boolean
}

interface ConnectionsListProps {
  connections: Connection[]
}

export function ConnectionsList({ connections }: ConnectionsListProps) {
  const router = useRouter()

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  if (connections.length === 0) {
    return (
      <Card className="bg-white shadow-xl border-0 rounded-2xl">
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-12 h-12 text-lunar/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-inkwell mb-2">No connections yet</h3>
          <p className="text-lunar">Start networking to see your connections here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <Card 
          key={connection.id}
          className="bg-white shadow-lg border-0 rounded-xl hover:shadow-xl transition-all duration-200 cursor-pointer group"
          onClick={() => router.push(`/connections/${connection.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {connection.profile_photo_url ? (
                <img
                  src={connection.profile_photo_url}
                  alt={connection.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-aulait">
                    {connection.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-inkwell group-hover:text-lunar transition-colors">
                        {connection.name}
                      </h4>
                      {connection.isStarred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-lunar line-clamp-1">
                      {connection.headline}
                      {connection.company && ` at ${connection.company}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-lunar/60">
                      {formatTimeAgo(connection.lastInteraction)}
                    </div>
                    <div className="text-xs font-medium text-creme">
                      {Math.round(connection.matchScore * 100)}% match
                    </div>
                  </div>
                </div>
                
                {connection.sharedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {connection.sharedTopics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {connection.sharedTopics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{connection.sharedTopics.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
