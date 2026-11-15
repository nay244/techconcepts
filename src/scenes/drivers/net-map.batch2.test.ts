// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { batch2Fixtures } from '../../content/batch2-fixtures';
import type { Lesson, SceneEvent } from '../../content/schema';
import { deriveState, positionOf, slotsFor, stepEvents } from '../../engine/timeline';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { netMapDriver } from './net-map';

// D12 / B14's network map with the voice plate (prototypes/d12-cases.md, attack cases 16 to 19), driven by the TCP/UDP
// fixture. The driver itself is unchanged: its layers, its `describe` sentence, its busy lights and its page cue are all it needs.

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
const lesson = batch2Fixtures['tcp-udp']();
const unit = lesson.units[0]!;
const lessonModules = import.meta.glob<Lesson>(['../../content/lessons/*.ts', '!../../content/lessons/*.test.ts'], { import: 'default', eager: true });

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawn.svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
  return { root, driver: netMapDriver.create(root, data) };
}

const viewAt = (l: Lesson, step: number, played = 0): SceneView =>
  sceneViewOf(l.units[0]!, deriveState(l, step === 0 ? positionOf(l, 0, 'overview') : positionOf(l, 0, 'step', step), played));
const eventsOfStep = (step: number): SceneEvent[] => stepEvents(lesson, positionOf(lesson, 0, 'step', step));
const eventById = (id: string): SceneEvent => unit.steps.flatMap((s) => s.events).find((e) => e.id === id)!;
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o });
const part = (root: SVGSVGElement, id: string): SVGElement => root.querySelector<SVGElement>(`#${id}`)!;
const opacity = (el: SVGElement): string => el.style.opacity;
const voiceGroups = (root: SVGSVGElement): SVGElement[] => [...root.querySelectorAll<SVGElement>('[data-layer="tcp-udp:voice"]')];
const flush = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(0);
};
/** The views of a lesson at every position, before its step's events and after all of them. */
function everyView(l: Lesson): SceneView[] {
  const views: SceneView[] = [];
  for (let p = 0; p < slotsFor(l).length; p++) {
    const count = stepEvents(l, p).length;
    for (const n of new Set([0, count])) views.push(sceneViewOf(l.units[slotsFor(l)[p]!.unit]!, deriveState(l, p, n)));
  }
  return views;
}
const flatLength = (route: number[][]): number => route.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0]! - route[i]![0]!, p[1]! - route[i]![1]!), 0);

const VOICE_DESCRIPTION =
  'A network map. On the left, your home: a laptop and its router. In the middle, the internet: five routers joined by cables. On the right, the servers this protocol talks to. Behind the internet, the voice server the call goes through.';

// ---- check 16

test('16: the voice plate’s five groups are shown at every position of TCP/UDP, and hidden in every other lesson and on Home', () => {
  const { root, driver } = mount();
  expect(voiceGroups(root)).toHaveLength(5);
  for (const v of everyView(lesson)) {
    driver.show(v);
    expect(voiceGroups(root).map((g) => g.getAttribute('display'))).toEqual([null, null, null, null, null]);
  }
  // Home draws only http:web; every other lesson of the site names its own layers.
  const others = Object.values(lessonModules).filter((l) => l.figure === 'net-map');
  expect(others.length).toBeGreaterThanOrEqual(15);
  for (const v of [...others.flatMap(everyView), { ...viewAt(lesson, 0), layers: ['http:web'] }]) {
    driver.show(v);
    expect(voiceGroups(root).map((g) => g.getAttribute('display'))).toEqual(['none', 'none', 'none', 'none', 'none']);
  }
}, 30_000);

test('16: TCP/UDP and then What is UDP on one driver: the voice plate goes away again', () => {
  const { root, driver } = mount();
  driver.show(viewAt(lesson, 1));
  expect(voiceGroups(root).every((g) => !g.hasAttribute('display'))).toBe(true);
  const udp = Object.values(lessonModules).find((l) => l.slug === 'what-is-udp')!;
  driver.show(everyView(udp)[0]!);
  expect(voiceGroups(root).every((g) => g.getAttribute('display') === 'none')).toBe(true);
});

test('16: the figure’s description ends with the voice server’s sentence, and TCP/UDP’s map says nothing of a resolver or a phone', () => {
  const { root, driver } = mount();
  driver.show(viewAt(lesson, 0));
  expect(root.getAttribute('aria-label')).toBe(VOICE_DESCRIPTION);
  expect(root.getAttribute('aria-label')).toMatch(/Behind the internet, the voice server the call goes through\.$/);
  driver.show(viewAt(lesson, 3, 3));
  expect(root.getAttribute('aria-label')).toBe(VOICE_DESCRIPTION);
});

test('16: the voice server’s pad lights when VOICE 1 lands on it and is dark again when the play ends; Sam’s packets light it as they leave', async () => {
  const { root, driver } = mount();
  const before = viewAt(lesson, 4);
  driver.show(before);
  const lit = (): boolean => part(root, 'nm-tcp-udp-busy-voice').classList.contains('on');
  expect(lit()).toBe(false);
  const voice1 = eventById('s4-v1');
  const p = driver.play(voice1, before, options());
  expect(lit()).toBe(false);
  frameAt(0);
  frameAt(500 + 4 * flatLength(data.routes['laptop>voice']!));
  await flush();
  expect(lit()).toBe(true);
  await vi.runAllTimersAsync();
  await p;
  expect(lit()).toBe(false);

  // Sam's reply starts at the voice server: lit at once, off a quarter of the way along.
  const reply = viewAt(lesson, 4, 1);
  driver.show(reply);
  void driver.play(eventById('s4-s1'), reply, options());
  expect(lit()).toBe(true);
  frameAt(now);
  frameAt(now + (500 + 4 * flatLength(data.routes['voice>laptop']!)) * 0.5);
  expect(lit()).toBe(false);
});

// ---- check 17

test('17: one connection from the laptop to the web plate, from step 1’s end to step 5’s', () => {
  const { root, driver } = mount();
  const lines = (): string[] => [...part(root, 'nm-conns').querySelectorAll('polyline')].map((l) => l.getAttribute('points')!);
  driver.show(viewAt(lesson, 1, 2));
  expect(lines()).toHaveLength(0);
  driver.show(viewAt(lesson, 1, 3));
  const opened = lines();
  expect(opened).toHaveLength(1);
  // It is the laptop's way to the web server, on the cable: a reference made from the cue alone.
  const reference = mount();
  reference.driver.show({ ...viewAt(lesson, 0), start: [{ cue: 'conn', arg: 'open laptop>web' }] });
  expect([...part(reference.root, 'nm-conns').querySelectorAll('polyline')].map((l) => l.getAttribute('points')!)).toEqual(opened);
  for (const [step, played] of [[2, 8], [3, 4], [4, 3], [5, 4]] as const) {
    driver.show(viewAt(lesson, step, played));
    expect(lines(), `step ${step}`).toEqual(opened);
  }
});

// ---- check 18

test.each([['s2-p2', 2, 3, 'PIECE 2'], ['s5-s2', 5, 0, 'SAM 2']] as const)('18: the LOST mark shows during %s’s play and not once the step has settled', async (id, step, played, tag) => {
  const { root, driver } = mount();
  const before = viewAt(lesson, step, played);
  driver.show(before);
  const drop = part(root, 'nm-drop');
  const event = eventById(id);
  expect(event.type === 'message' && event.tag).toBe(tag);
  let done = false;
  void driver.play(event, before, options()).then(() => (done = true));
  expect(opacity(drop)).toBe('0');
  // Frames and timers move on together; the mark comes up where the message stops, and goes when the play ends.
  let seen = false;
  for (let i = 0; i < 200 && !done; i++) {
    frameAt(now + 50);
    await vi.advanceTimersByTimeAsync(50);
    if (opacity(drop) === '1') {
      seen = true;
      expect(drop.textContent).toBe('LOST');
    }
  }
  expect(done).toBe(true);
  expect(seen, 'the mark showed during the play').toBe(true);
  expect(opacity(drop)).toBe('0');
  // Settled, at the end of the step, there is no mark and no red trail.
  driver.show(viewAt(lesson, step, eventsOfStep(step).length));
  expect(opacity(drop)).toBe('0');
  expect(part(root, 'nm-trail').classList.contains('lost')).toBe(false);
});

// ---- check 19

test('19: the page text is dark before step 3’s last ACK and on the laptop’s screen from it on', () => {
  const { root, driver } = mount();
  const text = (): string => opacity(root.querySelector<SVGElement>('#nm-page [data-part="text"]')!);
  const steps = [[1, 3], [2, 8]] as const;
  for (const [step, played] of steps) {
    driver.show(viewAt(lesson, step, played));
    expect(text(), `step ${step}`).toBe('0');
  }
  driver.show(viewAt(lesson, 3, 3));
  expect(text()).toBe('0');
  driver.show(viewAt(lesson, 3, 4));
  expect(text()).toBe('1');
  for (const [step, played] of [[4, 0], [4, 3], [5, 4]] as const) {
    driver.show(viewAt(lesson, step, played));
    expect(text(), `step ${step}`).toBe('1');
  }
});

test('the laptop’s status and address bar follow the cues: "Saying hello" to "Talking, one packet lost", and the url reads Call from step 4', () => {
  const { root, driver } = mount();
  const state = (): string => part(root, 'nm-lapState').textContent ?? '';
  driver.show(viewAt(lesson, 1, 1));
  expect(state()).toBe('Saying hello');
  expect(part(root, 'nm-url').textContent).toBe('example.net');
  driver.show(viewAt(lesson, 4, 1));
  expect(part(root, 'nm-url').textContent).toBe('Call');
  driver.show(viewAt(lesson, 5, 3));
  expect(state()).toBe('Talking, one packet lost');
});
