// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { lessonNumbers } from '../../test/lesson-references';
import { showSweep } from '../../test/show-sweep';
import { checkStructure } from '../define';
import type { MessageEvent, TableEvent } from '../schema';
import tcpUdp from './tcp-udp';

const unit = tcpUdp.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const messages = events.filter((e): e is MessageEvent => e.type === 'message');

test('TCP/UDP validates on the network map with the voice plate, 5 steps and 3 questions', () => {
  expect(checkStructure(tcpUdp)).toEqual([]);
  expect(unit.scene.layers).toEqual(['tcp:web', 'tcp-udp:voice']);
  expect(unit.scene.views).toEqual(['network', 'sequence']);
  expect(unit.steps).toHaveLength(5);
  expect(unit.practice).toHaveLength(3);
});

test('14 messages, each over TCP or UDP; the two losses are PIECE 2 and SAM 2', () => {
  expect(messages).toHaveLength(14);
  for (const m of messages) expect(['TCP', 'UDP']).toContain(m.over);
  expect(messages.filter((m) => m.outcome === 'dropped').map((m) => m.tag)).toEqual(['PIECE 2', 'SAM 2']);
});

test('the side-by-side table is keyed on the piece and marks no row as a miss', () => {
  const panel = unit.scene.panel;
  expect(panel?.type).toBe('table');
  if (panel?.type !== 'table') return;
  expect(panel.table.keyColumn).toBe('piece');
  expect(panel.table.columns.map((c) => c.label)).toEqual(['Piece', 'Page, over TCP', 'Sam’s voice, over UDP']);
  const tables = events.filter((e): e is TableEvent => e.type === 'table');
  expect(tables.some((e) => e.miss !== undefined)).toBe(false);
  expect(JSON.stringify(tables)).toContain('Arrived, straight to the app');
});

test('no text points at another lesson by number', () => {
  expect(lessonNumbers(tcpUdp)).toEqual([]);
});

test('show draws every moment of the lesson as a fresh driver draws it', () => {
  expect(showSweep(tcpUdp)).toBe(8 + events.length);
});
