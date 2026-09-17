import { defineConfig, devices } from '@playwright/test';
const remote = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 4,
  reporter: 'list',
  use: { baseURL: remote || 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1512, height: 982 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: remote ? undefined : { command: 'npm run preview -- --host 127.0.0.1 --ignore-lock', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI },
});
