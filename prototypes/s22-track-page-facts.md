# S22: the track page, facts (2026-11-18)

Scout's report (Haiku 5.5), read-only, in the worktree `vibrant-mirzakhani-d38081` at `revamp` fb02521. Paths are repo-relative. Every fact is path:line from the files as they stand. Nothing was built, served, or run in a browser. The page in question is `src/pages/[track]/index.astro` (244 lines), served at `/how-the-internet-works` and `/networking`. Note: `prototypes/s20-tracks-facts.md` describes an older `tracks.astro` (its `next next--soon` markup, `:57`) that no longer exists in this revision; this report reads the current files.

## Part 1: the page's code (Q1)

**Frontmatter and imports.** `src/pages/[track]/index.astro:1-66`. Header comment `:2-7` describes the split layout, and says the islands show "a first visit, every lesson listed" until progress loads and without JavaScript. Imports:
- `getEntries, getLesson, AvailableSummary` from `../../content/registry` (`:9`); `Lesson` type (`:10`); `internetTrack, networkingTrack, tracks` from `../../content/tracks` (`:11`).
- `knownFrom` from `../../lib/entries` (`:12`); `lessonFigure` from `../../lib/figures` (`:13`); `lessonStamp` from `../../lib/checked` (`:14`); `trackParts` from `../../lib/track` (`:15`).
- `BaseLayout` (`:16`); `SiteFooter` from `../../components/SiteFooter.astro` (`:17`); `TrackRoute` (`:18`) and `TrackSide` (`:19`) from `../../components/hub/`.
- Stylesheets: `../../components/site.css` (`:20`) and `../../components/hub/hub.css` (`:21`). It does not import `card-stack.css`, `covers`, or `tokens`.

**Static paths and props.** `getStaticPaths` maps `tracks` (the two ready tracks) to `params: { track: track.id }` (`:23-27`). `CROSS_LINKS` (`:35-38`) gives How the Internet Works a line to Networking ("Ready for more? ", " goes deeper.") and Networking a line to How the Internet Works ("New to IT? ", " is the gentler start."); a track without an entry throws (`:39-40`).

**Frontmatter data.** `entries = getEntries(track.id)` (`:42`); `known = knownFrom(entries)` (`:43`); `someNotReady` (`:44`); `lessonOf` (`:46-51`); `parts = trackParts(track, entries, lessonOf, lessonStamp)` (`:53`); `figures` = one `{ slot: 'art<number>', svg: lessonFigure(entry) }` per ready entry (`:58-60`); title split at its last space into `head` and `last` (`:62-65`).

**Layout.** `<BaseLayout title={track.title} current="tracks" description={track.description} split footer={false}>` (`:68`). `current="tracks"` marks Tracks in the header (`src/layouts/BaseLayout.astro:27`). `split` adds `class="split"` to body (`BaseLayout.astro:45`, `:98`). `footer={false}` means the page renders its own `<SiteFooter />` inside the route column (`:93`). The layout puts `<main id="main">` around the slot (`BaseLayout.astro:105-107`).

**Sections, in markup order.**
1. Side column `<div class="side">` (`:69-81`):
   - Breadcrumb `<nav class="crumbs" aria-label="Breadcrumb">` (`:70-75`): `<a href="/tracks">Tracks</a>`, then `<span class="sep" aria-hidden="true">/</span>`, then `<span aria-current="page">{track.title}</span>`.
   - `<h1 class="disp">{head}<em>{last}</em></h1>` (`:76`): "How the Internet" + "Works" in the `em`; "Networking " + "Concepts".
   - `<p class="lede">{track.description}</p>` (`:77`). Descriptions are in `src/content/tracks/how-the-internet-works.ts:13-14` and `networking.ts:12-13`.
   - `<TrackSide client:load entries known>` with one slot, `figures.slice(0, 1)`, as `art<number>` (`:78-80`).
2. Route column `<div class="routebox">` (`:83-94`), containing `<div class="routebox__in">` (`:84-92`):
   - `<TrackRoute client:load parts entries known>` with ALL figures as slots (`:85-87`).
   - `<p class="route__end">` (`:89-91`): conditional "Lessons not ready yet stay on the route, so you can see what is coming. " (only when `someNotReady`, `:90`), then `cross.before`, a link `<a href={`/${cross.to.id}`}>{cross.to.title}</a>`, and `cross.after`. Comment at `:88`: "One line: Astro drops the space at a line break before a link."
   - `<SiteFooter />` (`:93`), inside `.routebox` but outside `.routebox__in`.

**Visible words written in the page's own markup.** Quoted from `[track]/index.astro`:
- "Tracks" (`:72`), "/" (`:73`, aria-hidden), "Breadcrumb" (aria-label, `:70`).
- Title words: from `tracks`' `title` (`how-the-internet-works.ts:12` "How the Internet Works"; `networking.ts:11` "Networking Concepts").
- Lede: "Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each. Start here if you are new to IT: Networking Concepts goes deeper." (`how-the-internet-works.ts:14`). Networking: "How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it. Visual lessons at your own pace: stop anywhere and pick up where you left off." (`networking.ts:13`).
- Closing line (`:89-91`): "Lessons not ready yet stay on the route, so you can see what is coming." (conditional, currently never shown: no track page has a not-ready lesson); "Ready for more? " + "Networking Concepts" + " goes deeper." (on How the Internet Works); "New to IT? " + "How the Internet Works" + " is the gentler start." (on Networking). Words from `:36-37`.
- The page writes no other words of its own. Every other visible word comes from an island or a shared component (below).

**Words the islands render** (TrackSide, TrackRoute, and their helpers):
- Side card (`TrackSide.tsx:52-73`): the strip (`TrackStrip`, Part 3); kicker from `UP_NEXT_KICKER` (`src/lib/hub.ts:106-110`: "Start here", "Up next", "✓ Done so far"; `TrackSide.tsx:65` uses it directly, with no first-visit override, which is `TrackPanelProgress`'s, `TrackPanelProgress.tsx:16`); title (`:66`); line "Lesson NN · subtitle" (`hub.ts:101-103`, `TrackSide.tsx:67`); button "Start" / "Continue" / "Watch again" (`hub.ts:94-98`, `TrackSide.tsx:68-70`).
- Strip caption (`hub.ts:78-84`): "N of M lessons done", with " · R ready" only when some lessons are not ready (none here).
- Route (`TrackRoute.tsx`): each part's title with its last word in `<em>` (`:24-32`, `:54`); a count line "N lessons" / "1 lesson" (`:56`); each ready stop: status from `STATUS_WORDS` ("Not started", "In progress", "✓ Done", `hub.ts:9-14`; `:128`), "Watch" / "Learn" / "Practice" with the aria "In progress" or "In progress, at X" (`PartsMarker.tsx:4,9`; shown only when in progress, `TrackRoute.tsx:129`); the lesson title as an `h3` link (`:131-133`); subtitle (`:134`); button "Start" / "Continue" / "Watch again" (`:136-138`); the stamp (`:139`, `Stamp` with `sources={false}`, text "Checked D Mon YYYY" or "Not checked yet", `src/components/Stamp.tsx:22-37` and `src/lib/stamp.ts:22-23`).
- Soon stop (`TrackRoute.tsx:81-96`): "Not ready yet" (`STATUS_WORDS['not-ready']`) and the title. No track has one today.

**Its own `<style>` block.** One block, `src/pages/[track]/index.astro:97-243`. Rules, by line:
- `.side` padding `:99-101`.
- `.crumbs` `:102-107`, `.crumbs ol` `:108-114`, `.crumbs a` `:115-118`, `.crumbs a:hover` `:119-123`, `.crumbs .sep` `:124-127`, `.crumbs [aria-current]` `:128-130`. Colour tokens: `--muted`, `--ink-strong`.
- `.side h1` 64px, `--ink-strong` `:131-134`.
- `.lede` `:135-140` (16px, `--muted`).
- `.side :global(.strip)` wrap, row-gap 8, margin-top 20 `:142-146`.
- `.routebox__in` padding `:149-151`.
- `.route__end` `:152-157`, `.route__end a` `:158-161` (`--ink-strong`, 600).
- Media `(min-width: 1024px) and (min-height: 600px)`, `:167-203`: `body.split > main` becomes a grid with `--edge` (`:168-173`, `--edge: max(32px, calc((100vw - 1240px) / 2))`); `.side` scroll and padding `:174-178`; `.routebox` scroll, mask fade, `scroll-padding-top: 28px` `:179-191` (`:187`); `.routebox__in` padding `:193-195`; `.routebox :global(.site-foot)` margin and wrap padding `:197-202`.
- Media `(max-width: 720px)`, `:206-234`: stop tile column layout, soon-stop overrides (`:207-233`).
- Media `(max-width: 560px)`, `:235-243`: side and routebox inline padding 20px; `.side h1` 44px.

**Tokens the page's own rules read.** `--muted`, `--ink-strong`, `--edge` (set by the page itself, `:169`). No `--shadow-sm`, no `--r-*`, no `--cs-*` in this file. Everything else is in `hub.css` (Part 3).

**Scripts.** The page has no `<script>` block. The only inline scripts are BaseLayout's theme boot script (`src/layouts/BaseLayout.astro:73`) and the optional analytics beacon (`:118`). The two `client:load` islands are the only JavaScript the page hydrates.

**Islands and their props.**
| Island | File | Props (page passes) | Renders | Reads from the browser |
|---|---|---|---|---|
| `TrackSide` | `src/components/hub/TrackSide.tsx` | `entries`, `known`, slot `art<n>` for the first ready lesson only (`[track]/index.astro:78-80`) | strip (`TrackStrip`), then `.side-now` card with figure, kicker, title, line, full-width button (`TrackSide.tsx:50-75`). Figure: its own slot if given (`:57-60`), else `BorrowedArt` (`:33-44`) | `useUpNext` (`TrackSide.tsx:48`). For a borrowed figure, the DOM: `.stop__slot[data-art="N"]` (`:36`) |
| `TrackRoute` | `src/components/hub/TrackRoute.tsx` | `parts` (`trackParts`), `entries`, `known`, slots `art<n>` for every ready lesson (`[track]/index.astro:85-87`) | `div.route`, one `section.route-stage` per part, one `li.stop` per lesson (`TrackRoute.tsx:47-78`) | `useUpNext` (`:44`); `resumePosition` through `lessonHref`/`lessonStatus` (`:110-112`) |
| `PartsMarker` | `src/components/hub/PartsMarker.tsx` | `parts: [PartMark, PartMark, PartMark]` from `lesson.places[position]` (`TrackRoute.tsx:129`) | `span.wlp` with three bars and names (Watch, Learn, Practice) (`PartsMarker.tsx:7-19`) | none (props only) |
| `TrackStrip` | `src/components/hub/TrackStrip.tsx` | `states`, `words` (`TrackSide.tsx:52`) | `div.strip`, one `i` per lesson, plus the caption (`TrackStrip.tsx:4-14`) | none |
| `useUpNext` | `src/components/hub/useUpNext.ts` | `entries`, `known` | the lesson up next, its label and href, the strip's current key (`:24-37`) | `useProgress(known)` (`:25`); the progress store, below |
| `SiteFooter` | `src/components/SiteFooter.astro` | none (static, rendered by the page at `:93`) | footer with links to both track pages (`SiteFooter.astro:22-23`), "All tracks" (`:24`), "Your progress is saved only in this browser." (`:36`) | none |

Not on this page: `TrackPanelProgress` (Tracks only), and no `covers` import (the page shows no cover).

**Progress store and events.** `useProgress` (`src/progress/useProgress.ts:50-76`) reads localStorage through `createSafeStorage` (`:9`). Key `techconcepts:v2` (`src/progress/store.ts:5`), legacy key `techconcepts:v1` (`store.ts:7`). Listens to the `storage` event for those keys or a null key (`useProgress.ts:65-67,70`), and to the window event `techconcepts:progress-changed` (`:17,21,71`). Until it loads, and when storage is unavailable, `useUpNext` returns the first-visit view (`src/components/hub/useUpNext.ts:26`). No `ready` gate in the islands beyond that.

**How the A+ (planned) track is handled.** Not at all on this page. `plannedTracks` (`src/content/tracks/index.ts:25-34`) is not read by `[track]/index.astro`. `getStaticPaths` maps only `tracks` (`[track]/index.astro:23-27`, `src/content/tracks/index.ts:12` = `[internetTrack, networkingTrack]`). `src/pages/` has no `comptia-a-plus` file or folder (`ls src/pages`: `404.astro`, `[track]`, `about.astro`, `glossary.astro`, `index.astro`, `tracks.astro`). So **`/comptia-a-plus` does not exist as a route**; the static build has no page for it. Inference: an unknown address is served the 404 page (`e2e/site.spec.ts:941`, "/does-not-exist serves the 404 page"). Not verified by a build.

## Part 2: the data (Q2)

**Where the data comes from.**
- The track definitions: `src/content/tracks/how-the-internet-works.ts` and `src/content/tracks/networking.ts`, listed by `src/content/tracks/index.ts:12`.
- The entries: `getEntries(track.id)` (`src/content/registry.ts:371-373`), built by `buildEntries` (`registry.ts:59-100`). An entry is `available: true` only when a lesson file exists for its slug (`registry.ts:89` for `available: false`, `:91` for `available: true`). Ready entries get `url: /<track>/<slug>` and a `canonical` pointing at the home track (`registry.ts:91-96`, `canonical` at `:94`). Each entry's `number` is its place in the track, counting from 1 (`registry.ts:82`).
- The lessons: `getLesson(slug)` from `lessonsBySlug` (`registry.ts:375-377`).
- The parts and lesson stops: `trackParts` (`src/lib/track.ts:68-99`), which pairs each planned lesson with its entry (`:76-77`), throws if a planned slug has no entry (`:77`), and returns `{ n, title, ready, lessons }` per part (`:97`).
- The per-lesson card data: `cardPlaces` (`src/lib/track.ts:106-120`): one place per slot (overview, step, learn, practice). Stamp: `lessonStamp` (`src/lib/checked.ts:20`), words from `src/lib/stamp.ts`.
- The lesson figures: `lessonFigure(entry)` (`src/lib/figures.ts:31-42`). Its name tile for lessons whose home track is How the Internet Works (`figures.ts:32-37`, `nameTile` from `src/art/figures/name-tile.ts:27`). Other lessons: `FIGURES[entry.slug]()` (`figures.ts:39-41`), a table of 16 keys (`figures.ts:7-24`: osi-model, subnetting, dhcp, firewalls, router, arp, ports, nat, ip-address, mac-address, tcp-udp, packets, switch, load-balancers, proxies, vpn), each calling `spot(kind)` (`src/art/figures/spots.ts:507`).
- The track's cover: none. `[track]/index.astro` does not import `covers`.

**Lessons per track, ready and not ready.**
| Track | Parts (lesson counts, in order) | Lessons | Ready | Not ready |
|---|---|---|---|---|
| How the Internet Works (`how-the-internet-works`) | Loading a web page (2), Getting the data there (3), Behind the scenes (3), Email (3), Files and remote control (2), The seal (1) (`how-the-internet-works.ts:18-65`) | 14 | 14 | 0 |
| Networking Concepts (`networking`) | The big picture (2), Addresses & the local network (4), Getting between networks (3), Talking across the internet (4), The web (3), Protecting & scaling traffic (4) (`networking.ts:26-83`) | 20 | 20 | 0 |

- How the Internet Works' 14 slugs: what-is-http, what-is-https, what-is-tcp, what-is-udp, what-is-ip, what-is-dns, what-is-dhcp, what-is-icmp, what-is-smtp, what-is-pop3, what-is-imap, what-is-ftp, what-is-ssh, what-is-tls (`how-the-internet-works.ts:22-64`).
- Networking's 20 slugs: osi-model, packets, ip-address, mac-address, switch, arp, subnetting, router, dhcp, ports, tcp-udp, nat, what-is-dns, what-is-http, what-is-https, what-is-tls, firewalls, proxies, load-balancers, vpn (`networking.ts:31-80`).
- Shared by both: what-is-dns (`networking.ts:61`; `how-the-internet-works.ts:39`), what-is-http (`networking.ts:68`; `how-the-internet-works.ts:22`), what-is-https (`networking.ts:69`; `how-the-internet-works.ts:23`), what-is-tls (`networking.ts:70`; `how-the-internet-works.ts:64`). Their home track is How the Internet Works (`registry.ts:359-361`, `tracksOf` lists tracks in `tracks` order; `index.ts:12`), so they get name tiles on both pages (`figures.ts:32-37`).
- Networking's DHCP is slug `dhcp` (`networking.ts:51`); How the Internet Works' is `what-is-dhcp` (`how-the-internet-works.ts:40`). Different lessons, same title "DHCP".
- Not ready: none. The page renders a soon stop only when `entry.available` is false (`src/lib/track.ts:78`; `TrackRoute.tsx:60-72`). The e2e pins: `soonStops` count 0 on Networking (`e2e/site.spec.ts:605`) and on How the Internet Works (`e2e/site.spec.ts:647`).
- A+: no lessons; it is not a `Track` at all (see Part 1).

**The figures in the HTML.**
- One slot per ready lesson, named `art<number>` (`[track]/index.astro:58-60`): 14 on How the Internet Works, 20 on Networking. Each slot's HTML is the figure string from `lessonFigure`.
- The route gets all of them (`[track]/index.astro:86`). The side card gets only the first ready lesson's (`:79`, `figures.slice(0, 1)`).
- Code reading: the first ready lesson's figure is passed to both the side card (`:79`) and the route (`:86`), so its HTML appears twice on the page. The comment at `:54-57` says the page holds "each figure once and not twice". Not measured here.
- Each name tile is an SVG with `class="name-tile"` (`src/art/figures/name-tile.ts:27`; the e2e test expects `svg.name-tile` on each HIW stop, `e2e/site.spec.ts:648`). Each `spot` is a drawn SVG (`spots.ts:507`).

**Fields computed but not drawn on this page.** `trackParts` fills `meta`, `metaLabel` and `tags` (`src/lib/track.ts:90-92`), and the ready entry carries `summary` and `url` (`registry.ts:91-96`). `TrackRoute.tsx` never reads `meta`, `metaLabel`, `tags`, `summary` or `url` (grep of `TrackRoute.tsx` returns none). The stop uses `lesson.n`, `lesson.key`, `lesson.number`, `lesson.title`, `lesson.subtitle`, `lesson.places`, `lesson.stamp` (`TrackRoute.tsx:61-69`, `:109-145`); the href comes from `lessonHref(entry, data)` (`src/lib/hub.ts:87-91`).

**Other data read by the page.**
- `knownFrom(entries)` gives `{ [key]: maxPosition }` for ready entries (`src/lib/entries.ts:20-22`), which is what `useProgress` takes.
- `stripStates`, `stripWords`, `upNext`, `lessonStatus`, `actionLabel`, `lessonLine` (`src/lib/hub.ts:43-103`).
- `CROSS_LINKS` (`[track]/index.astro:35-38`) is hand-written: a new track needs its own line before it can be built (the comment at `:33-34` says so, and `:40` throws without one).

## Part 3: what it shares with other pages (Q3)

**`TrackStrip`** (`src/components/hub/TrackStrip.tsx`, 15 lines). Imports `hub.css` (`:2`). Used by the track page through `TrackSide.tsx:6,52` and by Tracks through `src/components/hub/TrackPanelProgress.tsx:4,33`. Not used by `TrackRoute`. Its markup: `div.strip`, `span.strip__sq` with one `i` per lesson, `span.strip__w` (`:4-14`). Strip words and states: `src/lib/hub.ts:62-84`.

**`hub.css`** (`src/components/hub/hub.css`, 94 lines). Importers: the track page (`src/pages/[track]/index.astro:21`), Tracks (`src/pages/tracks.astro:14`), and the components `TrackRoute.tsx:7`, `TrackSide.tsx:5`, `TrackStrip.tsx:2`, `PartsMarker.tsx:2`. `TrackPanelProgress.tsx` reaches it only through `TrackStrip`. The file's first comment says "The lesson console's track strip" (`hub.css:1`), which is out of date: it is shared by two pages. Rule by rule, with its users:
| Lines | Rules | Used by |
|---|---|---|
| 2-4 | `.strip`, `.strip__sq`, `.strip__sq i` | track page and Tracks (`TrackStrip`) |
| 5-7 | `.strip__sq i[data-state='ready'|'done'|'current']` | track page and Tracks |
| 8 | `.strip__w` (mono 13px, `--muted`) | track page and Tracks. The track page's strip words are checked as 13px mono at `e2e/tracks-card-stack.spec.ts:781-786` |
| 11-16 | `.wlp`, `.wlp__p`, `.wlp__p i`, `.wlp__p.is-done i`, `.wlp__p.is-now`, `.wlp__p.is-now i` | track page only (`PartsMarker`, `TrackRoute.tsx:129`, in-progress stops only) |
| 19-20 | `.panel__cta`, `.panel__cta .btn` | no markup in `src` or `e2e` uses `panel__cta` (its only hits are hub.css, two unit tests and two e2e assertions). Dead on both pages |
| 21-22 | `.wholetrack` | Tracks only (`TrackPanelProgress.tsx:49`) |
| 25-36 | `.next`, `.next__art`, `.next__art svg`, `.next__art:has(.name-tile)`, `.next__k`, `.next__k.go`, `.next__t`, `.next__s` | no markup in `src` or `e2e` uses `.next`, `.next__*` (grep: only `hub.css` and the Tracks card's `upnext` markup, which is `.upnext`). Dead on both pages |
| 39 | `.side-now` | track page (`TrackSide.tsx:54`) |
| 40-42 | `.side-now__art`, `.side-now__art svg`, `.side-now__art:has(.name-tile)` | track page (`TrackSide.tsx:58`, `:62` via `BorrowedArt`) |
| 43-47 | `.side-now__body`, `.side-now__k`, `.side-now__k.go`, `.side-now__t`, `.side-now__s` | track page (`TrackSide.tsx:64-67`) |
| 48 | `.side-now__btn` | track page (`TrackSide.tsx:68`) |
| 50 | `@media (max-height: 820px) { .side-now__art { display: none } }` | track page |
| 53-54 | `.route` (padding-left 84px), `.route::before` (dashed line) | track page (`TrackRoute.tsx:48`) |
| 55-61 | `.route-stage + .route-stage`, `.route-stage__head`, `.route-stage__mark`, `.route-stage__head h2` (32px), `.route-stage__head p`, `.route-stops` | track page |
| 62-69 | `.stop`, `.stop__node`, `.stop--done .stop__node`, `.stop--now .stop__node` | track page |
| 70-71 | `.stop__tile`, `.stop--now .stop__tile` | track page |
| 72-78 | `.stop__art`, `.stop__art:has(.name-tile)`, `.stop__slot` (both `display:block`) | track page |
| 79-88 | `.stop__info`, `.stop__state`, `.stop__k`, `.stop__k.go`, `.stop__k.done`, `.stop__info h3`, `.stop__info h3 a`, `.stop__info h3 a:hover`, `.stop__sub`, `.stop__acts` | track page |
| 90-94 | `.stop--soon .stop__tile`, `.stop--soon .stop__art`, `.stop--soon .stop__art span`, `.stop--soon .stop__info h3`, `.stop--soon .stop__node` | track page; no soon stop renders on either track today |

- hub.css's own comments name `.lift` (`hub.css:24`, `:38`). The `.lift` rule is in `site.css:224-235`. The track page does not use `lift`.
- `plan.md:24` lists `.next` and `.lift` as hub.css rules shared with the track page. `.lift` is not in hub.css (`site.css:224`).

**`site.css`** (`src/components/site.css`, 240 lines). Imported by: the track page (`[track]/index.astro:20`), `TrackSide.tsx:4`, `TrackRoute.tsx:6`, `TrackPanelProgress.tsx:3`, `Stamp.tsx:2`, `SiteHeader.astro:4`, `src/lesson/Explanation.tsx:2`, `index.astro:20`, `tracks.astro:13`, `about.astro:16`, `glossary.astro:9`, `404.astro:7`. Rules the track page uses:
- `.btn` base (`site.css:3-21`), `.btn--primary` (`:28-32`), `.btn--small` (`:36-40`). Used by `TrackSide.tsx:68` (`btn btn--primary side-now__btn`) and `TrackRoute.tsx:136` (`btn btn--small` or `btn btn--primary btn--small`).
- `.disp` (`:69-74`) on the page's h1 (`[track]/index.astro:76`), the side h1 (`TrackSide.tsx:66`) and the route headings (`TrackRoute.tsx:53`, `:131`).
- `.stamp` family (`:193-222`) through `Stamp` (`TrackRoute.tsx:139`).
- `.name-tile` family (`:107-121`), which colours name tiles on every page that shows one (`site.css:105-106`).
- Not used by the track page: `.lift` (`:224-235`), `.card` (`:122-126`), `.badge` (`:127-160`), `.segbar` (`:163-179`), `.h-chip` (`:88-103`), `.label` (`:79-84`), `.eyebrow` (`:43-59`), `.toc-h` (`:181-187`), `.accent` (`:61-63`). Each of these is in `site.css` for some other page.

**`card-stack.css`** (`src/styles/card-stack.css`, 196 lines). Its header says it is "Imported by Home (src/pages/index.astro) and the Tracks page (src/pages/tracks.astro) only" (`:2-3`). It is imported by exactly those two: `index.astro:21`, `tracks.astro:15`. The track page does not import it, so none of its rules reach the track page today. What it defines:
- Tokens on `:root` (`:9-31`), named `--cs-*`, each set to a Patch token (`--cs-edge: var(--ink-strong)` `:11`; `--cs-card: var(--card)` `:12`; `--cs-act: var(--accent)` `:21`; `--cs-here: var(--here)` `:24`; `--cs-done: var(--allowed)` `:27`). Dark edge `:33-35` and `:36-40`; `--cs-stack: 4px` under 860px `:41-45`. Block marked `TOKENS BEGIN` / `TOKENS END` (`:6`, `:46`).
- Buttons scoped to `main`: `main .btn` (`:50-64`), `main .btn:hover` (`:65-67`), `main .btn--primary` (`:68-72`), `main .btn--primary:hover` (`:73-75`), `main .btn:active` (`:76-79`), `main .btn:focus-visible` (`:80-82`). Their comment (`:48-49`) says "Scoped to main, so the header's 'Start learning' keeps Patch." Any page that imports this file restyles every `.btn` inside `main`, including the track page's side button and stop buttons, since the page's `<main>` is the layout's (`BaseLayout.astro:106`).
- Figure tint, `FIGURE TINT BEGIN` / `END` (`:84-143`): `main, .lm-defs` set `--fig-bg: var(--cs-card)`, `--lit-a` and `--lit-b` to `--cs-here`, `--pool-op: 0`, `--halo-op: 0` (`:87-94`); `#main .lm-svg` anatomy palette (`:95-109`), dark variants (`:110-121`, `:122-135`); `#main .lm-led.on { filter: none }` (`:136-138`); `#main .lm-orbit { display: none }` (`:140-142`). Track-page figures' background is `var(--fig-bg)` (`hub.css:40`, `:74`), so this tint would apply to them if the file were imported.
- Card (`:145-151` `.cs-card`), beneath (`:153-157`), soon (`:159-161`), tab (`:162-184` `.cs-tab`, `:185-188` `.cs-card--soon > .cs-tab`, `:189-196` `.cs-tab--here::before`).
- Scoping: no rule is named for Home or Tracks. Home and Tracks differ in which `cs-` classes their markup carries: Tracks uses `cs-card`, `cs-card--beneath`, `cs-card--soon`, `cs-tab`, `cs-tab--here` (`src/pages/tracks.astro:40-53`). The `/tracks`-only scroll rule is not in card-stack.css. It is `tracks.astro:111-119` (comment at `:111-113`, `:global(html) { scroll-padding-top: 80px }` at `:114-115`, `.panel` `scroll-margin-top: 34px` and `scroll-margin-inline: 16px` at `:117-119`). Job 18's plan decision 6 ("Tracks' own rules stay scoped", `prototypes/d18-tracks-card-stack.md:111`; `plan.md:34`, under job 18's heading at `plan.md:5`) says the track page stays Patch because the shared hub.css must not change look. That decision is written in those two files and is not in card-stack.css.
- `e2e/tracks-card-stack.spec.ts:612-621` asserts `scroll-padding-top` is `80px` on `/tracks` and `auto` on `/`, `/about`, `/glossary` and `/networking`, and `69px` on a lesson (`/networking/dhcp`). So the track page's root has no scroll padding today.

**Who else imports the track page's pieces.**
- `TrackSide`: the track page (`[track]/index.astro:19`, `:78`); `src/components/progress-islands.test.tsx:15`, `:38`; `TrackSide.test.tsx`. No other non-test importer.
- `TrackRoute`: the track page (`[track]/index.astro:18`, `:85`); `progress-islands.test.tsx:14`, `:39`; `TrackRoute.test.tsx`. No other non-test importer.
- `PartsMarker`: `TrackRoute.tsx:9`, `:129`; `hub.test.tsx:4`. Only the route uses it.
- `useUpNext`: `TrackSide.tsx:7`, `TrackRoute.tsx:10`, `TrackPanelProgress.tsx:5`. So the track page and Tracks share the up-next logic (`src/components/hub/useUpNext.ts`).
- `TrackPanelProgress`: Tracks only (`tracks.astro:12`, `:48`); `TrackPanelProgress.test.tsx`.
- `src/lib/hub.ts` (16 unit tests in `hub.test.ts`) is used by the track page and Tracks alike. `src/lib/track.ts` (`trackParts`, `cardPlaces`) is used only by the track page (`[track]/index.astro:15`, `:53`).
- The header and footer: both pages render `SiteHeader` and `SiteFooter` through `BaseLayout` (`BaseLayout.astro:104`, `:112`). The track page passes `footer={false}` and renders `SiteFooter` itself (`[track]/index.astro:68`, `:93`). `SiteHeader`'s `Start learning` button is absent on `current="tracks"` pages, so on the track page (`SiteHeader.astro:15`).

**Links into and out of the track page.**
- Into it:
  - The Lesson page's crumb: `src/lesson/TopBar.tsx:53-58`. "Tracks" links to `/tracks` (`:53`); the track's name is a link `class="track__title"` to `trackUrl` (`:55`).
  - The Lesson page's "Back to the track" button: `src/lesson/Explanation.tsx:226-228`, to `trackUrl`.
  - `trackUrl` is `/${trackId}` (`src/lesson/LessonConsole.tsx:122`), passed to `TopBar` and `Explanation` (`LessonConsole.tsx:351`, `:371`, `:422`). `trackId` comes from the lesson's own track (`src/pages/[track]/[lesson].astro:51`).
  - `src/components/SiteFooter.astro:22-23` (How the Internet Works, Networking Concepts), in the footer of every page with one.
  - The track page's own cross line: `[track]/index.astro:36-37`, `:90`.
  - The redirect `/networking/how-the-internet-works` to `/how-the-internet-works` (`astro.config.mjs:10`). The e2e test is `e2e/site.spec.ts:718-725`.
  - Not into it: Home links to `/tracks#<track id>` (`src/lib/home.ts:415`, `src/pages/index.astro`), not to the track pages. The Tracks card's title links to the track page (`src/lib/tracks-page.ts:58`, `href: /${track.id}`).
- Anchors: no link targets an id on the track page. The route's ids `stage-<n>` (`TrackRoute.tsx:53`) are not linked anywhere (grep of `src` and `e2e` for `#stage-` returns nothing). The `?step=` query is added by `lessonHref` to the lesson links on the track page (`src/lib/hub.ts:87-91`).
- Out of it: each ready stop links to `/<track>/<slug>` (`TrackRoute.tsx:132`, `:136`, `:119`); the side card's button likewise (`TrackSide.tsx:68`); the breadcrumb to `/tracks` (`[track]/index.astro:72`); the closing line to the other track (`:90`).

## Part 4: the tests that pin it (Q4)

**Unit tests** (counts are `it`/`test` declarations in the file; "names the page" means the test text or code reads the page's file or its markup):
- `src/components/hub/TrackSide.test.tsx`: 11 tests, `describe` at `:27`. Pins: first visit "Start here", the first ready lesson, a full-width Start button, no amber square (`:28-38`); Up next with Continue (`:39-47`); Watch again (`:48-54`); strip only when no lesson is ready (`:55-61`); figure hidden from assistive tech (`:62-66`); the figure swaps when progress loads (`:67-79`); blocked storage (`:80-93`); hydration with saved progress (`:94-125`); a borrowed figure (`:126-142`); the figure inside Astro's slot wrapper (`:143-155`); no route on the page (`:156-164`).
- `src/components/hub/TrackRoute.test.tsx`: 13 tests, `describe` at `:31`. Pins: first visit (`:32-45`); fact-check stamp per ready stop (`:46-55`); stage h2 with its last word in `em`, and the count (`:56-66`); a not-ready outline stop (`:67-82`); figure link out of the tab order (`:83-92`); in-progress marker and amber stop (`:93-107`); finished "✓ Done" (`:108-120`); heading order (`:121-127`); keyed figure (`:128-136`); blocked storage (`:137-152`); all done (`:153-161`); hydration (`:162-185`); `data-art` for the side card's borrow (`:186-…`).
- `src/components/progress-islands.test.tsx`: 6 tests. `describe('the track page')` at `:34` holds one test, `ResetProgress clears the side card and the route at once` (`:45`). The other five are `describe('ResetProgress')` (`:59`).
- `src/components/hub/hub.test.tsx`: 3 tests (`TrackStrip` at `:7`, `PartsMarker` at `:19`, `:31`). Used by the track page and Tracks alike.
- `src/lib/track.test.ts`: 9 tests (`trackParts` and `cardPlaces`, which only the track page uses). Includes `How the Internet Works: six parts, every lesson ready, numbered 01 to 14` (`:36`), and `a lesson the registry lists as ready but the page cannot find stops the build by name` (`:114`).
- `src/lib/hub.test.ts`: 16 tests (`describe` count 7). Covers `upNext`, `stripStates`, `stripWords`, `lessonHref`, `actionLabel`, `lessonLine`. Shared with Tracks.
- `src/lib/tracks-render.test.ts`: 18 tests, two pin this page's files:
  - `the shared Card stack stylesheet` / `is imported by Home and the Tracks page and by nothing else` (`:197-203`): it greps `import .*card-stack\.css` in `src` and expects exactly `src/pages/index.astro` and `src/pages/tracks.astro` (`:199-202`). Adding the track page as an importer fails this test.
  - `the page's own rules reach nothing outside it: hub.css, the track page, the header and the footer are not in the page's diff` (`:205-208`): `git diff --name-only e6441c2 -- src/components/hub/hub.css src/components/hub/TrackStrip.tsx src/components/hub/useUpNext.ts src/lib/hub.ts "src/pages/[track]/index.astro" src/styles/tokens.ts src/components/SiteHeader.astro src/components/SiteFooter.astro` must print nothing. Run here (read-only): it printed nothing, so it passes today. Any edit to the track page or to `hub.css` or `hub.ts` after commit `e6441c2` ("docs: D18's errata E1-E10…") fails it until the base is changed.
- `src/lib/tracks-render.test.ts:210-218` checks `tracks.astro` (not the track page) for `shadow-sm`, `task 8`, `.isl`, `scroll-snap`, `pl-1`, `var(--link)`.
- `src/lib/home.test.ts` (41 tests) reads `src/styles/card-stack.css` and `src/pages/index.astro` (`:330`, `:350`). It does not name the track page.
- Not read in detail, named for completeness: `src/content/tracks/how-the-internet-works.test.ts` (32 declarations; it tests the How the Internet Works definition), `src/lib/figures.test.ts` (6; `lessonFigure`), `src/lesson/TopBar.test.ts` (the lesson's crumb), `src/components/hub/TrackPanelProgress.test.tsx` (14; Tracks, with a test at `:56` "the track page keeps it" for "Start here").
- No unit test imports `src/pages/[track]/index.astro` itself. The lesson page's file is imported by `src/lesson/no-script.test.ts` and `src/lesson/definitions.no-script.test.ts` (`:13`), not the track page.

**End-to-end specs that visit the track page** (`/how-the-internet-works` or `/networking`; `e2e/` file:line of each test, what it asserts):
- `e2e/site.spec.ts`:
  - `:80` `the share image has its description…`: visits `/networking` (`:83`) and checks `og:image:alt` once.
  - `:365` `Home, Tracks, the track pages and About show no time figure` (`:366`).
  - `:372` header Tracks link and footer All tracks link on every page of `ALL_PAGES`, with `aria-current="true"` on both track pages (`:373-388`, the expected value at `:381`).
  - `:390` `Start learning … is absent on Tracks and the track pages; the footer lists How the Internet Works above Networking` (`hasNoStart` `:391`, the footer order `:406`).
  - `:450` `the footer lists Glossary after All tracks…`: the Learn list on `SITE_PAGES`, which includes both track pages (`:456`).
  - `:463` `the menu button takes over at 959px…`: the "Start learning" button is absent on the track pages (`:474`).
  - `:531` (inside `describe('Tracks page')`, `:486`): clicking Networking's title on Tracks lands on `/networking` (`:531-532`).
  - `describe('Track page')` at `:587`:
    - `:588` `Networking lists 20 stops in its parts, all ready, OSI Model first with Start`: 20 stops (`:596`), 20 ready (`:601`), the h3 texts in order (`:602`), `what-is-dns` links to `/networking/what-is-dns` (`:604`), 0 soon stops (`:605`), the first Start, the side card's "Start here" and button, "0 of 20 lessons done", no `main button`, the route's end line and link (`:611-626`).
    - `:629` `every ready stop says its lesson is checked, with the day`: the `Checked D Mon YYYY` stamp on each ready stop (`:630-637`).
    - `:639` `How the Internet Works has six parts and a name tile on each of 14 stops`: six part titles (`INTERNET_PARTS`), 14 stops (`:646`), 0 soon (`:647`), `svg.name-tile` on each (`:648`), the `what-is-tls` tile's aria-label and two `.nt-full` (`:649-650`), the side card's Start to HTTP (`:652-653`), "0 of 14 lessons done" (`:654`), the closing line "Ready for more? Networking Concepts goes deeper." and its link (`:657-658`).
    - `:661` `at 1440×900 the window does not scroll; the route scrolls to its last stop and the side card's button does not move`: `pageOverflow` down 0, the route scrolls, the last stop in view, `window.scrollY` 0, the side button's box unchanged, the header in view.
    - `:687` `at 1280×720 the side card's button is in view` (both track pages): `.side-now__art` hidden, the button in view.
    - `:698` `?for=network-plus lists every lesson, no error` (`/networking?for=network-plus`): 20 stops, no `main button`, no console errors.
    - `:708` `breadcrumb Tracks goes to /tracks`: the breadcrumb text, `aria-current`, and the click.
    - `:718` `the old lesson address forwards to the track`: `/networking/how-the-internet-works` (and `?step=7`, and a trailing slash) redirect to `/how-the-internet-works` (`:720-723`; the redirect is `astro.config.mjs:10`).
  - `:777` `progress is by lesson: … opening it there makes Networking the last track`: opens `/networking` (`:779`); checks `lastTrack` in storage (`:784`).
  - `:788` `finishing DHCP shows ✓ Done on the track and 1 of 20 done on Tracks…`: opens `/networking` (`:793`).
  - `:838` `progress saved before this update still shows, then moves to the new record`: opens `/networking` (`:848`).
  - `:861` `a visitor partway through the old lesson keeps their place`: opens `/how-the-internet-works` (`:873`).
  - `:966` `no page scrolls sideways, at the top or at the bottom`: loops `ALL_PAGES`, which includes both track pages (`:967-972`).
  - `:959` `no page carries an analytics script without a token`: loops `ALL_PAGES` (`:960-962`).
  - `:979` `no page shows the header's theme toggle…` (JavaScript off): loops `ALL_PAGES` (`:981-985`).
  - `:987` `every lesson is listed and the first ready one says Start` (JavaScript off): `/networking` (`:988`).
  - `:1021` `describe('phone', { tag: '@phone' })`, `:1025`: `${path} loads and scrolls with no errors` for each `SITE_PAGES` entry, including both track pages: status 200, height taller than the screen, a wheel scroll, the scroll to the end (`:1025-1040`).
- `e2e/tracks-card-stack.spec.ts`:
  - `:612` `the root scroll-padding-top is 80px on /tracks … auto elsewhere`: `/networking` must read `auto` (`:618`).
  - `:776` `the track page and the rest of the site are untouched`: `/networking` keeps its Patch strip and buttons, light and dark (`:779-792`): squares 9×12 (`:782-783`), the strip words mono 13px (`:784-786`), the side kicker "Start here" (`:787`), the button's border not 2px and no `3px 3px 0` shadow (`:789-791`).
  - `:793` `… does not read the Card stack's names`: `/networking` (among `/about`, `/glossary`, `/does-not-exist`, `/networking/dhcp`) has an empty `--cs-edge` (`:794-798`).
- `e2e/lesson-layout.spec.ts`:
  - `:541` `14: the track page's lesson cards and Home's demo still show the stamp`: opens `/networking` (`:542`), more than five `Checked …` stamps (`:543-545`).
  - `:659` case 36 (forward button at every place of every ready lesson): does not visit the track page; it fetches `/networking`'s HTML at `:661` to list the lesson links.
- `e2e/router.spec.ts`:
  - `:186` `the Networking track page shows Router's spot at its stop … (check 24)`: `goto('/networking')` (`:189`); the router stop's `svg[role="img"]` aria-label (`:190-195`); the stop is index 7 (`:197-199`).
- `e2e/batch1.ts:85-96` `checkCard(page, slug, stop, aria)`: `goto('/networking')` (`:88`); checks the lesson's stop, its figure aria-label and its index. Called from 11 spec files: `arp.spec.ts:43`, `ip-address.spec.ts:32`, `nat.spec.ts:86`, `load-balancers.spec.ts:178`, `packets.spec.ts:122`, `mac-address.spec.ts:102`, `proxies.spec.ts:191`, `ports.spec.ts:49`, `switch.spec.ts:107`, `tcp-udp.spec.ts:51`, `vpn.spec.ts:327`.

**`@visual` screenshots of the track page.** `e2e/visual.spec.ts:54` `test.describe('screenshots', { tag: '@visual' })`. The loop `for (const { name, path } of SITE_PAGES)` (`:84`) takes a full-page screenshot per page, named `visual/<name>-<w>x<h>-<theme>.png` (`shoot` at `:74-81`, the path at `:78`), so `track-internet` and `track` (`support.ts:47-48`). Sizes 1280×800, 1366×768, 1440×900, 1920×1080 (`SIZES`, `:13-18`) and themes dark and light (`THEMES`, `:19`). The spec's header comment (`:6-11`) says it runs in one project only (d1440-dark).

**`e2e/global-setup.ts` and `e2e/support.ts` depend on the track page's markup:**
- `global-setup.ts:16-18`: goes to `/tracks` and reads `main article.panel h2 a` hrefs for the track paths. Throws if none (`:20`).
- `global-setup.ts:22-40`: on each track path, `page.goto(path)` (`:23`), then reads `main .route li.stop:not(.stop--soon)`, its `h3 a` and its `.stamp` text (`:24-33`). Throws when a track links no ready lesson (`:37`) or a stamp does not start with "Checked" (`:40`).
- `support.ts:39-42` `lessonCard`: `main .route li.stop:not(.stop--soon)` with `h3 a[href$="/<slug>"]`.
- `support.ts:34-36` `requireLessons`: fails if global setup found no ready lesson.
- `support.ts:44-50` `SITE_PAGES`: the track pages are `{ name: 'track-internet', path: '/how-the-internet-works' }` (`:47`) and `{ name: 'track', path: '/networking' }` (`:48`).
- `site.spec.ts:53-64` helpers, which are the track page's markup contract: `routeStops` `main .route .route-stage li.stop` (`:54`), `readyStops` `main .route li.stop:not(.stop--soon)` (`:55`), `soonStops` `main .route li.stop--soon` (`:56`), `stageTitles` `main .route .route-stage h2` (`:57`), `routeBox` `main .routebox` (`:59`), `stripWords` `main .side .strip__w` (`:61`), `sideButton` `main .side .side-now__btn` (`:62`), `stateOf` `.stop__k` (`:64`).
- Selectors used directly by specs: `e2e/lesson-layout.spec.ts:543` selects `main .route li.stop:not(.stop--soon) .stamp`; `e2e/tracks-card-stack.spec.ts:782` and `:787` select `main .strip__sq i` and `main .side-now__k`; `:789` selects `main .btn` (the Card stack spec reads the track page as Patch).

## Part 5: the narrow-screen rules (Q5)

**Media queries on the page** (`src/pages/[track]/index.astro`):
- `:167` `@media (min-width: 1024px) and (min-height: 600px)`, `:167-203`. The large-screen split: the window does not scroll, the side column and the route each scroll (`:163-166` comment). It is the same breakpoint as `src/styles/global.css:192` (`body.split`, `global.css:190-205`), so both must change together.
- `:206` `@media (max-width: 720px)`, `:206-234`. Stop tiles stack (`:207-211`); soon-stop overrides (`:215-233`). The comment at `:215-216` says: "A lesson that is not ready has nothing to picture. On a phone it is two short lines, so a track with many still to write is not mostly placeholders."
- `:235` `@media (max-width: 560px)`, `:235-243`. Side and route inline padding 20px (`:236-239`); `.side h1` 44px (`:240-242`).

**Media queries in `src/components/hub/hub.css`:** one, `hub.css:50`, `@media (max-height: 820px) { .side-now__art { display: none; } }`. Its comment, `hub.css:49`: "Short screens: the card drops its figure, so Start or Continue stays in view." It is a height rule, not a phone rule.

**Media queries in the shared files the page loads:**
- `src/styles/global.css:192` `(min-width: 1024px) and (min-height: 600px)` for `body.split` (`:190-205`), and `global.css:179` `prefers-reduced-motion: reduce`.
- `src/components/site.css:236` `prefers-reduced-motion: reduce` (`.lift:hover` only).
- `src/layouts/BaseLayout.astro` has no media query. Its `split` prop is documented as "Below that it is an ordinary page" (`BaseLayout.astro:42-44`).
- `card-stack.css:41` `(max-width: 860px)` and `:36`, `:122` `prefers-color-scheme: dark`. These reach the track page only if it imports `card-stack.css`, which it does not.

**Comments that say the phone layout is not designed:**
- `src/pages/[track]/index.astro:205`: `/* ---------- Narrow screens: not designed yet (task 8), only kept from breaking ---------- */`. This is the only such comment in the page or in `hub.css`.
- The page's header comment says "Below that size it is an ordinary page, the side card above the route" (`index.astro:4-5`). That describes the layout below 1024px; it does not say the phone design is unfinished.
- `direction.md` 2.85 (line 112) says "the page's styles say 'not designed yet (task 8)'" and that Tracks' phone layout "is designed for the first time". That was about `tracks.astro` before job 18; the track page still carries the comment.

**Below 1024px, what the page does** (no rule of its own): the body is the normal flow (`global.css:190-205` applies only at 1024 and up), so `.side` comes first and `.routebox` below it, with the `.routebox` mask and scroll rules off (`:179-191` are inside the 1024 media query). `SiteFooter` sits at the end of the page (`index.astro:93`).

## Part 6: leftovers (Q6)

**Tokens that paint nothing.**
- `--shadow-sm` is `0 0 0 0 transparent` in both themes (`src/styles/tokens.ts:84`, `:120`). The comment at `tokens.ts:47-49` says: "`shadow-sm` and `btn-shadow` paint nothing … They are a zero-size transparent shadow, not the keyword `none`, because rules list them beside a hover ring."
- The track page reads it in `hub.css:39` (`.side-now`, `box-shadow: var(--shadow-sm)`), `hub.css:70` (`.stop__tile`), and `hub.css:71` (`.stop--now .stop__tile`, where the first value is a 2px ring in `--here` and the second is `--shadow-sm`).
- `btn-shadow` (`tokens.ts:86`, `:122`) is also zero-size, and the track page does not read it.
- `site.css:225` and `:234` (`.lift`) and `src/lesson/console.css:71` also read `--shadow-sm`. Not the track page.

**Dead rules and unused classes** (grep of `src/` and `e2e/` for each class name in markup, not in CSS):
- `hub.css:19-20` `.panel__cta`, `.panel__cta .btn`: no markup uses `panel__cta`. Its hits are `hub.css`, `TrackPanelProgress.test.tsx`, `tracks-render.test.ts`, and `e2e/tracks-card-stack.spec.ts`. Tests mention it; no page renders it.
- `hub.css:25-36` `.next`, `.next__art` (and `svg`, `:has(.name-tile)`), `.next__k`, `.next__k.go`, `.next__t`, `.next__s`: no markup in `src` or `e2e` uses these classes. Tracks now uses `.upnext` (`TrackPanelProgress.tsx:35-53`). The track page uses `.side-now`. Hub.css's `.next` family is unused on both pages.
- `hub.css:21-22` `.wholetrack`: used by `TrackPanelProgress.tsx:49` (Tracks), not by the track page.
- `hub.css:90-94` and `index.astro:215-233`: the not-ready styles (`.stop--soon`, and the phone overrides for it). No track has a not-ready lesson, so they style no element on either page today. They are not dead code; they are unexercised.
- `src/components/hub/TrackSide.tsx:13-14` and `TrackRoute.tsx:17-18`: `children?: ReactNode` props marked "Unused; the page's default slot." The page passes no default slot content to either island (its slots are `artN` only).

**Computed but not drawn on the track page.** `trackParts` fills `meta`, `metaLabel`, `tags`, `summary`, `url` (`src/lib/track.ts:81-95`; `summary` and `url` come from `registry.ts:91-96`). `TrackRoute.tsx` reads none of them (grep). `cardPlaces` fills `note` for each place (`src/lib/track.ts:19-20`, `:108-120`); `TrackRoute` reads `places` only for its `.length` (`TrackRoute.tsx:112`) and `places[position].parts` (`:129`). `src/lib/track.ts` `ReadyLesson.meta` is also for the card's "Protocols and exams" line, which is not on this page.

**Stale and duplicated comments.**
- `hub.css:1` says the file is "The lesson console's track strip". It is shared by the track page and Tracks.
- `TrackSide.tsx:19-26` and `:27-32`: two JSDoc blocks in a row, before `BorrowedArt` (`:33`). The first describes the whole card ("The track page's left column below the title ...") but sits above `BorrowedArt`, and `TrackSide` itself is at `:46`.
- `[track]/index.astro:54-57` says each figure is in the HTML "once and not twice"; the first ready lesson's figure is passed to both `TrackSide` (`:79`) and `TrackRoute` (`:86`), so it is there twice (Part 2).
- `[track]/index.astro:88` comment: "One line: Astro drops the space at a line break before a link." The `route__end` paragraph is written on several lines (`:89-91`) to rely on that.

**Other.**
- `.routebox` has `scroll-padding-top: 28px` (`index.astro:187`) with a comment about focus rings. The `/tracks` page instead sets `:global(html) { scroll-padding-top: 80px }` (`tracks.astro:114-115`). This is the only scroll-padding on the track page; the root has none (`e2e/tracks-card-stack.spec.ts:618`).
- The page's `<style>` has `.side h1` at 64px (`index.astro:131-134`) and at 44px under 560px (`:240-242`); `.disp` sets the line-height and weight (`site.css:69-74`).

## Part 7: what the direction doc says (Q7)

`docs/direction.md` §11 is "## 11. The track page, About and 404 (built 2026-11-10)" (`docs/direction.md:480`). Its track-page paragraph, as written (quoted, not corrected):
- `:482` "**The track page keeps its layout.** The owner designed it on 2026-11-09 (a fixed side column, a route that scrolls) and has since kept the Tracks and Lesson pages as they are, so this page was not redrawn. What changed is what was measured:"
- `:484` "**Each lesson's figure is in the HTML once** (audit plan 005). The side card is given only the figure a first visit shows and borrows any other from the route on the same page. `/networking` is 65.8 KB gzipped, from about 101 KB; each new lesson now costs about half of what it did."
- `:485` "**Labels are sentence case**: "Start here", "Up next", "Not ready yet", on this page and on Tracks."
- `:486` "**On a phone a lesson that is not ready is two short lines**, with no placeholder tile. Networking has 15 of them: the page is 4,821px tall at 390 wide, from 6,444px."

Against the code today: `/networking` has no not-ready lesson (`e2e/site.spec.ts:605`), so the "15 of them" and "two short lines" bullet describes a state that is not in this revision. The 65.8 KB figure is the doc's, not measured here. "Start here" is in the side card (`hub.ts:107`).

The §11 About and 404 paragraphs are not about the track page.

**Other lines in `docs/direction.md` that name the track page:**
- `:168` (roadmap Phase 2): "6. **Home, the track page, About and 404.** DONE 2026-11-10. ... The track page keeps its layout and is lighter; ..."
- `:211` (§4 evidence): "Other pages on a phone: Home 7,722px, the Networking track page 6,353px, About 6,457px, Tracks 3,211px."
- `:224` (§6): "**Since 2.84 (the owner, 2026-11-16) Patch is the Lesson page's look and the header's and footer's; every other page moves to Card stack (§9), one job at a time.** Until a page has moved, it keeps Patch."
- `:255` (§6, prototype): "**Not in the prototype:** the scene's motion, the Tracks page, the track page, About and 404."
- `:259` (§6): "Small capitals in page-level styles (Tracks' "Start here", the track page's stop labels, About's table headings)."
- `:293` (§7): "**The stamp is no longer on the Lesson page** (2.97). It stays on the track page and Home's demo."

**Decisions 2.84 to 2.89 (`docs/direction.md:111-116`), the words that name the track page:**
- 2.84 (`:111`), owner, 2026-11-16: "Card stack replaces Patch on every page but the Lesson page". The orchestrator's ruling: "the pages move one job at a time, each through the design gate: Tracks first (job 18, 2.85), then the track page, About, the Glossary and 404, in an order set when each is planned".
- 2.85 (`:112`), orchestrator, 2026-11-16: "Scout facts: `prototypes/s20-tracks-facts.md` (3 panels, 14 + 20 ready lessons, A+ none; 13 unit tests and 5 end-to-end tests pin the page; ...)". That is the Tracks page; it also says "the page's styles say 'not designed yet (task 8)'", which is in the track page's file (`index.astro:205`).
- 2.86 (`:113`), owner: "The header and footer stay (2.84)." It is about Tracks. Its ruling list does not name the track page.
- 2.87 (`:114`), owner, 2026-11-16: "**Frozen:** `prototypes/d18-tracks-card-stack.html` and `.md`, layout 1 as drawn ... The track page's side card keeps "Start here" until that page moves to Card stack."
- 2.88 (`:115`): E9 is about Tracks' Networking card ("Always leave room for two lines"), not the track page's side card.
- 2.89 (`:116`), orchestrator, 2026-11-17: "**Follow-up, not taken:** the site has no rule keeping keyboard focus clear of its sticky header; today's other pages should be measured the same way (E11 is on `/tracks` only)." The track page is one of the "other pages"; `tracks-card-stack.spec.ts:618` pins its scroll padding to `auto`.

## Part 8: measured (the orchestrator)


Built on `revamp` fb02521 (`npm run build`, "Every page is within budget (42 pages)"), served from `dist/`, headless Chromium, light scheme, a first visit.

| | `/how-the-internet-works` | `/networking` | `/tracks`, for comparison |
|---|---|---|---|
| 1440 × 900: page height | 900px (one screen) | 900px (one screen) | 1,599px |
| 1440 × 900: the route box (`div.routebox`) | 831px shown of 3,861px | 831px shown of 5,018px | |
| 375 × 812: page height | 7,129px | 9,544px | 2,368px |
| 320 × 640: page height | 7,257px | 9,897px | 2,533px |
| Sideways scroll at 1440, 375, 320 | none | none | none |
| HTML gzipped (the build's budget table) | 11.8 KB | 221.9 KB (budget 250 KB) | 59.8 KB |
| HTML raw | 90,838 bytes | 1,076,731 bytes | 287,632 bytes |
| `<script>` elements | 4 | 4 | 4 |

**Where `/networking`'s weight is.** 17 SVGs over 5,000 bytes, 16 distinct: the first lesson's figure (OSI Model) is in the HTML twice, once in the side card and once on its stop, against the comment at `[track]/index.astro:54-57`. Those 17 are 964,736 bytes raw; without them the page is 14.4 KB gzipped, so the lesson figures are about 206 KB of its 222 KB. How the Internet Works' stops carry name tiles (small SVGs), so that page is light. Each new Networking lesson with a drawn spot adds about 13 KB gzipped.
