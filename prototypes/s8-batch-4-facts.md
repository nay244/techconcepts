# S8 scout: facts for batch 4 (What is FTP, What is SSH, What is TLS)

The repo on branch `revamp`, HEAD b18acd9, clean tree. Read only. Paths are repo-relative; line numbers are as the files are now. Short names: `ftp.ts` = `src/content/lessons/what-is-ftp.ts`, `ssh.ts` = `src/content/lessons/what-is-ssh.ts`, `tls.ts` = `src/content/lessons/what-is-tls.ts`, `https.ts` = `src/content/lessons/what-is-https.ts`, `track.ts` = `src/content/tracks/how-the-internet-works.ts`, `track.test.ts` = `src/content/tracks/how-the-internet-works.test.ts`. In the three lessons an event's line is the `...msg({` line that opens it (its `tag:` is on the next line); a `rows:` line is where the row list starts.

Corrections to the batch-2 report (`prototypes/s6-batch-2-facts.md`), out of date since batch 2 merged (4f36a0b): What is IP, What is DHCP and What is ICMP are cited now (`what-is-ip.ts:125`, `what-is-dhcp.ts:177`, `what-is-icmp.ts:136`); LEGACY_LESSONS has 9 entries at `legacy.ts:30-38`, not 12 at 30-42; `track.test.ts:763` now holds only `ssh`; `docs/fact-checks/` has `what-is-ip.md`, `what-is-dhcp.md` and `what-is-icmp.md`, and `docs/lesson-changes/` has the same three.

## 1. Order

Track `track.ts`, lessons in order (lines 22-64). Status is from each file's export line.

| # | Slug | track.ts line | Status now | Export line |
|---|---|---|---|---|
| 1 | what-is-http | 22 | cited | `what-is-http.ts:81` defineLesson |
| 2 | what-is-https | 23 | cited | `what-is-https.ts:128` defineLesson |
| 3 | what-is-tcp | 30 | cited | `what-is-tcp.ts:91` defineLesson |
| 4 | what-is-udp | 31 | cited | `what-is-udp.ts:94` defineLesson |
| 5 | what-is-ip | 32 | cited | `what-is-ip.ts:125` defineLesson |
| 6 | what-is-dns | 39 | cited | `what-is-dns.ts:98` defineLesson |
| 7 | what-is-dhcp | 40 | cited | `what-is-dhcp.ts:177` defineLesson |
| 8 | what-is-icmp | 41 | cited | `what-is-icmp.ts:136` defineLesson |
| 9 | what-is-smtp | 48 | legacy | `what-is-smtp.ts:743` defineLegacyLesson |
| 10 | what-is-pop3 | 49 | legacy | `what-is-pop3.ts:586` defineLegacyLesson |
| 11 | what-is-imap | 50 | legacy | `what-is-imap.ts:586` defineLegacyLesson |
| 12 | what-is-ftp | 57 | legacy | `ftp.ts:538` defineLegacyLesson |
| 13 | what-is-ssh | 58 | legacy | `ssh.ts:613` defineLegacyLesson |
| 14 | what-is-tls | 64 | legacy | `tls.ts:399` defineLegacyLesson |

Parts (`track.ts`): "Getting the data there" (id line 27, lessons 30-32); "Behind the scenes" (36-41); "Email" (45-50); "Files and remote control" (id 54, title 55, lessons FTP 57, SSH 58); "The seal" (id 62, title 63, lesson TLS 64 as 'TLS/SSL'). FTP and SSH are in part 5, TLS alone in part 6. Track title lines the test pins: `track.test.ts:69` `['Files and remote control', ['FTP', 'SSH']]`, `:70` `['The seal', ['TLS/SSL']]`.

`LEGACY_LESSONS` in `src/content/legacy.ts` (array lines 29-39): 30 `'what-is-smtp'`, 31 `'what-is-pop3'`, 32 `'what-is-imap'`, 33 `'what-is-ftp'`, 34 `'what-is-ssh'`, 35 `'what-is-tls'`, 36 `'subnetting'`, 37 `'dhcp'` (Networking), 38 `'firewalls'`. Line 39 is `] as const;`. Comment `legacy.ts:24-28` says the How the Internet Works lessons "keep their uncited words until each one's audit".

## 2. Size of the three

| Measure | ftp.ts (538 lines) | ssh.ts (613 lines) | tls.ts (399 lines) |
|---|---|---|---|
| Watch steps (`steps:` block) | 6, lines 70-480 | 6, lines 70-554 | 6, lines 69-334 |
| Step blocks, and title line (`title:`) | 71-150 Control Connection 73; 151-227 Plaintext Login 153; 228-274 Passive Mode 230; 275-368 Data Connection 277; 369-432 File Transfer 371; 433-479 Session Close 435 | 71-164 Version Exchange 73; 165-214 Algorithm Negotiation 167; 215-292 Key Exchange and Host Key Check 217; 293-368 Public-Key Authentication 295; 369-445 Channel Open 371; 446-553 Interactive Session 448 | 70-101 ClientHello 72; 102-138 ServerHello 104; 139-190 Certificate Verification 141; 191-239 Handshake Finished 193; 240-286 Encrypted Application Data 242; 287-333 Close Notify 289 |
| Step facts (`facts:`, 4 each, 24 in all) | 78-83, 158-163, 235-240, 282-287, 376-381, 440-445 | 78-83, 172-177, 222-227, 300-305, 376-381, 453-458 | 77-82, 109-114, 146-151, 198-203, 247-252, 294-299 |
| Go deeper (`deep:` per step) | 77, 157, 234, 281, 375, 439 | 77, 171, 221, 299, 375, 452 | 76, 108, 145, 197, 246, 293 |
| Messages (event lines) | 20: 85, 100, 115, 132 · 165, 180, 195, 210 · 242, 256 · 289, 304, 319, 337, 352 · 383, 399, 415 · 447, 461 | 25: 85, 100, 115, 132, 146 · 179, 193 · 229, 243, 258, 273 · 307, 321, 336, 350 · 383, 397, 412, 426 · 460, 475, 490, 505, 520, 535 | 10: 84 · 116 · 153, 171 · 205, 220 · 254, 268 · 301, 315 |
| Table rows (line of each row) | 6: 147 (`220`), 178 (`USER`), 208 (`PASS`, `miss: true`), 271 (`227`), 350 (`STOR`), 397 (`FILE`, `miss: true`) | 6: 161 (`ver`), 209 (`kex`), 210 (`cipher`), 256 (`host`), 365 (`login`), 442 (`chan`) | 8: 98 (`sni`), 132 (`ver`), 133 (`suite`), 134 (`kx`), 167 (`cert`), 168 (`ca`), 187 (`own`), 236 (`fin`) |
| Notes (other event types) | 0 | 0 | 0 (`messagesFor` at `internet-events.ts:68` is the only builder) |
| Quiet step (no events) | none | none | none |
| Learn terms (lines) | 8: 484-491 | 8: 558-565 | 9: 338-346 |
| Learn lead / pattern names / pattern note | lead 482; names 494; note 495 | lead 556; names 568; note 569 | lead 336; names 349; note 350 |
| Learn why / deep | why 497; deep 498 | why 571; deep 572 | why 352; deep 353 |
| Learn facts (`facts:`) | 5: 500-504 | 5: 574-578 | 5: 355-359 |
| "Defined in" fact | 504 `RFC 959` | 578 `RFC 4251 to 4254` | 359 `RFC 8446` |
| Practice ids (line), prompt, options, answer index | `second-connection` id 509, prompt 510, options 511-521, answer 522 = 1; `wifi-login` id 525, prompt 526, options 527-531, answer 532 = 0 | `host-key-changed` id 583, prompt 584, options 585-596, answer 597 = 0; `what-crosses` id 600, prompt 601, options 602-606, answer 607 = 1 | `same-secret` id 364, prompt 365, options 366-376, answer 377 = 1; `certificate-proves` id 380, prompt 381, options 382-392, answer 393 = 0 |
| Scene title / views / layers | 45 / 46 `['network', 'sequence']` / 47 `['ftp:files']` | 45 / 46 / 47 `['ssh:host']` | 44 / 45 / 46 `['tls:web']` |
| Scene labels | 48 `laptop: 'Uploading report.pdf', url: 'Files'` | 48 `laptop: 'Opening a terminal', url: 'Terminal'` | 47 `laptop: 'Wants a sealed line', url: 'techconcepts.app'` |
| Scene start | 49 `[]` | 49 `[]` | 48 `[{ cue: 'conn', arg: 'open laptop>web' }]` |
| Scene panel table (id, title, by, empty) | 50 `readable`; table def 20-32: id 21, title 22 'What someone watching can read', by 23 'FTP has no seal', markLabel 29 'exposed', empty 31 | 50 `agreed`; table def 18-29: id 19, title 20 'What the two sides agreed', by 21 'for this session', empty 28 | 49 `handshake`; table def 18-29: id 19, title 20 'The handshake so far', by 21 'what each side has said and checked', empty 28 |
| Scene log | 51 `eventLog()` (no extra legend) | 51 `eventLog()` | 50 `eventLog()` |
| Parties | 52-55: Laptop 192.168.1.100; File server 203.0.113.21 | 52-55: Laptop 192.168.1.100; Server 203.0.113.22 | 51-54: Laptop 192.168.1.100; Web server 198.51.100.7 |
| Overview hook / description / facts | hook 58; description 59-60; facts 61-68 | hook 58; description 59-60; facts 61-68 | hook 57; description 58-59; facts 60-67 |
| Unit name / full name / purpose / group / OSI | 38 `FTP`, 39 `File Transfer Protocol`, 40 `Moving files`, 41 `app`, 42 `osiLayers: [7]` | 35 `SSH`, 36 `Secure Shell`, 37 `Remote control, sealed`, 38 `security`, 39 `osiLayers: [7]` | 35 `TLS/SSL`, 36 `Transport Layer Security (SSL is its old name)`, 37 `The seal itself`, 38 `security`, 39 `osiLayers: [6]` |
| Learn terms (texts, for reference) | 484-491: Control connection; Port 21; USER, PASS; Passive mode (PASV); Data connection; STOR, RETR; Plain text; SFTP | 558-565: Version exchange; Algorithm negotiation (KEXINIT); Key exchange; Host key; known_hosts; Key pair; Channel; Shell | 338-346: ClientHello; ServerHello; Cipher suite; Key share; Shared secret; Certificate; Certificate authority (CA); Finished; close_notify |

Unit fields: `ftp.ts:38-42`, `ssh.ts:35-39`, `tls.ts:35-39` (name, full name, purpose, group, OSI layers, in that order).

Step-level lines of note: FTP step 2 sets `known: true` and `st: 'Logged in, not sealed'` (223, 224). SSH step 6 is the only SSH step with a `done: true` (549). TLS step 6 has `done: true` (329).

Cue lines (the helper turns these fields into cues, `internet-events.ts:115-125`; `fast` at 136; `bcast` at 133):

| Cue | ftp.ts | ssh.ts | tls.ts |
|---|---|---|---|
| `status` (from `st:`) | 129 Connecting, 145 Connected, 223 Logged in, not sealed, 269 Data port 50000, 333 Two lines open, 365 Ready to send, 396 Uploading, 428 report.pdf uploaded, 474 Done | 129 Connecting, 159 Connected, not sealed, 206 Tools agreed, 287 Sealed, server checked, 363 Logged in as alex, 439 At the prompt, 548 Ran ls | 97 Sealing the line, 129 Shared keys made, 185 Server checked, 233 Sealed, 281 Page received, sealed, 328 Closed safely |
| `status-known` (`known: true`) | 146, 224, 270, 334, 429 | 160, 207, 288, 364, 440 | 130, 186, 234, 282 |
| `status-done` (`done: true`) | 475 | 549 | 329 |
| `conn` (open / seal / close) | 130 open laptop>files; 335 open laptop>files data; 413 close laptop>files data; 476 close laptop>files | 130 open laptop>host; 289 seal laptop>host | 48 (start) open laptop>web; 235 seal laptop>web; 330 close laptop>web |
| `page` | none | 441 `page: 'text'` (PROMPT); 550 `page: 'full'` (OUTPUT) | 283 `page: 'full'` (ENCRYPTED, 18 KB) |
| `lock`, `tray`, `hold`, `addr`, `url` | none | none | none |
| `fast` (`fast: true`) | 92, 107, 122, 187, 296, 311, 326, 406 | 92, 107, 122, 265, 280, 328, 404, 467, 482, 497, 512, 527 | 178, 212 |
| miss (`miss: true` on a row) | 208 (PASS), 397 (FILE) | none | none |
| broadcast | none | none | none |

Page cues in detail:

- `ssh.ts:441` `page: 'text'`, on the PROMPT message (msg line 426, tag 427, sum 'alex@srv:~$'), step 5 Channel Open. Messages the story has shown before it: the TCP hello (85, 100, 115), both version lines (132, 146), KEXINIT (179, 193), KEX INIT and REPLY (229, 243), both NEWKEYS (258, 273), USERAUTH, PK OK, SIGNATURE, SUCCESS (307, 321, 336, 350), CHANNEL OPEN, CONFIRM, SHELL (383, 397, 412). Nothing has been fetched: no page, file or reply body has come from the server before this prompt.
- `ssh.ts:550` `page: 'full'`, on OUTPUT (msg 535, tag 536, sum 'notes.txt   reports   site'), step 6 Interactive Session. Messages before it: PROMPT (426), KEY l, ECHO l, KEY s, ECHO s, KEY ENTER (460, 475, 490, 505, 520) and all earlier ones.
- `tls.ts:283` `page: 'full'`, on the ENCRYPTED reply of 18 KB (msg 268, tag 269, sum 'Inside the seal: 200 OK, and the page.'), step 5 Encrypted Application Data. Messages before it: CLIENT HELLO (84), SERVER HELLO (116), CERTIFICATE (153), CERT VERIFY (171), FINISHED (205, 220) and the laptop's ENCRYPTED request (254, sum 'Inside the seal: GET /.'). The only request before the reply is `GET /`; no picture or other file is requested anywhere in the story.
- What the cues draw, from the code: `src/scenes/drivers/net-map.ts:229` `const wants = (state, el) => state.page === 'full' || (state.page === 'text' && el.dataset.part === 'text');`. The state's `page` is set from the last `page` cue applied (`net-map.ts:262-265`; `settle` starts the state with `page: ''`). `'text'` shows only the parts marked `data-part="text"`; `'full'` shows every part of the page. The art: `src/art/scenes/net-map.ts:88-93`: "The page, in two parts: its text arrives first, its picture after." The background (`:90`) and the text lines (`:91-92`) are `data-part="text"`; the picture square (`:93`) is `data-part="pic"`. So `'text'` draws the page's words only; `'full'` also draws the picture square. A page that lands fades in its parts not yet shown, in DOM order (`net-map.ts:433-441`).
- Other cue kinds in the three: none of `lock`, `tray`, `hold`, `addr`, `url`, `bcast`. FTP's `conn ... data` cues (335, 413) draw the dashed second line (`net-map.ts:21`, `:54`, `:62`).

## 3. What rests on each lesson

Track test (`src/content/tracks/how-the-internet-works.test.ts`), by line:

- 17-18: TOUR is the track's 14 entries, read by slug. 23: PROTOCOLS includes 'ftp', 'ssh', 'tls'. 76: `TOUR.map((l) => l.units[0]!.id)` equals PROTOCOLS.
- 58: the track description names the three: "...from HTTP and DNS to email, SSH and TLS, one short lesson each. ...". (`track.ts:14` holds the same words.)
- 69-70: the part titles and lesson titles, quoted above.
- 79-81: "78 Watch steps in all, 28 questions". The three together contribute 18 steps and 6 questions (6 + 6 + 6; 2 each).
- 116-136: the row check for each TOUR lesson. 123-125: rows `['FTP', 'File Transfer Protocol', 'Moving files', 'app', { layers: [7], cite: [] }]`, `['SSH', 'Secure Shell', 'Remote control, sealed', 'security', { layers: [7], cite: [] }]`, `['TLS/SSL', 'Transport Layer Security (SSL is its old name)', 'The seal itself', 'security', { layers: [6], cite: [] }]`. Line 130 `if (isLegacy(lesson))` decides which row test applies.
- 161-163: each lesson validates; 2 questions each.
- 170: step counts `['ftp', 6], ['ssh', 6], ['tls', 6]`.
- 228-235 FTP step titles (Control Connection, Plaintext Login, Passive Mode, Data Connection, File Transfer, Session Close). 236-243 SSH step titles. 244-251 TLS step titles (ClientHello, ServerHello, Certificate Verification, Handshake Finished, Encrypted Application Data, Close Notify).
- 254-268: pattern names; 266 FTP `['Control Connection', 'Login', 'PASV', 'Data Connection', 'Transfer', 'QUIT']`; 267 SSH `['Version Exchange', 'Negotiation', 'Key Exchange', 'Authentication', 'Channel']`; 268 TLS `['ClientHello', 'ServerHello', 'Certificate', 'Finished', 'Application Data']`.
- 277-278: the quiet-step test; none of the three is in it.
- 300-302: layers `['ftp:files']`, `['ssh:host']`, `['tls:web']`.
- 318: message counts. Index 11 (ftp) = 20, index 12 (ssh) = 25, index 13 (tls) = 10. These agree with the counts above.
- 446-455: FTP `readable` cells (446-453) and `missed` = `['PASS', 'The file']` (455). 456-457: the only table with a `markLabel` is `readable` with 'exposed'.
- 458-465: SSH `agreed` cells (459-464: Version, Key exchange, Cipher, Host key, Login, Channel).
- 466-474: TLS `handshake` cells (467-474: Name asked for, Version, Cipher suite, Key exchange, Name on certificate, Signed by, Server owns that key, Handshake).
- 576: FTP's table `by` 'FTP has no seal' (inside the table-definition test, 566-580).
- 686-691: a comment "POP3, IMAP, FTP, SSH and TLS send only requests and replies." and five empty legend arrays (687-691): these are the legends for POP3, IMAP, FTP, SSH and TLS.
- 695-699: the MAC test. None of the three has a MAC address, so none adds to the set {00:00:5E:00:53:10, 00:00:5E:00:53:01, ff:ff:ff:ff:ff:ff}.
- 719-745: `expectedReferences`. FTP at 740 `[{ label: 'RFC 959: File Transfer Protocol', url: 'https://www.rfc-editor.org/rfc/rfc959' }]`; SSH at 741-744 (742 `RFC 4251: The Secure Shell (SSH) Protocol Architecture`, 743 `RFC 4253: The Secure Shell (SSH) Transport Layer Protocol`); TLS at 745 `[{ label: 'RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3', url: 'https://www.rfc-editor.org/rfc/rfc8446' }]`. These are compared exactly only for legacy lessons (`if (isLegacy(lesson))` at 749); a cited lesson only needs a non-empty list of https URLs.
- 759-763: the comment at 759-762 names SSH's "RFC 4251 to 4254" that it does not cite, 4252 and 4254. Line 763, quoted in full: `const uncited: Record<string, string[]> = { ssh: ['RFC 4252', 'RFC 4254'] };`. Its only entry now is `ssh`. A comment just above line 775 says "The exceptions are for lessons still uncited; a cited lesson's facts must cite what they name."
- 771: `rfcsIn` reads each lesson's "Defined in" fact. 775: `expect(missing, u.id).toEqual(isLegacy(TOUR[i]!) ? (uncited[u.id] ?? []) : [])`. So when SSH is cited, its references must include labels starting `RFC 4251:`, `RFC 4252:`, `RFC 4253:` and `RFC 4254:`; for TLS, labels starting `RFC 8446:` (or the RFC the lesson names); for FTP, `RFC 959:`. Each named RFC must be a reference label.
- 782: `lessonTitles` must equal `['DNS', 'DNS', 'Subnetting', 'TCP', 'TLS/SSL', 'TLS/SSL']`. Its two 'TLS/SSL' sentences are `https.ts:386` ("The TLS/SSL lesson takes the handshake one message at a time.") and `what-is-smtp.ts:79` ("The TLS/SSL lesson covers the handshake."). Its two 'DNS' sentences are `what-is-http.ts:169` and `https.ts:219`; 'TCP' is `what-is-http.ts:233` ("The TCP lesson looks at it closely."); 'Subnetting' is `what-is-ip.ts:587`. The regex is `/\b[Tt]he ([A-Z][\w/]*(?: [A-Z][\w/]*)*) lesson\b/g` (`src/test/lesson-references.ts:41`). Moving these three does not change this list unless their own text adds "The X lesson" (none does now).
- 829-843: the first position is HTTP; the last is TLS: `expect(last).toMatchObject({ layers: ['tls:web'], conns: [], status: ['Closed safely', 'nm-state done'] })` (843).
- 865: `tls: { lit: [], conns: ['nm-conn'] }` (the Overview starts that have something on the map).
- 890-893: starts. `['tls', [{ cue: 'conn', arg: 'open laptop>web' }]]` (893). 'FTP and SSH have none'.
- 912-928: FTP has no letters (912-913); TLS's line is open before its ClientHello (916-921); SSH has no line before it (926).
- 933-978: the connection tests. FTP 946-959 (control line; data line dashed, class `nm-conn alt`, transform `translate(0 -6)`; the FIN closes the data line; QUIT closes control). SSH 963-967 (opened by TCP hello; sealed by the server's NEWKEYS; stays sealed). TLS 972-978 (sealed by the browser's Finished at step 4; stays sealed for the page; closes after close_notify, at Learn).
- 1028-1111 (ICMP stops; IP and DHCP overview callouts): none names the three.
- Generic loops over all 14 lessons, so they cover the three: 162 (checkStructure), 309-318 (each message's places and layers; the count at 318), 616, 671, 710-716 (log-cell widths). 1020-1030 is the HTTPS padlock test, which names HTTPS only.

Other unit tests:

- `src/content/legacy.test.ts`: 6 TOUR list (contains 'dhcp', 'dns', 'ftp', 'http', 'https', 'icmp', 'imap', 'ip', 'pop3', 'smtp', 'ssh', 'tcp', 'tls', 'udp'). 8 title: "the legacy list is exactly the nine lessons not yet moved: six of How the Internet Works and three of Networking (it may only shrink)". 9 expected list: `['dhcp', 'firewalls', 'subnetting', ...TOUR.filter((p) => p !== 'udp' && p !== 'http' && p !== 'dns' && p !== 'tcp' && p !== 'https' && p !== 'dhcp' && p !== 'icmp' && p !== 'ip').map((p) => `what-is-${p}`)]`. It yields `what-is-ftp`, `what-is-imap`, `what-is-pop3`, `what-is-smtp`, `what-is-ssh`, `what-is-tls` after the literal three. The filter on line 9 has to drop `ftp`, `ssh` and `tls` when they move.
- `src/progress/internet-split.ts:25-27`: `['what-is-ftp', 9]`, `['what-is-ssh', 9]`, `['what-is-tls', 9]`. `internet-split.test.ts:20` requires each size to equal the lesson's `maxPosition + 1`; `:21` the size list `[8, 9, 9, 8, 8, 8, 9, 9, 9, 8, 8, 9, 9, 9]` (ends with the three 9s); `:22` the sum 120. A move keeps these only if steps and Practice stay 6 and 2.
- `src/art/scenes/net-map-layers.test.ts:20-22`: the key list ends `'ftp:files'`, `'ssh:host'`, `'tls:web'`. `:64`: `plateSites(NET_MAP_LAYERS['ftp:files']!)` equals `['files']`.
- `src/art/scenes/net-map-layers.ts:122-124`: `'ftp:files': host('files', 'FILES.EXAMPLE.NET', 'File server', '203.0.113.21 · port 21')`, `'ssh:host': host('host', 'SRV.EXAMPLE.NET', 'A server', '203.0.113.22 · port 22')`, `'tls:web': web('TECHCONCEPTS.APP', '198.51.100.7 · port 443')`. These plate labels are on the map, so they are reader-facing text.
- `src/art/scenes/net-map.test.ts:29`: PROTOCOLS includes 'ftp', 'ssh', 'tls'. `:81`: "a route exists between every pair of places a protocol uses" (the test at line 81) loops over those protocols.
- `src/scenes/drivers/net-map.test.ts:179-192`: FTP's data line is dashed, drawn above, closes on its own (`'open laptop>files data'`, `'close laptop>files data'`). `:194-214`: TLS's line is open before anything has played (`start: [open]`), sealed (`seal laptop>web`) and closed (`close laptop>web`). `:541-542`: a sweep list runs `['ftp:files']` and `['tls:web']` with the start `open laptop>web`. `:652`: a router label of three lines throws on `ftp:files`.
- `src/scenes/drivers/net-map.ts:21, 30-31, 54, 62`: comments naming FTP's data line and TLS's handshake.
- `src/art/scenes/net-map.css:45`: comment "TLS seals it brighter; FTP's data line is dashed". `src/art/scenes/parts.ts:43`: comment naming TLS's open line.
- `src/art/figures/name-tile.test.ts:21`: `nameTile('TLS/SSL', 'Transport Layer Security')` is set at font size 74. `:27-30`: `nameTile('TLS/SSL', 'Transport Layer Security (SSL is its old name)')` wraps to `['Transport Layer Security', '(SSL is its old name)']`. These pin the unit's `name` (35) and `fullName` (36) words.
- `src/lib/text.test.ts:8-11` and `src/lib/tracks-page.test.ts:11-13`: the track description's first sentence "Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each." (`track.ts:14`).
- `src/lesson/Explanation.test.tsx:19-21, 228`: a fixture `makeLesson({ slug: 'what-is-tls', title: 'TLS/SSL' })` and the track's last-lesson line, "That’s the whole lesson, and the last lesson of this track." Fixture, not the real lesson.
- `src/lesson/panels/TablePanel.test.tsx:197`: comment "FTP's password and file: exposed, not missing." The assertions below use a local `def`.
- `src/content/registry.test.ts:49`: Networking's SLUGS list has `'tls'` (Networking's own TLS entry, `src/content/tracks/networking.ts:69` `{ slug: 'tls', title: 'TLS' }`). `:218`: `getEntries('how-the-internet-works')` has length 14.
- `src/lib/track.test.ts:33-46`: part titles and ready counts ('Files and remote control' 2 of 2; 'The seal' 1 of 1). `:125`: every entry's stamp is checked iff `origin === 'cited'` (generic).
- `src/content/sources.test.ts:236-267`: `expect(Object.keys(SOURCES)).toEqual([...])`, an exact ordered list. `rfc-959` is at 249 (inside the TCP block). The list ends at 266 (ICMP's last entry); `]);` at 267.
- `src/lib/home.test.ts`: names none of the three. It names HTTPS only: 87 (the sealed box), 97-100 (the lesson Home's "And HTTPS?" points to), 218 (`learn.stamp` is `{ checked: '2026-11-11', sources: 20 }`, HTTPS's). `src/lib/home.ts` reads only the HTTP and HTTPS lessons (`homeDemo(slug = 'what-is-http', sealedSlug = 'what-is-https')`, line 118 per s6). `home.ts:166-169` require a `page: 'full'` cue in the demo's lesson, which is HTTP.
- `src/lib/start.test.ts`: names HTTP only (5). `src/lib/about.test.ts`: computed counts only (28-40).
- `src/content/lessons/`: no test file for the three; the only lesson test there is `dhcp.test.ts`.

e2e (`e2e/`):

- `e2e/site.spec.ts:37`: `const INTERNET_PARTS = ['Loading a web page', 'Getting the data there', 'Behind the scenes', 'Email', 'Files and remote control', 'The seal'];`
- `e2e/site.spec.ts:601-612` (test "Track page: How the Internet Works has six parts and a name tile on each of 14 stops"): `expect(routeStops(page)).toHaveCount(14)` (608); `stageTitles(page)` equals `INTERNET_PARTS` at 606 and `:611` `expect(lessonCard(page, 'what-is-tls').locator('.name-tile')).toHaveAttribute('aria-label', 'Transport Layer Security (SSL is its old name)')`; `:612` `expect(lessonCard(page, 'what-is-tls').locator('.nt-full')).toHaveCount(2)`. These are the only e2e lines that name one of the three.
- Generic loops: `e2e/support.ts:33-36` `readyLessons()` reads the built track's ready lessons; used by `e2e/lesson.spec.ts:27`, `e2e/reading.spec.ts:9`, `e2e/site.spec.ts:22`, `e2e/visual.spec.ts:22`. `e2e/global-setup.ts:40-42`: each track stop says "Checked" exactly when its slug is off `LEGACY_LESSONS`.
- No e2e spec quotes the three's words, counts their steps, or uses their step numbers.

Other lessons and pages (sentences that point at a lesson by its title, "The X lesson"):

- `https.ts:386` "The TLS/SSL lesson takes the handshake one message at a time." (TLS, points to TLS.)
- `https.ts:219` "The DNS lesson shows how the resolver finds the answer."
- `what-is-smtp.ts:79` "The TLS/SSL lesson covers the handshake." (SMTP, legacy, batch 3; points to TLS.)
- `what-is-http.ts:169` "The DNS lesson shows how the resolver finds it."; `what-is-http.ts:233` "The TCP lesson looks at it closely."
- Nothing in `ftp.ts`, `ssh.ts` or `tls.ts` reader-facing text says "the X lesson" for any lesson. Their only "lesson" words are the header comments (`ftp.ts:7`, `ssh.ts:7`, `tls.ts:7`, and the export comments at `ftp.ts:537`, `ssh.ts:612`, `tls.ts:398`).
- Old plans, not tests: `docs/superpowers/plans/2026-11-08-how-the-internet-works-track.md:148` "`The TLS/SSL lesson takes the handshake one message at a time.`" and `:149` "`The TLS/SSL lesson covers the handshake`". These are the rewrite instructions of the earlier plan.

## 4. What tls and https say

What is HTTPS (`https.ts`, cited and checked) and What is TLS (`tls.ts`, legacy). Each pair is marked. "Same words" means the same words; "same idea, different words" means the same claim in other words; "they differ" states the difference.

| Idea | https.ts | tls.ts | Mark |
|---|---|---|---|
| TLS version named | 386 "This is TLS 1.3."; 401 fact `Version` = `TLS 1.3` | 62 overview `Current version` = `TLS 1.3`; 78 `Versions` = `TLS 1.3, 1.2`; 110 and 132 `TLS 1.3`; 355 `Current` = `TLS 1.3 (1.2 still common)` | same words (TLS 1.3); tls.ts also names 1.2 and the retired versions (356) |
| Messages and their order | 386: "the ServerHello, certificate, CertificateVerify and Finished come back in one flight; the client’s Finished completes it." Events: CLIENT HELLO (407), SERVER HELLO (427; info 444 "TLS ServerHello, Certificate, CertificateVerify, Finished"), FINISHED from laptop (446, tag 454) | 84 CLIENT HELLO, 116 SERVER HELLO, 153 CERTIFICATE, 171 CERT VERIFY, 205 FINISHED (server), 220 FINISHED (client); 197: "the server’s EncryptedExtensions, Certificate, CertificateVerify and Finished all arrive in one flight ... this walkthrough takes them one at a time" | same idea, different words: the same order, but https.ts shows the server's flight as one message and tls.ts shows each. EncryptedExtensions is named only in tls.ts:197 |
| Round trips | 386 "Sealing costs one round trip."; 404 `Costs` = `one more round trip`; 844 "it costs one round trip" | 202 `Round trips` = `one (TLS 1.2 took two)`; 336 lead "In one round trip, two strangers agreed..."; 108 HelloRetryRequest "costing a round trip" | same idea, different words; only tls.ts compares with TLS 1.2 |
| Certificate: what it proves, who signs | 383 "an ID card signed by an organisation browsers trust, and the browser checks that it really says techconcepts.app"; 691-693 term `Certificate`: "The site’s ID card, signed by someone trusted"; 697-699 `Certificate authority (CA)`; 752 chain via an intermediate; 740 "the certificate stops someone pretending to be the site"; 787-788 `X.509, signed by a CA` | 144 "a document saying “this key belongs to techconcepts.app”, signed by a certificate authority (CA)"; 144 three checks: "the name matches, the dates are valid, and the signatures lead back to a CA it already trusts"; 148 `an intermediate CA, under a trusted root`; 358 `X.509, from a CA`; 145 deep: root in the trust store; revocation and Certificate Transparency checked | same idea, different words. tls.ts adds the three checks and the revocation/CT checks (145), which https.ts does not state |
| What CertificateVerify proves | Named in 386 and 444 only; https.ts does not say what it proves | 144 "the server signs the whole handshake with its private key, the CertificateVerify, to prove the certificate is really its own"; 150 `Proof of the key` = `CertificateVerify` | they differ: only tls.ts says what it proves |
| Key exchange named | 383 "clever maths that gives each of them the same secret key, without the key ever crossing the network"; 386 "usually X25519, which browsers now pair with ML-KEM, a post-quantum method"; 403 `Shared key made by` = `X25519 with ML-KEM`; 857 same as 386 | 108 "elliptic-curve Diffie-Hellman, X25519 here"; 76 "usually X25519 first; newer browsers add a post-quantum hybrid (X25519MLKEM768)"; 112 fact `Key exchange` = `X25519`; 134 row `X25519`; 128 log "key share X25519" | they differ: https.ts says browsers pair X25519 with ML-KEM and names "X25519 with ML-KEM" (403); the ServerHello in tls.ts shows X25519 alone (112, 128, 134). tls.ts does not write "ML-KEM" (only X25519MLKEM768 at 76) |
| Cipher suite | 497 `Cipher` = `AES-128-GCM`; 885 "(AES-128-GCM, AES-256-GCM or ChaCha20-Poly1305)"; no string `TLS_AES_128_GCM_SHA256` in https.ts | 111 and 133 `TLS_AES_128_GCM_SHA256`; 79 `AES-128-GCM, ChaCha20-Poly1305 and others`; 249 `AES-128-GCM`; 76 "TLS 1.3 has five cipher suites" | same idea; only tls.ts names the suite string |
| Session keys | 703-704 term `Shared key`: "The same secret, made on both sides" | 108 "From the shared secret, both sides derive separate keys for each direction (with HKDF)"; 342 `Shared secret` | same idea, different words; only tls.ts says keys are derived per direction (HKDF) |
| Forward secrecy | not stated | 108 "Every connection uses fresh key shares..."; 113 `Forward secrecy` = `yes: fresh keys every time` | they differ: only tls.ts states it |
| What a watcher can see | 793 `Watchers still see` = "addresses and ports, the site’s name (SNI), sizes and timing"; 216 the lookup "isn’t sealed"; 482 "A watcher still sees the sizes and timing of records, and the addresses. The path (such as /account), cookies and passwords are all inside the seal."; 386 SNI in plain text, ECH "can hide it" | 80 `Name (SNI)` = `techconcepts.app, in plain view`; 76 SNI "unencrypted"; 246 "A watcher still sees each record’s size and timing." | same idea for the name (SNI) and sizes and timing. https.ts alone names the path, cookies and passwords (482) and Encrypted Client Hello (386) |
| Port | 170 `Port` = `TCP 443`; 775-776 `443 (the default for https; plain HTTP: 80)`; 287 "port 443 is the port reserved for HTTPS" | 16 `WEB = '198.51.100.7:443'`; 66 `This example` = `techconcepts.app, port 443` | same example; tls.ts does not say that 443 is TLS's own port |
| Padlock | 559, 562, 575 `Padlock means` = `encrypted, and the name checked out`, 576 `Doesn’t mean` = `the site is safe or honest`; 912; practice 942-957 | none | https.ts only |
| Session ticket and resumption | 899-901 `Session ticket`: "a later visit can resume with it, skip the certificate, and even send its first request at once (0-RTT)"; 562 same, "Resuming with a ticket (a pre-shared key) skips the certificate" | 197 "A resumed connection can even send data with its very first message (0-RTT), at the cost of replay protection." | same idea, different words; https.ts says resume skips the certificate; tls.ts gives the replay cost, which https.ts does not |
| Records | 482 "sealed with a check that catches any change"; 885 "one altered on the way ends the connection" | 246 "a TLS record of up to 16 KB with AEAD ... Every record has its own sequence number, so records can’t be replayed or reordered"; 250 `up to 16 KB, numbered`; 251 `detected, and the connection drops` | same idea. 16 KB and sequence numbers are in tls.ts only |
| close_notify | none | 292-297, 301-315: "close_notify" as the sealed close; 293 "truncation attack" | tls.ts only |
| What Finished proves | 386 "the client’s Finished completes it"; 444 and 454 events; no statement of what it proves | 196 "If anyone had changed a single byte on the way, the codes wouldn’t match and the connection would stop"; 201 fact `Proves` = `nobody changed the handshake`; 197 HMAC | they differ: only tls.ts says what Finished proves |
| The 200 OK reply | 545 sum "Inside the seal: 200 OK, and the page." | 279 sum "Inside the seal: 200 OK, and the page." | same words |
| The request | 518 "Inside the seal: GET /, please send the front page." | 265 "Inside the seal: GET /." | same idea, different words |
| Page cue | `page: 'text'` at 626 on the stylesheet reply (msg 602, tag 612; step 6); no `full` cue; 626 is the only page cue | `page: 'full'` at 283 on the 18 KB page reply (step 5) | they differ: https.ts draws the words only, and says so in `docs/lesson-changes/what-is-https.md:34` (see below) |
| OSI badge | 145 `osi: { layers: [7], cite: [MS_L7, CF_L7] }` | 39 `osiLayers: [6]`, `cite: []`; 65 `Sits`: "between TCP and the app" | they differ: layer 7 (https.ts) against layer 6 (tls.ts) |
| Sizes of messages | HTTPS's handshake messages show `size: '—'` (421, 442, 463, 647), and its DNS and TCP messages too (251, 269, 326, 345, 367) | `size: '517 B'` (94), '122 B' (126), '2.9 KB' (163), '264 B' (182), '74 B' (216) | they differ. `docs/lesson-changes/what-is-https.md:54-55` (rows 8 and 9) ruled the browser's ClientHello size wrong and changed the row to a dash; no source states sizes |
| Defined in | 799 `RFC 9110, RFC 9846` | 359 `RFC 8446` | they differ (see §4 documents): https.ts names RFC 9846 |

The sentence in `tls.ts:57` "TLS is the seal that HTTPS, secure email and many apps use." and the sentence `https.ts:135` "HTTPS is HTTP inside a sealed envelope." are the two overview hooks.

Documents, quoted:

- `docs/direction.md:54` (decision 2.26): "**TLS 1.3 is RFC 9846**, which made RFC 8446 obsolete in July 2026; RFC 2818 has been obsolete since RFC 9110. **Three marks on the figure change and no step does** ... What is HTTPS draws the page's words when the stylesheet arrives, at step 6 and not step 5, and draws no pictures, since it fetches none."
- `docs/direction.md:53` (decision 2.25): "What is FTP, What is SSH and What is TLS" is batch 4, and the batch order is set; each batch is a job with a fresh session.
- `docs/direction.md:117`: says Batch 1 (What is HTTPS, What is TCP and What is DNS) is done (2026-11-11).
- `docs/lesson-changes/what-is-https.md:11` (item 3): "**TLS 1.3 now means RFC 9846, and the key exchange has a post-quantum half.** RFC 8446 is obsolete, replaced by RFC 9846, and "usually X25519" is no longer the ordinary case: browsers pair it with ML-KEM by default."
- `docs/lesson-changes/what-is-https.md:34` (table row 13): "The whole page appears, pictures included" → "The page's words appear"; reason: "This lesson fetches no picture, so there is nothing to draw beyond the words."
- `docs/lesson-changes/what-is-https.md:36` (table row 15): "RFC 9110, RFC 8446" → "RFC 9110, RFC 9846".
- `docs/lesson-changes/what-is-https.md:54-55` (rows 8 and 9): CLIENT HELLO size "517 B" called wrong ("a browser's ClientHello carries a 1,216-byte X25519MLKEM768 share alone (RFC 10024 §4.1). Shown as a dash."); SERVER HELLO "4.3 KB" called unsourced, shown as a dash.
- `docs/lesson-changes/what-is-https.md:104`: "The TLS handshake descriptions leave out EncryptedExtensions in the server's flight".
- `docs/lesson-changes/what-is-https.md:105`: "'The key exchange is usually X25519': the hybrid default is stated by Cloudflare's page and X25519's wide use by RFC 10024."
- `docs/fact-checks/what-is-https.md:644`: "Note: RFC 9846 (July 2026) obsoletes RFC 8446 and is current ... 'TLS/SSL lesson' is a lesson's name, not a claim that HTTPS runs over SSL."
- `plan.md:33`: "What is DHCP is written so Networking's DHCP can agree with it. Its analyst notes what a beginner is told here ... as What is HTTPS's did for What is TLS." (This note is about DHCP; it names What is TLS only as a precedent.)
- `plan.md:76`: batch 4 row: "| 4 | What is FTP, What is SSH, What is TLS |".
- `team.md:391`: "**A page cue stays only where the story fetched what it draws.** What is IMAP and What is TLS carry `page: 'full'` and What is POP3 and What is SSH both cues; rule it for each from its analyst's report, as here." (The sentence as written; the cue counts in the file are 'full' for TLS (283), 'text' and 'full' for SSH (441, 550).)
- `team.md:295`: What is HTTPS's analyst report: "two page cues do (direction 2.26)".

What is SSH and What is FTP against the eight cited lessons (ideas they share):

- TCP handshake (SYN, SYN-ACK, ACK): `ssh.ts:76` "After the TCP hello on **port 22**"; `ftp.ts:76` "After the usual TCP hello"; cited: `what-is-tcp.ts:144-145` value `a three-way handshake`, `:171` id `three-way-handshake`, `:175` "Before any data moves, both sides make sure they can hear each other."; `what-is-https.ts:284` "Next comes the TCP handshake, exactly as for plain HTTP: hello, hello back, OK."
- Ports: `ssh.ts:63` `Port` = `TCP 22`, `ssh.ts:80` `Port` = `22`; `ftp.ts:76` "port 21", `ftp.ts:80` `Port` = `21`; cited: `what-is-tcp.ts:899` value `80 HTTP, 443 HTTPS, 22 SSH, 25 SMTP`; `what-is-http.ts:236` "connects to port 80"; `what-is-https.ts:170` `Port` = `TCP 443`; `what-is-dns.ts:214` `UDP port 53`; `what-is-dhcp.ts:328` and `:333` `port 68`, `port 67`.
- Plain text versus sealed: `ftp.ts:65` `Encrypted?` = `no; use SFTP or FTPS`; `ftp.ts:161` `Sealed?` = `no: plain text`; `ssh.ts:82` `Sealed?` = `not yet`; cited: `what-is-http.ts:45` "HTTP/1.1 is plain text"; `what-is-https.ts:135` "HTTPS is HTTP inside a sealed envelope"; `what-is-dns.ts:718-720` `Encrypted` = `DoH (443), DoT (853)`; `what-is-ip.ts:657` feedback "NAT doesn’t encrypt anything."
- Keys and a shared secret: `ssh.ts:220` "Combining the other side’s public half with its own secret half gives both of them the same **shared secret**"; `ssh.ts:221` "Diffie-Hellman (here X25519 combined with a post-quantum method)"; `ssh.ts:224` `Host key` = `ssh-ed25519, signs the exchange`; cited: `https.ts:383` "clever maths that gives each of them the same secret key, without the key ever crossing the network"; `https.ts:386` "The key exchange is usually X25519, which browsers now pair with ML-KEM"; `https.ts:703-704` term `Shared key`. The eight cited lessons do not name a public key, private key or host key (grep finds none, and `what-is-tcp.ts:899` only matches "SSH" as a port name).
- Post-quantum hybrid key exchange: `ssh.ts:171` `sntrup761x25519-sha512`, "mixes X25519 with a post-quantum method"; `https.ts:386` names ML-KEM and `:403` "X25519 with ML-KEM". Different named methods.

## 5. Where three branches would collide

Lines are as they are now (HEAD b18acd9). Batch 3 (SMTP, POP3, IMAP) merges before batch 4 and shifts these numbers; re-count after it.

| File | Lines that name the three now | What each move edits | Touching pairs |
|---|---|---|---|
| `src/content/legacy.ts` | 33 (`'what-is-ftp'`), 34 (`'what-is-ssh'`), 35 (`'what-is-tls'`). The comment at 24-28 mentions the tour lessons | each branch deletes its own line; each could also edit the comment at 25-28 | 33, 34 and 35 are consecutive. Every pair touches; so do 32 (IMAP, batch 3) and 36 (`subnetting`) |
| `src/content/legacy.test.ts` | 6 (TOUR list), 8 (test title: "nine lessons ... six of How the Internet Works and three of Networking"), 9 (expected list and filter) | every move edits 8 (counts in the title) and 9 (adds `p !== 'ftp'`, `p !== 'ssh'`, `p !== 'tls'` to the filter) | 8 and 9 are consecutive; each branch edits both. Every pair collides |
| `src/content/sources.ts` | FTP uses `rfc-959`, already present (id line 902; entry 901-909), so FTP adds nothing. SSH needs RFC 4251 and RFC 4253 (and RFC 4252 and RFC 4254 once cited); none is present. TLS: if it cites RFC 9846 (present at 623-630), it adds nothing. The list ends with `paloalto-icmp`, id at 1563, entry closing 1569, `]);` at 1570 | only SSH appends (new entries before `]);` at 1570) | SSH is the only append in batch 4; TLS and FTP add none. Batch 3's appends (RFC 1939, RFC 9051 if cited) also land at 1569-1570 |
| `src/content/sources.test.ts` | 249 (`'rfc-959'` in the TCP block); 236-267 the exact ordered list; 266 the last id; 267 `]);` | SSH adds ids after 266, in the order of `sources.ts` | 266 and 267: the same append point as sources.ts 1569-1570 |
| `src/content/tracks/how-the-internet-works.test.ts` | 123-125 (rows); 170 (step counts); 228-251 (titles); 254-268 (pattern names, 266-268); 300-302 (layers); 318 (message counts); 446-474 (tables); 576; 686-691; 740-745 (references); 763 (`uncited`, ssh); 782 (`lessonTitles`); 843, 865, 893, 912-978 (cues) | SSH moves: 763 is removed (and the `RFC 4252:` and `RFC 4254:` labels must be in its references, see 775); its references at 741-744 are compared only while legacy (749). The `lessonTitles` list at 782 changes only if a sentence in one of the three adds "The X lesson" | touching pairs: 740/741 (FTP and SSH references); 744/745 (SSH and TLS references); 455/456 (FTP table and SSH's); 464/465 (SSH and TLS tables); 170 is shared with batch 3's three lessons (smtp, pop3, imap on the same line); 763 and 782 are far apart; 893 is one line from 892 (`imap`) |
| `src/progress/internet-split.ts` | 25-27 (sizes 9, 9, 9) | none unless steps or Practice change | 26-27 consecutive |
| `src/progress/internet-split.test.ts` | 21 (size list ends `9, 9, 9`) | none unless sizes change | — |

Other files all three would edit or add, with no cross-branch conflict unless the same line is touched:

- Each lesson's own file: `ftp.ts`, `ssh.ts`, `tls.ts`.
- New files, one per slug: `docs/fact-checks/what-is-ftp.md`, `what-is-ssh.md`, `what-is-tls.md` (none exist; the directory has `what-is-dhcp`, `what-is-icmp`, `what-is-ip` now), and `docs/lesson-changes/<slug>.md` (none exist).
- `docs/direction.md` (decision 2.25 batch list, 2.26 status, the status line at 117), `plan.md` (batch 4 row at 76), `team.md` (job ledger). These are shared docs; each batch edits the same file.
- `src/content/legacy.ts:24-28` comment ("keep their uncited words until each one's audit"), which describes the tour lessons still on the list.
- `src/content/helpers/tour.ts`: used by six legacy lessons: `what-is-ftp.ts`, `what-is-imap.ts`, `what-is-pop3.ts`, `what-is-smtp.ts`, `what-is-ssh.ts`, `what-is-tls.ts`. A move does not edit it.

## 6. Not found

- No test file for `ftp.ts`, `ssh.ts` or `tls.ts` (`src/content/lessons/` has `dhcp.test.ts`, which is Networking's).
- No fact-check report or lesson-changes file for FTP, SSH or TLS (`docs/fact-checks` lists canary, osi-model, what-is-dhcp, what-is-dns, what-is-http, what-is-https, what-is-icmp, what-is-ip, what-is-tcp, what-is-udp, what-is-udp.recheck; `docs/lesson-changes` lists what-is-dhcp, dns, http, https, icmp, ip, tcp, udp).
- No SOURCES entry for RFC 4251, RFC 4252, RFC 4253, RFC 4254 or RFC 8446 (grep `4251|4252|4253|4254|8446` in `src/content/sources.ts`: no hits for these numbers; the only hit for the TLS standard is `rfc-9846`, 624-630).
- In `https.ts`, no `TLS_` cipher-suite string, `forward`, `HKDF`, `16 KB`, `close_notify`, `EncryptedExtensions`, `Certificate Transparency`, `revoked` or `self-signed` (grep). In `tls.ts`, no `padlock`, `session` or `ML-KEM` (grep).
- No MAC address in the three (the track test's MAC set at 695-699 is unaffected).
- No `example.org` or `example.com` in the three. `techconcepts.app` appears in `tls.ts` only (lines 7, 47, 59, 66, 75, 80, 96, 98, 144, 147, 165, 167, 383), not in `ftp.ts` or `ssh.ts`.
- No `RFC 2606` (example names) or `RFC 5737` / `RFC 1918` citation anywhere in the three's references; the address ranges below are classified by the ranges, not by a cited source.
- Names and addresses, by file (lines as now):
  - `ftp.ts`: `files.example.net` (60, 67, 79, 143, 144); `report.pdf` (9, 48, 60, 67, 280, 284, 348-350, 364, 377, 394, 395, 397, 428); user `alex` (156, 159, 176, 177, 178, 193, 222); password `sunflower7` (159, 206-208); `192.168.1.100:50961` (15, laptop control, private RFC 1918); `203.0.113.21:21` (16, server control, RFC 5737 documentation range 203.0.113.0/24); `192.168.1.100:50962` (17, 283; private); `203.0.113.21:50000` (18, 80, 233, 267, 283; documentation); ports 21 (7, 16, 76, 80, 439, 500), 20 (498, active data), 22 (157, 439, 443, 503, SFTP), 990 (439, 503, FTPS), 69 (439, 444, TFTP over UDP), `227 (203,0,113,21,195,80)` = port 50000 (234, 237, 268: 195×256+80).
  - `ssh.ts`: `srv.example.net` (60, 67, 76, 79); `alex` (67, 76, 298, 299, 301, 318, 361, 363, 365, 374, 380, 437); user prompt `alex@srv:~$` (374, 380, 437); `192.168.1.100:51022` (15, laptop, private); `203.0.113.22:22` (16, 54, 79, server, RFC 5737 documentation); port 22 (16, 63, 76, 80, 575 "Telnet (23)" as the other port in 575); `~/.ssh/known_hosts` (220, 225, 562), `~/.ssh/authorized_keys` (299, 303); `sntrup761x25519-sha512` (171, 174, 209); `chacha20-poly1305@openssh.com` (171).
  - `tls.ts`: `techconcepts.app` (13 lines, listed above); `192.168.1.100:50877` (15, laptop, private); `198.51.100.7:443` (16, 53, 66, web server, RFC 5737 documentation range 198.51.100.0/24); port 443 (16, 66); RFC 1918 and RFC 5737 are not named.
  - Documentation ranges: 203.0.113.0/24 (`ftp.ts` 16, 18, 54, 79, 233, 267, 283; `ssh.ts` 16, 54, 79); 198.51.100.0/24 (`tls.ts` 16, 53); private ranges (RFC 1918): 192.168.1.100 in all three (`ftp.ts:15`, `ssh.ts:15`, `tls.ts:15`).
  - No address in the three is 0.0.0.0, 255.255.255.255, 169.254.x.x, or an IPv6 address.
- What the HTTPS lesson uses for the same host: `https.ts:100` `WEB = '198.51.100.7:443'` (the same server as TLS's `tls.ts:16`), and `https.ts:99` `LAPTOP = '192.168.1.100:50812'` (TLS uses 50877 on the same laptop address). These are different ports for two different connections.
- No Home code reads the three (`home.ts`, `index.astro`); `home.test.ts` names none of them.
- No e2e spec quotes the three's prose or counts their steps; only `site.spec.ts:611-612` names the TLS card, and `e2e/global-setup.ts:40-42` checks the 'Checked' label for each stop.
- No code keys progress or storage on the unit ids `ftp`, `ssh` or `tls` (progress is keyed by slug, `src/progress/store.ts`, per s6).
- No lesson text names "the FTP lesson" or "the SSH lesson"; the only "the TLS/SSL lesson" sentences are `https.ts:386` and `what-is-smtp.ts:79`.
- Networking's `tls` lesson: `src/content/tracks/networking.ts:69` lists `{ slug: 'tls', title: 'TLS' }`, and there is no `src/content/lessons/tls.ts` (the lessons folder has `what-is-tls.ts` only). I did not open the registry code to see how Networking's TLS entry is shown.
