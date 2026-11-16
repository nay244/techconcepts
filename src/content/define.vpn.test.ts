import { expect, test } from 'vitest';
import { parseConn } from '../scenes/drivers/net-map';
import { batch1Fixtures } from './batch1-fixtures';
import { checkStructure } from './define';
import type { Cue, Lesson, MessageEvent, SceneEvent } from './schema';
import { vpnFixture } from './vpn-fixture';

// D15b / B18b (prototypes/d15-vpn-cases.md, 9a to 9f and 22, with E14 to E16 and E22), against the real figure parts,
// the VPN fixture (src/content/vpn-fixture.ts) and the Ports fixture with the café shown.

const unit = (l: Lesson) => l.units[0]!;
const events = (l: Lesson): SceneEvent[] => unit(l).steps.flatMap((s) => s.events);
const messages = (l: Lesson): MessageEvent[] => events(l).filter((e): e is MessageEvent => e.type === 'message');
const vpn = (mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = vpnFixture();
  mutate(lesson);
  return checkStructure(lesson);
};
/** Ports, with the café shown (the one fixture the café has no layers of its own in). */
const ports = (mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = batch1Fixtures.ports();
  unit(lesson).scene.start = [...unit(lesson).scene.start, { cue: 'show', arg: 'cafe' }];
  mutate(lesson);
  return checkStructure(lesson);
};
const portsPlain = (mutate: (l: Lesson) => void): string[] => {
  const lesson = batch1Fixtures.ports();
  mutate(lesson);
  return checkStructure(lesson);
};
const firstMessage = (l: Lesson): MessageEvent => messages(l)[0]!;
const addCue = (e: MessageEvent, cue: Cue): void => void (e.cues ??= []).push(cue);

test('9a: the fixture, Ports with the café, a parked tag elsewhere, an outside listener and the tunnel’s own cues all pass', () => {
  expect(vpn()).toEqual([]);
  expect(ports()).toEqual([]);
  expect(
    vpn((l) => {
      firstMessage(l).tag = 'GET';
      addCue(firstMessage(l), { cue: 'park', arg: 'web 1 GET' });
    }),
  ).toEqual([]);
  expect(ports((l) => addCue(firstMessage(l), { cue: 'listener', arg: 'outside' }))).toEqual([]);
  expect(vpn((l) => addCue(firstMessage(l), { cue: 'conn', arg: 'open laptop>vpn tunnel' }))).toEqual([]);
  expect(vpn((l) => addCue(firstMessage(l), { cue: 'conn', arg: 'seal laptop>vpn tunnel' }))).toEqual([]);
});

test('9a: FTP’s second line, a conn with data, is still accepted', () => {
  const found = import.meta.glob<Lesson>('./lessons/what-is-ftp.ts', { import: 'default', eager: true });
  const ftp = Object.values(found)[0]!;
  expect(JSON.stringify(ftp.units)).toMatch(/"conn","arg":"open laptop>files data"/);
  expect(checkStructure(ftp)).toEqual([]);
});

test('9b: `show cafe` with `show phone` is refused once', () => {
  const found = vpn((l) => unit(l).scene.start.push({ cue: 'show', arg: 'phone' }));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('cues "show cafe" and "show phone" cannot go together');
});

test('9b: `listener reads` without the café is refused once', () => {
  const found = portsPlain((l) => addCue(firstMessage(l), { cue: 'listener', arg: 'reads' }));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('cue "listener" needs the café');
});

test('9b: `listener sees` with the café is refused once, naming sees and what it takes', () => {
  const found = ports((l) => addCue(firstMessage(l), { cue: 'listener', arg: 'sees' }));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('"reads" or "outside", not "sees"');
});

test('9b: `park laptop 1 X` with the café is refused once, saying where the laptop’s column lies', () => {
  const found = vpn((l) => addCue(messages(l)[3]!, { cue: 'park', arg: 'laptop 1 IKE_SA_INIT' }));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain("the laptop's column lies where the café's listener does");
});

test('9b: `hide home` in a start is refused once, and `show cafe` on an event is refused once', () => {
  const hide = ports((l) => unit(l).scene.start.push({ cue: 'hide', arg: 'home' }));
  expect(hide).toHaveLength(1);
  expect(hide[0]).toContain('"home"');
  const show = ports((l) => addCue(firstMessage(l), { cue: 'show', arg: 'cafe' }));
  expect(show).toHaveLength(1);
  expect(show[0]).toContain('cue "show" is for a start');
});

test.each([
  'open laptop>vpn data tunnel',
  'open laptop>vpn tunnel data',
  'open laptop>vpn  tunnel',
  'zzz',
  'conn zzz',
])('9c (E14): the conn argument "%s" is refused, once, by the grammar both the driver and the validator read', (arg) => {
  const found = vpn((l) => addCue(firstMessage(l), { cue: 'conn', arg }));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain(`cue "conn ${arg}"`);
  expect(found[0]).toContain('<open|seal|close> <from>>[<via>>]<to>[ data| tunnel]');
  expect(() => parseConn(arg)).toThrow();
});

test('9c (E14): `tunnel` and `data` are each accepted by both readers', () => {
  expect(parseConn('open laptop>vpn tunnel')).toEqual({ action: 'open', from: 'laptop', to: 'vpn', data: false, tunnel: true });
  expect(parseConn('open laptop>files data')).toEqual({ action: 'open', from: 'laptop', to: 'files', data: true, tunnel: false });
});

test('9d (E15): `show cafe` in a step’s start is refused, with its own message', () => {
  const found = vpn((l) => (unit(l).steps[1]!.start = [{ cue: 'show', arg: 'cafe' }]));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('step "step-2"');
  expect(found[0]).toContain("the café is a unit's start");
});

test('9e (E15): the café with the phone, in a unit whose three steps each carry a start, is one issue', () => {
  const found = vpn((l) => {
    unit(l).scene.start.push({ cue: 'show', arg: 'phone' });
    for (const i of [1, 2, 3]) unit(l).steps[i]!.start = [{ cue: 'fresh' }];
  });
  expect(found.filter((i) => i.includes('cannot go together'))).toHaveLength(1);
  expect(found).toHaveLength(1);
});

test('9f (E16): a `router` label with the café is refused once; without the café it passes', () => {
  const found = ports((l) => (unit(l).scene.labels.router = '198.51.100.23 outside'));
  expect(found).toHaveLength(1);
  expect(found[0]).toContain('"router"');
  expect(portsPlain((l) => (unit(l).scene.labels.router = '198.51.100.23 outside'))).toEqual([]);
});

test('22 (E22): the fixture’s messages keep to the routes the spec draws, with no address cue and one kind of conn', () => {
  const lesson = vpnFixture();
  const all = messages(lesson);
  expect(all).toHaveLength(14);
  for (const m of all) {
    if (m.from === 'web' || m.to === 'web') {
      const other = m.from === 'web' ? m.to : m.from;
      // The plain leg: only the server's own out site, and the laptop in step 1.
      expect(['vpn-out', 'laptop'], m.id).toContain(other);
      if (other === 'laptop') expect(m.id.startsWith('s1-'), m.id).toBe(true);
    }
    if (m.from === 'vpn' || m.to === 'vpn') expect(m.from === 'laptop' || m.to === 'laptop', m.id).toBe(true);
  }
  const cues = events(lesson).flatMap((e) => (e.type === 'table' ? [] : (e.cues ?? [])));
  expect(cues.some((c) => c.cue === 'addr')).toBe(false);
  expect(Object.hasOwn(unit(lesson).scene.labels, 'laptopAddr')).toBe(false);
  const conns = cues.filter((c) => c.cue === 'conn').map((c) => c.arg);
  expect(conns).toEqual(['open laptop>vpn tunnel', 'seal laptop>vpn tunnel']);
});
