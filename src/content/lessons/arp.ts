import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, Cue, MessageEvent, Row, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * ARP, Networking Concepts lesson 6. The laptop has a packet for example.net, so its next stop is the router, and
 * to put the packet in a frame it needs the router's MAC address. It looks in its ARP cache (empty), asks everyone
 * "Who has 192.168.1.1?", only the router answers, the answer goes into the cache and the packet goes out; a second
 * packet finds the answer in the cache and needs no question; later the entry runs out and the laptop asks again.
 *
 * The scene is the approved design's (prototypes/d11-batch-1.md section 3.1). The addresses (RFC 1918 and RFC 5737),
 * the two MAC addresses (00:00:5E:00:53:10 and 00:00:5E:00:53:01, from the documentation range of RFC 9542 section
 * 2.1.4) and the clock times are example data, and agree with What is IP's ARP step word for word. No message size is
 * shown: no source states one. RFC 826 defines ARP; RFC 1122 what a host does with its ARP cache and a waiting
 * packet; RFC 894 IP in Ethernet frames. Vendor pages carry no defining marker. No standard places ARP at an OSI
 * layer, so the badge rests on two vendors' pages. The analogy (calling out in a crowded room) cites nothing.
 */

// ---------------------------------------------------------------- citations

const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page it starts on. */
const host = (section: string, page: number) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}`, defining: true });

/** RFC 826, 894 and 792 have no section ids, so each section is cited by a text fragment that starts in it. */
const textFragment = (source: string, file: string, section: string, fragment: string) =>
  cite(source, section, { url: `https://www.rfc-editor.org/rfc/${file}.html#:~:text=${fragment}`, defining: true });
/** RFC 826 defines ARP. */
const arp = (section: string, fragment: string) => textFragment('rfc-826', 'rfc826', section, fragment);
const ARP_TITLE = arp('Title', 'An%20Ethernet%20Address%20Resolution%20Protocol');
const ARP_ABSTRACT = arp('Abstract', 'Presented%20here%20is%20a%20protocol');
const ARP_GENERATION = arp('Packet Generation', 'As%20a%20packet%20is%20sent%20down%20through%20the%20network%20layers');
const ARP_RECEPTION = arp('Packet Reception', 'Send%20the%20packet%20to%20the');
const ARP_EXAMPLE = arp('An Example', 'and%20broadcasts%20this%20packet%20to%20everybody');
const ARP_WHY = arp('Why is it done this way??', 'Periodic%20broadcasting%20is%20definitely%20not%20desired');
const ETHERNET_FRAME = textFragment('rfc-894', 'rfc894', 'Frame Format', 'IP%20datagrams%20are%20transmitted%20in%20standard%20Ethernet%20frames');
const ETHERNET_BROADCAST = cite('rfc-894', 'Address Mappings', { url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=It%20should%20also%20use%20ARP' });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

const CISCO = 'cisco-arp-config';
const CISCO_INTRO = vendor(CISCO, 'Address Resolution Protocol', 'ARP finds the hardware address');
const CISCO_LAYERS = vendor(CISCO, 'Layer 2 and Layer 3 Addressing', 'Layer 2 addresses are used for local transmissions');
const CISCO_L3 = vendor(CISCO, 'Layer 2 and Layer 3 Addressing', 'Some of the Layer 3 protocols used');
const CISCO_OVERVIEW = vendor(CISCO, 'Overview of the Address Resolution Protocol', 'Before a device sends a datagram');
const CISCO_REMOTE = vendor(CISCO, 'Overview of the Address Resolution Protocol', 'When the destination device lies on a remote network');
const CISCO_CACHING = vendor(CISCO, 'ARP Caching', 'To minimize broadcasts');
const CISCO_ENTRIES = vendor(CISCO, 'ARP Caching', 'ARP caching is the method of storing network addresses');
const CISCO_TIME = vendor(CISCO, 'Static and Dynamic Entries in the ARP Cache', 'Static routing requires an administrator');
const CISCO_PROXY = vendor(CISCO, 'Proxy ARP', 'Proxy Address Resolution Protocol, as defined in RFC 1027');

const CISCO_DAI = cite('cisco-dai', 'Understanding Dynamic ARP Inspection', {
  url: 'https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-18/configuration_guide/sec/b_1718_sec_9300_cg/configuring_dynamic_arp_inspection.html#:~:text=Host%20B%20generates%20a%20broadcast%20message',
});
const MS_ARP = cite('microsoft-arp', 'Introduction', {
  url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp#:~:text=The%20arp%20command%20displays%20and%20modifies',
});
const MS_ARP_PARAMS = cite('microsoft-arp', 'Parameters', { url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp#parameters' });
const MS_ARP_EXAMPLES = cite('microsoft-arp', 'Examples', { url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp#examples' });
const MS_CACHING = cite('microsoft-arp-caching', 'More information', { url: `${SOURCES['microsoft-arp-caching']!.url}#more-information` });
const OPENBSD_4 = cite('openbsd-man-arp-4', 'DESCRIPTION', { url: 'https://man.openbsd.org/arp.4#DESCRIPTION' });
const OPENBSD_8 = cite('openbsd-man-arp-8', 'DESCRIPTION', { url: 'https://man.openbsd.org/arp.8#DESCRIPTION' });
const MS_GATEWAY = cite('microsoft-tcpip-subnetting', 'Default gateways', {
  url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting#default-gateways',
});

/** No standard places ARP at an OSI layer (RFC 1122 puts it in the Internet model's link layer), so the badge rests on two vendors. */
const CLOUDFLARE_L3 = cite('cloudflare-network-layer', 'What is the OSI model?', { url: `${SOURCES['cloudflare-network-layer']!.url}#what-is-the-osi-model` });

// ---------------------------------------------------------------- events

const LAPTOP_MAC = '00:00:5E:00:53:10';
const ROUTER_MAC = '00:00:5E:00:53:01';
const WEB = '203.0.113.80';

const arpCache: TableDef = {
  id: 'arp-cache',
  title: 'ARP cache',
  by: 'kept by your laptop',
  columns: [
    { key: 'ip', label: 'IP address' },
    { key: 'mac', label: 'MAC address' },
  ],
  keyColumn: 'ip',
  initialRows: [],
  empty: 'Empty. Nothing learned yet.',
};

const traced = (...traces: string[]): Backing => ({ traces });
const row = (ip: string, mac: string): Row => ({ ip, mac });
const status = (text: string, known = false): Cue[] => [{ cue: 'status', arg: text }, ...(known ? [{ cue: 'status-known' } as Cue] : [])];

const table = (id: string, op: TableEvent['op'], summary: string, backing: Backing, o: Partial<TableEvent> = {}): TableEvent => ({
  type: 'table',
  id,
  table: 'arp-cache',
  op,
  summary,
  backing,
  ...o,
});
const miss = (id: string): TableEvent =>
  table(id, 'match', 'Nothing for 192.168.1.1 in the cache.', traced('term-cache', 'fact-cache-first'), { key: '' });
const learned = (id: string): TableEvent =>
  table(id, 'add', `Added to the cache: 192.168.1.1 is at ${ROUTER_MAC}.`, traced('term-cache', 'fact-arp'), { row: row('192.168.1.1', ROUTER_MAC) });

const message = (
  id: string,
  from: string,
  to: string,
  o: Pick<MessageEvent, 'tag' | 'kind' | 'cues' | 'plain' | 'backing'> & { protocol: string; time: string; source: string; destination: string; info: string },
): MessageEvent => {
  const { protocol, time, source, destination, info, ...rest } = o;
  return { type: 'message', id, from, to, over: 'Ethernet', log: { time, source, destination, protocol, info, size: '—' }, ...rest };
};

const ask = (id: string, time: string): MessageEvent =>
  message(id, 'laptop', 'router', {
    tag: 'WHO HAS?',
    kind: 'broadcast',
    protocol: 'ARP',
    time,
    source: LAPTOP_MAC,
    destination: 'ff:ff:ff:ff:ff:ff',
    info: 'ARP: who has 192.168.1.1? Tell 192.168.1.100',
    plain: 'Everyone: who has 192.168.1.1?',
    cues: status('Finding the router'),
    backing: traced('term-arp', 'term-request', 'term-broadcast', 'fact-arp', 'fact-broadcast', 'fact-frame', 'term-gateway'),
  });
const answer = (id: string, time: string): MessageEvent =>
  message(id, 'router', 'laptop', {
    tag: 'IS AT',
    kind: 'response',
    protocol: 'ARP',
    time,
    source: ROUTER_MAC,
    destination: LAPTOP_MAC,
    info: `ARP: 192.168.1.1 is at ${ROUTER_MAC}`,
    plain: `That’s me. My hardware address is ${ROUTER_MAC}.`,
    cues: status('Found the router', true),
    backing: traced('term-arp', 'term-reply', 'term-mac', 'fact-arp', 'fact-frame', 'term-gateway'),
  });

const step1: SceneEvent[] = [miss('s1-miss'), ask('s1-ask', '0.000s')];

const step2: SceneEvent[] = [answer('s2-answer', '0.002s')];

const step3: SceneEvent[] = [
  learned('s3-add'),
  message('s3-packet', 'laptop', 'router', {
    tag: 'PACKET',
    kind: 'request',
    protocol: 'IP',
    time: '0.003s',
    source: LAPTOP_MAC,
    destination: ROUTER_MAC,
    info: `Frame to ${ROUTER_MAC}, carrying the packet for ${WEB}`,
    plain: `The laptop sends the waiting packet to the router, in a frame addressed to ${ROUTER_MAC}.`,
    cues: status('Sent to the router'),
    backing: traced('fact-frame', 'fact-wait', 'fact-arp', 'term-arp'),
  }),
];

const step4: SceneEvent[] = [
  table('s4-hit', 'match', `In the cache: 192.168.1.1 is at ${ROUTER_MAC}.`, traced('term-cache', 'fact-cache-first'), { key: '192.168.1.1' }),
  message('s4-packet', 'laptop', 'router', {
    tag: 'PACKET',
    kind: 'request',
    protocol: 'IP',
    time: '—',
    source: LAPTOP_MAC,
    destination: ROUTER_MAC,
    info: `In the cache: straight to ${ROUTER_MAC}, no ARP needed`,
    plain: 'The answer is in the cache, so the laptop sends the frame straight to the router.',
    cues: status('Sent: no question needed'),
    backing: traced('fact-cache-first', 'fact-frame', 'term-arp', 'term-cache'),
  }),
];

const step5: SceneEvent[] = [
  table('s5-remove', 'remove', 'The entry ran out and is removed.', traced('term-timeout', 'fact-life'), { key: '192.168.1.1' }),
  { ...miss('s5-miss'), backing: traced('term-cache', 'fact-cache-first', 'fact-ask-again') },
  ask('s5-ask', '—'),
  answer('s5-answer', '—'),
  learned('s5-add'),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'arp',
  title: 'ARP',
  subtitle: 'Finding the hardware address',
  level: 'beginner',
  certTags: [],
  summary:
    'Watch your laptop ask everyone on your home network, “Who has 192.168.1.1?” Only the router answers, and your laptop keeps the answer, so it doesn’t have to ask again.',
  figure: 'net-map',
  backing: { traces: ['term-arp', 'term-mac', 'fact-arp', 'fact-cache-first', 'why-1'] },
  units: [
    {
      id: 'arp',
      name: 'ARP',
      fullName: 'Address Resolution Protocol',
      purpose: 'Finding the MAC address for an IP address',
      osi: { layers: [3], cite: [CISCO_L3, CLOUDFLARE_L3] },
      backing: { traces: ['term-arp', 'fact-defined', 'fact-job'] },
      scene: {
        title: 'Finding the router’s hardware address',
        views: ['network'],
        layers: ['ip:web'],
        labels: { laptop: 'Has a packet for example.net', router: `192.168.1.1\n${ROUTER_MAC}` },
        start: [{ cue: 'hide', arg: 'resolver' }],
        panel: { type: 'table', table: arpCache },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'broadcast', label: 'Broadcast to everyone' },
            { kind: 'response', label: 'Reply' },
            { kind: 'request', label: 'Packet' },
          ],
        },
        parties: [],
        backing: { traces: ['term-arp', 'term-cache', 'term-mac', 'term-broadcast', 'term-reply', 'term-gateway', 'fact-frame'] },
      },
      overview: {
        hook: 'Your laptop knows your router’s IP address, but on your home network, frames go to a MAC address, a card’s hardware number. ARP finds it. Your laptop asks everyone at once, “Who has 192.168.1.1?”, only the router answers, and your laptop keeps the answer so it doesn’t have to ask again.',
        hookBacking: { traces: ['why-2', 'term-mac', 'term-arp', 'fact-arp', 'fact-cache-first', 'why-1'] },
        description:
          'ARP turns an IP address into a MAC address on your own network. It asks only when the answer isn’t already in its cache, and the cache forgets after a while.',
        backing: { traces: ['fact-job', 'term-arp', 'fact-cache-first', 'fact-life', 'fact-local'] },
        facts: [
          { label: 'Asks', value: 'who has this IP address?', backing: { traces: ['term-request'] } },
          { label: 'Answered by', value: 'only the owner of that address', backing: { traces: ['fact-arp'] } },
          { label: 'Kept in', value: 'the ARP cache', backing: { traces: ['term-cache'] } },
          { label: 'Reaches', value: 'only your own network', backing: { traces: ['fact-local'] } },
          { label: 'OSI layer', value: '3, network', backing: { traces: ['fact-osi'] } },
          { label: 'Defined in', value: 'RFC 826', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'who-has',
          title: 'Who has 192.168.1.1?',
          sub: 'Asking everyone',
          narrative:
            'Your laptop has a packet for example.net, 203.0.113.80. That’s outside its network, so the packet’s next stop is the **default gateway**, your router, 192.168.1.1. To put the packet in a frame, the laptop needs the router’s **MAC address**. It looks in its **ARP cache**: empty. So it asks everyone on the network at once, at the **broadcast** address ff:ff:ff:ff:ff:ff: “Who has 192.168.1.1? Tell 192.168.1.100.” That question is an **ARP request**. The packet waits.',
          deep: [
            {
              text: 'A request names the asker’s own MAC address and IP address, and the IP address it wants. It leaves the MAC address it wants blank, because that is what it is looking for.',
              cite: [ARP_GENERATION, CISCO_OVERVIEW],
            },
          ],
          facts: [
            { label: 'Looking for', value: '192.168.1.1, the router', backing: { traces: ['term-gateway', 'fact-local'] } },
            { label: 'In the cache', value: 'no answer yet', backing: { traces: ['term-cache', 'fact-cache-first'] } },
            { label: 'Sent to', value: 'everyone: ff:ff:ff:ff:ff:ff', backing: { traces: ['term-broadcast', 'fact-broadcast'] } },
          ],
          events: step1,
          backing: {
            traces: ['term-gateway', 'fact-local', 'why-2', 'term-mac', 'fact-frame', 'term-cache', 'fact-cache-first', 'term-request', 'term-broadcast', 'fact-broadcast', 'fact-arp', 'fact-wait'],
          },
        },
        {
          id: 'only-the-owner',
          title: 'Only the owner answers',
          sub: 'The router replies',
          narrative:
            'Every device on the network reads the question. Only the router has 192.168.1.1, so only the router answers, and it answers the laptop directly, not everyone: “192.168.1.1 is at 00:00:5E:00:53:01.” Any other device that heard the question ignores it. That answer is an **ARP reply**.',
          deep: [
            {
              text: 'The router also writes down the laptop’s addresses from the question, so it can send straight back without asking.',
              cite: [ARP_RECEPTION, ARP_EXAMPLE, CISCO_DAI],
            },
          ],
          facts: [
            { label: 'Who answers', value: 'only the router, which has 192.168.1.1', backing: { traces: ['fact-arp', 'term-reply'] } },
            { label: 'Sent to', value: 'the laptop alone', backing: { traces: ['fact-arp'] } },
            { label: 'Answer', value: ROUTER_MAC, backing: { traces: ['term-reply', 'fact-arp'] } },
          ],
          events: step2,
          backing: { traces: ['fact-broadcast', 'fact-arp', 'term-reply', 'term-mac'] },
        },
        {
          id: 'cache-fills',
          title: 'The cache fills',
          sub: 'Now it can send',
          narrative:
            'The laptop writes the answer into its ARP cache: 192.168.1.1 is at 00:00:5E:00:53:01. Then it sends the waiting packet, in a frame addressed to the router’s MAC address.',
          deep: [
            {
              text: 'At each hop, a router finds the link-layer address of the next hop and puts the packet in a new frame for that link.',
              cite: [rfc('rfc-1812', '5.2.1.2', true), ETHERNET_FRAME],
            },
          ],
          facts: [
            { label: 'Cache now', value: `192.168.1.1 → ${ROUTER_MAC}`, backing: { traces: ['term-cache', 'fact-arp'] } },
            { label: 'Frame sent to', value: `${ROUTER_MAC}, the router`, backing: { traces: ['fact-frame', 'fact-arp'] } },
            { label: 'Packet for', value: `${WEB}, example.net`, backing: { traces: ['fact-wait', 'fact-frame'] } },
          ],
          events: step3,
          backing: { traces: ['term-cache', 'fact-arp', 'fact-frame', 'fact-wait', 'pattern'] },
        },
        {
          id: 'send-again',
          title: 'Send again: the cache answers',
          sub: 'No question needed',
          narrative:
            'A moment later the laptop has another packet for example.net. It looks in its ARP cache and finds 192.168.1.1 there, so it sends the frame straight to the router’s MAC address. No question, no broadcast. Keeping the answer saves a broadcast for every packet.',
          deep: [
            {
              text: 'ARP doesn’t broadcast on a timer. It asks only when a device needs an address it doesn’t have.',
              cite: [ARP_WHY, CISCO_CACHING],
            },
          ],
          facts: [
            { label: 'In the cache', value: `192.168.1.1 → ${ROUTER_MAC}`, backing: { traces: ['term-cache', 'fact-cache-first'] } },
            { label: 'Broadcasts', value: 'none', backing: { traces: ['fact-cache-first', 'why-1'] } },
            { label: 'ARP messages', value: 'none', backing: { traces: ['fact-cache-first'] } },
          ],
          events: step4,
          backing: { traces: ['term-cache', 'fact-cache-first', 'fact-frame', 'why-1'] },
        },
        {
          id: 'entry-runs-out',
          title: 'The entry runs out: ask again',
          sub: 'The cache forgets',
          narrative:
            'The cache doesn’t keep answers forever. After a while the entry is removed, and how long that takes depends on the device. The next time the laptop sends to the router, the cache has no answer, so it asks everyone again. The router answers as before, and the cache fills once more.',
          deep: [
            {
              text: 'Many devices let you change how long entries are kept, for example on a network where entries come and go a lot.',
              cite: [host('2.3.2.1', 22), CISCO_TIME],
            },
          ],
          facts: [
            { label: 'The entry', value: 'removed after a while', backing: { traces: ['fact-life', 'term-timeout'] } },
            { label: 'How long', value: 'depends on the device', backing: { traces: ['fact-life'] } },
            { label: 'Then', value: 'asks everyone again', backing: { traces: ['fact-ask-again'] } },
          ],
          events: step5,
          backing: { traces: ['fact-life', 'term-timeout', 'fact-ask-again', 'fact-arp', 'term-cache', 'fact-cache-first'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'To send on your own network, a device needs the next device’s MAC address. ARP finds it: it asks everyone, only the owner answers, and the answer is kept for next time.',
            cite: [ARP_GENERATION, ARP_RECEPTION, ARP_EXAMPLE, CISCO_OVERVIEW],
          },
          {
            id: 'lead-2',
            text: 'Like calling out in a crowded room, “Who’s Sam?”: only Sam waves back, and you remember Sam’s face so you don’t have to shout next time.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-arp',
            idea: '“Who has this address?”',
            name: 'ARP',
            cite: [ARP_ABSTRACT, ARP_GENERATION, CISCO_INTRO, MS_ARP],
          },
          {
            id: 'term-mac',
            idea: 'The hardware number of a network card',
            name: 'MAC address',
            cite: [rfc('rfc-9724', '2.1'), CISCO_LAYERS],
          },
          {
            id: 'term-cache',
            idea: 'Your device’s list of IP addresses and the MAC address that goes with each',
            name: 'ARP cache',
            cite: [host('2.3.2.1', 22), MS_ARP, CISCO_INTRO, OPENBSD_4],
          },
          {
            id: 'term-broadcast',
            idea: 'Shouting to every device on the network at once, because you don’t know who to ask',
            name: 'Broadcast',
            cite: [rfc('rfc-919', '3', true), ETHERNET_BROADCAST, CISCO_OVERVIEW],
          },
          {
            id: 'term-request',
            idea: 'The question to everyone: who has this IP address?',
            name: 'ARP request',
            cite: [ARP_GENERATION, CISCO_OVERVIEW, CISCO_DAI],
          },
          {
            id: 'term-reply',
            idea: 'The answer, sent back to the one who asked: that’s me, at this MAC address',
            name: 'ARP reply',
            cite: [ARP_RECEPTION, ARP_EXAMPLE, CISCO_OVERVIEW],
          },
          {
            id: 'term-gateway',
            idea: 'The way out of your network: your router',
            name: 'Default gateway',
            cite: [host('3.3.1.2', 48), MS_GATEWAY, CISCO_REMOTE],
          },
          {
            id: 'term-timeout',
            idea: 'How long an answer stays in the cache before it’s removed',
            name: 'Cache timeout',
            cite: [host('2.3.2.1', 22), CISCO_ENTRIES, OPENBSD_4],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Look in the cache', 'Ask everyone', 'The owner replies', 'Keep the answer', 'Send the frame'],
          note: 'What a device does each time it needs a neighbour’s MAC address, in outline.',
          cite: [ARP_GENERATION, ARP_RECEPTION, ARP_EXAMPLE, CISCO_OVERVIEW, OPENBSD_4],
        },
        why: [
          {
            id: 'why-1',
            text: 'Keeping answers saves the network a broadcast for every packet: ARP asks only when it needs to.',
            cite: [CISCO_CACHING, ARP_WHY],
          },
          {
            id: 'why-2',
            text: 'On your own network, devices deliver frames by MAC address, so an IP address alone isn’t enough to send.',
            cite: [ARP_ABSTRACT, ETHERNET_FRAME, CISCO_LAYERS],
          },
        ],
        deep: [
          {
            id: 'deep-spoof',
            text: 'ARP doesn’t check answers. A device on your network can send forged replies, called ARP spoofing, so that others send their traffic through it.',
            cite: [CISCO_DAI, rfc('rfc-5227', '5')],
          },
          {
            id: 'deep-ipv6',
            text: 'IPv6 doesn’t use ARP: its Neighbor Discovery does the same job.',
            cite: [rfc('rfc-4861', '1', true), rfc('rfc-4861', '3.1', true)],
          },
          {
            id: 'deep-probe',
            text: 'Many devices that have just got an address first check that nobody else has it, with an ARP probe.',
            cite: [rfc('rfc-5227', '2.1.1', true), rfc('rfc-5227', '1.2')],
          },
        ],
        facts: [
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 826, An Ethernet Address Resolution Protocol (1982)', cite: [ARP_TITLE, rfc('rfc-5227', '1.2')] },
          { id: 'fact-osi', label: 'OSI layer', value: '3, network', cite: [CISCO_L3, CLOUDFLARE_L3] },
          {
            id: 'fact-job',
            label: 'What it does',
            value: 'finds the MAC address that goes with an IP address',
            cite: [ARP_ABSTRACT, CISCO_INTRO],
          },
          {
            id: 'fact-arp',
            label: 'ARP',
            value:
              'asks everyone on the network at once, “who has this address?”, and gives its own; every device reads the question, but only the owner replies with its MAC address, straight back, and the others ignore it; the asker keeps the answer in its ARP cache',
            cite: [ARP_GENERATION, ARP_RECEPTION, ARP_EXAMPLE, CISCO_OVERVIEW, CISCO_DAI],
          },
          {
            id: 'fact-broadcast',
            label: 'Sent to',
            value: 'ff:ff:ff:ff:ff:ff, the broadcast address: every device on the network reads it',
            cite: [ETHERNET_BROADCAST, rfc('rfc-9542', '2.1.1'), CISCO_DAI, rfc('rfc-5227', '1.2')],
          },
          {
            id: 'fact-cache-first',
            label: 'Before asking',
            value: 'a device looks in its ARP cache; if the answer is there, it sends at once and asks nobody',
            cite: [ARP_GENERATION, CISCO_OVERVIEW, MS_CACHING],
          },
          {
            id: 'fact-frame',
            label: 'On the network',
            value: 'each IP packet travels in a frame, such as an Ethernet frame, addressed to the next device’s MAC address',
            cite: [ETHERNET_FRAME, ARP_ABSTRACT, CISCO_OVERVIEW],
          },
          {
            id: 'fact-life',
            label: 'How long it’s kept',
            value: 'an entry is removed after a while; how long depends on the device, and it can be changed',
            cite: [host('2.3.2.1', 22), CISCO_ENTRIES, CISCO_TIME, OPENBSD_4, MS_CACHING],
          },
          {
            id: 'fact-ask-again',
            label: 'When the entry is gone',
            value: 'the next packet means asking everyone again',
            cite: [ARP_GENERATION, CISCO_OVERVIEW, MS_CACHING],
          },
          {
            id: 'fact-local',
            label: 'Reaches',
            value: 'only your own network: routers don’t pass the broadcast on, so for anything farther a device asks for its router’s MAC address',
            cite: [CISCO_PROXY, CISCO_REMOTE, ARP_GENERATION, host('3.3.1', 47)],
          },
          {
            id: 'fact-command',
            label: 'To see it',
            value: 'on Windows and OpenBSD, arp -a lists the cache and arp -d deletes an entry',
            cite: [MS_ARP_PARAMS, MS_ARP_EXAMPLES, OPENBSD_8],
          },
          {
            id: 'fact-wait',
            label: 'While it waits',
            value: 'the device keeps the packet, at least the latest one, and sends it once the answer comes',
            cite: [host('2.3.2.2', 24), OPENBSD_4],
          },
        ],
      },
      practice: [
        {
          id: 'cache-hit',
          prompt: 'Your laptop’s ARP cache already has 192.168.1.1 → 00:00:5E:00:53:01. It has another packet for the router. What does it do?',
          options: [
            {
              text: 'Sends the frame straight to 00:00:5E:00:53:01.',
              feedback: 'Right. The answer is in the cache, so there’s nothing to ask.',
              cite: [ARP_GENERATION, CISCO_OVERVIEW],
            },
            {
              text: 'Asks everyone “Who has 192.168.1.1?” again.',
              feedback: 'Not quite. It asks only when the cache has no answer, as after the entry runs out.',
              cite: [ARP_GENERATION, CISCO_CACHING],
            },
            {
              text: 'Asks the router to confirm its address first.',
              feedback: 'Not quite. While the answer is in its cache, the laptop just uses it.',
              cite: [MS_CACHING, ARP_GENERATION],
            },
          ],
          answer: 0,
        },
        {
          id: 'who-answers',
          prompt: 'Your laptop asks everyone, “Who has 192.168.1.1?” Your phone, on the same Wi-Fi, hears it. What does the phone do?',
          options: [
            {
              text: 'Ignores it: it isn’t 192.168.1.1.',
              feedback: 'Yes. Every device reads the question, but only the one with that address answers.',
              cite: [ARP_RECEPTION, CISCO_OVERVIEW],
            },
            {
              text: 'Answers with its own MAC address.',
              feedback: 'Not quite. Only the device that has 192.168.1.1 answers, here the router.',
              cite: [ARP_RECEPTION, CISCO_OVERVIEW],
            },
            {
              text: 'Passes the question on to other networks.',
              feedback: 'Not quite. ARP stays on your own network.',
              cite: [CISCO_PROXY, ARP_GENERATION],
            },
          ],
          answer: 0,
        },
        {
          id: 'far-away',
          prompt: 'Your laptop wants to send to example.net, 203.0.113.80, on another network. Whose MAC address does it ask for?',
          options: [
            {
              text: 'The router’s, 192.168.1.1.',
              feedback: 'Right. The packet’s next stop is the default gateway, so that’s the MAC address it needs.',
              cite: [ARP_GENERATION, CISCO_REMOTE],
            },
            {
              text: 'example.net’s, 203.0.113.80.',
              feedback: 'Not quite. ARP only reaches your own network, and example.net isn’t on it.',
              cite: [CISCO_PROXY, CISCO_REMOTE, ARP_GENERATION],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
