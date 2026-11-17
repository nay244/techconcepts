import type { CSSProperties } from 'react';
import type { Unit } from '../content/schema';
import { type Position, positionOf, type Slot } from '../engine/timeline';
import { placeLabel } from './placeLabel';

export interface TimelineProps {
  /** The lesson's units, and the one the position is in: the timeline shows that unit's places. */
  units: readonly Unit[];
  /** The unit the reader is in, counting from 0 (`slot.unit`). */
  unitIndex: number;
  /** Where each of the unit's places is in the lesson (`positionOf`). */
  positions: { overview: Position; steps: Position[]; learn: Position; practice: Position };
  position: Position;
  slot: Slot;
  onGo(position: Position): void;
  /** During Play all's hold: the place it leads to, and how long the hold lasts. Null under reduced motion, or when nothing holds. */
  hold: { next: Position; ms: number } | null;
}

interface Place {
  target: Position;
  /** The place's name, whole: "Overview", a step's title, "Learn", "Practice". */
  name: string;
  /** A step's number; the other places show a dot. */
  number?: number;
}

/** Where a unit's places are, in the order the timeline lists them. */
export function placesOf(unit: Unit, positions: TimelineProps['positions']): Place[] {
  return [
    { target: positions.overview, name: 'Overview' },
    ...unit.steps.map((step, i) => ({ target: positions.steps[i]!, name: step.title, number: i + 1 })),
    { target: positions.learn, name: 'Learn' },
    { target: positions.practice, name: 'Practice' },
  ];
}

/** `positionOf` for each of a unit's places. */
export function positionsOf(lesson: Parameters<typeof positionOf>[0], unitIndex: number, steps: number): TimelineProps['positions'] {
  return {
    overview: positionOf(lesson, unitIndex, 'overview'),
    steps: Array.from({ length: steps }, (_, i) => positionOf(lesson, unitIndex, 'step', i + 1)),
    learn: positionOf(lesson, unitIndex, 'learn'),
    practice: positionOf(lesson, unitIndex, 'practice'),
  };
}

/** A stop's accessible name: "Step 4, DHCP Acknowledge", with ", done" once passed. */
function stopName(place: Place, done: boolean): string {
  const base = place.number === undefined ? place.name : `Step ${place.number}, ${place.name}`;
  return done ? `${base}, done` : base;
}

/**
 * Every place of the lesson, in order, on one line: a numbered mark on a rule, the place's name under it, the count at
 * the end. A mark is a button that goes to that place. Past places show a tick, the current one is orange and carries
 * `aria-current="step"`, the rest are ahead. The rule is solid up to the current mark and dashed after; during Play all's
 * hold it fills from the current mark to the next (`data-fill`, `data-fill-next`, over `--hold`). How much shows
 * (names and the count, names, or marks) is the line's own width, in CSS.
 *
 * Without JavaScript the interactive list is hidden and a plain list of the places' names stands in its place.
 */
export function Timeline({ units, unitIndex, positions, position, slot, onGo, hold }: TimelineProps) {
  const unit = units[unitIndex]!;
  const places = placesOf(unit, positions);
  const hereName = slot.kind === 'step' ? unit.steps[slot.step - 1]!.title : null;
  return (
    <div className="timeline" style={hold === null ? undefined : ({ '--hold': `${hold.ms}ms` } as CSSProperties)}>
      <nav className="timeline__nav" aria-label="This lesson">
        <ol className="tl">
          {places.map((place) => {
            const state = place.target < position ? 'done' : place.target === position ? 'current' : undefined;
            return (
              <li
                key={place.target}
                data-state={state}
                data-fill={hold !== null && place.target === position ? '' : undefined}
                data-fill-next={hold !== null && place.target === hold.next ? '' : undefined}
              >
                <button
                  type="button"
                  className="tl__stop"
                  aria-label={stopName(place, state === 'done')}
                  aria-current={state === 'current' ? 'step' : undefined}
                  title={place.name}
                  onClick={() => onGo(place.target)}
                >
                  <span className="tl__mark" data-dot={place.number === undefined ? '' : undefined} aria-hidden="true">
                    {state === 'done' ? '✓' : place.number}
                  </span>
                  <span className="tl__name" aria-hidden="true">
                    {place.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="tl__end" data-plain={hereName === null ? '' : undefined}>
          <span className="tl__count">{placeLabel(unit, slot)}</span>
          <span className="tl__now" aria-hidden="true">
            {hereName}
          </span>
        </p>
      </nav>
      <noscript>
        <div className="timeline__plain">
          <h2 className="console__ptitle">In this lesson</h2>
          <ol>
            {places.map((place) => (
              <li key={place.target}>{place.name}</li>
            ))}
          </ol>
        </div>
      </noscript>
    </div>
  );
}

export default Timeline;
