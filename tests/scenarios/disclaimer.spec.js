// @ts-check
const { test, expect } = require("@playwright/test");
const { replayTimeline } = require("../timeline-helpers");

test.describe("Disclaimer", () => {
  const scrollToBottomAndClickButton = {
    show: async (page, event) => {
      await page
        .locator("#stage > div[data-role='content-area'] > div")
        .first()
        .evaluate((el) => {
          el.scrollTop = el.scrollHeight;
        });
      await page.waitForTimeout(100);
      await page.locator("#stage button").click();
    },
  };
  
  test("Short Content", async ({ page }) => {
    const events = await replayTimeline(
      page,
      "Disclaimer.Short",
      scrollToBottomAndClickButton,
    );
  });

  test("Long Content", async ({ page }) => {
    const events = await replayTimeline(
      page,
      "Disclaimer.Long",
      scrollToBottomAndClickButton,
    );
  });
});
