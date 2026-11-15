# D13c: Load Balancers, the scene and the card art (job 14, batch 3)

The spec for the new Networking Concepts lesson **Load Balancers** (`load-balancers`, stop 19): its Watch scene, its panel, its log and its card art. It is for the design gate: the owner approves the prototype, then builder B15 builds it with D13a and D13b.

| File | What it is |
|---|---|
| `prototypes/d13-load-balancers.html` | The clickable prototype: the Lesson page playing step by step, and the card art on the track's route. One self-contained file (667 KB: styles, figure and script inline; it loads nothing). |
| `prototypes/d13-load-balancers-part-pool.svg` | `drawPool().svg`, the new `pool` figure as drawn at build time |
| `prototypes/d13-load-balancers-spot.svg` | `spot('load-balancers')`, the card art |

The code that emits both SVG files is the patch in Appendix A. It was made on `design/d13-load-balancers` at `9807155` (`job14/batch`), and the files were generated from it. The SVGs carry classes and CSS variables, not colours: they render properly only inside a page that loads the site's CSS and the shared defs.

**How to use the prototype.** The tab at the right edge ("D13c prototype") opens the switches: page (Lesson, Card art), theme and motion. Everything else is the Lesson page: the outline, Play, the step arrows, the speed, the phone tabs. A query string opens a state directly, for example `?step=4&play=1&tab=table&theme=dark` (also `page=cards`, `motion=reduced`).

The prototype's figure is the patch's drawing, and it is moved by the patch's own driver (`src/scenes/drivers/pool.ts`, bundled into the page with `src/engine/tables.ts`), in the order ScenePanel runs it: `show(view before)`, `play(event)`, wait `duration(event)`, apply. Learn and Practice are stubs: they keep the page as built.

The story is the analyst's (`.superpowers/analysis/load-balancers/report.md` §2 and its Rulings). Step titles, narratives, facts, table cells, tags and log info are the outline's words, used as placeholders the author will set, except where §7 marks words as **new words**.

One variant. Nothing in this scene forks: the one real choice (the figure) has one honest answer (§2.1).

## 1. What changes and what stays

**Stays.**
- The Lesson page as built (direction §7): layout, console, stage, log, phone tabs, the table panel's look.
- Every existing figure, untouched. net-map, dhcp, subnet and firewall are not edited; the patch adds a figure beside them.
- The art kit (`src/art/common.ts`), the tokens (`src/styles/tokens.ts`) and lumen's classes. Patch adds no token: the figure's two fixed lights are Firewalls' own (`--fixed-allow #3ddc7c`, `--fixed-deny #ff4f4f`), redeclared on `.pl` exactly as `.fw` declares them.
- The table panel (`TablePanel.tsx`), the log (`LogPanel`), the engine (`timeline`, `tables.ts`) and the validator (`define.ts`): the new figure fits their existing contracts (`places`, `cues`, `args`, `routes`).

**Changes.**
- A new scene figure **`pool`**: `src/art/scenes/pool.ts` (drawing), `pool-parts.ts` (data only), `pool.css` (its parts' styles), and its driver `src/scenes/drivers/pool.ts` (2,074 B gzipped, §4.3).
- The figure is registered: `FigureId` and `figureIdSchema` gain `'pool'`; `DRAW`, `DRIVERS`, `FIGURE_PARTS` and `FIXTURE_PARTS` gain an entry; two tests' id lists gain `'pool'`.
- A new card spot `spot('load-balancers')` in `spots.ts`, wired in `src/lib/figures.ts`, its hash in `figures.test.ts`.
- On the Networking track page stop 19 turns from "Not ready yet" into a ready card once the lesson exists (the track page does this by itself from the lesson file; no track code changes).

## 2. Gaps decided

### 2.1 The figure: `pool`, not net-map (plan decision 4)

The ruling says to try net-map's plates first. net-map cannot show this story honestly:

- **Its routes.** `hops()` sends every message through the home router, the provider and routers a to d. A health check is a message between the balancer and a server in the same place; on net-map it would ride the internet.
- **Its places.** It has one laptop; it has no Reader 2 or Reader 3, and no place for a balancer with three servers behind it. Its east slot holds one server (or NE/SE, two); the story needs three in a pool, side by side, so the reader can see the balancer take them in turn.
- **Its reading.** The scene's whole point is "one address in front, many servers behind". net-map draws the internet as the middle of the picture; here the balancer must be.

So the scene gets its own small figure, built from the same kit and camera as dhcp and firewall: one plate, three laptops in front ("the internet"), the balancer in the middle, the pool of three servers behind it in an engraved outline. The driver is small (2,074 B gzipped, against dhcp's 2,255 and firewall's 2,934).

### 2.2 Health shown as two lamps, not an amber light

The outline suggests B's light going amber after one missed check. Patch has no amber token, and the rule is to add none. Each server instead carries **two lamps: its last two checks**, older first, green for answered in time and red for not. Two greens is healthy; two reds is unhealthy; one of each is the state in between, in either direction. This is the rule itself (two in a row) drawn as hardware, and it needs only the fixed green and red Firewalls already uses. Colour is never the only signal: the server's callout carries a health line with the pool table's own word (Healthy, 1 check missed, Unhealthy, 1 check passed).

The health line's square says the balancer's verdict: filled green while healthy, filled red while unhealthy, and a **dashed outline** in the verdict's colour while the last check has gone the other way and the verdict has not changed yet. While unhealthy, the line's words are bold in `--blocked`.

### 2.3 The "unhealthy" mark stays on through "1 check passed"

The outline clears the table's mark at `1 check passed` (no `miss`). But B is still unhealthy then (ruling 4: two passed checks to come back), and the panel's mark is the one place the table says so. So the update to `1 check passed` carries `miss: true`, and the mark goes only with the update to `Healthy`. The outline's `1 check missed` update stays unmarked: B is still healthy then. (This changes one field of the outline's event; the analyst reads it before the gate, plan item 38.)

### 2.4 No step statuses

The outline gives each step a status line. Only net-map reads `view.status`; nothing on the pool figure or the page shows it. The steps carry none, and the author writes none.

### 2.5 A check is the `control` kind; an answer is `response`

A reader's request is `request` (blue square). A health check is the balancer's own, so it is `control` (purple diamond), which keeps the readers' requests and the checks apart in the log at a glance. A server's OK is `response` (brown arrow). The no-answer is a `note` (muted "i"), as the outline says.

### 2.6 Readers carry no addresses on the figure

Ruling 2 has two branches: the log's public addresses (198.51.100.23:61023 and the others), or, "if the figure starts the tag at your laptop", `192.168.1.100:50422` for your row. The tag does start at your laptop's screen here, but `192.168.1.100` arriving at a public balancer would teach the false thing NAT's checked lesson rules out ("Private addresses aren't carried across the internet", `nat.ts:451`). So the log keeps the public addresses, the ruling's first branch, and the figure labels the three readers by name only ("You", "Reader 2", "Reader 3"), so it claims no address for a laptop. The log row says where each request came from as the balancer sees it. This is open question 1.

### 2.7 Also decided

- **Round robin is drawn, not written on the figure.** The balancer's face has three lights, A, B and C; the one it picks lights as the request waits on its top. A skip shows a red stop mark over the skipped server's port for 700 ms before the pick.
- **Requests are counted in chips.** Each server's top stacks one chip per request in the Requests cell (up to 4, the most the story reaches is 3). The newest chip of the latest landed request is lit.
- **No answer is a dashed ring** over the silent server, where the check would have come back. It shows while the note plays and stays while the note is the latest event of the step.
- **No reply tag** (ruling 11). A request ends at the server's top; the page is not drawn coming back.
- **No "proxy"** anywhere in the lesson's words, figure or spot (ruling 5). The only "Proxies" in the prototype is stop 18's title on the track route, which is the track page as built.
- **The check's log source is a dash; its destination the server's address and port 80** (ruling 7). The OK's source is the server's address and port 80 and its destination a dash, for the same reason.
- **The scene's title**: "example.net’s three servers" (new words).

## 3. The scene and its steps

**Unit.** `scene.figure: 'pool'`, no `layers`, no `start`, no `board`. Panel: `{ type: 'table', table: { id: 'pool', title: 'The pool', by: 'kept by the balancer', keyColumn: 'server', markLabel: 'unhealthy', empty: 'No servers yet.', columns, initialRows } }`.

| Column | `key` | Label | Notes |
|---|---|---|---|
| 1 | `server` | Server | the key: `A`, `B`, `C` (capitals; the driver lower-cases to find the server) |
| 2 | `address` | Address | `10.0.0.11`, `10.0.0.12`, `10.0.0.13` |
| 3 | `health` | Health | `prose: true`. One of the four words the figure knows (§3.2); any other word leaves the lamps dark and the health line hidden |
| 4 | `requests` | Requests | a whole number as text; the figure stacks that many chips, at most 4 |

`initialRows`: A, B and C, each `Healthy`, `0` requests. So the figure starts with six green lamps, no chips, every health line "Healthy".

**Log.** Columns as every Networking scene: Time (100), Source (176), Destination (176), Protocol (84), Info (prose), Size (76). Every time and every size is `—`. Protocol `HTTP` on every request, check and answer; `—` on a note. Legend, in this order: `request` "A reader’s request", `control` "Health check", `response` "Answer to a check", `note` "No answer in time" (new words, §7).

**Places** (`pool-parts.ts`): `laptop` (you), `reader2`, `reader3`, `balancer`, `a`, `b`, `c`. **Routes**, the only `from>to` a message may have: a reader to a server (`laptop>a` … `reader3>c`, nine; the balancer is passed through, not named), `balancer>a|b|c` (a check), `a|b|c>balancer` (an answer). **Cues**: `skip` (arg a server: the one whose turn it was, passed over) on a request; `no-answer` (arg a server) on a note. Both are text cues; the validator checks their args against `a`, `b`, `c` and the routes against the list (both generic, `define.ts`).

**Tags**: `REQUEST`, `CHECK`, `OK`. The driver finds the tag part by the tag's text, lower-cased (`#pl-tag-request`, `#pl-tag-check`, `#pl-tag-ok`); a tag with no part draws nothing.

### 3.1 The steps

Events in order. "→ table" rows are `table` updates of `pool` (`op: 'update'`, `key` the server). Plain lines and summaries marked † are new words (§7); the rest are the outline's.

**Step 1. One Address, Three Servers** · *You reach the balancer, not a server*

| # | Event | Log (src → dst · info) | Figure |
|---|---|---|---|
| 1 | message `laptop>a`, `REQUEST`, `request` | `198.51.100.23:61023` → `203.0.113.80:80` · "Your request, passed to server A" | your screen glows; the tag rides your cable to the balancer's top, A's light comes on, the tag rides to A's top |
| 2 | → table A: `Healthy`, `1` · summary "Server A has one request." | — | one chip on A, lit |

**Step 2. Spread Across the Pool** · *Each new request to the next server*

| # | Event | Log | Figure |
|---|---|---|---|
| 1 | message `reader2>b`, `REQUEST`, `request` | `198.51.100.41:50100` → `203.0.113.80:80` · "Reader 2’s request, passed to server B" | Reader 2's screen glows; B's light |
| 2 | → table B: `Healthy`, `1` · "Server B has one request." † | — | one chip on B, lit |
| 3 | message `reader3>c`, `REQUEST`, `request` | `192.0.2.25:52317` → `203.0.113.80:80` · "Reader 3’s request, passed to server C" | Reader 3's screen; C's light |
| 4 | → table C: `Healthy`, `1` · "Server C has one request." † | — | one chip on C, lit |

**Step 3. A Health Check Fails** · *Server B stops answering*

| # | Event | Log | Figure |
|---|---|---|---|
| 1 | message `balancer>a`, `CHECK`, `control` | `—` → `10.0.0.11:80` · "Health check: answer OK, in time" | the CHECK tag rides from the balancer's top to A's |
| 2 | message `a>balancer`, `OK`, `response` | `10.0.0.11:80` → `—` · "Server A: OK" | the OK tag rides back |
| 3 | message `balancer>b`, `CHECK`, `control` | `—` → `10.0.0.12:80` · "Health check: answer OK, in time" | to B |
| 4 | note, cue `no-answer: b` | `—` → `—` · "No answer from B in time" | a dashed ring fades in over B's top |
| 5 | → table B: `1 check missed`, `1` · "Server B missed a check." † | — | B's lamps green, red; its health line "1 check missed", a dashed green square |
| 6 | message `balancer>b`, `CHECK`, `control`, `fast` | `—` → `10.0.0.12:80` · "Health check: answer OK, in time" | to B, at half the time |
| 7 | note, cue `no-answer: b` | "No answer from B again: two in a row" | the ring again |
| 8 | → table B: `Unhealthy`, `1`, **`miss: true`** · "Server B is marked unhealthy." † | — | B's lamps red, red; "Unhealthy" in bold red, a filled red square; the table's B row gets the "unhealthy" mark |

**Step 4. Skipped While Unhealthy** · *New requests go to A and C*

| # | Event | Log | Figure |
|---|---|---|---|
| 1 | message `laptop>a`, `REQUEST` | `198.51.100.23:61024` → `203.0.113.80:80` · "Your next request, passed to server A" | as step 1 |
| 2 | → table A: `Healthy`, `2` · "Server A has two requests." † | — | two chips on A |
| 3 | message `reader2>c`, `REQUEST`, cue **`skip: b`** | `198.51.100.41:50101` → `203.0.113.80:80` · "B’s turn: B is unhealthy, so to server C" | the tag waits on the balancer while a red stop mark shows over B's port (700 ms), then C's light, then on to C |
| 4 | → table C: `Healthy`, `2` · "Server C has two requests." † | — | two chips on C |
| 5 | message `reader3>a`, `REQUEST` | `192.0.2.25:52318` → `203.0.113.80:80` · "Reader 3’s request, passed to server A" | to A |
| 6 | → table A: `Healthy`, `3` · "Server A has three requests." † | — | three chips on A |
| 7 | message `balancer>b`, `CHECK`, `control`, `fast` | `—` → `10.0.0.12:80` · "Health check: answer OK, in time" | the checks to B carry on |
| 8 | note, cue `no-answer: b` | "No answer from B" | the ring over B; B stays unhealthy (no table event) |

**Step 5. Healthy Again** · *B passes its checks and gets its turn*

| # | Event | Log | Figure |
|---|---|---|---|
| 1 | message `balancer>b`, `CHECK`, `control` | `—` → `10.0.0.12:80` · "Health check: answer OK, in time" | |
| 2 | message `b>balancer`, `OK`, `response` | `10.0.0.12:80` → `—` · "Server B: OK" | |
| 3 | → table B: `1 check passed`, `1`, **`miss: true`** (§2.3) · "Server B passed one check; it is still unhealthy." † | — | B's lamps red, green; "1 check passed" still bold red, a dashed red square; the mark stays |
| 4 | message `balancer>b`, `CHECK`, `control` | as 1 | |
| 5 | message `b>balancer`, `OK`, `response` | as 2 | |
| 6 | → table B: `Healthy`, `1` (no `miss`) · "Server B is healthy again." † | — | green, green; the mark goes |
| 7 | message `reader2>b`, `REQUEST` | `198.51.100.41:50102` → `203.0.113.80:80` · "B’s turn: passed to server B" | B's light |
| 8 | → table B: `Healthy`, `2` · "Server B has two requests." † | — | two chips on B |

Totals: 15 messages, 4 notes (the outline's 17 with step 4's optional check and note), 11 table updates. Plain lines: a request's is the outline's (step 1: "You ask example.net for its page; the balancer passes it to server A."; the others follow it, †). A check's: "The balancer checks server B." †; an answer's: "Server B answers OK, in time." †; a note's: its info and a full stop.

### 3.2 What the figure shows, from the table

The figure reads only the `pool` table. For each server, the row whose `server` is its letter:

| Health word | Lamps (older, newer) | Health line square | Words |
|---|---|---|---|
| `Healthy` | ok, ok | filled `--allowed` | ink |
| `1 check missed` | ok, miss | dashed outline `--allowed` | ink |
| `Unhealthy` | miss, miss | filled `--blocked` | bold, `--blocked` |
| `1 check passed` | miss, ok | dashed outline `--blocked` | bold, `--blocked` |
| any other, or no row | dark (no `data-check`) | hidden | none |

`Requests` → that many chips on the server's top (0 to 4; more shows 4; not a number shows 0).

**What lasts.** `show(view)` settles everything at once (no fades): the lamps, lines and chips from the table; for `view.landed` a request: its reader's screen glow, its server's light on the balancer and its server's newest chip lit; for `view.landed` a note with `no-answer`: its ring. Tags, the trail and skip marks never last.

### 3.3 Timing (ms at 1×; `fast` halves a leg)

| Event | Duration |
|---|---|
| table | 0 (lands with the event before it) |
| note with `no-answer` | 1,100 ring + 200 gap = 1,300 |
| note without | 200 |
| request (reader to server) | 1,000 reader leg + 450 pick (+ 700 skip) + 1,000 server leg + 300 rest + 200 gap = 2,950 (3,650 with a skip) |
| check or answer | 1,000 leg + 300 + 200 = 1,500 (1,000 when `fast`) |

Step lengths at 1×: 1: 2,950 · 2: 5,900 · 3: 8,100 · 4: 11,850 · 5: 8,950. Reduced motion: each ride jumps to its end at once (the trail drawn whole), the ring shows at once; the waits stay, so the log and table keep their pace.

## 4. Sizes, spacing and breakpoints

### 4.1 The figure (plate units, drawn at build time)

Camera: `k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 })`, the dhcp and net-map camera. Frame fitted afterwards to the plate, the tallest parts and every callout box: **`viewBox="-32 -49 589 335"`**.

| Part | Numbers |
|---|---|
| Plate | `{ x: -112, y: -80, w: 224, d: 160, r: 10 }`, 8 thick on a 3.4 foot. Engraved "ONE ADDRESS · THREE SERVERS"; floor words "THE INTERNET" (front) and "THE POOL" (end-anchored at the pool outline's front right), 5.4 px mono, letter-spacing .32em |
| Servers A, B, C | 30 × 22 × 44 at x −48, 6, 60 (pitch 54), y −70. Each: a letter (6.4 px mono), two lamps (`#pl-lamp-<s>-0`, `-1`, data-check `ok`/`miss`), four drive bays, vents, four chips on top (`#pl-chip-<s>-<i>` and lit copies `#pl-chip-lit-<s>-<i>`, 16 × 11 × 1.8, gap 0.6) |
| Pool outline | dashed, `{ x: -57, y: -75, w: 156, d: 38, r: 4 }` |
| Balancer | `{ x: -14, y: -26, w: 54, d: 24, r: 2.6 }` on a 2 plinth, 17 tall. Front: one in-port (x −2), a void window 30 wide holding "203.0.113.80" (3.3 px mono, `--lit-a`), three lights `#pl-pick-a/b/c` (`lm-led`, orange when on) with their letters. Back: three out-ports at x −2, 13, 28 |
| Laptops | 38 × 24, lid 25, at x −94, −32, 30, y 50; screens labelled YOU, READER 2, READER 3; a glow `#pl-glow-<reader>` (`--lit-b`, .45 when on) |
| Cables | tubes r 1 at z 1.3. In: each laptop's back down to y 38, a bus to the balancer's in-port. Out: each back port up to y −36 − 3i, across to the server's x, on to its front |
| Callouts | off the plate, 11.5 px mono uppercase name / 12.5 px mono address / 13 px sans health line (firewall's sizes). Servers: a column right of C, 62 apart. Balancer: right of its front corner. Readers: end-aligned under their laptops, the name only |
| Health line | an 8 × 8 square (rx 1) and the word 12 to its right, `#pl-health-<s>` / `#pl-health-t-<s>` |
| Moving parts | tags `#pl-tag-request`, `#pl-tag-check`, `#pl-tag-ok` (lit slabs 3.3 × letters + 10 wide, 12 deep, 3.6 tall); trail `#pl-trail` (dashed `--lit-a`, 1.6 px); ring `#pl-quiet-<s>` (r 13, dashed `--anatomy-hi`); skip `#pl-skip-<s>` (r 5 red disc with a white x, over the server's out-port) |

### 4.2 Measured (in the browser, light and dark)

| | Today: Firewalls | Today: DHCP | Load Balancers (prototype) |
|---|---|---|---|
| 1440 × 900: figure box | 733 × 313, scale 0.980 | 733 × 398, scale 1.098 | **733 × 347, scale 1.037** |
| 1440: panel under it | rules 185 tall | table 100 tall | table 151 tall, 3 rows, no inner scroll (150 of 150) |
| 1440: stage | 735 × 550 | | 735 × 550 |
| 375 × 812: figure box | 375 × 235, scale 0.575 | | **375 × 275, scale 0.637**, the same on every phone tab |
| 375: page width | 375 | | 375 (no sideways scroll, Lesson and Card art pages) |
| Lamp on screen | | | 4.6 × 7.9 at 1440; 2.8 × 4.9 at 375 |
| Health line words | | | 13.5 px at 1440; 8.3 px at 375 (Firewalls' callouts: 7.5 px at 375) |

### 4.3 Weight

| | Bytes |
|---|---|
| Driver `pool.ts`, minified, motion and tables external | 4,508 (2,074 gzipped). dhcp 4,646 (2,255); firewall 6,903 (2,934) |
| Figure SVG, in the lesson's HTML only | 149,862 (26,837 gzipped) |
| Spot SVG | 82,277 (18,424 gzipped) |

The driver imports only types from the drawing, so `pool.ts` (drawing) and its kit stay out of the page's JavaScript.

### 4.4 Breakpoints

None new. The figure scales with the stage as every scene does; the table panel, the log and the phone tabs keep the breakpoints they have today.

## 5. For the builder: every code change

Appendix A is the whole patch; apply it (`git apply`) on `job14/batch`, then write the tests below. In order:

1. **`src/art/scenes/pool-parts.ts`** (new, data only): `POOL_SERVERS`, `POOL_READERS`, `POOL_PLACES`, `POOL_CHIPS` (4), `POOL_ROUTES`, the table's id and column keys, and `POOL_HEALTH_WORDS` (§3.2). The driver and the validator read this file, never the drawing.
2. **`src/art/scenes/pool.ts`** (new): `drawPool()` returns `{ svg, data }`; `data` is `PoolSceneData { M, O, legs }` (the camera, the plate origin on screen, and one leg per reader and per server as plate points). `POOL_DESCRIPTION` is the figure's `aria-label`.
3. **`src/art/scenes/pool.css`** (new): §2.2's lamps and health line, the callouts, tags, trail, ring and skip mark. Imported by `pool.ts`.
4. **`src/scenes/drivers/pool.ts`** (new): `poolDriver { create, duration }` (§3.2, §3.3). Two details the prototype fixed and the patch has: a tag is placed at its leg's start before it is shown (else it shows a frame at the plate's origin); the trail's points add `O`, because the tags are drawn at the origin and moved by `translate`, while the trail is drawn in the figure's own frame.
5. **Registration**: `FigureId` gains `'pool'` (`types.ts`; its comments now say args "(osi and pool)" and routes "(dhcp, osi and pool)"); `figureIdSchema` gains `'pool'` (`schema.ts`); `DRAW` (`scenes/index.ts`) and `DRIVERS` (`drivers/index.ts`) gain `pool`; `FIGURE_PARTS.pool = { places: POOL_PLACES, cues: { skip: 'text', 'no-answer': 'text' }, args: { skip: POOL_SERVERS, 'no-answer': POOL_SERVERS }, routes: POOL_ROUTES, layers: [], board: false, start: false }` (`parts.ts`); `FIXTURE_PARTS.pool` (`test-fixtures.ts`); `'pool'` in the id lists of `parts.test.ts` and `index.test.ts`.
6. **The spot**: `loadBalancersSpot()` in `spots.ts`, `'load-balancers'` in `SPOTS` and its `DRAW`; `'load-balancers': () => spot('load-balancers')` in `src/lib/figures.ts`; `'spot:load-balancers': '6684065e…d427'` in `figures.test.ts` `EXPECTED` (the full hash is in the patch).
7. **Tests to add** (the patch has none for the new code):
   - `src/art/scenes/pool.test.ts`: the svg has every id the driver looks up (`pl-tag-request|check|ok`, `pl-trail`, `pl-glow-<3 readers>`, and per server `pl-pick-`, `pl-quiet-`, `pl-skip-`, `pl-lamp-<s>-0/1`, `pl-health-`, `pl-health-t-`, 4 `pl-chip-` and 4 `pl-chip-lit-`); `data-figure="pool"`; the `aria-label` is `POOL_DESCRIPTION`; the viewBox is `-32 -49 589 335`; `data.legs` has the six keys, each starting and ending where §3.2 says; the svg has no "proxy" (any case).
   - `src/scenes/drivers/pool.test.ts` (jsdom, the dhcp driver test's shape): `duration` for each row of §3.3; `show` paints each health word of §3.2 and the chip counts (0, 1, 4, 7 → 4, "x" → 0); `show` with a landed request lights exactly one glow, one pick light and one lit chip; with a landed `no-answer` note, that server's ring; a `play` of a table event paints the rows after it; an aborted `play` leaves no tag, trail or skip mark showing after the next `show`.
   - The lesson's own tests come with the lesson (the author's file); its validation exercises the routes and the cue args.

**Not changed**: `net-map.ts`, `dhcp.ts`, `subnet.ts`, `firewall.ts`, their drivers and CSS; `common.ts`; `tokens.ts`; `LogPanel`, `TablePanel`, `ScenePanel`, the engine and `define.ts`.

**JavaScript budget**: the lesson page adds the pool driver (2,074 B gzipped) to the shared scene code; check the page against the 200 KB gzipped budget with the budget script the build runs today.

## 6. The card art

`spot('load-balancers')`, drawn at 528 × 372 (`viewBox="36 44 528 372"`), the family of the other Networking spots: one plate, one solid object group, one lit part.

- **The balancer** in front, low and wide (`{ x: -84, y: 24, w: 68, d: 30 }`, 19 tall on a 2.4 plinth): six vents on its top, a void window 40 wide holding "203.0.113.80" (`lm-addr`), and three lights, C's on (`lm-led on`, the one orange light).
- **One cable in** from the plate's left edge; **a fan of three cables** out of its back to the three servers.
- **The pool** behind, in a dashed outline: three servers 30 × 24 × 56 at x −38, 12, 62, each with a letter (`lm-pkt-t`), five drive slots, and two lamps: A's and C's green (`lm-rule-ok`), **B's both red** (`lm-rule-no`).
- **The lit part**: a request slab (`{ x: 68, y: -24, w: 18, d: 13 }`, `data-lit`) on C's cable, on its way to C.
- Label "ONE ADDRESS · THREE SERVERS". `aria-label`: "A load balancer at the front with one cable coming in, and behind it a pool of three servers, A, B and C, each cabled to it. Server B’s two lamps are red. A lit request rides the cable to server C."

On the track route it replaces stop 19's "Not ready yet" tile: the spot, "Load Balancers", "One address, many servers", Start and the stamp. The prototype shows "Not checked yet"; the built card shows the fact-check's date once the lesson passes, as every card does.

## 7. Copy

Words that state a fact are the outline's; **new words** are the designer's and are marked. Sentence case, no time figures.

| Where | Words | Source |
|---|---|---|
| Scene title (stage head) | example.net’s three servers | **new words** |
| Plate engraving | ONE ADDRESS · THREE SERVERS | step 1's title |
| Floor words | THE INTERNET · THE POOL | **new words** ("pool" is the outline's term) |
| Laptop screens | YOU · READER 2 · READER 3 | the outline's names |
| Reader callouts | You · Reader 2 · Reader 3 | the outline's names |
| Balancer callout | Load balancer · example.net · 203.0.113.80 | the outline |
| Server callouts | Server A · 10.0.0.11 (and B, C) · the Health cell | the outline |
| Tags | REQUEST · CHECK · OK | the outline |
| Log legend | A reader’s request · Health check · Answer to a check · No answer in time | **new words** |
| Table | The pool · kept by the balancer · unhealthy (the mark) · Server, Address, Health, Requests | the brief |
| Table, empty | No servers yet. | **new words** (never shown: the table starts with three rows) |
| Health words | Healthy · 1 check missed · Unhealthy · 1 check passed | the outline |
| Log info, step lines, facts, plain lines of requests | §3.1 | the outline |
| Plain lines of checks, answers; table summaries after step 1 | §3.1, marked † | **new words** |
| Figure `aria-label` | A load balancer on one plate. In front, out on the internet, three readers’ laptops, their cables meeting at the balancer in the middle, whose address all three use. Behind it, in the pool, three servers, A, B and C, each cabled to the balancer, each with two lamps for its last two health checks. | **new words** |
| Spot label and `aria-label` | §6 | **new words** |
| Card | Load Balancers · One address, many servers | the outline's Overview |
| Overview hook | as the outline's, with “it checks every server all the time” changed to “it checks every server again and again” (checks run at an interval) | the outline; the analyst's ruling on the prototype's words (L27-w, ruling 1) |
| Badge | OSI layers 4 and 7 (chips 4 and 7) · Lesson 19 of 20 | ruling 10; the track |

The prototype's own chrome ("D13c prototype", its switches, the placeholder notes) is not for the builder.

## 8. Acceptance checks

Each can be tried on the prototype and turned into a test.

1. The lesson's unit validates with `figure: 'pool'`: every message's `from>to` is in `POOL_ROUTES`; `skip` and `no-answer` take only `a`, `b`, `c`; a route like `laptop>balancer` or `a>b` is refused, as is `skip: d`.
2. At 1440 × 900 the figure box is 733 wide and 347 ± 4 tall, and the 3-row table under it shows without an inner scroll.
3. At 375 × 812 the figure is 375 wide and 275 ± 4 tall on every phone tab; the page never scrolls sideways (Lesson and Card art).
4. Overview: six green lamps, no chips, "Healthy" three times, no glow, no light on the balancer, no ring.
5. Step 1, played: your screen glows, the REQUEST tag rides to the balancer's top, A's light comes on, the tag rides to A, one chip on A lights; the log has 1 row (src `198.51.100.23:61023`, dst `203.0.113.80:80`), the table A `1`.
6. Step 1, settled (picked from the outline, not played): the same end state as 5, with no tag or trail showing.
7. Step 3, settled: B's lamps both red, its health line "Unhealthy" bold in `--blocked` with a filled square; the table's B row carries the "unhealthy" mark; the ring shows over B; the log has 9 rows, the last "No answer from B again: two in a row".
8. Step 3 at its 5th event: B's lamps green then red, its line "1 check missed" with a dashed green square; no mark in the table.
9. Step 4, played: at its 3rd event the tag waits on the balancer while the red stop mark shows over B's port, then C's light comes on and the tag rides to C; the skip mark is gone when the next event starts.
10. Step 4, settled: chips A 3, B 1, C 2; B still unhealthy and marked; the ring over B; 14 log rows.
11. Step 5 at its 3rd event: B's lamps red then green, "1 check passed" still bold red with a dashed red square, and the table's mark still on B.
12. Step 5, settled: all six lamps green, every line "Healthy", no mark; chips A 3, B 2, C 2; B's light on the balancer and Reader 2's screen lit; 19 log rows.
13. A check row's Source is `—` and its Destination the server's address and `:80`; an answer's Source the server's address and `:80`, Destination `—`; every Time and Size is `—`.
14. Log glyphs: a request a blue square, a check a purple diamond, an answer a brown arrow, a note the muted "i"; the legend lists those four in that order.
15. Pausing or picking a step mid-ride leaves no tag, trail or skip mark showing.
16. Reduced motion: every step ends in the same state as with full motion; no tag slides (each ride jumps to its end).
17. Both themes: the callouts and health words follow the theme; the lamps, chips and screens on the plate look the same in both.
18. No word "proxy" (any case) in the lesson's file, the figure's SVG, its CSS, the driver or the spot.
19. The spot has one `data-lit` part and one `lm-led on`; `figures.test.ts` matches its hash; on the track page stop 19 shows the spot, "Load Balancers", "One address, many servers" and Start.
20. Nothing in an existing figure changes: `drawNetMap()`, `drawDhcp()`, `drawSubnet()`, `drawFirewall()` and `drawOsi()` return the same svg and data before and after the patch.

## 9. Open questions for the owner

1. **Readers without addresses on the figure** (§2.6). Ruling 2's laptop branch (`192.168.1.100:50422`) would show a private address reaching a public balancer, against NAT's checked lesson. The design keeps the public addresses in the log and names the readers only on the figure. Agree?
2. **The mark through "1 check passed"** (§2.3): the update carries `miss: true`, a change to the outline's event, so the table never shows B unmarked while it is unhealthy. For the analyst's read before the gate.
3. **Two lamps in place of amber** (§2.2): no new token; the in-between state is one green and one red lamp plus the words. Agree?

## Appendix A. The patch

Made on `job14/batch` at `9807155`. Apply with `git apply`; it adds four files and changes eleven.

````diff
diff --git a/src/art/figures/figures.test.ts b/src/art/figures/figures.test.ts
index 4ba78f7..5d1fbed 100644
--- a/src/art/figures/figures.test.ts
+++ b/src/art/figures/figures.test.ts
@@ -64,6 +64,7 @@ const EXPECTED: Record<string, string> = {
   'cover:aplus': 'fa694d51b69b6eb9ce3fea6ad1f361e2c2160b4f029340f71ecb8092b24fcc11',
   'spot:watch': 'b0a517894e64f146f1a7060c7c5c4163801f74c954703beb08ea5f2aad207cb5',
   'spot:learn': 'f48b830a8519b1d2c7f2d69bdc5fd5ea12a334eb33555ee9b71e0c859dedf66e',
+  'spot:load-balancers': '6684065e6029fb918e792c3b8daf2d2847ab835c7ea535bc29124a341119d427',
   'spot:practice': '3d5e9a1240082e5e5d920c4b69bae94c3ea2be1bf0e4394e6e4de204c794dc30',
   'spot:subnet': '841d398bd78c4e35fc5f47fea35060e97ddad297312b9138429c778cc083ba1b',
   'spot:dhcp': 'f78beddc71e112c7aa568d07a3a9d4e24a5acdc31dcc58147b3ab59421177a21',
diff --git a/src/art/figures/spots.ts b/src/art/figures/spots.ts
index 5f9625b..25e1061 100644
--- a/src/art/figures/spots.ts
+++ b/src/art/figures/spots.ts
@@ -357,10 +357,42 @@ function tcpUdpSpot() {
   return figure("tcp-udp", "TCP · UDP", out.join(""), "Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back.");
 }
 
-export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp'] as const;
+// Load Balancers: one balancer in front, a pool of three servers behind it, cabled in a fan. Server B's lamps are red;
+// a lit request rides the cable to C.
+function loadBalancersSpot() {
+  const out = [], SW = 30, SD = 24, SH = 56, SY = -58;
+  const SVS = [-38, 12, 62].map((x) => ({ x, y: SY, w: SW, d: SD, r: 1.8 }));
+  const BX = { x: -84, y: 24, w: 68, d: 30, r: 2.8 }, BZ = 2.4, BH = 19;
+  const outs = [BX.x + 16, BX.x + 32, BX.x + 48];
+  // The pool's outline on the floor, the cable in from the left edge, and the fan of cables out to the servers.
+  out.push(L(k.planOutline({ x: -48, y: SY - 6, w: 150, d: SD + 20, r: 4 }, 0, P, 4), { tone: "lo", dashed: true }));
+  const fan = SVS.map((B, i) => [[outs[i], BX.y - 3], [outs[i], -6 - i * 4], [B.x + SW / 2, -6 - i * 4], [B.x + SW / 2, SY + SD + 3]]);
+  out.push(tubeOf([[[-112, 42], [BX.x - 3, 42]], ...fan].flatMap((pts) => tubePieces(pts.map(([x, y]) => [x, y, 1.4]), 1.3, P, { maxLength: 14 }))));
+  // The servers: a letter, two lamps for the last two checks (B's both red), drive bays.
+  for (const [i, B] of SVS.entries()) {
+    const ok = i !== 1, F = B.y + B.d;
+    out.push(S(k.slabOf({ x: B.x - 2.6, y: B.y - 2.6, w: SW + 5.2, d: SD + 5.2, r: 2 }, 0, 1.8, P, 3, 0.4), { tone: "lo" }));
+    out.push(S(k.slabOf(B, 1.8, SH - 1.8, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(B, SH - 10, P, 3), { tone: "faint" }) }));
+    let face = `<text class="lm-pkt-t" x="${n1(B.x + 3.4)}" y="${n1(-(SH - 7.4))}">${"ABC"[i]}</text>`;
+    face += [0, 1].map((n) => `<circle class="lm-rule-${ok ? "ok" : "no"}" cx="${n1(B.x + SW - 11 + n * 6.4)}" cy="${n1(-(SH - 5.4))}" r="2"/>`).join("");
+    for (let b = 0; b < 5; b++) face += rect("lm-slot", B.x + 3.4, SH - 17 - b * 7, SW - 7, 3.4, 0.5);
+    out.push(onFaceY(F, face));
+  }
+  // The balancer: a port at its left for the cable in, its address in a window, a light for each server, C's on.
+  out.push(S(k.slabOf({ x: BX.x - 3, y: BX.y - 3, w: BX.w + 6, d: BX.d + 6, r: 3 }, 0, BZ, P, 4, 0.5), { tone: "lo" }));
+  out.push(S(k.slabOf(BX, BZ, BH - BZ, P, 4, 0.7), { tone: "hi", inner: L(k.sideSeam(BX, BZ + 3.4, P, 4), { tone: "faint" }) }));
+  for (let v = 0; v < 6; v++) out.push(L(k.planOutline({ x: BX.x + 8 + v * 8, y: BX.y + 4, w: 2.6, d: 9, r: 1.3 }, BH, P, 3), { tone: "lo" }));
+  out.push(onFaceY(BX.y + BX.d, rect("lm-void", BX.x + 6, BZ + 7, 40, 7, 0.8) + `<text class="lm-addr" x="${n1(BX.x + 8.4)}" y="${n1(-(BZ + 9))}">203.0.113.80</text>`));
+  out.push(`<g class="lm-leds">${[0, 1, 2].map((i) => dot(at([BX.x + 52 + i * 5.6, BX.y + BX.d, BZ + 10.4]), "lm-led" + (i === 2 ? " on" : ""), 1.2)).join("")}</g>`);
+  // The request on its way to server C: the lit part.
+  out.push(S(k.slabOf({ x: 68, y: -24, w: 18, d: 13, r: 1.4 }, 2.8, 5.4, P, 3, 0.5), { tone: "hi", lit: true }));
+  return figure("load-balancers", "ONE ADDRESS · THREE SERVERS", out.join(""), "A load balancer at the front with one cable coming in, and behind it a pool of three servers, A, B and C, each cabled to it. Server B’s two lamps are red. A lit request rides the cable to server C.");
+}
+
+export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'load-balancers'] as const;
 export type SpotKind = (typeof SPOTS)[number];
 
-const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot };
+const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot, 'load-balancers': loadBalancersSpot };
 
 /** A small figure, cropped close to its plate. */
 export const spot = (kind: SpotKind): string => DRAW[kind]();
diff --git a/src/art/scenes/index.test.ts b/src/art/scenes/index.test.ts
index f72bd57..01c5be4 100644
--- a/src/art/scenes/index.test.ts
+++ b/src/art/scenes/index.test.ts
@@ -7,7 +7,7 @@ import type { FigureId } from './types';
 // and has no film grain (ruling R2).
 test('every scene figure draws with data-figure, role="img", a non-empty aria-label and no grain', () => {
   const ids = figureIdSchema.options as readonly FigureId[];
-  expect([...ids].sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet']);
+  expect([...ids].sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'pool', 'subnet']);
   for (const id of ids) {
     const { svg } = drawFigure(id);
     const root = /^<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
diff --git a/src/art/scenes/index.ts b/src/art/scenes/index.ts
index 14a7a21..ec26133 100644
--- a/src/art/scenes/index.ts
+++ b/src/art/scenes/index.ts
@@ -2,6 +2,7 @@ import { drawDhcp } from './dhcp';
 import { drawFirewall } from './firewall';
 import { drawNetMap } from './net-map';
 import { drawOsi } from './osi';
+import { drawPool } from './pool';
 import { drawSubnet } from './subnet';
 import type { DrawnFigure, FigureId } from './types';
 
@@ -12,6 +13,7 @@ const DRAW: Record<FigureId, () => DrawnFigure> = {
   firewall: drawFirewall,
   'net-map': drawNetMap,
   osi: drawOsi,
+  pool: drawPool,
 };
 
 /** Draws a scene figure at build time: its SVG markup and the data its driver reads. */
diff --git a/src/art/scenes/parts.test.ts b/src/art/scenes/parts.test.ts
index 01875c3..67d99ca 100644
--- a/src/art/scenes/parts.test.ts
+++ b/src/art/scenes/parts.test.ts
@@ -4,7 +4,7 @@ import { FIGURE_PARTS } from './parts';
 
 test('FIGURE_PARTS has an entry for each figure id the schema accepts, and no other', () => {
   expect(Object.keys(FIGURE_PARTS).sort()).toEqual([...figureIdSchema.options].sort());
-  expect(Object.keys(FIGURE_PARTS).sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet']);
+  expect(Object.keys(FIGURE_PARTS).sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'pool', 'subnet']);
 });
 
 test('every figure’s parts are well formed', () => {
diff --git a/src/art/scenes/parts.ts b/src/art/scenes/parts.ts
index 1afec2c..b2fe336 100644
--- a/src/art/scenes/parts.ts
+++ b/src/art/scenes/parts.ts
@@ -1,5 +1,6 @@
 import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_ROUTERS, plateSites } from './net-map-layers';
 import { OSI_CUE_ARGS, OSI_ROUTES, OSI_WORDS } from './osi-stacks';
+import { POOL_PLACES, POOL_ROUTES, POOL_SERVERS } from './pool-parts';
 import type { FigureId, FigureParts } from './types';
 
 /**
@@ -79,4 +80,16 @@ export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
     start: false,
     labels: true,
   },
+  pool: {
+    places: POOL_PLACES,
+    // A request rides through the balancer to a server; a check rides from the balancer to a server, its answer back
+    // (src/scenes/drivers/pool.ts). `skip` names a server the balancer passes over on a request; `no-answer`, on a
+    // note, the server that did not answer a check in time.
+    cues: { skip: 'text', 'no-answer': 'text' },
+    args: { skip: POOL_SERVERS, 'no-answer': POOL_SERVERS },
+    routes: POOL_ROUTES,
+    layers: [],
+    board: false,
+    start: false,
+  },
 };
diff --git a/src/art/scenes/pool-parts.ts b/src/art/scenes/pool-parts.ts
new file mode 100644
index 0000000..7a736e0
--- /dev/null
+++ b/src/art/scenes/pool-parts.ts
@@ -0,0 +1,37 @@
+// What the Load Balancers figure (src/art/scenes/pool.ts) draws, as data only, so the lesson validator (parts.ts) and the
+// driver (src/scenes/drivers/pool.ts) can read it without drawing it.
+
+/** The servers in the pool, in the order the balancer takes them. */
+export const POOL_SERVERS = ['a', 'b', 'c'] as const;
+/** The readers, front left to front right: your laptop, then two others. */
+export const POOL_READERS = ['laptop', 'reader2', 'reader3'] as const;
+export const POOL_PLACES = [...POOL_READERS, 'balancer', ...POOL_SERVERS];
+/** How many chips a server's top holds: a request count above it shows this many. */
+export const POOL_CHIPS = 4;
+
+/**
+ * The only ways a message rides: a reader's request through the balancer to a server, a health check from the balancer
+ * to a server, and a server's answer back to the balancer.
+ */
+export const POOL_ROUTES = [
+  ...POOL_READERS.flatMap((r) => POOL_SERVERS.map((s) => `${r}>${s}`)),
+  ...POOL_SERVERS.flatMap((s) => [`balancer>${s}`, `${s}>balancer`]),
+];
+
+/** The panel table the figure reads, its key column (A, B or C) and the columns it shows. */
+export const POOL_TABLE = 'pool';
+export const POOL_KEY = 'server';
+export const POOL_HEALTH = 'health';
+export const POOL_REQUESTS = 'requests';
+
+/**
+ * Each word the Health column may hold, and what the figure shows for it: the server's two lamps (its last two checks,
+ * the older first), and its health line: the balancer's verdict (`state`), and whether the last check has gone the
+ * other way without changing it yet (`turning`). Any other word leaves the lamps dark and the line empty.
+ */
+export const POOL_HEALTH_WORDS: Readonly<Record<string, { lamps: readonly ['ok' | 'miss', 'ok' | 'miss']; state: 'healthy' | 'unhealthy'; turning: boolean }>> = {
+  Healthy: { lamps: ['ok', 'ok'], state: 'healthy', turning: false },
+  '1 check missed': { lamps: ['ok', 'miss'], state: 'healthy', turning: true },
+  Unhealthy: { lamps: ['miss', 'miss'], state: 'unhealthy', turning: false },
+  '1 check passed': { lamps: ['miss', 'ok'], state: 'unhealthy', turning: true },
+};
diff --git a/src/art/scenes/pool.css b/src/art/scenes/pool.css
new file mode 100644
index 0000000..af2b421
--- /dev/null
+++ b/src/art/scenes/pool.css
@@ -0,0 +1,42 @@
+/* The Load Balancers scene's own parts (src/art/scenes/pool.ts). The callouts sit on the page's figure background, so
+   they take the site's ink and line tokens and follow the theme; the parts on the plate take the lumen finish's tokens
+   and stay the same in both themes. The health lamps on the charcoal figure keep Firewalls' fixed green and red, which
+   mean the same in both themes; the words beside them (the callout, the pool table) say the same, so colour is never
+   the only signal. */
+.pl { --fixed-allow: #3ddc7c; --fixed-deny: #ff4f4f; }
+.pl .pl-call .pl-name { font: 700 11.5px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; fill: var(--ink-strong); }
+.pl .pl-call .pl-sub { font: 400 13px/1 var(--sans); fill: var(--muted); }
+.pl .pl-call .pl-addr { font: 500 12.5px/1 var(--mono); fill: var(--ink); }
+.pl .pl-lead { fill: none; stroke: var(--line-strong); stroke-width: 1px; }
+.pl .pl-lead-dot { fill: var(--muted); }
+.pl .pl-floor { font: 700 5.4px var(--mono); letter-spacing: .32em; fill: var(--anatomy-mid); opacity: .7; }
+.pl .pl-glow { fill: var(--lit-b); opacity: 0; transition: opacity 300ms ease; }
+.pl .pl-glow.on { opacity: .45; }
+.pl .pl-scr { font: 700 3.3px var(--mono); fill: var(--lit-a); letter-spacing: .04em; }
+.pl .pl-scr-s { font: 700 2.4px var(--mono); fill: var(--anatomy-mid); letter-spacing: .06em; }
+.pl .pl-led-t { font: 700 2.2px var(--mono); fill: var(--anatomy-mid); }
+.pl .pl-letter { font: 700 6.4px var(--mono); fill: var(--anatomy-hi); }
+/* A health lamp: green for a check answered in time, red for one that was not. */
+.pl .pl-lamp { fill: #2e343e; transition: fill 200ms ease; }
+.pl .pl-lamp[data-check="ok"] { fill: var(--fixed-allow); filter: drop-shadow(0 0 1.4px var(--fixed-allow)); }
+.pl .pl-lamp[data-check="miss"] { fill: var(--fixed-deny); filter: drop-shadow(0 0 1.4px var(--fixed-deny)); }
+/* The health line in a server's callout: the square is the balancer's verdict, green while healthy and red while
+   unhealthy, filled while the last two checks agree and a dashed outline while the last one has gone the other way.
+   The words are the pool table's own. */
+.pl .pl-health-t { font: 500 13px/1 var(--sans); fill: var(--ink); }
+.pl .pl-health-mark { fill: none; stroke: var(--muted); stroke-width: 1.4px; vector-effect: non-scaling-stroke; }
+.pl .pl-health:not([data-health]) { display: none; }
+.pl .pl-health[data-health="healthy"] .pl-health-mark { fill: var(--allowed); stroke: var(--allowed); }
+.pl .pl-health[data-health="unhealthy"] .pl-health-mark { fill: var(--blocked); stroke: var(--blocked); }
+.pl .pl-health[data-health="unhealthy"] .pl-health-t { fill: var(--blocked); font-weight: 700; }
+.pl .pl-health[data-turning] .pl-health-mark { fill: none; stroke-dasharray: 2 1.5; }
+.pl .pl-tag { will-change: transform; }
+.pl .pl-tag-t { font: 700 4.6px var(--mono); fill: color-mix(in srgb, var(--lit-b) 30%, #000); letter-spacing: .03em; }
+.pl .pl-trail { fill: none; stroke: var(--lit-a); stroke-width: 1.6px; stroke-dasharray: 2 3; vector-effect: non-scaling-stroke; }
+.pl .pl-quiet-r { fill: none; stroke: var(--anatomy-hi); stroke-width: 1.4px; stroke-dasharray: 3 3; vector-effect: non-scaling-stroke; }
+.pl .pl-skip-d { fill: var(--fixed-deny); stroke: #fff; stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
+.pl .pl-skip-x { fill: none; stroke: #fff; stroke-width: 1.6px; stroke-linecap: round; vector-effect: non-scaling-stroke; }
+/* While the driver's show settles the figure, every part changes at once (src/scenes/drivers/pool.ts). */
+.pl[data-settling] * { transition: none !important; }
+/* Reduced motion keeps every lamp, chip and word, and only drops the fades. */
+@media (prefers-reduced-motion: reduce) { .pl .pl-glow, .pl .pl-lamp { transition: none; } }
diff --git a/src/art/scenes/pool.ts b/src/art/scenes/pool.ts
new file mode 100644
index 0000000..66a6dd4
--- /dev/null
+++ b/src/art/scenes/pool.ts
@@ -0,0 +1,242 @@
+// @ts-nocheck -- drawing code in the scenes' own style; the checksum test in pool.test.ts pins its output, so it is not typed line by line.
+// The Load Balancers lesson's scene: one plate, drawn as a bow tie of cables. In front, out on the internet, three
+// readers' laptops; their cables meet at the load balancer in the middle, the one address they all use. Behind it, in
+// the pool, three servers, A, B and C, each cabled to the balancer. Each server carries its last two health checks as
+// two lamps on its front, and a chip on its top for every request the balancer has passed it. The driver
+// (src/scenes/drivers/pool.ts) rides the tags along the cables, stops each request on the balancer while it picks a
+// server, lights the lamps from the pool table and stacks the chips; this module draws them and says where they are.
+// Its ids carry a `pl-` prefix, so they stay unique on the page.
+import type { DrawnFigure } from './types';
+import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
+import { POOL_CHIPS, POOL_READERS, POOL_SERVERS } from './pool-parts';
+import './pool.css';
+
+/** A point on the plate: x, y and the height z. */
+type Point = [number, number, number];
+
+
+/** What the driver reads: the camera, its origin, and the legs a tag rides. */
+export interface PoolSceneData {
+  /** The camera as six numbers: on screen, x = M[0]·x + M[1]·y + M[2]·z and y = M[3]·x + M[4]·y + M[5]·z, from the origin. */
+  M: number[];
+  /** The plate's origin on screen, where the moving parts are drawn before they are moved. */
+  O: [number, number];
+  /**
+   * The legs a tag rides, as points on the plate. A reader's leg runs from its screen along its cable to the top of the
+   * balancer, where a request waits while the balancer picks; a server's leg runs from the top of the balancer along
+   * that server's cable to the top of its chip stack. A request rides its reader's leg, then its server's; a check
+   * rides a server's leg; an answer rides it backwards.
+   */
+  legs: Record<(typeof POOL_READERS)[number] | (typeof POOL_SERVERS)[number], Point[]>;
+}
+
+const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
+const PL = { x: -112, y: -80, w: 224, d: 160, r: 10 };
+// The pool, at the back: three server cabinets in a row, inside an engraved outline.
+const SV_W = 30, SV_D = 22, SV_H = 44, SV_PITCH = 54, SV_Y = -70, SV_X0 = -48;
+const SV = POOL_SERVERS.map((_, i) => ({ x: SV_X0 + i * SV_PITCH, y: SV_Y, w: SV_W, d: SV_D, r: 1.8 }));
+const POOL = { x: SV_X0 - 9, y: SV_Y - 5, w: 2 * SV_PITCH + SV_W + 18, d: SV_D + 16, r: 4 };
+// The balancer, in the middle: a low box on a plinth, one port in front, three behind.
+const BL = { x: -14, y: -26, w: 54, d: 24, r: 2.6 }, BL_Z = 2, BL_H = 17;
+const BL_IN = [BL.x + 12, BL.y + BL.d];
+const BL_OUT = [BL.x + 12, BL.x + 27, BL.x + 42].map((x) => [x, BL.y]);
+const BL_TOP = [BL.x + BL.w / 2, BL.y + BL.d / 2, BL_H + 1.2];
+// The readers, in front: three laptops in a row, their screens facing out.
+const LP_W = 38, LP_D = 24, LP_Z = 3, LP_LID = 25, LP_Y = 50;
+const LP = POOL_READERS.map((_, i) => ({ x: -94 + i * 62, y: LP_Y, w: LP_W, d: LP_D, r: 3.4 }));
+const CABLE_R = 1, CABLE_Z = 1.3, RIDE = CABLE_Z + CABLE_R + 0.4;
+// A chip on a server's top for each request it has been passed.
+const CHIP = { w: 16, d: 11, h: 1.8, gap: 0.6 };
+
+// One camera, the same as the DHCP and network map scenes'. The frame is fitted afterwards to the plate, the tallest
+// parts and the callouts, which sit off the plate on the page's own background, so they read in both themes.
+const P = k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 });
+const V = G.viewOf(P);
+const at = (p) => k.iso(p, P);
+const depth = (p) => k.depthOf(p, P);
+const byDepth = (list) => [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
+const onFaceY = (Y, inner) => `<g transform="${k.sideMatrix([0, Y], 0, P, "left")}">${inner}</g>`;
+const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
+const tubeOf = (pieces, tone = "hi") => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone })).join("");
+const rect = (cls, u, z, w, h, rx = 0.6, extra = "") => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"${extra}/>`;
+const dot = ([x, y], cls, r = 1.2, extra = "") => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"${extra}/>`;
+const upper = (id) => id.toUpperCase();
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
+  over.push(L(k.planOutline(k.insetPlan(PL, 4), 0, P), { tone: "lo" }));
+  const screws = k.corners(PL, 9);
+  over.push(L(screws.map(([x, y]) => k.ring(x, y, 2.1, 0, P, 18)).join(""), { tone: "lo" }));
+  over.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.6, tone: "mid" }));
+  over.push(k.faceTextSvg(k.sideMatrix([PL.x + PL.w - 22, PL.y + PL.d], -3.2, P, "left"), label, { size: 3.6, tone: "mid", anchor: "end" }));
+  // The pool's outline on the floor, and which side is which, engraved.
+  over.push(L(k.planOutline(POOL, 0, P, 4), { tone: "lo", dashed: true }));
+  over.push(onTopAt(0, `<text class="pl-floor" x="${POOL.x + POOL.w - 3}" y="${POOL.y + POOL.d - 3}" text-anchor="end">THE POOL</text><text class="pl-floor" x="${LP[0].x}" y="${LP_Y + LP_D + 8}">THE INTERNET</text>`));
+  return { under, over: over.join("") };
+}
+
+// ---------- A reader's laptop ----------
+function laptop(LB, id, label) {
+  const out = [];
+  out.push(S(k.slabOf(LB, 0, LP_Z, P, 5, 0.8), { tone: "hi" }));
+  const keysX = 7, keysY = 3, pitch = (LB.w - 10) / keysX;
+  let keys = "";
+  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 5 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LP_Z, P, 3);
+  out.push(L(keys, { tone: "lo" }));
+  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.2, r: 1 };
+  out.push(S(k.slabOf(LID, LP_Z, LP_LID, P, 3, 0.5), { tone: "hi" }));
+  const x0 = LID.x + 2.6, w = LID.w - 5.2, z0 = LP_Z + 2.6, h = LP_LID - 5.2;
+  let scr = rect("lm-void", x0, z0, w, h, 0.8) + rect("pl-glow", x0, z0, w, h, 0.8, ` id="pl-glow-${id}"`);
+  scr += rect("lm-slot", x0 + 2, z0 + h - 5, w - 4, 3, 0.8) + `<text class="pl-scr-s" x="${n1(x0 + 3.6)}" y="${n1(-(z0 + h - 4.1))}">${label}</text>`;
+  for (let i = 0; i < 3; i++) scr += rect("lm-slot", x0 + 3, z0 + h - 10.4 - i * 4.4, w - 6 - (i === 2 ? 9 : 0), 2, 0.8);
+  out.push(onFaceY(LID.y + LID.d, scr));
+  return out.join("");
+}
+
+// ---------- The load balancer: one port in front, three behind, its address on its face ----------
+function balancer() {
+  const out = [], F = BL.y + BL.d;
+  out.push(S(k.slabOf({ x: BL.x - 3, y: BL.y - 3, w: BL.w + 6, d: BL.d + 6, r: 3 }, 0, BL_Z, P, 4, 0.5), { tone: "lo" }));
+  out.push(S(k.slabOf(BL, BL_Z, BL_H - BL_Z, P, 4, 0.7), { tone: "hi", inner: L(k.sideSeam(BL, BL_Z + 3.2, P, 4), { tone: "faint" }) }));
+  // Vents on the top, at the back.
+  for (let i = 0; i < 6; i++) out.push(L(k.planOutline({ x: BL.x + 6 + i * 6.4, y: BL.y + 3, w: 2.4, d: 7, r: 1.2 }, BL_H, P, 3), { tone: "lo" }));
+  // The front: the port the internet comes in on, the address in a window, and a light for each server it can pick.
+  let face = rect("lm-slot", BL_IN[0] - 4, BL_Z + 2.6, 8, 5.4, 0.8) + rect("lm-inlay", BL_IN[0] - 4.8, BL_Z + 1.8, 9.6, 7, 1);
+  face += rect("lm-void", BL.x + 20, BL_Z + 6, 30, 7, 0.8) + `<text class="pl-scr" x="${n1(BL.x + 35)}" y="${n1(-(BL_Z + 8.2))}" text-anchor="middle">203.0.113.80</text>`;
+  POOL_SERVERS.forEach((s, i) => {
+    const u = BL.x + 26 + i * 8;
+    face += `<circle class="lm-led" id="pl-pick-${s}" cx="${n1(u)}" cy="${n1(-(BL_Z + 2.8))}" r="1.1"/><text class="pl-led-t" x="${n1(u + 1.8)}" y="${n1(-(BL_Z + 1.9))}">${upper(s)}</text>`;
+  });
+  out.push(onFaceY(F, face));
+  return out.join("");
+}
+
+// ---------- A server: a cabinet with its letter, its two health lamps, drive bays, and its chips on top ----------
+function server(s, B) {
+  const out = [], F = B.y + B.d;
+  out.push(S(k.slabOf({ x: B.x - 2.6, y: B.y - 2.6, w: B.w + 5.2, d: B.d + 5.2, r: 2 }, 0, 1.8, P, 3, 0.4), { tone: "lo" }));
+  out.push(S(k.slabOf(B, 1.8, SV_H - 1.8, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(B, SV_H - 9, P, 3), { tone: "faint" }) }));
+  let face = `<text class="pl-letter" x="${n1(B.x + 3.4)}" y="${n1(-(SV_H - 7.6))}">${upper(s)}</text>`;
+  // The last two health checks, the older on the left: each lamp is green for an answer in time, red for none.
+  face += rect("lm-inlay", B.x + B.w - 15, SV_H - 8.2, 12.4, 5.6, 2.8);
+  face += [0, 1].map((n) => `<circle class="pl-lamp" id="pl-lamp-${s}-${n}" data-check="ok" cx="${n1(B.x + B.w - 12.2 + n * 6.8)}" cy="${n1(-(SV_H - 5.4))}" r="1.9"/>`).join("");
+  for (let b = 0; b < 4; b++) {
+    const z = SV_H - 15 - b * 6;
+    face += rect("lm-slot", B.x + 3, z, B.w - 10, 3, 0.5) + `<circle class="lm-led${b === 0 ? " on" : ""}" cx="${n1(B.x + B.w - 4.4)}" cy="${n1(-(z + 1.5))}" r="0.8"/>`;
+  }
+  out.push(onFaceY(F, face));
+  let vents = "";
+  for (let v = 0; v < 3; v++) vents += k.lineOnTop([B.x + 4, B.y + 4 + v * 3.2], [B.x + 9, B.y + 4 + v * 3.2], SV_H, P);
+  out.push(L(vents, { tone: "lo" }));
+  // The chips: hidden until the pool table gives the server requests; the newest one lights while its request lands.
+  const cx = B.x + B.w / 2 + 2, cy = B.y + B.d / 2;
+  for (let i = 0; i < POOL_CHIPS; i++) {
+    const C = { x: cx - CHIP.w / 2, y: cy - CHIP.d / 2, w: CHIP.w, d: CHIP.d, r: 1.2 }, z = SV_H + i * (CHIP.h + CHIP.gap);
+    out.push(`<g class="pl-chip" id="pl-chip-${s}-${i}" style="opacity:0">${S(k.slabOf(C, z, CHIP.h, P, 3, 0.4), { tone: "mid" })}</g>`);
+    out.push(`<g class="pl-chip-lit" id="pl-chip-lit-${s}-${i}" style="opacity:0">${S(k.slabOf(C, z, CHIP.h, P, 3, 0.4), { tone: "hi", lit: true })}</g>`);
+  }
+  return out.join("");
+}
+const chipTop = (B) => [B.x + B.w / 2 + 2, B.y + B.d / 2, SV_H + POOL_CHIPS * (CHIP.h + CHIP.gap) + 1];
+
+// ---------- Cables: a bow tie, three readers in to one balancer, one balancer out to three servers ----------
+const IN = LP.map((B) => [[B.x + B.w / 2, B.y - 1], [B.x + B.w / 2, LP_Y - 12], [BL_IN[0], LP_Y - 12], [BL_IN[0], BL_IN[1] + 3]]);
+const OUT = SV.map((B, i) => [[BL_OUT[i][0], BL_OUT[i][1] - 3], [BL_OUT[i][0], -36 - i * 3], [B.x + B.w / 2, -36 - i * 3], [B.x + B.w / 2, B.y + B.d + 3]]);
+const cable = (pts) => tubeOf(tubePieces(pts.map(([x, y]) => [x, y, CABLE_Z]), CABLE_R, P, { maxLength: 14 }));
+
+// ---------- Legs: the way a tag rides ----------
+const onCable = (pts) => pts.map(([x, y]) => [x, y, RIDE]);
+const LEGS = {
+  ...Object.fromEntries(POOL_READERS.map((r, i) => {
+    const B = LP[i];
+    return [r, [[B.x + B.w / 2, B.y - 3, LP_LID + 4], [B.x + B.w / 2, B.y - 3, RIDE], ...onCable(IN[i]), [BL_IN[0], BL.y + BL.d + 1, BL_H + 1.2], BL_TOP]];
+  })),
+  ...Object.fromEntries(POOL_SERVERS.map((s, i) => {
+    const B = SV[i];
+    return [s, [BL_TOP, [BL_OUT[i][0], BL.y - 1, BL_H + 1.2], ...onCable(OUT[i]), [B.x + B.w / 2, B.y + B.d + 3, SV_H + 2], chipTop(B)]];
+  })),
+};
+
+// ---------- Callouts: few, short, outside the plate ----------
+const TEXT_W = { "pl-name": 11.5 * 0.74, "pl-sub": 13 * 0.5, "pl-addr": 12.5 * 0.6 };
+function callout(boxes, anchor, [tx, ty], lines, { align = "start", id = "" } = {}) {
+  const [ax, ay] = at(anchor);
+  for (const [i, l] of lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
+  const ex = tx + (align === "end" ? 7 : -7);
+  const lead = `<path class="pl-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "pl-lead-dot", 2)}`;
+  const text = lines.map((l, i) => l.svg ? l.svg(tx, ty + i * 16, align) : `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
+  return `<g class="pl-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
+}
+// A server's health, as the driver writes it from the pool table: a small square, then the table's words.
+const health = (s) => ({
+  cls: "pl-sub", text: "1 check missed",
+  svg: (x, y) => `<g class="pl-health" id="pl-health-${s}" data-health="healthy"><rect class="pl-health-mark" x="${n1(x)}" y="${n1(y - 9)}" width="8" height="8" rx="1"/><text class="pl-health-t" id="pl-health-t-${s}" x="${n1(x + 12)}" y="${n1(y)}">Healthy</text></g>`,
+});
+
+// ---------- Moving parts, drawn at the origin and moved by the driver ----------
+const TAGS = ["REQUEST", "CHECK", "OK"];
+const tag = (label) => {
+  const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
+  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="pl-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
+};
+// Over a server that does not answer a check in time: a dashed ring around where the check waits.
+const quiet = (s, B) => { const [x, y] = at(chipTop(B)); return `<g class="pl-quiet" id="pl-quiet-${s}" style="opacity:0"><circle class="pl-quiet-r" cx="${n1(x)}" cy="${n1(y - 2)}" r="13"/></g>`; };
+// Over the balancer's port for a server it skips: a small red stop mark.
+const skip = (s, i) => { const [x, y] = at([BL_OUT[i][0], BL.y - 4, BL_H + 6]); return `<g class="pl-skip" id="pl-skip-${s}" style="opacity:0"><circle class="pl-skip-d" cx="${n1(x)}" cy="${n1(y)}" r="5"/><path class="pl-skip-x" d="M${n1(x - 2)} ${n1(y - 2)}l4 4m0 -4l-4 4"/></g>`; };
+
+// ---------- The scene ----------
+function sceneSvg() {
+  const pl = plate("ONE ADDRESS · THREE SERVERS");
+  const things = [
+    ...SV.map((B, i) => ({ xy: [B.x + B.w / 2, B.y + B.d / 2], svg: server(POOL_SERVERS[i], B) })),
+    { xy: [BL.x + BL.w / 2, BL.y + BL.d / 2], svg: balancer() },
+    ...LP.map((B, i) => ({ xy: [B.x + B.w / 2, B.y + B.d / 2], svg: laptop(B, POOL_READERS[i], ["YOU", "READER 2", "READER 3"][i]) })),
+  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
+  const cables = [...IN, ...OUT].map(cable).join("");
+  const tags = TAGS.map((l) => `<g class="pl-tag" id="pl-tag-${l.toLowerCase()}" style="opacity:0">${tag(l)}</g>`).join("");
+  const trail = `<polyline class="pl-trail" id="pl-trail" points="" style="opacity:0"/>`;
+  const boxes = [];
+  const labels = [
+    ...SV.map((B, i) => {
+      const s = POOL_SERVERS[i];
+      const [cx, cy] = at([SV[2].x + SV[2].w, SV[2].y, SV_H]);
+      return callout(boxes, [B.x + B.w, B.y, SV_H - 3], [cx + 40, cy - 112 + i * 62], [{ cls: "pl-name", text: `Server ${upper(s)}` }, { cls: "pl-addr", text: `10.0.0.1${i + 1}` }, health(s)], { id: `pl-call-${s}` });
+    }),
+    callout(boxes, [BL.x + BL.w, BL.y + BL.d, BL_H], [at([BL.x + BL.w, BL.y + BL.d, BL_H])[0] + 70, at([BL.x + BL.w, BL.y + BL.d, BL_H])[1] + 40], [{ cls: "pl-name", text: "Load balancer" }, { cls: "pl-addr", text: "example.net" }, { cls: "pl-addr", text: "203.0.113.80" }], { id: "pl-call-balancer" }),
+    ...LP.map((B, i) => {
+      const r = POOL_READERS[i], [ax, ay] = at([B.x, B.y + B.d, LP_Z]);
+      return callout(boxes, [B.x, B.y + B.d, LP_Z], [ax - 18, ay + 30 + i * 4], [{ cls: "pl-name", text: ["You", "Reader 2", "Reader 3"][i] }], { align: "end", id: `pl-call-${r}` });
+    }),
+  ].join("");
+  // The frame: the plate, the tallest parts and every callout, with a margin.
+  const pts = [...k.boxCorners(PL, FLOOR, 0), ...SV.map(chipTop)].map(at);
+  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
+  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 16;
+  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
+  const marks = SV.map((B, i) => quiet(POOL_SERVERS[i], B) + skip(POOL_SERVERS[i], i)).join("");
+  const body = pl.under + `<g class="lm-body">${pl.over}${cables}${things.map((t) => t.svg).join("")}${trail}${tags}${marks}</g>` + labels;
+  return `<svg data-figure="pool" class="lm-svg pl" viewBox="${vb.join(" ")}" role="img" aria-label="${POOL_DESCRIPTION}">${body}</svg>`;
+}
+
+/** The figure's description, for a screen reader. */
+export const POOL_DESCRIPTION = "A load balancer on one plate. In front, out on the internet, three readers’ laptops, their cables meeting at the balancer in the middle, whose address all three use. Behind it, in the pool, three servers, A, B and C, each cabled to the balancer, each with two lamps for its last two health checks.";
+
+// What the driver needs: the camera as six numbers, the origin, and the legs.
+function sceneData(): PoolSceneData {
+  const o = at([0, 0, 0]), ex = at([1000, 0, 0]), ey = at([0, 1000, 0]), ez = at([0, 0, 1000]);
+  const M = [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000];
+  const r2 = (p) => p.map((v) => +v.toFixed(2));
+  return { M, O: o.map((v) => +v.toFixed(2)), legs: Object.fromEntries(Object.entries(LEGS).map(([n, pts]) => [n, pts.map(r2)])) };
+}
+
+/** The Load Balancers scene, drawn at build time: its SVG and the data its driver reads. */
+export function drawPool(): DrawnFigure {
+  return { svg: sceneSvg(), data: sceneData() };
+}
diff --git a/src/art/scenes/types.ts b/src/art/scenes/types.ts
index e2e26bc..bea0851 100644
--- a/src/art/scenes/types.ts
+++ b/src/art/scenes/types.ts
@@ -1,5 +1,5 @@
 /** The scene figures a lesson can be drawn on. Each one is drawn at build time and moved by its own driver. */
-export type FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map' | 'osi';
+export type FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map' | 'osi' | 'pool';
 
 /** What a lesson may name on a figure. The lesson validator checks every event against these. */
 export interface FigureParts {
@@ -13,9 +13,9 @@ export interface FigureParts {
   board: boolean;
   /** True when the figure's driver shows a scene's `start`, the cues in place as a unit starts (net-map only). */
   start: boolean;
-  /** For a text cue listed here, the only args it takes (osi only); a cue not listed takes any text. */
+  /** For a text cue listed here, the only args it takes (osi and pool); a cue not listed takes any text. */
   args?: Readonly<Record<string, readonly string[]>>;
-  /** The only ways a message may ride, as `'from>to'` (osi only); absent means between any two places. */
+  /** The only ways a message may ride, as `'from>to'` (dhcp, osi and pool); absent means between any two places. */
   routes?: readonly string[];
   /** The `scene.labels` keys a unit on this figure must give, and the only ones it may (osi only). */
   words?: readonly string[];
diff --git a/src/content/schema.ts b/src/content/schema.ts
index 9da7403..012f003 100644
--- a/src/content/schema.ts
+++ b/src/content/schema.ts
@@ -34,7 +34,7 @@ const count = z.number().int().min(0);
 export const messageKindSchema = z.enum(['request', 'response', 'control', 'broadcast', 'encrypted']);
 export const certTagSchema = z.enum(CERT_TAG_IDS);
 /** The scene figures (`FigureId`); `parts.test.ts` keeps this list and `FIGURE_PARTS` the same. */
-export const figureIdSchema = z.enum(['dhcp', 'subnet', 'firewall', 'net-map', 'osi'] satisfies FigureId[]);
+export const figureIdSchema = z.enum(['dhcp', 'subnet', 'firewall', 'net-map', 'osi', 'pool'] satisfies FigureId[]);
 
 /** A source as a lesson lists it. `source` is its id in the registry (`sources.ts`), which a list made from citations carries. */
 export const sourceSchema = z.strictObject({ label: text, url: httpsUrl, source: slugSchema.optional() });
diff --git a/src/content/test-fixtures.ts b/src/content/test-fixtures.ts
index 1435460..aece9e2 100644
--- a/src/content/test-fixtures.ts
+++ b/src/content/test-fixtures.ts
@@ -56,6 +56,7 @@ export const FIXTURE_PARTS: Record<FigureId, FigureParts> = {
     words: ['plate'],
     labels: true,
   },
+  pool: fixtureParts({ board: false, start: false }),
 };
 
 function fixtureParts({ board, start }: { board: boolean; start: boolean }): FigureParts {
diff --git a/src/lib/figures.ts b/src/lib/figures.ts
index 7692679..2bdc3a6 100644
--- a/src/lib/figures.ts
+++ b/src/lib/figures.ts
@@ -16,6 +16,7 @@ const FIGURES: Record<string, () => string> = {
   'ip-address': () => spot('ip-address'),
   'mac-address': () => spot('mac-address'),
   'tcp-udp': () => spot('tcp-udp'),
+  'load-balancers': () => spot('load-balancers'),
 };
 
 /**
diff --git a/src/scenes/drivers/index.ts b/src/scenes/drivers/index.ts
index 5838685..826729c 100644
--- a/src/scenes/drivers/index.ts
+++ b/src/scenes/drivers/index.ts
@@ -4,6 +4,7 @@ import { dhcpDriver } from './dhcp';
 import { firewallDriver } from './firewall';
 import { netMapDriver } from './net-map';
 import { osiDriver } from './osi';
+import { poolDriver } from './pool';
 import { subnetDriver } from './subnet';
 
 /** The driver for each scene figure. */
@@ -13,4 +14,5 @@ export const DRIVERS: Record<FigureId, DriverModule> = {
   firewall: firewallDriver,
   'net-map': netMapDriver,
   osi: osiDriver,
+  pool: poolDriver,
 };
diff --git a/src/scenes/drivers/pool.ts b/src/scenes/drivers/pool.ts
new file mode 100644
index 0000000..31f2f5c
--- /dev/null
+++ b/src/scenes/drivers/pool.ts
@@ -0,0 +1,223 @@
+// Only types from the drawing module: its code is for the build, and stays out of the page.
+import type { PoolSceneData } from '../../art/scenes/pool';
+import { POOL_CHIPS, POOL_HEALTH, POOL_HEALTH_WORDS, POOL_KEY, POOL_READERS, POOL_REQUESTS, POOL_SERVERS, POOL_TABLE } from '../../art/scenes/pool-parts';
+import type { MessageEvent, NoteEvent, Row, SceneEvent, TableEvent } from '../../content/schema';
+import { applyTableEvent } from '../../engine/tables';
+import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
+import { along, animate, easeInOut, wait } from '../motion';
+
+/**
+ * Moves the Load Balancers figure (src/art/scenes/pool.ts).
+ *
+ * - A request rides from its reader's screen along its cable to the top of the balancer, waits there while the
+ *   balancer picks (the server's light on the balancer's face comes on), then rides that server's cable to its top.
+ *   A `skip` cue names a server the balancer passes over: its red mark shows over its port while the request waits.
+ * - A check rides from the balancer to a server; an answer rides back. A note with a `no-answer` cue rings the server
+ *   that did not answer in time with a dashed circle.
+ * - The pool table is what the servers show: each Health cell lights the server's two lamps and writes its health
+ *   line, and each Requests cell stacks that many chips on its top.
+ *
+ * Once a request has landed it stays on the figure: `show` lights the latest one's reader, its light on the balancer
+ * and its server's newest chip; a no-answer note keeps its ring.
+ */
+
+type Point = [number, number, number];
+type Flat = [number, number];
+type Server = (typeof POOL_SERVERS)[number];
+type Reader = (typeof POOL_READERS)[number];
+
+/** Ms at 1×: a leg of a ride (half that for a `fast` one), the pick on the balancer and a skip's mark, a no-answer ring, the rest after an event and the gap before the next. */
+const LEG_MS = 1000;
+const PICK_MS = 450;
+const SKIP_MS = 700;
+const QUIET_MS = 1100;
+const REST_MS = 300;
+const GAP_MS = 200;
+
+const isServer = (p: string): p is Server => (POOL_SERVERS as readonly string[]).includes(p);
+const isReader = (p: string): p is Reader => (POOL_READERS as readonly string[]).includes(p);
+const cueArg = (e: SceneEvent, cue: string): string | undefined => (e.type === 'table' ? undefined : e.cues?.find((c) => c.cue === cue)?.arg);
+
+function duration(event: SceneEvent): number {
+  // A table event has nothing to move, so it lands at once, with the event before it.
+  if (event.type === 'table') return 0;
+  if (event.type === 'note') return (cueArg(event, 'no-answer') === undefined ? 0 : QUIET_MS) + GAP_MS;
+  const leg = event.fast === true ? LEG_MS / 2 : LEG_MS;
+  const pick = isReader(event.from) ? leg + PICK_MS + (cueArg(event, 'skip') === undefined ? 0 : SKIP_MS) : 0;
+  return pick + leg + REST_MS + GAP_MS;
+}
+
+function rowsAfter(rows: Row[], event: TableEvent): Row[] {
+  const state = { rows: rows.map((row) => ({ ...row })), highlight: null, missed: [] };
+  applyTableEvent(state, { keyColumn: POOL_KEY }, event);
+  return state.rows;
+}
+
+function create(root: SVGSVGElement, data: unknown): SceneDriver {
+  // Drawn by drawPool() at build time, beside this figure.
+  const { M, O, legs } = data as PoolSceneData;
+  const part = <T extends SVGElement = SVGElement>(id: string): T => {
+    const found = root.querySelector<T>(`#${id}`);
+    if (found === null) throw new Error(`The Load Balancers figure has no #${id}.`);
+    return found;
+  };
+  const tags = new Map(['request', 'check', 'ok'].map((t) => [t, part(`pl-tag-${t}`)]));
+  const trail = part<SVGPolylineElement>('pl-trail');
+  const glow = Object.fromEntries(POOL_READERS.map((r) => [r, part(`pl-glow-${r}`)])) as Record<Reader, SVGElement>;
+  const per = <T,>(make: (s: Server) => T): Record<Server, T> => Object.fromEntries(POOL_SERVERS.map((s) => [s, make(s)])) as Record<Server, T>;
+  const pick = per((s) => part(`pl-pick-${s}`));
+  const quiet = per((s) => part(`pl-quiet-${s}`));
+  const skip = per((s) => part(`pl-skip-${s}`));
+  const lamps = per((s) => [0, 1].map((n) => part(`pl-lamp-${s}-${n}`)));
+  const health = per((s) => part(`pl-health-${s}`));
+  const healthText = per((s) => part(`pl-health-t-${s}`));
+  const chips = per((s) => Array.from({ length: POOL_CHIPS }, (_, i) => part(`pl-chip-${s}-${i}`)));
+  const litChips = per((s) => Array.from({ length: POOL_CHIPS }, (_, i) => part(`pl-chip-lit-${s}-${i}`)));
+  /** How many chips each server shows now, so a landed request lights its newest. */
+  const count = per(() => 0);
+
+  const [ax, bx, cx, ay, by, cy] = M as [number, number, number, number, number, number];
+  const onScreen = ([x, y, z]: Point): Flat => [ax * x + bx * y + cx * z, ay * x + by * y + cy * z];
+  const fade = (el: SVGElement, opacity: number): void => {
+    el.style.opacity = String(opacity);
+  };
+
+  /** Nothing in flight: the tags, the trail and the marks gone. */
+  function clearMoving(): void {
+    for (const el of tags.values()) {
+      fade(el, 0);
+      el.removeAttribute('transform');
+    }
+    fade(trail, 0);
+    trail.setAttribute('points', '');
+    for (const s of POOL_SERVERS) fade(skip[s], 0);
+  }
+  /** Nothing in flight and nothing lit. */
+  function clear(): void {
+    clearMoving();
+    for (const r of POOL_READERS) glow[r].classList.remove('on');
+    for (const s of POOL_SERVERS) {
+      pick[s].classList.remove('on');
+      fade(quiet[s], 0);
+      for (const el of litChips[s]) fade(el, 0);
+    }
+  }
+
+  /** The pool table as the servers show it: two lamps and a health line from Health, chips from Requests. */
+  function paint(rows: Row[]): void {
+    for (const s of POOL_SERVERS) {
+      const row = rows.find((r) => r[POOL_KEY]?.toLowerCase() === s);
+      const word = row?.[POOL_HEALTH];
+      const shown = word === undefined ? undefined : POOL_HEALTH_WORDS[word];
+      lamps[s].forEach((lamp, n) => (shown === undefined ? lamp.removeAttribute('data-check') : lamp.setAttribute('data-check', shown.lamps[n]!)));
+      if (shown === undefined) health[s].removeAttribute('data-health');
+      else health[s].setAttribute('data-health', shown.state);
+      health[s].toggleAttribute('data-turning', shown?.turning === true);
+      healthText[s].textContent = shown === undefined ? '' : word!;
+      const n = Math.min(POOL_CHIPS, Math.max(0, Number.parseInt(row?.[POOL_REQUESTS] ?? '0', 10) || 0));
+      count[s] = n;
+      chips[s].forEach((chip, i) => fade(chip, i < n ? 1 : 0));
+    }
+  }
+  const poolOf = (view: SceneView): Row[] => view.tables[POOL_TABLE]?.rows ?? [];
+
+  /** A landed request: its reader's screen, its server's light on the balancer and its newest chip. */
+  function lightRequest(e: MessageEvent): void {
+    if (!isReader(e.from) || !isServer(e.to)) return;
+    glow[e.from].classList.add('on');
+    pick[e.to].classList.add('on');
+    const top = count[e.to] - 1;
+    if (top >= 0) fade(litChips[e.to][top]!, 1);
+  }
+  function lightLanded(landed: MessageEvent | NoteEvent | null): void {
+    if (landed?.type === 'message') lightRequest(landed);
+    const quietAt = landed === null ? undefined : cueArg(landed, 'no-answer');
+    if (quietAt !== undefined && isServer(quietAt)) fade(quiet[quietAt], 1);
+  }
+
+  /** Rides `tag` along a leg of the plate, forwards or backwards, leaving a trail behind it. */
+  async function ride(tag: SVGElement, leg: Point[], back: boolean, ms: number, o: PlayOptions): Promise<void> {
+    const flat = (back ? [...leg].reverse() : leg).map(onScreen);
+    // How far along the leg, by length on screen, each point is: the trail keeps the points the tag has passed.
+    const cum = flat.map((_, i) => flat.slice(1, i + 1).reduce((sum, p, j) => sum + Math.hypot(p[0] - flat[j]![0], p[1] - flat[j]![1]), 0));
+    const total = cum.at(-1) || 1;
+    // Placed at the leg's start before it shows, so it never shows where it was drawn.
+    tag.setAttribute('transform', `translate(${flat[0]![0].toFixed(1)} ${flat[0]![1].toFixed(1)})`);
+    fade(tag, 1);
+    fade(trail, 0.9);
+    await animate(
+      ms / o.speed,
+      (k) => {
+        const t = easeInOut(k);
+        const [x, y] = along(flat, t);
+        tag.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
+        const passed = flat.filter((_, i) => cum[i]! / total <= t);
+        // The tags are drawn at the plate's origin, which sits at O on screen; the trail is drawn in the figure's own frame.
+        trail.setAttribute('points', [...passed, [x, y]].map(([px, py]) => `${(px + O[0]).toFixed(1)},${(py + O[1]).toFixed(1)}`).join(' '));
+      },
+      o,
+    );
+  }
+
+  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
+    if (event.type === 'table') {
+      if (event.table !== POOL_TABLE) return;
+      paint(rowsAfter(poolOf(view), event));
+      // The newest chip of the request that has just landed lights as its count goes up.
+      for (const s of POOL_SERVERS) for (const el of litChips[s]) fade(el, 0);
+      if (view.landed?.type === 'message') lightRequest(view.landed);
+      return;
+    }
+    clear();
+    if (event.type === 'note') {
+      const s = cueArg(event, 'no-answer');
+      if (s === undefined || !isServer(s)) return;
+      await animate(QUIET_MS / o.speed, (k) => fade(quiet[s], o.reducedMotion ? 1 : Math.min(1, k * 3)), o);
+      return;
+    }
+    const tag = tags.get(event.tag.toLowerCase());
+    if (tag === undefined) return;
+    const leg = event.fast === true ? LEG_MS / 2 : LEG_MS;
+    if (isReader(event.from) && isServer(event.to)) {
+      glow[event.from].classList.add('on');
+      await ride(tag, legs[event.from], false, leg, o);
+      if (o.signal.aborted) return;
+      const passed = cueArg(event, 'skip');
+      if (passed !== undefined && isServer(passed)) {
+        fade(skip[passed], 1);
+        await wait(SKIP_MS / o.speed, o.signal);
+        if (o.signal.aborted) return;
+      }
+      pick[event.to].classList.add('on');
+      await wait(PICK_MS / o.speed, o.signal);
+      if (o.signal.aborted) return;
+      await ride(tag, legs[event.to], false, leg, o);
+    } else if (event.from === 'balancer' && isServer(event.to)) {
+      await ride(tag, legs[event.to], false, leg, o);
+    } else if (isServer(event.from) && event.to === 'balancer') {
+      await ride(tag, legs[event.from], true, leg, o);
+    } else return;
+    if (o.signal.aborted) return;
+    await wait(REST_MS / o.speed, o.signal);
+    if (o.signal.aborted) return;
+    clearMoving();
+  }
+
+  return {
+    show(view) {
+      // Settled means no motion: the lamps and glows change at once, not over their fades (pool.css).
+      root.setAttribute('data-settling', '');
+      clear();
+      paint(poolOf(view));
+      lightLanded(view.landed);
+      void root.getBoundingClientRect();
+      root.removeAttribute('data-settling');
+    },
+    play,
+    // Nothing to let go of: a play's timers and listeners end with its signal, which the panel aborts first.
+    destroy() {},
+  };
+}
+
+/** The Load Balancers figure's driver. */
+export const poolDriver: DriverModule = { create, duration };
````
