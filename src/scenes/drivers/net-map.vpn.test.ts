// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { vpnFixture } from '../../content/vpn-fixture';
import type { MessageEvent } from '../../content/schema';
import { deriveState, positionOf, slotsFor, stepEvents } from '../../engine/timeline';
import { showSweep } from '../../test/show-sweep';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { netMapDriver } from './net-map';

// D15b / B18b, attack cases 10 to 21 (prototypes/d15-vpn-cases.md, with E14 to E25): the VPN fixture on the patched driver.
// "s.n" is step s with n of its events played (H5's recipe): `viewAt(s, n)`.

let waiting = new Map<number, FrameRequestCallback>();
let nextId = 1;
let now = 0;
const frameAt = (ms: number): void => {
  now = ms;
  const callbacks = [...waiting.values()];
  waiting = new Map();
  for (const cb of callbacks) cb(ms);
};
beforeEach(() => {
  waiting = new Map();
  nextId = 1;
  now = 0;
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = nextId++;
    waiting.set(id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => waiting.delete(id));
  vi.spyOn(performance, 'now').mockImplementation(() => now);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

const drawn = drawNetMap();
const data = drawn.data as NetMapData;
const lesson = vpnFixture();
const unit = lesson.units[0]!;
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o });

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawn.svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
  return { root, driver: netMapDriver.create(root, data) };
}

const viewAt = (step: number, played = 0): SceneView => {
  const p = positionOf(lesson, 0, 'step', step);
  return sceneViewOf(unit, deriveState(lesson, p, Math.min(played, stepEvents(lesson, p).length)));
};
const eventAt = (step: number, n: number): MessageEvent => stepEvents(lesson, positionOf(lesson, 0, 'step', step))[n - 1] as MessageEvent;
const all = unit.steps.flatMap((s) => s.events);
const text = (root: SVGSVGElement, id: string): string => root.querySelector(`#${id}`)!.textContent ?? '';
const hear = (root: SVGSVGElement): string | null => root.querySelector('#nm-listener')!.getAttribute('data-hear');
const conns = (root: SVGSVGElement): SVGPolylineElement[] => [...root.querySelectorAll<SVGPolylineElement>('#nm-conns > polyline')];
const lockOn = (root: SVGSVGElement): boolean => root.querySelector('#nm-hold-lock')!.classList.contains('on');
const hidden = (root: SVGSVGElement): string[] => [...root.querySelectorAll('[data-hidden]')].map((el) => el.getAttribute('data-base') ?? '');
const pageText = (root: SVGSVGElement): string[] => [...root.querySelectorAll<SVGElement>('#nm-page [data-part="text"]')].map((el) => el.style.opacity);
/** A point of a route along the cables' tops, written as the driver writes a line's points. */
function onCable([x, y]: number[]): string {
  const [ax, bx, cx, ay, by, cy] = data.M as [number, number, number, number, number, number];
  return `${(data.O[0] + ax * x! + bx * y! + cx * data.TZ).toFixed(1)},${(data.O[1] + ay * x! + by * y! + cy * data.TZ).toFixed(1)}`;
}
/** Every state of every step, as (step, events played), the end of the lesson last. */
const STATES: [number, number][] = unit.steps.flatMap((s, i) => Array.from({ length: s.events.length + 1 }, (_, n) => [i + 1, n] as [number, number]));
const before = (step: number, n: number, then: [number, number]): boolean => step < then[0] || (step === then[0] && n < then[1]);

test('10: step 1 opened hides home (2 groups), the resolver (5) and the phone (2), and not the café; its description is the café’s', () => {
  const { root, driver } = mount();
  driver.show(viewAt(1, 0));
  // Proxies' parts are drawn hidden too, and not what is under test here.
  expect(hidden(root).filter((base) => !['proxy', 'reverse'].includes(base)).sort()).toEqual(['home', 'home', 'phone', 'phone', 'resolver', 'resolver', 'resolver', 'resolver', 'resolver']);
  expect(hidden(root)).not.toContain('cafe');
  expect(root.querySelectorAll('[data-base="cafe"]')).toHaveLength(3);
  const aria = root.getAttribute('aria-label')!;
  expect(aria).toContain('On the left, a café: your laptop, the café’s router, and someone else on its Wi-Fi, listening.');
  expect(aria).toContain('the VPN server, where the tunnel from your laptop ends.');
  expect(aria).not.toContain('your home');
  expect(aria).not.toContain('DNS resolver');
});

test('11: the laptop keeps its address, 192.168.1.100, in every state, at Learn and at Practice', () => {
  const { root, driver } = mount();
  for (const [s, n] of STATES) {
    driver.show(viewAt(s, n));
    expect(text(root, 'nm-lapAddr'), `${s}.${n}`).toBe('192.168.1.100');
  }
  expect(all.some((e) => e.type === 'message' && e.cues?.some((c) => c.cue === 'addr'))).toBe(false);
});

test('12: the listener hears nothing at 1.0, reads from 1.1 to 2.4, and sees only the outside from 3.1 to the end', () => {
  const { root, driver } = mount();
  for (const [s, n] of STATES) {
    driver.show(viewAt(s, n));
    const want = before(s, n, [1, 1]) ? null : before(s, n, [3, 1]) ? 'reads' : 'outside';
    expect(hear(root), `${s}.${n}`).toBe(want);
  }
  for (const s of [4, 5]) {
    driver.show(viewAt(s, 0));
    expect(hear(root), `step ${s} opened`).toBe('outside');
  }
  // Both on one event: `outside` wins.
  const view = viewAt(1, 0);
  driver.show({ ...view, cues: [...view.cues, { cue: 'listener', arg: 'reads', eventId: 'x', current: true }, { cue: 'listener', arg: 'outside', eventId: 'y', current: true }] });
  expect(hear(root)).toBe('outside');
});

test('13: the tunnel: none at 1.x and 2.0, one dim band from 2.1, sealed from 2.4, ending at the pad, never alt and never moved', () => {
  const { root, driver } = mount();
  for (const [s, n] of STATES) {
    driver.show(viewAt(s, n));
    const lines = conns(root);
    if (before(s, n, [2, 1])) {
      expect(lines, `${s}.${n}`).toHaveLength(0);
      continue;
    }
    expect(lines, `${s}.${n}`).toHaveLength(1);
    const line = lines[0]!;
    expect(line.getAttribute('class'), `${s}.${n}`).toBe(before(s, n, [2, 4]) ? 'nm-conn tunnel' : 'nm-conn tunnel sealed');
    expect(line.hasAttribute('transform')).toBe(false);
    const points = line.getAttribute('points')!.split(' ');
    expect(points.at(-1)).toBe(onCable([-31, -145, 3]));
    expect(points).toEqual(data.routes['laptop>vpn']!.map(onCable));
    // None of the plain leg's cable (the pad's right side to router c) is in it.
    for (const p of data.routes['web>vpn-out']!.slice(0, -1)) expect(points).not.toContain(onCable(p));
  }
});

test('14: each status lands on its event and holds across the step boundary until the next', () => {
  const { root, driver } = mount();
  const want = (s: number, n: number): string => {
    if (before(s, n, [1, 1])) return 'On the café’s Wi-Fi';
    if (before(s, n, [2, 1])) return 'Readable on the café’s Wi-Fi';
    if (before(s, n, [2, 4])) return 'Setting up the tunnel';
    if (before(s, n, [3, 1])) return 'Tunnel ready';
    if (before(s, n, [4, 2])) return 'Sealed in the tunnel';
    if (before(s, n, [5, 1])) return 'Plain again past the VPN server';
    return 'Sealed all the way to the site';
  };
  for (const [s, n] of STATES) {
    driver.show(viewAt(s, n));
    expect(text(root, 'nm-lapState'), `${s}.${n}`).toBe(want(s, n));
  }
});

test('15: the page from 1.3, the address bar https from 5.1, the padlock only at 5.6 and after', () => {
  const { root, driver } = mount();
  for (const [s, n] of STATES) {
    driver.show(viewAt(s, n));
    expect(pageText(root).every((o) => o === '1'), `page ${s}.${n}`).toBe(!before(s, n, [1, 3]));
    expect(text(root, 'nm-url'), `url ${s}.${n}`).toBe(before(s, n, [5, 1]) ? 'example.net' : 'https://example.net');
    expect(lockOn(root), `lock ${s}.${n}`).toBe(s === 5 && n === 6);
  }
  expect(lockOn(root)).toBe(true);
});

test('16: a cue the map refuses throws before the figure changes', () => {
  const { root, driver } = mount();
  driver.show(viewAt(2, 4));
  const looks = root.outerHTML;
  const view = viewAt(2, 4);
  const cue = (c: string, arg?: string) => ({ ...view, cues: [...view.cues, { cue: c, ...(arg === undefined ? {} : { arg }), eventId: 'x', current: true }] });
  expect(() => driver.show({ ...view, start: [...view.start, { cue: 'hide', arg: 'home' }] })).toThrow('cannot hide "home"');
  expect(() => driver.show(cue('listener', 'sees'))).toThrow(/listener/);
  expect(() => driver.show(cue('conn', 'open laptop>vpn data tunnel'))).toThrow(/not "open laptop>vpn data tunnel"/);
  expect(root.outerHTML).toBe(looks);
  driver.show(viewAt(1, 0));
  const fresh = root.outerHTML;
  const v1 = viewAt(1, 0);
  expect(() => driver.show({ ...v1, cues: [...v1.cues, { cue: 'conn', arg: 'seal laptop>vpn tunnel', eventId: 'x', current: true }] })).toThrow('seals laptop>vpn tunnel, which is not open');
  expect(root.outerHTML).toBe(fresh);
});

test('17: the band is drawn after the cables and under the things and the tags', () => {
  const { root } = mount();
  const order = (a: string, b: string): number => root.querySelector(`#${a}`)!.compareDocumentPosition(root.querySelector(`#${b}`)!);
  expect(order('nm-conns', 'nm-l-things') & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(order('nm-l-things', 'nm-l-tags') & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('18: the rides last as measured, a table update lands at once, and the steps total as the spec says', () => {
  const ms = (e: MessageEvent): number => netMapDriver.duration(e, data);
  expect(ms(eventAt(2, 1))).toBeCloseTo(2090, -1);
  expect(Math.abs(ms(eventAt(2, 1)) - 2090)).toBeLessThanOrEqual(1);
  expect(Math.abs(ms(eventAt(4, 2)) - 1926)).toBeLessThanOrEqual(1);
  expect(Math.abs(ms(eventAt(1, 1)) - 2015)).toBeLessThanOrEqual(1);
  const totals = unit.steps.map((s) => s.events.reduce((sum, e) => sum + netMapDriver.duration(e, data), 0));
  [4030, 8360, 2090, 5942, 8032].forEach((want, i) => expect(Math.abs(totals[i]! - want), `step ${i + 1}`).toBeLessThanOrEqual(2));
  for (const e of all.filter((x) => x.type === 'table')) expect(netMapDriver.duration(e, data), e.id).toBe(0);
});

/** Plays event n of step s on the view before it, runs the ride to `k` of its way and leaves it there. */
async function midRide(step: number, n: number, k: number): Promise<{ root: SVGSVGElement; land: () => Promise<void> }> {
  const { root, driver } = mount();
  const view = viewAt(step, n - 1);
  driver.show(view);
  const e = eventAt(step, n);
  now = 0;
  const p = driver.play(e, view, options());
  frameAt(0);
  const travel = netMapDriver.duration(e, data) - 450;
  frameAt(travel * k);
  return {
    root,
    land: async () => {
      frameAt(travel);
      // The rest, and any fade after the landing, run on timers and frames both.
      for (let i = 0; i < 20; i++) {
        await vi.advanceTimersByTimeAsync(100);
        frameAt(now + 100);
      }
      await p;
    },
  };
}
const tagWords = (root: SVGSVGElement): string[] => [...root.querySelectorAll<SVGElement>('#nm-l-tags .nm-tag')].filter((t) => t.style.opacity === '1').map((t) => t.querySelector('.nm-tag-t')!.textContent ?? '');

test.each([
  [4, 2, 'GET /'],
  [4, 4, 'PAGE'],
])('19: mid-ride at %i.%i the trail is the plain one, the tag reads %s, the only band is the tunnel, and the server’s out site is the lit one', async (s, n, word) => {
  const { root, land } = await midRide(s, n, 0.5);
  expect(root.querySelector('#nm-trail')!.getAttribute('class')).toBe('nm-trail');
  expect(tagWords(root)).toEqual([word]);
  expect(conns(root).map((l) => l.getAttribute('class'))).toEqual(['nm-conn tunnel sealed']);
  await land();
  // The sender's light goes off a quarter of the way along (so not at 0.5): early in the ride, the out site's is the one on.
  const early = await midRide(s, n, 0.2);
  const lit = (id: string): boolean => early.root.querySelector(`#${id}`)!.classList.contains('on');
  expect(lit(n === 2 ? 'nm-vpn-busy-vpn-out' : 'nm-vpn-busy-vpn-out')).toBe(n === 2);
  expect(lit('nm-vpn-busy-vpn')).toBe(false);
  await early.land();
});

test.each([[5, 3], [5, 5]])('19: mid-ride at %i.%i the tag reads HTTPS', async (s, n) => {
  const { root, land } = await midRide(s, n, 0.5);
  expect(tagWords(root)).toEqual(['HTTPS']);
  await land();
});

test('20: a change lands, it is not set off: the listener, the band and the lock wait for the message', async () => {
  for (const [s, n, check] of [
    [1, 1, (r: SVGSVGElement) => hear(r)],
    [2, 1, (r: SVGSVGElement) => conns(r).length],
    [3, 1, (r: SVGSVGElement) => hear(r)],
    [5, 6, (r: SVGSVGElement) => lockOn(r)],
  ] as const) {
    const { root, land } = await midRide(s, n, 0.5);
    const mid = check(root);
    await land();
    const landed = check(root);
    expect(mid, `${s}.${n} mid-ride`).toEqual(({ '1.1': null, '2.1': 0, '3.1': 'reads', '5.6': false } as const)[`${s}.${n}` as '1.1']);
    expect(landed, `${s}.${n} landed`).toEqual(({ '1.1': 'reads', '2.1': 1, '3.1': 'outside', '5.6': true } as const)[`${s}.${n}` as '1.1']);
  }
}, 60_000);

test('21: seek: every state shown fresh equals the one reached by playing, under reduced motion, for all 20 events', async () => {
  expect(showSweep(lesson)).toBeGreaterThan(0);
  const looks = (root: SVGSVGElement): string => {
    const copy = root.cloneNode(true) as SVGSVGElement;
    for (const el of copy.querySelectorAll<SVGElement>('[style]')) el.setAttribute('style', el.style.cssText);
    return copy.outerHTML;
  };
  let count = 0;
  const slots = slotsFor(lesson);
  for (let p = 0; p < slots.length; p++) {
    if (slots[p]!.kind !== 'step') continue;
    const events = stepEvents(lesson, p);
    for (let i = 0; i < events.length; i++) {
      const a = mount();
      const view = sceneViewOf(unit, deriveState(lesson, p, i));
      a.driver.show(view);
      const run = a.driver.play(events[i]!, view, options({ reducedMotion: true }));
      await vi.runAllTimersAsync();
      await run;
      const b = mount();
      b.driver.show(sceneViewOf(unit, deriveState(lesson, p, i + 1)));
      expect(looks(a.root), events[i]!.id).toBe(looks(b.root));
      document.body.innerHTML = '';
      count++;
    }
  }
  expect(count).toBe(20);
  // An abort mid-ride followed by `show` equals a fresh `show`.
  const { root, driver } = mount();
  const ctl = new AbortController();
  const view = viewAt(2, 0);
  driver.show(view);
  now = 0;
  const run = driver.play(eventAt(2, 1), view, options({ signal: ctl.signal }));
  frameAt(0);
  frameAt(500);
  ctl.abort();
  await vi.runAllTimersAsync();
  await run;
  driver.show(viewAt(2, 1));
  const fresh = mount();
  fresh.driver.show(viewAt(2, 1));
  expect(looks(root)).toBe(looks(fresh.root));
}, 90_000);
