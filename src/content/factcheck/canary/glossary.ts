import { defineGlossaryGroup } from '../../glossary-group';
import { cite } from '../../sources';
import { CANARY_SOURCES } from './lesson';

/**
 * The fact-checker's canary glossary group (docs/glossary-path-spec.md §7): a small DHCP and HTTP group that cites real
 * sources, checked against `CANARY_SOURCES`. It is never on the site: it is not in `src/content/glossary-groups/`, so it
 * is in no `GLOSSARY`. Its report is `docs/fact-checks/canary/glossary-fact-check-canary.md`, which the build gate never
 * reads. What the report must say is in `canary.glossary.test.ts`, kept out of this file so the checker cannot read it
 * here. Run it again by dispatching the fact-checker with `The glossary group: fact-check-canary.` Its ties name the
 * canary lesson's terms (`CANARY_LESSON`, which does not change), so no edit to a real lesson makes its report stale.
 */

const defining = (source: string, section: string) => cite(source, section, { sources: CANARY_SOURCES, defining: true });
const plain = (source: string, section: string) => cite(source, section, { sources: CANARY_SOURCES });

export const CANARY_GROUP = defineGlossaryGroup(
  {
    id: 'fact-check-canary',
    entries: [
      {
        id: 'dhcp',
        term: 'DHCP',
        also: ['Dynamic Host Configuration Protocol', 'Dynamic Host Control Protocol'],
        definition: [
          { id: 'dhcp-1', text: 'The Dynamic Host Configuration Protocol (DHCP) provides configuration parameters to Internet hosts.', cite: [defining('rfc-2131', '1')] },
          {
            id: 'dhcp-2',
            text: "DHCP messages travel over UDP: a client's messages go to the server port, 67, and a server's go to the client port, 68.",
            cite: [defining('rfc-2131', '4.1')],
          },
        ],
      },
      {
        id: 'discover',
        term: 'Discover',
        also: ['DHCPDISCOVER'],
        definition: [
          {
            id: 'discover-1',
            text: 'A client looking for an address broadcasts a discover message, DHCPDISCOVER, to find the servers that can give it one.',
            cite: [defining('rfc-2131', '3.1')],
          },
        ],
        lessons: [{ lesson: 'fact-check-canary', term: 'term-1' }],
      },
      {
        id: 'offer',
        term: 'Offer',
        also: ['DHCPOFFER'],
        definition: [
          {
            id: 'offer-1',
            text: 'Each server that receives a discover message may answer with an offer message, DHCPOFFER, that holds an address it can give.',
            cite: [defining('rfc-2131', '3.1')],
          },
        ],
        lessons: [{ lesson: 'fact-check-canary', term: 'term-dhcp' }],
      },
      {
        id: 'lease',
        term: 'Lease',
        definition: [{ id: 'lease-1', text: 'A DHCP server always lends an address, as a lease, for exactly 24 hours.', cite: [defining('rfc-2131', '1')] }],
      },
      {
        id: 'request',
        term: 'Request',
        senses: [
          {
            id: 'dhcp',
            label: 'In DHCP',
            definition: [
              {
                id: 'request-dhcp-1',
                text: 'After choosing one offer, the client broadcasts a request message, DHCPREQUEST, asking for the offered address.',
                cite: [plain('rfc-2131', '3.1'), plain('rfc-9110', '9.3.1')],
              },
            ],
          },
          {
            id: 'http',
            label: 'In HTTP',
            definition: [
              { id: 'request-http-1', text: 'A GET request asks for a current representation of the resource it names.', cite: [defining('rfc-9110', '9.3.1')] },
              { id: 'request-http-2', text: 'GET is the method a browser uses to fetch a page.', cite: [defining('rfc-2616', '9.3')] },
            ],
          },
        ],
      },
    ],
  },
  CANARY_SOURCES,
);
