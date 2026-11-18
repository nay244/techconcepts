// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { buildEntries } from '../content/registry';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { slotsFor } from '../engine/timeline';
import { emptyProgress } from '../progress/store';
import { Outline } from './Outline';

const DHCP: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
/** Alpha (core): 0 Overview, 1–5 steps, 6 Learn, 7 Practice. Beta (app): 8 Overview, 9–13 steps, 14 Learn, 15 Practice. */
const TWO: Lesson = liftedFixture(makeTwoUnitLesson({ slug: 'what-is-http', title: 'HTTP' }));
/** A few more of Networking's lessons, written, so their rows are links with a status. */
const WRITTEN = Object.fromEntries(
  [['osi-model', 'OSI Model'], ['packets', 'Packets'], ['ip-address', 'IP Address'], ['arp', 'ARP']].map(([slug, title]) => [slug!, { ...DHCP, slug: slug!, title: title! }]),
);
const NETWORKING_WRITTEN = buildEntries(networkingTrack, { dhcp: DHCP, ...WRITTEN }, () => 'networking');
const NETWORKING = buildEntries(networkingTrack, { dhcp: DHCP }, () => 'networking');
const TOUR = buildEntries(internetTrack, { 'what-is-http': TWO }, () => 'how-the-internet-works');

const stamp = (status: 'finished' | 'in-progress') => ({ status, furthestPosition: 3, lastOpened: '2026-11-10T10:00:00.000Z' });
/** Networking with osi-model and packets finished, ip-address and mac-address in progress (the bar's "2 of 20 done" case). */
const PROGRESS = {
  ...emptyProgress(),
  lessons: { 'osi-model': stamp('finished'), packets: stamp('finished'), 'ip-address': stamp('in-progress') },
};

/** The track column and its sheet as the lesson's own track's page renders them, among that track's lessons. */
function show(lesson: Lesson, position: number, onGo = vi.fn(), seen: number[] = [], progress = emptyProgress(), sheetOpen = false, entries = lesson === TWO ? TOUR : NETWORKING) {
  const current = slotsFor(lesson)[position]!.unit;
  return render(
    <Outline
      lesson={lesson}
      position={position}
      current={current}
      seen={new Set([...seen, current])}
      onGo={onGo}
      entries={entries}
      currentKey={lesson.slug}
      progress={progress}
      trackTitle={lesson === TWO ? 'How the Internet Works' : 'Networking Concepts'}
      trackUrl={lesson === TWO ? '/how-the-internet-works' : '/networking'}
      number={entries.find((e) => e.slug === lesson.slug)!.number}
      total={entries.length}
      sheetOpen={sheetOpen}
      onSheetClose={vi.fn()}
    />,
  );
}

const item = (name: RegExp) => screen.getByRole('button', { name });

test('the column’s head is the lesson’s name (the h1) with its place, the strip and the count, and holds no track name (cases 17, 61)', () => {
  const { container } = show(DHCP, 2, vi.fn(), [], PROGRESS);
  const head = container.querySelector('.track__head')!;
  expect(within(head as HTMLElement).getByRole('heading', { level: 1, name: 'DHCP' })).toHaveAttribute('title', 'DHCP');
  expect(head).toHaveTextContent('Lesson 9 of 20');
  expect(head.querySelectorAll('.cable i')).toHaveLength(20);
  expect(head.querySelectorAll('.cable i[data-s="done"]')).toHaveLength(2);
  expect(head.querySelectorAll('.cable i[data-s="here"]')).toHaveLength(1);
  expect(head).toHaveTextContent('2 of 20 done');
  expect(within(head as HTMLElement).queryByRole('link')).toBeNull();
  expect(head).not.toHaveTextContent(/Networking Concepts|Tracks/);
  // Before progress loads (the server's markup, storage blocked) nothing is done and the head is as tall as it will be.
  const before = show(DHCP, 2).container.querySelector('.track__head')!;
  expect(before).toHaveTextContent('0 of 20 done');
});

test('the nav lists the track’s parts: this lesson’s is a heading and open, the others fold; each part counts its done lessons (case 28, 30)', () => {
  const { container } = show(DHCP, 2, vi.fn(), [], PROGRESS);
  const nav = screen.getByRole('navigation', { name: "Networking Concepts, the track's lessons" });
  const parts = [...nav.querySelectorAll('.part')];
  expect(parts.map((p) => p.querySelector('.part__name')!.textContent)).toEqual([
    'The big picture',
    'Addresses & the local network',
    'Getting between networks',
    ...parts.slice(3).map((p) => p.querySelector('.part__name')!.textContent),
  ]);
  expect(parts.map((p) => p.querySelector('.part__count')!.textContent).slice(0, 3)).toEqual(['✓ 2 of 2', '1 of 4'.replace('1', '0'), '0 of 3']);
  // The part with DHCP: a heading, no details ancestor, no button.
  const here = container.querySelector('[aria-current="page"]')!;
  expect(here.closest('details')).toBeNull();
  const heading = here.closest('section')!.querySelector('h3')!;
  expect(heading.closest('details')).toBeNull();
  expect(within(heading as HTMLElement).queryByRole('button')).toBeNull();
  // Every other part is a closed <details> with a summary.
  const others = [...nav.querySelectorAll('details.part')];
  expect(others.length).toBe(parts.length - 1);
  for (const d of others) expect((d as HTMLDetailsElement).open).toBe(false);
  expect(others[0]!.querySelector('summary')).not.toBeNull();
  // The complete part's count is in the done colour's attribute.
  expect(parts[0]!.querySelector('.part__count')).toHaveAttribute('data-all');
});

test('a lesson row has its number, its title and its status in words: Done, In progress, none, Not ready yet (case 28)', () => {
  show(DHCP, 2, vi.fn(), [], PROGRESS, false, NETWORKING_WRITTEN);
  const row = (name: RegExp) => screen.getAllByRole('link', { name })[0]!;
  expect(row(/OSI Model/)).toHaveTextContent('✓ Done');
  expect(row(/IP Address/)).toHaveTextContent('In progress');
  expect(row(/^ARP/).textContent).not.toMatch(/Done|In progress/);
  expect(row(/DHCP/)).toHaveAttribute('aria-current', 'page');
  expect(screen.getAllByText('Not ready yet').length).toBeGreaterThan(0);
  // "In progress" is not done: two of twenty.
  expect(screen.getByText('2 of 20 done')).toBeInTheDocument();
});

test('the lessons sheet is a modal named "All 20 lessons" with the track’s head and every part open (case 41)', () => {
  const { container } = show(DHCP, 2, vi.fn(), [], PROGRESS, true);
  const dialog = container.querySelector('dialog')!;
  expect(dialog).toHaveAttribute('open');
  expect(within(dialog).getByRole('heading', { name: 'All 20 lessons' })).toBeInTheDocument();
  expect(within(dialog).getByRole('link', { name: 'Tracks' })).toHaveAttribute('href', '/tracks');
  expect(within(dialog).getByRole('link', { name: 'Networking Concepts' })).toHaveAttribute('href', '/networking');
  expect(dialog).toHaveTextContent('2 of 20 done');
  expect(dialog.querySelectorAll('details')).toHaveLength(0);
  expect(dialog.querySelectorAll('.outline__lesson')).toHaveLength(20);
  expect(within(dialog).getByRole('button', { name: /Close/ })).toBeInTheDocument();
});

test('a multi-unit lesson shows protocol rows with filters, and the current one opened', async () => {
  const onGo = vi.fn();
  show(TWO, 0, onGo);
  const filters = screen.getByRole('group', { name: 'Filter' });
  expect(within(filters).getAllByRole('button').map((b) => b.textContent)).toEqual(['All', 'Core', 'Apps', 'Security']);
  expect(within(filters).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');

  // One row per unit, with its name and purpose. The current one is open, showing its parts.
  const alpha = item(/^Alpha/);
  expect(alpha).toHaveTextContent('How a router remembers who it has heard from.');
  // A row goes somewhere, so it says which one is current rather than expanded.
  expect(alpha).toHaveAttribute('aria-current', 'true');
  expect(alpha).not.toHaveAttribute('aria-expanded');
  expect(item(/^Beta/)).not.toHaveAttribute('aria-current');
  const parts = alpha.closest('li')!.querySelector('ol')!;
  expect(within(parts).getByText('Watch · 5')).toBeInTheDocument();
  expect(within(parts).getByText('Learn & Practice')).toBeInTheDocument();
  expect(within(parts).getAllByRole('button').map((b) => b.textContent?.replace(/^\d/, ''))).toEqual([
    'Overview',
    'Neighbor Hello',
    'Neighbor Reply',
    'Table Lookup',
    'Lost Message',
    'Retransmission',
    'Learn',
    'Practice',
  ]);
  expect(within(parts).getByRole('button', { name: /Overview/ })).toHaveAttribute('aria-current', 'step');

  // Filters show the units of a group; the current unit always stays.
  await userEvent.click(within(filters).getByRole('button', { name: 'Core' }));
  expect(within(filters).getByRole('button', { name: 'Core' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('button', { name: /Beta/ })).toBeNull();
  await userEvent.click(within(filters).getByRole('button', { name: 'Apps' }));
  expect(item(/^Beta/)).toBeInTheDocument();
  expect(item(/^Alpha/)).toBeInTheDocument();
  await userEvent.click(within(filters).getByRole('button', { name: 'Security' }));
  expect(screen.queryByRole('button', { name: /Beta/ })).toBeNull();
  expect(item(/^Alpha/)).toBeInTheDocument();
  await userEvent.click(within(filters).getByRole('button', { name: 'All' }));

  // A unit's row goes to its Overview.
  await userEvent.click(item(/^Beta/));
  expect(onGo).toHaveBeenCalledWith(8);
});

test('a unit the learner has opened is ticked, one only passed over is not, and the current one is open', () => {
  const { unmount } = show(TWO, 10, vi.fn(), [0]);
  expect(item(/Alpha/)).toHaveAttribute('data-state', 'seen');
  // The check is for the eye; the words are for assistive tech.
  const mark = item(/Alpha/).querySelector('.outline__unit-n')!;
  expect(mark).toHaveTextContent('✓');
  expect(mark).toHaveAttribute('aria-hidden', 'true');
  expect(item(/Alpha/)).toHaveAccessibleName(/, seen$/);
  unmount();

  show(TWO, 10);
  expect(item(/Alpha/)).not.toHaveAttribute('data-state');
  expect(item(/Alpha/)).toHaveTextContent(/^01/);
  expect(item(/Alpha/)).not.toHaveAccessibleName(/seen/);
  expect(item(/^Beta/)).toHaveAttribute('aria-current', 'true');
  const parts = item(/^Beta/).closest('li')!.querySelector('ol')!;
  expect(within(parts).getByRole('button', { name: /Neighbor Reply/ })).toHaveAttribute('aria-current', 'step');
  expect(within(parts).getByRole('button', { name: /Neighbor Hello/ })).toHaveAttribute('data-state', 'done');
});

