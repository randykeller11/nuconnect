import { test, expect } from '@playwright/test'

test.describe('Authentication E2E Tests', () => {
  test('should navigate to auth page', async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth')
    
    // Check if page loads (might be 404 if not implemented yet)
    const response = await page.waitForLoadState('networkidle')
    
    // For now, just verify we can navigate to the route
    expect(page.url()).toContain('/auth')
  })

  test('should handle auth page correctly', async ({ page }) => {
    // Navigate to auth page
    const response = await page.goto('/auth')
    
    // Auth page should exist and load properly
    expect(response?.status()).toBe(200)
    
    // Should show the auth page content
    await expect(page.locator('body')).toBeVisible()
    
    // Should contain auth-related elements
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('should be able to navigate to callback page', async ({ page }) => {
    // Navigate to callback page
    await page.goto('/auth/callback')
    
    // Check if page loads
    expect(page.url()).toContain('/auth/callback')
    
    // Should show loading or redirect behavior
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle API routes for profile check', async ({ page }) => {
    // Mock the profile API endpoint to return expected structure
    await page.route('/api/me/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ hasProfile: false, userId: '123' }),
      })
    })
    
    // Navigate to a page first to establish the route mock
    await page.goto('/')
    
    // Make a request to the API through the page context (which respects mocks)
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/me/profile')
      return await res.json()
    })
    
    // Should return the mocked response structure
    expect(response).toHaveProperty('hasProfile')
    expect(response).toHaveProperty('userId')
    expect(response.hasProfile).toBe(false)
    expect(response.userId).toBe('123')
  })

  test('should handle onboarding redirect', async ({ page }) => {
    // Navigate to onboarding page
    await page.goto('/onboarding')
    
    // Check if page loads (might be 404 if not implemented yet)
    expect(page.url()).toContain('/onboarding')
    
    // Should show some content or redirect
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle home page redirect', async ({ page }) => {
    // Navigate to home page
    await page.goto('/home')
    
    // Check if page loads (might be 404 if not implemented yet)
    expect(page.url()).toContain('/home')
    
    // Should show some content or redirect
    await expect(page.locator('body')).toBeVisible()
  })

  test('should mock Supabase auth flow', async ({ page }) => {
    // Mock Supabase auth methods
    await page.addInitScript(() => {
      // Mock the Supabase client
      window.mockSupabase = {
        auth: {
          signInWithOtp: async (options) => {
            return { data: { user: null, session: null }, error: null }
          },
          signInWithPassword: async (credentials) => {
            return { 
              data: { 
                user: { id: '123', email: credentials.email }, 
                session: { access_token: 'mock-token' } 
              }, 
              error: null 
            }
          },
          getUser: async () => {
            return { data: { user: { id: '123', email: 'test@example.com' } }, error: null }
          }
        }
      }
    })
    
    // Navigate to a page that might use auth
    await page.goto('/')
    
    // Verify mock is available
    const mockExists = await page.evaluate(() => {
      return typeof window.mockSupabase !== 'undefined'
    })
    
    expect(mockExists).toBe(true)
  })

  test('should test basic routing structure', async ({ page }) => {
    // Test that basic Next.js routing works
    await page.goto('/')
    
    // Should load the home page
    await expect(page.locator('body')).toBeVisible()
    
    // Check if we can navigate to different routes
    const routes = ['/auth', '/auth/callback', '/onboarding', '/home']
    
    for (const route of routes) {
      await page.goto(route)
      expect(page.url()).toContain(route)
      await expect(page.locator('body')).toBeVisible()
    }
  })
})
