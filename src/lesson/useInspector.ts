import { useCallback, useEffect, useRef, useState, type Dispatch, type RefCallback, type RefObject } from 'react';
import type { Lesson } from '../content/schema';
import type { PlaybackAction } from '../engine/playback';
import type { LogRow } from '../engine/timeline';

/** The packet open in the inspector: the log row it was opened from, at the position it was opened. */
export interface Inspecting {
  n: number;
  packetId: string;
  position: number;
}

/** Where focus goes when the inspector shows a packet: the inspector itself, or the button just pressed. */
export type InspectorFocus = 'inspector' | 'Previous packet' | 'Next packet';

export interface InspectorOptions {
  lesson: Lesson;
  position: number;
  /** The log at this position. A packet opened from the scene opens at the latest row that carries it. */
  log: LogRow[];
  dispatch: Dispatch<PlaybackAction>;
  /** Where focus goes when the inspector closes while holding focus and the control that opened it has gone. */
  fallbackFocus: RefObject<HTMLElement | null>;
}

export interface InspectorControls {
  /** The packet on show, or null while the scene is. */
  open: Inspecting | null;
  /** For the element that holds the inspector. */
  boxRef: RefCallback<HTMLElement>;
  openPacket(packetId: string, n: number): void;
  openPacketFromScene(packetId: string): void;
  close(): void;
  /** Shows another log row's packet; `focus` names the button that asked for it. */
  showRow(row: LogRow, focus: InspectorFocus): void;
}

/**
 * The packet inspector's state and its focus handling.
 *
 * Opening it pauses playback and moves focus into it. Moving to another
 * position closes it. Whenever it closes while holding focus, focus goes back
 * to the control that first opened it, or to `fallbackFocus` when that control
 * has left the page, so it never drops to the page itself. Opening another
 * packet while one is on show keeps the first opener.
 */
export function useInspector({ lesson, position, log, dispatch, fallbackFocus }: InspectorOptions): InspectorControls {
  const [inspecting, setInspecting] = useState<Inspecting | null>(null);
  // Moving to another position closes the inspector: the scene is what the new position is about.
  if (inspecting !== null && inspecting.position !== position) setInspecting(null);
  const open = inspecting !== null && inspecting.position === position ? inspecting : null;
  const isOpen = open !== null;

  const box = useRef<HTMLElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const focusOnShow = useRef<InspectorFocus>('inspector');
  /** Whether focus was inside the inspector when it left the page. */
  const heldFocus = useRef(false);

  const boxRef = useCallback((node: HTMLElement | null) => {
    box.current = node;
    if (node === null) return;
    // React calls this cleanup while the inspector is still on the page, so focus can still be seen inside it.
    return () => {
      heldFocus.current = node.contains(document.activeElement);
      box.current = null;
    };
  }, []);

  const openPacket = useCallback(
    (packetId: string, n: number) => {
      if (lesson.scene.type !== 'flow' || !Object.hasOwn(lesson.scene.packets, packetId)) return;
      if (!isOpen) {
        const active = document.activeElement;
        opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
      }
      focusOnShow.current = 'inspector';
      // The scene is out of sight while the inspector is open, so it waits.
      dispatch({ type: 'pause' });
      setInspecting({ n, packetId, position });
    },
    [lesson, dispatch, position, isOpen],
  );

  const openPacketFromScene = useCallback(
    (packetId: string) => {
      const row = log.findLast((r) => r.packet === packetId);
      if (row !== undefined) openPacket(packetId, row.n);
    },
    [log, openPacket],
  );

  const close = useCallback(() => setInspecting(null), []);

  const showRow = useCallback(
    (row: LogRow, focus: InspectorFocus) => {
      if (row.packet === undefined) return;
      focusOnShow.current = focus;
      setInspecting({ n: row.n, packetId: row.packet, position });
    },
    [position],
  );

  const openRow = open?.n ?? null;
  // Focus follows the inspector: into it when it opens, onto the pressed button's replacement when it moves.
  useEffect(() => {
    const node = box.current;
    if (openRow === null || node === null) return;
    const buttons = Array.from(node.querySelectorAll<HTMLButtonElement>('.inspector__actions button'));
    const named = (name: string) => buttons.find((button) => button.textContent === name);
    const wanted = focusOnShow.current;
    const other = wanted === 'Next packet' ? 'Previous packet' : 'Next packet';
    const button = wanted === 'inspector' ? undefined : (named(wanted) ?? named(other));
    if (button !== undefined) {
      button.focus();
      return;
    }
    // The Inspector owns no focus handling, so its section is made focusable here and takes focus itself.
    const section = node.querySelector<HTMLElement>('.inspector');
    if (section === null) return;
    section.tabIndex = -1;
    section.focus();
  }, [openRow]);

  // On close, focus that was inside the inspector goes back to its opener, or to the fallback.
  useEffect(() => {
    if (isOpen) return;
    const target = opener.current;
    const held = heldFocus.current;
    opener.current = null;
    heldFocus.current = false;
    if (!held) return;
    if (target?.isConnected) target.focus();
    else fallbackFocus.current?.focus();
  }, [isOpen, fallbackFocus]);

  return { open, boxRef, openPacket, openPacketFromScene, close, showRow };
}
