// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawFirewall, type FirewallSceneData } from '../../art/scenes/firewall';
import firewalls from '../../content/lessons/networking/firewalls';
import type { SceneEvent } from '../../content/schema';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { sceneViewOf, type PanelMark, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { firewallDriver } from './firewall';
import { DRIVERS } from './index';

/** Animation frames run only when a test says so: `frameAt(ms)` runs the waiting callbacks at that time. */
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

const unit = firewalls.units[0]!;
const data = drawFirewall().data as FirewallSceneData;
// Read from the project root: under jsdom import.meta.url is not a file URL.
const sceneCss: string = readFileSync('src/art/scenes/firewall.css', 'utf8');

/** A route's length on the plate, in 3D, and how long a tag takes to ride it at 1× (the mockup's `ride`). */
const lengthOf = (pts: number[][]): number => pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - pts[i]![0]!, p[1]! - pts[i]![1]!, p[2]! - pts[i]![2]!), 0);
const ride = (name: keyof FirewallSceneData['routes']): number => 600 + 9 * lengthOf(data.routes[name]);

/** A fresh copy of the figure on the page, and its driver. */
function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawFirewall().svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="firewall"]')!;
  return { root, driver: firewallDriver.create(root, drawFirewall().data) };
}

/** The scene at step `step` once its first `played` events have been applied. */
function viewAt(step: number, played: number): SceneView {
  return sceneViewOf(unit, deriveState(firewalls, positionOf(firewalls, 0, 'step', step), played));
}

/** Every event of the lesson, with the scene before and after it. */
function everyEvent(): { event: SceneEvent; before: SceneView; after: SceneView }[] {
  return unit.steps.flatMap((_, i) =>
    stepEvents(firewalls, positionOf(firewalls, 0, 'step', i + 1)).map((event, k) => ({ event, before: viewAt(i + 1, k), after: viewAt(i + 1, k + 1) })),
  );
}

function eventById(id: string): SceneEvent {
  return everyEvent().find((x) => x.event.id === id)!.event;
}
function beforeOf(id: string): SceneView {
  return everyEvent().find((x) => x.event.id === id)!.before;
}

function options(o: Partial<PlayOptions> = {}): PlayOptions {
  return { speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o };
}

const part = (root: SVGSVGElement, id: string): SVGElement => root.querySelector<SVGElement>(`#${id}`)!;
/** The figure as it looks: its markup, with each inline style written the one way the browser reads it. */
function looks(root: SVGSVGElement): string {
  const copy = root.cloneNode(true) as SVGSVGElement;
  for (const el of copy.querySelectorAll<SVGElement>('[style]')) el.setAttribute('style', el.style.cssText);
  return copy.outerHTML;
}
const opacity = (el: SVGElement): string => el.style.opacity;
const has = (root: SVGSVGElement, id: string, cls: string): boolean => part(root, id).classList.contains(cls);
const browStates = (root: SVGSVGElement): string[] =>
  [0, 1, 2].map((i) => ['check', 'miss', 'allow', 'deny'].find((c) => has(root, `fw-brow-${i}`, c)) ?? '');
/** Where a part has been moved to on screen, from its `translate(x y)`. */
function moved(el: SVGElement): [number, number] {
  const m = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(el.getAttribute('transform') ?? '');
  if (m === null) throw new Error(`${el.id} has not been moved`);
  return [Number(m[1]), Number(m[2])];
}

/** Runs the frames of a tween that started at `from` and takes `ms`, then lets the promise chain move on. */
async function runTween(from: number, ms: number): Promise<void> {
  for (let t = from; t < from + ms; t += 50) frameAt(t);
  frameAt(from + ms + 1);
  await vi.advanceTimersByTimeAsync(0);
}

test('DRIVERS has the Firewalls driver', () => {
  expect(DRIVERS.firewall).toBe(firewallDriver);
});

test('duration: each ride takes 600 ms and 9 per unit of its route, each rule read 700, and a table event 0', () => {
  const d = (id: string) => firewallDriver.duration(eventById(id), data);
  // An allowed visit: the ride to the gate, one rule read, the arms, the ride inside, and the rest after it.
  expect(d('visit-website')).toBeCloseTo(ride('visitor') + 700 + 380 + ride('inside') + 500 + 200, 6);
  expect(d('admin-login')).toBeCloseTo(ride('admin') + 2 * 700 + 380 + ride('inside') + 500 + 200, 6);
  // A denied one: the stop mark's 900 ms instead.
  expect(d('visit-login')).toBeCloseTo(ride('visitor') + 3 * 700 + 900 + 500 + 200, 6);
  // A reply: back through the gate, the firewall finds the connection, the arms, and out to the visitor.
  expect(d('reply-website')).toBeCloseTo(ride('inside') + 800 + 300 + ride('visitor') + 500 + 200, 6);
  expect(d('move-catch-all')).toBe(2300);
  for (const id of ['visit-website-conn', 'admin-login-conn', 'move-catch-all-rules', 'move-catch-all-conns']) expect(d(id), id).toBe(0);
});

test('the driver reports marks in reading order; a visit reading 3 rules lasts 1400 ms longer than one reading 1 on the same route', async () => {
  // Telnet and the last website visit both ride the visitor's way and are turned away; one reads 3 rules, one reads 1.
  expect(firewallDriver.duration(eventById('visit-telnet'), data) - firewallDriver.duration(eventById('visit-website-again'), data)).toBeCloseTo(1400, 6);

  const { root, driver } = mount();
  const before = beforeOf('visit-telnet');
  driver.show(before);
  const marks: PanelMark[] = [];
  void driver.play(eventById('visit-telnet'), before, options({ onMark: (m) => marks.push(m) }));
  // Nothing is read while the tag rides to the gate.
  frameAt(0);
  frameAt(700);
  expect(marks).toEqual([]);
  await runTween(700, ride('visitor'));
  // At the gate the first row is read at once, then one row every 700 ms, the board's lamps with it.
  expect(marks).toEqual([{ row: 0, state: 'check' }]);
  expect(browStates(root)).toEqual(['check', '', '']);
  await vi.advanceTimersByTimeAsync(700);
  expect(marks.slice(1)).toEqual([
    { row: 0, state: 'miss' },
    { row: 1, state: 'check' },
  ]);
  expect(browStates(root)).toEqual(['miss', 'check', '']);
  await vi.advanceTimersByTimeAsync(700);
  await vi.advanceTimersByTimeAsync(700);
  expect(marks).toEqual([
    { row: 0, state: 'check' },
    { row: 0, state: 'miss' },
    { row: 1, state: 'check' },
    { row: 1, state: 'miss' },
    { row: 2, state: 'check' },
    { row: 2, state: 'deny' },
  ]);
  expect(browStates(root)).toEqual(['miss', 'miss', 'deny']);
});

test('an allowed visit lifts the arms, lights the bar green, and rides on behind the wall to the server, which lights up', async () => {
  const { root, driver } = mount();
  const before = beforeOf('visit-website');
  driver.show(before);
  let done = false;
  void driver.play(eventById('visit-website'), before, options()).then(() => (done = true));
  const tag = part(root, 'fw-tag-https');
  expect(opacity(tag)).toBe('1');
  // The visitor's callout is current while the tag leaves its laptop.
  expect(has(root, 'fw-call-visitor', 'focus')).toBe(true);
  frameAt(0);
  const start = moved(tag);
  await runTween(0, ride('visitor'));
  const gate = moved(tag);
  // The gate is right of the visitor's laptop on screen, and the tag is still in front of the wall.
  expect(gate[0]).toBeGreaterThan(start[0]);
  expect(tag.parentElement!.id).toBe('fw-layer-front');
  expect(has(root, 'fw-call-firewall', 'focus')).toBe(true);
  // At the gate, rule 1 is being read and the arms are still down.
  expect(browStates(root)).toEqual(['check', '', '']);
  expect([opacity(part(root, 'fw-arms-down')), opacity(part(root, 'fw-arms-up'))]).toEqual(['1', '0']);

  await vi.advanceTimersByTimeAsync(700);
  // Rule 1 fits: the bar lights, the arms go up.
  expect(browStates(root)).toEqual(['allow', '', '']);
  expect(has(root, 'fw-bar', 'allow')).toBe(true);
  expect([opacity(part(root, 'fw-arms-down')), opacity(part(root, 'fw-arms-up'))]).toEqual(['0', '1']);
  await vi.advanceTimersByTimeAsync(380);
  expect(has(root, 'fw-call-server', 'focus')).toBe(true);
  const t0 = 700 + ride('visitor') + 1;
  await runTween(t0, ride('inside'));
  // Behind the wall, it is drawn in the masked layer; on top of the server, the server lights.
  expect(tag.parentElement!.id).toBe('fw-layer-behind');
  expect(moved(tag)[1]).toBeLessThan(gate[1]);
  expect(has(root, 'fw-busy-server', 'on')).toBe(true);
  expect(done).toBe(true);
});

test('a denied visit stays at the gate: the trail turns red and the stop mark pops', async () => {
  const { root, driver } = mount();
  const before = beforeOf('visit-login');
  driver.show(before);
  void driver.play(eventById('visit-login'), before, options());
  frameAt(0);
  await runTween(0, ride('visitor'));
  await vi.advanceTimersByTimeAsync(3 * 700);
  expect(browStates(root)).toEqual(['miss', 'miss', 'deny']);
  expect(has(root, 'fw-bar', 'deny')).toBe(true);
  expect(has(root, 'fw-trail', 'deny')).toBe(true);
  expect(opacity(part(root, 'fw-stop'))).toBe('1');
  expect(has(root, 'fw-stop', 'pop')).toBe(true);
  expect([opacity(part(root, 'fw-arms-down')), opacity(part(root, 'fw-arms-up'))]).toEqual(['1', '0']);
  expect(part(root, 'fw-tag-ssh').parentElement!.id).toBe('fw-layer-front');
});

test('a reply rides back through the gate, opens it without reading a rule, and lights the visitor’s screen', async () => {
  const { root, driver } = mount();
  const before = beforeOf('reply-website');
  driver.show(before);
  const marks: PanelMark[] = [];
  void driver.play(eventById('reply-website'), before, options({ onMark: (m) => marks.push(m) }));
  const tag = part(root, 'fw-tag-reply');
  frameAt(0);
  // It starts on top of the server, behind the wall.
  expect(tag.parentElement!.id).toBe('fw-layer-behind');
  expect(has(root, 'fw-call-server', 'focus')).toBe(true);
  await runTween(0, ride('inside'));
  expect(tag.parentElement!.id).toBe('fw-layer-front');
  expect(has(root, 'fw-call-firewall', 'focus')).toBe(true);
  expect(has(root, 'fw-bar', 'allow')).toBe(false);
  await vi.advanceTimersByTimeAsync(800);
  expect(has(root, 'fw-bar', 'allow')).toBe(true);
  expect(opacity(part(root, 'fw-arms-up'))).toBe('1');
  await vi.advanceTimersByTimeAsync(300);
  const t0 = ride('inside') + 1100 + 1;
  await runTween(t0, ride('visitor'));
  expect(has(root, 'fw-glow-visitor', 'on')).toBe(true);
  expect(marks).toEqual([]);
  expect(browStates(root)).toEqual(['', '', '']);
});

test('a change puts the new order on the board as the rule list changes, then flashes its rows', async () => {
  const { root, driver } = mount();
  const rows = eventById('move-catch-all-rules');
  const start = beforeOf('move-catch-all-rules');
  driver.show(start);
  const board = () => [0, 1, 2].map((i) => part(root, `fw-brow-t-${i}`).textContent);
  expect(board()).toEqual(['1  ALLOW 443  ANY', '2  ALLOW 22   ADMIN', '3  DENY  ALL']);
  // The rule list's own event writes the board.
  await driver.play(rows, start, options());
  expect(board()).toEqual(['1  DENY  ALL', '2  ALLOW 443  ANY', '3  ALLOW 22   ADMIN']);

  const before = beforeOf('move-catch-all');
  driver.show(before);
  let done = false;
  void driver.play(eventById('move-catch-all'), before, options()).then(() => (done = true));
  expect(has(root, 'fw-call-rules', 'focus')).toBe(true);
  expect(browStates(root)).toEqual(['', '', '']);
  await vi.advanceTimersByTimeAsync(300);
  expect(browStates(root)).toEqual(['check', 'check', 'check']);
  await vi.advanceTimersByTimeAsync(1300);
  expect(browStates(root)).toEqual(['', '', '']);
  expect(done).toBe(true);
});

test('show settles at once: the browser takes its styles while data-settling turns the fades off, and the fades come back even when it throws', () => {
  const { root, driver } = mount();
  const flushes: boolean[] = [];
  vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => {
    flushes.push(root.hasAttribute('data-settling'));
    return new DOMRect();
  });
  driver.show(viewAt(1, 2));
  expect(flushes).toEqual([true]);
  expect(root.hasAttribute('data-settling')).toBe(false);

  // A view the figure cannot show throws before it changes anything, and leaves the fades on.
  const shown = looks(root);
  const bad = viewAt(1, 2);
  const visit = bad.landed as Extract<SceneEvent, { type: 'message' }>;
  expect(() => driver.show({ ...bad, landed: { ...visit, tag: 'FTP 21' } })).toThrow(/no tag "FTP 21"/);
  expect(looks(root)).toBe(shown);
  expect(root.hasAttribute('data-settling')).toBe(false);
  expect(() => driver.show({ ...bad, landed: { ...visit, check: { ...visit.check!, read: 4 } } })).toThrow(/3 rows/);
  expect(looks(root)).toBe(shown);
});

test('while it settles, and under reduced motion, the figure’s CSS turns off every fade and animation', () => {
  expect(sceneCss).toMatch(/\.fw\[data-settling\] \*\s*\{\s*transition:\s*none !important;\s*animation:\s*none !important;\s*\}/);
  expect(sceneCss).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.fw \.fw-stop\.pop\s*\{\s*animation:\s*none;/);
  // The lights on the charcoal figure keep their meaning in both themes.
  expect(sceneCss).toMatch(/\.fw\s*\{\s*--fixed-allow:\s*#3ddc7c;\s*--fixed-deny:\s*#ff4f4f;\s*\}/);
  expect(sceneCss).toMatch(/\.fw \.fw-bar\.allow\s*\{\s*fill:\s*var\(--fixed-allow\)/);
  expect(sceneCss).toMatch(/\.fw \.fw-bar\.deny\s*\{\s*fill:\s*var\(--fixed-deny\)/);
  // Marigold means "current": only a callout while the scene is about it.
  expect(sceneCss.match(/var\(--here\)/g)).toHaveLength(1);
  expect(sceneCss).toMatch(/\.fw \.fw-call\.focus \.fw-name\s*\{\s*fill:\s*var\(--here\);\s*\}/);
});

test('under reduced motion, play leaves the figure exactly as show would after each event', async () => {
  for (const { event, before, after } of everyEvent()) {
    const played = mount();
    played.driver.show(before);
    const p = played.driver.play(event, before, options({ reducedMotion: true }));
    // Nothing travels: no frame is ever asked for.
    expect(waiting.size, event.id).toBe(0);
    await vi.runAllTimersAsync();
    await p;
    expect(has(played.root, 'fw-stop', 'pop'), event.id).toBe(false);

    const shown = mount();
    shown.driver.show(after);
    expect(looks(played.root), event.id).toBe(looks(shown.root));
    document.body.innerHTML = '';
  }
});

test('an aborted play stops touching the figure, and show then settles it', async () => {
  const { root, driver } = mount();
  const before = beforeOf('visit-telnet');
  driver.show(before);
  const controller = new AbortController();
  const marks: PanelMark[] = [];
  const p = driver.play(eventById('visit-telnet'), before, options({ signal: controller.signal, onMark: (m) => marks.push(m) }));
  frameAt(0);
  await runTween(0, ride('visitor'));
  await vi.advanceTimersByTimeAsync(300);
  // Aborted while the first rule is read: nothing more is read or drawn.
  controller.abort();
  await p;
  const frozen = looks(root);
  await vi.runAllTimersAsync();
  frameAt(99999);
  expect(looks(root)).toBe(frozen);
  expect(marks).toEqual([{ row: 0, state: 'check' }]);

  driver.show(viewAt(4, 1));
  const fresh = mount();
  fresh.driver.show(viewAt(4, 1));
  expect(looks(root)).toBe(looks(fresh.root));
});

test('a play on a signal that is already aborted touches nothing', async () => {
  for (const { event, before } of everyEvent()) {
    const { root, driver } = mount();
    driver.show(before);
    const shown = looks(root);
    const controller = new AbortController();
    controller.abort();
    const marks: PanelMark[] = [];
    await driver.play(event, before, options({ signal: controller.signal, onMark: (m) => marks.push(m) }));
    await vi.runAllTimersAsync();
    expect(waiting.size, event.id).toBe(0);
    expect(looks(root), event.id).toBe(shown);
    expect(marks, event.id).toEqual([]);
    document.body.innerHTML = '';
  }
});
