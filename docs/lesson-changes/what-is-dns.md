# What is DNS: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 29 sources (it listed two, RFC 1034 and RFC 1035, before) and passed its fact-check on 2026-11-11, all 89 items. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays as written, even where the source is more exact, and only what would leave a beginner believing something false is changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-dns.ts`), it has 3 corrections, 8 removals, 7 additions and 5 rewordings; the last section lists what is word for word as before. The five steps, their titles and order, every event, the scene, the table and the two questions are unchanged.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; the IANA, ICANN, Cloudflare and Microsoft pages have no section numbers, so they are cited by their heading.

## The changes to look at first

1. **"Hundreds of copies" is the total, not per name.** Step 2's Go deeper said each of the 13 root server names is "run as hundreds of copies". IANA counts hundreds of servers across all 13 names together. It now says "together run as hundreds of copies". (Correction 1.)
2. **Caches: the browser and the home router are gone.** Step 5's Go deeper listed the browser, the laptop, the home router and the resolver. A home router's DNS proxy typically has no cache (RFC 5625), and no allowed source describes a browser's own DNS cache. It now names the laptop and the resolver. (Correction 2.)
3. **A wrong answer to the "website itself" option.** Its feedback said DNS servers "only deal in names and numbers", which the lesson itself contradicts in step 4 (TXT, mail servers, aliases). It now says they hold records about names. (Correction 3.)
4. **The message sizes are dashes.** The log showed 75 B, 312 B, 158 B and 91 B as if they were facts about the protocol. No source states them. (Removals 1 to 8.)
5. **Query name minimisation is added to Learn's Go deeper.** The lesson shows the resolver asking the root for the whole name, which is the traditional way. Many resolvers now send each server only as much as it needs (RFC 9156). One short paragraph says so; the events stay as they were. (Addition 6.)

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 2 Go deeper | There are 13 root server names (a.root-servers.net to m.root-servers.net), each run as hundreds of copies around the world. | There are 13 root server names (a.root-servers.net to m.root-servers.net), together run as hundreds of copies around the world. | IANA Root Servers ("a network of hundreds of servers… configured… as 13 named authorities"); ICANN RSSAC FAQ §1.1 (more than 1500 anycast instances in all); IANA Root Zone File (the 13 NS records). |
| 2 | Step 5 Go deeper | Caches sit in many places: the browser, the laptop, the home router and the resolver, each counting down the TTL. | Caches sit in more than one place: the laptop and the resolver each keep answers until the TTL runs out. | RFC 5625 §1 (a home DNS proxy "typically do[es] not have any caching capabilities"); Microsoft ipconfig, Parameters (the laptop's resolver cache); RFC 1034 §5.3.2; RFC 9499 §6. No allowed source describes a browser's DNS cache. |
| P1 | Question 1, option "The website itself." | Not quite. No DNS server has the website. They only deal in names and numbers. | Not quite. No DNS server has the website. They hold records about names, such as a name’s number. | RFC 1034 §3.6 and RFC 1035 §3.2.2: DNS holds resource records of several types, not only numbers. |

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Step 1 event QUERY (laptop to resolver), log size | 75 B, now — | A size reads as a claim about the protocol and no source states a query's size. |
| 2 | Step 2 event QUERY (resolver to root), log size | 75 B, now — | The same. |
| 3 | Step 2 event ASK .APP (root to resolver), log size | 312 B, now — | No source states a referral's size. |
| 4 | Step 3 event QUERY (resolver to .app server), log size | 75 B, now — | As 1. |
| 5 | Step 3 event ASK NS1 (.app server to resolver), log size | 158 B, now — | As 3. |
| 6 | Step 4 event QUERY (resolver to ns1), log size | 75 B, now — | As 1. |
| 7 | Step 4 event ANSWER (ns1 to resolver), log size | 91 B, now — | No source states an answer's size. |
| 8 | Step 5 event ANSWER (resolver to laptop), log size | 91 B, now — | As 7. |

All times, addresses and ports in the log stay; they are example data.

## Added

New statements, terms, facts or sentences, with why each was needed.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact Used for | turning names into IP addresses; a lookup can take from milliseconds to seconds | The Overview fact, step 1's question and step 5's "Took" and "few milliseconds" trace to it (RFC 1034 §5.2.1, §5.1; RFC 9499 §6). |
| 2 | Learn fact Who asks | your laptop asks a resolver, usually your internet provider’s, set up by DHCP; the resolver asks the rest | Step 1's "usually run by your internet provider" and the Overview fact trace to it (RFC 9076 §5.1; RFC 5625 §1; RFC 2132 §3.8; RFC 1034 §5.3.1). |
| 3 | Learn fact TTL | set by whoever runs the name, counted in seconds; the root’s referrals to a TLD last up to two days | "300 seconds", "2 days" and the table's "Keeps for" column trace to it (RFC 1034 §3.6; RFC 8767 §4; IANA Root Zone File, the app. record's 172800 seconds; RFC 8806 §1). |
| 4 | Learn fact Kept by | your laptop and the resolver, until the TTL runs out; the resolver’s copy serves everyone who uses it, and answering most lookups from a cache, with no trip to other servers, keeps DNS fast | Step 5's "both keep a copy", "anyone using this resolver" and "most lookups" trace to it (RFC 1034 §5.1, §5.3.1, §5.3.3; RFC 9499 §6; Microsoft ipconfig). |
| 5 | Learn fact OSI layer | 7, application | Backs the Overview fact and the badge. No standard places DNS in the OSI model, so the badge rests on two vendors: Cloudflare's "Application layer: HTTP, DNS" row and Microsoft's Traffic Manager page. |
| 6 | Learn Go deeper | Traditionally the resolver asks each server for the whole name. Many resolvers now tell each server only as much of the name as it needs, so the root is asked about .app. | The root query in step 2 traces to it alongside the recursive/iterative paragraph (RFC 9156 §2, §1.1). |
| 7 | Learn, Sources list | 29 sources instead of two | Every cited claim lists its source at the foot of Learn. |

## Reworded, same meaning

Each widens a Learn part so the Watch words that trace to it are stated there.

| # | Where | Before | After |
|---|---|---|---|
| 1 | Learn term Top-level domain | The endings, like .app or .com | The endings, like .app or .com, each with a list of the names under it |
| 2 | Learn term Referral | “I don’t know, but ask them” | “I don’t know, but ask them, and here’s where they are” |
| 3 | Learn term Authoritative server | The server that knows a site’s names for sure | The name server that knows a site’s names for sure |
| 4 | Learn term TTL | How long an answer may be kept | How long an answer may be kept: its time to live |
| 5 | Learn fact Defined in | RFC 1034, RFC 1035 | RFC 1034, RFC 1035 (Domain Name System) |

## Passed as a simplification, with a note

Under the 2026-11-11 rule these sentences stay word for word because they are true in the ordinary case. The checker noted what each leaves out (from the notes in `docs/fact-checks/what-is-dns.md`).

| Sentence or fact | What it leaves out |
|---|---|
| "browsers often ask for AAAA (IPv6) at the same time" | The source says "clients" with both IPv4 and IPv6 connectivity; true on a dual-stack network. |
| "hundreds of copies" | ICANN counts more than 1500; "hundreds" is IANA's own word. |
| "up to two days" | Holds for TLD delegations in the root zone; a resolver may keep them for less. |
| "Most sites have at least two name servers" | The standard requires it of every zone, so "most" understates. |
| "not from memory" | Plain words for "local knowledge, without querying other servers". |
| "TXT (notes, often used to prove you own a domain)", "the site owner sets each TTL" | "Notes" is the everyday word for descriptive text; the zone's administrator may be a DNS host. |
| "both keep a copy" (laptop and resolver) | Not every operating system keeps a DNS cache. |
| "Four servers, four trips" | True for this walk with an empty cache; a warm cache needs fewer. |
| "who knows each ending" (root server) | It means the root knows where each ending is delegated. |
| "a list of the names under it" (TLD) | The beginner's word for the delegations a TLD zone holds. |
| "here’s where they are" (referral) | A referral may carry only names, with no addresses. |
| "A lookup reads the name from the end" | With cached delegations the lookup starts lower down. |
| "No single server could hold every name" | The source gives size and update rate as the reason; "could not" is stronger. |
| "keeps it working even when parts are down" | The resilience also comes from each zone's several servers and from cached copies. |
| "iterative ones" | RFC 9499's name is non-recursive queries in iterative resolution. |
| "answers too big for one packet… use TCP" | TCP is used for other things too. |
| "hide your lookups from the network" (DoH, DoT) | The resolver itself still sees each lookup. |
| Record types "A, AAAA, CNAME, MX, NS, TXT, PTR" | A selection, not every type. |
| "Defined in: RFC 1034, RFC 1035" | Many later RFCs update both. |
| "Used for: turning names into IP addresses" | DNS holds other data too. |
| Who asks / "usually run by your internet provider" | A home laptop's query often goes first to the router's proxy; some people pick a public resolver. |
| "Names are looked up again whenever the cached answer runs out" | "Whenever" means the next time the name is needed after that. |
| The scene's example name | techconcepts.app is a real registered domain, not a reserved example name; it is labelled as the example and its addresses are documentation addresses. |
| ".org" in a step 2 sentence | One more example ending than the Learn term names; it is a TLD in the live root zone. |

## Sources

The original listed two references (RFC 1034 and RFC 1035). The lesson now cites 29 sources:

- **IETF RFCs (19):** RFC 1034, 1035, 2132, 3596, 3833, 4033, 5452, 5625, 7720, 7766, 7858, 8305, 8484, 8555, 8767, 8806, 9076, 9156 and 9499. RFC 1034 and RFC 1035 are the two original references.
- **IANA (5):** the Port Numbers registry, Root Servers, Root Zone Management, the .app page, and the root zone file itself (on `www.internic.net`, the host IANA's Root Files page links it from).
- **Internet registry (1):** ICANN's RSSAC FAQ (new host `www.icann.org`), the second publisher for "hundreds of copies".
- **Vendors (4):** Cloudflare Network Layers, Microsoft ipconfig, Microsoft 365 "Add a domain" (a TXT record proves ownership), Microsoft Azure Traffic Manager (the badge's second source).

## Unchanged

Word for word as the original: the title ("DNS"), the full name ("Domain Name System"), the purpose ("Names into numbers"), the level and group; the OSI badge (layer 7, now cited); the scene's title, labels (Wants techconcepts.app, techconcepts.app), table (title, columns, empty text), the plate of name servers and the five parties; the hook, the building analogy and the Overview facts; all five step titles and subtitles, narratives and facts; step 1, 3 and 4's Go deeper paragraphs; all 8 events, in the same order, with their tags, addresses, ports, times, summaries, log lines and table rows (apart from the sizes above); Learn's lead, the eight term names, the pattern's five names and note, the why, and its Go deeper paragraphs on recursive and iterative queries, UDP and TCP, and DoH and DoT; Learn's facts Port, Record types, Root servers and Encrypted; both Practice prompts, their ids, the three options of each, the right answers, and all feedback except the one in Correction 3.

## Counts

The counts at the top were made by a script that counts the table rows under each heading (Corrections 3 = 2 numbered + P1; Removed 8; Added 7; Reworded 5), and the sources by the lesson's cited list on the claim sheet (29) against the two references of the original.
