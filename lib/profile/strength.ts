export interface ProfileStrengthResult {
  score: number
  level: 'Basic' | 'Solid' | 'Great' | 'Elite'
  suggestions: string[]
  breakdown: {
    avatar: number
    headline: number
    basics: number
    skills: number
    links: number
  }
}

export function calculateProfileStrength(profile: any): ProfileStrengthResult {
  let score = 0
  const breakdown = {
    avatar: 0,
    headline: 0,
    basics: 0,
    skills: 0,
    links: 0
  }
  const suggestions: string[] = []

  // Avatar (10 points)
  if (profile.profile_photo_url) {
    breakdown.avatar = 10
    score += 10
  } else {
    suggestions.push('Add a profile photo to increase visibility')
  }

  // Headline (10 points)
  if (profile.headline) {
    breakdown.headline = 10
    score += 10
  } else {
    suggestions.push('Add a professional headline to stand out')
  }

  // Basics: role, company, location (20 points total)
  let basicsScore = 0
  if (profile.role) basicsScore += 7
  if (profile.company) basicsScore += 7
  if (profile.location) {
    basicsScore += 6
  } else {
    suggestions.push('Add location to appear in local searches')
  }
  breakdown.basics = basicsScore
  score += basicsScore

  // Skills, interests, objectives (weighted - 40 points total)
  let skillsScore = 0
  const interests = profile.interests || []
  const skills = profile.skills || []
  const objectives = profile.objectives || []
  const seeking = profile.seeking || []

  if (interests.length >= 2) skillsScore += 8
  else if (interests.length >= 1) skillsScore += 4
  else suggestions.push('Add interests to improve matching')

  if (skills.length >= 3) skillsScore += 10
  else if (skills.length >= 2) skillsScore += 6
  else if (skills.length >= 1) skillsScore += 3
  else suggestions.push('Add skills to showcase your expertise')

  if (objectives.length >= 2) skillsScore += 12
  else if (objectives.length >= 1) skillsScore += 6
  else suggestions.push('Add networking objectives to find better matches')

  if (seeking.length >= 1) skillsScore += 10
  else suggestions.push('Specify what you\'re seeking to get relevant connections')

  breakdown.skills = skillsScore
  score += skillsScore

  // Links and contact preferences (8 points)
  let linksScore = 0
  if (profile.linkedin_url) linksScore += 4
  if (profile.website_url) linksScore += 2
  if (profile.contact_prefs?.showLinkedIn) linksScore += 1
  if (profile.contact_prefs?.showCompany) linksScore += 1

  if (!profile.linkedin_url) {
    suggestions.push('Add LinkedIn profile to build trust')
  }

  breakdown.links = linksScore
  score += linksScore

  // Determine level
  let level: ProfileStrengthResult['level']
  if (score >= 80) level = 'Elite'
  else if (score >= 60) level = 'Great'
  else if (score >= 40) level = 'Solid'
  else level = 'Basic'

  return {
    score,
    level,
    suggestions: suggestions.slice(0, 3), // Limit to top 3 suggestions
    breakdown
  }
}
