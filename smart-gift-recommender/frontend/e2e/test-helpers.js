import { expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Attaches console error and failed network request monitors to the page.
 */
export function attachDiagnostics(page) {
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', (request) => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error',
    });
  });

  return { consoleErrors, failedRequests };
}

/**
 * Asserts that the page has no unintended horizontal overflow.
 */
export async function assertNoHorizontalOverflow(page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  // Allow at most 1px tolerance for subpixel rendering
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
}

/**
 * Saves a screenshot organized by project and test name into test-results/screenshots.
 */
export async function captureScreenshot(page, testInfo, screenshotName) {
  const projectName = testInfo.project.name || 'default';
  const dir = path.join('test-results', 'screenshots', projectName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, `${screenshotName}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}
