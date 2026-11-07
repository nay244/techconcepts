// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { drawDhcp } from '../../../art/scenes/dhcp';
import { deriveState, positionOf, stepEvents } from '../../../engine/timeline';
import { formatBytes } from '../../../lib/format';
import { lessonNumbers, misnamedLessons } from '../../../test/lesson-references';
import { showSweep } from '../../../test/show-sweep';
import { validateLesson } from '../../define';
import type { MessageEvent } from '../../schema';
import dhcp from './dhcp';

const unit = dhcp.units[0]!;
const messages = unit.steps.flatMap((s) => s.events).filter((e): e is MessageEvent => e.type === 'message');

/** The lease table once step `n` has played in full. */
function leasesAfterStep(n: number) {
  const p = positionOf(dhcp, 0, 'step', n);
  return deriveState(dhcp, p, stepEvents(dhcp, p).length).tables.leases!.rows;
}

test('DHCP validates, has 5 steps and 3 questions', () => {
  expect(() => validateLesson(dhcp)).not.toThrow();
  expect(dhcp.units).toHaveLength(1);
  expect(unit.steps).toHaveLength(5);
  expect(unit.practice).toHaveLength(3);
});

test('step titles are the technical terms, in order', () => {
  expect(unit.steps.map((s) => s.title)).toEqual(['DHCP Discover', 'DHCP Offer', 'DHCP Request', 'DHCP Acknowledge', 'Lease Renewal']);
  expect(unit.learn.pattern.names).toEqual(['Discover', 'Offer', 'Request', 'Acknowledge']);
});

test('the lease table ends with the laptop’s lease after step 4 and its renewed expiry after step 5', () => {
  const laptop = { ip: '192.168.1.100', mac: '00:00:5E:00:53:10', device: 'Laptop' };
  expect(leasesAfterStep(3)).toEqual([]);
  expect(leasesAfterStep(4)).toEqual([{ ...laptop, expires: 'in 24 h' }]);
  expect(leasesAfterStep(5)).toEqual([{ ...laptop, expires: 'in 24 h (renewed)' }]);
});

test('every message’s packet size still matches its packet', () => {
  expect(messages).toHaveLength(6);
  for (const m of messages) {
    const packet = unit.scene.packets![m.packet!]!;
    expect(packet.size).toBe(packet.layers.reduce((sum, layer) => sum + layer.size, 0));
    expect(m.log.size).toBe(formatBytes(packet.size));
  }
  expect(messages.map((m) => m.log.size)).toEqual(Array(6).fill('342 B'));
});

test('every message rides a tag the figure draws, between the laptop and the router', () => {
  const { svg } = drawDhcp();
  for (const m of messages) {
    expect(svg).toContain(` id="dh-tag-${m.tag.toLowerCase()}"`);
    expect([m.from, m.to].sort()).toEqual(['laptop', 'router']);
  }
});

test('the board reads the lease table the figure expects: "leases", keyed on the IP address, with a device column', () => {
  const panel = unit.scene.panel;
  expect(panel?.type).toBe('table');
  if (panel?.type !== 'table') return;
  expect(panel.table.id).toBe('leases');
  expect(panel.table.keyColumn).toBe('ip');
  expect(panel.table.columns.map((c) => c.label)).toEqual(['IP address', 'MAC address', 'Device', 'Expires']);
  expect(panel.table.columns.map((c) => c.key)).toEqual(['ip', 'mac', 'device', 'expires']);
  // As lesson-v3 sets them: the device and its expiry are words, the addresses data.
  expect(panel.table.columns.map((c) => c.prose ?? false)).toEqual([false, false, true, true]);
});

test('the log takes lesson-v3’s column widths, with Info as the prose column that takes the rest', () => {
  const columns = unit.scene.log.columns;
  expect(columns.map((c) => [c.key, c.width ?? null, c.prose ?? false])).toEqual([
    ['time', 100, false],
    ['source', 150, false],
    ['destination', 172, false],
    ['protocol', 84, false],
    ['info', null, true],
    ['size', 64, false],
  ]);
});

test('the log and the parties are the console’s packet log and the figure’s three places', () => {
  expect(unit.scene.log.title).toBe('Event log');
  expect(unit.scene.log.columns.map((c) => [c.key, c.label])).toEqual([
    ['time', 'Time'],
    ['source', 'Source'],
    ['destination', 'Destination'],
    ['protocol', 'Protocol'],
    ['info', 'Info'],
    ['size', 'Size'],
  ]);
  expect(unit.scene.parties.map((p) => [p.place, p.label])).toEqual([
    ['laptop', 'Laptop'],
    ['router', 'Router'],
    ['phone', 'Phone'],
  ]);
  expect(unit.scene.views).toEqual(['network', 'sequence']);
});

/** The words a sentence uses for each lesson it may point at. */
const TOPIC: Record<string, string> = {
  subnetting: 'subnet mask',
  ports: 'ports',
  'tcp-udp': 'UDP',
  dns: 'DNS',
};

test('every “lesson N” in the text names the lesson its sentence is about, in the track’s numbering', () => {
  expect(lessonNumbers(dhcp)).toHaveLength(4);
  expect(misnamedLessons(dhcp, TOPIC)).toEqual([]);
});

test('show draws every moment of the lesson, forwards, backwards and jumping, as a fresh driver draws it', () => {
  // Each position (the Overview, 5 steps, Learn, Practice) and each event of each step once more.
  expect(showSweep(dhcp)).toBe(8 + unit.steps.flatMap((s) => s.events).length);
});
