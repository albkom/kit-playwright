// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('lib.js — greeting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main.html');
  });

  test('shows "Hello, World!" greeting', async ({ page }) => {
    const heading = page.locator('#greeting');
    await expect(heading).toHaveText('Hello, World!');
  });
});

test.describe('lib.js — arithmetic results', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main.html');
  });

  test('3 + 4 equals 7', async ({ page }) => {
    const cell = page.locator('#results tr:nth-child(1) td[data-result]');
    await expect(cell).toHaveAttribute('data-result', '7');
  });

  test('10 - 3 equals 7', async ({ page }) => {
    const cell = page.locator('#results tr:nth-child(2) td[data-result]');
    await expect(cell).toHaveAttribute('data-result', '7');
  });

  test('6 × 7 equals 42', async ({ page }) => {
    const cell = page.locator('#results tr:nth-child(3) td[data-result]');
    await expect(cell).toHaveAttribute('data-result', '42');
  });

  test('15 ÷ 3 equals 5', async ({ page }) => {
    const cell = page.locator('#results tr:nth-child(4) td[data-result]');
    await expect(cell).toHaveAttribute('data-result', '5');
  });

  test('8 ÷ 0 returns error message', async ({ page }) => {
    const cell = page.locator('#results tr:nth-child(5) td[data-result]');
    await expect(cell).toHaveAttribute('data-result', 'Error: Division by zero');
  });
});
