/**
 * Checking that a lesson's text points at other lessons by their place in the
 * track. A sentence that says "lesson N" must be about lesson N: the registry's
 * entries give the number, and a small map of the words a sentence uses for
 * each lesson it may point at gives the topic. Each lesson's test passes its
 * own map, because a sentence names a lesson the way that sentence needs.
 * `textsOf` lives in `src/content/texts.ts`, beside `textsAt`, which the
 * strict lesson path uses; it is re-exported here.
 */
import { getEntries } from '../content/registry';
import type { Lesson } from '../content/schema';
import { textsOf } from '../content/texts';

export { textsOf };

/** Each "lesson N" and "lessons N and M" in a lesson's text, with the string it sits in. */
export function lessonNumbers(lesson: Lesson): { text: string; n: number }[] {
  return textsOf(lesson).flatMap((text) =>
    [...text.matchAll(/\blessons? (\d+)(?: and (\d+))?/gi)].flatMap((m) =>
      [m[1], m[2]].filter((n) => n !== undefined).map((n) => ({ text, n: Number(n) })),
    ),
  );
}

/**
 * The lesson numbers that do not name what their sentence is about, in the
 * track's numbering, as messages; empty when every one does. `topics` maps a
 * lesson's slug to the words a sentence about it uses.
 */
export function misnamedLessons(lesson: Lesson, topics: Record<string, string>, trackId = 'networking'): string[] {
  const entries = getEntries(trackId);
  return lessonNumbers(lesson).flatMap(({ text, n }) => {
    const slug = entries[n - 1]?.slug ?? `nothing (the track has ${entries.length} lessons)`;
    const topic = Object.hasOwn(topics, slug) ? topics[slug] : undefined;
    return topic !== undefined && text.includes(topic) ? [] : [`“lesson ${n}” is ${slug}, which “${text}” is not about`];
  });
}

/** Each "The X lesson" in a lesson's text, at the start of a sentence or in it: lessons named by their title, not their number. */
export function lessonTitles(lesson: Lesson): string[] {
  return textsOf(lesson).flatMap((text) => [...text.matchAll(/\b[Tt]he ([A-Z][\w/]*(?: [A-Z][\w/]*)*) lesson\b/g)].map((m) => m[1]!));
}
