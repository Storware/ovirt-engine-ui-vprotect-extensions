import { defineConfig, devices } from '@playwright/test';
import config from './src/utils/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: { animations: 'disabled' },
  },
  use: {
    baseURL: 'http://localhost:8080',
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: `chromium-${config.build.toLowerCase()}`,
      testMatch: `pages.${config.build.toLowerCase()}.spec.ts`,
      use: {
        ...devices['Desktop Chrome'],
        // Use the same Chromium renderer in headed and headless runs.
        channel: 'chromium',
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
  webServer: {
    command: 'yarn start --port 8080',
    url: 'http://localhost:8080/dashboard',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
