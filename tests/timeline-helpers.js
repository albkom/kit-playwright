// @ts-check
const { expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const timelinesDir = path.join(__dirname, "..", "timelines");

/**
 * Loads a timeline JSON file, navigates to /main.html, and replays all events
 * in chronological order with real elapsed-time delays between them.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} timelineName - filename without .json extension
 * @param {Record<string, (page: import('@playwright/test').Page, event: any) => Promise<void>>} [eventHandlers]
 *   Optional per-type handlers called after each matching event is dispatched.
 * @returns {Promise<any[]>} The sorted events array
 */
async function replayTimeline(page, timelineName, eventHandlers = {}) {
  const timeline = JSON.parse(
    fs.readFileSync(path.join(timelinesDir, timelineName + ".json"), "utf-8"),
  );

  const sorted = [...timeline].sort((a, b) => a.milliseconds - b.milliseconds);

  await page.goto("/main.html");

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

    if (eventHandlers[event.type]) {
      await eventHandlers[event.type](page, event);
    }
  }

  return sorted;
}

module.exports = { replayTimeline };
