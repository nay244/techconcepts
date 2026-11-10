// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import { memo } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getEntries, getLesson, type AvailableSummary } from '../../content/registry';
import { positionOf } from '../../engine/timeline';
import { knownFrom } from '../../lib/entries';
import { seedProgress } from '../../test/progress';
import TrackSide from './TrackSide';

const entries = getEntries('networking');
const known = knownFrom(entries);
const ready = entries.filter((e): e is AvailableSummary => e.available);
const osi = ready.find((e) => e.slug === 'osi-model')!;
const osiLearn = positionOf(getLesson('osi-model')!, 0, 'learn');
const first = ready[0]!;
const second = ready[1]!;

const side = (extra: Record<string, unknown> = {}) => <TrackSide entries={entries} known={known} {...extra} />;
const cardOf = () => document.querySelector('.side-now') as HTMLElement;

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('TrackSide', () => {
  test('a first visit: Start here, the first ready lesson, a full-width Start button, no amber square', () => {
    render(side());
    expect(within(cardOf()).getByText('Start here')).toBeInTheDocument();
    expect(within(cardOf()).getByText(first.title)).toBeInTheDocument();
    expect(cardOf().textContent).toContain(`Lesson ${String(first.number).padStart(2, '0')} · ${first.subtitle}`);
    const start = within(cardOf()).getByRole('link', { name: 'Start' });
    expect(start).toHaveAttribute('href', first.url);
    expect(start).toHaveClass('btn--primary', 'side-now__btn');
    expect(document.querySelector('.strip__sq i[data-state="current"]')).toBeNull();
  });

  test('OSI in progress at Learn: Up next, Continue to that step, and the strip has its amber square', () => {
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    render(side());
    expect(within(cardOf()).getByText('Up next')).toBeInTheDocument();
    expect(within(cardOf()).getByText(osi.title)).toBeInTheDocument();
    expect(within(cardOf()).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${osi.url}?step=${osiLearn}`);
    expect(document.querySelectorAll('.strip__sq i[data-state="current"]')).toHaveLength(1);
  });

  test('everything ready finished offers Watch again', () => {
    seedProgress(Object.fromEntries(ready.map((e) => [e.key, { status: 'finished' as const, furthestPosition: e.maxPosition }])), first.key);
    render(side());
    expect(within(cardOf()).getByText('✓ Done so far')).toBeInTheDocument();
    expect(within(cardOf()).getByRole('link', { name: 'Watch again' })).toBeInTheDocument();
  });

  test('with no ready lesson it draws the strip and nothing else', () => {
    render(<TrackSide entries={entries.filter((e) => !e.available)} known={known} />);
    expect(document.querySelector('.strip')).not.toBeNull();
    expect(document.querySelector('.side-now')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  test('the figure is hidden from assistive tech', () => {
    render(side({ [`art${first.number}`]: <svg data-testid="fig" /> }));
    expect(within(cardOf()).getByTestId('fig').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  test('the card swaps its figure when progress loads, though a slot never re-renders', () => {
    // Astro hands each slot over as static HTML wrapped in a component that never updates (React.memo, () => true), so
    // the first-visit figure would stay put unless the card's art is remounted for the new lesson.
    const Frozen = memo(({ id }: { id: string }) => <svg data-testid={id} />, () => true);
    seedProgress({ [second.key]: { status: 'in-progress', furthestPosition: 2 } }, second.key);
    render(side({ [`art${first.number}`]: <Frozen id="first" />, [`art${second.number}`]: <Frozen id="second" /> }));
    expect(within(cardOf()).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${second.url}?step=2`);
    expect(within(cardOf()).getByTestId('second')).toBeInTheDocument();
    expect(within(cardOf()).queryByTestId('first')).toBeNull();
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
    expect(within(cardOf()).getByText('Start here')).toBeInTheDocument();
    expect(within(cardOf()).getByRole('link', { name: 'Start' })).toHaveAttribute('href', first.url);
    expect(errors).not.toHaveBeenCalled();
  });

  test('hydrates the first-visit server render with saved progress and no mismatch, then shows the lesson to continue', async () => {
    seedProgress({ [second.key]: { status: 'in-progress', furthestPosition: 2 } }, second.key);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const island = () => side({ [`art${first.number}`]: <svg data-testid="art-first" />, [`art${second.number}`]: <svg data-testid="art-second" /> });
    const container = document.createElement('div');
    container.innerHTML = renderToString(island());
    document.body.append(container);
    // The server render is a first visit.
    expect(within(container).getByRole('link', { name: 'Start' })).toHaveAttribute('href', first.url);

    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, island());
    });
    expect(errors).not.toHaveBeenCalled();
    expect(within(container).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${second.url}?step=2`);
    expect(within(container.querySelector('.side-now') as HTMLElement).getByTestId('art-second')).toBeInTheDocument();

    act(() => root.unmount());
    container.remove();
  });
});
