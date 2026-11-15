// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { drawDhcp } from '../../art/scenes/dhcp';
import { lessonNumbers } from '../../test/lesson-references';
import { showSweep } from '../../test/show-sweep';
import { checkStructure } from '../define';
import type { MessageEvent, TableEvent } from '../schema';
import mac from './mac-address';

const unit = mac.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const messages = events.filter((e): e is MessageEvent => e.type === 'message');

test('MAC Address validates on the DHCP figure in its frames setup, with 5 steps and 3 questions', () => {
  expect(checkStructure(mac)).toEqual([]);
  expect(mac.figure).toBe('dhcp');
  expect(unit.scene.start).toEqual([{ cue: 'frames' }]);
  expect(unit.steps).toHaveLength(5);
  expect(unit.practice).toHaveLength(3);
  expect(unit.scene.views).toEqual(['network']);
});

test('E2: the board reads the table the figure expects: "frames", keyed on `mac`, with a `frame` column, four rows carrying the four drawn MAC addresses, and only the four verdict words', () => {
  const panel = unit.scene.panel;
  expect(panel?.type).toBe('table');
  if (panel?.type !== 'table') return;
  expect(panel.table.id).toBe('frames');
  expect(panel.table.keyColumn).toBe('mac');
  expect(panel.table.columns.map((c) => c.key)).toEqual(['device', 'mac', 'frame']);
  expect(panel.table.columns.map((c) => c.label)).toEqual(['Device', 'MAC address', 'This frame']);
  expect(panel.table.title).toBe('Who keeps the frame');
  expect(panel.table.by).toBe('each device decides for itself');
  expect(panel.table.initialRows.map((r) => r.mac)).toEqual(['00:00:5E:00:53:01', '00:00:5E:00:53:10', '00:00:5E:00:53:11', '00:00:5E:00:53:12']);
  const words = ['—', 'Sent it', 'Hears it', 'Keeps it', 'Ignores it'];
  const tables = events.filter((e): e is TableEvent => e.type === 'table');
  const cells = [...panel.table.initialRows.map((r) => r.frame), ...tables.flatMap((e) => [e.row?.frame, ...(e.rows ?? []).map((r) => r.frame)]).filter((w) => w !== undefined)];
  expect(panel.table.initialRows.map((r) => r.frame)).toEqual(['—', '—', '—', '—']);
  for (const cell of cells) expect(words).toContain(cell);
  // Each replace keeps the four rows, in order, with their device and MAC address.
  for (const e of tables.filter((t) => t.op === 'replace')) expect(e.rows!.map((r) => r.mac)).toEqual(panel.table.initialRows.map((r) => r.mac));
});

test('every message rides a tag the figure draws, between the laptop and the router, and every log time and size is a dash', () => {
  const { svg } = drawDhcp();
  expect(messages).toHaveLength(3);
  for (const m of messages) {
    expect(svg).toContain(` id="dh-tag-${m.tag.toLowerCase().replace(' ', '-')}"`);
    expect([m.from, m.to].sort()).toEqual(['laptop', 'router']);
    expect([m.log.time, m.log.size, m.log.protocol]).toEqual(['—', '—', 'Wi-Fi']);
  }
  expect(messages.map((m) => m.tag)).toEqual(['FRAME', 'TO ALL', 'FRAME']);
});

test('no text points at another lesson by number', () => {
  expect(lessonNumbers(mac)).toEqual([]);
});

test('show draws every moment of the lesson as a fresh driver draws it', () => {
  expect(showSweep(mac)).toBe(8 + events.length);
});
