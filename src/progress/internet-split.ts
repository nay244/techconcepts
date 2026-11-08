import { mergeRecords, type LessonProgress, type ProgressData } from './store';

/** The old Networking lesson 1, whose 14 protocol sections are now the lessons of How the Internet Works. */
export const OLD_INTERNET_KEY = 'how-the-internet-works';
/** The track those 14 lessons belong to. */
export const INTERNET_TRACK = 'how-the-internet-works';

/**
 * The 14 lessons in track order, with how many positions each has (Overview, its steps, Learn, Practice). The old
 * lesson's positions ran through them in this order, 120 in all. Written here so the browser loads no lesson data; a
 * test holds it to the real lessons.
 */
export const INTERNET_SPLIT: readonly (readonly [slug: string, positions: number])[] = [
  ['what-is-http', 8],
  ['what-is-https', 9],
  ['what-is-tcp', 9],
  ['what-is-udp', 8],
  ['what-is-ip', 8],
  ['what-is-dns', 8],
  ['what-is-dhcp', 9],
  ['what-is-icmp', 9],
  ['what-is-smtp', 9],
  ['what-is-pop3', 8],
  ['what-is-imap', 8],
  ['what-is-ftp', 9],
  ['what-is-ssh', 9],
  ['what-is-tls', 9],
];

const LAST_POSITION = INTERNET_SPLIT.reduce((sum, [, size]) => sum + size, 0) - 1;

/**
 * The records a saved place in the old lesson becomes (design 2026-11-08, "Saved progress"), and the lesson holding
 * its furthest step. Finished: all 14 finished. Otherwise the protocols before the furthest step are finished, the
 * one holding it is in progress at the same step within its own lesson (none on its Overview, finished on its last
 * step), and later ones get none. A step past the end counts as the last one. Every record keeps the old time.
 */
function recordsFor(old: LessonProgress): { records: [string, LessonProgress][]; holder: string } {
  const furthest = old.status === 'finished' ? LAST_POSITION : Math.min(Math.max(0, Math.floor(old.furthestPosition)), LAST_POSITION);
  const records: [string, LessonProgress][] = [];
  let start = 0;
  for (const [slug, size] of INTERNET_SPLIT) {
    const last = size - 1;
    if (furthest >= start + size) {
      records.push([slug, { status: 'finished', furthestPosition: last, lastOpened: old.lastOpened }]);
    } else {
      const local = furthest - start;
      if (local > 0) {
        records.push([slug, { status: local === last ? 'finished' : 'in-progress', furthestPosition: local, lastOpened: old.lastOpened }]);
      }
      return { records, holder: slug };
    }
    start += size;
  }
  // Unreachable: furthest is at most LAST_POSITION, which the last protocol holds.
  throw new Error('The furthest step is past every protocol.');
}

/**
 * Saved progress with the old lesson split into the 14 lessons that replace it, or `d` itself when it names no old
 * lesson. Each new record merges into one already saved under that slug, and the old record goes. A last lesson that
 * named the old one names the lesson holding its furthest step (HTTP when there was no record), in the new track.
 */
export function splitInternet(d: ProgressData): ProgressData {
  const old = Object.hasOwn(d.lessons, OLD_INTERNET_KEY) ? d.lessons[OLD_INTERNET_KEY] : undefined;
  if (old === undefined && d.lastLesson !== OLD_INTERNET_KEY) return d;

  const lessons: Record<string, LessonProgress> = { ...d.lessons };
  delete lessons[OLD_INTERNET_KEY];
  let holder = INTERNET_SPLIT[0]![0];
  if (old !== undefined) {
    const split = recordsFor(old);
    holder = split.holder;
    for (const [slug, record] of split.records) {
      const existing = Object.hasOwn(lessons, slug) ? lessons[slug] : undefined;
      lessons[slug] = existing === undefined ? record : mergeRecords(existing, record);
    }
  }
  const named = d.lastLesson === OLD_INTERNET_KEY;
  return { ...d, lessons, lastLesson: named ? holder : d.lastLesson, lastTrack: named ? INTERNET_TRACK : d.lastTrack };
}
