# What is IP: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 28 sources (it listed one, RFC 791, before) and passed its fact-check on 2026-11-12, all 97 items, on its first full check. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-ip.ts`), it has 10 corrections, 5 removals, 11 additions and 2 rewordings; the last sections list what is word for word as before and what the checker passed as a simplification.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; RFC 826, 894 and 792 have no numbered sections, so their parts are named by their headings.

## The changes to look at first

1. **Step 3 no longer says the header is put on after ARP.** RFC 791 has the IP module make the header first and only then find the local address of the next device; ARP is asked about a packet that already exists. The step stays where it is, and the narrative now says the packet "carries" its header before the laptop wraps it in a frame. (Correction 4, rewording 1.)
2. **The ARP cache is kept "for a short while", not "a few minutes".** The standard speaks of cache timeouts "on the order of a minute or less". "(arp -a shows it)" is gone because only Microsoft documents that command. (Correction 2 and 3, removal 1.)
3. **The way back is no longer "often the same".** Between providers the return path is normally different, as the step's own Go deeper already said. The step 5 subtitle and its fact now say so. (Corrections 6 and 7.)
4. **"Every packet you send leaves this way" is now "An IPv4 packet you send to the internet".** The answer stays in the ARP cache so later packets skip ARP, IPv6 has no ARP and usually no NAT, and a packet to a device at home is delivered with no NAT. (Correction 8.)
5. **No message size is shown.** The log's Size column said 42 B and 60 B. No source states a size, and a number in a log reads as a fact about the protocol, so all seven are now a dash. (Removal 3.)
6. **"Thousands" became "many", "fibre" became "Ethernet", and "any address" became "any public address".** No source counts the networks or homes, none names fibre as a network that carries IP, and the lesson itself teaches that a private address cannot be reached from the internet. (Corrections 1, 5 and 9.)
7. **Practice 1 no longer says routers "only change the TTL".** Every router that lowers the TTL must also recompute the header checksum. (Correction 10.)

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Overview hook and lesson summary (second sentence) | It’s what makes thousands of separate networks act like one internet. | It’s what makes many separate networks act like one internet. | RFC 1122 §1.1.2 (the internet is a network of networks); no source counts the networks. |
| 2 | Step 2 Go deeper, third sentence | The laptop keeps the answer in its ARP cache for a few minutes (arp -a shows it). | The laptop keeps the answer in its ARP cache for a short while. | RFC 1122 §2.3.2.1 (cache timeouts "on the order of a minute or less"); Microsoft arp (the cache exists). The "(arp -a shows it)" part is removal 1. |
| 3 | Step 2 fact Kept in | the ARP cache, a few minutes | the ARP cache, for a short while | RFC 1122 §2.3.2.1; the same fault as 2. |
| 4 | Step 3 narrative, first two sentences | Now the laptop packs the data up. It puts an **IP header** on the front, a label with the **source address** (192.168.1.100), the **destination address** (203.0.113.80) and a **TTL**, a hop counter that starts at 64. | The packet carries an **IP header** on the front, a label with the **source address** (192.168.1.100), the **destination address** (203.0.113.80) and a **TTL**, a hop counter that starts at 64. | RFC 791 §2.2 (the module prepares the datagram header, then finds the local address of the gateway); RFC 826 (ARP is asked for a packet already made). The wrong order was the fault; the step stays where it is. |
| 5 | Step 4 narrative, third sentence | Thousands of homes use the same numbers, so the internet couldn’t send anything back to it. | Many homes use the same numbers, so the internet couldn’t send anything back to it. | RFC 1918 §3 (the address space is used by many enterprises); no source counts the homes. |
| 6 | Step 5 subtitle | Back the same way | Back, hop by hop | RFC 3704 §2.2 and RFC 6250 §3.1.1 (the way back is normally not the same between providers). |
| 7 | Step 5 fact Path back | often the same, not always | can differ from the way out | RFC 3704 §2.2 (routing between providers is normally asymmetric); RFC 6250 §3.1.1. |
| 8 | Learn pattern note, first sentence | Every packet you send leaves this way. | An IPv4 packet you send to the internet leaves this way; ARP is skipped while the answer is in the cache. | RFC 1122 §3.3.1 (a packet to a device on the same network is sent directly); RFC 826 and RFC 1122 §2.3.2.1 (the cache); RFC 8200 §1 and RFC 4864 §1 (IPv6 has no ARP and usually no NAT, as the lesson says). "Every" ruled out what the lesson teaches. |
| 9 | Learn why, second sentence | Wi-Fi, fibre and mobile networks all work differently underneath, but they all carry IP packets, so a packet can cross all of them to reach any address. | Wi-Fi, Ethernet and mobile networks all work differently underneath, but they all carry IP packets, so a packet can cross all of them to reach any public address. | RFC 1122 §1.1.3; RFC 791 §1.3; RFC 9724 §1 and §2.1 (Wi-Fi); RFC 894 (Ethernet); RFC 7066 §1 (mobile); RFC 1918 §3 (a private address cannot be reached from outside). No allowed source names fibre as such a network. |
| 10 | Practice 1, option 3 feedback | Not quite. Routers on the way leave the addresses alone and only change the TTL. Your router swaps it once. | Not quite. Routers on the way leave the addresses alone; they change the TTL, and the checksum that covers it. Your router swaps it once. | RFC 791 §3.1 (the checksum is recomputed at each point the header is processed); RFC 1812 §5.3.1. |

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Step 2 Go deeper | "(arp -a shows it)" | Only Microsoft documents the command; no second publisher on an allowed host does. |
| 2 | Step 1 Go deeper, last sentence | " or ip route on Linux" (it now ends "route print on Windows.") | Its only good documentation is on a host that is not allowed. "route print" stays, stated by Microsoft's route page and Cisco's "Use the Route Command". |
| 3 | The log's Size column, all seven messages (WHO HAS?, IS AT, PACKET ×1, PACKET ×2, PACKET to example.net, REPLY ×2) | 42 B, 42 B, 60 B ×5; now shown as — | A size reads as a claim about the protocol and no source states one. The times, addresses and MAC addresses stay as example data. |
| 4 | Event 3 (PACKET, laptop to router), Info | ", 60 bytes" (it now reads "IPv4, TTL 64, protocol TCP") | No source states a packet's size. |
| 5 | Step 5 narrative, last sentence | " and never knew its address was swapped" (it now ends "The laptop gets its answer.") | No Learn part states it; the one source that does, RFC 3022 §2.2 ("completely transparent"), is a single publisher and not a defining document. |

## Added

New statements, terms, facts or sentences, with why each was needed. The old Learn did not state these ideas, and each Watch item that shows them must trace to a Learn part that does.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn term Encapsulation | "Wrapping the packet in a frame for the next link" | Step 3 and the pattern use the word (RFC 1812 §5.2.1.2; RFC 791 §2.2). |
| 2 | Learn fact OSI layer | 3, network | Backs the Overview fact and the badge (Cloudflare Network Layers; Microsoft Learn, Transport layer; no standard places IP in the OSI model). |
| 3 | Learn fact On the label | the source address, the destination address, a TTL, and the protocol inside, such as TCP (6), UDP (17) or ICMP (1) | The table's From and To, step 3 and the log's "protocol TCP" trace to it (RFC 791 §3.1; IANA Protocol Numbers). |
| 4 | Learn fact TTL | set by the sender, 64 by default; each router takes 1 off, and at 0 the packet is dropped | Every TTL value shown traces to it (RFC 791 §1.4; IANA IPv4 Parameters; RFC 1122 §3.2.1.7; RFC 1812 §5.3.1). |
| 5 | Learn fact ARP | asks everyone on the home network at once, at the broadcast address ff:ff:ff:ff:ff:ff, “who has this address?”, and gives its own; only the owner replies with its MAC address, straight back, and the answer is kept in the ARP cache for a short while | The broadcast, WHO HAS?, IS AT, "Tell 192.168.1.100" and the legend "Broadcast to everyone" trace to it (RFC 826; RFC 894; RFC 1122 §2.3.2.1; Microsoft arp; Cisco DAI). |
| 6 | Learn fact On each link | the packet travels in a frame, such as an Ethernet or Wi-Fi frame, addressed to the next device’s MAC address; each router puts it in a new frame | The carrier "Ethernet" and "Frame to" trace to it (RFC 894; RFC 9724 §2.1; RFC 791 §2.2; RFC 1812 §5.2.1.2). |
| 7 | Learn fact Each router | reads the destination, picks the next router from its routing table, and passes the packet on; after your router, the next is your provider’s | The Overview's "Each hop" and the party "Provider’s router" trace to it (RFC 1812 §5.2.1.2; RFC 3022 §2.2; RFC 3704 §2.2). |
| 8 | Learn fact NAT at home | many homes use the same private addresses, which the internet doesn’t carry, so your router puts its own public address on each packet going out, notes the swap, and swaps it back on the reply | The router's label (inside, outside), "Swapped for" and both NAT log lines trace to it (RFC 1918 §3; RFC 3022 §2.1, §2.2; RFC 4787 §3). |
| 9 | Learn fact The reply | goes to the public address the server saw, with a TTL the server sets, and is routed on its own, so its path can differ from the way out | Step 5's "Reply to", "Path back" and the REPLY messages trace to it (RFC 4787 §3; RFC 3022 §2.2; RFC 791 §1.4; RFC 6250 §3.1.1; RFC 3704 §2.2). |
| 10 | Learn fact From outside | a device at home can’t be reached first, unless the router forwards a port to it | Step 5's "From outside" fact traces to it (RFC 3022 §2, §2.2; RFC 6250 §3.1.1). |
| 11 | Learn, Sources list | 28 sources instead of one | Every cited claim lists its source at the foot of Learn. |

## Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Step 3 narrative, second sentence | Then it wraps all that in a frame addressed to the router’s MAC, and sends it. | Now the laptop wraps all that in a frame addressed to the router’s MAC, and sends it. |
| 2 | Learn fact Defined in | RFC 791 (IPv4), RFC 8200 (IPv6) | RFC 791, Internet Protocol (IPv4); RFC 8200 (IPv6) |

## Unchanged

Word for word as the original: the title ("IP"), the full name, the purpose ("Addresses and routes"), the level and group; the OSI badge (layer 3, now cited to Cloudflare and Microsoft, since no standard places IP in the OSI model); the scene's title, labels (Sending a packet, example.net, the router's inside and outside addresses), table (title, "as it travels", columns, empty text), legend and four parties; all five step titles and the subtitles of steps 1 to 4, in the same order; the narratives of steps 1, 2 and 5 (apart from the cut above) and the rest of 3 and 4; the Overview description (the parcel analogy) and the first sentence of the hook; Overview facts Addresses, Each hop, Promises, OSI layer and This example, and Used for; every step fact apart from the two above; all seven messages, in the same order, with their tags, addresses, times, summaries, statuses, table rows and log lines (apart from the sizes and the one Info line above); Go deeper in steps 1 to 5 (apart from the sentences above); Learn's lead, its nine other terms, the pattern's five names and its second sentence, the first sentence of the why, the four Go deeper sentences (including "the Subnetting lesson goes further"), and the facts IPv4, IPv6, Private ranges and Header; both Practice prompts, their ids, all the options and the feedback of each (apart from the one above), and the right answers. The lead, the why and the Go deeper are now written as separate parts so each can cite its own source; their words are the same.

## What the checker passed as a simplification

The checker passed these under the owner's rule: each is true in the ordinary case, and its report's notes say what it leaves out or loosens. They stay as written. The first is the one to read.

1. **One address translation, at the home router.** The lesson shows your router swapping the address once ("Your router relabelled it once", "Your router swaps it once", the pattern's "The routers on the way only forward"). It leaves out a second translation run by the provider (carrier-grade NAT), which RFC 4864 §2.6 says many providers do. RFC 3022 §2 limits traditional NAT to the stub border router, which is the home case the lesson draws. The checker called this its closest call.
2. **"64 by default".** The starting TTL is the IANA registry's recommended default; a system may use another value, and "often 64" in step 5 and "takes 1 off" (the required minimum) say the same loosely.
3. **"On each link … addressed to the next device’s MAC address".** Some links, such as point-to-point and cellular links, carry no MAC address. "Each link" is read in the ordinary home and provider case the examples set (Ethernet and Wi-Fi).
4. **"Only the default route".** Step 1's Go deeper holds for internet destinations; a real table also has special routes such as loopback and multicast.
5. **The MAC term.** "A hardware number of a network card" leaves out locally set and randomised addresses, which most phones use on Wi-Fi by default.
6. **The header list.** "20 bytes" is the usual header; options can make it up to 60, and the field list leaves out the Type of Service byte. "40 (IPv6)" is the header without extension headers, worked out from RFC 8200 §8.3.
7. **The TTL term** leaves out TTL's old role as a time limit, which RFC 1812 says routers rarely implement.
8. **"Forwarding"** leaves out that on the last hop the next device is the destination itself.
9. **"Which is why NAT exists"** names the main reason, as RFC 4864 does; RFC 3022 §1 also gives privacy.
10. **"Any public address"** leaves out firewalls that block traffic.
11. **"The one thing every network agrees on"** is a beginner's way of saying IP is the shared layer; other protocols are shared too.
12. **"Between providers"** is the everyday word for RFC 4271's "inter-Autonomous System", and "port address translation" is the everyday name for the RFCs' NAPT.
13. **Practice 2, "ARP only finds hardware addresses on your own network"** sets ARP against loop control; ARP is also used to check an address is free, which this lesson does not teach.
14. **Example data:** the addresses (RFC 1918 and RFC 5737), the two MAC addresses (the RFC 9542 documentation range), example.net, 2001:db8::80 (RFC 3849) and the clock times are example values.
15. **The OSI badge** rests on two vendors' pages (Cloudflare and Microsoft), because no standard places IP at an OSI layer.

## Counts

The counts at the top were made by a script that counts the numbered rows in each section above (10 corrections, 5 removals, 11 additions, 2 rewordings), and the sources by the lesson's cited list on the claim sheet (28) against the one reference of the original.
