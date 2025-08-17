'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Users } from 'lucide-react'

export type Room = {
  id: string
  name: string
  slug: string
  tagline?: string
  topic?: string
  member_count: number
  is_public: boolean
}

interface RoomsListProps {
  rooms: Room[]
  onJoinRoom: (roomId: string) => Promise<void>
}

export default function RoomsList({ rooms, onJoinRoom }: RoomsListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleJoin = async (roomId: string) => {
    setLoading(roomId)
    try {
      await onJoinRoom(roomId)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="bg-white shadow-xl border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-inkwell">Active Rooms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rooms.length === 0 ? (
          <p className="text-lunar">No active rooms available</p>
        ) : (
          rooms.slice(0, 3).map((room) => (
            <div key={room.id} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-inkwell">{room.name}</h4>
                  {room.topic && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {room.topic}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-lunar">
                  <Users className="w-4 h-4" />
                  {room.member_count}
                </div>
              </div>
              {room.tagline && (
                <p className="text-sm text-lunar mb-3">{room.tagline}</p>
              )}
              <PrimaryButton
                onClick={() => handleJoin(room.id)}
                loading={loading === room.id}
                size="default"
                className="w-full"
              >
                Join Room
              </PrimaryButton>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
