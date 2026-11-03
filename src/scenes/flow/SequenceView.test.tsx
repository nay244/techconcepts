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

test('points each arrow from the sender to the receiver, by actor id', () => {
  const { container } = render(<SequenceView scene={scene} state={deriveState(L, 3, 0, null)} onOpenPacket={noop} />);
  const [first, second] = arrows(container);
  expect([first!.dataset.from, first!.dataset.to, first!.dataset.direction]).toEqual(['a', 'b', 'right']);
  expect([second!.dataset.from, second!.dataset.to, second!.dataset.direction]).toEqual(['b', 'a', 'left']);
  // Laptop and server are lifelines 0 and 1: grid lines 2 and 4.
  expect(first!.style.gridColumn).toBe('2 / 4');
  expect(second!.style.gridColumn).toBe('2 / 4');
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
    n: 1, eventId: 'e', time: 0, from: 'a', to: ['b'], src: '192.168.1.10', dst: '192.168.1.20', protocol: 'Demo', label: 'Row', summary: 's', size: 1,
    kind: 'request', outcome: 'delivered',
  };
  return { log: rows.map((r, i) => ({ ...base, n: i + 1, eventId: `e${i}`, ...r })), tables: {}, activeMessage: null, messageTotal: rows.length };
}

/** A scene of the given actors, none with an address unless said, as in the DHCP lesson. */
function sceneOf(actors: [id: string, label: string, addresses?: string[]][]): FlowScene {
  return {
    ...scene,
    actors: actors.map(([id, label, addresses], i) => ({ id, kind: 'laptop', label, addresses: addresses ?? [], x: 100 + i * 100, y: 300 })),
  };
}

test('a broadcast to two devices is one arrow that runs to the farther and dots the nearer', () => {
  // DHCP shaped: the client has no address yet, the packet's addresses carry ports and match no actor,
  // and the Discover reaches both the router and the phone.
  const dhcp = sceneOf([['laptop', 'Laptop'], ['router', 'Router \u00b7 DHCP server', ['192.168.1.1']], ['phone', 'Phone']]);
  const state = stateWith([
    { label: 'DHCP Discover', kind: 'broadcast', from: 'laptop', to: ['router', 'phone'], src: '0.0.0.0:68', dst: '255.255.255.255:67' },
    { label: 'DHCP Offer', kind: 'response', from: 'router', to: ['laptop'], src: '192.168.1.1:67', dst: '255.255.255.255:68' },
  ]);
  const { container } = render(<SequenceView scene={dhcp} state={state} onOpenPacket={noop} />);
  const [discover, offer] = arrows(container);

  expect(arrows(container)).toHaveLength(2);
  expect([discover!.dataset.from, discover!.dataset.to, discover!.dataset.direction]).toEqual(['laptop', 'router phone', 'right']);
  // Laptop is lifeline 0 and phone lifeline 2: grid lines 2 and 6. The router, between them, gets one dot.
  expect(discover!.style.gridColumn).toBe('2 / 6');
  expect(discover!.querySelectorAll('.flow-arrow__stop')).toHaveLength(1);
  expect(within(discover!).getByText('from Laptop to Router \u00b7 DHCP server and Phone')).toBeInTheDocument();

  // The reply goes back, right to left, and is not the same arrow as the Discover.
  expect([offer!.dataset.from, offer!.dataset.to, offer!.dataset.direction]).toEqual(['router', 'laptop', 'left']);
  expect(offer!.style.gridColumn).toBe('2 / 4');
  expect(offer!.querySelectorAll('.flow-arrow__stop')).toHaveLength(0);
  expect(within(offer!).getByText('from Router \u00b7 DHCP server to Laptop')).toBeInTheDocument();
});

test('two rows with the same addresses are drawn between different lifelines, and a via actor gets no mark', () => {
  // Firewall shaped: a visitor's packet reaches the firewall through the internet, and the firewall then passes it
  // to the web server. Both rows carry the same src and dst, with a port on dst.
  const lab = sceneOf([['visitor', 'Visitor'], ['internet', 'Internet'], ['fw', 'Firewall'], ['web', 'Web server', ['10.0.0.10']]]);
  const addresses = { src: '203.0.113.50:51000', dst: '10.0.0.10:443' };
  const state = stateWith([
    { label: 'Probe', from: 'visitor', to: ['fw'], via: ['internet'], ...addresses, outcome: 'dropped' },
    { label: 'Probe forwarded', from: 'fw', to: ['web'], ...addresses },
  ]);
  const { container } = render(<SequenceView scene={lab} state={state} onOpenPacket={noop} />);
  const [inbound, outbound] = arrows(container);

  expect([inbound!.dataset.from, inbound!.dataset.to]).toEqual(['visitor', 'fw']);
  // Visitor (0) to firewall (2): it stops there, short of the web server, and the internet lifeline is passed through.
  expect(inbound!.style.gridColumn).toBe('2 / 6');
  expect(inbound!.querySelectorAll('.flow-arrow__stop')).toHaveLength(0);
  expect(inbound).toHaveAttribute('data-outcome', 'dropped');

  expect([outbound!.dataset.from, outbound!.dataset.to]).toEqual(['fw', 'web']);
  expect(outbound!.style.gridColumn).toBe('6 / 8');
});

test('a message to a device itself is a loop on its own lifeline', () => {
  const { container } = render(<SequenceView scene={scene} state={stateWith([{ from: 'a', to: ['a'] }])} onOpenPacket={noop} />);
  const [arrow] = arrows(container);
  expect([arrow!.dataset.from, arrow!.dataset.to, arrow!.dataset.direction]).toEqual(['a', 'a', 'self']);
  expect(arrow!.style.gridColumn).toBe('2 / 3');
});

test('says so when nothing has been sent yet', () => {
  const { container } = render(<SequenceView scene={scene} state={deriveState(L, 0, 0, null)} onOpenPacket={noop} />);
  expect(arrows(container)).toHaveLength(0);
  expect(screen.getByText(/messages appear here/i)).toBeInTheDocument();
});
