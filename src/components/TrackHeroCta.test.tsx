// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { getEntries, getLesson, type AvailableSummary } from '../content/registry';
import { knownFrom } from '../lib/entries';
import { resumePlaces } from '../lib/home';
import { nextUps } from '../lib/track';
import { seedProgress } from '../test/progress';
import { TrackHeroCta, type TrackResumeLesson } from './TrackHeroCta';

// The real track, as the page builds the island's props from it.
const entries = getEntries('networking');
const available = entries.filter((e): e is AvailableSummary => e.available);
const known = knownFrom(entries);
const lessons: TrackResumeLesson[] = available.map((e) => {
  const lesson = getLesson('networking', e.slug)!;
  return { key: e.key, title: e.title, url: e.url, places: resumePlaces(lesson), next: nextUps(lesson) };
});
const start = { title: available[0]!.title, url: available[0]!.url };
const DHCP = available.find((e) => e.slug === 'dhcp')!;

const cta = () => <TrackHeroCta lessons={lessons} known={known} start={start} />;

const link = (name: string | RegExp) => screen.getByRole('link', { name });

function expectFirstVisit(container: HTMLElement): void {
  expect(link('Start with How the Internet Works')).toHaveAttribute('href', '/networking/how-the-internet-works');
  expect(link('See all lessons')).toHaveAttribute('href', '#lessons');
  expect(screen.queryByRole('link', { name: /^Continue/ })).toBeNull();
  expect(container.querySelector('.resume')).toBeNull();
}

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

test('a first visit starts with the track’s first ready lesson, or goes to the lessons', () => {
  expect(start.title).toBe('How the Internet Works');
  const { container } = render(cta());
  expectFirstVisit(container);
});

test('a returning visitor continues the last lesson at its step, with where they are and what comes next', () => {
  seedProgress({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, DHCP.key);
  const { container } = render(cta());
  expect(link('Continue DHCP')).toHaveAttribute('href', '/networking/dhcp?step=3');
  expect(link('See all lessons')).toHaveAttribute('href', '#lessons');
  expect(screen.queryByRole('link', { name: /^Start with/ })).toBeNull();

  const resume = container.querySelector('.resume')!;
  expect(resume).toHaveAttribute('href', '/networking/dhcp?step=3');
  expect(resume.querySelector('b')).toHaveTextContent('You’re on step 3 of 5 in DHCP');
  expect(resume.querySelector('span')).toHaveTextContent('Next up: The laptop says yes, please');
  // The ring fills by how far through the lesson they are, in marigold: they are here.
  const ring = resume.querySelectorAll('circle')[1]!;
  expect(ring).toHaveAttribute('stroke', 'var(--here)');
  expect(ring.getAttribute('stroke-dasharray')).toBe(`${((2 * Math.PI * 16 * 3) / DHCP.maxPosition).toFixed(1)} 200`);
  expect(resume.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

test('away from a step there is no next line', () => {
  seedProgress({ [DHCP.key]: { status: 'in-progress', furthestPosition: DHCP.maxPosition - 1 } }, DHCP.key);
  const { container } = render(cta());
  expect(container.querySelector('.resume b')).toHaveTextContent('You’re on the Learn part in DHCP');
  expect(container.querySelector('.resume span')).toBeNull();
});

test('a finished last lesson says so, with the ring full, and is continued from its Overview', () => {
  seedProgress({ [DHCP.key]: { status: 'finished', furthestPosition: DHCP.maxPosition } }, DHCP.key);
  const { container } = render(cta());
  expect(link('Continue DHCP')).toHaveAttribute('href', '/networking/dhcp');
  expect(container.querySelector('.resume b')).toHaveTextContent('You finished DHCP');
  expect(container.querySelector('.resume span')).toBeNull();
  expect(container.querySelectorAll('.resume circle')[1]!.getAttribute('stroke-dasharray')).toBe(`${(2 * Math.PI * 16).toFixed(1)} 200`);
});

test('with no saved lesson progress, or a last lesson the site does not have, it is a first visit', () => {
  seedProgress({}, DHCP.key);
  const first = render(cta());
  expectFirstVisit(first.container);
  first.unmount();

  seedProgress({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, 'osi-model');
  const second = render(cta());
  expectFirstVisit(second.container);
});

test('the server renders the first visit, then hydrates to the returning visitor without warnings', async () => {
  seedProgress({ [DHCP.key]: { status: 'in-progress', furthestPosition: 3 } }, DHCP.key);
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(cta());
  document.body.append(container);
  expectFirstVisit(container);

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
  const { container } = render(cta());
  expectFirstVisit(container);
});
