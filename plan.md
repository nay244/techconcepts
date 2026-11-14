# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f and its third (written definitions, the pilot, the page) at 92506f4.

**Status: the owner said go on 2026-11-13, with the seven protocol entries** ("Go, with protocols"), which approved the ten decisions below, decision 1 accepted (direction 2.44). Batch 1 runs in a session of its own.

## Inputs

| | |
|---|---|
| **The job** | Job 10, Phase 5: the glossary's **remaining entries**, written, cited and passed by a fresh fact-checker, group by group, through the path job 9 built (`docs/glossary-path-spec.md`) and the way the pilot ran. The list is G1's (`docs/glossary-terms.md`), approved whole by the owner ("All 113", direction 2.42): 103 entries after the pilot's ten, plus the seven protocol entries if the owner's go accepts decision 1. |
| **Done means** | Every entry of the approved list is in a group file under `src/content/glossary-groups/`, each group's report says all pass (`npm run fact-check -- glossary/<id> --check` prints `Report OK`), every group is merged into `revamp`, and on `revamp` `npm test`, `npm run build` and the full `npm run e2e` pass. No lesson's words change. The owner gets the result, the cost, and one list of the lessons' lines found thin or at odds beside their new definitions. |
| **Budget** | Not set by the owner. The estimate is 6.4 to 7.1 million subagent tokens of growth after the go (below); the stops are under "When the work stops for the owner". |
| **References** | `docs/glossary-path-spec.md` §1, §2 and §8 (the group file, its rules, the agents' instructions); `docs/content-model.md` §3 and §8; `src/content/glossary-groups/pilot.ts` and `docs/fact-checks/glossary/pilot.md` (a passed group); `.superpowers/analysis/glossary-pilot/report.md` §7 (the pilot's rulings, which hold for every group); `docs/briefs/analyst-glossary-group.md`, `author-glossary-group.md`, `analyst-read-before-check.md`; handbook §4 and §6a. |

## What the scout found (S12, `prototypes/s12-job-10-facts.md`)

- **Ties.** Of 110 entries, 82 tie to 102 Learn terms in the lessons; every term id exists, and **no lesson term is claimed twice** (rule 14). **28 entries tie to nothing**, because no lesson lists them as a Learn term: the seven OSI layers and the OSI model, Protocol data unit, Frame, Packet, IP, Router, Bit, TCP, UDP, TLS, Destination address, Private address, Public address, Name server, and the seven protocols. Two senses tie to nothing too (Network address in the OSI model; Plain text as "written as text"). An entry with no tie shows no "Described in" line, as built in B8a.
- **Sources.** Every defining standard the entries need is registered (X.200, RFC 791, 792, 768, 9293, 826, 950, 1034, 1035, 1918, 2131, 3022, 4632, 959, 5321, 9051, 1939, 4251 to 4254, 9110, 3986; TLS 1.3 is `rfc-9846`). **No registered source defines Frame, Bit, Public address or Plain text's second sense**: each needs a standard found by its analyst or two publishers. `support.google.com` and `support.microsoft.com` are allowed hosts (Padlock's browser pages); Mozilla and Apple are not.
- **Collisions.** A group touches, beside its own file and report, only `src/content/sources.ts` and `sources.test.ts:236-294`, whose test lists every source id in order: two groups adding sources in parallel conflict there. **Three tests count the pilot's rows and break when the first new group merges:** `src/lib/glossary.test.ts:223`, `src/lib/glossary-page.test.ts:156`, `e2e/glossary.spec.ts:228` (each expects 11). Four draft group ids were lesson slugs (`osi-model`, `subnetting`, `dhcp`, `firewalls`); the canary's entry ids (`dhcp`, `discover`, `offer`, `lease`, `request`) are not in the glossary, so they do not clash. G1's spellings "method" and "latency" equal their own entry's name and would break rule 9.
- **Size.** The budget is 250 KB gzipped a page (`scripts/check-budgets.mjs:17`). `/glossary/` is 6.0 KB with ten entries and grows about 195 bytes an entry: about 27 KB at 120. A lesson page is 98 to 103 KB and grows about 91 bytes a tie.
- **The agents' instructions** last changed at `efeb8b5` (B9's fixes). A session started now loads them with the glossary sections, so a group's check can go to the `fact-checker` agent itself (job 9 had to use a general-purpose agent).

## Decisions in this plan (the go approves them)

1. **The protocols the lessons are named for get entries: DHCP, DNS, HTTP, FTP, SMTP, SSH and ICMP** (the point direction 2.42 left open). A reader meets "DHCP" on a router's settings page, not only in its lesson, and a glossary that defines TCP, UDP, IP, TLS, IMAP, POP3, ARP and NAT but not DNS or HTTP has a hole any reader would notice. Each rests on its registered defining RFC (2131, 1034, 9110, 959, 5321, 4251 to 4254, 792), so they are among the cheapest entries: about 0.4 million tokens for the seven. Like TCP and IP, they tie to no lesson term (no lesson lists its own protocol in Learn), so they show no "Described in" line. **If the owner rejects this**, the seven are dropped from their groups and `remote` and `mail` become one group of twelve; everything else stands. The list becomes 120 entries in all (113 + 7).
2. **Eleven groups, by the sources they share,** with ids that are not lesson slugs (so a checker cannot confuse `glossary/dhcp` with the lesson `dhcp`). (b) marks a borderline entry, (p) a protocol, (2) an entry with two senses.

   | # | Group | Entries | n |
   |---|---|---|---|
   | 1 | `packets` | Protocol data unit (b), Header (2: in the layer model; in HTTP), Frame, Packet, Segment, Datagram, IP, IP header (b), Router, Forwarding, Routing decision (b), ICMP (p) | 12 |
   | 2 | `transport` | TCP, UDP, TCP connection, Three-way handshake, Sequence number, ACK (2: in TCP; in DHCP), Retransmission, Connectionless, Jitter | 9 |
   | 3 | `leases` | DHCP (p), DHCP server (b), Discover (b), Offer (b), Request (b), Lease, Lease renewal, Broadcast, MAC address, ARP, Default gateway | 11 |
   | 4 | `layers` | OSI model, Layer, Physical Layer, Data Link Layer, Network Layer, Transport Layer, Session Layer (b), Presentation Layer (b), Application Layer, Peer layer, Encapsulation, Decapsulation (b) | 12 |
   | 5 | `subnets` | Bit (b), Subnet, Subnet mask, Prefix length, Network portion, Host portion, Network address (2: in subnetting; in the OSI model), Broadcast address, Borrowing bits (b), Point-to-point link (b) | 10 |
   | 6 | `filtering` | Firewall, Firewall rule, First match, Default deny, Stateful, Shadowed rule (b), Port, Source address, Destination address (b), NAT, Private address, Public address | 12 |
   | 7 | `naming` | DNS (p), DNS resolver, Root server, Top-level domain, Referral (b), Authoritative server, Name server (b), A record, DNS cache | 9 |
   | 8 | `web` | HTTP (p), Client, URL, Path (b), Method, Status code, HTML, Rendering, HTTPS, Padlock (b) | 10 |
   | 9 | `security` | TLS, TLS handshake, Certificate, Certificate authority, Cipher suite, Shared secret, Key exchange, Key pair, Encryption, Plain text (2: not encrypted; written as text) | 10 |
   | 10 | `remote` | SSH (p), Shell, Host key, SFTP, FTP (p), Control connection, Data connection, Passive mode | 8 |
   | 11 | `mail` | SMTP (p), Outgoing mail server, Reply code (b), STARTTLS (b), IMAP, POP3, MX record | 7 |

   110 entries: G1's 103 and the 7 protocols. Each entry's ties are G1's rows as S12 §A lists them (Learn names, the spelling and sense rows that are Learn names, and the "tie" rows such as Port 21 and DHCP client). An entry's other spellings are G1's "spelling of" rows, kept only where a cited statement gives them (spec §1), and never a spelling equal to the entry's own name in another case (so not "method" or "latency").
3. **Three groups a batch, a fresh orchestrator session a batch** (handbook §6a): batch 1 `packets`, `transport`, `leases` (32 entries); batch 2 `layers`, `subnets`, `filtering` (34); batch 3 `naming`, `web`, `security` (29); batch 4 `remote`, `mail` (15). Batch 1 holds the entries most like the pilot (RFC 791 and 792, DHCP's messages beside ICMP's) and the hardest source question (Frame), so a fault in the method shows early. At most three heavy agents at once: the three groups of a batch move through the steps together.
4. **Each group runs the pilot's pipeline** (handbook §4, its glossary line):
   a. an `analyst` (Opus), brief `docs/briefs/analyst-glossary-group.md`: for each entry what the definition must say, with source, section and the passage found by script; each tie's lesson line beside its definition (agrees, thin, or at odds); report in `.superpowers/analysis/glossary-<id>/report.md`;
   b. the batch's orchestrator rules each open question into the report's "Rulings" and records them in one direction row a batch;
   c. the batch's new sources are registered in **one commit on the batch's branch before any author starts** (so the ordered list in `sources.test.ts` changes once a batch);
   d. an `author` (Sonnet) writes the group once, in its worktree, brief `docs/briefs/author-glossary-group.md`;
   e. the same analyst, continued, reads the sheet before the check (job 9 and batch 5: keep the continued analyst); the author applies its rulings;
   f. a fresh `fact-checker` (Opus), prompt exactly `The glossary group: <id>. Work in the folder: <path>`;
   g. a failing report is committed as written before its fix; after a near-pass (at most 3 items held back, none wrong) a targeted re-check, `Re-check. ` in front;
   h. merge: each passed group into the batch's branch with `npm test`; the batch into `revamp` once, then `npm test`, `npm run build`, and `e2e/glossary.spec.ts` and `e2e/lesson.spec.ts` on `revamp`.

   Worktrees: `.superpowers/wt/batch-N` on `batch/N` from `revamp`, and `.superpowers/wt/glossary-<id>` on `glossary/<id>` from `batch/N`, `node_modules` linked; ports 4481 and up for the end-to-end runs. Every agent replies in 150 words or fewer and writes its report to a file.
5. **The pilot's rulings hold for every group** (report §7, direction 2.40): the word limit stays 60 a definition; no statement's pass rests on Cisco alone (a non-Cisco pair wherever one exists); a full name only where a cited section gives it; "unique", "every", "always" and the like only where the source says as much; sources saved in `.superpowers/analysis/glossary-<id>/sources/`, never committed.
6. **No extra ties.** S12 found three lesson terms an entry "carries the idea" of: Relay (OSI) for Router, Key share (TLS) for Key exchange, Lease table (DHCP) for Lease. A tie says the term names the same thing, and each of these names another thing (a role in X.200, one field of TLS 1.3, the server's record of leases), so a checker would fail it. They stay in their lessons, as G1 classed them.
7. **An idea no registered source defines** (Frame, Bit, Public address, Plain text as "written as text", and any the analysts find) is met by the standard that defines it, if the analyst finds one on an allowed host, or by two publishers, as any statement; a new host joins `SOURCE_HOSTS` only when it is the publisher's own (handbook §5), recorded in the batch's direction row. An entry is trimmed to what its sources say. Only the owner drops an approved entry.
8. **One small build unit first, B10: the tests stop assuming the pilot is the whole glossary.** The three counts S12 found (`glossary.test.ts:223`, `glossary-page.test.ts:156`, `e2e/glossary.spec.ts:228`) count the pilot group's definitions, not every definition, and any other glossary test that assumes only the pilot's entries exist is found and changed the same way. Builder on **Haiku** (job 9: "a fix list that small could go to a Haiku builder"), Sonnet if Haiku fails; spec review and build review by the reviewer (Opus). It runs in batch 1's session, beside the analysts, and merges before the first group does.
9. **The lessons' lines.** No lesson's words change in this job (direction 2.42). Each analyst sets every tied lesson line beside its definition; the last batch's orchestrator joins those verdicts into one list for the owner (`docs/glossary-lesson-lines.md`), as the pilot did for four lines. A line at odds with its definition is not fixed here: it comes to the owner (below).
10. **Models.** The orchestrator of each batch on Opus 5.5; `analyst`, `fact-checker` and `reviewer` on Opus; `author` on Sonnet; the scout on Haiku; B10's builder on Haiku. Nothing on Fable.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S12 | scout | scout (Haiku) | Ties, sources, collisions, page size. Done (`prototypes/s12-job-10-facts.md`). | Every fact has a `path:line`. |
| B10 | build | builder (Haiku); reviewer (Opus) for the spec and the build | The glossary's tests count the pilot group's rows where they mean the pilot (decision 8). Spec: this row and decision 8; cases saved here after the spec review. | With a second, made-up group file added in a scratch commit, `npm test` and `e2e/glossary.spec.ts` pass with no other edit; the made-up group removed; each changed test turns red when the count it guards is broken (the builder names the break). |
| G-`<id>`-a | batch | analyst (Opus), one a group | The group's report (decision 4a). | Every passage found by script in its saved source; every tie's line has a verdict. |
| G-`<id>`-r | batch | the batch's orchestrator | Rulings in the report; the batch's sources in one commit on `batch/N`. | `npm test` passes on `batch/N`. |
| G-`<id>`-b | batch | author (Sonnet) | The group file, written once. | `npm run fact-check -- glossary/<id>` prints the sheet; `npx astro check` clean; `npx vitest run --mode development` fails only on the group's missing report. |
| G-`<id>`-p | batch | the group's analyst, continued | The read before the check; the author applies it. | Numbered rulings with exact words and citations, applied. |
| G-`<id>`-c | batch | a fresh fact-checker (Opus) | The check; a re-check after a near-pass. | `npm run fact-check -- glossary/<id> --check` prints `Report OK`. |
| M-N | batch | the batch's orchestrator | Each group into `batch/N`, then `batch/N` into `revamp`; the ledger rows; the direction row; a hand-over note; the next batch's session started. | On `revamp`: `npm test`, `npm run build`, `e2e/glossary.spec.ts` and `e2e/lesson.spec.ts` pass. |
| F10 | end | batch 4's orchestrator | The list of lessons' lines (decision 9); the full `npm run e2e` on `revamp`; the ledger's totals and "What to do differently next time"; Phase 5's status; the result for the owner. | The three outputs and the e2e count in `team.md`. |

Order: at the go, this session starts batch 1's session and stops. Batch 1: B10's spec review, then B10 beside the three analysts; B10 merges before the first group. Each batch's session ends by starting the next one, unless a stop below applies. Batch 4 ends with F10.

## Estimate

The pilot measured **about 57,000 tokens of growth an entry** (analyst, author and check: 568,392 for ten entries, 11,800 a checked item at 4.8 items an entry), and about 2.1 million read in all an entry.

| Part | Entries | Growth, roughly |
|---|---|---|
| Batch 1: `packets`, `transport`, `leases` | 32 | 1.8 to 2.0 million |
| Batch 2: `layers`, `subnets`, `filtering` | 34 | 1.9 to 2.1 million |
| Batch 3: `naming`, `web`, `security` | 29 | 1.65 to 1.8 million |
| Batch 4: `remote`, `mail` | 15 | 0.85 to 0.95 million |
| Re-checks after near-passes (the pilot had none; allowance) | | 0 to 0.5 million |
| B10: spec review, Haiku build, build review | | 0.15 to 0.3 million |
| **After the go** | **110** | **6.4 to 7.1 million** (about 230 million read in all) |

Without the seven protocols: 103 entries, about 6.0 to 6.7 million. S12 spent 246,828 before the go. Groups of a dozen may share some reading, which the low ends do not count on. The orchestrators' own tokens are not counted, as in every job; a session a batch keeps each one small.

## When the work stops for the owner

- **The go on this plan**, with decision 1 (the protocols) accepted or rejected.
- A group past **1.0 million** tokens of growth without an all-pass; a batch past **2.8 million**; the job past **7.5 million**.
- A claim that fails three checks.
- An approved entry its analyst finds no allowed source can define truthfully, even trimmed (the owner keeps the list).
- A lesson line **at odds** with its definition (the lesson's words are the owner's to change, direction 2.42). Thin lines do not stop the work; they go in decision 9's list.
- A new host proposed that is not the publisher's own.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports. Everything else the orchestrators decide, record in the direction document, and report with the job's result.

## What could go wrong

- **A definition says more than its sources.** The general words of a textbook definition ("any device", "unique", "always") are the ones a check fails. The analyst lists what each definition may say before the author writes, and the read before the check catches the rest (the pilot's read found twelve things and the check then found none).
- **No defining source.** Frame, Bit, Public address and Plain text's second sense have none registered; Padlock rests on browser vendors' help pages; Shell and Rendering may have only vendor pages. Two publishers are needed for each, or the statement is trimmed (decision 7).
- **Sites that refuse scripts** (Cisco, Cloudflare, some Baeldung pages): read in the built-in browser, the passage and its heading put in the rulings; no statement passes on Cisco alone.
- **The tests assume the pilot.** Three counts break on the first merge; B10 fixes them before it, and asks the builder to search for any other.
- **Parallel groups collide in the registry.** The batch's sources are registered once on `batch/N` before the authors start, so no group branch edits `sources.ts`; a source found later is added on `batch/N` and merged into the group branches.
- **A checker confuses a group with a lesson.** Group ids are not lesson slugs (decision 2), and the prompt names the group.
- **Two senses read as one** (Header, Network address, ACK, Plain text): each sense's label names where it applies, as TTL's do; the check judges every label.
- **A lesson line contradicts its definition.** The analyst's verdict on each tie finds it before the author writes; it stops for the owner rather than being smoothed in the definition.
- **The orchestrator's context grows.** One session a batch, little read at the start, short hand-backs; the ledger one short row a unit.

## After this job

- **The revamp goes live** (the owner's), then Networking Concepts' new lessons; a new lesson's terms join the glossary with it.
- Whether any lesson line is rewritten (decision 9's list; the owner's).
- Held, for the owner to reopen: the standalone Practice page and its missed list (D6, D7); About's sources box; the registry addresses that moved; the code for lessons of several units; exporting saved progress; objective mappings' own fact-check path.

## Not in this plan

- A change to any lesson's words, or a lesson's re-check.
- A change to the Glossary page's design, or to how a definition shows in Learn.
- Entries beyond G1's list and the seven protocols.
- Copying another site's text; a source host that is not a publisher's own.
- Anything that leaves this machine.

## B10: the spec review's cases and errata (batch 1, 2026-11-13)

Errata (the orchestrator, one right answer each): H1 to H6, H8 and H9 are closed as the reviewer answers them below; H7 holds as written (a red last-letter test stops B10 and goes to the designer; it is not loosened). **The builder is Sonnet, not Haiku** (decision 8 changed): the review found twelve places in three files and three end-to-end specs to run, past what job 9 called a Haiku-sized list. The scratch group's report (H1) is written by hand from its sheet, and leaves with the group.

### Holes, worst first (with the answer I would pick)

H1. The check cannot pass as written. A group file with no report makes the registry throw in test and build mode
(src/content/registry.ts:327-328, gate.ts:247-266: "no fact-check report at docs/fact-checks/glossary/<id>.md"), so
every test that imports the registry goes red before any count is reached. "No other edit" must allow the report.
Answer: the scratch commit holds exactly two files, `src/content/glossary-groups/<id>.ts` and
`docs/fact-checks/glossary/<id>.md`, the report written from `npm run fact-check -- glossary/<id>` (its hash, every key
"✅", `checked` a day later than the pilot's); nothing else.

H2. The made-up group's shape is unstated; a one-entry group under an existing letter passes the check and proves
nothing. Answer: the shape in case S below.

H3. The three counts are not all the pilot assumptions. Also broken by the real groups:
- src/lib/glossary.test.ts:308-310 (letters "DEILPT", the exact list of eleven names);
- src/lib/glossary.test.ts:330 and :332 (every definition one track, and every definition has tracks: the 28 untied
  entries and every Networking Concepts tie break it);
- src/lib/glossary.test.ts:342 (no lessonMap key starts "osi-model/": `packets` ties osi-model:term-header in batch 1);
- src/lib/glossary.test.ts:347 (the stamp's date is the pilot report's date: false once a later group passes);
- src/lib/glossary-page.test.ts:174-178 (six keys, none dashed: 13 letters or more gives 26 keys with dashes);
- e2e/glossary.spec.ts:111 (no `.gl-key--none`);
- e2e/glossary.spec.ts:363-375 (check 26 on osi-model as "a lesson with no tied term": false in batch 1);
- e2e/glossary.spec.ts:453-466 (check 32: in the DNS lesson only TTL is tied, and the untied "Answers kept for next
  time" row is 42.2px: `naming` ties what-is-dns:term-cache in batch 3);
- e2e/glossary.spec.ts:201 (comment "The pilot: 43 row links").
Answer: all are in B10 (decision 8's "any other"). Not pilot assumptions, leave as they are: glossary.test.ts:305-307,
:351-353; glossary-page.test.ts:54, :125, :143, :12 entries loop; e2e:43-44, :110, :203; definitions.no-script.test.ts:31.

H4. The e2e cannot load the glossary (e2e/glossary.spec.ts:7-9, E2), so ":228 counts the pilot group's rows" has no data.
Answer: filter the rows by `closest('.gl-entry').id` in the pilot's ten entry ids, taken from
`src/content/glossary-groups/pilot.ts` if it imports under Playwright (it uses no import.meta.glob), else a typed list
that a Vitest test pins to pilot.ts's ids.

H5. After batch 4 every ready lesson has a tie (S12 §A totals: 17 lessons plus ICMP, all 18), so check 26's e2e has no
lesson "with no tied term" left. Answer: the no-hint, no-tie half stays in src/lesson/Explanation.test.tsx:298 (fixture);
the e2e keeps only "an untied row has no attribute and no button", on rows no approved entry ties (S12 §A.3, e.g.
what-is-tcp term-dupack, term-sack, term-fin), and asserts no hint only if it can name such a lesson (it cannot): drop it.

H6. Check 32's row (DNS cache) will be tied. Answer: the "tied rows are exactly the rows with data-def" half is
computed, not "['TTL']"; the untied-row half (no button, no min-height, one row's height) moves to a row no approved
entry ties (S12 §A.3, e.g. what-is-tcp term-dupack at its Learn step), its height measured on revamp at 1440 before
the change, since an untied row is unchanged by design.

H7. The 375 last-letter tests (e2e:113-118 bar 68-80px; :134-142 bar at 68px from the middle of the last letter)
hold only if the last letter is tall enough to scroll to the top. The approved list's last letter is likely short
(U: UDP, URL). That is the page's behaviour, not a count. Answer: the scratch group gives a one-entry last letter; if
these go red, B10 does not loosen them: it stops and the orchestrator takes it to the designer.

H8. The check runs only e2e/glossary.spec.ts, yet a tie changes Learn rows (a button, a min-height) in lessons that
e2e/lesson.spec.ts and e2e/reading.spec.ts measure (reading.spec opens dhcp and osi-model at Learn), and M-N runs
lesson.spec. Answer: with the scratch group, run glossary, lesson and reading specs; a red outside glossary.spec that is
not a pilot assumption is reported, not fixed in B10.

H9. "The made-up group removed" names no proof. Answer: case R.

### Case S: the made-up group (the scratch commit)

One group, id `b10-scratch` (not a lesson slug, not `pilot`), statements copied in shape from pilot.ts (real registered
sources, defining citations), and its report per H1. It must hold:
- S1 terms under at least seven letters the pilot lacks (A, B, C, F, M, R, U, say), so the page has 13+ letters;
- S2 one term starting with a digit ("802.1X", say), for the 0–9 key;
- S3 one entry with no tie (no "Described in" row);
- S4 one entry tied only to a Networking Concepts term no approved entry ties: dhcp:term-lease-table (the dhcp lesson
  is listed by Networking Concepts only, src/content/tracks/networking.ts:51);
- S5 a tie to osi-model:term-header (as `packets` will);
- S6 a tie to what-is-dns:term-cache (as `naming` will);
- S7 an entry with two senses and one pointer ("also");
- S8 the last letter holds a single one-line entry (as U may);
- S9 its report's `checked` date later than the pilot's (2026-11-14).

### Attack cases

### Check 1: with the made-up group added, `npm test` and `e2e/glossary.spec.ts` pass with no other edit

1. Scratch commit = group file + report only. Proof: `git show --stat HEAD` lists exactly those two paths; then
   `npm test` exits 0. A build that edits a test inside the scratch commit fails this.
2. Pilot definitions count (glossary.test.ts:223): pilot's definitions are 11 with S in. Proof: `npm test` green with S;
   the test reads `GLOSSARY_GROUPS.find((g) => g.id === 'pilot')`, not all letters.
3. Shape check (glossary.test.ts:224) still runs on every real definition, S's too, not on the pilot's only. Proof: give
   one S definition a track title not in `tracks` by hand (impossible through data, so: assert the loop's length equals
   the total definitions, `GLOSSARY.reduce(partsOf)`), and it is greater than 11 with S in.
4. glossary-page.test.ts:156: pilot rows 11 with S in; and `rows()` still equals every definition with tracks (all
   groups). Proof: `npm test` green with S; with S3's entry given a tie the total moves and the test stays green.
5. e2e:228: pilot rows 11 at 375 and 768 with S in, and the per-row height rule still runs over every row, S's too.
   Proof: `npx playwright test e2e/glossary.spec.ts` green with S; the rows array length > 11.
6. Letters and names (glossary.test.ts:308-310): the pilot's eleven items in order are a subsequence of the page's items,
   and the page's letters are the first letters of every item. Proof: green with S1, S2 (letters include "0–9").
7. Tracks (glossary.test.ts:330, :332): "one track, How the Internet Works" applies to pilot definitions only; "every
   definition has tracks" applies to the pilot only. Proof: green with S3 and S4.
8. Lesson map (glossary.test.ts:342): replaced by "the map's keys are exactly the ties of the glossary" (every
   `lesson/term` of every part's `lessons`). Proof: green with S5, S6.
9. Stamp date (glossary.test.ts:347): the stamp's date is the latest of `glossaryCheckedOn(g.id)` over the groups.
   Proof: green with S9; and `glossaryCheckedOn('pilot')` still equals the pilot report's date.
10. Keys (glossary-page.test.ts:174-178): live keys equal the letter sections; dashed keys are 26 minus live when the
    letters are 13 or more, none when fewer. Proof: green with S (26 keys) and green without S (6 keys).
11. e2e:111: the same rule from the DOM. Proof: green with S, where `.gl-key--none` count is 26 − live.
12. Check 26 (e2e:363): per H5; osi-model:term-relay (stays untied) or what-is-tcp term-dupack serves as the untied
    row. Proof: green with S5 in (osi-model now tied); the Vitest half
    (Explanation.test.tsx:298) unchanged.
13. Check 32 (e2e:453): per H6. Proof: green with S6 in (DNS cache now tied); the tied rows of the DNS lesson read
    ['TTL', 'DNS cache'] or whatever S ties, computed from data-def.
14. Last letter (e2e:113-118, :134-142): green with S8. If red, see H7: report, do not loosen.
15. 0–9 key at 320 and 375 (e2e:147-155, :244-251): no sideways scroll and keys 44px with 27 keys. Proof: green with S2.
16. Learn elsewhere (H8): `npx playwright test e2e/lesson.spec.ts e2e/reading.spec.ts` green with S5, S6 in.
17. `npm run build` with S in: exits 0 (astro check, budgets).
18. Nearest wrong build, refused: replacing `toHaveLength(11)` by `toBeGreaterThanOrEqual(11)` or deleting the line
    passes check 1 but fails case 21 (it cannot go red when a pilot row goes). Proof: case 21.
19. Nearest wrong build, refused: counting "rows whose entry is in the first six letters" or by name list typed in the
    test without tying it to pilot.ts. Proof: rename a pilot entry's id in a scratch edit; a typed list not pinned to
    pilot.ts stays green (wrong); the pinned one goes red.

### Check 2: the made-up group removed

20. After the run the scratch commit is gone: `git diff revamp...<branch> --stat` names only test files (src/**/*.test.ts,
    e2e/*.spec.ts, and a Vitest pin per H4 if any); nothing under src/content/glossary-groups/ or docs/fact-checks/.
    And on the branch head without S: `npm test`, `npm run build` and `npx playwright test e2e/glossary.spec.ts` green.
    A build that leaves the report behind fails: the gate refuses an orphan report (gate.ts:268-270).

### Check 3: each changed test (every data break below runs under `npx vitest run --mode development`, since a
### changed pilot no longer matches pilot.md's hash and the gate would throw first in test mode) turns red when the count it guards is broken (the builder names the break)

21. Pilot definitions (glossary.test.ts:223) and pilot rows (glossary-page.test.ts:156): delete the `lessons` tie of one
    pilot entry (e.g. `packet-loss`) in a scratch edit and run `npx vitest run --mode development` (the gate warns
    there instead of throwing, as the G-b check uses it): glossary-page.test.ts:156 goes red (10 rows). For :223 drop
    TTL's DNS sense (and its tie): red (10 definitions). For e2e:228: render no
    `.gl-row--tracks` for `#packet-loss` in a scratch edit of GlossaryEntry.astro (or drop one id from the e2e's pilot id
    source if it is a typed list): red. Run each with S in and without.
22. Add a third sense to the pilot's TTL in a scratch edit: glossary.test.ts:223 goes red (12).
23. Pilot names (glossary.test.ts:310): change one pilot term's case ("Echo Reply"): red.
24. Keys (glossary-page.test.ts:174, e2e:111): with S in, drop GlossaryKeys' dashed spans (render only live keys): red.
    Without S, render one dashed key: red.
25. Lesson map (case 8): add a stray key to lessonMap in glossary.ts, or drop S5's: red.
26. Stamp date (case 9): make the stamp take the first group's date instead of the latest: red with S9.
27. Tracks (case 7): give a pilot definition a second track by tying a Networking Concepts term to a pilot entry: red.
28. Check 32 (case 13): give the untied row's li a min-height of 44px in console.css: red. Tie it: red (it is no longer
    untied), so the test's chosen row must be one no approved entry ties.
29. Check 26 (case 12): give untied rows a `data-def` attribute: red.
30. Every break is undone and named in the builder's report with the red test's name and the command.
