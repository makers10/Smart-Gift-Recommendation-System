import { test, expect } from '@playwright/test';
import { attachDiagnostics, captureScreenshot } from './test-helpers.js';

test.describe('Find a Gift Flow & Gift Results Journey', () => {
  test('validates form fields and rejects submission when required inputs are missing', async ({ page }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);
    await page.goto('/');

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();

    // Click submit without selecting any inputs
    await submitBtn.click();

    // Assert validation error banner appears
    await expect(page.locator('text=Please fill in all required fields to find a gift.')).toBeVisible();

    await captureScreenshot(page, testInfo, '10-form-validation-errors');

    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('hero occasion chips dynamically prefill the form and scroll down', async ({ page }) => {
    await page.goto('/');

    // Click "Birthday" quick-filter chip in Hero
    const birthdayChip = page.locator('button', { hasText: 'Birthday' }).first();
    await expect(birthdayChip).toBeVisible();
    await birthdayChip.click();

    // Occasion select in form should now be populated with "birthday"
    const occasionSelect = page.locator('#field-occasion');
    await expect(occasionSelect).toHaveValue('birthday');
  });

  test('submits valid recommendation form, displays gift cards, tests voting and wishlist', async ({ page }, testInfo) => {
    const { consoleErrors } = attachDiagnostics(page);
    await page.goto('/');

    // Select Relationship
    await page.locator('#field-relationship').selectOption('mom');

    // Select Gender
    await page.locator('#field-gender').selectOption('female');

    // Select Budget
    await page.locator('#field-budget').selectOption('medium');

    // Select Occasion
    await page.locator('#field-occasion').selectOption('birthday');

    await captureScreenshot(page, testInfo, '11-form-filled');

    // Submit form
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Assert results container appears
    const resultsHeading = page.locator('h2', { hasText: /Gift Ideas for You/i });
    await expect(resultsHeading).toBeVisible({ timeout: 12000 });

    // Assert gift cards render
    const giftCards = page.locator('ul li');
    await expect(giftCards.first()).toBeVisible();
    const cardCount = await giftCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Assert Top Pick badge exists on first card
    const topPickBadge = page.locator('text=Top Pick').first();
    await expect(topPickBadge).toBeVisible();

    // Assert Amazon India link exists, has valid URL and safety attributes
    const amazonLink = page.locator('a[aria-label*="Buy"]').first();
    await expect(amazonLink).toBeVisible();
    const href = await amazonLink.getAttribute('href');
    expect(href).toMatch(/^https:\/\/www\.amazon\.in\/s\?k=/);
    expect(await amazonLink.getAttribute('target')).toBe('_blank');
    expect(await amazonLink.getAttribute('rel')).toContain('noreferrer');

    // Assert Voting interaction: Love button
    const loveBtn = page.locator('button', { hasText: 'Love it' }).first();
    await expect(loveBtn).toBeVisible();
    await loveBtn.click();

    // After voting, Love button should be disabled for that card
    await expect(loveBtn).toBeDisabled();

    // Assert Wishlist interaction: Save button
    const saveBtn = page.locator('button', { hasText: 'Save' }).first();
    await saveBtn.click();
    await expect(page.locator('button', { hasText: 'Saved' }).first()).toBeVisible();

    await captureScreenshot(page, testInfo, '12-results-voted-and-saved');

    // Assert Search Again button resets back to Form
    const searchAgainBtn = page.locator('button', { hasText: /Search Again/i });
    await expect(searchAgainBtn).toBeVisible();
    await searchAgainBtn.click();

    // Form should be visible again
    await expect(page.locator('h1', { hasText: /The right gift/i })).toBeVisible();
    await expect(page.locator('#field-relationship')).toBeVisible();

    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });
});
