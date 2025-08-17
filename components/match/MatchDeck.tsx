'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MatchCard from './MatchCard'
import MatchCelebrationModal from './MatchCelebrationModal'

export type MatchData = {
  user_id: string
  name: string
  headline?: string
  avatar?: string
  score: number
  shared?: { interests?: string[]; skills?: string[] }
  rationale: string
}

interface MatchDeckProps {
  matches: MatchData[]
  roomId: string
}

export default function MatchDeck({ matches, roomId }: MatchDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [celebrationData, setCelebrationData] = useState<{
    open: boolean
    other: any
  }>({ open: false, other: null })

  const currentMatch = matches[currentIndex]

  const handleShare = async (userId: string) => {
    try {
      const res = await fetch('/api/contact/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: userId, roomId })
      })

      const data = await res.json()

      if (data.mutual) {
        setCelebrationData({
          open: true,
          other: currentMatch
        })
      } else {
        // Show toast for non-mutual share
        // Note: This would need useToast hook if we want to show feedback
      }

      // Move to next match
      setCurrentIndex(prev => prev + 1)
    } catch (error) {
      console.error('Failed to share contact:', error)
      // Move to next match even on error to prevent getting stuck
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    setCurrentIndex(prev => prev + 1)
  }

  if (!matches.length) {
    return (
      <Card className="bg-white shadow-xl border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-inkwell">No Matches Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lunar mb-4">No matches found in this room yet.</p>
            <p className="text-sm text-lunar">
              Try updating your profile with more interests and skills, or check back later as more members join.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentIndex >= matches.length) {
    return (
      <Card className="bg-white shadow-xl border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-inkwell">All Done!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lunar mb-4">You've seen all available matches in this room.</p>
            <p className="text-sm text-lunar">
              Check back later for new members or try joining other rooms.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6" role="region" aria-label="Match deck">
      <div className="text-center">
        <div className="text-sm text-lunar mb-2" aria-live="polite">
          {currentIndex + 1} of {matches.length} matches
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
          <div 
            className="bg-gradient-to-r from-inkwell to-lunar h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / matches.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={matches.length}
            aria-label={`Match ${currentIndex + 1} of ${matches.length}`}
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <div 
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
              e.preventDefault()
              handleSkip(currentMatch.user_id)
            } else if (e.key === 'Enter') {
              e.preventDefault()
              handleShare(currentMatch.user_id)
            }
          }}
          tabIndex={0}
          role="application"
          aria-label="Match card navigation. Use arrow keys to skip, Enter to connect"
        >
          <MatchCard
            data={currentMatch}
            onShare={handleShare}
            onSkip={handleSkip}
          />
        </div>
      </div>

      <MatchCelebrationModal
        open={celebrationData.open}
        onOpenChange={(open) => setCelebrationData({ ...celebrationData, open })}
        other={celebrationData.other}
      />
    </div>
  )
}
