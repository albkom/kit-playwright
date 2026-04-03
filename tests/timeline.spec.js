// @ts-check
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const scenariosDir = path.join(__dirname, "..", "scenarios");

// Discover all .json files in the scenarios folder and generate one test per file.
const scenarioFiles = fs
  .readdirSync(scenariosDir)
  .filter((f) => f.endsWith(".json"));

for (const file of scenarioFiles) {
  const scenarioName = path.basename(file, ".json");
  const timeline = JSON.parse(
    fs.readFileSync(path.join(scenariosDir, file), "utf-8"),
  );

  // Sort events by their scheduled time ascending.
  const sorted = [...timeline].sort((a, b) => a.milliseconds - b.milliseconds);

  test(`timeline: ${scenarioName}`, async ({ page }) => {
    await page.goto("/main.html");

    // Replay the timeline, waiting the real elapsed delta between events.
    let elapsed = 0;
    for (const event of sorted) {
      const delay = event.milliseconds - elapsed;
      if (delay > 0) await page.waitForTimeout(delay);
      elapsed = event.milliseconds;

      await page.evaluate(
        ({ type, json }) => {
          window.dispatchEvent(
            new CustomEvent("kit:message", { detail: { type, json } }),
          );
        },
        { type: event.type, json: event.json },
      );

      if (event.type === "show") {
        await page
          .locator("#stage > div[data-role='content-area'] > div")
          .first()
          .evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
        await page.waitForTimeout(100); // Allow time for scroll event to process
        await page.locator("#stage button").click();
      }
    }

    // Assert: the stage reflects the last dispatched event.
    if (sorted.length > 0) {
      const last = sorted[sorted.length - 1];
      await expect(page.locator("#stage")).toHaveAttribute(
        "data-last-type",
        last.type,
      );
    }
  });
}
