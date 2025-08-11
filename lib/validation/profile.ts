import { z } from 'zod'

// Validation schemas for onboarding profile data
export const snapshotSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  company: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional()
}).refine(data => data.company || data.headline, {
  message: 'Either company or headline is required'
})

export const focusSchema = z.object({
  industries: z.array(z.string()).max(3, 'Maximum 3 industries allowed').optional(),
  skills: z.array(z.string()).max(5, 'Maximum 5 skills allowed').optional(),
  interests: z.array(z.string()).max(7, 'Maximum 7 interests allowed').optional(),
  seniority: z.enum([
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior Level (6-10 years)',
    'Lead/Principal (10+ years)',
    'Executive/C-Level'
  ]).optional()
}).refine(data => 
  (data.industries && data.industries.length >= 1) || 
  (data.skills && data.skills.length >= 2), {
  message: 'At least 1 industry or 2 skills required'
})

export const intentSchema = z.object({
  objectives: z.array(z.string()).min(1, 'At least 1 objective required').max(4, 'Maximum 4 objectives allowed'),
  seeking: z.array(z.string()).min(1, 'At least 1 seeking item required').max(3, 'Maximum 3 seeking items allowed'),
  openness: z.number().min(1).max(5).optional(),
  introStyle: z.enum(['short', 'detailed']).optional(),
  enableIcebreakers: z.boolean().optional()
})

export const profileSchema = z.object({
  // Snapshot data
  role: z.string().min(1),
  company: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  
  // Focus data
  industries: z.array(z.string()).max(3).optional(),
  skills: z.array(z.string()).max(5).optional(),
  interests: z.array(z.string()).max(7).optional(),
  seniority: z.string().optional(),
  
  // Intent data
  objectives: z.array(z.string()).min(1).max(4),
  seeking: z.array(z.string()).min(1).max(3),
  openness: z.number().min(1).max(5).optional(),
  introStyle: z.enum(['short', 'detailed']).optional(),
  enableIcebreakers: z.boolean().optional(),
  
  // Privacy settings
  showLinkedIn: z.boolean().optional(),
  showCompany: z.boolean().optional()
})

// Utility functions for validation
export function sanitizeArray(arr: string[]): string[] {
  return Array.from(new Set(
    arr.map(item => item.trim().toLowerCase())
      .filter(item => item.length > 0)
  ))
}

export function validateMaxCounts(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (data.industries && data.industries.length > 3) {
    errors.push('Maximum 3 industries allowed')
  }
  
  if (data.skills && data.skills.length > 5) {
    errors.push('Maximum 5 skills allowed')
  }
  
  if (data.interests && data.interests.length > 7) {
    errors.push('Maximum 7 interests allowed')
  }
  
  if (data.objectives && data.objectives.length > 4) {
    errors.push('Maximum 4 objectives allowed')
  }
  
  if (data.seeking && data.seeking.length > 3) {
    errors.push('Maximum 3 seeking items allowed')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export type SnapshotData = z.infer<typeof snapshotSchema>
export type FocusData = z.infer<typeof focusSchema>
export type IntentData = z.infer<typeof intentSchema>
export type ProfileData = z.infer<typeof profileSchema>
