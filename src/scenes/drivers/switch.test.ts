// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { drawSwitch } from '../../art/scenes/switch';
import type { Lesson } from '../../content/schema';
import { switchFixture } from '../../content/switch-fixture';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { switchDriver } from './switch';

// D13b (prototypes/d13-switch.md §3 and §8): what each step leaves on the figure once it has played, and how a frame
// plays under reduced motion. The fixture is the spec's unit.

afterEach(() => {
  document.body.innerHTML = '';
});

const lesson: Lesson = switchFixture();

function mount(): { root: SVGSVGElement; driver: SceneDriver } {
  const host = document.createElement('div');
  host.innerHTML = drawSwitch().svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="switch"]')!;
  return { root, driver: switchDriver.create(root, drawSwitch().data) };
}
/** The scene at step `step` once its first `played` events have been applied; `played` absent means all of them. */
function viewAt(step: number, played?: number): SceneView {
  const position = positionOf(lesson, 0, 'step', step);
  return sceneViewOf(lesson.units[0]!, deriveState(lesson, position, played ?? stepEvents(lesson, position).length));
}
const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: true, signal: new AbortController().signal, ...o });

const $ = (root: Element, id: string) => root.querySelector(`#${id}`)!;
const verdictOf = (root: Element, d: string) => $(root, `sw-v-${d}`).getAttribute('data-v');
const traced = (root: Element) => [...root.querySelectorAll('.sw-trace[data-on]')].map((e) => e.id.replace('sw-trace-', '')).sort();
const keeping = (root: Element) => ['laptop', 'tv', 'printer', 'rt'].filter((d) => $(root, d === 'rt' ? 'sw-rt-led-1' : `sw-led-${d}`).classList.contains('on'));
const lit = (root: Element) => [1, 2, 3, 4, 5].filter((n) => $(root, `sw-led-${n}`).classList.contains('on'));

test('step 1 settled: the flood went out of ports 1, 3 and 4, not back to the laptop and not to empty port 5', () => {
  const { root, driver } = mount();
  driver.show(viewAt(1));
  expect(traced(root)).toEqual(['laptop-2', 'printer-4', 'router-1', 'tv-3']);
  expect(lit(root)).toEqual([1, 2, 3, 4]);
  expect([verdictOf(root, 'laptop'), verdictOf(root, 'printer'), verdictOf(root, 'router'), verdictOf(root, 'tv')]).toEqual(['sent', 'keeps', 'ignores', 'ignores']);
  // Only the keeper's status light is on.
  expect(keeping(root)).toEqual(['printer']);
});

test('step 2 settled: no frame; the learned row lights port 2 and the laptop’s cable, and no device has a verdict', () => {
  const { root, driver } = mount();
  driver.show(viewAt(2));
  expect(traced(root)).toEqual(['laptop-2']);
  expect(lit(root)).toEqual([2]);
  for (const d of ['router', 'laptop', 'tv', 'printer']) expect(verdictOf(root, d)).toBeNull();
});

test('step 3 settled: straight to port 2; the router and the TV get no copy, so no verdict, not “Ignores it”', () => {
  const { root, driver } = mount();
  driver.show(viewAt(3));
  expect(traced(root)).toEqual(['laptop-2', 'printer-4']);
  expect(lit(root)).toEqual([2, 4]);
  expect(verdictOf(root, 'printer')).toBe('sent');
  expect(verdictOf(root, 'laptop')).toBe('keeps');
  expect(verdictOf(root, 'router')).toBeNull();
  expect(verdictOf(root, 'tv')).toBeNull();
});

test('step 4 settled: a broadcast reaches every other device, and each keeps it', () => {
  const { root, driver } = mount();
  driver.show(viewAt(4));
  expect(traced(root)).toEqual(['laptop-2', 'printer-4', 'router-1', 'tv-3']);
  expect([verdictOf(root, 'router'), verdictOf(root, 'laptop'), verdictOf(root, 'tv'), verdictOf(root, 'printer')]).toEqual(['sent', 'keeps', 'keeps', 'keeps']);
  expect(keeping(root)).toEqual(['laptop', 'tv', 'printer']);
});

test('step 5 settled: the laptop is on port 5; its old cable is gone and its chip says PORT 5', () => {
  const { root, driver } = mount();
  driver.show(viewAt(5));
  expect($(root, 'sw-cable-laptop-2').getAttribute('display')).toBe('none');
  expect($(root, 'sw-cable-laptop-5').getAttribute('display')).toBeNull();
  expect($(root, 'sw-port-laptop').textContent).toBe('PORT 5');
  expect($(root, 'sw-port-laptop').classList.contains('moved')).toBe(true);
  expect(traced(root)).toEqual(['laptop-5', 'router-1']);
  expect(lit(root)).toEqual([1, 5]);
  // Going back a step puts the cable back in port 2.
  driver.show(viewAt(4));
  expect($(root, 'sw-cable-laptop-2').getAttribute('display')).toBeNull();
  expect($(root, 'sw-port-laptop').textContent).toBe('PORT 2');
});

test('a played frame ends where show puts it (reduced motion)', async () => {
  for (const step of [1, 3, 4, 5]) {
    const a = mount();
    const position = positionOf(lesson, 0, 'step', step);
    const event = stepEvents(lesson, position)[0]!;
    // As the panel does: show the scene before the event, then play the event on that same view.
    a.driver.show(viewAt(step, 0));
    await a.driver.play(event, viewAt(step, 0), options());
    const b = mount();
    b.driver.show(viewAt(step, 1));
    expect(traced(a.root), `step ${step}`).toEqual(traced(b.root));
    expect(lit(a.root), `step ${step}`).toEqual(lit(b.root));
    expect($(a.root, 'sw-cable-laptop-5').getAttribute('display'), `step ${step}`).toBe($(b.root, 'sw-cable-laptop-5').getAttribute('display'));
    expect($(a.root, 'sw-port-laptop').textContent, `step ${step}`).toBe($(b.root, 'sw-port-laptop').textContent);
    document.body.innerHTML = '';
  }
});

test('durations at 1×: 2.95 s for a frame, 4.15 s with a re-plug, 0.9 s for each MAC table event', () => {
  const { data } = drawSwitch();
  const at = (step: number, i: number) => stepEvents(lesson, positionOf(lesson, 0, 'step', step))[i]!;
  expect(switchDriver.duration(at(1, 0), data)).toBe(2950);
  expect(switchDriver.duration(at(5, 0), data)).toBe(4150);
  expect(switchDriver.duration(at(2, 0), data)).toBe(900);
  expect(switchDriver.duration(at(1, 1), data)).toBe(900);
});
