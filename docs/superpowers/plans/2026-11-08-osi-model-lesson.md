# OSI Model Lesson Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Networking Concepts › 1 · OSI Model (`osi-model`): the first lesson in the cited shape, on a new `osi` figure with its driver and a new `labels` panel, passed by the fact-checker.

**Architecture:** The figure is drawn at build time from the approved mockup's `liveSvg()` and carries no words of its own: every word it shows comes from the unit's `scene.labels`, filled in at build time for the no-script page and rewritten by the driver on every `show`. Two new cues (`layer`, `peer`) light blocks and peer lines; messages ride the two cable legs. Events gain an optional `labels` field (the headers the message carries), carried in the derived state like Subnetting's board and shown by `LabelsPanel`. The validator learns each figure's allowed cue args, message routes and required label words from `FIGURE_PARTS`.

**Tech Stack:** Astro 7, React 19, TypeScript, zod 4, Vitest 5 (jsdom for figures, drivers and panels), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-08-osi-model-lesson-design.md` (approved 2026-11-08). Section numbers below (§3, §5…) are the spec's.

## Global Constraints

- Branch `feat/osi-model`. Never push to main or merge without the owner's explicit OK; merging to main deploys the live site.
- Before saying anything is done: `npx vitest run`, `npm run build` (astro check plus budgets) and `npm run e2e`, with failures reported as they are.
- No new npm dependencies. Never run prettier. Never use bare `git stash`. Stage named paths only; `.claude/launch.json` and `Claude outputs/` stay out of every commit.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Never write absolute paths containing the project folder name into tracked files.
- Design and check at desktop widths only (1280×800 to 1920×1080); layouts stay fluid.
- Voice: beginner-first, plain words first, the term after; exam detail only in Go deeper. Say **header**, never "label", in anything a reader sees.
- Watch says nothing Learn doesn't. No router replacing the layer-2 header. No mnemonic. Badge `osi: 'spans'`.
- Every Learn statement, Go deeper paragraph and Practice option cites at the exact section; every Watch part traces to Learn. Two independent sources per claim unless one citation is marked `defining: true`.
- Networking limits: 4–6 steps, 2–4 facts a step, 2–3 questions of 2–4 options, 3–10 terms, 2–6 pattern names, narratives ≤ 120 words, hook ≤ 80, Go deeper ≤ 90.
- Budgets: 250 KB gzipped HTML per page, 200 KB gzipped JS per lesson page.
- Figure ids start `osi-`. All art original (ported from our own mockup).
- IEEE stays untouched: this lesson cites no IEEE source.

## Review Focus

- **Jumping into the middle** (outline click or `?step=5`): the panel must show the headers carried from earlier steps (L2–L7 at step 5's start), and the figure must show nothing lit and no tag, exactly as playing there would. → Task 5 test `jumping to step 5 shows the headers the earlier steps left`; Task 6's show sweep.
- **Stepping backwards** out of Peer Layers or Relay: no block, peer line or parked tag may stay behind. → Task 4 test `show clears what an earlier view lit`; Task 6's show sweep.
- **Reduced motion**: the tag jumps to the cable's end and the panel still changes with each event; a Play run takes as long as with motion. → Task 4 test `reduced motion puts the tag at the end at once`; e2e reduced-motion project.
- **Light theme**: the lit block's dark-on-lit name, the blue `new` chip and the marigold `read` outline stay legible. → Task 8 accessibility and visual checks in both themes.
- **No JavaScript**: the layer names, callouts and plate words show on the static figure. → Task 8 test `without JavaScript, the OSI figure shows its words`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/art/scenes/osi-stacks.ts` (new) | The figure's data with no drawing and no CSS: stacks and their layer counts, routes, label words, allowed cue args. `parts.ts` imports it, so the validator never pulls in CSS. |
| `src/art/scenes/osi.ts`, `osi.css` (new) | Draws the figure (port of the mockup's `liveSvg()`), with empty word slots. |
| `src/art/scenes/labels.ts` (new) | `fillLabels`: writes a unit's words into a drawn figure's slots at build time. |
| `src/scenes/drivers/osi.ts` (new) | Lights blocks and peer lines, rides and parks the tag, writes the words. |
| `src/lesson/panels/LabelsPanel.tsx`, `labels.css` (new) | The message's headers under the scene. |
| `src/content/lessons/osi-model.ts` (new) | The lesson. |
| `docs/fact-checks/osi-model.md` (new) | Written by the fact-checker, never by hand. |
| `types.ts`, `parts.ts`, `index.ts` (scenes); `drivers/index.ts`; `schema.ts`; `define.ts`; `timeline.ts`; `UnitPanel.tsx`; `sources.ts`; `[lesson].astro`; `.claude/agents/fact-checker.md` | Modified as each task says. |

---

### Task 1: The lesson's sources

**Files:**
- Modify: `src/content/sources.ts` (the `SOURCES` call, and its comment "Real entries arrive with later tasks")
- Test: `src/content/sources.test.ts`

**Interfaces:**
- Produces: `SOURCES` entries `itu-x200`, `rfc-1122`, `nist-sp800-77r1`, `microsoft-osi`, and (unless the fallback is taken now) `cisco-ipip-decap`, `rfc-2003`. Task 6 cites them with `cite(id, section, { url?, defining? })`.

- [ ] **Step 1: Read the two tunnel sources (§10).** Fetch the Cisco *IP-in-IP Decapsulation* page (url in §10) and RFC 2003 at rfc-editor.org. Find, in each, the sentence that says the decapsulator removes the outer header; note RFC 2003's section number, the Cisco page's section fragment (an `id` on the page near that sentence) and whether each is current (RFC 2003 not obsoleted per its rfc-editor info page; the Cisco guide for a supported release). If either cannot be read, says no such thing, or is not current, take §10's fallback now: no tunnel sources, and Task 6 writes step 5 as **Passing Up the Layers** with `term-up`. Ledger which way it went.

- [ ] **Step 2: Write the failing tests**

```ts
const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
const NIST = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf';

test('SOURCES holds the OSI Model lesson’s sources', () => {
  expect(Object.keys(SOURCES)).toEqual(['itu-x200', 'rfc-1122', 'nist-sp800-77r1', 'microsoft-osi', 'cisco-ipip-decap', 'rfc-2003']); // four, if the fallback was taken
  expect(SOURCES['microsoft-osi']!.publisher).not.toBe(SOURCES['cisco-ipip-decap']!.publisher);
});

test('an X.200 section is cited by its PDF page, as the defining standard', () => {
  expect(cite('itu-x200', '6.1.2', { url: `${X200}#page=32`, defining: true })).toEqual({
    source: 'itu-x200', section: '6.1.2', url: `${X200}#page=32`, label: 'ITU-T X.200, 6.1.2', defining: true,
  });
});

test('NIST SP 800-77r1 §2.1 is page 20; RFC sections link by anchor', () => {
  expect(cite('nist-sp800-77r1', '2.1', { url: `${NIST}#page=20` }).label).toBe('NIST SP 800-77r1, 2.1');
  expect(cite('rfc-1122', '1.3.3').url).toBe('https://www.rfc-editor.org/rfc/rfc1122.html#section-1.3.3');
});
```

- [ ] **Step 3: Run them to see them fail.** Run: `npx vitest run src/content/sources.test.ts`. Expected: FAIL with `Unknown source "itu-x200"`.

- [ ] **Step 4: Add the entries to `defineSources([...])`** with the values in §6's table: kinds as listed; `short` `ITU-T X.200`, `RFC 1122`, `NIST SP 800-77r1`, `Microsoft Learn`, `Cisco`, `RFC 2003`; `title` the document titles in §6 and §10; `publisher` `ITU-T`, `IETF`, `NIST`, `Microsoft`, `Cisco`, `IETF`; `url` exactly as §6 and §10 give them; `anchor` only for the two RFCs (`…/rfcNNNN.html#section-{n}`). Replace the stale comment with one line naming the lesson that brought them.

- [ ] **Step 5: Run them to see them pass.** Run: `npx vitest run src/content/sources.test.ts`. Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/sources.ts src/content/sources.test.ts
git commit -m "feat: the OSI Model lesson's sources: ITU-T X.200, RFC 1122, NIST SP 800-77r1, Microsoft Learn and the two tunnel sources"
```

---

### Task 2: The `osi` figure and its parts

**Files:**
- Create: `src/art/scenes/osi-stacks.ts`, `src/art/scenes/osi.ts`, `src/art/scenes/osi.css`, `src/art/scenes/labels.ts`
- Modify: `src/art/scenes/types.ts`, `src/art/scenes/parts.ts`, `src/art/scenes/index.ts`, `src/content/schema.ts:39` (`figureIdSchema`)
- Test: `src/art/scenes/osi.test.ts`, `src/art/scenes/labels.test.ts`

**Interfaces:**
- Produces, in `types.ts`: `FigureId` gains `'osi'`; `FigureParts` gains four optional fields:
  - `args?: Readonly<Record<string, readonly string[]>>`: for a text cue listed here, the only args it takes.
  - `routes?: readonly string[]`: the only ways a message may ride, as `'from>to'`; absent means any two places.
  - `words?: readonly string[]`: the `scene.labels` keys a unit on this figure must give, and the only ones it may.
  - `labels?: true`: events may carry `labels` (Task 3).
- Produces, in `osi-stacks.ts`: `OSI_STACKS = { laptop: 7, router: 3, server: 7 } as const`; `OSI_ROUTES = ['laptop>router', 'router>server'] as const`; `OSI_WORDS` (`layer-1`…`layer-7`, `laptop`, `laptop-sub`, `router`, `router-sub`, `server`, `server-sub`, `plate`); `OSI_CUE_ARGS: { layer: string[]; peer: string[] }` (`laptop:1`…`laptop:7`, `router:1`…`router:3`, `server:1`…`server:7`; `'1'`…`'7'`).
- Produces, in `osi.ts`: `drawOsi(): DrawnFigure` and `interface OsiSceneData { M: number[]; O: [number, number]; routes: Record<'laptop>router' | 'router>server', [Point, Point]> }` (`Point = [number, number, number]`, plate units, start then end).
- Produces, in `labels.ts`: `fillLabels(svg: string, labels: Readonly<Record<string, string>>): string`.
- SVG contract the driver (Task 4) relies on: block groups `g.osi-L#osi-L-<place>-<n>` each holding one `.iso-solid` slab; peer groups `g.osi-peers#osi-peer-<n>`; the tag `g.osi-tag#osi-tag`; callouts `g.osi-call#osi-call-<place>`; word slots are `<text>` or `<tspan>` elements carrying `data-label="<key>"`, drawn empty.

- [ ] **Step 1: Write the failing figure tests** in `osi.test.ts`, on the pattern of `firewall.test.ts`:
  - `the figure names itself for its driver and keeps its ids to itself`: svg starts `<svg data-figure="osi" class="lm-svg osi" viewBox="…" role="img" aria-label="…">`; every id starts `osi-`; ids are unique.
  - `the figure carries no grain and no closing tag an HTML parser would act on` (as firewall's).
  - `every block, peer line, callout and the tag the driver moves is there`: for each `[place, count]` of `OSI_STACKS` and `n` in 1..count, ` id="osi-L-<place>-<n>"` is present, and `osi-L-router-4` is not; `osi-peer-1`…`osi-peer-7`; `osi-call-laptop|router|server`; `osi-tag`.
  - `each block is drawn once`: exactly one `iso-solid` inside each `osi-L` group (count the `class="iso-solid"` occurrences between one block's opening id and the next block's).
  - `the figure says no words of its own; each word has its slot`: the svg contains none of `PHYSICAL`, `APPLICATION`, `Your laptop`, `Router`, `Web server`, `OSI REFERENCE MODEL`; the set of `data-label` values equals `new Set(OSI_WORDS)`; every slot is empty (`/data-label="[^"]+"[^>]*><\//`); `layer-<n>` slots appear once per stack that has layer n (laptop and server 7, router 3: `layer-1` three times, `layer-4` twice); the figure engraves the number itself, so each block's engraving ends `>1  <tspan data-label="layer-1"></tspan></text>` (n, two spaces, the slot); the plate's engraving is `<text class="iso-face-text" data-label="plate" …></text>`.
  - `the tag reads 0101`: `<text class="osi-tag-t" …>0101</text>`.
  - `the data gives the camera, the origin and the two cable rides`: `M` has 6 numbers; `O` 2; `Object.keys(routes)` equals `OSI_ROUTES`; each route is 2 points at z = `RIDE` (`CABLE_Z + CABLE_R + 0.4` = 2.8); the laptop>router start is 3 units outside the laptop footprint's right-back corner (`[-42 + 17 + 3, 52 - 17 - 3, 2.8]` = `[-22, 32, 2.8]`) and its end 3 outside the router's (`[10 - 17 - 3, 0 + 17 + 3, 2.8]` = `[-10, 20, 2.8]`); router>server `[30, -20, 2.8]` → `[42, -32, 2.8]`.
  - `the page budget has room for it`: gzip the svg with `CompressionStream('gzip')` and expect under 100 KB.
  - `drawFigure draws the OSI scene`: `drawFigure('osi')` equals `drawOsi()`.
  - `the osi figure's parts`: `FIGURE_PARTS.osi` equals `{ places: ['laptop', 'router', 'server'], cues: { layer: 'text', peer: 'text' }, args: OSI_CUE_ARGS, routes: OSI_ROUTES, words: OSI_WORDS, layers: [], board: false, start: false, labels: true }`.

- [ ] **Step 2: Write the failing `labels.test.ts`:**
  - `fillLabels writes each word into every slot with its key`: `fillLabels('<text data-label="a"></text><tspan x="1" data-label="a"></tspan><text data-label="b"></text>', { a: 'A & <B>' })` returns `'<text data-label="a">A &amp; &lt;B&gt;</text><tspan x="1" data-label="a">A &amp; &lt;B&gt;</tspan><text data-label="b"></text>'`.
  - `fillLabels leaves a figure without slots as it was`: `fillLabels(drawFirewall().svg, { plate: 'X' })` equals `drawFirewall().svg`.

- [ ] **Step 3: Run them to see them fail.** Run: `npx vitest run src/art/scenes/osi.test.ts src/art/scenes/labels.test.ts`. Expected: FAIL, `drawOsi` and `fillLabels` not found.

- [ ] **Step 4: Write `osi-stacks.ts` and `labels.ts`.** `fillLabels` replaces the empty content of each `<text|tspan … data-label="k" …></text|tspan>` with the HTML-escaped `labels[k]`, leaving keys it is not given empty.

- [ ] **Step 5: Port the figure** into `osi.ts`/`osi.css` from `.superpowers/brainstorm/2830-1793891117/figs/osi-scene.mjs` (`plate`, `cable`, `liveTower`, `liveRoutes`, `liveSvg`, `camera`, `callout`, `liveCss`, plus the `sceneCss` rules the live figure uses), with `// @ts-nocheck` and imports from `../common.ts` as `firewall.ts` does. Geometry, camera, frame and callout offsets stay exactly as the mockup's. The port changes only:
  - tower keys `send`/`router`/`recv` become `laptop`/`router`/`server`; ids gain the `osi-` prefix (`L-send-3` → `osi-L-laptop-3`, `P-4` → `osi-peer-4`, `tag` → `osi-tag`), and each callout gets `id="osi-call-<place>"`;
  - each block is drawn once, as the mockup's unlit block (`v-off`: tone `mid` with its seam), with no `v-on` copy; `osi.css` styles a lit block by the kit's `[data-lit]` state, hides its seam while `.osi-L.on`, and sets `.osi-L.on` name ink to `color-mix(in srgb, var(--lit-b) 30%, #000)`;
  - every word becomes an empty slot: the block's engraving is `faceTextSvg(…, `${n}  `)` with `<tspan data-label="layer-<n>"></tspan>` put before its `</text>` (`faceTextSvg` escapes its text, so the slot goes in after); the callouts' name and sub lines carry `data-label="<place>"` and `data-label="<place>-sub"`; the plate's engraving is `faceTextSvg(…, '')` with `data-label="plate"` added;
  - the svg opens `<svg data-figure="osi" class="lm-svg osi" …>`; keep the mockup's aria-label.
  `drawOsi()` returns `{ svg, data }`, with `data.routes` keyed by `OSI_ROUTES` from `liveRoutes()` (rounded to 2 places as firewall's are) and `M`/`O` from `camera()`.

- [ ] **Step 6: Register the figure.** Add `'osi'` to `FigureId` and to `figureIdSchema`'s list; `osi: drawOsi` to `DRAW`; `FIGURE_PARTS.osi` as the parts test says. Add the four optional fields to `FigureParts` with one-line doc comments.

- [ ] **Step 7: Run them to see them pass.** Run: `npx vitest run src/art/scenes`. Expected: PASS, including the existing figures' tests.

- [ ] **Step 8: Look at it.** Write a scratch page in the session scratchpad that embeds `drawOsi().svg` filled with the §3 words (`fillLabels`) and the lumen CSS, open it in the in-app browser at 1440×900 beside `.superpowers/brainstorm/32739-1794175764/content/osi-watch-5.html`, light one block by hand (`data-lit` on its `.iso-solid`, `on` on its group). Expected: same plate, stacks, cable, callouts and engraving positions as the mockup; the lit block matches the mockup's lit block in both themes.

- [ ] **Step 9: Commit**

```bash
git add src/art/scenes/osi-stacks.ts src/art/scenes/osi.ts src/art/scenes/osi.css src/art/scenes/labels.ts src/art/scenes/osi.test.ts src/art/scenes/labels.test.ts src/art/scenes/types.ts src/art/scenes/parts.ts src/art/scenes/index.ts src/content/schema.ts
git commit -m "feat: the OSI figure: three stacks of layers on one plate, its words left to the lesson"
```

`npm run build` fails astro check from here until Task 4 registers the driver (`DRIVERS` is a `Record<FigureId, …>`); vitest does not type-check, so per-task runs stay green.

---

### Task 3: The `labels` field, the `labels` panel type and the validator's new rules

**Files:**
- Modify: `src/content/schema.ts` (events, `panelSchema`, exports), `src/content/define.ts` (`checkCues`, `checkEvent`, `checkScene`), `src/content/test-fixtures.ts` (`FIXTURE_PARTS`)
- Test: `src/content/define.test.ts`

**Interfaces:**
- Consumes: `FigureParts.args | routes | words | labels` (Task 2).
- Produces, in `schema.ts`: `messageLabelsSchema` = `{ list: number[]; mark?: { n: number; kind: 'new' | 'read' } }` with layers 2–7; `type MessageLabels`; `noteEventSchema` and `messageEventSchema` gain `labels: messageLabelsSchema.optional()`; `panelSchema` gains `{ type: 'labels' }`.
- Produces, in `test-fixtures.ts`: `FIXTURE_PARTS.osi` = the fixture's places and cues, plus `args: { status: ['on', 'off'] }`, `routes: ['laptop>router']`, `words: ['plate']`, `labels: true`.

- [ ] **Step 1: Write the failing tests** in `define.test.ts` (it already mocks `FIGURE_PARTS` with `FIXTURE_PARTS`). Build each from `makeLesson({ figure: 'osi' })` with `unit(l).scene.labels = { plate: 'P' }` and `unit(l).scene.panel = { type: 'labels' }` (drop the fixture's table events where a test needs `toEqual([])`). Each asserts the exact issue:
  - `a cue's arg must be one the figure can show`: `ev(l, 0, 0).cues = [{ cue: 'status', arg: 'busy' }]` → matches `/message "m1": cue "status" takes "on" or "off", not "busy"/`; `'on'` gives no such issue.
  - `a message rides only a way the figure has`: `ev(l, 0, 0).to = 'phone'` → `/message "m1" rides from "laptop" to "phone", a way the osi figure does not have/`; on `dhcp` (no `routes`) the same message is fine.
  - `the scene gives every word the figure shows, and no other`: `labels = {}` → `Unit "neighbors": the scene's labels need "plate" for the osi figure.`; `labels = { plate: 'P', plat: 'x' }` → `Unit "neighbors": the scene's labels give "plat", which the osi figure does not show.`; a figure with no `words` takes any labels (net-map's existing tests stay green).
  - `labels ride only on a figure that shows them, in a unit with a labels panel`: on `dhcp`, a note with `labels: { list: [7] }` → `/note "n1" has labels, but the dhcp figure shows none/`; on `osi` with a table panel → `/note "n1" has labels, but the unit's panel is not a labels panel/`; a `labels` panel on `dhcp` → `Unit "neighbors": the labels panel needs a figure that shows a message's headers; the dhcp figure does not.`
  - `a labels list holds distinct layers 2 to 7, outermost first, and its mark is one of them`: `list: [7, 5]`, `[5, 5]`, `[1, 2]`, `[8]` are each rejected by shape with a message naming `labels.list`; `{ list: [5, 6], mark: { n: 4, kind: 'new' } }` is rejected naming `labels.mark`; `{ list: [], }` and `{ list: [2, 3, 4], mark: { n: 3, kind: 'read' } }` pass.

- [ ] **Step 2: Run them to see them fail.** Run: `npx vitest run src/content/define.test.ts`. Expected: the new tests FAIL (unknown key `labels`, no such issues); the old ones pass.

- [ ] **Step 3: Add the schema parts.** `messageLabelsSchema`: `list` is `z.array(z.int().min(2).max(7))` refined to strictly ascending (message: `must list distinct layers 2 to 7, lowest (outermost) first`); the object is refined so `mark.n` is in `list` (message: `mark.n must be one of the layers in list`, path `['mark']`).

- [ ] **Step 4: Add the rules to `define.ts`** with the exact wording the tests assert: args in `checkCues`; routes and labels in `checkEvent` (labels for notes and messages alike); words and the labels panel's figure in `checkScene`. The args message lists the allowed args when there are at most four (`${where}: cue "status" takes "on" or "off", not "busy".`; three read `"a", "b" or "c"`); with more it reads `${where}: cue "layer" arg "router:4" is not one the osi figure can show.`

- [ ] **Step 5: Run them to see them pass.** Run: `npx vitest run src/content`. Expected: PASS (`registry.test.ts` and the fact-check tests included).

- [ ] **Step 6: Commit**

```bash
git add src/content/schema.ts src/content/define.ts src/content/test-fixtures.ts src/content/define.test.ts
git commit -m "feat: events carry the message's headers, and the validator checks a figure's cue args, routes and words"
```

---

### Task 4: The `osi` driver

**Files:**
- Create: `src/scenes/drivers/osi.ts`
- Modify: `src/scenes/drivers/index.ts`
- Test: `src/scenes/drivers/osi.test.ts` (`// @vitest-environment jsdom`)

**Interfaces:**
- Consumes: the SVG contract and `OsiSceneData` (Task 2); `SceneView`, `DriverModule`, `PlayOptions` (`src/scenes/driver.ts`); `animate` and friends from `src/scenes/motion.ts` as the firewall driver uses them.
- Produces: `osiDriver: DriverModule`, registered as `DRIVERS.osi`. Exported timing constants `LIGHT_MS = 1100`, `RIDE_MS = 1300`, `LAND_MS = 500` (the mockup's: a layer's turn waits 1100 ms; a ride takes 1300 ms and waits 500 ms after).

What `show(view)` draws, from the mockup's `show()` (`osi-watch.mjs`), from scratch every time:
- Every `[data-label]` slot gets `view.labels[key] ?? ''`.
- Nothing lit, no peer line, no tag, no callout in focus; then:
- If `view.landed` is a note, its cues decide: `layer <place>:<n>` lights block `osi-L-<place>-<n>` (class `on` on the group, `data-lit` on its `.iso-solid`) and puts `osi-call-<place>` in `focus`; `peer <n>` lights layer n in every stack that has it.
- Every `peer` cue with `current: true` in `view.cues` shows its `osi-peer-<n>` group (`on`): the step's lines build up.
- If `view.landed` is a message, the tag shows at the end of its route (`<from>>` + `<to>`), and nothing is lit.

`play(event, view, o)`: a note shows its end state at once (the light needs no tween); a message shows the tag at its route's start and rides it to the end over `RIDE_MS / o.speed`, or at once under `o.reducedMotion`, then leaves it parked. Honour the abort contract in `driver.ts`. `duration`: a message `RIDE_MS + LAND_MS`; a note `LIGHT_MS`.

- [ ] **Step 1: Write the failing tests.** Mount `drawOsi().svg` into the document and `osiDriver.create(root, data)`; build each `SceneView` by hand with a small `viewOf({ cues, landed, labels })` helper (unit 0, no layers, no start, null status, empty tables, null board, `active` = `landed`). Tests:
  - `show writes every word into its slots`: with `labels: { 'layer-1': 'PHYSICAL', plate: 'OSI' }`, all three `[data-label="layer-1"]` read `PHYSICAL`; `[data-label="layer-7"]` reads `''`.
  - `a layer cue lights its one block and puts its machine in focus`: landed note with `layer laptop:4` → `.osi-L.on` ids equal `['osi-L-laptop-4']`; that group's `.iso-solid` has `data-lit`; `.osi-call.focus` ids equal `['osi-call-laptop']`.
  - `show clears what an earlier view lit`: show `peer 2` (current), then a view with nothing landed → no `.on`, no `[data-lit]` inside `.osi-L`, no `.focus`, tag opacity `0`.
  - `peer cues light the twins and keep the step's lines`: cues `peer 7`, `peer 6`, `peer 2` (current), landed the `peer 2` note → lit `['osi-L-laptop-2', 'osi-L-router-2', 'osi-L-server-2']`; lines on `['osi-peer-7', 'osi-peer-6', 'osi-peer-2']`. With the same cues not current (Learn) and nothing landed: no lines, nothing lit.
  - `a landed message parks the tag at the end of its cable`: landed message `router`→`server` → tag opacity `1`, its `transform` the screen point of `data.routes['router>server'][1]` (`M`, `O` as `firewall.test.ts` computes them), nothing lit.
  - `reduced motion puts the tag at the end at once`: `await play(message, view, { speed: 1, reducedMotion: true, signal })` resolves with the tag at the route's end.
  - `an aborted play resolves and leaves the figure alone`: abort mid-ride (fake timers or an already aborted signal, as `firewall.test.ts` does); play resolves; markup unchanged after the abort.
  - `duration`: message 1800, note 1100.

- [ ] **Step 2: Run them to see them fail.** Run: `npx vitest run src/scenes/drivers/osi.test.ts`. Expected: FAIL, module not found.

- [ ] **Step 3: Write `src/scenes/drivers/osi.ts`** in the shape of `firewall.ts` (part lookup once in `create`, a `clear()` that `show` starts from, screen points from `M`/`O`), and register it in `drivers/index.ts`.

- [ ] **Step 4: Run them to see them pass.** Run: `npx vitest run src/scenes`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/drivers/osi.ts src/scenes/drivers/osi.test.ts src/scenes/drivers/index.ts
git commit -m "feat: the OSI driver: lights a layer or its twins, builds the peer lines, rides the bits along the cable"
```

---

### Task 5: The message's headers in the derived state, and `LabelsPanel`

**Files:**
- Modify: `src/engine/timeline.ts` (`DerivedState`, `deriveState`), `src/lesson/panels/UnitPanel.tsx`
- Create: `src/lesson/panels/LabelsPanel.tsx`, `src/lesson/panels/labels.css`
- Test: `src/engine/timeline.test.ts`, `src/lesson/panels/LabelsPanel.test.tsx`, `src/lesson/panels/UnitPanel.test.tsx`

**Interfaces:**
- Consumes: `MessageLabels`, the `labels` panel type (Task 3).
- Produces: `DerivedState.labels: MessageLabels | null` (the latest applied note's or message's `labels`; carried across steps as `board` is; null before any). `LabelsPanel({ labels }: { labels: MessageLabels | null })`. `headersSentence(labels: MessageLabels | null): string`.

The panel's words (the panel's own; not lesson content):
- Chips `L<n>` for each layer in `list`, in order, then a dashed `data` chip. A `new` mark: class `is-new`, filled `#2f7bff`, edge `#a8e8ff`, text `#fff`. A `read` mark: class `is-read`, 2px border `var(--here)`, plain fill.
- Note on the right: `1 header, outermost first`; `<n> headers, outermost first`; `No headers yet` for null; `No headers left` for an empty list (step 6, after the server read them all: "No headers yet" would be wrong there).
- `headersSentence`: `Headers on the message: layer 4 (just added), 5, 6, 7, then the data.`; a read mark says `(being read)`; `[7]` new 7 → `Headers on the message: layer 7 (just added), then the data.`; null → `Headers on the message: none yet, just the data.`; `[]` → `Headers on the message: none left, just the data.`
- Markup: a `div.labels` with `role="group"` and `aria-label="The message"`, holding `<p className="sr-only">{headersSentence(labels)}</p>` and an `aria-hidden="true"` row of chips and the note. No `aria-live`: the event's own `plain` words reach the console's live region already.
- `UnitPanel`: for `panel?.type === 'labels'`, `<LabelsPanel labels={…} />` with the playing note's or message's `labels` when it has some (the strip changes as the figure starts the event, as the bits board does), otherwise `derived.labels`.

- [ ] **Step 1: Write the failing tests.**
  - `timeline.test.ts`, `the latest labels carry across steps, and none before any`: on a fixture lesson whose step 1 note carries `{ list: [7], mark: { n: 7, kind: 'new' } }` and step 2 has a note without labels, `deriveState` at the Overview has `labels: null`; at step 2 after its note, `{ list: [7], mark: … }`.
  - `LabelsPanel.test.tsx`: `chips in order, then the data`; `a new mark fills its chip and a read mark outlines it` (classes); `the note counts the headers` (four cases above); `headersSentence` (the four sentences above, verbatim); `the panel has no live region of its own` (`container.querySelector('[aria-live]')` is null).
  - `UnitPanel.test.tsx`, `a labels panel shows the playing event's headers, then the derived ones`: with `derived.labels` = `[5,6,7]` and `playing` a note carrying `[4,5,6,7]` new 4 → chips `L4 L5 L6 L7 data`; with `playing` null → `L5 L6 L7 data`.
  - `UnitPanel.test.tsx`, `jumping to step 5 shows the headers the earlier steps left`: derive at the start of a fixture's later step (no event of it played) → the panel shows the headers the last event of the step before carried.

- [ ] **Step 2: Run them to see them fail.** Run: `npx vitest run src/engine/timeline.test.ts src/lesson/panels`. Expected: FAIL on the new tests.

- [ ] **Step 3: Implement** `labels` in `deriveState` (next to `board`), `LabelsPanel.tsx`, `labels.css` (chip shapes from the mockup's `.chip` rules in `osi-watch.mjs`, colours as above, using the console's tokens for ink and lines), and the `UnitPanel` branch, with a doc-comment line added to `UnitPanel`'s list of panels.

- [ ] **Step 4: Run them to see them pass.** Run: `npx vitest run src/engine src/lesson`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/timeline.ts src/engine/timeline.test.ts src/lesson/panels/LabelsPanel.tsx src/lesson/panels/labels.css src/lesson/panels/LabelsPanel.test.tsx src/lesson/panels/UnitPanel.tsx src/lesson/panels/UnitPanel.test.tsx
git commit -m "feat: the labels panel: the headers the message carries, outermost first, then the data"
```

---

### Task 6: The lesson

**Files:**
- Create: `src/content/lessons/osi-model.ts`, `src/content/lessons/osi-model.test.ts`

**Interfaces:**
- Consumes: `defineLesson` (`define.ts`), `cite` and the Task 1 sources, `OSI_WORDS` (Task 2), the `labels` field and panel (Task 3).
- Produces: the default export `defineLesson({...})`, slug `osi-model`.

Write it from spec §5 and §10 exactly: metadata, Overview, scene, the six steps, Learn (every id, statement gist and citation in §5's Learn table), Practice. The prose is the builder's, inside the limits and the voice; ids, cites, cues, labels and traces are not. Citation helpers at the top of the file:

```ts
const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
/** X.200's PDF page for each section cited (spec §6, measured with pdftotext). */
const X200_PAGE: Record<string, number> = { '5.2.2.1': 10, '5.2.2.3': 11, '5.2.2.7': 12, '5.6.1.1': 19, '5.6.1.3': 19, '5.6.1.4': 19, '6.1.2': 32, '6.1.6': 33, '7.1.2.1': 36, '7.2.2.2': 37, '7.3.2.1': 39, '7.4.2.1': 41, '7.4.2.3': 41, '7.5.2.1': 45, '7.6.2.1': 50, '7.6.2.2': 50, '7.6.4.5': 52, '7.7.2': 53 };
const x200 = (section: string) => cite('itu-x200', section, { url: `${X200}#page=${X200_PAGE[section]}`, defining: true });
```

Every X.200 citation is marked defining: X.200 is the standard that defines the model. NIST §2.1 cites `#page=20`; Microsoft cites its section fragments, and the intro by a text fragment the builder writes and checks lands. fact-3 cites X.200's title page (`section: 'Title page'`, its PDF page as measured).

**Scene:** `title: 'Your laptop to a web server'`; `views: ['network']`; `panel: { type: 'labels' }`; `parties: []`; `labels`: `layer-1` `PHYSICAL`, `layer-2` `DATA LINK`, `layer-3` `NETWORK`, `layer-4` `TRANSPORT`, `layer-5` `SESSION`, `layer-6` `PRESENTATION`, `layer-7` `APPLICATION`, `laptop` `Your laptop`, `laptop-sub` `sends`, `router` `Router`, `router-sub` `passes it on`, `server` `Web server`, `server-sub` `receives`, `plate` `OSI REFERENCE MODEL · SEVEN LAYERS`; `backing: { traces: ['lead-1', 'lead-4', 'lead-5', 'fact-3'] }`; log per §5 (columns `where` "Where", `layer` "Layer" mono, `plain` "What happened"; legend request "Bits on the cable", note "A layer's job").

**Events** (ids unique across the unit; every note has exactly one cue; every event carries `labels`; `where` is `Laptop`, `Router` or `Web server`, and `layer` is `<n> <Name>` as `4 Transport`):

| Step | Events in order | `labels` | Backing traces |
|---|---|---|---|
| 1 Application Layer | note `laptop-7` · `layer laptop:7` | `[7]` new 7 | lead-1, lead-3 |
| 2 Encapsulation | notes `laptop-6` … `laptop-2` · `layer laptop:<n>` | `[n…7]` new n | lead-1, lead-3, term-encap |
| 3 Physical Layer | note `laptop-1` · `layer laptop:1`; message `bits-to-router` laptop→router, tag `0101`, kind `request`, log where `Laptop → Router` | `[2…7]`, no mark (both) | lead-4 |
| 4 Relay | notes `router-1`, `router-2`, `router-3`, `router-2-down`, `router-1-down` · `layer router:1`, `:2`, `:3`, `:2`, `:1`; message `bits-to-server` router→server, tag `0101`, kind `request`, log where `Router → Web server` | `[2…7]`; read 2 at `router-2`, read 3 at `router-3`, otherwise no mark | lead-5 |
| 5 Decapsulation | notes `server-1` … `server-7` · `layer server:<n>` | `server-1`: `[2…7]` no mark; `server-n` (n ≥ 2): `[n…7]` read n | lead-4, lead-6, term-decap (fallback: term-up) |
| 6 Peer Layers | notes `peer-7` … `peer-1` · `peer <n>`; log where `Laptop ↔ Web server` (4–7) or `Laptop ↔ Router ↔ Web server` (1–3) | `[]` | term-peer, why-2 (4–7); term-peer, lead-5 (1–3) |

Step facts trace as §5's table says; step titles and subs as §5 (step 5 per §10 and the way Task 1 went). Server rows' `plain` is `Reads header <n> and removes it.` with no machine named (§5). Step 4's narrative says the router reads headers 2 and 3 and works out where the message goes next; it never says the router replaces a header.

- [ ] **Step 1: Write the failing tests** (`// @vitest-environment jsdom`; `afterEach` clears the body):
  - `the lesson keeps the Networking limits`: `checkLimits(osiModel, networkingTrack.limits)` is `[]`.
  - `the lesson is what the spec says`: `figure` `'osi'`, `level` `'beginner'`, `certTags` `['a-plus', 'network-plus', 'ccna']`, `units[0].osi` `'spans'`, `scene.views` `['network']`, `scene.panel` `{ type: 'labels' }`, `Object.keys(scene.labels).sort()` equals `[...OSI_WORDS].sort()`, the step titles `['Application Layer', 'Encapsulation', 'Physical Layer', 'Relay', 'Decapsulation', 'Peer Layers']` (`'Passing Up the Layers'` fifth on the fallback).
  - `each step plays the cues the spec lists`: per step, `events.flatMap(e => (e.cues ?? []).map(c => `${c.cue} ${c.arg}`))` equals the table above (`['layer laptop:7']`, `['layer laptop:6', …, 'layer laptop:2']`, `['layer laptop:1']`, `['layer router:1', 'layer router:2', 'layer router:3', 'layer router:2', 'layer router:1']`, `['layer server:1', …, 'layer server:7']`, `['peer 7', …, 'peer 1']`).
  - `the headers go on outermost-last going down and come off going up`: the `labels` of each event equal the table's, as `[list, mark?]` pairs.
  - `the bits ride only the two cables, as 0101`: messages are exactly `laptop>router` then `router>server`, tag `'0101'`, kind `'request'`.
  - `Learn has the spec's ids`: lead `lead-1`…`lead-7` (lead-7 an analogy), terms `term-layer`, `term-header`, `term-encap`, `term-decap` (or `term-up`), `term-peer`, `term-relay`, why `why-1`, `why-2`, deep `deep-1`…`deep-3`, facts `fact-1`, `fact-2-top`, `fact-2-bottom`, `fact-3` (§5's fact-2 is two facts, Top and Bottom, and each fact has its own id).
  - `the validator refuses what the figure cannot show`: with the real `FIGURE_PARTS`, `checkStructure` on copies of the lesson with one change each reports `cue "layer" arg "router:4" is not one the osi figure can show`, likewise for `laptop:8`, `phone:1` and `peer` `0`; and with `bits-to-router` sent to `server`, `rides from "laptop" to "server", a way the osi figure does not have`.
  - `a reader sees "header", never "label"`: every narrative, sub, `plain`, log cell, Learn text and Practice text (`textsOf` from `src/test/lesson-references.ts`) is free of `/\blabels?\b/i`.
  - `the figure shows the same thing however it is reached`: `showSweep(osiModel)` returns `37` (9 positions + 28 events).

- [ ] **Step 2: Run them to see them fail.** Run: `npx vitest run src/content/lessons/osi-model.test.ts`. Expected: FAIL, module not found.

- [ ] **Step 3: Write `src/content/lessons/osi-model.ts`.** Fix every issue `defineLesson` reports until it imports cleanly.

- [ ] **Step 4: Run them to see them pass.** Run: `npx vitest run src/content/lessons/osi-model.test.ts src/art src/scenes`. Expected: PASS. The whole suite now fails in one way only, the build gate: `osi-model: no fact-check report at docs/fact-checks/osi-model.md`. Task 7 clears it; check that this is the only failure (`npx vitest run 2>&1 | tail -40`).

- [ ] **Step 5: Commit**

```bash
git add src/content/lessons/osi-model.ts src/content/lessons/osi-model.test.ts
git commit -m "feat: the OSI Model lesson: one message down seven layers, through a router, and up seven more"
```

---

### Task 7: The fact-check

**Files:**
- Modify: `.claude/agents/fact-checker.md` (its procedure)
- Create: `docs/fact-checks/osi-model.md` (the checker writes it)
- Modify, only on a failing verdict: `src/content/lessons/osi-model.ts` and its test, `src/content/sources.ts`

**Interfaces:**
- Consumes: the lesson (Task 6), `npm run fact-check`.

- [ ] **Step 1: Add the long-PDF line** to the procedure in `.claude/agents/fact-checker.md`: a long PDF (X.200, NIST SPs) is read by downloading it to a scratch folder and running `pdftotext -f N -l N <file> -`, or the Read tool with `pages`, at the page the citation names; a `#page=N` fragment names PDF page N.

- [ ] **Step 2: Print the claim sheet.** Run: `npm run fact-check -- osi-model`. Expected: exit 0, a sheet whose items include `scene.labels`, ending `Write your report to: docs/fact-checks/osi-model.md`.

- [ ] **Step 3: Dispatch a fresh fact-checker** with the prompt `Check lesson osi-model.` If the Agent tool lists the `fact-checker` type, use it; otherwise dispatch `general-purpose` on `opus` with the body of `.claude/agents/fact-checker.md` (after its front matter) followed by that line. Give it nothing else from this session.

- [ ] **Step 4: Check the report.** Run: `npm run fact-check -- osi-model --check`. Expected: `Report OK: docs/fact-checks/osi-model.md`.

- [ ] **Step 5: On any ⚠️ or ❌:**
  1. Commit the report exactly as written: `git add docs/fact-checks/osi-model.md && git commit -m "test: the OSI Model lesson's fact-check report, run <k>: <n> item(s) failed"`.
  2. Fix the lesson. A failure on `term-decap`, the pattern's Decapsulation, or step 5's title takes §10's fallback in full (title, `term-up` with its two cites, pattern, traces, the tunnel sources dropped from `SOURCES` if nothing else cites them, Task 1's and Task 6's tests updated). Any other failure is fixed as the report says.
  3. Re-run Task 6's tests; commit the fix.
  4. Go back to Step 3 with a brand-new checker. Never edit a verdict.
  If the same claim fails a third time, stop and ask the owner: it needs a source this plan does not have.

- [ ] **Step 6: Run the whole suite.** Run: `npx vitest run`. Expected: PASS (the gate finds the current, all-✅ report).

- [ ] **Step 7: Commit**

```bash
git add .claude/agents/fact-checker.md docs/fact-checks/osi-model.md
git commit -m "test: the OSI Model lesson's fact-check report: every item passes"
```

---

### Task 8: On the site, checked

**Files:**
- Modify: `src/pages/[track]/[lesson].astro`, `src/lesson/no-script.test.ts`, `src/components/TrackLessons.test.tsx`, `e2e/site.spec.ts`, `e2e/lesson.spec.ts`

**Interfaces:**
- Consumes: `fillLabels` (Task 2), the lesson (Task 6).

- [ ] **Step 1: Write the failing no-script test.** Add `'osi-model'` to the `test.each` list, and a test `without JavaScript, the OSI figure shows its words`: the page's `svg[data-figure="osi"]` text contains `APPLICATION`, `PHYSICAL`, `Your laptop`, `passes it on`, `Web server` and `OSI REFERENCE MODEL · SEVEN LAYERS`.

- [ ] **Step 2: Run it to see it fail.** Run: `npx vitest run src/lesson/no-script.test.ts`. Expected: FAIL, the words are missing.

- [ ] **Step 3: Fill the words at build time.** In `[lesson].astro`: `const drawn = drawFigure(lesson.figure); const svg = fillLabels(drawn.svg, lesson.units[0]!.scene.labels);` (the console opens on the first unit; figures without slots are unchanged). Run it again. Expected: PASS.

- [ ] **Step 4: Update what counts ready lessons**, to OSI Model being the fourth:
  - `TrackLessons.test.tsx`: shown titles `['OSI Model', 'Subnetting', 'DHCP', 'Firewalls']`; the OSI Model link's `href` `/networking/osi-model`; The big picture's `.part-c` reads `1 of 2 ready`.
  - `e2e/site.spec.ts`: `4 of 19 lessons ready`; `19 lessons · 4 ready`; `ready now 4`; four `li.lesson`; 15 soon rows; the first card `Lesson 01` linking `OSI Model`; the test's name and its Part 1 comment and `.part-c` (`1 of 2 ready`) to match.
  - `e2e/lesson.spec.ts`: add `'osi-model'` to `NO_SEQUENCE` (its scene has the Network view only), with the comment saying why.
  Run: `npx vitest run`. Expected: PASS.

- [ ] **Step 5: Add an OSI e2e test** in `lesson specifics`: `OSI Model: Encapsulation, once played, shows six headers, layer 2 just added`: open `?step=2` (as the DHCP Acknowledge test does), wait for the live region to end with step 2's last `plain`, then expect the panel's `.sr-only` text `Headers on the message: layer 2 (just added), 3, 4, 5, 6, 7, then the data.`, five log rows, and `#osi-L-laptop-2.on`.

- [ ] **Step 6: Build.** Run: `npm run build`. Expected: astro check 0 errors, the budgets script passes with `/networking/osi-model` listed under 250 KB gzipped HTML and 200 KB JS.

- [ ] **Step 7: Run e2e.** Run: `npm run e2e` (about 15 minutes; run it in the background). Expected: all pass, including every per-lesson test for `/networking/osi-model` (walk, outline, Play to Replay with no console errors, fits one screen, no Sequence switch, storage throwing, no JavaScript) in every project.

- [ ] **Step 8: Accessibility, both themes.** The project has no axe dependency and none may be added, so §8's "axe finds no violations" is met by the `accessibility` skill's WCAG 2.2 audit of `/networking/osi-model` in the in-app browser at 1440×900, dark and light, at the Overview, step 2 played, step 4 played and step 6 played: names and roles of the figure and the panel, the sr-only sentence, keyboard reach, and contrast of the lit name ink and both chip marks. Fix any failure with a test first, in the task whose code it is.

- [ ] **Step 9: Look against the mockup.** Run `npm run e2e:visual -- -g osi-model` and put `test-results/visual/osi-model-*-1440x900-*.png` beside `osi-watch-5.html` in the in-app browser. Expected: the figure and strip read as the approved mockup in both themes; differences are only the words §5 changed.

- [ ] **Step 10: Commit**

```bash
git add "src/pages/[track]/[lesson].astro" src/lesson/no-script.test.ts src/components/TrackLessons.test.tsx e2e/site.spec.ts e2e/lesson.spec.ts
git commit -m "feat: OSI Model is ready on the Networking track and Home"
```

- [ ] **Step 11: Final run of all three**, on the committed tree: `npx vitest run`, `npm run build`, `npm run e2e`, results reported as they are. Then superpowers:finishing-a-development-branch; the PR description lists any override (none expected) and says whether §10's fallback was used.
