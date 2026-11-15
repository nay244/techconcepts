# D11: ARP, Ports and NAT, the scenes and the card art (job 12, batch 1)

The spec for three new Networking Concepts lessons: **ARP** (`arp`, stop 6), **Ports** (`ports`, stop 10) and **NAT** (`nat`, stop 12). It covers each lesson's Watch scene on the net-map figure, its table panel and its card art. One writer builds all three.

By the owner's word for this batch (direction 2.52) there is no clickable prototype and no design gate. The art is fixed instead by six SVG files, each exactly what the code emits, and a test compares the build with them tag for tag (§8, checks 1 to 3):

| File | What it is |
|---|---|
| `prototypes/d11-arp-spot.svg` | `spot('arp')`, ARP's card art |
| `prototypes/d11-ports-spot.svg` | `spot('ports')`, Ports' card art |
| `prototypes/d11-nat-spot.svg` | `spot('nat')`, NAT's card art |
| `prototypes/d11-part-phone.svg` | net-map's new phone: its two `<g data-base="phone" data-hidden="">` groups |
| `prototypes/d11-part-stranger.svg` | net-map's new layer `nat:stranger`: its five `<g data-layer="nat:stranger" display="none">` groups |
| `prototypes/d11-part-server.svg` | net-map's new layer `ports:server`: its five `<g data-layer="ports:server" display="none">` groups |

The code that emits them is the patch in Appendix A. It applies cleanly to `job12/batch` at `a63c603` (`git apply --check` passes). The files were generated from it. The SVGs carry classes and CSS variables, not colours, so they render properly only inside a page that loads `lumen.css`, the tokens and the shared defs; opened alone they look flat. That is expected.

The stories are the analysts' (`.superpowers/analysis/{arp,ports,nat}/report.md` §2 and their Rulings). Nothing is added to them. Step titles, step statuses, table summaries and log info are the outlines' words, used as placeholders the author will set, except where §7 marks words as design copy.

One variant for each lesson. No choice here splits two ways the owner should weigh.

## 1. What changes and what stays

**Stays.**
- The Lesson page as built (direction §7): its layout, console, stage, log, phone tabs, and the table panel's look (caption, by-line, header, rows, highlight, `tpanel__miss` tag, candidate and no-match rows).
- The net-map drawing, its frame (`viewBox="-98 -60 685 378"`), camera, tags, trail, lights, ring, pace, callouts, strips and DROPPED mark. Every existing lesson's map is unchanged: the new parts are hidden unless a unit asks for them.
- Router's spot and every other card.

**Changes.**

| What | For | Where |
|---|---|---|
| A phone lying on the home plate, with a callout "Your phone / 192.168.1.101". It is drawn hidden and shown by a new start cue, `show phone`. | NAT | net-map art, layers, parts, driver, validator |
| A new layer `nat:stranger`: a small plate in a new slot `N`, behind the internet, holding someone else's computer (a new plate kind, `pc`), cabled to router a. | NAT | net-map art, layers |
| A new layer `ports:server`: the existing `host` kind on slot E, engraved EXAMPLE.NET, callout "A server / 203.0.113.80". No new drawing. | Ports | layers |
| A table `remove` takes 600ms on net-map | ARP step 5 | net-map driver |
| An `add` clears the step's no-match row | ARP step 5 | engine (`markFor`) |
| The figure's description names the phone and the stranger when they are shown | NAT | net-map driver, layers |
| Three spots: `arp`, `ports`, `nat` | cards | `spots.ts`, `figures.ts` |

ARP adds no part to the map (its ruling 3). Ports adds a layer of an existing kind. NAT adds the two parts the rulings asked for.

## 2. Gaps decided

### 2.1 Ports: a new plate, not `ip:web`

**Decision.** A new layer `ports:server`: `host('server', 'EXAMPLE.NET', 'A server', '203.0.113.80')`. That is the `host` kind as `ssh:host` draws it (two racks and a pad that lights while it works), with example.net's address and no port in the callout.

**Reason.** `ip:web`'s callout reads "Web server". The lesson's one idea is that a single machine runs several programs, each behind its own port. A label naming one of them would say the opposite. `tcp:web` is worse, since it engraves "port 80". The new layer costs one data line and no drawing.

The site is named `server`, not `web`. A site must stand in the same place in every layer, and `web` is the dock of the `web` kind.

### 2.2 NAT: where the phone goes, and how it shows

**Decision.** The phone lies flat on the home plate, screen up, to the right of the laptop and in front of the router: `PH = { x: -60, y: 84, w: 9, d: 18 }`, 2.2 high. Its screen glows (`#nm-busy-phone`, the laptop's `nm-glow`) while it sends or receives. It has no cable, being on Wi-Fi. Its way to the router runs across the plate to the router's front, then over it. Its callout sits between the home plate and the internet plate, at (70, 196).

It is drawn inside `<g data-base="phone" data-hidden="">` groups, so it is hidden on every map, with or without JavaScript and on Home's still copy. A unit shows it with the start cue `show phone`.

**Reasons.**
- **Flat, not upright.** An upright phone anywhere in that corner covers the router's front lights, which light for every message at home.
- **Right of the laptop.** The router's callout leader runs diagonally across the front of the home plate, from (63, 140) to (−71, 258). A phone left of it would sit under the leader, with two leader dots almost touching. The phone's whole outline lies right of the leader, at least 3 units clear.
- **A start cue, not a label.** It mirrors `hide resolver`: a part off the map until the unit's start changes that. It also lets the validator reject a message to a phone that is not drawn.

**Rejected:**
- **The dhcp figure.** It has no internet side, so it cannot carry NAT's steps 1, 2 and 5.
- **A status line for the phone.** It would mean a third callout line and a new cue. The phone's glow, the table and the log say what it does (§2.4).

### 2.3 NAT: the stranger's plate

**Decision.** A new slot `N = { x: -84, y: -196, w: 56, d: 40 }`, behind the internet plate and left of example.net's racks, and a new plate kind `pc`. The plate carries a monitor on a stand, a keyboard, and a small box with one light on. The monitor's screen glows (`#nm-nat-busy-stranger`) while it sends. A cable leaves the plate's right-hand edge, clear of the engraving, and runs to router a. So the stranger's way to your router is stranger → a → provider → your router.

- Engraving: ANOTHER NETWORK.
- Callout: "Someone else / 192.0.2.66", at (420, −24), to the right of the monitor.

It is the layer `nat:stranger`, so NAT shows it with `layers: ['tcp:web', 'nat:stranger']`.

**Reasons.**
- **Not slot SE.** smtp:in's plate there sits under example.net's callout when `tcp:web` is shown (measured on the live map).
- **Not slot NE.** It stands where example.net's racks rise.
- **Not the resolver's place.** It is free in NAT only because NAT hides the resolver, and that would tie the two together.
- **It fits the frame.** N fits inside the map's fixed frame, so the viewBox stays `-98 -60 685 378`. Its highest point (the monitor's top, y −38.2) and its callout (x up to 527, y from −36) are inside it.

### 2.4 NAT: the laptop's status line is the laptop's

**Decision.** Only steps 1 and 2 set the status line ("Router swapped the address and port", then "Reply received"). Steps 3 to 5 set none, so the line keeps "Reply received", which is still true of the laptop. The outline's step 3 and step 5 statuses ("Same address, new port", "Not passed in") are not used.

**Reason.** The line sits under "YOUR LAPTOP". In Router the laptop sent every packet. Here the phone and a stranger act in steps 3 to 5, and a line under the laptop would credit their story to it. The table's rows, the no-match row and the log carry those steps.

### 2.5 NAT: the table's columns

**Decision.** Two columns: **Inside** (`192.168.1.100:50422`) and **Outside port** (`61023`). The key is Outside port. The one outside address is in the by-line: "kept by your router, 198.51.100.23 outside".

The outline's third column, Site (`203.0.113.80:80`), is dropped. The narrative says "same site".

**Reason.** Measured at 375, a Table tab is 347px wide.
- Three columns are 483px wide and scroll.
- Two columns with the full outside pair (`198.51.100.23:61023`) fit with about 1px to spare, and would scroll on a 360px phone.
- Inside and Outside port are 288px wide.

The by-line repeats the callout's own words ("198.51.100.23 outside"). With the port alone in the column, the rows read as the lesson's rule: one address, told apart by port.

### 2.6 NAT: the stranger stops at your router with no mark

**Decision.** The stranger's packet is delivered to `router`: its tag rides there and stops, and the home lights flash. Then a `match` with `key: ''` shows the no-match row. No DROPPED mark, no LOST, and nothing rides on from the router.

**Reason.** The outline's words to avoid are "dropped silently", "blocked" and "the router's firewall". A DROPPED mark would say the first, and `drop` takes internet routers only. The no-match row says why, and the empty way on says the rest.

### 2.7 Ports: a closed port

**Decision.** As ruled. The SYN to 3389 is delivered. A `match` with `key: ''` shows "no match". An RST rides back as a `control` message tagged RST. No message has outcome `blocked`, and no LOST mark shows.

### 2.8 ARP: the router's callout names its MAC address

**Decision.** `labels.router: '192.168.1.1\n00:00:5E:00:53:01'`. The laptop's callout keeps its IP address only.

**Reason.** The callouts say what each device is, and the router knows its own hardware address. The ARP cache panel says what the laptop knows: empty, then the one row. The gap between the two is the lesson. Both lines contain digits, so the driver draws both in the address style.

### 2.9 ARP: the row leaves, and the no-match row goes once the row is back

**Decisions.**
- **`remove` takes 600ms on net-map.** Today it lands at once, so in step 5 the row would vanish before the reader sees it there. No net-map lesson uses `remove` today, so no lesson's timing moves. `add` and `update` stay at 0: the tour's lessons use them.
- **An `add` clears `noMatch`.** In step 5 the miss comes first, then the reply, then the row is written. Without this, "no match" would stay under the row that now answers it. No lesson today has an `add` after a `match` with `key: ''` in one step, so no settled panel changes.

### 2.10 Also decided

- **Views:** `['network']` for all three, as the brief says.
- **Tags** are in capitals, as on the rest of net-map: WHO HAS?, IS AT, PACKET, SYN, SYN-ACK, RST, REPLY.
- **Sizes** are "—" in every row: no source states one.
- **Times:**
  - ARP steps 1 to 3 keep What is IP's checked and reused times (0.000s, 0.002s, 0.003s), as the outline asks.
  - ARP steps 4 and 5 are "—": a clock time there would invite reading the cache's timeout, which no source fixes (N-4).
  - Ports and NAT are "—".
  - Open question 2.
- **Resolver:** all three scenes start with `hide resolver`. None uses it, and in NAT the stranger's cable passes near its plate.
- **The ARP scene shows `ip:web`.** example.net, where the waiting packet is going, is the "outside its network" of step 1.

## 3. The scenes and their steps

**IDs.** Event ids are the builder's, as in D10.

**The `plain` text.** Every event's `plain` is the author's.

**Common to every scene:**
- `figure: 'net-map'`, `views: ['network']`.
- Each step's events play in the order listed.
- The pace is SLOW unless marked FAST.
- size "—".

### 3.1 ARP

| Field | Value |
|---|---|
| layers | `['ip:web']` |
| labels | `laptop: 'Has a packet for example.net'` (placeholder); `router: '192.168.1.1\n00:00:5E:00:53:01'` |
| start | `[{ cue: 'hide', arg: 'resolver' }]` |
| panel | `{ type: 'table', table: arpCache }` |
| legend | `broadcast` "Broadcast to everyone"; `response` "Reply"; `request` "Packet" |

The table `arpCache`:

| Field | Value |
|---|---|
| id | `arp-cache` |
| title | "ARP cache" |
| by | "kept by your laptop" |
| columns | `ip` "IP address"; `mac` "MAC address" (both mono) |
| keyColumn | `ip` |
| initialRows | `[]` |
| empty | "Empty. Nothing learned yet." |

Every message has `via` "Ethernet".

**Step 1. Who has 192.168.1.1?**

| # | Event | What shows |
|---|---|---|
| 1 | table `match`, `key: ''`. Summary: "Nothing for 192.168.1.1 in the cache." | The empty text, then the no-match row under it. 900ms. |
| 2 | message laptop → router, `kind: 'broadcast'`, tag WHO HAS?, protocol ARP, time 0.000s, source 00:00:5E:00:53:10, destination ff:ff:ff:ff:ff:ff, info "ARP: who has 192.168.1.1? Tell 192.168.1.100", cue `status` "Finding the router" | The ring spreads over the home plate; the tag rides to the router. |

**Step 2. Only the owner answers**

| # | Event | What shows |
|---|---|---|
| 1 | message router → laptop, `kind: 'response'`, tag IS AT, protocol ARP, time 0.002s, source 00:00:5E:00:53:01, destination 00:00:5E:00:53:10, info "ARP: 192.168.1.1 is at 00:00:5E:00:53:01", cues `status` "Found the router" and `status-known` | No ring. The status is in the known style. |

**Step 3. The cache fills**

| # | Event | What shows |
|---|---|---|
| 1 | table `add` `{ ip: '192.168.1.1', mac: '00:00:5E:00:53:01' }`. Summary: "Added to the cache: 192.168.1.1 is at 00:00:5E:00:53:01." | The row appears, highlighted as new. |
| 2 | message laptop → router, `kind: 'request'`, tag PACKET, protocol IP (ruling 6), time 0.003s, source 00:00:5E:00:53:10, destination 00:00:5E:00:53:01, info "Frame to 00:00:5E:00:53:01, carrying the packet for 203.0.113.80", cue `status` "Sent to the router" (placeholder) | |

**Step 4. Send again: the cache answers**

| # | Event | What shows |
|---|---|---|
| 1 | table `match`, `key: '192.168.1.1'`. Summary: "In the cache: 192.168.1.1 is at 00:00:5E:00:53:01." | The row highlighted as matched. |
| 2 | message laptop → router, `kind: 'request'`, tag PACKET, protocol IP, time —, source 00:00:5E:00:53:10, destination 00:00:5E:00:53:01, info "Cache hit: straight to 00:00:5E:00:53:01, no ARP needed", cue `status` "Sent: no question needed" (placeholder) | No ring. |

**Step 5. The entry runs out: ask again**

| # | Event | What shows |
|---|---|---|
| 1 | table `remove`, `key: '192.168.1.1'`. Summary: "The entry ran out and is removed." | The row goes; the empty text returns. 600ms (§2.9). |
| 2 | table `match`, `key: ''`. Summary as step 1. | The no-match row. 900ms. |
| 3 | message as step 1's, time — | Ring; status "Finding the router". |
| 4 | message as step 2's, time — | Status "Found the router", known. |
| 5 | table `add`, as step 3's | The row, highlighted as new. The no-match row is gone (§2.9). |

**Settled (Back, Next, outline):**

| Position | Panel | Status line |
|---|---|---|
| Overview, step 1 start | Empty text | "Has a packet for example.net" |
| Step 2 start | Empty text, no no-match row | "Finding the router" |
| Step 3 start | Empty text | "Found the router", known |
| Step 4 start | One row, no highlight | "Sent to the router" |
| Step 5 start | One row, no highlight | "Sent: no question needed" |
| Step 5 end | One row, highlighted as new; no no-match row | "Found the router", known |

The figure is the same at every position: the resolver hidden, `ip:web` shown, no phone.

### 3.2 Ports

| Field | Value |
|---|---|
| layers | `['ports:server']` |
| labels | `laptop: 'Opening connections'` (placeholder). No `router` label: its callout stays hidden. |
| start | `[{ cue: 'hide', arg: 'resolver' }]` |
| panel | `{ type: 'table', table: listening }` |
| legend | `request` "Request"; `response` "Reply"; `control` "Reset" |

The table `listening`:

| Field | Value |
|---|---|
| id | `listening-ports` |
| title | "Listening ports" |
| by | "on example.net (203.0.113.80)" |
| columns | `port` "Port" (mono); `program` "Program" (prose) |
| keyColumn | `port` |
| initialRows | TCP 22, SSH server; TCP 80, Web server (HTTP); TCP 443, Web server (HTTPS) |
| empty | "Nothing is listening." |

Common to every message: protocol TCP, time "—". The laptop's side is written as the laptop sent it (ruling 1).

| Step | Events in order (each SYN: laptop → server, `request`, tag SYN; each answer: server → laptop) |
|---|---|
| 1. Port 80: the web's door | SYN 192.168.1.100:50422 → 203.0.113.80:80, info "SYN to port 80". Then table `match` `key: 'TCP 80'`, summary "The web server is listening on port 80." Then SYN-ACK (`response`) 203.0.113.80:80 → 192.168.1.100:50422, info "SYN-ACK from port 80", cues `status` "Connected to port 80" and `status-done`. |
| 2. Port 443: same server, another door | SYN from 50423 to :443; `match` `'TCP 443'`, summary "The web server is listening on port 443 too."; SYN-ACK back to :50423; status "Connected to port 443", done. |
| 3. Port 22: a different program | SYN from 50431 to :22; `match` `'TCP 22'`, summary "The SSH server is listening on port 22."; SYN-ACK back to :50431; status "SSH app: connected to port 22", done. |
| 4. Port 3389: nobody home | SYN from 50440 to :3389, delivered; `match` `key: ''`, summary "Nothing is listening on 3389."; then RST (`control`, tag RST) 203.0.113.80:3389 → 192.168.1.100:50440, info "RST: nothing listening on 3389", cue `status` "Refused: nothing listening on 3389" (plain). |
| 5. Open the port | table `add` `{ port: 'TCP 3389', program: 'Remote Desktop' }`, summary "Remote Desktop is now listening on 3389."; SYN from 50441 to :3389; `match` `'TCP 3389'`; SYN-ACK back to :50441; status "Connected to port 3389", done. |

The server's pad lights as each SYN lands. No `conn` cue: open connections are not drawn (outline flag 3); the table and the log carry them.

**Settled:**

| Position | Panel | Status line |
|---|---|---|
| Overview, step 1 start | The three rows | "Opening connections" |
| Step 2 start | Three rows, no highlight | "Connected to port 80", done |
| Step 4 start | Three rows | "SSH app: connected to port 22", done |
| Step 4 end | Three rows plus the no-match row | "Refused: nothing listening on 3389", plain |
| Step 5 start | Three rows, no no-match row | as step 4's end |
| Step 5 end | Four rows, TCP 3389 highlighted as matched | "Connected to port 3389", done |

### 3.3 NAT

| Field | Value |
|---|---|
| layers | `['tcp:web', 'nat:stranger']` |
| labels | `laptop: 'Opening example.net'` (placeholder); `router: '192.168.1.1 inside\n198.51.100.23 outside'` (What is IP's and Router's checked label) |
| start | `[{ cue: 'hide', arg: 'resolver' }, { cue: 'show', arg: 'phone' }]` |
| panel | `{ type: 'table', table: natTable }` |
| legend | `request` "Packet"; `response` "Reply" |

The table `natTable`:

| Field | Value |
|---|---|
| id | `nat-table` |
| title | "NAT table" |
| by | "kept by your router, 198.51.100.23 outside" |
| columns | `inside` "Inside"; `out` "Outside port" (both mono) |
| keyColumn | `out` |
| initialRows | `[]` |
| empty | "Empty. Nothing has gone out yet." |

Common to every message: protocol TCP, time "—". Tags: PACKET for one that starts a conversation, REPLY for an answer.

**Step 1. Out: a new address and port**

| # | Event |
|---|---|
| 1 | message laptop → router, PACKET, 192.168.1.100:50422 → 203.0.113.80:80, info "To example.net, port 80, from temporary port 50422" |
| 2 | table `add` `{ inside: '192.168.1.100:50422', out: '61023' }`, summary "Written: 192.168.1.100:50422 goes out as port 61023." |
| 3 | message router → web, PACKET, 198.51.100.23:61023 → 203.0.113.80:80, info "NAT: 192.168.1.100:50422 → 198.51.100.23:61023", cue `status` "Router swapped the address and port" |

**Step 2. Back: the table knows**

| # | Event |
|---|---|
| 1 | message web → router, REPLY (`response`), 203.0.113.80:80 → 198.51.100.23:61023, info "Reply to the router’s public address, port 61023" |
| 2 | table `match` `key: '61023'`, summary "Port 61023 is the laptop’s: 192.168.1.100:50422." |
| 3 | message router → laptop, REPLY, 203.0.113.80:80 → 192.168.1.100:50422, info "NAT: 198.51.100.23:61023 → 192.168.1.100:50422", cues `status` "Reply received" and `status-done` |

**Step 3. A second device, same site**

| # | Event |
|---|---|
| 1 | message phone → router, PACKET, 192.168.1.101:50613 → 203.0.113.80:80, info "To example.net, port 80, from temporary port 50613" |
| 2 | table `add` `{ inside: '192.168.1.101:50613', out: '63847' }`, summary "Written: 192.168.1.101:50613 goes out as port 63847." |
| 3 | message router → web, PACKET, 198.51.100.23:63847 → 203.0.113.80:80, info "NAT: 192.168.1.101:50613 → 198.51.100.23:63847". No status cue (§2.4). |

**Step 4. One address, told apart by port**

| # | Event |
|---|---|
| 1 | message web → router, REPLY, → 198.51.100.23:63847 |
| 2 | table `match` `key: '63847'`, summary "Port 63847 is the phone’s: 192.168.1.101:50613." |
| 3 | message router → phone, REPLY, → 192.168.1.101:50613, info "NAT: 198.51.100.23:63847 → 192.168.1.101:50613" |
| 4 | message web → router, REPLY, → 198.51.100.23:61023, **FAST** |
| 5 | table `match` `key: '61023'`, summary as step 2's |
| 6 | message router → laptop, REPLY, → 192.168.1.100:50422, **FAST** |

The phone's reply comes first because it is the new one. The laptop's repeats step 2, so it rides FAST. The phone's screen glows as its reply lands.

**Step 5. Nobody asked: no row, nowhere to go**

| # | Event |
|---|---|
| 1 | message stranger → router, PACKET (`request`), 192.0.2.66:51200 → 198.51.100.23:80, info "No row for port 80: not passed in" |
| 2 | table `match` `key: ''`, summary "No row for port 80: nothing at home asked for this." |

Nothing rides on to the laptop or the phone (§2.6). No status cue.

**Settled:**

| Position | Figure | Panel | Status line |
|---|---|---|---|
| Overview | Phone and stranger shown; resolver hidden | Empty text | "Opening example.net" |
| Step 2 start | as overview | Row 1, no highlight | "Router swapped the address and port" |
| Step 3 start | as overview | Row 1 | "Reply received", done |
| Step 5 start | as overview | Rows 1 and 2, no highlight | "Reply received", done |
| Step 5 end | as overview | Two rows plus the no-match row | "Reply received", done |

## 4. Sizes, spacing and breakpoints

### 4.1 The figure (SVG units, drawn at build time)

The numbers are the patch's (Appendix A).

**The phone**
- Body: `{ x: -60, y: 84, w: 9, d: 18, r: 1.8 }`, 2.2 high, tone `hi`, with a side seam.
- On its top: a screen (`lm-void`) inset 1.1 at the sides, 2.4 at the ends, with its glow over it. Then a speaker slot 3.4 × 0.7, and three page lines 0.9 thick.
- Its place: it stops at the centre of its top, 1 above it. Its way out is three points: (−66, 83) at ride height, the router's top, the router's way out.
- Callout:
  - anchor at the phone's far corner `[−51, 102, 2.2]`, on screen (45.5, 169.2);
  - first line at (70, 196); "YOUR PHONE" and "192.168.1.101" in the map's callout styles.
  - Its box (70, 184) to (168, 216) is inside the frame. It clears the home plate's edge, the internet plate's edge and the internet callout, which starts at y 220.

**Slot N and the `pc` kind**
- Slot N: `{ x: -84, y: -196, w: 56, d: 40, r: 6 }`.
- Inside it, as offsets from the plate:
  - monitor panel `{ 5, 9, 24 × 2.4 }`, from z 5 to 19, on a foot `{ 11, 5, 12 × 8 }` and a neck of r 1.1;
  - keyboard `{ 6, 17, 22 × 7 }`, 1.4 high, 2 × 7 keys;
  - box `{ 42, 5, 7 × 16 }`, 18 high, two slots and one light on.
- Cable: from 3 right of the box, to 3 past the plate's right edge, to router a.
- Its place: in front of the box's right side, `[−32, −173, 3]`.
- Callout: anchor at the monitor's top right; first line at (420, −24).

### 4.2 Measured

**Before** is the same figure and panel on the live dev site (Router and What is IP). **After** is the patch's drawing, injected into the live page, and table rows built with the panel's own classes in the live panel, both themes.

**At 1440 × 900.** The figure box is 733 wide. Its height is what the panel leaves.

| | Panel | Figure box height |
|---|---|---|
| Before, empty table | 100 | 398 |
| Before, Router step 5 (2 rows and no-match) | 149 | 349 |
| ARP, overview (empty) | 100 | 398 |
| ARP, steps 1 and 5 (empty and no-match) | 131 | 367 |
| ARP, steps 3 to 5 (1 row) | 90 | 404 (the drawing's own limit) |
| Ports, overview (3 rows) | 151 | 347 |
| Ports, step 4 (3 rows and no-match) | 182 | 316 |
| Ports, step 5 (4 rows) | 181 | 317 |
| NAT, overview (empty) | 100 | 398 |
| NAT, step 4 (2 rows) | 118 | 380 |
| NAT, step 5 (2 rows and no-match) | 149 | 349 |

- The panel never scrolls.
- Ports' step 4 is the smallest map on the site so far, drawn 573 × 316. Every word on it stays at or above the existing callouts' size (10.6px at that width). Open question 4.

**At 375 × 812.**

| | Before | After |
|---|---|---|
| Figure box | 375 × 235 | 375 × 235 (viewBox unchanged) |
| Drawing | 375 × 207 | 375 × 207 |
| Smallest map words | callouts 6.3px | phone and stranger callouts 6.3px (same styles); the ANOTHER NETWORK engraving is texture, as every plate engraving is |
| Phone on screen | — | about 17 × 9px, its screen glow visible in both themes |
| Table tab | 347px wide | ARP, Ports and NAT: 347px, `scrollWidth` = `clientWidth` at every step measured. NAT's by-line wraps under the title. |
| Page | no sideways scroll | 375 |

The rejected NAT layouts at 375: three columns 483px (scrolls); two full-pair columns 347px with 1px to spare.

### 4.3 Breakpoints

None new. The Lesson page's apply (phone layout below 761px). The new parts are in the SVG and scale with it. On a phone the Table tab takes its existing `.tab__mark` for every table event, `remove` included.

## 5. For the builder: every code change

1. **Drawing** (Appendix A, applied as it is).
   - `src/art/scenes/net-map-layers.ts`:
     - slot `N`;
     - kind `pc`;
     - `phone` in `NET_MAP_BASE_PLACES` (last);
     - `NET_MAP_OPTIONAL = ['phone']` and `NET_MAP_PHONE_ADDR`;
     - layers `ports:server` and `nat:stranger` (last).
   - `src/art/scenes/net-map.ts`: slot N, `PH`, `phone()`, the `pc` kind, the phone's place and its way, `HOME_LEG` in `route()`, the phone's groups and callout.
   - `src/art/figures/spots.ts`: `arpSpot`, `portsSpot`, `natSpot`, `SPOTS` and `DRAW`.
2. **One layer field.** Add `describe?: string` to `PlateBase`. Set it on `nat:stranger` to "Behind the internet, someone else’s computer, on another network." It draws nothing; the driver reads it (item 4).
3. **Parts** (`src/art/scenes/parts.ts`), net-map:
   - add cue `show: 'text'`;
   - add `args.show: NET_MAP_OPTIONAL`.
   - `places` already picks up `phone`, `server` and `stranger`.
4. **Driver** (`src/scenes/drivers/net-map.ts`).
   - **`MapState.shown`.** A new `Set<string>`, filled by a `show` cue (throw for an arg not in `NET_MAP_OPTIONAL`).
   - **`paint()`.** Each `[data-base]` gets `data-hidden` when `s.hidden.has(base) || (NET_MAP_OPTIONAL.includes(base) && !s.shown.has(base))`. Today's code clears `data-hidden` from every group that is not hidden; unchanged, it would show the phone on every lesson's map.
   - **`HOME`** gains `'phone'`, so the home lights flash for the phone's messages.
   - **`TABLE_MS`** gains `remove: 600`. `duration()` returns it for a `remove`. `add`, `update` and `clear` stay 0.
   - **The description.** While the phone is shown, the figure's description reads "your home: a laptop, a phone and their router." in place of "your home: a laptop and its router.". Each shown layer with `describe` adds its sentence at the end. Both are worked out with the resolver sentence, from the description as drawn.
   - **Lights.** The phone's and the stranger's glows are found by `bySite('busy', …)` as they are (`nm-busy-phone`, `nm-nat-busy-stranger`). No change.
5. **Validator** (`src/content/define.ts`, `checkCues` and the message checks).
   - `show` only in a scene's start, as `hide` is.
   - A message to or from `phone` needs `show phone` in the start.
   - A message to or from `stranger` needs `nat:stranger` in `scene.layers`; to or from `server`, `ports:server`.
6. **Engine** (`src/engine/tables.ts`, `markFor`). An `add` deletes `state.noMatch` and leaves `candidates` and `matches` as they are. Nothing else changes: marks still last one step (D10's E1).
7. **Cards** (`src/lib/figures.ts`). Add these lines to `FIGURES`:
   - `arp: () => spot('arp')`
   - `ports: () => spot('ports')`
   - `nat: () => spot('nat')`
8. **Pinned tests.**
   - **`net-map.test.ts`.** Before `withoutRouterParts`, remove whole every group that opens `<g data-base="phone" data-hidden="">`, `<g data-layer="ports:server"` or `<g data-layer="nat:stranger"`. Before hashing the data, drop every route whose from or to is `phone`, `server` or `stranger`. Then both hashes equal today's `EXPECTED`; checked on the patch.
   - **`net-map-layers.test.ts`.** The key list gains `'ports:server'` and `'nat:stranger'`, `SITES` gains `'server'` and `'stranger'`, and the slot check allows `'N'`.
   - **`figures.test.ts`.** `EXPECTED` gains `spot:arp`, `spot:ports` and `spot:nat`, recorded from the render, which equals the files (check 1).
9. **The count tests and track chain** move with the lessons, as B12b did for Router (S14 §5). They are not this spec's.

The lesson files are the authors', from §3.

## 6. The card art

Three spots in the family of OSI Model, Subnetting, DHCP, Firewalls and Router: 528 × 372 (`viewBox="36 44 528 372"`), drawn with the kit in `common.ts`, one lit part each (`data-lit` once). Each was looked at in the browser at 1300px wide and at the card's 168px, light and dark, beside Router's.

| Spot | Plate label | What it shows | Lit part | `lm-led on` |
|---|---|---|---|---|
| `arp` | WHO HAS 192.168.1.1? | A laptop at the front left, its screen reading WHO HAS?, sends three dotted waves across the plate. Three devices stand beyond them: a router at the back, a phone on its dock, a printer at the front right. The phone and the printer stay dark. | A card lifted off the router on its way back, engraved IS AT | 2 (the router's) |
| `ports` | ONE ADDRESS · MANY PORTS | One tall server on a plinth, a cable coming to its foot from the left edge. Its front is a column of four numbered doors, 22, 80, 443 and 3389, each with a light; 3389's is dark. | A packet halfway through door 80 | 3 |
| `nat` | PRIVATE IN · PUBLIC OUT | A home router in the middle, a laptop cabled to it and a phone on its dock behind, one cable out to the right edge. A dark tag over the laptop's cable reads 192.168.1.100; a dotted arc over the router joins it to the lit tag over the cable out. | The tag over the cable out, 198.51.100.23 | 3 |

**aria-labels** (in the files):
- ARP: "A laptop at the front sends dotted waves across the plate to three devices: a phone, a printer and a router. Only the router answers: a lit card rises from it, marked IS AT."
- Ports: "A tall server with four numbered doors down its front: 22, 80, 443 and 3389. A light beside the first three is on; 3389’s is dark. A lit packet is halfway through door 80."
- NAT: "A home router in the middle, with a laptop and a phone behind it and one cable out to the right. Over the laptop’s cable floats a tag with its private address, 192.168.1.100; over the cable out, a lit tag with the router’s public address, 198.51.100.23. A dotted arc joins them over the router."

**Choices.**
- **The ports are doors, not sockets.** Letterbox slots with numbers, never jacks: a port is not a hole in the case, and a socket-shaped port would teach that it is.
- **ARP shows three listeners**, where the scene has only the router. It is the outline's I-10 ("every device reads it; only the owner answers"), which ruling 3 leaves to words and Practice. A card may draw the idea the scene cannot.
- **The DHCP spot also has a laptop, a router and a floating lit tag.** ARP's differs in its waves, its three devices and a card that rises from the router rather than one arcing to the laptop. At 168px the two read apart.
- **Port 80 is the lit door**, not 443. Firewalls' spot already lights a packet marked 443.

## 7. Copy

Every word new to the site that this spec sets. Everything else in §3 is the outlines' placeholder text for the authors.

| Where | Words |
|---|---|
| Map: the phone's callout | Your phone · 192.168.1.101 |
| Map: the stranger's callout | Someone else · 192.0.2.66 |
| Map: engravings | ANOTHER NETWORK (stranger's plate); EXAMPLE.NET (Ports' plate) |
| Map: Ports' callout | A server · 203.0.113.80 |
| Figure description, phone shown | your home: a laptop, a phone and their router. |
| Figure description, stranger shown | Behind the internet, someone else’s computer, on another network. |
| ARP panel | ARP cache · kept by your laptop · IP address · MAC address · Empty. Nothing learned yet. |
| Ports panel | Listening ports · on example.net (203.0.113.80) · Port · Program · Nothing is listening. |
| NAT panel | NAT table · kept by your router, 198.51.100.23 outside · Inside · Outside port · Empty. Nothing has gone out yet. |
| Legends | ARP: Broadcast to everyone · Reply · Packet. Ports: Request · Reply · Reset. NAT: Packet · Reply. |
| Tags | WHO HAS? · IS AT · PACKET · SYN · SYN-ACK · RST · REPLY |
| Card plates | WHO HAS 192.168.1.1? · ONE ADDRESS · MANY PORTS · PRIVATE IN · PUBLIC OUT |
| Card text | WHO HAS? (laptop screen), IS AT (card), 22 · 80 · 443 · 3389 (doors), 192.168.1.100 · 198.51.100.23 (tags) |
| Card arias | §6 |

Sentence case throughout, and no time figures. The map's engravings, callout names and tags are in capitals, as everywhere on net-map.

## 8. Acceptance checks

Each can be turned into a test.

**The files, tag for tag**

1. For `arp`, `ports` and `nat`: `spot(kind) + '\n'` equals `readFileSync('prototypes/d11-<kind>-spot.svg', 'utf8')`, byte for byte.
2. For `phone`, `stranger` and `server`:
   - each file starts `<svg xmlns="http://www.w3.org/2000/svg" class="lm-svg nm" viewBox="-98 -60 685 378">` and ends `</svg>\n`;
   - what lies between equals the whole groups of `drawNetMap().svg` that open with the part's tag, joined in document order:
     - `<g data-base="phone" data-hidden="">`, 2 groups;
     - `<g data-layer="nat:stranger" display="none">`, 5 groups;
     - `<g data-layer="ports:server" display="none">`, 5 groups.
   - A balanced `<g>` scan finds them; `net-map.test.ts:withoutRouterParts` already walks groups this way.
3. With those groups removed, and the routes to or from `phone`, `server` and `stranger` dropped, `drawNetMap()` hashes to today's `EXPECTED.svg` and `EXPECTED.data`.
4. The viewBox is still `-98 -60 685 378`. Ids stay unique; the new ids are `nm-busy-phone`, `nm-nat-busy-stranger` and `nm-ports-busy-server`.

**Places and ways**

5. `routes['phone>router']` is `[[-55.5,93,3.2],[-66,83,2.6],[-74,71,14]]` and `routes['router>phone']` is its reverse.
6. `routes['stranger>router']` is 11 points: it starts at `[-32,-173,3]`, passes over two internet routers' tops (`[-28,-20,6.2]`, `[-30,26,6.2]`) and ends on your router's top `[-74,71,14]`, as the patch emits it.
7. `routes['laptop>server']` shares its first 13 points with `routes['laptop>web']`, through `[32,-24,6.2]`.

**Validator**

8. Each of these passes:
   - `show phone` in a start;
   - What is IP, Router and every checked lesson, unchanged.
9. Each of these fails:
   - `show phone` on an event;
   - `show resolver`;
   - `hide phone`;
   - a message to or from `phone` without `show phone`;
   - a message to or from `stranger` without the layer `nat:stranger`;
   - a message to or from `server` without the layer `ports:server`.

**Driver**

10. In What is IP's and Router's scenes, both phone groups have `data-hidden` at every position. In NAT's, neither has, at every position. Home's still copy draws no phone.
11. In NAT's scene the description contains "a laptop, a phone and their router" and ends with "Behind the internet, someone else’s computer, on another network." What is IP's description is unchanged.
12. A phone → router message lights the home lights. On a router → phone message, `#nm-busy-phone` is on when it lands and off after `clear()`.
13. `duration`:
    - a `remove` is 600 at 1× and 300 at 2×;
    - `add`, `update` and `clear` are 0;
    - `replace` is 600 and `match` 900, as before.
14. Play and show give the same settled figure under full and reduced motion, for every step of all three scenes.

**Engine and panel**

15. A step with `match key: ''` then `add`: after the `add`, no `tr.tpanel__nomatch`, and the added row is highlighted as new. A `match key: ''` alone still shows the no-match row (Router's step 5 is unchanged).
16. ARP:
    - after step 1's match: the empty text row, then the no-match row;
    - step 5 after its match: the empty text, then no-match;
    - step 5's end: one row, `data-highlight="added"`, no no-match row.
17. Ports:
    - step 4's end: three rows, then the no-match row;
    - step 5's end: four rows, TCP 3389 last, highlighted as matched.
18. NAT:
    - step 5's end: two rows (61023, 63847), then the no-match row;
    - after step 2's match, the 61023 row is highlighted.
19. At 375, in the Table tab, `scrollWidth ≤ clientWidth` at every step of all three, and the page has no sideways scroll.

**Log and figure**

20. Ports' step 4 adds two rows: a SYN (`request` glyph), then an RST (`control` glyph, source 203.0.113.80:3389). No LOST mark shows and no message is `blocked`.
21. NAT's step 5 adds exactly one row, from 192.0.2.66:51200. No message leaves the router in step 5. No DROPPED or LOST mark shows.
22. The legends list exactly §3's entries, in that order.
23. In NAT, no event in steps 3 to 5 carries a `status` cue (§2.4).

**Cards**

24. The track page shows ARP's, Ports' and NAT's spots at stops 6, 10 and 12 once each lesson is ready, with §6's aria-labels. `lessonFigure` does not throw for any of them.
25. Each spot has one `data-lit`. The `lm-led on` counts are arp 2, ports 3, nat 3.

## 9. What an outline asked for that the figure does not show

- **ARP:**
  - "Every device reads it; only the owner answers" (I-10) has only the router to answer, by ruling 3. The ring and the words say it; the card draws it.
  - "The packet waits" has no picture: the laptop has no tray. The status "Finding the router" and the words carry it.
- **Ports:**
  - Which app gets the answer: the status line names it ("SSH app: …"). There is no app badge.
  - Several open connections at once are not drawn: the table and the log carry them.
  - That the server sees the router's address stays in `deep-nat` (ruling 1).
  - A blocked port (no answer at all) needs a firewall on the map. It stays in Learn and Practice.
- **NAT:**
  - The Site column is dropped (§2.5).
  - The outline's statuses for steps 3 and 5 are dropped (§2.4).
  - The stop at your router has no mark (§2.6).

## 10. Open questions for the owner

1. **The stranger's words.** "Someone else" and ANOTHER NETWORK are mine. The outline says "a computer out on the internet". The author may want "Another computer" or the outline's words; it is a one-string change in `net-map-layers.ts`.
2. **ARP's times.** Steps 1 to 3 keep What is IP's 0.000s, 0.002s and 0.003s; steps 4 and 5 are "—". All dashes would match Router, Ports and NAT, and lose the agreement with What is IP's rows. Recommendation: as specified.
3. **The router's MAC on ARP's map** (§2.8). It shows the answer's value before the question. The reason it stays: the callout says what the router is, and the panel says what the laptop knows. The other way is `router: '192.168.1.1'` alone.
4. **Ports' map at step 4** is 316px tall at 1440, the smallest yet (Router's smallest is 349). It comes from three rows plus a no-match row, all needed. Accepting it needs no change.
5. **The phone's size.** It is drawn true to the laptop's scale (9 × 18 against 46 × 30), about 17 × 9px on a 375px phone. It reads as a phone with its callout beside it; drawing it bigger would put it over the router's lights.

## Appendix A. The patch

Applies to `job12/batch` at `a63c603` with `git apply`. It changes three files under `src/art/`, and its output is the six SVG files above. Items 2 to 8 of §5 are not in it.

```diff
diff --git a/src/art/figures/spots.ts b/src/art/figures/spots.ts
--- a/src/art/figures/spots.ts
+++ b/src/art/figures/spots.ts
@@ -208,10 +208,90 @@
   return figure("router", "ROUTING TABLE · NEXT HOP", out.join(""), "A round router where three cables meet, one coming in and two going out. A lit packet travels down one of the ways out. In front stands its routing table, three routes long, with the route it chose marked.");
 }
 
-export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router'] as const;
+// ---------- Lesson 06, ARP: the laptop asks everyone, and only the router answers ----------
+function arpSpot() {
+  const out = [], C = [-50, 4];
+  // The question, spreading over the plate from the laptop: three dotted waves, towards the devices at the back.
+  for (const r of [36, 62, 88]) {
+    const pts = [];
+    for (let i = 0; i <= 32; i++) {
+      const a = ((-80 + (110 * i) / 32) * Math.PI) / 180, x = C[0] + r * Math.cos(a), y = C[1] + r * Math.sin(a);
+      if (Math.abs(x) < 104 && Math.abs(y) < 66) pts.push(at([x, y, 0.4]));
+    }
+    out.push(L(k.pathOf(pts), { tone: "hi", dotted: true }));
+  }
+  // Three devices hear it: a phone on its dock and a printer, which stay dark, and the router, which answers.
+  const things = [];
+  const DK = { x: 74, y: -28, w: 28, d: 16, r: 3 }, PH = { x: 78, y: -25, w: 20, d: 3.4, r: 1.4 };
+  let ph = S(k.slabOf(DK, 0, 3, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam(DK, 1.2, P, 4), { tone: "faint" }) }) + S(k.slabOf(PH, 3, 38, P, 3, 0.5), { tone: "hi" });
+  ph += onFaceY(PH.y + PH.d, rect("lm-void", PH.x + 1.6, 6.4, PH.w - 3.2, 31, 1.2) + rect("lm-slot", PH.x + PH.w / 2 - 3, 38.6, 6, 1.2, 0.6));
+  things.push([DK.x + DK.w / 2, DK.y + DK.d / 2, ph]);
+  const PR = { x: 44, y: 20, w: 52, d: 38, r: 3 }, PZ = 18;
+  let pr = S(k.slabOf(PR, 0, PZ, P, 4, 0.6), { tone: "hi", inner: L(k.sideSeam(PR, 5, P, 4), { tone: "faint" }) });
+  pr += S(k.slabOf({ x: PR.x + 8, y: PR.y + 5, w: PR.w - 16, d: 16, r: 0.8 }, PZ, 1.6, P, 3, 0.3), { tone: "mid" }) + lines([[[PR.x + 12, PR.y + 28], [PR.x + PR.w - 12, PR.y + 28]]], PZ);
+  pr += onFaceY(PR.y + PR.d, rect("lm-slot", PR.x + 8, 9, PR.w - 16, 2.2, 1.1) + `<circle class="lm-led" cx="${n1(PR.x + PR.w - 7)}" cy="-4" r="1.2"/>`);
+  things.push([PR.x + PR.w / 2, PR.y + PR.d / 2, pr]);
+  things.push([16, -55, router({ x: -14, y: -70, w: 60, d: 30, r: 5 }, { lit: [0, 1] })]);
+  for (const [, , svg] of byDepth(things)) out.push(svg);
+  // The answer, lifted off the router on its way back to the laptop: the lit part.
+  const TG = { x: -6, y: -42, w: 34, d: 13, r: 2 }, TZ = 40;
+  out.push(`<path class="lm-shadow" d="${k.planOutline({ x: TG.x + 3, y: TG.y + 2, w: TG.w - 4, d: TG.d - 2, r: 3 }, 0, P, 4)}"/>`);
+  out.push(S(k.slabOf(TG, TZ, 2.4, P, 3, 0.5), { tone: "hi", lit: true }));
+  out.push(onTopAt(TZ + 2.4, `<text class="lm-tagt" x="${TG.x + 4}" y="${TG.y + 8.2}">IS AT</text>`));
+  // The laptop that asked, in front: its screen still waiting.
+  const lap = laptop({ x: -106, y: 2, w: 58, d: 38, r: 4 }, 34);
+  out.push(lap.svg, onFaceY(lap.face, rect("lm-void", lap.x0, lap.z0, lap.w, lap.h, 0.8) + `<text class="lm-addr" x="${n1(lap.x0 + 4)}" y="${n1(-(lap.z0 + lap.h - 6))}">WHO HAS?</text>`));
+  return figure("arp", "WHO HAS 192.168.1.1?", out.join(""), "A laptop at the front sends dotted waves across the plate to three devices: a phone, a printer and a router. Only the router answers: a lit card rises from it, marked IS AT.");
+}
+
+// ---------- Lesson 10, Ports: one server, a door for each program, a packet at one of them ----------
+function portsSpot() {
+  const out = [];
+  // The cable in from the left edge, along the floor to the server's foot.
+  out.push(tubeOf(tubePieces([[-112, 24, 1.6], [-28, 24, 1.6], [-28, -4, 1.6]], 1.9, P, { maxLength: 16 })));
+  // The server: one tall box, its front a column of numbered doors, a light beside each. A program listens behind
+  // every lit one; 3389’s is dark.
+  const B = { x: -40, y: -52, w: 84, d: 42, r: 2.4 }, BH = 78, F = B.y + B.d;
+  out.push(S(k.slabOf({ x: B.x - 3, y: B.y - 3, w: B.w + 6, d: B.d + 6, r: 3 }, 0, 2, P, 3, 0.4), { tone: "lo" }));
+  out.push(S(k.slabOf(B, 2, BH, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(B, BH - 3, P, 3), { tone: "faint" }) }));
+  out.push(lines([0, 1, 2, 3, 4].map((i) => [[B.x + 10, B.y + 8 + i * 6], [B.x + B.w - 10, B.y + 8 + i * 6]]), BH + 2));
+  let face = "";
+  ["22", "80", "443", "3389"].forEach((n, i) => {
+    const z = 64 - i * 15;
+    face += rect("lm-inlay", B.x + 5, z - 5, B.w - 10, 12, 1.6) + `<text class="lm-rule" x="${n1(B.x + 10)}" y="${n1(-(z - 0.2))}">${n}</text>` + rect("lm-slot", B.x + 30, z - 1.4, 36, 3.8, 1.4) + `<circle class="lm-led${i < 3 ? " on" : ""}" cx="${n1(B.x + B.w - 10)}" cy="${n1(-(z + 0.5))}" r="1.6"/>`;
+  });
+  out.push(onFaceY(F, face));
+  // A packet, half through the door marked 80: the lit part.
+  out.push(S(k.slabOf({ x: B.x + 34, y: F - 5, w: 28, d: 14, r: 1 }, 48, 3, P, 3, 0.4), { tone: "hi", lit: true }));
+  return figure("ports", "ONE ADDRESS · MANY PORTS", out.join(""), "A tall server with four numbered doors down its front: 22, 80, 443 and 3389. A light beside the first three is on; 3389’s is dark. A lit packet is halfway through door 80.");
+}
+
+// ---------- Lesson 12, NAT: the router swaps the inside address for its own on the way out ----------
+function natSpot() {
+  const out = [];
+  // The home side's cable from the laptop to the router's front, and the one way out, to the right edge.
+  out.push(tubeOf([[[-58, 24], [-4, 24], [-4, -4]], [[44, -22], [112, -22]]].flatMap((list) => tubePieces(list.map(([x, y]) => [x, y, 1.4]), 1.5, P, { maxLength: 16 }))));
+  // Two at home share it: a phone on its dock at the back, and the laptop.
+  const DK = { x: -96, y: -62, w: 22, d: 13, r: 3 }, PH = { x: -92.5, y: -59.4, w: 15, d: 2.8, r: 1.1 };
+  out.push(S(k.slabOf(DK, 0, 2.6, P, 4, 0.5), { tone: "mid" }), S(k.slabOf(PH, 2.6, 30, P, 3, 0.5), { tone: "hi" }), onFaceY(PH.y + PH.d, rect("lm-void", PH.x + 1.2, 5.4, PH.w - 2.4, 24.4, 1) + rect("lm-slot", PH.x + PH.w / 2 - 2, 30.6, 4, 1, 0.5)));
+  out.push(router({ x: -20, y: -40, w: 62, d: 34, r: 5 }, { lit: [0, 1, 2] }));
+  const lap = laptop({ x: -108, y: 6, w: 50, d: 34, r: 4 }, 30, { keysX: 7 });
+  out.push(lap.svg, onFaceY(lap.face, rect("lm-void", lap.x0, lap.z0, lap.w, lap.h, 0.8) + rect("lm-slot", lap.x0 + 3, lap.z0 + lap.h - 5, 18, 1.4, 0.7) + rect("lm-slot", lap.x0 + 3, lap.z0 + lap.h - 8.4, 26, 1.4, 0.7)));
+  // The swap, as a dotted arc over the router, from the inside address to the outside one.
+  const arc = []; for (let i = 0; i <= 24; i++) { const s = i / 24; arc.push([-20 + 78 * s, 11.5 - 40 * s, 27.4 + 16 * Math.sin(Math.PI * s)]); }
+  out.push(L(k.pathOf(arc.map(at)), { tone: "hi", dotted: true }));
+  const tag = (T, z, text, lit) => S(k.slabOf(T, z, 2.4, P, 3, 0.5), { tone: "hi", lit }) + onTopAt(z + 2.4, `<text class="${lit ? "lm-tagt" : "lm-pkt-t"}" x="${T.x + 3}" y="${T.y + 7.4}">${text}</text>`);
+  // Inside, over the laptop's cable: its private address. Outside, over the cable out: the router's public one, lit.
+  out.push(tag({ x: -56, y: 6, w: 36, d: 11, r: 2 }, 25, "192.168.1.100", false));
+  out.push(`<path class="lm-shadow" d="${k.planOutline({ x: 62, y: -30, w: 32, d: 9, r: 3 }, 0, P, 4)}"/>`);
+  out.push(tag({ x: 58, y: -34, w: 38, d: 11, r: 2 }, 25, "198.51.100.23", true));
+  return figure("nat", "PRIVATE IN · PUBLIC OUT", out.join(""), "A home router in the middle, with a laptop and a phone behind it and one cable out to the right. Over the laptop’s cable floats a tag with its private address, 192.168.1.100; over the cable out, a lit tag with the router’s public address, 198.51.100.23. A dotted arc joins them over the router.");
+}
+
+export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat'] as const;
 export type SpotKind = (typeof SPOTS)[number];
 
-const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot };
+const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot };
 
 /** A small figure, cropped close to its plate. */
 export const spot = (kind: SpotKind): string => DRAW[kind]();
diff --git a/src/art/scenes/net-map-layers.ts b/src/art/scenes/net-map-layers.ts
--- a/src/art/scenes/net-map-layers.ts
+++ b/src/art/scenes/net-map-layers.ts
@@ -11,8 +11,8 @@
 }
 
 interface PlateBase {
-  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it. */
-  slot: 'E' | 'SE';
+  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it, N for a small one behind the internet. */
+  slot: 'E' | 'SE' | 'N';
   /** The words engraved on the plate's front edge. */
   label: string;
   /** The callout under the plate, or where `at` puts it. */
@@ -35,6 +35,12 @@
       /** The callout points at the top of its rack, not the plate's front corner. */
       anchorTop?: boolean;
     })
+  | (PlateBase & {
+      kind: 'pc';
+      site: string;
+      /** The internet router its cable runs to. */
+      puck: 'a';
+    })
   | (PlateBase & { kind: 'names' });
 
 /** The root servers, the servers for .app, and the site's own name server, as the names plate draws them. */
@@ -46,9 +52,15 @@
 /** The laptop's address as the map draws it, before a unit's labels or an `addr` cue change it. */
 export const NET_MAP_LAPTOP_ADDR = '192.168.1.100';
 
-/** The places every protocol's map has: home (the laptop and its router), the resolver, and the internet's five routers. */
-export const NET_MAP_BASE_PLACES = ['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd'];
+/** The places every protocol's map has: home (the laptop, its router and the phone, which a unit shows), the resolver, and the internet's five routers. */
+export const NET_MAP_BASE_PLACES = ['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd', 'phone'];
 
+/** The parts of home the map leaves off until a unit's start shows them (`show phone`). */
+export const NET_MAP_OPTIONAL = ['phone'];
+
+/** The phone's address as the map draws it. */
+export const NET_MAP_PHONE_ADDR = '192.168.1.101';
+
 /** The internet's five routers, which a unit's labels may name on a strip and a `drop` cue may mark. */
 export const NET_MAP_ROUTERS = ['isp', 'a', 'b', 'c', 'd'];
 
@@ -125,4 +137,14 @@
   'ftp:files': host('files', 'FILES.EXAMPLE.NET', 'File server', '203.0.113.21 · port 21'),
   'ssh:host': host('host', 'SRV.EXAMPLE.NET', 'A server', '203.0.113.22 · port 22'),
   'tls:web': web('TECHCONCEPTS.APP', '198.51.100.7 · port 443'),
+  'ports:server': host('server', 'EXAMPLE.NET', 'A server', '203.0.113.80'),
+  'nat:stranger': {
+    kind: 'pc',
+    slot: 'N',
+    site: 'stranger',
+    puck: 'a',
+    label: 'ANOTHER NETWORK',
+    at: [420, -24],
+    lines: [line('nm-name', 'Someone else'), line('nm-addr', '192.0.2.66')],
+  },
 };
diff --git a/src/art/scenes/net-map.ts b/src/art/scenes/net-map.ts
--- a/src/art/scenes/net-map.ts
+++ b/src/art/scenes/net-map.ts
@@ -8,7 +8,7 @@
 // the parts. Its ids carry an `nm-` prefix, so they stay unique on the page.
 import type { DrawnFigure } from './types';
 import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
-import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_TAG_MAX } from './net-map-layers';
+import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_PHONE_ADDR, NET_MAP_TAG_MAX } from './net-map-layers';
 import './net-map.css';
 
 /** What the driver reads: the figure's camera, where the broadcast ring spreads, and every route along the cables. */
@@ -34,11 +34,13 @@
 const IP = { x: -52, y: -44, w: 104, d: 88, r: 9 };
 const HP = { x: -134, y: 57, w: 84, d: 70, r: 8 };
 const RP = { x: -118, y: -114, w: 64, d: 54, r: 7 };
-// Places for the servers on the right: E for one big plate, NE and SE for two smaller ones.
-const SLOT = { E: { x: 50, y: -127, w: 84, d: 70, r: 8 }, NE: { x: -30, y: -200, w: 64, d: 54, r: 7 }, SE: { x: 140, y: -26, w: 64, d: 54, r: 7 } };
+// Places for the servers on the right: E for one big plate, NE and SE for two smaller ones; N for a small one behind the internet.
+const SLOT = { E: { x: 50, y: -127, w: 84, d: 70, r: 8 }, NE: { x: -30, y: -200, w: 64, d: 54, r: 7 }, SE: { x: 140, y: -26, w: 64, d: 54, r: 7 }, N: { x: -84, y: -196, w: 56, d: 40, r: 6 } };
 const LB = { x: -127, y: 88, w: 46, d: 30, r: 3.5 }, LZ = 3.2, LID_H = 31;
 const HR = { x: -90, y: 62, w: 32, d: 18, r: 3 }, RZ = 2, RT = RZ + 9;
 const PUCK_R = 7, PUCK_H = 4.6;
+// The phone, lying on the table at home in front of the router: on the home Wi-Fi, so no cable.
+const PH = { x: -60, y: 84, w: 9, d: 18, r: 1.8 }, PH_Z = 2.2;
 const N = { isp: [-30, 26], a: [-28, -20], b: [6, 4], c: [32, -24], d: [28, 26] };
 const LINKS = [["isp", "a"], ["isp", "b"], ["isp", "d"], ["a", "b"], ["b", "c"], ["b", "d"], ["c", "d"]];
 const CB = { x: -104, y: -106, w: 34, d: 26, r: 2 }, CB_H = 28, DRAWERS = [2.4, 10.4, 18.4], DRW_H = 6.8, DRW_OUT = 11;
@@ -113,6 +115,19 @@
   return out.join("");
 }
 
+// The phone, flat on the home plate, its screen up: a speaker slot at the top end, a few lines of a page, and the
+// screen's light while it sends or receives. Drawn on its top, where a (u, v) is the world's (x, y).
+const flat = (cls, x, y, w, d, rx, extra = "") => `<rect class="${cls}" x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(d)}" rx="${rx}"${extra}/>`;
+function phone(id) {
+  const out = [S(k.slabOf(PH, 0, PH_Z, P, 4, 0.6), { tone: "hi", inner: L(k.sideSeam(PH, 1, P, 4), { tone: "faint" }) })];
+  const x0 = PH.x + 1.1, y0 = PH.y + 2.4, w = PH.w - 2.2, d = PH.d - 4.8;
+  let top = flat("lm-void", x0, y0, w, d, 0.8) + flat("nm-glow", x0, y0, w, d, 0.8, ` id="${id}-busy-phone"`);
+  top += flat("lm-slot", PH.x + PH.w / 2 - 1.7, PH.y + 0.9, 3.4, 0.7, 0.35);
+  for (let i = 0; i < 3; i++) top += flat("lm-slot", x0 + 1.2, y0 + 2.2 + i * 2.6, w - 2.4 - (i === 2 ? 2 : 0), 0.9, 0.45);
+  out.push(onTopAt(PH_Z, top));
+  return out.join("");
+}
+
 // ---------- The internet: routers that pass messages along ----------
 function puck([x, y], name) {
   const out = [];
@@ -196,6 +211,8 @@
   laptop: { end: [LB.x + LB.w - 4, LB.y + 18, LZ + 1], leg: [[...LAP_OUT, RIDE], [...HR_IN, RIDE], [HR.x + HR.w / 2, HR.y + HR.d / 2, RT + 3], [...HR_OUT, RIDE]], puck: "isp" },
   router: { end: [HR.x + HR.w / 2, HR.y + HR.d / 2, RT + 3], leg: [[...HR_OUT, RIDE]], puck: "isp" },
   resolver: { end: [CB.x + CB.w - 2, CB.y + 18, 4], leg: [[...DNS_IN, RIDE]], puck: "a" },
+  // The phone's way to the router is through the air: across the plate to the router's front, then over it.
+  phone: { end: [PH.x + PH.w / 2, PH.y + PH.d / 2, PH_Z + 1], leg: [[HR.x + HR.w - 8, HR.y + HR.d + 3, RIDE], [HR.x + HR.w / 2, HR.y + HR.d / 2, RT + 3], [...HR_OUT, RIDE]], puck: "isp" },
   // The routers themselves, by their names in N: a message can stop on top of one (traceroute, NAT).
   ...Object.fromEntries(Object.keys(N).map((n) => [n, { puck: n, router: true }])),
 };
@@ -219,14 +236,16 @@
   return pts;
 }
 // From one place to another along the cables, hopping over every router between. The home router is a place too:
-// messages to it from the laptop stay at home.
+// messages to it from the laptop or the phone stay at home, as far as its top (the first points of their way out).
+const HOME_LEG = { laptop: 3, phone: 2 };
 function route(sites, from, to) {
   const A = sites[from], B = sites[to];
   if (!A || !B) throw new Error(`no route ${from} → ${to}`);
   let pts;
-  if ((from === "laptop" && to === "router") || (from === "router" && to === "laptop")) {
-    const L0 = BASE_SITES.laptop, out = [L0.end, ...L0.leg.slice(0, 3)];
-    pts = from === "laptop" ? out : [...out].reverse();
+  const own = from === "router" ? to : from;
+  if (Object.hasOwn(HOME_LEG, own) && (from === "router" || to === "router")) {
+    const L0 = BASE_SITES[own], out = [L0.end, ...L0.leg.slice(0, HOME_LEG[own])];
+    pts = from === own ? out : [...out].reverse();
   } else {
     const mid = A.puck === B.puck ? [A.puck] : hops(A.puck, B.puck);
     const head = A.router ? [] : [A.end, ...A.leg], tail = B.router ? [] : [...[...B.leg].reverse(), B.end];
@@ -281,6 +300,31 @@
       tall: [[R.x, R.y, R.h]],
     };
   },
+  // Someone else's computer, on a small plate of its own: a screen on a stand, a keyboard, and a box the cable runs to.
+  pc(p, id, o) {
+    const SCR = rel(p, { x: 5, y: 9, w: 24, d: 2.4, r: 0.8 }), FOOT = rel(p, { x: 11, y: 5, w: 12, d: 8, r: 1 }), KB = rel(p, { x: 6, y: 17, w: 22, d: 7, r: 0.8 });
+    const BOX = rel(p, { x: 42, y: 5, w: 7, d: 16, r: 1 }), SZ = 5, SH = 14, BH = 18;
+    // The cable leaves by the plate's right-hand edge, clear of the words engraved on its front.
+    const F = [BOX.x + BOX.w + 3, BOX.y + BOX.d / 2], IN = [p.x + p.w + 3, F[1]];
+    let screen = S(k.slabOf(FOOT, 0, 1.2, P, 3, 0.4), { tone: "mid" }) + S(k.cylinder(FOOT.x + FOOT.w / 2, SCR.y - 1.5, 1.1, 1.2, SZ - 1.2, P, 16), { tone: "mid" });
+    screen += S(k.slabOf(SCR, SZ, SH, P, 3, 0.5), { tone: "hi" });
+    const x0 = SCR.x + 1.6, w = SCR.w - 3.2, z0 = SZ + 1.6, h = SH - 3.2;
+    let face = rect("lm-void", x0, z0, w, h, 0.8) + rect("nm-glow", x0, z0, w, h, 0.8, ` id="${id}-busy-${o.site}"`);
+    for (let i = 0; i < 3; i++) face += rect("lm-slot", x0 + 2, z0 + h - 3 - i * 2.8, w - 4 - (i === 2 ? 6 : 0), 1.2, 0.6);
+    screen += onFaceY(SCR.y + SCR.d, face);
+    let keys = "";
+    for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) keys += k.planOutline({ x: KB.x + 1.5 + c * 2.8, y: KB.y + 1.2 + r * 2.6, w: 2.2, d: 2, r: 0.4 }, 1.4, P, 3);
+    const kb = S(k.slabOf(KB, 0, 1.4, P, 3, 0.4), { tone: "hi" }) + L(keys, { tone: "lo" });
+    let box = S(k.slabOf(BOX, 0, BH, P, 3, 0.5), { tone: "hi", inner: L(k.sideSeam(BOX, 3, P, 3), { tone: "faint" }) });
+    box += onFaceY(BOX.y + BOX.d, rect("lm-slot", BOX.x + 1.6, BH - 4, BOX.w - 3.2, 1.4, 0.6) + rect("lm-slot", BOX.x + 1.6, BH - 6.6, BOX.w - 3.2, 1.4, 0.6) + `<circle class="lm-led on" cx="${n1(BOX.x + BOX.w / 2)}" cy="${n1(-4.4)}" r="0.9"/>`);
+    return {
+      things: [{ xy: [SCR.x + SCR.w / 2, SCR.y], svg: screen }, { xy: [KB.x + KB.w / 2, KB.y + KB.d / 2], svg: kb }, { xy: [BOX.x + BOX.w / 2, BOX.y + BOX.d / 2], svg: box }],
+      cables: [[N[o.puck], IN, F]],
+      sites: { [o.site]: { end: [F[0], BOX.y + BOX.d + 2, 3], leg: [[...F, RIDE], [...IN, RIDE]], puck: o.puck } },
+      callouts: [callTo(o, [SCR.x + SCR.w, SCR.y, SZ + SH])],
+      tall: [[SCR.x, SCR.y, SZ + SH], [BOX.x, BOX.y, BH]],
+    };
+  },
   // Any other server: two racks, and a pad at the front that lights while it works.
   host(p, id, o) {
     const racks = [rel(p, { x: p.w - 58, y: 6, w: 24, d: 26, r: 2, h: 40 }), rel(p, { x: p.w - 30, y: 4, w: 24, d: 30, r: 2, h: 46 })];
@@ -334,6 +378,9 @@
 }).join("") + `</g>`;
 // The resolver is left off the map for a unit that starts with `hide resolver`: each of its parts sits in a group the driver can hide.
 const resolverPart = (svg) => `<g data-base="resolver">${svg}</g>`;
+// The phone is drawn hidden, and shown for a unit that starts with `show phone`.
+const phonePart = (svg) => `<g data-base="phone" data-hidden="">${svg}</g>`;
+const PHONE_CALL = { anchor: [PH.x + PH.w, PH.y + PH.d, PH_Z], at: [70, 196], lines: [{ cls: "nm-name", text: "Your phone" }, { cls: "nm-addr", text: NET_MAP_PHONE_ADDR }] };
 
 // ---------- The parts every protocol shares: home, the internet, the resolver ----------
 function buildBase() {
@@ -342,6 +389,7 @@
   const things = [
     { xy: [LB.x + LB.w / 2, LB.y + LB.d / 2], svg: laptop(ID, "") }, { xy: [HR.x + HR.w / 2, HR.y + HR.d / 2], svg: homeRouter(ID) },
     ...Object.entries(N).map(([n, xy]) => ({ xy, svg: puck(xy, n) })), { xy: [CB.x + CB.w / 2, CB.y + CB.d / 2], svg: resolverPart(cabinet(ID)) },
+    { xy: [PH.x + PH.w / 2, PH.y + PH.d / 2], svg: phonePart(phone(ID)) },
   ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
   const pts = [RP, HP, IP].flatMap((p) => k.boxCorners(p, FLOOR, 0)).concat([[CB.x, CB.y, CB_H], [HR.x + 5, HR.y + 4, RT + 22]]).map(at);
   return {
@@ -382,7 +430,7 @@
   const base = buildBase();
   const layers = Object.entries(NET_MAP_LAYERS).map(([key, s]) => serverLayer(key, s));
   const boxes = [], calls = baseCallouts().map((c) => calloutSvg(c, boxes));
-  const shared = `${calls[0]}${resolverPart(calls[1])}${calls[2]}<g id="${ID}-router" display="none">${calls[3]}</g>`;
+  const shared = `${calls[0]}${resolverPart(calls[1])}${calls[2]}<g id="${ID}-router" display="none">${calls[3]}</g>${phonePart(calloutSvg(PHONE_CALL, boxes))}`;
   // One frame for every protocol, so the map never jumps in size between them: everything any of them shows.
   const pts = [...base.pts, ...boxes.flatMap(([x0, y0, x1, y1]) => [[x0, y0], [x1, y1]]), ...layers.flatMap((l) => l.pts), ...[SLOT.E, SLOT.SE].flatMap((p) => k.boxCorners(p, FLOOR, 0)).map(at)];
   const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]), PAD = 18;
```

## 11. The orchestrator's rulings on §10 (2026-11-14; no design gate for this batch, direction 2.52)

1. The stranger's words stay as drawn ("Someone else", ANOTHER NETWORK); the author may change the one string through an erratum if the outline's words read better.
2. ARP's times as specified (What is IP's for steps 1 to 3, dashes for 4 and 5).
3. The router's MAC stays on ARP's callout.
4. Ports' 316px map at step 4 is accepted.
5. The phone is drawn true to scale.
