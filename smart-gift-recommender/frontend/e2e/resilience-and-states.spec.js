import { test, expect } from '@playwright/test';
import { attachDiagnostics, captureScreenshot } from './test-helpers.js';

test.describe('Loading, Empty, and Error States Journey', () => {
  test('handles recommendation API failure with user-friendly error alert', async ({ page }, testInfo) => {
    await page.goto('/');

    // Intercept recommendation API call to return 500 error
    await page.route('**/api/recommend*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Internal Server Error' }),
      });
    });

    // Fill form and submit
    await page.locator('#field-relationship').selectOption('best_friend');
    await page.locator('#field-budget').selectOption('low');
    await page.locator('#field-occasion').selectOption('birthday');
    await page.locator('button[type="submit"]').click();

    // Verify error alert is displayed
    const errorAlert = page.locator('[role="alert"]');
    await expect(errorAlert).toBeVisible({ timeout: 8000 });
    await expect(errorAlert).toContainText(/Failed to load recommendations|Something went wrong|Internal Server Error/i);

    await captureScreenshot(page, testInfo, '50-recommendation-error-state');
  });

  test('displays loading skeletons during delayed wishlist fetch', async ({ page, isMobile }, testInfo) => {
    // Intercept wishlist API call with delay
    await page.route('**/api/wishlist', async (route) => {
      await new Promise(r => setTimeout(r, 600));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/');

    if (!isMobile) {
      await page.locator('nav[aria-label="Main navigation"] button', { hasText: 'Wishlist' }).click();
    } else {
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Wishlist' }).click();
    }

    // Verify empty state is displayed once loaded
    await expect(page.locator('text=/Your wishlist is empty/i')).toBeVisible({ timeout: 8000 });
    await captureScreenshot(page, testInfo, '51-wishlist-empty-state');
  });
});
