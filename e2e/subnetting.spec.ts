import { expect, test, type Page } from '@playwright/test';
import { DESKTOP, onlyInDesktopDark, PHONE, RUN_TIMEOUT } from './batch1';
import { open, pageOverflow, playButton, setSpeed } from './support';

/**
 * Subnetting's Bits board after D12's fitted board (design D12 §2.1 and §11.2, and the attack cases of
 * prototypes/d12-cases.md for Subnetting: checks 21, 22 and 25, H7, H8, H9 and 22b). The board's CSS changed under 640 px
 * for IP Address's sake, and Subnetting is the lesson whose marigold line shows it: the line must still fall between the
 * right two bits, at 375 as a segment in each shown row's bits, at 1440 exactly where it was.
 *
 * It plays the lesson once at each size and reads the board whenever it has held still for a moment, so every board the
 * lesson draws (the /24, /26 and /30 ones, with one, two and three rows) is measured.
 */
const PATH = '/networking/subnetting';
onlyInDesktopDark(PATH);

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
interface Sample {
  after: number;
  rows: number;
  line: Box & { width: number; height: number };
  shadow: string;
  /** Each shown or hidden row's bits' box, its label's box, its address's box, in row order. */
  tops: number[];
  labels: Box[];
  decimals: Box[];
  /** The first row's 32 cells, left to right. */
  cells: Box[];
  cellsLeft: number;
}
interface Seen {
  samples: Sample[];
  scrollX: number;
  pageSideways: number;
}

/** Starts watching the board a frame at a time: a sample is taken once the line has held still for `still` ms. */
function watchBits(page: Page, still: number): Promise<void> {
  return page.evaluate((hold) => {
    const seen: Seen = { samples: [], scrollX: 0, pageSideways: 0 };
    (window as unknown as { __bits: Seen }).__bits = seen;
    const box = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    };
    let last = '';
    let since = 0;
    let taken = true;
    const tick = (now: number) => {
      const bits = document.querySelector<HTMLElement>('.bits');
      const line = bits?.querySelector<HTMLElement>('.bits__line') ?? null;
      if (bits !== null) seen.scrollX = Math.max(seen.scrollX, bits.scrollWidth - bits.clientWidth);
      const root = document.scrollingElement ?? document.documentElement;
      seen.pageSideways = Math.max(seen.pageSideways, root.scrollWidth - root.clientWidth);
      if (bits !== null && line !== null && bits.getBoundingClientRect().width > 0) {
        const signature = JSON.stringify([box(line), getComputedStyle(line).boxShadow, line.dataset.after, line.style.getPropertyValue('--rows')]);
        if (signature !== last) {
          last = signature;
          since = now;
          taken = false;
        } else if (!taken && now - since >= hold) {
          taken = true;
          const trs = [...bits.querySelectorAll<HTMLElement>('tbody tr')];
          const lb = box(line);
          seen.samples.push({
            after: Number(line.dataset.after),
            rows: Number(line.style.getPropertyValue('--rows')),
            line: { ...lb, width: lb.right - lb.left, height: lb.bottom - lb.top },
            shadow: getComputedStyle(line).boxShadow,
            tops: trs.map((tr) => box(tr.querySelector('.bits__cells')!).top),
            labels: trs.map((tr) => box(tr.querySelector('th')!)),
            decimals: trs.map((tr) => box(tr.querySelector('.bits__dec')!)),
            cells: [...trs[0]!.querySelectorAll('.bits__cell')].map(box),
            cellsLeft: box(trs[0]!.querySelector('.bits__cells')!).left,
          });
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, still);
}
const watched = (page: Page): Promise<Seen> => page.evaluate(() => (window as unknown as { __bits: Seen }).__bits);

/** Plays the lesson at 2× from its Overview, with the board being watched, and waits for the run to end. */
async function playAll(page: Page): Promise<Seen> {
  await setSpeed(page, '2×');
  await playButton(page).click();
  await expect(playButton(page)).toHaveText('Pause');
  await expect(playButton(page)).toHaveText('Replay', { timeout: RUN_TIMEOUT });
  await page.waitForTimeout(600);
  return watched(page);
}

/** The shadows of a computed box-shadow, as [x, y, blur, spread] each. */
function shadowsOf(value: string): number[][] {
  return [...value.matchAll(/rgba?\([^)]*\)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/g)].map((m) => m.slice(1, 5).map(Number));
}
const overlaps = (a: Box, b: Box): boolean => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

test('at 375 the Bits tab never scrolls, the line is a segment in each shown row’s bits between the right two bits, and the column headers stay', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize(PHONE);
  await open(page, PATH);
  await page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Bits/ }).click();
  await expect(page.locator('.bits')).toBeVisible();
  await watchBits(page, 200);
  const seen = await playAll(page);

  expect(seen.scrollX, 'the Bits tab scrolls sideways').toBeLessThanOrEqual(0);
  expect(seen.pageSideways, 'the page scrolls sideways').toBeLessThanOrEqual(0);
  expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
  // Every kind of board the lesson draws was measured: the /24, /26 and /30 lines, over one, two and three rows.
  const afters = new Set(seen.samples.map((s) => s.after));
  expect([...afters].sort()).toEqual([24, 26, 30]);
  expect([...new Set(seen.samples.map((s) => s.rows))].sort()).toEqual([1, 2, 3]);

  for (const s of seen.samples) {
    const at = `/${s.after} over ${s.rows} rows`;
    // H7: the line's centre is between bit `prefix` and bit `prefix + 1`.
    const centre = s.line.left + s.line.width / 2;
    expect(centre, `${at}: the line is left of bit ${s.after}`).toBeGreaterThanOrEqual(s.cells[s.after - 1]!.right - 0.01);
    expect(centre, `${at}: the line is right of bit ${s.after + 1}`).toBeLessThanOrEqual(s.cells[s.after]!.left + 0.01);
    for (let k = 0; k < s.rows; k++) {
      // 22b: row k's segment is 3 px over its bits at each end, 51 px below the one before.
      expect(Math.abs(s.line.top + 3 + k * 51 - s.tops[k]!), `${at}: row ${k + 1}'s segment`).toBeLessThanOrEqual(0.5);
      // And never over its label or its address.
      const seg = { left: s.line.left, right: s.line.right, top: s.tops[k]! - 3, bottom: s.tops[k]! + 21 };
      expect(overlaps(seg, s.labels[k]!), `${at}: row ${k + 1}'s segment is over its label`).toBe(false);
      expect(overlaps(seg, s.decimals[k]!), `${at}: row ${k + 1}'s segment is over its address`).toBe(false);
    }
    // The line's own element is the first row's: its cells and 3 px over each end.
    expect(s.line.height).toBeCloseTo(24, 0);
    // The copies: a non-negative spread exactly for the rows 2 to `--rows`, and none drawn for the rest.
    const [two, three] = shadowsOf(s.shadow);
    expect(two![1], `${at}: the second copy sits 51 px down`).toBe(51);
    expect(three![1], `${at}: the third copy sits 102 px down`).toBe(102);
    expect(two![3] >= 0, `${at}: row 2's copy`).toBe(s.rows >= 2);
    expect(three![3] >= 0, `${at}: row 3's copy`).toBe(s.rows >= 3);
  }
  // H9: the three column headers are still in the page's accessibility tree.
  await expect(page.locator('.bits').getByRole('columnheader')).toHaveCount(3);
  await expect(page.locator('.bits').getByRole('table')).toHaveCount(1);
});

test('at 1440 the line is where it always was: 93 px an octet and 11 px a bit, 22 px a row and 2 over, at /24, /26 and /30', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await expect(page.locator('.bits')).toBeVisible();
  await watchBits(page, 200);
  const seen = await playAll(page);
  expect([...new Set(seen.samples.map((s) => s.after))].sort()).toEqual([24, 26, 30]);
  expect([...new Set(seen.samples.map((s) => s.rows))].sort()).toEqual([1, 2, 3]);
  for (const s of seen.samples) {
    const octets = Math.floor(s.after / 8);
    const bits = s.after % 8;
    // The values recorded before the change: past whole octets of 93 px and bits of 11 px, in the middle of the gap there.
    const was = s.cellsLeft + octets * 93 + bits * 11 - 3 + 2.5 * Math.min(bits, 1) - 1;
    expect(s.line.left, `/${s.after}`).toBeCloseTo(was, 1);
    expect(s.line.height, `/${s.after} over ${s.rows} rows`).toBeCloseTo(s.rows * 22 + 2, 1);
    const centre = s.line.left + s.line.width / 2;
    expect(centre).toBeGreaterThanOrEqual(s.cells[s.after - 1]!.right - 0.01);
    expect(centre).toBeLessThanOrEqual(s.cells[s.after]!.left + 0.01);
    // No copies at this width: the one line.
    expect(s.shadow).toBe('none');
    expect(s.cells[1]!.left - s.cells[0]!.left).toBeCloseTo(11, 1);
  }
});
