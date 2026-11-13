import { slotsFor } from '../engine/timeline';
import type { CertTag } from './certs';
import { definedWith, defineTrack } from './define';
import { checkedDate, checkFactChecks, checkGlossaryFactChecks, checkUnpathedKinds, reportPath } from './factcheck/gate';
import { parseReport } from './factcheck/report';
import { recheckPath } from './factcheck/recheck';
import { claimSheet } from './factcheck/sheet';
import { GLOSSARY_GROUPS } from './glossary';
import { partsOf, type GlossaryGroup } from './glossary-group';
import { checkLimits, unneededOverrides } from './limits';
import type { Lesson, Track } from './schema';
import { SOURCES, type SourceRegistry } from './sources';
import { tracks } from './tracks';

export type LessonSummary =
  | {
      available: true;
      key: string;
      trackId: string;
      slug: string;
      url: string;
      /** The one address search engines should index: the first listing track's URL for the lesson, `/<home track>/<slug>`. */
      canonical: string;
      number: number;
      title: string;
      subtitle: string;
      partTitle: string;
      summary: string;
      certTags: CertTag[];
      /** Watch steps in every unit together. */
      stepCount: number;
      /** How many units the lesson has: 1 for most, one per protocol in How the Internet Works. */
      units: number;
      /** The last position in the lesson: the last unit's Practice. */
      maxPosition: number;
    }
  | {
      available: false;
      key: string;
      trackId: string;
      slug: string;
      number: number;
      title: string;
      partTitle: string;
    };

export type AvailableSummary = Extract<LessonSummary, { available: true }>;

/**
 * One entry per lesson the track plans, in track order, numbered from 1 across
 * all parts. `lessons` is keyed by slug and holds every lesson file; a planned
 * lesson with no file is returned as unavailable. `homeOf(slug)` is the first
 * track, in `tracks` order, that lists the slug: its URL is the lesson's canonical
 * one. Skips a lesson this track does not list (another track may; `checkListings`
 * catches a lesson no track lists, and overrides no listing track needs). Throws when
 * a listed lesson is filed under a different slug than its own, has a different
 * title than the track lists, or does not fit the track's limits.
 */
export function buildEntries(track: Track, lessons: Record<string, Lesson>, homeOf: (slug: string) => string): LessonSummary[] {
  const planned = new Map(track.parts.flatMap((part) => part.lessons.map((l) => [l.slug, l.title] as const)));
  for (const [slug, lesson] of Object.entries(lessons)) {
    const title = planned.get(slug);
    // A lesson another track lists is not an error here; only a lesson no track lists is (`checkListings`).
    if (title === undefined) continue;
    if (lesson.slug !== slug) throw new Error(`Lesson filed as "${slug}" has the slug "${lesson.slug}"; the slug must match.`);
    if (lesson.title !== title) {
      throw new Error(`Lesson "${slug}" has the title "${lesson.title}", but the ${track.id} track lists the title "${title}".`);
    }
    const misfits = checkLimits(lesson, track.limits);
    if (misfits.length > 0) {
      throw new Error(`Lesson "${slug}" does not fit the ${track.id} track's limits:\n${misfits.map((m) => `  - ${m}`).join('\n')}`);
    }
  }

  const entries: LessonSummary[] = [];
  for (const part of track.parts) {
    for (const planned of part.lessons) {
      const base = {
        key: planned.slug,
        trackId: track.id,
        slug: planned.slug,
        number: entries.length + 1,
        title: planned.title,
        partTitle: part.title,
      };
      const lesson = Object.hasOwn(lessons, planned.slug) ? lessons[planned.slug] : undefined;
      entries.push(
        lesson === undefined
          ? { available: false, ...base }
          : {
              available: true,
              ...base,
              url: `/${track.id}/${planned.slug}`,
              canonical: `/${homeOf(planned.slug)}/${planned.slug}`,
              subtitle: lesson.subtitle,
              summary: lesson.summary,
              certTags: lesson.certTags,
              stepCount: lesson.units.reduce((sum, u) => sum + u.steps.length, 0),
              units: lesson.units.length,
              maxPosition: slotsFor(lesson).length - 1,
            },
      );
    }
  }
  return entries;
}

/**
 * The nearest available lessons before and after `slug`, skipping planned
 * ones. `nextPlanned` is true when the entry right after `slug` exists but is
 * not available yet. An unknown slug has no neighbors.
 */
export function neighbors(
  entries: LessonSummary[],
  slug: string,
): { prev: AvailableSummary | null; next: AvailableSummary | null; nextPlanned: boolean } {
  const index = entries.findIndex((e) => e.slug === slug);
  if (index === -1) return { prev: null, next: null, nextPlanned: false };

  const isAvailable = (e: LessonSummary): e is AvailableSummary => e.available;
  const prev = entries.slice(0, index).reverse().find(isAvailable) ?? null;
  const next = entries.slice(index + 1).find(isAvailable) ?? null;
  const following = entries[index + 1];
  return { prev, next, nextPlanned: following !== undefined && !following.available };
}

/** `planned` counts every entry in the track (the "of 20" in a track's lesson count). */
export function trackTotals(entries: LessonSummary[]): { available: number; planned: number } {
  return { available: entries.filter((e) => e.available).length, planned: entries.length };
}

const LESSON_PATH = /^\.\/lessons\/([^/]+)\.ts$/;

/**
 * Keys the glob result by slug. A lesson is a file directly in `lessons/`, and the file name must equal the lesson's
 * slug. Each lesson must be the one `defineLesson` returned, so a lesson file cannot skip the
 * rules (direction doc §3.4: the build fails if a lesson is missing a citation), and a cited lesson must have been
 * checked against `sources`, the real `SOURCES` outside tests, so it cannot bring a source list of its own.
 */
export function lessonsFromModules(modules: Record<string, Lesson>, sources: SourceRegistry = SOURCES): Record<string, Lesson> {
  const bySlug: Record<string, Lesson> = {};
  for (const [path, lesson] of Object.entries(modules)) {
    const match = LESSON_PATH.exec(path);
    if (match === null) throw new Error(`Unexpected lesson file path "${path}".`);
    const [, fileName] = match as unknown as [string, string];
    if (typeof lesson !== 'object' || lesson === null || typeof lesson.slug !== 'string') {
      throw new Error(`${path} must default-export defineLesson({ ... }).`);
    }
    const checkedAgainst = definedWith(lesson);
    if (checkedAgainst === undefined) {
      throw new Error(
        `${path}: the lesson was not made with defineLesson; wrap it so every rule runs.`,
      );
    }
    if (checkedAgainst !== sources) {
      throw new Error(
        `${path}: the lesson was checked against a different source list; use defineLesson, which checks against SOURCES in src/content/sources.ts.`,
      );
    }
    if (lesson.slug !== fileName) {
      throw new Error(`${path}: the file name "${fileName}" must equal the lesson slug "${lesson.slug}".`);
    }
    bySlug[fileName] = lesson;
  }
  return bySlug;
}

/**
 * Throws, naming the file, for a `.ts` file in a folder under `lessons/` whose folder is not the slug of a lesson. A
 * folder there holds the parts of the lesson it is named after (none does today); anything else would be a lesson
 * file in the wrong place, silently never loaded. `paths` are glob keys like `./lessons/<dir>/<file>.ts`.
 */
export function checkLessonFolders(paths: readonly string[], slugs: readonly string[]): void {
  for (const path of paths) {
    const dir = /^\.\/lessons\/([^/]+)\//.exec(path)?.[1];
    if (dir !== undefined && !slugs.includes(dir)) {
      throw new Error(
        `${path}: lesson files live directly in src/content/lessons/; a folder there holds the parts of the lesson it is named after, and no lesson is named "${dir}".`,
      );
    }
  }
}

/**
 * The tracks, in order, that list `slug`.
 */
function listingTracks(slug: string, trackList: readonly Track[]): Track[] {
  return trackList.filter((t) => t.parts.some((part) => part.lessons.some((l) => l.slug === slug)));
}

/**
 * Throws when a lesson file is listed by no track, or carries an override that no listing track needs (a lesson in
 * several tracks keeps an override while any one of them needs it).
 */
export function checkListings(lessons: Record<string, Lesson>, trackList: readonly Track[]): void {
  for (const [slug, lesson] of Object.entries(lessons)) {
    const listing = listingTracks(slug, trackList);
    if (listing.length === 0) {
      throw new Error(`Lesson "${slug}" is not listed in any track; add it to a part's lessons in src/content/tracks/<track>.ts.`);
    }
    const unneeded = unneededOverrides(lesson, listing.map((t) => t.limits));
    if (unneeded.length > 0) {
      throw new Error(
        `Lesson "${slug}" has overrides the ${listing.map((t) => t.id).join(', ')} track${listing.length > 1 ? 's do' : ' does'} not need:\n${unneeded.map((m) => `  - ${m}`).join('\n')}`,
      );
    }
  }
}

/**
 * Checks every track again with `defineTrack` against `sources` (the real `SOURCES` outside tests), throwing as it
 * does. So a track written as a plain object, or defined against another source list, fails the build: a
 * certification track's pin and objectives are checked against the real registry.
 */
export function checkTracks(trackList: readonly Track[], sources: SourceRegistry = SOURCES): void {
  for (const t of trackList) defineTrack(t, sources);
}

// Test files sit beside the lessons they cover, so they are excluded here. Only files directly in `lessons/` are
// lessons: a lesson's own parts, in a folder named after it, are not.
const modules = import.meta.glob<Lesson>(['./lessons/*.ts', '!./lessons/*.test.ts'], {
  eager: true,
  import: 'default',
});
const lessonsBySlug = lessonsFromModules(modules);
checkLessonFolders(Object.keys(import.meta.glob(['./lessons/*/*.ts', '!./lessons/*/*.test.ts'])), Object.keys(lessonsBySlug));
checkTracks(tracks);
checkListings(lessonsBySlug, tracks);

/**
 * Throws when any lesson in the cited shape lacks a current fact-check report in which every item passes, or when a
 * report has no cited lesson (`factcheck/gate.ts`). `reports` is keyed by path, as `import.meta.glob` gives them; so is
 * `rechecks`, the targeted re-checks beside them (`docs/fact-checks/<slug>.recheck.md`).
 *
 * `astro dev` (mode `development`) only warns, so the author can preview a lesson before it is checked. The build
 * (`production`) and the tests (`test`) still refuse it, so nothing unchecked ships.
 */
export function checkFactCheckReports(
  lessons: readonly Lesson[],
  reports: Record<string, string>,
  sources: SourceRegistry = SOURCES,
  mode: string = import.meta.env.MODE,
  rechecks: Record<string, string> = {},
): void {
  refuseOrWarn(checkFactChecks(lessons, reports, sources, rechecks), mode, 'astro dev shows these lessons anyway; npm run build and the tests refuse them until the fact-checker passes them.');
}

/**
 * Refuses the kinds of cited content that have no fact-check path yet: every objective mapping of a certification track
 * (`factcheck/gate.ts`). The same dev, build and test behaviour as `checkFactCheckReports`.
 */
export function checkUnpathedContent(trackList: readonly Track[], mode: string = import.meta.env.MODE): void {
  refuseOrWarn(
    checkUnpathedKinds(trackList),
    mode,
    'astro dev goes on; npm run build and the tests refuse these mappings until a fact-check path is built for their kind (docs/direction.md, decision 2.16).',
  );
}

/**
 * Every issue with the ties of glossary groups to lessons' terms (docs/glossary-path-spec.md §2, rules 13 and 14, E14):
 * each `{ lesson, term }` names a lesson and exactly one term of its Learn, and a lesson's term is tied by at most one
 * entry or sense across the glossary.
 */
export function checkGlossaryTies(groups: readonly GlossaryGroup[], lessons: Record<string, Lesson>): string[] {
  const issues: string[] = [];
  const tiedBy = new Map<string, string>();
  for (const g of groups) {
    for (const e of g.entries) {
      for (const part of partsOf(e)) {
        const at = `glossary group "${g.id}", entry "${e.id}"${part.sense === undefined ? '' : `, sense "${part.sense.id}"`}`;
        for (const t of part.lessons) {
          const lesson = Object.hasOwn(lessons, t.lesson) ? lessons[t.lesson] : undefined;
          const found = lesson?.units.flatMap((u) => u.learn.terms).filter((x) => x.id === t.term) ?? [];
          if (lesson === undefined) issues.push(`${at}: ties term "${t.term}" of lesson "${t.lesson}", which no lesson has; fix the lesson's slug.`);
          else if (found.length === 0) issues.push(`${at}: ties term "${t.term}" of lesson "${t.lesson}", which is not a term of that lesson's Learn; tie one of its terms by id.`);
          else if (found.length > 1) issues.push(`${at}: ties term "${t.term}" of lesson "${t.lesson}", which names more than one term of that lesson; the tie must name one.`);
          const key = `${t.lesson}\n${t.term}`;
          const first = tiedBy.get(key);
          if (first === undefined) tiedBy.set(key, at);
          else issues.push(`${at}: ties term "${t.term}" of lesson "${t.lesson}", which ${first} already ties; a lesson's term is tied to one entry or sense.`);
        }
      }
    }
  }
  return issues;
}

/** Refuses the ties `checkGlossaryTies` finds, as `checkFactCheckReports` refuses a missing report. */
export function checkGlossaryTiesOrWarn(groups: readonly GlossaryGroup[], lessons: Record<string, Lesson>, mode: string = import.meta.env.MODE): void {
  refuseOrWarn(checkGlossaryTies(groups, lessons), mode, 'astro dev goes on; npm run build and the tests refuse these ties until they name a lesson term.');
}

/**
 * Refuses a glossary group with no current fact-check report in which every item passes, or a report no group owns
 * (`factcheck/gate.ts`). `reports` and `rechecks` are the globs of `docs/fact-checks/glossary/`, keyed by path.
 */
export function checkGlossaryReports(
  groups: readonly GlossaryGroup[],
  lessons: readonly Lesson[],
  reports: Record<string, string>,
  rechecks: Record<string, string> = {},
  sources: SourceRegistry = SOURCES,
  mode: string = import.meta.env.MODE,
): void {
  refuseOrWarn(checkGlossaryFactChecks(groups, lessons, reports, sources, rechecks), mode, 'astro dev shows these groups anyway; npm run build and the tests refuse them until the fact-checker passes them.');
}

function refuseOrWarn(issues: string[], mode: string, devNote: string): void {
  if (issues.length === 0) return;
  const message = `Fact checks:\n- ${issues.join('\n- ')}`;
  if (mode !== 'development') throw new Error(message);
  console.warn(`${message}\n${devNote}`);
}

// Only reports directly in docs/fact-checks/ are lessons' reports: the canary's, in a folder of its own, is not. A
// re-check is `<slug>.recheck.md` beside the full report, read by its own glob.
const reports = import.meta.glob<string>(['../../docs/fact-checks/*.md', '!../../docs/fact-checks/*.recheck.md'], { query: '?raw', import: 'default', eager: true });
const rechecks = import.meta.glob<string>('../../docs/fact-checks/*.recheck.md', { query: '?raw', import: 'default', eager: true });
checkFactCheckReports(Object.values(lessonsBySlug), reports, undefined, undefined, rechecks);
checkUnpathedContent(tracks);

// A glossary group's reports are in a folder of their own, `docs/fact-checks/glossary/`, so a lesson's globs above (depth 1)
// never read them, and a group's id may equal a lesson's slug.
const glossaryReports = import.meta.glob<string>(['../../docs/fact-checks/glossary/*.md', '!../../docs/fact-checks/glossary/*.recheck.md'], { query: '?raw', import: 'default', eager: true });
const glossaryRechecks = import.meta.glob<string>('../../docs/fact-checks/glossary/*.recheck.md', { query: '?raw', import: 'default', eager: true });
checkGlossaryTiesOrWarn(GLOSSARY_GROUPS, lessonsBySlug);
checkGlossaryReports(GLOSSARY_GROUPS, Object.values(lessonsBySlug), glossaryReports, glossaryRechecks);

/**
 * The day a lesson passed its fact-check, as its report gives it ('2026-11-08'), or the later of that and its re-check's
 * when the pair passes the gate; null for a lesson not checked yet: in `astro dev`, one whose report is
 * missing or cannot be read.
 */
export function checkedOn(slug: string): string | null {
  const lesson = getLesson(slug);
  if (lesson === undefined) return null;
  const full = Object.entries(reports).find(([path]) => path.endsWith(`/${reportPath(slug)}`))?.[1];
  const recheck = Object.entries(rechecks).find(([path]) => path.endsWith(`/${recheckPath(slug)}`))?.[1];
  // The sheet is only needed to judge a pair; a lesson with no re-check is read as it always was.
  if (full === undefined || recheck === undefined) return full === undefined ? null : (parseReport(full).header?.checked ?? null);
  return checkedDate(claimSheet(lesson, SOURCES), full, recheck);
}

/** The tracks that list a lesson, in `tracks` order; empty for a slug no track lists. */
export function tracksOf(slug: string): Track[] {
  return listingTracks(slug, tracks);
}

const homeOf = (slug: string): string => tracksOf(slug)[0]!.id;

const entriesByTrack = new Map(tracks.map((t) => [t.id, buildEntries(t, lessonsBySlug, homeOf)]));

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getEntries(trackId: string): LessonSummary[] {
  return entriesByTrack.get(trackId) ?? [];
}

export function getLesson(slug: string): Lesson | undefined {
  return Object.hasOwn(lessonsBySlug, slug) ? lessonsBySlug[slug] : undefined;
}
