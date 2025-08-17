'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Button } from '@/components/ui/button'

interface MatchCelebrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  other: {
    name: string
    avatar?: string
    linkedin_url?: string
    email?: string
  } | null
}

export default function MatchCelebrationModal({ 
  open, 
  onOpenChange, 
  other 
}: MatchCelebrationModalProps) {
  if (!other) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">🎉 It's a match!</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-inkwell/10 rounded-full flex items-center justify-center">
              {other.avatar ? (
                <img 
                  src={other.avatar} 
                  alt={other.name} 
                  className="w-16 h-16 rounded-full object-cover" 
                />
              ) : (
                <span className="text-inkwell font-bold">
                  {other.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <div className="w-16 h-16 bg-lunar/10 rounded-full flex items-center justify-center">
              <span className="text-lunar font-bold text-lg">You</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-inkwell mb-2">
              You and {other.name} want to connect!
            </h3>
            <p className="text-lunar text-sm">
              Contact information has been exchanged. Here's how to reach out:
            </p>
          </div>
          
          <div className="space-y-2">
            {other.linkedin_url && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(other.linkedin_url, '_blank')}
                aria-label={`View ${other.name}'s LinkedIn profile`}
              >
                View LinkedIn Profile
              </Button>
            )}
            {other.email && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`mailto:${other.email}`, '_blank')}
                aria-label={`Send email to ${other.name}`}
              >
                Send Email
              </Button>
            )}
            {!other.linkedin_url && !other.email && (
              <p className="text-sm text-lunar italic">
                Contact details will be shared separately
              </p>
            )}
          </div>
          
          <PrimaryButton
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Continue Matching
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
