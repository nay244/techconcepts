// The glossary as this site builds it: the real groups, lessons, sources and check dates given to `glossaryData`. The page
// and every lesson page read it; it is worked out once per build.
import { GLOSSARY_GROUPS } from '../content/glossary';
import { getEntries, getLesson, glossaryCheckedOn } from '../content/registry';
import { SOURCES } from '../content/sources';
import { tracks } from '../content/tracks';
import { glossaryData, type GlossaryData, type GlossaryLesson } from './glossary';

/** Every ready lesson once, in site order: the tracks in order, each track's lessons in its order, under the lesson's home track. */
function readyLessons(): GlossaryLesson[] {
  return tracks.flatMap((track) =>
    getEntries(track.id).flatMap((e) => {
      const lesson = e.available && e.canonical === e.url ? getLesson(e.slug) : undefined;
      return e.available && lesson !== undefined ? [{ lesson, title: e.title, canonical: e.canonical, trackTitle: track.title }] : [];
    }),
  );
}

let built: GlossaryData | undefined;

export function siteGlossary(): GlossaryData {
  built ??= glossaryData({
    groups: GLOSSARY_GROUPS,
    lessons: readyLessons(),
    sources: SOURCES,
    dates: Object.fromEntries(GLOSSARY_GROUPS.map((g) => [g.id, glossaryCheckedOn(g.id)])),
  });
  return built;
}
