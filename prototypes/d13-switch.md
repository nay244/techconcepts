# D13b: Switch's scene and card art

Job 14, unit D13b. The new lesson **Switch** (`switch`, Networking Concepts stop 5) needs a figure of its own: one switch, five numbered ports, four devices on cables, and a frame that goes out of one port or floods out of all the others. This spec is what B13b builds. The words of the lesson are the author's; the words here are the analyst's outline (`.superpowers/analysis/switch/report.md` §2) as placeholders, except the design copy in §7.

| File | What it is |
|---|---|
| `prototypes/d13-switch.html` | The clickable prototype: the Lesson page (five steps, played by the patch's own driver and the site's engine), and the card art on Networking's route. Opens from the file system. The **D13b prototype** tab (right edge) switches Page, Theme and Motion. |
| `prototypes/d13-switch.md` | This spec. Appendix A is the patch. |
| `prototypes/d13-switch-spot.svg` | `spot('switch')`, the card art, as the code draws it. |
| `prototypes/d13-switch-part-figure.svg` | The new figure, `drawSwitch().svg`, at rest (with the root's `xmlns`). Every new part is in it: the switch, the router, the printer, the cables and plugs, the moved cable (hidden), the traces, the tags (hidden) and the callouts. A test pins the file to the code. |

**One variant.** The brief's figure has one right shape (a row of ports with a cable to each device), so there is no second. The one real fork, how a device that gets no copy reads, is settled in §2 (decision 3), not as a variant.

**URL switches in the prototype** (for the reviewer): `?step=N` opens step N; `&end=1` shows it settled; `&play=1` plays it; `&tab=table` opens the Table tab on a phone; `&theme=dark`; `?page=cards` opens the card art.

## 1. What changes and what stays

**New.**
- A sixth scene figure, `switch` (`FigureId`, `figureIdSchema`, `FIGURE_PARTS`, `DRAW`, `DRIVERS`), drawn by `src/art/scenes/switch.ts`, styled by `switch.css`, moved by `src/scenes/drivers/switch.ts`. Its names and numbers (devices, MAC addresses, ports, places, routes, the one re-plug) are in `switch-parts.ts`, which the drawing, the driver and the validator share.
- Two cues: `flood` (a flag on a frame for one device: no match, so a copy goes out of every other port) and `plug` (text, only `laptop 5`: the laptop's cable moves to port 5 before that frame sets off).
- Three validator rules for the switch figure: a broadcast is sent to `all` and a frame to `all` is a broadcast; a broadcast takes no `flood`; `flood` and `plug` go on a message, not a note.
- The card spot `spot('switch')` and its entry in `src/lib/figures.ts` (`switch: () => spot('switch')`).

**Stays.**
- Every existing figure, driver, spot, test hash and page. Nothing in `dhcp`, `net-map`, `osi`, `subnet` or `firewall` changes; the full suite passes with the patch (2,059 tests).
- The Lesson page's layout, the console, the table panel (`TablePanel.tsx`), the engine and the log, as built. The MAC table is an ordinary `table` panel: `match` with `key: ''` for the no-match row, `add`, `update`, `match`.
- MAC Address's callout and verdict look (`dhcp.css`): the switch's callouts copy it class for class, so the two lessons read alike side by side.

## 2. Decisions

1. **Places `router`, `laptop`, `tv`, `printer` and `all`.** A broadcast is `to: 'all'`, so the log, the validator and the driver agree on "for everyone" without a special case. Nothing is sent from `all`.
2. **Flood is a cue, a broadcast floods by itself.** The outline's step 1 floods a frame for one device; whether a frame floods depends on the table, which the figure does not read. So the author says so (`flood`), and the validator can check it. A broadcast always goes out of every other port.
3. **"No copy" is nothing; "Ignores it" is a mark.** A device that gets a copy says "Keeps it" (green square) or "Ignores it" (muted square with a slash), and its cable carries the trace. A device that gets no copy shows no verdict, its cable stays plain and its port light stays off. In step 3 the router and TV are silent and dark; in step 1 they say "Ignores it" over a lit cable. The difference is three things at once (words, cable, light), so it reads without colour.
4. **The flood is a fan of copies.** One tag rides in on the sender's cable to its port; the port's light comes on; after a look-up pause the tag goes, and one COPY tag per device rides out of each other occupied port at the same time. Port 5 (empty) gets nothing, the sender's cable gets nothing back.
5. **A forwarded frame keeps its tag.** Steps 3 and 5: the same FRAME tag rides in and out; only the receiver's port lights besides the sender's.
6. **The re-plug is a crossfade, not a drag.** Step 5's frame starts with the laptop's cable at port 2 fading to a ghost while the cable at port 5 fades in (1.2 s), then the callout's chip turns **PORT 5** in the accent. A drag along a new route would need a second tube drawing; the crossfade says "moved" with the parts already drawn.
7. **The callout carries the port.** Each device's name line reads `LAPTOP  PORT 2`. The reader needs device and port side by side to read the MAC table (Port and MAC only, ruling 4), and the figure is where the device's name is.
8. **Step 2 (no frame) lights what was learned.** A step whose only event is a table `add` or `update` lights that row's port and traces the cable plugged into it, so the reader sees where "port 2" is.
9. **The switch's own callout says what it keeps.** "Switch / keeps the MAC table" ties the panel below to the box.
10. **Cables, never waves.** Every link is a tube on the plate, as the outline asks: no ring, no radio.
11. **Times and sizes are dashes in the log**, as the outline asks (no source states a size; times are example data, and a dash says less).
12. **The laptop's moved cable crosses over the TV's and the printer's.** It is lifted a little where it crosses them (drawn on top). A route that crosses nothing does not exist with port 5 at the end of the row and the laptop at the far side.

## 3. The scene, step by step

### 3.1 The figure at rest

One plate, engraved **HOME NETWORK · ONE SWITCH, FIVE PORTS**. At the back, the switch: a long low box (116 × 30 plan units, 19 tall) with five ports along its front face, numbered **1** to **5** above each socket, and a light (`sw-led-n`) over each. Behind and left, the router; front left, the laptop; front centre, the TV; right, the printer. Each device has its own cable along the plate to its port: router to 1, laptop to 2, TV to 3, printer to 4. Port 5 is empty (its socket shows the gold pins). The laptop's second cable, to port 5, is drawn but hidden. Each device has a small status light, off at rest (`sw-led-laptop` on the laptop's base, `sw-led-tv` under the TV's screen, `sw-led-printer` on the printer's front, `sw-rt-led-1` and `-2` on the router); the router's first light is its power light and stays on.

Callouts, on the page's figure background:

| Device | Name line | Second line | Third line |
|---|---|---|---|
| Router | `ROUTER  PORT 1` | `00:00:5E:00:53:01` | verdict |
| Laptop | `LAPTOP  PORT 2` (then `PORT 5`, accent) | `00:00:5E:00:53:10` | verdict |
| TV | `TV  PORT 3` | `00:00:5E:00:53:12` | verdict |
| Printer | `PRINTER  PORT 4` | `00:00:5E:00:53:13` | verdict |
| Switch | `SWITCH` | `keeps the MAC table` | (none) |

### 3.2 How a frame plays (1×)

| Phase | ms | What moves |
|---|---|---|
| Re-plug (only with `plug`) | 1,200 | The laptop's cable and plug at port 2 fade to `data-ghost` (opacity .35) and out; the cable and plug at port 5 fade in. Then the chip turns `PORT 5` (class `moved`). |
| In | 900 | The sender says **Sent it**. Its tag (`FRAME`, or `TO ALL` for a broadcast) rides its cable from the device to its port, laying a bright trace (`data-on="ride"`) behind it. At the end the port's light comes on. |
| Look-up | 500 | Forward: the tag waits at the port. Flood: the tag goes at once (the copies take over). |
| Out | 900 | Every port the frame leaves by lights as it sets off. Forward: the same tag rides out of the receiver's port to the receiver. Flood: one `COPY` tag per other device (`TO ALL` for a broadcast) rides out of each port at once. |
| Rest | 450 | As the tags arrive, each device that got a copy shows its verdict, and one that keeps it lights a small status light on the device (the router's lights, a light on the laptop's base, the TV's and the printer's front). No screen or paper slot lights: that would say the frame is shown or printed. The tags then go. |
| Gap | 200 | Nothing. |

A frame takes 2,950 ms; with a re-plug 4,150 ms. Each MAC table event (`table: 'mac-table'`) waits 900 ms so the row is seen; any other table event 0. Under reduced motion every tween jumps to its end and the waits stay, as in every figure. Once landed, every cable the frame used keeps a quiet trace (`data-on="trace"`, opacity .5) and its ports stay lit until the next step.

### 3.3 The steps

Every frame's log row: time `—`, protocol `Ethernet`, size `—`. Verdicts: S = Sent it, K = Keeps it, I = Ignores it, blank = no copy.

| Step | Events (in order) | Cue | Tags | Traces and lights after | Verdicts (router, laptop, TV, printer) | MAC table after |
|---|---|---|---|---|---|---|
| 1 No match, so it floods | message laptop → printer, `request`; table `match` `key: ''` | `flood` | FRAME in, 3 × COPY out (ports 1, 3, 4) | cables 2, 1, 3, 4; lights 1–4 | I, S, I, K | empty, with the no-match row "No entry for 00:00:5E:00:53:13" |
| 2 It learns the sender | table `add` {port 2, …:10} | none | none | cable 2; light 2 | all blank | 2 · …:10 (added) |
| 3 Straight to one port | message printer → laptop, `response`; table `add` {4, …:13}; `match` …:10 | none | FRAME in at 4, out at 2 | cables 4, 2; lights 2, 4 | blank, K, blank, S | 2 · …:10 (matched), 4 · …:13 |
| 4 To everyone, every port | message router → all, `broadcast`; table `add` {1, …:01} | none | TO ALL in, 3 × TO ALL out (ports 2, 3, 4) | cables 1–4; lights 1–4 | S, K, K, K | 2 · …:10, 4 · …:13, 1 · …:01 (added) |
| 5 Moved? It learns again | message laptop → router, `request`; table `update` …:10 → port 5; `match` …:01 | `plug laptop 5` | (re-plug), FRAME in at 5, out at 1 | cables 5 (laptop), 1; lights 1, 5; laptop at port 5, chip `PORT 5` | K, S, blank, blank | 5 · …:10, 4 · …:13, 1 · …:01 (matched) |

Log info lines (the outline's, placeholders): step 1 "Frame for 00:00:5E:00:53:13: no match, so flooded out of ports 1, 3 and 4"; step 3 "Frame for 00:00:5E:00:53:10: in the table, port 2"; step 4 "Frame to ff:ff:ff:ff:ff:ff (everyone), out of ports 2, 3 and 4"; step 5 "Frame for 00:00:5E:00:53:01: in the table, port 1". Legend: `request` "Frame for one device", `broadcast` "Frame for everyone", `response` "The reply".

**Going back.** `show` paints the plugs from all the cues so far, so step 4 after step 5 puts the laptop back on port 2 and its chip back to `PORT 2`. A step's settled picture is the same whether it was played or opened (`show` after the last event). As the panel does today, `play` is given the view before its event (`deriveState(…, eventIndex)`), so a `plug` cue is read from the event itself, not the view.

### 3.4 The panel: the MAC table

`{ id: 'mac-table', title: 'MAC table', by: 'kept by the switch', keyColumn: 'mac', columns: [{ key: 'port', label: 'Port', width: 64 }, { key: 'mac', label: 'MAC address' }], initialRows: [], empty: 'Empty: the switch hasn’t learned any address yet' }`. Rows keep the order they were learned in; step 5's `update` changes row …:10 in place (the port cell turns 5).

## 4. Sizes and measurements

### 4.1 The figure (plan units; one camera, `k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 })`)

| Part | Size |
|---|---|
| Plate `PL` | x −116, y −84, 232 × 168, r 10 |
| Switch `SW` | x −62, y −66, 116 × 30, r 3; on a 1.6 foot, 19 tall |
| Ports | 13 wide × 10 tall at z 3.4, pitch 19.5, centres x −38, −18.5, 1, 20.5, 40 on the front face; number 4.6px mono 700 above each; light r 1.3 |
| Plug | 10 × 6, r 1, from z 4.6, 7.6 tall |
| Status lights | `lm-led`, r 1.1 (the router's, the laptop's at z 1.8 on the base's front, the TV's and the printer's on their fronts); on is the lumen finish's lit light with its glow |
| Router `RT` | x −112, y −70, 40 × 24, r 4; on feet 2, 10 tall |
| Laptop base `LB` | x −106, y 30, 54 × 38; lid 36 tall |
| TV | panel x 26, y 64, 50 × 3; foot x 41, y 59, 20 × 13 |
| Printer `PR` | x 68, y −10, 40 × 32, r 3; 16 tall |
| Cables | tube radius 1.1, on the plate at z 1.3; corners rounded; the moved cable lifted to z 3.9 where it crosses the TV's and the printer's |
| Tags | (letters × 3.3 + 10) × 12, r 1.6, 3.6 tall (FRAME 26.5, COPY 23.2, TO ALL 29.8); words 4.6px mono 700; they ride 4.6 above the cable |
| Traces | 2px while riding (opacity .95, 3px glow), 3px once landed (opacity .5), non-scaling |
| viewBox | `-85 4 703 316`, fitted to the plate, the tallest parts and every callout, with 18 of margin |

**Callouts** (as MAC Address's): name 11.5px mono 700, letter-spacing .12em, upper case; MAC 12.5px mono 500; switch's second line and verdict 13px sans; 16 between lines; lead 1px, end dot r 2. Verdict mark 8 × 8, r 1, its words 12 from the mark. Text anchors (x, y of the first line): router (66, 34) right-aligned; laptop (150, 262) right-aligned; TV (330, 266); printer (458, 196); switch (434, 60).

### 4.2 Before and after, measured in the browser

Before is MAC Address on the built site (the scene this lesson sits beside); after is the prototype, which runs the patch.

| At 1440 × 900 | Before (MAC Address) | After (Switch) |
|---|---|---|
| Figure box | 733 × 317 | 733 × 351 to 408 (by step: the panel under it changes height) |
| Drawing | 666 × 317 (height-bound) | 733 × 330 (width-bound) |
| Callout MAC / name text | 12.5px / 11.5px | 13.0px / 12.0px |
| Table panel | 733 × 181 | 733 × 131 (step 1), 118 (step 3), 147 (step 5) |
| Page sideways scroll | none | none (`scrollWidth` 1440) |

| At 375 × 812 | Before (MAC Address) | After (Switch) |
|---|---|---|
| Figure box | 375 × 275 | 375 × 275 |
| Drawing | 375 × 179 | 375 × 169 |
| Callout MAC / name text | 7.0px / 6.4px | 6.7px / 6.1px |
| Table tab | 375, no sideways scroll | table 347 wide in a 375 tab at steps 1 to 5, no sideways scroll |
| Page sideways scroll | none | none (`scrollWidth` 375) |

Both themes measured the same. At 375 the callouts are a little smaller than MAC Address's (the switch's figure is wider: 703 against 668 units), and as small as D12 accepted for verdicts: the MAC table says each port and address in words at full size, and the log and the narrative say who kept the frame.

### 4.3 Weight

The driver minifies to 5,431 bytes, 2,437 gzipped (esbuild, `motion.ts` left out as the page already has it); MAC Address's dhcp driver, measured the same way, is 5,234 and 2,468. With the patch, every lesson page's JavaScript is 105.5 KB gzipped (budget 200). The drawing runs at build time and adds nothing to the page's JavaScript; the figure's own CSS (`switch.css`, 2.8 KB) joins the lesson stylesheet.

## 5. Changes for the builder

Appendix A is the whole patch; it applies to `job14/batch` at `9807155`, and with it `npm test` passes (145 files, 2,059 tests) and `npm run build` passes (every page in budget). File by file:

| File | Change |
|---|---|
| `src/art/scenes/types.ts:2` | `FigureId` gains `'switch'`. |
| `src/content/schema.ts:37` | `figureIdSchema` gains `'switch'`. |
| `src/art/scenes/switch-parts.ts` (new) | `SWITCH_DEVICES` (name to MAC), `SwitchDevice`, `SWITCH_PLUGS` (router 1, laptop 2, TV 3, printer 4), `SWITCH_PLACES` (the four and `all`), `SWITCH_PLUG_ARGS` (`['laptop 5']`), `SWITCH_ROUTES` (each device to each other device, and each device to `all`), `SWITCH_DESCRIPTION`. |
| `src/art/scenes/switch.ts` (new) | `drawSwitch(): DrawnFigure` and `SwitchSceneData { cables: Record<'device:port', [x, y][]> }`: each cable as a line on screen at the tags' height, for the five cables (`router:1`, `laptop:2`, `tv:3`, `printer:4`, `laptop:5`). Imports `switch.css`. |
| `src/art/scenes/switch.css` (new) | The callouts, port chips, numbers, tags, traces, ghost, verdicts and settling (the status lights are the lumen finish's `lm-led`). |
| `src/art/scenes/index.ts` | `DRAW.switch = drawSwitch`. |
| `src/scenes/drivers/switch.ts` (new) | `switchDriver: DriverModule`, as §3. Imports only the drawing's types and `switch-parts.ts`. |
| `src/scenes/drivers/index.ts` | `DRIVERS.switch = switchDriver`. |
| `src/art/scenes/parts.ts` | `switch: { places: SWITCH_PLACES, cues: { flood: 'flag', plug: 'text' }, args: { plug: SWITCH_PLUG_ARGS }, routes: SWITCH_ROUTES, layers: [], board: false, start: false }`. |
| `src/content/define.ts` | For the switch figure: a note with `flood` or `plug` fails ("cue "plug" is for a message; a note sends no frame."); a broadcast not to `all` fails ("is a broadcast, so it is sent to "all"."); a frame to `all` that is not a broadcast fails ("is sent to "all", so its kind is "broadcast"."); a broadcast with `flood` fails ("is a broadcast, which floods by itself; leave out "flood"."). |
| `src/art/figures/spots.ts` | `switchSpot()`, `'switch'` in `SPOTS` and `DRAW`. |
| `src/lib/figures.ts` | `switch: () => spot('switch')` (the lesson's slug). |
| `src/content/test-fixtures.ts` | `FIXTURE_PARTS.switch`. |
| `src/art/scenes/parts.test.ts:7`, `src/art/scenes/index.test.ts:10` | The figure list gains `'switch'`. |
| `src/art/figures/figures.test.ts` | `'spot:switch': '36be892c80e718a900d2b7a5ce39990fb433a798e7827e1b24aeb441f54a3fdf'`. |
| `src/styles/green-text.test.ts` | Switch's "Keeps it" on the figure background, both themes. |
| `src/content/switch-fixture.ts` (new, test-only) | The spec's unit on What is IP's lesson, as `router-fixture.ts` does. |
| `src/content/define.switch.test.ts`, `src/art/scenes/switch.test.ts`, `src/scenes/drivers/switch.test.ts` (new) | Checks 1 to 12 of §8, as tests. |

The lesson file itself (`src/content/lessons/switch.ts`) is the author's; it uses `figure: 'switch'`, the panel of §3.4 and the events of §3.3.

## 6. Card art

`spot('switch')`, drawn at 528 × 372 like every spot (`prototypes/d13-switch-spot.svg`). One plate, engraved **FIVE PORTS · MAC TABLE**. On it, the switch alone, large: a box 168 × 44, 26 tall on 2.4 feet, vents along its top. Its front face carries five sockets (18 × 13, centres x −56, −28, 0, 28, 56), each numbered 1 to 5 with a light; only port 2's light is on. Plugs sit in ports 1 to 4, and their four cables bend away to the plate's front-left edge; port 5 is free. Port 2's plug is the one lit part. Label: "A switch with five numbered ports along its front. Cables are plugged into ports 1 to 4 and run to the edge of the plate; port 5 is free. The plug in port 2 is lit, and the light over port 2 is on."

It is the family of its neighbours on the route (MAC Address's card, ARP's): one plate, one solid object, one lit part. The prototype's **Card art** page shows it beside both, and on Networking's route as stop 05, at 1440 and 375, in both themes.

## 7. Copy

Facts come from the outline (§2 of the analyst's report) word for word; the lesson's sentences are the author's. Marked **new words** where the design wrote them.

| Where | Words | Source |
|---|---|---|
| Callout names | Router, Laptop, TV, Printer | outline |
| Callout MACs | 00:00:5E:00:53:01, …:10, …:12, …:13 | outline |
| Callout port chip | `PORT 1` … `PORT 5` | **new words** |
| Switch callout | Switch / keeps the MAC table | **new words** |
| Verdicts | Sent it, Keeps it, Ignores it | MAC Address's (`drivers/dhcp.ts`) |
| Tags | FRAME, COPY, TO ALL | outline |
| Plate engraving | HOME NETWORK · ONE SWITCH, FIVE PORTS | **new words** |
| Port numbers on the switch | 1 2 3 4 5 | outline |
| Figure's description | "A wired home network on one plate: a switch with five numbered ports along its front, and a router, a laptop, a TV and a printer, each plugged into one port by its own cable. Port 5 is free. Beside each device, its name, its port and its MAC address." | **new words** |
| Table title, empty | MAC table; Empty: the switch hasn’t learned any address yet | outline |
| Table `by` | kept by the switch | **new words** (the outline's "the switch", in the form Router's table uses: "kept by your laptop") |
| Table columns | Port, MAC address | outline, ruling 4 |
| Scene title | Four devices on one switch | **new words** (placeholder for the author) |
| Card plate | FIVE PORTS · MAC TABLE | **new words** |
| Card description | as §6 | **new words** |
| Log legend, info lines, table summaries, facts, narratives | as §3.3 | outline (the table summaries in the prototype, "The switch writes … beside port 2." and step 5's "The switch now has 00:00:5E:00:53:10 on port 5.", are placeholders for the author) |

Sentence case throughout; no time figures; nothing scored.

## 8. Acceptance checks

Each is a test in the patch (file in brackets) or a look in the browser (marked **look**).

1. `drawFigure('switch')`'s root has `data-figure="switch"`, `role="img"`, a non-empty `aria-label` (the description of §7) and no grain. (`index.test.ts`)
2. The figure has every part the driver reaches for: `sw-led-1`…`5`; `sw-port-`, `sw-v-` for each device; `sw-trace-router-1`, `-laptop-2`, `-tv-3`, `-printer-4`, `-laptop-5`; `sw-tag-frame`, `-to-all`, `-copy-1`…`3`, `-to-all-1`…`3`; `sw-cable-laptop-5` and `sw-plug-laptop-5` drawn with `display="none"`; the status lights `sw-led-laptop`, `sw-led-tv`, `sw-led-printer`, `sw-rt-led-1`, `sw-rt-led-2`, off; nothing with `sw-glow`. The driver throws, naming the id, when one is missing. (`switch.test.ts`)
3. `prototypes/d13-switch-part-figure.svg` is `drawSwitch().svg` with the `xmlns` and a newline. (`art/scenes/switch.test.ts`)
4. The data has exactly the five cables, each more than three finite points. (`art/scenes/switch.test.ts`)
5. `spot('switch')` hashes to `36be892c…3fdf`, and `prototypes/d13-switch-spot.svg` is it with a newline. (`figures.test.ts`)
6. The spec's unit passes `checkStructure`. A frame from `all`, to its own sender, or to a place not on the figure fails; a broadcast not to `all`, a frame to `all` that is not a broadcast, and a broadcast with `flood` fail; `flood` with an arg fails; `plug` with any arg but `laptop 5`, or with none, fails; `plug` on a note fails; any start fails. (`define.switch.test.ts`)
7. Step 1 settled: traces on cables laptop-2, router-1, tv-3, printer-4 and none on laptop-5; lights 1 to 4; verdicts laptop Sent it, printer Keeps it, router and TV Ignores it; only the printer's status light on. (`drivers/switch.test.ts`)
8. Step 2 settled: trace on laptop-2 only; light 2 only; no verdict anywhere. (`drivers/switch.test.ts`)
9. Step 3 settled: traces printer-4 and laptop-2 only; lights 2 and 4; printer Sent it, laptop Keeps it; router and TV have no `data-v` (no copy, not "Ignores it"). (`drivers/switch.test.ts`)
10. Step 4 settled: four traces; router Sent it; laptop, TV and printer Keeps it, their three status lights on. Step 5 settled: laptop's cable at 5 shown and at 2 hidden; chip `PORT 5` with class `moved`; traces laptop-5 and router-1; lights 1 and 5; router Keeps it, laptop Sent it. Then step 4 again puts the cable back at 2 and the chip back to `PORT 2`. (`drivers/switch.test.ts`)
11. For each frame (steps 1, 3, 4, 5), `show(before)` then `play(event, before)` under reduced motion ends with the same traces, lights, laptop cable and chip as `show(after)`. (`drivers/switch.test.ts`)
12. Durations at 1×: a frame 2,950 ms; step 5's frame 4,150 ms; each MAC table event 900 ms. (`drivers/switch.test.ts`)
13. "Keeps it" reaches 4.5:1 on the figure background in both themes. (`green-text.test.ts`)
14. Stopped mid-play (Pause, Next or a step change while a tag rides), the figure shows the settled picture of where the reader now is, with no tag left on a cable. The builder adds this with the panel's abort, as `dhcp.frames.test.ts` does.
15. **Look**, at 1440 × 900 and 375 × 812, light and dark, steps 1 to 5 played and opened: during step 1's out phase three COPY tags ride at once, none on the laptop's cable and none toward port 5; during step 3's, one FRAME tag rides to the laptop and the router's and TV's cables stay plain; step 5 begins with the laptop's cable moving from port 2 to port 5; no callout touches another or a device; the page never scrolls sideways; the Table tab on a phone does not scroll sideways at any step.
16. **Look**: the track page (once the lesson exists) shows the switch spot on stop 05 at the card's size, in both themes.
17. Every lesson page's JavaScript stays within 200 KB gzipped (`check-budgets.mjs`; 105.5 KB with the patch).

## 9. What the outline asked that is not drawn

- **The Device column** in the MAC table: ruling 4 drops it. The callouts' port chips carry device and port together instead.
- **The sequence view**: `views: ['network']`, as the outline says.
- **Ageing**: not a step (outline); the table keeps every row to the end.
- **A frame dropped because its destination is on the port it came in on** (step 3's optional Go deeper): words only; the figure has no case for it, and the validator lets no frame go to its own sender.

## 10. Open questions for the owner

1. **Callout text on a phone is 6.7px** (MAC Address's is 7.0px; D12 accepted 7px for its verdicts). Recommendation: accept; the table, log and narrative say the same at full size. The other way, dropping the switch's own callout at under 640px, wins 5% (about 7.0px) and loses the line that ties the table to the box.

## 11. How the prototype was made

The page is D12's prototype shell (the site's CSS, the console, the table and the route as built after job 13) with the patch's figure, `switch.css`, the site's engine (`deriveState`, `sceneViewOf`) and the patch's own `switchDriver`, bundled with esbuild into the file. The lesson data is the outline's Watch story (§3.3). The spot and the figure in the page are `spot('switch')` and `drawSwitch()` as the patch draws them. The page runs from the file system with no network.



## Appendix A. The patch

Apply with `git apply` on `job14/batch` at `9807155` (checked with `git apply --check`). Then `npm test` and `npm run build` pass.

````diff
diff --git a/src/art/figures/figures.test.ts b/src/art/figures/figures.test.ts
index 4ba78f7..6c8600a 100644
--- a/src/art/figures/figures.test.ts
+++ b/src/art/figures/figures.test.ts
@@ -66,6 +66,7 @@ const EXPECTED: Record<string, string> = {
   'spot:learn': 'f48b830a8519b1d2c7f2d69bdc5fd5ea12a334eb33555ee9b71e0c859dedf66e',
   'spot:practice': '3d5e9a1240082e5e5d920c4b69bae94c3ea2be1bf0e4394e6e4de204c794dc30',
   'spot:subnet': '841d398bd78c4e35fc5f47fea35060e97ddad297312b9138429c778cc083ba1b',
+  'spot:switch': '36be892c80e718a900d2b7a5ce39990fb433a798e7827e1b24aeb441f54a3fdf',
   'spot:dhcp': 'f78beddc71e112c7aa568d07a3a9d4e24a5acdc31dcc58147b3ab59421177a21',
   'spot:firewall': 'c7f5b530c8e16a31768015820a41134c4c55f6ad47e6d6e1d5cf6f857340f368',
   // Drawn for Lesson 01, OSI Model, on 2026-11-08; pinned from its own first approved render.
diff --git a/src/art/figures/spots.ts b/src/art/figures/spots.ts
index 5f9625b..66a6510 100644
--- a/src/art/figures/spots.ts
+++ b/src/art/figures/spots.ts
@@ -357,10 +357,36 @@ function tcpUdpSpot() {
   return figure("tcp-udp", "TCP · UDP", out.join(""), "Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back.");
 }
 
-export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp'] as const;
+// Switch: a five-port switch, four cables plugged in and port 5 free. Port 2's plug is lit, its light on: the port the
+// switch has just learned a device on.
+function switchSpot() {
+  const out = [], B = { x: -84, y: -50, w: 168, d: 44, r: 3 }, FT = 2.4, BH = 26, F = B.y + B.d, T = FT + BH;
+  const PX = [-56, -28, 0, 28, 56], PZ = 6, PW = 18, PH = 13;
+  // Four cables out of the front, bending away to the plate's front-left edge.
+  out.push(tubeOf([0, 1, 2, 3].flatMap((i) => {
+    const x = PX[i], y = F + 14 + i * 9;
+    return tubePieces([[x, F + 4, PZ + 4], [x, F + 9, 1.8], [x, y - 4, 1.8], [x - 4, y, 1.8], [-112, y, 1.8]], 1.9, P, { maxLength: 16 });
+  })));
+  for (const [x, y] of byDepth(k.corners(B, 8))) out.push(S(k.cylinder(x, y, 3, 0, FT, P, 16), { tone: "lo" }));
+  out.push(S(k.slabOf(B, FT, BH, P, 5, 0.9), { tone: "hi", inner: L(k.sideSeam(B, FT + 3.4, P, 5), { tone: "faint" }) }));
+  // Vents along the top's back half.
+  out.push(lines(Array.from({ length: 18 }, (_, i) => [[B.x + 34 + i * 6.4, B.y + 6], [B.x + 34 + i * 6.4, B.y + 18]]), T));
+  // The face: each port a socket with its number and its light. Only port 2's light is on.
+  let face = "";
+  PX.forEach((x, i) => {
+    face += rect("lm-inlay", x - PW / 2 - 1.2, PZ - 1.2, PW + 2.4, PH + 2.4, 1.4) + rect("lm-void", x - PW / 2, PZ, PW, PH, 0.8) + rect("lm-slot", x - 4, PZ, 8, 3, 0.4);
+    face += `<text class="lm-rule" x="${n1(x - PW / 2)}" y="${n1(-(PZ + PH + 3.4))}">${i + 1}</text><circle class="lm-led${i === 1 ? " on" : ""}" cx="${n1(x + PW / 2 - 2)}" cy="${n1(-(PZ + PH + 5))}" r="1.6"/>`;
+  });
+  out.push(onFaceY(F, face));
+  // The plugs in ports 1 to 4; port 2's is the lit part.
+  for (const i of [0, 1, 2, 3]) out.push(S(k.slabOf({ x: PX[i] - 7, y: F, w: 14, d: 8, r: 1.2 }, PZ + 1.6, PH - 3.2, P, 3, 0.5), { tone: i === 1 ? "hi" : "mid", lit: i === 1 }));
+  return figure("switch", "FIVE PORTS · MAC TABLE", out.join(""), "A switch with five numbered ports along its front. Cables are plugged into ports 1 to 4 and run to the edge of the plate; port 5 is free. The plug in port 2 is lit, and the light over port 2 is on.");
+}
+
+export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'switch'] as const;
 export type SpotKind = (typeof SPOTS)[number];
 
-const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot };
+const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot, switch: switchSpot };
 
 /** A small figure, cropped close to its plate. */
 export const spot = (kind: SpotKind): string => DRAW[kind]();
diff --git a/src/art/scenes/index.test.ts b/src/art/scenes/index.test.ts
index f72bd57..2b822b5 100644
--- a/src/art/scenes/index.test.ts
+++ b/src/art/scenes/index.test.ts
@@ -7,7 +7,7 @@ import type { FigureId } from './types';
 // and has no film grain (ruling R2).
 test('every scene figure draws with data-figure, role="img", a non-empty aria-label and no grain', () => {
   const ids = figureIdSchema.options as readonly FigureId[];
-  expect([...ids].sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet']);
+  expect([...ids].sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet', 'switch']);
   for (const id of ids) {
     const { svg } = drawFigure(id);
     const root = /^<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
diff --git a/src/art/scenes/index.ts b/src/art/scenes/index.ts
index 14a7a21..40783cb 100644
--- a/src/art/scenes/index.ts
+++ b/src/art/scenes/index.ts
@@ -3,6 +3,7 @@ import { drawFirewall } from './firewall';
 import { drawNetMap } from './net-map';
 import { drawOsi } from './osi';
 import { drawSubnet } from './subnet';
+import { drawSwitch } from './switch';
 import type { DrawnFigure, FigureId } from './types';
 
 /** How each scene figure is drawn. Every figure a lesson can name has its drawer here, and the compiler checks it. */
@@ -12,6 +13,7 @@ const DRAW: Record<FigureId, () => DrawnFigure> = {
   firewall: drawFirewall,
   'net-map': drawNetMap,
   osi: drawOsi,
+  switch: drawSwitch,
 };
 
 /** Draws a scene figure at build time: its SVG markup and the data its driver reads. */
diff --git a/src/art/scenes/parts.test.ts b/src/art/scenes/parts.test.ts
index 01875c3..1edc887 100644
--- a/src/art/scenes/parts.test.ts
+++ b/src/art/scenes/parts.test.ts
@@ -4,7 +4,7 @@ import { FIGURE_PARTS } from './parts';
 
 test('FIGURE_PARTS has an entry for each figure id the schema accepts, and no other', () => {
   expect(Object.keys(FIGURE_PARTS).sort()).toEqual([...figureIdSchema.options].sort());
-  expect(Object.keys(FIGURE_PARTS).sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet']);
+  expect(Object.keys(FIGURE_PARTS).sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet', 'switch']);
 });
 
 test('every figure’s parts are well formed', () => {
diff --git a/src/art/scenes/parts.ts b/src/art/scenes/parts.ts
index 1afec2c..b73c6b4 100644
--- a/src/art/scenes/parts.ts
+++ b/src/art/scenes/parts.ts
@@ -1,5 +1,6 @@
 import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_ROUTERS, plateSites } from './net-map-layers';
 import { OSI_CUE_ARGS, OSI_ROUTES, OSI_WORDS } from './osi-stacks';
+import { SWITCH_PLACES, SWITCH_PLUG_ARGS, SWITCH_ROUTES } from './switch-parts';
 import type { FigureId, FigureParts } from './types';
 
 /**
@@ -79,4 +80,16 @@ export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
     start: false,
     labels: true,
   },
+  // Switch (D13b): four devices on one switch. A frame rides from one device to another, or to `all` (a broadcast).
+  // `flood` sends a frame for one device out of every other port (no match in the table); a broadcast floods by
+  // itself. `plug` moves the laptop's cable to port 5 before its frame is sent (src/scenes/drivers/switch.ts).
+  switch: {
+    places: SWITCH_PLACES,
+    cues: { flood: 'flag', plug: 'text' },
+    args: { plug: SWITCH_PLUG_ARGS },
+    routes: SWITCH_ROUTES,
+    layers: [],
+    board: false,
+    start: false,
+  },
 };
diff --git a/src/art/scenes/switch-parts.ts b/src/art/scenes/switch-parts.ts
new file mode 100644
index 0000000..d37c259
--- /dev/null
+++ b/src/art/scenes/switch-parts.ts
@@ -0,0 +1,30 @@
+/**
+ * The Switch figure's names and numbers, shared by its drawing (switch.ts), its driver and the lesson validator, which
+ * must agree on them. Kept out of switch.ts so the driver does not take the drawing's code into the page.
+ */
+
+/** The devices on the figure, each with the MAC address its callout draws: the MAC Address lesson's example addresses. */
+export const SWITCH_DEVICES = {
+  router: '00:00:5E:00:53:01',
+  laptop: '00:00:5E:00:53:10',
+  tv: '00:00:5E:00:53:12',
+  printer: '00:00:5E:00:53:13',
+} as const;
+export type SwitchDevice = keyof typeof SWITCH_DEVICES;
+
+/** The port each device is plugged into as a unit starts. Port 5 is free. */
+export const SWITCH_PLUGS: Readonly<Record<SwitchDevice, number>> = { router: 1, laptop: 2, tv: 3, printer: 4 };
+
+/** The figure's places: the four devices, and `all`, where a broadcast is addressed (to everyone). */
+export const SWITCH_PLACES = [...Object.keys(SWITCH_DEVICES), 'all'] as const;
+
+/** The only re-plug the figure draws: the laptop's cable from port 2 to port 5 (the `plug` cue's one arg). */
+export const SWITCH_PLUG_ARGS = ['laptop 5'] as const;
+
+/** The ways a frame rides: from any device to any other, or to everyone (`all`). Nothing is sent from `all`. */
+const DEVICES = Object.keys(SWITCH_DEVICES) as SwitchDevice[];
+export const SWITCH_ROUTES = [...DEVICES.flatMap((a) => DEVICES.filter((b) => b !== a).map((b) => `${a}>${b}`)), ...DEVICES.map((a) => `${a}>all`)];
+
+/** The figure's description, for screen readers. */
+export const SWITCH_DESCRIPTION =
+  'A wired home network on one plate: a switch with five numbered ports along its front, and a router, a laptop, a TV and a printer, each plugged into one port by its own cable. Port 5 is free. Beside each device, its name, its port and its MAC address.';
diff --git a/src/art/scenes/switch.css b/src/art/scenes/switch.css
new file mode 100644
index 0000000..c944298
--- /dev/null
+++ b/src/art/scenes/switch.css
@@ -0,0 +1,33 @@
+/* The Switch scene's own parts (src/art/scenes/switch.ts). The callouts sit on the page's figure background, so they
+   take the site's ink and line tokens and follow the theme; the parts on the plate take the lumen finish's tokens and
+   stay the same in both themes. The callouts and verdicts are MAC Address's (dhcp.css), so the two scenes read alike. */
+.sw .sw-call .sw-name { font: 700 11.5px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; fill: var(--ink-strong); }
+.sw .sw-call .sw-sub { font: 400 13px/1 var(--sans); fill: var(--muted); }
+.sw .sw-call .sw-addr { font: 500 12.5px/1 var(--mono); fill: var(--ink); }
+.sw .sw-port { fill: var(--muted); font-weight: 700; }
+.sw .sw-port.moved { fill: var(--accent); }
+.sw .sw-lead { fill: none; stroke: var(--line-strong); stroke-width: 1px; }
+.sw .sw-lead-dot { fill: var(--muted); }
+.sw .sw-num { font: 700 4.6px var(--mono); fill: var(--anatomy-mid); }
+.sw .sw-pin { fill: #b08a3a; }
+.sw .sw-tag { will-change: transform; }
+.sw .sw-tag-t { font: 700 4.6px var(--mono); fill: color-mix(in srgb, var(--lit-b) 30%, #000); letter-spacing: .03em; }
+/* A frame's way along a cable: bright while it rides, a quiet trace once it has landed. */
+.sw .sw-trace { fill: none; stroke: var(--lit-a); stroke-width: 2px; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; opacity: 0; }
+.sw .sw-trace[data-on="ride"] { opacity: .95; filter: drop-shadow(0 0 3px var(--lit-b)); }
+.sw .sw-trace[data-on="trace"] { opacity: .5; stroke: var(--lit-b); stroke-width: 3px; }
+/* The cable the laptop leaves behind as it moves: a faint ghost, gone once the move is done. */
+.sw .sw-cable[data-ghost] { opacity: .35; }
+/* Each device's verdict on the copy it got (MAC Address's): sent the ink, kept a filled square in the done green with
+   the words in it, ignored a muted outline with a slash. A device that got no copy says nothing. */
+.sw .sw-v-t { font: 500 13px/1 var(--sans); fill: var(--muted); }
+.sw .sw-v-mark { fill: none; stroke: var(--muted); stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
+.sw .sw-v:not([data-v]) { display: none; }
+.sw .sw-v[data-v="keeps"] .sw-v-mark { fill: var(--allowed); stroke: var(--allowed); }
+.sw .sw-v[data-v="keeps"] .sw-v-t { fill: var(--allowed-text); font-weight: 700; }
+.sw .sw-v[data-v="sent"] .sw-v-mark { fill: var(--ink-strong); stroke: var(--ink-strong); }
+.sw .sw-v[data-v="sent"] .sw-v-t { fill: var(--ink); }
+.sw .sw-v-slash { display: none; fill: none; stroke: var(--muted); stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
+.sw .sw-v[data-v="ignores"] .sw-v-slash { display: inline; }
+/* While the driver's show settles the figure, the lights change at once (src/scenes/drivers/switch.ts). */
+.sw[data-settling] .lm-led { transition: none; }
diff --git a/src/art/scenes/switch.test.ts b/src/art/scenes/switch.test.ts
new file mode 100644
index 0000000..85cbc9c
--- /dev/null
+++ b/src/art/scenes/switch.test.ts
@@ -0,0 +1,41 @@
+// @ts-expect-error - no @types/node in this project; vitest runs under node
+import { readFileSync } from 'node:fs';
+import { expect, test } from 'vitest';
+import { drawSwitch, type SwitchSceneData } from './switch';
+import { SWITCH_DEVICES, SWITCH_PLUGS } from './switch-parts';
+
+// D13b (prototypes/d13-switch.md §5 and §8): the figure carries every part its driver reaches for, by id.
+
+test('prototypes/d13-switch-part-figure.svg is the figure the code draws', () => {
+  const { svg } = drawSwitch();
+  const file: string = readFileSync('prototypes/d13-switch-part-figure.svg', 'utf8');
+  expect(file).toBe(`${svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')}\n`);
+});
+
+test('the figure has each port light, each device’s port chip and verdict, each cable’s trace and the tags', () => {
+  const { svg } = drawSwitch();
+  for (let n = 1; n <= 5; n++) expect(svg).toContain(`id="sw-led-${n}"`);
+  // Each device's status light, off at rest; no lit screen or paper slot.
+  for (const id of ['sw-led-laptop', 'sw-led-tv', 'sw-led-printer', 'sw-rt-led-1', 'sw-rt-led-2']) expect(svg).toMatch(new RegExp(`class="lm-led" id="${id}"`));
+  expect(svg).not.toMatch(/sw-glow/);
+  for (const d of Object.keys(SWITCH_DEVICES)) {
+    expect(svg).toContain(`id="sw-port-${d}"`);
+    expect(svg).toContain(`id="sw-v-${d}"`);
+    expect(svg).toContain(SWITCH_DEVICES[d as keyof typeof SWITCH_DEVICES]);
+  }
+  for (const [d, n] of [...Object.entries(SWITCH_PLUGS), ['laptop', 5]]) expect(svg).toContain(`id="sw-trace-${d}-${n}"`);
+  for (const id of ['frame', 'to-all', 'copy-1', 'copy-2', 'copy-3', 'to-all-1', 'to-all-2', 'to-all-3']) expect(svg).toContain(`id="sw-tag-${id}"`);
+  // The moved cable and its plug are drawn, hidden, until step 5's `plug` cue.
+  expect(svg).toMatch(/id="sw-cable-laptop-5"[^>]*display="none"/);
+  expect(svg).toMatch(/id="sw-plug-laptop-5"[^>]*display="none"/);
+});
+
+test('the data has one cable per plug, each a line from the device to its port', () => {
+  const { data } = drawSwitch();
+  const { cables } = data as SwitchSceneData;
+  expect(Object.keys(cables).sort()).toEqual(['laptop:2', 'laptop:5', 'printer:4', 'router:1', 'tv:3']);
+  for (const line of Object.values(cables)) {
+    expect(line.length).toBeGreaterThan(3);
+    for (const p of line) expect(p.every(Number.isFinite)).toBe(true);
+  }
+});
diff --git a/src/art/scenes/switch.ts b/src/art/scenes/switch.ts
new file mode 100644
index 0000000..b037265
--- /dev/null
+++ b/src/art/scenes/switch.ts
@@ -0,0 +1,282 @@
+// @ts-nocheck -- drawing code in the family's style; the checksum test in switch.test.ts pins its output, so it is not re-typed line by line.
+// The Switch lesson's scene: one wired home network on a plate. A five-port switch stands at the back, and four
+// devices are plugged into it by cables: the router (port 1), the laptop (2), the TV (3) and the printer (4); port 5
+// is free. Its ids carry an `sw-` prefix, so they stay unique on the page. The driver (src/scenes/drivers/switch.ts)
+// rides the tags along the cables, lights the ports, swaps the laptop's cable from port 2 to port 5 and writes each
+// device's verdict; this module draws them and says where they are.
+import type { DrawnFigure } from './types';
+import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
+import { SWITCH_DESCRIPTION, SWITCH_DEVICES, SWITCH_PLUGS } from './switch-parts';
+import './switch.css';
+
+/** What the driver reads: the cables as lines on screen, where each tag stops, and the tags' sizes. */
+export interface SwitchSceneData {
+  /**
+   * Each cable's way on screen, in the figure's own frame, from the device's socket (first point) to the switch's
+   * port (last point), at the height the tags ride. Keyed by the device and its port, `laptop:2`.
+   */
+  cables: Record<string, [number, number][]>;
+}
+
+const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
+const PL = { x: -116, y: -84, w: 232, d: 168, r: 10 };
+
+// The switch: a long low box at the back, its five ports on the front face (y = SW.y + SW.d).
+const SW = { x: -62, y: -66, w: 116, d: 30, r: 3 }, SW_FOOT = 1.6, SW_H = 19;
+const SW_F = SW.y + SW.d, SW_T = SW_FOOT + SW_H;
+const PORT = { w: 13, h: 10, z: 3.4 }, PORT_PITCH = 19.5;
+/** Each port's centre along the face (x), 1 to 5. */
+const PORT_X = [1, 2, 3, 4, 5].map((n) => SW.x + 24 + (n - 1) * PORT_PITCH);
+const PORT_Z = PORT.z + PORT.h / 2;
+
+// The devices.
+const RT = { x: -112, y: -70, w: 40, d: 24, r: 4 }, RT_Z = 2, RT_T = RT_Z + 10;
+const LB = { x: -106, y: 30, w: 54, d: 38, r: 4 }, LZ = 3.6, LID_H = 36;
+const TV = { x: 26, y: 64, w: 50, d: 3, r: 1 }, TV_Z = 7, TV_H = 30, TVF = { x: 41, y: 59, w: 20, d: 13, r: 2 };
+const PR = { x: 68, y: -10, w: 40, d: 32, r: 3 }, PR_H = 16;
+
+// One camera for the scene. The frame is fitted afterwards to the plate and its callouts, which sit off the plate,
+// on the page's own background, so they read in both themes.
+const P = k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 });
+const V = G.viewOf(P);
+const at = (p) => k.iso(p, P);
+const depth = (p) => k.depthOf(p, P);
+const byDepth = (list) => [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
+const onFaceY = (Y, inner) => `<g transform="${k.sideMatrix([0, Y], 0, P, "left")}">${inner}</g>`;
+const onFaceX = (X, inner) => `<g transform="${k.sideMatrix([X, 0], 0, P, "right")}">${inner}</g>`;
+const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
+const rect = (cls, u, z, w, h, rx = 0.6, extra = "") => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"${extra}/>`;
+const dot = ([x, y], cls, r = 1.2, extra = "") => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"${extra}/>`;
+
+// ---------- The plate ----------
+function plate(label) {
+  const under = `<path class="lm-pool" d="${k.ring(0, 0, 250, FLOOR, P, 120)}"/><path class="iso-halo" d="${k.haloOf(PL, FLOOR, PLATE_H, P)}"/>`;
+  const over = [];
+  for (const [x, y] of byDepth(k.corners(PL, 18))) {
+    over.push(S(k.cylinder(x, y, 6, FLOOR, 1.3, P, 28), { tone: "lo" }));
+    over.push(S(k.cylinder(x, y, 4.6, FLOOR + 1.3, FOOT_H - 1.3, P, 28), { tone: "mid" }));
+  }
+  over.push(S(k.slabOf(PL, -PLATE_H, PLATE_H, P, 8, 1.3), { tone: "mid", inner: L(k.sideSeam(PL, -PLATE_H + 2.2, P, 8), { tone: "faint" }) }));
+  over.push(L(k.planOutline(k.insetPlan(PL, 6), 0, P), { tone: "lo" }));
+  const screws = k.corners(PL, 11);
+  over.push(L(screws.map(([x, y]) => k.ring(x, y, 2.3, 0, P, 18)).join(""), { tone: "lo" }));
+  over.push(D(screws.map(([x, y]) => k.iso([x, y, 0], P)), { size: 0.6, tone: "mid" }));
+  over.push(k.faceTextSvg(k.sideMatrix([PL.x + PL.w - 22, PL.y + PL.d], -3.2, P, "left"), label, { size: 3.6, tone: "mid", anchor: "end" }));
+  return { under, over: over.join("") };
+}
+
+// ---------- The switch: five ports in a row, a light over each, and its number ----------
+function theSwitch() {
+  const out = [];
+  for (const [x, y] of byDepth(k.corners(SW, 6))) out.push(S(k.cylinder(x, y, 2.4, 0, SW_FOOT, P, 16), { tone: "lo" }));
+  out.push(S(k.slabOf(SW, SW_FOOT, SW_H, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(SW, SW_FOOT + 2.6, P, 5), { tone: "faint" }) }));
+  // Vents along the top's back half.
+  let vents = "";
+  for (let i = 0; i < 14; i++) vents += k.planOutline({ x: SW.x + 30 + i * 5.4, y: SW.y + 5, w: 2.2, d: 10, r: 1.1 }, SW_T, P, 3);
+  out.push(L(vents, { tone: "lo" }));
+  // The face: a power light at the left end, then each port: its number and its light over a socket.
+  let face = `<circle class="lm-led on" cx="${n1(SW.x + 8)}" cy="${n1(-(SW_T - 5))}" r="1.3"/>` + rect("lm-slot", SW.x + 5, SW_T - 9.5, 7, 1.4, 0.7);
+  PORT_X.forEach((cx, i) => {
+    const x0 = cx - PORT.w / 2;
+    face += rect("lm-inlay", x0 - 1, PORT.z - 1, PORT.w + 2, PORT.h + 2, 1.2);
+    face += rect("lm-void", x0, PORT.z, PORT.w, PORT.h, 0.6);
+    // The latch's notch at the socket's foot, and the gold contacts at its top.
+    face += rect("lm-slot", cx - 3, PORT.z - 0.01, 6, 2.4, 0.3);
+    for (let c = 0; c < 6; c++) face += rect("sw-pin", x0 + 2.2 + c * 1.6, PORT.z + PORT.h - 2.4, 0.8, 2, 0.1);
+    face += `<text class="sw-num" x="${n1(x0 - 0.4)}" y="${n1(-(PORT.z + PORT.h + 2.2))}">${i + 1}</text>`;
+    face += `<circle class="lm-led" id="sw-led-${i + 1}" cx="${n1(cx + PORT.w / 2 - 1.6)}" cy="${n1(-(PORT.z + PORT.h + 4.2))}" r="1.3"/>`;
+  });
+  out.push(onFaceY(SW_F, face));
+  return out.join("");
+}
+
+// ---------- The router: a wired box with its lights, and one socket the cable comes from ----------
+function router() {
+  const out = [], RF = RT.y + RT.d;
+  for (const [x, y] of byDepth(k.corners(RT, 5))) out.push(S(k.cylinder(x, y, 2, 0, RT_Z, P, 16), { tone: "lo" }));
+  out.push(S(k.slabOf(RT, RT_Z, RT_T - RT_Z, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(RT, RT_Z + 3, P, 5), { tone: "faint" }) }));
+  for (let i = 0; i < 4; i++) out.push(L(k.planOutline({ x: RT.x + 7 + i * 6, y: RT.y + 5, w: 2.4, d: RT.d - 10, r: 1.2 }, RT_T, P, 3), { tone: "lo" }));
+  const face = [0, 1, 2].map((i) => `<circle class="lm-led${i === 0 ? " on" : ""}"${i > 0 ? ` id="sw-rt-led-${i}"` : ""} cx="${n1(RT.x + 6 + i * 5)}" cy="${n1(-(RT_Z + 6))}" r="1.1"/>`).join("")
+    + rect("lm-inlay", RT.x + RT.w - 14, RT_Z + 1.6, 10, 6.4, 1) + rect("lm-void", RT.x + RT.w - 13, RT_Z + 2.4, 8, 4.8, 0.5);
+  out.push(onFaceY(RF, face));
+  return out.join("");
+}
+
+// ---------- The laptop: base, keys, and its lid, the screen facing you ----------
+function laptop() {
+  const out = [];
+  out.push(S(k.slabOf(LB, 0, LZ, P, 5, 0.8), { tone: "hi" }));
+  // Its status light, on the base's front: on while it keeps a frame.
+  out.push(onFaceY(LB.y + LB.d, `<circle class="lm-led" id="sw-led-laptop" cx="${n1(LB.x + LB.w - 6)}" cy="${n1(-LZ / 2)}" r="1.1"/>`));
+  const keysX = 9, keysY = 3, pitch = (LB.w - 10) / keysX;
+  let keys = "";
+  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 7 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LZ, P, 3);
+  out.push(L(keys, { tone: "lo" }));
+  out.push(L(k.planOutline({ x: LB.x + LB.w / 2 - 9, y: LB.y + 9 + keysY * pitch, w: 18, d: LB.d - 13 - keysY * pitch, r: 1.2 }, LZ, P, 3), { tone: "lo" }));
+  // Its network socket, on the right side, where the cable goes in.
+  out.push(onFaceX(LB.x + LB.w, rect("lm-void", -(LB.y + 16), 0.8, 7, 2.2, 0.4)));
+  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.6, r: 1 };
+  out.push(S(k.slabOf(LID, LZ, LID_H, P, 3, 0.5), { tone: "hi" }));
+  const x0 = LID.x + 3, w = LID.w - 6, z0 = LZ + 3, h = LID_H - 6;
+  let scr = rect("lm-void", x0, z0, w, h, 0.8);
+  for (let i = 0; i < 3; i++) scr += rect("lm-slot", x0 + 4, z0 + h - 6 - i * 4.4, w - 12 - (i === 2 ? 10 : 0), 1.8, 0.8);
+  out.push(onFaceY(LID.y + LID.d, scr));
+  return out.join("");
+}
+
+// ---------- The TV: a panel on a foot ----------
+function tv() {
+  const out = [];
+  out.push(S(k.slabOf(TVF, 0, 1.6, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(TVF, 0.6, P, 3), { tone: "faint" }) }));
+  out.push(S(k.slabOf({ x: TVF.x + TVF.w / 2 - 3, y: TV.y - 2.2, w: 6, d: 2.2, r: 0.6 }, 1.6, TV_Z - 1.6, P, 3, 0.4), { tone: "mid" }));
+  out.push(S(k.slabOf(TV, TV_Z, TV_H, P, 3, 0.5), { tone: "hi" }));
+  const x0 = TV.x + 1.8, w = TV.w - 3.6, z0 = TV_Z + 2.6, h = TV_H - 4.4;
+  let scr = rect("lm-void", x0, z0, w, h, 0.6);
+  scr += rect("lm-slot", x0 + 3, z0 + h - 5, 14, 1.6, 0.8) + rect("lm-slot", x0 + 3, z0 + h - 8.4, 22, 1.6, 0.8);
+  // Its status light, under the screen: on while it keeps a frame.
+  scr += `<circle class="lm-led" id="sw-led-tv" cx="${n1(TV.x + TV.w - 3.4)}" cy="${n1(-(TV_Z + 1.3))}" r="1.1"/>`;
+  out.push(onFaceY(TV.y + TV.d, scr));
+  return out.join("");
+}
+
+// ---------- The printer: a box with a paper tray in, a sheet out on top, and a small panel ----------
+function printer() {
+  const out = [], PF = PR.y + PR.d;
+  out.push(S(k.slabOf(PR, 0, PR_H, P, 4, 0.8), { tone: "hi", inner: L(k.sideSeam(PR, 4, P, 4), { tone: "faint" }) }));
+  // The output tray, a shallow dip on top, with a sheet in it.
+  const TRAY = { x: PR.x + 5, y: PR.y + 5, w: PR.w - 16, d: PR.d - 12, r: 1.4 };
+  out.push(L(k.planOutline(TRAY, PR_H, P, 3), { tone: "lo" }));
+  out.push(S(k.slabOf({ x: TRAY.x + 3, y: TRAY.y + 2, w: TRAY.w - 6, d: TRAY.d - 4, r: 0.4 }, PR_H, 0.6, P, 3, 0.2), { tone: "hi", crease: "none" }));
+  // The panel at the top's right: a light and two buttons.
+  out.push(D([at([PR.x + PR.w - 6, PR.y + 8, PR_H]), at([PR.x + PR.w - 6, PR.y + 13, PR_H])], { size: 1.1, tone: "mid" }));
+  // The front: the paper drawer, its handle, and the slot the paper comes out of.
+  const face = rect("lm-slot", PR.x + 6, PR_H - 4.4, PR.w - 12, 1.6, 0.8) + rect("lm-inlay", PR.x + 4, 1.6, PR.w - 8, 7.4, 1) + rect("lm-slot", PR.x + PR.w / 2 - 6, 4.2, 12, 1.6, 0.8)
+    // Its status light, on the front: on while it keeps a frame.
+    + `<circle class="lm-led" id="sw-led-printer" cx="${n1(PR.x + PR.w - 4)}" cy="${n1(-(PR_H - 7.6))}" r="1.1"/>`;
+  out.push(onFaceY(PF, face));
+  return out.join("");
+}
+
+// ---------- Cables: each from a device's socket to its port, as it lies on the plate ----------
+const CABLE_R = 1.1, CABLE_Z = 1.3, TZ = CABLE_Z + CABLE_R + 2.2;
+/** Rounds each corner of a way on the plate, so a cable bends rather than kinks. */
+function bend(points, r = 6) {
+  const out = [points[0]];
+  for (let i = 1; i < points.length - 1; i++) {
+    const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
+    const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]);
+    const ra = Math.min(r, la / 2) / la, rc = Math.min(r, lc / 2) / lc;
+    const p0 = [b[0] + (a[0] - b[0]) * ra, b[1] + (a[1] - b[1]) * ra, b[2] + (a[2] - b[2]) * ra];
+    const p2 = [b[0] + (c[0] - b[0]) * rc, b[1] + (c[1] - b[1]) * rc, b[2] + (c[2] - b[2]) * rc];
+    for (let s = 0; s <= 6; s++) {
+      const t = s / 6, u = 1 - t;
+      out.push([0, 1, 2].map((j) => u * u * p0[j] + 2 * u * t * b[j] + t * t * p2[j]));
+    }
+  }
+  out.push(points.at(-1));
+  return out;
+}
+// The way each cable lies, from the device to the port: on the floor, then up to the socket at each end.
+const portAt = (n) => [PORT_X[n - 1], SW_F, PORT_Z];
+const LAP_OUT = [[LB.x + LB.w, LB.y + 19.5, 1.9], [LB.x + LB.w + 6, LB.y + 19.5, CABLE_Z]];
+const LIFT = CABLE_Z + 2.6;
+const ROUTES = {
+  "router:1": [[RT.x + RT.w - 9, RT.y + RT.d, RT_Z + 5], [RT.x + RT.w - 9, RT.y + RT.d + 5, CABLE_Z], [RT.x + RT.w - 9, -22, CABLE_Z], [PORT_X[0], -22, CABLE_Z], [PORT_X[0], SW_F + 6, CABLE_Z], portAt(1)],
+  "laptop:2": [...LAP_OUT, [PORT_X[1], LB.y + 19.5, CABLE_Z], [PORT_X[1], SW_F + 6, CABLE_Z], portAt(2)],
+  "tv:3": [[TVF.x + TVF.w / 2, TVF.y - 1, 2], [TVF.x + TVF.w / 2, TVF.y - 6, CABLE_Z], [TVF.x + TVF.w / 2, 30, CABLE_Z], [PORT_X[2], 30, CABLE_Z], [PORT_X[2], SW_F + 6, CABLE_Z], portAt(3)],
+  "printer:4": [[PR.x, PR.y + 16, 3], [PR.x - 6, PR.y + 16, CABLE_Z], [PORT_X[3], PR.y + 16, CABLE_Z], [PORT_X[3], SW_F + 6, CABLE_Z], portAt(4)],
+  // Step 5: the laptop's cable moved to port 5. It lies over the TV's and the printer's cables where it crosses them.
+  "laptop:5": [...LAP_OUT, [-30, LB.y + 19.5, CABLE_Z], [-30, 16, CABLE_Z], [-10, 16, CABLE_Z], [-4, 16, LIFT], [PORT_X[4], 16, LIFT], [PORT_X[4], 0, LIFT], [PORT_X[4], -8, CABLE_Z], [PORT_X[4], SW_F + 6, CABLE_Z], portAt(5)],
+};
+const lay = (route) => bend(route);
+const piecesOf = (route) => tubePieces(lay(route), CABLE_R, P, { maxLength: 12 });
+const tubesOf = (pieces) => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone: "hi" })).join("");
+// The plug at the port end: a short block with its boot, as it sits in the socket.
+function plug(n) {
+  const x = PORT_X[n - 1];
+  return S(k.slabOf({ x: x - 5, y: SW_F, w: 10, d: 6, r: 1 }, PORT.z + 1.2, PORT.h - 2.4, P, 3, 0.4), { tone: "mid" });
+}
+
+// ---------- The callouts: name, MAC address and what the device did with the frame ----------
+const TEXT_W = { "sw-name": 12 * 0.74, "sw-sub": 13 * 0.5, "sw-addr": 12.5 * 0.6 };
+function callout(boxes, anchor, [tx, ty], lines, { align = "start", id = "" } = {}) {
+  const [ax, ay] = at(anchor);
+  for (const [i, l] of lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
+  const ex = tx + (align === "end" ? 7 : -7);
+  const lead = `<path class="sw-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "sw-lead-dot", 2)}`;
+  const text = lines.map((l, i) => l.svg ? l.svg(tx, ty + i * 16, align) : `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
+  return `<g class="sw-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
+}
+// The name line: the device's name, then its port in a small square the driver changes when the cable moves.
+const named = (place, name) => ({
+  cls: "sw-name", text: `${name}   PORT 0`,
+  svg: (x, y, align) => {
+    const port = `<tspan class="sw-port" id="sw-port-${place}">PORT ${SWITCH_PLUGS[place]}</tspan>`;
+    return `<text class="sw-name" x="${n1(x)}" y="${n1(y)}" text-anchor="${align}">${name}  ${port}</text>`;
+  },
+});
+// A verdict, as MAC Address draws it: a small square, then the words, which the driver writes.
+const verdict = (place) => ({
+  cls: "sw-sub", text: "Ignores it   ",
+  svg: (x, y, align) => {
+    const mx = align === "end" ? x - 8 : x, tx = align === "end" ? x - 12 : x + 12;
+    return `<g class="sw-v" id="sw-v-${place}"><rect class="sw-v-mark" x="${n1(mx)}" y="${n1(y - 9)}" width="8" height="8" rx="1"/><path class="sw-v-slash" d="M${n1(mx + 1.5)} ${n1(y - 2.5)}l5 -5"/><text class="sw-v-t" x="${n1(tx)}" y="${n1(y)}" text-anchor="${align}"></text></g>`;
+  },
+});
+
+// ---------- Moving parts, drawn at the origin and moved by the driver ----------
+// A tag for each frame that can be on the cables at once: the frame itself, and up to three copies of it.
+const TAGS = [["frame", "FRAME"], ["to-all", "TO ALL"], ["copy-1", "COPY"], ["copy-2", "COPY"], ["copy-3", "COPY"], ["to-all-1", "TO ALL"], ["to-all-2", "TO ALL"], ["to-all-3", "TO ALL"]];
+const tag = (label) => {
+  const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
+  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="sw-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
+};
+
+// ---------- The scene ----------
+function sceneSvg() {
+  const pl = plate("HOME NETWORK · ONE SWITCH, FIVE PORTS");
+  const fixed = ["router:1", "tv:3", "printer:4"].flatMap((r) => piecesOf(ROUTES[r]));
+  // The laptop's two cables, each in a group of its own, so the driver can show the one in use.
+  const lap2 = `<g class="sw-cable" id="sw-cable-laptop-2">${tubesOf(piecesOf(ROUTES["laptop:2"]))}</g>`;
+  const lap5 = `<g class="sw-cable" id="sw-cable-laptop-5" display="none">${tubesOf(piecesOf(ROUTES["laptop:5"]))}</g>`;
+  // The plugs sit in front of the switch's face: the laptop's in port 2, or in port 5 once it has moved.
+  const plugs = [1, 3, 4].map(plug).join("") + `<g class="sw-cable" id="sw-plug-laptop-2">${plug(2)}</g><g class="sw-cable" id="sw-plug-laptop-5" display="none">${plug(5)}</g>`;
+  const things = [
+    { xy: [SW.x + SW.w / 2, SW.y + SW.d / 2], svg: theSwitch() + plugs },
+    { xy: [RT.x + RT.w / 2, RT.y + RT.d / 2], svg: router() },
+    { xy: [LB.x + LB.w / 2, LB.y + LB.d / 2], svg: laptop() },
+    { xy: [TV.x + TV.w / 2, TV.y + TV.d / 2], svg: tv() },
+    { xy: [PR.x + PR.w / 2, PR.y + PR.d / 2], svg: printer() },
+  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
+  // The traces: where a frame has been, along each cable, drawn by the driver; under the tags.
+  const traces = `<g id="sw-traces">${Object.keys(ROUTES).map((r) => `<polyline class="sw-trace" id="sw-trace-${r.replace(":", "-")}" points=""/>`).join("")}</g>`;
+  const tags = TAGS.map(([id, label]) => `<g class="sw-tag" id="sw-tag-${id}" style="opacity:0">${tag(label)}</g>`).join("");
+  const boxes = [];
+  const calls = [
+    callout(boxes, [RT.x + 4, RT.y + 8, RT_T], [66, 34], [named("router", "Router"), { cls: "sw-addr", text: SWITCH_DEVICES.router }, verdict("router")], { align: "end" }),
+    callout(boxes, [LB.x + 2, LB.y + LB.d, 0], [150, 262], [named("laptop", "Laptop"), { cls: "sw-addr", text: SWITCH_DEVICES.laptop }, verdict("laptop")], { align: "end" }),
+    callout(boxes, [TV.x + TV.w, TV.y, TV_Z + TV_H], [330, 266], [named("tv", "TV"), { cls: "sw-addr", text: SWITCH_DEVICES.tv }, verdict("tv")]),
+    callout(boxes, [PR.x + PR.w, PR.y + 6, PR_H], [458, 196], [named("printer", "Printer"), { cls: "sw-addr", text: SWITCH_DEVICES.printer }, verdict("printer")]),
+    callout(boxes, [SW.x + SW.w - 10, SW.y + 6, SW_T], [434, 60], [{ cls: "sw-name", text: "Switch" }, { cls: "sw-sub", text: "keeps the MAC table" }]),
+  ].join("");
+  // The tags are drawn at the plate's origin and moved to points on screen, so their group takes that origin off.
+  const O = at([0, 0, 0]);
+  // The frame: the plate, the tallest parts and every callout, with a margin.
+  const pts = [...k.boxCorners(PL, FLOOR, 0), [LB.x, LB.y, LZ + LID_H], [TV.x, TV.y, TV_Z + TV_H]].map(at);
+  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
+  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 18;
+  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
+  const body = pl.under + `<g class="lm-body">${pl.over}${tubesOf(fixed)}${lap2}${lap5}${traces}${things.map((t) => t.svg).join("")}<g id="sw-tags" transform="translate(${n1(-O[0])} ${n1(-O[1])})">${tags}</g></g>` + calls;
+  return `<svg data-figure="switch" class="lm-svg sw" viewBox="${vb.join(" ")}" role="img" aria-label="${SWITCH_DESCRIPTION}">${body}</svg>`;
+}
+
+// What the driver needs: each cable as a line on screen at the tags' height.
+function sceneData(): SwitchSceneData {
+  const flat = (route) => lay(route).map(([x, y, z]) => at([x, y, Math.max(z, CABLE_Z) + TZ - CABLE_Z]).map((v) => +v.toFixed(1)));
+  return { cables: Object.fromEntries(Object.entries(ROUTES).map(([name, route]) => [name, flat(route)])) };
+}
+
+/** The Switch scene, drawn at build time: its SVG and the data its driver reads. */
+export function drawSwitch(): DrawnFigure {
+  return { svg: sceneSvg(), data: sceneData() };
+}
diff --git a/src/art/scenes/types.ts b/src/art/scenes/types.ts
index e2e26bc..76a17dc 100644
--- a/src/art/scenes/types.ts
+++ b/src/art/scenes/types.ts
@@ -1,5 +1,5 @@
 /** The scene figures a lesson can be drawn on. Each one is drawn at build time and moved by its own driver. */
-export type FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map' | 'osi';
+export type FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map' | 'osi' | 'switch';
 
 /** What a lesson may name on a figure. The lesson validator checks every event against these. */
 export interface FigureParts {
diff --git a/src/content/define.switch.test.ts b/src/content/define.switch.test.ts
new file mode 100644
index 0000000..69682e9
--- /dev/null
+++ b/src/content/define.switch.test.ts
@@ -0,0 +1,47 @@
+import { expect, test } from 'vitest';
+import { checkStructure } from './define';
+import type { Lesson, MessageEvent } from './schema';
+import { switchFixture } from './switch-fixture';
+
+// D13b: the switch figure's parts and validator rules (prototypes/d13-switch.md §5), with the real figure parts.
+
+const issues = (mutate: (l: Lesson) => void): string => {
+  const lesson = switchFixture();
+  mutate(lesson);
+  return checkStructure(lesson).join('\n');
+};
+const event = (l: Lesson, id: string): MessageEvent => l.units[0]!.steps.flatMap((s) => s.events).find((e) => e.id === id) as MessageEvent;
+
+test('the spec’s Switch unit passes the structural check', () => {
+  expect(checkStructure(switchFixture())).toEqual([]);
+});
+
+test('a frame rides between two devices or to all, never from all and never to itself', () => {
+  expect(issues((l) => Object.assign(event(l, 's3-frame'), { from: 'all' }))).toContain('rides from "all" to "laptop", a way the switch figure does not have');
+  expect(issues((l) => Object.assign(event(l, 's3-frame'), { to: 'printer' }))).toContain('rides from "printer" to "printer"');
+  expect(issues((l) => Object.assign(event(l, 's3-frame'), { to: 'phone' }))).toContain('is sent to "phone", which the switch figure does not have');
+});
+
+test('a broadcast is sent to all, and a frame to all is a broadcast', () => {
+  expect(issues((l) => Object.assign(event(l, 's4-frame'), { to: 'tv' }))).toContain('is a broadcast, so it is sent to "all"');
+  expect(issues((l) => Object.assign(event(l, 's1-frame'), { to: 'all', cues: [] }))).toContain('is sent to "all", so its kind is "broadcast"');
+});
+
+test('`flood` is a flag for a frame to one device; a broadcast floods by itself', () => {
+  expect(issues((l) => (event(l, 's4-frame').cues = [{ cue: 'flood' }]))).toContain('is a broadcast, which floods by itself; leave out "flood"');
+  expect(issues((l) => (event(l, 's1-frame').cues = [{ cue: 'flood', arg: 'x' }]))).toContain('cue "flood" is a flag and takes no arg');
+});
+
+test('`plug` takes only "laptop 5", and only on a message', () => {
+  expect(issues((l) => (event(l, 's5-frame').cues = [{ cue: 'plug', arg: 'tv 5' }]))).toContain('cue "plug" takes "laptop 5", not "tv 5"');
+  expect(issues((l) => (event(l, 's5-frame').cues = [{ cue: 'plug' }]))).toContain('cue "plug" needs an arg');
+  expect(
+    issues((l) =>
+      l.units[0]!.steps[1]!.events.push({ type: 'note', id: 's2-note', log: { time: '—', source: '—', destination: '—', protocol: '—', info: 'i', size: '—' }, plain: 'p', cues: [{ cue: 'plug', arg: 'laptop 5' }] }),
+    ),
+  ).toContain('cue "plug" is for a message; a note sends no frame');
+});
+
+test('the switch figure takes no start', () => {
+  expect(issues((l) => (l.units[0]!.scene.start = [{ cue: 'flood' }]))).toContain('the scene has a start, but the switch figure takes none');
+});
diff --git a/src/content/define.ts b/src/content/define.ts
index 1949660..e124642 100644
--- a/src/content/define.ts
+++ b/src/content/define.ts
@@ -246,6 +246,10 @@ function checkEvent(e: SceneEvent, at: string, c: UnitContext): void {
   }
 
   if (e.type === 'note') {
+    // On the switch, a flood and a re-plug happen to a frame: only a message carries them.
+    if (figure === 'switch') {
+      for (const { cue } of e.cues ?? []) if (cue === 'flood' || cue === 'plug') issues.push(`${where}: cue "${cue}" is for a message; a note sends no frame.`);
+    }
     if (e.board !== undefined && !c.parts.board) issues.push(`${where} has a board, but the ${figure} figure has none.`);
     // A glyph's colour and shape never say what it is alone: the legend says it in words.
     if (e.glyph !== undefined && !c.unit.scene.log.legend.some((entry) => entry.kind === e.glyph)) {
@@ -280,6 +284,12 @@ function checkEvent(e: SceneEvent, at: string, c: UnitContext): void {
   if (c.parts.routes !== undefined && !c.parts.routes.includes(`${e.from}>${e.to}`)) {
     issues.push(`${where} rides from "${e.from}" to "${e.to}", a way the ${figure} figure does not have.`);
   }
+  // On the switch, a frame to everyone is a broadcast and a broadcast is to everyone; a broadcast floods by itself.
+  if (figure === 'switch') {
+    if (e.kind === 'broadcast' && e.to !== 'all') issues.push(`${where} is a broadcast, so it is sent to "all".`);
+    if (e.kind !== 'broadcast' && e.to === 'all') issues.push(`${where} is sent to "all", so its kind is "broadcast".`);
+    if (e.kind === 'broadcast' && (e.cues ?? []).some((q) => q.cue === 'flood')) issues.push(`${where} is a broadcast, which floods by itself; leave out "flood".`);
+  }
 
   if (e.outcome === 'dropped' && e.dropAt === undefined) issues.push(`${where} is dropped, so it needs "dropAt".`);
   if (e.outcome !== 'dropped' && e.dropAt !== undefined) issues.push(`${where} has "dropAt" but is not dropped.`);
diff --git a/src/content/schema.ts b/src/content/schema.ts
index 9da7403..288cc73 100644
--- a/src/content/schema.ts
+++ b/src/content/schema.ts
@@ -34,7 +34,7 @@ const count = z.number().int().min(0);
 export const messageKindSchema = z.enum(['request', 'response', 'control', 'broadcast', 'encrypted']);
 export const certTagSchema = z.enum(CERT_TAG_IDS);
 /** The scene figures (`FigureId`); `parts.test.ts` keeps this list and `FIGURE_PARTS` the same. */
-export const figureIdSchema = z.enum(['dhcp', 'subnet', 'firewall', 'net-map', 'osi'] satisfies FigureId[]);
+export const figureIdSchema = z.enum(['dhcp', 'subnet', 'firewall', 'net-map', 'osi', 'switch'] satisfies FigureId[]);
 
 /** A source as a lesson lists it. `source` is its id in the registry (`sources.ts`), which a list made from citations carries. */
 export const sourceSchema = z.strictObject({ label: text, url: httpsUrl, source: slugSchema.optional() });
diff --git a/src/content/switch-fixture.ts b/src/content/switch-fixture.ts
new file mode 100644
index 0000000..520e113
--- /dev/null
+++ b/src/content/switch-fixture.ts
@@ -0,0 +1,76 @@
+import { eventLog } from './helpers/internet-events';
+import whatIsIp from './lessons/what-is-ip';
+import type { Lesson, MessageEvent, SceneEvent, TableEvent, Unit } from './schema';
+
+/**
+ * Switch's unit as the design spec writes it (prototypes/d13-switch.md §3), for the tests of what the build adds: What
+ * is IP's lesson with this unit swapped in, so the figure's parts, the driver, the panel and the log are all driven by
+ * the same scene. Every word is the spec's placeholder; the lesson itself (src/content/lessons/switch.ts) is the
+ * author's. Test-only: nothing imports it into the site.
+ */
+
+export const MAC = { router: '00:00:5E:00:53:01', laptop: '00:00:5E:00:53:10', tv: '00:00:5E:00:53:12', printer: '00:00:5E:00:53:13' };
+const ALL = 'ff:ff:ff:ff:ff:ff';
+type Device = keyof typeof MAC;
+
+const frame = (id: string, from: Device, to: Device | 'all', o: Partial<MessageEvent> = {}): MessageEvent => ({
+  type: 'message',
+  id,
+  from,
+  to,
+  tag: to === 'all' ? 'TO ALL' : 'FRAME',
+  kind: to === 'all' ? 'broadcast' : 'request',
+  log: { time: '—', source: MAC[from], destination: to === 'all' ? ALL : MAC[to], protocol: 'Ethernet', info: `Frame ${id}`, size: '—' },
+  plain: `Frame ${id}.`,
+  ...o,
+});
+const table = (id: string, o: Partial<TableEvent>): TableEvent => ({ type: 'table', id, table: 'mac-table', op: 'match', summary: `Table ${id}.`, ...o }) as TableEvent;
+
+const STEPS: SceneEvent[][] = [
+  [frame('s1-frame', 'laptop', 'printer', { cues: [{ cue: 'flood' }] }), table('s1-match', { key: '' })],
+  [table('s2-add', { op: 'add', row: { port: '2', mac: MAC.laptop } })],
+  [frame('s3-frame', 'printer', 'laptop', { kind: 'response' }), table('s3-add', { op: 'add', row: { port: '4', mac: MAC.printer } }), table('s3-match', { key: MAC.laptop })],
+  [frame('s4-frame', 'router', 'all'), table('s4-add', { op: 'add', row: { port: '1', mac: MAC.router } })],
+  [frame('s5-frame', 'laptop', 'router', { cues: [{ cue: 'plug', arg: 'laptop 5' }] }), table('s5-update', { op: 'update', key: MAC.laptop, row: { port: '5' } }), table('s5-match', { key: MAC.router })],
+];
+
+const scene = (): Unit['scene'] => ({
+  title: 'Four devices on one switch',
+  views: ['network'],
+  layers: [],
+  labels: {},
+  start: [],
+  panel: {
+    type: 'table',
+    table: {
+      id: 'mac-table',
+      title: 'MAC table',
+      by: 'kept by the switch',
+      columns: [{ key: 'port', label: 'Port', width: 64 }, { key: 'mac', label: 'MAC address' }],
+      keyColumn: 'mac',
+      initialRows: [],
+      empty: 'Empty: the switch hasn’t learned any address yet',
+    },
+  },
+  log: {
+    ...eventLog(),
+    legend: [
+      { kind: 'request', label: 'Frame for one device' },
+      { kind: 'broadcast', label: 'Frame for everyone' },
+      { kind: 'response', label: 'The reply' },
+    ],
+  },
+  parties: [],
+});
+
+export function switchFixture(): Lesson {
+  const lesson = structuredClone(whatIsIp);
+  const unit = lesson.units[0]!;
+  const template = unit.steps[0]!;
+  lesson.slug = 'switch-fixture';
+  lesson.figure = 'switch';
+  unit.scene = scene();
+  unit.steps = STEPS.map((events, i) => ({ ...structuredClone(template), id: `step-${i + 1}`, title: `Step ${i + 1}`, events: structuredClone(events) }));
+  for (const step of unit.steps) delete step.status;
+  return lesson;
+}
diff --git a/src/content/test-fixtures.ts b/src/content/test-fixtures.ts
index 1435460..b8b4c23 100644
--- a/src/content/test-fixtures.ts
+++ b/src/content/test-fixtures.ts
@@ -56,6 +56,7 @@ export const FIXTURE_PARTS: Record<FigureId, FigureParts> = {
     words: ['plate'],
     labels: true,
   },
+  switch: fixtureParts({ board: false, start: false }),
 };
 
 function fixtureParts({ board, start }: { board: boolean; start: boolean }): FigureParts {
diff --git a/src/lib/figures.ts b/src/lib/figures.ts
index 7692679..534db5a 100644
--- a/src/lib/figures.ts
+++ b/src/lib/figures.ts
@@ -16,6 +16,7 @@ const FIGURES: Record<string, () => string> = {
   'ip-address': () => spot('ip-address'),
   'mac-address': () => spot('mac-address'),
   'tcp-udp': () => spot('tcp-udp'),
+  switch: () => spot('switch'),
 };
 
 /**
diff --git a/src/scenes/drivers/index.ts b/src/scenes/drivers/index.ts
index 5838685..f56fa92 100644
--- a/src/scenes/drivers/index.ts
+++ b/src/scenes/drivers/index.ts
@@ -5,6 +5,7 @@ import { firewallDriver } from './firewall';
 import { netMapDriver } from './net-map';
 import { osiDriver } from './osi';
 import { subnetDriver } from './subnet';
+import { switchDriver } from './switch';
 
 /** The driver for each scene figure. */
 export const DRIVERS: Record<FigureId, DriverModule> = {
@@ -13,4 +14,5 @@ export const DRIVERS: Record<FigureId, DriverModule> = {
   firewall: firewallDriver,
   'net-map': netMapDriver,
   osi: osiDriver,
+  switch: switchDriver,
 };
diff --git a/src/scenes/drivers/switch.test.ts b/src/scenes/drivers/switch.test.ts
new file mode 100644
index 0000000..61f8144
--- /dev/null
+++ b/src/scenes/drivers/switch.test.ts
@@ -0,0 +1,116 @@
+// @vitest-environment jsdom
+import { afterEach, expect, test } from 'vitest';
+import { drawSwitch } from '../../art/scenes/switch';
+import type { Lesson } from '../../content/schema';
+import { switchFixture } from '../../content/switch-fixture';
+import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
+import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
+import { switchDriver } from './switch';
+
+// D13b (prototypes/d13-switch.md §3 and §8): what each step leaves on the figure once it has played, and how a frame
+// plays under reduced motion. The fixture is the spec's unit.
+
+afterEach(() => {
+  document.body.innerHTML = '';
+});
+
+const lesson: Lesson = switchFixture();
+
+function mount(): { root: SVGSVGElement; driver: SceneDriver } {
+  const host = document.createElement('div');
+  host.innerHTML = drawSwitch().svg;
+  document.body.append(host);
+  const root = host.querySelector<SVGSVGElement>('svg[data-figure="switch"]')!;
+  return { root, driver: switchDriver.create(root, drawSwitch().data) };
+}
+/** The scene at step `step` once its first `played` events have been applied; `played` absent means all of them. */
+function viewAt(step: number, played?: number): SceneView {
+  const position = positionOf(lesson, 0, 'step', step);
+  return sceneViewOf(lesson.units[0]!, deriveState(lesson, position, played ?? stepEvents(lesson, position).length));
+}
+const options = (o: Partial<PlayOptions> = {}): PlayOptions => ({ speed: 1, reducedMotion: true, signal: new AbortController().signal, ...o });
+
+const $ = (root: Element, id: string) => root.querySelector(`#${id}`)!;
+const verdictOf = (root: Element, d: string) => $(root, `sw-v-${d}`).getAttribute('data-v');
+const traced = (root: Element) => [...root.querySelectorAll('.sw-trace[data-on]')].map((e) => e.id.replace('sw-trace-', '')).sort();
+const keeping = (root: Element) => ['laptop', 'tv', 'printer', 'rt'].filter((d) => $(root, d === 'rt' ? 'sw-rt-led-1' : `sw-led-${d}`).classList.contains('on'));
+const lit = (root: Element) => [1, 2, 3, 4, 5].filter((n) => $(root, `sw-led-${n}`).classList.contains('on'));
+
+test('step 1 settled: the flood went out of ports 1, 3 and 4, not back to the laptop and not to empty port 5', () => {
+  const { root, driver } = mount();
+  driver.show(viewAt(1));
+  expect(traced(root)).toEqual(['laptop-2', 'printer-4', 'router-1', 'tv-3']);
+  expect(lit(root)).toEqual([1, 2, 3, 4]);
+  expect([verdictOf(root, 'laptop'), verdictOf(root, 'printer'), verdictOf(root, 'router'), verdictOf(root, 'tv')]).toEqual(['sent', 'keeps', 'ignores', 'ignores']);
+  // Only the keeper's status light is on.
+  expect(keeping(root)).toEqual(['printer']);
+});
+
+test('step 2 settled: no frame; the learned row lights port 2 and the laptop’s cable, and no device has a verdict', () => {
+  const { root, driver } = mount();
+  driver.show(viewAt(2));
+  expect(traced(root)).toEqual(['laptop-2']);
+  expect(lit(root)).toEqual([2]);
+  for (const d of ['router', 'laptop', 'tv', 'printer']) expect(verdictOf(root, d)).toBeNull();
+});
+
+test('step 3 settled: straight to port 2; the router and the TV get no copy, so no verdict, not “Ignores it”', () => {
+  const { root, driver } = mount();
+  driver.show(viewAt(3));
+  expect(traced(root)).toEqual(['laptop-2', 'printer-4']);
+  expect(lit(root)).toEqual([2, 4]);
+  expect(verdictOf(root, 'printer')).toBe('sent');
+  expect(verdictOf(root, 'laptop')).toBe('keeps');
+  expect(verdictOf(root, 'router')).toBeNull();
+  expect(verdictOf(root, 'tv')).toBeNull();
+});
+
+test('step 4 settled: a broadcast reaches every other device, and each keeps it', () => {
+  const { root, driver } = mount();
+  driver.show(viewAt(4));
+  expect(traced(root)).toEqual(['laptop-2', 'printer-4', 'router-1', 'tv-3']);
+  expect([verdictOf(root, 'router'), verdictOf(root, 'laptop'), verdictOf(root, 'tv'), verdictOf(root, 'printer')]).toEqual(['sent', 'keeps', 'keeps', 'keeps']);
+  expect(keeping(root)).toEqual(['laptop', 'tv', 'printer']);
+});
+
+test('step 5 settled: the laptop is on port 5; its old cable is gone and its chip says PORT 5', () => {
+  const { root, driver } = mount();
+  driver.show(viewAt(5));
+  expect($(root, 'sw-cable-laptop-2').getAttribute('display')).toBe('none');
+  expect($(root, 'sw-cable-laptop-5').getAttribute('display')).toBeNull();
+  expect($(root, 'sw-port-laptop').textContent).toBe('PORT 5');
+  expect($(root, 'sw-port-laptop').classList.contains('moved')).toBe(true);
+  expect(traced(root)).toEqual(['laptop-5', 'router-1']);
+  expect(lit(root)).toEqual([1, 5]);
+  // Going back a step puts the cable back in port 2.
+  driver.show(viewAt(4));
+  expect($(root, 'sw-cable-laptop-2').getAttribute('display')).toBeNull();
+  expect($(root, 'sw-port-laptop').textContent).toBe('PORT 2');
+});
+
+test('a played frame ends where show puts it (reduced motion)', async () => {
+  for (const step of [1, 3, 4, 5]) {
+    const a = mount();
+    const position = positionOf(lesson, 0, 'step', step);
+    const event = stepEvents(lesson, position)[0]!;
+    // As the panel does: show the scene before the event, then play the event on that same view.
+    a.driver.show(viewAt(step, 0));
+    await a.driver.play(event, viewAt(step, 0), options());
+    const b = mount();
+    b.driver.show(viewAt(step, 1));
+    expect(traced(a.root), `step ${step}`).toEqual(traced(b.root));
+    expect(lit(a.root), `step ${step}`).toEqual(lit(b.root));
+    expect($(a.root, 'sw-cable-laptop-5').getAttribute('display'), `step ${step}`).toBe($(b.root, 'sw-cable-laptop-5').getAttribute('display'));
+    expect($(a.root, 'sw-port-laptop').textContent, `step ${step}`).toBe($(b.root, 'sw-port-laptop').textContent);
+    document.body.innerHTML = '';
+  }
+});
+
+test('durations at 1×: 2.95 s for a frame, 4.15 s with a re-plug, 0.9 s for each MAC table event', () => {
+  const { data } = drawSwitch();
+  const at = (step: number, i: number) => stepEvents(lesson, positionOf(lesson, 0, 'step', step))[i]!;
+  expect(switchDriver.duration(at(1, 0), data)).toBe(2950);
+  expect(switchDriver.duration(at(5, 0), data)).toBe(4150);
+  expect(switchDriver.duration(at(2, 0), data)).toBe(900);
+  expect(switchDriver.duration(at(1, 1), data)).toBe(900);
+});
diff --git a/src/scenes/drivers/switch.ts b/src/scenes/drivers/switch.ts
new file mode 100644
index 0000000..6485e1b
--- /dev/null
+++ b/src/scenes/drivers/switch.ts
@@ -0,0 +1,296 @@
+// Only types from the drawing module: its code is for the build, and stays out of the page.
+import type { SwitchSceneData } from '../../art/scenes/switch';
+import { SWITCH_DEVICES, SWITCH_PLUGS, type SwitchDevice } from '../../art/scenes/switch-parts';
+import type { Cue, MessageEvent, SceneEvent } from '../../content/schema';
+import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
+import { along, animate, easeInOut, wait } from '../motion';
+
+/**
+ * Moves the Switch figure (src/art/scenes/switch.ts): four devices plugged into a five-port switch.
+ *
+ * A frame's tag rides the sender's cable into its port, and the port's light comes on. The switch then sends it out:
+ * - out of the one port the receiver is plugged into, the same tag going on (a frame the switch knows where to send);
+ * - or, for a broadcast (`kind: 'broadcast'`, to `all`) or a frame with the `flood` cue, a copy out of every other
+ *   port a device is plugged into, all at once: COPY tags, or TO ALL for a broadcast. Never back down the sender's
+ *   cable, and never out of a free port.
+ * Each device that gets a copy says what it did with it, as MAC Address's do: the receiver (or, for a broadcast,
+ * everyone) "Keeps it", the others "Ignores it"; the sender "Sent it". A device that gets no copy says nothing and
+ * its cable stays dark. Once the frame has landed, its way stays traced along the cables and its ports stay lit.
+ *
+ * `plug laptop 5` (a message's cue) moves the laptop's cable from port 2 to port 5 before that frame sets off; from
+ * then on the laptop is on port 5. A step with no frame yet that adds or changes a MAC table row lights that row's
+ * port and the cable plugged into it (the switch learning where a device is).
+ */
+
+type Flat = [number, number];
+
+/** A frame at 1×: the ride in, the switch's look-up, the ride out, the rest, and the gap after it. A re-plug comes first. */
+const IN_MS = 900;
+const LOOK_MS = 500;
+const OUT_MS = 900;
+const REST_MS = 450;
+const GAP_MS = 200;
+const PLUG_MS = 1200;
+/** A MAC table event waits this long, so the learner sees the table before the next thing happens. */
+const TABLE_MS = 900;
+
+/** The MAC table, keyed on the MAC address; the figure reads its port column. */
+const TABLE = 'mac-table';
+const PORT = 'port';
+const DEVICES = Object.keys(SWITCH_DEVICES) as SwitchDevice[];
+const VERDICT: Record<'sent' | 'keeps' | 'ignores', string> = { sent: 'Sent it', keeps: 'Keeps it', ignores: 'Ignores it' };
+
+const hasPlug = (e: MessageEvent): boolean => (e.cues ?? []).some((c) => c.cue === 'plug');
+
+function duration(event: SceneEvent): number {
+  if (event.type === 'table') return event.table === TABLE ? TABLE_MS : 0;
+  if (event.type !== 'message') return 0;
+  return (hasPlug(event) ? PLUG_MS : 0) + IN_MS + LOOK_MS + OUT_MS + REST_MS + GAP_MS;
+}
+
+/** Which port each device is plugged into, after the `plug` cues so far, in order. */
+function plugsAfter(cues: readonly Cue[]): Record<SwitchDevice, number> {
+  const plugs = { ...SWITCH_PLUGS };
+  for (const c of cues) {
+    if (c.cue !== 'plug') continue;
+    const [device, port] = (c.arg ?? '').split(' ');
+    plugs[device as SwitchDevice] = Number(port);
+  }
+  return plugs;
+}
+
+/** A frame's way through the switch: the port it comes in on, and the ports it goes out of, each with its device. */
+interface Way {
+  from: SwitchDevice;
+  inPort: number;
+  out: { device: SwitchDevice; port: number }[];
+  flood: boolean;
+}
+function wayOf(e: MessageEvent, plugs: Record<SwitchDevice, number>): Way {
+  const from = e.from as SwitchDevice;
+  const flood = e.kind === 'broadcast' || (e.cues ?? []).some((c) => c.cue === 'flood');
+  const out = flood
+    ? DEVICES.filter((d) => d !== from).map((device) => ({ device, port: plugs[device] }))
+    : [{ device: e.to as SwitchDevice, port: plugs[e.to as SwitchDevice] }];
+  return { from, inPort: plugs[from], out: out.sort((a, b) => a.port - b.port), flood };
+}
+
+/** What a device does with the copy it gets: a broadcast, or a frame with its address on it, it keeps. */
+const keeps = (e: MessageEvent, d: SwitchDevice): boolean => e.kind === 'broadcast' || e.to === d;
+
+/** The part of a line on screen from its start to `t` of the way along it. */
+function partOf(path: Flat[], t: number): Flat[] {
+  if (t >= 1) return path;
+  const lengths = path.slice(1).map(([x, y], i) => Math.hypot(x - path[i]![0], y - path[i]![1]));
+  let left = Math.max(t, 0) * lengths.reduce((a, b) => a + b, 0);
+  const out: Flat[] = [path[0]!];
+  for (const [i, length] of lengths.entries()) {
+    if (left <= length) {
+      out.push(along([path[i]!, path[i + 1]!], length > 0 ? left / length : 0));
+      return out;
+    }
+    out.push(path[i + 1]!);
+    left -= length;
+  }
+  return out;
+}
+const pointsOf = (list: Flat[]): string => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
+
+function create(root: SVGSVGElement, data: unknown): SceneDriver {
+  // Drawn by drawSwitch() at build time, beside this figure.
+  const { cables } = data as SwitchSceneData;
+  const part = <T extends SVGElement = SVGElement>(id: string): T => {
+    const found = root.querySelector<T>(`#${id}`);
+    if (found === null) throw new Error(`The Switch figure has no #${id}.`);
+    return found;
+  };
+  const tag = (id: string): SVGElement => part(`sw-tag-${id}`);
+  const allTags = ['frame', 'to-all', 'copy-1', 'copy-2', 'copy-3', 'to-all-1', 'to-all-2', 'to-all-3'].map(tag);
+  const leds = [1, 2, 3, 4, 5].map((n) => part(`sw-led-${n}`));
+  const traces = Object.fromEntries(Object.keys(cables).map((key) => [key, part<SVGPolylineElement>(`sw-trace-${key.replace(':', '-')}`)]));
+  const verdicts = Object.fromEntries(DEVICES.map((d) => [d, part(`sw-v-${d}`)])) as Record<SwitchDevice, SVGElement>;
+  const chips = Object.fromEntries(DEVICES.map((d) => [d, part(`sw-port-${d}`)])) as Record<SwitchDevice, SVGElement>;
+  // Each device's status light (the router's two), on while it keeps a frame: a light, as MAC Address's devices have,
+  // not a lit screen or paper slot, which would say the frame is shown or printed.
+  const keepLights: Record<SwitchDevice, SVGElement[]> = {
+    laptop: [part('sw-led-laptop')],
+    tv: [part('sw-led-tv')],
+    printer: [part('sw-led-printer')],
+    router: [part('sw-rt-led-1'), part('sw-rt-led-2')],
+  };
+  // The laptop's cable and plug at port 2, and at port 5 once moved.
+  const laptopAt = (port: number): SVGElement[] => [part(`sw-cable-laptop-${port}`), part(`sw-plug-laptop-${port}`)];
+
+  const fade = (el: SVGElement, opacity: number): void => {
+    el.style.opacity = String(opacity);
+  };
+  const moveTo = (el: SVGElement, [x, y]: Flat): void => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
+  const cableOf = (device: SwitchDevice, port: number): Flat[] => {
+    const path = cables[`${device}:${port}`];
+    if (path === undefined) throw new Error(`The Switch figure has no cable from the ${device} to port ${port}.`);
+    return path;
+  };
+  /** A cable's trace: `ride` while a frame is on it, `trace` once it has landed; drawn from the device to `t` (or from the port, backwards). */
+  function trace(device: SwitchDevice, port: number, state: 'ride' | 'trace' | null, t = 1, fromPort = false): void {
+    const el = traces[`${device}:${port}`]!;
+    if (state === null) {
+      el.removeAttribute('data-on');
+      el.setAttribute('points', '');
+      return;
+    }
+    const path = cableOf(device, port);
+    el.setAttribute('data-on', state);
+    el.setAttribute('points', pointsOf(fromPort ? partOf([...path].reverse(), t) : partOf(path, t)));
+  }
+  function verdict(d: SwitchDevice, v: keyof typeof VERDICT | null): void {
+    const g = verdicts[d];
+    if (v === null) g.removeAttribute('data-v');
+    else g.setAttribute('data-v', v);
+    g.querySelector('.sw-v-t')!.textContent = v === null ? '' : VERDICT[v];
+    for (const el of keepLights[d]) el.classList.toggle('on', v === 'keeps');
+  }
+
+  /** Nothing in flight: every tag back where the figure drew it, hidden. */
+  function clearMoving(): void {
+    for (const el of allTags) {
+      fade(el, 0);
+      el.removeAttribute('transform');
+    }
+  }
+  /** Nothing in flight, no trace, no port light, no verdict. */
+  function clear(): void {
+    clearMoving();
+    for (const el of Object.values(traces)) {
+      el.removeAttribute('data-on');
+      el.setAttribute('points', '');
+    }
+    for (const led of leds) led.classList.remove('on');
+    for (const d of DEVICES) verdict(d, null);
+  }
+  /** The cables as plugged: the laptop's at port 2 or 5, and the port in each device's callout. */
+  function paintPlugs(plugs: Record<SwitchDevice, number>): void {
+    for (const port of [2, 5]) for (const el of laptopAt(port)) {
+      el.removeAttribute('data-ghost');
+      if (plugs.laptop === port) el.removeAttribute('display');
+      else el.setAttribute('display', 'none');
+    }
+    for (const d of DEVICES) {
+      chips[d].textContent = `PORT ${plugs[d]}`;
+      chips[d].classList.toggle('moved', plugs[d] !== SWITCH_PLUGS[d]);
+    }
+  }
+  /** A frame that has landed: its way traced, its ports lit, and every verdict. */
+  function paintLanded(e: MessageEvent, plugs: Record<SwitchDevice, number>): void {
+    const way = wayOf(e, plugs);
+    trace(way.from, way.inPort, 'trace');
+    leds[way.inPort - 1]!.classList.add('on');
+    verdict(way.from, 'sent');
+    for (const { device, port } of way.out) {
+      trace(device, port, 'trace');
+      leds[port - 1]!.classList.add('on');
+      verdict(device, keeps(e, device) ? 'keeps' : 'ignores');
+    }
+  }
+  /** A step with no frame yet: a row the MAC table has just gained or changed lights its port and the cable there. */
+  function paintLearned(port: number, plugs: Record<SwitchDevice, number>): void {
+    leds[port - 1]?.classList.add('on');
+    const device = DEVICES.find((d) => plugs[d] === port);
+    if (device !== undefined) trace(device, port, 'trace');
+  }
+  const portOfRow = (view: SceneView): number | null => {
+    const table = view.tables[TABLE];
+    const h = table?.highlight;
+    if (table === undefined || h === null || h === undefined || (h.type !== 'added' && h.type !== 'updated')) return null;
+    const row = table.rows.find((r) => r['mac'] === h.key);
+    return row === undefined ? null : Number(row[PORT]);
+  };
+
+  /** Rides one tag along a cable, laying its trace behind it: in from the device, or out from the port. */
+  async function ride(el: SVGElement, device: SwitchDevice, port: number, outward: boolean, o: PlayOptions, t: number): Promise<void> {
+    const path = outward ? [...cableOf(device, port)].reverse() : cableOf(device, port);
+    fade(el, 1);
+    moveTo(el, path[0]!);
+    await animate(t, (k) => {
+      const f = easeInOut(k);
+      moveTo(el, along(path, f));
+      trace(device, port, 'ride', f, outward);
+    }, o);
+  }
+
+  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
+    if (event.type === 'table') {
+      if (event.table === TABLE && view.landed === null && (event.op === 'add' || event.op === 'update') && event.row?.[PORT] !== undefined) {
+        clear();
+        paintLearned(Number(event.row[PORT]), plugsAfter(view.cues));
+      }
+      return;
+    }
+    if (event.type !== 'message') return;
+    clear();
+    let plugs = plugsAfter(view.cues);
+    // A re-plug first: the old cable fades to a ghost while the new one comes in, then the ghost goes.
+    if (hasPlug(event)) {
+      const next = plugsAfter([...view.cues, ...(event.cues ?? [])]);
+      const [from, to] = [laptopAt(plugs.laptop), laptopAt(next.laptop)];
+      for (const el of from) el.setAttribute('data-ghost', '');
+      for (const el of to) {
+        el.removeAttribute('display');
+        fade(el, 0);
+      }
+      await animate(PLUG_MS / o.speed, (k) => {
+        for (const el of to) fade(el, Math.min(1, k * 1.6));
+        for (const el of from) fade(el, Math.max(0, 1 - k * 1.4));
+      }, o);
+      if (o.signal.aborted) return;
+      for (const el of [...from, ...to]) el.style.removeProperty('opacity');
+      plugs = next;
+      paintPlugs(plugs);
+      leds[plugs.laptop - 1]!.classList.add('on');
+    }
+    const way = wayOf(event, plugs);
+    verdict(way.from, 'sent');
+    const inTag = tag(event.kind === 'broadcast' ? 'to-all' : 'frame');
+    await ride(inTag, way.from, way.inPort, false, o, IN_MS / o.speed);
+    if (o.signal.aborted) return;
+    leds[way.inPort - 1]!.classList.add('on');
+    trace(way.from, way.inPort, 'trace');
+    // The switch looks the address up; the frame waits at its port.
+    if (way.flood) fade(inTag, 0);
+    await wait(LOOK_MS / o.speed, o.signal);
+    if (o.signal.aborted) return;
+    const outTags = way.flood ? way.out.map((_, i) => tag(`${event.kind === 'broadcast' ? 'to-all' : 'copy'}-${i + 1}`)) : [inTag];
+    for (const { port } of way.out) leds[port - 1]!.classList.add('on');
+    await Promise.all(way.out.map(({ device, port }, i) => ride(outTags[i]!, device, port, true, o, OUT_MS / o.speed)));
+    if (o.signal.aborted) return;
+    for (const { device, port } of way.out) {
+      trace(device, port, 'trace');
+      verdict(device, keeps(event, device) ? 'keeps' : 'ignores');
+    }
+    await wait(REST_MS / o.speed, o.signal);
+    if (o.signal.aborted) return;
+    clearMoving();
+  }
+
+  return {
+    show(view) {
+      // Settled means no motion: the lights change at once, not over their fades (switch.css).
+      root.setAttribute('data-settling', '');
+      clear();
+      const plugs = plugsAfter(view.cues);
+      paintPlugs(plugs);
+      if (view.landed?.type === 'message') paintLanded(view.landed, plugs);
+      else {
+        const port = portOfRow(view);
+        if (port !== null) paintLearned(port, plugs);
+      }
+      void root.getBoundingClientRect();
+      root.removeAttribute('data-settling');
+    },
+    play,
+    // Nothing to let go of: a play's timers and listeners end with its signal, which the panel aborts first.
+    destroy() {},
+  };
+}
+
+/** The Switch figure's driver. */
+export const switchDriver: DriverModule = { create, duration };
diff --git a/src/styles/green-text.test.ts b/src/styles/green-text.test.ts
index 507e698..d22236f 100644
--- a/src/styles/green-text.test.ts
+++ b/src/styles/green-text.test.ts
@@ -15,6 +15,7 @@ const read = (path: string): string => readFileSync(new URL(path, import.meta.ur
 const SOURCES = {
   'dhcp.css': read('../art/scenes/dhcp.css'),
   'net-map.css': read('../art/scenes/net-map.css'),
+  'switch.css': read('../art/scenes/switch.css'),
   'console.css': read('../lesson/console.css'),
   'site.css': read('../components/site.css'),
   'about.astro': read('../pages/about.astro'),
@@ -50,6 +51,8 @@ const GREEN_TEXT: GreenText[] = [
   // The figures' callouts sit on the figures' background: DHCP's new address, and a protocol's "done" state on the map.
   { source: 'dhcp.css', selector: '.dh .dh-call .dh-addr.new', grounds: (theme) => ({ 'figure background': figBg(theme) }) },
   { source: 'net-map.css', selector: '.nm .nm-call .nm-state.done', grounds: (theme) => ({ 'figure background': figBg(theme) }) },
+  // Switch's "Keeps it", beside a device's callout.
+  { source: 'switch.css', selector: '.sw .sw-v[data-v="keeps"] .sw-v-t', grounds: (theme) => ({ 'figure background': figBg(theme) }) },
   // A right option's letter, on the option's own green tint over the card.
   {
     source: 'console.css',
````
