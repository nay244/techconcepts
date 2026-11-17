const OSI_NAMES = ['Physical', 'Data link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'];

/**
 * 'OSI layer 7, Application', or 'OSI layers 3 and 4'. Null when the unit names no layer. With `named: false`, a
 * single layer is only its number, 'OSI layer 7': a lesson of many units says it that way (internet-v2).
 */
export function osiHeading(layers: number[], { named = true }: { named?: boolean } = {}): string | null {
  const sorted = [...new Set(layers)].sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  if (sorted.length === 1) return named ? `OSI layer ${sorted[0]}, ${OSI_NAMES[sorted[0]! - 1]}` : `OSI layer ${sorted[0]}`;
  return `OSI layers ${sorted.slice(0, -1).join(', ')} and ${sorted.at(-1)}`;
}

/** The badge at the head of the words: its label, then the seven layers as chips, the unit's lit. */
export function OsiBadge({ heading, layers }: { heading: string; layers: number[] }) {
  return (
    <div className="explain__osi">
      <p>{heading}</p>
      <span className="explain__chips" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7].map((layer) => (
          <i key={layer} data-on={layers.includes(layer) ? '' : undefined}>
            {layer}
          </i>
        ))}
      </span>
    </div>
  );
}
