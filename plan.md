# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521.

# Job 21: the track page in the Card stack look

**Status: planned (2026-11-18, direction 2.103 and 2.104); waiting for the owner's go.** The owner, 2026-11-18: "Let's do the Track's page. For the design use Fable 5.2". The track page is `src/pages/[track]/index.astro`, served at `/how-the-internet-works` and `/networking`. Numbers claimed on `revamp` (fb02521, checked free): job 21, direction rows from 2.103, S22, D20, build from B25, F21.

## Inputs

| | |
|---|---|
| **The job** | The track page in the Card stack look (2.84), on phone and desktop, light and dark, for both tracks. Its layout is open or kept by the owner's answer at the go (decision 2). The page's weight ruled (decision 4). |
| **Done means** | The owner has approved D20 at the design gate; B25 is merged into `revamp` with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npm test`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass, and B25's specs pass in the `reduced-motion` project; Home and Tracks look the same before and after (screenshots at 375 and 1440, light and dark, compared); the page's heights at 375 and 1440 and its gzipped size measured before and after; `docs/direction.md` §11 rewritten for the new page; the ledger written. Nothing pushed. |
| **Budget** | 1.3 to 2.1 million subagent tokens of growth (estimate below), plus S22's 0.24 million spent. A stop for the owner at 2.8 million. |
| **References** | `docs/direction.md` 2.84 (Card stack on every page but the Lesson page), 2.87 (the side card keeps "Start here" until this page moves), 2.89 (the follow-up on focus under the sticky header), 2.102 (`transitionsDone`), §9 (Card stack), §10 (Tracks as built; the cable take not adopted), §11 (this page as built 2026-11-10); `prototypes/d18-tracks-card-stack.*` and `d18-cases.md` (the same move for `/tracks`); `prototypes/d17-home-card-stack.*`; `prototypes/s22-track-page-facts.md`; `src/styles/card-stack.css`. |

## What the scout found (S22), and what was measured

- **The page.** 244 lines, two islands (`TrackSide`, `TrackRoute`, both `client:load`), `site.css` and `hub.css`, not `card-stack.css`. A fixed side column (crumb, the track's name, who it is for, the strip, the lesson up next with its figure and Start) beside a route of parts, one card a lesson (its figure, status, name, subtitle, Start or Continue, the fact-check stamp, Watch-Learn-Practice marks once begun). Its narrow-screen rules say "not designed yet (task 8)".
- **The data.** How the Internet Works: 14 lessons in 6 parts; Networking Concepts: 20 in 6 parts; every lesson ready. No `/comptia-a-plus` page. How the Internet Works' stops show name tiles; Networking's 16 own lessons show drawn spots, and its 4 shared lessons name tiles.
- **Measured on `revamp` fb02521** (built, headless Chromium, a first visit): at 1440×900 both pages are one screen whose route box scrolls (3,861px and 5,018px of content in 831px); at 375×812 they are 7,129px and 9,544px tall (Tracks, after job 18: 2,368px). Gzipped: 11.8 KB and **221.9 KB, against the 250 KB budget**. About 206 KB of Networking's weight is its lesson figures, and OSI Model's is in the HTML twice (side card and stop), against the page's own comment. 4 `<script>` elements each.
- **Shared.** `TrackStrip`, `useUpNext` and `src/lib/hub.ts` with Tracks; `hub.css` (its `.next*` rules are used by no markup since job 18); `site.css`'s buttons, `.disp`, the stamp and name tiles with the whole site.
- **Pinned by** `TrackSide.test.tsx` (11), `TrackRoute.test.tsx` (13), `src/lib/track.test.ts` (9), `progress-islands.test.tsx` (1), `hub.test.tsx`; end-to-end `site.spec.ts:588`, `:639` and others, `router.spec.ts:186` and `e2e/batch1.ts:85-96` (`checkCard`, called by 11 lesson specs: each lesson's figure and its place on `/networking`), the `@visual` loop. Three pins say this page stays Patch and change in the build, once: `src/pages/tracks-render.test.ts:197-208` (who imports `card-stack.css`; the track page's diff since `e6441c2` must be empty) and `e2e/tracks-card-stack.spec.ts:776-792`, with `:612-621` (its scroll padding `auto`).

## Decisions in this plan

1. **The look is Card stack, colour variant A, as on Home and Tracks** (2.82, 2.84, 2.87): the cards with a hard ink edge and the next card's edge beneath, index tabs, offset-edge buttons, Patch's colours one job each, figures re-tinted by `card-stack.css`, never redrawn. The header and footer stay as they are. The page imports `card-stack.css`; nothing goes into `src/styles/tokens.ts`.
2. **The layout: the owner's choice at the go.** Recommended: **open**, as the owner chose for Tracks (2.86), because a phone reader scrolls 9,544px and a desk reader reads the route through an 831px window; D20 then draws two layouts, the first today's structure (side column and route) in Card stack, the second a different structure, so "keep it" stays on the table at the gate. The other choice: **kept**, one layout, today's structure restyled, with the phone and the weight still designed. Either way what the page tells a reader stays: the track's name and who it is for, how far this browser has got, the lesson up next and the way in, every lesson in its part and in order with its name, subtitle, status and the date it was checked, the Watch-Learn-Practice marks once begun, the way back to Tracks and on to the other track. This page is where every lesson is listed (the 2026-11-09 rule is about Tracks). §10's cable take is not offered again.
3. **D20 runs on Fable 5.2, by the owner's word** (2.103); the scout, reviewer and builder keep their models. D20 draws both tracks (name tiles and drawn spots), in the states a first visit, part way (one lesson in progress, some done), the track finished, no JavaScript and storage blocked, at 375 and 1440, light and dark, with "For the builder" and acceptance checks as D18's spec has. Its look is checked by the orchestrator in the browser at 320, 375, 1440, light and dark.
4. **The page's weight is the designer's to rule on, measured**: whether each lesson keeps its drawn figure, a smaller one, the cover, or none (Tracks dropped its lesson figures, 2.87), and the figure that is in the HTML twice. The budget is 250 KB; the builder measures before and after.
5. **The shared parts.** Card stack's existing classes are reused, not copied; a part the track page adds goes into `card-stack.css` only if Home or Tracks also wears it, otherwise into the page's own styles. Home and Tracks must render the same (their tests unchanged; screenshots before and after). Tracks' strip rules stay Tracks'. `hub.css`'s dead `.next*` rules go, since B25 rewrites the file; "Start here" on the side card is the designer's to rule now that this page moves (2.87).
6. **Kept for the rest of the site:** each lesson's link and its `?step=` resume; the Lesson page's crumb and "Back to the track" landing on the page; the redirect `/networking/how-the-internet-works`; `global-setup.ts` unaffected (it reads `/tracks`); no new `<script>`; the islands' progress logic (`useUpNext`, `hub.ts`). Tests that pin today's markup change once in B25, each listed in its report; `checkCard`'s figure check changes only if decision 4 removes the figures.
7. **Keyboard and motion, from jobs 18 to 20.** The spec review names a Tab and Shift+Tab walk at 320, 375, 390 and 1440 with the header's menu closed and open, and focus never under the sticky header (2.89's follow-up, on this page). The builder runs B25's specs in the `reduced-motion` project before review, uses `transitionsDone` (`e2e/support.ts`) for any read after a state or focus change, and proves each such wait with `--trace=off --repeat-each=10`. A test that claims "arriving from X" does not reload. Every reviewer writes its review in parts.
8. **Build in a worktree of its own**: `.superpowers/wt/b25`, branch `job21/b25` off `revamp`, `node_modules` linked, `E2E_PORT=4492`; the review on 4493. If D20 needs two build units, B26 follows B25 off its branch (one writer per file). The final checks run in the main folder after `lsof -iTCP:4471 -sTCP:LISTEN`.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S22 | scout | scout (Haiku) | Done: `prototypes/s22-track-page-facts.md`, with the orchestrator's measures in its Part 8. | |
| D20 | design | designer (Fable 5.2, the owner's word, 2.103) | `prototypes/d20-track-page-card-stack.html` and `.md`: the track page in Card stack, the layouts of decision 2, the states of decision 3, the weight ruled, every word new, changed or removed listed for the owner. | The orchestrator looks at it in the browser at 320, 375 and 1440, light and dark; heights against 7,129 / 9,544px at 375. |
| Gate | design | the owner | D20's prototype and spec. | The owner's words. |
| B25 spec | build | reviewer (Opus) | Holes and attack cases for D20, the keyboard walks of decision 7 included, the cases only a browser can try marked: `prototypes/d20-cases.md`. | Holes with one right answer closed as errata; taste back to `designer`. |
| B25 | build | builder (Sonnet) | D20 in `[track]/index.astro`, `TrackSide`, `TrackRoute`, `hub.css`; the tests that pin the page changed once; each case a test. | `npm test`; `npm run build`; the touched specs at d1440-dark, phone and reduced-motion; Home's and Tracks' before-and-after screenshots; heights and weight. |
| B25 review | build | reviewer (Opus) | The diff against D20, the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F21 | end | orchestrator (Opus 5.5) | Into `revamp`; CI's end-to-end pass; heights and weight; §11 rewritten; the ledger; the owner's result with errata. | As "Done means". |

Order: D20; the gate; the spec review; B25; its review; F21.

## Estimate

| Part | Growth, roughly |
|---|---|
| D20 (two layouts, five states, two tracks, two widths, two themes; one layout if kept: 0.15 less) | 0.5 to 0.75 million |
| B25 spec review | 0.15 to 0.3 million |
| B25: the page, two islands, `hub.css`, the tests | 0.4 to 0.7 million |
| B25 review, and the fixes | 0.25 to 0.4 million |
| **Total** | **1.3 to 2.15 million** |

## When the work stops for the owner

- The go, with the layout open or kept.
- The design gate.
- A design that needs the header, the footer, the Lesson page or a token other pages read to change, or Home or Tracks to look different.
- A hole in the approved spec that needs taste and would change what the owner approved.
- The job past 2.8 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **`card-stack.css` restyles what it reaches.** Its buttons are scoped to `main` and its figure tint to `main` and `#main .lm-svg`: importing it re-tints every figure and button on the page, the stamp's and the name tiles' included. The design must draw them so; the build checks Home and Tracks did not move.
- **The weight crosses 250 KB** if a design adds to each stop; it is 221.9 KB today and the build fails over budget.
- **Eleven lesson specs read `/networking`** through `checkCard` (a lesson's figure, its aria-label, its index). A change to the stops breaks them all at once; `checkCard` changes in one place.
- **The route box scrolls inside the page at 1440.** A layout that keeps it must keep focus visible inside it; one that drops it must keep the side column's way in on screen, or say why not.
- **A first visit, no JavaScript and blocked storage look the same; part way does not.** The side card's figure swaps when progress loads (`TrackSide.test.tsx:67-79`); the design must not jump.

## Not in this job

About, the Glossary and 404 in Card stack (later jobs, 2.84); the header and footer; the Lesson page; Tracks and Home, beyond reading them; any lesson's words; A+'s lessons; the site-wide rule on focus under the sticky header (2.89), beyond this page.
