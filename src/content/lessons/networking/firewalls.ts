import { defineLesson } from '../../define';
import { ADDR, change, checkResults, ruleTableRows, visits } from '../../helpers/firewall-events';

/**
 * Firewalls, lesson 17 of 20. A visitor and an admin out on the internet reach
 * an office web server through a firewall whose rule list is read from the
 * top: the first rule that fits decides, and whatever no rule allows is
 * blocked (NIST SP 800-41 Rev. 1). The firewall is stateful: it remembers the
 * connections it let in, so their replies get back out. Step 6 moves the
 * catch-all to the top and shows a shadowed rule.
 *
 * The words are the approved mockup's (FIGS/firewall-lesson.mjs, built into
 * firewalls-v1.html). Every decision is the engine's: the helpers work each
 * visit out with `evaluateRules`, and `checkResults`, at the end of this file,
 * works them out again from what the lesson shows, so a decision that changes
 * stops the build (spec §7.4).
 */

// This lesson's visits, so each reply can name the visit it answers.
const { visit, reply } = visits();

const firewalls = defineLesson({
  slug: 'firewalls',
  title: 'Firewalls',
  subtitle: 'Deciding what gets in',
  level: 'beginner',
  certTags: ['network-plus', 'security-plus', 'ccna', 'soc-analyst'],
  summary: 'Watch a firewall check each connection against its list of rules, from the top down, and see why the order of the rules matters.',
  figure: 'firewall',
  units: [
    {
      id: 'firewalls',
      name: 'Firewall',
      fullName: 'Network firewall',
      purpose: 'A guard for your network',
      osiLayers: [3, 4],
      references: [{ label: 'NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy', url: 'https://csrc.nist.gov/pubs/sp/800/41/r1/final' }],
      scene: {
        title: 'Office firewall · web server 10.0.0.10',
        views: ['network', 'sequence'],
        panel: {
          type: 'rules',
          // The mockup's widths for the short columns; what each rule is for takes the rest. The panel adds Check.
          rules: {
            id: 'rules',
            title: 'Rule list',
            by: 'read from the top, first match wins',
            columns: [
              { key: '#', label: '#', width: 28 },
              { key: 'action', label: 'Action', width: 64 },
              { key: 'port', label: 'Port', width: 76 },
              { key: 'source', label: 'Source', width: 132 },
              { key: 'note', label: 'For', prose: true },
            ],
            keyColumn: '#',
            initialRows: ruleTableRows('base'),
            empty: 'No rules yet.',
          },
          // Shown as chips under the rule list: who, which port, and the rule that let them in. Keyed by who and port.
          conns: {
            id: 'conns',
            title: 'Connections it remembers',
            columns: [
              { key: 'who', label: 'Who', prose: true },
              { key: 'port', label: 'Port' },
              { key: 'rule', label: 'Let in by' },
              { key: 'from', label: 'From' },
              { key: 'to', label: 'To' },
            ],
            keyColumn: 'key',
            hiddenKey: true,
            initialRows: [],
            empty: 'None yet. Each allowed visit is remembered here.',
          },
        },
        log: {
          title: 'Firewall log',
          idle: 'Nothing has reached the firewall yet. Press Play, or pick a step.',
          // The widths the mockup's log draws its columns at, at 1280 px; the console's table is fixed, so they are set.
          columns: [
            { key: 'source', label: 'Source', width: 168 },
            { key: 'destination', label: 'Destination', width: 168 },
            { key: 'service', label: 'Service', width: 146 },
            { key: 'decision', label: 'Decision', width: 234, strong: true },
            { key: 'plain', label: 'In plain words', prose: true },
          ],
          legend: [
            { kind: 'request', label: 'Visit' },
            { kind: 'response', label: 'Reply' },
            { kind: 'blocked', label: 'Blocked' },
            { kind: 'change', label: 'Rule change' },
          ],
        },
        parties: [
          { place: 'visitor', label: 'Visitor', addr: ADDR.visitor },
          { place: 'admin', label: 'Admin', addr: ADDR.admin },
          { place: 'firewall', label: 'Firewall', addr: 'rule list' },
          { place: 'web', label: 'Web server', addr: ADDR.web },
        ],
      },
      overview: {
        hook: 'Picture a guard at the gate of an office. Before anyone comes in, the guard checks a list: visitors may come to the front desk, the IT team may use the back door, and everyone else stays outside. A firewall is that guard for a network. Every visit that tries to reach a computer is checked against a list of rules, then let in or turned away.',
        description:
          'A firewall stands between a network and the outside world and decides what may pass. It reads its rules from the top, and the first rule that fits decides. The rules in this lesson look at where a visit comes from and which door, called a port, it asks for.',
        facts: [
          { label: 'Works with', value: 'Addresses and ports (layers 3 and 4)' },
          { label: 'Reads rules', value: 'Top to bottom, first match wins' },
          { label: 'Recommended default', value: 'Block anything not allowed' },
          { label: 'Remembers', value: 'The connections it let in (stateful)' },
          { label: 'Common types', value: 'Packet filter, stateful, next-generation' },
        ],
      },
      steps: [
        {
          id: 'rule-evaluation',
          title: 'Rule Evaluation',
          sub: 'The firewall reads its list from the top',
          narrative:
            'A visitor out on the internet asks for the office website. Before the visit goes in, the firewall checks it against its **rule list**, starting at rule 1. Each rule says **allow** or **deny** for one kind of visit. Rule 1 says anyone may reach the website, which answers at door number 443. Door numbers like this are called **ports**. The visit fits, so the arms lift and it goes through. Rules 2 and 3 are never read.',
          deep: 'The visit is the first packet of a TCP connection, called a SYN (lesson 12). The firewall reads the source and destination addresses in its IP header and the destination port in its TCP header. Port 443 is HTTPS (lesson 15). The web server’s address, 10.0.0.10, is private, so in real life the visit reaches it through NAT (lesson 13). The rules here see it after that.',
          facts: [
            { label: 'Visit', value: 'TCP port 443 from 203.0.113.50' },
            { label: 'Rule 1', value: 'ALLOW TCP 443, any source' },
            { label: 'Result', value: 'Allowed by rule 1' },
            { label: 'Rules read', value: '1 of 3' },
          ],
          events: visit({ id: 'visit-website', who: 'visitor', tag: 'HTTPS 443', port: 443, svc: 'HTTPS', sport: 50432, rules: 'base', plain: 'The visitor asks for the website.' }),
        },
        {
          id: 'first-match',
          title: 'First-Match Rule',
          sub: 'The first rule that fits decides',
          narrative:
            'Now the visitor knocks on a different door: port 22, used to log in to a server and control it from far away. The firewall starts at the top again. Rule 1 is for port 443, so it doesn’t fit. Rule 2 is for port 22, but only from the admin’s address, so it doesn’t fit either. Rule 3 fits everything, and it says deny. The **first rule that fits** decides, so the visit is turned away.',
          deep: 'Port 22 is SSH, a secure way to log in to a computer over the network. Most firewalls, including Cisco access lists and Linux iptables chains, stop at the first rule that matches. Some products sort their rules in other ways, so check yours. A blocked visit can be dropped without a word or refused with a reply; dropping tells an outsider less.',
          facts: [
            { label: 'Visit', value: 'TCP port 22 from 203.0.113.50' },
            { label: 'Rule 1', value: 'Doesn’t fit: wrong port' },
            { label: 'Rule 2', value: 'Doesn’t fit: wrong source' },
            { label: 'Result', value: 'Denied by rule 3' },
          ],
          events: visit({ id: 'visit-login', who: 'visitor', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 50433, rules: 'base', plain: 'The visitor tries the login door.' }),
        },
        {
          id: 'source-filtering',
          title: 'Source Filtering',
          sub: 'One trusted address gets in',
          narrative:
            'The admin looks after the server and needs to log in to it on port 22 too. Rule 2 opens that door, but only for one address: the admin’s, 198.51.100.7. The address a visit comes from is called its **source**. The admin’s visit doesn’t fit rule 1, but it fits rule 2, so it goes through. The door that stayed shut for the visitor opens for the admin.',
          deep: '198.51.100.7/32 means exactly one address: all 32 bits must match (lesson 8 covers the slash). A rule that names an address only works while that address stays the same, so admin logins are often allowed from a VPN’s addresses instead (lesson 20).',
          facts: [
            { label: 'Visit', value: 'TCP port 22 from 198.51.100.7' },
            { label: 'Rule 2', value: 'ALLOW TCP 22, source 198.51.100.7/32' },
            { label: 'Result', value: 'Allowed by rule 2' },
          ],
          events: visit({ id: 'admin-login', who: 'admin', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 51876, rules: 'base', plain: 'The admin logs in from a named address.' }),
        },
        {
          id: 'default-deny',
          title: 'Default Deny',
          sub: 'Whatever nothing allows is blocked',
          narrative:
            'The visitor tries port 23, an old way to log in that sends everything as plain text, passwords included. Nobody wrote a rule about port 23. It doesn’t fit rule 1 or rule 2, so it falls to the last rule, Block everything else, and it’s turned away. Allowing only what you need and blocking the rest is called **default deny**. If someone forgets to write a rule, a door stays shut instead of open.',
          deep: 'Port 23 is Telnet. NIST’s firewall guidance (SP 800-41) recommends default deny. Many firewalls end every list with an invisible deny, often called the implicit deny, but not all do, so when you inherit a rule list, read its last rule.',
          facts: [
            { label: 'Visit', value: 'TCP port 23 (Telnet) from 203.0.113.50' },
            { label: 'Rules that fit', value: 'Rule 3 only' },
            { label: 'Result', value: 'Denied by rule 3' },
          ],
          events: visit({ id: 'visit-telnet', who: 'visitor', tag: 'TELNET 23', port: 23, svc: 'Telnet', sport: 50434, rules: 'base', plain: 'The visitor tries an old, unsafe door.' }),
        },
        {
          id: 'stateful',
          title: 'Stateful Inspection',
          sub: 'Replies to allowed visits get back out',
          narrative:
            'The web server answers the visitor’s website visit, and that reply has to cross the firewall too. No rule allows anything going out to the visitor. But the firewall keeps a list of the **connections** it let in, and this reply belongs to one of them, so it passes without a rule of its own. A firewall that remembers connections like this is called **stateful**.',
          deep: 'The connection table records each allowed connection’s addresses and ports, here 203.0.113.50:50432 to 10.0.0.10:443, and drops the entry when the connection closes or goes quiet. A packet filter without state judges each packet alone, so it would need a rule for the replies too, often a wide-open one. Almost every modern firewall is stateful.',
          facts: [
            { label: 'Reply', value: 'From 10.0.0.10 port 443, to 203.0.113.50' },
            { label: 'Why it passes', value: 'It belongs to a connection rule 1 allowed' },
            { label: 'Rules read', value: 'None' },
          ],
          events: reply({ id: 'reply-website', of: 'visit-website', tag: 'REPLY 443', plain: 'The server answers a known connection.' }),
        },
        {
          id: 'shadowing',
          title: 'Rule Shadowing',
          sub: 'A catch-all at the top blocks everything',
          narrative:
            'The next day, someone tidies the list and moves Block everything else to the top. The visitor comes back to the website. The firewall reads rule 1 first, and it now fits everything and says deny. The visit is blocked, and the allow rules below never get a turn. A rule that can never be reached is called **shadowed**. That’s why the catch-all always goes last.',
          deep: 'Rule audits look for shadowed rules: rules hidden by a broader one above them. Put the most specific rules first and the broadest last. Yesterday’s connections have closed, so today’s visit is a new connection and the rules are read again.',
          facts: [
            { label: 'Change', value: 'Block everything else moved to rule 1' },
            { label: 'Visit', value: 'TCP port 443 from 203.0.113.50' },
            { label: 'Result', value: 'Denied by the new rule 1' },
            { label: 'Never read', value: 'The allow rules, now 2 and 3' },
          ],
          events: [
            ...change({ id: 'move-catch-all', rules: 'shadow', plain: 'Block everything else moves to the top.' }),
            ...visit({ id: 'visit-website-again', who: 'visitor', tag: 'HTTPS 443', port: 443, svc: 'HTTPS', sport: 50511, rules: 'shadow', plain: 'The visitor comes back to the website.' }),
          ],
        },
      ],
      learn: {
        lead: 'Five visits and one reply reached the firewall. Each time, it read its list from the top and stopped at the first rule that fit. Here is what each part was, and what it’s called.',
        terms: [
          { idea: 'A guard that decides what may pass between a network and the outside', name: 'Firewall' },
          { idea: 'One line on the list: allow or block one kind of visit', name: 'Rule' },
          { idea: 'The door number a service answers at, like 443 for websites', name: 'Port' },
          { idea: 'The address a visit comes from', name: 'Source' },
          { idea: 'Reading from the top and stopping at the first rule that fits', name: 'First match' },
          { idea: 'Blocking whatever no rule allows', name: 'Default deny' },
          { idea: 'Remembering the connections it let in, so their replies get back out', name: 'Stateful' },
          { idea: 'A rule that never gets a turn, because one above it catches everything first', name: 'Shadowed rule' },
        ],
        pattern: {
          names: ['Rule Evaluation', 'First-Match Rule', 'Default Deny', 'Stateful Inspection'],
          note: 'Every visit: read from the top, stop at the first rule that fits, block whatever nothing allows, and let replies to allowed connections back out.',
        },
        why: 'Without a firewall, every service on every computer would be open to the whole internet, including ones nobody meant to share. A short list, read from the top, opens only the doors you need.',
        deep: 'Rule lists are also called access control lists (ACLs). A packet filter reads addresses and ports (layers 3 and 4), a stateful firewall adds a connection table, and a next-generation firewall also looks inside the traffic at the application. Network firewalls guard the edge of a network; host firewalls, like Windows Defender Firewall, guard one computer.',
        facts: [
          { label: 'Reads', value: 'Source, destination, protocol, port' },
          { label: 'Order', value: 'Top to bottom, first match wins' },
          { label: 'Default', value: 'Deny anything not allowed' },
          { label: 'Stateful', value: 'Tracks the connections it allowed' },
          { label: 'Also called', value: 'Access control list (ACL)' },
        ],
      },
      practice: [
        {
          id: 'port-8080',
          prompt: 'Using the list from the start of the lesson, the visitor tries port 8080. No rule mentions it. What happens to the visit?',
          options: [
            {
              text: 'It’s blocked by Block everything else, because nothing above it allows the visit.',
              feedback: 'Right. It doesn’t fit Website or Admin login, so it falls through to Block everything else. That’s default deny.',
            },
            {
              text: 'It gets through, because no rule mentions port 8080.',
              feedback: 'Not quite. With default deny, a door nobody opened stays shut. Block everything else stops it.',
            },
            {
              text: 'The firewall asks the admin what to do.',
              feedback: 'Not quite. The firewall decides on its own, from its list. Block everything else stops it.',
            },
          ],
          answer: 0,
        },
        {
          id: 'two-rules',
          prompt: 'A list has two rules. Rule 1: allow port 22 from anyone. Rule 2: deny port 22 from 203.0.113.50. Can 203.0.113.50 log in on port 22?',
          options: [
            {
              text: 'Yes. Rule 1 fits first, so rule 2 is never read.',
              feedback: 'That’s it. The first rule that fits decides. Swap the two rules and the login would be blocked.',
            },
            {
              text: 'No. Rule 2 names its exact address, so it wins.',
              feedback: 'Not quite. Being more exact doesn’t win; being higher up does. Rule 1 fits first.',
            },
            {
              text: 'No. Deny always beats allow.',
              feedback: 'Not quite. Neither word beats the other. The first rule that fits decides, and that’s rule 1.',
            },
          ],
          answer: 0,
        },
        {
          id: 'why-reply',
          prompt: 'Why did the web server’s reply get back out to the visitor, with no rule of its own?',
          options: [
            {
              text: 'Replies are never checked.',
              feedback: 'Not quite. Replies cross the firewall too. This one passed because the firewall remembered the connection.',
            },
            {
              text: 'It belonged to a connection the firewall had already let in.',
              feedback: 'Yes. A stateful firewall remembers the connections it allowed and lets their replies through.',
            },
            {
              text: 'The Website rule allows everything to and from port 443.',
              feedback: 'Not quite. The Website rule is for visits coming in. The reply passed because it belonged to a connection the firewall remembered.',
            },
          ],
          answer: 1,
        },
      ],
    },
  ],
});

export default firewalls;

// Every decision the lesson states is the engine's: a decision that changes stops the build here.
checkResults(firewalls);
