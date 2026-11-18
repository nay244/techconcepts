import { expect, test, type Page } from '@playwright/test';
import { kicker, nextButton, nodeEnv, open, readyLessons, requireLessons, settledFrame } from './support';

/**
 * D19 case 9 (E17): the drawing is never smaller than it was. Each ready page's drawing at its last Watch step, measured
 * on `revamp` at 210a9a5 before B22 changed anything (1440×900 and 1280×800: the figure's `svg[data-figure]` scaled by its
 * viewBox, "meet"). The test requires every page's drawing, now, to be at least that wide and that tall.
 */
const FLOOR: Record<string, { d1440: [number, number]; d1280: [number, number] }> = {
  '/how-the-internet-works/what-is-http': { d1440: [733.2, 404.6], d1280: [603.7, 333.1] },
  '/how-the-internet-works/what-is-https': { d1440: [466.9, 257.7], d1280: [381.8, 210.7] },
  '/how-the-internet-works/what-is-tcp': { d1440: [629.4, 347.3], d1280: [495.3, 273.3] },
  '/how-the-internet-works/what-is-udp': { d1440: [455.6, 251.4], d1280: [381.8, 210.7] },
  '/how-the-internet-works/what-is-ip': { d1440: [636.8, 351.4], d1280: [502.7, 277.4] },
  '/how-the-internet-works/what-is-dns': { d1440: [629.4, 347.3], d1280: [495.3, 273.3] },
  '/how-the-internet-works/what-is-dhcp': { d1440: [521.1, 287.6], d1280: [387, 213.6] },
  '/how-the-internet-works/what-is-icmp': { d1440: [466.9, 257.7], d1280: [381.8, 210.7] },
  '/how-the-internet-works/what-is-smtp': { d1440: [683.6, 377.2], d1280: [549.5, 303.2] },
  '/how-the-internet-works/what-is-pop3': { d1440: [683.6, 377.2], d1280: [549.5, 303.2] },
  '/how-the-internet-works/what-is-imap': { d1440: [683.6, 377.2], d1280: [549.5, 303.2] },
  '/how-the-internet-works/what-is-ftp': { d1440: [466.9, 257.7], d1280: [381.8, 210.7] },
  '/how-the-internet-works/what-is-ssh': { d1440: [481.6, 265.7], d1280: [381.8, 210.7] },
  '/how-the-internet-works/what-is-tls': { d1440: [455.6, 251.4], d1280: [381.8, 210.7] },
  '/networking/osi-model': { d1440: [644.7, 440], d1280: [549.5, 375] },
  '/networking/packets': { d1440: [575.3, 317.5], d1280: [441.2, 243.5] },
  '/networking/ip-address': { d1440: [724.2, 396.2], d1280: [588.9, 322.2] },
  '/networking/mac-address': { d1440: [666.9, 317.5], d1280: [511.4, 243.5] },
  '/networking/switch': { d1440: [733.2, 329.6], d1280: [614, 276] },
  '/networking/arp': { d1440: [733.2, 404.6], d1280: [606.1, 334.5] },
  '/networking/subnetting': { d1440: [724.2, 396.2], d1280: [588.9, 322.2] },
  '/networking/router': { d1440: [688.5, 379.9], d1280: [554.4, 305.9] },
  '/networking/dhcp': { d1440: [733.2, 349], d1280: [614, 292.3] },
  '/networking/ports': { d1440: [575.3, 317.5], d1280: [441.2, 243.5] },
  '/networking/tcp-udp': { d1440: [629.4, 347.3], d1280: [495.3, 273.3] },
  '/networking/nat': { d1440: [688.5, 379.9], d1280: [554.4, 305.9] },
  '/networking/what-is-dns': { d1440: [629.4, 347.3], d1280: [495.3, 273.3] },
  '/networking/what-is-http': { d1440: [733.2, 404.6], d1280: [603.7, 333.1] },
  '/networking/what-is-https': { d1440: [466.9, 257.7], d1280: [381.8, 210.7] },
  '/networking/what-is-tls': { d1440: [455.6, 251.4], d1280: [381.8, 210.7] },
  '/networking/firewalls': { d1440: [640.9, 313.6], d1280: [489.7, 239.6] },
  '/networking/proxies': { d1440: [615.1, 339.5], d1280: [422.9, 233.4] },
  '/networking/load-balancers': { d1440: [610.7, 347.3], d1280: [480.6, 273.3] },
  '/networking/vpn': { d1440: [629.4, 347.3], d1280: [397.5, 219.4] },
};

const lessons = readyLessons();
requireLessons(lessons);

/** The drawing's size: the svg's box, scaled by its viewBox the way `preserveAspectRatio="xMidYMid meet"` does. */
async function drawing(page: Page): Promise<[number, number]> {
  return page.evaluate(() => {
    const svg = document.querySelector<SVGSVGElement>('.stage__figure svg[data-figure]')!;
    const box = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const scale = Math.min(box.width / vb.width, box.height / vb.height);
    return [Math.round(vb.width * scale * 10) / 10, Math.round(vb.height * scale * 10) / 10] as [number, number];
  });
}

/** Opens a lesson and presses forward to its last Watch step ("Step n of n"). */
async function toLastWatchStep(page: Page, path: string): Promise<void> {
  await open(page, path);
  for (let i = 0; i < 24; i += 1) {
    const text = (await kicker(page).textContent()) ?? '';
    const m = /Step (\d+) of (\d+)$/.exec(text);
    if (m !== null && m[1] === m[2]) return;
    await nextButton(page).click();
    await expect(kicker(page)).not.toHaveText(text);
  }
  throw new Error(`${path} has no last Watch step within 24 presses.`);
}

const printing = nodeEnv.FLOOR_PRINT === '1';

test.describe('the drawing at the last Watch step', () => {
  test.setTimeout(900_000);

  test('every ready page: none smaller than before B22', async ({ page }, info) => {
    test.skip(info.project.name !== 'd1440-dark', 'sizes are set in the test');
    const measured: Record<string, { d1440: [number, number]; d1280: [number, number] }> = {};
    for (const { path } of lessons) {
      const row = {} as { d1440: [number, number]; d1280: [number, number] };
      for (const [key, width, height] of [['d1440', 1440, 900], ['d1280', 1280, 800]] as const) {
        await page.setViewportSize({ width, height });
        await toLastWatchStep(page, path);
        await settledFrame(page);
        row[key] = await drawing(page);
      }
      measured[path] = row;
    }
    if (printing) console.log(`FLOOR ${JSON.stringify(measured)}`);
    else {
      expect(Object.keys(FLOOR).sort(), 'the table holds every ready page').toEqual(Object.keys(measured).sort());
      for (const [path, row] of Object.entries(measured)) {
        for (const key of ['d1440', 'd1280'] as const) {
          expect(row[key][0], `${path} ${key} width`).toBeGreaterThanOrEqual(FLOOR[path]![key][0] - 0.6);
          expect(row[key][1], `${path} ${key} height`).toBeGreaterThanOrEqual(FLOOR[path]![key][1] - 0.6);
        }
      }
    }
  });
});
