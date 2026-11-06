// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawSubnet, type SubnetSceneData } from '../../art/scenes/subnet';
import type { NoteEvent, SceneEvent } from '../../content/schema';
import subnetting from '../../content/lessons/networking/subnetting';
import { formatIPv4, parseIPv4 } from '../../engine/net/ipv4';
import { sameSubnet, subnetInfo } from '../../engine/net/subnet';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { DRIVERS } from './index';
import { subnetDriver } from './subnet';

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

const unit = subnetting.units[0]!;
const data = drawSubnet().data as SubnetSceneData;
// Read from the project root: under jsdom import.meta.url is not a file URL.
const sceneCss: string = readFileSync('src/art/scenes/subnet.css', 'utf8');

/** A fresh copy of the figure on the page, and its driver. */
function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawSubnet().svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="subnet"]')!;
  return { root, driver: subnetDriver.create(root, drawSubnet().data) };
}

/** The scene at step `step` once its first `played` events have been applied. */
function viewAt(step: number, played: number): SceneView {
  return sceneViewOf(unit, deriveState(subnetting, positionOf(subnetting, 0, 'step', step), played));
}

/** Every event of the lesson, with the scene before and after it. */
function everyEvent(): { event: SceneEvent; before: SceneView; after: SceneView }[] {
  return unit.steps.flatMap((_, i) =>
    stepEvents(subnetting, positionOf(subnetting, 0, 'step', i + 1)).map((event, k) => ({
      event,
      before: viewAt(i + 1, k),
      after: viewAt(i + 1, k + 1),
    })),
  );
}

function eventById(id: string): { event: SceneEvent; before: SceneView; after: SceneView } {
  const found = everyEvent().find((x) => x.event.id === id);
  if (found === undefined) throw new Error(`No event ${id}`);
  return found;
}

function options(o: Partial<PlayOptions> = {}): PlayOptions {
  return { speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o };
}

const part = (root: SVGSVGElement, id: string): SVGElement => root.querySelector<SVGElement>(`#${id}`)!;
const lit = (root: SVGSVGElement, id: string): boolean => part(root, id).classList.contains('on');
/** The figure as it looks: its markup, with each inline style written the one way the browser reads it (`opacity:0` and `opacity: 0;` are the same). */
function looks(root: SVGSVGElement): string {
  const copy = root.cloneNode(true) as SVGSVGElement;
  for (const el of copy.querySelectorAll<SVGElement>('[style]')) el.setAttribute('style', el.style.cssText);
  return copy.outerHTML;
}
const opacity = (el: SVGElement): string => el.style.opacity;
/** Where a part has been moved to on screen, from its `translate(x y)`. */
function moved(el: SVGElement): [number, number] {
  const m = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(el.getAttribute('transform') ?? '');
  if (m === null) throw new Error(`${el.id} has not been moved`);
  return [Number(m[1]), Number(m[2])];
}
/** A plate point on screen, from the tag's origin, as the figure's camera puts it. */
function onScreen([x, y, z]: number[]): [number, number] {
  const [ax, bx, cx, ay, by, cy] = data.M as [number, number, number, number, number, number];
  return [ax * x! + bx * y! + cx * z!, ay * x! + by * y! + cy * z!];
}
/** A route's length on the plate, in its own units. */
function lengthOf(route: number[][]): number {
  return route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!, p[2]! - route[i]![2]!), 0);
}
const nets = (root: SVGSVGElement) =>
  ['sales', 'design', 'servers', 'guests'].map((team) => {
    const el = part(root, `sn-net-${team}`);
    return [el.textContent, el.classList.contains('cut')];
  });

test('DRIVERS has the Subnetting driver', () => {
  expect(DRIVERS.subnet).toBe(subnetDriver);
});

test('duration: ring 2000, the local route 700 + 7 × its length + 500, a calc 1800', () => {
  const duration = (id: string) => subnetDriver.duration(eventById(id).event, data);
  expect(duration('broadcast-24')).toBe(2000);
  expect(duration('broadcast-26')).toBe(2000);
  expect(duration('same-subnet')).toBe(700 + 7 * lengthOf(data.routes.local) + 500);
  expect(duration('same-subnet')).toBeCloseTo(1939.49, 2);
  expect(duration('different-subnet')).toBe(700 + 7 * lengthOf(data.routes.remote) + 500);
  expect(duration('usable-30')).toBe(700 + 7 * lengthOf(data.routes.link) + 500);
  expect(duration('mask-24')).toBe(1800);
  expect(duration('address')).toBe(1800);
});

test('show lights one line round the floor, then one round each pad once the floor is cut into /26s', () => {
  const { root, driver } = mount();
  const padlines = () => ['sales', 'design', 'servers', 'guests'].map((team) => lit(root, `sn-padline-${team}`));

  driver.show(viewAt(1, 1));
  expect(lit(root, 'sn-onenet')).toBe(false);
  driver.show(viewAt(1, 2));
  expect(lit(root, 'sn-onenet')).toBe(true);
  expect(padlines()).toEqual([false, false, false, false]);
  expect(nets(root)).toEqual(Array(4).fill(['192.168.1.0/24', false]));

  // Step 4's first event borrows 2 bits: each team's network is a /26 the engine works out from its device's address.
  driver.show(viewAt(4, 1));
  expect(lit(root, 'sn-onenet')).toBe(false);
  expect(padlines()).toEqual([true, true, true, true]);
  expect(nets(root)).toEqual([
    ['192.168.1.0/26', true],
    ['192.168.1.64/26', true],
    ['192.168.1.128/26', true],
    ['192.168.1.192/26', true],
  ]);
  expect(lit(root, 'sn-link')).toBe(false);

  driver.show(viewAt(6, 1));
  expect(lit(root, 'sn-link')).toBe(true);
  expect(padlines()).toEqual([true, true, true, true]);

  // Back to the start: one network again, and no line lit.
  driver.show(viewAt(1, 0));
  expect([lit(root, 'sn-onenet'), lit(root, 'sn-link'), ...padlines()]).toEqual(Array(6).fill(false));
  expect(nets(root)).toEqual(Array(4).fill(['192.168.1.0/24', false]));
});

/**
 * The figure's words are the FIGS port's (checksummed), and the driver keeps
 * its own floor and cut prefixes, so this ties both to the lesson: its
 * addresses, the prefixes its boards play the `one-net`, `cut` and `link` cues
 * at, and the engine's networks for them.
 */
test('the figure’s labels and the driver’s networks are the lesson’s addresses and prefixes, as the engine works them out', () => {
  const notes = unit.steps.flatMap((s) => s.events).filter((e): e is NoteEvent => e.type === 'note');
  const withCue = (cue: string): NoteEvent => notes.find((e) => e.cues?.some((c) => c.cue === cue))!;
  const byId = (id: string): NoteEvent => notes.find((e) => e.id === id)!;
  const ip = (addr: string): number => {
    const parsed = parseIPv4(addr);
    if (!parsed.ok) throw new Error(addr);
    return parsed.value;
  };
  const cidr = (addr: string, prefix: number): string => `${formatIPv4(subnetInfo(ip(addr), prefix).network)}/${prefix}`;
  const floor = withCue('one-net').board!.prefix!;
  const cut = withCue('cut').board!.prefix!;
  const link = withCue('link').board!.prefix!;
  const laptop = byId('address').board!.addr;
  const printer = byId('same-subnet').board!.third!.addr;
  const pc = byId('different-subnet').board!.third!.addr;
  const officeRouter = withCue('link').board!.addr;
  const provider = byId('usable-30').board!.third!.addr;

  const { root, driver } = mount();
  // The callouts name the lesson's devices, and the plate names the lesson's floor, as the scene's title does.
  const addrs = (callout: string) => [...part(root, `sn-call-${callout}`).querySelectorAll('.sn-addr')].map((el) => el.textContent);
  expect(addrs('sales')).toEqual([`Laptop ${laptop}`, `Printer ${printer}`]);
  expect(addrs('design')).toEqual([`PC ${pc}`]);
  expect(addrs('router')).toEqual([`${officeRouter} on the link`]);
  expect(addrs('provider')).toEqual([`${provider} on the link`]);
  expect([...root.querySelectorAll('text')].map((t) => t.textContent)).toContain(`OFFICE · ${cidr(laptop, floor)}`);
  expect(unit.scene.title).toContain(cidr(laptop, floor));
  // The link's two ends are on one subnet at the link's prefix.
  expect(sameSubnet(ip(officeRouter), ip(provider), link)).toBe(true);

  // The driver's networks: each team's device at the floor's prefix, then at the cut's, where pad i holds the floor's i-th subnet.
  const teams = ['sales', 'design', 'servers', 'guests'];
  const device = (team: string): string => /\S+$/.exec(addrs(team)[0] ?? '')![0];
  driver.show(viewAt(1, 2));
  expect(nets(root)).toEqual(teams.map((team) => [cidr(device(team), floor), false]));
  driver.show(viewAt(4, 1));
  expect(nets(root)).toEqual(teams.map((team) => [cidr(device(team), cut), true]));
  const block = subnetInfo(ip(laptop), cut).totalAddresses;
  expect(teams.map((team) => subnetInfo(ip(device(team)), cut).network)).toEqual(
    teams.map((_, i) => subnetInfo(ip(laptop), floor).network + i * block),
  );
});

test('a calc lights its screen and its callout’s name, holds 1100 + 700 ms, then clears', async () => {
  const { root, driver } = mount();
  const { event, before } = eventById('address');
  driver.show(before);
  let done = false;
  void driver.play(event, before, options()).then(() => (done = true));
  expect(lit(root, 'sn-glow-laptop')).toBe(true);
  expect(part(root, 'sn-call-sales').classList.contains('focus')).toBe(true);
  await vi.advanceTimersByTimeAsync(1799);
  expect(done).toBe(false);
  expect(lit(root, 'sn-glow-laptop')).toBe(true);
  await vi.advanceTimersByTimeAsync(1);
  expect(done).toBe(true);
  expect(lit(root, 'sn-glow-laptop')).toBe(false);
  expect(part(root, 'sn-call-sales').classList.contains('focus')).toBe(false);
});

test('a broadcast on the whole floor spreads its ring and lights every screen past 30 %', () => {
  const { root, driver } = mount();
  const { event, before } = eventById('broadcast-24');
  driver.show(before);
  void driver.play(event, before, options({ speed: 2 }));
  const glows = () => [...root.querySelectorAll('.sn-glow')].map((el) => el.classList.contains('on'));
  expect(opacity(part(root, 'sn-ring-all'))).toBe('1');
  // The laptop shouts: its own screen is lit from the start, the others wait for the ring.
  expect(lit(root, 'sn-glow-laptop')).toBe(true);
  expect(lit(root, 'sn-glow-pc')).toBe(false);

  // At 2× the 1500 ms ring takes 750 ms; it eases out to 250 across the floor.
  frameAt(0);
  frameAt(150);
  const r = Number(part(root, 'sn-ring-all-a').getAttribute('r'));
  expect(r).toBeCloseTo(250 * (1 - 0.8 ** 3), 0);
  expect(lit(root, 'sn-glow-pc')).toBe(false);
  frameAt(240);
  expect(glows().every(Boolean)).toBe(true);
  frameAt(750);
  expect(Number(part(root, 'sn-ring-all-a').getAttribute('r'))).toBe(250);
});

test('a broadcast in the Design subnet stops at its pad: only Design’s screens light', () => {
  const { root, driver } = mount();
  const { event, before } = eventById('broadcast-26');
  driver.show(before);
  void driver.play(event, before, options());
  frameAt(0);
  frameAt(1000);
  const glows = [...root.querySelectorAll<SVGElement>('.sn-glow')];
  expect(glows.filter((el) => el.classList.contains('on')).map((el) => el.dataset.pad)).toEqual(
    glows.filter((el) => el.dataset.pad === 'design').map(() => 'design'),
  );
  expect(opacity(part(root, 'sn-ring-design'))).not.toBe('0');
  expect(opacity(part(root, 'sn-ring-all'))).toBe('0');
});

test('a message to another subnet rides its route through the router, which lights as it passes, and lights the PC it reaches', async () => {
  const { root, driver } = mount();
  const { event, before } = eventById('different-subnet');
  driver.show(before);
  const ride = 700 + 7 * lengthOf(data.routes.remote);
  let done = false;
  void driver.play(event, before, options()).then(() => (done = true));
  const tag = part(root, 'sn-tag-remote');
  expect(opacity(tag)).toBe('1');
  expect(opacity(part(root, 'sn-tag-local'))).toBe('0');
  expect([0, 1, 2, 3].every((i) => lit(root, `sn-rled-${i}`))).toBe(true);
  expect(part(root, 'sn-call-router').classList.contains('focus')).toBe(true);

  frameAt(0);
  const start = moved(tag);
  const [sx, sy] = onScreen(data.routes.remote[0]!);
  expect(start[0]).toBeCloseTo(sx, 0);
  expect(start[1]).toBeCloseTo(sy, 0);
  expect(lit(root, 'sn-busy-router')).toBe(false);

  // Find the moment the tag is over the router: the route's highest point.
  let passed = false;
  for (let t = 0; t <= ride; t += ride / 200) {
    frameAt(t);
    passed ||= lit(root, 'sn-busy-router');
  }
  expect(passed).toBe(true);
  frameAt(ride);
  // The play carries on once the ride's promise settles.
  await vi.advanceTimersByTimeAsync(0);
  const end = moved(tag);
  const [ex, ey] = onScreen(data.routes.remote.at(-1)!);
  expect(end[0]).toBeCloseTo(ex, 0);
  expect(end[1]).toBeCloseTo(ey, 0);
  expect(lit(root, 'sn-busy-router')).toBe(false);
  expect(lit(root, 'sn-glow-pc')).toBe(true);
  expect(opacity(part(root, 'sn-trail'))).not.toBe('0');

  // It rests there for 500 ms, then the scene clears.
  await vi.advanceTimersByTimeAsync(499);
  expect(done).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  expect(done).toBe(true);
  expect(opacity(tag)).toBe('0');
  expect(opacity(part(root, 'sn-trail'))).toBe('0');
  expect(lit(root, 'sn-glow-pc')).toBe(false);
  expect([0, 1, 2, 3].some((i) => lit(root, `sn-rled-${i}`))).toBe(false);
});

test('the cut pulses each pad’s line in turn, and reduced motion keeps the lines still', () => {
  const { root, driver } = mount();
  const { event, before } = eventById('subnets-26');
  driver.show(before);
  void driver.play(event, before, options({ speed: 2 }));
  const padlines = ['sales', 'design', 'servers', 'guests'].map((team) => part(root, `sn-padline-${team}`));
  expect(padlines.map((el) => el.classList.contains('pulse'))).toEqual([true, true, true, true]);
  expect(padlines.map((el) => el.style.animationDelay)).toEqual(['0ms', '130ms', '260ms', '390ms']);

  const still = mount();
  still.driver.show(before);
  void still.driver.play(event, before, options({ reducedMotion: true }));
  expect(still.root.querySelectorAll('.pulse')).toHaveLength(0);
});

test('show settles at once: the browser takes its styles while the figure’s fades are off', () => {
  const { root, driver } = mount();
  const { event, before, after } = eventById('broadcast-24');
  driver.show(before);
  void driver.play(event, before, options());
  frameAt(0);
  frameAt(1000);
  expect(lit(root, 'sn-glow-pc')).toBe(true);

  // Reading the figure's box makes the browser take the new styles there and then.
  const flushes: { settling: boolean; unlit: boolean }[] = [];
  vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => {
    flushes.push({ settling: root.hasAttribute('data-settling'), unlit: root.querySelectorAll('.sn-glow.on').length === 0 });
    return new DOMRect();
  });
  driver.show(after);
  expect(flushes).toEqual([{ settling: true, unlit: true }]);
  // After that the fades are back on, for the next play.
  expect(root.hasAttribute('data-settling')).toBe(false);
});

test('while it settles, the figure’s CSS turns off its fades', () => {
  expect(sceneCss).toMatch(/\.sn\[data-settling\] \*\s*\{\s*transition:\s*none !important;?\s*\}/);
});

test('under reduced motion, play leaves the figure exactly as show would after each event', async () => {
  const events = everyEvent();
  expect(events).toHaveLength(17);
  for (const { event, before, after } of events) {
    const played = mount();
    played.driver.show(before);
    const p = played.driver.play(event, before, options({ reducedMotion: true }));
    // Nothing travels: no frame is ever asked for.
    expect(waiting.size).toBe(0);
    await vi.runAllTimersAsync();
    await p;

    const shown = mount();
    shown.driver.show(after);
    expect(looks(played.root), event.id).toBe(looks(shown.root));
    document.body.innerHTML = '';
  }
});

test('under reduced motion a broadcast still shows its ring, still, while it plays', () => {
  const { root, driver } = mount();
  const { event, before } = eventById('broadcast-26');
  driver.show(before);
  void driver.play(event, before, options({ reducedMotion: true }));
  expect(waiting.size).toBe(0);
  expect(Number(part(root, 'sn-ring-design-a').getAttribute('r'))).toBeGreaterThan(1);
  expect(opacity(part(root, 'sn-ring-design'))).not.toBe('0');
  expect(lit(root, 'sn-glow-pc')).toBe(true);
});

test('an aborted play stops touching the figure, and show then settles it', async () => {
  const { root, driver } = mount();
  const { event, before, after } = eventById('different-subnet');
  driver.show(before);
  const controller = new AbortController();
  const p = driver.play(event, before, options({ signal: controller.signal }));
  frameAt(0);
  frameAt(900);
  controller.abort();
  await p;
  const frozen = looks(root);
  frameAt(1500);
  await vi.runAllTimersAsync();
  expect(looks(root)).toBe(frozen);

  driver.show(after);
  const fresh = mount();
  fresh.driver.show(after);
  expect(looks(root)).toBe(looks(fresh.root));
});
