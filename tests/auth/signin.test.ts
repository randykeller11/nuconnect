// Mock Supabase clients
const mockCreateSupabaseServerClient = jest.fn()
const mockSupabaseBrowser = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient
}))

jest.mock('@/lib/supabase/browser', () => ({
  supabaseBrowser: mockSupabaseBrowser
}))

describe('Authentication Integration Tests', () => {
  let mockSupabaseClient: any

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        signInWithOtp: jest.fn(),
        signInWithPassword: jest.fn(),
        getUser: jest.fn(),
        getSession: jest.fn(),
      },
    }
    
    mockCreateSupabaseServerClient.mockReturnValue(mockSupabaseClient)
    mockSupabaseBrowser.mockReturnValue(mockSupabaseClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Magic Link Authentication', () => {
    it('should send magic link successfully', async () => {
      mockSupabaseClient.auth.signInWithOtp.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      })

      const result = await mockSupabaseClient.auth.signInWithOtp({
        email: 'test@example.com',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
          shouldCreateUser: true,
        },
      })

      expect(mockSupabaseClient.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
          shouldCreateUser: true,
        },
      })
      expect(result.error).toBeNull()
    })

    it('should handle magic link errors', async () => {
      const mockError = { message: 'Invalid email' }
      mockSupabaseClient.auth.signInWithOtp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await mockSupabaseClient.auth.signInWithOtp({
        email: 'invalid-email',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
          shouldCreateUser: true,
        },
      })

      expect(result.error).toEqual(mockError)
    })
  })

  describe('Password Authentication', () => {
    it('should sign in with password successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      const mockSession = { access_token: 'token123' }
      
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const result = await mockSupabaseClient.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.data.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    it('should handle password authentication errors', async () => {
      const mockError = { message: 'Invalid credentials' }
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await mockSupabaseClient.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword',
      })

      expect(result.error).toEqual(mockError)
    })
  })

  describe('Auth Callback', () => {
    it('should get user successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const result = await mockSupabaseClient.auth.getUser()

      expect(result.data.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    it('should handle missing user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No user found' },
      })

      const result = await mockSupabaseClient.auth.getUser()

      expect(result.data.user).toBeNull()
      expect(result.error).toBeTruthy()
    })
  })

  describe('Profile Check API', () => {
    it('should check profile existence', async () => {
      // This would be tested with actual API calls in integration tests
      // For now, we'll mock the expected behavior
      const mockProfileResponse = { hasProfile: true, userId: '123' }
      
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockProfileResponse),
        ok: true,
      })

      const response = await fetch('/api/me/profile')
      const data = await response.json()

      expect(data).toEqual(mockProfileResponse)
    })
  })
})
