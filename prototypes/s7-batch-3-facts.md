# S7 scout: facts for batch 3 (What is SMTP, What is POP3, What is IMAP)

Branch `revamp`, HEAD b18acd9 (clean tree when read). Read only; nothing in the repo changed. Paths are repo-relative. Line numbers are as the files are now. Short names: `smtp.ts` = `src/content/lessons/what-is-smtp.ts`, `pop3.ts`, `imap.ts` likewise; `track.test.ts` = `src/content/tracks/how-the-internet-works.test.ts`; `legacy.ts`, `legacy.test.ts`; `sources.ts`, `sources.test.ts`; `helpers/internet-events.ts` = `src/content/helpers/internet-events.ts`; `helpers/tour.ts` = `src/content/helpers/tour.ts`.

**Correction to s6** (`prototypes/s6-batch-2-facts.md`, written at 13b222b): batch 2 has merged since. What is IP, What is DHCP and What is ICMP are cited now, so `LEGACY_LESSONS` has 9 entries, not 12 (`legacy.ts:30-38`), and the track's Behind-the-scenes and Getting-the-data lines in s6 are out of date. Every line number below is from the files as they are at b18acd9.

## 1. Order

Track `src/content/tracks/how-the-internet-works.ts`, lessons in order (lines 22-64):

| # | Slug | Track line | Status now | Export line |
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
| 12 | what-is-ftp | 57 | legacy | `what-is-ftp.ts:538` |
| 13 | what-is-ssh | 58 | legacy | `what-is-ssh.ts:613` |
| 14 | what-is-tls | 64 | legacy | `what-is-tls.ts:399` |

Parts: "Email" is `src/content/tracks/how-the-internet-works.ts`:44-52 (SMTP 48, POP3 49, IMAP 50). "Getting the data there" is 28-33; "Behind the scenes" is 37-42.

`LEGACY_LESSONS` in `src/content/legacy.ts` (line 29 opens, line 39 closes; 9 entries):
30 `'what-is-smtp'`, 31 `'what-is-pop3'`, 32 `'what-is-imap'`, 33 `'what-is-ftp'`, 34 `'what-is-ssh'`, 35 `'what-is-tls'`, 36 `'subnetting'`, 37 `'dhcp'` (Networking's), 38 `'firewalls'`. The comment at `legacy.ts:24-28` says the How the Internet Works lessons "keep their uncited words until each one's audit".

## 2. Size of the three

Counts were read from the source and checked against `track.test.ts:318` (message counts 34 / 24 / 24) and `track.test.ts:170` (step counts 6 / 5 / 5). They agree.

| Measure | smtp.ts | pop3.ts | imap.ts |
|---|---|---|---|
| Watch steps (`steps:` opens) | 6 (`steps: [` at 72) | 5 (68) | 5 (73) |
| Steps: id / title line | 1 `tcp-and-tls-handshake` 74 / 75 "TCP and TLS Handshake"; 2 `ehlo-and-authentication` 168 / 169 "EHLO and Authentication"; 3 `message-submission` 257 / 258 "Message Submission"; 4 `mx-lookup` 393 / 394 "MX Lookup"; 5 `server-relay-and-starttls` 438 / 439 "Server Relay and STARTTLS"; 6 `message-delivery` 601 / 602 "Message Delivery" | 1 `tls-connection` 70 / 71 "TLS Connection"; 2 `authentication` 164 / 165 "Authentication"; 3 `mailbox-status` 254 / 255 "Mailbox Status"; 4 `message-retrieval` 334 / 335 "Message Retrieval"; 5 `delete-and-quit` 413 / 414 "Delete and Quit" | 1 `tls-connection` 75 / 76 "TLS Connection"; 2 `authentication` 169 / 170 "Authentication"; 3 `folder-selection` 230 / 231 "Folder Selection"; 4 `fetch-and-flag` 309 / 310 "Fetch and Flag"; 5 `idle-push` 388 / 389 "IDLE Push" |
| Step facts | 4 in each step: 81-84, 175-178, 264-267, 400-403, 445-448, 608-611 | 4 each: 77-80, 171-174, 261-264, 341-344, 420-423 | 4 each: 82-85, 176-179, 237-240, 316-319, 395-398 |
| Events, messages (per step) | 34 total: step 1 `msg` at 87,103,118,134,148 (5); step 2 at 181,195,209,224,238 (5); step 3 at 270,285,300,314,329,343,358,372 (8); step 4 at 406,420 (2); step 5 at 451-583 (10); step 6 at 614,628,643,658 (4) | 24 total: step 1 at 83,98,113,130,144 (5); step 2 at 177,191,205,220,234 (5); step 3 at 267,281,295,310 (4); step 4 at 347,361,377,392 (4); step 5 at 426,441,457,472,488,502 (6) | 24 total: step 1 at 88,103,118,135,149 (5); step 2 at 182,196,210 (3); step 3 at 243,257,271,286 (4); step 4 at 322,336,353,367 (4); step 5 at 401,415,432,446,461,476,491,506 (8) |
| Table rows (events) | 3: 388 (step 3, "250 queued"), 433 (step 4, MX), 672 (step 6, "250 delivered") | 8: step 3 at 327, 328; step 4 at 375, 408; step 5 at 455, 486, 520, 521 | 4: step 3 at 302, 303; step 4 at 383; step 5 at 521 |
| Events total | 37 (34 + 3) | 32 (24 + 8) | 28 (24 + 4) |
| Quiet step (`events: []`) | none (grep `events: \[\]` = 0 in all three) | none | none |
| Learn lead / terms / pattern | lead 678; terms 680-687 (8); pattern names 690, note 691 | lead 528; terms 530-536 (7); names 539, note 540 | lead 527; terms 529-536 (8); names 539, note 540 |
| Learn why / deep | why 693; deep 694 | why 542; deep 543 | why 542; deep 543 |
| Learn facts | 696-700 (5) | 545-549 (5) | 545-549 (5) |
| "Defined in" fact | `{ label: 'Defined in', value: 'RFC 5321' }` at 700 | `'RFC 1939'` at 549 | `'RFC 9051'` at 549 |
| Go deeper (step `deep:` lines) | 79, 173, 262, 398, 443, 606 (6 steps) | 75, 169, 259, 339, 418 (5) | 80, 174, 235, 314, 393 (5) |
| Practice (ids, prompt, options, answer) | `find-server` id 705, prompt 706, options 707-720 (3), `answer: 0` at 721 = index 0; `queued` id 724, prompt 725, options 726-736 (3), answer 737 = index 1 | `phone-inbox` id 554, prompt 555, options 556-566 (3), answer 567 = index 1; `when-deleted` id 570, prompt 571, options 572-579 (3), answer 580 = index 0 | `phone-shows` id 554, prompt 555, options 556-563 (3), answer 564 = index 0; `idle` id 567, prompt 568, options 569-579 (3), answer 580 = index 1 |
| Overview hook / facts | hook 60; facts 64-69 (6) | hook 56; facts 60-65 (6) | hook 61; facts 65-70 (6) |
| Scene title | 45 "Your letter goes to your mail server, then to Sam’s" | 43 "Your mail app empties the mailbox onto your laptop" | 47 "Your mail stays on the server, in sync" |
| Scene views | `['network', 'sequence']` (46) | same (44) | same (48) |
| Scene layers | `['smtp:out', 'smtp:in']` (47) | `['pop3:mail']` (45) | `['imap:mail']` (49) |
| Scene start | `[]` (49) | `[{ cue: 'tray', arg: 'mail on' }]` (47) | same (51) |
| Scene labels | laptop 'Sending to sam@example.org', url 'Mail' (48) | laptop 'Checking mail', url 'Mail' (46) | laptop 'Checking mail', url 'Mail' (50) |
| Panel table | `trip` (table at 19-32: id 20, title 21 "The letter’s trip", by 22 "one handover at a time", columns 23-28 Leg/From/To/Result, keyColumn 29 `'leg'`, empty 31) | `mailbox` (table at 18-30: id 19, title 20 "Your mailbox on the server", by 21 "as POP3 sees it", columns 22-26 Letter/Size/Status, keyColumn 27 `'letter'`, empty 29) | `inbox` (table at 19-32: id 20, title 21 "Your inbox, on the server", by 22 "the same from every device", columns 23-28 #/From/Subject/Flags, keyColumn 29 `'number'`, empty 31) |
| Scene log | `eventLog()` (51), no extra legend | `eventLog()` (49) | `eventLog()` (53) |
| Parties | 4 at 53-56: Laptop 192.168.1.100; DNS resolver 192.0.2.53; Your mail server 203.0.113.60; Sam’s mail server 198.51.100.88 (lines 52-57) | 2 at 51-52: Laptop 192.168.1.100; Your mailbox 203.0.113.70 (lines 50-53) | 3 at 55-57: Laptop 192.168.1.100; Your mailbox 203.0.113.70; The internet 198.51.100.88 (lines 54-58) |
| Page cue (`page:`) | none | `pop3.ts:374` `'text'` (LETTER 1); `pop3.ts:407` `'full'` (LETTER 2) | `imap.ts:351` `'full'` (LETTER) |
| `hold:` / tray cues | `hold: { out: true }` 387; `hold: { out: false }` 656; `hold: { in: true }` 671 | `hold: { mail: false }` 518 | none |

### Cue kinds in the three (lines are the `st:`, `known:`, `done:`, `conn:`, `fast:` and `page:` fields)

Derivation: `helpers/internet-events.ts:115-125` turns `st` into `status`, `known` into `status-known`, `done` into `status-done`, `conn` into `conn`, `page` into `page` (line 119), `hold` into `lock` (122) or `tray` (123), `addr` and `url` (124-125). `fast` is a message flag (136 in the `messagesFor` body). `bcast` (133) and `lost` (134) are not used in these three.

- **smtp.ts**
  - `status`: 101 "Connecting", 161 "Connected, sealed", 251 "Logged in", 283 "Sending the letter", 385 "Sent. Your server has it".
  - `status-known`: 162, 252. `status-done`: 386.
  - `conn`: 132 `['open','laptop>out']`, 163 `['seal','laptop>out']`, 495 `['open','out>in']`, 596 `['seal','out>in']`.
  - `tray`: 387 `out on`, 656 `out off`, 671 `in on`.
  - `fast`: 94, 110, 125, 216, 292, 321, 350, 458, 473, 488, 532, 561, 635 (13).
  - Not used: `page`, `lock`, `addr`, `url`, `broadcast`, `miss`, `lost`.
- **pop3.ts**
  - `status`: 127 "Connecting", 157 "Connected, sealed", 248 "Logged in", 324 "2 letters waiting", 405 "2 letters downloaded", 515 "Mail on this laptop only".
  - `status-known`: 158, 249, 325, 406. `status-done`: 516.
  - `conn`: 128 `['open','laptop>mail']`, 159 `['seal','laptop>mail']`, 517 `['close','laptop>mail']`.
  - `tray`: 518 `mail off`; start 47 `mail on`.
  - `page`: 374 `'text'`, 407 `'full'`.
  - `fast`: 90, 105, 120, 212, 241, 302, 317, 384, 433, 448, 464, 479 (12).
  - Not used: `lock`, `addr`, `url`, `broadcast`, `miss`, `lost`.
- **imap.ts**
  - `status`: 132 "Connecting", 162 "Connected, sealed", 224 "Logged in", 299 "2 letters, 1 unread", 349 "Reading Sam’s letter", 381 "Marked read on the server", 429 "Waiting for new mail", 459 "New mail", 519 "3 letters, 1 unread".
  - `status-known`: 163, 225, 300, 350, 382, 430. `status-done`: 520.
  - `conn`: 133 `['open','laptop>mail']`, 164 `['seal','laptop>mail']`. No close.
  - `tray`: none in messages; start 51 `mail on`.
  - `page`: 351 `'full'`.
  - `fast`: 95, 110, 125, 217, 278, 374, 422, 468, 483, 498 (10).
  - Not used: `lock`, `addr`, `url`, `broadcast`, `miss`, `lost`, `tray` in messages.

### Page cues: what they draw, and what the story has shown before each

- `pop3.ts:374` `page: 'text'` on the event `LETTER 1` (message at 361-376), step 4 "Message Retrieval". Before it the story has shown: the mailbox table filled by `+OK 2` (step 3, rows at 327-328 "On the server"); the request `RETR 1` (347-360). Nothing has been fetched yet. This message brings letter 1 to the laptop: `sum` at 372 "+OK: here’s letter 1, “Re: Saturday?”, from sam@example.org.", `info` at 373, and the row m1 becomes "Downloaded" (375).
- `pop3.ts:407` `page: 'full'` on the event `LETTER 2` (392-409), step 4. Before it: letter 1 has been fetched (row m1 "Downloaded" at 375), and `RETR 2` was sent (377-391). This brings letter 2 (`sum` at 403 "+OK: here’s letter 2, a newsletter."), and row m2 becomes "Downloaded" (408).
- `imap.ts:351` `page: 'full'` on the event `LETTER` (336-352), step 4 "Fetch and Flag". Before it: step 3's `HEADERS` (rows 302-303: m1 news@example.com "This week’s tips" `\Seen`; m2 sam@example.org "Re: Saturday?" unread), and `FETCH 2 BODY.PEEK[]` (322-335) asks for "the whole thing". This brings letter 2 (`sum` at 347 "Here’s letter 2: “Re: Saturday?”, from sam@example.org.").
- What the cues draw (from the code that reads them):
  - `src/art/scenes/net-map.ts:89-93`: the page is drawn in parts. `nm-page-bg` (90) and the text rectangles (91-92) carry `data-part="text"`. One block, the picture (93), carries `data-part="pic"`.
  - `src/scenes/drivers/net-map.ts:158` the state `page: '' | 'text' | 'full'`; `:229` `wants`: `full` draws every part, `text` only the parts with `data-part="text"`; `:262-264` the cue's argument must be `text` or `full`; `:432-438` a page that lands draws its fresh parts in top to bottom, over the rest.
  - `src/art/scenes/parts.ts:47` `page: 'text'` is the cue's argument kind in the figure's parts list, not a value.
  - Home: `src/lib/home.ts:165-169` counts the first step with any page cue (`words`) and the first with `'full'` (`pictures`).

### Other cue facts

- Not used in the three: `lock` (only `pop3.ts:169,174,247` say "locked", as words), `addr`, `url`, `miss` (smtp's three "miss" matches are inside "submission"), `broadcast`, `lost`, `tray` in messages for IMAP.

## 3. What rests on each lesson

Unit tests that name the three by slug or unit id (`smtp`, `pop3`, `imap`) or hold their words, counts or shape:

### `src/content/tracks/how-the-internet-works.test.ts` (1112 lines; the mail lines)

- 23: `PROTOCOLS` holds `'smtp', 'pop3', 'imap'`. 76: `TOUR.map((l) => l.units[0]!.id)` must equal `PROTOCOLS`.
- 18-22: `TOUR` is the track's entries as lessons; `isLegacy` (22) uses `LEGACY_LESSONS` by `lesson.slug`.
- 68: part `['Email', ['SMTP', 'POP3', 'IMAP']]`.
- 79-81: 78 Watch steps and 28 questions in all. The three contribute 16 steps (6 + 5 + 5) and 6 questions.
- 120-122: rows `['SMTP', 'Simple Mail Transfer Protocol', 'Sending email', 'app', { layers: [7], cite: [] }]`, and the same shape for POP3 (121) and IMAP (122).
- 130-136: a legacy lesson must match all five fields (131). A cited lesson matches the first four (134) and, if its OSI is not `'spans'`, must have layers and a cite (135).
- 170: step counts `['smtp', 6], ['pop3', 5], ['imap', 5]`.
- 218-225: SMTP step titles (the six above). 226: POP3 titles. 227: IMAP titles.
- 263-265: pattern names `['EHLO', 'MAIL FROM', 'RCPT TO', 'DATA', '250']`, `['USER', 'PASS', 'STAT', 'RETR', 'DELE', 'QUIT']`, `['LOGIN', 'SELECT', 'FETCH', 'STORE', 'IDLE']`. Lines 252-253 say commands stay as written.
- 297-299: layers `['smtp:out', 'smtp:in']`, `['pop3:mail']`, `['imap:mail']`.
- 318: message counts, index 8 (smtp) 34, index 9 (pop3) 24, index 10 (imap) 24.
- 431-435: SMTP `trip` cells, 3 rows: `['1', 'Your laptop', 'smtp.example.net', '250 queued']`, `['Lookup', 'smtp.example.net', 'DNS resolver', 'MX: mx.example.org']`, `['2', 'smtp.example.net', 'mx.example.org', '250 delivered']`.
- 436-440: POP3 `mailbox` cells: `['1', '4.1 KB', 'Deleted']`, `['2', '18 KB', 'Deleted']`. Comment 436: "POP3 leaves the mailbox empty, and its letters on the laptop."
- 441-445: IMAP `inbox` cells: `['1', 'news@example.com', 'This week’s tips', '\\Seen']`, `['2', 'sam@example.org', 'Re: Saturday?', '\\Seen']`, `['3', 'jo@example.org', 'Photos from Saturday', 'unread']`.
- 549-556: `trip` table definition (`'The letter’s trip'`, `'one handover at a time'`, key `'leg'`, columns Leg/From/To/Result, empty "Not sent yet. The letter is still on the laptop."). 558-563: `mailbox` (`'as POP3 sees it'` at 560, key `'letter'`, Letter/Size/Status, empty 563). 566-571: `inbox` (`'the same from every device'` at 568, key `'number'`, #/From/Subject/Flags, empty 571).
- 636: SMTP parties `['Laptop 192.168.1.100', 'DNS resolver 192.0.2.53', 'Your mail server 203.0.113.60', 'Sam’s mail server 198.51.100.88']`. 637: POP3 `['Laptop 192.168.1.100', 'Your mailbox 203.0.113.70']`. 639: IMAP (with comment 638) `['Laptop 192.168.1.100', 'Your mailbox 203.0.113.70', 'The internet 198.51.100.88']`.
- 659: SMTP scene title "Your letter goes to your mail server, then to Sam’s", labels `{ laptop: 'Sending to sam@example.org', url: 'Mail' }`. 660: POP3 "Your mail app empties the mailbox onto your laptop", labels `{ laptop: 'Checking mail', url: 'Mail' }`. 661: IMAP "Your mail stays on the server, in sync", same labels.
- 685, 687, 688: the log legend `slice(2)` for smtp, pop3, imap must be `[]`. 686 comment: "POP3, IMAP, FTP, SSH and TLS send only requests and replies."
- 737, 738, 739: expected legacy references, exact label and URL: SMTP `RFC 5321: Simple Mail Transfer Protocol` `https://www.rfc-editor.org/rfc/rfc5321`; POP3 `RFC 1939: Post Office Protocol, Version 3` `https://www.rfc-editor.org/rfc/rfc1939`; IMAP `RFC 9051: Internet Message Access Protocol (IMAP), Version 4rev2` `https://www.rfc-editor.org/rfc/rfc9051`. Used only while legacy (749-750).
- 771-775: every "Defined in" RFC must have a reference whose label starts `RFC nnnn:`. For cited lessons the list must be empty (775). The three pass today: smtp (700 RFC 5321, label 43), pop3 (549 RFC 1939, label 41), imap (549 RFC 9051, label 44).
- 782: `lessonTitles(internet)` must sort to `['DNS', 'DNS', 'Subnetting', 'TCP', 'TLS/SSL', 'TLS/SSL']`. From the mail lessons only `smtp.ts:79` contributes ("The TLS/SSL lesson covers the handshake."). The other TLS/SSL is `what-is-https.ts:386` ("The TLS/SSL lesson takes the handshake one message…"). The helper is `src/test/lesson-references.ts:40` (`lessonTitles`, regex `\b[Tt]he ([A-Z]…) lesson\b`).
- 788: no text may match `\bThe \w+ part\b|this lesson`. The three pass today.
- 850-866: each unit's Overview shows its own start. 863: `pop3: { lit: ['nm-pop3-hold-mail'] }`; 864: `imap: { lit: ['nm-imap-hold-mail'] }`.
- 890-894: the scene starts that exist: `['pop3', [{ cue: 'tray', arg: 'mail on' }]]` (891), `['imap', [...same]]` (892), tls (893).
- 897-901: POP3 and IMAP Overviews light their mailbox tray.
- 903-906: POP3 step 5: `showAt('pop3', 'step', 5, 'QUIT')` keeps the tray lit; `showAt('pop3', 'step', 5, '+OK BYE')` clears it. The test finds messages by tag (`playedThrough`, 874-878), so the tags `QUIT` and `+OK BYE` must exist in step 5 of pop3.ts (lines 488, 502 and the `+OK BYE` message at 502-523).
- 907-908: POP3 Learn lights nothing. 909-910: IMAP Practice keeps its tray lit.
- 912-913: FTP has no letters (not mail, listed for completeness).

### `src/content/legacy.test.ts`

- 6: `const TOUR = ['dhcp', 'dns', 'ftp', 'http', 'https', 'icmp', 'imap', 'ip', 'pop3', 'smtp', 'ssh', 'tcp', 'tls', 'udp'];` — the three strings are listed here.
- 8: test title: "the legacy list is exactly the nine lessons not yet moved: six of How the Internet Works and three of Networking (it may only shrink)".
- 9: expected list `['dhcp', 'firewalls', 'subnetting', ...TOUR.filter((p) => p !== 'udp' && p !== 'http' && p !== 'dns' && p !== 'tcp' && p !== 'https' && p !== 'dhcp' && p !== 'icmp' && p !== 'ip').map((p) => \`what-is-${p}\`)]`. Today the filter yields six `what-is-` entries (ftp, imap, pop3, smtp, ssh, tls). Agrees with `legacy.ts:30-38` (9 entries).

### `src/progress/internet-split.ts` and its test

- `internet-split.ts:22` `['what-is-smtp', 9]`, 23 `['what-is-pop3', 8]`, 24 `['what-is-imap', 8]`. Offsets: smtp 68-76, pop3 77-84, imap 85-92 (sum of the sizes above them, 13-27).
- `internet-split.test.ts:20`: `INTERNET_SPLIT` must equal `entries.map((e) => [e.slug, e.available ? e.maxPosition + 1 : 0])`. 21: `[8, 9, 9, 8, 8, 8, 9, 9, 9, 8, 8, 9, 9, 9]` (positions 9, 8, 8 for the three). 22: total 120. Agrees with the lesson shapes: smtp 6 steps + 3 = 9; pop3 5 + 3 = 8; imap 5 + 3 = 8.

### Art (`src/art/**`)

- `src/art/scenes/net-map-layers.ts:101-119`: `'smtp:out'` (101) with kind 'mail', site 'out', puck 'c', label `'SMTP.EXAMPLE.NET'` (106), lines 'Your mail server' and 'smtp.example.net' (109); `'smtp:in'` (111) with site 'in', puck 'd', label `'MX.EXAMPLE.ORG'` (116), at `[220, 280]` (117), lines 'Sam’s mail server' and 'mx.example.org' (118). `'pop3:mail': mailbox(995)` (120); `'imap:mail': mailbox(993)` (121). `mailbox()` is at 73-79: puck 'c' (77), label `'MAIL.EXAMPLE.NET'` (78), lines 'Your mailbox', 'mail.example.net', `port ${port}` (79).
- `src/art/scenes/net-map-layers.test.ts:16-19`: the key list (`smtp:out`, `smtp:in`, `pop3:mail`, `imap:mail`). 43-54: `NET_MAP_LAYERS['smtp:in']` must equal kind 'mail', slot 'SE', site 'in', puck 'd', label 'MX.EXAMPLE.ORG', at `[220, 280]`, lines 'Sam’s mail server' and 'mx.example.org'. 76: the FIGURE_PARTS cue kinds (page 'text').
- `src/art/scenes/net-map.test.ts:29`: `PROTOCOLS` holds smtp, pop3, imap. The route test (82-95) checks a route between every pair of places each protocol uses (base places plus its own plates).
- `src/art/scenes/net-map.test.ts` and `net-map.ts:177, 270-271` (comments and the `mail(p, id, o)` drawing) name "a tray on a mail server" but not the lessons.
- `src/art/scenes/parts.ts:43`: comment "TLS's open line, POP3's and IMAP's letters".
- `src/art/figures/spots.ts`, `covers.ts`: no mail reference (grep).

### Drivers (`src/scenes/drivers/net-map.test.ts`, `src/scenes/driver.test.ts`)

- `net-map.test.ts:141`: every layer key except `'http:web'` starts idle (uses the keys, so the three are included by key). 143-146: `layers: ['smtp:out', 'smtp:in']` shows neither plate with the web server absent.
- 206-210: POP3 letters on the tray (`'mail on'`, `'mail off'`, lit `nm-pop3-hold-mail`). 212-215: IMAP `nm-imap-hold-mail` lit only when its own start is shown.
- 432-443: SMTP tray cues `out on` (432-434), then `out off`, `in on` (435-436), back to the start (443). Names `labels` only; no lesson words.
- 520-543: `mount()` sweep events built by hand: SMTP `run(['smtp:out', 'smtp:in'], mail)` (540), POP3 `run(['pop3:mail'], collected, [{ cue: 'tray', arg: 'mail on' }])` (543). These use fabricated tags (`RETR 1`, `+OK BYE`), not the lesson's text.
- 587-590: "a letter leaves its tray as it is sent, not when it lands" (SMTP layers).
- `src/scenes/driver.test.ts:99-102`: a fabricated lesson with `scene.start = [{ cue: 'tray', arg: 'mail on' }]`. Not the lesson.
- `src/content/schema.ts:300-302` (comment): "TLS's line, open before its handshake, and the letters waiting in POP3's and IMAP's mailbox." `src/scenes/drivers/net-map.ts:30` (same idea).

### Home (`src/lib/home.test.ts`, `src/lib/home.ts`)

- `home.test.ts:239`: `expect(homeDemo('what-is-pop3', 'what-is-tcp').page).toEqual({ words: 4, pictures: 4 });` in the test "the page’s words and pictures come from the lesson’s own cues" (237).
- What line 239 asserts about POP3: (a) its registry entry is `available` (`home.ts:122-124`, `entryOf`); (b) its figure is `'net-map'` (`home.ts:128`; POP3's figure comes from `helpers/tour.ts:16`); (c) it has a first Practice question (`home.ts:131`; `pop3.ts:554`); (d) its first step with any page cue is step 4 (words, `home.ts:166-167`; `pop3.ts:374` is in step 4), and its first step with `'full'` is step 4 (pictures; `pop3.ts:407`); (e) `lessonStamp(...).sources` equals the length of `numberedSources(unit)` (`home.ts:177-179`), which is 1 today (one reference, `pop3.ts:41`).
- What would become false: the number 4 for words and 4 for pictures only if the page cues move out of step 4. If `pop3.ts:407` (`'full'`) is removed, `pictures` becomes 0 and `homeDemo` throws "what-is-pop3 has no page: 'full' cue." (`home.ts:169`). If both `pop3.ts:374` and `:407` are removed, it throws "has no page cue" (`home.ts:168`). If only `pop3.ts:374` (`'text'`) is removed, `words` is still 4, because `home.ts:166` counts any page argument, so the test still passes.
- The move itself: line 239 does not read the legacy list or the shape. Under the cited shape, `lessonStamp` counts distinct reference URLs (`src/lib/checked.ts:17-19`) and `numberedSources` returns the numbered list (`src/lesson/sourceNumbers.ts:23-31`); both give 1 today, so the assertion would still pass. The sample is named as going stale in `plan.md:94` and `team.md:392`; the code above shows which edit would break it.
- `home.test.ts:97-100` uses another lesson (What is HTTPS). `home.ts:191` and `home.test.ts:218` (HTTP's stamp, 20 sources) are not about the three.
- `src/lib/home.ts`, `index.astro`: no other reference to the three (grep).

### Other unit tests

- `src/lib/track.test.ts:39`: `[4, 'Email', 3, 3]` (part 4 has three ready lessons). Not shape-dependent.
- `src/lib/track.test.ts:118-125`: a ready lesson's card carries a stamp. `stamp.checked` is null exactly when origin is not `'cited'` (125). A move to cited needs a passing report (`src/content/factcheck/gate.ts`, `docs/fact-checks/<slug>.md`).
- `src/lib/checked.test.ts:6-32` and `src/lib/about.test.ts:28-40`: computed counts (no number pinned for the three). `lessonCheckCounts` (`src/lib/checked.ts:11-13`) counts `origin === 'cited'`, so a move changes the Home and About "checked" counts.
- `src/lib/start.test.ts`, `src/content/registry.test.ts`, `src/content/sources.test.ts` (other than the list at 235-267), `src/content/factcheck/cli.defaults.test.ts`, `src/lib/about.test.ts` (other than 28-40): no mention of the three by slug, unit id or words (grep for smtp, pop3, imap, mail).
- `src/lib/text.test.ts:10` and `src/lib/tracks-page.test.ts:13`: the track blurb "from HTTP and DNS to email, SSH and TLS" (`src/content/tracks/how-the-internet-works.ts:14`). This names email, not the lessons.
- `src/content/lessons/`: no test file for the three (the test files there are `dhcp`, `firewalls`, `osi-model`, `subnetting`).

### e2e (`e2e/`)

- `e2e/site.spec.ts:37`: `INTERNET_PARTS` includes `'Email'`; used at 606 ("How the Internet Works has six parts…"). Part titles only.
- `e2e/site.spec.ts:263` and `:705`: `'4 of 19 lessons ready'`. Ready counts, unaffected by a move.
- No e2e spec quotes the three lessons' words, names their slugs, or counts their steps or questions. The `Watch · Step N of M` checks (1008-1016) use the Networking or the first How-the-Internet lesson, not the mail lessons (not re-verified by slug).
- Generic loops: `e2e/support.ts:33-36` (`readyLessons()`, from the built track pages). Used at `e2e/lesson.spec.ts:27`, `e2e/reading.spec.ts:9`, `e2e/visual.spec.ts:22`, `e2e/site.spec.ts:22`.
- `e2e/global-setup.ts:40-42`: each track-page stop must say "Checked" exactly when its slug is off `LEGACY_LESSONS` (`e2e/support.ts:18` `isChecked`). This applies to each of the three by slug.

### Other lessons and pages that name the three

Sentences in the three that name another lesson as "the X lesson": `smtp.ts:79` "The TLS/SSL lesson covers the handshake." (points at `what-is-tls`, track line 64). POP3 and IMAP have none. POP3 says "That’s the big difference from IMAP, next." (`pop3.ts:417`), which names a protocol, not "the IMAP lesson".

Sentences in the eight cited lessons that name the three: none as "the SMTP / POP3 / IMAP lesson". Mail words they carry:
- `what-is-tcp.ts:139` and `:923`: `value: 'things that must arrive whole: web pages (except over HTTP/3), email, files'`.
- `what-is-tcp.ts:899`: `value: '80 HTTP, 443 HTTPS, 22 SSH, 25 SMTP'`.
- `what-is-dns.ts:443`: "MX (the domain’s mail server)". `:472` and `:708` list MX in values.
- `what-is-https.ts:386`: "The TLS/SSL lesson takes the handshake one message…" (TLS, not mail).

Legacy lessons (not cited) that name mail: `what-is-tls.ts:57`, `:61`, `:352` ("secure email"); `what-is-ftp.ts:77` ("FTP replies use three-digit codes like SMTP’s").

Comments and docs only: `legacy.ts:30-32`; `track.test.ts:252-253`; `console.css:607-608` ("at 1280 px lesson 1's longest, SMTP's, fits whole": the CSS comment names the SMTP scene title as the longest title of lesson 1, a layout note); `plan.md:75` (batch 3 row), `plan.md:94` ("What is POP3's sample in Home's tests, which goes stale when batch 3 moves that lesson"); `team.md:391` ("What is IMAP and What is TLS carry `page: 'full'` and What is POP3 and What is SSH both cues"); `team.md:392` ("What is POP3's sample in Home's tests goes stale in batch 3").

## 4. What the three mail lessons share

### Parties, people, names, addresses and constants

- Laptop: `192.168.1.100`, label "Laptop", in all three (`smtp.ts:53`, `pop3.ts:51`, `imap.ts:55`). Its source-port constant: `LAPTOP = '192.168.1.100:50733'` (`smtp.ts:14`), `:50950` (`pop3.ts:15`), `:50972` (`imap.ts:16`).
- Mailbox host: `pop3.ts:52`, `imap.ts:56`: "Your mailbox", 203.0.113.70. Constants `MAIL = '203.0.113.70:995'` (`pop3.ts:16`), `'203.0.113.70:993'` (`imap.ts:17`).
- Mail server host: `smtp.example.net` at 203.0.113.60 (`smtp.ts:55`, `:81`, constant `OUT = '203.0.113.60:465'` at `smtp.ts:15`, relay `OUT_RELAY` at `:16`).
- `198.51.100.88` appears in SMTP as "Sam’s mail server" (`smtp.ts:56`, constant `IN = '198.51.100.88:25'` at `:17`) and in IMAP as "The internet" (`imap.ts:57`, with the delivery's source `198.51.100.88:43211` at `:440`).
- `mail.example.net` (POP3 and IMAP): `pop3.ts:7, 58, 65, 74, 77, 142, 155`; `imap.ts:7, 63, 70, 79, 82, 147, 160`. The plate's name is `MAIL.EXAMPLE.NET` (`net-map-layers.ts:78`).
- Labels `url: 'Mail'` in all three (`smtp.ts:48`, `pop3.ts:46`, `imap.ts:50`). `laptop: 'Checking mail'` in POP3 and IMAP (`pop3.ts:46`, `imap.ts:50`).
- Helpers: all three import the same four modules (lines 1-4): `eventLog, messagesFor` from `'../helpers/internet-events'`; `tourLesson` from `'../helpers/tour'`; `defineLegacyLesson, type LegacyUnitInput` from `'../legacy'`; `type TableDef` from `'../schema'`. Each defines `const msg = messagesFor(...)` (`smtp.ts:34`, `pop3.ts:32`, `imap.ts:34`) and exports `defineLegacyLesson(tourLesson(...))` (`smtp.ts:743`, `pop3.ts:586`, `imap.ts:586`). `helpers/tour.ts:10` sets the slug to `` `what-is-${unit.id}` ``, and `:16` sets the figure to `'net-map'`.
- The same `eventLog()` (no legend) in all three (`smtp.ts:51`, `pop3.ts:49`, `imap.ts:53`). The same `views: ['network', 'sequence']` (`smtp.ts:46`, `pop3.ts:44`, `imap.ts:48`).

### Sentences that say something about another's protocol (quoted)

- `smtp.ts:605` (Message Delivery narrative): "The letter now waits in Sam’s mailbox until Sam’s app collects it, which is the job of POP3 and IMAP."
- `smtp.ts:611` (fact): `{ label: 'Collected later by', value: 'POP3 or IMAP' }`.
- `smtp.ts:693` (why): "SMTP only sends, though. Collecting mail from your mailbox is a different job, done by POP3 or IMAP."
- `pop3.ts:417` (narrative): "That’s the big difference from IMAP, next."
- `pop3.ts:418` (deep): "That’s why POP3 suits one device and IMAP suits several."
- `pop3.ts:542` (why): "With a phone, a laptop and a tablet, you want the same mailbox everywhere, which is what IMAP does."
- `pop3.ts:543` (deep): "Sending mail isn’t POP3’s job at all; that’s SMTP."
- `pop3.ts:548` (fact): `{ label: 'Sending', value: 'not POP3: that’s SMTP' }`.
- `pop3.ts:559` (practice feedback, option 1): "Not quite. That’s IMAP. POP3 downloaded the letters and deleted them from the server."
- `imap.ts:63` (overview description): "POP3 is like emptying a post office box and carrying everything home. IMAP is like a filing cabinet…"
- `imap.ts:543` (deep): "Mail is still sent with SMTP; IMAP only saves a copy in Sent. The mail counts against your storage on the server, unlike POP3."
- `imap.ts:548` (fact): `{ label: 'Versus POP3', value: 'many devices, one mailbox' }`.
- `imap.ts:560` (practice feedback): "Not quite. That’s POP3. IMAP leaves the letter on the server."
- `imap.ts:433-445`: an SMTP message in the IMAP lesson: `tag: 'SMTP'`, `proto: 'SMTP'`, `dst: '203.0.113.70:25'`, `sum: 'Meanwhile a new letter reaches the server, from jo@example.org.'`, `info: 'SMTP delivery: new message for alex@example.net'` (`imap.ts:443-444`).

### Ideas stated in two or three in different words

- **TLS from the start, by port**: `smtp.ts:82` "465: TLS from the start"; `pop3.ts:78` "995: TLS from the start"; `imap.ts:83` "993: TLS from the start". Deep text: `smtp.ts:79` "Port 465 starts TLS straight away (implicit TLS)"; `pop3.ts:75` "port 995 with TLS from the start (POP3S)"; `imap.ts:80` "993 with TLS from the start (IMAPS)".
- **Plain port upgraded**: `smtp.ts:79` "Port 587 starts in plain text and upgrades with the STARTTLS command"; `pop3.ts:75` "port 110 in plain text, which can be upgraded with the STLS command"; `imap.ts:80` "port 143 in plain text, upgradable with STARTTLS". Two lessons name STARTTLS (smtp, imap); POP3 names STLS.
- **The password goes only inside the seal**: `smtp.ts:84` ("Why sealed: your password crosses next"); `smtp.ts:173` ("AUTH PLAIN sends the username and password, which is why the line was sealed first"); `pop3.ts:169` ("USER and PASS send the password as it is, so they’re only safe inside TLS"); `imap.ts:173` ("Your app logs in with LOGIN, your name and password, inside the seal").
- **App passwords**: `smtp.ts:173` ("Many apps use an app password or a sign-in token instead of your real password."); `pop3.ts:169` ("big providers often want an app password or a sign-in token (XOAUTH2)").
- **Where mail is kept**: `smtp.ts:605, 611`; `pop3.ts:63` (fact "Mail stays on the server? | usually not"), `pop3.ts:547` ("Mail ends up | on one device"), `pop3.ts:423` ("Letters live | only on this laptop"), `pop3.ts:542`; `imap.ts:67` ("Keeps | folders and read marks on the server"), `imap.ts:85` ("Mail stays | on the server"), `imap.ts:542` ("the server holds the one true copy of your mailbox"), `imap.ts:547`.
- **Sending is not the mailbox job**: `pop3.ts:548`, `pop3.ts:543`, `imap.ts:543`, `smtp.ts:693` (quoted above).
- **The message's end line**: `smtp.ts:262` (deep: "The letter ends with a line holding a single dot"), `smtp.ts:266` (fact "Ends with | a line with just a dot"), `pop3.ts:339` (deep: "ending with a line holding a single dot, like SMTP’s DATA"), `pop3.ts:344` (fact "Ends with | a line with just a dot"). IMAP has no such line.
- **Replies**: `smtp.ts:172` ("Every reply starts with a three-digit reply code"), `smtp.ts:66` (fact "3-digit codes"), `pop3.ts:173` (fact "Replies | +OK or -ERR"), `imap.ts:173` (tags: "each reply comes back with the matching tag").
- **Deletion**: `pop3.ts:417-418` ("DELE only marks", "The server deletes them only at QUIT"); `imap.ts:314` ("Deleting takes two steps: set \\Deleted, then EXPUNGE"); `imap.ts:577` (practice feedback: "IMAP never deletes unless your app asks, with \\Deleted and EXPUNGE.").
- **The phone question**: `pop3.ts:555` ("You collect mail with POP3 on your laptop, then open your phone. What’s in the phone’s inbox?") and `imap.ts:555` ("You read a letter on your laptop with IMAP. What does your phone show?"). Opposite answers: pop3 option 1 at 561, imap option 1 at 557.
- **Folders**: `pop3.ts:263` ("Folders | none, only the inbox"); `imap.ts:240` ("Folders | Inbox, Sent, Archive, your own").
- **The same letter**: "Re: Saturday?" from sam@example.org in `pop3.ts:372` and `imap.ts:303, 347, 383`. Two letters at the start: `pop3.ts:80` ("Waiting | 2 letters"), `pop3.ts:261` (STAT "+OK 2 22528"); `imap.ts:238` ("2 letters, 1 unread").
- **Sealed before login in all three**: yes, see the password line above.

### Ideas already stated in the eight cited lessons (both lines quoted)

- **TLS or encryption**:
  - Cited: `what-is-https.ts:135` "HTTPS is HTTP inside a sealed envelope. The asking and answering are the same, but nobody between you and the site can read or change them…"; `what-is-https.ts:383` "Now the two sides seal the line, in a quick exchange called the **TLS handshake**."; `what-is-tcp.ts:1063-1064` (option "It encrypts the connection." / feedback "Not quite. Encryption is TLS’s job, after the handshake. TCP’s handshake just opens the line.").
  - Mail: `smtp.ts:78` ("Then the two set up encryption… That seal is **TLS**"); `pop3.ts:74` ("First the TCP hello, then TLS seals the line"); `imap.ts:79` ("The same TCP hello, the same TLS seal.").
- **TCP connection or handshake**:
  - Cited: `what-is-http.ts:233` "Next the laptop opens a line to the server… Three short messages: hello, hello back, and OK. That’s the **TCP handshake**"; `what-is-tcp.ts:175` "Before any data moves, both sides make sure they can hear each other."; `what-is-https.ts:284` "Next comes the TCP handshake, exactly as for plain HTTP: hello, hello back, OK."
  - Mail: `smtp.ts:78` ("First the usual TCP hello."), `smtp.ts:442` ("The same TCP hello, the same 220 greeting, the same EHLO."), `pop3.ts:74`, `imap.ts:79`.
- **Ports**:
  - Cited: `what-is-tcp.ts:899` "80 HTTP, 443 HTTPS, 22 SSH, 25 SMTP"; `what-is-https.ts:284` "HTTPS uses **port 443** instead of 80"; `what-is-https.ts:219` "Normal DNS travels as plain UDP on port 53."
  - Mail: `smtp.ts:65` `{ label: 'Ports', value: '465 or 587 from your app; 25 between servers' }`; `pop3.ts:61` `'110, or 995 with TLS'`; `imap.ts:66` `'143, or 993 with TLS'`. Note `smtp.ts:442` "port 25, the port servers use between themselves" and `what-is-tcp.ts:899` "25 SMTP" both say 25 is SMTP's.
- **DNS or MX lookup**:
  - Cited: `what-is-dns.ts:443` "MX (the domain’s mail server)".
  - Mail: `smtp.ts:397` "To find who takes mail for example.org, it asks DNS for a special record, the **MX record**…"; `smtp.ts:67` `{ label: 'Finds the next server with', value: 'a DNS MX record' }`.

## 5. Where three branches would collide

| File | Lines that name the three now | What a move edits | Adjacent lines (touching pairs) |
|---|---|---|---|
| `src/content/legacy.ts` | 30 (smtp), 31 (pop3), 32 (imap). Opening 29, close 39 | Deletes its own line | 30, 31, 32 are consecutive: every pair of branches touches. |
| `src/content/legacy.test.ts` | 6 (TOUR contains 'imap', 'pop3', 'smtp'); 8 (title: "nine … six … three"); 9 (expected list and filter) | Line 8 (the counts in the title) and line 9 (adds `p !== 'smtp'`, `p !== 'pop3'`, `p !== 'imap'`) | 8 and 9 are consecutive. Every move edits both. |
| `src/content/sources.ts` | 893-901 `rfc-5321` (already present; cited by `what-is-tcp.ts:927`). No `rfc-1939` or `rfc-9051` (no `1939`/`9051` match). The batch-2 header at 1110; the ICMP block at 1459; SOURCES closes at `]);` 1570 | Adds `rfc-1939` and `rfc-9051` (and any new standard the authors cite), before 1570 | Every branch that adds an entry appends at 1569-1570. |
| `src/content/sources.test.ts` | 237-265 (the id list, with batch-2 entries at 257-265 and the batch comments 244, 248, 250, 254, 256, 260, 264); 235 (title: "…then batch 1’s and batch 2’s"); the list closes at `]);` 267 | New ids after 266 (`'paloalto-icmp'`), in the same order as SOURCES; the title at 235 may need "batch 3" | Append point 266-267 is shared with any other branch. |
| `src/content/tracks/how-the-internet-works.test.ts` | 79-81 (counts), 120-122, 130-136, 170, 218-227, 263-265, 297-299, 318, 431-445, 549-572 (table definitions), 636-639 (parties), 659-661 (scene titles), 685-688 (legends), 737-739 (references), 782 (lessonTitles), 850-913 (starts and holds) | Lines 737-739 are removed only when a lesson is cited (the legacy-only expectation); 170, 218-227, 263-265, 297-299 change only if steps, patterns or layers change; 782 changes when `smtp.ts:79`'s "The TLS/SSL lesson" changes | Consecutive pairs: 170 (smtp, pop3, imap on one line); 263-265 (three patterns); 297-299 (three layers); 636-639 (parties: 636, 637, 639, with 638 a comment); 659-661 (three scene titles); 685-688 (legend `[]`s, with 686 a comment); 737-739 (three references); 891-892 (scene starts for pop3 and imap). |

Other files all three would edit:
- Each lesson's own file: `src/content/lessons/what-is-smtp.ts`, `what-is-pop3.ts`, `what-is-imap.ts`. Each is written by one branch.
- `src/progress/internet-split.ts:22-24` and `src/progress/internet-split.test.ts:21` (sizes 9, 8, 8). They change only if the step or question count changes. Consecutive lines 22-24 (three branches touch each).
- New files: `docs/fact-checks/what-is-smtp.md`, `docs/fact-checks/what-is-pop3.md`, `docs/fact-checks/what-is-imap.md` (none exist; the folder has canary, osi-model and the eight cited lessons' reports plus `what-is-udp.recheck.md`). `docs/lesson-changes/<slug>.md` (none exist for the three; the folder has the eight cited lessons).
- Shared docs: `plan.md:75` and `:94`, `team.md:391-392`. `docs/direction.md` does not name the three (grep).
- `src/lib/home.test.ts:239` (POP3 sample): unchanged by a move alone, see section 3.

## 6. Not found

- No per-lesson test file for the three (`src/content/lessons/` has `dhcp.test.ts`, `firewalls.test.ts`, `osi-model.test.ts`, `subnetting.test.ts` only).
- No fact-check report or lesson-changes file for any of the three (`docs/fact-checks/` and `docs/lesson-changes/` listed).
- RFC 1939 and RFC 9051 are not in SOURCES (no `1939` or `9051` in `sources.ts`). I also grepped `sources.ts` for SPF, DKIM, DMARC, MTA-STS, DANE, SASL, STARTTLS, CONDSTORE and the RFC numbers 7208, 6376, 7489, 3207, 8314, 4422: none is present. I did not grep 8461, 7672, 2177, 7162, 4954 or 6409.
- RFC 2606 is not named anywhere in `src`. RFC 5737 is not in `sources.ts`. RFC 1918 is (`sources.ts:1138`).
- No MAC address and no IPv6 address in the three.
- No `techconcepts.app` in the three. `example.com` appears only as `news@example.com` (`imap.ts:297`, `:302`).
- `example.net`, `example.org` appear as named in section 2 (`smtp.ts` 62, 69, 172, 235, 261, 281, 282, 625 for alex@example.net; 48, 62, 69, 261, 311, 312, 625, 706 for sam@example.org; `pop3.ts` 202, 203, 372; `imap.ts` 207, 208, 297, 303, 347, 383, 443, 444, 517, 521).
- No e2e spec quotes the three's words, counts their steps, or names their slugs (only the Email part title, `e2e/site.spec.ts:37`).
- No code keys on the unit ids `smtp`, `pop3` or `imap` outside the tests above and `legacy.test.ts`.
- No table id collision on `trip`, `mailbox` or `inbox` within `src/content/lessons` (only one definition each, `smtp.ts:20`, `pop3.ts:19`, `imap.ts:20`).
- No "the SMTP lesson", "the POP3 lesson" or "the IMAP lesson" in any lesson (grep). The only "The X lesson" sentence in the three is `smtp.ts:79`.
- No Home code reads the three apart from the POP3 sample (`home.test.ts:239`).
- No `miss`, `broadcast`, `lost`, `lock`, `addr` or `url` cue in the three's messages. No quiet step. No `cue:` literal in the mail lessons except the two scene starts (`pop3.ts:47`, `imap.ts:51`).
- No `backing`, `cite` or `overrides` in the three (they are legacy).
- No test or spec reads `docs/direction.md` or `plan.md`.
