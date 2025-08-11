// LinkedIn integration for profile import
export interface LinkedInProfile {
  firstName?: string
  lastName?: string
  headline?: string
  location?: string
  industry?: string
  positions?: Array<{
    title: string
    companyName: string
    isCurrent: boolean
  }>
  skills?: string[]
}

export interface LinkedInImportResult {
  success: boolean
  profile?: {
    role?: string
    company?: string
    location?: string
    headline?: string
    industries?: string[]
    skills?: string[]
  }
  error?: string
}

// OAuth handler (when configured)
export async function handleLinkedInOAuth(authCode: string): Promise<LinkedInImportResult> {
  try {
    // In production, this would exchange the auth code for an access token
    // and fetch the user's LinkedIn profile
    
    // For now, return mock data
    console.log('LinkedIn OAuth not configured, using mock data')
    return getDevMockProfile()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'LinkedIn OAuth failed'
    }
  }
}

// Dev mock fallback
export function getDevMockProfile(): LinkedInImportResult {
  const mockProfiles = [
    {
      role: 'Senior Software Engineer',
      company: 'Tech Startup Inc.',
      location: 'San Francisco, CA',
      headline: 'Building the future of AI-powered applications',
      industries: ['Technology'],
      skills: ['JavaScript', 'React', 'Node.js']
    },
    {
      role: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      headline: 'Passionate about creating products that solve real problems',
      industries: ['Technology', 'Finance'],
      skills: ['Product Management', 'Strategy', 'UX Design']
    },
    {
      role: 'Marketing Director',
      company: 'Growth Co.',
      location: 'Austin, TX',
      headline: 'Driving growth through data-driven marketing strategies',
      industries: ['Marketing', 'Technology'],
      skills: ['Marketing', 'Analytics', 'Leadership']
    }
  ]
  
  // Return a random mock profile
  const randomProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)]
  
  return {
    success: true,
    profile: randomProfile
  }
}

// Import from LinkedIn URL (for manual import)
export async function importFromLinkedInUrl(url: string): Promise<LinkedInImportResult> {
  try {
    // Validate LinkedIn URL format
    const linkedinUrlRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/
    
    if (!linkedinUrlRegex.test(url)) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL format'
      }
    }
    
    // In production, this would scrape or use LinkedIn API
    // For now, return mock data based on URL
    console.log('LinkedIn scraping not implemented, using mock data for URL:', url)
    return getDevMockProfile()
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import from LinkedIn'
    }
  }
}

// Map LinkedIn profile data to our profile format
export function mapLinkedInProfile(linkedinProfile: LinkedInProfile): LinkedInImportResult['profile'] {
  const currentPosition = linkedinProfile.positions?.find(pos => pos.isCurrent)
  
  return {
    role: currentPosition?.title,
    company: currentPosition?.companyName,
    location: linkedinProfile.location,
    headline: linkedinProfile.headline,
    industries: linkedinProfile.industry ? [linkedinProfile.industry] : undefined,
    skills: linkedinProfile.skills?.slice(0, 5) // Limit to 5 skills
  }
}
