import { useEffect, useRef } from 'react';
import type { Actor, FlowScene } from '../../content/schema';
import type { DerivedState, LogRow } from '../../engine/timeline';
import { formatTime } from '../../lib/format';
import DeviceIcon from './DeviceIcon';
import { arrowSpan, type ArrowSpan } from './geometry';
import './flow.css';

export interface SequenceViewProps {
  scene: FlowScene;
  state: DerivedState;
  onOpenPacket(packetId: string): void;
}

/** Room for one lifeline column, so many actors scroll sideways instead of squeezing the labels. */
const LIFELINE_MIN_WIDTH_REM = 6;

/**
 * The grid line of lifeline `i` in a row's grid. Each lifeline has two grid
 * columns, so its centre is the line between them, and an arrow spanning two
 * such lines runs from one lifeline to the other.
 */
const lineOf = (i: number): number => 2 * i + 2;

function gridColumn({ lo, hi, direction }: ArrowSpan): string {
  return direction === 'self' ? `${lineOf(lo)} / ${lineOf(lo) + 1}` : `${lineOf(lo)} / ${lineOf(hi)}`;
}

/** "A", "A and B", "A, B and C". */
function listOf(names: string[]): string {
  return names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

interface ArrowProps {
  row: LogRow;
  actors: Actor[];
  onOpenPacket(packetId: string): void;
}

function Arrow({ row, actors, onOpenPacket }: ArrowProps) {
  const span = arrowSpan(actors, row);
  const dropped = row.outcome === 'dropped';
  const nameOf = (id: string) => actors.find((actor) => actor.id === id)?.label ?? id;
  const props = {
    className: 'flow-arrow',
    'data-arrow': '',
    'data-kind': row.kind,
    'data-outcome': row.outcome,
    'data-from': row.from,
    'data-to': row.to.join(' '),
    'data-direction': span.direction,
    style: { gridColumn: gridColumn(span) },
  };
  const packet = row.packet;
  const body = (
    <>
      <span className="flow-arrow__text">
        <span className="flow-arrow__label">{row.label}</span>
        <span className="flow-arrow__time">{formatTime(row.time)}</span>
        {dropped && <span className="flow-flag">Dropped</span>}
        <span className="sr-only">
          {`from ${nameOf(row.from)} to ${listOf(row.to.map(nameOf))}`}
          {packet === undefined ? '' : ': open packet details'}
        </span>
      </span>
      <span className="flow-arrow__line" aria-hidden="true">
        {span.stops.map((i) => (
          <span key={i} className="flow-arrow__stop" style={{ left: `${((i - span.lo) / (span.hi - span.lo)) * 100}%` }} />
        ))}
      </span>
    </>
  );

  return packet === undefined ? (
    <div {...props}>{body}</div>
  ) : (
    <button {...props} type="button" onClick={() => onOpenPacket(packet)}>
      {body}
    </button>
  );
}

/**
 * The messages so far as a sequence diagram: one lifeline per actor, in the
 * scene's order, and one arrow per log row, top to bottom in the order they
 * were sent. Built from HTML rather than drawn in one SVG so the text stays
 * readable at any width and an arrow with a packet can be a real button.
 *
 * An arrow runs from the sender's lifeline to the farthest of the row's
 * targets, with a dot on each nearer target it reaches. Lifelines are found by
 * actor id, which the log row carries, never by address.
 */
export function SequenceView({ scene, state, onOpenPacket }: SequenceViewProps) {
  const { actors } = scene;
  const scroller = useRef<HTMLDivElement>(null);

  // Keep the newest arrow in view as the lesson plays.
  useEffect(() => {
    const el = scroller.current;
    if (el !== null) el.scrollTop = el.scrollHeight;
  }, [state.log.length]);

  return (
    <div className="flow-seq" ref={scroller} role="region" aria-label="Sequence diagram" tabIndex={0}>
      <div className="flow-seq__inner" style={{ minWidth: `${actors.length * LIFELINE_MIN_WIDTH_REM}rem` }}>
        <div className="flow-seq__head" style={{ gridTemplateColumns: `repeat(${actors.length}, minmax(0, 1fr))` }}>
          {actors.map((actor) => (
            <div key={actor.id} className="flow-seq__actor" data-lifeline={actor.id}>
              <DeviceIcon kind={actor.kind} />
              <span className="flow-seq__name">{actor.label}</span>
              {actor.addresses[0] !== undefined && <span className="flow-seq__address">{actor.addresses[0]}</span>}
            </div>
          ))}
        </div>
        <div className="flow-seq__body">
          <div className="flow-seq__lines" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${actors.length}, minmax(0, 1fr))` }}>
            {actors.map((actor) => (
              <span key={actor.id} />
            ))}
          </div>
          {state.log.length === 0 ? (
            <p className="flow-seq__empty">Messages appear here as the lesson plays.</p>
          ) : (
            <ol className="flow-seq__rows" role="list">
              {state.log.map((row) => (
                <li key={row.n} className="flow-seq__row" style={{ gridTemplateColumns: `repeat(${actors.length * 2}, minmax(0, 1fr))` }}>
                  <Arrow row={row} actors={actors} onOpenPacket={onOpenPacket} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

export default SequenceView;
