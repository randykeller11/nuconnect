import { test, expect } from '@playwright/test'

test.describe('Onboarding E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.mockSupabase = {
        auth: {
          getUser: async () => ({
            data: { user: { id: 'test-user-123', email: 'test@example.com' } },
            error: null
          })
        }
      }
    })

    // Mock API endpoints
    await page.route('/api/me/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ hasProfile: false, userId: 'test-user-123' })
      })
    })

    await page.route('/api/onboarding/save', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, profile: {} })
      })
    })
  })

  test('should complete full onboarding flow', async ({ page }) => {
    await page.goto('/onboarding')

    // Step 0: Welcome
    await expect(page.locator('h1')).toContainText('Welcome to NuConnect')
    await page.click('button:has-text("Get Started")')

    // Step 1: Professional Snapshot
    await expect(page.locator('h1')).toContainText('Professional Snapshot')
    
    await page.fill('input[placeholder*="Software Engineer"]', 'Software Engineer')
    await page.fill('input[placeholder*="TechCorp"]', 'TechCorp Inc.')
    await page.fill('input[placeholder*="San Francisco"]', 'San Francisco, CA')
    await page.fill('textarea[placeholder*="description"]', 'Full-stack developer passionate about AI')
    
    await page.click('button:has-text("Next")')

    // Step 2: Professional Focus
    await expect(page.locator('h1')).toContainText('Professional Focus')
    
    // Select industries
    await page.click('text=Technology')
    await page.click('text=AI')
    
    // Select skills
    await page.click('text=JavaScript')
    await page.click('text=Python')
    await page.click('text=React')
    
    // Select seniority
    await page.click('text=Senior Level (6-10 years)')
    
    await page.click('button:has-text("Next")')

    // Step 3: Networking Intent
    await expect(page.locator('h1')).toContainText('Networking Intent')
    
    // Select objectives
    await page.click('text=Find Co-founder')
    await page.click('text=Hire Talent')
    
    // Select seeking
    await page.click('text=Technical Co-founder')
    
    // Set openness slider
    await page.locator('[role="slider"]').click()
    
    // Select intro style
    await page.click('input[value="detailed"]')
    
    // Enable icebreakers
    await page.click('[role="switch"]')
    
    await page.click('button:has-text("Next")')

    // Step 4: Review & Finish
    await expect(page.locator('h2')).toContainText('Review Your Profile')
    
    // Verify data is displayed
    await expect(page.locator('text=Software Engineer at TechCorp Inc.')).toBeVisible()
    await expect(page.locator('text=Technology')).toBeVisible()
    await expect(page.locator('text=JavaScript')).toBeVisible()
    await expect(page.locator('text=Find Co-founder')).toBeVisible()
    
    // Set privacy preferences
    await page.click('text=Show LinkedIn Profile')
    await page.click('text=Show Company Name')
    
    // Complete onboarding
    await page.click('button:has-text("Finish & See Matches")')
    
    // Should redirect (we'll mock this)
    await page.waitForURL('**/home')
  })

  test('should handle step validation', async ({ page }) => {
    await page.goto('/onboarding')
    
    // Skip welcome
    await page.click('button:has-text("Get Started")')
    
    // Try to proceed without required fields
    await page.click('button:has-text("Next")')
    
    // Should not advance (button should be disabled or show error)
    await expect(page.locator('h1')).toContainText('Professional Snapshot')
    
    // Fill required field
    await page.fill('input[placeholder*="Software Engineer"]', 'Engineer')
    
    // Should be able to proceed now
    await page.click('button:has-text("Next")')
    await expect(page.locator('h1')).toContainText('Professional Focus')
  })

  test('should support back navigation', async ({ page }) => {
    await page.goto('/onboarding')
    
    // Navigate forward
    await page.click('button:has-text("Get Started")')
    await page.fill('input[placeholder*="Software Engineer"]', 'Engineer')
    await page.fill('input[placeholder*="TechCorp"]', 'Company')
    await page.click('button:has-text("Next")')
    
    // Navigate back
    await page.click('button:has-text("Back")')
    await expect(page.locator('h1')).toContainText('Professional Snapshot')
    
    // Data should be preserved
    await expect(page.locator('input[value="Engineer"]')).toBeVisible()
    await expect(page.locator('input[value="Company"]')).toBeVisible()
  })

  test('should handle auto-save', async ({ page }) => {
    let saveRequests = 0
    
    await page.route('/api/onboarding/save', async (route) => {
      saveRequests++
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })
    
    await page.goto('/onboarding')
    await page.click('button:has-text("Get Started")')
    
    // Fill a field and wait for auto-save
    await page.fill('input[placeholder*="Software Engineer"]', 'Engineer')
    
    // Wait for auto-save indicator
    await page.waitForSelector('text=Saving...', { timeout: 2000 })
    await page.waitForSelector('text=Saved', { timeout: 3000 })
    
    expect(saveRequests).toBeGreaterThan(0)
  })

  test('should handle mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/onboarding')
    
    // Should be responsive
    await expect(page.locator('h1')).toBeVisible()
    
    // Navigation should work on mobile
    await page.click('button:has-text("Get Started")')
    await expect(page.locator('h1')).toContainText('Professional Snapshot')
    
    // Form fields should be accessible
    const roleInput = page.locator('input[placeholder*="Software Engineer"]')
    await expect(roleInput).toBeVisible()
    await roleInput.fill('Mobile Engineer')
  })

  test('should handle resume from saved state', async ({ page }) => {
    // Mock existing profile data
    await page.route('/api/me/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          hasProfile: false,
          profile: {
            contact_prefs: {
              role: 'Engineer',
              company: 'TechCorp',
              industries: ['Technology']
            }
          }
        })
      })
    })
    
    await page.goto('/onboarding')
    
    // Should resume with existing data
    await page.click('button:has-text("Get Started")')
    
    // Check if data is pre-filled
    await expect(page.locator('input[value="Engineer"]')).toBeVisible()
    await expect(page.locator('input[value="TechCorp"]')).toBeVisible()
  })

  test('should handle deep-linking to rooms', async ({ page }) => {
    await page.route('/api/onboarding/save', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })
    
    // Navigate with room parameter
    await page.goto('/onboarding?room=room-123')
    
    // Complete minimal onboarding
    await page.click('button:has-text("Get Started")')
    await page.fill('input[placeholder*="Software Engineer"]', 'Engineer')
    await page.fill('input[placeholder*="TechCorp"]', 'Company')
    await page.click('button:has-text("Next")')
    
    await page.click('text=Technology')
    await page.click('button:has-text("Next")')
    
    await page.click('text=Find Co-founder')
    await page.click('text=Technical Co-founder')
    await page.click('button:has-text("Next")')
    
    await page.click('button:has-text("Finish & See Matches")')
    
    // Should redirect to the specific room
    await page.waitForURL('**/rooms/room-123')
  })

  test('should enforce field limits', async ({ page }) => {
    await page.goto('/onboarding')
    await page.click('button:has-text("Get Started")')
    await page.fill('input[placeholder*="Software Engineer"]', 'Engineer')
    await page.fill('input[placeholder*="TechCorp"]', 'Company')
    await page.click('button:has-text("Next")')
    
    // Try to select more than 3 industries
    const industries = ['Technology', 'Healthcare', 'Finance', 'Education']
    for (const industry of industries) {
      await page.click(`text=${industry}`)
    }
    
    // Should show limit message
    await expect(page.locator('text=Maximum reached')).toBeVisible()
    
    // Fourth industry should not be selected
    const educationBadge = page.locator('text=Education').first()
    await expect(educationBadge).not.toHaveClass(/bg-inkwell/)
  })
})
