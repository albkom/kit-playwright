import { test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { replayTimeline } from '../timeline-helpers';

test.describe('Disclaimer', () => {
  const scrollToBottomAndClickButton = {
    show: async (page: Page) => {
      await page
        .locator("#stage > div[data-role='content-area'] > div")
        .first()
        .evaluate((el: HTMLElement) => {
          el.scrollTop = el.scrollHeight;
        });
      await page.waitForTimeout(100);
      await page.locator('#stage button').click();
    },
  };

  test('Short Content', async ({ page }) => {
    await replayTimeline(page, 'Disclaimer.Short', scrollToBottomAndClickButton);
  });

  test('Long Content', async ({ page }) => {
    await replayTimeline(page, 'Disclaimer.Long', scrollToBottomAndClickButton);
  });
});
