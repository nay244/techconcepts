// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { NET_MAP_LAYERS } from '../../art/scenes/net-map-layers';
import type { Cue, MessageEvent, SceneEvent } from '../../content/schema';
import type { AppliedCue } from '../../engine/timeline';
import type { PlayOptions, SceneDriver, SceneView } from '../driver';
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
  frameAt(travel);
  await flush();
  // Lost: the trail turns red and dashed, and the drop mark sits where it stopped, with the word LOST on it.
  expect(trail.classList.contains('lost')).toBe(true);
  expect(opacity(drop)).toBe('1');
  const at = flatAt(route, 0.5);
  expect(moved(drop)).toEqual(at.map((v) => +v.toFixed(1)));
  expect(trail.getAttribute('points')!.split(' ').at(-1)).toBe(at.map((v) => v.toFixed(1)).join(','));
  expect(drop.textContent).toBe('LOST');

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

  // The colour of lost things is the blocked red, never marigold, which means only "current".
  expect(mapCss).toMatch(/\.nm \.nm-trail\.lost \{[^}]*stroke: var\(--blocked\)/);
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
  return [
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
});

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
});

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
