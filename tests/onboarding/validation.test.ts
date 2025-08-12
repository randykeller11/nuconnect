import { 
  profileValidationSchema, 
  sanitizeArray, 
  validateMaxCounts,
  isSnapshotComplete,
  isFocusComplete,
  isIntentComplete,
  seniorityLevels,
  visibilityOptions
} from '../../lib/validation/profile'

describe('Profile Validation', () => {
  describe('sanitizeArray', () => {
    test('should remove duplicates and empty strings', () => {
      const input = ['AI', 'ai', 'Fintech', '', 'AI', '  ', 'fintech']
      const result = sanitizeArray(input)
      expect(result).toEqual(['ai', 'fintech'])
    })

    test('should trim whitespace and convert to lowercase', () => {
      const input = ['  AI  ', 'FINTECH', 'Education ']
      const result = sanitizeArray(input)
      expect(result).toEqual(['ai', 'fintech', 'education'])
    })

    test('should handle empty array', () => {
      const result = sanitizeArray([])
      expect(result).toEqual([])
    })
  })

  describe('validateMaxCounts', () => {
    test('should pass validation when within limits', () => {
      const data = {
        industries: ['tech', 'finance'],
        skills: ['js', 'python', 'react'],
        interests: ['ai', 'climate'],
        objectives: ['hire', 'mentor'],
        seeking: ['talent']
      }
      
      const result = validateMaxCounts(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should fail when industries exceed limit', () => {
      const data = {
        industries: ['tech', 'finance', 'healthcare', 'education']
      }
      
      const result = validateMaxCounts(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Maximum 3 industries allowed')
    })

    test('should fail when skills exceed limit', () => {
      const data = {
        skills: ['js', 'python', 'react', 'node', 'sql', 'aws']
      }
      
      const result = validateMaxCounts(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Maximum 5 skills allowed')
    })

    test('should fail when interests exceed limit', () => {
      const data = {
        interests: ['ai', 'climate', 'fintech', 'education', 'health', 'music', 'art', 'gaming']
      }
      
      const result = validateMaxCounts(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Maximum 7 interests allowed')
    })

    test('should accumulate multiple errors', () => {
      const data = {
        industries: ['tech', 'finance', 'healthcare', 'education'],
        skills: ['js', 'python', 'react', 'node', 'sql', 'aws'],
        objectives: ['hire', 'mentor', 'learn', 'network', 'invest']
      }
      
      const result = validateMaxCounts(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
    })
  })

  describe('profileValidationSchema', () => {
    test('should validate complete valid profile', () => {
      const validProfile = {
        role: 'Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        headline: 'Full-stack developer passionate about AI',
        seniority: 'senior',
        linkedin_url: 'https://linkedin.com/in/johndoe',
        website_url: 'https://johndoe.dev',
        industries: ['Technology', 'AI'],
        skills: ['JavaScript', 'Python', 'React'],
        interests: ['AI', 'Climate Tech'],
        objectives: ['find-cofounder', 'hire'],
        seeking: ['cofounders', 'talent'],
        openness: 4,
        intro_style: 'detailed',
        enable_icebreakers: true,
        contact_prefs: { showLinkedIn: true }
      }

      const result = profileValidationSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    test('should reject invalid LinkedIn URL', () => {
      const profile = {
        linkedin_url: 'https://facebook.com/johndoe'
      }

      const result = profileValidationSchema.safeParse(profile)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Invalid LinkedIn URL format')
    })

    test('should reject invalid seniority level', () => {
      const profile = {
        seniority: 'invalid-level'
      }

      const result = profileValidationSchema.safeParse(profile)
      expect(result.success).toBe(false)
    })

    test('should enforce array limits', () => {
      const profile = {
        industries: ['tech', 'finance', 'healthcare', 'education']
      }

      const result = profileValidationSchema.safeParse(profile)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Maximum 3 industries allowed')
    })

    test('should set default values for arrays', () => {
      const profile = {}

      const result = profileValidationSchema.safeParse(profile)
      expect(result.success).toBe(true)
      expect(result.data.industries).toEqual([])
      expect(result.data.skills).toEqual([])
      expect(result.data.interests).toEqual([])
    })
  })

  describe('completion guards', () => {
    test('isSnapshotComplete should require role and (company or headline)', () => {
      expect(isSnapshotComplete({ role: 'Engineer', company: 'TechCorp' })).toBe(true)
      expect(isSnapshotComplete({ role: 'Engineer', headline: 'Full-stack dev' })).toBe(true)
      expect(isSnapshotComplete({ role: 'Engineer' })).toBe(false)
      expect(isSnapshotComplete({ company: 'TechCorp' })).toBe(false)
      expect(isSnapshotComplete({})).toBe(false)
    })

    test('isFocusComplete should require industries or skills', () => {
      expect(isFocusComplete({ industries: ['tech'] })).toBe(true)
      expect(isFocusComplete({ skills: ['js', 'python'] })).toBe(true)
      expect(isFocusComplete({ industries: ['tech'], skills: ['js'] })).toBe(true)
      expect(isFocusComplete({ skills: ['js'] })).toBe(false) // needs 2+ skills
      expect(isFocusComplete({ interests: ['ai'] })).toBe(false)
      expect(isFocusComplete({})).toBe(false)
    })

    test('isIntentComplete should require objectives and seeking', () => {
      expect(isIntentComplete({ 
        objectives: ['hire'], 
        seeking: ['talent'] 
      })).toBe(true)
      expect(isIntentComplete({ objectives: ['hire'] })).toBe(false)
      expect(isIntentComplete({ seeking: ['talent'] })).toBe(false)
      expect(isIntentComplete({})).toBe(false)
    })
  })

  describe('URL validation', () => {
    test('should validate LinkedIn URLs', () => {
      const validUrls = [
        'https://linkedin.com/in/johndoe',
        'https://www.linkedin.com/in/jane-smith',
        'https://linkedin.com/in/user123/'
      ]

      const invalidUrls = [
        'http://linkedin.com/in/user',
        'https://facebook.com/user',
        'https://linkedin.com/user',
        'linkedin.com/in/user'
      ]

      validUrls.forEach(url => {
        const result = profileValidationSchema.safeParse({ linkedin_url: url })
        expect(result.success).toBe(true)
      })

      invalidUrls.forEach(url => {
        const result = profileValidationSchema.safeParse({ linkedin_url: url })
        expect(result.success).toBe(false)
      })
    })

    test('should validate website URLs', () => {
      const validUrls = [
        'https://johndoe.dev',
        'http://example.com',
        'https://subdomain.example.co.uk'
      ]

      const invalidUrls = [
        'not-a-url',
        'ftp://example.com',
        'example.com'
      ]

      validUrls.forEach(url => {
        const result = profileValidationSchema.safeParse({ website_url: url })
        expect(result.success).toBe(true)
      })

      invalidUrls.forEach(url => {
        const result = profileValidationSchema.safeParse({ website_url: url })
        expect(result.success).toBe(false)
      })
    })
  })

  describe('enums', () => {
    test('should have correct seniority levels', () => {
      expect(seniorityLevels).toContain('student')
      expect(seniorityLevels).toContain('junior')
      expect(seniorityLevels).toContain('mid')
      expect(seniorityLevels).toContain('senior')
      expect(seniorityLevels).toContain('lead')
      expect(seniorityLevels).toContain('exec')
      expect(seniorityLevels).toContain('founder')
    })

    test('should have correct visibility options', () => {
      expect(visibilityOptions).toContain('public')
      expect(visibilityOptions).toContain('private')
    })
  })
})
