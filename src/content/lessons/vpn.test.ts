import { expect, test } from 'vitest';
import { checkStructure } from '../define';
import type { MessageEvent, SceneEvent, TableEvent } from '../schema';
import { vpnSteps } from '../vpn-fixture';
import vpn from './vpn';

const unit = vpn.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const messages = events.filter((e): e is MessageEvent => e.type === 'message');
const tables = events.filter((e): e is TableEvent => e.type === 'table');

/** An event as the built fixture has it: the lesson's own events with their backing taken off. */
const bare = (e: SceneEvent): SceneEvent => {
  const { backing: _backing, ...rest } = e as SceneEvent & { backing?: unknown };
  return rest as SceneEvent;
};

test('VPN validates on the net-map figure, with 5 steps and 2 questions', () => {
  expect(checkStructure(vpn)).toEqual([]);
  expect(vpn.figure).toBe('net-map');
  expect(unit.osi).toBe('spans');
  expect(unit.steps.map((s) => s.title)).toEqual(['Plain HTTP on Café Wi-Fi', 'IKE: Setting Up the Tunnel', 'ESP: Wrapped and Sealed', 'Out of the Tunnel', 'HTTPS Still Matters']);
  expect(unit.practice.map((q) => q.options.length)).toEqual([3, 3]);
});

test('the events are the built fixture’s, each step’s in order, with backing added', () => {
  expect(unit.steps.map((s) => s.events.map(bare))).toEqual(vpnSteps.map((s) => s.events));
  expect(messages.length).toBe(14);
  expect(tables.length).toBe(6);
});

test('the scene is the fixture’s: the café, the VPN server, example.net and the who-reads table', () => {
  const scene = unit.scene;
  expect(scene.title).toBe('Sealed from your laptop to the VPN server');
  expect(scene.views).toEqual(['network']);
  expect(scene.layers).toEqual(['vpn:vpn', 'vpn:web']);
  expect(scene.labels).toEqual({ laptop: 'On the café’s Wi-Fi', url: 'example.net' });
  expect(scene.start).toEqual([{ cue: 'hide', arg: 'resolver' }, { cue: 'show', arg: 'cafe' }]);
  expect(scene.panel?.type).toBe('table');
  if (scene.panel?.type !== 'table') return;
  expect(scene.panel.table.id).toBe('who-reads');
  expect(scene.panel.table.keyColumn).toBe('who');
  expect(scene.panel.table.markLabel).toBe('readable');
});

// Case 22 (H9): the wrong routes pass the validator and the driver, so the lesson's own shape is checked here.
test('case 22: every message touching web has vpn-out (or, in step 1 only, the laptop) at its other end', () => {
  unit.steps.forEach((step, i) => {
    for (const m of step.events.filter((e): e is MessageEvent => e.type === 'message')) {
      if (m.from === 'web') expect(i === 0 ? ['laptop'] : ['vpn-out']).toContain(m.to);
      if (m.to === 'web') expect(i === 0 ? ['laptop'] : ['vpn-out']).toContain(m.from);
    }
  });
});

test('case 22: every message touching vpn has the laptop at its other end', () => {
  for (const m of messages) {
    if (m.from === 'vpn') expect(m.to).toBe('laptop');
    if (m.to === 'vpn') expect(m.from).toBe('laptop');
  }
});

test('case 22: no addr cue, no laptopAddr label, and every conn is open or seal laptop>vpn tunnel', () => {
  expect(Object.keys(unit.scene.labels)).not.toContain('laptopAddr');
  const cues = [...unit.scene.start, ...events.flatMap((e) => ('cues' in e ? (e.cues ?? []) : []))];
  expect(cues.filter((c) => c.cue === 'addr')).toEqual([]);
  for (const c of cues.filter((c) => c.cue === 'conn')) expect(c.arg).toMatch(/^(open|seal) laptop>vpn tunnel$/);
  expect(cues.filter((c) => c.cue === 'conn').length).toBe(2);
});

test('the padlock lights once, on step 5’s last event, and never for the VPN', () => {
  const lock = events.filter((e) => 'cues' in e && e.cues?.some((c) => c.cue === 'lock'));
  expect(lock.map((e) => e.id)).toEqual(['s5-esp-back']);
});

test('the VPN server is 203.0.113.40 and the laptop’s VPN address 203.0.113.41; no size or time is a fact', () => {
  expect(JSON.stringify(vpn)).not.toMatch(/203\.0\.113\.(30|31)\b/);
  for (const m of messages) {
    expect(m.log.time).toBe('—');
    expect(m.log.size).toBe('—');
    if (m.from === 'laptop' && m.to === 'vpn') expect(m.log.destination).toMatch(/^203\.0\.113\.40:(500|4500)$/);
    if (m.from === 'vpn-out') expect(m.log.source).toMatch(/^203\.0\.113\.41:/);
  }
});

test('the lesson never says anonymous, proxy or access point', () => {
  // The words a reader sees, not the citations (one source's title may hold a word).
  const words = JSON.stringify(vpn, (key, value) => (key === 'cite' || key === 'references' ? undefined : value));
  expect(words).not.toMatch(/anonym|proxy|access point/i);
});
