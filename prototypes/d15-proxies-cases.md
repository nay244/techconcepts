# D15a / B18a: the spec review's holes and attack cases (job 16, 2026-11-16)

The reviewer's report (Opus) on `prototypes/d15-proxies.md` (design branch `design/d15-proxies` at `c159f0b`), its prototype and its three `.svg` files, for B18a, the Proxies scene on the network map and its spot. Holes are named H1, H2…; the orchestrator numbers the errata.

**Verdict: HOLES.** As written, check 16 cannot pass against §3's own table (H1). §5.9 tells the builder to re-record the mockup hash, which throws away the strongest proof that the map is unchanged (H2). §2.6 and §3.1 describe a busy band that the patch and the prototype never light (H3). The validator rules leave a builder to guess in five places (H4 to H8). H3 goes to the designer only if the band is wanted.

## Errata (the orchestrator, Opus 5.5, 2026-11-16)

B18a applies Appendix A of `d15-proxies.md` to `job16/batch` first. Each hole is an erratum with the answer as written under it; the builder takes the answer.

- **E1** = H1 (check 16's ports). **E2** = H2 (extend the mockup test's strip; `EXPECTED` unchanged; §5.9's re-record is withdrawn). **E3** = H3 (build as written: no busy band lit at step 4's end; §2.6's last sentence and §3.1's "busy band lit" are withdrawn; no design change). **E4** = H4 (`partsAt`). **E5** = H5 (`conn` via validation). **E6** = H6 (`reverse` and `direct` paired). **E7** = H7 (hide wins). **E8** = H8 (`hide proxy` needs `proxies:proxy`). **E9** = H9 (`src/content/proxies-fixture.ts`; check 17 with the author; [browser] cases in `e2e/proxies.spec.ts` by B19). **E10** = H10 (snapshots from `86d0bf6` in a commit before the patch). **E11** = H11 (selectors). **E12** = H12 (the validator's words). **E13** = H13 (one issue, "takes no step start").

## What was measured

`job16/batch` is at `86d0bf6`, and its worktree is clean. The work was done on a `git archive` of it in a scratch folder, with `node_modules` linked. Nothing was applied in any worktree.

- **The patch.** Appendix A (505 lines, 8 files) passes `git apply --check` and applies cleanly.
- **The three files are byte for byte.**
  - `spot('proxies') + '\n'` equals `d15-proxies-spot.svg` (49,300 bytes).
  - Each part file is `<svg xmlns="http://www.w3.org/2000/svg" class="lm-svg nm" viewBox="-98 -60 685 378">`, then the layer's five `<g data-layer>` groups from `drawNetMap().svg` in order with ` display="none"` taken out, then `</svg>\n`. Built that way, they equal `d15-proxies-part-proxy.svg` (46,340 bytes) and `d15-proxies-part-site.svg` (44,157 bytes).
- **Check 1.** I took the 10 groups out with a balanced `<g>` scan. What is left equals today's SVG exactly: 870,295 characters (870,310 bytes), sha256 `4327eb6509888bc8fc1ff02b50407c4b75ad079f05385cded0a6cc00b5237165`. The viewBox is unchanged. The new groups are 90,462 characters (the spec says 90,466).
- **Check 2.**
  - Routes go from 314 to 374. None of the 314 changed, and each of the 60 new ones has `proxy`, `origin` or `reverse` at an end.
  - The new keys come after the old ones. Deleting them gives a `JSON.stringify` identical to today's (53,002 characters; patched 63,220, +10,218), sha256 `3f337f5faa941d632972e600c67bd6d65c550db9a2f7e2fabac29d7ceb94013c`.
  - `M`, `O`, `TZ`, `ring`, `tops` and `bays` are equal.
- **Check 3.** 20 lessons, 409 events: every `netMapDriver.duration` is identical.
- **Check 4.** 745 states (every position, event index −1 to n): `deriveState` gives identical JSON.
- **Beyond checks 1 to 4.**
  - Driver `show()` for each of the 20 lessons at 577 moments (every position, event index 0 to n): the figure's `outerHTML` is identical once the two `proxies:*` groups are removed.
  - `drawNetMap(layers)` (the still copy Home uses) is identical for each of the 17 layer sets in use.
- **The mockup hash.** `net-map.test.ts` "drawNetMap matches the mockup map" **passes with today's `EXPECTED` unchanged** once its strip is extended the way D11 and D12 did it (H2).
- **Tests.** `npx vitest run`: 158 files, 2,264 tests, **13 failed**, exactly the 13 that §5.9 names. The `NET_MAP_OPTIONAL` assertion sits in "D11's two layers…".
- **Build.** `npm run build` passes: `astro check` clean, 40 pages within budget, every lesson page's JS 109.4 KB gzipped, TCP/UDP's HTML 146.9 KB.
- **A fixture of §3** (jsdom, my own, not kept: What is HTTPS with §3's scene, starts, events and cues):
  - Durations: 2,070.5 / 1,973.6 / 1,929.7 / 1,158.8 / 1,955.8 / 1,046 / 672.8 ms, the §3 column to ±1.
  - At each step's end the map is as in §3.1, except the busy band (H3).
  - Step 2's first frame: proxy shown, no page, no lock, no line.
  - The tunnel is one `polyline.nm-conn` with 20 points. `laptop>proxy` ends, and `proxy>origin` starts, at `[-96,-88,8.6]`.
  - `laptop>reverse` has 17 points and ends at `[66,-71,8.6]`. The origin's end is `[90,-71,3.4]`. `reverse>origin` is 4 points, all on the plate.
  - The log has 14 rows. The description sentences match check 15, and the resolver's sentence never appears.
- **The callouts.** `direct` and the reverse proxy's own callout both stand at `x=396 y=234` (H6).
- **The forward proxy's part.** It has 3 text nodes (PROXY.EXAMPLE.NET, Forward proxy, 203.0.113.30) and no class containing `lock`.
- **The spot.** It has 1 `data-lit`, 1 `lm-beam`, 0 `lm-led`, and 3 `<text>` (the label and two "203.0.113.30").

### Where the byte-for-byte proof is weak

1. **Re-recording the mockup hash (§5.9) is the weak point** (H2). Once it is re-recorded, nothing in the suite ties the map to the mockup any more, and check 1 then rests on a fixture the builder writes.
2. **Snapshots taken after the patch prove nothing.** Checks 1 to 4 need today's values recorded before Appendix A. The existing `net-map.durations.json` is E13's list (416 keys, recorded before Packets, router fixture included), not the 409 events of today (H10).
3. **How the groups are taken out.** A lazy regex over nested `<g>`, or a jsdom round trip (which re-serializes every attribute), cannot give "character for character". Only a balanced scan, as `groupsOf` in `src/test/svg-groups.ts` does, can.
4. **The driver is not covered.** Checks 1 to 4 cover the drawing, the data, the durations and the engine. Nothing covers the driver's painted figure, and the patch changes `paint` (the shape of `conns`, the `data-hidden` loop now reaching 9 more elements, the aria text) and the `hide` guard. I measured it equal (above). A check should pin it: case 4g.
5. **Home's still copy** (`drawNetMap(only)`) is not in check 1. I measured it equal: case 1d.

## Holes

Worst first. "One right answer" means measured, with the answer given. "Needs taste" goes to the designer.

**H1. One right answer. Check 16 contradicts §3: the forward proxy's address has a port in three rows.**
§3 gives the proxy's address with a port in three rows: `s2` TCP and `s3` proxy → origin as source `203.0.113.30:41500`, and `s3` origin → proxy as destination `203.0.113.30:41500`. Check 16 says "the forward proxy's address has no port".
**Answer:** check 16 reads: "In every row between the laptop and the forward proxy (CONNECT, its 200 OK, and step 3's first and last rows), the proxy's address is `203.0.113.30` with no port. Between the proxy and the site it is `203.0.113.30:41500`."

**H2. One right answer. §5.9 says to re-record the mockup hash. Extend its strip instead.**
`drawNetMap matches the mockup map` already keeps its hash across D11 and D12 by taking their groups and routes out (`withoutD11`, `VOICE_OPEN`, `D12_SITES`).
**Answer:**
- Add `'<g data-layer="proxies:site" display="none">'` and `'<g data-layer="proxies:proxy" display="none">'` to the `groupsOf` chain.
- Add `proxy`, `origin` and `reverse` to the route filter.
- Leave `EXPECTED` as it is. Measured: it passes.

That one test is checks 1 and 2 against the mockup, so no 870 KB fixture is needed. Check 1 as a string test (case 1a) stays as a second guard, pinned to the sha256 above.

**H3. One right answer for the build. §2.6 and §3.1 say the reverse box's busy band is lit after step 4. Neither the patch nor the prototype lights it.**
- `play` ends every message with `clear()`, which turns off every busy band (`drivers/net-map.ts`, `clear`).
- `ScenePanel` calls `show()` (which also clears) before the note plays.
- Measured: after step 4, and while its note plays, no `[id*="-busy-"].on` exists. The band is on only during the request's 450 ms rest.

**Answer:** build the patch as written, and test that no busy band is lit at step 4's end (case 11c). §2.6's last sentence and §3.1's "the reverse box's busy band lit" are an erratum. If the band is wanted lit during the note, that is a design change (designer: a cue, new words in §2.6).

**H4. One right answer. Each visibility rule reads only the scene's start.**
Three existing rules read `scene.start` alone (`define.ts:277-286`, `:435`):
- the hide rule ("…which the scene's start hides");
- the phone rule;
- the laptop-column rule.

Because a step's start "follows a scene start's rules", `show phone` or `hide resolver` in a step start passes. Then:
- a message to the phone after a step-start `show phone` is wrongly refused;
- a message to the resolver after a step-start `hide resolver` is wrongly let through.

§5.5's new proxy rule ("as of the step's start and the steps before it") leaves out the scene's start.

**Answer:** one helper, `partsAt(unit, stepIndex)`. It returns the shown and hidden sets after the scene's start and the starts of steps 1 to k, in order, using the driver's set semantics (H7). Every visibility rule uses it: phone, resolver, proxy, reverse, and the laptop column.

**H5. One right answer. "Both routes `from>via` and `via>to` exist": the validator has no routes.**
`define.ts` imports `net-map-layers.ts`, not the drawing. `drawNetMap().data.routes` holds a pair only when both places are base places or both belong to one protocol (`routesOf`). Today no `conn` arg is validated at all: a bad one throws only in the driver.

**Answer:** for a `conn` with a via:
- each of `from`, `via` and `to` is in `NET_MAP_BASE_PLACES ∪ plateSites(layer)` for some single protocol among the scene's layers, both for the pair `from`/`via` and for the pair `via`/`to` (this mirrors `routesOf`);
- `via` is neither end;
- a part named in the arg (`proxy`, `reverse`) must be shown at that moment, under the same rule as messages (H4).

Two-place conns stay as they are (no existing lesson changes).

**H6. One right answer. `show reverse` without `hide direct` puts two callouts on one spot.**
Both are drawn at `x=396 y=234` (measured), and nothing pairs them.
**Answer:** the validator refuses:
- a start that shows `reverse` while `direct` is not hidden by then;
- a `hide direct` while `reverse` is not shown by the end of that start.

**H7. One right answer. After `hide proxy`, a later `show proxy` leaves the proxy hidden.**
The driver keeps two sets, and `data-hidden` is `hidden.has || (optional && !shown.has)`, so a hide always wins.
**Answer:** the validator uses the same sets: a part is shown only if it has been shown and never hidden. A message to `proxy` after hide-then-show is refused (case 18k).

**H8. One right answer. `hide proxy` needs a layer.**
§5.5 names a layer only for `show proxy`, `show reverse` and `hide direct`. The driver accepts `hide proxy` on any net-map page, because every layer is drawn.
**Answer:** `hide proxy` needs `proxies:proxy`.

**H9. One right answer. Which unit writes which test.**
The card (check 21) appears only for a ready lesson (`lessonFigure` takes an `AvailableSummary`). The page `/networking/proxies/` exists only once the author's lesson does. Check 17 says "after the lesson is written".
**Answer:**
- B18a writes `src/content/proxies-fixture.ts` from §3, in the form of `router-fixture.ts` (test-only), and turns checks 1 to 16, 18 and 19 into jsdom tests on it.
- Check 17 goes in `lessons/proxies.test.ts`, with the author's lesson.
- Every case marked **[browser]** goes in `e2e/proxies.spec.ts` (B19, plan decision 11).

**H10. One right answer. When and where the snapshots for checks 1 to 4 are taken.**
**Answer:** record them from `86d0bf6`, before the patch, in a commit of their own that comes before the patch commit, so the build reviewer can see the order in `git log`:
- for check 1, the sha256 of today's SVG (above), with no fixture file needed;
- for check 3, a new durations JSON of the 409 events, keyed `slug/unit/step/event`;
- for check 4, the 745 `deriveState` results (or their sha256).

The existing `net-map.durations.json` stays as it is.

**H11. One right answer. "A padlock path" and "a lit solid" have no selector.**
**Answer:**
- Map (check 10): inside `[data-base="proxy"]` there is no element whose class contains `lock` (the padlock is `nm-hold`/`nm-lock`/`nm-lock-arc`, `net-map.ts:106`).
- Spot (check 6): no `class="…lock…"`.
- Spot: "one lit solid" means exactly one `data-lit`. The `lm-beam` thread is not a solid.

**H12. One right answer. The validator's words now say "scene's start".**
`define.ts:176-177` reads `cue "hide" is for a scene's start`.
**Answer:** "is for a start (a scene's or a step's)". The failing pins in `define.router.test.ts` and `define.batch1.test.ts` take the new words.

**H13. One right answer. `step.start` on a figure that takes a scene start (dhcp).**
**Answer:** for any figure other than net-map, the validator gives exactly one issue, containing "takes no step start", whether or not `parts.start` is true. It does not also give the "takes none" message.

## Attack cases

Each case is a test a builder can write. "Fails when" names the wrong build it catches. The fixture is `proxies-fixture.ts` (H9). **[browser]** marks a case only a real browser can try, which becomes an end-to-end test using the job 15 helpers: `playButton` is `.cbtn--alt` "Play all"/"Pause", `nextButton` is `.cbtn--go`, `replayButton` is new, and `playToEnd` waits for "Play all".

### Drawing and data (checks 1, 2 and 5), in `net-map.test.ts` and `net-map-layers.test.ts`

- **1a.** Take the 10 `proxies:*` groups out of `drawNetMap().svg` with `groupsOf`. The rest has sha256 `4327eb65…7165` and is 870,295 characters long. Fails when one character of an existing layer moves, or when a part wrapper (`inPart`, `all`) wraps a layer that has no `part`.
- **1b.** The mockup test passes with `EXPECTED` unchanged (H2). Fails when the hash is re-recorded.
- **1c.**
  - The viewBox is `-98 -60 685 378`.
  - The ids `nm-proxies-busy-proxy`, `-reverse` and `-origin` each appear once, and no id appears twice.
  - `[data-base="proxy"][data-hidden]` matches 5 elements, `[data-base="reverse"][data-hidden]` matches 3, and `[data-base="direct"]` matches 1, with no `data-hidden`.
- **1d.** For every layer set an existing lesson uses, `drawNetMap(layers).svg` equals today's. Fails when `only` mode draws a part shown.
- **2a.** Today's 314 routes are deep-equal. The 60 new keys each name `proxy`, `origin` or `reverse`. With them deleted, `JSON.stringify(data)` has sha256 `3f337f5f…013c`.
- **2b.** The last point of `laptop>proxy` equals the first point of `proxy>origin`, at `[-96,-88,8.6]`.
  - The point before it in `laptop>proxy` lies on the in-leg (x equal to the box's in-port x).
  - The second point of `proxy>origin` lies on the out-leg (y equal to the out-port y).
  - Fails when `sideFor` picks the nearer cable wrongly, so the tunnel enters and leaves by one cable.
- **2c.** `reverse>origin` has 4 points, from `[66,-71,8.6]` to `[90,-71,3.4]`, and none equals router c's point. `origin>reverse` is the same list reversed. Fails when the `inner` way is missing and the ride runs out to router c and back.
- **5.** The three `.svg` files equal the recipe under "What was measured".

### The spot (check 6, H11), in `figures.test.ts` and `pool.test.ts`

- **6a.** `spot('proxies')`:
  - has one `data-lit`, no `lm-led on` and no class containing `lock`;
  - has the label "PASSES IT ON · OWN ADDRESS";
  - has exactly two `<text>` reading `203.0.113.30`;
  - has an aria-label equal to §6, word for word.
- **6b.** `SPOTS` ends `'load-balancers', 'proxies'`, `EXPECTED` gains the proxies hash, and `FIGURES.proxies` exists. `pool.test.ts` F6 stays green. Fails when `proxiesSpot` is placed after `loadBalancersSpot` (F6 then meets "proxy" in the comment).

### Engine (checks 3 and 4), in `net-map.durations.test.ts` and `timeline.test.ts`

- **3.** All 409 events give durations equal to the snapshot taken before the patch (H10).
- **4a.** All 745 states are deep-equal to the snapshot.
- **4b.** Step 4 at event index −1 and at 0:
  - `cues` ends with step 4's six start cues, each with `eventId: 'step:step-4'` and `current: true`;
  - the log is unchanged from step 3's end (9 rows).
  - Fails when a start applies only from event 1.
- **4c.** At step 3's end no cue of step 4's start is present. Fails when starts apply eagerly.
- **4d.** At step 4, step 4's `fresh` comes after step 2's `conn open laptop>proxy>origin` in `cues`. Fails when every start is hoisted ahead of every event, which leaves the tunnel lit in steps 4 and 5.
- **4e.** At Learn and Practice every start is applied with `current: false`. At the Overview none is applied.
- **4f.** A step's start adds no log row and no table change.
- **4g.** For every existing lesson, at every moment, driver `show()` gives the same `outerHTML` as the snapshot once the `proxies:*` groups are removed (577 moments, measured equal).

### Schema and validator (checks 18 and 19, H4 to H8, H12, H13), in `define.proxies.test.ts` with the real `FIGURE_PARTS`

- **18a.** `start` on a step of the switch figure is refused with "takes no step start". On dhcp (which takes a scene start) the same single issue is given (H13).
- **18b.** `status`, `status-known` or `status-done` in a step's start is refused. `url` in a step's start is accepted.
- **18c.** `drop`, `park` or `unpark` in a step's start is refused. `hide resolver` in a step's start is accepted.
- **18d.** A scene with `proxies:proxy` and no `hide resolver` in its start is refused. With it, the scene is accepted. A scene with only `proxies:site` and no `hide` is accepted.
- **18e.** `show proxy` without `proxies:proxy` is refused, and so is `hide proxy` without it (H8). `show reverse` and `hide direct` without `proxies:site` are refused.
- **18f.** A message `laptop → proxy` in step 1 (before `show proxy`) is refused.
  - In step 2, after its start shows the proxy, it is accepted.
  - From `proxy` in step 3 (shown at step 2, carried over) it is accepted. Fails when the rule reads only the step's own start.
  - In step 4, after `hide proxy`, it is refused.
- **18g.** A message to `reverse` in step 3 is refused. In step 5 (shown at step 4's start) it is accepted.
- **18h.** `conn open laptop>moon>origin` and `conn open laptop>laptop>origin` are refused. `conn open laptop>proxy>origin`, at a moment when the proxy is shown, is accepted. The same conn in step 1 is refused (H5).
- **18i.** `hide laptop` and `show resolver` are refused, and so are `show direct` and `hide reverse`. The messages list `"resolver", "proxy" or "direct"` and `"phone", "proxy" or "reverse"`.
- **18j.** A start with `show reverse` and no `hide direct` is refused, and `hide direct` with no `show reverse` is refused (H6).
- **18k.** A scene where step 2 shows the proxy, step 3 hides it and step 4 shows it again: a message to `proxy` in step 4 is refused (H7).
- **18l.** A message to `phone` in step 2, after a step-1 start with `show phone`, is accepted. A message to `resolver` after a step-start `hide resolver` is refused (H4).
- **18m.** `fresh` with an arg is refused ("is a flag").
- **18n.** The real Proxies fixture validates with `[]`.
- **19a.** `parseConn('open laptop>proxy>origin')` deep-equals `{ action: 'open', from: 'laptop', via: 'proxy', to: 'origin', data: false }`. `'via' in parseConn('open laptop>web')` is false.
- **19b.** `'seal laptop>proxy>origin data'` reads with `via` and `data: true`. `'open a>b>c>d'` throws the new message.
- **19c.** With `laptop>proxy>origin` open, `conn seal laptop>origin` throws "…seals laptop>origin, which is not open." Fails when the line's id drops the via.

### Driver, each step settled (checks 7 to 13 and 15), in `drivers/net-map.proxies.test.ts` with the fixture

- **7.** After step 1:
  - all of `[data-base="proxy"]` and `[data-base="reverse"]` carry `data-hidden`, and `direct` does not;
  - there is one `polyline.nm-conn.sealed`;
  - the page's text parts are at opacity 1, the lock is `.on`, and the table has the one row Straight.
- **8.** Step 2 at index 0:
  - the proxy's 5 groups have no `data-hidden`;
  - the page is at opacity 0 and the lock is not `.on`;
  - `#nm-conns` is empty;
  - the resolver is still hidden. Fails when `fresh` resets the whole state.
- **8b.** After `fresh`:
  - `url` and the status still read "techconcepts.app" and "Wants techconcepts.app";
  - trays and parks are untouched.
- **9.** After step 2 there is one `polyline.nm-conn`, not sealed. Its `points` equal `laptop>proxy`'s flat points followed by `proxy>origin`'s without its first point (20 points).
- **10.** At step 3 the line is one `polyline.nm-conn.sealed`, not two. The proxy's part has exactly 3 text nodes and no class containing `lock`.
- **11a.** After step 3 the page and lock are shown, and the rows are Straight, then Forward proxy.
- **11b.** Every message `from` or `to` `proxy` lights `#nm-proxies-busy-proxy` on landing.
- **11c.** At step 4's end no `[id*="-busy-"].on` exists (H3).
- **12.** Steps 4 and 5 at index 0 and at the end:
  - the proxy is hidden, the reverse proxy is shown and `direct` is hidden;
  - the visible callout texts include "Reverse proxy", "198.51.100.7 · port 443", "Web server" and "10.0.0.20 · port 80";
  - there is one sealed polyline, whose last point is `laptop>reverse`'s end;
  - no polyline ends at `origin`'s flat end point.
- **13.** After step 5 the page and lock are shown, and the rows are Straight, Forward proxy, Reverse proxy, in that order.
- **14 (jsdom).**
  - A fresh driver's `show` at each step's start and end equals one driver shown the steps in turn (the `show-sweep` helper).
  - Shown step 4 and then step 3, the driver gives the same `outerHTML` as a fresh `show(step 3)`.
  - Under reduced motion, `show(before)` plus `play(event)` equals `show(after)` for all 17 events.
- **15.** The aria-label contains the forward proxy's sentence at steps 2 and 3 only, and the reverse proxy's at steps 4 and 5 only. The resolver's sentence never appears. At the Overview the label is today's `ARIA` without the resolver's sentence.

### The log and timing (checks 16 and 17, H1)

- **16.** At Learn, `derived.log` has 14 rows: 13 messages and 1 note.
  - Every Time and Size is "—".
  - The note's protocol, source and destination are "—".
  - The proxy's address follows H1's rule. Fails when a port is added on the laptop's side, or the `:41500` is dropped.
- **17.** In `lessons/proxies.test.ts`, each `duration` rounded equals §3's column: 2,071, 1,974, 1,930, 1,159, 1,956, 1,046 and 673; table rows and the note take 0.

### On the page, `e2e/proxies.spec.ts` (B19, H9)

- **14 [browser].** Open each step from the outline at 1440 and from the Steps tab at 375. The map matches the same step reached by Play all: the proxy box is visible (bounding box larger than 0) only at steps 2 and 3, and the reverse box only at 4 and 5. Going from step 4 back to step 3 shows the proxy and hides the reverse box.
- **20 [browser].** At 1440 × 900 and 375 × 812, light and dark, at every step's end:
  - `scrollWidth` equals the viewport;
  - the visible callouts' text boxes do not overlap one another (the forward proxy's callout against the internet's, and the reverse proxy's against the web server's);
  - at 375 the callout address text is at least 9px tall (§4.2).
- **20b [browser].** `[data-base][data-hidden]` renders nothing: the forward proxy's box has no visible box at steps 1, 4 and 5. Over the proxy box's top, the tunnel's polyline is hidden under the box (an element hit test at the box's centre returns the box, not the line).
- **20c [browser].** Play all from the Overview to the end, with `playToEnd`. The log shows 14 rows. Each step's first frame shows its start before the first tag moves: no page at step 2, the reverse box at step 4.
- **21 [browser].** On `/networking`, the Proxies card shows `spot('proxies')`'s aria-label, "Proxies" and its subtitle, at stop 18, in both themes.
- **JavaScript off [browser].** As on every net-map page, the figure is the drawn SVG, with every layer `display="none"`. The page says it needs JavaScript (see Notes).

## Notes

- **Prototype, not drift.** The prototype runs the patch's own driver, so its busy band agrees with the patch, not with §2.6 and §3.1 (H3).
- **Route length.** §2.5 calls `reverse>origin` "25.5 units long". That is its 3D length. The driver measures in plan (24), which gives §3's 1,046 ms (950 + 4 × 24). No build effect.
- **The 41500 port.** It is on three rows (H1). The spec states nothing about it elsewhere, so the author keeps it.
- **JavaScript off.** With JavaScript off, a net-map page shows the resolver and no server (job 13, held for the owner). This is unchanged by this unit.
- **For B18b.** `checkCues` prints a quoted list only up to 4 args. `NET_MAP_OPTIONAL` with `cafe` is exactly 4. A fifth turns the message generic, and the pinned words in `define.batch1.test.ts` change again.
- **Page weight.** Each net-map page gains about 14 KB of gzipped HTML (accepted, §9.1). TCP/UDP is at 146.9 KB against the 250 KB budget.
