import type { Citation } from '../content/sources';
import { sourceMarks } from './sourceNumbers';

/** A source's number in the lesson's list, by its id (`numberedSources`). */
export type Numbers = ReadonlyMap<string, number>;

/**
 * The numbers after a claim, one for each source it cites. A number is the source's place in Learn's list, and opens
 * the exact place the claim cites. Nothing for a claim that cites nothing.
 */
export function Marks({ cite, numbers }: { cite: Citation[]; numbers: Numbers }) {
  const marks = sourceMarks(cite, numbers);
  if (marks.length === 0) return null;
  return (
    <sup className="explain__marks">
      {marks.map((mark) => (
        <a key={mark.n} href={mark.url} target="_blank" rel="noopener" title={mark.places} aria-label={`Source ${mark.n}: ${mark.places} (opens in a new tab)`}>
          {mark.n}
        </a>
      ))}
    </sup>
  );
}
