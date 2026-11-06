import { expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { makeLesson } from '../content/test-fixtures';
import { slotsFor } from '../engine/timeline';
import { placeLabel } from './placeLabel';

vi.mock('../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../content/test-fixtures')).FIXTURE_PARTS }));

test('placeLabel says the place in the unit, never a step’s title', () => {
  const lesson = validateLesson(makeLesson()).lesson;
  const unit = lesson.units[0]!;
  expect(slotsFor(lesson).map((slot) => placeLabel(unit, slot))).toEqual([
    'Overview',
    'Step 1 of 5',
    'Step 2 of 5',
    'Step 3 of 5',
    'Step 4 of 5',
    'Step 5 of 5',
    'Learn',
    'Practice',
  ]);
});
