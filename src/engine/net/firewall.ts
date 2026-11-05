import type { Row } from '../../content/schema';
import { cidrContains } from './ipv4';

/**
 * A packet filter's rule list. Rules are checked from the top, the first match
 * decides, and a packet that no rule matches is denied (the "implicit deny"
 * every real firewall ends with).
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

type Verdict = 'allow' | 'deny';
/** What the rules look at in a connection attempt. */
type Candidate = { sourceIp: string; protocol: 'tcp' | 'udp'; port: number };

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

/**
 * The verdict for a packet: the first matching rule decides, and no match is a deny.
 * Throws if any rule's `source` is not `'any'` or a valid CIDR, even one that is never reached, so a
 * mistyped rule fails the build.
 */
export function evaluateRules(rules: FirewallRule[], p: Candidate): { ruleId: string | null; action: Verdict } {
  assertSources(rules);
  const rule = rules.find((r) => ruleMatches(r, p));
  return { ruleId: rule?.id ?? null, action: rule?.action ?? 'deny' };
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
