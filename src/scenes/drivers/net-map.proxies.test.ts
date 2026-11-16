// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { NET_MAP_PART_SENTENCES } from '../../art/scenes/net-map-layers';
import { proxiesFixture } from '../../content/proxies-fixture';
import type { MessageEvent } from '../../content/schema';
import { deriveState, positionOf, slotsFor, stepEvents } from '../../engine/timeline';
import { showSweep } from '../../test/show-sweep';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { netMapDriver } from './net-map';

// D15a / B18a, attack cases 7 to 15 (prototypes/d15-proxies-cases.md), the Proxies fixture on the patched driver, each step settled.

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
const lesson = proxiesFixture();
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o });

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawn.svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
  return { root, driver: netMapDriver.create(root, data) };
}

/** The view at step `step` (1 to 5) once `played` of its events have played (`Infinity`: all of them). */
const viewAt = (step: number, played = 0): SceneView => {
  const p = positionOf(lesson, 0, 'step', step);
  return sceneViewOf(lesson.units[0]!, deriveState(lesson, p, Math.min(played, stepEvents(lesson, p).length)));
};
const end = (step: number): SceneView => viewAt(step, Infinity);
const eventOf = (id: string): MessageEvent => lesson.units[0]!.steps.flatMap((s) => s.events).find((e) => e.id === id) as MessageEvent;

/** The figure as the page holds it, each style written one way (jsdom keeps "opacity:0" as written until a driver sets it). */
function looks(root: SVGSVGElement): string {
  const copy = root.cloneNode(true) as SVGSVGElement;
  for (const el of copy.querySelectorAll<SVGElement>('[style]')) el.setAttribute('style', el.style.cssText);
  return copy.outerHTML;
}
const hiddenOf = (root: SVGSVGElement, base: string): boolean[] => [...root.querySelectorAll(`[data-base="${base}"]`)].map((el) => el.hasAttribute('data-hidden'));
const conns = (root: SVGSVGElement): SVGPolylineElement[] => [...root.querySelectorAll<SVGPolylineElement>('#nm-conns > polyline')];
const pageText = (root: SVGSVGElement): string[] => [...root.querySelectorAll<SVGElement>('#nm-page [data-part="text"]')].map((el) => el.style.opacity);
const lockOn = (root: SVGSVGElement): boolean[] => [...root.querySelectorAll('.nm-hold')].filter((el) => el.id.includes('-hold-lock')).map((el) => el.classList.contains('on'));
const callouts = (root: SVGSVGElement): string[] =>
  [...root.querySelectorAll<SVGElement>('#nm-l-calls [data-layer] text, #nm-l-calls [data-base] text')]
    .filter((el) => el.closest('[data-hidden]') === null && el.closest('[data-layer][display="none"]') === null)
    .map((el) => el.textContent ?? '');
const rowsOf = (step: number): string[] => deriveState(lesson, positionOf(lesson, 0, 'step', step), 99).tables.seen!.rows.map((r) => r.way as string);
/** A point of a route along the cables' tops, written as the driver writes a line's points. */
function onCable([x, y]: number[]): string {
  const [ax, bx, cx, ay, by, cy] = data.M as [number, number, number, number, number, number];
  return `${(data.O[0] + ax * x! + bx * y! + cx * data.TZ).toFixed(1)},${(data.O[1] + ay * x! + by * y! + cy * data.TZ).toFixed(1)}`;
}

test('7: after step 1 neither proxy is shown, one sealed line runs laptop to site, the page and padlock are on, the table has Straight', () => {
  const { root, driver } = mount();
  driver.show(end(1));
  expect(hiddenOf(root, 'proxy')).toEqual([true, true, true, true, true]);
  expect(hiddenOf(root, 'reverse')).toEqual([true, true, true]);
  expect(hiddenOf(root, 'direct')).toEqual([false]);
  expect(conns(root).map((l) => l.getAttribute('class'))).toEqual(['nm-conn sealed']);
  expect(pageText(root).every((o) => o === '1')).toBe(true);
  expect(lockOn(root).every(Boolean)).toBe(true);
  expect(rowsOf(1)).toEqual(['Straight']);
});

test('8: step 2’s first frame shows the forward proxy and nothing of the first visit, and leaves the resolver hidden', () => {
  const { root, driver } = mount();
  driver.show(end(1));
  driver.show(viewAt(2, 0));
  expect(hiddenOf(root, 'proxy').some(Boolean)).toBe(false);
  expect(pageText(root).every((o) => o === '0')).toBe(true);
  expect(lockOn(root).some(Boolean)).toBe(false);
  expect(conns(root)).toHaveLength(0);
  expect(hiddenOf(root, 'resolver').every(Boolean)).toBe(true);
});

test('8b: `fresh` leaves the address bar, the status, the trays and the parks as they were', () => {
  const { root, driver } = mount();
  // Played before step 2's `fresh`: the mail server's tray on, and a tag parked in the laptop's bay 1.
  const earlier = (view: SceneView): SceneView => ({
    ...view,
    cues: [
      { cue: 'tray', arg: 'mail on', eventId: 'earlier', current: false },
      { cue: 'park', arg: 'laptop 1 GET', eventId: 'earlier', current: false },
      ...view.cues,
    ],
  });
  const webTray = (): boolean => root.querySelector('.nm-hold[id$="-hold-mail"]')!.classList.contains('on');
  driver.show(earlier(end(1)));
  const before = ['nm-url', 'nm-lapState', 'nm-lapAddr'].map((id) => root.querySelector(`#${id}`)!.textContent);
  expect(before[0]).toBe('techconcepts.app');
  expect(before[1]).toBe('Wants techconcepts.app');
  const parked = root.querySelectorAll('.nm-park, .nm-gap').length;
  expect(parked).toBeGreaterThan(0);
  expect(webTray()).toBe(true);
  driver.show(earlier(viewAt(2, 0)));
  expect(['nm-url', 'nm-lapState', 'nm-lapAddr'].map((id) => root.querySelector(`#${id}`)!.textContent)).toEqual(before);
  expect(root.querySelectorAll('.nm-park, .nm-gap')).toHaveLength(parked);
  expect(webTray()).toBe(true);
});

test('9: after step 2 one open line runs through the box’s top: its points are laptop>proxy then proxy>origin without its first point', () => {
  const { root, driver } = mount();
  driver.show(end(2));
  const [line] = conns(root);
  expect(conns(root)).toHaveLength(1);
  expect(line!.getAttribute('class')).toBe('nm-conn');
  const points = line!.getAttribute('points')!.split(' ');
  expect(points).toHaveLength(20);
  const ride = (key: string) => data.routes[key]!;
  // laptop>proxy's points, then proxy>origin's without its first, which is the same point on the box's top.
  expect(points).toEqual([...ride('laptop>proxy'), ...ride('proxy>origin').slice(1)].map(onCable));
});

test('10: at step 3 the same line is sealed, one polyline; the forward proxy’s part has three texts and nothing padlock-like', () => {
  const { root, driver } = mount();
  driver.show(viewAt(3, 0));
  expect(conns(root).map((l) => l.getAttribute('class'))).toEqual(['nm-conn sealed']);
  const texts = [...root.querySelectorAll('[data-base="proxy"] text')].map((t) => t.textContent);
  expect(texts.sort()).toEqual(['203.0.113.30', 'Forward proxy', 'PROXY.EXAMPLE.NET'].sort());
  expect(root.querySelectorAll('[data-base="proxy"] [class*="lock"], [data-base="proxy"][class*="lock"]')).toHaveLength(0);
});

test('11a and 13: the page and padlock come on at the end of steps 3 and 5, and the table holds Straight, then Forward proxy, then Reverse proxy', () => {
  const { root, driver } = mount();
  driver.show(end(3));
  expect(pageText(root).every((o) => o === '1')).toBe(true);
  expect(lockOn(root).every(Boolean)).toBe(true);
  expect(rowsOf(3)).toEqual(['Straight', 'Forward proxy']);
  driver.show(end(5));
  expect(pageText(root).every((o) => o === '1')).toBe(true);
  expect(lockOn(root).every(Boolean)).toBe(true);
  expect(rowsOf(5)).toEqual(['Straight', 'Forward proxy', 'Reverse proxy']);
});

test('11b: a message to the forward proxy lights its busy light as it lands, and one from it as it leaves', async () => {
  const { root, driver } = mount();
  const light = (): boolean => root.querySelector('#nm-proxies-busy-proxy')!.classList.contains('on');
  for (const [id, step, before] of [['s2-connect', 2, 0], ['s2-tcp', 2, 1]] as const) {
    const view = viewAt(step, before);
    driver.show(view);
    const e = eventOf(id);
    now = 0;
    const p = driver.play(e, view, options());
    frameAt(0);
    expect(light(), `${id} leaving`).toBe(e.from === 'proxy');
    frameAt(netMapDriver.duration(e, data));
    await vi.advanceTimersByTimeAsync(0);
    expect(light(), `${id} landed`).toBe(e.to === 'proxy' || e.from === 'proxy' ? e.to === 'proxy' : false);
    await vi.runAllTimersAsync();
    await p;
  }
});

test('11c: at the end of step 4 no busy light is on (the reverse box’s band is not lit during the note)', () => {
  const { root, driver } = mount();
  driver.show(end(4));
  expect(root.querySelectorAll('[id*="-busy-"].on')).toHaveLength(0);
});

test.each([4, 5])('12: step %i, at its start and at its end: the reverse proxy is shown, the forward proxy and the direct callout are off, one sealed line ends at the reverse proxy', (step) => {
  const { root, driver } = mount();
  for (const view of [viewAt(step, 0), end(step)]) {
    driver.show(view);
    expect(hiddenOf(root, 'proxy').every(Boolean)).toBe(true);
    expect(hiddenOf(root, 'reverse').some(Boolean)).toBe(false);
    expect(hiddenOf(root, 'direct')).toEqual([true]);
    const text = callouts(root);
    for (const words of ['Reverse proxy', '198.51.100.7 · port 443', 'Web server', '10.0.0.20 · port 80']) expect(text, words).toContain(words);
    expect(conns(root).map((l) => l.getAttribute('class'))).toEqual(['nm-conn sealed']);
    const points = conns(root)[0]!.getAttribute('points')!;
    expect(conns(root)).toHaveLength(1);
    expect(points.split(' ')).toEqual(data.routes['laptop>reverse']!.map(onCable));
    // Nothing runs on to the site's own end: the reverse proxy is where the line stops.
    expect(points.endsWith(onCable(data.routes['laptop>origin']!.at(-1)!))).toBe(false);
  }
});

test('14: a fresh driver’s show at each step’s start and end equals one driver shown the steps in turn, and back', () => {
  expect(showSweep(lesson)).toBeGreaterThan(0);
}, 60_000);

test('14b: under reduced motion, show(before) then play(event) equals show(after) for all 17 events', async () => {
  const slots = slotsFor(lesson);
  let count = 0;
  for (let p = 0; p < slots.length; p++) {
    if (slots[p]!.kind !== 'step') continue;
    const events = stepEvents(lesson, p);
    for (let i = 0; i < events.length; i++) {
      const e = events[i]!;
      const a = mount();
      const view = sceneViewOf(lesson.units[0]!, deriveState(lesson, p, i));
      a.driver.show(view);
      const run = a.driver.play(e, view, options({ reducedMotion: true }));
      await vi.runAllTimersAsync();
      await run;
      const b = mount();
      b.driver.show(sceneViewOf(lesson.units[0]!, deriveState(lesson, p, i + 1)));
      expect(looks(a.root), e.id).toBe(looks(b.root));
      document.body.innerHTML = '';
      count++;
    }
  }
  expect(count).toBe(17);
}, 60_000);

test('15: the figure’s description carries the forward proxy’s sentence at steps 2 and 3 only, the reverse proxy’s at 4 and 5 only, and never the resolver’s', () => {
  const { root, driver } = mount();
  const [forward, reverse] = [NET_MAP_PART_SENTENCES.proxy!, NET_MAP_PART_SENTENCES.reverse!];
  const original = root.getAttribute('aria-label')!;
  for (const [step, f, r] of [[1, false, false], [2, true, false], [3, true, false], [4, false, true], [5, false, true]] as const) {
    for (const view of [viewAt(step, 0), end(step)]) {
      driver.show(view);
      const label = root.getAttribute('aria-label')!;
      expect(label.includes(forward), `forward at ${step}`).toBe(f);
      expect(label.includes(reverse), `reverse at ${step}`).toBe(r);
      expect(label).not.toContain('DNS resolver');
    }
  }
  expect(original).toContain('DNS resolver');
  // The Overview: the original label with the resolver's sentence left out, and no part's sentence added.
  driver.show(sceneViewOf(lesson.units[0]!, deriveState(lesson, positionOf(lesson, 0, 'overview'), 0)));
  expect(root.getAttribute('aria-label')).toBe(original.replace(' Behind it, the DNS resolver, a card-index cabinet.', ''));
});

test('19c: a line opened through the proxy is named with its via: sealing laptop>origin names a line that is not open', () => {
  const { driver } = mount();
  const view = end(2);
  const cue = { cue: 'conn', arg: 'seal laptop>origin', eventId: 'x', current: true };
  expect(() => driver.show({ ...view, cues: [...view.cues, cue] })).toThrow('seals laptop>origin, which is not open');
  expect(() => driver.show({ ...view, cues: [...view.cues, { ...cue, arg: 'seal laptop>proxy>origin' }] })).not.toThrow();
});
