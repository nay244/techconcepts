# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82.

# Job 22: the Glossary and About in the Card stack look

**Status: done (2026-11-18; 2.114).** The owner said go, both layouts open, the design on Fable 5.2 (2.111); D21 approved and frozen: the Glossary in layout 1 Ledger, About in layout 2 Folders (2.112); spec review errata E1–E16; B26 and B27 PASS WITH FIXES, each fix checked; merged into `revamp` (`3dbe83c`), F22 `9fa303a`. Nothing pushed. Planned under 2.110. The owner, 2026-11-18: "Lets do the Glossary and About in the same session", then, when the separate session could not be given its brief, "Run it here". Numbers claimed on `revamp` (c336e82, checked free): job 22, direction rows from 2.110, S23, D21, build B26 and B27, F22.

## Inputs

| | |
|---|---|
| **The job** | `/glossary` and `/about` in the Card stack look (2.84), on phone and desktop, light and dark, each page's layout open or kept by the owner's answer at the go (decision 2). |
| **Done means** | The owner has approved D21 at the design gate; B26 and B27 are merged into `revamp`, each with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npx vitest run --maxWorkers=3`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass, with `glossary.spec.ts:143` passing or changed once with its reason (decision 5), and the units' specs pass at `reduced-motion`; Home, Tracks and the track page render the same before and after (screenshots at 375 and 1440, light and dark, compared); heights and weight measured before and after; `docs/direction.md` §11 (About) and Phase 5's page section updated; the ledger written. Nothing pushed. |
| **Budget** | 1.9 to 2.95 million subagent tokens of growth (estimate below), plus S23's 0.23 million spent. A stop for the owner at 3.5 million. |
| **References** | `docs/direction.md` 2.84, 2.89 (focus under the sticky header), 2.102 (`transitionsDone`), §9 (Card stack), §11 (About as built 2026-11-10, the track page as rebuilt), Phase 5 and 2.39–2.48 (the Glossary); `prototypes/d20-*` and `d18-*` (the same move for two other pages) and their cases; `prototypes/s23-glossary-about-facts.md`; `src/styles/card-stack.css`. |

## What the scout found (S23), and what was measured

- **Glossary** (`glossary.astro`, 152 lines, three components): 105 entries, 110 definitions (a term with two meanings has one each), 48 spelling pointers, 20 letters with entries (G, Q, V, X, Y, Z dashed). Each row: the term, its definitions, its sources (links) and "Described in" the tracks. A stamp "105 terms checked, the latest on 14 Nov 2026" links to `/about#facts`. No script, no island: it works the same with JavaScript off, and a test pins that. The letter bar sticks at 68px below 1280px; from 1280px the 26 keys stick instead.
- **About** (`about.astro`, 602 lines): the opening (the line, the lede, three counts: 7 tracks planned, 30 lessons ready, 0 accounts), a sticky list of sections beside the reading column (a row to swipe on a phone), five sections, 3 lesson figures and the `sources` figure; one script that lights the current section (`src/scripts/about-toc.ts`).
- **Measured on `revamp` c336e82** (built, headless Chromium): Glossary 20,847px at 1440, 50,158px at 375, 57,255px at 320; 34.6 KB gzipped. About 4,826px at 1440, 6,883px at 375; 51.6 KB gzipped; **at 320 to 356px wide About scrolls sideways** (its third count ends at x 357).
- **Pinned by** `glossary-page.test.ts` (21), `about-page.test.ts` (5), `about.test.ts` (9); `e2e/glossary.spec.ts` (33 tests, d1440 project); `site.spec.ts:727` (About's 30 lessons); `tracks-card-stack.spec.ts:612-621` (both pages' scroll padding `auto`); the `@visual` loop.
- **The held failure `glossary.spec.ts:143`**: scrolled into the middle of the last letter at 375, the bar should stick at 68px; W holds one pointer row, so its section is too short for the sticky bar to stay (the scout's reading, not measured). This job touches that bar.

## Decisions in this plan

1. **The look is Card stack, colour variant A, as on Home, Tracks and the track page**: cards with a hard ink edge, index tabs, offset-edge buttons, Patch's colours one job each, figures re-tinted by `card-stack.css`. Both pages import `card-stack.css`, whose rules do not change; the header and footer stay as they are.
2. **The layout of each page: the owner's choice at the go.** Recommended: **the Glossary open** (a reference page of 105 entries that is 50,158px on a phone; D21 draws two layouts, the first today's structure in Card stack) and **About kept** (a page of prose whose layout was new on 2026-11-10; D21 restyles it, fixes the sideways scroll at 320, and draws one layout). **The owner opened both (2.111): D21 draws two layouts for each page, the first today's structure.** Either way what each page tells a reader stays: on the Glossary every term, every definition, its sources and "Described in", the letters, the stamp and its link, working with JavaScript off; on About every sentence and section (§11), the counts, the figures, the list of sections. **No word of a definition or of About changes**, so no fact-check is needed; any page word new, changed or removed is listed for the owner.
3. **D21 runs on Fable 5.2 by the owner's word (2.111)**, as two designers side by side, one a page. One designer for both pages, two prototypes (`prototypes/d21-glossary.*`, `prototypes/d21-about.*`), each at 320, 375 and 1440, light and dark; the Glossary also with JavaScript off; About's list of sections at each width. Each with "For the builder" and acceptance checks as D20's spec has. The orchestrator looks at both in the browser before the gate.
4. **Weight and length are the designer's to rule on, measured**: the Glossary's phone length (what each row shows open, and whether sources fold) and About's four figures. Both stay within the 250 KB budget.
5. **`glossary.spec.ts:143` is in scope**: the design rules how the letter bar behaves at the end of a short letter; the build makes the test pass, or changes it once with the measured reason, and it is no longer held.
6. **Kept for the rest of the site:** every glossary anchor (`#letters`, `#letter-x`, each entry's id, the pointers) and `/about#facts`, landing clear of the sticky header; the header's Glossary and About links; no new `<script>` on the Glossary; About's script may change only if the design needs it.
7. **Keyboard and motion, from jobs 18 to 21.** The spec review names Tab and Shift+Tab walks at 320, 375, 390 and 1440 with the header's menu closed and open, focus never under the sticky header or the sticky letter bar. The builders run their specs in the `reduced-motion` project before review, use `transitionsDone` for any read after a state, scroll or focus change, and prove each wait with `--trace=off --repeat-each=10`. Every agent writes its report in parts, to a folder it can write (the session's worktree), and the orchestrator copies it across. After sending fixes the orchestrator checks the branch's commits within the hour.
8. **Two build units side by side**, each owning its page and its tests: B26 the Glossary (`.superpowers/wt/b26`, branch `job22/b26`, `E2E_PORT=4495`), B27 About (`.superpowers/wt/b27`, branch `job22/b27`, port 4496); reviews on 4497 and 4498. A file both need (`tracks-card-stack.spec.ts:612-621`, `e2e/support.ts`) is given to one unit by the spec review. One spec review covers both. Final checks in the main folder.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S23 | scout | scout (Haiku) | Done: `prototypes/s23-glossary-about-facts.md`, with the orchestrator's measures in its Part 8. | |
| D21 | design | designer (Fable 5.2, the owner's word, 2.111), two side by side: D21a the Glossary, D21b About | `prototypes/d21-glossary.html` and `.md`, `prototypes/d21-about.html` and `.md`: the layouts of decision 2, the widths and states of decision 3, length and weight ruled, every word listed. | The orchestrator looks at both in the browser at 320, 375 and 1440, light and dark; heights against S23's. |
| Gate | design | the owner | D21's prototypes and specs. | The owner's words. |
| B26–B27 spec | build | reviewer (Opus) | Holes and attack cases for both, the keyboard walks of decision 7, the shared files given to one unit: `prototypes/d21-cases.md`. | Holes with one answer closed as errata; taste back to `designer`. |
| B26 | build | builder (Sonnet) | The Glossary as approved; `glossary.spec.ts:143`; the tests that pin it changed once; each case a test. | `npm test`; `npm run build`; its specs at d1440-dark, phone and reduced-motion; heights and weight. |
| B27 | build | builder (Sonnet) | About as approved, the sideways scroll at 320 fixed; the same. | The same. |
| Reviews | build | reviewer (Opus) | Each diff against its prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F22 | end | orchestrator (Opus 5.5) | Into `revamp`; CI's end-to-end pass; Home, Tracks and the track page unchanged; heights and weight; §11 and Phase 5 updated; the ledger. | As "Done means". |

Order: D21; the gate; the spec review; B26 and B27 side by side; their reviews; F22.

## Estimate

| Part | Growth, roughly |
|---|---|
| D21 (Glossary two layouts, About one; three widths, two themes) | 0.6 to 0.9 million |
| Spec review | 0.2 to 0.35 million |
| B26 | 0.4 to 0.6 million |
| B27 | 0.3 to 0.5 million |
| Two reviews, and the fixes | 0.4 to 0.6 million |
| **Total** | **1.9 to 2.95 million** |

## When the work stops for the owner

- The go, with each page's layout open or kept.
- The design gate.
- A design that changes a definition's or About's words, the header, the footer, the Lesson page, `card-stack.css`'s rules, or how Home, Tracks or the track page look.
- A hole in the approved spec that needs taste and would change what the owner approved.
- The job past 3.5 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **`card-stack.css` restyles what it reaches** in `main`: the Glossary's source links and the About figures re-tint; the design draws them so.
- **The Glossary is long**: a test that walks every entry or every Tab stop is slow; the spec review keeps the walks to sampled letters plus the first and last.
- **Sticky on sticky**: the header, the letter bar (or the keys from 1280) and About's list of sections each stick; anchors and focus must land under all of them.
- **About's counts are computed** (30 lessons, 7 tracks): a layout that fixes the 320 overflow must hold for a fourth digit-width figure.
- **No JavaScript on the Glossary is pinned** to the same HTML as with it on (`glossary.spec.ts:289-314`).

## Not in this job

404 in Card stack (the last page, later); then the question of the header and footer (2.84); the Lesson page; any definition's or lesson's words; the Glossary's paused entries (Phase 5); the old `SiteFooter.astro` comment.
