import { useLayoutEffect, useRef } from 'react';
import type { TableDef } from '../../content/schema';
import type { TableState } from '../../engine/tables';
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
 * The table whose panel had the focus when a remount took the panel away. The
 * scene host remounts a table's panel for each table event, so its row pulses
 * again, and a focused element that is removed leaves the focus on <body>. The
 * new panel for the same table takes the focus back as it mounts, in the same
 * commit; after that moment the memory is cleared, so a panel that comes back
 * later never takes the focus from wherever the learner has moved it.
 */
let focusLostBy: string | null = null;

/**
 * A device's table (leases, a cache, a MAC table) as it stands at this moment
 * of the lesson, under the scene. The row the latest event of the current step
 * points at is marked, pulses once, and is announced as new, changed or
 * matched, so colour is never the only signal. The panel is a labelled region
 * a keyboard user can focus and scroll.
 */
export function TablePanel({ def, state }: TablePanelProps) {
  const { rows, highlight } = state;
  const region = useRef<HTMLDivElement>(null);
  // A match that found nothing carries an empty key. It points at no row, even one whose key cell is empty.
  const target = highlight !== null && !(highlight.type === 'matched' && highlight.key === '') ? highlight : null;

  useLayoutEffect(() => {
    const element = region.current;
    if (focusLostBy === def.id) {
      focusLostBy = null;
      const active = document.activeElement;
      if (active === null || active === document.body) element?.focus({ preventScroll: true });
    }
    return () => {
      // Runs before the element leaves the page, while it can still have the focus.
      if (element === null || document.activeElement !== element) return;
      focusLostBy = def.id;
      queueMicrotask(() => {
        if (focusLostBy === def.id) focusLostBy = null;
      });
    };
  }, [def.id]);

  return (
    <div ref={region} className="tpanel" data-table={def.id} role="region" aria-label={def.title} tabIndex={0}>
      <table className="tpanel__table">
        <caption>
          <span className="tpanel__title">{def.title}</span>
          {def.by === undefined ? null : <span className="tpanel__by"> {def.by}</span>}
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
              return (
                <tr key={row[def.keyColumn] ?? i} data-highlight={mark ?? undefined}>
                  {def.columns.map((column, c) => (
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
