// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { validateLesson } from '../../content/define';
import type { FlowScene, Lesson } from '../../content/schema';
import { fixtureLesson } from '../../content/test-fixtures';
import { deriveState, type DerivedState, type LogRow } from '../../engine/timeline';
import { formatTime } from '../../lib/format';
import SequenceView from './SequenceView';

const L: Lesson = validateLesson(fixtureLesson()).lesson;
const scene = L.scene as FlowScene;
const noop = () => undefined;

const arrows = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('[data-arrow]')];

test('heads each lifeline with the actor label and its first address, in scene order', () => {
  const { container } = render(<SequenceView scene={scene} state={deriveState(L, 0, 0, null)} onOpenPacket={noop} />);
  const lifelines = [...container.querySelectorAll('[data-lifeline]')];
  expect(lifelines.map((el) => el.getAttribute('data-lifeline'))).toEqual(['a', 'b']);
  expect(within(lifelines[0] as HTMLElement).getByText('Laptop')).toBeInTheDocument();
  expect(within(lifelines[0] as HTMLElement).getByText('192.168.1.10')).toBeInTheDocument();
  expect(within(lifelines[1] as HTMLElement).getByText('Server')).toBeInTheDocument();
  // Only the first address heads a lifeline.
  expect(screen.queryByText('00:00:5E:00:53:0A')).not.toBeInTheDocument();
});

test('draws one arrow per log row, each showing its label and its time', () => {
  const state = deriveState(L, 3, 0, null);
  const { container } = render(<SequenceView scene={scene} state={state} onOpenPacket={noop} />);
  const drawn = arrows(container);
  expect(state.log.length).toBeGreaterThan(0);
  expect(drawn).toHaveLength(state.log.length);
  state.log.forEach((row, i) => {
    expect(within(drawn[i]!).getByText(row.label)).toBeInTheDocument();
    expect(within(drawn[i]!).getByText(formatTime(row.time))).toBeInTheDocument();
    expect(drawn[i]).toHaveAttribute('data-kind', row.kind);
  });
});

test('points each arrow from the sender to the receiver, found by address', () => {
  const { container } = render(<SequenceView scene={scene} state={deriveState(L, 3, 0, null)} onOpenPacket={noop} />);
  const [first, second] = arrows(container);
  expect([first!.dataset.from, first!.dataset.to, first!.dataset.direction]).toEqual(['a', 'b', 'right']);
  expect([second!.dataset.from, second!.dataset.to, second!.dataset.direction]).toEqual(['b', 'a', 'left']);
});

test('opens the packet from an arrow that has one', async () => {
  const onOpenPacket = vi.fn();
  render(<SequenceView scene={scene} state={deriveState(L, 1, 1, null)} onOpenPacket={onOpenPacket} />);
  await userEvent.setup().click(screen.getByRole('button', { name: /Hello/ }));
  expect(onOpenPacket).toHaveBeenCalledExactlyOnceWith('p1');
});

test('an arrow without a packet is not a button', () => {
  render(<SequenceView scene={scene} state={deriveState(L, 2, 1, null)} onOpenPacket={noop} />);
  expect(screen.queryByRole('button', { name: /Hello back/ })).not.toBeInTheDocument();
  expect(screen.getByText('Hello back')).toBeInTheDocument();
});

test('marks a dropped message with the word Dropped as well as its styling', () => {
  const { container } = render(<SequenceView scene={scene} state={deriveState(L, 4, 1, null)} onOpenPacket={noop} />);
  const last = arrows(container).at(-1)!;
  expect(last).toHaveAttribute('data-outcome', 'dropped');
  expect(within(last).getByText('Dropped')).toBeInTheDocument();
  expect(arrows(container)[0]).toHaveAttribute('data-outcome', 'delivered');
});

function stateWith(rows: Partial<LogRow>[]): DerivedState {
  const base: LogRow = {
    n: 1, eventId: 'e', time: 0, src: '192.168.1.10', dst: '192.168.1.20', protocol: 'Demo', label: 'Row', summary: 's', size: 1,
    kind: 'request', outcome: 'delivered',
  };
  return { log: rows.map((r, i) => ({ ...base, n: i + 1, eventId: `e${i}`, ...r })), tables: {}, activeMessage: null, messageTotal: rows.length };
}

test('a broadcast, whose destination matches no actor, reaches across to the far lifeline', () => {
  const { container } = render(<SequenceView scene={scene} state={stateWith([{ dst: 'ff:ff:ff:ff:ff:ff' }])} onOpenPacket={noop} />);
  const [arrow] = arrows(container);
  expect([arrow!.dataset.from, arrow!.dataset.to]).toEqual(['a', 'b']);
});

test('a message from a device to itself is drawn as a loop on its own lifeline', () => {
  const { container } = render(<SequenceView scene={scene} state={stateWith([{ dst: '192.168.1.10' }])} onOpenPacket={noop} />);
  const [arrow] = arrows(container);
  expect([arrow!.dataset.from, arrow!.dataset.to, arrow!.dataset.direction]).toEqual(['a', 'a', 'self']);
});

test('still draws an arrow for a row whose addresses match no actor', () => {
  const { container } = render(<SequenceView scene={scene} state={stateWith([{ src: '203.0.113.9', dst: '203.0.113.10' }])} onOpenPacket={noop} />);
  expect(arrows(container)).toHaveLength(1);
});

test('says so when nothing has been sent yet', () => {
  const { container } = render(<SequenceView scene={scene} state={deriveState(L, 0, 0, null)} onOpenPacket={noop} />);
  expect(arrows(container)).toHaveLength(0);
  expect(screen.getByText(/messages appear here/i)).toBeInTheDocument();
});
