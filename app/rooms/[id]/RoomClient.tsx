'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Users } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import MatchDeck from '@/components/match/MatchDeck'

type Room = {
  id: string
  name: string
  tagline?: string
  topic?: string
  member_count: number
}

interface RoomClientProps {
  room: Room
  isMember: boolean
}

export default function RoomClient({ room, isMember }: RoomClientProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const [showMatches, setShowMatches] = useState(false)

  const handleJoinRoom = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id })
      })

      if (!res.ok) {
        throw new Error('Failed to join room')
      }

      toast({
        title: 'Joined room successfully!',
        description: 'You can now get matches in this room.',
      })

      // Refresh the page to update membership status
      window.location.reload()
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

  const handleGetMatches = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id })
      })

      if (!res.ok) {
        throw new Error('Failed to get matches')
      }

      const data = await res.json()
      setMatches(data.matches || [])
      setShowMatches(true)

      if (data.matches?.length === 0) {
        toast({
          title: 'No matches found',
          description: 'Try joining other rooms or updating your profile.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get matches. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Room Header Card - Hide when showing matches */}
      {!showMatches && (
        <Card className="bg-white shadow-xl border-0 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-inkwell text-2xl">{room.name}</CardTitle>
                {room.tagline && <p className="text-lunar mt-1">{room.tagline}</p>}
              </div>
              <div className="flex items-center gap-2 text-lunar">
                <Users className="w-5 h-5" />
                <span className="font-medium">{room.member_count} members</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isMember ? (
              <div className="text-center py-4">
                <p className="text-lunar mb-4">Join this room to start discovering matches</p>
                <PrimaryButton onClick={handleJoinRoom} loading={loading}>
                  Join Room
                </PrimaryButton>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-lunar mb-4">You're a member of this room!</p>
                <PrimaryButton onClick={handleGetMatches} loading={loading}>
                  Get Matches
                </PrimaryButton>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compact header when showing matches */}
      {showMatches && (
        <div className="flex items-center justify-between py-4">
          <div>
            <h2 className="text-xl font-bold text-inkwell">{room.name}</h2>
            <p className="text-sm text-lunar">Finding your perfect matches</p>
          </div>
          <div className="flex items-center gap-2 text-lunar text-sm">
            <Users className="w-4 h-4" />
            <span>{room.member_count} members</span>
          </div>
        </div>
      )}

      {/* Match Deck */}
      {showMatches && (
        <MatchDeck matches={matches} roomId={room.id} />
      )}
    </div>
  )
}
