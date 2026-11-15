# D12: IP Address, MAC Address and TCP/UDP, the scenes and the card art (job 13, batch 2)

The spec for three new Networking Concepts lessons: **IP Address** (`ip-address`, stop 3), **MAC Address** (`mac-address`, stop 4) and **TCP/UDP** (`tcp-udp`, stop 11). It covers each lesson's Watch scene, its panel, its log and its card art. It is for the design gate (direction 2.57): the owner approves the prototype, then one builder builds all three.

| File | What it is |
|---|---|
| `prototypes/d12-batch-2.html` | The clickable prototype: the three Lesson pages playing step by step, and the card art on the track's route. One self-contained file (1.5 MB: styles, fonts, figures and script inline; it loads nothing). |
| `prototypes/d12-ip-address-spot.svg` | `spot('ip-address')`, IP Address's card art |
| `prototypes/d12-mac-address-spot.svg` | `spot('mac-address')`, MAC Address's card art |
| `prototypes/d12-tcp-udp-spot.svg` | `spot('tcp-udp')`, TCP/UDP's card art |
| `prototypes/d12-part-frames.svg` | dhcp's new parts: its two `<g data-setup="frames" display="none">` groups (the TV, the frames callouts) and the tags `FRAME` and `TO ALL` |
| `prototypes/d12-part-voice.svg` | net-map's new layer `tcp-udp:voice`: its five `<g data-layer="tcp-udp:voice" display="none">` groups |

The code that emits the five SVG files is the patch in Appendix A. It applies cleanly to `job13/batch` at `7a679eb` (`git apply --check` passes), and the files were generated from it. The SVGs carry classes and CSS variables, not colours: they render properly only inside a page that loads the site's CSS and the shared defs.

**How to use the prototype.** The tab at the right edge ("D12 prototype") opens the switches: lesson (IP, MAC, TCP/UDP), page (Lesson, Card art), the two variants (§2.1, §2.2), theme and motion. Everything else is the Lesson page: the outline, Play, the step arrows, the speed, the phone tabs. A query string opens a state directly, for example `?lesson=mac&step=3&play=1&tab=table&theme=dark`.

The prototype's figures are the patch's drawings, and its moves copy the drivers' (`subnet.ts`, `dhcp.ts`, `net-map.ts`) with the changes in §5. Its Learn and Practice are stubs: they keep the page as built.

The stories are the analysts' (`.superpowers/analysis/{ip-address,mac-address,tcp-udp}/report.md` §2 and their Rulings). Step titles, narratives, facts, statuses, table cells and log info are the outlines' words, used as placeholders the authors will set, except where §7 marks words as design copy.

One variant a scene. Two places fork into two variants, each behind a switch: the Bits tab on a phone (§2.1) and TCP/UDP's table (§2.2).

## 1. What changes and what stays

**Stays.**
- The Lesson page as built (direction §7): layout, console, stage, log, phone tabs, the table panel and the bits board's look.
- The subnet figure, untouched: IP Address reuses Subnetting's office as drawn (its ruling).
- The dhcp figure as DHCP shows it: every new dhcp part is hidden unless a scene's start asks for it (`frames`). With the new groups removed and the `addresses` wrappers unwrapped, `drawDhcp()` is byte for byte today's (checked).
- The net-map drawing and its frame (`viewBox="-98 -60 685 378"`). The voice plate is hidden unless a unit lists its layer.
- Every existing spot and card.

**Changes.**

| What | For | Where |
|---|---|---|
| A **frames setup** on the dhcp plate: a TV where the lease board stands, the lease board and its cable gone, the laptop online (192.168.1.100) from the start, and a callout for each device with its MAC address and what it did with the frame in the air. Turned on by a new start cue, `frames`. | MAC | dhcp art, CSS, parts, driver, validator |
| In the frames setup, **every frame rings**: the ring starts at whoever sends it (the laptop or the router) and each device shows "Hears it" as the ring reaches it. | MAC | dhcp driver |
| **The two halves** of the laptop's MAC address: brackets and the words "OUI" and "this card" under it, the first half in the accent, while the frames table's laptop row is matched. | MAC | dhcp art, CSS, driver |
| Two tags, `FRAME` and `TO ALL` | MAC | dhcp art |
| A new layer `tcp-udp:voice`: a voice server on a small plate in slot N, behind the internet (a new plate kind, `call`), cabled to router a. | TCP/UDP | net-map art, layers |
| The bits board **fits a phone** (variant B, recommended): label and address on one line, the bits under them in 8px cells. | IP (and Subnetting) | `bits.css` |
| Three spots: `ip-address`, `mac-address`, `tcp-udp` | cards | `spots.ts`, `figures.ts` |

## 2. Gaps decided

### 2.1 IP: the Bits tab on a phone (two variants)

The board is 94 + 376 + about 120px wide. On a 375px phone the Bits tab scrolls sideways today (Subnetting: 404px of content in 375); IP's 255.255.255.255 row makes it 608px.

- **A. As built.** Nothing changes; the tab scrolls sideways, as Subnetting's does (direction §7 lists it as known).
- **B. Fitted (recommended).** Under 640px each row becomes two lines: the label at the left and the address at the right, then the 32 bits in 8px cells (four groups of 8 with 1px between cells and 6px between groups: 302px). The tab is 375px wide and does not scroll. The marigold line's place is worked out from the cell width, so Subnetting's line still falls between the right bits.

B buys a board a phone reads without a sideways drag, for Subnetting too. A buys no change to Subnetting's approved board. The CSS is in §5, item 6. At 640px and over the board is unchanged.

### 2.2 TCP/UDP: the table (two variants)

- **A. Side by side (recommended).** "What your laptop got": three rows keyed by piece, columns **Piece**, **Page, over TCP**, **Sam’s voice, over UDP**. Row 2 ends reading "Arrived, sent again" beside "Lost": the lesson's point in one line. No row carries a miss mark (one row holds both lanes, so a mark on piece 2 would sit beside "Arrived, sent again"); the cells' words say it. At 1440 × 900 the map keeps 347px.
- **B. A row a piece (the outline's).** Six rows (Page 1–3, Sam 1–3), columns **Piece**, **Over**, **Status**; Page 2 and Sam 2 added with `miss`. At 1440 × 900 the map drops to 258px at the end, the smallest on the site.

### 2.3 MAC: the figure without leases (the outline's flag 6)

A scene start cue `frames` (a flag, start only). It is a figure option, not a second figure: same plate, same camera, same frame. What it does is in §3.2. The phone keeps its place; the TV stands where the lease board does, so the frame (`viewBox="-73 -30 668 318"`) does not move.

### 2.4 MAC: who keeps the frame, on the figure and in the table

- **On the figure.** Each callout's third line is a verdict: a small square, then the words. Sent it (ink square), Hears it (dashed outline), Keeps it (filled in the allowed green, words bold), Ignores it (outline with a slash, muted). "—" hides the line. A device that keeps the frame also keeps its light on: the laptop's, phone's and TV's screen glow, the router's three lights.
- **The words come from the table.** The driver paints each verdict from the "Who keeps the frame" table's **This frame** cell. During a ride it shows "Sent it" on the sender at once and "Hears it" on each other device as the ring reaches it; the table's updates then land with the step's words.
- **The table stays.** On a 375px phone the verdicts are 7px tall (as every dhcp callout is); the table says them in words at full size. It also keeps the page's rule: what the figure shows, a table says.

### 2.5 MAC: one ring for every frame

The outline asked for the ring on a frame to one device, softer if need be. It is the same ring: Wi-Fi is radio, and a frame to one device reaches every device in range exactly as a broadcast does. What differs is what each device does next, and the verdicts show that. The ring starts at the sender: the laptop in step 1, the router in steps 4 and 5 (the outline's flag 4; no fallback needed).

### 2.6 MAC: the two halves are a table match, not a cue

Table events carry no cues, so step 3's `match` on the laptop's row is what the driver reads: while the frames table's highlight is the laptop's MAC address, the figure has `data-split`. It shows the brackets and words in place of the laptop's verdict line, and colours `00:00:5E` in the accent. The match lasts the step, so the split does.

### 2.7 TCP/UDP: the voice server's place

Option B of the outline (two plates, both layers for the whole unit): `tcp-udp:voice`, kind `call`, slot **N**, site **voice**, engraved CALL.EXAMPLE.NET. Not SE: a plate there sits under `tcp:web`'s callout at (396, 234) (seen in the render). Slot N is behind the internet, cabled to router a, and leaves the frame as it is. Its callout ends at (290, −22), left of the plate: "Voice server / 203.0.113.90 · port 16384".

### 2.8 IP: kinds in the log

The log is titled **Addresses**, with columns **Address** (230px, strong), **Kind** (160px, strong) and **In plain words**. One row per note; the 375px log shows them as cards, as Subnetting's does. No second panel.

### 2.9 IP: the board's third row and its labels

- The third row stays `mode: 'cmp'`. With `prefix: null` it has no marks and reads as a second address (looked at in both themes).
- Labels fit the 84px the label column leaves at 13px: Sales laptop (71), Printer (38), Router, inside (77), Router, link (63), Loopback (56), No address (65), Everyone here (81). The outline's "Office router, inside" (136) and "Laptop, no address yet" would end in an ellipsis.

### 2.10 Also decided

- **MAC's views:** `['network']` only. No views group, so on a phone the stage's head goes, as Subnetting's does.
- **TCP/UDP's views:** `['network', 'sequence']`. The sequence view is built as today; the prototype shows its button only.
- **MAC's log times:** dashes, like the sizes (§10, question 5).
- **TCP/UDP's log:** the internet lessons' widths (`eventLog`: source and destination 176px, size 76px), so `192.168.1.100:50422` fits.
- **TCP/UDP's start:** `hide resolver`. Labels: laptop "Wants a page, then a call", url "example.net".
- **The page** shows on the laptop's screen (`page: 'text'`) from step 3's last ACK, and stays.
- **The TCP line** (`conn open laptop>web`) stays lit through the UDP steps: the connection is still open.
- **IP's router callout** keeps Subnetting's "the way out of each network", as drawn (the ruling reuses the office as drawn).

## 3. The scenes and their steps

Every event in order. "Lights" is what the figure shows when the event lands. Words in quotes are the outlines' placeholders unless §7 lists them.

### 3.1 IP Address

`figure: 'subnet'`, `panel: { type: 'bits' }`, views `['network']`, scene title "The office’s addresses". Every event is a note. Glyph `request` unless named.

| Step | Note's cues | Board (row 1 / row 3) | Log: Address · Kind · In plain words |
|---|---|---|---|
| 1 Four numbers, 32 bits | glow laptop, focus sales | Sales laptop 192.168.1.10 / — | 192.168.1.10 · — · Four octets, 32 bits |
| 2 Private: inside the office | focus sales, pulse onenet | Sales laptop 192.168.1.10 / Printer 192.168.1.20 | 192.168.1.10 · private · In 192.168.0.0/16 |
| | focus sales, pulse onenet | same | 192.168.1.20 · private · Same network, 192.168.1.0/24 |
| 3 One router, two addresses | focus router | Router, inside 192.168.1.1 / Router, link 203.0.113.6 | 192.168.1.1 · private · The router’s inside address |
| | route link, busy provider, focus provider; glyph `response` | same | 203.0.113.6 · public (an example) · Toward the provider, 203.0.113.5 |
| 4 Loopback: 127.0.0.1 | glow laptop, focus sales | Sales laptop 192.168.1.10 / Loopback 127.0.0.1 | 127.0.0.1 · special: loopback · Stays inside the laptop |
| 5 No address yet: 0.0.0.0 to everyone | ring all; glyph `broadcast` | No address 0.0.0.0 / Everyone here 255.255.255.255 | 0.0.0.0 → 255.255.255.255 · special · Everyone on this network |

- Every board has `prefix: null`. The caption reads "32 bits, in four groups of 8"; before step 1, "The Sales laptop’s address appears here in step 1". Row 2 stays empty and keeps its place.
- The figure clears after each note, so a step's settled figure is plain (as Subnetting's).
- Legend: `request` Address read · `response` Sent · `broadcast` Broadcast. Idle: "No address read yet. Press Play, or pick a step."

### 3.2 MAC Address

`figure: 'dhcp'`, `scene.start: [{ cue: 'frames' }]`, `panel: { type: 'table' }`, views `['network']`, scene title "One frame on a home Wi-Fi".

**The frames setup** (the start cue, at every position): the TV and the frames callouts shown; the lease board, its cable and DHCP's four callouts hidden; the laptop's screen shows 192.168.1.100 and never "NO IP YET". Callouts: Router 00:00:5E:00:53:01 · Laptop 00:00:5E:00:53:10 · Phone 00:00:5E:00:53:11 · TV 00:00:5E:00:53:12, each with its verdict line.

**The table** `frames`: title "Who keeps the frame", by "each device decides for itself", key `mac`. Columns **Device** (prose), **MAC address**, **This frame** (prose). Initial rows: Router, Laptop, Phone, TV, each "—".

| Step | Events | Lights when the step ends | This frame (Router · Laptop · Phone · TV) |
|---|---|---|---|
| 1 Everyone hears it | message laptop → router, `FRAME`, `request`; ring from the laptop; then 4 updates | router, phone, TV: Hears it, no glow | Hears it · Sent it · Hears it · Hears it |
| 2 Only the match keeps it | 3 updates | router: Keeps it, lights on; phone, TV: Ignores it | Keeps it · Sent it · Ignores it · Ignores it |
| 3 Two halves | `match` key 00:00:5E:00:53:10 | the laptop's address split: 00:00:5E (accent) · OUI, 00:53:10 · this card; laptop row highlighted | unchanged |
| 4 To everyone | message router → laptop, `TO ALL`, `broadcast`; ring from the router; 4 updates | laptop, phone, TV: Keeps it, glows on | Sent it · Keeps it · Keeps it · Keeps it |
| 5 A new frame from the router | message router → laptop, `FRAME`, `response`; ring from the router; 4 updates | laptop: Keeps it, glow on; phone, TV: Ignores it | Sent it · Keeps it · Ignores it · Ignores it |

- **Log** (the standard columns, DHCP's widths): Time "—", Source and Destination MAC addresses, Protocol Wi-Fi, Info as the outline, Size "—".
  1. 00:00:5E:00:53:10 → 00:00:5E:00:53:01 · "Frame to 00:00:5E:00:53:01 (the router), carrying a packet for example.net"
  2. 00:00:5E:00:53:01 → ff:ff:ff:ff:ff:ff · "Frame to ff:ff:ff:ff:ff:ff (everyone)"
  3. 00:00:5E:00:53:01 → 00:00:5E:00:53:10 · "Frame to 00:00:5E:00:53:10 (the laptop), carrying example.net’s reply"
- Legend: `request` Frame to one device · `broadcast` Frame to everyone · `response` Frame back to the laptop.
- **During a ride:** the sender's verdict "Sent it" and its light on at once; every other verdict hidden; each other device "Hears it", and its light on, once the ring's radius passes its distance from the sender (plate units, `ringMax` 230):

| From | Router | Laptop | Phone | TV |
|---|---|---|---|---|
| the laptop (−67, 23) | 91.2 (k 0.40) | — | 133.5 (0.58) | 157.3 (0.68) |
| the router (−11, −49) | — | 91.2 (0.40) | 113.7 (0.49) | 77.2 (0.34) |

  Under reduced motion the ring does not spread and every device shows "Hears it" at once. The tag rides the arc as DHCP's do (laptop to router, or back).

### 3.3 TCP/UDP

`figure: 'net-map'`, layers `['tcp:web', 'tcp-udp:voice']`, `start: [{ cue: 'hide', arg: 'resolver' }]`, labels `laptop: 'Wants a page, then a call'`, `url: 'example.net'`, views `['network', 'sequence']`, scene title "A page, then a call". Every message carries `over` (`TCP` or `UDP`), shown under its tag. Times and sizes "—".

| Step | Message (tag · from → to) | Cues on it | Table (A, side by side) |
|---|---|---|---|
| 1 | SYN · laptop → web | status "Saying hello" | |
| | SYN-ACK · web → laptop | | |
| | ACK · laptop → web | conn open laptop>web; status "Connected", status-known | |
| 2 | REQUEST · laptop → web | | |
| | PIECE 1 · web → laptop | | add 1: Arrived · — |
| | PIECE 2 · web → laptop, dropped, `dropAt` 0.55 | | |
| | PIECE 3 · web → laptop | status "Piece 2 is missing" | add 2: Missing · —; add 3: Arrived, waiting · — |
| | ACK · laptop → web | | |
| 3 | PIECE 2 · web → laptop | | update 2: Arrived, sent again; update 3: Arrived |
| | ACK · laptop → web | status "Page complete", status-done; page text | |
| 4 | VOICE 1 · laptop → voice | url "Call"; status "In a call with Sam", status-known | |
| | SAM 1 · voice → laptop | | update 1: Sam Arrived |
| 5 | SAM 2 · voice → laptop, dropped, `dropAt` 0.5 | | update 2: Sam Lost |
| | SAM 3 · voice → laptop | status "Talking, one packet lost" | update 3: Sam Arrived, played at once |

- Ports: the laptop 192.168.1.100:50422 to 203.0.113.80:80 over TCP; 192.168.1.100:50900 to 203.0.113.90:16384 over UDP.
- Log Info is the outline's, word for word. A dropped row has the `dropped` glyph and the flag "Dropped" before its info.
- Legend: `request` Sent by your laptop · `response` Sent to your laptop · `dropped` Lost on the way.
- Table (A) `arrived`: title "What your laptop got", by "the page over TCP, then Sam’s voice over UDP", key `piece`, columns **Piece**, **Page, over TCP** (prose), **Sam’s voice, over UDP** (prose), empty "Nothing yet.". Variant B is the outline's six rows (§2.2).
- The LOST mark shows during a drop's play only, as built.

## 4. Sizes, spacing and breakpoints

### 4.1 The figures (SVG units, drawn at build time)

The numbers are the patch's (Appendix A).

**The TV** (dhcp, frames setup)
- Panel `{ x: 40, y: −64, w: 50, d: 3, r: 1 }`, from z 7 to 37, tone `hi`, on a neck 6 × 2.2 (z 1.6 to 7) and a foot `{ x: 55, y: −70, w: 20, d: 13, r: 2 }` 1.6 high.
- Screen: inset 1.8 at the sides, from z 9.6, 25.6 high, `lm-void` with its glow `#dh-tv-glow` over it; two slots 14 and 22 long, 1.6 thick; one light on at the right foot of the panel.
- Its place, where the ring reaches it: (65, −62.5).

**The frames callouts** (dhcp)
- Router's first line at (290, 0), TV's at (440, 66), Phone's at (432, 206), Laptop's ending at (72, 44). Lines 16 apart: name, MAC address, verdict.
- Verdict: a square 8 × 8 (radius 1), its top 9 above the baseline, then the words 12 after the square's left edge (or before its right edge, on the laptop's callout, which ends at its x). Words 13px sans, muted; Keeps it bold in `--allowed-text`.
- The split: two brackets 56 wide, 3 deep, 4 under the baseline, centred under each half (a character is 7.5 wide); "OUI" and "this card" 18 under the baseline, 13px sans, muted, centred.

**The ring** (dhcp): as DHCP's, `ringMax` 230, its centre moved to the sender's place: laptop (−67, 23), router (−11, −49).

**Slot N and the `call` kind** (net-map, `tcp-udp:voice`)
- Slot N as drawn for NAT: `{ x: −84, y: −196, w: 56, d: 40, r: 6 }`, engraved CALL.EXAMPLE.NET.
- Rack `{ x: −53, y: −191, w: 19, d: 17, r: 2 }`, 26 high, two units.
- Pad `{ x: −77, y: −173, w: 20, d: 11, r: 2 }`, 2.4 high, three grille lines; its lit copy is `#nm-tcp-udp-busy-voice`.
- Cable: from 2 right of the pad, to 3 past the plate's right edge, to router a.
- Its place: the pad's centre, `[−67, −167.5, 3]`.
- Callout: anchor at the pad's front left `[−77, −162, 2.4]`; lines end at (290, −22).

### 4.2 Measured

**Before** is the built site (this branch's `npm run build`): Subnetting for IP, DHCP for MAC, NAT for TCP/UDP. **After** is the prototype. Same browser, same window.

**At 1440 × 900.** The figure box is 733 wide; its height is what the panel leaves.

| | Panel | Figure box |
|---|---|---|
| Subnetting (empty board) | 102 | 396 |
| IP, every position | 102 | 396 |
| DHCP (empty lease table) | 100 | 398 |
| MAC, every position (4 rows) | 181 | 317 |
| NAT (empty table) | 100 | 398 |
| TCP/UDP A, before step 2 (empty) | 100 | 398 |
| TCP/UDP A, from step 2 (3 rows) | 151 | 347 |
| TCP/UDP B, at the end (6 rows) | 240 | 258 |

No panel scrolls. MAC's 317 is Ports' step-5 size (D11 §4.2).

**At 375 × 812.**

| | Before | After |
|---|---|---|
| IP: figure box | 375 × 275 (Subnetting) | 375 × 275 |
| IP: Bits tab content width | 404 in 375, scrolls | A: 608 in 375 at step 5, scrolls. B: 375, no scroll |
| IP: label column | 84px for words | B: the row's width less the address |
| MAC: stage head | 40 (DHCP's views) | 0 (no views) |
| MAC: figure box | 375 × 235 | 375 × 275 |
| MAC: Table tab | 375 | 375, no scroll, at every step |
| MAC: verdict words | — | 7.3px, as DHCP's callouts |
| TCP/UDP: figure box | 375 × 275 (NAT, no views) | 375 × 235 (views) |
| TCP/UDP: Table tab | 375 | A and B: 375, no scroll |
| Page | no sideways scroll | none, every lesson; the card page too |

### 4.3 Breakpoints

- **Under 640px:** the fitted bits board (variant B), §5 item 6.
- Otherwise none new. The Lesson page's own apply (the phone layout below 1100px). The new parts are in the SVG and scale with it.

## 5. For the builder: every code change

1. **Drawing** (Appendix A, applied as it is).
   - `src/art/scenes/dhcp.ts`: the TV, the `addresses` and `frames` groups, the verdict and split lines, tags `FRAME` and `TO ALL`, and the data `ringAt` and `places`.
   - `src/art/scenes/dhcp.css`: the verdicts and the split.
   - `src/art/scenes/net-map-layers.ts`: `align?: 'end'` on `PlateBase`, kind `call`, layer `tcp-udp:voice` (last).
   - `src/art/scenes/net-map.ts`: the `call` kind.
   - `src/art/figures/spots.ts`: `ipSpot`, `macSpot`, `tcpUdpSpot`, `SPOTS` and `DRAW`.
2. **Parts** (`src/art/scenes/parts.ts`), dhcp: `places: ['laptop', 'router', 'phone', 'tv']`, `cues: { frames: 'flag' }`, `start: true`.
3. **dhcp driver** (`src/scenes/drivers/dhcp.ts`). Today's behaviour stays for a scene without `frames`. With it:
   - `show`: the frames setup of §3.2 (`[data-setup="frames"]` shown, `[data-setup="addresses"]` given `display="none"`, the laptop's screen 192.168.1.100); then each verdict from the `frames` table's **This frame** cell (`data-v` = `sent`, `hears`, `keeps` or `ignores` for Sent it, Hears it, Keeps it, Ignores it; none for "—"), the `.dh-v-t` text the cell's words; each keeper's light on (`#dh-lap-glow`, `#dh-ph-glow`, `#dh-tv-glow`, `#dh-led-1` to `3`); `data-split` on the root while the table's highlight is 00:00:5E:00:53:10.
   - `play` of a message: tags by label (`dh-tag-frame`, `dh-tag-to-all`); the ring's two circles moved to `ringAt[from]`, shown for every kind; the moves of §3.2's "During a ride"; then the rest and `clear` as today.
   - `play` of a `frames` table event: paint as `show` does, from the rows after it.
   - `duration`: a `frames` table `update` 400, a `match` 900; messages as today.
   - The figure's description, in the frames setup: "A home Wi-Fi network on one plate: a laptop, a phone and a TV, and the router at the back. Beside each, its name and its MAC address."
4. **Validator** (`src/content/define.ts`).
   - `frames` only in a scene's start.
   - A dhcp message to or from `tv` needs `frames` (none in this story; the TV only listens).
   - A net-map message to or from any plate's site needs that plate's layer in `scene.layers`: today's check covers `server` and `stranger` only; widen it to every site (`voice` included). The outline's B14.
5. **Lesson content** (the authors'): IP's log columns of §2.8; MAC's table `frames` of §3.2; TCP/UDP's table of §2.2 (A unless the owner picks B).
6. **Bits board** (`src/lesson/panels/bits.css`), variant B:
   ```css
   .bits { --bit-w: 10px; }
   .bits__cell { width: var(--bit-w); }
   .bits__line { transform: translateX(calc(var(--octets) * (8 * var(--bit-w) + 13px) + var(--bits) * (var(--bit-w) + 1px) - 3px + 2.5px * min(var(--bits), 1))); }
   @media (max-width: 639px) {
     .bits { --bit-w: 8px; }
     .bits__table, .bits tbody, .bits caption { display: block; }
     .bits colgroup, .bits thead { display: none; }
     .bits tbody tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 10px; row-gap: 5px; align-items: baseline; }
     .bits tbody tr + tr { margin-top: 12px; }
     .bits tbody tr + tr > * { padding-top: 0; }
     .bits tbody th { grid-column: 1; grid-row: 1; padding: 0; }
     .bits__dec { grid-column: 2; grid-row: 1; }
     .bits__bits { grid-column: 1 / -1; grid-row: 2; padding: 0; }
   }
   ```
   The first three rules replace the fixed 10px cell and the line's fixed 93px and 11px with the same numbers worked out from `--bit-w`; at 640px and over nothing moves. Not shown in the prototype: the marigold line itself under 640px. IP's boards have `prefix: null`, so the prototype never draws it. Its sideways place follows `--bit-w` (above); its height (`--rows * 22px + 2px`) and top are the one-line rows', and under 640px a row is two lines, so the line has to start at the first row's bits and run to the last row's. A builder measures the row pitch there and sets both under the media query; acceptance check 22 is the test (§10, question 7). The header cells stay in the table for a screen reader (`display: none` on `thead` is what the prototype does; a builder may prefer the `.sr-only` clip, which reads the same).
7. **Cards** (`src/lib/figures.ts`): `'ip-address': () => spot('ip-address')`, `'mac-address': () => spot('mac-address')`, `'tcp-udp': () => spot('tcp-udp')`.
8. **Pinned tests** (each fails on the patch until updated, as listed):
   - `dhcp.test.ts`: before hashing, remove whole each group that opens `<g data-setup="frames" display="none">`, `<g class="dh-tag" id="dh-tag-frame"` and `<g class="dh-tag" id="dh-tag-to-all"`, and unwrap each `<g data-setup="addresses">`; drop `ringAt` and `places` from the data. Both hashes then equal today's (checked).
   - `net-map.test.ts`: remove the `<g data-layer="tcp-udp:voice"` groups and every route to or from `voice`; both hashes equal today's (checked).
   - `net-map-layers.test.ts`: the key list gains `'tcp-udp:voice'`; `SITES` gains `'voice'`; FIGURE_PARTS's places gain `voice`; D11's test of which layers have `describe` gains `tcp-udp:voice`.
   - `figures.test.ts`: `EXPECTED` gains the three spots, recorded from the render, which equals the files (check 1).
9. **The count tests and the track chain** move with the lessons, as before. Not this spec's.

## 6. The card art

Three spots in the family: 528 × 372 (`viewBox="36 44 528 372"`), the kit in `common.ts`, one lit part each. Looked at in the browser at full size and at the card's size on the route, light and dark, beside ARP, Ports and NAT.

| Spot | Plate label | What it shows | Lit part | `lm-led on` |
|---|---|---|---|---|
| `ip-address` | FOUR OCTETS · 32 BITS | Four tiles on a long base, 192, 168, 1 and 10, with a small dot between each. Each tile's front is engraved with its 8 bits. | The first tile, 192, its bits 11000000 | 0 |
| `mac-address` | OUI · THIS CARD | A network card on short legs: a chip with traces, contacts along its edge, a bracket with a socket and two lights (link on). Its address on two labels side by side. | The first label, 00:00:5E | 1 |
| `tcp-udp` | TCP · UDP | Two lanes on one plate. TCP: pieces 1, 2 and 3 heading out, an acknowledgement coming back. UDP: pieces 1 and 3, a dotted empty place where 2 was. | The ACK coming back on TCP's lane | 0 |

**aria-labels** (in the files):
- IP Address: "An address laid out as four tiles on a plate, 192, 168, 1 and 10, with a dot between each. Under each number its 8 bits are engraved. The first tile, 192 over 11000000, is lit."
- MAC Address: "A network card on short legs: a chip, contacts along its edge, a bracket with a socket and a light. Its address is on two labels side by side: the first half, 00:00:5E, is lit; the second, 00:53:10, is not."
- TCP/UDP: "Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back."

**Choices.**
- **IP lights 192**, not the whole address: one lit part, and the tile shows the idea (one octet is 8 bits).
- **MAC lights the organization's half**: the half that says who; D10's description of this card ("the maker's half lit").
- **TCP/UDP lights the ACK**: the thing UDP has none of.

## 7. Copy

Every word new to the site that this spec sets. Everything else in §3 is the outlines' placeholder text for the authors.

| Where | Words |
|---|---|
| Scene title, TCP/UDP | A page, then a call |
| IP log | Addresses · Address · Kind · In plain words · No address read yet. Press Play, or pick a step. |
| IP legend | Address read · Sent · Broadcast |
| IP board labels | Sales laptop · Printer · Router, inside · Router, link · Loopback · No address · Everyone here |
| MAC map: callouts | Router · Laptop · Phone · TV, each with its MAC address |
| MAC map: verdicts | Sent it · Hears it · Keeps it · Ignores it |
| MAC map: the split | OUI · this card |
| MAC figure description | §5, item 3 |
| MAC panel | Who keeps the frame · each device decides for itself · Device · MAC address · This frame |
| MAC legend | Frame to one device · Frame to everyone · Frame back to the laptop |
| MAC tags | FRAME · TO ALL |
| TCP/UDP map: callout | Voice server · 203.0.113.90 · port 16384 |
| TCP/UDP map: engraving | CALL.EXAMPLE.NET |
| TCP/UDP figure description, added | Behind the internet, the voice server the call goes through. |
| TCP/UDP panel (A) | What your laptop got · the page over TCP, then Sam’s voice over UDP · Piece · Page, over TCP · Sam’s voice, over UDP · Nothing yet. |
| TCP/UDP cells (A) | Arrived · Missing · Arrived, waiting · Arrived, sent again · Lost · Arrived, played at once · — |
| TCP/UDP legend | Sent by your laptop · Sent to your laptop · Lost on the way |
| Card plates | FOUR OCTETS · 32 BITS · OUI · THIS CARD · TCP · UDP |
| Card arias | §6 |

Sentence case throughout, and no time figures. The map's engravings, callout names and tags are in capitals, as everywhere on the figures.

## 8. Acceptance checks

Each can be turned into a test.

**The files, tag for tag**

1. For `ip-address`, `mac-address` and `tcp-udp`: `spot(kind) + '\n'` equals `readFileSync('prototypes/d12-<kind>-spot.svg', 'utf8')`, byte for byte.
2. `d12-part-voice.svg` starts `<svg xmlns="http://www.w3.org/2000/svg" class="lm-svg nm" viewBox="-98 -60 685 378">`, ends `</svg>\n`, and between them holds the five whole groups of `drawNetMap().svg` that open `<g data-layer="tcp-udp:voice" display="none">`, in document order.
3. `d12-part-frames.svg` starts `<svg xmlns="http://www.w3.org/2000/svg" class="lm-svg dh" viewBox="-73 -30 668 318">`, ends `</svg>\n`, and between them holds, in document order, the whole groups of `drawDhcp().svg` that open `<g data-setup="frames" display="none">` (2), `<g class="dh-tag" id="dh-tag-frame" style="opacity:0">` (1) and `<g class="dh-tag" id="dh-tag-to-all" style="opacity:0">` (1).
4. With those groups removed (and the `addresses` wrappers unwrapped, for dhcp; the routes to or from `voice` dropped and `ringAt` and `places` dropped from the data), `drawNetMap()` and `drawDhcp()` hash to today's `EXPECTED`.
5. The viewBoxes are still `-98 -60 685 378` and `-73 -30 668 318`. Ids stay unique; the new ids are `dh-tv-glow`, `dh-tag-frame`, `dh-tag-to-all`, `dh-v-router`, `dh-v-laptop`, `dh-v-phone`, `dh-v-tv`, `dh-mac-laptop`, `dh-split` and `nm-tcp-udp-busy-voice`.
6. `drawDhcp().data.ringAt` is `{ laptop: [-67, 23], router: [-11, -49] }`; `places.tv` is `[65, -62.5]`.

**Validator**

7. Pass: `frames` in a dhcp scene's start; DHCP, Subnetting, NAT, Ports and every checked lesson unchanged.
8. Fail: `frames` on an event; `frames` on another figure; a message to or from `voice` without `tcp-udp:voice` in the layers; a message to or from `call` without `udp:call` (today it passes).

**Driver: dhcp**

9. In DHCP's scene, at every position: no `[data-setup="frames"]` group shown, no `.dh-v` with `data-v`, and the figure is today's.
10. In MAC's scene, at every position: both `[data-setup="addresses"]` groups have `display="none"`; `#dh-lap-ip` reads 192.168.1.100 at full opacity; `#dh-lap-noip` at 0.
11. At the end of each step, `#dh-v-<place>`'s `data-v` and text are §3.2's table cells; a device's light is on exactly when its cell is "Keeps it".
12. During step 1's ride, at k 0.45: router `hears`, phone and TV none; at k 0.7: all three `hears`; the laptop `sent` throughout. During step 4's ride the ring's circles have `cx` −11, `cy` −49.
13. The root has `data-split` during and after step 3's match, and not at the start of step 3 or at step 4.
14. `duration`: a `frames` update 400 at 1× (200 at 2×), a match 900; a `leases` event still 0.
15. Play and show give the same settled figure under full and reduced motion, at every step.

**Driver: net-map**

16. In TCP/UDP's scene, the voice plate's five groups are shown at every position; in every other lesson they keep `display="none"`. The description ends with "Behind the internet, the voice server the call goes through."
17. At the end of step 1, one `.nm-conn` from the laptop to the web plate; it is still there at step 5.
18. Steps 2 and 5 each show the LOST mark during the drop's play and not once the step has settled.
19. From step 3's last ACK on, `#nm-page [data-part="text"]` is at full opacity.

**Panels and log**

20. IP: at each step's end the board holds §3.1's rows; the caption reads "32 bits, in four groups of 8"; no row has a mark (`data-part`, `data-differs`, `data-matches`); row 2 has `data-off`.
21. IP, at 375 under variant B: in the Bits tab `scrollWidth ≤ clientWidth` at every step; each label is whole (no ellipsis). At 1440, no label is cut (`scrollWidth ≤ clientWidth` on `.bits__label`).
22. Subnetting, under variant B, at 375: the marigold line falls between bits `prefix` and `prefix + 1` at every step (its left edge between the two cells' boxes).
23. MAC: at each step's end, the table's This frame column is §3.2's; at step 3 the laptop row has `data-highlight="matched"`.
24. TCP/UDP (A): rows appear as §3.3 says; no row has `data-miss`. (B: Page 2 has `data-miss` from step 2 to its update in step 3; Sam 2 from step 5.)
25. At 375, in each lesson's fourth tab, `scrollWidth ≤ clientWidth` at every step (A and B); the page has no sideways scroll.
26. Logs: IP's rows are §3.1's, with the glyphs named; MAC's three rows have "—" for time and size and Wi-Fi as protocol; TCP/UDP's 14 rows, rows 6 and 13 with `data-outcome="dropped"` and the flag "Dropped".
27. The legends list exactly §3's entries, in that order.

**Cards**

28. The track page shows the three spots at stops 3, 4 and 11 once each lesson is ready, with §6's aria-labels. `lessonFigure` does not throw for any of them.
29. Each spot has one `data-lit`. The `lm-led on` counts are ip-address 0, mac-address 1, tcp-udp 0.

## 9. What an outline asked for that the figure does not show

- **IP:** the kinds stay in the log, not in a panel (the outline's preference); no bit values are lit or explained on the board (the Go deeper's); the link-local address has no row (the outline's).
- **MAC:** a randomized address (not a step, by the outline); a printer as a fifth device (the plate has room only for the TV where the lease board stood; the TV is the ruling's one new device).
- **TCP/UDP:** the two losses sit in two steps, not side by side on the map (until a compare mode exists); the table sets them side by side (variant A).

## 10. Open questions for the owner

1. **The Bits tab on a phone** (§2.1). B fits the board to 375 and changes Subnetting's phone board with it; A keeps the sideways scroll. Recommendation: B.
2. **TCP/UDP's table** (§2.2). A, three rows side by side, keeps the map at 347px; B, the outline's six rows, shrinks it to 258px. Recommendation: A.
3. **MAC's map at 1440 × 900** is 317px while its four-row table shows (DHCP's is 398). The table says in words what the 7px verdicts say on a phone. Recommendation: keep the table.
4. **The voice server sits in slot N**, behind the internet, not SE, where its plate would run under the web server's callout. Recommendation: N, as drawn.
5. **MAC's log times** are dashes. The outline asked for example times; with no source for a timing and two of five steps sending nothing, dashes match TCP/UDP, Ports and NAT. Recommendation: dashes.
6. **IP's office keeps Subnetting's words** ("the way out of each network", four "192.168.1.0/24" lines) as drawn, by the ruling. They are true in this lesson too. Recommendation: as drawn.
7. **Subnetting's marigold line under variant B** is not in the prototype (IP draws no line). If the owner picks B, Subnetting's phone board changes too; the line's top and height under 640px are a builder's measurement against check 22. Recommendation: pick B, and have the build's reviewer look at Subnetting at 375 before merge.

## Appendix A. The patch

Applies to `job13/batch` at `7a679eb` with `git apply`. It changes five files under `src/art/`, and its output is the five SVG files above. Items 2 to 9 of §5 are not in it.

```diff
diff --git a/src/art/figures/spots.ts b/src/art/figures/spots.ts
index e5fbe78..5f9625b 100644
--- a/src/art/figures/spots.ts
+++ b/src/art/figures/spots.ts
@@ -288,10 +288,79 @@ function natSpot() {
   return figure("nat", "PRIVATE IN · PUBLIC OUT", out.join(""), "A home router in the middle, with a laptop and a phone behind it and one cable out to the right. Over the laptop’s cable floats a tag with its private address, 192.168.1.100; over the cable out, a lit tag with the router’s public address, 198.51.100.23. A dotted arc joins them over the router.");
 }
 
-export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat'] as const;
+// IP Address: the address as a plate of four octet tiles, a dot between each, its bits engraved under each number.
+function ipSpot() {
+  const out = [], TZ = 3, TH = 24, TW = 40, TD = 26, Y = -16;
+  const BASE = { x: -102, y: Y - 6, w: 204, d: TD + 16, r: 3 };
+  out.push(S(k.slabOf(BASE, 0, TZ, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(BASE, 1.2, P, 3), { tone: "faint" }) }));
+  const tiles = [["192", "11000000"], ["168", "10101000"], ["1", "00000001"], ["10", "00001010"]];
+  tiles.forEach(([dec, bits], i) => {
+    const x = -96 + i * 50, T = { x, y: Y, w: TW, d: TD, r: 1.6 }, F = Y + TD, lit = i === 0;
+    out.push(S(k.slabOf(T, TZ, TH, P, 3, 0.6), { tone: "hi", lit }));
+    out.push(k.faceTextSvg(k.sideMatrix([x + TW / 2, F], TZ + 11.6, P, "left"), dec, { size: 10, anchor: "middle" }));
+    out.push(onFaceY(F, (lit ? "" : rect("lm-inlay", x + 3, TZ + 1.6, TW - 6, 5, 1)) + `<text class="${lit ? "lm-tagt" : "lm-rule"}" x="${n1(x + TW / 2)}" y="${n1(-(TZ + 2.8))}" text-anchor="middle">${bits}</text>`));
+    // The dot after each of the first three numbers: dotted decimal.
+    if (i < 3) out.push(S(k.cylinder(x + TW + 5, F + 6, 2.2, TZ, 3, P, 20), { tone: "mid" }));
+  });
+  return figure("ip-address", "FOUR OCTETS · 32 BITS", out.join(""), "An address laid out as four tiles on a plate, 192, 168, 1 and 10, with a dot between each. Under each number its 8 bits are engraved. The first tile, 192 over 11000000, is lit.");
+}
+
+// MAC Address: a network card, its address on two labels side by side: the organization's half, lit, and the card's own.
+function macSpot() {
+  const out = [], B = { x: -72, y: -46, w: 160, d: 70, r: 2.4 }, BZ = 6, BH = 3;
+  for (const [x, y] of [[B.x + 20, B.y + 14], [B.x + B.w - 20, B.y + 14], [B.x + 20, B.y + B.d - 12], [B.x + B.w - 20, B.y + B.d - 12]]) out.push(S(k.cylinder(x, y, 2.6, 0, BZ, P, 20), { tone: "lo" }));
+  // The bracket at the left end, behind the board: a socket for the cable, and two lights, the link light on.
+  const K = { x: B.x - 7, y: B.y + 4, w: 4, d: B.d - 8, r: 0.6 }, KH = 30;
+  out.push(S(k.slabOf(K, 0, KH, P, 3, 0.4), { tone: "hi", inner: L(k.sideSeam(K, KH - 3, P, 3), { tone: "faint" }) }));
+  const KF = K.x + K.w, J = { y: K.y + 30, z: 13, w: 16, h: 12 };
+  out.push(onFaceX(KF, rect("lm-inlay", -(J.y + J.w), J.z, J.w, J.h, 1.2) + rect("lm-void", -(J.y + J.w - 3), J.z + 2, J.w - 6, J.h - 5, 0.6) + rect("lm-slot", -(J.y + J.w / 2 + 2.5), J.z + J.h - 3.2, 5, 1.6, 0.4)));
+  out.push(`<g class="lm-leds">${dot(at([KF, J.y + 3, 18]), "lm-led on", 1.3)}${dot(at([KF, J.y + 3, 13.5]), "lm-led", 1.3)}</g>`);
+  out.push(S(k.slabOf(B, BZ, BH, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(B, BZ + 1, P, 3), { tone: "faint" }) }));
+  const T = BZ + BH;
+  // The contacts along its front edge, where it plugs in.
+  let edge = "";
+  for (let i = 0; i < 24; i++) edge += rect("lm-slot", B.x + 40 + i * 4.4, BZ + 0.6, 2.6, 1.8, 0.3);
+  out.push(onFaceY(B.y + B.d, edge));
+  // The chip at the back, its traces to the contacts.
+  const C = { x: B.x + 20, y: B.y + 8, w: 30, d: 26, r: 1.4 };
+  out.push(lines([0, 1, 2, 3].map((i) => [[C.x + C.w + 2, C.y + 5 + i * 5.4], [C.x + C.w + 14, C.y + 5 + i * 5.4]]).concat([0, 1, 2, 3, 4].map((i) => [[C.x + 5 + i * 5, C.y + C.d + 2], [C.x + 5 + i * 5, B.y + B.d - 4]])), T));
+  out.push(S(k.slabOf(C, T, 4, P, 3, 0.5), { tone: "lo" }));
+  out.push(L(k.planOutline(k.insetPlan(C, 4), T + 4, P, 3), { tone: "mid" }));
+  // The address, on two labels with a gap between: the organization's number (lit), then this card's.
+  const tag = (L0, text, lit) => S(k.slabOf(L0, T, 2.4, P, 3, 0.4), { tone: "hi", lit }) + onTopAt(T + 2.4, `<text class="${lit ? "lm-tagt" : "lm-pkt-t"}" x="${n1(L0.x + 4.6)}" y="${n1(L0.y + 9.4)}">${text}</text>`);
+  out.push(tag({ x: B.x + 70, y: B.y + 34, w: 31, d: 15, r: 1.4 }, "00:00:5E", true));
+  out.push(tag({ x: B.x + 106, y: B.y + 34, w: 31, d: 15, r: 1.4 }, "00:53:10", false));
+  return figure("mac-address", "OUI · THIS CARD", out.join(""), "A network card on short legs: a chip, contacts along its edge, a bracket with a socket and a light. Its address is on two labels side by side: the first half, 00:00:5E, is lit; the second, 00:53:10, is not.");
+}
+
+// TCP/UDP: two lanes. TCP's three pieces go out and a lit acknowledgement comes back; UDP's go out with piece 2
+// missing, and nothing comes back.
+function tcpUdpSpot() {
+  const out = [], LW = 200, LD = 38, LZ = 3, PZ = LZ, PH = 7;
+  const lanes = [{ y: -50, name: "TCP" }, { y: 6, name: "UDP" }];
+  const pkt = (x, y, text, lit = false) => S(k.slabOf({ x, y, w: 22, d: 15, r: 1.6 }, PZ, PH, P, 3, 0.5), { tone: "hi", lit }) + onTopAt(PZ + PH, `<text class="${lit ? "lm-tagt" : "lm-pkt-t"}" x="${n1(x + 11)}" y="${n1(y + 9.6)}" text-anchor="middle">${text}</text>`);
+  for (const { y, name } of lanes) {
+    const R = { x: -100, y, w: LW, d: LD, r: 3 };
+    out.push(S(k.slabOf(R, 0, LZ, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(R, 1.2, P, 3), { tone: "faint" }) }));
+    out.push(L(k.planOutline(k.insetPlan(R, 3), LZ, P, 3), { tone: "lo" }));
+    out.push(k.faceTextSvg(k.sideMatrix([R.x + 5, y + LD], 0.6, P, "left"), name, { size: 3.4, tone: "mid" }));
+    // The way out, along the lane's front half.
+    out.push(lines([-90, 76].flatMap((x) => [[[x, y + 24], [x + 4, y + 28]], [[x + 4, y + 28], [x, y + 32]]]), LZ, "mid"));
+  }
+  // TCP: pieces 1 to 3 on their way out; the acknowledgement on its way back, along the lane's back half, lit.
+  [-52, -22, 8].forEach((x, i) => out.push(pkt(x, -30, String(i + 1))));
+  out.push(lines([[[46, -42], [42, -38]], [[42, -38], [46, -34]]], LZ, "mid"));
+  out.push(pkt(52, -46, "ACK", true));
+  // UDP: pieces 1 and 3 on their way, an empty place where 2 was lost, and nothing on the way back.
+  out.push(pkt(-52, 26, "1"), pkt(8, 26, "3"));
+  out.push(L(k.planOutline({ x: -22, y: 26, w: 22, d: 15, r: 1.6 }, LZ, P, 3), { tone: "mid", dotted: true }));
+  return figure("tcp-udp", "TCP · UDP", out.join(""), "Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back.");
+}
+
+export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp'] as const;
 export type SpotKind = (typeof SPOTS)[number];
 
-const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot };
+const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot };
 
 /** A small figure, cropped close to its plate. */
 export const spot = (kind: SpotKind): string => DRAW[kind]();
diff --git a/src/art/scenes/dhcp.css b/src/art/scenes/dhcp.css
index 6c4bc7e..559c6a8 100644
--- a/src/art/scenes/dhcp.css
+++ b/src/art/scenes/dhcp.css
@@ -22,6 +22,24 @@
 .dh .dh-tag-t { font: 700 4.6px var(--mono); fill: color-mix(in srgb, var(--lit-b) 30%, #000); letter-spacing: .03em; }
 .dh .dh-ring { fill: none; stroke: var(--lit-a); stroke-width: 2.6px; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 4px var(--lit-b)); }
 .dh .dh-ring.soft { stroke-width: 1.2px; opacity: .55; filter: none; }
+/* The frames setup (MAC Address): each device's verdict on the frame in the air, a square and words. Heard is an
+   outline, kept a filled square in the done green with the words in it, ignored a muted outline with a slash, sent the ink. */
+.dh .dh-v-t { font: 500 13px/1 var(--sans); fill: var(--muted); }
+.dh .dh-v-mark { fill: none; stroke: var(--muted); stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
+.dh .dh-v:not([data-v]) { display: none; }
+.dh .dh-v[data-v="keeps"] .dh-v-mark { fill: var(--allowed); stroke: var(--allowed); }
+.dh .dh-v[data-v="keeps"] .dh-v-t { fill: var(--allowed-text); font-weight: 700; }
+.dh .dh-v[data-v="sent"] .dh-v-mark { fill: var(--ink-strong); stroke: var(--ink-strong); }
+.dh .dh-v[data-v="sent"] .dh-v-t { fill: var(--ink); }
+.dh .dh-v[data-v="hears"] .dh-v-mark { stroke-dasharray: 2 1.5; }
+.dh .dh-v-slash { display: none; fill: none; stroke: var(--muted); stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
+.dh .dh-v[data-v="ignores"] .dh-v-slash { display: inline; }
+.dh .dh-split { display: none; }
+.dh[data-split] .dh-split { display: inline; }
+.dh[data-split] #dh-v-laptop { display: none; }
+.dh[data-split] .dh-oui { fill: var(--accent); font-weight: 700; }
+.dh .dh-bracket { fill: none; stroke: var(--muted); stroke-width: 1.2px; vector-effect: non-scaling-stroke; }
+.dh .dh-half { font: 400 13px/1 var(--sans); fill: var(--muted); }
 /* While the driver's show settles the figure, the lights and the note change at once (src/scenes/drivers/dhcp.ts). */
 .dh[data-settling] .dh-glow, .dh[data-settling] .dh-ignore { transition: none; }
 /* Reduced motion keeps every light and note, and only drops the fades. */
diff --git a/src/art/scenes/dhcp.ts b/src/art/scenes/dhcp.ts
index 1ab9f57..58bda1f 100644
--- a/src/art/scenes/dhcp.ts
+++ b/src/art/scenes/dhcp.ts
@@ -16,10 +16,16 @@ export interface DhcpSceneData {
   arc: [number, number, number][];
   /** The broadcast ring's widest radius on the floor. */
   ringMax: number;
+  /** For the frames setup (MAC Address): where the ring starts for each sender, and where each device stands, on the plate. */
+  ringAt: Record<'laptop' | 'router', [number, number]>;
+  places: Record<'laptop' | 'router' | 'phone' | 'tv', [number, number]>;
 }
 
 const LAPTOP_MAC = "00:00:5E:00:53:10";
 const PHONE_MAC = "00:00:5E:00:53:11";
+// The frames setup (MAC Address): the router's own MAC address and a TV's. The TV stands where the lease table does.
+const ROUTER_MAC = "00:00:5E:00:53:01";
+const TV_MAC = "00:00:5E:00:53:12";
 
 const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
 const PL = { x: -112, y: -80, w: 224, d: 160, r: 10 };
@@ -28,6 +34,7 @@ const R = { x: -42, y: -66, w: 62, d: 34, r: 5 }, RZ = 2.4, RT = RZ + 11;
 const LG = { x: 38, y: -66, w: 54, d: 8, r: 1.4 }, LG_Z = 2.6, LG_H = 44;
 const PD = { x: 52, y: 30, w: 28, d: 16, r: 3 }, PD_H = 3;
 const PH = { x: 57, y: 33, w: 18, d: 3.2, r: 1.4 }, PH_H = 36;
+const TV = { x: 40, y: -64, w: 50, d: 3, r: 1 }, TV_Z = 7, TV_H = 30, TVF = { x: 55, y: -70, w: 20, d: 13, r: 2 };
 
 // One camera for the scene. The frame is fitted afterwards to the plate and its callouts, which sit off the plate,
 // on the page's own background, so they read in both themes.
@@ -129,6 +136,20 @@ function phone() {
   return out.join("");
 }
 
+// ---------- The TV: on the same Wi-Fi, in the frames setup only, where the lease table stands in DHCP's ----------
+function tv() {
+  const out = [];
+  out.push(S(k.slabOf(TVF, 0, 1.6, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(TVF, 0.6, P, 3), { tone: "faint" }) }));
+  out.push(S(k.slabOf({ x: TVF.x + TVF.w / 2 - 3, y: TV.y - 2.2, w: 6, d: 2.2, r: 0.6 }, 1.6, TV_Z - 1.6, P, 3, 0.4), { tone: "mid" }));
+  out.push(S(k.slabOf(TV, TV_Z, TV_H, P, 3, 0.5), { tone: "hi" }));
+  const x0 = TV.x + 1.8, w = TV.w - 3.6, z0 = TV_Z + 2.6, h = TV_H - 4.4;
+  let scr = rect("lm-void", x0, z0, w, h, 0.6) + rect("dh-glow", x0, z0, w, h, 0.6, ' id="dh-tv-glow"');
+  scr += rect("lm-slot", x0 + 3, z0 + h - 5, 14, 1.6, 0.8) + rect("lm-slot", x0 + 3, z0 + h - 8.4, 22, 1.6, 0.8);
+  scr += `<circle class="lm-led on" cx="${n1(TV.x + TV.w - 3)}" cy="${n1(-(TV_Z + 1.3))}" r="0.7"/>`;
+  out.push(onFaceY(TV.y + TV.d, scr));
+  return out.join("");
+}
+
 // The lease table belongs to the router: a short cable joins them.
 const cable = () => tubeOf(tubePieces([[R.x + R.w, R.y + 16, 1.4], [LG.x - 3, R.y + 16, 1.4]], 1.1, P, { maxLength: 14 }));
 
@@ -140,12 +161,37 @@ function callout(boxes, anchor, [tx, ty], lines, { align = "start", id = "" } =
   for (const [i, l] of lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
   const ex = tx + (align === "end" ? 7 : -7);
   const lead = `<path class="dh-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "dh-lead-dot", 2)}`;
-  const text = lines.map((l, i) => `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
+  const text = lines.map((l, i) => l.svg ? l.svg(tx, ty + i * 16, align) : `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
   return `<g class="dh-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
 }
 
+// ---------- The frames setup's callout lines ----------
+// What a device did with the frame in the air, as the driver writes it from the "Who keeps the frame" table: a small
+// square, then the words. The square stands before the words, or after them on a callout whose lines end at its x.
+const verdict = (place) => ({
+  cls: "dh-sub", text: "Ignores it   ",
+  svg: (x, y, align) => {
+    const mx = align === "end" ? x - 8 : x, tx = align === "end" ? x - 12 : x + 12;
+    return `<g class="dh-v" id="dh-v-${place}"><rect class="dh-v-mark" x="${n1(mx)}" y="${n1(y - 9)}" width="8" height="8" rx="1"/><path class="dh-v-slash" d="M${n1(mx + 1.5)} ${n1(y - 2.5)}l5 -5"/><text class="dh-v-t" x="${n1(tx)}" y="${n1(y)}" text-anchor="${align}"></text></g>`;
+  },
+});
+// The laptop's MAC address in two halves, the organization's number (OUI) and this card's number. The driver lights the
+// first half and shows the brackets and their words for a step (the `split` cue), in place of the verdict line.
+const MAC_CH = 12.5 * 0.6;
+const splitMac = (mac) => ({
+  cls: "dh-addr", text: mac,
+  svg: (x, y) => {
+    const [a, b] = [mac.slice(0, 8), mac.slice(9)], x0 = x - mac.length * MAC_CH, aMid = x0 + 4 * MAC_CH, bMid = x - 4 * MAC_CH;
+    const bracket = (cx) => `<path class="dh-bracket" d="M${n1(cx - 28)} ${n1(y + 4)}v3h56v-3"/>`;
+    const text = `<text class="dh-addr" id="dh-mac-laptop" x="${n1(x)}" y="${n1(y)}" text-anchor="end"><tspan class="dh-oui">${a}</tspan>:${b}</text>`;
+    const words = `<text class="dh-half" x="${n1(aMid)}" y="${n1(y + 18)}" text-anchor="middle">OUI</text><text class="dh-half" x="${n1(bMid)}" y="${n1(y + 18)}" text-anchor="middle">this card</text>`;
+    return text + `<g class="dh-split" id="dh-split">${bracket(aMid)}${bracket(bMid)}${words}</g>`;
+  },
+});
+
 // ---------- Moving parts, drawn at the origin and moved by the driver ----------
-const LABELS = ["DISCOVER", "OFFER", "REQUEST", "ACK", "RENEW"];
+const LABELS = ["DISCOVER", "OFFER", "REQUEST", "ACK", "RENEW", "FRAME", "TO ALL"];
+const tagId = (label) => `dh-tag-${label.toLowerCase().replace(" ", "-")}`;
 const tag = (label) => {
   const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
   return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="dh-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
@@ -157,6 +203,9 @@ const A = [LB.x + LB.w / 2, LB.y + 4, LZ + LID_H + 8], B = [R.x + R.w / 2 - 4, R
 const ARC = [];
 for (let i = 0; i <= 32; i++) { const s = i / 32; ARC.push([A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s, A[2] + (B[2] - A[2]) * s + 34 * Math.sin(Math.PI * s)]); }
 const RING_AT = [LB.x + LB.w / 2, LB.y + LB.d / 2], RING_MAX = 230;
+// In the frames setup the ring starts at whoever sends, the laptop or the router, and reaches each device in turn.
+const ROUTER_AT = [R.x + R.w / 2, R.y + R.d / 2];
+const PLACES = { laptop: RING_AT, router: ROUTER_AT, phone: [PH.x + PH.w / 2, PH.y + PH.d / 2], tv: [TV.x + TV.w / 2, TV.y + TV.d / 2] };
 
 // ---------- The scene ----------
 function sceneSvg() {
@@ -164,28 +213,36 @@ function sceneSvg() {
   const things = [
     { xy: [LB.x + LB.w / 2, LB.y + LB.d / 2], svg: laptop() },
     { xy: [R.x + R.w / 2, R.y + R.d / 2], svg: router() },
-    { xy: [LG.x + LG.w / 2, LG.y + LG.d / 2], svg: leaseBoard() },
+    { xy: [LG.x + LG.w / 2, LG.y + LG.d / 2], svg: `<g data-setup="addresses">${leaseBoard()}</g>` },
     { xy: [PD.x + PD.w / 2, PD.y + PD.d / 2], svg: phone() },
-    { xy: [(R.x + R.w + LG.x) / 2, R.y + 16], svg: cable() },
+    { xy: [(R.x + R.w + LG.x) / 2, R.y + 16], svg: `<g data-setup="addresses">${cable()}</g>` },
+    { xy: [TV.x + TV.w / 2, TV.y + TV.d / 2], svg: `<g data-setup="frames" display="none">${tv()}</g>` },
   ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
   // Floor layers: the broadcast ring and the tag's shadow, clipped to the plate so objects stand on top of them.
   const clip = `<clipPath id="dh-clip"><path d="${k.planOutline(k.insetPlan(PL, 2), 0, P)}"/></clipPath>`;
   const floor = `<g clip-path="url(#dh-clip)"><g id="dh-ring-g" style="opacity:0">${onTopAt(0, `<circle class="dh-ring" id="dh-ring" cx="${RING_AT[0]}" cy="${RING_AT[1]}" r="1"/><circle class="dh-ring soft" id="dh-ring2" cx="${RING_AT[0]}" cy="${RING_AT[1]}" r="1"/>`)}</g><g id="dh-tag-shadow" style="opacity:0">${shadow}</g></g>`;
   const arc = `<g id="dh-arc" style="opacity:0">${L(k.pathOf(ARC.map((p) => k.iso(p, P))), { tone: "hi", dotted: true })}</g>`;
-  const tags = LABELS.map((l) => `<g class="dh-tag" id="dh-tag-${l.toLowerCase()}" style="opacity:0">${tag(l)}</g>`).join("");
+  const tags = LABELS.map((l) => `<g class="dh-tag" id="${tagId(l)}" style="opacity:0">${tag(l)}</g>`).join("");
   const boxes = [];
-  const labels = [
+  const labels = `<g data-setup="addresses">` + [
     callout(boxes, [R.x + 7, R.y + 5, RT + 28.6], [290, 0], [{ cls: "dh-name", text: "Router" }, { cls: "dh-sub", text: "hands out addresses" }, { cls: "dh-addr", text: "192.168.1.1" }]),
     callout(boxes, [LG.x + LG.w, LG.y, LG_H], [440, 66], [{ cls: "dh-name", text: "Lease table" }, { cls: "dh-sub", text: "who has which address" }]),
     callout(boxes, [LB.x, LB.y + 1, LZ + LID_H - 14], [72, 44], [{ cls: "dh-name", text: "Laptop" }, { cls: "dh-addr", text: LAPTOP_MAC }, { cls: "dh-addr none", text: "No IP address yet", id: "dh-laptop-ip" }], { align: "end" }),
     callout(boxes, [PH.x + PH.w, PH.y, PD_H + PH_H - 4], [432, 206], [{ cls: "dh-name", text: "Phone" }, { cls: "dh-addr", text: PHONE_MAC }, { cls: "dh-ignore", text: "Hears it, ignores it", id: "dh-ignore" }]),
-  ].join("");
+  ].join("") + `</g>`;
+  // The frames setup: each device's name, its MAC address and what it did with the frame; the TV where the lease table's callout is.
+  const frames = `<g data-setup="frames" display="none">` + [
+    callout(boxes, [R.x + 7, R.y + 5, RT + 28.6], [290, 0], [{ cls: "dh-name", text: "Router" }, { cls: "dh-addr", text: ROUTER_MAC }, verdict("router")]),
+    callout(boxes, [TV.x + TV.w, TV.y, TV_Z + TV_H], [440, 66], [{ cls: "dh-name", text: "TV" }, { cls: "dh-addr", text: TV_MAC }, verdict("tv")]),
+    callout(boxes, [LB.x, LB.y + 1, LZ + LID_H - 14], [72, 44], [{ cls: "dh-name", text: "Laptop" }, splitMac(LAPTOP_MAC), verdict("laptop")], { align: "end" }),
+    callout(boxes, [PH.x + PH.w, PH.y, PD_H + PH_H - 4], [432, 206], [{ cls: "dh-name", text: "Phone" }, { cls: "dh-addr", text: PHONE_MAC }, verdict("phone")]),
+  ].join("") + `</g>`;
   // The frame: the plate, the tallest parts and every callout, with a margin.
   const pts = [...k.boxCorners(PL, FLOOR, 0), [R.x + 7, R.y + 5, RT + 28.6]].map(at);
   for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
   const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 18;
   const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
-  const body = wrap(clip + pl.under + `<g class="lm-body">${pl.over}${floor}${things.map((t) => t.svg).join("")}${arc}${tags}</g>`) + labels;
+  const body = wrap(clip + pl.under + `<g class="lm-body">${pl.over}${floor}${things.map((t) => t.svg).join("")}${arc}${tags}</g>`) + labels + frames;
   return `<svg data-figure="dhcp" class="lm-svg dh" viewBox="${vb.join(" ")}" role="img" aria-label="A home Wi-Fi network on one plate: a laptop with no address yet, a phone, and the router that hands out addresses, with its lease table beside it.">${body}</svg>`;
 }
 
@@ -193,7 +250,8 @@ function sceneSvg() {
 function sceneData(): DhcpSceneData {
   const o = k.iso([0, 0, 0], P), ex = k.iso([1000, 0, 0], P), ey = k.iso([0, 1000, 0], P), ez = k.iso([0, 0, 1000], P);
   const M = [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000];
-  return { M, arc: ARC.map((p) => p.map((v) => +v.toFixed(2))), ringMax: RING_MAX };
+  const r2 = (p) => p.map((v) => +v.toFixed(2));
+  return { M, arc: ARC.map(r2), ringMax: RING_MAX, ringAt: { laptop: r2(RING_AT), router: r2(ROUTER_AT) }, places: Object.fromEntries(Object.entries(PLACES).map(([n, p]) => [n, r2(p)])) };
 }
 
 /** The DHCP scene, drawn at build time: its SVG and the data its driver reads. */
diff --git a/src/art/scenes/net-map-layers.ts b/src/art/scenes/net-map-layers.ts
index 269afb6..534ba43 100644
--- a/src/art/scenes/net-map-layers.ts
+++ b/src/art/scenes/net-map-layers.ts
@@ -21,6 +21,8 @@ interface PlateBase {
   lines: CalloutLine[];
   /** Where the callout's first line starts, on the figure, when it is not under the right-hand plate. */
   at?: [number, number];
+  /** The callout's lines end at `at` rather than start there. */
+  align?: 'end';
 }
 
 /**
@@ -38,7 +40,7 @@ export type ServerPlate =
       anchorTop?: boolean;
     })
   | (PlateBase & {
-      kind: 'pc';
+      kind: 'pc' | 'call';
       site: string;
       /** The internet router its cable runs to. */
       puck: 'a';
@@ -150,4 +152,15 @@ export const NET_MAP_LAYERS: Record<string, ServerPlate> = {
     at: [420, -24],
     lines: [line('nm-name', 'Someone else'), line('nm-addr', '192.0.2.66')],
   },
+  'tcp-udp:voice': {
+    kind: 'call',
+    slot: 'N',
+    site: 'voice',
+    puck: 'a',
+    label: 'CALL.EXAMPLE.NET',
+    describe: 'Behind the internet, the voice server the call goes through.',
+    at: [290, -22],
+    align: 'end',
+    lines: [line('nm-name', 'Voice server'), line('nm-addr', '203.0.113.90 · port 16384')],
+  },
 };
diff --git a/src/art/scenes/net-map.ts b/src/art/scenes/net-map.ts
index 8930d59..27056f4 100644
--- a/src/art/scenes/net-map.ts
+++ b/src/art/scenes/net-map.ts
@@ -325,6 +325,22 @@ const KINDS = {
       tall: [[SCR.x, SCR.y, SZ + SH], [BOX.x, BOX.y, BH]],
     };
   },
+  // A voice server, on the small plate behind the internet: one rack at the back, and a pad at the front that lights
+  // while it passes the call's sound on. Its cable leaves by the plate's right-hand edge, clear of the engraved words.
+  call(p, id, o) {
+    const R = rel(p, { x: p.w - 25, y: 5, w: 19, d: 17, r: 2, h: 26 }), PD = rel(p, { x: 7, y: p.d - 17, w: 20, d: 11, r: 2 });
+    const F = [PD.x + PD.w + 2, PD.y + PD.d / 2], IN = [p.x + p.w + 3, F[1]];
+    let pad = S(k.slabOf(PD, 0, 2.4, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(PD, 1, P, 3), { tone: "faint" }) });
+    pad += L([0, 1, 2].map((i) => k.lineOnTop([PD.x + 4 + i * 4, PD.y + 3], [PD.x + 4 + i * 4, PD.y + PD.d - 3], 2.4, P)).join(""), { tone: "lo" });
+    pad += `<g class="nm-busy" id="${id}-busy-${o.site}">${S(k.slabOf(PD, 0, 2.4, P, 3, 0.4), { tone: "hi", lit: true })}</g>`;
+    return {
+      things: [{ xy: [R.x + R.w / 2, R.y + R.d / 2], svg: rack(R, 2) }, { xy: [PD.x + PD.w / 2, PD.y + PD.d / 2], svg: pad }],
+      cables: [[N[o.puck], IN, F]],
+      sites: { [o.site]: { end: [PD.x + PD.w / 2, PD.y + PD.d / 2, 3], leg: [[...F, RIDE], [...IN, RIDE]], puck: o.puck } },
+      callouts: [callTo(o, [PD.x, PD.y + PD.d, 2.4])],
+      tall: [[R.x, R.y, R.h]],
+    };
+  },
   // Any other server: two racks, and a pad at the front that lights while it works.
   host(p, id, o) {
     const racks = [rel(p, { x: p.w - 58, y: 6, w: 24, d: 26, r: 2, h: 40 }), rel(p, { x: p.w - 30, y: 4, w: 24, d: 30, r: 2, h: 46 })];
```
