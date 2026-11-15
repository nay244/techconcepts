# D13b / B15b: the spec review's holes and attack cases (job 14, 2026-11-15)

The reviewer's report (Opus) on `prototypes/d13-switch.md`, its prototype and its two `.svg` files, for B15b (the `switch` figure). Holes are named H1, H2…; the orchestrator numbers the errata.

**Verdict: HOLES.** Check 14 cannot pass with the patch as written (H1), and a builder would have to guess where five guards go (H2, H3, H4, H7, H9), and check 14 names a model test that does not exist (H11). H6 needs the designer.

## Errata (the orchestrator, Opus 5.5, 2026-11-15)

B15b applies Switch's Appendix A after Packets', keeping both spot functions and both entries in `SPOTS` and `DRAW`. Each hole below is an erratum, numbered by the orchestrator; the builder takes the hole's own answer unless a line here rules otherwise. Case lists below are unchanged.

- **E14** = H1: the answer as written under H1.
- **E15** = H2: the answer as written under H2.
- **E16** = H3: the answer as written under H3.
- **E17** = H4: the answer as written under H4.
- **E18** = H5: the answer as written under H5.
- **E19** = H6: option (b): the description drops "Port 5 is free."; the rest of `SWITCH_DESCRIPTION` stays as approved (it is then true at every step). No new words.
- **E20** = H7: the answer as written under H7.
- **E21** = H8: the answer as written under H8.
- **E22** = H9: the answer as written under H9.
- **E23** = H10: as written: no change to the sheet; the test binding the figure's words to the lesson (as E26 for Load Balancers).
- **E24** = H11: the answer as written under H11.

## What was measured

The branch `job14/batch` is at `94c96b8` ("Merge branch 'revamp' into job14/batch"); it differs from the spec's `9807155` only outside `src/`, and both Appendix A's apply to it alone (`git apply --check`). The work was done on a `git archive` of `94c96b8` in a scratch folder, `node_modules` linked; nothing was applied in the worktree.

- **Order Packets, then Switch.** `d13-packets.md` Appendix A applies cleanly. Switch's then fails `git apply --check` on one file, `src/art/figures/spots.ts:357`. `git apply --3way` applies the other 20 files cleanly and leaves one conflict in `spots.ts`: both patches add a spot function after `tcpUdpSpot()` and both extend `SPOTS` and `DRAW`.
  **Resolution (one right answer):** keep both functions, `packetsSpot()` then `switchSpot()`; `SPOTS` ends `'tcp-udp', 'packets', 'switch'`; `DRAW` ends `packets: packetsSpot, switch: switchSpot`. Nothing else conflicts.
- **The files.** With the conflict resolved so, `spot('switch') + '\n'` equals `prototypes/d13-switch-spot.svg` byte for byte (83,333 bytes), and `drawSwitch().svg` with the root's `xmlns` and a newline equals `prototypes/d13-switch-part-figure.svg` byte for byte. `spot:switch` hashes to `36be892c…3fdf`. The figure's viewBox is `-85 4 703 316`; its 49 ids are unique and every one starts `sw-`. The spot has one `data-lit` and one `lm-led on` (of five).
- **Tests.** `npx vitest run` on Packets + Switch: 145 files, 2,059 tests, **4 failed, all Packets'** (B15a's pinned tests): `figures.test.ts` "the figures match the mockups" (Packets' patch adds `spot:packets` but no hash), `net-map.test.ts` "drawNetMap matches the mockup map", `batch2.sweep.test.ts` TCP/UDP's sweep, `lessons/tcp-udp.test.ts` "show draws every moment". Every Switch test passes, and every existing lesson validates.
- **The driver.** esbuild, minified, `motion.ts` external: 5,431 bytes, 2,446 gzipped (dhcp: 5,234 and 2,475). The figure's SVG is 142,461 bytes, 28,317 gzipped, on the Switch page only.
- **Probes** (jsdom, the patch's driver on `switch-fixture.ts`, not kept): the show sweep (`src/test/show-sweep.ts`) passes; for all 11 events, `show(before)` + `play(event, before)` under reduced motion gives the same `outerHTML` as a fresh `show(after)`, once `style="opacity:0"` and `style="opacity: 0;"` are read as one; the Overview's and step 1's starting `show` equal the drawn SVG; the rest are under the holes.
- **Build.** `npm run build` on Packets + Switch passes: `astro check` 0 errors (368 files), 37 pages in budget, every lesson page's JavaScript **105.5 KB** gzipped (budget 200). The built console chunk (`_astro/LessonConsole.*.js`) holds the switch driver ("The Switch figure has no") and none of the drawing's code or words ("HOME NETWORK", "ONE SWITCH"); `switch.css` is in the lesson stylesheet.
- **The claim sheet.** `claimSheet(switchFixture())` lists each event as an item, and the item's content carries its cues: `s1-frame` has `cues: [{ cue: 'flood' }]`, `s5-frame` has `cues: [{ cue: 'plug', arg: 'laptop 5' }]`. So a cue the author puts on a frame is on the sheet, and changing it stales the report. What the figure draws from those cues (COPY tags, the verdicts, the `PORT 5` chip) is not on the sheet: the figure is outside the sheet by design (`sheet.ts:15-16`), and those words are the design's copy, read in L26-w (H10).
- **Load Balancers after Switch** (for B15c's review, not this unit): `d13-load-balancers.md` Appendix A then fails `--check` in 11 files; `--3way` leaves 10 conflicts, every one a shared list (`spots.ts`, `index.ts`, `index.test.ts`, `parts.ts`, `parts.test.ts`, `types.ts`, `schema.ts`, `test-fixtures.ts`, `lib/figures.ts`, `drivers/index.ts`). Each resolves the same way: keep both entries.

## Holes

Worst first. "One right answer" means measured, with the answer given; "needs taste" goes to the designer.

**H1. One right answer. A pause, Next or step change during step 5's re-plug leaves the laptop with no cable, so check 14 fails.**

`play` fades the cable and plug at port 2 with an inline `style.opacity`, and removes it only when the crossfade ends without an abort (`drivers/switch.ts`, `for (const el of [...from, ...to]) el.style.removeProperty('opacity')` comes after `if (o.signal.aborted) return`). `animate` ends an aborted tween on `frame(1)`, which sets port 2's cable and plug to opacity 0. `show` then removes `display` and `data-ghost`, but not the inline opacity.

Measured (jsdom, fake timers, aborted 500 ms into the 1,200 ms crossfade):

- `show(step 5, before its frame)`: `sw-cable-laptop-2` and `sw-plug-laptop-2` are shown with `style="opacity: 0;"`, and port 5's are hidden. The laptop has no cable at all.
- Going back to step 4 gives the same, and its `outerHTML` differs from a fresh driver's `show(step 4)`.
- Opening step 5's end leaves port 5's cable at `opacity: 1` inline (harmless, but left behind).

**Answer:** `paintPlugs`, which every `show` calls, also removes the inline `opacity` from all four laptop parts (`sw-cable-laptop-2`, `sw-plug-laptop-2`, `sw-cable-laptop-5`, `sw-plug-laptop-5`), as it removes `data-ghost`. Case 14b is its test.

**H2. One right answer. A note in a switch unit makes `play` and `show` disagree.**

`SceneView.landed` is the latest message *or note* of the step (`driver.ts:41`). The driver paints a frame only when `landed` is a message, and paints a learned row only when `landed === null` (in `play`).

- A note after step 3's frame: the validator passes it (`[]`, measured), and step 3 settled shows no trace and no verdict, while a play leaves the frame drawn.
- A note before step 2's `add`: `play(add)` paints nothing (landed is the note), and `show` paints port 2.

The spec's own rule ("`flood` and `plug` go on a message, not a note") implies notes are allowed, but nothing in §3 says what a note draws. No step of §3.3 has one.

**Answer:** the validator refuses a note on the switch figure: `<where> is a note; the switch figure draws frames only, so say it in the step's words.` The spec's flood-and-plug rule stays as written, so a note with `plug` gives two issues. The alternative, the driver painting the step's last message, needs it in `SceneView` (an engine change), so it is not taken.

**H3. One right answer. A dropped frame draws as delivered.**

`outcome: 'dropped'` with `dropAt` passes the validator on the switch figure (`[]`, measured). The driver never reads `outcome`: step 3's frame, marked dropped, still shows the laptop "Keeps it". §9 says the figure has no drop case.

**Answer:** the validator refuses `outcome: 'dropped'` on the switch figure: `<where> is dropped, but the switch figure draws no drop; say it in words.` The existing `dropAt` rules stay as they are.

**H4. One right answer. The driver reads the MAC table by fixed names, and nothing checks that the table agrees with the figure.**

The driver hard-codes table id `mac-table`, the key column `mac` and the port column `port`, and reads the port with `Number()`. The validator checks none of it. Measured on step 2 settled, all passing the validator:

- table id `macs`: no light and no trace (the figure silently loses decision 8);
- port cell `"Port 2"`: no light and no trace;
- the laptop's MAC added on port `"3"`: port 3 lights and **the TV's cable** is traced, a false picture.

The same holds for `flood`, which only the author asserts (decision 2): a `flood` frame whose step's match finds its row, or a frame without `flood` whose step's match has `key: ''`, passes.

**Answer** (as D12's E2): a fixture test now, and Switch's lesson test in L26-b, assert:

- the panel's table is `mac-table`, keyed `mac`, with columns exactly `port` and `mac`;
- every `add` and `update` row's MAC is one of `SWITCH_DEVICES`, and its port is a digit 1 to 5 equal to that device's port after the `plug` cues so far;
- a non-broadcast message has `flood` exactly when its step's `mac-table` match has `key: ''`;
- without `flood`, that match's key is the receiver's MAC.

**H5. One right answer. Check 5's file half has no test.**

The patch pins only the hash of `spot('switch')`. Nothing reads `prototypes/d13-switch-spot.svg`, unlike D11's and D12's spots (`figures.test.ts:126-160`).

**Answer:** add `'switch'` to a `test.each` like D12's:

- the file is `spot('switch') + '\n'`;
- one `data-lit` and one `lm-led on`;
- the aria-label is §6's;
- the plate reads `FIVE PORTS · MAC TABLE`;
- the viewBox is `36 44 528 372`.

All of these hold (measured).

**H6. Needs taste (designer). The figure's description is false from step 5 on.**

The aria-label (§7, `SWITCH_DESCRIPTION`) says "Port 5 is free." From step 5's frame on, and at Learn and Practice, the picture has the laptop on port 5 and port 2 free. A screen reader user hears the opposite of what is drawn.

The options:

- **(a)** The driver sets a second description while the laptop is on 5, as dhcp's driver swaps its label for the frames setup.
- **(b)** The description drops "Port 5 is free."
- **(c)** Keep it as approved.

(a) and (b) need words from the designer.

**H7. One right answer. A second `plug laptop 5` passes, and the figure acts out a move that did not happen.**

A second message with `plug laptop 5` passes the validator (`[]`, measured). Its play crossfades the laptop's cable at port 5 with itself: it fades out to a ghost and back over 1.2 s, and takes 4,150 ms.

**Answer:** the validator refuses a `plug` that names the port the laptop is already on: `<where>: cue "plug" moves the laptop to port 5, where it already is.` With one arg allowed, this means at most one `plug` in a unit.

**H8. One right answer. B15b has no lesson page, so checks 15, 16 and the page half of 17 cannot run in it.** Split as D12's E10:

- **B15b** (unit tests on `switch-fixture.ts`): checks 1 to 14, check 17 by `npm run build`, H1 to H5, H7, H9 and H11. It needs no E2E port.
- **B16:**
  - `e2e/switch.spec.ts`: check 15 at 1440 × 900 and 375 × 812, light and dark; check 16; JavaScript off (case 30); the Table tab at 375 (case 31);
  - `NO_SEQUENCE` gains `switch`.

**H9. One right answer. The driver draws its own tags and ignores the message's `tag`.**

The driver picks FRAME or TO ALL by `kind`, and COPY or TO ALL for the copies. The `tag` the author writes is on the claim sheet, but never drawn. Step 3 with `tag: 'COPY'` passes the validator, and the figure still draws FRAME (measured).

**Answer:** the fixture test now, and Switch's lesson test, assert that every message's `tag` is `TO ALL` when its kind is `broadcast`, and `FRAME` otherwise. This follows D12's note on MAC Address ("every message rides a tag the figure draws").

**H10. One right answer: no change to the sheet; a test instead. What the figure says from the cues is not on the claim sheet.**

The sheet carries `flood`, `plug laptop 5`, `kind` and `to` for every frame (measured), and those decide every verdict, copy and chip. The words they produce are §7's design copy, read in L26-w: "Keeps it", "Ignores it", nothing, COPY and `PORT 5`.

**Answer:** leave the sheet as it is (`sheet.ts:15-16`). Switch's lesson test pins each step's settled verdicts against the step's "Kept by" fact and §3.3's verdict column (case 32). Then an author who changes `to` or `flood` without changing the words fails a test, not only a reader.

**H11. One right answer. Check 14 points at a test that has no abort.**

Check 14 says "as `dhcp.frames.test.ts` does", but that file has no abort test (grep: none). The models are:

- `drivers/dhcp.test.ts:237`, "an aborted play stops touching the figure, and show then settles it";
- `lesson/ScenePanel.test.tsx:81`, show on every change, abort on a move.

**Answer:** check 14 is cases 14a to 14c, written on those two.

## What the build can break

- **Shared lists**:
  - The lists that name every figure, each gaining `switch`:
    - `types.ts:2`
    - `schema.ts:37`
    - `scenes/index.ts`
    - `drivers/index.ts`
    - `parts.ts`
    - `test-fixtures.ts` (`FIXTURE_PARTS`)
    - `parts.test.ts:7`
    - `index.test.ts:10`
  - The spot lists:
    - `spots.ts` `SPOTS` and `DRAW`
    - `lib/figures.ts`
    - `figures.test.ts` `EXPECTED`
  - The compiler checks every `Record<FigureId, …>`. `astro check` reports 0 errors with the patch (measured).
  - `src/test/figure-hash.ts` has no list; it needs no change.
- **Existing figures.**
  - Every scene hash is unchanged, and so are the 14 existing spot hashes (with Packets', 15).
  - `index.test.ts` draws all six figures, with no grain.
- **Validator.**
  - The three new rules, and H2, H3 and H7's, sit under `figure === 'switch'`.
  - Every lesson of the site still validates (measured: the full suite is green on Switch's side).
- **Budget.**
  - 105.5 KB per lesson page.
  - Batch 3's other new driver (`pool`, B15c) also ships in every lesson page.

## Attack cases

Each is a test a builder can write. "Fails when" names the wrong build it catches. The fixture is `switch-fixture.ts` unless a case says otherwise. Times are at 1×, under fake timers (`vi.useFakeTimers` with `requestAnimationFrame` and `performance`, advanced with `advanceTimersByTimeAsync`). The values below were measured on the patch.

### The figure and its files (checks 1 to 4), in `index.test.ts` and `art/scenes/switch.test.ts`

- **1.** `drawFigure('switch')`'s root:
  - has `data-figure="switch"`, `role="img"`, and an aria-label equal to §7's description, word for word;
  - has no `lm-grain`;
  - has viewBox `-85 4 703 316`.
  - `figureIdSchema.options` and `FIGURE_PARTS`'s keys are the six ids, sorted.
  - Fails when `switch` is in `FigureId` but missing from the schema or `FIGURE_PARTS`.
- **2.** Every id the driver reaches for is in the drawing exactly once, and every id in the drawing starts `sw-` (49 ids, measured).
  - `sw-cable-laptop-5` and `sw-plug-laptop-5` carry `display="none"`; `sw-cable-laptop-2` and `sw-plug-laptop-2` carry no `display`.
  - The five port lights and the five status lights (`sw-led-laptop`, `-tv`, `-printer`, `sw-rt-led-1`, `-2`) have class `lm-led` without `on`.
  - The switch's and the router's power lights, which have no id, are `lm-led on`.
  - No `sw-glow` appears.
  - `#sw-port-<device>` reads `PORT 1` to `PORT 4`, in the router, laptop, TV, printer order.
  - Each `#sw-tag-*` shows its word (FRAME, TO ALL, COPY ×3, TO ALL ×3) and starts at `opacity:0`.
- **2, the throw.** Take one id out of the SVG string, for each id of check 2, and `switchDriver.create` throws a message naming it. Measured: "The Switch figure has no #sw-led-3." Fails when a part is looked up lazily, or with `?.`.
- **3.** `prototypes/d13-switch-part-figure.svg` is `drawSwitch().svg` with `xmlns` and a newline, whole. Fails when one coordinate or class changes.
- **4.** `data.cables` has exactly the keys `laptop:2`, `laptop:5`, `printer:4`, `router:1` and `tv:3`.
  - Each has more than three finite points.
  - Each runs from the device (first point) to the port (last point): the last point of `laptop:2` and of `laptop:5` differ, and `laptop:2`'s and `printer:4`'s first points differ.
  - Fails when a cable is keyed backwards (`2:laptop`), or its points are reversed (the tags would ride from the switch to the sender).

### The card (check 5), in `figures.test.ts`

- **5.** `spot:switch` is `36be892c80e718a900d2b7a5ce39990fb433a798e7827e1b24aeb441f54a3fdf`.
  - With H5's test: the file equals `spot('switch') + '\n'`; one `data-lit`; one `lm-led on`; the aria-label is §6's; it contains `FIVE PORTS · MAC TABLE`; the viewBox is `36 44 528 372`.
  - The 14 earlier spot hashes, and Packets' once B15a pins it, are unchanged.
- **5b.** `lessonFigure` for slug `switch` (a constructed summary) returns `spot('switch')`.

### Validator (check 6 and H2, H3, H7), in `define.switch.test.ts` with the real `FIGURE_PARTS`

Each mutation of the fixture gives **exactly** the issues listed, compared with `toEqual`, not `toContain`. Every count below was measured on the patch, except the three new rules', which come from H2, H3 and H7.

- **6a. These pass (`[]`):**
  - the fixture;
  - `flood` together with `plug laptop 5` on step 5's frame (it moves, then floods);
  - a frame from the TV to the printer;
  - a broadcast from the laptop to `all`.
  - Every lesson in `src/content/lessons/` still validates.
- **6b. Refused, one issue each:**
  - a frame `from: 'all'`: "rides from "all" to "laptop", a way the switch figure does not have";
  - a frame to its own sender;
  - `to: 'phone'`;
  - step 4's broadcast `to: 'tv'`: "is a broadcast, so it is sent to "all"";
  - step 1's frame `to: 'all'` with no cues: "is sent to "all", so its kind is "broadcast"";
  - step 4's frame with `kind: 'control'`: the same issue;
  - step 1's frame `to: 'all'`, keeping its `flood`: the same issue, once;
  - a broadcast with `flood`: "floods by itself";
  - `flood` with any arg;
  - `plug` with no arg;
  - `plug` with `laptop 2`, `tv 5` or `laptop  5` (two spaces): "takes "laptop 5", not …";
  - a scene `start` with any cue;
  - a layer named in `scene.layers`.
- **6c. Notes:**
  - A note with `flood` gives exactly the spec's issue, and a note with `plug laptop 5` gives exactly its issue. With H2's rule each also gives H2's issue.
  - A note with `plug tv 5` gives the arg issue and the note issue.
  - **H2:** a note after step 3's frame, with no cues, is refused. Fails when the build leaves notes allowed: step 3 settled then shows no trace and no verdict (measured).
- **6d. H3:** step 3's frame with `outcome: 'dropped', dropAt: 0.5` gives one issue. Fails without the rule: the laptop shows "Keeps it" for a frame that never arrived (measured).
- **6e. H7:** a second message in step 5 with `plug laptop 5` gives one issue. Fails without the rule: the cable fades out and back.
- **6f. Untouched elsewhere.** Seven checked lessons send a broadcast to one place, never to `all`: `dhcp`, `what-is-dhcp`, `arp`, `ip-address`, `mac-address`, `subnetting` and `what-is-ip` (`dhcp.ts:264`, laptop to router, for one). Each still gives `checkStructure(...) === []`. Fails when a rule is written without `figure === 'switch'`: the broadcast rule alone would break all seven (D12's E3 broke 8 lessons the same way).

### Driver: each step settled (checks 7 to 10), in `drivers/switch.test.ts`

For each step, `show(view at the step's end)` on a fresh driver; then the same on **one** driver shown steps 5, 4, 3, 2, 1 in that order (backwards). Read:

- `.sw-trace[data-on]`: each with `data-on="trace"` and a non-empty `points`;
- the lit `#sw-led-1…5`;
- `data-v` and `.sw-v-t` text of the four verdicts;
- the status lights;
- the laptop's cable, plug and chip.

- **7. Step 1.**
  - Traces: laptop-2, router-1, tv-3, printer-4. Lights: 1, 2, 3, 4.
  - Verdicts: router `ignores` "Ignores it", laptop `sent` "Sent it", TV `ignores`, printer `keeps` "Keeps it".
  - Only `sw-led-printer` is on.
  - Fails when the flood copies back to the sender (a verdict on the laptop other than `sent`), or out of port 5 (light 5 or trace laptop-5).
- **8. Step 2.**
  - Trace laptop-2 only; light 2 only.
  - No `data-v` anywhere, and every `.sw-v-t` is empty.
  - Fails when step 1's frame is still drawn: `landed` carried across steps.
- **9. Step 3.**
  - Traces printer-4 and laptop-2; lights 2 and 4.
  - Printer `sent`, laptop `keeps`.
  - The router and the TV have **no** `data-v` and empty text, not "Ignores it".
  - `sw-led-tv` and both router lights are off.
  - Fails when a forward is drawn as a flood, or "no copy" is drawn as `ignores`.
- **10. Step 4.**
  - Four traces; lights 1 to 4.
  - Router `sent`; laptop, TV and printer `keeps`.
  - `sw-led-laptop`, `sw-led-tv` and `sw-led-printer` on; `sw-rt-led-1` and `-2` off.
  - Fails when the sender's lights follow `keeps`.
- **10. Step 5.**
  - `sw-cable-laptop-5` and `sw-plug-laptop-5` have no `display`; the port-2 pair have `display="none"`.
  - None of the four has `data-ghost` or an inline `opacity`.
  - The chip reads `PORT 5` with class `moved`; every other chip lacks `moved`.
  - Traces laptop-5 and router-1; lights 1 and 5.
  - Router `keeps` (both `sw-rt-led-1` and `-2` on), laptop `sent`.
  - TV and printer have no `data-v`.
- **10b. Back from step 5 to step 4.** Port 2's pair are shown and port 5's hidden, and the chip reads `PORT 2` **without** `moved`. Fails when only the text is reset.
- **10c. Learn and Practice** (every step started): the same plugs as step 5's end (chip `PORT 5`). No trace and no light, since `landed` is null outside a step.

### Driver: play against show (check 11, H1), in `drivers/switch.test.ts`

- **11a.** For all 11 events (steps 1 to 5, every event), under reduced motion: `show(before)`, then `await play(event, before)`. The figure's `outerHTML` equals a fresh driver's `show(after)` once `style="opacity: 0;"` and `style="opacity:0"` are read as one and `style=""` is dropped. Measured: equal for all 11.
  - Fails when `play` leaves a tag shown, a trace at `ride`, or `data-ghost`.
  - The patch's own test compares only traces, lights, port 5's `display` and the chip text.
- **11b.** The same at full motion, with fake timers run to the end.
- **11c. The show sweep.** `showSweep(switchFixture())` passes. Measured: it passes on the patch.
- **11d. Hydration.** `show(Overview)` and `show(step 1, before its first event)` equal the drawn SVG, normalised as in 11a. Measured: equal. So the page with JavaScript off, and before the island loads, shows the Overview's picture exactly.

### Driver: in flight (checks 12 and 14, and §3.2), in `drivers/switch.test.ts`, fake timers, full motion

Measured on the patch:

- **Step 1.**
  - At 10 ms: only `sw-tag-frame` at opacity 1; the laptop `sent`.
  - At 450 ms: `sw-trace-laptop-2` is `ride`, with no light yet.
  - At 1,100 ms (look-up): no tag at opacity 1; laptop-2 is `trace`; light 2.
  - At 1,850 ms: `copy-1`, `copy-2` and `copy-3` at opacity 1, and `frame` at 0. Traces router-1, tv-3 and printer-4 are `ride`; lights 1 to 4. `sw-trace-laptop-5` has no `data-on`. No verdict but `sent`.
  - At 2,400 ms: the verdicts are set.
  - At 2,950 ms: the play has resolved, with no tag shown.
  - Fails when a fourth copy rides, or a copy rides the sender's cable.
- **Step 3**, at 1,850 ms: only `frame` shown. Laptop-2 is `ride`; `sw-trace-router-1` and `sw-trace-tv-3` have no `data-on`; lights 2 and 4.
- **Step 4**, at 1,850 ms:
  - `to-all-1…3` shown, and `to-all` and every `copy-*` hidden;
  - traces laptop-2, tv-3 and printer-4 are `ride`.
  - Fails when a broadcast's copies are COPY.
- **Step 5.**
  - At 600 ms: port 2's cable has `data-ghost`, port 5's is shown, and the chip still reads `PORT 2`.
  - At 1,250 ms: port 2's pair `display="none"`; chip `PORT 5` `moved`; light 5; laptop-5 is `ride`.
  - At 3,600 ms: router `keeps`.
  - It resolves by 4,150 ms.
- **12. Durations.**
  - `duration` gives 2,950 for every message without `plug` (steps 1, 3, 4) and 4,150 for step 5's frame.
  - It gives 900 for each `mac-table` event, and 0 for a table event naming another table.
  - At speed 2, a full-motion play resolves by 1,475 ms.
  - Fails when `flood` adds time, or a `match` is 0.
- **12, reduced motion.**
  - Step 1: no tag shown until 500 ms. At 501 ms the three copies are at their devices and every verdict is set. It resolves at 951 ms and not by 949 ms: the waits stay, the tweens jump.
  - Step 5: at 1 ms, port 5's pair are shown, the chip reads `PORT 5`, and nothing has `data-ghost`.
- **14a. Stopped mid-play.**
  - At each of 450, 1,100, 1,850 and 2,400 ms of steps 1, 3 and 4: abort the signal, then `show(view before the event)`. The `outerHTML` (normalised) equals a fresh `show(before)`.
  - Then `show(after)` equals a fresh `show(after)`.
  - Fails when a tag, a `ride` trace or a verdict survives.
- **14b. H1.** At 500 ms of step 5's re-plug:
  - abort, then `show(before)`: port 2's pair are shown with no inline `opacity`, and port 5's are hidden;
  - then `show(step 4)`, and `show(step 5's end)`: each equals a fresh driver's.
  - Fails on the patch as written (measured: `style="opacity: 0;"` on port 2's cable and plug).
- **14c.** The same through the panel, as `ScenePanel.test.tsx:81` does (H11): render the console on the fixture at step 5 playing, advance 500 ms, press Pause. Port 2's cable is visible: no `opacity: 0`.

### The table and the figure agree (H4, H9, H10): a fixture test now, and Switch's lesson test in L26-b

- **H4a. The table's shape.** The panel is a `table` panel:
  - id `mac-table`, `keyColumn: 'mac'`;
  - columns exactly `[{ key: 'port', label: 'Port' }, { key: 'mac', label: 'MAC address' }]`, with widths ignored;
  - `initialRows: []`, and `by` "kept by the switch".
  - Every table event names `mac-table`.
  - Fails on the patch's figure when the id is `macs`: step 2 then draws nothing (measured).
- **H4b. Rows agree with the cables.**
  - For every `add` and `update`, the row's MAC (its `row.mac`, or the `update`'s key) is one of the four in `SWITCH_DEVICES`.
  - Its `port` matches `/^[1-5]$/` and equals that device's port after the step's `plug` cues so far.
  - Fails with the laptop's MAC on port `"3"`: the figure traces the TV's cable (measured).
- **H4c. Flood agrees with the look-up.**
  - For each message that is not a broadcast: if it has `flood`, its step has a `mac-table` match with `key: ''`; if not, the step's match key is the receiver's MAC.
  - Fails when step 1 loses `flood` but keeps its no-match row.
- **H9. Tags.** Every message's `tag` is `TO ALL` when `kind === 'broadcast'`, and `FRAME` otherwise. Fails with `tag: 'COPY'` on step 3 (it passes the validator, measured).
- **H10 / case 32. The verdicts the narrative states.** In the lesson's own test, run the show sweep on the lesson, then pin each step's settled verdicts (router, laptop, TV, printer) to §3.3: I S I K; none; – K – S; S K K K; K S – –.
  - The device each step's "Kept by" or "Sent out of" fact names is the one the figure marks `keeps`.
  - Fails when the author changes a frame's `to` without its words.

### Panel and log, in `TablePanel.test.tsx` and `LogPanel.test.tsx` with the fixture

- **Step 1 settled.**
  - The body has the empty row "Empty: the switch hasn’t learned any address yet", then the no-match row: "no match", then the match's `summary`.
  - The caption is "MAC table kept by the switch"; the headers are Port and MAC address.
- **Step 2:** one row, 2 · 00:00:5E:00:53:10, `data-highlight="added"`. No no-match row: an earlier step's mark does not carry over.
- **Step 3:** rows in the order learned, 2 · …:10 then 4 · …:13; …:10 has `data-highlight="matched"`.
- **Step 5:**
  - rows in order 5 · …:10, 4 · …:13, 1 · …:01;
  - …:10's port cell reads `5`, in place, not appended;
  - …:01 is `matched`.
  - Fails when `update` appends a row.
- **The log.**
  - 4 rows, one per frame; no row for a copy.
  - Each row's time and size are "—" and its protocol is Ethernet.
  - Step 4's destination is ff:ff:ff:ff:ff:ff.
  - Glyphs: request, response, broadcast, request.
  - The legend deep-equals "Frame for one device", "Frame for everyone", "The reply", in that order.

### The claim sheet, in a fixture test beside `define.switch.test.ts`

- **Cues on the sheet.** `claimSheet(switchFixture(), SOURCES)`:
  - the item for `s1-frame` has `content.cues` equal to `[{ cue: 'flood' }]`;
  - the item for `s5-frame` has `[{ cue: 'plug', arg: 'laptop 5' }]`.
- **Cue changes stale the sheet.** Each of these changes the sheet's hash: removing `flood`; adding `flood` to `s3-frame`; moving `plug` to another message.
  - Fails if a later change puts `cues` in `DISPLAY_ONLY`.

### Contrast (check 13), in `green-text.test.ts`

- **13.** The rule for `.sw .sw-v[data-v="keeps"] .sw-v-t` is in the list. It reaches 4.5:1 on the figure background in light and in dark (measured: green on the patch).
  - Fails when the words take `--allowed`, the mark's fill, instead of `--allowed-text`.
  - "Sent it" (`--ink`) and "Ignores it" (`--muted`) use the site's text tokens, as MAC Address's do (`dhcp.css`).

### Budget (check 17), in B15b's `npm run build`

- **17.** `check-budgets.mjs` passes, and every lesson page's JavaScript is at most 106 KB gzipped (105.5 measured with Packets + Switch; B15c adds `pool`).
- **17b. The drawing stays out of the page.**
  - `drivers/switch.ts` imports from `art/scenes/switch` with `import type` only, and imports nothing from `common.ts`. A test reads the source and checks this.
  - The built console chunk contains "The Switch figure has no" and none of "HOME NETWORK", "ONE SWITCH" or "tubePieces".
  - Fails when the driver imports `SWITCH_DESCRIPTION` or a helper from the drawing module.

### On the page (checks 15 and 16, JavaScript off, 375 and 1440): B16's `e2e/switch.spec.ts` once the lesson exists (H8)

- **15a.** At 1440 × 900 and 375 × 812, light and dark, every step played and every step opened:
  - the page's `scrollWidth` equals the viewport;
  - the five callouts' text boxes (each `.sw-call`'s `text` boxes) overlap neither one another nor any device's box;
  - at 375, the Table tab's region has `scrollWidth ≤ clientWidth` at every step (spec: table 347 in 375).
- **15b.** Mid-play, polled during step 1's out phase:
  - three `.sw-tag` at opacity 1, none of them `sw-tag-frame`;
  - `#sw-trace-laptop-5` without `data-on`, and `#sw-led-5` never `.on`.
  - In step 3's out phase, `#sw-trace-router-1` and `#sw-trace-tv-3` without `data-on`.
  - At step 5's start, `#sw-cable-laptop-5` is shown before `#sw-tag-frame` shows.
- **15c.** The callout sizes of §4.2: at 375 the MAC text is at least 6.6px and the name at least 6.0px; at 1440 the drawing is 733 wide. The owner accepted 6.7px (direction 2.66).
- **16.** The Networking track page shows `spot('switch')`'s aria-label at stop 05, at the card's size, in both themes.
- **30. JavaScript off.**
  - The figure is visible with §7's aria-label.
  - No `.sw-v` is visible; the chips read PORT 1 to PORT 4; no `.sw-trace[data-on]`; `#sw-cable-laptop-5` is hidden.
  - The page says "This lesson needs JavaScript to play." (`lesson.spec.ts:410` covers this once `switch` is in `LESSONS`).
  - The figure is the Overview's picture, which case 11d pins, so nothing on it is false at the Overview. Unlike net-map (job 13, held for the owner), this figure needs no fallback: the driver sets nothing at the Overview.
- **31.** `NO_SEQUENCE` gains `switch`, and the Sequence switch is absent on the page.
- **Reduced motion** (`emulateMedia({ reducedMotion: 'reduce' })`): play to the end; the run time is within the sum of `duration` plus the console's margin, as `lesson.spec.ts:303` does for DHCP. Every step settles as in cases 7 to 10.

## Notes

- **The prototype runs the patch's own driver, so these are not drift**, though §3.2's words differ:
  - In step 5, port 5's light comes on when the re-plug ends, before the frame rides in, not "at the end" of the ride.
  - During a flood's 500 ms look-up no tag shows; the copies set off after it.
  - Under reduced motion a frame's play resolves at 950 ms (look-up 500 + rest 450); the console still waits `duration`.
- `scene.labels` passes the validator on the switch figure (`{ 'sw-port-tv': 'x' }` gives `[]`, measured), though the figure shows no labels. The same gap is in every figure without labels. It is outside this unit, but an author could put words on the sheet that no reader sees.
- A frame from the TV, which the story never sends, is allowed and drawn correctly. A flood after the re-plug was measured: copies out of 1, 3 and 4; port 2 (now empty) gets none, and the sender's port 5 gets none back.
- The figure's SVG is 28 KB gzipped on the Switch page; MAC Address's is about 15. The HTML budget is 250 KB, and TCP/UDP, the largest page, is at 132.6.
- Packets' Appendix A adds `spot:packets` to `SPOTS` without a hash in `figures.test.ts`. That, and three net-map pins, are B15a's four red tests on this branch.
