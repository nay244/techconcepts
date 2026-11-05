import { useEffect, useRef } from 'react';
import { shouldIgnoreShortcut } from './keyboard';

/** What the lesson's keys do. The console wires them to its playback. */
export interface LessonShortcuts {
  toggle(): void;
  next(): void;
  prev(): void;
}

/**
 * The lesson's keys, listened for on the window: Space plays or pauses, → and
 * ← move between positions (spec §10.3).
 *
 * Space and the arrows are left alone with a modifier held, on form controls,
 * buttons and links, and in a focusable scroll region that the key would
 * scroll. The outline drawer is a modal dialog with keys of its own, so nothing
 * here fires inside it. The latest `actions` are always the ones called, and
 * the listener is added once.
 */
export function useLessonShortcuts(actions: LessonShortcuts): void {
  const latest = useRef(actions);
  useEffect(() => {
    latest.current = actions;
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest('dialog') !== null) return;
      if (shouldIgnoreShortcut(event.target, event.key)) return;
      switch (event.key) {
        case ' ':
          event.preventDefault();
          // Holding Space down would otherwise flicker between play and pause.
          if (!event.repeat) latest.current.toggle();
          break;
        case 'ArrowRight':
          latest.current.next();
          break;
        case 'ArrowLeft':
          latest.current.prev();
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
