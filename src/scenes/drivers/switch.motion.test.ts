// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawSwitch } from '../../art/scenes/switch';
import { batch3Fixtures } from '../../content/batch3-fixtures';
import type { Lesson, SceneEvent } from '../../content/schema';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { showSweep } from '../../test/show-sweep';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { DRIVERS } from './index';
import { switchDriver } from './switch';

// D13b / B15b (prototypes/d13-switch-cases.md): the driver's motion, case by case, and every way a play can stop.
// Timers and animation frames are fake, so a play is advanced to the millisecond.

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
});
afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

const lesson: Lesson = batch3Fixtures.switch();
const unit = lesson.units[0]!;

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawSwitch().svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="switch"]')!;
  return { root, driver: switchDriver.create(root, drawSwitch().data) };
}
const viewAt = (step: number, played?: number): SceneView => {
  const position = positionOf(lesson, 0, 'step', step);
  return sceneViewOf(unit, deriveState(lesson, position, played ?? stepEvents(lesson, position).length));
};
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: false, signal: new AbortController().signal, ...o });
const frameOf = (step: number): SceneEvent => stepEvents(lesson, positionOf(lesson, 0, 'step', step))[0]!;
/** The figure as it looks: markup, with each inline style written the one way, and an empty style left out. */
function looks(root: SVGSVGElement): string {
  const copy = root.cloneNode(true) as SVGSVGElement;
  for (const el of copy.querySelectorAll<SVGElement>('[style]')) {
    if (el.style.cssText === '') el.removeAttribute('style');
    else el.setAttribute('style', el.style.cssText);
  }
  return copy.outerHTML;
}
const $ = (root: Element, id: string) => root.querySelector<SVGElement>(`#${id}`)!;
const shownTags = (root: Element) => [...root.querySelectorAll<SVGElement>('.sw-tag')].filter((t) => t.style.opacity === '1').map((t) => t.id.replace('sw-tag-', '')).sort();
const trace = (root: Element, key: string) => $(root, `sw-trace-${key}`).getAttribute('data-on');
const lit = (root: Element) => [1, 2, 3, 4, 5].filter((n) => $(root, `sw-led-${n}`).classList.contains('on'));
const verdict = (root: Element, d: string) => $(root, `sw-v-${d}`).getAttribute('data-v');

/** Plays `event` on a figure showing the view before it, to `ms`, and gives back the play's promise. */
function start(step: number, ms: number, o: Partial<PlayOptions> = {}) {
  const { root, driver } = mount();
  const before = viewAt(step, 0);
  driver.show(before);
  let done = false;
  const p = driver.play(frameOf(step), before, options(o)).then(() => (done = true));
  return { root, driver, before, p, done: () => done, advance: (to: number) => vi.advanceTimersByTimeAsync(to) };
}

test('DRIVERS has the Switch driver', () => {
  expect(DRIVERS.switch).toBe(switchDriver);
});

// ---- check 12: durations

test('12: 2,950 ms for a frame, 4,150 with a re-plug, 900 for each MAC table event, 0 for another table', () => {
  const { data } = drawSwitch();
  for (const step of [1, 3, 4]) expect(switchDriver.duration(frameOf(step), data), `step ${step}`).toBe(2950);
  expect(switchDriver.duration(frameOf(5), data)).toBe(4150);
  for (const step of [1, 2, 3, 4, 5]) {
    for (const e of stepEvents(lesson, positionOf(lesson, 0, 'step', step))) {
      if (e.type === 'table') expect(switchDriver.duration(e, data), e.id).toBe(900);
    }
  }
  const other = { ...stepEvents(lesson, positionOf(lesson, 0, 'step', 2))[0]!, table: 'other' } as SceneEvent;
  expect(switchDriver.duration(other, data)).toBe(0);
});

test('12: at speed 2 a full-motion frame resolves by 1,475 ms and not before 1,300', async () => {
  const s = start(1, 0, { speed: 2 });
  await s.advance(1300);
  expect(s.done()).toBe(false);
  await s.advance(175);
  await s.p;
  expect(s.done()).toBe(true);
});

test('12: a flood adds no time; a play resolves at its length and not a tick before', async () => {
  const s = start(1, 0);
  await s.advance(2740);
  expect(s.done()).toBe(false);
  await s.advance(250);
  await s.p;
  expect(s.done()).toBe(true);
});

test('12, reduced motion: the tweens jump and the waits stay (step 1 resolves at 951 ms, not by 949)', async () => {
  const s = start(1, 0, { reducedMotion: true });
  await s.advance(499);
  expect(shownTags(s.root)).toEqual([]);
  await s.advance(2);
  // The look-up is over: the three copies are at their devices and every verdict is set.
  expect([verdict(s.root, 'router'), verdict(s.root, 'laptop'), verdict(s.root, 'tv'), verdict(s.root, 'printer')]).toEqual(['ignores', 'sent', 'ignores', 'keeps']);
  await s.advance(448);
  expect(s.done()).toBe(false);
  await s.advance(2);
  await s.p;
  expect(s.done()).toBe(true);
});

test('12, reduced motion: step 5 has the laptop on port 5 at once, with no ghost', async () => {
  const s = start(5, 0, { reducedMotion: true });
  await s.advance(1);
  expect(s.root.querySelector('[data-ghost]')).toBeNull();
  expect($(s.root, 'sw-cable-laptop-5').getAttribute('display')).toBeNull();
  expect($(s.root, 'sw-plug-laptop-5').getAttribute('display')).toBeNull();
  expect($(s.root, 'sw-port-laptop').textContent).toBe('PORT 5');
});

// ---- in flight (full motion)

test('step 1 in flight: one FRAME rides in; nothing at the look-up; three COPY tags ride out at once, never to port 5 or the sender', async () => {
  const s = start(1, 0);
  await s.advance(10);
  expect(shownTags(s.root)).toEqual(['frame']);
  expect(verdict(s.root, 'laptop')).toBe('sent');
  await s.advance(440);
  expect(trace(s.root, 'laptop-2')).toBe('ride');
  expect(lit(s.root)).toEqual([]);
  await s.advance(650); // 1,100
  expect(shownTags(s.root)).toEqual([]);
  expect(trace(s.root, 'laptop-2')).toBe('trace');
  expect(lit(s.root)).toEqual([2]);
  await s.advance(750); // 1,850
  expect(shownTags(s.root)).toEqual(['copy-1', 'copy-2', 'copy-3']);
  expect([trace(s.root, 'router-1'), trace(s.root, 'tv-3'), trace(s.root, 'printer-4')]).toEqual(['ride', 'ride', 'ride']);
  expect(trace(s.root, 'laptop-5')).toBeNull();
  expect(trace(s.root, 'laptop-2')).toBe('trace');
  expect(lit(s.root)).toEqual([1, 2, 3, 4]);
  expect([verdict(s.root, 'router'), verdict(s.root, 'tv'), verdict(s.root, 'printer')]).toEqual([null, null, null]);
  await s.advance(550); // 2,400
  expect([verdict(s.root, 'router'), verdict(s.root, 'laptop'), verdict(s.root, 'tv'), verdict(s.root, 'printer')]).toEqual(['ignores', 'sent', 'ignores', 'keeps']);
  await s.advance(550); // 2,950
  await s.p;
  expect(shownTags(s.root)).toEqual([]);
});

test('step 3 in flight: the one FRAME goes out to the laptop; the router’s and the TV’s cables stay plain', async () => {
  const s = start(3, 0);
  await s.advance(1850);
  expect(shownTags(s.root)).toEqual(['frame']);
  expect(trace(s.root, 'laptop-2')).toBe('ride');
  expect(trace(s.root, 'router-1')).toBeNull();
  expect(trace(s.root, 'tv-3')).toBeNull();
  expect(lit(s.root)).toEqual([2, 4]);
});

test('step 4 in flight: a broadcast’s copies are TO ALL, not COPY', async () => {
  const s = start(4, 0);
  await s.advance(1850);
  expect(shownTags(s.root)).toEqual(['to-all-1', 'to-all-2', 'to-all-3']);
  expect([trace(s.root, 'laptop-2'), trace(s.root, 'tv-3'), trace(s.root, 'printer-4')]).toEqual(['ride', 'ride', 'ride']);
  expect(trace(s.root, 'router-1')).toBe('trace');
});

test('step 5 in flight: the cable crossfades first, the chip turns PORT 5 after, and the frame rides in at port 5', async () => {
  const s = start(5, 0);
  await s.advance(600);
  expect($(s.root, 'sw-cable-laptop-2').hasAttribute('data-ghost')).toBe(true);
  expect($(s.root, 'sw-cable-laptop-5').getAttribute('display')).toBeNull();
  expect($(s.root, 'sw-port-laptop').textContent).toBe('PORT 2');
  expect(shownTags(s.root)).toEqual([]);
  await s.advance(650); // 1,250
  expect($(s.root, 'sw-cable-laptop-2').getAttribute('display')).toBe('none');
  expect($(s.root, 'sw-plug-laptop-2').getAttribute('display')).toBe('none');
  expect($(s.root, 'sw-port-laptop').textContent).toBe('PORT 5');
  expect($(s.root, 'sw-port-laptop').classList.contains('moved')).toBe(true);
  expect(lit(s.root)).toEqual([5]);
  expect(trace(s.root, 'laptop-5')).toBe('ride');
  await s.advance(2350); // 3,600
  expect(verdict(s.root, 'router')).toBe('keeps');
  await s.advance(550);
  await s.p;
  expect(s.done()).toBe(true);
});

// ---- 11: play against show

test('11a: for every event, show(before) then a reduced-motion play looks as a fresh show(after) does', async () => {
  const events: { step: number; k: number; event: SceneEvent }[] = [];
  for (const step of [1, 2, 3, 4, 5]) stepEvents(lesson, positionOf(lesson, 0, 'step', step)).forEach((event, k) => events.push({ step, k, event }));
  expect(events).toHaveLength(11);
  for (const { step, k, event } of events) {
    const a = mount();
    a.driver.show(viewAt(step, 0));
    // Earlier events of the step first, as the console plays them.
    for (let i = 0; i < k; i++) {
      const prior = stepEvents(lesson, positionOf(lesson, 0, 'step', step))[i]!;
      const p = a.driver.play(prior, viewAt(step, i), options({ reducedMotion: true }));
      await vi.advanceTimersByTimeAsync(5000);
      await p;
    }
    const p = a.driver.play(event, viewAt(step, k), options({ reducedMotion: true }));
    await vi.advanceTimersByTimeAsync(5000);
    await p;
    const b = mount();
    b.driver.show(viewAt(step, k + 1));
    expect(looks(a.root), event.id).toBe(looks(b.root));
    document.body.innerHTML = '';
  }
});

test('11b: the same at full motion', async () => {
  for (const step of [1, 3, 4, 5]) {
    const s = start(step, 0);
    await s.advance(5000);
    await s.p;
    const b = mount();
    b.driver.show(viewAt(step, 1));
    expect(looks(s.root), `step ${step}`).toBe(looks(b.root));
    document.body.innerHTML = '';
  }
});

test('11c: the show sweep passes on the fixture, and it counts its moments', () => {
  vi.useRealTimers();
  expect(showSweep(lesson)).toBe(8 + 11);
});

test('11d: show at the Overview and at step 1 before its first event is the figure as it was drawn', () => {
  const { root, driver } = mount();
  const drawn = looks(root);
  driver.show(sceneViewOf(unit, deriveState(lesson, positionOf(lesson, 0, 'overview'), 0)));
  expect(looks(root)).toBe(drawn);
  driver.show(viewAt(1, 0));
  expect(looks(root)).toBe(drawn);
});

// ---- 10b, 10c

test('10b: from step 5 back to step 4 the cable, plug and chip are all back at port 2, the chip without `moved`', () => {
  const { root, driver } = mount();
  driver.show(viewAt(5));
  driver.show(viewAt(4));
  for (const id of ['sw-cable-laptop-2', 'sw-plug-laptop-2']) expect($(root, id).hasAttribute('display'), id).toBe(false);
  for (const id of ['sw-cable-laptop-5', 'sw-plug-laptop-5']) expect($(root, id).getAttribute('display'), id).toBe('none');
  expect($(root, 'sw-port-laptop').textContent).toBe('PORT 2');
  expect([...root.querySelectorAll('.sw-port.moved')]).toHaveLength(0);
  const fresh = mount();
  fresh.driver.show(viewAt(4));
  expect(looks(root)).toBe(looks(fresh.root));
});

test('10c: Learn and Practice show the laptop on port 5, with no trace and no light', () => {
  const { root, driver } = mount();
  for (const kind of ['learn', 'practice'] as const) {
    driver.show(sceneViewOf(unit, deriveState(lesson, positionOf(lesson, 0, kind), 0)));
    expect($(root, 'sw-port-laptop').textContent).toBe('PORT 5');
    expect($(root, 'sw-cable-laptop-2').getAttribute('display')).toBe('none');
    expect($(root, 'sw-cable-laptop-5').hasAttribute('display')).toBe(false);
    expect(root.querySelectorAll('.sw-trace[data-on]')).toHaveLength(0);
    expect(lit(root)).toEqual([]);
  }
});

// ---- 14: stopped mid-play

test('14a: stopped at 450, 1,100, 1,850 or 2,400 ms of a frame, show leaves no tag, ride or verdict that a fresh show does not', async () => {
  for (const step of [1, 3, 4]) {
    for (const at of [450, 1100, 1850, 2400]) {
      const controller = new AbortController();
      const s = start(step, 0, { signal: controller.signal });
      await s.advance(at);
      controller.abort();
      await s.p;
      s.driver.show(s.before);
      const fresh = mount();
      fresh.driver.show(s.before);
      expect(looks(s.root), `step ${step} at ${at}`).toBe(looks(fresh.root));
      s.driver.show(viewAt(step));
      fresh.driver.show(viewAt(step));
      expect(looks(s.root), `step ${step} at ${at}, settled`).toBe(looks(fresh.root));
      expect(shownTags(s.root)).toEqual([]);
      document.body.innerHTML = '';
    }
  }
});

test('14b: stopped in step 5’s re-plug, the laptop still has its cable at port 2, with no fade left on it', async () => {
  const controller = new AbortController();
  const s = start(5, 0, { signal: controller.signal });
  await s.advance(500);
  controller.abort();
  await s.p;
  s.driver.show(s.before);
  const fresh = mount();
  fresh.driver.show(s.before);
  for (const id of ['sw-cable-laptop-2', 'sw-plug-laptop-2', 'sw-cable-laptop-5', 'sw-plug-laptop-5']) {
    expect($(s.root, id).style.opacity, id).toBe('');
    expect($(s.root, id).hasAttribute('data-ghost'), id).toBe(false);
  }
  expect($(s.root, 'sw-cable-laptop-2').hasAttribute('display')).toBe(false);
  expect($(s.root, 'sw-cable-laptop-5').getAttribute('display')).toBe('none');
  expect(looks(s.root)).toBe(looks(fresh.root));
  // Going back to step 4, and on to step 5's end, are each a fresh driver's.
  for (const step of [4, 5]) {
    s.driver.show(viewAt(step));
    fresh.driver.show(viewAt(step));
    expect(looks(s.root), `step ${step}`).toBe(looks(fresh.root));
  }
});

test('14b: the play of step 5 also leaves no inline fade on the laptop’s four parts once it has finished', async () => {
  const s = start(5, 0);
  await s.advance(5000);
  await s.p;
  for (const id of ['sw-cable-laptop-2', 'sw-plug-laptop-2', 'sw-cable-laptop-5', 'sw-plug-laptop-5']) expect($(s.root, id).style.opacity, id).toBe('');
});

// ---- 17b: the drawing stays out of the page

test('17b: the driver imports the drawing as a type only, and nothing from common.ts', () => {
  const source: string = readFileSync('src/scenes/drivers/switch.ts', 'utf8');
  const imports = source.split('\n').filter((l) => l.startsWith('import '));
  expect(imports.find((l) => l.includes('art/scenes/switch\''))).toMatch(/^import type /);
  expect(imports.some((l) => l.includes('common'))).toBe(false);
  expect(imports.some((l) => l.includes('SWITCH_DESCRIPTION'))).toBe(false);
});

// ---- check 2, the throw

test('2: a driver made on a figure missing any one of its parts throws, naming the part', () => {
  const { svg, data } = drawSwitch();
  const ids = [...svg.matchAll(/id="(sw-[^"]+)"/g)].map((m) => m[1]!);
  const needed = ids;
  const quiet: string[] = [];
  for (const id of needed) {
    const host = document.createElement('div');
    host.innerHTML = svg.replace(new RegExp(` id="${id}"`), '');
    const root = host.querySelector<SVGSVGElement>('svg')!;
    try {
      switchDriver.create(root, data);
      quiet.push(id);
    } catch (e) {
      expect((e as Error).message).toContain(`#${id}`);
    }
  }
  // Every part the driver reaches for is looked up when it is made, bar the laptop's cable and plug at ports 2 and 5
  // (found as each play needs them) and the two groups the driver never names.
  expect(quiet.sort()).toEqual(['sw-cable-laptop-2', 'sw-cable-laptop-5', 'sw-plug-laptop-2', 'sw-plug-laptop-5', 'sw-tags', 'sw-traces']);
});

// ---- direction: a frame rides in from its device to the port, and out from the port to the receiver

const pointOf = (el: Element): [number, number] => {
  const m = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(el.getAttribute('transform') ?? '')!;
  return [Number(m[1]), Number(m[2])];
};
const firstPoint = (el: Element): [number, number] => {
  const [x, y] = el.getAttribute('points')!.split(' ')[0]!.split(',').map(Number);
  return [x!, y!];
};
const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

test('a tag rides in from the sender’s device to its port, and out from the port to the receiver; the trace grows from the same end', async () => {
  const { cables } = drawSwitch().data as { cables: Record<string, [number, number][]> };
  const [laptopEnd, laptopPort] = [cables['laptop:2']![0]!, cables['laptop:2']!.at(-1)!];
  const [printerEnd, printerPort] = [cables['printer:4']![0]!, cables['printer:4']!.at(-1)!];
  // Step 3: the printer sends, the laptop receives. In: printer device to printer port. Out: laptop port to laptop.
  const s = start(3, 0);
  await s.advance(100);
  const tag = $(s.root, 'sw-tag-frame');
  expect(dist(pointOf(tag), printerEnd)).toBeLessThan(dist(pointOf(tag), printerPort));
  expect(dist(firstPoint($(s.root, 'sw-trace-printer-4')), printerEnd)).toBeLessThan(1);
  await s.advance(800);
  expect(dist(pointOf(tag), printerPort)).toBeLessThan(dist(pointOf(tag), printerEnd));
  await s.advance(550); // 1,450: just out of the switch
  expect(dist(pointOf(tag), laptopPort)).toBeLessThan(dist(pointOf(tag), laptopEnd));
  expect(dist(firstPoint($(s.root, 'sw-trace-laptop-2')), laptopPort)).toBeLessThan(1);
  await s.advance(750); // 2,200: nearly there
  expect(dist(pointOf(tag), laptopEnd)).toBeLessThan(dist(pointOf(tag), laptopPort));
  await s.advance(1000);
  await s.p;
});
