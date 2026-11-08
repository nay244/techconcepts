# OSI Model lesson: design

Direction doc §10 task 9, first lesson: Networking Concepts › The big picture › 1 · OSI Model, slug `osi-model`. Branch `feat/osi-model`. One PR for this lesson, as task 6 was split across PRs.

## 1. Intent

OSI Model opens the Networking track, so it gives a beginner the frame every later lesson hangs on: seven layers, each doing one job for the layer above it. A message goes down the layers on the sender, picking up a header at each one. It crosses the links, where a router reads only the lowest three layers. Then it goes up the layers on the receiver, and each layer reads the header its twin added.

It is the first lesson written to the cited shape (`docs/content-model.md` §3) and the first one through the fact-checker (§8). It also needs a scene type the engine doesn't have yet, so it adds a figure, a driver and a panel.

**Goals**
- A beginner can name the seven layers in order, say what "a layer adds a header" means, and say why a router needs only layers 1 to 3.
- Every Learn statement, Go deeper paragraph and Practice option cites a current primary source at the exact section. Every Watch line traces to Learn. The fact-checker passes the lesson with every item ✅.
- The new figure is in the family: Anatomy kit, lumen finish, one plate and one camera. It reads in both themes.

**Non-goals**
- Field-by-field headers (Ethernet, IP, TCP). Later lessons cover those (Packets, IP Address, TCP/UDP).
- A mnemonic for the layer order. It would be an uncited claim about nothing.
- Phone and tablet layouts (task 8). Design and check at desktop widths, keeping layouts fluid.

**Anti-goals**
- Watch saying anything Learn doesn't. In particular, Watch does not show the router replacing the layer-2 header for the next link: no source for it has been read yet.
- Presenting the internet's protocols as OSI protocols. The internet uses its own four-layer model (RFC 1122 §1.1.3). Learn says so in Go deeper, and the badge says "Spans layers".

## 2. Decided

- **Owner, 2026-11-08: scene style A, solid blocks.** Each layer is a block on a spine, with its number and name engraved on the front. The block doing the work is the lit part. Three stacks stand on one plate: the laptop's seven, a router's three, and the web server's seven. The same layer sits at the same height in every stack, so twins line up. A cable joins the bottoms. Style B (open rack) was set aside.
- **Owner, 2026-11-08: the Watch mockup is approved.** That covers six steps, the message strip under the scene, and the log of what each layer did. The mockup's script and screens are git-ignored: `.superpowers/brainstorm/2830-1793891117/figs/osi-scene.mjs` (figure), `osi-watch.mjs` (page), and `.superpowers/brainstorm/32739-1794175764/content/osi-watch-5.html` (last screen).
- The draft words in the mockup are replaced by §5 below.

## 3. The figure `osi`

Add `'osi'` to `FigureId` (`src/art/scenes/types.ts`), `figureIdSchema`, `DRAW` (`src/art/scenes/index.ts`) and `FIGURE_PARTS` (`src/art/scenes/parts.ts`). The figure lives in `src/art/scenes/osi.ts` and `osi.css`, ported from the mockup's `osi-scene.mjs` `liveSvg()`. Port it the way the other figures were ported, so the drawing is identical.

**Geometry** (from the mockup, world units):
- The plate is `{x:-112, y:-74, w:224, d:148, r:10}`, as in the firewall figure.
- Each stack's footprint is a 34 × 34 square.
  - The laptop's stack is centred at (-42, 52), the router's at (10, 0), and the server's at (62, -52).
- Layer *n* sits at z = 2 + (n-1)·11 and is 8 high. A spine cylinder of radius 5 joins neighbouring blocks.
- The cable runs between the stacks' facing corners.
  - A message rides from 3 units outside one footprint to 3 units outside the next.
  - After it arrives, it waits at the cable's end until the next machine's layer 1 is lit.
- Callouts sit off the plate:
  - "Your laptop / sends" above the laptop's stack;
  - "Web server / receives" above the server's;
  - "Router / passes it on" below the plate, under the router, so the peer lines never cross it.
- The plate's engraving reads `OSI REFERENCE MODEL · SEVEN LAYERS`.

**Words on the figure come from the lesson** (call made after the builder check). Words a reader sees must be on the claim sheet, so the fact-checker checks them, and the figure doesn't hard-code them. That covers each block's engraved number and name, the three callouts, and the plate's engraving.
- They live in the unit's `scene.labels`, which the sheet already covers, keyed by part:
  - `layer-1` … `layer-7`: `PHYSICAL` … `APPLICATION`; the figure engraves the number itself;
  - `laptop`, `laptop-sub`, `router`, `router-sub`, `server`, `server-sub`;
  - `plate`.
- The figure draws empty text where each word goes, and the driver writes them in, as the net-map driver writes `labels.router`.
- A missing key fails the build. How the validator knows the required keys is the builder's call.
- If the console shows figures without JavaScript, the words must show there too. Check `src/lesson/no-script.test.ts`, and fill them in at build time if needed.
- The layout matches the mockup. Only the source of the words changes.

**Drawing.** Draw each block once. The driver lights a block by setting the kit's lit state on it, and sets the engraved name's ink to dark-on-lit (`color-mix(in srgb, var(--lit-b) 30%, #000)`). The mockup's two drawings per block are not needed. The page must stay within the build's budgets: 250 KB of gzipped HTML.

**Parts** (`FIGURE_PARTS.osi`):
- `places`: `laptop`, `router`, `server`.
- `cues`:
  - `layer` (text). Its arg is `<place>:<n>`. It lights that block and unlights the one lit before.
  - `peer` (text). Its arg is `<n>`. It lights layer *n* in every stack that has it, and shows the dashed peer line(s) for *n*.
    - Lines 4 to 7 run laptop ↔ server.
    - Lines 1 to 3 run laptop ↔ router ↔ server.
    - Lines already shown stay shown within the step.
- An arg the figure can't show fails the build: router layers above 3, layer 0 or 8, or an unknown place. How the validator learns the allowed args is the builder's call. `FigureParts` may grow an optional per-cue list of allowed args.
- `layers: []`, `board: false`, `start: false`.
- `labels: true`: the new field in §4.

**Messages.** A `message` event from `laptop` to `router`, or from `router` to `server`, rides the cable as a lit tag. The tag reads `0101` (the mockup's), and its kind is `request`. A message between any other pair of places fails, as on the other figures.

**Peer Layers is the one step that lights more than one block at a time**: the twins, two or three blocks. Every other position lights one block. This is a deliberate exception to the "one lit part" rule, shown in the approved mockup.

**Driver** (`src/scenes/drivers/osi.ts`, registered in `drivers/index.ts`): handles the two cues and the ride. It follows the firewall and net-map drivers' shape, including reduced motion (the tag jumps) and showing any position from scratch. Its markup must match after any sequence of positions, as the other drivers' sweep tests check.

## 4. The message panel (new panel type `labels`)

The strip under the scene shows which headers the message carries at this point, outermost first, then the data.

- **Schema.** `panelSchema` gains `{ type: 'labels' }`. `noteEventSchema` and `messageEventSchema` gain an optional field:
  ```
  labels: { list: number[], mark?: { n: number, kind: 'new' | 'read' } }
  ```
  - `list` holds distinct layer numbers 2 to 7 in ascending order; the outermost header is the lowest number.
  - `mark.n` must be in `list`.
  - The field is allowed only when the figure's parts say `labels: true` and the unit's panel is `labels`, as `board` is for Subnetting.
- **Component.** `src/lesson/panels/LabelsPanel.tsx` and `labels.css`, chosen in `UnitPanel`. It shows the latest `labels` from the events played so far in the unit, carried across steps as the console's state already is. Before any event, it shows the data alone.
  - Each header is a chip `L<n>`, then a dashed `data` chip.
  - A `new` mark fills the chip in our blue (`#2f7bff`, edge `#a8e8ff`). A `read` mark outlines it in the marigold "here" accent.
  - On the right it shows "<n> headers, outermost first", or "No headers yet".
- **Accessibility.** The panel's text, read as a whole, says the same: "Headers on the message: layer 4 (just added), 5, 6, 7, then the data." Colour is never the only signal; the mark also changes the chip's border. Changes are announced through the console's existing live region, not a second one.

## 5. The lesson

`src/content/lessons/osi-model.ts`, cited shape, one unit, `figure: 'osi'`. In the voice of `lesson-voice-beginner-first`: plain words first, the term after, exam detail in Go deeper. Within the Networking limits: 6 steps; 2 to 4 facts a step; narratives of 120 words or fewer; a hook of 80 words or fewer; Go deeper paragraphs of 90 words or fewer. No overrides are expected.

**Metadata**
- title `OSI Model`
- level `beginner`
- certTags `['a-plus', 'network-plus', 'ccna']`
- `osi: 'spans'`. The lesson is about all the layers, so a single layer would be wrong (direction doc §6.4).

**Overview.** The hook is about 55 words: "Sending a message across a network is one big job. The OSI model splits it into seven smaller jobs, stacked one on top of another. Each one is a **layer**. A layer does its own job and leans on the layer below it." It traces to lead-1 and lead-2. The description is "Follow one message from your laptop to a web server: down seven layers, through a router, and up seven more." Facts: Layers · 7 (lead-1); Example · a laptop and a web server (example).

**Scene.** Views: network only (no Sequence view). Panel: `labels`. Labels: the figure's words, as in §3. The layer names trace to lead-1. The callouts are the example parties ("Your laptop / sends", "Router / passes it on", "Web server / receives"), and they trace to lead-4 and lead-5. The plate reads `OSI REFERENCE MODEL · SEVEN LAYERS` and traces to lead-1 and fact-3. The log, titled "What each layer did", has columns `where` (Where), `layer` (Layer, mono) and `plain` (What happened). Its legend has two entries: request = "Bits on the cable", note = "A layer's job".

**Steps.** The title is a Title Case technical term; the sub line says the same in plain words. Each step's facts trace to the Learn ids shown. Each step's Go deeper cites directly.

| # | Title · sub | What plays | Facts → Learn |
|---|---|---|---|
| 1 | **Application Layer** · The message enters at the top | `layer laptop:7`; labels `[7]` new 7 | Layer · 7 Application → lead-1; Adds · its own header → lead-3 |
| 2 | **Encapsulation** · Each layer adds its own header | `layer laptop:6` … `laptop:2`, each adding its number, marked new | Layers · 6 down to 2 → lead-1; Each one adds · a header → lead-3; Called · encapsulation → term-encap |
| 3 | **Physical Layer** · The bundle leaves as bits | `layer laptop:1`; message laptop → router | Layer · 1 Physical → lead-1; Sends · bits → lead-4 |
| 4 | **Relay** · A router reads up to layer 3 | `router:1`, `router:2` (read 2), `router:3` (read 3), `router:2`, `router:1`; message router → server | Uses · layers 1 to 3 → lead-5; Reads · headers 2 and 3 → lead-5 |
| 5 | **Decapsulation** *(fallback in §10)* · Each layer reads its twin's header | `server:1`, then `server:2` … `server:7`, each reading and removing its number | Order · 1 up to 7 → lead-4; Each layer · reads and removes its twin's header → lead-6 |
| 6 | **Peer Layers** · Each layer talks to its twin | `peer 7` … `peer 1`; labels `[]` | Layers 4 to 7 · end to end → why-2; Layers 1 to 3 · hop by hop → lead-5 |

**Narratives.** The mockup's words, revised to say **header** where it said "label":
- Step 1 introduces the idea, then the term: "adds a small note in front, called a **header**, for layer 7 on the other side".
- Step 3 drops "adds no label". No source states it. The strip simply doesn't change at layer 1.
- Step 4 says the router reads headers 2 and 3 and "works out where the message goes next". It doesn't say the router replaces header 2.
- Step 5 says each layer "reads the header its twin added", and doesn't name the machine that added it. Call made after the builder check: for layers 1 to 3 the twin is the router (step 6, lead-5). "The header your laptop added" would be wrong for those layers, and showing the router's new layer-2 header would need a source that hasn't been read yet. The server's log rows say "Reads header n and removes it", with no machine named.

**Step Go deeper** (one paragraph each):
1. The Application Layer is an application's only way into the OSI environment, so nothing sits above it. Source: X.200 7.1.2.1.
2. Layers 6 and 5. The Presentation Layer gives both ends a common representation of data; the Session Layer organizes and synchronizes their dialogue. Source: X.200 7.2.2.2 and 7.3.2.1.
3. The Physical Layer provides the means for bit transmission over a physical medium. The Data Link Layer recognizes a sequence of bits as its unit, which is sometimes called framing, and detects errors from the layer below. Sources: X.200 7.7.2, 7.6.4.5 and 7.6.2.2; Microsoft #physical-layer.
4. In the standard, a system that only passes data on is a *relay open system*, and the functions for forwarding are in the lower layers. Source: X.200 6.1.6.
5. Each layer passes the data inside, untouched, to the layer above. A layer doesn't interpret the data it carries for the layer above. Source: X.200 5.6.1.4.
6. Same-layer cooperation is governed by that layer's protocol. Transport protocols run only between the two end systems. Source: X.200 5.2.2.7 and 7.4.2.3.

**Learn** (ids are stable; "def" marks a defining-standard citation, which may stand alone):

| id | Statement (gist) | Cites |
|---|---|---|
| lead-1 | Networking is split into **seven layers**, numbered 1 at the bottom to 7 at the top: Physical, Data Link, Network, Transport, Session, Presentation, Application. | X.200 6.1.2 def |
| lead-2 | Each layer does its own job and offers a service to the layer above it. | X.200 5.2.2.3 def; Microsoft (intro, text fragment) |
| lead-3 | On the way down, each layer adds its own control information in front, a **header**, to what the layer above handed it. | X.200 5.6.1.1, 5.6.1.3 def; NIST SP 800-77r1 §2.1 (footnote 6); RFC 1122 §1.3.3 |
| lead-4 | The lowest layer sends the whole bundle as bits over the physical medium, and at the other end it is passed back up, layer by layer. | X.200 7.7.2 def; NIST SP 800-77r1 §2.1 |
| lead-5 | A **router** passes messages on using only layers 1 to 3: the Network Layer is the one that routes across networks. | X.200 6.1.6, 7.5.2.1 def; NIST SP 800-77r1 §2.1; Microsoft #network-layer |
| lead-6 | Going up, each layer reads the header its twin added, then passes the rest up. | X.200 5.6.1.1, 5.6.1.4 def |
| lead-7 *(analogy)* | A header works like a note stuck on a parcel, written for the same layer at the other end. | none (analogy) |
| term-layer | One job in the stack → **Layer** | X.200 5.2.2.1, 6.1.2 def |
| term-header | The control information a layer adds in front → **Header** | NIST SP 800-77r1 §2.1 (footnote 6); RFC 1122 §1.3.3 |
| term-encap | Wrapping each layer's unit inside the unit of the layer below → **Encapsulation** | NIST SP 800-77r1 §2.1; RFC 1122 §1.3.3 |
| term-decap | Removing an outer header to reach what's inside → **Decapsulation** (fallback in §10) | Cisco IP-in-IP Decapsulation; RFC 2003 (section to be read) |
| term-peer | The same layer on the other machine → **Peer layer** | X.200 5.2.2.7 def |
| term-relay | A machine in the middle that only passes data on → **Relay** | X.200 6.1.6 def |
| pattern | Application Layer, Encapsulation, Physical Layer, Relay, Decapsulation, Peer Layers. Note: "Down the layers at the sender, across each link, up the layers at the receiver." | X.200 6.1.6 def; NIST SP 800-77r1 §2.1; Cisco IP-in-IP and RFC 2003 for Decapsulation |
| why-1 | Splitting the job lets a layer change without the others noticing: each relies only on the service of the layer below. | X.200 5.2.2.3 def; Microsoft (intro) |
| why-2 | Layers 4 to 7 run only on the two end machines, so a router never needs to read them. | X.200 7.4.2.3 def |
| deep-1 | In the standard, a header is *protocol-control-information*, and a layer's whole unit is its *protocol-data-unit*: the header plus the data from the layer above. | X.200 5.6.1.1, 5.6.1.3 def |
| deep-2 | The internet uses its own four-layer model: Application, Transport, Internet, Link. | RFC 1122 §1.1.3 def; NIST SP 800-77r1 §2.1 |
| deep-3 | Exam names for each unit: a TCP **segment**, an IP **datagram** or **packet**, a link-layer **frame**, each a header followed by the unit above. | RFC 1122 §1.3.3 def; NIST SP 800-77r1 §2.1 (footnote 6) |
| fact-1 | Layers · 7 | X.200 6.1.2 def |
| fact-2 | Top · 7 Application; Bottom · 1 Physical (two facts) | X.200 6.1.2 def |
| fact-3 | Defined in · ITU-T X.200, the same text as ISO/IEC 7498-1 | X.200 (title page) def |

**Practice** (unscored; each option's feedback cites):
1. "Going down the layers on the sender, what does each layer do?"
   - **Adds its own header in front** ✓ (X.200 5.6.1.3 def; NIST §2.1)
   - Removes the header of the layer above ✗: that happens at the receiver, going up (X.200 5.6.1.4 def)
   - Sends it straight to the cable ✗: each layer hands it to the layer below (X.200 5.2.2.3 def)
2. "A router passes your message on. Which layers does it use?"
   - **Layers 1 to 3** ✓ (X.200 6.1.6 def; NIST §2.1)
   - All seven ✗: layers 4 to 7 run only between the end machines (X.200 7.4.2.3 def)
   - Only layer 1 ✗: it needs the Network Layer to route (X.200 7.5.2.1 def; NIST §2.1)
3. "Which layer is layer 4?"
   - **Transport** ✓
   - Network ✗ (layer 3)
   - Session ✗ (layer 5)
   - Data Link ✗ (layer 2)
   - All four options cite X.200 6.1.2 def.

## 6. Sources

The sources are added to `SOURCES` in `src/content/sources.ts` in the same change as the lesson. All four were read on 2026-11-08.

| id | kind | Document | url (the document) | How a section is cited |
|---|---|---|---|---|
| `itu-x200` | itu | ITU-T X.200 (07/94), *Information technology – Open Systems Interconnection – Basic Reference Model: The basic model*. In force; same text as ISO/IEC 7498-1. | `https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items` (the PDF) | No anchor. `url` + `#page=N` (PDF page), section in `section` |
| `rfc-1122` | rfc | RFC 1122, *Requirements for Internet Hosts – Communication Layers*. Internet Standard, not obsoleted. | `https://www.rfc-editor.org/rfc/rfc1122.html` | anchor `#section-{n}` (1.1.3, 1.3.3) |
| `nist-sp800-77r1` | nist | NIST SP 800-77 Rev. 1, *Guide to IPsec VPNs* (June 2020) | `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf` | `#page=20` for §2.1 |
| `microsoft-osi` | vendor (Microsoft) | *Windows network architecture and the OSI model*, Microsoft Learn (ms.date 2025-01-31) | `https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model` | `#physical-layer`, `#data-link-layer`, `#network-layer`, `#transport-layer`; the intro by a text fragment (`#:~:text=…`) |

**X.200's PDF pages**, measured with `pdftotext`:

| Section | PDF page |
|---|---|
| 5.2.2.1 | 10 |
| 5.2.2.3 | 11 |
| 5.2.2.7 | 12 |
| 5.6.1.1, 5.6.1.3, 5.6.1.4 | 19 |
| 6.1.2 | 32 |
| 6.1.6 | 33 |
| 7.1.2.1 | 36 |
| 7.2.2.2 | 37 |
| 7.3.2.1 | 39 |
| 7.4.2.1, 7.4.2.3 | 41 |
| 7.5.2.1 | 45 |
| 7.6.2.1, 7.6.2.2 | 50 |
| 7.6.4.5 | 52 |
| 7.7.2 | 53 |

**Notes on the sources**
- The X.200 url keeps its query string exactly. It is in normal form (`new URL(url).href === url`), and `url#page=N` counts as inside the document (same path and query, plus a fragment). Both were checked on 2026-11-08.
- Cisco's OSI page returns 404, and Cloudflare's Learning Center refuses automated fetches. Neither is used.
- No allowed source defines *decapsulation* in general. Only tunnel-specific pages use the word, such as Cisco's IP-in-IP decapsulation guide. §10 adds two tunnel sources, with a fallback.

## 7. Fact-checking

1. `npm run fact-check -- osi-model` prints the claim sheet.
2. Dispatch the fact-checker with the slug only. Agent types load at session start, so:
   - in the session that wrote `.claude/agents/fact-checker.md`, dispatch a general-purpose agent on opus with the agent file's body, as the canary runs did;
   - a session started since then dispatches `subagent_type: 'fact-checker'`, and confirms that it loads.
3. Before the first run, add a line to the agent's instructions on reading a long PDF: download it, then `pdftotext -f N -l N`, or Read with `pages`. Poppler is installed on this Mac (owner, 2026-11-08).
4. The report goes to `docs/fact-checks/osi-model.md`. Any ❌ or ⚠️ is fixed in the lesson, the failing report is committed, and a brand-new fact-checker checks again (`docs/content-model.md` §8). Never edit a verdict.

## 8. Tests and checks

- **Figure:** it draws; its ids are unique; its parts list matches what the driver handles; every block, peer line and cable route the parts name exists in the SVG; it fits the page budget.
- **Driver:** each cue, the ride, reduced motion, and any position shown from scratch matching the same position reached by playing (the existing sweep pattern).
- **Schema and validator:**
  - `labels` is rejected on a figure without it, and in a unit whose panel isn't `labels`;
  - `mark.n` outside `list` is rejected;
  - bad `layer` and `peer` args are rejected;
  - a message between laptop and server directly is rejected.
- **Panel:** chips, marks, carried state across steps, and the text read as a whole.
- **Lesson:** it validates against `SOURCES`; every Watch item traces to Learn; the limits hold; the claim sheet is stable.
- **e2e:** the lesson page loads from the track page. Play runs all six steps with no console errors. The panel and log update. axe finds no violations in either theme. The track page and Home count the lesson as available.
- **Before saying done:** `npx vitest run`, `npm run build` (astro check plus budgets) and `npm run e2e`, with results reported as they are.

## 9. Left to the builder

- How `FigureParts` names the allowed cue args.
- The driver's internal structure.
- Exact Practice prompts and feedback wording within the gist above.
- Exact narrative wording within the limits and the voice.
- The text-fragment form for the Microsoft intro.
- Where the label chip styles live.

## 10. Step 5's title (owner, 2026-11-08)

The owner's rule is that Watch step titles are technical terms. The usual term for step 5 is **Decapsulation**. No allowed source defines that term in general: X.200 doesn't use it, and neither does NIST SP 800-77r1 or 800-94. The only official pages that use it are tunnel-specific.

**Owner's decision:** try **Decapsulation**. If the fact-checker marks it ⚠️ or ❌, fall back to **Passing Up the Layers** without asking again.

- **First try.** Add `term-decap`, worded narrowly: "Removing an outer header to reach what's inside is called **decapsulation**." Cite two sources, which the builder reads first and checks are current:
  - Cisco's *IP-in-IP Decapsulation* page (`https://www.cisco.com/c/en/us/td/docs/iosxr/cisco8000/interfaces-and-hardware-component/configuration-guide/interfaces-and-hardware-component-config-cisco8000/ip-in-ip-tunnels-overview/ip-in-ip-decapsulation.html`);
  - RFC 2003, *IP Encapsulation within IP*, at the section that says the decapsulator removes the outer header.

  They become `SOURCES` entries `cisco-ipip-decap` and `rfc-2003`. The pattern names Decapsulation, so the pattern cites these two as well.
- **Fallback, on any ⚠️ or ❌ for `term-decap` or step 5's title.**
  - Retitle step 5 **Passing Up the Layers**, with the sub line unchanged.
  - Replace `term-decap` with `term-up`: "Each layer handing the rest up to the layer above → **Passing up the layers**". It cites NIST SP 800-77r1 §2.1 ("passed up through the layers") and X.200 5.6.1.4 def.
  - Update the pattern, and drop the two tunnel sources if nothing else cites them.
  - Commit the failing report, then have a brand-new fact-checker check again (`docs/content-model.md` §8).
  - Say in the PR description that the fallback was used.
