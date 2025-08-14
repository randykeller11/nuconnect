import { z } from 'zod'

export const optionalUrl = z
  .string()
  .url({ message: 'Invalid URL' })
  .regex(/^https?:\/\//, { message: 'URL must start with http or https' })
  .optional()

export function sanitizeOptionalUrl(url?: string | null) {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : undefined
  } catch {
    return undefined
  }
}
