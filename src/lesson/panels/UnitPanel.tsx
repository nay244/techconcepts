import type { Panel, SceneEvent } from '../../content/schema';
import type { DerivedState } from '../../engine/timeline';
import type { PanelMark } from '../../scenes/driver';
import { BitsBoard } from './BitsBoard';
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
 * The id of the latest event of the current step that touched `tableId`, among
 * those applied so far. Keying a table's panel on it remounts the panel for
 * each such event, so its row pulses again even when two events in a row mark
 * the same row.
 */
function lastTableEvent(derived: DerivedState, tableId: string): string {
  const played = derived.active === null ? 0 : derived.events.indexOf(derived.active) + 1;
  for (let i = played - 1; i >= 0; i -= 1) {
    const event = derived.events[i]!;
    if (event.type === 'table' && event.table === tableId) return event.id;
  }
  return 'none';
}

/**
 * What sits below the scene: a device's table, or Subnetting's bits board.
 * Task 16 adds the rule list, which reads `marks`.
 *
 * The bits board shows the latest board a note has set, and while a note
 * plays, that note's board: the bits change as the figure starts the note, as
 * in the mockup, not once it has played. It is remounted for each step, so a
 * step's board starts out settled and only the changes within the step come in.
 */
export function UnitPanel({ panel, derived, playing = null }: UnitPanelProps) {
  if (panel?.type === 'bits') {
    const { slot } = derived;
    const board = playing?.type === 'note' && playing.board !== undefined ? playing.board : derived.board;
    return <BitsBoard key={`${slot.unit}:${slot.kind}:${slot.step}`} board={board} />;
  }
  if (panel?.type !== 'table') return null;
  const state = Object.hasOwn(derived.tables, panel.table.id) ? derived.tables[panel.table.id]! : null;
  if (state === null) return null;
  return <TablePanel key={`${panel.table.id}:${lastTableEvent(derived, panel.table.id)}`} def={panel.table} state={state} />;
}
