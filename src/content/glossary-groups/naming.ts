import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * The glossary group naming (job 10, batch 3): nine entries on how a name is looked up in the DNS. Written from the
 * analyst's report and the orchestrator's rulings in it. The citation constants are the `what-is-dns` lesson's. A
 * citation is marked defining only where the document defines the thing the statement is about: RFC 1034 and RFC 1035
 * for the DNS's own concepts, procedures and records, RFC 3596 for AAAA, RFC 7766 section 5 and RFC 8767 section 4 for
 * what they amend, and the root zone file for its own NS records. Never RFC 9499, RFC 7720, IANA's pages, ICANN's FAQ
 * or Microsoft's page.
 */

const d = (source: string, section: string) => cite(source, section, { defining: true });
const rfc = (source: string, section: string) => cite(source, section);

const IANA_ROOT_SERVERS = cite('iana-root-servers', 'Root Name Servers', {
  url: 'https://www.iana.org/domains/root/servers#:~:text=13%20named%20authorities',
});
const IANA_ROOT_ZONE = cite('iana-root-zone', 'Root Zone Management', {
  url: 'https://www.iana.org/domains/root#:~:text=principally%20composed%20of%20delegations',
});
const IANA_APP = cite('iana-root-db-app', '.app Top-Level Domain', {
  url: 'https://www.iana.org/domains/root/db/app.html#:~:text=Generic%20top-level%20domain',
});
const ROOT_ZONE_NAMES = cite('iana-root-zone-file', 'The root zone’s NS records', {
  url: 'https://www.internic.net/domain/root.zone#:~:text=a.root-servers.net',
  defining: true,
});
const ROOT_ZONE_APP = cite('iana-root-zone-file', 'The app. NS records', {
  url: 'https://www.internic.net/domain/root.zone#:~:text=ns-tld1.charlestonroadregistry.com',
  defining: true,
});
const RSSAC = cite('icann-rssac-faq', '1.1', {
  url: 'https://www.icann.org/en/rssac/faq#:~:text=more%20than%201500%20anycast%20instances',
});
const MS_IPCONFIG = cite('microsoft-ipconfig', 'Parameters', {
  url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig#:~:text=DNS%20client%20resolver%20cache',
});

export default defineGlossaryGroup({
  id: 'naming',
  entries: [
    {
      id: 'dns',
      term: 'DNS',
      also: ['Domain Name System'],
      definition: [
        {
          id: 'dns-1',
          text: 'DNS, the Domain Name System, looks up the information stored under a name, such as the IP address of example.com.',
          cite: [d('rfc-1034', '2.4'), d('rfc-1034', '1'), rfc('rfc-9499', '1')],
        },
        {
          id: 'dns-2',
          text: 'Its data is spread over many name servers, and resolvers ask them on behalf of programs.',
          cite: [d('rfc-1034', '2.4'), rfc('rfc-1034', '2.2'), rfc('rfc-9499', '6')],
        },
        {
          id: 'dns-3',
          text: 'Queries usually go over UDP to port 53; TCP on port 53 is used too.',
          cite: [d('rfc-1035', '4.2'), d('rfc-7766', '5')],
        },
      ],
    },
    {
      id: 'dns-resolver',
      term: 'DNS resolver',
      definition: [
        {
          id: 'dns-resolver-1',
          text: 'A DNS resolver is a program that gets information from name servers for the programs that ask it.',
          cite: [d('rfc-1034', '2.4'), rfc('rfc-9499', '6')],
        },
        {
          id: 'dns-resolver-2',
          text: 'A device’s own small resolver usually passes each question to a recursive resolver, which follows referrals from server to server until it has the answer.',
          cite: [d('rfc-1034', '5.3.1'), d('rfc-1034', '5.3.3'), rfc('rfc-9499', '6')],
        },
        {
          id: 'dns-resolver-3',
          text: 'A recursive resolver normally keeps answers in a cache, to reuse them.',
          cite: [rfc('rfc-9499', '6'), d('rfc-1034', '5.1')],
        },
      ],
      lessons: [{ lesson: 'what-is-dns', term: 'term-resolver' }],
    },
    {
      id: 'root-server',
      term: 'Root server',
      definition: [
        {
          id: 'root-server-1',
          text: 'A root server is an authoritative name server for the DNS root zone, the top of the naming tree.',
          cite: [rfc('rfc-7720', '1'), IANA_ROOT_SERVERS, IANA_ROOT_ZONE],
        },
        {
          id: 'root-server-2',
          text: 'The root zone mainly lists each top-level domain’s name servers, so a root server points a resolver to a TLD’s servers.',
          cite: [IANA_ROOT_ZONE, rfc('rfc-9499', '7'), ROOT_ZONE_APP, d('rfc-1034', '5.3.3'), d('rfc-1034', '4.3.2')],
        },
        {
          id: 'root-server-3',
          text: 'There are 13 root server names, a.root-servers.net to m.root-servers.net, together run as many copies around the world.',
          cite: [ROOT_ZONE_NAMES, IANA_ROOT_SERVERS, RSSAC],
        },
      ],
      lessons: [{ lesson: 'what-is-dns', term: 'term-root' }],
    },
    {
      id: 'top-level-domain',
      term: 'Top-level domain',
      also: ['TLD'],
      definition: [
        {
          id: 'top-level-domain-1',
          text: 'A top-level domain (TLD) is a domain one level below the root, such as .com, .jp or .app: the last part of a name like example.com.',
          cite: [rfc('rfc-9499', '2'), IANA_APP, d('rfc-1034', '3.1'), IANA_ROOT_ZONE],
        },
        {
          id: 'top-level-domain-2',
          text: 'Its name servers point to the name servers of the domains under it.',
          cite: [rfc('rfc-9499', '2'), rfc('rfc-9499', '7'), d('rfc-1034', '4.2.1'), d('rfc-1034', '4.3.2')],
        },
        {
          id: 'top-level-domain-3',
          text: 'TLDs are often grouped into country-code TLDs (ccTLDs) and generic TLDs (gTLDs), such as .app.',
          cite: [
            rfc('rfc-9499', '2'),
            IANA_APP,
            cite('iana-root-db', 'Top-Level Domains', { url: 'https://www.iana.org/domains/root/db#:~:text=Country%20Code' }),
          ],
        },
      ],
      lessons: [{ lesson: 'what-is-dns', term: 'term-tld' }],
    },
    {
      id: 'referral',
      term: 'Referral',
      definition: [
        {
          id: 'referral-1',
          text: 'A referral is an answer from a name server that does not have the answer itself, telling the resolver which servers to ask instead.',
          cite: [rfc('rfc-9499', '4'), d('rfc-1034', '4.3.1')],
        },
        {
          id: 'referral-2',
          text: 'It names those servers, usually with their addresses, a step closer to the answer.',
          cite: [d('rfc-1034', '4.3.2'), d('rfc-1034', '4.3.1'), rfc('rfc-9499', '6')],
        },
        {
          id: 'referral-3',
          text: 'A recursive resolver follows referrals itself, server by server, so the device that asked gets the answer, never a referral.',
          cite: [d('rfc-1034', '4.3.1'), d('rfc-1034', '5.3.3'), rfc('rfc-9499', '6')],
        },
      ],
      lessons: [{ lesson: 'what-is-dns', term: 'term-referral' }],
    },
    {
      id: 'authoritative-server',
      term: 'Authoritative server',
      definition: [
        {
          id: 'authoritative-server-1',
          text: 'An authoritative server is a name server that holds a zone’s records itself, so it answers for the names in that zone without asking other servers.',
          cite: [rfc('rfc-9499', '6'), d('rfc-1034', '2.4')],
        },
        {
          id: 'authoritative-server-2',
          text: 'Its answers are marked as authoritative (the AA flag), unlike answers a resolver gives from its cache.',
          cite: [d('rfc-1035', '4.1.1'), d('rfc-1034', '4.1'), rfc('rfc-9499', '6')],
        },
        {
          id: 'authoritative-server-3',
          text: 'A domain’s NS records name its authoritative servers, and there are normally at least two.',
          cite: [rfc('rfc-9499', '6'), d('rfc-1035', '3.2.2'), d('rfc-1034', '4.1')],
        },
      ],
      lessons: [{ lesson: 'what-is-dns', term: 'term-auth' }],
    },
    {
      id: 'name-server',
      term: 'Name server',
      also: ['Nameserver', 'DNS server'],
      definition: [
        {
          id: 'name-server-1',
          text: 'A name server (also nameserver or DNS server) is a server that holds part of the DNS’s data, in zones, and answers queries about it.',
          cite: [d('rfc-1034', '2.4'), d('rfc-1034', '4.1'), rfc('rfc-9499', '6')],
        },
        {
          id: 'name-server-2',
          text: 'Root, TLD and authoritative servers are all name servers; each answers from its zones or with a referral.',
          cite: [d('rfc-1034', '4.1'), rfc('rfc-7720', '1'), IANA_ROOT_SERVERS, ROOT_ZONE_APP, d('rfc-1035', '3.2.2'), rfc('rfc-9499', '6'), rfc('rfc-9499', '2')],
        },
        {
          id: 'name-server-3',
          text: 'These names are also used for recursive resolvers, so which is meant depends on context.',
          cite: [rfc('rfc-9499', '6'), d('rfc-1034', '5.3.1'), MS_IPCONFIG],
        },
      ],
    },
    {
      id: 'a-record',
      term: 'A record',
      definition: [
        {
          id: 'a-record-1',
          text: 'An A record is a DNS record that holds one IPv4 address for a name.',
          cite: [d('rfc-1035', '3.2.2'), d('rfc-1035', '3.4.1'), rfc('rfc-3596', '1')],
        },
        {
          id: 'a-record-2',
          text: 'A name with several IPv4 addresses has several A records.',
          cite: [d('rfc-1035', '3.4.1')],
        },
        {
          id: 'a-record-3',
          text: 'IPv6 addresses go in a different record, the AAAA record.',
          cite: [d('rfc-3596', '2.1'), rfc('rfc-9499', '5')],
        },
      ],
      lessons: [{ lesson: 'what-is-dns', term: 'term-a' }],
    },
    {
      id: 'dns-cache',
      term: 'DNS cache',
      definition: [
        {
          id: 'dns-cache-1',
          text: 'A DNS cache holds answers a resolver has already received, so it can answer again without asking name servers.',
          cite: [d('rfc-1034', '5.1'), d('rfc-1034', '5.3.3'), rfc('rfc-9499', '6')],
        },
        {
          id: 'dns-cache-2',
          text: 'An answer may be kept for the time its TTL gives, then is asked for again.',
          cite: [d('rfc-8767', '4'), d('rfc-1034', '3.6')],
        },
        {
          id: 'dns-cache-3',
          text: 'A device may keep its own cache, and a recursive resolver usually keeps one shared by all its users.',
          cite: [MS_IPCONFIG, d('rfc-1034', '5.1'), d('rfc-1034', '5.3.1'), rfc('rfc-1034', '4.3.1'), rfc('rfc-9499', '6')],
        },
      ],
      lessons: [{ lesson: 'what-is-dns', term: 'term-cache' }],
    },
  ],
});
