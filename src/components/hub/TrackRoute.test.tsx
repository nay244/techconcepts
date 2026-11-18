// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getEntries, getLesson, type AvailableSummary } from '../../content/registry';
import { networkingTrack } from '../../content/tracks';
import { positionOf } from '../../engine/timeline';
import { lessonStamp } from '../../lib/checked';
import { knownFrom } from '../../lib/entries';
import { trackParts } from '../../lib/track';
import { PROGRESS_KEY } from '../../progress/store';
import { seedProgress } from '../../test/progress';
import TrackRoute from './TrackRoute';

// The real track, as the page builds the island's props from it.
const entries = getEntries('networking');
const known = knownFrom(entries);
const parts = trackParts(networkingTrack, entries, (e: AvailableSummary) => getLesson(e.slug)!, lessonStamp);
const ready = entries.filter((e): e is AvailableSummary => e.available);
const osi = ready.find((e) => e.slug === 'osi-model')!;
const osiLearn = positionOf(getLesson('osi-model')!, 0, 'learn');
const second = ready[1]!;
const linkOf = (stop: HTMLElement) => within(stop).getByRole('link');

const route = () => <TrackRoute parts={parts} entries={entries} known={known} />;
const stopOf = (title: string) => screen.getByRole('heading', { level: 3, name: title }).closest('li')!;

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('TrackRoute', () => {
  test('a first visit: every ready stop is Not started with one link, its name, to the lesson; no stop is orange (checks 3, 10)', () => {
    render(route());
    for (const e of ready) {
      const stop = stopOf(e.title);
      expect(within(stop).getByText('Not started')).toBeInTheDocument();
      expect(stop.querySelectorAll('a')).toHaveLength(1);
      expect(stop.querySelector('h3 a')).toBe(linkOf(stop));
      expect(linkOf(stop)).toHaveAttribute('href', e.url);
      expect(stop.querySelector('.stop__k')!.className).toBe('stop__k');
      expect(stop).toHaveClass('stop', 'cs-card');
    }
    expect(document.querySelector('.stop--now, .stop--done, .wlp')).toBeNull();
    expect(screen.queryByRole('img', { name: /In progress/ })).toBeNull();
  });

  test('a stop holds no button and no .btn: the route has none at all', () => {
    render(route());
    expect(document.querySelector('.route button, .route .btn')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('every stop has its chip: "Lesson NN" with the words for a screen reader only, the name, the subtitle, the status and the stamp', () => {
    render(route());
    for (const e of ready) {
      const stop = stopOf(e.title);
      const chip = stop.querySelector('span.stop__node')!;
      expect(chip.textContent, e.title).toBe(`Lesson ${String(e.number).padStart(2, '0')}`);
      expect(chip.querySelector('.sr-only')!.textContent).toBe('Lesson ');
      expect(stop.querySelector('p.stop__sub')!.textContent, e.title).toBe(e.subtitle);
      expect(stop.querySelectorAll('.stop__k'), e.title).toHaveLength(1);
      // In the order the page reads: chip, name, subtitle, status, stamp.
      const order = [...stop.querySelectorAll('.stop__node, h3, .stop__sub, .stop__k, .stamp')].map((el) => (el.tagName === 'H3' ? 'h3' : el.className.split(' ')[0]));
      expect(order, e.title).toEqual(['stop__node', 'h3', 'stop__sub', 'stop__k', 'stamp']);
    }
  });

  test('every ready stop says whether its lesson has been fact-checked, and shows the day', () => {
    render(route());
    expect(within(stopOf('OSI Model')).getByText(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/)).toBeInTheDocument();
    for (const e of ready) {
      const stamp = within(stopOf(e.title)).getByText(/^(Checked|Not checked yet)/);
      expect(stamp.textContent, e.title).toMatch(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/);
      expect(stopOf(e.title).querySelectorAll('.stamp'), e.title).toHaveLength(1);
      expect(stamp.querySelector('a'), e.title).toBeNull();
    }
  });

  test('stages: the part name in one text node with no em, then its count, then its list (check 2)', () => {
    const { container } = render(route());
    const stages = screen.getAllByRole('heading', { level: 2 });
    expect(stages.map((h) => h.textContent)).toEqual(networkingTrack.parts.map((p) => p.title));
    for (const h of stages) {
      expect(h.children).toHaveLength(0);
      expect(h.childNodes).toHaveLength(1);
      expect(h.nextElementSibling!.className).toBe('route-stage__count');
      expect(h.nextElementSibling!.nextElementSibling!.tagName).toBe('OL');
    }
    expect(stages.map((h) => h.nextElementSibling!.textContent)).toEqual(
      networkingTrack.parts.map((p) => `${p.lessons.length} ${p.lessons.length === 1 ? 'lesson' : 'lessons'}`),
    );
    expect(screen.getAllByRole('list')).toHaveLength(networkingTrack.parts.length);
    expect(container.querySelector('em, header, .route-stage__head, .route-stage__mark')).toBeNull();
  });

  test('"1 lesson" for a part of one, never "1 lessons"', () => {
    const one = { ...parts[0]!, lessons: parts[0]!.lessons.slice(0, 1) };
    render(<TrackRoute parts={[one]} entries={entries} known={known} />);
    expect(document.querySelector('.route-stage__count')).toHaveTextContent(/^1 lesson$/);
  });

  test('a lesson not ready yet is a dashed card with its chip, Not ready yet and no link, no stamp, no subtitle', () => {
    // Every Networking lesson is ready now, so the last one is shown as not ready for this test only.
    const vpn = entries.find((e) => e.slug === 'vpn')!;
    const planned = entries.map((e) => (e === vpn ? { ...vpn, available: false } : e)) as typeof entries;
    const plannedParts = trackParts(networkingTrack, planned, (e: AvailableSummary) => getLesson(e.slug)!, lessonStamp);
    render(<TrackRoute parts={plannedParts} entries={planned} known={known} />);
    const soon = plannedParts.flatMap((p) => p.lessons).find((l) => !l.ready)!;
    expect(soon.title).toBe('VPN');
    const stop = stopOf(soon.title);
    expect(stop).toHaveClass('stop', 'cs-card', 'stop--soon');
    expect(within(stop).getByText('Not ready yet')).toBeInTheDocument();
    expect(stop.querySelector('.stop__node')!.textContent).toBe(`Lesson ${soon.n}`);
    expect(stop.querySelector('a')).toBeNull();
    expect(stop.querySelector('.stamp, .stop__art, .stop__tile, svg')).toBeNull();
    expect(screen.getAllByText('Not ready yet')).toHaveLength(planned.filter((e) => !e.available).length);
  });

  test('the strip of a part with a stop not ready still lists it (the route keeps what is coming)', () => {
    const vpn = entries.find((e) => e.slug === 'vpn')!;
    const planned = entries.map((e) => (e === vpn ? { ...vpn, available: false } : e)) as typeof entries;
    const plannedParts = trackParts(networkingTrack, planned, (e: AvailableSummary) => getLesson(e.slug)!, lessonStamp);
    render(<TrackRoute parts={plannedParts} entries={planned} known={known} />);
    expect(document.querySelectorAll('li.stop')).toHaveLength(planned.length);
  });

  test('OSI in progress at Learn: In progress, the marker, a link to that step, the orange up-next stop and no button (check 11)', () => {
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    render(route());
    const stop = stopOf(osi.title);
    expect(within(stop).getByText('In progress')).toBeInTheDocument();
    expect(stop.querySelector('.stop__k')).toHaveClass('go');
    expect(within(stop).getByRole('img', { name: 'In progress, at Learn' })).toBeInTheDocument();
    expect(stop.querySelectorAll('.wlp')).toHaveLength(1);
    expect(linkOf(stop)).toHaveAttribute('href', `${osi.url}?step=${osiLearn}`);
    expect(stop).toHaveClass('stop--now');
    expect(stop).not.toHaveClass('stop--done');
    expect(document.querySelectorAll('.stop--now')).toHaveLength(1);
    // Another lesson stays plain, and a link to its lesson.
    expect(stopOf(second.title)).not.toHaveClass('stop--now');
    expect(linkOf(stopOf(second.title))).toHaveAttribute('href', second.url);
    expect(within(stop).getAllByText(/^(Watch|Learn|Practice)$/)).toHaveLength(3);
  });

  test('two lessons in progress: only the one opened last is up next; the other says In progress, with its marks, and is plain', () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        version: 2,
        lessons: {
          [ready[0]!.key]: { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-05T10:00:00Z' },
          [second.key]: { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-05T11:00:00Z' },
        },
        lastLesson: second.key,
        lastTrack: null,
      }),
    );
    render(route());
    expect(stopOf(second.title)).toHaveClass('stop--now');
    const other = stopOf(ready[0]!.title);
    expect(other).not.toHaveClass('stop--now');
    expect(within(other).getByText('In progress')).toBeInTheDocument();
    expect(other.querySelectorAll('.wlp')).toHaveLength(1);
    expect(document.querySelectorAll('.stop--now')).toHaveLength(1);
  });

  test('a finished lesson is ✓ Done, a green stop, not the orange one; the next unfinished lesson is where to go on (check 12)', () => {
    seedProgress({ 'osi-model': { status: 'finished', furthestPosition: osi.maxPosition } }, 'osi-model');
    render(route());
    const stop = stopOf(osi.title);
    expect(stop).toHaveClass('stop--done');
    expect(stop).not.toHaveClass('stop--now');
    expect(within(stop).getByText('✓ Done')).toHaveClass('stop__k', 'done');
    expect(stop.querySelector('.wlp')).toBeNull();
    expect(linkOf(stop)).toHaveAttribute('href', osi.url);
    expect(stopOf(second.title)).toHaveClass('stop--now');
    expect(within(stopOf(second.title)).getByText('Not started')).toBeInTheDocument();
    expect(stopOf(second.title).querySelector('.wlp')).toBeNull();
  });

  test('headings stay in order: stage h2, stop h3', () => {
    render(route());
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName[1]));
    expect(levels[0]).toBe(2);
    expect(levels.every((l) => l === 2 || l === 3)).toBe(true);
    expect(levels.filter((l) => l === 3)).toHaveLength(entries.length);
  });

  test('a stop draws no lesson figure: its only svg is the stamp tick; no slot, no tile, no data-art', () => {
    const { container } = render(route());
    expect(container.querySelector('.stop__art, .stop__slot, .stop__tile, .name-tile, [data-art], .l-art, svg[role="img"]')).toBeNull();
    expect(container.querySelectorAll('svg')).toHaveLength(ready.length);
    for (const svg of container.querySelectorAll('svg')) expect(svg.closest('.stamp')).not.toBeNull();
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
    expect(linkOf(stop)).toHaveAttribute('href', osi.url);
    expect(document.querySelector('.stop--now')).toBeNull();
    expect(errors).not.toHaveBeenCalled();
  });

  test('every ready lesson done: every stop is done, none is orange', () => {
    seedProgress(Object.fromEntries(ready.map((e) => [e.key, { status: 'finished' as const, furthestPosition: e.maxPosition }])), ready.at(-1)!.key);
    render(route());
    expect(document.querySelectorAll('li.stop--done')).toHaveLength(ready.length);
    expect(document.querySelector('.stop--now')).toBeNull();
    for (const e of ready) expect(within(stopOf(e.title)).getByText('✓ Done')).toBeInTheDocument();
  });

  test('hydrates the first-visit server render with saved progress and no mismatch, then shows the up-next stop', async () => {
    seedProgress({ 'osi-model': { status: 'in-progress', furthestPosition: osiLearn } }, 'osi-model');
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const container = document.createElement('div');
    container.innerHTML = renderToString(route());
    document.body.append(container);
    // The server render is a first visit.
    expect(within(container).getAllByText('Not started').length).toBeGreaterThan(0);
    expect(container.querySelector('.stop--now')).toBeNull();

    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, route());
    });
    expect(errors).not.toHaveBeenCalled();
    expect(container.querySelector('.stop--now')).not.toBeNull();
    expect(container.querySelector('.stop--now a')).toHaveAttribute('href', `${osi.url}?step=${osiLearn}`);

    act(() => root.unmount());
    container.remove();
  });
});
