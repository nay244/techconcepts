# What is DHCP: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 25 sources (it listed one, RFC 2131, before) and passed its fact-check on 2026-11-12, all 118 items, on its first full check. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-dhcp.ts`), it has 4 corrections, 3 removals, 12 additions and 2 rewordings; the last sections list what is word for word as before and what the checker passed as a simplification.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own. A vendor page has no section numbers, so its heading is given.

## The changes to look at first

1. **The OSI badge no longer says layer 7.** No allowed source places DHCP at an OSI layer: not RFC 2131, not Microsoft, Cisco, Palo Alto, Google or Canonical, and Cloudflare's layer list names HTTP and DNS, not DHCP. The badge now spans layers, and the Overview fact "OSI layer: 7, application" is gone. (Correction 4, removal 1.)
2. **"Every device that joins a network goes this way" is now "a device getting a new address".** A laptop that remembers its last address skips Discover and Offer and asks for it again with a Request, as the lesson's own step 1 says. (Correction 1.)
3. **"DHCP does it in a second" is now "DHCP does it automatically".** No source gives DHCP's speed; RFC 2131 even asks a client to wait one to ten seconds before its first Discover. (Correction 3.)
4. **The Learn list of messages no longer reads as complete.** "Discover, Offer, Request, Ack, plus NAK, Release" is now "plus others such as NAK and Release": the standard has eight messages (DECLINE and INFORM too). (Correction 2.)
5. **No message size is shown.** The log's Size column was 342 B and 350 B. No source states a DHCP message's size, so all six are now a dash. (Removal 3.)
6. **The pointer to the Networking Concepts lesson is out of Learn's Go deeper.** Learn parts carry citations and a pointer to another lesson has none. It stays, word for word, as the last sentence of the Overview hook. (Removal 2.)

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Learn pattern note | DORA: every device that joins a network goes this way. A renewal is just the last two again. | DORA: a device getting a new address goes this way. A renewal is just the last two again. | RFC 2131 §3.2 and §4.4.2 (a client that remembers its address broadcasts a Request and skips Discover and Offer); Microsoft, "DHCP Basics", DHCPACK. "Every device" ruled out a common case the lesson teaches in step 1. |
| 2 | Learn fact Messages | Discover, Offer, Request, Ack, plus NAK, Release | Discover, Offer, Request, Ack, plus others such as NAK and Release | RFC 2131 §3.1 (Table 2 lists eight messages); RFC 2132 §9.6; IANA DHCP parameters, "DHCP Message Type 53 Values". The list read as complete. |
| 3 | Learn why, second sentence | DHCP does it in a second, and takes addresses back from devices that leave. | DHCP does it automatically, and takes addresses back from devices that leave. | RFC 2131 §1.6 ("avoid hand configuration"), §1, §2.2; Microsoft, "What is DHCP Server", Why use DHCP?. No source gives a speed (RFC 2131 §4.4.1 asks a client to wait a random one to ten seconds). |
| 4 | OSI badge | Layer 7 | Spans layers (no single layer) | No allowed source places DHCP at an OSI layer; the content model's rule for that case is a badge that spans. The Overview fact is removal 1. |

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Overview fact OSI layer | "7, application" | The badge no longer claims a layer (correction 4). The Overview keeps its other five facts. |
| 2 | Learn Go deeper, last sentence | "Networking Concepts has a DHCP lesson that goes further." | Learn parts carry citations, and a pointer to another lesson has no source. The same sentence stays at the end of the Overview hook and the lesson summary. |
| 3 | The log's Size column, six messages (DISCOVER, OFFER, REQUEST and ACK in the four steps; REQUEST and ACK of the renewal) | 342 B (DISCOVER, OFFER, ACK, renewal ACK) and 350 B (REQUEST, renewal REQUEST); now shown as — | A size reads as a claim about the protocol and no source states one. The times, addresses and ports stay as example data. |

## Added

New statements, terms, facts or sentences, with why each was needed. The new Learn parts are the ones the Watch steps and the Overview trace to; the old Learn did not state these ideas.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn term IP address | The laptop’s own number on the network, so messages can find it | Step 1 names the **IP address** (RFC 791 §2.3; RFC 2131 §1.5). |
| 2 | Learn term Lease renewal | Asking to keep the address, before the lease runs out | Step 6 names **lease renewal** (RFC 2131 §2.2, §4.4.5). |
| 3 | Learn fact In a home | the Wi-Fi router is the DHCP server, with a pool of addresses to lend | "In a home, the server is the router" and the router labels trace to it (Microsoft Support, "Essential Network Settings", Change TCP/IP Settings; Google Nest, "Set a custom LAN IP"). |
| 4 | Learn fact Before it has an address | a client has no address to talk from and doesn’t know the server, so it calls out from 0.0.0.0 to 255.255.255.255, everyone on its network | Step 1, the Discover and Request, and the "no address yet" labels trace to it (RFC 2131 §4.1, §4.4.1, §4.4.4; RFC 1122 §3.2.1.3). |
| 5 | Learn fact Hands out | what a new device needs and doesn’t have yet: an IP address, the subnet mask, the router and the DNS server, with a lease time | The settings table, the Offer and "Needs" trace to it (RFC 2131 §3.1, §4.3.1, §1.6; RFC 2132 §3.3, §3.5, §3.8, §9.2). |
| 6 | Learn fact The Discover carries | the laptop’s MAC address, so the server can tell clients apart | Step 2 and the DISCOVER row trace to it (RFC 2131 §4.4.1, §4.2; Microsoft, "DHCP Basics", DHCPDISCOVER). |
| 7 | Learn fact Replies | from port 67 to port 68, sent straight to the laptop at the offered address, or broadcast | The OFFER and ACK rows trace to it (RFC 2131 §4.1; IANA port registry; Microsoft, "Troubleshooting guide for DHCP", More information). |
| 8 | Learn fact An Offer | isn’t final; the server holds the address while the client decides | Step 3 traces to it (RFC 2131 §4.3.2, §4.3.1; Microsoft, "DHCP Basics", DHCPREQUEST). |
| 9 | Learn fact The Request | is broadcast from 0.0.0.0 and names the chosen server (option 54) and the address (option 50); other servers take back their offers | Step 4 traces to it (RFC 2131 §3.1, §4.3.2, §4.1; RFC 2132 §9.7, §9.1; IANA DHCP parameters, options). |
| 10 | Learn fact After the ACK | the client uses the address and settings; not before | Step 5, the "Connected" cue and the address cue trace to it (RFC 2131 §3.1, §4.4.1; Microsoft, "DHCP Basics", DHCPREQUEST). |
| 11 | Learn fact Same address | a client that keeps renewing keeps the same address | Step 6's "its address doesn’t change" traces to it (RFC 2131 §2.2; Microsoft Learn, "Use DHCP to simplify IP configuration", DHCP lease renewal). |
| 12 | Learn, Sources list | 25 sources instead of one | Every cited claim lists its source at the foot of Learn. |

## Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Learn fact Renewal | at 50% of the lease, then 87.5% | at 50% of the lease, a Request straight to the server, whose ACK starts the lease again; with no answer, a broadcast to any server at 87.5% |
| 2 | Learn fact Defined in | RFC 2131 | RFC 2131, Dynamic Host Configuration Protocol |

## Unchanged

Word for word as the original: the title ("DHCP"), the full name, the purpose ("Getting an address"), the level and group; the scene's title, labels (Joining the Wi-Fi, no address yet, No network, 192.168.1.1 hands out addresses), table (title, columns, empty text, every cell), legend and two parties; the Overview hook and lesson summary (including the last sentence, "Networking Concepts has a DHCP lesson that goes further."), the hotel description (an analogy), and Overview facts Used for, Ports, Messages, Also hands out and This example; all six step titles, subtitles and narratives, in the same order; every step fact and every Go deeper sentence in steps 1 to 6 (now one paragraph per sentence group, each with its citations); all six messages, in the same order, with their tags, addresses, ports, times, summaries, info lines, statuses, cues and table rows (apart from the sizes above); Learn's lead, its eight terms, the pattern's four names, the first why sentence, the Go deeper sentences on pools and scopes, relays, snooping and IPv6, and Learn facts Ports, No server? and Defined in (apart from the added name); both Practice prompts, their ids, the three options and feedback of each, and the right answers (the first, then the second).

## What the checker passed as a simplification

The checker passed these under the owner's rule: each is true in the ordinary case, and its report's notes say what it leaves out or loosens. They stay as written. The first three are the ones to read.

1. **"If nobody answers at all, it gives itself a link-local address in 169.254.0.0/16."** RFC 3927 says a host *may* do this. Windows and macOS do it by default, but not every system does. The Learn fact "No server?: 169.254.x.x, neighbours only" is the same case.
2. **"Renews at half the lease" and "7/8 of the lease".** 50% and 87.5% are the defaults (RFC 2131 §4.4.5: T1 and T2 "are configurable by the server through options"). A server can set other values. Learn's Renewal fact has the same defaults.
3. **The router "holds the address for a moment" after an Offer.** Holding is a SHOULD in RFC 2131 §4.3.1, not a MUST. The lesson gives the ordinary case.
4. **The OSI badge** spans layers because no source puts DHCP at one; the checker looked through every cited vendor page and found none that does.
5. **Who answers a broadcast.** "Only a DHCP server will answer" follows from the terms server and offer; a relay agent passes the message on but does not answer. The same note says the sentence assumes the home case, where there is no relay.
6. **The client's source port 68.** No source states it in so many words; the IANA registry's client port (bootpc 68) and Microsoft's "UDP ports 67 and 68" together support it. A client may also send a separate client identifier; the MAC address is still carried.
7. **The Offer carries a mask, router and DNS server** when the server is set up to send them, which a home router is. Delivery through a relay is left out of the note on how an Offer is sent.
8. **The Request and a leaving device.** "A device leaving politely sends a DHCPRELEASE": a client that keeps its address for later reuse need not release it at shutdown, which "politely" leaves room for. Practice's "only ... if it leaves" leaves out DHCPDECLINE, which does not happen at renewal.
9. **"Takes addresses back from devices that leave"** applies to dynamic allocation, the ordinary case on a home network. "Without DHCP, someone would have to type..." is about IPv4 networks like a home's; other ways to get an address (link-local, IPv6 SLAAC) are left out.
10. **"(a scope)".** "Scope" is Microsoft's and Cisco's word; RFC 2131 says pool. Cisco's use is a comment in a sample configuration, and Microsoft's quickstart defines its own term.
11. **"DORA".** RFC 2131 does not use the name. Microsoft's troubleshooting page and Canonical's blog (a community source) both state it.
12. **A relay on each router.** A relay can also be a host rather than the router; the lesson gives the ordinary case.
13. **DHCP snooping.** It blocks rogue servers only on ports not marked as trusted, a setup detail the lesson leaves out. It rests on two RFCs, neither marked as the defining standard.
14. **IPv6 "or" SLAAC** leaves out using both together (RFC 9915, now the current DHCPv6 standard, obsoletes RFC 8415).
15. **"Everyone on the network"** is the beginner's word for every host on the local network (RFC 1122 §3.2.1.3). "Number" for an IP address is the everyday word for the 32-bit address.
16. **The hook's last sentence** is a pointer to another lesson on this site, not a claim about DHCP, so nothing traces it.
17. **Example data:** the addresses (RFC 1918 and RFC 5737), the MAC address (the 00:00:5E:00:53:xx documentation range), the 24-hour lease, the 12 hours and the times in the log are example values. The hotel analogy cites nothing.

## Counts

The counts at the top were made by a script that counts the numbered rows in each section above (4 corrections, 3 removals, 12 additions, 2 rewordings), and the sources by the lesson's cited list on the claim sheet (25) against the one reference of the original. The sentence-level differences were found by comparing every string of the old file with every string of the new one.
