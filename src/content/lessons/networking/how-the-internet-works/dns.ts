import { eventLog, messagesFor } from '../../../helpers/internet-events';
import type { LegacyUnitInput } from '../../../legacy';
import type { TableDef } from '../../../schema';

/**
 * DNS, protocol 6 of How the Internet Works’ 14. The laptop asks its resolver for techconcepts.app, and the
 * resolver asks its way down the name: a root server, then the .app servers, then the site’s own name server. Both
 * keep the answer for its TTL, so the next lookup needs no trips.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols.mjs), ported as written.
 */

const LAPTOP = '192.168.1.100:50611';
const RESOLVER = '192.0.2.53:53';
const RESOLVER_OUT = '192.0.2.53:41877';

const learned: TableDef = {
  id: 'learned',
  title: 'What the resolver learned',
  by: 'and how long it may keep it',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'answer', label: 'Answer' },
    { key: 'from', label: 'From', prose: true },
    { key: 'keeps', label: 'Keeps for' },
  ],
  keyColumn: 'from',
  initialRows: [],
  empty: 'Nothing yet. The resolver hasn’t asked anyone.',
};

const msg = messagesFor(learned);

const dns: LegacyUnitInput = {
  id: 'dns',
  name: 'DNS',
  fullName: 'Domain Name System',
  purpose: 'Names into numbers',
  group: 'app',
  osiLayers: [7],
  references: [
    { label: 'RFC 1034: Domain Names, Concepts and Facilities', url: 'https://www.rfc-editor.org/rfc/rfc1034' },
    { label: 'RFC 1035: Domain Names, Implementation and Specification', url: 'https://www.rfc-editor.org/rfc/rfc1035' },
  ],
  scene: {
    title: 'The resolver asks its way down the name',
    views: ['network', 'sequence'],
    layers: ['dns:names'],
    labels: { laptop: 'Wants techconcepts.app', url: 'techconcepts.app' },
    start: [],
    panel: { type: 'table', table: learned },
    log: eventLog(),
    parties: [
      { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
      { place: 'resolver', label: 'DNS resolver', addr: '192.0.2.53' },
      { place: 'root', label: 'Root server', addr: '192.0.2.10' },
      { place: 'tld', label: '.app server', addr: '192.0.2.20' },
      { place: 'auth', label: 'ns1.techconcepts.app', addr: '198.51.100.40' },
    ],
  },
  overview: {
    hook: 'You know websites by name. Computers know each other by number. DNS is the internet’s directory that turns one into the other, and it finds the answer by asking a chain of servers, each one knowing a little more.',
    description:
      'It’s like asking the way in a big building. Reception sends you to the right floor, the floor’s desk sends you to the right office, and the office has your answer. DNS goes the same way, from the end of the name back: first the root, then .app, then techconcepts.app itself.',
    facts: [
      { label: 'Used for', value: 'turning names into IP addresses' },
      { label: 'Port', value: 'UDP 53 (TCP 53 for big answers)' },
      { label: 'Who asks', value: 'your laptop asks a resolver; the resolver asks the rest' },
      { label: 'Answers kept', value: 'for a set time, the TTL' },
      { label: 'OSI layer', value: '7, application' },
      { label: 'This example', value: 'techconcepts.app' },
    ],
  },
  steps: [
    {
      id: 'recursive-query',
      title: 'Recursive Query',
      sub: 'What’s the number for techconcepts.app?',
      narrative:
        'Your laptop doesn’t look names up by itself. It asks one helper, the **DNS resolver**, usually run by your internet provider. The question is short: “What’s the number for techconcepts.app?” That’s a **DNS query**. The resolver checks its notes, finds nothing recent, and goes to find out.',
      deep: 'The laptop’s query is recursive: it wants the final answer, not directions. The resolver’s own address comes from the network settings, usually handed out by DHCP. This query asks for an A record (IPv4); browsers often ask for AAAA (IPv6) at the same time.',
      facts: [
        { label: 'From', value: '192.168.1.100, UDP port 50611' },
        { label: 'To', value: '192.0.2.53, UDP port 53' },
        { label: 'Asks for', value: 'the A record of techconcepts.app' },
        { label: 'Kind', value: 'recursive: “just give me the answer”' },
      ],
      events: [
        ...msg({
          tag: 'QUERY',
          from: 'laptop',
          to: 'resolver',
          proto: 'DNS',
          via: 'UDP',
          kind: 'request',
          time: '0.000s',
          src: LAPTOP,
          dst: RESOLVER,
          size: '75 B',
          sum: 'What’s the number for techconcepts.app?',
          info: 'Query: A techconcepts.app (recursive)',
          st: 'Asking the resolver',
        }),
      ],
    },
    {
      id: 'root-referral',
      title: 'Root Referral',
      sub: '“Ask the .app servers”',
      narrative:
        'The resolver starts at the top, with a **root server**. The root doesn’t know every name. It knows who looks after each ending, like .com, .org or .app. So it answers with directions: “I don’t know techconcepts.app, but the .app servers do, and here’s where they are.” That kind of answer is a **referral**.',
      deep: 'There are 13 root server names (a.root-servers.net to m.root-servers.net), each run as hundreds of copies around the world. Endings like .app are top-level domains, TLDs. Resolvers keep the root’s referrals for up to two days, so they rarely need to ask the root at all.',
      facts: [
        { label: 'Asks', value: 'a root server, 192.0.2.10' },
        { label: 'Answer', value: 'a referral to the .app servers' },
        { label: 'Endings like .app', value: 'top-level domains (TLDs)' },
        { label: 'Kept for', value: 'up to 2 days' },
      ],
      events: [
        ...msg({
          tag: 'QUERY',
          from: 'resolver',
          to: 'root',
          proto: 'DNS',
          via: 'UDP',
          kind: 'request',
          time: '0.003s',
          src: RESOLVER_OUT,
          dst: '192.0.2.10:53',
          size: '75 B',
          sum: 'Where’s techconcepts.app?',
          info: 'Query: A techconcepts.app',
        }),
        ...msg({
          tag: 'ASK .APP',
          from: 'root',
          to: 'resolver',
          proto: 'DNS',
          via: 'UDP',
          kind: 'response',
          time: '0.017s',
          src: '192.0.2.10:53',
          dst: RESOLVER_OUT,
          size: '312 B',
          sum: 'Not mine. Ask the .app servers, at 192.0.2.20.',
          info: 'Referral: NS for app., 192.0.2.20',
          rows: [{ key: 'app', cells: ['.app', 'ask 192.0.2.20', 'root', '2 days'] }],
        }),
      ],
    },
    {
      id: 'tld-referral',
      title: 'TLD Referral',
      sub: '“Ask ns1.techconcepts.app”',
      narrative:
        'Next it asks the **.app servers**. They keep a list of every name ending in .app and who’s in charge of each. Directions again: “techconcepts.app is looked after by ns1.techconcepts.app, at 198.51.100.40.” That server is the site’s own **name server**, the one that knows for sure.',
      deep: 'The .app servers are the TLD servers for .app. The server they point to is authoritative for techconcepts.app: its answers come from the site’s own records, not from memory. Most sites have at least two name servers, in case one is down.',
      facts: [
        { label: 'Asks', value: 'a .app server, 192.0.2.20' },
        { label: 'Answer', value: 'ns1.techconcepts.app, 198.51.100.40' },
        { label: 'That server is', value: 'authoritative for techconcepts.app' },
        { label: 'Kept for', value: '1 day' },
      ],
      events: [
        ...msg({
          tag: 'QUERY',
          from: 'resolver',
          to: 'tld',
          proto: 'DNS',
          via: 'UDP',
          kind: 'request',
          time: '0.018s',
          src: RESOLVER_OUT,
          dst: '192.0.2.20:53',
          size: '75 B',
          sum: 'Where’s techconcepts.app?',
          info: 'Query: A techconcepts.app',
        }),
        ...msg({
          tag: 'ASK NS1',
          from: 'tld',
          to: 'resolver',
          proto: 'DNS',
          via: 'UDP',
          kind: 'response',
          time: '0.036s',
          src: '192.0.2.20:53',
          dst: RESOLVER_OUT,
          size: '158 B',
          sum: 'Ask its name server, ns1.techconcepts.app, at 198.51.100.40.',
          info: 'Referral: NS ns1.techconcepts.app, 198.51.100.40',
          rows: [{ key: 'ns', cells: ['techconcepts.app', 'ask ns1, 198.51.100.40', '.app servers', '1 day'] }],
        }),
      ],
    },
    {
      id: 'authoritative-answer',
      title: 'Authoritative Answer',
      sub: 'It’s 198.51.100.7',
      narrative:
        'Last, the resolver asks the site’s own name server, which looks the name up in its records: “techconcepts.app is 198.51.100.7, and you can keep that for 5 minutes.” That line of the records is an **A record**, and the 5 minutes is its **TTL**, its time to live.',
      deep: 'Common record types: A (an IPv4 address), AAAA (IPv6), CNAME (this name is another name for that one), MX (the domain’s mail server), NS (its name servers), TXT (notes, often used to prove you own a domain). The site owner sets each TTL; a short one lets changes spread quickly.',
      facts: [
        { label: 'Asks', value: 'ns1.techconcepts.app, 198.51.100.40' },
        { label: 'Answer', value: 'A record: 198.51.100.7' },
        { label: 'TTL', value: '300 seconds' },
        { label: 'Other types', value: 'AAAA, CNAME, MX, NS, TXT' },
      ],
      events: [
        ...msg({
          tag: 'QUERY',
          from: 'resolver',
          to: 'auth',
          proto: 'DNS',
          via: 'UDP',
          kind: 'request',
          time: '0.037s',
          src: RESOLVER_OUT,
          dst: '198.51.100.40:53',
          size: '75 B',
          sum: 'What’s the number for techconcepts.app?',
          info: 'Query: A techconcepts.app',
        }),
        ...msg({
          tag: 'ANSWER',
          from: 'auth',
          to: 'resolver',
          proto: 'DNS',
          via: 'UDP',
          kind: 'response',
          time: '0.058s',
          src: '198.51.100.40:53',
          dst: RESOLVER_OUT,
          size: '91 B',
          sum: 'techconcepts.app is 198.51.100.7. Keep it for 5 minutes.',
          info: 'Answer: A 198.51.100.7, TTL 300 (authoritative)',
          rows: [{ key: 'a', cells: ['techconcepts.app', '198.51.100.7', 'ns1', '5 min'] }],
        }),
      ],
    },
    {
      id: 'response-and-caching',
      title: 'Response and Caching',
      sub: 'Next time, no trips',
      narrative:
        'The resolver hands the answer to your laptop, and both keep a copy until the TTL runs out. The next time anyone using this resolver asks for techconcepts.app, it answers from memory, straight away. That memory is the **DNS cache**, and it’s why most lookups take a few milliseconds instead of four trips.',
      deep: 'Caches sit in many places: the browser, the laptop, the home router and the resolver, each counting down the TTL. A wrong entry in a cache sends people to the wrong place until it expires; DNSSEC lets resolvers check that answers were signed by the domain’s owner.',
      facts: [
        { label: 'Answer to the laptop', value: 'techconcepts.app is 198.51.100.7' },
        { label: 'Trips this time', value: '4: the laptop’s, then root, .app and ns1' },
        { label: 'Next time', value: 'none, until the TTL ends' },
        { label: 'Took', value: 'about 60 ms' },
      ],
      events: [
        ...msg({
          tag: 'ANSWER',
          from: 'resolver',
          to: 'laptop',
          proto: 'DNS',
          via: 'UDP',
          kind: 'response',
          time: '0.059s',
          src: RESOLVER,
          dst: LAPTOP,
          size: '91 B',
          sum: 'techconcepts.app is 198.51.100.7.',
          info: 'Response: A 198.51.100.7, TTL 300',
          st: 'Found 198.51.100.7',
          done: true,
        }),
      ],
    },
  ],
  learn: {
    lead: 'Four servers, four trips, and a name became a number. Here are the parts and what they’re called.',
    terms: [
      { idea: 'The helper that looks names up for you', name: 'DNS resolver' },
      { idea: 'The top of the directory, who knows each ending', name: 'Root server' },
      { idea: 'The endings, like .app or .com', name: 'Top-level domain' },
      { idea: '“I don’t know, but ask them”', name: 'Referral' },
      { idea: 'The server that knows a site’s names for sure', name: 'Authoritative server' },
      { idea: 'The line that says name = number', name: 'A record' },
      { idea: 'How long an answer may be kept', name: 'TTL' },
      { idea: 'Answers kept for next time', name: 'DNS cache' },
    ],
    pattern: {
      names: ['Recursive Query', 'Root', 'TLD', 'Authoritative', 'Cache'],
      note: 'A lookup reads the name from the end: the ending first, the site last.',
    },
    why: 'No single server could hold every name on the internet and answer everyone. Splitting the work by ending, and letting everyone keep answers for a while, keeps DNS fast and keeps it working even when parts of it are down.',
    deep: 'Your laptop sends one recursive query; the resolver sends iterative ones, following each referral itself. Queries normally use UDP; answers too big for one packet, and copies of a whole zone between name servers, use TCP. DNS over HTTPS (DoH, 443) and DNS over TLS (DoT, 853) hide your lookups from the network.',
    facts: [
      { label: 'Port', value: 'UDP 53, TCP 53' },
      { label: 'Record types', value: 'A, AAAA, CNAME, MX, NS, TXT, PTR' },
      { label: 'Root servers', value: '13 names, hundreds of copies' },
      { label: 'Encrypted', value: 'DoH (443), DoT (853)' },
      { label: 'Defined in', value: 'RFC 1034, RFC 1035' },
    ],
  },
  practice: [
    {
      id: 'root-referral',
      prompt: 'The root server doesn’t know techconcepts.app. What does it send back?',
      options: [
        {
          text: 'An error: no such name.',
          feedback: 'Not quite. The root doesn’t know the name, but it isn’t an error. It sends directions to the .app servers.',
        },
        { text: 'Directions to the servers for .app.', feedback: 'Right. That’s a referral: “not mine, ask them.”' },
        { text: 'The website itself.', feedback: 'Not quite. No DNS server has the website. They only deal in names and numbers.' },
      ],
      answer: 1,
    },
    {
      id: 'cached',
      prompt: 'A minute later you look up techconcepts.app again. Why is it almost instant?',
      options: [
        {
          text: 'The answer is still in a cache, until its TTL runs out.',
          feedback: 'Yes. The laptop and the resolver both kept it for 5 minutes.',
        },
        {
          text: 'The root server remembers you.',
          feedback: 'Not quite. The root isn’t asked again at all. The answer comes from a cache.',
        },
        {
          text: 'Each name can only be looked up once.',
          feedback: 'Not quite. Names are looked up again whenever the cached answer runs out.',
        },
      ],
      answer: 0,
    },
  ],
};

export default dns;
