import { useEffect, useId, useRef, type ReactNode } from 'react';
import type { LogDef } from '../content/schema';
import type { LogRow } from '../engine/timeline';

/** What a glyph can stand for: a message's kind, an outcome that did not get through, a change or a note. */
type GlyphKind = LogDef['legend'][number]['kind'];

/** Drawn in a 14 × 14 box, each in its own colour, which a word in the legend always explains. */
const SHAPES: Record<GlyphKind, ReactNode> = {
  request: <rect x="2.5" y="2.5" width="9" height="9" rx="1" fill="none" stroke="var(--request)" strokeWidth="2" />,
  response: (
    <path d="M2 7h8M7 3l4 4-4 4" fill="none" stroke="var(--response)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  broadcast: (
    <>
      <circle cx="7" cy="7" r="5" fill="none" stroke="var(--broadcast)" strokeWidth="2" />
      <circle cx="7" cy="7" r="1.6" fill="var(--broadcast)" />
    </>
  ),
  control: <path d="M7 1.8L12.2 7 7 12.2 1.8 7z" fill="none" stroke="var(--control)" strokeWidth="2" strokeLinejoin="round" />,
  encrypted: (
    <>
      <rect x="2.5" y="6.5" width="9" height="6" rx="1" fill="none" stroke="var(--encrypted)" strokeWidth="1.8" />
      <path d="M4.8 6.5V4.8a2.2 2.2 0 0 1 4.4 0v1.7" fill="none" stroke="var(--encrypted)" strokeWidth="1.8" />
    </>
  ),
  blocked: (
    <>
      <circle cx="7" cy="7" r="5" fill="none" stroke="var(--blocked)" strokeWidth="2" />
      <path d="M5 5l4 4M9 5l-4 4" stroke="var(--blocked)" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  dropped: (
    <>
      <circle cx="7" cy="7" r="5" fill="none" stroke="var(--blocked)" strokeWidth="1.6" strokeDasharray="2 2" />
      <path d="M5 5l4 4M9 5l-4 4" stroke="var(--blocked)" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  change: (
    <path
      d="M4 3v8M4 11l-2-2M4 11l2-2M10 11V3M10 3L8 5M10 3l2 2"
      fill="none"
      stroke="var(--ink-strong)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  note: (
    <>
      <circle cx="7" cy="7" r="5" fill="none" stroke="var(--muted)" strokeWidth="1.6" />
      <path d="M7 6.3v3.4" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7" cy="4.4" r="0.9" fill="var(--muted)" />
    </>
  ),
};

function Glyph({ kind }: { kind: GlyphKind }) {
  return (
    <svg className="log__glyph" viewBox="0 0 14 14" aria-hidden="true" focusable="false" data-glyph={kind}>
      {SHAPES[kind]}
    </svg>
  );
}

/** The words that say a message did not get through; its colour alone never does. */
const OUTCOME_WORD = { blocked: 'Blocked', dropped: 'Dropped' } as const;

/**
 * A message's glyph follows its kind, or its outcome when it did not get
 * through. A note takes the legend's note entry, which a lesson may name as a
 * change (Firewalls' rule changes are notes).
 */
function glyphFor(row: LogRow, noteKind: GlyphKind): GlyphKind {
  if (row.type === 'note' || row.kind === null) return noteKind;
  if (row.outcome === 'blocked' || row.outcome === 'dropped') return row.outcome;
  return row.kind;
}

export interface LogPanelProps {
  log: LogDef;
  rows: LogRow[];
  /** What the log says while it has no rows. */
  idle: string;
  /** The row that has just played, which pulses once. */
  fresh?: string | null;
  /** The playback controls, which sit in the header. */
  controls?: ReactNode;
}

/**
 * The log under the scene: its title, its legend and the playback controls,
 * over a real table of `#` plus the unit's own columns. A column keyed `plain`
 * shows each event's plain words. Blocked and lost messages are drawn in the
 * blocked colour and say so in words. The table scrolls inside itself and
 * keeps the latest row in view.
 */
export function LogPanel({ log, rows, idle, fresh = null, controls }: LogPanelProps) {
  const titleId = useId();
  const noteKind = log.legend.find((entry) => entry.kind === 'note' || entry.kind === 'change')?.kind ?? 'note';
  // The outcome's word goes in the plain-words column, or the last one when there is none.
  const flagColumn = log.columns.some((c) => c.key === 'plain') ? 'plain' : log.columns.at(-1)!.key;

  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = scroller.current;
    if (box !== null) box.scrollTop = box.scrollHeight;
  }, [rows.length]);

  return (
    <div className="console__panel console__log">
      <div className="log__head">
        <h2 id={titleId} className="console__ptitle">
          {log.title}
        </h2>
        {log.legend.length > 0 ? (
          <ul className="log__legend" aria-label="Legend">
            {log.legend.map((entry) => (
              <li key={entry.kind}>
                <Glyph kind={entry.kind} />
                {entry.label}
              </li>
            ))}
          </ul>
        ) : null}
        {controls}
      </div>
      <div ref={scroller} className="log__scroll" role="region" aria-labelledby={titleId} tabIndex={0}>
        <table className="log__table" aria-labelledby={titleId}>
          <thead>
            <tr>
              <th scope="col" className="log__n">
                #
              </th>
              {log.columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="log__idle" colSpan={log.columns.length + 1} data-idle="">
                  {idle}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const missed = row.outcome === 'blocked' || row.outcome === 'dropped' ? row.outcome : null;
                return (
                  <tr key={row.eventId} data-outcome={missed ?? undefined} data-fresh={row.eventId === fresh ? '' : undefined}>
                    <td>
                      <span className="log__num">
                        <Glyph kind={glyphFor(row, noteKind)} />
                        {row.n}
                      </span>
                    </td>
                    {log.columns.map((column) => {
                      const plain = column.key === 'plain';
                      const text = plain ? row.plain : Object.hasOwn(row.cells, column.key) ? row.cells[column.key] : '';
                      return (
                        <td key={column.key} className={plain ? 'log__prose' : undefined}>
                          {missed !== null && column.key === flagColumn ? (
                            <>
                              <span className="log__flag">{OUTCOME_WORD[missed]}</span>{' '}
                            </>
                          ) : null}
                          {text}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogPanel;
