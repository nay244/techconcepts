import { evaluateRules, ruleRows, type FirewallRule } from '../../engine/net/firewall';
import { applyTableEvent, type TableState } from '../../engine/tables';
import type { Lesson, MessageEvent, NoteEvent, Row, SceneEvent, TableEvent, Unit } from '../schema';

/**
 * The Firewalls lesson's visits, reply and rule change, as scene events. Every
 * decision is the engine's (`evaluateRules`): a visit is read against the rules
 * in force from the top, and the first rule that fits decides. `checkResults`
 * works each one out again from what the lesson shows, and the lesson's module
 * calls it, so a decision that changes stops the build (spec §7.4).
 *
 * The addresses are documentation ones (RFC 5737) for the internet, and a
 * private one (RFC 1918) for the web server, as in the approved mockup
 * (firewalls-v1.html).
 */

export const ADDR = { visitor: '203.0.113.50', admin: '198.51.100.7', web: '10.0.0.10' } as const;

/** Who sends a visit: a place on the figure, with the address it comes from. */
type Who = 'visitor' | 'admin';
const WHO_NAME: Record<Who, string> = { visitor: 'Visitor', admin: 'Admin' };

/** The firewall's three rules, by name. What each is for is the panel's For column. */
export const RULES: Record<'https' | 'ssh' | 'rest', FirewallRule> = {
  https: { id: 'https', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: 'Website (HTTPS)' },
  ssh: { id: 'ssh', action: 'allow', protocol: 'tcp', port: 22, source: `${ADDR.admin}/32`, note: 'Admin login (SSH)' },
  rest: { id: 'rest', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: 'Block everything else' },
};

/** The orders the list is in: as the lesson starts, and after step 6 moves the catch-all to the top. */
export const RULESETS = { base: ['https', 'ssh', 'rest'], shadow: ['rest', 'https', 'ssh'] } as const;
export type RuleSet = keyof typeof RULESETS;

/** Each rule as the figure's board writes it, after its number: the mockup's words, spaced as it spaces them. */
const BOARD: Record<keyof typeof RULES, string> = { https: 'ALLOW 443  ANY', ssh: 'ALLOW 22   ADMIN', rest: 'DENY  ALL' };

/** The panel's tables: the rule list, keyed by place, and the connections the firewall remembers, keyed by who and port. */
const RULES_TABLE = 'rules';
const CONNS_TABLE = 'conns';

const rulesOf = (set: RuleSet): FirewallRule[] => RULESETS[set].map((id) => RULES[id]);
const isRuleSet = (name: string): name is RuleSet => Object.hasOwn(RULESETS, name);

/**
 * The rule list's rows for an order, from the engine's own rows: its place, its
 * action, its protocol and port together ("TCP 443", or "Any"), its source
 * ("Any" or one address), what it is for, and the words the figure's board
 * shows for it, which no column shows.
 */
export function ruleTableRows(set: RuleSet): Row[] {
  const rules = rulesOf(set);
  return ruleRows(rules).map((row, i) => {
    const rule = rules[i]!;
    const port = rule.port === 'any' ? (rule.protocol === 'any' ? 'Any' : row.protocol!) : rule.protocol === 'any' ? row.port! : `${row.protocol} ${row.port}`;
    return {
      '#': row['#']!,
      action: row.action!,
      port,
      source: rule.source === 'any' ? 'Any' : row.source!,
      note: row.note!,
      board: BOARD[RULESETS[set][i]!],
    };
  });
}

/** What the engine decides for a visit: the rule that fits first (its place, from 1; null when none does), how many it read, and the action. */
interface Decision {
  n: number | null;
  read: number;
  action: 'allow' | 'deny';
}

function decide(set: RuleSet, sourceIp: string, protocol: 'tcp' | 'udp', port: number): Decision {
  const { ruleId, action } = evaluateRules(rulesOf(set), { sourceIp, protocol, port });
  const n = ruleId === null ? null : RULESETS[set].indexOf(ruleId as never) + 1;
  return { n, read: n ?? RULESETS[set].length, action };
}

/** The log's Decision words for a visit. */
const decisionText = ({ action, n }: Decision): string => `${action === 'allow' ? 'Allowed' : 'Denied'} · ${n === null ? 'no rule fits' : `rule ${n}`}`;
const KNOWN_DECISION = 'Allowed · known connection';

/** The visits made so far, by id, so a reply can name the one it answers. */
const VISITS = new Map<string, { who: Who; port: number; svc: string; sport: number; key: string; allowed: boolean }>();

/**
 * A visit to the web server: one message from a laptop, checked against the
 * rules in force. Allowed, it goes on to the web server and the firewall
 * remembers its connection (a table event keyed `${who}:${port}`); denied, it
 * stops at the firewall, blocked. Its check says how many rules were read
 * and which one decided, as the engine works it out.
 */
export function visit(o: { id: string; who: Who; tag: string; port: number; svc: string; sport: number; rules: RuleSet; plain: string }): SceneEvent[] {
  const decision = decide(o.rules, ADDR[o.who], 'tcp', o.port);
  const allowed = decision.action === 'allow';
  const from = `${ADDR[o.who]}:${o.sport}`;
  const to = `${ADDR.web}:${o.port}`;
  const key = `${o.who}:${o.port}`;
  VISITS.set(o.id, { who: o.who, port: o.port, svc: o.svc, sport: o.sport, key, allowed });
  const message: MessageEvent = {
    type: 'message',
    id: o.id,
    from: o.who,
    to: allowed ? 'web' : 'firewall',
    tag: o.tag,
    kind: 'request',
    ...(allowed ? {} : { outcome: 'blocked' as const }),
    check: { table: RULES_TABLE, read: decision.read, match: decision.n, action: decision.action },
    log: { source: from, destination: to, service: `TCP ${o.port} · ${o.svc}`, decision: decisionText(decision) },
    plain: o.plain,
  };
  if (!allowed) return [message];
  const remembered: TableEvent = {
    type: 'table',
    id: `${o.id}-conn`,
    table: CONNS_TABLE,
    op: 'add',
    row: { key, who: WHO_NAME[o.who], port: String(o.port), rule: String(decision.n), from, to },
    summary: `The firewall remembers the ${WHO_NAME[o.who].toLowerCase()}’s connection to port ${o.port}, let in by rule ${decision.n}.`,
  };
  return [message, remembered];
}

/**
 * The web server's reply to an allowed visit (`of`, its id): back to the
 * laptop that asked, let through because the firewall remembers the
 * connection, with no rule of its own. Throws for a visit that was denied, or
 * that this module has not made.
 */
export function reply(o: { id: string; of: string; tag: string; plain: string }): SceneEvent[] {
  const v = VISITS.get(o.of);
  if (v === undefined) throw new Error(`The reply "${o.id}" answers "${o.of}", which is not a visit.`);
  if (!v.allowed) throw new Error(`The reply "${o.id}" answers "${o.of}", which was denied: there is no connection to answer.`);
  return [
    {
      type: 'message',
      id: o.id,
      from: 'web',
      to: v.who,
      tag: o.tag,
      kind: 'response',
      known: { table: CONNS_TABLE, key: v.key },
      log: { source: `${ADDR.web}:${v.port}`, destination: `${ADDR[v.who]}:${v.sport}`, service: `TCP ${v.port} · ${v.svc}`, decision: KNOWN_DECISION },
      plain: o.plain,
    },
  ];
}

/**
 * A change to the rule list: the rows in their new order, every remembered
 * connection gone, then a note for the log with a `rules` cue naming the order.
 *
 * The rows change first, so the figure's board (which reads the rule list) and
 * the panel reorder together as the change starts; the note then plays the
 * board's flash and lands the log row, as the mockup's `playChange` does. That
 * is the brief's note, replace, clear and cue, in the order the console plays them.
 */
export function change(o: { id: string; rules: RuleSet; plain: string }): SceneEvent[] {
  const notes = rulesOf(o.rules).map((r, i) => `${i + 1} ${r.note}`);
  const rows: TableEvent = {
    type: 'table',
    id: `${o.id}-rules`,
    table: RULES_TABLE,
    op: 'replace',
    rows: ruleTableRows(o.rules),
    summary: `The rule list now reads: ${notes.join(', ')}.`,
  };
  const forgotten: TableEvent = {
    type: 'table',
    id: `${o.id}-conns`,
    table: CONNS_TABLE,
    op: 'clear',
    summary: 'Yesterday’s connections have closed, so the firewall remembers none.',
  };
  const note: NoteEvent = {
    type: 'note',
    id: o.id,
    log: { source: '–', destination: '–', service: '–', decision: 'Rules changed' },
    plain: o.plain,
    cues: [{ cue: 'rules', arg: o.rules }],
  };
  return [rows, forgotten, note];
}

// ---------------------------------------------------------------- checkResults

/** What a visit asks for, read from its log row as the learner reads it: the source address, the protocol and the port. */
function inputsOf(e: MessageEvent): { sourceIp: string; protocol: 'tcp' | 'udp'; port: number } | null {
  const sourceIp = /^([\d.]+):\d+$/.exec(e.log.source ?? '')?.[1];
  const port = Number(/:(\d+)$/.exec(e.log.destination ?? '')?.[1]);
  const protocol = /^(TCP|UDP)\b/.exec(e.log.service ?? '')?.[1]?.toLowerCase() as 'tcp' | 'udp' | undefined;
  return sourceIp === undefined || protocol === undefined || !Number.isInteger(port) ? null : { sourceIp, protocol, port };
}

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** The last visit or reply of a step, as the engine works it out. */
type Outcome = { id: string; kind: 'visit'; decision: Decision; inputs: NonNullable<ReturnType<typeof inputsOf>>; set: RuleSet } | { id: string; kind: 'reply'; rule: string | undefined };

function checkUnit(u: Unit, problems: string[]): void {
  const panel = u.scene.panel;
  if (panel?.type !== 'rules') {
    problems.push(`Unit "${u.id}" has no rule list to work its decisions out from.`);
    return;
  }
  const start = (Object.keys(RULESETS) as RuleSet[]).find((name) => same(ruleTableRows(name), panel.rules.initialRows));
  if (start === undefined) {
    problems.push(`Unit "${u.id}": the rule list starts with rows that are none of the orders (${Object.keys(RULESETS).join(', ')}).`);
    return;
  }
  let set: RuleSet = start;
  const tables: Record<string, { state: TableState; keyColumn: string }> = {
    [panel.rules.id]: { state: { rows: structuredClone(panel.rules.initialRows), highlight: null, missed: [] }, keyColumn: panel.rules.keyColumn },
    [panel.conns.id]: { state: { rows: structuredClone(panel.conns.initialRows), highlight: null, missed: [] }, keyColumn: panel.conns.keyColumn },
  };
  const rulesShown = () => tables[panel.rules.id]!.state.rows;
  const remembered = (key: string) => tables[panel.conns.id]!.state.rows.find((row) => row[panel.conns.keyColumn] === key);

  for (const step of u.steps) {
    const at = `Step "${step.id}"`;
    let last: Outcome | null = null;
    const letIn: { id: string; key: string; rule: string }[] = [];

    for (const e of step.events) {
      if (e.type === 'table') {
        const table = tables[e.table];
        if (table !== undefined) applyTableEvent(table.state, table, e);
        continue;
      }
      if (e.type === 'note') {
        const arg = e.cues?.find((c) => c.cue === 'rules')?.arg;
        if (arg === undefined) continue;
        if (!isRuleSet(arg)) problems.push(`${at}, note "${e.id}": the rules cue names “${arg}”, which is none of the orders.`);
        else set = arg;
        if (!same(rulesShown(), ruleTableRows(set))) {
          problems.push(`${at}, note "${e.id}": the rule list shows other rules than the “${set}” order the decisions are worked out from.`);
        }
        continue;
      }

      if (e.known !== undefined) {
        const row = remembered(e.known.key);
        if (row === undefined) problems.push(`${at}, reply "${e.id}": it answers the connection “${e.known.key}”, which the firewall does not remember.`);
        if (e.log.decision !== KNOWN_DECISION) problems.push(`${at}, reply "${e.id}": its log says “${e.log.decision}”, not “${KNOWN_DECISION}”.`);
        last = { id: e.id, kind: 'reply', rule: row?.rule };
        continue;
      }
      if (e.check === undefined) {
        problems.push(`${at}, message "${e.id}" is neither a visit the rules check nor a reply to a known connection.`);
        continue;
      }

      const inputs = inputsOf(e);
      if (inputs === null) {
        problems.push(`${at}, visit "${e.id}": its log row does not say a source address, a protocol and a port.`);
        continue;
      }
      if (!same(rulesShown(), ruleTableRows(set))) {
        problems.push(`${at}, visit "${e.id}": the rule list shows other rules than the “${set}” order the decisions are worked out from.`);
      }
      const decision = decide(set, inputs.sourceIp, inputs.protocol, inputs.port);
      const allowed = decision.action === 'allow';
      const said = e.check;
      if (!same({ table: said.table, read: said.read, match: said.match, action: said.action }, { table: RULES_TABLE, read: decision.read, match: decision.n, action: decision.action })) {
        problems.push(
          `${at}, visit "${e.id}": the engine has it ${allowed ? 'allowed' : 'denied'} by rule ${decision.n} (read ${decision.read}), but the event says ${said.action} by rule ${said.match} (read ${said.read}).`,
        );
      }
      const ends = allowed ? ['web', 'delivered'] : ['firewall', 'blocked'];
      if (!same([e.to, e.outcome ?? 'delivered'], ends)) problems.push(`${at}, visit "${e.id}": it should end at ${ends[0]}, ${ends[1]}; it ends at ${e.to}, ${e.outcome ?? 'delivered'}.`);
      if (e.log.decision !== decisionText(decision)) problems.push(`${at}, visit "${e.id}": its log says “${e.log.decision}”, but the engine says “${decisionText(decision)}”.`);
      if (allowed) letIn.push({ id: e.id, key: `${e.from}:${inputs.port}`, rule: String(decision.n) });
      last = { id: e.id, kind: 'visit', decision, inputs, set };
    }

    // Each visit let in is remembered, with the rule that let it in.
    for (const v of letIn) {
      if (remembered(v.key)?.rule !== v.rule) problems.push(`${at}, visit "${v.id}": it was let in by rule ${v.rule}, but the firewall does not remember it so.`);
    }
    checkFacts(step, at, last, problems);
  }
}

/** The step's facts against its last visit or reply: the Result, the rules read, each rule said not to fit, and a reply's rule. */
function checkFacts(step: Unit['steps'][number], at: string, last: Outcome | null, problems: string[]): void {
  for (const { label, value } of step.facts) {
    if (label === 'Result') {
      if (last === null) {
        problems.push(`${at}: the Result fact says “${value}”, but the step has no visit or reply.`);
      } else if (last.kind === 'reply') {
        if (!value.startsWith('Allowed')) problems.push(`${at}: the Result fact says “${value}”, but the engine lets reply ${last.id} through.`);
      } else {
        const { action, n } = last.decision;
        const word = action === 'allow' ? 'Allowed' : 'Denied';
        const names = n === null ? !/\brule \d/.test(value) : new RegExp(`\\brule ${n}(?!\\d)`).test(value);
        if (!value.startsWith(`${word} by `) || !names) {
          problems.push(`${at}: the Result fact says “${value}”, but the engine has ${last.id} ${action === 'allow' ? 'allowed' : 'denied'} by rule ${n}.`);
        }
      }
    }
    if (label === 'Rules read' && last !== null) {
      const read = last.kind === 'reply' ? 'None' : `${last.decision.read} of ${RULESETS[last.set].length}`;
      if (value !== read) problems.push(`${at}: the Rules read fact says “${value}”, but the engine read “${read}”.`);
    }
    const k = /^Rule (\d+)$/.exec(label)?.[1];
    if (k !== undefined && value.startsWith('Doesn’t fit') && last?.kind === 'visit') {
      const rule = rulesOf(last.set)[Number(k) - 1];
      if (rule === undefined || evaluateRules([rule], last.inputs).ruleId !== null) problems.push(`${at}: the fact says rule ${k} doesn’t fit ${last.id}, but the engine says it does.`);
    }
    if (last?.kind === 'reply') {
      for (const [, n] of value.matchAll(/\brule (\d+)\b/g)) {
        if (n !== last.rule) problems.push(`${at}: the ${label} fact names rule ${n}, but the connection reply ${last.id} answers was let in by rule ${last.rule}.`);
      }
    }
  }
}

/**
 * Throws, listing every problem, unless each visit's decision, where it ends,
 * its log row and its step's facts are what the engine works out from the
 * rules in force and what the visit's log row shows, and each reply answers a
 * connection the firewall remembers. The rules in force are the order the
 * latest `rules` cue names, and the rule list must show that order.
 */
export function checkResults(lesson: Lesson): void {
  const problems: string[] = [];
  for (const u of lesson.units) checkUnit(u, problems);
  if (problems.length > 0) {
    throw new Error(`Lesson "${lesson.slug}" states decisions the engine does not make:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  }
}
