// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawOsi, type OsiSceneData } from '../../art/scenes/osi';
import type { MessageEvent, NoteEvent, SceneEvent } from '../../content/schema';
import type { AppliedCue } from '../../engine/timeline';
import type { PlayOptions, SceneDriver, SceneView } from '../driver';
import { DRIVERS } from './index';
import { LAND_MS, LIGHT_MS, osiDriver, RIDE_MS } from './osi';

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

const drawn = drawOsi();
const data = drawn.data as OsiSceneData;

/** A fresh copy of the figure on the page, and its driver. */
function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawn.svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="osi"]')!;
  return { root, driver: osiDriver.create(root, data) };
}

/** A scene view built by hand: what has played (`cues`), what has just landed, and the unit's words. */
function viewOf(o: { cues?: AppliedCue[]; landed?: MessageEvent | NoteEvent | null; labels?: Record<string, string> } = {}): SceneView {
  const landed = o.landed ?? null;
  return { unit: 0, layers: [], labels: o.labels ?? {}, start: [], status: null, cues: o.cues ?? [], tables: {}, board: null, active: landed, landed };
}

/** A cue as the scene view lists it once its event has played: in the current step, or in an earlier one. */
const applied = (cue: string, arg: string, current = true): AppliedCue => ({ cue, arg, eventId: `${cue}-${arg}`, current });

function note(cue: string, arg: string): NoteEvent {
  return { type: 'note', id: `${cue}-${arg}`, log: {}, plain: 'A layer does its job.', cues: [{ cue, arg }] };
}

function message(from: string, to: string): MessageEvent {
  return { type: 'message', id: `${from}-${to}`, from, to, tag: '0101', kind: 'request', log: {}, plain: 'The bits ride the cable.' };
}

function options(o: Partial<PlayOptions> = {}): PlayOptions {
  return { speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o };
}

const ids = (root: SVGSVGElement, selector: string): string[] => [...root.querySelectorAll(selector)].map((el) => el.id);
const tagOf = (root: SVGSVGElement): SVGElement => root.querySelector<SVGElement>('#osi-tag')!;

/** Where a part has been moved to, from its `translate(x y)`. */
function moved(el: SVGElement): [number, number] {
  const m = /^translate\((-?[\d.]+) (-?[\d.]+)\)$/.exec(el.getAttribute('transform') ?? '');
  if (m === null) throw new Error(`${el.id} has not been moved`);
  return [Number(m[1]), Number(m[2])];
}

/** A point of the plate on screen, from the figure's camera (`M`) and origin (`O`). */
function screenOf([x, y, z]: number[]): [number, number] {
  const [ax, bx, cx, ay, by, cy] = data.M as [number, number, number, number, number, number];
  return [data.O[0] + ax * x! + bx * y! + cx * z!, data.O[1] + ay * x! + by * y! + cy * z!];
}

/** Where the tag sits on screen: it is drawn at the plate's origin and moved from there. */
function tagAt(root: SVGSVGElement): [number, number] {
  const [dx, dy] = moved(tagOf(root));
  return [data.O[0] + dx, data.O[1] + dy];
}

function expectNear([x, y]: [number, number], [wx, wy]: [number, number]): void {
  expect(x).toBeCloseTo(wx, 1);
  expect(y).toBeCloseTo(wy, 1);
}

test('DRIVERS has the OSI driver', () => {
  expect(DRIVERS.osi).toBe(osiDriver);
});

test('show writes every word into its slots', () => {
  const { root, driver } = mount();
  driver.show(viewOf({ labels: { 'layer-1': 'PHYSICAL', plate: 'OSI' } }));
  const slots = (key: string) => [...root.querySelectorAll(`[data-label="${key}"]`)].map((el) => el.textContent);
  expect(slots('layer-1')).toEqual(['PHYSICAL', 'PHYSICAL', 'PHYSICAL']);
  expect(slots('plate')).toEqual(['OSI']);
  expect(slots('layer-7')).toEqual(['', '']);
  // A word the next view does not give is taken off again.
  driver.show(viewOf({ labels: { plate: 'OSI' } }));
  expect(slots('layer-1')).toEqual(['', '', '']);
});

test('a layer cue lights its one block and puts its machine in focus', () => {
  const { root, driver } = mount();
  driver.show(viewOf({ cues: [applied('layer', 'laptop:4')], landed: note('layer', 'laptop:4') }));
  expect(ids(root, '.osi-L.on')).toEqual(['osi-L-laptop-4']);
  expect(root.querySelectorAll('.osi-L [data-lit]')).toHaveLength(1);
  expect(root.querySelector('#osi-L-laptop-4 > .iso-solid')!.getAttribute('data-lit')).toBe('');
  expect(ids(root, '.osi-call.focus')).toEqual(['osi-call-laptop']);
  expect(ids(root, '.osi-peers.on')).toEqual([]);
  expect(tagOf(root).style.opacity).toBe('0');
});

test('show clears what an earlier view lit', () => {
  const { root, driver } = mount();
  driver.show(viewOf({ cues: [applied('peer', '2')], landed: note('peer', '2') }));
  driver.show(viewOf({ landed: message('laptop', 'router') }));
  driver.show(viewOf());
  expect(root.querySelectorAll('.on')).toHaveLength(0);
  expect(root.querySelectorAll('.osi-L [data-lit]')).toHaveLength(0);
  expect(root.querySelectorAll('.focus')).toHaveLength(0);
  expect(tagOf(root).style.opacity).toBe('0');
  expect(tagOf(root).hasAttribute('transform')).toBe(false);
});

test('peer cues light the twins and keep the step’s lines', () => {
  const { root, driver } = mount();
  const cues = ['7', '6', '2'].map((n) => applied('peer', n));
  driver.show(viewOf({ cues, landed: note('peer', '2') }));
  expect(ids(root, '.osi-L.on')).toEqual(['osi-L-laptop-2', 'osi-L-router-2', 'osi-L-server-2']);
  expect(root.querySelectorAll('.osi-L [data-lit]')).toHaveLength(3);
  // In the figure's order, lowest layer first.
  expect(ids(root, '.osi-peers.on')).toEqual(['osi-peer-2', 'osi-peer-6', 'osi-peer-7']);
  // Layer 7's twins are the laptop's and the server's: the router has no layer 7.
  driver.show(viewOf({ cues: cues.slice(0, 1), landed: note('peer', '7') }));
  expect(ids(root, '.osi-L.on')).toEqual(['osi-L-laptop-7', 'osi-L-server-7']);
  // At Learn every step has played, none of it current: no lines, nothing lit.
  driver.show(viewOf({ cues: cues.map((c) => ({ ...c, current: false })) }));
  expect(ids(root, '.osi-peers.on')).toEqual([]);
  expect(ids(root, '.osi-L.on')).toEqual([]);
});

test('a landed message parks the tag at the end of its cable', () => {
  const { root, driver } = mount();
  driver.show(viewOf({ cues: [applied('layer', 'router:1', false)], landed: message('router', 'server') }));
  expect(tagOf(root).style.opacity).toBe('1');
  expectNear(tagAt(root), screenOf(data.routes['router>server'][1]));
  expect(ids(root, '.osi-L.on')).toEqual([]);
  expect(root.querySelectorAll('.osi-L [data-lit]')).toHaveLength(0);
  expect(ids(root, '.osi-call.focus')).toEqual([]);
});

test('a cue or a ride the figure cannot show throws before the figure changes', () => {
  const { root, driver } = mount();
  driver.show(viewOf({ cues: [applied('layer', 'laptop:4')], landed: note('layer', 'laptop:4') }));
  const shown = root.outerHTML;
  expect(() => driver.show(viewOf({ landed: note('layer', 'router:4') }))).toThrow(/router:4/);
  expect(() => driver.show(viewOf({ cues: [applied('peer', '8')], landed: note('peer', '8') }))).toThrow(/"8"/);
  expect(() => driver.show(viewOf({ landed: message('laptop', 'server') }))).toThrow(/laptop>server/);
  expect(root.outerHTML).toBe(shown);
  expect(root.hasAttribute('data-settling')).toBe(false);
});

test('show settles at once: the browser takes its styles while data-settling turns the fades off', () => {
  const { root, driver } = mount();
  const flushes: boolean[] = [];
  vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => {
    flushes.push(root.hasAttribute('data-settling'));
    return new DOMRect();
  });
  driver.show(viewOf({ cues: [applied('peer', '4')], landed: note('peer', '4') }));
  expect(flushes).toEqual([true]);
  expect(root.hasAttribute('data-settling')).toBe(false);
});

test('a note’s play shows its end state at once, the step’s lines kept', async () => {
  const { root, driver } = mount();
  const before = viewOf({ cues: [applied('peer', '7')], landed: note('peer', '7') });
  driver.show(before);
  await driver.play(note('peer', '6'), before, options());
  expect(waiting.size).toBe(0);
  expect(ids(root, '.osi-L.on')).toEqual(['osi-L-laptop-6', 'osi-L-server-6']);
  expect(ids(root, '.osi-peers.on')).toEqual(['osi-peer-6', 'osi-peer-7']);

  const shown = mount();
  shown.driver.show(viewOf({ cues: [applied('peer', '7'), applied('peer', '6')], landed: note('peer', '6') }));
  expect(root.outerHTML).toBe(shown.root.outerHTML);
});

test('a message rides the cable from its start to its end in RIDE_MS at 1×, divided by the speed', async () => {
  const { root, driver } = mount();
  const before = viewOf({ cues: [applied('layer', 'laptop:1')], landed: note('layer', 'laptop:1') });
  driver.show(before);
  let done = false;
  void driver.play(message('laptop', 'router'), before, options({ speed: 2 })).then(() => (done = true));
  const [start, end] = data.routes['laptop>router'];
  // It sets off at once, from the start of the cable, and the light the laptop's layer 1 had goes off.
  expect(tagOf(root).style.opacity).toBe('1');
  expectNear(tagAt(root), screenOf(start));
  expect(ids(root, '.osi-L.on')).toEqual([]);
  expect(ids(root, '.osi-call.focus')).toEqual([]);
  frameAt(0);
  frameAt(RIDE_MS / 4);
  expectNear(tagAt(root), screenOf(start.map((v, i) => (v + end[i]!) / 2)));
  expect(done).toBe(false);
  frameAt(RIDE_MS / 2);
  await vi.advanceTimersByTimeAsync(0);
  expectNear(tagAt(root), screenOf(end));
  expect(done).toBe(true);
});

test('reduced motion puts the tag at the end at once', async () => {
  const { root, driver } = mount();
  const before = viewOf({ cues: [applied('layer', 'router:1')], landed: note('layer', 'router:1') });
  driver.show(before);
  await driver.play(message('router', 'server'), before, options({ reducedMotion: true }));
  // Nothing travels: no frame is ever asked for.
  expect(waiting.size).toBe(0);
  expect(tagOf(root).style.opacity).toBe('1');
  expectNear(tagAt(root), screenOf(data.routes['router>server'][1]));

  const shown = mount();
  shown.driver.show(viewOf({ cues: before.cues, landed: message('router', 'server') }));
  expect(root.outerHTML).toBe(shown.root.outerHTML);
});

test('an aborted play resolves and leaves the figure alone', async () => {
  const { root, driver } = mount();
  const before = viewOf({ cues: [applied('layer', 'laptop:1')], landed: note('layer', 'laptop:1') });
  driver.show(before);
  const controller = new AbortController();
  const p = driver.play(message('laptop', 'router'), before, options({ signal: controller.signal }));
  frameAt(0);
  frameAt(RIDE_MS / 3);
  controller.abort();
  await p;
  const frozen = root.outerHTML;
  await vi.runAllTimersAsync();
  frameAt(99999);
  expect(waiting.size).toBe(0);
  expect(root.outerHTML).toBe(frozen);

  // A play on a signal that is already aborted touches nothing, a note's or a message's.
  for (const event of [note('layer', 'laptop:2'), message('laptop', 'router')] satisfies SceneEvent[]) {
    driver.show(before);
    const shown = root.outerHTML;
    await driver.play(event, before, options({ signal: controller.signal }));
    expect(waiting.size, event.id).toBe(0);
    expect(root.outerHTML, event.id).toBe(shown);
  }
});

test('duration: a ride and its rest, 1800 ms; a layer’s turn, 1100 ms', () => {
  expect([LIGHT_MS, RIDE_MS, LAND_MS]).toEqual([1100, 1300, 500]);
  expect(osiDriver.duration(message('laptop', 'router'), data)).toBe(1800);
  expect(osiDriver.duration(note('layer', 'laptop:7'), data)).toBe(1100);
  expect(osiDriver.duration(note('peer', '3'), data)).toBe(1100);
});
