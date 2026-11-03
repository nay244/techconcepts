import { useId } from 'react';
import type { FlowScene } from '../content/schema';
import type { DerivedState } from '../engine/timeline';
import { formatBytes, formatTime } from '../lib/format';
import { kindLabel } from './eventCard';
import './lesson.css';

export interface EventLogProps {
  state: DerivedState;
  /** True when the scene has device tables, so each message can say how it changed one. */
  showTableColumn: boolean;
  legend: FlowScene['legend'];
  /** Opens the packet in the inspector. `n` is the message's number in the log. */
  onOpenPacket(packetId: string, n: number): void;
}

const COLUMNS = ['#', 'Time', 'Source', 'Destination', 'Protocol', 'Kind', 'Summary', 'Size'] as const;

/**
 * Every message so far, as a real table. The Kind column says the kind in words
 * (the lesson legend's own label) beside a dot in that kind's colour, a dropped
 * message says "Dropped" in its summary, and the legend above explains the
 * dots. The scroll area is focusable so a keyboard user can scroll it.
 */
export function EventLog({ state, showTableColumn, legend, onOpenPacket }: EventLogProps) {
  const id = useId();
  const columns = showTableColumn ? [...COLUMNS, 'Table change'] : COLUMNS;

  return (
    <div className="event-log">
      {legend.length > 0 ? (
        <ul className="event-log__legend" role="list" aria-label="Legend">
          {legend.map((entry) => (
            <li key={entry.kind}>
              <span className="kind-dot" data-kind={entry.kind} aria-hidden="true" />
              {entry.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="event-log__scroll" role="region" aria-label="Event log" tabIndex={0}>
        <table className="data">
          <caption className="sr-only">Event log</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.log.length === 0 ? (
              <tr>
                <td className="event-log__empty" colSpan={columns.length}>
                  Nothing has happened yet. Press Play to start.
                </td>
              </tr>
            ) : (
              state.log.map((row) => {
                const dropped = row.outcome === 'dropped';
                const packet = row.packet;
                const summaryId = `${id}-summary-${row.n}`;
                return (
                  <tr key={row.n} data-outcome={row.outcome}>
                    <td>{row.n}</td>
                    <td>{formatTime(row.time)}</td>
                    <td>{row.src}</td>
                    <td>{row.dst}</td>
                    <td>{row.protocol}</td>
                    <td className="event-log__prose">
                      <span className="kind-tag">
                        <span className="kind-dot" data-kind={row.kind} aria-hidden="true" />
                        {kindLabel(row.kind, legend)}
                      </span>
                    </td>
                    <td className="event-log__prose">
                      <div className="event-log__summary">
                        {dropped ? <span className="dropped-flag">Dropped</span> : null}
                        <span id={summaryId}>{row.summary}</span>
                        {packet === undefined ? null : (
                          <button
                            type="button"
                            className="event-log__button"
                            aria-describedby={summaryId}
                            onClick={() => onOpenPacket(packet, row.n)}
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                    <td>{formatBytes(row.size)}</td>
                    {showTableColumn ? <td className="event-log__prose">{row.tableChange ?? ''}</td> : null}
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

export default EventLog;
