// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawDhcp } from '../../art/scenes/dhcp';
import type { SceneEvent } from '../../content/schema';
import dhcp from '../../content/lessons/networking/dhcp';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { dhcpDriver } from './dhcp';
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

const unit = dhcp.units[0]!;
// Read from the project root: under jsdom import.meta.url is not a file URL.
const sceneCss: string = readFileSync('src/art/scenes/dhcp.css', 'utf8');

/** A fresh copy of the figure on the page, and its driver. */
function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawDhcp().svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="dhcp"]')!;
  return { root, driver: dhcpDriver.create(root, drawDhcp().data) };
}

/** The scene at step `step` once its first `played` events have been applied. */
function viewAt(step: number, played: number): SceneView {
  return sceneViewOf(unit, deriveState(dhcp, positionOf(dhcp, 0, 'step', step), played));
}

/** Every event of the lesson, with the scene before and after it. */
function everyEvent(): { event: SceneEvent; before: SceneView; after: SceneView }[] {
  return unit.steps.flatMap((_, i) =>
    stepEvents(dhcp, positionOf(dhcp, 0, 'step', i + 1)).map((event, k) => ({
      event,
      before: viewAt(i + 1, k),
      after: viewAt(i + 1, k + 1),
    })),
  );
}

function eventById(id: string): SceneEvent {
  return everyEvent().find((x) => x.event.id === id)!.event;
}

function options(o: Partial<PlayOptions> = {}): PlayOptions {
  return { speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o };
}

const part = (root: SVGSVGElement, id: string): SVGElement => root.querySelector<SVGElement>(`#${id}`)!;
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

test('DRIVERS has the DHCP driver', () => {
  expect(DRIVERS.dhcp).toBe(dhcpDriver);
});

test('duration: 1850 for a message, 0 for a table event', () => {
  const { data } = drawDhcp();
  expect(dhcpDriver.duration(eventById('msg-offer'), data)).toBe(1850);
  expect(dhcpDriver.duration(eventById('msg-renew-request'), data)).toBe(1850);
  expect(dhcpDriver.duration(eventById('lease-add'), data)).toBe(0);
  expect(dhcpDriver.duration(eventById('lease-renew'), data)).toBe(0);
});

test('the driver moves the Offer tag from the router toward the laptop and leaves it hidden when done', async () => {
  const { root, driver } = mount();
  const before = viewAt(2, 0);
  driver.show(before);
  const tag = part(root, 'dh-tag-offer');
  expect(opacity(tag)).toBe('0');

  let done = false;
  void driver.play(eventById('msg-offer'), before, options()).then(() => (done = true));
  expect(opacity(tag)).toBe('1');
  // A reply: the router's lights come on, and the laptop's screen stays dark.
  expect(part(root, 'dh-led-1').classList.contains('on')).toBe(true);
  expect(part(root, 'dh-lap-glow').classList.contains('on')).toBe(false);

  frameAt(0);
  const [atRouter] = moved(tag);
  frameAt(650);
  const [halfway] = moved(tag);
  frameAt(1300);
  const [atLaptop] = moved(tag);
  // The laptop stands to the left of the router on screen.
  expect(atLaptop).toBeLessThan(halfway);
  expect(halfway).toBeLessThan(atRouter);
  expect(opacity(tag)).toBe('1');

  // It rests at the laptop for 350 ms, then the scene clears.
  await vi.advanceTimersByTimeAsync(349);
  expect(opacity(tag)).toBe('1');
  await vi.advanceTimersByTimeAsync(1);
  expect(done).toBe(true);
  expect(opacity(tag)).toBe('0');
  expect(part(root, 'dh-led-1').classList.contains('on')).toBe(false);
});

test('a broadcast spreads the ring and lights the phone and its note only past 55 %', async () => {
  const { root, driver } = mount();
  const before = viewAt(1, 0);
  driver.show(before);
  void driver.play(eventById('msg-discover'), before, options({ speed: 2 }));
  const ignore = part(root, 'dh-ignore');
  expect(part(root, 'dh-lap-glow').classList.contains('on')).toBe(true);

  // At 2× the 1300 ms ride takes 650 ms.
  frameAt(0);
  frameAt(325);
  expect(Number(part(root, 'dh-ring').getAttribute('r'))).toBe(115);
  expect(ignore.classList.contains('on')).toBe(false);
  expect(part(root, 'dh-ph-glow').classList.contains('on')).toBe(false);
  frameAt(390);
  expect(ignore.classList.contains('on')).toBe(true);
  expect(part(root, 'dh-ph-glow').classList.contains('on')).toBe(true);
});

test('show paints the lease table on the board, the laptop’s screen and its callout', () => {
  const { root, driver } = mount();
  driver.show(viewAt(4, 1));
  expect(opacity(part(root, 'dh-lease-row'))).toBe('0');
  expect(opacity(part(root, 'dh-lap-noip'))).toBe('1');
  expect(part(root, 'dh-laptop-ip').textContent).toBe('No IP address yet');
  expect(part(root, 'dh-laptop-ip').getAttribute('class')).toBe('dh-addr none');

  driver.show(viewAt(4, 2));
  expect(opacity(part(root, 'dh-lease-row'))).toBe('1');
  expect(part(root, 'dh-lease-row').textContent).toBe('.100  LAPTOP');
  expect(opacity(part(root, 'dh-lap-noip'))).toBe('0');
  expect(opacity(part(root, 'dh-lap-ip'))).toBe('1');
  expect(part(root, 'dh-lap-ip').textContent).toBe('192.168.1.100');
  expect(part(root, 'dh-laptop-ip').textContent).toBe('192.168.1.100');
  expect(part(root, 'dh-laptop-ip').getAttribute('class')).toBe('dh-addr new');

  // Back to the start: the laptop has no address again.
  driver.show(viewAt(1, 0));
  expect(opacity(part(root, 'dh-lease-row'))).toBe('0');
  expect(part(root, 'dh-laptop-ip').textContent).toBe('No IP address yet');
});

test('show settles at once: the browser takes its styles while the figure’s fades are off', () => {
  const { root, driver } = mount();
  const before = viewAt(1, 0);
  driver.show(before);
  // A broadcast past 55 %: the laptop's screen, the phone and its note are lit, and would fade out.
  void driver.play(eventById('msg-discover'), before, options({ signal: new AbortController().signal }));
  frameAt(0);
  frameAt(1000);
  const lit = ['dh-lap-glow', 'dh-ph-glow', 'dh-ignore'].map((id) => part(root, id));
  expect(lit.every((el) => el.classList.contains('on'))).toBe(true);

  // Reading the figure's box makes the browser take the new styles there and then.
  const flushes: { settling: boolean; unlit: boolean }[] = [];
  vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => {
    flushes.push({ settling: root.hasAttribute('data-settling'), unlit: lit.every((el) => !el.classList.contains('on')) });
    return new DOMRect();
  });
  driver.show(viewAt(1, 1));
  expect(flushes).toEqual([{ settling: true, unlit: true }]);
  // After that the fades are back on, for the next play.
  expect(root.hasAttribute('data-settling')).toBe(false);

  // A play leaves the fades on: nothing settles while the laptop shouts.
  flushes.length = 0;
  void driver.play(eventById('msg-discover'), before, options());
  expect(flushes).toEqual([]);
  expect(root.hasAttribute('data-settling')).toBe(false);
});

test('while it settles, the figure’s CSS turns off the fades of its glows and its note', () => {
  const rule = /\.dh\[data-settling\] \.dh-glow,\s*\.dh\[data-settling\] \.dh-ignore\s*\{\s*transition:\s*none;?\s*\}/;
  expect(sceneCss).toMatch(rule);
});

test('under reduced motion, play leaves the figure exactly as show would after each event', async () => {
  for (const { event, before, after } of everyEvent()) {
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

test('an aborted play stops touching the figure, and show then settles it', async () => {
  const { root, driver } = mount();
  const before = viewAt(3, 0);
  driver.show(before);
  const controller = new AbortController();
  const p = driver.play(eventById('msg-request'), before, options({ signal: controller.signal }));
  frameAt(0);
  frameAt(500);
  controller.abort();
  await p;
  const frozen = looks(root);
  frameAt(900);
  await vi.runAllTimersAsync();
  expect(looks(root)).toBe(frozen);

  driver.show(viewAt(3, 1));
  const fresh = mount();
  fresh.driver.show(viewAt(3, 1));
  expect(looks(root)).toBe(looks(fresh.root));
});
