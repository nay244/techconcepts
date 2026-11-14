import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * The glossary group layers (job 10, batch 2): twelve entries on the OSI model, its seven layers, peer layers, and
 * encapsulation and decapsulation. Written from the analyst's report and the orchestrator's rulings in it. X.200 is
 * the defining standard for the model and its layers; RFC 1122 §1.1.3 is marked defining only where it states the
 * internet's own layering; RFC 791, 1812 and 2003 are marked where they define what IP does with a local-network
 * header or a tunnel's outer header. NIST, RFC 1122 §1.1.1, §1.3.3 and §3.1, RFC 8085 and every vendor page are not.
 */

const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
/** X.200's PDF page for each section cited, measured with pdftotext (as `osi-model.ts`). */
const X200_PAGE: Record<string, number> = {
  '1.1': 5, '1.2': 5, '1.4': 5, '5.2.1.2': 10, '5.2.1.3': 10, '5.2.1.9': 10, '5.2.2.1': 10, '5.2.2.3': 11, '5.2.2.4': 12,
  '5.2.2.5': 12, '5.2.2.7': 12, '6.1.2': 32, '6.1.3': 32, '6.1.4': 32, '6.1.6': 33, '7.1.2.1': 36, '7.2.2.2': 37, '7.2.2.3': 37,
  '7.3.1.4': 39, '7.3.2.1': 39, '7.4.2.1': 41, '7.4.2.3': 41, '7.5.2.1': 45, '7.5.2.3': 45, '7.5.2.4': 45, '7.5.3.1.1': 45,
  '7.5.4.2.1': 48, '7.6.2.1': 50, '7.6.2.2': 50, '7.7.2': 53,
};
const x200 = (section: string) => cite('itu-x200', section, { url: `${X200}#page=${X200_PAGE[section]}`, defining: true });

const NIST = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf';
const NIST_2_1 = cite('nist-sp800-77r1', '2.1', { url: `${NIST}#page=20` });
const NIST_FN6 = cite('nist-sp800-77r1', '2.1, footnote 6', { url: `${NIST}#page=20` });

const RFC1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
const rfc1122 = (section: string, page: number, defining?: true) =>
  cite('rfc-1122', section, { url: `${RFC1122}#page-${page}`, ...(defining ? { defining } : {}) });
const R1122_LAYERS_8 = rfc1122('1.1.3', 8, true);
const R1122_LAYERS_9 = rfc1122('1.1.3', 9, true);
const R1122_LAYERS_PLAIN = rfc1122('1.1.3', 8);
const R1122_ROUTERS = rfc1122('1.1.1', 6);
const R1122_SEGMENT = rfc1122('1.3.3', 17);
const R1122_FRAME = rfc1122('1.3.3', 18);
const R1122_IP_UP = rfc1122('3.1', 28);

const MICROSOFT = 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model';
const microsoft = (section: string, fragment: string) => cite('microsoft-osi', section, { url: `${MICROSOFT}#${fragment}` });
const MS_INTRO_NAME = microsoft('Introduction', ':~:text=The%20ISO%20Open%20Systems%20Interconnection,specific%20services%20to%20higher%20layers');
const MS_INTRO_SHIELD = microsoft('Introduction', ':~:text=Each%20layer%20offers%20specific%20services,how%20the%20services%20are%20implemented');
const MS_PHYSICAL = microsoft('Physical layer', 'physical-layer');
const MS_DATA_LINK = microsoft('Data link layer', 'data-link-layer');
const MS_LLC = microsoft('LLC', 'llc');
const MS_NETWORK = microsoft('Network layer', 'network-layer');
const MS_TRANSPORT = microsoft('Transport layer', 'transport-layer');

const PALO = 'https://www.paloaltonetworks.com/cyberpedia/what-is-layer-7';
const palo = (section: string, fragment: string) => cite('paloalto-layer-7', section, { url: `${PALO}#:~:text=${fragment}` });
const PALO_ABOUT = palo('What Is Layer 7?', 'Layer%207%20is%20the%20application%20layer');
const PALO_SESSION = palo('Meet the Layers of the OSI Model', 'The%20session%20layer%20establishes');
const PALO_PRESENTATION = palo('Meet the Layers of the OSI Model', 'The%20presentation%20layer%20translates');
const PALO_INTERFACE = palo('Layer 7 Explained', 'Layer%207%20provides%20the%20interface');
const PALO_STRUCTURE = palo('Structure and Abstraction Levels', 'Application%20(combining');
const PALO_FLOW = palo('How Does Data Flow Through the OSI Model?', 'a%20process%20known%20as%20encapsulation');
const PALO_UP = palo('De-Encapsulation Process (Data Flow Upwards)', 'ascends%20the%20OSI%20layers%20in%20a%20reverse%20process');
const PALO_UP_NETWORK = palo('De-Encapsulation Process (Data Flow Upwards)', 'The%20network%20layer%20removes%20the%20IP%20addresses');

const rfc791 = (section: string) => cite('rfc-791', section, { defining: true });
const rfc1812 = (section: string) => cite('rfc-1812', section, { defining: true });
const R8085_TUNNEL = cite('rfc-8085', '3.1.11');

export default defineGlossaryGroup({
  id: 'layers',
  entries: [
    {
      id: 'osi-model',
      term: 'OSI model',
      also: ['OSI Reference Model', 'Open Systems Interconnection model'],
      definition: [
        {
          id: 'osi-model-1',
          text: 'The OSI model (Open Systems Interconnection model), or OSI Reference Model, describes networking as seven layers with their own functions.',
          cite: [x200('1.2'), x200('6.1.2'), MS_INTRO_NAME, PALO_ABOUT],
        },
        {
          id: 'osi-model-2',
          text: 'Its layers, from 1 at the bottom to 7 at the top: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
          cite: [x200('6.1.2')],
        },
        {
          id: 'osi-model-3',
          text: 'It is a framework for developing standards, not a specification to build from; internet protocols use a four-layer model.',
          cite: [x200('1.1'), x200('1.4'), R1122_LAYERS_8],
        },
      ],
    },
    {
      id: 'layer',
      term: 'Layer',
      definition: [
        {
          id: 'layer-1',
          text: 'A layer is one level in a stack of network protocols, with its own set of functions.',
          cite: [x200('5.2.1.2'), x200('5.2.2.1'), MS_INTRO_NAME, R1122_LAYERS_PLAIN],
        },
        {
          id: 'layer-2',
          text: 'Each layer except the top offers services to the layer above, which uses them without needing the details of how they are done.',
          cite: [x200('5.2.2.3'), x200('5.2.2.5'), x200('7.4.2.1'), x200('7.5.2.3'), MS_INTRO_SHIELD],
        },
      ],
      lessons: [{ lesson: 'osi-model', term: 'term-layer' }],
    },
    {
      id: 'physical-layer',
      term: 'Physical Layer',
      also: ['Layer 1'],
      definition: [
        { id: 'physical-layer-1', text: 'The Physical Layer is layer 1, the lowest layer of the OSI model.', cite: [x200('6.1.2'), MS_PHYSICAL] },
        { id: 'physical-layer-2', text: 'It sends and receives bits over a physical medium for the Data Link Layer above it.', cite: [x200('7.7.2'), MS_PHYSICAL] },
        {
          id: 'physical-layer-3',
          text: 'It covers the electrical, mechanical and procedural means of setting up, keeping and ending these physical connections.',
          cite: [x200('7.7.2'), MS_PHYSICAL],
        },
      ],
    },
    {
      id: 'data-link-layer',
      term: 'Data Link Layer',
      also: ['Layer 2'],
      definition: [
        { id: 'data-link-layer-1', text: 'The Data Link Layer is layer 2 of the OSI model.', cite: [x200('6.1.2')] },
        {
          id: 'data-link-layer-2',
          text: 'It carries data from one machine to the next, in units called frames, over the connections the Physical Layer provides.',
          cite: [x200('7.6.2.1'), MS_DATA_LINK, MS_LLC, R1122_FRAME, rfc1122('1.1.3', 10)],
        },
        {
          id: 'data-link-layer-3',
          text: 'It detects errors that happen in the Physical Layer, and may correct them.',
          cite: [x200('7.6.2.2'), MS_DATA_LINK],
        },
      ],
    },
    {
      id: 'network-layer',
      term: 'Network Layer',
      also: ['Layer 3'],
      definition: [
        { id: 'network-layer-1', text: 'The Network Layer is layer 3 of the OSI model.', cite: [x200('6.1.2')] },
        {
          id: 'network-layer-2',
          text: 'It carries data between the two end machines, across several networks if need be, finding a route between network addresses.',
          cite: [x200('7.5.3.1.1'), x200('7.5.2.3'), x200('7.5.4.2.1'), MS_NETWORK, NIST_2_1],
        },
        {
          id: 'network-layer-3',
          text: 'The layers above need not know how the route is chosen; routers, which relay data between networks, need only layers 1 to 3.',
          cite: [x200('7.5.2.1'), x200('6.1.6'), x200('7.5.2.4'), x200('5.2.2.3'), R1122_ROUTERS, MS_NETWORK],
        },
      ],
    },
    {
      id: 'transport-layer',
      term: 'Transport Layer',
      also: ['Layer 4'],
      definition: [
        { id: 'transport-layer-1', text: 'The Transport Layer is layer 4 of the OSI model.', cite: [x200('6.1.2')] },
        {
          id: 'transport-layer-2',
          text: 'It carries data between the two end machines for the layers above, so they need not deal with how the transfer is done.',
          cite: [x200('7.4.2.1'), MS_TRANSPORT, rfc1122('1.1.3', 9)],
        },
        {
          id: 'transport-layer-3',
          text: 'Its protocols run only between the two end machines, not in the routers between them.',
          cite: [x200('7.4.2.3'), x200('7.5.2.4'), R1122_ROUTERS],
        },
      ],
    },
    {
      id: 'session-layer',
      term: 'Session Layer',
      also: ['Layer 5'],
      definition: [
        { id: 'session-layer-1', text: 'The Session Layer is layer 5 of the OSI model.', cite: [x200('6.1.2')] },
        {
          id: 'session-layer-2',
          text: 'It organizes the dialogue between the two ends: it sets up a session, keeps their exchange orderly, and ends the session in an orderly way.',
          cite: [x200('7.3.2.1'), PALO_SESSION],
        },
        {
          id: 'session-layer-3',
          text: 'It can set synchronization points, so the two ends can reset the session to a point they agree on.',
          cite: [x200('7.3.1.4')],
        },
      ],
    },
    {
      id: 'presentation-layer',
      term: 'Presentation Layer',
      also: ['Layer 6'],
      definition: [
        { id: 'presentation-layer-1', text: 'The Presentation Layer is layer 6 of the OSI model.', cite: [x200('6.1.2')] },
        {
          id: 'presentation-layer-2',
          text: 'It gives the applications at both ends a common way to represent the data they exchange, and keeps the data’s information intact in transfer.',
          cite: [x200('7.2.2.2'), x200('7.2.2.3'), PALO_PRESENTATION],
        },
        {
          id: 'presentation-layer-3',
          text: 'In the internet’s own model, the application layer does the Presentation Layer’s job too.',
          cite: [R1122_LAYERS_9, PALO_STRUCTURE],
        },
      ],
    },
    {
      id: 'application-layer',
      term: 'Application Layer',
      also: ['Layer 7'],
      definition: [
        {
          id: 'application-layer-1',
          text: 'The Application Layer is layer 7, the top layer of the OSI model.',
          cite: [x200('6.1.2'), x200('6.1.4'), PALO_ABOUT],
        },
        {
          id: 'application-layer-2',
          text: 'It is how an application reaches the network: it holds the parts of applications that communicate, and the layers below provide the services they use.',
          cite: [x200('7.1.2.1'), x200('6.1.4'), PALO_INTERFACE],
        },
      ],
    },
    {
      id: 'peer-layer',
      term: 'Peer layer',
      definition: [
        {
          id: 'peer-layer-1',
          text: 'A peer layer is the same layer on another machine: X.200 calls entities in the same layer peer entities.',
          cite: [x200('5.2.1.3'), x200('5.2.2.1'), x200('6.1.3')],
        },
        {
          id: 'peer-layer-2',
          text: 'Peers work together by their layer’s protocol, a set of rules and formats.',
          cite: [x200('5.2.2.7'), x200('5.2.1.9')],
        },
        {
          id: 'peer-layer-3',
          text: 'Except at the bottom, peers reach each other through the layer below; the lowest layer uses the physical medium directly.',
          cite: [x200('5.2.2.4')],
        },
      ],
      lessons: [{ lesson: 'osi-model', term: 'term-peer' }],
    },
    {
      id: 'encapsulation',
      term: 'Encapsulation',
      definition: [
        {
          id: 'encapsulation-1',
          text: 'Encapsulation is wrapping data on its way down the layers: a layer carries what the layer above handed it inside a larger unit of its own, adding its own information, usually a header.',
          cite: [NIST_2_1, NIST_FN6, R1122_SEGMENT, PALO_FLOW],
        },
        {
          id: 'encapsulation-2',
          text: 'For example, a TCP segment travels inside an IP datagram, and on each link the IP packet travels inside a frame.',
          cite: [R1122_SEGMENT, R1122_FRAME, cite('rfc-9293', '3.1', { defining: true }), rfc791('2.2'), cite('rfc-1812', '2.3')],
        },
      ],
      lessons: [
        { lesson: 'osi-model', term: 'term-encap' },
        { lesson: 'what-is-ip', term: 'term-encapsulation' },
      ],
    },
    {
      id: 'decapsulation',
      term: 'Decapsulation',
      also: ['De-encapsulation'],
      definition: [
        {
          id: 'decapsulation-1',
          text: 'Decapsulation, or de-encapsulation, is the reverse of encapsulation: taking off an outer header to reach the data inside.',
          cite: [cite('rfc-2003', '1'), cite('rfc-2003', '3'), R8085_TUNNEL, PALO_UP],
        },
        {
          id: 'decapsulation-2',
          text: 'A receiving machine does it on the way up the layers, handing what was inside each unit to the layer above.',
          cite: [cite('rfc-791', '2.2'), R1122_IP_UP, PALO_UP_NETWORK, NIST_2_1],
        },
        {
          id: 'decapsulation-3',
          text: 'A router does it to the frames it receives; a tunnel’s far end, to recover the original packet.',
          cite: [rfc1812('1'), rfc1812('2.3'), rfc791('2.2'), cite('rfc-2003', '1'), R8085_TUNNEL],
        },
      ],
      lessons: [{ lesson: 'osi-model', term: 'term-decap' }],
    },
  ],
});
