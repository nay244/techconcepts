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
    tag: 'Visit',
    cells: { source: '203.0.113.5', destination: '10.0.0.10', decision: outcome === 'blocked' ? 'Denied · rule 3' : 'Allowed' },
    plain,
  };
}

const ROWS: LogRow[] = [
  message(1, 'request', 'delivered', 'A visitor opens the web page.'),
  message(2, 'request', 'blocked', 'Someone tries to log in from outside.'),
  { n: 3, eventId: 'e3', type: 'note', kind: null, outcome: null, from: null, to: null, tag: null, cells: { source: 'Admin' }, plain: 'The admin adds a rule.' },
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

test('a column marked prose is set as words, plain is prose unless it says otherwise, and the columns take their widths', () => {
  const log: LogDef = {
    title: 'Event log',
    columns: [
      { key: 'source', label: 'Source', width: 150 },
      { key: 'info', label: 'Info', prose: true },
      { key: 'size', label: 'Size', width: 64 },
      { key: 'plain', label: 'In plain words' },
    ],
    legend: [],
  };
  const row = {
    ...message(1, 'request', 'delivered', 'A visitor opens the web page.'),
    cells: { source: '203.0.113.5', info: 'GET /', size: '60 B' },
  };
  render(<LogPanel log={log} rows={[row]} idle="Nothing yet." />);
  const events = within(screen.getByRole('region', { name: 'Event log' })).getByRole('table');
  const cells = within(events).getAllByRole('cell');
  expect(cells.map((td) => td.classList.contains('log__prose'))).toEqual([false, false, true, false, true]);

  // # is the console's own 56 px column; a column without a width takes the rest.
  const cols = [...events.querySelectorAll('colgroup > col')] as HTMLElement[];
  expect(cols.map((col) => col.style.width)).toEqual(['56px', '150px', '', '64px', '']);

  const plainNotProse: LogDef = { ...log, title: 'Second log', columns: [{ key: 'plain', label: 'In plain words', prose: false }] };
  render(<LogPanel log={plainNotProse} rows={[row]} idle="Nothing yet." />);
  const second = within(screen.getByRole('region', { name: 'Second log' })).getAllByRole('cell');
  expect(second.at(-1)).not.toHaveClass('log__prose');
});

test('with no plain column, a lost row says so in its first column of words, where the word can wrap, not in a narrow one', () => {
  // How the Internet Works' packet log: Info is its only column of words, and Size is 76 px of figures.
  const log: LogDef = {
    title: 'Event log',
    columns: [
      { key: 'source', label: 'Source', width: 176 },
      { key: 'info', label: 'Info', prose: true },
      { key: 'size', label: 'Size', width: 76 },
    ],
    legend: [],
  };
  const lost = { ...message(1, 'response', 'dropped', 'Lost on the way.'), cells: { source: '203.0.113.80:80', info: 'seq 1461', size: '1.5 KB' } };
  render(<LogPanel log={log} rows={[lost]} idle="Nothing yet." />);
  const [, source, info, size] = within(screen.getByRole('region', { name: 'Event log' })).getAllByRole('cell');
  expect(info).toHaveTextContent(/^Dropped seq 1461$/);
  expect(size).toHaveTextContent(/^1\.5 KB$/);
  expect(source).not.toHaveTextContent('Dropped');

  // With no column of words at all, the word goes in the last column, as before.
  const figures: LogDef = { ...log, title: 'Figures', columns: [log.columns[0]!, log.columns[2]!] };
  render(<LogPanel log={figures} rows={[lost]} idle="Nothing yet." />);
  expect(within(screen.getByRole('region', { name: 'Figures' })).getAllByRole('cell').at(-1)).toHaveTextContent(/^Dropped 1\.5 KB$/);
});

test('a note that names its own glyph draws it, and a strong column’s cells are set strong', () => {
  // Subnetting's Working log, as subnet-v1.html draws it: a square for what was worked out, an arrow for what was
  // sent and a ring for a broadcast, with the row's Worked out and Value in the strongest ink.
  const log: LogDef = {
    title: 'Working',
    columns: [
      { key: 'worked', label: 'Worked out', prose: true, strong: true },
      { key: 'value', label: 'Value', strong: true },
      { key: 'prefix', label: 'Prefix' },
      { key: 'plain', label: 'In plain words' },
    ],
    legend: [
      { kind: 'request', label: 'Worked out' },
      { kind: 'response', label: 'Sent' },
      { kind: 'broadcast', label: 'Broadcast' },
    ],
  };
  const note = (n: number, glyph: LogRow['glyph']): LogRow => ({
    n,
    eventId: `n${n}`,
    type: 'note',
    kind: null,
    outcome: null,
    from: null,
    to: null,
    tag: null,
    cells: { worked: 'Broadcast address', value: '192.168.1.255', prefix: '/24' },
    plain: 'Host bits all 1: the whole floor hears it',
    ...(glyph === undefined ? {} : { glyph }),
  });
  render(<LogPanel log={log} rows={[note(1, 'request'), note(2, 'response'), note(3, 'broadcast')]} idle="Nothing yet." />);
  const rows = within(within(screen.getByRole('region', { name: 'Working' })).getByRole('table')).getAllByRole('row').slice(1);
  expect(rows.map((row) => row.querySelector('[data-glyph]')?.getAttribute('data-glyph'))).toEqual(['request', 'response', 'broadcast']);
  expect(within(rows[0]!).getAllByRole('cell').map((td) => td.classList.contains('log__strong'))).toEqual([false, true, true, false, false]);

  // Without one, a note still takes the legend's note entry (the Firewall log's rule change, above).
  render(<LogPanel log={LOG} rows={[{ ...note(4, undefined), cells: {} }]} idle="Nothing yet." />);
  expect(table().querySelector('[data-glyph]')).toHaveAttribute('data-glyph', 'change');
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
