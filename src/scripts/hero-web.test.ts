// The home hero's movement, run against HeroWeb.astro's own markup. The component is rendered with Astro's container
// (which needs this file's default node environment) and parsed with jsdom; the browser APIs the hero uses are stand-ins
// the test drives: a fake IntersectionObserver, animation frames on Vitest's fake clock, and matchMedia.
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { HERO_WEB } from '../art/figures/hero-web';
import HeroWeb from '../components/HeroWeb.astro';
import { FakeObserver, view } from '../test/fake-io';
import { startHero } from './hero-web';

const { T, STEPS } = HERO_WEB;
const FIRST = STEPS[0]!;
const LAST = STEPS.at(-1)!;

/** Tells each connected observer that its targets came into view; `late`: the disconnected ones too. */
const enter = ({ late = false } = {}) => view(true, { late });

let html = '';
let root: HTMLElement;
let reduced = false;

beforeAll(async () => {
  html = await (await AstroContainer.create()).renderToString(HeroWeb);
});

beforeEach(() => {
  root = new JSDOM(html).window.document.querySelector<HTMLElement>('[data-hero]')!;
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

const $ = (selector: string): Element => root.querySelector(selector)!;
const caption = (): string[] => [$('[data-hud-step]').textContent ?? '', $('[data-hud-text]').textContent ?? ''];
const button = (): HTMLButtonElement => $('[data-hud-play]') as HTMLButtonElement;
const label = (): string => button().textContent?.trim() ?? '';
const pageDrawn = (): boolean => [...root.querySelectorAll('.lm-px')].every((b) => b.classList.contains('on'));

/** Everything the hero shows at a moment, so two moments can be compared. */
function frame(): string {
  const all = (selector: string, read: (el: Element) => string | null) => [...root.querySelectorAll(selector)].map(read);
  return JSON.stringify({
    caption: caption(),
    cart: $('[data-part="cart"]').getAttribute('transform'),
    tag: [$('#hw-tag').getAttribute('style'), $('#hw-tag').getAttribute('transform'), $('#hw-tag-t').textContent],
    leds: all('[data-part="sleds"] .lm-led', (l) => l.getAttribute('class')),
    page: all('.lm-px', (b) => b.getAttribute('class')),
    drawIn: all('.hin', (g) => g.getAttribute('style')),
    ticks: all('[data-hud-ticks] i', (i) => i.getAttribute('class')),
    button: [label(), button().getAttribute('aria-label')],
  });
}

test('it waits until the hero comes into view, then plays once, announcing each line, and stops on the last frame', () => {
  startHero(root);
  expect(button().hidden).toBe(false);
  expect(label()).toBe('Play');
  expect(caption()).toEqual(FIRST);
  // Nothing moves before the hero is seen.
  const before = frame();
  vi.advanceTimersByTime(5000);
  expect(frame()).toBe(before);
  expect(vi.getTimerCount()).toBe(0);
  expect(FakeObserver.all).toHaveLength(1);
  expect(FakeObserver.all[0]!.targets).toEqual([$('svg.lm-hero')]);
  expect(FakeObserver.all[0]!.options).toMatchObject({ threshold: 0.35 });

  enter();
  expect(FakeObserver.all[0]!.connected).toBe(false);
  expect(label()).toBe('Pause');
  expect(button().getAttribute('aria-label')).toBe('Pause the animation');

  // The caption is a polite live region, and every line of it is shown once, in order.
  expect($('[data-hud-text]').getAttribute('aria-live')).toBe('polite');
  const said = [caption()[1]];
  for (let t = 0; t < T.end + 1000; t += 50) {
    vi.advanceTimersByTime(50);
    if (said.at(-1) !== caption()[1]) said.push(caption()[1]!);
  }
  expect(said).toEqual(STEPS.map(([, line]) => line));
  expect(caption()).toEqual(LAST);
  expect(pageDrawn()).toBe(true);
  expect(label()).toBe('Replay');
  expect(button().getAttribute('aria-label')).toBe('Replay the animation');

  // It plays once: nothing is waiting, and the last frame holds.
  expect(vi.getTimerCount()).toBe(0);
  const end = frame();
  vi.advanceTimersByTime(20000);
  expect(frame()).toBe(end);
});

test('the shuttle carries the request out and the reply home, and the server works in between', () => {
  const cart = (): string | null => $('[data-part="cart"]').getAttribute('transform');
  startHero(root);
  const home = cart();
  enter();
  vi.advanceTimersByTime(T.req + 400);
  expect(caption()).toEqual(STEPS[1]);
  expect($('#hw-tag-t').textContent).toBe('GET /');
  expect(cart()).not.toBe(home);
  vi.advanceTimersByTime(T.at - T.req);
  // At the server, which works while its lights flicker.
  expect(caption()).toEqual(STEPS[2]);
  const lights = () => [...root.querySelectorAll('[data-part="sleds"] .lm-led')].map((l) => l.classList.contains('on'));
  expect(lights()).toContain(false);
  vi.advanceTimersByTime(T.back - T.at);
  expect(caption()).toEqual(STEPS[3]);
  expect($('#hw-tag-t').textContent).toBe('200 OK');
  vi.advanceTimersByTime(T.end);
  // Home again, with the tag put away, the lights steady and the page drawn.
  expect(cart()).toBe(home);
  expect($('#hw-tag').getAttribute('style')).toMatch(/opacity: 0/);
  expect(lights()).toEqual([true, true, true]);
  expect(pageDrawn()).toBe(true);
});

test('Pause holds the frame, and Play goes on from it', () => {
  startHero(root);
  enter();
  vi.advanceTimersByTime(T.at + 400);
  expect(caption()).toEqual(STEPS[2]);

  button().click();
  expect(label()).toBe('Play');
  expect(button().getAttribute('aria-label')).toBe('Play the animation');
  expect(vi.getTimerCount()).toBe(0);
  const held = frame();
  vi.advanceTimersByTime(10000);
  expect(frame()).toBe(held);

  button().click();
  expect(label()).toBe('Pause');
  vi.advanceTimersByTime(T.back - T.at);
  expect(caption()).toEqual(STEPS[3]);
  vi.advanceTimersByTime(T.end);
  expect(caption()).toEqual(LAST);
  expect(label()).toBe('Replay');
});

test('Replay starts again from the beginning and plays to the end once more', () => {
  const hero = startHero(root);
  enter();
  vi.advanceTimersByTime(T.end + 100);
  expect(label()).toBe('Replay');

  button().click();
  expect(caption()).toEqual(FIRST);
  expect(pageDrawn()).toBe(false);
  expect(label()).toBe('Pause');
  vi.advanceTimersByTime(T.end + 100);
  expect(caption()).toEqual(LAST);
  expect(label()).toBe('Replay');
  expect(vi.getTimerCount()).toBe(0);

  // replay() part way through goes back to the start too.
  hero.play();
  vi.advanceTimersByTime(T.home + 200);
  expect(caption()).toEqual(STEPS[4]);
  hero.replay();
  expect(caption()).toEqual(FIRST);
  vi.advanceTimersByTime(T.end + 100);
  expect(caption()).toEqual(LAST);
});

test('under reduced motion it shows the last frame and a Play it button, and plays only when asked', () => {
  reduced = true;
  startHero(root);
  expect(caption()).toEqual(LAST);
  expect(pageDrawn()).toBe(true);
  expect(label()).toBe('Play it');
  expect(button().getAttribute('aria-label')).toBe('Play it from the start');
  expect(FakeObserver.all).toHaveLength(0);
  expect(vi.getTimerCount()).toBe(0);
  const still = frame();
  vi.advanceTimersByTime(20000);
  expect(frame()).toBe(still);

  button().click();
  expect(caption()).toEqual(FIRST);
  vi.advanceTimersByTime(T.end + 100);
  expect(caption()).toEqual(LAST);
  expect(label()).toBe('Play it');
  expect(vi.getTimerCount()).toBe(0);
});

test('a browser with no IntersectionObserver plays it at once, and once', () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  startHero(root);
  expect(label()).toBe('Pause');
  vi.advanceTimersByTime(T.end + 1000);
  expect(caption()).toEqual(LAST);
  expect(label()).toBe('Replay');
  expect(vi.getTimerCount()).toBe(0);
});

test('a hero with no data says so by name', () => {
  delete root.dataset.hero;
  expect(() => startHero(root)).toThrow('The hero has no data-hero.');
  // Not started, so the stylesheet's safety net still brings the figure in.
  expect(root.hasAttribute('data-started')).toBe(false);
});

test('starting marks the hero started, so the safety net stands aside for the script', () => {
  expect(root.hasAttribute('data-started')).toBe(false);
  startHero(root);
  expect(root.dataset.started).toBe('');
});

test('a figure whose script never starts still shows: its parts come in after 4s unless the hero is started', () => {
  // Vitest drops stylesheet contents, so the rules are read from the component itself.
  const css = readFileSync('src/components/HeroWeb.astro', 'utf8');
  expect(css).toMatch(/\.js \.hero \.hin \{\s*opacity: 0;\s*\}/);
  expect(css).toMatch(/\.js \.hero:not\(\[data-started\]\) \.hin \{\s*animation: hin-show 0s 4s forwards;\s*\}/);
  expect(css).toMatch(/@keyframes hin-show \{\s*to \{\s*opacity: 1;\s*\}\s*\}/);
});

test('Play or Pause pressed before the hero is seen is not overridden when it comes into view', () => {
  startHero(root);
  button().click();
  expect(label()).toBe('Pause');
  expect(FakeObserver.all[0]!.connected).toBe(false);
  vi.advanceTimersByTime(1000);
  button().click();
  expect(label()).toBe('Play');
  const held = frame();

  enter({ late: true });
  vi.advanceTimersByTime(5000);
  expect(frame()).toBe(held);
  expect(vi.getTimerCount()).toBe(0);
});

test('once torn down it stops at once and touches nothing more', () => {
  const hero = startHero(root);
  enter();
  vi.advanceTimersByTime(2000);
  hero.destroy();
  expect(vi.getTimerCount()).toBe(0);

  const left = frame();
  hero.play();
  hero.replay();
  hero.pause();
  button().click();
  enter({ late: true });
  vi.advanceTimersByTime(20000);
  expect(frame()).toBe(left);
  expect(vi.getTimerCount()).toBe(0);
});

test('torn down before it is seen, it never starts', () => {
  const hero = startHero(root);
  hero.destroy();
  expect(FakeObserver.all[0]!.connected).toBe(false);
  const left = frame();
  enter({ late: true });
  vi.advanceTimersByTime(20000);
  expect(frame()).toBe(left);
  expect(vi.getTimerCount()).toBe(0);
});

test('a hero taken off the page stops on its next frame and leaves no timer behind', () => {
  startHero(root);
  enter();
  vi.advanceTimersByTime(2000);
  const left = frame();
  root.remove();
  vi.advanceTimersByTime(20000);
  expect(frame()).toBe(left);
  expect(vi.getTimerCount()).toBe(0);
});
