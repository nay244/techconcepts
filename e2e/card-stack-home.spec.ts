import { expect, test } from '@playwright/test';
import { open } from './support';

/**
 * Home after its Card stack tokens, buttons and figure tint moved into src/styles/card-stack.css (job 18, B21): the
 * page is drawn as it was. What a screenshot cannot show is here: a focused button's corners, and the tokens on :root
 * in the dark with and without JavaScript. (The pixel comparison itself is in the unit's report.)
 */

for (const [name, viewport] of [
  ['1440', { width: 1440, height: 900 }],
  ['375', { width: 375, height: 812 }],
] as const) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`Home ${name} ${colorScheme}`, () => {
      test.use({ viewport, colorScheme, isMobile: false, hasTouch: false });

      test('every main button keeps 8px corners when keyboard-focused (E5)', async ({ page }) => {
        await open(page, '/');
        const seen = new Set<string>();
        for (let i = 0; i < 80 && seen.size < 3; i += 1) {
          await page.keyboard.press('Tab');
          const hit = await page.evaluate(() => {
            const el = document.activeElement;
            if (el === null || !el.matches('main .btn') || !el.matches(':focus-visible')) return null;
            const box = el.getBoundingClientRect();
            return { text: (el.textContent ?? '').trim(), at: `${Math.round(box.top + window.scrollY)}`, radius: getComputedStyle(el).borderRadius };
          });
          if (hit === null) continue;
          expect(hit.radius, `${hit.text} focused`).toBe('8px');
          seen.add(`${hit.text}@${hit.at}`);
        }
        // The opening's two buttons and the closing section's: three anchors that are buttons.
        expect(seen.size, [...seen].join(' | ')).toBe(3);
      });

      test('main buttons are the Card stack’s: 2px edge, an offset edge, and pressed they move 2px', async ({ page }) => {
        await open(page, '/');
        const primary = page.locator('main .open__acts .btn--primary');
        const style = await primary.evaluate((el) => {
          const s = getComputedStyle(el);
          return { border: s.borderTopWidth, radius: s.borderRadius, shadow: s.boxShadow, minHeight: s.minHeight };
        });
        expect(style.border).toBe('2px');
        expect(style.radius).toBe('8px');
        expect(style.minHeight).toBe('48px');
        expect(style.shadow).toMatch(/3px 3px 0px 0px$/);
        const box = (await primary.boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await expect.poll(() => primary.evaluate((el) => getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 2, 2)');
        await page.mouse.up();
      });
    });
  }
}

test.describe('Home’s tokens on :root', () => {
  const EDGE = { light: 'rgb(18, 23, 27)', dark: 'rgb(198, 205, 209)' };
  const probe = (name: string) =>
    `(() => { const d = document.createElement('div'); document.body.append(d); d.style.color = 'var(${name})'; const c = getComputedStyle(d).color; d.remove(); return c; })()`;

  for (const colorScheme of ['light', 'dark'] as const) {
    test(`--cs-edge resolves in ${colorScheme}, and --cs-stack is 6px at 861 and 4px at 860`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width: 861, height: 900 });
      await open(page, '/');
      expect(await page.evaluate(probe('--cs-edge'))).toBe(EDGE[colorScheme]);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-stack').trim())).toBe('6px');
      await page.setViewportSize({ width: 860, height: 900 });
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-stack').trim())).toBe('4px');
    });
  }

  test.describe('dark, JavaScript off (the media query alone, E2)', () => {
    test.use({ javaScriptEnabled: false, colorScheme: 'dark' });
    test('the edge is the light ink and a cover takes the dark tint', async ({ page }) => {
      await page.goto('/');
      expect(await page.evaluate(probe('--cs-edge'))).toBe(EDGE.dark);
      const hi = await page.locator('main .lm-svg').first().evaluate((el) => getComputedStyle(el).getPropertyValue('--anatomy-hi').trim());
      expect(hi).toBe('#f3f5f6');
    });
  });

  test.describe('the figures, light', () => {
    test.use({ colorScheme: 'light' });
    test('a cover keeps the tint: no pool, no halo, no orbit, the dark ink for lines', async ({ page }) => {
      await open(page, '/');
      const cover = page.locator('main .lm-svg').first();
      expect(await cover.evaluate((el) => getComputedStyle(el).getPropertyValue('--anatomy-hi').trim())).toBe('#12171b');
      expect(await cover.evaluate((el) => getComputedStyle(el).getPropertyValue('--pool-op').trim())).toBe('0');
      expect(await cover.evaluate((el) => getComputedStyle(el).getPropertyValue('--halo-op').trim())).toBe('0');
      expect(await page.locator('main .lm-orbit').evaluateAll((els) => els.filter((el) => getComputedStyle(el).display !== 'none').length)).toBe(0);
    });
  });
});
