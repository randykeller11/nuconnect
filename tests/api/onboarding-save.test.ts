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

// Mock Supabase
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn()
      }))
    })),
    upsert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn()
      }))
    }))
  }))
}

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}))

// Mock the profile validation
jest.mock('../../lib/validation/profile', () => ({
  profileSchema: {
    parse: jest.fn((data) => data)
  }
}))

describe('/api/onboarding/save', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
  })

  test('should save profile data successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' }
    const mockProfile = {
      user_id: 'user-123',
      name: 'Software Engineer at TechCorp',
      interests: ['AI', 'Technology'],
      career_goals: 'find-cofounder',
      mentorship_pref: 'seeking'
    }

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: null,
      error: null
    })

    mockSupabaseClient.from().upsert().select().single.mockResolvedValue({
      data: mockProfile,
      error: null
    })

    // Mock request object
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

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.profile).toBeDefined()
  })

  test('should handle partial saves', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' }

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: null,
      error: null
    })

    mockSupabaseClient.from().upsert().select().single.mockResolvedValue({
      data: { user_id: 'user-123' },
      error: null
    })

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

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  test('should reject unauthorized requests', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'No user found' }
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        profileData: { role: 'Engineer' }
      })
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  test('should reject mismatched user IDs', async () => {
    const mockUser = { id: 'user-456', email: 'test@example.com' }

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123', // Different from authenticated user
        profileData: { role: 'Engineer' }
      })
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
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

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing userId')
  })

  test('should merge with existing profile data', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' }
    const existingProfile = {
      user_id: 'user-123',
      name: 'John Doe',
      interests: ['AI'],
      contact_prefs: { showLinkedIn: true }
    }

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: existingProfile,
      error: null
    })

    mockSupabaseClient.from().upsert().select().single.mockResolvedValue({
      data: {
        ...existingProfile,
        interests: ['AI', 'Technology'], // Updated
        career_goals: 'find-cofounder' // Added
      },
      error: null
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        profileData: {
          interests: ['AI', 'Technology'],
          objectives: ['find-cofounder']
        },
        isPartial: true
      })
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    
    // Verify upsert was called with merged data
    expect(mockSupabaseClient.from().upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        interests: ['AI', 'Technology']
      })
    )
  })

  test('should handle Supabase errors', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' }

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: null,
      error: null
    })

    mockSupabaseClient.from().upsert().select().single.mockResolvedValue({
      data: null,
      error: { message: 'Database error' }
    })

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        profileData: { role: 'Engineer' }
      })
    }

    const { POST } = require('../../app/api/onboarding/save/route')
    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to save profile')
  })
})
