// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { buildEntries } from '../../content/registry';
import type { AvailableSummary } from '../../content/registry';
import type { Lesson } from '../../content/schema';
import { liftedFixture, makeLesson } from '../../content/test-fixtures';
import { networkingTrack } from '../../content/tracks';
import { knownFrom } from '../../lib/entries';
import { seedProgress } from '../../test/progress';
import TrackPanelProgress from './TrackPanelProgress';

const lessons: Record<string, Lesson> = {
  dhcp: liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP', subtitle: 'Getting an address automatically', certTags: ['network-plus'] })),
  firewalls: liftedFixture(makeLesson({ slug: 'firewalls', title: 'Firewalls', certTags: ['network-plus'] })),
};
const entries = buildEntries(networkingTrack, lessons, () => 'networking');
const available = entries.filter((e): e is AvailableSummary => e.available);
const known = knownFrom(entries);
const first = available[0]!;
const dhcp = available.find((e) => e.slug === 'dhcp')!;

const panel = (list = entries) => (
  <TrackPanelProgress entries={list} known={known} trackUrl="/networking">
    {null}
  </TrackPanelProgress>
);
const cardOf = () => document.querySelector('a.next')!;

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('TrackPanelProgress', () => {
  test('a first visit starts at the first ready lesson', () => {
    render(panel());
    const start = screen.getByRole('link', { name: 'Start' });
    expect(start).toHaveAttribute('href', first.url);
    expect(screen.getByRole('link', { name: 'See the whole track' })).toHaveAttribute('href', '/networking');
    expect(within(cardOf() as HTMLElement).getByText('Start here')).toBeInTheDocument();
    expect(cardOf()).toHaveAttribute('href', first.url);
    expect(cardOf()).toHaveClass('lift');
    expect(document.querySelector('.strip__sq i[data-state="current"]')).toBeNull();
  });

  test('a lesson in progress is the one to continue', () => {
    seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 4 } }, 'dhcp');
    render(panel());
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${dhcp.url}?step=4`);
    expect(within(cardOf() as HTMLElement).getByText('Up next')).toBeInTheDocument();
    expect(cardOf()).toHaveAttribute('href', `${dhcp.url}?step=4`);
    expect(cardOf().textContent).toContain('Lesson ' + String(dhcp.number).padStart(2, '0') + ' · Getting an address automatically');
    expect(document.querySelectorAll('.strip__sq i[data-state="current"]')).toHaveLength(1);
  });

  test('a finished lesson makes the next unfinished one Start', () => {
    seedProgress({ [first.key]: { status: 'finished', furthestPosition: first.maxPosition } }, first.key);
    render(panel());
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', available[1]!.url);
    expect(within(cardOf() as HTMLElement).getByText('Up next')).toBeInTheDocument();
  });

  test('everything ready finished offers Watch again', () => {
    seedProgress(Object.fromEntries(available.map((e) => [e.key, { status: 'finished' as const, furthestPosition: e.maxPosition }])), first.key);
    render(panel());
    expect(screen.getByRole('link', { name: 'Watch again' })).toBeInTheDocument();
    expect(within(cardOf() as HTMLElement).getByText('✓ Done so far')).toBeInTheDocument();
  });

  test('blocked storage shows the first-visit render without an error', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    render(panel());
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', first.url);
    expect(within(cardOf() as HTMLElement).getByText('Start here')).toBeInTheDocument();
  });

  test('with no ready lesson it still draws the strip and nothing else', () => {
    const none = entries.filter((e) => !e.available);
    render(panel(none));
    expect(document.querySelector('.strip')).not.toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(document.querySelector('.next')).toBeNull();
  });

  test('puts the lesson figure in the card', () => {
    render(
      <TrackPanelProgress entries={entries} known={known} trackUrl="/networking" {...{ [`art${first.number}`]: <svg data-testid="fig" /> }}>
        {null}
      </TrackPanelProgress>,
    );
    expect(within(cardOf() as HTMLElement).getByTestId('fig')).toBeInTheDocument();
  });
});
