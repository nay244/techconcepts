# S6 scout: facts for batch 2 (What is IP, What is DHCP, What is ICMP)

The repo on branch `revamp`, HEAD 13b222b, clean tree. Read only. Paths are repo-relative. Line numbers are as the files are now. Lesson files are `src/content/lessons/what-is-ip.ts` (short: `ip.ts`), `what-is-dhcp.ts` (`dhcp.ts`), `what-is-icmp.ts` (`icmp.ts`). The track test is `src/content/tracks/how-the-internet-works.test.ts` (short: `track.test.ts`).

Corrections to the batch-1 report (`prototypes/s5-batch-1-facts.md`): https, tcp and dns are cited now (commit 17461e4), so that report's section 1 is out of date. Each of those three files now uses `defineLesson` (`what-is-https.ts:128`, `what-is-tcp.ts:91`, `what-is-dns.ts:98`), and LEGACY_LESSONS has 12 entries, not 15.

## 1. Order

Track `src/content/tracks/how-the-internet-works.ts`, lessons in order (lines 22-64):

| # | Slug | Line | Status now | Export line |
|---|---|---|---|---|
| 1 | what-is-http | 22 | cited | `what-is-http.ts:81` defineLesson |
| 2 | what-is-https | 23 | cited | `what-is-https.ts:128` defineLesson |
| 3 | what-is-tcp | 30 | cited | `what-is-tcp.ts:91` defineLesson |
| 4 | what-is-udp | 31 | cited | `what-is-udp.ts:94` defineLesson |
| 5 | what-is-ip | 32 | legacy | `what-is-ip.ts:338` defineLegacyLesson |
| 6 | what-is-dns | 39 | cited | `what-is-dns.ts:98` defineLesson |
| 7 | what-is-dhcp | 40 | legacy | `what-is-dhcp.ts:345` defineLegacyLesson |
| 8 | what-is-icmp | 41 | legacy | `what-is-icmp.ts:455` defineLegacyLesson |
| 9 | what-is-smtp | 48 | legacy | `what-is-smtp.ts:743` |
| 10 | what-is-pop3 | 49 | legacy | `what-is-pop3.ts` |
| 11 | what-is-imap | 50 | legacy | `what-is-imap.ts` |
| 12 | what-is-ftp | 57 | legacy | `what-is-ftp.ts:538` |
| 13 | what-is-ssh | 58 | legacy | `what-is-ssh.ts:613` |
| 14 | what-is-tls | 64 | legacy | `what-is-tls.ts:399` |

Parts (track file): "Getting the data there" holds TCP, UDP, IP (lines 28-33); "Behind the scenes" holds DNS, DHCP, ICMP (lines 37-42).

`LEGACY_LESSONS` in `src/content/legacy.ts` (lines 29-42, 12 entries):
30 `'what-is-ip'`, 31 `'what-is-dhcp'`, 32 `'what-is-icmp'`, 33 `'what-is-smtp'`, 34 `'what-is-pop3'`, 35 `'what-is-imap'`, 36 `'what-is-ftp'`, 37 `'what-is-ssh'`, 38 `'what-is-tls'`, 39 `'subnetting'`, 40 `'dhcp'` (Networking's DHCP), 41 `'firewalls'`.

Note: the three lines 30-32 are consecutive, and line 40 is the Networking DHCP slug.

## 2. Size of the three

Step titles are the `title:` lines. Counts were read from the source text, then checked against `how-the-internet-works.test.ts:169-170` (step counts) and `:318` (message counts), which agree.

| Measure | what-is-ip (ip.ts) | what-is-dhcp (dhcp.ts) | what-is-icmp (icmp.ts) |
|---|---|---|---|
| Watch steps | 5 (`steps` 76-273): Routing Decision 79, ARP Resolution 96, IP Encapsulation 144, NAT and Forwarding 177, Return Routing 227 | 6 (`steps` 73-284): Client Initialization 76, DHCP Discover 93, DHCP Offer 125, DHCP Request 163, DHCP Acknowledge 196, Lease Renewal 237 | 6 (`steps` 73-391): Echo Request 76, Echo Reply 107, Time Exceeded, Hop 1 140, Time Exceeded, Hop 2 188, Traceroute 235, Destination Unreachable 345 |
| Step facts | 20: lists at 84-89, 101-106, 149-154, 182-187, 232-237 | 24: lists at 81-86, 98-103, 130-135, 168-173, 201-206, 242-247 | 24: lists at 81-86, 112-117, 145-150, 193-198, 240-245, 350-355 |
| Events, messages / table rows / notes | 7 / 5 / 0. Messages at 108, 124, 156, 189, 206, 239, 254. Table rows at 171, 204, 221, 252, 269 | 6 / 12 / 0. Messages at 105, 137, 175, 208, 249, 265. Table rows at 151-157 (5), 190 (1), 225-231 (5), 280 (1) | 14 / 7 / 0. Messages at 88, 119, 152, 167, 200, 214, 247, 262, 278, 293, 309, 324, 357, 372. Table rows at 134, 182, 229, 276, 307, 339, 387 |
| Events in the quiet step | Step 1 has `events: []` (92) | Step 1 has `events: []` (89) | none |
| Learn terms | 9 (276-286) | 8 (287-296) | 8 (394-403) |
| Learn lead / pattern names | lead 275; names 288 | lead 286; names 298 | lead 393; names 405 |
| Go deeper | 5 steps (`deep` at 83, 100, 148, 181, 231) + Learn deep at 292 | 6 steps (80, 97, 129, 167, 200, 241) + Learn deep at 302 | 6 steps (80, 111, 144, 192, 239, 349) + Learn deep at 409 |
| Learn facts | 5 (293-299) | 5 (303-309) | 5 (410-416) |
| "Defined in" fact | `RFC 791 (IPv4), RFC 8200 (IPv6)` (298) | `RFC 2131` (308) | `RFC 792` (415) |
| Practice | 2 questions, 3 options each. `source-swap`: prompt 304, options 305-318, answer 319 = index 1. `loops`: prompt 323, options 324-331, answer 332 = index 0 | 2 questions, 3 options each. `broadcast-discover`: prompt 314, options 315-322, answer 323 = index 0. `renewal`: prompt 327, options 328-338, answer 339 = index 1 | 2 questions, 3 options each. `traceroute`: prompt 421, options 422-435, answer 436 = index 1. `no-reply`: prompt 440, options 441-448, answer 449 = index 2 |
| Scene title | 49 | 48 | 44 |
| Scene views | `['network', 'sequence']` (50) | same (49) | same (45) |
| Scene layers | `['ip:web']` (51) | `[]` (50) | `['icmp:web']` (46) |
| Scene panel table | `written`, id at 24 | `settings`, id at 24 | `answers`, id at 19 |
| Scene log | `eventLog({ kind: 'broadcast', ... })` (55): adds a broadcast legend | same (54) | `eventLog()` (50): no extra legend |
| Scene labels | laptop, url, router (52) | laptop, laptopAddr, url, router (51) | laptop, url (47) |
| Parties | 4 at 57-60 | 2 at 56-57 | 6 at 52-57 |
| Overview hook | 64 | 61 (ends "...Networking Concepts has a DHCP lesson that goes further.") | 61 |
| Page cue (`page:`) | none | none | none |

Other cue kinds used. `src/content/helpers/internet-events.ts` turns message fields into cues (lines 115-125, then `bcast` at 133 and `fast` at 136):
- `status` (from `st`): ip 122, 137, 169, 202, 219, 267; dhcp 119, 150, 189, 221, 262, 278; icmp 101, 132, 165, 180, 227, 337, 370, 385.
- `status-known` (from `known`): ip 138, 170, 203, 220; dhcp 263; icmp 133, 181, 228, 386.
- `status-done` (from `done`): ip 268; dhcp 222, 279; icmp 338.
- `addr`: dhcp 223. `url`: dhcp 224.
- Broadcast kind (from `bcast`): ip 115; dhcp 112, 182.
- `fast` flag: icmp 254, 269, 285, 300, 316.
- Row miss flag: icmp 387 (`miss: true`).
- Not used in these three: `conn`, `lock`, `tray`, `hold`, `page`.

References:
- ip: `RFC 791: Internet Protocol`, `https://www.rfc-editor.org/rfc/rfc791` (ip.ts:47). In SOURCES as `rfc-791` (`src/content/sources.ts:320`).
- dhcp: `RFC 2131: Dynamic Host Configuration Protocol` (dhcp.ts:46). In SOURCES as `rfc-2131` (`sources.ts:311`).
- icmp: `RFC 792: Internet Control Message Protocol` (icmp.ts:42). NOT in SOURCES (grep for "792" finds nothing in sources.ts).
- ip "Defined in" names RFC 8200, which is NOT in SOURCES (grep for "8200" finds nothing).
- RFC 7042 is named in comments only: ip.ts:13 and dhcp.ts:13. It is not a reference.

Example names and addresses. Ranges: RFC 5737 = 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24. RFC 1918 = 10/8, 172.16/12, 192.168/16. RFC 3849 = 2001:db8::/32. MAC range 00:00:5E:00:53:00 to FF is the one the track test accepts (`how-the-internet-works.test.ts:695-699`).

Names:
- `example.net`: ip.ts 7, 52, 60, 66, 217, 219, 221, 230. icmp.ts 7, 44, 56, 57, 63, 70, 79, 82, 101, 110, 163, 211, 238, 241, 242, 259, 290, 321, 335, 352. dhcp: none. Names are not addresses; RFC 2606 is not cited anywhere in the repo.
- `techconcepts.app`, `sam@example.org`: none in the three.

Addresses, IP lesson:
- 192.168.1.100 (laptop): 57, 73, 121, 147, 150, 164, 167, 171, 180, 183, 201, 230, 234, 263, 265, 266, 269. Private, RFC 1918.
- 192.168.1.1 (router): 52, 58, 83, 88, 99, 100, 102, 120, 121, 136. Private.
- 192.168.1.0/24: 86, 292. Private. Also 192.168.1.255 and 192.168.1.100/24 (83).
- 198.51.100.23 (router public address): 20 (constant PUBLIC), 52, 180, 184, 200, 201, 230, 233, 250, 266. Documentation, RFC 5737.
- 198.51.100.1 (provider's router): 15 (comment), 59. Documentation.
- 203.0.113.80 (example.net): 21 (constant EXAMPLE), 60, 69, 73, 82, 85, 147, 151, 167, 294. Documentation.
- 2001:db8::80: 292, 295. Documentation, RFC 3849.
- 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (private ranges named in the text): 181. Private.
- 0.0.0.0/0 (default route): 83. Neither documentation nor private.
- MAC 00:00:5E:00:53:10 (laptop): 18 (constant LAPTOP_MAC), 117. In the RFC 7042 documentation range.
- MAC 00:00:5E:00:53:01 (router): 19 (constant ROUTER_MAC), 99, 104, 132, 135, 136, 153. In the same range.
- MAC ff:ff:ff:ff:ff:ff (broadcast): 100, 103, 118. Broadcast address, not documentation or private.
- The mockup's 02:1a:2b:3c:4d:5e and 02:aa:bb:cc:dd:01 appear only in the header comment (ip.ts:12; dhcp.ts:13). Prose must not contain them (`how-the-internet-works.test.ts:700`).

Addresses, DHCP lesson:
- 192.168.1.100 (offered/leased): constant LAPTOP at 18 (`192.168.1.100:68`), and 128, 131, 148-152, 166, 171, 187-190, 202, 220, 223, 226, 260, 261. Private.
- 192.168.1.1 (router): constant ROUTER at 19 (`192.168.1.1:67`), and 51, 57, 128, 133, 154, 166, 172, 187, 188, 203, 228, 244. Private.
- 192.168.1.0/24: 70. Private.
- 192.0.2.53 (DNS): 128, 133, 148, 155, 204, 229. Documentation, RFC 5737.
- 255.255.255.255 (everyone, the broadcast): constant EVERYONE at 20 (`255.255.255.255:67`), and 80, 97, 100. Limited broadcast, not documentation or private.
- 0.0.0.0 (no address yet): constant NO_ADDRESS at 21, and 80, 82, 97, 99, 167, 169. Unspecified, not documentation or private.
- 169.254.0.0/16 (link-local, "169.254.x.x" at 307): 80. Not one of the listed ranges.
- 255.255.255.0 (mask): 132, 153, 227. A mask, not an address.
- MAC 00:00:5E:00:53:10 (laptop): 13 (comment), 56, 118. In the documentation range.

Addresses, ICMP lesson (no MAC address in this lesson):
- 192.168.1.100 (laptop): constant LAPTOP at 15, and 52. Private.
- 192.168.1.1 (your router): 53, 147, 175, 178, 179, 182. Private.
- 198.51.100.1 (provider's router): 54, 195, 222, 225, 226, 229. Documentation.
- 198.51.100.129 (core router): 55, 271, 274, 275, 276. Documentation.
- 203.0.113.1 (example.net's router): 56, 302, 305, 306, 307, 352, 380, 384, 387. Documentation.
- 203.0.113.80 (example.net): constant EXAMPLE at 16, and 57, 85, 243, 336. Documentation.
- 203.0.113.99 (nobody there): 348, 351, 366, 368, 369, 370, 383, 385. Documentation.

## 3. What rests on each lesson

Unit tests. The track test is the only test that names the three by slug or unit id, apart from the legacy-list and progress tests listed below.

`src/content/tracks/how-the-internet-works.test.ts`:
- 23: PROTOCOLS contains the unit ids 'ip', 'dhcp', 'icmp'. 76: `TOUR.map((l) => l.units[0]!.id)` must equal PROTOCOLS.
- 66-67: part titles. Line 66 `['Getting the data there', ['TCP', 'UDP', 'IP']]`; line 67 `['Behind the scenes', ['DNS', 'DHCP', 'ICMP']]`. These are the track file's titles (lines 32, 40, 41).
- 79-81: "78 Watch steps in all, 28 questions". The three contribute 5, 6 and 6 steps and 2 questions each.
- 116, 118, 119: name / full name / purpose / group / OSI rows (IP, DHCP, ICMP). The row list is 111-126. Lines 130-136 compare the rows: a legacy lesson must match all five fields (131); a cited lesson matches four and must cite its OSI layers (134-135).
- 146-160: the DHCP note. 150 `getLesson('what-is-dhcp')`; 151 `getLesson('dhcp')`; 154 both unit ids equal ['dhcp']; 155 figures `['net-map', 'dhcp']`; 157 the tour's `scene.layers` is `[]`; 158 the hook must end "Networking Concepts has a DHCP lesson that goes further."
- 169-170: step counts ['ip', 5], ['dhcp', 6], ['icmp', 6].
- 192: IP titles. 193-200: DHCP titles. 201-208: ICMP titles.
- 259, 261, 262: pattern names (IP, DHCP, ICMP).
- 277-278: quiet steps. IP Routing Decision: status 'Not local: send to the router' and an idle line. DHCP Client Initialization: status 'On the Wi-Fi, can’t talk yet' and an idle line.
- 292 `['ip:web']`; 294 comment "DHCP stays at home"; 295 `[]` (dhcp); 296 `['icmp:web']`.
- 318: message counts. Index 4 (ip) = 7, index 6 (dhcp) = 6, index 7 (icmp) = 14.
- 401-407: IP table `written` cells. 408-414: DHCP table `settings` cells. 415-423: ICMP table `answers` cells. 425: ICMP `missed` = ['ping .99'].
- 623-624: IP parties, with the comment that the provider's router is the one ICMP finds at hop 2. 626-627: DHCP parties (`Laptop 00:00:5E:00:53:10`, `Your router 192.168.1.1`). 628-635: ICMP parties (six).
- 649-652: IP scene title "One packet, passed from router to router" with labels. 654-657: DHCP scene title "Your laptop joins the network and gets an address". 658: ICMP scene title "Ping and traceroute check the way to example.net".
- 680-684: legend. 681 (ip) and 683 (dhcp) keep a broadcast legend; 684 (icmp) is `[]`.
- 695-699: the set of every MAC in the track must be exactly {00:00:5E:00:53:10, 00:00:5E:00:53:01, ff:ff:ff:ff:ff:ff}.
- 730 (ip), 735 (dhcp), 736 (icmp): legacy expected references (exact label and URL). Used only while the lesson is legacy (750).
- 763: `uncited = { ip: ['RFC 8200'], ssh: [...] }`. Used at 775 only while legacy. A cited IP must have `RFC 8200:` in its references (775 expects []).
- 782: `lessonTitles` must be ['DNS', 'DNS', 'Subnetting', 'TCP', 'TLS/SSL', 'TLS/SSL']. The one 'Subnetting' comes from ip.ts:292 ("the Subnetting lesson goes further"). The DHCP sentences use "a DHCP lesson", which the regex (`[Tt]he`) does not match.
- 1029-1061: ICMP stops. Expected stops at 1057 are ['TTL 1 > router', 'TTL 2 > isp', 'TTL 3 > b', 'TTL 4 > c', 'ECHO REQUEST > c'].
- 1063-1091: ICMP step 5 probe 'TTL 3 > b' (1068-1071).
- 1093-1111: IP overview router callout (1099-1100); DHCP overview callout (1101-1102); DHCP step 4 keeps "no address yet" (1105-1106); DHCP step 5 shows 192.168.1.100 and "Connected" (1107-1108); ICMP overview has no callout (1110-1111).

Other tests:
- `src/content/legacy.test.ts`: 6 TOUR array (contains 'dhcp', 'icmp', 'ip'); 8 test title "12 lessons ... nine of How the Internet Works and three of Networking"; 9 expected list, built with the filter `p !== 'udp' && p !== 'http' && p !== 'dns' && p !== 'tcp' && p !== 'https'`.
- `src/progress/internet-split.test.ts`: 21 size list `[8, 9, 9, 8, 8, 8, 9, 9, 9, 8, 8, 9, 9, 9]`; 20 sizes must equal each entry's maxPosition + 1; 44 `what-is-ip` is absent after the partial split.
- `src/art/scenes/net-map-layers.test.ts`: 8-22 keys list. 13 'ip:web', 15 'icmp:web'.
- `src/art/scenes/net-map.test.ts`: 29 PROTOCOLS (contains 'ip', 'dhcp', 'icmp'); 83-90 for each protocol, the layers with prefix `protocol:` (for 'dhcp' there are none).
- `src/scenes/drivers/net-map.test.ts`: 141 every layer key except 'http:web' starts idle (uses 'ip:web' and 'icmp:web' via the keys). 351 uses the layer 'icmp:web' in a view.
- `src/lib/home.test.ts`, `src/lib/start.test.ts`, `src/lib/track.test.ts`, `src/content/registry.test.ts`, `src/content/sources.test.ts`, `src/content/factcheck/cli.defaults.test.ts`, `src/lib/about.test.ts`: none names these three lessons. about.test.ts:47 and cli.defaults.test.ts:8 name the Networking lesson 'dhcp' only.
- `src/content/lessons/`: there is no test file for the three (only `dhcp.test.ts`, which tests the Networking DHCP).

Art (`src/art/**`):
- `src/art/scenes/net-map-layers.ts:88` `'ip:web': web('EXAMPLE.NET', '203.0.113.80')`; `:100` `'icmp:web': web('EXAMPLE.NET', '203.0.113.80')`; `:82` comment "DHCP has none: it stays at home."
- `src/art/figures/spots.ts:138` is the figure 'dhcp' (Networking); the tour's DHCP uses 'net-map'.

e2e (`e2e/`):
- `e2e/site.spec.ts:778`: `what-is-ip` is 'Not started' after the old-position test (765-800).
- `e2e/site.spec.ts:1173-1180`: test titled "5: a row’s tag is under its value, not under the name (ICMP’s probe that got no answer)"; it opens `bySlug('what-is-icmp')` at Learn (1174) and checks the `tr[data-miss]` cell.
- Generic loops: `readyLessons()` (`e2e/support.ts:33-36`) reads the ready lessons from the built track pages (`e2e/global-setup.ts`). `e2e/lesson.spec.ts`, `reading.spec.ts`, `site.spec.ts` and `visual.spec.ts` use it, so the three are covered without being named.
- `e2e/global-setup.ts:40-42`: each track-page stop must say "Checked" exactly when its slug is off LEGACY_LESSONS. This applies to each stop by slug.
- No e2e spec quotes the IP, DHCP-tour or ICMP words, counts their steps, or uses `what-is-dhcp`. The Step-5 and "DHCP Acknowledge" checks use `/networking/dhcp` or `dhcp` (Networking): `e2e/tablet.spec.ts:13`, `:208` ("Watch · Step 5 of 5"); `e2e/lesson.spec.ts:284-288` and `:345-346`.

Home (`src/lib/home.ts`, `src/pages/index.astro`):
- Nothing from the three. `homeDemo(slug = 'what-is-http', sealedSlug = 'what-is-https')` at home.ts:118; index.astro:21 calls `homeDemo()`. The sealed box reads only https (home.ts:191).
- `homeStops()` (home.ts:222-238) reads track totals only.
- `lessonCheckCounts()` (`src/lib/checked.ts:11-13`) counts cited lessons. index.astro:23-24 and about.astro:39-40 use it. So a move changes the "checked" count shown on Home and About. No test pins a number: about.test.ts:28-40 and checked.test.ts use a computed TOTAL.

Progress (`src/progress/internet-split.ts`):
- :18 `['what-is-ip', 8]` (positions 34-41); :20 `['what-is-dhcp', 9]` (50-58); :21 `['what-is-icmp', 9]` (59-67). The offsets are the sums of the sizes above them in :14-27.

Other lessons and pages that name them:
- No lesson text names the IP, DHCP-tour or ICMP lesson with "The X lesson" (`lessonTitles` only finds Subnetting, from ip.ts:292).
- Comments and docs only: `what-is-dhcp.ts:9` ("Networking Concepts' DHCP lesson"); `plan.md:82` and `:99` (what-is-ip as a sealed-slug fixture for batch 1); `docs/superpowers/plans/2026-11-08-how-the-internet-works-track.md:86, 126, 142`; `prototypes/s5-batch-1-facts.md`.

## 4. The two DHCP lessons

Both share unit id `dhcp`:
- Tour: `src/content/lessons/what-is-dhcp.ts:40` `id: 'dhcp'`. Its slug is set by `src/content/helpers/tour.ts:10` as `` `what-is-${unit.id}` ``.
- Networking: `src/content/lessons/dhcp.ts:250` `slug: 'dhcp'`, `:260` `id: 'dhcp'`, `:257` `figure: 'dhcp'`. Its table id is 'leases' (`:275`), not 'settings'.

Code and tests that treat them together:
- `how-the-internet-works.test.ts:146-160`: one test covers both (names both, validates both, checks both unit ids and figures). Comment 147-149 says nothing keys on a unit id across lessons. I checked that: progress is keyed by slug (`src/progress/store.ts`); Practice picks are React state per console (`src/lesson/LessonConsole.tsx:186-191`) and are not stored; `?step=` counts positions. `Outline.tsx:255` uses unit id as a React key inside one lesson.
- `legacy.test.ts:6` and `:9`: TOUR contains the string 'dhcp', which the filter maps to 'what-is-dhcp'. The expected list also contains the literal 'dhcp' (Networking's slug, line 9).
- `how-the-internet-works.test.ts:23` and `:76`: unit id list for the tour only (`TOUR` is built from the track's entries, so Networking's 'dhcp' is not in it).
- `net-map.test.ts:29`: 'dhcp' as a protocol name. No layer key starts with 'dhcp:'.
- Figure id 'dhcp' vs 'net-map': `src/lib/figures.ts:10` (`dhcp: () => spot('dhcp')`); `src/scenes/drivers/index.ts:11` (`dhcp: dhcpDriver`); `src/art/figures/spots.ts:138`. These serve Networking's lesson only; the tour's `figure: 'net-map'` (`helpers/tour.ts:16`).

Code and tests that tell them apart (by slug):
- `src/content/legacy.ts:31` (`'what-is-dhcp'`) vs `:40` (`'dhcp'`).
- `src/content/registry.ts:215-231` `checkLegacyList` compares `lesson.slug` only (lines 218-228). `:187-188` `listingTracks` compares slugs. `:160` requires the file name to equal the slug.
- `src/content/factcheck/gate.ts:22-24` `reportPath(slug)` = `docs/fact-checks/<slug>.md`. `:31` the report's slug must equal the lesson's slug. `factcheck/sheet.ts:149-165` item keys use `units[${i}]` (index), not unit ids.
- `src/content/factcheck/cli.ts:101-103` finds the lesson by slug and refuses one with origin 'legacy'.
- `how-the-internet-works.test.ts:22` `isLegacy` uses `lesson.slug`.
- `src/progress/internet-split.ts:20` 'what-is-dhcp' vs progress key 'dhcp' (Networking). `internet-split.test.ts:26` and `:76-77` use 'dhcp' with lastTrack 'networking'.
- `about.astro:36-37` and `:149`: `readyLesson('dhcp')` (Networking's sources, "Sources in the DHCP lesson"). `src/lib/about.test.ts:47-50` expects Networking's references: RFC 2131 and RFC 2132.
- `src/content/factcheck/cli.defaults.test.ts:8-10`: `runFactCheck(['dhcp'])` must be refused as legacy. This is the Networking slug.
- `src/content/registry.test.ts:118-126`, `:319`, `:334`, `:419-426`: 'dhcp' as Networking's lesson.
- `e2e/tablet.spec.ts:13` `DHCP = '/networking/dhcp'`; `e2e/site.spec.ts` uses `LESSONS.find(... slug === 'dhcp')` and `bySlug('dhcp')`; `e2e/lesson.spec.ts:284-288` `lessonNamed('dhcp')`.

What breaks or needs a decision when one is cited and the other is still legacy:
- Nothing breaks by slug. The registry, the fact-check gate, progress, and the About page all key on slug.
- `legacy.test.ts:9`: when what-is-dhcp moves, the filter needs `p !== 'dhcp'` so the tour's entry drops out. The literal 'dhcp' (Networking) must stay in the expected list. This is the only line where the two are confused by string.
- `how-the-internet-works.test.ts:146-160` passes whichever way they are cited (both validate by `checkStructure`).
- `cli.defaults.test.ts:8-10` pins Networking's 'dhcp' as legacy. It stays correct until Networking's DHCP moves; it then needs a decision.
- Both would cite RFC 2131, and `rfc-2131` already exists in SOURCES (`sources.ts:311`), so no shared source is added for DHCP.
- A fact-check report is needed per slug: `docs/fact-checks/what-is-dhcp.md` and `docs/fact-checks/dhcp.md` are different files, and neither exists yet (`docs/fact-checks` lists only what-is-dns, http, https, tcp, udp, osi-model, canary).
- `docs/superpowers/plans/2026-11-08-how-the-internet-works-track.md:126` says both `getLesson('what-is-dhcp')` and `getLesson('dhcp')` validate. That is an old plan, not a test.

## 5. Where three branches would collide

| File | Lines that name the three now | What a move edits | Adjacent lines of two lessons |
|---|---|---|---|
| `src/content/legacy.ts` | 30 (ip), 31 (dhcp), 32 (icmp) | Deletes its own line | 30, 31, 32 are consecutive. Every pair of branches touches. Line 40 (Networking 'dhcp') is not one of the three. |
| `src/content/legacy.test.ts` | 6 (TOUR contains 'dhcp', 'icmp', 'ip'); 8 (title: 12 lessons, nine tour, three Networking); 9 (expected list and filter) | Line 8 (the counts in the title) and line 9 (adds `p !== 'ip'`, `p !== 'dhcp'`, `p !== 'icmp'`) | 8 and 9 are consecutive, and every move edits both. |
| `src/content/sources.ts` | 311 (rfc-2131, already present), 320 (rfc-791, already present). No rfc-792 or RFC 8200 entry | Only ip (RFC 8200) and icmp (rfc-792) add entries, before `]);` at 1105 (the batch-1 block starts at 617) | Two branches would append at 1104-1105. DHCP adds none. |
| `src/content/sources.test.ts` | 237 (`'rfc-2131', 'rfc-791'` inside the list); the list is 235-255 | Only ip and icmp add ids, after 254 (`'rfc-8404', 'rfc-9065'`), in the same order as SOURCES | Append point 254-255 is shared. |
| `src/content/tracks/how-the-internet-works.test.ts` | 23, 66-67, 76, 79-81, 116, 118, 119, 130-136, 146-160, 169-170, 192-208, 259, 261, 262, 277-278, 292, 294-296, 318, 401-425, 623-635, 649-658, 680-684, 695-699, 730, 735, 736, 763, 782, 1029-1111 | Line 763 (the `ip` entry in `uncited`) is removed when IP is cited, since a cited IP's references must then include RFC 8200. Lines 730, 735, 736 are used only for legacy lessons and need no edit. | Touching pairs: 169/170 (ip, dhcp / icmp), 200/201 (dhcp / icmp titles), 277/278 (ip / dhcp quiet steps), 294/295/296 (comment / dhcp / icmp layers), 407/408 (ip / dhcp tables), 414/415 (dhcp / icmp tables), 627/628 (dhcp / icmp parties), 657/658 (dhcp / icmp scenes), 683/684 (dhcp / icmp legends), 735/736 (dhcp / icmp references). |

Other files all three would edit:
- Each lesson's own file: `src/content/lessons/what-is-ip.ts`, `what-is-dhcp.ts`, `what-is-icmp.ts`. The tour helper `src/content/helpers/tour.ts` is used by nine legacy lessons (dhcp, icmp, ip, smtp, pop3, imap, ftp, ssh, tls) and is not edited by a move. The cited lessons (dns, http, https, tcp, udp) do not import it (`what-is-dns.ts:1-4`).
- New files: `docs/fact-checks/<slug>.md` (none for the three yet) and `docs/lesson-changes/<slug>.md` (none for the three; `docs/lesson-changes` has what-is-dns, http, https, tcp, udp).
- `src/progress/internet-split.ts` and `internet-split.test.ts:21` pin the sizes 8, 9, 9. These change only if a move changes the number of steps or practice questions.
- Shared docs: `plan.md` (names what-is-ip at :82 and :99), `team.md`, and `docs/direction.md`. No test reads them.

## 6. Not found

- No per-lesson test file for the three (`src/content/lessons/` has `dhcp.test.ts` only, which is Networking's).
- No fact-check report or lesson-changes file for any of the three.
- No SOURCES entry for RFC 792 or RFC 8200 (grep of `792` and `8200` in `src/content/sources.ts`). RFC 7042, RFC 3849, RFC 5737 and RFC 2606 are not SOURCES entries either; RFC 5737 is named in other lessons' comments only.
- No e2e spec quotes the IP, DHCP-tour or ICMP prose, counts their steps, or uses `what-is-dhcp`.
- No Home code reads any of the three.
- No cue kinds `page`, `lock`, `tray`, `conn`, `hold` in the three.
- No code or storage keys on the unit ids 'ip' or 'icmp' across lessons. The only cross-lesson unit-id use is `how-the-internet-works.test.ts:763` (`uncited`), which applies to the tour's lessons only.
- No table id collisions: 'written', 'settings', 'answers' appear once each in the track (the Networking DHCP table is 'leases').
- No lesson text names "the IP lesson" or "the ICMP lesson". The DHCP sentence "Networking Concepts has a DHCP lesson that goes further." is pinned by the track test (158).
