import { expect, test, type Page } from '@playwright/test';
import { collectErrors, hydrated, lessonCard, open, pageOverflow, playButton, replayButton, setSpeed } from './support';

/**
 * Router's page checks (design D10, spec §8 and the attack cases in prototypes/d10-cases.md): the ones that need a
 * browser. They run against the real lesson, so each test skips itself while `/networking/router` has no page: the
 * check is the HTTP status of the built site's answer, 404 until the lesson file exists (unit B12b).
 *
 * The tests set their own window sizes (375 × 812 and 1440 × 900) and, for one, reduced motion, so they run once, in
 * the d1440-dark project, rather than at every desktop size.
 */
const PATH = '/networking/router';
const RUN_TIMEOUT = 150_000;

test.beforeEach(async ({ request }, info) => {
  test.skip(info.project.name !== 'd1440-dark', 'These tests set their own window; they run in d1440-dark only.');
  const answer = await request.get(PATH);
  test.skip(answer.status() === 404, 'Router has no page yet (B12b adds its lesson).');
});

const PHONE = { width: 375, height: 812 };
const DESKTOP = { width: 1440, height: 900 };

const tableTab = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Table/ });
const figure = (page: Page) => page.locator('svg[data-figure="net-map"]');

/** Plays the unit at 2× from its Overview, and waits for the run to end on its last step. */
async function playToEnd(page: Page): Promise<void> {
  await setSpeed(page, '2×');
  await playButton(page).click();
  await expect(playButton(page)).toHaveText('Pause');
  await expect(playButton(page)).toHaveText('Play all', { timeout: RUN_TIMEOUT });
}

/**
 * Watches the page from here until `done` resolves, a frame at a time, and reports what it saw of the table panel and
 * the map: the widest the panel got past its box, the tallest, the most candidate rows at once, whether a no-match row
 * ever showed, and the by-lines in the order they changed.
 */
function watchPanel(page: Page) {
  return page.evaluate(() => {
    const seen = { overflowX: 0, overflowY: 0, candidates: 0, noMatch: false, byLines: [] as string[], pageSideways: 0 };
    (window as unknown as { __watch: typeof seen }).__watch = seen;
    const tick = () => {
      const panel = document.querySelector<HTMLElement>('.tpanel');
      if (panel !== null) {
        seen.overflowX = Math.max(seen.overflowX, panel.scrollWidth - panel.clientWidth);
        seen.overflowY = Math.max(seen.overflowY, panel.scrollHeight - panel.clientHeight);
        seen.candidates = Math.max(seen.candidates, panel.querySelectorAll('tr[data-candidate]').length);
        seen.noMatch ||= panel.querySelector('tr.tpanel__nomatch') !== null;
        const by = panel.querySelector('.tpanel__by')?.textContent?.trim();
        if (by !== undefined && seen.byLines.at(-1) !== by) seen.byLines.push(by);
      }
      const root = document.scrollingElement ?? document.documentElement;
      seen.pageSideways = Math.max(seen.pageSideways, root.scrollWidth - root.clientWidth);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
const watched = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __watch: { overflowX: number; overflowY: number; candidates: number; noMatch: boolean; byLines: string[]; pageSideways: number } })
        .__watch,
  );

test('at 375 the Table tab is marked when a table event plays under another tab, and opening it clears the mark (checks 12 and 13)', async ({ page }) => {
  await page.setViewportSize(PHONE);
  const errors = collectErrors(page);
  await open(page, PATH);
  await expect(tableTab(page)).toHaveAccessibleName('Table');
  await setSpeed(page, '2×');
  await playButton(page).click();
  // Step 1 starts with the laptop's table: the replace is a table event, and the Explain tab is showing.
  await expect(tableTab(page)).toHaveAccessibleName('Table, changed', { timeout: 30_000 });
  await tableTab(page).click();
  await expect(page.locator('.tab__mark')).toHaveCount(0);
  await expect(page.locator('.tpanel')).toBeVisible();
  expect(errors).toEqual([]);
});

test('at 375 the panel never scrolls sideways at any step, and the page never scrolls', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  await page.setViewportSize(PHONE);
  await open(page, PATH);
  await tableTab(page).click();
  await watchPanel(page);
  await playToEnd(page);
  const seen = await watched(page);
  expect(seen.overflowX, 'the panel scrolls sideways').toBeLessThanOrEqual(0);
  expect(seen.pageSideways, 'the page scrolls sideways').toBeLessThanOrEqual(0);
  expect(seen.candidates).toBe(2);
  expect(seen.noMatch).toBe(true);
  expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
});

test('at 1440 the panel never scrolls, names each device in turn, and the run ends as the spec says (checks 5, 14 to 19, 22 and 23)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  await page.setViewportSize(DESKTOP);
  const errors = collectErrors(page);
  await open(page, PATH);

  // At the Overview: the resolver is not on the map, the five strips read provider, a, b, c and d, and no mark shows.
  const svg = figure(page);
  await expect(svg.locator('[data-base="resolver"]').first()).toBeHidden();
  const parts = await svg.locator('[data-base="resolver"]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
  expect(parts.length).toBeGreaterThanOrEqual(5);
  expect(parts.every((d) => d === 'none')).toBe(true);
  expect(await svg.locator('.nm-strip text').allTextContents()).toEqual(['provider', 'a', 'b', 'c', 'd']);
  await expect(page.locator('.tpanel__empty')).toHaveText('Each device on the way shows its routing table here, in turn.');
  await expect(page.locator('.tpanel__by')).toHaveCount(0);
  expect(await svg.locator('#nm-discard').evaluate((el) => (el as unknown as SVGElement).style.opacity)).toBe('0');

  await watchPanel(page);
  await playToEnd(page);
  const seen = await watched(page);
  expect(seen.overflowY, 'the panel scrolls').toBeLessThanOrEqual(0);
  expect(seen.overflowX).toBeLessThanOrEqual(0);
  expect(seen.byLines).toEqual([
    'kept by your laptop',
    'kept by your router',
    'kept by your provider’s router',
    'kept by router c',
    'kept by router a',
  ]);

  // The run's end: DROPPED on router a's top, the no-match row last in the table, "No route: dropped" at the laptop.
  await expect(svg.locator('#nm-discard')).toHaveCSS('opacity', '1');
  await expect(page.locator('.tpanel tbody tr').last()).toHaveClass(/tpanel__nomatch/);
  await expect(page.locator('#nm-lapState')).toHaveText('No route: dropped');
  await expect(page.locator('#nm-lapState')).not.toHaveClass(/done/);
  // No LOST mark has been left on the map.
  await expect(svg.locator('#nm-drop')).toHaveCSS('opacity', '0');

  // No two strips overlap, and none overlaps the DROPPED mark, in the browser's own boxes.
  const boxes = await svg.evaluate((root) => {
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return [r.left, r.top, r.right, r.bottom] as const;
    };
    return {
      strips: [...root.querySelectorAll('.nm-strip')].map(rect),
      mark: rect(root.querySelector('#nm-discard')!),
    };
  });
  const overlap = (a: readonly number[], b: readonly number[]) => a[0]! < b[2]! && b[0]! < a[2]! && a[1]! < b[3]! && b[1]! < a[3]!;
  boxes.strips.forEach((a, i) => {
    expect(overlap(a, boxes.mark), `strip ${i} and the DROPPED mark`).toBe(false);
    boxes.strips.slice(i + 1).forEach((b, j) => expect(overlap(a, b), `strips ${i} and ${i + j + 1}`).toBe(false));
  });

  // The log's last four rows are step 5's, in order: the packet to the provider, the packet to router a, the dropped
  // note, and the ICMP message.
  const rows = page.locator('.console__log tbody tr:not(:has(td[data-idle]))');
  const count = await rows.count();
  const glyphs = await rows.evaluateAll((trs) => trs.slice(-4).map((tr) => tr.querySelector('[data-glyph]')?.getAttribute('data-glyph')));
  expect(glyphs).toEqual(['request', 'request', 'dropped', 'control']);
  expect(count).toBeGreaterThanOrEqual(4);
  const last = rows.nth(count - 1);
  await expect(last).toContainText('ICMP');
  await expect(last).toContainText('198.51.100.23');
  await expect(rows.nth(count - 2)).toContainText('router a');
  // The legend lists Packet, Error message and Dropped, and only those.
  expect(await page.locator('.log__legend li').allTextContents()).toEqual(['Packet', 'Error message', 'Dropped']);
  expect(errors).toEqual([]);
});

test('with reduced motion no candidate row animates; with motion it pulses (check 11)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const animationOf = async (reducedMotion: 'reduce' | 'no-preference') => {
    await page.setViewportSize(DESKTOP);
    await page.emulateMedia({ reducedMotion });
    await open(page, `${PATH}?step=3`);
    await setSpeed(page, '1×');
    // With motion the step plays on arrival. With reduced motion it lands complete, so the replay icon plays it, with its waits and no motion.
    if (reducedMotion === 'reduce') await replayButton(page).click();
    const cell = page.locator('.tpanel tr[data-candidate] > td').first();
    await expect(cell).toBeVisible({ timeout: 30_000 });
    return cell.evaluate((td) => getComputedStyle(td).animationName);
  };
  expect(await animationOf('reduce')).toBe('none');
  expect(await animationOf('no-preference')).toBe('tpanel-pulse');
});

test('the Networking track page shows Router’s spot at its stop with its description, and no card throws (check 24)', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  const errors = collectErrors(page);
  await page.goto('/networking');
  await hydrated(page);
  const stop = lessonCard(page, 'router');
  await expect(stop).toHaveCount(1);
  await expect(stop.locator('svg[role="img"]')).toHaveAttribute(
    'aria-label',
    'A round router where three cables meet, one coming in and two going out. A lit packet travels down one of the ways out. In front stands its routing table, three routes long, with the route it chose marked.',
  );
  // It is the eighth stop of the route.
  const stops = page.locator('main .route li.stop');
  expect(await stops.evaluateAll((els, el) => els.indexOf(el as HTMLElement), await stop.elementHandle())).toBe(7);
  expect(errors).toEqual([]);
});
