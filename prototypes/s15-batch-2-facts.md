# S15: Networking Concepts' batch 2, IP Address, MAC Address and TCP/UDP (job 13, 2026-11-15)

The scout's report (Haiku), on `revamp` at `e00ceaf`, saved by the orchestrator as written (the scout's own rules let it write no file), with the repo's own folder path removed. Paths are repo-relative. Evidence is path:line. Nothing was edited.

## Summary

- The three lessons are stops 3 (`ip-address`), 4 (`mac-address`) and 11 (`tcp-udp`) of Networking's 20. Each has a catalogue row and a scene-map row. No lesson file exists for any of them (`src/content/lessons/` has no `ip-address.ts`, `mac-address.ts` or `tcp-udp.ts`).
- Networking has 12 ready lessons and 8 planned stops (`e2e/site.spec.ts:593, :597`). Distinct ready site-wide: 22 (`src/lib/glossary-site.test.ts:6`, `src/scripts/about-page.test.ts:42`).
- Reports: 22 full fact-check reports and 8 re-checks (`src/content/factcheck/reports.unchanged.test.ts:20-21`).
- Documents: no IEEE source is registered (0 entries of kind `ieee`). RFC 4291, RFC 6890, RFC 7042, RFC 8981, RFC 4941, RFC 6146 and RFC 793 are not registered. No MDN page is registered. RFC 2663 is registered now (`src/content/sources.ts:2924`), which the S14 report did not show.
- `regauth.standards.ieee.org` is not an allowed host. `standards.ieee.org` is allowed, but only for kind `ieee`, and no `ieee` entry uses it.
- `e2e/lesson.spec.ts:34` `NO_SEQUENCE` now holds six slugs: subnetting, osi-model, router, arp, ports, nat. S14 listed three.
- The TCP and UDP lessons (`what-is-tcp`, `what-is-udp`) and `what-is-ip` belong to How the Internet Works (`src/content/tracks/how-the-internet-works.ts:30-32`), not to Networking. The Networking `tcp-udp` lesson is a new slug.

## 1 Track position

Track file: `src/content/tracks/networking.ts`.

- Part `local-network` ("Addresses & the local network"): id `:36`, title `:37`. Lessons: `ip-address` `:39`, `mac-address` `:40`, `switch` `:41`, `arp` `:42`.
- Part `across-internet` ("Talking across the internet"): id `:55`, title `:56`. Lessons: `ports` `:58`, `tcp-udp` `:59`, `nat` `:60`, `what-is-dns` `:61`.
- Stop numbers are flat across parts. `registry.ts:82` gives `number: entries.length + 1`. The stops are: osi-model 1 (`:31`), packets 2 (`:32`), ip-address 3, mac-address 4, switch 5, arp 6 (`:42`), subnetting 7 (`:49`), router 8 (`:50`), dhcp 9 (`:51`), ports 10, tcp-udp 11, nat 12, what-is-dns 13.
- `src/content/registry.test.ts:41-44` (`const SLUGS`, 20 slugs in that order, starting `:41`), `:52` (order check), `:53` (numbers 1 to 20).
- Ready means a file exists: `registry.ts:86` (`Object.hasOwn(lessons, planned.slug)`). The glob is `registry.ts:221`.

Catalogue rows, `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md`:

- `:154` (stop 3): "| 3 | Addresses & the local network | IP Address | Playground | An address in decimal and binary; public vs private vs special | Type any IPv4 address and see its binary form, type and validity |"
- `:155` (stop 4): "| 4 | Addresses & the local network | MAC Address | Flow | A frame on a shared home Wi-Fi network: every device hears it, and only the one whose MAC matches keeps it; the address's two halves explained (no switch yet, which comes next) | Send to one device's MAC vs the broadcast address and see which devices keep it |"
- `:162` (stop 11): "| 11 | Talking across the internet | TCP/UDP | Flow (compare) | TCP's handshake, acknowledgements and resends vs UDP's fire-and-forget | Drop a packet in both lanes: TCP resends it, UDP loses it |"
- Heading `:146`: "## 8. Launch catalog: Networking Concepts (19 lessons)". The count is `:25` and `:71` ("19 lessons") and `:130` ("all 19 lessons"). The track in code has 20 lessons (`networking.ts:4`).

Scene map, `prototypes/d10-scene-map.md`:

- Row 3, `:39`: IP Address, Playground. "Subnetting's bits board (`panel: bits`) for the decimal and binary form. A new address-kind panel (public, private, special) beside it. No map needed: the subnet figure's home devices can carry the addresses." Size: medium.
- Row 4, `:40`: MAC Address, Flow. "dhcp figure, since its laptop, router and phone already share one Wi-Fi with a broadcast ring. It needs one or two more home devices, and each device's 'keeps it / ignores it' light (the phone's 'hears and ignores' exists). No switch, as the catalogue says." Size: medium.
- Row 11, `:44`: TCP/UDP, Flow (compare). "Cheapest: net-map with `tcp:web`, then `udp:call`, in turn ... What the catalogue's 'drop in both lanes' needs: a new compare mode, two lanes playing side by side." Size: medium (in turn) or large (compare mode).
- Notes: `:56` "**Compare mode** is the one new ability that two lessons share: TCP/UDP and Proxies. Design it once, for TCP/UDP, before either is written." `:57` "**A home with more devices** is wanted by MAC Address, ARP and NAT. The dhcp figure already draws three devices on one Wi-Fi. Adding a fourth there is cheaper than adding devices to net-map's home plate."

Neighbour logic (Up next). `src/content/registry.ts:113-125` `neighbors()` returns the nearest available entry before and after. The lesson page uses it at `src/pages/[track]/[lesson].astro:26`.

Current chain, read from the tests where they state it and derived from `neighbors()` where they do not:

- Test, `e2e/site.spec.ts:740`: subnetting → router. `:742`: dhcp → ports. `:744`: what-is-tls → firewalls. `:749`: firewalls shows "Lessons 18 to 20 are coming soon."
- Test, `src/content/registry.test.ts:392-393`: dhcp → ports; what-is-tls → firewalls.
- Derived: osi-model → arp (6); arp → subnetting; router → dhcp; ports → nat (12, because 11 is not ready); nat → what-is-dns; what-is-http → https → tls.
- Once ip-address, mac-address and tcp-udp are ready (derived from `neighbors()`): osi-model → ip-address → mac-address → arp; ports → tcp-udp → nat.

"Coming soon" text, `src/lesson/Explanation.tsx:156-170` (`comingSoon(number, total)`). It reads "Lesson N is coming soon" when one remains and "Lessons N+1 to total are coming soon" otherwise, computed from the total, so it does not change when a stop before it becomes ready. The strings asserted: `src/lesson/LessonConsole.test.tsx:324` and `src/lesson/Explanation.test.tsx:223` ("That's the whole lesson, and the last ready one for now. Lessons 18 to 20 are coming soon."). `src/lesson/Explanation.test.tsx:231` asserts no "for now" or "coming soon" at a track's end. Other copy: `src/lib/hub.ts:13` ('not-ready': 'Not ready yet'). `src/pages/[track]/index.astro:90` ("Lessons not ready yet stay on the route, so you can see what is coming."). `src/pages/tracks.astro:59` ("Coming soon", a planned track's card).

## 2 Documents

### 2a Registry and hosts

File: `src/content/sources.ts`. The list of 324 entries (`id:` lines) spans `:213` to `:2966`. The last entry is `microsoft-azure-inbound-nat` (`:2966`). The file is 3059 lines.

- `:30` "No wildcards."
- `:31-77` `SOURCE_HOSTS`. Allowed hosts, by kind:
  - rfc: `www.rfc-editor.org`, `datatracker.ietf.org` (`:32`)
  - ieee: `standards.ieee.org`, `ieeexplore.ieee.org` (`:33`)
  - iana: `www.iana.org`, `www.internic.net` (`:36`)
  - itu: `www.itu.int` (`:39`)
  - standards-body: html, url, fetch .spec.whatwg.org (`:44`)
  - government, security-reference: `[]` (`:46`, `:48`)
  - internet-registry: `www.icann.org` (`:51`)
  - community: `canonical.com`, `www.baeldung.com` (`:57`)
  - vendor (`:60-75`): `learn.microsoft.com`, `www.cisco.com`, `developers.cloudflare.com`, `docs.paloaltonetworks.com` (`:61`); `support.microsoft.com`, `support.google.com`, `letsencrypt.org` (`:62`); `www.cloudflare.com` (`:65`); `www.paloaltonetworks.com`, `knowledge.workspace.google.com` (`:68`); `man.openbsd.org` (`:71`); `docs.cloud.google.com` (`:74`)
  - cert-objectives: comptia and cisco learning hosts (`:76`)
- Host enforcement: `:176-182`. An empty list reports "no host is allowed yet for <kind>". A host outside the list reports "is not an allowed host for <kind>".
- `standards.ieee.org`: allowed, `:33`. `regauth.standards.ieee.org`: not allowed (no wildcard, not in `:33`). `grep -c "kind: 'ieee'"` returns 0. No ieee source is registered.
- Test list: `src/content/sources.test.ts:236-310` (`expect(Object.keys(SOURCES)).toEqual([`, closing `]);` at `:310`). The job 12 entries are at `:293-309`.

### 2b Per-lesson defining documents

Source lines are `sources.ts`. "No" means no entry (`grep "id: '<id>'"` returns 0).

ip-address:

- RFC 791 `rfc-791` `:335` (yes). RFC 8200 `rfc-8200` `:1123` (yes). RFC 1918 `rfc-1918` `:1148` (yes). RFC 5737 `rfc-5737` `:2472` (yes). RFC 3927 `rfc-3927` `:1313` (yes). RFC 4632 `rfc-4632` `:1175` (yes). RFC 950 `rfc-950` `:2454` (yes). RFC 1122 `rfc-1122` `:213` (yes). RFC 9542 `rfc-9542` `:2693` (yes).
- RFC 4291: no. RFC 6890: no. RFC 8981 and RFC 4941: no.
- Vendor, IP addressing: Cisco `cisco-ip-subnets` `:2507` (yes); Microsoft `microsoft-tcpip-subnetting` `:2499` (yes); Microsoft `microsoft-ipconfig` `:1078` (yes); IANA `iana-ip-parameters` `:1264` (yes). Palo Alto: no IP-address page.

mac-address:

- IEEE 802, IEEE 802.3, IEEE 802-2014 and IEEE RA (OUI) pages: no entry. `standards.ieee.org` is the only allowed IEEE host (`:33`).
- RFC 7042: no. RFC 9542 `rfc-9542` `:2693` (yes; it obsoletes RFC 7042 per `what-is-ip.ts:13`).
- RFC 9724 `rfc-9724` `:1238` (yes; its title is "State of Affairs for Randomized and Changing Media Access Control (MAC) Addresses", `:1241`).
- RFC 826 `rfc-826` `:1132` (yes). RFC 894 `rfc-894` `:1140` (yes).
- Vendor MAC pages (Cisco, Microsoft, Cloudflare, Palo Alto): none found. Closest: `cisco-arp-config` `:2795`, `microsoft-arp-caching` `:2803`, both for ARP.

tcp-udp:

- RFC 9293 `rfc-9293` `:308` (yes). RFC 768 `rfc-768` `:255` (yes). RFC 1122 `rfc-1122` `:213` (yes). RFC 8085 `rfc-8085` `:263` (yes). RFC 5681 `rfc-5681` `:404` (yes). RFC 2018 `:840`, RFC 8985 `:849`, RFC 6298 `:858`, RFC 7413 `:867`, RFC 2914 `:885`, RFC 9000 `:290` (all yes).
- RFC 793: no (RFC 9293 is the registered TCP document).
- IANA `iana-ports` `:344` (yes).
- Vendor TCP-vs-UDP comparison: none by title. Nearest: Microsoft `microsoft-azure-lb` `:457` ("What is Azure Load Balancer?", Layer 4 TCP or UDP), Cloudflare `cloudflare-network-layers` `:449` ("Network Layers"), Microsoft `microsoft-gdk-udp` `:465`. Palo Alto and Cisco: none on TCP, UDP or IP addressing.

### 2c Registry facts for existing lessons

- RFC 2663 `rfc-2663` `:2924` (registered now). RFC 6146: no.
- No MDN page is registered (`grep -n "mdn\|developer.mozilla" sources.ts` empty).
- Registered before job 13 and used by NAT: `cisco-nat-faq` `:2942`, `cisco-nat-configure` `:2950`, `microsoft-azure-snat` `:2958`, `microsoft-azure-inbound-nat` `:2966`.

## 3 What each must agree with

### 3a Example addresses and MACs already in the checked lessons

Counts are the number of lines where the value appears in each file.

- `arp.ts`: 192.168.1.1 (30), 00:00:5E:00:53:01 (6), ff:ff:ff:ff:ff:ff (4), 203.0.113.80 (4), 192.168.1.100 (2), 00:00:5E:00:53:10 (2). First lines: `:9`, `:13`, `:129`, `:79`, `:130`.
- `what-is-ip.ts`: 192.168.1.100 (18), 203.0.113.80 (11), 192.168.1.1 (11), 198.51.100.23 (10), 00:00:5E:00:53:01 (7), ff:ff:ff:ff:ff:ff (4), 192.168.1.0 (3), 198.51.100.1 (2), 00:00:5E:00:53:10 (2), 192.168.1.255 (1), 192.168.0.0, 172.16.0.0, 10.0.0.0 (1 each). First lines: `:153`, `:94`, `:148`, `:93`, `:13`, `:216`.
- `dhcp.ts`: 192.168.1.100 (12), 0.0.0.0 (9), 255.255.255.255 (5), 192.168.1.1 (5), ff:ff:ff:ff:ff:ff (2), 00:00:5E:00:53:11 (1), 00:00:5E:00:53:10 (1). First lines: `:106`, `:104`, `:258`.
- `what-is-dhcp.ts`: 192.168.1.100 (20), 192.168.1.1 (13), 0.0.0.0 (10), 192.0.2.53 (6), 255.255.255.255 (5), 00:00:5E:00:53:10 (3).
- `nat.ts`: 198.51.100.23 (16), 192.168.1.100 (8), 192.168.1.101 (4), 192.0.2.66 (3), 192.168.1.1 (2), 203.0.113.80 (1). First lines: `:75`, `:77`, `:78`.
- `ports.ts`: 203.0.113.80 (4), 192.168.1.100 (1). First lines: `:85`, `:86`.
- `what-is-tcp.ts`: 203.0.113.80 (3), 192.168.1.100 (3). First lines: `:62`, `:63`.
- `what-is-udp.ts`: 203.0.113.90 (5), 192.168.1.100 (4). First lines: `:63`, `:64`.
- `subnetting.ts`: 192.168.1.70 (9), 192.168.1.10 (9), 203.0.113.7 (4), 203.0.113.4 (4), 203.0.113.6 (3), 192.168.1.20 (3), 192.168.1.0 (3), 203.0.113.5, 203.0.113.0, 192.168.1.64, 192.168.1.255, 192.168.1.1 (2 each).
- `router.ts`: 0.0.0.0 (20), 203.0.113.0 (19), 203.0.113.80 (16), 192.0.2.77 (7), 192.168.1.0 (5), 198.51.100.1 (4), 198.51.100.0 (4), 192.168.1.1 (4), 198.51.100.23 (3), 192.168.1.100 (2).
- `firewalls.ts`: 203.0.113.50 (8), 198.51.100.7 (4), 10.0.0.10 (4).
- `what-is-dns.ts`: 198.51.100.7 (10), 198.51.100.40 (9), 192.0.2.20 (7), 192.0.2.53 (4), 192.0.2.10 (4), 192.168.1.100 (3).
- `what-is-http.ts`: 203.0.113.80 (8), 192.168.1.100 (5), 192.0.2.53 (4). `what-is-https.ts`: 198.51.100.7 (9), 192.168.1.100 (5), 192.0.2.53 (4). `what-is-tls.ts`: 198.51.100.7 (2), 192.168.1.100 (2). `what-is-icmp.ts`: 203.0.113.1 (9), 203.0.113.99 (8), 198.51.100.1 (6), 192.168.1.1 (6), 203.0.113.80 (5), 198.51.100.129 (5), 192.168.1.100 (2).
- No checked lesson uses 192.0.2.x for the 2nd /24 except `dns`, `http`, `https`, `dhcp`, `router`. No lesson uses 8.8.8.8.

Note: `2001:db8::80` (IPv6) is used by `what-is-ip.ts:13` and `:582`, `:593`. The MAC value 00:00:5E:00:53:xx appears in `what-is-ip.ts:13`, `what-is-dhcp.ts:13`, `arp.ts:13`, `dhcp.ts:13`. `arp.ts:13-14` says "from the documentation range of RFC 9542 section 2.1.4".

### 3b Line-level wording

Each line below is a checked lesson line the new lessons must not contradict.

- IP address forms and private ranges:
  - `what-is-ip.ts:344`: "The private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. Home routers use port address translation..."
  - `what-is-ip.ts:594`: `{ id: 'fact-private', label: 'Private ranges', value: '10/8, 172.16/12, 192.168/16', cite: [rfc1918('3')] }`
  - `what-is-ip.ts:582`: "IPv6 uses 128-bit addresses (like 2001:db8::80)..."
  - `what-is-ip.ts:289`: "An IPv4 header is 20 bytes..."
  - `what-is-ip.ts:63`: "No standard puts IP at an OSI layer ... so the badge rests on two vendors."
  - `subnetting.ts:17`: "The addresses (RFC 1918 and RFC 5737) are example data ..."
- MAC addresses and broadcast:
  - `what-is-ip.ts:213`: "They use each other's MAC address, a hardware number built into every network card."
  - `what-is-ip.ts:216`: "The ARP request goes to the broadcast MAC address ff:ff:ff:ff:ff:ff, so every device on the network reads it, and only the owner of 192.168.1.1 replies, directly."
  - `arp.ts:129`: `destination: 'ff:ff:ff:ff:ff:ff'`
  - `arp.ts:262`: `{ label: 'Sent to', value: 'everyone: ff:ff:ff:ff:ff:ff', ... }`
  - `arp.ts:467`: "ff:ff:ff:ff:ff:ff, the broadcast address: every device on the network reads it"
  - `arp.ts:497`: "only your own network: routers don't pass the broadcast on ..."
  - `dhcp.ts:258`: `{ label: 'MAC destination', value: 'ff:ff:ff:ff:ff:ff (everyone)', ... }`
  - `dhcp.ts:568`: "the broadcast goes to the hardware address ff:ff:ff:ff:ff:ff, which means everyone"
  - `dhcp.ts:598`: "The phone doesn't hand out addresses, so it ignores the shout."
  - `dhcp.ts:286`: "It names the laptop's MAC address, which is how the phone knows the Offer isn't for it."
- OUI and vendor prefix: no checked lesson states an OUI, a registration authority, or a vendor prefix (grep over `src/content/lessons/*.ts` found none; the word "maker" appears in no lesson). The d10 note "the maker's half" is in the scene map only (`prototypes/d10-scene-map.md:40`).
- Three-way handshake and acknowledgements:
  - `what-is-tcp.ts:144-145`: `value: 'a three-way handshake'`.
  - `what-is-tcp.ts:175`: "Before any data moves, both sides make sure they can hear each other. The laptop says hello and gives a starting number. The server says hello back with its own number and confirms it heard. The laptop confirms too. That's the three-way handshake ..."
  - `what-is-tcp.ts:178`: "SYN means synchronize..." `:182`: "SYN-ACK carries the server's number and acknowledges the laptop's; the final ACK completes it."
  - `what-is-tcp.ts:291`: "... The server writes back: 'got everything up to 120.' That reply is an acknowledgement, an ACK, and the byte numbers are sequence numbers."
  - `what-is-tcp.ts:512`: "Three duplicate ACKs make the sender resend at once ..."
  - `what-is-tcp.ts:587`: "The server sends piece 2 again. This time it arrives ..." (retransmission scene).
- Retransmission (UDP): `what-is-udp.ts:280`: "UDP has no retransmission at all."; `what-is-udp.ts:277`: "With UDP, nobody resends it: there's no ACK to miss ..."; `what-is-udp.ts:101`: "UDP sends a message and forgets it: no hello, no numbering, no resending."
- Connectionless and handshake (UDP): `what-is-udp.ts:144`: `{ label: 'Starts with', value: 'nothing: no handshake', ... }`; `what-is-udp.ts:167`: `{ label: 'Handshake', value: 'none', ... }`; `what-is-udp.ts:497-499`: term `term-connectionless`, name "Connectionless". `what-is-udp.ts:603`: `{ id: 'fact-4', label: 'Versus TCP', value: 'no setup, but no guarantee', ... }`.
- UDP header, 8 bytes: `what-is-udp.ts:146`: `{ label: 'Header', value: '8 bytes: ports, length, checksum', ... }`; `what-is-udp.ts:570`: "The UDP header is four 2-byte fields: source port, destination port, length and checksum."; `what-is-udp.ts:590`: `{ id: 'fact-1', label: 'Header', value: '8 bytes', cite: [RFC768_LENGTH] }`; `what-is-udp.ts:160`: "The UDP header is four fields of 2 bytes each ..."
- Example addresses for TCP and UDP: `what-is-tcp.ts:62-63` and `what-is-udp.ts:63-64` use 192.168.1.100, 203.0.113.80 (TCP) and 203.0.113.90 (UDP, the call server).
- Subnetting and DHCP addresses: `subnetting.ts:365` "Set every host bit to 0 and you get 192.168.1.0"; `subnetting.ts:620` "The link's network address is 203.0.113.4 and its broadcast address is 203.0.113.7."; `what-is-dhcp.ts:268` "With no address, the client uses 0.0.0.0 as its source and sends to 255.255.255.255, the broadcast address."; `what-is-dhcp.ts:317` "Discover goes from 0.0.0.0:68 to 255.255.255.255:67 over UDP..."
- ARP's `192.168.1.x` usage: `arp.ts:232` (hook), `arp.ts:252` ("203.0.113.80 ... default gateway, your router, 192.168.1.1"), `arp.ts:294` ("192.168.1.1 is at 00:00:5E:00:53:01").
- Router's private-address line: `router.ts:527`: "Your home router also swaps the laptop's private address for its own public one on the way out ..."
- NAT's private-address lines: `nat.ts:293` ("192.168.1.100 is a private address, so the router swaps the source ..."); `nat.ts:451` ("Private addresses aren't carried across the internet ..."); `nat.ts:484` ("a private address inside (192.168.1.1) and one public address outside (198.51.100.23)").
- Header citations (RFC 1918 and 5737 named as the example sources): `arp.ts:12`, `what-is-ip.ts:12`, `dhcp.ts:13`, `what-is-dhcp.ts:13`, `ports.ts:14`, `nat.ts:14`, `router.ts:12`, `firewalls.ts:24`, `what-is-tcp.ts:13` (RFC 5737 and RFC 1918), `what-is-udp.ts` (cites RFC 768 and RFC 9293).

## 4 Scene parts

### 4a Bits board (IP address's playground)

- Subnetting's scene: `src/content/lessons/subnetting.ts:191` `figure: 'subnet'`; `:203` `views: ['network']`; `:204` `panel: { type: 'bits' },`.
- Schema: `src/content/schema.ts:266-271` `panelSchema`: `table` `:267`, `rules` `:268`, `bits` `:269`, `labels` `:271`.
- Dispatch: `src/lesson/panels/UnitPanel.tsx:56-59` (bits: `BitsBoard` with the slot's board).
- Board: `src/lesson/panels/BitsBoard.tsx:19` `type Kind = 'addr' | 'mask' | 'net' | 'bcast' | 'cmp'`; `:47` the third row's `cmp` mode; `:174` `<div className="bits">`.
- Schema `src/content/schema.ts:119`: `third: z.strictObject({ who, addr, mode: z.enum(['net', 'bcast', 'cmp']) })`. This is the bits board's third row, not a scene compare mode.
- Panels in code: `src/lesson/panels/` has `BitsBoard.tsx`, `LabelsPanel.tsx`, `RulesPanel.tsx`, `TablePanel.tsx`, `UnitPanel.tsx`, each with a test.

### 4b The dhcp figure

- File: `src/art/scenes/dhcp.ts`. Header `:2-3`: "one home Wi-Fi plate. The router stands at the back with its lease table beside it, the laptop that needs an address on the left, and the phone that overhears on the right."
- MACs: `:21` `LAPTOP_MAC = "00:00:5E:00:53:10"`; `:22` `PHONE_MAC = "00:00:5E:00:53:11"`.
- Parts: laptop `:65`; router `:87`; lease table `:106`; phone `:120`; "The lease table belongs to the router: a short cable joins them." `:132`.
- Broadcast ring: `:17` "The broadcast ring's widest radius"; `:173` `<circle class="dh-ring" id="dh-ring" ...>`; `:162-169` `sceneSvg()` puts the devices on the plate.
- Callouts: laptop `:180` (`"No IP address yet"`); phone `:181` `{ cls: "dh-ignore", text: "Hears it, ignores it", id: "dh-ignore" }`.
- Driver: `src/scenes/drivers/dhcp.ts:19` (comment on the ring reaching the phone, "which lights up and ignores it"); `:59` `const ignores = part('dh-ignore')`; `:152` `ignores.classList.add('on')`.
- Lesson using it: `src/content/lessons/dhcp.ts:173` `figure: 'dhcp'`; `:185` `views: ['network', 'sequence']`; `:186` panel.
- Card spot for DHCP: `src/art/figures/spots.ts:126` `function dhcp()`; `:291` in SPOTS.

### 4c net-map: tcp:web and udp:call

- File: `src/art/scenes/net-map-layers.ts`. `:58` `NET_MAP_BASE_PLACES`; `:61` `NET_MAP_OPTIONAL = ['phone']`; `:67` `NET_MAP_ROUTERS`; `:100` `NET_MAP_LAYERS`.
- Layers: `:101` `http:web`; `:103` `tcp:web` (`web('EXAMPLE.NET', '203.0.113.80 · port 80')`); `:104` `udp:call` (`host('call', 'CALL.EXAMPLE.NET', 'Voice server', '203.0.113.90 · UDP')`); `:105` `ip:web`; `:142` `ports:server`; `:143` `nat:stranger`.
- The key-list test: `src/art/scenes/net-map-layers.test.ts:8` `expect(Object.keys(NET_MAP_LAYERS)).toEqual([`.
- Parts: `src/art/scenes/parts.ts:40` (places, with `plateSites` of each layer); `:61` `layers: Object.keys(NET_MAP_LAYERS)`; `:45-60` cues including `show` (`:55`) and args `NET_MAP_OPTIONAL` (`:59`).
- Validator for the phone part: `src/content/define.ts:265-270`.
- Phone drawing: `src/art/scenes/net-map.ts:382` `const phonePart = ...` `data-base="phone" data-hidden=""`; `:392` the phone at the home plate.
- The lesson that uses tcp:web: `what-is-tcp.ts:99` `figure: 'net-map'`; `:114` `views: ['network', 'sequence']`; `:115` `layers: ['tcp:web']`; `:118` `panel: { type: 'table', table: pieces }`.
- The lesson that uses udp:call: `what-is-udp.ts:102`; `:124`; `:125` `layers: ['udp:call']`; `:128` table `voice`.
- The lesson that uses ip:web: `what-is-ip.ts:133`; `:146`; `:147` `layers: ['ip:web']`.

### 4d Sequence view and compare mode

- Switch: `src/content/schema.ts:300` `views: z.union([z.tuple([z.literal('network')]), z.tuple([z.literal('network'), z.literal('sequence')])])`.
- UI: `src/lesson/ScenePanel.tsx:22` `type View = 'network' | 'sequence'`; `:65` `useState<View>('network')`; `:134` `role="group" aria-label="View"`; `:135-138` the Network and Sequence buttons (`aria-pressed`).
- Compare mode: none found for scenes. `grep -rn "compare"` in `src/content/schema.ts`, `src/engine` and `src/lesson` finds only the BitsBoard `cmp` mode (`schema.ts:119`, `BitsBoard.tsx:19,47,84`). No `lanes` or two-lane layout appears in those files.

### 4e Card spots: how a spot is tested against its `.svg`

- `src/lib/figures.ts:7-16` `FIGURES`: `osi-model`, `subnetting`, `dhcp`, `firewalls`, `router`, `arp`, `ports`, `nat`. No entry for `ip-address`, `mac-address` or `tcp-udp`.
- `src/lib/figures.ts:23-33` `lessonFigure`: a lesson whose first track is How the Internet Works gets a name tile (`:24-30`); others get `FIGURES[slug]()`. `:32` throws "The ${entry.key} lesson is ready and has no figure for its card." Tracks are in array order, with How the Internet Works first (`src/lib/tracks-page.test.ts:6-7`).
- `src/art/figures/spots.ts`: `:183` `routerSpot`; `:212` `arpSpot`; `:248` `portsSpot`; `:270` `natSpot`; `:291` `SPOTS` (`'watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat'`); `:294` `DRAW`; `:297` `spot(kind)`.
- `src/art/figures/figures.test.ts:9` `ALL()`; `:56-80` `EXPECTED` (SHA-256 hashes after `withoutGrain`); `:82-88` "the figures match the mockups" (compares each hash); `:113-119` the Router spot matches `prototypes/d10-router.html` tag for tag; `:122-131` `test.each` for arp, ports, nat: `expect(`${spot(kind)}\n`).toBe(file)` against `prototypes/d11-<kind>-spot.svg`, one lit part (`data-lit`), a set number of `lm-led on`, and `viewBox="36 44 528 372"`.
- A new card needs: a `SPOTS` kind, a `DRAW` entry, a spot function, an `EXPECTED` hash, and a `FIGURES` line (or a `FIGURES` entry for a name-tile-free lesson).

### 4f D11 parts

- Files: `prototypes/d11-part-phone.svg`, `prototypes/d11-part-stranger.svg`, `prototypes/d11-part-server.svg`. Their spots: `prototypes/d11-arp-spot.svg`, `prototypes/d11-ports-spot.svg`, `prototypes/d11-nat-spot.svg`.
- Code: phone `src/art/scenes/net-map.ts:382`; stranger layer `src/art/scenes/net-map-layers.ts:143`; server layer `:142`.
- Test helper: `src/test/svg-groups.ts:23` `PHONE_OPEN`, `:24` `STRANGER_OPEN`, `:25` `SERVER_OPEN`, `:28` `withoutD11`.
- `src/art/scenes/net-map.test.ts:73` removes D11 groups before the hash check (`EXPECTED` at `:26`).
- `prototypes/d11-batch-1.md:5-16` lists the six files and the patch. `:503-511` says how the byte check works.

## 5 Tests that count ready lessons or stops

Current values are in the right column.

Unit tests:

- `src/content/registry.test.ts:41-45` `SLUGS` (20 entries); `:52` order; `:53` numbers 1 to 20; `:55` (every entry unavailable with no lesson files).
- `:194-200` `trackTotals` with `planned: 20`; `:197`, `:200`.
- `:213` `getEntries('networking')` length 20; `:215` the tour length 14.
- `:221-223` every lesson file is available under its slug.
- `:230-233` every ready lesson is one `validateLesson` returned.
- `:390-396` neighbours: `:392` dhcp → ports; `:393` what-is-tls → firewalls; `:395-397` the list of 12 ready `[slug, number]` pairs (`osi-model 1, arp 6, subnetting 7, router 8, dhcp 9, ports 10, nat 12, what-is-dns 13, what-is-http 14, what-is-https 15, what-is-tls 16, firewalls 17`).
- `src/content/factcheck/reports.unchanged.test.ts:20-21`: "there are twenty-two lesson reports and eight re-checks"; `:21` 22 reports, 8 re-checks.
- `src/lib/checked.test.ts:7` "22 ready, 22 checked" (`{ checked: 22, total: 22 }`).
- `src/lib/glossary-site.test.ts:6-7` (22).
- `src/scripts/about-page.test.ts:40-42` (`lessons ready` is the distinct count, and `'22'` at `:42`).
- `src/lib/home.test.ts:127-128` ("14 lessons" and "12 of 20 lessons ready").
- `src/lib/tracks-page.test.ts:26` (`entries` 20), `:28` (`known` 12), `:30` (slots `art1, art6, art7, art8, art9, art10, art12, art13..art17`). Once ip-address, mac-address or tcp-udp is ready, `:30` changes: the slots come from `art${e.number}` (`:31`).
- `src/lib/track.test.ts:18-25` (ready per part `[1, 1, 3, 3, 3, 1]`, lessons per part `[2, 4, 3, 4, 3, 4]`); `:28` (20 numbers); `:29` (12 ready titles); `:30` (`all[1]` is packets, not ready).
- `src/lesson/LessonConsole.test.tsx:455` `getAllByText('Not ready yet')` length 18 (a fixture count); `:318` and `:324` (Firewalls is the next ready, "Lessons 18 to 20 are coming soon.").
- `src/lesson/Explanation.test.tsx:218`, `:223`, `:231`, `:248`.
- `src/components/hub/TrackRoute.test.tsx:75` `entries.length - ready.length`.

E2E:

- `e2e/site.spec.ts:22` and `:75`: `readyLessons()` (dynamic).
- `e2e/support.ts:27-30` `readyLessons()` reads an env value.
- `:262-263` "14 lessons" and "9 of 20" (stale: home now reads 12; `src/lib/home.test.ts:128`).
- `:263` `['14 lessons', '12 of 20 lessons ready']`; `:265` 14 ready items in the tour; `:266` 20 in Networking; `:267` 12 ready.
- `:522` "0 of 20 lessons done · 12 ready"; `:527`; `:528` 14 squares; `:529` 20 squares.
- `:580-599`: 20 stops; `:593` 12 ready stops; `:597` 8 "Not ready yet" stops.
- `:612`, `:762`, `:779`, `:792`, `:811`, `:817` the strip counts with "12 ready".
- `:723-725` "22" lessons ready (About).
- `:729-735` "Lesson 13 of 20" (dns) and "Lesson 6 of 14" (tour).
- `:738-749` Up next chain: `:740` subnetting → router; `:742` dhcp → ports; `:744` what-is-tls → firewalls; `:747-749` "Lessons 18 to 20 are coming soon."
- `:754-755` 404 check for `dns`, `tls`, `http-https`.
- `e2e/lesson.spec.ts:34` `NO_SEQUENCE = new Set(['subnetting', 'osi-model', 'router', 'arp', 'ports', 'nat'])`. Used at `:75`, `:186`, `:192`. S14 listed three slugs; `arp`, `ports`, `nat` were added by job 12.
- `e2e/batch1.ts`: `:9` `PHONE`, `:10` `DESKTOP`, `:11` `RUN_TIMEOUT`, `:14-19` `onlyInDesktopDark(path)` (skips when the path is 404), `:25-30` `playToEnd`, `:46-62` `watchPanel`, `:66` `checkPhoneTable`, `:83` `checkCard(page, slug, stop, aria)`. Imported by `e2e/arp.spec.ts:2`, `e2e/ports.spec.ts:2`, `e2e/nat.spec.ts:2`. `e2e/router.spec.ts` is the earlier per-lesson model.

"Coming soon" and "Up next" strings: see Section 1.

## 6 Collision points

Files that two or three of the three lessons' branches would all touch:

- `src/content/sources.ts`: each lesson appends entries after `microsoft-azure-inbound-nat` (`:2966`, file 3059 lines). `sources.test.ts:236-310` lists every id in order, so each branch edits that list.
- `src/content/sources.test.ts:236-310`: the exact id list. Each lesson adds its own comment block ("Job 12: the new lesson ARP.").
- `src/lib/figures.ts:7-16`: `FIGURES` map. Each Networking lesson with no name tile needs a line.
- `src/art/figures/spots.ts:291` (`SPOTS`), `:294` (`DRAW`), and the function block `:183-270` (new functions go after `natSpot`, `:270-290`).
- `src/art/figures/figures.test.ts:56-80` (`EXPECTED`), `:122-126` (`test.each`, for D11 spots only).
- `src/content/registry.test.ts:41-45` (`SLUGS`, already contains the three slugs), `:390-397` (ready list), `:392-393`.
- Counts: `src/content/factcheck/reports.unchanged.test.ts:20-21`; `src/lib/checked.test.ts:7`; `src/lib/glossary-site.test.ts:6-7`; `src/scripts/about-page.test.ts:40-42`; `src/lib/home.test.ts:127-128`; `src/lib/tracks-page.test.ts:26-30`; `src/lib/track.test.ts:18-30`.
- `e2e/site.spec.ts` counts and the chain at `:262-267`, `:522-529`, `:580-612`, `:723-735`, `:738-749`, `:762`, `:770-817`.
- `e2e/lesson.spec.ts:34` (`NO_SEQUENCE`), if a new lesson has one view.
- Shared art and engine, if a new plate or panel is needed: `src/art/scenes/net-map-layers.ts` (layer keys; test `net-map-layers.test.ts:8`), `src/art/scenes/parts.ts:40-61`, `src/art/scenes/net-map.ts`, `src/test/svg-groups.ts`, `src/engine/tables.ts`, `src/lesson/panels/TablePanel.tsx`, `src/scenes/drivers/net-map.ts`.
- Not collisions: `src/content/lessons/<slug>.ts`, `docs/fact-checks/<slug>.md` and the track file (already lists the slugs).

## 7 Sizes

Lesson files (lines):

- `src/content/lessons/arp.ts`: 580
- `src/content/lessons/ports.ts`: 585
- `src/content/lessons/nat.ts`: 586
- Baseline: `src/content/lessons/router.ts`: 645

Fact-check reports (lines; claim entries in the header JSON's `verdicts`; sources in the header's `sources`):

- `docs/fact-checks/arp.md`: 1088 lines; 91 entries, all ✅; 17 sources. Checked 2026-11-14 by `claude-opus-5-5` (`:2-3` header).
- `docs/fact-checks/ports.md`: 1151 lines; 94 entries, 92 ✅ and 2 ⚠️ (`ports.md:15`, `:18`); 26 sources. Body total: "92 items pass" (`:267`).
- `docs/fact-checks/nat.md`: 1135 lines; 91 entries, 90 ✅ and 1 ⚠️ (`nat.md:78`, "fact-defined"); 15 sources.
- `docs/fact-checks/ports.recheck.md`: 38 lines; 2 entries, both ✅ (`:9-10`); no sources.
- `docs/fact-checks/nat.recheck.md`: 77 lines; 7 entries, all ✅ (`:9-15`).
- Baseline `docs/fact-checks/router.md`: 1054 lines; 100 entries; 16 sources.

Other checks:

- `docs/fact-checks/what-is-udp.md`: 1008 lines; 101 entries; `what-is-tcp.md`: 1323 lines; 123 entries; `what-is-ip.md`: 1109 lines; 97 entries.
- Full reports on disk: 22 (`docs/fact-checks/*.md` without `.recheck`). Re-checks on disk: 8 (firewalls, nat, ports, what-is-imap, what-is-smtp, what-is-ssh, what-is-tls, what-is-udp).

## Not found

- IEEE 802, 802.3, 802-2014 or the IEEE Registration Authority (OUI) pages: no `ieee` source entry (`sources.ts`, `grep -c "kind: 'ieee'"` = 0). No `regauth.standards.ieee.org` in any allowed host list.
- RFC 4291, RFC 6890, RFC 7042, RFC 8981, RFC 4941, RFC 6146, RFC 793: not in `sources.ts`.
- MDN: no entry, no allowed host.
- OUI, registration authority and vendor prefix: no line in the checked lessons.
- Vendor pages on TCP vs UDP, IP address, or MAC address: none by title in `sources.ts` from Cisco, Microsoft, Cloudflare or Palo Alto. The closest are listed in 2b.
- Scene compare mode (two lanes): none in `schema.ts`, `src/engine`, `src/lesson`.
- Lesson files for `ip-address`, `mac-address`, `tcp-udp`, `switch`, `packets`, `proxies`, `load-balancers`, `vpn`: none in `src/content/lessons/`.
- Figure entries in `FIGURES` for the three new slugs: none (`src/lib/figures.ts:7-16`).

Searched: `src/content/sources.ts`, `src/content/sources.test.ts`, `src/content/lessons/*.ts`, `src/content/tracks/*.ts`, `src/content/registry.ts` and its test, `src/lib/*.test.ts`, `src/lesson/*`, `src/art/scenes/*`, `src/art/figures/*`, `src/scenes/drivers/*`, `e2e/*`, `docs/fact-checks/*`, `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md`, `prototypes/d10-scene-map.md`, `prototypes/d11-*`.
