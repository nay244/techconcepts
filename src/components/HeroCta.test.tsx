// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { PROGRESS_KEY, type LessonProgress } from '../progress/store';
import { HeroCta, type ResumeLesson } from './HeroCta';

// What Home hands the island: each ready lesson with the words for each of its positions (resumeLabel, at build time).
const DHCP: ResumeLesson = {
  key: 'networking/dhcp',
  title: 'DHCP',
  url: '/networking/dhcp',
  places: ['Overview', 'step 1 of 5', 'step 2 of 5', 'step 3 of 5', 'step 4 of 5', 'step 5 of 5', 'Learn', 'Practice'],
};
const INTERNET: ResumeLesson = {
  key: 'networking/how-the-internet-works',
  title: 'How the Internet Works',
  url: '/networking/how-the-internet-works',
  places: ['HTTP, Overview', 'HTTP, step 1 of 2', 'HTTP, step 2 of 2', 'HTTP, Learn', 'HTTP, Practice', 'DNS, Overview', 'DNS, step 1 of 1', 'DNS, Learn', 'DNS, Practice'],
};
const LESSONS = [INTERNET, DHCP];

function cta() {
  return (
    <HeroCta lessons={LESSONS} startUrl={INTERNET.url} lessonsUrl="/networking">
      <h1>See how technology works.</h1>
    </HeroCta>
  );
}

function save(lessons: Record<string, Pick<LessonProgress, 'status' | 'furthestPosition'>>, lastLesson: string | null): void {
  const full = Object.fromEntries(Object.entries(lessons).map(([k, v]) => [k, { ...v, lastOpened: '2026-11-05T12:00:00Z' }]));
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, lessons: full, lastLesson }));
}

const link = (name: string) => screen.getByRole('link', { name });

function expectFirstVisit(): void {
  expect(screen.getByText('Free visual lessons, no sign-up')).toBeInTheDocument();
  expect(link('Start learning')).toHaveAttribute('href', INTERNET.url);
  expect(link('See the lessons')).toHaveAttribute('href', '/networking');
  expect(screen.queryByRole('link', { name: /^Continue/ })).toBeNull();
}

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('a first visit starts lesson 1 or shows the lessons, under the free-lessons eyebrow', () => {
  render(cta());
  expectFirstVisit();
  // The page's own words sit between the eyebrow and the buttons.
  const eyebrow = screen.getByText('Free visual lessons, no sign-up');
  const heading = screen.getByRole('heading', { name: 'See how technology works.' });
  expect(eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(heading.compareDocumentPosition(link('Start learning')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('a returning visitor continues the last lesson at its saved step, and the eyebrow says where they are', () => {
  save({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, DHCP.key);
  render(cta());
  expect(screen.getByText('You’re on step 3 of 5 in DHCP')).toBeInTheDocument();
  expect(link('Continue DHCP')).toHaveAttribute('href', '/networking/dhcp?step=3');
  expect(link('Browse tracks')).toHaveAttribute('href', '#tracks');
  expect(screen.queryByRole('link', { name: 'Start learning' })).toBeNull();
  expect(screen.queryByText('Free visual lessons, no sign-up')).toBeNull();
});

test('in a lesson of many units the eyebrow names the unit too', () => {
  save({ [INTERNET.key]: { status: 'in-progress', furthestPosition: 6 } }, INTERNET.key);
  render(cta());
  expect(screen.getByText('You’re on DNS, step 1 of 1 in How the Internet Works')).toBeInTheDocument();
  expect(link('Continue How the Internet Works')).toHaveAttribute('href', `${INTERNET.url}?step=6`);
});

test('a finished last lesson is continued from its start', () => {
  save({ [DHCP.key]: { status: 'finished', furthestPosition: 7 } }, DHCP.key);
  render(cta());
  expect(screen.getByText('You finished DHCP')).toBeInTheDocument();
  expect(link('Continue DHCP')).toHaveAttribute('href', '/networking/dhcp');
});

test('progress that names no lesson on the site, or a lesson only opened, is still a first visit', () => {
  save({ 'networking/osi-model': { status: 'in-progress', furthestPosition: 2 } }, 'networking/osi-model');
  const { unmount } = render(cta());
  expectFirstVisit();
  unmount();

  // Opened at the Overview and left: the lesson is the last one opened, but it has no record yet.
  save({}, DHCP.key);
  render(cta());
  expectFirstVisit();
});

test('the server renders the first visit, then hydrates to the returning visitor without warnings', async () => {
  save({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, DHCP.key);
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(cta());
  document.body.append(container);
  expectFirstVisit();

  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, cta());
  });
  expect(link('Continue DHCP')).toBeInTheDocument();
  expect(errors).not.toHaveBeenCalled();

  act(() => root.unmount());
  container.remove();
});

// Last in the file: once the shared storage has failed it keeps saying so for as long as its module lives.
test('with storage blocked it shows the first visit', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  render(cta());
  expectFirstVisit();
});
