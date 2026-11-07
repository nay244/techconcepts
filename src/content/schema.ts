import { z } from 'zod';
import type { FigureId } from '../art/scenes/types';
import { CERT_TAG_IDS } from './certs';
import { limitsSchema, overrideSchema } from './limits';
import { httpsUrl, slugSchema, text } from './primitives';
import { citationSchema } from './sources';

export { slugSchema };

/**
 * Shape of a lesson at runtime, the cited shape: Overview, Watch, Learn,
 * Practice. These schemas check types, enums and per-field bounds only. Rules
 * that compare one part of a lesson with another ("this place
 * exists on the figure", packet sizes; the numeric limits are a track's, in `limits.ts`) live in `define.ts`, so they can all be
 * reported together with readable messages.
 *
 * Learn's statements, every Go deeper paragraph, Practice's options and the
 * OSI layers cite primary sources (`sources.ts`). Watch and the scene cite
 * nothing of their own: each part carries a `backing` that traces it to cited
 * Learn statements, or flags it as an analogy or as example data. Citation
 * lists default to empty here; the cited lessons' rules require them. The four
 * ready lessons are still written in the older shape and lifted into this one
 * (`legacy.ts`).
 *
 * A lesson has one or more units. Most lessons have one; How the Internet
 * Works has one per protocol, each with its own Overview, Watch steps, Learn
 * and Practice.
 *
 * Prose fields mark key terms with `**term**`; nothing else is markup.
 */

/** A whole number of bytes, packets and similar counts. */
const count = z.number().int().min(0);

export const messageKindSchema = z.enum(['request', 'response', 'control', 'broadcast', 'encrypted']);
export const certTagSchema = z.enum(CERT_TAG_IDS);
/** The scene figures (`FigureId`); `parts.test.ts` keeps this list and `FIGURE_PARTS` the same. */
export const figureIdSchema = z.enum(['dhcp', 'subnet', 'firewall', 'net-map'] satisfies FigureId[]);

export const sourceSchema = z.strictObject({ label: text, url: httpsUrl });
export const factSchema = z.strictObject({ label: text, value: text });

// ---------------------------------------------------------------- citations and backing

/**
 * What stands behind a part of Watch or the scene, which cites nothing itself: the cited Learn statements or
 * Learn Go-deeper paragraphs (by id) it traces to, or a flag saying it is an analogy or example data.
 */
export const backingSchema = z.union([
  z.strictObject({ traces: z.array(slugSchema).min(1) }),
  z.strictObject({ analogy: z.literal(true) }),
  z.strictObject({ example: z.literal(true) }),
]);

/** A Learn statement: cited, or flagged as an analogy. Statements in a list read as one paragraph. */
export const statementSchema = z.strictObject({
  id: slugSchema,
  text,
  cite: z.array(citationSchema).default([]),
  analogy: z.literal(true).optional(),
});

/** A Go deeper paragraph: a Watch step's. */
export const paragraphSchema = z.strictObject({ text, cite: z.array(citationSchema).default([]) });

/** Learn's Go deeper paragraph, which Watch may trace to by id. */
export const learnParagraphSchema = paragraphSchema.extend({ id: slugSchema });

/** An Overview or Watch step fact: backed like the rest of Watch. */
export const tracedFactSchema = factSchema.extend({ backing: backingSchema.optional() });

/** A Learn fact: cited, and a trace target. */
export const learnFactSchema = factSchema.extend({ id: slugSchema, cite: z.array(citationSchema).default([]) });

/** One table or log row: column key to cell text. Cells may be empty. */
export const rowSchema = z.record(z.string(), z.string());

/** A change the scene shows besides the message itself, named by the figure (`FigureParts.cues`). */
export const cueSchema = z.strictObject({ cue: text, arg: z.string().optional() });

// ---------------------------------------------------------------- packets (DHCP keeps its packets)

export const fieldSchema = z.strictObject({
  name: text,
  value: z.string(),
  explain: z.string().optional(),
  example: z.boolean().optional(),
});

export const layerSchema = z.strictObject({
  name: text,
  size: count,
  summary: text,
  fields: z.array(fieldSchema),
  declaredLength: count.optional(),
});

export const packetSchema = z.strictObject({
  name: text,
  summary: text,
  seenAt: z.string().optional(),
  size: count,
  layers: z.array(layerSchema).min(1),
  backing: backingSchema.optional(),
});

// ---------------------------------------------------------------- events

/** Subnetting's "The address in bits" board: up to three 32-bit rows. */
export const boardSchema = z.strictObject({
  addr: text,
  who: text,
  /** Where the network part ends; null before a prefix is known. */
  prefix: z.number().int().min(0).max(32).nullable(),
  borrow: z.number().int().optional(),
  mask: z.boolean().optional(),
  pick: z.enum(['net', 'host', 'mask', 'line', 'borrow']).optional(),
  third: z.strictObject({ who: text, addr: text, mode: z.enum(['net', 'bcast', 'cmp']) }).optional(),
});

export const messageEventSchema = z.strictObject({
  type: z.literal('message'),
  id: text,
  /** Places on the figure (`FigureParts.places`). */
  from: text,
  to: text,
  /** The words on the moving tag. */
  tag: text,
  kind: messageKindSchema,
  /** Defaults to 'delivered'. 'dropped' is lost on the way; 'blocked' is stopped by a firewall. */
  outcome: z.enum(['delivered', 'dropped', 'blocked']).optional(),
  /** Required when dropped: how far along the way it is lost. */
  dropAt: z.number().min(0.1).max(0.9).optional(),
  /** The carrier shown on the tag, such as 'UDP'. */
  over: text.optional(),
  fast: z.boolean().optional(),
  /** A firewall reading its rules: how many it read, which one matched (null: none), and what it did. */
  check: z
    .strictObject({
      table: text,
      read: z.number().int().min(1),
      match: z.number().int().min(1).nullable(),
      action: z.enum(['allow', 'deny']),
    })
    .optional(),
  /** A reply let through because the firewall remembers the connection. */
  known: z.strictObject({ table: text, key: text }).optional(),
  /** An id in the unit's `scene.packets`. */
  packet: text.optional(),
  /** The log row's cells, by column key. `#` and `plain` are never written here. */
  log: rowSchema,
  /** The event in plain words: the log's `plain` column and the live region read it. */
  plain: text,
  cues: z.array(cueSchema).optional(),
  backing: backingSchema.optional(),
});

export const noteEventSchema = z.strictObject({
  type: z.literal('note'),
  id: text,
  log: rowSchema,
  plain: text,
  cues: z.array(cueSchema).optional(),
  board: boardSchema.optional(),
  /**
   * The log's glyph for the note, a message kind's, when the note stands for something the figure sends: Subnetting
   * draws what it works out as a request, a route as a response and a ring as a broadcast. The unit's legend must
   * explain it. Without it the note takes the legend's note entry.
   */
  glyph: messageKindSchema.optional(),
  backing: backingSchema.optional(),
});

export const tableEventSchema = z.strictObject({
  type: z.literal('table'),
  id: text,
  table: text,
  op: z.enum(['add', 'update', 'remove', 'match', 'clear', 'replace']),
  row: rowSchema.optional(),
  rows: z.array(rowSchema).optional(),
  /** May be '' for a `match` that found nothing. */
  key: z.string().optional(),
  /**
   * An `add` or `update` only: the row it leaves is marked. The mark is a miss,
   * something looked for and not there, such as a piece of data that never
   * arrived, unless the table names its own (`markLabel`). The row keeps the
   * mark until an event changes it again without one.
   */
  miss: z.boolean().optional(),
  /** What changed, in one plain sentence. The table only shows it, so screen readers hear this when the event plays. */
  summary: text,
  backing: backingSchema.optional(),
});

export const sceneEventSchema = z.discriminatedUnion('type', [messageEventSchema, noteEventSchema, tableEventSchema]);

// ---------------------------------------------------------------- scene

/**
 * A column of a panel table or the log. A `prose` column holds words: it is set
 * in the sans face, at normal weight, and wraps (a log column keyed `plain` is
 * prose unless it says otherwise). `width` is in CSS px; a column without one
 * takes the rest of the room.
 */
const columnSchema = z.strictObject({
  key: text,
  label: text,
  prose: z.boolean().optional(),
  width: z.number().positive().optional(),
});
const columnsSchema = z.array(columnSchema).min(1);

export const tableDefSchema = z.strictObject({
  id: text,
  title: text,
  /** Who keeps the table, such as 'kept by the router'. */
  by: text.optional(),
  columns: columnsSchema,
  keyColumn: text,
  /**
   * The key column is a field every row carries that no column shows, for a table whose shown columns cannot
   * tell its rows apart (UDP's voice packets, whose two ways both count from 1). Without it the key is a column.
   */
  hiddenKey: z.literal(true).optional(),
  /**
   * The word a marked row says (an event's `miss`), for a table whose marks are not misses: FTP's 'exposed', on
   * the password and the file anyone watching can read. Without it the word is 'miss'.
   */
  markLabel: text.optional(),
  initialRows: z.array(rowSchema),
  /** What the table says while it has no rows. */
  empty: text,
});

/** What sits below the scene: a device's table, a firewall's rules and the connections it remembers, or the bits board. */
export const panelSchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('table'), table: tableDefSchema }),
  z.strictObject({ type: z.literal('rules'), rules: tableDefSchema, conns: tableDefSchema }),
  z.strictObject({ type: z.literal('bits') }),
]);

/** The log under the scene. A column keyed `plain` shows each event's `plain` text; the console adds `#` itself. */
export const logDefSchema = z.strictObject({
  title: text,
  /**
   * What the log says while it is empty: at the Overview, and at a step with no `idle` of its own. Without it the
   * console says "Nothing has happened yet. Press Play to start."
   */
  idle: text.optional(),
  /**
   * A column marked `strong` holds the row's main words, set in the strongest ink: Subnetting's Worked out and
   * Value, as subnet-v1.html sets them. Only the log's columns may say so.
   */
  columns: z.array(columnSchema.extend({ strong: z.literal(true).optional() })).min(1),
  legend: z.array(
    z.strictObject({
      kind: z.union([messageKindSchema, z.enum(['blocked', 'dropped', 'change', 'note'])]),
      label: text,
    }),
  ),
});

/** A lifeline in the Sequence view. */
export const partySchema = z.strictObject({ place: text, label: text, addr: z.string() });

export const unitSceneSchema = z.strictObject({
  title: text,
  views: z.union([z.tuple([z.literal('network')]), z.tuple([z.literal('network'), z.literal('sequence')])]),
  /** Swappable layers the figure shows for this unit (`FigureParts.layers`). */
  layers: z.array(text).default(() => []),
  /** Words the figure shows on its parts, by part id. */
  labels: z.record(z.string(), z.string()).default(() => ({})),
  /**
   * Cues already in place as the unit starts, as though they had played before its first event, from the
   * Overview on: TLS's line, open before its handshake, and the letters waiting in POP3's and IMAP's mailbox.
   * Only a figure that shows one takes it (`FigureParts.start`), and it sets no status: each step sets its own.
   */
  start: z.array(cueSchema).default(() => []),
  panel: panelSchema.nullable(),
  log: logDefSchema,
  parties: z.array(partySchema),
  packets: z.record(z.string(), packetSchema).optional(),
  backing: backingSchema.optional(),
});

// ---------------------------------------------------------------- lesson

export const stepSchema = z.strictObject({
  id: text,
  /** A Title Case technical term, such as 'DHCP Discover'. */
  title: text,
  /** The same step in plain words. */
  sub: text,
  narrative: text,
  /** Go deeper: exam-level detail, closed by default. Each paragraph cites directly. */
  deep: z.array(paragraphSchema).min(1),
  facts: z.array(tracedFactSchema),
  events: z.array(sceneEventSchema),
  status: text.optional(),
  /** What the log says while it is empty at this step. */
  idle: text.optional(),
  backing: backingSchema.optional(),
});

/** Everyday idea first, then its name. */
export const termSchema = z.strictObject({
  id: slugSchema,
  idea: text,
  name: text,
  cite: z.array(citationSchema).default([]),
  analogy: z.literal(true).optional(),
});

/** The steps by their technical names, and a note on the pattern. */
export const patternSchema = z.strictObject({
  id: slugSchema,
  names: z.array(text),
  note: text,
  cite: z.array(citationSchema).default([]),
});

export const learnSchema = z.strictObject({
  lead: z.array(statementSchema).min(1),
  terms: z.array(termSchema),
  pattern: patternSchema,
  why: z.array(statementSchema).min(1),
  deep: z.array(learnParagraphSchema).min(1),
  facts: z.array(learnFactSchema),
});

export const questionSchema = z.strictObject({
  id: text,
  prompt: text,
  /** Each option's feedback explains the answer, so it cites. */
  options: z.array(z.strictObject({ text, feedback: text, cite: z.array(citationSchema).default([]) })),
  /** Index of the right option, from 0. */
  answer: z.number().int(),
});

/** OSI layers the unit touches, 1 (physical) to 7 (application), cited; or 'spans' when no source puts it at one. */
export const osiSchema = z.union([
  z.strictObject({ layers: z.array(z.int().min(1).max(7)).min(1), cite: z.array(citationSchema).default([]) }),
  z.literal('spans'),
]);

export const unitSchema = z.strictObject({
  id: slugSchema,
  name: text,
  fullName: text,
  /** One line on what the unit is for (lesson 1's protocol rows). */
  purpose: text,
  /** Lesson 1's outline filters. */
  group: z.enum(['core', 'app', 'security']).optional(),
  osi: osiSchema,
  /** The unit's sources, listed under Learn's Go deeper. */
  references: z.array(sourceSchema).default([]),
  scene: unitSceneSchema,
  overview: z.strictObject({
    hook: text,
    hookBacking: backingSchema.optional(),
    description: text,
    backing: backingSchema.optional(),
    facts: z.array(tracedFactSchema),
  }),
  steps: z.array(stepSchema),
  learn: learnSchema,
  practice: z.array(questionSchema),
  /** Backs the unit's full name and purpose. */
  backing: backingSchema.optional(),
});

export const lessonSchema = z.strictObject({
  slug: slugSchema,
  title: text,
  subtitle: text,
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  certTags: z.array(certTagSchema),
  summary: text,
  figure: figureIdSchema,
  units: z.array(unitSchema).min(1),
  /** Where this lesson leaves its track's limits, each with its reason (`limits.ts`). */
  overrides: z.array(overrideSchema).default([]),
  /** Backs the subtitle and the summary. */
  backing: backingSchema.optional(),
});

// ---------------------------------------------------------------- tracks

const lessonRef = z.strictObject({ slug: slugSchema, title: text });

/** One objective of the pinned exam document that a certification track's lesson teaches. */
const objectiveSchema = z.strictObject({
  /** One of the track's exam codes. */
  exam: text,
  /** The objective's number in the document, such as `2.6`. */
  objective: z.string().regex(/^\d+\.\d+$/, 'must be a number like 2.6'),
  /** Where the objectives document lists it: section equal to `objective`. */
  cite: citationSchema,
});

const certLessonRef = lessonRef.extend({ objectives: z.array(objectiveSchema).min(1) });

const base = { id: slugSchema, title: text, description: text, level: lessonSchema.shape.level, limits: limitsSchema };

/** Taught in order, in parts; exam data is the lessons' cert tags only. */
export const conceptTrackSchema = z.strictObject({
  ...base,
  type: z.literal('concept'),
  parts: z.array(z.strictObject({ id: slugSchema, title: text, lessons: z.array(lessonRef).min(1) })).min(1),
});

/** Ordered by exam domain; every lesson maps to objectives of one pinned version of the official document. */
export const certificationTrackSchema = z.strictObject({
  ...base,
  type: z.literal('certification'),
  exam: z.strictObject({
    title: text,
    codes: z.array(text).min(1),
    /** The objectives edition this track maps to; it must be the registry's version of `source`. */
    version: text,
    /** The id of the objectives document in the source registry. */
    source: slugSchema,
  }),
  parts: z.array(z.strictObject({ id: slugSchema, title: text, lessons: z.array(certLessonRef).min(1) })).min(1),
});

export const trackSchema = z.discriminatedUnion('type', [conceptTrackSchema, certificationTrackSchema]);

export type MessageKind = z.infer<typeof messageKindSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Fact = z.infer<typeof factSchema>;
export type Backing = z.infer<typeof backingSchema>;
export type Statement = z.infer<typeof statementSchema>;
export type Paragraph = z.infer<typeof paragraphSchema>;
export type LearnParagraph = z.infer<typeof learnParagraphSchema>;
export type TracedFact = z.infer<typeof tracedFactSchema>;
export type LearnFact = z.infer<typeof learnFactSchema>;
export type Term = z.infer<typeof termSchema>;
export type Pattern = z.infer<typeof patternSchema>;
export type Osi = z.infer<typeof osiSchema>;
export type Row = z.infer<typeof rowSchema>;
export type Cue = z.infer<typeof cueSchema>;
export type Field = z.infer<typeof fieldSchema>;
export type Layer = z.infer<typeof layerSchema>;
export type Packet = z.infer<typeof packetSchema>;
export type Board = z.infer<typeof boardSchema>;
export type MessageEvent = z.infer<typeof messageEventSchema>;
export type NoteEvent = z.infer<typeof noteEventSchema>;
export type TableEvent = z.infer<typeof tableEventSchema>;
export type SceneEvent = z.infer<typeof sceneEventSchema>;
export type TableDef = z.infer<typeof tableDefSchema>;
export type Panel = z.infer<typeof panelSchema>;
export type LogDef = z.infer<typeof logDefSchema>;
export type Party = z.infer<typeof partySchema>;
export type UnitScene = z.infer<typeof unitSceneSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Learn = z.infer<typeof learnSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Unit = z.infer<typeof unitSchema>;
/** A lesson as the site uses it: written in the cited shape, or lifted from the legacy one (`legacy.ts`). */
export type Lesson = z.output<typeof lessonSchema> & { origin: 'cited' | 'legacy' };
export type ConceptTrack = z.infer<typeof conceptTrackSchema>;
export type CertificationTrack = z.infer<typeof certificationTrackSchema>;
export type Objective = z.infer<typeof objectiveSchema>;
export type Track = z.infer<typeof trackSchema>;
