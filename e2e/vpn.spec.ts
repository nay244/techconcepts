import { expect, test, type Page } from '@playwright/test';
import { spot } from '../src/art/figures/spots';
import { checkCard, checkPhoneTable, DESKTOP, figure, onlyInDesktopDark, PHONE, playToEnd, RUN_TIMEOUT } from './batch1';
import { collectErrors, kicker, lessonCard, open, pageOverflow, playButton, stepCount, viewSwitch } from './support';

/**
 * VPN's page checks (design D15b, prototypes/d15-vpn-cases.md, the [browser] cases 30 to 40, and checks 21, 23 and 24 of
 * prototypes/d15-vpn.md §8): the sideways scroll at both sizes and themes, the listener's two callouts, the band's
 * weight and its width at each size, the callout's place on the café's plate, the tags over the wire, the lock at the
 * ride's end, the contrast of the band, the lesson's place in the lesson console and the Networking card.
 *
 * Each test sets its own window or theme, so these run once, in d1440-dark only.
 */
const PATH = '/networking/vpn';
const CARD_SUB = 'A sealed tunnel, as far as the VPN server';
const ariaOf = (kind: Parameters<typeof spot>[0]): string => spot(kind).match(/aria-label="([^"]*)"/)![1]!;

onlyInDesktopDark(PATH);

/** The timeline's stop for a step: 1 to 5 (index 0 is the Overview). */
const stepItem = (page: Page, step: number) => page.getByRole('navigation', { name: 'This lesson' }).getByRole('button').nth(step);

async function openStep(page: Page, step: number, phone: boolean): Promise<void> {
  await stepItem(page, step).click();
  await expect(kicker(page)).toContainText(`Step ${step} of 5`);
}

/** The listener's two parts' opacities, as the page draws them now. */
const hearOpacity = (page: Page) =>
  page.evaluate(() => ({
    head: getComputedStyle(document.querySelector('.nm-hear-head')!).opacity,
    body: getComputedStyle(document.querySelector('.nm-hear-body')!).opacity,
  }));

/** A callout's words' box, by the words it starts with, and the café's plate's lowest point. */
const calloutNamed = (page: Page, start: string) =>
  page.evaluate((words) => {
    const el = [...document.querySelectorAll<SVGElement>('svg[data-figure="net-map"] .nm-call')].find(
      (c) => (c.textContent ?? '').trim().startsWith(words) && c.closest('[data-hidden],[display="none"]') === null,
    );
    if (el === undefined) return null;
    const rs = [...el.querySelectorAll('text')].map((t) => t.getBoundingClientRect()).filter((r) => r.width > 0);
    return { left: Math.min(...rs.map((r) => r.left)), top: Math.min(...rs.map((r) => r.top)), right: Math.max(...rs.map((r) => r.right)), bottom: Math.max(...rs.map((r) => r.bottom)) };
  }, start);

test('30: at 1440 and 375, in both themes, every step opened never scrolls the page sideways, and the Table tab never does at 375', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT * 2);
  for (const size of [DESKTOP, PHONE]) {
    for (const scheme of ['dark', 'light'] as const) {
      await page.setViewportSize(size);
      await page.emulateMedia({ colorScheme: scheme });
      await open(page, PATH);
      for (const step of [1, 2, 3, 4, 5]) {
        await openStep(page, step, size === PHONE);
        await expect.poll(async () => (await pageOverflow(page)).sideways, `${size.width} ${scheme}, step ${step}`).toBe(0);
      }
    }
  }
  // The Table tab at 375, through to the run's end (check 23): the panel and the page both stay in their width.
  await page.emulateMedia({ colorScheme: 'dark' });
  const seen = await checkPhoneTable(page, PATH);
  expect(seen.overflowX, 'the table panel scrolls sideways at 375').toBeLessThanOrEqual(0);
  expect(seen.pageSideways, 'the page scrolls sideways at 375').toBeLessThanOrEqual(0);
});

test('30b: at 375 in the Table tab, the mark word sits under the row’s name, not beside it', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT);
  await page.setViewportSize(PHONE);
  await open(page, PATH);
  await page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Table/ }).click();
  await page.evaluate(() => {
    const marks: { under: boolean; text: string }[] = [];
    (window as unknown as { __marks: typeof marks }).__marks = marks;
    const tick = () => {
      for (const mark of document.querySelectorAll<HTMLElement>('.tpanel tbody tr .tpanel__miss')) {
        const cell = mark.closest('td');
        const name = cell?.firstChild;
        if (cell === null || name === null || name === undefined || mark.getBoundingClientRect().width === 0) continue;
        const range = document.createRange();
        range.selectNodeContents(name);
        const nameBox = range.getBoundingClientRect();
        const markBox = mark.getBoundingClientRect();
        if (nameBox.width === 0) continue;
        marks.push({ under: markBox.top >= nameBox.bottom - 1, text: mark.textContent ?? '' });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await playToEnd(page);
  const marks = await page.evaluate(() => (window as unknown as { __marks: { under: boolean; text: string }[] }).__marks);
  expect(marks.length, 'a mark word showed during the run').toBeGreaterThan(0);
  expect(marks.filter((m) => !m.under), 'mark words beside their row’s name').toEqual([]);
});

test('31: the listener’s head and body: step 1 both hidden, step 2 both shown, step 4 head shown and body hidden', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await openStep(page, 1, false);
  expect(await hearOpacity(page)).toEqual({ head: '0', body: '0' });
  await openStep(page, 2, false);
  expect(await hearOpacity(page)).toEqual({ head: '1', body: '1' });
  await openStep(page, 4, false);
  expect(await hearOpacity(page)).toEqual({ head: '1', body: '0' });
});

test('32: under reduced motion the listener’s parts and its glow do not fade', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, PATH);
  await openStep(page, 2, false);
  const durations = await page.evaluate(() =>
    [...document.querySelectorAll<SVGElement>('.nm-hear-head, .nm-hear-body, .nm-glow')].map((el) => getComputedStyle(el).transitionDuration),
  );
  expect(durations.length, 'the listener’s parts are on the page').toBeGreaterThanOrEqual(3);
  // The reduced-motion rule sets the duration to 0.00001ms, which the browser reports as 1e-05s: no fade.
  expect(durations.every((d) => parseFloat(d) < 0.001), `transition durations: ${durations.join(', ')}`).toBe(true);
});

test('33: the band at step 3 is 7 units wide with no vector-effect, at 0.42 opacity, and draws 7 × its figure’s scale, which is more than 3.5 × the scale', async ({ page }) => {
  for (const size of [DESKTOP, PHONE]) {
    await page.setViewportSize(size);
    await open(page, PATH);
    await openStep(page, 3, size === PHONE);
    const band = await page.evaluate(() => {
      const el = document.querySelector<SVGPolylineElement>('svg[data-figure="net-map"] .nm-conn.tunnel.sealed')!;
      const style = getComputedStyle(el);
      const svg = el.ownerSVGElement!;
      return { stroke: style.strokeWidth, vector: style.vectorEffect, opacity: style.opacity, scale: svg.getBoundingClientRect().width / svg.viewBox.baseVal.width };
    });
    // E26: the stroke is 7 user units as approved, so its drawn width is 7 × the figure's scale (its rendered width over its viewBox).
    expect(band.stroke, `stroke at ${size.width}`).toBe('7px');
    expect(band.vector, `vector-effect at ${size.width}`).toBe('none');
    expect(band.opacity, `opacity at ${size.width}`).toBe('0.42');
    const drawn = 7 * band.scale;
    expect(Math.abs(drawn - 7 * band.scale), `drawn width at ${size.width}`).toBeLessThanOrEqual(0.5);
    // A `.sealed` 3.5-unit stroke winning would draw 3.5 × the scale; that must fail this.
    expect(drawn, `drawn width at ${size.width} against a 3.5-unit stroke`).toBeGreaterThan(1.5 * 3.5 * band.scale);
  }
});

/**
 * Case 34: the tunnel ends at the server. The out cable is the figure's own `vpn:web` cable (the pad to router c and on to
 * the web server), and the in cable is the tunnel's band (`laptop>vpn`); each is sampled at its midpoint, in the figure's
 * screen space through its own screen matrix.
 */
test('34: the tunnel ends at the server: the out cable’s midpoint pixel is the same at step 1 and step 3, the in cable’s is not', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await openStep(page, 3, false);
  const at = await page.evaluate(() => {
    const svg = document.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
    const box = svg.getBoundingClientRect();
    const onScreen = (el: SVGGeometryElement, length: number) => {
      const p = el.getPointAtLength(length);
      const m = el.getScreenCTM()!;
      return { x: m.a * p.x + m.c * p.y + m.e - box.left, y: m.b * p.x + m.d * p.y + m.f - box.top };
    };
    const out = [...document.querySelectorAll<SVGPathElement>('svg[data-figure="net-map"] g[data-layer="vpn:web"] path')].sort(
      (a, b) => b.getTotalLength() - a.getTotalLength(),
    )[0]!;
    const band = document.querySelector<SVGGeometryElement>('svg[data-figure="net-map"] .nm-conn.tunnel.sealed')!;
    return { out: onScreen(out, out.getTotalLength() / 2), in: onScreen(band, band.getTotalLength() / 2) };
  });
  const shot = async () => figure(page).screenshot();
  await openStep(page, 1, false);
  const after1 = await shot();
  await openStep(page, 3, false);
  const after3 = await shot();
  const [outBefore, outAfter, inBefore, inAfter] = await page.evaluate(
    async ({ shots, at }) => {
      const decode = async (data: string) => {
        const img = new Image();
        img.src = `data:image/png;base64,${data}`;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        return ctx;
      };
      const sample = (ctx: CanvasRenderingContext2D, x: number, y: number) => Array.from(ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data.slice(0, 3));
      const [c1, c2] = [await decode(shots.step1), await decode(shots.step3)];
      return [sample(c1, at.out.x, at.out.y), sample(c2, at.out.x, at.out.y), sample(c1, at.in.x, at.in.y), sample(c2, at.in.x, at.in.y)];
    },
    { shots: { step1: after1.toString('base64'), step3: after3.toString('base64') }, at },
  );
  const maxDiff = (p: number[], q: number[]) => Math.max(...p.map((v, i) => Math.abs(v - q[i]!)));
  expect(maxDiff(outBefore!, outAfter!), 'the out cable’s pixel, step 1 against step 3').toBeLessThanOrEqual(6);
  expect(maxDiff(inBefore!, inAfter!), 'the in cable’s pixel, step 1 against step 3').toBeGreaterThan(6);
});

test('35: the callout “Someone listening” clears the other callouts, lies left of “The internet” and below the café plate', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await openStep(page, 1, false);
  const listening = await calloutNamed(page, 'Someone listening');
  const internet = await calloutNamed(page, 'The internet');
  expect(listening).not.toBeNull();
  expect(internet).not.toBeNull();
  const plate = await page.evaluate(() => {
    const cafe = document.querySelector<SVGGElement>('svg[data-figure="net-map"] g[data-base="cafe"]');
    const r = cafe?.getBoundingClientRect();
    return r === undefined ? null : { bottom: r.bottom, left: r.left, right: r.right, top: r.top };
  });
  expect(plate).not.toBeNull();
  // "Lies left of The internet's left edge": the callout starts to the left of it (its words run past that edge; nothing overlaps).
  expect(listening!.left).toBeLessThan(internet!.left);
  expect(listening!.top).toBeGreaterThanOrEqual(plate!.bottom - 1);
  // E27: the dot is drawn on the listener's edge by design, so its centre must be within 2 px of the listener's box.
  const dot = await page.evaluate(() => {
    // The listener's leader dot (in the café's callout group).
    const d = document.querySelector('svg[data-figure="net-map"] g[data-base="cafe"] .nm-lead-dot')?.getBoundingClientRect();
    // The café's listener group is the café's group with the most parts (the plate is the one with a single part).
    const groups = [...document.querySelectorAll<SVGGElement>('svg[data-figure="net-map"] g[data-base="cafe"]')];
    const c = groups.sort((x, y) => y.children.length - x.children.length)[0]?.getBoundingClientRect();
    if (d === undefined || c === undefined) return null;
    const cx = d.left + d.width / 2;
    const cy = d.top + d.height / 2;
    return { inside: cx >= c.left - 2 && cx <= c.right + 2 && cy >= c.top - 2 && cy <= c.bottom + 2 };
  });
  expect(dot).toEqual({ inside: true });
});

test('36: mid-ride on step 3’s ESP, the point at a tag’s centre is inside the tags’ layer', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT);
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await openStep(page, 3, false);
  await page.evaluate(() => {
    const seen: { hits: number; inTags: number } = { hits: 0, inTags: 0 };
    (window as unknown as { __tags: typeof seen }).__tags = seen;
    const tick = () => {
      for (const tag of document.querySelectorAll<SVGGraphicsElement>('#nm-l-tags > *')) {
        const r = tag.getBoundingClientRect();
        if (r.width === 0) continue;
        seen.hits += 1;
        const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        if (at !== null && document.querySelector('#nm-l-tags')!.contains(at)) seen.inTags += 1;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await playButton(page).click();
  await expect(playButton(page)).toHaveText('Play all', { timeout: RUN_TIMEOUT });
  const seen = await page.evaluate(() => (window as unknown as { __tags: { hits: number; inTags: number } }).__tags);
  expect(seen.hits, 'a tag was drawn mid-ride').toBeGreaterThan(0);
  expect(seen.inTags, 'the tags’ centres are reached through the tags’ layer').toBe(seen.hits);
});

test('37: step 5 played to its end: the lock turns on only when the last ride lands, and it stays on at Learn', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT);
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await openStep(page, 5, false);
  await page.evaluate(() => {
    const seen: { early: boolean; sawOn: boolean } = { early: false, sawOn: false };
    (window as unknown as { __lock: typeof seen }).__lock = seen;
    const tick = () => {
      const on = document.querySelector('#nm-hold-lock')?.classList.contains('on') ?? false;
      const k = document.querySelector('.console__explain .explain__kicker')?.textContent ?? '';
      if (on) seen.sawOn = true;
      // Before the run has reached the end of step 5, the lock is off.
      if (on && !/Step 5 of 5|Learn|Practice/.test(k)) seen.early = true;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await playToEnd(page);
  const seen = await page.evaluate(() => (window as unknown as { __lock: { early: boolean; sawOn: boolean } }).__lock);
  expect(seen.early, 'the lock was on before step 5 reached its end').toBe(false);
  expect(seen.sawOn, 'the lock came on during the run').toBe(true);
  await expect(page.locator('#nm-hold-lock')).toHaveClass(/\bon\b/);
  // Learn is the position after the five steps.
  await page.goto(`${PATH}?step=${(await stepCount(page)) + 1}`);
  await expect(kicker(page)).toContainText('Learn');
  await expect(page.locator('#nm-hold-lock')).toHaveClass(/\bon\b/);
});

test('38: the sealed band’s centre pixel differs from the plate beside it, in both themes', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  for (const scheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await open(page, PATH);
    await openStep(page, 3, false);
    const point = await page.evaluate(() => {
      const el = document.querySelector<SVGPolylineElement>('svg[data-figure="net-map"] .nm-conn.tunnel.sealed')!;
      const at = el.getPointAtLength(el.getTotalLength() / 2);
      const m = el.getScreenCTM()!;
      const x = m.a * at.x + m.c * at.y + m.e;
      const y = m.b * at.x + m.d * at.y + m.f;
      return { x, y };
    });
    const shot = await figure(page).screenshot();
    const [band, plate] = await page.evaluate(async ({ data, at }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${data}`;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const box = document.querySelector('svg[data-figure="net-map"]')!.getBoundingClientRect();
      const px = (x: number, y: number) => Array.from(ctx.getImageData(Math.round(x - box.left), Math.round(y - box.top), 1, 1).data.slice(0, 3));
      return [px(at.x, at.y), px(at.x + 6, at.y)];
    }, { data: shot.toString('base64'), at: point });
    expect(band.join(','), `${scheme}: the band’s pixel against the plate’s`).not.toBe(plate.join(','));
  }
});

test('39: VPN has no Network / Sequence switch and no OSI chip, at the overview and at step 3', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await expect(viewSwitch(page)).toHaveCount(0);
  await expect(page.locator('.topbar__osi')).toHaveCount(0);
  await openStep(page, 3, false);
  await expect(viewSwitch(page)).toHaveCount(0);
  await expect(page.locator('.topbar__osi')).toHaveCount(0);
});

for (const scheme of ['dark', 'light'] as const) {
  test(`40 in the ${scheme} theme: the VPN card on /networking shows the spot, its title and its sentence, at stop 20`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await checkCard(page, 'vpn', 20, ariaOf('vpn'));
    const card = lessonCard(page, 'vpn');
    await expect(card.locator('h3')).toHaveText('VPN');
    await expect(card).toContainText(CARD_SUB);
  });
}

test('the lesson is one of the Networking lessons with a page, and the run ends with no error', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT);
  const errors = collectErrors(page);
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await playToEnd(page);
  expect(errors).toEqual([]);
});
