// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { LogDef } from '../content/schema';
import type { LogRow } from '../engine/timeline';
import { LogPanel } from './LogPanel';

const LOG: LogDef = {
  title: 'Firewall log',
  columns: [
    { key: 'source', label: 'Source' },
    { key: 'destination', label: 'Destination' },
    { key: 'decision', label: 'Decision' },
    { key: 'plain', label: 'In plain words' },
  ],
  legend: [
    { kind: 'request', label: 'Visit' },
    { kind: 'response', label: 'Reply' },
    { kind: 'blocked', label: 'Blocked' },
    { kind: 'change', label: 'Rule change' },
  ],
};

function message(n: number, kind: LogRow['kind'], outcome: LogRow['outcome'], plain: string): LogRow {
  return {
    n,
    eventId: `e${n}`,
    type: 'message',
    kind,
    outcome,
    from: 'visitor',
    to: 'server',
    cells: { source: '203.0.113.5', destination: '10.0.0.10', decision: outcome === 'blocked' ? 'Denied · rule 3' : 'Allowed' },
    plain,
  };
}

const ROWS: LogRow[] = [
  message(1, 'request', 'delivered', 'A visitor opens the web page.'),
  message(2, 'request', 'blocked', 'Someone tries to log in from outside.'),
  { n: 3, eventId: 'e3', type: 'note', kind: null, outcome: null, from: null, to: null, cells: { source: 'Admin' }, plain: 'The admin adds a rule.' },
  message(4, 'response', 'dropped', 'The reply is lost on the way.'),
];

const table = () => within(screen.getByRole('region', { name: 'Firewall log' })).getByRole('table');
const bodyRows = () => within(table()).getAllByRole('row').slice(1);

test('the log has # plus the unit’s columns, and a blocked row says Blocked in text', () => {
  render(<LogPanel log={LOG} rows={ROWS} idle="Nothing yet." />);
  expect(screen.getByRole('heading', { level: 2, name: 'Firewall log' })).toBeInTheDocument();
  expect(within(table()).getAllByRole('columnheader').map((th) => th.textContent)).toEqual([
    '#',
    'Source',
    'Destination',
    'Decision',
    'In plain words',
  ]);

  const [visit, blocked, note, lost] = bodyRows() as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
  expect(within(visit).getAllByRole('cell').map((td) => td.textContent)).toEqual([
    '1',
    '203.0.113.5',
    '10.0.0.10',
    'Allowed',
    'A visitor opens the web page.',
  ]);
  expect(visit).not.toHaveTextContent(/Blocked|Dropped/);

  // Blocked and lost rows carry the blocked colour (by data-outcome) and say so in words.
  expect(blocked).toHaveAttribute('data-outcome', 'blocked');
  expect(within(blocked).getByText('Blocked')).toBeInTheDocument();
  expect(blocked).toHaveTextContent('Someone tries to log in from outside.');
  expect(lost).toHaveAttribute('data-outcome', 'dropped');
  expect(within(lost).getByText('Dropped')).toBeInTheDocument();

  // Each row's glyph follows its kind, or its outcome when it did not get through; a note takes the
  // legend's note entry, here called a rule change. A cell the event did not write is empty.
  const glyph = (row: HTMLElement) => row.querySelector('[data-glyph]')?.getAttribute('data-glyph');
  expect([visit, blocked, note, lost].map(glyph)).toEqual(['request', 'blocked', 'change', 'dropped']);
  expect(within(note).getAllByRole('cell').map((td) => td.textContent)).toEqual(['3', 'Admin', '', '', 'The admin adds a rule.']);
});

test('the legend explains each glyph in words', () => {
  render(<LogPanel log={LOG} rows={ROWS} idle="Nothing yet." />);
  const legend = screen.getByRole('list', { name: 'Legend' });
  expect(within(legend).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Visit', 'Reply', 'Blocked', 'Rule change']);
});

test('an empty log shows the step’s idle text', () => {
  render(<LogPanel log={LOG} rows={[]} idle="Nothing has reached the firewall yet." />);
  expect(bodyRows()).toHaveLength(1);
  expect(within(table()).getByText('Nothing has reached the firewall yet.')).toBeInTheDocument();
});

test('the playback controls sit in its header', () => {
  render(<LogPanel log={LOG} rows={[]} idle="Nothing yet." controls={<button type="button">Play</button>} />);
  const title = screen.getByRole('heading', { name: 'Firewall log' });
  expect(title.parentElement).toContainElement(screen.getByRole('button', { name: 'Play' }));
});
