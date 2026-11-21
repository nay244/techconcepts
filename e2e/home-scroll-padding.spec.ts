import { expect, test, type Page } from '@playwright/test';
import { scrollSettled, settledFrame, transitionsDone } from './support';

/*
 * Home takes the site's scroll padding (job 29, B37; prototypes/b37-cases.md, whose case numbers the tests carry): 80px above,
 * 12px below, and the open header plus 12px while the menu is open below 960px. Every anchor and every demo radio lands where
 * it landed before (a7985bd): the numbers below were measured on that build.
 */

test.describe('Home’s scroll padding (B37)', () => {
  const visit = async (page: Page, path: string, w: number, h: number): Promise<void> => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', /^Switch to (light|dark) theme$/);
  };
  const openMenu = async (page: Page): Promise<void> => {
    await page.locator('#menu').click();
    await expect(page.locator('#menu-panel')).toBeVisible();
    await transitionsDone(page);
  };
  const padding = (page: Page): Promise<[string, string]> => page.evaluate(() => [getComputedStyle(document.documentElement).scrollPaddingTop, getComputedStyle(document.documentElement).scrollPaddingBottom] as [string, string]);

  test('1 and 2: 80px above and 12px below; 403px above while the menu is open below 960px, the open header (391px) plus 12px', async ({ page }) => {
    for (const w of [320, 375, 1440]) {
      await visit(page, '/', w, 800);
      expect(await padding(page), `closed at ${w}`).toEqual(['80px', '12px']);
    }
    for (const w of [320, 375, 390, 768, 959]) {
      await visit(page, '/', w, 800);
      await openMenu(page);
      expect((await padding(page))[0], `open at ${w}`).toBe('403px');
      const head = await page.locator('.site-head').evaluate((e) => e.getBoundingClientRect().height);
      if ([320, 375, 959].includes(w)) expect(Math.abs(head - 391), `the open header at ${w}: ${head}`).toBeLessThanOrEqual(1);
      await page.keyboard.press('Escape');
      await transitionsDone(page);
      expect((await padding(page))[0], `closed again at ${w}`).toBe('80px');
    }
    await visit(page, '/', 959, 800);
    await openMenu(page);
    await page.setViewportSize({ width: 960, height: 800 });
    await transitionsDone(page);
    expect((await padding(page))[0], 'opened at 959, then 960').toBe('80px');
  });

  test('3: #try and #sources land 88px under the window’s top by loading, and by the open menu’s link', async ({ page }) => {
    const top = (hash: string): Promise<number> => page.evaluate((id) => document.querySelector(id)!.getBoundingClientRect().top, hash);
    for (const [w, h] of [[320, 640], [375, 812], [390, 844], [959, 900], [960, 900], [1440, 900]] as const) {
      for (const hash of ['#try', '#sources']) {
        await visit(page, `/${hash}`, w, h);
        await scrollSettled(page);
        await transitionsDone(page);
        expect(Math.abs((await top(hash)) - 88), `${hash} loaded at ${w}: ${await top(hash)}`).toBeLessThanOrEqual(1);
        if (w < 960) {
          await visit(page, '/', w, h);
          await openMenu(page);
          await page.locator(`#menu-panel a[href="/${hash}"]`).click();
          await scrollSettled(page);
          await transitionsDone(page);
          expect(Math.abs((await top(hash)) - 88), `${hash} by the menu at ${w}: ${await top(hash)}`).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  // scrollY after focusing each radio, from ten start positions (the radio's area k px below the window's top), measured on a7985bd.
  const KS = [-2400, -1300, -950, -700, -450, -200, 0, 150, 400, 1200];
  const LANDINGS: Record<number, { part: number[]; step: number[]; answer: number[] }> = {
  375: { part: [327, 327, 327, 327, 328, 578, 708, 517, 517, 517], step: [887, 887, 887, 556, 791, 1041, 1217, 887, 887, 887], answer: [835, 835, 835, 626, 663, 913, 1043, 835, 835, 835] },
  959: { part: [0, 0, 0, 0, 58, 308, 438, 203, 203, 203], step: [485, 485, 485, 183, 433, 683, 859, 485, 485, 485], answer: [0, 0, 0, 0, 110, 360, 490, 237, 237, 237] },
  1440: { part: [17, 17, 17, 17, 106, 356, 486, 251, 251, 251], step: [514, 514, 514, 212, 462, 712, 888, 514, 514, 514], answer: [33, 33, 33, 33, 158, 408, 538, 285, 285, 285] },
  };
  const SCROLL_HEIGHT: Record<number, number> = { 320: 4725, 375: 4519, 1440: 3626 };
  const GROUPS: Array<['part' | 'step' | 'answer', string[]]> = [
    ['part', ['demo-watch', 'demo-learn', 'demo-practice']],
    ['step', ['demo-s1', 'demo-s2', 'demo-s3', 'demo-s4', 'demo-s5']],
    ['answer', ['demo-a1', 'demo-a2', 'demo-a3']],
  ];
  for (const [w, h] of [[375, 812], [959, 900], [1440, 900]] as const) {
    test(`4, 6 and 7: each demo radio lands where it did, from ten start positions, at ${w}`, async ({ page }) => {
      test.setTimeout(240_000);
      await visit(page, '/', w, h);
      const got: Record<string, number[]> = {};
      const want: Record<string, number[]> = {};
      for (const [group, ids] of GROUPS) {
        for (const id of ids) {
          const part = group === 'step' ? 'demo-watch' : group === 'answer' ? 'demo-practice' : null;
          got[id] = [];
          want[id] = LANDINGS[w]![group];
          for (const k of KS) {
            await page.evaluate(() => {
              (document.activeElement as HTMLElement | null)?.blur();
              scrollTo({ top: 0, behavior: 'instant' });
            });
            if (part) await page.evaluate((p) => { const el = document.getElementById(p) as HTMLInputElement; el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }, part);
            const docTop = await page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top + scrollY, id);
            await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), Math.max(0, docTop + k));
            await scrollSettled(page);
            await page.evaluate((i) => document.getElementById(i)!.focus({ focusVisible: true } as FocusOptions), id);
            await settledFrame(page);
            await scrollSettled(page);
            got[id]!.push(await page.evaluate(() => Math.round(scrollY)));
          }
        }
      }
      // within 1px of revamp's, each radio and start position
      for (const id of Object.keys(got)) expect(got[id]!.map((y, i) => (Math.abs(y - want[id]![i]!) <= 1 ? 'same' : `${KS[i]}: ${y} not ${want[id]![i]}`)), `${id} at ${w}`).toEqual(KS.map(() => 'same'));
    });
  }

  test('6: the radios are still drawn nowhere and catch no tap, and the page is as tall as before', async ({ page }) => {
    for (const w of [320, 375, 1440]) {
      await visit(page, '/', w, 800);
      expect(await page.evaluate(() => document.documentElement.scrollHeight), `the page's height at ${w}`).toBe(SCROLL_HEIGHT[w]);
      const styles = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.demo__in')].map((e) => [getComputedStyle(e).opacity, getComputedStyle(e).pointerEvents, getComputedStyle(e).height]));
      expect(styles.length).toBe(11);
      for (const s of styles) expect(s).toEqual(['0', 'none', '81px']);
    }
  });

  test('16: the skip link, from far down Home, lands the page at the top and the next Tab is below the header', async ({ page }) => {
    for (const [w, h] of [[375, 812], [1440, 900]] as const) {
      await visit(page, '/', w, h);
      await page.evaluate(() => scrollTo({ top: 1500, behavior: 'instant' }));
      await scrollSettled(page);
      await page.keyboard.press('Tab');
      await expect(page.locator('.skip-link')).toBeFocused();
      await page.keyboard.press('Enter');
      await scrollSettled(page);
      expect(await page.evaluate(() => scrollY), `at ${w}`).toBe(0);
      await page.keyboard.press('Tab');
      await scrollSettled(page);
      const next = await page.evaluate(() => ({ name: document.activeElement!.textContent!.replace(/\s+/g, ' ').trim(), top: document.activeElement!.getBoundingClientRect().top, head: document.querySelector('.site-head')!.getBoundingClientRect().bottom }));
      expect(next.name).toBe('Start with lesson 1: HTTP');
      expect(next.top, `the link clears the header at ${w}`).toBeGreaterThanOrEqual(next.head);
    }
  });
});
