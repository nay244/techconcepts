// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { seedProgress } from '../test/progress';
import { TrackCardStatus } from './TrackCardStatus';

const KNOWN = { dhcp: 7, subnetting: 6 };
const status = () => <TrackCardStatus trackId="networking" known={KNOWN} planned={20} />;

const dasharray = (container: HTMLElement) => container.querySelector('.ring circle + circle')?.getAttribute('stroke-dasharray');

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('a first visit, and the server render, show nothing', () => {
  expect(renderToString(status())).toBe('');
  const { container } = render(status());
  expect(container).toBeEmptyDOMElement();
});

test('the track opened last gets the tab', () => {
  seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 3 } }, 'dhcp', 'networking');
  render(status());
  expect(screen.getByText('Last opened')).toHaveClass('tab-here');
});

test('another track opened last: no tab', () => {
  seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 3 } }, 'dhcp', 'how-the-internet-works');
  render(status());
  expect(screen.queryByText('Last opened')).toBeNull();
  expect(screen.getByText('1 in progress')).toBeInTheDocument();
});

test('a last lesson this track does not have: no tab', () => {
  seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 3 } }, 'osi-model', 'networking');
  render(status());
  expect(screen.queryByText('Last opened')).toBeNull();
});

test('finished lessons fill the ring: "1 of 20 done"', () => {
  seedProgress({ dhcp: { status: 'finished', furthestPosition: 7 }, subnetting: { status: 'in-progress', furthestPosition: 2 } });
  const { container } = render(status());
  expect(screen.getByText('1 of 20 done')).toBeInTheDocument();
  // 2π × 7.5 × 1/20 of the way round.
  expect(dasharray(container)).toBe('2.4 100');
  expect(container.querySelector('.ring svg')).toHaveAttribute('aria-hidden', 'true');
});

test('started but none finished: "1 in progress", ring empty', () => {
  seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 3 } });
  const { container } = render(status());
  expect(screen.getByText('1 in progress')).toBeInTheDocument();
  expect(dasharray(container)).toBe('0.0 100');
});

test('a record for a lesson the track does not list: no ring', () => {
  seedProgress({ 'osi-model': { status: 'finished', furthestPosition: 4 } });
  const { container } = render(status());
  expect(container).toBeEmptyDOMElement();
});

test('hydrates from the empty server render without warnings', async () => {
  seedProgress({ dhcp: { status: 'finished', furthestPosition: 7 } }, 'dhcp', 'networking');
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(status());
  document.body.append(container);
  expect(container).toBeEmptyDOMElement();

  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, status());
  });
  expect(screen.getByText('Last opened')).toBeInTheDocument();
  expect(screen.getByText('1 of 20 done')).toBeInTheDocument();
  expect(errors).not.toHaveBeenCalled();

  act(() => root.unmount());
  container.remove();
});

// Last in the file: once the shared storage has failed it keeps saying so for as long as its module lives.
test('storage blocked: nothing', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  const { container } = render(status());
  expect(container).toBeEmptyDOMElement();
});
