# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82, and job 22's (the Glossary and About in the Card stack look, with its result) at b14f4d1, and job 23's (404 in the Card stack look, with its result) at a6589ba, and job 24's (the header and footer in the Card stack look, with its result) at 1009fae, and job 25's (the Lesson page's skip link over its header, with its result) at 7cd51b4, and job 26's (two flaky end-to-end tests, with its result) at 0d94b6c, and job 27's (the other one-frame lags during Play all, with its result) at 246e33a.

# Job 28: two more flaky end-to-end tests, and the frame they read

**Status: in progress (2026-11-20; 2.137, 2.138): the owner's go to B34; its spec review done, errata E19–E25.** Started from the session that closed job 27, as job 26 was. Numbers claimed on `revamp` (246e33a, checked free): job 28, direction rows from 2.137, B34, F28.

## Inputs

| | |
|---|---|
| **The job** | Make `e2e/tablet.spec.ts:289` (case 18) and `e2e/tracks-card-stack.spec.ts:371` (Tracks' island states, its read at `:407-411`) reliable without loosening what they check. |
| **Done means** | Each test green at `--repeat-each=20 --trace=off` with three workers or more, and red against a seeded fault it guards; on `revamp` `npx vitest run --maxWorkers=3`, `npm run build` and CI's end-to-end pass green with 0 failed; the ledger and the direction doc updated. Nothing pushed. |
| **Budget** | 0.25 to 0.45 million subagent tokens of growth (spec review 0.08 to 0.15, build 0.1 to 0.2, build review 0.05 to 0.1). A stop for the owner at 0.7 million. |
| **References** | `docs/direction.md` 2.102, 2.115, 2.120, 2.133, 2.136; `team.md` jobs 26 and 27; the diagnosis below, its specs, logs and trial in `.superpowers/job28/` (git-ignored; the trial's worktree `.superpowers/wt/diag28`, detached at 246e33a). |

## What the diagnosis found

**One cause for both, and both tests are right: under reduced motion every change is painted one frame late.** `src/styles/global.css:179-187` gives every element, under `prefers-reduced-motion: reduce`, `transition-duration: 0.01ms !important`. `transition-property` is `all` by default, so every property that changes on any element starts a 0.01ms transition, and Chrome paints a transition's first frame at its start value: for one frame after any change the reader sees the old value. (The site's specs already say so in comments: `site.spec.ts:1816`, "a value inherited down the tree starts them a frame at a time"; `glossary.spec.ts:937`; `about.spec.ts:150`.) Both flaky tests set reduced motion, and each reads that frame when its read lands before the next one.

Measured with instrumented copies (a frame callback reading each frame just before paint, as jobs 26 and 27, and for the tablet an `IntersectionObserver` on the table, whose entries are computed after layout and resize observers, just before paint), at three workers:

| | What the reader sees | `revamp` | Trial: `transition-duration: 0s` |
|---|---|---|---|
| **Case 18**: Table or Log chosen at 768 × 1024, turned to 1024 × 768 | the first frame after the turn lays the page out with the upright layout's old values (no 12px gutter, the scene 559px tall, the controls at y 785): the table at y 724, 34% inside the window, and the log below it | 40 of 40 turns, one frame (61 frames in 60 turns by the frame callback) | 0 of 40; the read straight after the turn, before any frame, in view 40 of 40 |
| **Tracks `:371`**: S3 seeded, the page opened | the "done" chip's first frame at 14px, "Lesson 14" drawn over the tick | 20 of 20 loads, one frame; the case's read caught it 9 of 20 in the copy | 0 of 10 |
| The two tests as written, 4 workers | | case 18 fails about 1 in 6 (job 27: 26 of 160) | 60 of 60 (40 case 18, 20 `:371`) |

With motion on, case 18's turn paints no wrong frame (0 of 20), so the page's own JavaScript is not the cause. Found on the way: `PlaybackControls`' forward-button fit is set from a `ResizeObserver` (`src/lesson/PlaybackControls.tsx:76`) and commits a frame after a turn; it moves nothing a test or a reader would notice (0 wrong frames with motion on), and a `flushSync` trial did not change case 18, so it is not this job's.

Nothing in `src` listens for `transitionend` or reads `getAnimations`, and no rule sets a transition delay, so with 0s no transition is created and nothing waits for one. `animation-duration: 0.01ms` stays: an animation's first frame is its start, which is what it draws anyway.

## Decisions in this plan

1. **The fix is in the page, so neither test changes**: `global.css`'s reduced-motion rule takes `transition-duration: 0s !important` in place of `0.01ms`, with a comment saying why (a 0.01ms transition paints its start value for a frame). Readers who ask for reduced motion then see every change in the frame it happens, on every page: a turn of the tablet, a chip, a theme change down the tree. Waiting for the test (`transitionsDone` before the read, as 2.115 did for `:278`) would hide a frame the reader sees, as loosening 20c would have (2.130).
2. **The tests that pin the old duration change on purpose**: `1e-05s` becomes `0s` in `not-found.spec.ts:884`, `site-chrome.spec.ts:487` and `:1288-1289`, and `vpn.spec.ts:113-116`; comments that state the 0.01ms (`about.spec.ts:150`, `lesson-layout-small.spec.ts:565`, `lesson-layout.spec.ts:837`, `glossary.spec.ts:937`, `site.spec.ts:1816`, `site-chrome.spec.ts:486`) are reworded. Each `transitionsDone` wait stays: it costs nothing when no transition runs.
3. **Two frame probes guard the cause, as B32's and B33's probes do**: in `tablet.spec.ts`, beside case 18, an `IntersectionObserver` on the table across the turn: no entry after the turn below a ratio of 1 (red 40 of 40 on `revamp`); in `tracks-card-stack.spec.ts`, beside `:371`, a frame callback from load: no frame with the chip "done" and its font size not 0 (red 20 of 20 on `revamp`). And a unit test that `global.css`'s reduced-motion block says `0s`.
4. **No designer, no fact-check**: no word, no look; the change removes a frame of the old look.
5. **The owner's go before the build**: it changes what every reader with reduced motion sees on every page.
6. **One build unit, B34**, one writer for `global.css` and the specs it names: `.superpowers/wt/b34`, branch `job28/b34`, `E2E_PORT=4521` (review 4522), checked free with `lsof`. Because `global.css` reaches every page, B34 runs the whole `reduced-motion` project, not only the specs it touches.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| B34 spec | build | reviewer (Opus) | On the owner's go: holes and attack cases for decisions 1 to 3, from the trial in `.superpowers/job28/`. | Holes with one answer closed as errata; cases in `prototypes/b34-cases.md`. |
| B34 | build | builder (Sonnet) | Decisions 1 to 3. | Case 18 and `:371` at `--repeat-each=20 --trace=off --workers=3` green; each red on a seed it guards (case 18: the sideways rule that lands Explain removed; `:371`: the done chip's `font-size: 0` removed), reported, not kept; both probes red with `0.01ms` put back, green on the build; the whole `reduced-motion` project, the `tablet` project, `phone`; `npm test`; `npm run build`. |
| B34 review | build | reviewer (Opus) | The diff against this section and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F28 | end | orchestrator (Opus 5.5) | Into `revamp`; vitest, build, CI's end-to-end pass with the machine kept awake. | As "Done means". |

### B34's spec review

Reviewer (Opus), 2026-11-20, on `revamp` f31e3bd with the orchestrator's trial (`.superpowers/wt/diag28`): 7 holes, each with one answer, none of taste; 31 attack cases in `prototypes/b34-cases.md`. On the trial the whole `reduced-motion` project ran 1,120 passed, 3 failed, the three planned `1e-05s` pins.

**Errata** (2.138): **E19** (H1) three unit guards require `global.css` unchanged (`src/lib/glossary-page.test.ts:282`, `src/lib/not-found-page.test.ts:58`, `src/scripts/about-page.test.ts:269`; `npm test` 3 failed on the trial): `global.css` leaves their name-only lists and one grant in job 24's pattern (`src/lib/card-stack-guards.ts`) allows exactly the one changed declaration and comment lines, used by all three. **E20** (H2) the Tracks probe sets `reducedMotion: 'reduce'` itself: the chip has no transition of its own and CI never emulates reduce, so without it the probe is green whatever `global.css` says. **E21** (H3) `vpn.spec.ts:116-117` asserts `< 0.001`, which both values pass: it asserts exactly `'0s'`, its comment reworded. **E22** (H4) `glossary.spec.ts:937-938`'s `running` gate goes with its reason (measured 10 of 10 green without it; it tightens). **E23** (H5) the tablet probe proves it watched: the first entry arrived before the turn and the observed `.tpanel` is still the connected node after it; with Log chosen, one entry at width 1024 and ratio 1 (with Table chosen no threshold is crossed, so none comes). **E24** (H6) the cases are tracked in `prototypes/b34-cases.md`, as B31's to B33's. **E25** (H7) case 18 and the tablet probe run in `--project=tablet`; `:371` and the Tracks probe in `--project=reduced-motion`, the probe also red in `d1440-dark` on the seed.

## When the work stops for the owner

- B34, before its spec review (decision 5).
- The job past 0.7 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps.

## Not in this job

`PlaybackControls`' forward-button fit a frame late after a turn (no visible effect measured); the guide not following the rule being read on Firewalls (2.135); Home's root scroll padding, the footer rings at the foot, the dead code of 2.126.
