import type { TableDef } from '../../content/schema';
import type { TableState } from '../../engine/timeline';
import './table.css';

export interface DeviceTablePanelProps {
  table: TableDef;
  /** The device the table lives on, for example "Firewall". Shown in the caption. */
  actorLabel: string;
  state: TableState;
}

/**
 * What a screen reader hears after the first cell of the row an event is about.
 * Sighted learners get the same news from the row's accent and the event card.
 */
const HIGHLIGHT_TEXT = { added: '(new)', updated: '(changed)', matched: '(matched)' } as const;

/**
 * A device's table (leases, rules, a MAC table) as it stands at this moment of
 * the lesson. The row the latest event points at is marked, pulses once, and is
 * announced as new, changed or matched, so colour is never the only signal.
 */
export function DeviceTablePanel({ table, actorLabel, state }: DeviceTablePanelProps) {
  const { rows, highlight } = state;
  const caption = `${table.title} · ${actorLabel}`;
  // A match that found nothing carries an empty key. It points at no row, even one whose key cell is empty.
  const target = highlight !== null && !(highlight.type === 'matched' && highlight.key === '') ? highlight : null;

  return (
    // The wrapper scrolls sideways on a narrow screen, so a keyboard user must be able to focus it.
    <div className="device-table" data-table={table.id} role="region" aria-label={caption} tabIndex={0}>
      <table className="data">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="device-table__empty" colSpan={table.columns.length}>
                Empty
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const mark = target !== null && row[table.keyColumn] === target.key ? target.type : null;
              return (
                <tr key={row[table.keyColumn] ?? i} data-highlight={mark ?? undefined}>
                  {table.columns.map((column, c) => (
                    <td key={column.key}>
                      {row[column.key] ?? ''}
                      {mark !== null && c === 0 ? <span className="sr-only"> {HIGHLIGHT_TEXT[mark]}</span> : null}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DeviceTablePanel;
