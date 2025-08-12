import { test, expect } from '@playwright/test'

test.describe('Authentication E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to auth page before each test
    await page.goto('/auth')
  })

  test('should display auth page with dual-mode toggle', async ({ page }) => {
    // Check page title and main elements
    await expect(page.locator('h1')).toContainText('Welcome to NuConnect')
    await expect(page.locator('text=Sign in to start networking')).toBeVisible()
    
    // Check dual-mode toggle buttons
    await expect(page.locator('button:has-text("Magic Link")')).toBeVisible()
    await expect(page.locator('button:has-text("Password")')).toBeVisible()
    
    // Magic Link should be active by default
    await expect(page.locator('button:has-text("Magic Link")')).toHaveClass(/bg-white/)
  })

  test('should switch between magic link and password modes', async ({ page }) => {
    // Start in magic link mode
    await expect(page.locator('input[type="password"]')).not.toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Send Magic Link')
    
    // Switch to password mode
    await page.click('button:has-text("Password")')
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In')
    
    // Switch back to magic link mode
    await page.click('button:has-text("Magic Link")')
    await expect(page.locator('input[type="password"]')).not.toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Send Magic Link')
  })

  test('should validate email input', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // Try to submit without email
    await submitButton.click()
    await expect(emailInput).toHaveAttribute('required')
    
    // Enter invalid email
    await emailInput.fill('invalid-email')
    await submitButton.click()
    // Browser validation should prevent submission
    
    // Enter valid email
    await emailInput.fill('test@example.com')
    // Should be able to proceed (we'll mock the actual auth in other tests)
  })

  test('should handle magic link flow', async ({ page }) => {
    // Mock successful magic link request
    await page.route('/api/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Fill email and submit magic link request
    await page.fill('input[type="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    // Should show success message (assuming toast implementation)
    // This would need to be adjusted based on actual toast implementation
    await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 5000 })
  })

  test('should handle password login flow', async ({ page }) => {
    // Switch to password mode
    await page.click('button:has-text("Password")')
    
    // Mock successful password login
    await page.route('/api/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: '123', email: 'test@example.com' } }),
      })
    })
    
    // Fill credentials and submit
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Should redirect to callback page
    await expect(page).toHaveURL('/auth/callback')
  })

  test('should handle auth callback and redirect based on profile', async ({ page }) => {
    // Mock user with no profile
    await page.route('/api/me/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ hasProfile: false, userId: '123' }),
      })
    })
    
    // Mock authenticated user
    await page.addInitScript(() => {
      // Mock Supabase auth state
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: '123', email: 'test@example.com' }
      }))
    })
    
    // Navigate to callback page
    await page.goto('/auth/callback')
    
    // Should redirect to onboarding for new users
    await expect(page).toHaveURL('/onboarding', { timeout: 10000 })
  })

  test('should redirect existing users to home', async ({ page }) => {
    // Mock user with existing profile
    await page.route('/api/me/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ hasProfile: true, userId: '123' }),
      })
    })
    
    // Mock authenticated user
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: '123', email: 'test@example.com' }
      }))
    })
    
    // Navigate to callback page
    await page.goto('/auth/callback')
    
    // Should redirect to home for existing users
    await expect(page).toHaveURL('/home', { timeout: 10000 })
  })

  test('should handle auth errors gracefully', async ({ page }) => {
    // Mock auth error
    await page.route('/api/auth/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      })
    })
    
    // Switch to password mode and try to login
    await page.click('button:has-text("Password")')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Login failed')).toBeVisible({ timeout: 5000 })
  })

  test('should show loading state during authentication', async ({ page }) => {
    // Mock slow auth response
    await page.route('/api/auth/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
    
    // Fill email and submit
    await page.fill('input[type="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    // Should show loading state
    await expect(page.locator('button:has-text("Loading...")')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })
})
