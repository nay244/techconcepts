# S27 facts for job 30 (read-only scout, revamp at 3341203)

Method: Grep, short excerpts, and read-only Python over `dist/` and `src/` (scratch scripts in the session scratchpad). No build, no end-to-end run, no tracked file changed; `git status` was clean. Line numbers are from the working tree at 3341203. Gzip sizes in section H use Python's gzip at level 9, so they differ a little from `check-budgets.mjs`, which uses Node's default level.

## A. What the console assumes about having one lesson

### A1. Props (`src/lesson/LessonConsole.tsx:61-82`, `LessonConsoleProps`)

- `trackId: string` (62), `trackTitle: string` (63), `lesson: Lesson` (64), `entry: AvailableSummary` (65), `total: number` (67, "Every lesson the track plans, written or not").
- `next: AvailableSummary | null` (69), `nextFigure: string | null` (71), `entries: LessonSummary[]` (73), `definitions?: Record<string, LessonDefinition>` (75), `figure?: ReactNode` (77), `figureData?: unknown` (79), `navigate?: (url: string) => void` (81).
- The component signature (111) destructures all of them and sets the default `navigate = (url) => window.location.assign(url)`.

### A2. `navigate`

- Its one call is `LessonConsole.tsx:245`: `if (forward.href !== undefined) navigate(forward.href);`, inside `pressForward` (243-252). `forward.href` exists only at the last Practice of a lesson with a next ready lesson (`src/engine/playback.ts:197-204`, `href: end.next.url`).
- The prop's comment (`LessonConsole.tsx:80`): "Opens a page: 'Next lesson' at the last Practice. Left out, the browser's own navigation; tests hand in their own."
- Page caller: `src/pages/[track]/[lesson].astro:49-63` does not pass `navigate`, so the page uses the default `window.location.assign`.
- Test callers: `src/lesson/LessonConsole.flow.test.tsx:36` (`const navigate = vi.fn();`), `:52` (passed in), `:91` (`mockReset`). `src/lesson/LayoutEffects.test.tsx:102` passes `navigate={() => {}}`.

### A3. State, refs and effects in `LessonConsole.tsx` and its children

Each item: the line, what it holds, and whether it re-runs when a prop it reads changes.

LessonConsole.tsx:
- 113 `usePlayback(lesson, …)`. `src/engine/playback.ts:239-240`: the reducer is `useMemo(…, [lesson])`, and the state is `useReducer(reducer, undefined, initialPlayback)`, so the state is set only at mount (`initialPlayback` at `playback.ts:50-52` returns position 0, eventIndex 0, mode idle, speed 1). A new `lesson` does not reset `position` or `eventIndex`. The timer effect at `playback.ts:252-266` has deps `[lesson, state]` and re-runs.
- 115 `derived = useMemo(deriveState(lesson, position, eventIndex), [lesson, position, eventIndex])`: re-runs on a new lesson.
- 117 `unit = lesson.units[derived.unit]!`, 119 `trackUrl = /${trackId}`, 140 `panelTab`, 146 `change`, 185 `tableInGuide`, 190 `forwardForm`, 242 `forward = forwardButton(lesson, state, {next, number, total})`, 285-295 `record`/`resumeAt`/`resume`, 300-308 `latest`/`fresh`/`step`/`announcement`/`idle`: plain per-render values, all follow the props.
- 120 `go` (`useCallback`, deps `[dispatch]`); 124-130 `jump` (deps `[go]`); 168-174 `goFromOutline` (deps `[go]`).
- 123 `explanation` ref and 138 `consoleEl` ref: not prop-set, never reset.
- 139 `tab` (`useState('explain')`): not prop-set; kept across a swap. 142-144 effect deps `[tab, panelTab]`: resets the tab only if the new unit has no table tab.
- 147 `changeSeen` (`useState(null)`): not prop-set; kept. 149-153 layout effect deps `[tab, change]`.
- 156-165 effect deps `[]`: reads `matchMedia` once at mount.
- 183 `guideTable` (`useState`), set through the ref callback at 400: not prop-set.
- 191 `sheetOpen` and 223 `logOpen` (`useState`): not prop-set.
- 195 `rowHome` (`useMediaQuery`, `src/lesson/useMediaQuery.ts:8-16`, deps `[query]`). 196 `stopFocus` ref; 203-209 effect `[]`; 210-218 effect `[rowHome]`: none reads a prop.
- 226 `seen` (`useState(() => new Set([0]))`), 227-229 effect deps `[derived.unit]` adds the unit index. Nothing clears `seen`, so unit indices from the old lesson stay in the set.
- 232 `picks` (`useState({})`), keyed by `unit.id` (233 `unitPicks`, 234-238 `pick`). Nothing clears it on a new lesson. The scout did not check whether unit ids are unique across lessons (ids such as `lease-add` at `src/content/lessons/dhcp.ts:144` are per lesson).
- 253-259 `useLessonShortcuts({toggle, next, prev})`. `src/lesson/useLessonShortcuts.ts:22-25` keeps the latest actions in a ref (an effect with no deps); `:27-48` adds the window `keydown` listener in an effect with deps `[]`.
- 264 `known = useMemo(knownFrom(entries), [entries])`: re-runs on a new `entries`. `src/lib/entries.ts:20-22` maps each available entry's key to its `maxPosition`.
- 265 `progress = useProgress(known)`. `src/progress/useProgress.ts:50-98`: the load effect (59-76) has deps `[storage]` and runs once at mount; `knownRef` is refreshed on every render (53-57); `update` (78-90) has deps `[storage]` and reads `knownRef`.
- 267 `deepLinked` (`useState(false)`): set true only in the effect at 273; never reset.
- 270-278 effect, deps `[lesson, dispatch]`: re-runs when the `lesson` prop changes. It reads `window.location.search` (271), calls `parseStepParam(window.location.search, lesson)` (`src/engine/timeline.ts:269-274`), and if the result is not null it calls `setDeepLinked(true)` (273), `setSeen(new Set([slotsFor(lesson)[target]!.unit]))` (276) and `dispatch({type:'go', position: target})` (277).
- 281-283 effect, deps `[update, entry.key, entry.trackId, entry.maxPosition, position]`: calls `recordVisit` (`src/progress/store.ts:210-228`). Re-runs on a new `entry` and on each position change.
- 123, 138 and 226 hold values that a swap would carry forward unless something resets them (see the bullets above).

ScenePanel.tsx (props from `LessonConsole.tsx:351-358`; `ScenePanel` at 119):
- 121 `chosen` (`useState('network')`): not prop-set. `view` (122) is `hasSequence ? chosen : 'network'`, so a choice made in one unit carries into the next unit that has a Sequence view.
- 124 `marks` (`useState`): not prop-set; cleared in the play effect's cleanup (`setMarks(NO_MARKS)`, 184 area).
- 127 `figureBox` ref (the `div.stage__figure`, 248) and 128 `driver` ref: not prop-set.
- 134-145 layout effect, deps `[figureData]`: runs at mount and whenever the `figureData` object's identity changes. It finds `svg[data-figure]` in the DOM (135), calls `DRIVERS[id].create(svg, figureData)` (138), and in cleanup calls `running.current?.abort()`, `driver.current = null` and `made.destroy()`. It does not depend on the `figure` prop or on the SVG's markup.
- 147 `scene = useMemo(sceneViewOf(unit, derived), [unit, derived])`: re-runs on a new unit.
- 153 `playedFor` ref and 154 `hold` ref: not prop-set.
- 156-184 layout effect, deps `[view, scene, playback, pending, reducedMotion, figureData]`: calls `d.show(scene)` on every change and starts a play when the playback state is new.
- 198 `sectionRef`; 199 `place` (`useRef` with the value from the first render only); 200-212 effect with no deps, which compares `place` by value.

Explanation.tsx (props from `LessonConsole.tsx:382-398`):
- 245 `deeperOpen` (`useState(false)`) and 247 `openDefs` (`useState(new Set())`, "in memory for as long as the lesson is open"): not prop-set and not keyed by lesson.
- 255 `ownPanel` ref. 258-260 layout effect, deps `[panel, position]`: resets the panel's `scrollTop` to 0 on each position change.

Outline.tsx (props from `LessonConsole.tsx:334-349`):
- 211 `dialog` ref and 214-225 effect deps `[open]`: opens or closes the dialog.
- 275 `filter` (`useState('all')`): not prop-set.
- 277 `list` ref and 280-287 effect deps `[]`: scrolls the current row into view on mount only, so the list's scroll position is not recomputed after a swap.

PlaybackControls.tsx: 62-64 refs, 64 `fits` (`useState(true)`), 66-82 layout effect deps `[mode, fullWords]`. `fullWords` comes from the `forward` prop, so it re-runs when the forward label changes.

LogPanel.tsx: 139 `scroller` ref and 141-144 layout effect deps `[rows.length, fold?.open]`.

Timeline.tsx, TopBar.tsx and Practice.tsx contain no hooks (grep of `use(State|Ref|Effect|LayoutEffect|Memo|Reducer)` in `src/lesson/` finds none in these three files).

### A4. `?step=` and the address

- Read: `LessonConsole.tsx:271` (`window.location.search`), inside the effect at 270-278, which runs at mount and again whenever the `lesson` prop changes. Parser: `src/engine/timeline.ts:269-274`: digits only (`/^\d+$/`), clamped to `slotsFor(lesson).length - 1`.
- Write: none. `grep` for `history.` and `location.` in non-test `src/` finds only `LessonConsole.tsx:111` (`window.location.assign`, the default `navigate`), `LessonConsole.tsx:271` (the read), and the word "history" in a comment at `src/engine/timeline.ts:242`. No `pushState` or `replaceState` appears outside tests.
- Tests write the address with `window.history.replaceState` before rendering: for example `src/lesson/LessonConsole.test.tsx:123`, `:135`, `:298`; `src/lesson/LessonConsole.flow.test.tsx:96`, `:190`; `src/lesson/LayoutEffects.test.tsx:112`; `src/lesson/LessonConsole.storage.test.tsx:34`.

## B. The figure

### B1. How the slotted markup reaches the DOM

- `src/pages/[track]/[lesson].astro:62`: `<Fragment slot="figure" set:html={svg} />` inside `<LessonConsole client:load …>` (49-61). `svg` is `fillLabels(setUp, lesson.units[0]!.scene.labels)` (`:42`), where `setUp` is `framesSetup(drawn.svg)` or `drawn.svg` (`:41`).
- The React integration turns each named slot into a prop: `node_modules/@astrojs/react/dist/server.js:52-71` builds a `StaticHtml` element per slot, keyed by the slot name.
- `node_modules/@astrojs/react/dist/static-html.js:12-19`: `StaticHtml` renders `h(tagName, {name, dangerouslySetInnerHTML: {__html: value}})`, where `tagName` is `astro-slot` when hydrating. `static-html.js:22-23`: `export default memo(StaticHtml, () => true)`. The comparator always returns `true`, so React does not re-render this subtree when its value changes.
- `LessonConsole.tsx:353` passes `figure={figure ?? null}` to `ScenePanel`. `ScenePanel.tsx:248-249`: `<div ref={figureBox} className="stage__figure" hidden={view !== 'network'}>{figure}</div>`.
- The only other `dangerouslySetInnerHTML` in non-test `src/`: `src/lesson/Explanation.tsx:203` (the Up next card's art, from `nextFigure`).
- Built output: `dist/how-the-internet-works/what-is-tcp/index.html` holds one `astro-island`; inside it, `<astro-slot name="figure">` wraps the SVG `<svg data-figure="net-map" …>` (byte offset about 264,628 inside the island).

### B2. `fillLabels` and `framesSetup` at build time, and the client's versions

- `src/art/scenes/labels.ts:4-14`: `fillLabels` writes each unit's word into every empty `<text>` or `<tspan>` whose `data-label` key the labels object has (escaped, lines 4 and 10-13). Build call only: `[lesson].astro:42`, with `units[0].scene.labels`.
- `src/art/scenes/dhcp.ts:269-284`: `framesSetup` changes the markup: it moves `display` on `data-setup` groups (275-276), sets `style="opacity:1"` on the laptop's IP text (277-279), hides `dh-lap-noip` (280), and replaces the `aria-label` with `FRAMES_DESCRIPTION` (281-283). Build call only: `[lesson].astro:40-41`, when `lesson.figure === 'dhcp'` and `units[0].scene.start` has a `frames` cue.
- `src/art/scenes/dhcp-frames.ts:3-4`: the file says `framesSetup` and the driver "must say the same things".
- The client does the same kind of work on each change:
  - DHCP driver: `setUp()` at `src/scenes/drivers/dhcp.ts:157-164` (moves `display` on frames groups, hides addresses, sets the laptop's address text to `FRAMES_LAPTOP_IP` and the `aria-label`). `show` (`dhcp.ts:258-272`) calls it when `framed(view)` (`:165`: `view.start.some((c) => c.cue === 'frames')`).
  - OSI driver: `src/scenes/drivers/osi.ts:194-197` writes `view.labels[key]` (or `''`) into each `data-label` slot's text on `show`. Its header comment (`osi.ts:19-20`) says so.
  - Net-map driver: `src/scenes/drivers/net-map.ts:515-520` (`paintNames(labels)`, the router names on their strips), `:751` (`routerOf(view.labels.router)`), and `:760` (`paintNames(view.labels)`) inside `show` (`:745-771`). `settle` reads `laptop`, `laptopAddr` and `url` from the labels (`:338-343`).
- Calls of `fillLabels` or `framesSetup` outside build code: none. `grep` finds them only in `[lesson].astro:5-6, 41-42`, their definition files, and tests.

### B3. `figureData`

- `[lesson].astro:37-38`: `const drawn = drawFigure(lesson.figure); const data = drawn.data;`, passed as `figureData={data}` (`:60`).
- `src/art/scenes/index.ts`: `DRAW: Record<FigureId, () => DrawnFigure>` and `drawFigure(id)` returns `DRAW[id]()`. The drawers take no lesson argument, so `figureData` depends only on the figure id.
- Measured: `dist/how-the-internet-works/what-is-tcp/index.html` and `…/what-is-http/index.html` (both `net-map`): their islands' `figureData` JSON is equal (True); their figure SVG strings are equal (1,057,158 bytes each, 0 differing tokens). Their `lesson`, `definitions` and `nextFigure` props differ.
- `ScenePanel.tsx:145` compares `figureData` by reference (deps `[figureData]`). A new object with the same content would still re-create the driver.

### B4. Per-lesson state left in the figure's DOM by play, and what resets it

- Driver contract, `src/scenes/driver.ts:44-50`: `show` "is called on every change, and after any play is aborted, so it must clear whatever a play left behind"; `destroy` "lets go of the figure when the console leaves the page". The view is `SceneView` (`driver.ts:12-42`).
- ScenePanel calls `d.show(scene)` on each change (`ScenePanel.tsx:156-184`, the call inside the layout effect). It creates the driver once per `figureData` identity (`:134-145`) and calls `made.destroy()` in cleanup (`:143`).
- Writes a play or show leaves behind, and the reset in the driver:
  - DHCP (`src/scenes/drivers/dhcp.ts`): `data-settling` attribute set and removed (`:262`, `:270`); `transform` attributes (`:109`, `:118`); `on` classes (`:132`, `:179`, `:216-217`, `:243-244`); text content (`:148-150`, `:162`, `:174-177`); the callout's class (`:143`, `:151`); `data-v` (`:173`, `:176`); `data-split` (`:186-187`); `cx`, `cy`, `r` (`:123-125`, `:211-212`, `:234-235`). `show` calls `clear()` (`:130-133`), which calls `clearMoving()` (`:115-122`: removes `transform`, fades the moving parts to 0) and removes the `on` classes. `setUp()` (`:157-164`) and `paintFrames` / `paintLeases` run after that.
  - Firewall (`src/scenes/drivers/firewall.ts`): `data-settling` (`:414`, `:422`); tags moved with `layer.append` and `transform` (`:194-195`, `:215-216`); trail `points` (`:197`, `:219`); `on`, `allow`, `deny`, `check` classes (`:189`, `:203-207`, `:383`); `focus` (`:209`, `:228`); `pop` (`:222`, `:341-343`). The reset is `clear()` (`:212`, which removes `transform`, re-appends the tags, empties `points`, and removes `deny`, `pop` and `focus`). `show` is at `:407-427`.
  - Net-map (`src/scenes/drivers/net-map.ts`): `show` (`:745-771`) sets `data-settling`, sets or removes `display` on each `data-layer` group (`:754-759`), paints the router and names, calls `clear()`, paints the cues, and removes `data-settling` in `finally` (`:764`). Other writes: `setAttribute` on `data-base` elements (`:316`) and `on` toggles (`:326`).
  - OSI (`src/scenes/drivers/osi.ts`): writes slot text (`:194-197`) and sets and removes `data-settling` around the paint (`:198-205` area).
  - Switch, subnet and pool: `show` at `src/scenes/drivers/switch.ts:277`, `subnet.ts:307`, `pool.ts:208`; `destroy()` is empty in all of them (`switch.ts:293`, `subnet.ts:319`, `pool.ts:219`, `dhcp.ts:274`, `firewall.ts:427`, `net-map.ts:771`).
- Replay and a new playback state: `ScenePanel.tsx:156-184`. `isNew` (`:157-158`) and the comment at `:161-162` ("A new playback state with an event to play (the next event, Replay, a new speed, Resume) lets the reader's table go") are the trigger; `show` runs on every change in the same effect.
- Unit change: the same effect runs on `scene` (`:147`, which depends on `unit` and `derived`). Each driver's `show` clears and repaints from the view, so a unit change repaints from scratch through `show`.
- Not found: a DOM node removed or re-created on unit change outside each driver's `show`/`clear`; the scout did not read every driver line.

## C. Which lesson changes could swap

Method: each track's lesson list in order (`src/content/tracks/*.ts`), "available" = a lesson file exists under `src/content/lessons/` with that slug (`src/content/registry.ts:59-103`, `buildEntries`), figure id from that file's `figure:` line. Pair counts are over adjacent entries of the track list (planned entries skipped) where both are available.

### C1. Networking (`src/content/tracks/networking.ts`, lessons at lines 31-80; 20 entries, 20 available)

- 1 osi-model, osi; 2 packets, net-map; 3 ip-address, subnet; 4 mac-address, dhcp; 5 switch, switch; 6 arp, net-map; 7 subnetting, subnet; 8 router, net-map; 9 dhcp, dhcp; 10 ports, net-map; 11 tcp-udp, net-map; 12 nat, net-map; 13 what-is-dns, net-map; 14 what-is-http, net-map; 15 what-is-https, net-map; 16 what-is-tls, net-map; 17 firewalls, firewall; 18 proxies, net-map; 19 load-balancers, pool; 20 vpn, net-map.
- Adjacent available pairs: 19. Same figure id: 6 (ports–tcp-udp, tcp-udp–nat, nat–what-is-dns, what-is-dns–what-is-http, what-is-http–what-is-https, what-is-https–what-is-tls). Different figure id: 13.

### C2. How the Internet Works (`src/content/tracks/how-the-internet-works.ts`, lessons at lines 22-64; 14 entries, 14 available)

- what-is-http, what-is-https, what-is-tcp, what-is-udp, what-is-ip, what-is-dns, what-is-dhcp, what-is-icmp, what-is-smtp, what-is-pop3, what-is-imap, what-is-ftp, what-is-ssh, what-is-tls: every one has figure `net-map`.
- Adjacent available pairs: 13. Same figure id: 13. Different: 0.

### C3. Lessons in two tracks

- Four lessons appear in both tracks: what-is-dns, what-is-http, what-is-https, what-is-tls. Networking lists them at `networking.ts:61`, `:68`, `:69`, `:70`; How the Internet Works at `how-the-internet-works.ts:39`, `:22`, `:23`, `:64`.
- URL per track: `src/content/registry.ts:93`, `url: /${track.id}/${planned.slug}`. So `/networking/what-is-dns` and `/how-the-internet-works/what-is-dns` are both built (`[lesson].astro:15-29` builds one page per track entry).
- Canonical: `registry.ts:94`, `canonical: /${homeOf(planned.slug)}/${planned.slug}`; `registry.ts:363`, `const homeOf = (slug) => tracksOf(slug)[0]!.id`. The track order is set at `src/content/tracks/index.ts:18` (`tracks = [internetTrack, networkingTrack]`), so the canonical for all four is `/how-the-internet-works/<slug>`. The page passes it on (`[lesson].astro:48`, `canonical={entry.canonical}`), and `BaseLayout.astro:85-86` writes `<link rel="canonical">` and `og:url` with that address.
- `e2e/lesson.spec.ts:286-295` checks the canonical on `/networking/what-is-dns` and `/how-the-internet-works/what-is-dns` (both pages name `/how-the-internet-works/what-is-dns`), and that DHCP keeps `/networking/dhcp`.
- `astro.config.mjs:10`: `redirects: { '/networking/how-the-internet-works': '/how-the-internet-works' }`.
- Progress is keyed by slug, not track: `src/progress/store.ts:22` ("progress follows the lesson, whichever track it was opened in").

## D. What differs between two lesson pages outside the island

### D1. `src/layouts/BaseLayout.astro` (inputs from `[lesson].astro:48`: `title={lesson.title} description={lesson.summary} current="tracks" main={false} footer={false} canonical={entry.canonical}`)

- `:47` `fullTitle = \`${title} · ${SITE_NAME}\``; `:79` `<title>{fullTitle}</title>`; `:81` `og:title`.
- `:80` `<meta name="description">` and `:82` `og:description`, both from `description` (the lesson's summary).
- `:42` `DEFAULT_IMAGE = '/og-default.png'`; `:51` `imageUrl` (absolute); `:83` `og:image` = `imageUrl`; `:50` `altText` (the default alt for the default image); `:84` `og:image:alt`. The lesson passes no `image`, so both are the defaults.
- `:54` `pageUrl = canonicalUrl(canonical ?? Astro.url.pathname, …)`; `:85` `<link rel="canonical" href={pageUrl}>` (omitted only when `canonical === null`); `:86` `og:url` = `pageUrl`.
- `:97` `<SiteHeader current={current} />` (current = `tracks`); `:98-104` `main={false}` leaves out the layout's `<main id="main">` (the page supplies its own inside the console); `:105` `footer={false}` leaves out the footer.
- Other page-independent elements: `:88` `twitter:card`, `:89` favicon, `:93` skip link (`href="#main"`), `:57` boot script with `classList.add("js")`, `:66` inline theme boot script, `:78` the `<noscript>` style block.

### D2. `src/components/SiteHeader.astro` (page-dependent parts)

- `:13` `showStart = current !== 'tracks'`: on every lesson page (current = `tracks`) the "Start learning" buttons are left out (`:46`, `:54`).
- `:23` `here = Astro.url.pathname` (trailing slash removed); `:24` `currentOf(l)`: `aria-current` is `undefined` unless `current === l.key`, then `"page"` if `l.href === here` else `"true"`. For a lesson, `here` is the lesson's path, so the Tracks link gets `aria-current="true"` on every lesson page.
- `:14-20` the links: Tracks `/tracks`, Glossary `/glossary`, How a lesson works `/#try`, Sources `/#sources`, About `/about`. `:29` brand link `/`. Rendered at `:34` and `:53`.

### D3. The `beacon` script

- `BaseLayout.astro:49`: `const beacon = analyticsBeacon(analyticsToken);`. `:111`: `{beacon && <script is:inline {...beacon}></script>}`.
- `src/lib/analytics.ts:4-9`: the object is `{ src: 'https://static.cloudflareinsights.com/beacon.min.js', defer: true, 'data-cf-beacon': JSON.stringify({token}) }`. `:11-20`: returns `null` when there is no token. `:17-18`: `analyticsToken = import.meta.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN` (a build-time value).
- In this checkout's build: `dist/how-the-internet-works/what-is-tcp/index.html` has no `cloudflareinsights` text (count 0), so no beacon is emitted in this build.
- Counting: the repo emits the external script once per document, in the layout. Nothing in `src/` re-sends it on a History-API change. What the Cloudflare script counts, and whether it counts only on load, is in its external file, which is not in this repo (not checked).

### D4. Other scripts that run once per page load

- Theme boot: `BaseLayout.astro:66` `<script is:inline set:html={bootScript}>`, where `bootScript` (`:57`) is `themeBootScript` plus `document.documentElement.classList.add("js")`. `src/lib/theme.ts:38-46` reads `localStorage` at `THEME_KEY` (`src/lib/theme.ts:3`, `'techconcepts:theme'`) and sets `document.documentElement.dataset.theme`. The only per-page state is that saved value.
- Header script: `SiteHeader.astro:58-95`, a bundled `<script>` (built as `<script type="module" src="/_astro/SiteHeader.astro_astro_type_script_index_0_lang…js">`). The menu's state lives in the DOM: `aria-expanded` and `panel.hidden` (`:62-70`); the listeners are on `document` (Escape at `:77-82`, `focusin` at `:85-92`) and on the button and panel. It holds no per-page JavaScript variable beyond these.
- Theme button: `src/scripts/theme-toggle.ts:16-34` (`wireThemeToggle`): a click flips `data-theme` and saves `techconcepts:theme`; a `MutationObserver` on `data-theme` (`:26-27`) keeps the label in step. Called from `SiteHeader.astro:90`.
- Two more inline scripts with no `src` are in the built lesson page (`dist/how-the-internet-works/what-is-tcp/index.html`, byte offsets about 12,478 and 12,630). They are Astro's island loader (`window.dispatchEvent` and the `Astro.load` setup); the source is not in this repo.

## E. Links from a lesson to another lesson or out of it

- Outline lesson row: `src/lesson/Outline.tsx:107-110`: for an available entry, `<a className="outline__lesson" href={entry.url} aria-current={current ? 'page' : undefined}>` (in `LessonLink`, `:85`). Unavailable entries are a `span` (`:112-114`). Rendered by `TrackParts` at `Outline.tsx:360` (the track column) and `:257` (the lessons sheet). The current lesson's own row is also a link (`entry.url`, `:108`).
- Outline sheet head: `Outline.tsx:249` `<a href="/tracks">Tracks</a>`; `:252` `<a href={trackUrl}>{trackTitle}</a>`. The sheet renders when open (`:257` area, under `open ?`).
- Outline unit rows (same lesson): `Outline.tsx:59` `onClick={() => onGo(target)}` (`Item`, `:50-70`); `:342` `onClick={() => onGo(positionOf(lesson, u, 'overview'))}`.
- TopBar: `src/lesson/TopBar.tsx:53` `<a href="/tracks">Tracks</a>`; `:55` `<a className="track__title" href={trackUrl}>`. The lessons button (`:69-78`) calls `onOpenLessons` and is not a link.
- Up next card (Practice, end of the last unit, when there is a next ready lesson): `src/lesson/Explanation.tsx:197-204` (the branch), `:201` `<a className="upnext lift" href={next.url}>`. `EndRow` is at `:183`.
- Back to the track (end of Practice when there is no next lesson): `Explanation.tsx:226` `<a className="cbtn" href={trackUrl}>Back to the track</a>`.
- "Go to <unit>" (same lesson): `Explanation.tsx:191` `onClick={() => onJump(positionOf(lesson, unit + 1, 'overview'))}`.
- Forward button: `PlaybackControls.tsx:145` `if (!forward.disabled) onForward();`. `LessonConsole.tsx:243-252` (`pressForward`): with `forward.href` set, `navigate(forward.href)` (`:245`, which is `window.location.assign` by default). `src/engine/playback.ts:197-204` sets `href: end.next.url` only at the last Practice when a next lesson is ready; otherwise `disabled` (`:206-207`) or an in-lesson action (`:177-196`).
- Keyboard: `src/lesson/useLessonShortcuts.ts:27-47`: ArrowRight calls `latest.current.next()`; ArrowLeft calls `prev`; Space calls `toggle`. `LessonConsole.tsx:255-257`: `next` calls `pressForward()` only when `forward.href === undefined && !forward.disabled`. So → never leaves the lesson. `src/lesson/keyboard.ts:7-18` lists `a[href]` and `button` among the targets that keep their own keys.
- Source links (new tab, out of the lesson): `src/lesson/Explanation.tsx:117` `<a href={source.url} target="_blank" rel="noopener">`; `src/lesson/Marks.tsx:17` `<a href={mark.url} target="_blank" rel="noopener">`.
- Header (outside the island, on every lesson page): see D2.

## F. Progress

- Keys: `src/progress/store.ts:5` `PROGRESS_KEY = 'techconcepts:v2'`; `:7` `LEGACY_PROGRESS_KEY = 'techconcepts:v1'`.
- Record shape: `store.ts:9-18` `LessonProgress` = `{status: 'in-progress' | 'finished', furthestPosition, lastOpened}`, stored at `data.lessons[slug]`. `store.ts:20-27` `ProgressData` = `{version: 2, lessons, lastLesson, lastTrack}`.
- Visit: `LessonConsole.tsx:281-283` calls `recordVisit(d, entry.key, entry.trackId, position, entry.maxPosition, new Date())` (`src/progress/store.ts:210-228`):
  - position 1 or more: the record is created or updated; `status` is `'finished'` if the record was already finished or `position === maxPosition`, else `'in-progress'` (`store.ts:215-222`); `furthestPosition` is the max (`:222`); `lastOpened` is set.
  - position 0 with an existing record: only `lastOpened` changes (`:224-226`). With no record: no lesson record is written.
  - Always: `lastLesson = key` and `lastTrack = trackId` (`:226-227`).
- "Started" is `status: 'in-progress'` (first written at position 1 or more, `store.ts:219`). "Done" is `status: 'finished'`: at `position === maxPosition` (the last unit's Practice, `store.ts:219`), and sticky once set (`store.ts:219`).
- Runs on mount: the visit effect (`LessonConsole.tsx:281-283`) runs at mount with the current position (0 for a fresh load). The `?step=` effect (`:270-278`) dispatches before the next render, so a deep link to step N records N at mount.
- Load on mount: `src/progress/useProgress.ts:59-76` (the effect with deps `[storage]`) calls `load()` once, then on `storage` events and on the `techconcepts:progress-changed` window event (`:17`, `:65-71`). `loadProgress` (`store.ts:240-241`) applies `combineProgress` and `splitInternet` (`src/progress/internet-split.ts:64`, which moves the old record keyed `how-the-internet-works`, named at `:4`, into the new lessons).
- Resume: `store.ts:231-234` `resumePosition` returns `furthestPosition` only for `in-progress`. `LessonConsole.tsx:286` uses it only when `deepLinked` is false.
- Practice picks are not saved: `LessonConsole.tsx:101` ("Practice is never saved") and the in-memory `picks` (`:232`).
- Other callers of `src/progress`: `src/components/ResetProgress.tsx`, `src/components/hub/useUpNext.ts`, `src/lib/entries.ts` (`knownFrom`, `:20-22`). `Outline.tsx:21` takes `progress` as a prop, and the console passes `progress.data` (`LessonConsole.tsx:342`).
- `known` clamps saved positions: `useProgress.ts:38-41` (the doc comment: saved positions of those lessons are clamped to `known`).

## G. Tests and guards that pin today's behaviour

### G1. Tests that move between lessons, wait for a page load between lessons, or assert navigation

Unit tests:
- `src/lesson/LessonConsole.flow.test.tsx:149` test "2 and 3: … and 'Next lesson: Firewalls' on Practice opens the next lesson": `:175` `expect(navigate).toHaveBeenCalledExactlyOnceWith('/networking/firewalls')`.
- `:195` test "2 and 19: … in a lesson of three units …": `:208` `expect(navigate).not.toHaveBeenCalled()`.
- `:232` test "16 and 19: → on a unit's Practice …": `:251` `expect(navigate).not.toHaveBeenCalled()`; `:252` `expect(window.location.pathname).toBe(url)`.
- `:257` test "20 and 21: with no next lesson …": `:273` `expect(navigate).not.toHaveBeenCalled()`.
- `src/lesson/LessonConsole.test.tsx` has no `navigate` assertion (grep); its `replaceState` deep-link tests are listed in A4.
- `src/lesson/LayoutEffects.test.tsx:102` passes `navigate={() => {}}`.
- No unit test found that clicks a lesson link or waits for a load between two lessons.

End-to-end (`e2e/`):
- No spec clicks an Up next card, an Outline lesson link, or the cross-lesson Next lesson button (grep of `upnext`, `outline__lesson`, `cbtn--go`, `Next lesson` in `e2e/*.spec.ts`).
- The forward-button walks stop before the cross-lesson press: `e2e/lesson-layout.spec.ts:659` test "36: the forward button's words are never cut …", `:675` `const atEnd = …startsWith('Next lesson')`, `:676` `if (atEnd) break;`, `:677` `await nextButton(page).click()`. `e2e/lesson-layout-small.spec.ts:395` test "36 at …", `:419` `if (here.atEnd) break;`, `:421` the click.
- In-lesson URL check: `e2e/lesson-layout.spec.ts:696` test "38: → walks the Overview to Practice …": `:706` `const url = page.url();`, `:711` `expect(page.url()).toBe(url)`.
- Full page loads per lesson (not moves): `e2e/lesson.spec.ts:278` test "a lesson page names its canonical URL" (`page.goto('/networking/dhcp')`, `:281`); `:286` test "a lesson two tracks list names its canonical URL …" (loop of `page.goto(path)` over `/networking/what-is-dns` and `/how-the-internet-works/what-is-dns`, `:289`); `:420` test "every lesson says it needs JavaScript to play …" (`page.goto(lesson.path)` per lesson, `:422`).
- Same-lesson reload: `e2e/controls.spec.ts:112` test "13a: replay is disabled …": `:122` `open(page, \`${HTTP}?step=99\`)`, `:125` `toHaveText('Next lesson: HTTPS')`.

### G2. Git-diff and text guards on the lesson page, `src/lesson/**`, BaseLayout and the built page

- `src/lib/not-found-page.test.ts:55` test "1: the shared files are untouched": `:58` `git diff --name-only ${BASE} -- 'src/pages/[track]/[lesson].astro' src/pages/about.astro src/pages/glossary.astro src/layouts ':!src/layouts/BaseLayout.astro' src/components/site.css src/styles/tokens.ts src/art ':!src/art/logo.ts' e2e/support.ts`, expected `''`. `BASE = '1d8e446'` (`:17`). So any change to `[lesson].astro`, `src/layouts` other than BaseLayout, `src/components/site.css`, `src/styles/tokens.ts`, `src/art` (except logo.ts) or `e2e/support.ts` since 1d8e446 fails this test.
- Same test, `:89-93`: `pageGrant(BASE, 'src/layouts/BaseLayout.astro')` must equal `BASE_LAYOUT_GRANT` (hunks, removed, added). `:94-95` SiteFooter and logo.ts must equal `COMMENT_ONLY_GRANT`.
- `src/scripts/about-page.test.ts:268-272`: `pageGrant('f30e876', …)` for the track page and `SiteHeader.astro` against `TRACK_PAGE_GRANT` and `SITE_HEADER_GRANT`; `:276-279` BaseLayout against `BASE_LAYOUT_GRANT`; `:286-288` `git diff --name-only f30e876 -- '[lesson].astro' src/styles/tokens.ts src/layouts ':!src/layouts/BaseLayout.astro' src/components/site.css src/components/hub` expected `''`.
- `src/lib/glossary-page.test.ts:286`, `:290`, `:294` (the same `pageGrant` checks against f30e876) and `:299-300` (the same `git diff` expected `''`).
- Grant constants in `src/lib/card-stack-guards.ts`: `pageGrant` `:80` (runs `git show <commit>:<file>`, drops comments and blank lines, compares the rest); `GLOBAL_GRANT` `:169`; `SITE_HEADER_GRANT` `:178` (hunks, removed lines, added lines; comment names "job 29, D25" and "B42"); `BASE_LAYOUT_GRANT` `:214` (comment: "(job 29, B38) … C is 1d8e446 or f30e876: `overHero` goes"); `COMMENT_ONLY_GRANT` `:230`.
- How earlier jobs granted a change: a new exported constant lists the exact expected hunks, removed lines and added lines, and its comment names the job and item; the test then asserts equality against the constant (for example `about-page.test.ts:277-279`, `not-found-page.test.ts:90-92`). The base commit in these tests is the commit before the granted change (f30e876, 1d8e446).
- `src/lesson/no-script.test.ts:13` imports `[lesson].astro`; `:24` renders it with `container.renderToString` (Astro's container) and checks the no-JavaScript markup (note text at `:15`).
- `src/lesson/definitions.no-script.test.ts:13` imports `[lesson].astro`; `:23` renders it the same way.
- `src/lesson/words.test.tsx:12` imports `./words-at-210a9a5.json`, a baseline of the Explanation's words at each position of each ready lesson (comment `:15-19`: "no `git diff` against a commit, which a shallow clone does not have"). It tests `Explanation`, not the page.
- `src/lib/track-page-render.test.ts:185` expects `[lesson].astro` to match `/lessonFigure|figures/`; `:190` expects BaseLayout not to match `/\bsplit\b/`; `:241` expects `Explanation.tsx` to match `/lessonLine/`.
- `scripts/og-image.test.mjs:46-48` and `:55-57`: BaseLayout must contain `DEFAULT_IMAGE = '/og-default.png'`, `<meta property="og:image" content={imageUrl} />`, and the `og:image:alt` line directly after it (regex match on the file text).
- `src/layouts/BaseLayout.test.ts:20-34`: footer and `main` wrapper behaviour (rendered output).
- `src/lib/not-found-page.test.ts:134`: a second `git diff` over `src/art` against `BASE`.
- Not found: any test that compares the built lesson page's HTML byte for byte with a stored copy. The scout searched `src`, `e2e` and `scripts` for `identical`, `byte`, `snapshot` and `words-at-`; the hits listed above are the lesson and layout related ones, and the scout did not open every hit.

### G3. `scripts/check-budgets.mjs`

- Budgets: `:17` `BUDGETS = { html: 250_000, lessonJs: 200_000 }` (gzip bytes). Header `:2-3`: HTML at most 250 KB gzipped on every page; JS at most 200 KB gzipped on each lesson page.
- Lesson page: `:75-80` `listPages`: a route with two parts whose first part is a built track route (`tracks` is the set of one-part routes).
- JS counted: `:106-126` `scriptsIn`: `<script src>` and inline scripts whose `type` is runnable (`:87` `RUNNABLE`: '', `module`, `text/javascript`, `application/javascript`; JSON data is excluded), and each `astro-island`'s `component-url`, `renderer-url` and `before-hydration-url`.
- Followed: static `import … from`, `import "x"`, `export … from` (`:134-138` `staticImports`). Not followed: `import("x")` (`:130-131` doc: "`import("x")` and `import.meta` are not static imports"; header `:6`: "Dynamic import() is not followed: it is not loaded with the page").
- `measurePage` (`:162-196`): each file counted once with its gzip; the file must resolve under `dist`, or the check throws (the `load` helper inside it). Inline scripts are counted at their own gzip size, inside the same function.
- A `.json` file under `dist`: counted only when a runnable script or an island URL names it, since every resolved file is pushed regardless of extension. A `.json` that a page only fetches at run time is not counted. A dynamic `import()` is not counted.
- HTML budget: `:196` `html: gzipSize(html)` for every page.
- Exit: `:114-116` throws when there is no lesson page (the JS budget would check nothing).

### G4. Playwright (`playwright.config.ts`)

- `:26` `PORT = Number(nodeEnv.E2E_PORT) || 4471`; `:37` `baseURL: http://localhost:${PORT}`.
- `:40-48` web server: `command: npm run build && npm run preview -- --port ${PORT} --ignore-lock`; `port: PORT`; `reuseExistingServer: false` (`:45`); timeout 240 s.
- Projects (`:49-59`):
  - `d1280`: 1280×800, not visual (`notVisual`: `testIgnore` `/(visual|tablet|og-image)\.spec\.ts$/`, `:28`).
  - `d1366`: 1366×768, not visual.
  - `d1440-dark`: 1440×900, `colorScheme: 'dark'`; `desktop` = `grepInvert: /@phone/`; `tablet.spec.ts` ignored.
  - `d1440-light`: 1440×900, `colorScheme: 'light'`, not visual.
  - `d1920`: 1920×1080, not visual.
  - `reduced-motion`: 1440×900, `reducedMotion: 'reduce'`, not visual.
  - `phone`: 390×844, `isMobile`, `hasTouch`; `testMatch: /site\.spec\.ts$/`, `grep: /@phone/`.
  - `tablet`: 1024×768; `testMatch: /tablet\.spec\.ts$/`.

## H. Endpoints and data shape

### H1. Non-HTML endpoints

- `src/pages` holds only: `404.astro`, `[track]/[lesson].astro`, `[track]/index.astro`, `about.astro`, `glossary.astro`, `index.astro`, `tracks.astro`. No `*.json.ts`, `*.xml.ts` or other endpoint file; `grep` for `export const GET` or `export async function GET` in `src/pages` finds nothing.
- `dist/` top level: `404.html`, `_astro`, `_headers`, `about`, `favicon.svg`, `glossary`, `how-the-internet-works`, `index.html`, `networking`, `og-default.png`, `tracks`. No `.json` at the top level.

### H2. The `lesson` object (`src/content/schema.ts:412-422`, `lessonSchema`, strict)

- Top-level keys: `slug`, `title`, `subtitle`, `level`, `certTags`, `summary`, `figure`, `units`, `overrides`, `backing`. The keys in the built `what-is-tcp` props are the same list.
- `units` items: `unitSchema` at `schema.ts:386` (`id`, `name`, `fullName`, `purpose`, …).
- The track entry (`LessonSummary`, `src/content/registry.ts:15-46`): available entries have `key, trackId, slug, url, canonical, number, title, subtitle, partTitle, summary, certTags, stepCount, units, maxPosition`; unavailable entries have `key, trackId, slug, number, title, partTitle`.

### H3. Props the island gets: same for a track, or different per lesson

- Built in `src/pages/[track]/[lesson].astro`: `getStaticPaths` at `:15-29` (props `{track, entry, entries, lesson, next}` at `:26`); the island at `:49-60`.
- Same for every lesson of a track: `trackId` (`track.id`, `:50`), `trackTitle` (`track.title`, `:51`), `total` (`entries.length`, `:55`), `entries` (`getEntries(track.id)`, `:17`). Measured: `entries` is equal in the `what-is-tcp` and `what-is-http` props (True).
- Different per lesson: `lesson` (`getLesson(entry.slug)`, `:21`), `entry` (`:19-26`), `next` (`neighbors(entries, slug).next`, `:26`), `nextFigure` (`lessonFigure(next)`, `:44`), `definitions` (`definitionsFor(siteGlossary().lessonMap, lesson.slug)`, `:59`; measured: not equal between tcp and http).
- Per figure id, not per lesson: `figureData` (`drawFigure(lesson.figure)`, `:37-38`, `:60`). Measured: equal for two lessons sharing `net-map`.
- The figure slot is per lesson: `svg` (`:42`), slot at `:62`.

### H4. Measured props (dist, `how-the-internet-works/what-is-tcp/index.html`, one `astro-island`, component `/_astro/LessonConsole.CHehfYqT.js`)

- Props attribute: 254,802 bytes raw (HTML-escaped); 214,292 bytes unescaped; gzip 18,439 (attribute as written) and 17,260 (unescaped).
- Per prop (unescaped JSON, re-serialised compactly by the scout, so byte counts can differ slightly from Astro's serialisation; each prop is `[type, value]` with type 0 for a plain value and 1 for an array, as seen in `entries`):
  - `figureData`: 142,918 bytes, gzip 4,691
  - `lesson`: 59,180 bytes, gzip 9,583
  - `entries`: 8,585 bytes, gzip 2,155
  - `definitions`: 1,758 bytes, gzip 776
  - `entry`: 665 bytes, gzip 378
  - `next`: 623 bytes, gzip 353
  - `nextFigure`: 385 bytes, gzip 236
  - `trackId`: 28 bytes, gzip 48; `trackTitle`: 28 bytes, gzip 48
  - `total`: 6 bytes, gzip 26
- The whole island (`<astro-island>` to `</astro-island>`, which includes the SSR markup and the figure): 1,331,443 bytes raw, gzip 144,719.
- The figure SVG (`<svg data-figure="net-map">` to its matching `</svg>`): 1,057,158 bytes raw, gzip 121,705.
- Scratch scripts for these numbers are in the session scratchpad (`s27_props.py`, `s27_keys.py`, `s27_svg.py`, `s27_cmp.py`, `s27_svgcmp.py`).

## I. Not found

- Any `history.pushState` or `history.replaceState` in non-test `src/`: none (A4).
- Any client code that calls `fillLabels` or `framesSetup`: none; the client equivalents are in B2.
- Any e2e spec that clicks an Up next card, an Outline lesson link, or the cross-lesson Next lesson button: none (G1).
- Any unit test that asserts `navigate` for a lesson other than `LessonConsole.flow.test.tsx` (G1).
- A byte-identity test on the built lesson page HTML: none found (G2, with the search terms used).
- A non-HTML endpoint in `src/pages` or `dist/` top level: none (H1).
- A Cloudflare beacon in this build: none, because `dist/how-the-internet-works/what-is-tcp/index.html` has no `cloudflareinsights` text (D3). Whether that beacon counts on a History-API change: not in this repo (D3).
- Whether unit ids are unique across lessons (the key of `picks`, A3): not checked.
- Whether check-budgets would count a `.json` under `dist` that is fetched at run time, or a `.json` named by a `<script src>`: reasoned from `scripts/check-budgets.mjs:75-196`; not run.
- Build, `npm test`, `npm run build` and e2e: not run (read-only brief).
