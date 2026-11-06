// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { buildEntries, trackTotals } from '../content/registry';
import type { AvailableSummary } from '../content/registry';
import { makeLesson } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import { PROGRESS_KEY } from '../progress/store';
import { ResetProgress } from './ResetProgress';
import { TrackLessonList } from './TrackLessonList';

// No lesson files exist yet, so DHCP and Firewalls are built from fixtures, which
// need the stand-in figure parts to validate.
// The real lessons load here too (through the registry), so the fixture's parts are added to the real ones.
vi.mock('../art/scenes/parts', async (importOriginal) => ({
  FIGURE_PARTS: (await import('../content/test-fixtures')).withFixtureParts(
    (await importOriginal<typeof import('../art/scenes/parts')>()).FIGURE_PARTS,
  ),
}));

const entries = buildEntries(networkingTrack, {
  dhcp: validateLesson(makeLesson({ slug: 'dhcp', title: 'DHCP', certTags: ['network-plus', 'ccna'] })).lesson,
  firewalls: validateLesson(makeLesson({ slug: 'firewalls', title: 'Firewalls', certTags: ['network-plus', 'security-plus'] })).lesson,
});
const available = entries.filter((e): e is AvailableSummary => e.available);
const { planned } = trackTotals(entries);
const dhcp = available.find((e) => e.slug === 'dhcp')!;

function save(lessons: Record<string, { status: 'in-progress' | 'finished'; furthestPosition: number }>, lastLesson: string | null): void {
  const full = Object.fromEntries(Object.entries(lessons).map(([k, v]) => [k, { ...v, lastOpened: '2026-11-03T12:00:00Z' }]));
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, lessons: full, lastLesson }));
}

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/networking');
});
afterEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('TrackLessonList', () => {
  const list = () => render(<TrackLessonList trackId="networking" entries={entries} planned={planned} />);

  test('server-rendered content lists every lesson, with unavailable ones marked Coming soon', () => {
    list();
    for (const e of entries) expect(screen.getByText(e.title)).toBeInTheDocument();
    expect(screen.getAllByText('Coming soon')).toHaveLength(planned - available.length);
    expect(screen.getByRole('link', { name: 'Firewalls' })).toHaveAttribute('href', '/networking/firewalls');
    expect(screen.queryByRole('link', { name: 'OSI Model' })).toBeNull();
  });

  test('?for= filters to lessons with that tag', () => {
    window.history.replaceState(null, '', '/networking?for=security-plus');
    list();
    expect(screen.getByText('Firewalls')).toBeInTheDocument();
    expect(screen.queryByText('DHCP')).toBeNull();
    expect(screen.getByRole('button', { name: 'CompTIA Security+' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('an unknown ?for= shows everything', () => {
    window.history.replaceState(null, '', '/networking?for=bogus');
    list();
    expect(screen.getByText('DHCP')).toBeInTheDocument();
    expect(screen.getByText('Firewalls')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('chips filter and keep the URL in step with replaceState', async () => {
    const before = window.history.length;
    list();
    await userEvent.click(screen.getByRole('button', { name: 'CompTIA Security+' }));
    expect(window.location.search).toBe('?for=security-plus');
    expect(screen.queryByText('DHCP')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(window.location.search).toBe('');
    expect(screen.getByText('DHCP')).toBeInTheDocument();
    expect(window.history.length).toBe(before);
  });

  test('rows say Finished or In progress in words, and the progress line counts', () => {
    save(
      {
        [dhcp.key]: { status: 'finished', furthestPosition: dhcp.maxPosition },
        'networking/firewalls': { status: 'in-progress', furthestPosition: 2 },
      },
      dhcp.key,
    );
    list();
    const dhcpRow = screen.getByRole('heading', { name: 'DHCP' }).closest('li')!;
    expect(within(dhcpRow).getByText('Finished')).toBeInTheDocument();
    const fwRow = screen.getByRole('heading', { name: 'Firewalls' }).closest('li')!;
    expect(within(fwRow).getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText(`1 of ${planned} complete`)).toBeInTheDocument();
  });

  test('ResetProgress beside the list updates markers and the progress line at once', async () => {
    save({ [dhcp.key]: { status: 'finished', furthestPosition: dhcp.maxPosition } }, dhcp.key);
    render(
      <>
        <ResetProgress />
        <TrackLessonList trackId="networking" entries={entries} planned={planned} />
      </>,
    );
    expect(screen.getByText(`1 of ${planned} complete`)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset progress' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText(`0 of ${planned} complete`)).toBeInTheDocument();
    expect(screen.queryByText('Finished')).toBeNull();
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
});
