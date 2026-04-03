import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { replayTimeline } from '../timeline-helpers';

/**
 * Reads the canvas and returns which shape type is being drawn in the 2x2 grid,
 * determined by sampling key pixels inside the first cell.
 *
 * Sampling strategy (r = shape radius, cx/cy = cell center):
 *   - (cx + r*0.8, cy)         — inside circle/rectangle, OUTSIDE triangle at mid-height
 *   - (cx + r*0.85, cy - r*0.85) — inside rectangle corners, OUTSIDE circle and triangle
 *
 * Truth table:
 *   right-of-center | top-right-corner | shape
 *   ----------------+------------------+------------
 *        filled     |      filled      | rectangle
 *        filled     |    transparent   | circle
 *      transparent  |    transparent   | triangle
 */
async function detectCanvasShape(page: Page): Promise<'circle' | 'rectangle' | 'triangle' | 'unknown'> {
  return page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return 'unknown';
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'unknown';

    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return 'unknown';

    const cellW = w / 2;
    const cellH = h / 2;
    const cx = cellW / 2;
    const cy = cellH / 2;
    const r = Math.min(cellW, cellH) * 0.3;

    const isFilledAt = (x: number, y: number): boolean => {
      const [, , , alpha] = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      return alpha > 128;
    };

    if (!isFilledAt(cx, cy)) return 'unknown';

    const rightOfCenter = isFilledAt(cx + r * 0.8, cy);
    if (!rightOfCenter) return 'triangle';

    const topRightCorner = isFilledAt(cx + r * 0.85, cy - r * 0.85);
    return topRightCorner ? 'rectangle' : 'circle';
  });
}

test.describe('Canvas Testing', () => {
  test('Canvas grid draws correct shape for viewport size', async ({ page }) => {
    await replayTimeline(page, 'CanvasTesting');

    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible' });

    // Let ResizeObserver fire and canvas redraw settle
    await page.waitForTimeout(100);

    const canvasWidth = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement | null;
      return c?.width ?? 0;
    });

    const expectedShape =
      canvasWidth < 300 ? 'rectangle' :
      canvasWidth >= 500 ? 'triangle' :
      'circle';

    const detectedShape = await detectCanvasShape(page);
    expect(detectedShape).toBe(expectedShape);

    // Visual baseline — generated on first run, compared on subsequent runs
    await expect(canvas).toHaveScreenshot('canvas-grid.png');
  });
});
