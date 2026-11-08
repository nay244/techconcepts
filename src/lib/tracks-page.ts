// The Tracks page's cards, worked out from the tracks when the page is built. Nothing here runs in the browser.
import type { CoverId } from '../art/figures/covers';
import { getEntries, trackTotals } from '../content/registry';
import type { Track } from '../content/schema';
import { plannedTracks, tracks } from '../content/tracks';
import { knownFrom, levelLabel } from './entries';
import { firstSentence } from './home';

/** The cover each track with lessons wears on its card. A new track needs one here before the page builds. */
export const TRACK_COVERS: Record<string, CoverId> = { 'how-the-internet-works': 'web', networking: 'networking' };

export interface TrackCard {
  id: string;
  title: string;
  /** The track's page; null for a track that has no lessons yet. */
  href: string | null;
  /** 'Concept track · Beginner'. */
  kind: string;
  blurb: string;
  cover: CoverId;
  /** '19 lessons · 3 ready', or 'No lessons yet'. */
  count: string;
  /** 'Being written' for a track with no lessons yet. */
  flag: string | null;
  /** True only for the first track, where a newcomer starts: its card is flagged "Start here". */
  start: boolean;
  /** Each ready lesson's key and last position, for the progress island; empty for a track with no lessons. */
  known: Record<string, number>;
  /** How many lessons the track plans; 0 for a track with no lessons. */
  planned: number;
}

const kindOf = (type: Track['type'], level: Track['level']): string =>
  `${type === 'concept' ? 'Concept' : 'Certification'} track · ${levelLabel(level)}`;

/** Every track with lessons, in Home's order, then the tracks still being written. */
export function trackCards(): TrackCard[] {
  const ready = tracks.map((track, i): TrackCard => {
    const cover = TRACK_COVERS[track.id];
    if (cover === undefined) throw new Error(`The ${track.id} track has no cover for the Tracks page.`);
    const entries = getEntries(track.id);
    const { available, planned } = trackTotals(entries);
    return {
      id: track.id,
      title: track.title,
      href: `/${track.id}`,
      kind: kindOf(track.type, track.level),
      blurb: firstSentence(track.description),
      cover,
      count: `${planned} lessons · ${available} ready`,
      flag: null,
      start: i === 0,
      known: knownFrom(entries),
      planned,
    };
  });
  const later = plannedTracks.map(
    (track): TrackCard => ({
      id: track.id,
      title: track.title,
      href: null,
      kind: kindOf(track.type, track.level),
      blurb: track.blurb,
      cover: track.cover,
      count: 'No lessons yet',
      flag: 'Being written',
      start: false,
      known: {},
      planned: 0,
    }),
  );
  return [...ready, ...later];
}
