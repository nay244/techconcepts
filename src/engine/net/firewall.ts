import type { Row, SceneEvent } from '../../content/schema';
import { cidrContains } from './ipv4';

/**
 * A packet filter's rule list and the scene events that show it at work.
 * Rules are checked from the top, the first match decides, and a packet that
 * no rule matches is denied (the "implicit deny" every real firewall ends with).
 */

export interface FirewallRule {
  id: string;
  action: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'any';
  port: number | 'any';
  /** A CIDR such as `198.51.100.7/32`, or `'any'`. */
  source: string;
  note: string;
}

/** One connection attempt that arrives at the firewall. */
export interface Probe {
  /** Names the probe's events: `${id}-in`, `${id}-match` and `${id}-out`. Unique in the lesson, so choices prefix theirs. */
  id: string;
  label: string;
  /** Actor ids: where the probe starts, and where the firewall forwards it if it is allowed. */
  from: string;
  to: string;
  /** Actor ids the probe passes through on its way to the firewall. Not used for the forwarded leg. */
  via?: string[];
  sourceIp: string;
  destIp: string;
  protocol: 'tcp' | 'udp';
  port: number;
  time: number;
  size: number;
  summary: string;
  /** Id of a packet in the scene's `packets`; its size must equal `size`. */
  packet?: string;
}

/** The columns of a firewall's rule table. Its `keyColumn` is `'#'`, which is what `firewallScenario` matches on. */
export const FIREWALL_COLUMNS: { key: string; label: string }[] = [
  { key: '#', label: '#' },
  { key: 'action', label: 'Action' },
  { key: 'protocol', label: 'Protocol' },
  { key: 'port', label: 'Port' },
  { key: 'source', label: 'Source' },
  { key: 'note', label: "What it's for" },
];

type Verdict = 'allow' | 'deny';
type Candidate = Pick<Probe, 'sourceIp' | 'protocol' | 'port'>;

function ruleMatches(rule: FirewallRule, p: Candidate): boolean {
  if (rule.protocol !== 'any' && rule.protocol !== p.protocol) return false;
  if (rule.port !== 'any' && rule.port !== p.port) return false;
  return rule.source === 'any' || cidrContains(rule.source, p.sourceIp);
}

/** Throws if any rule's `source` is neither 'any' nor a valid CIDR, matched or not, so a typo fails the build. */
function assertSources(rules: FirewallRule[]): void {
  for (const rule of rules) {
    if (rule.source !== 'any') cidrContains(rule.source, '0.0.0.0');
  }
}

/** Which rule decides, by position: -1 when none does. */
function firstMatch(rules: FirewallRule[], p: Candidate): { index: number; rule: FirewallRule | null; action: Verdict } {
  const index = rules.findIndex((rule) => ruleMatches(rule, p));
  const rule = rules[index] ?? null;
  return { index, rule, action: rule?.action ?? 'deny' };
}

/**
 * The verdict for a packet: the first matching rule decides, and no match is a deny.
 * Throws if any rule's `source` is not `'any'` or a valid CIDR, even one that is never reached, so a
 * mistyped rule fails the build.
 */
export function evaluateRules(rules: FirewallRule[], p: Candidate): { ruleId: string | null; action: Verdict } {
  assertSources(rules);
  const { rule, action } = firstMatch(rules, p);
  return { ruleId: rule?.id ?? null, action };
}

/** Table rows for a rule list. Each row's `'#'` is its 1-based position, which is the order the firewall checks them in. */
export function ruleRows(rules: FirewallRule[]): Row[] {
  assertSources(rules);
  return rules.map((rule, i) => ({
    '#': String(i + 1),
    action: rule.action.toUpperCase(),
    protocol: rule.protocol.toUpperCase(),
    port: String(rule.port),
    source: rule.source,
    note: rule.note,
  }));
}

/**
 * The events for a set of probes meeting a firewall, in order. Each probe gives:
 *   - `${id}-in`: the probe reaches the firewall (dropped when the verdict is deny);
 *   - `${id}-match`: the firewall's rule table points at the rule that decided
 *     (an empty key, which highlights no row, when none did);
 *   - `${id}-out`: when allowed, the firewall forwards it to `probe.to`.
 * With `replaceRules`, the rule table is first rewritten to `rules` (event id `${table}-replace`).
 *
 * The table must use `FIREWALL_COLUMNS` and be keyed on `'#'`. Event ids come
 * from the probes' ids, so give each probe a unique id across the lesson's
 * steps, and a prefixed one inside a Try it choice.
 */
export function firewallScenario(o: {
  firewall: string;
  table: string;
  rules: FirewallRule[];
  probes: Probe[];
  replaceRules?: boolean;
}): SceneEvent[] {
  assertSources(o.rules);
  const events: SceneEvent[] = [];

  if (o.replaceRules === true) {
    events.push({
      type: 'table',
      id: `${o.table}-replace`,
      table: o.table,
      op: 'replace',
      rows: ruleRows(o.rules),
      summary: 'Rules updated',
    });
  }

  for (const p of o.probes) {
    const { index, action } = firstMatch(o.rules, p);
    const allowed = action === 'allow';
    const number = index + 1;
    const shared = {
      type: 'message',
      src: p.sourceIp,
      dst: `${p.destIp}:${p.port}`,
      protocol: p.protocol.toUpperCase(),
      kind: 'request',
      label: p.label,
      size: p.size,
      ...(p.packet === undefined ? {} : { packet: p.packet }),
    } as const;

    events.push({
      ...shared,
      id: `${p.id}-in`,
      from: p.from,
      to: [o.firewall],
      ...(p.via === undefined ? {} : { via: p.via }),
      summary: p.summary,
      time: p.time,
      outcome: allowed ? 'delivered' : 'dropped',
    });

    events.push({
      type: 'table',
      id: `${p.id}-match`,
      table: o.table,
      op: 'match',
      key: index < 0 ? '' : String(number),
      summary: index < 0 ? 'No rule matched → DENY' : `Rule ${number} → ${action.toUpperCase()}`,
    });

    if (allowed) {
      events.push({
        ...shared,
        id: `${p.id}-out`,
        from: o.firewall,
        to: [p.to],
        summary: `Rule ${number} allows it, so the firewall passes it on.`,
        time: p.time + 0.001,
        outcome: 'delivered',
      });
    }
  }

  return events;
}
