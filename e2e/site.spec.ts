import { expect, test, type Page } from '@playwright/test';

const TOTAL_LESSONS = 19;
const AVAILABLE = [
  { title: 'Subnetting', path: '/networking/subnetting' },
  { title: 'DHCP', path: '/networking/dhcp' },
  { title: 'Firewalls', path: '/networking/firewalls' },
];

/** Island markers lose `ssr` once React is listening. */
async function hydrated(page: Page): Promise<void> {
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

async function blurFocus(page: Page): Promise<void> {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
}

/** Steps a lesson to its Recap with the arrow key; lesson shortcuts ignore buttons, so nothing may hold focus. */
async function stepToRecap(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await hydrated(page);
  const recap = page.getByRole('heading', { level: 2, name: 'Recap' });
  for (let i = 0; i < 14 && !(await recap.isVisible()); i += 1) {
    await blurFocus(page);
    await page.keyboard.press('ArrowRight');
  }
  await expect(recap).toBeVisible();
}

const noHorizontalScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test.describe('Home', () => {
  test('is titled TechConcepts and links to the track', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('TechConcepts');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('main a[href="/networking"]').first()).toBeVisible();
    // The start link goes to the first lesson that exists, and no Continue card shows with no progress.
    await expect(page.getByRole('link', { name: 'Start with Networking Concepts' })).toHaveAttribute('href', '/networking/subnetting');
    await hydrated(page);
    await expect(page.getByRole('link', { name: /^Continue:/ })).toHaveCount(0);
    expect(await noHorizontalScroll(page)).toBe(true);
  });

  test('coming soon cards are not links, and the cert chips link to the filtered track', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.card--soon', { hasText: 'Cryptography' });
    await expect(card).toContainText('Coming soon');
    await expect(card.locator('a')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'CompTIA Security+' })).toHaveAttribute('href', '/networking?for=security-plus');
  });

  test('the skip link reaches the main region', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main')).toHaveCount(1);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  test('the Continue card comes before the start link, which steps back to secondary', async ({ page }) => {
    await stepToRecap(page, '/networking/dhcp');
    await page.goto('/');
    await hydrated(page);
    const card = page.getByRole('link', { name: /^Continue: DHCP/ });
    await expect(card).toBeVisible();
    await expect(card).toContainText('1 of 19 complete');
    const start = page.getByRole('link', { name: 'Start with Networking Concepts' });
    const order = await page.evaluate(() => {
      const a = document.querySelector('.continue-card')!;
      const b = document.querySelector('.hero__start')!;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 'card-first' : 'start-first';
    });
    expect(order).toBe('card-first');
    const background = (locator: typeof start) => locator.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(await background(start)).not.toBe(await background(card));
    expect(await start.evaluate((el) => el.classList.contains('btn--primary'))).toBe(true);
    // Secondary look: it no longer paints the primary (ink) fill.
    const ink = await page.evaluate(() => getComputedStyle(document.querySelector('.continue-card')!).backgroundColor);
    expect(await background(start)).not.toBe(ink);
  });

  test('nothing below the hero moves when the Continue card fills in', async ({ page }) => {
    await stepToRecap(page, '/networking/dhcp');
    await page.goto('/', { waitUntil: 'commit' });
    const top = () => page.locator('#tracks-title').evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.locator('#tracks-title').waitFor();
    const before = await top();
    await expect(page.getByRole('link', { name: /^Continue: DHCP/ })).toBeVisible();
    expect(await top()).toBe(before);
  });
});

test.describe('Track page', () => {
  test('lists all 19 lessons, 16 marked Coming soon', async ({ page }) => {
    await page.goto('/networking');
    await expect(page).toHaveTitle('Networking Concepts · TechConcepts');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('.lesson-row')).toHaveCount(TOTAL_LESSONS);
    await expect(page.locator('.lesson-row__marker', { hasText: 'Coming soon' })).toHaveCount(TOTAL_LESSONS - AVAILABLE.length);
    await expect(page.locator('.lesson-row[data-available="false"] a')).toHaveCount(0);
    expect(await noHorizontalScroll(page)).toBe(true);
  });

  test('clicking each available lesson and stepping it to the Recap raises no page errors', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (error) => errors.push(error));
    for (const lesson of AVAILABLE) {
      await page.goto('/networking');
      await page.getByRole('link', { name: lesson.title, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${lesson.path}$`));
      await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
      const recap = page.getByRole('heading', { level: 2, name: 'Recap' });
      for (let i = 0; i < 14 && !(await recap.isVisible()); i += 1) {
        await blurFocus(page);
        await page.keyboard.press('ArrowRight');
      }
      await expect(recap).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test('?for= filters, chips sync the URL, and an unknown value shows everything', async ({ page }) => {
    await page.goto('/networking?for=security-plus');
    await hydrated(page);
    await expect(page.getByRole('button', { name: 'CompTIA Security+' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.lesson-row')).toHaveCount(1);
    await page.getByRole('button', { name: 'All' }).click();
    await expect(page).toHaveURL(/\/networking$/);
    await expect(page.locator('.lesson-row')).toHaveCount(TOTAL_LESSONS);
    await page.getByRole('button', { name: 'CompTIA Network+' }).click();
    await expect(page).toHaveURL(/\?for=network-plus$/);

    await page.goto('/networking?for=bogus');
    await hydrated(page);
    await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.lesson-row')).toHaveCount(TOTAL_LESSONS);
  });

  test('finishing DHCP shows Finished on the track and a Continue card on Home; Reset clears both at once', async ({ page }) => {
    await stepToRecap(page, '/networking/dhcp');

    await page.goto('/networking');
    await hydrated(page);
    const row = page.locator('.lesson-row', { has: page.getByRole('link', { name: 'DHCP', exact: true }) });
    await expect(row).toContainText('Finished');
    await expect(page.getByText('1 of 19 complete')).toBeVisible();

    await page.getByRole('button', { name: 'Reset progress' }).click();
    await expect(page.getByRole('group', { name: 'Reset all progress on this device?' })).toBeFocused();
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Progress cleared' })).toBeVisible();
    await expect(row).not.toContainText('Finished');
    await expect(page.getByText('0 of 19 complete')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset progress' })).toBeFocused();

    await page.goto('/');
    await hydrated(page);
    await expect(page.getByRole('link', { name: /^Continue:/ })).toHaveCount(0);
  });
});

test.describe('Stats line', () => {
  test('Home card and Track page say "3 of 19 lessons ready" with the total time and level', async ({ page }) => {
    for (const path of ['/', '/networking']) {
      await page.goto(path);
      await expect(page.locator('main')).toContainText(/3 of 19 lessons ready\s*\S*\s*\d+ min in total\s*\S*\s*Beginner/);
    }
  });
});

test.describe('About and 404', () => {
  test('About states where progress lives, credits the inspirations, and can reset', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle('About · TechConcepts');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('main')).toContainText('only in this browser');
    await expect(page.locator('main')).toContainText('TechConcepts never sends your progress or theme choice to a server');
    // The e2e build has no analytics token, so there is no beacon and no sentence about one.
    await expect(page.locator('main')).not.toContainText('page views');
    await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
    await expect(page.locator('main')).toContainText('Protocol Explorer');
    await expect(page.locator('main')).toContainText('TryHackMe');
    await hydrated(page);
    await expect(page.getByRole('button', { name: 'Reset progress' })).toBeVisible();
    expect(await noHorizontalScroll(page)).toBe(true);
  });

  test('/does-not-exist serves the 404 page', async ({ page }) => {
    const response = await page.goto('/does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle('Page not found · TechConcepts');
    await expect(page.getByRole('link', { name: 'Go to Home' })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Browse Networking Concepts' })).toHaveAttribute('href', '/networking');
  });
});

test.describe('storage blocked', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() =>
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      }),
    );
  });

  test('pages carry no analytics script without a token', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
  });

  test('Home has no Continue card, a lesson steps to the Recap, and the theme toggle still switches', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (error) => errors.push(error));

    await page.goto('/');
    await hydrated(page);
    await expect(page.getByRole('link', { name: /^Continue:/ })).toHaveCount(0);

    await page.locator('.theme-toggle button[data-theme-value="light"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator('.theme-toggle button[data-theme-value="dark"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.goto('/networking');
    await hydrated(page);
    await expect(page.getByRole('button', { name: 'Reset progress' })).toHaveCount(0);

    await stepToRecap(page, '/networking/dhcp');
    expect(errors).toEqual([]);
  });
});
