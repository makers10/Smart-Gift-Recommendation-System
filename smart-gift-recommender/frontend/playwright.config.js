import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 35000,
  expect: {
    timeout: 8000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:2001',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'off',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:2001',
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    // Desktop Chromium (1440 × 900)
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    // Desktop Firefox (1440 × 900)
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
    },
    // Desktop WebKit (1440 × 900)
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
      },
    },
    // Mobile Viewport 1: 375 × 812 (iPhone X/11/12 mini)
    {
      name: 'mobile-375',
      use: {
        ...devices['iPhone X'],
        viewport: { width: 375, height: 812 },
        isMobile: true,
      },
    },
    // Mobile Viewport 2: 390 × 844 (iPhone 12/13/14)
    {
      name: 'mobile-390',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
      },
    },
    // Tablet Viewport: 768 × 1024 (iPad Mini / Portrait Tablet)
    {
      name: 'tablet-768',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
        isMobile: false,
      },
    },
  ],
});
