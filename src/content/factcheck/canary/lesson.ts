import { validateLesson } from '../../define';
import type { Lesson } from '../../schema';
import { cite, defineSources, type SourceRegistry } from '../../sources';

/**
 * The fact-checker's canary (fact-checker design §9). It is a short, true DHCP lesson, with real sources and five
 * planted faults (`CANARY_FAULTS`). The real fact-checker must flag every fault and pass everything else
 * (`canary.test.ts`).
 *
 * It is never on the site: it is not in `src/content/lessons/`, and its sources are not in `SOURCES`. Its report is
 * `docs/fact-checks/canary/fact-check-canary.md`, which the build gate never reads. Run it again by dispatching the
 * fact-checker with `Check lesson fact-check-canary.`
 *
 * Every correct claim here was checked against its cited section when the canary was written (2026-11-08):
 * - RFC 2131 §3.1: the client broadcasts DHCPDISCOVER, each server may answer with DHCPOFFER, then DHCPREQUEST and
 *   DHCPACK;
 * - RFC 2131 §4.1: DHCP uses UDP; client to server goes to port 67, server to client to port 68;
 * - RFC 2131 §1: the protocol's name.
 */

export const CANARY_SOURCES: SourceRegistry = defineSources([
  {
    id: 'rfc-2131',
    kind: 'rfc',
    short: 'RFC 2131',
    title: 'Dynamic Host Configuration Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2131.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2131.html#section-{n}',
  },
  {
    id: 'rfc-9110',
    kind: 'rfc',
    short: 'RFC 9110',
    title: 'HTTP Semantics',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9110.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9110.html#section-{n}',
  },
  {
    // Obsoleted, for planted fault 2.
    id: 'rfc-2616',
    kind: 'rfc',
    short: 'RFC 2616',
    title: 'Hypertext Transfer Protocol -- HTTP/1.1',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2616.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2616.html#section-{n}',
  },
  {
    id: 'microsoft-dhcp',
    kind: 'vendor',
    short: 'Microsoft Learn',
    title: 'What is Dynamic Host Configuration Protocol (DHCP) Server in Windows Server?',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top',
  },
]);

const rfc2131 = (section: string) => cite('rfc-2131', section, { sources: CANARY_SOURCES, defining: true });
const at = 'units[0]';

/** Each planted fault's claim-sheet key, and what is wrong with it. Every other item is correct. */
export const CANARY_FAULTS: Record<string, string> = {
  [`${at}.learn.lead[2] ("lead-3")`]: 'Neither cited source says a server always offers a 24-hour lease; the lease time is the server’s choice.',
  [`${at}.learn.facts[2] ("fact-3")`]: 'It cites RFC 2616 as the defining standard, but RFC 2616 is obsoleted; RFC 9110 now defines GET.',
  [`${at}.learn.why[0] ("why-1")`]: 'The second source, RFC 9110 §9.3.1, is about HTTP GET and does not state that the client broadcasts DHCPDISCOVER.',
  [`${at}.practice[0].options[1] (question "q1")`]: 'It marks RFC 2131 §4.1 as the defining standard for HTTPS on TCP port 443; RFC 2131 defines DHCP, not HTTPS.',
  [`${at}.steps[1].facts[1] (step "offer", fact "Lease time")`]: 'Watch adds a value: the fact it traces names the four messages and says nothing of an 8-day lease.',
};

export const CANARY_LESSON: Lesson = validateLesson(
  {
    slug: 'fact-check-canary',
    title: 'DHCP canary',
    subtitle: 'How a device with no address finds a DHCP server',
    level: 'beginner',
    certTags: ['network-plus'],
    summary: 'A device with no address broadcasts a DHCPDISCOVER, and a DHCP server may answer with a DHCPOFFER.',
    figure: 'dhcp',
    backing: { traces: ['lead-1', 'lead-2'] },
    units: [
      {
        id: 'discover-offer',
        name: 'DHCP',
        fullName: 'Dynamic Host Configuration Protocol (DHCP)',
        purpose: 'How a device with no address finds a DHCP server and gets an offer.',
        osi: 'spans',
        backing: { traces: ['term-dhcp', 'lead-1', 'lead-2'] },
        scene: {
          title: 'Local network',
          views: ['network', 'sequence'],
          panel: null,
          log: {
            title: 'Event log',
            columns: [
              { key: 'source', label: 'Source' },
              { key: 'destination', label: 'Destination' },
              { key: 'plain', label: 'In plain words' },
            ],
            legend: [
              { kind: 'broadcast', label: 'Broadcast' },
              { kind: 'response', label: 'Reply' },
            ],
          },
          parties: [
            { place: 'laptop', label: 'Laptop', addr: '' },
            { place: 'router', label: 'DHCP server', addr: '' },
          ],
          backing: { traces: ['lead-1', 'lead-2'] },
        },
        overview: {
          hook: 'Think of walking into a room and calling out, "Can anyone give me a seat?" Whoever can, answers with an offer.',
          hookBacking: { analogy: true },
          description: 'A device with no address **broadcasts** a DHCPDISCOVER. A DHCP server may answer with a **DHCPOFFER** that holds an address.',
          backing: { traces: ['lead-1', 'lead-2'] },
          facts: [{ label: 'Example address', value: '192.0.2.10', backing: { example: true } }],
        },
        steps: [
          {
            id: 'discover',
            title: 'DHCP Discover',
            sub: 'The laptop looks for a server',
            narrative: 'The laptop has no address yet, so it **broadcasts** a DHCPDISCOVER on its local network to find a DHCP server.',
            deep: [{ text: 'The DHCPDISCOVER goes to UDP port 67, the DHCP server port.', cite: [rfc2131('4.1')] }],
            facts: [
              { label: 'Message', value: 'DHCPDISCOVER', backing: { traces: ['term-1'] } },
              { label: 'To port', value: 'UDP 67', backing: { traces: ['lead-1', 'deep-1', 'fact-1'] } },
            ],
            events: [
              {
                type: 'message',
                id: 'm1',
                from: 'laptop',
                to: 'router',
                tag: 'DHCPDISCOVER',
                kind: 'broadcast',
                log: { source: 'Laptop', destination: 'Broadcast' },
                plain: 'The laptop looks for a DHCP server.',
                backing: { traces: ['lead-1'] },
              },
            ],
            backing: { traces: ['lead-1'] },
          },
          {
            id: 'offer',
            title: 'DHCP Offer',
            sub: 'The server offers an address',
            narrative: 'The DHCP server answers with a **DHCPOFFER**, which holds an address it can lend.',
            deep: [{ text: 'The DHCPOFFER goes to UDP port 68, the DHCP client port.', cite: [rfc2131('4.1')] }],
            facts: [
              { label: 'Offered address', value: '192.0.2.10', backing: { example: true } },
              // Planted fault 5: no Learn part states a lease time.
              { label: 'Lease time', value: '8 days', backing: { traces: ['fact-2'] } },
            ],
            events: [
              {
                type: 'message',
                id: 'm2',
                from: 'router',
                to: 'laptop',
                tag: 'DHCPOFFER',
                kind: 'response',
                log: { source: 'DHCP server', destination: 'Laptop' },
                plain: 'The server offers the laptop an address.',
                backing: { traces: ['lead-2'] },
              },
            ],
            backing: { traces: ['lead-2'] },
          },
        ],
        learn: {
          lead: [
            {
              id: 'lead-1',
              text: 'A device with no address **broadcasts** a DHCPDISCOVER message on its local network to find a DHCP server.',
              cite: [rfc2131('3.1')],
            },
            {
              id: 'lead-2',
              text: 'Each DHCP server that gets it may answer with a **DHCPOFFER**, which holds an address it can lend.',
              cite: [rfc2131('3.1')],
            },
            // Planted fault 1: neither source says this, and it is false.
            {
              id: 'lead-3',
              text: 'A DHCP server always offers a lease of 24 hours.',
              cite: [
                cite('rfc-2131', '3.1', { sources: CANARY_SOURCES }),
                cite('microsoft-dhcp', 'Why use DHCP?', { sources: CANARY_SOURCES, url: `${CANARY_SOURCES['microsoft-dhcp']!.url}#why-use-dhcp` }),
              ],
            },
          ],
          terms: [
            { id: 'term-dhcp', idea: 'Giving devices their network settings', name: 'Dynamic Host Configuration Protocol (DHCP)', cite: [rfc2131('1')] },
            { id: 'term-1', idea: 'Looking for a server', name: 'DHCPDISCOVER', cite: [rfc2131('3.1')] },
            { id: 'term-2', idea: 'A server’s offer of an address', name: 'DHCPOFFER', cite: [rfc2131('3.1')] },
          ],
          pattern: {
            id: 'pattern',
            names: ['DHCP Discover', 'DHCP Offer'],
            note: 'The device looks for a server first; a server then offers an address.',
            cite: [rfc2131('3.1')],
          },
          why: [
            // Planted fault 3: RFC 9110 §9.3.1 is about HTTP GET, so it does not confirm this.
            {
              id: 'why-1',
              text: 'The client broadcasts its DHCPDISCOVER on its local physical subnet.',
              cite: [cite('rfc-2131', '3.1', { sources: CANARY_SOURCES }), cite('rfc-9110', '9.3.1', { sources: CANARY_SOURCES })],
            },
          ],
          deep: [
            {
              id: 'deep-1',
              text: 'DHCP runs over UDP. Messages from a client to a server go to port 67, and messages from a server to a client go to port 68.',
              cite: [rfc2131('4.1')],
            },
          ],
          facts: [
            { id: 'fact-1', label: 'DHCP server port', value: 'UDP 67', cite: [rfc2131('4.1')] },
            { id: 'fact-2', label: 'Getting a new address', value: 'DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, then DHCPACK', cite: [rfc2131('3.1')] },
            // Planted fault 2: RFC 2616 is obsoleted.
            { id: 'fact-3', label: 'HTTP/1.1', value: 'Defines the GET method', cite: [cite('rfc-2616', '9.3', { sources: CANARY_SOURCES, defining: true })] },
          ],
        },
        practice: [
          {
            id: 'q1',
            prompt: 'Which message does a device with no address broadcast to find a DHCP server?',
            options: [
              {
                text: 'DHCPDISCOVER',
                feedback: 'Right. A device with no address broadcasts a DHCPDISCOVER to find a DHCP server.',
                cite: [rfc2131('3.1')],
              },
              // Planted fault 4: RFC 2131 does not define HTTPS or its port.
              { text: 'HTTPS', feedback: 'Not quite. HTTPS uses TCP port 443.', cite: [rfc2131('4.1')] },
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  CANARY_SOURCES,
);
