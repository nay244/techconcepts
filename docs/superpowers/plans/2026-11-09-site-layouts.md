# Site Layouts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the adopted insideout-study layouts into the site as five PRs: shared shell, Home, Tracks, track page, lesson frame.

**Architecture:** Astro pages render everything static and first-visit-correct; progress-dependent parts are small React islands that read `useProgress(known)`. PR 1 adds the shared pure helpers (`src/lib/hub.ts`, `src/lib/figures.ts`) and presentational pieces (`TrackStrip`, `PartsMarker`) that PRs 2–5 consume. Each PR replaces one page's markup and deletes the components it orphans.

**Tech Stack:** Astro 7, React 19, TypeScript, Vitest + Testing Library, Playwright. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-09-site-layouts-design.md` (read it first; section numbers below are the spec's).

## Global Constraints

- Each part below is **its own branch and PR to main**, merged only with the owner's OK. Never push to main. Work each branch in its own git worktree (superpowers:using-git-worktrees): other sessions share the main checkout, so never switch branches, stash or reset there. Never bare `git stash`.
- Before calling a PR done: `npx vitest run`, `npm run build`, `npm run e2e` all pass, and `npm run e2e:visual` screenshots (1280×800, 1366×768, 1440×900, 1920×1080, light and dark) were looked at. Report failures as they are.
- No new npm dependencies. Never run prettier. No absolute paths in tracked files. All art is ours (covers, spots, name tiles, scene figures).
- Never import from `.superpowers/`. The mockups there are reference only (`python3 serve.py` in `.superpowers/brainstorm/insideout-study/content/`, with the dev server on :4321).
- Tests that encode the old behaviour are **updated in the same PR, never deleted to get green**. A test may be deleted only together with the component it tests.
- Status words, exactly: `Not started`, `In progress`, `✓ Done`, `Not ready yet`.
- No Continue/resume on Home or in the header. No scores, percentages or streaks anywhere.
- Copy on the site must be true today: no "questions you miss are saved" until Practice ships.
- Container: 1240px content, 32px gutter. Corners: card 12px, tile 10px, option/art frame 8px, button 6px.
- Ground dots: `rgba(31, 99, 192, 0.13)` light, `rgba(127, 176, 234, 0.13)` dark, 1px on a 22px grid.
- Narrow screens must not break: phone e2e (`@phone`) keeps passing; the track page split applies only at `(min-width: 1024px) and (min-height: 600px)`.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

## Review Focus

1. **Storage blocked or empty:** every hub shows the first-visit state (Not started, Start, "Start here", strip all outline) with no error. Pinned by tests in Tasks 1.2, 3.1, 4.2.
2. **Several lessons in progress in one track:** Up next picks the one opened most recently, everywhere (Tracks, track page side card, route ring). Pinned in Task 1.2.
3. **Every ready lesson done:** Up next shows the last lesson done, "✓ Done so far", Watch again; no crash on `undefined`. Pinned in Task 1.2.
4. **A saved position past a lesson's end** (a lesson shortened since): Continue links clamp to `maxPosition`. Pinned in Task 1.2.
5. **Old `?for=` links** open the track page with every lesson listed and no error. Pinned in Task 4.3.

---

## Part 1 — Shared shell (branch `feat/layouts-shell`)

### Task 1.1: Ground, corners, container, hover

**Files:**
- Modify: `src/styles/tokens.ts` (add tokens), `src/styles/tokens.test.ts`
- Modify: `src/styles/global.css` (`:root` radii, `body` ground, `.wrap`)
- Modify: `src/components/site.css` (`.lift`)

**Interfaces:**
- Produces: CSS vars `--ground`, `--ground-dot`, `--r-card` (12px), `--r-tile` (10px), `--r-opt` (8px), `--r-btn` (6px); class `.lift`; `.wrap` = 1240px content + 32px gutters.

- [ ] **Step 1: Failing test** in `tokens.test.ts`: `test('ground and its dots are defined for both themes')` asserting `tokens.light.ground === '#f4f7fb'`, `tokens.dark.ground === '#060c17'`, `tokens.light['ground-dot'] === 'rgba(31, 99, 192, 0.13)'`, `tokens.dark['ground-dot'] === 'rgba(127, 176, 234, 0.13)'`, and that `ink`, `ink-strong` and `muted` reach 4.5:1 on `ground` in both themes (`contrastRatio`).
- [ ] **Step 2:** `npx vitest run src/styles/tokens.test.ts` → FAIL (`ground` not a TokenName).
- [ ] **Step 3:** Add `'ground' | 'ground-dot'` to `TokenName` and both theme maps with the values above.
- [ ] **Step 4:** Same command → PASS.
- [ ] **Step 5:** In `global.css`: add the four `--r-*` vars to `:root`; `body` gets `background-color: var(--ground); background-image: radial-gradient(var(--ground-dot) 1px, transparent 1.2px); background-size: 22px 22px;`; `.wrap { max-width: calc(1240px + 64px); padding: 0 32px; }`. In `site.css` add `.lift` (transition transform and box-shadow 180ms `var(--ease-out)`; `:hover` → `translateY(-2px)` and `box-shadow: inset 0 0 0 1.5px var(--accent), var(--shadow-sm)`; under `prefers-reduced-motion: reduce` no transform).
- [ ] **Step 6:** `npx vitest run` → PASS (fix any style test that pinned the old `.wrap` 1180/24 or `body` `--bg`, updating its expected values).
- [ ] **Step 7:** Commit `feat: shared ground, corner scale, 1240px container and card hover`.

### Task 1.2: Hub helpers

**Files:**
- Create: `src/lib/hub.ts`, `src/lib/hub.test.ts`

**Interfaces:**
- Consumes: `LessonSummary`, `AvailableSummary` (`src/content/registry.ts`); `ProgressData`, `resumePosition` (`src/progress/store.ts`).
- Produces:
  ```ts
  export type LessonStatus = 'not-started' | 'in-progress' | 'done' | 'not-ready';
  export const STATUS_WORDS: Record<LessonStatus, string>; // 'Not started' | 'In progress' | '✓ Done' | 'Not ready yet'
  export function lessonStatus(entry: LessonSummary, data: ProgressData): LessonStatus;
  export type UpNextKind = 'start' | 'next' | 'done-so-far';
  export interface UpNext { entry: AvailableSummary; kind: UpNextKind }
  export function upNext(entries: LessonSummary[], data: ProgressData): UpNext | null; // null only when no lesson is ready
  export type StripState = 'done' | 'current' | 'ready' | '';
  export function stripStates(entries: LessonSummary[], data: ProgressData, current: string | null): StripState[];
  export function stripWords(entries: LessonSummary[], data: ProgressData): string;
  export function lessonHref(entry: AvailableSummary, data: ProgressData): string;
  export function actionLabel(status: LessonStatus): 'Start' | 'Continue' | 'Watch again';
  export const UP_NEXT_KICKER: Record<UpNextKind, string>; // 'Start here' | 'Up next' | '✓ Done so far'
  ```
  Callers pass `stripStates`'s `current` as the up-next key only when its kind is not `'start'`, so a first visit shows no amber square (as the mockups do).

- [ ] **Step 1: Failing tests** in `hub.test.ts`, with entries built from `src/content/test-fixtures.ts` (or small literals) and `emptyProgress()`:
  - `lessonStatus`: unavailable entry → `'not-ready'`; no record → `'not-started'`; `in-progress` → `'in-progress'`; `finished` → `'done'`.
  - `upNext`, empty progress → first ready entry, kind `'start'`.
  - `upNext`, two lessons in progress → the one with the later `lastOpened`, kind `'next'`.
  - `upNext`, one finished, none in progress → first ready not finished, kind `'next'`.
  - `upNext`, every ready lesson finished → the last ready entry in track order, kind `'done-so-far'`.
  - `upNext`, no ready entries → `null`.
  - `stripStates(entries, data, upNextKey)`: finished → `'done'`; the `current` key → `'current'` (unless finished); other available → `'ready'`; unavailable → `''`.
  - `stripWords`: 19 entries, 4 ready, 1 finished → `'1 of 19 lessons done · 4 ready'`; 14 of 14 ready, 0 finished → `'0 of 14 lessons done'`.
  - `lessonHref`: no record → `entry.url`; in progress at 6 → `` `${entry.url}?step=6` ``; in progress at 99 with `maxPosition` 12 → `?step=12`; finished → `entry.url`.
  - `actionLabel`: not-started → Start; in-progress → Continue; done → Watch again.
- [ ] **Step 2:** `npx vitest run src/lib/hub.test.ts` → FAIL (module missing).
- [ ] **Step 3:** Implement in `src/lib/hub.ts`. Pure, no DOM. `lessonHref` uses `resumePosition` clamped to `entry.maxPosition`; position 0 → bare url.
- [ ] **Step 4:** Same command → PASS.
- [ ] **Step 5:** Commit `feat: hub helpers for status, up next, the track strip and links`.

### Task 1.3: Lesson figures in one place

**Files:**
- Create: `src/lib/figures.ts`, `src/lib/figures.test.ts`
- Modify: `src/pages/[track]/index.astro` (use it instead of its local `FIGURES`/`figureFor`)

**Interfaces:**
- Produces: `export function lessonFigure(trackId: string, entry: AvailableSummary): string` — How the Internet Works lessons → `nameTile(unit.name, unit.fullName)` of the lesson's first unit; others → `spot(...)` by slug (`osi-model`→`osi`, `subnetting`→`subnet`, `dhcp`→`dhcp`, `firewalls`→`firewall`); throws `The <key> lesson is ready and has no figure for its card.` otherwise.

- [ ] **Step 1: Failing test**: every ready entry of every track gets a non-empty `<svg` string; an unknown ready Networking slug throws with that message.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Move the code out of the track page into `figures.ts`; the track page imports it. **Step 4:** `npx vitest run` and `npm run build` → PASS.
- [ ] **Step 5:** Commit `refactor: one lessonFigure for every page that shows a lesson's art`.

### Task 1.4: Track strip and parts marker

**Files:**
- Create: `src/components/hub/TrackStrip.tsx`, `src/components/hub/PartsMarker.tsx`, `src/components/hub/hub.css`, `src/components/hub/hub.test.tsx`

**Interfaces:**
- Consumes: `StripState`, `stripStates`, `stripWords` (Task 1.2); `PartMark`, `CardPlace` (`src/lib/track.ts`).
- Produces:
  - `TrackStrip({ states, words }: { states: StripState[]; words: string })` → `<div class="strip">` with `aria-hidden` squares (`<i data-state>`) then `<span class="strip__w">{words}</span>`.
  - `PartsMarker({ parts }: { parts: [PartMark, PartMark, PartMark] })` → `<span class="wlp" role="img" aria-label="In progress, at <Watch|Learn|Practice>">`, three `<span class="wlp__p">` each with a bar `<i>` and its name; `'done'` → `is-done`, `'now'` → `is-now`.
  - `hub.css`: `.strip` (squares 9×12, gap 3, radius 2; done accent fill; current `--here` fill; ready inset 1.5px `--muted`; none inset 1.5px `--line-strong` at 0.6 opacity; words mono 13px muted), `.wlp` (bars 18×5 radius 3; done accent; now `--here` with bold amber label; rest `--line-strong`).

- [ ] **Step 1: Failing tests**: TrackStrip renders one `i` per state with matching `data-state` and the words as text; PartsMarker `['done','now','']` has accessible name `In progress, at Learn` and marks the second part `is-now`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: track strip and Watch/Learn/Practice marker`.

### Task 1.5: Header

**Files:**
- Modify: `src/components/SiteHeader.astro`, `src/layouts/BaseLayout.astro` (only if a prop changes)
- Modify: `e2e/site.spec.ts` (Start learning and header tests), `src/scripts/site-head.test.ts` if it pins markup

**Interfaces:**
- Consumes: `current?: 'tracks' | 'how' | 'about'` (unchanged).
- Produces: header markup with `.pillnav`; links `Tracks` `/tracks`, `How it works` `/#how`, `Questions` `/#faq`, `About` `/about`; Start learning `href="/tracks"`, not rendered (header or menu panel) when `current === 'tracks'`.

- [ ] **Step 1: Update e2e** `on every page Start learning opens the first lesson…` → rename to `Start learning opens /tracks on Home, About and 404, and is absent on Tracks and the track pages; the footer lists How the Internet Works above Networking`, asserting `href="/tracks"` where present and `toHaveCount(0)` on `/tracks`, `/networking`, `/how-the-internet-works`. Add `the header links are Tracks, How it works, Questions and About` asserting those names and hrefs, and no `Practice` link.
- [ ] **Step 2:** `npx playwright test e2e/site.spec.ts -g "Start learning|header links"` → FAIL.
- [ ] **Step 3:** Restyle the header: brand left (no tagline, as today), pill nav centred (4px padding, 999px radius, inset 1px `--line`, links 8px 16px, current pill filled `--card` with `--shadow-sm`; keep `aria-current` logic), theme button + Start learning right; `.wrap` edges; sticky, background `color-mix(in srgb, var(--ground) 82%, transparent)` with blur. Keep the narrow menu working. Home's `overHero` behaviour stays until Part 2 decides it.
- [ ] **Step 4:** Same e2e → PASS; then `npx vitest run`, `npm run build`, `npm run e2e` → PASS.
- [ ] **Step 5:** Commit `feat: pill nav header; Start learning goes to Tracks`.

### Task 1.6: PR

- [ ] `npm run e2e:visual`; look at Home, About, 404, a track page at all four sizes, both themes (pages not yet rebuilt only need to look intact on the new ground).
- [ ] Commit the spec and this plan on this branch (`docs/superpowers/specs/2026-11-09-site-layouts-design.md`, `docs/superpowers/plans/2026-11-09-site-layouts.md`).
- [ ] Open the PR (title `Layouts 1/5: shared shell`), listing what changed and the test results. Wait for the owner's OK.

---

## Part 2 — Home (branch `feat/layouts-home`, from main after Part 1 merges)

### Task 2.1: Rebuild Home

**Files:**
- Modify: `src/pages/index.astro` (rewrite), `src/lib/home.ts` (+ `home.test.ts`) for any new build-time helper
- Delete if nothing else imports them: `src/components/HeroCta.tsx` (+test), `src/components/HeroWeb.astro`, `src/scripts/hero-web.ts` (+test), `src/art/figures/hero-web.ts` and its part of `figures.test.ts`, `src/components/TrackCardProgress.tsx` (+test), `comingSoonTracks` in `src/content/tracks/index.ts` if unused
- Modify: `e2e/site.spec.ts` (Home tests), `e2e/visual.spec.ts` only if it names removed parts

**Interfaces:**
- Consumes: `startLesson()` (`src/lib/start.ts`), `getEntries`, `getLesson`, `trackTotals`, `tracks`, `plannedTracks`, `coverStill`, `spot`, `levelLabel`, `drawFigure`/`fillLabels` (`src/art/scenes`), `slotsFor`/`positionOf` (`src/engine/timeline`) to find the OSI lesson's Learn and Practice positions.
- Produces: sections with ids `#tracks`, `#inside`, `#how`, `#faq` (the header links rely on `#how` and `#faq`).

Sections, in order (copy is exact unless marked *drafted*):
1. **Hero** (centred, three cover stills as side art: `web`, `aplus`, `networking`, decorative, `aria-hidden`): chip `Free visual lessons, no sign-up`; h1 `See how technology <span class="accent">really works.</span>`; sub `Short, visual lessons on networks, the web, security and AI. Watch each idea happen one step at a time, explained in plain words.`; primary button `Learn how the Internet Works` → `startLesson().url`; link `See a lesson` → `#inside`. Header no longer needs `overHero` unless the builder keeps the clear-over-hero effect; either is fine.
2. **Tracks** `#tracks`: h2 `Choose where to <em>start.</em>`, line `Three tracks, in the order to take them.` Three `.lift` cards linking to `/tracks#<id>` (A+ → `/tracks#comptia-a-plus`): cover still, chips (level label; `Start here` on the first; A+ `Not ready yet`), title, first sentence of the track description (A+: its `plannedTracks` blurb), count (`14 lessons`; `4 of 19 lessons ready` from `trackTotals`; A+ `Lessons on the way`), button text `See the lessons →` (A+ `See the track`). No exam tags, no progress.
3. **See a lesson from the inside** `#inside`: h2 `See a lesson from the <em>inside.</em>`, line `One message, from your laptop to a web server, a layer at a time.` A two-page sheet from the OSI Model lesson data, not hard-coded: left page label `Networking Concepts · lesson 1`, title, the lesson's Overview words, and its first three Watch steps (number, title, subtitle); right page the lesson's figure from `drawFigure(lesson.figure)` with the first unit's labels. Link `Open the whole lesson →` to the lesson URL. No OSI badge chip (§6.4 is out of scope).
4. **Watch, learn, then practice** `#how`: h2 `Watch, learn, <em>then practice.</em>`, line `Three parts, always in this order.` Three alternating cards with `spot('watch' | 'learn' | 'practice')`, labels `01`–`03`, titles `Watch it happen`, `Learn what happened`, `Practice what stuck`; texts from the mockup except Practice: `Answer a few questions to see what stuck. Nothing is scored or saved.`; buttons `See a Watch part →` (`?step=1`), `See a Learn part →`, `See a Practice part →` (positions computed from the OSI lesson).
5. **Nothing to sign up for** card: `No account and no email. Your progress is saved in this browser only, and you can clear it any time.` with ticks `Every lesson, free`, `No account, no email`, `Progress stays in this browser`, `Every fact links to its source`.
6. **Questions** `#faq`: four `<details>` (first open), *drafted* for owner approval in the PR: `Where do I start?` / `Do I need an account?` / `Where do the facts come from?` / `Is Practice scored?` (answer: `No. Practice is just for you. Nothing is scored or saved.`).
7. The site footer (from BaseLayout).

- [ ] **Step 1: Rewrite the Home e2e tests** for the new page: replace `says "4 of 19 lessons ready"`, `the first track card…`, `coming-soon track cards are not links`, `each exam tag links…` with: `Home: hero button opens the first lesson; See a lesson goes to #inside`; `Home: three track cards in order, linking to their Tracks panels, with no exam tags`; `Home: the inside sheet shows OSI Model's first three steps and opens the lesson`; `Home: Watch, Learn and Practice buttons open OSI Model at step 1, Learn and Practice` (assert the kicker after navigating); `Home: no Continue or resume link`.
- [ ] **Step 2:** `npx playwright test e2e/site.spec.ts -g "Home"` → FAIL.
- [ ] **Step 3:** Rewrite `index.astro` as above; delete orphaned components with their tests.
- [ ] **Step 4:** Home e2e → PASS; `npx vitest run`, `npm run build`, `npm run e2e` → PASS. Also confirm `Home, Tracks, the track pages and About show no time figure` still passes.
- [ ] **Step 5:** Commit `feat: Home from the adopted mockup`.
- [ ] **Step 6:** Visual check, PR `Layouts 2/5: Home` (note the drafted FAQ for the owner), wait for OK.

---

## Part 3 — Tracks (branch `feat/layouts-tracks`, after Part 1)

### Task 3.1: Panel island

**Files:**
- Create: `src/components/hub/TrackPanelProgress.tsx`, `src/components/hub/TrackPanelProgress.test.tsx`
- Modify: `src/components/hub/hub.css`

**Interfaces:**
- Consumes: `useProgress`, `upNext`, `stripStates`, `stripWords`, `lessonHref`, `UP_NEXT_KICKER`, `TrackStrip` (Part 1).
- Produces: `TrackPanelProgress({ entries, known, trackUrl, children })` where `entries: LessonSummary[]`, `known: Record<string, number>`, `trackUrl: string`, and each ready lesson's figure arrives as a named slot `art<number>` (as `TrackLessons` does today). Renders: the strip; a CTA row (primary button `Start` / `Continue` / `Watch again` → `lessonHref(upNext.entry)`, link `See the whole track` → `trackUrl`); and the right-hand `.next.lift` card (figure, kicker from `UP_NEXT_KICKER`, title, `Lesson 0N · subtitle`) linking to the same href. Before `ready`, or with storage unavailable: the first-visit render (`upNext(entries, emptyProgress())`).

- [ ] **Step 1: Failing tests** (Testing Library, storage stubbed the way `progress-islands.test.tsx` does): first visit → button `Start`, kicker `Start here`, card links to lesson 1; DHCP in progress at 4 → button `Continue`, kicker `Up next`, href `/networking/dhcp?step=4`; storage throwing → first-visit render, no error.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: Tracks panel progress island`.

### Task 3.2: Tracks page

**Files:**
- Modify: `src/pages/tracks.astro` (rewrite), `src/lib/tracks-page.ts` (+ test) — `TrackCard` loses `kind`/`count`/`flag`/`start` if unused and gains `entries: LessonSummary[]`
- Delete if orphaned: `src/components/TrackCardStatus.tsx` (+test)
- Modify: `e2e/site.spec.ts` (Tracks tests and the finishing-DHCP test's Tracks assertions)

Page: head `Pick a <em>track</em>` (64px) and `Each track is a set of short visual lessons, taken in order.`; one `<article class="panel" id="<track id>">` per track (grid `1fr 500px`, gap 40, padding 40/44, `--r-card`, `--card`, `--shadow-sm`, `scroll-margin-top` clears the header); left: h2 (44px) linking to the track page, the description's first sentence, then `TrackPanelProgress`; A+ panel: blurb, chip `Not ready yet`, disabled ghost button `Lessons on the way` (`aria-disabled`, not a link), card `Coming soon` / `Lesson 1 is being written` / `Each lesson will follow the A+ exam objectives.` with `coverStill('aplus')`, no link. Closing line: `New to IT? Start with How the Internet Works, then go deeper with Networking Concepts. Every lesson is Watch, Learn, then Practice.` (both names link to their panels).

- [ ] **Step 1: Rewrite Tracks e2e**: `Tracks: How the Internet Works then Networking then A+, each panel id'd for Home's links`; `Tracks: first visit says Start and Start here, the strip reads "0 of 19 lessons done · 4 ready"`; `Tracks: A+ is Not ready yet with no lesson link`; in the finishing-DHCP test, Tracks shows `1 of 19 lessons done · 4 ready`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Rewrite the page; delete orphans. **Step 4:** All checks → PASS.
- [ ] **Step 5:** Commit `feat: Tracks page, one panel per track`; visual check; PR `Layouts 3/5: Tracks`; wait for OK.

---

## Part 4 — Track page (branch `feat/layouts-track-page`, after Part 1)

### Task 4.1: Split layout support in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`, `src/styles/global.css`

**Interfaces:**
- Produces: BaseLayout prop `footer?: boolean` (default `true`; `false` leaves `<SiteFooter />` to the page) and `split?: boolean` (adds `class="split"` to `<body>`). CSS under `@media (min-width: 1024px) and (min-height: 600px)`: `body.split { height: 100dvh; overflow: hidden; }`, header `flex: none; position: relative`, `main { flex: 1; min-height: 0; }`.

- [ ] **Step 1:** Implement; **Step 2:** `npm run build` → PASS; existing e2e unchanged → PASS. **Step 3:** Commit `feat: BaseLayout can hand the footer to the page and lock the window for a split page`.

### Task 4.2: Side card and route islands

**Files:**
- Create: `src/components/hub/TrackSide.tsx`, `src/components/hub/TrackRoute.tsx`, tests for both
- Modify: `src/components/hub/hub.css`

**Interfaces:**
- Consumes: Part 1 helpers and pieces; `TrackPart`, `ReadyLesson` (with `places: CardPlace[]`), `SoonLesson` from `src/lib/track.ts`.
- Produces:
  - `TrackSide({ entries, known, children })` — strip + the Up next card (figure slot `art<number>`, 128px tall, hidden by `@media (max-height: 820px)`; kicker; title; `Lesson 0N · subtitle`; full-width button `Start`/`Continue`/`Watch again`).
  - `TrackRoute({ parts, entries, known, children })` — per part a stage (square mark, h2 32px with last word in `<em>`, `N lessons`); per lesson a stop with a 44px number circle. Ready: tile (figure 168×124 linking to the lesson, `tabindex=-1`; status from `STATUS_WORDS`; in progress adds `PartsMarker` with `places[position].parts`; h3 26px linking to `lessonHref`; subtitle; one button by `actionLabel`, primary for the up-next lesson, ghost otherwise). Up-next stop: amber circle with ring, tile ring `0 0 0 2px var(--here)` (only once started). Done: accent-filled circle. Soon: outline tile, number, `Not ready yet`, h3 22px muted.

- [ ] **Step 1: Failing tests**: first visit → every ready stop says `Not started` and `Start`, the first ready stop's button is primary, soon stops say `Not ready yet`; OSI in progress at its Learn position → its stop says `In progress`, has marker `In progress, at Learn`, button `Continue` → `?step=<learn position>`, and is the up-next stop; side card matches it; storage throwing → first-visit render.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: track page side card and route`.

### Task 4.3: Track page

**Files:**
- Modify: `src/pages/[track]/index.astro` (rewrite)
- Delete if orphaned: `TrackSidebar`, `TrackLessons`, `TrackHeroCta` (+tests), `NetworkingCover.astro`, `StillCover.astro`, `src/scripts/router-cover.ts` (+test), the track-page part of `page-hero.css`, `presentTags` (+test) if unused, `.t-body .toolbar` from BaseLayout's `<noscript>` rule
- Modify: `e2e/site.spec.ts` (Track page tests, the without-JavaScript chips test, the breadcrumb test, finishing-DHCP and saved-progress tests that read `.toc .pg-title`)

Page: `<BaseLayout split footer={false} current="tracks">`; `<main>` grid `calc(var(--edge) + 360px) 1fr` with `--edge: max(32px, calc((100vw - 1240px) / 2))`; left `<aside class="side">` (padding `28px 0 24px var(--edge)`, own `overflow-y: auto`): breadcrumb `Tracks / <Track>` (one `/`), h1 64px with last word in the accent, the description, `TrackSide`; right `.routebox` (`overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable`; padding `28px var(--edge) 80px 64px`; top fade `mask-image: linear-gradient(to bottom, transparent 0, #000 22px)`): `TrackRoute`, the closing line (`Lessons not ready yet stay on the route, so you can see what is coming.` when some aren't ready, then the cross-link: HIW → `Ready for more? <a>Networking Concepts</a> goes deeper.`; Networking → `New to IT? <a>How the Internet Works</a> is the gentler start.`), then `<SiteFooter />`. Below the media query: normal flow, aside stacked above the route, no fade.

- [ ] **Step 1: Rewrite Track page e2e**: `Track page: Networking lists 19 stops in its parts, 15 Not ready yet, OSI Model first ready with Start`; `Track page: How the Internet Works has six parts and a name tile on each of 14 stops`; `Track page: at 1440×900 the window does not scroll; the route scrolls to its last stop and the side card's button does not move` (record the button's box, scroll the route to the end, compare; `window.scrollY` stays 0); `Track page: at 1280×720 the side card's button is in view`; `Track page: ?for=network-plus lists every lesson, no error` (replaces the `?for=` filter test); `Track page: breadcrumb Tracks goes to /tracks`; keep `the old lesson address forwards to the track`; without JavaScript: `every lesson is listed and the first ready one says Start` (replaces the chips test); progress tests read the strip words (`1 of 19 lessons done · 4 ready`) instead of `.toc .pg-title`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Rewrite the page; delete orphans. **Step 4:** All checks → PASS, including `@phone` and `no page scrolls sideways`.
- [ ] **Step 5:** Commit `feat: track page with a fixed side and a scrolling route`; visual check; PR `Layouts 4/5: Track page`; wait for OK.

---

## Part 5 — Lesson frame (branch `feat/layouts-lesson-frame`, after Part 1)

### Task 5.1: Frame, top bar and theme button

**Files:**
- Modify: `src/lesson/console.css`, `src/lesson/TopBar.tsx` (+ `TopBar` tests if any), `src/lesson/LessonConsole.tsx` (props it passes TopBar), `src/lesson/LessonConsole.test.tsx`, `src/lesson/LessonConsole.storage.test.tsx`, `src/components/ThemeToggle.css` / `site.css` (`.icon-btn` reachable from the lesson page), `src/layouts/BaseLayout.astro` (`<noscript>` drops `.topbar__seg`)

**Interfaces:**
- Produces: `TopBarProps` without `entries`, `currentKey`, `progress` (the strip leaves, §6.2). The bar: brand (logo + `TechConcepts`, no `<small>`), crumb `<a href="/tracks">Tracks</a> / <a href={trackUrl}>{trackTitle}</a> / <h1>{title}</h1> <em>Lesson N of M</em>`, step segments and place label (unchanged), OSI block (unchanged), `<ThemeToggle />`.

- [ ] **Step 1: Update tests**: `the Light/Dark switch…` → `the theme button switches and saves the theme` (click `getByRole('button', { name: /theme/i })` per ThemeToggle's label; `data-theme` flips; storage holds it); remove the `1 of 19 complete` assertion and add `the top bar has no track progress` (`queryByText(/lessons done|complete/)` is null); add `the breadcrumb is Tracks / <track> / <lesson>` (links `/tracks` and the track URL). In the storage test, use the theme button.
- [ ] **Step 2:** `npx vitest run src/lesson` → FAIL.
- [ ] **Step 3:** Implement. CSS: `.console` padding and gap 12px, background `var(--ground)` with the dot grid; `.console__panel` radius `var(--r-tile)`, border `var(--line)`, `box-shadow: var(--shadow-sm)`; `.cbtn` radius `var(--r-btn)`; segmented switches 6px outer, 4px inner; crumb separator `/` with 9px side margins at 0.55 opacity; remove `.topbar__progress`/`.topbar__places`/`.topbar__seg` rules.
- [ ] **Step 4:** `npx vitest run` → PASS; `npm run e2e` → PASS (lesson `fits one screen`, `never scrolls`, `outline reaches every place` unchanged).
- [ ] **Step 5:** Commit `feat: lesson console in the shared frame; track strip moves to the track page`.

### Task 5.2: Up next card

**Files:**
- Modify: `src/pages/[track]/[lesson].astro` (pass `nextFigure: string | null` = `next ? lessonFigure(track.id, next) : null`), `src/lesson/LessonConsole.tsx` and `src/lesson/Explanation.tsx` (thread `nextFigure` to `EndRow`), `src/lesson/console.css`, `src/lesson/Explanation.test.tsx`, `src/lesson/LessonConsole.test.tsx`

**Interfaces:**
- Consumes: `lessonFigure` (Task 1.3).
- Produces: `ExplanationProps.nextFigure: string | null`. `EndRow` with `next !== null`: `<p>That’s the whole lesson.</p>` then `<a class="upnext" href={next.url}>` with the figure (`aria-hidden`, 104×76, `--r-opt`), `<span class="upnext__k">Up next</span>`, `<b>{next.title}</b>`, `<span>Lesson 0N · {next.subtitle}</span>`; `.lift`-style hover (inset accent ring, translateY(-2px), no lift under reduced motion). The next-unit and last-lesson endings keep their words.

- [ ] **Step 1: Update tests**: `getByRole('link', { name: 'Go to Firewalls' })` → `getByRole('link', { name: /^Up next Firewalls/ })` with the same href; add `the Up next card shows the next lesson's number and subtitle`; the next-unit button (`Go to Beta`) is unchanged.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** All checks → PASS.
- [ ] **Step 5:** Commit `feat: Up next card at the end of a lesson`; visual check (every ready lesson at Overview, step 3, Learn, Practice); PR `Layouts 5/5: Lesson frame`; wait for OK.
