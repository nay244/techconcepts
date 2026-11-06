import type { Panel, SceneEvent, TableEvent } from '../../content/schema';
import { appliedEvents, type DerivedState } from '../../engine/timeline';
import { landedEvent, type PanelMark } from '../../scenes/driver';
import { BitsBoard } from './BitsBoard';
import { RulesPanel } from './RulesPanel';
import { TablePanel } from './TablePanel';

export interface UnitPanelProps {
  /** The unit's panel (`unit.scene.panel`), or null for none. */
  panel: Panel | null;
  derived: DerivedState;
  /** The rows the driver has read so far while the current event plays, in reading order. */
  marks: readonly PanelMark[];
  /** The event playing now, not yet applied, or null when none is. */
  playing?: SceneEvent | null;
}

/**
 * The latest event of the current step that touched `tableId`, among those
 * applied so far, or null. Keying a table's panel on its id remounts the panel
 * for each such event, so its row pulses again even when two events in a row
 * mark the same row.
 */
function lastTableEvent(derived: DerivedState, tableId: string): TableEvent | null {
  return appliedEvents(derived).findLast((e): e is TableEvent => e.type === 'table' && e.table === tableId) ?? null;
}

/**
 * What sits below the scene: a device's table, Subnetting's bits board, or a
 * firewall's rule list and the connections it remembers.
 *
 * The bits board shows the latest board a note has set, and while a note
 * plays, that note's board: the bits change as the figure starts the note, as
 * in the mockup, not once it has played. It is remounted for each step, so a
 * step's board starts out settled and only the changes within the step come in.
 *
 * The rule list shows the marks the driver reports while a visit plays. With
 * none reported, it shows the marks of the visit or reply that landed last,
 * which stay while the table events that visit brings land after it, and go
 * once the next visit or note starts to play. It is remounted for each event
 * that changes the rules; when a change replaces them while the step plays,
 * the new rows come in once.
 */
export function UnitPanel({ panel, derived, marks, playing = null }: UnitPanelProps) {
  if (panel?.type === 'rules') {
    const shown = playing?.type === 'message' || playing?.type === 'note' ? null : landedEvent(derived);
    const changed = lastTableEvent(derived, panel.rules.id);
    const moved = playing !== null && changed?.op === 'replace';
    return <RulesPanel key={`${panel.rules.id}:${changed?.id ?? 'none'}`} panel={panel} tables={derived.tables} marks={marks} active={shown} moved={moved} />;
  }
  if (panel?.type === 'bits') {
    const { slot } = derived;
    const board = playing?.type === 'note' && playing.board !== undefined ? playing.board : derived.board;
    return <BitsBoard key={`${slot.unit}:${slot.kind}:${slot.step}`} board={board} />;
  }
  if (panel?.type !== 'table') return null;
  const state = Object.hasOwn(derived.tables, panel.table.id) ? derived.tables[panel.table.id]! : null;
  if (state === null) return null;
  return <TablePanel key={`${panel.table.id}:${lastTableEvent(derived, panel.table.id)?.id ?? 'none'}`} def={panel.table} state={state} />;
}
