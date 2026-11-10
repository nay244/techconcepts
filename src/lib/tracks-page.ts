// The Tracks page's panels, worked out from the tracks when the page is built. Nothing here runs in the browser.
import type { CoverId } from '../art/figures/covers';
import { getEntries, type AvailableSummary, type LessonSummary } from '../content/registry';
import { plannedTracks, tracks } from '../content/tracks';
import { knownFrom } from './entries';
import { lessonFigure } from './figures';
import { firstSentence } from './text';

/** The cover each track with lessons wears on Home's card and its own page. A new track needs one here before the site builds. */
export const TRACK_COVERS: Record<string, CoverId> = { 'how-the-internet-works': 'web', networking: 'networking' };

/** A track with lessons: its panel shows this visitor's progress and the lesson to take next. */
export interface ReadyTrackCard {
  ready: true;
  /** The panel's id, which Home's track cards link to (`/tracks#<id>`). */
  id: string;
  title: string;
  /** The track's own page. */
  href: string;
  /** Who it is for: the first sentence of the track's description. */
  blurb: string;
  /** Every lesson the track lists, ready or not, in order, for the progress island. */
  entries: LessonSummary[];
  /** Each ready lesson's key and last position, for the progress island. */
  known: Record<string, number>;
  /** Each ready lesson's figure, for the island's slot named after the lesson's number (`art<number>`). */
  figures: { slot: string; svg: string }[];
}

/** A track with no lessons yet: no link, no progress, and our cover on its "Coming soon" card. */
export interface PlannedTrackCard {
  ready: false;
  id: string;
  title: string;
  blurb: string;
  cover: CoverId;
}

export type TrackCard = ReadyTrackCard | PlannedTrackCard;

/** Every track with lessons, in Home's order, then the tracks still being written. */
export function trackCards(): TrackCard[] {
  const ready = tracks.map((track): ReadyTrackCard => {
    const entries = getEntries(track.id);
    return {
      ready: true,
      id: track.id,
      title: track.title,
      href: `/${track.id}`,
      blurb: firstSentence(track.description),
      entries,
      known: knownFrom(entries),
      figures: entries
        .filter((e): e is AvailableSummary => e.available)
        .map((entry) => ({ slot: `art${entry.number}`, svg: lessonFigure(track.id, entry) })),
    };
  });
  const later = plannedTracks.map(
    (track): PlannedTrackCard => ({ ready: false, id: track.id, title: track.title, blurb: track.blurb, cover: track.cover }),
  );
  return [...ready, ...later];
}
