# Plan

How the work is divided is in `CLAUDE.md` (Team). The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545.

**Status: waiting for the owner's go.** Only the scout has run.

## Inputs

| | |
|---|---|
| **The job** | The start of Phase 4 of the revamp (`docs/direction.md` §3): move the 17 unchecked lessons to the cited shape and get each through a fresh fact-check. This plan covers the groundwork and a **pilot of two lessons**, What is HTTP and What is UDP. It stops there, with the measured cost of a lesson, for the owner to decide how the other 15 run. |
| **Done means** | The three groundwork units are reviewed and merged. Both pilot lessons are cited, have a passing fact-check report with a confirmed quote record, and show "Checked" with a date; the build's gate passes with them. Home's demo still shows the HTTP lesson's words. `npm test`, `npm run build` and `npm run e2e` pass on `revamp`, with their output in `team.md`. `team.md` has what each lesson cost and a proposal for the other 15. Nothing is pushed. |
| **Budget** | Not set by the owner. The orchestrator's estimate for this plan is 2 to 3 million subagent tokens (table below). A lesson's real cost is what the pilot is for. |
| **Design refs** | No screen changes: a cited lesson already shows its numbered sources and its stamp. The references are `docs/content-model.md` (§8 is the workflow), `src/content/lessons/osi-model.ts` (the one cited lesson), and `.claude/agents/fact-checker.md`. |

## What the scout found (S3)

- **What a move is.** The lesson's file is rewritten with `defineLesson` and its slug leaves the closed legacy list, in one change. Every Learn statement, term, fact, Go deeper paragraph and Practice option then needs a citation, or an honest analogy flag; every Watch step, fact and event needs a trace to the Learn statement that carries its source. A claim rests on the standard that defines the thing, or on two documents from different publishers.
- **The size of one.** OSI Model has 127 checked items, 136 citations and 6 sources, and took six fact-checker runs: 29 items failed the first, 1 the second, then it passed, changed, failed once more and passed. The 17 are a little smaller: 5 or 6 Watch steps, 29 to 36 facts, 7 to 10 terms, 2 or 3 questions.
- **Sources.** The 17 lessons list 21 documents between them, 20 RFCs and one NIST guide, all on hosts already allowed. None is registered yet.
- **Three things in the way**, each a groundwork unit below: a cited lesson must carry an exam tag and the 14 How the Internet Works lessons have none; Home's demo shows only the first statement of the HTTP and HTTPS lessons' lead, and a cited lead is several statements; and a dozen tests name DHCP as "the unchecked lesson" or count 17 legacy lessons.
- **The build cannot be green in the middle.** The tests and the build refuse a cited lesson until its report passes, so a lesson's branch only builds at its end. `docs/content-model.md` §8 already says so.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **A pilot before the 17.** Two lessons first: What is HTTP (lesson 1, the one Home shows, on the two largest standards) and What is UDP (the smallest standard, three pages). Their cost brackets the rest.
2. **Who does what, by the owner's rule of 2026-11-11** (Sonnet writes lessons and step-by-step breakdowns; Opus is called for deep analysis):
   - `author`, **Sonnet**, a new agent: moves one lesson, keeps its words wherever the sources allow, and reports every sentence it changed.
   - `analyst`, **Opus**, a new agent, called only when needed: one hard concept or one contested claim, from the primary sources, with ways a beginner's lesson can say it truthfully.
   - `fact-checker`, **Opus**, unchanged: the sign-off. A fresh one for every run.
3. **The author's check comes before the fact-checker's.** After the author finishes, a Sonnet agent runs the fact-checker's own instructions on the lesson once, as a rehearsal: its report is never committed and is thrown away. The author fixes what it finds. OSI Model's first real run failed 29 items; a rehearsal on Sonnet is meant to catch most of those before an Opus run is spent. The pilot measures whether it does.
4. **A cited lesson needs no exam tag.** The rule that it must carry one is removed: the 14 How the Internet Works lessons teach concepts, not an exam. The tags lessons have stay as they are.
5. **The lesson's words are kept.** A sentence changes only where a source contradicts it or does not state it. Every changed sentence is listed in `team.md`, before and after, for the owner to read. There is no gate on it: the fact-checker's all-pass is the sign-off, as `CLAUDE.md` says.
6. **When a claim will not pass.** After two failed fact-checks on the same claim it goes to the analyst. After a third, the orchestrator stops and asks the owner.
7. **One lesson at a time, one branch each**, merged into `revamp` when its report passes. Lessons share the source registry and the legacy list, so they do not run side by side in the pilot.

## Units

No design phase: nothing about a screen changes. Groundwork first, then the two lessons, in this order.

| Unit | Owner | What | Check |
|---|---|---|---|
| S3 | scout | What a move takes, and the size of each of the 17. Done. | Every fact has a `path:line`. |
| G1 | builder, reviewer | **A cited lesson needs no exam tag** (decision 4). | Unit tests: a cited lesson with no tag is accepted; nothing else about tags changes. `npm test`, `npm run build`. |
| G2 | builder, reviewer | **Home's demo shows a lesson's whole lead**, however many statements it has, and its sources from the derived list. | Unit tests with a one-statement and a three-statement lead; Home's page and its end-to-end tests unchanged for today's lessons. `npm test`, `npm run build`, `npm run e2e`. |
| G3 | builder, reviewer | **Tests follow the registry.** A test that needs "an unchecked lesson" or "a checked one" takes it from the registry while one exists, and from a fixture when none does; counts come from the legacy list. The list's own test stays exact: each move edits it. | No assertion is weakened: each changed test is shown failing against a deliberately wrong build. `npm test`, `npm run e2e`. |
| L1 | author, then the rehearsal, then fact-checker; analyst if needed; orchestrator merges | **What is UDP**, cited and checked. | Its report: every item passing, the quote record written, `--check` OK. The build's gate passes. The lesson's own end-to-end tests pass. Every changed sentence is in `team.md`. |
| L2 | the same | **What is HTTP**, cited and checked. | As L1, and Home's demo shows its words and its numbered sources' documents. |
| Final | orchestrator | On `revamp` after the last merge. | `npm test`, `npm run build`, `npm run e2e`. Then the measured cost per lesson, and a proposal for the other 15: order, how many at once, what the rehearsal saved, a budget. |

What is UDP goes first: it is the smaller, so a fault in the method costs less to find.

## Estimate

| Role | Model | Units | Tokens, roughly |
|---|---|---|---|
| scout | Haiku | S3 | 188,000 (spent) |
| builder | Sonnet | G1, G2, G3 | 350,000 |
| reviewer | Opus | G1, G2, G3 | 300,000 |
| author and rehearsal | Sonnet | L1, L2 | 700,000 to 1,000,000 |
| fact-checker | Opus | L1, L2 | 500,000 to 900,000 |
| analyst | Opus | only if called | up to 200,000 |

If the pilot's cost per lesson holds, the other 15 would come to something like 10 to 15 million tokens. That figure is a guess until the pilot ends, which is why the plan stops there.

## What could go wrong

- **A lesson teaches something its sources do not say.** Then its words change, by the smallest amount that makes them true, and the change is listed. If a whole step rests on it, the orchestrator stops and shows the owner before the lesson is restructured.
- **A claim needs a second source no allowed host has.** The author rewords it to what the defining standard states, or cuts it. A new publisher's host is added only when it is the publisher's own, with the reason in the commit.
- **The fact-checker's partial and failing verdicts wander** between runs (seen on the canary in Phase 3). Both block a lesson, so a wandering verdict costs a run, not accuracy.
- **Home changes when HTTP is cited.** G2 lands first, and L2's check looks at Home.

## Not in this plan

- The other 15 lessons: the next plan, after the pilot's numbers.
- A fact-check path for glossary entries or objective mappings.
- Anything that leaves this machine.
