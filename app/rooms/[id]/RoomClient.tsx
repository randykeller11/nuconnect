'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Room {
  id: string
  name: string
  slug: string
  tagline?: string | null
  topic?: string | null
  member_count: number
  is_public: boolean
}

interface RoomClientProps {
  room: Room
  isMember: boolean
}

export default function RoomClient({ room, isMember }: RoomClientProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinRoom = async () => {
    setIsJoining(true)
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id })
      })
      
      if (res.ok) {
        router.refresh()
      } else {
        console.error('Failed to join room')
      }
    } catch (error) {
      console.error('Failed to join room:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleGetMatches = () => {
    // This will be implemented in the next step (matching UI)
    router.push(`/rooms/${room.id}/matches`)
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-inkwell">
          {isMember ? 'You\'re in this room!' : 'Join this room'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMember ? (
          <div className="space-y-4">
            <p className="text-lunar">
              You're a member of this room. Ready to discover meaningful connections?
            </p>
            <Button 
              onClick={handleGetMatches}
              className="w-full bg-inkwell hover:bg-inkwell/90"
            >
              Get Matches
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lunar">
              Join this room to connect with other members and discover potential matches.
            </p>
            <Button 
              onClick={handleJoinRoom}
              disabled={isJoining}
              className="w-full"
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
