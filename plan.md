# Plan

How the work is divided is in `CLAUDE.md` (Team). The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9.

**Status: planned on 2026-11-12, waiting for the owner's go.** One go covers batch 3 and batch 4 and approves the fourteen decisions below. Nothing after the two scouts has started.

## Inputs

| | |
|---|---|
| **The job** | Phase 4, lessons 9 to 14 of 17, the last six of How the Internet Works: **What is SMTP, What is POP3 and What is IMAP** (batch 3), then **What is FTP, What is SSH and What is TLS** (batch 4), each moved to the cited shape and through a fresh fact-check, three side by side. One plan, one go and one session for both batches (direction 2.30), since the owner asked for fewer stops and less waiting (direction 2.29). Each batch runs as batch 2 did (`team.md`, job 6), with its "What to do differently next time". |
| **Done means** | Each of the six is cited, has a passing fact-check with a confirmed quote record, and shows "Checked" with a date. `npm test`, `npm run build` and `npm run e2e` pass on `revamp` after each batch's merge, with their output in `team.md`. `team.md` has each lesson's cost against the estimate, its count of corrections, and what the checkers passed as a simplification. One report lists every changed sentence of the six, against each lesson as it was before its move, and is sent to the owner when What is TLS has passed (direction 2.29). All fourteen tour lessons are then checked. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate is 0.85 to 1.25 million subagent tokens a lesson, 2.8 to 3.4 million for batch 3 and 2.7 to 3.3 million for batch 4 (table below). The stops are under "When the work stops for the owner". |
| **Design refs** | `docs/content-model.md` (§8 is the workflow, with "What a check passes"); the eight checked tour lessons at the lines the scouts list; `docs/lesson-changes/what-is-https.md` for what What is TLS must agree with and for the form of a list; `docs/direction.md` decisions 2.23, 2.24, 2.26, 2.28 and 2.29. No screen changes its layout in this job, so it has no design unit. |

## What the scouts found (S7 and S8; `prototypes/s7-batch-3-facts.md` and `prototypes/s8-batch-4-facts.md` have every `path:line`)

Two scouts ran side by side, one a batch: the six lesson files come to 3,465 lines, where batch 2's three came to about 1,140.

- **Sizes.** What is SMTP: 6 Watch steps, 37 events (34 messages, 3 table rows), 8 terms. What is POP3: 5 steps, 32 events (24, 8), 7 terms. What is IMAP: 5 steps, 28 events (24, 4), 8 terms. What is FTP: 6 steps, 26 events (20, 6), 8 terms. What is SSH: 6 steps, 31 events (25, 6), 8 terms. What is TLS: 6 steps, 18 events (10, 8), 9 terms. Each has four facts a step, 5 Learn facts and 2 questions. Batch 2's largest had 21 events.
- **Their documents.** Registered already: RFC 5321 (SMTP), RFC 959 (FTP) and RFC 9846 (TLS 1.3). Not registered: RFC 1939 (POP3), RFC 9051 (IMAP), and RFC 4251 to 4254 (SSH). What is TLS names RFC 8446, which RFC 9846 made obsolete (direction 2.26). What is SSH says "Defined in RFC 4251 to 4254" and lists two of the four; a test asks a cited What is SSH to list all four, and the test's last exception (`uncited`, for `ssh`) goes with it.
- **Home.** One line of `src/lib/home.test.ts` uses What is POP3 as a sample: its page shows words and pictures from step 4. A move alone leaves it true. It breaks only if the `page: 'full'` cue leaves step 4 or both of that lesson's page cues go. Nothing else on Home reads any of the six.
- **Page cues.** What is POP3: `text` on letter 1 and `full` on letter 2, both in step 4. What is IMAP: `full` on the letter it fetches. What is SSH: `text` on the prompt, `full` on the output of `ls`. What is TLS: `full` on the reply to `GET /`, the story's only request. `text` draws the page's lines of words; `full` adds the picture square.
- **End to end,** two lines name one of the six, both the card of What is TLS on the track page: its name tile's label is "Transport Layer Security (SSL is its old name)" and it wraps to two lines. A unit test of the name tile holds the same words. Every other spec loops over the ready lessons.
- **What a test holds across lessons.** "The TLS/SSL lesson covers the handshake." in What is SMTP (the track test counts two such pointers, the other in What is HTTPS). Each lesson's step titles, pattern names, table cells, parties, scene title and labels, and the map's layers are held by the track test, as for every lesson before.
- **The three mail lessons say the same things in different words:** the port that starts sealed (465, 995, 993), the plain port that upgrades (STARTTLS in two, STLS in What is POP3), the password going only inside the seal, app passwords, where mail is kept, and that sending is SMTP's job. Each also says what the other two protocols do (fourteen sentences, listed in S7 §4). What is IMAP's story shows an SMTP delivery.
- **What is TLS and What is HTTPS** tell the same handshake in the same order, with one sentence the same word for word. They differ in six places (S8 §4): the key exchange (What is HTTPS has "X25519 with ML-KEM", What is TLS shows X25519 alone); RFC 8446 against RFC 9846; message sizes (What is HTTPS shows dashes, and its check found "517 B" for a ClientHello wrong); the page cue (`full` against `text`, drawn in What is HTTPS only once the stylesheet arrives); the OSI badge (6 against 7, for two different protocols); and what CertificateVerify and Finished prove, which only What is TLS says. `techconcepts.app` is What is TLS's example site, as it is What is HTTPS's.
- **The same five files collide** in each batch: three consecutive lines of `src/content/legacy.ts`; the same two lines of `legacy.test.ts`; the end of `sources.ts` and of the list in `sources.test.ts`; touching rows in the track's test. In batch 4 only What is SSH adds documents.
- **Not found:** no test file, report or list for any of the six; no MAC or IPv6 address; no "the SMTP lesson", "the FTP lesson" or the like in any lesson.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **One job, two batches, one go.** Batch 3 runs, merges into `revamp` and has its checks run; batch 4 follows with no stop between. The owner gets a short report when batch 3 is on `revamp`, with any note that is not a stop.
2. **Each batch in batch 2's order.** Three analysts together; the orchestrator's rulings, recorded in `docs/direction.md` and written into each report; the batch's documents registered in one commit on `batch/3` (then `batch/4`, made from `revamp` after batch 3 is on it); one author per lesson in its own worktree; the lesson's analyst reads the claim sheet as the checker will, by both named tests (a traced item; a claim, every part of it in a quoted passage of a defining document or of two publishers); a fresh fact-checker told the slug and the folder and nothing else; merge into the batch's branch with `npm test` after each; `revamp` moves once a batch.
3. **Batch 4's analysts start while batch 3's lessons are at their fact-checks,** if every batch 3 lesson has reached its check without a stop. An analyst changes no file and needs nothing batch 3 leaves behind; the wait it saves is the longest single step of a batch. At most six agents run at once. If a batch 3 check fails, its fix comes first and batch 4's authors wait for it.
4. **The full end-to-end run follows each batch's merge into `revamp`,** in the background, with its exit code written to a log. Batch 4 does not wait for batch 3's run; a failure in it is fixed before batch 4 merges.
5. **Each lesson keeps its shape:** its Watch steps, their order, its events, its tables, its scene and its two questions, since progress positions and tests rest on them. Where a source would add, remove or reorder a step or an event, the author stops and the orchestrator decides and records it.
6. **Marks on the figure are ruled per lesson from its analyst's report,** by the rule batch 1 settled: a page cue stays only where the story has fetched what it draws, and a web page is not drawn when only its HTML has arrived (direction 2.23, 2.26). The analyst says, for each cue, what the story has fetched by then. Expected, not yet ruled: What is TLS's cue goes or becomes words only, as What is TCP's and What is HTTPS's did; the mail lessons' and What is SSH's cues stand for a letter and a terminal's screen, so the HTML rule does not reach them and the question is whether a letter with a picture was fetched.
7. **A shared idea is said once.** The three mail analysts each get S7's list of what the three share, and report those ideas in a section of their own. Before the authors start, the orchestrator sets one wording and one set of citations for each shared idea and writes it into all three reports. An analyst reads the checked lessons at the lines the scouts list, not whole, and uses their checked words and citations for an idea they already state (a TCP hello, a port, an MX record, the seal).
8. **What is TLS agrees with What is HTTPS.** Its analyst reads What is HTTPS whole, its list of changes and S8 §4, and reports each of the six differences with what the sources say. Where the two lessons state one idea, What is TLS uses the checked words and citations unless a source says more that this lesson needs. TLS 1.3 is cited as RFC 9846. If a source shows What is HTTPS wrong, that comes to the orchestrator as its own item: a checked lesson changes only through a re-check.
9. **The analysts are told up front** what batch 2's learned late: a vendor's or a tool's own detail needs two publishers, and no vendor page carries the defining marker (direction 2.28); the OSI badge needs two vendors' pages that place the protocol, or a plain "none, so it spans"; `www.cisco.com` answers a plain request, and `www.cloudflare.com` reads only in a browser, which an analyst does not have; a new host is proposed with its publisher and why no listed host states the idea.
10. **Who changes which test.** An author: its lesson's file, its slug off the legacy list and that list's test, its lesson's rows in the track's test (for What is SSH, the `uncited` entry), and the registry only for a document the analyst missed. Never Home's files, `e2e/`, `src/art/` or another lesson's rows. A pointer to another lesson that a test holds stays word for word. An author runs no formatter and reads for itself the sections it cites on its own.
11. **Home gets a unit only if a ruling moves What is POP3's `full` cue** (H3: `src/lib/home.test.ts` alone, with a spec, a spec review, a builder and a build review, as batch 1's H2 had). Nothing else on Home or in a named end-to-end check rests on these lessons' words. If a source forces a change to What is TLS's full name, which two tests outside the author's files hold, the orchestrator writes that unit then.
12. **No list of changed sentences per lesson; the authors still write the rows.** After its lesson passes, each author writes its section of the track's report (every changed sentence, before and after, with the source that forced it, and the checker's notes on what it passed as a simplification) to a working folder that git ignores, `.superpowers/track-report/`. When What is TLS has passed, the orchestrator joins the six sections into one report in `docs/lesson-changes/`, checks by script that every quoted before and after is in the two versions of the lesson's file, and sends it to the owner. `team.md` suggested a script and Haiku at the end; the author who made a change knows its reason, and a later agent would have to work it out again from the reports.
13. **Tokens are counted from each agent's transcript** where its context was summarised, since the reported figure falls then. The ledger is filled as units finish.
14. **When a claim will not pass:** after two failed checks on the same claim it goes to the analyst; after a third it comes to the owner. Four items failing on one idea is not a near-pass, so it costs a full check.

## Units

Batch 3 is L9 What is SMTP, L10 What is POP3, L11 What is IMAP. Batch 4 is L12 What is FTP, L13 What is SSH, L14 What is TLS.

| Unit | Owner | What | Check |
|---|---|---|---|
| S7, S8 | scout, one a batch, together | What rests on the six lessons, what they share with each other and with the checked lessons, and where three branches collide. Done: 275,677 and 328,332 tokens. | Every fact has a `path:line`. |
| L9-a to L14-a | analyst, one a lesson, three together | **Every idea the lesson teaches**, in Learn, Watch and Practice: the source and deepest section that backs it, the quoted passage, and one of four verdicts: stated; true for a beginner as written, so it stays word for word; false or misleading, with the smallest change; no source. It names every document with a proposed registry entry and any new host; settles the OSI badge; lists what the Watch tab shows and the Learn part that states it; says for each page cue what the story has fetched; and says whether a source forces a change to a step, an event or a mark. The mail analysts add the shared ideas (decision 7); What is TLS's adds the six differences (decision 8). | Every idea has a row; every quoted passage is found by script in the saved source. |
| R3, R4 | orchestrator | Rule on what the analysts leave open, the shared wording and the marks, and record it in `docs/direction.md`; make the batch's branch from `revamp`; register the batch's documents on it in one commit (with `sources.test.ts`); make the three worktrees (`.superpowers/wt/<slug>`, branch `lesson/<slug>`, `node_modules` linked). | `npm test` passes on the batch's branch. |
| L9-b to L14-b | author, one a lesson, in its worktree | **The lesson in the cited shape**, within decisions 5, 6, 7, 8 and 10, with the six-fault sweep. | The claim sheet prints; `npx astro check` has no error; the report lists every changed sentence and every doubt. |
| L9-p to L14-p | the lesson's analyst, continued; then its author | **The read before the check:** every item judged as the checker will, by both named tests, and the author's doubts ruled on, each with exact words and citations; the author applies them. | The rulings are applied as written; the sheet prints. |
| L9-c to L14-c | fact-checker, a fresh one each run, in the lesson's worktree; analyst and author for fixes | **The fact-check.** A full check; after a near-pass, targeted re-checks. A failing report is committed as written before its fix. | `npm run fact-check -- <slug> --check` (or `--recheck --check`) says OK, with the quote record confirmed. |
| L9-d to L14-d | author | Its section of the track's report (decision 12). | Its counts match its rows. |
| H3 | orchestrator, reviewer, builder | Only if decision 11 calls for it: Home's sample in `src/lib/home.test.ts`. | The build review passes; `npm test` passes. |
| M3, M4 | orchestrator | Merge each passed lesson into the batch's branch, reconcile the five files so both sides are kept, remove its worktree. | `npm test` passes after each merge. |
| F3, F4 | orchestrator | Merge the batch's branch into `revamp` once, then `npm test`, `npm run build` and the full `npm run e2e`, lid open. Then the ledger and the direction doc's Phase 4 status. After F3, a short report to the owner. | The three outputs are in `team.md`. |
| T1 | orchestrator | The one report of every changed sentence of the six lessons, joined from the authors' sections, checked by script, sent to the owner. | Every quoted before and after is found in the two versions of its lesson's file. |

## Estimate

| Role | Model | Units | Tokens, roughly |
|---|---|---|---|
| scout | Haiku | S7, S8 | 604,009 (spent) |
| analyst | Opus | six reports with their rulings, six reads before the check | 2,800,000 to 3,300,000 |
| author | Sonnet | six lessons, the rulings, six sections of the report | 1,500,000 to 1,800,000 |
| fact-checker | Opus | one full check a lesson, and one more for two of the six | 1,150,000 to 1,650,000 |

The lessons' rows come to 5.5 to 6.7 million for the six. Batch 1's three cost 2.92 million and batch 2's 2.72 million, 7,400 to 9,400 tokens for each item on a claim sheet. These six should have 110 to 140 items each where batch 2's had 97 to 118: What is SMTP has 37 events against batch 2's largest 21. So a lesson is planned at 0.85 to 1.25 million, with What is SMTP and What is SSH at the top. H3, if it is needed, is about 0.25 million more.

## When the work stops for the owner

- One lesson passes 1.6 million subagent tokens without an all-pass, or a batch passes 4.0 million after the go. Batches 1 and 2 had 1.5 and 3.6 million; these lessons are larger, and at the old numbers batch 3 could stop on one second check with nothing wrong.
- A claim fails three checks.
- No allowed source backs a Watch step's story.
- Anything the owner keeps comes up.

Everything else is decided by the orchestrator, recorded, and reported with the batch: a new host on the allowed list, a mark on the figure, a badge that spans layers, a shared wording. If the owner's usage limit is reached, the agents stop where they are and the session carries on from the ledger and `git log` when it resets.

## What could go wrong

- **What is SSH's story shows OpenSSH's own choices** (`sntrup761x25519-sha512`, `chacha20-poly1305@openssh.com`, `known_hosts`, `authorized_keys`), and OpenSSH's defaults have moved since the lesson was written. Each needs a standard or two publishers (direction 2.28); the analyst may propose OpenSSH's own site as a host. If a step's story has no allowed source, it comes to the owner.
- **The mail lessons lean on what apps and providers do** (app passwords, sign-in tokens, which port an app uses). Google's and Microsoft's help pages are allowed hosts already; what only one states is reworded or cut.
- **What is IMAP teaches the current standard, RFC 9051, and most servers still run the one before it.** Its analyst says where the two differ for what the lesson shows.
- **What is TLS disagrees with What is HTTPS after its move.** Decision 8 is for that, and the lesson's analyst reads the claim sheet against What is HTTPS before the check.
- **Three authors word one shared idea three ways.** Decision 7 sets the words before they start; the orchestrator compares the three sheets for the shared ideas before the checks.
- **A lesson's first check fails on one idea said in several places.** That lesson then costs about 280,000 more (an analyst's pass, the author's, a second full check).
- **Six agents at once use the allowance twice as fast as three** for the hour batch 4's analysts overlap batch 3's checks.
- **One session carries two batches,** and a long session re-reads its history on every turn. If it grows heavy, batch 4 moves to a fresh session, which starts from this plan, the ledger and `git log` with no new go.
- **Work kept outside the repo is lost overnight** if it is in the session's scratch folder. Agents save their sources where their instructions say (`mktemp -d`), and the report's sections go to `.superpowers/`.
- **A merge's reconciliation goes wrong.** `npm test` after each merge holds the exact lists, and each lesson's report fails the build if its lesson changed.
- **One lesson stalls.** The other two merge into the batch's branch and wait; a batch finishes without a lesson only on the owner's word.

## After this job

| Batch | Lessons |
|---|---|
| 5 | DHCP, Subnetting, Firewalls (Networking Concepts), a job of its own, planned after this one |

## Not in this plan

- The three Networking lessons.
- Anything on Home but H3, and only if a ruling calls for it.
- A change to a checked lesson. What a source shows wrong in one comes to the orchestrator as an item of its own.
- Networking's TLS entry, which has no lesson yet.
- Adding the first ACK's row to What is TCP's animation, and a second address translation in What is IP (the owner left the first; the second is a note in job 6).
- Anything that leaves this machine.
