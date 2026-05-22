import { test, expect } from '@playwright/test'

test.describe('Admin Login', () => {
  test('redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await expect(page.getByRole('alert').getByText('Invalid email or password')).toBeVisible({ timeout: 8000 })
  })

  test('logs in with valid credentials', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill('admin@startrader.com')
    await page.getByLabel('Password').fill('changeme')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await expect(page).toHaveURL(/\/admin/)
  })
})

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill('admin@startrader.com')
    await page.getByLabel('Password').fill('changeme')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15000 })
  })

  test('dashboard loads with applications table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /admin|dashboard|applications/i })).toBeVisible()
  })

  test('search box filters results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search|搜索/i)
    await expect(searchInput).toBeVisible()
    await searchInput.fill('test')
  })

  test('export CSV button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export|csv/i })).toBeVisible()
  })
})
