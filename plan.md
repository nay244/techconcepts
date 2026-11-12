# Plan

How the work is divided is in `CLAUDE.md` (Team). The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b.

**Status: the owner said go on 2026-11-12** ("Start batch 2", said again on the plan as shown), which approves the twelve decisions below. By the owner's word that day ("For this batch start it here"), the session that ran batch 1 carries it out, since the app could not start a new one while the owner was on Remote Control; batch 3 gets a fresh session. The results go in `team.md` under "Job 6". Nothing is pushed.

## Inputs

| | |
|---|---|
| **The job** | Phase 4, lessons 6 to 8 of 17: **What is IP, What is DHCP and What is ICMP** moved to the cited shape and through a fresh fact-check, side by side. It is the second batch of five and runs as the first did (direction 2.25), with what the first taught (`team.md`, job 5, "What to do differently next time"). |
| **Done means** | Each of the three is cited, has a passing fact-check with a confirmed quote record, and shows "Checked" with a date. `docs/lesson-changes/<slug>.md` lists every changed sentence of each. `npm test`, `npm run build` and `npm run e2e` pass on `revamp`, with their output in `team.md`. `team.md` has each lesson's cost against the estimate, each lesson's count of corrections, what the checkers passed as a simplification, and what to change for batch 3. The three lists are shown to the owner. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate is 0.75 to 1.25 million subagent tokens a lesson, 2.5 to 3.0 million for the three (table below). **Stop for the owner** if one lesson passes 1.5 million without an all-pass, or the batch passes 3.6 million after the go. |
| **Design refs** | `docs/content-model.md` (§8 is the workflow, with "What a check passes"); the five checked tour lessons, `what-is-http.ts`, `what-is-https.ts`, `what-is-tcp.ts`, `what-is-udp.ts` and `what-is-dns.ts`; `docs/lesson-changes/what-is-tcp.md` for the form of a list; `docs/direction.md` decisions 2.23, 2.24 and 2.26. No screen changes its layout in this job, so it has no design unit. |

## What the scout found (S6; `prototypes/s6-batch-2-facts.md` has every `path:line`)

- **Sizes.** What is IP: 5 Watch steps, 12 events (7 messages, 5 table rows), 9 terms, 2 questions. What is DHCP: 6 steps, 18 events (6 messages, 12 table rows), 8 terms, 2 questions. What is ICMP: 6 steps, 21 events (14 messages, 7 table rows), 8 terms, 2 questions. Each has 5 Learn facts.
- **Their documents.** RFC 791 and RFC 2131 are registered. RFC 792 (ICMP) is not, and neither is RFC 8200 (IPv6), which What is IP names in "Defined in" and which a test asks a cited What is IP to list.
- **Nothing on Home rests on the three.** Home reads only What is HTTP and What is HTTPS. Its count of checked lessons, and About's, rises with each move; no test holds a number. So this job has no unit for Home.
- **End to end, two checks name them** and neither rests on words: What is IP shows "Not started" in the old-position test, and a table check opens What is ICMP for its probe that got no answer. Every other spec loops over the ready lessons.
- **None of the three has a page cue**, so direction 2.26's question does not come up. None uses `techconcepts.app`: What is IP and What is ICMP use `example.net`, and every address is a documentation or private one.
- **The two DHCP lessons share the unit id `dhcp`** (this track's What is DHCP and Networking's DHCP, which moves in batch 5), and nothing keys on it: the registry, the fact-check gate, progress and the legacy list all go by slug. One line confuses them by string: the legacy list's test maps `'dhcp'` to `what-is-dhcp` and also holds Networking's `'dhcp'`.
- **Tests hold three sentences across lessons:** What is DHCP's hook ends "Networking Concepts has a DHCP lesson that goes further."; What is IP says "the Subnetting lesson goes further"; and What is IP's parties include the provider's router that What is ICMP finds at hop 2.
- **Three branches collide in the same five files** as batch 1: the three slugs are on consecutive lines of `src/content/legacy.ts`; all three edit the same two lines of `legacy.test.ts`; What is IP's and What is ICMP's documents meet at the end of `sources.ts` and of the list in `sources.test.ts`; and their rows touch in `src/content/tracks/how-the-internet-works.test.ts`.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **The same order as batch 1.** Three analysts together; the orchestrator registers the three lessons' documents in one commit on `batch/2`; one author per lesson in its own worktree; the lesson's analyst reads the claim sheet as the checker will and rules on the author's doubts; a fresh fact-checker, told the slug and the folder and nothing else; the author's list of changed sentences; merge into `batch/2`; `revamp` moves once.
2. **The read before the check names two tests, not one.** Batch 1 named the checker's test for a traced item, and no check failed on a trace. What is HTTPS failed on a sentence whose one cited passage stated part of it. So the brief also names the test for a claim: every part of it, each item of a list included, is in a quoted passage of a document that defines it, or of two publishers.
3. **Each lesson keeps its shape:** its Watch steps, their order, its events, its scene and its two questions, since progress positions and tests rest on them. Rulings already made hold for the same idea here (direction 2.23, 2.26). Where a source would add, remove or reorder a step or an event, or change a mark on the figure, the author stops and the orchestrator decides and records it.
4. **An idea two lessons share is said once.** The analysts are given the five checked tour lessons. Where one already states an idea (what an IP address is, a port, a lookup, that DHCP's first message is a broadcast, a home router's translation of addresses), the new lesson uses its checked words and citations unless a source says more that this lesson needs.
5. **What is DHCP is written so Networking's DHCP can agree with it.** Its analyst notes what a beginner is told here that the Networking lesson (batch 5) will have to match, as What is HTTPS's did for What is TLS. The hook's last sentence, which a test holds, stays.
6. **No unit for Home, and no builder.** Nothing on Home or in a named end-to-end check rests on these lessons' words. If a merge shows a test outside an author's files must change, the orchestrator writes a spec for it then, with a spec review, as batch 1's H2 had.
7. **Who changes which test.** An author: its lesson's file, its slug off the legacy list and that list's test, its lesson's rows in the track's test (for What is IP, the `uncited` entry for RFC 8200), and the registry only for a document the analyst missed. Never Home's files, `e2e/`, `src/art/` or another lesson's rows.
8. **An author is told two things batch 1 did not say:** to run no formatter on its lesson's file, and which passages it must read itself: the sections it cites on its own, beyond the analyst's report, whose quotes are found by script.
9. **The author still applies the rulings and writes the list.** `team.md` suggested a lower model for both. A continued author spends 9,000 to 17,000 tokens applying rulings and 21,000 to 29,000 on a list; a fresh agent would spend more than that reading its way in.
10. **Tokens are counted from each agent's transcript** where its context was summarised, since the reported figure falls then (job 5).
11. **The looser rule is watched as in batch 1.** For each lesson the orchestrator counts corrections and reads every note the checker left on a claim it passed as a simplification. A note that names something a beginner would be misled by comes to the owner with the lists.
12. **When a claim will not pass:** after two failed checks on the same claim it goes to the analyst; after a third it comes to the owner. Four items failing on one idea is not a near-pass (the rule counts items), so it costs a full check, as it did for What is HTTPS.

## Units

| Unit | Owner | What | Check |
|---|---|---|---|
| S6 | scout | What rests on the three lessons, the two DHCP lessons, and where three branches collide. Done: 251,670 tokens. | Every fact has a `path:line`. |
| L6-a, L7-a, L8-a | analyst, one each, together | **Every idea the lesson teaches** (L6 What is IP, L7 What is DHCP, L8 What is ICMP), in Learn, Watch and Practice: the source and deepest section that backs it, the quoted passage, and one of four verdicts: stated; true for a beginner as written, so it stays word for word; false or misleading, with the smallest change; no source. It names every document with a proposed registry entry and any new host, lists what the Watch tab shows and the Learn part that states it, and says whether a source forces a change to a step, an event or a mark. | Every idea has a row; every quoted passage is found by script in the saved source. |
| R2 | orchestrator | Rule on what the analysts leave open and record it in `docs/direction.md`; make `batch/2` from `revamp`; register the three lessons' documents on it in one commit (with `sources.test.ts`); make the three worktrees from it (`.superpowers/wt/<slug>`, branch `lesson/<slug>`, `node_modules` linked). | `npm test` passes on `batch/2`. |
| L6-b, L7-b, L8-b | author, one each, in its worktree | **The lesson in the cited shape**, within decisions 3, 4, 7 and 8, with the six-fault sweep. | The claim sheet prints; `npx astro check` has no error; the report lists every changed sentence and every doubt. |
| L6-p, L7-p, L8-p | the lesson's analyst, continued; then its author | **The read before the check** (decision 2): every item judged as the checker will, by both named tests, and the author's doubts ruled on, each with exact words and citations; the author applies them. | The rulings are applied as written; the sheet prints. |
| L6-c, L7-c, L8-c | fact-checker, a fresh one each run, in the lesson's worktree; analyst and author for fixes | **The fact-check.** A full check; after a near-pass, targeted re-checks. A failing report is committed as written before its fix. | `npm run fact-check -- <slug> --check` (or `--recheck --check`) says OK, with the quote record confirmed. |
| L6-d, L7-d, L8-d | author | `docs/lesson-changes/<slug>.md`, against the lesson on `revamp`, with the checker's notes on what it passed as a simplification. | Its counts match its rows; each quoted before and after is found in the two versions of the lesson's file. |
| M2 | orchestrator | Merge each passed lesson into `batch/2`, reconcile the five files so both sides are kept, remove its worktree. | `npm test` passes after each merge. |
| Final | orchestrator | Merge `batch/2` into `revamp` once, then `npm test`, `npm run build` and the full `npm run e2e`, lid open. Then the ledger, the direction doc's Phase 4 status, and the three lists shown to the owner before batch 3 is planned. | The three outputs are in `team.md`. |

The three analysts start together. R2 follows them. From there each lesson runs on its own; Final waits for all three.

## Estimate

| Role | Model | Units | Tokens, roughly |
|---|---|---|---|
| scout | Haiku | S6 | 251,670 (spent) |
| analyst | Opus | three reports with their rulings, three reads before the check | 1,100,000 to 1,400,000 |
| author | Sonnet | three lessons, the rulings, three lists | 750,000 to 850,000 |
| fact-checker | Opus | one full check a lesson, and one more for one of them | 550,000 to 800,000 |

The lessons' rows come to 2.5 to 3.0 million. Batch 1's three cost 2.92 million: 0.74, 0.91 and 1.27. What is ICMP has the most events (21) and What is DHCP the most table rows (12), so neither is the small one What is DNS was. The analyst's rows are planned at what batch 1 spent, not at what it had planned. There is no Home unit, which cost 0.25 million last time.

## The other three batches

Each is a job of its own, planned after the one before it.

| Batch | Lessons |
|---|---|
| 3 | What is SMTP, What is POP3, What is IMAP |
| 4 | What is FTP, What is SSH, What is TLS |
| 5 | DHCP, Subnetting, Firewalls |

## What could go wrong

- **A lesson's first check fails on one idea said in several places.** Decision 2 is for that. If it happens, that lesson costs about 280,000 more (an analyst's pass, the author's, a second full check).
- **What is IP teaches ARP and NAT, and no RFC is the last word on what home routers do.** Its analyst may need a vendor page or two, and may propose a new host; the orchestrator rules on each and records it, as in direction 2.26.
- **What is ICMP's traceroute is a tool, not a protocol.** What a standard defines is the Time Exceeded message; how traceroute uses it may rest on vendor pages. If no allowed source backs a step's story, it comes to the owner before the author starts.
- **What is DHCP says something Networking's DHCP lesson contradicts.** That lesson is still uncited; decision 5 leaves a note for batch 5, and nothing in it is changed now.
- **Three sets of agents at once use the allowance three times as fast.** If the owner's usage limit is reached, the agents stop where they are and the session carries on from the ledger and `git log` when it resets.
- **A merge's reconciliation goes wrong.** `npm test` after each merge holds the exact lists, and each lesson's report fails the build if its lesson changed.
- **One lesson stalls.** The other two merge into `batch/2` and wait; the batch finishes without it only on the owner's word.

## Not in this plan

- The other nine lessons.
- Anything on Home.
- Adding the first ACK's row to What is TCP's animation (the owner left it, 2026-11-11).
- What is POP3's sample in Home's tests, which goes stale when batch 3 moves that lesson.
- Anything that leaves this machine.
