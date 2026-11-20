# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82, and job 22's (the Glossary and About in the Card stack look, with its result) at b14f4d1, and job 23's (404 in the Card stack look, with its result) at a6589ba, and job 24's (the header and footer in the Card stack look, with its result) at 1009fae, and job 25's (the Lesson page's skip link over its header, with its result) at 7cd51b4, and job 26's (two flaky end-to-end tests, with its result) at 0d94b6c.


# Job 27: the other one-frame lags during Play all

**Status: the owner's go (2026-11-20; 2.135); B33's spec review done, errata E11–E18; B33 building.** Planned under 2.134. The owner said "Yes, plan job 27" to the three passive effects B32's spec review found (2.132, 2.133). Numbers claimed on `revamp` (0d94b6c, checked free): job 27, direction rows from 2.134, B33, F27.

## Inputs

| | |
|---|---|
| **The job** | During Play all, the log, the explanation and the lesson's table (in the guide, and in the phone's Table tab) move in the same frame as the step they follow. |
| **Done means** | B33 built, reviewed and merged; `.superpowers/job27/diag-27.spec.ts` and `diag-27b.spec.ts` (copied in for the run, never committed) count no wrong frame for any of the four, Firewalls' included; on `revamp` `npx vitest run --maxWorkers=3`, `npm run build` and CI's end-to-end pass green with 0 failed; the ledger and the direction doc updated. Nothing pushed. |
| **Budget** | 0.2 to 0.4 million subagent tokens of growth (spec review 0.08 to 0.12, build 0.08 to 0.15, build review 0.03 to 0.08). A stop for the owner at 0.6 million. |
| **References** | `docs/direction.md` 2.130 to 2.133; `team.md` job 26; `prototypes/b32-cases.md` (its probe, E7, is the pattern); the diagnosis below, its spec, logs and trial diff in `.superpowers/job27/` (git-ignored). |

## What the diagnosis found

The same cause as 20c's (2.130): Play all advances on a timer (`src/engine/playback.ts:261`), React commits the update's DOM and runs passive effects in a later task, and a frame can be painted between. An instrumented spec (`diag-27.spec.ts`: a frame callback reads each frame just before paint) played seven lessons (Router, Switch, NAT, ARP, Firewalls, What is DNS, Proxies) three times each at 1440 × 900 and at 390 × 844; a second (`diag-27b.spec.ts`) did the same at 390 with the Table tab open. The trial is the effects as `useLayoutEffect`.

| Effect | Wrong frame the reader sees | 1440 now | 390 now | Trial, both sizes |
|---|---|---|---|---|
| The log's scroll to its last row (`src/lesson/LogPanel.tsx:140`) | the new row painted below the log's edge, then scrolled in | 29 of 134 row changes | 49 of 135 | 0 |
| The explanation's scroll to the top (`src/lesson/Explanation.tsx:257`) | a scrolled reader sees the new step's words at the old scroll, then the top | 0 of 6 (the words rarely overflow) | 18 of 87 step changes | 0 |
| The guide table's row into view (`src/lesson/LessonConsole.tsx:190`, from 1100 × 890) | the step's row painted outside the table's box, then scrolled in | 4 (Proxies step 3 in every run) | none (no guide table) | 0 |
| **Found here:** the Table tab's row into view (`src/lesson/LessonConsole.tsx:151`, phone and tablet) | the table's new marked row painted outside the table or the window, then scrolled in | none (no tab) | 5 of 74 marked-row changes (Proxies in every run, What is DNS 2 of 3) | 0 |

Every wrong frame lasted one frame. None is dropped: each lags, and a layout effect removes each. The fourth was not on B32's list: it shares `MARKED_ROW` with the guide's effect. The console's other passive effects and `Outline`'s run on clicks, a turn of the window or a load, never on a tick.

**A fourth fault, longer, in the guide's effect: Firewalls.** At step 2 the rule that decides ("3 DENY … Block everything else") stays outside the guide table's box for 47 frames, about 0.8s, in every run, now and in the trial. The rules panel's marks are `ScenePanel`'s own state (`src/lesson/ScenePanel.tsx:74`, `:122`), set by the driver as a visit reads the rules; `setMarks` re-renders `ScenePanel` only, so `LessonConsole`'s effect, which runs on the console's renders, does not see the deny mark until the next tick. Firewalls is the only lesson with a rules panel.

## Decisions in this plan

1. **The log's, the explanation's and the Table tab's effects become `useLayoutEffect`**, with their dependencies unchanged (`[rows.length, fold?.open]`, `[panel, position]`, `[tab, change]`) and a comment each saying why. (E17: the Table tab effect's comment says only that the row is brought into view in the commit that marks it.) For a click nothing changes (React already runs passive effects in a click's own task); for a timer's tick the scroll lands in the commit that changes the words.
2. **The guide's row-into-view moves from `LessonConsole` into `ScenePanel`, as a `useLayoutEffect` with no dependency list, run only while the panel is portalled into the guide (`panelHome !== null`).** `ScenePanel` renders the table (`:165`) and holds the marks, and is not memoised, so the effect runs in the commit of every render that changes the table or its marks: the one-frame lag and Firewalls' 0.8s both go. Same selector (`MARKED_ROW` and the known chip), same arithmetic, same 4px margin; only its home and its timing change. A `useLayoutEffect` left in `LessonConsole` would fix the lag and keep Firewalls' fault.
3. **One build unit, B33**, one writer for the four files (`LogPanel.tsx`, `Explanation.tsx`, `LessonConsole.tsx`, `ScenePanel.tsx`) and their tests: `.superpowers/wt/b33`, branch `job27/b33`, `E2E_PORT` checked free with `lsof` when the brief is written (job 26 took 4508 to 4512, the diagnosis 4513).
4. **A probe unit test per effect (four)**, as B32's E7: nothing else tells a layout effect from a passive one (the unit suite and every spec pass either way). jsdom does no layout, so the probes read what the effect wrote (`scrollTop`, or a stubbed rectangle), not the screen.
5. **No designer, no fact-check**: no word and no look change; B33 makes each panel match the frame the approved design already asks for ("keeps the latest row in view", "starts from the top at every new position", "the row the step is about is brought into its view").
6. **The owner's go before the build**: this changes what readers see on every lesson during Play all, and on Firewalls the table now follows the rule that decides.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| B33 spec | build | reviewer (Opus) | On the owner's go: holes and attack cases for decisions 1, 2 and 4. | Holes with one answer closed as errata; cases in `prototypes/b33-cases.md`. |
| B33 | build | builder (Sonnet) | Decisions 1, 2 and 4. | The four probes red on the seeds (each effect back to `useEffect`; the guide's effect back in `LessonConsole`) and green on the build; `diag-27.spec.ts` at both sizes and `diag-27b.spec.ts`, `--repeat-each=3`: 0 wrong for every effect, Firewalls' 47 frames 0; the lesson specs at d1440-dark and `lesson.spec.ts` at reduced-motion; `npm test`; `npm run build`. |
| B33 review | build | reviewer (Opus) | The diff against this section and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F27 | end | orchestrator (Opus 5.5) | Into `revamp`; vitest, build, CI's end-to-end pass with the machine kept awake. | As "Done means". |

### B33's spec review

Reviewer (Opus), 2026-11-20, on `revamp` 0a636f0, with a trial built to the letter of decisions 1, 2 and 4 (`.superpowers/job27/b33-trial.diff`, its probes `b33probe.test.tsx`): 8 holes with one answer each, measured, and 1 of taste; 27 attack cases, all in `prototypes/b33-cases.md`. On the trial the unit suite (2,578) and the `phone` project were green, and both diag specs counted 0 wrong frames at both sizes, Firewalls' included.

**Errata** (2.135): **E11** (H1) B32's sibling probe sees only updates from the top: P1 (log) and P2 (explanation) are later siblings; P3 (Table tab) and P4b (guide, a tick) read the DOM in a `<Profiler onRender>` around `LessonConsole`, P4a (guide, marks) around `ScenePanel`; P4a is the probe that proves the move. **E12** (H2) the jsdom stubs (`scrollHeight`, `scrollTop` set before, `scrollIntoView` assigned and deleted, `getBoundingClientRect` following `scrollTop`), or every probe passes on the seed. **E13** (H3) the move is measured: Firewalls 0 frames out of view in 3 of 3 (47 before). **E14** (H4) `MARKED_ROW` exported from `ScenePanel.tsx`, imported by `LessonConsole.tsx`, defined once. **E15** (H5) the diag specs are copied to `e2e/zz-diag27.spec.ts` and `e2e/zz-diag27b.spec.ts`, read from their lines, deleted, never committed; the explanation can fail only at 390. **E16** (H6) the specs: B32's E10 list at d1440-dark, `lesson.spec.ts` at reduced-motion, the `phone` and `tablet` projects; `tablet.spec.ts:289` (case 18) is flaky on `revamp` (15%) and is reported, not a pass condition. **E17** (H7) the Table tab's mark is drawn only off the tab, so the comment says nothing about it. **E18** (H8) the new effect goes after `ScenePanel`'s play effect. **Not in B33** (H9, taste): the guide does not follow the rule being read ("Checking"), so at Firewalls step 2 rule 3 is read below the guide's edge for about 0.7s at 1× before "Fits → deny" brings it in; for the owner and a later job.

## When the work stops for the owner

- B33, before its spec review (decision 6).
- The job past 0.6 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps.

## Not in this job

Tracks' `:371` flake; Home's root scroll padding, the footer rings at the foot, the dead code of 2.126.
