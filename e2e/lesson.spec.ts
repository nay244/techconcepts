import { expect, test, type Page } from '@playwright/test';

/** Every lesson page to check. Later pilots append themselves here. */
const LESSONS: { path: string; kind: 'flow' | 'playground' }[] = [{ path: '/networking/dhcp', kind: 'flow' }];

/** The console is one island: once Astro drops its `ssr` marker, React is listening. */
async function openLesson(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
}

/** Shortcuts are ignored on buttons by design, so nothing may hold focus when an arrow key is pressed. */
async function blurFocus(page: Page): Promise<void> {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
}

const playButton = (page: Page) => page.getByRole('button', { name: /^(Play|Pause) \(Space\)$/ });

for (const lesson of LESSONS) {
  test.describe(lesson.path, () => {
    test('has no page errors, and ArrowRight walks it to the Recap', async ({ page }) => {
      const errors: Error[] = [];
      page.on('pageerror', (error) => errors.push(error));
      await openLesson(page, lesson.path);

      const recap = page.getByRole('heading', { level: 2, name: 'Recap' });
      for (let i = 0; i < 12 && !(await recap.isVisible()); i += 1) {
        await blurFocus(page);
        await page.keyboard.press('ArrowRight');
      }
      await expect(recap).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Lesson navigation' })).toContainText(/Back to the track|Next/);
      expect(errors).toEqual([]);
    });

    test('Play fills the event log', async ({ page }) => {
      test.skip(lesson.kind !== 'flow', 'Only flow lessons have an event log.');
      await openLesson(page, lesson.path);
      await playButton(page).click();
      const rows = page.getByRole('region', { name: 'Event log' }).locator('tbody tr[data-outcome]');
      await expect(rows.first()).toBeVisible({ timeout: 5_000 });
    });

    test('at 1200 px and wider it fits one screen, and the explanation scrolls inside itself', async ({ page }) => {
      const size = page.viewportSize();
      test.skip(size === null || size.width < 1200, 'Narrower screens scroll the page by design.');
      await openLesson(page, lesson.path);
      const overflowY = await page.getByRole('region', { name: 'Explanation' }).evaluate((el) => getComputedStyle(el).overflowY);
      expect(['auto', 'scroll']).toContain(overflowY);
      const fits = () => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1);
      expect(await fits()).toBe(true);

      // Taller content stays inside its panel: the full lesson list, and a packet in the inspector.
      await page.getByText('All lessons').click();
      expect(await fits()).toBe(true);
      if (lesson.kind === 'flow') {
        await playButton(page).click();
        await page.getByRole('button', { name: 'Details' }).first().click();
        await expect(page.getByRole('region', { name: 'Packet inspector' })).toBeVisible();
        expect(await fits()).toBe(true);
      }
    });

    test('short desktop: the Play button is on screen', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'short-desktop' || lesson.kind !== 'flow');
      await openLesson(page, lesson.path);
      await expect(playButton(page)).toBeInViewport({ ratio: 1 });
    });

    test('phone: the playback bar is on screen at the top of the page', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'phone' || lesson.kind !== 'flow');
      await openLesson(page, lesson.path);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await expect(playButton(page)).toBeInViewport({ ratio: 1 });
    });

    test('phone: the outline opens in a drawer and jumps', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'phone');
      await openLesson(page, lesson.path);
      await page.getByRole('button', { name: 'Contents' }).click();
      const drawer = page.getByRole('dialog', { name: 'Contents' });
      await expect(drawer).toBeVisible();
      await drawer.getByRole('button', { name: 'Check yourself' }).click();
      await expect(drawer).toBeHidden();
      await expect(page.getByRole('heading', { level: 2, name: 'Check yourself' })).toBeVisible();
    });
  });
}
