import { expect, test, type Page } from '@playwright/test';
import { kicker, nextButton, open, pageOverflow, readyLessons, requireLessons, settledFrame, stepCount } from './support';

/**
 * D1, reading a lesson on a desktop (`prototypes/d1-lesson-reading.md` §10): Learn's and Practice's wider words
 * column, the log folded to its head, and the source numbers in Practice's feedback. Each test sets its own window,
 * so the file runs once, in d1440-dark.
 */
const LESSONS = readyLessons();
requireLessons(LESSONS);

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'd1440-dark', 'D1 sets its own window sizes, so it runs once.');
});

const pathOf = (slug: string): string => {
  const lesson = LESSONS.find((l) => l.slug === slug);
  if (lesson === undefined) throw new Error(`No ready lesson ${slug}.`);
  return lesson.path;
};

type Size = { width: number; height: number };
const S1440: Size = { width: 1440, height: 900 };
const S1280: Size = { width: 1280, height: 720 };

/** Opens a lesson's Learn or Practice (the unit's Overview, its steps, then Learn, then Practice). */
async function openAt(page: Page, slug: string, place: 'learn' | 'practice'): Promise<void> {
  const path = pathOf(slug);
  await open(page, path);
  const steps = await stepCount(page);
  await open(page, `${path}?step=${steps + (place === 'learn' ? 1 : 2)}`);
  await expect(kicker(page)).toHaveText(place === 'learn' ? /Learn$/ : /Practice$/);
  await settledFrame(page);
}

const box = async (page: Page, selector: string) => {
  const b = await page.locator(selector).first().boundingBox();
  if (b === null) throw new Error(`${selector} has no box.`);
  return { width: Math.round(b.width), height: Math.round(b.height), x: Math.round(b.x), y: Math.round(b.y) };
};

/** Check 1. */
for (const size of [S1440, S1280]) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`Learn and Practice fit the window at ${size.width}×${size.height}, ${scheme}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.emulateMedia({ colorScheme: scheme });
      for (const [slug, place] of [['osi-model', 'learn'], ['dhcp', 'practice']] as const) {
        await openAt(page, slug, place);
        expect(await pageOverflow(page), `${slug} ${place}`).toEqual({ down: 0, sideways: 0 });
      }
    });
  }
}

/** Checks 2, 4 and 5. */
test('the words column is 560px at 1440 and 480px at 1280 in Learn and Practice, and as before elsewhere', async ({ page }) => {
  for (const [size, words, scene, before] of [[S1440, 560, 564, 389], [S1280, 480, 484, 348]] as const) {
    await page.setViewportSize(size);
    for (const place of ['learn', 'practice'] as const) {
      await openAt(page, 'osi-model', place);
      expect((await box(page, '.console__explain')).width, `${place} words at ${size.width}`).toBe(words);
      expect((await box(page, '.console__stage')).width, `${place} scene at ${size.width}`).toBe(scene);
    }
    // The Overview and a Watch step keep today's column.
    await open(page, pathOf('osi-model'));
    expect((await box(page, '.console__explain')).width, `Overview at ${size.width}`).toBe(before);
    await nextButton(page).click();
    await expect(kicker(page)).toContainText('Step 1');
    expect((await box(page, '.console__explain')).width, `Watch at ${size.width}`).toBe(before);
  }
});

test('at 1100×700 Learn keeps 348px for the words', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 700 });
  await openAt(page, 'osi-model', 'learn');
  expect((await box(page, '.console__explain')).width).toBe(348);
});

/**
 * The median length, in characters, of a full line of an element's text, counted as D1 §9 does: each character is
 * placed by its box, characters sharing a top edge are a line, source marks are left out, the last line is dropped.
 */
async function medianLine(page: Page, selector: string): Promise<{ median: number; lines: number }> {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel)!;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const lines: number[] = [];
    let top = Number.NaN;
    const range = document.createRange();
    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
      if ((node.parentElement as Element).closest('sup') !== null) continue;
      const text = node.textContent ?? '';
      for (let i = 0; i < text.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rect = range.getBoundingClientRect();
        if (rect.width === 0) continue;
        if (Number.isNaN(top) || Math.abs(rect.top - top) > 8) {
          lines.push(0);
          top = rect.top;
        }
        lines[lines.length - 1]!++;
      }
    }
    const full = lines.slice(0, -1).sort((a, b) => a - b);
    const mid = full.length / 2;
    return { median: full.length % 2 ? full[(full.length - 1) / 2]! : (full[mid - 1]! + full[mid]!) / 2, lines: lines.length };
  }, selector);
}

/** Check 3: the unit's own check, the lead's line length. */
for (const [size, low, high] of [[S1440, 62, 70], [S1280, 52, 60]] as const) {
  test(`OSI Model's lead runs ${low} to ${high} characters a line at ${size.width} wide`, async ({ page }) => {
    await page.setViewportSize(size);
    await openAt(page, 'osi-model', 'learn');
    const { median, lines } = await medianLine(page, '.explain__narr');
    expect(lines).toBeGreaterThan(10);
    expect(median).toBeGreaterThanOrEqual(low);
    expect(median).toBeLessThanOrEqual(high);
  });
}

/** Check 6. */
test('on every lesson at 1280×720 nothing in Learn is cut or scrolls sideways, and the scene head is 50px', async ({ page }) => {
  await page.setViewportSize(S1280);
  for (const lesson of LESSONS) {
    await openAt(page, lesson.slug, 'learn');
    const found = await page.evaluate(() => {
      const bad: string[] = [];
      for (const el of document.querySelectorAll('.tpanel, .rpanel')) if (el.scrollWidth > el.clientWidth) bad.push(`${el.className} scrolls sideways`);
      const title = document.querySelector('.stage__title');
      if (title !== null && (title.scrollWidth > title.clientWidth || title.scrollHeight > title.clientHeight)) bad.push('the scene title is cut');
      const head = document.querySelector('.stage__head')!.getBoundingClientRect().height;
      if (Math.round(head) !== 50) bad.push(`the scene head is ${head}px`);
      return bad;
    });
    expect(found, lesson.slug).toEqual([]);
  }
});

/** Checks 9 and 10, with the live region's words. */
test('Practice’s feedback takes no room before a pick, and its marks are 11.2px', async ({ page }) => {
  await page.setViewportSize(S1440);
  await openAt(page, 'osi-model', 'practice');
  const feedback = page.locator('.practice__feedback').first();
  expect((await feedback.boundingBox())?.height).toBe(0);
  await page.locator('.practice__question').first().locator('.practice__option').first().click();
  const marks = feedback.locator('sup.explain__marks a');
  await expect(marks).toHaveText(['1', '3', '4']);
  expect(await marks.first().evaluate((a) => getComputedStyle(a.parentElement!).fontSize)).toBe('11.2px');
  expect(await feedback.getAttribute('aria-live')).toBeNull();
  expect(await feedback.locator('.practice__say').getAttribute('aria-live')).toBe('polite');
});

/** Check 11. */
test('on a phone the page is one screen, and Practice shows its marks', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openAt(page, 'osi-model', 'practice');
  expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
  await page.locator('.practice__question').first().locator('.practice__option').first().click();
  await expect(page.locator('.practice__feedback').first().locator('sup.explain__marks a')).toHaveText(['1', '3', '4']);
  expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
});

/** Check 12. */
for (const [size, explainHeight] of [[S1440, 730], [S1280, 550]] as const) {
  test(`the log starts folded in Learn and Practice at ${size.width}×${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    for (const place of ['learn', 'practice'] as const) {
      await openAt(page, 'osi-model', place);
      await expect(page.locator('.log__scroll')).toBeHidden();
      await expect(page.locator('.log__legend')).toBeHidden();
      expect((await box(page, '.console__log')).height).toBe(52);
      expect(await page.locator('.console__explain').evaluate((el) => el.clientHeight)).toBe(explainHeight);
    }
  });
}

/** Checks 13 and 14. */
for (const [size, logHeight] of [[S1440, 234], [S1280, 200]] as const) {
  test(`"Show log" opens the log to ${logHeight}px at ${size.height} tall, and it stays open across places`, async ({ page }) => {
    await page.setViewportSize(size);
    await openAt(page, 'dhcp', 'learn');
    const button = page.getByRole('button', { name: /^(Show|Hide) log$/ });
    await expect(button).toHaveText('Show log');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await expect(button).toHaveText('Hide log');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.console')).toHaveAttribute('data-log', 'open');
    expect((await box(page, '.console__log')).height).toBe(logHeight);
    expect(await page.evaluate(() => document.activeElement?.classList.contains('log__fold'))).toBe(true);
    // The newest row is in view: the box is scrolled to its end.
    expect(await page.locator('.log__scroll').evaluate((el) => el.scrollHeight - el.clientHeight - el.scrollTop)).toBeLessThanOrEqual(1);

    // Practice, then a Watch step and back to Learn: still open.
    await nextButton(page).click();
    await expect(kicker(page)).toHaveText(/Practice$/);
    await expect(page.locator('.console')).toHaveAttribute('data-log', 'open');
    await page.getByRole('button', { name: 'Previous step', exact: true }).click();
    await page.getByRole('button', { name: 'Previous step', exact: true }).click();
    await expect(kicker(page)).toContainText('Step');
    await nextButton(page).click();
    await expect(kicker(page)).toHaveText(/Learn$/);
    await expect(page.locator('.console')).toHaveAttribute('data-log', 'open');

    await button.click();
    await expect(button).toHaveText('Show log');
    expect((await box(page, '.console__log')).height).toBe(52);
  });
}

/** Check 15. */
test('the fold button is not shown at the Overview, on a Watch step, at 1024 wide or on a phone', async ({ page }) => {
  await page.setViewportSize(S1440);
  await open(page, pathOf('dhcp'));
  await expect(page.locator('.log__fold')).toBeHidden();
  await nextButton(page).click();
  await expect(kicker(page)).toContainText('Step 1');
  await expect(page.locator('.log__fold')).toBeHidden();
  expect((await box(page, '.console__log')).height).toBeGreaterThan(150);
  for (const size of [{ width: 1024, height: 768 }, { width: 375, height: 812 }]) {
    await page.setViewportSize(size);
    await openAt(page, 'dhcp', 'learn');
    await expect(page.locator('.log__fold')).toBeHidden();
  }
});

/** Check 16. */
test('the step controls keep their place between a Watch step and Learn', async ({ page }) => {
  await page.setViewportSize(S1440);
  await open(page, pathOf('osi-model'));
  await nextButton(page).click();
  await expect(kicker(page)).toContainText('Step 1');
  const watch = await box(page, '.console__controls .cbtn[aria-label="Next step"]');
  await openAt(page, 'osi-model', 'learn');
  const learn = await box(page, '.console__controls .cbtn[aria-label="Next step"]');
  expect(learn.x).toBe(watch.x);
  expect(learn.x).toBe(1377);
});
