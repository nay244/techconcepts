import { useEffect, useRef } from 'react';
import type { Actor, FlowScene } from '../../content/schema';
import type { DerivedState, LogRow } from '../../engine/timeline';
import { formatTime } from '../../lib/format';
import DeviceIcon from './DeviceIcon';
import './flow.css';

export interface SequenceViewProps {
  scene: FlowScene;
  state: DerivedState;
  onOpenPacket(packetId: string): void;
}

/** Room for one lifeline column, so many actors scroll sideways instead of squeezing the labels. */
const LIFELINE_MIN_WIDTH_REM = 6;

interface Ends {
  from: number;
  to: number;
}

/**
 * Which lifelines a log row joins. A row names its endpoints by address, so
 * each is found as the actor that owns that address. An address no actor owns
 * (a broadcast, or a host outside the picture) is read as "the rest of the
 * diagram": the arrow runs to the end farther from the other lifeline.
 */
function endsOf(actors: Actor[], row: LogRow): Ends {
  const last = actors.length - 1;
  const owner = (address: string) => actors.findIndex((actor) => actor.addresses.includes(address));
  const farEnd = (i: number) => (i <= last - i ? last : 0);

  const from = owner(row.src);
  const to = owner(row.dst);
  if (from < 0 && to < 0) return { from: 0, to: last };
  return { from: from < 0 ? farEnd(to) : from, to: to < 0 ? farEnd(from) : to };
}

/**
 * The grid line of lifeline `i` in a row's grid. Each lifeline has two grid
 * columns, so its centre is the line between them, and an arrow spanning two
 * such lines runs from one lifeline to the other.
 */
const lineOf = (i: number): number => 2 * i + 2;

function gridColumn({ from, to }: Ends): string {
  if (from === to) return `${lineOf(from)} / ${lineOf(from) + 1}`;
  return `${lineOf(Math.min(from, to))} / ${lineOf(Math.max(from, to))}`;
}

const directionOf = ({ from, to }: Ends): 'right' | 'left' | 'self' => (from === to ? 'self' : from < to ? 'right' : 'left');

function Arrow({ row, ends, actors, onOpenPacket }: { row: LogRow; ends: Ends; actors: Actor[]; onOpenPacket(packetId: string): void }) {
  const dropped = row.outcome === 'dropped';
  const props = {
    className: 'flow-arrow',
    'data-arrow': '',
    'data-kind': row.kind,
    'data-outcome': row.outcome,
    'data-from': actors[ends.from]?.id,
    'data-to': actors[ends.to]?.id,
    'data-direction': directionOf(ends),
    style: { gridColumn: gridColumn(ends) },
  };
  const packet = row.packet;
  const route = `from ${actors[ends.from]?.label ?? row.src} to ${actors[ends.to]?.label ?? row.dst}`;
  const body = (
    <>
      <span className="flow-arrow__text">
        <span className="flow-arrow__label">{row.label}</span>
        <span className="flow-arrow__time">{formatTime(row.time)}</span>
        {dropped && <span className="flow-flag">Dropped</span>}
        <span className="sr-only">
          {route}
          {packet === undefined ? '' : ': open packet details'}
        </span>
      </span>
      <span className="flow-arrow__line" aria-hidden="true" />
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
                  <Arrow row={row} ends={endsOf(actors, row)} actors={actors} onOpenPacket={onOpenPacket} />
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
