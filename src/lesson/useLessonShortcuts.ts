import { useEffect, type Dispatch } from 'react';
import type { PlaybackAction } from '../engine/playback';
import { shouldIgnoreShortcut } from './keyboard';

export interface LessonShortcutsOptions {
  dispatch: Dispatch<PlaybackAction>;
  /** False in a playground scene, which has nothing to play: Space is then left to the page. */
  canPlay: boolean;
  inspectorOpen: boolean;
  closeInspector(): void;
}

/**
 * The lesson's keys, listened for on the window: Space plays or pauses, → and
 * ← move between positions, Esc closes the inspector (spec §10.3, ruling R27).
 *
 * Space and the arrows are left alone with a modifier held, on form controls,
 * buttons and links, and in a focusable scroll region that the key would
 * scroll. Esc closes the inspector wherever focus is, its own buttons included.
 * The outline drawer is a modal dialog with keys of its own, so nothing here
 * fires inside it.
 */
export function useLessonShortcuts({ dispatch, canPlay, inspectorOpen, closeInspector }: LessonShortcutsOptions): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest('dialog') !== null) return;
      if (event.key === 'Escape') {
        if (inspectorOpen) closeInspector();
        return;
      }
      if (shouldIgnoreShortcut(event.target, event.key)) return;
      switch (event.key) {
        case ' ':
          // In a playground Space does nothing of the lesson's; the page keeps it (it scrolls a phone's page).
          if (!canPlay) return;
          event.preventDefault();
          // Holding Space down would otherwise flicker between play and pause.
          if (!event.repeat) dispatch({ type: 'toggle' });
          break;
        case 'ArrowRight':
          dispatch({ type: 'next' });
          break;
        case 'ArrowLeft':
          dispatch({ type: 'prev' });
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, canPlay, inspectorOpen, closeInspector]);
}
