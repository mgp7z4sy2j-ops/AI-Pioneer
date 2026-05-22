import { test, expect } from '@playwright/test'

// Questions displayed one at a time; 22/25/27/30 are open-ended
const OPEN_IDS = new Set([22, 25, 27, 30])

test('full submission chain: form → PostgreSQL → admin dashboard', async ({ page }) => {
  test.setTimeout(120000)

  const timestamp = Date.now()
  const testName = `E2E Test ${timestamp}`
  const testEmail = `e2e-${timestamp}@startrader.com`

  // Step 1: Fill personal info and submit to start assessment
  await page.goto('/')
  await page.waitForFunction(() => {
    const el = document.getElementById('name')
    return el != null && Object.keys(el).some(k => k.startsWith('__reactFiber'))
  }, { timeout: 15000 })
  await page.locator('#name').fill(testName)
  await page.locator('#phone').fill('+852 9000 0001')
  await page.locator('#email').fill(testEmail)
  await page.locator('#apply button[type="submit"]').click()
  await page.locator('#q-1').waitFor({ state: 'visible', timeout: 10000 })

  // Step 2: Answer all 30 questions one at a time
  for (let id = 1; id <= 30; id++) {
    if (OPEN_IDS.has(id)) {
      await page.locator(`#q-${id} textarea`).fill('This is my e2e test answer for this question.')
      if (id !== 30) {
        await page.getByRole('button', { name: 'Next Question' }).click()
        await page.locator(`#q-${id + 1}`).waitFor({ state: 'visible', timeout: 5000 })
      }
    } else {
      const nextId = id + 1
      await page.locator(`#q-${id} [aria-pressed]`).first().click()
      if (id < 30) {
        await page.locator(`#q-${nextId}`).waitFor({ state: 'visible', timeout: 5000 })
      }
    }
  }

  // Step 3: Submit application
  await page.locator('button:has-text("Submit Application")').click()
  await expect(page.getByRole('heading', { name: /Application Submitted/i })).toBeVisible({ timeout: 15000 })

  // Step 4: Login to admin
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill('admin@startrader.com')
  await page.getByLabel('Password').fill('changeme')
  await page.getByRole('button', { name: /Sign in/i }).click()
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15000 })

  // Step 5: Verify the submission appears in the dashboard
  await page.getByPlaceholder(/search|搜索/i).fill(testName)
  await expect(page.getByText(testEmail)).toBeVisible({ timeout: 10000 })
})
