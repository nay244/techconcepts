import { useId, useRef, useState } from 'react';
import type { Panel, Row, SceneEvent } from '../../content/schema';
import type { TableState } from '../../engine/tables';
import { marksOf, type PanelMark } from '../../scenes/driver';
import { useFocusAcrossRemounts } from './useFocusAcrossRemounts';
import './rules.css';

type MarkState = PanelMark['state'];

export interface RulesPanelProps {
  panel: Extract<Panel, { type: 'rules' }>;
  /** Every table as it stands at this moment of the lesson: the rule list and the connections are two of them. */
  tables: Record<string, TableState>;
  /** The rows the driver has read so far while a visit plays, in reading order. */
  marks: readonly PanelMark[];
  /** The visit or reply that has landed, whose marks the rows show once no play is reporting any; null for none. */
  active: SceneEvent | null;
  /**
   * The rows came in with this mount, after a change replaced them while the step played, so they animate in. It is
   * read once, as the panel mounts: a later render never brings the rows in again.
   */
  moved?: boolean;
}

/** What the Check column says for each mark, in the mockup's words. */
const CHECK_TEXT: Record<MarkState, string> = { check: 'Checking', miss: 'Doesn’t fit', allow: 'Fits → allow', deny: 'Fits → deny' };
/** The Check column's width, the mockup's. */
const CHECK_WIDTH = 118;
const KNOWN_TEXT = 'Known: reply allowed';

/**
 * Each rule's mark: the latest the driver has reported for it while a visit
 * plays, or, with no play reporting, the ones the landed visit's check leaves
 * (`marksOf`). The rules below the one that fits are never read.
 */
function rowStates(count: number, marks: readonly PanelMark[], active: SceneEvent | null, tableId: string): (MarkState | null)[] {
  const states: (MarkState | null)[] = Array.from({ length: count }, () => null);
  const check = active?.type === 'message' && active.check?.table === tableId ? active.check : undefined;
  const shown = marks.length > 0 ? marks : check === undefined ? [] : marksOf(check);
  for (const { row, state } of shown) if (row < count) states[row] = state;
  return states;
}

/**
 * The firewall's rule list under the scene, as the approved mockup's rules
 * panel (firewalls-v1.html): the rules with the lesson's own columns and a
 * Check column, read from the top, then the connections the firewall
 * remembers, as chips.
 *
 * While a visit plays, each rule shows the mark the driver reports as it reads
 * it: the rule being read is current (its row marked in marigold, "Checking",
 * and aria-current), a rule that does not fit is muted ("Doesn’t fit"), and
 * the one that fits says what it does ("Fits → allow" or "Fits → deny", its row
 * marked in the allowed green or the blocked red). Once the visit has landed,
 * the same marks are worked out from its check. The column keyed `action` keeps
 * the action's colour in a square beside its word. The words stay in ink, so
 * colour is never the only signal.
 *
 * Each connection remembered is a chip: who, the port, the rule that let it in,
 * and the full addresses in its title and for a screen reader. The newest one
 * pulses as it comes in; the one a landed reply belongs to pulses too, turns
 * green and says the reply was let through.
 */
export function RulesPanel({ panel, tables, marks, active, moved = false }: RulesPanelProps) {
  const { rules: def, conns: connsDef } = panel;
  const [movedIn] = useState(moved);
  const region = useRef<HTMLDivElement>(null);
  const connsTitle = useId();
  useFocusAcrossRemounts(region, def.id);

  const rows: Row[] = tables[def.id]?.rows ?? [];
  const conns = tables[connsDef.id];
  const states = rowStates(rows.length, marks, active, def.id);
  const known = active?.type === 'message' && active.known?.table === connsDef.id ? active.known.key : null;
  const added = conns?.highlight?.type === 'added' ? conns.highlight.key : null;

  return (
    <div ref={region} className="rpanel" data-panel="rules" role="region" aria-label={def.title} tabIndex={0}>
      <table className="rpanel__table">
        <caption>
          <span className="rpanel__title">{def.title}</span>
          {def.by === undefined ? null : <span className="rpanel__by"> {def.by}</span>}
        </caption>
        <colgroup>
          {def.columns.map((column) => (
            <col key={column.key} style={column.width === undefined ? undefined : { width: column.width }} />
          ))}
          <col style={{ width: CHECK_WIDTH }} />
        </colgroup>
        <thead>
          <tr>
            {def.columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
            <th scope="col">Check</th>
          </tr>
        </thead>
        <tbody data-moved={movedIn ? '' : undefined}>
          {rows.length === 0 ? (
            <tr>
              <td className="rpanel__empty" colSpan={def.columns.length + 1}>
                {def.empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const state = states[i] ?? null;
              return (
                <tr key={row[def.keyColumn] ?? i} data-state={state ?? undefined} aria-current={state === 'check' ? 'true' : undefined}>
                  {def.columns.map((column) => (
                    <td key={column.key} className={column.prose === true ? 'rpanel__prose' : undefined}>
                      {column.key === 'action' ? (
                        <span className="rpanel__act" data-action={row.action?.toLowerCase()}>
                          {row.action ?? ''}
                        </span>
                      ) : (
                        (row[column.key] ?? '')
                      )}
                    </td>
                  ))}
                  <td>{state === null ? null : <span className="rpanel__check">{CHECK_TEXT[state]}</span>}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="rpanel__conns">
        <span className="rpanel__title" id={connsTitle}>
          {connsDef.title}
        </span>
        {conns === undefined || conns.rows.length === 0 ? (
          <span className="rpanel__none">{connsDef.empty}</span>
        ) : (
          <ul className="rpanel__chips" aria-labelledby={connsTitle}>
            {conns.rows.map((row, i) => {
              const key = row[connsDef.keyColumn];
              return (
                <li
                  key={key ?? i}
                  className="rpanel__chip"
                  title={`${row.from ?? ''} → ${row.to ?? ''}`}
                  data-new={key !== undefined && key === added ? '' : undefined}
                  data-known={key !== undefined && key === known ? '' : undefined}
                >
                  {`${row.who ?? ''} → port ${row.port ?? ''}`}
                  <span className="rpanel__rule">{` rule ${row.rule ?? ''}`}</span>
                  <span className="sr-only">{`, from ${row.from ?? ''} to ${row.to ?? ''}`}</span>
                  {key !== undefined && key === known ? <span className="rpanel__known">{` ${KNOWN_TEXT}`}</span> : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
