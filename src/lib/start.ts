// Where the site's Start buttons lead (Home's hero, the header's Start learning), worked out when the page is built.
import { getEntries, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';

/** The first ready lesson of the first track: How the Internet Works' HTTP. The build stops if that track has none. */
export function startLesson(): AvailableSummary {
  const first = tracks[0]!;
  const entry = getEntries(first.id).find((e): e is AvailableSummary => e.available);
  if (entry === undefined) throw new Error(`The ${first.id} track comes first, and has no ready lesson to start with.`);
  return entry;
}
