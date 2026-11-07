import { expect, test } from 'vitest';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { slotsFor } from '../engine/timeline';
import { placeLabel } from './placeLabel';

test('placeLabel says the place in the unit, never a step’s title', () => {
  const lesson = liftedFixture(makeLesson());
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
