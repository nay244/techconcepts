# D12 / B14: the spec review's holes and attack cases (job 13, 2026-11-15)

The reviewer's report (Opus), saved by the orchestrator as written. The orchestrator's errata come first.

## Errata (the orchestrator, 2026-11-15)

Holes with one right answer, closed as the review answers them; each is part of the approved design for B14. H1, H8 (where the line runs) and H10 need taste and went to the designer: the answers are in `d12-batch-2.md` §11.

- **E1 (H2).** `data-split` is set exactly when `tables.frames.highlight?.type === 'matched'` and its key is `00:00:5E:00:53:10`; never after an `update`.
- **E2 (H3).** MAC's table: id `frames`, `keyColumn: 'mac'`, columns `device`, `mac`, `frame`. Each place's row is found by the MAC its callout draws (router …:01, laptop …:10, phone …:11, TV …:12); a missing row, "—" or any other word removes `data-v` and empties `.dh-v-t`. A fixture test now and MAC's lesson test in B14b assert the table's shape, the four rows and that every `frame` cell is "—", Sent it, Hears it, Keeps it or Ignores it.
- **E3 (H4).** The widened plate rule on net-map: a message to or from a non-base place is valid when **any** layer in `scene.layers` has that site in `plateSites`; the issue names the layers that would draw it. Every existing lesson still validates.
- **E4 (H5).** dhcp's `FIGURE_PARTS` gains `routes: ['laptop>router', 'router>laptop']`; the routes check refuses every phone or TV message, with or without `frames`. `places` keeps `phone` and `tv`.
- **E5 (H6).** Check 10 reads "all three `[data-setup="addresses"]` groups".
- **E6 (H7).** Check 22: the line's centre (left + width/2) lies between cell `prefix`'s right edge and cell `prefix + 1`'s left edge.
- **E7 (H8, the measure).** Superseded by the designer's §11: under 640px the line is a segment over each shown row's bits (never through the decimals), each row's first line fixed at 16px (a 51px pitch), the copies drawn as box-shadows; §11 replaces §5 item 6.
- **E8 (H9).** Under 640px hide only `colgroup`; `thead` stays as it is, so the three column headers stay in the accessibility tree.
- **E9 (H11).** dhcp's `clear()` puts both ring circles back at `ringAt.laptop` and removes `on` from `#dh-tv-glow`.
- **E10 (H12).** B14 builds with unit tests on a test-only `src/content/batch2-fixtures.ts` (checks 1–20, 23, 24, 26, 27, 29, check 28's `lessonFigure`) and runs Subnetting's end-to-end spec at 375 and 1440 with `E2E_PORT=4481` (check 22, H8, H9, the Subnetting part of 21 and 25). B14b takes check 21 for IP, 25, 28's track page, §4.2's sizes, H10's result, `NO_SEQUENCE` gaining `ip-address` and `mac-address`, and `e2e/{ip-address,mac-address,tcp-udp}.spec.ts`.
- **E11 (H13).** The fixtures copy the prototype's scene data (steps, events, cells, logs, legends, update order); no test pins a placeholder word, only §7's design copy, the MACs, the addresses and the cell words.

**Verdict: HOLES.** A builder would have to guess in five places (H1, H3, H5, H8, H10), and three acceptance checks cannot pass as written (10, 13 read naïvely, 22).

The reviewer (Opus) read these:

- `prototypes/d12-batch-2.md` and the script in `d12-batch-2.html`, which holds the fixture data for all three scenes;
- the five `d12-*.svg` files;
- B14 and decisions 3, 4 and 9 in `plan.md`;
- the code the build changes.

**The branch.** `job13/batch` is at `91a085d` ("Merge branch 'revamp' into job13/batch"), not `7a679eb`. `7a679eb` is its ancestor, and `91a085d` differs from `caa6f17` only in `src/content/sources{,.test}.ts`.

**What was measured.** The branch was exported with `git archive` to a scratch folder, and the patch in Appendix A was extracted and applied there. `git apply --check` passes.

- **Checks 1 to 3 hold.** All five files equal the patch's output byte for byte:
  - each `spot(kind) + '\n'`;
  - 5 voice groups;
  - 2 + 1 + 1 frames groups, joined in document order.
- **Check 4 holds.**
  - dhcp: take out the 4 groups whole, then unwrap all **three** `addresses` wrappers and drop `ringAt` and `places`. The SVG and the data then hash to today's `8414027c…` and `969cd649…`.
  - net-map: take out the 5 voice groups and the 18 routes to or from `voice`, then run today's `withoutD11` and `withoutRouterParts`. The test is green.
- **Checks 5, 6 and 29 hold.**
  - The viewBoxes are `-73 -30 668 318` and `-98 -60 685 378`.
  - Ids are unique: 31 in dhcp, 79 in net-map.
  - The new ids are exactly the ten listed.
  - `ringAt` is as stated, `places.tv` is `[65,-62.5]` and `places.phone` is `[66,34.6]`.
  - Each spot has one `data-lit`; the `lm-led on` counts are 0, 1 and 0.
- **§3.2's distances.** All ten, and their k values, were recomputed from `places` and agree with the spec.
- **Type check and tests.** `astro check` reports 0 errors. `npm test` on the patch gives **6 failures in 4 files**, exactly §5.8's list (below).
- **Size, gzipped.**
  - The net-map figure grows +4.3 KB (85.4 to 89.7) on every net-map page, and its data +0.16 KB.
  - The dhcp figure grows +1.4 KB (13.9 to 15.3).
- **§5 item 6's CSS on a page.** It was injected into the built Subnetting page (the main folder's `dist/` of 2026-11-14, served locally, Chromium).
  - At 1440 the marigold line sits exactly where it does today, at /26 (700.5 to 702.5) and at /30.
  - At 375 the Bits tab does not scroll (375 in 375).
  - H6 to H9 come from these runs.

## Holes

Worst first. Each has one right answer unless marked "needs taste".

**H1. Needs taste (designer). The figure shows the previous step's verdicts while a step's four updates land.**

`ScenePanel.tsx:96-106` calls `show(view before the event)` and then `play(event)` for every event. §5.3 paints every verdict from the rows after the event. So after a frame lands, each update repaints all four devices from a table whose other rows still hold the step before's cells.

At 1×, with the prototype's order (the sender's row first, then the table's order):

- **Step 5.** The phone and the TV show "Keeps it", screens lit, for 800 and 1200 ms before "Ignores it". This is the step whose point is that they ignore it.
- **Step 4.** The laptop shows "Sent it" for 400 ms although the router sent this frame. The phone and the TV show "Ignores it" for 800 and 1200 ms, in the step where everyone keeps it.
- **Step 1.** The three "Hears it" vanish (their cells are "—") and come back one at a time.

The approved prototype does the same: `playStep` paints the table after the message, before any update. The options:

- (a) Keep it as approved.
- (b) Make each message step's four updates one `replace`. This loses the per-row beat.
- (c) Steps 4 and 5 first `replace` the This frame cells with "—". The column blanks before the frame and fills in after it, as step 1 already does.
- (d) The driver paints a row this step has not changed as the ride left it (Sent it or Hears it). This needs the step's starting tables in `SceneView`, an engine change.

Whatever is chosen gets a test (case 15c).

**H2. The split must follow a match only.** `highlightFor` (`src/engine/tables.ts:92-104`) gives an `update` the highlight `{ key, type: 'updated' }`. The prototype's `tableOp` sets a highlight on a match only.

Read as "highlight key is the laptop's", §2.6 shows the brackets for 400 ms after the laptop's update in steps 1, 4 and 5, and check 13 fails.

**Answer:** `data-split` is set exactly when `tables.frames.highlight?.type === 'matched' && highlight.key === '00:00:5E:00:53:10'`.

**H3. The frames table's column keys and the row-to-device mapping are only in the prototype's script.** The spec names the columns by label (Device, MAC address, This frame) and the key column `mac`, but not the key of This frame. The dhcp driver hard-codes its table keys (`dhcp.ts:26-28`).

**Answer** (the prototype's `MAC.table` and `DH.paint`):

- Table id `frames`, keyColumn `mac`, columns `device`, `mac` and `frame`.
- Each place's row is found by the MAC its callout draws: router 00:00:5E:00:53:01, laptop …:10, phone …:11, TV …:12.
- A missing row, "—" or any other word removes `data-v` and empties `.dh-v-t`.

The guard follows DHCP's own pattern (`src/content/lessons/dhcp.test.ts:52`, "the board reads the lease table the figure expects"). A fixture test now, and MAC's lesson test in B14b, assert:

- the table is `frames`, keyed `mac`, with a `frame` column;
- its four initial rows carry the four drawn MACs;
- every `frame` cell, in the initial rows and in every update, is "—", Sent it, Hears it, Keeps it or Ignores it.

**H4. Widening the site rule as written breaks 8 checked lessons (measured).** `define.ts:270-273` finds a site's layer with `.find` (the first plate that draws it). That works today only because `server` and `stranger` each have one layer.

`web` is drawn by six layers and `mail` by two. Swapping the list for every site fails these units, whose layer is not the first that draws their site:

- `nat` (tcp:web)
- `router` (ip:web)
- `what-is-https`, `what-is-icmp`, `what-is-ip`, `what-is-tcp`, `what-is-tls` (their own `<proto>:web`)
- `what-is-imap` (imap:mail)

**Answer:** on net-map, a message to or from a non-base place is valid when **any** layer in `scene.layers` has that site in `plateSites`. The issue names the layers that would draw it.

**H5. dhcp messages the figure cannot draw.** The arc runs only between the laptop and the router, and `ringAt` has only `laptop` and `router`.

- In frames, a message from `tv` or `phone` makes `ringAt[from]` undefined, and `play` throws. `playSafely` swallows it in production, so the frame silently never plays.
- Without frames, today's driver rides a phone message on the laptop's arc.

§5 item 4's "a message to or from `tv` needs `frames`" implies such a message is valid. That cannot hold together with the drawing.

**Answer:** give dhcp's `FIGURE_PARTS` the entry `routes: ['laptop>router', 'router>laptop']`. The existing routes check (`define.ts:276-278`) then refuses every phone or TV message, with or without frames, so the TV rule is covered by it. DHCP's ways are only these two (measured), so it still validates. `places` keeps `phone` and `tv` for the parties.

**H6. Check 10 says "both" `[data-setup="addresses"]` groups; the patch draws three:** the lease board, the cable, and DHCP's four callouts (measured). **Answer:** all three have `display="none"`.

**H7. Check 22 as worded fails on today's board.** The line is 2px wide and centred on a 1px gap. Its left edge lies 0.5px inside cell `prefix` at /26 and /30, at 1440 today (700.5 against the cell's right edge at 701) and at 375 under B (261.5 against 262).

**Answer:** the line's centre, left + width/2, lies between cell `prefix`'s right edge and cell `prefix + 1`'s left edge. At /24, across the octet gap, that is 242 within 239 to 245.

**H8. The line's height under 640px. The measure has one answer; where the line runs needs taste (designer).**

*The measure.* At 375, the row pitch under B is **50.6px** in Chromium: label line 15.6 (13px × 1.2), row gap 5, cells 18, margin 12. Today's `--rows * 22px + 2px` stops the line 54px short: with 3 rows it ends at y 510.3 while row 3's cells run from 546.5 to 564.5.

**Answer:** under 639px,

- `height: calc((var(--rows) - 1) * <pitch> + 24px)`, with `top: -3px` kept;
- the first line of every row given a fixed height, so an empty `data-off` row keeps the pitch. Its empty `th` and `.bits__dec` would otherwise shrink that row to 35px. Subnetting never shows a hidden middle row, but the schema allows a third row without a mask.

*Needs taste.* At full height the line runs through the Mask row's decimal text at /26 and /30. "255.255.255.192" and "255.255.255.252" span x 237.8 to 361; the line is at 261.5 to 263.5 and 297.5 to 299.5. Row 3's decimals are crossed too. The designer chooses: a line through the text, or a segment in each shown row's bits. The prototype never draws the line (§10 question 7).

**H9. `display: none` on `thead` takes the column headers away from a screen reader (measured).** Chromium's accessibility snapshot at 375 under B loses `columnheader` Row, Bits and Address; the table role stays. §5 item 6's "reads the same" is false.

**Answer:** hide only `colgroup`. Leave `thead` as it is (`display: block; height: 0; overflow: hidden`). Measured: the thead is 0 tall, row 1's cells stay at y 445.3, and the three column headers are back.

**H10. Needs a ruling (designer, then orchestrator). With JavaScript off, and before hydration, MAC Address shows DHCP's setup.** The page draws `drawFigure('dhcp')` (`[lesson].astro:37`), and `frames` is applied only by the driver. Until the island loads, and with JavaScript off, the MAC Address page shows:

- the lease board, "Router / hands out addresses", "Lease table" and "Laptop … No IP address yet";
- no TV;
- DHCP's aria-label.

A flash from the lease board to the TV on every load comes with it. E9's rule (the label is the drawn one) keeps that consistent, but the drawing is another lesson's scene. A build-time `frames` setup, as `fillLabels` does for labels, would close it: `display` on the two `data-setup` kinds, `#dh-lap-ip` opacity and the aria-label.

**H11. The ring's place and the TV's glow after a play.** `play` moves both circles to `ringAt[from]`, and §5.3 never moves them back. After step 4 or 5, a `show` leaves the circles at the router, so play-then-show is not a fresh show and check 15's comparison fails. Today's `clear()` also does not know `#dh-tv-glow`.

**Answer:** `clear()` puts both circles back at `ringAt.laptop` (where the drawing has them) and removes `on` from `#dh-tv-glow`.

**H12. B14 has no lesson pages. Split the work as D11 H8 did.**

- **B14:**
  - unit tests on a test-only `src/content/batch2-fixtures.ts`: checks 1 to 20, 23, 24, 26, 27, 29, and check 28's `lessonFigure`;
  - **an end-to-end run on Subnetting**, which exists and whose board B14's CSS changes: check 22, H8, H9, and the Subnetting part of 21 and 25. B14 needs an E2E port of its own.
- **B14b:** check 21 for IP, check 25, check 28's track page, §4.2's sizes, H10's result, `NO_SEQUENCE` gaining `ip-address` and `mac-address`, and `e2e/{ip-address,mac-address,tcp-udp}.spec.ts`.

**H13. Words the fixtures need.** The prototype's script holds each scene's complete data: steps, events, cells, logs, legends, and the update order (sender first). **Answer:** the fixtures copy it. No test pins a placeholder word, only §7's design copy, the MACs, the addresses and the cell words.

## What the build can break

- **Red on the patch: 6 tests, all named in §5.8.**
  - `src/art/figures/figures.test.ts` "the figures match the mockups"
  - `src/art/scenes/dhcp.test.ts` "drawDhcp matches the mockup scene"
  - `src/art/scenes/net-map.test.ts` "drawNetMap matches the mockup map"
  - `src/art/scenes/net-map-layers.test.ts`: the key order, `FIGURE_PARTS` places, and "D11's two layers … describe"
- **Green, but to extend.**
  - `dhcp.test.ts` `#dh-tag-%s carries the word %s` gains `frame` FRAME and `to-all` TO ALL.
  - `src/scenes/drivers/dhcp.test.ts:102`: its name says a table event lasts 0. It gains the frames update (400) and match (900); `lease-*` stay 0.
  - `drivers/dhcp.test.ts:144`: DHCP's phone at 0.55 must stay.
  - `src/content/lessons/dhcp.test.ts:98`: DHCP's show sweep must stay green.
  - `e2e/lesson.spec.ts:303`: DHCP's reduced-motion run time.
  - `net-map.test.ts:148`: every non-http layer has 5 hidden groups; voice has 5.
  - `src/lib/home.test.ts:58`: Home draws only `http:web`.
  - `BitsBoard.test.tsx`: the line's inline variables are unchanged.
- **Lessons.**
  - DHCP's figure and durations (cases 9 and 14).
  - Subnetting's board: unchanged at 640 and over (measured); below 640 it changes by the owner's choice (H8, H9).
  - The net-map lessons: their drawing hash, the validator (H4), and the per-step durations of all 18 units. B14 should not touch the net-map driver.
  - Card hashes: the 11 existing spots and the covers are unchanged; `EXPECTED` gains three.

## Attack cases

Each is a test. "Fails when" says how to see it go red.

### The files (checks 1 to 6), in `dhcp.test.ts`, `net-map.test.ts` and `figures.test.ts`

- **1.** Each spot file equals `spot(kind) + '\n'`, whole.
  - Fails when one coordinate in `ipSpot` changes, or a `DRAW` key is misspelt.
- **2.** `groupsOf(drawNetMap().svg, '<g data-layer="tcp-udp:voice" display="none">')` gives 5 groups, joined between the fixed header and `</svg>\n`.
  - Fails when `describe` is drawn, or the `call` kind's cable changes.
- **3.** The four frames groups, joined **in document order**: the TV's group, `dh-tag-frame`, `dh-tag-to-all`, then the callouts' group.
  - Fails when they are joined in open-string order: the callouts would come before the tags.
- **4.** The hashes:
  - dhcp: groups out whole first, then all three `addresses` wrappers unwrapped.
  - net-map: voice groups out, plus `voice` added to the dropped route places.
  - Fails when only two wrappers are unwrapped, or `laptop>voice` is left in the data.
- **5.** The ten new ids each appear exactly once; every dhcp id starts with `dh-`; the two viewBoxes are as above.
- **6.** `ringAt` and `places` deep-equal the measured values.

### Validator (checks 7 and 8), in `define.batch2.test.ts` with the real `FIGURE_PARTS`

- **7. These pass:**
  - each fixture's `checkStructure` returns `[]`;
  - every lesson of the site still validates, the 8 lessons of H4 included;
  - `imap:mail` with a `mail` message;
  - What is UDP with `udp:call`.
  - Fails when the site rule uses the first matching layer.
- **8. Each of these gives exactly one issue:**
  - `frames` on an event's cues;
  - `frames` in a subnet start (and in a net-map start): "is not one the … figure has".
- **8, one issue per message:**
  - TCP/UDP's fixture with layers `['tcp:web']`: 4, one for each of VOICE 1 and SAM 1 to 3;
  - What is UDP with layers `[]`: one for each `call` message;
  - a `laptop>tv` message in MAC's fixture (H5);
  - a `phone>router` message in DHCP (H5).

### Driver: dhcp (checks 9 to 15), in `src/scenes/drivers/dhcp.test.ts`, with the MAC fixture

- **9.** DHCP at every position:
  - both frames groups keep `display="none"`;
  - no `.dh-v[data-v]` and no `data-split`;
  - `#dh-lap-noip` and the aria-label are as today.
  - DHCP's per-step duration sums equal values recorded before the change.
  - Fails when frames logic runs without the start cue.
- **10.** MAC at every position, the Overview included:
  - all three `addresses` groups have `display="none"`, and both frames groups are shown;
  - `#dh-lap-ip` reads 192.168.1.100 at opacity 1, and `#dh-lap-noip` is at 0;
  - the aria-label equals §5 item 3 exactly.
- **11.** At each step's end:
  - `data-v` and `.dh-v-t` of the four verdicts match §3.2's cells;
  - a light is `.on` exactly when its cell is "Keeps it": `#dh-lap-glow`, `#dh-ph-glow`, `#dh-tv-glow`, and `#dh-led-1` to `#dh-led-3` for the router;
  - `#dh-led-0` is always on.
  - Fails when `clear()` lacks the TV: step 5's ride would start with the TV still glowing.
- **12.** Under fake animation frames, from the laptop (step 1):
  - at k 0.45 the router `hears`;
  - at k 0.56 the phone has no verdict. Fails when DHCP's 0.55 rule is kept.
  - at k 0.7 all three `hears`;
  - the laptop is `sent`, with its glow on, from k 0.
- **12, from the router (step 4):**
  - at k 0.37 only the TV;
  - at k 0.45 the TV and the laptop;
  - at k 0.5 all three;
  - both circles have `cx` −11 and `cy` −49.
- **12, the tags:**
  - `#dh-tag-to-all` is at opacity 1 during step 4's ride, `#dh-tag-frame` in steps 1 and 5. Fails with today's `tag.toLowerCase()` lookup ("to all").
  - The ring group shows for step 1's and step 5's frames, which are not broadcasts.
  - In DHCP, the Offer shows no ring.
- **12, reduced motion:** every hearer `hears` at once, and the ring group stays at 0.
- **13.** `data-split`:
  - on at step 3's end, and as soon as the match plays;
  - off at step 3's start and step 4's start;
  - **off after the laptop's update in steps 1, 4 and 5** (H2).
- **14.** `duration`:
  - a `frames` update is 400 (the wait at 2× is 200), a `frames` match 900;
  - a `leases` add or update is 0; a message is 1850.
  - Fails when the time is keyed on `op` alone, since DHCP's lease updates would take 400.
- **15.** Play against show:
  - **a.** For each MAC step, under full and reduced motion, play every event, then `show(view at the step's end)`. The `outerHTML` equals a fresh driver's show, the ring circles included (H11).
  - **b.** The show sweep (`src/test/show-sweep.ts`) on the MAC fixture. Fails when stale `.dh-v-t` text, or `data-split`, survives a jump backwards.
  - **c.** H1's answer, as a test, once ruled.

### Driver: net-map (checks 16 to 19), in `src/scenes/drivers/net-map.test.ts`, with the TCP/UDP fixture

- **16.** The voice layer:
  - the five voice groups are shown at every TCP/UDP position, and hidden in every other lesson and on Home;
  - showing TCP/UDP and then What is UDP on one driver hides them again;
  - the aria-label equals "A network map. On the left, your home: a laptop and its router. In the middle, the internet: five routers joined by cables. On the right, the servers this protocol talks to. Behind the internet, the voice server the call goes through.";
  - `#nm-tcp-udp-busy-voice` turns on when VOICE 1 lands and is off after the rest.
- **17.** One `.nm-conn` from the laptop to the web plate, from step 1's end to step 5's.
- **18.** The LOST mark shows during the plays of PIECE 2 and SAM 2, and not once the step settles.
- **19.** `#nm-page [data-part="text"]` is at opacity 0 before step 3's last ACK, and 1 from it on.

### Panels and log (checks 20, 23, 24, 26 and 27), in `BitsBoard.test.tsx`, `TablePanel.test.tsx` and `LogPanel.test.tsx` with the fixtures

- **20.** The bits board:
  - each step's rows are §3.1's;
  - the caption is "32 bits, in four groups of 8", and before step 1 "The Sales laptop’s address appears here in step 1";
  - no `data-part`, `data-differs` or `data-matches`; row 2 has `data-off`;
  - 0.0.0.0 and 255.255.255.255, as a `cmp` row with no prefix, do not throw.
- **23.** The MAC table:
  - the This frame cells at each step's end;
  - at step 3 the laptop's row has `data-highlight="matched"`.
- **24.** The TCP/UDP table:
  - "Nothing yet." before step 2;
  - rows 1, 2, 3 in that order at step 2's end (fails when 3 is added before 2);
  - the cells at step 3's and step 5's ends;
  - no `data-miss` anywhere.
- **26.** The logs:
  - IP has 7 rows; their glyphs are request ×4 (steps 1, 2 and 3's first), response, request, broadcast;
  - MAC has 3 rows, with "—" for time and size and Wi-Fi as the protocol;
  - TCP/UDP has 14 rows; rows 6 and 13 have `data-outcome="dropped"` and the flag "Dropped".
- **27.** Each legend deep-equals §3's list, in order.
  - TCP/UDP's legend has no "Request" or "Reply". Fails when `eventLog()`'s legend is kept.

### Cards (checks 28 and 29), in `figures.test.ts` and `src/lib/figures.test.ts`

- **28.** `lessonFigure` returns `spot(...)` for each of the three, from a constructed summary. The track page is B14b's.
- **29.** One `data-lit` each; `lm-led on` counts 0, 1 and 0; each aria-label equals §6.

### Subnetting's board (checks 21, 22 and 25 for Subnetting; H8, H9), B14's end-to-end run

- At 375, at the end of every slot:
  - the Bits tab has `scrollWidth ≤ clientWidth`;
  - the line passes H7's centre rule;
  - its top is at or above row 1's cells, and its bottom at or below the last shown row's cells, within 4px;
  - three `columnheader`s are in the accessibility snapshot.
- At 1440, the line's left edge equals the value recorded before the change, at /24, /26 and /30.

### B14b (lesson pages)

- **21.** At 375, IP's Bits tab never scrolls at any step, and every label is whole. At 1440, `.bits__label` has `scrollWidth ≤ clientWidth`.
- **25.** At 375, each lesson's fourth tab, and the page, never scroll sideways.
- **28.** The track page shows the three spots at stops 3, 4 and 11, with §6's labels.
- **§4.2 sizes, at 1440 × 900:**
  - MAC's figure box is at least 316 tall at every step;
  - TCP/UDP's is at least 346;
  - no panel scrolls.
- **JavaScript off:** as H10 rules.
- **`NO_SEQUENCE`:** gains `ip-address` and `mac-address`.
- **At 375:** MAC's callouts do not overlap, in light and dark.

## Notes

- After each update, MAC's table marks the last updated row `data-highlight="updated"`. That is the table panel as built (§1), not drift from the prototype.
- `call` is now both a plate kind (new) and `udp:call`'s site.
- Slot N holds two plates (`nat:stranger` and `tcp-udp:voice`) and slot E many. No rule refuses two layers on one slot.
- The voice callout would overlap the resolver's if the resolver were shown, worked out from `TEXT_W`:
  - voice line 1: x 102.5 to 290, y −34 to −18;
  - "DNS resolver": x 83 to 190, y −42 to −26.
  TCP/UDP hides the resolver. A later scene using this layer must hide it too.
- The dhcp driver ignores a tag it does not draw without a word. MAC's lesson test should copy DHCP's "every message rides a tag the figure draws" (`lessons/dhcp.test.ts:44`).
- Chromium keeps the table role under B's `display: block`. WebKit has dropped table semantics in that case before; this was not testable here.
- The measurements on Subnetting used the main folder's `dist/` of 2026-11-14.
