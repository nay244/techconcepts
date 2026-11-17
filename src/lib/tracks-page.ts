// The Tracks page's panels, worked out from the tracks when the page is built. Nothing here runs in the browser.
import type { CoverId } from '../art/figures/covers';
import { getEntries, type LessonSummary } from '../content/registry';
import { plannedTracks, tracks } from '../content/tracks';
import { knownFrom } from './entries';
import { firstSentence } from './text';

/** The cover each track with lessons wears on Home's card and its own page. A new track needs one here before the site builds. */
export const TRACK_COVERS: Record<string, CoverId> = { 'how-the-internet-works': 'web', networking: 'networking' };

/** A track with lessons: its card shows this visitor's progress and the lesson to take next. */
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
  /** The track's own cover, the drawing on its card (the one Home's card for it wears). */
  cover: CoverId;
  /** The strip's words in their longest form (every lesson done), so their width never depends on progress. */
  stripLongest: string;
}

/** A track with no lessons yet: no link, no progress, and our cover on its card. */
export interface PlannedTrackCard {
  ready: false;
  id: string;
  title: string;
  blurb: string;
  cover: CoverId;
}

export type TrackCard = ReadyTrackCard | PlannedTrackCard;

/** `N of N lessons done`, with the ready count when some lessons are not ready: the widest the strip's words get (digits are tabular on the page). */
export function stripLongest(entries: LessonSummary[]): string {
  const total = entries.length;
  const ready = entries.filter((e) => e.available).length;
  const base = `${total} of ${total} lessons done`;
  return ready < total ? `${base} · ${ready} ready` : base;
}

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
      cover: TRACK_COVERS[track.id]!,
      stripLongest: stripLongest(entries),
    };
  });
  const later = plannedTracks.map(
    (track): PlannedTrackCard => ({ ready: false, id: track.id, title: track.title, blurb: track.blurb, cover: track.cover }),
  );
  return [...ready, ...later];
}
