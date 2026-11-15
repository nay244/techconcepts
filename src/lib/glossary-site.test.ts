import { expect, test } from 'vitest';
import { readyLessons } from './glossary-site';

test('the glossary reads every ready lesson once, with the tracks that list it', () => {
  const lessons = readyLessons();
  expect(lessons).toHaveLength(25);
  expect(new Set(lessons.map((l) => l.lesson.slug)).size).toBe(25);
  expect(lessons.find((l) => l.lesson.slug === 'what-is-dns')!.tracks).toEqual(['How the Internet Works', 'Networking Concepts']);
  expect(lessons.find((l) => l.lesson.slug === 'dhcp')!.tracks).toEqual(['Networking Concepts']);
});
