'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface StepWelcomeProps {
  onContinue: () => void
  userEmail?: string
}

export function StepWelcome({ onContinue, userEmail }: StepWelcomeProps) {
  return (
    <div className="text-center space-y-8">
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg">
        <span className="text-2xl font-bold text-aulait">N</span>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-inkwell mb-4">Welcome to NuConnect</h2>
        <p className="text-lg text-lunar max-w-md mx-auto">
          Fill 2 quick screens to get curated matches
        </p>
        {userEmail && (
          <p className="text-sm text-lunar/70 mt-2">
            Signed in as {userEmail}
          </p>
        )}
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <Button
          onClick={onContinue}
          className="w-full bg-inkwell hover:bg-lunar text-aulait h-12 text-lg"
        >
          Get Started
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
