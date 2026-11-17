// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { buildEntries } from '../../content/registry';
import type { AvailableSummary } from '../../content/registry';
import type { Lesson } from '../../content/schema';
import { liftedFixture, makeLesson } from '../../content/test-fixtures';
import { networkingTrack } from '../../content/tracks';
import { knownFrom } from '../../lib/entries';
import { UP_NEXT_KICKER } from '../../lib/hub';
import { seedProgress } from '../../test/progress';
import TrackPanelProgress from './TrackPanelProgress';

const lessons: Record<string, Lesson> = {
  dhcp: liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP', subtitle: 'Getting an address automatically', certTags: ['network-plus'] })),
  firewalls: liftedFixture(makeLesson({ slug: 'firewalls', title: 'Firewalls', certTags: ['network-plus'] })),
};
const entries = buildEntries(networkingTrack, lessons, () => 'networking');
const available = entries.filter((e): e is AvailableSummary => e.available);
const known = knownFrom(entries);
const first = available[0]!;
const dhcp = available.find((e) => e.slug === 'dhcp')!;
/** A ready lesson after the first, so a lesson in progress moves the card off the first-visit one. */
const later = available[1]!;

const panel = (list = entries) => <TrackPanelProgress entries={list} known={known} trackUrl="/networking" />;
const box = () => document.querySelector('.upnext') as HTMLElement;
const chip = () => box().querySelector('.upnext__n') as HTMLElement;
const two = (n: number) => String(n).padStart(2, '0');

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('TrackPanelProgress', () => {
  test('a first visit says First lesson, with the first ready lesson, a Start button and an unlit chip', () => {
    render(panel());
    expect(box()).toHaveAttribute('data-kind', 'start');
    expect(box().querySelector('.upnext__k')).toHaveTextContent(/^First lesson$/);
    expect(chip()).toHaveAttribute('data-state', 'ahead');
    expect(chip().textContent).toBe(`Lesson ${two(first.number)}`);
    expect(box().querySelector('.upnext__t')).toHaveTextContent(first.title);
    expect(box().querySelector('.upnext__s')).toHaveTextContent(new RegExp(`^${first.subtitle}$`));
    const start = screen.getByRole('link', { name: 'Start' });
    expect(start).toHaveAttribute('href', first.url);
    expect(start).toHaveClass('btn', 'btn--primary');
    expect(screen.getByRole('link', { name: 'See the whole track' })).toHaveAttribute('href', '/networking');
    expect(document.querySelector('.strip__sq i[data-state="current"]')).toBeNull();
    expect(document.querySelectorAll('.strip__sq i[data-state="ready"]')).toHaveLength(available.length);
    expect(document.querySelector('.strip__w')).toHaveTextContent(`0 of ${entries.length} lessons done`);
  });

  test('"Start here" is not the box’s kicker: it is the first track’s tab, and the track page keeps it', () => {
    render(panel());
    expect(box().textContent).not.toContain('Start here');
    expect(UP_NEXT_KICKER.start).toBe('Start here');
  });

  test('the box is not a link and holds one filled button: no .next, .lift or .panel__cta, and the markup order is kicker, line, subtitle, way in', () => {
    render(panel());
    expect(box().tagName).toBe('DIV');
    expect(box().closest('a')).toBeNull();
    expect(box().querySelectorAll('.btn--primary')).toHaveLength(1);
    expect(document.querySelector('.next, .lift, .panel__cta')).toBeNull();
    expect([...box().children].map((el) => el.className)).toEqual(['upnext__k', 'upnext__l', 'upnext__s', 'upnext__go']);
    // The button comes before "See the whole track".
    expect([...box().querySelectorAll('.upnext__go a')].map((a) => a.textContent)).toEqual(['Start', 'See the whole track']);
    // The strip and the box are the island's two top-level parts, in that order.
    const parent = box().parentElement!;
    expect([...parent.children].map((el) => el.className)).toEqual(['strip', 'upnext']);
  });

  test('the chip reads "Lesson NN" to a screen reader, the number stays in the markup, and the line is the subtitle alone', () => {
    render(panel());
    expect(chip().querySelector('.sr-only')!.textContent).toBe('Lesson ');
    expect(chip().textContent).toBe(`Lesson ${two(first.number)}`);
    expect(box().querySelector('.upnext__s')!.textContent).toBe(first.subtitle);
    expect(box().textContent).not.toContain('·');
  });

  test('a lesson in progress is the one to continue, at its furthest step', () => {
    seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 4 } }, 'dhcp');
    render(panel());
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${dhcp.url}?step=4`);
    expect(box()).toHaveAttribute('data-kind', 'next');
    expect(box().querySelector('.upnext__k')).toHaveTextContent(/^Up next$/);
    expect(chip()).toHaveAttribute('data-state', 'here');
    expect(chip().textContent).toBe(`Lesson ${two(dhcp.number)}`);
    expect(box().querySelector('.upnext__t')).toHaveTextContent('DHCP');
    expect(box().querySelector('.upnext__s')!.textContent).toBe('Getting an address automatically');
    expect(document.querySelectorAll('.strip__sq i[data-state="current"]')).toHaveLength(1);
  });

  test('a position past the lesson’s last step continues at its last step', () => {
    seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 999 } }, 'dhcp');
    render(panel());
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${dhcp.url}?step=${dhcp.maxPosition}`);
  });

  test('a finished lesson makes the next unfinished one Start, not Continue, with an orange chip', () => {
    seedProgress({ [first.key]: { status: 'finished', furthestPosition: first.maxPosition } }, first.key);
    render(panel());
    const start = screen.getByRole('link', { name: 'Start' });
    expect(start).toHaveAttribute('href', available[1]!.url);
    expect(screen.queryByRole('link', { name: 'Continue' })).toBeNull();
    expect(box().querySelector('.upnext__k')).toHaveTextContent(/^Up next$/);
    expect(chip()).toHaveAttribute('data-state', 'here');
    expect(document.querySelectorAll('.strip__sq i[data-state="current"]')).toHaveLength(1);
    expect(document.querySelectorAll('.strip__sq i[data-state="done"]')).toHaveLength(1);
  });

  test('everything ready finished offers Watch again: a done chip with its number still in the markup, every square done, none current', () => {
    seedProgress(Object.fromEntries(available.map((e) => [e.key, { status: 'finished' as const, furthestPosition: e.maxPosition }])), first.key);
    render(panel());
    expect(screen.getByRole('link', { name: 'Watch again' })).toBeInTheDocument();
    expect(box()).toHaveAttribute('data-kind', 'done-so-far');
    expect(box().querySelector('.upnext__k')).toHaveTextContent(/^✓ Done so far$/);
    expect(chip()).toHaveAttribute('data-state', 'done');
    expect(chip().textContent).toMatch(/^Lesson \d\d$/);
    expect(document.querySelectorAll('.strip__sq i[data-state="done"]')).toHaveLength(available.length);
    expect(document.querySelector('.strip__sq i[data-state="current"]')).toBeNull();
  });

  test('the chip numbers a lesson by this track’s own number (a lesson two tracks share has a number in each)', () => {
    // dhcp is lesson N of this fixture track; the same slug's number in another track would differ, and the island reads the entry it was given.
    const shifted = entries.map((e) => (e.available && e.slug === 'dhcp' ? { ...e, number: 14 } : e));
    seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 2 } }, 'dhcp');
    render(panel(shifted));
    expect(chip().textContent).toBe('Lesson 14');
  });

  test('with no ready lesson it still draws the strip and nothing else', () => {
    const none = entries.filter((e) => !e.available);
    render(panel(none));
    expect(document.querySelector('.strip')).not.toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(document.querySelector('.upnext')).toBeNull();
  });

  test('a lesson that is not ready has no state on its square, so the strip draws it faint (E10)', () => {
    // In this track's fixture only two lessons are ready; the other eighteen are not.
    render(panel());
    const squares = [...document.querySelectorAll('.strip__sq i')];
    expect(squares).toHaveLength(entries.length);
    expect(squares.filter((el) => el.hasAttribute('data-state'))).toHaveLength(available.length);
    expect(squares.filter((el) => !el.hasAttribute('data-state'))).toHaveLength(entries.length - available.length);
    expect(document.querySelector('.strip__w')).toHaveTextContent(`0 of ${entries.length} lessons done · ${available.length} ready`);
  });

  test('the island takes entries, known and trackUrl alone: no figure slots, no children', () => {
    expect(readFileSync('src/components/hub/TrackPanelProgress.tsx', 'utf8')).not.toMatch(/art\$\{|\[art|children|ReactNode/);
  });

  // The shared storage keeps saying it failed for as long as its module lives, so this test renders an island of its
  // own from fresh modules; the afterEach restores localStorage, and the other tests never see the failure.
  test('blocked storage shows the first-visit render without an error', async () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    vi.resetModules();
    const { default: Blocked } = await import('./TrackPanelProgress');
    render(<Blocked entries={entries} known={known} trackUrl="/networking" />);
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', first.url);
    expect(within(box()).getByText('First lesson')).toBeInTheDocument();
  });

  test('hydrates the first-visit server render with saved progress and no mismatch, then shows the lesson to continue', async () => {
    seedProgress({ [later.key]: { status: 'in-progress', furthestPosition: 2 } }, later.key);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const island = () => <TrackPanelProgress entries={entries} known={known} trackUrl="/networking" />;
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
    expect(within(container).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `${later.url}?step=2`);
    expect(container.querySelector('.upnext__k')).toHaveTextContent('Up next');
    expect(container.querySelector('.upnext__n')).toHaveTextContent(`Lesson ${two(later.number)}`);

    act(() => root.unmount());
    container.remove();
  });
});
