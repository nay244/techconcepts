// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { TableDef } from '../../content/schema';
import { ruleRows, type FirewallRule } from '../../engine/net/firewall';
import type { TableState } from '../../engine/tables';
import { contrastRatio, hexToRgb } from '../../lib/contrast';
import { tokens } from '../../styles/tokens';
import { TablePanel } from './TablePanel';

const rules: FirewallRule[] = [
  { id: 'r1', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: 'Website (HTTPS)' },
  { id: 'r2', action: 'allow', protocol: 'tcp', port: 22, source: '198.51.100.7/32', note: 'Admin SSH' },
  { id: 'r3', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: 'Block everything else' },
];

const def: TableDef = {
  id: 'rules',
  title: 'Rules',
  by: 'kept by the firewall',
  columns: [
    { key: '#', label: '#' },
    { key: 'action', label: 'Action' },
    { key: 'protocol', label: 'Protocol' },
    { key: 'port', label: 'Port' },
    { key: 'source', label: 'Source' },
    { key: 'note', label: "What it's for" },
  ],
  keyColumn: '#',
  initialRows: [],
  empty: 'No rules yet.',
};

const stateOf = (highlight: TableState['highlight'] = null, rows = ruleRows(rules)): TableState => ({ rows, highlight, missed: [] });
const bodyRows = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('tbody tr')];

test('TablePanel shows its empty text, highlights the matched row, and keeps focus across a remount', () => {
  const { container, rerender } = render(<TablePanel key="none" def={def} state={stateOf(null, [])} />);
  expect(screen.getByText('No rules yet.')).toBeInTheDocument();
  expect(container.querySelector('[data-highlight]')).toBeNull();

  // A table event remounts the panel (its key changes); the learner had focused it.
  screen.getByRole('region', { name: 'Rules' }).focus();
  rerender(<TablePanel key="t-match" def={def} state={stateOf({ key: '2', type: 'matched' })} />);
  expect(screen.queryByText('No rules yet.')).not.toBeInTheDocument();
  expect(bodyRows(container).map((r) => r.getAttribute('data-highlight'))).toEqual([null, 'matched', null]);
  expect(screen.getByRole('region', { name: 'Rules' })).toHaveFocus();
});

test('a remount does not take the focus when the panel did not have it', () => {
  const { rerender } = render(
    <>
      <button type="button">Elsewhere</button>
      <TablePanel key="a" def={def} state={stateOf()} />
    </>,
  );
  screen.getByRole('button', { name: 'Elsewhere' }).focus();
  rerender(
    <>
      <button type="button">Elsewhere</button>
      <TablePanel key="b" def={def} state={stateOf({ key: '1', type: 'matched' })} />
    </>,
  );
  expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
});

test('a focused panel that goes away for good leaves nothing behind to steal the focus later', async () => {
  const { rerender } = render(<TablePanel key="a" def={def} state={stateOf()} />);
  screen.getByRole('region', { name: 'Rules' }).focus();
  rerender(<p>No panel here</p>);
  // A later panel for the same table, after the moment of the remount has passed, leaves the focus alone.
  await Promise.resolve();
  rerender(<TablePanel key="b" def={def} state={stateOf()} />);
  expect(screen.getByRole('region', { name: 'Rules' })).not.toHaveFocus();
});

test('the region is named by the table title, is focusable, and holds a real table', () => {
  render(<TablePanel def={def} state={stateOf()} />);
  const region = screen.getByRole('region', { name: 'Rules' });
  expect(region).toHaveAttribute('tabindex', '0');
  expect(region).toHaveAttribute('data-table', 'rules');
  expect(within(region).getByRole('table')).toBeInTheDocument();
});

test('the caption names the table and who keeps it', () => {
  render(<TablePanel def={def} state={stateOf()} />);
  const caption = screen.getByRole('table').querySelector('caption')!;
  expect(caption).toHaveTextContent('Rules');
  expect(caption).toHaveTextContent('kept by the firewall');
});

test('a table kept by no one in particular captions its title alone', () => {
  const { by: _by, ...noOwner } = def;
  render(<TablePanel def={noOwner} state={stateOf()} />);
  expect(screen.getByRole('table').querySelector('caption')).toHaveTextContent(/^Rules$/);
});

test('labels every column with a header cell', () => {
  render(<TablePanel def={def} state={stateOf()} />);
  const headers = screen.getAllByRole('columnheader');
  expect(headers.map((h) => h.textContent)).toEqual(['#', 'Action', 'Protocol', 'Port', 'Source', "What it's for"]);
  expect(headers.every((h) => h.getAttribute('scope') === 'col')).toBe(true);
});

test('renders one row per table row with a cell for each column, in column order', () => {
  const { container } = render(<TablePanel def={def} state={stateOf()} />);
  const rows = bodyRows(container);
  expect(rows).toHaveLength(3);
  expect([...rows[1]!.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['2', 'ALLOW', 'TCP', '22', '198.51.100.7/32', 'Admin SSH']);
  expect([...rows[2]!.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['3', 'DENY', 'ANY', 'any', 'any', 'Block everything else']);
});

test('a column marked prose sets its cells as words, and the others stay data', () => {
  const words: TableDef = { ...def, columns: def.columns.map((c) => (c.key === 'note' ? { ...c, prose: true } : c)) };
  const { container } = render(<TablePanel def={words} state={stateOf()} />);
  for (const row of bodyRows(container)) {
    const prose = [...row.querySelectorAll('td')].map((td) => td.classList.contains('tpanel__prose'));
    expect(prose).toEqual([false, false, false, false, false, true]);
  }
  // The empty text is not a column's cell.
  const { container: empty } = render(<TablePanel def={words} state={stateOf(null, [])} />);
  expect(empty.querySelector('td')).not.toHaveClass('tpanel__prose');
});

test('leaves a cell empty when a row has no value for the column', () => {
  const { container } = render(<TablePanel def={def} state={stateOf(null, [{ '#': '1', action: 'ALLOW' }])} />);
  const cells = [...bodyRows(container)[0]!.querySelectorAll('td')];
  expect(cells.map((td) => td.textContent)).toEqual(['1', 'ALLOW', '', '', '', '']);
});

test('shows no highlight when none is set', () => {
  const { container } = render(<TablePanel def={def} state={stateOf()} />);
  expect(container.querySelector('[data-highlight]')).toBeNull();
  expect(container.querySelector('.sr-only')).toBeNull();
});

test.each([
  ['added', '(new)'],
  ['updated', '(changed)'],
  ['matched', '(matched)'],
] as const)('a %s row says %s to a screen reader', (type, hiddenText) => {
  const { container } = render(<TablePanel def={def} state={stateOf({ key: '3', type })} />);
  const row = bodyRows(container)[2]!;
  expect(row).toHaveAttribute('data-highlight', type);
  expect(within(row).getByText(hiddenText)).toHaveClass('sr-only');
  expect(container.querySelectorAll('.sr-only')).toHaveLength(1);
});

test('finds the highlighted row by the key column, not by position', () => {
  const leases: TableDef = {
    id: 'leases',
    title: 'Lease table',
    columns: [
      { key: 'ip', label: 'IP address' },
      { key: 'mac', label: 'MAC address' },
    ],
    keyColumn: 'mac',
    initialRows: [],
    empty: 'No leases yet.',
  };
  const rows = [
    { ip: '192.168.1.50', mac: '00:00:5E:00:53:0A' },
    { ip: '192.168.1.51', mac: '00:00:5E:00:53:0B' },
  ];
  const { container } = render(<TablePanel def={leases} state={{ rows, highlight: { key: '00:00:5E:00:53:0B', type: 'added' }, missed: [] }} />);
  expect(bodyRows(container).map((r) => r.getAttribute('data-highlight'))).toEqual([null, 'added']);
});

test('a match that found nothing (empty key) highlights no row', () => {
  const { container } = render(<TablePanel def={def} state={stateOf({ key: '', type: 'matched' })} />);
  expect(container.querySelector('[data-highlight]')).toBeNull();
});

test('a highlight whose key matches no row highlights nothing', () => {
  const { container } = render(<TablePanel def={def} state={stateOf({ key: '9', type: 'updated' })} />);
  expect(container.querySelector('[data-highlight]')).toBeNull();
});

test('a row marked as a miss says “miss” in words, beside its first cell, whether or not it is highlighted', () => {
  const { container } = render(<TablePanel def={def} state={{ ...stateOf({ key: '3', type: 'added' }), missed: ['2', '3'] }} />);
  const rows = bodyRows(container);
  expect(rows.map((r) => r.hasAttribute('data-miss'))).toEqual([false, true, true]);
  // Visible words, not hidden ones: colour is never the only sign.
  const label = within(rows[1]!).getByText('miss');
  expect(label).toHaveClass('tpanel__miss');
  expect(label).not.toHaveClass('sr-only');
  expect(rows[1]!.querySelector('td')).toHaveTextContent(/^2 ?miss$/);
  // A row can be both: the one the latest event added, and a miss.
  expect(rows[2]).toHaveAttribute('data-highlight', 'added');
  expect(within(rows[2]!).getByText('miss')).toBeInTheDocument();
  expect(rows[0]!).not.toHaveTextContent('miss');
});

test('a table that names its own mark says that word on a marked row, in the same neutral tag; one that names none says “miss”', () => {
  // FTP's password and file: exposed, not missing.
  const exposed = render(<TablePanel def={{ ...def, markLabel: 'exposed' }} state={{ ...stateOf(), missed: ['2'] }} />);
  const rows = bodyRows(exposed.container);
  const label = within(rows[1]!).getByText('exposed');
  expect(label).toHaveClass('tpanel__miss');
  expect(label).not.toHaveClass('sr-only');
  expect(rows[1]!.querySelector('td')).toHaveTextContent(/^2 ?exposed$/);
  expect(exposed.container).not.toHaveTextContent(/miss/i);
  exposed.unmount();
  const plain = render(<TablePanel def={def} state={{ ...stateOf(), missed: ['2'] }} />);
  expect(within(bodyRows(plain.container)[1]!).getByText('miss')).toHaveClass('tpanel__miss');
});

test('the panel is the positioned box its hidden "(new)" words sit in, so they scroll with it and never stretch the page', () => {
  // Vitest drops stylesheet contents, so the rule is read from the file itself.
  const css = readFileSync('src/lesson/panels/table.css', 'utf8');
  const panel = /(?:^|\n)\.tpanel \{([^}]*)\}/.exec(css)?.[1] ?? '';
  expect(panel).toMatch(/overflow: auto;/);
  expect(panel).toMatch(/position: relative;/);
});

test('the miss mark is neutral: never marigold, which means “current”, nor the blocked red of a lost message', () => {
  // Vitest drops stylesheet contents, so the rules are read from the file itself.
  const css = readFileSync('src/lesson/panels/table.css', 'utf8');
  const rules = [...css.matchAll(/([^{}]*tpanel__miss[^{}]*|[^{}]*data-miss[^{}]*)\{([^}]*)\}/g)].map((m) => m[2]!);
  expect(rules.length).toBeGreaterThan(0);
  for (const body of rules) expect(body).not.toMatch(/--here|--blocked/);
});

test('an empty table says its empty text in a row spanning every column, and keeps its headers', () => {
  const { container } = render(<TablePanel def={def} state={stateOf(null, [])} />);
  expect(screen.getAllByRole('columnheader')).toHaveLength(6);
  const rows = bodyRows(container);
  expect(rows).toHaveLength(1);
  expect(rows[0]!.querySelector('td')).toHaveAttribute('colspan', '6');
  expect(rows[0]).toHaveTextContent('No rules yet.');
});

// ---------------------------------------------------------------- styling

/** What color-mix(in srgb, fg share%, transparent) paints over bg, as a hex colour. */
function mix(fg: string, bg: string, share: number): string {
  const [f, b] = [hexToRgb(fg), hexToRgb(bg)];
  const channel = (i: number) => Math.round(f[i]! * (share / 100) + b[i]! * (1 - share / 100));
  return `#${[0, 1, 2].map((i) => channel(i).toString(16).padStart(2, '0')).join('')}`;
}

// table.css tints a marked row 16% and starts its pulse at 40% (--tint-peak), so 40% is the hardest case for its text.
// Vitest drops stylesheet contents, so these numbers mirror the CSS rather than read it.
test.each(['dark', 'light'] as const)('a highlighted row keeps its text at 4.5:1 and its accent at 3:1 in the %s theme', (theme) => {
  const t = tokens[theme];
  expect(contrastRatio(t['ink-strong'], mix(t.selected, t.card, 40))).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(t.selected, t.card)).toBeGreaterThanOrEqual(3);
});

// The miss tag sits on its own card-coloured ground, so a highlight behind its row does not touch its words.
test.each(['dark', 'light'] as const)('the miss tag keeps its words at 4.5:1 in the %s theme', (theme) => {
  const t = tokens[theme];
  expect(contrastRatio(t.muted, t.card)).toBeGreaterThanOrEqual(4.5);
});
