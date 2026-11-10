// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import { memo } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getEntries, getLesson, type AvailableSummary } from '../../content/registry';
import { networkingTrack } from '../../content/tracks';
import { positionOf } from '../../engine/timeline';
import { knownFrom } from '../../lib/entries';
import { trackParts } from '../../lib/track';
import { seedProgress } from '../../test/progress';
import TrackRoute from './TrackRoute';

// The real track, as the page builds the island's props from it.
const entries = getEntries('networking');
const known = knownFrom(entries);
const parts = trackParts(networkingTrack, entries, (e: AvailableSummary) => getLesson(e.slug)!);
const ready = entries.filter((e): e is AvailableSummary => e.available);
const osi = ready.find((e) => e.slug === 'osi-model')!;
const osiLearn = positionOf(getLesson('osi-model')!, 0, 'learn');
const second = ready[1]!;

const route = (extra: Record<string, unknown> = {}) => <TrackRoute parts={parts} entries={entries} known={known} {...extra} />;
const stopOf = (title: string) => screen.getByRole('heading', { level: 3, name: title }).closest('li')!;

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('TrackRoute', () => {
  test('a first visit: every ready stop is Not started with Start, the first is primary, no stop is amber', () => {
    render(route());
    for (const e of ready) {
      const stop = stopOf(e.title);
      expect(within(stop).getByText('Not started')).toBeInTheDocument();
      expect(within(stop).getByRole('link', { name: 'Start' })).toHaveAttribute('href', e.url);
      expect(stop).not.toHaveClass('stop--now');
    }
    expect(within(stopOf(ready[0]!.title)).getByRole('link', { name: 'Start' })).toHaveClass('btn--primary');
    expect(within(stopOf(second.title)).getByRole('link', { name: 'Start' })).not.toHaveClass('btn--primary');
    expect(document.querySelector('.stop--now')).toBeNull();
    expect(screen.queryByRole('img', { name: /In progress/ })).toBeNull();
  });

  test('stages: the part name with its last word in em, and how many lessons', () => {
    render(route());
    const stages = screen.getAllByRole('heading', { level: 2 });
    expect(stages.map((h) => h.textContent)).toEqual(networkingTrack.parts.map((p) => p.title));
    const first = networkingTrack.parts[0]!;
    expect(stages[0]!.querySelector('em')!.textContent).toBe(first.title.split(' ').at(-1));
    const section = stages[0]!.closest('section')!;
    expect(within(section).getByText(`${first.lessons.length} ${first.lessons.length === 1 ? 'lesson' : 'lessons'}`)).toBeInTheDocument();
    expect(screen.getAllByRole('list')).toHaveLength(networkingTrack.parts.length);
  });

  test('a lesson not ready yet is an outline stop with its number, Not ready yet and no link', () => {
    render(route());
    const soon = parts.flatMap((p) => p.lessons).find((l) => !l.ready)!;
    const stop = stopOf(soon.title);
    expect(stop).toHaveClass('stop--soon');
    expect(within(stop).getByText('Not ready yet')).toBeInTheDocument();
    expect(within(stop).getAllByText(soon.n).length).toBeGreaterThan(0);
    expect(within(stop).queryByRole('link')).toBeNull();
    expect(screen.getAllByText('Not ready yet')).toHaveLength(entries.length - ready.length);
  });

  test('the figure link is out of the tab order and hidden; the title link is the accessible one', () => {
    render(route({ [`art${ready[0]!.number}`]: <svg data-testid="fig" /> }));
    const stop = stopOf(ready[0]!.title);
    const art = within(stop).getByTestId('fig').closest('a')!;
    expect(art).toHaveAttribute('tabindex', '-1');
    expect(art).toHaveAttribute('aria-hidden', 'true');
    expect(art).toHaveAttribute('href', ready[0]!.url);
    expect(within(stop).getByRole('link', { name: ready[0]!.title })).toHaveAttribute('href', ready[0]!.url);
  });

  test('OSI in progress at Learn: In progress, the marker, Continue to that step, and the amber up-next stop', () => {
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    render(route());
    const stop = stopOf(osi.title);
    expect(within(stop).getByText('In progress')).toBeInTheDocument();
    expect(within(stop).getByRole('img', { name: 'In progress, at Learn' })).toBeInTheDocument();
    const go = within(stop).getByRole('link', { name: 'Continue' });
    expect(go).toHaveAttribute('href', `${osi.url}?step=${osiLearn}`);
    expect(go).toHaveClass('btn--primary');
    expect(stop).toHaveClass('stop--now');
    expect(document.querySelectorAll('.stop--now')).toHaveLength(1);
    // Other lessons are still ghost buttons and plain tiles.
    expect(within(stopOf(second.title)).getByRole('link', { name: 'Start' })).not.toHaveClass('btn--primary');
  });

  test('a finished lesson is ✓ Done with Watch again and the accent circle, not the amber one', () => {
    seedProgress({ 'osi-model': { status: 'finished', furthestPosition: osi.maxPosition } }, 'osi-model');
    render(route());
    const stop = stopOf(osi.title);
    expect(stop).toHaveClass('stop--done');
    expect(stop).not.toHaveClass('stop--now');
    expect(within(stop).getByText('✓ Done')).toBeInTheDocument();
    expect(within(stop).getByRole('link', { name: 'Watch again' })).toBeInTheDocument();
    // The next unfinished lesson is where to go on.
    expect(within(stopOf(second.title)).getByRole('link', { name: 'Start' })).toHaveClass('btn--primary');
    expect(stopOf(second.title)).toHaveClass('stop--now');
  });

  test('headings stay in order: stage h2, stop h3', () => {
    render(route());
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName[1]));
    expect(levels[0]).toBe(2);
    expect(levels.every((l) => l === 2 || l === 3)).toBe(true);
  });

  test('a stop shows its lesson figure, in a keyed element', () => {
    const Frozen = memo(({ id }: { id: string }) => <svg data-testid={id} />, () => true);
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    render(route({ [`art${osi.number}`]: <Frozen id="osi" /> }));
    expect(within(stopOf(osi.title)).getByTestId('osi')).toBeInTheDocument();
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
    const { default: Blocked } = await import('./TrackRoute');
    render(<Blocked parts={parts} entries={entries} known={known} />);
    const stop = stopOf(osi.title);
    expect(within(stop).getByText('Not started')).toBeInTheDocument();
    expect(within(stop).getByRole('link', { name: 'Start' })).toHaveClass('btn--primary');
    expect(document.querySelector('.stop--now')).toBeNull();
    expect(errors).not.toHaveBeenCalled();
  });

  test('every ready lesson done: the last stop is done, not amber, and offers Watch again as primary', () => {
    seedProgress(Object.fromEntries(ready.map((e) => [e.key, { status: 'finished' as const, furthestPosition: e.maxPosition }])), ready.at(-1)!.key);
    render(route());
    const last = stopOf(ready.at(-1)!.title);
    expect(last).toHaveClass('stop--done');
    expect(document.querySelector('.stop--now')).toBeNull();
    expect(within(last).getByRole('link', { name: 'Watch again' })).toHaveClass('btn--primary');
  });

  test('hydrates the first-visit server render with saved progress and no mismatch, then shows the up-next stop', async () => {
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const island = () => route({ [`art${osi.number}`]: <svg data-testid="art-osi" /> });
    const container = document.createElement('div');
    container.innerHTML = renderToString(island());
    document.body.append(container);
    // The server render is a first visit.
    expect(within(container).getAllByText('Not started').length).toBeGreaterThan(0);
    expect(container.querySelector('.stop--now')).toBeNull();

    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, island());
    });
    expect(errors).not.toHaveBeenCalled();
    expect(container.querySelector('.stop--now')).not.toBeNull();
    expect(within(container).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${osi.url}?step=${osiLearn}`);
    expect(within(container).getByTestId('art-osi')).toBeInTheDocument();

    act(() => root.unmount());
    container.remove();
  });
});
