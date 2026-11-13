import { expect, test } from 'vitest';
import { checkedOn, getEntries, getLesson } from '../content/registry';
import { tracks } from '../content/tracks';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { lessonCheckCounts, lessonStamp } from './checked';

test('counts every ready lesson once, and how many of them have passed the fact-check', () => {
  const slugs = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])));
  const checked = [...slugs].filter((slug) => checkedOn(slug) !== null);
  expect(lessonCheckCounts()).toEqual({ checked: checked.length, total: slugs.size });
  // A lesson builds only with a passing report, so OSI Model is among them.
  expect(checked).toContain('osi-model');
  expect(lessonCheckCounts().checked).toBeLessThanOrEqual(lessonCheckCounts().total);
});

test('a checked lesson’s stamp carries the day its report gives; a lesson not checked yet carries none', () => {
  const osi = lessonStamp(getLesson('osi-model')!);
  expect(osi.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(osi.sources).toBe(getLesson('osi-model')!.units[0]!.references.length);
  // A lesson not checked yet: no ready lesson is one, so a fixture whose slug no report names.
  const unchecked = liftedFixture(makeLesson({ slug: 'a-lesson-not-checked' }));
  const listed = new Set(unchecked.units.flatMap((u) => u.references.map((r) => r.url)));
  expect(listed.size).toBeGreaterThan(0);
  expect(lessonStamp(unchecked)).toEqual({ checked: null, sources: listed.size });
});

test('every ready lesson has a check date', () => {
  const slugs = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])));
  for (const slug of slugs) {
    const lesson = getLesson(slug)!;
    expect(lessonStamp(lesson).checked, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
});
