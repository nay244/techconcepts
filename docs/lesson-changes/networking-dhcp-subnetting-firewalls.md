# Networking Concepts, DHCP, Subnetting and Firewalls: every changed sentence

The three Networking Concepts lessons that were still in the older shape moved to the cited shape on 2026-11-12, as batch 5 (job 8): DHCP, Subnetting and Firewalls. Moving a lesson means tying each claim to the source section that states it and changing any sentence a source does not support. Each lesson then passed a fact-check by a fresh checker under the owner's rule of 2026-11-11: a sentence that is true for a beginner in the ordinary case stays as written. With these three, every lesson on the site is cited and checked, and the legacy list is empty.

This is the one report for the three (direction 2.29). Each lesson's author wrote its section below right after its lesson passed; a script then looked for every quoted "before" in the lesson's file as it was (commit `e8ea005`) and every "after" in the file as it passed (on `revamp` at `e0105af`). All were found but four cells, each read by hand: DHCP's removal 6 describes what went (the packets) rather than quoting it; Subnetting's correction 3 and addition 6 are values the lesson builds in code from its numbers; Firewalls' correction 3 is two sentences that now sit in two Go deeper parts.

## The three at a glance

| Lesson | Fact-check | Items | Sources (was) | Corrections | Removed | Added | Reworded |
|---|---|---|---|---|---|---|---|
| DHCP | all 92 on the first full check | 92 | 16 (2) | 8 | 6 | 11 | 2 |
| Subnetting | all 107 on the first full check | 107 | 17 (2) | 13 | 4 | 16 | 0 |
| Firewalls | 105 of 106, then the one re-checked | 106 | 30 (1) | 12 | 2 | 6 | 4 |

The counts are each author's, and they do not count alike. Most additions are new or widened Learn parts, added so that everything the Watch tab shows is stated by a Learn part: the Watch words were kept and Learn grew to carry them.

No check found a claim that was wrong. The one item held back, in Firewalls, was imprecise: "in real life the visit reaches it through NAT" rested on one publisher, and RFC 3022 §2.2 was added beside it, with no change of words.

## What a reader will notice

1. **No step, event, table, figure or question changed.** Each lesson keeps its story, its panels and its three questions.
2. **Pointers to lessons that do not exist yet are gone.** DHCP said "Lessons 10 and 11 cover ports and UDP", Subnetting named "the IP Address lesson" and "the Router lesson", and Firewalls named lessons 11, 12, 14 and 19; none of those is written. Firewalls keeps "(the Subnetting lesson covers the slash)" (direction 2.34).
3. **DHCP's message sizes are dashes,** as What is DHCP's are: no source states a DHCP message's size. Its badge spans layers, as What is DHCP's does. The packets behind the old sizes are gone; no reader ever saw them.
4. **Subnetting no longer says its four subnets need no new cables.** Microsoft and Cisco put one subnet on each link. Its "minus 2" rule now stops at a /30, since the lesson itself teaches the /31.
5. **Firewalls no longer says every computer would be open to the whole internet without a firewall,** which contradicted What is IP's NAT. Product names with one publisher (Cisco access lists, Linux iptables, Windows Defender Firewall) are gone, and "Default" became "Recommended default".
6. **The About page lists DHCP's new sources.** Its "Sources in the DHCP lesson" box read two RFCs from the old lesson; it now lists the cited lesson's sixteen, as the registry names them (direction 2.34).

## Sites added to the allowed list

`docs.cloud.google.com`, Google Cloud's own documentation: with Palo Alto's page, its Firewall Insights page is the second publisher that names a shadowed rule (direction 2.35).

## DHCP

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 16 sources (it listed two, RFC 2131 and RFC 2132, before) and passed its fact-check on 2026-11-12, all 92 items, on its first full check. The check ran under the owner’s rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`e8ea005:src/content/lessons/dhcp.ts`), it has 8 corrections, 6 removals, 11 additions and 2 rewordings. The six packets the old file carried (and `helpers/packets.ts`, which only it used) were removed, and the six log sizes became dashes, though no reader saw a packet. Every other sentence is word for word as before.

Source names are the ones the lesson’s Sources list shows. Section numbers are the RFC’s own; RFC 1122 and RFC 894 have none at that depth, so they are cited by the page or heading the passage sits in; a vendor page has none, so it is cited by its heading.

### The changes to look at first

1. **No message size is shown.** The log’s Size column read 342 B on every message. No source states a DHCP message’s size, so all six are now a dash, and the packets that held the numbers are gone. (Removals 5 and 6.)
2. **The badge spans.** “Layer: Application (7)” had no source, and no standard places DHCP at an OSI layer. (Removal 1.)
3. **“Windows gives itself 169.254.x.x (APIPA)” now says the device may give itself such an address, which only reaches its neighbours.** The standard says a host may; “Windows” and “APIPA” were one vendor’s words. (Correction 6.)
4. **The router is no longer called the DNS server.** Step 2 showed “Gateway and DNS: 192.168.1.1 (the router, for both)”; no source says a home router is the DNS server, so the fact is “Gateway: 192.168.1.1 (the router)”. (Corrections 3 and 4.)
5. **Step 4 no longer says the router writes the lease table “Then”.** The standard has the server record the lease and send the ACK together. It now says “It also writes it down”. (Correction 5.)
6. **Two pointers to other lessons are cut,** “Lessons 10 and 11 cover ports and UDP.” and “(lessons 7 and 13)”. (Removals 2 and 3.)
7. **Two Practice feedbacks and the lease table’s empty text were corrected** for a claim no source supports, an absolute that ruled out the second renewal ask, and a story detail that was false. (Corrections 1, 7 and 8.)
8. **Ten new Learn parts** state the home router, what is handed out, the MAC address, the replies, the Request, what follows the ACK, who answers, the hardware broadcast, the full name and the IP address, so each Watch item has a Learn part to trace to. (Additions 1 and 3 to 11.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | The lease table’s empty text (the panel before the first lease) | “Empty. No device has an address yet.” | “Empty. No leases yet.” | The phone is on the Wi-Fi in this story, so it has an address; what is empty is the router’s list. RFC 2131 §1.5 (a binding is kept by the server). |
| 2 | Step 1 fact, label | “Ethernet destination” | “MAC destination” | The laptop is on Wi-Fi, so “Ethernet” named the wrong network. The value stays. RFC 2131 §4.4.1 (the local hardware broadcast address); RFC 894, Address Mappings (the all-ones hardware address). |
| 3 | Step 2 fact, label | “Gateway and DNS” | “Gateway” | No source says a home router is also the DNS server. RFC 2132 §3.5; Cisco, DHCPOFFER. |
| 4 | Step 2 fact, value | “192.168.1.1 (the router, for both)” | “192.168.1.1 (the router)” | Same reason as row 3. The step keeps its four facts. |
| 5 | Step 4 narrative | “Then it writes it down in its lease table, a list of which device has which address.” | “It also writes it down in its lease table, a list of which device has which address.” | RFC 2131 §3.1 has the server commit the binding and respond with the ACK; Cisco, DHCPACK says “Meanwhile”. “Then” stated an order the RFC does not. |
| 6 | Learn fact “No server answers”, value | “Windows gives itself 169.254.x.x (APIPA)” | “the device may give itself a 169.254.x.x address, which only reaches its neighbours” | RFC 3927 Abstract and §1. “Windows” and “APIPA” rest on Microsoft alone, and RFC 3927 says a host may do it. |
| 7 | Practice “How does the router make sure…”, option 1’s feedback | “Not quite. Two devices with the same address would get each other’s messages. The router keeps a list and only offers addresses that are free.” | “Not quite. Two devices with the same address couldn’t both work properly. The router keeps a list and only offers addresses that are free.” | RFC 5227 §2.4. No source says the two would get each other’s messages. |
| 8 | Practice “When does it first ask to keep it?”, option 3’s feedback | “Not quite. That would be a lot of asking. It asks once, halfway through the 24 hours.” | “Not quite. That would be a lot of asking. It first asks halfway through the 24 hours.” | RFC 2131 §4.4.5. “Once” ruled out the second ask at 87.5% that the lesson teaches. |

### Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Overview fact “Layer” | “Application (7)” | No two vendors, and no standard, place DHCP at an OSI layer, so the badge now spans and the fact is gone, as in What is DHCP. |
| 2 | Step 1 Go deeper | “Lessons 10 and 11 cover ports and UDP.” | Those lessons do not exist in this track, and a cited lesson may not point at a lesson by number. |
| 3 | Step 2 Go deeper (the sentence is otherwise kept) | “Along with the address, the Offer carries a subnet mask, a default gateway and a DNS server (lessons 7 and 13).” | The pointer is cut, for the same reason as row 2. The sentence now ends after “a DNS server.” |
| 4 | Step 4 Go deeper | “The lease table usually sits behind your router’s “connected devices” page.” | No two sources state it; one publisher shows connected devices and does not call the list a lease table. |
| 5 | The log, every message’s Size | “size: formatBytes(packets[packet].size)” | No source states the size of a DHCP message or of its frame, and a number in the log reads as a fact about the protocol. All six sizes (the Discover, Offer, Request, ACK and the renewal’s two messages) are now a dash. Each read 342 B (the old file computed it from the packet). |
| 6 | The scene’s packets (no reader saw them) | `packets,` and each event’s `packet:`, six frames with about thirty explained fields each, and `helpers/packets.ts` with its test | A dash cannot stand beside a packet’s size, nothing in the site shows a packet, and a cited lesson would have had to source every one of the fields. The three sentences among them that no source supports (the 300-byte padding, “at home it is often the router itself”, the broadcast flag’s reason) went with them. |

### Added

New in the lesson, or widened, and not a change to a sentence the original had.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Learn term (new, last) | — | “The laptop’s own number on the network, so messages can find it” | RFC 791 §2.3; RFC 2131 §1.5. Name: IP address. Backs the Overview’s “needs an address so messages can find it”. |
| 2 | Learn Go deeper (widened) | “The client renews at half the lease, often called T1.” | “The client renews at half the lease, often called T1, with a Request sent straight to its server; the server’s ACK starts the lease again.” | RFC 2131 §4.4.5; Microsoft Learn, DHCP lease renewal; Cisco, Renew the Lease. Step 5’s “asks the router directly” and “the clock starts again” needed it. |
| 3 | Learn fact “In a home” (new, at the end) | — | “the Wi-Fi router is the DHCP server, with a pool of addresses to lend” | Microsoft Support, Change TCP/IP Settings; Google Nest Help, Set a custom LAN IP. Gives the Watch items that show it a Learn part to trace to. |
| 4 | Learn fact “Hands out” (new, at the end) | — | “an IP address, the subnet mask, the default gateway (the router) and the DNS server, with a lease time” | RFC 2131 §3.1; RFC 2132 §3.3, §3.5, §3.8, §9.2; Cisco, DHCPOFFER. Gives the Watch items that show it a Learn part to trace to. |
| 5 | Learn fact “MAC address” (new, at the end) | — | “every message names the laptop’s hardware address, so the server can tell clients apart and the laptop knows a reply is for it” | RFC 2131 §2, §3.1, §4.4.1; Microsoft, DHCPDISCOVER; Cisco, DHCPOFFER. Gives the Watch items that show it a Learn part to trace to. |
| 6 | Learn fact “Replies” (new, at the end) | — | “from port 67 to port 68, sent straight to the laptop at the offered address, or broadcast” | RFC 2131 §4.1; Microsoft, DHCP troubleshooting. Gives the Watch items that show it a Learn part to trace to. |
| 7 | Learn fact “The Request” (new, at the end) | — | “is broadcast from 0.0.0.0 and names the chosen server (option 54, server identifier) and the address (option 50); other servers take back their offers” | RFC 2131 §3.1, §4.1; RFC 2132 §9.1, §9.7; Microsoft, DHCPREQUEST. Gives the Watch items that show it a Learn part to trace to. |
| 8 | Learn fact “After the ACK” (new, at the end) | — | “the client uses the address and settings; not before” | RFC 2131 §3.1; Microsoft, DHCPREQUEST. Gives the Watch items that show it a Learn part to trace to. |
| 9 | Learn fact “Who answers” (new, at the end) | — | “only a DHCP server; the other devices that hear a broadcast, like the phone, ignore it” | RFC 2131 §1; RFC 1122 §3.2.1.3; Canonical, The network version of DORA. Gives the Watch items that show it a Learn part to trace to. |
| 10 | Learn fact “On the link” (new, at the end) | — | “the broadcast goes to the hardware address ff:ff:ff:ff:ff:ff, which means everyone” | RFC 2131 §4.4.1; RFC 894, Address Mappings. Gives the Watch items that show it a Learn part to trace to. |
| 11 | Learn fact “Stands for” (new, at the end) | — | “Dynamic Host Configuration Protocol, the way a device gets its address and other settings” | RFC 2131 Abstract, §1, §1.5. Gives the Watch items that show it a Learn part to trace to. |

### Reworded, same meaning

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Learn term, name | “Acknowledge” | “Acknowledge (ACK)” | RFC 2131 §3.1 (DHCPACK). The log’s tag “ACK” needed a Learn part that names it. |
| 2 | Learn pattern, note | “Remember the first four in order: Discover, Offer, Request, Acknowledge.” | “DORA: remember the first four in order: Discover, Offer, Request, Acknowledge.” | Microsoft, DHCP troubleshooting, More information; Canonical, The network version of DORA. Step 4 names DORA, so a Learn part must. |

### What the checker passed as a simplification

Every `Note:` line of the passing report (`docs/fact-checks/dhcp.md`) on an item it passed, with the item. All 92 items passed.

1. `units[0].osi`: the badge says DHCP spans layers, and it cites nothing. I looked for a single-layer placement in every source fetched for this check. None of them places DHCP at one OSI layer. RFC 1122 §1.1.3 lists BOOTP, DHCP's predecessor, among the support protocols of the Internet model's application layer. That is a different protocol and a different layer model, not an OSI placement of DHCP. Cisco's page mentions Layer 3 only to describe a broadcast domain. The lesson itself shows DHCP using link-layer broadcast, IP addresses and UDP ports, so a beginner is not misled by "spans".
2. `units[0].steps[0].deep[0] (step "discover", Go deeper)`: RFC 2131 is the defining standard for DHCP's message exchange, its ports and its addressing. It gives the broadcast address in hex (all ones, which is 255.255.255.255) and the source as zero (0.0.0.0). RFC 1122's all-zero address for this host is the same 0.0.0.0, which the lesson glosses in plain words as having no address yet.
3. `units[0].steps[0].deep[0] (step "discover", Go deeper)`: RFC 2131 (Draft Standard) is not obsoleted. RFC 3396, 4361, 5494 and 6842 update it, and none of them changes the ports or the broadcast addressing. RFC 1122 (STD 3) is not obsoleted, and none of its updates touches the special addresses.
4. `units[0].steps[1].deep[0] (step "offer", Go deeper)`: RFC 2131 defines the Offer and its chaddr field. RFC 2132 defines the subnet mask, router (default gateway) and DNS server options.
5. `units[0].steps[1].deep[0] (step "offer", Go deeper)`: Cisco states the purpose from the laptop's side (the hardware address shows it that the Offer is meant for it). The lesson states the same fact from the phone's side. The DNS server is a common option, not a required one, and that is the ordinary home case.
6. `units[0].steps[1].deep[0] (step "offer", Go deeper)`: RFC 2132 (Draft Standard) is not obsoleted. Its updates (RFC 3442, 3942, 4361, 4833, 5494) add or reclassify options and leave these three unchanged. The Cisco page is live and was recertified in September 2023.
7. `units[0].steps[2].deep[0] (step "request", Go deeper)`: RFC 2131 defines the Request and its source address. RFC 2132 §9.7 defines the server identifier option. Microsoft's page states both the reason for 0.0.0.0 and that the other servers free their offers. The lesson calls the server identifier a field, which is an everyday word for what the RFC calls an option.
8. `units[0].steps[2].deep[0] (step "request", Go deeper)`: Microsoft's page is an old knowledge-base article whose product list is legacy Windows. Its packet-level account of the exchange still describes how DHCP works today.
9. `units[0].steps[3].deep[0] (step "acknowledge", Go deeper)`: RFC 2131 defines the DHCP message types, this one among them. It names the message DHCPACK, and the lesson shortens that to ACK.
10. `units[0].steps[4].deep[0] (step "renew", Go deeper)`: RFC 2131 defines the client's lease timers and states. Half and 87.5% are the defaults, which a server may change; the lesson gives the default, the ordinary case. 43,200 seconds is half of the example's 86,400-second lease.
11. `units[0].steps[4].deep[0] (step "renew", Go deeper)`: the ipconfig page is live and applies to Windows 10, Windows 11 and current Windows Server.
12. `units[0].learn.lead[0] ("lead-1")`: RFC 2131 defines the four-message exchange (Discover, Offer, Request, ACK) and the lease. The two vendors' pages show the home router doing the job. The 24 hours is the lesson's example lease. "Borrowed" is the everyday word for a lease.
13. `units[0].learn.terms[0] ("term-broadcast")`: RFC 1122 defines the limited broadcast address and who receives it. RFC 2131 defines when a DHCP client broadcasts.
14. `units[0].learn.terms[0] ("term-broadcast")`: the reason the lesson gives (not knowing whom to ask) is the Discover's. The Request is broadcast for another reason, and the lesson teaches that reason in its own terms and step. The definition does not say this is the only reason to broadcast.
15. `units[0].learn.terms[1] ("term-discover")`: RFC 2131 defines the DHCP message types. The lesson puts the Discover's purpose in a beginner's words: ask whoever hands out addresses to answer.
16. `units[0].learn.terms[2] ("term-offer")`: RFC 2131 defines the Offer, and RFC 2132 §9.2 defines its lease-time option. "The router" stands in for the DHCP server, which is the router in a home, as the two vendor pages show.
17. `units[0].learn.terms[3] ("term-request")`: RFC 2131 defines the Request, and RFC 2132 §9.7 defines the server identifier that says which offer was accepted. "Every router" stands in for every DHCP server that heard the Discover, and in a home that is the router. The definition gives the Request's first-time use. The lesson teaches its renewal use, sent directly to the server, in the renew step and Go deeper.
18. `units[0].learn.terms[4] ("term-ack")`: RFC 2131 defines the DHCPACK message, which confirms the address. "Acknowledge" is the spelled-out name used in the DORA mnemonic.
19. `units[0].learn.terms[5] ("term-lease-table")`: RFC 2131 defines the server's bindings and their storage. The sources call it the server's database or persistent storage. "Lease table" is a plain descriptive name for that record, not the standard's term, and it leaves no false belief.
20. `units[0].learn.terms[6] ("term-lease")`: RFC 2131 defines the lease. The RFC's term names the period itself, and the lesson describes the borrowing, which is a looser wording of the same idea. Infinite leases are a rarer case the lesson leaves out.
21. `units[0].learn.terms[7] ("term-renew")`: RFC 2131 defines renewal and the T1 timer. Halfway is the default, the ordinary case.
22. `units[0].learn.terms[8] ("term-ip")`: RFC 791 defines the IPv4 address. "Number" is an everyday word for the 32-bit address, and "so messages can find it" restates that datagrams are delivered by address.
23. `units[0].learn.terms[8] ("term-ip")`: RFC 791 (STD 5) is not obsoleted. RFC 1349, 2474 and 6864 update it, and none of them changes what an address is.
24. `units[0].learn.pattern ("pattern")`: RFC 2131 defines the four messages and their order (its timeline in §3.1). Microsoft and Canonical, two independent publishers, each use the DORA name for that order.
25. `units[0].learn.why[0] ("why-1")`: RFC 2131 states DHCP's design goals, and RFC 5227 defines IPv4 address conflict detection and describes the duplicate-address problem. The claim leaves out other ways a device can configure itself, such as the 169.254 link-local fallback (which the lesson teaches as reaching neighbours only), and IPv6 autoconfiguration.
26. `units[0].learn.why[0] ("why-1")`: RFC 5227 (Proposed Standard) is not obsoleted.
27. `units[0].learn.why[1] ("why-2")`: RFC 2131 states the guarantee itself. "Never" holds among devices that get their address from DHCP, the ordinary case. It leaves out a clash with a device whose address was typed in by hand, which DHCP's own address checks exist to catch.
28. `units[0].learn.deep[0] ("deep-1", Learn's Go deeper)`: RFC 2131 defines DHCP's transport.
29. `units[0].learn.deep[1] ("deep-2", Learn's Go deeper)`: RFC 2131 defines the client's source and destination addresses before it has one (0 and all ones, which are 0.0.0.0 and 255.255.255.255). RFC 1122 says who receives the limited broadcast. The claim leaves out the rarer case of a client that already knows its server's address and may send to it directly.
30. `units[0].learn.deep[2] ("deep-3", Learn's Go deeper)`: RFC 2131 defines T1, the unicast renewal Request and how the ACK restarts the lease. Half is T1's default.
31. `units[0].learn.deep[2] ("deep-3", Learn's Go deeper)`: the Microsoft Learn training module is live and describes current Windows Server DHCP.
32. `units[0].learn.deep[3] ("deep-4", Learn's Go deeper)`: RFC 2131 defines T2 and its default. 87.5% is the default, the ordinary case.
33. `units[0].learn.facts[0] ("fact-ports")`: RFC 2131 defines the two ports.
34. `units[0].learn.facts[1] ("fact-first")`: RFC 2131 defines the first messages' addresses. In RFC 1122's notation the all-ones address is the limited broadcast 255.255.255.255, and the all-zeros address is 0.0.0.0.
35. `units[0].learn.facts[2] ("fact-t1")`: RFC 2131 defines T1 and its default, and RFC 2132 §9.11 defines the option a server can use to set it otherwise. 50% is the default, the ordinary case.
36. `units[0].learn.facts[3] ("fact-t2")`: RFC 2131 defines T2 and its default, and RFC 2132 §9.12 defines its option. 87.5% is the default.
37. `units[0].learn.facts[4] ("fact-no-server")`: RFC 3927 defines IPv4 link-local addresses. "Neighbours" is a beginner's word for devices on the same link, and "may" keeps it optional, as it is.
38. `units[0].learn.facts[4] ("fact-no-server")`: RFC 3927 (Proposed Standard) is not obsoleted.
39. `units[0].learn.facts[5] ("fact-defined")`: RFC 2131 defines the DHCP protocol and RFC 2132 defines its options. Both are current, not obsoleted, and updated only by later RFCs that leave them the base documents.
40. `units[0].learn.facts[6] ("fact-home")`: these are two independent vendors (Microsoft and Google). One says the home router sets a device's addresses automatically, and the other shows a home router's DHCP address pool. That is the ordinary home setup. Some homes use another device as the DHCP server, a case the lesson leaves out.
41. `units[0].learn.facts[7] ("fact-settings")`: RFC 2131 defines the address field, and RFC 2132 defines the subnet mask, router, DNS server and lease time options. The list gives the common set, and a server may send more or fewer.
42. `units[0].learn.facts[8] ("fact-mac")`: RFC 2131 defines the chaddr field, which holds the client's hardware address, and its use in telling clients apart. A separate client identifier option can also identify a client, a detail the lesson leaves out.
43. `units[0].learn.facts[9] ("fact-replies")`: RFC 2131 defines how a server addresses its replies. The claim leaves out replies through a relay agent, which is not the home case.
44. `units[0].learn.facts[10] ("fact-request")`: RFC 2131 defines the Request's contents and source address, and RFC 2132 defines options 54 (server identifier) and 50 (requested IP address).
45. `units[0].learn.facts[11] ("fact-ack")`: RFC 2131 defines when the client is configured. It leaves out the client's optional final check that the address is free (an ARP probe), done just after the ACK.
46. `units[0].learn.facts[12] ("fact-ignore")`: RFC 2131 defines which hosts act as DHCP servers, and RFC 1122 says every host on the link receives a limited broadcast. The claim leaves out relay agents, which pass DHCP messages on in larger networks rather than answering in a home.
47. `units[0].learn.facts[13] ("fact-link")`: RFC 2131 defines that the Discover goes to the link's hardware broadcast address. RFC 894 (STD 41, Internet Standard, not obsoleted) defines how the IP broadcast maps to the all-ones Ethernet address. The claim does not name a link type. Wi-Fi uses the same all-ones broadcast hardware address, so the claim is true for the lesson's Wi-Fi scene too.
48. `units[0].learn.facts[14] ("fact-name")`: RFC 2131 defines DHCP, its name and its purpose.
49. `units[0].practice[0].options[0] (question "why-shout")`: RFC 2131 defines why and when the client broadcasts. The option is the right answer and its feedback says so. "The only way" holds for a client that does not know its server's address, which is the case the question sets up.
50. `units[0].practice[0].options[1] (question "why-shout")`: RFC 2131 defines the broadcast's purpose, which is to find a server, not speed. The option is wrong and its feedback correctly says so.
51. `units[0].practice[0].options[2] (question "why-shout")`: RFC 2131 defines who answers as a DHCP server. The option is wrong and its feedback correctly says so.
52. `units[0].practice[1].options[0] (question "no-repeats")`: RFC 5227 defines how a shared address is detected as a conflict that hosts must resolve, which is why two devices could not both work properly. RFC 2131 defines that a server offers an available address from the bindings it manages. The option is wrong and its feedback correctly says so.
53. `units[0].practice[1].options[1] (question "no-repeats")`: RFC 2131 defines the server's record of bindings and its offer of an available address. "Loan" and "lease table" are everyday words for the lease and that record. The option is the right answer and its feedback says so.
54. `units[0].practice[1].options[2] (question "no-repeats")`: RFC 2131 defines the server as the one that manages the bindings. The option is wrong and its feedback correctly says so. The server may test an address before offering it (RFC 2131 §3.1), but that is not asking a device for a list of taken addresses, so the feedback still holds.
55. `units[0].practice[2].options[0] (question "when-renew")`: RFC 2131 defines T1, its default and its place before T2 and the lease's end. The feedback's "plenty of time" is a plain reading of that ordering, which leaves room to retry and to rebind before the lease runs out. Twelve hours is half of the question's 24. The option is the right answer and its feedback says so.
56. `units[0].practice[2].options[1] (question "when-renew")`: RFC 2131 defines what happens when a lease runs out, which is the reason the feedback gives. The option is wrong and its feedback correctly says so.
57. `units[0].practice[2].options[2] (question "when-renew")`: RFC 2131 defines when renewal happens. The option is wrong and its feedback correctly says so. A client may also renew early, for example at startup or on a network change, which the feedback's "first asks halfway" leaves out for this scenario.

### Counts

8 corrections, 6 removals (the six sizes are one row), 11 additions and 2 rewordings, counted from the numbered rows of the tables above. The sources are the claim sheet’s list (16) against the two references of the original. The lesson passed all 92 items; 57 notes are listed above.

## Subnetting

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 17 sources (it listed two, RFC 950 and RFC 4632, before) and passed its fact-check on 2026-11-12, all 107 items, on its first full check (commit 54bff5f). The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`e8ea005:src/content/lessons/subnetting.ts`), it has 13 corrections, 4 removals and 16 additions; no sentence was reworded with the same meaning. Everything else is word for word as before, including every Watch step, event, table row and the three Practice questions. Source names are the ones the lesson's Sources list shows.

### The changes to look at first

1. **“Without a single new cable” and “using nothing but the addresses” are gone.** Microsoft and Cisco put each subnet on a link of its own, and addresses alone do not keep two teams apart on one cable. The Overview now ends “one for each team”. (Corrections 1 and 8, Removal 1.)
2. **The formula “2 to the power of the host bits, minus 2” now stops at a /30.** A /31, which the lesson teaches in step 6, has no network or broadcast address, so the old wording ruled out something the lesson itself shows. The Overview fact, step 3 and the pattern note carry the limit. (Corrections 3, 4 and 10.)
3. **A /30 “wastes no addresses” became “very few”.** A /30 spends two of its four addresses on the network and broadcast addresses; RFC 3021 §1 says so. (Corrections 6 and 13.)
4. **“DHCP and ARP find each other” was the wrong picture.** A DHCP client broadcasts to find a server, and ARP broadcasts to find a neighbour's hardware address. (Correction 5.)
5. **“Many networks now use a /31”, “a name for being hard” and “doesn't change its speed” had no source** and were reworded to what the sources state. The helpdesk sentence and the two pointers to lessons that do not exist yet are cut. (Corrections 2, 7 and 12, Removals 2 to 4.)
6. **The Learn section now states what the Watch steps use**: local delivery and the bitwise AND, the masks of each prefix, the 32-bit address, and what each borrowed bit does. (Additions.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Overview hook, third and fourth sentences | It doesn’t need new cables to do that. It cuts its one network into four smaller ones, using nothing but the addresses. | It cuts its one network into four smaller ones, one for each team. | Microsoft, Understand TCP/IP addressing and subnetting basics, Incorrect IP address (computers that should be on separate subnets must not share a local network); Cisco, Configure IP Addresses and Unique Subnets, Understand Subnetting (each data link has its own network ID). The addresses alone do not keep two teams on one link apart. The orchestrator's ruling 1 cut the cable sentence; RFC 1812 §2.2.5.1 says several subnets may share a cable, but then nothing keeps them apart. |
| 2 | Overview description, last sentence | Subnetting has a name for being hard, but it comes down to moving a line and counting. | Subnetting comes down to moving a line and counting. | No allowed page states a reputation. The second half is Microsoft Subnetting and Cisco Understand Subnetting. |
| 3 | Overview fact Usable addresses (the value is worked out in code) | 2 to the power of the host bits, minus 2 | 2 to the power of the host bits, minus 2, up to a /30 | Cisco, Understand Host and Subnet Quantities, Subnet Example (“An exception to this rule is 31-bit prefixes”); RFC 3021 §2.1. The lesson itself teaches a /31 in step 6, where the formula gives 0. |
| 4 | Step 3 Go deeper, first sentence | The number of usable addresses is 2 to the power of the host bits, minus 2. | Up to a /30, the number of usable addresses is 2 to the power of the host bits, minus 2. | Same as the row above. |
| 5 | Step 3 Go deeper, second sentence | A broadcast reaches every device on the network, which is how DHCP and ARP find each other before they know any addresses. | A broadcast reaches every device on the network, which is how DHCP finds a server and ARP finds a neighbour’s hardware address. | DHCP and ARP do not find each other. RFC 2131 §3.1 (the client broadcasts a DHCPDISCOVER to find a server); RFC 826, Packet Generation (ARP broadcasts to find a hardware address). |
| 6 | Step 6 narrative, last sentence | A tiny subnet like this, joining two routers, is a **point-to-point** link, and it wastes no addresses. | A tiny subnet like this, joining two routers, is a **point-to-point** link, and it wastes very few addresses. | RFC 3021 §1: a /30 link uses four addresses for two endpoints, the network and broadcast addresses being what a point-to-point link does not need. “Wastes no addresses” is false of a /30. |
| 7 | Step 6 Go deeper, second sentence | Many networks now use a /31 for links like this: RFC 3021 lets both of its 2 addresses be used, with no network or broadcast address. | Routers may instead use a /31 for links like this: RFC 3021 lets both of its 2 addresses be used, with no network or broadcast address. | RFC 3021 §2.1 and Cisco, 31-bit Subnets, state what a /31 may do; the only statement of practice (RFC 3021 §1, “in most cases” a /30) is dated, so “many networks now” has no source. |
| 8 | Learn lead, first sentence | One office, one block of 256 addresses, cut into four smaller networks without a single new cable. | One office, one block of 256 addresses, cut into four smaller networks, one for each team. | Same reason as the first row (ruling 1). |
| 9 | Learn term Point-to-point /30 (the idea) | A tiny subnet with exactly two addresses, one for each end of a link | A tiny subnet with exactly two usable addresses, one for each end of a link, such as between two routers | A /30 has four addresses, two of them usable (RFC 3021 §1; Cisco, 31-bit Subnets). The lesson says so in step 6 and Practice. |
| 10 | Learn pattern note, first sentence | Any address, any prefix: work these four out in this order. | Any address, any prefix up to /30: work these four out in this order. | A /31 has no network or broadcast address (RFC 3021 §2.1; Cisco Subnet Example). |
| 11 | Learn Go deeper, first sentence | Each prefix has a block size: 256 minus the mask’s last number below 255. | From /24 on, each prefix has a block size: 256 minus the mask’s last number below 255. | RFC 4632 §3.1 (block sizes). Below /24 the block is counted in an earlier number, and the next sentences (“last number”) would be wrong. |
| 12 | Practice, link question, first option's feedback | Not quite. The size of a subnet doesn’t change its speed. | Not quite. A subnet’s size only sets how many addresses it has. | No allowed source states anything about speed. RFC 4632 §3.1 states what a prefix length sets: the block's size. |
| 13 | Practice, link question, correct option's feedback | A link has two ends, so none go to waste. | A link has two ends, so neither usable address goes to waste. | RFC 3021 §1: the network and broadcast addresses of a /30 are the waste a /31 removes. |

### Removed

| # | Where | Before | Why |
|---|---|---|---|
| 1 | Overview hook | It doesn’t need new cables to do that. | Microsoft, Incorrect IP address; Cisco, Understand Subnetting: each subnet is a link of its own. Ruling 1. |
| 2 | Step 1 Go deeper, last sentence | The IP Address lesson covers turning numbers into bits and back. | Points to a lesson that does not exist yet (ruling 3). A replacement would rest on one vendor page. |
| 3 | Step 5 narrative, last sentence | When two devices can’t reach each other, this is one of the first things a helpdesk checks. | No allowed source says what a helpdesk checks first; Microsoft, Troubleshooting says only that problems are “often caused by incorrect configuration”. |
| 4 | Step 5 Go deeper, last sentence | The Router lesson covers what happens inside the router. | Points to a lesson that does not exist yet (ruling 3). |

### Added

Each addition gives a Watch step or a figure something to trace to, or states in Learn what a Watch step already said. The old `references` field (RFC 950, RFC 4632) is not a sentence: the citations now build the Sources list.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Learn lead, new second statement (`lead-2`) | (none) | Before it sends, a device lays its mask over its own address and the other one, a bitwise AND, and compares the network parts. If they match, the device finds the other’s hardware address with ARP and sends to it directly: that is local delivery. If not, it sends to its default gateway. | RFC 1122 §3.3.1.1 and §3.3.1.2; RFC 950 §2.2; RFC 826, Packet Generation; Microsoft, Default gateways. Step 5 states these ideas; a Watch step must trace to a Learn statement. |
| 2 | Learn term Network portion (the idea) | The part of an address that says which network | The part of an address that says which network, the same for every device on it | Microsoft, IP addresses, networks and hosts; Cisco, Background Information. Step 1 says it. |
| 3 | Learn term Host portion (the idea) | The part that says which device | The part that says which device, or host: any device with an address | Microsoft, Glossary (“Host”); Cisco, Background Information. Step 1 says it. |
| 4 | Learn term Subnet mask (the idea) | The card laid over the address: a 1 for each network bit | The card laid over the address: a 1 for each network bit and a 0 for each host bit | Cisco, Network Masks. Step 2 says “a 0 for every host bit”. |
| 5 | Learn fact /25 to /30 (six facts; each value gains its mask, shown for /26) | ${total(p)} addresses, ${usable(p)} usable | ${mask(p)}: ${total(p)} addresses, ${usable(p)} usable | Cisco, Class C Host/Subnet Table; RFC 4632 §3.1. Steps 4 and 6 show the masks 255.255.255.192 and 255.255.255.252 (ruling 4). |
| 6 | Learn fact, new: An address | (none) | 32 bits: four numbers of 8 bits, each 0 to 255 | RFC 791 §2.3; Cisco, Understand IP Addresses; Microsoft, Glossary (Octet). |
| 7 | Learn fact, new: Usable addresses | (none) | up to a /${LINK}: the network and broadcast addresses are kept back | Cisco, Subnet Example; RFC 1812 §4.2.2.11; RFC 4632 §2. |
| 8 | Learn fact, new: Each borrowed bit | (none) | doubles the subnets and halves their size | Cisco, Understand Subnetting and Subnet Example; Microsoft, Subnetting; RFC 4632 §3.1. |
| 9 | Learn fact, new: Example addresses | (none) | 192.168.x.x is private; 203.0.113.x is for documentation | RFC 1918 §3; RFC 5737 §3. |
| 10 | Learn fact, new: Written as | (none) | an address, a slash and the prefix length | RFC 4632 §3.1; Cisco, CIDR; Microsoft, Subnet mask. |
| 11 | Learn fact, new: OSI layer | (none) | 3, network: subnetting is part of how IP addresses work | Cloudflare, Network Layers and Microsoft, OSI model place IP at layer 3; RFC 1122 §3.2.1.3 and RFC 950 §2.1 make subnets part of IP's addressing. |

### Reworded, same meaning

None.

### What the checker passed as a simplification

Each is a `Note:` of the passing report (`docs/fact-checks/subnetting.md`) on an item it passed, saying what a true-for-a-beginner sentence leaves out.

| Item | Note |
|---|---|
| `units[0].steps[0].deep[0] (step "portions", Go deeper)` | RFC 791 is the defining standard for the IPv4 address format (its length and its four octets). Its class scheme in the same paragraph is legacy; RFC 4632 replaced it, which is what the claim about the mask reflects. |
| `units[0].steps[0].deep[0] (step "portions", Go deeper)` | 192 as 11000000 is shown by Microsoft's example (192.168.123.132 in binary begins 11000000); 10 as 00001010 is shown by Cisco's mask example (net id 00001010 = 10, under its Network Masks section, not quoted here because that section is not cited for this part). "Byte" is the everyday word for the sources' "octet". |
| `units[0].steps[1].deep[0] (step "subnet-mask", Go deeper)` | "Always" is looser than Microsoft's "almost all": RFC 950 once allowed masks whose ones were not contiguous, but RFC 1812 treats only contiguous masks as correct and assumes every mask is a prefix length, so the ordinary case is as the claim says. /8 = 255.0.0.0 follows from Cisco's binary form of 255.0.0.0 (8 ones) and its rule that the length counts the left-most ones. |
| `units[0].steps[2].deep[0] (step "network-broadcast", Go deeper)` | Passes as true for a beginner. It leaves out three things: DHCP sends to the all-ones limited broadcast and ARP uses a link-layer broadcast, neither of them the subnet's own broadcast address; a DHCP relay agent, often on the router, can carry a DHCP request to a server on another subnet as a new message (RFC 2131 mentions such relays in the same section); and a router can be set to forward directed broadcasts, which RFC 2644 makes off by default. In the ordinary case a broadcast stays on its own network, as the claim says. |
| `units[0].steps[3].deep[0] (step "borrowing-bits", Go deeper)` | 192 = 256 − 64 is arithmetic on the quoted values, and Microsoft's four network starts (0, 64, 128, 192) are the multiples of 64. Microsoft's ranges of valid hosts for those four networks begin at .1, .65, .129 and .193, so the router addresses given are valid ones. Picking the first usable address for the router is a common choice, not a rule, and the claim gives them as this example's ("here"). |
| `units[0].steps[4].deep[0] (step "local-remote", Go deeper)` | Passes as true for a beginner. It leaves out the ARP cache (a known hardware address is reused without asking) and links that do not use ARP. 192.168.1.1 is this lesson's example gateway (a private address). |
| `units[0].learn.lead[0] ("lead-1")` | "one for each team" is the lesson's scene. |
| `units[0].learn.lead[1] ("lead-2")` | Passes as true for a beginner. It leaves out the ARP cache, broadcast and multicast destinations (RFC 1122 handles them separately), and routes other than the default. |
| `units[0].learn.terms[1] ("term-host")` | Microsoft counts a router as a host, as the claim does; the RFCs use "host" more narrowly, which a beginner does not need here. |
| `units[0].learn.terms[4] ("term-netaddr")` | "The network's own name" is the lesson's everyday wording for the source's "network number itself". |
| `units[0].learn.terms[8] ("term-gateway")` | Passes as true for a beginner. It leaves out more specific routes (static routes, redirects) that can send some traffic to another router. |
| `units[0].learn.terms[9] ("term-p2p")` | /31 links (RFC 3021) are now common too; the lesson teaches them in its Go deeper, so presenting /30 as the point-to-point subnet is not a superseded practice. |
| `units[0].learn.why[0] ("why-1")` | Passes as true for a beginner. Every packet between subnets has to pass the router, and the router can filter (RFC 1812 §5.3.9); the claim puts the control there, which is right. It leaves out that a router passes traffic between its subnets unless it is set up to filter it, so separating the guests' subnet does not by itself block them. The lesson's own Practice feedback ("Keeping guests out is the router's job") points the same way. |
| `units[0].learn.facts[8] ("fact-usable")` | "Up to a /30" leaves out /31 (RFC 3021) and /32, as the Cisco exception does. |
| `units[0].practice[1].options[2] (question "via-router")` | RFC 1122 defines the local/remote decision. Passes as true for a beginner. RFC 919 also names a second use, telling many hosts something at once, which the feedback leaves out; neither use applies to a message for one known address. The option is rightly marked wrong. |
| `units[0].practice[2].options[0] (question "why-30")` | Passes as true for a beginner. No source ties prefix length to link speed. The "only" is about the address count: elsewhere the lesson teaches that splitting a network also keeps broadcasts apart, which is not about link speed. The option is rightly marked wrong. |

### Counts

13 corrections, 4 removals, 16 additions (1 new Learn statement, 3 widened terms, 6 widened prefix facts, 6 new Learn facts), 0 rewordings: 33 changed or added sentences. The rest of the lesson, including all six steps' narratives except the two edited, every event, table row and Practice question prompt, is word for word as before. The lesson passed all 107 items on its first full check.

## Firewalls

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 31 sources (it listed one, NIST SP 800-41 Rev. 1, before) and passed its fact-check on 2026-11-12, all 106 items, on a targeted re-check after a near-pass: the first full check (commit bd55164) passed 105 of 106 items and none was wrong. The one item was step 1’s Go deeper sentence “The web server’s address, 10.0.0.10, is private, so in real life the visit reaches it through NAT.” Its NAT half rested on one source (NIST SP 800-41r1 §3.2), so the fix kept the words and added RFC 3022 §2.2, the standard that defines NAT (commit 99d575b); the re-check (commit a22ceec) passed it. The check ran under the owner’s rule of 2026-11-11: a sentence that is true for a beginner stays word for word, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`e8ea005:src/content/lessons/firewalls.ts`), it has 12 corrections, 2 removals, 6 additions and 4 rewordings. Everything else is word for word as before, including every Watch step, event, table row, the scene and the three Practice questions’ answers. Source names are the ones the lesson’s Sources list shows.

### The changes to look at first

1. **The lesson no longer says every computer is open to the whole internet without a firewall.** A computer behind NAT cannot be reached from outside unless a port is forwarded, as What is IP teaches. It now says “a computer the internet can reach”. (Correction 9.)
2. **Question 2 now says the list is read from the top.** Windows Firewall lets a block rule, or a more specific rule, win, so two of the options’ feedback was false for it without those words. (Correction 12.)
3. **“Default” is now “Recommended default”, and “a door stays shut instead of open” lost its contrast.** Not every firewall denies by default (Windows allows outgoing traffic), and no Learn part states the allow-by-default list the contrast pictured. (Corrections 11 and 5.)
4. **Product names and tricks with one publisher are gone.** Cisco access lists, Linux iptables and “dropping tells an outsider less” (Corrections 1 and 2), Windows Defender Firewall (Correction 10), “passwords included” (Correction 4) and “often a wide-open one” (Correction 6) had no support from the allowed sources.
5. **The VPN sentence now says why a VPN, and no longer says “often”.** Admin logins from outside are “safer through a VPN”, which NIST SP 800-123 and Azure’s guidance state. (Correction 3.)
6. **“The rules here see it after that” is cut.** Cisco and Palo Alto disagree on whether a rule sees the address before or after NAT. (Removal 1.)
7. **Five pointers to numbered lessons are gone.** (Rewordings 1 to 4, Correction 3.)
8. **Learn gained three facts** the Watch steps trace to: the ports used, the remote-login protocols and where the catch-all goes. (Additions 4 to 6.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 2 Go deeper | Most firewalls, including Cisco access lists and Linux iptables chains, stop at the first rule that matches. | Most firewalls stop at the first rule that matches. | NIST SP 800-41r1 §5.2.2; Palo Alto firewall rules, Firewall Rules Order; Cisco ASA access rules, Rule Order; Cisco FMC access rules, Access control rule order; Azure NSG, Security rules. The named products each rest on one publisher (Cisco’s lists on Cisco alone; iptables on no allowed source). “Most” stays: NIST says “many”, Palo Alto “typically”. |
| 2 | Step 2 Go deeper | A blocked visit can be dropped without a word or refused with a reply; dropping tells an outsider less. | A blocked visit can be dropped without a word or refused with a reply. | Palo Alto security rules, Action; Cisco FMC access rules, Access control rule blocking actions. No current allowed source says dropping tells an outsider less. |
| 3 | Step 3 Go deeper | A rule that names an address only works while that address stays the same, so admin logins are often allowed from a VPN’s addresses instead (lesson 19). | A rule that names an address only works while that address stays the same. Admin logins from outside are safer through a VPN. | NIST SP 800-41r1 §2.1.1; Microsoft Windows Firewall overview; Azure network security best practices (addresses in rules may change; point-to-site VPN is more secure than direct SSH); NIST SP 800-123 §6.5. “Often” and the cause (“so”) had no source; the sources give security as the reason. |
| 4 | Step 4 narrative | The visitor tries port 23, an old way to log in that sends everything as plain text, passwords included. | The visitor tries port 23, an old way to log in that sends everything as plain text. | IANA Port Numbers; RFC 4251 §4.1; NISTIR 7966 §3; NIST SP 800-123 §6.5 and §4.2.1; Cloudflare SSH. Only a retired-product page names the password, as in What is SSH. |
| 5 | Step 4 narrative, last sentence | If someone forgets to write a rule, a door stays shut instead of open. | If someone forgets to write a rule, that door stays shut. | NIST SP 800-41r1 §4. “Instead of open” set the step against a list that allows by default, which no Learn part states. |
| 6 | Step 5 Go deeper | A packet filter without state judges each packet alone, so it would need a rule for the replies too, often a wide-open one. | A packet filter without state judges each packet alone, so it would need a rule for the replies too. | NIST SP 800-41r1 §2.1.1; Palo Alto stateful firewall, Stateful vs. Stateless Firewalls; Cisco ASA access rules, Extended Access Rules for Returning Traffic; Azure NSG, Security rules. No allowed source says such a rule is often wide open. |
| 7 | Learn lead | Each time, it read its list from the top and stopped at the first rule that fit. | For each visit, it read its list from the top and stopped at the first rule that fit. | NIST SP 800-41r1 §5.2.2; Palo Alto rulebase best practices; Cisco ASA access rules, Rule Order. The reply in step 5 read no rule (“Rules read: None”). |
| 8 | Learn term Shadowed rule | A rule that never gets a turn, because one above it catches everything first | A rule that never gets a turn, because one above it catches all its traffic first | Palo Alto rulebase best practices; Google Cloud Firewall Insights, Shadowed rules; Cisco FMC access rules, Rule preemption. Any broader rule above can shadow, not only a catch-all. |
| 9 | Learn why | Without a firewall, every service on every computer would be open to the whole internet, including ones nobody meant to share. | Without a firewall, every service on a computer the internet can reach would be open to anyone, including ones nobody meant to share. | NIST SP 800-41r1 §2; Microsoft Windows Firewall rules, Applications rules. A home computer behind NAT is not reachable from outside, as What is IP teaches. |
| 10 | Learn Go deeper | Network firewalls guard the edge of a network; host firewalls, like Windows Defender Firewall, guard one computer. | Network firewalls guard the edge of a network; host firewalls, like the one built into Windows, guard one computer. | NIST SP 800-41r1 §2.1 and §2.2.1; Microsoft Windows Firewall overview; Palo Alto What Is a Firewall? (Perimeter firewall, Host-based firewall). Microsoft now names the product “Windows Firewall”; a product name rested on one publisher. |
| 11 | Learn fact label | Default | Recommended default | NIST SP 800-41r1 §4; Microsoft Windows Firewall rules, Applications rules. Read alone, “Default” said what firewalls do by default; Windows allows outgoing traffic by default, so the fact now says what is recommended. The value is unchanged. |
| 12 | Practice question 2, prompt | A list has two rules. Rule 1: allow port 22 from anyone. Rule 2: deny port 22 from 203.0.113.50. Can 203.0.113.50 log in on port 22? | A list read from the top has two rules. Rule 1: allow port 22 from anyone. Rule 2: deny port 22 from 203.0.113.50. Can 203.0.113.50 log in on port 22? | NIST SP 800-41r1 §5.2.2 (some firewalls check deny rules first); Microsoft Windows Firewall rules, Rule precedence (a block rule wins; a more specific rule wins). Without the words, two options’ feedback was false for Windows Firewall. |

### Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Step 1 Go deeper, last sentence | The rules here see it after that. | Cisco ASA matches rules on the address after NAT; Palo Alto on the address before it. Which one a rule sees depends on the product, and no rule in the lesson names a destination. |
| 2 | Unit references | NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy | A cited lesson writes no references; its Sources list is built from its citations (31 sources, NIST SP 800-41r1 among them). |

### Added

New statements, terms and facts, with why each was needed.

| # | Where | Before (if widened) | After | Source and section |
|---|---|---|---|---|
| 1 | Learn term Source | The address a visit comes from | The address a visit comes from (a rule can name one exact address, written /32) | Widened: step 3’s fact and the rule list show “/32”. RFC 4632 §3.1; RFC 791 §3.1; NIST SP 800-41r1 §2.1.1; Microsoft Windows Firewall overview. |
| 2 | Learn term Default deny | Blocking whatever no rule allows | Blocking whatever no rule allows, also called deny by default | Widened with NIST’s name for it: NIST SP 800-41r1 §4 and Appendix A; Palo Alto rulebase best practices; Cisco ASA access rules, Implicit Deny. |
| 3 | Learn fact Stateful | Tracks the connections it allowed | Tracks the connections it allowed, until they close or go quiet | Widened: step 6 empties the table because the connections closed. NIST SP 800-41r1 §2.1.2; Cisco ASA connections, Configure Global Timeouts. |
| 4 | Learn fact (new): Ports here | — | TCP 443 HTTPS, TCP 22 SSH, TCP 23 Telnet | Needed so Watch’s log rows, tags and rule list have a Learn part to trace to. IANA Port Numbers; RFC 9110 §4.2.2. |
| 5 | Learn fact (new): Remote logins | — | SSH is for logging in to and managing a computer from far away, and it is encrypted; Telnet, older and far less safe, sends plain text | Needed for steps 2 to 4 and the login events. RFC 4251 §1 and §4.1; NISTIR 7966 §3; NIST SP 800-123 §6.5 and §4.2.1; Cloudflare SSH. |
| 6 | Learn fact (new): Catch-all rule | — | Last, below the more specific rules | Needed for step 6’s “That’s why the catch-all always goes last.” Palo Alto rulebase best practices; Palo Alto firewall rules, Firewall Rules Order; Cisco FMC access rules, Access control rule order. |

### Reworded, same meaning

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 1 Go deeper | The visit is the first packet of a TCP connection, called a SYN (lesson 11). | The visit is the first packet of a TCP connection, called a SYN. | RFC 9293 §3.5 and §3.1. The pointer is cut: a cited lesson may not say “lesson N”. |
| 2 | Step 1 Go deeper | Port 443 is HTTPS (lesson 14). | Port 443 is HTTPS. | RFC 9110 §4.2.2; IANA Port Numbers. Pointer cut. |
| 3 | Step 1 Go deeper | The web server’s address, 10.0.0.10, is private, so in real life the visit reaches it through NAT (lesson 12). | The web server’s address, 10.0.0.10, is private, so in real life the visit reaches it through NAT. | RFC 1918 §3; NIST SP 800-41r1 §3.2; RFC 3022 §2.2 (added at the re-check). Pointer cut. |
| 4 | Step 3 Go deeper | 198.51.100.7/32 means exactly one address: all 32 bits must match (lesson 7 covers the slash). | 198.51.100.7/32 means exactly one address: all 32 bits must match (the Subnetting lesson covers the slash). | RFC 4632 §3.1. The pointer names the lesson instead of numbering it. |

### What the checker passed as a simplification

Each is a `Note:` of the passing reports (`docs/fact-checks/firewalls.md`, and `docs/fact-checks/firewalls.recheck.md` for the one re-checked item, listed last) on an item it passed, saying what a true-for-a-beginner sentence leaves out.

| Item | Note |
|---|---|
| `units[0].osi` | Three vendors on three different sites each put address-and-port filtering, the kind of firewall this lesson shows, at layers 3 and 4. The badge leaves out that next-generation firewalls also work at layer 7, which the lesson itself says in "deep-types". |
| `units[0].osi` | All three pages are live and describe current products or current practice (checked 2026-11-12). |
| `units[0].steps[0].deep[0] (step "rule-evaluation", Go deeper)` | RFC 9293 is the defining standard for TCP; it defines the three-way handshake (§3.5) and the SYN control bit in the header (§3.1). It is an Internet Standard, not obsoleted and not updated. |
| `units[0].steps[0].deep[0] (step "rule-evaluation", Go deeper)` | The claim says "packet" where TCP says "segment"; for a beginner that is the same thing. |
| `units[0].steps[0].deep[1] (step "rule-evaluation", Go deeper)` | RFC 791 defines the IPv4 header and its address fields; RFC 9293 §3.1 defines the TCP header, whose Destination Port field is the port the rule reads. NIST SP 800-41r1 §2.1.1 (page 13 of the PDF) goes on to list the destination address, the protocol and the destination port as what a packet filter checks. |
| `units[0].steps[0].deep[1] (step "rule-evaluation", Go deeper)` | RFC 791 is an Internet Standard, not obsoleted; its updates (RFC 1349, 2474, 6864) change the Type of Service, DS and ID fields, not the address fields. |
| `units[0].steps[0].deep[2] (step "rule-evaluation", Go deeper)` | RFC 9110 defines the https URI scheme and its default port; the IANA registry is the defining record of port assignments, and its entry for 443/tcp is named https. Both current (registry last updated 2026-11-10). |
| `units[0].steps[1].deep[0] (step "first-match", Go deeper)` | RFC 4251 defines the SSH protocol architecture; the IANA registry assigns 22/tcp to ssh, citing RFC 4251. RFC 4251 is not obsoleted; its updates (RFC 8308, extension negotiation; RFC 9141, FTP references) do not touch what SSH is for. |
| `units[0].steps[1].deep[1] (step "first-match", Go deeper)` | NIST says "many" and Palo Alto says "typically"; three vendors' products work this way. "Most" is a fair beginner's word for it, and the next note in the lesson names the exceptions. |
| `units[0].steps[1].deep[2] (step "first-match", Go deeper)` | Windows Firewall rules page also notes it has no administrator-assigned rule order. Page live (updated 2026-10-08). |
| `units[0].steps[1].deep[3] (step "first-match", Go deeper)` | "Refused with a reply" puts a TCP reset (or an ICMP unreachable) in everyday words. |
| `units[0].steps[2].deep[0] (step "source-filtering", Go deeper)` | RFC 4632 defines CIDR prefix notation; its table in §3.1 gives one address per /32 block. It is a Best Current Practice, not obsoleted or updated. The pointer to the Subnetting lesson is a cross-reference, not a claim about networks. |
| `units[0].steps[2].deep[1] (step "source-filtering", Go deeper)` | NIST and Microsoft each state that a rule matches on the packet's source address, so a rule that names one address stops matching when the sender's address changes; Microsoft's advice exists because addresses do change. The claim leaves out that some products can name a group or a dynamic value instead of a fixed address. |
| `units[0].steps[3].deep[0] (step "default-deny", Go deeper)` | The IANA registry is the defining record of port assignments; 23/tcp is assigned to telnet (RFC 854). |
| `units[0].steps[3].deep[1] (step "default-deny", Go deeper)` | The claim is about what NIST's own guidance says, and SP 800-41 Rev. 1 is that guidance, so it is the defining document here. It is the current revision on CSRC (September 2009, supersedes the 2002 edition), not withdrawn. |
| `units[0].steps[3].deep[2] (step "default-deny", Go deeper)` | Cisco and Palo Alto both name an implicit deny; Cisco's management rules, Palo Alto's intrazone default and Windows' outbound default show that not every list ends in a deny. |
| `units[0].steps[4].deep[0] (step "stateful", Go deeper)` | The addresses and ports are example values (RFC 5737 and RFC 1918 addresses, a made-up client port). "Goes quiet" is the everyday word for an idle timeout. |
| `units[0].steps[4].deep[2] (step "stateful", Go deeper)` | NIST's text dates from 2009; Cisco's current pages confirm that today's traditional and next-generation firewalls both track state. |
| `units[0].steps[5].deep[1] (step "shadowing", Go deeper)` | The two Palo Alto pages are one publisher, so the second independent source is Cisco. Palo Alto also puts rules that block known-bad traffic and allow core services such as DNS near the top; the claim leaves out that exception. |
| `units[0].learn.lead[0] ("lead-1")` | The count matches Watch: five visits (website, visitor on port 22, admin on port 22, Telnet, website again) and one reply. |
| `units[0].learn.terms[0] ("term-firewall")` | Leaves out host firewalls and firewalls inside a network, which "deep-where" covers. |
| `units[0].learn.terms[2] ("term-port")` | "Websites" means secure (HTTPS) websites, the ordinary case today; plain HTTP uses port 80. RFC 9110 and the IANA registry define the 443 assignment. |
| `units[0].learn.terms[3] ("term-source")` | RFC 791 defines the source address field and RFC 4632 defines the prefix notation. /32 is for IPv4; the claim leaves out IPv6, where one address is /128. |
| `units[0].learn.terms[7] ("term-shadowed")` | Cisco calls the same thing rule preemption. The term leaves out partial shadowing, where only some of a rule's traffic is caught above it. |
| `units[0].learn.pattern ("pattern")` | "Stateful Inspection" is NIST's term; the other names describe what the sources state in plain words. Default deny is what NIST recommends rather than what every firewall does; the pattern describes the lesson's list, which ends in one. |
| `units[0].learn.why[0] ("why-1")` | "Open" means reachable over the network. A service may still ask for a login, which the claim leaves out. |
| `units[0].learn.why[1] ("why-2")` | "Short" is an everyday describing word; the point, allow only what is needed, is stated by both. |
| `units[0].learn.deep[0] ("deep-acl", Learn's Go deeper)` | Some products use other names (Palo Alto's rulebase, Azure's security rules); "also called" allows for that. |
| `units[0].learn.deep[2] ("deep-where", Learn's Go deeper)` | Leaves out internal firewalls that sit between parts of a network. |
| `units[0].learn.facts[1] ("fact-order")` | True of the lesson's firewall and of most products; the exceptions are named in a Go deeper note on the "first-match" step. |
| `units[0].learn.facts[3] ("fact-stateful")` | NIST's termination state covers both a connection that is closed and one idle for a long time (quoted under the step "stateful" Go deeper); the second NIST quote, on page 15, is about removing an entry once its timeout runs out. |
| `units[0].learn.facts[5] ("fact-ports")` | The IANA registry is the defining record of all three assignments (22/tcp ssh, 23/tcp telnet, 443/tcp https); RFC 9110 defines the https default port. |
| `units[0].learn.facts[6] ("fact-logins")` | RFC 4251 defines SSH; NISTIR 7966 is current (October 2015, not withdrawn). Plain text for Telnet is stated by Cloudflare and NIST SP 800-123, a government guide. |
| `units[0].learn.facts[7] ("fact-catch-all")` | The two Palo Alto pages are one publisher; Cisco is the second independent source. A catch-all is the most general rule there is, so it goes at the bottom. |
| `units[0].practice[0].options[0] (question "port-8080")` | Against the lesson's list (443 from anyone, 22 from the admin, deny all), port 8080 falls to rule 3; the option is right. |
| `units[0].practice[0].options[2] (question "port-8080")` | A host firewall such as Windows Firewall can prompt a user when a new app wants to accept connections; that is not this network firewall's case, and the feedback is about the lesson's list. |
| `units[0].practice[1].options[0] (question "two-rules")` | The prompt sets a list read from the top, so the first-match answer is right; "log in" means the firewall lets the login attempt through. |
| `units[0].practice[1].options[1] (question "two-rules")` | True for a list read from the top, which the prompt sets. Some products (Windows Firewall) do favour the more specific rule, and the lesson says elsewhere that some products sort rules in other ways. |
| `units[0].practice[1].options[2] (question "two-rules")` | True within the prompt's top-down list. Some products do check deny rules first, which a Go deeper note on the "first-match" step covers. |
| `units[0].steps[0].deep[3] (step "rule-evaluation", Go deeper)` | RFC 1918 (BCP 5) defines the private address blocks, and 10.0.0.10 falls in its 10/8 block, so "private" is stated by the defining standard. Its rule that private-addressed packets stay off inter-enterprise links is why an internet visitor cannot reach the server's own address directly. |
| `units[0].steps[0].deep[3] (step "rule-evaluation", Go deeper)` | RFC 3022 is the document that defines Traditional NAT (Basic NAT and NAPT); §2.2 covers NAPT, including the static mapping that lets an outside visitor reach one inside host on one service port. |
| `units[0].steps[0].deep[3] (step "rule-evaluation", Go deeper)` | Two independent sources (RFC 3022 and NIST SP 800-41r1) each state that a NAT can send inbound visits to a host with a private address inside, and RFC 1918 defines the address as private. |
| `units[0].steps[0].deep[3] (step "rule-evaluation", Go deeper)` | Passed under "True for a beginner". The sentence leaves out that inbound NAT needs a mapping set up in advance (a static port mapping, which NIST calls pinholing), since outside hosts otherwise cannot open contact, and that other routes exist, such as a mediating application gateway or proxy, which RFC 1918 also mentions. NAT is the ordinary case, and nothing in the cited sections contradicts it. |
| `units[0].steps[0].deep[3] (step "rule-evaluation", Go deeper)` | Currency. RFC 1918 is not obsoleted. Its one update, RFC 6761, reserves the reverse-mapping DNS names for the private blocks and does not change the blocks or the forwarding rule. RFC 3022 is not obsoleted and has no updates. NIST SP 800-41 Rev. 1 is listed as final, and CSRC marks it neither withdrawn nor superseded. NAT for reaching private-addressed servers is current practice. |

### Counts

12 corrections, 2 removals, 6 additions (3 new Learn facts, 3 widened), 4 rewordings: 24 changed or added sentences. The rest of the lesson, including every step’s narrative except step 4’s, every event, table row and Practice question, is word for word as before. The lesson passed 105 of 106 items on its first full check and the one remaining item on a targeted re-check, so all 106.
