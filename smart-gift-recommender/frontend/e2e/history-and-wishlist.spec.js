import { test, expect } from '@playwright/test';
import { attachDiagnostics, captureScreenshot } from './test-helpers.js';

test.describe('Search History & Wishlist Persistence Journeys', () => {
  test('records search in history, supports re-search prefill, and item removal', async ({ page, isMobile }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);
    await page.goto('/');

    // 1. Perform a search so history is guaranteed to have at least one entry
    await page.locator('#field-relationship').selectOption('sister');
    await page.locator('#field-budget').selectOption('low');
    await page.locator('#field-occasion').selectOption('graduation');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h2', { hasText: /Gift Ideas for You/i })).toBeVisible({ timeout: 12000 });

    // 2. Navigate to History tab
    if (!isMobile) {
      await page.locator('nav[aria-label="Main navigation"] button', { hasText: 'History' }).click();
    } else {
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'History' }).click();
    }

    // 3. Verify History view
    await expect(page.locator('h1', { hasText: /Search History/i })).toBeVisible();
    await captureScreenshot(page, testInfo, '30-history-view');

    // 4. Verify search again button prefills the form
    const reSearchBtn = page.locator('button', { hasText: /Search again/i }).first();
    await expect(reSearchBtn).toBeVisible();
    await reSearchBtn.click();

    // Should switch to home tab with form visible and populated
    await expect(page.locator('h1', { hasText: /The right gift/i })).toBeVisible();
    await expect(page.locator('#field-relationship')).toHaveValue('sister');
    await expect(page.locator('#field-occasion')).toHaveValue('graduation');
    await expect(page.locator('#field-budget')).toHaveValue('low');

    // 5. Navigate back to History and test removing an entry
    if (!isMobile) {
      await page.locator('nav[aria-label="Main navigation"] button', { hasText: 'History' }).click();
    } else {
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'History' }).click();
    }

    const removeBtn = page.locator('button[aria-label*="Remove"]').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
    }

    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('saves item to wishlist, persists in wishlist tab, verifies Amazon link, and removes item', async ({ page, isMobile }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);
    await page.goto('/');

    // 1. Search gifts to get results
    await page.locator('#field-relationship').selectOption('mom');
    await page.locator('#field-budget').selectOption('medium');
    await page.locator('#field-occasion').selectOption('birthday');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('h2', { hasText: /Gift Ideas for You/i })).toBeVisible({ timeout: 12000 });

    // 2. Save first gift to wishlist
    const saveBtn = page.locator('button', { hasText: /^Save$/i }).first();
    await saveBtn.click();
    await expect(page.locator('button', { hasText: 'Saved' }).first()).toBeVisible();

    // 3. Navigate to Wishlist tab
    if (!isMobile) {
      await page.locator('nav[aria-label="Main navigation"] button', { hasText: 'Wishlist' }).click();
    } else {
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Wishlist' }).click();
    }

    // 4. Verify Wishlist view
    await expect(page.locator('h1', { hasText: /My Wishlist/i })).toBeVisible();
    await captureScreenshot(page, testInfo, '31-wishlist-view-with-items');

    // 5. Verify Amazon Buy link on wishlist item
    const buyLink = page.locator('a[aria-label*="Buy"]').first();
    await expect(buyLink).toBeVisible();
    const href = await buyLink.getAttribute('href');
    expect(href).toMatch(/^https:\/\/www\.amazon\.in\/s\?k=/);

    // 6. Test removing item from wishlist
    const removeWishlistBtn = page.locator('button[aria-label*="Remove"]').first();
    await removeWishlistBtn.click();

    await captureScreenshot(page, testInfo, '32-wishlist-after-removal');

    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });
});
