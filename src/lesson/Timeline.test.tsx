// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { positionOf, slotsFor } from '../engine/timeline';
import { StackedPlaces, Timeline, positionsOf } from './Timeline';

const lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const unit = lesson.units[0]!;
const n = unit.steps.length;

function timeline(position: number, o: { hold?: { next: number; ms: number } | null; onGo?: (p: number) => void } = {}) {
  return render(
    <Timeline
      units={lesson.units}
      unitIndex={0}
      positions={positionsOf(lesson, 0, n)}
      position={position}
      slot={slotsFor(lesson)[position]!}
      onGo={o.onGo ?? (() => undefined)}
      hold={o.hold ?? null}
    />,
  );
}

test('one stop a place, in order: Overview, the steps, Learn, Practice (case 20)', () => {
  timeline(0);
  const stops = within(screen.getByRole('navigation', { name: 'This lesson' })).getAllByRole('button');
  expect(stops).toHaveLength(n + 3);
  expect(stops[0]!.getAttribute('aria-label')).toBe('Overview');
  expect(stops.at(-2)!.getAttribute('aria-label')).toBe('Learn');
  expect(stops.at(-1)!.getAttribute('aria-label')).toBe('Practice');
});

test('exactly one stop is the current step; those before it are done with a tick, those after are ahead (case 20)', () => {
  const { container } = timeline(4);
  const items = [...container.querySelectorAll('.tl li')];
  expect(items.map((li) => li.getAttribute('data-state'))).toEqual(
    items.map((_, i) => (i < 4 ? 'done' : i === 4 ? 'current' : null)),
  );
  expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  expect(items[4]!.querySelector('button')!.getAttribute('aria-current')).toBe('step');
  expect(items[0]!.querySelector('.tl__mark')!.textContent).toBe('✓');
  expect(items[3]!.querySelector('.tl__mark')!.textContent).toBe('✓');
  expect(items[5]!.querySelector('.tl__mark')!.textContent).toBe('5');
});

test('a stop is named for its place, ", done" once passed; its title is the place; its mark is hidden from the tree (case 26)', () => {
  const { container } = timeline(3);
  const titles = unit.steps.map((s) => s.title);
  const names = [...container.querySelectorAll('.tl__stop')].map((b) => b.getAttribute('aria-label'));
  expect(names).toEqual([
    'Overview, done',
    `Step 1, ${titles[0]}, done`,
    `Step 2, ${titles[1]}, done`,
    `Step 3, ${titles[2]}`,
    ...titles.slice(3).map((t, i) => `Step ${i + 4}, ${t}`),
    'Learn',
    'Practice',
  ]);
  expect([...container.querySelectorAll('.tl__stop')].map((b) => b.getAttribute('title'))).toEqual(['Overview', ...titles, 'Learn', 'Practice']);
  for (const mark of container.querySelectorAll('.tl__mark')) expect(mark.getAttribute('aria-hidden')).toBe('true');
  expect(container.querySelector('ol')!.querySelectorAll('li')).toHaveLength(n + 3);
});

test('a step’s name is its title exactly: no trim, no case change (case 11c)', () => {
  const { container } = timeline(0);
  const shown = [...container.querySelectorAll('.tl__name')].map((s) => s.textContent);
  expect(shown).toEqual(['Overview', ...unit.steps.map((s) => s.title), 'Learn', 'Practice']);
});

test('the line ends with the place’s count, and the current step’s name (marks form) only at a step', () => {
  const step = timeline(2).container;
  expect(step.querySelector('.tl__count')!.textContent).toBe(`Step 2 of ${n}`);
  expect(step.querySelector('.tl__now')!.textContent).toBe(unit.steps[1]!.title);
  expect(step.querySelector('.tl__end')!.hasAttribute('data-plain')).toBe(false);
  const overview = timeline(0).container;
  expect(overview.querySelectorAll('.tl__count')[0]!.textContent).toBe('Overview');
  expect(overview.querySelectorAll('.tl__end')[0]!.hasAttribute('data-plain')).toBe(true);
});

test('pressing a stop goes to that place in one press', async () => {
  const onGo = vi.fn();
  timeline(0, { onGo });
  await userEvent.click(screen.getByRole('button', { name: new RegExp(`^Step 3, `) }));
  expect(onGo).toHaveBeenCalledWith(positionOf(lesson, 0, 'step', 3));
  await userEvent.click(screen.getByRole('button', { name: 'Practice' }));
  expect(onGo).toHaveBeenLastCalledWith(positionOf(lesson, 0, 'practice'));
});

test('during a hold the current stop and the next carry the fill, over the hold’s length; with none they do not (case 27)', () => {
  const held = timeline(2, { hold: { next: 3, ms: 1300 } }).container;
  const items = [...held.querySelectorAll('.tl li')];
  expect(items.map((li) => [li.hasAttribute('data-fill'), li.hasAttribute('data-fill-next')])).toEqual(
    items.map((_, i) => [i === 2, i === 3]),
  );
  expect((held.querySelector('.timeline') as HTMLElement).style.getPropertyValue('--hold')).toBe('1300ms');
  const idle = timeline(2).container;
  expect(idle.querySelectorAll('[data-fill], [data-fill-next]')).toHaveLength(0);
});

test('the page without JavaScript gets a plain list of the places in a <noscript>, headed "In this lesson" (case 46)', () => {
  // The browser never draws a <noscript>'s children with scripting on, so this reads the server's markup.
  const html = renderToStaticMarkup(
    <Timeline units={lesson.units} unitIndex={0} positions={positionsOf(lesson, 0, n)} position={0} slot={slotsFor(lesson)[0]!} onGo={() => undefined} hold={null} />,
  );
  const plain = /<noscript>(.*)<\/noscript>/s.exec(html)![1]!;
  expect(plain).toContain('In this lesson');
  expect(plain.match(/<li>/g)).toHaveLength(n + 3);
  expect(plain).toContain('<li>Overview</li>');
  expect(plain).toContain(`<li>${unit.steps[0]!.title}</li>`);
});

test('the row’s copy has no no-script list; the stacked list names every place once (B23)', () => {
  const props = { units: lesson.units, unitIndex: 0, positions: positionsOf(lesson, 0, n), position: 0, slot: slotsFor(lesson)[0]!, onGo: () => undefined, hold: null };
  const bar = renderToStaticMarkup(<Timeline {...props} />);
  const row = renderToStaticMarkup(<Timeline {...props} home="row" />);
  expect(bar).toContain('timeline__plain');
  expect(row).not.toContain('timeline__plain');
  expect(row).toContain('timeline timeline--row');
  const stacked = renderToStaticMarkup(<StackedPlaces units={lesson.units} unitIndex={0} positions={props.positions} />);
  expect(stacked).toContain('timeline__stack');
  expect(stacked).toContain('In this lesson');
  expect(stacked.match(/<li>/g)).toHaveLength(n + 3);
});
