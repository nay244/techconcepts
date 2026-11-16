// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { batch3Fixtures } from '../../content/batch3-fixtures';
import { deriveState } from '../../engine/timeline';
import { LogPanel } from '../LogPanel';
import { TablePanel } from './TablePanel';

// D13b / B15b (prototypes/d13-switch-cases.md, "Panel and log"): the MAC table and the log of the Switch unit at each step's end.

const lesson = batch3Fixtures.switch();
const scene = lesson.units[0]!.scene;
const def = scene.panel!.type === 'table' ? scene.panel!.table : (() => { throw new Error('a table panel'); })();
const lastOf = (step: number): number => lesson.units[0]!.steps[step - 1]!.events.length;

function tableAt(step: number) {
  const state = deriveState(lesson, step, lastOf(step)).tables['mac-table']!;
  const { container, unmount } = render(<TablePanel def={def} state={state} />);
  const rows = [...container.querySelectorAll<HTMLElement>('tbody tr')];
  const out = {
    cells: rows.map((r) => [...r.querySelectorAll('td')].map((td) => td.textContent!.replace(/ \((new|matched|changed)\)$/, ''))),
    highlight: rows.map((r) => r.getAttribute('data-highlight')),
    caption: container.querySelector('.tpanel')!.getAttribute('aria-label') ?? container.querySelector('caption')?.textContent ?? null,
    head: [...container.querySelectorAll('thead th')].map((th) => th.textContent),
    text: container.textContent!,
  };
  unmount();
  return out;
}

test('step 1: the empty row, then the no-match row, and nothing from a later step; the headers are Port and MAC address', () => {
  const t = tableAt(1);
  expect(t.head).toEqual(['Port', 'MAC address']);
  expect(t.text).toContain('Empty: the switch hasn’t learned any address yet');
  expect(t.text).toContain('no match');
  expect(t.text).toContain('MAC table');
  expect(t.text).toContain('kept by the switch');
});

test('step 2: one row, 2 · …:10, marked added, and no no-match row (an earlier step’s mark does not carry over)', () => {
  const t = tableAt(2);
  expect(t.cells).toEqual([['2', '00:00:5E:00:53:10']]);
  expect(t.highlight).toEqual(['added']);
  expect(t.text).not.toContain('no match');
});

test('step 3: rows in the order learned; …:10 is matched', () => {
  const t = tableAt(3);
  expect(t.cells).toEqual([['2', '00:00:5E:00:53:10'], ['4', '00:00:5E:00:53:13']]);
  expect(t.highlight).toEqual(['matched', null]);
});

test('step 4: three rows, the router’s added last', () => {
  const t = tableAt(4);
  expect(t.cells).toEqual([['2', '00:00:5E:00:53:10'], ['4', '00:00:5E:00:53:13'], ['1', '00:00:5E:00:53:01']]);
  expect(t.highlight).toEqual([null, null, 'added']);
});

test('step 5: the laptop’s port cell reads 5, in place and not appended; the router’s row is matched', () => {
  const t = tableAt(5);
  expect(t.cells).toEqual([['5', '00:00:5E:00:53:10'], ['4', '00:00:5E:00:53:13'], ['1', '00:00:5E:00:53:01']]);
  expect(t.highlight).toEqual([null, null, 'matched']);
});

test('the log: one row per frame and none for a copy; dashes for time and size; Ethernet; the broadcast goes to ff:ff:ff:ff:ff:ff', () => {
  const rows = deriveState(lesson, 5, lastOf(5)).log;
  const { container } = render(<LogPanel log={scene.log} rows={rows} idle="x" />);
  expect(rows).toHaveLength(4);
  for (const r of rows) {
    expect(r.cells.time).toBe('—');
    expect(r.cells.size).toBe('—');
    expect(r.cells.protocol).toBe('Ethernet');
  }
  expect(rows[2]!.cells.destination).toBe('ff:ff:ff:ff:ff:ff');
  expect(rows.map((r) => r.kind)).toEqual(['request', 'response', 'broadcast', 'request']);
  expect([...container.querySelectorAll('tbody [data-glyph]')].map((g) => g.getAttribute('data-glyph'))).toEqual(['request', 'response', 'broadcast', 'request']);
  expect(scene.log.legend).toEqual([
    { kind: 'request', label: 'Frame for one device' },
    { kind: 'broadcast', label: 'Frame for everyone' },
    { kind: 'response', label: 'The reply' },
  ]);
});
