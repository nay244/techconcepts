import { defineLesson } from "../define";
import {
  eventLog,
  messagesFor,
  type MockupMessage,
} from "../helpers/internet-events";
import type { Backing, SceneEvent, TableDef } from "../schema";
import { cite } from "../sources";

/**
 * DNS, lesson 6 of How the Internet Works’ 14. The laptop asks its resolver for techconcepts.app, and the
 * resolver asks its way down the name: a root server, then the .app servers, then the site’s own name server. Both
 * keep the answer for its TTL, so the next lookup needs no trips.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols.mjs), changed only where a source does
 * not state them. The addresses (RFC 5737 and RFC 1918), the ports 50611 and 41877, the timings, the TTLs 5 minutes,
 * 300 seconds and 1 day, "about 60 ms" and the names techconcepts.app and ns1.techconcepts.app are example data: no
 * source states them, and the scene's events carry them beside the claims they trace to. The message sizes are
 * dashes, because no source states a query's or an answer's size. The building analogy cites nothing.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) =>
  cite(source, section, defining ? { defining: true } : {});

const CLOUDFLARE =
  "https://developers.cloudflare.com/fundamentals/reference/network-layers/";
/** No standard puts DNS at an OSI layer (X.200 never names it), so the badge rests on two vendors' own mappings. */
const CLOUDFLARE_L7 = cite("cloudflare-network-layers", "Network Layers", {
  url: `${CLOUDFLARE}#:~:text=7%20Application%20layer`,
});
const MS_TRAFFIC_MANAGER =
  "https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-how-it-works";
const MS_L7 = cite("microsoft-traffic-manager", "How Traffic Manager works", {
  url: `${MS_TRAFFIC_MANAGER}#:~:text=Traffic%20Manager%20works%20at%20the%20DNS%20level`,
});

const IANA_PORTS = cite("iana-ports", "Registry", {
  url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers",
  defining: true,
});

const IANA_ROOT_SERVERS = cite("iana-root-servers", "Root Name Servers", {
  url: "https://www.iana.org/domains/root/servers#:~:text=13%20named%20authorities",
});
const IANA_ROOT_ZONE = cite("iana-root-zone", "Root Zone Management", {
  url: "https://www.iana.org/domains/root#:~:text=principally%20composed%20of%20delegations",
});
const IANA_APP = cite("iana-root-db-app", ".app Top-Level Domain", {
  url: "https://www.iana.org/domains/root/db/app.html#:~:text=Generic%20top-level%20domain",
});
/** The root zone is the data the root servers serve: it defines the 13 names and the TTL of a TLD's referral. */
const ROOT_ZONE_NAMES = cite(
  "iana-root-zone-file",
  "The root zone’s NS records",
  {
    url: "https://www.internic.net/domain/root.zone#:~:text=a.root-servers.net",
    defining: true,
  },
);
const ROOT_ZONE_APP = cite("iana-root-zone-file", "The app. NS records", {
  url: "https://www.internic.net/domain/root.zone#:~:text=ns-tld1.charlestonroadregistry.com",
  defining: true,
});
const RSSAC = cite("icann-rssac-faq", "1.1", {
  url: "https://www.icann.org/en/rssac/faq#:~:text=more%20than%201500%20anycast%20instances",
});

const MS_IPCONFIG = cite("microsoft-ipconfig", "Parameters", {
  url: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig#:~:text=DNS%20client%20resolver%20cache",
});
const MS_365 = cite(
  "microsoft-365-add-domain",
  "Add a domain to Microsoft 365",
  {
    url: "https://learn.microsoft.com/en-us/microsoft-365/admin/setup/add-domain#:~:text=verify%20domain%20ownership",
  },
);

// ---------------------------------------------------------------- events

const LAPTOP = "192.168.1.100:50611";
const RESOLVER = "192.0.2.53:53";
const RESOLVER_OUT = "192.0.2.53:41877";

const learned: TableDef = {
  id: "learned",
  title: "What the resolver learned",
  by: "and how long it may keep it",
  columns: [
    { key: "name", label: "Name" },
    { key: "answer", label: "Answer" },
    { key: "from", label: "From", prose: true },
    { key: "keeps", label: "Keeps for" },
  ],
  keyColumn: "from",
  initialRows: [],
  empty: "Nothing yet. The resolver hasn’t asked anyone.",
};

const mockup = messagesFor(learned);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

export default defineLesson({
  slug: "what-is-dns",
  title: "DNS",
  subtitle: "Names into numbers",
  level: "beginner",
  certTags: [],
  summary:
    "You know websites by name. Computers know each other by number. DNS is the internet’s directory that turns one into the other, and it finds the answer by asking a chain of servers, each one knowing a little more.",
  figure: "net-map",
  backing: {
    traces: ["lead-1", "fact-used", "term-referral", "pattern", "why-1"],
  },
  units: [
    {
      id: "dns",
      name: "DNS",
      fullName: "Domain Name System",
      purpose: "Names into numbers",
      group: "app",
      // No standard puts DNS at an OSI layer (X.200 never names it), so the badge rests on two vendors' own mappings.
      osi: { layers: [7], cite: [CLOUDFLARE_L7, MS_L7] },
      backing: { traces: ["fact-defined", "fact-used"] },
      scene: {
        title: "The resolver asks its way down the name",
        views: ["network", "sequence"],
        layers: ["dns:names"],
        labels: { laptop: "Wants techconcepts.app", url: "techconcepts.app" },
        start: [],
        panel: { type: "table", table: learned },
        log: eventLog(),
        parties: [
          { place: "laptop", label: "Laptop", addr: "192.168.1.100" },
          { place: "resolver", label: "DNS resolver", addr: "192.0.2.53" },
          { place: "root", label: "Root server", addr: "192.0.2.10" },
          { place: "tld", label: ".app server", addr: "192.0.2.20" },
          {
            place: "auth",
            label: "ns1.techconcepts.app",
            addr: "198.51.100.40",
          },
        ],
        backing: {
          traces: [
            "deep-1",
            "pattern",
            "term-resolver",
            "term-root",
            "term-tld",
            "term-auth",
            "term-referral",
            "fact-used",
          ],
        },
      },
      overview: {
        hook: "You know websites by name. Computers know each other by number. DNS is the internet’s directory that turns one into the other, and it finds the answer by asking a chain of servers, each one knowing a little more.",
        hookBacking: {
          traces: ["lead-1", "fact-used", "term-referral", "pattern", "why-1"],
        },
        description:
          "It’s like asking the way in a big building. Reception sends you to the right floor, the floor’s desk sends you to the right office, and the office has your answer. DNS goes the same way, from the end of the name back: first the root, then .app, then techconcepts.app itself.",
        backing: { analogy: true },
        facts: [
          {
            label: "Used for",
            value: "turning names into IP addresses",
            backing: { traces: ["fact-used"] },
          },
          {
            label: "Port",
            value: "UDP 53 (TCP 53 for big answers)",
            backing: { traces: ["fact-port", "deep-2"] },
          },
          {
            label: "Who asks",
            value: "your laptop asks a resolver; the resolver asks the rest",
            backing: { traces: ["fact-who", "deep-1"] },
          },
          {
            label: "Answers kept",
            value: "for a set time, the TTL",
            backing: { traces: ["term-ttl", "fact-ttl"] },
          },
          {
            label: "OSI layer",
            value: "7, application",
            backing: { traces: ["fact-osi"] },
          },
          {
            label: "This example",
            value: "techconcepts.app",
            backing: { example: true },
          },
        ],
      },
      steps: [
        {
          id: "recursive-query",
          title: "Recursive Query",
          sub: "What’s the number for techconcepts.app?",
          narrative:
            "Your laptop doesn’t look names up by itself. It asks one helper, the **DNS resolver**, usually run by your internet provider. The question is short: “What’s the number for techconcepts.app?” That’s a **DNS query**. The resolver checks its notes, finds nothing recent, and goes to find out.",
          deep: [
            {
              text: "The laptop’s query is recursive: it wants the final answer, not directions. The resolver’s own address comes from the network settings, usually handed out by DHCP. This query asks for an A record (IPv4); browsers often ask for AAAA (IPv6) at the same time.",
              cite: [
                rfc("rfc-1034", "4.3.1", true),
                rfc("rfc-9499", "6"),
                rfc("rfc-9076", "5.1"),
                rfc("rfc-2132", "3.8", true),
                rfc("rfc-1035", "3.2.2", true),
                rfc("rfc-1035", "3.4.1", true),
                rfc("rfc-3596", "2.1", true),
                rfc("rfc-8305", "3"),
              ],
            },
          ],
          facts: [
            {
              label: "From",
              value: "192.168.1.100, UDP port 50611",
              backing: { traces: ["fact-port"] },
            },
            {
              label: "To",
              value: "192.0.2.53, UDP port 53",
              backing: { traces: ["fact-port"] },
            },
            {
              label: "Asks for",
              value: "the A record of techconcepts.app",
              backing: { traces: ["term-a", "fact-types"] },
            },
            {
              label: "Kind",
              value: "recursive: “just give me the answer”",
              backing: { traces: ["deep-1"] },
            },
          ],
          events: [
            ...msgOf(
              "fact-port",
              "fact-used",
              "term-a",
              "deep-1",
              "term-resolver",
            )({
              tag: "QUERY",
              from: "laptop",
              to: "resolver",
              proto: "DNS",
              via: "UDP",
              kind: "request",
              time: "0.000s",
              src: LAPTOP,
              dst: RESOLVER,
              size: "—",
              sum: "What’s the number for techconcepts.app?",
              info: "Query: A techconcepts.app (recursive)",
              st: "Asking the resolver",
            }),
          ],
          backing: {
            traces: [
              "fact-who",
              "term-resolver",
              "fact-used",
              "term-a",
              "term-cache",
              "fact-cache",
              "fact-port",
              "deep-1",
              "pattern",
            ],
          },
        },
        {
          id: "root-referral",
          title: "Root Referral",
          sub: "“Ask the .app servers”",
          narrative:
            "The resolver starts at the top, with a **root server**. The root doesn’t know every name. It knows who looks after each ending, like .com, .org or .app. So it answers with directions: “I don’t know techconcepts.app, but the .app servers do, and here’s where they are.” That kind of answer is a **referral**.",
          deep: [
            {
              text: "There are 13 root server names (a.root-servers.net to m.root-servers.net), together run as hundreds of copies around the world. Endings like .app are top-level domains, TLDs. Resolvers keep the root’s referrals for up to two days, so they rarely need to ask the root at all.",
              cite: [
                IANA_ROOT_SERVERS,
                ROOT_ZONE_NAMES,
                RSSAC,
                rfc("rfc-9499", "6"),
                rfc("rfc-9499", "2"),
                IANA_APP,
                rfc("rfc-8806", "1"),
                ROOT_ZONE_APP,
                rfc("rfc-9499", "5"),
              ],
            },
          ],
          facts: [
            {
              label: "Asks",
              value: "a root server, 192.0.2.10",
              backing: { traces: ["term-root"] },
            },
            {
              label: "Answer",
              value: "a referral to the .app servers",
              backing: { traces: ["term-referral"] },
            },
            {
              label: "Endings like .app",
              value: "top-level domains (TLDs)",
              backing: { traces: ["term-tld"] },
            },
            {
              label: "Kept for",
              value: "up to 2 days",
              backing: { traces: ["fact-ttl"] },
            },
          ],
          events: [
            ...msgOf(
              "term-root",
              "fact-port",
              "term-a",
              "deep-1",
              "deep-4",
            )({
              tag: "QUERY",
              from: "resolver",
              to: "root",
              proto: "DNS",
              via: "UDP",
              kind: "request",
              time: "0.003s",
              src: RESOLVER_OUT,
              dst: "192.0.2.10:53",
              size: "—",
              sum: "Where’s techconcepts.app?",
              info: "Query: A techconcepts.app",
            }),
            ...msgOf(
              "term-referral",
              "term-root",
              "term-tld",
              "fact-types",
              "fact-ttl",
              "fact-port",
            )({
              tag: "ASK .APP",
              from: "root",
              to: "resolver",
              proto: "DNS",
              via: "UDP",
              kind: "response",
              time: "0.017s",
              src: "192.0.2.10:53",
              dst: RESOLVER_OUT,
              size: "—",
              sum: "Not mine. Ask the .app servers, at 192.0.2.20.",
              info: "Referral: NS for app., 192.0.2.20",
              rows: [
                {
                  key: "app",
                  cells: [".app", "ask 192.0.2.20", "root", "2 days"],
                },
              ],
            }),
          ],
          backing: {
            traces: [
              "term-referral",
              "term-root",
              "term-tld",
              "fact-ttl",
              "fact-port",
              "fact-types",
              "deep-1",
              "deep-4",
              "pattern",
            ],
          },
        },
        {
          id: "tld-referral",
          title: "TLD Referral",
          sub: "“Ask ns1.techconcepts.app”",
          narrative:
            "Next it asks the **.app servers**. They keep a list of every name ending in .app and who’s in charge of each. Directions again: “techconcepts.app is looked after by ns1.techconcepts.app, at 198.51.100.40.” That server is the site’s own **name server**, the one that knows for sure.",
          deep: [
            {
              text: "The .app servers are the TLD servers for .app. The server they point to is authoritative for techconcepts.app: its answers come from the site’s own records, not from memory. Most sites have at least two name servers, in case one is down.",
              cite: [
                rfc("rfc-9499", "2"),
                IANA_APP,
                rfc("rfc-9499", "6"),
                rfc("rfc-1034", "4.1", true),
              ],
            },
          ],
          facts: [
            {
              label: "Asks",
              value: "a .app server, 192.0.2.20",
              backing: { traces: ["term-tld"] },
            },
            {
              label: "Answer",
              value: "ns1.techconcepts.app, 198.51.100.40",
              backing: { traces: ["term-referral"] },
            },
            {
              label: "That server is",
              value: "authoritative for techconcepts.app",
              backing: { traces: ["term-auth"] },
            },
            { label: "Kept for", value: "1 day", backing: { example: true } },
          ],
          events: [
            ...msgOf(
              "term-tld",
              "fact-port",
              "term-a",
              "deep-1",
              "deep-4",
            )({
              tag: "QUERY",
              from: "resolver",
              to: "tld",
              proto: "DNS",
              via: "UDP",
              kind: "request",
              time: "0.018s",
              src: RESOLVER_OUT,
              dst: "192.0.2.20:53",
              size: "—",
              sum: "Where’s techconcepts.app?",
              info: "Query: A techconcepts.app",
            }),
            ...msgOf(
              "term-referral",
              "term-tld",
              "term-auth",
              "fact-types",
              "fact-ttl",
              "fact-port",
            )({
              tag: "ASK NS1",
              from: "tld",
              to: "resolver",
              proto: "DNS",
              via: "UDP",
              kind: "response",
              time: "0.036s",
              src: "192.0.2.20:53",
              dst: RESOLVER_OUT,
              size: "—",
              sum: "Ask its name server, ns1.techconcepts.app, at 198.51.100.40.",
              info: "Referral: NS ns1.techconcepts.app, 198.51.100.40",
              rows: [
                {
                  key: "ns",
                  cells: [
                    "techconcepts.app",
                    "ask ns1, 198.51.100.40",
                    ".app servers",
                    "1 day",
                  ],
                },
              ],
            }),
          ],
          backing: {
            traces: [
              "term-referral",
              "term-tld",
              "term-auth",
              "fact-ttl",
              "fact-port",
              "fact-types",
              "deep-1",
              "deep-4",
              "pattern",
            ],
          },
        },
        {
          id: "authoritative-answer",
          title: "Authoritative Answer",
          sub: "It’s 198.51.100.7",
          narrative:
            "Last, the resolver asks the site’s own name server, which looks the name up in its records: “techconcepts.app is 198.51.100.7, and you can keep that for 5 minutes.” That line of the records is an **A record**, and the 5 minutes is its **TTL**, its time to live.",
          deep: [
            {
              text: "Common record types: A (an IPv4 address), AAAA (IPv6), CNAME (this name is another name for that one), MX (the domain’s mail server), NS (its name servers), TXT (notes, often used to prove you own a domain). The site owner sets each TTL; a short one lets changes spread quickly.",
              cite: [
                rfc("rfc-1035", "3.2.2", true),
                rfc("rfc-1035", "3.3.14", true),
                rfc("rfc-3596", "2.1", true),
                rfc("rfc-8555", "8.4"),
                MS_365,
                rfc("rfc-1034", "3.6", true),
              ],
            },
          ],
          facts: [
            {
              label: "Asks",
              value: "ns1.techconcepts.app, 198.51.100.40",
              backing: { example: true },
            },
            {
              label: "Answer",
              value: "A record: 198.51.100.7",
              backing: { traces: ["term-a"] },
            },
            {
              label: "TTL",
              value: "300 seconds",
              backing: { traces: ["term-ttl", "fact-ttl"] },
            },
            {
              label: "Other types",
              value: "AAAA, CNAME, MX, NS, TXT",
              backing: { traces: ["fact-types"] },
            },
          ],
          events: [
            ...msgOf(
              "term-auth",
              "fact-port",
              "term-a",
              "deep-1",
            )({
              tag: "QUERY",
              from: "resolver",
              to: "auth",
              proto: "DNS",
              via: "UDP",
              kind: "request",
              time: "0.037s",
              src: RESOLVER_OUT,
              dst: "198.51.100.40:53",
              size: "—",
              sum: "What’s the number for techconcepts.app?",
              info: "Query: A techconcepts.app",
            }),
            ...msgOf(
              "term-auth",
              "term-a",
              "term-ttl",
              "fact-ttl",
              "fact-port",
            )({
              tag: "ANSWER",
              from: "auth",
              to: "resolver",
              proto: "DNS",
              via: "UDP",
              kind: "response",
              time: "0.058s",
              src: "198.51.100.40:53",
              dst: RESOLVER_OUT,
              size: "—",
              sum: "techconcepts.app is 198.51.100.7. Keep it for 5 minutes.",
              info: "Answer: A 198.51.100.7, TTL 300 (authoritative)",
              rows: [
                {
                  key: "a",
                  cells: ["techconcepts.app", "198.51.100.7", "ns1", "5 min"],
                },
              ],
            }),
          ],
          backing: {
            traces: [
              "term-auth",
              "term-a",
              "term-ttl",
              "fact-ttl",
              "fact-types",
              "fact-port",
              "deep-1",
              "pattern",
            ],
          },
        },
        {
          id: "response-and-caching",
          title: "Response and Caching",
          sub: "Next time, no trips",
          narrative:
            "The resolver hands the answer to your laptop, and both keep a copy until the TTL runs out. The next time anyone using this resolver asks for techconcepts.app, it answers from memory, straight away. That memory is the **DNS cache**, and it’s why most lookups take a few milliseconds instead of four trips.",
          deep: [
            {
              text: "Caches sit in more than one place: the laptop and the resolver each keep answers until the TTL runs out. A wrong entry in a cache sends people to the wrong place until it expires; DNSSEC lets resolvers check that answers were signed by the domain’s owner.",
              cite: [
                MS_IPCONFIG,
                rfc("rfc-1034", "5.3.2", true),
                rfc("rfc-9499", "6"),
                rfc("rfc-5452", "3"),
                rfc("rfc-3833", "2.3"),
                rfc("rfc-5452", "7.2"),
                rfc("rfc-4033", "3.1", true),
                rfc("rfc-4033", "1", true),
              ],
            },
          ],
          facts: [
            {
              label: "Answer to the laptop",
              value: "techconcepts.app is 198.51.100.7",
              backing: { traces: ["fact-used"] },
            },
            {
              label: "Trips this time",
              value: "4: the laptop’s, then root, .app and ns1",
              backing: { traces: ["lead-1", "pattern"] },
            },
            {
              label: "Next time",
              value: "none, until the TTL ends",
              backing: { traces: ["fact-cache"] },
            },
            {
              label: "Took",
              value: "about 60 ms",
              backing: { traces: ["fact-used"] },
            },
          ],
          events: [
            ...msgOf(
              "fact-used",
              "term-a",
              "term-ttl",
              "fact-ttl",
              "fact-port",
              "term-cache",
            )({
              tag: "ANSWER",
              from: "resolver",
              to: "laptop",
              proto: "DNS",
              via: "UDP",
              kind: "response",
              time: "0.059s",
              src: RESOLVER,
              dst: LAPTOP,
              size: "—",
              sum: "techconcepts.app is 198.51.100.7.",
              info: "Response: A 198.51.100.7, TTL 300",
              st: "Found 198.51.100.7",
              done: true,
            }),
          ],
          backing: {
            traces: [
              "term-cache",
              "fact-cache",
              "term-ttl",
              "fact-ttl",
              "fact-used",
              "fact-port",
              "lead-1",
              "pattern",
            ],
          },
        },
      ],
      learn: {
        lead: [
          {
            id: "lead-1",
            text: "Four servers, four trips, and a name became a number. Here are the parts and what they’re called.",
            cite: [rfc("rfc-1034", "5.3.3", true), rfc("rfc-9499", "6")],
          },
        ],
        terms: [
          {
            id: "term-resolver",
            idea: "The helper that looks names up for you",
            name: "DNS resolver",
            cite: [rfc("rfc-1034", "2.4", true), rfc("rfc-9499", "6")],
          },
          {
            id: "term-root",
            idea: "The top of the directory, who knows each ending",
            name: "Root server",
            cite: [IANA_ROOT_ZONE, rfc("rfc-7720", "1")],
          },
          {
            id: "term-tld",
            idea: "The endings, like .app or .com, each with a list of the names under it",
            name: "Top-level domain",
            cite: [rfc("rfc-9499", "2"), rfc("rfc-9499", "7"), IANA_APP],
          },
          {
            id: "term-referral",
            idea: "“I don’t know, but ask them, and here’s where they are”",
            name: "Referral",
            cite: [
              rfc("rfc-9499", "4"),
              rfc("rfc-1034", "4.3.1", true),
              rfc("rfc-1034", "4.3.2", true),
            ],
          },
          {
            id: "term-auth",
            idea: "The server that knows a site’s names for sure",
            name: "Authoritative server",
            cite: [rfc("rfc-9499", "6"), rfc("rfc-1034", "2.4", true)],
          },
          {
            id: "term-a",
            idea: "The line that says name = number",
            name: "A record",
            cite: [
              rfc("rfc-1035", "3.2.2", true),
              rfc("rfc-1035", "3.4.1", true),
            ],
          },
          {
            id: "term-ttl",
            idea: "How long an answer may be kept",
            name: "TTL",
            cite: [rfc("rfc-8767", "4", true), rfc("rfc-1034", "3.6", true)],
          },
          {
            id: "term-cache",
            idea: "Answers kept for next time",
            name: "DNS cache",
            cite: [
              rfc("rfc-1034", "5.1", true),
              rfc("rfc-1034", "5.3.3", true),
            ],
          },
        ],
        pattern: {
          id: "pattern",
          names: ["Recursive Query", "Root", "TLD", "Authoritative", "Cache"],
          note: "A lookup reads the name from the end: the ending first, the site last.",
          cite: [rfc("rfc-1034", "5.3.3", true), rfc("rfc-1034", "3.1", true)],
        },
        why: [
          {
            id: "why-1",
            text: "No single server could hold every name on the internet and answer everyone.",
            cite: [rfc("rfc-1034", "2.2", true)],
          },
          {
            id: "why-2",
            text: "Splitting the work by ending, and letting everyone keep answers for a while, keeps DNS fast and keeps it working even when parts of it are down.",
            cite: [
              rfc("rfc-1034", "2.2", true),
              rfc("rfc-1034", "4.1", true),
              rfc("rfc-1034", "2.3", true),
            ],
          },
        ],
        deep: [
          {
            id: "deep-1",
            text: "Your laptop sends one recursive query; the resolver sends iterative ones, following each referral itself.",
            cite: [rfc("rfc-9499", "6"), rfc("rfc-1034", "4.3.1", true)],
          },
          {
            id: "deep-2",
            text: "Queries normally use UDP; answers too big for one packet, and copies of a whole zone between name servers, use TCP.",
            cite: [
              rfc("rfc-7766", "1", true),
              rfc("rfc-1035", "4.2.1", true),
              rfc("rfc-1035", "4.2", true),
            ],
          },
          {
            id: "deep-3",
            text: "DNS over HTTPS (DoH, 443) and DNS over TLS (DoT, 853) hide your lookups from the network.",
            cite: [
              rfc("rfc-8484", "8.1", true),
              rfc("rfc-7858", "3.1", true),
              rfc("rfc-7858", "1", true),
            ],
          },
          {
            id: "deep-4",
            text: "Traditionally the resolver asks each server for the whole name. Many resolvers now tell each server only as much of the name as it needs, so the root is asked about .app.",
            cite: [rfc("rfc-9156", "2", true), rfc("rfc-9156", "1.1")],
          },
        ],
        facts: [
          {
            id: "fact-port",
            label: "Port",
            value: "UDP 53, TCP 53",
            cite: [rfc("rfc-1035", "4.2", true), IANA_PORTS],
          },
          {
            id: "fact-types",
            label: "Record types",
            value: "A, AAAA, CNAME, MX, NS, TXT, PTR",
            cite: [
              rfc("rfc-1035", "3.2.2", true),
              rfc("rfc-3596", "2.1", true),
            ],
          },
          {
            id: "fact-root",
            label: "Root servers",
            value: "13 names, hundreds of copies",
            cite: [IANA_ROOT_SERVERS, ROOT_ZONE_NAMES, RSSAC],
          },
          {
            id: "fact-encrypted",
            label: "Encrypted",
            value: "DoH (443), DoT (853)",
            cite: [rfc("rfc-8484", "8.1", true), rfc("rfc-7858", "3.1", true)],
          },
          {
            id: "fact-defined",
            label: "Defined in",
            value: "RFC 1034, RFC 1035 (Domain Name System)",
            cite: [
              rfc("rfc-9499", "1"),
              rfc("rfc-1034", "1", true),
              rfc("rfc-1035", "1", true),
            ],
          },
          {
            id: "fact-used",
            label: "Used for",
            value:
              "turning names into IP addresses; a lookup can take from milliseconds to seconds",
            cite: [
              rfc("rfc-1034", "5.2.1", true),
              rfc("rfc-1034", "5.1", true),
              rfc("rfc-9499", "6"),
            ],
          },
          {
            id: "fact-who",
            label: "Who asks",
            value:
              "your laptop asks a resolver, usually your internet provider’s, set up by DHCP; the resolver asks the rest",
            cite: [
              rfc("rfc-9076", "5.1"),
              rfc("rfc-5625", "1"),
              rfc("rfc-2132", "3.8", true),
              rfc("rfc-1034", "5.3.1", true),
            ],
          },
          {
            id: "fact-ttl",
            label: "TTL",
            value:
              "set by whoever runs the name, counted in seconds; the root’s referrals to a TLD last up to two days",
            cite: [
              rfc("rfc-1034", "3.6", true),
              rfc("rfc-8767", "4", true),
              ROOT_ZONE_APP,
              rfc("rfc-8806", "1"),
            ],
          },
          {
            id: "fact-cache",
            label: "Kept by",
            value:
              "your laptop and the resolver, until the TTL runs out; an answer found in a cache needs no trip to other servers",
            cite: [
              rfc("rfc-1034", "5.1", true),
              rfc("rfc-1034", "5.3.3", true),
              rfc("rfc-9499", "6"),
              MS_IPCONFIG,
            ],
          },
          {
            id: "fact-osi",
            label: "OSI layer",
            value: "7, application",
            cite: [CLOUDFLARE_L7, MS_L7],
          },
        ],
      },
      practice: [
        {
          id: "root-referral",
          prompt:
            "The root server doesn’t know techconcepts.app. What does it send back?",
          options: [
            {
              text: "An error: no such name.",
              feedback:
                "Not quite. The root doesn’t know the name, but it isn’t an error. It sends directions to the .app servers.",
              cite: [rfc("rfc-1034", "4.3.1", true), rfc("rfc-9499", "4")],
            },
            {
              text: "Directions to the servers for .app.",
              feedback: "Right. That’s a referral: “not mine, ask them.”",
              cite: [rfc("rfc-1034", "4.3.1", true), rfc("rfc-9499", "4")],
            },
            {
              text: "The website itself.",
              feedback:
                "Not quite. No DNS server has the website. They hold records about names, such as a name’s number.",
              cite: [
                rfc("rfc-1034", "3.6", true),
                rfc("rfc-1035", "3.2.2", true),
              ],
            },
          ],
          answer: 1,
        },
        {
          id: "cached",
          prompt:
            "A minute later you look up techconcepts.app again. Why is it almost instant?",
          options: [
            {
              text: "The answer is still in a cache, until its TTL runs out.",
              feedback:
                "Yes. The laptop and the resolver both kept it for 5 minutes.",
              cite: [
                rfc("rfc-1034", "5.3.3", true),
                rfc("rfc-9499", "6"),
                MS_IPCONFIG,
                rfc("rfc-8767", "4", true),
              ],
            },
            {
              text: "The root server remembers you.",
              feedback:
                "Not quite. The root isn’t asked again at all. The answer comes from a cache.",
              cite: [
                rfc("rfc-1034", "5.3.3", true),
                rfc("rfc-1034", "5.3.1", true),
              ],
            },
            {
              text: "Each name can only be looked up once.",
              feedback:
                "Not quite. Names are looked up again whenever the cached answer runs out.",
              cite: [
                rfc("rfc-1035", "3.2.1", true),
                rfc("rfc-8767", "4", true),
              ],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
