// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { validateLesson } from '../../content/define';
import type { FlowScene, Lesson, Link } from '../../content/schema';
import { fixtureLesson } from '../../content/test-fixtures';
import { deriveState } from '../../engine/timeline';
import { contrastRatio } from '../../lib/contrast';
import { tokens } from '../../styles/tokens';
import { chipSpot } from './geometry';
import NetworkView from './NetworkView';

const L: Lesson = validateLesson(fixtureLesson()).lesson;
const scene = L.scene as FlowScene;
const noop = () => undefined;

/** Every element that carries `data-kind` in the network view is a chip. */
const chips = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('[data-kind]')];

afterEach(() => {
  // @ts-expect-error: remove the stubs a test put on the prototype; jsdom has neither of these overrides.
  delete HTMLElement.prototype.animate;
  // @ts-expect-error: see above.
  delete HTMLElement.prototype.clientWidth;
  vi.restoreAllMocks();
});

/** jsdom has no Web Animations API and no layout, so a test that cares about the flight supplies both. */
function stubFlight(width = 800) {
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel }));
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
  return { animate, cancel };
}

test('draws a labelled image of the topology on a 1000 by 600 canvas', () => {
  render(<NetworkView scene={scene} state={deriveState(L, 0, 0, null)} reducedMotion={false} onOpenPacket={noop} />);
  const image = screen.getByRole('img', { name: /Laptop.*Server/ });
  expect(image.tagName.toLowerCase()).toBe('svg');
  expect(image).toHaveAttribute('viewBox', '0 0 1000 600');
});

test('the image label also says how the devices are linked', () => {
  render(<NetworkView scene={scene} state={deriveState(L, 0, 0, null)} reducedMotion={false} onOpenPacket={noop} />);
  expect(screen.getByRole('img', { name: /Links: Laptop to Server \(wired\)/ })).toBeInTheDocument();
});

test('shows every actor with its label and addresses', () => {
  render(<NetworkView scene={scene} state={deriveState(L, 0, 0, null)} reducedMotion={false} onOpenPacket={noop} />);
  for (const actor of scene.actors) {
    expect(screen.getByText(actor.label)).toBeInTheDocument();
    for (const address of actor.addresses) expect(screen.getByText(address)).toBeInTheDocument();
  }
});

test('draws a wired link as one line, a wireless link dashed and a tunnel as two parallel lines', () => {
  const links: Link[] = [
    { id: 'w', from: 'a', to: 'b', medium: 'wired' },
    { id: 'x', from: 'a', to: 'b', medium: 'wireless' },
    { id: 't', from: 'a', to: 'b', medium: 'tunnel' },
  ];
  const { container } = render(
    <NetworkView scene={{ ...scene, links }} state={deriveState(L, 0, 0, null)} reducedMotion={false} onOpenPacket={noop} />,
  );
  const lines = (id: string) => [...container.querySelectorAll(`[data-link="${id}"] line`)];
  expect(lines('w')).toHaveLength(1);
  expect(lines('w')[0]).not.toHaveAttribute('stroke-dasharray');
  expect(lines('x')).toHaveLength(1);
  expect(lines('x')[0]).toHaveAttribute('stroke-dasharray');
  expect(lines('t')).toHaveLength(2);
});

test('shows no chip while nothing is travelling', () => {
  const { container } = render(<NetworkView scene={scene} state={deriveState(L, 0, 0, null)} reducedMotion={false} onOpenPacket={noop} />);
  expect(chips(container)).toHaveLength(0);
});

test('shows one chip for the active message, carrying its kind and its label', () => {
  const { container } = render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={false} onOpenPacket={noop} />);
  const [chip, ...rest] = chips(container);
  expect(rest).toHaveLength(0);
  expect(chip).toHaveAttribute('data-kind', 'request');
  expect(chip).toHaveAttribute('data-outcome', 'delivered');
  expect(within(chip!).getByText('Hello')).toBeInTheDocument();
  expect(screen.queryByText('Dropped')).not.toBeInTheDocument();
});

test('opens the packet when a chip that has one is clicked', async () => {
  const onOpenPacket = vi.fn();
  render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={false} onOpenPacket={onOpenPacket} />);
  await userEvent.setup().click(screen.getByRole('button', { name: /Hello/ }));
  expect(onOpenPacket).toHaveBeenCalledExactlyOnceWith('p1');
});

test('a chip without a packet is plain text, not a button', () => {
  const { container } = render(<NetworkView scene={scene} state={deriveState(L, 2, 1, null)} reducedMotion={false} onOpenPacket={noop} />);
  expect(chips(container)[0]).toHaveAttribute('data-kind', 'response');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('a dropped message shows its chip as dropped, with the word Dropped', () => {
  const { container } = render(<NetworkView scene={scene} state={deriveState(L, 4, 1, null)} reducedMotion={false} onOpenPacket={noop} />);
  const [chip] = chips(container);
  expect(chip).toHaveAttribute('data-outcome', 'dropped');
  expect(within(chip!).getByText('Lost hello')).toBeInTheDocument();
  expect(within(chip!).getByText('Dropped')).toBeInTheDocument();
});

test('draws one chip per target of a message', () => {
  const state = deriveState(L, 1, 1, null);
  const message = { ...state.activeMessage!, to: ['a', 'b'] };
  const { container } = render(<NetworkView scene={scene} state={{ ...state, activeMessage: message }} reducedMotion={false} onOpenPacket={noop} />);
  expect(chips(container)).toHaveLength(2);
});

test('leaves out a target the scene does not have', () => {
  const state = deriveState(L, 1, 1, null);
  const message = { ...state.activeMessage!, to: ['b', 'ghost'] };
  const { container } = render(<NetworkView scene={scene} state={{ ...state, activeMessage: message }} reducedMotion={false} onOpenPacket={noop} />);
  expect(chips(container)).toHaveLength(1);
});

test('data-animated is false under reduced motion and true otherwise', () => {
  const state = deriveState(L, 1, 1, null);
  const { container, rerender } = render(<NetworkView scene={scene} state={state} reducedMotion={true} onOpenPacket={noop} />);
  expect(chips(container)[0]).toHaveAttribute('data-animated', 'false');
  rerender(<NetworkView scene={scene} state={state} reducedMotion={false} onOpenPacket={noop} />);
  expect(chips(container)[0]).toHaveAttribute('data-animated', 'true');
});

test('places the chip at its destination, above the device', () => {
  const { container } = render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={true} onOpenPacket={noop} />);
  const server = scene.actors.find((a) => a.id === 'b')!;
  const spot = chipSpot(server);
  expect(chips(container)[0]!.style.left).toBe(`${spot.x / 10}%`);
  expect(chips(container)[0]!.style.top).toBe(`${Math.round((spot.y / 6) * 100) / 100}%`);
});

test('a chip for a device near a side edge hangs inward from it', () => {
  const edge: FlowScene = { ...scene, actors: scene.actors.map((a) => (a.id === 'b' ? { ...a, x: 940 } : a)) };
  const { container } = render(<NetworkView scene={edge} state={deriveState(L, 1, 1, null)} reducedMotion={true} onOpenPacket={noop} />);
  expect(chips(container)[0]).toHaveAttribute('data-align', 'end');
});

test('works where the Web Animations API is missing: the chip simply sits at its destination', () => {
  expect(HTMLElement.prototype.animate).toBeUndefined();
  const { container } = render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={false} onOpenPacket={noop} />);
  expect(chips(container)).toHaveLength(1);
});

test('flies the chip along the path, ending at its resting place, over one message duration', () => {
  const { animate } = stubFlight(800);
  render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={false} onOpenPacket={noop} />);
  expect(animate).toHaveBeenCalledTimes(1);
  const [keyframes, options] = animate.mock.calls[0] as unknown as [Keyframe[], KeyframeAnimationOptions];
  // Laptop at x=200, server at x=800 on a canvas drawn 800 px wide: the chip starts 600 * 0.8 px to the left of where it rests.
  expect(keyframes.map((k) => k.transform)).toEqual(['translate(-480px, 0px)', 'translate(0px, 0px)']);
  expect(keyframes.map((k) => k.offset)).toEqual([0, 1]);
  expect(options.duration).toBe(1200);
});

test('divides the flight time by the playback speed', () => {
  const { animate } = stubFlight();
  render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={false} speed={2} onOpenPacket={noop} />);
  expect((animate.mock.calls[0] as unknown as [unknown, KeyframeAnimationOptions])[1].duration).toBe(600);
});

test('spends the flight time on each stretch in proportion to its length', () => {
  const { animate } = stubFlight(1000);
  const state = deriveState(L, 1, 1, null);
  // a (200, 300) to a router at (200, 500), then on to b (800, 300): legs of 200 and about 632.
  const withRouter: FlowScene = { ...scene, actors: [...scene.actors, { id: 'r', kind: 'router', label: 'Router', addresses: [], x: 200, y: 500 }] };
  const message = { ...state.activeMessage!, via: ['r'] };
  render(<NetworkView scene={withRouter} state={{ ...state, activeMessage: message }} reducedMotion={false} onOpenPacket={noop} />);
  const [keyframes] = animate.mock.calls[0] as unknown as [Keyframe[]];
  expect(keyframes).toHaveLength(3);
  expect(keyframes[1]!.offset).toBeCloseTo(200 / (200 + Math.hypot(600, 200)), 5);
});

test('does not fly the chip under reduced motion', () => {
  const { animate } = stubFlight();
  render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={true} onOpenPacket={noop} />);
  expect(animate).not.toHaveBeenCalled();
});

test('re-rendering with the same message does not restart the flight', () => {
  const { animate } = stubFlight();
  const state = deriveState(L, 1, 1, null);
  const { rerender } = render(<NetworkView scene={scene} state={state} reducedMotion={false} onOpenPacket={noop} />);
  rerender(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={false} onOpenPacket={() => undefined} />);
  expect(animate).toHaveBeenCalledTimes(1);
});

test('a new active message cancels the flight in progress and starts its own', () => {
  const { animate, cancel } = stubFlight();
  const { rerender } = render(<NetworkView scene={scene} state={deriveState(L, 2, 1, null)} reducedMotion={false} onOpenPacket={noop} />);
  expect(animate).toHaveBeenCalledTimes(1);
  rerender(<NetworkView scene={scene} state={deriveState(L, 2, 2, null)} reducedMotion={false} onOpenPacket={noop} />);
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(animate).toHaveBeenCalledTimes(2);
});

test('cancels the flight when the view goes away', () => {
  const { cancel } = stubFlight();
  const { unmount } = render(<NetworkView scene={scene} state={deriveState(L, 1, 1, null)} reducedMotion={false} onOpenPacket={noop} />);
  unmount();
  expect(cancel).toHaveBeenCalledTimes(1);
});

test('cancels the flight when reduced motion is switched on mid-flight', () => {
  const { cancel } = stubFlight();
  const state = deriveState(L, 1, 1, null);
  const { rerender } = render(<NetworkView scene={scene} state={state} reducedMotion={false} onOpenPacket={noop} />);
  rerender(<NetworkView scene={scene} state={state} reducedMotion={true} onOpenPacket={noop} />);
  expect(cancel).toHaveBeenCalledTimes(1);
});

// The Dropped pill is small text on a solid --blocked fill, drawn in --bg (see flow.css), so it needs 4.5:1 itself.
test.each(['dark', 'light'] as const)('the Dropped pill text reaches 4.5:1 in the %s theme', (theme) => {
  expect(contrastRatio(tokens[theme].bg, tokens[theme].blocked)).toBeGreaterThanOrEqual(4.5);
});
