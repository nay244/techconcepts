// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { getEntries, getLesson, neighbors, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import { forwardButton, initialPlayback } from '../engine/playback';
import { slotsFor } from '../engine/timeline';
import { definitionsFor } from '../lib/glossary';
import { siteGlossary } from '../lib/glossary-site';
import { Explanation } from './Explanation';
import { Timeline, positionsOf } from './Timeline';
import before from './words-at-210a9a5.json';

/**
 * D19 case 11: the page rearranged changes no lesson word. `words-at-210a9a5.json` is the text of the words region (the
 * Explanation) of every ready lesson at every position, recorded on `revamp` at 210a9a5 before B22 changed anything, with the
 * stamp's text and the OSI badge's (which moved from the bar to the head of the words) taken out. The recording is the
 * baseline: no `git diff` against a commit, which a shallow clone does not have.
 */
const lessons = tracks.flatMap((track) =>
  getEntries(track.id).flatMap((entry) => (entry.available ? [{ key: `${track.id}/${entry.slug}`, track, entry, entries: getEntries(track.id) }] : [])),
);

test.each(lessons.map((l) => [l.key, l] as const))('(b) %s: the words say what they said at every position', (key, { entry, entries, track }) => {
  const lesson = getLesson(entry.slug)!;
  const recorded = (before as Record<string, string[]>)[key]!;
  expect(recorded).toHaveLength(slotsFor(lesson).length);
  slotsFor(lesson).forEach((slot, position) => {
    const view = render(
      <Explanation
        lesson={lesson}
        position={position}
        slot={slot}
        unit={lesson.units[slot.unit]!}
        picked={{}}
        onPick={vi.fn()}
        next={neighbors(entries, entry.slug).next as AvailableSummary | null}
        nextFigure={null}
        number={entry.number}
        total={entries.length}
        trackUrl={`/${track.id}`}
        definitions={definitionsFor(siteGlossary().lessonMap, lesson.slug)}
        onGo={vi.fn()}
      />,
    );
    view.container.querySelectorAll('.explain__osi').forEach((el) => el.remove());
    expect((view.container.textContent ?? '').replace(/\s+/g, ' ').trim(), `${key} at ${position}`).toBe(recorded[position]);
    view.unmount();
  });
});

test.each(lessons.map((l) => [l.key, l] as const))('(c) %s: every stop’s name and the forward button’s words carry the step’s title verbatim', (_key, { entry, entries }) => {
  const lesson = getLesson(entry.slug)!;
  const unit = lesson.units[0]!;
  const view = render(
    <Timeline units={lesson.units} unitIndex={0} positions={positionsOf(lesson, 0, unit.steps.length)} position={0} slot={slotsFor(lesson)[0]!} onGo={() => undefined} hold={null} />,
  );
  expect([...view.container.querySelectorAll('.tl__name')].map((n) => n.textContent)).toEqual(['Overview', ...unit.steps.map((s) => s.title), 'Learn', 'Practice']);
  view.unmount();
  const end = { next: { url: '/x', title: neighbors(entries, entry.slug).next?.title ?? 'x' }, number: entry.number, total: entries.length };
  unit.steps.forEach((step, i) => {
    const forward = forwardButton(lesson, { ...initialPlayback(), position: i }, end);
    expect(forward.words.full).toBe(`Next: ${step.title}`);
    expect(forward.names.full).toBe(`Next: ${step.title}, step ${i + 1}`);
  });
});
