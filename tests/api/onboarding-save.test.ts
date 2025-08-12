// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200
    }))
  }
}))

describe('/api/onboarding/save', () => {
  test('should save profile data successfully', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        profileData: {
          role: 'Software Engineer',
          company: 'TechCorp',
          interests: ['AI', 'Technology'],
          objectives: ['find-cofounder'],
          seeking: ['cofounders']
        },
        isPartial: false
      })
    }

    // Import and test the route handler
    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.profile).toBeDefined()
    expect(data.profile.name).toBe('Software Engineer at TechCorp')
    expect(data.profile.interests).toEqual(['AI', 'Technology'])
  })

  test('should handle partial saves', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        profileData: {
          role: 'Software Engineer'
        },
        isPartial: true
      })
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.profile.name).toBe('Software Engineer')
  })

  test('should handle missing userId', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        profileData: { role: 'Engineer' }
      })
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.error).toBe('Missing userId')
  })

  test('should handle malformed JSON', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.error).toBe('Failed to save profile')
  })

  test('should map profile data correctly', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        profileData: {
          role: 'Product Manager',
          company: 'StartupCo',
          interests: ['AI', 'Product'],
          objectives: ['Mentor Others'],
          seeking: ['Mentor']
        }
      })
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(data.profile.name).toBe('Product Manager at StartupCo')
    expect(data.profile.mentorship_pref).toBe('offering') // Because objectives includes 'Mentor Others'
    expect(data.profile.contact_prefs.role).toBe('Product Manager')
  })
})
