# S20: the Tracks page, facts (2026-11-16)

Scout's report (Haiku 5.5), read-only, in the worktree `elated-haibt-d4bd88` (branch `claude/elated-haibt-d4bd88`, at `revamp` 1cba05e). Paths are repo-relative. Every fact is path:line from the files as they stand. Nothing was edited or served. The one command run was `npm run build` (Part 5).

## Part 1: the page's code (Q1)

**Frontmatter and imports.** `src/pages/tracks.astro:1-23`. Imports: `coverStill` and `CoverId` from `src/art/figures/covers` (`tracks.astro:7`), `cropViewBox` from `src/art/ids` (`:8`), `STATUS_WORDS` from `src/lib/hub` (`:9`), `trackCards` from `src/lib/tracks-page` (`:10`), `BaseLayout` (`:11`), `TrackPanelProgress` from `src/components/hub/TrackPanelProgress` (`:12`), and the two stylesheets `src/components/site.css` (`:13`) and `src/components/hub/hub.css` (`:14`). Frontmatter also splits each card's title into `head` and `last` word for the accent (`:16-20`) and defines `soonArt` (`:22`).

**Layout.** `<BaseLayout title="Tracks" current="tracks" description="Every TechConcepts track: sets of short visual lessons, taken in order.">` (`tracks.astro:25`). `BaseLayout` is `src/layouts/BaseLayout.astro`; it imports `global.css`, `lumen.css`, `LumenDefs.astro`, `SiteHeader.astro`, `SiteFooter.astro`, `tokensToCss` (`src/layouts/BaseLayout.astro:2-10`).

**Sections, in markup order.**
1. Head: `<div class="wrap tp">` (`tracks.astro:26`) with `<div class="tp-head">` (`:27`): `<h1 class="disp">Pick a <em>track</em></h1>` (`:28`) and `<p>Each track is a set of short visual lessons, taken in order.</p>` (`:29`).
2. Panels: `<div class="panels">` (`:32`) maps `trackCards()` (`:33-67`). Each card is one of two branches:
   - Ready (`c.ready`, `:35-47`): `<article class="panel" id={c.id} aria-labelledby=...>` (`:36`); `<h2 class="panel__t disp">` containing `<a href={c.href}>{c.head}<em>{c.last}</em></a>` (`:37-39`); `<p class="panel__who">{c.blurb}</p>` (`:40`); then `<TrackPanelProgress client:load entries known trackUrl>` (`:42-46`) with one `<Fragment slot={slot} set:html={svg} />` per figure (`:43-45`). The island's comment says it "draws the strip, the button row and the up-next card straight into this grid" (`:41`).
   - Not ready (`:48-64`): same article and h2 but no link (`:49-50`); `<span class="h-chip h-chip--plain panel__chip">{STATUS_WORDS['not-ready']}</span>` (`:52`), which is "Not ready yet" (`src/lib/hub.ts:13`); `<div class="panel__cta"><span class="btn panel__off">Lessons on the way</span></div>` (`:53-55`); `<div class="next next--soon">` with `<span class="next__art" aria-hidden="true" set:html={soonArt(c.cover)} />` (`:57`), `Coming soon` (`:59`), `Lesson 1 is being written` (`:60`), `Each lesson will follow the A+ exam objectives.` (`:61`).
3. Outro: `<p class="outro">` (`:70-73`): "New to IT? Start with" + link `#how-the-internet-works` (`:72`), "then go deeper with" + link `#networking`, then "Every lesson is Watch, Learn, then Practice."

**Its own styles.** One `<style>` block, lines `77-218` (142 lines including the tags; 140 lines between them). Rules and line ranges:
- Head: `.tp` `:78-81`, `.tp-head` `:82-84`, `.tp-head h1` `:85-87` (64px), `.tp-head p` `:88-92`.
- Panels: `.panels` grid, gap 26px `:95-98`; `.panel` grid with columns `minmax(0, 1fr) 500px`, column-gap 40px, padding `40px 44px`, `border-radius: var(--r-card)`, `background: var(--card)`, `box-shadow: var(--shadow-sm)` (`:102-113`, shadow at `:110`), `scroll-margin-top: 92px` (`:112`).
- Child placement: `.panel > :global(*)`, `.strip`, `.panel__cta` to column 1 (`:114-119`); `.panel :global(.next)` to column 2, `grid-row: 1 / span 4` (`:120-123`).
- Title and copy: `.panel__t` 44px (`:124-126`); `.panel__t a` and hover underline (`:127-135`); `.panel__who` max-width 560px, `color: var(--muted)`, 17px, line-height 1.5 (`:136-142`); `.panel :global(.strip)` margin-top 26px (`:143-145`).
- A+ rules: `.panel__chip` (`:148-151`); `.panel__off` and hover, `border-color: var(--line)`, `background: var(--card)`, `color: var(--muted)`, `cursor: default` (`:153-159`); `.panel__off:active` (`:160-162`); `.next--soon` with `box-shadow: inset 0 0 0 1px var(--line)` (`:164-166`); `.next--soon .next__k` `color: var(--muted)` (`:167-169`).
- Outro: `.outro` 15px, muted, centred (`:171-177`); `.outro a` `color: var(--ink-strong)` (`:178-181`).
- Narrow screens: `@media (max-width: 1000px)` (`:184-197`), comment says "not designed yet (task 8), only kept from breaking" (`:183`); `@media (max-width: 560px)` (`:198-217`): `.tp-head h1` 44px, `.panel__t` 32px, strip wraps (`:206-209`), `.next` column (`:210-213`), `.next__art` `flex-basis: auto` (`:214-216`).

**Token use in the page's own styles.** `var(--muted)` (`tracks.astro:90,139,157,168`), `var(--r-card)` (`:108`), `var(--card)` (`:109,156`), `var(--shadow-sm)` (`:110`), `var(--line)` (`:155,165`), `var(--ink-strong)` (`:179`). No other custom property is read in this block.

**Small capitals.** None. A search of `src` for `small-caps` and `font-variant` finds only `src/art/lumen.css:98`, `src/art/kit/iso-kit.ts:824` and `src/lesson/console.css:479,587,1184`, all `font-variant-numeric: tabular-nums`, none on this page.

**Leftovers.** `shadow-sm` is used on this page at `src/pages/tracks.astro:110` (`.panel`). Its value is `0 0 0 0 transparent` in both themes (`src/styles/tokens.ts:84,120`), and `tokens.ts:47` says "There are no resting shadows: `shadow-sm` and `btn-shadow` paint nothing". `btn-shadow` is not used in `tracks.astro` or any file under `src/` outside `tokens.ts`. Other `shadow-sm` users that reach this page through the island: `src/components/site.css:225,234` (`.lift`), `src/components/hub/hub.css:39,70,71` (`.side-now`, `.stop__tile`, `.stop--now .stop__tile`, none on Tracks). The island's up-next card is `class="next lift"` (`src/components/hub/TrackPanelProgress.tsx:46`).

**Script and island.** The page has no `<script>` tag. Its one island is `TrackPanelProgress` with `client:load` (`src/pages/tracks.astro:42`), once per ready track (two). It is `src/components/hub/TrackPanelProgress.tsx`:
- Props: `entries`, `known`, `trackUrl`, the `art<number>` slots (`TrackPanelProgress.tsx:8-18`).
- Reads through `useUpNext(entries, known)` (`:29`) in `src/components/hub/useUpNext.ts`. That hook calls `useProgress(known)` (`useUpNext.ts:25`) and uses `emptyProgress()` (`:26`) unless storage is ready and available. Its comments say a first visit shows "until progress has loaded, and when storage is blocked" (`useUpNext.ts:7,22`).
- The island renders: a `TrackStrip` (`TrackPanelProgress.tsx:62`); a button row `<div className="panel__cta">` with `btn btn--primary` linking to `href` and `label`, plus `See the whole track` (`:36-42`); and the card `a.next.lift` with the kicker from `UP_NEXT_KICKER[kind]`, the lesson title in `b.next__t.disp`, and `lessonLine(entry)` (`:46-55`).
- `TrackStrip` (`src/components/hub/TrackStrip.tsx:4-15`) draws `<span class="strip__sq">` with one `<i data-state>` per lesson and `<span class="strip__w">{words}</span>`.

**What the browser reads.**
- Progress: `useProgress` (`src/progress/useProgress.ts:50`). Its storage key is `techconcepts:v2` (`src/progress/store.ts:5`), with a legacy read of `techconcepts:v1` (`src/progress/store.ts:7`). The custom event is `techconcepts:progress-changed` (`src/progress/useProgress.ts:17`).
- The words come from `src/lib/hub.ts`:
  - "Start here" / "Up next" / "✓ Done so far": `UP_NEXT_KICKER` at `hub.ts:106-110` (the three entries are `start`, `next`, `done-so-far`).
  - Button labels "Start", "Continue", "Watch again": `actionLabel` at `hub.ts:94-98`, with `in-progress` to Continue (`:95`), `done` to Watch again (`:96`), else Start (`:97`).
  - "Not started", "In progress", "✓ Done", "Not ready yet": `STATUS_WORDS` at `hub.ts:9-14`.
  - Up-next choice: `upNext` at `hub.ts:43-59`. The in-progress lesson with the latest `lastOpened` wins (`:45-53`), then the first ready lesson not finished, then the last ready lesson (`:54-58`).
  - Strip caption: `stripWords` at `hub.ts:78-84`, "N of M lessons done", with "· R ready" added when some lessons are not ready (`:83`).
  - "Continue" / resume link: `lessonHref` at `hub.ts:87-91` adds `?step=` from `resumePosition`.
- The page itself (`tracks.astro`) reads no browser API. It renders the first-visit state server-side; the island swaps it in on the client.

## Part 2: the data (Q2)

**Where the page's data comes from.** The page calls `trackCards()` from `src/lib/tracks-page.ts:42-61` (the only data call in `tracks.astro:17`). That function reads:
- `tracks` from `src/content/tracks/index.ts` (`tracks-page.ts:4`; `tracks` defined at `src/content/tracks/index.ts:12`, a two-item array `[internetTrack, networkingTrack]`, "in the order the site lists them", `index.ts:8-11`).
- `plannedTracks` from `src/content/tracks/index.ts` (`tracks-page.ts:4`; defined at `index.ts:25-34`, one item, `comptia-a-plus`).
- `getEntries(track.id)` from `src/content/registry.ts:371` (`tracks-page.ts:44`), built by `buildEntries` at `src/content/registry.ts:59`.
- `knownFrom` from `src/lib/entries.ts` (`tracks-page.ts:5,52`).
- `lessonFigure` from `src/lib/figures.ts` (`tracks-page.ts:6,55`), and `firstSentence` from `src/lib/text.ts:4` (`tracks-page.ts:7,50`).
- The track definitions: `src/content/tracks/how-the-internet-works.ts` and `src/content/tracks/networking.ts` (imported at `src/content/tracks/index.ts:3-4`). The description for each is in its `description:` field (`how-the-internet-works.ts:13-14`, `networking.ts:12-13`).
- The lesson files: `src/content/lessons/*.ts` (40 entries in the folder at the time of the scan, including test files). A lesson counts as ready when its file exists (`registry.ts:86-91`: `lesson === undefined ? { available: false }` else `available: true`).

**What each card carries.** `ReadyTrackCard` (`tracks-page.ts:13-28`): `id`, `title`, `href` (`/${track.id}`, `:49`), `blurb` (`firstSentence(track.description)`, `:50`), `entries` (every lesson the track lists, ready or not, `:23`), `known` (`:25`), and `figures` (one `{slot: art<number>, svg}` per ready lesson, `:53-55`). `PlannedTrackCard` (`:31-37`): `id`, `title`, `blurb`, `cover`.

**What each panel shows, in plain terms.**
- How the Internet Works (`id` `how-the-internet-works`): name, link to `/how-the-internet-works`, blurb "Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each." (first sentence of `how-the-internet-works.ts:14`), a strip of 14 squares, a button and "See the whole track", and the up-next card.
- Networking Concepts (`networking`): same shape; blurb "How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it." (first sentence of `networking.ts:13`); strip of 20 squares.
- CompTIA A+ (`comptia-a-plus`): no link on the name, blurb from `src/content/tracks/index.ts:31`, "Not ready yet" chip, "Lessons on the way" plain span, "Coming soon" card. No strip (`tracks.astro:49-64`; `e2e/site.spec.ts:562-583` asserts the absence, see Part 3).

**Counts of tracks and lessons.**
- Tracks on the page: 3 (2 ready + 1 planned). `trackCards()` returns `[...ready, ...later]` (`tracks-page.ts:61`).
- Tracks with lessons: 2 (`src/content/tracks/index.ts:12`). Planned tracks: 1 (`index.ts:25-34`). Four more are in `comingSoonTracks` (`index.ts:40-65`), which the Tracks page does not read (`tracks-page.ts` imports only `plannedTracks` and `tracks`, `:4`).
- How the Internet Works: 14 lessons listed (`how-the-internet-works.ts`: 14 `slug:` entries in six parts; `src/lib/track.test.ts:36` asserts "six parts, every lesson ready, numbered 01 to 14"). All 14 have a file in `src/content/lessons/` (what-is-http.ts, what-is-https.ts, what-is-tcp.ts, what-is-udp.ts, what-is-ip.ts, what-is-dns.ts, what-is-dhcp.ts, what-is-icmp.ts, what-is-smtp.ts, what-is-pop3.ts, what-is-imap.ts, what-is-ftp.ts, what-is-ssh.ts, what-is-tls.ts). Ready: 14. Not ready: 0.
- Networking Concepts: 20 lessons listed in six parts (`networking.ts:26-75`, parts at `:28,36,46,55,65,74`). All 20 have a file in `src/content/lessons/` (osi-model.ts, packets.ts, ip-address.ts, mac-address.ts, switch.ts, arp.ts, subnetting.ts, router.ts, dhcp.ts, ports.ts, tcp-udp.ts, nat.ts, what-is-dns.ts, what-is-http.ts, what-is-https.ts, what-is-tls.ts, firewalls.ts, proxies.ts, load-balancers.ts, vpn.ts). Ready: 20. Not ready: 0.
- Shared with How the Internet Works: four lessons, `what-is-http` (`networking.ts:68`), `what-is-https` (`:69`), `what-is-tls` (`:70`) and `what-is-dns` (`:61`). They are the same four that How the Internet Works lists (`how-the-internet-works.ts:22,23,39,64`, in its part "the-seal", `how-the-internet-works.ts:62`).
- A+: 0 lessons (`index.ts:25-34` lists none; the card's own copy says "Lesson 1 is being written", `tracks.astro:60`).
- The strip caption reads `N of M lessons done`, and "· R ready" only when R < M (`src/lib/hub.ts:78-84`). For the two ready tracks, R = M, so the caption has no "ready" part.

**Figures used on the page (`src/art/figures/*`).**
- Lesson figures on each card: `lessonFigure` (`src/lib/figures.ts:31-42`).
  - A lesson whose home track is How the Internet Works gets its protocol's name tile: `nameTile(unit.name, unit.fullName)` (`figures.ts:32-37`), from `src/art/figures/name-tile.ts:27`. The home track is `tracksOf(slug)[0]`, and `tracks` lists How the Internet Works first (`src/content/registry.ts:359-364`; `index.ts:12`). So the four shared lessons (dns, http, https, tls) get name tiles on Networking too.
  - Every other ready lesson gets `spot(kind)` from `FIGURES` (`figures.ts:7-24`, sixteen keys: osi-model, subnetting, dhcp, firewalls, router, arp, ports, nat, ip-address, mac-address, tcp-udp, packets, switch, load-balancers, proxies, vpn). `spot` is `src/art/figures/spots.ts:507`, over `SPOTS` (`spots.ts:501`).
  - Networking: 4 name tiles + 16 spots = 20. How the Internet Works: 14 name tiles.
- A+ planned card: `coverStill('aplus', 'tracks-aplus')` cropped with `cropViewBox(..., '30 20 540 378')` (`tracks.astro:22,57`). `coverStill` is `src/art/figures/covers.ts:435`; `COVER_IDS` lists the cover ids at `covers.ts:402`, and the A+ cover is drawn at `covers.ts:339` (comment: "Drawn for the Tracks page after the six mockup covers").
- `cropViewBox` and `scopeIds` are in `src/art/ids.ts:14` and `:5`.
- `TRACK_COVERS` (`tracks-page.ts:10`: `'how-the-internet-works': 'web', networking: 'networking'`) is exported for Home (`src/lib/home.ts:13,407`). The Tracks page's ready cards do not read it (`tracks-page.ts:42-61`). Those two covers are not drawn on the Tracks page.
- `src/art/figures/internet-thumb.ts:234` exports `internetThumb()`, and nothing under `src/` outside its test imports it (grep finds no other reference). `src/lib/figures.ts` imports only `name-tile` and `spots` (`figures.ts:2-3`).

## Part 3: tests that pin the page (Q3)

**Unit tests, by file.**
- `src/lib/tracks-page.test.ts` (the page's data, 4 tests):
  - `:6` "How the Internet Works first, then Networking, then A+": order of `trackCards()` ids.
  - `:10` "How the Internet Works links to its page, with all 14 lessons ready and a figure for each".
  - `:20` "a track with some lessons ready lists every lesson, and a figure for each ready one".
  - `:36` "a planned track is no link, has no lessons, and wears its cover": exact object `{ready: false, id: 'comptia-a-plus', title, blurb, cover: 'aplus'}`.
- `src/components/hub/TrackPanelProgress.test.tsx` (the island, `describe` at `:38`, 9 tests):
  - `:39` a first visit starts at the first ready lesson.
  - `:50` a lesson in progress is the one to continue.
  - `:60` a finished lesson makes the next unfinished one Start.
  - `:67` everything ready finished offers Watch again.
  - `:74` with no ready lesson it still draws the strip and nothing else.
  - `:82` puts the lesson figure in the card.
  - `:91` the card swaps its figure when progress loads, "though a slot never re-renders".
  - `:113` blocked storage shows the first-visit render without an error.
  - `:128` hydrates the first-visit server render with saved progress and no mismatch, then shows the lesson to continue.
- `src/components/hub/hub.test.tsx` (`TrackStrip` and `PartsMarker`, 3 tests):
  - `:7` "the strip draws one square per state and shows the words" (renders `TrackStrip`, imported at `:4`).
  - `:19` and `:31` test `PartsMarker`, which the Tracks page does not use (`tracks.astro:12` imports only `TrackPanelProgress`).
- `src/lib/hub.test.ts` (the logic the island and the strip call): `describe` blocks at `:36` lessonStatus, `:48` upNext, `:86` stripStates, `:96` stripWords, `:110` lessonHref, `:123` actionLabel, `:136` lessonLine.
- `src/lib/track.test.ts`: not about the Tracks page. Its `:36` test "How the Internet Works: six parts, every lesson ready, numbered 01 to 14" pins the same 14-lesson count for the track page (`src/lib/track.ts`).
- `src/art/figures/figures.test.ts`:
  - `:40` "the A+ cover is a figure on the shared plate, with one lit part and its label".
  - `:56` `EXPECTED` table, including `'cover:web'` (`:58`) and `'cover:aplus'` (`:64`, with the comment at `:63`, "Drawn for the Tracks page on 2026-11-07").
  - `:93` "the figures match the mockups": compares every `COVER_IDS` and `SPOTS` entry with `EXPECTED`.
  - `:27` "two still copies of the same cover share no ids".
- `src/lib/home.test.ts:124`: Home's track stops link to `/tracks#<id>`.
- `src/lib/glossary-page.test.ts:138-148`: no link in the glossary's main reaches `/tracks` or a track (a rule about the Glossary).

**End-to-end specs that visit `/tracks` (`e2e/*.spec.ts`).**
- `e2e/global-setup.ts:16`: `page.goto('/tracks')`; `:17-19` reads every `main article.panel h2 a` href; `:20` throws "The Tracks page links to no track." when there are none. Every e2e run starts here.
- `e2e/site.spec.ts`, `test.describe('Tracks page')` at `:481`:
  - `:482` "Tracks: How the Internet Works then Networking then A+, each panel id'd for Home's links": title `Tracks · TechConcepts` (`:484`); h1 "Pick a track" (`:485`); blurb (`:486`); panel ids in order (`:487`); h2 names (`:488`); the name links to `/how-the-internet-works` and `/networking`, and A+ has no link (`:489-492`); "See the whole track" links (`:494`); the outro text (`:498-500`) and its two anchors (`:501-502`); `/tracks#networking` lands the panel below the sticky header (`:505-523`); a click on the Networking name goes to `/networking` (`:524`).
  - `:528` "Tracks: first visit says Start and Start here, the strip reads "0 of 20 lessons done"": strip words `0 of 14` and `0 of 20` (`:532-533`); 14 and 20 squares (`:534-535`); no `current` square (`:537`); button "Start" with the first lesson's href (`:544-545`); card kicker "Start here" (`:547`); no "continue|resume" link and no "Last opened|Up next|%" text (`:554-555`); the card opens the first lesson (`:557`).
  - `:562` "Tracks: A+ is Not ready yet with no lesson link": h2 "CompTIA A+" (`:565`); chip "Not ready yet" (`:567`); "Lessons on the way" is a SPAN with no role or tabindex (`:568-572`); card kicker "Coming soon" and title "Lesson 1 is being written" (`:574-575`); no `lift` class on the card (`:578`); no `a`, `button` or `[tabindex]` in the panel (`:580`); no `.strip` (`:581`).
- `e2e/site.spec.ts:784`, "finishing DHCP shows ✓ Done on the track and 1 of 20 done on Tracks, leaves Home as it was, and Reset progress on About clears them": on Tracks, `1 of 20 lessons done` (`:806`), "Up next" kicker (`:808`), button "Start" (`:813`), How the Internet Works still `0 of 14` with "Start here" (`:815-816`), the Reset on About (`:820-821`), and the cleared `0 of 20 lessons done` (`:831`) with "Start here" (`:832`).
- `e2e/site.spec.ts:858`, "a visitor partway through the old lesson keeps their place": Tracks shows `3 of 14 lessons done` (`:887`) and How the Internet Works' button continues `/how-the-internet-works/what-is-udp?step=4` (`:889`), with kicker "Up next" (`:890`).
- `e2e/site.spec.ts:78-81` (the test at `:78`, the share image on each page): `/tracks` is in the list of pages (`:81`).
- `e2e/site.spec.ts:364-365` (the test at `:364`): no time figure on `/tracks`.
- `e2e/site.spec.ts:371-384` (the test at `:371`): the header and footer Tracks links go to `/tracks` on every page; the current link is `page` on `/tracks` (`:375-378`); the last line checks the URL after a click (`:384`).
- `e2e/site.spec.ts:387-396` (the test at `:387`): "Start learning" points at `/tracks` on Home, About and 404 (`:395-396`), and `/tracks` is in the list of pages where it is absent (`:388`, `:469`).
- `e2e/site.spec.ts:422-427` and `:432`: the header and the menu list `/tracks` first; `:445-451`: the footer lists "All tracks" (`:451`).
- `e2e/site.spec.ts:89-98` (Home): "See the tracks" goes to `/tracks` (`:98`).
- `e2e/site.spec.ts:266-279` (Home, test at `:258`): Home's track cards link to `/tracks#how-the-internet-works` and `/tracks#networking` (`:266-267`); clicking the second lands on `/tracks#networking` (`:279`).
- `e2e/site.spec.ts:706-713` (the track page): breadcrumb "Tracks" goes to `/tracks` (`:712-713`).
- `e2e/site.spec.ts:1019-1022` (the `@phone` block): `for (const { name, path } of SITE_PAGES)` runs "loads and scrolls with no errors" for `/tracks` too. No phone test is specific to the Tracks page.
- `e2e/tablet.spec.ts:130-131` and `:227`: the `/tracks` crumb on a lesson's top bar is hidden at narrow widths. These test the lesson page.
- `e2e/glossary.spec.ts:53-66`: the glossary's links never reach `/tracks` or a track (`:58`).
- `e2e/visual.spec.ts`:
  - `SIZES` at `:13-18` (1280x800, 1366x768, 1440x900, 1920x1080); `THEMES` at `:19` (dark, light).
  - `shoot` at `:74-82`: it asserts `data-theme` (`:75`) and writes `<outputDir>/visual/<name>-<w>x<h>-<theme>.png` with `fullPage: true` and `animations: 'disabled'` (`:77-80`).
  - `for (const { name, path } of SITE_PAGES)` at `:84-89` runs the `tracks` shot (`e2e/support.ts:46`: `{ name: 'tracks', path: '/tracks' }`), with `expect(errors).toEqual([])` at `:89`.
  - The spec is `test.describe('screenshots', { tag: '@visual' })` at `:54`. There is no pixel comparison (no `toHaveScreenshot`); the files are for a person to compare with the mockups (`:5-8`). That is 8 PNG files for `/tracks`.
- Projects: `playwright.config.ts:52` gives `d1440-dark` the `@visual` run; the `notVisual` set (`playwright.config.ts:28`) excludes `visual.spec.ts` from the other projects.
- CI's end-to-end pass, per CLAUDE.md, is `npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`, so the `tracks` screenshots are not in it.

## Part 4: what the page shares, and the links into and out of `/tracks` (Q4)

**Components.**
- `BaseLayout` (`src/layouts/BaseLayout.astro`): used by `tracks.astro:11`, `src/pages/index.astro:18`, `src/pages/about.astro:14`, `src/pages/[track]/index.astro:16`, `src/pages/404.astro`. It renders `SiteHeader` (`BaseLayout.astro:102`) and `SiteFooter` unless `footer` is false (`BaseLayout.astro:106`; the track page passes `footer={false}`, `src/pages/[track]/index.astro:68`).
- `TrackPanelProgress` (`src/components/hub/TrackPanelProgress.tsx`): used only by `tracks.astro:12`. It imports `TrackStrip` (`TrackPanelProgress.tsx:5`) and `useUpNext` (`:6`).
- `TrackStrip` (`src/components/hub/TrackStrip.tsx`): used by the Tracks island (`TrackPanelProgress.tsx:5`) and by the track page's side card (`src/components/hub/TrackSide.tsx:6`). TrackSide and TrackRoute import `hub.css` (`TrackSide.tsx:5`, `TrackRoute.tsx:7`).
- `useUpNext` (`src/components/hub/useUpNext.ts:24`): used by `TrackPanelProgress.tsx:29`, `TrackSide.tsx:48` (import `:7`) and `TrackRoute.tsx:44` (import `:10`). The hook's comment says "What every hub island shows of this visitor's progress" (`useUpNext.ts:19-23`).
- `SiteHeader.astro` and `SiteFooter.astro`: used by `BaseLayout.astro:5-6` on every page.
- `PartsMarker.tsx`: used by the track page's route (`src/components/hub/TrackRoute.tsx:9`), not by `tracks.astro`.

**Stylesheets.**
- `src/components/site.css`: imported by `tracks.astro:13`, `src/pages/index.astro:20`, `src/pages/about.astro:16`, `src/pages/[track]/index.astro:20`. It holds `.btn` (`site.css:3`), `.h-chip` (`:88`), `.lift` (`:224`, with `box-shadow: var(--shadow-sm)` at `:225`).
- `src/components/hub/hub.css` (94 lines): imported by `tracks.astro:14`, `src/pages/[track]/index.astro:21`, `TrackSide.tsx:5`, `TrackRoute.tsx:7`. The Tracks page uses its `.strip` (`hub.css:2-8`), `.panel__cta` and `.wholetrack` (`:19-22`), and `.next`, `.next__art`, `.next__k`, `.next__t`, `.next__s` (`:25-36`). It does not use `.side-now` (`:38-50`), `.route` (`:52-60`), `.stop` (`:62-94`), though those are in the same file.
- `src/pages/index.astro` imports `site.css` (`:20`) and `src/art/scenes/net-map.css` (`:19`), not `hub.css`.
- The lesson page's files `src/lesson/LessonConsole.tsx`, `src/lesson/Outline.tsx` and `src/lesson/Explanation.tsx` import from `src/lib/hub.ts` (`LessonConsole.tsx:8`, `Outline.tsx:6`, `Explanation.tsx:9`). They do not import `hub.css` (grep of `src/lesson` for `hub.css` finds none).

**Libs and figures.**
- `src/lib/hub.ts` (`STATUS_WORDS`, `UP_NEXT_KICKER`, `upNext`, `stripStates`, `stripWords`, `lessonHref`, `actionLabel`, `lessonLine`): used by the Tracks page (`tracks.astro:9` imports `STATUS_WORDS`; `TrackPanelProgress.tsx:3` and `useUpNext.ts:2`), by the track page's components (`TrackRoute.tsx:3`, `TrackSide.tsx:3`), and by the lesson page (`LessonConsole.tsx:8`, `Outline.tsx:6`, `Explanation.tsx:9`).
- `src/lib/entries.ts` (`knownFrom`): used by `tracks-page.ts:5,52`, `src/pages/[track]/index.astro:12`, and `src/lesson/LessonConsole.tsx:7`.
- `src/lib/figures.ts` (`lessonFigure`): used by `tracks-page.ts:6,55` and `src/pages/[track]/index.astro:13`.
- `src/lib/text.ts` (`firstSentence`): used by `tracks-page.ts:7,50` and by `src/lib/home.ts` (the blurb for Home's cards, `home.ts:414`).
- `src/lib/tracks-page.ts`: its `TRACK_COVERS` is imported by `src/lib/home.ts:13` (Home's covers), see Part 2.
- Figures used by Home and the Tracks page: `coverStill` and `cropViewBox` (`src/pages/index.astro:9,11`, Home crops its covers `index.astro:34-35`; `tracks.astro:7-8,22`); `spot` and `nameTile` (through `src/lib/figures.ts`) are used by the Tracks page's lesson figures and by the track page; `src/art/figures/pages.ts` `pageFigure` is used by Home and About (`src/pages/index.astro:10`, `src/pages/about.astro:6`) but not by the Tracks page.
- Lesson figures on the track page: `[track]/index.astro:13` uses `lessonFigure`, so the Tracks page and the track page draw each lesson the same way.

**Links into `/tracks`.**
- The header's "Tracks" link: `src/components/SiteHeader.astro:17` (`{ key: 'tracks', href: '/tracks', label: 'Tracks' }`); "Start learning" to `/tracks` on pages that are not Tracks or a track page (`SiteHeader.astro:15` sets `showStart = current !== 'tracks'`; the links are at `:48` and `:56`).
- The footer's "All tracks": `src/components/SiteFooter.astro:24` (`<li><a href="/tracks">All tracks</a></li>`).
- Home's "See the tracks" button: `src/pages/index.astro:54`.
- Home's track cards: `src/pages/index.astro:271-283` (`<section class="order">`, `<ol class="cable">`, each `<li class="leg">`, and `<a href={stop.href}>{stop.title}</a>` at `:283`). The anchors are built in `src/lib/home.ts:407-415` as `href: \`/tracks#${track.id}\`` (`home.ts:415`). Home's `stops` comes from `homeStops()` (`index.astro:14,24`).
- The 404 page's "See the tracks" button: `src/pages/404.astro:21`.
- The lesson page's top bar "Tracks" link: `src/lesson/TopBar.tsx:81` (`<a href="/tracks">Tracks</a>`).
- The track page's breadcrumb "Tracks": `src/pages/[track]/index.astro:72` (`<li><a href="/tracks">Tracks</a></li>`).

**Links out of `/tracks`.**
- The panel names: `href={c.href}` (`tracks.astro:38`), which is `/${track.id}` (`tracks-page.ts:49`): `/how-the-internet-works` and `/networking`.
- "See the whole track": `href={trackUrl}` (`TrackPanelProgress.tsx:40`), which is the same track URL.
- The button and the up-next card: `href={href!}` (`TrackPanelProgress.tsx:37,46`), from `lessonHref` (`hub.ts:87-91`) or the lesson's own `url` (`registry.ts:93`, `url: \`/${track.id}/${planned.slug}\``).
- The outro: `#how-the-internet-works` and `#networking` (`tracks.astro:72`), which point at the panels on the same page.
- The header and footer links are the same as on every page (`SiteHeader.astro`, `SiteFooter.astro`).

**Other reads.** `src/pages/about.astro` does not link to `/tracks` (only the footer and header do). Its `comingSoonTracks` and `plannedTracks` imports (`about.astro:10`) are for About's own text.

## Part 5: the built page's size (Q5)

Command run once: `npm run build` (script: `astro check && astro build && node scripts/check-budgets.mjs`, `/private/tmp/claude-501/s20-build.log:3`). Exit 0. The log's last line is "Every page is within budget (42 pages)" (`s20-build.log:153`). No server was started.

- `dist/tracks/index.html`: **1,040,368 bytes raw** (1,040.4 kB at 1,000 bytes per kB). Measured with `wc -c` and `ls -l`.
- Gzip: **213,329 bytes** (`gzip -9 -c | wc -c`, 213.3 kB). The build's own table gives the same page as **214.9 KB** gzipped HTML (1 KB = 1,000 bytes, `s20-build.log:106`), with JS **76.7 KB** gzipped across **11** JS files and **3** inline blocks. The row is `/tracks/  no  214.9 KB  76.7 KB  11  3  ok` (`s20-build.log`, grep for `/tracks/`).
- Budget: the log says "HTML 250 KB on every page" (`s20-build.log:106`), so the Tracks page is within it at 214.9 KB.
- `git status --short` after the build lists only `prototypes/s20-tracks-facts.md` as untracked; no tracked file changed (`dist/` is git-ignored).

## Part 6: where Home's Card stack look lives (Q6)

Facts only. Paths are from the worktree at `revamp` 1cba05e.

**The stylesheet.** Home's own `<style>` element is `src/pages/index.astro:328-1416`, which is 1,089 lines including the tags (1,087 between them). It is not a separate file. Its scope is the page (the comment at `src/pages/index.astro:7-8` says "It is scoped to this page, so the header, the footer and every other page keep Patch").

**The tokens and their names.** Every token the look defines is prefixed `--cs-` (the Card stack's own names). The token block is `index.astro:329-366`, under `:global(:root)` (its opening is around `:332`). Nineteen names are declared or used in the file: `--cs-edge` (declared at `:334`, `:357`, `:361`), `--cs-card` (`:335`), `--cs-quiet` (`:336`), `--cs-hair` (`:337`), `--cs-r` (`:338`, 10px), `--cs-r-in` (`:339`, 8px), `--cs-off` (`:340`, 3px), `--cs-stack` (`:341`, 6px; 4px at `:366` under `max-width: 860px`), `--cs-dither` (`:342`), `--cs-act` (`:344`), `--cs-act-ink` (`:345`), `--cs-act-edge` (`:346`, `var(--cs-off) var(--cs-off) 0 var(--cs-edge)`), `--cs-here` (`:347`), `--cs-here-ink` (`:348`), `--cs-here-wash` (`:349`), `--cs-done` (`:350`), `--cs-done-text` (`:351`), `--cs-request` (`:352`), `--cs-response` (`:353`).

**Which Patch tokens they read.** The block's comment says "No Patch token is given a new value here" (`index.astro:329-331`). The `--cs-*` values point at existing tokens: `var(--ink-strong)` (`:334`), `var(--card)` (`:335`), `var(--tile)` (`:336`), `var(--line-strong)` (`:337`), `var(--accent)` (`:344`), `var(--accent-ink)` (`:345`), `var(--here)` (`:347`), `var(--here-ink)` (`:348`), `var(--here-soft)` (`:349`), `var(--allowed)` (`:350`), `var(--allowed-text)` (`:351`), `var(--request)` (`:352`), `var(--response)` (`:353`). The dark overrides are `--cs-edge: var(--ink)` at `:357` (`[data-theme='dark']`), `:361` (`prefers-color-scheme: dark` on `:root:not([data-theme])`), and the 860px stack at `:366`.

**Its use in the stylesheet.** Home's stylesheet reads no shadow token: a search of `index.astro` lines 328-1416 for `var(--shadow` or `var(--btn-shadow` finds nothing. The hard edge is `box-shadow: var(--cs-off) var(--cs-off) 0 var(--cs-edge)` (`index.astro:407`), with `border: 2px solid var(--cs-edge)` (`:404`, and again at `:512`). The file has 119 lines containing `--cs-`.

**Media queries in the stylesheet** (`index.astro` lines in range): `:359` (prefers dark), `:364` (max-width 860px), `:374` (reduced motion), `:663` (reduced motion), `:926` (max-width 860px), `:990` (min-width 861px), `:1146` (max-width 860px), `:1381` (prefers dark).

**Generated CSS that also uses `--cs-*`.** The demo's states are generated by `demoCss(demo)` in `src/lib/home.ts` (called at `src/pages/index.astro:38`, injected as `<style is:inline set:html={css}>` at `index.astro:69`). Eight lines of `src/lib/home.ts` write `--cs-*` names (e.g. `home.ts:336`, `:344`, `:345`, `:368`). `src/lib/home.test.ts` has four lines that mention `--cs-`. So the Card stack's names are read in three places: the page's own style (`index.astro`), the generated demo CSS (`src/lib/home.ts`), and a test.

**Home's other look rules for the track cards.** The Home track cards are `section.order` (`index.astro:271`), `ol.cable` (`:274`), `li.leg` (`:277`). Their own rules are `.cable` (`index.astro:1004`) and `.leg` (`:1012`), with `.leg:first-child .leg__order::before` at `:1048`. No `.cable` or `.leg` CSS rule exists in `hub.css` or `site.css`. The only CSS rules with those names are in `index.astro`, and `src/lib/home.test.ts:354-355` reads the `.leg {` rule from the page.

**Shared with other pages?** Nothing in Home's `<style>` is imported elsewhere. `src/components/site.css` is imported by both Home and Tracks (`index.astro:20`, `tracks.astro:13`); Home's `--cs-*` names appear in no other page's file (the grep of `src` finds only `src/lib/home.ts`, `src/lib/home.test.ts` and `src/pages/index.astro`).
