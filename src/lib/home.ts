// Home's words that are worked out from the lessons when the page is built (Task 17): the message-log sample on the
// big card, where a returning visitor is, and the track card's blurb. Nothing here runs in the browser.
import type { Lesson, MessageKind } from '../content/schema';
import { deriveState, positionOf, resumeLabel, slotsFor } from '../engine/timeline';

const two = (n: number): string => String(n).padStart(2, '0');

/** The first sentence: up to the first full stop that a space follows, or all of it when there is no such stop. */
export function firstSentence(text: string): string {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
}

/**
 * A device's label as it reads after the arrow, mid-sentence, as home-v6 writes it ("Router → laptop"): its first
 * letter in lower case, unless the first word is an acronym ("DNS resolver").
 */
export function midSentence(label: string): string {
  if (label === '' || /^[A-Z]{2}/.test(label)) return label;
  return label[0]!.toLowerCase() + label.slice(1);
}

export interface SampleRow {
  /** The row's number, two digits. */
  n: string;
  from: string;
  /** 'everyone' for a broadcast, whichever device answers it; otherwise the device, mid-sentence ('laptop'). */
  to: string;
  kind: MessageKind;
  /** The words on the message's tag; null when it has none, and then no tag is shown. */
  tag: string | null;
  plain: string;
  current: boolean;
}

export interface LogSample {
  rows: SampleRow[];
  /** The step the last row belongs to, counting from 1, and how many steps the unit has. */
  step: number;
  steps: number;
  /** The row after the sample, shown as "Later" with its step's plain sub-heading; null when there is none. */
  later: { n: string; sub: string } | null;
}

/**
 * The first `count` rows of a one-unit lesson's message log as it stands at Learn, when every step has played,
 * the last of them current. Every one must be a message, since each row shows who sent it to whom.
 */
export function logSample(lesson: Lesson, count = 4): LogSample {
  const unit = lesson.units[0]!;
  const log = deriveState(lesson, positionOf(lesson, 0, 'learn'), 0).log;
  if (log.length < count) {
    throw new RangeError(`Lesson "${lesson.slug}" has ${log.length} log rows; the sample needs ${count}.`);
  }
  const party = (place: string | null): string => unit.scene.parties.find((p) => p.place === place)?.label ?? String(place);
  const stepOf = (eventId: string): number => {
    const i = unit.steps.findIndex((s) => s.events.some((e) => e.id === eventId));
    if (i === -1) throw new Error(`Lesson "${lesson.slug}" has no step that plays event "${eventId}".`);
    return i + 1;
  };

  const rows = log.slice(0, count).map((row, i): SampleRow => {
    if (row.kind === null) {
      throw new RangeError(`Lesson "${lesson.slug}": log row ${row.n} is a note, and the sample shows messages only.`);
    }
    return {
      n: two(row.n),
      from: party(row.from),
      to: row.kind === 'broadcast' ? 'everyone' : midSentence(party(row.to)),
      kind: row.kind,
      tag: row.tag,
      plain: row.plain,
      current: i === count - 1,
    };
  });
  const after = log[count];
  return {
    rows,
    step: stepOf(log[count - 1]!.eventId),
    steps: unit.steps.length,
    later: after === undefined ? null : { n: two(after.n), sub: unit.steps[stepOf(after.eventId) - 1]!.sub },
  };
}

/**
 * Where each position of a lesson is, worded to sit in "You’re on … in <lesson>": a step keeps resumeLabel's words
 * ('step 3 of 5'), and the other parts are named ('the Overview', 'the Learn part', 'the Practice part'). In a lesson
 * of many units the unit's name says which: 'DNS step 2 of 5', 'the DNS Overview', 'the DNS Learn part'.
 */
export function resumePlaces(lesson: Lesson): string[] {
  const many = lesson.units.length > 1;
  return slotsFor(lesson).map((slot, p) => {
    const u = lesson.units[slot.unit]!;
    const unit = many ? `${u.name} ` : '';
    switch (slot.kind) {
      case 'overview':
        return `the ${unit}Overview`;
      case 'step':
        return many ? `${unit}step ${slot.step} of ${u.steps.length}` : resumeLabel(lesson, p);
      case 'learn':
        return `the ${unit}Learn part`;
      case 'practice':
        return `the ${unit}Practice part`;
    }
  });
}
