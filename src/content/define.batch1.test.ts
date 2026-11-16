import { expect, test } from 'vitest';
import { batch1Fixtures } from './batch1-fixtures';
import { checkStructure } from './define';
import type { Cue, Lesson, MessageEvent, SceneEvent } from './schema';

// D11 / B13's validator rules (prototypes/d11-cases.md, attack cases 8 and 9; H2), with the real figure parts.

type Name = keyof typeof batch1Fixtures;
const issues = (name: Name, mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = batch1Fixtures[name]();
  mutate(lesson);
  return checkStructure(lesson);
};
const unit = (l: Lesson) => l.units[0]!;
const events = (l: Lesson): SceneEvent[] => unit(l).steps.flatMap((s) => s.events);
const event = (l: Lesson, id: string) => events(l).find((e) => e.id === id) as MessageEvent;

test.each(['arp', 'ports', 'nat'] as const)('the %s fixture passes the structural check with the real figure parts', (name) => {
  expect(issues(name)).toEqual([]);
});

test('`show phone` in a start passes, with `hide resolver` on either side of it', () => {
  expect(issues('nat', (l) => (unit(l).scene.start = [{ cue: 'show', arg: 'phone' }, { cue: 'hide', arg: 'resolver' }]))).toEqual([]);
  expect(issues('nat', (l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'resolver' }, { cue: 'show', arg: 'phone' }]))).toEqual([]);
});

const lessonModules = import.meta.glob<Lesson>(['./lessons/*.ts', '!./lessons/*.test.ts'], { import: 'default', eager: true });

test('every lesson of the site still validates, DHCP’s phone messages with no start and the OSI Model’s server messages included', () => {
  const lessons = Object.values(lessonModules);
  expect(lessons.map((l) => l.slug)).toEqual(expect.arrayContaining(['dhcp', 'osi-model', 'router', 'what-is-ip']));
  for (const lesson of lessons) expect(checkStructure(lesson), lesson.slug).toEqual([]);
  // The two the rules would catch without a figure scope: DHCP names the phone as a place, the OSI Model sends to the server.
  const json = (slug: string) => JSON.stringify(Object.values(lessonModules).find((l) => l.slug === slug)!.units);
  expect(json('dhcp')).toMatch(/"place":"phone"/);
  expect(json('osi-model')).toMatch(/"(to|from)":"server"/);
});

test('`show phone` on an event’s cues fails once: only a scene’s start shows a part', () => {
  const found = issues('nat', (l) => ((event(l, 's3-out').cues ??= []).push({ cue: 'show', arg: 'phone' })));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('cue "show" is for a start (a scene\'s or a step\'s)');
});

test('`show resolver` and `hide phone` in a start each fail once, naming the one part the cue takes', () => {
  const show = issues('nat', (l) => (unit(l).scene.start = [{ cue: 'show', arg: 'resolver' }, { cue: 'show', arg: 'phone' }]));
  expect(show).toHaveLength(1);
  expect(show[0]).toContain('cue "show" takes "phone", "proxy" or "reverse", not "resolver"');
  const hide = issues('ports', (l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'phone' }]));
  expect(hide).toHaveLength(1);
  expect(hide[0]).toContain('cue "hide" takes "resolver", "proxy" or "direct", not "phone"');
});

test('`show` with no arg fails once', () => {
  const found = issues('nat', (l) => (unit(l).scene.start = [{ cue: 'show' } as Cue, { cue: 'show', arg: 'phone' }]));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('cue "show" needs an arg');
});

test('NAT without `show phone` in its start: one issue for each phone message (steps 3 and 4)', () => {
  const found = issues('nat', (l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'resolver' }]));
  const phoneEvents = events(batch1Fixtures.nat()).filter((e) => e.type === 'message' && (e.from === 'phone' || e.to === 'phone'));
  expect(phoneEvents.map((e) => e.id)).toEqual(['s3-out', 's4-phone']);
  expect(found).toHaveLength(2);
  expect(found.join('\n')).toContain('does not show (cue "show phone")');
});

test('a message to or from the stranger needs the layer nat:stranger; to or from the server, ports:server', () => {
  const nat = issues('nat', (l) => (unit(l).scene.layers = ['tcp:web']));
  expect(nat).toHaveLength(1);
  expect(nat[0]).toContain('needs the layer "nat:stranger"');
  const ports = issues('ports', (l) => (unit(l).scene.layers = ['ip:web']));
  const messages = events(batch1Fixtures.ports()).filter((e) => e.type === 'message');
  expect(ports).toHaveLength(messages.length);
  expect(ports[0]).toContain('needs the layer "ports:server"');
});

test('the message rules apply to the network map alone', () => {
  // A phone and a server in another figure are the other figure's places (DHCP's phone, the OSI Model's server).
  const lesson = batch1Fixtures.nat();
  lesson.figure = 'dhcp';
  const found = checkStructure(lesson).join('\n');
  expect(found).not.toContain('does not show (cue "show phone")');
  expect(found).not.toContain('needs the layer');
});
