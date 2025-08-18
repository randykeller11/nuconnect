'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

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
        const errorData = await res.json()
        console.error('Failed to join room:', errorData)
        toast.error(`Failed to join room: ${errorData.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Failed to join room:', error)
      toast.error('Failed to join room. Please try again.')
    } finally {
      setIsJoining(false)
    }
  }

  const handleStartMatching = async () => {
    try {
      // 1) Ensure we're a member (safe if already joined)
      await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id })
      })

      // 2) Start matching
      const res = await fetch('/api/matches/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id })
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.queued === 0) {
          toast.error('No one here yet. Try another room or invite people to join.')
          return
        }
        router.push(`/rooms/${room.id}/matches`)
      } else {
        const errorData = await res.json()
        console.error('match start failed', errorData)
        toast.error('Failed to start matching. Please try again.')
      }
    } catch (error) {
      console.error('Failed to start matching:', error)
      toast.error('Failed to start matching. Please try again.')
    }
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
              onClick={handleStartMatching}
              className="w-full bg-inkwell hover:bg-inkwell/90"
            >
              Start Matching
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
