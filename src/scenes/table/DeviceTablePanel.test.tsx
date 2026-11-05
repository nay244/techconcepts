// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { TableDef } from '../../content/schema';
import { FIREWALL_COLUMNS, ruleRows, type FirewallRule } from '../../engine/net/firewall';
import type { TableState } from '../../engine/timeline';
import { contrastRatio, hexToRgb } from '../../lib/contrast';
import { tokens } from '../../styles/tokens';
import DeviceTablePanel from './DeviceTablePanel';

const rules: FirewallRule[] = [
  { id: 'r1', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: 'Website (HTTPS)' },
  { id: 'r2', action: 'allow', protocol: 'tcp', port: 22, source: '198.51.100.7/32', note: 'Admin SSH' },
  { id: 'r3', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: 'Block everything else' },
];

const table: TableDef = {
  id: 'rules',
  actor: 'fw',
  title: 'Rules',
  columns: [...FIREWALL_COLUMNS],
  keyColumn: '#',
  initialRows: [],
};

const stateOf = (highlight: TableState['highlight'] = null, rows = ruleRows(rules)): TableState => ({ rows, highlight });
const bodyRows = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('tbody tr')];

test('captions the table with its title and the device it belongs to', () => {
  render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf()} />);
  expect(screen.getByRole('table', { name: 'Rules · Firewall' })).toBeInTheDocument();
  expect(screen.getByText('Rules · Firewall').tagName).toBe('CAPTION');
});

test('wraps the table in a labelled region that a keyboard user can focus and scroll', () => {
  render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf()} />);
  const region = screen.getByRole('region', { name: 'Rules · Firewall' });
  expect(region).toHaveAttribute('tabindex', '0');
  expect(within(region).getByRole('table')).toBeInTheDocument();
});

test('uses the data table style and labels every column with a header cell', () => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf()} />);
  expect(container.querySelector('table')).toHaveClass('data');
  const headers = screen.getAllByRole('columnheader');
  expect(headers.map((h) => h.textContent)).toEqual(['#', 'Action', 'Protocol', 'Port', 'Source', "What it's for"]);
  expect(headers.every((h) => h.getAttribute('scope') === 'col')).toBe(true);
});

test('renders one row per rule with a cell for each column, in column order', () => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf()} />);
  const rows = bodyRows(container);
  expect(rows).toHaveLength(3);
  expect([...rows[1]!.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['2', 'ALLOW', 'TCP', '22', '198.51.100.7/32', 'Admin SSH']);
  expect([...rows[2]!.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['3', 'DENY', 'ANY', 'any', 'any', 'Block everything else']);
});

test('leaves a cell empty when a row has no value for the column', () => {
  const { container } = render(
    <DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf(null, [{ '#': '1', action: 'ALLOW' }])} />,
  );
  const cells = [...bodyRows(container)[0]!.querySelectorAll('td')];
  expect(cells).toHaveLength(6);
  expect(cells.map((td) => td.textContent)).toEqual(['1', 'ALLOW', '', '', '', '']);
});

test('shows no highlight when none is set', () => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf()} />);
  expect(container.querySelector('[data-highlight]')).toBeNull();
  expect(container.querySelector('.sr-only')).toBeNull();
});

test('marks the matched row with data-highlight and a visually hidden "(matched)"', () => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf({ key: '2', type: 'matched' })} />);
  const rows = bodyRows(container);
  expect(rows).toHaveLength(3);
  expect(rows.map((r) => r.getAttribute('data-highlight'))).toEqual([null, 'matched', null]);
  const hidden = within(rows[1]!).getByText('(matched)');
  expect(hidden).toHaveClass('sr-only');
  expect(rows[1]).toHaveTextContent('2 (matched)');
  expect(container.querySelectorAll('.sr-only')).toHaveLength(1);
});

test.each([
  ['added', '(new)'],
  ['updated', '(changed)'],
  ['matched', '(matched)'],
] as const)('a %s row says %s to a screen reader', (type, hiddenText) => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf({ key: '3', type })} />);
  const row = bodyRows(container)[2]!;
  expect(row).toHaveAttribute('data-highlight', type);
  expect(within(row).getByText(hiddenText)).toHaveClass('sr-only');
});

test('finds the highlighted row by the key column, not by position', () => {
  const dhcp: TableDef = {
    id: 'leases',
    actor: 'server',
    title: 'Lease table',
    columns: [
      { key: 'ip', label: 'IP address' },
      { key: 'mac', label: 'MAC address' },
    ],
    keyColumn: 'mac',
    initialRows: [],
  };
  const rows = [
    { ip: '192.168.1.50', mac: '00:00:5E:00:53:0A' },
    { ip: '192.168.1.51', mac: '00:00:5E:00:53:0B' },
  ];
  const { container } = render(
    <DeviceTablePanel table={dhcp} actorLabel="DHCP server" state={{ rows, highlight: { key: '00:00:5E:00:53:0B', type: 'added' } }} />,
  );
  expect(bodyRows(container).map((r) => r.getAttribute('data-highlight'))).toEqual([null, 'added']);
  expect(screen.getByRole('table', { name: 'Lease table · DHCP server' })).toBeInTheDocument();
});

test('a match that found nothing (empty key) highlights no row', () => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf({ key: '', type: 'matched' })} />);
  expect(container.querySelector('[data-highlight]')).toBeNull();
  expect(container.querySelector('.sr-only')).toBeNull();
});

test('a highlight whose key matches no row highlights nothing', () => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf({ key: '9', type: 'updated' })} />);
  expect(container.querySelector('[data-highlight]')).toBeNull();
});

test('an empty table says "Empty" in a row spanning every column, and keeps its headers', () => {
  const { container } = render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf(null, [])} />);
  expect(screen.getByText('Empty')).toBeInTheDocument();
  expect(screen.getAllByRole('columnheader')).toHaveLength(6);
  const rows = bodyRows(container);
  expect(rows).toHaveLength(1);
  expect(rows[0]!.querySelector('td')).toHaveAttribute('colspan', '6');
  expect(container.querySelector('[data-highlight]')).toBeNull();
});

test('a table with rows does not say "Empty"', () => {
  render(<DeviceTablePanel table={table} actorLabel="Firewall" state={stateOf()} />);
  expect(screen.queryByText('Empty')).not.toBeInTheDocument();
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
