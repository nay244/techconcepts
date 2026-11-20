# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82, and job 22's (the Glossary and About in the Card stack look, with its result) at b14f4d1, and job 23's (404 in the Card stack look, with its result) at a6589ba, and job 24's (the header and footer in the Card stack look, with its result) at 1009fae.


# Job 25: the Lesson page's skip link over its header

**Status: planned (2026-11-19; 2.127).** The owner, at D23's gate, to the Lesson page's skip link hidden under its header: "Small unit after this job" (2.124). Numbers claimed on `revamp` (1009fae, checked free): job 25, direction rows from 2.127, B30, F25.

## Inputs

| | |
|---|---|
| **The job** | On the Lesson page (`src/pages/[track]/[lesson].astro`) the focused skip link ("Skip to content", `BaseLayout`, styled by `global.css`'s `.skip-link`, z-index 10) is drawn under the sticky header (z-index 20, Patch's 88% ground with blur): a ghost. Since job 24 the seven Card stack pages lift it with `a.skip-link { z-index: 21 }` in `card-stack.css`, which the Lesson page does not import (2.123). |
| **Done means** | Focused, the Lesson page's skip link is the element at its centre and 2px inside two opposite corners, at 320, 375 and 1440, light and dark; its look otherwise unchanged; every built file but the lesson pages and the stylesheet they alone load byte-identical to `revamp` (a command at merge time); on `revamp` `npm test`, `npm run build` and CI's end-to-end pass green; the ledger and the direction doc updated. Nothing pushed. |
| **Budget** | 0.2 to 0.4 million subagent tokens of growth. A stop for the owner at 0.6 million. |
| **References** | `docs/direction.md` 2.123, 2.124, 2.125; `prototypes/d23-header-footer.md` §5.7 and open question 3; `prototypes/d23-cases.md` cases 35 to 37 and 62; `src/styles/global.css:161-177`; `src/lesson/console.css:41-53`. |

## Decisions in this plan

1. **The rule lives in `src/lesson/console.css`**, the Lesson page's own sheet (only `LessonConsole` imports it, and only the Lesson page renders `LessonConsole`), beside the rule it already adds to the header: `body:has(.console) .skip-link { z-index: 21; }`, specificity 0,2,1 over `global.css`'s 0,1,0, no `!important`. Not `global.css`: every page loads it, so every page's stylesheet, and with it every page's HTML, would change; not `card-stack.css`: the Lesson page keeps Patch (2.123). The comment above the header rule ("The one rule the Lesson page adds to the header") is reworded to fit the second rule.
2. **No design unit.** The skip link keeps `global.css`'s look on every page; only its layer changes, to the value D23 drew and the owner approved for the other seven (§5.7, 2.124). Nothing new is drawn, no word changes, so `designer` and the design gate are not needed, and no fact-check runs.
3. **No base run.** The unit changes one rule on one page's sheet; B30 runs its specs on `revamp` first to show its new test red, and an old flake shows there.
4. **Tests changed on purpose:** `e2e/site-chrome.spec.ts`'s case 37 (`['21', '10']` becomes `['21', '21']`, the rest of the comparison kept) and case 62 (the Lesson page's skip link `zIndex` `10` becomes `21`; every other Patch value it pins kept). New: case 35's reads on the Lesson page at 320 × 640, 375 × 812 and 1440 × 900, light and dark, red on `revamp`.
5. **One build unit**, B30 (`.superpowers/wt/b30`, branch `job25/b30`, `E2E_PORT=4504`, review on 4505). The spec review reads this section and writes its cases under B30 below.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| B30 spec | build | reviewer (Opus) | Holes and attack cases for decision 1 and 4. | Holes with one answer closed as errata. |
| B30 | build | builder (Sonnet) | The rule of decision 1; the tests of decision 4, the new one red on `revamp` first. | `npm test`; `npm run build`; `site-chrome.spec.ts`, `lesson-layout.spec.ts`, `lesson-layout-small.spec.ts` and `site.spec.ts` at d1440-dark, phone and reduced-motion; the merge-time command. |
| B30 review | build | reviewer (Opus) | The diff against this section and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F25 | end | orchestrator (Opus 5.5) | Into `revamp`; CI's end-to-end pass; the merge-time command; the ledger and direction. | As "Done means". |

### B30's attack cases

(Written by the spec review.)

## When the work stops for the owner

- A change to how the skip link looks beyond its layer, or to any page but the Lesson page.
- The job past 0.6 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps.

## Not in this job

Home's missing root scroll padding and the footer rings cut at the foot of Tracks and the track pages (2.126); the dead code of 2.122; the Lesson page's own look (2.84); Tracks' `:371` flake.
