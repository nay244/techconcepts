// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { getEntries, trackTotals } from '../content/registry';
import { knownFrom } from '../lib/entries';
import { seedProgress } from '../test/progress';
import { TrackCardProgress } from './TrackCardProgress';

// The real track, as Home builds the card from it.
const entries = getEntries('networking');
const known = knownFrom(entries);
const totals = trackTotals(entries);

const card = () => <TrackCardProgress known={known} totals={totals} />;

const segments = (container: HTMLElement) => [...container.querySelectorAll('.segbar i')].map((i) => i.className || 'none');

function expectFirstVisit(container: HTMLElement): void {
  expect(screen.getByText('4 of 19 lessons ready')).toBeInTheDocument();
  expect(screen.getByText('Open track')).toBeInTheDocument();
  expect(container.querySelector('.segbar')).toBeNull();
}

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('a first visit reads the ready lessons, counted from the track', () => {
  expect(totals).toEqual({ available: 4, planned: 19 });
  const { container } = render(card());
  expectFirstVisit(container);
});

test('a returning visitor sees done and in progress, with one bar segment per lesson', () => {
  seedProgress({
    'dhcp': { status: 'finished', furthestPosition: 7 },
    'subnetting': { status: 'in-progress', furthestPosition: 2 },
    'firewalls': { status: 'in-progress', furthestPosition: 1 },
  });
  const { container } = render(card());
  expect(screen.getByText('1 of 19 done, 2 in progress')).toBeInTheDocument();
  expect(screen.getByText('Continue')).toBeInTheDocument();
  expect(screen.queryByText('4 of 19 lessons ready')).toBeNull();
  // Done first, then in progress, then the rest; the bar repeats the words, so it is hidden from screen readers.
  expect(segments(container)).toEqual(['done', 'prog', 'prog', ...Array<string>(16).fill('none')]);
  expect(container.querySelector('.segbar')).toHaveAttribute('aria-hidden', 'true');
});

test('progress saved only for lessons the track does not have is still a first visit', () => {
  // A lesson not in this track (a planned one, IP Address), and a lesson of another track.
  seedProgress({ 'ip-address': { status: 'finished', furthestPosition: 4 }, 'what-is-http': { status: 'finished', furthestPosition: 7 } });
  const { container } = render(card());
  expectFirstVisit(container);
});

test('the server renders the first visit, then hydrates to the returning visitor without warnings', async () => {
  seedProgress({ 'dhcp': { status: 'in-progress', furthestPosition: 3 } });
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(card());
  document.body.append(container);
  expectFirstVisit(container);

  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, card());
  });
  expect(screen.getByText('0 of 19 done, 1 in progress')).toBeInTheDocument();
  expect(segments(container)).toHaveLength(19);
  expect(errors).not.toHaveBeenCalled();

  act(() => root.unmount());
  container.remove();
});

// Last in the file: once the shared storage has failed it keeps saying so for as long as its module lives.
test('with storage blocked it shows the first visit', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  const { container } = render(card());
  expectFirstVisit(container);
});
