# S5 scout: the three lessons after What is HTTP

The repo on branch `revamp`, read only. Every path is from the repo's root; line numbers are from the files as they are at HEAD. Sizes come from loading each lesson module in a read-only bundle.

## 1. Order

**How the Internet Works**, src/content/tracks/how-the-internet-works.ts (parts at lines 17-66):

| # | Slug | Line | Status |
|---|---|---|---|
| 1 | what-is-http | 22 | moved (cited) |
| 2 | what-is-https | 23 | legacy |
| 3 | what-is-tcp | 30 | legacy |
| 4 | what-is-udp | 31 | moved (cited) |
| 5 | what-is-ip | 32 | legacy |
| 6 | what-is-dns | 39 | legacy |
| 7 | what-is-dhcp | 40 | legacy |
| 8 | what-is-icmp | 41 | legacy |
| 9 | what-is-smtp | 48 | legacy |
| 10 | what-is-pop3 | 49 | legacy |
| 11 | what-is-imap | 50 | legacy |
| 12 | what-is-ftp | 57 | legacy |
| 13 | what-is-ssh | 58 | legacy |
| 14 | what-is-tls | 64 | legacy |

**Networking**, src/content/tracks/networking.ts (19 lessons):
- subnetting: position 7, line 49 (part "between-networks", lines 46-52)
- dhcp: position 9, line 51 (same part)
- firewalls: position 16, line 76 (part "protect-scale", lines 72-81)

**LEGACY_LESSONS**, src/content/legacy.ts lines 29-45 (15 slugs):
30 what-is-https, 31 what-is-tcp, 32 what-is-ip, 33 what-is-dns, 34 what-is-dhcp, 35 what-is-icmp, 36 what-is-smtp, 37 what-is-pop3, 38 what-is-imap, 39 what-is-ftp, 40 what-is-ssh, 41 what-is-tls, 42 subnetting, 43 dhcp, 44 firewalls.

## 2. Size of the three

| Measure | what-is-https | what-is-tcp | what-is-dns |
|---|---|---|---|
| Watch steps | 6 (https.ts:72-381) | 6 (tcp.ts:68-384) | 5 (dns.ts:76-274) |
| Step facts | 24 | 24 | 20 |
| Events | 20: 13 messages, 7 table, 0 notes | 19: 14 messages, 5 table, 0 notes | 11: 8 messages, 3 table, 0 notes |
| Learn terms | 8 (https.ts:384-393) | 8 (tcp.ts:387-396) | 8 (dns.ts:277-286) |
| Go deeper | 6 step + 1 Learn | 6 step + 1 Learn | 5 step + 1 Learn |
| Learn facts | 5 (https.ts:400-406) | 5 (tcp.ts:403-409) | 5 (dns.ts:293-299) |
| Practice | 2 questions, 3 + 3 options (https.ts:408-443) | 2 questions, 3 + 3 options (tcp.ts:411-444) | 2 questions, 3 + 3 options (dns.ts:301-334) |
| Scene layers | https:web (https.ts:47) | tcp:web (tcp.ts:44) | dns:names (dns.ts:49) |
| Scene views | network, sequence (https.ts:46) | network, sequence (tcp.ts:43) | network, sequence (dns.ts:48) |
| Page cue | steps 5 and 6: `page: 'text'` (https.ts:312), `page: 'full'` (https.ts:360) | step 5: `page: 'full'` (tcp.ts:319) | none |
| References named | RFC 2818 (https.ts:41); RFC 9110 (https.ts:42) | RFC 9293 (tcp.ts:40) | RFC 1034 (dns.ts:43); RFC 1035 (dns.ts:44) |
| In SOURCES? | RFC 2818: no. RFC 9110: yes, id `rfc-9110` (sources.ts:487) | yes, id `rfc-9293` (sources.ts:285) | RFC 1034: yes, `rfc-1034` (sources.ts:523); RFC 1035: yes, `rfc-1035` (sources.ts:294) |
| "Defined in" fact | "RFC 9110, RFC 8446" (https.ts:405) | "RFC 9293" (tcp.ts:408) | "RFC 1034, RFC 1035" (dns.ts:298) |

RFC 8446 (named by https.ts:405) has no reference line and no SOURCES entry (grep of src/content/*.ts for rfc-8446 and rfc8446 finds nothing). Matching is by RFC number, since registry urls end in .html.

## 3. What rests on each lesson

### Unit tests

**what-is-https**
- how-the-internet-works.test.ts:79 "78 Watch steps in all, 28 questions" (sum over all units).
- :113 HTTPS row: "HTTP Secure", "Web pages, sealed", group security, layers [7].
- :169 step counts `['https', 6]`.
- :177-184 titles: Client Request, DNS Resolution, TCP Connection, TLS Handshake, Encrypted HTTP Exchange, Secure Session.
- :256 pattern names `['DNS Resolution', 'TCP Connection', 'TLS Handshake', 'Encrypted HTTP']`.
- :276 quiet step: "Preparing a secure request", "Nothing on the network yet. The browser is still getting ready."
- :289 layers `['https:web']`.
- :318 message count 13 (index 1).
- :379-386 table `seen` cells: "DNS lookup", "TCP connection", "TLS hello", "The keys", "The request", "The reply", "The page itself".
- :620 parties: "DNS resolver 192.0.2.53", "Web server 198.51.100.7".
- :646 scene title "The same asking and answering, sealed on the way"; labels "Wants techconcepts.app".
- :724-727 https block of expectedReferences (RFC 2818, RFC 9110); the test takes the legacy branch at :749-750 (`toEqual`).
- :763 `uncited` map: `https: ['RFC 8446']`. The check at :765-770 expects [] for a cited lesson, so a cited https needs an RFC 8446 reference.
- :782 lessonTitles expects `['DNS','DNS','Subnetting','TCP','TLS/SSL','TLS/SSL']`. The https lesson supplies one 'DNS' (https.ts:95 "The DNS lesson shows how the resolver finds the answer.") and one 'TLS/SSL' (https.ts:208 "The TLS/SSL lesson takes the handshake one message at a time.").
- :1003-1026 padlock test (uses https steps and the lock cue).
- src/lib/home.test.ts:82-86 sealed: `{ title: 'HTTPS', lead: <https lead>, url: '/how-the-internet-works/what-is-https', number: 2 }`, and "seal the line".
- src/lib/home.test.ts:144-149 swaps https lead to "HTTPS statement 1..3" and expects it on Home.
- src/lib/home.test.ts:208-210 `homeDemo('what-is-https','what-is-tcp').learn.numbered` toBe(false). This breaks once https cites a source.
- src/lib/home.test.ts:221 `homeDemo('what-is-https','what-is-tcp').page` = {words 5, pictures 6}.
- src/content/legacy.test.ts:6 TOUR list (https, tcp, dns) and :8-9 legacy list check.

**what-is-tcp**
- how-the-internet-works.test.ts:79 (total steps, as above); :114 TCP row.
- :209-216 titles: Three-Way Handshake, Sequence and Acknowledgement, Packet Loss, Duplicate ACK and SACK, Retransmission, Connection Teardown.
- :257 pattern `['Handshake','Sequence','Acknowledge','Retransmit','Teardown']`.
- :290 layers `['tcp:web']`; :318 message count 14 (index 2).
- :321-347 test "TCP's lost piece": PIECE 2, dropAt 0.55 (:325), legend "Lost on the way" (:326), position 3 (:327), table `pieces` rows (:330-345).
- :621 parties "Web server 203.0.113.80".
- :647 scene "A page arrives whole, though a piece got lost", label "Wants a page".
- :728 expectedReferences `RFC 9293` row.
- :1025 `indexOf('tcp')`.
- :595 the string "Nothing yet. The TCP line is open..." belongs to the TLS unit's `handshake` table, not this lesson.
- src/content/legacy.test.ts:6 and :9 (TCP is in the TOUR list and the legacy filter).
- src/progress/store.test.ts:525 `what-is-tcp` in-progress at furthestPosition 6.

**what-is-dns**
- how-the-internet-works.test.ts:79 (total steps), :117 DNS row.
- :217 titles: Recursive Query, Root Referral, TLD Referral, Authoritative Answer, Response and Caching.
- :260 pattern `['Recursive Query','Root','TLD','Authoritative','Cache']`.
- :293 layers `['dns:names']`; :318 message count 8 (index 5).
- :426-430 table `learned` cells: `.app` / ask 192.0.2.20; techconcepts.app / ask ns1; techconcepts.app / 198.51.100.7 / ns1 / 5 min.
- :625 parties: Root server 192.0.2.10, .app server 192.0.2.20, ns1.techconcepts.app 198.51.100.40.
- :653 scene "The resolver asks its way down the name".
- :731-734 expectedReferences `RFC 1034` and `RFC 1035`.
- :782 lessonTitles 'DNS' is contributed by what-is-http.ts:169 and what-is-https.ts:95, not by DNS itself.
- src/art/scenes/net-map-layers.test.ts:14 `dns:names`; :55-60 the four lines of the `dns:names` plate ("Name servers", "root · 192.0.2.10", ".app · 192.0.2.20", "ns1 · 198.51.100.40"); :65 `plateSites(dns:names)`.
- src/content/legacy.test.ts:6.

### e2e (e2e/)
- e2e/site.spec.ts:202-205 Home sealed: "And HTTPS?", "HTTPS is HTTP with one extra job before the asking: seal the line.", link text "Lesson 2: HTTPS", href `/how-the-internet-works/what-is-https`.
- e2e/site.spec.ts:774-776 old position 30: HTTP, HTTPS and TCP show "✓ Done" (count-based: positions 0-25).
- e2e/site.spec.ts:1193-1200 test "7: a table of three columns..." uses `goTo(bySlug('what-is-tcp').path, 3)` (step 3, TCP's table `pieces`).
- e2e/site.spec.ts:1451-1457 and :1538 the Home sealed link `.demo__sealed a` (its target is https).
- e2e/global-setup.ts:40-42: every track-page stop must say "Checked" exactly when its slug is off LEGACY_LESSONS (`isChecked`, e2e/support.ts:18). A lesson that leaves the list must show a stamp; error text: "is off the legacy list but its stop says".
- No e2e spec quotes the TCP or DNS words, and none counts DNS steps.

### Home (src/lib/home.ts, src/pages/index.astro)
- home.ts:118 `homeDemo(slug='what-is-http', sealedSlug='what-is-https')`; index.astro:21 calls `homeDemo()`.
- home.ts:126-127 both lessons must be `available` in the registry.
- home.ts:191 `sealed: { title, lead: leadText(units[0].learn.lead), url, number }`. Home reads from what-is-https only: its title, the text of its Learn lead, its registry url and its track number (2, from how-the-internet-works.ts:23). It does not read its steps, references, stamp or cues.
- index.astro:194-199 renders it.
- what-is-tcp and what-is-dns are read by no Home page code; only tests pass them as sealedSlug or slug (home.test.ts:209, :221-223).
- index.astro:23-24 and about.astro:39-40: `lessonCheckCounts()` (src/lib/checked.ts:11-13) counts every cited ready lesson, so each move changes Home's and About's "checked" sentence.
- home.ts:175-179 the demo's stamp count only for the HTTP lesson.

### Progress (src/progress/)
- internet-split.ts:15 https 9 (positions 8-16); :16 tcp 9 (17-25); :19 dns 8 (42-49). The sizes equal maxPosition+1 (internet-split.test.ts:20).
- internet-split.test.ts:21 size list `[8, 9, 9, 8, 8, 8, 9, 9, 9, 8, 8, 9, 9, 9]`.
- internet-split.test.ts:36-43 test: positions up to 30 finish HTTP, HTTPS, TCP; UDP in-progress at 4.
- internet-split.test.ts:50, :55-56, :86-92 (https as a record; `Math.max(2, 10 - 8)` relies on https starting at 8).
- store.test.ts:523-525 v1 migration: keys include what-is-https and what-is-tcp; tcp in-progress at 6.

### Other lessons or pages that name them
- what-is-http.ts:169 "The DNS lesson shows how the resolver finds it." and :233 "The TCP lesson looks at it closely." Both are counted by how-the-internet-works.test.ts:782.
- what-is-https.ts:95 and :208 (above).
- what-is-tls.ts:7 and :75 say "The TCP line ..." (not the lesson).
- what-is-tcp.ts and what-is-dns.ts name no other lesson in their text (only their file headers, :7 and :447 / :7 and :337).
- Other test fixtures named what-is-https (src/lesson/Explanation.test.tsx:18-21, :247) are fakes made by makeLesson, not the real file.

## 4. Where three branches would collide

| File | Lines naming the three | What a move edits | Adjacent pairs |
|---|---|---|---|
| src/content/legacy.ts | 30 https, 31 tcp, 33 dns | deletes one line each | 30 and 31 are touching lines, so git reports a conflict; 33 is two lines below 31 (32 is ip) |
| src/content/legacy.test.ts | 6 TOUR (dns, https, tcp); 8 title ("15 lessons ... 12 of How the Internet Works"); 9 filter `p !== 'udp' && p !== 'http'` | title and filter | 8 and 9 are touching; all three edit both, so conflict is certain |
| src/content/sources.ts | none by slug. RFC ids: rfc-9110 487, rfc-1034 523, rfc-9293 285, rfc-1035 294; new entries go before `]);` at 609 | only if a source is added (https needs rfc-2818 and rfc-8446) | new entries from two branches meet at 608-609 |
| src/content/sources.test.ts | 228 title "then the HTTP lesson's"; 231 rfc-9293 and rfc-1035 on one line; 235 rfc-1034 and rfc-9110 on one line; 236 list ends; 237 `]);` | the title and the id list | every new id is appended at 236, so conflict is certain |
| src/content/tracks/how-the-internet-works.test.ts | 79, 169, 318 (counts); 113, 114, 117 (rows); 177-184, 209-216, 217 (titles); 256, 257, 260 (pattern); 276; 289, 290, 293 (layers); 379-381 and 426-430 (tables); 620, 621, 625 (parties); 646, 647, 653 (scene titles); 724-727, 728, 731-734 (references); 763 (uncited); 782 (lessonTitles); 1003-1026 (padlock) | counts and reference rows | adjacent: 216/217 (tcp titles close, dns titles open); 256/257 (https, tcp patterns); 289/290 (https, tcp layers); 620/621 (https, tcp parties); 646/647 (https, tcp scene titles) |

The What is HTTP move (commit d4fbed9) changed these lines in the shared files:
- legacy.ts:30 removed `'what-is-http'` (one line).
- legacy.test.ts:8-9 changed the count to 15 and 12 and added `&& p !== 'http'` to the filter.
- how-the-internet-works.test.ts:112 changed the HTTP row's full name to "Hypertext Transfer Protocol". That line is HTTP's, not one of the three.
- sources.ts gained nine rfc-9110..6335 entries including rfc-1034 (for DNS), three WHATWG entries and host list entries (line 42), iana-media-types and microsoft-app-gateway, at 178-609.
- sources.test.ts:160-170 changed the standards-body test; 228 changed its title; 229-236 gained 14 ids.

## 5. The rule

- A `defineLesson` lesson still on LEGACY_LESSONS: `defineLesson` (src/content/define.ts:387-389) runs `validateLesson` against SOURCES and does not check the list, so the lesson builds. The list check runs at registry import (src/content/registry.ts:251) through `checkLegacyList` (registry.ts:215-231), which throws `The legacy list is out of date:` followed by `"<slug>" is on the legacy list, but its lesson is cited; take it off the list.` (registry.ts:228). The build and the tests fail.
- A `defineLegacyLesson` lesson not on the list: src/content/legacy.ts:181-186 throws at import with `"<slug>" is not on the legacy list, which is closed: a new lesson is written in the cited shape.` A legacy-origin lesson that is not listed fails registry.ts:219-220 with `"<slug>" is a legacy lesson, but it is not on the legacy list, which is closed.`
- A cited lesson also needs a report: src/content/factcheck/gate.ts:28 `no fact-check report at docs/fact-checks/<slug>.md; run the fact-checker on it`. registry.ts:270 refuses that in build and tests and only warns in astro dev.
- legacy.ts:25-26 says each slug is removed from the list as it migrates.

## 6. The other twelve (sizes only)

| Slug | File | Watch steps | Events (messages / table / note) | Go deeper (step + Learn) | Practice Qs | References named (in SOURCES?) |
|---|---|---|---|---|---|---|
| what-is-ip | src/content/lessons/what-is-ip.ts | 5 | 12 (7 / 5 / 0) | 5 + 1 | 2 | RFC 791 (rfc-791, sources.ts:312) |
| what-is-dhcp | src/content/lessons/what-is-dhcp.ts | 6 | 18 (6 / 12 / 0) | 6 + 1 | 2 | RFC 2131 (rfc-2131, sources.ts:303) |
| what-is-tls | src/content/lessons/what-is-tls.ts | 6 | 18 (10 / 8 / 0) | 6 + 1 | 2 | RFC 8446 (no) (what-is-tls.ts:41) |
| what-is-icmp | src/content/lessons/what-is-icmp.ts | 6 | 21 (14 / 7 / 0) | 6 + 1 | 2 | RFC 792 (no) (what-is-icmp.ts:42) |
| what-is-smtp | src/content/lessons/what-is-smtp.ts | 6 | 37 (34 / 3 / 0) | 6 + 1 | 2 | RFC 5321 (no) (what-is-smtp.ts:43) |
| what-is-imap | src/content/lessons/what-is-imap.ts | 5 | 28 (24 / 4 / 0) | 5 + 1 | 2 | RFC 9051 (no) (what-is-imap.ts:44) |
| what-is-pop3 | src/content/lessons/what-is-pop3.ts | 5 | 32 (24 / 8 / 0) | 5 + 1 | 2 | RFC 1939 (no) (what-is-pop3.ts:41) |
| what-is-ftp | src/content/lessons/what-is-ftp.ts | 6 | 26 (20 / 6 / 0) | 6 + 1 | 2 | RFC 959 (no) (what-is-ftp.ts:43) |
| what-is-ssh | src/content/lessons/what-is-ssh.ts | 6 | 31 (25 / 6 / 0) | 6 + 1 | 2 | RFC 4251, RFC 4253 (no) (what-is-ssh.ts:41-42) |
| dhcp (Networking) | src/content/lessons/dhcp.ts | 5 | 8 (6 / 2 / 0) | 5 + 1 | 3 | RFC 2131 (rfc-2131), RFC 2132 (no) (dhcp.ts:266-267) |
| subnetting | src/content/lessons/subnetting.ts | 6 | 17 (0 / 0 / 17) | 6 + 1 | 3 | RFC 950, RFC 4632 (no) (subnetting.ts:144-145) |
| firewalls | src/content/lessons/firewalls.ts | 6 | 11 (6 / 4 / 1) | 6 + 1 | 3 | NIST SP 800-41 Rev. 1 (no; the host csrc.nist.gov/pubs is not in SOURCE_HOSTS) (firewalls.ts:37) |

The tour's what-is-dhcp and Networking's dhcp both use the unit id "dhcp"; the track test notes this at how-the-internet-works.test.ts:146-160 (not one of the three slugs).

## Not found

- No fact-check report for https, tcp or dns: docs/fact-checks holds osi-model.md, what-is-http.md, what-is-udp.md, what-is-udp.recheck.md and canary/. No docs/lesson-changes file for the three either.
- No registry entry for RFC 2818, RFC 8446, or NIST SP 800-41 (grep of src/content/sources.ts; csrc.nist.gov/pubs has no SOURCE_HOSTS entry at sources.ts:31-53).
- No e2e spec quotes TCP or DNS step words, and none counts DNS positions.
- src/content/sources.test.ts names none of the three slugs (its only hits are the source ids in section 4).
- src/lib/checked.test.ts uses no slug literal except 'osi-model' (checked.test.ts:11-22, generic).
