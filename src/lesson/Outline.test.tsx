// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { buildEntries } from '../content/registry';
import type { Lesson } from '../content/schema';
import { makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import { emptyProgress } from '../progress/store';
import { Outline } from './Outline';

vi.mock('../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../content/test-fixtures')).FIXTURE_PARTS }));

const DHCP: Lesson = validateLesson(makeLesson({ slug: 'dhcp', title: 'DHCP' })).lesson;
/** Alpha (core): 0 Overview, 1–5 steps, 6 Learn, 7 Practice. Beta (app): 8 Overview, 9–13 steps, 14 Learn, 15 Practice. */
const TWO: Lesson = validateLesson(
  makeTwoUnitLesson({ slug: 'how-the-internet-works', title: 'How the Internet Works' }),
).lesson;
const entries = buildEntries(networkingTrack, { dhcp: DHCP, 'how-the-internet-works': TWO });

function show(lesson: Lesson, position: number, onGo = vi.fn()) {
  return render(
    <Outline
      lesson={lesson}
      position={position}
      onGo={onGo}
      entries={entries}
      currentKey={`networking/${lesson.slug}`}
      progress={emptyProgress()}
    />,
  );
}

const item = (name: RegExp) => screen.getByRole('button', { name });

test('a one-unit lesson lists Overview, the Watch steps with their subs, Learn and Practice, marking done and current', async () => {
  const onGo = vi.fn();
  show(DHCP, 2, onGo);
  const nav = screen.getByRole('navigation', { name: 'This lesson' });
  expect(within(nav).getByText('Watch · 5 steps')).toBeInTheDocument();
  expect(item(/^Overview/)).toHaveTextContent('A small lesson used only by tests');
  expect(item(/^Neighbor Hello/)).toHaveTextContent('The laptop speaks first');
  expect(item(/^What happened and why/)).toHaveTextContent('In plain words, then the names');
  expect(item(/^Two questions/)).toHaveTextContent('Just for you, nothing is scored');

  // Done before the current position, with a check; the current one is marked in words for assistive tech.
  expect(item(/^Overview/)).toHaveAttribute('data-state', 'done');
  expect(item(/^Neighbor Hello/)).toHaveAttribute('data-state', 'done');
  expect(item(/^Neighbor Hello/)).toHaveTextContent('✓');
  expect(item(/^Neighbor Reply/)).toHaveAttribute('aria-current', 'step');
  expect(item(/^Table Lookup/)).not.toHaveAttribute('data-state');
  expect(item(/^Table Lookup/)).toHaveTextContent('3');

  await userEvent.click(item(/^What happened and why/));
  expect(onGo).toHaveBeenCalledWith(6);
});

test('a multi-unit lesson shows protocol rows with filters, and the current one opened', async () => {
  const onGo = vi.fn();
  show(TWO, 0, onGo);
  const nav = screen.getByRole('navigation', { name: '2 protocols' });
  const filters = within(nav).getByRole('group', { name: 'Filter' });
  expect(within(filters).getAllByRole('button').map((b) => b.textContent)).toEqual(['All', 'Core', 'Apps', 'Security']);
  expect(within(filters).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');

  // One row per unit, with its name and purpose. The current one is open, showing its parts.
  const alpha = item(/^01\s*Alpha/);
  expect(alpha).toHaveTextContent('How a router remembers who it has heard from.');
  expect(alpha).toHaveAttribute('aria-expanded', 'true');
  expect(item(/^02\s*Beta/)).toHaveAttribute('aria-expanded', 'false');
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
  expect(item(/^02\s*Beta/)).toBeInTheDocument();
  expect(item(/^01\s*Alpha/)).toBeInTheDocument();
  await userEvent.click(within(filters).getByRole('button', { name: 'Security' }));
  expect(screen.queryByRole('button', { name: /Beta/ })).toBeNull();
  expect(item(/^01\s*Alpha/)).toBeInTheDocument();
  await userEvent.click(within(filters).getByRole('button', { name: 'All' }));

  // A unit's row goes to its Overview.
  await userEvent.click(item(/^02\s*Beta/));
  expect(onGo).toHaveBeenCalledWith(8);
});

test('in a later unit, earlier units are done and the current one is open', () => {
  show(TWO, 10);
  expect(item(/Alpha/)).toHaveAttribute('data-state', 'done');
  expect(item(/Alpha/)).toHaveTextContent('✓');
  expect(item(/^02\s*Beta/)).toHaveAttribute('aria-expanded', 'true');
  const parts = item(/^02\s*Beta/).closest('li')!.querySelector('ol')!;
  expect(within(parts).getByRole('button', { name: /Neighbor Reply/ })).toHaveAttribute('aria-current', 'step');
  expect(within(parts).getByRole('button', { name: /Neighbor Hello/ })).toHaveAttribute('data-state', 'done');
});
