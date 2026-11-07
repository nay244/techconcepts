import type { Unit } from '../content/schema';
import type { Slot } from '../engine/timeline';

/**
 * Where the learner is in a unit, as the console says it: 'Step 2 of 5',
 * 'Overview', 'Learn' or 'Practice'. Never the step's title, which can be long.
 * (`timeline.resumeLabel` words it for a sentence instead: 'step 2 of 5'.)
 */
export function placeLabel(unit: Unit, slot: Slot): string {
  switch (slot.kind) {
    case 'step':
      return `Step ${slot.step} of ${unit.steps.length}`;
    case 'overview':
      return 'Overview';
    case 'learn':
      return 'Learn';
    case 'practice':
      return 'Practice';
  }
}
