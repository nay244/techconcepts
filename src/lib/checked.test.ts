import { expect, test } from 'vitest';
import { getEntries, getLesson } from '../content/registry';
import { tracks } from '../content/tracks';
import { lessonCheckCounts, lessonStamp } from './checked';

test('counts every ready lesson once, and how many of them have passed the fact-check', () => {
  const slugs = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])));
  const cited = [...slugs].filter((slug) => getLesson(slug)!.origin === 'cited');
  expect(lessonCheckCounts()).toEqual({ checked: cited.length, total: slugs.size });
  // Today: OSI Model is the one lesson in the cited shape, which only builds with a passing report.
  expect(cited).toContain('osi-model');
  expect(lessonCheckCounts().checked).toBeLessThanOrEqual(lessonCheckCounts().total);
});

test('a checked lesson’s stamp carries the day its report gives; a lesson not checked yet carries none', () => {
  const osi = lessonStamp(getLesson('osi-model')!);
  expect(osi.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(osi.sources).toBe(getLesson('osi-model')!.units[0]!.references.length);
  expect(lessonStamp(getLesson('dhcp')!)).toEqual({ checked: null, sources: 2 });
});

test('every cited lesson has a check date, and no other lesson does', () => {
  const slugs = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])));
  for (const slug of slugs) {
    const lesson = getLesson(slug)!;
    expect(lessonStamp(lesson).checked === null, slug).toBe(lesson.origin !== 'cited');
  }
});
