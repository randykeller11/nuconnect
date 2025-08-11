'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Linkedin, Mail } from 'lucide-react'

interface StepWelcomeProps {
  onContinueWithLinkedIn: () => void
  onContinueWithEmail: () => void
}

export function StepWelcome({ onContinueWithLinkedIn, onContinueWithEmail }: StepWelcomeProps) {
  return (
    <div className="text-center space-y-8">
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg">
        <span className="text-2xl font-bold text-aulait">N</span>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-inkwell mb-4">Welcome to NuConnect</h2>
        <p className="text-lg text-lunar max-w-md mx-auto">
          Let's set up your professional profile to connect you with the right people
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <Button
          onClick={onContinueWithLinkedIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-3 h-12"
        >
          <Linkedin className="w-5 h-5" />
          Continue with LinkedIn
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-lunar/30" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-lunar">or</span>
          </div>
        </div>
        
        <Button
          onClick={onContinueWithEmail}
          variant="outline"
          className="w-full border-2 border-lunar text-lunar hover:bg-lunar hover:text-aulait flex items-center gap-3 h-12"
        >
          <Mail className="w-5 h-5" />
          Continue with Email
        </Button>
      </div>

      <div className="pt-4">
        <Badge variant="outline" className="text-xs text-lunar border-lunar/30">
          Quick setup • 2-3 minutes
        </Badge>
      </div>
    </div>
  )
}
