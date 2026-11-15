# D13a: Packets, the scene and the card art (job 14, batch 3)

The spec for the new Networking Concepts lesson **Packets** (`packets`, stop 2): its Watch scene on the network map, its table, its log and its card art. It is for the design gate: the owner approves the prototype, then a builder builds it. D13b (Switch) and D13c (Load Balancers) are separate specs; this one shares no file with them.

| File | What it is |
|---|---|
| `prototypes/d13-packets.html` | The clickable prototype: the Lesson page playing the five steps, and the card art on the track's route. One self-contained file (2.0 MB: styles, fonts, figure and script inline; it loads nothing). |
| `prototypes/d13-packets-spot.svg` | `spot('packets')`, Packets' card art |

There is **no new figure part file**: the scene draws nothing new. Its parked tags are copies, made by the driver, of the 16 tags the map already draws (§2.1).

The code that emits the spot, and the figure data the driver reads (`bays`), is the patch in Appendix A. It applies to `job14/batch` at `9807155` with `git apply`. The SVG carries classes and CSS variables, not colours: it renders properly only inside a page that loads the site's CSS and the shared defs.

**How to use the prototype.** The tab at the right edge ("D13a prototype") opens the switches: page (Lesson, Card art), theme and motion. Everything else is the Lesson page: the outline, Play, the step arrows, the speed, the phone tabs (Explain, Steps, Log, Table). A query string opens a state directly:
- `?step=4&play=1`: step 4, playing;
- `?at=4.2`: step 4 with its first two events landed (a state you can stop on and look at);
- `?theme=dark`, `?tab=table` (phone), `?page=cards`, `?motion=reduced`.

The prototype's figure is the patch's drawing, and its moves copy the net-map driver's with the changes in §5. Its Learn and Practice are stubs. The story is the analyst's (`.superpowers/analysis/packets/report.md` §2 and its Rulings, which win). Step titles, narratives, facts, statuses, table cells and log info are the outline's words, used as placeholders the author will set, except where §7 marks words as new.

**One variant.** I found no real fork: every choice below has one answer once the rulings and the budget are read.

## 1. What changes and what stays

**Stays.**
- The Lesson page as built (direction §7): layout, console, stage, log, phone tabs, the table panel.
- The net-map drawing and its frame (`viewBox="-98 -60 685 378"`): the SVG is byte for byte today's (870,295 characters before and after the patch).
- Every existing net-map lesson plays exactly as now: the same events, the same durations, the same frames. The new behaviour runs only for an event that carries a `park` or `unpark` cue, or a `via`; no existing lesson has one.
- One moving tag at a time, and one event at a time: the console's play loop, seek and speed are untouched.
- Every existing spot and card.

**Changes.**

| What | Where |
|---|---|
| **Parked tags.** A tag can stay on the map after its event: `park <place> <bay> <TAG>` leaves a copy of the tag, unlit and at 0.9 of its size, in a numbered bay at a place; `unpark <place>` takes every tag parked there away. Several can be parked at once: the map has bays for 13 (four at the laptop, four at the web server, one on each of the five routers); this story parks at most four at a time. | net-map driver, parts, validator, net-map.css |
| **Bays** in the figure data: four beside the laptop in a column (bay 1 at the top), four on the web server's dock as a deck (bay 1 on top), one on each internet router's top. | net-map.ts (data only), Appendix A |
| **A gap** at an empty bay with a parked tag before and after it (the laptop's bay 2 here): a dashed outline of the missing tag. | net-map driver, net-map.css |
| **`via`** on a message: the tag rides `from → via → to` as one ride, one log row, over two routes the map already has. | schema, validator, net-map driver |
| A park **note** lands its new tags one after another over 600 ms; an unpark note sends its tags into the laptop's screen over 700 ms. Every other note lands at once, as today. | net-map driver `duration` and `play` |
| The **Packets spot** and its card. | spots.ts, lumen.css, figures.ts |

## 2. Gaps decided

### 2.1 Several tags at once: parked copies, not several rides

The brief asks for `PIECE 1` to `PIECE 4` on the map together, with one parked on router b while the others pass. Two ways to get that:

- **Parked copies** (chosen). One tag still rides at a time. A `park` cue on an event leaves a copy of its tag where it is told; the copy is state, like a tray or a connection, so `settle` rebuilds it at any position and seeking just works. The copy is a `cloneNode` of the tag element the map already draws for that many letters, so no new art and no new SVG.
- **Several rides at once** (not chosen). Pieces 3 and 4 riding together would need the console to play two events at once: a change to the panel's loop, to seek and to every driver's `play` contract. The outline allows it ("may ride together"), but it costs far more than the driver, and the story reads as well with 3 then 4 (the outline's own fallback: "the story still works with 3 and 4 played one after the other").

**Parked tags are unlit and at 0.9 of their size.** The lit tag is the one that moves: one lit part, as on every figure. A parked tag's words take `--anatomy-hi`, the plates' strongest line colour, so they read in both themes.

### 2.2 Where a tag waits: the bays

- **At the web server**, a deck of four on its dock (the flat step in front of the rack), bay 1 on top and each lower bay a step lower and nearer, so all four words show. Pieces leave from the top: 1, then 2, then 3 and 4.
- **On a router**, its top, the point a message to that router ends on. Router b holds piece 2 through steps 3 and 4.
- **At the laptop**, a column of four down the home plate, in front of the laptop, bay 1 at the top. **The bay is the piece's number**, not its arrival: piece 3 lands in bay 3 and leaves bay 2 empty. That is how the map shows "out of order" without words: a column with a hole in it.

### 2.3 The tray: kept, as the laptop's column, with no new art (ruling 5)

The outline proposed growing the `tray` cue into slots at the laptop. The table is required (ruling 5) and keeps arrival order: rows 1, 3, 4, 2. The laptop's column keeps **byte order**, with a dashed gap at bay 2 until piece 2 lands. So the two say different things: the table says when each piece came and what TCP did with it; the column shows where each one fits and what is missing. The column is also the only one of the two on screen with the map on a phone (the table is its own tab there). So it stays, as parked tags in the laptop's bays, and the `tray` cue is not touched (it is a mail server's letter light, `tray <site> <on|off>`, used by POP3 and IMAP).

### 2.4 `via`: chosen (ruling 2)

| | `via` (chosen) | Two messages a diverted piece |
|---|---|---|
| Log | One row a packet: PIECE 3 web → laptop, PIECE 4 web → laptop | Two rows each: PIECE 3 web → d, PIECE 3 d → laptop; same for 4 |
| What the learner reads | One piece, one journey, one info line ("…the new way") | The piece seems to stop at d, which it does not |
| Driver | `routeOf` joins `routes[from>via]` and `routes[via>to]` (the via point once), in `duration` and in `play`: about 3 lines | Nothing |
| Schema and validator | `via?: text` on a message; net-map only; an internet router; not `from` or `to`; both routes exist | Nothing |
| Data | Nothing: both routes are already in the map's data | Nothing |
| Ride time | Grows with the joined length, as any ride does | The same total plus one extra 450 ms rest |

Piece 2 still takes **two** messages (web → b in step 3, b → laptop in step 4): its journey is split in time on purpose (it is held up on b while 3 and 4 pass). Two rows say that truthfully.

### 2.5 Views: network only

The sequence view cannot show which way a packet went: its arrows run between lifelines, and a message to a router with no lifeline becomes a note box. The whole point of steps 3 and 4 is the way. So `views: ['network']`, no `parties`, and Packets goes in `NO_SEQUENCE` (`e2e/lesson.spec.ts`, plan item 12). On a phone that also gives the figure the 40px the view switch takes (§4.2).

### 2.6 Also decided

- **No `over` carrier** on the tags: every message is TCP, and the log's Proto column says so on every row. A carrier repeated on every tag says nothing.
- **No mark for the route change** on the map. Piece 3 riding through d while piece 2 sits on b is the route change; the info line ("…the new way") and the narrative name it. No note row for it: nothing is sent.
- **Status "Out of order: piece 2 not here yet"** (the analyst's ruling: piece 2 is held up, not lost) goes on piece 3's arrival, the moment it becomes true. Piece 2's arrival sets "All 4 pieces here" (new words) so the status line does not keep saying "not here yet" after piece 2 has come.
- **Step 5's table** is one `replace` (600 ms), not three updates: it puts the rows in byte order 1 to 4 with "In order" each, so the table ends where the column ends. The outline allows updating all four.
- **The page appears on the unpark.** Step 5's note carries `unpark laptop` and `page text`: the four tags glide into the laptop's screen, then the page's text shows.
- **The tags' words are small on the map**, as every net-map tag's are: a parked tag is 38 × 23px at 1440 and 21 × 13px at 375 (measured). The table and the status line carry the words; the tags carry the picture.

## 3. The scene and its steps

`figure: 'net-map'`, layers `['tcp:web']`, `start: [{ cue: 'hide', arg: 'resolver' }]`, `views: ['network']`, no `parties`. Labels: `laptop: 'Wants a page'`, `url: 'example.net'`, `b: 'b'`, `c: 'c'`, `d: 'd'` (the strips on routers b, c and d, the three the story names; isp and a have none). No `router` label (no callout on the home router). Scene title "A page in four pieces" (21 characters; the limit is 51).

Every message: proto `TCP`, time `—`, size `—`, no `over`. The server's address is `203.0.113.80:80`, the laptop's `192.168.1.100:50422` (ruling 3). A note's destination is `—`. Legend: `request` Sent by your laptop · `response` Sent to your laptop · `note` TCP at one end, nothing sent.

The outline gives `url example.net` as a cue on the REQUEST. The `url` label already shows it from the start, so the cue changes nothing on the map; the author may keep it or drop it.

| Step | Event (tag · from → to) | Info | Cues | Status after | Table | Map once landed | Time at 1× |
|---|---|---|---|---|---|---|---|
| 1 Segmentation | REQUEST · laptop → web | Asks for the home page, index.html | | Asking for the page | | nothing parked | 2,015 ms |
| | note at web (src 203.0.113.80:80) | TCP cuts 5,840 bytes into 4 pieces | `park web 1 PIECE 1`, `park web 2 PIECE 2`, `park web 3 PIECE 3`, `park web 4 PIECE 4` | Cut into 4 pieces | | web deck: 1, 2, 3, 4 | 600 ms |
| 2 Packet Headers | PIECE 1 · web → laptop | Piece 1: bytes 1–1,460 | `park laptop 1 PIECE 1` | Piece 1 arrived | add `1 · 1–1,460 · Arrived` | web: 2, 3, 4 · laptop: 1 | 2,015 ms |
| 3 Forwarding | PIECE 2 · web → b | Piece 2: bytes 1,461–2,920 | `park b 1 PIECE 2` | Piece 2 on its way | | web: 3, 4 · b: 2 · laptop: 1 | 1,399 ms |
| 4 Route Change | PIECE 3 · web → laptop, `via: 'd'` | Piece 3: bytes 2,921–4,380, the new way | `park laptop 3 PIECE 3` | Out of order: piece 2 not here yet | add `3 · 2,921–4,380 · Arrived early, waiting` | web: 4 · b: 2 · laptop: 1, gap, 3 | 2,126 ms |
| | PIECE 4 · web → laptop, `via: 'd'` | Piece 4: bytes 4,381–5,840 | `park laptop 4 PIECE 4` | (unchanged) | add `4 · 4,381–5,840 · Arrived early, waiting` | b: 2 · laptop: 1, gap, 3, 4 | 2,126 ms |
| | PIECE 2 · b → laptop | Piece 2 arrives last | `park laptop 2 PIECE 2` | All 4 pieces here | add `2 · 1,461–2,920 · Arrived last` | laptop: 1, 2, 3, 4 | 1,566 ms |
| 5 In-Order Delivery | table replace, rows `1 · 1–1,460 · In order`, `2 · 1,461–2,920 · In order`, `3 · 2,921–4,380 · In order`, `4 · 4,381–5,840 · In order`; summary "Your laptop’s TCP puts the pieces in order: 1, 2, 3, 4." | | | | rows 1 to 4, In order | laptop: 1, 2, 3, 4 | 600 ms |
| | note at laptop (src 192.168.1.100:50422) | TCP hands bytes 1–5,840 to the browser, in order | `unpark laptop`, `page text`, `status-done` | Page complete (done) | | nothing parked; the page's text on the screen | 700 ms |

The table adds take 0 ms, as today. The times are the driver's (`duration`): a ride is 500 ms and 4 a unit of route, then a 450 ms rest. The web → laptop route is 266.2 units, web → b 112.3, b → laptop 153.9, and web via d to the laptop 294.0 (web → d and d → laptop joined).

**Plain lines** (the log's `plain`, read on a phone and by a screen reader): step 1 "Your browser asks example.net for its home page." and "The server’s TCP cuts the file into four segments."; step 2 "Piece 1 arrives, with its headers: from the server, to your laptop, bytes 1 to 1,460."; step 3 "Piece 2 takes the same way as piece 1, through router b."; step 4 "Piece 3 takes the new way, through router d, and reaches your laptop before piece 2.", "Piece 4 takes the new way too, and arrives early.", "Piece 2, held up on the old way, arrives last."; step 5 "Your laptop’s TCP puts the four pieces back in order and hands over the page."

**Table** `pieces`: title "What your laptop has", by "kept by your laptop’s TCP", key column `piece`, columns **Piece**, **Bytes**, **Status** (prose), empty "Nothing yet.". No initial rows.

### 3.1 What moves, event by event

- **A park note** (step 1): the new parked tags appear one after another over 600 ms, bay 1 first (each at k ≥ i / (n + 1) of the time). Under reduced motion they appear together at once, and the 600 ms passes still.
- **A message whose tag is parked** (pieces 1 to 4 leaving the server, piece 2 leaving b): its parked copy goes as the message is sent, and the lit tag rides from where the route starts. This is the tray's rule today ("it leaves as it is sent").
- **A message with its own park cue** (every piece): the ride as today; then, in the first 250 ms of the 450 ms rest, the lit tag slides from the route's end to its bay and shrinks from 1 to 0.9 (ease in-out), and the trail dims to half. Then the map paints the landed state (the tag now parked and unlit, the gap drawn or gone), and the rest's other 200 ms pass. The event's total is unchanged. Under reduced motion there is no slide: the landed state paints at the rest's start, as today.
- **An unpark note** (step 5): the gap goes; the four tags at the laptop glide to the laptop's screen (a point 6 units across, 14 back and 16 up from the end of the route into the laptop), shrinking from 0.9 to 0.36 and fading (opacity 1 − k²), over 700 ms with ease in-out. Then the landed state paints: no tags, the page's text on the screen, "Page complete". Under reduced motion the tags stay still for the 700 ms, then the landed state paints.
- **A `via` message**: one ride over the joined route; the trail draws along all of it, through d.

## 4. Sizes, spacing and breakpoints

### 4.1 The figure (plate units, drawn at build time)

| What | Value |
|---|---|
| Laptop bays | 4, at (−62.5, 84.5 + 10.8 i, 0.4) for i = 0 to 3: a column down the home plate, in front of the laptop, clear of the router and the plate's engraving |
| Web bays | 4, at (89, −88 + 3 i, 18.8 − 4.6 i): a deck on the server's dock, bay 1 on top, each lower bay 3 units nearer and 4.6 lower |
| Router bays | 1 each, at the router's top (x, y, 6.2), the point a message to it ends on |
| Parked tag | the tag the map draws for that many letters (`nm-tag-<n>`), copied; scale 0.9 about the figure's origin |
| Gap | a polygon at the empty bay: the tag's top face, (len × 2.9 + 8) × 10 units at height 3.2, all × 0.9, where len is the letters of the nearest parked tag above it; drawn at any place for an empty bay with a filled bay before it and after it (in this story, only the laptop's bay 2) |
| Order on screen | parked tags and gaps are inserted before the moving tags in `#nm-l-tags`, sorted back to front by x + y, so the moving tag passes over them |

### 4.2 Measured

Chromium, the prototype against today's TCP/UDP on `npm run dev` (port 4321); the boxes are CSS pixels, width × height.

| | 1440 × 900, today (TCP/UDP) | 1440 × 900, Packets | 375 × 812, today (TCP/UDP) | 375 × 812, Packets |
|---|---|---|---|---|
| Stage panel | 735 × 550 | 735 × 550 | 375 × 276 | 375 × 276 |
| Figure | 733 × 398 (overview, table 83 tall) | 733 × 398 at step 1; 733 × 317 with 4 rows (table 164 tall) | 375 × 235 (view switch above it) | 375 × 275 (no view switch) |
| Table | in the stage | in the stage | its own tab | its own tab |
| Parked tag | — | 38.3 × 23.3 | — | 21.0 × 12.8 |
| Gap | — | 40.1 × 20.1 | — | 22.0 × 11.0 |
| Page width | 1440 | 1440 | 375 | 375 (no sideways scroll) |

At 1440 the figure gives up 81px to the four-row table, as every table lesson's does; the column at the laptop stays clear of the stage's edge. On a phone the figure is 40px taller than TCP/UDP's because Packets has no view switch.

### 4.3 Breakpoints

None new. The map scales with its frame at every width, as built; the table moves to its own tab under 640px, as built.

## 5. For the builder: every code change

1. **Drawing and data** (Appendix A, applied as it is).
   - `src/art/scenes/net-map.ts`: `bays` on `NetMapData` and in `drawNetMap()`'s data. The SVG does not change.
   - `src/art/figures/spots.ts`: `packetsSpot`, `SPOTS` and `DRAW`.
   - `src/art/lumen.css`: `.iso-face-text.lm-on-lit`, the ink of a number engraved on a lit face (the spot's piece 1).
2. **Schema** (`src/content/schema.ts`): `messageEventSchema` gains `via: text.optional()`, documented "An internet router the ride must pass through, on the network map: the tag rides from → via → to as one ride."
3. **Parts** (`src/art/scenes/parts.ts`), net-map: `cues` gain `park: 'text'` and `unpark: 'text'`.
4. **Validator** (`src/content/define.ts`), each with a test:
   - `park`'s arg matches `^([a-z0-9-]+) ([1-9]) (.+)$`; the place has bays (`laptop`, `web`, `isp`, `a`, `b`, `c`, `d`); the bay is one it has (1 to 4 at the laptop and the server, 1 on a router); the tag is 16 characters or fewer (`NET_MAP_TAG_MAX`).
   - `park web …` needs a layer that draws the web server in the scene (today's rule for a message to `web`); `park laptop …` is refused when the scene's start shows the phone (`show phone`): the column lies where the phone does.
   - Two tags never share a bay, and one tag is never parked twice: checked over the unit's events in order, with `unpark` emptying its place.
   - A message that parks its own tag (a park cue whose tag is the message's `tag`) parks it at `e.to`.
   - A message whose tag is parked at its `from` when it is sent must park it again (the copy leaves as the message is sent; it has to land somewhere): a parked tag only moves by riding.
   - `unpark`'s arg is a place with bays; one note does not carry both `park` and `unpark`.
   - `via`: net-map only; an internet router (`isp`, `a`, `b`, `c`, `d`); not `from` or `to`; the routes `from>via` and `via>to` both exist; not with `outcome: 'dropped'` (a drop on a joined route is not needed and is not designed).
5. **net-map driver** (`src/scenes/drivers/net-map.ts`):
   - `routeOf(data, e)`: with `e.via`, `[...routes[from>via], ...routes[via>to].slice(1)]`; used by `duration` and by `play` (today's `rideOf(event.from, event.to)`).
   - `MapState.parks: Map<tag, { place, bay }>`; `settle` applies `park` (set) and `unpark` (delete every tag at that place), throwing for a bay the data does not have.
   - `paint` draws the parks as §4.1 says (copies of `tagFor(text)` with no `id`, no `style`, `data-lit` removed, class `nm-park`, `data-tag`, `data-place`, `data-bay`), and the gaps (class `nm-gap`). `show` paints them settled; `clear` leaves them (they are state, not motion).
   - `moveTo` gains a scale: `translate(x + O₀ y + O₁) scale(s) translate(−O₀ −O₁)`, since a tag is drawn at the figure's origin.
   - `play` of a message: at send, remove the parked copy whose tag is `event.tag` at `event.from`; after the ride, the slide of §3.1 when the event parks its own tag; otherwise as today.
   - `play` of a note: park and unpark as §3.1; any other note as today.
   - `duration`: a note with `park` 600, with `unpark` 700; a note with `drop` 900 as today; any other note 0. A message's travel uses `routeOf`, so a `via` ride is timed on the joined route.
6. **net-map.css** (`src/art/scenes/net-map.css`):
   ```css
   /* A parked tag (the park cue) is a copy of the moving tag, unlit: its words take the plates' strongest line colour. */
   .nm .nm-park .nm-tag-t { fill: var(--anatomy-hi); }
   /* An empty bay between two parked tags: a dashed outline where the missing piece goes. */
   .nm .nm-gap { fill: none; stroke: var(--anatomy-mid); stroke-width: 1.2px; stroke-dasharray: 3 2.5; vector-effect: non-scaling-stroke; }
   ```
7. **The driver's comment** at the top of `net-map.ts` lists the cues: add "`park <place> <bay> <TAG>`: a copy of the tag waits, unlit, in that bay (the laptop's four, the web server's four, a router's top) until a message with its tag takes it or `unpark <place>` sends that place's tags into the laptop's screen", and "a message `via` a router rides through it".
8. **Cards** (`src/lib/figures.ts`): `packets: () => spot('packets')`.
9. **Pinned tests** (each fails on the patch until updated):
   - `net-map.test.ts:76`: `const { tops, routes, bays, ...mockup } = data`; the hashes then equal today's.
   - `figures.test.ts`: `EXPECTED` gains `packets`, recorded from its render, which equals `prototypes/d13-packets-spot.svg`; the spot test (D11's and D12's form) gains Packets: one lit part, 0 `lm-led on`, its aria-label and plate label.
10. **Not this spec's:** the lesson file (the author's), the counts, the track chain and `NO_SEQUENCE` (B15b, plan item 12).

**What the driver change costs.** The prototype's port of item 5 (about 75 lines) is 2,642 bytes minified and 1,347 bytes gzipped on its own; inside the lesson chunk it will be a little less. Today the lesson's two largest chunks are 94.6 KB gzipped of the 200 KB budget (S16 §7). The figure data grows by 244 bytes raw on every net-map page (HTML, not JS). Existing lessons run none of the new code paths: each is behind a `park`, `unpark` or `via`.

## 6. The card art

One spot in the family: 528 × 372 (`viewBox="36 44 528 372"`), the kit in `common.ts`, one lit part. Looked at in the browser at full size and at the card's size on the route, light and dark, at 1440 and 375, beside OSI Model and TCP/UDP.

| Spot | Plate label | What it shows | Lit part | `lm-led on` |
|---|---|---|---|---|
| `packets` | ONE FILE · FOUR PIECES | Four slabs, each with a header band across its top (an inlay and a seam) and its number engraved on its front, 2, 3 and 4 standing side by side; a dotted outline where piece 1 stood; a cable leaving to the right with two chevrons; piece 1 lifted over the cable, a dotted outline of it on the plate beneath. | Piece 1, with its band and number | 0 |

**aria-label** (in the file): "A file cut into four numbered pieces, each with a header band across its top. Pieces 2, 3 and 4 still stand side by side, with a dotted outline where piece 1 stood. Piece 1, lit, is in the air over the cable, on its way."

**Choices.**
- **Pieces, not packets on a map:** the card says the first idea (a file cut into numbered pieces, each with its own header); the map is the lesson's.
- **Piece 1 lit and lifted:** the one that is on its way; the dotted outline left behind says it came from the row.
- **A number on a lit face** is dark ink (`.iso-face-text.lm-on-lit`, the lit tag's ink, one new rule in `lumen.css`): white on the lit orange did not read in dark.
- **Card sub** "Cut up, sent apart, put back together" is the outline's `overviewSub`.

## 7. Copy

Words not in the outline (`.superpowers/analysis/packets/report.md`) are marked **new words**. Everything else is the outline's, as a placeholder the author sets.

| Where | Words | |
|---|---|---|
| Scene title | A page in four pieces | **new words** |
| Legend, note | TCP at one end, nothing sent | **new words** |
| Legend, request / response | Sent by your laptop · Sent to your laptop | TCP/UDP's, as built |
| Strip labels | b · c · d | **new words** (the routers' letters, as the outline names them) |
| Status, step 4, piece 2 lands | All 4 pieces here | **new words** |
| Plain, step 4 | Piece 3 takes the new way, through router d, and reaches your laptop before piece 2. · Piece 4 takes the new way too, and arrives early. · Piece 2, held up on the old way, arrives last. | **new words**, built from the step 4 narrative's own phrases |
| Table replace summary, step 5 | Your laptop’s TCP puts the pieces in order: 1, 2, 3, 4. | **new words** |
| Table rows, step 5 | In order (×4) | the outline's (it gives three; this spec updates all four) |
| Spot plate label | ONE FILE · FOUR PIECES | **new words** |
| Spot aria-label | §6 | **new words** |
| Statuses, info lines, rows, plain lines of steps 1 to 3 and 5, narratives, facts, Go deeper | §3 | the outline's |

**Numbers.** "1,460" everywhere, as 1,500, 5,840 and the byte ranges (ruling 13).

No time figures anywhere; Practice is not touched.

## 8. Acceptance checks

Each is a test a builder can write; the prototype shows each.

1. `spot('packets') + '\n'` equals `prototypes/d13-packets-spot.svg`; it has exactly one `data-lit`, no `lm-led on`, the plate label ONE FILE · FOUR PIECES and the aria-label of §6.
2. `drawNetMap().svg` is unchanged by the patch; with `bays` left out, the data's hash is today's (`net-map.test.ts`).
3. `drawNetMap().data.bays` has `laptop` (4 bays), `web` (4), and `isp`, `a`, `b`, `c`, `d` (1 each); each router's bay is its top at height 6.2, the end point of a route to it.
4. Every existing net-map lesson: for every event, `duration` returns what it returns today (snapshot the list before the change, compare after).
5. Every existing net-map lesson plays with no `.nm-park` and no `.nm-gap` in the figure, at every step.
6. Packets at `?at=1.2` (after the park note): four `.nm-park` at the web server, words PIECE 1 to PIECE 4, none lit, each scaled 0.9.
7. After step 2: three parked at the web server, one at the laptop's bay 1; table row 1 "Arrived".
8. After step 3: PIECE 2 parked on router b, at b's top; no table row added.
9. During PIECE 3's ride (step 4): PIECE 2 stays parked on b; the lit tag's trail passes over router d, not b.
10. After PIECE 3 lands: the laptop shows PIECE 1 in bay 1 and PIECE 3 in bay 3, and one `.nm-gap` at bay 2; status "Out of order: piece 2 not here yet".
11. After PIECE 2 lands: four parked at the laptop, in bays 1 to 4, no gap, nothing at b or at the server; table rows in the order 1, 3, 4, 2; status "All 4 pieces here".
12. After step 5's replace: table rows in the order 1, 2, 3, 4, each "In order".
13. After step 5's note: no `.nm-park`; the page's text shows on the laptop; status "Page complete", styled done.
14. Seek: opening any step directly (Steps list or the outline) shows the same parked tags and gap as playing to it.
15. `duration`: the park note 600, the unpark note 700, PIECE 3 and PIECE 4 (via d) 2,126 ± 1, PIECE 2 web → b 1,399 ± 1, b → laptop 1,566 ± 1.
16. A message's parked copy is gone from its `from` in the first frame of its ride (piece 1 leaves the deck's top; piece 2 leaves b).
17. At speed 2×, every time above halves; at reduced motion, no tag slides or glides, and every event takes the time `duration` gives.
18. The log has 8 rows by the end: REQUEST, the cut note, PIECE 1, PIECE 2 (web → b), PIECE 3, PIECE 4, PIECE 2 (b → laptop), the hand-over note. Every message's Proto is TCP; every Time and Size is "—".
19. Packets has no Network / Sequence switch (`views: ['network']`).
20. The validator refuses, each with its own message: `park moon 1 X`; `park laptop 5 X`; `park b 2 X`; a tag of 17 characters; two tags in one bay; a tag parked twice; a message that parks its own tag somewhere other than its `to`; a message sent from a place where its tag is parked that does not park it again; `via` on a figure other than net-map; `via: 'laptop'`; `via` equal to `from` or `to`; `via` with `outcome: 'dropped'`; `park` and `unpark` on one note; `park laptop …` in a scene whose start shows the phone.
21. At 375 and 1440, light and dark: no sideways scroll; the parked tags' words have contrast with the plate (axe or a pixel check on `.nm-park .nm-tag-t` against the plate's fill).
22. The Packets card on `/networking` shows the spot, "Packets" and "Cut up, sent apart, put back together".

## 9. Open questions for the owner

None. Both questions this spec first asked are settled (ruling 13): piece 2 keeps its two log rows, and "1,460" is written with a comma everywhere.

## Appendix A. The patch

Applies to `job14/batch` at `9807155` with `git apply` (`git apply --check` passes). It changes three files under `src/art/`; its output is `prototypes/d13-packets-spot.svg` and the figure data's `bays`. Items 2 to 10 of §5 are not in it.

```diff
diff --git a/src/art/figures/spots.ts b/src/art/figures/spots.ts
index 5f9625b..f25b8db 100644
--- a/src/art/figures/spots.ts
+++ b/src/art/figures/spots.ts
@@ -357,10 +357,30 @@ function tcpUdpSpot() {
   return figure("tcp-udp", "TCP · UDP", out.join(""), "Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back.");
 }
 
-export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp'] as const;
+// Packets: one file cut into four numbered pieces, each with a header band across its top; piece 1, lit, already on its way.
+function packetsSpot() {
+  const out = [], W = 17, D = 36, H = 34, Y = -22, GAP = 1.6, X0 = -78, F = Y + D, CY = Y + D / 2, FLY = { x: 46, z: 30 };
+  const piece = (x, z, n, lit = false) => {
+    const T = { x, y: Y, w: W, d: D, r: 1.4 };
+    out.push(S(k.slabOf(T, z, H, P, 3, 0.5), { tone: "hi", lit, inner: L(k.sideSeam(T, z + H - 7, P, 3), { tone: lit ? "lit" : "faint" }) }));
+    out.push(onFaceY(F, rect(lit ? "lm-inlay lm-on-lit" : "lm-inlay", x + 2.5, z + H - 5.6, W - 5, 3.4, 1)));
+    const num = k.faceTextSvg(k.sideMatrix([x + W / 2, F], z + 9, P, "left"), String(n), { size: 13, tone: "mid", anchor: "middle" });
+    out.push(lit ? num.replace('class="iso-face-text"', 'class="iso-face-text lm-on-lit"') : num);
+  };
+  // Where piece 1 stood, the cable out from the end of the file, and where piece 1 is over it.
+  out.push(L(k.planOutline({ x: X0, y: Y, w: W, d: D, r: 1.4 }, 0, P, 3), { tone: "mid", dotted: true }));
+  out.push(tubeOf(tubePieces([[X0 + 4 * W + 3 * GAP - 1, CY, 1.4], [104, CY, 1.4]], 1.2, P, { maxLength: 16 })));
+  out.push(L(k.planOutline({ x: FLY.x, y: Y, w: W, d: D, r: 1.4 }, 0, P, 3), { tone: "lo", dotted: true }));
+  [2, 3, 4].forEach((n, i) => piece(X0 + (i + 1) * (W + GAP), 0, n));
+  out.push(lines([18, 84].flatMap((x) => [[[x, CY - 13], [x + 4, CY - 9]], [[x + 4, CY - 9], [x, CY - 5]]]), 0, "mid"));
+  piece(FLY.x, FLY.z, 1, true);
+  return figure("packets", "ONE FILE · FOUR PIECES", out.join(""), "A file cut into four numbered pieces, each with a header band across its top. Pieces 2, 3 and 4 still stand side by side, with a dotted outline where piece 1 stood. Piece 1, lit, is in the air over the cable, on its way.");
+}
+
+export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets'] as const;
 export type SpotKind = (typeof SPOTS)[number];
 
-const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot };
+const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot, packets: packetsSpot };
 
 /** A small figure, cropped close to its plate. */
 export const spot = (kind: SpotKind): string => DRAW[kind]();
diff --git a/src/art/lumen.css b/src/art/lumen.css
index b6d7629..6e3adfb 100644
--- a/src/art/lumen.css
+++ b/src/art/lumen.css
@@ -216,6 +216,8 @@
 .lm-shadow { fill: #000; opacity: .28; }
 .lm-pkt-t { font: 700 3.4px var(--mono); fill: var(--anatomy-hi); }
 .lm-pkt-t.lm-on-lit { fill: color-mix(in srgb, var(--lit-b) 30%, #000); }
+/* A number engraved on a lit face (the Packets spot's piece 1): the lit tag's ink. */
+.iso-face-text.lm-on-lit { fill: color-mix(in srgb, var(--lit-b) 30%, #000); }
 .lm-rule { font: 700 3.3px var(--mono); fill: var(--anatomy-hi); letter-spacing: .04em; white-space: pre; }
 .lm-rule-ok { fill: #46d39a; } .lm-rule-no { fill: #ff5a4f; }
 .lm-x { stroke: #200605; stroke-width: .9px; stroke-linecap: round; vector-effect: non-scaling-stroke; }
diff --git a/src/art/scenes/net-map.ts b/src/art/scenes/net-map.ts
index 27056f4..714568d 100644
--- a/src/art/scenes/net-map.ts
+++ b/src/art/scenes/net-map.ts
@@ -28,6 +28,12 @@ export interface NetMapData {
   routes: Record<string, [number, number, number][]>;
   /** Where each internet router's top is on screen, from the figure's origin: the DROPPED mark and the name strip stand there. */
   tops: Record<string, [number, number]>;
+  /**
+   * Where a tag waits once a `park` cue leaves it, by place, as points (x, y, z) on the plates, bay 1 first: four
+   * beside the laptop, in a column down the home plate; four on the web server's dock, a deck with bay 1 on top; one
+   * on each internet router's top.
+   */
+  bays: Record<string, [number, number, number][]>;
 }
 
 const PLATE_H = 7, FOOT_H = 3, FLOOR = -PLATE_H - FOOT_H;
@@ -254,6 +260,16 @@ function route(sites, from, to) {
   return pts.map((q) => q.map((v) => +v.toFixed(2)));
 }
 
+// Where a parked tag waits (the driver's `park` cue). Beside the laptop, a column down the home plate, clear of the
+// laptop, the router and the plate's engraving, where the phone lies on a map that shows it; on the web server, a deck
+// on its dock, each bay a step lower and nearer than the one before, so every tag's words show; on a router, its top.
+const BAYS = {
+  laptop: [0, 1, 2, 3].map((i) => [-62.5, 84.5 + i * 10.8, 0.4]),
+  web: [0, 1, 2, 3].map((i) => [89, -88 + i * 3, 18.8 - i * 4.6]),
+  ...Object.fromEntries(Object.entries(N).map(([n, [x, y]]) => [n, [[x, y, HOP]]])),
+};
+const bays = () => Object.fromEntries(Object.entries(BAYS).map(([place, list]) => [place, list.map((p) => p.map((v) => +v.toFixed(2)))]));
+
 // ---------- The kinds of server plate ----------
 // Each returns its objects, its cables, its places (for routes) and its callout. A server's callout sits under the
 // right-hand plate unless the plate puts it somewhere else.
@@ -492,6 +508,6 @@ function camera() {
  */
 export function drawNetMap(only?: readonly string[]): DrawnFigure {
   const { svg, layers } = mapSvg(only);
-  const data: NetMapData = { ...camera(), routes: routesOf(layers), tops: tops() };
+  const data: NetMapData = { ...camera(), routes: routesOf(layers), tops: tops(), bays: bays() };
   return { svg, data };
 }
```
