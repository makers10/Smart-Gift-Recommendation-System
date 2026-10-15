import { test, expect } from '@playwright/test';
import { attachDiagnostics, assertNoHorizontalOverflow, captureScreenshot } from './test-helpers.js';

test.describe('Application Shell & Navigation Journey', () => {
  test('loads home view with editorial branding, font hierarchy, and accessible header', async ({ page }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Title and Brand Header
    await expect(page).toHaveTitle(/Gift with Love/i);
    const header = page.locator('header[aria-label="Site header"]');
    await expect(header).toBeVisible();

    const brandWordmark = header.locator('text=Gift with Love');
    await expect(brandWordmark).toBeVisible();

    // Check editorial hero presence
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText(/The right gift/i);

    // Assert ivory background applied to container
    const bgContainer = page.locator('.bg-ivory-100').first();
    await expect(bgContainer).toBeVisible();

    // Assert no horizontal overflow on this viewport
    await assertNoHorizontalOverflow(page);

    // Capture screenshot
    await captureScreenshot(page, testInfo, '01-home-editorial-view');

    // Verify no critical uncaught console errors
    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('navigates across all tabs with live region announcements and active indicator', async ({ page, isMobile }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);
    await page.goto('/');

    const liveRegion = page.locator('div[role="status"].sr-only');

    if (!isMobile) {
      const nav = page.locator('nav[aria-label="Main navigation"]');

      // 1. Navigate to Custom Made
      await nav.locator('button', { hasText: 'Custom Made' }).click();
      await expect(liveRegion).toHaveText('Custom Made');
      await expect(page.locator('h2', { hasText: /Custom Made Corner/i })).toBeVisible();
      await captureScreenshot(page, testInfo, '02-tab-custom-made');

      // 2. Navigate to History
      await nav.locator('button', { hasText: 'History' }).click();
      await expect(liveRegion).toHaveText('Search History');
      await expect(page.locator('h1', { hasText: /Search History/i })).toBeVisible();
      await captureScreenshot(page, testInfo, '03-tab-history');

      // 3. Navigate to Wishlist
      await nav.locator('button', { hasText: 'Wishlist' }).click();
      await expect(liveRegion).toHaveText('Wishlist');
      await expect(page.locator('h1', { hasText: /My Wishlist/i })).toBeVisible();
      await captureScreenshot(page, testInfo, '04-tab-wishlist');

      // 4. Navigate to Dashboard
      await nav.locator('button', { hasText: 'Dashboard' }).click();
      await expect(liveRegion).toHaveText('Dashboard');
      await expect(page.locator('text=Total Searches')).toBeVisible({ timeout: 10000 });
      await captureScreenshot(page, testInfo, '05-tab-dashboard');

      // 5. Navigate back to Find a Gift
      await nav.locator('button', { hasText: 'Find a Gift' }).click();
      await expect(liveRegion).toHaveText('Find a Gift');
      await expect(page.locator('h1', { hasText: /The right gift/i })).toBeVisible();
    } else {
      // Mobile drawer navigation flow
      const openMenuBtn = page.locator('button[aria-label="Open navigation menu"]');
      await expect(openMenuBtn).toBeVisible();
      await openMenuBtn.click();

      const drawer = page.locator('div[role="dialog"][aria-label="Navigation menu"]');
      await expect(drawer).toBeVisible();
      await captureScreenshot(page, testInfo, '02-mobile-drawer-open');

      // Navigate to Custom Made via mobile menu
      const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
      await mobileNav.locator('button', { hasText: 'Custom Made' }).click();

      // Drawer should close automatically
      await expect(drawer).toBeHidden();
      await expect(liveRegion).toHaveText('Custom Made');
      await expect(page.locator('h2', { hasText: /Custom Made Corner/i })).toBeVisible();

      // Open drawer again and navigate to Wishlist
      await openMenuBtn.click();
      await expect(drawer).toBeVisible();
      await mobileNav.locator('button', { hasText: 'Wishlist' }).click();
      await expect(drawer).toBeHidden();
      await expect(liveRegion).toHaveText('Wishlist');
    }

    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('verifies responsive design without horizontal overflow', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await assertNoHorizontalOverflow(page);
    await captureScreenshot(page, testInfo, '06-responsive-viewport-check');
  });
});
