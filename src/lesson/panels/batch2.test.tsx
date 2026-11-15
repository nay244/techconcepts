// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { batch2Fixtures } from '../../content/batch2-fixtures';
import type { Lesson } from '../../content/schema';
import { deriveState } from '../../engine/timeline';
import { LogPanel } from '../LogPanel';
import { BitsBoard } from './BitsBoard';
import { TablePanel } from './TablePanel';

// D12 / B14, attack cases 20, 23, 24, 26 and 27 (prototypes/d12-cases.md), on each fixture's settled panel and log.
// A position is a slot: 0 is the Overview, then one for each step, counted from 1.

const ip = batch2Fixtures.ip();
const mac = batch2Fixtures.mac();
const tcpUdp = batch2Fixtures['tcp-udp']();
const lastOf = (lesson: Lesson, step: number): number => lesson.units[0]!.steps[step - 1]!.events.length;
const logOf = (lesson: Lesson) => lesson.units[0]!.scene.log;
const rowsAt = (lesson: Lesson, step: number) => deriveState(lesson, step, lastOf(lesson, step)).log;

// ---- check 20: IP's board

/** The board's rows that show, as their label and address. */
function boardAt(step: number): { label: string; dec: string }[] {
  const { unmount } = render(<BitsBoard board={deriveState(ip, step, lastOf(ip, step)).board} />);
  const rows = screen
    .getAllByRole('row')
    .filter((r) => r.closest('tbody') !== null && !r.hasAttribute('data-off'))
    .map((r) => ({ label: r.querySelector('.bits__label')!.textContent!, dec: r.querySelector('.bits__dec')!.textContent! }));
  unmount();
  return rows;
}

test('20: at each step’s end the board holds §3.1’s rows', () => {
  expect([1, 2, 3, 4, 5].map(boardAt)).toEqual([
    [{ label: 'Sales laptop', dec: '192.168.1.10' }],
    [{ label: 'Sales laptop', dec: '192.168.1.10' }, { label: 'Printer', dec: '192.168.1.20' }],
    [{ label: 'Router, inside', dec: '192.168.1.1' }, { label: 'Router, link', dec: '203.0.113.6' }],
    [{ label: 'Sales laptop', dec: '192.168.1.10' }, { label: 'Loopback', dec: '127.0.0.1' }],
    [{ label: 'No address', dec: '0.0.0.0' }, { label: 'Everyone here', dec: '255.255.255.255' }],
  ]);
});

test('20: the caption reads "32 bits, in four groups of 8"; before step 1 it says where the address will appear', () => {
  for (const step of [1, 2, 3, 4, 5]) {
    const { unmount } = render(<BitsBoard board={deriveState(ip, step, lastOf(ip, step)).board} />);
    expect(document.querySelector('.bits__note')!.textContent, `step ${step}`).toBe('32 bits, in four groups of 8');
    unmount();
  }
  expect(deriveState(ip, 0, 0).board).toBeNull();
  render(<BitsBoard board={null} />);
  expect(document.querySelector('.bits__note')!.textContent).toBe('The Sales laptop’s address appears here in step 1');
});

test('20: no row carries a mark, row 2 is off and keeps its place, and 0.0.0.0 and 255.255.255.255 draw without throwing', () => {
  for (const step of [1, 2, 3, 4, 5]) {
    const { container, unmount } = render(<BitsBoard board={deriveState(ip, step, lastOf(ip, step)).board} />);
    expect(container.querySelectorAll('[data-part], [data-differs], [data-matches]'), `step ${step}`).toHaveLength(0);
    const trs = [...container.querySelectorAll('tbody tr')];
    expect(trs).toHaveLength(3);
    expect(trs[1]!.hasAttribute('data-off')).toBe(true);
    unmount();
  }
  const { container } = render(<BitsBoard board={deriveState(ip, 5, 1).board} />);
  const bits = [...container.querySelectorAll('tbody tr')].map((tr) => [...tr.querySelectorAll('.bits__cell')].map((c) => c.textContent).join(''));
  expect(bits[0]).toBe('0'.repeat(32));
  expect(bits[2]).toBe('1'.repeat(32));
});

// ---- check 23: MAC's table

const FRAMES = mac.units[0]!.scene.panel!.type === 'table' ? mac.units[0]!.scene.panel!.table : (() => { throw new Error('a table panel'); })();
function framesAt(step: number, played = lastOf(mac, step)) {
  const state = deriveState(mac, step, played).tables.frames!;
  const { container, unmount } = render(<TablePanel def={FRAMES} state={state} />);
  const rows = [...container.querySelectorAll<HTMLElement>('tbody tr')];
  const out = {
    cells: rows.map((r) => [...r.querySelectorAll('td')].map((td) => td.textContent!.replace(/ \((new|matched|changed)\)$/, ''))),
    highlight: rows.map((r) => r.getAttribute('data-highlight')),
    label: container.querySelector('.tpanel')!.getAttribute('aria-label'),
  };
  unmount();
  return out;
}

test('23: the "This frame" column at each step’s end is §3.2’s, with the device and its MAC address beside it', () => {
  const column = (step: number) => framesAt(step).cells.map((c) => c[2]);
  expect(column(1)).toEqual(['Hears it', 'Sent it', 'Hears it', 'Hears it']);
  expect(column(2)).toEqual(['Keeps it', 'Sent it', 'Ignores it', 'Ignores it']);
  expect(column(3)).toEqual(['Keeps it', 'Sent it', 'Ignores it', 'Ignores it']);
  expect(column(4)).toEqual(['Sent it', 'Keeps it', 'Keeps it', 'Keeps it']);
  expect(column(5)).toEqual(['Sent it', 'Keeps it', 'Ignores it', 'Ignores it']);
  expect(framesAt(3).cells.map((c) => c.slice(0, 2))).toEqual([
    ['Router', '00:00:5E:00:53:01'],
    ['Laptop', '00:00:5E:00:53:10'],
    ['Phone', '00:00:5E:00:53:11'],
    ['TV', '00:00:5E:00:53:12'],
  ]);
  expect(framesAt(0, 0).cells.map((c) => c[2])).toEqual(['—', '—', '—', '—']);
});

test('23: at step 3 the laptop’s row is matched; it is highlighted and the others are not', () => {
  expect(framesAt(3).highlight).toEqual([null, 'matched', null, null]);
  expect(framesAt(3, 0).highlight).toEqual([null, null, null, null]);
});

test('23: the table’s own words are §7’s: its title is the label, its by-line is each device’s own', () => {
  expect(framesAt(1).label).toBe('Who keeps the frame');
  expect(FRAMES.by).toBe('each device decides for itself');
  expect(FRAMES.columns.map((c) => c.label)).toEqual(['Device', 'MAC address', 'This frame']);
});

// ---- check 24: TCP/UDP's table (variant A)

const ARRIVED = tcpUdp.units[0]!.scene.panel!.type === 'table' ? tcpUdp.units[0]!.scene.panel!.table : (() => { throw new Error('a table panel'); })();
function arrivedAt(step: number, played = lastOf(tcpUdp, step)) {
  const state = deriveState(tcpUdp, step, played).tables.arrived!;
  const { container, unmount } = render(<TablePanel def={ARRIVED} state={state} />);
  const out = {
    cells: [...container.querySelectorAll<HTMLElement>('tbody tr')].map((r) =>
      r.querySelector('.tpanel__empty') !== null ? ['empty'] : [...r.querySelectorAll('td')].map((td) => td.textContent!.replace(/ \((new|matched|changed)\)$/, '')),
    ),
    miss: container.querySelectorAll('[data-miss]').length,
    empty: container.querySelector('.tpanel__empty')?.textContent ?? null,
    head: [...container.querySelectorAll('thead th')].map((th) => th.textContent),
  };
  unmount();
  return out;
}

test('24: "Nothing yet." before step 2; then rows 1, 2, 3 in that order; the cells at step 3’s and step 5’s ends; no row is marked a miss', () => {
  expect(arrivedAt(1).empty).toBe('Nothing yet.');
  expect(arrivedAt(2, 0).empty).toBe('Nothing yet.');
  expect(arrivedAt(2).cells).toEqual([['1', 'Arrived', '—'], ['2', 'Missing', '—'], ['3', 'Arrived, waiting', '—']]);
  expect(arrivedAt(3).cells).toEqual([['1', 'Arrived', '—'], ['2', 'Arrived, sent again', '—'], ['3', 'Arrived', '—']]);
  expect(arrivedAt(4).cells[0]).toEqual(['1', 'Arrived', 'Arrived']);
  expect(arrivedAt(5).cells).toEqual([['1', 'Arrived', 'Arrived'], ['2', 'Arrived, sent again', 'Lost'], ['3', 'Arrived', 'Arrived, straight to the app']]);
  for (const step of [1, 2, 3, 4, 5]) expect(arrivedAt(step).miss, `step ${step}`).toBe(0);
  expect(JSON.stringify(tcpUdp)).not.toContain('"miss"');
  expect(arrivedAt(5).head).toEqual(['Piece', 'Page, over TCP', 'Sam’s voice, over UDP']);
});

// ---- check 26: the logs

function logAt(lesson: Lesson) {
  const rows = deriveState(lesson, lesson.units[0]!.steps.length, lastOf(lesson, lesson.units[0]!.steps.length)).log;
  const { container } = render(<LogPanel log={logOf(lesson)} rows={rows} idle="x" />);
  return {
    rows,
    glyphs: [...container.querySelectorAll('tbody [data-glyph]')].map((g) => g.getAttribute('data-glyph')),
    trs: [...container.querySelectorAll<HTMLElement>('tbody tr')],
  };
}

test('26: IP’s log has seven rows, with the glyphs the outline names, and its three columns', () => {
  const { rows, glyphs, trs } = logAt(ip);
  expect(rows).toHaveLength(7);
  expect(glyphs).toEqual(['request', 'request', 'request', 'request', 'response', 'request', 'broadcast']);
  expect(logOf(ip).title).toBe('Addresses');
  expect(logOf(ip).columns.map((c) => [c.key, c.label, c.width ?? null])).toEqual([['addr', 'Address', 230], ['kind', 'Kind', 160], ['plain', 'In plain words', null]]);
  expect(trs[0]!.textContent).toContain('192.168.1.10');
  expect(trs.at(-1)!.textContent).toContain('0.0.0.0 → 255.255.255.255');
});

test('26: MAC’s log has three rows, a dash for time and size, Wi-Fi as the protocol, and the two MAC addresses', () => {
  const { rows } = logAt(mac);
  expect(rows).toHaveLength(3);
  for (const r of rows) {
    expect(r.cells.time).toBe('—');
    expect(r.cells.size).toBe('—');
    expect(r.cells.protocol).toBe('Wi-Fi');
  }
  expect(rows.map((r) => [r.cells.source, r.cells.destination])).toEqual([
    ['00:00:5E:00:53:10', '00:00:5E:00:53:01'],
    ['00:00:5E:00:53:01', 'ff:ff:ff:ff:ff:ff'],
    ['00:00:5E:00:53:01', '00:00:5E:00:53:10'],
  ]);
  expect(rows.map((r) => r.kind)).toEqual(['request', 'broadcast', 'response']);
});

test('26: TCP/UDP’s log has 14 rows; rows 6 and 13 are dropped and say "Dropped"; the internet lessons’ widths fit 192.168.1.100:50422', () => {
  const { rows, glyphs, trs } = logAt(tcpUdp);
  expect(rows).toHaveLength(14);
  rows.forEach((r, i) => expect(r.outcome === 'dropped', `row ${i + 1}`).toBe(i === 5 || i === 12));
  expect(trs.map((tr) => tr.getAttribute('data-outcome'))).toEqual(rows.map((_, i) => (i === 5 || i === 12 ? 'dropped' : null)));
  for (const i of [5, 12]) {
    expect(trs[i]!.querySelector('.log__flag')!.textContent).toBe('Dropped');
    expect(glyphs[i]).toBe('dropped');
  }
  expect(logOf(tcpUdp).columns.filter((c) => c.width !== undefined).map((c) => [c.key, c.width])).toEqual([['time', 100], ['source', 176], ['destination', 176], ['protocol', 84], ['size', 76]]);
  expect(rows[0]!.cells.source).toBe('192.168.1.100:50422');
  expect(rows[10]!.cells.destination).toBe('203.0.113.90:16384');
});

// ---- check 27: the legends

test('27: each legend is §3’s list, in order, and TCP/UDP’s has no Request or Reply', () => {
  expect(logOf(ip).legend).toEqual([{ kind: 'request', label: 'Address read' }, { kind: 'response', label: 'Sent' }, { kind: 'broadcast', label: 'Broadcast' }]);
  expect(logOf(mac).legend).toEqual([{ kind: 'request', label: 'Frame to one device' }, { kind: 'broadcast', label: 'Frame to everyone' }, { kind: 'response', label: 'Frame back to the laptop' }]);
  expect(logOf(tcpUdp).legend).toEqual([{ kind: 'request', label: 'Sent by your laptop' }, { kind: 'response', label: 'Sent to your laptop' }, { kind: 'dropped', label: 'Lost on the way' }]);
  expect(logOf(tcpUdp).legend.map((e) => e.label)).not.toContain('Request');
  expect(logOf(tcpUdp).legend.map((e) => e.label)).not.toContain('Reply');
  const { container } = render(<LogPanel log={logOf(tcpUdp)} rows={[]} idle="x" />);
  expect([...container.querySelectorAll('.log__legend li')].map((li) => li.textContent)).toEqual(['Sent by your laptop', 'Sent to your laptop', 'Lost on the way']);
});

test('every message kind a fixture uses has a legend entry, and every note’s glyph is one the legend explains', () => {
  for (const lesson of [ip, mac, tcpUdp]) {
    const explained = new Set(logOf(lesson).legend.map((e) => e.kind));
    for (const e of lesson.units[0]!.steps.flatMap((s) => s.events)) {
      if (e.type === 'message') expect(explained.has(e.kind), `${lesson.slug} ${e.id}`).toBe(true);
      if (e.type === 'note' && e.glyph !== undefined) expect(explained.has(e.glyph), `${lesson.slug} ${e.id}`).toBe(true);
    }
  }
});
