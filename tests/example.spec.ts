import { test, expect } from '@playwright/test';

test.describe('lib.js — greeting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main.html');
  });

  test('shows "Hello, World!" greeting', async ({ page }) => {
    const heading = page.locator('#greeting');
    await expect(heading).toHaveText('Hello, World!');
  });
});
