import { type RefObject, useLayoutEffect } from 'react';

/**
 * The panel whose region had the focus when a remount took it away, by its
 * table's id. The scene host remounts a panel for each event that changes its
 * table (TablePanel for each table event, so its row pulses again; RulesPanel
 * for each change to the rule list, so its rows come in), and a focused element
 * that is removed leaves the focus on <body>. The new panel for the same table
 * takes the focus back as it mounts, in the same commit; after that moment the
 * memory is cleared, so a panel that comes back later never takes the focus
 * from wherever the learner has moved it.
 */
let focusLostBy: string | null = null;

/** Keeps the focus on a panel's region across the remounts the scene host makes, for the table `id`. */
export function useFocusAcrossRemounts(region: RefObject<HTMLElement | null>, id: string): void {
  useLayoutEffect(() => {
    const element = region.current;
    if (focusLostBy === id) {
      focusLostBy = null;
      const active = document.activeElement;
      if (active === null || active === document.body) element?.focus({ preventScroll: true });
    }
    return () => {
      // Runs before the element leaves the page, while it can still have the focus.
      if (element === null || document.activeElement !== element) return;
      focusLostBy = id;
      queueMicrotask(() => {
        if (focusLostBy === id) focusLostBy = null;
      });
    };
  }, [region, id]);
}
