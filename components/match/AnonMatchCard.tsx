'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useState } from 'react'

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

interface AnonMatchCardProps {
  match: MatchCandidate
  onSkip: () => void
  onConnect: () => void
  isConnecting?: boolean
  isSkipping?: boolean
}

export default function AnonMatchCard({ match, onSkip, onConnect, isConnecting, isSkipping }: AnonMatchCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="bg-white rounded-2xl shadow-md border max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        {/* Score Badge */}
        <div className="flex justify-center">
          <Badge className="bg-inkwell text-white px-3 py-1 text-sm font-medium">
            {match.score}% Match
          </Badge>
        </div>

        {/* Blurred Avatar */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-aulait/20">
            {match.photo ? (
              <img
                src={match.photo}
                alt="Anonymous profile"
                className="w-full h-full object-cover filter blur-sm"
              />
            ) : (
              <div className="w-full h-full bg-lunar/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-lunar filter blur-sm">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Identity Row (Hidden Name) */}
        <div className="text-center">
          <div className="text-sm text-lunar">
            {match.role || 'Professional'}
          </div>
        </div>

        {/* Why You Should Connect */}
        <div className="bg-aulait/10 rounded-lg p-3">
          <h4 className="text-sm font-medium text-inkwell mb-1">Why you should connect</h4>
          <p className="text-sm text-lunar leading-relaxed">{match.rationale}</p>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          {match.industries && match.industries.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-lunar mb-1">Industries</h5>
              <div className="flex flex-wrap gap-1">
                {match.industries.map((industry) => (
                  <span key={industry} className="px-2 py-1 bg-inkwell/10 text-inkwell rounded-full text-xs">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {match.skills && match.skills.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-lunar mb-1">Skills</h5>
              <div className="flex flex-wrap gap-1">
                {match.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-lunar/10 text-lunar rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {match.interests && match.interests.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-lunar mb-1">Interests</h5>
              <div className="flex flex-wrap gap-1">
                {match.interests.map((interest) => (
                  <span key={interest} className="px-2 py-1 bg-creme/50 text-inkwell rounded-full text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {match.networking_goals && match.networking_goals.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-lunar mb-1">Goals</h5>
              <div className="flex flex-wrap gap-1">
                {match.networking_goals.map((goal) => (
                  <span key={goal} className="px-2 py-1 bg-aulait/40 text-inkwell rounded-full text-xs">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={onSkip}
            className="flex-1 rounded-full"
            disabled={isConnecting || isSkipping}
          >
            {isSkipping ? 'Skipping...' : 'Skip'}
          </Button>
          <Button 
            onClick={onConnect}
            className="flex-1 bg-inkwell hover:bg-inkwell/90 text-white rounded-full"
            disabled={isConnecting || isSkipping}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
