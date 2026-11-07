// The Networking cover's packets, run against NetworkingCover.astro's own markup. The component is rendered with
// Astro's container (which needs this file's default node environment) and parsed with jsdom; the browser APIs the
// cover uses are stand-ins the test drives: a fake IntersectionObserver, animation frames on Vitest's fake clock, and
// matchMedia.
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import NetworkingCover from '../components/NetworkingCover.astro';
import { FakeObserver, view } from '../test/fake-io';
import { startRouterCover } from './router-cover';

// One packet takes 1.8 s along the cable and the next leaves 0.5 s later, so three are in by about 2.8 s.
const TRIP_MS = 1800;
const ALL_IN_MS = 2 * 500 + TRIP_MS + 200;
// The router's lights flash for 0.45 s after the last one comes in.
const SETTLED_MS = ALL_IN_MS + 500;

let html = '';
let doc: Document;
let root: HTMLElement;
let reduced = false;

beforeAll(async () => {
  html = await (await AstroContainer.create()).renderToString(NetworkingCover, { props: { label: 'Track 1' } });
});

beforeEach(() => {
  doc = new JSDOM(html).window.document;
  root = doc.querySelector<HTMLElement>('[data-router-cover]')!;
  reduced = false;
  FakeObserver.all = [];
  vi.useFakeTimers();
  // One animation frame every 16 ms of the fake clock, stamped with its time.
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16));
  vi.stubGlobal('cancelAnimationFrame', (id: ReturnType<typeof setTimeout>) => clearTimeout(id));
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduced && query === '(prefers-reduced-motion: reduce)', media: query }));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const $ = (selector: string): HTMLElement => root.querySelector<HTMLElement>(selector)!;
const stage = (): HTMLElement => $('[data-stage]');
const readout = (): string => $('[data-readout]').textContent ?? '';
const packets = (): SVGElement[] => [...root.querySelectorAll<SVGElement>('.lm-pkt')];
const lights = (): boolean[] => [...root.querySelectorAll('[data-part="rleds"] .lm-led')].map((l) => l.classList.contains('on'));
const click = (): void => void stage().dispatchEvent(new doc.defaultView!.MouseEvent('click', { bubbles: true }));
function press(key: string): KeyboardEvent {
  const event = new doc.defaultView!.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  stage().dispatchEvent(event);
  return event;
}

/** Everything the cover shows at a moment, so two moments can be compared. */
function frame(): string {
  return JSON.stringify({
    readout: readout(),
    packets: packets().map((p) => [p.getAttribute('transform'), p.getAttribute('style')]),
    lights: lights(),
  });
}

test('the markup: the live cover in its plate, with the corners, and no button or count until the script starts', () => {
  expect(root.querySelector('svg.lm-router')).not.toBeNull();
  expect(packets()).toHaveLength(3);
  expect(lights()).toHaveLength(5);
  expect($('.c-fig').textContent).toBe('Track 1');
  expect($('.c-title').textContent).toBe('Networking');
  // Without the script the figure is only a figure.
  expect(stage().hasAttribute('role')).toBe(false);
  expect(stage().hasAttribute('tabindex')).toBe(false);
  expect(stage().hasAttribute('aria-describedby')).toBe(false);
  expect($('[data-hint]').hidden).toBe(true);
  expect($('[data-readout]').hidden).toBe(true);
  expect($('[data-readout]').getAttribute('aria-live')).toBe('polite');
});

test('starting makes the figure a button that says what it does, and shows the hint and the count', () => {
  startRouterCover(root);
  expect(stage().getAttribute('role')).toBe('button');
  expect(stage().getAttribute('tabindex')).toBe('0');
  expect(stage().getAttribute('aria-label')).toBe('Click to send packets');
  // A button's contents are not read out, so the figure's own description is kept as the button's description.
  const description = doc.getElementById(stage().getAttribute('aria-describedby')!)!;
  expect(description.textContent).toBe(root.querySelector('svg.lm-router')!.getAttribute('aria-label'));
  expect(description.textContent).toMatch(/^A home router on a plate/);
  expect(description.hidden).toBe(true);
  expect($('[data-hint]').hidden).toBe(false);
  expect($('[data-hint]').textContent).toBe('Click to send packets');
  expect($('[data-readout]').hidden).toBe(false);
  expect(readout()).toBe('0 packets received');
  // Nothing runs until something is sent.
  expect(FakeObserver.all).toHaveLength(1);
  expect(FakeObserver.all[0]!.targets).toEqual([root]);
  view();
  expect(vi.getTimerCount()).toBe(0);
});

test('a click sends three packets along the cable, each counted as it reaches the router, then all is still', () => {
  startRouterCover(root);
  view();
  const before = packets().map((p) => p.getAttribute('transform'));
  click();
  vi.advanceTimersByTime(600);
  // The first is on its way, and the second has just left.
  const moving = packets().filter((p) => p.getAttribute('transform') !== null);
  expect(moving).toHaveLength(2);
  expect(Number(moving[0]!.style.opacity)).toBeGreaterThan(0);
  expect(packets().map((p) => p.getAttribute('transform'))).not.toEqual(before);
  expect(readout()).toBe('0 packets received');

  vi.advanceTimersByTime(TRIP_MS - 600 + 100);
  expect(readout()).toBe('1 packet received');
  // The router's lights flash as a packet comes in.
  expect(lights().filter(Boolean).length).toBeGreaterThan(1);
  vi.advanceTimersByTime(500);
  expect(readout()).toBe('2 packets received');
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('3 packets received');

  // Every packet has gone in, the lights settle with only the first on, and nothing is left running.
  expect(packets().every((p) => p.style.opacity === '0')).toBe(true);
  expect(lights()).toEqual([true, false, false, false, false]);
  expect(vi.getTimerCount()).toBe(0);
  const still = frame();
  vi.advanceTimersByTime(10000);
  expect(frame()).toBe(still);
});

test('the readout is a polite live region, and each click adds three more', () => {
  startRouterCover(root);
  view();
  click();
  click();
  vi.advanceTimersByTime(6 * 500 + TRIP_MS + 500);
  expect(readout()).toBe('6 packets received');
  expect($('[data-readout]').getAttribute('aria-live')).toBe('polite');
});

test('Enter sends packets, and Space sends them without scrolling the page', () => {
  startRouterCover(root);
  view();
  const enter = press('Enter');
  expect(enter.defaultPrevented).toBe(true);
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('3 packets received');

  const space = press(' ');
  expect(space.defaultPrevented).toBe(true);
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('6 packets received');

  // Other keys are left alone.
  const tab = press('Tab');
  expect(tab.defaultPrevented).toBe(false);
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('6 packets received');
  expect(vi.getTimerCount()).toBe(0);
});

test('under reduced motion the packets arrive at once and never move', () => {
  reduced = true;
  startRouterCover(root);
  view();
  click();
  vi.advanceTimersByTime(20);
  expect(readout()).toBe('3 packets received');
  expect(packets().every((p) => p.getAttribute('transform') === null && p.style.opacity === '0')).toBe(true);
  // The router's lights still flash once, briefly, then everything stops.
  expect(lights().filter(Boolean).length).toBeGreaterThan(1);
  vi.advanceTimersByTime(1000);
  expect(lights()).toEqual([true, false, false, false, false]);
  expect(vi.getTimerCount()).toBe(0);
});

test('out of view it waits, and goes on when it is seen again', () => {
  startRouterCover(root);
  view();
  click();
  vi.advanceTimersByTime(400);
  view(false);
  // The current frame finishes, then nothing more runs.
  vi.advanceTimersByTime(20);
  const held = frame();
  vi.advanceTimersByTime(5000);
  expect(frame()).toBe(held);
  expect(vi.getTimerCount()).toBe(0);

  view(true);
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('3 packets received');
});

test('sent before it is first seen, the packets leave once it is', () => {
  startRouterCover(root);
  click();
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('0 packets received');
  expect(vi.getTimerCount()).toBe(0);
  view();
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('3 packets received');
});

test('a browser with no IntersectionObserver sends them at once', () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  startRouterCover(root);
  click();
  vi.advanceTimersByTime(ALL_IN_MS);
  expect(readout()).toBe('3 packets received');
  vi.advanceTimersByTime(SETTLED_MS - ALL_IN_MS);
  expect(vi.getTimerCount()).toBe(0);
});

test('once torn down it stops at once, lets go of the observer, and touches nothing more', () => {
  const cover = startRouterCover(root);
  view();
  click();
  vi.advanceTimersByTime(700);
  cover.destroy();
  expect(vi.getTimerCount()).toBe(0);
  expect(FakeObserver.all[0]!.connected).toBe(false);

  const left = frame();
  click();
  press('Enter');
  cover.send();
  view(true, { late: true });
  vi.advanceTimersByTime(10000);
  expect(frame()).toBe(left);
  expect(vi.getTimerCount()).toBe(0);
});

test('a cover taken off the page stops on its next frame and leaves no timer behind', () => {
  startRouterCover(root);
  view();
  click();
  vi.advanceTimersByTime(700);
  const left = frame();
  root.remove();
  vi.advanceTimersByTime(10000);
  expect(frame()).toBe(left);
  expect(vi.getTimerCount()).toBe(0);
  expect(FakeObserver.all[0]!.connected).toBe(false);
});

test('a cover with no path says so by name, and is left as a plain figure', () => {
  delete root.dataset.routerCover;
  expect(() => startRouterCover(root)).toThrow('The router cover has no data-router-cover path.');
  expect(stage().hasAttribute('role')).toBe(false);
});

test('a cover with no packets says so by name, and is left as a plain figure', () => {
  for (const p of packets()) p.remove();
  expect(() => startRouterCover(root)).toThrow('The router cover has no .lm-pkt.');
  expect(stage().hasAttribute('role')).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});
