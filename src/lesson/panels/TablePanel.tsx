import { useRef } from 'react';
import type { TableDef } from '../../content/schema';
import type { TableState } from '../../engine/tables';
import { useFocusAcrossRemounts } from './useFocusAcrossRemounts';
import './table.css';

export interface TablePanelProps {
  def: TableDef;
  state: TableState;
}

/**
 * What a screen reader hears after the first cell of the row an event is about.
 * Sighted learners get the same news from the row's mark and its pulse.
 */
const HIGHLIGHT_TEXT = { added: '(new)', updated: '(changed)', matched: '(matched)' } as const;

/**
 * A device's table (leases, a cache, a MAC table) as it stands at this moment
 * of the lesson, under the scene. The row the latest event of the current step
 * points at is marked, pulses once, and is announced as new, changed or
 * matched, so colour is never the only signal. A marked row says the table's
 * mark word ("miss" unless the table names its own, such as FTP's "exposed") in
 * a small neutral tag after its first cell, for as long as the mark lasts. The
 * panel is a labelled region a keyboard user can focus and scroll.
 */
export function TablePanel({ def, state }: TablePanelProps) {
  const { rows, highlight } = state;
  const missed = new Set(state.missed);
  const candidates = new Set(state.candidates);
  const matches = new Set(state.matches);
  // Whose table it is: the latest replace says, else the table's own.
  const by = state.by ?? def.by;
  const markLabel = def.markLabel ?? 'miss';
  const region = useRef<HTMLDivElement>(null);
  // A match that found nothing carries an empty key. It points at no row, even one whose key cell is empty.
  const target = highlight !== null && !(highlight.type === 'matched' && highlight.key === '') ? highlight : null;
  useFocusAcrossRemounts(region, def.id);

  return (
    <div ref={region} className="tpanel" data-table={def.id} role="region" aria-label={state.by === undefined ? def.title : `${def.title}, ${state.by}`} tabIndex={0}>
      <table className="tpanel__table">
        <caption>
          <span className="tpanel__title">{def.title}</span>
          {by === undefined ? null : <span className="tpanel__by"> {by}</span>}
        </caption>
        <thead>
          <tr>
            {def.columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="tpanel__empty" colSpan={def.columns.length}>
                {def.empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const mark = target !== null && row[def.keyColumn] === target.key ? target.type : null;
              const key = row[def.keyColumn];
              const miss = key !== undefined && missed.has(key);
              // Several rows match: all are candidates until one wins, and the rest keep a tag once it does.
              const candidate = key !== undefined && candidates.has(key);
              const matched = key !== undefined && matches.has(key) && mark === null;
              return (
                <tr key={key ?? i} data-highlight={mark ?? undefined} data-miss={miss ? '' : undefined} data-candidate={candidate ? '' : undefined}>
                  {def.columns.map((column, c) => (
                    <td key={column.key} className={column.prose === true ? 'tpanel__prose' : undefined} data-label={column.label}>
                      {row[column.key] ?? ''}
                      {miss && c === 0 ? (
                        <>
                          {' '}
                          <span className="tpanel__miss">{markLabel}</span>
                        </>
                      ) : null}
                      {matched && c === 0 ? (
                        <>
                          {' '}
                          <span className="tpanel__miss">match</span>
                        </>
                      ) : null}
                      {mark !== null && c === 0 ? <span className="sr-only"> {HIGHLIGHT_TEXT[mark]}</span> : null}
                      {candidate && c === 0 ? <span className="sr-only"> (a match)</span> : null}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
          {state.noMatch === undefined ? null : (
            <tr className="tpanel__nomatch">
              <td colSpan={def.columns.length}>
                <span className="tpanel__miss">no match</span>
                <span className="sr-only">: </span>
                {state.noMatch}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
