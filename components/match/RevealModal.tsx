'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface RevealModalProps {
  match: {
    user_id: string
    name?: string
    role?: string
    headline?: string
    profile_photo_url?: string | null
    linkedin_url?: string | null
    industries?: string[]
    skills?: string[]
    interests?: string[]
    networking_goals?: string[]
  }
  synergy: string
  onClose: () => void
}

export default function RevealModal({ match, synergy, onClose }: RevealModalProps) {
  const [imageError, setImageError] = useState(false)
  
  const fullName = match.name || `${match.first_name || ''} ${match.last_name || ''}`.trim() || 'Anonymous'

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-800">
            🎉 It's a Match!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {/* Synergy Brief */}
          <div className="bg-aulait/20 rounded-lg p-4">
            <h4 className="font-semibold text-inkwell mb-2">Why you matched:</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {synergy}
            </p>
          </div>

          {/* Revealed Profile */}
          <div className="bg-gradient-to-br from-inkwell/5 to-lunar/5 rounded-xl p-4 space-y-4">
            {/* Unblurred Avatar */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-inkwell/20">
                {match.profile_photo_url && !imageError ? (
                  <img
                    src={match.profile_photo_url}
                    alt={match.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-inkwell/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-inkwell">
                      {(match.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name and Role */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">{match.name || 'Your Match'}</h3>
              {match.role && (
                <p className="text-sm text-lunar">{match.role}</p>
              )}
              {match.headline && (
                <p className="text-sm text-gray-600 mt-1">{match.headline}</p>
              )}
            </div>

            {/* LinkedIn Link */}
            {match.linkedin_url && (
              <div className="flex justify-center">
                <a
                  href={match.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-inkwell hover:text-inkwell/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View LinkedIn Profile
                </a>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              {match.industries && match.industries.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-lunar mb-1">Industries</h5>
                  <div className="flex flex-wrap gap-1">
                    {match.industries.slice(0, 3).map((industry) => (
                      <Badge key={industry} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {match.skills && match.skills.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-lunar mb-1">Skills</h5>
                  <div className="flex flex-wrap gap-1">
                    {match.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-inkwell hover:bg-inkwell/90 text-white rounded-full"
              onClick={() => {
                // TODO: Implement chat functionality
                console.log('Open chat with:', match.user_id)
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open Chat
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full rounded-full"
            >
              Continue Matching
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
