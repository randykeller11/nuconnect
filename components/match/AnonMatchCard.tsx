'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useState } from 'react'

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

interface AnonMatchCardProps {
  match: MatchCardData
  onSkip: () => void
  onConnect: () => void
  isConnecting?: boolean
}

export default function AnonMatchCard({ match, onSkip, onConnect, isConnecting }: AnonMatchCardProps) {
  const [imageError, setImageError] = useState(false)

  // Get shared tags from the match data
  const sharedIndustries = match.shared?.industries || []
  const sharedSkills = match.shared?.skills || []
  const sharedInterests = match.shared?.interests || []

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
            {match.avatar && !imageError ? (
              <Image
                src={match.avatar}
                alt="Anonymous profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                style={{ filter: 'blur(6px) contrast(0.9)' }}
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-lunar/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-lunar">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Identity Row (Hidden Name) */}
        <div className="text-center">
          <div className="text-sm text-lunar">
            {match.role || match.headline || 'Professional'}
          </div>
        </div>

        {/* Why You Should Connect */}
        <div className="bg-aulait/10 rounded-lg p-3">
          <h4 className="text-sm font-medium text-inkwell mb-1">Why you should connect</h4>
          <p className="text-sm text-lunar leading-relaxed">{match.rationale}</p>
        </div>

        {/* Shared Tags */}
        <div className="space-y-2">
          {sharedIndustries.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-lunar mb-1">Shared Industries</h5>
              <div className="flex flex-wrap gap-1">
                {sharedIndustries.map((industry) => (
                  <span key={industry} className="px-2 py-1 bg-inkwell/10 text-inkwell rounded-full text-xs">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {sharedSkills.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-lunar mb-1">Shared Skills</h5>
              <div className="flex flex-wrap gap-1">
                {sharedSkills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-lunar/10 text-lunar rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {sharedInterests.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-lunar mb-1">Shared Interests</h5>
              <div className="flex flex-wrap gap-1">
                {sharedInterests.map((interest) => (
                  <span key={interest} className="px-2 py-1 bg-creme/50 text-inkwell rounded-full text-xs">
                    {interest}
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
            disabled={isConnecting}
          >
            Skip
          </Button>
          <Button 
            onClick={onConnect}
            className="flex-1 bg-inkwell hover:bg-inkwell/90 text-white rounded-full"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
