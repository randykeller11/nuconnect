import { z } from 'zod'
import { optionalUrl, sanitizeOptionalUrl } from './url'

export const SENIORITY = [
  'student',
  'junior',
  'mid',
  'senior',
  'lead',
  'exec',
  'founder'
] as const

const tagArray = (max: number) =>
  z
    .array(z.string().trim().min(1))
    .max(max)
    .transform((arr) => Array.from(new Set(arr.map((s) => s.trim().toLowerCase()))))

export const snapshotSchema = z.object({
  role: z.string().trim().max(80).optional(),
  company: z.string().trim().max(80).optional(),
  location: z.string().trim().max(80).optional(),
  headline: z.string().trim().max(120).optional(),
  profile_photo_url: optionalUrl,
  linkedin_url: optionalUrl,
  website_url: optionalUrl,
  portfolio_url: optionalUrl,
  x_url: optionalUrl,
  github_url: optionalUrl,
})

export const focusSchema = z.object({
  industries: tagArray(3).optional(),
  skills: tagArray(5).optional(),
  interests: tagArray(7).optional(),
  seniority: z.enum(SENIORITY).optional(),
  primarySkill: z.string().optional(),
})

export const intentSchema = z.object({
  objectives: tagArray(4).optional(),
  seeking: tagArray(3).optional(),
  openness: z.number().min(1).max(5).optional(),
  introStyle: z.enum(['short', 'detailed']).optional(),
  enableIcebreakers: z.boolean().optional(),
  icebreakerTone: z.string().optional(),
})

export const profileValidationSchema = snapshotSchema
  .merge(focusSchema)
  .merge(intentSchema)
  .extend({
    showLinkedIn: z.boolean().optional(),
    showCompany: z.boolean().optional(),
    contact_prefs: z.record(z.any()).default({}),
    privacy: z.record(z.any()).default({}),
    consent: z.record(z.any()).default({}),
  })

export function validateMaxCounts(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  if (data.industries && data.industries.length > 3) errors.push('Maximum 3 industries allowed')
  if (data.skills && data.skills.length > 5) errors.push('Maximum 5 skills allowed')
  if (data.interests && data.interests.length > 7) errors.push('Maximum 7 interests allowed')
  if (data.objectives && data.objectives.length > 4) errors.push('Maximum 4 objectives allowed')
  if (data.seeking && data.seeking.length > 3) errors.push('Maximum 3 seeking items allowed')
  return { isValid: errors.length === 0, errors }
}

export function isSnapshotComplete(d: any): boolean {
  return !!(d.role && (d.company || d.headline))
}
export function isFocusComplete(d: any): boolean {
  return (d.industries?.length ?? 0) >= 1 || (d.skills?.length ?? 0) >= 2
}
export function isIntentComplete(d: any): boolean {
  return (d.objectives?.length ?? 0) >= 1 && (d.seeking?.length ?? 0) >= 1
}

export function normalizeProfileInput(input: any) {
  const parsed = profileValidationSchema.parse(input)
  Object.assign(parsed, {
    linkedin_url: sanitizeOptionalUrl(parsed.linkedin_url),
    website_url: sanitizeOptionalUrl(parsed.website_url),
    portfolio_url: sanitizeOptionalUrl(parsed.portfolio_url),
    x_url: sanitizeOptionalUrl(parsed.x_url),
    github_url: sanitizeOptionalUrl(parsed.github_url),
  })
  return parsed
}

export type SnapshotData = z.infer<typeof snapshotSchema>
export type FocusData = z.infer<typeof focusSchema>
export type IntentData = z.infer<typeof intentSchema>
export type ProfileData = z.infer<typeof profileValidationSchema>
