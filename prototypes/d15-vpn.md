# D15b: VPN, the scene and the card art (job 16, batch 4)

The spec for the new Networking Concepts lesson **VPN** (`vpn`, stop 20, the track's last): its Watch scene on the network map, its table, its log and its card art. It is for the design gate: the owner approves the prototype, then a builder builds it. D15a (Proxies) is a separate spec. The two patches touch some of the same files, and §5.9 says how this one merges after D15a's.

| File | What it is |
|---|---|
| `prototypes/d15-vpn.html` | The clickable prototype: the Lesson page playing the five steps, and the card art on the track's route. It is one self-contained file of 2.3 MB, with its styles, fonts, figure and script inline, and it loads nothing. |
| `prototypes/d15-vpn-part-server.svg` | The five groups of the layer `vpn:vpn`: the VPN server's plate, rack, pad, cables and callout. |
| `prototypes/d15-vpn-part-web.svg` | The five groups of the layer `vpn:web`: example.net's web server, with no port in its callout. |
| `prototypes/d15-vpn-part-cafe.svg` | The three groups of the café (`data-base="cafe"`): its engraving, the listener, and the listener's callout. |
| `prototypes/d15-vpn-spot.svg` | `spot('vpn')`, VPN's card art. |

Each part file is the map's header (`<svg … class="lm-svg nm" viewBox="-98 -60 685 378">`), then the whole groups the patched `drawNetMap()` emits for that part, in document order and joined with nothing between them, then `</svg>` and a newline. This is the same form as D11's part files. The build copies them tag for tag, and a test proves it (check 2).

The patch in Appendix A holds the code that draws all of this and the driver and validator changes. It sits on **D15a's patch**: apply D15a's Appendix A (`prototypes/d15-proxies.md` at D15a's commit `c159f0b`) to `job16/batch` at `86d0bf6`, then this one, each with `git apply`. §5.9 says how it was merged and which tests stay with the Proxies builder. The SVGs carry classes and CSS variables, not colours, so they render properly only inside a page that loads the site's CSS and the shared defs.

**How to use the prototype.** The tab at the right edge ("D15b prototype") opens the switches: page (Lesson or Card art), theme and motion. Everything else is the Lesson page: the outline, Play, the step arrows, the speed, and on a phone the tabs Explain, Steps, Log and Table. A query string opens a state directly:
- `?step=3&play=1` opens step 3, playing.
- `?at=3.2` opens step 3 with its first two events landed, a state you can stop on and look at.
- `?ride=4.4&k=0.5` opens step 4 with event 4 frozen halfway along its ride, to look at a moving tag.
- `?theme=dark`, `?tab=table` (phone), `?page=cards` and `?motion=reduced` set the rest.

The prototype's figure is the patch's drawing, and its moves copy the net-map driver's with the changes in §5. Its Learn and Practice are stubs. The story is the analyst's (`.superpowers/analysis/vpn/report.md` §2 and its Rulings, which win), placed on the map as plan.md job 16, decisions 4 to 6, say. Step titles, narratives, facts, statuses, table cells and log info are the outline's words, used as placeholders the author will set. §7 marks the words that are new.

**One variant.** Net-map could show the whole scene, so there is no new `tunnel` figure (§2.1), and I found no second layout worth the owner's time.

## 1. What changes and what stays

**Stays, byte for byte.** Every existing net-map lesson draws and times as today. The patch adds groups, wraps two existing parts in a `<g data-base="home">`, moves the unused slot NE, and appends two layers after every existing one. With the new groups cut out and the home wrappers opened, `drawNetMap().svg` hashes to today's `EXPECTED.svg`. With the new places' routes left out, the data hashes to today's `EXPECTED.data`. Every existing lesson's `duration` list is unchanged (`net-map.durations.test.ts` passes on the patch untouched). The frame stays `-98 -60 685 378`.

**Changes (VPN only):**
1. **The café** (`show cafe`, a unit's start): the home plate's engraving reads CAFÉ WI-FI · 192.168.1.0/24. The laptop's cable to the router is gone, because the laptop is on the Wi-Fi: a tag still rides the same path, through the air. Beside your laptop sits **someone listening**, a small laptop with a radio stick, its callout reading "Someone listening / 192.168.1.66". The figure's description says "a café: your laptop, the café’s router, and someone else on its Wi-Fi, listening." in place of "your home: a laptop and its router."
2. **The listener's screen** (`listener reads|outside`): dark until it hears something. With `reads`, the screen glows and all three lines are lit: it can read your request. With `outside`, it glows with the top line only: it sees where the request goes and nothing more.
3. **The VPN server** (layer `vpn:vpn`, slot NE, behind the internet on the right): a rack, and in front of it a pad engraved with one outline inside another, one packet inside another. It has two sites on one pad. `vpn` is the tunnel's end, cabled to router a. `vpn-out` is what the server sends on, on its own cable to router c. The callout reads "VPN server / 203.0.113.40".
4. **example.net** (layer `vpn:web`): the web server as every web plate draws it. Its callout reads "Web server / 203.0.113.80" with **no port**, because the lesson reaches it at 80 and then at 443 (Ruling 4).
5. **The tunnel** (`conn open|seal laptop>vpn tunnel`): a wide band, 7 map units, drawn along the cables from your laptop through isp and a to the VPN server's pad. It is dim while IKE runs and lit once sealed. It stops at the pad. The leg from `vpn-out` to example.net is a plain cable with only the usual narrow trail of a moving tag, in every step.
6. **The padlock** (`lock`) lights in step 5 only, on the last event.

**The table** `who-reads`, "Who can read your request", has three fixed rows: On the café’s Wi-Fi, The VPN server, After the VPN server. Its columns are **Who**, **Sees it going to** and **Can read it?** (prose). A row anyone can read carries the mark word **readable**. The panel is the as-built TablePanel, with its own mark word.

**The page as built stays** as it is: the outline, the stage, the panel, the log, the phone tabs, Learn and Practice. The top bar shows no OSI chip, because the badge is `spans` (Ruling 13).

## 2. Gaps decided

### 2.1 Net-map, not a new figure

Plan decision 4 says to try net-map first. Net-map shows every idea in the outline:
- The listener is a part of the café, which takes the home plate's place.
- The tunnel is a `conn` drawn as a band.
- The server's two sites keep the sealed leg and the plain leg on different cables.
- The table carries who can read what.

A `tunnel` figure would have meant a new driver (about 15 KB of JS) and its own art. It would also have lost the internet in the middle, which is what makes "the tunnel ends at the server" visible.

### 2.2 Two sites on one server, not one

With one site, the plain request from the VPN server to example.net would leave by the tunnel's own cable (server, then a, then web). Its trail would ride inside the lit band, and the sealed and plain legs would look the same for one stretch. With `vpn-out` on its own cable to router c, the plain leg never touches the band. `entryRouter` in the validator returns `c` for `vpn-out`.

### 2.3 NE moves left

At its old place, `{ x: -30, y: -200 }`, a plate at NE stands behind E's web racks, and the racks hide its front, pad and cable. No layer used NE until now. The slot moves to `{ x: -50, y: -182 }`, the same size, where its front is clear of the racks at both widths. The frame does not change. D15a uses NW and E, not NE (I read its patch), so the two do not collide on geometry.

### 2.4 The café is a part, not a new base place

The café is an optional part, as the phone is (`NET_MAP_OPTIONAL`). `NET_MAP_INSTEAD = { cafe: 'home' }` says what it takes the place of. The driver hides home's groups while the café is shown, and `hide home` throws. The laptop, the router, their addresses and every route from the laptop stay exactly as they are. **The laptop's drawn address stays 192.168.1.100.** The listener is art and sends nothing, so it is not a place: no message rides to or from it.

### 2.5 One tag rule

A tag says what someone on that cable can read: `GET /`, `PAGE`, `IKE_SA_INIT`, `IKE_AUTH`, `ESP`, `HTTPS`. So a sealed request is `ESP` on the tunnel and `GET /` past the server (step 4), or `HTTPS` past the server (step 5). The legend has two kinds, Request and Reply. There is no `encrypted` kind, because its glyph is a padlock and the padlock means HTTPS here (step 5).

### 2.6 Statuses land where they become true

A status cue stays until the next one, across steps. So each status sits on the event where it becomes true, not on the step:

| Step | Status | Event |
|---|---|---|
| 1 | Readable on the café’s Wi-Fi | the GET |
| 2 | Setting up the tunnel | the first IKE_SA_INIT |
| 2 | Tunnel ready | the IKE_AUTH reply |
| 3 | Sealed in the tunnel | the ESP |
| 4 | Plain again past the VPN server | the GET from `vpn-out` |
| 5 | Sealed all the way to the site | the first ESP |

### 2.7 Also decided

- **Views: network only.** There is no Network / Sequence switch, so the unit has `views: ['network']`, as Packets does.
- **The resolver is hidden** (`hide resolver`): there is no DNS in the story, and its cabinet would sit by the tunnel's cable at the back.
- **No `addr` cue** (Ruling 3): 203.0.113.41 is in the log, the narrative and the table, never on the laptop.
- **No router callout and no name strips:** the labels give neither.
- **No `over` carrier.** "One packet inside another" is told by the server pad's engraving, the tag word ESP and the log's info. A second moving part was not worth its cost.

## 3. The scene and its steps

Unit `vpn`, figure `net-map`.
- Layers: `['vpn:vpn', 'vpn:web']`.
- Start: `hide resolver`, `show cafe`.
- Labels: `laptop` "On the café’s Wi-Fi" and `url` "example.net". There is no `laptopAddr` (the default 192.168.1.100), no `router` and no strip labels.
- Views: `['network']`.

The log's Time and Size are "—" for every row, as the outline gives no capture.

Each message's time is its ride, 500 ms plus 4 ms a unit of cable, plus 450 ms resting at 1×. A table update lands at once. The rides are laptop to web 266.2 units (2,015 ms), laptop to vpn 284.9 (2,090 ms) and vpn-out to web 244.1 (1,926 ms). Each route's reverse is the same length.

| Step | Event | Plain line | Cues | Laptop status | Table | Time |
|---|---|---|---|---|---|---|
| 1 Plain HTTP on café Wi-Fi | GET / · laptop → web, HTTP, 192.168.1.100:50422 → 203.0.113.80:80 | Your laptop asks example.net for its page, in plain HTTP. | `listener reads`, status | Readable on the café’s Wi-Fi | | 2,015 ms |
| | update | (summary) Someone on the café’s Wi-Fi can read your request. | | | café row: example.net · Yes: the request and the page · **readable** | 0 |
| | PAGE · web → laptop | The page comes back, in plain HTTP. | `page text` | | | 2,015 ms |
| 2 IKE: setting up the tunnel | IKE_SA_INIT · laptop → vpn, IKE, :500 → :500 | Your laptop asks the VPN server to agree on keys. | `conn open laptop>vpn tunnel`, status | Setting up the tunnel | | 2,090 ms |
| | IKE_SA_INIT · vpn → laptop | The server agrees, and both see the café’s router in the way. | | | | 2,090 ms |
| | IKE_AUTH · laptop → vpn, :4500 → :4500 | Your laptop proves who it is, encrypted, and asks for an address. | | | | 2,090 ms |
| | IKE_AUTH · vpn → laptop | The server proves who it is and gives your laptop 203.0.113.41. | `conn seal laptop>vpn tunnel`, status | Tunnel ready | | 2,090 ms |
| 3 ESP: wrapped and sealed | ESP · laptop → vpn, ESP, :4500 → :4500 | Your request, sealed inside a packet addressed to the VPN server. | `listener outside`, status | Sealed in the tunnel | | 2,090 ms |
| | update | Someone on the café’s Wi-Fi now sees only that you’re talking to the VPN server. | | | café row: 203.0.113.40, the VPN server · No: sealed (mark off) | 0 |
| 4 Out of the tunnel | update | The VPN server unwraps your request and can read it. | | | server row: example.net · Yes, once it unwraps it · **readable** | 0 |
| | GET / · vpn-out → web, HTTP, 203.0.113.41:50423 → 203.0.113.80:80 | The VPN server sends your request on to example.net. | status | Plain again past the VPN server | | 1,926 ms |
| | update | After the VPN server, anyone on the way could read it. | | | after row: example.net · Yes: plain HTTP again · **readable** | 0 |
| | PAGE · web → vpn-out | example.net replies to 203.0.113.41, so the page goes to the VPN server. | | | | 1,926 ms |
| | ESP · vpn → laptop | The server seals the page and sends it back through the tunnel. | `page text` | | | 2,090 ms |
| 5 HTTPS still matters | ESP · laptop → vpn | Your HTTPS request, sealed again inside a packet to the VPN server. | `url https://example.net`, status | Sealed all the way to the site | | 2,090 ms |
| | update | The VPN server unwraps it, and finds it still sealed by HTTPS. | | | server row: example.net · No: sealed by HTTPS (mark off) | 0 |
| | HTTPS · vpn-out → web, 203.0.113.41:50424 → 203.0.113.80:443 | The VPN server sends it on, still sealed by HTTPS. | | | | 1,926 ms |
| | update | After the VPN server, it stays sealed by HTTPS. | | | after row: example.net · No: sealed by HTTPS (mark off) | 0 |
| | HTTPS · web → vpn-out | example.net sends the page back, sealed by HTTPS. | | | | 1,926 ms |
| | ESP · vpn → laptop | The page comes back through the tunnel, still sealed by HTTPS inside. | `lock`, `page text` | | | 2,090 ms |

Step totals at 1×: 4,030 ms, 8,360 ms, 2,090 ms, 5,942 ms and 8,032 ms.

Log info, one per message, in order:
1. Plain HTTP: anyone on the way could read it
2. The page, in plain HTTP
3. Let’s agree on keys
4. Keys agreed; there’s a NAT in the way, so carry on at port 4500
5. Encrypted: who I am, and may I have an address?
6. Encrypted: who I am; your address is 203.0.113.41
7. Outside: to the VPN server. Inside, sealed: GET / to example.net
8. Unwrapped: plain HTTP again, from the VPN’s address
9. The page, to the VPN’s address
10. Outside: from the VPN server. Inside, sealed: the page
11. Outside: to the VPN server. Inside, sealed twice: an HTTPS request
12. Still sealed by HTTPS: the VPN server can’t read it
13. The page, sealed by HTTPS
14. Outside: from the VPN server. Inside, sealed twice: the page

The log's Proto column is HTTP, IKE, ESP or HTTPS, as the table above gives.

### 3.1 What moves, event by event

Everything moves as the driver moves every net-map message today.
- The tag rides the route with its trail, and the sender's light goes off a quarter of the way along.
- Both server sites light the one pad, and the café's router lights its three lights for a message to or from the laptop.
- What a message leaves, its cues, is painted as it lands, and the tag rests 450 ms.

What is new:
- The listener's screen changes as the GET lands in step 1 and as the ESP lands in step 3: a 200 ms opacity fade, none under reduced motion.
- The tunnel band appears, dim, as the first IKE_SA_INIT lands. It brightens as the IKE_AUTH reply lands and stays lit to the end.
- The moving tag on the tunnel rides over the band.

Opening a step directly from the outline or the Steps list shows the same listener, band, page, padlock and table as playing to it.

## 4. Sizes, spacing and breakpoints

### 4.1 The figure (plate units, drawn at build time)

- **NE slot:** `{ x: -50, y: -182, w: 64, d: 54, r: 7 }`, which was `{ x: -30, y: -200 }`.
- **VPN plate parts**, relative to the plate:
  - rack `{ x: w-26, y: 6, w: 20, d: 20, h: 34 }`;
  - pad `{ x: 7, y: d-24, w: 24, d: 14, h: 2.4 }`, with two engraved outlines inset 3 by 2.5 and 7 by 5.
- **Cables:** the tunnel's runs from router a to the pad's front, and the out cable from router c to the pad's right side.
- **Callout:** at `[330, -14]`, aligned to its end.
- **Listener:** base `{ x: -73, y: 101, w: 19, d: 13 }` 1.8 high, lid 14 high, and a radio stick at `[LS.x + w + 1.6, LS.y + 1.4]`, 12.6 high.
  - The screen has three lines 1.4 high and 3 apart; the third is 4 shorter.
  - Its callout stands below the café plate, at the frame's left: text at `[-80, 280]`, start-aligned. Its leader runs from the listener's front-left corner, `[LS.x, LS.y + LS.d, 1.8]`. The text keeps clear of the internet's label, so the listener never reads as part of the internet (Ruling 1). The spot is the lowest and leftmost a callout box can take without growing the frame: the frame is built from every callout's box.
- **Tunnel band:** stroke 7 map units, not scaling-free (`vector-effect: none`), so it narrows with the map:
  - unsealed: `--lit-b` at 0.2 opacity;
  - sealed: `--lit-a` at 0.42 opacity.

### 4.2 Measured

Before is today's net-map page (the D13a prototype, Packets, which ports the as-built page). After is this prototype. The figure's box is set by the stage. The map is drawn at min(width / 685, height / 378) of the box.

| | 1440 × 900 before | 1440 × 900 after | 375 × 812 before | 375 × 812 after |
|---|---|---|---|---|
| Figure box | 733 × 398 (1 table row) to 733 × 317 (4 rows) | 733 × 347 (3 rows, all steps) | 375 × 275 | 375 × 275 |
| Map drawn at | 1.053 to 0.840 | 0.919 | 0.547 | 0.547 |
| Table panel height | 100 to 181 | 151 | (Table tab) | 372 at step 4's end, in the Table tab |
| Listener's screen | — | 14.8 × 21.6 px | — | 8.8 × 12.9 px |
| Tunnel band | — | 6.4 px | — | 3.8 px |
| Moving tag (ESP) | — | 26.6 × 17.5 px | — | 15.9 × 10.5 px |
| "Someone listening" to the internet's label | — | 15 px below it and starting 105 px to its left | — | 10 px below it and starting 62 px to its left |
| Sideways scroll | none | none | none | none |

The three fixed rows keep the stage one height through all five steps at 1440: the map does not jump as rows fill. That is 82 px less than Packets' first step and 30 px more than its last.

### 4.3 Breakpoints

None new. The page's own breakpoints apply, and the phone tabs are Explain, Steps, Log and Table. At 375 the table's three columns wrap inside 375 px with no sideways scroll, and the mark word sits under the row's name.

## 5. For the builder: every code change

Appendix A is the whole patch. In words:

1. **`net-map-layers.ts`**
   - The slot type gains `'NE'`.
   - `ServerPlate` gains `kind: 'vpn'` with `site`, `puck: 'a'`, `out` and `outPuck: 'c'`, and `plateSites` returns `[site, out]` for it.
   - `NET_MAP_OPTIONAL` becomes `['phone', 'cafe']`.
   - New: `NET_MAP_INSTEAD = { cafe: 'home' }` and `NET_MAP_LISTENER_ADDR = '192.168.1.66'`.
   - Two layers are appended after `tcp-udp:voice`, in this order: `vpn:vpn` and `vpn:web`. The order matters: layers draw in this order, and the server's plate stands behind the web server's.
2. **`net-map.ts` (drawing)**
   - SLOT.NE moves (§4.1).
   - `plate()` takes an optional `words` function, so the home plate's engraving can be wrapped.
   - A new `KINDS.vpn` draws the rack, the pad and two sites.
   - A new `listener(id)`.
   - Home's engraving and the laptop-to-router cable are wrapped in `<g data-base="home">`.
   - The café's engraving, the listener and its callout are each wrapped in `<g data-base="cafe" data-hidden="">`.
3. **`net-map.css`**
   - Add `.nm-conn.tunnel` and `.tunnel.sealed`.
   - Add the listener's `.nm-hear-head` and `.nm-hear-body`, with `#nm-listener[data-hear]`.
   - Reduced motion drops the listener's fade.
4. **`drivers/net-map.ts`**
   - `parseConn` reads `[ data| tunnel]`, and the state's lines carry `tunnel`.
   - A new `listener` cue sets `data-hear` and throws for anything but `reads` or `outside`.
   - `paint` hides each base that a shown part takes the place of (`NET_MAP_INSTEAD`), and `hide` refuses those bases.
   - The description swaps the home sentence for the café's.
   - The header comment lists the new cues.
5. **`parts.ts`**: the cue `listener: 'text'`, and `args.listener: ['reads', 'outside']`.
6. **`define.ts`** (validator)
   - `entryRouter` returns `outPuck` for a VPN plate's `out`.
   - `show cafe` with `show phone` is refused.
   - `listener` without `show cafe` is refused.
   - `park laptop …` with `show cafe` is refused, because the laptop's bays lie under the listener.
7. **`spots.ts` and `figures.ts`**: `vpnSpot()`, `'vpn'` in `SPOTS`, and `vpn: () => spot('vpn')`.
8. **Tests**
   - The hash test cuts the new groups and opens home's wrappers first (`withoutVpn` in `svg-groups.ts`).
   - The data test leaves out the `vpn` and `vpn-out` routes.
   - The lists gain the new layer, places, cue and args.
   - Selectors for "nothing else hidden" also skip `data-base="cafe"`.
   - Router's tag-for-tag test opens with `withoutVpn`.
   - New tests cover the part files, the spot, the café, the listener, the tunnel and the validator rules.

**What the driver change costs.** On D15a's patch, the driver is 14,137 bytes minified before and 14,795 after, so +658 bytes, or +235 bytes gzipped. On `job16/batch` alone it was +689, or +253 gzipped. With both patches, the lesson's JavaScript, as `npm run build` and the budget check measure it, is 109.8 KB gzipped of the 200 KB budget on every lesson page. It was 109.0 on `job16/batch`, and this patch alone took it to 109.4. The figure's HTML grows by about 18 KB gzipped on every net-map page, because every net-map page draws every layer hidden. On `job16/batch` What is HTTP went from 116.1 to 134.7 KB and TCP/UDP from 133.1 to 151.3 KB. With both patches they are 150.9 and 167.7 KB, of 250, and every page is within budget. Of this patch's share, the VPN server is 10.6 KB, example.net's second web plate 5.8 KB and the café 1.7 KB.

### 5.9 On top of D15a

Appendix A is the diff from D15a's applied patch to this one: `job16/batch` at `86d0bf6`, plus D15a's Appendix A at `c159f0b`, with nothing else. To build it, I applied D15a's patch, then this patch's first version, and resolved the collisions by hand:

| File | D15a's side | This patch's side | Merged |
|---|---|---|---|
| `net-map-layers.ts` slot type | `'E' \| 'SE' \| 'N' \| 'NE' \| 'NW'` | adds `'NE'` | D15a's line, which has NE already; the doc comment names NE |
| `ServerPlate` union | `proxy` and `site` members | `vpn` member | all three, with VPN's last |
| `NET_MAP_OPTIONAL` | `['phone', 'proxy', 'reverse']` | adds `'cafe'` | `['phone', 'proxy', 'reverse', 'cafe']`, then `NET_MAP_INSTEAD` |
| `plateSites` | `site` returns `[site, front]` | `vpn` returns `[site, out]` | both cases |
| layers | `proxies:site`, `proxies:proxy` | `vpn:vpn`, `vpn:web` | D15a's two, then this patch's two, in the track's order |
| `SLOT` | adds NW and keeps NE at `-30, -200` | moves NE to `-50, -182` | NW from D15a and NE from this patch, each with its own comment |
| driver `parseConn` | `<from>>[<via>>]<to>[ data]` | `[ data\| tunnel]` | `<from>>[<via>>]<to>[ data\| tunnel]`; a line keeps D15a's `from`, `to` and `via`, and gains `tunnel` |
| driver `hide` | `NET_MAP_HIDEABLE` | the `NET_MAP_INSTEAD` refusal | D15a's check alone. `home` is not in `NET_MAP_HIDEABLE`, so `hide home` still throws. |
| driver cues | `fresh` | `listener` | both, `listener` before `fresh` |
| driver `paint` description | `NET_MAP_PART_SENTENCES` | home to café swap | the café swap after the phone's, then D15a's part sentences |
| `parts.ts` | `hide: NET_MAP_HIDEABLE`, `fresh` | `listener` cue and args | both |
| `spots.ts`, `figures.ts` | `proxies` | `vpn` | both, with VPN's last |

Two of D15a's tools would not make this scene simpler, so I left both alone:
- `fresh` clears the page, and the orchestrator ruled that step 1's page stays until a later page replaces it.
- `step.start` has nothing to set for VPN: every cue lands on the event where it becomes true (§2.6).

The three part files and the map's VPN groups are byte for byte the same as before the rebase. The spot changed only in its label (§6).

**Tests on D15a.** D15a's Appendix A has no test changes; the Proxies builder writes them. With D15a's patch alone, 13 unit tests fail. With this patch on top, 9 fail, and each is one of D15a's 13:
- the layer-key rule for `proxies:site`;
- the `hide` messages;
- the mockup hash, which needs D15a's groups cut;
- the drawn-once layer check;
- three `[data-hidden]` counts that see D15a's parts;
- the figures hash, which lacks `spot:proxies`.

This patch adds no failure. Where an expectation names this patch's items, it is written with the merged value: the layer list, `FIGURE_PARTS`, `NET_MAP_OPTIONAL`, the `show` message and the conn message. The VPN builder takes the union of these with the Proxies builder's versions. `withoutVpn` cuts groups that do not nest with D15a's, so it runs before or after D15a's own cut.

## 6. The card art

`spot('vpn')`, 528 × 372 with `viewBox="36 44 528 372"`, on the spot family's plate, with one lit part. It has no padlock (Ruling 12).

- **The café:** a small plate at front left `{ x: -108, y: -2, w: 68, d: 62 }`, 2.4 high, with a laptop on it and a cup on a saucer beside it.
- **The VPN server:** a plate at the back `{ x: -2, y: -70, w: 52, d: 46 }`, with a rack `{ x: 8, y: -64, w: 30, d: 26 }` 44 tall and four bays. One light, the top one, is on.
- **The tunnel, the lit part:** a sealed duct 9 wide and 8 high, with one corner. It runs from the café plate's edge to the server plate's front and stops there.
- **Beyond it:** an open cable, 1.3 thick, from the server plate's right side round one corner to a site's page, which stands on a foot at `{ x: 71, y: 24, w: 30 }` 40 tall, its lines plain to read.
- **Plate label:** SEALED TO THE VPN SERVER.
- **aria-label:** "A laptop on a small café plate, a cup beside it. From the café, a lit, sealed duct runs to a VPN server standing on a plate of its own. From the server, a plain open cable runs on to a site’s page."

On the track's route the card reads "VPN", "A sealed tunnel, as far as the VPN server", Start, and Not checked yet. The prototype's Card art page shows the spot beside NAT's and Load Balancers' at one size, then the route with stop 20 ready.

## 7. Copy

Every word that states a fact, with the Learn part it traces to in the outline (§2, the step's narrative N, deep D or facts F). **New** marks words the outline does not have, which the author confirms or replaces.

| Words | Where | Traces to |
|---|---|---|
| CAFÉ WI-FI · 192.168.1.0/24 | café plate engraving | step 1 N (a café, its Wi-Fi). The /24 is home's, kept. **New** as an engraving. |
| Someone listening / 192.168.1.66 | listener callout | step 1 N ("someone listening on the café’s network"). Ruling 1 allows 192.168.1.66. "Someone listening" is **new** as a label. |
| VPN server / 203.0.113.40 | callout | step 2 N, Ruling 3 |
| VPN SERVER | plate engraving | step 2 N |
| Web server / 203.0.113.80 | callout | step 1 N (example.net). No port (Ruling 4). |
| EXAMPLE.NET | plate engraving | step 1 N |
| Behind the internet, the VPN server, where the tunnel from your laptop ends. | figure description | hook ("the tunnel ends there") |
| a café: your laptop, the café’s router, and someone else on its Wi-Fi, listening. | figure description | step 1 N. **New** sentence. |
| Sealed from your laptop to the VPN server | stage title | `lead-1`, `why-1`; the analyst's ruling W1 (the laptop seals, not the café) |
| Who can read your request; On the café’s Wi-Fi; The VPN server; After the VPN server; Who; Sees it going to; Can read it?; readable | table | Ruling 2 (`who-reads`), steps 1, 3, 4 and 5 F |
| Yes: the request and the page | table | step 1 F |
| 203.0.113.40, the VPN server; No: sealed | table | step 3 F |
| Yes, once it unwraps it; Yes: plain HTTP again | table | step 4 F |
| No: sealed by HTTPS | table | step 5 F |
| Readable on the café’s Wi-Fi | status | step 1 F. **New** wording. |
| Setting up the tunnel | status | step 2 N. **New.** |
| Tunnel ready | status | step 2 N. **New.** |
| Sealed in the tunnel | status | step 3 N. **New** wording. |
| Plain again past the VPN server | status | step 4 N. **New** wording. |
| Sealed all the way to the site | status | step 5 N. **New** wording. |
| The 14 log infos, 14 plain lines and 6 table summaries (§3) | log | the step each sits in, N and F. The plain lines and summaries are **new**, written from them. |
| SEALED TO THE VPN SERVER | spot label | `lead-2`, `fact-ends`; the analyst's ruling W2 |
| the spot's aria-label (§6) | spot | Ruling 12. **New** words. |
| A sealed tunnel, as far as the VPN server | card subtitle | the outline's own subtitle (`lead-1`, `lead-2`, `fact-ends`); the analyst's ruling W3 |
| Request; Reply | legend | (kinds, not facts) |

No fact-stating word lacks a Learn part. "Anonymous" appears nowhere (Ruling 5). IPsec is "a standard way" in the facts (Ruling 6).

## 8. Acceptance checks

Each is a test a builder can write, and the prototype shows each.

1. `spot('vpn') + '\n'` equals `prototypes/d15-vpn-spot.svg`. It has exactly one `data-lit`, exactly one `lm-led on`, no `lock`, the label SEALED TO THE VPN SERVER, the aria-label of §6, and `viewBox="36 44 528 372"`.
2. `prototypes/d15-vpn-part-server.svg`, `-part-web.svg` and `-part-cafe.svg` are the map's header, then exactly the whole groups `drawNetMap()` emits for `vpn:vpn` (5), `vpn:web` (5) and `data-base="cafe"` (3), in order, then `</svg>` and a newline.
3. **Byte for byte.** Take `drawNetMap().svg`, cut the three new parts' groups whole, open each `<g data-base="home">`, then cut D11's and D12's parts as today and unwrap Router's. It hashes to today's `EXPECTED.svg`. The data, with every route from or to `vpn` and `vpn-out` left out, hashes to today's `EXPECTED.data`.
4. **Durations unchanged.** For every existing net-map lesson, every event's `duration` equals today's (`net-map.durations.test.ts`, untouched).
5. The frame stays `viewBox="-98 -60 685 378"`. Ids are unique, and `nm-vpn-busy-vpn`, `nm-vpn-busy-vpn-out` and `nm-listener` appear once each.
6. Every existing lesson's map shows the café's groups hidden and home's groups shown. Its description is unchanged.
7. VPN, any step: the café's groups are shown and home's hidden. The description contains "a café: your laptop, the café’s router, and someone else on its Wi-Fi, listening." and "the VPN server, where the tunnel from your laptop ends." The laptop's callout reads 192.168.1.100.
8. example.net's plate and callout contain neither ":80" nor ":443" nor "port".
9. `?at=1.1`: `#nm-listener[data-hear="reads"]`, with `.nm-hear-body` at opacity 1. Status "Readable on the café’s Wi-Fi".
10. `?at=1.2`: the café row reads example.net · Yes: the request and the page, with the mark **readable**.
11. `?at=2.1`: one `.nm-conn.tunnel`, not `.sealed`, on the route `laptop>vpn`. Status "Setting up the tunnel".
12. `?at=2.4`: the band is `.nm-conn.tunnel.sealed`. Status "Tunnel ready".
13. `?at=3.1`: `data-hear="outside"`, `.nm-hear-head` at opacity 1, `.nm-hear-body` at 0. Status "Sealed in the tunnel".
14. **The tunnel ends at the VPN server.** In every state of steps 2 to 5, the only `.nm-conn` is `laptop>vpn tunnel`. Its last point is the `vpn` site's end on the pad, and no `.nm-conn` lies on the route `vpn-out>web` or `web>vpn-out`.
15. **Nothing past the server looks sealed in steps 1 to 4.** During a ride on `vpn-out>web` or `web>vpn-out` (`?ride=4.2&k=0.5`, `?ride=4.4&k=0.5`), the trail is the plain narrow trail and no `.sealed` element is on that leg. The `vpn-out` rides' tags read `GET /` and `PAGE`.
16. **The padlock.** `#nm-hold-lock` (or the lock's hold) is off in every state before 5.6 and on at 5.6 and after.
17. Step 5's `vpn-out` rides' tags read `HTTPS`. The server and after rows read "No: sealed by HTTPS", with no mark.
18. Seek: opening each step from the outline shows the same listener state, band, page, padlock, statuses and table as playing to it.
19. `duration` at 1×: laptop↔vpn 2,090 ± 1, vpn-out↔web 1,926 ± 1, laptop↔web 2,015 ± 1, and each table update 0. At 2× each halves. Under reduced motion the listener does not fade.
20. The log has 14 rows by the end, with the infos of §3 in order. Proto is HTTP, HTTP, IKE ×4, ESP, HTTP, HTTP, ESP, ESP, HTTPS, HTTPS, ESP. Time and Size are "—".
21. VPN has no Network / Sequence switch, and the top bar has no OSI chip.
22. The validator refuses each of these with its own message:
    - `show cafe` with `show phone`;
    - `listener reads` without `show cafe`;
    - `listener sees`;
    - `park laptop 1 X` with `show cafe`;
    - `conn open laptop>vpn data tunnel`.
    The driver throws for `hide home` and for `listener sees`.
23. At 375 and 1440, light and dark, there is no sideways scroll. The listener's lit lines and the band have contrast with the plate (a pixel check against the plate's fill).
24. The VPN card on `/networking` shows the spot, "VPN" and "A sealed tunnel, as far as the VPN server".

## 9. Open questions for the owner

None open. The orchestrator answered the five this spec first asked, and the analyst read its words (`.superpowers/analysis/vpn/report.md`, "Prototype words (L29-w)": 71 of 74 sound, 3 changed by rulings W1 to W3, applied here):
1. No page-clearing cue: step 1's page stays on the laptop until a later page replaces it.
2. The new words stand as the analyst read them.
3. example.net stays a second plate (`vpn:web`).
4. The +18 KB of HTML on every net-map page is accepted for this batch. Drawing only a lesson's own layers is a later unit.
5. Moving NE is fine.

## Appendix A. The patch

Applies with `git apply` on top of D15a's Appendix A (D15a commit `c159f0b`), applied to `job16/batch` at `86d0bf6`. `npm run build` passes with every page within budget. For the unit tests, see §5.9.

```diff
diff --git a/src/art/figures/figures.test.ts b/src/art/figures/figures.test.ts
index 4225444..13924e5 100644
--- a/src/art/figures/figures.test.ts
+++ b/src/art/figures/figures.test.ts
@@ -84,6 +84,8 @@ const EXPECTED: Record<string, string> = {
   'spot:tcp-udp': '486e78bbae5a044469392f3e4f94cf0ef43d5b1ed566c73aade52acb9cfe9e0c',
   // Drawn for Packets (D13), on 2026-11-15; pinned from its own render, which equals prototypes/d13-packets-spot.svg (the last test).
   'spot:packets': 'd0d8b1e5aa32f37d8bee06e74fbd88fc29734b47844849d9fbd7b48d3d9bb4b4',
+  // Drawn for VPN (D15b), on 2026-11-16; pinned from its own render, which equals prototypes/d15-vpn-spot.svg (the last test).
+  'spot:vpn': '8901f972b9d06da75e129784bab04d3eecd3e3e8c68bebad166bafb1084ed8bc',
   'internet-thumb': '4fe3a6139382805d18be7e4692e5e3609ea7c477463311dd7078d071d616e04f',
 };
 
@@ -189,3 +191,18 @@ test('the switch spot is prototypes/d13-switch-spot.svg, with one lit part, one
   );
   expect(svg).toMatch(/viewBox="36 44 528 372"/);
 });
+
+// D15b: the VPN spot is the approved file, byte for byte: one lit part (the tunnel), one light on (the server's), no padlock.
+test('the vpn spot is prototypes/d15-vpn-spot.svg, with one lit part, one light on, its plate label and its words', () => {
+  const file: string = readFileSync('prototypes/d15-vpn-spot.svg', 'utf8');
+  expect(`${spot('vpn')}\n`).toBe(file);
+  const svg = spot('vpn');
+  expect((svg.match(/data-lit/g) ?? []).length).toBe(1);
+  expect((svg.match(/class="lm-led on"/g) ?? []).length).toBe(1);
+  expect(svg).toContain('SEALED TO THE VPN SERVER');
+  expect(svg).not.toMatch(/lock/i);
+  expect(svg).toContain(
+    'aria-label="A laptop on a small café plate, a cup beside it. From the café, a lit, sealed duct runs to a VPN server standing on a plate of its own. From the server, a plain open cable runs on to a site’s page."',
+  );
+  expect(svg).toMatch(/viewBox="36 44 528 372"/);
+});
diff --git a/src/art/figures/spots.ts b/src/art/figures/spots.ts
index e57efac..1fea58a 100644
--- a/src/art/figures/spots.ts
+++ b/src/art/figures/spots.ts
@@ -462,10 +462,46 @@ function loadBalancersSpot() {
   return figure("load-balancers", "ONE ADDRESS · THREE SERVERS", out.join(""), "A load balancer at the front with one cable coming in, and behind it a pool of three servers, A, B and C, each cabled to it. Server B’s two lamps are red. A lit request rides the cable to server C.");
 }
 
-export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets', 'switch', 'load-balancers', 'proxies'] as const;
+// VPN: a laptop on a small café plate, a sealed duct from it to a VPN server on a plate of its own, and an open cable
+// on from the server to a site's page. The duct is the lit part; nothing past the server is sealed, and there is no padlock.
+function vpnSpot() {
+  const out = [], CZ = 2.4, SZ = 2.4;
+  // The café: a small plate, the laptop on it, a cup on its saucer beside it.
+  const CP = { x: -108, y: -2, w: 68, d: 62, r: 4 };
+  out.push(S(k.slabOf(CP, 0, CZ, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam(CP, 1, P, 4), { tone: "faint" }) }));
+  const LB = { x: -102, y: 6, w: 42, d: 28, r: 3.5 }, LZ = CZ + 3.2, LH = 26;
+  out.push(S(k.slabOf(LB, CZ, 3.2, P, 5, 0.8), { tone: "hi" }));
+  let keys = "";
+  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) keys += k.planOutline({ x: LB.x + 5 + c * 4.6, y: LB.y + 6 + r * 4.6, w: 3.6, d: 3.6, r: 0.6 }, LZ, P, 3);
+  out.push(L(keys, { tone: "lo" }));
+  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.4, r: 1 };
+  out.push(S(k.slabOf(LID, LZ, LH, P, 3, 0.5), { tone: "hi" }));
+  out.push(onFaceY(LID.y + LID.d, rect("lm-void", LID.x + 3, LZ + 3, LID.w - 6, LH - 6, 0.8) + rect("lm-slot", LID.x + 6, LZ + LH - 9, 18, 1.4, 0.7) + rect("lm-slot", LID.x + 6, LZ + LH - 12.4, 24, 1.4, 0.7)));
+  out.push(S(k.cylinder(-50, 46, 6.4, CZ, 1, P, 32), { tone: "mid" }), S(k.cylinder(-50, 46, 3.8, CZ + 1, 6.4, P, 32), { tone: "hi" }));
+  out.push(L(k.onTop(k.circleRing(-50, 46, 3, 24), CZ + 7.4, P, true), { tone: "lo" }));
+  // The VPN server, on its plate at the back: one tall box, its drive bays, one light on.
+  const SP = { x: -2, y: -70, w: 52, d: 46, r: 4 }, R = { x: 8, y: -64, w: 30, d: 26, r: 2 }, RH = 44, RF = R.y + R.d;
+  out.push(S(k.slabOf(SP, 0, SZ, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam(SP, 1, P, 4), { tone: "faint" }) }));
+  out.push(S(k.slabOf(R, SZ, RH, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(R, SZ + RH - 4, P, 3), { tone: "faint" }) }));
+  out.push(onFaceY(RF, [0, 1, 2, 3].map((i) => rect("lm-slot", R.x + 3.4, SZ + RH - 12 - i * 8, R.w - 12, 4, 0.6) + `<circle class="lm-led${i === 0 ? " on" : ""}" cx="${n1(R.x + R.w - 4.6)}" cy="${n1(-(SZ + RH - 10 - i * 8))}" r="1.1"/>`).join("")));
+  out.push(lines([0, 1, 2].map((i) => [[R.x + 5, R.y + 6 + i * 6], [R.x + R.w - 5, R.y + 6 + i * 6]]), SZ + RH));
+  // On from the server: an open cable to the right, and the site's page standing at its end, its lines plain to read.
+  out.push(tubeOf(tubePieces([[50, -38, 1.4], [86, -38, 1.4], [86, 22, 1.4]], 1.3, P, { maxLength: 14 })));
+  const PG = { x: 71, y: 24, w: 30, d: 3, r: 0.8 }, PZ = 2, PH = 40;
+  out.push(S(k.slabOf({ x: PG.x - 2, y: PG.y - 3, w: PG.w + 4, d: PG.d + 6, r: 1.4 }, 0, PZ, P, 3, 0.4), { tone: "mid" }));
+  out.push(S(k.slabOf(PG, PZ, PH, P, 3, 0.4), { tone: "hi" }));
+  out.push(onFaceY(PG.y + PG.d, rect("lm-inlay", PG.x + 3, PZ + PH - 8, PG.w - 6, 5, 1) + [0, 1, 2, 3, 4].map((i) => rect("lm-slot", PG.x + 3, PZ + PH - 14 - i * 5, PG.w - 6 - (i % 2) * 7, 1.6, 0.6)).join("")));
+  // The sealed duct, from the café plate's edge to the server plate's front, round one corner: the lit part.
+  const DW = 9, DH = 8, y0 = 22, xc = 14;
+  const duct = [[-40, y0 - DW / 2], [xc + DW / 2, y0 - DW / 2], [xc + DW / 2, -24], [xc - DW / 2, -24], [xc - DW / 2, y0 + DW / 2], [-40, y0 + DW / 2]].reverse();
+  out.push(S(k.extrude(duct, 0, DH, P, { convex: false, bevel: 0.6 }), { tone: "hi", lit: true }));
+  return figure("vpn", "SEALED TO THE VPN SERVER", out.join(""), "A laptop on a small café plate, a cup beside it. From the café, a lit, sealed duct runs to a VPN server standing on a plate of its own. From the server, a plain open cable runs on to a site’s page.");
+}
+
+export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets', 'switch', 'load-balancers', 'proxies', 'vpn'] as const;
 export type SpotKind = (typeof SPOTS)[number];
 
-const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot, packets: packetsSpot, switch: switchSpot, 'load-balancers': loadBalancersSpot, proxies: proxiesSpot };
+const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot, packets: packetsSpot, switch: switchSpot, 'load-balancers': loadBalancersSpot, proxies: proxiesSpot, vpn: vpnSpot };
 
 /** A small figure, cropped close to its plate. */
 export const spot = (kind: SpotKind): string => DRAW[kind]();
diff --git a/src/art/scenes/net-map-layers.test.ts b/src/art/scenes/net-map-layers.test.ts
index 8ecbee0..57b0c99 100644
--- a/src/art/scenes/net-map-layers.test.ts
+++ b/src/art/scenes/net-map-layers.test.ts
@@ -2,7 +2,7 @@ import { expect, test } from 'vitest';
 import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAYERS, NET_MAP_OPTIONAL, plateSites } from './net-map-layers';
 import { FIGURE_PARTS } from './parts';
 
-const SITES = ['web', 'call', 'root', 'tld', 'auth', 'out', 'in', 'mail', 'files', 'host', 'server', 'stranger', 'voice'];
+const SITES = ['web', 'call', 'root', 'tld', 'auth', 'out', 'in', 'mail', 'files', 'host', 'server', 'stranger', 'voice', 'origin', 'reverse', 'proxy', 'vpn', 'vpn-out'];
 
 test('the layers are every protocol’s servers, keyed <protocol>:<site>, in the lesson’s order', () => {
   expect(Object.keys(NET_MAP_LAYERS)).toEqual([
@@ -23,11 +23,15 @@ test('the layers are every protocol’s servers, keyed <protocol>:<site>, in the
     'ports:server',
     'nat:stranger',
     'tcp-udp:voice',
+    'proxies:site',
+    'proxies:proxy',
+    'vpn:vpn',
+    'vpn:web',
   ]);
   for (const [key, plate] of Object.entries(NET_MAP_LAYERS)) {
     // The name servers have no one site: the plate is keyed by its kind.
     expect(key.split(':')[1], key).toBe(plate.kind === 'names' ? 'names' : plate.site);
-    expect(['E', 'SE', 'N'], key).toContain(plate.slot);
+    expect(['E', 'SE', 'N', 'NE'], key).toContain(plate.slot);
     expect(plate.lines[0]?.cls, key).toBe('nm-name');
   }
 });
@@ -86,11 +90,13 @@ test('FIGURE_PARTS["net-map"] lists home, the internet, the resolver and every s
       drop: 'text',
       hide: 'text',
       show: 'text',
+      listener: 'text',
       park: 'text',
       unpark: 'text',
+      fresh: 'flag',
     },
     // Router's: a packet dropped at one of the internet's routers, and the resolver left off the map; D11's: the phone shown.
-    args: { drop: ['isp', 'a', 'b', 'c', 'd'], hide: ['resolver'], show: ['phone'] },
+    args: { drop: ['isp', 'a', 'b', 'c', 'd'], hide: ['resolver', 'proxy', 'direct'], show: ['phone', 'proxy', 'reverse', 'cafe'], listener: ['reads', 'outside'] },
     layers: Object.keys(NET_MAP_LAYERS),
     board: false,
     start: true,
@@ -137,7 +143,7 @@ test('D11’s two layers: Ports’ server on slot E with no port in its callout,
       { cls: 'nm-addr', text: '192.0.2.66' },
     ],
   });
-  expect(NET_MAP_OPTIONAL).toEqual(['phone']);
-  // Only the stranger and D12's voice server describe themselves.
-  expect(Object.entries(NET_MAP_LAYERS).filter(([, p]) => p.describe !== undefined).map(([k]) => k)).toEqual(['nat:stranger', 'tcp-udp:voice']);
+  expect(NET_MAP_OPTIONAL).toEqual(['phone', 'proxy', 'reverse', 'cafe']);
+  // Only the stranger, D12's voice server and D15b's VPN server describe themselves.
+  expect(Object.entries(NET_MAP_LAYERS).filter(([, p]) => p.describe !== undefined).map(([k]) => k)).toEqual(['nat:stranger', 'tcp-udp:voice', 'vpn:vpn']);
 });
diff --git a/src/art/scenes/net-map-layers.ts b/src/art/scenes/net-map-layers.ts
index 19fb6de..0b70959 100644
--- a/src/art/scenes/net-map-layers.ts
+++ b/src/art/scenes/net-map-layers.ts
@@ -11,7 +11,7 @@ export interface CalloutLine {
 }
 
 interface PlateBase {
-  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it, N for a small one behind the internet, NW for one where the resolver stands (a map that shows it hides the resolver). */
+  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it, N for a small one behind the internet, NE for a small one behind it on the right, NW for one where the resolver stands (a map that shows it hides the resolver). */
   slot: 'E' | 'SE' | 'N' | 'NE' | 'NW';
   /** A part of the map the plate is drawn in, hidden until a `show` cue shows it (`NET_MAP_OPTIONAL`). */
   part?: string;
@@ -61,6 +61,15 @@ export type ServerPlate =
       front: string;
       /** The callouts while the reverse proxy is shown: its own, and the web server's behind it. */
       behind: CalloutLine[][];
+    })
+  | (PlateBase & {
+      kind: 'vpn';
+      /** Where the tunnel ends, on the pad: its cable runs to `puck`. */
+      site: string;
+      puck: 'a';
+      /** The same pad, for what the server sends on out of the tunnel: its own cable runs to `outPuck`. */
+      out: string;
+      outPuck: 'c';
     });
 
 /** The root servers, the servers for .app, and the site's own name server, as the names plate draws them. */
@@ -76,7 +85,10 @@ export const NET_MAP_LAPTOP_ADDR = '192.168.1.100';
 export const NET_MAP_BASE_PLACES = ['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd', 'phone'];
 
 /** The parts the map leaves off until a start shows them (`show phone`; Proxies' `show proxy` and `show reverse`). */
-export const NET_MAP_OPTIONAL = ['phone', 'proxy', 'reverse'];
+export const NET_MAP_OPTIONAL = ['phone', 'proxy', 'reverse', 'cafe'];
+
+/** An optional part that, shown, takes the place of a part every map draws: the café's words and its listener take home's words and the laptop's cable. */
+export const NET_MAP_INSTEAD: Record<string, string> = { cafe: 'home' };
 
 /** The parts a start may leave off the map (`hide`): the resolver, a shown forward proxy, and the web server's own callout. */
 export const NET_MAP_HIDEABLE = ['resolver', 'proxy', 'direct'];
@@ -90,6 +102,9 @@ export const NET_MAP_PART_SENTENCES: Record<string, string> = {
 /** The phone's address as the map draws it. */
 export const NET_MAP_PHONE_ADDR = '192.168.1.101';
 
+/** The address of someone listening on the café's Wi-Fi (`show cafe`), as the map draws it: on the laptop's network. */
+export const NET_MAP_LISTENER_ADDR = '192.168.1.66';
+
 /** The internet's five routers, which a unit's labels may name on a strip and a `drop` cue may mark. */
 export const NET_MAP_ROUTERS = ['isp', 'a', 'b', 'c', 'd'];
 
@@ -101,7 +116,7 @@ export const NET_MAP_BAY_COUNTS: Record<string, number> = { laptop: 4, web: 4, i
 
 /** The places a message can stop on a plate. */
 export function plateSites(plate: ServerPlate): string[] {
-  return plate.kind === 'names' ? NAME_SERVER_SITES : plate.kind === 'site' ? [plate.site, plate.front] : [plate.site];
+  return plate.kind === 'names' ? NAME_SERVER_SITES : plate.kind === 'site' ? [plate.site, plate.front] : plate.kind === 'vpn' ? [plate.site, plate.out] : [plate.site];
 }
 
 const line = (cls: CalloutLine['cls'], text: string): CalloutLine => ({ cls, text });
@@ -218,4 +233,20 @@ export const NET_MAP_LAYERS: Record<string, ServerPlate> = {
     at: [300, 0],
     lines: [line('nm-name', 'Forward proxy'), line('nm-addr', '203.0.113.30')],
   },
+  // VPN: the VPN server behind the internet on the right, and example.net with no port (it is reached at 80, then 443).
+  // The server comes first: the layers are drawn in this order, and its plate stands behind the web server's.
+  'vpn:vpn': {
+    kind: 'vpn',
+    slot: 'NE',
+    site: 'vpn',
+    puck: 'a',
+    out: 'vpn-out',
+    outPuck: 'c',
+    label: 'VPN SERVER',
+    describe: 'Behind the internet, the VPN server, where the tunnel from your laptop ends.',
+    at: [330, -14],
+    align: 'end',
+    lines: [line('nm-name', 'VPN server'), line('nm-addr', '203.0.113.40')],
+  },
+  'vpn:web': web('EXAMPLE.NET', '203.0.113.80'),
 };
diff --git a/src/art/scenes/net-map.css b/src/art/scenes/net-map.css
index 7b7019e..6928c49 100644
--- a/src/art/scenes/net-map.css
+++ b/src/art/scenes/net-map.css
@@ -50,6 +50,14 @@
 .nm .nm-conn { fill: none; stroke: var(--lit-b); stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; opacity: .5; }
 .nm .nm-conn.sealed { stroke: var(--lit-a); opacity: .8; stroke-width: 3.5px; filter: drop-shadow(0 0 2px var(--lit-b)); }
 .nm .nm-conn.alt { stroke: var(--lit-a); stroke-width: 2px; stroke-dasharray: 5 4; opacity: .85; }
+/* VPN's tunnel (conn … tunnel): a band round the cables, drawn to the map's scale, that glows once sealed. */
+.nm .nm-conn.tunnel { stroke: var(--lit-b); stroke-width: 7px; opacity: .2; vector-effect: none; }
+.nm .nm-conn.tunnel.sealed { stroke: var(--lit-a); opacity: .42; filter: none; }
+/* The café's listener (show cafe): its screen glows once it has overheard your request; every line lit while it can
+   read it, the top line alone (where it goes) once it is sealed. */
+.nm .nm-hear-head, .nm .nm-hear-body { opacity: 0; transition: opacity 200ms ease; }
+.nm #nm-listener[data-hear] .nm-glow { opacity: .42; }
+.nm #nm-listener[data-hear] .nm-hear-head, .nm #nm-listener[data-hear="reads"] .nm-hear-body { opacity: 1; }
 /* A router's name on a strip of label tape (a unit's labels isp, a, b, c and d), over the cables and pucks. */
 .nm .nm-strip rect { fill: var(--fig-bg); stroke: var(--line-strong); stroke-width: 1px; vector-effect: non-scaling-stroke; }
 .nm .nm-strip text { font: 700 12px / 1 var(--mono); fill: var(--ink-strong); }
@@ -60,7 +68,7 @@
 .nm [data-base][data-hidden] { display: none; }
 /* Reduced motion keeps every light, and only drops the fades. */
 @media (prefers-reduced-motion: reduce) {
-  .nm .nm-glow, .nm .nm-busy, .nm .nm-hold, .nm [data-part], .nm .lm-led { transition: none; }
+  .nm .nm-glow, .nm .nm-busy, .nm .nm-hold, .nm [data-part], .nm .lm-led, .nm .nm-hear-head, .nm .nm-hear-body { transition: none; }
 }
 /* While the driver's show settles the figure, every part changes at once, not over its fade (src/scenes/drivers/net-map.ts). */
 .nm[data-settling] * { transition: none !important; }
diff --git a/src/art/scenes/net-map.test.ts b/src/art/scenes/net-map.test.ts
index 0c74ed3..8693944 100644
--- a/src/art/scenes/net-map.test.ts
+++ b/src/art/scenes/net-map.test.ts
@@ -3,7 +3,7 @@
 import { readFileSync } from 'node:fs';
 import { expect, test } from 'vitest';
 import { normaliseFigure, sha256 } from '../../test/figure-hash';
-import { groupsOf, PHONE_OPEN, SERVER_OPEN, STRANGER_OPEN, VOICE_OPEN, withoutD11 } from '../../test/svg-groups';
+import { CAFE_OPEN, groupsOf, PHONE_OPEN, SERVER_OPEN, STRANGER_OPEN, VOICE_OPEN, VPN_SERVER_OPEN, VPN_WEB_OPEN, withoutD11, withoutVpn } from '../../test/svg-groups';
 import { drawFigure } from './index';
 import { drawNetMap, type NetMapData } from './net-map';
 import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, NET_MAP_TAG_MAX, plateSites } from './net-map-layers';
@@ -62,8 +62,8 @@ function withoutRouterParts(svg: string): string {
 }
 
 const D11_SITES = ['phone', 'server', 'stranger'];
-/** D12's voice plate, as D11's three places are. */
-const D12_SITES = ['voice'];
+/** D12's voice plate, as D11's three places are; and D15b's VPN server, both its sites. */
+const D12_SITES = ['voice', 'vpn', 'vpn-out'];
 /** The data without a route from or to D11's or D12's places. */
 const withoutD11Routes = (routes: NetMapData['routes']): NetMapData['routes'] =>
   Object.fromEntries(Object.entries(routes).filter(([key]) => !key.split('>').some((p) => [...D11_SITES, ...D12_SITES].includes(p))));
@@ -72,7 +72,8 @@ test('drawNetMap matches the mockup map', async () => {
   const { svg, data } = drawNetMap();
   expect(svg.split(TRAIL_EDGE)).toHaveLength(2);
   // D11's groups come out whole first: unwrapping the phone first would leave its parts in the hash.
-  expect(await sha256(normaliseFigure(withoutRouterParts(groupsOf(withoutD11(svg), VOICE_OPEN).rest)))).toBe(EXPECTED.svg);
+  // D15b's come out the same way, and home's wrappers open, before Router's are unwrapped.
+  expect(await sha256(normaliseFigure(withoutRouterParts(groupsOf(withoutD11(withoutVpn(svg)), VOICE_OPEN).rest)))).toBe(EXPECTED.svg);
   const { tops, routes, bays, ...mockup } = data as NetMapData;
   expect(Object.keys(tops)).toEqual(['isp', 'a', 'b', 'c', 'd']);
   expect(await sha256(JSON.stringify({ ...mockup, routes: withoutD11Routes(routes) }))).toBe(EXPECTED.data);
@@ -275,3 +276,35 @@ test('asked for some layers only, the map holds just those, shown, in the same f
   // And much smaller: the other thirteen layers are not there.
   expect(part.svg.length).toBeLessThan(whole.svg.length / 2);
 });
+
+// D15b, VPN: the files are the art, and the code emits them; the café takes home's place; the server has two sites.
+test.each([
+  ['server', VPN_SERVER_OPEN, 5],
+  ['web', VPN_WEB_OPEN, 5],
+  ['cafe', CAFE_OPEN, 3],
+] as const)('prototypes/d15-vpn-part-%s.svg is exactly the whole groups the map draws for it, in order', (name, open, count) => {
+  const { groups } = groupsOf(drawNetMap().svg, open);
+  expect(groups).toHaveLength(count);
+  const file: string = readFileSync(`prototypes/d15-vpn-part-${name}.svg`, 'utf8');
+  expect(file.startsWith(HEADER)).toBe(true);
+  expect(file.endsWith('</svg>\n')).toBe(true);
+  expect(file.slice(HEADER.length, -'</svg>\n'.length)).toBe(groups.join(''));
+});
+
+test('the VPN server: one light for each of its two sites, a way between every base place and each, and the café drawn hidden', () => {
+  const { svg, data } = drawNetMap();
+  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
+  expect(new Set(ids).size).toBe(ids.length);
+  for (const id of ['nm-vpn-busy-vpn', 'nm-vpn-busy-vpn-out', 'nm-listener']) expect(ids.filter((x) => x === id), id).toHaveLength(1);
+  const { routes } = data as NetMapData;
+  for (const site of ['vpn', 'vpn-out']) for (const place of NET_MAP_BASE_PLACES) expect(routes[`${place}>${site}`], `${place}>${site}`).toBeDefined();
+  // The tunnel's cable and the plain leg's are not the same: one leaves for router a, the other for router c.
+  expect(routes['laptop>vpn']!.at(-2)).not.toEqual(routes['web>vpn-out']!.at(-2));
+  expect(routes['vpn-out>web']).toBeDefined();
+  const cafe = groupsOf(svg, CAFE_OPEN).groups.join('');
+  expect(cafe).toContain('CAFÉ WI-FI · 192.168.1.0/24');
+  expect(cafe).toContain('192.168.1.66');
+  // The laptop keeps its address; example.net's plate shows no port.
+  expect(svg).toContain('192.168.1.100');
+  expect(groupsOf(svg, VPN_WEB_OPEN).groups.join('')).not.toMatch(/:(80|443)\b/);
+});
diff --git a/src/art/scenes/net-map.ts b/src/art/scenes/net-map.ts
index e5addf0..06df707 100644
--- a/src/art/scenes/net-map.ts
+++ b/src/art/scenes/net-map.ts
@@ -8,7 +8,7 @@
 // the parts. Its ids carry an `nm-` prefix, so they stay unique on the page.
 import type { DrawnFigure } from './types';
 import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
-import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_LINKS, NET_MAP_PHONE_ADDR, NET_MAP_TAG_MAX } from './net-map-layers';
+import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_LINKS, NET_MAP_LISTENER_ADDR, NET_MAP_PHONE_ADDR, NET_MAP_TAG_MAX } from './net-map-layers';
 import './net-map.css';
 
 /** What the driver reads: the figure's camera, where the broadcast ring spreads, and every route along the cables. */
@@ -42,7 +42,8 @@ const HP = { x: -134, y: 57, w: 84, d: 70, r: 8 };
 const RP = { x: -118, y: -114, w: 64, d: 54, r: 7 };
 // Places for the servers on the right: E for one big plate, NE and SE for two smaller ones; N for a small one behind the internet.
 // NW is where the resolver stands, for a plate on a map that hides it (Proxies' forward proxy).
-const SLOT = { E: { x: 50, y: -127, w: 84, d: 70, r: 8 }, NE: { x: -30, y: -200, w: 64, d: 54, r: 7 }, SE: { x: 140, y: -26, w: 64, d: 54, r: 7 }, N: { x: -84, y: -196, w: 56, d: 40, r: 6 }, NW: { x: -118, y: -114, w: 64, d: 54, r: 7 } };
+// NE stands far enough left that E's racks never hide its front: a plate there is shown beside the web server.
+const SLOT = { E: { x: 50, y: -127, w: 84, d: 70, r: 8 }, NE: { x: -50, y: -182, w: 64, d: 54, r: 7 }, SE: { x: 140, y: -26, w: 64, d: 54, r: 7 }, N: { x: -84, y: -196, w: 56, d: 40, r: 6 }, NW: { x: -118, y: -114, w: 64, d: 54, r: 7 } };
 const LB = { x: -127, y: 88, w: 46, d: 30, r: 3.5 }, LZ = 3.2, LID_H = 31;
 const HR = { x: -90, y: 62, w: 32, d: 18, r: 3 }, RZ = 2, RT = RZ + 9;
 const PUCK_R = 7, PUCK_H = 4.6;
@@ -66,7 +67,7 @@ const dot = ([x, y], cls, r = 1.2, extra = "") => `<circle class="${cls}" cx="${
 const rel = (p, o) => ({ ...o, x: p.x + o.x, y: p.y + o.y });
 
 // ---------- Plates ----------
-function plate(p, label) {
+function plate(p, label, words = (t) => t) {
   const under = `<path class="iso-halo" d="${k.haloOf(p, FLOOR, PLATE_H, P)}"/>`;
   const over = [];
   for (const [x, y] of byDepth(k.corners(p, 13))) {
@@ -78,7 +79,8 @@ function plate(p, label) {
   const screws = k.corners(p, 9);
   over.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 18)).join(""), { tone: "lo" }));
   over.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.6, tone: "mid" }));
-  over.push(k.faceTextSvg(k.sideMatrix([p.x + p.w - 12, p.y + p.d], -4.4, P, "left"), label, { size: 3.4, tone: "mid", anchor: "end" }));
+  const engrave = (t) => k.faceTextSvg(k.sideMatrix([p.x + p.w - 12, p.y + p.d], -4.4, P, "left"), t, { size: 3.4, tone: "mid", anchor: "end" });
+  over.push(words(engrave(label), engrave));
   return { under, over: over.join("") };
 }
 
@@ -135,6 +137,27 @@ function phone(id) {
   return out.join("");
 }
 
+// Someone else on the café's Wi-Fi, beside your laptop: a small laptop of its own, a radio stick at its side, and no
+// cable. Its screen shows what it overhears (the driver's `listener` cue): every line lit while it can read your
+// request, the top line alone (the outside) once the request is sealed, and dark before it has heard anything.
+const LS = { x: -73, y: 101, w: 19, d: 13, r: 1 }, LS_Z = 1.8, LS_LID = 14, LS_AT = [LS.x + LS.w + 1.6, LS.y + 1.4];
+function listener(id) {
+  const out = [S(k.slabOf(LS, 0, LS_Z, P, 4, 0.5), { tone: "hi", inner: L(k.sideSeam(LS, 0.8, P, 4), { tone: "faint" }) })];
+  let keys = "";
+  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) keys += k.planOutline({ x: LS.x + 2 + c * 3.1, y: LS.y + 4 + r * 3.1, w: 2.4, d: 2.4, r: 0.4 }, LS_Z, P, 3);
+  out.push(L(keys, { tone: "lo" }));
+  const LID = { x: LS.x + 1, y: LS.y, w: LS.w - 2, d: 1.6, r: 0.6 };
+  out.push(S(k.slabOf(LID, LS_Z, LS_LID, P, 3, 0.4), { tone: "hi" }));
+  const x0 = LID.x + 1.6, w = LID.w - 3.2, z0 = LS_Z + 1.6, h = LS_LID - 3.2;
+  const lines = (cls) => [0, 1, 2].map((i) => rect(cls, x0 + 1.6, z0 + h - 3 - i * 3, w - 3.2 - (i === 2 ? 4 : 0), 1.4, 0.5)).join("");
+  let scr = rect("lm-void", x0, z0, w, h, 0.6) + rect("nm-glow", x0, z0, w, h, 0.6) + lines("lm-slot");
+  const lit = lines("nm-px").split("/>");
+  scr += `<g class="nm-hear-head">${lit[0]}/></g><g class="nm-hear-body">${lit[1]}/>${lit[2]}/></g>`;
+  out.push(onFaceY(LID.y + LID.d, `<g id="${id}-listener">${scr}</g>`));
+  out.push(S(k.cylinder(LS_AT[0], LS_AT[1], 1.3, 0, 1.6, P, 16), { tone: "mid" }), S(k.cylinder(LS_AT[0], LS_AT[1], 0.8, 1.6, 11, P, 16), { tone: "hi", crease: "none" }));
+  return out.join("");
+}
+
 // ---------- The internet: routers that pass messages along ----------
 function puck([x, y], name) {
   const out = [];
@@ -439,6 +462,30 @@ const KINDS = {
       tall: [[racks[1].x, racks[1].y, racks[1].h]],
     };
   },
+  // A VPN server: a rack at the back, and in front of it the pad where the tunnel ends. The tunnel's cable comes in
+  // at the pad's front from router a; what the server sends on goes out by its own cable, from the pad's right-hand
+  // side across the plate to router c. The pad's top is engraved with one packet inside another, and lights while
+  // the server takes a packet out of the tunnel or puts one in.
+  vpn(p, id, o) {
+    const R = rel(p, { x: p.w - 26, y: 6, w: 20, d: 20, r: 2, h: 34 }), PD = rel(p, { x: 7, y: p.d - 24, w: 24, d: 14, r: 2 });
+    const F = [PD.x + 6, PD.y + PD.d + 2], IN = [F[0], p.y + p.d + 3];
+    const FO = [PD.x + PD.w + 2, PD.y + PD.d / 2], OUT = [p.x + p.w + 3, FO[1]];
+    const end = [PD.x + PD.w / 2, PD.y + PD.d / 2, 3];
+    let pad = S(k.slabOf(PD, 0, 2.4, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(PD, 1, P, 3), { tone: "faint" }) });
+    pad += L(k.planOutline({ x: PD.x + 3, y: PD.y + 2.5, w: PD.w - 6, d: PD.d - 5, r: 1 }, 2.4, P, 3) + k.planOutline({ x: PD.x + 7, y: PD.y + 5, w: PD.w - 14, d: PD.d - 10, r: 0.6 }, 2.4, P, 3), { tone: "lo" });
+    const lit = S(k.slabOf(PD, 0, 2.4, P, 3, 0.4), { tone: "hi", lit: true });
+    pad += `<g class="nm-busy" id="${id}-busy-${o.site}">${lit}</g><g class="nm-busy" id="${id}-busy-${o.out}">${lit}</g>`;
+    return {
+      things: [{ xy: [R.x + R.w / 2, R.y + R.d / 2], svg: rack(R, 0) }, { xy: [PD.x + PD.w / 2, PD.y + PD.d / 2], svg: pad }],
+      cables: [[N[o.puck], IN, F], [N[o.outPuck], OUT, FO]],
+      sites: {
+        [o.site]: { end, leg: [[...F, RIDE], [...IN, RIDE]], puck: o.puck },
+        [o.out]: { end, leg: [[...FO, RIDE], [...OUT, RIDE]], puck: o.outPuck },
+      },
+      callouts: [callTo(o, [R.x, R.y + R.d, R.h])],
+      tall: [[R.x, R.y, R.h]],
+    };
+  },
   // Any other server: two racks, and a pad at the front that lights while it works.
   host(p, id, o) {
     const racks = [rel(p, { x: p.w - 58, y: 6, w: 24, d: 26, r: 2, h: 40 }), rel(p, { x: p.w - 30, y: 4, w: 24, d: 30, r: 2, h: 46 })];
@@ -495,15 +542,22 @@ const resolverPart = (svg) => `<g data-base="resolver">${svg}</g>`;
 // The phone is drawn hidden, and shown for a unit that starts with `show phone`.
 const phonePart = (svg) => `<g data-base="phone" data-hidden="">${svg}</g>`;
 const PHONE_CALL = { anchor: [PH.x + PH.w, PH.y + PH.d, PH_Z], at: [70, 196], lines: [{ cls: "nm-name", text: "Your phone" }, { cls: "nm-addr", text: NET_MAP_PHONE_ADDR }] };
+// Home's words and the laptop's cable, which a café map leaves off (`show cafe`): there the laptop is on the Wi-Fi.
+const homePart = (svg) => `<g data-base="home">${svg}</g>`;
+// The café: its words on the plate, the listener beside your laptop, and the listener's callout, drawn hidden.
+const cafePart = (svg) => `<g data-base="cafe" data-hidden="">${svg}</g>`;
+const CAFE_WORDS = "CAFÉ WI-FI · 192.168.1.0/24";
+// Its callout stands below the café plate, at the frame's left, well clear of the internet's words.
+const LISTENER_CALL = { anchor: [LS.x, LS.y + LS.d, LS_Z], at: [-80, 280], lines: [{ cls: "nm-name", text: "Someone listening" }, { cls: "nm-addr", text: NET_MAP_LISTENER_ADDR }] };
 
 // ---------- The parts every protocol shares: home, the internet, the resolver ----------
 function buildBase() {
-  const plates = [plate(RP, "RESOLVER · 192.0.2.53"), plate(HP, "YOUR HOME · 192.168.1.0/24"), plate(IP, "THE INTERNET")];
-  const cables = [cable([LAP_OUT, HR_IN]), cable([HR_OUT, N.isp]), cable([N.a, DNS_IN]), ...LINKS.map(([a, b]) => cable([N[a], N[b]]))];
+  const plates = [plate(RP, "RESOLVER · 192.0.2.53"), plate(HP, "YOUR HOME · 192.168.1.0/24", (home, engrave) => homePart(home) + cafePart(engrave(CAFE_WORDS))), plate(IP, "THE INTERNET")];
+  const cables = [homePart(cable([LAP_OUT, HR_IN])), cable([HR_OUT, N.isp]), cable([N.a, DNS_IN]), ...LINKS.map(([a, b]) => cable([N[a], N[b]]))];
   const things = [
     { xy: [LB.x + LB.w / 2, LB.y + LB.d / 2], svg: laptop(ID, "") }, { xy: [HR.x + HR.w / 2, HR.y + HR.d / 2], svg: homeRouter(ID) },
     ...Object.entries(N).map(([n, xy]) => ({ xy, svg: puck(xy, n) })), { xy: [CB.x + CB.w / 2, CB.y + CB.d / 2], svg: resolverPart(cabinet(ID)) },
-    { xy: [PH.x + PH.w / 2, PH.y + PH.d / 2], svg: phonePart(phone(ID)) },
+    { xy: [PH.x + PH.w / 2, PH.y + PH.d / 2], svg: phonePart(phone(ID)) }, { xy: [LS.x + LS.w / 2, LS.y + LS.d / 2], svg: cafePart(listener(ID)) },
   ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
   const pts = [RP, HP, IP].flatMap((p) => k.boxCorners(p, FLOOR, 0)).concat([[CB.x, CB.y, CB_H], [HR.x + 5, HR.y + 4, RT + 22]]).map(at);
   return {
@@ -547,7 +601,7 @@ function mapSvg(only) {
   const base = buildBase();
   const layers = Object.entries(NET_MAP_LAYERS).map(([key, s]) => serverLayer(key, s));
   const boxes = [], calls = baseCallouts().map((c) => calloutSvg(c, boxes));
-  const shared = `${calls[0]}${resolverPart(calls[1])}${calls[2]}<g id="${ID}-router" display="none">${calls[3]}</g>${phonePart(calloutSvg(PHONE_CALL, boxes))}`;
+  const shared = `${calls[0]}${resolverPart(calls[1])}${calls[2]}<g id="${ID}-router" display="none">${calls[3]}</g>${phonePart(calloutSvg(PHONE_CALL, boxes))}${cafePart(calloutSvg(LISTENER_CALL, boxes))}`;
   // One frame for every protocol, so the map never jumps in size between them: everything any of them shows.
   const pts = [...base.pts, ...boxes.flatMap(([x0, y0, x1, y1]) => [[x0, y0], [x1, y1]]), ...layers.flatMap((l) => l.pts), ...[SLOT.E, SLOT.SE].flatMap((p) => k.boxCorners(p, FLOOR, 0)).map(at)];
   const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]), PAD = 18;
diff --git a/src/art/scenes/parts.ts b/src/art/scenes/parts.ts
index fc84d90..8b89b8b 100644
--- a/src/art/scenes/parts.ts
+++ b/src/art/scenes/parts.ts
@@ -57,15 +57,17 @@ export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
       // A router that threw a packet away keeps a DROPPED mark; a unit may start with the resolver left off the map.
       drop: 'text',
       hide: 'text',
-      // A part the map leaves off until a unit's start shows it: the phone.
+      // A part the map leaves off until a unit's start shows it: the phone, or the café (VPN), in home's place.
       show: 'text',
+      // With the café: what the one listening on its Wi-Fi makes out (VPN).
+      listener: 'text',
       // A copy of the tag waits in a bay (`park <place> <bay> <TAG>`) until a message with its tag takes it, or `unpark laptop` sends the laptop's into its screen.
       park: 'text',
       unpark: 'text',
       // A new visit (Proxies, as a step begins): the page, the padlock and every lit connection go.
       fresh: 'flag',
     },
-    args: { drop: NET_MAP_ROUTERS, hide: NET_MAP_HIDEABLE, show: NET_MAP_OPTIONAL },
+    args: { drop: NET_MAP_ROUTERS, hide: NET_MAP_HIDEABLE, show: NET_MAP_OPTIONAL, listener: ['reads', 'outside'] },
     layers: Object.keys(NET_MAP_LAYERS),
     board: false,
     // Its driver settles a unit's start under the cues that have played.
diff --git a/src/content/define.batch1.test.ts b/src/content/define.batch1.test.ts
index 41efc2b..4735846 100644
--- a/src/content/define.batch1.test.ts
+++ b/src/content/define.batch1.test.ts
@@ -45,7 +45,7 @@ test('`show phone` on an event’s cues fails once: only a scene’s start shows
 test('`show resolver` and `hide phone` in a start each fail once, naming the one part the cue takes', () => {
   const show = issues('nat', (l) => (unit(l).scene.start = [{ cue: 'show', arg: 'resolver' }, { cue: 'show', arg: 'phone' }]));
   expect(show).toHaveLength(1);
-  expect(show[0]).toContain('cue "show" takes "phone", not "resolver"');
+  expect(show[0]).toContain('cue "show" takes "phone", "proxy", "reverse" or "cafe", not "resolver"');
   const hide = issues('ports', (l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'phone' }]));
   expect(hide).toHaveLength(1);
   expect(hide[0]).toContain('cue "hide" takes "resolver", not "phone"');
@@ -83,3 +83,22 @@ test('the message rules apply to the network map alone', () => {
   expect(found).not.toContain('does not show (cue "show phone")');
   expect(found).not.toContain('needs the layer');
 });
+
+// D15b: the café takes the home plate's place, so it is not drawn with the phone; only it has a listener, and the laptop's bays lie under it.
+test('`show cafe` passes alone, fails with `show phone`, and `listener` and `park laptop` each need it or fail with it', () => {
+  expect(issues('ports', (l) => (unit(l).scene.start = [...unit(l).scene.start, { cue: 'show', arg: 'cafe' }]))).toEqual([]);
+  const parked = issues('ports', (l) => {
+    unit(l).scene.start = [...unit(l).scene.start, { cue: 'show', arg: 'cafe' }];
+    unit(l).steps[0]!.events.find((e) => e.type === 'message')!.cues = [{ cue: 'park', arg: 'laptop 1 GET' }];
+  });
+  expect(parked.some((i) => i.includes("the laptop's column lies where the café's listener does"))).toBe(true);
+  const both = issues('nat', (l) => (unit(l).scene.start = [{ cue: 'show', arg: 'cafe' }, { cue: 'show', arg: 'phone' }]));
+  expect(both.some((i) => i.includes('"show cafe" and "show phone" cannot go together'))).toBe(true);
+  const listening = issues('nat', (l) => (unit(l).steps[0]!.events.find((e) => e.type === 'message')!.cues = [{ cue: 'listener', arg: 'reads' }]));
+  expect(listening.some((i) => i.includes('cue "listener" needs the café'))).toBe(true);
+  const odd = issues('nat', (l) => {
+    unit(l).scene.start = [{ cue: 'show', arg: 'cafe' }];
+    unit(l).steps[0]!.events.find((e) => e.type === 'message')!.cues = [{ cue: 'listener', arg: 'sees' }];
+  });
+  expect(odd.some((i) => i.includes('"listener"') && i.includes('sees'))).toBe(true);
+});
diff --git a/src/content/define.ts b/src/content/define.ts
index 43871bd..a660c27 100644
--- a/src/content/define.ts
+++ b/src/content/define.ts
@@ -179,6 +179,11 @@ function checkCues(cues: Cue[] | undefined, where: string, c: UnitContext, atSta
   if (atStart && (cues ?? []).some((q) => q.cue === 'drop')) c.issues.push(`${where}: cue "drop" is for an event; the start cannot drop a packet.`);
   if (atStart && (cues ?? []).some((q) => q.cue === 'park' || q.cue === 'unpark')) c.issues.push(`${where}: cues "park" and "unpark" are for an event; the start cannot park a tag.`);
   if ((cues ?? []).filter((q) => q.cue === 'drop').length > 1) c.issues.push(`${where}: an event has at most one "drop" cue.`);
+  // The café (VPN) takes the home plate's place: it is not drawn with the phone, and only it has a listener.
+  const start = c.unit.scene.start;
+  const cafe = start.some((q) => q.cue === 'show' && q.arg === 'cafe');
+  if (atStart && cafe && start.some((q) => q.cue === 'show' && q.arg === 'phone')) c.issues.push(`${where}: cues "show cafe" and "show phone" cannot go together; the café has no phone.`);
+  if (!cafe && (cues ?? []).some((q) => q.cue === 'listener')) c.issues.push(`${where}: cue "listener" needs the café, and the scene's start does not show it (cue "show cafe").`);
   for (const { cue, arg } of cues ?? []) {
     const type = Object.hasOwn(c.parts.cues, cue) ? c.parts.cues[cue] : undefined;
     if (type === undefined) c.issues.push(`${where}: cue "${cue}" is not one the ${c.figure} figure has.`);
@@ -356,7 +361,10 @@ function entryRouter(place: string): string | undefined {
   if (NET_MAP_ROUTERS.includes(place)) return place;
   if (place === 'resolver') return 'a';
   if (place === 'laptop' || place === 'router' || place === 'phone') return 'isp';
-  for (const plate of Object.values(NET_MAP_LAYERS)) if (plateSites(plate).includes(place)) return 'puck' in plate ? plate.puck : 'c';
+  for (const plate of Object.values(NET_MAP_LAYERS)) {
+    if (plate.kind === 'vpn' && place === plate.out) return plate.outPuck;
+    if (plateSites(plate).includes(place)) return 'puck' in plate ? plate.puck : 'c';
+  }
   return undefined;
 }
 
@@ -433,6 +441,7 @@ function readPark(arg: string | undefined, where: string, c: UnitContext): { pla
   }
   if (place === 'laptop') {
     if (c.unit.scene.start.some((q) => q.cue === 'show' && q.arg === 'phone')) c.issues.push(`${at}: the laptop's column lies where the phone does, and the scene's start shows the phone.`);
+    if (c.unit.scene.start.some((q) => q.cue === 'show' && q.arg === 'cafe')) c.issues.push(`${at}: the laptop's column lies where the café's listener does, and the scene's start shows the café.`);
     if (Object.hasOwn(c.unit.scene.labels, 'router')) c.issues.push(`${at}: the laptop's column lies under the home router's callout, and the scene's labels give "router".`);
   }
   return { place, bay, tag };
diff --git a/src/lib/figures.test.ts b/src/lib/figures.test.ts
index 0b64d6e..044f34d 100644
--- a/src/lib/figures.test.ts
+++ b/src/lib/figures.test.ts
@@ -35,7 +35,7 @@ test('Router’s card is its spot, drawn for a lesson that has no home track yet
   expect(lessonFigure(entry)).toBe(spot('router'));
 });
 
-test.each(['arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets', 'load-balancers'] as const)('%s’s card is its spot, drawn for a lesson that has no home track yet, and does not throw', (slug) => {
+test.each(['arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets', 'load-balancers', 'vpn'] as const)('%s’s card is its spot, drawn for a lesson that has no home track yet, and does not throw', (slug) => {
   const entry = { available: true, key: slug, slug } as unknown as AvailableSummary;
   expect(() => lessonFigure(entry)).not.toThrow();
   expect(lessonFigure(entry)).toBe(spot(slug));
diff --git a/src/lib/figures.ts b/src/lib/figures.ts
index 343fe22..c63373d 100644
--- a/src/lib/figures.ts
+++ b/src/lib/figures.ts
@@ -20,6 +20,7 @@ const FIGURES: Record<string, () => string> = {
   switch: () => spot('switch'),
   'load-balancers': () => spot('load-balancers'),
   proxies: () => spot('proxies'),
+  vpn: () => spot('vpn'),
 };
 
 /**
diff --git a/src/lib/home.test.ts b/src/lib/home.test.ts
index 1c33583..dc35305 100644
--- a/src/lib/home.test.ts
+++ b/src/lib/home.test.ts
@@ -5,7 +5,7 @@ import { getEntries, getLesson, trackTotals } from '../content/registry';
 import { SOURCES } from '../content/sources';
 import { tracks } from '../content/tracks';
 import type { Lesson } from '../content/schema';
-import { groupsOf, PHONE_OPEN } from '../test/svg-groups';
+import { CAFE_OPEN, groupsOf, PHONE_OPEN } from '../test/svg-groups';
 import { numberedSources } from '../lesson/sourceNumbers';
 import { lessonStamp } from './checked';
 import { foldSources, homeDemo, homeStops, leadText, litSteps, sourceName } from './home';
@@ -293,9 +293,11 @@ test('Home’s still map shows no name strip, no DROPPED mark and every part of
   const { scene } = homeDemo();
   expect([...scene.matchAll(/<g class="nm-strip"[^>]*>/g)].every((m) => m[0].includes('display="none"'))).toBe(true);
   expect(scene).toMatch(/id="nm-discard" style="opacity:0"/);
-  // The phone is the one part drawn hidden (D11): both its groups, and nothing else.
+  // The phone (D11) and the café (D15b) are the parts drawn hidden: their groups, and nothing else.
   const { groups, rest } = groupsOf(scene, PHONE_OPEN);
   expect(groups).toHaveLength(2);
-  expect(rest).not.toContain('data-hidden');
+  const cafe = groupsOf(rest, CAFE_OPEN);
+  expect(cafe.groups).toHaveLength(3);
+  expect(cafe.rest).not.toContain('data-hidden');
   expect(scene).toContain('<g data-base="resolver">');
 });
diff --git a/src/scenes/drivers/net-map.test.ts b/src/scenes/drivers/net-map.test.ts
index 05e46e3..9698a9f 100644
--- a/src/scenes/drivers/net-map.test.ts
+++ b/src/scenes/drivers/net-map.test.ts
@@ -13,7 +13,7 @@ import { deriveState, slotsFor, stepEvents, type AppliedCue } from '../../engine
 import { showSweep } from '../../test/show-sweep';
 import { sha256 } from '../../test/figure-hash';
 import { sceneViewOf, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
-import { withoutD11 } from '../../test/svg-groups';
+import { withoutD11, withoutVpn } from '../../test/svg-groups';
 import { DRIVERS } from './index';
 import { netMapDriver, parseConn } from './net-map';
 
@@ -229,8 +229,9 @@ test('a unit’s start is in place before any cue plays: a line already open, le
 });
 
 test.each([
-  ['', /needs "<open\|seal\|close> <from>><to>\[ data\]"/],
-  ['open', /needs "<open\|seal\|close> <from>><to>\[ data\]", not "open"/],
+  ['', /needs "<open\|seal\|close> <from>>\[<via>>\]<to>\[ data\| tunnel\]"/],
+  ['open', /needs "<open\|seal\|close> <from>>\[<via>>\]<to>\[ data\| tunnel\]", not "open"/],
+  ['open laptop>vpn data tunnel', /not "open laptop>vpn data tunnel"/],
   ['shut laptop>web', /not "shut laptop>web"/],
   ['open laptop web', /not "open laptop web"/],
   ['open laptop>web extra', /not "open laptop>web extra"/],
@@ -240,8 +241,9 @@ test.each([
 });
 
 test('the conn cue reads its action, its two places and the data line', () => {
-  expect(parseConn('open laptop>web')).toEqual({ action: 'open', from: 'laptop', to: 'web', data: false });
-  expect(parseConn('close laptop>files data')).toEqual({ action: 'close', from: 'laptop', to: 'files', data: true });
+  expect(parseConn('open laptop>web')).toEqual({ action: 'open', from: 'laptop', to: 'web', data: false, tunnel: false });
+  expect(parseConn('close laptop>files data')).toEqual({ action: 'close', from: 'laptop', to: 'files', data: true, tunnel: false });
+  expect(parseConn('seal laptop>vpn tunnel')).toEqual({ action: 'seal', from: 'laptop', to: 'vpn', data: false, tunnel: true });
 });
 
 test('show fails loudly for a connection with no route, or one sealed before it opens', () => {
@@ -750,7 +752,7 @@ test('What is IP’s scene, with no strip labels and no hide, shows no strip and
   const { root, driver } = mount();
   driver.show(view({ layers: ['ip:web'], labels: { laptop: 'Sending a packet', url: 'example.net', router: '192.168.1.1 inside\n198.51.100.23 outside' } }));
   expect(stripWords(root)).toEqual([null, null, null, null, null]);
-  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"])')).toHaveLength(0);
+  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"]):not([data-base="cafe"])')).toHaveLength(0);
   expect(root.getAttribute('aria-label')).toMatch(/DNS resolver/);
   expect(part(root, 'nm-discard').style.opacity).toBe('0');
 });
@@ -760,7 +762,7 @@ test('a hidden-resolver start and then a start without it brings the resolver ba
   driver.show(routerView());
   expect(hiddenBases(root).every(Boolean)).toBe(true);
   driver.show(view({ layers: ['ip:web'] }));
-  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"])')).toHaveLength(0);
+  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"]):not([data-base="cafe"])')).toHaveLength(0);
   expect(root.getAttribute('aria-label')).toMatch(/DNS resolver/);
   expect(stripWords(root)).toEqual([null, null, null, null, null]);
   driver.show(routerView());
@@ -772,7 +774,7 @@ test('`hide` takes only the resolver and `drop` only a router: anything else thr
   expect(() => driver.show(view({ start: [{ cue: 'hide', arg: 'laptop' }] }))).toThrow(/cannot hide "laptop"/);
   expect(() => driver.show(view({ start: [{ cue: 'hide', arg: 'phone' }] }))).toThrow(/cannot hide "phone"/);
   expect(() => driver.show(view({ cues: [{ cue: 'drop', arg: 'zz' }] }))).toThrow(/no router "zz"/);
-  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"])')).toHaveLength(0);
+  expect(root.querySelectorAll('[data-hidden]:not([data-base="phone"]):not([data-base="cafe"])')).toHaveLength(0);
 });
 
 /** A box in the figure's units: from the attributes, as the figure draws it. */
@@ -939,7 +941,7 @@ test('the figure drawn for Router’s lesson is the approved prototype’s, tag
   const theirs = /<svg data-figure="net-map"[\s\S]*?<\/svg>(?=<\/div>)/.exec(proto)![0];
   const lines = (svg: string): string[] => svg.split('><');
   // D11's phone is drawn hidden on every map; the prototype was drawn before it, so its groups come out whole first.
-  expect(lines(withoutD11(drawNetMap(['ip:web']).svg))).toEqual(lines(theirs));
+  expect(lines(withoutD11(withoutVpn(drawNetMap(['ip:web']).svg)))).toEqual(lines(theirs));
 });
 
 // ---------------------------------------------------------------- D11 / B13: the phone, the stranger, Ports' server, ARP's row that leaves
@@ -1137,3 +1139,42 @@ test.each([['arp', arpFixture], ['ports', portsFixture], ['nat', natFixture]] as
   const lesson = fixture();
   expect(showSweep(lesson)).toBeGreaterThanOrEqual(20);
 });
+
+// ---------------------------------------------------------------- D15b: the café, its listener, and VPN's tunnel
+
+const cafeView = (o: Parameters<typeof view>[0] = {}): SceneView => view({ layers: ['vpn:vpn', 'vpn:web'], start: [{ cue: 'hide', arg: 'resolver' }, { cue: 'show', arg: 'cafe' }], ...o });
+const baseGroups = (root: SVGSVGElement, base: string): SVGElement[] => [...root.querySelectorAll<SVGElement>(`[data-base="${base}"]`)];
+
+test('`show cafe` draws the café in home’s place, and says so; without it, the café is hidden and home is drawn', () => {
+  const { root, driver } = mount();
+  driver.show(cafeView());
+  expect(baseGroups(root, 'cafe').map((g) => g.hasAttribute('data-hidden'))).toEqual([false, false, false]);
+  expect(baseGroups(root, 'home').every((g) => g.hasAttribute('data-hidden'))).toBe(true);
+  expect(root.getAttribute('aria-label')).toContain('On the left, a café: your laptop, the café’s router, and someone else on its Wi-Fi, listening.');
+  expect(root.getAttribute('aria-label')).toContain('the VPN server, where the tunnel from your laptop ends.');
+  driver.show(view({ layers: ['http:web'] }));
+  expect(baseGroups(root, 'cafe').every((g) => g.hasAttribute('data-hidden'))).toBe(true);
+  expect(baseGroups(root, 'home').some((g) => g.hasAttribute('data-hidden'))).toBe(false);
+  expect(root.getAttribute('aria-label')).toContain('your home: a laptop and its router.');
+});
+
+test('`listener` sets what the café’s listener makes out, and the latest one wins; no cue leaves it dark', () => {
+  const { root, driver } = mount();
+  const listener = root.querySelector('#nm-listener')!;
+  driver.show(cafeView());
+  expect(listener.hasAttribute('data-hear')).toBe(false);
+  driver.show(cafeView({ cues: [{ cue: 'listener', arg: 'reads' }] }));
+  expect(listener.getAttribute('data-hear')).toBe('reads');
+  driver.show(cafeView({ cues: [{ cue: 'listener', arg: 'reads' }, { cue: 'listener', arg: 'outside' }] }));
+  expect(listener.getAttribute('data-hear')).toBe('outside');
+  expect(() => driver.show(cafeView({ cues: [{ cue: 'listener', arg: 'sees' }] }))).toThrow(/listener cue needs "reads" or "outside"/);
+});
+
+test('`conn … tunnel` draws a tunnel band, apart from a plain line on the same route; home cannot be hidden', () => {
+  const { root, driver } = mount();
+  driver.show(cafeView({ cues: [{ cue: 'conn', arg: 'open laptop>vpn tunnel' }, { cue: 'conn', arg: 'seal laptop>vpn tunnel' }] }));
+  const lines = [...root.querySelectorAll('#nm-conns polyline')];
+  expect(lines.map((l) => l.getAttribute('class'))).toEqual(['nm-conn tunnel sealed']);
+  expect(() => driver.show(cafeView({ cues: [{ cue: 'conn', arg: 'seal laptop>vpn' }] }))).toThrow(/seals laptop>vpn, which is not open/);
+  expect(() => driver.show(view({ start: [{ cue: 'hide', arg: 'home' }] }))).toThrow(/cannot hide "home"/);
+});
diff --git a/src/scenes/drivers/net-map.ts b/src/scenes/drivers/net-map.ts
index 9d71f5e..81395ad 100644
--- a/src/scenes/drivers/net-map.ts
+++ b/src/scenes/drivers/net-map.ts
@@ -1,6 +1,6 @@
 // Only types from the drawing module: its code is for the build, and stays out of the page.
 import type { NetMapData } from '../../art/scenes/net-map';
-import { NET_MAP_HIDEABLE, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_PART_SENTENCES, NET_MAP_ROUTERS, NET_MAP_TAG_MAX } from '../../art/scenes/net-map-layers';
+import { NET_MAP_HIDEABLE, NET_MAP_INSTEAD, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_PART_SENTENCES, NET_MAP_ROUTERS, NET_MAP_TAG_MAX } from '../../art/scenes/net-map-layers';
 import type { Cue, MessageEvent, SceneEvent } from '../../content/schema';
 import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
 import { animate, easeInOut, wait } from '../motion';
@@ -17,9 +17,10 @@ import { animate, easeInOut, wait } from '../motion';
  * What a message leaves once it lands are its cues, and `show` paints all of them that have played, in order:
  * - `status <text>`: the laptop's status line; `status-known` and `status-done` style it (with or without the
  *   status of the same event), and a new status without either is plain again;
- * - `conn <open|seal|close> <from>><to>[ data]`: a connection that stays lit, glows brighter once sealed, and goes
- *   once closed; `data` is FTP's dashed second line, drawn above the first; `<from>><via>><to>` runs through a place
- *   on the way, as one line (Proxies' tunnel through the forward proxy);
+ * - `conn <open|seal|close> <from>><to>[ data| tunnel]`: a connection that stays lit, glows brighter once sealed, and
+ *   goes once closed; `data` is FTP's dashed second line, drawn above the first; `tunnel` is VPN's wide band, drawn
+ *   round the cables it runs along; `<from>><via>><to>` runs through a place on the way, as one line (Proxies' tunnel
+ *   through the forward proxy);
  * - `fresh`: a new visit: the page, the padlock and every lit connection go;
  * - `page text|full`: the page on the laptop's screen, its text first, then all of it;
  * - `lock`: the padlock in the laptop's address bar;
@@ -30,6 +31,10 @@ import { animate, easeInOut, wait } from '../motion';
  *   and `hide direct` take Proxies' forward proxy and the web server's own callout off again;
  * - `show phone` (a start only): the phone, which every other map leaves off, lies on the home plate; `show proxy`
  *   and `show reverse` draw Proxies' forward proxy and the site's reverse proxy;
+ * - `show cafe` (a start only): the home plate is a café's, with its own words, its Wi-Fi in place of the laptop's
+ *   cable, and someone else on it, listening; what it takes the place of (`NET_MAP_INSTEAD`) is left off;
+ * - `listener <reads|outside>` (with `show cafe`): the listener's glow, with what it can read (`reads`: the request,
+ *   its address and its words) or only where it goes (`outside`);
  * - `park <place> <bay> <TAG>`: a copy of the tag waits, unlit, in that bay (the laptop's four, the web server's four, a
  *   router's top) until a message with its tag takes it or `unpark laptop` (the only place that unparks) sends the laptop's tags into the laptop's
  *   screen; a gap (a dashed outline) marks an empty bay with a parked tag before and after it. A note that parks takes
@@ -92,6 +97,11 @@ const RESOLVER_SENTENCE = ' Behind it, the DNS resolver, a card-index cabinet.';
 /** As drawn, home is a laptop and its router; a map that shows the phone says so. */
 const HOME_SENTENCE = 'a laptop and its router.';
 const HOME_WITH_PHONE = 'a laptop, a phone and their router.';
+/** A map that shows the café says so, in place of home. */
+const HOME_PLACE = 'your home: a laptop and its router.';
+const CAFE_PLACE = 'a café: your laptop, the café’s router, and someone else on its Wi-Fi, listening.';
+/** What the listener on the café's Wi-Fi can make out: all of a plain request, or only where a sealed one goes. */
+const HEARS = ['reads', 'outside'] as const;
 
 /** A `conn` cue, read. */
 export interface ConnCue {
@@ -102,13 +112,15 @@ export interface ConnCue {
   via?: string;
   /** FTP's second line, for the data, beside the control line. */
   data: boolean;
+  /** VPN's tunnel: a wide band round the cables, not a line on them. */
+  tunnel: boolean;
 }
 
-/** Reads a `conn` cue's argument, `"<open|seal|close> <from>>[<via>>]<to>[ data]"`, or throws: anything else is a mistake in the lesson. */
+/** Reads a `conn` cue's argument, `"<open|seal|close> <from>>[<via>>]<to>[ data| tunnel]"`, or throws: anything else is a mistake in the lesson. */
 export function parseConn(arg: string): ConnCue {
-  const m = /^(open|seal|close) ([a-z0-9-]+)>(?:([a-z0-9-]+)>)?([a-z0-9-]+)( data)?$/.exec(arg);
-  if (m === null) throw new Error(`The network map's conn cue needs "<open|seal|close> <from>>[<via>>]<to>[ data]", not "${arg}".`);
-  return { action: m[1] as ConnCue['action'], from: m[2]!, to: m[4]!, ...(m[3] === undefined ? {} : { via: m[3] }), data: m[5] !== undefined };
+  const m = /^(open|seal|close) ([a-z0-9-]+)>(?:([a-z0-9-]+)>)?([a-z0-9-]+)( data| tunnel)?$/.exec(arg);
+  if (m === null) throw new Error(`The network map's conn cue needs "<open|seal|close> <from>>[<via>>]<to>[ data| tunnel]", not "${arg}".`);
+  return { action: m[1] as ConnCue['action'], from: m[2]!, to: m[4]!, ...(m[3] === undefined ? {} : { via: m[3] }), data: m[5] === ' data', tunnel: m[5] === ' tunnel' };
 }
 
 /** A `park` cue, read: where a copy of the tag waits. */
@@ -220,7 +232,9 @@ interface MapState {
   addr: string;
   url: string;
   /** Lit connections in the order they opened, by id: the route, or the route and ` data`. */
-  conns: Map<string, { from: string; to: string; via?: string; data: boolean; sealed: boolean }>;
+  conns: Map<string, { from: string; to: string; via?: string; data: boolean; tunnel: boolean; sealed: boolean }>;
+  /** What the listener on the café's Wi-Fi makes out, or '' when it is dark. */
+  hear: '' | (typeof HEARS)[number];
   page: '' | 'text' | 'full';
   lock: boolean;
   trays: Map<string, boolean>;
@@ -266,6 +280,8 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
   const busies = bySite('busy', '[id*="-busy-"]');
   const holds = bySite('hold', '.nm-hold');
   const lock = holds.get('lock') ?? [];
+  /** The listener on the café's Wi-Fi: only a map that can show the café has one. */
+  const listener = root.querySelector<SVGGElement>('#nm-listener');
   const homeLeds = [1, 2, 3].map((i) => part(`nm-home-led-${i}`));
   const tags = Array.from({ length: NET_MAP_TAG_MAX }, (_, i) => part(`nm-tag-${i + 1}`));
   const over = part('nm-over');
@@ -328,6 +344,7 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
       conns: new Map(),
       page: '',
       lock: false,
+      hear: '',
       trays: new Map(),
       parks: new Map(),
       drop: null,
@@ -350,7 +367,10 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
         else if (cue === 'addr') s.addr = arg;
         else if (cue === 'url') s.url = arg;
         else if (cue === 'lock') s.lock = true;
-        else if (cue === 'fresh') {
+        else if (cue === 'listener') {
+          if (!HEARS.includes(arg as (typeof HEARS)[number])) throw new Error(`The network map's listener cue needs "reads" or "outside", not "${arg}".`);
+          s.hear = arg as (typeof HEARS)[number];
+        } else if (cue === 'fresh') {
           s.page = '';
           s.lock = false;
           s.conns.clear();
@@ -389,9 +409,9 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
   function connect(s: MapState, c: ConnCue): void {
     const route = c.via === undefined ? `${c.from}>${c.to}` : `${c.from}>${c.via}>${c.to}`;
     routeOf(map, c);
-    const id = c.data ? `${route} data` : route;
+    const id = c.data ? `${route} data` : c.tunnel ? `${route} tunnel` : route;
     const line = s.conns.get(id);
-    if (c.action === 'open') s.conns.set(id, { from: c.from, to: c.to, ...(c.via === undefined ? {} : { via: c.via }), data: c.data, sealed: false });
+    if (c.action === 'open') s.conns.set(id, { from: c.from, to: c.to, ...(c.via === undefined ? {} : { via: c.via }), data: c.data, tunnel: c.tunnel, sealed: false });
     else if (line === undefined) throw new Error(`The conn cue ${c.action === 'seal' ? 'seals' : 'closes'} ${id}, which is not open.`);
     else if (c.action === 'seal') line.sealed = true;
     else s.conns.delete(id);
@@ -458,7 +478,7 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
     conns.replaceChildren(
       ...[...s.conns.values()].map((c) => {
         const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
-        line.setAttribute('class', `nm-conn${c.data ? ' alt' : ''}${c.sealed ? ' sealed' : ''}`);
+        line.setAttribute('class', `nm-conn${c.data ? ' alt' : ''}${c.tunnel ? ' tunnel' : ''}${c.sealed ? ' sealed' : ''}`);
         if (c.data) line.setAttribute('transform', DATA_LINE_LIFT);
         line.setAttribute('points', pointsOf(rideOf(c.from, c.to, c.via).flat));
         return line;
@@ -466,6 +486,8 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
     );
     for (const [site, els] of holds) if (site !== 'lock') light(els, s.trays.get(site) ?? false);
     light(lock, s.lock);
+    if (s.hear === '') listener?.removeAttribute('data-hear');
+    else listener?.setAttribute('data-hear', s.hear);
     for (const el of page) fade(el, wants(s, el) ? 1 : 0);
     if (s.drop === null) fade(discard, 0);
     else {
@@ -475,11 +497,13 @@ function create(root: SVGSVGElement, data: unknown): SceneDriver {
     paintParks(s.parks);
     for (const el of root.querySelectorAll<SVGElement>('[data-base]')) {
       const base = el.dataset.base!;
-      el.toggleAttribute('data-hidden', s.hidden.has(base) || (NET_MAP_OPTIONAL.includes(base) && !s.shown.has(base)));
+      const instead = Object.entries(NET_MAP_INSTEAD).some(([shown, gone]) => gone === base && s.shown.has(shown));
+      el.toggleAttribute('data-hidden', s.hidden.has(base) || instead || (NET_MAP_OPTIONAL.includes(base) && !s.shown.has(base)));
     }
     // What the figure says it draws is what it draws: no resolver, a phone and a stranger only when shown.
     let words = s.hidden.has('resolver') ? described.replace(RESOLVER_SENTENCE, '') : described;
     if (s.shown.has('phone')) words = words.replace(HOME_SENTENCE, HOME_WITH_PHONE);
+    if (s.shown.has('cafe')) words = words.replace(HOME_PLACE, CAFE_PLACE);
     for (const [base, sentence] of Object.entries(NET_MAP_PART_SENTENCES)) if (s.shown.has(base) && !s.hidden.has(base)) words += ` ${sentence}`;
     for (const key of s.layers) {
       const sentence = Object.hasOwn(NET_MAP_LAYERS, key) ? NET_MAP_LAYERS[key]!.describe : undefined;
diff --git a/src/test/svg-groups.ts b/src/test/svg-groups.ts
index 4af4c04..b77a4e3 100644
--- a/src/test/svg-groups.ts
+++ b/src/test/svg-groups.ts
@@ -27,6 +27,12 @@ export const SERVER_OPEN = '<g data-layer="ports:server" display="none">';
 /** The map without D11's parts: what the mockup's hash and Router's prototype describe. */
 export const withoutD11 = (svg: string): string => [PHONE_OPEN, STRANGER_OPEN, SERVER_OPEN].reduce((out, open) => groupsOf(out, open).rest, svg);
 
+/** D15b's VPN: the VPN server's and its example.net's layers, the café's groups, and the `home` wrappers round what the café takes the place of. */
+export const VPN_SERVER_OPEN = '<g data-layer="vpn:vpn" display="none">';
+export const VPN_WEB_OPEN = '<g data-layer="vpn:web" display="none">';
+export const CAFE_OPEN = '<g data-base="cafe" data-hidden="">';
+export const HOME_OPEN = '<g data-base="home">';
+
 /** D12's voice plate: the five groups of the layer `tcp-udp:voice`. */
 export const VOICE_OPEN = '<g data-layer="tcp-udp:voice" display="none">';
 /** D12's frames setup on the DHCP plate: the TV and the callouts, and the two tags that only MAC Address's frames carry. */
@@ -56,6 +62,9 @@ export function unwrapGroups(svg: string, open: string): string {
   return out;
 }
 
+/** The map without D15b's parts: its new groups out whole, then home's wrappers opened, so the map is the one before it. */
+export const withoutVpn = (svg: string): string => unwrapGroups([VPN_SERVER_OPEN, VPN_WEB_OPEN, CAFE_OPEN].reduce((out, open) => groupsOf(out, open).rest, svg), HOME_OPEN);
+
 /** The DHCP plate without D12's frames parts: what DHCP's mockup hash describes. */
 export const withoutFrames = (svg: string): string =>
   unwrapGroups([FRAMES_OPEN, FRAME_TAG_OPEN, TO_ALL_TAG_OPEN].reduce((out, open) => groupsOf(out, open).rest, svg), ADDRESSES_OPEN);
```
