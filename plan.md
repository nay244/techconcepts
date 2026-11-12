# Plan

How the work is divided is in `CLAUDE.md` (Team). The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519.

**Status: the owner said go on 2026-11-11.** D5 and L2-a started together that day; the results are in `team.md` under "Job 4". Nothing is pushed.

## Inputs

| | |
|---|---|
| **The job** | Phase 4, lesson 2 of 17: **What is HTTP** moved to the cited shape and through a fresh fact-check, alone (the owner, 2026-11-11: "HTTP first"). It is the first lesson under the order the pilot taught (analyst, author, fact-checker, targeted re-checks) and the first job with a spec review and a three-level build review. It stops there, with the lesson's measured cost, for the owner to decide how the other 15 run. |
| **Done means** | What is HTTP is cited, has a passing fact-check (a full report, or a full report and a re-check) with a confirmed quote record, and shows "Checked" with a date. Home's demo shows the lesson's checked words and matches its approved design (D5). Every changed sentence is in `docs/lesson-changes/what-is-http.md`. `npm test`, `npm run build` and `npm run e2e` pass on `revamp`, with their output in `team.md`. `team.md` has what the lesson cost against the estimate below, what the two new review rules saved or cost, and a proposal for the other 15. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate is 1.3 to 1.5 million subagent tokens for the lesson and about 0.6 million for Home, which only this lesson needs (table below). **Stop for the owner** if the lesson passes 2.0 million without an all-pass, which is what What is UDP cost. |
| **Design refs** | For the lesson: `docs/content-model.md` (§8 is the workflow), `src/content/lessons/what-is-udp.ts` (the worked example), `docs/lesson-changes/what-is-udp.md`. For Home: the Home page as built (`src/pages/index.astro`, the demo's Learn panel), `docs/direction.md` §6 (the look, "Patch") and the stamp and numbered sources of the Lesson page (`prototypes/d1-lesson-reading.*`). |

## What the scout found (S4)

- **The lesson's size.** 5 Watch steps, 31 facts, 14 events, 10 terms, 6 Go deeper paragraphs, 2 questions of 3 options. It names two documents, RFC 9110 and RFC 9112; neither is registered. RFC 9114 (HTTP/3) is.
- **Home shows this lesson.** Home's demo plays all 5 steps and shows the lead, the first 6 terms, every source and the first question. It reads them from the lesson, so the lesson's new words reach Home with no code change.
- **Home lists every source in one line.** The lesson has 2 today. What is UDP went from 1 to 31 when it was cited. A line of twenty links is a change to a screen, so it is designed and approved first (D5).
- **Tests quote the lesson.** `src/lib/home.test.ts` and `e2e/site.spec.ts` assert Home's words: the lead's first sentence, three terms, the two source labels, the first question and its feedback, the step titles. `src/content/tracks/how-the-internet-works.test.ts` restates the lesson's titles, scene, table and references. `src/content/legacy.test.ts` and `src/content/sources.test.ts` hold exact lists.
- **Progress counts on its shape.** `src/progress/internet-split.ts` gives the lesson 8 positions, and tests and one end-to-end check ("3 of 14", position 30) rest on that.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **The order is `CLAUDE.md`'s:** analyst, author, a full check, targeted re-checks after a near-pass, the list of changed sentences. No rehearsal.
2. **The Watch tab keeps its shape:** five steps, their order and the scene. A step's words change where a source contradicts them or does not state them. If a source would add, remove or reorder a step, the author stops and the orchestrator decides, since progress positions and Home's demo rest on the shape.
3. **Home's source list is designed before the lesson merges** (D5), with What is UDP's 31 sources as the worst case. The lesson's work does not wait for it: D5 changes only `prototypes/`, in its own worktree, while the lesson runs. Only the Home build unit (H1) waits at the design gate.
4. **Who changes which test.** The author changes what restates the lesson: its file, the legacy list and the source registry with their two tests, and the track's test. A builder changes Home's tests (H1), once the fact-check has passed and the words are final.
5. **The lesson and Home merge together.** H1 is built on the lesson's branch after its pass, and `revamp` moves once, so Home is never live with an undesigned source list.
6. **The lesson's known documents are registered before the author starts:** RFC 9110, RFC 9112 and every document the analyst's report names, in one commit.
7. **When a claim will not pass:** after two failed checks on the same claim it goes to the analyst; after a third it comes to the owner.

## Units

| Unit | Owner | What | Check |
|---|---|---|---|
| S4 | scout | What else in the repo rests on this lesson's words and shape. Done: 127,655 tokens. | Every fact has a `path:line`. |
| D5 | designer | **Home's demo with a long source list.** How the demo's Learn panel shows a lesson's sources when there are 2, about 12 and 31, at 375px and 1440px in both themes, with JavaScript off. It says nothing untrue about the list (a shortened list says it is shortened and leads to the whole one). Two variants at most. | A prototype and spec in `prototypes/d5-home-sources.*` with acceptance checks; screenshots at both sizes in both themes. **Then the design gate: the owner approves before H1.** |
| L2-a | analyst | **Every idea What is HTTP teaches**, with the source and section that states it or "no source", and what is wrong in the original. It also answers: what the lesson may say about plain text now that HTTP/2 and HTTP/3 are binary. | Every idea in the lesson's Learn, Watch and Practice has a row. |
| L2-b | orchestrator, then author | Register the documents (decision 6), then **the lesson in the cited shape** on `lesson/what-is-http`, within decision 2, with the five-fault sweep. | The claim sheet prints (`npm run fact-check -- what-is-http`); the author's report lists every changed sentence. |
| L2-c | fact-checker, a fresh one each run; author for fixes | **The fact-check.** A full check; after a near-pass, targeted re-checks. A failing report is committed as written before its fix. | `npm run fact-check -- what-is-http --check` (or `--recheck --check`) says OK, with the quote record confirmed. |
| L2-d | author | `docs/lesson-changes/what-is-http.md`: every reader-visible change against the original. | Its counts match the diff of the lesson's words. |
| H1 | reviewer (spec review), builder, reviewer (build review) | **Home follows the cited lesson.** D5 as approved, in `src/pages/index.astro` and `src/lib/home.ts`; Home's unit and end-to-end tests assert the lesson's checked words. Starts after D5 is approved and L2-c has passed. | The spec review's attack cases each have a test seen failing; `npm test`, `npm run build`, `e2e/site.spec.ts` in the projects that run it; Home at 375px and 1440px in both themes beside the prototype. |
| Final | orchestrator | Merge into `revamp`, then `npm test`, `npm run build` and the full `npm run e2e` once, lid open. Then the ledger: the lesson's cost against the estimate, the review rules' effect, and a proposal for the other 15. | The three outputs are in `team.md`. |

D5 and L2-a start together. L2-b follows L2-a. H1 follows D5's approval and L2-c's pass, whichever is later.

## H1's spec (written 2026-11-11, after the lesson's pass; it waits for the owner's approval of D5)

H1 makes Home follow the checked lesson. It is built on `lesson/what-is-http`, after `design/d5-home-sources` is merged into it so the prototype and its spec are on the branch.

1. **The source block is D5**, in the variant the owner approves: `prototypes/d5-home-sources.md` is its spec, word for word, with its 16 acceptance checks. Written here for variant A. With the checked lesson the block reads "Checked 11 Nov 2026, 20 sources", lists sources 1 to 3 and folds 17.
2. **The page on the laptop follows the lesson's cues.** Home showed the page's words from step 4 and its pictures from step 5, by position ("the last step but one"). The lesson now draws the words when the stylesheet arrives, in step 5 (direction 2.23). `homeDemo` works out, from the lesson's own events, the number of the step whose events carry the `page: 'text'` cue and the one that carries `page: 'full'`, returns them (`page: { words, pictures }`), and throws by name when the lesson has neither; `src/pages/index.astro` lights `#nm-page`'s words and pictures from those numbers, through Learn and Practice as today, and its comment says so. With this lesson both are step 5, and at step 4 the laptop's page is still empty.
3. **Home's tests assert the lesson's checked words.** `src/lib/home.test.ts` and `e2e/site.spec.ts`, wherever they quote the lesson: "Hypertext Transfer Protocol"; step 1's "You type http://example.net and press Enter"; the lead "In HTTP/1.1, getting a web page is a conversation in plain text."; the sources (D5's checks replace the old two-label line); the page's words absent at step 4 and present at step 5. A test that quotes the lesson quotes it literally, as these do today.
4. **Nothing else changes.** No lesson content (a change to `src/content/` would make the fact-check report stale), nothing on Home outside the demo's source block and the page cue, no script added, the budgets hold.

**Check.** Each attack case of the spec review (`prototypes/d5-cases.md`) has a test seen failing against a broken build; `npm test`; `npm run build`; `e2e/site.spec.ts` in the projects that run it; Home at 375px and 1440px in both themes beside the prototype.

## Estimate

| Role | Model | Units | Tokens, roughly |
|---|---|---|---|
| scout | Haiku | S4 | 127,655 (spent) |
| analyst | Opus | L2-a | 150,000 to 200,000 |
| author | Sonnet | L2-b, fixes, L2-d | 350,000 to 450,000 |
| fact-checker | Opus | L2-c: three full checks and two re-checks | 800,000 to 850,000 |
| designer | Fable | D5 | 200,000 to 300,000 |
| reviewer | Opus | H1: spec review and build review | 200,000 |
| builder | Sonnet | H1 | 150,000 to 200,000 |

The lesson's own rows come to 1.3 to 1.5 million, the figure the pilot predicted. Home's rows, about 0.6 million, are this lesson's alone: no other lesson is shown on Home in full.

## What could go wrong

- **A sentence Home leads with does not survive.** "A web page is a conversation in plain text" is the lesson's first line and Home's. If no source states it, it changes or is marked as an analogy, and Home changes with it. The changed-sentences list shows the owner both.
- **The source list is short after all.** Then D5 still settles what Home does for the later lessons' leads, at a designer's cost that the lesson did not strictly need. Accepted: Home changes for a reader the moment the list grows, and the gate is the owner's.
- **The fact-checker's verdicts wander between runs**, as on What is UDP. The stop at 2.0 million tokens is for that.
- **D5 is approved late.** The lesson waits on its branch, passed and unmerged. Nothing else is blocked.

## Not in this plan

- The other 15 lessons: the next plan, after this lesson's numbers.
- What is HTTPS, whose lead Home also shows. Its line on Home changes when it is cited.
- Home beyond the demo's source list.
- Anything that leaves this machine.
