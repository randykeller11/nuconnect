import { OnboardingMachine } from '../../lib/onboarding/machine'

describe('OnboardingMachine', () => {
  let machine: OnboardingMachine

  beforeEach(() => {
    machine = new OnboardingMachine()
  })

  describe('initialization', () => {
    test('should start at step 0 with empty data', () => {
      const state = machine.getCurrentState()
      expect(state.currentStep).toBe(0)
      expect(state.data).toEqual({})
      expect(state.isComplete).toBe(false)
      expect(state.canGoNext).toBe(true)
      expect(state.canGoBack).toBe(false)
    })

    test('should initialize with existing data', () => {
      const initialData = { role: 'Engineer', company: 'TechCorp' }
      const machineWithData = new OnboardingMachine(initialData)
      
      const state = machineWithData.getCurrentState()
      expect(state.data).toEqual(initialData)
    })
  })

  describe('data updates', () => {
    test('should update data and recalculate navigation state', () => {
      const newData = { role: 'Engineer', company: 'TechCorp' }
      const state = machine.updateData(newData)
      
      expect(state.data).toEqual(newData)
      expect(state.canGoNext).toBe(true)
    })

    test('should merge data with existing data', () => {
      machine.updateData({ role: 'Engineer' })
      const state = machine.updateData({ company: 'TechCorp' })
      
      expect(state.data).toEqual({ role: 'Engineer', company: 'TechCorp' })
    })

    test('should throw error when exceeding limits', () => {
      const invalidData = {
        industries: ['tech', 'finance', 'healthcare', 'education']
      }
      
      expect(() => machine.updateData(invalidData)).toThrow('Maximum 3 industries allowed')
    })
  })

  describe('step navigation', () => {
    test('should advance to next step when allowed', () => {
      // Complete snapshot step
      machine.updateData({ role: 'Engineer', company: 'TechCorp' })
      const state = machine.nextStep()
      
      expect(state.currentStep).toBe(1)
      expect(state.canGoBack).toBe(true)
    })

    test('should not advance when requirements not met', () => {
      machine.updateData({ currentStep: 1 }) // Move to focus step
      // Don't provide required focus data
      
      const state = machine.getCurrentState()
      expect(state.canGoNext).toBe(false)
    })

    test('should go back to previous step', () => {
      machine.updateData({ role: 'Engineer', company: 'TechCorp' })
      machine.nextStep()
      
      const state = machine.previousStep()
      expect(state.currentStep).toBe(0)
      expect(state.canGoBack).toBe(false)
    })

    test('should not go back from first step', () => {
      expect(() => machine.previousStep()).toThrow('Cannot go back')
    })
  })

  describe('completion logic', () => {
    test('should complete when all steps are satisfied', () => {
      // Complete all required steps
      machine.updateData({
        role: 'Engineer',
        company: 'TechCorp',
        industries: ['Technology'],
        objectives: ['hire'],
        seeking: ['talent']
      })
      
      // Navigate to final step
      machine.nextStep() // to focus
      machine.nextStep() // to intent
      machine.nextStep() // to review
      const state = machine.nextStep() // complete
      
      expect(state.isComplete).toBe(true)
    })

    test('should not complete when requirements missing', () => {
      machine.updateData({ role: 'Engineer' }) // Missing company/headline
      
      const state = machine.getCurrentState()
      expect(state.canGoNext).toBe(false)
    })
  })

  describe('resume functionality', () => {
    test('should resume from saved state', () => {
      const savedState = {
        currentStep: 2,
        data: {
          role: 'Engineer',
          company: 'TechCorp',
          industries: ['Technology']
        },
        isComplete: false
      }
      
      const state = machine.resume(savedState)
      expect(state.currentStep).toBe(2)
      expect(state.data.role).toBe('Engineer')
      expect(state.canGoBack).toBe(true)
    })

    test('should validate resumed state', () => {
      const invalidSavedState = {
        currentStep: 3, // Intent step
        data: { role: 'Engineer' } // Missing required data for this step
      }
      
      const state = machine.resume(invalidSavedState)
      // Should fall back to a valid step
      expect(state.currentStep).toBeLessThan(3)
    })
  })

  describe('reset functionality', () => {
    test('should reset to initial state', () => {
      machine.updateData({ role: 'Engineer', company: 'TechCorp' })
      machine.nextStep()
      
      const state = machine.reset()
      expect(state.currentStep).toBe(0)
      expect(state.data).toEqual({})
      expect(state.isComplete).toBe(false)
      expect(state.canGoNext).toBe(true)
      expect(state.canGoBack).toBe(false)
    })
  })

  describe('step-specific validation', () => {
    test('should validate snapshot step requirements', () => {
      // Valid snapshot data
      machine.updateData({ role: 'Engineer', company: 'TechCorp' })
      expect(machine.getCurrentState().canGoNext).toBe(true)
      
      // Invalid snapshot data
      machine.reset()
      machine.updateData({ role: 'Engineer' }) // Missing company/headline
      expect(machine.getCurrentState().canGoNext).toBe(false)
    })

    test('should validate focus step requirements', () => {
      // Complete snapshot first
      machine.updateData({ role: 'Engineer', company: 'TechCorp' })
      machine.nextStep()
      
      // Valid focus data
      machine.updateData({ industries: ['Technology'] })
      expect(machine.getCurrentState().canGoNext).toBe(true)
      
      // Alternative valid focus data
      machine.updateData({ industries: [], skills: ['JavaScript', 'Python'] })
      expect(machine.getCurrentState().canGoNext).toBe(true)
    })

    test('should validate intent step requirements', () => {
      // Complete previous steps
      machine.updateData({
        role: 'Engineer',
        company: 'TechCorp',
        industries: ['Technology']
      })
      machine.nextStep() // to focus
      machine.nextStep() // to intent
      
      // Valid intent data
      machine.updateData({
        objectives: ['hire'],
        seeking: ['talent']
      })
      expect(machine.getCurrentState().canGoNext).toBe(true)
      
      // Invalid intent data
      machine.updateData({ objectives: ['hire'] }) // Missing seeking
      expect(machine.getCurrentState().canGoNext).toBe(false)
    })
  })
})
