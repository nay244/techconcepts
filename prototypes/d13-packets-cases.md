# D13a / B15a: the spec review's holes and attack cases (job 14, 2026-11-15)

The reviewer's report (Opus), for `prototypes/d13-packets.md`, `d13-packets.html` and `d13-packets-spot.svg` as the owner approved them (direction 2.66). The orchestrator numbers errata; the holes here are H1 to H13.

**Verdict: HOLES.** A builder would have to guess in six places (H1, H2, H4, H7, H8, H12), one acceptance check measures the wrong thing (21), and eleven checks cannot run in B15a as written, because they need the lesson file the author writes (H5).

## Errata (the orchestrator, Opus 5.5, 2026-11-15)

B15a applies Packets' Appendix A first, on `job14/batch`. Each hole below is an erratum, numbered by the orchestrator; the builder takes the hole's own answer unless a line here rules otherwise. Case lists below are unchanged.

- **E1** = H1: the answer as written under H1.
- **E2** = H2: the answer as written under H2.
- **E3** = H3: one answer for this build: refuse `park laptop …` in a unit whose labels give `router`, with its own message, as the phone is refused. No design change.
- **E4** = H4: the answer as written under H4.
- **E5** = H5: the answer as written under H5.
- **E6** = H6: the answer as written under H6.
- **E7** = H7: the answer as written under H7.
- **E8** = H8: the answer as written under H8.
- **E9** = H9: the answer as written under H9.
- **E10** = H10: the answer as written under H10.
- **E11** = H11: the point as the prototype gives it; `unpark`'s arg is `laptop` only.
- **E12** = H12: the rule as written (`via` in `NET_MAP_ROUTERS`, not `from` or `to`, net-map only, not with `outcome: 'dropped'`); a no-op `via` is accepted; a joined route that passes a router twice is refused.
- **E13** = H13: the answer as written under H13.

## What was read and measured

- **Read:**
  - `plan.md` (B15a, decisions 3, 4 and 6);
  - the spec, the prototype's script, and the story in `.superpowers/analysis/packets/report.md` §2 with its Rulings 1 to 13 and the L25-w rulings;
  - `src/scenes/drivers/net-map.ts`, `src/art/scenes/net-map.ts`, `net-map-layers.ts`, `parts.ts` and `net-map.css`;
  - `src/content/define.ts` and `schema.ts`, `src/content/factcheck/sheet.ts`, `texts.ts`;
  - `src/lesson/ScenePanel.tsx`, `src/scenes/motion.ts`, `src/lib/figures.ts`.
- **The branch.** `job14/batch` is at `94c96b8` ("Merge branch 'revamp' into job14/batch"), not `9807155`, which is its ancestor.
- **The patch.**
  - Appendix A was extracted to a scratch file. `git apply --check` passes on this worktree, which was left unchanged.
  - The patch was then applied in a `git archive` export of `94c96b8`, in a scratch folder.
- **Check 1 holds.**
  - `spot('packets') + '\n'` equals `prototypes/d13-packets-spot.svg` byte for byte: 44,741 characters each.
  - It has 1 `data-lit` and 0 `lm-led on`.
- **Check 2 holds.**
  - `drawNetMap().svg` is still 870,295 characters.
  - With `bays` taken out beside `tops` and `routes` (§5 item 9), `net-map.test.ts` is green: 20 of 20.
- **Check 3 holds.**
  - `bays` is `laptop` [−62.5, 84.5 + 10.8i, 0.4] ×4, `web` [89, −88 + 3i, 18.8 − 4.6i] ×4, and `isp`, `a`, `b`, `c`, `d` one each.
  - Each router's bay equals the last point of `laptop>` that router: (−30,26,6.2), (−28,−20,6.2), (6,4,6.2), (32,−24,6.2), (28,26,6.2).
- **§3's times hold.** Route lengths, measured:

  | Route | Length | Ride at 1× |
  |---|---|---|
  | web → laptop | 266.23 | 2,014.9 ms |
  | web → b | 112.34 | 1,399.4 ms |
  | b → laptop | 153.89 | 1,565.5 ms |
  | web → d | 124.29 | |
  | d → laptop | 169.70 | |
  | web via d to the laptop (joined) | 293.99 | 2,126.0 ms |

  - `web>d` ends on d's top and `d>laptop` starts on it, so `.slice(1)` drops exactly the shared point.
  - Every `*>laptop` route ends at the same point, (−85, 106, 4.2).
- **`via` on the shortest way changes nothing.** The joined `web>b + b>laptop` and `web>c + c>laptop` are each **identical** to `web>laptop`, point for point.
- **`npm test` on the patch: 3 failures in 3 files.**
  - Two are §5 item 9's list: `figures.test.ts` ("the figures match the mockups": only `spot:packets` is new) and `net-map.test.ts:76`.
  - The third is `drivers/net-map.test.ts` "the phone is hidden at every position…", which timed out at 6,866 ms under the full suite. It passes alone in 2.5 s, both with the patch and without it. The patch touches no driver code, so this is load (see Notes).
- **The prototype in Chromium.** At `?at=4.2` and `?at=4.6`, 1440 × 900 and 375 × 812, both themes:
  - the page is 1440 and 375 wide;
  - the parked tags are 38 × 23 at 1440 with no rows, 32 × 20 with four rows (the figure shrinks to its 317px height), and 21 × 13 at 375;
  - one `.nm-gap` after PIECE 3 lands.
  - With the home router's callout switched on, its leader line runs straight across PIECE 1 and PIECE 2 (H3).
- **The later patches.** With Packets' patch applied, Switch's and Load Balancers' Appendix A no longer apply: both fail at `src/art/figures/spots.ts:357`. Every other file of each applies with `--exclude=src/art/figures/spots.ts` (Notes).

## Holes

Worst first.

**H1. One right answer. When a piece lands in its bay, the lit tag is not taken away, so the piece shows twice.**

§3.1 says the slide ends and "the map paints the landed state (the tag now parked and unlit…)". §5 item 5 builds that with the driver's `paint(landed)`. Today `paint` does not touch the moving tag, its trail or the lights: `clear()` does that, at the end of the rest (`drivers/net-map.ts:509-518`).

- **With motion.** For the rest's last 200 ms, the lit tag sits on top of its own unlit copy.
- **Under reduced motion.** "The landed state paints at the rest's start, as today" leaves the lit PIECE 3 at the route's end, inside the laptop, for the whole 450 ms rest. Meanwhile its copy already stands in bay 3: two PIECE 3s.

The prototype answers this. Its `paint` begins with `clearMoving()`, which takes away the tag, the trail and the lights (html script, `paint` and `play`).

**Answer.** For an event that parks its own tag, the landing is `clear()` and then `paint(landed)`:

- with motion, when the 250 ms slide ends (speed-scaled);
- under reduced motion, at the rest's start.

After that, only the settled map shows. The trail "dims to half" at the slide's start (the prototype sets 0.5 at once).

**H2. One right answer. What "never parked twice" allows is not defined, and three tags break it.**

§5 item 4 gives these rules:

- "two tags never share a bay";
- "one tag is never parked twice";
- "a message that parks its own tag parks it at `e.to`";
- "a message whose tag is parked at its `from` … must park it again".

The story parks PIECE 1 twice, at web and then at the laptop. So "twice" cannot mean "ever". The spec does not say what happens to:

- (a) a message whose tag is parked at a place **other than** its `from`, whether or not it parks it;
- (b) a message that parks a tag that is **not its own**;
- (c) a note that parks a tag that is already parked;
- (d) the order inside one message: does the send free `from`'s bay before the message's own park is counted?

**Answer:** the spec's own model, "a parked tag only moves by riding" (§5 item 4, §2.1).

- **The state.** The validator walks the unit's events in order (all steps, in step order), keeping `Map<tag, {place, bay}>`.
- **A message with tag T:**
  1. If T is parked, the message must be sent from T's place. Otherwise it is refused: "PIECE 2 is parked at b; a parked tag only moves by riding from there."
  2. The send deletes T. Then the message's cues apply.
  3. If T was parked, the message must carry `park <e.to> <n> T`.
  4. A message's park cue may name only its own tag.
- **A note's park cue** may name only a tag that is not parked.
- **Any park** into an occupied bay is refused.
- **The parse.** The tag is the rest of the arg after `<place> <bay> `. It must be non-empty and have no space at either end. It is at most `NET_MAP_TAG_MAX` (16) code points, counted as `tagFor` counts them (`[...tag].length`).

**H3. Needs taste (designer), or one answer for this build. The home router's callout crosses the laptop's column.**

The `router` label's leader line runs from the router's front (−58, 80, 11) to the callout at (−64, 262). It is drawn in `#nm-l-calls`, over the tags. Screenshot at 1440: it crosses PIECE 1 and PIECE 2.

§5 item 4 refuses `park laptop …` only under `show phone`. No existing lesson parks, and Packets has no router label, so nothing breaks today. But the validator would let a later lesson draw this.

**Answer for B15a:** refuse `park laptop …` in a unit whose labels give `router`, with its own message, as the phone is refused. A design that lets them share the plate goes to the designer.

**H4. One right answer. Where `park` and `unpark` may appear is open in six places.**

- **(a) A unit's `start`.** `checkStart` accepts every cue the figure has except the status cues (`define.ts:156-168`), and the driver's `settle` would apply a start park. The bay rules of H2 would then have to begin from the start.
- **(b) `unpark` on a message.** Only a note's `play` is designed for it (§5 item 5).
- **(c) `park` on a dropped message.** It never reaches `e.to`.
- **(d) A note with `park` and `drop`.** `duration` is 600 for one and 900 for the other; which wins?
- **(e) `unpark` of a place with nothing parked there.**
- **(f) A self-parking message that also carries `page`.** The page draws itself in over the rest (`drivers/net-map.ts:507-516`), and the slide uses the same rest.

**Answer:** refuse each one, each with its own message. None is designed, and none is in the story.

- `park` and `unpark` are for events only.
- `unpark` is for a note only.
- `park` on a message only when it is delivered.
- A note carries at most one of `park`, `unpark` and `drop`.
- `unpark` needs at least one tag at its place.
- A message that parks its own tag carries no `page` cue.

**H5. One right answer. Eleven acceptance checks cannot run in B15a.**

- **Checks 6 to 14, 18 and 19** need the Packets lesson, which is the author's (§5 item 10).
- **Check 6's `?at=1.2`** is the prototype's own query string. The Lesson page has no such state.
- **Check 21** needs a page.
- **Check 22** needs a ready lesson. The track page draws a card only for an available entry (`src/pages/[track]/index.astro:60` → `lessonFigure`, `src/lib/figures.ts:26-36`).

**Answer** (as job 13's E10 and E11):

- **B15a** builds a test-only fixture, e.g. `src/content/batch3-fixtures.ts` `packets`. It copies the prototype's `PK` events, cells, cues and statuses exactly:
  - every message and note has proto `TCP`, time `—` and size `—`;
  - notes' destination is `—`;
  - each status is a `status` cue on its event;
  - step 5's note carries `status-done`.

  No test pins a placeholder word, only §7's design copy, the tags, the places and the bays.
- **On that fixture, as driver, validator and console unit tests:** checks 1 to 18 and 20. Check 6 becomes "after step 1's second event", which is the settled view at the start of step 2.
- **Check 19:** a `ScenePanel` render of the fixture has no `.stage__views`.
- **B16, with the lesson:** checks 21 and 22, `NO_SEQUENCE`, and `e2e/packets.spec.ts`.

**H6. One right answer. Check 21 measures the wrong pair, with a tool that does not measure it.**

A parked tag's words do not sit on the plate: they sit on the tag's own top face, which is unlit (`.nm-park .iso-top`, `fill: var(--anatomy-top)`). axe's color-contrast rule does not evaluate SVG `<text>`.

**Answer.** Read the computed `fill` of `.nm-park .nm-tag-t` and of the same tag's `.iso-top` with `getComputedStyle`. They must be at least 4.5:1 in light and in dark, at 375 and at 1440. That is B16's end-to-end test, by H5.

**H7. One right answer. §5 item 5's `moveTo` changes every existing tag's `transform` string.**

The new form is `translate(x+O₀ y+O₁) scale(s) translate(−O₀ −O₁)`. At s = 1 it draws the same picture, but the attribute changes on every ride of every lesson. `drivers/net-map.test.ts:103-106` reads a tag's place from the first `translate(x y)`, so it would read x + O₀.

**Answer:** emit today's `translate(x y)` when s is 1, and the scaled form only otherwise, as the prototype's `moveTo` does.

**H8. One right answer. The spec and the prototype disagree under reduced motion, and `animate()` follows the prototype.**

- **The unpark.** §3.1: "the tags stay still for the 700 ms, then the landed state paints". The prototype's `frame` calls `fn(1)` at once, so the tags jump to the screen at opacity 0, and then 700 ms pass. `motion.ts` `animate()` does the same under reduced motion (`frame(1)`, then it resolves at once). A builder who reuses it gets the prototype's behaviour.
- **A self-parking message.** The prototype's rest is 700 ms under reduced motion (`state.reduced ? 700 : 450`), and it paints at the end of the rest. §3.1 says the rest is unchanged and the landing paints at its start.

**Answer:** the spec.

- The unpark under reduced motion is `wait(700 / speed)` with the tags untouched, then `paint`.
- The message's rest is 450 ms (300 ms when `fast`), with H1's landing at its start.

**H9. One right answer. When each new tag of a park note appears.**

The spec says "each at k ≥ i / (n + 1)" and does not say where i starts. The prototype uses `(i + 1) / (n + 1)` with i counted from 0. If i counts from 0 in the spec's formula, bay 1 shows at k = 0.

**Answer:** the j-th new tag (j from 1, in the note's cue order) shows at k ≥ j / (n + 1). For four tags at 1×, that is 120, 240, 360 and 480 ms. Nothing shows before 120 ms.

The prototype orders the tags by depth. For the web deck that is the same order.

**H10. One right answer. Which tag sets the gap's width.**

§4.1 says the gap takes "the nearest parked tag above it". The prototype takes the first parked tag in depth order with a lower bay: the lowest-numbered one, not the nearest.

The story cannot tell them apart: only bay 1 is above bay 2.

**Answer:** the spec. Use the filled bay with the highest number below the gap. The width is (letters × 2.9 + 8) × 0.9 by 10 × 0.9, at height 3.2 × 0.9.

**H11. Half one right answer, half taste. Where the unpark goes.**

- **One right answer: the point.** "6 units across, 14 back and 16 up" has no signs. The prototype gives them:
  - the target is the laptop's route end + (−6, −14, +16) = (−91, 92, 20.2);
  - the scale is 0.9 × (1 − 0.6 × ease(k)), from 0.9 to 0.36;
  - the opacity is 1 − k², with k as linear time;
  - the ease is `easeInOut`.
- **Taste: other places.** §5 item 4 allows `unpark <any place with bays>`, and the comment in §5 item 7 sends every place's tags "into the laptop's screen". `unpark web` would fly four tags across the whole map into the laptop. That is not designed.

  **Recommended:** `unpark`'s arg is `laptop` only, until a design needs another place.

**H12. One right answer and one taste. `via` against `hops()` and the mesh.**

- **One right answer: how "both routes exist" is checked.** `define.ts` has no route data for net-map: `FIGURE_PARTS['net-map']` has no `routes`, and the routes are drawn by the build-time `drawNetMap`, which must not be imported into the validator.

  Every router is a base place, and `routesOf` builds every ordered pair of base places plus each protocol's own sites (`net-map.ts:466-481`). So `from>via` and `via>to` exist whenever `from` and `to` pass today's place checks. The rule becomes:
  - `via` ∈ `NET_MAP_ROUTERS`;
  - `via` ≠ `from` and `via` ≠ `to`;
  - net-map only;
  - not with `outcome: 'dropped'`.

  One test proves it: over `drawNetMap().data.routes`, for every place × router, both keys exist.
- **Taste: two vias the spec does not decide.**
  - **A no-op.** `via: 'b'` or `via: 'c'` on web → laptop gives exactly the plain route (measured). Allowed?
  - **One that doubles back.** laptop → resolver `via: 'd'` is isp → d → isp → a: it rides the isp–d cable twice and passes isp twice.

  **Recommended:** accept the no-op; refuse a joined route that passes a router twice.

**H13. One right answer. Check 4 has no oracle unless the snapshot comes first.**

A snapshot written after the change compares the new driver with itself.

**Answer:** commit the duration list from the **unchanged** driver before any driver edit. That is every event of every net-map lesson, by slug, unit, step and event id. The change must then leave it green.

Alternatively, compute each expected value with today's formula, independently of `duration`: `500 + 4 × length + 450`, the fast and dropped variants, 0, 600 (replace), 900 (match, drop note) and 600 (remove).

## Attack cases

Each is a test a builder can write. "Refuse" means `checkStructure` returns an issue naming the rule; "accept" means it returns none. The fixture is H5's, built from the prototype's `PK`.

### Check 1: the spot

- 1a. `spot('packets') + '\n'` equals `readFileSync('prototypes/d13-packets-spot.svg')`. A wrong build to catch: one that regenerates the `.svg` from its own code.
  - Change one number in `packetsSpot`, e.g. `GAP = 1.7`: the test goes red.
- 1b. The spot has exactly one `data-lit`, 0 `lm-led on`, the plate label `ONE FILE · FOUR PIECES` and §6's aria-label, character for character.
- 1c. `figures.test.ts` `EXPECTED['spot:packets']` is `d0d8b1e5aa32f37d8bee06e74fbd88fc29734b47844849d9fbd7b48d3d9bb4b4`, as measured on the patch.
  - Every other `EXPECTED` entry is unchanged: the new `lumen.css` rule `.iso-face-text.lm-on-lit` matches nothing in any other spot. A grep test: `lm-on-lit` appears in the `iso-face-text` class of no other spot.
- 1d. `lessonFigure` for an available `packets` entry returns `spot('packets')`. That is `figures.ts` `packets: () => spot('packets')`.
  - The test of `figures.test.ts:38` gains `packets`: its card is its spot, it does not throw, and it has no home track yet.

### Check 2: the map is unchanged

- 2a. `drawNetMap().svg` is unchanged: the pinned hash in `net-map.test.ts` stays green with only `bays` destructured out (§5 item 9).
- 2b. `drawNetMap(['tcp:web']).data.bays` deep-equals `drawNetMap().data.bays`: the bays do not depend on `only`.
- 2c. With JavaScript off (the built HTML of the fixture's page, or Home's demo), the SVG holds no `nm-park` and no `nm-gap`.

### Check 3: the bays

- 3a. `bays` has exactly the keys `laptop`, `web`, `isp`, `a`, `b`, `c`, `d`, with lengths 4, 4, 1, 1, 1, 1 and 1.
  - `laptop[0]` is `[-62.5, 84.5, 0.4]` and `laptop[3]` is `[-62.5, 116.9, 0.4]`.
  - `web[0]` is `[89, -88, 18.8]` and `web[3]` is `[89, -79, 5]`.
- 3b. For each router r, `bays[r][0]` deep-equals `routes['laptop>' + r].at(-1)` and has z 6.2.
- 3c. No bay at `router`, `phone`, `resolver` or any server but `web` (`'mail' in bays === false`).

### Check 4: every existing lesson's durations

- 4a. H13's snapshot is recorded before the driver changes, and green after. That is every event of every lesson whose figure is `net-map`.
- 4b. Mutation: change `DROP_NOTE_MS`, or make a note with no park cost 600: 4a goes red.
- 4c. A message with `fast: true` and a park cue: `duration` is `320 + 2.2 × length + 300`. The slide does not lengthen it.
- 4d. A `via` message with `fast: true` is timed on the joined length.

### Check 5: nothing parked in an existing lesson

- 5a. For every net-map lesson, every unit and every position: `show(view)` leaves 0 `.nm-park` and 0 `.nm-gap` in the root.
  - Also, every message's `play` to its end leaves 0 of each.
  - Fold this into the existing every-position sweep, or give it an explicit timeout (Notes).
- 5b. Every lesson in the registry still gives `checkStructure(lesson) === []`. Every committed report's sheet hash is unchanged (`reports.unchanged.test.ts`): `via` absent adds no key.
- 5c. A wrong build to catch: a validator that walks every lesson's cues and refuses a `tray` or `conn` arg with a space as a malformed park. 5b catches it (job 13's E3: a widened rule must not refuse a checked lesson).

### Check 6: after the cut

- 6a. Fixture, the settled view at the start of step 2: four `.nm-park` with `data-place="web"`, `data-bay` 1 to 4, and words `PIECE 1` to `PIECE 4`.
  - None has `[data-lit]` inside it, and none has an `id` or a `style`.
  - Each `transform` contains `scale(0.900)` (or 0.9).
  - The four lie inside `#nm-l-tags`, before `#nm-tag-1`.
- 6b. `.nm-park .nm-tag-t` computes to `--anatomy-hi`. The moving tag's text keeps the dark lit ink: `.nm .nm-tag-t` is unchanged.
- 6c. Order: the `.nm-park` elements are in ascending x + y of their bays (back to front). Reverse the sort and the test goes red.
- 6d. During the park note's `play` at 1× (fake timers): at 100 ms no new tag is visible (opacity 0); at 130 ms bay 1 is visible; at 490 ms all four are (H9).
  - Under `reducedMotion: true`, all four are visible at the first frame. `duration` is still 600.

### Check 7: piece 1

- 7a. Fixture, after step 2: three `.nm-park` at web (bays 2, 3, 4) and one at the laptop, bay 1. The table has one row: `1 · 1–1,460 · Arrived`.
- 7b. The slide (with motion, fake timers): at the ride's end the lit `#nm-tag-7` is at the route's end with scale 1. At rest + 250 ms (speed 1) it is gone (opacity 0), and the copy stands in laptop bay 1 (H1).
  - At no frame after the slide are both `#nm-tag-7` (opacity > 0) and the parked `PIECE 1` at the laptop shown.
- 7c. Under reduced motion: at the rest's start the lit tag is gone and the copy is in bay 1. No frame shows `scale(` on `#nm-tag-7`.

### Check 8: piece 2 on b

- 8a. After step 3: `PIECE 2` parked with `data-place="b"` `data-bay="1"`. Its translate equals `onScreen(bays.b[0])`, which is b's top (`routes['web>b'].at(-1)`). Still no table row for piece 2.
- 8b. Router b's busy light ends as H1 says: off once the landing paints (the prototype's `clearMoving`).

### Check 9: the ride through d

- 9a. Fixture, step 4, PIECE 3's play at k = 0.5: `PIECE 2` is still a `.nm-park` on b.
  - The trail's `points` at the ride's end include `onCable(d)`, which is (28, 26) on screen through `onCable`, and do not include `onCable(b)`, which is (6, 4).
- 9b. `routeOf(data, {from:'web', to:'laptop', via:'d'})` has length 293.99 ± 0.01. It has no two equal consecutive points: the shared d point appears once, so check `.slice(1)`.
- 9c. `routeOf` with `via: 'b'` deep-equals `routes['web>laptop']`, as measured. A build that does not slice gives a duplicate point, and this test goes red.
- 9d. Without `via`, `routeOf` returns `routes[from>to]` itself. Every existing ride is unchanged (4a).

### Check 10: the gap

- 10a. After PIECE 3 lands: laptop bays 1 and 3 are filled, and there is exactly one `.nm-gap` with `data-place="laptop"` `data-bay="2"`. The status is "Out of order: piece 2 not here yet".
- 10b. The gap's polygon equals the four corners of §4.1. Width (7 × 2.9 + 8) × 0.9 = 25.47 by 9, at z 0.4 + 2.88, about bay 2's point, through `onScreen` + `O`.
- 10c. No gap at web after pieces 1 and 2 have left (bays 3 and 4 filled, 1 and 2 empty): nothing filled before them. No gap at the laptop while only bay 1 is filled.
- 10d. A synthetic state with laptop bays 1 and 4 filled: two gaps, at bays 2 and 3. Each is as wide as bay 1's tag (H10). With bays 1, 2 and 4 filled, the gap at bay 3 takes bay 2's tag's width. Give bay 2 a tag of a different length to tell nearest from first.
- 10e. A gap at web, with bays 1 and 3 filled by a test-only note: one `.nm-gap` at web bay 2. Gaps are per place, at any place.

### Check 11: piece 2 arrives

- 11a. After PIECE 2 lands: four `.nm-park` at the laptop, bays 1 to 4. No `.nm-gap`, nothing at b, nothing at web.
  - The table rows are in key order `1, 3, 4, 2`.
  - The status is "All 4 pieces here", plain (no `known` or `done`).
- 11b. In the first frame of PIECE 2's ride, b holds no `.nm-park` (check 16). During the ride, the laptop still shows 1, gap, 3, 4. The gap goes only at the landing.

### Check 12: back in order

- 12a. After step 5's replace: rows in order `1, 2, 3, 4`, each Status "In order". `duration` of the replace is 600.

### Check 13: the hand-over

- 13a. After step 5's note: 0 `.nm-park` and 0 `.nm-gap`. The page's `text` part has opacity 1 and `full` does not. `#nm-lapState` has class `nm-state done` and the text "Page complete".
- 13b. During the unpark at 1× (fake timers) at 350 ms: each laptop tag's transform has scale between 0.36 and 0.9. Its opacity is 1 − 0.5² = 0.75 ± 0.01. Its translate lies between its bay and (−91, 92, 20.2) on screen (H11). No `.nm-gap` is present.
  - The page's text is still at opacity 0. It shows only at the landing.
- 13c. Under reduced motion at 350 ms: the four tags are exactly where `show` put them, at opacity 1 and scale 0.9 (H8). At the landing, nothing is parked and the page's text shows.

### Check 14: seek

- 14a. For every step of the fixture, compare two ways of reaching its end:
  - `show(view at step N+1's start)`;
  - playing steps 1..N event by event (fake timers), then `show` once more.

  The two give identical `#nm-l-tags` markup for `.nm-park` and `.nm-gap`: tags, places, bays, transforms and points.
- 14b. Abort mid-slide, mid-glide and mid-reveal (pause), then `show(view)`. The parked tags are at their bays at opacity 1 and scale 0.9, with no stray `style` and no `scale(` on any `#nm-tag-n`.
- 14c. `clear()` leaves `.nm-park` and `.nm-gap` in place: play a non-parking event after a park, and the parks survive.

### Check 15: times

- 15a. `duration`:
  - the park note: 600;
  - the unpark note: 700;
  - PIECE 3 and PIECE 4 (via d): 2,126 ± 1;
  - PIECE 2 web → b: 1,399 ± 1;
  - b → laptop: 1,566 ± 1;
  - REQUEST and PIECE 1: 2,015 ± 1;
  - the table adds: 0.
- 15b. A note with `page` and `status` cues and no park, unpark or drop: `duration` is 0 (unchanged).

### Check 16: the copy leaves at the send

- 16a. In the first frame of PIECE 1's ride, after `play` starts and before the first animation tick, web holds bays 2 to 4 only. In the first frame of PIECE 2's from-b ride, b holds nothing.
- 16b. Removal is by tag at `from`: a parked tag of the same length but different words, e.g. `PIECE 3` while `PIECE 1` rides, stays.

### Check 17: speed and reduced motion

- 17a. At speed 2, the park reveal ends by 300 ms, the unpark glide by 350 ms and the slide by 125 ms. `duration` is unchanged: the panel scales it.
- 17b. Under reduced motion, at no frame does any `.nm-park` or `#nm-tag-n` carry a transform between two of its end states.
- 17c. A play never outlasts its event. With `wait` stubbed to resolve at its full time, every `play` of the fixture's events resolves within `duration / speed` + one frame.

### Check 18: the log

- 18a. Fixture end: the log has 8 rows, in the order REQUEST, cut note, PIECE 1, PIECE 2 (web → b), PIECE 3, PIECE 4, PIECE 2 (b → laptop), hand-over note.
  - Every row's Protocol is `TCP`. Every Time and Size is `—`.
  - PIECE 3's row is one row, with no row at d.

### Check 19: no view switch

- 19a. `ScenePanel` with the fixture unit renders no `[aria-label="View"]` group (`views: ['network']`).

### Check 20: the validator

Each is refused with its own message, and the nearest valid case is accepted.

- 20a. `park moon 1 X`: refuse. `park laptop 1 X` on a note: accept.
- 20b. `park laptop 5 X` and `park web 0 X`: refuse. `park laptop 4 X` and `park web 4 X`: accept. `park b 2 X`: refuse. `park b 1 X`: accept.
- 20c. `park laptop 10 X` (two digits) and `park laptop 1` (no tag): refuse as malformed. `park laptop 1  X` (two spaces) and `park laptop 1 X ` (a space at the end): refuse (H2).
- 20d. A 17-code-point tag: refuse. 16: accept. A tag with an accented letter counts by code points, so 16 code points is accepted.
- 20e. Two notes, `park web 1 A` and then `park web 1 B`: refuse (the bay is taken). `park web 1 A`, then a message A web → laptop with `park laptop 1 A`, then `park web 1 B`: accept (the send frees bay 1).
- 20f. `park web 1 A` twice on notes: refuse (parked twice). The story's PIECE 1, web and then the laptop by riding: accept.
- 20g. A message A b → laptop with `park web 1 A`: refuse (not at `e.to`). With `park laptop 1 A`: accept.
- 20h. A parked at web, then a message A web → laptop with no park cue: refuse. With `park laptop 1 A`: accept.
- 20i. A parked at b, then a message A web → laptop with `park laptop 2 A`: refuse (A is parked at b; H2 a).
- 20j. A message B web → laptop with `park laptop 1 A`: refuse (a message parks only its own tag; H2 b).
- 20k. `via` on a message in a `dhcp`, `osi` or `subnet` lesson: refuse. On net-map: accept.
- 20l. `via: 'laptop'`, `via: 'router'`, `via: 'web'`: refuse. `via: 'isp'` on web → laptop: accept.
- 20m. `via: 'c'` on c → laptop, and `via: 'b'` on web → b: refuse (equal to `from` or `to`).
- 20n. `via` with `outcome: 'dropped'` (and `dropAt`): refuse. `via` on a delivered message: accept.
- 20o. One note with `park web 1 A` and `unpark laptop`: refuse. Two notes, one each: accept.
- 20p. `park laptop 1 A` in a unit whose start has `show phone`: refuse.
  - `park b 1 A` in the same unit: accept. Only the laptop's column lies where the phone does.
  - `park laptop 1 A` in a unit with a `router` label: refuse (H3).
- 20q. `park web 1 A` in a unit whose layers draw no web server, e.g. only `smtp:mail`: refuse, naming the layers that draw `web`. Under `tcp:web` or `https:web`: accept (job 13's E3 rule: any layer that draws the site).
- 20r. H4: each of these is refused:
  - a start cue `park web 1 A`;
  - `unpark laptop` on a message;
  - `park laptop 1 A` on a dropped message;
  - one note with `park` and `drop`;
  - `unpark laptop` with nothing at the laptop;
  - a self-parking message with `page text`.
- 20s. `unpark web` with tags at web: refuse if the orchestrator takes H11's recommendation, accept if not. Either way, a test pins the ruling.
- 20t. H12: laptop → resolver `via: 'd'`: refuse if the orchestrator takes the recommendation. web → laptop `via: 'c'` (a no-op): accept.
- 20u. Every message above, after it is refused, is still refused when its step is moved later. The bay state follows step order across steps, not within one step alone.

### Check 21: contrast and width

- 21a. B16, at 375 and 1440, light and dark: `document.documentElement.scrollWidth` equals the viewport width at every step. The measured figures are 1440 and 375.
- 21b. B16: the computed fill of `.nm-park .nm-tag-t` against its own tag's `.iso-top` fill is at least 4.5:1 in both themes (H6).

### Check 22: the card

- 22a. B16: on `/networking`, Packets' card holds `spot('packets')`'s SVG, the title "Packets" and the sub "Cut up, sent apart, put back together". It sits in stop 2's slot.

### Beyond the checks

- **The claim sheet.**
  - The fixture's sheet item for PIECE 3 contains `via: 'd'` and the cue `{cue:'park', arg:'laptop 3 PIECE 3'}`.
  - Changing `via` to `'c'`, or the park's bay, changes the hash.
  - `via` is not in `DISPLAY_ONLY`: the way is part of what a reader sees.
- **The bundle.** `npm run build`, then `scripts/check-budgets.mjs`, pass. The lesson's shared chunk grows by under 2 KB gzipped against the build on `94c96b8` (§5 puts the driver at 1.35 KB).
- **The driver's comment.** It lists `park`, `unpark` and `via` (§5 item 7). That is a grep test, like the cue list.
- **The CSS.** `net-map.css` holds §5 item 6's two rules exactly. The gap's stroke takes `--anatomy-mid` and `vector-effect: non-scaling-stroke`.

## Notes (nothing in B15a changes for them)

- **B15b and B15c's patches no longer apply once Packets' is in** (measured):
  - `git apply --check` fails for both at `src/art/figures/spots.ts:357`: each adds its spot function after `tcpUdpSpot` and rewrites the `SPOTS` and `DRAW` lines from the base. Every other file of each applies.
  - Their builders apply with `--exclude=src/art/figures/spots.ts` and merge that hunk by hand, keeping every part's entry (plan decision 3). Their spot-equals-`.svg` tests guard the result.
  - Both also touch `src/art/scenes/index.test.ts:7`, so B15c may meet the same after B15b.
- **The every-position sweep is near its timeout.** `drivers/net-map.test.ts` "the phone is hidden at every position…" took 6,866 ms and failed once under the full suite, on the patch. It passes alone in 2.5 s. Check 5's sweep would add as much again.
- **A message's own tag has no length check today.** `NET_MAP_TAG_MAX` is enforced nowhere in `define.ts`, and the driver clamps to `nm-tag-16`. The park tag gets the check (§5 item 4); a 17-character message tag still validates. That is outside this unit.
- **Without JavaScript, the parked tags, the gap and the route through d do not show.** The figure stays as drawn. The net-map lessons' no-JavaScript fallback is held for the owner (plan decision 13). The log's plain lines and the table carry the story.
- **For a screen reader**, the figure is `role="img"` with one `aria-label`. The status line and the column are inside it, so neither is read. The plain lines ("…reaches your laptop before piece 2") and the table say it in words.
