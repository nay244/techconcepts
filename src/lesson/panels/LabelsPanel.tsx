import type { MessageLabels } from '../../content/schema';
import './labels.css';

export interface LabelsPanelProps {
  /** The headers the message has now, outermost first, or null before any event has set them. */
  labels: MessageLabels | null;
}

/** The sentence a screen reader gets for the strip: the headers outermost first, then the data. */
export function headersSentence(labels: MessageLabels | null): string {
  if (labels === null) return 'Headers on the message: none yet, just the data.';
  if (labels.list.length === 0) return 'Headers on the message: none left, just the data.';
  const parts = labels.list.map((n, i) => {
    const word = labels.mark?.n === n ? (labels.mark.kind === 'new' ? ' (just added)' : ' (being read)') : '';
    return `${i === 0 ? 'layer ' : ''}${n}${word}`;
  });
  return `Headers on the message: ${parts.join(', ')}, then the data.`;
}

function noteOf(labels: MessageLabels | null): string {
  if (labels === null) return 'No headers yet';
  const n = labels.list.length;
  if (n === 0) return 'No headers left';
  return `${n} ${n === 1 ? 'header' : 'headers'}, outermost first`;
}

/* The message's strip under the OSI figure, as in the approved mockup: one chip for each header the message has,
   outermost first, then a dashed chip for the data. A header just added fills its chip; one being read outlines it
   in marigold and in a thicker border, so colour is never the only signal. The words for a screen reader are the
   sentence above; the event's own words reach the console's live region, so the strip has none. */
export function LabelsPanel({ labels }: LabelsPanelProps) {
  return (
    <div className="labels" role="group" aria-label="The message">
      <p className="sr-only">{headersSentence(labels)}</p>
      <div className="labels-row" aria-hidden="true">
        <span className="labels-title">Message</span>
        {(labels?.list ?? []).map((n) => {
          const kind = labels?.mark?.n === n ? labels.mark.kind : null;
          return (
            <span key={n} className={`labels-chip${kind === 'new' ? ' is-new' : kind === 'read' ? ' is-read' : ''}`}>
              L{n}
            </span>
          );
        })}
        <span className="labels-chip is-data">data</span>
        <span className="labels-note">{noteOf(labels)}</span>
      </div>
    </div>
  );
}
