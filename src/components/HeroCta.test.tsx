// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { seedProgress } from '../test/progress';
import { HeroCta } from './HeroCta';

const DHCP = 'dhcp';
// How the Internet Works' first lesson, where every Start button leads.
const INTERNET = 'what-is-http';
const INTERNET_URL = '/how-the-internet-works/what-is-http';
// The page's `knownFrom(entries)` for both tracks: each ready lesson's last position.
const KNOWN = { [INTERNET]: 7, [DHCP]: 7 };
// What Home passes as the first button, whoever is visiting.
const START = { href: INTERNET_URL, label: 'Learn how the Internet Works' };
const EYEBROW = 'Free visual lessons, no sign-up';

function cta() {
  return (
    <HeroCta known={KNOWN} start={START}>
      <h1>See how technology works.</h1>
    </HeroCta>
  );
}

const link = (name: string) => screen.getByRole('link', { name });

/** The eyebrow and the first button are the same for everyone; nothing says where a visitor is in a lesson. */
function expectHero(): void {
  expect(screen.getByText(EYEBROW)).toBeInTheDocument();
  expect(link(START.label)).toHaveAttribute('href', INTERNET_URL);
  expect(screen.queryByText(/You’re on|You finished/)).toBeNull();
  expect(screen.queryByRole('link', { name: /^Continue/ })).toBeNull();
}

function expectFirstVisit(): void {
  expectHero();
  expect(link('How a lesson works')).toHaveAttribute('href', '#how');
  expect(screen.queryByRole('link', { name: 'Browse tracks' })).toBeNull();
}

function expectReturning(): void {
  expectHero();
  expect(link('Browse tracks')).toHaveAttribute('href', '#tracks');
  expect(screen.queryByRole('link', { name: 'How a lesson works' })).toBeNull();
}

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('a first visit opens How the Internet Works or shows how a lesson works, under the free-lessons eyebrow', () => {
  render(cta());
  expectFirstVisit();
  // The page's own words sit between the eyebrow and the buttons.
  const eyebrow = screen.getByText(EYEBROW);
  const heading = screen.getByRole('heading', { name: 'See how technology works.' });
  expect(eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(heading.compareDocumentPosition(link(START.label)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('a returning visitor keeps the same eyebrow and first button, and gets Browse tracks beside it', () => {
  seedProgress({ [DHCP]: { status: 'in-progress', furthestPosition: 3 } }, DHCP);
  render(cta());
  expectReturning();
});

test('a finished last lesson is a returning visitor too, with no line saying so', () => {
  seedProgress({ [DHCP]: { status: 'finished', furthestPosition: 7 } }, DHCP);
  render(cta());
  expectReturning();
});

test('a last lesson only opened, while another has progress, is a returning visitor', () => {
  // HTTP finished, then DHCP's Overview opened and left: DHCP is the last lesson but has no record.
  seedProgress({ [INTERNET]: { status: 'finished', furthestPosition: 7 } }, DHCP);
  render(cta());
  expectReturning();
});

test('with no saved lesson progress it is a first visit, whatever lesson was last opened', () => {
  // Progress only for a lesson the site does not have.
  seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: 2 } }, 'osi-model');
  const first = render(cta());
  expectFirstVisit();
  first.unmount();

  // Opened at the Overview and left, with nothing else saved.
  seedProgress({}, DHCP);
  render(cta());
  expectFirstVisit();
});

test('a record for an unlisted lesson alone is a first visit, even when the last lesson is a ready one', () => {
  seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: 2 } }, DHCP);
  render(cta());
  expectFirstVisit();
});

test('progress with no last lesson on the site is a first visit', () => {
  seedProgress({ [DHCP]: { status: 'in-progress', furthestPosition: 3 } }, 'osi-model');
  render(cta());
  expectFirstVisit();
});

test('the server renders the first visit, then hydrates to the returning visitor without warnings', async () => {
  seedProgress({ [DHCP]: { status: 'in-progress', furthestPosition: 3 } }, DHCP);
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(cta());
  document.body.append(container);
  expectFirstVisit();

  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, cta());
  });
  expectReturning();
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
