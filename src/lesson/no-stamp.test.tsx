// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { expect, test, vi } from 'vitest';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { initialPlayback } from '../engine/playback';
import { slotsFor } from '../engine/timeline';
import { Explanation } from './Explanation';
import { LessonConsole } from './LessonConsole';
import { TopBar } from './TopBar';

/** D19 case 12 (2.97): the lesson page takes no stamp. A `@ts-expect-error` line that passes `stamp=` compiles only while the prop is gone. */
const lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const slot = slotsFor(lesson)[0]!;

test('TopBar, Explanation and LessonConsole take no stamp prop, and render no stamp or "Checked"', () => {
  const topBar = createElement(TopBar, {
    lesson, trackTitle: 'T', trackUrl: '/t', number: 1, total: 2, state: initialPlayback(), slot, unit: lesson.units[0]!, reducedMotion: false, onGo: vi.fn(), onOpenLessons: vi.fn(),
    // @ts-expect-error - the stamp left the bar
    stamp: { checked: '2026-11-12', sources: 3 },
  });
  const words = createElement(Explanation, {
    lesson, position: 0, slot, unit: lesson.units[0]!, picked: {}, onPick: vi.fn(), next: null, nextFigure: null, number: 1, total: 2, trackUrl: '/t', onGo: vi.fn(),
    // @ts-expect-error - the stamp left the words
    stamp: { checked: '2026-11-12', sources: 3 },
  });
  const console = createElement(LessonConsole, {
    trackId: 't', trackTitle: 'T', lesson, entry: { key: 'dhcp', slug: 'dhcp', title: 'DHCP', number: 1, available: true, url: '/t/dhcp', canonical: '/t/dhcp', trackId: 't', partTitle: 'P', maxPosition: 7 } as never, total: 2, next: null, nextFigure: null, entries: [],
    // @ts-expect-error - the stamp left the console
    stamp: { checked: '2026-11-12', sources: 3 },
  });
  for (const element of [topBar, words, console]) {
    const view = render(element);
    expect(view.container.querySelector('.stamp, .explain__stamp')).toBeNull();
    expect(view.container.textContent).not.toMatch(/Checked|Not checked yet/);
    view.unmount();
  }
});
