// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { buildEntries, trackTotals } from '../content/registry';
import type { AvailableSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import { makeLesson } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import { knownFrom } from '../lib/entries';
import { presentTags, trackParts } from '../lib/track';
import { PROGRESS_KEY } from '../progress/store';
import { ResetProgress } from './ResetProgress';
import { TrackLessons } from './TrackLessons';
import { TrackSidebar } from './TrackSidebar';

// The track here is built from fixtures filed as DHCP and Firewalls, while the real lessons load too (through the
// registry), so the figure parts are the real ones with the fixture's added: each lesson validates on its own figure.
vi.mock('../art/scenes/parts', async (importOriginal) => ({
  FIGURE_PARTS: (await import('../content/test-fixtures')).withFixtureParts(
    (await importOriginal<typeof import('../art/scenes/parts')>()).FIGURE_PARTS,
  ),
}));

const lessons: Record<string, Lesson> = {
  dhcp: validateLesson(makeLesson({ slug: 'dhcp', title: 'DHCP', certTags: ['network-plus', 'ccna'] })).lesson,
  firewalls: validateLesson(makeLesson({ slug: 'firewalls', title: 'Firewalls', certTags: ['network-plus', 'security-plus'] })).lesson,
};
const entries = buildEntries(networkingTrack, lessons);
const available = entries.filter((e): e is AvailableSummary => e.available);
const { planned } = trackTotals(entries);
const known = knownFrom(entries);
const parts = trackParts(networkingTrack, entries, (e) => lessons[e.slug]!);
const dhcp = available.find((e) => e.slug === 'dhcp')!;

function save(records: Record<string, { status: 'in-progress' | 'finished'; furthestPosition: number }>, lastLesson: string | null): void {
  const full = Object.fromEntries(Object.entries(records).map(([k, v]) => [k, { ...v, lastOpened: '2026-11-03T12:00:00Z' }]));
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, lessons: full, lastLesson }));
}

beforeEach(() => window.localStorage.clear());

// The track page's islands and About's ResetProgress share one progress store: a change made in one shows in the
// others at once.
describe('the track page', () => {
  const page = () => (
    <>
      <ResetProgress />
      <TrackSidebar lessons={entries.map((e) => ({ key: e.key, title: e.title }))} known={known} />
      <TrackLessons parts={parts} tags={presentTags(entries)} known={known} />
    </>
  );
  const complete = (container: HTMLElement) => container.querySelector('.pg-title')!.textContent;
  const dhcpCard = () => screen.getByRole('link', { name: 'DHCP' }).closest('li')!;

  test('ResetProgress beside the track clears its progress card and lesson cards at once', async () => {
    save({ [dhcp.key]: { status: 'finished', furthestPosition: dhcp.maxPosition } }, dhcp.key);
    const { container } = render(page());
    expect(complete(container)).toBe(`1 of ${planned} complete`);
    expect(within(dhcpCard()).getByText('Finished')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(complete(container)).toBe('Your progress');
    expect(screen.queryByText('Finished')).toBeNull();
    expect(within(dhcpCard()).getByText('Start lesson')).toBeInTheDocument();
  });

  test('Clear in the sidebar clears the lesson cards beside it at once', async () => {
    save({ 'networking/firewalls': { status: 'in-progress', furthestPosition: 2 } }, 'networking/firewalls');
    render(page());
    expect(screen.getByText('In progress')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear my progress' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();
    expect(screen.queryByText('In progress')).toBeNull();
    expect(screen.getAllByText('Start lesson')).toHaveLength(available.length);
  });
});

describe('ResetProgress', () => {
  test('asks first, then clears techconcepts:v1 and announces it', async () => {
    save({ [dhcp.key]: { status: 'finished', furthestPosition: 3 } }, dhcp.key);
    render(<ResetProgress />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    expect(screen.getByRole('group', { name: 'Reset all progress on this device?' })).toHaveFocus();
    expect(window.localStorage.getItem(PROGRESS_KEY)).not.toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Progress cleared');
    expect(screen.getByRole('button', { name: 'Reset progress' })).toHaveFocus();
  });

  test('Cancel keeps progress and returns focus to the button', async () => {
    save({ [dhcp.key]: { status: 'finished', furthestPosition: 3 } }, dhcp.key);
    render(<ResetProgress />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(window.localStorage.getItem(PROGRESS_KEY)).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Reset progress' })).toHaveFocus();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  test('its row has About’s look: a small button, then the question in words, with Reset as the primary button', async () => {
    save({ [dhcp.key]: { status: 'finished', furthestPosition: 3 } }, dhcp.key);
    const { container } = render(<ResetProgress />);
    expect(container.firstElementChild).toHaveClass('a-reset');
    expect(screen.getByRole('button', { name: 'Reset progress' })).toHaveClass('btn', 'btn--small');
    expect(screen.getByRole('button', { name: 'Reset progress' })).not.toHaveClass('btn--primary');

    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    const group = screen.getByRole('group', { name: 'Reset all progress on this device?' });
    // The words are seen once and heard once: the group's name says them, so the line itself is hidden from AT.
    const question = within(group).getByText('Reset all progress on this device?');
    expect(question).toHaveClass('q');
    expect(question).toHaveAttribute('aria-hidden', 'true');
    const [reset, cancel] = within(group).getAllByRole('button');
    expect(reset).toHaveTextContent('Reset');
    expect(reset).toHaveClass('btn', 'btn--small', 'btn--primary');
    expect(cancel).toHaveTextContent('Cancel');
    expect(cancel).toHaveClass('btn', 'btn--small');
    expect(cancel).not.toHaveClass('btn--primary');
  });

  test('its live region is on the page from the start and stays while the question is open', async () => {
    save({ [dhcp.key]: { status: 'finished', furthestPosition: 3 } }, dhcp.key);
    render(<ResetProgress />);
    const status = screen.getByRole('status');
    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    expect(screen.getByRole('status')).toBe(status);
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Progress cleared');
  });
});

// Last in the file: once the shared storage has failed it keeps saying so for as long as its module lives.
test('ResetProgress offers nothing while storage is blocked, and its live region stays empty', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  render(<ResetProgress />);
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});
