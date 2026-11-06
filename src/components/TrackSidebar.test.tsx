// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { getEntries } from '../content/registry';
import { knownFrom } from '../lib/entries';
import { PROGRESS_KEY, type LessonProgress } from '../progress/store';
import { TrackSidebar } from './TrackSidebar';

// The real track: twenty places, four of them ready.
const entries = getEntries('networking');
const known = knownFrom(entries);
const lessons = entries.map((e) => ({ key: e.key, title: e.title }));
const at = (slug: string) => entries.findIndex((e) => e.slug === slug);
const key = (slug: string) => entries[at(slug)]!.key;

const sidebar = () => (
  <TrackSidebar lessons={lessons} known={known}>
    <nav aria-label="Parts of this track">
      <p>Parts</p>
    </nav>
  </TrackSidebar>
);

function save(records: Record<string, Pick<LessonProgress, 'status' | 'furthestPosition'>>, lastLesson: string | null = null): void {
  const full = Object.fromEntries(Object.entries(records).map(([k, v]) => [k, { ...v, lastOpened: '2026-11-06T12:00:00Z' }]));
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, lessons: full, lastLesson }));
}

const segments = (container: HTMLElement) => [...container.querySelectorAll('.segbar i')].map((i) => i.className || 'none');
const title = (container: HTMLElement) => container.querySelector('.pg-title')!.textContent;

function expectFirstVisit(container: HTMLElement): void {
  expect(title(container)).toBe('Your progress');
  expect(screen.getByText('Once you start a lesson, your progress is saved in this browser. There is nothing to sign up for.')).toBeInTheDocument();
  expect(container.querySelector('.segbar')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Clear my progress' })).toBeNull();
}

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('a first visit says progress is kept in this browser, above the parts', () => {
  const { container } = render(sidebar());
  expectFirstVisit(container);
  const aside = screen.getByRole('complementary', { name: 'Your progress and the parts of this track' });
  // The parts the page hands in follow the progress card.
  const parts = screen.getByRole('navigation', { name: 'Parts of this track' });
  expect(aside).toContainElement(parts);
  expect(container.querySelector('.pg')!.compareDocumentPosition(parts) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('a returning visitor sees how many of the twenty are complete, a bar with each lesson in its place, and what is in progress', () => {
  save({
    [key('subnetting')]: { status: 'finished', furthestPosition: 9 },
    [key('dhcp')]: { status: 'in-progress', furthestPosition: 3 },
  });
  const { container } = render(sidebar());
  expect(title(container)).toBe('1 of 20 complete');
  expect(container.querySelector('.pg-title b')).toHaveTextContent('1');
  const expected = entries.map((_, i) => (i === at('subnetting') ? 'done' : i === at('dhcp') ? 'prog' : 'none'));
  expect(segments(container)).toEqual(expected);
  expect(container.querySelector('.segbar')).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByText('1 in progress: DHCP')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Clear my progress' })).toBeInTheDocument();
});

test('several in progress are named in track order; none in progress, no line', () => {
  save({
    [key('firewalls')]: { status: 'in-progress', furthestPosition: 2 },
    [key('subnetting')]: { status: 'in-progress', furthestPosition: 2 },
  });
  const first = render(sidebar());
  expect(screen.getByText('2 in progress: Subnetting, Firewalls')).toBeInTheDocument();
  expect(title(first.container)).toBe('0 of 20 complete');
  first.unmount();

  save({ [key('dhcp')]: { status: 'finished', furthestPosition: 7 } });
  const second = render(sidebar());
  expect(title(second.container)).toBe('1 of 20 complete');
  expect(second.container.querySelector('.pg-note')).toBeNull();
});

test('Clear asks first; Keep it keeps everything and goes back to the button', async () => {
  save({ [key('dhcp')]: { status: 'in-progress', furthestPosition: 3 } }, key('dhcp'));
  render(sidebar());
  await userEvent.click(screen.getByRole('button', { name: 'Clear my progress' }));
  const question = screen.getByRole('group', { name: 'Clear all progress on this device?' });
  expect(question).toHaveFocus();
  expect(screen.queryByRole('button', { name: 'Clear my progress' })).toBeNull();
  expect(window.localStorage.getItem(PROGRESS_KEY)).not.toBeNull();

  await userEvent.click(screen.getByRole('button', { name: 'Keep it' }));
  expect(screen.queryByRole('group', { name: 'Clear all progress on this device?' })).toBeNull();
  expect(screen.getByRole('button', { name: 'Clear my progress' })).toHaveFocus();
  expect(window.localStorage.getItem(PROGRESS_KEY)).not.toBeNull();
  expect(screen.getByText('1 in progress: DHCP')).toBeInTheDocument();
});

test('Clear empties progress on this device, says so, and puts focus on the progress card’s title', async () => {
  save({ [key('dhcp')]: { status: 'finished', furthestPosition: 7 } }, key('dhcp'));
  const { container } = render(sidebar());
  await userEvent.click(screen.getByRole('button', { name: 'Clear my progress' }));
  await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();
  expectFirstVisit(container);
  expect(container.querySelector('.pg-title')).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Progress cleared');
});

test('the keyboard can ask, keep, ask again and clear', async () => {
  save({ [key('dhcp')]: { status: 'in-progress', furthestPosition: 3 } }, key('dhcp'));
  const { container } = render(sidebar());
  screen.getByRole('button', { name: 'Clear my progress' }).focus();
  await userEvent.keyboard('{Enter}');
  expect(screen.getByRole('group', { name: 'Clear all progress on this device?' })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole('button', { name: 'Keep it' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: 'Clear my progress' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await userEvent.tab();
  await userEvent.keyboard('{Enter}');
  expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();
  expect(container.querySelector('.pg-title')).toHaveFocus();
});

test('the server renders the first visit, then hydrates to the returning visitor without warnings', async () => {
  save({ [key('dhcp')]: { status: 'in-progress', furthestPosition: 3 } });
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(sidebar());
  document.body.append(container);
  expectFirstVisit(container);

  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, sidebar());
  });
  expect(title(container)).toBe('0 of 20 complete');
  expect(errors).not.toHaveBeenCalled();

  act(() => root.unmount());
  container.remove();
});

// Last in the file: once the shared storage has failed it keeps saying so for as long as its module lives.
test('with storage blocked it shows the first visit', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  const { container } = render(sidebar());
  expectFirstVisit(container);
});
