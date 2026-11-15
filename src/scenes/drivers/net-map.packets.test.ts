// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { routerFixture } from '../../content/router-fixture';
import { batch3Fixtures } from '../../content/batch3-fixtures';
import type { Lesson, MessageEvent, SceneEvent } from '../../content/schema';
import { deriveState, positionOf, slotsFor, stepEvents } from '../../engine/timeline';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { easeInOut } from '../motion';
import { netMapDriver, routeOf } from './net-map';

// D13 / B15a's parked tags, the gap and `via` (prototypes/d13-packets-cases.md, attack cases 4 to 17, with E1 to E13),
// driven by the Packets fixture. The lesson page's own cases are B16's.

let waiting = new Map<number, FrameRequestCallback>();
let nextId = 1;
let now = 0;

function frameAt(ms: number): void {
  now = ms;
  const callbacks = [...waiting.values()];
  waiting = new Map();
  for (const cb of callbacks) cb(ms);
}

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
const lesson = batch3Fixtures.packets();
const unit = lesson.units[0]!;
const mapCss: string = readFileSync('src/art/scenes/net-map.css', 'utf8');
const driverSource: string = readFileSync('src/scenes/drivers/net-map.ts', 'utf8');

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawn.svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
  return { root, driver: netMapDriver.create(root, data) };
}

/** The view at step `step` (1 to 5) once `played` of its events have played; step 1, 0 played is the start. */
const viewAt = (step: number, played = 0, l: Lesson = lesson): SceneView => sceneViewOf(l.units[0]!, deriveState(l, positionOf(l, 0, 'step', step), played));
const event = (id: string): SceneEvent => unit.steps.flatMap((s) => s.events).find((e) => e.id === id)!;
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o });
const part = (root: SVGSVGElement, id: string): SVGElement => root.querySelector<SVGElement>(`#${id}`)!;
const flush = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(0);
};
const flatLength = (route: number[][]): number => route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!), 0);
const rideMs = (e: MessageEvent, speed = 1): number => (500 + 4 * flatLength(routeOf(data, e))) / speed;

const parks = (root: SVGSVGElement): SVGElement[] => [...root.querySelectorAll<SVGElement>('#nm-l-tags .nm-park')];
const gaps = (root: SVGSVGElement): SVGElement[] => [...root.querySelectorAll<SVGElement>('#nm-l-tags .nm-gap')];
/** `place bay words`, in bay order, for what is parked now. */
const where = (root: SVGSVGElement): string[] =>
  parks(root)
    .map((el) => `${el.dataset.place} ${el.dataset.bay} ${el.querySelector('.nm-tag-t')!.textContent}`)
    .sort();
const markup = (root: SVGSVGElement): string => [...root.querySelectorAll('.nm-park, .nm-gap')].map((el) => el.outerHTML).join('');
const scaleOf = (el: Element): number => Number(/scale\(([\d.]+)\)/.exec(el.getAttribute('transform') ?? '')?.[1] ?? 1);
/** A point of the plates on screen, as the driver places a tag. */
function onScreen([x, y, z]: number[]): [number, number] {
  const [ax, bx, cx, ay, by, cy] = data.M as [number, number, number, number, number, number];
  return [ax * x! + bx * y! + cx * z!, ay * x! + by * y! + cy * z!];
}
const onCable = ([x, y]: number[]): string => {
  const [sx, sy] = onScreen([x!, y!, data.TZ]);
  return `${(data.O[0] + sx).toFixed(1)},${(data.O[1] + sy).toFixed(1)}`;
};
const lit = (root: SVGSVGElement, id: string): boolean => part(root, id).classList.contains('on');

// ---------------------------------------------------------------- check 4: durations (E13's snapshot is net-map.durations.test.ts)

test('4c, 4d, 15: the times the spec gives, at 1×; a park or via does not lengthen a fast message', () => {
  const t = (id: string): number => netMapDriver.duration(event(id), data);
  expect(t('s1-cut')).toBe(600);
  expect(t('s5-done')).toBe(700);
  expect(t('s5-order')).toBe(600);
  for (const id of ['s4-p3', 's4-p4']) expect(Math.abs(t(id) - 2126)).toBeLessThan(1);
  expect(Math.abs(t('s3-p2') - 1399)).toBeLessThan(1);
  expect(Math.abs(t('s4-p2') - 1566)).toBeLessThan(1);
  for (const id of ['s1-req', 's2-p1']) expect(Math.abs(t(id) - 2015)).toBeLessThan(1);
  for (const id of ['s2-t1', 's4-t3', 's4-t4', 's4-t2']) expect(t(id)).toBe(0);
  // A fast message that parks its own tag: 320 + 2.2 a unit + 300, and the slide does not lengthen it.
  const fast = { ...(event('s2-p1') as MessageEvent), fast: true };
  expect(netMapDriver.duration(fast, data)).toBeCloseTo(320 + 2.2 * flatLength(data.routes['web>laptop']!) + 300, 6);
  const viaFast = { ...(event('s4-p3') as MessageEvent), fast: true };
  expect(netMapDriver.duration(viaFast, data)).toBeCloseTo(320 + 2.2 * flatLength(routeOf(data, viaFast)) + 300, 6);
});

test('15b: a note with a page and a status and no park, unpark or drop still takes no time', () => {
  const plain = { type: 'note', id: 'n', log: {}, plain: 'x', cues: [{ cue: 'page', arg: 'text' }, { cue: 'status', arg: 'Done' }] } as SceneEvent;
  expect(netMapDriver.duration(plain, data)).toBe(0);
  expect(netMapDriver.duration({ ...plain, cues: [{ cue: 'drop', arg: 'b' }] } as SceneEvent, data)).toBe(900);
});

// ---------------------------------------------------------------- check 9: routeOf

test('9b to 9d: via joins the two routes at the router’s top, once; a via on the shortest way is the plain route', () => {
  const joined = routeOf(data, { from: 'web', to: 'laptop', via: 'd' });
  expect(Math.abs(flatLength(joined) - 293.99)).toBeLessThan(0.01);
  const dTop = data.routes['web>d']!.at(-1)!;
  expect(joined.filter((p) => p[0] === dTop[0] && p[1] === dTop[1] && p[2] === dTop[2])).toHaveLength(1);
  for (let i = 1; i < joined.length; i++) expect(joined[i]).not.toEqual(joined[i - 1]);
  expect(routeOf(data, { from: 'web', to: 'laptop', via: 'b' })).toEqual(data.routes['web>laptop']);
  expect(routeOf(data, { from: 'web', to: 'laptop', via: 'c' })).toEqual(data.routes['web>laptop']);
  expect(routeOf(data, { from: 'web', to: 'laptop' })).toBe(data.routes['web>laptop']);
});

test('12: for every place and every router, both halves of a via exist', () => {
  for (const place of ['laptop', 'router', 'resolver', 'web']) for (const r of ['isp', 'a', 'b', 'c', 'd']) {
    if (place === r) continue;
    expect(Object.hasOwn(data.routes, `${place}>${r}`), `${place}>${r}`).toBe(true);
    expect(Object.hasOwn(data.routes, `${r}>${place}`), `${r}>${place}`).toBe(true);
  }
});

// ---------------------------------------------------------------- the settled figure (6, 7, 8, 10, 11, 13)

test('6a to 6c: after the cut, four unlit tags at the web server, 0.9 their size, behind the moving tags, back to front', () => {
  const { root, driver } = mount();
  driver.show(viewAt(2, 0));
  expect(where(root)).toEqual(['web 1 PIECE 1', 'web 2 PIECE 2', 'web 3 PIECE 3', 'web 4 PIECE 4']);
  const layer = part(root, 'nm-l-tags');
  const children = [...layer.children];
  for (const el of parks(root)) {
    expect(el.querySelector('[data-lit]')).toBeNull();
    expect(el.hasAttribute('id')).toBe(false);
    expect(el.hasAttribute('style')).toBe(false);
    expect(el.getAttribute('transform')).toContain('scale(0.900)');
    expect(children.indexOf(el)).toBeLessThan(children.indexOf(part(root, 'nm-tag-1')));
  }
  const order = parks(root).map((el) => data.bays.web![Number(el.dataset.bay) - 1]!);
  const sums = order.map((b) => b[0]! + b[1]!);
  expect(sums).toEqual([...sums].sort((a, b) => a - b));
  // The sort is the one that holds: the document order is the depth order, bay 1 (the back) first.
  expect(parks(root).map((el) => el.dataset.bay)).toEqual(['1', '2', '3', '4']);
});

test('6b: a parked tag’s words take the strongest line colour, the moving tag’s keep the lit ink, and the gap is dashed with a steady stroke', () => {
  expect(mapCss).toContain('.nm .nm-park .nm-tag-t { fill: var(--anatomy-hi); }');
  expect(mapCss).toContain('.nm .nm-gap { fill: none; stroke: var(--anatomy-mid); stroke-width: 1.2px; stroke-dasharray: 3 2.5; vector-effect: non-scaling-stroke; }');
  expect(mapCss).toContain('.nm .nm-tag-t { font: 700 3.9px var(--mono); fill: color-mix(in srgb, var(--lit-b) 30%, #000); letter-spacing: .02em; }');
});

test('7a, 8a, 10a, 11a, 13a: the map after each step, as the spec lists it', () => {
  const { root, driver } = mount();
  driver.show(viewAt(3, 0));
  expect(where(root)).toEqual(['laptop 1 PIECE 1', 'web 2 PIECE 2', 'web 3 PIECE 3', 'web 4 PIECE 4']);
  expect(gaps(root)).toHaveLength(0);
  driver.show(viewAt(4, 0));
  expect(where(root)).toEqual(['b 1 PIECE 2', 'laptop 1 PIECE 1', 'web 3 PIECE 3', 'web 4 PIECE 4']);
  // PIECE 2 stands on router b’s top: the point its message ended on.
  const b = parks(root).find((el) => el.dataset.place === 'b')!;
  const [x, y] = onScreen(data.routes['web>b']!.at(-1)!);
  expect(b.getAttribute('transform')).toBe(`translate(${(x + data.O[0]).toFixed(1)} ${(y + data.O[1]).toFixed(1)}) scale(0.900) translate(${-data.O[0]} ${-data.O[1]})`);
  driver.show(viewAt(4, 1));
  expect(where(root)).toEqual(['b 1 PIECE 2', 'laptop 1 PIECE 1', 'laptop 3 PIECE 3', 'web 4 PIECE 4']);
  expect(gaps(root).map((g) => [g.dataset.place, g.dataset.bay])).toEqual([['laptop', '2']]);
  driver.show(viewAt(4, 3));
  expect(where(root)).toEqual(['b 1 PIECE 2', 'laptop 1 PIECE 1', 'laptop 3 PIECE 3', 'laptop 4 PIECE 4']);
  driver.show(viewAt(4, 5));
  expect(where(root)).toEqual(['laptop 1 PIECE 1', 'laptop 2 PIECE 2', 'laptop 3 PIECE 3', 'laptop 4 PIECE 4']);
  expect(gaps(root)).toHaveLength(0);
  expect(part(root, 'nm-lapState').textContent).toBe('All 4 pieces here');
  expect(part(root, 'nm-lapState').getAttribute('class')).toBe('nm-state');
  driver.show(viewAt(5, 2));
  expect(parks(root)).toHaveLength(0);
  expect(gaps(root)).toHaveLength(0);
  expect(part(root, 'nm-lapState').textContent).toBe('Page complete');
  expect(part(root, 'nm-lapState').getAttribute('class')).toBe('nm-state done');
  const text = root.querySelector<SVGElement>('#nm-page [data-part="text"]')!;
  expect(text.style.opacity).toBe('1');
});

test('10a: the status after PIECE 3 lands, and the gap’s polygon is the four corners of the spec (§4.1)', () => {
  const { root, driver } = mount();
  driver.show(viewAt(4, 1));
  expect(part(root, 'nm-lapState').textContent).toBe('Out of order: piece 2 not here yet');
  const gap = gaps(root)[0]!;
  const w = (7 * 2.9 + 8) * 0.9; // the tag above it, PIECE 1, is 7 letters
  expect(w).toBeCloseTo(25.47, 2);
  const [x, y, z] = data.bays.laptop![1]!;
  const corners = [[-w / 2, -4.5], [w / 2, -4.5], [w / 2, 4.5], [-w / 2, 4.5]].map(([u, v]) => {
    const [sx, sy] = onScreen([x! + u!, y! + v!, z! + 3.2 * 0.9]);
    return `${(data.O[0] + sx).toFixed(1)},${(data.O[1] + sy).toFixed(1)}`;
  });
  expect(gap.getAttribute('points')).toBe(corners.join(' '));
});

function cuesOf(entries: [string, number, string][]): SceneView {
  const base = viewAt(1, 0);
  return { ...base, cues: entries.map(([place, bay, tag], i) => ({ cue: 'park', arg: `${place} ${bay} ${tag}`, eventId: `e${i}`, current: true })) };
}

test('10c to 10e: gaps need a filled bay before and after, anywhere; each takes the width of the nearest tag before it', () => {
  const { root, driver } = mount();
  // Only bay 1 filled at the laptop: no gap. The deck at the server, bays 3 and 4 only: no gap.
  driver.show(cuesOf([['laptop', 1, 'PIECE 1']]));
  expect(gaps(root)).toHaveLength(0);
  driver.show(cuesOf([['web', 3, 'PIECE 3'], ['web', 4, 'PIECE 4']]));
  expect(gaps(root)).toHaveLength(0);
  // Bays 1 and 4: two gaps, each as wide as bay 1's tag.
  driver.show(cuesOf([['laptop', 1, 'AAAAAAA'], ['laptop', 4, 'B']]));
  expect(gaps(root).map((g) => g.dataset.bay)).toEqual(['2', '3']);
  const width = (g: SVGElement): number => {
    const p = g.getAttribute('points')!.split(' ').map((q) => q.split(',').map(Number));
    return Math.hypot(p[1]![0]! - p[0]![0]!, p[1]![1]! - p[0]![1]!);
  };
  expect(Math.abs(width(gaps(root)[0]!) - width(gaps(root)[1]!))).toBeLessThan(0.2);
  // Bays 1 (7 letters), 2 (1 letter) and 4: the gap at 3 is as wide as bay 2's tag, the nearer one.
  driver.show(cuesOf([['laptop', 1, 'AAAAAAA'], ['laptop', 2, 'B'], ['laptop', 4, 'C']]));
  const narrow = width(gaps(root)[0]!);
  driver.show(cuesOf([['laptop', 1, 'AAAAAAA'], ['laptop', 3, 'B'], ['laptop', 4, 'C']]));
  const wide = width(gaps(root)[0]!);
  expect(narrow).toBeLessThan(wide);
  // Gaps are per place, at any place.
  driver.show(cuesOf([['web', 1, 'A'], ['web', 3, 'B']]));
  expect(gaps(root).map((g) => [g.dataset.place, g.dataset.bay])).toEqual([['web', '2']]);
});

test('2c, 5a: no parked tag and no gap in any existing net-map lesson, at any position', () => {
  const lessons = Object.values(import.meta.glob<Lesson>(['../../content/lessons/*.ts', '!../../content/lessons/*.test.ts'], { import: 'default', eager: true })).filter((l) => l.figure === 'net-map');
  expect(lessons.length).toBeGreaterThanOrEqual(15);
  expect(drawn.svg).not.toMatch(/nm-park|nm-gap/);
  const { root, driver } = mount();
  for (const l of [...lessons, routerFixture()]) {
    for (let p = 0; p < slotsFor(l).length; p++) {
      const count = stepEvents(l, p).length;
      for (const n of new Set([0, count])) {
        driver.show(sceneViewOf(l.units[slotsFor(l)[p]!.unit]!, deriveState(l, p, n)));
        expect(root.querySelectorAll('.nm-park, .nm-gap').length, l.slug).toBe(0);
      }
    }
  }
}, 30_000);

test('5a: a message of an existing lesson plays to its end with no parked tag or gap', async () => {
  const lessons = Object.values(import.meta.glob<Lesson>(['../../content/lessons/*.ts', '!../../content/lessons/*.test.ts'], { import: 'default', eager: true })).filter((l) => l.figure === 'net-map');
  const { root, driver } = mount();
  for (const l of lessons) {
    const slot = slotsFor(l).findIndex((s) => s.kind === 'step');
    const first = stepEvents(l, slot).find((e) => e.type === 'message');
    if (first === undefined) continue;
    const view = sceneViewOf(l.units[slotsFor(l)[slot]!.unit]!, deriveState(l, slot, 0));
    driver.show(view);
    const p = driver.play(first, view, options({ reducedMotion: true }));
    await vi.runAllTimersAsync();
    await p;
    expect(root.querySelectorAll('.nm-park, .nm-gap').length, l.slug).toBe(0);
  }
});

// ---------------------------------------------------------------- the park note (6d, 17)

test('6d: the cut note lands the tags one after another, bay 1 first: nothing before 120 ms, all four by 480 ms', async () => {
  const { root, driver } = mount();
  const before = viewAt(1, 1);
  driver.show(before);
  const p = driver.play(event('s1-cut'), before, options());
  const shown = (): string[] => parks(root).filter((el) => el.style.opacity !== '0').map((el) => el.dataset.bay!);
  expect(parks(root)).toHaveLength(4);
  frameAt(0);
  frameAt(100);
  expect(shown()).toEqual([]);
  frameAt(130);
  expect(shown()).toEqual(['1']);
  frameAt(250);
  expect(shown()).toEqual(['1', '2']);
  frameAt(490);
  expect(shown()).toEqual(['1', '2', '3', '4']);
  frameAt(600);
  await flush();
  await p;
  expect(markup(root)).toBe(markupOfShown(viewAt(2, 0)));
});

/** What a fresh figure shows for `view`, for comparing a play's end with it. */
function markupOfShown(view: SceneView): string {
  const other = mount();
  other.driver.show(view);
  const out = markup(other.root);
  other.root.parentElement!.remove();
  return out;
}

test('6d, 17a: at 2× the reveal ends by 300 ms; under reduced motion the four are there at once and the 600 ms still passes', async () => {
  const { root, driver } = mount();
  const before = viewAt(1, 1);
  driver.show(before);
  let done = false;
  void driver.play(event('s1-cut'), before, options({ speed: 2 })).then(() => (done = true));
  frameAt(0);
  frameAt(299);
  await flush();
  expect(done).toBe(false);
  frameAt(300);
  await flush();
  expect(done).toBe(true);

  driver.show(before);
  done = false;
  void driver.play(event('s1-cut'), before, options({ reducedMotion: true })).then(() => (done = true));
  await flush();
  expect(parks(root).every((el) => el.style.opacity !== '0')).toBe(true);
  expect(done).toBe(false);
  await vi.advanceTimersByTimeAsync(599);
  expect(done).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  expect(done).toBe(true);
});

// ---------------------------------------------------------------- a message that parks (7, 16, E1, E8)

test('16a, 16b: a parked tag leaves its bay in the first frame of its ride, by words; piece 2 leaves b the same way', () => {
  const { root, driver } = mount();
  const v1 = viewAt(2, 0);
  driver.show(v1);
  void driver.play(event('s2-p1'), v1, options());
  expect(where(root)).toEqual(['web 2 PIECE 2', 'web 3 PIECE 3', 'web 4 PIECE 4']);
  expect(part(root, 'nm-tag-7').style.opacity).toBe('1');
  expect(part(root, 'nm-tag-7').querySelector('.nm-tag-t')!.textContent).toBe('PIECE 1');

  const v2 = viewAt(4, 3);
  driver.show(v2);
  expect(where(root)).toContain('b 1 PIECE 2');
  void driver.play(event('s4-p2'), v2, options());
  expect(where(root).filter((w) => w.startsWith('b '))).toEqual([]);
  // The gap at bay 2 stays while piece 2 is on its way; PIECE 3 and 4 stay.
  expect(where(root)).toEqual(['laptop 1 PIECE 1', 'laptop 3 PIECE 3', 'laptop 4 PIECE 4']);
  expect(gaps(root)).toHaveLength(2 - 1);
});

test('7b, E1: PIECE 1 slides into its bay as it rests, and is never on the map twice', async () => {
  const { root, driver } = mount();
  const before = viewAt(2, 0);
  driver.show(before);
  const e = event('s2-p1') as MessageEvent;
  const p = driver.play(e, before, options());
  const tag = part(root, 'nm-tag-7');
  frameAt(0);
  frameAt(rideMs(e));
  await flush();
  // The ride is over: the lit tag stands at the route's end at full size, and nothing is parked at the laptop yet.
  expect(tag.style.opacity).toBe('1');
  expect(tag.getAttribute('transform')).not.toContain('scale');
  expect(where(root).filter((w) => w.startsWith('laptop'))).toEqual([]);
  const slideStart = now;
  frameAt(slideStart + 125);
  expect(scaleOf(tag)).toBeGreaterThan(0.9);
  expect(scaleOf(tag)).toBeLessThan(1);
  expect(where(root).filter((w) => w.startsWith('laptop'))).toEqual([]);
  frameAt(slideStart + 250);
  await flush();
  // Landed: the lit tag, its trail and the lights are gone; the copy stands in bay 1.
  expect(tag.style.opacity).toBe('0');
  expect(part(root, 'nm-trail').style.opacity).toBe('0');
  expect(where(root)).toContain('laptop 1 PIECE 1');
  expect(lit(root, 'nm-home-led-1')).toBe(false);
  let ended = false;
  void p.then(() => (ended = true));
  await vi.advanceTimersByTimeAsync(199);
  expect(ended).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  expect(ended).toBe(true);
  expect(where(root).filter((w) => w.includes('PIECE 1'))).toEqual(['laptop 1 PIECE 1']);
});

test('7b: the trail dims to half as the slide begins', async () => {
  const { root, driver } = mount();
  const before = viewAt(2, 0);
  driver.show(before);
  const e = event('s2-p1') as MessageEvent;
  void driver.play(e, before, options());
  frameAt(0);
  expect(part(root, 'nm-trail').style.opacity).toBe('0.95');
  frameAt(rideMs(e));
  await flush();
  expect(Number(part(root, 'nm-trail').style.opacity)).toBeCloseTo(0.475, 3);
});

test('7c, 8b, E8: under reduced motion the landing paints at the rest’s start: no slide, one PIECE 1, the router’s light off', async () => {
  const { root, driver } = mount();
  const sets: string[] = [];
  const set = Element.prototype.setAttribute;
  vi.spyOn(Element.prototype, 'setAttribute').mockImplementation(function (this: Element, name: string, value: string) {
    if (this.id === 'nm-tag-7' && name === 'transform') sets.push(value);
    return set.call(this, name, value);
  });
  const before = viewAt(2, 0);
  driver.show(before);
  const e = event('s2-p1') as MessageEvent;
  let done = false;
  void driver.play(e, before, options({ reducedMotion: true })).then(() => (done = true));
  await flush();
  expect(part(root, 'nm-tag-7').style.opacity).toBe('0');
  expect(where(root)).toContain('laptop 1 PIECE 1');
  expect(sets.every((v) => !v.includes('scale('))).toBe(true);
  expect(done).toBe(false);
  await vi.advanceTimersByTimeAsync(450);
  expect(done).toBe(true);

  // PIECE 2 on router b: b's busy light is on while the ride lands and off once the landing paints.
  const v3 = viewAt(3, 0);
  driver.show(v3);
  void driver.play(event('s3-p2'), v3, options({ reducedMotion: true }));
  await flush();
  expect(lit(root, 'nm-busy-b')).toBe(false);
  expect(where(root)).toContain('b 1 PIECE 2');
});

test('17a: at 2× the slide takes 125 ms', async () => {
  const { root, driver } = mount();
  const before = viewAt(2, 0);
  driver.show(before);
  const e = event('s2-p1') as MessageEvent;
  void driver.play(e, before, options({ speed: 2 }));
  frameAt(0);
  frameAt(rideMs(e, 2));
  await flush();
  const start = now;
  frameAt(start + 124);
  expect(part(root, 'nm-tag-7').style.opacity).toBe('1');
  frameAt(start + 125);
  await flush();
  expect(part(root, 'nm-tag-7').style.opacity).toBe('0');
});

// ---------------------------------------------------------------- the ride through d (9a)

test('9a: PIECE 3 rides through d, not b, while PIECE 2 stays parked on b; one ride, one trail', async () => {
  const { root, driver } = mount();
  const before = viewAt(4, 0);
  driver.show(before);
  const e = event('s4-p3') as MessageEvent;
  void driver.play(e, before, options());
  frameAt(0);
  frameAt(rideMs(e) * 0.5);
  expect(where(root)).toContain('b 1 PIECE 2');
  frameAt(rideMs(e));
  await flush();
  const trail = part(root, 'nm-trail').getAttribute('points')!.split(' ');
  expect(trail).toContain(onCable(data.routes['web>d']!.at(-1)!));
  expect(trail).not.toContain(onCable(data.routes['web>b']!.at(-1)!));
  expect(where(root)).toContain('b 1 PIECE 2');
});

// ---------------------------------------------------------------- the hand-over (13, E8, E11)

test('13b: the unpark glides each tag toward the laptop’s screen, shrinking and fading, with no gap, and the page shows only at the end', async () => {
  const { root, driver } = mount();
  const before = viewAt(5, 1);
  driver.show(before);
  expect(parks(root)).toHaveLength(4);
  const text = root.querySelector<SVGElement>('#nm-page [data-part="text"]')!;
  const e = event('s5-done');
  void driver.play(e, before, options());
  frameAt(0);
  frameAt(350);
  expect(parks(root)).toHaveLength(4);
  for (const el of parks(root)) {
    expect(scaleOf(el)).toBeGreaterThan(0.36);
    expect(scaleOf(el)).toBeLessThan(0.9);
    expect(Number(el.style.opacity)).toBeCloseTo(0.75, 2);
  }
  // Half-way along the glide by the ease: each tag is at its bay plus half the way to the goal (E11).
  const end = data.routes['router>laptop']!.at(-1)!;
  const goal = [end[0]! - 6, end[1]! - 14, end[2]! + 16];
  const first = parks(root).find((el) => el.dataset.bay === '1')!;
  const from = data.bays.laptop![0]!;
  const mid = from.map((v, i) => v + (goal[i]! - v) * easeInOut(0.5));
  const [mx, my] = onScreen(mid);
  expect(first.getAttribute('transform')).toContain(`translate(${(mx + data.O[0]).toFixed(1)} ${(my + data.O[1]).toFixed(1)})`);
  expect(gaps(root)).toHaveLength(0);
  expect(text.style.opacity).not.toBe('1');
  frameAt(700);
  await flush();
  expect(parks(root)).toHaveLength(0);
  expect(text.style.opacity).toBe('1');
});

test('13c, E8: under reduced motion the tags stay still for the 700 ms, then the map paints without them', async () => {
  const { root, driver } = mount();
  const before = viewAt(5, 1);
  driver.show(before);
  const still = markup(root);
  let done = false;
  void driver.play(event('s5-done'), before, options({ reducedMotion: true })).then(() => (done = true));
  await vi.advanceTimersByTimeAsync(350);
  expect(markup(root)).toBe(still);
  expect(parks(root).every((el) => scaleOf(el) === 0.9 && el.style.opacity === '')).toBe(true);
  await vi.advanceTimersByTimeAsync(350);
  expect(done).toBe(true);
  expect(parks(root)).toHaveLength(0);
});

test('17a: at 2× the glide takes 350 ms', async () => {
  const { driver } = mount();
  const before = viewAt(5, 1);
  driver.show(before);
  let done = false;
  void driver.play(event('s5-done'), before, options({ speed: 2 })).then(() => (done = true));
  frameAt(0);
  frameAt(349);
  await flush();
  expect(done).toBe(false);
  frameAt(350);
  await flush();
  expect(done).toBe(true);
});

// ---------------------------------------------------------------- seek and abort (14)

test('14a: playing a step to its end leaves the parked tags and gaps that opening the next step shows', async () => {
  const play = mount();
  const slotsPlayed: [number, number][] = [[1, 2], [2, 2], [3, 1], [4, 6], [5, 2]];
  play.driver.show(viewAt(1, 0));
  for (const [step, count] of slotsPlayed) {
    for (let i = 0; i < count; i++) {
      const view = viewAt(step, i);
      const e = unit.steps[step - 1]!.events[i]!;
      const p = play.driver.play(e, view, options({ reducedMotion: true }));
      await vi.runAllTimersAsync();
      await p;
      // The panel shows the view after each event.
      play.driver.show(viewAt(step, i + 1));
    }
    const next = step < 5 ? viewAt(step + 1, 0) : viewAt(5, 2);
    expect(markup(play.root), `after step ${step}`).toBe(markupOfShown(next));
  }
});

test('14a: the play itself, with no show after it, ends on the settled markup', async () => {
  const { root, driver } = mount();
  for (const [step, i] of [[1, 1], [2, 0], [3, 0], [4, 0], [4, 2], [4, 4], [5, 1]] as const) {
    const view = viewAt(step, i);
    driver.show(view);
    const e = unit.steps[step - 1]!.events[i]!;
    const p = driver.play(e, view, options({ reducedMotion: true }));
    await vi.runAllTimersAsync();
    await p;
    const after = { ...view, cues: [...view.cues, ...(e.type === 'table' ? [] : e.cues ?? []).map((c) => ({ ...c, eventId: e.id, current: true }))] };
    expect(markup(root), `${step}.${i}`).toBe(markupOfShown(after));
  }
});

test('14b: aborting mid-slide, mid-glide or mid-reveal and showing leaves the settled figure, no stray style or scale', async () => {
  for (const [id, step, i, at] of [['s2-p1', 2, 0, 'slide'], ['s5-done', 5, 1, 'glide'], ['s1-cut', 1, 1, 'reveal']] as const) {
    const { root, driver } = mount();
    const ac = new AbortController();
    const view = viewAt(step, i);
    driver.show(view);
    const e = event(id);
    void driver.play(e, view, options({ signal: ac.signal }));
    frameAt(0);
    if (at === 'slide') {
      frameAt(rideMs(e as MessageEvent));
      await flush();
      frameAt(now + 100);
    } else frameAt(at === 'glide' ? 300 : 200);
    ac.abort();
    await flush();
    const settled = viewAt(step, i + 1);
    driver.show(settled);
    expect(markup(root), at).toBe(markupOfShown(settled));
    for (const el of parks(root)) {
      expect(el.hasAttribute('style'), at).toBe(false);
      expect(scaleOf(el), at).toBe(0.9);
    }
    for (let n = 1; n <= 16; n++) {
      const tag = part(root, `nm-tag-${n}`);
      expect(tag.getAttribute('transform') ?? '', at).not.toContain('scale(');
    }
  }
});

test('14c: clear leaves the parked tags: a message that parks nothing plays over them', async () => {
  const { root, driver } = mount();
  const view = viewAt(4, 0);
  driver.show(view);
  const e = { ...(event('s1-req') as MessageEvent), cues: [] };
  const before = markup(root);
  const p = driver.play(e, view, options({ reducedMotion: true }));
  await vi.runAllTimersAsync();
  await p;
  expect(markup(root)).toBe(before);
});

// ---------------------------------------------------------------- 17c and E7

test('17c: no play outlasts its event: with every wait taking its full time, each lasts the duration at 1× and half of it at 2×', async () => {
  for (const speed of [1, 2]) {
    for (const [step, events] of [[1, 2], [2, 1], [3, 1], [4, 5], [5, 2]] as const) {
      for (let i = 0; i < events; i++) {
        const e = unit.steps[step - 1]!.events[i]!;
        if (e.type === 'table') continue;
        const { driver } = mount();
        const view = viewAt(step, i);
        driver.show(view);
        const start = now;
        let end = -1;
        void driver.play(e, view, options({ speed })).then(() => (end = now));
        // Drive the frames each 10 ms and the timers alongside, until it ends.
        for (let t = 0; t <= 6000 && end < 0; t += 10) {
          frameAt(start + t);
          await vi.advanceTimersByTimeAsync(10);
        }
        expect(end, e.id).toBeGreaterThanOrEqual(0);
        expect(end - start, e.id).toBeLessThanOrEqual(netMapDriver.duration(e, data) / speed + 20);
        now = 0;
      }
    }
  }
});

test('E7: a tag scaled 1 keeps today’s translate form; a scaled one scales about the figure’s origin', () => {
  const { root, driver } = mount();
  driver.show(viewAt(2, 0));
  expect(parks(root)[0]!.getAttribute('transform')).toMatch(/^translate\([\d.-]+ [\d.-]+\) scale\(0\.900\) translate\(-?[\d.]+ -?[\d.]+\)$/);
  const v = viewAt(2, 0);
  const e = { ...(event('s1-req') as MessageEvent) };
  void driver.play(e, v, options());
  frameAt(0);
  frameAt(rideMs(e) / 2);
  expect(part(root, 'nm-tag-7').getAttribute('transform')).toMatch(/^translate\([\d.-]+ [\d.-]+\)$/);
});

// ---------------------------------------------------------------- the comment, the mistakes in a lesson

test('the driver’s comment lists park, unpark and via', () => {
  expect(driverSource).toContain('`park <place> <bay> <TAG>`');
  expect(driverSource).toContain('`unpark <place>`');
  expect(driverSource).toContain('A message `via` a router');
});

test('a cue the map cannot show throws: a bay the map does not have, an unpark of a place with none', () => {
  const { driver } = mount();
  const bad = (arg: string, cue = 'park'): SceneView => ({ ...viewAt(1, 0), cues: [{ cue, arg, eventId: 'x', current: true }] });
  expect(() => driver.show(bad('laptop 5 X'))).toThrow(/no bay 5 at "laptop"/);
  expect(() => driver.show(bad('moon 1 X'))).toThrow(/no bay 1 at "moon"/);
  expect(() => driver.show(bad('b 2 X'))).toThrow(/no bay 2 at "b"/);
  expect(() => driver.show(bad('laptop1 X'))).toThrow(/park cue needs/);
  expect(() => driver.show(bad('moon', 'unpark'))).toThrow(/no bays at "moon"/);
});
