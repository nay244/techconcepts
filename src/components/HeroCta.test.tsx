// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { seedProgress } from '../test/progress';
import { HeroCta, type ResumeLesson } from './HeroCta';

// What Home hands the island: each ready lesson with the words for each of its positions (resumePlaces, at build time).
const DHCP: ResumeLesson = {
  key: 'networking/dhcp',
  title: 'DHCP',
  url: '/networking/dhcp',
  places: ['the Overview', 'step 1 of 5', 'step 2 of 5', 'step 3 of 5', 'step 4 of 5', 'step 5 of 5', 'the Learn part', 'the Practice part'],
};
const INTERNET: ResumeLesson = {
  key: 'networking/how-the-internet-works',
  title: 'How the Internet Works',
  url: '/networking/how-the-internet-works',
  places: [
    'the HTTP Overview',
    'HTTP step 1 of 2',
    'HTTP step 2 of 2',
    'the HTTP Learn part',
    'the HTTP Practice part',
    'the DNS Overview',
    'DNS step 1 of 1',
    'the DNS Learn part',
    'the DNS Practice part',
  ],
};
const LESSONS = [INTERNET, DHCP];
// The page's `knownFrom(entries)`: each ready lesson's last position.
const KNOWN = { [INTERNET.key]: 8, [DHCP.key]: 7 };

function cta() {
  return (
    <HeroCta lessons={LESSONS} known={KNOWN} startUrl={INTERNET.url}>
      <h1>See how technology works.</h1>
    </HeroCta>
  );
}

const link = (name: string) => screen.getByRole('link', { name });

function expectFirstVisit(): void {
  expect(screen.getByText('Free visual lessons, no sign-up')).toBeInTheDocument();
  expect(link('Start learning')).toHaveAttribute('href', INTERNET.url);
  expect(link('How a lesson works')).toHaveAttribute('href', '#how');
  expect(screen.queryByRole('link', { name: /^Continue/ })).toBeNull();
}

function expectReturning(eyebrow: string, title: string, href: string): void {
  expect(screen.getByText(eyebrow)).toBeInTheDocument();
  expect(link(`Continue ${title}`)).toHaveAttribute('href', href);
  expect(link('Browse tracks')).toHaveAttribute('href', '#tracks');
  expect(screen.queryByRole('link', { name: 'Start learning' })).toBeNull();
  expect(screen.queryByText('Free visual lessons, no sign-up')).toBeNull();
}

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('a first visit starts lesson 1 or shows how a lesson works, under the free-lessons eyebrow', () => {
  render(cta());
  expectFirstVisit();
  // The page's own words sit between the eyebrow and the buttons.
  const eyebrow = screen.getByText('Free visual lessons, no sign-up');
  const heading = screen.getByRole('heading', { name: 'See how technology works.' });
  expect(eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(heading.compareDocumentPosition(link('Start learning')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('a returning visitor continues the last lesson at its saved step, in the mockup’s words', () => {
  seedProgress({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, DHCP.key);
  render(cta());
  expectReturning('You’re on step 3 of 5 in DHCP', 'DHCP', '/networking/dhcp?step=3');
});

test('every place reads as one sentence: "You’re on <place> in <lesson>"', () => {
  const cases: [string, number, string][] = [
    [DHCP.key, 6, 'You’re on the Learn part in DHCP'],
    [INTERNET.key, 1, 'You’re on HTTP step 1 of 2 in How the Internet Works'],
    [INTERNET.key, 4, 'You’re on the HTTP Practice part in How the Internet Works'],
    [INTERNET.key, 5, 'You’re on the DNS Overview in How the Internet Works'],
    [INTERNET.key, 6, 'You’re on DNS step 1 of 1 in How the Internet Works'],
  ];
  for (const [key, position, words] of cases) {
    seedProgress({ [key]: { status: 'in-progress', furthestPosition: position } }, key);
    const { unmount } = render(cta());
    const lesson = LESSONS.find((l) => l.key === key)!;
    expectReturning(words, lesson.title, `${lesson.url}?step=${position}`);
    unmount();
  }
});

test('a finished last lesson says so, with the ring full, and is continued from its Overview', () => {
  seedProgress({ [DHCP.key]: { status: 'finished', furthestPosition: 7 } }, DHCP.key);
  const { container } = render(cta());
  expectReturning('You finished DHCP', 'DHCP', '/networking/dhcp');
  expect(screen.queryByText(/You’re on/)).toBeNull();
  const ring = container.querySelectorAll('.eyebrow circle')[1]!;
  expect(ring.getAttribute('stroke-dasharray')).toBe('47.1 100');
});

test('a last lesson only opened, while another has progress, is continued from its Overview', () => {
  // Lesson 1 finished, then DHCP's Overview opened and left: DHCP is the last lesson but has no record.
  seedProgress({ [INTERNET.key]: { status: 'finished', furthestPosition: 8 } }, DHCP.key);
  const { container } = render(cta());
  expectReturning('You’re on the Overview in DHCP', 'DHCP', '/networking/dhcp');
  const ring = container.querySelectorAll('.eyebrow circle')[1]!;
  expect(ring.getAttribute('stroke-dasharray')).toBe('0.0 100');
});

test('with no saved lesson progress it is a first visit, whatever lesson was last opened', () => {
  // Progress only for a lesson the site does not have.
  seedProgress({ 'networking/osi-model': { status: 'in-progress', furthestPosition: 2 } }, 'networking/osi-model');
  const first = render(cta());
  expectFirstVisit();
  first.unmount();

  // Opened at the Overview and left, with nothing else saved.
  seedProgress({}, DHCP.key);
  render(cta());
  expectFirstVisit();
});

test('progress with no last lesson on the site is a first visit', () => {
  seedProgress({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, 'networking/osi-model');
  render(cta());
  expectFirstVisit();
});

test('the server renders the first visit, then hydrates to the returning visitor without warnings', async () => {
  seedProgress({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, DHCP.key);
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
