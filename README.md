# TechConcepts

Short visual lessons that teach how technology works, starting with networking. Each lesson runs Overview, Watch, Learn, Practice: you watch a small scene play, read what happened in plain words, then try a few questions. It is a fully static [Astro](https://astro.build) site with React islands for the interactive parts, served at `techconcepts.app` (HTTPS only).

Node 22 or newer is required (`.node-version` pins 24).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `http://localhost:4321` |
| `npm run build` | Type-check (`astro check`), build the static site into `dist/`, then check it against the page-weight budgets |
| `npm run budgets` | Check the built `dist/` against the page-weight budgets again, on its own |
| `npm run preview` | Serve the built `dist/` locally |
| `npm test` | Run the Vitest tests once (`src/` and `scripts/`) |
| `npm run e2e` | Run the Playwright end-to-end tests at four desktop sizes (1440 in both themes, so five desktop projects), with reduced motion and on a phone (it builds the site and previews it on port 4471 itself) |
| `npm run e2e:visual` | Take full-page screenshots of every page at four desktop sizes in both themes, into `test-results/visual/` (not committed) |
| `npm run deploy` | Deploy `dist/` with `wrangler deploy` (build first) |
| `node scripts/generate-og-image.mjs` | Redraw the social image, `public/og-default.png` |

The budget check prints every page's gzipped size and fails when a page breaks a budget: the HTML of any page must stay at or under 250 KB gzipped, and the JavaScript a lesson page loads at or under 200 KB gzipped in all. It is the last step of `npm run build`, so a breach fails the build, on Cloudflare too.

## Layout

- `src/pages/` the pages: Home, the track page (`[track]/index.astro`), the lesson page (`[track]/[lesson].astro`), About and 404
- `src/layouts/`, `src/components/` the site shell (header, footer, theme button) and the parts of Home, the track page and About, some of them React islands
- `src/content/` lessons and tracks:
  - `schema.ts` the shape of a lesson
  - `define.ts` `defineLesson` and `defineTrack`, which check every rule and fail the build on a breach
  - `estimate.ts` how many minutes a lesson takes
  - `registry.ts` finds the lesson files and builds each track's list, with each lesson's number, minutes and link
  - `tracks/`, `lessons/<track>/<slug>.ts`, `certs.ts` (the exam tags), and `helpers/` (builders that turn a lesson's messages into scene events, with the numbers worked out by the engine)
- `src/engine/` the logic behind a lesson, with no drawing in it:
  - `timeline.ts` the lesson's positions, and the scene's state at any position, always worked out again from the start
  - `playback.ts` Play, the pause between steps and the speed button, as a reducer and a React hook
  - `tables.ts` the tables under a scene; `net/` IPv4 and subnet maths, and the firewall rule evaluator
- `src/art/` the figures, drawn at build time into the HTML as inline SVG:
  - `kit/` the Anatomy kit the figures are built with (vendored, MIT licence, see `kit/SOURCE.md`)
  - `lumen.css` and `defs.ts` the lumen finish every figure wears
  - `figures/` the track covers, the small figures and Home's hero
  - `scenes/` the four lesson figures, and `parts.ts`, the `FIGURE_PARTS` a lesson may name on each
- `src/scenes/` what moves a figure in the browser: `driver.ts` (the driver contract), `drivers/` (one driver per figure), `motion.ts` (tweens and waits) and the Sequence view
- `src/lesson/` the lesson console: the top bar, the outline, the explanation (Overview, each Watch step, Learn, Go deeper), Practice, the playback controls, the scene and its log, `panels/` (a table, a firewall's rules, the bits board) and the keyboard shortcuts
- `src/progress/` saved progress (`techconcepts:v1`), the hook that reads it, and where a returning visitor picks up
- `src/lib/` small helpers, mostly plain TypeScript: safe storage, the theme, contrast maths (for the colour tests), analytics, formatting, page addresses, the data Home, the track page and About show, and `wrapAtDots.tsx`, a React helper that lets an address wrap only at its dots
- `src/scripts/` small page scripts that run without React: Home's hero and header, the track cover's packets, About's "On this page" list
- `src/styles/` colour tokens (`tokens.ts`) and base CSS (`global.css`)
- `src/test/` helpers the tests share
- `e2e/` Playwright tests; `scripts/` tools (the budgets check and the social image); `docs/deploy.md` deploying to Cloudflare

Tests sit next to their source as `*.test.ts(x)`, or `*.test.mjs` beside the scripts. Component tests start with `// @vitest-environment jsdom`. Tests import `test`, `expect` and `vi` from `vitest` explicitly; there are no globals.

## How a lesson is put together

A **lesson** is made of one or more **units**. Most lessons have one. How the Internet Works has fourteen, one per protocol. Every unit runs the same way:

1. **Overview**: a short hook and description.
2. **Watch**: 4 to 6 steps. Each step plays a few **events** on the lesson's **figure**, and the log under the figure lists them.
3. **Learn**: what happened, in plain words first and then by name.
4. **Practice**: a few questions with feedback. Practice is never scored or saved.

Each place a learner can be (an Overview, a step, Learn or Practice) is a **position**, numbered from 0 across every unit. The console never remembers what the scene looked like. For any position, `deriveState` in `src/engine/timeline.ts` applies every event from the start of the unit up to that point and builds the scene's state from scratch. So going back, jumping or pausing always shows exactly what playing forward to that point would.

The figure itself is drawn once, at build time, into the page's HTML. In the browser a small **driver** moves its named parts and switches their classes, and nothing is drawn at runtime.

A lesson counts as finished once the learner reaches its last position, the last unit's Practice.

## Adding a lesson

1. **Plan it in the track**, `src/content/tracks/networking.ts`. Until its file exists it shows as "Coming soon".
2. **Create `src/content/lessons/<track>/<slug>.ts`.** The file name must be the lesson's `slug`, its `title` must be the one the track lists, and the default export is `defineLesson({ ... })`. Copy a lesson that is close to yours: `dhcp.ts`, `firewalls.ts` and `subnetting.ts` have one unit each. Only files directly in the track's folder are lessons. A lesson of many units can keep each unit in a folder beside it, as `how-the-internet-works/` does.
3. **Give it a card figure** on the track page: add its slug to `FIGURES` in `src/pages/[track]/index.astro`, usually with a small figure from `src/art/figures/spots.ts`. The build stops when a ready lesson has none.
4. **Write its test** beside it, `<slug>.test.ts`: see "The lesson's test" below.
5. **Check it end to end**: `npm run build`, which also checks the page-weight budgets, then `npm run e2e`. There is no list of lessons to edit: the tests find the ready lessons from the links on the built track page (`e2e/global-setup.ts`) and walk, play and fit-check each one at every size. A lesson whose Watch has no Network / Sequence switch, like Subnetting, goes in `NO_SEQUENCE` in `e2e/lesson.spec.ts`; checks that only one lesson needs (DHCP's lease table, Firewalls' rule list) sit under "lesson specifics" there, by slug. `npm run e2e:visual` takes its screenshots too.

Everything else comes from the lesson file: its page, its place and number in the track, the minutes, and the totals on Home and the track page.

### The lesson and its units

The lesson gives its `slug`, `title`, `subtitle`, `level`, `certTags` (at least one, from `certs.ts`), `summary`, its `figure`, and its `units`.

Each unit has:

- `id`, `name`, `fullName` and `purpose` (one line on what it is for), `osiLayers` (shown in the top bar) and `references` (at least one, an `https` link each; they are listed as Sources at the end of Learn's Go deeper)
- `overview`: a `hook`, a `description` and a few `facts`
- `steps`: each one has a `title`, a Title Case technical term such as "DHCP Discover", and a `sub` line saying the same thing in plain words. Then a `narrative` (the everyday idea first, then the term), `deep` (Go deeper: exam-level detail, closed by default), 2 to 4 `facts`, and its `events`. A step may also give a `status` (what the scene says it is doing) and an `idle` line (what the log says while it is still empty at that step).
- `learn`: a `lead`, `terms` (each an everyday `idea` and its `name`), a `pattern` (the steps' names and a note on the pattern), `why`, `deep` and `facts`
- `practice`: questions, each with 2 to 4 `options` (`text` and `feedback`) and the `answer`, counted from 0
- `scene`: what sits around the figure: a `title`, the `views` (`['network']`, or `['network', 'sequence']` to offer the Sequence view), the `parties` the Sequence view draws as lifelines, the `log` (its title, columns and legend, and an optional `idle` line: what it says while empty, from the Overview on; the console says "Nothing has happened yet. Press Play to start." without one; a column marked `strong` holds the row's main words, in the strongest ink), and a `panel` under the figure (a `table`, a firewall's `rules` with the connections it remembers, the `bits` board, or `null`). On the network map a unit also picks its `layers`, its `labels` and its `start`.

Prose fields mark key terms with `**term**`. Nothing else is markup: the console never reads lesson text as HTML.

### Events

A step's events play in order. There are three kinds:

- **`message`**: something travels `from` one place on the figure `to` another, wearing a `tag`. Its `kind` (request, response, control, broadcast or encrypted) picks its mark and colour in the log and the Sequence view, and a broadcast spreads across the figure. Its `outcome` may be `'dropped'` (lost on the way, at `dropAt`) or `'blocked'` by a firewall; it defaults to `'delivered'`. A firewall's `check` says how many rules it read and which one matched, and `known` marks a reply let through because the firewall remembers the connection. A message may also point at one of the scene's `packets` (DHCP keeps its packets).
- **`note`**: something happens in one place, such as a calculation. On the Subnetting figure a note can carry a `board` for the bits board. The log draws a note with the legend's note entry, or with a message kind's glyph when the note names one as its `glyph` (Subnetting's sent and broadcast rows); the legend must explain it.
- **`table`**: a row of the unit's panel table is added, updated, removed, matched, replaced or cleared. It adds no log row. Its `summary` says what changed in one plain sentence, and screen readers hear it when the event plays. A jump says only where it lands, as it does for messages.

Messages and notes give their own `log` row (by the log's column keys) and a `plain` sentence, which the log's `plain` column shows and screen readers hear. Both can carry **cues**: named changes the figure shows besides the message itself, such as the padlock lighting up on the network map.

Write events with the helpers in `src/content/helpers/` when you can. They work out every number with the engine (`src/engine/net/`) instead of typing it in, so the lesson cannot drift from the maths.

### Figures and `FIGURE_PARTS`

A lesson is drawn on one of four figures: `dhcp`, `subnet`, `firewall` or `net-map` (the network map How the Internet Works uses). Each figure lists in `FIGURE_PARTS` (`src/art/scenes/parts.ts`) what a lesson may name on it:

- `places`: where a message may go from and to, and where a party may stand
- `cues`: each cue's name, and whether it is a `flag` (no argument) or takes `text`
- `layers`: the swappable layers a unit may show (the network map's server plates)
- `board`: whether a note may carry a bits board
- `start`: whether a unit may start with cues already in place

`defineLesson` checks every event against these, so a typo such as `from: 'ruoter'` fails the build with a message naming the step and the event.

To **add a figure**:

1. Draw it in `src/art/scenes/<figure>.ts` with the kit (`src/art/common.ts` holds the shared camera and plate). It returns its SVG and the data its driver needs, and its CSS sits beside it. The root `<svg>` carries `data-figure="<figure>"`, `role="img"` and an `aria-label` (`index.test.ts` checks every figure for them).
2. Add its id to `FigureId` (`src/art/scenes/types.ts`) and to `figureIdSchema` (`src/content/schema.ts`), add its `FIGURE_PARTS`, and add it to `DRAW` in `src/art/scenes/index.ts`. `parts.test.ts` checks that the schema and `FIGURE_PARTS` list the same figures.
3. Write its driver (next section) and add it to `DRIVERS` in `src/scenes/drivers/index.ts`.

Figures follow the illustration system: charcoal solids with fine light edges, one part lit in the site's blue, and no film grain. Every copy of a figure on a page gets its own ids.

### Drivers and the driver contract

A driver moves one figure in the browser. `src/scenes/driver.ts` defines the contract, and every driver keeps to it:

- `create(root, data)` finds the figure's named parts (by id or `data-part`) and returns the driver.
- `show(view)` draws the settled scene for a `SceneView` (the unit's layers, labels and start, the cues applied so far, the tables, the latest event), with no motion. It runs on every change and after any play is stopped, so it must clear whatever a play left behind.
- `play(event, view, options)` animates one event, starting from the settled `view`. Each part of its motion takes its 1× time divided by `options.speed`. Under reduced motion nothing travels or pulses, but the event still ends where `show` would put it. Once `options.signal` aborts, `play` must not touch the figure again: after every `await` it checks the signal and returns. It never rejects.
- `destroy()` lets go of the figure when the console leaves the page.
- `duration(event, data)` says how long an event plays at 1×. Playback waits that long (divided by the speed) before it applies the event.

Use the helpers in `src/scenes/motion.ts` (`animate`, `wait`, `along`, `easeInOut`). They already keep the abort rules. A driver takes only types from its figure's drawing module (`import type`), so the drawing code stays out of the browser's JavaScript.

Each driver has its own tests in `src/scenes/drivers/<figure>.test.ts`. At the least, cover these: `show` settles at once; under reduced motion `play` leaves the figure exactly as `show` would after each event; and an aborted play stops touching the figure, then `show` settles it.

### The lesson's test

Each lesson has a test file beside it. Look at `firewalls.test.ts` for a full one. At the least, check that:

- the lesson validates, with its number of steps and questions, and its minutes (`estimateMinutes`)
- the step titles are the technical terms, in order
- every message goes between places the figure has. Where the figure draws its tags ahead of time (DHCP, Firewalls), each message rides one of them.
- the **show sweep** passes: `expect(showSweep(lesson)).toBe(<positions + events>)`, from `src/test/show-sweep.ts`, in a test file that starts with `// @vitest-environment jsdom`. The helper draws the lesson's figure into the page and makes one driver for it. It calls `show` for every position of the lesson, Overview, each step, Learn and Practice, unit after unit, after each of the step's events in turn, first forwards and then back again to the first Overview. Then it jumps from the first Overview to the end of every position and straight back. At each position's first and last moment, every time, it checks that the figure's markup is exactly what a fresh driver shown only that moment draws (style attributes and the order of attributes are written one way first, since jsdom writes them differently once a driver has set them; classes, text, transforms and hidden flags are compared as they are). The moments in the middle of a step are shown but not compared: a fresh network map and its driver take about 30 ms under jsdom, and comparing all 429 of lesson 1's moments would triple the time the whole suite takes. A difference fails with the position, the direction and the markup around it. This catches a driver that leaves something behind, or one that cannot draw a moment that playing forward would reach. It returns the number of moments it showed, which the test checks.

### Minutes

`estimateMinutes` (`src/content/estimate.ts`) works out how long a lesson takes, and the registry shows it on Home and the track page:

- **Words read** count at 200 a minute. They are the overview's hook and description, every step's narrative, Learn's lead, each term's idea and name, the pattern note and why, and every question with its options and feedback. Titles, sub lines, Go deeper, facts and labels are not counted.
- Each Watch step adds half a minute.
- Practice adds 1 minute. In a lesson of many units it adds half a minute per unit instead.
- The total is rounded up.

A one-unit lesson over 12 minutes builds with a warning, and over 15 minutes fails the build. A lesson of many units has no limit as a whole, but each of its units is capped at 15 minutes.

### Limits

`defineLesson` fails the build on a breach, and lists every problem at once:

- 4 to 6 steps per unit, each with 2 to 4 facts and a narrative of at most 120 words
- an overview hook of at most 80 words
- 2 to 3 Practice questions (exactly 2 per unit in a lesson of many units), each with 2 to 4 options
- Learn with 3 to 10 terms and a pattern of 2 to 6 names
- at least 1 reference per unit and 1 cert tag per lesson
- unique unit, step, question and event ids
- the minutes above
- every place, cue, layer, log column, table and packet a unit names exists on its figure or in its scene. The schema also rejects unknown keys, so a typo such as `narative:` fails too.

### Example data and voice

Example data (launch spec §5): "public" hosts use `192.0.2.0/24`, `198.51.100.0/24` or `203.0.113.0/24`; private networks use RFC 1918 ranges; MAC addresses use `00:00:5E:00:53:xx`; `8.8.8.8` may appear by name.

Voice (launch spec §7.2, and the redesign spec, both in `docs/superpowers/specs/`): second person and warm, beginner first. Give the everyday idea, then the precise term. Teach one new idea per step, and use no gamified words. Exam-level detail goes in Go deeper.

## Conventions worth knowing

- **Browser storage** is touched only through `createSafeStorage()` in `src/lib/storage.ts`. It never throws: reads give `null`, writes give `false`. It holds only `techconcepts:theme` and `techconcepts:v1`, and the site must work fully when storage is blocked or full.
- **Colour** comes only from the semantic tokens in `src/styles/tokens.ts`, which meet WCAG AA in both themes. Colour is never the only signal: always add a label, icon or text. Marigold (`here`) means only "you are here".
- **Themes**: the root element's `data-theme` attribute selects light or dark. An inline boot script sets it before first paint; without JavaScript the page follows `prefers-color-scheme`. Figures stay charcoal in both themes.
- **Type**: Atkinson Hyperlegible Next for prose and Atkinson Hyperlegible Mono for data, self-hosted.

## Deploying and analytics

`npm run deploy` runs `wrangler deploy` (Cloudflare Workers with static assets, set up in `wrangler.jsonc`) and expects `npm run build` to have run. The build checks page weight as its last step, so a page over budget is never deployed. `docs/deploy.md` has the dashboard steps. If the build variable `PUBLIC_CF_WEB_ANALYTICS_TOKEN` is set, every page includes Cloudflare's cookieless Web Analytics beacon and the About page says so; leave it unset for no analytics.
