// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { dhcpLayer, ethernetLayer, ipv4Layer, packet, udpLayer } from '../../content/helpers/packets';
import type { Packet } from '../../content/schema';
import type { LogRow } from '../../engine/timeline';
import { contrastRatio, hexToRgb } from '../../lib/contrast';
import { tokens } from '../../styles/tokens';
import Inspector from './Inspector';

const MAC = '00:00:5E:00:53:10';

const discover = (seenAt?: string): Packet =>
  packet({
    name: 'DHCP Discover',
    summary: 'The laptop shouts, to everyone, that it needs an address.',
    ...(seenAt === undefined ? {} : { seenAt }),
    layers: [
      ethernetLayer({ src: MAC, dst: 'ff:ff:ff:ff:ff:ff', type: 'IPv4' }),
      ipv4Layer({ src: '0.0.0.0', dst: '255.255.255.255', protocol: 'UDP', ttl: 64, totalLength: 328 }),
      udpLayer({ srcPort: 68, dstPort: 67, length: 308 }),
      dhcpLayer({ messageType: 'DISCOVER', xid: '0x3903F326', clientMac: MAC, broadcastFlag: true, options: [] }),
    ],
  });

const row: LogRow = {
  n: 1,
  eventId: 'discover',
  time: 0,
  from: 'laptop',
  to: ['router'],
  src: '0.0.0.0',
  dst: '255.255.255.255',
  protocol: 'DHCP',
  label: 'DHCP Discover',
  summary: 'The laptop asks for an address.',
  size: 342,
  kind: 'broadcast',
  outcome: 'delivered',
  packet: 'discover',
};

const noop = () => undefined;
const renderInspector = (props: Partial<Parameters<typeof Inspector>[0]> = {}) =>
  render(<Inspector packet={discover()} row={row} onClose={noop} {...props} />);

const layerBar = () => screen.getByRole('list', { name: /layers/i });
const fieldRow = (name: string) => {
  const item = screen.getByText(name).closest('li');
  if (!item) throw new Error(`no list item around "${name}"`);
  return item;
};

// ------------------------------------------------------------ the brief

test('renders the packet name as a heading inside a labelled section', () => {
  renderInspector();
  const region = screen.getByRole('region', { name: 'Packet inspector' });
  expect(region.tagName).toBe('SECTION');
  expect(within(region).getByRole('heading', { name: 'DHCP Discover' })).toBeInTheDocument();
});

test('the meta line gives time, route, protocol and size', () => {
  renderInspector();
  const meta = screen.getByText(/0\.0\.0\.0 → 255\.255\.255\.255/);
  expect(meta).toHaveTextContent('0.000s · 0.0.0.0 → 255.255.255.255 · DHCP · 342 B');
  expect(meta).toHaveTextContent('342 B');
});

test('draws one segment per layer, labelled with its name and size', () => {
  renderInspector();
  const segments = within(layerBar()).getAllByRole('listitem');
  expect(segments.map((s) => s.textContent)).toEqual(['Ethernet 14', 'IPv4 20', 'UDP 8', 'DHCP 300']);
});

test('marks the transaction ID as an example, next to the field', () => {
  renderInspector();
  const item = fieldRow('Transaction ID (xid)');
  expect(within(item).getByText('E.G.')).toBeInTheDocument();
  expect(within(item).getByText('0x3903F326')).toBeInTheDocument();
});

test('clicking "Close inspector" calls onClose', async () => {
  const onClose = vi.fn();
  renderInspector({ onClose });
  await userEvent.click(screen.getByRole('button', { name: 'Close inspector' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

// ------------------------------------------------------------ header

test('with no log row the meta line shows only what the packet knows: its size', () => {
  renderInspector({ row: null });
  expect(screen.getByText('342 B')).toBeInTheDocument();
  expect(screen.queryByText(/→/)).not.toBeInTheDocument();
  expect(screen.queryByText(/0\.000s/)).not.toBeInTheDocument();
});

test('formats the size above 1 KB and the time to three decimals', () => {
  const big: Packet = { ...discover(), size: 2048 };
  renderInspector({ packet: big, row: { ...row, time: 43200 } });
  expect(screen.getByText(/43200\.000s · .* · DHCP · 2\.0 KB/)).toBeInTheDocument();
});

test('shows prev and next only when a handler is given, and they call it', async () => {
  const { rerender } = renderInspector();
  expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();

  const [onPrev, onNext] = [vi.fn(), vi.fn()];
  rerender(<Inspector packet={discover()} row={row} onClose={noop} onPrev={onPrev} />);
  expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();

  rerender(<Inspector packet={discover()} row={row} onClose={noop} onNext={onNext} />);
  expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /next/i }));
  expect(onNext).toHaveBeenCalledTimes(1);

  rerender(<Inspector packet={discover()} row={row} onClose={noop} onPrev={onPrev} onNext={onNext} />);
  await userEvent.click(screen.getByRole('button', { name: /previous/i }));
  expect(onPrev).toHaveBeenCalledTimes(1);
  expect(onNext).toHaveBeenCalledTimes(1);
  expect(screen.getAllByRole('button')).toHaveLength(3);
});

test('does not listen for Escape itself: the lesson console owns that shortcut', async () => {
  const onClose = vi.fn();
  renderInspector({ onClose });
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
});

// ------------------------------------------------------------ context

test('shows the packet summary and where it was seen', () => {
  renderInspector({ packet: discover('Captured on the wireless link between the laptop and the router.') });
  expect(screen.getByText('The laptop shouts, to everyone, that it needs an address.')).toBeInTheDocument();
  expect(screen.getByText('Captured on the wireless link between the laptop and the router.')).toBeInTheDocument();
});

test('leaves out the seen-at line when the packet has none', () => {
  const { container } = renderInspector();
  expect(container).not.toHaveTextContent('undefined');
  expect(container.querySelectorAll('.inspector__seen')).toHaveLength(0);
});

// ------------------------------------------------------------ layer bar

test('the layer bar is named, and sizes each segment in proportion to its layer', () => {
  renderInspector();
  expect(layerBar()).toHaveAccessibleName('Layers, sizes in bytes');
  const widths = within(layerBar())
    .getAllByRole('listitem')
    .map((s) => (s as HTMLElement).style.flexGrow);
  expect(widths).toEqual(['14', '20', '8', '300']);
});

// ------------------------------------------------------------ field tree

test('opens one section per layer, summarised by its name and size in bytes', () => {
  const { container } = renderInspector();
  const sections = [...container.querySelectorAll('details')];
  expect(sections).toHaveLength(4);
  expect(sections.every((d) => d.open)).toBe(true);
  expect(sections.map((d) => d.querySelector('summary')?.textContent)).toEqual([
    'Ethernet · 14 bytes',
    'IPv4 · 20 bytes',
    'UDP · 8 bytes',
    'DHCP · 300 bytes',
  ]);
});

test('each section gives the layer summary and lists its fields', () => {
  const p = discover();
  const { container } = renderInspector({ packet: p });
  [...container.querySelectorAll('details')].forEach((section, i) => {
    const layer = p.layers[i]!;
    expect(within(section).getByText(layer.summary)).toBeInTheDocument();
    expect(within(section).getAllByRole('listitem')).toHaveLength(layer.fields.length);
  });
});

test('a field row shows its name, value and explanation', () => {
  renderInspector();
  const item = fieldRow('Destination MAC');
  expect(within(item).getByText('ff:ff:ff:ff:ff:ff')).toBeInTheDocument();
  expect(within(item).getByText(/every device on this network/i)).toBeInTheDocument();
});

test('a field with no explanation shows only its name and value', () => {
  const bare: Packet = {
    name: 'Bare',
    summary: 's',
    size: 14,
    layers: [{ name: 'Ethernet', size: 14, summary: 'l', fields: [{ name: 'Destination MAC', value: 'ff:ff:ff:ff:ff:ff' }] }],
  };
  renderInspector({ packet: bare, row: null });
  const item = fieldRow('Destination MAC');
  expect(item).toHaveTextContent('Destination MAC');
  expect(item).toHaveTextContent('ff:ff:ff:ff:ff:ff');
  expect(item.querySelectorAll('p')).toHaveLength(0);
});

test('only example fields carry an E.G. tag: identification, both checksums and the transaction ID', () => {
  renderInspector();
  expect(screen.getAllByText('E.G.')).toHaveLength(4);
  for (const name of ['Identification', 'Header checksum', 'Checksum', 'Transaction ID (xid)']) {
    expect(within(fieldRow(name)).getByText('E.G.')).toBeInTheDocument();
  }
  for (const name of ['Version', 'Magic cookie', 'Destination port']) {
    expect(within(fieldRow(name)).queryByText('E.G.')).not.toBeInTheDocument();
  }
});

test('a screen reader hears "Example value" for the tag', () => {
  renderInspector();
  expect(within(fieldRow('Transaction ID (xid)')).getByText('Example value')).toHaveClass('sr-only');
});

test('collapsing a layer hides its fields and reopening shows them again', async () => {
  const { container } = renderInspector();
  const udp = [...container.querySelectorAll('details')][2]!;
  const summary = within(udp).getByText('UDP · 8 bytes');
  await userEvent.click(summary);
  expect(udp.open).toBe(false);
  await userEvent.click(summary);
  expect(udp.open).toBe(true);
});

// ------------------------------------------------------------ legend

test('explains what E.G. means', () => {
  renderInspector();
  expect(screen.getByText('E.G. marks an example value: it differs in every real capture.')).toBeInTheDocument();
});

// ------------------------------------------------------------ styling

/** What color-mix(in srgb, fg share%, bg) paints, as a hex colour. */
function mix(fg: string, bg: string, share: number): string {
  const [f, b] = [hexToRgb(fg), hexToRgb(bg)];
  const channel = (i: number) => Math.round(f[i]! * (share / 100) + b[i]! * (1 - share / 100));
  return `#${[0, 1, 2].map((i) => channel(i).toString(16).padStart(2, '0')).join('')}`;
}

// inspector.css fills alternate layer segments with 10% and 22% --ink-muted over --panel; 22% is the harder case.
// Vitest drops stylesheet contents, so these numbers mirror the CSS rather than read it.
test.each(['dark', 'light'] as const)('segment labels keep 4.5:1 on their fill in the %s theme', (theme) => {
  const t = tokens[theme];
  for (const share of [10, 22]) expect(contrastRatio(t['ink-strong'], mix(t['ink-muted'], t.panel, share))).toBeGreaterThanOrEqual(4.5);
});
