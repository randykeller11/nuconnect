'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface OnboardingShellProps {
  title: string
  currentStep: number
  totalSteps: number
  onNext?: () => void
  onBack?: () => void
  canGoNext?: boolean
  canGoBack?: boolean
  children: React.ReactNode
}

export function OnboardingShell({
  title,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canGoNext = true,
  canGoBack = true,
  children
}: OnboardingShellProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-aulait py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-lunar">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-lunar">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-inkwell">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {children}
            
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={!canGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={onNext}
                disabled={!canGoNext}
                className="bg-inkwell text-aulait hover:bg-lunar flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
