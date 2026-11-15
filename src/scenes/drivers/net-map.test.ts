// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { NET_MAP_LAYERS } from '../../art/scenes/net-map-layers';
import { routerFixture } from '../../content/router-fixture';
import { arpFixture, natFixture, portsFixture } from '../../content/batch1-fixtures';
import type { Cue, Lesson, MessageEvent, SceneEvent, Unit } from '../../content/schema';
import { usePlayback } from '../../engine/playback';
import { deriveState, slotsFor, stepEvents, type AppliedCue } from '../../engine/timeline';
import { showSweep } from '../../test/show-sweep';
import { sha256 } from '../../test/figure-hash';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { withoutD11 } from '../../test/svg-groups';
import { DRIVERS } from './index';
import { netMapDriver, parseConn } from './net-map';

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

const drawn = drawNetMap();
const data = drawn.data as NetMapData;
// Read from the project root: under jsdom import.meta.url is not a file URL.
const mapCss: string = readFileSync('src/art/scenes/net-map.css', 'utf8');

/** A fresh copy of the figure on the page, and its driver. */
function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawn.svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
  return { root, driver: netMapDriver.create(root, data) };
}

/** A cue as an event of the lesson carries it, and as the scene view lists it once that event has played. */
type CueOf = Cue & { eventId?: string };
function view(o: { layers?: string[]; labels?: Record<string, string>; start?: Cue[]; status?: string; cues?: CueOf[] } = {}): SceneView {
  const cues: AppliedCue[] = (o.cues ?? []).map(({ eventId, ...c }, i) => ({ ...c, eventId: eventId ?? `e${i}`, current: true }));
  const status = o.status ?? null;
  const start = o.start ?? [];
  return { unit: 0, layers: o.layers ?? ['http:web'], labels: o.labels ?? {}, start, status, cues, tables: {}, board: null, active: null, landed: null };
}

function msg(o: Partial<MessageEvent> = {}): MessageEvent {
  return { type: 'message', id: 'm', from: 'laptop', to: 'web', tag: 'GET /', kind: 'request', log: {}, plain: 'A message.', ...o };
}

/** The view once `event` has played on top of `before`, as the lesson's derived state lists it. */
function after(before: SceneView, event: SceneEvent): SceneView {
  const own = event.type === 'table' ? [] : (event.cues ?? []);
  return { ...before, cues: [...before.cues, ...own.map((c) => ({ ...c, eventId: event.id, current: true }))] };
}

function options(o: Partial<PlayOptions> = {}): PlayOptions {
  return { speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o };
}

/** Lets a play carry on past the tween a frame has just finished. */
const flush = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(0);
};
const part = (root: SVGSVGElement, id: string): SVGElement => root.querySelector<SVGElement>(`#${id}`)!;
const lit = (root: SVGSVGElement, id: string): boolean => part(root, id).classList.contains('on');
const opacity = (el: SVGElement): string => el.style.opacity;
/** The figure as it looks: its markup, with each inline style written the one way the browser reads it. */
function looks(root: SVGSVGElement): string {
  const copy = root.cloneNode(true) as SVGSVGElement;
  for (const el of copy.querySelectorAll<SVGElement>('[style]')) el.setAttribute('style', el.style.cssText);
  return copy.outerHTML;
}
/** Where a part has been moved to, from its `translate(x y)`. */
function moved(el: SVGElement): [number, number] {
  const m = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(el.getAttribute('transform') ?? '');
  if (m === null) throw new Error(`${el.id} has not been moved`);
  return [Number(m[1]), Number(m[2])];
}
/** The lit connections: each line's classes, and whether it is drawn above the cable. */
const conns = (root: SVGSVGElement) =>
  [...part(root, 'nm-conns').querySelectorAll('polyline')].map((p) => [p.getAttribute('class'), p.getAttribute('transform')]);
/** A route's point `k` of the way along its length on the plate, in the figure's own frame, at the cables' height. */
function flatAt(route: number[][], k: number): [number, number] {
  const [ax, bx, cx, ay, by, cy] = data.M as [number, number, number, number, number, number];
  const flat = route.map(([x, y]) => [data.O[0] + ax * x! + bx * y! + cx * data.TZ, data.O[1] + ay * x! + by * y! + cy * data.TZ]);
  const cum = [0];
  for (let i = 1; i < route.length; i++) cum.push(cum[i - 1]! + Math.hypot(route[i]![0]! - route[i - 1]![0]!, route[i]![1]! - route[i - 1]![1]!));
  const d = k * cum.at(-1)!;
  let i = 1;
  while (i < cum.length - 1 && cum[i]! < d) i++;
  const f = (d - cum[i - 1]!) / (cum[i]! - cum[i - 1]!);
  return [flat[i - 1]![0]! + (flat[i]![0]! - flat[i - 1]![0]!) * f, flat[i - 1]![1]! + (flat[i]![1]! - flat[i - 1]![1]!) * f];
}

test('DRIVERS has the network map’s driver', () => {
  expect(DRIVERS['net-map']).toBe(netMapDriver);
});

test('duration: a slow message on a 100-long route takes 500 + 400 + 450; dropped at 0.5 takes 450 + 380 + 650', () => {
  // 60 across and 80 along the plate: 100 long. A route's length is measured on the plate, so its climbs do not count.
  const straight = { ...data, routes: { 'laptop>web': [[0, 0, 2.6], [60, 80, 6.2]] } };
  expect(netMapDriver.duration(msg(), straight)).toBe(500 + 400 + 450);
  expect(netMapDriver.duration(msg({ outcome: 'dropped', dropAt: 0.5 }), straight)).toBe(450 + 380 + 650);
  // A quick one: 320 ms and 2.2 a unit, then 300 at the far end (2.2 × 100 is not quite 220 in floating point).
  expect(netMapDriver.duration(msg({ fast: true }), straight)).toBeCloseTo(320 + 220 + 300, 9);
  expect(netMapDriver.duration({ type: 'table', id: 't', table: 'files', op: 'add', row: {}, summary: 'A row.' }, straight)).toBe(0);
});

test('duration fails loudly for a message between places no route joins', () => {
  expect(() => netMapDriver.duration(msg({ to: 'nowhere' }), data)).toThrow(/no route laptop>nowhere/);
});

test('show() with layers ["http:web"] shows only that server plate', () => {
  const { root, driver } = mount();
  const shown = (key: string) => [...root.querySelectorAll(`[data-layer="${key}"]`)].map((g) => g.getAttribute('display'));
  driver.show(view({ layers: ['http:web'] }));
  expect(shown('http:web')).toEqual([null, null, null, null, null]);
  for (const key of Object.keys(NET_MAP_LAYERS).filter((k) => k !== 'http:web')) expect(shown(key), key).toEqual(Array(5).fill('none'));

  // Another protocol swaps them: SMTP's two mail servers, and no web server.
  driver.show(view({ layers: ['smtp:out', 'smtp:in'] }));
  expect(shown('smtp:out')).toEqual([null, null, null, null, null]);
  expect(shown('smtp:in')).toEqual([null, null, null, null, null]);
  expect(shown('http:web')).toEqual(Array(5).fill('none'));
  // DHCP has no server of its own.
  driver.show(view({ layers: [] }));
  expect(root.querySelectorAll('[data-layer]:not([display="none"])')).toHaveLength(0);
});

test('conn open, then seal, then close leaves no lit connection', async () => {
  const { root, driver } = mount();
  const open = { cue: 'conn', arg: 'open laptop>web' };
  const seal = { cue: 'conn', arg: 'seal laptop>web' };
  const close = { cue: 'conn', arg: 'close laptop>web' };
  driver.show(view({ cues: [open] }));
  expect(conns(root)).toEqual([['nm-conn', null]]);
  // The line runs along the cables from the laptop to the web server.
  const points = part(root, 'nm-conns').querySelector('polyline')!.getAttribute('points')!.split(' ');
  const [first, last] = [data.routes['laptop>web']!.at(0)!, data.routes['laptop>web']!.at(-1)!];
  expect(points[0]).toBe(flatAt([first, last], 0).map((v) => v.toFixed(1)).join(','));
  expect(points.at(-1)).toBe(flatAt([first, last], 1).map((v) => v.toFixed(1)).join(','));
  driver.show(view({ cues: [open, seal] }));
  expect(conns(root)).toEqual([['nm-conn sealed', null]]);
  driver.show(view({ cues: [open, seal, close] }));
  expect(conns(root)).toEqual([]);

  // Played, under reduced motion, the close lands the same.
  const before = view({ cues: [open, seal] });
  driver.show(before);
  const p = driver.play(msg({ id: 'bye', from: 'web', to: 'laptop', tag: 'CLOSE NOTIFY', cues: [close] }), before, options({ reducedMotion: true }));
  await vi.runAllTimersAsync();
  await p;
  expect(conns(root)).toEqual([]);
});

test('FTP’s data line is dashed and drawn above the control line, and closes on its own', () => {
  // The data line's class is the dashed one.
  expect(mapCss).toMatch(/\.nm \.nm-conn\.alt \{[^}]*stroke-dasharray: 5 4/);
  const { root, driver } = mount();
  const control = { cue: 'conn', arg: 'open laptop>files' };
  const dataLine = { cue: 'conn', arg: 'open laptop>files data' };
  driver.show(view({ layers: ['ftp:files'], cues: [control, dataLine] }));
  expect(conns(root)).toEqual([
    ['nm-conn', null],
    ['nm-conn alt', 'translate(0 -6)'],
  ]);
  driver.show(view({ layers: ['ftp:files'], cues: [control, dataLine, { cue: 'conn', arg: 'close laptop>files data' }] }));
  expect(conns(root)).toEqual([['nm-conn', null]]);
});

test('a unit’s start is in place before any cue plays: a line already open, letters already waiting', () => {
  const { root, driver } = mount();
  const open = { cue: 'conn', arg: 'open laptop>web' };
  const letters = { cue: 'tray', arg: 'mail on' };
  // TLS's line is open before anything has played, and its handshake may seal it and close it.
  driver.show(view({ layers: ['tls:web'], start: [open] }));
  expect(conns(root)).toEqual([['nm-conn', null]]);
  driver.show(view({ layers: ['tls:web'], start: [open], cues: [{ cue: 'conn', arg: 'seal laptop>web' }] }));
  expect(conns(root)).toEqual([['nm-conn sealed', null]]);
  driver.show(view({ layers: ['tls:web'], start: [open], cues: [{ cue: 'conn', arg: 'seal laptop>web' }, { cue: 'conn', arg: 'close laptop>web' }] }));
  expect(conns(root)).toEqual([]);

  // POP3's letters are waiting on the mailbox's tray, until a cue that plays takes them away.
  driver.show(view({ layers: ['pop3:mail'], start: [letters] }));
  expect(lit(root, 'nm-pop3-hold-mail')).toBe(true);
  driver.show(view({ layers: ['pop3:mail'], start: [letters], cues: [{ cue: 'tray', arg: 'mail off' }] }));
  expect(lit(root, 'nm-pop3-hold-mail')).toBe(false);

  // A scene with no start of its own shows none of another's.
  driver.show(view({ layers: ['imap:mail'], start: [letters] }));
  driver.show(view({ layers: ['tls:web'], start: [open] }));
  expect(lit(root, 'nm-imap-hold-mail')).toBe(false);
  driver.show(view({ layers: ['http:web'] }));
  expect(conns(root)).toEqual([]);

  // A start the map cannot show is a mistake in the lesson, as a cue that plays is.
  expect(() => driver.show(view({ start: [{ cue: 'conn', arg: 'seal laptop>web' }] }))).toThrow(/seals laptop>web, which is not open/);
  expect(() => driver.show(view({ start: [{ cue: 'tray', arg: 'web on' }] }))).toThrow(/no tray "web"/);
});

test.each([
  ['', /needs "<open\|seal\|close> <from>><to>\[ data\]"/],
  ['open', /needs "<open\|seal\|close> <from>><to>\[ data\]", not "open"/],
  ['shut laptop>web', /not "shut laptop>web"/],
  ['open laptop web', /not "open laptop web"/],
  ['open laptop>web extra', /not "open laptop>web extra"/],
  ['open laptop>web data data', /not "open laptop>web data data"/],
])('the conn cue rejects %j', (arg, message) => {
  expect(() => parseConn(arg)).toThrow(message);
});

test('the conn cue reads its action, its two places and the data line', () => {
  expect(parseConn('open laptop>web')).toEqual({ action: 'open', from: 'laptop', to: 'web', data: false });
  expect(parseConn('close laptop>files data')).toEqual({ action: 'close', from: 'laptop', to: 'files', data: true });
});

test('show fails loudly for a connection with no route, or one sealed before it opens', () => {
  const { driver } = mount();
  expect(() => driver.show(view({ cues: [{ cue: 'conn', arg: 'open laptop>moon' }] }))).toThrow(/no route laptop>moon/);
  expect(() => driver.show(view({ cues: [{ cue: 'conn', arg: 'seal laptop>web' }] }))).toThrow(/seals laptop>web, which is not open/);
  expect(() => driver.show(view({ cues: [{ cue: 'tray', arg: 'web on' }] }))).toThrow(/no tray "web"/);
  expect(() => driver.show(view({ cues: [{ cue: 'tray', arg: 'out' }] }))).toThrow(/needs "<site> <on\|off>", not "out"/);
  expect(() => driver.show(view({ cues: [{ cue: 'page', arg: 'half' }] }))).toThrow(/needs "text" or "full", not "half"/);
});

test('a dropped message leaves a blocked-red trail and a drop mark at dropAt', async () => {
  const { root, driver } = mount();
  const before = view({ layers: ['udp:call'] });
  driver.show(before);
  const route = data.routes['laptop>call']!;
  const lost = msg({ id: 'voice-5', to: 'call', tag: 'VOICE 5', over: 'IP', fast: true, outcome: 'dropped', dropAt: 0.5 });
  let done = false;
  void driver.play(lost, before, options()).then(() => (done = true));
  const trail = part(root, 'nm-trail') as SVGPolylineElement;
  const edge = part(root, 'nm-trail-edge') as SVGPolylineElement;
  const drop = part(root, 'nm-drop');
  const tag = part(root, 'nm-tag-7');
  expect(opacity(tag)).toBe('1');
  expect(tag.querySelector('.nm-tag-t')!.textContent).toBe('VOICE 5');
  expect(part(root, 'nm-over').textContent).toBe('IP');
  expect(opacity(drop)).toBe('0');

  // A quick message travels 320 ms and 2.2 a unit; a lost one stops halfway, on its way out of the laptop's home.
  const length = route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!), 0);
  const travel = (320 + 2.2 * length) * 0.5;
  frameAt(0);
  frameAt(travel / 2);
  expect(trail.classList.contains('lost')).toBe(false);
  // A trail that is not lost has no edge under it.
  expect(opacity(edge)).toBe('0');
  frameAt(travel);
  await flush();
  // Lost: the trail turns red and dashed, and the drop mark sits where it stopped, with the word LOST on it.
  expect(trail.classList.contains('lost')).toBe(true);
  expect(opacity(drop)).toBe('1');
  const at = flatAt(route, 0.5);
  expect(moved(drop)).toEqual(at.map((v) => +v.toFixed(1)));
  expect(trail.getAttribute('points')!.split(' ').at(-1)).toBe(at.map((v) => v.toFixed(1)).join(','));
  expect(drop.textContent).toBe('LOST');
  // Under the red, its edge in the figure's background, along the same points and as opaque as the trail.
  expect(edge.getAttribute('points')).toBe(trail.getAttribute('points'));
  expect(opacity(edge)).toBe(opacity(trail));
  expect(edge.nextElementSibling).toBe(trail);

  // The tag fades over 380 ms, then the mark stays 650 ms more, and the scene clears.
  frameAt(travel + 190);
  expect(Number(opacity(tag))).toBeCloseTo(0.5, 1);
  frameAt(travel + 380);
  await vi.advanceTimersByTimeAsync(649);
  expect(opacity(drop)).toBe('1');
  await vi.advanceTimersByTimeAsync(1);
  expect(done).toBe(true);
  expect(opacity(drop)).toBe('0');
  expect(trail.classList.contains('lost')).toBe(false);
  expect(opacity(edge)).toBe('0');
  expect(edge.getAttribute('points')).toBe('');

  // The colour of lost things is the blocked red, never marigold, which means only "current".
  expect(mapCss).toMatch(/\.nm \.nm-trail\.lost \{[^}]*stroke: var\(--blocked\)/);
  // Edged in the figure's background, 2px each side of the 2px trail, so the light red is never only beside a
  // charcoal plate. A plain stroke, as every engine draws it: no CSS filter, which WebKit has historically ignored on SVG parts.
  expect(mapCss).toMatch(
    /\.nm \.nm-trail-edge \{ fill: none; stroke: var\(--fig-bg\); stroke-width: 6px; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; \}/,
  );
  expect(mapCss).toMatch(/\.nm \.nm-trail \{[^}]*stroke-width: 2px;/);
  expect(mapCss).toMatch(/\.nm \.nm-trail\.lost \{[^}]*filter: none;/);
  expect(mapCss).not.toMatch(/drop-shadow\([^)]*var\(--fig-bg\)/);
  expect(mapCss).toMatch(/\.nm \.nm-drop circle \{[^}]*stroke: var\(--blocked\)/);
  expect(mapCss).toMatch(/\.nm \.nm-drop path \{[^}]*stroke: var\(--blocked\)/);
  expect(mapCss).toMatch(/\.nm \.nm-drop-t \{[^}]*fill: var\(--blocked\)/);
  expect(mapCss).not.toMatch(/--here/);
});

test('a message rides from its sender to its receiver, hopping over the routers, and lights both ends', async () => {
  const { root, driver } = mount();
  const before = view();
  driver.show(before);
  let done = false;
  void driver.play(msg({ from: 'web', to: 'laptop', tag: '200 OK', kind: 'response', over: 'TCP' }), before, options({ speed: 2 })).then(() => (done = true));
  const tag = part(root, 'nm-tag-6');
  const route = data.routes['web>laptop']!;
  const length = route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!), 0);
  const travel = (500 + 4 * length) / 2;
  // The server's lit part lights as it sends, and the home router's lights, as the message is for home.
  expect(lit(root, 'nm-http-busy-web')).toBe(true);
  expect(lit(root, 'nm-home-led-1')).toBe(true);
  frameAt(0);
  const start = moved(tag);
  frameAt(travel * 0.3);
  // A quarter of the way out, the sender has let go.
  expect(lit(root, 'nm-http-busy-web')).toBe(false);
  frameAt(travel);
  // The web server stands to the right of the laptop on screen.
  expect(moved(tag)[0]).toBeLessThan(start[0]);
  await flush();
  // A message to the laptop does not light its screen as it lands; it rests there 450 ms (225 at 2×), then clears.
  expect(lit(root, 'nm-busy-laptop')).toBe(false);
  await vi.advanceTimersByTimeAsync(224);
  expect([opacity(tag), done]).toEqual(['1', false]);
  await vi.advanceTimersByTimeAsync(1);
  expect(opacity(tag)).toBe('0');
  expect(lit(root, 'nm-home-led-1')).toBe(false);
  expect(done).toBe(true);
});

test('routers light when a message stops on them', async () => {
  const { root, driver } = mount();
  const before = view({ layers: ['icmp:web'] });
  driver.show(before);
  const p = driver.play(msg({ to: 'b', tag: 'TTL 3', fast: true }), before, options({ reducedMotion: true }));
  // Under reduced motion the tag lands at once, and rests there for as long as the mockup rests.
  await flush();
  expect(lit(root, 'nm-busy-b')).toBe(true);
  expect(lit(root, 'nm-busy-c')).toBe(false);
  await vi.advanceTimersByTimeAsync(300);
  await p;
  expect(lit(root, 'nm-busy-b')).toBe(false);
});

test('a broadcast spreads a ring across the home plate', () => {
  const { root, driver } = mount();
  const before = view({ layers: [] });
  driver.show(before);
  void driver.play(msg({ to: 'router', tag: 'DISCOVER', kind: 'broadcast', over: 'UDP' }), before, options());
  const ring = part(root, 'nm-ring');
  const scale = () => Number(/scale\(([\d.]+)\)/.exec(ring.getAttribute('transform') ?? '')![1]);
  expect(opacity(ring)).toBe('0.95');
  expect(scale()).toBe(0.6);
  const route = data.routes['laptop>router']!;
  const length = route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!), 0);
  frameAt(0);
  frameAt((500 + 4 * length) / 2);
  expect(scale()).toBeGreaterThan(2);
  expect(Number(opacity(ring))).toBeLessThan(0.95);
  // It is centred on the home plate.
  expect(ring.getAttribute('transform')).toMatch(new RegExp(`^translate\\(${data.ring.at[0]} ${data.ring.at[1]}\\)`));
});

test('show settles every applied cue: the status line, its style, the address, the address bar, the page, the padlock and the trays', () => {
  const { root, driver } = mount();
  const labels = { laptop: 'Wants example.net', laptopAddr: '192.168.1.100', url: 'example.net' };
  driver.show(view({ labels }));
  const state = part(root, 'nm-lapState');
  expect(state.textContent).toBe('Wants example.net');
  expect(state.getAttribute('class')).toBe('nm-state');
  expect(part(root, 'nm-url').textContent).toBe('example.net');
  expect(lit(root, 'nm-hold-lock')).toBe(false);
  const page = [...root.querySelectorAll<SVGElement>('#nm-page [data-part]')];
  expect(page.map(opacity)).toEqual(page.map(() => '0'));

  driver.show(
    view({
      labels,
      cues: [
        { cue: 'status', arg: 'Waiting for the page', eventId: 'get' },
        { cue: 'status-known', eventId: 'get' },
        { cue: 'page', arg: 'text', eventId: 'ok' },
      ],
    }),
  );
  expect(state.textContent).toBe('Waiting for the page');
  expect(state.getAttribute('class')).toBe('nm-state known');
  expect(page.map((el) => [el.dataset.part, opacity(el)]).every(([which, o]) => (which === 'text' ? o === '1' : o === '0'))).toBe(true);

  driver.show(
    view({
      labels,
      cues: [
        { cue: 'status', arg: 'Waiting for the page', eventId: 'get' },
        { cue: 'status-known', eventId: 'get' },
        // The style goes with its own status: a new status without one is plain again, until its own flag says.
        { cue: 'status-done', eventId: 'last' },
        { cue: 'status', arg: 'Secure. Page loaded', eventId: 'last' },
        { cue: 'page', arg: 'full', eventId: 'last' },
        { cue: 'lock', eventId: 'last' },
        { cue: 'addr', arg: '192.168.1.101', eventId: 'last' },
        { cue: 'url', arg: 'techconcepts.app', eventId: 'last' },
      ],
    }),
  );
  expect(state.textContent).toBe('Secure. Page loaded');
  expect(state.getAttribute('class')).toBe('nm-state done');
  expect(page.map(opacity)).toEqual(page.map(() => '1'));
  expect(lit(root, 'nm-hold-lock')).toBe(true);
  expect(part(root, 'nm-lapAddr').textContent).toBe('192.168.1.101');
  expect(part(root, 'nm-url').textContent).toBe('techconcepts.app');

  // A letter waits on the tray of the server it was handed to, and leaves when it is passed on.
  const mail = { layers: ['smtp:out', 'smtp:in'], labels };
  driver.show(view({ ...mail, cues: [{ cue: 'tray', arg: 'out on' }] }));
  expect([lit(root, 'nm-smtp-hold-out'), lit(root, 'nm-smtp-hold-in')]).toEqual([true, false]);
  driver.show(view({ ...mail, cues: [{ cue: 'tray', arg: 'out on' }, { cue: 'tray', arg: 'out off' }, { cue: 'tray', arg: 'in on' }] }));
  expect([lit(root, 'nm-smtp-hold-out'), lit(root, 'nm-smtp-hold-in')]).toEqual([false, true]);

  // Back to the start: nothing applied.
  driver.show(view({ labels }));
  expect(state.textContent).toBe('Wants example.net');
  expect(part(root, 'nm-lapAddr').textContent).toBe('192.168.1.100');
  expect(lit(root, 'nm-hold-lock')).toBe(false);
  expect(lit(root, 'nm-smtp-hold-in')).toBe(false);
});

test('the labels set the laptop’s first words and the router’s callout', () => {
  const { root, driver } = mount();
  const router = part(root, 'nm-router');
  driver.show(view());
  expect(router.getAttribute('display')).toBe('none');
  expect(part(root, 'nm-lapAddr').textContent).toBe('192.168.1.100');

  driver.show(view({ layers: [], labels: { laptop: 'Joining the Wi-Fi', laptopAddr: 'no address yet', url: 'No network', router: '192.168.1.1\nhands out addresses' } }));
  expect(part(root, 'nm-lapState').textContent).toBe('Joining the Wi-Fi');
  expect(part(root, 'nm-lapAddr').textContent).toBe('no address yet');
  expect(part(root, 'nm-url').textContent).toBe('No network');
  expect(router.hasAttribute('display')).toBe(false);
  // A line with a number is an address; a line of words is a note.
  expect([part(root, 'nm-router-1'), part(root, 'nm-router-2')].map((t) => [t.textContent, t.getAttribute('class')])).toEqual([
    ['192.168.1.1', 'nm-addr'],
    ['hands out addresses', 'nm-sub'],
  ]);
});

test('a step’s own status takes over from the label as the step starts, and any status a message has set wins over it', () => {
  const { root, driver } = mount();
  const state = part(root, 'nm-lapState');
  const labels = { laptop: 'Wants example.net' };
  driver.show(view({ labels }));
  expect(state.textContent).toBe('Wants example.net');
  // The step says what the laptop is doing before any message: plain, as a status of its own.
  driver.show(view({ labels, status: 'Preparing a request' }));
  expect([state.textContent, state.getAttribute('class')]).toEqual(['Preparing a request', 'nm-state']);
  const lookup = { cue: 'status', arg: 'Looking up example.net', eventId: 'lookup' };
  const found: CueOf[] = [lookup, { cue: 'status', arg: 'Found 203.0.113.80', eventId: 'answer' }, { cue: 'status-known', eventId: 'answer' }];
  driver.show(view({ labels, status: 'Preparing a request', cues: [lookup] }));
  expect(state.textContent).toBe('Looking up example.net');
  driver.show(view({ labels, status: 'Preparing a request', cues: found }));
  expect([state.textContent, state.getAttribute('class')]).toEqual(['Found 203.0.113.80', 'nm-state known']);
});

test('a message that sets no status leaves the step’s own on the laptop as it plays and lands', async () => {
  const { root, driver } = mount();
  const before = view({ labels: { laptop: 'Wants example.net' }, status: 'Preparing a request' });
  const event = msg({ id: 'syn', tag: 'SYN', fast: true });
  driver.show(before);
  const p = driver.play(event, before, options({ reducedMotion: true }));
  await vi.runAllTimersAsync();
  await p;
  expect(part(root, 'nm-lapState').textContent).toBe('Preparing a request');
});

/** Events that use every cue, every kind of trip and every outcome, each with the scene before it. */
function scenarios(): { event: SceneEvent; before: SceneView }[] {
  const web: SceneEvent[] = [
    msg({ id: 'lookup', to: 'resolver', tag: 'LOOKUP', over: 'UDP', cues: [{ cue: 'status', arg: 'Looking up example.net' }] }),
    msg({ id: 'answer', from: 'resolver', to: 'laptop', tag: 'ANSWER', kind: 'response', cues: [{ cue: 'status', arg: 'Found it' }, { cue: 'status-known' }] }),
    msg({ id: 'ack', tag: 'ACK', fast: true, cues: [{ cue: 'conn', arg: 'open laptop>web' }] }),
    msg({ id: 'finished', tag: 'FINISHED', cues: [{ cue: 'conn', arg: 'seal laptop>web' }] }),
    msg({ id: 'text', from: 'web', to: 'laptop', tag: '200 OK', kind: 'response', cues: [{ cue: 'page', arg: 'text' }] }),
    msg({ id: 'lost', from: 'web', to: 'laptop', tag: 'PIECE 2', outcome: 'dropped', dropAt: 0.55 }),
    { type: 'note', id: 'note', log: {}, plain: 'A note.', cues: [{ cue: 'status', arg: 'Waiting' }] },
    { type: 'table', id: 'row', table: 'files', op: 'add', row: {}, summary: 'A row.' },
    msg({ id: 'full', from: 'web', to: 'laptop', tag: 'ENCRYPTED', kind: 'encrypted', cues: [{ cue: 'page', arg: 'full' }, { cue: 'lock' }, { cue: 'status', arg: 'Loaded' }, { cue: 'status-done' }] }),
    msg({ id: 'who', to: 'router', tag: 'WHO HAS?', kind: 'broadcast', cues: [{ cue: 'addr', arg: '192.168.1.100' }, { cue: 'url', arg: 'Connected' }] }),
    msg({ id: 'ttl', to: 'b', tag: 'TTL 3', fast: true }),
    msg({ id: 'bye', from: 'web', to: 'laptop', tag: 'CLOSE NOTIFY', cues: [{ cue: 'conn', arg: 'close laptop>web' }] }),
  ];
  const mail: SceneEvent[] = [
    msg({ id: 'queued', from: 'out', to: 'laptop', tag: '250 QUEUED', kind: 'response', cues: [{ cue: 'tray', arg: 'out on' }] }),
    msg({ id: 'open', from: 'out', to: 'in', tag: 'ACK', cues: [{ cue: 'conn', arg: 'open out>in' }] }),
    msg({ id: 'letter', from: 'out', to: 'in', tag: 'LETTER', cues: [{ cue: 'tray', arg: 'out off' }] }),
    msg({ id: 'kept', from: 'in', to: 'out', tag: '250', kind: 'response', cues: [{ cue: 'tray', arg: 'in on' }] }),
  ];
  const files: SceneEvent[] = [
    msg({ id: 'control', to: 'files', tag: 'ACK', cues: [{ cue: 'conn', arg: 'open laptop>files' }] }),
    msg({ id: 'data', to: 'files', tag: 'ACK', cues: [{ cue: 'conn', arg: 'open laptop>files data' }] }),
    msg({ id: 'fin', to: 'files', tag: 'FIN', cues: [{ cue: 'conn', arg: 'close laptop>files data' }] }),
  ];
  // Scenes that start with something in place: TLS's open line, POP3's waiting letters.
  const sealed: SceneEvent[] = [
    msg({ id: 'hello', tag: 'CLIENT HELLO' }),
    msg({ id: 'finished', tag: 'FINISHED', cues: [{ cue: 'conn', arg: 'seal laptop>web' }] }),
    msg({ id: 'bye', from: 'web', to: 'laptop', tag: 'CLOSE NOTIFY', cues: [{ cue: 'conn', arg: 'close laptop>web' }] }),
  ];
  const collected: SceneEvent[] = [
    msg({ id: 'retr', to: 'mail', tag: 'RETR 1' }),
    msg({ id: 'goodbye', from: 'mail', to: 'laptop', tag: '+OK BYE', kind: 'response', cues: [{ cue: 'tray', arg: 'mail off' }] }),
  ];
  const run = (layers: string[], events: SceneEvent[], start: Cue[] = []) => {
    let before = view({ layers, labels: { laptop: 'Wants a page', url: 'example.net' }, start });
    return events.map((event) => {
      const at = { event, before };
      before = after(before, event);
      return at;
    });
  };
  // Router's unit: the resolver hidden from the start, a strip on each internet router, a table event or two, a router
  // dropping a packet (the DROPPED mark stays) and the note that comes back over it.
  const unitRun = (unit: Unit) => {
    let before = view({ layers: unit.scene.layers, labels: unit.scene.labels, start: unit.scene.start });
    return unit.steps.flatMap((step) => step.events).map((event) => {
      const at = { event, before };
      before = after(before, event);
      return at;
    });
  };
  // D11's three units: ARP's broadcast and row that leaves, Ports' closed port, NAT's phone, stranger and fast replies.
  return [
    ...unitRun(routerFixture().units[0]!),
    ...unitRun(arpFixture().units[0]!),
    ...unitRun(portsFixture().units[0]!),
    ...unitRun(natFixture().units[0]!),
    ...run(['http:web'], web),
    ...run(['smtp:out', 'smtp:in'], mail),
    ...run(['ftp:files'], files),
    ...run(['tls:web'], sealed, [{ cue: 'conn', arg: 'open laptop>web' }]),
    ...run(['pop3:mail'], collected, [{ cue: 'tray', arg: 'mail on' }]),
  ];
}

test('under reduced motion, play leaves the figure exactly as show would after each event', async () => {
  const played = mount();
  const shown = mount();
  for (const { event, before } of scenarios()) {
    played.driver.show(before);
    const p = played.driver.play(event, before, options({ reducedMotion: true }));
    // Nothing travels: no frame is ever asked for.
    expect(waiting.size, event.id).toBe(0);
    await vi.runAllTimersAsync();
    await p;
    expect(waiting.size, event.id).toBe(0);

    shown.driver.show(after(before, event));
    expect(looks(played.root), event.id).toBe(looks(shown.root));
  }
}, 30_000);

test('played in full, each event leaves the figure as show would after it', async () => {
  // One map plays every event in turn, as the console's does: its show must clear whatever the last play left.
  const played = mount();
  const shown = mount();
  for (const { event, before } of scenarios()) {
    played.driver.show(before);
    let done = false;
    const p = played.driver.play(event, before, options({ speed: 2 })).then(() => (done = true));
    // The clock runs on from the last event's, so every tween starts at the time it is asked for. A play that is
    // still going after 5 s (100 steps of 50 ms) is stuck, and fails here rather than timing the test out.
    for (let step = 0, t = now; !done && step < 100; step++, t += 50) {
      frameAt(t);
      await vi.advanceTimersByTimeAsync(50);
    }
    expect(done, `${event.id} still playing after 5 s`).toBe(true);
    await p;
    shown.driver.show(after(before, event));
    expect(looks(played.root), event.id).toBe(looks(shown.root));
  }
}, 30_000);

test('a letter leaves its tray as it is sent, not when it lands', () => {
  const { root, driver } = mount();
  const before = view({ layers: ['smtp:out', 'smtp:in'], cues: [{ cue: 'tray', arg: 'out on' }] });
  driver.show(before);
  void driver.play(msg({ from: 'out', to: 'in', tag: 'LETTER', cues: [{ cue: 'tray', arg: 'out off' }] }), before, options());
  expect(lit(root, 'nm-smtp-hold-out')).toBe(false);
});

test('a page draws itself in as it lands: its text first, then its picture', async () => {
  const { root, driver } = mount();
  const before = view({ cues: [{ cue: 'page', arg: 'text' }] });
  driver.show(before);
  const pictures = [...root.querySelectorAll<SVGElement>('#nm-page [data-part="pic"]')];
  expect(pictures.map(opacity)).toEqual(['0']);
  void driver.play(msg({ from: 'web', to: 'laptop', tag: '200 OK', cues: [{ cue: 'page', arg: 'full' }] }), before, options());
  const route = data.routes['web>laptop']!;
  const length = route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!), 0);
  const travel = 500 + 4 * length;
  frameAt(0);
  frameAt(travel);
  await flush();
  // Landed: the text was already there, and the picture comes in over the rest at the laptop.
  expect(pictures.map(opacity)).toEqual(['0']);
  frameAt(travel + 100);
  expect(pictures.map(opacity)).toEqual(['0']);
  frameAt(travel + 300);
  expect(pictures.map(opacity)).toEqual(['1']);
});

test('show settles at once: the browser takes its styles while the figure’s fades are off', () => {
  const { root, driver } = mount();
  const flushes: boolean[] = [];
  vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => {
    flushes.push(root.hasAttribute('data-settling'));
    return new DOMRect();
  });
  driver.show(view({ cues: [{ cue: 'lock' }] }));
  expect(flushes).toEqual([true]);
  expect(root.hasAttribute('data-settling')).toBe(false);
  expect(mapCss).toMatch(/\.nm\[data-settling\] \* \{ transition: none !important; \}/);
});

test('a play on a signal already aborted returns without touching the figure', async () => {
  const { root, driver } = mount();
  const before = view({ cues: [{ cue: 'conn', arg: 'open laptop>web' }] });
  driver.show(before);
  const frozen = looks(root);
  const controller = new AbortController();
  controller.abort();
  const events: SceneEvent[] = [
    msg({ tag: 'GET /', over: 'TCP', cues: [{ cue: 'status', arg: 'Waiting for the page' }] }),
    msg({ tag: 'LOST', outcome: 'dropped', dropAt: 0.5 }),
    msg({ to: 'router', tag: 'WHO HAS?', kind: 'broadcast' }),
    { type: 'note', id: 'note', log: {}, plain: 'A note.', cues: [{ cue: 'status', arg: 'Waiting' }] },
  ];
  for (const event of events) {
    await driver.play(event, before, options({ signal: controller.signal }));
    expect(waiting.size, event.id).toBe(0);
    expect(vi.getTimerCount(), event.id).toBe(0);
    expect(looks(root), event.id).toBe(frozen);
  }
});

test('a bad router label throws before show changes anything, and leaves no data-settling behind', () => {
  const { root, driver } = mount();
  driver.show(view({ layers: ['http:web'], labels: { router: 'Your router\n192.168.1.1' } }));
  const frozen = looks(root);
  expect(() => driver.show(view({ layers: ['ftp:files'], labels: { router: 'one\ntwo\nthree' } }))).toThrow(
    "The network map's router label has at most 2 lines, not 3.",
  );
  expect(root.hasAttribute('data-settling')).toBe(false);
  expect(looks(root)).toBe(frozen);
});

test('a driver made again on a figure already painted still knows the laptop’s own address', () => {
  const { root, driver } = mount();
  driver.show(view({ cues: [{ cue: 'addr', arg: '10.0.0.7' }] }));
  expect(part(root, 'nm-lapAddr').textContent).toBe('10.0.0.7');
  driver.destroy();
  // The console makes a new driver on the same figure, for example after a lesson's units change.
  const again = netMapDriver.create(root, data);
  again.show(view());
  expect(part(root, 'nm-lapAddr').textContent).toBe('192.168.1.100');
});

test('the driver takes only types from the drawing module, so the drawing code stays out of the page', () => {
  // Read from the project root: under jsdom import.meta.url is not a file URL.
  const source: string = readFileSync('src/scenes/drivers/net-map.ts', 'utf8');
  const fromDrawing = source.split('\n').filter((l) => /from '\.\.\/\.\.\/art\/scenes\/net-map'/.test(l));
  expect(fromDrawing.length).toBeGreaterThan(0);
  for (const l of fromDrawing) expect(l).toMatch(/^import type /);
});

test('an aborted play stops touching the figure, and show then settles it', async () => {
  const { root, driver } = mount();
  const before = view({ cues: [{ cue: 'conn', arg: 'open laptop>web' }] });
  driver.show(before);
  const controller = new AbortController();
  const event = msg({ tag: 'GET /', cues: [{ cue: 'status', arg: 'Waiting for the page' }] });
  const p = driver.play(event, before, options({ signal: controller.signal }));
  frameAt(0);
  frameAt(300);
  controller.abort();
  await p;
  const frozen = looks(root);
  frameAt(900);
  await vi.runAllTimersAsync();
  expect(looks(root)).toBe(frozen);

  driver.show(after(before, event));
  const fresh = mount();
  fresh.driver.show(after(before, event));
  expect(looks(root)).toBe(looks(fresh.root));
});

// ---------------------------------------------------------------- D10 / B12: Router's strips, DROPPED mark and hidden resolver

const router = routerFixture().units[0]!;
const routerView = (cues: CueOf[] = []) => view({ layers: router.scene.layers, labels: router.scene.labels, start: router.scene.start, cues });
const strip = (root: SVGSVGElement, place: string) => part(root, `nm-name-${place}`);
const stripWords = (root: SVGSVGElement) => [...root.querySelectorAll('.nm-strip')].map((g) => (g.getAttribute('display') === 'none' ? null : g.querySelector('text')!.textContent));
const hiddenBases = (root: SVGSVGElement) => [...root.querySelectorAll('[data-base="resolver"]')].map((el) => el.hasAttribute('data-hidden'));

test('Router’s scene shows the five strips with their words and hides every part of the resolver, at every position', () => {
  const { root, driver } = mount();
  driver.show(routerView());
  expect(stripWords(root)).toEqual(['provider', 'a', 'b', 'c', 'd']);
  const hidden = hiddenBases(root);
  expect(hidden.length).toBeGreaterThanOrEqual(5);
  expect(hidden.every(Boolean)).toBe(true);
  // The figure says it draws no resolver.
  expect(root.getAttribute('aria-label')).not.toMatch(/resolver/i);
  // A strip is as wide as its letters: 11 + 7.4 a character, and its words are centred on it.
  expect(strip(root, 'isp').querySelector('rect')!.getAttribute('width')).toBe('70.2');
  expect(strip(root, 'a').querySelector('rect')!.getAttribute('width')).toBe('18.4');
  const x = Number(strip(root, 'isp').dataset.x);
  expect(Number(strip(root, 'isp').querySelector('text')!.getAttribute('x'))).toBeCloseTo(x + 35.1, 5);
  // The cue plays on from there, and every position of the unit keeps the resolver off the map.
  driver.show(routerView([{ cue: 'drop', arg: 'a', eventId: 's5-drop' }, { cue: 'status', arg: 'No route: dropped', eventId: 's5-icmp' }]));
  expect(hiddenBases(root).every(Boolean)).toBe(true);
});

test('What is IP’s scene, with no strip labels and no hide, shows no strip and hides nothing', () => {
  const { root, driver } = mount();
  driver.show(view({ layers: ['ip:web'], labels: { laptop: 'Sending a packet', url: 'example.net', router: '192.168.1.1 inside\n198.51.100.23 outside' } }));
  expect(stripWords(root)).toEqual([null, null, null, null, null]);
  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"])')).toHaveLength(0);
  expect(root.getAttribute('aria-label')).toMatch(/DNS resolver/);
  expect(part(root, 'nm-discard').style.opacity).toBe('0');
});

test('a hidden-resolver start and then a start without it brings the resolver back; labels none hide the strips again', () => {
  const { root, driver } = mount();
  driver.show(routerView());
  expect(hiddenBases(root).every(Boolean)).toBe(true);
  driver.show(view({ layers: ['ip:web'] }));
  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"])')).toHaveLength(0);
  expect(root.getAttribute('aria-label')).toMatch(/DNS resolver/);
  expect(stripWords(root)).toEqual([null, null, null, null, null]);
  driver.show(routerView());
  expect(stripWords(root)).toEqual(['provider', 'a', 'b', 'c', 'd']);
});

test('`hide` takes only the resolver and `drop` only a router: anything else throws before the figure changes', () => {
  const { root, driver } = mount();
  expect(() => driver.show(view({ start: [{ cue: 'hide', arg: 'laptop' }] }))).toThrow(/cannot hide "laptop"/);
  expect(() => driver.show(view({ start: [{ cue: 'hide', arg: 'phone' }] }))).toThrow(/cannot hide "phone"/);
  expect(() => driver.show(view({ cues: [{ cue: 'drop', arg: 'zz' }] }))).toThrow(/no router "zz"/);
  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"])')).toHaveLength(0);
});

/** A box in the figure's units: from the attributes, as the figure draws it. */
type Box = [number, number, number, number];
const overlap = (a: Box, b: Box): boolean => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const stripBox = (g: SVGElement): Box => {
  const r = g.querySelector('rect')!;
  const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((n) => Number(r.getAttribute(n)));
  return [x!, y!, x! + w!, y! + h!];
};

test('no two strips overlap, and none overlaps the DROPPED mark at router a; the mark sits on router a’s top', () => {
  const { root, driver } = mount();
  driver.show(routerView([{ cue: 'drop', arg: 'a', eventId: 's5-drop' }]));
  const discard = part(root, 'nm-discard');
  const [mx, my] = moved(discard);
  // Router a's puck top, as the spec measures it.
  expect(mx).toBeCloseTo(214.7, 1);
  expect(my).toBeCloseTo(108.3, 1);
  expect(opacity(discard)).toBe('1');
  // The mark: its ring, and its pill from x 11 to 61 (net-map.ts).
  const mark: Box = [mx - 8, my - 8, mx + 61, my + 8];
  const boxes = ['isp', 'a', 'b', 'c', 'd'].map((place) => stripBox(strip(root, place)));
  boxes.forEach((a, i) => {
    expect(overlap(a, mark), `strip ${i} and the mark`).toBe(false);
    boxes.slice(i + 1).forEach((b, j) => expect(overlap(a, b), `strips ${i} and ${i + j + 1}`).toBe(false));
  });
  // Strips sit where the spec puts them: the router's top plus its offset (isp [-50, -24]).
  const [ix, iy] = data.tops.isp!;
  // (drawn to a tenth)
  expect(Math.abs(boxes[0]![0] - (ix - 50))).toBeLessThan(0.1);
  expect(Math.abs(boxes[0]![1] - (iy - 24))).toBeLessThan(0.1);
});

test('the DROPPED mark shows only once its cue has played, and clears when the cue is not in the view', () => {
  const { root, driver } = mount();
  driver.show(routerView());
  expect(opacity(part(root, 'nm-discard'))).toBe('0');
  driver.show(routerView([{ cue: 'drop', arg: 'a', eventId: 's5-drop' }]));
  expect(opacity(part(root, 'nm-discard'))).toBe('1');
  driver.show(routerView());
  expect(opacity(part(root, 'nm-discard'))).toBe('0');
});

test('the DROPPED mark stays while the ICMP message rides back over it, and no LOST mark shows in step 5', async () => {
  const { root, driver } = mount();
  const before = routerView([{ cue: 'drop', arg: 'a', eventId: 's5-drop' }]);
  driver.show(before);
  const icmp = router.steps[4]!.events.find((e) => e.id === 's5-icmp')!;
  let done = false;
  const p = driver.play(icmp, before, options()).then(() => (done = true));
  let seenDuringRide = 0;
  for (let step = 0, t = now; !done && step < 200; step++, t += 50) {
    frameAt(t);
    await vi.advanceTimersByTimeAsync(50);
    if (!done) seenDuringRide += opacity(part(root, 'nm-discard')) === '1' ? 1 : 0;
    expect(opacity(part(root, 'nm-drop')), 'no LOST mark').toBe('0');
  }
  await p;
  expect(seenDuringRide).toBeGreaterThan(3);
  expect(opacity(part(root, 'nm-discard'))).toBe('1');
});

test('the isp to a message is delivered: it rides to router a and leaves no LOST mark and no red trail', async () => {
  const { root, driver } = mount();
  const before = routerView();
  driver.show(before);
  const toA = router.steps[4]!.events.find((e) => e.id === 's5-to-a')!;
  let done = false;
  const p = driver.play(toA, before, options()).then(() => (done = true));
  for (let step = 0, t = now; !done && step < 200; step++, t += 50) {
    frameAt(t);
    await vi.advanceTimersByTimeAsync(50);
    expect(opacity(part(root, 'nm-drop'))).toBe('0');
    expect(part(root, 'nm-trail').classList.contains('lost')).toBe(false);
  }
  await p;
});

test('step 4’s last message leaves “Delivered” in the done style; step 5’s last, “No route: dropped” without it', () => {
  const { root, driver } = mount();
  const cues = (steps: number): CueOf[] =>
    router.steps.slice(0, steps).flatMap((step) => step.events.flatMap((e) => (e.type === 'table' ? [] : (e.cues ?? []).map((c) => ({ ...c, eventId: e.id })))));
  driver.show(routerView(cues(4)));
  expect(part(root, 'nm-lapState').textContent).toBe('Delivered');
  expect(part(root, 'nm-lapState').getAttribute('class')).toContain('done');
  driver.show(routerView(cues(5)));
  expect(part(root, 'nm-lapState').textContent).toBe('No route: dropped');
  expect(part(root, 'nm-lapState').getAttribute('class')).not.toContain('done');
});

test('the colour and look of the strips and the mark live in net-map.css', () => {
  expect(mapCss).toMatch(/\.nm \.nm-strip rect \{[^}]*fill: var\(--fig-bg\)[^}]*stroke: var\(--line-strong\)/);
  expect(mapCss).toMatch(/\.nm \.nm-strip text \{[^}]*700 12px/);
  expect(mapCss).toMatch(/\.nm \.nm-discard \.nm-drop-t \{ font-size: 8px/);
  expect(mapCss).toMatch(/\.nm \[data-base\]\[data-hidden\] \{ display: none/);
});

// ---------------------------------------------------------------- timing

test('on the map a replace takes 600 ms, a match 900, a note that drops a packet 900, and every other event but a ride 0', () => {
  const table = (op: 'replace' | 'match' | 'add' | 'update' | 'remove' | 'clear'): SceneEvent => ({ type: 'table', id: 't', table: 'routes', op, summary: 's' });
  expect(netMapDriver.duration(table('replace'), data)).toBe(600);
  expect(netMapDriver.duration(table('match'), data)).toBe(900);
  // A remove takes 600 too, so ARP's row is seen before it goes (D11); an add, an update and a clear land at once.
  expect(netMapDriver.duration(table('remove'), data)).toBe(600);
  for (const op of ['add', 'update', 'clear'] as const) expect(netMapDriver.duration(table(op), data), op).toBe(0);
  const note = (cues?: Cue[]): SceneEvent => ({ type: 'note', id: 'n', log: {}, plain: 'p', ...(cues === undefined ? {} : { cues }) });
  expect(netMapDriver.duration(note([{ cue: 'drop', arg: 'a' }]), data)).toBe(900);
  expect(netMapDriver.duration(note(), data)).toBe(0);
  expect(netMapDriver.duration(note([{ cue: 'status', arg: 'Waiting' }]), data)).toBe(0);
});

test('played at 1×, step 3 waits 600 ms before its table, then shows the candidates for 900 ms before the winner; at 2× half as long', () => {
  vi.useFakeTimers();
  const lesson = routerFixture();
  const hook = renderHook(() => usePlayback(lesson, (event) => netMapDriver.duration(event, data)));
  const where = () => `${hook.result.current[0].position}:${hook.result.current[0].eventIndex}`;
  const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));
  // Step 3 is position 3. Playing it from its start, with the table events' own waits.
  act(() => hook.result.current[1]({ type: 'go', position: 3 } as never));
  act(() => hook.result.current[1]({ type: 'toggle' } as never));
  expect(where()).toBe('3:0');
  wait(599);
  expect(where()).toBe('3:0');
  wait(1);
  expect(where()).toBe('3:1');
  wait(899);
  expect(where()).toBe('3:1');
  wait(1);
  // The candidates are applied now, and stay for the winner's wait.
  expect(where()).toBe('3:2');
  wait(899);
  expect(where()).toBe('3:2');
  wait(1);
  expect(where()).toBe('3:3');
  hook.unmount();

  // At 2× each wait is half: 300 for the replace, 450 for each match.
  const fast = renderHook(() => usePlayback(lesson, (event) => netMapDriver.duration(event, data)));
  const at2 = () => `${fast.result.current[0].position}:${fast.result.current[0].eventIndex}`;
  act(() => fast.result.current[1]({ type: 'go', position: 3 } as never));
  act(() => fast.result.current[1]({ type: 'cycleSpeed' } as never));
  act(() => fast.result.current[1]({ type: 'cycleSpeed' } as never));
  expect(fast.result.current[0].speed).toBe(2);
  act(() => fast.result.current[1]({ type: 'toggle' } as never));
  expect(at2()).toBe('3:0');
  wait(299);
  expect(at2()).toBe('3:0');
  wait(1);
  expect(at2()).toBe('3:1');
  wait(449);
  expect(at2()).toBe('3:1');
  wait(1);
  expect(at2()).toBe('3:2');
  wait(449);
  expect(at2()).toBe('3:2');
  wait(1);
  expect(at2()).toBe('3:3');
  fast.unmount();
  vi.useRealTimers();
});

test('the figure drawn for Router’s lesson is the approved prototype’s, tag for tag, where it stands in its page', () => {
  const proto: string = readFileSync('prototypes/d10-router.html', 'utf8');
  const theirs = /<svg data-figure="net-map"[\s\S]*?<\/svg>(?=<\/div>)/.exec(proto)![0];
  const lines = (svg: string): string[] => svg.split('><');
  // D11's phone is drawn hidden on every map; the prototype was drawn before it, so its groups come out whole first.
  expect(lines(withoutD11(drawNetMap(['ip:web']).svg))).toEqual(lines(theirs));
});

// ---------------------------------------------------------------- D11 / B13: the phone, the stranger, Ports' server, ARP's row that leaves

const phoneGroups = (root: SVGSVGElement): SVGElement[] => [...root.querySelectorAll<SVGElement>('[data-base="phone"]')];
const flatLength = (route: number[][]): number => route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!), 0);
/** The views of a lesson at every position, before its step's events and after all of them. */
function everyView(lesson: Lesson): SceneView[] {
  const views: SceneView[] = [];
  for (let p = 0; p < slotsFor(lesson).length; p++) {
    const count = stepEvents(lesson, p).length;
    for (const n of new Set([0, count])) views.push(sceneViewOf(lesson.units[slotsFor(lesson)[p]!.unit]!, deriveState(lesson, p, n)));
  }
  return views;
}
const lessonModules = import.meta.glob<Lesson>(['../../content/lessons/*.ts', '!../../content/lessons/*.test.ts'], { import: 'default', eager: true });
const otherNetMapLessons = (): Lesson[] => [...Object.values(lessonModules).filter((l) => l.figure === 'net-map'), routerFixture()];

test('the phone is hidden at every position of What is IP, Router and every tour unit, and shown at every position of NAT’s', () => {
  const others = otherNetMapLessons();
  expect(others.length).toBeGreaterThanOrEqual(15);
  const { root, driver } = mount();
  for (const lesson of others) {
    for (const v of everyView(lesson)) {
      driver.show(v);
      expect(phoneGroups(root).map((g) => g.hasAttribute('data-hidden')), lesson.slug).toEqual([true, true]);
    }
  }
  const nat = natFixture();
  for (const v of everyView(nat)) {
    driver.show(v);
    expect(phoneGroups(root).map((g) => g.hasAttribute('data-hidden'))).toEqual([false, false]);
  }
  // NAT and then What is IP on one driver: the phone is hidden again.
  driver.show(everyView(nat)[0]!);
  driver.show(everyView(whatIpLesson())[0]!);
  expect(phoneGroups(root).map((g) => g.hasAttribute('data-hidden'))).toEqual([true, true]);
});

const whatIpLesson = (): Lesson => Object.values(lessonModules).find((l) => l.slug === 'what-is-ip')!;

test('the figure’s description names the phone and the stranger only while they are shown', async () => {
  const label = (root: SVGSVGElement) => root.getAttribute('aria-label');
  const drawnLabel = /aria-label="([^"]+)"/.exec(drawn.svg)![1]!.replaceAll('&#39;', '’');
  const { root, driver } = mount();
  // What is IP's is today's, Router's is today's with no resolver sentence.
  driver.show(everyView(whatIpLesson())[0]!);
  expect(label(root)).toBe(drawnLabel);
  driver.show(everyView(routerFixture())[0]!);
  expect(label(root)).toBe(drawnLabel.replace(' Behind it, the DNS resolver, a card-index cabinet.', ''));
  // Ports shows a server and no phone.
  driver.show(everyView(portsFixture())[0]!);
  expect(label(root)).not.toMatch(/phone|someone else/i);
  // NAT's, exactly, at the Overview and after a play of step 5's first event.
  const NAT = 'A network map. On the left, your home: a laptop, a phone and their router. In the middle, the internet: five routers joined by cables. On the right, the servers this protocol talks to. Behind the internet, someone else’s computer, on another network.';
  const nat = natFixture();
  const views = everyView(nat);
  driver.show(views[0]!);
  expect(label(root)).toBe(NAT);
  const lastStep = slotsFor(nat).length - 3;
  const step5 = sceneViewOf(nat.units[0]!, deriveState(nat, lastStep, 0));
  driver.show(step5);
  const event = stepEvents(nat, lastStep)[0]!;
  const p = driver.play(event, step5, options({ reducedMotion: true }));
  await vi.runAllTimersAsync();
  await p;
  expect(label(root)).toBe(NAT);
});

test('the home lights flash for the phone’s messages, and its screen lights when a message lands on it', async () => {
  const { root, driver } = mount();
  const before = view({ layers: ['tcp:web'], start: [{ cue: 'show', arg: 'phone' }] });
  driver.show(before);
  void driver.play(msg({ from: 'phone', to: 'router', tag: 'PACKET' }), before, options());
  for (const i of [1, 2, 3]) expect(lit(root, `nm-home-led-${i}`), `led ${i}`).toBe(true);
  expect(lit(root, 'nm-busy-phone')).toBe(true);
  driver.show(before);

  const reply = msg({ from: 'router', to: 'phone', tag: 'REPLY', kind: 'response' });
  let done = false;
  const p = driver.play(reply, before, options()).then(() => (done = true));
  const travel = 500 + 4 * flatLength(data.routes['router>phone']!);
  frameAt(0);
  expect(lit(root, 'nm-busy-phone')).toBe(false);
  frameAt(travel);
  await flush();
  expect(lit(root, 'nm-busy-phone')).toBe(true);
  await vi.runAllTimersAsync();
  await p;
  expect([lit(root, 'nm-busy-phone'), done]).toEqual([false, true]);
});

test('a message between the phone and a place that is not home’s router still flashes the home lights', () => {
  const { root, driver } = mount();
  const before = view({ layers: ['tcp:web'], start: [{ cue: 'show', arg: 'phone' }] });
  driver.show(before);
  void driver.play(msg({ from: 'phone', to: 'web', tag: 'PACKET' }), before, options());
  expect(lit(root, 'nm-home-led-1')).toBe(true);
});

test('the stranger’s screen lights as it sends and goes off a quarter of the way along; the home lights flash', () => {
  const { root, driver } = mount();
  const before = view({ layers: ['tcp:web', 'nat:stranger'] });
  driver.show(before);
  void driver.play(msg({ from: 'stranger', to: 'router', tag: 'PACKET' }), before, options());
  expect(lit(root, 'nm-nat-busy-stranger')).toBe(true);
  expect(lit(root, 'nm-home-led-2')).toBe(true);
  frameAt(0);
  frameAt((500 + 4 * flatLength(data.routes['stranger>router']!)) * 0.5);
  expect(lit(root, 'nm-nat-busy-stranger')).toBe(false);
});

test('`show` takes only a part the map leaves off: anything else throws before the figure changes', () => {
  const { root, driver } = mount();
  expect(() => driver.show(view({ start: [{ cue: 'show', arg: 'resolver' }] }))).toThrow(/cannot show "resolver"/);
  expect(() => driver.show(view({ start: [{ cue: 'show', arg: 'laptop' }] }))).toThrow(/cannot show "laptop"/);
  expect(phoneGroups(root).every((g) => g.hasAttribute('data-hidden'))).toBe(true);
});

test('the table waits: a remove takes 600 ms at 1× and 300 at 2×, so the row is seen before it goes', () => {
  vi.useFakeTimers();
  const lesson = arpFixture();
  const at = (hook: ReturnType<typeof renderHook<ReturnType<typeof usePlayback>, unknown>>) => `${hook.result.current[0].position}:${hook.result.current[0].eventIndex}`;
  for (const [cycles, ms] of [[0, 600], [2, 300]] as const) {
    const hook = renderHook(() => usePlayback(lesson, (event) => netMapDriver.duration(event, data)));
    act(() => hook.result.current[1]({ type: 'go', position: 5 } as never));
    for (let i = 0; i < cycles; i++) act(() => hook.result.current[1]({ type: 'cycleSpeed' } as never));
    act(() => hook.result.current[1]({ type: 'toggle' } as never));
    expect(at(hook)).toBe('5:0');
    act(() => vi.advanceTimersByTime(ms - 1));
    expect(at(hook), `${ms - 1} ms`).toBe('5:0');
    act(() => vi.advanceTimersByTime(1));
    expect(at(hook), `${ms} ms`).toBe('5:1');
    hook.unmount();
  }
  vi.useRealTimers();
});

test('every existing net-map unit takes as long as it did before D11: no step’s events changed their wait, and none removes a row', async () => {
  const sums: Record<string, number> = {};
  for (const lesson of otherNetMapLessons()) {
    for (const unit of lesson.units) {
      for (const step of unit.steps) {
        for (const e of step.events) if (e.type === 'table') expect(e.op, `${lesson.slug} ${step.id}`).not.toBe('remove');
        sums[`${lesson.slug}/${unit.id}/${step.id}`] = step.events.reduce((total, e) => total + netMapDriver.duration(e, data), 0);
      }
    }
  }
  expect(await sha256(JSON.stringify(sums))).toBe('db8eecdec25bfa9331ea863ed0c7c4f91f320796ffe5cbc7191f0f04fffb287b');
});

test('under full and reduced motion, a broadcast’s ring is left still at ARP’s steps 1 and 5, and Ports’ RST leaves no lost trail', async () => {
  const arp = arpFixture();
  for (const step of [1, 5]) {
    const { root, driver } = mount();
    const before = sceneViewOf(arp.units[0]!, deriveState(arp, step, stepEvents(arp, step).length - (step === 1 ? 1 : 3)));
    driver.show(before);
    const event = stepEvents(arp, step).find((e) => e.type === 'message' && e.kind === 'broadcast')!;
    const p = driver.play(event, before, options({ reducedMotion: true }));
    await flush();
    expect(opacity(part(root, 'nm-ring')), `step ${step}`).toBe('0.6');
    await vi.runAllTimersAsync();
    await p;
  }
  const ports = portsFixture();
  const { root, driver } = mount();
  const rst = stepEvents(ports, 4).find((e) => e.id === 's4-rst')!;
  const before = sceneViewOf(ports.units[0]!, deriveState(ports, 4, 2));
  driver.show(before);
  const p = driver.play(rst, before, options({ reducedMotion: true }));
  await vi.runAllTimersAsync();
  await p;
  expect(part(root, 'nm-trail').classList.contains('lost')).toBe(false);
  expect(opacity(part(root, 'nm-drop'))).toBe('0');
});

test.each([['arp', arpFixture], ['ports', portsFixture], ['nat', natFixture]] as const)('the show sweep leaves %s’s figure as a fresh driver draws it, at every moment', (_name, fixture) => {
  vi.useRealTimers();
  const lesson = fixture();
  expect(showSweep(lesson)).toBeGreaterThanOrEqual(20);
});
