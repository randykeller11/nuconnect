'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import AnonMatchCard from './AnonMatchCard'
import RevealModal from './RevealModal'

interface MatchCandidate {
  user_id: string
  role?: string
  industries?: string[]
  skills?: string[]
  interests?: string[]
  networking_goals?: string[]
  rationale: string
  score: number
  photo?: string | null
}

interface DeckProps {
  roomId: string
}

export default function Deck({ roomId }: DeckProps) {
  const [currentCandidate, setCurrentCandidate] = useState<MatchCandidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [mutualMatch, setMutualMatch] = useState<any>(null)
  const [synergy, setSynergy] = useState<string>('')
  const [status, setStatus] = useState<any>(null)

  // Initialize matching session and get first candidate
  useEffect(() => {
    const initializeMatching = async () => {
      try {
        // Start matching session
        await fetch('/api/matches/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId })
        })

        // Get first candidate
        await fetchNextCandidate()
        await fetchStatus()
      } catch (error) {
        console.error('Failed to initialize matching:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeMatching()
  }, [roomId])

  const fetchNextCandidate = async () => {
    try {
      const res = await fetch('/api/matches/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId })
      })
      
      if (res.ok) {
        const data = await res.json()
        setCurrentCandidate(data.candidate)
      }
    } catch (error) {
      console.error('Failed to fetch next candidate:', error)
    }
  }

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/matches/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId })
      })
      
      if (res.ok) {
        const data = await res.json()
        setStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }

  const handleSkip = useCallback(async () => {
    if (!currentCandidate) return
    
    setSkipping(true)
    try {
      await fetch('/api/matches/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId,
          targetUserId: currentCandidate.user_id
        })
      })
      
      await fetchNextCandidate()
      await fetchStatus()
    } catch (error) {
      console.error('Failed to skip:', error)
    } finally {
      setSkipping(false)
    }
  }, [currentCandidate, roomId])

  const handleConnect = useCallback(async () => {
    if (!currentCandidate) return
    
    setConnecting(true)
    try {
      const res = await fetch('/api/matches/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId,
          targetUserId: currentCandidate.user_id
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.mutual) {
          setMutualMatch(data.reveal)
          setSynergy(data.synergy)
          setShowRevealModal(true)
        } else {
          // Show toast and move to next card
          const { toast } = await import('sonner')
          toast.success('Request sent! We\'ll reveal when it\'s mutual.')
          
          await fetchNextCandidate()
          await fetchStatus()
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error)
      // Show error toast
      const { toast } = await import('sonner')
      toast.error('Failed to send request. Please try again.')
    } finally {
      setConnecting(false)
    }
  }, [currentCandidate, roomId])

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

  const handleRevealClose = async () => {
    setShowRevealModal(false)
    setMutualMatch(null)
    setSynergy('')
    await fetchNextCandidate()
    await fetchStatus()
  }

  const handleReset = async () => {
    setLoading(true)
    try {
      await fetch('/api/matches/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId })
      })
      
      await fetchNextCandidate()
      await fetchStatus()
    } catch (error) {
      console.error('Failed to reset:', error)
    } finally {
      setLoading(false)
    }
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

  // Show completion message when no more candidates
  if (!currentCandidate) {
    return (
      <Card className="bg-white rounded-2xl shadow-md border max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-inkwell/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">You've seen everyone here!</h3>
          <p className="text-lunar mb-4">
            {status?.mutualCount > 0 
              ? `Great job! You made ${status.mutualCount} mutual connection${status.mutualCount !== 1 ? 's' : ''}.`
              : 'Check back later for new members.'
            }
          </p>
          <div className="space-y-3">
            <Button onClick={handleReset} className="w-full">
              Check Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = `/rooms/${roomId}`}
              className="w-full"
            >
              Back to Room
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const progress = status ? ((status.totalQueued - status.remaining) / status.totalQueued) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      {status && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-lunar mb-2">
            <span>{status.totalQueued - status.remaining} of {status.totalQueued}</span>
            <span>{status.mutualCount} mutual{status.mutualCount !== 1 ? 's' : ''}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Current Card */}
      <AnonMatchCard
        match={currentCandidate}
        onSkip={handleSkip}
        onConnect={handleConnect}
        isConnecting={connecting}
        isSkipping={skipping}
      />

      {/* Reveal Modal */}
      {showRevealModal && mutualMatch && (
        <RevealModal
          match={mutualMatch}
          synergy={synergy}
          onClose={handleRevealClose}
        />
      )}
    </div>
  )
}
