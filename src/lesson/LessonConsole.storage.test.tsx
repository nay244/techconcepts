// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { buildEntries, neighbors, type AvailableSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import LessonConsole from './LessonConsole';

// A file of its own: a SafeStorage that has failed keeps saying so for as long as its module
// lives, and each test file gets fresh modules, so no other test sees this one's blocked storage.

const DHCP: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const entries = buildEntries(networkingTrack, { dhcp: DHCP });
const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === 'dhcp')!;

const explanation = () => screen.getByRole('region', { name: 'Explanation' });
const heading = () => within(explanation()).getByRole('heading', { level: 2 });
const playButton = () => screen.getByRole('button', { name: /^(Play|Pause|Replay|Watch again)$/ });
const logRows = () =>
  within(within(screen.getByRole('region', { name: 'Event log' })).getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .filter((row) => row.querySelector('[data-idle]') === null);

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  vi.useFakeTimers();
  // As in LessonConsole.test.tsx: tells Testing Library how to advance Vitest's fake clock.
  vi.stubGlobal('jest', { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) });
  user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  window.history.replaceState({}, '', '/networking/dhcp');
  document.documentElement.dataset.theme = 'dark';
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  window.history.replaceState({}, '', '/');
});

test('with storage blocked the lesson still plays end to end', async () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  render(
    <LessonConsole
      trackId="networking"
      trackTitle="Networking Concepts"
      lesson={DHCP}
      entry={entry}
      total={entries.length}
      next={neighbors(entries, 'dhcp').next}
      entries={entries}
    />,
  );
  expect(heading()).toHaveTextContent('Neighbor table');

  await user.click(playButton());
  for (let i = 0; i < 200 && playButton().textContent === 'Pause'; i += 1) {
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
  }
  expect(playButton()).toHaveAccessibleName('Replay');
  expect(logRows()).toHaveLength(5);

  await user.click(screen.getByRole('button', { name: 'Next step' }));
  await user.click(screen.getByRole('button', { name: 'Next step' }));
  expect(heading()).toHaveTextContent('Two questions');
  await user.click(screen.getAllByRole('button', { name: /A row for each neighbor/ })[0]!);
  expect(within(explanation()).getByText(/One row per neighbor/)).toBeInTheDocument();

  await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Light' }));
  expect(document.documentElement.dataset.theme).toBe('light');
});
