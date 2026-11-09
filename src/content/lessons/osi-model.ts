import { defineLesson } from '../define';
import type { MessageEvent, MessageLabels, NoteEvent } from '../schema';
import { cite } from '../sources';

/**
 * OSI Model, the first lesson of the Networking track and the first in the cited shape. One message goes from a
 * laptop to a web server: down the laptop's seven layers, one step for each, each from 7 to 2 saying its own job and
 * adding its header; across the cable to a router, which reads only up to layer 3 and adds its own header 2 going back
 * down; and up the server's seven layers, each from 2 to 7 reading and removing its twin's header. The last step lights
 * the twins together. X.200 defines the model, so every citation of it is marked as the defining standard.
 */

// ---------------------------------------------------------------- citations

const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
/** X.200's PDF page for each section cited (spec §6, measured with pdftotext). */
const X200_PAGE: Record<string, number> = { '1.1': 5, '1.2': 5, '5.2.1.3': 10, '5.2.2.1': 10, '5.2.2.3': 11, '5.2.2.4': 12, '5.2.2.5': 12, '5.2.2.7': 12, '5.6.1.1': 19, '5.6.1.3': 19, '5.6.1.4': 19, '6.1.2': 32, '6.1.3': 32, '6.1.6': 33, '6.2.1': 33, '7.1.2.1': 36, '7.2.1.2': 37, '7.2.2.2': 37, '7.2.2.3': 37, '7.3.1.4': 39, '7.3.2.1': 39, '7.3.3.1.1': 39, '7.4.2.1': 41, '7.4.2.3': 41, '7.4.2.4': 41, '7.4.2.5': 41, '7.4.4.1.1': 42, '7.5.2.1': 45, '7.5.2.3': 45, '7.5.2.4': 45, '7.5.4.2.1': 48, '7.6.2.1': 50, '7.6.2.2': 50, '7.6.4.5': 52, '7.7.2': 53, '7.7.4.6.1': 56 };
const x200 = (section: string) => cite('itu-x200', section, { url: `${X200}#page=${X200_PAGE[section]}`, defining: true });
/** The Foreword, on PDF page 2, says the same text is published as ISO/IEC 7498-1. */
const X200_FOREWORD = cite('itu-x200', 'Foreword', { url: `${X200}#page=2`, defining: true });

const NIST = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf';
/** NIST SP 800-77r1 §2.1 starts on PDF page 20, and its footnote 6 (what a header is) sits at the foot of that page. */
const NIST_2_1 = cite('nist-sp800-77r1', '2.1', { url: `${NIST}#page=20` });
const NIST_FOOTNOTE_6 = cite('nist-sp800-77r1', '2.1, footnote 6', { url: `${NIST}#page=20` });

/**
 * RFC 1122's page for each section cited, from its contents and the html's `id="page-N"` marks: the html has no id for
 * a section below the top level, so a section is cited by the page it starts on.
 */
const RFC1122_PAGE: Record<string, number> = { '1.1.1': 6, '1.1.3': 8, '1.3.3': 17 };
const rfc1122 = (section: string, defining?: true) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${RFC1122_PAGE[section]}`, ...(defining ? { defining } : {}) });

const MICROSOFT = 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model';
const microsoft = (section: string, fragment: string) => cite('microsoft-osi', section, { url: `${MICROSOFT}#${fragment}` });
/** The introduction's quotation from the OSI model, from its name to "each layer offers specific services to higher layers". */
const MICROSOFT_INTRO_NAME = microsoft('Introduction', ':~:text=The%20ISO%20Open%20Systems%20Interconnection,specific%20services%20to%20higher%20layers');
/** The same quotation's second sentence: services offered upward, and the details of how they are done kept from the layers above. */
const MICROSOFT_INTRO_SHIELD = microsoft('Introduction', ':~:text=Each%20layer%20offers%20specific%20services,how%20the%20services%20are%20implemented');

const CISCO =
  'https://www.cisco.com/c/en/us/td/docs/iosxr/cisco8000/interfaces-and-hardware-component/configuration-guide/interfaces-and-hardware-component-config-cisco8000/ip-in-ip-tunnels-overview/ip-in-ip-decapsulation.html';
/** The page's first section; the sentence that decapsulation removes the outer IP header introduces it. */
const CISCO_DECAP = cite('cisco-ipip-decap', 'IP-in-IP Decapsulation', { url: `${CISCO}#ip-in-ip-decapsulation__d32401e22` });

// ---------------------------------------------------------------- events

const NAME = ['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'] as const;
type Place = 'laptop' | 'router' | 'server';
const WHERE: Record<Place, string> = { laptop: 'Laptop', router: 'Router', server: 'Web server' };

/** The log's Layer cell: `4 Transport`. */
const layerCell = (n: number): string => `${n} ${NAME[n]}`;

/** Layers `n` up to 7: the headers a message carries once layer `n` has added its own. */
const from = (n: number): number[] => Array.from({ length: 8 - n }, (_, i) => n + i);
/** All six headers, from layer 2 (outermost) to layer 7. */
const ALL = from(2);

/** One layer of one machine doing its job: it lights that block. */
function layer(o: { id: string; place: Place; n: number; plain: string; labels: MessageLabels; traces: string[] }): NoteEvent {
  return {
    type: 'note',
    id: o.id,
    log: { where: WHERE[o.place], layer: layerCell(o.n) },
    plain: o.plain,
    cues: [{ cue: 'layer', arg: `${o.place}:${o.n}` }],
    labels: o.labels,
    backing: { traces: o.traces },
  };
}

/** The bits riding one cable, from one machine's layer 1 to the next one's. */
function bits(o: { id: string; from: Place; to: Place; plain: string; traces: string[] }): MessageEvent {
  return {
    type: 'message',
    id: o.id,
    from: o.from,
    to: o.to,
    tag: '0101',
    kind: 'request',
    log: { where: `${WHERE[o.from]} → ${WHERE[o.to]}`, layer: layerCell(1) },
    plain: o.plain,
    labels: { list: ALL },
    backing: { traces: o.traces },
  };
}

/** Layer `n` lit in every stack that has it, with its peer lines: end to end for 4 to 7, hop by hop for 1 to 3. */
function peer(n: number): NoteEvent {
  const endToEnd = n >= 4;
  return {
    type: 'note',
    id: `peer-${n}`,
    log: { where: endToEnd ? 'Laptop ↔ Web server' : 'Laptop ↔ Router ↔ Web server', layer: layerCell(n) },
    plain: endToEnd
      ? `Layer ${n} on your laptop works with layer ${n} on the web server.`
      : `Layer ${n} works with its twin one hop at a time, through the router.`,
    cues: [{ cue: 'peer', arg: String(n) }],
    labels: { list: [] },
    backing: { traces: endToEnd ? ['term-peer', 'why-2'] : ['term-peer', 'lead-5'] },
  };
}

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'osi-model',
  title: 'OSI Model',
  subtitle: 'One big job, split into seven layers',
  level: 'beginner',
  certTags: ['a-plus', 'network-plus', 'ccna'],
  summary: 'Watch one message go from your laptop to a web server: down seven layers, through a router, and up seven more.',
  figure: 'osi',
  overrides: [
    {
      limit: 'steps',
      max: 10,
      reason: 'One Watch step for each layer on the way down, so a beginner sees each layer’s own job; then the router, the way up and the twins.',
    },
  ],
  backing: { traces: ['lead-1', 'lead-2', 'lead-3', 'lead-4', 'lead-5'] },
  units: [
    {
      id: 'osi',
      name: 'OSI Model',
      fullName: 'Open Systems Interconnection model',
      purpose: 'Seven jobs, stacked',
      // The lesson is about every layer, so no one layer is its badge (direction doc §6.4).
      osi: 'spans',
      backing: { traces: ['lead-1', 'lead-2'] },
      scene: {
        title: 'Your laptop to a web server',
        views: ['network'],
        panel: { type: 'labels' },
        labels: {
          'layer-1': 'PHYSICAL',
          'layer-2': 'DATA LINK',
          'layer-3': 'NETWORK',
          'layer-4': 'TRANSPORT',
          'layer-5': 'SESSION',
          'layer-6': 'PRESENTATION',
          'layer-7': 'APPLICATION',
          laptop: 'Your laptop',
          'laptop-sub': 'sends',
          router: 'Router',
          'router-sub': 'passes it on',
          server: 'Web server',
          'server-sub': 'receives',
          plate: 'OSI REFERENCE MODEL · SEVEN LAYERS',
        },
        log: {
          title: 'What each layer did',
          // As the mockup sets them: where it happened in words, the layer in the mono face, then what it did.
          columns: [
            { key: 'where', label: 'Where', width: 220, prose: true },
            { key: 'layer', label: 'Layer', width: 150 },
            { key: 'plain', label: 'What happened' },
          ],
          legend: [
            { kind: 'request', label: 'Bits on the cable' },
            { kind: 'note', label: 'A layer’s job' },
          ],
        },
        parties: [],
        backing: { traces: ['lead-1', 'lead-2', 'lead-4', 'lead-5', 'fact-3'] },
      },
      overview: {
        hook: 'Sending a message across a network is one big job. The OSI model splits it into seven smaller jobs, stacked one on top of another. Each one is a **layer**. A layer does its own job and leans on the layer below it.',
        hookBacking: { traces: ['lead-1', 'lead-2'] },
        description: 'Follow one message from your laptop to a web server: down seven layers, through a router, and up seven more.',
        backing: { traces: ['lead-1', 'lead-4', 'lead-5'] },
        facts: [
          { label: 'Layers', value: '7', backing: { traces: ['lead-1'] } },
          { label: 'Example', value: 'a laptop and a web server', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'application',
          title: 'Application Layer',
          sub: 'The message enters at the top',
          narrative:
            'An app on your laptop wants to send a message to a web server. It hands the message to the top layer: **layer 7, the Application Layer**. Layer 7 adds a small note of its own in front of the message. That note is called a **header**. It is written for layer 7 on the other side: the same layer, on the web server.',
          deep: [
            {
              text: 'In X.200, the Application Layer is an application’s only way into the OSI environment. As the highest layer, it has no boundary with a layer above it.',
              cite: [x200('7.1.2.1')],
            },
          ],
          facts: [
            { label: 'Layer', value: '7 Application', backing: { traces: ['lead-1'] } },
            { label: 'Adds', value: 'its own header', backing: { traces: ['lead-3'] } },
          ],
          events: [
            layer({
              id: 'laptop-7',
              place: 'laptop',
              n: 7,
              plain: 'Takes the app’s message and adds header 7 in front.',
              labels: { list: [7], mark: { n: 7, kind: 'new' } },
              traces: ['lead-1', 'lead-3'],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-3', 'lead-6'] },
        },
        {
          id: 'presentation',
          title: 'Presentation Layer',
          sub: 'Both ends agree how the data is written',
          narrative:
            'Layer 7 hands the bundle down to **layer 6, the Presentation Layer**. Its job is about how the data is written. Layer 6 gives your laptop and the web server **a common way to represent the data**, and the two ends agree on how it is written while it travels. So the apps at either end don’t have to sort that out themselves, and the message keeps its meaning on the way. Then layer 6 adds **its own header** in front and passes the bundle down.',
          deep: [
            {
              text: 'In X.200, the way data is written while it travels between two systems is its **transfer syntax**. Layer 6 selects transfer syntaxes that both ends accept, and keeps the meaning of the application’s data intact on the way.',
              cite: [x200('6.1.2'), x200('7.2.1.2'), x200('7.2.2.3')],
            },
            {
              text: 'The internet’s own protocols have no separate presentation layer: their application layer essentially combines the functions of OSI’s Presentation and Application layers.',
              cite: [rfc1122('1.1.3', true)],
            },
          ],
          facts: [
            { label: 'Layer', value: '6 Presentation', backing: { traces: ['lead-1'] } },
            { label: 'Gives both ends', value: 'a common way to represent the data', backing: { traces: ['job-6'] } },
          ],
          events: [
            layer({
              id: 'laptop-6',
              place: 'laptop',
              n: 6,
              plain: 'Gives both ends a common way to represent the data, and adds header 6.',
              labels: { list: from(6), mark: { n: 6, kind: 'new' } },
              traces: ['lead-1', 'lead-3', 'job-6'],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-2', 'lead-3', 'job-6', 'term-encap'] },
        },
        {
          id: 'session',
          title: 'Session Layer',
          sub: 'Opens the conversation and keeps it in order',
          narrative:
            'Next, **layer 5, the Session Layer**, looks after the conversation itself. It sets up a **session** between your laptop and the web server, keeps their exchange in good order, and ends the session neatly when they’re done. Along the way, it can set **synchronization points**, a kind of checkpoint. Later, the two ends can agree to reset the session to one of those points. Then layer 5 adds its own header and passes the bundle down.',
          deep: [
            {
              text: 'In X.200, the Session Layer’s services include setting up and releasing a **session-connection**, sending data over it, and synchronization. Synchronization lets the two ends mark points in their dialogue, and later go back to one they agree on.',
              cite: [x200('7.3.1.4'), x200('7.3.3.1.1')],
            },
          ],
          facts: [
            { label: 'Layer', value: '5 Session', backing: { traces: ['lead-1'] } },
            { label: 'Sets up', value: 'a session between the two ends', backing: { traces: ['job-5'] } },
            { label: 'Can set', value: 'synchronization points', backing: { traces: ['job-5'] } },
          ],
          events: [
            layer({
              id: 'laptop-5',
              place: 'laptop',
              n: 5,
              plain: 'Sets up the session between the two ends, and adds header 5.',
              labels: { list: from(5), mark: { n: 5, kind: 'new' } },
              traces: ['lead-1', 'lead-3', 'job-5'],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-3', 'job-5', 'term-encap'] },
        },
        {
          id: 'transport',
          title: 'Transport Layer',
          sub: 'Carries the data from end to end',
          narrative:
            '**Layer 4, the Transport Layer**, works **end to end**: only your laptop and the web server take part in it, never a machine in between. Its job is to carry the data across for the layers above, so they don’t have to worry about how. Depending on the protocol, it can split the data into **pieces**, keep the pieces in order, recover from errors and control how fast the data flows. Then layer 4 adds its own header and passes the bundle down.',
          deep: [
            {
              text: 'In X.200, Transport Layer functions can include end-to-end sequence control, error detection and recovery, segmenting, and flow control. Which ones are used depends on the quality of the network service below.',
              cite: [x200('7.4.2.5'), x200('7.4.4.1.1')],
            },
            {
              text: 'On the internet, the two main transport protocols are **TCP**, which is reliable and also puts data back in order and controls its flow, and **UDP**, a connectionless “datagram” service.',
              cite: [rfc1122('1.1.3', true), NIST_2_1],
            },
          ],
          facts: [
            { label: 'Layer', value: '4 Transport', backing: { traces: ['lead-1'] } },
            { label: 'Works', value: 'end to end', backing: { traces: ['job-4', 'why-2'] } },
            { label: 'Can', value: 'split the data into pieces and keep them in order', backing: { traces: ['job-4'] } },
          ],
          events: [
            layer({
              id: 'laptop-4',
              place: 'laptop',
              n: 4,
              plain: 'Takes charge of carrying the data end to end, and adds header 4.',
              labels: { list: from(4), mark: { n: 4, kind: 'new' } },
              traces: ['lead-1', 'lead-3', 'job-4'],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-2', 'lead-3', 'job-4', 'why-2', 'term-encap'] },
        },
        {
          id: 'network',
          title: 'Network Layer',
          sub: 'Finds the way across networks',
          narrative:
            '**Layer 3, the Network Layer**, works out the way. Between your laptop and the web server there can be several networks, one after another, with routers passing the message on. Layer 3 finds a **route** to the web server’s **network address**, so the message can cross them all. The layers above never need to know which way it goes. Then layer 3 adds its own header and passes the bundle down.',
          deep: [
            {
              text: 'In X.200, any relaying between the two end systems happens in the Network Layer or below, and the Transport Layer is relieved of any concern with routing.',
              cite: [x200('7.4.2.4'), x200('7.5.2.4')],
            },
            {
              text: 'On the internet, the main network layer protocol is **IP**, the Internet Protocol. IP itself guarantees no delivery: data may arrive out of order or not at all, and the layers above make delivery reliable when that is needed.',
              cite: [rfc1122('1.1.3', true), NIST_2_1],
            },
          ],
          facts: [
            { label: 'Layer', value: '3 Network', backing: { traces: ['lead-1'] } },
            { label: 'Finds', value: 'a route across networks', backing: { traces: ['job-3'] } },
            { label: 'Uses', value: 'network addresses', backing: { traces: ['job-3'] } },
          ],
          events: [
            layer({
              id: 'laptop-3',
              place: 'laptop',
              n: 3,
              plain: 'Finds a route to the web server’s network address, and adds header 3.',
              labels: { list: from(3), mark: { n: 3, kind: 'new' } },
              traces: ['lead-1', 'lead-3', 'job-3'],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-3', 'lead-5', 'job-3', 'term-encap'] },
        },
        {
          id: 'data-link',
          title: 'Data Link Layer',
          sub: 'Carries it to the next machine',
          narrative:
            '**Layer 2, the Data Link Layer**, looks after one stretch of the trip: **one link**, from your laptop to the next machine along the way. Here, that’s the router. It also detects **errors** that happen down in layer 1, on the cable. Layer 2 adds **header 2** in front. Now the message carries six headers, one for each layer from 2 to 7. Wrapping each layer’s bundle inside a bigger one on the way down is called **encapsulation**.',
          deep: [
            {
              text: 'In X.200, a data link is built on one or more physical connections. The Data Link Layer recognizes a run of bits as one unit of its own, which is sometimes called framing, and it detects errors that occur in the Physical Layer, and possibly corrects them.',
              cite: [x200('7.6.2.1'), x200('7.6.2.2'), x200('7.6.4.5')],
            },
          ],
          facts: [
            { label: 'Layer', value: '2 Data Link', backing: { traces: ['lead-1'] } },
            { label: 'Carries it', value: 'one link at a time', backing: { traces: ['job-2'] } },
            { label: 'Detects', value: 'errors from layer 1', backing: { traces: ['lead-1', 'job-2'] } },
            { label: 'Called', value: 'encapsulation', backing: { traces: ['term-encap'] } },
          ],
          events: [
            layer({
              id: 'laptop-2',
              place: 'laptop',
              n: 2,
              plain: 'Handles the first link, to the router, and adds header 2 in front.',
              labels: { list: from(2), mark: { n: 2, kind: 'new' } },
              traces: ['lead-1', 'lead-3', 'lead-5', 'job-2'],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-3', 'lead-4', 'lead-5', 'job-2', 'term-encap'] },
        },
        {
          id: 'physical',
          title: 'Physical Layer',
          sub: 'The bundle leaves as bits',
          narrative:
            'The bundle reaches the bottom: **layer 1, the Physical Layer**. Layer 1 sends the whole bundle as **bits** over the cable, to the next machine along the way. Here, that machine is a router.',
          deep: [
            {
              text: 'The Physical Layer provides the means to transmit bits over a physical medium.',
              cite: [x200('7.7.2'), microsoft('Physical layer', 'physical-layer')],
            },
          ],
          facts: [
            { label: 'Layer', value: '1 Physical', backing: { traces: ['lead-1'] } },
            { label: 'Sends', value: 'bits', backing: { traces: ['lead-4'] } },
          ],
          events: [
            layer({ id: 'laptop-1', place: 'laptop', n: 1, plain: 'Sends the whole bundle as bits.', labels: { list: ALL }, traces: ['lead-4'] }),
            bits({ id: 'bits-to-router', from: 'laptop', to: 'router', plain: 'The bits cross the cable to the router.', traces: ['lead-4'] }),
          ],
          backing: { traces: ['lead-1', 'lead-4', 'lead-5'] },
        },
        {
          id: 'relay',
          title: 'Relay',
          sub: 'A router reads up to layer 3',
          narrative:
            'The router only passes the message on, so it needs just the **lowest three layers**. Its layer 1 takes in the bits. Its layer 2 reads **header 2**. Its layer 3 reads **header 3** and works out where the message goes next. Then the message goes back down: layer 2 adds a new **header 2** of its own, and layer 1 sends the bits along the next cable. The router never reads headers 4 to 7: those are for the web server. A machine in the middle that only passes data on is called a **relay**.',
          deep: [
            {
              text: 'In X.200, a system that only passes data on to other systems is a relay open system, and the functions that forward data are in its lower layers.',
              cite: [x200('6.1.6')],
            },
          ],
          facts: [
            { label: 'Uses', value: 'layers 1 to 3', backing: { traces: ['lead-5'] } },
            { label: 'Reads', value: 'headers 2 and 3', backing: { traces: ['lead-5', 'lead-6'] } },
          ],
          events: [
            layer({ id: 'router-1', place: 'router', n: 1, plain: 'Takes in the bits.', labels: { list: ALL }, traces: ['lead-4', 'lead-5'] }),
            layer({ id: 'router-2', place: 'router', n: 2, plain: 'Reads header 2.', labels: { list: ALL, mark: { n: 2, kind: 'read' } }, traces: ['lead-5', 'lead-6'] }),
            // Layer 2 has read its header and passed the rest up, so layer 3 sees five (lead-6).
            layer({
              id: 'router-3',
              place: 'router',
              n: 3,
              plain: 'Reads header 3 and works out where the message goes next.',
              labels: { list: from(3), mark: { n: 3, kind: 'read' } },
              traces: ['lead-5', 'lead-6'],
            }),
            // Going back down, layer 2 adds its own header 2 for the next hop, as it did at the laptop (lead-3, lead-5).
            layer({
              id: 'router-2-down',
              place: 'router',
              n: 2,
              plain: 'Adds its own header 2 in front, as a layer does going down.',
              labels: { list: ALL, mark: { n: 2, kind: 'new' } },
              traces: ['lead-3', 'lead-5'],
            }),
            layer({ id: 'router-1-down', place: 'router', n: 1, plain: 'Sends it on as bits.', labels: { list: ALL }, traces: ['lead-4', 'lead-5'] }),
            bits({ id: 'bits-to-server', from: 'router', to: 'server', plain: 'The bits cross the cable to the web server.', traces: ['lead-4', 'lead-5'] }),
          ],
          backing: { traces: ['lead-3', 'lead-4', 'lead-5', 'lead-6', 'why-2', 'term-relay'] },
        },
        {
          id: 'decapsulation',
          title: 'Decapsulation',
          sub: 'Each header comes off at its twin',
          narrative:
            'At the web server, the bundle climbs back up, layer by layer. From layer 2 up, each layer reads the header **its twin** added, the one meant for it. Then it removes that header and passes the rest up. When layer 7 is done, only the message itself is left. Removing an outer header to reach what’s inside is called **decapsulation**.',
          deep: [
            {
              text: 'In X.200, what a layer carries for the layer above is a service-data-unit. It keeps its identity on the way between the twin layers above, and the layer carrying it does not interpret it.',
              cite: [x200('5.6.1.4')],
            },
          ],
          facts: [
            { label: 'Order', value: '1 up to 7', backing: { traces: ['lead-4'] } },
            { label: 'Each header', value: 'read and removed by its twin', backing: { traces: ['lead-6'] } },
          ],
          events: [
            layer({ id: 'server-1', place: 'server', n: 1, plain: 'Takes in the bits.', labels: { list: ALL }, traces: ['lead-4', 'lead-6', 'term-decap'] }),
            ...[2, 3, 4, 5, 6, 7].map((n) =>
              layer({
                id: `server-${n}`,
                place: 'server',
                n,
                plain: `Reads header ${n} and removes it.`,
                labels: { list: from(n), mark: { n, kind: 'read' } },
                traces: ['lead-4', 'lead-6', 'term-decap'],
              }),
            ),
          ],
          backing: { traces: ['lead-4', 'lead-6', 'term-decap', 'term-peer'] },
        },
        {
          id: 'peer-layers',
          title: 'Peer Layers',
          sub: 'Each layer talks to its twin',
          narrative:
            'Look at the whole trip again. Each header was written for **the same layer** on another machine, its twin, and read there. **Layers 4 to 7** work straight from your laptop to the web server. **Layers 1 to 3** work one hop at a time, so the router takes part in those. Twin layers like these are called **peer layers**.',
          deep: [
            {
              text: 'In X.200, how twin layers work together is governed by that layer’s protocol. Transport protocols, at layer 4, run only between the two end systems.',
              cite: [x200('5.2.2.7'), x200('6.1.2'), x200('7.4.2.3')],
            },
          ],
          facts: [
            { label: 'Layers 4 to 7', value: 'end to end', backing: { traces: ['why-2'] } },
            { label: 'Layers 1 to 3', value: 'hop by hop', backing: { traces: ['lead-5'] } },
          ],
          events: [7, 6, 5, 4, 3, 2, 1].map(peer),
          backing: { traces: ['term-peer', 'why-2', 'lead-5', 'lead-6'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'The **OSI model** splits networking into **seven layers**, numbered from 1 at the bottom to 7 at the top: Physical, Data Link, Network, Transport, Session, Presentation and Application.',
            cite: [x200('6.1.2')],
          },
          {
            id: 'lead-2',
            text: 'OSI is short for Open Systems Interconnection, and the model is also called the **OSI Reference Model**. Each layer has its own job, and each one except the top offers a service to the layer above it.',
            cite: [x200('1.1'), x200('1.2'), x200('5.2.2.3'), x200('5.2.2.5'), x200('6.2.1'), MICROSOFT_INTRO_NAME],
          },
          {
            id: 'job-6',
            text: '**Layer 6, the Presentation Layer**, gives the apps at both ends a **common way to represent the data** they exchange, so the apps don’t have to sort that out themselves. The two ends agree on how the data is written while it travels, and its meaning is kept on the way.',
            cite: [x200('6.1.2'), x200('7.2.1.2'), x200('7.2.2.2'), x200('7.2.2.3')],
          },
          {
            id: 'job-5',
            text: '**Layer 5, the Session Layer**, organizes the **dialogue**, the conversation between the two ends. It sets up a **session** between them, keeps their exchange orderly, and ends the session in an orderly way. It can also set **synchronization points**, a kind of checkpoint, so the two ends can reset the session to a point they agree on.',
            cite: [x200('6.1.2'), x200('7.3.1.4'), x200('7.3.2.1')],
          },
          {
            id: 'job-4',
            text: '**Layer 4, the Transport Layer**, works **end to end**: its protocols run only between the two end machines. It carries the data across for the layers above, so they don’t have to worry about how. Depending on the protocol, it can split the data into **pieces**, keep them in order, recover from errors, and control how fast the data flows.',
            cite: [x200('6.1.2'), x200('7.4.2.1'), x200('7.4.2.3'), x200('7.4.4.1.1'), NIST_2_1, microsoft('Transport layer', 'transport-layer')],
          },
          {
            id: 'job-3',
            text: '**Layer 3, the Network Layer**, finds a **route** between **network addresses**, so a message can cross several networks, one after another. The layers above don’t need to know how the route is chosen.',
            cite: [x200('6.1.2'), x200('7.5.2.3'), x200('7.5.4.2.1'), NIST_2_1, microsoft('Network layer', 'network-layer')],
          },
          {
            id: 'job-2',
            text: '**Layer 2, the Data Link Layer**, carries the data across **one link** at a time, from one machine to the next. It detects errors that happen in the Physical Layer below it, and may correct them.',
            cite: [x200('6.1.2'), x200('7.5.2.4'), x200('7.6.2.1'), x200('7.6.2.2'), NIST_2_1, microsoft('Data link layer', 'data-link-layer')],
          },
          {
            id: 'lead-3',
            text: 'On the way down, a layer adds its own control information to what the layer above handed it, usually as a **header** in front.',
            cite: [x200('5.6.1.1'), x200('5.6.1.3'), NIST_FOOTNOTE_6, rfc1122('1.3.3')],
          },
          {
            id: 'lead-4',
            text: 'The lowest layer sends the whole bundle as **bits** over the physical medium, such as a cable. At the other end, it is passed back up, layer by layer.',
            cite: [x200('5.2.2.4'), x200('7.7.2'), x200('7.7.4.6.1'), NIST_2_1],
          },
          {
            id: 'lead-5',
            text: 'In between, a **router** passes the message on, using only layers 1 to 3. Its work goes one hop at a time, from one machine to the next. It needs layer 3, the Network Layer, because that is the layer that routes messages across networks.',
            cite: [x200('6.1.2'), x200('6.1.6'), x200('7.5.2.1'), x200('7.5.2.4'), NIST_2_1, rfc1122('1.1.1'), microsoft('Network layer', 'network-layer')],
          },
          {
            id: 'lead-6',
            text: 'Going up, a layer reads the control information its **twin** added, usually as a header. Then it passes the rest up to the layer above without reading it.',
            cite: [x200('5.6.1.1'), x200('5.6.1.4'), NIST_FOOTNOTE_6, rfc1122('1.3.3')],
          },
          { id: 'lead-7', text: 'A header works like a note stuck on a parcel, written for the same layer at the other end.', analogy: true },
        ],
        terms: [
          {
            id: 'term-layer',
            idea: 'One job in the stack, with its own place in the order',
            name: 'Layer',
            cite: [x200('5.2.2.1'), x200('5.2.2.5'), x200('6.1.2'), x200('6.2.1')],
          },
          {
            id: 'term-header',
            idea: 'The information a layer puts in front of what it carries',
            name: 'Header',
            cite: [NIST_FOOTNOTE_6, rfc1122('1.3.3')],
          },
          {
            id: 'term-encap',
            idea: 'Each layer’s data wrapped in a bigger bundle by the layer below it',
            name: 'Encapsulation',
            cite: [NIST_2_1, rfc1122('1.3.3')],
          },
          {
            id: 'term-decap',
            idea: 'Removing an outer header to reach what’s inside',
            name: 'Decapsulation',
            cite: [CISCO_DECAP, cite('rfc-2003', '1'), cite('rfc-2003', '3')],
          },
          {
            id: 'term-peer',
            idea: 'The same layer on another machine, working with it by that layer’s own rules',
            name: 'Peer layer',
            cite: [x200('5.2.1.3'), x200('5.2.2.7'), x200('6.1.3')],
          },
          { id: 'term-relay', idea: 'A machine in the middle that only passes data on to other machines', name: 'Relay', cite: [x200('6.1.6')] },
        ],
        pattern: {
          id: 'pattern',
          names: ['Encapsulation', 'Relay', 'Decapsulation'],
          note: 'Down the layers at the sender, across each link, up the layers at the receiver.',
          cite: [x200('5.2.2.4'), x200('6.1.6'), NIST_2_1, CISCO_DECAP, cite('rfc-2003', '1')],
        },
        why: [
          {
            id: 'why-1',
            text: 'Why split the job? Each layer can use the service of the layer below without knowing the details of how that service is done.',
            cite: [x200('5.2.2.3'), x200('6.2.1'), x200('7.4.2.1'), x200('7.5.2.3'), MICROSOFT_INTRO_SHIELD],
          },
          {
            id: 'why-2',
            text: 'Layers 4 to 7 work only between the two end machines: the Transport Layer’s protocols run only between them, and layers 5 to 7 sit on top. So a router never needs to read those headers.',
            cite: [x200('5.2.2.3'), x200('6.1.2'), x200('6.1.6'), x200('7.4.2.3'), x200('7.5.2.4')],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'X.200 calls a layer’s control information **protocol-control-information** (PCI), which twin layers exchange to coordinate. The PCI plus, possibly, data from above makes the layer’s **protocol-data-unit**.',
            cite: [x200('5.6.1.1'), x200('5.6.1.3')],
          },
          {
            id: 'deep-2',
            text: 'The internet’s own protocols use four layers: Application, Transport, Internet and Link. NIST calls the lower two Network and Data Link.',
            cite: [rfc1122('1.1.3', true), NIST_2_1],
          },
          {
            id: 'deep-3',
            text: 'A **segment** is a TCP header followed by application data. An IP **datagram** is an IP header followed by transport data; it travels as one **packet**, or as several when fragmented. A **frame** is a link-layer header followed by a packet.',
            cite: [rfc1122('1.3.3', true), NIST_FOOTNOTE_6],
          },
        ],
        facts: [
          { id: 'fact-1', label: 'Layers', value: '7', cite: [x200('6.1.2')] },
          { id: 'fact-2-top', label: 'Top', value: '7 Application', cite: [x200('6.1.2')] },
          { id: 'fact-2-bottom', label: 'Bottom', value: '1 Physical', cite: [x200('6.1.2')] },
          { id: 'fact-3', label: 'Defined in', value: 'ITU-T X.200, the same text as ISO/IEC 7498-1', cite: [X200_FOREWORD] },
        ],
      },
      practice: [
        {
          id: 'going-down',
          prompt: 'Going down the layers on the sender, what does each layer do?',
          options: [
            {
              text: 'Adds its own control information, usually a header',
              feedback: 'Right. Going down, a layer adds its own control information to what the layer above handed it, usually as a header in front.',
              cite: [x200('5.6.1.3'), NIST_2_1, NIST_FOOTNOTE_6, rfc1122('1.3.3')],
            },
            {
              text: 'Removes the header of the layer above',
              feedback: 'Not quite. Going down, a layer doesn’t read what the layer above handed it.',
              cite: [x200('5.6.1.4')],
            },
            {
              text: 'Sends it straight to the cable',
              feedback: 'Not quite. Each layer above the lowest gets its service from the layer just below it, so the message goes down one layer at a time.',
              cite: [x200('5.2.2.3'), x200('5.2.2.4')],
            },
          ],
          answer: 0,
        },
        {
          id: 'router-layers',
          prompt: 'A router passes your message on. Which layers does it use?',
          options: [
            {
              text: 'Layers 1 to 3',
              feedback: 'Right. A machine that only passes data on needs just the lower layers, up to the Network Layer, which routes messages across networks.',
              cite: [x200('6.1.2'), x200('6.1.6'), x200('7.5.2.1'), NIST_2_1],
            },
            {
              text: 'All seven',
              feedback: 'Not quite. Transport protocols, at layer 4, run only between the two end machines, so the router in the middle has no part in them.',
              cite: [x200('6.1.2'), x200('7.4.2.3')],
            },
            {
              text: 'Only layer 1',
              feedback: 'Not quite. To send the message on toward the right network, it needs layer 3, the Network Layer, which routes messages across networks.',
              cite: [x200('6.1.2'), x200('7.5.2.1'), NIST_2_1],
            },
          ],
          answer: 0,
        },
        {
          id: 'layer-4',
          prompt: 'Which layer is layer 4?',
          options: [
            { text: 'Transport', feedback: 'Right. Layer 4 is the Transport Layer.', cite: [x200('6.1.2')] },
            { text: 'Network', feedback: 'Not quite. The Network Layer is layer 3. Layer 4 is the Transport Layer.', cite: [x200('6.1.2')] },
            { text: 'Session', feedback: 'Not quite. The Session Layer is layer 5. Layer 4 is the Transport Layer.', cite: [x200('6.1.2')] },
            { text: 'Data Link', feedback: 'Not quite. The Data Link Layer is layer 2. Layer 4 is the Transport Layer.', cite: [x200('6.1.2')] },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
