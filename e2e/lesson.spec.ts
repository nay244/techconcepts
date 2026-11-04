import { expect, test, type Locator, type Page } from '@playwright/test';

/** Every lesson page to check. Later pilots append themselves here. */
const LESSONS: { path: string; kind: 'flow' | 'playground' }[] = [
  { path: '/networking/dhcp', kind: 'flow' },
  { path: '/networking/subnetting', kind: 'playground' },
  { path: '/networking/firewalls', kind: 'flow' },
];

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
const previousStep = (page: Page) => page.getByRole('button', { name: 'Previous step' });
const nextStep = (page: Page) => page.getByRole('button', { name: 'Next step' });

/** Moves forward with the step button, which every lesson kind has on every screen. */
async function advance(page: Page, times: number): Promise<void> {
  for (let i = 0; i < times; i += 1) await nextStep(page).click();
}

/** Moves to the Try it step of a playground lesson, where its controls come alive. */
async function goToTryIt(page: Page): Promise<void> {
  const tryIt = page.getByRole('heading', { level: 2, name: 'Try it' });
  for (let i = 0; i < 12 && !(await tryIt.isVisible()); i += 1) await nextStep(page).click();
  await expect(tryIt).toBeVisible();
}

/** The scroll containers above an element that hide any part of it: inside the viewport is not enough if a scrolling panel clips it. */
function clippingContainers(target: Locator): Promise<string[]> {
  return target.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const clipped: string[] = [];
    for (let node = el.parentElement; node !== null; node = node.parentElement) {
      const { overflowX, overflowY } = getComputedStyle(node);
      if (![overflowX, overflowY].some((value) => value === 'auto' || value === 'scroll' || value === 'hidden')) continue;
      const room = node.getBoundingClientRect();
      if (box.top < room.top || box.bottom > room.bottom || box.left < room.left || box.right > room.right) {
        clipped.push(node.className || node.tagName);
      }
    }
    return clipped;
  });
}

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
      } else {
        // A playground's tallest state: Try it with a message under the address field.
        await goToTryIt(page);
        await page.getByLabel('IP address').fill('300.1.1.1');
        await expect(page.getByText(/^Not a valid IPv4 address/)).toBeVisible();
        expect(await fits()).toBe(true);
      }
    });

    test('short desktop: the playback controls are on screen', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'short-desktop');
      await openLesson(page, lesson.path);
      // A flow lesson plays; a playground has only the step buttons (ruling R29).
      const controls = lesson.kind === 'flow' ? [playButton(page)] : [previousStep(page), nextStep(page)];
      for (const control of controls) await expect(control).toBeInViewport({ ratio: 1 });
    });

    test('phone: the playback bar is on screen at the top of the page', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'phone');
      await openLesson(page, lesson.path);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      const steps = [previousStep(page), nextStep(page)];
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

    test('phone: the step buttons stay on screen while the page scrolls', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'phone');
      await openLesson(page, lesson.path);
      const controls = lesson.kind === 'flow' ? [playButton(page), previousStep(page), nextStep(page)] : [previousStep(page), nextStep(page)];
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (const y of [height / 3, (2 * height) / 3, height]) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        for (const control of controls) await expect(control).toBeInViewport({ ratio: 1 });
      }
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
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

    test('the form and the 32 bits fit inside the canvas: nothing clipped, nothing scrolling sideways', async ({ page }) => {
      test.skip(lesson.kind !== 'playground', 'Only playgrounds have a form and a bit row.');
      await openLesson(page, lesson.path);
      // The tallest and widest state: Try it, with a message under the address field.
      await goToTryIt(page);
      await page.getByLabel('IP address').fill('300.1.1.1');
      await expect(page.getByText(/^Not a valid IPv4 address/)).toBeVisible();

      const canvas = page.getByRole('region', { name: 'Subnet playground' });
      const room = await canvas.evaluate((el) => ({
        sideways: el.scrollWidth - el.clientWidth,
        down: el.scrollHeight - el.clientHeight,
        page: document.documentElement.scrollWidth - window.innerWidth,
      }));
      expect(room).toEqual({ sideways: 0, down: 0, page: 0 });

      const width = page.viewportSize()!.width;
      const parts = [page.getByLabel('IP address'), page.getByLabel('Prefix length'), canvas.getByRole('img')];
      for (const part of parts) {
        const box = (await part.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
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

test.describe('/networking/subnetting: the playground', () => {
  const address = (page: Page) => page.getByLabel('IP address');
  const prefix = (page: Page) => page.getByLabel('Prefix length');
  const compare = (page: Page) => page.getByLabel('Compare with');

  test('the steps are read-only, Try it is editable, and its edits are dropped when the learner leaves', async ({ page }) => {
    await openLesson(page, '/networking/subnetting');
    for (const field of [address(page), prefix(page), compare(page)]) await expect(field).toBeDisabled();
    await expect(page.getByText('You can change these in Try it.')).toBeVisible();

    await advance(page, 7);
    await expect(page.getByRole('heading', { level: 2, name: 'Try it' })).toBeVisible();
    // Try it starts from the last step's preset.
    await expect(address(page)).toHaveValue('10.0.0.5');
    await expect(prefix(page)).toHaveValue('30');
    for (const field of [address(page), prefix(page), compare(page)]) await expect(field).toBeEnabled();

    await address(page).fill('172.16.5.9');
    await prefix(page).fill('20');
    await expect(page.getByText('172.16.0.0', { exact: true })).toBeVisible();

    await previousStep(page).click();
    await expect(address(page)).toBeDisabled();
    await expect(address(page)).toHaveValue('10.0.0.5');
    await nextStep(page).click();
    await expect(address(page)).toHaveValue('10.0.0.5');
    await expect(prefix(page)).toHaveValue('30');
  });

  test('step 5 compares 192.168.1.10 with 192.168.1.70 at /26 and says they are in different subnets', async ({ page }) => {
    await openLesson(page, '/networking/subnetting');
    await advance(page, 4);
    await expect(page.getByRole('status')).toHaveText('');
    await nextStep(page).click();
    await expect(page.getByText('STEP 5 OF 6')).toBeVisible();
    await expect(address(page)).toHaveValue('192.168.1.10');
    await expect(prefix(page)).toHaveValue('26');
    await expect(compare(page)).toHaveValue('192.168.1.70');
    await expect(page.getByRole('status')).toHaveText('Different subnets: traffic between them goes through a router');
    // The next step has no comparison, so the old result does not linger.
    await nextStep(page).click();
    await expect(page.getByRole('status')).toHaveText('');
  });

  // Step 5's whole point is this result, so it has to be there when the learner arrives, not behind a scroll bar.
  for (const [width, height] of [
    [1280, 650],
    [1024, 768],
  ] as const) {
    test(`step 5's result is in view, and not clipped by its panel, at ${width}x${height}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'short-desktop', 'Sets its own desktop viewport; one project is enough.');
      await page.setViewportSize({ width, height });
      await openLesson(page, '/networking/subnetting');
      await advance(page, 5);
      const result = page.getByRole('status');
      await expect(result).toHaveText('Different subnets: traffic between them goes through a router');
      await expect(compare(page)).toBeInViewport({ ratio: 1 });
      await expect(result).toBeInViewport({ ratio: 1 });

      // Inside the viewport is not enough if a scrolling panel is hiding part of it: it has to sit inside every scroll container above it.
      const clippedBy = await clippingContainers(result);
      expect(clippedBy).toEqual([]);
    });
  }

  test('phone: step 5 shows the result right under the form, above the step buttons', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone');
    await openLesson(page, '/networking/subnetting');
    await advance(page, 5);
    await page.evaluate(() => window.scrollTo(0, 0));
    const result = page.getByRole('status');
    await expect(result).toHaveText('Different subnets: traffic between them goes through a router');
    const [resultBox, barBox] = await Promise.all([result.boundingBox(), nextStep(page).boundingBox()]);
    expect(resultBox!.y + resultBox!.height).toBeLessThanOrEqual(barBox!.y);
    // It follows the compare field directly: nothing but the field and a gap sits between them.
    const fieldBox = (await compare(page).boundingBox())!;
    expect(resultBox!.y - (fieldBox.y + fieldBox.height)).toBeLessThan(40);
  });

  test('a fact value breaks its line only after a dot or at a space, never inside a group of digits', async ({ page }) => {
    await openLesson(page, '/networking/subnetting');
    // Step 2 has the binary mask, the longest unbroken value; steps 4 to 6 have addresses with text around them.
    for (const step of [2, 4, 5, 6]) {
      await page.goto('/networking/subnetting');
      await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
      await advance(page, step);
      const wrapped = await page.locator('.explain__fact dd').evaluateAll((values) =>
        values.map((dd) => {
          const full = dd.textContent ?? '';
          const rects: { index: number; top: number }[] = [];
          const walker = document.createTreeWalker(dd, NodeFilter.SHOW_TEXT);
          let index = 0;
          for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
            const text = node.textContent ?? '';
            for (let i = 0; i < text.length; i += 1) {
              const range = document.createRange();
              range.setStart(node, i);
              range.setEnd(node, i + 1);
              const rect = range.getClientRects()[0];
              if (rect !== undefined && !/\s/.test(text[i]!)) rects.push({ index: index + i, top: Math.round(rect.top) });
            }
            index += text.length;
          }
          // A line ends where the next visible character sits lower; it may do so after a dot, or before a space.
          const badEnds: string[] = [];
          for (let i = 0; i + 1 < rects.length; i += 1) {
            if (rects[i + 1]!.top <= rects[i]!.top + 2) continue;
            const at = rects[i]!.index;
            const next = rects[i + 1]!.index;
            const afterDot = full[at] === '.';
            const atSpace = /\s/.test(full.slice(at + 1, next));
            if (!afterDot && !atSpace) badEnds.push(full.slice(Math.max(0, at - 6), at + 1) + '|' + full.slice(next, next + 6));
          }
          return { full, lines: new Set(rects.map((r) => r.top)).size, badEnds };
        }),
      );
      for (const value of wrapped) expect(value.badEnds, `step ${step}: ${value.full}`).toEqual([]);
      if (step === 2) {
        const binary = wrapped.find((value) => value.full.startsWith('11111111'))!;
        // Wrapping must really happen here, or the check above proves nothing.
        expect(binary.lines).toBeGreaterThan(1);
      }
    }
  });

  test('Try it opens with its three things to notice showing', async ({ page }) => {
    await openLesson(page, '/networking/subnetting');
    await goToTryIt(page);
    const notice = page.locator('details.tryit__notice');
    await expect(notice).toHaveAttribute('open', '');
    await expect(page.getByText(/^Three things to notice\./)).toBeVisible();
    await notice.getByText('What to notice').click();
    await expect(page.getByText(/^Three things to notice\./)).toBeHidden();
  });

  test('Space does nothing, because there is nothing to play, and the page is left to handle it', async ({ page }) => {
    await openLesson(page, '/networking/subnetting');
    await advance(page, 2);
    await blurFocus(page);
    // Nothing visible changes if Space is mishandled in a playground, so check the contract itself: the console
    // does not cancel the key. The listener goes on the window before the key is pressed, and runs after the console's own.
    await page.evaluate(() => {
      (window as unknown as { spaceCancelled: Promise<boolean> }).spaceCancelled = new Promise((resolve) => {
        window.addEventListener('keydown', (event) => {
          if (event.code === 'Space') resolve(event.defaultPrevented);
        });
      });
    });
    await page.keyboard.press('Space');
    const cancelled = await page.evaluate(() => (window as unknown as { spaceCancelled: Promise<boolean> }).spaceCancelled);
    expect(cancelled).toBe(false);
    await expect(page.getByText('STEP 2 OF 6')).toBeVisible();
  });

  test('the usable-hosts numbers the lesson states are the ones the page shows', async ({ page }) => {
    await openLesson(page, '/networking/subnetting');
    const usable = page.locator('.subnet-readout__item', { hasText: 'Usable hosts' }).locator('dd');
    await advance(page, 3);
    await expect(usable).toHaveText('254');
    await nextStep(page).click();
    await expect(usable).toHaveText('62');
    await advance(page, 2);
    await expect(usable).toHaveText('2');
  });
});

test.describe('/networking/firewalls: the rule list', () => {
  // The rule list is this lesson's teaching surface: the row a step matched has to be seen, not hidden below the stage or in a scroll area.
  for (const [width, height] of [
    [1280, 650],
    [1024, 768],
  ] as const) {
    test(`the matched rule row is visible at every step at ${width}x${height}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'short-desktop', 'Sets its own desktop viewport; one project is enough.');
      await page.setViewportSize({ width, height });
      await openLesson(page, '/networking/firewalls');
      const expected = ['1', '3', '2', '3'];
      for (const [i, rule] of expected.entries()) {
        // Moving to a step starts it playing.
        await nextStep(page).click();
        const row = page.locator('.device-table[data-table="rules"] tr[data-highlight="matched"]');
        await expect(row).toHaveCount(1, { timeout: 8_000 });
        await expect(row.locator('td').first()).toContainText(rule);
        await expect(row, `step ${i + 1}`).toBeInViewport({ ratio: 1 });
        expect(await clippingContainers(row), `step ${i + 1}`).toEqual([]);
      }
    });
  }
});
