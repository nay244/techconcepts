import type { FlowScene, MessageKind } from '../content/schema';
import type { DerivedState } from '../engine/timeline';
import { formatBytes } from '../lib/format';

export interface EventCard {
  label: string;
  kind: MessageKind;
  dropped: boolean;
  /** "Laptop → Router", or "Laptop → everyone (broadcast)" when the message has more than one target. */
  route: string;
  summary: string;
  /** "Message 2 of 6 · DNS · 74 B" */
  meta: string;
}

/** What each kind is called when the lesson's own legend has no word for it. */
const DEFAULT_KIND_LABELS: Record<MessageKind, string> = {
  request: 'Request',
  response: 'Response',
  control: 'Control',
  broadcast: 'Broadcast',
  encrypted: 'Encrypted',
};

/** A kind in words: the lesson legend's label for it, else a plain-English default. */
export function kindLabel(kind: MessageKind, legend: FlowScene['legend']): string {
  return legend.find((entry) => entry.kind === kind)?.label ?? DEFAULT_KIND_LABELS[kind];
}

/**
 * The card for the message that has just played: what it was, where it went, a
 * line about it, and where it sits in the lesson. Null when no message of the
 * current position has played, such as on the Overview or before a step starts.
 */
export function eventCard(state: DerivedState, actorLabel: (id: string) => string): EventCard | null {
  const message = state.activeMessage;
  if (message === null) return null;
  // The active message is always the last one logged for it; a missing row would mean the state is inconsistent.
  const row = state.log.find((r) => r.eventId === message.id);
  if (row === undefined) return null;

  const from = actorLabel(message.from);
  // The schema guarantees at least one target, so the fallback is never seen.
  const route = message.to.length > 1 ? `${from} → everyone (broadcast)` : `${from} → ${actorLabel(message.to[0] ?? '')}`;

  return {
    label: message.label,
    kind: message.kind,
    dropped: message.outcome === 'dropped',
    route,
    summary: message.summary,
    meta: `Message ${row.n} of ${state.messageTotal} · ${row.protocol} · ${formatBytes(row.size)}`,
  };
}
