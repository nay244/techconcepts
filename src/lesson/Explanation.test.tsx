// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { buildEntries, neighbors } from '../content/registry';
import type { Lesson } from '../content/schema';
import { makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import { slotsFor } from '../engine/timeline';
import { Explanation } from './Explanation';
import { Rich } from './Rich';

// The real lessons load here too (through the registry), so the fixture's parts are added to the real ones.
vi.mock('../art/scenes/parts', async (importOriginal) => ({
  FIGURE_PARTS: (await import('../content/test-fixtures')).withFixtureParts(
    (await importOriginal<typeof import('../art/scenes/parts')>()).FIGURE_PARTS,
  ),
}));

const DHCP: Lesson = validateLesson(makeLesson({ slug: 'dhcp', title: 'DHCP' })).lesson;
const FIREWALLS: Lesson = validateLesson(makeLesson({ slug: 'firewalls', title: 'Firewalls' })).lesson;
const TWO: Lesson = validateLesson(
  makeTwoUnitLesson({ slug: 'how-the-internet-works', title: 'How the Internet Works' }),
).lesson;
const entries = buildEntries(networkingTrack, { dhcp: DHCP, firewalls: FIREWALLS, 'how-the-internet-works': TWO });

function show(position: number, lesson: Lesson = DHCP, onGo = vi.fn()) {
  const entry = entries.find((e) => e.slug === lesson.slug)!;
  const slot = slotsFor(lesson)[position]!;
  return render(
    <Explanation
      lesson={lesson}
      position={position}
      slot={slot}
      unit={lesson.units[slot.unit]!}
      picked={{}}
      onPick={vi.fn()}
      next={neighbors(entries, lesson.slug).next}
      number={entry.number}
      total={entries.length}
      trackUrl="/networking"
      onGo={onGo}
    />,
  );
}

const deeper = () => screen.getByText('Go deeper').closest('details')!;

test('Rich renders **x** as bold and never as HTML', () => {
  const { container } = render(<Rich text={'A **hello** to <img src=x onerror=alert(1)> & **the router**, and a stray ** too'} />);
  expect([...container.querySelectorAll('b')].map((b) => b.textContent)).toEqual(['hello', 'the router']);
  expect(container.querySelector('img')).toBeNull();
  expect(container).toHaveTextContent('A hello to <img src=x onerror=alert(1)> & the router, and a stray ** too');
});

test('the Overview shows the kicker, name, full name, hook, description and facts', () => {
  show(0);
  expect(screen.getByText('Overview')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Neighbor table' })).toBeInTheDocument();
  expect(screen.getByText('Neighbor table (a demonstration)')).toBeInTheDocument();
  expect(screen.getByText(/^Think of a front desk/)).toBeInTheDocument();
  expect(screen.getByText(/^A router keeps a short list/)).toBeInTheDocument();
  expect(screen.getByText('Example address')).toBeInTheDocument();
  expect(screen.queryByText('Go deeper')).toBeNull();
});

test('Go deeper is closed by default on steps and Learn', async () => {
  const { unmount } = show(1);
  expect(screen.getByText('Watch · Step 1 of 5')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Neighbor Hello' })).toBeInTheDocument();
  expect(screen.getByText('The laptop speaks first')).toBeInTheDocument();
  // The narrative's **hello** is bold.
  expect(screen.getByText('hello', { selector: 'b' })).toBeInTheDocument();
  expect(deeper()).not.toHaveAttribute('open');
  expect(within(deeper()).getByText('the technical details')).toBeInTheDocument();
  expect(within(deeper()).getByText(/^A real neighbor protocol/)).toBeInTheDocument();
  expect(within(deeper()).getByText('34 bytes')).toBeInTheDocument();
  await userEvent.click(screen.getByText('Go deeper'));
  expect(deeper()).toHaveAttribute('open');
  unmount();

  show(6);
  expect(screen.getByRole('heading', { level: 2, name: 'What happened and why' })).toBeInTheDocument();
  expect(deeper()).not.toHaveAttribute('open');
  // It ends with the unit's sources, which open in a new tab.
  const sources = within(deeper()).getAllByRole('link');
  expect(sources.at(-1)).toHaveAccessibleName(/^RFC 826: An Ethernet Address Resolution Protocol/);
  expect(sources.at(-1)).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc826');
  expect(within(deeper()).getByText('Sources')).toBeInTheDocument();
});

test('Learn shows the lead, the idea → name pairs and the pattern box', () => {
  show(6);
  expect(screen.getByText('In plain words, then the names')).toBeInTheDocument();
  const terms = screen.getByRole('list', { name: 'Terms' });
  const first = within(terms).getAllByRole('listitem')[0]!;
  expect(first).toHaveTextContent('Saying who you are');
  expect(within(first).getByText('Hello')).toBeInTheDocument();
  const pattern = screen.getByText('Say hello, get an answer, then look it up next time.').closest('div')!;
  expect(within(pattern).getByText('Neighbor Hello')).toBeInTheDocument();
  expect(within(pattern).getByText('Table Lookup')).toBeInTheDocument();
});

test('the end row names the next ready lesson, or says the last ready one for now', () => {
  const { unmount } = show(7);
  expect(screen.getByText(/Next ready lesson/)).toHaveTextContent('That’s the whole lesson. Next ready lesson: Firewalls, lesson 17.');
  expect(screen.getByRole('link', { name: 'Go to Firewalls' })).toHaveAttribute('href', '/networking/firewalls');
  unmount();

  show(7, FIREWALLS);
  expect(screen.getByText(/last ready one/)).toHaveTextContent(
    'That’s the whole lesson, and the last ready one for now. Lessons 18 to 20 are coming soon.',
  );
  expect(screen.getByRole('link', { name: 'Back to the track' })).toHaveAttribute('href', '/networking');
});

test('in a lesson of many units, a unit’s end row leads to the next unit', async () => {
  const onGo = vi.fn();
  const { unmount } = show(7, TWO, onGo);
  expect(screen.getByText('Alpha · Practice')).toBeInTheDocument();
  expect(screen.getByText(/^Next:/)).toHaveTextContent('Next: Beta, how a router remembers who it has heard from.');
  await userEvent.click(screen.getByRole('button', { name: 'Go to Beta' }));
  expect(onGo).toHaveBeenCalledWith(8);
  unmount();

  // The last unit's end row is the lesson's.
  show(15, TWO);
  expect(screen.getByText('Beta · Practice')).toBeInTheDocument();
  expect(screen.getByText(/Next ready lesson/)).toHaveTextContent('Next ready lesson: DHCP, lesson 10.');
});

test('kickers name the unit in a lesson of many units', () => {
  const { unmount } = show(9, TWO);
  expect(screen.getByText('Beta · Step 1 of 5')).toBeInTheDocument();
  unmount();
  show(8, TWO);
  expect(screen.getByText('Beta · Overview')).toBeInTheDocument();
});
