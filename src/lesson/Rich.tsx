import { Fragment } from 'react';

const BOLD = /\*\*(.+?)\*\*/g;

/**
 * Lesson prose: `**term**` becomes bold, and everything else stays text. Content
 * is never read as HTML, so `<img>` in a lesson shows as the characters it is.
 * A `**` with no partner is left as written.
 */
export function Rich({ text }: { text: string }) {
  // split() with a capturing group keeps the bold parts at the odd indexes.
  const parts = text.split(BOLD);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

export default Rich;
