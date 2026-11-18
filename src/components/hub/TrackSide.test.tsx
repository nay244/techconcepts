// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getEntries, getLesson, type AvailableSummary } from '../../content/registry';
import { positionOf } from '../../engine/timeline';
import { knownFrom } from '../../lib/entries';
import { PROGRESS_KEY } from '../../progress/store';
import { seedProgress } from '../../test/progress';
import TrackSide from './TrackSide';

const entries = getEntries('networking');
const known = knownFrom(entries);
const ready = entries.filter((e): e is AvailableSummary => e.available);
const osi = ready.find((e) => e.slug === 'osi-model')!;
const osiLearn = positionOf(getLesson('osi-model')!, 0, 'learn');
const first = ready[0]!;
const second = ready[1]!;
const two = (n: number) => String(n).padStart(2, '0');

const side = () => <TrackSide entries={entries} known={known} />;
const cardOf = () => document.querySelector('.upnext') as HTMLElement;
const chip = () => cardOf().querySelector('.upnext__n') as HTMLElement;
const tab = () => cardOf().querySelector('.upnext__k') as HTMLElement;

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('TrackSide', () => {
  test('a first visit: the tab says First lesson, the chip is ahead, a full-width Start button, no orange square (checks 10, 14)', () => {
    render(side());
    expect(cardOf()).toHaveAttribute('data-kind', 'start');
    expect(cardOf()).toHaveClass('cs-card', 'cs-card--beneath');
    expect(tab()).toHaveTextContent(/^First lesson$/);
    expect(tab()).toHaveClass('cs-tab');
    expect(tab()).not.toHaveClass('cs-tab--here');
    expect(chip()).toHaveAttribute('data-state', 'ahead');
    expect(chip().textContent).toBe(`Lesson ${two(first.number)}`);
    expect(chip().querySelector('.sr-only')).toHaveTextContent('Lesson');
    expect(cardOf().querySelector('.upnext__t')).toHaveTextContent(first.title);
    // The line is the lesson's subtitle alone: no "Lesson NN ·".
    expect(cardOf().querySelector('.upnext__s')!.textContent).toBe(first.subtitle);
    const start = within(cardOf()).getByRole('link', { name: 'Start' });
    expect(start).toHaveAttribute('href', first.url);
    expect(start).toHaveClass('btn', 'btn--primary', 'upnext__btn');
    expect(cardOf().querySelectorAll('a')).toHaveLength(1);
    expect(document.querySelectorAll('.strip__sq i[data-state="ready"]')).toHaveLength(ready.length);
    expect(document.querySelector('.strip__sq i[data-state="current"]')).toBeNull();
    expect(document.querySelector('.strip__w')).toHaveTextContent(`0 of ${entries.length} lessons done`);
  });

  test('"Start here" is on no part of the card, and the tab is not picked by the lesson being the first (check 4)', () => {
    render(side());
    expect(cardOf().textContent).not.toContain('Start here');
    // Networking shares HTTP: finishing it makes the next lesson the up-next one, and the tab says Up next, not First lesson.
    seedProgress({ 'what-is-http': { status: 'finished', furthestPosition: 9 } }, 'what-is-http');
    document.body.replaceChildren();
    render(side());
    expect(tab()).toHaveTextContent(/^Up next$/);
    expect(chip().textContent).toBe(`Lesson ${two(first.number)}`);
    expect(within(cardOf()).getByRole('link', { name: 'Start' })).toHaveAttribute('href', first.url);
  });

  test('OSI in progress at Learn: Up next with its marker, the chip here, Continue to that step, one orange square (check 11)', () => {
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    render(side());
    expect(cardOf()).toHaveAttribute('data-kind', 'next');
    expect(tab()).toHaveTextContent(/^Up next$/);
    expect(tab()).toHaveClass('cs-tab--here');
    expect(chip()).toHaveAttribute('data-state', 'here');
    expect(chip().textContent).toBe(`Lesson ${two(osi.number)}`);
    expect(cardOf().querySelector('.upnext__t')).toHaveTextContent(osi.title);
    expect(within(cardOf()).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${osi.url}?step=${osiLearn}`);
    expect(document.querySelectorAll('.strip__sq i[data-state="current"]')).toHaveLength(1);
  });

  test('a lesson finished and the next not started: Up next, the chip here, Start with no ?step= (check 12)', () => {
    seedProgress({ 'osi-model': { status: 'finished', furthestPosition: osi.maxPosition } }, 'osi-model');
    render(side());
    expect(tab()).toHaveTextContent(/^Up next$/);
    expect(tab()).toHaveClass('cs-tab--here');
    expect(chip()).toHaveAttribute('data-state', 'here');
    expect(chip().textContent).toBe(`Lesson ${two(second.number)}`);
    expect(within(cardOf()).getByRole('link', { name: 'Start' })).toHaveAttribute('href', second.url);
  });

  test('everything ready finished: Done so far, the chip done and still showing the number, Watch again (check 13)', () => {
    seedProgress(Object.fromEntries(ready.map((e) => [e.key, { status: 'finished' as const, furthestPosition: e.maxPosition }])), first.key);
    render(side());
    const last = ready.at(-1)!;
    expect(cardOf()).toHaveAttribute('data-kind', 'done-so-far');
    expect(tab()).toHaveTextContent(/^✓ Done so far$/);
    expect(tab()).not.toHaveClass('cs-tab--here');
    expect(chip()).toHaveAttribute('data-state', 'done');
    expect(chip().textContent).toBe(`Lesson ${two(last.number)}`);
    expect(within(cardOf()).getByRole('link', { name: 'Watch again' })).toBeInTheDocument();
    expect(document.querySelectorAll('.strip__sq i[data-state="done"]')).toHaveLength(ready.length);
    expect(document.querySelector('.strip__sq i[data-state="current"]')).toBeNull();
  });

  test('two lessons in progress: the one opened last is up next', () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        version: 2,
        lessons: {
          [first.key]: { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-05T10:00:00Z' },
          [second.key]: { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-05T11:00:00Z' },
        },
        lastLesson: second.key,
        lastTrack: null,
      }),
    );
    render(side());
    expect(chip().textContent).toBe(`Lesson ${two(second.number)}`);
    expect(document.querySelectorAll('.strip__sq i[data-state="current"]')).toHaveLength(1);
  });

  test('a shared lesson in progress is numbered by this track (How the Internet Works 1, Networking 14)', () => {
    seedProgress({ 'what-is-http': { status: 'in-progress', furthestPosition: 2 } }, 'what-is-http');
    const internet = getEntries('how-the-internet-works');
    const http = entries.find((e) => e.slug === 'what-is-http')!;
    const { unmount } = render(<TrackSide entries={internet} known={knownFrom(internet)} />);
    expect(chip().textContent).toBe('Lesson 01');
    expect(within(cardOf()).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/how-the-internet-works/what-is-http?step=2');
    unmount();
    render(side());
    expect(chip().textContent).toBe(`Lesson ${two(http.number)}`);
    expect(http.number).toBe(14);
    expect(within(cardOf()).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/networking/what-is-http?step=2');
  });

  test('with no ready lesson it draws the strip and nothing else', () => {
    render(<TrackSide entries={entries.filter((e) => !e.available)} known={known} />);
    expect(document.querySelector('.strip')).not.toBeNull();
    expect(document.querySelector('.upnext')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  test('the card draws no lesson figure: no svg, no figure frame, no children slot', () => {
    render(side());
    expect(document.querySelector('svg, .side-now, .side-now__art, .l-art')).toBeNull();
  });

  // The shared storage keeps saying it failed for as long as its module lives, so this test renders an island of its
  // own from fresh modules; the afterEach restores localStorage, and the other tests never see the failure.
  test('blocked storage shows the first-visit render without an error', async () => {
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.resetModules();
    const { default: Blocked } = await import('./TrackSide');
    render(<Blocked entries={entries} known={known} />);
    expect(tab()).toHaveTextContent(/^First lesson$/);
    expect(within(cardOf()).getByRole('link', { name: 'Start' })).toHaveAttribute('href', first.url);
    expect(errors).not.toHaveBeenCalled();
  });

  test('hydrates the first-visit server render with saved progress and no mismatch, then shows the lesson to continue', async () => {
    seedProgress({ [second.key]: { status: 'in-progress', furthestPosition: 2 } }, second.key);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const container = document.createElement('div');
    container.innerHTML = renderToString(side());
    document.body.append(container);
    // The server render is a first visit.
    expect(within(container).getByRole('link', { name: 'Start' })).toHaveAttribute('href', first.url);

    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, side());
    });
    expect(errors).not.toHaveBeenCalled();
    expect(within(container).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${second.url}?step=2`);
    expect(container.querySelector('.upnext__k')).toHaveClass('cs-tab--here');

    act(() => root.unmount());
    container.remove();
  });
});
