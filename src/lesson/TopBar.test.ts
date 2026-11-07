import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { initialPlayback } from '../engine/playback';
import { slotsFor } from '../engine/timeline';
import { emptyProgress } from '../progress/store';
import { osiHeading, TopBar } from './TopBar';

test('osiHeading names a single layer, and joins several with "and"', () => {
  expect(osiHeading([7])).toBe('OSI layer 7, Application');
  expect(osiHeading([2])).toBe('OSI layer 2, Data link');
  expect(osiHeading([4, 3, 3])).toBe('OSI layers 3 and 4');
  expect(osiHeading([2, 3, 4])).toBe('OSI layers 2, 3 and 4');
  expect(osiHeading([])).toBeNull();
});

test('osiHeading without names gives a single layer as its number only, as lesson 1 says it', () => {
  expect(osiHeading([7], { named: false })).toBe('OSI layer 7');
  expect(osiHeading([6], { named: false })).toBe('OSI layer 6');
  expect(osiHeading([3, 4], { named: false })).toBe('OSI layers 3 and 4');
  expect(osiHeading([], { named: false })).toBeNull();
});

/** The top bar at the lesson's Overview, as markup. */
function topBarOf(lesson: Lesson): string {
  return renderToStaticMarkup(
    createElement(TopBar, {
      lesson,
      trackTitle: 'Networking Concepts',
      trackUrl: '/networking',
      number: 10,
      total: 20,
      state: initialPlayback(),
      slot: slotsFor(lesson)[0]!,
      unit: lesson.units[0]!,
      reducedMotion: false,
      entries: [],
      currentKey: `networking/${lesson.slug}`,
      progress: emptyProgress(),
    }),
  );
}

test('the OSI chip reads the unit’s cited layers, and a unit that spans layers shows none', () => {
  const lesson = liftedFixture(makeLesson());
  const layered = topBarOf({ ...lesson, units: [{ ...lesson.units[0]!, osi: { layers: [3, 4], cite: [] } }] });
  expect(layered).toContain('OSI layers 3 and 4');
  expect(layered.match(/<i data-on="">/g)).toHaveLength(2);
  const spans = topBarOf({ ...lesson, units: [{ ...lesson.units[0]!, osi: 'spans' }] });
  expect(spans).not.toContain('topbar__osi');
  expect(spans).not.toContain('OSI layer');
});
