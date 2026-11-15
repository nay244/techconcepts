# S14: Networking Concepts' batch 1, ARP, NAT and Ports (job 12, 2026-11-14)

The scout's report (Haiku), on `revamp` at `84cef62`, saved by the orchestrator as written (the scout's own rules let it write no file). Evidence is path:line.

## Summary

- Track: Networking has 20 stops and 9 ready lessons. ARP is stop 6, Ports 10, NAT 12. All three are planned; no lesson files exist.
- Sizes: Router has 100 claim items, a 645-line lesson file and a 1054-line fact-check report.
- Surprises: `prototypes/s13-networking-facts.md` is stale (Firewalls is stop 17, not 16). About's ready count is de-duplicated (`src/pages/about.astro:39-40`). `src/lib/figures.ts:29` throws for any ready Networking lesson without a card entry. `sources.test.ts`, the count tests, `spots.ts` and `net-map-layers` are shared by all three lessons.
- Not registered: RFC 2663, RFC 6146, any MDN page.

## 1. Track position

Track: `src/content/tracks/networking.ts:26-83`. Part "Addresses & the local network" at :36-37; "Talking across the internet" at :55-56.

- arp: stop 6, `networking.ts:42`. ports: stop 10, `:58`. nat: stop 12, `:60`.
- Positions: `src/content/registry.test.ts:42-46` (SLUGS), :50-53 (numbering).
- Ready = file present: `src/content/registry.ts:86`; globbed at :221. No arp.ts, nat.ts or ports.ts exists.
- Catalogue rows, `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md`:
  - :157 ARP: "| 6 | Addresses & the local network | ARP | Device table (ARP cache) | "Who has 192.168.1.1?" sent to all; one reply; the cache fills | Send again with a full cache (no broadcast), then after clearing it |"
  - :161 Ports: "| 10 | Talking across the internet | Ports | Device table (listening ports) | Connections arriving at a server's ports and reaching the right service; common ports | Open or close a port, then try connecting on 22, 80, 443 and 3389 |"
  - :163 NAT: "| 12 | Talking across the internet | NAT | Device table (NAT table) | The router rewriting private address:port pairs into its one public address | Add a second laptop visiting the same site and watch the table assign a new public port |"
  - Router row :159 (Device table, routing table). "Device table" defined at :94. Heading :146 says "(19 lessons)"; the track has 20 and `networking.ts:4` says 20.
- Router's entry: `networking.ts:50`, `{ slug: 'router', title: 'Router' }`, planned since `f548df0`; Router's merge `8585aef` did not touch `networking.ts`.
- Router's commits: 278b775, c0bf1e9, 744dcd6, f0593ce, 4f6dee9, 2a5ee78, fa11a93, 8c62e2d, 7537e5b, 5f4a5cf (lesson file, +645), 33a65b9, d0f8e70, 66f0aca, 2ae8ac3, a01d77c, dce9643 (sources +50, six documents).
- Files in merge `8585aef` (40): the lesson file, `router-fixture.ts`, `define.router.test.ts`, `define.ts`, `schema.ts`, `sources.ts` (+50), `sources.test.ts`, `registry.test.ts`, `factcheck/reports.unchanged.test.ts`, `lib/checked.test.ts`, `lib/figures.ts` (+1), `lib/figures.test.ts`, `lib/home.test.ts`, `lib/track.test.ts`, `lib/tracks-page.test.ts`, `lib/glossary-site.test.ts`, `scripts/about-page.test.ts`, `art/figures/spots.ts`, `figures.test.ts`, `art/scenes/net-map*.ts`, `art/scenes/parts.ts`, `engine/tables.ts`, `engine/timeline.ts`, `lesson/panels/TablePanel.tsx` and test, `table.css`, `LessonConsole.test.tsx`, `LogPanel.test.tsx`, `scenes/drivers/net-map.ts` and test, `e2e/router.spec.ts` (new), `e2e/site.spec.ts`, `e2e/lesson.spec.ts`, `docs/fact-checks/router.md` (new).

## 2. Documents

Registry: `src/content/sources.ts` (302 ids). `SOURCE_HOSTS` at :30-76 ("No wildcards" at :30). Host check :176-182.

Allowed hosts: rfc `www.rfc-editor.org`, `datatracker.ietf.org` (:32); iana `www.iana.org`, `www.internic.net` (:36); vendor (:60-75) `learn.microsoft.com`, `www.cisco.com`, `developers.cloudflare.com`, `docs.paloaltonetworks.com`, `support.microsoft.com`, `support.google.com`, `letsencrypt.org`, `www.cloudflare.com`, `www.paloaltonetworks.com`, `knowledge.workspace.google.com`, `man.openbsd.org`, `docs.cloud.google.com`; community `canonical.com`, `www.baeldung.com` (:57); internet-registry `www.icann.org` (:51); ieee `standards.ieee.org`, `ieeexplore.ieee.org` (:33), no ieee source registered. No mozilla host.

- **ARP:** rfc-826 (:1132-1137, defining), rfc-5227 (:1229-1235), rfc-1122 (:213-218, page anchors only), rfc-894 (:1140), rfc-4861 (:1193), rfc-9542 (:2693), rfc-3927 (:1313); vendor microsoft-arp (:1288), cisco-dai (:1304). Not registered: IEEE 802.3.
- **NAT:** rfc-3022 (:1157), rfc-4787 (:299), rfc-1918 (:1148), rfc-5508 (:2787), rfc-8445 (:482), rfc-4632 (:1175). Not registered: RFC 2663, RFC 6146. No vendor NAT page.
- **Ports:** iana-ports (:344), rfc-6335 (:582), rfc-9293 (:308), rfc-768 (:255), rfc-1122 (:213); optional rfc-8085 (:263), rfc-9868 (:491). No vendor port page.
- Router's six new entries (`dce9643`): cisco-route-selection, cisco-gateway-last-resort, cisco-how-router-works, cisco-what-is-routing, paloalto-layer-3-vs-7, rfc-5508.

## 3. What each must agree with

**ARP** (`src/content/lessons/what-is-ip.ts`, checked):

- :213 "The laptop knows the router is 192.168.1.1, but not its MAC. So it calls out to the whole house, 'Who has 192.168.1.1?', and the router answers, 'That's me, at 00:00:5E:00:53:01.' That's **ARP**, and a call to everyone is a **broadcast**."
- :216 broadcast MAC ff:ff:ff:ff:ff:ff; "only the owner of 192.168.1.1 replies, directly. The laptop keeps the answer in its ARP cache for a short while."
- Steps: :243 tag 'WHO HAS?' (info :255 "ARP: who has 192.168.1.1? Tell 192.168.1.100"); :263 tag 'IS AT' (info :274 "ARP: 192.168.1.1 is at 00:00:5E:00:53:01"). Facts :232-235; fact-arp :611-615.
- MACs: :91 LAPTOP_MAC 00:00:5E:00:53:10; :92 ROUTER_MAC 00:00:5E:00:53:01; :12-13 cites RFC 9542's documentation range.
- Elsewhere: `subnetting.ts:556` ("finds the printer's hardware address with ARP"); `what-is-dhcp.ts:531` ("an ARP probe for their new address"); `what-is-icmp.ts:609`, :725; `dhcp.ts:258`, :568 broadcast MAC ff:ff:ff:ff:ff:ff.

**NAT** (`what-is-ip.ts`, step "NAT and Forwarding" :337-411):

- :341 "192.168.1.100 is a **private address**... The router swaps it for its own **public address**, 198.51.100.23, and notes the swap."
- :344 "The private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. Home routers use port address translation: many devices share one public address and are told apart by port numbers in the NAT table."
- :360-361, :383 ('NAT: 192.168.1.100 → 198.51.100.23, TTL 63'), :418, :594 fact-private, :630-633 fact-nat, :643-644 fact-outside ("can't start a conversation, unless a port is forwarded").
- Router: `router.ts:290` labels '192.168.1.1 inside\n198.51.100.23 outside' (same at `what-is-ip.ts:148`); `router.ts:527` deep-nat "Your home router also swaps the laptop's private address for its own public one on the way out, and back on anything that returns, error messages included."; `router.ts:511` cites RFC 3022 §2.2.
- `firewalls.ts:268` "The web server's address, 10.0.0.10, is private, so in real life the visit reaches it through NAT."; :427 "From 10.0.0.10 port 443" (its own scene; the tour's server is 203.0.113.80).
- `what-is-udp.ts:343` "Your home router remembers that pair for a while."

**Ports:**

- TCP (`what-is-tcp.ts`): :164 "a page from example.net, port 80"; :193 "192.168.1.100, port 50422"; :198 "203.0.113.80, port 80"; :897-900 fact-ports "80 HTTP, 443 HTTPS, 22 SSH, 25 SMTP"; :12-13 ephemeral port.
- UDP (`what-is-udp.ts`): :146; :165-166 ports 50900 and 16384; :348-349; :599-600 "53 DNS, 67/68 DHCP, 123 NTP, 161 SNMP, 443 HTTP/3 (over QUIC)".
- DNS (`what-is-dns.ts`): :209 "UDP port 50611"; :214 "192.0.2.53, UDP port 53"; :700-701 "UDP 53, TCP 53".
- HTTP (`what-is-http.ts`): :125 "TCP 80 (HTTPS uses 443)"; :172 "UDP to port 53"; :236 "a temporary port of its own (here 50310) and connects to port 80"; :248-249; :672 "80 (HTTPS: 443)".
- HTTPS (`what-is-https.ts`): :170 "TCP 443"; :219 DoH 443, DoT 853; :284 "HTTPS uses **port 443** instead of 80"; :287 QUIC on UDP 443; :305-306 "192.168.1.100, port 50812" to "198.51.100.7, port 443"; :773-776.
- TLS (`what-is-tls.ts`): :168 "techconcepts.app, port 443"; :14-15 ephemeral; :675 "TCP port 443".
- DHCP (`dhcp.ts`): :235 "UDP 67 (server), UDP 68 (client)"; :251; :256-257; :396; :507 fact-ports; :544 "from port 67 to port 68". `what-is-dhcp.ts:235`, :818-819.
- Firewalls (`firewalls.ts`): :180 column "Port"; :264 "Port 443 is HTTPS."; :273 "TCP port 443 from 203.0.113.50"; :298 "Port 22 is SSH"; :377 "Port 23 is Telnet."; :597-600 "TCP 443 HTTPS, TCP 22 SSH, TCP 23 Telnet".
- Other tour lessons: FTP `what-is-ftp.ts:217`, :402-405, :771, :811-812 (TFTP UDP 69); SMTP `what-is-smtp.ts:145`, :1098; IMAP `what-is-imap.ts:927-928`; POP3 `what-is-pop3.ts:141`; SSH `what-is-ssh.ts:1056`; ICMP `what-is-icmp.ts:189`.

**Example data:** laptop 192.168.1.100 (`router.ts:67`; `what-is-ip.ts:153`; `net-map-layers.ts:47`); home router 192.168.1.1 (`what-is-ip.ts:154`); laptop MAC 00:00:5E:00:53:10, phone MAC …:11 (`src/art/scenes/dhcp.ts:21-22`; `dhcp.ts:100-101`); public router 198.51.100.23 (`router.ts:68`); provider 198.51.100.1 (`router.ts:159`); example.net 203.0.113.80 (`router.ts:69`; `net-map-layers.ts:87`); techconcepts 198.51.100.7 (`net-map-layers.ts:88`); lost 192.0.2.77 (`router.ts:70`); voice 203.0.113.90 (`net-map-layers.ts:90`); resolver 192.0.2.53 (`net-map.ts:358`); name servers 192.0.2.10, 192.0.2.20, 198.51.100.40 (`net-map-layers.ts:96-100`). Plate ports: `net-map-layers.ts:87` port 80; :88 port 443; :125 port 21; :126 port 22; :76-83 mailbox 995/993. DHCP figure: "HOME WI-FI · 192.168.1.0/24" (`src/art/scenes/dhcp.ts:163`); router "192.168.1.1" (:178).

## 4. Scene parts

- net-map (`src/art/scenes/parts.ts:39-63`): cues (:44-57) status, conn, page, lock, tray, status-known, status-done, addr, url, drop, hide; args (:58) drop takes isp, a, b, c, d; hide takes resolver only; layers (:59); start (:62). Driver `src/scenes/drivers/net-map.ts:281-302`, drop at :285. Router uses hide resolver (`router.ts:291`), drop a (:133), status (:223, :261), status-done (:223).
- Home devices in net-map: laptop and home router only (`src/art/scenes/net-map.ts:343`); base places `net-map-layers.ts:50`; internet routers `net-map.ts:196-200`; resolver cabinet :358.
- DHCP figure (`parts.ts:11`): places laptop, router, phone; no cues or layers. Drawn in `src/art/scenes/dhcp.ts:2-5` (laptop left, phone right, router back with lease table); phone at :119-120, :168.
- Device table (`src/lesson/panels/TablePanel.tsx`): owner "by" :33, :45 (`tpanel__by`); candidates and keys :68-72 (`data-candidate`, `data-miss`); "(a match)" :89; no-match row :96-101. Engine `src/engine/tables.ts:56-121`; ops (`schema.ts:201`) add, update, remove, match, clear, replace; by at `tables.ts:82`. Drop: note glyph 'dropped' (`schema.ts:149-150`, :193); DROPPED mark `net-map.ts:322-324`.
- What is IP's ARP step: figure net-map (`what-is-ip.ts:133`), layers ip:web (:147); WHO HAS? and IS AT messages with bcast (:249), mapped to kind broadcast (`src/content/helpers/internet-events.ts:133`); the driver spreads a ring over the home plate (`net-map` driver :14, :415-426); legend "Broadcast to everyone" (`what-is-ip.ts:151`).
- Card spots (`src/art/figures/spots.ts`): routerSpot :182-209, title "ROUTING TABLE · NEXT HOP" at :208; SPOTS :211; DRAW :214; spot() :217. Lesson mapping `src/lib/figures.ts:7-13`; lessonFigure :20-31, throws at :29.
- Spot tests: `figures.test.ts:56-75` (EXPECTED; spot:router at :74); :81 loop; :97-106 Router spot checks; :109-114 compares with `prototypes/d10-router.html` by the regex `class="iso-svg lm-svg lm-router"`. `src/lib/figures.test.ts:31-35` tests Router's card. A new lesson's card needs a SPOTS kind, a DRAW entry, a spot function, an EXPECTED hash and a FIGURES line.

## 5. Tests that count ready lessons or stops

Unit:

- `registry.test.ts:42-46` (SLUGS, 20); :50-53 (order); :78 (ARP's part); :197-200 and :213 (planned 20); :396-397 nine ready entries (osi-model 1, subnetting 7, router 8, dhcp 9, what-is-dns 13, what-is-http 14, what-is-https 15, what-is-tls 16, firewalls 17); :170-171, :185 fixture neighbours; :403 neighbour chain (dhcp's next becomes ports once ports is ready).
- `factcheck/reports.unchanged.test.ts:20-22` ("nineteen lesson reports and six re-checks").
- `lib/checked.test.ts:7` ("19 ready, 19 checked"). `lib/glossary-site.test.ts:6-7` (19). `scripts/about-page.test.ts:39-43` ("lessons ready" 19).
- `lib/home.test.ts:127-128` ("14 lessons", "9 of 20 lessons ready").
- `lib/tracks-page.test.ts:14-15` (tour 14); :26-30 (20 entries, 9 known, slots art1, art7, art8, art9, art13..art17).
- `lib/track.test.ts:18-25` (ready per part 1, 0, 3, 1, 3, 1); :28 (20 numbers); :29 (nine titles); :30 (packets).
- `lib/hub.test.ts:102` is a fixture, not live. `lesson/LessonConsole.test.tsx:49` fixture; :455 "Not ready yet" count 18.
- `sources.test.ts:235-304`: the exact id list; job 11's entries end at :303.

E2E (`e2e/site.spec.ts`): :22 and :75 dynamic (`readyLessons()`); :262-263 ("14 lessons", "9 of 20"); :522-527 and :580-612 ("9 ready", 20 stops, 11 Not ready yet); :723 ("19 lessons ready"); :729-735 ("Lesson 13 of 20", "Lesson 6 of 14"); :739-748 Up next chain (subnetting → router :740, dhcp → what-is-dns :742, tls → firewalls :744, "Lessons 18 to 20 are coming soon." :747-748); :754 404 check for dns, tls, http-https; :762-882 done counts. `e2e/lesson.spec.ts:34` NO_SEQUENCE = subnetting, osi-model, router (a new lesson with a one-view scene joins it). Per-lesson spec model: `e2e/router.spec.ts` (:12 PATH; :15-19 beforeEach, d1440-dark only, skips on 404; tests :68, :83, :98, :169, :185 card on /networking).

## 6. Collision points

- `src/lib/figures.ts:7-13` (FIGURES); `src/art/figures/spots.ts:211`, :214, :217 (new functions after routerSpot); `src/art/figures/figures.test.ts:56-75` (EXPECTED hashes).
- `src/content/sources.ts` (last entry rfc-5508, :2787-2795); `src/content/sources.test.ts:235-304`.
- Every count test in §5, and `registry.test.ts:396-397`, :403.
- net-map: `src/art/scenes/net-map-layers.ts:86-128` (plates), `net-map-layers.test.ts:8` (exact key list), `parts.ts:39-63`, only if a lesson adds a plate. Shared engine and panel: `src/engine/tables.ts`, `TablePanel.tsx`, `scenes/drivers/net-map.ts`, `define.ts`, `schema.ts`, only if a lesson needs a new ability.
- E2E: `e2e/lesson.spec.ts:34`; `e2e/site.spec.ts` counts and chain.
- Not collisions: `src/content/lessons/<slug>.ts` and `docs/fact-checks/<slug>.md` are per lesson; `src/content/legacy.ts` does not exist.

## 7. Sizes (Router, for comparison)

- Claim sheet 100 items; lesson file 645 lines; fact-check report 1054 lines.
- Scene: 5 steps (`router.ts:323-405`), 1 table, 1 note, 3 legend entries (:295-299), network view only (:288).
- Learn: 1 lead; 10 terms (:436-490); 1 pattern, 4 names (:497-500); 2 why; 3 deep; 10 facts (:532-573). Overview 6 facts (:313-318). Practice 3 questions.
- 17 distinct cited source ids; 6 new registry entries.
- Track limits (`networking.ts:15-25`): steps 4-6; facts 2-4 a step; practice 2-3; learn terms 3-10; pattern names 2-6; narrative 120 words; hook 80; deep 90.
