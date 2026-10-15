import { test, expect } from '@playwright/test';
import { attachDiagnostics, assertNoHorizontalOverflow, captureScreenshot } from './test-helpers.js';

test.describe('Custom Made Marketplace Journey', () => {
  test('browses orders, posts a custom gift request, and participates in negotiation thread', async ({ page, isMobile }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);
    await page.goto('/');

    // Navigate to Custom Made tab
    if (!isMobile) {
      await page.locator('nav[aria-label="Main navigation"] button', { hasText: 'Custom Made' }).click();
    } else {
      await page.locator('button[aria-label="Open navigation menu"]').click();
      await page.locator('nav[aria-label="Mobile navigation"] button', { hasText: 'Custom Made' }).click();
    }

    // Assert Marketplace header & "How it works"
    await expect(page.locator('h2', { hasText: /Custom Made Corner/i })).toBeVisible();
    await expect(page.locator('text=1. Post')).toBeVisible();
    await expect(page.locator('text=2. Receive Offers')).toBeVisible();
    await expect(page.locator('text=3. Negotiate')).toBeVisible();

    await captureScreenshot(page, testInfo, '20-marketplace-browse');

    // Filter switching
    const inProgressTab = page.locator('button', { hasText: /In Progress/i });
    await inProgressTab.click();
    await expect(inProgressTab).toHaveClass(/bg-rose-500/);

    const openTab = page.locator('button', { hasText: /Open/i }).first();
    await openTab.click();
    await expect(openTab).toHaveClass(/bg-rose-500/);

    // Switch to Post Request form
    const postRequestBtn = page.locator('button', { hasText: /\+ Post a Request/i }).first();
    await postRequestBtn.click();

    // Verify post form view
    await expect(page.locator('h3', { hasText: /Post a Custom Gift Request/i })).toBeVisible();

    // Test form validation
    const submitOrderBtn = page.locator('button[type="submit"]', { hasText: /Post My Request/i });
    await submitOrderBtn.click();
    await expect(page.locator('text=Please fill name, title and description.')).toBeVisible();

    await captureScreenshot(page, testInfo, '21-marketplace-post-validation');

    // Fill valid order details
    const uniqueTitle = `Bespoke Embroidered Silk Shawl ${Date.now()}`;
    await page.locator('#mp-buyer-name').fill('Ananya Sharma');
    await page.locator('#mp-occasion').fill('Anniversary');
    await page.locator('#mp-title').fill(uniqueTitle);
    await page.locator('#mp-description').fill('Pure mulberry silk with intricate golden zari border work.');
    await page.locator('#mp-budget-min').fill('2500');
    await page.locator('#mp-budget-max').fill('6000');

    await captureScreenshot(page, testInfo, '22-marketplace-post-filled');

    // Submit valid order
    await submitOrderBtn.click();

    // Should return to browse view with order visible
    const newOrderCard = page.locator(`button[aria-label="View request: ${uniqueTitle}"]`);
    await expect(newOrderCard).toBeVisible({ timeout: 10000 });

    // Click into order detail
    await newOrderCard.click();

    // Verify Order Detail view
    await expect(page.locator('h3', { hasText: uniqueTitle })).toBeVisible();
    await expect(page.locator('h4', { hasText: /Negotiation Thread/i })).toBeVisible();

    await captureScreenshot(page, testInfo, '23-marketplace-order-detail');

    // Send a message in negotiation thread
    const testMessage = `Hello, can this be delivered by the weekend?`;
    await page.locator('input[aria-label="Your name"]').fill('Ananya Sharma');
    await page.locator('input[aria-label="Message"]').fill(testMessage);
    await page.locator('button', { hasText: 'Send' }).click();

    // Assert message appears in thread
    await expect(page.locator(`text=${testMessage}`)).toBeVisible({ timeout: 8000 });

    // Back to browse view
    await page.locator('button', { hasText: /Back to all requests/i }).click();
    await expect(page.locator('h2', { hasText: /Custom Made Corner/i })).toBeVisible();

    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });
});
