import { defineGlossaryGroup } from '../glossary-group';
import { cite, SOURCES } from '../sources';

/**
 * The glossary group filtering (job 10, batch 2): twelve entries on what a firewall looks at and decides, the
 * ports and addresses it reads, and NAT. Written from the analyst's report and the orchestrator's rulings in it.
 * NIST SP 800-41 Rev. 1 has no section anchors, so a section is cited by the PDF page its passage is on; a vendor's
 * page has none either, so a section is cited by a text fragment that starts in it. A citation is marked defining
 * only where the document defines the thing the statement is about: never NIST, a vendor page, RFC 6335, RFC 3022,
 * RFC 4787 or RFC 8200 here.
 */

const d = (source: string, section: string) => cite(source, section, { defining: true });
const rfc = (source: string, section: string) => cite(source, section);

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

const NIST_PDF = 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf';
const nist = (section: string, page: number) => cite('nist-sp800-41r1', section, { url: `${NIST_PDF}#page=${page}` });
const NIST_OVERVIEW = nist('2', 11);
const NIST_PERIMETER = nist('2.1', 12);
const NIST_FILTER = nist('2.1.1', 12);
const NIST_STATE_TABLE = nist('2.1.2', 14);
const NIST_HOST = nist('2.2.1', 20);
const NIST_NAT = nist('3.2', 25);
const NIST_POLICY = nist('4', 28);
const NIST_PRIVATE = nist('4.1.1', 29);
const NIST_CONFIG = nist('5.2.2', 38);
const NIST_GLOSSARY = nist('Appendix A', 43);

const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

const PA_WHAT = vendor('paloalto-firewall', 'What Is a Firewall?', 'Firewalls act as barriers between private and external networks');
const PA_HOW = vendor('paloalto-firewall', 'What do firewalls do, and how do they work?', 'a firewall uses rules to make those decisions');
const PA_PERIMETER = vendor('paloalto-firewall', 'Perimeter firewall', 'Placed at the edge of a network to manage traffic entering or leaving');
const PA_HOST = vendor('paloalto-firewall', 'Host-based firewall', 'Installed on a specific device to monitor traffic');
const PA_RULES_ACL = vendor('paloalto-firewall-rules', 'How Do Firewall Rules Work?', 'In enterprise environments');
const PA_RULES_WHAT = vendor('paloalto-firewall-rules', 'What Are Firewall Rules?', 'Firewall rules are specifications set by network administrators');
const PA_RULES_ORDER = vendor('paloalto-firewall-rules', 'Firewall Rules Order', 'The ordering of firewall rules is important');
const PA_RULES_CATCHALL = vendor('paloalto-firewall-rules', 'Firewall Rules Order', 'Catch-All Deny Rule');
const PA_RULEBASE = vendor('paloalto-rulebase-best-practices', 'Security Policy Rulebase Best Practices', 'Firewalls compare traffic to Security policy rules');
const PA_RULEBASE_ORDER = vendor('paloalto-rulebase-best-practices', 'Security Policy Rulebase Best Practices', 'The way you order the rules in the rulebase is critical');
const PA_SHADOWING = vendor('paloalto-rulebase-best-practices', 'Security Policy Rulebase Best Practices', 'Shadowing is when you place a broad rule');
const PA_SHADOW_RESULT = vendor('paloalto-rulebase-best-practices', 'Security Policy Rulebase Best Practices', 'The result is that the firewall executes the action');
const PA_STATEFUL = vendor('paloalto-stateful-firewall', 'Stateful vs. Stateless Firewalls', 'Stateful firewalls, in contrast');
const PA_STATEFUL_WORKS = vendor('paloalto-stateful-firewall', 'How Do Stateful Firewalls Work?', 'If the packet is part of an existing, approved connection');
const PA_STATELESS = vendor('paloalto-stateful-firewall', 'Stateful vs. Stateless Firewalls', 'Stateless firewalls inspect each data packet independently');

const MS_WF_WHAT = vendor('microsoft-windows-firewall', 'Windows Firewall overview', 'Windows Firewall is a security feature');
const MS_WF_CRITERIA = vendor('microsoft-windows-firewall', 'Windows Firewall overview', 'This traffic can be filtered based on several criteria');
const MS_WF_HOST = vendor('microsoft-windows-firewall', 'Windows Firewall overview', 'Windows Firewall is a host-based firewall');
const MS_WF_RULES = vendor('microsoft-windows-firewall', 'Firewall rules', 'Firewall rules identify allowed or blocked network traffic');
const MS_WF_RULES_MATCH = vendor('microsoft-windows-firewall', 'Firewall rules', 'Protocol name or type');
const MS_WF_PRECEDENCE = vendor('microsoft-windows-firewall-rules', 'Rule precedence for inbound and outbound rules', 'Explicit block rules take precedence');
const MS_WF_OPEN = vendor('microsoft-windows-firewall-rules', 'Applications rules', 'Allowing all inbound connections by default introduces');
const MS_NSG_ORDER = vendor('microsoft-azure-nsg', 'Security rules', 'Rules are processed in priority order');
const MS_NSG_STATEFUL = vendor('microsoft-azure-nsg', 'Security rules', 'The flow record allows a network security group to be stateful');
const MS_NSG_DEFAULT = vendor('microsoft-azure-nsg', 'Default security rules', 'Azure default security rules are given the lowest priority');
const MS_AZURE_DENIED = vendor('microsoft-azure-firewall-rule-sets', 'Rules', 'If no rule allows the traffic');

const GOOGLE_SHADOWED = vendor('google-cloud-firewall-insights', 'Shadowed rules', 'Shadowed rules share attributes');
const GOOGLE_MISCONFIG = vendor(
  'google-cloud-firewall-insights',
  'Examples of shadowed rules',
  'The shadowed firewall rules insight usually indicates',
);

const R768 = 'https://www.rfc-editor.org/rfc/rfc768.html';
const R768_SOURCE = cite('rfc-768', 'Fields', { url: `${R768}#:~:text=indicates%20the%20port%20of%20the%20sending%20process`, defining: true });
const R768_DEST = cite('rfc-768', 'Fields', { url: `${R768}#:~:text=Destination%20Port%20has%20a%20meaning`, defining: true });
const R3022_ABSTRACT = cite('rfc-3022', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc3022.html#abstract' });
const R3022_PUBLIC = cite('rfc-3022', 'Abstract', {
  url: 'https://www.rfc-editor.org/rfc/rfc3022.html#:~:text=globally%20unique%20registered%20addresses',
});

export default defineGlossaryGroup({
  id: 'filtering',
  entries: [
    {
      id: 'firewall',
      term: 'Firewall',
      definition: [
        {
          id: 'firewall-1',
          text: 'A firewall is a device or program that controls which network traffic may pass between networks or computers.',
          cite: [NIST_OVERVIEW, PA_WHAT, MS_WF_WHAT],
        },
        {
          id: 'firewall-2',
          text: 'It checks traffic against its rules, which look at details such as addresses, protocols and ports, and allows or blocks it.',
          cite: [PA_HOW, NIST_FILTER, MS_WF_CRITERIA],
        },
        {
          id: 'firewall-3',
          text: 'It may guard the edge of a network or run as software on one computer, as Windows Firewall does.',
          cite: [NIST_PERIMETER, NIST_HOST, PA_PERIMETER, PA_HOST, MS_WF_HOST],
        },
      ],
      lessons: [{ lesson: 'firewalls', term: 'term-firewall' }],
    },
    {
      id: 'firewall-rule',
      term: 'Firewall rule',
      definition: [
        {
          id: 'firewall-rule-1',
          text: 'A firewall rule is one entry in a firewall’s list of rules: it describes some traffic and says whether to allow or block it.',
          cite: [PA_RULES_ACL, MS_WF_RULES, NIST_CONFIG],
        },
        {
          id: 'firewall-rule-2',
          text: 'It describes the traffic by details such as source and destination addresses, ports and protocol.',
          cite: [PA_RULES_WHAT, MS_WF_RULES_MATCH, NIST_CONFIG],
        },
        { id: 'firewall-rule-3', text: 'On many firewalls, the order of the rules matters.', cite: [NIST_CONFIG, PA_RULES_ORDER] },
      ],
      lessons: [{ lesson: 'firewalls', term: 'term-rule' }],
    },
    {
      id: 'first-match',
      term: 'First match',
      definition: [
        {
          id: 'first-match-1',
          text: 'First match is how many firewalls read their rules: from the top down, stopping at the first rule that fits the traffic and taking its action.',
          cite: [NIST_CONFIG, PA_RULEBASE, MS_NSG_ORDER],
        },
        {
          id: 'first-match-2',
          text: 'Rules further down are not checked for that traffic, so the order of the rules matters.',
          cite: [PA_RULEBASE_ORDER, MS_NSG_ORDER, NIST_CONFIG],
        },
        {
          id: 'first-match-3',
          text: 'Some firewalls sort rules in other ways, for example checking block rules before allow rules.',
          cite: [NIST_CONFIG, MS_WF_PRECEDENCE],
        },
      ],
      lessons: [{ lesson: 'firewalls', term: 'term-first-match' }],
    },
    {
      id: 'default-deny',
      term: 'Default deny',
      also: ['Deny by default'],
      definition: [
        {
          id: 'default-deny-1',
          text: 'Default deny, or deny by default, is a firewall policy of blocking all traffic that no rule expressly allows.',
          cite: [NIST_POLICY, MS_AZURE_DENIED, PA_RULEBASE],
        },
        { id: 'default-deny-2', text: 'It is safer than allowing everything that is not forbidden.', cite: [NIST_POLICY, MS_WF_OPEN] },
        {
          id: 'default-deny-3',
          text: 'Many firewalls do it with a last rule, at the bottom of the list, that denies all remaining traffic.',
          cite: [PA_RULES_CATCHALL, MS_NSG_DEFAULT],
        },
      ],
      lessons: [{ lesson: 'firewalls', term: 'term-default-deny' }],
    },
    {
      id: 'stateful',
      term: 'Stateful',
      also: ['Stateful inspection'],
      definition: [
        {
          id: 'stateful-1',
          text: 'A stateful firewall, one that uses stateful inspection, keeps track of the connections passing through it in a state table.',
          cite: [NIST_STATE_TABLE, PA_STATEFUL],
        },
        {
          id: 'stateful-2',
          text: 'Packets that belong to a connection it has allowed, such as the replies, pass without a rule of their own; a new connection is checked against the rules.',
          cite: [NIST_STATE_TABLE, PA_STATEFUL_WORKS, MS_NSG_STATEFUL],
        },
        { id: 'stateful-3', text: 'A stateless firewall checks each packet on its own.', cite: [NIST_FILTER, PA_STATELESS] },
      ],
      lessons: [{ lesson: 'firewalls', term: 'term-stateful' }],
    },
    {
      id: 'shadowed-rule',
      term: 'Shadowed rule',
      definition: [
        {
          id: 'shadowed-rule-1',
          text: 'A shadowed rule is a firewall rule that never gets to act, because one or more rules above it already match all the traffic it would match.',
          cite: [PA_SHADOWING, GOOGLE_SHADOWED, MS_NSG_ORDER],
        },
        { id: 'shadowed-rule-2', text: 'It usually means a mistake in the rule list.', cite: [GOOGLE_MISCONFIG, PA_SHADOW_RESULT] },
      ],
      lessons: [{ lesson: 'firewalls', term: 'term-shadowed' }],
    },
    {
      id: 'port',
      term: 'Port',
      also: ['Port number'],
      definition: [
        {
          id: 'port-1',
          text: 'A port, or port number, is a number that TCP and UDP use to tell apart the programs and services on a computer.',
          cite: [d('rfc-9293', '2.2'), rfc('rfc-6335', '3'), R768_SOURCE],
        },
        {
          id: 'port-2',
          text: 'A server usually listens on its service’s port, such as 21 for FTP or 443 for HTTPS.',
          cite: [rfc('rfc-6335', '3'), NIST_OVERVIEW, IANA_PORTS],
        },
        {
          id: 'port-3',
          text: 'TCP and UDP headers carry a source and a destination port; replies usually go to the source port.',
          cite: [d('rfc-9293', '3.1'), R768_DEST, NIST_OVERVIEW],
        },
      ],
      lessons: [
        { lesson: 'firewalls', term: 'term-port' },
        { lesson: 'what-is-udp', term: 'term-port' },
      ],
    },
    {
      id: 'source-address',
      term: 'Source address',
      definition: [
        {
          id: 'source-address-1',
          text: 'A packet’s source address is the IP address of the device that sent it, carried in the packet’s IP header.',
          cite: [rfc('rfc-8200', '3'), NIST_FILTER, d('rfc-791', '3.1')],
        },
        {
          id: 'source-address-2',
          text: 'Firewall rules can match on it, to allow or block traffic by where it comes from.',
          cite: [NIST_FILTER, MS_WF_CRITERIA, PA_RULES_WHAT],
        },
      ],
      lessons: [{ lesson: 'firewalls', term: 'term-source' }],
    },
    {
      id: 'destination-address',
      term: 'Destination address',
      definition: [
        {
          id: 'destination-address-1',
          text: 'A packet’s destination address is the IP address of the device it is meant for, carried in the packet’s IP header.',
          cite: [rfc('rfc-8200', '3'), NIST_FILTER, d('rfc-791', '3.1')],
        },
        {
          id: 'destination-address-2',
          text: 'Routers look it up to forward the packet toward that device.',
          cite: [d('rfc-1812', '5.2.1.2'), d('rfc-791', '1.4')],
        },
        {
          id: 'destination-address-3',
          text: 'Firewall rules can match on it, to allow or block traffic by where it is going.',
          cite: [NIST_FILTER, MS_WF_CRITERIA, PA_RULES_WHAT],
        },
      ],
    },
    {
      id: 'nat',
      term: 'NAT',
      also: ['Network Address Translation'],
      definition: [
        {
          id: 'nat-1',
          text: 'NAT (Network Address Translation) changes the IP addresses in packets as they pass between two networks, such as a private network and the internet.',
          cite: [NIST_GLOSSARY, R3022_ABSTRACT, rfc('rfc-4787', '3')],
        },
        {
          id: 'nat-2',
          text: 'A home router uses it so that many devices with private addresses share one public address, told apart by port number.',
          cite: [rfc('rfc-3022', '2.2'), rfc('rfc-4787', '3'), NIST_NAT],
        },
        {
          id: 'nat-3',
          text: 'It records each mapping, so replies get back to the right device.',
          cite: [rfc('rfc-4787', '3'), NIST_NAT, rfc('rfc-3022', '2.2')],
        },
      ],
      lessons: [{ lesson: 'what-is-ip', term: 'term-nat' }],
    },
    {
      id: 'private-address',
      term: 'Private address',
      definition: [
        {
          id: 'private-address-1',
          text: 'A private address is an IPv4 address from the ranges set aside for private networks: 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16.',
          cite: [d('rfc-1918', '3'), NIST_PRIVATE],
        },
        {
          id: 'private-address-2',
          text: 'Any network may use them without asking a registry, so they are reused on many networks and unique only within one.',
          cite: [d('rfc-1918', '3'), rfc('rfc-3022', '2.1')],
        },
        {
          id: 'private-address-3',
          text: 'They should not be passed across the internet, so devices using them usually reach it through NAT.',
          cite: [d('rfc-1918', '3'), NIST_PRIVATE, R3022_ABSTRACT],
        },
      ],
    },
    {
      id: 'public-address',
      term: 'Public address',
      definition: [
        {
          id: 'public-address-1',
          text: 'A public address is an IP address that is unique across the internet, assigned through an internet registry.',
          cite: [rfc('rfc-1918', '3'), R3022_PUBLIC],
        },
        {
          id: 'public-address-2',
          text: 'Hosts with public addresses can reach each other across the internet; NAT lets many devices with private addresses share one public address.',
          cite: [rfc('rfc-1918', '3'), rfc('rfc-4787', '4.4'), rfc('rfc-4787', '3'), NIST_NAT],
        },
      ],
    },
  ],
});
