// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawPool, type PoolSceneData } from '../../art/scenes/pool';
import { POOL_HEALTH_WORDS } from '../../art/scenes/pool-parts';
import { batch3Fixtures } from '../../content/batch3-fixtures';
import type { Lesson, SceneEvent } from '../../content/schema';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { showSweep } from '../../test/show-sweep';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { DRIVERS } from './index';
import { poolDriver } from './pool';

// D13c / B15c (prototypes/d13-load-balancers.md §3 and §8; prototypes/d13-load-balancers-cases.md, T1, T2, S1 to S11 and
// P1 to P9): the driver's durations, what it shows from the pool table, and its motion. Timers and animation frames are
// fake, so a play is advanced to the millisecond.

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
});
afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

const lesson: Lesson = batch3Fixtures.pool();
const unit = lesson.units[0]!;
const { svg, data } = drawPool();
const fig = data as PoolSceneData;

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="pool"]')!;
  return { root, driver: poolDriver.create(root, drawPool().data) };
}
const viewAt = (step: number, played?: number): SceneView => {
  const position = positionOf(lesson, 0, step === 0 ? 'overview' : 'step', step);
  return sceneViewOf(unit, deriveState(lesson, position, played ?? stepEvents(lesson, position).length));
};
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o });
const eventsOf = (step: number): SceneEvent[] => stepEvents(lesson, positionOf(lesson, 0, 'step', step));
const eventAt = (step: number, k: number): SceneEvent => eventsOf(step)[k]!;
const tweak = (e: SceneEvent, o: object): SceneEvent => ({ ...e, ...o }) as SceneEvent;
function looks(root: SVGSVGElement): string {
  const copy = root.cloneNode(true) as SVGSVGElement;
  for (const el of copy.querySelectorAll<SVGElement>('[style]')) {
    if (el.style.cssText === '') el.removeAttribute('style');
    else el.setAttribute('style', el.style.cssText);
  }
  return copy.outerHTML;
}
const $ = (root: Element, id: string) => root.querySelector<SVGElement>(`#${id}`)!;
const shown = (el: Element) => (el as SVGElement).style.opacity === '1';
const on = (root: Element, prefix: string) => [...root.querySelectorAll(`[id^="${prefix}"]`)].filter((e) => e.classList.contains('on')).map((e) => e.id.replace(prefix, '')).sort();
const chips = (root: Element, s: string) => [0, 1, 2, 3].filter((i) => shown($(root, `pl-chip-${s}-${i}`)));
const litChips = (root: Element) => [...root.querySelectorAll('[id^="pl-chip-lit-"]')].filter(shown).map((e) => e.id.replace('pl-chip-lit-', ''));
const lamps = (root: Element, s: string) => [0, 1].map((n) => $(root, `pl-lamp-${s}-${n}`).getAttribute('data-check'));
const line = (root: Element, s: string) => ({ health: $(root, `pl-health-${s}`).getAttribute('data-health'), turning: $(root, `pl-health-${s}`).hasAttribute('data-turning'), text: $(root, `pl-health-t-${s}`).textContent });
const tagsShown = (root: Element) => [...root.querySelectorAll('[id^="pl-tag-"]')].filter(shown).map((e) => e.id.replace('pl-tag-', '')).sort();
const rings = (root: Element) => ['a', 'b', 'c'].filter((s) => shown($(root, `pl-quiet-${s}`)));
const skips = (root: Element) => ['a', 'b', 'c'].filter((s) => shown($(root, `pl-skip-${s}`)));
const onScreen = ([x, y, z]: number[]) => [fig.M[0]! * x + fig.M[1]! * y + fig.M[2]! * z, fig.M[3]! * x + fig.M[4]! * y + fig.M[5]! * z];
const translate = (p: number[]) => `translate(${onScreen(p)[0]!.toFixed(1)} ${onScreen(p)[1]!.toFixed(1)})`;

/** Plays step `step`'s event `k` on a figure showing the view before it, and gives back the play's promise. */
function start(step: number, k: number, o: Partial<PlayOptions> = {}) {
  const { root, driver } = mount();
  const before = viewAt(step, k);
  driver.show(before);
  const abort = new AbortController();
  let done = false;
  const p = driver.play(eventAt(step, k), before, options({ signal: abort.signal, ...o })).then(() => (done = true));
  return { root, driver, before, p, abort, done: () => done, advance: (to: number) => vi.advanceTimersByTimeAsync(to) };
}

test('DRIVERS has the pool driver', () => {
  expect(DRIVERS.pool).toBe(poolDriver);
});

// ---- T1, T2: durations

test('T1: a table event 0; a note 1,300 with no-answer and 200 without; a request 2,950, 3,650 with a skip, 1,950 fast; a check or answer 1,500, 1,000 fast', () => {
  const d = (e: SceneEvent) => poolDriver.duration(e, data);
  expect(d(eventAt(1, 1))).toBe(0);
  expect(d(eventAt(3, 3))).toBe(1300);
  const plain = tweak(eventAt(3, 3), { cues: [] });
  expect(d(plain)).toBe(200);
  expect(d(eventAt(1, 0))).toBe(2950);
  expect(d(eventAt(4, 2))).toBe(3650);
  expect(d(tweak(eventAt(1, 0), { fast: true }))).toBe(1950);
  expect(d(eventAt(3, 0))).toBe(1500);
  expect(d(eventAt(3, 1))).toBe(1500);
  expect(d(eventAt(3, 5))).toBe(1000);
  expect(d(tweak(eventAt(3, 1), { fast: true }))).toBe(1000);
  // A skip on a check would add nothing: only a reader's request waits to pick.
  expect(d(tweak(eventAt(3, 0), { cues: [{ cue: 'skip', arg: 'a' }] }))).toBe(1500);
});

test('T2: the five steps last 2,950, 5,900, 8,100, 11,850 and 8,950', () => {
  const sums = [1, 2, 3, 4, 5].map((s) => eventsOf(s).reduce((t, e) => t + poolDriver.duration(e, data), 0));
  expect(sums).toEqual([2950, 5900, 8100, 11850, 8950]);
});

// ---- S1 to S11: show

test('S1: the Overview: six green lamps, every line Healthy, no chip, glow, light, ring, tag or mark; the three bay lights stay on', () => {
  const { root, driver } = mount();
  driver.show(viewAt(0));
  for (const s of ['a', 'b', 'c']) {
    expect(lamps(root, s)).toEqual(['ok', 'ok']);
    expect(line(root, s)).toEqual({ health: 'healthy', turning: false, text: 'Healthy' });
    expect(chips(root, s)).toEqual([]);
  }
  expect(on(root, 'pl-glow-')).toEqual([]);
  expect(on(root, 'pl-pick-')).toEqual([]);
  expect(rings(root)).toEqual([]);
  expect(skips(root)).toEqual([]);
  expect(tagsShown(root)).toEqual([]);
  expect(litChips(root)).toEqual([]);
  expect(root.querySelectorAll('.lm-led.on')).toHaveLength(3);
});

function withHealth(word: string | undefined, requests = '1') {
  const view = viewAt(0);
  const rows = view.tables.pool!.rows.map((r) => ({ ...r }));
  const b = rows.find((r) => r.server === 'B')!;
  if (word === undefined) rows.splice(rows.indexOf(b), 1);
  else Object.assign(b, { health: word, requests });
  return { ...view, tables: { ...view.tables, pool: { ...view.tables.pool!, rows } } } as SceneView;
}

test('S2: each of the four health words sets B’s two lamps and its line; the others’ stay as they were', () => {
  const want: [string, string[], string, boolean][] = [
    ['Healthy', ['ok', 'ok'], 'healthy', false],
    ['1 check missed', ['ok', 'miss'], 'healthy', true],
    ['Unhealthy', ['miss', 'miss'], 'unhealthy', false],
    ['1 check passed', ['miss', 'ok'], 'unhealthy', true],
  ];
  expect(want.map((w) => w[0])).toEqual(Object.keys(POOL_HEALTH_WORDS));
  const { root, driver } = mount();
  for (const [word, lampWant, health, turning] of want) {
    driver.show(withHealth(word));
    expect(lamps(root, 'b'), word).toEqual(lampWant);
    expect(line(root, 'b'), word).toEqual({ health, turning, text: word });
    expect(lamps(root, 'a')).toEqual(['ok', 'ok']);
  }
});

test('S2: a word that is not one of the four, an inherited Object key, or no row leaves the lamps dark and the line empty, with no throw', () => {
  const { root, driver } = mount();
  for (const word of ['healthy', 'Healthy ', '1 check failed', 'constructor', 'toString', '__proto__', 'hasOwnProperty', undefined]) {
    driver.show(withHealth('Unhealthy'));
    expect(() => driver.show(withHealth(word)), String(word)).not.toThrow();
    expect(lamps(root, 'b'), String(word)).toEqual([null, null]);
    expect(line(root, 'b'), String(word)).toEqual({ health: null, turning: false, text: '' });
    if (word === undefined) expect(chips(root, 'b')).toEqual([]);
  }
});

test('S3: Requests 0, 1, 4, 7, x and -1 show 0, 1, 4, 4, 0 and 0 chips, the lowest first', () => {
  const { root, driver } = mount();
  for (const [cell, n] of [['0', 0], ['1', 1], ['4', 4], ['7', 4], ['x', 0], ['-1', 0], ['2', 2]] as const) {
    driver.show(withHealth('Healthy', cell));
    expect(chips(root, 'b'), cell).toEqual([0, 1, 2, 3].slice(0, n));
  }
});

test('S4: step 1 settled: your screen glows, A’s light is on, one chip on A and it is lit; no tag or trail', () => {
  const { root, driver } = mount();
  driver.show(viewAt(1));
  expect(on(root, 'pl-glow-')).toEqual(['laptop']);
  expect(on(root, 'pl-pick-')).toEqual(['a']);
  expect(chips(root, 'a')).toEqual([0]);
  expect(litChips(root)).toEqual(['a-0']);
  expect(tagsShown(root)).toEqual([]);
  expect(shown($(root, 'pl-trail'))).toBe(false);
});

test('S5: step 3 after 5 events: B’s lamps ok, miss; healthy and turning; the ring is still over B', () => {
  const { root, driver } = mount();
  const view = viewAt(3, 5);
  driver.show(view);
  expect(lamps(root, 'b')).toEqual(['ok', 'miss']);
  expect(line(root, 'b')).toEqual({ health: 'healthy', turning: true, text: '1 check missed' });
  expect(rings(root)).toEqual(['b']);
  expect(view.tables.pool!.missed).toEqual([]);
});

test('S6: step 3 settled: B’s lamps miss, miss; unhealthy, not turning; the ring; marked; nothing lit', () => {
  const { root, driver } = mount();
  const view = viewAt(3);
  driver.show(view);
  expect(lamps(root, 'b')).toEqual(['miss', 'miss']);
  expect(line(root, 'b')).toEqual({ health: 'unhealthy', turning: false, text: 'Unhealthy' });
  expect(rings(root)).toEqual(['b']);
  expect(view.tables.pool!.missed).toEqual(['B']);
  expect(on(root, 'pl-glow-')).toEqual([]);
  expect(on(root, 'pl-pick-')).toEqual([]);
});

test('S7: step 4 settled: chips A 3, B 1, C 2; B unhealthy and marked; the ring over B', () => {
  const { root, driver } = mount();
  const view = viewAt(4);
  driver.show(view);
  expect(['a', 'b', 'c'].map((s) => chips(root, s).length)).toEqual([3, 1, 2]);
  expect(line(root, 'b').health).toBe('unhealthy');
  expect(view.tables.pool!.missed).toEqual(['B']);
  expect(rings(root)).toEqual(['b']);
  expect(on(root, 'pl-glow-')).toEqual([]);
});

test('S8 and S9: step 5 after 3 events: B miss, ok, unhealthy and turning, still marked; after 6: healthy and clear', () => {
  const { root, driver } = mount();
  const three = viewAt(5, 3);
  driver.show(three);
  expect(lamps(root, 'b')).toEqual(['miss', 'ok']);
  expect(line(root, 'b')).toEqual({ health: 'unhealthy', turning: true, text: '1 check passed' });
  expect(three.tables.pool!.missed).toEqual(['B']);
  const six = viewAt(5, 6);
  driver.show(six);
  expect(lamps(root, 'b')).toEqual(['ok', 'ok']);
  expect(line(root, 'b')).toEqual({ health: 'healthy', turning: false, text: 'Healthy' });
  expect(six.tables.pool!.missed).toEqual([]);
});

test('S10: step 5 settled: all six lamps ok, every line Healthy, chips A 3, B 2, C 2, B’s light and Reader 2’s screen lit and B’s newest chip', () => {
  const { root, driver } = mount();
  const view = viewAt(5);
  driver.show(view);
  for (const s of ['a', 'b', 'c']) {
    expect(lamps(root, s)).toEqual(['ok', 'ok']);
    expect(line(root, s).text).toBe('Healthy');
  }
  expect(['a', 'b', 'c'].map((s) => chips(root, s).length)).toEqual([3, 2, 2]);
  expect(on(root, 'pl-pick-')).toEqual(['b']);
  expect(on(root, 'pl-glow-')).toEqual(['reader2']);
  expect(litChips(root)).toEqual(['b-1']);
  expect(rings(root)).toEqual([]);
  expect(view.tables.pool!.missed).toEqual([]);
});

test('S11: the show sweep passes on the fixture, and it counts its moments', () => {
  vi.useRealTimers();
  // The Overview, each step's events plus one, Learn and Practice.
  expect(showSweep(lesson)).toBe(1 + (2 + 1) + (4 + 1) + (8 + 1) + (8 + 1) + (8 + 1) + 2);
});

// ---- P1 to P9: play

test('P1: step 1’s request: your screen glows and the REQUEST tag rides at once; A’s light comes on after the first ride; the tag is gone at the end; the table event lights A’s chip', async () => {
  const s = start(1, 0);
  await s.advance(10);
  expect(on(s.root, 'pl-glow-')).toEqual(['laptop']);
  expect(tagsShown(s.root)).toEqual(['request']);
  expect(on(s.root, 'pl-pick-')).toEqual([]);
  await s.advance(1100);
  expect(on(s.root, 'pl-pick-')).toEqual(['a']);
  await s.advance(2000);
  await s.p;
  expect(tagsShown(s.root)).toEqual([]);
  expect(shown($(s.root, 'pl-trail'))).toBe(false);
  const tableEvent = eventAt(1, 1);
  const p = s.driver.play(tableEvent, viewAt(1, 1), options());
  await vi.advanceTimersByTimeAsync(10);
  await p;
  expect(chips(s.root, 'a')).toEqual([0]);
  expect(litChips(s.root)).toEqual(['a-0']);
});

test('P2: step 4’s skip: the red mark shows while the tag waits and C’s light is not on; after 700 ms the light is on and the mark stays; both are gone at the end', async () => {
  const s = start(4, 2);
  await s.advance(900);
  expect(skips(s.root)).toEqual([]);
  await s.advance(200); // 1,100: the first ride is over
  expect(skips(s.root)).toEqual(['b']);
  expect(on(s.root, 'pl-pick-')).toEqual([]);
  expect(tagsShown(s.root)).toEqual(['request']);
  await s.advance(500); // 1,600
  expect(skips(s.root)).toEqual(['b']);
  expect(on(s.root, 'pl-pick-')).toEqual([]);
  await s.advance(200); // 1,800: after the 700 ms wait
  expect(on(s.root, 'pl-pick-')).toEqual(['c']);
  expect(skips(s.root)).toEqual(['b']);
  await s.advance(1400); // 3,200: second ride over, resting
  expect(skips(s.root)).toEqual(['b']);
  await s.advance(500);
  await s.p;
  expect(skips(s.root)).toEqual([]);
  expect(tagsShown(s.root)).toEqual([]);
});

test('P3: a check starts at the balancer’s top and an answer ends there; neither lights a screen or a pick', async () => {
  const c = start(3, 0);
  expect($(c.root, 'pl-tag-check').getAttribute('transform')).toBe(translate(fig.legs.a[0]!));
  await c.advance(500);
  expect(on(c.root, 'pl-glow-')).toEqual([]);
  expect(on(c.root, 'pl-pick-')).toEqual([]);
  await c.advance(1500);
  await c.p;
  const a = start(3, 1);
  expect($(a.root, 'pl-tag-ok').getAttribute('transform')).toBe(translate(fig.legs.a.at(-1)!));
  let last = '';
  for (let i = 0; i < 12; i++) {
    await a.advance(100);
    if (shown($(a.root, 'pl-tag-ok'))) last = $(a.root, 'pl-tag-ok').getAttribute('transform')!;
  }
  await a.advance(1000);
  await a.p;
  expect(last).not.toBe('');
  expect(on(a.root, 'pl-glow-')).toEqual([]);
  expect(on(a.root, 'pl-pick-')).toEqual([]);
  // The answer ends where the check began, the balancer's top.
  const r = start(3, 1, { reducedMotion: true });
  await r.advance(5);
  expect($(r.root, 'pl-tag-ok').getAttribute('transform')).toBe(translate(fig.legs.a[0]!));
});

test('P4: a no-answer note rings B, at 1 under reduced motion at once; a table event after it keeps the ring', async () => {
  const s = start(3, 3);
  await s.advance(50);
  expect(rings(s.root)).toEqual([]);
  expect(shown($(s.root, 'pl-quiet-b'))).toBe(false);
  expect(Number($(s.root, 'pl-quiet-b').style.opacity)).toBeGreaterThan(0);
  await s.advance(1300);
  await s.p;
  expect(rings(s.root)).toEqual(['b']);
  const r = start(3, 3, { reducedMotion: true });
  await r.advance(1);
  expect(rings(r.root)).toEqual(['b']);
  await r.advance(1300);
  await r.p;
  const p = r.driver.play(eventAt(3, 4), viewAt(3, 4), options());
  await vi.advanceTimersByTimeAsync(5);
  await p;
  expect(rings(r.root)).toEqual(['b']);
});

test('P5: a tag is placed at its leg’s first point before it shows', async () => {
  const s = start(1, 0);
  expect(shown($(s.root, 'pl-tag-request'))).toBe(true);
  expect($(s.root, 'pl-tag-request').getAttribute('transform')).toBe(translate(fig.legs.laptop[0]!));
  await s.advance(1100);
  // The second ride starts at the balancer's top.
  await s.advance(500);
  expect($(s.root, 'pl-tag-request').getAttribute('transform')).toMatch(/^translate\(/);
  await s.advance(2000);
  await s.p;
});

test('P6: under reduced motion the trail is the whole leg, each point on screen plus O', async () => {
  const s = start(3, 0, { reducedMotion: true });
  await s.advance(5);
  const points = $(s.root, 'pl-trail').getAttribute('points')!.split(' ').map((p) => p.split(',').map(Number));
  const want = fig.legs.a.map(onScreen).map(([x, y]) => [Number((x! + fig.O[0]).toFixed(1)), Number((y! + fig.O[1]).toFixed(1))]);
  expect(points.slice(0, 8)).toEqual(want);
  expect(points).toHaveLength(9);
  await s.advance(1000);
  await s.p;
  expect($(s.root, 'pl-trail').getAttribute('points')).toBe('');
});

test('P7: stopped anywhere in a request, a skipped request or a note, show(before) leaves the figure as a fresh show does, and the play writes nothing more', async () => {
  const cases: [number, number, number][] = [[1, 0, 500], [4, 2, 1300], [4, 2, 1900], [4, 2, 2600], [3, 3, 500], [3, 0, 700], [1, 0, 1100], [1, 0, 1600], [4, 2, 1050]];
  for (const [step, k, ms] of cases) {
    const s = start(step, k);
    await s.advance(ms);
    s.abort.abort();
    await s.p;
    s.driver.show(s.before);
    const fresh = mount();
    fresh.driver.show(s.before);
    expect(looks(s.root), `step ${step} event ${k} at ${ms}`).toBe(looks(fresh.root));
    await s.advance(5000);
    expect(looks(s.root), `step ${step} event ${k} at ${ms}, later`).toBe(looks(fresh.root));
    document.body.innerHTML = '';
  }
});

test('P7: stopped during the skip wait, the play does not go on to light C or ride on', async () => {
  const s = start(4, 2);
  await s.advance(1300);
  s.abort.abort();
  await s.p;
  expect(on(s.root, 'pl-pick-')).toEqual([]);
  const at = $(s.root, 'pl-tag-request').getAttribute('transform');
  await s.advance(3000);
  expect($(s.root, 'pl-tag-request').getAttribute('transform')).toBe(at);
  expect(on(s.root, 'pl-pick-')).toEqual([]);
});

test('P8: for every event, show(before) then a reduced-motion play looks as a fresh show(after) does', async () => {
  let count = 0;
  for (const step of [1, 2, 3, 4, 5]) {
    for (const [k, event] of eventsOf(step).entries()) {
      const a = mount();
      a.driver.show(viewAt(step, 0));
      for (let i = 0; i < k; i++) {
        a.driver.show(viewAt(step, i));
        const prior = a.driver.play(eventAt(step, i), viewAt(step, i), options({ reducedMotion: true }));
        await vi.advanceTimersByTimeAsync(5000);
        await prior;
      }
      a.driver.show(viewAt(step, k));
      const p = a.driver.play(event, viewAt(step, k), options({ reducedMotion: true }));
      await vi.advanceTimersByTimeAsync(5000);
      await p;
      const b = mount();
      b.driver.show(viewAt(step, k + 1));
      // A request's own table event lands with it (duration 0), so the figure is compared once that has played too.
      if (event.type !== 'message' || k === eventsOf(step).length - 1 || eventAt(step, k + 1).type !== 'table') {
        expect(looks(a.root), event.id).toBe(looks(b.root));
        count++;
      }
      document.body.innerHTML = '';
    }
  }
  expect(count).toBe(1 + 2 + 8 + 5 + 5);
}, 20000);

test('P8: at full motion each step, played to its end, looks as a fresh show of its end does', async () => {
  for (const step of [1, 3, 4, 5]) {
    const a = mount();
    a.driver.show(viewAt(step, 0));
    for (const [k, event] of eventsOf(step).entries()) {
      const p = a.driver.play(event, viewAt(step, k), options());
      await vi.advanceTimersByTimeAsync(6000);
      await p;
    }
    const b = mount();
    b.driver.show(viewAt(step));
    expect(looks(a.root), `step ${step}`).toBe(looks(b.root));
    document.body.innerHTML = '';
  }
});

test('P9: a tag the figure lacks plays nothing and resolves; its duration is still the route’s', async () => {
  const { root, driver } = mount();
  const before = viewAt(1, 0);
  driver.show(before);
  const drawn = looks(root);
  const reply = tweak(eventAt(1, 0), { tag: 'REPLY' });
  expect(poolDriver.duration(reply, data)).toBe(2950);
  const p = driver.play(reply, before, options());
  await vi.advanceTimersByTimeAsync(10);
  await p;
  expect(looks(root)).toBe(drawn);
});
