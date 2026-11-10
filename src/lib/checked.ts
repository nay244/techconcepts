// How many of the site's ready lessons have been through the independent fact-check. Home and About both say it.
import { checkedOn, getEntries, getLesson } from '../content/registry';
import type { Lesson } from '../content/schema';
import { tracks } from '../content/tracks';
import type { LessonStamp } from './stamp';

/**
 * Every ready lesson counted once (two tracks may list one lesson), and how many have passed the fact-checker. A
 * lesson in the cited shape builds only with a passing report (src/content/factcheck/gate.ts), so "cited" means checked.
 */
export function lessonCheckCounts(): { checked: number; total: number } {
  const slugs = [...new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])))];
  return { checked: slugs.filter((slug) => getLesson(slug)?.origin === 'cited').length, total: slugs.length };
}

/**
 * A lesson's stamp: the day it passed the fact-check, or null when it has not been checked yet, and how many sources
 * it lists, each counted once across its units.
 */
export function lessonStamp(lesson: Lesson): LessonStamp {
  const sources = new Set(lesson.units.flatMap((u) => u.references.map((r) => r.url)));
  return { checked: checkedOn(lesson.slug), sources: sources.size };
}
