import { appliedEvents, type DerivedState } from '../engine/timeline';

/**
 * What the live region says at a step, from what the step has played so far, in this order:
 * 1. the step's title;
 * 2. the plain words of the latest log row the step has played (a message or a note);
 * 3. the summary of each change only the table shows that played after that row, in order.
 *
 * A table change takes no time to play, so it lands a moment after the message before it. Its summary is added after
 * the message's words, not put in their place, so a screen reader still says both. A jump has played none of the step,
 * so it says the title alone. Pause plays the rest of the step at once, and the same rule reads what it played.
 */
export function stepAnnouncement(title: string, derived: DerivedState): string {
  const played = appliedEvents(derived);
  const lastRow = played.findLastIndex((e) => e.type !== 'table');
  const parts = [title];
  if (lastRow !== -1) {
    const id = played[lastRow]!.id;
    const row = derived.log.findLast((r) => r.eventId === id);
    if (row !== undefined) parts.push(row.plain);
  }
  for (const e of played.slice(lastRow + 1)) if (e.type === 'table') parts.push(e.summary);
  return parts.map((part, i) => (i < parts.length - 1 ? asSentence(part) : part)).join(' ');
}

/** A part with another after it ends as a sentence, so a screen reader pauses between the two. */
function asSentence(text: string): string {
  return /[.!?…]$/.test(text) ? text : `${text}.`;
}
