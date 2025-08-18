'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface RevealModalProps {
  match: {
    name?: string
    first_name?: string
    last_name?: string
    profile_photo_url?: string
    headline?: string
    role?: string
    linkedin_url?: string
    industries?: string[]
    skills?: string[]
    networking_goals?: string[]
  }
  onClose: () => void
}

export default function RevealModal({ match, onClose }: RevealModalProps) {
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
          {/* Celebration Message */}
          <div className="text-center">
            <p className="text-lunar">
              You both want to connect! Here's who you matched with:
            </p>
          </div>

          {/* Revealed Profile */}
          <div className="bg-gradient-to-br from-inkwell/5 to-lunar/5 rounded-xl p-4 space-y-4">
            {/* Unblurred Avatar */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-inkwell/20">
                {match.profile_photo_url && !imageError ? (
                  <Image
                    src={match.profile_photo_url}
                    alt={fullName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-inkwell/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-inkwell">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name and Role */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">{fullName}</h3>
              {(match.role || match.headline) && (
                <p className="text-sm text-lunar">{match.role || match.headline}</p>
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
                // Future: Open chat functionality
                alert('Chat feature coming soon! For now, connect via LinkedIn.')
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
