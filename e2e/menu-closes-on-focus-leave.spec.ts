import { expect, test, type Page } from '@playwright/test';
import { scrollSettled, settledFrame, transitionsDone } from './support';

/*
 * The open menu closes when focus moves outside the header, below 960px, on every page (job 29, B42; prototypes/d25-demo-open-menu.md,
 * whose acceptance check numbers the tests carry). Check 2, 3 and the other pages' walks are `site-chrome.spec.ts` 44 to 49 (open rows asserted).
 */

test.describe('the open menu closes when focus leaves the header (D25)', () => {
  const SIZES: Array<[number, number]> = [[320, 640], [375, 812], [390, 844], [959, 900]];
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
  const settle = async (page: Page): Promise<void> => {
    await settledFrame(page);
    await scrollSettled(page);
    await transitionsDone(page);
  };
  const expanded = (page: Page): Promise<string | null> => page.locator('#menu').getAttribute('aria-expanded');

  test('1: Tab from the panel’s last link leaves the menu closed, the header 69px and the first stop in view, on five pages', async ({ page }) => {
    for (const path of ['/', '/tracks', '/networking', '/about', '/does-not-exist']) {
      for (const [w, h] of SIZES) {
        await visit(page, path, w, h);
        await openMenu(page);
        await page.locator('#menu-panel a').last().focus();
        await page.keyboard.press('Tab');
        await settle(page);
        const key = `${path} ${w}x${h}`;
        expect(await expanded(page), key).toBe('false');
        await expect(page.locator('#menu-panel'), key).toBeHidden();
        const r = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const b = el.getBoundingClientRect();
          return { inMain: !!el.closest('main'), top: b.top - 5, bottom: b.bottom + 5, head: document.querySelector('.site-head')!.getBoundingClientRect(), h: innerHeight };
        });
        expect(r.inMain, `${key}: the first stop in main`).toBe(true);
        expect(Math.abs(r.head.height - 69), `${key}: header ${r.head.height}`).toBeLessThanOrEqual(0.5);
        expect(r.top, `${key}: ring top ${r.top} under the header's foot ${r.head.bottom}`).toBeGreaterThanOrEqual(r.head.bottom - 0.5);
        expect(r.bottom, `${key}: ring bottom ${r.bottom}`).toBeLessThanOrEqual(r.h + 0.5);
      }
    }
  });

  test('3: at 375, walking into the page with the menu open lands each stop where the closed-menu walk does', async ({ page }) => {
    const mainStops = async (menuOpen: boolean): Promise<Array<{ name: string; top: number }>> => {
      await visit(page, '/', 375, 812);
      if (menuOpen) {
        await openMenu(page);
        await page.locator('#menu').focus();
      }
      const stops: Array<{ name: string; top: number }> = [];
      for (let i = 0; i < 40 && stops.length < 12; i++) {
        await page.keyboard.press('Tab');
        await settle(page);
        const r = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return { inMain: !!el.closest('main'), name: el.getAttribute('aria-label') ?? (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40), top: el.getBoundingClientRect().top };
        });
        if (r.inMain) stops.push({ name: r.name, top: r.top });
      }
      return stops;
    };
    const closed = await mainStops(false);
    const open = await mainStops(true);
    expect(closed).toHaveLength(12);
    expect(open.map((s) => s.name)).toEqual(closed.map((s) => s.name));
    open.forEach((s, i) => expect(Math.abs(s.top - closed[i]!.top), `${s.name}: ${s.top} against ${closed[i]!.top}`).toBeLessThanOrEqual(1));
  });

  test('4: Shift+Tab from the first stop reaches Menu, closed; Enter opens it again and Tab reaches Tracks', async ({ page }) => {
    for (const [w, h] of SIZES) {
      await visit(page, '/', w, h);
      await openMenu(page);
      await page.locator('#menu-panel a').last().focus();
      await page.keyboard.press('Tab');
      await settle(page);
      await page.keyboard.press('Shift+Tab');
      await settle(page);
      await expect(page.locator('#menu'), `${w}`).toBeFocused();
      expect(await expanded(page), `${w}`).toBe('false');
      await page.keyboard.press('Enter');
      await expect(page.locator('#menu-panel')).toBeVisible();
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement!.textContent!.trim()), `${w}`).toBe('Tracks');
    }
  });

  test('5 and 6: the skip link closes the panel; the panel’s links and the theme button leave it open', async ({ page }) => {
    for (const [w, h] of SIZES) {
      await visit(page, '/', w, h);
      await openMenu(page);
      await page.locator('#menu').focus();
      await page.keyboard.press('Shift+Tab');
      await expect(page.locator('#theme-toggle'), `${w}: the theme button`).toBeFocused();
      expect(await expanded(page), `${w}: open on the theme button`).toBe('true');
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Shift+Tab');
      await expect(page.locator('.skip-link'), `${w}: the skip link`).toBeFocused();
      expect(await expanded(page), `${w}: closed on the skip link`).toBe('false');
      await visit(page, '/', w, h);
      await openMenu(page);
      await page.locator('#menu').focus();
      const n = await page.locator('#menu-panel a').count();
      expect(n).toBe(6);
      for (let i = 0; i < n; i++) {
        await page.keyboard.press('Tab');
        await expect(page.locator('#menu-panel a').nth(i)).toBeFocused();
        expect(await expanded(page), `${w}: open at link ${i + 1}`).toBe('true');
      }
    }
  });

  test('7 and 8: a tap on a demo control closes the panel and leaves the narration in view; a tap on plain text leaves it open', async ({ page }) => {
    for (const [w, h] of SIZES) {
      await visit(page, '/', w, h);
      await openMenu(page);
      await page.locator('.open__say').click();
      expect(await expanded(page), `${w}: plain text`).toBe('true');
      await page.locator('.demo').scrollIntoViewIfNeeded();
      await page.evaluate(() => document.querySelector('.demo')!.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await scrollSettled(page);
      await page.locator('label[for="demo-s2"]:visible').first().click();
      await settle(page);
      expect(await expanded(page), `${w}: closed by the tap`).toBe('false');
      await expect(page.locator('#demo-s2'), `${w}: step 2`).toBeChecked();
      const r = await page.evaluate(() => ({ top: document.querySelector('.demo__says')!.getBoundingClientRect().top, head: document.querySelector('.site-head')!.getBoundingClientRect().bottom, h: innerHeight }));
      expect(r.top, `${w}: the narration at ${r.top}`).toBeGreaterThanOrEqual(r.head - 0.5);
      expect(r.top).toBeLessThan(r.h);
    }
  });

  test('9: Escape closes the panel onto Menu, and the panel’s “How a lesson works” still lands #try at 88px', async ({ page }) => {
    await visit(page, '/', 375, 812);
    await openMenu(page);
    await page.keyboard.press('Escape');
    expect(await expanded(page)).toBe('false');
    await expect(page.locator('#menu')).toBeFocused();
    await openMenu(page);
    await page.locator('#menu-panel a[href="/#try"]').click();
    await scrollSettled(page);
    await transitionsDone(page);
    expect(Math.abs((await page.evaluate(() => document.querySelector('#try')!.getBoundingClientRect().top)) - 88)).toBeLessThanOrEqual(1);
  });

  test('10: at 960 and 1440 the menu state never changes while focus walks into the page', async ({ page }) => {
    for (const [w, h] of [[960, 900], [1440, 900]] as const) {
      await visit(page, '/', w, h);
      await page.locator('.skip-link').focus();
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        expect(await expanded(page), `${w}`).toBe('false');
      }
    }
  });
});
