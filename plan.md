# Plan

How the work is divided is in `CLAUDE.md` (Team). The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3.

**Status: the owner said go on 2026-11-11** ("Go"), which approves the nine decisions below. A fresh session carries it out; the results go in `team.md` under "Job 5". Nothing has started except the scout and the change to the fact-checker's instructions (decision 4). Nothing is pushed.

## Inputs

| | |
|---|---|
| **The job** | Phase 4, lessons 3 to 5 of 17: **What is HTTPS, What is TCP and What is DNS** moved to the cited shape and through a fresh fact-check, **side by side** (the owner, 2026-11-11: "Yes, plan it", on `team.md`'s proposal for the other 15). It is the first batch of five, the first job with three lessons at once, and the first under the two rules the owner changed that day (direction 2.24): a check passes what is true for a beginner, and the author sweeps for missing traces before the first check. |
| **Done means** | Each of the three is cited, has a passing fact-check with a confirmed quote record, and shows "Checked" with a date. `docs/lesson-changes/<slug>.md` lists every changed sentence of each. Home's tests assert What is HTTPS's checked words. `npm test`, `npm run build` and `npm run e2e` pass on `revamp`, with their output in `team.md`. `team.md` has each lesson's cost against the estimate, each lesson's count of corrections against What is HTTP's 41, what the checkers passed as a simplification, and what to change for batch 2. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate is 0.85 to 1.0 million subagent tokens a lesson, so 2.6 to 3.0 million for the three, and about 0.2 million for Home (table below). **Stop for the owner** if one lesson passes 1.5 million without an all-pass, or the batch passes 3.6 million. |
| **Design refs** | For the lessons: `docs/content-model.md` (§8 is the workflow, with "What a check passes"), `src/content/lessons/what-is-http.ts` and `what-is-udp.ts` (the two checked tour lessons), `docs/lesson-changes/what-is-http.md`, `docs/direction.md` decisions 2.23 and 2.24. For Home: `prototypes/d5-home-sources.md` and `prototypes/d5-cases.md`, as built. No screen changes its layout in this job, so it has no design unit. |

## What the scout found (S5; `prototypes/s5-batch-1-facts.md` has every `path:line`)

- **Sizes.** What is HTTPS: 6 Watch steps, 20 events, 7 Go deeper paragraphs, 2 questions. What is TCP: 6 steps, 19 events, 7 paragraphs, 2 questions. What is DNS: 5 steps, 11 events, 6 paragraphs, 2 questions. Each has 8 terms and 5 Learn facts. What is HTTP had 5 steps and 14 events, so the first two are a little larger.
- **Their documents.** RFC 9110, RFC 9293, RFC 1034 and RFC 1035 are registered. What is HTTPS names RFC 2818, which RFC 9110 made obsolete, and RFC 8446 (TLS 1.3), which is not registered.
- **Home reads What is HTTPS**: its title, lead, address and number, in the "And HTTPS?" box. `e2e/site.spec.ts` and `src/lib/home.test.ts` quote that lead, and `home.test.ts` uses What is HTTPS as its uncited lesson and What is HTTPS and What is TCP for the step their page appears at. No Home code reads What is DNS.
- **Progress counts on their shape**: 9, 9 and 8 positions, with tests on them.
- **Three branches collide in five files.** `src/content/legacy.ts` (two of the three slugs are on touching lines), `src/content/legacy.test.ts`, the end of `src/content/sources.ts` and of the list in `sources.test.ts`, and five places in `src/content/tracks/how-the-internet-works.test.ts` where two lessons' rows touch.
- **A cited lesson still on the legacy list** builds, and fails when the registry loads, with the reason. So each branch takes its own slug off the list.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **Three lessons side by side.** The three analysts run together and change no file. The orchestrator registers the three lessons' documents in one commit, then each author works in its own worktree on its own branch. Each lesson goes at its own pace from there: a slow one does not hold the others.
2. **The order within a lesson is `CLAUDE.md`'s, with one read added.** Analyst, author, then the same analyst reads the claim sheet once as the checker will (the traced items included) and rules on the author's doubts, the author applies it, and only then a full check. On What is HTTP that read came after the first check failed and found everything the second check then passed.
3. **Each lesson keeps its shape:** its Watch steps, their order, its scene and its two questions, since progress positions rest on them. A ruling made for What is HTTP holds for the same idea here (direction 2.23): the page is drawn when the stylesheet arrives; "plain text" is HTTP/1.1; the reader types the scheme. Where a source would add, remove or reorder a step, the author stops and the orchestrator decides.
4. **The fact-checker is told which folder to work in.** Its prompt was "the slug and nothing else". A lesson in a worktree needs its folder named, so the prompt is now the slug and that folder, and still nothing about the lesson. `.claude/agents/fact-checker.md` and `docs/content-model.md` §8 say so, changed with this plan so the session that carries it out loads them; no judgment rule changed. If the owner says no, that change is taken back and the checks run one at a time in the main folder.
5. **An idea two lessons share is said once.** The analysts are given the two checked tour lessons, and where What is HTTP or What is UDP already states an idea (the handshake, a lookup, port 443, HTTP over TLS), the new lesson uses its checked words and citations unless the source says more that this lesson needs.
6. **A branch for the batch.** Passed lessons merge into `batch/1`, where the five colliding files are reconciled (both sides are kept; each has one right answer) and `npm test` runs after each merge. Home's unit is built there. `revamp` moves once, at the end, so it is never between states.
7. **Who changes which test.** An author: its lesson's file, its slug off the legacy list and that list's test, the registry only for a document the analyst missed, and its lesson's rows in the track's test. A builder (H2): Home's tests and anything in `e2e/`.
8. **The first batch tests the looser rule.** For each lesson the orchestrator counts corrections against What is HTTP's 41 and reads every note the checker left on a claim it passed as a simplification. A note that names something a beginner would be misled by comes to the owner before batch 2, with the wording that let it through.
9. **When a claim will not pass:** after two failed checks on the same claim it goes to the analyst; after a third it comes to the owner.

## Units

| Unit | Owner | What | Check |
|---|---|---|---|
| S5 | scout | What rests on the three lessons and where three branches collide. Done: 250,966 tokens. | Every fact has a `path:line`. |
| L3-a, L4-a, L5-a | analyst, one each, together | **Every idea the lesson teaches** (L3 What is HTTPS, L4 What is TCP, L5 What is DNS): the source and section that backs it, and one of four verdicts: stated; true for a beginner as written, so it stays; false or misleading, with the smallest change; no source. It names every document with a proposed registry entry, and says whether a source forces a change to a step or the scene. | Every idea in Learn, Watch and Practice has a row. |
| R1 | orchestrator | Make `batch/1` from `revamp`; register the three lessons' documents on it in one commit (with `sources.test.ts`); make the three worktrees from it (`.superpowers/wt/<slug>`, branch `lesson/<slug>`, `node_modules` linked). | `npm test` passes on `batch/1`. |
| L3-b, L4-b, L5-b | author, one each, in its worktree | **The lesson in the cited shape**, within decisions 3, 5 and 7, with the six-fault sweep. | The claim sheet prints; `npx astro check` has no error; the report lists every changed sentence. |
| L3-p, L4-p, L5-p | the lesson's analyst, continued; then its author | **The read before the check** (decision 2): the sheet judged as the checker will, and the author's doubts ruled on, each with exact words and citations; the author applies them. | The rulings are applied as written; the sheet prints. |
| L3-c, L4-c, L5-c | fact-checker, a fresh one each run, in the lesson's worktree; author for fixes | **The fact-check.** A full check; after a near-pass, targeted re-checks. A failing report is committed as written before its fix. | `npm run fact-check -- <slug> --check` (or `--recheck --check`) says OK, with the quote record confirmed. |
| L3-d, L4-d, L5-d | author | `docs/lesson-changes/<slug>.md`, against the lesson on `revamp`. | Its counts match its rows. |
| M1 | orchestrator | Merge each passed lesson into `batch/1`, reconcile the five files, remove its worktree. | `npm test` after each merge; the only failures allowed are Home's tests that H2 changes. |
| H2 | reviewer (spec review), builder, reviewer (build review), on `batch/1` | **Home's tests follow What is HTTPS** (and What is TCP where they use it): the lead quoted in the "And HTTPS?" box, the lesson used as the uncited one, the steps the pages appear at. Home's code changes only if a test shows it must. The orchestrator writes its spec here once What is HTTPS and What is TCP have passed. | The spec review's cases each have a test seen failing; `npm test`, `npm run build`, `e2e/site.spec.ts` in the projects that run it. |
| Final | orchestrator | Merge `batch/1` into `revamp` once, then `npm test`, `npm run build` and the full `npm run e2e`, lid open. Then the ledger, and the three lists of changed sentences shown to the owner before batch 2 is planned. | The three outputs are in `team.md`. |

The three analysts start together. R1 follows them. From there each lesson runs on its own; H2 waits for What is HTTPS and What is TCP; Final waits for all three and H2.

## Estimate

| Role | Model | Units | Tokens, roughly |
|---|---|---|---|
| scout | Haiku | S5 | 250,966 (spent) |
| analyst | Opus | three reports, three reads before the check | 800,000 to 950,000 |
| author | Sonnet | three lessons, fixes, three lists | 1,000,000 to 1,150,000 |
| fact-checker | Opus | per lesson: one full check and one re-check | 800,000 to 900,000 |
| reviewer | Opus | H2: spec review and build review | 100,000 to 130,000 |
| builder | Sonnet | H2 | 60,000 to 90,000 |

The lessons' rows come to 2.6 to 3.0 million: What is HTTP's 1.12 million, less the second full check and the second analyst round that the missing traces cost it, a little more for the two larger lessons. If a first check is not a near-pass, that lesson costs about 200,000 more.

## The other four batches

Each is a job of its own, planned after the one before it: the three mail lessons share their documents, and the last three are the Networking track's own.

| Batch | Lessons |
|---|---|
| 2 | What is IP, What is DHCP, What is ICMP |
| 3 | What is SMTP, What is POP3, What is IMAP |
| 4 | What is FTP, What is SSH, What is TLS |
| 5 | DHCP, Subnetting, Firewalls |

## What could go wrong

- **The looser rule passes something it should not.** The canary shows it still catches planted faults, not that it draws the line well on a real simplification. Decision 8 is for that, and the owner reads the changed sentences before batch 2.
- **The looser rule changes little.** Then the corrections stay near 41 a lesson and the saving is the traces alone.
- **Three sets of agents at once use the allowance three times as fast.** The owner's usage limit was reached once during What is HTTP. If it is reached here, the agents stop where they are and the session carries on when it resets; nothing is lost, but the batch takes longer.
- **What is HTTPS teaches TLS before What is TLS is moved** (batch 4). What it says about the handshake is checked now, and What is TLS will have to agree with it.
- **A merge's reconciliation goes wrong.** `npm test` after each merge holds the exact lists, and each lesson's report fails the build if its lesson changed.
- **One lesson stalls.** The other two merge into `batch/1` and wait; if it stops for the owner, the batch can finish without it only on the owner's word.

## Not in this plan

- The other twelve lessons.
- Anything on Home but its tests, unless a test shows the code must change.
- Restoring What is HTTP's original sentences under the looser rule.
- Anything that leaves this machine.
