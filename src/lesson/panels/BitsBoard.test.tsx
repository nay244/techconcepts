// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { Board } from '../../content/schema';
import type { DerivedState } from '../../engine/timeline';
import { BitsBoard } from './BitsBoard';
import { UnitPanel } from './UnitPanel';

const LAPTOP = { addr: '192.168.1.10', who: 'Laptop' };
// Read from the project root: under jsdom import.meta.url is not a file URL.
const bitsCss: string = readFileSync('src/lesson/panels/bits.css', 'utf8');

/** The board's rows that show, each as its label, its 32 bits (as the cells read) and its dotted address. */
function rows(): { label: string; bits: string; dec: string }[] {
  return screen
    .getAllByRole('row')
    .filter((row) => row.closest('tbody') !== null && !row.hasAttribute('data-off'))
    .map((row) => ({
      label: within(row).getByRole('rowheader').textContent ?? '',
      bits: [...row.querySelectorAll('.bits__cell')].map((cell) => cell.textContent).join(''),
      dec: row.querySelector('.bits__dec')?.textContent ?? '',
    }));
}

/** Which of a row's 32 cells (1-based) carry an attribute. */
function cellsWith(rowIndex: number, attribute: string): number[] {
  const row = screen.getAllByRole('row').filter((r) => r.closest('tbody') !== null)[rowIndex]!;
  return [...row.querySelectorAll('.bits__cell')].flatMap((cell, i) => (cell.hasAttribute(attribute) ? [i + 1] : []));
}

const line = () => document.querySelector<HTMLElement>('.bits__line');

test('BitsBoard draws the /26 mask with the line after bit 26 and bits 25–26 underlined', () => {
  render(<BitsBoard board={{ ...LAPTOP, prefix: 26, borrow: 24, mask: true, pick: 'borrow' }} />);
  const table = screen.getByRole('table', { name: /The address in bits/ });
  expect(within(table).getByText('/26: 26 network bits, 6 host bits')).toBeTruthy();
  expect(rows()).toEqual([
    { label: 'Laptop', bits: '11000000101010000000000100001010', dec: '192.168.1.10' },
    { label: 'Mask', bits: '11111111111111111111111111000000', dec: '255.255.255.192' },
  ]);
  // One marigold line, after bit 26: 3 whole octets and 2 bits in.
  expect(document.querySelectorAll('.bits__line')).toHaveLength(1);
  expect(line()!.dataset.after).toBe('26');
  expect(line()!.style.getPropertyValue('--octets')).toBe('3');
  expect(line()!.style.getPropertyValue('--bits')).toBe('2');
  expect(line()!.style.getPropertyValue('--rows')).toBe('2');
  // Bits 25 and 26 were host bits at /24; both shown rows underline them, and say so to a screen reader.
  expect(cellsWith(0, 'data-borrowed')).toEqual([25, 26]);
  expect(cellsWith(1, 'data-borrowed')).toEqual([25, 26]);
  expect(within(table).getByText('Bits 25 to 26 are borrowed.')).toBeTruthy();
  // The pick is the borrowed bits.
  expect(cellsWith(0, 'data-picked')).toEqual([25, 26]);
  expect(cellsWith(1, 'data-picked')).toEqual([25, 26]);
  // 26 network bits, then 6 host bits, in every row that shows.
  const parts = [...screen.getAllByRole('row')[1]!.querySelectorAll<HTMLElement>('.bits__cell')].map((cell) => cell.dataset.part);
  expect(parts).toEqual([...Array(26).fill('net'), ...Array(6).fill('host')]);
});

test('with no board the table keeps its three rows hidden and says where the address comes from', () => {
  render(<BitsBoard board={null} />);
  const table = screen.getByRole('table', { name: /The address in bits/ });
  expect(within(table).getByText('The Sales laptop’s address appears here in step 1')).toBeTruthy();
  expect(table.querySelectorAll('tbody tr')).toHaveLength(3);
  expect(table.querySelectorAll('tbody tr[data-off]')).toHaveLength(3);
  expect(line()).toBeNull();
});

test('an address with no prefix yet shows its 32 bits in four groups of 8, with no line', () => {
  render(<BitsBoard board={{ ...LAPTOP, prefix: null }} />);
  expect(screen.getByText('32 bits, in four groups of 8')).toBeTruthy();
  expect(rows()).toEqual([{ label: 'Laptop', bits: '11000000101010000000000100001010', dec: '192.168.1.10' }]);
  expect(line()).toBeNull();
  expect(cellsWith(0, 'data-part')).toEqual([]);
  // A screen reader reads the bits digit by digit, in four groups of 8: "11000000" would be read as eleven million.
  expect(screen.getByText('1 1 0 0 0 0 0 0, 1 0 1 0 1 0 0 0, 0 0 0 0 0 0 0 1, 0 0 0 0 1 0 1 0')).toBeTruthy();
  expect([...document.querySelectorAll('.sr-only')].map((el) => el.textContent).join(' ')).not.toMatch(/[01]{2}/);
});

test('a pick lights the network part, the host part or the mask', () => {
  const { rerender } = render(<BitsBoard board={{ ...LAPTOP, prefix: 24, pick: 'net' }} />);
  expect(cellsWith(0, 'data-picked')).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
  rerender(<BitsBoard board={{ ...LAPTOP, prefix: 24, pick: 'host' }} />);
  expect(cellsWith(0, 'data-picked')).toEqual([25, 26, 27, 28, 29, 30, 31, 32]);
  rerender(<BitsBoard board={{ ...LAPTOP, prefix: 24, mask: true, pick: 'mask' }} />);
  expect(cellsWith(0, 'data-picked')).toEqual([]);
  expect(cellsWith(1, 'data-picked')).toHaveLength(32);
  rerender(<BitsBoard board={{ ...LAPTOP, prefix: 24, mask: true, pick: 'line' }} />);
  expect(line()!.hasAttribute('data-picked')).toBe(true);
});

test('the network and broadcast rows are the engine’s: host bits all 0, or all 1', () => {
  const { rerender } = render(
    <BitsBoard board={{ ...LAPTOP, prefix: 24, mask: true, third: { who: 'Network', addr: '192.168.1.0', mode: 'net' } }} />,
  );
  expect(rows()[2]).toEqual({ label: 'Network', bits: '11000000101010000000000100000000', dec: '192.168.1.0' });
  expect(cellsWith(2, 'data-picked')).toEqual([25, 26, 27, 28, 29, 30, 31, 32]);
  expect(line()!.style.getPropertyValue('--rows')).toBe('3');
  rerender(<BitsBoard board={{ ...LAPTOP, prefix: 24, mask: true, third: { who: 'Broadcast', addr: '192.168.1.255', mode: 'bcast' } }} />);
  expect(rows()[2]).toEqual({ label: 'Broadcast', bits: '11000000101010000000000111111111', dec: '192.168.1.255' });
});

test('a compared address marks the network bits that match and those that differ, and the note says which', () => {
  const board = (addr: string, who: string): Board => ({
    ...LAPTOP,
    prefix: 26,
    borrow: 24,
    mask: true,
    third: { who, addr, mode: 'cmp' },
  });
  const { rerender } = render(<BitsBoard board={board('192.168.1.20', 'Printer')} />);
  expect(screen.getByText('/26: the network parts match, so it’s the same subnet')).toBeTruthy();
  expect(cellsWith(2, 'data-differs')).toEqual([]);

  rerender(<BitsBoard board={board('192.168.1.70', 'Design PC')} />);
  expect(screen.getByText('/26: the network parts differ, so it’s another subnet')).toBeTruthy();
  expect(rows()[2]).toEqual({ label: 'Design PC', bits: '11000000101010000000000101000110', dec: '192.168.1.70' });
  // .10 is 00|001010 and .70 is 01|000110: within the network part only bit 26 differs.
  expect(cellsWith(2, 'data-differs')).toEqual([26]);
  expect(cellsWith(2, 'data-matches')).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
});

test('a borrowed bit that differs keeps both its outline and its underline, so colour is never the only mark', () => {
  const style = document.createElement('style');
  style.textContent = bitsCss;
  document.head.append(style);
  try {
    render(
      <BitsBoard
        board={{ ...LAPTOP, prefix: 26, borrow: 24, mask: true, third: { who: 'Design PC', addr: '192.168.1.70', mode: 'cmp' } }}
      />,
    );
    const row = screen.getAllByRole('row').filter((r) => r.closest('tbody') !== null)[2]!;
    const cells = [...row.querySelectorAll<HTMLElement>('.bits__cell')];
    const shadow = (bit: number): string => getComputedStyle(cells[bit - 1]!).boxShadow;
    // Bit 26 is borrowed and differs: the outline says it differs, the underline says it is borrowed.
    expect(cells[25]!.hasAttribute('data-borrowed') && cells[25]!.hasAttribute('data-differs')).toBe(true);
    expect(shadow(26)).toContain('var(--selected)');
    expect(shadow(26)).toContain('var(--ink-strong)');
    // Bit 25 is borrowed and matches: the underline alone.
    expect(shadow(25)).toContain('var(--ink-strong)');
    expect(shadow(25)).not.toContain('var(--selected)');
  } finally {
    style.remove();
  }
});

test('the board is a real table: a caption, column headers and a header for each row', () => {
  render(<BitsBoard board={{ ...LAPTOP, prefix: 24, mask: true }} />);
  const table = screen.getByRole('table', { name: /The address in bits/ });
  expect(table.querySelector('caption')).not.toBeNull();
  expect(
    within(table)
      .getAllByRole('columnheader')
      .map((th) => th.textContent),
  ).toEqual(['Row', 'Bits', 'Address']);
  // The third row is kept for its height, but hidden, from a screen reader too.
  expect(
    within(table)
      .getAllByRole('rowheader')
      .map((th) => th.textContent),
  ).toEqual(['Laptop', 'Mask']);
  expect(table.querySelectorAll('tbody tr')).toHaveLength(3);
});

/** The derived state at a step, with the board the latest note set. */
function derivedWith(board: Board | null, step = 3): DerivedState {
  return { unit: 0, slot: { unit: 0, kind: 'step', step }, log: [], tables: {}, cues: [], board, labels: null, active: null, events: [] };
}

test('the unit’s bits panel shows the latest board a note has set', () => {
  render(<UnitPanel panel={{ type: 'bits' }} derived={derivedWith({ ...LAPTOP, prefix: 24 })} marks={[]} />);
  expect(screen.getByRole('table', { name: /The address in bits/ })).toBeTruthy();
  expect(rows()).toEqual([{ label: 'Laptop', bits: '11000000101010000000000100001010', dec: '192.168.1.10' }]);
});

test('a change within a step brings in the rows that changed; a new step shows its board settled', () => {
  const board24: Board = { ...LAPTOP, prefix: 24, mask: true };
  const net: Board = { ...board24, third: { who: 'Network', addr: '192.168.1.0', mode: 'net' } };
  const { rerender } = render(<UnitPanel panel={{ type: 'bits' }} derived={derivedWith(board24)} marks={[]} />);
  const fresh = () => [...document.querySelectorAll('tbody tr')].map((row) => row.hasAttribute('data-fresh'));
  // The first board a step shows is already there: nothing comes in.
  expect(fresh()).toEqual([false, false, false]);
  // The next note in the step adds the network row, which comes in; the rows that stay are still.
  rerender(<UnitPanel panel={{ type: 'bits' }} derived={derivedWith(net)} marks={[]} />);
  expect(fresh()).toEqual([false, false, true]);
  // A move to another step shows its board as it stands.
  rerender(<UnitPanel panel={{ type: 'bits' }} derived={derivedWith(board24, 5)} marks={[]} />);
  expect(fresh()).toEqual([false, false, false]);
});

test('while a note plays, the board shows that note’s board, as the figure plays it; paused, it is the settled one again', () => {
  const board24: Board = { ...LAPTOP, prefix: 24, mask: true };
  const net: Board = { ...board24, third: { who: 'Network', addr: '192.168.1.0', mode: 'net' } };
  const playing = { type: 'note' as const, id: 'network-24', log: {}, plain: 'Host bits all 0', board: net };
  const panel = (event: typeof playing | null) => (
    <UnitPanel panel={{ type: 'bits' }} derived={derivedWith(board24)} marks={[]} playing={event} />
  );
  const { rerender } = render(panel(playing));
  expect(rows().map((r) => r.label)).toEqual(['Laptop', 'Mask', 'Network']);
  // A note without a board leaves the board as it stands.
  const { board: _, ...noBoard } = playing;
  rerender(<UnitPanel panel={{ type: 'bits' }} derived={derivedWith(board24)} marks={[]} playing={noBoard} />);
  expect(rows().map((r) => r.label)).toEqual(['Laptop', 'Mask']);
  rerender(panel(null));
  expect(rows().map((r) => r.label)).toEqual(['Laptop', 'Mask']);
});
