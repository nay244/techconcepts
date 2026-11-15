import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, Cue, MessageEvent, Row, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * NAT, Networking Concepts lesson 12. Your laptop opens a connection to example.net; your router swaps the laptop's
 * private address and port for its one public address and a port of its own, and writes the pair in its NAT table
 * (RFC 3022 section 2.2, RFC 4787 section 3). The reply comes back to that port and the table says it is the laptop's.
 * Then the phone visits the same site: the same public address, a new port, a second row (RFC 5382 section 7.1). Last,
 * a computer on another network knocks on the router's public address: no row, so nothing at home is reached.
 *
 * The scene is the approved design's (prototypes/d11-batch-1.md section 3.3, with the errata in prototypes/d11-cases.md):
 * no step sets `status`, and the messages carry no `over`. The addresses (RFC 1918 and RFC 5737), the ports 50422,
 * 50613, 61023, 63847 and 51200 (the dynamic range) and the phone and the stranger are example data; the log's times and
 * sizes are dashes because no source states one for this story. RFC 2663 defines the terms and RFC 4787 and RFC 5382
 * the behaviours they set; RFC 3022 is Informational and carries no defining marker, and no vendor page does. No
 * standard places NAT at an OSI layer, so the badge spans.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
const rfc3022 = (section: string) => rfc('rfc-3022', section);
const rfc2663 = (section: string, defining = false) => rfc('rfc-2663', section, defining);
/** RFC 4787 sets the requirements for a NAT's UDP behaviour and RFC 5382 for its TCP behaviour, so each defines what it requires. */
const rfc4787 = (section: string, defining = false) => rfc('rfc-4787', section, defining);
const rfc5382 = (section: string, defining = false) => rfc('rfc-5382', section, defining);
const rfc4864 = (section: string) => rfc('rfc-4864', section);
const rfc1918 = (section: string) => rfc('rfc-1918', section, true);

/** RFC 3022's html has no id on its abstract, so the Abstract is cited by a text fragment that starts in it. */
const NAT_ABSTRACT = cite('rfc-3022', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc3022.html#:~:text=Network%20Address%20Port%20Translation%2C%20or%20NAPT' });
const UDP_BEHAVIOUR = cite('rfc-4787', 'Abstract', {
  url: 'https://www.rfc-editor.org/rfc/rfc4787.html#:~:text=This%20document%20defines%20basic%20terminology',
  defining: true,
});
const TCP_BEHAVIOUR = cite('rfc-5382', 'Abstract', {
  url: 'https://www.rfc-editor.org/rfc/rfc5382.html#:~:text=This%20document%20defines%20a%20set%20of%20requirements%20for%20NATs',
  defining: true,
});

/** NIST SP 800-41 Rev. 1 section 3.2, as Firewalls cites it: the PDF's 25th page. No marker: it is a guide to firewalls, not the standard for NAT. */
const NIST_PDF = SOURCES['nist-sp800-41r1']!.url;
const NIST_NAT = cite('nist-sp800-41r1', '3.2', { url: `${NIST_PDF}#page=25` });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });
const CISCO_WHAT = vendor('cisco-nat-faq', 'Q. What is NAT?', 'NAT operates on a router, usually');
const CISCO_CONSERVE = vendor('cisco-nat-faq', 'Q. What is NAT?', 'designed for IP address conservation');
const CISCO_OVERLOAD = vendor('cisco-nat-faq', 'Q. What is meant by the term NAT overloading; is this PAT?', 'Unique source port numbers on each translation');
const CISCO_PAT_PORT = vendor(
  'cisco-nat-faq',
  'Q. When configuring for PAT (overloading), what is the maximum number of translations that can be created per inside global IP address?',
  'PAT assigns a unique source port',
);
const CISCO_KEEP_PORT = vendor(
  'cisco-nat-faq',
  'Q. When configuring for PAT (overloading), what is the maximum number of translations that can be created per inside global IP address?',
  'It attempts to assign the same port value',
);
const CISCO_TABLE = vendor('cisco-nat-configure', 'Difference between One-to-One and Many-to-Many Mapping', 'It creates an entry in the NAT table when the host initiates');
const MS_PORT_REUSE = cite('microsoft-azure-snat', 'Port reuse', { url: `${SOURCES['microsoft-azure-snat']!.url}#port-reuse` });
const MS_CONSTRAINTS = cite('microsoft-azure-snat', 'Constraints', { url: `${SOURCES['microsoft-azure-snat']!.url}#constraints` });
const MS_INBOUND = cite('microsoft-azure-inbound-nat', 'Why use an inbound NAT rule?', {
  url: `${SOURCES['microsoft-azure-inbound-nat']!.url}#why-use-an-inbound-nat-rule`,
});
/** The dynamic port range and port 80 are the Ports lesson's facts too, and it cites the same entries. */
const MS_DYNAMIC = cite('microsoft-dynamic-ports', 'Introduction', { url: `${SOURCES['microsoft-dynamic-ports']!.url}#introduction` });

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100';
const PHONE = '192.168.1.101';
const PUBLIC = '198.51.100.23';
const WEB = '203.0.113.80';
const STRANGER = '192.0.2.66';

const natTable: TableDef = {
  id: 'nat-table',
  title: 'NAT table',
  by: 'kept by your router, 198.51.100.23 outside',
  columns: [
    { key: 'inside', label: 'Inside' },
    { key: 'out', label: 'Outside port' },
  ],
  keyColumn: 'out',
  initialRows: [],
  empty: 'Empty. Nothing has gone out yet.',
};

const traced = (...traces: string[]): Backing => ({ traces });
const status = (text: string, ...flags: 'status-done'[]): Cue[] => [{ cue: 'status', arg: text }, ...flags.map((cue) => ({ cue }))];

/** A TCP segment of the story. No source states its size, and no clock time belongs to it, so those cells are dashes. */
const packet = (
  id: string,
  from: string,
  to: string,
  o: { source: string; destination: string; info: string; plain: string; reply?: boolean; fast?: boolean; cues?: Cue[]; backing: Backing },
): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag: o.reply === true ? 'REPLY' : 'PACKET',
  kind: o.reply === true ? 'response' : 'request',
  ...(o.fast === true ? { fast: true } : {}),
  log: { time: '—', source: o.source, destination: o.destination, protocol: 'TCP', info: o.info, size: '—' },
  plain: o.plain,
  ...(o.cues === undefined ? {} : { cues: o.cues }),
  backing: o.backing,
});

const add = (id: string, summary: string, row: Row, backing: Backing): TableEvent => ({ type: 'table', id, table: 'nat-table', op: 'add', row, summary, backing });
const match = (id: string, key: string, summary: string, backing: Backing): TableEvent => ({ type: 'table', id, table: 'nat-table', op: 'match', key, summary, backing });

const LAPTOP_ROW: Row = { inside: `${LAPTOP}:50422`, out: '61023' };
const PHONE_ROW: Row = { inside: `${PHONE}:50613`, out: '63847' };

const step1: SceneEvent[] = [
  packet('s1-out', 'laptop', 'router', {
    source: `${LAPTOP}:50422`,
    destination: `${WEB}:80`,
    info: 'To example.net, port 80, from temporary port 50422',
    plain: 'Your laptop sends a packet for example.net, port 80, to your router, from its temporary port, 50422.',
    backing: traced('fact-ports', 'term-private'),
  }),
  add('s1-add', 'Written: 192.168.1.100:50422 goes out as port 61023.', LAPTOP_ROW, traced('term-nat-table', 'term-pat', 'pattern', 'fact-ports')),
  packet('s1-onward', 'router', 'web', {
    source: `${PUBLIC}:61023`,
    destination: `${WEB}:80`,
    info: `NAT: ${LAPTOP}:50422 → ${PUBLIC}:61023`,
    plain: 'Your router swaps the source for its own public address and a port it picks, 61023, and sends the packet on.',
    cues: status('Router swapped the address and port'),
    backing: traced('term-nat', 'term-pat', 'term-public', 'fact-router', 'pattern', 'fact-ports'),
  }),
];

const step2: SceneEvent[] = [
  packet('s2-in', 'web', 'router', {
    reply: true,
    source: `${WEB}:80`,
    destination: `${PUBLIC}:61023`,
    info: 'Reply to the router’s public address, port 61023',
    plain: 'example.net replies to the address and port it saw: 198.51.100.23, port 61023.',
    backing: traced('fact-reply', 'fact-router', 'fact-ports'),
  }),
  match('s2-match', '61023', 'Port 61023 is the laptop’s: 192.168.1.100:50422.', traced('term-nat-table', 'fact-reply', 'pattern')),
  packet('s2-back', 'router', 'laptop', {
    reply: true,
    source: `${WEB}:80`,
    destination: `${LAPTOP}:50422`,
    info: `NAT: ${PUBLIC}:61023 → ${LAPTOP}:50422`,
    plain: 'Your router swaps the destination back and passes the reply to the laptop.',
    cues: status('Reply received', 'status-done'),
    backing: traced('term-nat', 'fact-reply', 'pattern', 'fact-ports'),
  }),
];

const step3: SceneEvent[] = [
  packet('s3-out', 'phone', 'router', {
    source: `${PHONE}:50613`,
    destination: `${WEB}:80`,
    info: 'To example.net, port 80, from temporary port 50613',
    plain: 'Your phone sends its own packet for example.net, port 80, to your router, from its temporary port, 50613.',
    backing: traced('fact-ports', 'term-private'),
  }),
  add('s3-add', 'Written: 192.168.1.101:50613 goes out as port 63847.', PHONE_ROW, traced('term-nat-table', 'term-pat', 'fact-same-site', 'pattern')),
  packet('s3-onward', 'router', 'web', {
    source: `${PUBLIC}:63847`,
    destination: `${WEB}:80`,
    info: `NAT: ${PHONE}:50613 → ${PUBLIC}:63847`,
    plain: 'Your router keeps its public address but gives the phone a new port, 63847, and sends the packet on.',
    backing: traced('term-nat', 'term-pat', 'term-public', 'fact-same-site', 'fact-router', 'fact-ports'),
  }),
];

const step4: SceneEvent[] = [
  packet('s4-in', 'web', 'router', {
    reply: true,
    source: `${WEB}:80`,
    destination: `${PUBLIC}:63847`,
    info: 'Reply to the router’s public address, port 63847',
    plain: 'example.net’s reply for the phone arrives at 198.51.100.23, port 63847.',
    backing: traced('fact-reply', 'fact-router', 'why-2', 'fact-ports'),
  }),
  match('s4-match', '63847', 'Port 63847 is the phone’s: 192.168.1.101:50613.', traced('term-nat-table', 'why-2', 'fact-reply')),
  packet('s4-phone', 'router', 'phone', {
    reply: true,
    source: `${WEB}:80`,
    destination: `${PHONE}:50613`,
    info: `NAT: ${PUBLIC}:63847 → ${PHONE}:50613`,
    plain: 'Your router finds port 63847 in its table and passes the reply to the phone.',
    backing: traced('term-nat', 'fact-reply', 'why-2', 'fact-ports'),
  }),
  packet('s4-in2', 'web', 'router', {
    reply: true,
    fast: true,
    source: `${WEB}:80`,
    destination: `${PUBLIC}:61023`,
    info: 'Reply to the router’s public address, port 61023',
    plain: 'example.net’s reply for the laptop arrives at the same address, on port 61023.',
    backing: traced('fact-reply', 'fact-router', 'why-2', 'fact-ports'),
  }),
  match('s4-match2', '61023', 'Port 61023 is the laptop’s: 192.168.1.100:50422.', traced('term-nat-table', 'why-2', 'fact-reply')),
  packet('s4-laptop', 'router', 'laptop', {
    reply: true,
    fast: true,
    source: `${WEB}:80`,
    destination: `${LAPTOP}:50422`,
    info: `NAT: ${PUBLIC}:61023 → ${LAPTOP}:50422`,
    plain: 'Your router passes that reply to the laptop.',
    backing: traced('term-nat', 'fact-reply', 'why-2', 'fact-ports'),
  }),
];

const step5: SceneEvent[] = [
  packet('s5-stranger', 'stranger', 'router', {
    source: `${STRANGER}:51200`,
    destination: `${PUBLIC}:80`,
    info: 'No row for port 80: not passed in',
    plain: 'A computer on another network tries to connect to 198.51.100.23, port 80. No row matches and no port is forwarded, so the router passes it to no device.',
    backing: traced('fact-outside', 'term-nat-table', 'term-port-forwarding', 'fact-router', 'fact-ports'),
  }),
  match('s5-nomatch', '', 'No row for port 80: nothing at home asked for this.', traced('fact-outside', 'term-nat-table', 'fact-ports')),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'nat',
  title: 'NAT',
  subtitle: 'Sharing one public address',
  level: 'beginner',
  certTags: [],
  summary:
    'Follow your laptop and your phone out to one website. Your router swaps their private addresses for its one public address, gives each connection a port of its own and writes it in its NAT table, so every reply finds its way back.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'term-nat', 'term-nat-table', 'why-1'] },
  units: [
    {
      id: 'nat',
      name: 'NAT',
      fullName: 'Network Address Translation',
      purpose: 'Letting a whole home share one public address',
      osi: 'spans',
      backing: { traces: ['fact-stands-for', 'term-nat', 'why-1'] },
      scene: {
        title: 'Sharing one public address',
        views: ['network'],
        layers: ['tcp:web', 'nat:stranger'],
        labels: { laptop: 'Opening example.net', router: '192.168.1.1 inside\n198.51.100.23 outside' },
        start: [
          { cue: 'hide', arg: 'resolver' },
          { cue: 'show', arg: 'phone' },
        ],
        panel: { type: 'table', table: natTable },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'request', label: 'Packet' },
            { kind: 'response', label: 'Reply' },
          ],
        },
        parties: [],
        backing: {
          traces: ['term-private', 'term-public', 'term-nat', 'term-pat', 'term-nat-table', 'fact-router', 'fact-ports', 'fact-outside', 'fact-reply'],
        },
      },
      overview: {
        hook: 'Your laptop and your phone have private addresses, and the internet doesn’t carry those. Your router has one public address and shares it. It swaps each device’s address and port for its own address and a port, and writes the swap in a table, so every reply finds the right device.',
        hookBacking: { traces: ['term-private', 'term-public', 'term-pat', 'term-nat-table', 'lead-1', 'why-1'] },
        description:
          'Every device at home goes out through your router. NAT swaps the private address for the public one on the way out, and the NAT table remembers which port belongs to which device, so replies come back to the right one.',
        backing: { traces: ['lead-1', 'term-nat', 'term-nat-table'] },
        facts: [
          { label: 'Shares', value: 'one public address, 198.51.100.23, among every device at home', backing: { traces: ['fact-router', 'why-1'] } },
          { label: 'Tells devices apart by', value: 'the port, written in the NAT table', backing: { traces: ['why-2', 'term-nat-table'] } },
          { label: 'A row is written', value: 'when a device at home starts a connection', backing: { traces: ['term-nat-table'] } },
          { label: 'From outside', value: 'a device at home can’t be reached first, unless the router forwards a port to it', backing: { traces: ['fact-outside'] } },
          { label: 'Defined in', value: 'RFC 3022, with its terms in RFC 2663', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'out',
          title: 'Out: a new address and port',
          sub: 'Your router’s swap',
          narrative:
            'Your laptop opens a connection to example.net, port 80, from a temporary port it picked, 50422. The packet goes to your router. 192.168.1.100 is a **private address**, so the router swaps the source for its own **public address**, 198.51.100.23, and a port it picks, 61023. It writes the pair in its **NAT table**, and sends the packet on.',
          deep: [
            {
              text: 'The router also rewrites the checksums that cover the address and port it changed.',
              cite: [rfc2663('4.1.2', true), rfc3022('4.1')],
            },
          ],
          facts: [
            { label: 'Inside', value: '192.168.1.100, port 50422', backing: { traces: ['term-private', 'fact-ports'] } },
            { label: 'Outside', value: '198.51.100.23, port 61023', backing: { traces: ['term-public', 'fact-router', 'term-pat'] } },
            { label: 'Written in', value: 'the NAT table', backing: { traces: ['term-nat-table'] } },
            { label: 'Going to', value: 'example.net, port 80', backing: { traces: ['fact-ports'] } },
          ],
          events: step1,
          backing: { traces: ['lead-1', 'term-private', 'term-public', 'term-nat', 'term-pat', 'term-nat-table', 'fact-ports', 'fact-router', 'pattern'] },
        },
        {
          id: 'back',
          title: 'Back: the table knows',
          sub: 'The reply comes home',
          narrative:
            'example.net only saw 198.51.100.23, port 61023, so that’s where it replies. The router looks 61023 up in its NAT table, finds the laptop’s row, swaps the destination back to 192.168.1.100, port 50422, and passes the reply in.',
          deep: [
            {
              text: 'On the way in, the router swaps the destination address and port, and rewrites the checksums again.',
              cite: [rfc2663('4.1.2', true)],
            },
          ],
          facts: [
            { label: 'Reply arrives at', value: '198.51.100.23, port 61023', backing: { traces: ['fact-reply', 'fact-router'] } },
            { label: 'Router finds', value: 'the row for port 61023', backing: { traces: ['term-nat-table', 'fact-reply'] } },
            { label: 'Swaps back to', value: '192.168.1.100, port 50422', backing: { traces: ['fact-reply', 'pattern'] } },
          ],
          events: step2,
          backing: { traces: ['fact-reply', 'term-nat-table', 'pattern'] },
        },
        {
          id: 'second-device',
          title: 'A second device, same site',
          sub: 'Your phone joins in',
          narrative:
            'Your phone opens its own connection to example.net, port 80, from its temporary port, 50613. Same router, same public address. But two connections to the same site can’t share an outside port, or the router couldn’t tell their replies apart. So it picks a new port, 63847, and writes a second row.',
          deep: [
            {
              text: 'Two devices sharing one outside port to the same site would be “port overloading”. The standards say a NAT must not do it, since both couldn’t then connect to that site at once.',
              cite: [rfc5382('7.1', true), rfc4787('4.2.1', true)],
            },
          ],
          facts: [
            { label: 'Phone, inside', value: '192.168.1.101, port 50613', backing: { traces: ['term-private', 'fact-ports'] } },
            { label: 'Phone, outside', value: '198.51.100.23, port 63847', backing: { traces: ['term-public', 'fact-router', 'term-pat'] } },
            { label: 'Why a new port', value: 'two connections to the same site can’t share one', backing: { traces: ['fact-same-site'] } },
          ],
          events: step3,
          backing: { traces: ['term-pat', 'term-nat-table', 'fact-same-site', 'fact-ports', 'fact-router', 'pattern'] },
        },
        {
          id: 'told-apart',
          title: 'One address, told apart by port',
          sub: 'Two replies, one address',
          narrative:
            'Two replies arrive at 198.51.100.23: one for port 63847, one for 61023. The router reads the port on each, finds its row, and sends one to the phone and one to the laptop. The port is how one public address serves the whole house.',
          deep: [
            {
              text: 'A row doesn’t last for ever. A router keeps it while its connection is in use, and how long it waits after things go quiet differs from router to router.',
              cite: [rfc4787('4.3', true), rfc5382('5', true), rfc2663('2.6')],
            },
          ],
          facts: [
            { label: 'Reply for port 63847', value: 'goes to the phone', backing: { traces: ['fact-reply', 'why-2'] } },
            { label: 'Reply for port 61023', value: 'goes to the laptop', backing: { traces: ['fact-reply', 'why-2'] } },
            { label: 'What tells them apart', value: 'the port', backing: { traces: ['why-2', 'term-pat'] } },
          ],
          events: step4,
          backing: { traces: ['why-2', 'fact-reply', 'term-pat', 'term-nat-table', 'pattern'] },
        },
        {
          id: 'no-row',
          title: 'Nobody asked: no row, nowhere to go',
          sub: 'A stranger knocks',
          narrative:
            'A computer out on the internet, 192.0.2.66, tries to start a conversation with 198.51.100.23, port 80. Nobody at home started it, so no row matches, and no port is forwarded. The router has no device to pass it to, and it doesn’t. That’s why a device at home can’t be reached first, unless the router forwards a port to it.',
          deep: [
            {
              text: 'What a router does with a packet like this differs: it may drop it, or send an error message back.',
              cite: [rfc5382('4.3', true)],
            },
          ],
          facts: [
            { label: 'From', value: '192.0.2.66, port 51200', backing: { example: true } },
            { label: 'To', value: '198.51.100.23, port 80', backing: { traces: ['fact-router', 'fact-ports'] } },
            { label: 'Row for port 80', value: 'none', backing: { traces: ['term-nat-table', 'fact-outside'] } },
            { label: 'Passed in', value: 'to no device, unless a port is forwarded', backing: { traces: ['fact-outside', 'term-port-forwarding'] } },
          ],
          events: step5,
          backing: { traces: ['fact-outside', 'term-nat-table', 'term-port-forwarding', 'fact-router', 'fact-ports'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'Every device at home goes out through your router’s one public address. The router gives each connection a port of its own and writes it down, so every reply finds the right device.',
            cite: [rfc3022('2.2'), rfc4787('3'), NIST_NAT],
          },
          {
            id: 'lead-2',
            text: 'Like a building with one street address: the post room writes down which flat sent each letter, and puts that flat number on the reply.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-private',
            idea: 'An address from the ranges set aside for private networks, reused everywhere and not carried across the internet',
            name: 'Private address',
            cite: [rfc1918('3'), NIST_NAT, cite('nist-sp800-41r1', '4.1.1', { url: `${NIST_PDF}#page=29` })],
          },
          {
            id: 'term-public',
            idea: 'An address that is unique on the internet; your router has one, on its outside',
            name: 'Public address',
            cite: [rfc2663('2.7'), rfc3022('2.2'), NIST_NAT],
          },
          {
            id: 'term-nat',
            idea: 'Swapping a private address for a public one',
            name: 'NAT',
            cite: [rfc2663('3', true), rfc3022('2.2'), CISCO_WHAT, NIST_NAT],
          },
          {
            id: 'term-pat',
            idea: 'Swapping the port too, so many devices can share one public address',
            name: 'Port address translation (PAT)',
            cite: [NAT_ABSTRACT, rfc2663('4.1.2', true), rfc4787('3'), NIST_NAT, CISCO_OVERLOAD],
          },
          {
            id: 'term-nat-table',
            idea: 'The router’s list of which inside address and port each outside port stands for; a row is written when a device at home starts a connection',
            name: 'NAT table',
            cite: [rfc3022('2.2'), rfc3022('3.1'), rfc2663('3.2.1'), rfc4787('4.1'), CISCO_TABLE, NIST_NAT],
          },
          {
            id: 'term-port-forwarding',
            idea: 'A fixed entry, set up by hand, that sends one outside port to one device inside',
            name: 'Port forwarding',
            cite: [rfc3022('2.2'), NIST_NAT, MS_INBOUND],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Swap the source', 'Write it down', 'Look up the reply', 'Swap it back'],
          note: 'What your router does for every connection that starts at home.',
          cite: [rfc3022('2.2'), rfc3022('3.1'), rfc3022('4.1'), rfc2663('3.2.1'), rfc2663('3.2.2'), rfc2663('4.1.2'), NIST_NAT],
        },
        why: [
          {
            id: 'why-1',
            text: 'Private addresses aren’t carried across the internet, and there aren’t enough IPv4 addresses for every device. So a whole home shares one public address.',
            cite: [rfc1918('3'), rfc4864('2.6'), rfc3022('2.2'), CISCO_CONSERVE],
          },
          {
            id: 'why-2',
            text: 'One public address serves the whole house, so the port is what tells the router which device a reply is for.',
            cite: [NIST_NAT, rfc3022('2.2'), CISCO_OVERLOAD],
          },
        ],
        deep: [
          {
            id: 'deep-port',
            text: 'Some routers keep a device’s own port number when it’s free and pick another only if it’s taken; others always pick their own.',
            cite: [rfc4787('4.2.1', true), CISCO_KEEP_PORT, NIST_NAT],
          },
          {
            id: 'deep-firewall',
            text: 'NAT isn’t a firewall. Swapping addresses doesn’t decide what’s allowed in; a firewall’s rules do, and the two often run on the same box.',
            cite: [rfc4864('2.2'), NIST_NAT, rfc4787('13'), rfc2663('9.0')],
          },
        ],
        facts: [
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 3022, Traditional NAT; its terms are in RFC 2663',
            cite: [NAT_ABSTRACT, rfc4787('3')],
          },
          { id: 'fact-behaviour', label: 'How a NAT should behave', value: 'RFC 4787 for UDP and RFC 5382 for TCP', cite: [UDP_BEHAVIOUR, TCP_BEHAVIOUR] },
          { id: 'fact-private', label: 'Private ranges', value: '10/8, 172.16/12, 192.168/16', cite: [rfc1918('3')] },
          {
            id: 'fact-router',
            label: 'Your router',
            value: 'a private address inside (192.168.1.1) and one public address outside (198.51.100.23)',
            cite: [rfc3022('1'), rfc3022('2.2'), NIST_NAT],
          },
          {
            id: 'fact-ports',
            label: 'The ports',
            value: 'your device picks a temporary port for each connection, from the range set aside for that, 49152 to 65535; web servers listen on TCP port 80',
            cite: [rfc('rfc-6335', '6', true), rfc('rfc-6335', '8.1.2', true), MS_DYNAMIC, rfc('rfc-9110', '4.2.1', true), cite('nist-sp800-41r1', '4.1.3', { url: `${NIST_PDF}#page=31` })],
          },
          {
            id: 'fact-reply',
            label: 'The reply',
            value: 'goes to the router’s public address and port, the ones the site saw; the router finds the row and swaps both back',
            cite: [rfc3022('2.2'), rfc3022('4.1'), rfc2663('4.1.2'), rfc4787('3'), NIST_NAT],
          },
          {
            id: 'fact-same-site',
            label: 'Two devices, one site',
            value: 'two connections to the same site can’t share an outside port, so each gets its own and replies can be told apart',
            cite: [rfc5382('7.1', true), rfc4787('4.2.1', true), MS_PORT_REUSE, CISCO_PAT_PORT],
          },
          {
            id: 'fact-outside',
            label: 'From outside',
            value: 'a device at home can’t be reached first, unless the router forwards a port to it',
            cite: [rfc3022('2'), rfc3022('2.2'), NIST_NAT, rfc('rfc-6250', '3.1.1')],
          },
          {
            id: 'fact-timeout',
            label: 'How long a row lasts',
            value:
              'while its connection is in use, and for a while after it goes quiet; the standards ask for at least 2 minutes for UDP, except to some well-known ports, and at least 2 hours 4 minutes for an open TCP connection; routers differ',
            cite: [rfc4787('4.3', true), rfc5382('5', true), rfc2663('2.6'), MS_CONSTRAINTS],
          },
          { id: 'fact-stands-for', label: 'Stands for', value: 'Network Address Translation', cite: [rfc2663('3', true), CISCO_CONSERVE] },
        ],
      },
      practice: [
        {
          id: 'told-apart',
          prompt: 'Your laptop and your phone are both on example.net, through the same public address. How does your router know which reply is for which?',
          options: [
            {
              text: 'By the port each reply comes back to.',
              feedback: 'Right. Each connection got its own outside port, and the NAT table says which device each port stands for.',
              cite: [NIST_NAT, rfc3022('2.2'), CISCO_OVERLOAD, rfc5382('7.1', true)],
            },
            {
              text: 'By the private address in the reply.',
              feedback: 'Not quite. example.net never saw a private address. The reply carries the router’s public address, and only the port tells them apart.',
              cite: [rfc4864('2.4'), rfc4787('3'), NIST_NAT],
            },
            {
              text: 'It sends each reply to both, and they ignore the wrong one.',
              feedback: 'Not quite. The router looks the port up in its NAT table and sends the reply to that one device.',
              cite: [rfc3022('2.2'), rfc2663('4.1.2'), NIST_NAT],
            },
          ],
          answer: 0,
        },
        {
          id: 'knock',
          prompt: 'Someone on the internet tries to connect to your router’s public address. Nobody at home started that conversation, and no port is forwarded. What happens?',
          options: [
            {
              text: 'The router doesn’t pass it to any device at home.',
              feedback: 'Right. There’s no row for it, so the router has no device to send it to.',
              cite: [rfc3022('2'), rfc3022('2.2'), NIST_NAT],
            },
            {
              text: 'The router sends it to the device that was online last.',
              feedback: 'Not quite. Only a row in the NAT table, or a forwarded port, says where a packet goes. Here there’s neither.',
              cite: [rfc3022('2.2'), NIST_NAT, MS_INBOUND],
            },
            {
              text: 'The router sends it to every device at home.',
              feedback: 'Not quite. Without a row or a forwarded port, it goes to no device at all.',
              cite: [rfc3022('2.2'), NIST_NAT],
            },
          ],
          answer: 0,
        },
        {
          id: 'not-a-firewall',
          prompt: 'Your router does NAT. Does that make it a firewall?',
          options: [
            {
              text: 'No. NAT swaps addresses; deciding what’s allowed in is a firewall’s job.',
              feedback: 'Right. They can run on the same box, but they’re different jobs.',
              cite: [rfc4864('2.2'), NIST_NAT, rfc2663('9.0')],
            },
            {
              text: 'Yes. Hiding private addresses stops every attack.',
              feedback: 'Not quite. Translating addresses isn’t security in itself, and NAT doesn’t stop every attack.',
              cite: [rfc4864('2.2'), NIST_NAT],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
