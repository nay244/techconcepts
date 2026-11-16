# D15b / B18b: the spec review's holes and attack cases (job 16, 2026-11-16)

The reviewer's report (Opus) on `prototypes/d15-vpn.md` (design/d15-vpn `f808bec`), its prototype and its four `.svg` files, for B18b (VPN's scene on `net-map`). The patch sits on D15a's (`prototypes/d15-proxies.md`, `c159f0b`). Holes are numbered H1, H2…; the orchestrator numbers the errata.

**Verdict: HOLES.** Check 22 cannot pass as written: the validator never reads a `conn` cue (H1). The café's rules miss D15a's `step.start` (H2), and the café accepts a router label whose callout lands on the listener's (H3). Checks 9 to 18 name prototype-only URLs and a vague selector (H4, H5). Check 23 has no threshold, and the light theme's sealed band measures weaker than the unsealed one (H7, needs taste). The byte-for-byte proof holds, measured, but its tests leave Packets and the runtime unpinned (H8).

## Errata (the orchestrator, Opus 5.5, 2026-11-16)

B18b applies Appendix A of `d15-vpn.md` after B18a's build of Proxies, on `job16/batch`. Each hole is an erratum with the answer as written under it; the builder takes the answer.

- **E14** = H1 (one `conn` grammar constant in `net-map-layers.ts`, read by the driver and the validator; B18a writes the reader, B18b adds `tunnel`). **E15** = H2 (`show cafe` refused in a step's start; the café-with-phone check once per unit). **E16** = H3 (`labels.router` refused with the café). **E17** = H4 (`#nm-hold-lock` and `.on`). **E18** = H5 (the prototype's URLs mapped to states). **E19** = H6 (jsdom cases in B18b; [browser] cases and checks 21, 23, 24 in B19's `e2e/vpn.spec.ts`, listed in B18b's review as deferred, not missing). **E20** = H7: **the band stays as approved** (the owner approved the drawing at the gate; sealed differs from unsealed by hue in light); check 23 takes the answer's form: pixels differ, the listener's lit lines at least 3:1. **E21** = H8 (one pre-patch record on `86d0bf6`, Packets included; B18a asked to make it before its patch). **E22** = H9 (the lesson-shape test on the fixture and in `vpn.test.ts`). **E23** = H10 (the table as the prototype defines it; the author sets the words). **E24** = H11 (glow 300 ms, lines 200 ms; no change). **E25** = H12 (no `.nm-conn` at 2.0; one from 2.1).

## What was measured

The work was done on a `git archive` of `86d0bf6` in a scratch folder, with `node_modules` linked. Nothing was applied in a worktree.

- **Order.** D15a's Appendix A (`c159f0b`) applies with `git apply`. D15b's (`f808bec`) then applies cleanly too: no conflict and no `--3way`.
- **Tests.** `npx vitest run` gives 158 files and 2,275 tests, with **9 failed**. They are exactly the 9 that §5.9 lists, all D15a's pins. Every VPN test passes:
  - the three part files are byte for byte (5, 5 and 3 groups);
  - the spot is byte for byte, and `spot:vpn` = `8901f972…84ed8bc`;
  - the café, listener, tunnel and validator tests pass.
- **Byte for byte, the drawing.** Cut Proxies' two layers whole, then run `withoutVpn`, `withoutD11` and the voice cut, then Router's unwrap. The result hashes to `EXPECTED.svg` (`5146c02d…`).
  - The same chain without `withoutVpn` hashes to `24ebf1fd…`, so the hash does see VPN's groups.
  - The data, with the routes of `vpn`, `vpn-out`, `origin`, `reverse` and `proxy` left out, hashes to `EXPECTED.data` (`9206d017…`).
  - The viewBox is `-98 -60 685 378`.
- **Byte for byte, the runtime (a probe, not kept).** It covered all 20 net-map lessons plus Router's fixture: every step at every event index, 971 states.
  - For each state, `driver.show(sceneViewOf(deriveState(…)))` was run on 86d0bf6 and on both patches.
  - After cutting VPN's and Proxies' groups and opening `home`, the root's `outerHTML` is identical in every state.
  - The `aria-label` is identical in every state.
  - Every event's `duration` is identical, Packets' included.
  - The café's openers keep `data-hidden=""` and home's carry none, or the cut would have missed them.
- **Durations.** Measured with `netMapDriver.duration`:
  - laptop↔web: 2,014.9 ms
  - laptop↔vpn: 2,089.8 ms
  - vpn-out↔web: 1,926.2 ms
  - a table update: 0
  - vpn→web: 2,074.7 ms (this route exists, see H9)
- **Geometry.** `routes['laptop>vpn']` and `routes['web>vpn-out']` both end at `[-31,-145,3]`, the pad's centre.
  - `#nm-conns` is drawn after the cables and before `base.things` and `#nm-l-things`. The tags (`#nm-l-tags`) come after the things.
  - So the band runs under every device and under the pad, and a tag rides over the band.
  - The data also holds `vpn>web`, `laptop>vpn-out` and `vpn>vpn-out`.
- **Validator probes** (the Ports fixture with `show cafe`):
  - these each give `[]`: `conn open laptop>vpn data tunnel`, `conn zzz`, a `router` label with the café, `listener reads` in the start, and an `addr 203.0.113.41` cue;
  - a `vpn → web` message raises no issue of its own;
  - `hide home` is refused, by the existing args rule;
  - `show cafe` on an event is refused, by the existing rule.
- **The prototype in Chromium** (Playwright, 1440×900 and 375×812, both themes):
  - The sealed band's computed style is `stroke-width: 7px`, `opacity: .42` and `vector-effect: none`.
  - There is no sideways scroll at either size.
  - At 1440, "Someone listening" is at (361, 445) and "The internet" at (523, 401): 27 px apart sideways and 44 px below. At 375 they are at (10, 266) and (106, 240), 16 px apart.
  - The listener's screen is 15×22 px at 1440 and 9×13 px at 375. Its lines are about 2.9 px and 1.7 px tall.
- **Contrast** (WCAG luminance, band against the plate top: `#ffffff` light, `#2a2f34` dark):

  | | Light | Dark |
  |---|---|---|
  | Unsealed band | 1.29 | 1.32 |
  | Sealed band | **1.20** | 2.99 |
  | Listener's lit lines on their void | 9.4 | 10.4 |

## Holes

Worst first. "One right answer" means measured, with the answer given. "Needs taste" goes to the designer.

**H1. One right answer. Check 22's `conn open laptop>vpn data tunnel` cannot be refused by the validator: `define.ts` reads no `conn` cue.**
`grep conn src/content/define.ts` finds nothing. `conn zzz` passes (`[]`). Only the driver's `parseConn` throws, and the patch's own refusal test is in the driver's test file.
**Answer:**
- D15a's validator rule (`d15-proxies.md` §5 item 5, "conn … <from>><via>><to>: both routes exist") has to read `conn` cues. B18a writes it first.
- B18b makes that reader take exactly `parseConn`'s grammar, `^(open|seal|close) [a-z0-9-]+>([a-z0-9-]+>)?[a-z0-9-]+( data| tunnel)?$`, from one exported constant in `net-map-layers.ts` that both the driver and the validator import.
- Any argument the grammar refuses is one issue that names the form.
- If B18a's rule reads only `via` lines, B18b adds the reading for every net-map `conn` cue.

**H2. One right answer. The café's rules read only `scene.start`, and D15a's `step.start` follows the start's rules.**
D15a §5 item 5 runs `checkCues(…, atStart = true)` for each step's start, so `show` is allowed there. That has three consequences:
- (a) `show cafe` in a step's start escapes all three café rules: with `show phone`, with `listener`, and with `park laptop`.
- (b) The café-with-phone rule (`define.ts`, in `checkCues` under `atStart`) reads `c.unit.scene.start` on every start call, so a unit with step starts reports the issue once per step start.
- (c) The café would appear mid-lesson, which §3 ("a unit's start") and the driver's comment ("a start only") do not design.

**Answer:**
- `show cafe` in a step's start is refused with its own message: "the café is a unit's start".
- The café-with-phone check runs once per unit, from `checkStart`.
- Cases 9d and 9e test both.

**H3. One right answer. A `router` label with the café puts the router's callout on the listener's.**
Router's callout is at `[-64, 262]`, with three lines at y 262, 278 and 294. The listener's is at `[-80, 280]` and `[-80, 296]`, the same spot. The validator passes the pair (`[]`, measured). §2.7 decides that VPN has no router callout, but nothing enforces it.
**Answer:** refuse `labels.router` with `show cafe`, with its own message, as `park laptop` with a router label is refused already (`define.ts` `readPark`). Case 9f tests it.

**H4. One right answer. Check 16 says "`#nm-hold-lock` (or the lock's hold)".**
The lock is `<g class="nm-hold" id="nm-hold-lock">` (`net-map.ts:109`). It is lit by class `on` (`net-map.css:16-17`; the driver's `light(lock, …)`).
**Answer:** check 16 reads "`#nm-hold-lock` lacks `.on` in every state before 5.6, and has it at 5.6, Learn and Practice".

**H5. One right answer. Checks 9 to 18 address the prototype's URLs (`?at=`, `?ride=`, `?step=`), which the site does not have.**
**Answer:**
- **`?at=s.n`** is `sceneViewOf(unit, deriveState(fixture, positionOf(fixture, 0, 'step', s), n))` shown by the driver (jsdom).
- **`?ride=s.n&k=0.5`** is `play(event n of step s)` on the view after n−1 events, with frames run to half its ride. Use the fake-rAF harness of `drivers/net-map.test.ts` (`frameAt`).
- **On a page** (e2e), the reachable states are a step opened (which shows the end of the step before it) and a step played to its end. Cases 30 to 37 use only those, plus polling during a ride.

**H6. One right answer. B18b has a fixture but no lesson and no page. Checks 21, 23 and 24 and every [browser] case need the lesson.**
`NO_SEQUENCE` is in `e2e/lesson.spec.ts:34`. The OSI chip follows the lesson's badge (`spans`, the author's). The card on `/networking` shows once the lesson is ready (B19).
**Answer:**
- B18b writes every jsdom case below, the fixture with `views: ['network']`, and `lessonFigure('vpn')`.
- Every case marked **[browser]**, and checks 21, 23 and 24, go into B19's `e2e/vpn.spec.ts`, written in the form of `e2e/load-balancers.spec.ts` with the helpers after job 15 (`playButton` `.cbtn--alt` "Play all"/"Pause", `nextButton` `.cbtn--go`, `replayButton`, `playToEnd` from `e2e/batch1.ts`).
- B18b's build review lists them as deferred to B19, not as missing.

**H7. Needs taste (the threshold), with one right answer for the check's form. Check 23 says "have contrast with the plate" with no threshold, and the band cannot meet a ratio.**
- The measured contrasts are in the table under "What was measured".
- In light, the sealed band (`--lit-a` at .42) has *less* luminance contrast than the unsealed one (`--lit-b` at .2). "Brightens as the IKE_AUTH reply lands" (§3.1) holds by hue only.
- At 375 in light, the sealed band is faint (looked at, step 4).
- A 3:1 rule fails the band in both themes by design.

**Answer for the check:** the pixel at the band's centre differs from the plate pixel 6 px beside it, and the sealed band's pixel differs from the unsealed band's, in both themes. The listener's lit lines reach ≥ 3:1 against their screen.
**For the designer:** whether the light theme's sealed band is acceptable as approved.

**H8. One right answer. The proof of "every existing net-map lesson stays byte for byte" is weaker in its tests than in fact.** It holds, measured (see "What was measured"), but:
- (a) `net-map.durations.json` predates Packets: its 20 slugs have no `packets`. Only 7 of Packets' events are pinned (`net-map.packets.test.ts:116-124`). "The durations test passes untouched" does not cover Packets.
- (b) No test pins an existing lesson's figure description. Driver tests only `toMatch(/DNS resolver/)`, so check 6's "Its description is unchanged" has no test that can fail.
- (c) The hash covers the drawn string, not what `show` leaves in a lesson's states. Examples: home's wrapper gaining `data-hidden`, or the café shown by a wrong `NET_MAP_INSTEAD` test.

**Answer:**
- Before applying either patch, B18a or B18b records on `86d0bf6` one test-only JSON, as E13 recorded the durations.
- For every net-map lesson and Router's fixture, every step and event index, it holds: the `aria-label`; the SHA-256 of `root.outerHTML` after `show`, with every layer group not in `view.layers` and every `data-base` group of the parts the lesson does not show cut; and every event's `duration`.
- A test compares the patched driver against it (case 4b). With the café's and Proxies' groups cut and home opened, it matched in all 971 states.

**H9. One right answer. The wrong routes pass both the validator and the driver.**
The data holds `vpn>web` (through router a, under the band), `laptop>vpn-out` and `vpn>vpn-out`. A `vpn → web` message raises no issue (measured), nor does an `addr` cue with the café. That would break §2.2 (the plain leg never touches the band) and Ruling 3 (no `addr` cue).
**Answer:** a test on the fixture now, and the same in L29-b's `vpn.test.ts`, asserts four things (case 22):
- every message that touches `web` has `vpn-out` or the laptop (step 1 only) at its other end;
- every message that touches `vpn` has the laptop at its other end;
- no event carries `addr` and the labels have no `laptopAddr`;
- every `conn` argument is `open|seal laptop>vpn tunnel`.

No validator rule: the spec designs none.

**H10. One right answer. The table's definition is in the prototype only.**
§1 says "three fixed rows" but not their first cells, key or empty text. The prototype's (`d15-vpn.html`, `table:`) is:
- `id 'who-reads'`, `keyColumn 'who'` and `markLabel 'readable'`;
- `empty 'Nobody yet.'`;
- the columns `who` "Who", `to` "Sees it going to" and `read` "Can read it?" (prose);
- `initialRows`: the three rows, with `to` and `read` each "—".

**Answer:** the fixture takes these as they are; the author sets the words.

**H11. One right answer (low). §3.1 says the listener's screen fades over 200 ms. The patch's glow rect is `.nm-glow`, which fades over 300 ms (`net-map.css:14`); only its lines take 200 ms.**
**Answer:** the patch, which the prototype runs, is the approved design. Read §3.1 as "lines 200 ms, glow 300 ms". No change.

**H12. One right answer (low). Check 14 says "in every state of steps 2 to 5, the only `.nm-conn` is the tunnel". At 2.0 (step 2 opened, before IKE_SA_INIT) there is none.**
**Answer:** none at 2.0, and exactly one from 2.1 to the end.

## What the build can break

- **D15a's tests, which B18b's patch changes.** The builder takes the union of each:
  - D15a's check 19, `parseConn(…)` with `toEqual`, gains `tunnel: false`;
  - the `show` message gains `"cafe"`;
  - `NET_MAP_OPTIONAL`;
  - the layer list and `SITES`;
  - `FIGURE_PARTS` cues and args;
  - every "nothing else hidden" selector, which also skips `data-base="cafe"`;
  - the `describe` list;
  - `SPOTS` and `DRAW`, `lib/figures.ts` and the `lessonFigure` list.
- **The fixture file** B18a creates for batch 4 (one writer at a time: B18b appends `vpnFixture` after B18a's).
- **CSS order.** `.nm .nm-conn.tunnel` must come after `.nm .nm-conn.sealed`, or the sealed band takes 3.5 px (case 33).
- **Layer order.** `vpn:vpn` before `vpn:web`, or NE's plate draws over E's racks.

## Attack cases

Each is a test a builder can write. "Fails when" names the wrong build it catches. The fixture is B18b's `vpnFixture` unless a case says otherwise. Times are at 1×. **[browser]** marks a case only a real browser can try; it goes to B19's `e2e/vpn.spec.ts` (H6).

### The figure and its files (checks 1, 2, 3, 5, 8), in `net-map.test.ts` and `figures.test.ts`

- **1.** Check 1, the spot:
  - `spot:vpn` is `8901f972b9d06da75e129784bab04d3eecd3e3e8c68bebad166bafb1084ed8bc`, and the file equals `spot('vpn') + '\n'`;
  - it has one `data-lit` and one `lm-led on`, and no `lock` (case-insensitive);
  - it has §6's aria-label, `SEALED TO THE VPN SERVER`, and viewBox `36 44 528 372`;
  - every earlier spot hash, and Proxies' once B18a pins it, is unchanged.
  - Fails when a word or a light changes.
- **2.** Each part file is `HEADER`, then `groupsOf(drawNetMap().svg, open).groups.join('')`, then `</svg>\n`. Group counts are 5 (server), 5 (web) and 3 (café). Fails when one coordinate or class moves.
- **3.** Proxies' cut, then `withoutVpn`, D11's cut, the voice cut and Router's unwrap hash to `EXPECTED.svg`. The same chain without `withoutVpn` must **not** equal it (`24ebf1fd…`). Fails when `withoutVpn` cuts nothing, or an existing part moves into a VPN group.
- **3b.** The data, without the five new sites' routes, hashes to `EXPECTED.data`. The viewBox is `-98 -60 685 378`. Fails when the listener's callout box or NE's plate grows the frame.
- **4.** Check 4: `net-map.durations.test.ts` and its JSON are untouched (`git diff revamp -- src/scenes/drivers/net-map.durations.*` is empty).
- **4b.** H8's snapshot: every lesson's states, descriptions and durations, Packets' included, equal the 86d0bf6 record. Fails when `home` gets `data-hidden` on an existing lesson, or the description swap fires without `show cafe`.
- **5.** Ids are unique. `nm-vpn-busy-vpn`, `nm-vpn-busy-vpn-out` and `nm-listener` appear once each. `#nm-listener` holds one `.nm-hear-head` with one line and one `.nm-hear-body` with two.
- **6.** Layer keys end `…, 'tcp-udp:voice', 'proxies:site', 'proxies:proxy', 'vpn:vpn', 'vpn:web'`. `SLOT.NE` is `{ x: -50, y: -182, w: 64, d: 54, r: 7 }`, and `NW` is D15a's. Fails when the layers are swapped.
- **7.** Routes:
  - `routes['laptop>vpn'].at(-1)` and `routes['web>vpn-out'].at(-1)` are `[-31,-145,3]`;
  - `routes['vpn-out>web']` passes router c's top and not router a's;
  - `routes['laptop>vpn']` passes a's top and not c's;
  - `entryRouter` sends `vpn` to `a` and `vpn-out` to `c`. Test it through a `via` message: `vpn-out → web` via `a` raises the "passes router … twice" or `via` issue that c's entry implies.
  - Fails when `outPuck` is ignored.
- **8.** Check 8: the `vpn:web` groups contain neither `:80` nor `:443`, and no `port` in any case. The callout reads "Web server" and "203.0.113.80". Fails when `web()` is given a port.
- **8b.** The café groups:
  - the engraving `CAFÉ WI-FI · 192.168.1.0/24`;
  - the callout's texts "Someone listening" and "192.168.1.66", start-aligned at x −80 and y 280 and 296;
  - the leader starting at the listener's front-left corner, projected;
  - home's two groups: the engraving `YOUR HOME · 192.168.1.0/24` and the laptop's cable.

### Validator (check 22, H1, H2, H3), in `define.vpn.test.ts`, with exact issues compared with `toEqual`

- **9a. These pass (`[]`):**
  - the fixture;
  - Ports with `show cafe` added to its start;
  - the café with `park web 1 GET`;
  - the café with `listener outside` on an event;
  - `conn open laptop>vpn tunnel`, then `conn seal laptop>vpn tunnel`;
  - `conn open laptop>files data` (FTP's, still accepted).
- **9b. Each fails exactly once, with its own message:**
  - `show cafe` with `show phone`;
  - `listener reads` without the café;
  - `listener sees` with the café: one issue, naming `sees` and `reads`/`outside`;
  - `park laptop 1 X` with the café, which says "the laptop's column lies where the café's listener does";
  - `hide home`;
  - `show cafe` on an event.
- **9c. H1.** Each of these is refused with one issue:
  - `conn open laptop>vpn data tunnel`;
  - `conn open laptop>vpn tunnel data`;
  - `conn open laptop>vpn  tunnel` (two spaces);
  - `conn zzz`.

  Fails when the validator still has no `conn` reader.
- **9d. H2.** `show cafe` in a step's start is refused. Fails when the rule reads only `scene.start`.
- **9e. H2.** Café with phone in the scene start, in a fixture whose three steps each carry a `step.start`: exactly one issue for the pair. Fails when the rule runs on every start call.
- **9f. H3.** `labels.router` with `show cafe`: one issue. `labels.router` without the café still passes.

### Driver, each state settled (checks 6, 7, 9 to 14, 16, 17), in `drivers/net-map.test.ts`, via H5's recipe

- **10.** VPN's start (step 1 opened):
  - `[data-hidden]` is exactly home's 2 groups, the resolver's, and the phone's 2. The café's 3 groups carry none.
  - The description contains "On the left, a café: your laptop, the café’s router, and someone else on its Wi-Fi, listening." and "the VPN server, where the tunnel from your laptop ends."
  - It contains neither "your home" nor "DNS resolver".
- **11.** `#nm-lapAddr` reads `192.168.1.100` in every state from 1.0 to 5.6, at Learn and at Practice. Fails when an `addr 203.0.113.41` cue is put on IKE_AUTH.
- **12.** The listener:
  - 1.0: no `data-hear`;
  - 1.1 to 2.4: `reads`;
  - 3.1 to the end: `outside`;
  - steps 4 and 5 opened: `outside`;
  - `listener reads` then `outside` on one event: `outside` wins.
- **13.** The tunnel:
  - 1.x and 2.0: `#nm-conns` is empty;
  - 2.1 to 2.3: exactly one polyline, class `nm-conn tunnel`;
  - 2.4 to the end: class `nm-conn tunnel sealed`;
  - never `alt`, never a `transform`;
  - its last point is the projected `[-31,-145,3]`, and its points contain none of `vpn-out`'s leg (the pad's right side to c).
- **14.** The status:
  - 1.1: "Readable on the café’s Wi-Fi";
  - 2.1: "Setting up the tunnel";
  - 2.4: "Tunnel ready";
  - 3.1: "Sealed in the tunnel";
  - 4.2: "Plain again past the VPN server";
  - 5.1: "Sealed all the way to the site".
  - Each holds across the step boundary until the next. 1.0 reads the label "On the café’s Wi-Fi".
- **15.** The page and the lock:
  - the page (`text`) from 1.3 on;
  - `#nm-url` is "example.net" until 5.1, then "https://example.net";
  - `#nm-hold-lock` has no `.on` at every state up to 5.5, and has it at 5.6, Learn and Practice (H4).
  - Fails when the `lock` sits on 5.1.
- **16.** The driver throws for:
  - `hide home` (`cannot hide "home"`);
  - `listener sees`;
  - `conn seal laptop>vpn` after `open … tunnel` ("not open");
  - `conn open laptop>vpn data tunnel`.

  Each throws before the figure changes: `outerHTML` is the same before and after.
- **17.** DOM order: `#nm-conns` comes before `#nm-l-things`, and `#nm-l-things` before `#nm-l-tags`. Fails when the band is drawn over the pad, or the tag under the band.

### Driver in flight (checks 15, 18, 19), fake timers and full motion

- **18.** `duration` at 1×:
  - laptop↔vpn: 2,090 ± 1;
  - vpn-out↔web: 1,926 ± 1;
  - laptop↔web: 2,015 ± 1;
  - each table update: 0;
  - step totals: 4,030, 8,360, 2,090, 5,942 and 8,032 ± 2.
  - At 2× (`usePlayback`), step 4 runs in half its time.
- **19.** Mid-ride at 4.2 and 4.4 (k = 0.5):
  - the trail's class is exactly `nm-trail`;
  - the tags read `GET /` and `PAGE`;
  - `#nm-conns` holds only the tunnel;
  - `#nm-vpn-busy-vpn-out` is `.on` and `#nm-vpn-busy-vpn` is not.

  Mid-ride at 5.3 and 5.5, the tags read `HTTPS`.
- **20.** Changes land, not set off:
  - mid-ride on 1.1, there is no `data-hear`; after landing, `reads`;
  - mid-ride on 2.1, `#nm-conns` is empty; after landing, unsealed;
  - mid-ride on 3.1, still `reads`;
  - mid-ride on 5.6, the lock is off.
- **21.** Seek (check 18): `showSweep(vpnFixture())` passes. For all 19 events, `show(before)` plus `play(event)` under reduced motion equals a fresh `show(after)`. An abort mid-ride followed by `show` equals a fresh `show`.
- **22.** H9's lesson-shape test, on the fixture now and on `vpn.ts` in L29-b.

### Log and table (checks 10, 17, 20), in `LogPanel.test.tsx` and `TablePanel.test.tsx` with the fixture

- **23.** The log has 14 rows by 5.6.
  - The infos are §3's 1 to 14, in order.
  - Proto is HTTP, HTTP, IKE ×4, ESP, HTTP, HTTP, ESP, ESP, HTTPS, HTTPS, ESP.
  - Every Time and Size is "—".
- **24.** The table (H10):
  - three rows at 1.0, each "—";
  - 1.2: the café row is example.net · "Yes: the request and the page" · mark **readable**;
  - 3.2: 203.0.113.40, the VPN server · "No: sealed", no mark;
  - 4.1: the server row is readable;
  - 4.3: the after row is readable;
  - 5.2 and 5.4: "No: sealed by HTTPS", no mark.
  - Fails when a mark stays because the update carries `miss: false` but the panel needs `miss` absent (check both).
- **25.** `lessonFigure` for slug `vpn` returns `spot('vpn')` (check 24's unit half).

### On the page: B19's `e2e/vpn.spec.ts`, at 1440×900 and 375×812, light and dark

- **30. [browser]** For every step opened and step 5 played to its end: `scrollWidth` equals the viewport. At 375, the Table tab's region has `scrollWidth ≤ clientWidth`, and the mark word sits under the row's name (check 23 and §4.3).
- **31. [browser]** The listener (check 9 and 13):
  - step 1 opened: `.nm-hear-head` and `.nm-hear-body` have computed opacity 0;
  - step 2 opened: both 1;
  - step 4 opened: head 1, body 0.
- **32. [browser]** Reduced motion (`emulateMedia`): `.nm-hear-head`, `.nm-hear-body` and the listener's `.nm-glow` have `transition-duration: 0s` (check 19).
- **33. [browser]** The band at step 3 opened:
  - computed `stroke-width: 7px`, `vector-effect: none`, opacity `0.42`;
  - its drawn width is 6 to 7 px at 1440 and 3 to 4.5 px at 375.
  - Fails when `.sealed`'s 3.5 px wins.
- **34. [browser] The tunnel ends at the server.** At step 3 opened:
  - a pixel at the middle of the out cable (pad's right side to router c) equals the same pixel at step 1 opened;
  - a pixel on the cable from a to the pad differs from it.
- **35. [browser] The callout reads as on the café's plate.**
  - The "Someone listening" text box overlaps no other visible callout box.
  - It lies left of "The internet"'s left edge and below the café plate's lowest point.
  - Its `.nm-lead-dot` lies inside the café listener group's box.
- **36. [browser]** Mid-ride on step 3's ESP, `elementFromPoint` at the tag's centre is inside `#nm-l-tags`.
- **37. [browser]** Step 5 played with `playButton`: `#nm-hold-lock` stays without `.on` until the last ride lands, then has it. It still has it at Learn.
- **38. [browser]** Check 23's contrast, in H7's settled form.
- **39. [browser]** Check 21: `NO_SEQUENCE` gains `vpn`, there is no Network / Sequence switch, and there is no OSI chip.
- **40. [browser]** Check 24: the Networking page shows the spot's aria-label, "VPN" and "A sealed tunnel, as far as the VPN server" at stop 20, in both themes.

## Notes

- **JavaScript off.** The built HTML shows home, not the café, until the driver runs. This is the net-map lessons' missing no-JavaScript fallback, held for the owner (plan decision 13), not this unit's.
- **The listener's lines** are about 1.7 px tall at 375, against 2.9 px at 1440. "All three" against "top line" is small on a phone; the table carries the same fact.
- **`listener reads` in a scene's start** passes (`[]`) and would light the screen before anything is heard. No rule asks for it, so no change.
- **`fresh` (D15a)** clears the connections but not `hear`. That matters only for a lesson that uses both.
- **The prototype's console** is from before job 15. The build uses today's controls; that is not drift.
- **Every net-map page** draws VPN's layers and the café, hidden (+18 KB gzipped). The owner accepted this for this batch (§9, Q4).
