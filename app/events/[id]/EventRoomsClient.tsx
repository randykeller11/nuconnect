'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Room {
  id: string
  name: string
  slug: string
  tagline?: string | null
  topic?: string | null
  member_count: number
}

interface EventRoomsClientProps {
  room: Room
  isMember: boolean
}

export default function EventRoomsClient({ room, isMember }: EventRoomsClientProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinRoom = async () => {
    if (isMember) {
      router.push(`/rooms/${room.id}`)
      return
    }

    setIsJoining(true)
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id })
      })
      
      if (res.ok) {
        router.push(`/rooms/${room.id}`)
      } else {
        console.error('Failed to join room')
      }
    } catch (error) {
      console.error('Failed to join room:', error)
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Button 
      size="sm"
      onClick={handleJoinRoom}
      disabled={isJoining}
      className={`px-4 py-2 rounded-full transition-colors ${
        isMember 
          ? 'bg-inkwell hover:bg-inkwell/90 text-white' 
          : 'bg-white border border-inkwell text-inkwell hover:bg-inkwell/5'
      }`}
    >
      {isJoining ? 'Joining...' : isMember ? 'Enter Room' : 'Join Room'}
    </Button>
  )
}
