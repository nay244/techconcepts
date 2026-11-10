import { expect, test } from 'vitest';
import { getEntries, getLesson } from '../content/registry';
import { tracks } from '../content/tracks';
import { lessonCheckCounts } from './checked';

test('counts every ready lesson once, and how many of them have passed the fact-check', () => {
  const slugs = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])));
  const cited = [...slugs].filter((slug) => getLesson(slug)!.origin === 'cited');
  expect(lessonCheckCounts()).toEqual({ checked: cited.length, total: slugs.size });
  // Today: OSI Model is the one lesson in the cited shape, which only builds with a passing report.
  expect(cited).toContain('osi-model');
  expect(lessonCheckCounts().checked).toBeLessThanOrEqual(lessonCheckCounts().total);
});
