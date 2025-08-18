'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import AnonMatchCard from './AnonMatchCard'
import RevealModal from './RevealModal'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface MatchCardData {
  user_id: string
  headline?: string
  role?: string
  industries?: string[]
  skills?: string[]
  interests?: string[]
  networking_goals?: string[]
  rationale: string
  score: number
  avatar?: string | null
  shared?: {
    interests?: string[]
    skills?: string[]
    industries?: string[]
  }
}

interface DeckProps {
  roomId: string
}

export default function Deck({ roomId }: DeckProps) {
  const [cards, setCards] = useState<MatchCardData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [mutualMatch, setMutualMatch] = useState<any>(null)

  // Fetch matches on mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId })
        })
        
        if (res.ok) {
          const data = await res.json()
          setCards(data.matches || [])
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [roomId])

  const handleSkip = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // All matches completed - show completion state
      setCurrentIndex(cards.length) // This will trigger the completion UI
    }
  }, [currentIndex, cards.length])

  const handleConnect = useCallback(async () => {
    if (!cards[currentIndex]) return
    
    setConnecting(true)
    try {
      const res = await fetch('/api/contact/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toUserId: cards[currentIndex].user_id,
          roomId 
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.mutual) {
          // Fetch full profile for reveal
          const profileRes = await fetch(`/api/profile/by-user/${cards[currentIndex].user_id}`)
          if (profileRes.ok) {
            const profileData = await profileRes.json()
            setMutualMatch(profileData.profile)
            setShowRevealModal(true)
          }
        } else {
          // Show toast and move to next card
          const toastDiv = document.createElement('div')
          toastDiv.className = 'fixed top-4 right-4 bg-inkwell text-white px-4 py-2 rounded-lg shadow-lg z-50'
          toastDiv.textContent = 'Connection request sent! We\'ll notify you if they connect back.'
          document.body.appendChild(toastDiv)
          
          setTimeout(() => {
            document.body.removeChild(toastDiv)
          }, 3000)
          
          handleSkip()
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error)
      // Show error toast
      const toastDiv = document.createElement('div')
      toastDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      toastDiv.textContent = 'Failed to send connection request. Please try again.'
      document.body.appendChild(toastDiv)
      
      setTimeout(() => {
        document.body.removeChild(toastDiv)
      }, 3000)
    } finally {
      setConnecting(false)
    }
  }, [currentIndex, cards, roomId, handleSkip])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSkip()
      } else if (e.key === 'ArrowRight') {
        handleConnect()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleSkip, handleConnect])

  // Auto-redirect after showing completion message
  useEffect(() => {
    if (currentIndex >= cards.length && cards.length > 0) {
      const timer = setTimeout(() => {
        window.location.href = `/rooms/${roomId}`
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, cards.length, roomId])

  const handleRevealClose = () => {
    setShowRevealModal(false)
    setMutualMatch(null)
    handleSkip()
  }

  if (loading) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-inkwell border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lunar">Finding your matches...</p>
        </CardContent>
      </Card>
    )
  }

  if (cards.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-lunar/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Matches Found</h3>
          <p className="text-lunar">Try joining other rooms or updating your profile to find more connections.</p>
        </CardContent>
      </Card>
    )
  }

  // Show completion message when all matches are done
  if (currentIndex >= cards.length) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-inkwell/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">All Done!</h3>
          <p className="text-lunar mb-4">
            You've seen all potential matches in this room. Great job connecting with others!
          </p>
          <p className="text-sm text-lunar mb-4">
            Redirecting you back to the room...
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-inkwell border-t-transparent rounded-full mx-auto"></div>
        </CardContent>
      </Card>
    )
  }

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between text-sm text-lunar mb-2">
          <span>{currentIndex + 1} of {cards.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Card */}
      <AnonMatchCard
        match={currentCard}
        onSkip={handleSkip}
        onConnect={handleConnect}
        isConnecting={connecting}
      />

      {/* Reveal Modal */}
      {showRevealModal && mutualMatch && (
        <RevealModal
          match={mutualMatch}
          onClose={handleRevealClose}
        />
      )}
    </div>
  )
}
