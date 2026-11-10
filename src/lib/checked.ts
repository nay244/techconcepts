// How many of the site's ready lessons have been through the independent fact-check. Home and About both say it.
import { getEntries, getLesson } from '../content/registry';
import { tracks } from '../content/tracks';

/**
 * Every ready lesson counted once (two tracks may list one lesson), and how many have passed the fact-checker. A
 * lesson in the cited shape builds only with a passing report (src/content/factcheck/gate.ts), so "cited" means checked.
 */
export function lessonCheckCounts(): { checked: number; total: number } {
  const slugs = [...new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])))];
  return { checked: slugs.filter((slug) => getLesson(slug)?.origin === 'cited').length, total: slugs.length };
}
