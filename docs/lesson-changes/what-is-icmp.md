# What is ICMP: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 22 sources (it listed one, RFC 792, before) and passed its fact-check on 2026-11-12, all 118 items, on its first full check. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-icmp.ts`), it has 16 corrections, 8 removals, 11 additions and 1 rewording; the last sections list what is word for word as before and what the checker passed as a simplification.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; RFC 792 has none, so it is cited by the page its section starts on.

## The changes to look at first

1. **No message size is shown.** The log's Size column was 98 B on every request and the echo reply, and 126 B on every error. No source states a size, and a number in a log reads as a fact about the protocol, so all 14 are now a dash. The old "56 bytes of data" in the first message is gone for the same reason. (Removals 7 and 8.)
2. **"Ping sends one a second until you stop it (four on Windows)" and "traceroute on Linux and macOS" are gone.** A tool's default belongs to one vendor's page, and the lesson may state it only where two publishers do. Ping now "sends a series of them and times each reply", and the probes sentence names the classic traceroute, Cisco's and Windows' tracert. (Corrections 5 and 7.)
3. **The lesson no longer says ICMP always tells the sender.** "The network tells the sender instead of failing silently" is false: RFC 792 says some datagrams are lost without any report, and the lesson itself shows silent routers (* * *) and blocked pings. Step 6, the description and a new Learn sentence now say "can". (Corrections 2 and 10, addition 1.)
4. **"No ports" became "no ports of its own".** RFC 792 says an echo's identifier "might be used like a port", so a flat "none" taught less than the standard says. (Corrections 4, 12 and 13.)
5. **Servers no longer "ignore pings".** No allowed source says servers do; firewalls blocking ICMP is stated by several. The Go deeper line and a Practice answer now say firewalls can block pings. (Corrections 6 and 16.)
6. **"The times grow with each hop" and "the first thing to run when a site is slow" are gone.** Both vendors' own sample output shows times that fall from one hop to the next, and Cisco calls round-trip times a rough idea, not a precise measure. (Corrections 8 and 9.)
7. **One Practice answer no longer says "Routers don't sign packets. They reply only when a packet's TTL runs out."** Routers also send destination unreachable, which step 6 teaches. (Correction 15.)
8. **mtr, the 50/200 ms rule of thumb and the attack sentence are removed.** No allowed source states them. (Removals 1 to 6.)

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Overview fact label | Messages | Messages here | The list read as all of ICMP's messages, but Learn's Go deeper teaches a fifth, redirect (type 5). RFC 792 page 12 (Redirect Message); IANA ICMP Type Numbers. The value is unchanged. |
| 2 | Overview description, fourth sentence | And when a packet can’t be delivered, ICMP is how the network sends back a note to say why. | And when a packet can’t be delivered, ICMP is how the network can send back a note to say why. | RFC 792 Introduction: "no guarantees that a datagram will be delivered or a control message will be returned". |
| 3 | Step 1 Go deeper | Ping first looks the name up with DNS. | Ping first finds the name’s address. | Microsoft ping, Introduction (a name may be resolved by the Hosts file, DNS or NetBIOS); RFC 2151 §3.2 (ping takes an address or a name). |
| 4 | Step 1 Go deeper | with no ports. | with no ports of its own. | RFC 792, Message Formats (page 2) and Echo or Echo Reply Message (page 15): the identifier "might be used like a port". |
| 5 | Step 1 Go deeper | Ping sends one a second until you stop it (four on Windows). | Ping sends a series of them and times each reply. | RFC 2151 §3.2, Cisco ping and traceroute (Ping Command), Microsoft ping (Introduction). The one-a-second default is RFC 2151's and the four is Microsoft's; each rests on one publisher. |
| 6 | Step 1 Go deeper | Some servers and firewalls ignore pings, so no reply doesn’t always mean the server is down. | Firewalls can block pings, so no reply doesn’t always mean the server is down. | RFC 2923 §3; Palo Alto ICMP; Cisco ping and traceroute (Access List Command). No allowed source says servers ignore pings (RFC 1122 §3.2.2.6 says every host must answer). |
| 7 | Step 3 Go deeper | traceroute on Linux and macOS sends UDP probes by default; tracert on Windows sends echo requests. | The classic traceroute, and Cisco’s, sends UDP probes; tracert on Windows sends echo requests. | RFC 2151 §3.4 and Cisco (Traceroute Command) for UDP; Microsoft tracert and Cisco traceroute on operating systems (Microsoft Windows) for tracert. No allowed source names macOS, and Linux only Cisco's second page. |
| 8 | Step 4 Go deeper, first sentence | The times grow with each hop because each answer comes from further away. | Each time is a round trip to that hop: a rough idea of the delay. | Cisco ping and traceroute (Performance); RFC 2151 §3.4. Cisco's and Microsoft's own sample outputs show times that fall between hops (20 ms then 16 ms; 44 ms then 32 ms). |
| 9 | Step 5 narrative, last sentence | It’s the first thing to run when a site is slow, to see where the delay starts. | When a site is slow, its times give a rough idea of the delay on the way. | Cisco ping and traceroute (Performance): the figures "are not precise enough to be used for performance evaluation". No source gives advice on what to run first. |
| 10 | Step 6 narrative, last sentence | That’s ICMP’s other job: when something goes wrong, the network tells the sender instead of failing silently. | That’s ICMP’s other job: when something goes wrong, the network can tell the sender, though some packets are still lost without a note. | RFC 792 Introduction: "Some datagrams may still be undelivered without any report of their loss." |
| 11 | Step 6 Go deeper, second sentence | Host unreachable often takes a few seconds, while the router tries ARP. | Here, host unreachable comes once the router has asked for the machine with ARP and had no answer. | RFC 1812 §3.3.2 and §5.2.7.1 (host unreachable "does not respond to ARP"). No source gives a time. The table's "3 s" stays as example data. |
| 12 | Learn Go deeper | ICMP has no ports. | ICMP has no ports of its own; an echo’s identifier is used like one. | RFC 792, Message Formats (page 2) and Echo or Echo Reply Message (page 15). |
| 13 | Learn fact Ports | none | none of its own; an echo’s identifier is used like one | As correction 12. |
| 14 | Practice, "It asks DNS for the list." | Not quite. Nobody keeps such a list. Traceroute finds the routers itself, one hop at a time. | Not quite. DNS turns names into addresses. Traceroute finds the routers itself, one hop at a time. | RFC 1034 §5.2.1 (a resolver turns a name into an address); Microsoft tracert and Cisco (Traceroute Command). "Nobody keeps such a list" has no source. |
| 15 | Practice, "Each router adds its name to the ping." | Not quite. Routers don’t sign packets. They reply only when a packet’s TTL runs out. | Not quite. Traceroute learns each router from the time exceeded note it sends back when a probe’s TTL runs out there. | Microsoft tracert (Introduction); Cisco (Traceroute Command); RFC 1812 §5.3.1. "Only" ruled out destination unreachable, which routers send and step 6 teaches. |
| 16 | Practice, "The server is switched off." | Not quite. Many servers and firewalls simply ignore pings. | Not quite. Firewalls can block pings, so a server that is on may still not answer. | As correction 6. |

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Step 2 Go deeper, last sentence | Under about 50 ms feels instant for most things; 200 ms is noticeable in a call or a game. | No source gives 50 ms, and ITU-T G.114 §4 puts "essentially transparent" delay at 150 ms one way, which is about 300 ms there and back. |
| 2 | Step 5 Go deeper, second sentence | A big jump in time at one hop, carried on by every hop after it, usually points at that link. | No allowed source states it. |
| 3 | Step 5 Go deeper, third sentence | Different probes can take different paths, so a line may show more than one address. | No allowed source states it. |
| 4 | Step 5 Go deeper, last sentence | mtr runs traceroute over and over. | mtr has no allowed source. |
| 5 | Step 5 fact Tools | mtr (the value was "traceroute, tracert, mtr", now "traceroute, tracert") | As removal 4. |
| 6 | Learn Go deeper, end of the firewall sentence | ; ping floods and oversized pings were once used as attacks | Oversized pings: no allowed source. Floods: RFC 4890 §3.1 only, and for ICMPv6. The sentence now ends "…many firewalls limit it." |
| 7 | The log's Size column, all 14 messages (the 7 requests and the echo reply at 98 B, the 6 errors at 126 B) | 98 B and 126 B; now shown as — | No source states a size. The times, addresses and ids stay as example data. |
| 8 | Step 1 message ECHO REQUEST, Info | , 56 bytes of data | 56 bytes is RFC 2151's ping only (Windows sends 32), and no Learn part states it. The Info now reads "Echo request, id 1, seq 1". |

## Added

New statements, terms and facts, with why each was needed. The new Learn facts are the parts the Watch steps and the Overview trace to; the old Learn did not state these ideas.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn lead | When something goes wrong, the network can tell the sender, though some packets are still lost without a note. | Carries the corrected step 6 and description sentences (RFC 792 Introduction). |
| 2 | Learn term Packet loss | Pings that never come back | Step 2's "packet loss" and the fact "Lost" trace to it (Cisco ping and traceroute; RFC 2151 §3.2; Microsoft Azure TCP/IP tuning). Terms go from 8 to 9. |
| 3 | Learn fact Types, widened | 0 reply, 3 unreachable, 8 request, 11 time exceeded (code 0: the TTL ran out in transit) | The log's "TTL 0 in transit" traces to it (RFC 792 Time Exceeded Message; IANA ICMP Type Numbers and Type 11 codes). |
| 4 | Learn fact Echo request | type 8, code 0, with an identifier and a sequence number that come back in the reply, so ping can match them; the reply carries back the same data | The "id 1, seq 1" in the log and "carrying back the same data" in step 2 trace to it (RFC 792, Echo or Echo Reply Message, pages 14 and 15). |
| 5 | Learn fact TTL | set by the sender, 64 by default; each router takes 1 off, and at 0 the packet is dropped | Step 2's TTL 60 and the probes' TTLs trace to it. The same words and sources as What is IP (RFC 791 §1.4; IANA IP Time to Live Parameter; RFC 1812 §5.3.1). |
| 6 | Learn fact How traceroute works | probes with a TTL of 1, then 2, 3 and so on; the router where each runs out sends back time exceeded from its own address | Steps 3 to 5 trace to it (Microsoft tracert; Cisco; RFC 2151 §3.4; Cisco on operating systems, General Operation; RFC 1812 §5.3.1 and §4.3.2.4; RFC 792 page 3). |
| 7 | Learn fact How tracert works | tracert on Windows sends echo requests, and the destination answers the last with an echo reply | The Watch tab's probes and its last reply trace to it (Microsoft tracert; Cisco on operating systems, Microsoft Windows; RFC 4890 §1). |
| 8 | Learn fact Destination unreachable | type 3, with a code for why (0 network, 1 host, 3 port, 4 fragmentation needed); a host unreachable comes from the last router when the machine doesn’t answer ARP | Step 6 traces to it (RFC 792 page 4; RFC 1812 §5.2.7.1, §4.3.3.1, §3.3.2). |
| 9 | Learn fact OSI layer | 3, network | Backs the Overview fact and the badge (Palo Alto ICMP; Cloudflare ICMP; no standard places ICMP in the OSI model). |
| 10 | Learn fact Used for | tests and error notes | The Overview fact traces to it (RFC 1812 §4.3.1; Palo Alto ICMP). |
| 11 | Learn, Sources list | 22 sources instead of one | Every cited claim lists its source at the foot of Learn. |

## Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Overview fact Ports | none: it sits beside IP | none: it rides on IP |

## Unchanged

Word for word as the original: the title ("ICMP"), the full name, the purpose ("Network check-ups"), the level and group; the OSI badge (layer 3, now cited to Palo Alto and Cloudflare, since no standard places ICMP in the OSI model); the scene's title, labels (Running ping, Terminal), table (title, columns, empty text) and all six parties; all six step titles and subtitles, in the same order; the narratives of steps 1 to 4 and the first three sentences of step 5's; the Overview hook, the first three sentences of the description (the doctor's check-up, an analogy) and the facts Used for, Tools, OSI layer and This example; the step facts apart from the Tools value; all 14 messages, in the same order, with their tags, addresses, times, summaries, statuses, table rows and the probe that got no answer, apart from the sizes and the one Info line above; the Go deeper sentences not listed above; Learn's lead sentence, its eight terms, the pattern's four names and note, the why, and the facts Rides on, Tools and Defined in; both Practice prompts, their ids, the options, the right answers (the second, then the third) and the feedback not listed above. The Go deeper blocks are now shown as short paragraphs, one idea each, so that each cites its own sources; the words are as listed.

## What the checker passed as a simplification

The checker passed these under the owner's rule: each is true in the ordinary case, and its report's notes say what it leaves out or loosens. They stay as written. The first two are the ones to read.

1. **The Watch tab's traceroute is Windows' tracert.** Its probes are echo requests and the last hop answers with an echo reply. The classic traceroute (and Cisco's) sends UDP probes to an invalid port and ends with a port unreachable instead. The lesson says so in step 3's Go deeper, and the Learn fact says "tracert on Windows".
2. **"64 by default" leaves out senders that start from another value.** A sender may choose another starting TTL (Microsoft's own sample shows 124), and a router may take off more than one. Step 2's "probably started at 64" is worded for this.
3. **The doctor's check-up analogy** has a factual fourth sentence; with "can" it says what the Learn lead says.
4. **"Ping first finds the name's address"** leaves out that you can ping an address directly, which needs no lookup.
5. **"Tell senders why" (Learn why)** is the ordinary case; the Learn lead gives the exception.
6. **Time exceeded** leaves out code 1 (fragment reassembly), a rarer case. **Destination unreachable** lists four of its codes.
7. **"Usually three" probes per hop** matches the default of three; the count can be changed.
8. **Asterisks:** a router that sends no time exceeded shows as * * *; other reasons (a lost probe, a time-out) are left out.
9. **TTL as "the hop counter"** leaves out that RFC 791 first defined it as a time limit; RFC 1812 says it works in practice as a hop count.
10. **Latency** can also mean the one-way delay; the lesson gives it as the round-trip time ping shows, as Microsoft's Azure page does.
11. **Packet loss** is given as ping measures it, not any lost packet.
12. **Firewalls "limit" ICMP:** RFC 4890 speaks of ICMPv6; Palo Alto shows the same filtering for ICMP.
13. **The DNS feedback** leaves out DNS's other lookups and that tracert may look up each hop's name, which does not make DNS the source of the list.
14. **"Traceroute helps narrow it down"** is the ordinary use; some older traceroutes used IP's record-route option, a rare case.
15. **The OSI badge** rests on two vendors' pages (Palo Alto and Cloudflare), because no standard places ICMP at an OSI layer.
16. **Example data:** the addresses (RFC 1918 and RFC 5737), example.net, the clock times, the round-trip times, the id and sequence numbers and the 3 s wait are example values.

## Counts

The counts at the top were made by a script that counts the numbered rows in each table above (16 corrections, 8 removals, 11 additions, 1 rewording), and the sources by the claim sheet's source list (22) against the one reference of the original.
