export interface ProfileStrengthResult {
  score: number
  level: 'Basic' | 'Solid' | 'Great' | 'Elite'
  suggestions: string[]
  breakdown: {
    snapshot: number
    focus: number
    intent: number
    links: number
  }
}

export function calculateProfileStrength(profile: any): ProfileStrengthResult {
  let score = 0
  const breakdown = {
    snapshot: 0,
    focus: 0,
    intent: 0,
    links: 0,
  }
  const suggestions: string[] = []

  /* ------------------------------------------------------------------
   * Snapshot (0–30) — role, company, location, headline
   * ---------------------------------------------------------------- */
  const snapshotWeights = { role: 6, company: 6, location: 6, headline: 6, name: 6 }
  let snapshotScore = 0
  if (profile.role) snapshotScore += snapshotWeights.role
  if (profile.company) snapshotScore += snapshotWeights.company
  if (profile.location) snapshotScore += snapshotWeights.location
  if (profile.headline) snapshotScore += snapshotWeights.headline
  if (profile.name) snapshotScore += snapshotWeights.name
  breakdown.snapshot = Math.min(30, snapshotScore)
  score += breakdown.snapshot
  if (!profile.location) suggestions.push('Add your location so locals can find you')
  if (!profile.headline) suggestions.push('Write a short professional headline')

  /* ------------------------------------------------------------------
   * Focus (0–40) — industries, skills, interests, seniority
   * ---------------------------------------------------------------- */
  const industries = profile.industries ?? []
  const skills = profile.skills ?? []
  const interests = profile.interests ?? []
  const seniority = profile.seniority

  let focusScore = 0
  focusScore += Math.min(industries.length * 4, 10)            // industries (≤3) – 10
  if (industries.length === 0) suggestions.push('Select at least one industry')

  if (skills.length >= 5) focusScore += 15                     // skills (≤5) – 15
  else if (skills.length >= 3) focusScore += 10
  else if (skills.length >= 1) focusScore += 5
  else suggestions.push('Add a few key skills')

  focusScore += Math.min(interests.length * 2, 10)             // interests (≤7) – 10
  if (interests.length === 0) suggestions.push('Share a couple of interests')

  if (seniority) focusScore += 5                               // seniority – 5
  breakdown.focus = Math.min(40, focusScore)
  score += breakdown.focus

  /* ------------------------------------------------------------------
   * Intent (0–20) — objectives, seeking, preferences
   * ---------------------------------------------------------------- */
  const objectives = profile.objectives ?? []
  const seeking = profile.seeking ?? []
  const prefs = profile.preferences ?? {}
  let intentScore = 0
  intentScore += Math.min(objectives.length * 3, 10)           // objectives – 10
  if (objectives.length === 0) suggestions.push('State at least one objective')

  if (seeking.length >= 1) intentScore += 5                    // seeking – 5
  else suggestions.push('Specify who you’d like to meet')

  if (prefs.openness || prefs.introStyle || prefs.icebreakers !== undefined) {
    intentScore += 5                                           // prefs – 5
  }
  breakdown.intent = Math.min(20, intentScore)
  score += breakdown.intent

  /* ------------------------------------------------------------------
   * Links & Photo (0–10)
   * ---------------------------------------------------------------- */
  let linksScore = 0
  if (profile.profile_photo_url) linksScore += 4
  if (profile.linkedin_url) linksScore += 3
  if (profile.website_url || profile.portfolio_url || profile.github_url || profile.x_url)
    linksScore += 3
  if (!profile.profile_photo_url) suggestions.push('Upload a profile photo')
  if (!profile.linkedin_url) suggestions.push('Add your LinkedIn URL')
  breakdown.links = Math.min(10, linksScore)
  score += breakdown.links

  /* ------------------------------------------------------------------
   * Level buckets
   * ---------------------------------------------------------------- */
  let level: ProfileStrengthResult['level']
  if (score >= 80) level = 'Elite'
  else if (score >= 60) level = 'Great'
  else if (score >= 40) level = 'Solid'
  else level = 'Basic'

  return {
    score,
    level,
    suggestions: suggestions.slice(0, 3),
    breakdown,
  }
}

