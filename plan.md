# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82, and job 22's (the Glossary and About in the Card stack look, with its result) at b14f4d1, and job 23's (404 in the Card stack look, with its result) at a6589ba, and job 24's (the header and footer in the Card stack look, with its result) at 1009fae, and job 25's (the Lesson page's skip link over its header, with its result) at 7cd51b4.


# Job 26: two flaky end-to-end tests

**Status: done (2026-11-20; 2.133): B31 merged at `d69cd1e`, B32 at `aff8ab7`, verified; nothing pushed.** Planned under 2.130 to 2.132. The owner asked for a session of its own for the two flakes job 25's CI pass showed (2.129). Numbers claimed on `revamp` (7cd51b4, checked free): job 26, direction rows from 2.130, B31, B32, F26.

## Inputs

| | |
|---|---|
| **The job** | Make `e2e/site-chrome.spec.ts:178` (case 13) and `e2e/proxies.spec.ts:151` (20c) reliable without loosening what they check. |
| **Done means** | Each test green at `--repeat-each=20 --trace=off` at d1440-dark with three workers or more (the CI pass's load), and red against a seeded fault it guards; on `revamp` `npx vitest run --maxWorkers=3`, `npm run build` and CI's end-to-end pass green with 0 failed; the ledger and the direction doc updated. Nothing pushed. |
| **Budget** | 0.3 to 0.6 million subagent tokens of growth (B31 0.15 to 0.3, B32 0.15 to 0.3). A stop for the owner at 0.9 million. |
| **References** | `docs/direction.md` 2.129; `team.md` job 25; `.superpowers/job25/f25-e2e.log`, `f25-rerun.log`, `f25-proxies-base.log`; the diagnosis below, its spec and logs in `.superpowers/job26/` (git-ignored). |

## What the diagnosis found

**Case 13 is a budget, not a race.** It visits the seven Card stack pages at four widths in two schemes, 56 visits each with an open, two reads, Escape and `transitionsDone`, then one more: about 27.4s alone against Playwright's default 30s. Under the full run's load it ran out of time inside `transitionsDone` (`e2e/support.ts:90`), whose poll was still waiting on a running transition when the test's time ended; alone it passed 5 of 5. Nothing it reads was wrong.

**20c is right: the lesson draws a wrong frame.** Play all advances on a timer (`src/engine/playback.ts:261`, `setTimeout` → `rawDispatch`). React commits that update's DOM, the step's words among it, then runs passive effects in a later task. `ScenePanel` (`src/lesson/ScenePanel.tsx:81`, `:101`) makes the driver and calls `driver.show(scene)` in `useEffect`, so the figure is redrawn after the words, and a frame can be painted between them. An instrumented copy of 20c (a `MutationObserver` on the words and on the map, and a frame callback reading both) measured it at d1440-dark, six workers:

| | Runs | Step changes | Words to map, mean / max | Step changes with a frame painted between | 20c's first frames wrong |
|---|---|---|---|---|---|
| `revamp` | 24 | 120 | 16.6 / 30.9 ms | 13 | 6 of 48 (3 at step 2 with step 1's page, 3 at step 4 with step 3's map) |
| trial: both effects `useLayoutEffect` | 24 | 120 | 0.0 / 0.1 ms | 0 | 0 of 48 |

A frame callback runs in the frame's rendering step, just before paint, so a frame it sees is a frame the reader sees: for about one frame, sometimes, "Step 4 of 5" over step 3's map. The sampler does not miss the frame; it reads it. The case the design set (`prototypes/d15-proxies-cases.md` 20c: "Each step's first frame shows its start before the first tag moves") is broken by the lesson about one step change in nine. Loosening 20c (waiting for the map) would hide the fault, so 20c is not changed.

**Every lesson shares the cause, and no other spec samples it.** `ScenePanel` draws every lesson's figure, so every lesson's Play all can lag its figure by a frame. The other Play-all samplers (`e2e/batch1.ts`'s watch, `load-balancers.spec.ts`'s `watchUnhealthy`, `vpn.spec.ts`'s lock) record each thing on its own or only that a thing shows late, never one element's state at the frame another first changes, so none is exposed to this race and none changes.

## Decisions in this plan

1. **Case 13 takes `test.setTimeout(120_000)`, not a split.** The file's own convention (cases at `:297`, `:345`, `:708` set theirs); 4.4 times its unloaded 27.4s. Splitting it per scheme or per width does the same 56 visits, renames the case that `prototypes/d23-cases.md` cites, and leaves each part against the same 30s with half the margin. Nothing it asserts changes; a comment says why the budget is there.
2. **20c's fix is a code fix in the lesson, so it stops for the owner** (the brief: lesson behaviour is shown to readers). Proposed as B32: `ScenePanel`'s two effects become `useLayoutEffect` (the driver's first, so its order before `show` is kept), and 20c stays exactly as it is. Readers' gain: the figure and the words change in the same frame on every lesson during Play all. B32 runs only on the owner's yes; with a no, 20c stays a known flake and the CI pass's "0 failed" is reported as not met by it.
3. **No designer, no fact-check**: no word, no look; B32 makes the figure match the frame the approved design already asks for.
4. **Two build units, one spec review each**, one writer per file: B31 (`e2e/site-chrome.spec.ts` only; `.superpowers/wt/b31`, branch `job26/b31`, `E2E_PORT=4508`, review on 4509) and B32 (`src/lesson/ScenePanel.tsx` and its tests; `.superpowers/wt/b32`, branch `job26/b32`, `E2E_PORT=4511`, review on 4512), side by side.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| B31 spec | build | reviewer (Opus) | Holes and attack cases for decision 1. | Holes with one answer closed as errata. |
| B31 | build | builder (Sonnet) | Decision 1. | Case 13 alone, its time reported; `--repeat-each=20 --trace=off --workers=3` at d1440-dark green; a seed (the header 1px taller open) red, reported, not kept; `npm test`. |
| B31 review | build | reviewer (Opus) | The diff against this section and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| B32 spec | build | reviewer (Opus) | On the owner's yes: holes and attack cases for decision 2. | As B31's. |
| B32 | build | builder (Sonnet) | On the owner's yes: decision 2, with a unit test that the figure is shown in the commit. | 20c `--repeat-each=20 --trace=off --workers=3` green; the seed (back to `useEffect`) red; `.superpowers/job26/diag-20c.spec.ts`'s gap 0; every lesson's spec at d1440-dark; `npm test`. |
| B32 review | build | reviewer (Opus) | The diff against this section and the cases. | As B31's. |
| F26 | end | orchestrator (Opus 5.5) | Into `revamp`; vitest, build, CI's end-to-end pass. | As "Done means". |

### B31's spec review

Reviewer (Opus), 2026-11-19, on `revamp` 5a7348e: 6 holes, 13 attack cases, all in `prototypes/b31-cases.md` (the builder turns each into a check). Measured: case 13 alone takes 25.3 to 26.2s at 1440 and 10.5s under reduced motion, and 20 of 20 pass on `revamp` at 3 or 8 workers and on a busy CPU; about 15s of it is the header's transitions running in real time. Every `expect` in it keeps its own 5s limit, so a stuck transition is still red in about 5s.

**Errata** (2.131): **E1** (H1) the repeat check cannot fail on `revamp`, so it proves no regression only; the discriminating check is case 13 at `--timeout=20000`, red on `revamp` (measured), green on the build, because the case's own budget overrides the command line's; F26 records case 13's time in CI's pass. **E2** (H2) the comment and the call go inside the body, so the case stays at `:178` with its title byte for byte. **E3** (H3) the comment's facts: 56 visits (two schemes, four widths, seven pages), open and Escape at each, transitions in real time, about 26s alone against the 30s default, overrun by a full run's load; not "race", not 27.4s. **E4** (H4, the orchestrator's call) the 120s is accepted: it lets a one-off stall of up to about 94s in `goto`, a click or `fonts.ready` pass slowly, still red at its end, and hides no wrong value; case 13 asserts heights, not time. **E5** (H5) case 13 also runs once at d1440-light and reduced-motion, times reported. **E6** (H6) the seed is `card-stack.css:309`'s bottom padding 18px → 19px (open 392 / 330, closed 69 kept), red on the first height assertion within seconds, not on a timeout.

### B32's spec review

Reviewer (Opus), 2026-11-19, on `revamp` with the trial: 4 holes, 23 attack cases, all in `prototypes/b32-cases.md`. On the trial the unit suite (2,572) and the lessons' specs (439 at d1440-dark, 213 at reduced-motion) were green; no existing test can tell a layout effect from a passive one.

**Errata** (2.132): **E7** (H1) the unit test is a probe component whose own `useLayoutEffect` counts `show` and `play` calls after a rerender: red on the seed, green on the build (measured); a plain "rerender, then show was called" passes either way. **E8** (H2) 20c on the seed is red only by chance (2 of 20 measured), so the seed's required reds are E7's probe and E9's gaps; 20c's count on the seed is reported. **E9** (H3) the diagnosis's spec is copied to `e2e/zz-diag.spec.ts` for the run and deleted, never committed: `--repeat-each=12 --trace=off --workers=3` at d1440-dark, the build passes with every gap ≤ 1.0ms and no frame between in every run; the seed's gaps for steps 2 to 5 are ≥ 5ms (measured 10.1 to 28.0). **E10** (H4) "every lesson's spec" is the 19 files the cases name, at d1440-dark, plus `lesson.spec.ts` at reduced-motion.

## When the work stops for the owner

- B32, before it starts (decision 2).
- The job past 0.9 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps.

## Not in this job

Tracks' `:371` flake; Home's root scroll padding, the footer rings cut at the foot, the dead code of 2.126.
