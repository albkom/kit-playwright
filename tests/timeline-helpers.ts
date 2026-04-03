import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const timelinesDir = path.join(__dirname, '..', 'timelines');

interface TimelineEvent {
  milliseconds: number;
  type: string;
  json: unknown;
}

type EventHandlers = Record<string, (page: Page, event: TimelineEvent) => Promise<void>>;

/**
 * Loads a timeline JSON file, navigates to /main.html, and replays all events
 * in chronological order with real elapsed-time delays between them.
 *
 * @param page - Playwright page
 * @param timelineName - filename without .json extension
 * @param eventHandlers - Optional per-type handlers called after each matching event is dispatched.
 * @returns The sorted events array
 */
export async function replayTimeline(
  page: Page,
  timelineName: string,
  eventHandlers: EventHandlers = {},
): Promise<TimelineEvent[]> {
  const timeline: TimelineEvent[] = JSON.parse(
    fs.readFileSync(path.join(timelinesDir, timelineName + '.json'), 'utf-8'),
  );

  const sorted = [...timeline].sort((a, b) => a.milliseconds - b.milliseconds);

  await page.goto('/main.html');

  let elapsed = 0;
  for (const event of sorted) {
    const delay = event.milliseconds - elapsed;
    if (delay > 0) await page.waitForTimeout(delay);
    elapsed = event.milliseconds;

    await page.evaluate(
      ({ type, json }) => {
        window.dispatchEvent(
          new CustomEvent('kit:message', { detail: { type, json } }),
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
