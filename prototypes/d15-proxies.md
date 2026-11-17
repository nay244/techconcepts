# D15a: Proxies, the scene and the card art (job 16, batch 4)

This is the spec for the new Networking Concepts lesson **Proxies** (`proxies`, stop 18). It covers the lesson's Watch scene on the network map, its table, its log and its card art. It is for the design gate: the owner approves the prototype, then a builder builds it. D15b (VPN) has its own spec. The two specs share four lists (§5.10), and this patch goes first.

| File | What it is |
|---|---|
| `prototypes/d15-proxies.html` | The clickable prototype: the real Lesson page, playing the five steps over the patched map and driver, and the card art on the track's route. One self-contained file (2.07 MB: styles, fonts, figure and script inline; it loads nothing). |
| `prototypes/d15-proxies-part-proxy.svg` | Layer `proxies:proxy`: the forward proxy's plate, box, two cables and callout, as `drawNetMap()` draws them (5 groups, one per slot) |
| `prototypes/d15-proxies-part-site.svg` | Layer `proxies:site`: techconcepts.app's web server with the reverse proxy in front of it, and the three callouts (5 groups) |
| `prototypes/d15-proxies-spot.svg` | `spot('proxies')`, the card art |

**The patch in Appendix A is the drawing, the driver, the engine and the schema.** It applies to `job16/batch` at `86d0bf6` with `git apply`. The `.svg` files are its output, tag for tag. A part file holds the layer's `<g data-layer="…">` groups in draw order, with `display="none"` left off so the file shows them. The SVG carries classes and CSS variables, not colours, so it renders properly only inside a page that loads the site's CSS and the shared defs.

**How the prototype was made.** It is not a hand-written copy of the console. `npm run build` was run on a scratch copy of this worktree with the patch applied. The built What is HTTPS page served as the shell. Its island now renders the real `LessonConsole`, bundled, with a Proxies lesson object in place of HTTPS's. Everything it plays therefore runs on the patched engine and driver, as a build will: timing, seeking, the table, the log, the phone tabs.

The lesson's words come from the analyst's outline (`.superpowers/analysis/proxies/report.md` §2 and §3, with its Rulings). They are placeholders the author will set, except where §7 marks them as new. Learn and Practice show the outline's words with no sources.

**Using it.** The tab at the right edge ("D15a prototype") opens two switches: page (Lesson, Card art) and theme. Everything else is the Lesson page as built. You can use the outline, Play all, the step arrows, Replay, the speed, and the phone tabs (Explain, Steps, Log, Table). A query string opens a state directly: `?theme=dark`, `?page=cards`.

**One variant.** I found no real fork. The figure, the cues and the story each have one answer once the rulings, the budget and "byte for byte" are read (§2).

## 1. What changes and what stays

**Stays.**
- The Lesson page as built (direction §7): layout, console, stage, log, phone tabs, the table panel.
- Every existing net-map lesson's drawing and timing, byte for byte (§8, checks 1 to 4):
  - Today's map is the patched map with the new `proxies:*` groups taken out, character for character (870,295).
  - Every existing route is unchanged, and so is every other field of the figure data.
  - Every event of the 20 net-map lessons takes the same time.
  - `deriveState` gives the same result at every position.
- The frame: `viewBox="-98 -60 685 378"`.
- One moving tag at a time. The console's play loop, seek and speed are untouched.
- Every existing spot and card.

**Changes.**

| What | Where |
|---|---|
| **Two layers.** `proxies:site` is techconcepts.app's web server, drawn as the web plate, with a reverse proxy box in front of it on its cable in. `proxies:proxy` is a forward proxy on a small plate behind the internet, with a cable in from router isp and one out to router c. | net-map-layers.ts, net-map.ts |
| **A slot, NW**, where the resolver stands. A scene that shows the forward proxy hides the resolver. | net-map.ts `SLOT`, net-map-layers.ts |
| **Three optional parts**, drawn hidden: `proxy` (the forward proxy's plate, box, cables and callout); `reverse` (the reverse box, its callout, and the web server's callout behind it); and `direct`, the web server's own callout, which is shown by default. | net-map-layers.ts `NET_MAP_OPTIONAL`, `NET_MAP_HIDEABLE` |
| **A step's own start**, `step.start`: cues in place as the step begins, before its first event. It is how the map changes between the three ways without a fake log row. | schema.ts, engine/timeline.ts, validator |
| **`fresh`**, a cue for a new visit: the page, the padlock and every lit connection go. | driver, parts.ts |
| **A line through a place**, `conn <open/seal/close> <from>><via>><to>`: one line from the laptop, through the forward proxy, to the site. This is the tunnel. | driver |
| **The figure's description** adds a sentence while the forward proxy or the reverse proxy is shown. | net-map-layers.ts `NET_MAP_PART_SENTENCES`, driver |
| The **Proxies spot** and its card. | spots.ts, figures.ts |

## 2. Gaps decided

### 2.1 The forward proxy stands where the resolver does (slot NW)

The outline offered slot `NE`. I drew it there first. The NE plate sits behind techconcepts.app's racks, and at 1440 the box was half hidden by them. The resolver's place, behind the internet on the left, is free once the resolver is hidden. Proxies never asks DNS: the story starts from a known address, as What is HTTPS's middle steps do.

At NW the two cables make an arch over the internet: in from router isp, which is your side, and out to router c, which is the site's side. The tunnel reads left to right: it goes into the box's left face and out of its right face. `NW` is a new entry in `SLOT` with the resolver's footprint (`x: -118, y: -114, w: 64, d: 54`). The validator requires `hide resolver` in any scene that draws `proxies:proxy` (§5.4).

### 2.2 The tunnel is one line through the box

`conn open laptop>proxy>origin` draws one polyline over the routes `laptop>proxy` and `proxy>origin`, joined at the box's top. `seal` makes it glow, as every sealed line on the map does. It goes under the box, in at the in-port and out at the out-port, so it reads as passing through.

**Nothing on the box suggests it reads the request:**
- it has no screen, no padlock and no opened tag;
- its busy band lights while a message stops there, as every server's does;
- the tag that rides through it stays `ENCRYPTED` on both sides;
- its top carries two engraved arrows, one each way: "passes it on, both ways".

The padlock is the laptop's, in its address bar (`lock`).

### 2.3 A step's own start, not a setup note or a second unit

The scene changes twice: the forward proxy appears for steps 2 and 3, then goes, and the reverse proxy appears for steps 4 and 5. I weighed three ways:

- **`step.start`, chosen.** A step may carry cues that are in place as it begins. The engine puts them among the applied cues, before the step's events, under the id `step:<id>`. The driver then needs no new rule, and seeking just works: opening step 4 directly settles the unit start, then steps 1 to 3, then step 4's start. Existing lessons have no `step.start`, so their applied cues are unchanged (check 4).
- **A setup note**, not chosen. A note event carrying `show proxy` would add a log row that is not a message, and the map would change only when the note plays, not when the step opens.
- **Two units**, not chosen. The lesson would get a second Overview, Learn and Practice, which the outline does not want.

### 2.4 `fresh`: each way is a new visit

Steps 2 and 4 each start a new visit: the page leaves the laptop's screen, the padlock goes off, and the lit line from the last way goes. Without this, step 2 would open with step 1's page and padlock still on, and the CONNECT would look like a reload. `fresh` is one flag cue. A start may also use `conn close`, but that would need to know which line was open.

### 2.5 The reverse proxy stands on the site's own plate, in front of the web server

The site plate is a new kind, `site`. Its racks and the page's dock are drawn as the web plate draws them, with the dock moved right to make room. Its cable in runs from router c to the plate's front edge, then turns, then runs in to the dock. A 20 × 20 reverse box stands at the turn, on the cable. It is drawn hidden.

The site has two places: `origin`, the dock, and `reverse`, the box's top. The way between them stays on the plate. It is the route `reverse>origin`, 25.5 units long, and it never goes back out to router c.

**The callouts follow the rulings:**

| When | Callout | Where |
|---|---|---|
| Steps 1 to 3 | "Web server · 198.51.100.7 · port 443" (`direct`) | where every web server's callout stands |
| Steps 4 and 5 | "Reverse proxy · 198.51.100.7 · port 443" | the same place, pointing at the box: the site's address now leads to the reverse proxy |
| Steps 4 and 5 | "Web server · 10.0.0.20 · port 80" | above the racks, right-aligned, its leader dropping to the tall rack's top corner |

### 2.6 Also decided

- **No statuses.** The laptop's status line keeps its label, "Wants techconcepts.app", throughout. The outline makes statuses optional, Load Balancers dropped them (L27-w ruling 4), and every status the outline offers repeats its step's subtitle.
- **No `over` carrier, no Sequence view** (`views: ['network']`). The B unit adds Proxies to `NO_SEQUENCE`.
- **The router's label** is "198.51.100.23 outside", NAT's and Router's form for the outside address (L28-w ruling 1; `fact-nat` now ends "…your home’s public one, the address seen outside").
- **The note in step 4** lands at once, as every note does. The reverse box's busy band, lit since the request arrived, is what the reader sees. It needs no new cue.
- **`hide` and `show` stay start-only.** A step's start counts as a start.
- **The spot sits before `loadBalancersSpot`** in `spots.ts`. Load Balancers' test F6 reads that file from `function loadBalancersSpot` to the end and refuses the word "proxy", and the new spot's code has it.

## 3. The scene and its steps

`figure: 'net-map'`. The scene:
- layers `['proxies:site', 'proxies:proxy']`;
- `start: [{ cue: 'hide', arg: 'resolver' }]`;
- `views: ['network']`, no `parties`;
- labels `laptop: 'Wants techconcepts.app'`, `url: 'techconcepts.app'`, `router: '198.51.100.23 outside'`;
- scene title "One request, three ways".

**Every row.** Time `—`, size `—`, no `over`. The forward proxy's own address has no port (ruling 3). The note's protocol, source and destination are `—` (Load Balancers' form, L28-w ruling 3): a row the legend calls "nothing sent" names no sender.

**Legend.**

| Kind | Words |
|---|---|
| `request` | Toward the site |
| `response` | Back toward you |
| `note` | At the reverse proxy, nothing sent |

**Table** `seen`: title "What the server sees", no `by`, key column `way`, no initial rows, empty "Nothing sent yet.". Its columns are **Way**, **Connection from**, **Your address** (prose) and **Who can read the request** (prose). Each row is an `add`.

| Step | Start (cues before its first event) | Event (tag · from → to) | Proto · source → destination | Info | Event cues | Time at 1× |
|---|---|---|---|---|---|---|
| 1 Straight to the Site | `conn open laptop>origin`, `conn seal laptop>origin` | ENCRYPTED · laptop → origin | TLS · 192.168.1.100:50812 → 198.51.100.7:443 | TLS application data (GET / inside) | | 2,071 ms |
| | | table add: Straight · 198.51.100.23, your home · It’s the connection’s own · Your browser and the site | | | | 0 |
| | | ENCRYPTED · origin → laptop | TLS · 198.51.100.7:443 → 192.168.1.100:50812 | TLS application data (200 OK, the page inside) | `page text`, `lock` | 2,071 ms |
| 2 Set to Use a Proxy | `fresh`, `show proxy` | CONNECT · laptop → proxy | HTTP · 192.168.1.100:50900 → 203.0.113.30 | CONNECT techconcepts.app:443 | | 1,974 ms |
| | | TCP · proxy → origin | TCP · 203.0.113.30:41500 → 198.51.100.7:443 | The proxy’s own TCP connection to the site | | 1,930 ms |
| | | 200 OK · proxy → laptop | HTTP · 203.0.113.30 → 192.168.1.100:50900 | 200 OK: the tunnel is open | `conn open laptop>proxy>origin` | 1,974 ms |
| 3 A Tunnel It Can’t Read | `conn seal laptop>proxy>origin` | ENCRYPTED · laptop → proxy | TLS · 192.168.1.100:50900 → 203.0.113.30 | TLS application data (GET / inside), into the tunnel | | 1,974 ms |
| | | ENCRYPTED · proxy → origin | TLS · 203.0.113.30:41500 → 198.51.100.7:443 | The same sealed bytes, passed on unread | | 1,930 ms |
| | | table add: Forward proxy · 203.0.113.30, the proxy · Not sent; the proxy knows it · Your browser and the site; the proxy sees only the site’s name | | | | 0 |
| | | ENCRYPTED · origin → proxy, `fast` | TLS · 198.51.100.7:443 → 203.0.113.30:41500 | TLS application data (200 OK, the page inside) | | 1,159 ms |
| | | ENCRYPTED · proxy → laptop | TLS · 203.0.113.30 → 192.168.1.100:50900 | The sealed page, passed back unread | `page text`, `lock` | 1,974 ms |
| 4 A Proxy for the Site | `fresh`, `hide proxy`, `hide direct`, `show reverse`, `conn open laptop>reverse`, `conn seal laptop>reverse` | ENCRYPTED · laptop → reverse | TLS · 192.168.1.100:50950 → 198.51.100.7:443 | TLS application data (GET / inside) | | 1,956 ms |
| | | note at the reverse proxy | — · — → — | The reverse proxy opens the seal: GET / for techconcepts.app | | 0 |
| 5 Passed to the Server | | GET / · reverse → origin | HTTP · 10.0.0.2:40100 → 10.0.0.20:80 | GET / with X-Forwarded-For: 198.51.100.23 | | 1,046 ms |
| | | table add: Reverse proxy · 10.0.0.2, the reverse proxy · In X-Forwarded-For: 198.51.100.23 · Your browser, the reverse proxy and the server | | | | 0 |
| | | 200 OK · origin → reverse, `fast` | HTTP · 10.0.0.20:80 → 10.0.0.2:40100 | 200 OK, and the page | | 673 ms |
| | | ENCRYPTED · reverse → laptop | TLS · 198.51.100.7:443 → 192.168.1.100:50950 | TLS application data (200 OK, the page inside) | `page text`, `lock` | 1,956 ms |

The times come from the driver (`duration`), unchanged: a ride is 500 ms plus 4 ms a unit of route, then a 450 ms rest; a `fast` ride is quicker. The lesson has 5 steps and 17 events: 13 messages, 1 note and 3 table rows.

**Plain lines** (the log's `plain`) are the outline's. Three are new words, because the outline gives none for those events:
- step 3, origin → proxy: "The sealed page comes back to the proxy."
- step 4's note: "The reverse proxy opens the seal and reads the request: GET / for techconcepts.app."
- step 5, origin → reverse: "The web server answers the reverse proxy: 200 OK, and the page."

### 3.1 What the map shows, step by step (at a step's end)

| After step | Forward proxy | Reverse proxy and its callouts | Web server's own callout | Lit line | Laptop |
|---|---|---|---|---|---|
| 1 | off | off | on | laptop → site, sealed (glows) | page, padlock |
| 2 | on | off | on | laptop → proxy → site, open | blank, no padlock |
| 3 | on | off | on | laptop → proxy → site, sealed | page, padlock |
| 4 | off | on | off | laptop → reverse proxy, sealed | blank, no padlock; the reverse box's busy band lit |
| 5 | off | on | off | laptop → reverse proxy, sealed | page, padlock |

The resolver is off throughout.

The figure's description, the `aria-label` the driver writes, ends with a part's sentence while that part is shown:
- forward proxy: "Behind the internet, a forward proxy, with one cable in from the internet and one out."
- reverse proxy: "In front of the web server, on its cable in, the site’s reverse proxy."

## 4. Sizes, spacing and breakpoints

### 4.1 The figure (plate units, drawn at build time)

| What | Value |
|---|---|
| Slot NW | `{ x: -118, y: -114, w: 64, d: 54, r: 7 }`, the resolver's footprint |
| Forward proxy box | 24 × 24 at plate (10, 14), 8 tall: a foot slab and a body with a seam. In-port on its front-left face 4 from its left; out-port on its front-right face 4 from its back. Each port is a 4 × 2.6 void at height 0.6. A busy band on both front faces. Two engraved arrows on top, along the out direction (√½, −√½) and back. |
| Forward proxy cables | isp → the in-port, along the front, and the out-port → c. The site `proxy` ends on the box's top (height 8.6); a route to it comes in on whichever cable is nearer the other end. |
| Site plate | the E slot. The racks are as the web plate draws them. The dock is 42 × 14 at plate (32, 49). The reverse box is 20 × 20 at plate (6, 46), its port 4 from its left. The cable in runs from c to the front edge, turns, and runs in to the dock. |
| Callouts | forward proxy at (300, 0); reverse proxy at the web server's usual place (396, 234); web server behind it at (490, −20), right-aligned |
| Frame | unchanged: `-98 -60 685 378` |

### 4.2 Measured

Chromium, at the end of each step. Today's screen is What is HTTPS on the scratch build; Proxies is the prototype. Boxes are CSS pixels, width × height. "Scale" is the figure's pixels per figure unit.

| | 1440 × 900, today (HTTPS) | 1440 × 900, Proxies | 375 × 812, today (HTTPS) | 375 × 812, Proxies |
|---|---|---|---|---|
| Stage panel | 735 × 550 | 735 × 550 | 375 × 276 | 375 × 276 |
| Figure, 1 table row | 733 × 398, scale 1.053 | 733 × 407, scale 1.070 | 375 × 235, scale 0.547 (view switch above) | 375 × 275, scale 0.547 (no view switch) |
| Figure, last step | 733 × 251, scale 0.665 (7 rows, table 247 tall) | 733 × 291, scale 0.769 (3 rows, table 207 tall) | 375 × 235 | 375 × 275 (the table is its own tab) |
| Callout address text, last step | 11 px tall | 12 px tall | 9 px | 9 px |
| Page width | 1440 | 1440 | 375 | 375, no sideways scroll |

At 1440 the three-row table costs the figure less than What is HTTPS's seven rows cost it today. Load Balancers' last step is at scale 1.037, with three one-line rows. Proxies' rows wrap to two lines, because the outline's cells are long. A shorter cell is the author's call.

### 4.3 Breakpoints

None new. The map scales with its frame at every width, as built, and the table moves to its own tab under 640px, as built.

### 4.4 Budgets (measured on the scratch build)

| | Before | After |
|---|---|---|
| JavaScript on every lesson page, gzipped | 109.0 KB | 109.4 KB (+0.4; budget 200) |
| HTML, every net-map page (27 pages), gzipped | e.g. TCP/UDP 133.1 KB | +13.7 to +14.3 KB each; TCP/UDP 146.8 (budget 250) |
| Other pages | | unchanged |

**The driver alone**, minified with its imports, is 16,218 B before and 17,230 B after (+1,012); gzipped, 6,514 B before and 6,824 B after (+310). **The engine** (`timeline.ts`) is +216 B minified and +77 B gzipped.

**The HTML grows** because the map draws every layer on every net-map page, hidden. The two new layers are 90,466 characters raw: the forward proxy part is 46 KB, mostly its two long cables, and the site part is 44 KB, mostly the racks drawn again. The figure data grows by 10,218 bytes (60 new routes). See open question 1.

## 5. For the builder: every code change

1. **Drawing and data** (Appendix A, applied as it is):
   - `src/art/scenes/net-map-layers.ts`:
     - `slot` gains `NE` (to type the slot already drawn) and `NW`; `part?` on a plate;
     - the plate kinds `proxy` and `site`, and `plateSites` for `site`;
     - `NET_MAP_OPTIONAL` gains `proxy` and `reverse`;
     - two new exports: `NET_MAP_HIDEABLE` (`resolver`, `proxy`, `direct`) and `NET_MAP_PART_SENTENCES`;
     - the two layers.
   - `src/art/scenes/net-map.ts`:
     - `SLOT.NW`;
     - a site's `side` and `inner` legs in `route()`;
     - `proxyBox`, and `KINDS.proxy` and `KINDS.site`;
     - a callout or a whole plate wrapped in its `data-base` part.

     Every existing layer draws as before (check 1).
   - `src/art/figures/spots.ts`: `proxiesSpot`, placed before `loadBalancersSpot` (§2.6), and `SPOTS` and `DRAW`.
   - `src/lib/figures.ts`: `proxies: () => spot('proxies')`.
2. **Schema** (`src/content/schema.ts`): `stepSchema` gains `start: z.array(cueSchema).optional()`. Its doc reads: "Cues in place as this step begins, before its first event, as a unit's start is before its first step."
3. **Engine** (`src/engine/timeline.ts`, `deriveState`): the applied list puts each begun step's `start` cues before its events, with `eventId: step:<id>` and `current` as for its events. A step's start applies from its own slot on, including at event index −1 and 0.
4. **Parts** (`src/art/scenes/parts.ts`), net-map: `cues` gains `fresh: 'flag'`, and `args.hide` becomes `NET_MAP_HIDEABLE`. (`show` already takes `NET_MAP_OPTIONAL`.)
5. **Validator** (`src/content/define.ts`). This is not in the patch; each rule gets its own test:
   - A step's `start` follows a scene start's rules (`checkCues(…, atStart = true)`). Its cues may not set the status, and its figure must take a start.
   - `step.start` is net-map only for now. Any other figure gets the message "takes no step start".
   - A unit whose layers include `proxies:proxy` hides the resolver in its scene start.
   - `show proxy` needs the layer `proxies:proxy`; `show reverse` and `hide direct` need `proxies:site`.
   - A message to or from `proxy` is sent only while the proxy is shown and not hidden, as of the step's start and the steps before it. A message to or from `reverse` is sent only while the reverse proxy is shown.
   - `conn … <from>><via>><to>`: both routes `from>via` and `via>to` exist, and `via` is neither end.
6. **Driver** (`src/scenes/drivers/net-map.ts`), in the patch:
   - `parseConn` takes `<from>>[<via>>]<to>`.
   - A connection keeps `from`, `to` and `via`, and is drawn over `rideOf(from, to, via)`. Its id is `from>via>to`.
   - `fresh` clears the page, the padlock and every connection.
   - `hide` takes `NET_MAP_HIDEABLE`.
   - The aria text adds `NET_MAP_PART_SENTENCES` for a shown part.
   - The header comment documents all of this.
7. **CSS:** none. The box, the line and the glow use classes the map already has.
8. **The lesson file** is the author's: §3's scene, steps and cues, with the author's words.
9. **Pinned tests.** Thirteen tests fail on the patch until they are updated. Each pins an old contract, not a behaviour:
   - `net-map.test.ts` "drawNetMap matches the mockup map": the hash. Record it anew after check 1 passes.
   - `net-map.test.ts` "every layer key is drawn exactly once and hidden by default": `proxies:site` also draws its `behind` lines.
   - `net-map-layers.test.ts`, three tests: the layer list, `FIGURE_PARTS["net-map"]`, and `NET_MAP_OPTIONAL`.
   - `figures.test.ts`: `EXPECTED` gains `proxies`.
   - `define.batch1.test.ts`, `define.router.test.ts`: the messages now list "phone", "proxy" or "reverse", and "resolver", "proxy" or "direct".
   - `drivers/net-map.test.ts`, three tests: `[data-hidden]` now also matches the optional parts. Exclude `NET_MAP_OPTIONAL`'s parts, not only `phone`.
   - `drivers/net-map.test.ts`, two tests: `parseConn`'s message.
10. **Merging with D15b (VPN).** D15b's patch was written against `86d0bf6` too. With this patch applied, 15 of its hunks no longer apply, all on lines both patches append to. Each is a merge, not a choice:
    - `NET_MAP_OPTIONAL` becomes `['phone', 'proxy', 'reverse', 'cafe']`.
    - The `slot` type is `'E' | 'SE' | 'N' | 'NE' | 'NW'`. VPN moves `SLOT.NE`, which this spec does not use.
    - `SPOTS` and `DRAW` end `…'load-balancers', 'proxies', 'vpn'`.
    - `figures.ts` takes both entries.
    - `parts.ts`: `hide: NET_MAP_HIDEABLE` with VPN's `listener` args.
    - `parseConn`'s pattern takes both `via` and VPN's ` tunnel`: `^(open|seal|close) ([a-z0-9-]+)>(?:([a-z0-9-]+)>)?([a-z0-9-]+)( data| tunnel)?$`.

## 6. The card art

One spot in the family: 528 × 372 (`viewBox="36 44 528 372"`), the kit in `common.ts`, one lit part. I looked at it in the browser at full size and at the card's size on the route, light and dark, at 1440 and 375, beside Firewalls and Load Balancers.

| Spot | Plate label | What it shows | Lit part | `lm-led on` |
|---|---|---|---|---|
| `proxies` | PASSES IT ON · OWN ADDRESS | A box on a foot, with a cable in from the plate's back-left edge to a port on its front-left face, and a cable out from a port on its front-right face to the right edge. Its address, 203.0.113.30, is in a window on its front. Two engraved arrows on its top point opposite ways. | A tag riding over the cable out, carrying 203.0.113.30. The cable out carries a thin lit thread (`lm-beam`) along its top. | 0 |

**aria-label:** "A box with one cable coming in and one going out, its address, 203.0.113.30, in a window on its front. The cable out is lit, and over it floats a lit tag with the same address, 203.0.113.30."

**Choices:**
- **The box's own address on its front, and the same address on the tag going out.** Together they say "its return address is the proxy's" without an arrow or a word (ruling 12).
- **No padlock, no screen, no opened tag on the box** (ruling 12, and the scene's rule).
- **The thread on the cable out** is `lm-beam`, the lit line the covers already use. It is how "the outgoing one lit" reads at card size, where the tag alone is small.

## 7. Copy

Words not in the outline are marked **new words**. Everything else is the outline's, as a placeholder the author sets. Every word that states a fact on the figure, the table or the card is listed with the Learn part it traces to. The analyst reads this table before the gate.

| Where | Words | Traces to | |
|---|---|---|---|
| Scene title | One request, three ways | `lead-1`, `lead-2` | outline |
| Forward proxy plate | PROXY.EXAMPLE.NET | example data | outline (the proxy's name) |
| Forward proxy callout | Forward proxy · 203.0.113.30 | `term-forward`; the address is example data | outline |
| Site plate | TECHCONCEPTS.APP | example data (What is HTTPS's) | as built |
| Web server callout, steps 1 to 3 | Web server · 198.51.100.7 · port 443 | `fact-here` (port 443); the address is example data | as built (HTTPS's) |
| Reverse proxy callout | Reverse proxy · 198.51.100.7 · port 443 | `term-reverse`, `lead-2` (the site's address leads to it), `fact-here` | outline's words, rearranged; kept (L28-w ruling 2): the plate names the site |
| Web server callout, steps 4 and 5 | Web server · 10.0.0.20 · port 80 | `fact-inside` (port 80), `why-2` (a private address); the address is example data | outline |
| Router callout | 198.51.100.23 outside | `fact-nat` ("…your home’s public one, the address seen outside") | NAT's and Router's form; kept (L28-w ruling 1) |
| Laptop status, address bar | Wants techconcepts.app · techconcepts.app | none (a label, no fact) | as built (HTTPS's) |
| Description, forward proxy shown | Behind the internet, a forward proxy, with one cable in from the internet and one out. | `term-forward` | **new words** |
| Description, reverse proxy shown | In front of the web server, on its cable in, the site’s reverse proxy. | `term-reverse`, `lead-2` | **new words** |
| Legend, request / response | Toward the site · Back toward you | none (which way a row goes) | **new words** |
| Legend, note | At the reverse proxy, nothing sent | `term-termination` (the note is the reverse proxy opening the seal) | **new words** |
| Table title, columns, empty | What the server sees · Way · Connection from · Your address · Who can read the request · Nothing sent yet. | `fact-sees`, `fact-passes-on`, `fact-https` | outline |
| Table rows, summaries | §3 | the outline's traces | outline |
| Plain lines | the three in §3 | `fact-https`, `term-termination`, `pattern` | **new words** |
| Spot plate label | PASSES IT ON · OWN ADDRESS | `lead-1` (passes the request on), `fact-sees` (the site sees the proxy's address) | **new words** |
| Spot window and tag | 203.0.113.30 | example data; ruling 12 | outline |
| Spot aria-label | §6 | `lead-1`, `fact-sees` | **new words** |
| Steps: titles, subtitles, narratives, facts, Go deeper, info lines | §3 | the outline's | outline |

The engraved arrows on the proxy's top are not words: they draw `pattern`'s "pass it on" and "pass the answer back".

No time figures anywhere, and Practice is not touched.

## 8. Acceptance checks

Each check is a test a builder can write, and the prototype shows each one.

1. **The drawing is unchanged for every existing layer.**
   - Take the `<g data-layer="proxies:site">` and `<g data-layer="proxies:proxy">` groups (10 in all) out of `drawNetMap().svg`. What is left equals today's SVG, character for character (870,295).
   - Its `viewBox` is `-98 -60 685 378`.
   - The builder keeps today's SVG as a fixture before applying the patch.
2. **The data is unchanged for every existing layer.** Every route in today's `drawNetMap().data.routes` is equal in the patched data; there are 60 more, all with `proxy`, `origin` or `reverse` at one end. Every other field of the data is equal.
3. **Timing.** For every event of every existing net-map lesson (20 lessons, 409 events), `netMapDriver.duration(event, data)` is today's. Snapshot the list before the patch and compare after.
4. **Applied cues.** For every existing net-map lesson, at every position and every event index from −1 to the step's length (745 states), `deriveState` is deep-equal to today's.
5. The three `.svg` files equal the build's output: `spot('proxies') + '\n'`, and each layer's groups in draw order with `display="none"` dropped.
6. **The spot.** It has exactly one lit solid, no `lm-led on`, no padlock path, the plate label PASSES IT ON · OWN ADDRESS, and exactly two `<text>` nodes reading "203.0.113.30" (the window and the tag).
7. **After step 1:** no forward proxy and no reverse proxy shown; one sealed line, `laptop>origin`; the page and the padlock on the laptop; one table row, Straight.
8. **Step 2's first frame**, before its first event: the forward proxy shown; no page and no padlock; no lit line.
9. **After step 2:** one line, `laptop>proxy>origin`, not sealed; its points pass through the box's top (the end point of `laptop>proxy`).
10. **The tunnel.** At step 3 the line `laptop>proxy>origin` is sealed. It is one `polyline.nm-conn.sealed`, not two. Nothing inside the forward proxy's part has a `lock` class, a padlock path or a text node other than its plate label and callout.
11. **After step 3:** the page and the padlock; the table rows Straight and Forward proxy.
12. **Steps 4 and 5:**
    - the forward proxy's part is hidden;
    - the reverse proxy's part is shown and the web server's own callout is hidden;
    - the callouts read "Reverse proxy · 198.51.100.7 · port 443" and "Web server · 10.0.0.20 · port 80";
    - the line `laptop>reverse` is sealed;
    - no line reaches `origin`.
13. **After step 5:** the page and the padlock; three table rows in the order Straight, Forward proxy, Reverse proxy.
14. **Seek.** Opening any step directly (outline or Steps) shows the same map as playing to it. Going back from step 4 to step 3 brings the forward proxy back and takes the reverse proxy away.
15. **The figure's description.** The forward proxy's sentence is present in steps 2 and 3 only; the reverse proxy's in steps 4 and 5 only; the resolver's sentence never.
16. **The log** has 14 rows by the end: 13 messages and 1 note. Every Time and Size is "—", and the forward proxy's address has no port. The note's Protocol, Source and Destination are "—".
17. **Durations** match §3's column to ±1 ms (they are the driver's own; a test pins them after the lesson is written).
18. **The validator refuses**, each with its own message:
    - `step.start` on a figure other than net-map;
    - a status cue in a step's start;
    - `drop` or `park` in a step's start;
    - a scene with `proxies:proxy` that does not hide the resolver;
    - `show proxy` without that layer;
    - a message to `proxy` in a step where the proxy is not shown, or is hidden;
    - a message to `reverse` before `show reverse`;
    - `conn open laptop>moon>origin`;
    - `conn open laptop>laptop>origin`;
    - `hide laptop`;
    - `show resolver`.
19. **The parser.** `parseConn('open laptop>proxy>origin')` is `{ action: 'open', from: 'laptop', via: 'proxy', to: 'origin', data: false }`, and `parseConn('open laptop>web')` gains no `via` key.
20. **No sideways scroll**, at 375 and 1440, light and dark.
21. **The card.** The Proxies card on `/networking` shows the spot, "Proxies" and its subtitle.

## 9. Open questions for the owner

None. All four are settled (the orchestrator and the analyst's L28-w, 2026-11-16):
1. **Page weight:** the +14 KB gzipped of HTML on each net-map page is accepted for this batch. Drawing only a lesson's own layers is a later unit.
2. **Router label:** "198.51.100.23 outside" stays (ruling 1).
3. **Reverse proxy's callout:** "Reverse proxy · 198.51.100.7 · port 443" stays (ruling 2).
4. **New words:** the analyst read §7, and 61 of 64 items were sound. The three rulings are applied here: the router label, the reverse callout, and step 4's note row, whose protocol, source and destination are now `—` (ruling 3).

## Appendix A. The patch

Applies to `job16/batch` at `86d0bf6` (`git apply`); 505 lines, 8 files. Its output is the three `.svg` files above.

```diff
diff --git a/src/art/figures/spots.ts b/src/art/figures/spots.ts
index b7e38cf..e57efac 100644
--- a/src/art/figures/spots.ts
+++ b/src/art/figures/spots.ts
@@ -403,6 +403,33 @@ function switchSpot() {
   return figure("switch", "FIVE PORTS · MAC TABLE", out.join(""), "A switch with five numbered ports along its front. Cables are plugged into ports 1 to 4 and run to the edge of the plate; port 5 is free. The plug in port 2 is lit, and the light over port 2 is on.");
 }
 
+// Proxies: a go-between box, one cable in and one out. The way out is lit, and the request on it carries the box's own
+// address, 203.0.113.30, engraved in a window on the box's front. Nothing on the box opens or reads what it passes on.
+function proxiesSpot() {
+  const out = [], B = { x: -50, y: -40, w: 82, d: 62, r: 2.6 }, BZ = 2.4, BH = 32, F = B.y + B.d, R = B.x + B.w, PZ = BZ + 4.2, CZ = 1.9;
+  const inX = B.x + 14, outY = B.y + 16;
+  // The cable in, from the plate's back-left edge along the front and up into the box's front-left face; the cable out,
+  // from its front-right face to the plate's right edge.
+  const inPts = [[-112, 44, CZ], [inX, 44, CZ], [inX, F + 9, CZ], [inX, F + 4.4, PZ], [inX, F + 0.5, PZ]];
+  const outPts = [[R + 0.5, outY, PZ], [R + 4.4, outY, PZ], [R + 9, outY, CZ], [112, outY, CZ]];
+  out.push(tubeOf([inPts, outPts].flatMap((list) => tubePieces(list, 1.9, P, { maxLength: 16 }))));
+  out.push(`<path class="lm-beam" fill="none" d="${k.pathOf(outPts.map(([x, y, z]) => at([x, y, z + 1.9])))}"/>`);
+  // The box: a foot, a body with a seam, a port on each face for its cable.
+  out.push(S(k.slabOf({ x: B.x - 3, y: B.y - 3, w: B.w + 6, d: B.d + 6, r: 3 }, 0, BZ, P, 4, 0.5), { tone: "lo" }));
+  out.push(S(k.slabOf(B, BZ, BH - BZ, P, 4, 0.7), { tone: "hi", inner: L(k.sideSeam(B, BH - 4, P, 4), { tone: "faint" }) }));
+  out.push(onFaceY(F, rect("lm-void", inX - 3.4, PZ - 2.6, 6.8, 5.2, 0.8) + rect("lm-void", B.x + 34, BZ + 10, 38, 7, 0.8) + `<text class="lm-addr" x="${n1(B.x + 36.4)}" y="${n1(-(BZ + 12))}">203.0.113.30</text>`));
+  out.push(onFaceX(R, rect("lm-void", -(outY + 3.4), PZ - 2.6, 6.8, 5.2, 0.8)));
+  // On its top, two engraved arrows, one each way: it passes requests on and replies back.
+  const arrow = ([x0, y0], [x1, y1]) => { const dx = x1 - x0, dy = y1 - y0, n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, hd = 5; return [[[x0, y0], [x1, y1]], [[x1, y1], [x1 - ux * hd - uy * hd, y1 - uy * hd + ux * hd]], [[x1, y1], [x1 - ux * hd + uy * hd, y1 - uy * hd - ux * hd]]]; };
+  const C = [B.x + B.w / 2, B.y + B.d / 2];
+  out.push(lines([...arrow([C[0] - 20, C[1] + 2], [C[0] + 20, C[1] + 2]), ...arrow([C[0] + 20, C[1] - 8], [C[0] - 20, C[1] - 8])], BH, "mid"));
+  // The request on its way out, over the lit cable, with the proxy's address for the reply: the lit part.
+  const TG = { x: 62, y: outY - 6, w: 36, d: 11, r: 2 }, TZ = 25;
+  out.push(`<path class="lm-shadow" d="${k.planOutline({ x: TG.x + 3, y: TG.y + 2, w: TG.w - 4, d: TG.d - 2, r: 3 }, 0, P, 4)}"/>`);
+  out.push(S(k.slabOf(TG, TZ, 2.4, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TZ + 2.4, `<text class="lm-tagt" x="${TG.x + 3}" y="${TG.y + 7.4}">203.0.113.30</text>`));
+  return figure("proxies", "PASSES IT ON · OWN ADDRESS", out.join(""), "A box with one cable coming in and one going out, its address, 203.0.113.30, in a window on its front. The cable out is lit, and over it floats a lit tag with the same address, 203.0.113.30.");
+}
+
 // Load Balancers: one balancer in front, a pool of three servers behind it, cabled in a fan. Server B's lamps are red;
 // a lit request rides the cable to C.
 function loadBalancersSpot() {
@@ -435,10 +462,10 @@ function loadBalancersSpot() {
   return figure("load-balancers", "ONE ADDRESS · THREE SERVERS", out.join(""), "A load balancer at the front with one cable coming in, and behind it a pool of three servers, A, B and C, each cabled to it. Server B’s two lamps are red. A lit request rides the cable to server C.");
 }
 
-export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets', 'switch', 'load-balancers'] as const;
+export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets', 'switch', 'load-balancers', 'proxies'] as const;
 export type SpotKind = (typeof SPOTS)[number];
 
-const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot, packets: packetsSpot, switch: switchSpot, 'load-balancers': loadBalancersSpot };
+const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot, packets: packetsSpot, switch: switchSpot, 'load-balancers': loadBalancersSpot, proxies: proxiesSpot };
 
 /** A small figure, cropped close to its plate. */
 export const spot = (kind: SpotKind): string => DRAW[kind]();
diff --git a/src/art/scenes/net-map-layers.ts b/src/art/scenes/net-map-layers.ts
index d6aead1..19fb6de 100644
--- a/src/art/scenes/net-map-layers.ts
+++ b/src/art/scenes/net-map-layers.ts
@@ -11,8 +11,10 @@ export interface CalloutLine {
 }
 
 interface PlateBase {
-  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it, N for a small one behind the internet. */
-  slot: 'E' | 'SE' | 'N';
+  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it, N for a small one behind the internet, NW for one where the resolver stands (a map that shows it hides the resolver). */
+  slot: 'E' | 'SE' | 'N' | 'NE' | 'NW';
+  /** A part of the map the plate is drawn in, hidden until a `show` cue shows it (`NET_MAP_OPTIONAL`). */
+  part?: string;
   /** The words engraved on the plate's front edge. */
   label: string;
   /** A sentence the figure's description adds while the layer is shown. It draws nothing. */
@@ -45,7 +47,21 @@ export type ServerPlate =
       /** The internet router its cable runs to. */
       puck: 'a';
     })
-  | (PlateBase & { kind: 'names' });
+  | (PlateBase & { kind: 'names' })
+  | (PlateBase & {
+      kind: 'proxy';
+      site: string;
+      /** The internet routers its two cables run to: in, from your side (isp), and out, toward the sites it reaches for you (c). */
+      pucks: ['isp', 'c'];
+    })
+  | (PlateBase & {
+      kind: 'site';
+      /** The web server (its racks and the page's dock, as a web plate draws them), and the reverse proxy in front of it, on its cable in. */
+      site: string;
+      front: string;
+      /** The callouts while the reverse proxy is shown: its own, and the web server's behind it. */
+      behind: CalloutLine[][];
+    });
 
 /** The root servers, the servers for .app, and the site's own name server, as the names plate draws them. */
 export const NAME_SERVER_SITES = ['root', 'tld', 'auth'];
@@ -59,8 +75,17 @@ export const NET_MAP_LAPTOP_ADDR = '192.168.1.100';
 /** The places every protocol's map has: home (the laptop, its router and the phone, which a unit shows), the resolver, and the internet's five routers. */
 export const NET_MAP_BASE_PLACES = ['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd', 'phone'];
 
-/** The parts of home the map leaves off until a unit's start shows them (`show phone`). */
-export const NET_MAP_OPTIONAL = ['phone'];
+/** The parts the map leaves off until a start shows them (`show phone`; Proxies' `show proxy` and `show reverse`). */
+export const NET_MAP_OPTIONAL = ['phone', 'proxy', 'reverse'];
+
+/** The parts a start may leave off the map (`hide`): the resolver, a shown forward proxy, and the web server's own callout. */
+export const NET_MAP_HIDEABLE = ['resolver', 'proxy', 'direct'];
+
+/** What the figure's description adds while an optional part is shown. */
+export const NET_MAP_PART_SENTENCES: Record<string, string> = {
+  proxy: 'Behind the internet, a forward proxy, with one cable in from the internet and one out.',
+  reverse: 'In front of the web server, on its cable in, the site’s reverse proxy.',
+};
 
 /** The phone's address as the map draws it. */
 export const NET_MAP_PHONE_ADDR = '192.168.1.101';
@@ -76,7 +101,7 @@ export const NET_MAP_BAY_COUNTS: Record<string, number> = { laptop: 4, web: 4, i
 
 /** The places a message can stop on a plate. */
 export function plateSites(plate: ServerPlate): string[] {
-  return plate.kind === 'names' ? NAME_SERVER_SITES : [plate.site];
+  return plate.kind === 'names' ? NAME_SERVER_SITES : plate.kind === 'site' ? [plate.site, plate.front] : [plate.site];
 }
 
 const line = (cls: CalloutLine['cls'], text: string): CalloutLine => ({ cls, text });
@@ -169,4 +194,28 @@ export const NET_MAP_LAYERS: Record<string, ServerPlate> = {
     align: 'end',
     lines: [line('nm-name', 'Voice server'), line('nm-addr', '203.0.113.90 · port 16384')],
   },
+  // Proxies: techconcepts.app's web server, which a reverse proxy can stand in front of (`show reverse`), and a
+  // forward proxy behind the internet, drawn only once a step's start shows it (`show proxy`).
+  'proxies:site': {
+    kind: 'site',
+    slot: 'E',
+    site: 'origin',
+    front: 'reverse',
+    label: 'TECHCONCEPTS.APP',
+    lines: [line('nm-name', 'Web server'), line('nm-addr', '198.51.100.7 · port 443')],
+    behind: [
+      [line('nm-name', 'Reverse proxy'), line('nm-addr', '198.51.100.7 · port 443')],
+      [line('nm-name', 'Web server'), line('nm-addr', '10.0.0.20 · port 80')],
+    ],
+  },
+  'proxies:proxy': {
+    kind: 'proxy',
+    slot: 'NW',
+    part: 'proxy',
+    site: 'proxy',
+    pucks: ['isp', 'c'],
+    label: 'PROXY.EXAMPLE.NET',
+    at: [300, 0],
+    lines: [line('nm-name', 'Forward proxy'), line('nm-addr', '203.0.113.30')],
+  },
 };
diff --git a/src/art/scenes/net-map.ts b/src/art/scenes/net-map.ts
index bfb8999..e5addf0 100644
--- a/src/art/scenes/net-map.ts
+++ b/src/art/scenes/net-map.ts
@@ -41,7 +41,8 @@ const IP = { x: -52, y: -44, w: 104, d: 88, r: 9 };
 const HP = { x: -134, y: 57, w: 84, d: 70, r: 8 };
 const RP = { x: -118, y: -114, w: 64, d: 54, r: 7 };
 // Places for the servers on the right: E for one big plate, NE and SE for two smaller ones; N for a small one behind the internet.
-const SLOT = { E: { x: 50, y: -127, w: 84, d: 70, r: 8 }, NE: { x: -30, y: -200, w: 64, d: 54, r: 7 }, SE: { x: 140, y: -26, w: 64, d: 54, r: 7 }, N: { x: -84, y: -196, w: 56, d: 40, r: 6 } };
+// NW is where the resolver stands, for a plate on a map that hides it (Proxies' forward proxy).
+const SLOT = { E: { x: 50, y: -127, w: 84, d: 70, r: 8 }, NE: { x: -30, y: -200, w: 64, d: 54, r: 7 }, SE: { x: 140, y: -26, w: 64, d: 54, r: 7 }, N: { x: -84, y: -196, w: 56, d: 40, r: 6 }, NW: { x: -118, y: -114, w: 64, d: 54, r: 7 } };
 const LB = { x: -127, y: 88, w: 46, d: 30, r: 3.5 }, LZ = 3.2, LID_H = 31;
 const HR = { x: -90, y: 62, w: 32, d: 18, r: 3 }, RZ = 2, RT = RZ + 9;
 const PUCK_R = 7, PUCK_H = 4.6;
@@ -207,6 +208,32 @@ function tray(T, id, site) {
   return out.join("");
 }
 
+// A proxy: a low box that passes messages on, the same for a forward proxy and a reverse one. A cable plugs into a
+// port on its front faces, and a band on each lights while it works; two arrows on its top, one each way along `dir`,
+// say that it passes things along. Nothing on it opens or reads: no screen, no padlock.
+const BOX_H = 8;
+const onFaceX = (X, inner) => `<g transform="${k.sideMatrix([X, 0], 0, P, "right")}">${inner}</g>`;
+function proxyBox(B, id, site, ports, dir) {
+  const F = B.y + B.d, R = B.x + B.w, out = [];
+  out.push(S(k.slabOf({ x: B.x - 1.2, y: B.y - 1.2, w: B.w + 2.4, d: B.d + 2.4, r: B.r + 1 }, 0, 1.2, P, 3, 0.4), { tone: "lo" }));
+  out.push(S(k.slabOf(B, 1.2, BOX_H - 1.2, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(B, BOX_H - 2.2, P, 3), { tone: "faint" }) }));
+  const port = (u) => rect("lm-void", u - 2, 0.6, 4, 2.6, 1.2);
+  const band = (cls, u0, w) => rect(cls, u0, BOX_H - 4.4, w, 1.6, 0.6);
+  const bands = (cls) => [onFaceY(F, band(cls, B.x + 2.5, B.w - 5)), onFaceX(R, band(cls, -F + 2.5, B.d - 5))];
+  const [onY, onX] = bands("lm-slot");
+  out.push(onFaceY(F, ports.filter((q) => q.face === "y").map((q) => port(q.at)).join("")), onY);
+  out.push(onFaceX(R, ports.filter((q) => q.face === "x").map((q) => port(-q.at)).join("")), onX);
+  out.push(`<g class="nm-busy" id="${id}-busy-${site}">${bands("nm-band").join("")}</g>`);
+  const cx = B.x + B.w / 2, cy = B.y + B.d / 2, half = Math.min(B.w, B.d) / 2 - 2.5, gap = 1.8, hd = 1.4, [ax, ay] = dir, [px, py] = [-ay, ax];
+  const arrow = (s, off) => {
+    const tip = [cx + ax * half * s + px * off, cy + ay * half * s + py * off], tail = [cx - ax * half * s + px * off, cy - ay * half * s + py * off];
+    const barb = (side) => [tip[0] - ax * hd * s + px * hd * side, tip[1] - ay * hd * s + py * hd * side];
+    return k.lineOnTop(tail, tip, BOX_H, P) + k.lineOnTop(tip, barb(1), BOX_H, P) + k.lineOnTop(tip, barb(-1), BOX_H, P);
+  };
+  out.push(L(arrow(1, -gap) + arrow(-1, gap), { tone: "mid" }));
+  return out.join("");
+}
+
 // ---------- Cables, and the routes along them ----------
 const CABLE_R = 1, CABLE_Z = 1.3, TZ = CABLE_Z + CABLE_R, RIDE = 2.6, HOP = PUCK_H + 1.6;
 const cable = (route) => tubeOf(tubePieces(route.map(([x, y]) => [x, y, CABLE_Z]), CABLE_R, P, { maxLength: 14 }));
@@ -244,12 +271,17 @@ function ride(stops) {
 // From one place to another along the cables, hopping over every router between. The home router is a place too:
 // messages to it from the laptop or the phone stay at home, as far as its top (the first points of their way out).
 const HOME_LEG = { laptop: 3, phone: 2 };
+// A place with two cables (Proxies' forward proxy) leaves and is reached by the one nearer the other end.
+const sideFor = (S, other) => (S.side && hops(S.side.puck, other.puck).length < hops(S.puck, other.puck).length ? { ...S, ...S.side } : S);
 function route(sites, from, to) {
-  const A = sites[from], B = sites[to];
-  if (!A || !B) throw new Error(`no route ${from} → ${to}`);
+  if (!sites[from] || !sites[to]) throw new Error(`no route ${from} → ${to}`);
+  const A = sideFor(sites[from], sites[to]), B = sideFor(sites[to], sites[from]);
   let pts;
   const own = from === "router" ? to : from;
-  if (Object.hasOwn(HOME_LEG, own) && (from === "router" || to === "router")) {
+  // Two places on one site's own network (the reverse proxy and the web server behind it): the way between them stays on its plate.
+  if (A.inner?.[to]) pts = A.inner[to];
+  else if (B.inner?.[from]) pts = [...B.inner[from]].reverse();
+  else if (Object.hasOwn(HOME_LEG, own) && (from === "router" || to === "router")) {
     const L0 = BASE_SITES[own], out = [L0.end, ...L0.leg.slice(0, HOME_LEG[own])];
     pts = from === own ? out : [...out].reverse();
   } else {
@@ -357,6 +389,56 @@ const KINDS = {
       tall: [[R.x, R.y, R.h]],
     };
   },
+  // Proxies' forward proxy: a box with two cables, one in from your side of the internet (router isp) to the left end
+  // of its front, and one out from the back end of its right side toward the sites (router c). A message reaches it,
+  // and leaves it, by the cable nearer the other end, so a line laptop > proxy > web goes in at its left and out at its right.
+  proxy(p, id, o) {
+    const B = rel(p, { x: 10, y: 14, w: 24, d: 24, r: 2 }), F = B.y + B.d, R = B.x + B.w;
+    const inX = B.x + 4, outY = B.y + 4, top = [B.x + B.w / 2, B.y + B.d / 2, BOX_H + 0.6];
+    const inLeg = [[inX, F + 3, RIDE], [inX, p.y + p.d + 3, RIDE]], outLeg = [[R + 3, outY, RIDE], [p.x + p.w + 3, outY, RIDE]];
+    const dir = [Math.SQRT1_2, -Math.SQRT1_2];
+    return {
+      things: [{ xy: [B.x + B.w / 2, B.y + B.d / 2], svg: proxyBox(B, id, o.site, [{ face: "y", at: inX }, { face: "x", at: outY }], dir) }],
+      cables: [[N[o.pucks[0]], inLeg[1], [inX, F + 0.5]], [N[o.pucks[1]], outLeg[1], [R + 0.5, outY]]],
+      sites: { [o.site]: { end: top, leg: inLeg, puck: o.pucks[0], side: { leg: outLeg, puck: o.pucks[1] } } },
+      callouts: [callTo(o, [R, B.y, BOX_H])],
+      tall: [[B.x, B.y, BOX_H]],
+    };
+  },
+  // Proxies' web server: two racks at the back and the page on a dock in front, as a web plate has them, with room at
+  // its front left for the site's reverse proxy, which a start shows on the cable in. The cable from router c comes in
+  // at the plate's front, turns at the reverse proxy's place and runs to the dock: with the box shown, the box covers
+  // the turn, and the way from the box to the server stays on the plate. The web server's own callout is a part a
+  // start can hide (`direct`); the two callouts that take its place show with the box.
+  site(p, id, o) {
+    const racks = [rel(p, { x: 8, y: 6, w: 24, d: 26, r: 2, h: 40 }), rel(p, { x: 36, y: 4, w: 28, d: 30, r: 2, h: 50 })];
+    const R = rel(p, { x: 6, y: 46, w: 20, d: 20, r: 2 }), RF = R.y + R.d, port = R.x + 4, mid = [R.x + R.w / 2, R.y + R.d / 2];
+    const DK = rel(p, { x: 32, y: 49, w: 42, d: 14, r: 2 }), PG = { x: DK.x + 3, y: DK.y + 3, w: DK.w - 6, d: DK.d - 6, r: 1 }, IN = [DK.x - 3, mid[1]];
+    const EDGE = [port, p.y + p.d + 3], TURN = [port, mid[1]];
+    let dock = S(k.slabOf(DK, 0, 3, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(DK, 1.2, P, 3), { tone: "faint" }) });
+    dock += S(k.slabOf(PG, 3, 2, P, 3, 0.4), { tone: "hi" }) + L([0, 1, 2].map((i) => k.lineOnTop([PG.x + 4, PG.y + 2.4 + i * 2.4], [PG.x + PG.w - 6 - i * 6, PG.y + 2.4 + i * 2.4], 5, P)).join(""), { tone: "lo" });
+    dock += `<g class="nm-busy" id="${id}-busy-${o.site}">${S(k.slabOf(PG, 3, 2, P, 3, 0.4), { tone: "hi", lit: true })}</g>`;
+    const end = [DK.x + 8, DK.y + DK.d / 2, 3.4], top = [...mid, BOX_H + 0.6];
+    const box = proxyBox(R, id, o.front, [{ face: "y", at: port }], [Math.SQRT1_2, -Math.SQRT1_2]);
+    return {
+      things: [
+        ...racks.map((K, i) => ({ xy: [K.x + K.w / 2, K.y + K.d / 2], svg: rack(K, i) })),
+        { xy: [DK.x + DK.w / 2, DK.y + DK.d / 2], svg: dock },
+        { xy: mid, svg: `<g data-base="reverse" data-hidden="">${box}</g>` },
+      ],
+      cables: [[N.c, EDGE, TURN, IN]],
+      sites: {
+        [o.site]: { end, leg: [[...IN, RIDE], [...TURN, RIDE], [...EDGE, RIDE]], puck: "c" },
+        [o.front]: { end: top, leg: [[port, RF + 3, RIDE], [...EDGE, RIDE]], puck: "c", inner: { [o.site]: [top, [R.x + R.w + 1.5, mid[1], RIDE], [...IN, RIDE], end] } },
+      },
+      callouts: [
+        { ...callTo(o, [DK.x + DK.w, DK.y + DK.d, 3]), part: "direct" },
+        { ...callTo(o, [R.x + R.w, RF, BOX_H], o.behind[0]), part: "reverse", hidden: true },
+        { anchor: [racks[1].x + racks[1].w, racks[1].y, racks[1].h], at: [490, -20], align: "end", lines: o.behind[1], part: "reverse", hidden: true },
+      ],
+      tall: [[racks[1].x, racks[1].y, racks[1].h]],
+    };
+  },
   // Any other server: two racks, and a pad at the front that lights while it works.
   host(p, id, o) {
     const racks = [rel(p, { x: p.w - 58, y: 6, w: 24, d: 26, r: 2, h: 40 }), rel(p, { x: p.w - 30, y: 4, w: 24, d: 30, r: 2, h: 46 })];
@@ -446,12 +528,15 @@ function serverLayer(key, s) {
   const protocol = key.split(":")[0];
   const p = SLOT[s.slot], part = KINDS[s.kind](p, `${ID}-${protocol}`, s), pl = plate(p, s.label);
   const things = [...part.things].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
-  const boxes = [], calls = part.callouts.map((c) => calloutSvg(c, boxes)).join("");
+  // A part of the map a start shows or hides (Proxies' forward proxy, its reverse proxy, the web server's own callout).
+  const inPart = (name, hidden, svg) => (name ? `<g data-base="${name}"${hidden ? ' data-hidden=""' : ""}>${svg}</g>` : svg);
+  const boxes = [], calls = part.callouts.map((c) => inPart(c.part, c.hidden, calloutSvg(c, boxes))).join("");
   const pts = [...part.tall, ...k.boxCorners(p, FLOOR, 0)].map(at);
   for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
+  const all = (svg) => inPart(s.part, true, svg);
   return {
     key, protocol, sites: part.sites, pts,
-    parts: { under: pl.under, plates: pl.over, cables: part.cables.map((c) => cable(c)).join(""), things: things.map((t) => t.svg).join(""), calls },
+    parts: { under: all(pl.under), plates: all(pl.over), cables: all(part.cables.map((c) => cable(c)).join("")), things: all(things.map((t) => t.svg).join("")), calls: all(calls) },
   };
 }
 
diff --git a/src/art/scenes/parts.ts b/src/art/scenes/parts.ts
index 9c14d9a..fc84d90 100644
--- a/src/art/scenes/parts.ts
+++ b/src/art/scenes/parts.ts
@@ -1,4 +1,4 @@
-import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_ROUTERS, plateSites } from './net-map-layers';
+import { NET_MAP_BASE_PLACES, NET_MAP_HIDEABLE, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_ROUTERS, plateSites } from './net-map-layers';
 import { OSI_CUE_ARGS, OSI_ROUTES, OSI_WORDS } from './osi-stacks';
 import { SWITCH_PLACES, SWITCH_PLUG_ARGS, SWITCH_ROUTES } from './switch-parts';
 import { POOL_PLACES, POOL_ROUTES, POOL_SERVERS } from './pool-parts';
@@ -62,8 +62,10 @@ export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
       // A copy of the tag waits in a bay (`park <place> <bay> <TAG>`) until a message with its tag takes it, or `unpark laptop` sends the laptop's into its screen.
       park: 'text',
       unpark: 'text',
+      // A new visit (Proxies, as a step begins): the page, the padlock and every lit connection go.
+      fresh: 'flag',
     },
-    args: { drop: NET_MAP_ROUTERS, hide: ['resolver'], show: NET_MAP_OPTIONAL },
+    args: { drop: NET_MAP_ROUTERS, hide: NET_MAP_HIDEABLE, show: NET_MAP_OPTIONAL },
     layers: Object.keys(NET_MAP_LAYERS),
     board: false,
     // Its driver settles a unit's start under the cues that have played.
diff --git a/src/content/schema.ts b/src/content/schema.ts
index 114d550..5cabc94 100644
--- a/src/content/schema.ts
+++ b/src/content/schema.ts
@@ -330,6 +330,12 @@ export const stepSchema = z.strictObject({
   deep: z.array(paragraphSchema).min(1),
   facts: z.array(tracedFactSchema),
   events: z.array(sceneEventSchema),
+  /**
+   * Cues in place as the step begins, before its first event, from then on: Proxies takes the forward proxy off the
+   * map and shows the site's reverse proxy as step 4 begins. Only a figure that shows a start takes it, and like a
+   * scene's start it sets no status.
+   */
+  start: z.array(cueSchema).optional(),
   status: text.optional(),
   /** What the log says while it is empty at this step. */
   idle: text.optional(),
diff --git a/src/engine/timeline.ts b/src/engine/timeline.ts
index 4b6c537..2ac04b8 100644
--- a/src/engine/timeline.ts
+++ b/src/engine/timeline.ts
@@ -207,10 +207,14 @@ export function deriveState(lesson: Lesson, p: Position, eventIndex: number): De
 
   // Steps before the current one apply in full: none at the Overview, all of them at Learn and Practice.
   const fullSteps = slot.kind === 'overview' ? 0 : slot.kind === 'step' ? slot.step - 1 : u.steps.length;
-  const applied = [
-    ...u.steps.slice(0, fullSteps).flatMap((step) => step.events.map((event) => ({ event, current: false }))),
-    ...events.slice(0, Math.max(0, eventIndex)).map((event) => ({ event, current: true })),
-  ];
+  // Each step that has begun: its start (`step.start`, cues in place as it begins), then its events, in full before the
+  // current step and the first `eventIndex` of it.
+  const begun = slot.kind === 'step' ? slot.step : fullSteps;
+  const applied = u.steps.slice(0, begun).flatMap((step, i) => {
+    const current = i === fullSteps;
+    const own = current ? events.slice(0, Math.max(0, eventIndex)) : step.events;
+    return [...(step.start ?? []).map((cue) => ({ cue, step, current })), ...own.map((event) => ({ event, current }))];
+  });
 
   const defs = tablesOf(u);
   // Fresh tables every time: applyTableEvent changes them in place.
@@ -221,7 +225,13 @@ export function deriveState(lesson: Lesson, p: Position, eventIndex: number): De
   let labels: MessageLabels | null = null;
   let active: SceneEvent | null = null;
 
-  for (const { event, current } of applied) {
+  for (const item of applied) {
+    if ('cue' in item) {
+      const { cue, arg } = item.cue;
+      cues.push({ cue, ...(arg === undefined ? {} : { arg }), eventId: `step:${item.step.id}`, current: item.current });
+      continue;
+    }
+    const { event, current } = item;
     if (current) active = event;
 
     if (event.type === 'table') {
diff --git a/src/lib/figures.ts b/src/lib/figures.ts
index 8c3f9ab..343fe22 100644
--- a/src/lib/figures.ts
+++ b/src/lib/figures.ts
@@ -19,6 +19,7 @@ const FIGURES: Record<string, () => string> = {
   packets: () => spot('packets'),
   switch: () => spot('switch'),
   'load-balancers': () => spot('load-balancers'),
+  proxies: () => spot('proxies'),
 };
 
 /**
diff --git a/src/scenes/drivers/net-map.ts b/src/scenes/drivers/net-map.ts
index ca65de9..9d71f5e 100644
--- a/src/scenes/drivers/net-map.ts
+++ b/src/scenes/drivers/net-map.ts
@@ -1,6 +1,6 @@
 // Only types from the drawing module: its code is for the build, and stays out of the page.
 import type { NetMapData } from '../../art/scenes/net-map';
-import { NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_ROUTERS, NET_MAP_TAG_MAX } from '../../art/scenes/net-map-layers';
+import { NET_MAP_HIDEABLE, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_PART_SENTENCES, NET_MAP_ROUTERS, NET_MAP_TAG_MAX } from '../../art/scenes/net-map-layers';
 import type { Cue, MessageEvent, SceneEvent } from '../../content/schema';
 import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
 import { animate, easeInOut, wait } from '../motion';
@@ -18,14 +18,18 @@ import { animate, easeInOut, wait } from '../motion';
  * - `status <text>`: the laptop's status line; `status-known` and `status-done` style it (with or without the
  *   status of the same event), and a new status without either is plain again;
  * - `conn <open|seal|close> <from>><to>[ data]`: a connection that stays lit, glows brighter once sealed, and goes
- *   once closed; `data` is FTP's dashed second line, drawn above the first;
+ *   once closed; `data` is FTP's dashed second line, drawn above the first; `<from>><via>><to>` runs through a place
+ *   on the way, as one line (Proxies' tunnel through the forward proxy);
+ * - `fresh`: a new visit: the page, the padlock and every lit connection go;
  * - `page text|full`: the page on the laptop's screen, its text first, then all of it;
  * - `lock`: the padlock in the laptop's address bar;
  * - `tray <site> <on|off>`: a letter waiting on a mail server's tray, or gone from it (it leaves as it is sent);
  * - `addr <text>`, `url <text>`: the laptop's address and its address bar;
  * - `drop <router>`: a DROPPED mark on that router's top, which stays, for a packet a router threw away;
- * - `hide resolver` (a unit's start only): the DNS resolver, its cable and its callout are left off the map;
- * - `show phone` (a unit's start only): the phone, which every other map leaves off, lies on the home plate;
+ * - `hide resolver` (a start only): the DNS resolver, its cable and its callout are left off the map; `hide proxy`
+ *   and `hide direct` take Proxies' forward proxy and the web server's own callout off again;
+ * - `show phone` (a start only): the phone, which every other map leaves off, lies on the home plate; `show proxy`
+ *   and `show reverse` draw Proxies' forward proxy and the site's reverse proxy;
  * - `park <place> <bay> <TAG>`: a copy of the tag waits, unlit, in that bay (the laptop's four, the web server's four, a
  *   router's top) until a message with its tag takes it or `unpark laptop` (the only place that unparks) sends the laptop's tags into the laptop's
  *   screen; a gap (a dashed outline) marks an empty bay with a parked tag before and after it. A note that parks takes
@@ -36,6 +40,8 @@ import { animate, easeInOut, wait } from '../motion';
  * A unit's labels give the words before any cue: `laptop` (the status line), `laptopAddr`, `url`, and `router`,
  * the home router's callout in one or two lines (a line with a number is an address, a line of words a note), and
  * `isp`, `a`, `b`, `c` and `d`, the name on a strip at each internet router; a router without a label has no strip.
+ * A step's own start (`step.start`) is cues in place as that step begins, before its first event: they come to the
+ * driver among the played cues, under the id `step:<id>`.
  * A unit's start (`view.start`) is cues already in place before any has played, at every position of the unit:
  * TLS's line, already open (`conn open laptop>web`), and the letters waiting in POP3's and IMAP's mailbox
  * (`tray mail on`). The cues that play go on from there, so TLS's handshake seals the line its start opened.
@@ -92,15 +98,17 @@ export interface ConnCue {
   action: 'open' | 'seal' | 'close';
   from: string;
   to: string;
+  /** A place the line runs through on the way, as one line (Proxies' tunnel through the forward proxy). */
+  via?: string;
   /** FTP's second line, for the data, beside the control line. */
   data: boolean;
 }
 
-/** Reads a `conn` cue's argument, `"<open|seal|close> <from>><to>[ data]"`, or throws: anything else is a mistake in the lesson. */
+/** Reads a `conn` cue's argument, `"<open|seal|close> <from>>[<via>>]<to>[ data]"`, or throws: anything else is a mistake in the lesson. */
 export function parseConn(arg: string): ConnCue {
-  const m = /^(open|seal|close) ([a-z0-9-]+)>([a-z0-9-]+)( data)?$/.exec(arg);
-  if (m === null) throw new Error(`The network map's conn cue needs "<open|seal|close> <from>><to>[ data]", not "${arg}".`);
-  return { action: m[1] as ConnCue['action'], from: m[2]!, to: m[3]!, data: m[4] !== undefined };
+  const m = /^(open|seal|close) ([a-z0-9-]+)>(?:([a-z0-9-]+)>)?([a-z0-9-]+)( data)?$/.exec(arg);
+  if (m === null) throw new Error(`The network map's conn cue needs "<open|seal|close> <from>>[<via>>]<to>[ data]", not "${arg}".`);
+  return { action: m[1] as ConnCue['action'], from: m[2]!, to: m[4]!, ...(m[3] === undefined ? {} : { via: m[3] }), data: m[5] !== undefined };
 }
 
 /** A `park` cue, read: where a copy of the tag waits. */
@@ -212,7 +220,7 @@ interface MapState {
   addr: string;
   url: string;
   /** Lit connections in the order they opened, by id: the route, or the route and ` data`. */
-  conns: Map<string, { route: string; data: boolean; sealed: boolean }>;
+  conns: Map<string, { from: string; to: string; via?: string; data: boolean; sealed: boolean }>;
   page: '' | 'text' | 'full';
   lock: boolean;
   trays: Map<string, boolean>;
@@ -342,11 +350,16 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
         else if (cue === 'addr') s.addr = arg;
         else if (cue === 'url') s.url = arg;
         else if (cue === 'lock') s.lock = true;
+        else if (cue === 'fresh') {
+          s.page = '';
+          s.lock = false;
+          s.conns.clear();
+        }
         else if (cue === 'drop') {
           if (!Object.hasOwn(map.tops, arg)) throw new Error(`The network map has no router "${arg}" to drop a packet at.`);
           s.drop = arg;
         } else if (cue === 'hide') {
-          if (!bases.has(arg) || NET_MAP_OPTIONAL.includes(arg)) throw new Error(`The network map cannot hide "${arg}".`);
+          if (!bases.has(arg) || !NET_MAP_HIDEABLE.includes(arg)) throw new Error(`The network map cannot hide "${arg}".`);
           s.hidden.add(arg);
         } else if (cue === 'show') {
           if (!NET_MAP_OPTIONAL.includes(arg)) throw new Error(`The network map cannot show "${arg}".`);
@@ -374,11 +387,11 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
   }
 
   function connect(s: MapState, c: ConnCue): void {
-    const route = `${c.from}>${c.to}`;
-    routeBetween(map, c.from, c.to);
+    const route = c.via === undefined ? `${c.from}>${c.to}` : `${c.from}>${c.via}>${c.to}`;
+    routeOf(map, c);
     const id = c.data ? `${route} data` : route;
     const line = s.conns.get(id);
-    if (c.action === 'open') s.conns.set(id, { route, data: c.data, sealed: false });
+    if (c.action === 'open') s.conns.set(id, { from: c.from, to: c.to, ...(c.via === undefined ? {} : { via: c.via }), data: c.data, sealed: false });
     else if (line === undefined) throw new Error(`The conn cue ${c.action === 'seal' ? 'seals' : 'closes'} ${id}, which is not open.`);
     else if (c.action === 'seal') line.sealed = true;
     else s.conns.delete(id);
@@ -447,7 +460,7 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
         const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
         line.setAttribute('class', `nm-conn${c.data ? ' alt' : ''}${c.sealed ? ' sealed' : ''}`);
         if (c.data) line.setAttribute('transform', DATA_LINE_LIFT);
-        line.setAttribute('points', pointsOf(rideOf(...(c.route.split('>') as [string, string])).flat));
+        line.setAttribute('points', pointsOf(rideOf(c.from, c.to, c.via).flat));
         return line;
       }),
     );
@@ -467,6 +480,7 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
     // What the figure says it draws is what it draws: no resolver, a phone and a stranger only when shown.
     let words = s.hidden.has('resolver') ? described.replace(RESOLVER_SENTENCE, '') : described;
     if (s.shown.has('phone')) words = words.replace(HOME_SENTENCE, HOME_WITH_PHONE);
+    for (const [base, sentence] of Object.entries(NET_MAP_PART_SENTENCES)) if (s.shown.has(base) && !s.hidden.has(base)) words += ` ${sentence}`;
     for (const key of s.layers) {
       const sentence = Object.hasOwn(NET_MAP_LAYERS, key) ? NET_MAP_LAYERS[key]!.describe : undefined;
       if (sentence !== undefined) words += ` ${sentence}`;
```
