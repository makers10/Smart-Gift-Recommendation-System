import { test, expect } from '@playwright/test';
import { attachDiagnostics, assertNoHorizontalOverflow, captureScreenshot } from './test-helpers.js';

test.describe('Dashboard & Analytics Journey', () => {
  test('renders analytics stat cards and Recharts visualizations', async ({ page, isMobile }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);
    await page.goto('/');

    // Navigate to Dashboard tab
    if (!isMobile) {
      await page.locator('nav[aria-label="Main navigation"] button', { hasText: 'Dashboard' }).click();
    } else {
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Dashboard' }).click();
    }

    // Assert Stat Cards
    await expect(page.locator('text=Total Searches')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Unique Users')).toBeVisible();
    await expect(page.locator('text=Festival Searches')).toBeVisible();
    await expect(page.locator('text=Gifts Voted')).toBeVisible();

    // Assert Chart Section Headings
    await expect(page.locator('h2', { hasText: /Most Searched Occasions/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /Top Relationships/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /Gender Breakdown/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /Festival vs General Occasions/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /Daily Searches/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /Most Loved Gifts/i })).toBeVisible();

    // Verify Recharts SVG elements render
    const chartContainers = page.locator('.recharts-responsive-container');
    const chartCount = await chartContainers.count();
    expect(chartCount).toBeGreaterThan(0);

    // Assert no horizontal overflow in dashboard
    await assertNoHorizontalOverflow(page);

    await captureScreenshot(page, testInfo, '40-dashboard-analytics-view');

    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });
});
