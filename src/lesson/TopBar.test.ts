// @vitest-environment jsdom
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { initialPlayback } from '../engine/playback';
import { slotsFor } from '../engine/timeline';
import { TopBar } from './TopBar';

/** The bar at the lesson's Overview, as markup. */
function topBarOf(lesson: Lesson, state = initialPlayback()): string {
  return renderToStaticMarkup(
    createElement(TopBar, {
      lesson,
      trackTitle: 'Networking Concepts',
      trackUrl: '/networking',
      number: 10,
      total: 20,
      state,
      slot: slotsFor(lesson)[state.position]!,
      unit: lesson.units[0]!,
      reducedMotion: false,
      onGo: () => undefined,
      onOpenLessons: () => undefined,
    }),
  );
}

const dom = (html: string): Document => new DOMParser().parseFromString(html, 'text/html');

test('the bar is a div with no landmark, holding "Tracks /", the track’s name and the timeline, and no mark, theme button or stamp (D19 cases 2, 12, 16)', () => {
  const lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
  const html = topBarOf(lesson);
  const doc = dom(html);
  const bar = doc.querySelector('.console__top')!;
  expect(bar.tagName).toBe('DIV');
  expect(doc.querySelector('header')).toBeNull();
  expect([...bar.querySelectorAll('a')].map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
    ['Tracks', '/tracks'],
    ['Networking Concepts', '/networking'],
  ]);
  expect(bar.querySelector('nav[aria-label="This lesson"]')).not.toBeNull();
  expect(html).not.toMatch(/stamp|Checked|logo|theme-toggle|topbar__brand|topbar__segments|Lesson 10 of 20|OSI/);
});

test('the bar names the lessons button for the words it shows and for what it does (E23)', () => {
  const lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
  const button = dom(topBarOf(lesson)).querySelector('.top__lessons')!;
  expect(button.getAttribute('aria-label')).toBe('10 of 20: all 20 lessons, this is lesson 10');
  expect(button.textContent).toBe('10 of 20');
});
