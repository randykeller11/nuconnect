import { snapshotSchema, focusSchema, intentSchema, profileSchema } from '../validation/profile'

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
}

export class OnboardingMachine {
  private state: OnboardingState

  constructor(initialState?: Partial<OnboardingState>) {
    this.state = {
      currentStep: 1,
      data: {},
      isComplete: false,
      lastCompletedStep: 0,
      ...initialState
    }
  }

  getCurrentStep(): number {
    return this.state.currentStep
  }

  getData() {
    return this.state.data
  }

  getState(): OnboardingState {
    return { ...this.state }
  }

  canAdvanceToStep(step: number): boolean {
    switch (step) {
      case 1: // Welcome
        return true
      case 2: // Snapshot
        return true
      case 3: // Focus
        return this.snapshotComplete()
      case 4: // Intent
        return this.focusComplete()
      case 5: // Review
        return this.intentComplete()
      default:
        return false
    }
  }

  snapshotComplete(): boolean {
    const { role, company, headline } = this.state.data
    return !!(role && (company || headline))
  }

  focusComplete(): boolean {
    const { industries, skills } = this.state.data
    return !!(
      (industries && industries.length >= 1) || 
      (skills && skills.length >= 2)
    )
  }

  intentComplete(): boolean {
    const { objectives, seeking } = this.state.data
    return !!(
      objectives && objectives.length >= 1 &&
      seeking && seeking.length >= 1
    )
  }

  updateData(newData: Partial<OnboardingState['data']>): void {
    this.state.data = { ...this.state.data, ...newData }
    
    // Update last completed step based on data completeness
    if (this.snapshotComplete() && this.state.lastCompletedStep < 2) {
      this.state.lastCompletedStep = 2
    }
    if (this.focusComplete() && this.state.lastCompletedStep < 3) {
      this.state.lastCompletedStep = 3
    }
    if (this.intentComplete() && this.state.lastCompletedStep < 4) {
      this.state.lastCompletedStep = 4
    }
  }

  goToStep(step: number): boolean {
    if (this.canAdvanceToStep(step)) {
      this.state.currentStep = step
      return true
    }
    return false
  }

  nextStep(): boolean {
    const nextStep = this.state.currentStep + 1
    return this.goToStep(nextStep)
  }

  previousStep(): boolean {
    const prevStep = this.state.currentStep - 1
    if (prevStep >= 1) {
      this.state.currentStep = prevStep
      return true
    }
    return false
  }

  complete(): boolean {
    try {
      // Validate final profile data
      profileSchema.parse(this.state.data)
      this.state.isComplete = true
      this.state.lastCompletedStep = 5
      return true
    } catch (error) {
      console.error('Profile validation failed:', error)
      return false
    }
  }

  validateCurrentStep(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    try {
      switch (this.state.currentStep) {
        case 2: // Snapshot
          snapshotSchema.parse(this.state.data)
          break
        case 3: // Focus
          focusSchema.parse(this.state.data)
          break
        case 4: // Intent
          intentSchema.parse(this.state.data)
          break
        case 5: // Review
          profileSchema.parse(this.state.data)
          break
      }
      return { isValid: true, errors: [] }
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          errors.push(err.message)
        })
      }
      return { isValid: false, errors }
    }
  }

  // Resume from saved state (e.g., from localStorage)
  resume(savedState: Partial<OnboardingState>): void {
    this.state = {
      ...this.state,
      ...savedState
    }
    
    // Ensure we're on a valid step
    if (!this.canAdvanceToStep(this.state.currentStep)) {
      this.state.currentStep = Math.max(1, this.state.lastCompletedStep)
    }
  }
}
