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

# Job 19: the Lesson page, its layout rearranged in Patch

**Status: planned 2026-11-17; waiting for the owner's go.** The owner said "let's plan out the Lesson page", asked for a comparison with a reference site (`prototypes/s21-reference-designed-to-scale.md`), then chose the scope (direction 2.90). Numbers claimed on `revamp` (1a6bd1a): job 19, rows from 2.90, S21, D19, B22 on, F19.

## Inputs

| | |
|---|---|
| **The job** | The Lesson page's layout rearranged, in Patch, on phone and desktop, light and dark, around the three ideas the owner chose: **the steps as a numbered timeline in place of today's outline**, **a forward button that names where it goes, with a line naming the keys**, and **the track's lessons in the left column**. |
| **Done means** | The owner has approved D19 at the design gate; the build units are merged into `revamp`, each with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npm test`, `npm run build`, CI's end-to-end pass and, because every lesson's layout changes, the full `npm run e2e` once at F19. |
| **Budget** | 2.2 to 3.2 million subagent tokens of growth (estimate below), plus S21's 0.20 million spent. A stop for the owner at 3.6 million. |
| **References** | `docs/direction.md` 2.84 (Patch stays here), 2.90 (the scope), §6 (Patch), §7 (the Lesson page as built and why), §10 (the "stage and a line" take, not adopted in 2026-11; the owner now asks for its timeline idea, so it may be drawn again), 2.71–2.72 (job 15's controls); `prototypes/s21-lesson-facts.md` (the code, regions, tests, faults); `prototypes/s21-reference-designed-to-scale.md` (the reference site's layout and spacing beside ours, measured); `prototypes/d1-*`, `d2-*`, `d3-*` (reading, phone, tablet), `d14-lesson-flow.*` (the controls, its key line). |

## What the scout found (S21)

- One island (`LessonConsole`, `client:load`) draws the whole page: top bar, outline, tabs, scene, explanation, log, controls. `console.css` is 2,068 lines; `LessonConsole.tsx` 347, `Outline.tsx` 289, `TopBar.tsx` 120. The page uses no site header or footer (`chrome={false}`), reads `tokens.ts` through `BaseLayout`, and loads neither `hub.css` nor `card-stack.css`.
- The track's lessons are already in the page: "All N lessons" opens them in a dialog, by part, with Done or In progress (`Outline.tsx:124-155`). Moving them into the sidebar needs no new data.
- 34 lesson pages (14 + 20); 22 on the network map, 26 with a Table tab, 17 with a Sequence view. DHCP's page is 152 KB gzipped.
- Pinned by 644 unit test declarations under `src/lesson/`, `src/engine/`, `src/scenes/` (64 render the console) and 18 end-to-end specs; several measure the 1440 figure box (Load Balancers 733×347, IP Address 396px, TCP/UDP 346px, Ports 316px) and `lesson.spec.ts` walks the outline to every place.
- Still open: the phone figures' labels (1.3 to 7.1px on DHCP at 375, measured again 2026-11-17), the Bits tab that never marks a change, the ending, a wrong answer's mark, the keys, Go deeper's expand-all, the controls late in tab order, the HTTP up-next tile. Job 15 fixed the labels that pointed back and the timer. The bits board's fitting is built (`d6714fa`); §7's two lines saying otherwise are corrected in this change.

## Decisions in this plan

1. **The look stays Patch** (2.84): its tokens, type, colours and figures. No token changes; `tokens.ts` and `card-stack.css` untouched.
2. **The layout is open, within what the page tells a reader.** Kept: the scene with its Network and Sequence views, the explanation with Go deeper and the numbered sources, the event log, the lesson's own table, Learn and Practice with D1's reading width, the stamp, the OSI badge, Play all, replay and the speed button (2.71), the theme button. A reader can still reach every place of the lesson (Overview, each step, Learn, Practice) in one press.
3. **The timeline replaces the outline** (the owner's words: "Their step timeline in place of our current one"). It holds every place, not the Watch steps alone, and uses the lesson's existing step titles; **no lesson word changes and no new fact is written**, so no fact-check is needed. This reverses the 2026-11-10 decision that the sidebar keeps the old outline's design (§7), by the owner's word. Whether the top bar's step segments stay beside it is the designer's call.
4. **The left column holds the track's lessons**, from the data "All N lessons" uses today, with this browser's Done and In progress, the current lesson lit. No search: the site has none and the owner did not choose it.
5. **The forward button names where it goes** ("Next: <place>") where it fits, and a key line names the keys. This reopens 2.71's labels by the owner's word; the designer rules what a phone's 127px button says.
6. **The phone stays one screen** (§7, hypothesis 2.9): the scene pinned, the words in the room left, the controls in the thumb zone. A design that gives this up comes to the owner.
7. **D19 draws two layouts** (the most `CLAUDE.md` allows without the owner's word), both carrying decisions 3–5, different in where the words, the log and the controls go. Each at 375 and 1440, light and dark, in the states Overview, a Watch step, Learn, Practice and the lesson's end, and the 768×1024 and 1024×768 tablets in its spec (D3's two layouts). Each layout is measured against today's at 1440×900 (the figure's size, the words' width, the empty room under a step) and at 375×812 (the scene's height, the words' room), since the owner's standing rule is to rearrange only with a measured gain. The keyboard order follows the new reading order. The owner picks at the gate.
8. **Build units after the gate.** The design sets the split; the planned one is B22 (the shared parts: the timeline, the track column, the forward label and key line, the desktop layout) then B23 (phone and the 761–1099 range), one after the other because both write `console.css` and `LessonConsole.tsx`; one spec review covers both. Each in a worktree of its own (`.superpowers/wt/b22`, branch `job19/b22` off `revamp`, `node_modules` linked, E2E port 4490; B23 off B22's branch, port 4491). Every end-to-end measure that changes with the approved layout is changed in the build and listed in its report.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S21 | scout | scout (Haiku) | Done: `prototypes/s21-lesson-facts.md`. The orchestrator's comparison: `prototypes/s21-reference-designed-to-scale.md`. | |
| D19 | design | designer (Opus 5.5) | `prototypes/d19-lesson-layout.html` and `.md`: two layouts in Patch, the states and widths of decision 7, the measures against today's, "For the builder" and acceptance checks as D18's spec has. | The orchestrator plays it in the browser at 375 and 1440, light and dark, and at the two tablets. |
| Gate | design | the owner | D19's prototype and spec. | The owner's words. |
| B22–B23 spec | build | reviewer (Opus) | Holes and attack cases for D19, a keyboard walk both ways included, the cases only a browser can try marked: `prototypes/d19-cases.md`. | Holes with one answer closed as errata; taste back to `designer`. |
| B22 | build | builder (Sonnet) | The timeline, the track column, the forward label and key line, the desktop layout; the tests that pin them changed once; each case a test. | `npm test`; `npm run build`; the lesson specs at d1440-dark. |
| B22 review | build | reviewer (Opus) | The diff against D19, the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| B23 | build | builder (Sonnet) | The phone and the 761–1099 range. | `npm test`; `npm run build`; the lesson specs at phone and `tablet.spec.ts`. |
| B23 review | build | reviewer (Opus) | As B22's. | As B22's. |
| F19 | end | orchestrator (Opus 5.5) | Into `revamp`; CI's end-to-end pass, then the full `npm run e2e`; §7 rewritten for the new layout; the ledger; the owner's result with errata. | As "Done means". |

Order: D19; the gate; the spec review; B22; its review; B23; its review; F19.

## Estimate

| Part | Growth, roughly |
|---|---|
| D19 (two layouts, five states, two widths, two themes, two tablets in the spec) | 0.8 to 1.0 million |
| Spec review | 0.2 to 0.3 million |
| B22 | 0.5 to 0.8 million |
| B23 | 0.4 to 0.6 million |
| Two build reviews, and the fixes | 0.3 to 0.5 million |
| **Total** | **2.2 to 3.2 million** |

## When the work stops for the owner

- The design gate.
- A design that changes a lesson's words, a token, the site header or footer, or gives up the phone's one screen.
- A hole in the approved spec that needs taste and would change what the owner approved.
- The job past 3.6 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **Eighteen specs measure today's layout.** The figure boxes at 1440, the outline walk, the phone bar's x positions, the tablet's breakpoints. The spec review lists which measures the design changes, so a builder changes those and no others.
- **The figure gets smaller.** The scene is the lesson; a layout that gives the timeline or the track room by shrinking the drawing below today's 685×326 at 1440×900 is not a gain. The designer reports the drawing's size for each layout.
- **The track column is long.** Networking has 20 lessons; at 900 tall with the bar the column must scroll or fold by part without losing the current lesson.
- **The forward label overflows.** Step titles run to about 30 characters ("Network and Broadcast Addresses"); "Next: …" must fit, wrap or shorten by a rule, never be cut mid-word.
- **The tablet ranges** (D3) carry two layouts of their own; a desktop-first build can break them. B23 owns them and runs `tablet.spec.ts`.
- **No JavaScript.** The stacked page must still read; the timeline and the track list need a no-script form.

## Not in this job

The phone figures' label size and the Sequence view on a phone (the critique's P1, not chosen by the owner: "Phone figure fit to box" was offered and left out; it stays open for a job of its own), the Bits tab's change mark, the lesson's ending, the wrong answer's mark, Go deeper's expand-all, the HTTP up-next tile; search; Card stack on this page (2.84); the track page, About, the Glossary and 404 in Card stack; the header and footer; any lesson's words.
