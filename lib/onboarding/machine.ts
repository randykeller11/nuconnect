import { snapshotSchema, focusSchema, intentSchema, profileValidationSchema, validateMaxCounts, isSnapshotComplete, isFocusComplete, isIntentComplete } from '../validation/profile'

export interface OnboardingState {
  currentStep: number
  data: {
    // Snapshot
    role?: string
    company?: string
    location?: string
    headline?: string
    
    // Focus
    industries?: string[]
    skills?: string[]
    interests?: string[]
    seniority?: string
    
    // Intent
    objectives?: string[]
    seeking?: string[]
    openness?: number
    introStyle?: 'short' | 'detailed'
    enableIcebreakers?: boolean
    
    // Privacy
    showLinkedIn?: boolean
    showCompany?: boolean
  }
  isComplete: boolean
  lastCompletedStep: number
  canGoNext: boolean
  canGoBack: boolean
}

export class OnboardingMachine {
  private state: OnboardingState

  constructor(initialData?: any, initialStep?: number) {
    this.state = {
      currentStep: initialStep || 0,
      data: initialData || {},
      isComplete: false,
      lastCompletedStep: 0,
      canGoNext: true,
      canGoBack: false
    }
    this.updateNavigationState()
  }

  getCurrentStep(): number {
    return this.state.currentStep
  }

  getData() {
    return this.state.data
  }

  getCurrentState(): OnboardingState {
    return { ...this.state }
  }

  private updateNavigationState(): void {
    this.state.canGoBack = this.state.currentStep > 0
    
    // For canGoNext, check if current step requirements are met
    if (this.state.currentStep === 0) {
      this.state.canGoNext = true // Welcome step can always advance
    } else if (this.state.currentStep === 1) {
      // Snapshot step - need role and (company or headline)
      this.state.canGoNext = isSnapshotComplete(this.state.data)
    } else if (this.state.currentStep === 2) {
      // Focus step - need industries or skills
      this.state.canGoNext = isFocusComplete(this.state.data)
    } else if (this.state.currentStep === 3) {
      // Intent step - need objectives and seeking
      this.state.canGoNext = isIntentComplete(this.state.data)
    } else {
      this.state.canGoNext = false
    }
  }

  canAdvanceToStep(step: number): boolean {
    switch (step) {
      case 0: // Welcome
        return true
      case 1: // Snapshot
        return true
      case 2: // Focus
        return isSnapshotComplete(this.state.data)
      case 3: // Intent
        return isFocusComplete(this.state.data)
      case 4: // Review
        return isIntentComplete(this.state.data)
      default:
        return false
    }
  }

  updateData(newData: Partial<OnboardingState['data']>): OnboardingState {
    // Validate array limits
    const validation = validateMaxCounts(newData)
    if (!validation.isValid) {
      throw new Error(validation.errors[0])
    }

    this.state.data = { ...this.state.data, ...newData }
    
    // Update last completed step based on data completeness
    if (isSnapshotComplete(this.state.data) && this.state.lastCompletedStep < 1) {
      this.state.lastCompletedStep = 1
    }
    if (isFocusComplete(this.state.data) && this.state.lastCompletedStep < 2) {
      this.state.lastCompletedStep = 2
    }
    if (isIntentComplete(this.state.data) && this.state.lastCompletedStep < 3) {
      this.state.lastCompletedStep = 3
    }

    this.updateNavigationState()
    return { ...this.state }
  }

  nextStep(): OnboardingState {
    // Check if we can advance
    if (!this.state.canGoNext) {
      return { ...this.state }
    }

    this.state.currentStep += 1
    
    // Check if we've completed all steps (step 4 is review/final)
    if (this.state.currentStep >= 4) {
      this.state.isComplete = true
    }
    
    this.updateNavigationState()
    return { ...this.state }
  }

  previousStep(): OnboardingState {
    if (this.state.currentStep === 0) {
      throw new Error('Cannot go back')
    }

    this.state.currentStep -= 1
    this.updateNavigationState()
    return { ...this.state }
  }

  resume(savedState: Partial<OnboardingState>): OnboardingState {
    this.state = {
      ...this.state,
      ...savedState
    }
    
    // Ensure we're on a valid step
    if (!this.canAdvanceToStep(this.state.currentStep)) {
      this.state.currentStep = Math.max(0, this.state.lastCompletedStep)
    }

    this.updateNavigationState()
    return { ...this.state }
  }

  reset(): OnboardingState {
    this.state = {
      currentStep: 0,
      data: {},
      isComplete: false,
      lastCompletedStep: 0,
      canGoNext: true,
      canGoBack: false
    }
    return { ...this.state }
  }
}
