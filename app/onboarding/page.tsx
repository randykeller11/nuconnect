'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { OnboardingMachine } from '@/lib/onboarding/machine'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { StepWelcome } from '@/components/onboarding/StepWelcome'
import { StepSnapshot } from '@/components/onboarding/StepSnapshot'
import { StepFocus } from '@/components/onboarding/StepFocus'
import { StepIntent } from '@/components/onboarding/StepIntent'
import { StepReview } from '@/components/onboarding/StepReview'
import { toast } from 'sonner'

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function OnboardingPage() {
  const router = useRouter()
  const [machine, setMachine] = useState<OnboardingMachine | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle')
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Initialize
  useEffect(() => {
    initializeOnboarding()
  }, [])

  const initializeOnboarding = async () => {
    try {
      const supabase = supabaseBrowser()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.replace('/auth')
        return
      }

      setUser(user)

      // Always start fresh - if they're here, they need onboarding
      const newMachine = new OnboardingMachine()
      setMachine(newMachine)
    } catch (error) {
      console.error('Failed to initialize onboarding:', error)
      toast.error('Failed to load onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const autoSave = async (data: any, isPartial = true) => {
    if (!user) return

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(async () => {
      try {
        setAutoSaveStatus('saving')
        
        const response = await fetch('/api/onboarding/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            profileData: data,
            isPartial
          })
        })

        if (response.ok) {
          setAutoSaveStatus('saved')
          setTimeout(() => setAutoSaveStatus('idle'), 2000)
        } else {
          throw new Error('Save failed')
        }
      } catch (error) {
        console.error('Auto-save failed:', error)
        setAutoSaveStatus('error')
        setTimeout(() => setAutoSaveStatus('idle'), 3000)
      }
    }, 1000) // Save after 1 second of inactivity

    setSaveTimeout(timeout)
  }

  const handleDataChange = (newData: any) => {
    if (!machine) return

    try {
      const updatedState = machine.updateData(newData)
      // Create new machine instance with the updated state
      const newMachine = new OnboardingMachine(updatedState.data)
      // Restore the current step from the updated state
      newMachine.getCurrentState().currentStep = updatedState.currentStep
      setMachine(newMachine)
      
      // Auto-save the changes
      autoSave(updatedState.data, true)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleNext = () => {
    if (!machine) return

    try {
      const updatedState = machine.nextStep()
      // Create new machine instance with the updated state
      const newMachine = new OnboardingMachine(updatedState.data)
      // Restore the current step from the updated state
      newMachine.getCurrentState().currentStep = updatedState.currentStep
      setMachine(newMachine)
      
      // Save progress
      autoSave(updatedState.data, true)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleBack = () => {
    if (!machine) return

    try {
      const updatedState = machine.previousStep()
      // Create new machine instance with the updated state
      const newMachine = new OnboardingMachine(updatedState.data)
      // Restore the current step from the updated state
      newMachine.getCurrentState().currentStep = updatedState.currentStep
      setMachine(newMachine)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleEditStep = (step: number) => {
    if (!machine) return

    try {
      const currentState = machine.getCurrentState()
      const newMachine = new OnboardingMachine(currentState.data)
      newMachine.getCurrentState().currentStep = step
      setMachine(newMachine)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleComplete = async () => {
    if (!machine || !user) return

    try {
      setIsLoading(true)
      
      const currentState = machine.getCurrentState()
      
      // Final save with complete profile
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profileData: currentState.data,
          isPartial: false
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      toast.success('Profile completed successfully!')
      
      // Redirect to home or room if deep-linked
      const urlParams = new URLSearchParams(window.location.search)
      const roomId = urlParams.get('room')
      
      if (roomId) {
        router.replace(`/rooms/${roomId}`)
      } else {
        router.replace('/home')
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      toast.error('Failed to complete setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !machine) {
    return (
      <div className="min-h-screen bg-aulait flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inkwell mx-auto mb-4"></div>
          <p className="text-lunar font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const currentState = machine.getCurrentState()
  const stepTitles = [
    'Welcome to NuConnect',
    'Professional Snapshot', 
    'Professional Focus',
    'Networking Intent',
    'Review & Finish'
  ]

  const stepSubtitles = [
    'Let\'s get you connected with the right professionals',
    'Tell us about your current role and background',
    'What are your key areas of expertise and interest?',
    'What are you looking to achieve through networking?',
    'Review your profile and set your preferences'
  ]

  const renderCurrentStep = () => {
    switch (currentState.currentStep) {
      case 0:
        return (
          <StepWelcome
            onContinue={handleNext}
            userEmail={user?.email}
          />
        )
      case 1:
        return (
          <StepSnapshot
            data={currentState.data}
            onChange={handleDataChange}
          />
        )
      case 2:
        return (
          <StepFocus
            data={currentState.data}
            onChange={handleDataChange}
          />
        )
      case 3:
        return (
          <StepIntent
            data={currentState.data}
            onChange={handleDataChange}
          />
        )
      case 4:
        return (
          <StepReview
            data={currentState.data}
            onChange={handleDataChange}
            onEditStep={handleEditStep}
            onComplete={handleComplete}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  // Welcome step has custom layout
  if (currentState.currentStep === 0) {
    return (
      <div className="min-h-screen bg-aulait flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {renderCurrentStep()}
        </div>
      </div>
    )
  }

  // Review step has custom navigation
  if (currentState.currentStep === 4) {
    return (
      <div className="min-h-screen bg-aulait py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-lunar">Step 5 of 5</span>
              {autoSaveStatus !== 'idle' && (
                <div className="text-sm text-lunar">
                  {autoSaveStatus === 'saving' && '💾 Saving...'}
                  {autoSaveStatus === 'saved' && '✅ Saved'}
                  {autoSaveStatus === 'error' && '❌ Save failed'}
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-inkwell h-2 rounded-full w-full"></div>
            </div>
          </div>
          {renderCurrentStep()}
        </div>
      </div>
    )
  }

  // Standard steps use OnboardingShell
  return (
    <OnboardingShell
      title={stepTitles[currentState.currentStep]}
      subtitle={stepSubtitles[currentState.currentStep]}
      currentStep={currentState.currentStep}
      totalSteps={5}
      onNext={handleNext}
      onBack={handleBack}
      canGoNext={currentState.canGoNext}
      canGoBack={currentState.canGoBack}
      isLoading={isLoading}
      autoSaveStatus={autoSaveStatus}
    >
      {renderCurrentStep()}
    </OnboardingShell>
  )
}
