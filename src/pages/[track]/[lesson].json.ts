import type { APIRoute, GetStaticPaths } from 'astro';
import { getEntries, getLesson, neighbors, type AvailableSummary } from '../../content/registry';
import { tracks } from '../../content/tracks';
import { lessonFigure } from '../../lib/figures';
import { buildStamp } from '../../lib/build-stamp';
import { definitionsFor } from '../../lib/glossary';
import { siteGlossary } from '../../lib/glossary-site';

/** One data file for every lesson page, in every track: what that page's island is given, as plain JSON. */
export const getStaticPaths = (() =>
  tracks.flatMap((track) => {
    const entries = getEntries(track.id);
    return entries
      .filter((entry): entry is AvailableSummary => entry.available)
      .map((entry) => {
        const lesson = getLesson(entry.slug);
        if (lesson === undefined) throw new Error(`No lesson file for ${entry.key}.`);
        return {
          params: { track: track.id, lesson: entry.slug },
          props: { entry, lesson, next: neighbors(entries, entry.slug).next },
        };
      });
  })) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { entry, lesson, next } = props as { entry: AvailableSummary; lesson: NonNullable<ReturnType<typeof getLesson>>; next: ReturnType<typeof neighbors>['next'] };
  const body = {
    lesson,
    entry,
    next,
    nextFigure: next === null ? null : lessonFigure(next),
    definitions: definitionsFor(siteGlossary().lessonMap, lesson.slug),
    stamp: buildStamp,
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
};
