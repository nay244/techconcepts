import { useLayoutEffect, useRef, type ReactNode } from 'react';
import type { Party } from '../content/schema';
import type { LogRow } from '../engine/timeline';

/** Both drawings are 720 units wide, so the names above line up with the lifelines below. */
const WIDTH = 720;
/** Room on the left for each row's number. */
const GUTTER = 28;
const HEAD_HEIGHT = 54;
/** The height of one row, as in the Firewalls mockup. */
export const ROW_H = 42;
/** Where the first row's line sits below the top of the rows. */
const FIRST_ROW = 26;
/** The body is never shorter than this many rows, so the lifelines have some length before anything happens. */
const MIN_ROWS = 4;

/** The words that say a message did not get through, when its row has no decision of its own. */
const OUTCOME_WORD = { blocked: 'Blocked', dropped: 'Dropped' } as const;

/** About how wide a line of 12px text is, per character, for sizing a note's box. */
const CHAR_WIDTH = 6.6;

export interface SequenceViewProps {
  parties: Party[];
  rows: LogRow[];
  /** The row that has just played, which draws in once. */
  current: LogRow | null;
}

/** The parties' lifelines, evenly spaced across the width after the number gutter. */
function lifelineXs(parties: Party[]): Map<string, number> {
  const span = (WIDTH - GUTTER) / parties.length;
  return new Map(parties.map((p, i) => [p.place, GUTTER + span * (i + 0.5)]));
}

/** A box of words across the middle lifeline: a note, or a message between places that have no lifeline. */
function noteBox(text: string, middle: number): ReactNode {
  const width = Math.min(Math.max(text.length * CHAR_WIDTH + 24, 120), WIDTH - GUTTER - 8);
  const x = Math.min(Math.max(middle - width / 2, GUTTER + 4), WIDTH - 4 - width);
  return (
    <>
      <rect className="seq__note" x={x} y={-13} width={width} height={26} rx={3} />
      <text className="seq__note-text" x={x + width / 2} y={4} textAnchor="middle">
        {text}
      </text>
    </>
  );
}

/** A ✕ in the blocked colour, centred where the message stopped. */
function stopMark(x: number): ReactNode {
  return (
    <g className="seq__stop" data-stop="">
      <circle cx={x} cy={0} r={8} />
      <path d={`M${x - 3.5} -3.5l7 7m0 -7l-7 7`} />
    </g>
  );
}

/**
 * One message as an arrow from party to party, labelled with its tag above
 * the line and its decision below. A delivered message ends in an arrowhead
 * at the party it was sent to. A blocked one stops at that party with a ✕,
 * and a lost one stops halfway with a ✕; both say so in words, as the log does.
 */
function messageRow(row: LogRow, from: number, to: number): ReactNode {
  const dir = to > from ? 1 : -1;
  const missed = row.outcome === 'blocked' || row.outcome === 'dropped' ? row.outcome : null;
  const stop = missed === 'dropped' ? (from + to) / 2 : to;
  const end = missed === null ? to - dir * 6 : stop - dir * 10;
  const middle = (from + end) / 2;
  const decision = Object.hasOwn(row.cells, 'decision') ? row.cells.decision : missed === null ? undefined : OUTCOME_WORD[missed];
  return (
    <>
      <line className="seq__line" x1={from} y1={0} x2={end} y2={0} />
      {missed === null ? <path className="seq__arrow" data-head="" d={`M${end} 0l${-dir * 8} -5v10z`} /> : stopMark(stop)}
      <text className="seq__tag" x={middle} y={-8} textAnchor="middle">
        {row.tag}
      </text>
      {decision === undefined ? null : (
        <text className="seq__decision" x={middle} y={17} textAnchor="middle">
          {decision}
        </text>
      )}
    </>
  );
}

/**
 * The Sequence view: the same rows as the log, as arrows between the unit's
 * parties, from top to bottom (after `renderSeq` in the Firewalls mockup).
 * The names and addresses stay put in a header of their own while the rows
 * scroll under them at full size, keeping the latest row in view. The row
 * that has just played draws in once (not under reduced motion: the CSS only
 * animates it when the learner has not asked for less).
 *
 * The drawing is one image to assistive technology; the log under the scene
 * has the same rows as a real table.
 */
export function SequenceView({ parties, rows, current }: SequenceViewProps) {
  const xs = lifelineXs(parties);
  const middle = parties.length === 0 ? WIDTH / 2 : xs.get(parties[Math.floor(parties.length / 2)]!.place)!;
  const height = FIRST_ROW + Math.max(MIN_ROWS, rows.length) * ROW_H - 6;

  const body = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const box = body.current;
    if (box !== null) box.scrollTop = box.scrollHeight;
  }, [rows.length]);

  return (
    <div className="seq">
      <div className="seq__head">
        <svg viewBox={`0 0 ${WIDTH} ${HEAD_HEIGHT}`} aria-hidden="true" focusable="false">
          {parties.map((p) => {
            const x = xs.get(p.place)!;
            return (
              <g key={p.place}>
                <text className="seq__name" x={x} y={22} textAnchor="middle">
                  {p.label}
                </text>
                <text className="seq__addr" x={x} y={40} textAnchor="middle">
                  {p.addr}
                </text>
                <line className="seq__life" data-party={p.place} x1={x} y1={48} x2={x} y2={HEAD_HEIGHT} />
              </g>
            );
          })}
        </svg>
      </div>
      <div ref={body} className="seq__body" role="region" aria-label="Sequence view" tabIndex={0}>
        <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label="The messages so far, as a sequence">
          {parties.map((p) => (
            <line key={p.place} className="seq__life" x1={xs.get(p.place)} y1={0} x2={xs.get(p.place)} y2={height} />
          ))}
          {rows.map((row, i) => {
            const from = row.from === null ? undefined : xs.get(row.from);
            const to = row.to === null ? undefined : xs.get(row.to);
            const arrow = row.type === 'message' && from !== undefined && to !== undefined && from !== to;
            return (
              <g
                key={row.eventId}
                className="seq__row"
                transform={`translate(0 ${FIRST_ROW + i * ROW_H})`}
                data-row={row.eventId}
                data-kind={row.kind ?? 'note'}
                data-outcome={row.outcome ?? undefined}
                data-dir={arrow && to < from ? 'left' : undefined}
                data-current={row.eventId === current?.eventId ? '' : undefined}
              >
                <text className="seq__n" x={GUTTER / 2} y={4} textAnchor="middle">
                  {row.n}
                </text>
                {arrow ? messageRow(row, from, to) : noteBox(row.type === 'note' ? row.plain : (row.tag ?? row.plain), middle)}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
