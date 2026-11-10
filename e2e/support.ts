import { expect, test, type Locator, type Page } from '@playwright/test';

// ---------------------------------------------------------------- the ready lessons

/** A ready lesson, as a built track page lists it (`global-setup.ts`). */
export interface ReadyLesson {
  /** The last part of its address, such as `dhcp`. */
  slug: string;
  title: string;
  /** Its page, such as `/networking/dhcp` or `/how-the-internet-works/what-is-http`. */
  path: string;
}

/** Where `global-setup.ts` leaves the lessons it found for the specs. */
export const LESSONS_ENV = 'TECHCONCEPTS_E2E_LESSONS';

/**
 * Node's environment variables, which Playwright passes from the global setup to every worker. (The e2e files are
 * type-checked with the site's settings, which have no Node types, hence the cast.)
 */
export const nodeEnv = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process.env;

/**
 * The ready lessons the built site's track pages link to. Empty only when the global setup has not run (as with
 * `--list`); `requireLessons` turns that into a failing test rather than a suite that checks nothing.
 */
export function readyLessons(): ReadyLesson[] {
  const raw = nodeEnv[LESSONS_ENV];
  return raw === undefined ? [] : (JSON.parse(raw) as ReadyLesson[]);
}

/** A test that fails when no ready lesson was found, so a spec that loops over none cannot pass by checking nothing. */
export function requireLessons(lessons: ReadyLesson[]): void {
  test('the built track pages link to the ready lessons to check', () => {
    expect(lessons.length, 'global-setup.ts found no ready lesson on the track pages').toBeGreaterThan(0);
  });
}

/** A ready lesson's stop on the track page's route, found by the slug its title links to (a lesson in progress links to `?step=N`). */
export const lessonCard = (page: Page, slug: string): Locator =>
  page.locator('main .route li.stop:not(.stop--soon)', { has: page.locator(`h3 a[href$="/${slug}"], h3 a[href*="/${slug}?"]`) });

/** Every page outside the lessons, by the address it is served at. */
export const SITE_PAGES = [
  { name: 'home', path: '/' },
  { name: 'tracks', path: '/tracks' },
  { name: 'track-internet', path: '/how-the-internet-works' },
  { name: 'track', path: '/networking' },
  { name: 'about', path: '/about' },
  { name: '404', path: '/does-not-exist' },
] as const;

// ---------------------------------------------------------------- pages

/** Island markers lose `ssr` once React is listening. */
export async function hydrated(page: Page): Promise<void> {
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

/** Opens a page and waits until its islands are listening. */
export async function open(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await hydrated(page);
}

/**
 * Every page error and console error from here on. The 404 page's own "404 (Not Found)" for the document is
 * expected, and is the only one left out.
 */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const url = message.location().url;
    const expected404 = /status of 404/.test(message.text()) && url !== '' && new URL(url).pathname === '/does-not-exist';
    if (!expected404) errors.push(`console error: ${message.text()} (${url})`);
  });
  return errors;
}

/** Waits two frames, so layout and any effect a change set off have run before a measurement. */
export function settledFrame(page: Page): Promise<void> {
  return page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

/** How far the page itself overflows the window, down and sideways, in CSS pixels; 0 when it does not. */
export async function pageOverflow(page: Page): Promise<{ down: number; sideways: number }> {
  await settledFrame(page);
  return page.evaluate(() => {
    const root = document.scrollingElement ?? document.documentElement;
    return { down: Math.max(0, root.scrollHeight - window.innerHeight), sideways: Math.max(0, root.scrollWidth - window.innerWidth) };
  });
}

// ---------------------------------------------------------------- the lesson console

/** The explanation's kicker ("Overview", "Watch · Step 2 of 5", "DNS · Learn"): it differs from one position to the next. */
export const kicker = (page: Page): Locator => page.locator('.console__explain .explain__kicker');
export const playButton = (page: Page): Locator => page.locator('.console__controls .cbtn--play');
export const nextButton = (page: Page): Locator => page.getByRole('button', { name: 'Next step', exact: true });
export const speedButton = (page: Page): Locator => page.locator('.console__controls .cbtn--speed');
export const viewSwitch = (page: Page): Locator => page.getByRole('group', { name: 'View', exact: true });
/** The log's rows, without the line it shows while it is empty. */
export const logRows = (page: Page): Locator => page.locator('.console__log tbody tr:not(:has(td[data-idle]))');

/** Where the console is, and what the page looks like there, two frames after it got there. */
export interface Position {
  /** The kicker, such as "DNS · Step 2 of 5". */
  kicker: string;
  /** How far the page overflows the window, down and sideways, in CSS pixels; 0 when it fits. */
  down: number;
  sideways: number;
  /** How many Network / Sequence switches the scene has (0 or 1). */
  viewSwitches: number;
  /** Whether Previous and Next are at the lesson's ends. */
  atStart: boolean;
  atEnd: boolean;
}

/**
 * Reads the console's position in one call to the page: when `leaving` is given, it first waits (every frame, for
 * up to 10 s) for the kicker to differ from it, then two more frames so layout and effects have run. One round trip
 * a position keeps lesson 1's walks of some 240 positions short.
 */
export async function position(page: Page, leaving?: string): Promise<Position> {
  return page.evaluate(async (was) => {
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const kickerText = () => document.querySelector('.console__explain .explain__kicker')?.textContent ?? '';
    if (was !== null) {
      const deadline = performance.now() + 10_000;
      while (kickerText() === was || kickerText() === '') {
        if (performance.now() > deadline) throw new Error(`The console did not move from "${was}" within 10 s.`);
        await frame();
      }
    }
    await frame();
    await frame();
    const root = document.scrollingElement ?? document.documentElement;
    const disabled = (label: string) =>
      document.querySelector(`.console__controls button[aria-label="${label}"]`)?.getAttribute('aria-disabled') === 'true';
    return {
      kicker: kickerText(),
      down: Math.max(0, root.scrollHeight - window.innerHeight),
      sideways: Math.max(0, root.scrollWidth - window.innerWidth),
      viewSwitches: document.querySelectorAll('[role="group"][aria-label="View"]').length,
      atStart: disabled('Previous step'),
      atEnd: disabled('Next step'),
    };
  }, leaving ?? null);
}

/** Does `action`, then waits until the console has moved to another position, and returns it. */
export async function moveBy(page: Page, action: () => Promise<void>): Promise<Position> {
  const before = (await kicker(page).textContent()) ?? '';
  await action();
  return position(page, before);
}

/**
 * Presses a lesson key with nothing focused, and waits for the move. Shortcuts are ignored on buttons and fields by
 * design, so focus is dropped first, in the same round trip that reads the kicker.
 */
export async function pressKey(page: Page, key: 'ArrowRight' | 'ArrowLeft'): Promise<Position> {
  const before = await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    return document.querySelector('.console__explain .explain__kicker')?.textContent ?? '';
  });
  await page.keyboard.press(key);
  return position(page, before);
}

/** Sets the speed button to `speed` (it cycles 0.5×, 1×, 1.5×, 2× from 1×). */
export async function setSpeed(page: Page, speed: '0.5×' | '1×' | '1.5×' | '2×'): Promise<void> {
  for (let i = 0; i < 4 && (await speedButton(page).textContent()) !== speed; i += 1) await speedButton(page).click();
  await expect(speedButton(page)).toHaveText(speed);
}

/** How many Watch steps the current unit has: the top bar draws one segment per step in its first group. */
export function stepCount(page: Page): Promise<number> {
  return page.locator('.topbar__segments .topbar__group').first().locator('.topbar__step').count();
}

/**
 * The places a walk visited, from their kickers, checked against the lesson's shape: each unit runs Overview, Step 1
 * of N to Step N of N, Learn, then Practice, and a lesson of many units names each unit as it goes. Returns the
 * number of units seen.
 */
export function expectLessonShape(kickers: string[]): number {
  const parsed = kickers.map((k) => {
    const parts = k.split(' · ');
    const place = parts.at(-1) ?? '';
    // A lesson of one unit says "Watch · Step 2 of 5"; one of many units says "DNS · Step 2 of 5".
    const unit = parts.length > 1 && parts[0] !== 'Watch' ? parts[0]! : '';
    return { unit, place };
  });
  let units = 0;
  let i = 0;
  while (i < parsed.length) {
    const unit = parsed[i]!.unit;
    expect(parsed[i]!.place, `position ${i} should open a unit`).toBe('Overview');
    const first = /^Step 1 of (\d+)$/.exec(parsed[i + 1]?.place ?? '');
    expect(first, `position ${i + 1} should be the unit's first step, not "${kickers[i + 1]}"`).not.toBeNull();
    const n = Number(first![1]);
    const expected = ['Overview', ...Array.from({ length: n }, (_, s) => `Step ${s + 1} of ${n}`), 'Learn', 'Practice'];
    const got = parsed.slice(i, i + expected.length);
    expect(got.map((p) => p.place), `unit ${units + 1}`).toEqual(expected);
    for (const p of got) expect(p.unit, `unit ${units + 1}'s positions name one unit`).toBe(unit);
    i += expected.length;
    units += 1;
  }
  return units;
}

/** The scroll containers above an element that hide any part of it: inside the viewport is not enough if a scrolling panel clips it. */
export function clippingContainers(target: Locator): Promise<string[]> {
  return target.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const clipped: string[] = [];
    for (let node = el.parentElement; node !== null; node = node.parentElement) {
      const { overflowX, overflowY } = getComputedStyle(node);
      if (![overflowX, overflowY].some((value) => value === 'auto' || value === 'scroll' || value === 'hidden' || value === 'clip')) continue;
      const room = node.getBoundingClientRect();
      if (box.top < room.top - 0.5 || box.bottom > room.bottom + 0.5 || box.left < room.left - 0.5 || box.right > room.right + 0.5) {
        clipped.push(node.className || node.tagName);
      }
    }
    return clipped;
  });
}

/**
 * The lesson figure as plain text, one element a line, so two figures can be compared: attributes sorted, the
 * declarations of a style attribute and the names in a class attribute sorted, decimals rounded to two places.
 * The driver's `data-settling` (on only while a change is applied) is left out.
 */
export function figureSnapshot(page: Page): Promise<string[]> {
  return page.locator('.stage__figure svg[data-figure]').evaluate((svg) => {
    const lines: string[] = [];
    const round = (s: string) => s.replace(/-?\d+\.\d+/g, (m) => String(Math.round(Number(m) * 100) / 100));
    const walk = (el: Element, depth: number): void => {
      const attributes = [...el.attributes]
        .filter((a) => a.name !== 'data-settling')
        .map((a) => {
          let value = a.value;
          if (a.name === 'style') {
            value = value
              .split(';')
              .map((d) => d.trim().replace(/\s*:\s*/, ':'))
              .filter(Boolean)
              .sort()
              .join(';');
          }
          if (a.name === 'class') value = value.split(/\s+/).filter(Boolean).sort().join(' ');
          return `${a.name}="${round(value)}"`;
        })
        .sort();
      lines.push(`${' '.repeat(depth)}<${el.tagName} ${attributes.join(' ')}>`);
      for (const child of el.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) walk(child as Element, depth + 1);
        else if (child.nodeType === Node.TEXT_NODE && (child.textContent ?? '').trim() !== '') {
          lines.push(`${' '.repeat(depth + 1)}"${(child.textContent ?? '').trim()}"`);
        }
      }
    };
    walk(svg, 0);
    return lines;
  });
}
