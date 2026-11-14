// The glossary as this site builds it: the real groups, lessons, sources and check dates given to `glossaryData`. The page
// and every lesson page read it; it is worked out once per build.
import { GLOSSARY_GROUPS } from '../content/glossary';
import { getEntries, getLesson, glossaryCheckedOn, tracksOf } from '../content/registry';
import { SOURCES } from '../content/sources';
import { tracks } from '../content/tracks';
import { glossaryData, type GlossaryData, type GlossaryLesson } from './glossary';

/** Every ready lesson once, with the titles of the tracks that list it. */
export function readyLessons(): GlossaryLesson[] {
  return tracks.flatMap((track) =>
    getEntries(track.id).flatMap((e) => {
      const lesson = e.available && e.canonical === e.url ? getLesson(e.slug) : undefined;
      return e.available && lesson !== undefined ? [{ lesson, tracks: tracksOf(e.slug).map((t) => t.title) }] : [];
    }),
  );
}

let built: GlossaryData | undefined;

export function siteGlossary(): GlossaryData {
  built ??= glossaryData({
    groups: GLOSSARY_GROUPS,
    lessons: readyLessons(),
    trackTitles: tracks.map((t) => t.title),
    sources: SOURCES,
    dates: Object.fromEntries(GLOSSARY_GROUPS.map((g) => [g.id, glossaryCheckedOn(g.id)])),
  });
  return built;
}
