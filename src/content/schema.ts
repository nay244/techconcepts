import { z } from 'zod';
import type { FigureId } from '../art/scenes/types';
import { CERT_TAG_IDS } from './certs';

/**
 * Shape of a lesson: Overview, Watch, Learn, Practice. These schemas check
 * types, enums and per-field bounds only. Rules that compare one part of a
 * lesson with another (step counts, "this place exists on the figure", packet
 * sizes, the time budget) live in `define.ts`, so they can all be reported
 * together with readable messages.
 *
 * A lesson has one or more units. Most lessons have one; How the Internet
 * Works has one per protocol, each with its own Overview, Watch steps, Learn
 * and Practice.
 *
 * Prose fields mark key terms with `**term**`; nothing else is markup.
 */

/** Prose or a label: must contain something other than whitespace. */
const text = z.string().regex(/\S/, 'must not be empty');
/** A whole number of bytes, packets and similar counts. */
const count = z.number().int().min(0);

/** Lowercase words joined by hyphens: safe in a URL and a file name. */
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase words joined by hyphens');

export const messageKindSchema = z.enum(['request', 'response', 'control', 'broadcast', 'encrypted']);
export const certTagSchema = z.enum(CERT_TAG_IDS);
/** The scene figures (`FigureId`); `parts.test.ts` keeps this list and `FIGURE_PARTS` the same. */
export const figureIdSchema = z.enum(['dhcp', 'subnet', 'firewall', 'net-map'] satisfies FigureId[]);

export const sourceSchema = z.strictObject({ label: text, url: z.url({ protocol: /^https$/ }) });
export const factSchema = z.strictObject({ label: text, value: text });

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
});

export const noteEventSchema = z.strictObject({
  type: z.literal('note'),
  id: text,
  log: rowSchema,
  plain: text,
  cues: z.array(cueSchema).optional(),
  board: boardSchema.optional(),
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
  summary: text,
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
  columns: columnsSchema,
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
});

// ---------------------------------------------------------------- lesson

export const stepSchema = z.strictObject({
  id: text,
  /** A Title Case technical term, such as 'DHCP Discover'. */
  title: text,
  /** The same step in plain words. */
  sub: text,
  narrative: text,
  /** Go deeper: exam-level detail, closed by default. */
  deep: text,
  facts: z.array(factSchema),
  events: z.array(sceneEventSchema),
  status: text.optional(),
  /** What the log says while it is empty at this step. */
  idle: text.optional(),
});

export const learnSchema = z.strictObject({
  lead: text,
  /** Everyday idea first, then its name. */
  terms: z.array(z.strictObject({ idea: text, name: text })),
  /** The steps by their technical names, and a note on the pattern. */
  pattern: z.strictObject({ names: z.array(text), note: text }),
  why: text,
  deep: text,
  facts: z.array(factSchema),
});

export const questionSchema = z.strictObject({
  id: text,
  prompt: text,
  options: z.array(z.strictObject({ text, feedback: text })),
  /** Index of the right option, from 0. */
  answer: z.number().int(),
});

export const unitSchema = z.strictObject({
  id: slugSchema,
  name: text,
  fullName: text,
  /** One line on what the unit is for (lesson 1's protocol rows). */
  purpose: text,
  /** Lesson 1's outline filters. */
  group: z.enum(['core', 'app', 'security']).optional(),
  /** OSI layers the unit touches, 1 (physical) to 7 (application). May be empty. */
  osiLayers: z.array(z.number().int().min(1).max(7)),
  references: z.array(sourceSchema),
  scene: unitSceneSchema,
  overview: z.strictObject({ hook: text, description: text, facts: z.array(factSchema) }),
  steps: z.array(stepSchema),
  learn: learnSchema,
  practice: z.array(questionSchema),
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
});

export const partSchema = z.strictObject({
  id: slugSchema,
  title: text,
  lessons: z.array(z.strictObject({ slug: slugSchema, title: text })).min(1),
});

export const trackSchema = z.strictObject({
  id: slugSchema,
  title: text,
  description: text,
  level: lessonSchema.shape.level,
  parts: z.array(partSchema).min(1),
});

export type MessageKind = z.infer<typeof messageKindSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Fact = z.infer<typeof factSchema>;
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
export type Lesson = z.infer<typeof lessonSchema>;
export type Part = z.infer<typeof partSchema>;
export type Track = z.infer<typeof trackSchema>;

/** What an author writes: like `Lesson`, but a scene's `layers` and `labels` may be left out. */
export type LessonInput = z.input<typeof lessonSchema>;
