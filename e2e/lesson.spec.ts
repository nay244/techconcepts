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

/** The least a device's label and its addresses may measure on screen, in CSS pixels (ruling R28). */
const MIN_LABEL_PX = 12;
const MIN_ADDRESS_PX = 11;

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
      test.skip(testInfo.project.name !== 'phone');
      await openLesson(page, lesson.path);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      const steps = [page.getByRole('button', { name: 'Previous step' }), page.getByRole('button', { name: 'Next step' })];
      for (const button of steps) await expect(button).toBeInViewport({ ratio: 1 });
      if (lesson.kind === 'flow') {
        await expect(playButton(page)).toBeInViewport({ ratio: 1 });
      } else {
        // A playground has nothing to play: the bar is the step buttons alone (ruling R29), and they work.
        await expect(playButton(page)).toHaveCount(0);
        await steps[1]!.click();
        await expect(page.getByText(/^STEP 1 OF \d+$/)).toBeVisible();
      }
    });

    test('the text under each device reads at 12 px (labels) and 11 px (addresses) at least, and none of it overlaps', async ({ page }) => {
      test.skip(lesson.kind !== 'flow', 'Only flow lessons draw devices.');
      await openLesson(page, lesson.path);
      const measure = () =>
        page.evaluate(() => {
          const svg = document.querySelector<SVGSVGElement>('.flow-network__svg')!;
          const scale = svg.getScreenCTM()!.a;
          const read = (selector: string) =>
            [...svg.querySelectorAll<SVGTextElement>(selector)].map((text) => ({
              text: text.textContent ?? '',
              px: Math.round(parseFloat(getComputedStyle(text).fontSize) * scale * 100) / 100,
              box: text.getBoundingClientRect().toJSON() as DOMRect,
            }));
          return { labels: read('.flow-device__label'), addresses: read('.flow-device__address') };
        });
      // The view sizes its text once it has measured itself, just after it hydrates.
      await expect.poll(async () => Math.min(...(await measure()).labels.map((label) => label.px))).toBeGreaterThanOrEqual(MIN_LABEL_PX);
      const measured = await measure();
      expect(measured.labels.length).toBeGreaterThan(0);
      for (const label of measured.labels) expect(label.px, label.text).toBeGreaterThanOrEqual(MIN_LABEL_PX);
      for (const address of measured.addresses) expect(address.px, address.text).toBeGreaterThanOrEqual(MIN_ADDRESS_PX);

      const all = [...measured.labels, ...measured.addresses];
      const overlapping = all.flatMap((a, i) =>
        all
          .slice(i + 1)
          .filter((b) => a.box.left < b.box.right && b.box.left < a.box.right && a.box.top < b.box.bottom && b.box.top < a.box.bottom)
          .map((b) => `${a.text} / ${b.text}`),
      );
      expect(overlapping).toEqual([]);
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
