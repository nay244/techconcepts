// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { CERT_TAGS } from '../content/certs';
import { buildEntries, getEntries, getLesson, type AvailableSummary } from '../content/registry';
import { liftedFixture, makeTwoUnitLesson } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { knownFrom } from '../lib/entries';
import { presentTags, trackParts } from '../lib/track';
import { FakeObserver } from '../test/fake-io';
import { seedProgress } from '../test/progress';
import { TrackLessons } from './TrackLessons';

// The real track, as the page builds the island's props from it.
const entries = getEntries('networking');
const known = knownFrom(entries);
const parts = trackParts(networkingTrack, entries, (e: AvailableSummary) => getLesson(e.slug)!);
const tags = presentTags(entries);
const key = (slug: string) => entries.find((e) => e.slug === slug)!.key;

// The page hands each ready lesson's figure in as a slot named after its number (static HTML in the real page).
const lessons = () => (
  <TrackLessons parts={parts} tags={tags} known={known} art7={<svg data-testid="art-7" />} art16={<svg data-testid="art-16" />} />
);

const chip = (name: string) => screen.getByRole('button', { name });
const card = (title: string) => screen.getByRole('link', { name: title }).closest('li')!;
const shownTitles = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
const pressed = () => screen.getAllByRole('button').filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.textContent);

function expectEverything(): void {
  for (const e of entries) expect(screen.getByText(e.title)).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6);
}

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/networking');
});
afterEach(() => {
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  // Anything a test put on the page outside the island (the spy test's parts list).
  for (const el of document.querySelectorAll('[data-fixture]')) el.remove();
});

test('every lesson is listed by part: ready ones as cards that link, the rest as rows that do not', () => {
  render(lessons());
  expectEverything();
  expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(networkingTrack.parts.map((p) => p.title));
  expect(shownTitles()).toEqual(['Subnetting', 'DHCP', 'Firewalls']);
  expect(screen.getByRole('link', { name: 'Firewalls' })).toHaveAttribute('href', '/networking/firewalls');
  expect(screen.queryByRole('link', { name: 'OSI Model' })).toBeNull();

  // A part with ready lessons says how many; a part with none says they are all coming soon.
  const between = screen.getByRole('region', { name: 'Getting between networks' });
  expect(within(between).getByText('Part 3')).toBeInTheDocument();
  expect(between.querySelector('.part-c')).toHaveTextContent('2 of 3 ready');
  expect(within(between).getAllByText('Coming soon')).toHaveLength(1);
  const big = screen.getByRole('region', { name: 'The big picture' });
  expect(big.querySelector('.part-c')).toHaveTextContent('2 lessons, coming soon');
  const local = screen.getByRole('region', { name: 'Addresses & the local network' });
  expect(local.querySelector('.part-c')).toHaveTextContent('4 lessons, coming soon');
  expect(within(local).getByText('IP Address').closest('li')).toHaveTextContent('03IP Address');
});

test('a lesson of many units shows how many protocols it has before its exams', () => {
  // No ready lesson has many units since the split, so a two-unit fixture stands in as HTTP in How the Internet Works.
  const two = liftedFixture(makeTwoUnitLesson({ slug: 'what-is-http', title: 'HTTP' }));
  const tour = buildEntries(internetTrack, { 'what-is-http': two }, () => 'how-the-internet-works');
  const tourParts = trackParts(internetTrack, tour, () => two);
  render(<TrackLessons parts={tourParts} tags={presentTags(tour)} known={knownFrom(tour)} art1={<svg data-testid="art-1" />} />);
  const http = card('HTTP');
  expect(within(http).getByText('Lesson 01')).toBeInTheDocument();
  expect(within(http).getByText(two.subtitle)).toBeInTheDocument();
  const meta = within(http).getByRole('list', { name: 'Protocols and exams' });
  expect(within(meta).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
    '2 protocols',
    ...two.certTags.map((t) => CERT_TAGS[t]),
  ]);
  expect(within(http).getByTestId('art-1')).toBeInTheDocument();
});

/** How the Internet Works as its page builds the island: 14 ready lessons, none with exam tags until its audit. */
function tourLessons() {
  const tour = getEntries('how-the-internet-works');
  const tourParts = trackParts(internetTrack, tour, (e: AvailableSummary) => getLesson(e.slug)!);
  return render(<TrackLessons parts={tourParts} tags={presentTags(tour)} known={knownFrom(tour)} />);
}

test('a ready lesson with nothing for its meta line draws no list', () => {
  tourLessons();
  const http = card('HTTP');
  expect(http.querySelector('ul.l-meta')).toBeNull();
  expect(within(http).queryByRole('list')).toBeNull();
});

test('a track whose lessons carry no exam tags has no filter', () => {
  tourLessons();
  expect(screen.queryByRole('group', { name: 'Show lessons for' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'All' })).toBeNull();
  expect(shownTitles()).toHaveLength(14);
});

test('a one-unit lesson has no protocols chip, and its figure comes from its number', () => {
  render(lessons());
  expect(within(card('Subnetting')).getByTestId('art-7')).toBeInTheDocument();
  expect(within(card('Firewalls')).getByTestId('art-16')).toBeInTheDocument();

  // A one-unit lesson's list holds only its exams, and says so.
  const dhcp = within(card('DHCP')).getByRole('list', { name: 'Exams' });
  expect(within(dhcp).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['CompTIA A+', 'CompTIA Network+', 'Cisco CCNA', 'Helpdesk']);
  for (const title of ['Subnetting', 'Firewalls']) {
    expect(within(card(title)).getByRole('list', { name: 'Exams' }), title).toBeInTheDocument();
    expect(within(card(title)).queryByRole('list', { name: 'Protocols and exams' }), title).toBeNull();
  }
});

test('a first visit shows each ready lesson as not started', () => {
  render(lessons());
  const dhcp = card('DHCP');
  expect(within(dhcp).getByText('Start lesson')).toBeInTheDocument();
  expect([...dhcp.querySelectorAll('.wlp > span')].map((s) => s.className)).toEqual(['', '', '']);
  expect(within(dhcp).queryByText('In progress')).toBeNull();
  expect(screen.getByRole('link', { name: 'DHCP' })).toHaveAttribute('href', '/networking/dhcp');
});

test('a returning visitor sees Finished and In progress, with Watch, Learn and Practice and where they are', () => {
  seedProgress({
    [key('subnetting')]: { status: 'finished', furthestPosition: 8 },
    [key('dhcp')]: { status: 'in-progress', furthestPosition: 3 },
  });
  render(lessons());
  const subnet = card('Subnetting');
  expect(within(subnet).getByText('Finished')).toBeInTheDocument();
  expect(within(subnet).getByText('Review')).toBeInTheDocument();
  expect(within(subnet).getByText('Finished.')).toHaveClass('sr-only');
  expect([...subnet.querySelectorAll('.wlp > span')].map((s) => s.className)).toEqual(['done', 'done', 'done']);
  expect(screen.getByRole('link', { name: 'Subnetting' })).toHaveAttribute('href', '/networking/subnetting');

  const dhcp = card('DHCP');
  expect(within(dhcp).getByText('In progress')).toBeInTheDocument();
  expect(within(dhcp).getByText('Continue')).toBeInTheDocument();
  expect(within(dhcp).getByText('Watch, step 3 of 5')).toHaveAttribute('aria-hidden', 'true');
  expect(within(dhcp).getByText('In progress: Watch, step 3 of 5.')).toHaveClass('sr-only');
  expect([...dhcp.querySelectorAll('.wlp > span')].map((s) => s.className)).toEqual(['now', '', '']);
  expect(dhcp.querySelector('.wlp')).toHaveAttribute('aria-hidden', 'true');
  // Continue goes on from the saved step, as the hero's Continue does.
  expect(screen.getByRole('link', { name: 'DHCP' })).toHaveAttribute('href', '/networking/dhcp?step=3');

  expect(within(card('Firewalls')).getByText('Start lesson')).toBeInTheDocument();
});

test('the chips are the exams some lesson helps with, and All is pressed to begin with', () => {
  render(lessons());
  const group = screen.getByRole('group', { name: 'Show lessons for' });
  expect(within(group).getAllByRole('button').map((b) => b.textContent)).toEqual([
    'All',
    'CompTIA A+',
    'CompTIA Network+',
    'CompTIA Security+',
    'Cisco CCNA',
    'Helpdesk',
    'SOC Analyst',
  ]);
  expect(pressed()).toEqual(['All']);
  // The live region is on the page from the start, empty, so its first message is announced; the line the eye
  // reads is hidden from assistive technology, so the sentence is heard once.
  const status = screen.getByRole('status');
  expect(status).toBeEmptyDOMElement();
  expect(status).toHaveClass('sr-only');
  expect(document.querySelector('.showing')).toHaveAttribute('aria-hidden', 'true');
});

test('a chip filters to the lessons for that exam and keeps the URL in step without adding history', async () => {
  const before = window.history.length;
  render(lessons());
  await userEvent.click(chip('CompTIA Security+'));
  expect(window.location.search).toBe('?for=security-plus');
  expect(pressed()).toEqual(['CompTIA Security+']);
  expect(shownTitles()).toEqual(['Firewalls']);
  // Lessons still to come and parts with nothing to show are left out.
  expect(screen.queryByText('OSI Model')).toBeNull();
  expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Protecting & scaling traffic']);
  expect(screen.getByRole('status')).toHaveTextContent('Showing 1 lesson for CompTIA Security+.');
  expect(document.querySelector('.showing')).toHaveTextContent('Showing 1 lesson for CompTIA Security+.');
  expect(chip('CompTIA Security+')).toHaveFocus();

  await userEvent.click(chip('Cisco CCNA'));
  expect(window.location.search).toBe('?for=ccna');
  expect(screen.getByRole('status')).toHaveTextContent('Showing 3 lessons for Cisco CCNA.');

  await userEvent.click(chip('SOC Analyst'));
  expect(window.location.search).toBe('?for=soc-analyst');
  expect(screen.getByRole('status')).toHaveTextContent('Showing 1 lesson for SOC Analyst.');

  await userEvent.click(chip('All'));
  expect(window.location.search).toBe('');
  expect(pressed()).toEqual(['All']);
  expectEverything();
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
  expect(window.history.length).toBe(before);
});

test('?for= on arrival filters once the island has started', () => {
  window.history.replaceState(null, '', '/networking?for=network-plus');
  render(lessons());
  expect(pressed()).toEqual(['CompTIA Network+']);
  expect(shownTitles()).toEqual(['Subnetting', 'DHCP', 'Firewalls']);
  expect(screen.queryByText('Router')).toBeNull();
  expect(screen.getByRole('status')).toHaveTextContent('Showing 3 lessons for CompTIA Network+.');
});

test('an unknown ?for= shows everything, with no exam chip pressed', () => {
  window.history.replaceState(null, '', '/networking?for=bogus');
  render(lessons());
  expectEverything();
  expect(pressed()).toEqual(['All']);
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});

test('the server renders everything; a page opened with ?for= hydrates without a mismatch, then filters', async () => {
  window.history.replaceState(null, '', '/networking?for=security-plus');
  seedProgress({ [key('dhcp')]: { status: 'in-progress', furthestPosition: 3 } });
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(lessons());
  document.body.append(container);
  expectEverything();
  expect(container.querySelector('[aria-pressed="true"]')).toHaveTextContent('All');

  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, lessons());
  });
  expect(errors).not.toHaveBeenCalled();
  expect(pressed()).toEqual(['CompTIA Security+']);
  expect(shownTitles()).toEqual(['Firewalls']);

  act(() => root.unmount());
  container.remove();
});

/**
 * Says that part is in the middle of the window, to the latest observer still connected, with that part alone: the
 * parts list watches every part and marks the one it is told about, which the shared `view` cannot single out.
 */
function reading(id: string): void {
  const observer = FakeObserver.all.filter((o) => o.connected).at(-1)!;
  const entry = { target: document.getElementById(id)!, isIntersecting: true } as unknown as IntersectionObserverEntry;
  observer.callback([entry], observer as unknown as IntersectionObserver);
}

test('the parts list beside the lessons follows the part being read, among the parts shown', async () => {
  FakeObserver.all = [];
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  // The page's own parts list, static HTML outside the island in the sidebar (.toc), and another link to a part
  // elsewhere on the page, which the spy leaves alone.
  const aside = document.createElement('aside');
  aside.className = 'toc';
  aside.dataset.fixture = '';
  aside.innerHTML = `<nav>${networkingTrack.parts.map((_, i) => `<a href="#part-${i + 1}">Part ${i + 1}</a>`).join('')}</nav>`;
  const elsewhere = document.createElement('a');
  elsewhere.href = '#part-3';
  elsewhere.dataset.fixture = '';
  document.body.append(aside, elsewhere);
  const link = (n: number) => aside.querySelector(`a[href="#part-${n}"]`)!;

  const { unmount } = render(lessons());
  const first = FakeObserver.all.at(-1)!;
  expect(first.options?.rootMargin).toBe('-35% 0px -55% 0px');
  expect(first.targets.map((t) => t.id)).toEqual(['part-1', 'part-2', 'part-3', 'part-4', 'part-5', 'part-6']);
  expect(aside.querySelector('[aria-current]')).toBeNull();

  reading('part-3');
  expect(link(3)).toHaveAttribute('aria-current', 'location');
  expect(link(3)).toHaveClass('on');
  expect(elsewhere).not.toHaveAttribute('aria-current');
  reading('part-1');
  expect(link(1)).toHaveAttribute('aria-current', 'location');
  expect(link(3)).not.toHaveAttribute('aria-current');
  expect(link(3)).not.toHaveClass('on');

  // Filtered, it watches only the parts still shown, and a part it hides is no longer marked.
  reading('part-3');
  await userEvent.click(chip('CompTIA Security+'));
  expect(first.connected).toBe(false);
  expect(FakeObserver.all.at(-1)!.targets.map((t) => t.id)).toEqual(['part-6']);
  expect(link(3)).not.toHaveAttribute('aria-current');
  expect(link(3)).not.toHaveClass('on');

  unmount();
  expect(FakeObserver.all.every((s) => !s.connected)).toBe(true);
});

// Last in the file: once the shared storage has failed it keeps saying so for as long as its module lives.
test('with storage blocked every lesson shows, not started', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  render(lessons());
  expectEverything();
  expect(screen.getAllByText('Start lesson')).toHaveLength(3);
});
