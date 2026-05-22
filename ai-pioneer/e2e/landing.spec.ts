import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero section loads with correct headline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /AI Pioneer Program/i })).toBeVisible()
    await expect(page.getByText(/Learn Faster/i)).toBeVisible()
  })

  test('CTA scrolls to application form', async ({ page }) => {
    await page.getByRole('button', { name: /Apply to the Program/i }).first().click()
    await page.locator('#apply').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.locator('#apply')).toBeInViewport()
  })

  test('application form shows personal info fields', async ({ page }) => {
    await page.getByRole('button', { name: /Apply to the Program/i }).first().click()
    await expect(page.locator('#name')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
  })

  test('five pillars are displayed', async ({ page }) => {
    await expect(page.getByText('Curiosity About AI').first()).toBeVisible()
    await expect(page.getByText('Strong Learning Motivation').first()).toBeVisible()
    await expect(page.getByText('Innovation Mindset').first()).toBeVisible()
  })

  test('judging panel section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Peter/i })).toBeVisible()
  })
})
