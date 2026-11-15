# D10: Router, the scene and the card art (job 11)

The spec for the new Networking Concepts lesson **Router** (`router`, lesson 8 of 20): its Watch scene on the net-map figure, its routing-table panel, and its card art. The builder implements it exactly. The prototype is `prototypes/d10-router.html`.

The story is the analyst's, as written in `.superpowers/analysis/router/report.md` §2 and its Rulings. It has five steps and the places net-map already has. Nothing is added to it: no hop, no route row and no claim that §2 does not back. Step titles, narratives, facts and log info in the prototype are §2's words, used as placeholders. The author writes the lesson's own, and the dashed note in the prototype's Explain column says so.

One variant. No choice in this unit splits two ways that the owner should weigh. The open questions are at the end.

## 0. How to read the prototype

- Open `prototypes/d10-router.html` from the file system. It needs no server and no network.
- The **D10 prototype** handle sits on the right edge (on a phone, 96px from the bottom). It opens three switches:
  - Page: Lesson / Card art.
  - Theme: Light / Dark. The top bar's theme button does the same.
  - Motion: Full / Reduced.
- URL parameters:
  - `?step=0` to `?step=5` opens at the overview or at that step's start.
  - `&play=1` plays from there.
  - `&theme=light|dark` sets the theme.
  - `&page=cards` opens the card art page.
- The outline, Back, Next, Play/Pause and the speed button work as on the Lesson page. On a phone the tabs are Explain, Steps, Log and Table.
- Learn and Practice are shown only as outline entries. They keep the Lesson page's settled layout (§7) and are not part of D10.

## 1. What changes and what stays

**Stays.** These are the Lesson page as built (direction §7):

- The page's layout and console, and the stage with its figure and its table panel below.
- The log and its columns: time, source, destination, protocol, info, size.
- The phone tabs.
- The net-map drawing, its camera, its tag, trail and busy lights, its pace (SLOW and FAST), the laptop's status line and the home router's callout.
- The table panel's look: caption, by-line, header row, row height, the matched highlight, and the `tpanel__miss` tag.
- The track page's route and its cards.

**Changes.** These are new parts, each listed for the builder in §5:

| What | Where |
|---|---|
| Whose table: a `replace` may carry its own `by`, and the panel's by-line shows the latest one | schema, engine, panel |
| Two matching rows light before the winner: `match` with `keys` | schema, engine, panel, CSS |
| A `match` that found nothing shows a marked last row | engine, panel, CSS |
| Name strips on the internet routers (provider, a, b, c, d), set by unit labels | net-map art, driver, CSS |
| The DROPPED mark at a router: cue `drop <place>` | net-map art, driver, parts, CSS |
| The resolver hidden for this unit: start cue `hide resolver` | net-map art, driver, parts, CSS |
| A note's log glyph may be `dropped` | schema |
| Table events take time on net-map: 600ms for a `replace`, 900ms for a `match`; the drop note takes 900ms | net-map driver |
| Router's card art: a new spot, `router` | `spots.ts`, `figures.ts` |

## 2. The four gaps, decided

### Gap 1. One panel, four devices' tables: whose table is it?

**Decision.** Three cues together:

1. **The by-line names the owner.** Each step's first event is a `replace` that carries the owner in a new optional `by`:
   - "kept by your laptop"
   - "kept by your router"
   - "kept by your provider’s router"
   - "kept by router c"
   - "kept by router a"

   The panel shows the latest `by`, or the table's own `by` before any replace. The by-line keeps today's look (caption, muted, after the title), so the panel looks as it does on every other lesson.
2. **The step's subtitle names the same device:**
   - Step 1: "The laptop’s choice"
   - Step 2: "Your router’s table"
   - Step 3: "The provider’s router"
   - Step 4: "Router b, then router c"
   - Step 5: "Router a"
3. **Name strips on the map** (Gap 3) let a reader find "router b" or "router a".

The `replace` is each step's first event, so the panel names the step's deciding device from the start. In steps 4 and 5, router c's and router a's tables show while the packet is still on its way to them. That is on purpose: the reader sees the table that is about to be read.

**Reason.** A fixed `by` such as "of the device holding the packet" makes the reader work out the device from the map. On a phone the Table tab is apart from the map and the Explain text, so the panel has to say it on its own. The analyst's ruling 4 allows a schema change if D10 finds the panel cannot say it, and a fixed `by` cannot.

**Rejected:**
- A "focus" light on the owning router: it would need cues on table events, which have none today.
- A "Kept by" column: it repeats one value down every row and costs width at 375.

### Gap 2. A packet stopped and dropped at router a (step 5)

**Decision.** A new net-map cue, `drop <place>`, puts a lasting DROPPED mark on that router's top. The mark stays to the unit's end, and Back and Next settle it like any cue.

- It plays on a **note** event at router a. The note's log reads:
  - source: router a
  - destination: —
  - protocol: —
  - info: "No route for 192.0.2.77: packet dropped"
  - glyph: `dropped`
- The schema lets a note's glyph be `dropped`. The legend already lists the `dropped` kind.
- The isp → a message before it is **delivered**: the packet reaches router a.

**Reason.** The existing `dropped` outcome draws LOST along a cable (`dropAt` 0.1 to 0.9), which reads as "lost on the way". §2's gap (a) asks for "reaches router a and stops there". A status line at the laptop would not mark router a.

**Rejected:** allowing `dropAt` 1 on a dropped message. It plays in the wrong order (the mark comes before the table shows no match), and it leaves no mark that lasts.

### Gap 3. Do routers a to d show addresses?

**Decision.** No. They show names only, on label-tape strips:

- The words come from the unit's labels: `isp: 'provider'`, `a: 'a'`, `b: 'b'`, `c: 'c'`, `d: 'd'`.
- A unit without these labels shows no strips, so every other net-map lesson is unchanged.
- The ICMP message's source reads "router a".

**Reason.** §2 says names are enough and avoid more example numbers. The routing tables already name next hops as "router b" and "router a". A strip with the same short name matches them, where an address would make the reader translate it.

### Gap 4. Does step 3 light both matching rows before the winner?

**Decision.** Yes, in two events:

1. A `match` with `keys` and no `key` marks both candidates, 203.0.113.0/24 and 0.0.0.0/0. Each gets a tint, a dashed 3px bar in `--selected` and a "match" tag, and a screen reader hears "(a match)". The row that does not match, 198.51.100.0/24, stays plain.
2. A `match` with `key: '203.0.113.0/24'` and the same `keys` gives the winner the solid matched highlight. The loser keeps its "match" tag without the tint.

**Reason.** "When several routes match, the longest wins" (I-12) is the lesson's one non-obvious rule. Seeing two rows match and then one win is the rule itself. Words alone would leave it as a claim.

### Also decided

- **A match that found nothing** (step 5, `key: ''`). Today this shows nothing. It now shows the event's `summary` as a last row: a "no match" tag in the blocked colour, then the words, on a 3px `--blocked` bar with a 10% `--blocked` tint. The reader sees the table was read and failed.
- **The resolver is hidden in this scene** by a start cue, `hide resolver`. net-map draws the resolver at 192.0.2.53, cabled to router a. Step 5's unroutable address is 192.0.2.77, in the same RFC 5737 block. A reader who sees 192.0.2.53 on router a would ask why router a has no route to 192.0.2.77. RFC 5737 has only three blocks, and the other two are in use (198.51.100.x for the provider link, 203.0.113.x for example.net), so there is no fourth block to move to. This is open question 1.
- **Tags** are "PACKET" and "UNREACHABLE", in capitals, as What is IP's tags are. §2 wrote "Packet" and "Unreachable"; the figure's tags are capitals everywhere.
- **Times and sizes** are "—". §2 states no size, and no step has a time a source backs. This is open question 2.
- **Views:** `['network']` only. The story is about each router's table, which the network view shows. A sequence view would draw five lifelines at 375px for no gain.

## 3. The steps

Every row below is what the prototype plays.

**IDs.** Event ids are the builder's (say `s1-table`, `s1-match`, `s1-packet` and so on).

**The `plain` text.** Every event's `plain` is the author's. The `summary` words below are placeholders, except where marked as design copy.

**Common to every message:**
- protocol "IPv4" (except the ICMP note), time "—", size "—", kind `request`, tag "PACKET".
- The pace is SLOW unless marked FAST.

### The unit's scene

| Field | Value |
|---|---|
| figure | `net-map` |
| views | `['network']` |
| layers | `['ip:web']` (example.net, 203.0.113.80, behind router c) |
| labels | `laptop: 'Sending a packet'`; `router: '192.168.1.1 inside\n198.51.100.23 outside'`; `isp: 'provider'`; `a: 'a'`; `b: 'b'`; `c: 'c'`; `d: 'd'`. No `url` label: the laptop's address bar stays empty. |
| start | `[{ cue: 'hide', arg: 'resolver' }]` |
| panel | `{ type: 'table', table: routes }` (below) |
| legend | `request` "Packet"; `control` "Error message"; `dropped` "Dropped" |
| OSI | layer 3 (the analyst's badge, §6) |

The table definition `routes`:

| Field | Value |
|---|---|
| id | `routes` |
| title | "Routing table" |
| by | none (each `replace` brings its own) |
| columns | `network` "Network"; `hop` "Next hop". Both mono, not prose; no fixed widths. |
| keyColumn | `network` |
| initialRows | `[]` |
| empty | "Each device on the way shows its routing table here, in turn." |

### Step 1. Near or far?

- **Subtitle:** "The laptop’s choice".
- **Step status:** "Not on my network: send to the gateway".
- **Backed by:** I-3, I-5, I-13, I-17.

| # | Event | What shows |
|---|---|---|
| 1 | table `replace`, `by: 'kept by your laptop'`, rows `192.168.1.0/24` → "directly (this network)"; `0.0.0.0/0` → "192.168.1.1 (default gateway)". Summary: "Your laptop’s routing table: two routes." | The panel fills; the by-line reads "kept by your laptop". |
| 2 | table `match`, `key: '0.0.0.0/0'`. Summary: "Only the default route, 0.0.0.0/0, matches 203.0.113.80." | The 0.0.0.0/0 row is highlighted (matched). |
| 3 | message laptop → router, source 192.168.1.100, destination 203.0.113.80, info "To 203.0.113.80, via the default gateway, TTL 64" | The tag rides to the home router; the home LEDs light. |

### Step 2. Your router: one way out

- **Subtitle:** "Your router’s table".
- **Backed by:** I-6, I-9, I-13, I-14, I-17, I-23 (the source).

| # | Event | What shows |
|---|---|---|
| 1 | table `replace`, `by: 'kept by your router'`, rows `192.168.1.0/24` → "directly (home)"; `198.51.100.0/24` → "directly (link to provider)"; `0.0.0.0/0` → "198.51.100.1 (provider’s router)". Summary: "Your router’s routing table: three routes." | By-line "kept by your router". |
| 2 | table `match`, `key: '0.0.0.0/0'`. Summary: "Only the default route matches: next hop 198.51.100.1." | 0.0.0.0/0 highlighted. |
| 3 | message router → isp, source 198.51.100.23, destination 203.0.113.80, info "Default route: to the provider’s router, TTL 63" | The tag rides to the provider's router; its strip reads "provider". |

### Step 3. The most specific route wins

- **Subtitle:** "The provider’s router".
- **Backed by:** I-7, I-11, I-12, I-13.

| # | Event | What shows |
|---|---|---|
| 1 | table `replace`, `by: 'kept by your provider’s router'`, rows `198.51.100.0/24` → "directly (customers)"; `203.0.113.0/24` → "router b"; `0.0.0.0/0` → "router a". Summary: "Your provider’s router’s routing table." | By-line "kept by your provider’s router". There is no row for 192.0.2.0/24, which step 5 needs. |
| 2 | table `match`, `keys: ['203.0.113.0/24', '0.0.0.0/0']`, no `key`. Summary: "Two routes match 203.0.113.80: 203.0.113.0/24 and 0.0.0.0/0." | Both rows are candidates: tint, dashed bar, "match" tag, one pulse. |
| 3 | table `match`, `key: '203.0.113.0/24'`, `keys` as above. Summary: "The longer one, 203.0.113.0/24, wins: next hop router b." | 203.0.113.0/24 is highlighted (matched). 0.0.0.0/0 keeps its "match" tag, untinted. |
| 4 | message isp → b, source 198.51.100.23, destination 203.0.113.80, info "Longest match: 203.0.113.0/24, to router b, TTL 62" | The tag rides to router b. |

### Step 4. Hop by hop to the server

- **Subtitle:** "Router b, then router c".
- **Backed by:** I-8, I-9, I-16, I-17.

| # | Event | What shows |
|---|---|---|
| 1 | table `replace`, `by: 'kept by router c'`, rows `203.0.113.0/24` → "directly (example.net’s network)"; `0.0.0.0/0` → "router b". Summary: "Router c’s routing table." | By-line "kept by router c". The 0.0.0.0/0 row is §2's optional row, kept: it shows that router c, too, has a way out. |
| 2 | message b → c, info "To router c, TTL 61" | The tag rides to router c. |
| 3 | table `match`, `key: '203.0.113.0/24'`. Summary: "203.0.113.0/24 matches: example.net’s network, connected directly." | 203.0.113.0/24 highlighted. |
| 4 | message c → web, info "Delivered to 203.0.113.80, TTL 60", cue `status-done` with status "Delivered" | The tag rides to example.net; the status line reads "Delivered" in the done style. |

Router b's own table is not shown. §2 has no table for router b, so this spec adds none. The step's narrative says that router b looks it up.

### Step 5. No route: dropped, and a note comes back

- **Subtitle:** "Router a".
- **Backed by:** I-20, I-21, I-23. I-22 is optional, in Go deeper.

| # | Event | What shows |
|---|---|---|
| 1 | table `replace`, `by: 'kept by router a'`, rows `203.0.113.0/24` → "router b"; `198.51.100.0/24` → "provider’s router". Summary: "Router a’s routing table: no default route." | By-line "kept by router a". There is no 0.0.0.0/0 row. |
| 2 | message laptop → isp, **FAST**, source 198.51.100.23, destination 192.0.2.77, info "To 192.0.2.77, by default routes to the provider’s router, TTL 63" | One ride over the home router to the provider's router, as §2 allows. The row describes the packet as it reaches the provider's router (after NAT, after one hop), hence 198.51.100.23 and TTL 63. |
| 3 | message isp → a, source 198.51.100.23, destination 192.0.2.77, info "Default route: to router a, TTL 62" (delivered) | The tag reaches router a and stops there. |
| 4 | table `match`, `key: ''`. Summary: "No route in router a’s table covers 192.0.2.77." | The no-match row appears below the two routes. |
| 5 | note at a, glyph `dropped`, cue `drop a`. Log: source "router a", destination —, protocol —, info "No route for 192.0.2.77: packet dropped". | The DROPPED mark appears on router a's top and stays. The log row has the dropped glyph. |
| 6 | message a → laptop, kind `control`, tag "UNREACHABLE", protocol ICMP, source "router a", destination 198.51.100.23, info "Destination unreachable: network unreachable (type 3, code 0)", cue `status` "No route: dropped" | The tag rides back over the provider's router and your router to the laptop (ruling 3). The status line reads "No route: dropped" (plain style, not done). |

### What each position shows when settled (Back, Next, outline)

| Position | Figure | Panel | Status line |
|---|---|---|---|
| Overview | Resolver hidden; strips shown; no mark | Empty text | "Sending a packet" |
| Step 1 start | as overview | Empty text, until the replace plays | "Not on my network: send to the gateway" |
| Step 2 start | as overview | The laptop's table, no highlight | step 1's last state: "Not on my network: send to the gateway" |
| Step 5 start | as overview | Router c's table, no highlight | "Delivered" (done style), from step 4's played cue |
| Step 5 end | DROPPED on router a | Router a's table plus the no-match row | "No route: dropped" |

A table event's highlight, candidates and no-match row last for their step only, as `highlight` does today. A step's start shows the table as the step before left it, with no marks.

## 4. Sizes, spacing and breakpoints

### The panel

| Part | Rule |
|---|---|
| Rows | Today's: 13.5px mono cells, today's padding, today's `matched` highlight |
| Candidate row | `background-color: var(--tint)`, text `var(--ink-strong)`. First cell: `background-image: repeating-linear-gradient(var(--selected) 0 4px, transparent 4px 7px)`, `background-size: 3px 100%`, no repeat. With motion allowed: `animation: tpanel-pulse 900ms var(--ease-out) 1` (the existing keyframes). |
| "match" tag | The existing `tpanel__miss` tag, words "match", after the network |
| No-match row | One cell, `colspan` 2. `padding: 6px 10px`, no bottom border. Background `color-mix(in srgb, var(--blocked) 10%, transparent)` with a solid 3px `--blocked` bar on the left. Text 400 13.5px/1.4 sans in `--ink-strong`. It begins with a `tpanel__miss` tag reading "no match": border and words `--blocked`, `margin: 0 8px 0 0`. |
| By-line | Today's look and place. The text is the latest `replace`'s `by`. |
| `aria-label` | "Routing table, kept by …" |

### The figure (SVG units, drawn at build time)

**The name strip.** For each of `isp`, `a`, `b`, `c` and `d`:

- **Group:** `<g class="nm-strip" id="nm-name-<place>" display="none">`, holding a `rect` (height 17, `rx` 2) and a `text` (`text-anchor="middle"`).
- **Position:** the rect's top-left is the router's puck top plus `NAME_AT[place]`:

  | Place | Offset |
  |---|---|
  | isp | [−50, −24] |
  | a | [−34, −30] |
  | b | [12, −22] |
  | c | [12, −28] |
  | d | [12, 4] |

  The puck top is `at([N.x, N.y, PUCK_H])`; the camera gives isp (158.7, 133.9), a (214.7, 108.3), b (226.3, 142.1), c (289.3, 140.9), d (226.3, 167.8).
- **Width:** 11 + 7.4 × the number of characters. "provider" is 70.2; one letter is 18.4.
- **Text:** baseline at the rect's top + 12.6, centred.
- **Style:** rect fill `--fig-bg`, 1px `--line-strong` stroke, non-scaling. Text 700 12px/1 mono in `--ink-strong`.
- **Layer:** the strips go at the end of `#nm-l-calls`, so they sit over cables and pucks.
- **Shown** only when the unit has that label. The text is the label.

**The drop mark.** `<g class="nm-drop nm-discard" id="nm-discard" style="opacity:0">`, placed after `DROP`, with `transform` set to the router's puck top. It holds:

- a ring, r 8, and a cross from (−3.6, −3.6) to (3.6, 3.6) and from (3.6, −3.6) to (−3.6, 3.6);
- a pill: `x 11`, `y −6.5`, 50 × 13, `rx 6.5`;
- the word "DROPPED", centred at x 36, baseline 3, at 8px.

It reuses `.nm-drop`'s ring, cross and pill colours. `pointer-events: none`.

**The resolver.** The parts to wrap, each in `<g data-base="resolver">`:

- the resolver plate's under and over;
- its cable to router a;
- its cabinet;
- its callout.

`.nm [data-base][data-hidden] { display: none }`.

### Measured

Before is What is IP on the live dev site, the same figure and panel. After is the prototype.

**At 1440 × 900:**

| | Figure box | Drawing | Panel |
|---|---|---|---|
| Before, empty table | 733 × 398 | | |
| Before, 3 rows | 733 × 351 | | 147 |
| After, overview | 733 × 398 | 721 × 398 | 100 |
| After, step 1 | 733 × 380 | 688 × 380 | 118 |
| After, steps 2 and 3 | 733 × 351 | 637 × 351 | 147 |
| After, step 4 | 733 × 380 | 688 × 380 | 118 |
| After, step 5 with the no-match row | 733 × 349 | 632 × 349 | 149 |

- The panel never scrolls.
- Strip text renders at 11.1px.

**At 375 × 812:**

| | Before | After |
|---|---|---|
| Figure box | 375 × 235 | 375 × 235 |
| Drawing | 375 × 207 | 375 × 207 |
| Smallest map words | callout names, 6.3px | strip text 6.6px; the DROPPED word 4.4px, its ring and cross carrying it |
| Table tab | | 347px wide, no sideways scroll. 101px tall at the overview, 143 at step 3, 162 at step 5. |
| Page | | 375 × 812, no page scroll |

### Breakpoints

None new. The Lesson page's own apply: the phone layout below 761px, with `:root.js` and `data-tab`. The strips and the mark are in the SVG and scale with it.

On the phone the Table tab shows the existing `.tab__mark` when the table changes while another tab is showing. Every `replace` and `match` counts as a change.

## 5. For the builder: every code change

1. **Schema** (`src/content/schema.ts`).
   - `tableEventSchema`:
     - add `by: text.optional()`, allowed only on `replace` (refine);
     - add `keys: z.array(z.string()).min(2).optional()`, allowed only on `match` (refine).
     - A `match` must have `key` or `keys`. When it has both, `key` must be in `keys`.
   - `noteEventSchema.glyph` becomes `z.union([messageKindSchema, z.literal('dropped')]).optional()`. The validator already requires the legend to explain a glyph; `dropped` is a legend kind.
2. **Engine** (`src/engine/tables.ts`). `TableState` gains:
   - `by: string | null`: set by a `replace` with `by`, kept until the next one. It starts as `null`, which means the panel shows the table's own `by`.
   - `candidates: string[]` and `matches: string[]`: from a `match` with `keys`. With no `key`, both are `keys`. With `key`, `candidates` is `[]` and `matches` is `keys`.
   - `noMatch: string | null`: the summary of a `match` with `key: ''`.

   Candidates, matches and noMatch last one step, as `highlight` does, and a `replace` clears them. `highlightFor` gives no highlight to a `match` with `keys` and no `key`.
3. **Panel** (the table panel component and `table.css`).
   - The by-line text is `state.by ?? def.by`.
   - A row whose key is in `candidates` gets `data-candidate`. A row in `matches` that is not the highlight gets a `tpanel__miss` tag reading "match". A candidate's screen-reader text is " (a match)".
   - With `noMatch`, a last `<tr class="tpanel__nomatch">` holds one cell spanning all columns: a `tpanel__miss` tag "no match", then the words.
   - The CSS is in §4. It is also in the prototype's `<style>` under "D10: Router's new parts".
4. **net-map art** (`src/art/scenes/net-map.ts`).
   - The five strips (§4).
   - The `#nm-discard` mark (§4).
   - The `data-base="resolver"` wrapping.
   - CSS for `.nm-strip`, `.nm-discard .nm-drop-t { font-size: 8px }` and `[data-base][data-hidden]`, in `net-map.css`.
5. **Parts** (`src/art/scenes/parts.ts`), net-map cues:
   - add `drop: 'text'` (the arg is a place: `isp`, `a`, `b`, `c` or `d`);
   - add `hide: 'text'` (the arg is `resolver`, the only value; the validator rejects others).
6. **net-map driver** (`src/scenes/drivers/net-map.ts`).
   - **Labels:** the label keys `isp`, `a`, `b`, `c` and `d` show and fill the strips, with each width per §4.
   - **The `drop` cue** places `#nm-discard` at that place's puck top and sets it to opacity 1. It is settled by `settle()` and `paint()` like every cue, so it shows at every later position and clears before it.
   - **The `hide` start cue** sets `data-hidden` on `[data-base="<arg>"]`.
   - **`duration()`:**
     - a table event takes 600ms for a `replace` and 900ms for a `match` (at 1×, divided by the speed);
     - a note takes 900ms when it has a `drop` cue, 0 otherwise.

     Other figures' drivers are unchanged. Subnetting's table events are on its own figure.
   - With reduced motion the durations stay; nothing moves within them.
7. **Card art.**
   - Add `router()` to `src/art/figures/spots.ts`. The prototype's `<svg>` in the card page is the reference, drawn with the kit in `common.ts` (§6).
   - Add `router` to `SPOTS`, and `router: () => spot('router')` to `FIGURES` in `src/lib/figures.ts`.

The lesson file itself (`src/content/lessons/router.ts`) is the author's, from §3.

## 6. The card art

A spot in the family of OSI Model, Subnetting, DHCP and Firewalls: 528 × 372, kit helpers, one lit part.

**Plate.** Its label is "ROUTING TABLE · NEXT HOP".

**The router.** A round router at [14, −22], radius 25, height 12. On its top are a ring and four arrows pointing out. It has three LEDs, the middle one on.

**The cables.** Three, of radius 1.9:
- one in from the left edge;
- two out, one to the back edge and one to the right edge.

**The lit part.** One packet slab, `{x: 64, y: −30, w: 22, d: 16}`, at z 3.4 and height 7, on the way out to the right.

**The table board.** It stands in front at `{x: −96, y: 26, w: 92, d: 7}`, 40 high, on two feet. It has three rows in `lm-rule` text, each with a slot:
- "198.51.100.0/24"
- "203.0.113.0/24", with its LED on (the chosen route)
- "0.0.0.0/0"

**aria-label:** "A round router where three cables meet, one coming in and two going out. A lit packet travels down one of the ways out. In front stands its routing table, three routes long, with the route it chose marked."

**Measured.** At 1440 the route card's art box is 168 × 124. On a phone it is 207 × 124 on the live site and 247 × 124 in the prototype's narrower copy. The router and the lit packet read at both sizes. At 168 wide the table words are texture; the LED row reads as "one chosen".

### Networking's route after B11

The prototype's card page shows parts 3 to 6: the spots of Subnetting, Router and DHCP; the name tiles of DNS, HTTP, HTTPS and TLS/SSL; then Firewalls.

**Verdict: it reads well at 375 and 1440, and no fix is proposed.**
- The four name tiles sit together (13 to 16), and a tile tells the reader that the lesson is the tour's.
- The spots and the tiles share the art box, its size and its border.
- Two minor notes, neither worth a change now:
  - At 1440 the tile's dot grid echoes the not-ready placeholders. The status word, the Start button and the bright name tell them apart.
  - On a phone the tile repeats the title ("DNS", then "DNS"), as the How the Internet Works track already does.

## 7. Copy

Every word new to the site. Everything else is §2's placeholder text for the author.

| Where | Words |
|---|---|
| Panel title | Routing table |
| Panel column labels | Network · Next hop |
| Panel empty text | Each device on the way shows its routing table here, in turn. |
| By-lines | kept by your laptop · kept by your router · kept by your provider’s router · kept by router c · kept by router a |
| Panel tags | match · no match |
| Screen-reader text | (a match) |
| Step subtitles | The laptop’s choice · Your router’s table · The provider’s router · Router b, then router c · Router a |
| Map strips | provider · a · b · c · d |
| Drop mark | DROPPED |
| Tags | PACKET · UNREACHABLE |
| Legend | Packet · Error message · Dropped |
| Status lines | Not on my network: send to the gateway · Delivered · No route: dropped (§2's words) |
| Card aria | as §6 |
| Card plate | ROUTING TABLE · NEXT HOP |

Sentence case throughout, and no time figures. The map's engraved labels and tags are in capitals, as on the rest of net-map.

## 8. Acceptance checks

Each check can be tried on the prototype and turned into a test.

**Schema**

1. A `replace` with `by` validates. A `match` or an `add` with `by` fails validation.
2. A `match` with `keys` of one item fails. A `match` with `key` not in `keys` fails. A `match` with neither `key` nor `keys` fails.
3. A note with `glyph: 'dropped'` validates. A note with `glyph: 'blocked'` fails.
4. The cue `hide` with an arg other than `resolver` fails. The cue `drop` with an arg that is not `isp`, `a`, `b`, `c` or `d` fails.

**Engine and panel**

5. After step 1's replace, the by-line reads "kept by your laptop". After step 3's replace, "kept by your provider’s router". Back to step 2's start, "kept by your laptop" (step 1's replace, settled).
6. Before any replace, the panel shows "Each device on the way shows its routing table here, in turn." and no by-line (the table has no `by`).
7. After step 3's first `match`, exactly two rows have `data-candidate`: 203.0.113.0/24 and 0.0.0.0/0. 198.51.100.0/24 has neither the candidate mark nor a tag.
8. After step 3's second `match`, 203.0.113.0/24 is the matched highlight and has no "match" tag. 0.0.0.0/0 has a "match" tag and no `data-candidate`.
9. At step 4's start, no row of the panel has `data-candidate`, a "match" tag or the highlight.
10. After step 5's `match` with key '', the last row is `tr.tpanel__nomatch` with "no match" and the summary. At the overview it is gone.
11. With reduced motion, no candidate row animates.
12. On a phone, with the Explain tab showing, a table event puts the mark on the Table tab. Opening the Table tab clears it.
13. At 375 the panel has no horizontal scroll at any step (scrollWidth ≤ clientWidth).

**Figure**

14. In Router's scene, every `[data-base="resolver"]` has `data-hidden` at every position. In What is IP's scene, none has.
15. In Router's scene, the five strips show "provider", "a", "b", "c" and "d". In What is IP's scene, none shows.
16. No two strips' boxes overlap, and no strip overlaps the DROPPED mark at step 5's end (bounding boxes in SVG units).
17. `#nm-discard` has opacity 0 at every position before step 5's note plays. After it plays, it has opacity 1 at router a's puck top (214.7, 108.3), at step 5's end. Back to step 5's start, it has opacity 0 again.
18. The isp → a message is delivered: no LOST mark shows at any time in step 5.
19. Step 4's last message leaves the status "Delivered" in the done style. Step 5's last leaves "No route: dropped" without it.

**Timing**

20. At 1×, a `replace` takes 600ms and a `match` 900ms on net-map. The drop note takes 900ms. Every other note takes 0. At 2×, each takes half.
21. Playing step 3, the candidates are on screen for at least 900ms at 1× before the winner shows.

**Log**

22. Step 5 adds four rows in this order: the packet to the provider (FAST), the packet to router a, the dropped note (dropped glyph, source "router a"), and the ICMP message (control glyph, protocol ICMP, destination 198.51.100.23).
23. The legend lists Packet, Error message and Dropped, and only those.

**Card art**

24. The Networking track page shows Router's spot at stop 8, with the aria text of §6. No lesson card throws "has no figure".
25. The spot has one lit part (the packet slab) and one LED on in the table board's rows.

## 9. Open questions for the owner

1. **The resolver and 192.0.2.77.** Router's scene hides the resolver, so that 192.0.2.53 on router a does not contradict router a's having no route to 192.0.2.77. The other fix is to keep the resolver and use an address outside RFC 5737 for step 5. That needs a source for a documentation address that is not routable, and none is in the registry. Recommendation: hide it.
2. **Times as dashes.** Every time cell is "—". If the author wants times, they need a source. Recommendation: keep dashes.
3. **The unit's full name and subtitle** (the Overview's "Getting between networks") are placeholders for the author.
4. **Short tables.** Each table shows only the routes the story needs, so "the provider's router has many routes" is said in words, not shown. One "…" row would show it but adds a row that is not a route. Recommendation: words only.
5. **The by-line's weight.** It keeps today's muted caption look. If the owner finds "whose table" too quiet, the by-line could take `--ink-strong`. That is a one-line change, and it would change every lesson's panel.
6. **Strip size on a phone.** The strips render at 6.6px at 375, a little above today's callout names (6.3px). They are legible on a phone screen but small. The map does not grow at 375 without changing the Lesson page.
7. **The card mix** after B11 is accepted as it is (§6). The owner may want the tiles' dot grid changed so it no longer echoes the not-ready placeholders. That would be a track page unit, not this one.
