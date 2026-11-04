import { defineLesson } from '../../define';
import { ipv4Layer, packet, tcpLayer } from '../../helpers/packets';
import { FIREWALL_COLUMNS, firewallScenario, ruleRows, type FirewallRule, type Probe } from '../../../engine/net/firewall';
import type { Packet } from '../../schema';

/**
 * Firewalls, lesson 16 of 19. A visitor and an admin try to reach a web server
 * through a firewall whose rule list is read top to bottom: the first rule that
 * fits decides. The Try it edits the list and runs the same visits again.
 *
 * The web server's address, 10.0.0.10, is private, so in real life a visitor
 * reaches it through a public address that NAT or port forwarding passes on
 * (lesson 12). The lesson shows the packets as the firewall's rules see them
 * after that forwarding (as Linux netfilter does), so every packet is addressed
 * to 10.0.0.10. The packets are IPv4 + TCP only: those are the two headers
 * these rules read (layers 3 and 4), and leaving Ethernet out also means the
 * packet is the same on both sides of the firewall.
 *
 * The rule list is a simple packet filter's. The lesson says what a stateful
 * firewall adds (it remembers the connections it allowed) but does not model it.
 */

const VISITOR = '203.0.113.50';
const ADMIN = '198.51.100.7';
const WEB = '10.0.0.10';

// ---------------------------------------------------------------------- rules

const httpsRule: FirewallRule = { id: 'r1', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: 'Website (HTTPS)' };
const adminRule: FirewallRule = { id: 'r2', action: 'allow', protocol: 'tcp', port: 22, source: `${ADMIN}/32`, note: 'Admin SSH' };
const blockRule: FirewallRule = { id: 'r3', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: 'Block everything else' };
const httpRule: FirewallRule = { id: 'r4', action: 'allow', protocol: 'tcp', port: 80, source: 'any', note: 'Website (HTTP)' };

const baseRules = [httpsRule, adminRule, blockRule];

// ------------------------------------------------------------------- the visits

const VISITS = {
  https: { who: 'visitor', label: 'HTTPS 443', port: 443, ttl: 52, summary: 'The visitor asks for the website on port 443, the door for secure websites.' },
  ssh: { who: 'visitor', label: 'SSH 22', port: 22, ttl: 52, summary: 'The visitor asks for port 22, the door for logging in to the server with SSH.' },
  'admin-ssh': { who: 'admin', label: 'SSH 22', port: 22, ttl: 56, summary: 'The admin asks for port 22 to log in to the server with SSH.' },
  telnet: { who: 'visitor', label: 'Telnet 23', port: 23, ttl: 52, summary: 'The visitor asks for port 23, an old unencrypted way to log in.' },
  http: { who: 'visitor', label: 'HTTP 80', port: 80, ttl: 52, summary: 'The visitor asks for the website on port 80, the door for plain, unencrypted web pages.' },
} as const;
type VisitKey = keyof typeof VISITS;

const SYN_BYTES = 44; // IPv4 20 + TCP 24 (header 20 + the maximum segment size option 4)

const packets: Record<string, Packet> = {};
/** What each request packet used, so the reply can answer the right connection. */
const connections: Record<string, { sourcePort: number; isn: number }> = {};

const hex4 = (n: number) => `0x${n.toString(16).padStart(4, '0')}`;

/**
 * One visit: a Probe for the firewall engine, plus its SYN packet. Every visit is
 * a new connection, so each gets its own source port (from the dynamic range
 * 49152 to 65535), initial sequence number and IPv4 identification.
 */
function visit(id: string, key: VisitKey, time: number): Probe {
  const v = VISITS[key];
  const n = Object.keys(connections).length;
  const sourceIp = v.who === 'admin' ? ADMIN : VISITOR;
  const sourcePort = 49152 + ((n * 7919 + 1301) % 16384);
  const isn = ((n + 1) * 2654435761) >>> 0;
  connections[id] = { sourcePort, isn };
  packets[id] = packet({
    name: `TCP SYN to port ${v.port}`,
    summary:
      'A SYN is the first packet of a TCP connection: the sender asks to open one. The firewall reads the addresses in the IP header and the ports in the TCP header to decide.',
    seenAt: `Captured at the firewall as the request arrives, after NAT has swapped in the web server's private address (lesson 12). The Ethernet header is left out: these rules only read the IP and TCP headers.`,
    layers: [
      ipv4Layer({ src: sourceIp, dst: WEB, protocol: 'TCP', ttl: v.ttl, totalLength: SYN_BYTES, identification: hex4(0x6c10 + 0x2b * n) }),
      tcpLayer({ src: sourceIp, dst: WEB, srcPort: sourcePort, dstPort: v.port, flags: ['SYN'], seq: isn, window: 64240, mss: 1460 }),
    ],
  });
  return {
    id,
    label: v.label,
    from: v.who,
    to: 'web',
    via: ['internet'],
    sourceIp,
    destIp: WEB,
    protocol: 'tcp',
    port: v.port,
    time,
    size: SYN_BYTES,
    summary: v.summary,
    packet: id,
  };
}

/** The same visits the steps showed, run again after the rules change. `prefix` keeps the event and packet ids apart. */
const replay = (prefix: string, keys: VisitKey[]): Probe[] => keys.map((key, i) => visit(`${prefix}-${key}`, key, 60 + 0.003 * i + (i > 0 ? 0.001 : 0)));

const FOUR: VisitKey[] = ['https', 'ssh', 'admin-ssh', 'telnet'];

const tryItEvents = (prefix: string, rules: FirewallRule[], keys: VisitKey[]) =>
  firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: replay(prefix, keys), replaceRules: true });

const stepEvents = (id: string, key: VisitKey, time: number) =>
  firewallScenario({ firewall: 'fw', table: 'rules', rules: baseRules, probes: [visit(id, key, time)] });

// Step events are built in step order, so each visit's number (and so its source port) follows the lesson.
const httpsEvents = stepEvents('https', 'https', 0);
const sshEvents = stepEvents('ssh', 'ssh', 0.004);
const adminEvents = stepEvents('admin-ssh', 'admin-ssh', 0.007);
const telnetEvents = stepEvents('telnet', 'telnet', 0.01);

/** The server's SYN-ACK: it answers the visitor's HTTPS request, so it uses that request's port and acknowledges its sequence number plus 1. */
const httpsConnection = connections['https']!;
packets['https-reply'] = packet({
  name: 'TCP SYN-ACK from port 443',
  summary: "The web server's first reply: it agrees to open the connection. It belongs to the connection that rule 1 allowed.",
  seenAt: 'Captured at the firewall as the reply passes back out.',
  layers: [
    ipv4Layer({ src: WEB, dst: VISITOR, protocol: 'TCP', ttl: 64, totalLength: SYN_BYTES, identification: '0x3e7a' }),
    tcpLayer({
      src: WEB,
      dst: VISITOR,
      srcPort: 443,
      dstPort: httpsConnection.sourcePort,
      flags: ['SYN', 'ACK'],
      seq: 1187419304,
      ack: httpsConnection.isn + 1,
      window: 65160,
      mss: 1460,
    }),
  ],
});

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'firewalls',
  title: 'Firewalls',
  subtitle: 'Deciding what gets in',
  level: 'beginner',
  osiLayers: [3, 4],
  certTags: ['network-plus', 'security-plus', 'ccna', 'soc-analyst'],
  summary:
    'Watch a firewall check connections against a rule list from the top down, see why the order of the rules matters, and edit the list to see traffic let in or blocked.',
  references: [
    {
      label: 'NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy',
      url: 'https://csrc.nist.gov/pubs/sp/800/41/r1/final',
    },
  ],

  overview: {
    hook: "Picture the guard at the front door of an office building. Before anyone walks in, the guard checks a list: deliveries go to the loading dock, the IT team may use the server room, and everyone else stays outside. A firewall is that guard for a network. Every connection that tries to reach a computer is checked against a list of rules, then let in or turned away.",
    name: 'Firewall',
    fullName: 'Network firewall',
    description:
      "A firewall decides which network traffic may pass. Each rule says allow or deny for one kind of traffic, and many firewalls read the list from the top and obey the first rule that fits (some products use other orders). A packet filter judges each packet on its own. A stateful firewall also remembers the connections it has allowed. A next-generation firewall adds checks on the application itself. The rules in this lesson look at addresses and ports.",
    facts: [
      { label: 'Works with', value: 'Addresses and ports (layers 3–4)' },
      { label: 'Reads rules', value: 'Top to bottom, first match wins' },
      { label: 'Recommended default', value: 'Block anything not allowed' },
      { label: 'Common types', value: 'Packet filter, stateful, next-generation' },
    ],
  },

  scene: {
    type: 'flow',
    views: ['network', 'sequence'],
    actors: [
      { id: 'visitor', kind: 'laptop', label: 'Visitor', addresses: [VISITOR], x: 130, y: 150 },
      { id: 'admin', kind: 'laptop', label: 'Admin laptop', addresses: [ADMIN], x: 130, y: 400 },
      { id: 'internet', kind: 'internet', label: 'The internet', addresses: [], x: 390, y: 275 },
      { id: 'fw', kind: 'firewall', label: 'Firewall', addresses: [], x: 630, y: 275 },
      { id: 'web', kind: 'server', label: 'Web server', addresses: [WEB], x: 870, y: 275 },
    ],
    links: [
      { id: 'visitor-internet', from: 'visitor', to: 'internet', medium: 'wired' },
      { id: 'admin-internet', from: 'admin', to: 'internet', medium: 'wired' },
      { id: 'internet-fw', from: 'internet', to: 'fw', medium: 'wired' },
      { id: 'fw-web', from: 'fw', to: 'web', medium: 'wired' },
    ],
    tables: [
      {
        id: 'rules',
        actor: 'fw',
        title: 'Rule list',
        columns: [...FIREWALL_COLUMNS],
        keyColumn: '#',
        initialRows: ruleRows(baseRules),
      },
    ],
    packets,
    legend: [
      { kind: 'request', label: 'Connection attempt' },
      { kind: 'response', label: 'Reply from the server' },
      { kind: 'dropped', label: 'Blocked by the firewall' },
    ],
  },

  steps: [
    {
      id: 'rules-top-down',
      title: 'Rules are read top to bottom',
      subtitle: 'The firewall checks its list from rule 1',
      narrative:
        "The guard reads a clipboard from the top, line by line. A firewall reads its rule list the same way. Each rule says allow or deny for one kind of traffic: a protocol (here TCP, the reliable way most connections travel; lesson 11), a port (the door number of a service; lesson 10) and a source (the address it comes from; lesson 3). A visitor at 203.0.113.50 now asks for port 443, the door for secure websites. Rule 1 allows TCP 443 from any source, so the visit goes through and the firewall never reads rules 2 and 3.",
      facts: [
        { label: 'Visit', value: 'TCP port 443 from 203.0.113.50' },
        { label: 'Rule 1', value: 'ALLOW TCP 443, any source' },
        { label: 'Result', value: 'Allowed by rule 1, passed on to the web server' },
        { label: 'Web server', value: '10.0.0.10 is private, so in real life NAT passes visits on to it (lesson 12)' },
      ],
      events: httpsEvents,
    },
    {
      id: 'first-match',
      title: 'The first match wins',
      subtitle: 'The first rule that fits decides',
      narrative:
        "Now the visitor asks for port 22, the door for SSH, a way to log in to a server from far away. The guard checks the list from the top. Rule 1 covers port 443, so it doesn't fit. Rule 2 covers port 22, but only for one address, 198.51.100.7, and this visitor is 203.0.113.50, so it doesn't fit either. Rule 3 covers everything, so it fits, and it says deny. The first rule that fits decides, and the firewall stops reading there. That is why a catch-all belongs last: put it first and it would block everything.",
      facts: [
        { label: 'Visit', value: 'TCP port 22 from 203.0.113.50' },
        { label: 'Rules that fit', value: 'Rule 3 only, the catch-all' },
        { label: 'Result', value: 'Denied by rule 3' },
      ],
      events: sshEvents,
    },
    {
      id: 'named-source',
      title: 'Rules can name a source',
      subtitle: 'One address gets in; the rest stay out',
      narrative:
        "A guard checks who you are as well as which door you want. Rule 2 does that: it allows port 22, but only from 198.51.100.7, the admin's laptop. The /32 on the end means exactly that one address (lesson 7 covers the slash). The admin's request doesn't fit rule 1, because it's the wrong port, but it fits rule 2, so it goes through. The visitor's SSH request in the last step was denied. Naming a source opens a door for one trusted person and keeps it shut for everyone else.",
      facts: [
        { label: 'Visit', value: 'TCP port 22 from 198.51.100.7' },
        { label: 'Rule 2', value: 'ALLOW TCP 22, source 198.51.100.7/32' },
        { label: 'Result', value: 'Allowed by rule 2, passed on to the web server' },
      ],
      events: adminEvents,
    },
    {
      id: 'everything-else',
      title: 'Everything else is blocked',
      subtitle: 'The last rule catches what nothing allowed',
      narrative:
        "The guard's clipboard ends with one last line: anyone not named above, turn away. The visitor now tries port 23, Telnet, an old way to log in that sends everything, passwords included, as readable text. Nobody wrote a rule about port 23, yet it's blocked: it fits neither rule 1 nor rule 2, so it falls to rule 3, Block everything else. Allowing only what you need and blocking the rest is called default deny, and NIST's firewall guidance recommends it, because a rule you forgot to write then leaves a door shut, not open. Not every firewall blocks by default, so when you inherit a rule list, check its last rule.",
      facts: [
        { label: 'Visit', value: 'TCP port 23 (Telnet) from 203.0.113.50' },
        { label: 'Rules that fit', value: 'Rule 3 only, the catch-all' },
        { label: 'Result', value: 'Denied by rule 3' },
      ],
      events: telnetEvents,
    },
    {
      id: 'replies',
      title: 'Replies get through',
      subtitle: 'A firewall can remember connections',
      narrative:
        "The guard keeps a visitor log. Anyone signed in at the door is waved through on the way out, without the list being read again. A firewall does the same with connections. The web server answers the visitor's HTTPS request, and that reply has to cross the firewall too. A stateful firewall keeps a table of the connections it has allowed, and traffic that belongs to one of them passes without a rule of its own. This reply belongs to the connection rule 1 let in. A simpler packet filter, which judges every packet alone, would need a rule of its own for replies.",
      facts: [
        { label: 'Reply', value: 'From 10.0.0.10, port 443, back to 203.0.113.50' },
        { label: 'Why it passes', value: 'It belongs to the connection rule 1 allowed' },
        { label: 'Stateful firewall', value: 'Remembers the connections it has allowed' },
      ],
      events: [
        {
          type: 'message',
          id: 'https-reply',
          from: 'web',
          to: ['visitor'],
          via: ['fw', 'internet'],
          src: `${WEB}:443`,
          dst: `${VISITOR}:${httpsConnection.sourcePort}`,
          protocol: 'TCP',
          kind: 'response',
          label: 'HTTPS reply',
          summary: 'HTTPS reply (part of an allowed connection)',
          size: SYN_BYTES,
          time: 0.012,
          packet: 'https-reply',
        },
      ],
    },
  ],

  tryIt: {
    mode: 'choices',
    prompt:
      'Change the rule list and watch the same test visits run again. Pick a change, then follow each visit down the table: which rule catches it, and is it allowed?',
    choices: [
      {
        id: 'deny-first',
        label: "Move 'Block everything else' to the top",
        events: tryItEvents('deny-first', [blockRule, httpsRule, adminRule], FOUR),
        explanation:
          "'Block everything else' now sits at rule 1, and it fits every packet, so the firewall stops reading there every time. All four visits are blocked, even the website on 443 and the admin's login, because the allow rules below can never get a turn. Order matters: put the most specific rules first and the catch-all last.",
      },
      {
        id: 'allow-http',
        label: "Add 'Allow TCP 80' above the last rule",
        events: tryItEvents('allow-http', [httpsRule, adminRule, httpRule, blockRule], [...FOUR, 'http']),
        explanation:
          'The new rule 3, Allow TCP 80, sits above the catch-all, which is now rule 4. The visit to port 80 fits rule 3 and gets through. The other four behave as before, though the blocked ones are now caught by rule 4. Many sites keep port 80 open to send visitors on to HTTPS (lesson 14), but plain HTTP is unencrypted, so open it on purpose.',
      },
      {
        id: 'remove-admin',
        label: 'Remove the admin SSH rule',
        events: tryItEvents('remove-admin', [httpsRule, blockRule], FOUR),
        explanation:
          "With the admin rule gone, the admin's SSH visit fits nothing until the catch-all, now rule 2, denies it. The website still works through rule 1. Taking away an allow rule closes a door: whatever nothing allows is blocked. On a real network, that is the moment the admin phones the helpdesk.",
      },
    ],
  },

  check: [
    {
      id: 'no-rule-matches',
      prompt: "A packet matches none of the rules in this lesson's list. What happens to it?",
      options: ['It is allowed, because no rule forbids it', 'It waits for an administrator to decide', 'It is blocked, because no rule allows it'],
      answer: 2,
      explanation:
        'Whatever no rule allows is blocked. That is default deny, and rule 3 does the job in plain sight. NIST recommends it; the opposite, allowing everything not forbidden, would leave a door open for every danger nobody thought of.',
    },
    {
      id: 'rule-order',
      prompt:
        'A list has two rules. Rule 1: allow TCP 22 from any source. Rule 2: deny TCP 22 from 203.0.113.50. What happens to an SSH login from 203.0.113.50?',
      options: ['Allowed, because rule 1 fits first', 'Blocked, because rule 2 names this exact address', 'Blocked, because deny always beats allow'],
      answer: 0,
      explanation:
        "The firewall reads from the top and stops at the first rule that fits. Rule 1 fits any source, so the login is allowed and rule 2 is never read. A rule doesn't win by being specific, only by being higher up. Swap the two and the login is blocked.",
    },
    {
      id: 'admin-rule',
      prompt: "Which rule lets the admin log in over SSH while the visitor can't?",
      options: ['Rule 1, because it allows connections from any source', "Rule 2, because it names the admin's address", 'Rule 3, because it covers every port and source'],
      answer: 1,
      explanation:
        "Rule 2 allows port 22, but only from 198.51.100.7. The visitor's request doesn't fit it, so it falls through to rule 3 and is blocked. If the admin's address ever changed, rule 2 would stop fitting and the admin would be blocked too, so a rule that names an address needs updating when the address does.",
    },
  ],

  recap: {
    takeaways: [
      'A firewall checks each connection against a rule list, using addresses and ports (layers 3 and 4), and allows or blocks it.',
      'Rules are read from the top and the first match wins, so order matters: put the most specific rules first and the catch-all last.',
      'A recommended policy is default deny: block whatever nothing allows. A stateful firewall also remembers the connections it allowed, so their replies pass without a rule of their own.',
    ],
  },
});
