import { expect, test } from 'vitest';
import { checkStructure } from './define';
import type { Lesson, MessageEvent } from './schema';
import { switchFixture } from './batch3-fixtures';

// D13b: the switch figure's parts and validator rules (prototypes/d13-switch.md §5), with the real figure parts.

const issues = (mutate: (l: Lesson) => void): string => {
  const lesson = switchFixture();
  mutate(lesson);
  return checkStructure(lesson).join('\n');
};
const event = (l: Lesson, id: string): MessageEvent => l.units[0]!.steps.flatMap((s) => s.events).find((e) => e.id === id) as MessageEvent;

test('the spec’s Switch unit passes the structural check', () => {
  expect(checkStructure(switchFixture())).toEqual([]);
});

test('a frame rides between two devices or to all, never from all and never to itself', () => {
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { from: 'all' }))).toContain('rides from "all" to "laptop", a way the switch figure does not have');
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { to: 'printer' }))).toContain('rides from "printer" to "printer"');
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { to: 'phone' }))).toContain('is sent to "phone", which the switch figure does not have');
});

test('a broadcast is sent to all, and a frame to all is a broadcast', () => {
  expect(issues((l) => Object.assign(event(l, 's4-frame'), { to: 'tv' }))).toContain('is a broadcast, so it is sent to "all"');
  expect(issues((l) => Object.assign(event(l, 's1-frame'), { to: 'all', cues: [] }))).toContain('is sent to "all", so its kind is "broadcast"');
});

test('`flood` is a flag for a frame to one device; a broadcast floods by itself', () => {
  expect(issues((l) => (event(l, 's4-frame').cues = [{ cue: 'flood' }]))).toContain('is a broadcast, which floods by itself; leave out "flood"');
  expect(issues((l) => (event(l, 's1-frame').cues = [{ cue: 'flood', arg: 'x' }]))).toContain('cue "flood" is a flag and takes no arg');
});

test('`plug` takes only "laptop 5", and only on a message', () => {
  expect(issues((l) => (event(l, 's5-frame').cues = [{ cue: 'plug', arg: 'tv 5' }]))).toContain('cue "plug" takes "laptop 5", not "tv 5"');
  expect(issues((l) => (event(l, 's5-frame').cues = [{ cue: 'plug' }]))).toContain('cue "plug" needs an arg');
  expect(
    issues((l) =>
      l.units[0]!.steps[1]!.events.push({ type: 'note', id: 's2-note', log: { time: '—', source: '—', destination: '—', protocol: '—', info: 'i', size: '—' }, plain: 'p', cues: [{ cue: 'plug', arg: 'laptop 5' }] }),
    ),
  ).toContain('cue "plug" is for a message; a note sends no frame');
});

test('the switch figure takes no start', () => {
  expect(issues((l) => (l.units[0]!.scene.start = [{ cue: 'flood' }]))).toContain('the scene has a start, but the switch figure takes none');
});
