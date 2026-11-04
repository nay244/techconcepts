import { z } from 'zod';
import { CERT_TAG_IDS } from './certs';

/**
 * Shape of a lesson. These schemas check types, enums and per-field bounds
 * only. Rules that compare one part of a lesson with another (step counts,
 * "this actor exists", packet sizes, the time budget) live in `define.ts`, so
 * they can all be reported together with readable messages.
 */

/** Prose or a label: must contain something other than whitespace. */
const text = z.string().regex(/\S/, 'must not be empty');
/** A whole number of bytes, packets and similar counts. */
const count = z.number().int().min(0);

/** Lowercase words joined by hyphens: safe in a URL and a file name. */
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase words joined by hyphens');

export const messageKindSchema = z.enum(['request', 'response', 'control', 'broadcast', 'encrypted']);
export const actorKindSchema = z.enum([
  'laptop',
  'phone',
  'switch',
  'router',
  'server',
  'dns-server',
  'firewall',
  'proxy',
  'load-balancer',
  'vpn-gateway',
  'access-point',
  'internet',
]);
export const certTagSchema = z.enum(CERT_TAG_IDS);

export const factSchema = z.strictObject({ label: text, value: text });

export const actorSchema = z.strictObject({
  id: text,
  kind: actorKindSchema,
  label: text,
  addresses: z.array(text),
  x: z.number().min(0).max(1000),
  y: z.number().min(0).max(600),
});

export const linkSchema = z.strictObject({
  id: text,
  from: text,
  to: text,
  medium: z.enum(['wired', 'wireless', 'tunnel']),
});

/** One table row: column key to cell text. Cells may be empty. */
export const rowSchema = z.record(z.string(), z.string());

export const tableDefSchema = z.strictObject({
  id: text,
  actor: text,
  title: text,
  columns: z.array(z.strictObject({ key: text, label: text })).min(1),
  keyColumn: text,
  initialRows: z.array(rowSchema),
});

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

export const messageEventSchema = z.strictObject({
  type: z.literal('message'),
  id: text,
  from: text,
  to: z.array(text).min(1),
  via: z.array(text).optional(),
  src: text,
  dst: text,
  protocol: text,
  kind: messageKindSchema,
  label: text,
  summary: text,
  size: count,
  time: z.number().min(0),
  /** Defaults to 'delivered' when absent. */
  outcome: z.enum(['delivered', 'dropped']).optional(),
  packet: z.string().optional(),
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
  summary: text,
});

export const sceneEventSchema = z.discriminatedUnion('type', [messageEventSchema, tableEventSchema]);

export const flowSceneSchema = z.strictObject({
  type: z.literal('flow'),
  views: z.array(z.enum(['network', 'sequence'])).min(1),
  actors: z.array(actorSchema).min(1),
  links: z.array(linkSchema),
  tables: z.array(tableDefSchema),
  packets: z.record(z.string(), packetSchema),
  legend: z.array(z.strictObject({ kind: z.union([messageKindSchema, z.literal('dropped')]), label: text })),
});

export const playgroundSceneSchema = z.strictObject({
  type: z.literal('playground'),
  playground: z.literal('subnet'),
});

export const playgroundPresetSchema = z.strictObject({
  address: z.string(),
  prefix: z.number().int(),
  compare: z.string().optional(),
});

export const stepSchema = z.strictObject({
  id: text,
  title: text,
  subtitle: text,
  narrative: text,
  facts: z.array(factSchema),
  events: z.array(sceneEventSchema),
  preset: playgroundPresetSchema.optional(),
});

export const tryItSchema = z.discriminatedUnion('mode', [
  z.strictObject({
    mode: z.literal('choices'),
    prompt: text,
    choices: z.array(z.strictObject({ id: text, label: text, events: z.array(sceneEventSchema), explanation: text })),
  }),
  z.strictObject({ mode: z.literal('free'), prompt: text, explanation: text }),
]);

export const questionSchema = z.strictObject({
  id: text,
  prompt: text,
  options: z.array(text),
  answer: z.number().int(),
  explanation: text,
});

export const lessonSchema = z.strictObject({
  slug: slugSchema,
  title: text,
  subtitle: text,
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  /** OSI layers the lesson touches, 1 (physical) to 7 (application). May be empty. */
  osiLayers: z.array(z.number().int().min(1).max(7)),
  certTags: z.array(certTagSchema),
  summary: text,
  references: z.array(z.strictObject({ label: text, url: z.url({ protocol: /^https$/ }) })),
  overview: z.strictObject({ hook: text, name: text, fullName: text, description: text, facts: z.array(factSchema) }),
  scene: z.discriminatedUnion('type', [flowSceneSchema, playgroundSceneSchema]),
  steps: z.array(stepSchema),
  tryIt: tryItSchema,
  check: z.array(questionSchema),
  recap: z.strictObject({ takeaways: z.array(text) }),
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
export type ActorKind = z.infer<typeof actorKindSchema>;
export type Fact = z.infer<typeof factSchema>;
export type Actor = z.infer<typeof actorSchema>;
export type Link = z.infer<typeof linkSchema>;
export type Row = z.infer<typeof rowSchema>;
export type TableDef = z.infer<typeof tableDefSchema>;
export type Field = z.infer<typeof fieldSchema>;
export type Layer = z.infer<typeof layerSchema>;
export type Packet = z.infer<typeof packetSchema>;
export type MessageEvent = z.infer<typeof messageEventSchema>;
export type TableEvent = z.infer<typeof tableEventSchema>;
export type SceneEvent = z.infer<typeof sceneEventSchema>;
export type FlowScene = z.infer<typeof flowSceneSchema>;
export type PlaygroundPreset = z.infer<typeof playgroundPresetSchema>;
export type PlaygroundScene = z.infer<typeof playgroundSceneSchema>;
export type Step = z.infer<typeof stepSchema>;
export type TryIt = z.infer<typeof tryItSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Part = z.infer<typeof partSchema>;
export type Track = z.infer<typeof trackSchema>;

/** What an author writes. Identical to `Lesson` today; named so a default or transform can be added later. */
export type LessonInput = z.input<typeof lessonSchema>;
