'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Users } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

type Room = {
  id: string
  name: string
  slug: string
  tagline?: string
  topic?: string
  member_count: number
  is_public: boolean
}

interface RoomsClientProps {
  rooms: Room[]
}

export default function RoomsClient({ rooms }: RoomsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleJoinRoom = async (roomId: string) => {
    setLoading(roomId)
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
        description: 'Redirecting to room...',
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
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <Card key={room.id} className="bg-white shadow-xl border-0 rounded-2xl hover:shadow-2xl transition-shadow group">
          <div className="h-1 bg-gradient-to-r from-creme to-creme/60 group-hover:h-2 transition-all duration-200"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-inkwell text-xl flex items-center gap-2">
              {room.name}
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </CardTitle>
            {room.tagline && <p className="text-lunar">{room.tagline}</p>}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-inkwell/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-inkwell" />
                </div>
                <span className="font-medium text-lunar">{room.member_count} members</span>
              </div>
              {room.topic && (
                <Badge className="bg-green-100 text-green-700 border-green-200 capitalize">
                  {room.topic}
                </Badge>
              )}
            </div>
            <PrimaryButton
              onClick={() => handleJoinRoom(room.id)}
              loading={loading === room.id}
              className="w-full"
            >
              Join Room
            </PrimaryButton>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
