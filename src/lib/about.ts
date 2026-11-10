// About's words that are worked out from the content when the page is built (about-v1): the tracks still to come,
// named in one sentence, and a lesson's sources split the way the page lists them. Nothing here runs in the browser.
import type { Source } from '../content/schema';

const COUNT_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const AND = new Intl.ListFormat('en', { type: 'conjunction' });

/**
 * One sentence naming the tracks still to come, in the order given: "Five more tracks are on the way: A, B, C, D,
 * and E." The count is a word up to ten. An empty string when no track is still to come.
 */
export function comingTracksSentence(titles: readonly string[]): string {
  if (titles.length === 0) return '';
  const count = COUNT_WORDS[titles.length - 1] ?? String(titles.length);
  const tracks = titles.length === 1 ? 'track is' : 'tracks are';
  return `${count} more ${tracks} on the way: ${AND.format(titles)}.`;
}

/**
 * One or two sentences on how many of the ready lessons have passed the independent fact-check, from the counts
 * given: "So far 1 of 18 lessons has also been through an independent check of every claim against those sources.
 * The others are waiting for theirs." Once every lesson has, it says so in one sentence. An empty string when
 * there is no ready lesson.
 */
export function factCheckSentence(checked: number, total: number): string {
  if (total === 0) return '';
  if (checked >= total) return 'Every lesson has also been through an independent check of every claim against those sources.';
  const lessons = total === 1 ? 'lesson' : 'lessons';
  const has = checked === 1 ? 'has' : 'have';
  return `So far ${checked} of ${total} ${lessons} ${has} also been through an independent check of every claim against those sources. The others are waiting for theirs.`;
}

export interface SourceRow {
  /** The standard that defines it, such as "RFC 2131". */
  standard: string;
  /** Its title, such as "Dynamic Host Configuration Protocol". */
  title: string;
  url: string;
}

/**
 * A lesson's sources as About lists them, each label "<standard>: <title>" split at its first colon:
 * "RFC 2131: Dynamic Host Configuration Protocol" is "RFC 2131" and "Dynamic Host Configuration Protocol".
 * Throws by name for a label with no colon to split at.
 */
export function sourceRows(sources: readonly Source[]): SourceRow[] {
  return sources.map(({ label, url }) => {
    const at = label.indexOf(': ');
    if (at === -1) throw new Error(`The source "${label}" has no "<standard>: <title>" label, which About’s list needs.`);
    return { standard: label.slice(0, at), title: label.slice(at + 2), url };
  });
}
