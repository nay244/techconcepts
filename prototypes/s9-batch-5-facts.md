# S9 scout: facts for batch 5 (DHCP, Subnetting, Firewalls)

Repo on branch `revamp`, read only except this file. Paths are repo-relative; line numbers are as the files are now. Short names: `dhcp.ts` = `src/content/lessons/dhcp.ts`, `subnetting.ts` = `src/content/lessons/subnetting.ts`, `firewalls.ts` = `src/content/lessons/firewalls.ts`, `what-is-dhcp.ts` = `src/content/lessons/what-is-dhcp.ts` (the checked tour lesson). Each lesson's own test is `<slug>.test.ts` beside it.

All three are in the legacy shape today: `LEGACY_LESSONS` in `src/content/legacy.ts` lists them (lines 30-32), and each file calls `defineLegacyLesson`. None has a fact-check report (`docs/fact-checks/dhcp.md`, `subnetting.md`, `firewalls.md` do not exist) or a change list (`docs/lesson-changes/` has none for them).

## 1. Order and track

Track: `src/content/tracks/networking.ts`, id `networking` (line 9), type `concept` (line 10), title `Networking Concepts` (line 11). Its limits (lines 15-25): steps 4-6, factsPerStep 2-4, practiceQuestions 2-3, optionsPerQuestion 2-4, learnTerms 3-10, patternNames 2-6, narrativeWords 120, hookWords 80, deepWords 90. The tour track inherits them (`src/content/tracks/how-the-internet-works.ts:16`).

| Lesson | Position in Networking (of 19) | Part (`networking.ts`) | Line | Status |
|---|---|---|---|---|
| `subnetting` | 7 | "Getting between networks" (lines 45-53), 1st | 49 | legacy (`subnetting.ts:127`) |
| `dhcp` | 9 | "Getting between networks", 3rd | 51 | legacy (`dhcp.ts:249`) |
| `firewalls` | 16 | "Protecting & scaling traffic" (lines 72-81), 1st | 76 | legacy (`firewalls.ts:22`) |

The 19-lesson order is `networking.ts:31-79`: osi-model 1, packets 2, ip-address 3, mac-address 4, switch 5, arp 6, subnetting 7, router 8, dhcp 9, ports 10, tcp-udp 11, nat 12, dns 13, http-https 14, tls 15, firewalls 16, proxies 17, load-balancers 18, vpn 19. Only four of the 19 have a file in `src/content/lessons/`: osi-model, dhcp, subnetting, firewalls. The other 15 are listed but not built (`src/content/registry.test.ts:53-59` expects every entry unavailable when no lesson is passed).

The tour has its own DHCP: `what-is-dhcp` at `src/content/tracks/how-the-internet-works.ts:40` (part "Behind the scenes", lines 36-43). Its tour unit is also named `dhcp` (`what-is-dhcp.ts:191`), the same unit id as `dhcp.ts:260`. `src/content/tracks/how-the-internet-works.test.ts:146-155` says sharing that id is deliberate.

Certification tracks: none has lessons. The only certification entry is the planned CompTIA A+ card (`src/content/tracks/index.ts:25-34`, `type: 'certification'`, no parts). No track file contains `objectives` (grep of `src/content/tracks/`), so `checkUnpathedKinds` (`src/content/factcheck/gate.ts:236-252`) has nothing to refuse for these lessons. No glossary file mentions DHCP, subnetting or firewalls (grep of `src/content/` shows none in `glossary.ts`).

Cert tags (lesson tags, not objective mappings), defined in `src/content/certs.ts:7-13` (`a-plus`, `network-plus`, `security-plus`, `cysa-plus`, `ccna`, `helpdesk`, `soc-analyst`):
- `dhcp.ts:254`: `certTags: ['a-plus', 'network-plus', 'ccna', 'helpdesk']`
- `subnetting.ts:132`: `certTags: ['network-plus', 'ccna']`
- `firewalls.ts:27`: `certTags: ['network-plus', 'security-plus', 'ccna', 'soc-analyst']`
- `what-is-dhcp.ts:182`: `certTags: []`

Shape against the checked tour lesson `what-is-dhcp.ts` (cited):

| Field | `what-is-dhcp.ts` (cited) | `dhcp.ts` | `subnetting.ts` | `firewalls.ts` |
|---|---|---|---|---|
| Figure | `net-map` (line 185) | `dhcp` (line 257) | `subnet` (line 135) | `firewall` (line 29) |
| Scene views | network, sequence (line 200) | network, sequence (line 271) | network only (line 149) | network, sequence (line 40) |
| Scene title | "Your laptop joins the network and gets an address" (line 199) | "Home Wi-Fi network" (line 270) | "Office network · 192.168.1.0/24" (line 148) | "Office firewall · web server 10.0.0.10" (line 39) |
| Panel below scene | table `settings` (line 204) | table `leases` (lines 272-288) | `bits` board (line 150) | rules `Rule list` (lines 41-58) and `Connections it remembers` (lines 59-74) |
| Log | `eventLog()` (line 205) | "Event log", 6 columns (lines 289-304) | "Working", 4 columns (lines 151-165) | "Firewall log", 5 columns (lines 76-93) |
| Parties | 2: laptop, router (lines 206-209) | 3: laptop, router, phone (lines 305-309) | none (line 166) | 4: visitor, admin, firewall, web server (lines 94-99) |
| Unit `group` | `'app'` (line 195) | none | none | none |
| OSI badge | `'spans'` (line 196) | `[7]` (line 264) | `[3]` (line 142) | `[3, 4]` (line 36) |
| Lesson `backing` / units' `backing` | yes (lines 186-188, 197) | not a cited field | not a cited field | not a cited field |
| Start cues, labels | none (line 202-203 labels, `start: []`) | none | none | none |
| Page cues (`page:` on the figure) | none | none | none | none |
| Calculator | none | none | engine's `calc` and `compare` notes (`src/content/helpers/subnet-events.ts`) | engine's `evaluateRules` (`src/content/helpers/firewall-events.ts`) |
| Interactive parts | Watch, Learn, Practice | Watch, Learn, Practice; lease table | Watch, Learn, Practice; bits board | Watch, Learn, Practice; rule list that re-orders at step 6 |
| Tables | one panel table (settings); its rows ride on messages (`what-is-dhcp.ts:443-447, 516, 593-597, 698`) | two table events in the log (`lease-add` line 438, `lease-renew` line 480) | none | rules table (3 rows, `firewalls.ts:44-58`), connections table (`firewalls.ts:60-74`) |

Shape facts that differ from the tour:
- The tour DHCP plays on the network map with no DHCP figure (`what-is-dhcp.ts:185`; `how-the-internet-works.test.ts:156` says "with no server plate of its own"). The legacy DHCP has its own figure (`dhcp.ts:257`).
- Subnetting has no messages, no packets and no Sequence view: `subnetting.ts:149` `views: ['network']`; `subnetting.test.ts:213-223` asserts the toggle is hidden.
- The packets helper (`src/content/helpers/packets.ts`) is imported only by `dhcp.ts` (grep of `src/`), so DHCP is the only lesson that builds Ethernet/IP/UDP/DHCP frames.

## 2. Size of each

Line counts: `dhcp.ts` 575 (test `dhcp.test.ts` 116); `subnetting.ts` 920 (test 402; `STATED` block 570-915); `firewalls.ts` 297 (test 377). For scale, the tour `what-is-dhcp.ts` is 953 lines and has no test of its own (`how-the-internet-works.test.ts` covers it).

| Measure | `dhcp.ts` | `subnetting.ts` | `firewalls.ts` | `what-is-dhcp.ts` (tour, for scale) |
|---|---|---|---|---|
| Watch steps (count; title lines) | 5: DHCP Discover 328, DHCP Offer 357, DHCP Request 386, DHCP Acknowledge 414, Lease Renewal 443 (`steps:` 325-483) | 6: Network and Host Portions 183, Subnet Mask 232, Network and Broadcast Addresses 263, Borrowing Bits 317, Local vs. Remote Delivery 388, Point-to-Point Subnet 430 (`steps:` 180-477) | 6: Rule Evaluation 116, First-Match Rule 131, Source Filtering 146, Default Deny 160, Stateful Inspection 174, Rule Shadowing 188 (`steps:` 113-204) | 6 (`steps:` 259-705) |
| Events in the log | 8: 6 messages (lines 340, 369, 397, 425, 454, 467) and 2 table events (`lease-add` 438, `lease-renew` 480) | 17 note events, one per log row (lines 198, 209, 217, 244, 251, 275, 283, 300, 332, 340, 348, 366, 406, 416, 442, 450, 463); no messages, no table events | 11: 6 messages (127, 142, 156, 170, 184 reply, 201), 4 table events (2 `conns` adds from allowed visits made by `visit()` at `firewall-events.ts:111-147`, plus 2 rule-list table events from the change at line 200), 1 note (the change, line 200) | 6 messages (lines 348, 419, 494, 566, 652, 675); rows attached to messages |
| Messages with sizes | 6, all `342 B` (`dhcp.ts:223` `formatBytes`; comment `dhcp.ts:86`; `dhcp.test.ts:47`) | none | none (the log has no size column, `firewalls.ts:80-86`) | size shown as `'—'` on every message (`what-is-dhcp.ts:366, 438, 512, 585, 669, 693`), because "no source states one" (`what-is-dhcp.ts:15`) |
| Terms in Learn | 8 (lines 487-494) | 10 (lines 481-490) | 8 (lines 208-215) | 10 (lines 715-774) |
| Learn facts | 6 (lines 503-508) | 7 (lines 499-500: six facts `/25`-`/30` built by a map, plus "Defined in") | 5 (lines 224-228) | 14 (lines 818-898) |
| Facts per step | 4, 4, 3, 3, 3 = 17 (lines 334-337, 363-366, 392-394, 420-422, 449-451) | 4 × 6 = 24 (lines 188-196, 237-242, 268-273, 322-330, 393-404, 435-440) | 4, 4, 3, 3, 3, 4 = 21 (lines 122-125, 137-140, 152-154, 166-168, 180-182, 194-197) | 4 × 6 = 24 |
| Overview facts | 6 (lines 317-322) | 5 (lines 173-177) | 5 (lines 106-110) | 5 (lines 232-256) |
| Learn lead / pattern / why / Go deeper | lead 485; pattern names 497, note 498; why 500; deep 501 | lead 479; pattern names 493, note 494; why 496; deep 497 | lead 206; pattern names 218, note 219; why 221; deep 222 | lead 707-711; pattern 776-781; why 782-793; deep 794-815 |
| Practice | 3 questions, 3 options each; answers `[0, 1, 0]` (lines 531, 551, 570) | 3 questions, 3 options each; answers `[1, 0, 2]` (lines 519, 541, 563) | 3 questions, 3 options each; answers `[0, 0, 1]` (lines 249, 268, 287) | 2 questions, 3 options each; answers `[0, 1]` (lines 926, 948) |
| Narrative words per step (limit 120) | 62, 50, 41, 56, 53 (lines 330-446) | 96, 84, 91, 95, 86, 82 (lines 185-432) | 78, 77, 68, 75, 65, 66 (lines 118-190) | 61, 55, 53, 48, 45, 57 |
| Go deeper words per step (limit 90) | 31, 38, 39, 17, 44 (lines 332-447); Learn deep 52 (line 501) | 55, 43, 50, 61, 69, 49 (lines 187-434); Learn deep 57 (line 497) | 67, 63, 42, 41, 54, 41 (lines 120-192); Learn deep 56 (line 222) | not counted (`deep` is an array) |
| Hook words (limit 80) | 54 (line 313) | 55 (line 169) | 67 (line 102) | 41 (line 224) |
| Overview description words | 38 (line 314) | 51 (line 170) | 50 (line 103) | 48 (line 228) |
| Summary words | 27 (lines 255-256) | 27 (line 133) | 24 (line 28) | 41 (line 183) |
| Scene title | "Home Wi-Fi network" (line 270) | "Office network · 192.168.1.0/24" (line 148) | "Office firewall · web server 10.0.0.10" (line 39) | "Your laptop joins the network and gets an address" (line 199) |
| Parties and addresses | Laptop `00:00:5E:00:53:10` (line 306), Router `192.168.1.1` (line 307), Phone `00:00:5E:00:53:11` (line 308) | none | Visitor `203.0.113.50`, Admin `198.51.100.7`, Firewall "rule list", Web server `10.0.0.10` (lines 95-98) | Laptop MAC `00:00:5E:00:53:10`, Your router `192.168.1.1` (lines 207-208) |
| Example data (constants) | MACs `00:00:5E:00:53:01` router, `:10` laptop, `:11` phone (lines 19-21); IPs `0.0.0.0`, `255.255.255.255`, `192.168.1.1`, `192.168.1.100` (lines 24-27); lease 86400 s, renew 43200 s (lines 30-31); ports 67 and 68 (line 95); transaction IDs `0x3903F326`, `0x7B2C91A4` (lines 102-103); frame = 14 + 20 + 8 + 300 = 342 bytes (line 86) | `192.168.1.10` Laptop, `192.168.1.20` Printer, `192.168.1.70` Design PC (lines 26-28); link `203.0.113.6` (line 29), provider `203.0.113.5` (derived, line 76); /24, /26, /30 (lines 32-34); the /31 of RFC 3021 (line 36) | visitor `203.0.113.50`, admin `198.51.100.7`, web `10.0.0.10` (`src/content/helpers/firewall-events.ts:17`); ports 443, 22, 23 (visit lines 127, 142, 156, 170); source ports 50432, 50433, 51876, 50434, 50511 (lines 127-201) | Lease 24 h; addresses `192.168.1.100`, `192.168.1.1`, `192.0.2.53` (lines 409, 546) |
| Scene start / labels | none | none | none | `labels` and `start: []` (lines 202-203) |

Notes for sizing:
- `subnetting.ts:570-915` holds a `STATED` list of about 70 entries (lines with `at:` between 585 and 915); each pins a number in a sentence to the engine (`subnetting.ts:920` `checkStated(subnetting, STATED)` runs at load).
- Every track limit above is met by all three in the legacy path: steps 5-6 within 4-6, facts 2-4 per step, Learn terms 8-10 within 3-10, Practice 3 within 2-3, options 3 within 2-4, pattern names 4 within 2-6 (`dhcp.ts:497`, `subnetting.ts:493`, `firewalls.ts:218`).
- The narrative and deep limits are checked in the registry (`src/content/registry.test.ts:447-454` uses a 130-word narrative against the 120 limit as its example).

- Event cues: `subnetting.ts` has cues on its 17 events (`cue: 'glow'`, `'focus'`, `'ring'`, `'pulse'`, `'route'`, `'busy'`, `'link'`, `'cut'`, `'one-net'`; e.g. lines 205-206, 215, 295-297, 338, 362-364). `firewalls` has one cue, on its rule-change note, `cue: 'rules'` from `src/content/helpers/firewall-events.ts:202`. `dhcp` has no event cues (its `message()` helper, `dhcp.ts:200-226`, sets none).

## 3. Their documents

Every standard, RFC or URL a lesson names or cites in its learner text or its `references` (the legacy list of links that About reads). The registry is `src/content/sources.ts`; its entries are `SOURCES` (line 198), and each entry has an `id`.

| Lesson | Document named | Where (lesson) | In `sources.ts`? |
|---|---|---|---|
| `dhcp` | RFC 2131 (defines DHCP) | `dhcp.ts:8` (comment), `:29`, `:173`, `:266` (reference label and URL `https://www.rfc-editor.org/rfc/rfc2131`), `:322` and `:508` ("Defined in") | **Yes**: `rfc-2131` (`sources.ts:323`), URL `https://www.rfc-editor.org/rfc/rfc2131.html` (`sources.ts:328`); the legacy URL has no `.html` |
| `dhcp` | RFC 2132 (DHCP options) | `dhcp.ts:267` (reference label and URL `https://www.rfc-editor.org/rfc/rfc2132`), `:322`, `:508` | **Yes**: `rfc-2132` (`sources.ts:1008`), URL `…/rfc2132.html` (`sources.ts:1013`) |
| `dhcp` | RFC 2131 section 4.4.5 (T1 renewal) and 4.3.2 | `dhcp.ts:9`, `:29`, `:173` (comments) and `:447`, `:501` (learner text names "T1" and "87.5%" without the section) | the section is cited in `what-is-dhcp.ts`, not in `dhcp.ts` |
| `subnetting` | RFC 950 (Internet Standard Subnetting Procedure) | `subnetting.ts:144` (reference label and URL `https://www.rfc-editor.org/rfc/rfc950`), `:177` ("Defined in"), `:500` | **No**: no `rfc-950` id, and no `rfc950` URL anywhere in `sources.ts` |
| `subnetting` | RFC 4632 (CIDR) | `subnetting.ts:145` (reference label and URL `https://www.rfc-editor.org/rfc/rfc4632`), `:177`, `:500` | **Yes**: `rfc-4632` (`sources.ts:1172`), URL `…/rfc4632.html` (`sources.ts:1177`); its title there is "Classless Inter-domain Routing (CIDR): The Internet Address Assignment and Aggregation Plan" |
| `subnetting` | RFC 3021 (/31 point-to-point links) | `subnetting.ts:35` (comment), `:434` (learner text: "RFC 3021 lets both of its 2 addresses be used"), `:500` ("Defined in"), `:793-794` (Go deeper, in the STATED block) | **No**: no `rfc-3021` id |
| `subnetting` | RFC 5737 (documentation addresses) | `subnetting.ts:108` (comment only: "RFC 5737's TEST-NET-3"); learner text at `:434` says "203.0.113.0/24 is set aside for documentation" and names no document | **No**: no `rfc-5737` id |
| `subnetting` | RFC 1918 (private addresses) | not named in `subnetting.ts`; the Overview fact says "private (192.168.x.x)" (`subnetting.ts:176`) | the id exists (`rfc-1918`, `sources.ts:1145`), but this lesson does not cite it |
| `subnetting` | "Classless Inter-Domain Routing" (name of CIDR) | `subnetting.ts:236` | covered by `rfc-4632` above |
| `firewalls` | NIST SP 800-41 Rev. 1 (Guidelines on Firewalls and Firewall Policy) | `firewalls.ts:8` (comment), `:37` (reference label and URL `https://csrc.nist.gov/pubs/sp/800/41/r1/final`), `:164` ("NIST's firewall guidance (SP 800-41) recommends default deny") | **No**: no `nist-sp800-41` id. The registry has `nist-sp800-77r1` (`sources.ts:218`) and other NIST ids, not 800-41 |
| `firewalls` | Cisco access lists, Linux iptables chains | `firewalls.ts:135` (named, no link) | No entry |
| `firewalls` | Windows Defender Firewall; "access control lists (ACLs)" | `firewalls.ts:222` (named, no link) | No entry |
| `firewalls` | RFC 5737 and RFC 1918 (addresses) | `src/content/helpers/firewall-events.ts:9-12` (comment only) | RFC 1918 yes (`sources.ts:1145`); RFC 5737 no |

Other facts:
- No lesson names an IANA registry or a vendor page. The ports 67/68 in `dhcp.ts:318`, `:503` have no IANA citation in the legacy form. The cited tour version cites `iana-ports` (`what-is-dhcp.ts:34-37`; `sources.ts:341`).
- The `dhcp` references are the only `references` of the three that About reads (see section 4).
- `firewalls.ts:37` is the only reference of that lesson, one NIST document with no registry id.

## 4. What rests on each lesson

### 4a. Each lesson's own test

`dhcp.test.ts` (116 lines) asserts:
- 21: validates, 1 unit, 5 steps, 3 questions.
- 28-31: step titles in order (`DHCP Discover` … `Lease Renewal`) and Learn pattern names `['Discover', 'Offer', 'Request', 'Acknowledge']`.
- 33-38: the lease table is `[]` after step 3, the laptop's row (`192.168.1.100`, `00:00:5E:00:53:10`, `Laptop`, `in 24 h`) after step 4, and `in 24 h (renewed)` after step 5.
- 40-48: 6 messages; each packet's size equals the sum of its layers; each log size is `342 B`.
- 50-56: each message rides a tag the figure draws (`dh-tag-<tag>`) and goes between laptop and router.
- 58-68: the table is `leases`, keyed on `ip`, columns `IP address, MAC address, Device, Expires`, prose flags `[false, false, true, true]`.
- 70-80: log column widths 100, 150, 172, 84, Info prose, 64.
- 82-98: log title `Event log`, its column labels, parties `laptop/Laptop, router/Router, phone/Phone`, views `['network', 'sequence']`.
- 100-111: the `TOPIC` map (subnetting "subnet mask", ports "ports", tcp-udp "UDP", dns "DNS"); `lessonNumbers(dhcp)` has length 4; `misnamedLessons` is `[]`.
- 113-115: `showSweep(dhcp)` is 8 plus the event count.

`subnetting.test.ts` (402 lines) asserts:
- 30-36: validates; 6 steps; 17 events; 3 questions.
- 38-62: slug, title, subtitle, level, certTags, summary, figure `subnet`; `getEntries('networking')` gives `number: 7, available: true`; unit name, full name, purpose, `osi: { layers: [3] }`; reference labels (RFC 950 and RFC 4632); scene title; panel `{ type: 'bits' }`.
- 64-74: step titles and subtitles in order; pattern names.
- 76-80: pattern note contains "Steps 2 and 3 did it for a /24, step 4 for a /26 and step 6 for a /30."; the prefixes per step are `[24], [24], [26], [30]`.
- 86-109: `MOCKUP_ROWS`: all 17 rows' worked, value, prefix and plain words, e.g. `['Subnet mask', '255.255.255.192', '/26', '2 host bits borrowed for the network']`.
- 111-147: each event's cues (`MOCKUP_CUES`, 17 entries); every named part exists in the figure's SVG.
- 149-152: `showSweep(subnetting)` is `9 + 17`.
- 154-172: log title `Working`, four columns with widths 176, 190, 76, and plain; legend `Worked out`, `Sent`, `Broadcast`; idle text.
- 174-187: glyphs: `broadcast-24` and `broadcast-26` ring; `same-subnet`, `different-subnet`, `usable-30` are "response"; 12 are "request"; the Prefix column shows a dash for `address`, `network-part`, `host-part`.
- 189-211: `192.168.1.10` vs `192.168.1.70` differ at /26 and match at /24; the board text `'/26: the network parts differ, so it’s another subnet'`; the delivery narrative contains "The Design PC, 192.168.1.70, doesn’t match"; Practice's right answer text "To the router, because the network parts differ."
- 213-223: the Sequence toggle is absent (`not.toContain('Sequence')`); the panel shows `Office network · 192.168.1.0/24` and "The address in bits".
- 225-230: `lessonNumbers(subnetting)` is `[]`; `lessonTitles` is `['IP Address', 'Router']`, and both are titles in the networking track.
- 233-284 (`COMPUTED`): the exact bare values of the scene title, every fact of every step, the Learn facts `/25`-`/30`, and the Practice option numbers `64`, `62`, `30`.
- 287-295 (`NOT_COMPUTED`): "12 Oak Street", "192.168.x.x", "203.0.113.x", "RFC 950", "RFC 4632", "RFC 3021", "Steps 2 and 3".
- 361-368: every number in learner text is accounted for (`uncovered(subnetting)` is `[]`).
- 370-375: three one-number edits must fail the build (`192.168.1.255`, `.128`, `62`).
- 382-402: 14 `MUTATIONS` (for example `scene.title` `/24` → `/26`, `practice.usable-26.options.2.text` `30` → `64`, `learn.facts.0.label` `/25` → `/26`); each must be caught at its place.

`firewalls.test.ts` (377 lines) asserts:
- 57-62: validates; 1 unit; 6 steps; 3 questions.
- 64-78: slug, title, subtitle, level, certTags, summary, figure `firewall`; unit name `Firewall`, full name, purpose, `osi: { layers: [3, 4] }`; reference label `NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy` and its URL.
- 80-85: step titles in order; pattern names (four); the eight term names; Practice answers `[0, 0, 1]`.
- 89-102: the decisions, in order, are `allow 1, deny 3, allow 2, deny 3, reply, change, deny 1` (both from the engine and from the events); each message's `to`/outcome and log Decision text.
- 104-117: each step's Result fact is `Allowed by rule 1`, `Denied by rule 3`, `Allowed by rule 2`, `Denied by rule 3`, `Denied by the new rule 1` (in step order).
- 119-131: rules read per visit `[1, 3, 2, 3, 1]`; the reply has no check and a `known` key `visitor:443`.
- 133-140: connections remembered after step 2 and step 4 (`visitor:443` rule 1; `admin:22` rule 2).
- 142-156: after the change the rule list reads `DENY Any, ALLOW TCP 443, ALLOW TCP 22 (198.51.100.7/32)` and no connections are remembered.
- 165-209: `checkResults` (the build check) passes on the lesson and throws on each of several copies (a wrong Result word, reordered rules, swapped port, wrong rule number, unknown connection).
- 213-235: the rules panel's columns and widths; initial row notes `Website (HTTPS)`, `Admin login (SSH)`, `Block everything else`; the connections table's labels.
- 237-254: log title `Firewall log`; its columns and widths; legend `Visit`, `Reply`, `Blocked`, `Rule change`.
- 256-268: scene title; views; the four parties and addresses; the log idle text.
- 270-275: every message tag is drawn: `['HTTPS 443', 'SSH 22', 'SSH 22', 'TELNET 23', 'REPLY 443', 'HTTPS 443']`.
- 277-285: the only addresses in the text are `10.0.0.10`, `198.51.100.7`, `203.0.113.50`; no MAC address appears.
- 288-299: the `TOPIC` map (tcp-udp "SYN", http-https "HTTPS", nat "NAT", subnetting "slash", vpn "VPN"); `lessonNumbers` in order is `[11, 14, 12, 7, 19]`; no misnamed lesson.
- 301-377: the figure's state at each step (board text, bar class, arms, tags) and `showSweep`.

### 4b. The track tests and the registry

- `src/content/registry.test.ts`: 44-51 (the networking slugs in order); 53-59 (19 lessons, OSI first, none available with no lessons passed); 61-63 (`subnetting` 7, `dhcp` 9, `firewalls` 16); 66-79 (networking parts and titles, including `Subnetting`, `DHCP`, `Firewalls`); 113-131 (the `dhcp` entry's url `/networking/dhcp`, title `DHCP`, subtitle, summary and certTags from the lesson); 418-428 (real lessons: `getLesson('dhcp').slug === 'dhcp'`, `tracksOf('dhcp')` is `['networking']`, entry `canonical` `/networking/dhcp`); 447-454 (a fixture `dhcp` with a 130-word narrative must fail the 120 limit).
- `src/lib/track.test.ts`: 13-14 (the real DHCP and Subnetting); 29 (ready titles `['OSI Model', 'Subnetting', 'DHCP', 'Firewalls']`); 52-66 (Subnetting card: url `/networking/subnetting`, meta `['CompTIA Network+', 'Cisco CCNA']` (line 64), label `Exams`); 68-71 (DHCP card: meta `['CompTIA A+', 'CompTIA Network+', 'Cisco CCNA', 'Helpdesk']` (line 69), label `Exams`, places count equal to `slotsFor(DHCP)`); 94-99 (DHCP places: Overview; `Watch, step 3 of 5` (line 97); Learn; Practice); 118-130 (every available networking lesson's stamp is `checked: null` exactly when the lesson is not cited).
- `src/content/tracks/how-the-internet-works.test.ts`: 146-158 names the depth lesson `getLesson('dhcp')`; asserts its units are `['dhcp']` and its figure is `'dhcp'` (line 155).
- `src/lib/home.test.ts`: none of the three slugs. It reads `LEGACY_LESSONS` (line 4) for `what-is-https` only (line 99).
- `src/lib/url.test.ts:10` and `:15`: canonical URL strings for `/networking/dhcp/` and `/networking/subnetting` (strings only, no content).

### 4c. About page

- `src/pages/about.astro:36-37`: `const dhcp = readyLesson('dhcp')` and `const sources = sourceRows(dhcp.units.flatMap((u) => u.references))`. `readyLesson` (lines 22-27) throws `About needs the <slug> lesson, and it is not ready.` if `getLesson` finds nothing.
- `src/pages/about.astro:149`: heading `Sources in the {dhcp.title} lesson`, then one `<li>` per row: `<span>{s.standard}</span>` and `<a href={s.url}>{s.title}</a>`.
- `src/lib/about.test.ts:46-51` pins the two rows exactly: `{ standard: 'RFC 2131', title: 'Dynamic Host Configuration Protocol', url: 'https://www.rfc-editor.org/rfc/rfc2131' }` and `{ standard: 'RFC 2132', title: 'DHCP Options and BOOTP Vendor Extensions', url: 'https://www.rfc-editor.org/rfc/rfc2132' }`.
- Effect of a move: a cited unit's `references` come from its citations (`src/content/define.ts:379`, `sources` through `sourceListOf`, `src/content/sources.ts`), and each URL is the registry's, `…/rfc2131.html` and `…/rfc2132.html` (`sources.ts:328`, `:1013`). So the two URLs in `about.test.ts:48-51` would change, and the test would fail on them.

### 4d. Fact-check gate and CLI

- `src/content/factcheck/cli.defaults.test.ts:7-11` expects `runFactCheck(['dhcp'])` to return `code: 1` with `out: '"dhcp" is still on the legacy list; move it to the cited shape before checking it (docs/content-model.md §4).'` (line 10). Once `dhcp` leaves `LEGACY_LESSONS`, this test is against a different path, so it would fail.
- `src/content/factcheck/canary/lesson.ts` and `canary.test.ts` hold a separate DHCP canary lesson (not `dhcp.ts`), with planted faults; they read no file of this lesson.
- The build gate (`src/content/factcheck/gate.ts:22-24` `reportPath` = `docs/fact-checks/<slug>.md`; `:27-28` says a missing report stops a cited lesson) means a cited lesson needs its report at `docs/fact-checks/dhcp.md`, `subnetting.md` or `firewalls.md`. None exists.

### 4e. Legacy tests and the legacy path

- `src/content/legacy.test.ts:8-10` pins `LEGACY_LESSONS` to exactly `['dhcp', 'firewalls', 'subnetting']` (line 9). Each move changes that line.
- `src/content/legacy.test.ts:74-77`: `defineLegacyLesson({ ...makeLesson(), slug: 'dhcp', units: [] })` must throw `LessonValidationError` matching `/units/`. Once `dhcp` leaves the list, the error is "not on the legacy list" instead, and `/units/` will not match.
- `src/content/define.test.ts:553-554` and `:557-558`: `defineLegacyLesson(makeLesson({ slug: 'dhcp' }))` must return origin `'legacy'`. Once `dhcp` leaves the list, this throws.
- `src/content/define.test.ts:566-568`: a `slug: 'dhcp'` input must throw `LessonValidationError` (passes for any reason after the move).
- `e2e/support.ts:2` and `:18`: `isChecked(slug)` is `!LEGACY_LESSONS.includes(slug)`; `e2e/global-setup.ts:40-44` reads it and throws if a track page's stop does not agree (`/^Checked\b/` must match exactly when the lesson is not on the list).

### 4f. Unit tests that import the real lesson

- `src/scenes/drivers/dhcp.test.ts` (imports `dhcp` at line 7): `duration` 1850 ms for a message (lines 104-105), 0 ms for a table event (lines 106-107); the Offer tag moves from router to laptop (line 110); the lease table is painted (line 163).
- `src/scenes/drivers/subnet.test.ts` (imports `subnetting`, line 7): durations (`same-subnet` `700 + 7 × route + 500`, lines 126-128); the cut lights each pad (line 134); the calc's callout and holds (line 217); the broadcast in the Design subnet stops at its pad (line 257); the route through the router (line 272).
- `src/scenes/drivers/firewall.test.ts` (imports `firewalls`, line 6): duration per ride (line 116); reading order and 1400 ms for a visit reading 3 rules (line 129); the arms, bar and trail for allowed and denied visits (lines 165, 203); the reply and gate (line 220); the change's board (line 246).
- `src/scenes/SequenceView.test.tsx` (line 4): the Sequence view at Learn stops each denied visit at the firewall with its rule (lines 150-180).
- `src/lesson/panels/RulesPanel.test.tsx` (line 6): the rule list and marks (lines 36-152); the connections chips (line 97); the rule words' contrast (line 211).
- `src/lesson/panels/UnitPanel.test.tsx` (line 4): the rules panel's marks and rows (lines 19-68).
- `src/lesson/announce.test.ts` (line 2): lines 73-80 pin the spoken words of the Acknowledge step: `DHCP Acknowledge. The router confirms: 192.168.1.100 is the laptop’s for 24 hours. The router writes down that 192.168.1.100 belongs to the laptop for 24 hours.`
- `src/art/scenes/dhcp.test.ts`, `src/art/scenes/subnet.test.ts`, `src/art/scenes/firewall.test.ts` import only their drawing, not the lessons.
- `src/art/figures/figures.test.ts:66-68` pins the hash of the track-card spot drawings `spot:subnet`, `spot:dhcp`, `spot:firewall`; `src/lib/figures.ts:9-11` maps the slugs to them; `src/art/figures/spots.ts:105, 125, 141` (comments) say "Lesson 08", "Lesson 10" and "Lesson 17", which do not match the track's numbers 7, 9 and 16.

### 4g. End-to-end specs that name the three

- `e2e/lesson.spec.ts`: line 34 (`NO_SEQUENCE` contains `subnetting`); line 66 (comment: "DHCP"); lines 277-278 (canonical `https://techconcepts.app/networking/dhcp`); lines 290-321 (reduced motion: DHCP's first unit at 1× within a quarter of normal); lines 327-338 (region `DHCP lease table` keeps focus); lines 340-351 (the Acknowledge step's announced words, exact string); lines 362-374 (Firewalls: the matched rule row in view at each step; expected `1 allow, 3 deny, 2 allow, 3 deny, known, 1 deny`, lines 97-104).
- `e2e/reading.spec.ts`: line 48 (`dhcp` Practice fits at each size); lines 184-237 (`dhcp` Learn and log geometry); lines 246-294 (`dhcp` and `firewalls` at three widths; `.tpanel` for DHCP and `.rpanel` for Firewalls at lines 257-258).
- `e2e/tablet.spec.ts`: line 13 (`DHCP = '/networking/dhcp'`); lines 70-401 (DHCP at `?step=2` and `?step=6`; line 139 expects the nav button `DHCP Request`); lines 380-381 (`/networking/subnetting?step=2` and `/networking/firewalls?step=2` fit one screen at 22 sizes).
- `e2e/site.spec.ts`: lines 695 and 751 (the DHCP lesson card; line 751 expects `✓ Done`); lines 753-756 (`subnetting` in progress in `techconcepts:v2`); lines 1109-1111 (walks every slot of dhcp, osi-model, firewalls, subnetting); line 1128 (the fourth tab's name: `Table`, `Rules`, `Bits`); line 1235 (`goTo` the subnetting page); lines 1306-1311 (test 12: subnetting and osi-model have no band; dhcp and firewalls have one); lines 1342-1344 (test 15: the stamp line on each).
- `e2e/global-setup.ts:40-44` and `e2e/support.ts:2, 18` (see 4e).

## 5. What each shares with checked lessons

Checked means cited (`defineLesson`), with a passing report in `docs/fact-checks/`. The tour lessons are all cited (`grep` of `src/content/lessons/what-is-*.ts` finds 14 `defineLesson` exports); `what-is-dhcp` has a change list in `docs/lesson-changes/what-is-dhcp.md` (91 lines; it says the lesson now cites 25 sources and passed its fact-check, and it keeps the pointer "Networking Concepts has a DHCP lesson that goes further." at its Overview hook; the change list records this as its item 6, labelled "Removal 2", at line 14).

### 5a. `dhcp` against `what-is-dhcp` (tour)

Agree = same claim and same numbers. Differ = the claim or the example is worded or set differently.

| Idea | `dhcp.ts` | `what-is-dhcp.ts` | Wording |
|---|---|---|---|
| Four messages: Discover, Offer, Request, Acknowledge (DORA) | step titles 328, 357, 386, 414; "often called DORA" 417; pattern 497-498; overview "Exchange" fact 320 | overview fact "Messages" 244; "Four messages" lead 710; DORA deep 539; pattern note 779; fact 561 | Agree. Only `dhcp` says "Acknowledge"; the tour says "Ack" in its facts. The tour's pattern note (779) adds "A renewal is just the last two again"; `dhcp` has no such sentence. |
| Ports: server UDP 67, client UDP 68 | overview fact 318 ("UDP 67 (server), UDP 68 (client)"); Learn fact 503; deep 332 ("UDP port 67, where DHCP servers listen") | overview fact 239 ("UDP 67 (server), 68 (client)"); fact 820 (same as 239); deep 317 | Agree in numbers. The two write "68" differently: `dhcp` writes "UDP 68", the tour writes "68". |
| First message from 0.0.0.0 to 255.255.255.255 | frame 109-114; deep 332 (0.0.0.0 port 68 to 255.255.255.255 port 67); deep 501; facts 334-336, 504 | deep 268, 317; fact "To" 335; fact-first 857 | Agree. |
| Broadcast means "to everyone" | legend 300 "Broadcast to everyone"; kind 345; term 487 "Shouting to every device on the network at once" | narrative 314 ("A message to everyone is a broadcast"); term 729 | Agree; the wording differs. |
| Discover carries the laptop's MAC address | frame `clientMac` (117) and fact "Laptop MAC" (337). The sentence is not in the learner text. | deep 317 ("carries the laptop’s MAC address so the server can tell clients apart"); fact 338; fact-discover 869 | Only the tour states it in words. |
| Request is still broadcast, still from 0.0.0.0, and names the chosen server | narrative 389 ("It still shouts this to everyone"); deep 390 (from 0.0.0.0; server identifier says whose offer won) | narrative 460 (broadcast again); deep 463 (from 0.0.0.0 until confirmed); fact-request 885-889 | Agree in substance. |
| Options 50 (requested address) and 54 (server identifier) | Field objects 55-64 (names "option 54", "option 50"); deep 390 | deep 468 ("option 54, server identifier" and "option 50, requested IP address"); fact-request 889 | Agree. `dhcp` names more options (1, 3, 6, 51) at lines 36-54; the tour names only 50 and 54 in prose. |
| Offer carries mask, router, DNS and lease | narrative 360; deep 361 ("subnet mask, a default gateway and a DNS server (lessons 7 and 13)"); facts 363-366; settings 67 | deep 384 (address, mask, gateway, DNS, lease time, with RFC option cites); facts 403-416 | Agree. The tour adds the RFC options by number. |
| An Offer is not final; the server holds the address | none | narrative 381 ("Nothing is final yet"); fact-offer 881 | Tour only. |
| Who sends the Offer and the ACK | sent to 255.255.255.255:68 with the broadcast flag set (frames 119-129, 159; `dst` at 377 and 433) | deep 388 ("Servers may broadcast the Offer or send it straight to the client’s MAC"); the Offer event goes to 192.168.1.100:68 (`dst` LAPTOP, line 437); the ACK event too (line 584) | Differ in the example: `dhcp` broadcasts the Offer and ACK; the tour sends them to the offered address. |
| More than one server: the client takes one | deep 390 (server identifier) | deep 392 ("A network can have more than one DHCP server, so a client may get several offers; it takes one.") | Agree; the tour says it outright. |
| The router writes a lease table; two devices never share an address | narrative 417 ("writes it down in its lease table"; "how two devices never end up with the same address"); deep 418 ("behind your router's 'connected devices' page"); Learn term 492; why 500; practice 543-548 | "why" 785 ("someone would have to type an address … and make sure no two clashed"); 790-791 ("takes addresses back from devices that leave") | Agree in idea. The phrase "lease table" is not in the tour lesson. |
| Lease is 24 hours, lent not given | constants 29-30 (86400 s); summary 256; narrative 417, 446 | narrative 528 ("The 24 hours is the lease: the address is lent, not given."); facts 414, 546; narrative 610 | Agree (24 hours). |
| Renewal at half the lease (T1 = 50%) | constant comment 29 ("renews at half of it, T1, RFC 2131 section 4.4.5"); narrative 446; deep 447 ("Renewal happens at half the lease, 43,200 seconds here"); deep 501 ("half the lease, often called T1"); fact 321, 505 | narrative 610 ("Halfway through the lease, after 12 hours"); deep 613 (T1, half the lease); fact-renewal 833 ("at 50% of the lease") | Agree. |
| Renewal goes straight to the router; the ACK starts the lease again | renew frames 163-195 (unicast to 192.168.1.1 port 67); narrative 446 ("asks the router directly"); fact 450; log text 477 ("The router says yes, and the 24 hours start again.") | narrative 610 ("asks the router directly … The router says yes, and the 24 hours start again"); deep 613; fact 637 | Agree; nearly the same words. |
| T2 at 87.5% (the tour says seven-eighths) | deep 447 ("asks any server at 87.5% of the lease"); deep 501 ("asks any server at 87.5% of the lease, called T2"); fact 506 ("Rebind (T2)") | deep 617 ("the client broadcasts to any server at T2, seven-eighths of the lease"); fact 642 ("ask anyone, at 7/8 of the lease"); fact 833 ("87.5%") | Value agrees. The tour says "broadcasts"; `dhcp` says "asks any server". |
| When the lease runs out, start again from Discover | deep 447 | deep 621 | Agree. |
| No server answers: a 169.254 address | fact 507 ("Windows gives itself 169.254.x.x (APIPA)") | deep 276 (link-local address in 169.254.0.0/16; "only works with its neighbours"); fact 839; citations for RFC 3927 at 277 and 840 | Differ in what it claims: `dhcp` says Windows does this; the tour says the client does, citing RFC 3927. |
| A relay on each router forwards the broadcasts | none | deep 321 (relay, Cisco `ip helper-address`); deep-relay 802 | Tour only. |
| The analogy: a hotel desk and room | hook 313 ("like a room number in a hotel. … You ask the front desk, and they hand you a free one"); narrative 446 ("like a hotel room") | description 229 ("It’s like arriving at a hotel. You don’t pick your own room…"); `backing: { analogy: true }` (230) | Same analogy; different words. |
| The phone hears the broadcast and ignores it | narrative 331; header comment 9-10; phone party 308 | none | `dhcp` only. |
| ARP probe after the ACK; DHCPNAK; DHCPRELEASE; snooping; DHCPv6 and SLAAC | none | deep 531, 535, 625, 807, 812 | Tour only. |
| The address stays the same while the client keeps renewing | none (the renewed row keeps the same IP, `dhcp.ts:243` and `dhcp.test.ts:37`, but the text does not say it) | fact-same 900; narrative 610 | Tour only in words. |
| "Defined in" | fact 322, 508: "RFC 2131, RFC 2132" | fact-defined 843-846: "RFC 2131, Dynamic Host Configuration Protocol" (RFC 2132 is cited for options at 827 and 864) | Differ: `dhcp` lists RFC 2132; the tour lists RFC 2131 only. |
| Pointer to another lesson | "Lessons 10 and 11 cover ports and UDP." (332); "(lessons 7 and 13)" (361) | "Networking Concepts has a DHCP lesson that goes further." (summary 184, hook 224; comment 9) | `dhcp` points by number inside its text; the tour points by name. |

Pinned by tests: `how-the-internet-works.test.ts:158` requires the tour's hook to end with "Networking Concepts has a DHCP lesson that goes further." (regex `/Networking Concepts has a DHCP lesson that goes further\.$/`). `what-is-dhcp.ts:15` says "No message size is shown: no source states one" (the legacy `dhcp` shows `342 B`).

### 5b. `subnetting` against `what-is-ip` (tour; the only other checked lesson that covers addresses and masks)

Also checked: `what-is-dhcp` shows a 255.255.255.0 mask in the Offer (fact "Mask", `what-is-dhcp.ts:403-404`). No other checked lesson mentions subnets, masks, broadcast addresses or usable addresses (grep of `src/content/lessons/what-is-*.ts` and `osi-model.ts`).

| Idea | `subnetting.ts` | `what-is-ip.ts` | Wording |
|---|---|---|---|
| An address is a network part and a host part | narrative 186 ("The first three numbers, 192.168.1, say which network it’s on … The last number, 10, says which device it is"); facts 189-192 | none in those words. The tour says the laptop is on "192.168.1.something" (line 183) and that its network is 192.168.1.0/24 (fact "My network", line 199) | Differ: the split is taught only in `subnetting`. |
| The subnet mask: a 1 for each network bit | narrative 235 ("a 1 for every network bit and a 0 for every host bit"); facts 238-241 | narrative 186 ("its own address and subnet mask: 192.168.1.100/24 covers 192.168.1.0 to 192.168.1.255") | Agree on the /24 example. |
| Prefix length and CIDR | narrative 235 ("write the count after a slash … That count is the prefix length"); deep 236 ("Writing /24 is called CIDR notation, from Classless Inter-Domain Routing") | deep-4 text 587 ("A prefix such as 192.168.1.0/24 names a whole network; the Subnetting lesson goes further."); citation `rfc-4632` section 3.1 (`what-is-ip.ts:589`) | Agree; `what-is-ip` names the Subnetting lesson by title. |
| Network address and broadcast address | narrative 266 (host bits all 0: 192.168.1.0; all 1: 192.168.1.255); facts 269-270 | range "192.168.1.0 to 192.168.1.255" in narrative 186 | Agree on the numbers. `what-is-ip` names no network or broadcast address. |
| Usable addresses: 2 to the power of host bits, minus 2 | narrative 266 ("254 for devices"); deep 267 | none | `subnetting` only. |
| Same subnet: send direct. Different: send to the default gateway | narrative 391 (lay the mask over both addresses; compare network parts; "its way out, called the default gateway"); deep 392 (bitwise AND; gateway 192.168.1.1) | narrative 186 (compares the destination with its own address and subnet mask; "Anything outside matches only the default route, 0.0.0.0/0, whose next hop is the gateway, 192.168.1.1") | Agree in principle. `what-is-ip` uses the words "default route" and "gateway"; `subnetting` uses "default gateway". |
| Private ranges | overview fact 176 ("private (192.168.x.x) and documentation (203.0.113.x) examples"); no citation | narrative 344 ("10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16"); fact-private 594 (RFC 1918 section 3) | Agree on 192.168. `subnetting` does not cite RFC 1918. |
| Documentation addresses 203.0.113.0/24 | learner text 434 ("203.0.113.0/24 is set aside for documentation") | the example 203.0.113.80 (line 174); header comment 12 names RFC 5737 (comment only) | `subnetting` states the range; `what-is-ip` only uses it. |
| Point-to-point /30 and RFC 3021 /31 | narrative 432-433; deep 434 | none | `subnetting` only. |
| Broadcast | narrative 266 and 287 ("the whole floor hears it"); deep 267 (DHCP and ARP find each other with a broadcast) | ARP broadcast to ff:ff:ff:ff:ff:ff (lines 213-216, 614) | Different scope: `what-is-ip` is about the MAC broadcast; `subnetting` about the IP broadcast address. |

Pointers in the checked lesson: `what-is-ip.ts:587` ("the Subnetting lesson goes further") is the only sentence in a checked lesson that names a Networking lesson by title that is not a tour lesson.

### 5c. `firewalls` against the checked lessons on ports, TCP and NAT

No checked lesson uses the word "stateful" or describes a firewall's connection table (grep of `src/content/lessons/what-is-*.ts` and `osi-model.ts`). The checked lessons that mention firewalls are only `what-is-ftp.ts:409` ("which NAT and firewalls usually block") and `:765` ("FTP’s extra data connections are hard for firewalls"), and `what-is-icmp.ts:215` ("Firewalls can block pings").

| Idea | `firewalls.ts` | Checked lesson | Wording |
|---|---|---|---|
| A port is a door number on a server | narrative 119 ("Door numbers like this are called **ports**"); glossary-style Learn term 210 | `what-is-udp.ts:599-601` (Ports fact, cited) and `what-is-tcp.ts:29` (IANA ports) | Agree. |
| Port 443 is HTTPS | narrative 119 ("answers at door number 443"); deep 120 ("Port 443 is HTTPS (lesson 14)") | `what-is-https.ts:284` ("HTTPS uses **port 443** instead of 80"); `:287` ("port 443 is the port reserved for HTTPS") | Agree. |
| Port 22 is SSH | deep 135 ("Port 22 is SSH, a secure way to log in to a computer over the network") | `what-is-ssh.ts:222` ("After the TCP hello on **port 22**"); `what-is-ftp.ts:322` and `:652` (SFTP on port 22) | Agree. |
| Port 23 is Telnet, which sends passwords in plain text | deep 164 ("Port 23 is Telnet"); narrative 163 ("an old way to log in that sends everything as plain text, passwords included") | `what-is-ssh.ts:1024` ("Telnet sent everything as plain text"); `:1057` ("Telnet (23)") | Agree. |
| Port 80 and port 53 | none | `what-is-http.ts:236` (port 80); `what-is-dns.ts:214` (UDP port 53) | Not in `firewalls`. |
| The first packet of a TCP connection is a SYN | deep 120 ("the first packet of a TCP connection, called a SYN (lesson 11)") | `what-is-tcp.ts:178` ("SYN means synchronize"); `:182` (SYN-ACK); `:186` (SYN flood) | Agree on SYN. The pointer "lesson 11" is Networking's TCP/UDP lesson, not the tour's TCP lesson. |
| The firewall reads addresses, port and protocol from headers | deep 120 (source and destination addresses in the IP header; destination port in the TCP header) | `what-is-ip.ts:289` (the IPv4 header: addresses, protocol 6 for TCP) | Agree; the TCP header's port field is not described in `what-is-tcp`. |
| Stateful firewall: remembers connections; replies pass | narrative 177 and deep 178 ("connection table … drops the entry when the connection closes or goes quiet") | `what-is-tcp.ts:175` (a connection is "an agreed, two-way line"); `:687-698` (close with FIN; TIME-WAIT; RST ends a connection abruptly) | Not in `what-is-tcp`: the close and TIME-WAIT are described, the firewall's table is not. |
| NAT: a private address is swapped for a public one | narrative 120 ("in real life the visit reaches it through NAT (lesson 12)"); deep 120 | `what-is-ip.ts:341-344` ("swaps it for its own public address"; "port address translation … the NAT table"); `:421` ("NAT is also why a device at home can’t easily be reached from outside, unless the router forwards a port to it") | Agree. `what-is-ip` says the router forwards a port; `firewalls` says nothing about forwarding. |
| Private ranges: 10.0.0.0/8 | scene address `10.0.0.10` (`firewalls.ts:39`, `:98`) | `what-is-ip.ts:344` | Agree. |
| Block by default; first rule that fits decides | narrative 134 and 163; deep 135 ("Most firewalls … stop at the first rule that matches") | none | `firewalls` only. |
| Port 8080 | Practice 233 | none | `firewalls` only. |

Pointers inside `firewalls.ts` by number, all of them inside learner text (`firewalls.ts:120`, `:150`): "lesson 11" (TCP/UDP), "lesson 14" (HTTP/HTTPS), "lesson 12" (NAT), "lesson 7 covers the slash" (Subnetting), "lesson 19" (VPN). `firewalls.test.ts:296-299` checks these numbers and the words each sentence uses (`TOPIC`).

### 5d. Sentences in the three that point to another lesson

| Lesson | Line | Sentence (learner text) | Pointer |
|---|---|---|---|
| `subnetting` | 187 | "The IP Address lesson covers turning numbers into bits and back." | by title |
| `subnetting` | 392 | "The Router lesson covers what happens inside the router." | by title |
| `subnetting` | 267 | "…which is how DHCP and ARP find each other before they know any addresses." | names two protocols, no lesson |
| `dhcp` | 332 | "Lessons 10 and 11 cover ports and UDP." | by number |
| `dhcp` | 361 | "(lessons 7 and 13)" | by number |
| `firewalls` | 120 | "(lesson 11)", "(lesson 14)", "(lesson 12)" | by number |
| `firewalls` | 150 | "(lesson 7 covers the slash)", "(lesson 19)" | by number |

The numbers in `dhcp.ts` and `firewalls.ts` are the Networking track's positions (`networking.ts:31-79`: 7 Subnetting, 9 DHCP, 10 Ports, 11 TCP/UDP, 12 NAT, 13 DNS, 14 HTTP/HTTPS, 16 Firewalls, 19 VPN). Each is pinned by a test (`dhcp.test.ts:108-111`, `firewalls.test.ts:296-299`, `subnetting.test.ts:225-230`).

## 6. Where three branches would collide

Each lesson owns its own file and its own helper: `dhcp.ts` alone imports `src/content/helpers/packets.ts`; `subnetting.ts` alone imports `helpers/subnet-events.ts`; `firewalls.ts` alone imports `helpers/firewall-events.ts` (grep of `src/`). The tour's `helpers/internet-events.ts` is not used by any of the three. The shared spots are these:

| File | Lines | What each branch touches | Why it collides |
|---|---|---|---|
| `src/content/legacy.ts` | array 29-33: `'subnetting'` (30), `'dhcp'` (31), `'firewalls'` (32), `] as const;` (33) | each branch removes its own line | the three removals sit on adjacent lines of one array |
| `src/content/legacy.test.ts` | line 9 (the exact list `['dhcp', 'firewalls', 'subnetting', …]`); line 6 (`TOUR` const, used only by the filter in line 9, which leaves nothing); lines 74-77 (`slug: 'dhcp'`) | each branch edits line 9; the dhcp branch also needs lines 74-77 | line 9 is one expression that every branch must change |
| `src/content/sources.ts` | last entry `baeldung-ssh-intro` at 2441-2448; `]);` at 2449 | each branch that adds a source (RFC 950, RFC 3021, NIST SP 800-41 are not there; `dhcp` needs none) appends here | the same closing lines |
| `src/content/sources.test.ts` | line 235 (title: "…batch 1's, batch 2's, batch 3's and batch 4's"); line 236 (the exact `Object.keys(SOURCES)` list); line 287 (`'baeldung-ssh-intro'`); line 288 (`]);` ) | the same branches that append to `sources.ts` must append the same ids, in the same order, here | an ordered exact match on the last two lines |
| `src/lib/track.test.ts` | 52-66 (Subnetting card), 68-71 and 94-99 (DHCP card and places) | the subnetting and dhcp branches | same file, different rows |
| `src/content/factcheck/cli.defaults.test.ts` | lines 7-12 | dhcp branch only | not shared, but it pins `dhcp` as legacy |
| `src/content/define.test.ts` | lines 553-568 | dhcp branch only | not shared, but it calls `defineLegacyLesson` on slug `dhcp` |
| `src/lib/about.test.ts` | lines 46-51 | dhcp branch only | pins the About URLs and labels for `dhcp` (see 4c) |
| `e2e/*.spec.ts` (`site.spec.ts`, `lesson.spec.ts`, `reading.spec.ts`, `tablet.spec.ts`) | the lines in 4g | any branch that changes a lesson's shape or words may need them | shared spec files name all three slugs |
| `docs/content-model.md` | §4 (lines 171-175) | each branch removes its slug from the sentence "How the Internet Works, Subnetting, DHCP and Firewalls are still in the older shape" (line 173) | shared doc; the sentence is already out of date for the tour |
| `docs/direction.md` | Phase 4 (lines 114-123): "Then DHCP, Subnetting and Firewalls." | the roadmap is updated in the same change (CLAUDE.md) | shared doc |
| `docs/fact-checks/`, `docs/lesson-changes/` | none yet for the three | one file per lesson (`<slug>.md`), so no collision | not shared |

Out-of-date comment, quoted from `src/content/legacy.ts:24-28`:

> "The ready lessons written before citations. Closed: §10 tasks 4–6 remove each slug as it migrates; task 6 deletes this file. A legacy lesson split into parts stays legacy until it is migrated: How the Internet Works' 14 lessons keep their uncited words until each one's audit (owner, 2026-11-08: split now, audit later)."

It is out of date in two ways. All 14 tour lessons are already cited (`defineLesson` in `what-is-*.ts`, see section 5), so the "14 lessons keep their uncited words" clause is false. And "§10" points at `docs/direction.md` §10, which is "Claude's own takes on the Lesson and Tracks pages (not adopted)" (`docs/direction.md:342`); the migration roadmap is §3 (`docs/direction.md:66`), Phase 4 at line 114. `docs/content-model.md:175` repeats the "Direction doc §10 task 6" pointer.

Other items:
- `src/art/figures/spots.ts:105, 125, 141` comments: "Lesson 08, Subnetting", "Lesson 10, DHCP", "Lesson 17, Firewalls" (track numbers are 7, 9 and 16). Only matters if a branch touches the spot art.
- The unit id `dhcp` is used by both `dhcp.ts:260` and `what-is-dhcp.ts:191`. `how-the-internet-works.test.ts:146-155` says this is safe on purpose.
- `src/content/registry.test.ts:44-79`, `:61-63`: the networking slugs, titles and numbers (7, 9, 16) are unaffected by the moves, since none changes position.

## 7. Not found

Searched in `src/`, `e2e/`, `scripts/` and `docs/` (grep, quoted globs, read-only):
- Fact-check reports or change lists for `dhcp`, `subnetting` or `firewalls`: none (`docs/fact-checks/` and `docs/lesson-changes/` have only `what-is-dhcp.md` for the DHCP topic).
- Glossary entries about these topics: none. Objective mappings: none (no track file has `objectives`).
- Sources `rfc-950`, `rfc-3021`, `rfc-5737`, `nist-sp800-41` (by id or URL) in `src/content/sources.ts`: none.
- `page:` marks, `labels`, or `start` cues on the three lessons: none. Event cues on `dhcp` messages: none.
- Unit `group` on the three lessons: none (the tour's units have one, e.g. `what-is-dhcp.ts:195`).
- Sizes on subnetting or firewalls messages: none (firewalls' log has no size column, `firewalls.ts:80-86`).
- The phrase "lease table" in `what-is-dhcp.ts`: none. `ipconfig /renew` appears in `dhcp.ts:447` only. The relay (`what-is-dhcp.ts:321`), the ARP probe (`:531`) and DHCPNAK (`:535`) appear in the tour only.
- The word "stateful" or any firewall connection table in the checked lessons (`src/content/lessons/what-is-*.ts`, `osi-model.ts`): none.
- Any use of RFC 950, RFC 3021, RFC 5737 or NIST SP 800-41 in the checked lessons' learner text: none (RFC 5737 appears in header comments of 13 checked lessons, for example `what-is-ip.ts:12`, and in no learner text).
- An `e2e` or `src` test that reads subnetting's "Working" log words or firewalls' "Firewall log" title beyond the lesson's own test files: none found (the "Event log" region name is used by `LessonConsole` tests and `e2e/site.spec.ts:1022`, a generic console name).
- Imports of `dhcp`, `subnetting` or `firewalls` by a checked lesson: none (the tour uses its own `helpers/internet-events.ts`).
- `src/lib/home.test.ts`: no reference to the three slugs or topics beyond `LEGACY_LESSONS` for `what-is-https` (lines 4, 97-100).
- A test that checks the overall count of networking lessons with content: none beyond `registry.test.ts:53-59` (19 entries, none available with no lessons passed).
- The `src/content/factcheck/canary/lesson.ts` DHCP canary is a separate lesson and does not read `dhcp.ts`.
- A stray file: a background command created and then killed, and I removed the `.superpowers/none` file it touched (`git status --short` was clean afterwards). The only file this scout writes is `prototypes/s9-batch-5-facts.md`.
