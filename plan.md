# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e.

# Job 18: the Tracks page in the Card stack look

**Status: the owner said go with the layout open ("Redesign the layout too", 2026-11-16, direction 2.86); D18 approved with layout 1, Stack, as drawn (2.87); errata E1–E11 (2.88, `prototypes/d18-cases.md`); B21 built, FAIL then PASS WITH FIXES; on `revamp` at `aa6d838`; job 18 done (2.89).** Planned under 2.84 and 2.85. The owner said "Now let's work on the Tracks page", and to whether Card stack replaces Patch: "Site-wide excluding our current Lesson's page." Numbers claimed on `revamp`: job 18, direction rows 2.84 to 2.89, S20, D18, B21, F18.

## Inputs

| | |
|---|---|
| **The job** | `/tracks` redesigned in the Card stack look, its layout open (2.86), on phone and desktop, light and dark; two layouts drawn for the owner to choose between. Card stack's tokens and parts move out of Home's own stylesheet into one the two pages share, with Home unchanged. |
| **Done means** | The owner has approved D18 at the design gate; B21 is merged into `revamp` with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); Home looks the same before and after (screenshots at 375 and 1440, light and dark, compared); on `revamp`, `npm test`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass; the page's height at 375 and 1440 and its gzipped size measured before and after and recorded; `docs/direction.md` §10 and §11 updated for the new Tracks page. Nothing pushed. |
| **Budget** | 1.55 to 2.2 million subagent tokens of growth (estimate below), plus the scout's 0.15 million spent. A stop for the owner at 2.8 million. |
| **References** | `docs/direction.md` 2.80 to 2.85, §6 (Patch: the Lesson page, header and footer), §9 (Home and the Card stack look), §10 (the Tracks take not adopted, so not proposed again), §11; `prototypes/d17-home-card-stack.md` and `.html` (the look as approved) and `prototypes/d17-cases.md` (its errata); `prototypes/s20-tracks-facts.md` (the page's code, data, tests and what it shares); `src/pages/tracks.astro`, `src/components/hub/TrackPanelProgress.tsx`, `TrackStrip.tsx`, `hub.css`, `src/lib/tracks-page.ts`, `src/pages/index.astro:328-1416` (Card stack's styles, `--cs-*`). |

## What the scout found (S20)

- Three panels: How the Internet Works (14 lessons, all ready), Networking Concepts (20, all ready), CompTIA A+ (none; its panel says so with no link, and "Lesson 1 is being written" is written into `tracks.astro:60`).
- One island a ready track (`TrackPanelProgress`, `client:load`): the strip, Start or Continue, See the whole track, and the up-next card, from this browser's progress; a first visit until progress loads, and with no JavaScript.
- Its styles are 140 lines; the narrow-screen rules say "not designed yet (task 8), only kept from breaking". `.panel` still names `shadow-sm`, which paints nothing.
- Measured on `revamp` (1cba05e): 1,886px tall at 1440, 3,335px at 375 (each track about 700 to 750px, a screen); 213 KB gzipped, 1.04 MB raw, within the 250 KB budget. Most of the weight is one figure for every ready lesson (34), sent so the up-next card can show whichever lesson is next.
- Shared with the track page: `TrackStrip` and `hub.css` (`.strip`, `.panel__cta`, `.next`, `.lift`), which the track page still wears in Patch.
- Pinned by 4 tests in `src/lib/tracks-page.test.ts`, 9 in `TrackPanelProgress.test.tsx`, end-to-end `e2e/site.spec.ts:482, :528, :562` (the page) and `:784, :858` (progress), an `@visual` `tracks` screenshot, and `e2e/global-setup.ts:16-20`, which stops every end-to-end run unless `/tracks` has `main article.panel h2 a`.

## Decisions in this plan

1. **The look is Card stack, variant A, as approved on Home** (2.82, 2.84): white cards with a hard 2px ink edge and the next card's edge beneath, index tabs, offset-edge buttons, Patch's colours one job each, the figures re-tinted, never redrawn. The header and footer stay as they are.
2. **The layout is open** (the owner, 2.86; it replaces this plan's first ruling that today's layout was kept). What stays is what the page tells a reader: each track's name and who it is for, how far this browser has got, the way in (Start or Continue, the whole track), the lesson up next, A+ not ready yet, and the order to take the tracks in. The owner's rule of 2026-11-09 against listing every lesson here stands, and §10's "every track is a cable" take is not offered again. New or changed words are listed in the spec for the owner at the gate.
3. **D18 draws two layouts**, both in Card stack, genuinely different in structure (the most `CLAUDE.md` allows without the owner's word); the owner picks one at the gate. Each shows every state the island has: a first visit, part way, a track finished, no JavaScript, and A+'s planned panel; at 375 and 1440, light and dark.
4. **The page's weight is the designer's to rule on**: whether the up-next card keeps a figure for every lesson (34 today, the bulk of 213 KB), or shows something lighter. The builder measures before and after.
5. **One shared Card stack stylesheet, built in B21** (2.84): the `--cs-*` tokens and the card, tab and button parts move out of `index.astro` into one file Home and Tracks import; nothing goes into `src/styles/tokens.ts`. Home must render the same: its tests unchanged, and screenshots before and after at 375 and 1440, light and dark.
6. **The track page stays Patch.** `TrackStrip` and `hub.css` are shared with it, so Tracks' Card stack rules are scoped to Tracks, and the track page's tests and look do not change.
7. **Kept for the rest of the site:** the anchors Home's track cards link to (`#how-the-internet-works`, `#networking`, `#comptia-a-plus`) landing clear of the sticky header; a ready track's name as `main article.panel h2 a`, or `global-setup.ts` changed in the same unit; no new `<script>`; the island's props and progress logic.
8. **Build in a worktree of its own** (`.superpowers/wt/b21`, branch `job18/b21` off `revamp`, `node_modules` linked, E2E port 4487). The final checks run in the main folder after `lsof -iTCP:4471 -sTCP:LISTEN` (job 17's lessons).

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S20 | scout | scout (Haiku) | Done: `prototypes/s20-tracks-facts.md`. | |
| D18 | design | designer (Opus 5.5) | `prototypes/d18-tracks-card-stack.html` and `.md`: Tracks in Card stack, two layouts, every state above, at 375 and 1440, light and dark, with "For the builder" and acceptance checks as D17's spec has; the page weight ruled. | The orchestrator looks at it in the browser at 375 and 1440, light and dark; the phone page measured against 3,335px. |
| Gate | design | the owner | D18's prototype and spec. | The owner's words. |
| B21 spec | build | reviewer (Opus) | Holes and attack cases for D18: `prototypes/d18-cases.md`. | Holes with one right answer closed as errata; taste goes back to `designer`. |
| B21 | build | builder (Sonnet) | First commit: the shared Card stack stylesheet, Home unchanged. Second: D18 in `tracks.astro` and the island's markup, with the tests that pin Tracks changed once and each case a test. | `npm test`; `npm run build`; `e2e/site.spec.ts` at d1440-dark and phone; Home's before-and-after screenshots. |
| B21 review | build | reviewer (Opus) | The diff against D18, the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F18 | end | orchestrator (Opus 5.5) | Into `revamp`; CI's end-to-end pass; heights and weight measured; §10 and §11 updated; the ledger; the owner's result with errata. | `npm test`, `npm run build`, CI's e2e pass on `revamp`. |

Order: D18; the gate; the spec review; B21; its review; F18.

## Estimate

| Part | Growth, roughly |
|---|---|
| D18 (two layouts, five states, two widths, two themes) | 0.65 to 0.8 million |
| B21 spec review | 0.15 to 0.25 million |
| B21: the shared stylesheet, `tracks.astro`, the island, the tests | 0.5 to 0.8 million |
| B21 review, and the fixes | 0.25 to 0.35 million |
| **Total** | **1.55 to 2.2 million** |

## When the work stops for the owner

- The design gate.
- A design that needs the header, the footer or the Lesson page to change, or a token other pages read.
- A hole in the approved spec that needs taste and would change what the owner approved.
- The job past 2.8 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **Moving Home's styles changes Home.** Scoped Astro styles and `:global` rules behave differently once in a shared file. The first commit is the move alone, checked by Home's tests and screenshots before Tracks is touched.
- **The island renders into the panel's grid** (Astro's wrapper is `display: contents`). A new layout must keep the island's parts as grid items, or change the island's markup with its 9 tests.
- **The shared `hub.css` leaks.** A rule written for Tracks' `.strip` or `.next` would restyle the track page; Tracks' rules stay scoped to the page.
- **`global-setup.ts` stops every end-to-end run** if the track names stop being `main article.panel h2 a`.
- **A first visit and no JavaScript look the same; part way does not.** The design must hold for both, and the up-next card must not jump when progress loads.

## Not in this job

The track page, About, the Glossary and 404 in Card stack (later jobs, 2.84); the header and footer; the Lesson page; Home, beyond moving its styles unchanged; A+'s lessons; the critique's findings D and E on Home.
