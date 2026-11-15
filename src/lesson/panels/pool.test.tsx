// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { batch3Fixtures } from '../../content/batch3-fixtures';
import { deriveState } from '../../engine/timeline';
import { LogPanel } from '../LogPanel';
import { TablePanel } from './TablePanel';

// D13c / B15c (prototypes/d13-load-balancers-cases.md, L1 to L4 and checks 11 to 14): the pool table and the log of the
// Load Balancers unit.

const lesson = batch3Fixtures.pool();
const scene = lesson.units[0]!.scene;
const def = scene.panel!.type === 'table' ? scene.panel!.table : (() => { throw new Error('a table panel'); })();
const lastOf = (step: number): number => lesson.units[0]!.steps[step - 1]!.events.length;

function tableAt(step: number, n = lastOf(step)) {
  const state = deriveState(lesson, step, n).tables.pool!;
  const { container, unmount } = render(<TablePanel def={def} state={state} />);
  const rows = [...container.querySelectorAll<HTMLElement>('tbody tr')];
  const out = { rows: rows.map((r) => ({ server: r.querySelector('td')!.textContent, miss: r.hasAttribute('data-miss'), text: r.textContent! })), head: [...container.querySelectorAll('thead th')].map((th) => th.textContent), text: container.textContent! };
  unmount();
  return out;
}

test('L4: the table has Server, Address, Health, Requests; B’s row carries the "unhealthy" mark at step 3’s end and step 5’s third event, and not at its sixth', () => {
  const end3 = tableAt(3);
  expect(end3.head).toEqual(['Server', 'Address', 'Health', 'Requests']);
  expect(end3.text).toContain('The pool');
  expect(end3.text).toContain('kept by the balancer');
  expect(end3.rows.map((r) => r.miss)).toEqual([false, true, false]);
  expect(end3.rows[1]!.text).toContain('unhealthy');
  expect(end3.rows[1]!.text).toContain('Unhealthy');
  const third = tableAt(5, 3);
  expect(third.rows.map((r) => r.miss)).toEqual([false, true, false]);
  expect(third.rows[1]!.text).toContain('1 check passed');
  expect(third.rows[1]!.text).toContain('unhealthy');
  const sixth = tableAt(5, 6);
  expect(sixth.rows.map((r) => r.miss)).toEqual([false, false, false]);
  expect(sixth.text).not.toContain('unhealthy');
});

test('L4: step 3 after one missed check has no mark (B is still healthy); step 1 starts with three Healthy rows', () => {
  expect(tableAt(3, 5).rows.map((r) => r.miss)).toEqual([false, false, false]);
  const t = tableAt(1, 0);
  expect(t.rows.map((r) => r.server)).toEqual(['A', 'B', 'C']);
  for (const r of t.rows) expect(r.text).toContain('Healthy');
});

test('L1 and L3: the log has 19 rows at step 5’s end; checks and answers carry dashes and the server’s address; the glyphs and the legend are the four', () => {
  const rows = deriveState(lesson, 5, lastOf(5)).log;
  const { container } = render(<LogPanel log={scene.log} rows={rows} idle="x" />);
  expect(rows).toHaveLength(19);
  for (const r of rows) {
    expect(r.cells.time).toBe('—');
    expect(r.cells.size).toBe('—');
    expect(['HTTP', '—']).toContain(r.cells.protocol);
  }
  for (const r of rows) {
    if (r.kind === 'control') expect(r.cells).toMatchObject({ source: '—', destination: expect.stringMatching(/^10\.0\.0\.1[123]:80$/) });
    if (r.kind === 'response') expect(r.cells).toMatchObject({ source: expect.stringMatching(/^10\.0\.0\.1[123]:80$/), destination: '—' });
    if (r.kind === 'request') expect(r.cells.destination).toBe('203.0.113.80:80');
    if (r.kind === null) expect(r.cells.protocol).toBe('—');
  }
  const glyphs = [...container.querySelectorAll('tbody [data-glyph]')].map((g) => g.getAttribute('data-glyph'));
  expect(glyphs).toEqual(rows.map((r) => r.kind ?? 'note'));
  expect(new Set(glyphs)).toEqual(new Set(['request', 'control', 'response', 'note']));
  expect(rows.at(-1)!.cells.info).toBe('B’s turn: passed to server B');
});

test('L1: step 3 has 9 rows and its last is "No answer from B again: two in a row"; step 4 ends on 14', () => {
  const rows = deriveState(lesson, 3, lastOf(3)).log;
  expect(rows).toHaveLength(9);
  expect(rows.at(-1)!.cells.info).toBe('No answer from B again: two in a row');
  expect(deriveState(lesson, 4, lastOf(4)).log).toHaveLength(14);
});

test('L2: the legend is a reader’s request, health check, answer to a check, no answer in time, in that order', () => {
  expect(scene.log.legend).toEqual([
    { kind: 'request', label: 'A reader’s request' },
    { kind: 'control', label: 'Health check' },
    { kind: 'response', label: 'Answer to a check' },
    { kind: 'note', label: 'No answer in time' },
  ]);
  const { container } = render(<LogPanel log={scene.log} rows={[]} idle="x" />);
  expect([...container.querySelectorAll('.log__legend li')].map((li) => li.textContent)).toEqual(['A reader’s request', 'Health check', 'Answer to a check', 'No answer in time']);
});
