'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RoomsList, { type Room } from '@/components/dashboard/RoomsList'
import { useToast } from '@/lib/hooks/use-toast'

interface DashboardClientProps {
  rooms: Room[]
}

export default function DashboardClient({ rooms }: DashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleJoinRoom = async (roomId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId })
      })

      if (!res.ok) {
        throw new Error('Failed to join room')
      }

      toast({
        title: 'Joined room successfully!',
        description: 'Get matches now to start connecting.',
      })

      // Navigate to the room
      router.push(`/rooms/${roomId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join room. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return <RoomsList rooms={rooms} onJoinRoom={handleJoinRoom} />
}
