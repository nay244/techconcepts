# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005.

**Status: planned on 2026-11-12, waiting for the owner's go.**

## Inputs

| | |
|---|---|
| **The job** | Phase 4's last batch, batch 5: the three Networking Concepts lessons on the legacy list, **DHCP, Subnetting and Firewalls** (`src/content/lessons/dhcp.ts`, `subnetting.ts`, `firewalls.ts`), each moved to the cited shape and through a fresh fact-check, three side by side, as the handbook's section 4 sets out. The first job run by Opus 5.5 as orchestrator (direction 2.33). |
| **Done means** | Each of the three is cited, has a passing fact-check with a confirmed quote record, and shows "Checked" with a date. The legacy list is empty. One report of every changed sentence of the three, against each lesson as it was at `e8ea005`, is in `docs/lesson-changes/` and sent to the owner. `npm test`, `npm run build` and the full `npm run e2e` pass on `revamp`, with their output in `team.md`. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate is 2.7 to 3.6 million subagent tokens for the three (below); the stops are under "When the work stops for the owner". |
| **Design refs** | `docs/content-model.md` §8; `docs/orchestrator-handbook.md` §4 to §6a; the checked What is DHCP (`src/content/lessons/what-is-dhcp.ts`, `docs/lesson-changes/what-is-dhcp.md`) for what DHCP must agree with; `what-is-ip.ts` for addresses and masks; direction 2.23 to 2.32. No screen changes its layout, so the job has no design unit (decision 9 says what About shows). |

## What the scout found (S9; `prototypes/s9-batch-5-facts.md` has every `path:line`)

- **Sizes.** DHCP: 5 steps, 8 events (6 messages, 2 lease-table rows), 17 step facts, 8 terms, 6 Learn facts, 3 questions; every message is `342 B`. Subnetting: 6 steps, 17 events, all notes (no messages, no Sequence view), 24 step facts, 10 terms, 7 Learn facts, 3 questions, and a `STATED` list of about 70 numbers checked against the subnet engine at load. Firewalls: 6 steps, 11 events (6 messages, 4 table rows, 1 note), 21 step facts, 8 terms, 5 Learn facts, 3 questions, a rule list that reorders at step 6. None has a page cue. They are smaller than the tour lessons in events and Learn, and Subnetting is the largest by words.
- **Their shape differs from the tour's:** each has its own figure (`dhcp`, `subnet`, `firewall`) and its own event helper (`helpers/packets.ts`, `subnet-events.ts`, `firewall-events.ts`), each imported by that lesson alone. The cited shape accepts any figure (OSI Model is cited on its own); every event a helper builds will need a backing.
- **Their documents.** Registered: RFC 2131, RFC 2132, RFC 4632 (and RFC 1918, which Subnetting does not cite). Not registered: RFC 950, RFC 3021, RFC 5737, NIST SP 800-41 Rev. 1.
- **DHCP against the checked What is DHCP** (S9 §5a): agree on the four messages, ports 67 and 68, the 24-hour lease, renewal at half and the request's broadcast. They differ in four places: the badge (`[7]` against "spans", direction 2.28); the Offer and the ACK (broadcast with the flag set, against the tour's "may broadcast or send straight to the client"); "Windows gives itself 169.254.x.x (APIPA)" against the tour's link-local address on RFC 3927; and "Defined in RFC 2131, RFC 2132" against RFC 2131 alone. What is DHCP's hook points to this lesson in words a test holds.
- **Pointers to lessons not yet written.** DHCP and Firewalls point to Networking lessons by number ("Lessons 10 and 11 cover ports and UDP", "lesson 12", "lesson 14", "lesson 19"), and Subnetting by title ("The IP Address lesson", "The Router lesson"). Of the lessons they name, only Subnetting, DHCP, Firewalls and OSI Model exist. Tests hold the numbers (`dhcp.test.ts:100-111`, `firewalls.test.ts:296-299`).
- **What rests on the three** is far more than on any tour lesson: each has its own test file (116, 402 and 377 lines), its figure's driver tests, the rules panel's tests, the spoken words of DHCP's step 4 (`src/lesson/announce.test.ts:73-80`), four end-to-end specs (step titles, the lease table's region, the panels, Subnetting with no Sequence view), the track tests, and the About page, which lists DHCP's references (`src/pages/about.astro:36`, `src/lib/about.test.ts:46-51`).
- **Tests that use `dhcp` as the sample of a legacy lesson:** `src/content/factcheck/cli.defaults.test.ts:7-11`, `src/content/define.test.ts:553-558` and `src/content/legacy.test.ts:74-77`. Once all three move, the list is empty and no real slug can stand in.
- **Collisions:** three adjacent lines of `src/content/legacy.ts` (30-32) and line 9 of `legacy.test.ts`; the end of `sources.ts` and the list in `sources.test.ts`; the Subnetting and DHCP rows of `src/lib/track.test.ts`. Each helper and each lesson test file has one owner.
- **Out of date:** the comment in `src/content/legacy.ts:24-28` (the tour's fourteen lessons "keep their uncited words"; "§10" points at the wrong section) and the sentence in `docs/content-model.md` §4 that lists How the Internet Works among the older shape.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **One batch, one session, job 7's order** (handbook §4): three analysts together; the orchestrator's rulings, recorded in `docs/direction.md` and written into each report; the documents registered in one commit on `batch/5`, a branch in a worktree of its own (`.superpowers/wt/batch-5`); one author per lesson in its own worktree; the read before the check; a fresh fact-checker told the slug and the folder and nothing else; merge into `batch/5` with `npm test` after each; `revamp` moves once.
2. **At most three heavy agents at once** (analysts and fact-checkers, Opus; handbook §1, §6a). Authors (Sonnet) may run beside them. Every agent writes its report file in parts and replies in 150 words or fewer: the result, the counts, the path, its open questions.
3. **The trial the handbook asks for: Firewalls' read before the check is done by a fresh analyst**, given the report file, its rulings and the saved sources; DHCP's and Subnetting's are done by their own analyst, continued, as before. The ledger compares "read in all" and the first check's result. Firewalls is the one: it is mid-sized, so neither the smallest (DHCP) nor the oddest (Subnetting) skews the comparison. Every analyst is told to search a saved source for the passage it needs, not read it whole, and to run several commands in one request.
4. **Each lesson keeps its shape:** its steps and their order, its events, its tables and panels, its scene, its figure and its three questions, since the end-to-end specs, the driver tests and saved progress rest on them. Where a source would add, remove or reorder a step or an event, the author stops and the orchestrator decides and records it. Subnetting's `STATED` list stays and follows its words.
5. **Networking's DHCP agrees with the checked What is DHCP.** Its badge spans layers, as 2.28 ruled for the same protocol. Where both state one idea, DHCP uses the checked words and citations unless a source says more that this lesson needs. Its story may keep the Offer and the ACK broadcast (RFC 2131 allows it when the client sets the flag), but no sentence may say a server always broadcasts them. The analyst reads What is DHCP at the lines S9 §5a lists and its list of changes, not whole. What is DHCP itself changes only through a re-check; a fault found in it comes to the orchestrator as an item of its own.
6. **A pointer names only a lesson a reader can open today.** A pointer to a Networking lesson that is not written yet goes (or becomes plain words with no lesson named); a pointer to Subnetting, DHCP, Firewalls or OSI Model stays. The lesson's own test follows. Reason: "Lessons 10 and 11 cover ports and UDP" is false while those lessons do not exist, and accuracy outranks everything.
7. **Badges and message sizes by the settled rules.** Subnetting's `[3]` and Firewalls' `[3, 4]` stay only on two vendors' pages that place them, or a source the lesson cites; otherwise they span. DHCP's `342 B` stays only if a source states it; otherwise it becomes a dash, as What is DHCP's sizes are (its test's size assertion follows). Example data stays: the made-up addresses, MACs, transaction ids and the rule list.
8. **The tests that use `dhcp` as the sample of a legacy lesson are made independent of real lessons before the authors start** (unit R5): they get a stand-in slug, so no lesson branch touches them and the empty list breaks nothing. The legacy path itself (`defineLegacyLesson`, `legacy.ts`, the "Unchecked" stamp) stays in this job, with an empty list; removing it is a unit of its own after the job (below). After the last merge the orchestrator fixes the out-of-date comment in `legacy.ts` and the sentence in `content-model.md` §4.
9. **About keeps its box, and lists the cited DHCP lesson's sources as they come.** After the move its references come from its citations, in the registry's `"<short>: <title>"` form, which About's rows already read; the box grows from two rows to the lesson's whole list. The DHCP author updates `src/lib/about.test.ts` to the new rows. The orchestrator looks at About at 375px and 1440px after the merge into `batch/5`; if the longer list reads badly, a design unit for the box comes to the owner, and the job does not wait for it.
10. **Who changes which file.** An author: its lesson's file and its own helper; its lesson's test file; its slug off `legacy.ts` and `legacy.test.ts` line 9; its lesson's rows in `src/lib/track.test.ts` and `src/lib/about.test.ts` (DHCP); the expected words of its lesson in the driver, panel and announce tests (`src/scenes/drivers/<figure>.test.ts`, `src/scenes/SequenceView.test.tsx`, `src/lesson/panels/*.test.tsx`, `src/lesson/announce.test.ts`); the registry only for a document the analyst missed. Never `e2e/`, `src/art/`, Home, another lesson or a checked lesson's test. If an end-to-end spec holds a word that must change, the author stops and the orchestrator changes the spec. An author runs no formatter.
11. **One report of the three lessons' changed sentences** (direction 2.29): each author writes its section to `.superpowers/track-report/<slug>.md` after its lesson passes; the orchestrator joins them with `scripts/team/track_report.py e8ea005 <new-ref> dhcp subnetting firewalls`, checks every quoted before and after by script, commits it to `docs/lesson-changes/` and sends it to the owner.
12. **The ledger is short** (handbook §6a): one row a unit, written when it ends: who, model, tries, the two token figures ("growth" and "read in all" from `scripts/team/tokens.py`), the result in a line. At the end, the totals by role, the trial's comparison, and "What to do differently next time".
13. **When a claim will not pass:** after two failed checks on the same claim it goes to the analyst; after a third it comes to the owner. A fix the checker's note names (a trace, a few words) goes straight to the author.

## Units

L15 DHCP, L16 Subnetting, L17 Firewalls.

| Unit | Owner | What | Check |
|---|---|---|---|
| S9 | scout (Haiku) | What rests on the three lessons, what they share with checked lessons, where branches collide. Done. | Every fact has a `path:line`. |
| L15-a to L17-a | analyst, one a lesson, three together | Every idea the lesson teaches, with source, section, quoted passage and verdict (`docs/briefs/analyst-report.md`), plus: DHCP's four differences from What is DHCP (decision 5); every pointer (decision 6); the badge and the sizes (decision 7); for each helper-built event, the Learn part it traces to. | The report is in `.superpowers/analysis/<slug>/report.md` with its sources beside it; every passage found by script. |
| R5 | orchestrator | Rulings, written into each report and recorded in `docs/direction.md`; `batch/5` in its own worktree from `revamp`; the batch's documents registered in one commit with `sources.test.ts`; the three legacy-sample tests given a stand-in slug (decision 8); three lesson worktrees with `node_modules` linked. | `npm test` passes on `batch/5`. |
| L15-b to L17-b | author (Sonnet), in its worktree | The lesson in the cited shape (`docs/briefs/author-lesson.md`), within decisions 4 to 10, with the unit's full name and purpose stated in a Learn part. | The claim sheet prints; `npx astro check` clean; `npx vitest run --mode development` fails only `src/lib/checked.test.ts`. |
| L15-p, L16-p | the lesson's analyst, continued | The read before the check (`docs/briefs/analyst-read-before-check.md`); the author applies the rulings. | Rulings with exact words and citations, applied. |
| L17-p | a fresh analyst (the trial) | The same read for Firewalls, from the report, its rulings and the saved sources. | The same. |
| L15-c to L17-c | a fresh fact-checker each run | The fact-check; after a near-pass, targeted re-checks. A failing report is committed as written before its fix. | `npm run fact-check -- <slug> --check` (or `--recheck --check`) prints `Report OK`. |
| L15-d to L17-d | author, continued | Its section of the report of changed sentences (`docs/briefs/author-track-section.md`). | Its counts match its rows. |
| M5 | orchestrator | Merge each passed lesson into `batch/5`, printing each conflict before resolving it; then the `legacy.ts` comment and `content-model.md` §4; look at About (decision 9). | `npm test` after each merge; the legacy list is `[]`. |
| F5 | orchestrator | One merge of `batch/5` into `revamp`; `npm test`, `npm run build`, the full `npm run e2e` in the background, lid open. The ledger and the direction doc's Phase 4 status. | The three outputs are in `team.md`. |
| T2 | orchestrator | The one report of the three lessons' changed sentences, checked by script, committed and sent to the owner. | Every quoted before and after is found in the two versions of its lesson's file. |

## Estimate

| Role | Model | Units | Tokens (growth), roughly |
|---|---|---|---|
| scout | Haiku | S9 | 350,290 (spent; 17.3 million read in all) |
| analyst | Opus | three reports with rulings, three reads before the check | 1,250,000 to 1,650,000 |
| author | Sonnet | three lessons, the rulings, three sections | 750,000 to 950,000 |
| fact-checker | Opus | one full check a lesson, a re-check for two | 650,000 to 950,000 |

That is 2.7 to 3.6 million for the three lessons: DHCP about 0.75 to 1.0 million (small, and much of it settled by What is DHCP), Subnetting 1.1 to 1.5 million (the most words, 17 events and the `STATED` list), Firewalls 0.8 to 1.1 million. Job 7's lessons cost 7,400 to 9,400 tokens an item on the claim sheet; these should have about 95 to 170 items.

## When the work stops for the owner

- One lesson passes 1.6 million subagent tokens without an all-pass, or the batch passes 4.0 million after the go.
- A claim fails three checks.
- No allowed source backs a Watch step's story.
- Anything the owner keeps comes up (`CLAUDE.md`, Ownership), including a design for About's box if decision 9 calls for one.

Everything else the orchestrator decides, records in the direction doc and reports with the job's result. If the owner's usage limit is reached, the agents stop where they are and go on from their transcripts when it resets.

## What could go wrong

- **Subnetting's numbers.** Its words carry arithmetic (masks, counts of hosts, /26 and /30 ranges) that the `STATED` list ties to the engine. A source states the method, not this lesson's example; the analyst marks worked examples as example data where the method is cited, and the author keeps `STATED` in step with every changed number.
- **Firewalls rests on vendor practice** ("most firewalls stop at the first rule that matches", default deny, stateful tables, Windows Defender Firewall, iptables chains). Each needs NIST SP 800-41 or two publishers (2.28); what only one states is reworded or cut. NIST SP 800-41 Rev. 1 is from 2009: the analyst confirms it is the current final version.
- **RFC 950 is from 1985 and speaks of classes.** It is still in force (updated by RFC 6918, not obsoleted); where it and RFC 4632 differ, the lesson teaches what RFC 4632 says.
- **Helper-built events need a backing,** and the helpers are shared code within each lesson. If the cited shape needs a change outside the lesson's own files to carry a backing, the author stops and the orchestrator decides.
- **Many tests hold these lessons' words.** Decision 10 says who changes which; a test outside those files that fails stops the author.
- **The fresh analyst for Firewalls reads in more than a continued one would.** That is what the trial measures; if its read misses what the check then fails on, the ledger says so.
- **A merge's reconciliation goes wrong.** Each conflict is printed before it is resolved, and `npm test` after each merge holds the exact lists.
- **One lesson stalls.** The other two merge into `batch/5` and wait; the batch finishes without a lesson only on the owner's word.

## After this job

- **Remove the legacy path:** with the list empty, `defineLegacyLesson`, `src/content/legacy.ts`, the "Unchecked" stamp and the tests on them are dead code. A unit of its own, planned in the next job.
- Phase 5, the Practice page (direction §3).

## Not in this plan

- A change to a checked lesson; what a source shows wrong in one comes to the orchestrator as an item of its own.
- Writing any of Networking's fifteen unwritten lessons.
- The spot drawings' comments that number the lessons 8, 10 and 17 (`src/art/figures/spots.ts`); a reader never sees them.
- Anything that leaves this machine.
