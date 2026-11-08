# How the Internet Works Track Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn How the Internet Works from lesson 1 of Networking into its own 14-lesson concept track. Visitors keep their saved place, the old address forwards to the new track, and Networking goes back to 19 lessons.

**Architecture:**
- **Content:** each protocol section becomes a one-section legacy lesson (`what-is-<protocol>`), listed by a new track file. The old lesson and its folder go.
- **Saved progress:** a small split step inside `loadProgress` turns an old `how-the-internet-works` record into the 14 new records. It uses a table of section sizes, held to the real lessons by a test.
- **Pages:**
  - The track page gains still hero art and name tiles for lesson cards.
  - The Tracks page gains a "Start here" flag.
  - Home, the header and the footer stop assuming the first track is Networking.
  - An Astro redirect forwards the old address.

**Tech Stack:** Astro 7 (static), React 19 islands, TypeScript, zod, Vitest (jsdom for islands), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-08-how-the-internet-works-track-design.md`, which builds on `docs/superpowers/specs/2026-11-07-techconcepts-direction.md` (§4.5, §10 task 6).

## Global Constraints

- **Branch and merging:**
  - Work on branch `feat/internet-track` (cut from `feat/tracks-page`).
  - Never push to `main`, and never merge, without the owner's explicit OK.
- **Checks:**
  - Before saying anything is done, run `npx vitest run`, `npm run build` (astro check plus budgets) and `npm run e2e`, and report failures as they are.
  - `npm run build` fails from Task 1 until Task 5, because Home and the track page still expect the old lesson. Each task's own gate is the vitest suite. The build and e2e gate Task 6.
- **Files and commits:**
  - Never write absolute paths containing the project folder's name into tracked files.
  - Stage named paths only, never `git add -A`.
  - `.claude/launch.json` and `Claude outputs/` stay out of every commit.
  - Never use bare `git stash`.
  - End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Lesson text:** keep every word, except the six edits in Task 1 Step 5 and the Networking lesson numbers.
- **Copy:**
  - Beginner voice; exam detail stays in Go deeper.
  - Exact copy for this PR:
    - Track description: `Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each. Start here if you are new to IT: Networking Concepts goes deeper.`
    - Part titles: `Loading a web page`, `Getting the data there`, `Behind the scenes`, `Email`, `Files and remote control`, `The seal`.
    - Flag: `Start here`.
- **Design:**
  - Check visuals at desktop widths only: 1280×800 and 1440×900, both themes.
  - All art stays original. The track page's hero reuses the approved `web` cover.
- **Out of scope:**
  - Home's wider changes (§10 task 7).
  - The audit of the 14 lessons and their "Go deeper: Networking ›" links.
  - Exam tags for the 14 lessons.
  - Removing the console's support for many-section lessons.

## Review Focus

1. **A visitor partway through the old lesson** must land exactly where the split rule says. That includes a furthest step on a section's Overview, on a section's last step, and past the end. Pinned by Task 2's tests and Task 6's e2e test.
2. **An old record that turns up after the split** (a tab still running the old site writes `how-the-internet-works` again) must merge into the new records. It must not undo finished lessons. Pinned in Task 2.
3. **A last lesson that names the old lesson with no record** (opened at its Overview only) must point at `what-is-http` in the new track, not vanish. Pinned in Task 2.
4. **The old address with `?step=N` or a trailing slash** must still land on `/how-the-internet-works`. Pinned in Task 6.
5. **A returning visitor whose last lesson is a tour lesson** must get Home's resume line and Continue for that lesson, linking into `/how-the-internet-works/…`. Pinned in Task 6.

---

### Task 1: The track, its 14 lessons, and Networking at 19

**Files:**
- Create: `src/content/tracks/how-the-internet-works.ts`
- Create: `src/content/tracks/how-the-internet-works.test.ts`. It is moved from `src/content/lessons/how-the-internet-works.test.ts` with `git mv`, then reworked.
- Create: `src/content/helpers/tour.ts`
- Move (`git mv`, then edit): `src/content/lessons/how-the-internet-works/<p>.ts` → `src/content/lessons/what-is-<p>.ts`, for the 14 protocols.
- Delete: `src/content/lessons/how-the-internet-works.ts`
- Modify:
  - `src/content/tracks/index.ts`
  - `src/content/tracks/networking.ts`
  - `src/content/legacy.ts` (`LEGACY_LESSONS` and its comment)
  - `src/content/registry.ts` (comments that name lesson 1's folder)
  - `src/lib/tracks-page.ts` (`TRACK_COVERS` only)
- Modify lesson text: `src/content/lessons/dhcp.ts`, `firewalls.ts`, `subnetting.ts` (lesson numbers, and "of 20" comments).
- Modify tests:
  - `src/content/legacy.test.ts`, `src/content/registry.test.ts`
  - `src/content/lessons/dhcp.test.ts`, `firewalls.test.ts`, `subnetting.test.ts`
  - `src/lib/track.test.ts`, `src/lib/home.test.ts`, `src/lib/tracks-page.test.ts`
  - `src/lesson/Explanation.test.tsx`, `Outline.test.tsx`, `LessonConsole.test.tsx`, `no-script.test.ts`

**Interfaces:**
- Produces:
  - `internetTrack: Track` (id `how-the-internet-works`), exported from `src/content/tracks/index.ts`.
  - `tracks` is now `[internetTrack, networkingTrack]`.
  - `tourLesson(unit: LegacyUnitInput): LegacyLessonInput` in `src/content/helpers/tour.ts`.
  - The 14 slugs are `what-is-http`, `what-is-https`, `what-is-tcp`, `what-is-udp`, `what-is-ip`, `what-is-dns`, `what-is-dhcp`, `what-is-icmp`, `what-is-smtp`, `what-is-pop3`, `what-is-imap`, `what-is-ftp`, `what-is-ssh` and `what-is-tls`.
  - `TRACK_COVERS` gains `'how-the-internet-works': 'web'`.

- [ ] **Step 1: Write the failing track test.** In `src/content/tracks/how-the-internet-works.test.ts` (moved from the lesson test), replace the old file's first five lesson-level tests with these:
  - `'the track: How the Internet Works, a beginner concept track, first in the list, with Networking’s limits'`:
    - `tracks.map((t) => t.id)` equals `['how-the-internet-works', 'networking']`.
    - `internetTrack` matches `{ type: 'concept', level: 'beginner', title: 'How the Internet Works', description: <the Global Constraints copy> }`.
    - `internetTrack.limits` equals `networkingTrack.limits`.
  - `'six parts in teaching order'`: `internetTrack.parts.map((p) => [p.title, p.lessons.map((l) => l.title)])` equals:
    - `['Loading a web page', ['HTTP', 'HTTPS']]`
    - `['Getting the data there', ['TCP', 'UDP', 'IP']]`
    - `['Behind the scenes', ['DNS', 'DHCP', 'ICMP']]`
    - `['Email', ['SMTP', 'POP3', 'IMAP']]`
    - `['Files and remote control', ['FTP', 'SSH']]`
    - `['The seal', ['TLS/SSL']]`
  - `'each lesson is one protocol, its fields taken from the section'`:
    - For every entry of `getEntries('how-the-internet-works')`: its slug is `what-is-${unit.id}`, and it is `available`.
    - Its lesson has exactly one unit, with `title === unit.name`, `subtitle === unit.purpose`, `summary === unit.overview.hook`, `certTags: []`, `level: 'beginner'` and `figure: 'net-map'`.
    - Its `url` is `/how-the-internet-works/what-is-${unit.id}`, and its `canonical` is the same.
  - `'the old lesson is gone, and no folder of parts is left'`:
    - `getLesson('how-the-internet-works')` is undefined.
    - `getEntries('networking').map((e) => e.slug)` does not contain it.
    - `import.meta.glob('../lessons/*/*.ts')` has no keys.
  - `'78 Watch steps in all, 28 questions'` and `'each protocol validates, has 5–6 steps and 2 questions'`: keep them as they are, run over the stitched lesson (Step 3).

- [ ] **Step 2: Run it and watch it fail.**
  - Run: `npx vitest run src/content/tracks/how-the-internet-works.test.ts`
  - Expected: FAIL. The import of `internetTrack` doesn't resolve, or `tracks` has one track.

- [ ] **Step 3: Keep the rest of the moved test file working.**
  - At the top of the file, build the lesson the map tests walk from the 14 lessons, in track order:
    - `const TOUR = getEntries('how-the-internet-works').map((e) => getLesson(e.slug)!)`
    - `const internet: Lesson = { ...TOUR[0]!, slug: 'tour', title: 'How the Internet Works', units: TOUR.flatMap((l) => l.units) }`
  - Drop `UNIT_ORDER`. The track's order replaces it: `TOUR.map((l) => l.units[0]!.id)` must equal the old order, `['http', 'https', 'tcp', 'udp', 'ip', 'dns', 'dhcp', 'icmp', 'smtp', 'pop3', 'imap', 'ftp', 'ssh', 'tls']`.
  - Rewrite the cross-reference test, `'each lesson title names a lesson, and no sentence points at a part of a lesson'`:
    - `lessonNumbers(internet)` equals `[]`.
    - `[...lessonTitles(internet)].sort()` equals `['DNS', 'DNS', 'Subnetting', 'TCP', 'TLS/SSL', 'TLS/SSL']`.
    - Every title except `Subnetting` is a title in `getEntries('how-the-internet-works')`, and `Subnetting` is one in `getEntries('networking')`.
    - No text matches `/\bThe \w+ part\b|this lesson/`.
  - Rewrite the DHCP-overlap test:
    - `getLesson('what-is-dhcp')` and `getLesson('dhcp')` both validate with `checkStructure`, and both units have id `dhcp`.
    - The DHCP tour lesson's hook ends with `Networking Concepts has a DHCP lesson that goes further.`

- [ ] **Step 4: Write the track and the lessons.**
  - `tourLesson(unit)` returns `{ slug: \`what-is-${unit.id}\`, title: unit.name, subtitle: unit.purpose, level: 'beginner', certTags: [], summary: unit.overview.hook, figure: 'net-map', units: [unit] }`.
  - Each `what-is-<p>.ts` keeps its unit constant and its file comment, and ends `export default defineLegacyLesson(tourLesson(<p>))`.
  - In each file comment, update "protocol N of How the Internet Works’ 14" to name its lesson in the new track. Rewrite comment mentions of "lesson 10" to name Networking's DHCP lesson.
  - **`LEGACY_LESSONS`:** replace `'how-the-internet-works'` with the 14 slugs.
    - Its comment, and `checkLegacyList`'s, gain one line: "A legacy lesson split into parts stays legacy until it is migrated."
    - Ruling: the list grows once here, because the split keeps today's uncited text (owner: split now, audit later).
  - **`internetTrack`:** id `how-the-internet-works`, type `concept`, level `beginner`, title and description from the Global Constraints, `limits` the same object values as Networking's, and the six parts with lesson slugs and titles.
  - **Part ids:** `web-page`, `getting-there`, `behind-the-scenes`, `email`, `files-remote`, `the-seal`.
  - **Networking:** remove `how-the-internet-works` from Networking's first part, and change its file comment to "19 lessons".
  - **`TRACK_COVERS`:** add `'how-the-internet-works': 'web'`.

- [ ] **Step 5: Make the six text edits** (Global Constraints). These are exact replacements:
  - `what-is-dhcp.ts`, in the hook and in Learn's Go deeper: `The DHCP lesson, lesson 10, goes further.` → `Networking Concepts has a DHCP lesson that goes further.`
  - `what-is-http.ts`:
    - `The DNS part of this lesson shows how the resolver finds it.` → `The DNS lesson shows how the resolver finds it.`
    - `The TCP part looks at it closely` → `The TCP lesson looks at it closely`
  - `what-is-https.ts`:
    - `The DNS part of this lesson shows how the resolver finds the answer.` → `The DNS lesson shows how the resolver finds the answer.`
    - `The TLS part of this lesson takes the handshake one message at a time.` → `The TLS/SSL lesson takes the handshake one message at a time.`
  - `what-is-smtp.ts`: `The TLS part covers the handshake` → `The TLS/SSL lesson covers the handshake`

- [ ] **Step 6: Run the track test and watch it pass.**
  - Run: `npx vitest run src/content/tracks/how-the-internet-works.test.ts`
  - Expected: PASS. That includes the map sweep (about 8 s).

- [ ] **Step 7: Renumber Networking's lesson text.**
  - Run `npx vitest run src/content/lessons`. Expected: the DHCP, Subnetting and Firewalls tests fail on `misnamedLessons` and on their `lessonNumbers` expectations, because every number after lesson 1 moved down by one.
  - Fix the tests first: each expected `lessonNumbers` value drops by one.
  - Then fix the text: every `lesson N` and `lessons N and M` in those three lessons drops by one. For example, Firewalls' `(lesson 12)` becomes `(lesson 11)` and `(lesson 20)` becomes `(lesson 19)`, and DHCP's `(lessons 8 and 14)` becomes `(lessons 7 and 13)`.
  - In comments, "lesson 10 of 20" becomes "lesson 9 of 19", and the same for the others.
  - Run again. Expected: PASS.

- [ ] **Step 8: Bring the rest of the suite along.**
  - Run `npx vitest run`, and fix each failure by what it tests:
  - **The legacy list:** `legacy.test.ts` expects the sorted list `['dhcp', 'firewalls', 'subnetting', ...the 14 slugs]`.
  - **`registry.test.ts`:**
    - Networking's planned slugs lose `how-the-internet-works`.
    - Lesson numbers become `subnetting 7, dhcp 9, firewalls 16`.
    - The two-unit `buildEntries` test lists its fixture in `internetTrack` as `what-is-http` titled `HTTP`. Expected: number 1, `url` `/how-the-internet-works/what-is-http`.
    - The legacy-lessons loop reads the 17 legacy slugs.
  - **Console tests:** `Explanation`, `Outline` and `LessonConsole` keep their many-unit fixtures, but give them slug `what-is-http` and title `HTTP`. Each takes that fixture's entries from `buildEntries(internetTrack, { 'what-is-http': TWO })`, and DHCP's and Firewalls' from `buildEntries(networkingTrack, …)`. Each render gets the entries of the lesson's own track.
    - Expectations about DHCP's place follow Networking's numbers: `Lesson 9 of 19` and `1 of 19 complete`.
    - The URLs in `history.replaceState` become `/how-the-internet-works/what-is-http?step=…`.
  - **`no-script.test.ts`:** `test.each(['dhcp', 'what-is-http'])`.
  - **`track.test.ts`:**
    - The Networking list has 19 entries, numbered `01`–`19`.
    - The many-unit card cases use `liftedFixture(makeTwoUnitLesson(...))` in place of the real lesson.
    - The error-message case names a slug Networking still lists.
  - **`home.test.ts`:** `resumePlaces` for a many-unit lesson uses `liftedFixture(makeTwoUnitLesson())` (`places[1]` names its first unit). A one-unit tour lesson's places say `Watch`, like DHCP's.
  - **`tracks-page.test.ts`:**
    - The order is `['how-the-internet-works', 'networking', 'comptia-a-plus']`.
    - Networking's card reads `count: '19 lessons · 3 ready'`, `planned: 19`, with 3 known lessons.
    - A new expectation for the first card: `{ href: '/how-the-internet-works', kind: 'Concept track · Beginner', count: '14 lessons · 14 ready', cover: 'web', planned: 14 }`, and its blurb is the description's first sentence.
  - **Leave unchanged:** fixture data that only uses the old slug as a name, in `HeroCta.test.tsx`, `TrackHeroCta.test.tsx`, `TrackCardStatus.test.tsx`, `registry.test.ts`'s path and folder cases, and `store.test.ts`'s v1 cases.
  - Expected: `npx vitest run` passes. Then rerun `grep -rn "how-the-internet-works" src` and check that every remaining hit is the track id, a fixture name, or a comment that is still true.

- [ ] **Step 9: Commit.**
  - Stage the moved and edited files by name, then commit: `feat: How the Internet Works is its own track of 14 lessons; Networking has 19`.

### Task 2: Saved progress follows the split

**Files:**
- Create: `src/progress/internet-split.ts`, `src/progress/internet-split.test.ts`
- Modify: `src/progress/store.ts` (`loadProgress`), `src/progress/store.test.ts` (the `loadProgress` keys case)

**Interfaces:**
- Consumes: `ProgressData`, `LessonProgress` and `mergeRecords` from `store.ts`. The 14 slugs are from Task 1.
- Produces:
  - `INTERNET_SPLIT: readonly (readonly [slug: string, positions: number])[]`, the 14 lessons in track order with their position counts: `8, 9, 9, 8, 8, 8, 9, 9, 9, 8, 8, 9, 9, 9`, 120 in all.
  - `OLD_INTERNET_KEY = 'how-the-internet-works'`.
  - `INTERNET_TRACK = 'how-the-internet-works'`.
  - `splitInternet(d: ProgressData): ProgressData`.

- [ ] **Step 1: Write the failing tests** in `internet-split.test.ts`. Use `rec(status, furthest, at)` records as `store.test.ts` does.
  - `'the table is the track’s lessons and their sizes'`: `INTERNET_SPLIT` equals `getEntries('how-the-internet-works').map((e) => [e.slug, e.maxPosition + 1])`, and the sizes add up to 120.
  - `'data without the old lesson is returned as it is'`: `toBe` the same object.
  - `'a finished old lesson finishes all 14, at each one’s last step, keeping its time'`.
  - `'partway: protocols before the furthest step are finished, the one holding it is in progress at the same step, later ones have no record'`:
    - Old in-progress at 30 gives HTTP, HTTPS and TCP finished at 7, 8 and 8.
    - `what-is-udp` is in progress at 4.
    - No IP record, and the old key is gone.
  - `'a furthest step on a protocol’s Overview gives it no record'`: 17 (TCP's Overview) gives HTTP and HTTPS finished and no TCP record.
  - `'a furthest step on a protocol’s last step finishes it'`: 25 gives TCP finished at 8.
  - `'a furthest step past the end counts as the last step'`: 500 gives all 14 finished.
  - `'the last lesson follows the furthest step, into the new track'`:
    - `lastLesson` was the old key with `lastTrack: 'networking'`, and old furthest is 30.
    - That gives `lastLesson: 'what-is-udp'` and `lastTrack: 'how-the-internet-works'`.
  - `'a last lesson that names the old lesson with no record points at HTTP'`: gives `what-is-http` and `how-the-internet-works`.
  - `'a last lesson elsewhere is left alone'`: `dhcp`/`networking` stay.
  - `'an old record that turns up again merges into the new ones; finished stays finished'`:
    - Data holds `what-is-http` finished, `what-is-https` in progress at 2, and the old key in progress at 10.
    - Result: HTTP finished, and HTTPS in progress at `max(2, 10 - 8)`, which is 2.
    - Nothing from the old key survives.

- [ ] **Step 2: Run them and watch them fail.**
  - Run: `npx vitest run src/progress/internet-split.test.ts`
  - Expected: FAIL. `./internet-split` doesn't resolve.

- [ ] **Step 3: Implement `splitInternet`** as the spec's rule says.
  - Find the protocol whose range holds `min(furthest, 119)`. Ranges start at the running sum of `positions`.
  - Merge each made record into any record already under that slug with `mergeRecords`.
  - Delete the old key with an own-key check, never `in`.
  - It imports no lesson data, so the browser bundle stays small.

- [ ] **Step 4: Wire it in, behind a failing test first.**
  - Change `store.test.ts`'s `loadProgress` keys case. A v1 `networking/how-the-internet-works` record at 23 now loads as `what-is-http`, `what-is-https` (finished) and `what-is-tcp` (in progress at 6), beside `dhcp`, `osi-model` and `subnetting`.
  - Run it. Expected: FAIL.
  - Then make `loadProgress` return `splitInternet(combineProgress(…))`. Expected: PASS.

- [ ] **Step 5: Run the suite.**
  - Run: `npx vitest run`
  - Expected: PASS.

- [ ] **Step 6: Commit.**
  - Commit: `feat: saved progress in the old How the Internet Works lesson carries over to its 14 lessons`

### Task 3: The track page draws any track

**Files:**
- Create: `src/art/figures/name-tile.ts`, `src/art/figures/name-tile.test.ts`, `src/components/StillCover.astro`
- Modify: `src/pages/[track]/index.astro`, `src/components/TrackLessons.tsx` (an empty meta list is not drawn), `src/components/TrackLessons.test.tsx`

**Interfaces:**
- Consumes: `TRACK_COVERS` (Task 1) and `cover(id)` from `covers.ts`.
- Produces: `nameTile(name: string, fullName: string): string`, an SVG string.

- [ ] **Step 1: Write the failing tile tests** in `name-tile.test.ts`:
  - `'draws the name, a rule in our blue and the full name, labelled for screen readers by the full name'`:
    - `<svg class="name-tile" viewBox="0 0 528 372" role="img" aria-label="HyperText Transfer Protocol">` with no `id` attribute anywhere.
    - A `text.nt-name` reading `HTTP` with `font-size="92"`.
    - A `rect.nt-rule`.
    - One `text.nt-full` line reading `HyperText Transfer Protocol`.
  - `'a name longer than five characters is set smaller'`: `TLS/SSL` gets `font-size="74"`.
  - `'a full name over 30 characters takes two lines, broken at the space nearest the middle'`:
    - `Dynamic Host Configuration Protocol` becomes `Dynamic Host` / `Configuration Protocol`.
    - `Transport Layer Security (SSL is its old name)` becomes `Transport Layer Security` / `(SSL is its old name)`.
  - `'text is escaped'`: `A&B <x>` comes out as `A&amp;B &lt;x&gt;`.

- [ ] **Step 2: Run and watch them fail.**
  - Run: `npx vitest run src/art/figures/name-tile.test.ts`
  - Expected: FAIL.

- [ ] **Step 3: Implement `nameTile`.**
  - Name: at y 186.
  - Rule: `x 214, y 212, w 100, h 5, rx 2.5`.
  - Full name: one line at y 262, or two at 254 and 282.
  - The look lives in the track page's CSS:
    - `.nt-name`: 700 weight, `var(--mono)`, `var(--ink-strong)`, letter-spacing -0.02em.
    - `.nt-rule`: `var(--accent)`.
    - `.nt-full`: 500 weight at 22px, `var(--mono)`, `var(--muted)`, uppercase, letter-spacing 0.04em.
    - The dot grid is a CSS background on `.l-art:has(.name-tile)`: `radial-gradient(var(--dot) 1.4px, transparent 1.6px)` at `11px 11px`. So the SVG needs no ids.
  - Run the tests. Expected: PASS.

- [ ] **Step 4: Write the failing card test.**
  - In `TrackLessons.test.tsx`: `'a ready lesson with nothing for its meta line draws no list'`. A card whose `meta` is `[]` has no `ul.l-meta`.
  - Run it. Expected: FAIL.
  - Render the list only when `meta.length > 0`. Expected: PASS.

- [ ] **Step 5: Wire the page.**
  - `StillCover.astro` takes `{ label: string; title: string; cover: CoverId }`. It renders NetworkingCover's `figure.cover > .plate`, with the `c-fig` and `c-title` corners and `.stage` set to `cover(id)`, and no script.
  - In `[track]/index.astro`:
    - Networking keeps `NetworkingCover`.
    - Every other track uses `StillCover`, with `TRACK_COVERS[track.id]` and `title={track.title}`. If a track has no entry, the page throws `The <id> track has no cover for its page.`
    - Lesson cards in the `how-the-internet-works` track get `nameTile(unit.name, unit.fullName)` from their one unit. Every other track keeps `FIGURES` and its throw.
    - Drop the `'how-the-internet-works': internetThumb` entry and the `internetThumb` import. Ruling: `internet-thumb.ts` stays, because it shares code with Home's hero and has its own pinned test.
  - Add the name tile CSS beside `.l-art`.

- [ ] **Step 6: Run the suite.**
  - Run: `npx vitest run`
  - Expected: PASS.

- [ ] **Step 7: Commit.**
  - Commit: `feat: a track page for How the Internet Works: the web cover, and a name tile on each lesson card`

### Task 4: "Start here" on the Tracks page

**Files:**
- Modify: `src/lib/tracks-page.ts`, `src/lib/tracks-page.test.ts`, `src/pages/tracks.astro`

**Interfaces:**
- Produces: `TrackCard.start: boolean`. It is true only for the first track in `tracks`.

- [ ] **Step 1: Write the failing test.**
  - `'the first track is where to start'`: `trackCards().map((c) => c.start)` equals `[true, false, false]`.
  - Run: `npx vitest run src/lib/tracks-page.test.ts`
  - Expected: FAIL.

- [ ] **Step 2: Implement it.**
  - Add `start` to `TrackCard`: `true` for index 0 of the ready list, `false` everywhere else.
  - In `tracks.astro`, render `{c.start && <span class="flag start">Start here</span>}`.
  - CSS for `.tcard .flag.start`: `border-color: var(--accent)`, `background: var(--accent)`, `color: var(--accent-ink)`.
  - Run the test. Expected: PASS.

- [ ] **Step 3: Commit.**
  - Commit: `feat: the Tracks page marks How the Internet Works as the place to start`

### Task 5: Home, the header, the footer and the old address

**Files:**
- Create: `src/lib/start.ts`, `src/lib/start.test.ts`
- Modify: `src/pages/index.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `astro.config.mjs`

**Interfaces:**
- Produces: `startLesson(): AvailableSummary`, the first ready lesson of the first track. It throws if that track has none.

- [ ] **Step 1: Write the failing test.**
  - `'the site starts at the first lesson of the first track'`: `startLesson().url` is `/how-the-internet-works/what-is-http`, and its title is `HTTP`.
  - Run: `npx vitest run src/lib/start.test.ts`
  - Expected: FAIL.

- [ ] **Step 2: Implement `startLesson`.**
  - Expected: PASS.

- [ ] **Step 3: Home** (only what the split needs).
  - Look the tracks up by id with `getTrack`, throwing if either is missing:
    - `networking` feeds the exams strip, the DHCP log sample and the Networking card.
    - `how-the-internet-works` feeds its own card.
  - **Hero:** `heroStart = { href: startLesson().url, label: 'Learn how the Internet Works' }`.
  - **Resume:** `resumeLessons` and `known` cover the ready lessons of both tracks.
  - **The How the Internet Works card:**
    - `href="/how-the-internet-works"`, the `web` cover, kind `Networking`, and the badge from the track's level.
    - Title: the track's title. Blurb: `firstSentence(internetTrack.description)`.
    - Foot: `<TrackCardProgress client:load known={internetKnown} totals={internetTotals} />`.
    - Drop `internetMeta` and `readyEntry('how-the-internet-works')`.
  - Keep the rest of Home's copy. §10 task 7 redoes it, and PR #5 edits the hero, so keep hero edits to these lines.

- [ ] **Step 4: Header and footer.**
  - Both `Start learning` links take `startLesson().url`.
  - The footer's Learn list gains `<li><a href="/how-the-internet-works">How the Internet Works</a></li>` above Networking Concepts.

- [ ] **Step 5: The old address.**
  - Add `redirects: { '/networking/how-the-internet-works': '/how-the-internet-works' }` to `astro.config.mjs`.

- [ ] **Step 6: Build.**
  - Run: `npm run build`
  - Expected: astro check reports 0 errors and 0 warnings, and every page is within budget. Note the page count and the largest tour lesson's HTML and JS.
  - The redirect page (`/networking/how-the-internet-works/`) counts as a lesson page with no JS.

- [ ] **Step 7: Run the suite.**
  - Run `npx vitest run`, then commit: `feat: Home, the header and the footer lead to How the Internet Works; its old address forwards to the track`

### Task 6: End-to-end tests, then the full checks

**Files:**
- Modify: `e2e/global-setup.ts`, `e2e/support.ts`, `e2e/site.spec.ts`

- [ ] **Step 1: Find the lessons from every track.**
  - `global-setup.ts` opens `/tracks` and follows each ready card's link. It collects every ready lesson card from each track page.
  - Its error and `support.ts`'s message say "the track pages", not `/networking`.
  - `SITE_PAGES` gains `{ name: 'track-internet', path: '/how-the-internet-works' }`.

- [ ] **Step 2: Write the new and changed e2e tests** (they fail before Step 1's and Tasks 1–5's changes, which are in place by now). Check each against the built site:
  - **Home:**
    - Hero start is `/how-the-internet-works/what-is-http`.
    - The first track card links to `/how-the-internet-works`, reads `14 of 14 lessons ready` and `Open track`.
    - Networking reads `3 of 19 lessons ready`.
    - After finishing DHCP: `1 of 19 done, 0 in progress`, and the Networking track page shows `1 of 19 complete`.
  - **Tracks page:**
    - The cards in order are How the Internet Works, Networking Concepts and CompTIA A+.
    - Only the first has `.flag.start` reading `Start here`.
    - The counts are `14 lessons · 14 ready` and `19 lessons · 3 ready`.
  - **`'How the Internet Works: Track 1, the web cover, six parts, a name tile on each of 14 lessons'`:**
    - The eyebrow reads `Track 1 · Beginner`.
    - `.cover .c-title` reads `How the Internet Works`, and the cover has no `[data-router-cover]`.
    - The sidebar parts are the six titles.
    - There are 14 `.lesson` cards, each with one `.l-art svg.name-tile`, and none with `ul.l-meta`.
  - **`'Networking is Track 2 and has 19 lessons'`.**
  - **`'the old lesson address forwards to the track'`:** each of these ends at `/how-the-internet-works`:
    - `/networking/how-the-internet-works`
    - `/networking/how-the-internet-works?step=7`
    - `/networking/how-the-internet-works/`
  - **`'a visitor partway through the old lesson keeps their place'`:**
    - Seed `techconcepts:v2` with the old record in progress at 30, `lastLesson: 'how-the-internet-works'` and `lastTrack: 'networking'`.
    - On `/how-the-internet-works`: HTTP, HTTPS and TCP show `Finished`, UDP shows `In progress`, IP shows no badge, and the progress reads `3 of 14 complete`.
    - On `/tracks`: the How the Internet Works card has the `Last opened` tab and `3 of 14 done`.
    - On Home: the resume line names UDP, and its Continue opens `/how-the-internet-works/what-is-udp?step=4`.
  - **Header and footer:** on every `SITE_PAGES` page, `Start learning` opens `/how-the-internet-works/what-is-http` and the footer links to `/how-the-internet-works`.

- [ ] **Step 3: Run the full checks.**
  - `npx vitest run`, `npm run build` and `npm run e2e`, each with output saved to a file. Read the tail of each.
  - Expected: all pass. The lesson specs now run for 17 lessons. Report the e2e time beside the last run's 5.5 to 6 minutes.

- [ ] **Step 4: Look at it.**
  - At 1280×800 and 1440×900, in both themes, check:
    - `/how-the-internet-works`: hero, parts, name tiles, and the two-line TLS/SSL and DHCP tiles.
    - `/tracks`: the Start here flag, and the Last opened tab after the seed.
    - `/networking`: Track 2, Part 1 all coming soon.
    - Home's two track cards.
  - Fix anything that reads wrong, commit, and rerun the checks you touched.

- [ ] **Step 5: Commit.**
  - Commit: `test: e2e for the How the Internet Works track, its old address and its carried-over progress`
