# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82, and job 22's (the Glossary and About in the Card stack look, with its result) at b14f4d1.

# Job 23: 404 in the Card stack look

**Status: go (2026-11-19; 2.117): the layout kept, D22 on Fable 5.2 by the owner's word. D22 approved and frozen (2.118, `8c6c43d`); next the spec review.** Planned under 2.116. The owner: "Start the 404 page". 404 is the last page of 2.84's move (Card stack on every page but the Lesson page). Numbers claimed on `revamp` (b14f4d1, checked free): job 23, direction rows from 2.116, S24, D22, B28, F23.

## Inputs

| | |
|---|---|
| **The job** | `/404` (`src/pages/404.astro`) in the Card stack look (2.84), on phone and desktop, light and dark; its layout open or kept by the owner's answer at the go (decision 2). |
| **Done means** | The owner has approved D22 at the design gate; B28 is merged into `revamp` with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npx vitest run --maxWorkers=3`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass, the specs B28 touches also at `reduced-motion`; `tracks-render.test.ts`'s importer test (`9fa303a`) says six pages and the three `--cs-edge` tests count 404 among the Card stack pages, the four tests changed on purpose; Home, Tracks, the track pages, About and the Glossary build byte-identical before and after (the islands' random ids aside); heights and weight measured before and after; `docs/direction.md` §11 (404) updated; the ledger written. Nothing pushed. |
| **Budget** | 0.7 to 1.2 million subagent tokens of growth (estimate below), plus S24's 0.11 million. A stop for the owner at 1.5 million. |
| **References** | `docs/direction.md` 2.84, 2.89 (focus under the sticky header), 2.102 (`transitionsDone`), §8 (page figures), §9 (Card stack), §11 (404 as built 2026-11-10); `prototypes/d21-about.*` and `d20-*` (the same move for other pages) and their cases; `prototypes/s24-404-facts.md`; `src/styles/card-stack.css`. |

## What the scout found (S24), and what was measured

- **The page** (`src/pages/404.astro`, 90 lines): "Error 404", the heading "That page isn't here", the lede, two buttons (Go to Home, See the tracks), and what the number means with the link "Lesson 1, HTTP" (from `startLesson()`); the `notFound` figure beside the words, first on a phone below 860px. 14 strings a reader sees, 10 rule blocks, one media query. No script of its own.
- **The figure** (`src/art/figures/pages.ts:45-91`): a patch panel of eight ports, 401 to 408, every one linked and lit but 404, whose loose plug stops short; it carries no colour of its own (`lumen.css`, and `card-stack.css:84-143` re-tints figures in `main`). Used only here and in `pages.test.ts`.
- **`site.css`** gives the page only `.btn` and `.btn--primary`; it stays in the site through the header and the islands. `card-stack.css` restyles `main .btn` already (offset edge), so the page's buttons change look by the import alone.
- **Pinned by** `site.spec.ts:971-986` (status, title, heading, the three links, the figure's name, header and footer), the `ALL_PAGES` / `SITE_PAGES` loops (skip link, header and footer links, menu at 959 / 960, no sideways scroll, no theme toggle without JavaScript, phone loads, the share image, the `@visual` loop), `pages.test.ts:50-55` (the ports), `check-budgets.test.mjs:67,77`.
- **Four tests change on purpose, not one** (the scout found three more): besides `tracks-render.test.ts:196-208` (`9fa303a`, the importer list, five to six), three end-to-end tests use `/does-not-exist` as the page that does not read Card stack: `tracks-card-stack.spec.ts:800-806`, `about.spec.ts:88-96`, `glossary.spec.ts:448-456`. Once 404 imports the stylesheet they say the opposite. Ruled: in each, `/does-not-exist` moves from the "empty" side to the "set" side, and `/networking/dhcp` (the Lesson page, which keeps Patch) stays the page that does not read it. `card-stack.css`'s opening comment (lines 1–3) names six importers; job 22's guard allows lines 1 to 4 only.

- **Measured on `revamp` b14f4d1** (built, headless Chromium, fonts loaded): 1,245px at 1440×900, 1,440 at 390×844, 1,454 at 375×812, 1,519 at 320×640, the same in dark; no sideways scroll at any of them; 128,649 bytes raw, 31,158 gzipped (31.3 KB in the build's table), 2 `<script>` elements (1.2 KB of JS), within the 250 KB budget. At 1440 the words sit left and the figure right (690×504px); below the page's break the figure comes first (311×227 at 375), the heading under it at y 394. Screenshots in `.superpowers/job23/look/` (untracked).

## Decisions in this plan

1. **The look is Card stack, colour variant A, as on the five pages that wear it**: cards with a hard ink edge, index tabs, offset-edge buttons, Patch's colours one job each, figures re-tinted by `card-stack.css`. The page imports `card-stack.css`, whose rules do not change (only its opening comment, which names its importers: six now); the header and footer stay as they are; `site.css` leaves the page if nothing of it is still needed.
2. **The layout: the owner's choice at the go.** Recommended: **kept** (today's structure, the words beside the figure, restyled), because the page is about one screen tall, has one job (send a lost reader somewhere) and works at every width measured; a second layout costs about 0.15 million. If open, D22 draws two layouts, the first today's structure in Card stack. Either way what the page tells a reader stays: "Error 404", the heading, the lede, both buttons, what the number means and the link to lesson 1 (HTTP), the `notFound` figure.
3. **No new words without the owner's yes.** Every word on the page is kept; a word new, changed or removed is listed in D22's spec for the owner at the gate. The words state one fact (what 404 means), already on the page since 2026-11-10; it is unchanged, so no fact-check runs.
4. **The designer: on the orchestrator's model (Opus 5.5) unless the owner says Fable 5.2 for this task** (the rule of 2026-11-12; asked at the go). One designer, one prototype (`prototypes/d22-404.html` and `.md`) at 320, 375 and 1440, light and dark, with "For the builder" and acceptance checks as D21's spec has, heights and weight ruled and measured. The orchestrator looks at it in the browser before the gate.
5. **The `notFound` figure stays** (its drawing unchanged in `src/art/figures/pages.ts`); `card-stack.css` re-tints it as it does other figures, and the design draws it so.
6. **Kept for the rest of the site:** the page's title, description and `canonical={null}`; how `404.html` is served; the header's and footer's links; no new `<script>`.
7. **Keyboard and motion, as in jobs 18 to 22.** The spec review names Tab and Shift+Tab walks at 320, 375, 390 and 1440 with the header's menu closed and open, focus never under the sticky header; the builder runs its specs in `reduced-motion` before review, uses `transitionsDone` for any read after a state, scroll or focus change, and proves each wait with `--trace=off --repeat-each=10`. Every agent writes its report in parts. After sending fixes the orchestrator checks the branch's commits within the hour.
8. **One build unit**, B28 (`.superpowers/wt/b28`, branch `job23/b28`, `E2E_PORT=4500`, review on 4501; ports checked free with `lsof` before the brief). The four tests changed on purpose: `src/lib/tracks-render.test.ts`'s importer list gains `src/pages/404.astro`; `tracks-card-stack.spec.ts:800-806`, `about.spec.ts:88-96` and `glossary.spec.ts:448-456` expect `--cs-edge` set on `/does-not-exist` and still empty on `/networking/dhcp`. Any other test that pins the page in Patch is listed by the spec review and changed once in the build.
9. **At the job's end, the owner is asked whether the header and footer join the Card stack look** (2.84: asked when the last page has moved).

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S24 | scout | scout (Haiku), 0.11 million | Done: `prototypes/s24-404-facts.md`, with the orchestrator's measures in its Part 8. | |
| D22 | design | designer (Fable 5.2, the owner's word, 2.117) | `prototypes/d22-404.html` and `.md`: the layout(s) of decision 2, the widths and themes of decision 4, length and weight ruled, every word listed. | The orchestrator looks at it in the browser at 320, 375 and 1440, light and dark; heights against S24's. |
| Gate | design | the owner | D22's prototype and spec. | The owner's words. |
| B28 spec | build | reviewer (Opus) | Holes and attack cases, the keyboard walks of decision 7, the tests that change: `prototypes/d22-cases.md`. | Holes with one answer closed as errata; taste back to `designer`. |
| B28 | build | builder (Sonnet) | 404 as approved; the four tests of decision 8; each case a test. | `npm test`; `npm run build`; its specs at d1440-dark, phone and reduced-motion; heights and weight; the other five Card stack pages byte-identical. |
| B28 review | build | reviewer (Opus) | The diff against the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F23 | end | orchestrator (Opus 5.5) | Into `revamp`; CI's end-to-end pass; the other pages unchanged; heights and weight; §11 updated; the ledger; the header-and-footer question. | As "Done means". |

Order: the go; D22; the gate; the spec review; B28; its review; F23.

## Estimate

| Part | Growth, roughly |
|---|---|
| D22 (one layout; 0.15 million more for two) | 0.2 to 0.35 million |
| Spec review | 0.12 to 0.2 million |
| B28 | 0.2 to 0.35 million |
| Review and fixes | 0.15 to 0.25 million |
| **Total** | **0.7 to 1.2 million** (two layouts: 0.85 to 1.35) |

## When the work stops for the owner

- The go, with the layout open or kept and the designer's model.
- The design gate.
- A design that changes the page's words, the header, the footer, the Lesson page, `card-stack.css`'s rules, or how the other five Card stack pages look.
- A hole in the approved spec that needs taste and would change what the owner approved.
- The job past 1.5 million tokens of growth.
- The header-and-footer question at the end.
- Anything `CLAUDE.md` says the owner keeps.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **A 404 page is served for any address**, so its links and assets must work from any depth (absolute paths); a test at a deep address checks it.
- **`card-stack.css` restyles what it reaches in `main`**: the figure and the link re-tint; the design draws them so.
- **`site.css` may still give the page `.wrap` or the buttons**; dropping it must not change the header or footer.
- **Tests that used 404 as the page without Card stack** (four, decision 8) must be changed to name the Lesson page, not loosened; the `card-stack.css` comment guard of job 22's E2 still allows only lines 1 to 4.

## Not in this job

The header and footer in Card stack (asked at the end, a job of its own if yes); the Lesson page; any lesson's words; the Glossary's paused entries (Phase 5); the old `SiteFooter.astro` comment.
