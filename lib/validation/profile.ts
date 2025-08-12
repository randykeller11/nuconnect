import { z } from 'zod'

// Seniority levels enum
export const seniorityLevels = [
  'student',
  'junior', 
  'mid',
  'senior',
  'lead',
  'exec',
  'founder'
] as const

// Visibility options enum
export const visibilityOptions = ['public', 'private'] as const

// LinkedIn URL validation
const linkedinUrlRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/

// Website URL validation
const websiteUrlRegex = /^https?:\/\/.+\..+/

// Simple profile schema for the API route
export const profileSchema = z.object({
  role: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  industries: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  seeking: z.array(z.string()).optional(),
  openness: z.number().optional(),
  introStyle: z.string().optional(),
  enableIcebreakers: z.boolean().optional(),
  showLinkedIn: z.boolean().optional(),
  showCompany: z.boolean().optional()
})

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
  industries: z.array(z.string()).max(3, 'Maximum 3 industries allowed').default([]),
  skills: z.array(z.string()).max(5, 'Maximum 5 skills allowed').default([]),
  interests: z.array(z.string()).max(7, 'Maximum 7 interests allowed').default([]),
  seniority: z.enum(seniorityLevels).optional()
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

export const profileValidationSchema = z.object({
  // Snapshot data
  role: z.string().min(1).optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  seniority: z.enum(seniorityLevels).optional(),
  linkedin_url: z.string().regex(linkedinUrlRegex, 'Invalid LinkedIn URL format').optional(),
  website_url: z.string().regex(websiteUrlRegex, 'Invalid website URL format').optional(),
  
  // Focus data
  industries: z.array(z.string()).max(3, 'Maximum 3 industries allowed').default([]),
  skills: z.array(z.string()).max(5, 'Maximum 5 skills allowed').default([]),
  interests: z.array(z.string()).max(7, 'Maximum 7 interests allowed').default([]),
  
  // Intent data
  objectives: z.array(z.string()).max(4, 'Maximum 4 objectives allowed').default([]),
  seeking: z.array(z.string()).max(3, 'Maximum 3 seeking items allowed').default([]),
  openness: z.number().min(1).max(5).optional(),
  intro_style: z.enum(['short', 'detailed']).optional(),
  enable_icebreakers: z.boolean().optional(),
  
  // Privacy settings
  contact_prefs: z.record(z.any()).default({})
}).refine(data => {
  // Custom validation for array limits
  const validation = validateMaxCounts(data)
  return validation.isValid
}, {
  message: 'Array limits exceeded'
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

// Completion guard functions
export function isSnapshotComplete(data: any): boolean {
  return !!(data.role && (data.company || data.headline))
}

export function isFocusComplete(data: any): boolean {
  return !!(
    (data.industries && data.industries.length >= 1) || 
    (data.skills && data.skills.length >= 2)
  )
}

export function isIntentComplete(data: any): boolean {
  return !!(
    data.objectives && data.objectives.length >= 1 &&
    data.seeking && data.seeking.length >= 1
  )
}

export type SnapshotData = z.infer<typeof snapshotSchema>
export type FocusData = z.infer<typeof focusSchema>
export type IntentData = z.infer<typeof intentSchema>
export type ProfileData = z.infer<typeof profileValidationSchema>
