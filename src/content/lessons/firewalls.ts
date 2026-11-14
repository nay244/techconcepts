import { defineLesson } from '../define';
import { ADDR, change, checkResults, ruleTableRows, visits } from '../helpers/firewall-events';
import type { Backing, SceneEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * Firewalls, lesson 17 of 20. A visitor and an admin out on the internet reach
 * an office web server through a firewall whose rule list is read from the
 * top: the first rule that fits decides, and whatever no rule allows is
 * blocked (NIST SP 800-41 Rev. 1). The firewall is stateful: it remembers the
 * connections it let in, so their replies get back out. Step 6 moves the
 * catch-all to the top and shows a shadowed rule.
 *
 * The words are the approved mockup's (FIGS/firewall-lesson.mjs, built into
 * firewalls-v1.html), changed only where a source does not state them. Every
 * decision is the engine's: the helpers work each visit out with
 * `evaluateRules`, and `checkResults`, at the end of this file, works them out
 * again from what the lesson shows, so a decision that changes stops the build
 * (spec §7.4).
 *
 * RFC 791, 4632, 9110, 9293 and 4251, and the IANA port registry, define what
 * their citations are marked for; NIST SP 800-41 and every vendor page are not
 * marked, except that NIST's firewall guidance is the document one sentence
 * of Go deeper (step 4) is about. The addresses (RFC 5737 and RFC 1918), the
 * clients' ports, the rule list (its three rules, their order and what each is
 * for) and the story (the next day's tidy-up) are example data. No message size
 * is shown: the log has no size column. The guard at the gate (Overview hook)
 * is an analogy. No standard places a firewall at an OSI layer; the badge rests
 * on three vendors' pages.
 */

// ---------------------------------------------------------------- citations

/** A numbered section of an RFC that defines what the claim is about, so it is cited as the defining standard. */
const d = (source: string, section: string) => cite(source, section, { defining: true });

const IANA_PORTS_URL = 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers';
const IANA_PORTS = cite('iana-ports', 'Registry', { url: IANA_PORTS_URL, defining: true });

/** NIST SP 800-41 Rev. 1 has no section anchors, so a section is cited by the PDF page its passage is on. */
const NIST_PDF = 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf';
const nist = (section: string, page: number) => cite('nist-sp800-41r1', section, { url: `${NIST_PDF}#page=${page}` });
const NIST_OVERVIEW = nist('2', 11);
const NIST_PERIMETER = nist('2.1', 12);
const NIST_FILTER = nist('2.1.1', 12);
const NIST_STATELESS = nist('2.1.1', 12);
const NIST_FILTER_STATE = nist('2.1.1', 13);
const NIST_STATE_TABLE = nist('2.1.2', 14);
const NIST_STATE_TIMEOUT = nist('2.1.2', 15);
const NIST_APPLICATION = nist('2.1.3', 15);
const NIST_HOST = nist('2.2.1', 20);
const NIST_NAT = nist('3.2', 25);
const NIST_POLICY = nist('4', 28);
const NIST_POLICY_DEFINING = cite('nist-sp800-41r1', '4', { url: `${NIST_PDF}#page=28`, defining: true });
const NIST_CONFIG = nist('5.2.2', 38);
const NIST_MANAGE = nist('5.5', 42);
const NIST_GLOSSARY = nist('Appendix A', 43);

/** NISTIR 7966’s section 3 and NIST SP 800-123’s section 6.5, cited as What is SSH cites them. */
const NIST_IR_BASICS = cite('nist-ir-7966', '3', { url: 'https://nvlpubs.nist.gov/nistpubs/ir/2015/NIST.IR.7966.pdf#page=9' });
const NIST_SERVER_HARDENING = cite('nist-sp800-123', '4.2.1', { url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-123.pdf#page=27' });
const NIST_SERVER_SECURITY = cite('nist-sp800-123', '6.5', {
  url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-123.pdf#page=48',
});

/** A vendor’s page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

const CLOUDFLARE_TELNET = vendor('cloudflare-ssh', 'What is the Secure Shell (SSH) protocol?', 'Older remote management protocols like Telnet');

// Cisco
const CISCO_DEFINITION = vendor('cisco-firewall', 'What is a firewall?', 'A firewall is a network security device that separates');
const CISCO_DECIDES = vendor('cisco-firewall', 'What is a firewall?', 'A firewall is the first line of defense');
const CISCO_PACKET_FILTER = vendor('cisco-firewall', 'Packet filtering firewall', 'These firewalls scrutinize each packet of data');
const CISCO_STATEFUL = vendor('cisco-firewall', 'Stateful inspection firewall', 'Now considered a traditional firewall');
const CISCO_NGFW_TYPE = vendor('cisco-firewall', 'Next-generation firewall (NGFW)', 'While a traditional firewall typically provides stateful inspection');
const CISCO_NGFW = vendor('cisco-ngfw', 'What is a next-generation firewall (NGFW)?', 'Like a traditional firewall, an NGFW tracks connection state');
const CISCO_ASA_ORDER = vendor('cisco-asa-access-rules', 'Rule Order', 'When the ASA decides whether to forward or drop a packet');
const CISCO_ASA_IMPLICIT = vendor('cisco-asa-access-rules', 'Implicit Deny', 'ACLs have an implicit deny at the end of the list');
const CISCO_ASA_MANAGEMENT = vendor('cisco-asa-access-rules', 'Implicit Deny', 'For management');
const CISCO_ASA_RETURNING = vendor('cisco-asa-access-rules', 'Extended Access Rules for Returning Traffic', 'For TCP, UDP, and SCTP connections');
const CISCO_ASA_ICMP = vendor('cisco-asa-access-rules', 'Extended Access Rules for Returning Traffic', 'For connectionless protocols such as ICMP');
const CISCO_ASA_TIMEOUTS = vendor('cisco-asa-connections', 'Configure Global Timeouts', 'You can set the global idle timeout durations');
const CISCO_ASA_IDLE = vendor('cisco-asa-connections', 'Configure Global Timeouts', 'The idle time after which a connection closes');
const CISCO_FMC_ORDER = vendor('cisco-fmc-access-rules', 'Access control rule order', 'The system matches traffic to rules in top-down order');
const CISCO_FMC_PREEMPTION = vendor('cisco-fmc-access-rules', 'Rule preemption', 'Rule preemption is a policy evaluation condition');
const CISCO_FMC_BLOCK = vendor('cisco-fmc-access-rules', 'Access control rule blocking actions', 'Block and Block with reset actions immediately stop traffic');
const CISCO_FMC_SPECIFIC = vendor('cisco-fmc-access-rules', 'Access control rule order', 'Access control rules that use specific conditions');

// Microsoft
const MS_WF_HOST = vendor('microsoft-windows-firewall', 'Windows Firewall overview', 'Windows Firewall is a host-based firewall');
const MS_WF_CRITERIA = vendor('microsoft-windows-firewall', 'Windows Firewall overview', 'This traffic can be filtered based on several criteria');
const MS_WF_DEFAULT = vendor('microsoft-windows-firewall', 'Concepts', 'The default behavior of Windows Firewall is to');
const MS_WF_PRECEDENCE = vendor('microsoft-windows-firewall-rules', 'Rule precedence for inbound and outbound rules', 'Explicit block rules take precedence');
const MS_WF_OPEN = vendor('microsoft-windows-firewall-rules', 'Applications rules', 'Allowing all inbound connections by default introduces');
const MS_NSG_ORDER = vendor('microsoft-azure-nsg', 'Security rules', 'Rules are processed in priority order');
const MS_NSG_STATEFUL = vendor('microsoft-azure-nsg', 'Security rules', 'The flow record allows a network security group to be stateful');
const MS_AZURE_NETWORK_RULES = vendor('microsoft-azure-firewall-rule-sets', 'Network rules', 'Network rules control inbound, outbound, and east-west traffic');
const MS_ADDRESSES_CHANGE = vendor('microsoft-azure-network-best-practices', 'Logically segment subnets', 'Define an application security group for lists of IP addresses that you think might change');
const MS_VPN = vendor('microsoft-azure-network-best-practices', 'Disable RDP and SSH access to virtual machines', 'Point-to-site VPN is more secure than direct RDP or SSH connections');

// Palo Alto Networks
const PA_STATEFUL_TYPE = vendor('paloalto-firewall-types', 'Stateful Inspection Firewall', 'Located at Layers 3 and 4 of the Open Systems Interconnection');
const PA_STATEFUL_WORKS = vendor('paloalto-stateful-firewall', 'How Does Stateful Inspection Work?', 'If a packet does not match an existing connection');
const PA_STATELESS = vendor('paloalto-stateful-firewall', 'Stateful vs. Stateless Firewalls', 'Stateless firewalls inspect each data packet independently');
const PA_RULES_ORDER = vendor('paloalto-firewall-rules', 'Firewall Rules Order', 'The ordering of firewall rules is important');
const PA_RULES_ACL = vendor('paloalto-firewall-rules', 'How Do Firewall Rules Work?', 'In enterprise environments');
const PA_RULEBASE = vendor('paloalto-rulebase-best-practices', 'Security Policy Rulebase Best Practices', 'Firewalls compare traffic to Security policy rules');
const PA_SPECIFIC_FIRST = vendor('paloalto-rulebase-best-practices', 'Security Policy Rulebase Best Practices', 'The logic for all other rules is to place the most specific rules');
const PA_SHADOWING = vendor('paloalto-rulebase-best-practices', 'Security Policy Rulebase Best Practices', 'Shadowing is when you place a broad rule');
const PA_DENY_ACTION = vendor('paloalto-security-rules', 'Action', 'When you configure your environment to deny traffic');
const PA_DEFAULT_RULES = vendor('paloalto-security-rules', 'Action', 'default rules apply');
const PA_PERIMETER = vendor('paloalto-firewall', 'Perimeter firewall', 'Placed at the edge of a network to manage traffic entering or leaving');
const PA_HOST = vendor('paloalto-firewall', 'Host-based firewall', 'Installed on a specific device to monitor traffic');
const PA_NGFW = vendor('paloalto-ngfw', 'How does an NGFW work?', 'NGFWs operate at higher layers of the OSI model');

// Google Cloud and Cloudflare
const GOOGLE_SHADOWED = vendor('google-cloud-firewall-insights', 'Shadowed rules', 'Shadowed rules share attributes');
const CLOUDFLARE_HISTORY = vendor('cloudflare-firewall', 'What is the history of firewalls?', 'They decided which packets to allow and which to block by inspecting their network layer and transport layer headers');

// ---------------------------------------------------------------- events

/** A visit’s message and the table row that remembers it, each tracing to Learn parts. */
const CONNECTION = { traces: ['term-stateful', 'fact-stateful', 'fact-ports', 'fact-order'] };
const RULE_LIST = { traces: ['term-rule', 'term-shadowed', 'fact-ports'] };
const FORGOTTEN = { traces: ['term-stateful', 'fact-stateful'] };
const RULE_CHANGED = { traces: ['term-rule', 'term-shadowed'] };

/** The visits and the reply of this lesson, and the parts of Learn each message traces to. */
const { visit: makeVisit, reply: makeReply } = visits();

/** A visit: its message traces to `traces`, and the row that remembers it to the connection facts. */
function visit(traces: string[], o: Parameters<typeof makeVisit>[0]): SceneEvent[] {
  return makeVisit(o).map((e) => ({ ...e, backing: e.type === 'message' ? { traces } : CONNECTION }));
}

function reply(traces: string[], o: Parameters<typeof makeReply>[0]): SceneEvent[] {
  return makeReply(o).map((e) => ({ ...e, backing: { traces } }));
}

/** A change to the rule list: the rows, the forgotten connections and the note each trace to what states them. */
function ruleChange(o: Parameters<typeof change>[0]): SceneEvent[] {
  const backings: Backing[] = [RULE_LIST, FORGOTTEN, RULE_CHANGED];
  return change(o).map((e, i) => ({ ...e, backing: backings[i]! }));
}

// ---------------------------------------------------------------- lesson

const firewalls = defineLesson({
  slug: 'firewalls',
  title: 'Firewalls',
  subtitle: 'Deciding what gets in',
  level: 'beginner',
  certTags: ['network-plus', 'security-plus', 'ccna', 'soc-analyst'],
  summary: 'Watch a firewall check each connection against its list of rules, from the top down, and see why the order of the rules matters.',
  figure: 'firewall',
  backing: { traces: ['term-firewall', 'term-rule', 'term-first-match', 'term-shadowed', 'fact-order'] },
  units: [
    {
      id: 'firewalls',
      name: 'Firewall',
      fullName: 'Network firewall',
      purpose: 'A guard for your network',
      osi: { layers: [3, 4], cite: [PA_STATEFUL_TYPE, MS_AZURE_NETWORK_RULES, CLOUDFLARE_HISTORY] },
      backing: { traces: ['term-firewall', 'deep-where'] },
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
        backing: {
          traces: ['term-firewall', 'term-rule', 'term-port', 'term-source', 'term-first-match', 'term-default-deny', 'term-stateful', 'term-shadowed', 'fact-ports', 'fact-logins', 'fact-reads'],
        },
      },
      overview: {
        hook: 'Picture a guard at the gate of an office. Before anyone comes in, the guard checks a list: visitors may come to the front desk, the IT team may use the back door, and everyone else stays outside. A firewall is that guard for a network. Every visit that tries to reach a computer is checked against a list of rules, then let in or turned away.',
        hookBacking: { traces: ['term-firewall', 'term-rule', 'term-first-match', 'fact-order', 'term-default-deny', 'term-source'] },
        description:
          'A firewall stands between a network and the outside world and decides what may pass. It reads its rules from the top, and the first rule that fits decides. The rules in this lesson look at where a visit comes from and which door, called a port, it asks for.',
        backing: { traces: ['term-firewall', 'term-first-match', 'fact-order', 'term-source', 'term-port'] },
        facts: [
          { label: 'Works with', value: 'Addresses and ports (layers 3 and 4)', backing: { traces: ['deep-types', 'fact-reads'] } },
          { label: 'Reads rules', value: 'Top to bottom, first match wins', backing: { traces: ['fact-order'] } },
          { label: 'Recommended default', value: 'Block anything not allowed', backing: { traces: ['fact-default', 'term-default-deny'] } },
          { label: 'Remembers', value: 'The connections it let in (stateful)', backing: { traces: ['term-stateful', 'fact-stateful'] } },
          { label: 'Common types', value: 'Packet filter, stateful, next-generation', backing: { traces: ['deep-types'] } },
        ],
      },
      steps: [
        {
          id: 'rule-evaluation',
          title: 'Rule Evaluation',
          sub: 'The firewall reads its list from the top',
          narrative:
            'A visitor out on the internet asks for the office website. Before the visit goes in, the firewall checks it against its **rule list**, starting at rule 1. Each rule says **allow** or **deny** for one kind of visit. Rule 1 says anyone may reach the website, which answers at door number 443. Door numbers like this are called **ports**. The visit fits, so the arms lift and it goes through. Rules 2 and 3 are never read.',
          deep: [
            {
              text: 'The visit is the first packet of a TCP connection, called a SYN.',
              cite: [d('rfc-9293', '3.5'), d('rfc-9293', '3.1')],
            },
            {
              text: 'The firewall reads the source and destination addresses in its IP header and the destination port in its TCP header.',
              cite: [d('rfc-791', '3.1'), d('rfc-9293', '3.1'), NIST_FILTER],
            },
            {
              text: 'Port 443 is HTTPS.',
              cite: [d('rfc-9110', '4.2.2'), IANA_PORTS],
            },
            {
              text: 'The web server’s address, 10.0.0.10, is private, so in real life the visit reaches it through NAT.',
              cite: [d('rfc-1918', '3'), NIST_NAT, d('rfc-3022', '2.2')],
            },
          ],
          facts: [
            { label: 'Visit', value: 'TCP port 443 from 203.0.113.50', backing: { traces: ['fact-ports', 'term-source'] } },
            { label: 'Rule 1', value: 'ALLOW TCP 443, any source', backing: { traces: ['term-rule', 'fact-ports', 'term-source'] } },
            { label: 'Result', value: 'Allowed by rule 1', backing: { traces: ['term-first-match', 'term-rule'] } },
            { label: 'Rules read', value: '1 of 3', backing: { traces: ['term-first-match'] } },
          ],
          events: visit(['fact-ports', 'term-port', 'term-first-match', 'term-rule', 'term-source', 'term-firewall'], {
            id: 'visit-website',
            who: 'visitor',
            tag: 'HTTPS 443',
            port: 443,
            svc: 'HTTPS',
            sport: 50432,
            rules: 'base',
            plain: 'The visitor asks for the website.',
          }),
          backing: { traces: ['term-firewall', 'term-rule', 'term-port', 'term-first-match', 'fact-ports', 'fact-default', 'term-default-deny', 'term-stateful', 'fact-stateful'] },
        },
        {
          id: 'first-match',
          title: 'First-Match Rule',
          sub: 'The first rule that fits decides',
          narrative:
            'Now the visitor knocks on a different door: port 22, used to log in to a server and control it from far away. The firewall starts at the top again. Rule 1 is for port 443, so it doesn’t fit. Rule 2 is for port 22, but only from the admin’s address, so it doesn’t fit either. Rule 3 fits everything, and it says deny. The **first rule that fits** decides, so the visit is turned away.',
          deep: [
            {
              text: 'Port 22 is SSH, a secure way to log in to a computer over the network.',
              cite: [d('rfc-4251', '1'), IANA_PORTS],
            },
            {
              text: 'Most firewalls stop at the first rule that matches.',
              cite: [NIST_CONFIG, PA_RULES_ORDER, CISCO_ASA_ORDER, CISCO_FMC_ORDER, MS_NSG_ORDER],
            },
            {
              text: 'Some products sort their rules in other ways, so check yours.',
              cite: [NIST_CONFIG, MS_WF_PRECEDENCE],
            },
            {
              text: 'A blocked visit can be dropped without a word or refused with a reply.',
              cite: [PA_DENY_ACTION, CISCO_FMC_BLOCK],
            },
          ],
          facts: [
            { label: 'Visit', value: 'TCP port 22 from 203.0.113.50', backing: { traces: ['fact-ports', 'term-source'] } },
            { label: 'Rule 1', value: 'Doesn’t fit: wrong port', backing: { traces: ['term-first-match', 'term-port'] } },
            { label: 'Rule 2', value: 'Doesn’t fit: wrong source', backing: { traces: ['term-first-match', 'term-source'] } },
            { label: 'Result', value: 'Denied by rule 3', backing: { traces: ['term-first-match', 'term-default-deny'] } },
          ],
          events: visit(['fact-ports', 'fact-logins', 'term-first-match', 'term-default-deny', 'fact-default', 'term-rule', 'term-source', 'term-firewall'], {
            id: 'visit-login',
            who: 'visitor',
            tag: 'SSH 22',
            port: 22,
            svc: 'SSH',
            sport: 50433,
            rules: 'base',
            plain: 'The visitor tries the login door.',
          }),
          backing: { traces: ['term-first-match', 'term-source', 'term-port', 'term-default-deny', 'fact-default', 'fact-ports', 'fact-logins'] },
        },
        {
          id: 'source-filtering',
          title: 'Source Filtering',
          sub: 'One trusted address gets in',
          narrative:
            'The admin looks after the server and needs to log in to it on port 22 too. Rule 2 opens that door, but only for one address: the admin’s, 198.51.100.7. The address a visit comes from is called its **source**. The admin’s visit doesn’t fit rule 1, but it fits rule 2, so it goes through. The door that stayed shut for the visitor opens for the admin.',
          deep: [
            {
              text: '198.51.100.7/32 means exactly one address: all 32 bits must match (the Subnetting lesson covers the slash).',
              cite: [d('rfc-4632', '3.1')],
            },
            {
              text: 'A rule that names an address only works while that address stays the same.',
              cite: [NIST_FILTER, MS_WF_CRITERIA, MS_ADDRESSES_CHANGE],
            },
            {
              text: 'Admin logins from outside are safer through a VPN.',
              cite: [NIST_SERVER_SECURITY, MS_VPN],
            },
          ],
          facts: [
            { label: 'Visit', value: 'TCP port 22 from 198.51.100.7', backing: { traces: ['fact-ports', 'term-source'] } },
            { label: 'Rule 2', value: 'ALLOW TCP 22, source 198.51.100.7/32', backing: { traces: ['term-rule', 'fact-ports', 'term-source'] } },
            { label: 'Result', value: 'Allowed by rule 2', backing: { traces: ['term-first-match', 'term-rule'] } },
          ],
          events: visit(['fact-ports', 'fact-logins', 'term-source', 'term-first-match', 'term-rule', 'term-firewall'], {
            id: 'admin-login',
            who: 'admin',
            tag: 'SSH 22',
            port: 22,
            svc: 'SSH',
            sport: 51876,
            rules: 'base',
            plain: 'The admin logs in from a named address.',
          }),
          backing: { traces: ['term-source', 'term-first-match', 'fact-ports', 'fact-logins', 'term-stateful', 'fact-stateful'] },
        },
        {
          id: 'default-deny',
          title: 'Default Deny',
          sub: 'Whatever nothing allows is blocked',
          narrative:
            'The visitor tries port 23, an old way to log in that sends everything as plain text. Nobody wrote a rule about port 23. It doesn’t fit rule 1 or rule 2, so it falls to the last rule, Block everything else, and it’s turned away. Allowing only what you need and blocking the rest is called **default deny**. If someone forgets to write a rule, that door stays shut.',
          deep: [
            {
              text: 'Port 23 is Telnet.',
              cite: [IANA_PORTS],
            },
            {
              text: 'NIST’s firewall guidance (SP 800-41) recommends default deny.',
              cite: [NIST_POLICY_DEFINING, PA_RULEBASE],
            },
            {
              text: 'Many firewalls end every list with an invisible deny, often called the implicit deny, but not all do, so when you inherit a rule list, read its last rule.',
              cite: [CISCO_ASA_IMPLICIT, CISCO_ASA_MANAGEMENT, PA_RULEBASE, PA_DEFAULT_RULES, MS_WF_DEFAULT],
            },
          ],
          facts: [
            { label: 'Visit', value: 'TCP port 23 (Telnet) from 203.0.113.50', backing: { traces: ['fact-ports', 'term-source'] } },
            { label: 'Rules that fit', value: 'Rule 3 only', backing: { traces: ['term-first-match', 'term-default-deny'] } },
            { label: 'Result', value: 'Denied by rule 3', backing: { traces: ['term-first-match', 'term-default-deny'] } },
          ],
          events: visit(['fact-ports', 'fact-logins', 'term-default-deny', 'fact-default', 'term-first-match', 'term-rule', 'term-source', 'term-firewall'], {
            id: 'visit-telnet',
            who: 'visitor',
            tag: 'TELNET 23',
            port: 23,
            svc: 'Telnet',
            sport: 50434,
            rules: 'base',
            plain: 'The visitor tries an old, unsafe door.',
          }),
          backing: { traces: ['term-default-deny', 'fact-default', 'term-first-match', 'fact-ports', 'fact-logins', 'why-2'] },
        },
        {
          id: 'stateful',
          title: 'Stateful Inspection',
          sub: 'Replies to allowed visits get back out',
          narrative:
            'The web server answers the visitor’s website visit, and that reply has to cross the firewall too. No rule allows anything going out to the visitor. But the firewall keeps a list of the **connections** it let in, and this reply belongs to one of them, so it passes without a rule of its own. A firewall that remembers connections like this is called **stateful**.',
          deep: [
            {
              text: 'The connection table records each allowed connection’s addresses and ports, here 203.0.113.50:50432 to 10.0.0.10:443, and drops the entry when the connection closes or goes quiet.',
              cite: [NIST_STATE_TABLE, NIST_STATE_TIMEOUT, CISCO_ASA_TIMEOUTS, CISCO_ASA_IDLE, PA_STATEFUL_WORKS],
            },
            {
              text: 'A packet filter without state judges each packet alone, so it would need a rule for the replies too.',
              cite: [NIST_STATELESS, PA_STATELESS, CISCO_ASA_ICMP, MS_NSG_STATEFUL],
            },
            {
              text: 'Almost every modern firewall is stateful.',
              cite: [NIST_FILTER, NIST_FILTER_STATE, CISCO_STATEFUL, CISCO_NGFW],
            },
          ],
          facts: [
            { label: 'Reply', value: 'From 10.0.0.10 port 443, to 203.0.113.50', backing: { traces: ['fact-ports', 'term-stateful'] } },
            { label: 'Why it passes', value: 'It belongs to a connection rule 1 allowed', backing: { traces: ['term-stateful', 'fact-stateful'] } },
            { label: 'Rules read', value: 'None', backing: { traces: ['term-stateful', 'fact-stateful'] } },
          ],
          events: reply(['term-stateful', 'fact-stateful', 'fact-ports', 'term-port', 'term-source', 'term-firewall'], {
            id: 'reply-website',
            of: 'visit-website',
            tag: 'REPLY 443',
            plain: 'The server answers a known connection.',
          }),
          backing: { traces: ['term-stateful', 'fact-stateful', 'fact-ports'] },
        },
        {
          id: 'shadowing',
          title: 'Rule Shadowing',
          sub: 'A catch-all at the top blocks everything',
          narrative:
            'The next day, someone tidies the list and moves Block everything else to the top. The visitor comes back to the website. The firewall reads rule 1 first, and it now fits everything and says deny. The visit is blocked, and the allow rules below never get a turn. A rule that can never be reached is called **shadowed**. That’s why the catch-all always goes last.',
          deep: [
            {
              text: 'Rule audits look for shadowed rules: rules hidden by a broader one above them.',
              cite: [PA_SHADOWING, GOOGLE_SHADOWED, NIST_MANAGE],
            },
            {
              text: 'Put the most specific rules first and the broadest last.',
              cite: [PA_SPECIFIC_FIRST, PA_RULES_ORDER, CISCO_FMC_SPECIFIC],
            },
            {
              text: 'Yesterday’s connections have closed, so today’s visit is a new connection and the rules are read again.',
              cite: [NIST_STATE_TABLE, NIST_STATE_TIMEOUT, PA_STATEFUL_WORKS],
            },
          ],
          facts: [
            { label: 'Change', value: 'Block everything else moved to rule 1', backing: { traces: ['term-rule', 'term-shadowed'] } },
            { label: 'Visit', value: 'TCP port 443 from 203.0.113.50', backing: { traces: ['fact-ports', 'term-source'] } },
            { label: 'Result', value: 'Denied by the new rule 1', backing: { traces: ['term-first-match', 'term-shadowed'] } },
            { label: 'Never read', value: 'The allow rules, now 2 and 3', backing: { traces: ['term-first-match', 'term-shadowed'] } },
          ],
          events: [
            ...ruleChange({ id: 'move-catch-all', rules: 'shadow', plain: 'Block everything else moves to the top.' }),
            ...visit(['fact-ports', 'term-first-match', 'term-shadowed', 'term-rule', 'term-source', 'term-firewall'], {
              id: 'visit-website-again',
              who: 'visitor',
              tag: 'HTTPS 443',
              port: 443,
              svc: 'HTTPS',
              sport: 50511,
              rules: 'shadow',
              plain: 'The visitor comes back to the website.',
            }),
          ],
          backing: { traces: ['term-shadowed', 'term-first-match', 'fact-order', 'term-rule', 'fact-stateful', 'fact-ports', 'fact-catch-all'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'Five visits and one reply reached the firewall. For each visit, it read its list from the top and stopped at the first rule that fit. Here is what each part was, and what it’s called.',
            cite: [NIST_CONFIG, PA_RULEBASE, CISCO_ASA_ORDER],
          },
        ],
        terms: [
          {
            id: 'term-firewall',
            idea: 'A guard that decides what may pass between a network and the outside',
            name: 'Firewall',
            cite: [NIST_OVERVIEW, CISCO_DEFINITION, CISCO_DECIDES],
          },
          {
            id: 'term-rule',
            idea: 'One line on the list: allow or block one kind of visit',
            name: 'Rule',
            cite: [NIST_CONFIG, CISCO_DECIDES, PA_RULES_ACL],
          },
          {
            id: 'term-port',
            idea: 'The door number a service answers at, like 443 for websites',
            name: 'Port',
            cite: [NIST_OVERVIEW, d('rfc-9110', '4.2.2'), IANA_PORTS],
          },
          {
            id: 'term-source',
            idea: 'The address a visit comes from (a rule can name one exact address, written /32)',
            name: 'Source',
            cite: [NIST_FILTER, MS_WF_CRITERIA, d('rfc-791', '3.1'), d('rfc-4632', '3.1')],
          },
          {
            id: 'term-first-match',
            idea: 'Reading from the top and stopping at the first rule that fits',
            name: 'First match',
            cite: [NIST_CONFIG, CISCO_ASA_ORDER, PA_RULEBASE],
          },
          {
            id: 'term-default-deny',
            idea: 'Blocking whatever no rule allows, also called deny by default',
            name: 'Default deny',
            cite: [NIST_POLICY, NIST_GLOSSARY, PA_RULEBASE, CISCO_ASA_IMPLICIT],
          },
          {
            id: 'term-stateful',
            idea: 'Remembering the connections it let in, so their replies get back out',
            name: 'Stateful',
            cite: [NIST_STATE_TABLE, CISCO_ASA_RETURNING, MS_NSG_STATEFUL],
          },
          {
            id: 'term-shadowed',
            idea: 'A rule that never gets a turn, because one above it catches all its traffic first',
            name: 'Shadowed rule',
            cite: [PA_SHADOWING, GOOGLE_SHADOWED, CISCO_FMC_PREEMPTION],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Rule Evaluation', 'First-Match Rule', 'Default Deny', 'Stateful Inspection'],
          note: 'Every visit: read from the top, stop at the first rule that fits, block whatever nothing allows, and let replies to allowed connections back out.',
          cite: [NIST_CONFIG, NIST_POLICY, NIST_GLOSSARY, PA_RULEBASE, CISCO_ASA_ORDER, CISCO_ASA_RETURNING],
        },
        why: [
          {
            id: 'why-1',
            text: 'Without a firewall, every service on a computer the internet can reach would be open to anyone, including ones nobody meant to share.',
            cite: [NIST_OVERVIEW, MS_WF_OPEN],
          },
          {
            id: 'why-2',
            text: 'A short list, read from the top, opens only the doors you need.',
            cite: [NIST_POLICY, NIST_CONFIG, PA_RULEBASE],
          },
        ],
        deep: [
          {
            id: 'deep-acl',
            text: 'Rule lists are also called access control lists (ACLs).',
            cite: [NIST_FILTER, PA_STATELESS, PA_RULES_ACL, CISCO_ASA_ORDER],
          },
          {
            id: 'deep-types',
            text: 'A packet filter reads addresses and ports (layers 3 and 4), a stateful firewall adds a connection table, and a next-generation firewall also looks inside the traffic at the application.',
            cite: [
              NIST_FILTER,
              NIST_STATE_TABLE,
              NIST_APPLICATION,
              CISCO_PACKET_FILTER,
              CISCO_STATEFUL,
              CISCO_NGFW_TYPE,
              CISCO_NGFW,
              PA_STATEFUL_TYPE,
              PA_NGFW,
              MS_AZURE_NETWORK_RULES,
            ],
          },
          {
            id: 'deep-where',
            text: 'Network firewalls guard the edge of a network; host firewalls, like the one built into Windows, guard one computer.',
            cite: [NIST_PERIMETER, NIST_HOST, MS_WF_HOST, PA_HOST, PA_PERIMETER],
          },
        ],
        facts: [
          { id: 'fact-reads', label: 'Reads', value: 'Source, destination, protocol, port', cite: [NIST_FILTER, CISCO_PACKET_FILTER] },
          { id: 'fact-order', label: 'Order', value: 'Top to bottom, first match wins', cite: [NIST_CONFIG, CISCO_ASA_ORDER, CISCO_FMC_ORDER, PA_RULES_ORDER, PA_RULEBASE] },
          { id: 'fact-default', label: 'Recommended default', value: 'Deny anything not allowed', cite: [NIST_POLICY, PA_RULEBASE, CISCO_ASA_IMPLICIT, MS_WF_OPEN] },
          {
            id: 'fact-stateful',
            label: 'Stateful',
            value: 'Tracks the connections it allowed, until they close or go quiet',
            cite: [NIST_STATE_TABLE, NIST_STATE_TIMEOUT, CISCO_ASA_TIMEOUTS, CISCO_ASA_IDLE],
          },
          { id: 'fact-acl', label: 'Also called', value: 'Access control list (ACL)', cite: [NIST_FILTER, PA_STATELESS, PA_RULES_ACL, CISCO_ASA_ORDER] },
          {
            id: 'fact-ports',
            label: 'Ports here',
            value: 'TCP 443 HTTPS, TCP 22 SSH, TCP 23 Telnet',
            cite: [IANA_PORTS, d('rfc-9110', '4.2.2')],
          },
          {
            id: 'fact-logins',
            label: 'Remote logins',
            value: 'SSH is for logging in to and managing a computer from far away, and it is encrypted; Telnet, older and far less safe, sends plain text',
            cite: [d('rfc-4251', '1'), cite('rfc-4251', '4.1'), NIST_IR_BASICS, NIST_SERVER_SECURITY, NIST_SERVER_HARDENING, CLOUDFLARE_TELNET],
          },
          { id: 'fact-catch-all', label: 'Catch-all rule', value: 'Last, below the more specific rules', cite: [PA_SPECIFIC_FIRST, PA_RULES_ORDER, CISCO_FMC_SPECIFIC] },
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
              cite: [NIST_POLICY, NIST_CONFIG, PA_RULEBASE, CISCO_ASA_ORDER],
            },
            {
              text: 'It gets through, because no rule mentions port 8080.',
              feedback: 'Not quite. With default deny, a door nobody opened stays shut. Block everything else stops it.',
              cite: [NIST_POLICY, PA_RULEBASE, CISCO_ASA_IMPLICIT],
            },
            {
              text: 'The firewall asks the admin what to do.',
              feedback: 'Not quite. The firewall decides on its own, from its list. Block everything else stops it.',
              cite: [NIST_CONFIG, CISCO_DECIDES, PA_RULEBASE],
            },
          ],
          answer: 0,
        },
        {
          id: 'two-rules',
          prompt: 'A list read from the top has two rules. Rule 1: allow port 22 from anyone. Rule 2: deny port 22 from 203.0.113.50. Can 203.0.113.50 log in on port 22?',
          options: [
            {
              text: 'Yes. Rule 1 fits first, so rule 2 is never read.',
              feedback: 'That’s it. The first rule that fits decides. Swap the two rules and the login would be blocked.',
              cite: [NIST_CONFIG, CISCO_ASA_ORDER, PA_RULEBASE],
            },
            {
              text: 'No. Rule 2 names its exact address, so it wins.',
              feedback: 'Not quite. Being more exact doesn’t win; being higher up does. Rule 1 fits first.',
              cite: [CISCO_ASA_ORDER, PA_RULES_ORDER, PA_RULEBASE],
            },
            {
              text: 'No. Deny always beats allow.',
              feedback: 'Not quite. Neither word beats the other. The first rule that fits decides, and that’s rule 1.',
              cite: [CISCO_ASA_ORDER, PA_RULES_ORDER, PA_RULEBASE],
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
              cite: [NIST_STATE_TABLE, PA_STATEFUL_WORKS, CISCO_ASA_RETURNING],
            },
            {
              text: 'It belonged to a connection the firewall had already let in.',
              feedback: 'Yes. A stateful firewall remembers the connections it allowed and lets their replies through.',
              cite: [NIST_STATE_TABLE, CISCO_ASA_RETURNING, MS_NSG_STATEFUL],
            },
            {
              text: 'The Website rule allows everything to and from port 443.',
              feedback: 'Not quite. The Website rule is for visits coming in. The reply passed because it belonged to a connection the firewall remembered.',
              cite: [NIST_STATE_TABLE, CISCO_ASA_RETURNING, MS_NSG_STATEFUL],
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
