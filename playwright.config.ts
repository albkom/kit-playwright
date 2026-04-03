import { defineConfig, devices } from '@playwright/test';
import deviceEntries from './devices.json';

type CustomDevice = {
  name: string;
  viewport?: { width: number; height: number };
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  userAgent?: string;
};
type DeviceEntry = string | CustomDevice;

const projects = (deviceEntries as DeviceEntry[]).map((entry) => {
  if (typeof entry === 'string') {
    return { name: entry, use: { ...devices[entry] } };
  }
  const { name, ...use } = entry;
  return { name, use };
});

export default defineConfig({
  testDir: './tests',

  // Run tests in parallel across workers
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry once on CI to reduce flakiness
  retries: process.env.CI ? 1 : 0,

  use: {
    // Base URL makes page.goto('/') work in tests
    baseURL: 'http://localhost:3000',

    // Collect traces on first retry to help debugging
    trace: 'on-first-retry',
  },

  // Start a local static server that serves the src/ directory before the tests run
  webServer: {
    command: 'npx serve src --listen 3000 --no-clipboard',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

  projects,
});
