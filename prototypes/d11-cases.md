# D11 / B13: the spec review's holes and attack cases (job 12, 2026-11-14)

The reviewer (Opus) read `prototypes/d11-batch-1.md` (with its §11 rulings), its six SVG files, unit B13 in `plan.md`, and the code the build changes. The patch in Appendix A was applied to a scratch copy of `job12/batch` at `81a5dae` (it applies cleanly; `81a5dae` differs from `a63c603` only in `prototypes/`), then measured:

- All six files equal the patch's output byte for byte (checks 1 and 2): `spot(kind) + '\n'` for the three spots; 2, 5 and 5 whole groups for the phone, the stranger and the server.
- Check 3 holds: with the new groups removed and their routes dropped, the SVG and data hash to today's `EXPECTED`.
- Checks 4 to 7 hold: the viewBox, unique ids (`nm-busy-phone`, `nm-ports-busy-server`, `nm-nat-busy-stranger`), and the three routes.
- `astro check`: 0 errors.
- Gzipped, a net-map lesson page's full map grows by about 10 KB (75.4 to 85.4 KB) and its data by 0.6 KB. The largest page today is 115 KB against the 250 KB budget.
- On the patch alone, `npm test` has **7 failures in 5 files**. Only 3 of them are named in §5.8 (H1).

## Errata (the orchestrator, 2026-11-14)

Every hole below with an "Answer" is accepted as written, as erratum E<n> for hole H<n>. H4 (the carrier word under Ports' and NAT's tags) needs taste and goes to the designer; its answer is added here as E4 when it comes.

## Holes

Worst first. Each has one right answer unless marked.

**H1. §5.8 leaves out five pinned tests: some go red, some lose their meaning.** The answer for each:

- `src/scenes/drivers/net-map.test.ts:930` checks Router's approved prototype tag for tag, and it is red on the patch. **Answer:** remove the two `<g data-base="phone" data-hidden="">` groups (and any `ports:server` and `nat:stranger` groups) from `drawNetMap(['ip:web']).svg` before the comparison. `prototypes/d10-router.html` stays as it is. Measured: with those groups removed, the comparison is equal.
- `src/lib/home.test.ts:295` asserts `not.toContain('data-hidden')`, and it is red. **Answer:** remove the phone's two groups first and assert there is no `data-hidden` in what is left. Then assert that both phone groups are in Home's scene, each with `data-hidden`.
- `src/scenes/drivers/net-map.test.ts:747`, `:757` and `:768` assert that `[data-hidden]` has length 0. `:768` is red on the patch. `:747` and `:757` pass on the patch only because today's `paint()` un-hides the phone, and they go red once the driver is right. **Answer:** assert that `[data-hidden]:not([data-base="phone"])` has length 0, and that both `[data-base="phone"]` groups have `data-hidden`.
- `src/art/scenes/net-map-layers.test.ts:69`: besides what §5.8 lists, `NET_MAP_BASE_PLACES` gains `'phone'` (last), `cues` gains `show: 'text'`, and `args` gains `show: ['phone']`.
- `src/content/tracks/how-the-internet-works.test.ts:992` builds `routers` from `NET_MAP_BASE_PLACES` minus laptop and resolver, so the list now includes `phone`. The test stays green but no longer means what its name says. **Answer:** leave `phone` out of that list too.

**H2. The new validator rules have no figure scope.**

- `phone` is also a place of the `dhcp` figure, and DHCP's lesson sends messages to and from it with no start, since `dhcp` takes no start.
- `server` is a place of the `osi` figure (`osi-model.ts:425`).

A rule written as "a message to `phone` needs `show phone`" fails DHCP, and the `server` rule fails the OSI Model. **Answer:** all three message rules (§5.5) apply only when `lesson.figure === 'net-map'`.

**H3. How the driver gets `describe`, how the sentence joins, and when it is worked out.** §5.4 says "the driver reads it" and stops there. **Answer:**

- Import `NET_MAP_LAYERS` (and `NET_MAP_OPTIONAL`) from `net-map-layers.ts`, which is data only and already imported by the driver. Never import `net-map.ts` into the page.
- Append each sentence after one space, in `view.layers` order.
- `play()` calls `paint(landed)`, and `MapState` knows no layers. So work the description out in `show()` (or carry the shown layers in the state), so that a play never drops the stranger's sentence.

NAT's full description is then: "A network map. On the left, your home: a laptop, a phone and their router. In the middle, the internet: five routers joined by cables. On the right, the servers this protocol talks to. Behind the internet, someone else’s computer, on another network."

**H4. Ports' and NAT's `over` (the carrier word under the tag) is unspecified. Needs taste (designer).**

- ARP gets "Ethernet" (§3.1).
- Router's messages carry none.
- The tour's TCP messages carry `TCP` (136 uses).

The word is visible on the map. Recommendation: none, as Router.

**H5. The settled tables hold only if no step sets `step.status`.** `view.status` takes over from the `laptop` label as a step starts (`driver.ts:56`). So a step-1 status would break the step-1 start row of ARP, Ports and NAT ("Has a packet for example.net", "Opening connections", "Opening example.net"). **Answer:** the three scenes set no `step.status`; the line moves by `status` cues alone. The fixtures follow this, and the authors are told.

**H6. §4.1 puts the phone's anchor on screen at (45.5, 169.2); the file's lead dot is at `cx="45.5" cy="169.5"`.** **Answer:** the file wins (§0: the SVGs are what the code emits). No test pins 169.2.

**H7. The driver's `hide` now accepts `phone`.** `bases` is read from `[data-base]`, and that now includes the phone. The validator rejects `hide phone` through `args.hide`, but a driver shown it does not throw, while the D10 test name says "`hide` takes only the resolver". **Answer:** the driver throws `cannot hide "phone"`, as it does for "laptop".

**H8. B13 has no lesson pages, so the page-level checks cannot run in B13.** **Answer:** split the work as D10 E2 did.

- **B13 (unit tests on the three fixtures):** checks 1 to 18, 20 to 23 and 25, plus check 24's `lessonFigure`.
- **B13b (`e2e/{arp,ports,nat}.spec.ts`):** check 19, check 24's track page, and the browser cases below (375 and 1440, JavaScript off, Home's phone hidden by CSS).

**H9. Words the fixtures need that the spec leaves to the author.** These are:

- Ports: the `info` of the SYNs and SYN-ACKs in steps 2 to 5.
- NAT, step 4: events 1, 4 and 6, their source and `info`.
- Every `plain`.
- Scene titles (at most 51 characters on net-map, `define.ts:23`).
- Event ids.

**Answer:** the fixtures follow each step 1's pattern. No test pins a placeholder word, only §7's design copy.

## Attack cases (each a test; "fails when" says how to see it go red)

### The files (checks 1 to 4), in `net-map.test.ts` and `figures.test.ts`

- **1.** Read each spot file and compare it whole with `spot(kind) + '\n'`.
  - Fails when: one coordinate's `n1` is changed in `arpSpot`, or `figure()` is given another class.
  - The same three files still equal the render after the builder's whole diff, `describe` and the driver included. This catches a stray edit in `spots.ts`.
- **2.** Use the balanced `<g>` scan on `drawNetMap().svg`: 2, 5 and 5 groups, joined, between the fixed header and `</svg>\n`.
  - Also: `describe` added to `nat:stranger` changes nothing drawn (it is still equal).
  - Fails when: the phone's `data-hidden=""` is dropped from `phonePart`, or `describe` gets drawn.
- **3.** Strip the groups whole first, then run `withoutRouterParts`, and drop the routes of phone, server and stranger. Both hashes must equal today's `EXPECTED`.
  - Fails when: the order is reversed (unwrapping the phone first leaves its parts in the hash).
  - Fails when: `HOME_LEG` is `{ laptop: 2 }` (the laptop's own route moves).
- **4.** Run on the full map:
  - the viewBox is still `-98 -60 685 378`, and no id appears twice;
  - exactly one each of `#nm-busy-phone`, `#nm-ports-busy-server` and `#nm-nat-busy-stranger`.
  - Fails when: the phone's glow id lacks the `nm-` prefix.

### Places and ways (5 to 7), in `net-map.test.ts`

- **5.** `routes['phone>router']` deep-equals `[[-55.5,93,3.2],[-66,83,2.6],[-74,71,14]]`, and `router>phone` is its reverse.
  - Fails when: `HOME_LEG.phone` is 3, which adds `HR_OUT`.
- **6.** `stranger>router` has 11 points. It starts at `[-32,-173,3]`, contains `[-28,-20,6.2]` and then `[-30,26,6.2]`, and ends at `[-74,71,14]`.
  - Fails when: the `pc` site's `puck` is `'c'`.
- **7.** `laptop>server.slice(0,13)` deep-equals `laptop>web.slice(0,13)`, and the 14th points differ.

### Validator (8 and 9), in a new `define.batch1.test.ts` with the real `FIGURE_PARTS`

- **8.** These pass:
  - each fixture's `checkStructure` returns `[]`;
  - `{hide resolver, show phone}` in a start;
  - every lesson in the registry still validates. That includes the DHCP lesson (H2): `phone` messages, no start. And the OSI Model: `server` messages.
  - Fails when: the phone rule has no figure scope.
- **9.** Each of these gives exactly one issue:
  - `show phone` on an event's cues;
  - `show resolver` in a start (`takes "phone"`);
  - `hide phone` in a start;
  - `show` with no arg;
  - NAT's fixture with `show phone` taken out of the start (one issue per phone message: steps 3 and 4);
  - NAT's fixture with its layers set to `['tcp:web']` (the stranger message fails);
  - Ports' fixture with its layers set to `['ip:web']` (every message fails).
  - Near miss that must pass: a phone message where `show phone` comes after `hide resolver` in the start.

### Driver (10 to 14), in `src/scenes/drivers/net-map.test.ts`, with fixture runs added to `scenarios()` and the show sweep (`src/test/show-sweep.ts`) run on each fixture

- **10.** At every position of What is IP, Router and every tour unit, both phone groups have `data-hidden`. At every position of NAT's fixture, neither has.
  - Show NAT, then What is IP, on one driver: the phone is hidden again.
  - `homeDemo().scene` contains both phone groups with `data-hidden`.
  - Fails when: `paint()` is left as it is (it un-hides the phone everywhere), or `shown` is not cleared between shows.
- **11.** NAT's `aria-label` equals the H3 string exactly, at the Overview and after `play()` of NAT's step 5 event 1. Ports' description has no phone sentence. What is IP's equals today's `ARIA`, and Router's equals today's with no resolver sentence.
  - Fails when: the description is worked out in `paint()` from `MapState` alone, or the sentence is joined with no space.
- **12.** Under fake timers:
  - play phone → router: the three `nm-home-led-*` get `.on` as the message sets off;
  - play router → phone: `#nm-busy-phone` gets `.on` when the ride ends, and is off after the rest (`clear()`);
  - play stranger → router: the home LEDs light, `#nm-nat-busy-stranger` lights at the start and goes off past 25%.
  - Fails when: `HOME` lacks `'phone'`.
- **13.** `duration` of a `remove` is 600, and the playback wait at speed 2 is 300. `add`, `update` and `clear` are 0, `replace` 600, `match` 900.
  - For every existing net-map lesson (What is IP, Router, the 14 tour units), the sum of `duration` over each step equals the value recorded before the change.
  - Fails when: `TABLE_MS` gets `add`.
- **14.** Play and show give the same settled figure for every step of the three fixtures, under full and reduced motion. That includes:
  - the phone's glow;
  - the description;
  - the ring left still under reduced motion at ARP steps 1 and 5;
  - Ports step 4's RST (no `.lost` trail, `#nm-drop` at opacity 0).

### Engine and panel (15 to 19), in `tables.test.ts`, `timeline.test.ts` and `TablePanel.test.tsx`

- **15.** Within one step:
  - `match key ''` then `add`: no `noMatch`, and the highlight is `added`.
  - `match keys [x, y]` then `add`: `candidates` and `matches` are kept (§5.6).
  - `match key ''` then `update`: `noMatch` is kept, since only `add` clears it.
  - Router's step 5 settled panel HTML is unchanged.
  - Fails when: `add` is handled as `replace` in `markFor`.
- **16.** ARP:
  - after step 1's match: `.tpanel__empty`, then `tr.tpanel__nomatch` whose text holds "Nothing for 192.168.1.1 in the cache.";
  - step 2's start has no no-match row;
  - during step 5's remove wait, the row is still on screen; after it, the empty text;
  - at step 5's end: one row with `data-highlight="added"` and no no-match row.
  - Fails when: the remove's duration is left at 0 (the wait test), or `add` does not clear `noMatch`.
- **17.** Ports:
  - at step 4's end: rows TCP 22, 80, 443, then the no-match row, with no `data-highlight`;
  - at step 5's end: four rows, TCP 3389 last with `data-highlight="matched"`, no no-match row;
  - at step 5's start: three rows.
- **18.** NAT:
  - at step 5's end: rows 61023 and 63847, then the no-match row;
  - after step 2's match: 61023 has `data-highlight="matched"`;
  - after step 4's second match: 61023 is matched and 63847 is not.
  - The aria-label of each panel is its title alone, since no `replace` sets `by`.
- **19 (B13b, e2e)** at 375 × 812, in the Table tab, at the end of every step of all three:
  - `scrollWidth ≤ clientWidth`;
  - the page has `document.documentElement.scrollWidth ≤ 375`.
  - At 1440 × 900, the panel never scrolls (`scrollHeight ≤ clientHeight`), and at Ports' step 4 the figure box is at least 316px tall.
  - Fails when: NAT keeps the Site column.

### Log and figure (20 to 23), in the fixture tests and `LogPanel.test.tsx`

- **20.** Ports' step 4 log adds two rows: `data-glyph="request"`, then `data-glyph="control"` with source 203.0.113.80:3389. No event has outcome `blocked` or `dropped`, and `#nm-discard` is at opacity 0.
- **21.** NAT's step 5 adds exactly one log row (source 192.0.2.66:51200), and no event in step 5 has `from: 'router'`. There is no `drop` cue, and no note has the `dropped` glyph.
- **22.** Each fixture's `scene.log.legend` deep-equals §3's list in order:
  - ARP: broadcast, response, request;
  - Ports: request, response, control;
  - NAT: request "Packet", response "Reply".
  - Every message kind used has an entry.
  - Fails when: `eventLog()` is used for ARP or NAT (it puts request "Request" first).
- **23.** In NAT, steps 3 to 5 carry no `status`, `status-known` or `status-done` cue. The status line at step 5's end is "Reply received", with class `nm-state done`.

### Cards (24 and 25), in `figures.test.ts` and `src/lib/figures.test.ts`

- **24.** `lessonFigure({ slug })` for arp, ports and nat returns `spot(...)` and does not throw (a constructed summary, as D10 case 24 did). The track page is B13b's.
  - Fails when: a `FIGURES` key is misspelt `ARP`.
- **25.** Each spot has exactly one `data-lit`. The `lm-led on` counts are 2, 3 and 3 (measured). Each aria-label equals §6's text, ’ included.

### Browser cases (B13b, e2e)

- **JavaScript off:**
  - on `/`, `/networking/what-is-ip` and `/networking/nat`, `[data-base="phone"]` computes to `display: none`;
  - NAT's `aria-label` is the drawn one ("a laptop and its router"), matching what shows (E9's rule).
- **JavaScript on, NAT at 375:** the phone's screen glows when the router → phone message lands. Its box is about 17 × 9px. No callout box overlaps another, in light and dark.
- **Unchanged:** `reports.unchanged.test.ts` passes with no edit; `npm run build` passes `check-budgets`, with each net-map page's growth reported.

## Notes

- `route()` sends `laptop>phone` out through the provider's router and back (both are home places with their own legs). The validator accepts such a message. No scene uses it, so nothing changes in B13. A later lesson that needs device-to-device traffic at home needs a home route first.
- The `server` and `stranger` rules are the first that tie a site to its layer. A message to `host` without `ssh:host` still validates, as before.
