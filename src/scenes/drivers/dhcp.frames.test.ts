// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawDhcp, framesSetup } from '../../art/scenes/dhcp';
import { FRAMES_DESCRIPTION } from '../../art/scenes/dhcp-frames';
import { batch2Fixtures, MAC_OF } from '../../content/batch2-fixtures';
import dhcp from '../../content/lessons/dhcp';
import type { Lesson, SceneEvent } from '../../content/schema';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { showSweep } from '../../test/show-sweep';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { dhcpDriver } from './dhcp';

// D12 / B14's dhcp driver in the frames setup (prototypes/d12-cases.md, attack cases 9 to 15; H1, H2, H11, E1, E2, E9),
// with the MAC fixture, and DHCP's own scene beside it.

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

const mac = batch2Fixtures.mac();
const macUnit = mac.units[0]!;
const dhcpUnit = dhcp.units[0]!;
const PLACES = ['router', 'laptop', 'phone', 'tv'] as const;
type Place = (typeof PLACES)[number];

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawDhcp().svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="dhcp"]')!;
  return { root, driver: dhcpDriver.create(root, drawDhcp().data) };
}

/** The scene at step `step` of `lesson` once its first `played` events have been applied (step 0 is the Overview). */
function viewAt(lesson: Lesson, step: number, played = 0): SceneView {
  const position = step === 0 ? positionOf(lesson, 0, 'overview') : positionOf(lesson, 0, 'step', step);
  return sceneViewOf(lesson.units[0]!, deriveState(lesson, position, played));
}
const eventsOfStep = (lesson: Lesson, step: number): SceneEvent[] => stepEvents(lesson, positionOf(lesson, 0, 'step', step));
const eventById = (lesson: Lesson, id: string): SceneEvent => lesson.units[0]!.steps.flatMap((s) => s.events).find((e) => e.id === id)!;
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o });

const part = (root: SVGSVGElement, id: string): SVGElement => root.querySelector<SVGElement>(`#${id}`)!;
const verdictOf = (root: SVGSVGElement, place: Place): string | null => part(root, `dh-v-${place}`).getAttribute('data-v');
const wordOf = (root: SVGSVGElement, place: Place): string => part(root, `dh-v-${place}`).querySelector('.dh-v-t')!.textContent ?? '';
const verdicts = (root: SVGSVGElement): (string | null)[] => PLACES.map((p) => verdictOf(root, p));
const lightsOf = (root: SVGSVGElement, place: Place): boolean[] =>
  (place === 'router' ? ['dh-led-1', 'dh-led-2', 'dh-led-3'] : [{ laptop: 'dh-lap-glow', phone: 'dh-ph-glow', tv: 'dh-tv-glow' }[place]!]).map((id) => part(root, id).classList.contains('on'));
const looks = (root: SVGSVGElement): string => {
  const copy = root.cloneNode(true) as SVGSVGElement;
  for (const el of copy.querySelectorAll<SVGElement>('[style]')) el.setAttribute('style', el.style.cssText);
  return copy.outerHTML;
};

/** Plays one event to its end, as a panel's wait would let it: frames and timers moving on together. */
async function playOut(driver: SceneDriver, event: SceneEvent, before: SceneView, o: PlayOptions = options()): Promise<void> {
  let done = false;
  void driver.play(event, before, o).then(() => (done = true));
  for (let i = 0; i < 100 && !done; i++) {
    frameAt(now + 100);
    await vi.advanceTimersByTimeAsync(100);
  }
  expect(done).toBe(true);
}

// What each step leaves, in this order: router, laptop, phone, TV (§3.2, the "This frame" cells).
const END: Record<number, [string, string, string, string]> = {
  1: ['Hears it', 'Sent it', 'Hears it', 'Hears it'],
  2: ['Keeps it', 'Sent it', 'Ignores it', 'Ignores it'],
  3: ['Keeps it', 'Sent it', 'Ignores it', 'Ignores it'],
  4: ['Sent it', 'Keeps it', 'Keeps it', 'Keeps it'],
  5: ['Sent it', 'Keeps it', 'Ignores it', 'Ignores it'],
};
const V: Record<string, string> = { 'Sent it': 'sent', 'Hears it': 'hears', 'Keeps it': 'keeps', 'Ignores it': 'ignores' };

// ---- check 9: DHCP stays today's

test('9: in DHCP’s scene, at every position, no frames group shows, no verdict is set, and the figure is today’s', () => {
  const { root, driver } = mount();
  const label = root.getAttribute('aria-label');
  const positions = [0, 1, 2, 3, 4, 5].flatMap((step) => (step === 0 ? [viewAt(dhcp, 0)] : eventsOfStep(dhcp, step).map((_, k) => viewAt(dhcp, step, k + 1))));
  for (const view of positions) {
    driver.show(view);
    for (const g of root.querySelectorAll('[data-setup="frames"]')) expect(g.getAttribute('display')).toBe('none');
    expect(root.querySelectorAll('.dh-v[data-v]')).toHaveLength(0);
    expect(root.hasAttribute('data-split')).toBe(false);
    for (const g of root.querySelectorAll('[data-setup="addresses"]')) expect(g.hasAttribute('display')).toBe(false);
    expect(root.getAttribute('aria-label')).toBe(label);
    expect(part(root, 'dh-tv-glow').classList.contains('on')).toBe(false);
  }
  // The laptop’s screen is DHCP’s: no address until the lease.
  driver.show(viewAt(dhcp, 1));
  expect(part(root, 'dh-lap-noip').style.opacity).toBe('1');
  expect(part(root, 'dh-lap-ip').style.opacity).toBe('0');
});

test('9: DHCP’s event durations are the ones recorded before the change: 1850 for a message, 0 for a lease', () => {
  const { data } = drawDhcp();
  const events = dhcpUnit.steps.flatMap((s) => s.events);
  expect(events.length).toBeGreaterThan(0);
  for (const e of events) expect(dhcpDriver.duration(e, data), e.id).toBe(e.type === 'message' ? 1850 : 0);
});

test('9: DHCP’s broadcast is as before: the ring at the laptop, the phone hears past 55 %, and its Offer has no ring', async () => {
  const { root, driver } = mount();
  const before = viewAt(dhcp, 1);
  driver.show(before);
  void driver.play(eventById(dhcp, 'msg-discover'), before, options());
  frameAt(0);
  frameAt(715);
  expect(part(root, 'dh-ph-glow').classList.contains('on')).toBe(false);
  frameAt(780);
  expect(part(root, 'dh-ph-glow').classList.contains('on')).toBe(true);
  expect(root.querySelectorAll('.dh-v[data-v]')).toHaveLength(0);
  await vi.runAllTimersAsync();
  const offer = mount();
  const view = viewAt(dhcp, 2);
  offer.driver.show(view);
  void offer.driver.play(eventById(dhcp, 'msg-offer'), view, options());
  frameAt(now + 100);
  expect(part(offer.root, 'dh-ring-g').style.opacity).toBe('0');
});

// ---- check 10: the setup, at every position

test('10: in MAC’s scene, at every position, the frames setup is on, the lease board and its callouts are off, and the laptop is online', () => {
  const { root, driver } = mount();
  const views = [viewAt(mac, 0), ...[1, 2, 3, 4, 5].flatMap((step) => [viewAt(mac, step), ...eventsOfStep(mac, step).map((_, k) => viewAt(mac, step, k + 1))])];
  for (const view of views) {
    driver.show(view);
    const addresses = root.querySelectorAll('[data-setup="addresses"]');
    expect(addresses).toHaveLength(3);
    for (const g of addresses) expect(g.getAttribute('display')).toBe('none');
    const frames = root.querySelectorAll('[data-setup="frames"]');
    expect(frames).toHaveLength(2);
    for (const g of frames) expect(g.hasAttribute('display')).toBe(false);
    expect(part(root, 'dh-lap-ip').textContent).toBe('192.168.1.100');
    expect(part(root, 'dh-lap-ip').style.opacity).toBe('1');
    expect(part(root, 'dh-lap-noip').style.opacity).toBe('0');
    expect(root.getAttribute('aria-label')).toBe(FRAMES_DESCRIPTION);
  }
});

test('10: the figure’s description in the frames setup says the TV, and names MAC addresses', () => {
  expect(FRAMES_DESCRIPTION).toBe('A home Wi-Fi network on one plate: a laptop, a phone and a TV, and the router at the back. Beside each, its name and its MAC address.');
});

test('H10: the figure the page draws for MAC Address is what the driver shows at the Overview, so hydration changes nothing anyone sees', () => {
  const host = document.createElement('div');
  host.innerHTML = framesSetup(drawDhcp().svg);
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="dhcp"]')!;
  const driver = dhcpDriver.create(root, drawDhcp().data);
  const drawnAsDrawn = looks(root);
  driver.show(viewAt(mac, 0));
  expect(looks(root)).toBe(drawnAsDrawn);
});

// ---- check 11: the verdicts and the lights at each step’s end

test.each([1, 2, 3, 4, 5])('11: at the end of step %i each device’s verdict is its "This frame" cell, and its light is on exactly when it keeps the frame', (step) => {
  const { root, driver } = mount();
  driver.show(viewAt(mac, step, eventsOfStep(mac, step).length));
  PLACES.forEach((place, i) => {
    const word = END[step]![i]!;
    expect(verdictOf(root, place), `${place} at ${step}`).toBe(V[word]);
    expect(wordOf(root, place)).toBe(word);
    expect(lightsOf(root, place).every((on) => on === (word === 'Keeps it')), `${place}'s light at ${step}`).toBe(true);
  });
  expect(part(root, 'dh-led-0').classList.contains('on')).toBe(true);
});

test('11: the Overview and the start of step 1 show no verdict at all (every cell is "—")', () => {
  const { root, driver } = mount();
  for (const view of [viewAt(mac, 0), viewAt(mac, 1)]) {
    driver.show(view);
    expect(verdicts(root)).toEqual([null, null, null, null]);
    for (const place of PLACES) expect(wordOf(root, place)).toBe('');
  }
});

test('E2: a row that is missing, "—" or in other words leaves no verdict and no text', () => {
  const { root, driver } = mount();
  const full = viewAt(mac, 5, eventsOfStep(mac, 5).length);
  driver.show(full);
  expect(verdicts(root)).toEqual(['sent', 'keeps', 'ignores', 'ignores']);
  const view = structuredClone(full);
  const rows = view.tables.frames!.rows;
  rows.splice(2, 1);
  rows[0]!.frame = 'Sort of';
  rows[1]!.frame = '—';
  driver.show(view);
  expect(verdicts(root)).toEqual([null, null, null, 'ignores']);
  for (const place of ['router', 'laptop', 'phone'] as const) expect(wordOf(root, place)).toBe('');
  expect(lightsOf(root, 'laptop')).toEqual([false]);
});

test('11: the TV’s light is put out by every show, and clear() knows it (E9)', () => {
  const { root, driver } = mount();
  part(root, 'dh-tv-glow').classList.add('on');
  driver.show(viewAt(dhcp, 1));
  expect(part(root, 'dh-tv-glow').classList.contains('on')).toBe(false);
});

// ---- check 12: the ride

test('12: step 1’s ride, from the laptop: the router hears at k 0.45, the phone not before 0.58, all three at 0.7; the laptop sent throughout', () => {
  const { root, driver } = mount();
  const before = viewAt(mac, 1);
  driver.show(before);
  void driver.play(eventById(mac, 's1-frame'), before, options());
  // The sender says so at once.
  expect(verdicts(root)).toEqual([null, 'sent', null, null]);
  expect(lightsOf(root, 'laptop')).toEqual([true]);
  frameAt(0);
  frameAt(585); // k 0.45
  expect(verdicts(root)).toEqual(['hears', 'sent', null, null]);
  frameAt(728); // k 0.56
  expect(verdicts(root), 'DHCP’s 55 % rule does not apply here').toEqual(['hears', 'sent', null, null]);
  frameAt(910); // k 0.70
  expect(verdicts(root)).toEqual(['hears', 'sent', 'hears', 'hears']);
  expect(lightsOf(root, 'laptop')).toEqual([true]);
  expect(lightsOf(root, 'tv')).toEqual([true]);
  expect(wordOf(root, 'tv')).toBe('Hears it');
});

test('12: step 4’s ride, from the router: the TV at k 0.37, then the laptop by 0.45, all by 0.5; both circles at the router', () => {
  const { root, driver } = mount();
  const before = viewAt(mac, 4);
  driver.show(before);
  void driver.play(eventById(mac, 's4-frame'), before, options());
  expect(verdicts(root)).toEqual(['sent', null, null, null]);
  frameAt(0);
  frameAt(481); // k 0.37
  expect(verdicts(root)).toEqual(['sent', null, null, 'hears']);
  frameAt(585); // k 0.45
  expect(verdicts(root)).toEqual(['sent', 'hears', null, 'hears']);
  frameAt(650); // k 0.50
  expect(verdicts(root)).toEqual(['sent', 'hears', 'hears', 'hears']);
  for (const id of ['dh-ring', 'dh-ring2']) {
    expect(part(root, id).getAttribute('cx')).toBe('-11');
    expect(part(root, id).getAttribute('cy')).toBe('-49');
  }
});

test('12: the tag is the one the message says: TO ALL in step 4, FRAME in steps 1 and 5; the ring shows for every frame', () => {
  for (const [id, step, tag, other] of [
    ['s1-frame', 1, 'dh-tag-frame', 'dh-tag-to-all'],
    ['s4-frame', 4, 'dh-tag-to-all', 'dh-tag-frame'],
    ['s5-frame', 5, 'dh-tag-frame', 'dh-tag-to-all'],
  ] as const) {
    const { root, driver } = mount();
    const before = viewAt(mac, step);
    driver.show(before);
    void driver.play(eventById(mac, id), before, options());
    frameAt(0);
    frameAt(100);
    expect(part(root, tag).style.opacity, id).toBe('1');
    expect(part(root, other).style.opacity, id).toBe('0');
    // A frame to one device rings as a frame to everyone does: it is radio.
    expect(Number(part(root, 'dh-ring-g').style.opacity), id).toBeGreaterThan(0.5);
    document.body.innerHTML = '';
  }
});

test('12: under reduced motion every hearer hears at once, and the ring group stays at 0', async () => {
  const { root, driver } = mount();
  const before = viewAt(mac, 1);
  driver.show(before);
  const p = driver.play(eventById(mac, 's1-frame'), before, options({ reducedMotion: true }));
  expect(waiting.size).toBe(0);
  expect(verdicts(root)).toEqual(['hears', 'sent', 'hears', 'hears']);
  expect(part(root, 'dh-ring-g').style.opacity).toBe('0');
  await vi.runAllTimersAsync();
  await p;
  expect(verdicts(root)).toEqual(['hears', 'sent', 'hears', 'hears']);
});

test('12: a ride that starts after step 4 begins with none of step 4’s lights: every light is put out first', async () => {
  const { root, driver } = mount();
  driver.show(viewAt(mac, 4, eventsOfStep(mac, 4).length));
  expect(lightsOf(root, 'tv')).toEqual([true]);
  const before = viewAt(mac, 5);
  driver.show(before);
  void driver.play(eventById(mac, 's5-frame'), before, options());
  expect(lightsOf(root, 'tv')).toEqual([false]);
  expect(lightsOf(root, 'phone')).toEqual([false]);
  expect(lightsOf(root, 'router')).toEqual([true, true, true]);
});

// ---- check 13: the split follows a match only (H2, E1)

test('13: the split is on from the match, and at step 3’s end; off at step 3’s start and at step 4’s start', async () => {
  const { root, driver } = mount();
  const start = viewAt(mac, 3);
  driver.show(start);
  expect(root.hasAttribute('data-split')).toBe(false);
  await playOut(driver, eventById(mac, 's3-match'), start);
  expect(root.hasAttribute('data-split')).toBe(true);
  driver.show(viewAt(mac, 3, 1));
  expect(root.hasAttribute('data-split')).toBe(true);
  driver.show(viewAt(mac, 4));
  expect(root.hasAttribute('data-split')).toBe(false);
});

test('13: the split is not on after the laptop’s update in steps 4 and 5, played or shown (the highlight is the laptop’s, as an update)', async () => {
  for (const [step, id] of [[4, 's4-laptop'], [5, 's5-laptop']] as const) {
    const { root, driver } = mount();
    const events = eventsOfStep(mac, step);
    const k = events.findIndex((e) => e.id === id);
    const before = viewAt(mac, step, k);
    driver.show(before);
    await playOut(driver, events[k]!, before);
    expect(root.hasAttribute('data-split'), `${id} played`).toBe(false);
    const after = viewAt(mac, step, k + 1);
    expect(after.tables.frames!.highlight).toEqual({ key: MAC_OF.laptop, type: 'updated' });
    driver.show(after);
    expect(root.hasAttribute('data-split'), `${id} shown`).toBe(false);
  }
});

test('13: a match on another device’s row leaves no split', () => {
  const { root, driver } = mount();
  const view = viewAt(mac, 3, 1);
  view.tables.frames!.highlight = { key: MAC_OF.phone, type: 'matched' };
  driver.show(view);
  expect(root.hasAttribute('data-split')).toBe(false);
});

// ---- check 14: durations

test('14: a frames update and replace take 400, a frames match 900; a message 1850; a lease event 0', () => {
  const { data } = drawDhcp();
  expect(dhcpDriver.duration(eventById(mac, 's2-router'), data)).toBe(400);
  expect(dhcpDriver.duration(eventById(mac, 's1-heard'), data)).toBe(400);
  expect(dhcpDriver.duration(eventById(mac, 's3-match'), data)).toBe(900);
  expect(dhcpDriver.duration(eventById(mac, 's1-frame'), data)).toBe(1850);
  expect(dhcpDriver.duration(eventById(dhcp, 'lease-add'), data)).toBe(0);
  expect(dhcpDriver.duration(eventById(dhcp, 'lease-renew'), data)).toBe(0);
});

// ---- check 15: play against show

test.each([false, true])('15a: playing a step’s events and then showing its end leaves the figure a fresh show leaves, the ring too (reduced motion %s)', async (reducedMotion) => {
  for (const step of [1, 2, 3, 4, 5]) {
    const events = eventsOfStep(mac, step);
    const played = mount();
    played.driver.show(viewAt(mac, step));
    // As the panel does: show the scene before each event, then play it.
    for (const [k, event] of events.entries()) {
      const before = viewAt(mac, step, k);
      played.driver.show(before);
      await playOut(played.driver, event, before, options({ reducedMotion }));
    }
    const end = viewAt(mac, step, events.length);
    played.driver.show(end);
    const fresh = mount();
    fresh.driver.show(end);
    expect(looks(played.root), `step ${step}`).toBe(looks(fresh.root));
    document.body.innerHTML = '';
  }
});

test('15b: the show sweep, forwards, backwards and jumping, draws every moment of MAC’s scene as a fresh driver does', () => {
  expect(showSweep(mac)).toBe(8 + macUnit.steps.flatMap((s) => s.events).length);
});

test('15b: a jump back from step 5 leaves no stale verdict text and no split behind', () => {
  const { root, driver } = mount();
  driver.show(viewAt(mac, 3, 1));
  driver.show(viewAt(mac, 5, eventsOfStep(mac, 5).length));
  driver.show(viewAt(mac, 1));
  expect(root.hasAttribute('data-split')).toBe(false);
  for (const place of PLACES) expect(wordOf(root, place)).toBe('');
});

// ---- check 15c: what the figure shows while a step plays (H1)

test.each([1, 4, 5])('15c: while step %i plays, no device shows a verdict from an earlier step, and the others only hear until their own verdict lands', async (step) => {
  const { root, driver } = mount();
  const events = eventsOfStep(mac, step);
  const sender = (['laptop', 'router', 'router', 'router', 'router'] as const)[step - 1]!;
  const final: Record<Place, string> = Object.fromEntries(PLACES.map((p, i) => [p, V[END[step]![i]!]!])) as Record<Place, string>;
  // The last frame a step plays leaves the figure with what the updates then settle.
  const landed = new Set<Place>();
  const check = (): void => {
    for (const place of PLACES) {
      const shown = verdictOf(root, place);
      if (place === sender) expect(shown, `${place} sends`).toBe('sent');
      else if (landed.has(place)) expect(shown, `${place} landed`).toBe(final[place]);
      else expect([null, 'hears'], `${place} before its own verdict`).toContain(shown);
      expect(shown, `${place} is never keeps in step 5`).not.toBe(step === 5 && (place === 'phone' || place === 'tv') ? 'keeps' : 'x');
      expect(shown === 'sent' && place !== sender, `${place} is not the sender`).toBe(false);
    }
  };
  driver.show(viewAt(mac, step));
  for (const [k, event] of events.entries()) {
    const before = viewAt(mac, step, k);
    driver.show(before);
    let done = false;
    void driver.play(event, before, options()).then(() => (done = true));
    if (event.type === 'table' && event.op === 'update') landed.add(PLACES.find((p) => MAC_OF[p] === event.key)!);
    if (k > 0) check();
    for (let i = 0; i < 100 && !done; i++) {
      frameAt(now + 50);
      await vi.advanceTimersByTimeAsync(50);
      check();
    }
  }
});
