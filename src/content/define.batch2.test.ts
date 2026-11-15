import { expect, test } from 'vitest';
import { batch2Fixtures } from './batch2-fixtures';
import { checkStructure } from './define';
import type { Lesson, MessageEvent, SceneEvent } from './schema';
import { lessonSchema } from './schema';

// D12 / B14's validator rules (prototypes/d12-cases.md, attack cases 7 and 8; H4, H5; E3, E4), with the real figure parts.

type Name = keyof typeof batch2Fixtures;
const issues = (name: Name, mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = batch2Fixtures[name]();
  mutate(lesson);
  return checkStructure(lesson);
};
const unit = (l: Lesson) => l.units[0]!;
const events = (l: Lesson): SceneEvent[] => unit(l).steps.flatMap((s) => s.events);
const messages = (l: Lesson): MessageEvent[] => events(l).filter((e): e is MessageEvent => e.type === 'message');

const lessonModules = import.meta.glob<Lesson>(['./lessons/*.ts', '!./lessons/*.test.ts'], { import: 'default', eager: true });
const real = (slug: string): Lesson => structuredClone(Object.values(lessonModules).find((l) => l.slug === slug)!);

test.each(['ip', 'mac', 'tcp-udp'] as const)('the %s fixture passes the structural check with the real figure parts, and the lesson schema', (name) => {
  expect(issues(name)).toEqual([]);
  expect(() => lessonSchema.parse(batch2Fixtures[name]())).not.toThrow();
});

test('`frames` in a dhcp scene’s start passes, and the MAC fixture has it', () => {
  const lesson = batch2Fixtures.mac();
  expect(unit(lesson).scene.start).toEqual([{ cue: 'frames' }]);
  expect(lesson.figure).toBe('dhcp');
});

test('every lesson of the site still validates, the lessons whose web or mail server is not the first layer that draws it included', () => {
  const lessons = Object.values(lessonModules);
  for (const lesson of lessons) expect(checkStructure(lesson), lesson.slug).toEqual([]);
  // The eight H4 found the first-layer rule would break: their site is drawn by several layers, and theirs is not the first.
  for (const slug of ['nat', 'router', 'what-is-https', 'what-is-icmp', 'what-is-ip', 'what-is-tcp', 'what-is-tls', 'what-is-imap']) {
    expect(lessons.map((l) => l.slug), slug).toContain(slug);
    expect(checkStructure(real(slug)), slug).toEqual([]);
  }
});

test('a site several layers draw is on the map when any one of them is in the scene (and only then)', () => {
  // What is TCP's web server comes from tcp:web, which is not the first layer that draws `web`.
  const tcp = real('what-is-tcp');
  expect(unit(tcp).scene.layers).toEqual(['tcp:web']);
  const swapped = real('what-is-tcp');
  unit(swapped).scene.layers = ['https:web'];
  expect(checkStructure(swapped)).toEqual([]);
  const none = real('what-is-tcp');
  unit(none).scene.layers = [];
  const found = checkStructure(none);
  expect(found).toHaveLength(messages(none).filter((m) => m.from === 'web' || m.to === 'web').length);
  expect(found[0]).toContain('needs one of the layers "http:web", "https:web", "tcp:web"');
});

test('What is UDP’s call messages need udp:call, one issue each', () => {
  expect(checkStructure(real('what-is-udp'))).toEqual([]);
  const lesson = real('what-is-udp');
  unit(lesson).scene.layers = [];
  const calls = messages(lesson).filter((m) => m.from === 'call' || m.to === 'call');
  expect(calls.length).toBeGreaterThan(0);
  const found = checkStructure(lesson);
  expect(found).toHaveLength(calls.length);
  expect(found[0]).toContain('needs the layer "udp:call"');
});

test('`frames` on an event’s cues fails once: only a scene’s start sets the figure up', () => {
  const found = issues('mac', (l) => ((messages(l)[0]!.cues ??= []).push({ cue: 'frames' })));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('cue "frames" is for a scene\'s start');
});

test('`frames` in another figure’s start fails once: the subnet figure takes no start, the network map has no such cue', () => {
  const subnet = issues('ip', (l) => (unit(l).scene.start = [{ cue: 'frames' }]));
  expect(subnet).toHaveLength(1);
  expect(subnet[0]).toContain('the subnet figure takes none');
  const map = issues('tcp-udp', (l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'resolver' }, { cue: 'frames' }]));
  expect(map).toHaveLength(1);
  expect(map[0]).toContain('cue "frames" is not one the net-map figure has');
});

test('`frames` takes no arg', () => {
  const found = issues('mac', (l) => (unit(l).scene.start = [{ cue: 'frames', arg: 'on' }]));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('cue "frames" is a flag and takes no arg');
});

test('TCP/UDP without the layer tcp-udp:voice: one issue for each message to or from the voice server (VOICE 1, SAM 1, 2 and 3)', () => {
  const found = issues('tcp-udp', (l) => (unit(l).scene.layers = ['tcp:web']));
  const voice = messages(batch2Fixtures['tcp-udp']()).filter((m) => m.from === 'voice' || m.to === 'voice');
  expect(voice.map((m) => m.tag)).toEqual(['VOICE 1', 'SAM 1', 'SAM 2', 'SAM 3']);
  expect(found).toHaveLength(4);
  for (const issue of found) expect(issue).toContain('needs the layer "tcp-udp:voice"');
});

test('TCP/UDP without tcp:web fails for the web messages and not for the voice ones', () => {
  const found = issues('tcp-udp', (l) => (unit(l).scene.layers = ['tcp-udp:voice']));
  const web = messages(batch2Fixtures['tcp-udp']()).filter((m) => m.from === 'web' || m.to === 'web');
  expect(found).toHaveLength(web.length);
  expect(found.join('\n')).not.toContain('"voice"');
});

test('H5: a frame to or from the TV or the phone is refused, with the frames setup or without', () => {
  const tv = issues('mac', (l) => {
    const m = messages(l)[0]!;
    m.to = 'tv';
  });
  expect(tv).toHaveLength(1);
  expect(tv[0]).toContain('rides from "laptop" to "tv", a way the dhcp figure does not have');
  const phone = issues('mac', (l) => {
    const m = messages(l)[0]!;
    m.from = 'phone';
    m.to = 'router';
  });
  expect(phone).toHaveLength(1);
  expect(phone[0]).toContain('rides from "phone" to "router"');
  // DHCP itself: its ways are the laptop's and the router's alone, and a phone message is refused there too.
  expect(checkStructure(real('dhcp'))).toEqual([]);
  const dhcp = real('dhcp');
  const first = messages(dhcp)[0]!;
  first.from = 'phone';
  first.to = 'router';
  const found = checkStructure(dhcp);
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('rides from "phone" to "router"');
});

test('the DHCP lesson takes no `frames`, and a scene with the cue is the only one the figure sets up', () => {
  expect(unit(real('dhcp')).scene.start).toEqual([]);
});

// E2: the MAC table the driver reads.
test('E2: MAC’s table is `frames`, keyed on `mac`, with a `frame` column, four rows carrying the four drawn MAC addresses, and only the four verdict words', () => {
  const lesson = batch2Fixtures.mac();
  const panel = unit(lesson).scene.panel!;
  expect(panel.type).toBe('table');
  if (panel.type !== 'table') return;
  const def = panel.table;
  expect(def.id).toBe('frames');
  expect(def.keyColumn).toBe('mac');
  expect(def.columns.map((c) => c.key)).toEqual(['device', 'mac', 'frame']);
  expect(def.initialRows.map((r) => r.mac)).toEqual(['00:00:5E:00:53:01', '00:00:5E:00:53:10', '00:00:5E:00:53:11', '00:00:5E:00:53:12']);
  const words = ['—', 'Sent it', 'Hears it', 'Keeps it', 'Ignores it'];
  const cells = [
    ...def.initialRows.map((r) => r.frame),
    ...events(lesson).flatMap((e) => (e.type === 'table' ? [e.row?.frame, ...(e.rows ?? []).map((r) => r.frame)] : [])).filter((w) => w !== undefined),
  ];
  expect(cells.length).toBeGreaterThan(4);
  for (const cell of cells) expect(words).toContain(cell);
  expect(def.initialRows.map((r) => r.frame)).toEqual(['—', '—', '—', '—']);
});
