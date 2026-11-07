# TechConcepts: Networking Concepts Launch, Design

- **Date:** 2026-11-03
- **Status:** Draft for owner review
- **Background research:** `docs/research/2026-11-03-reference-research.md` (Protocol Explorer teardown, TryHackMe path and room structure)

Throughout this document, **(owner)** marks a decision the project owner made, and **(designer's call)** marks one made while writing this design. The owner can override any designer's call.

---

## 1. Intent

TechConcepts is a free, public website that teaches technology concepts through **short, guided, visual lessons**. A visitor arrives, picks a concept, and in 10–15 minutes *watches it happen*: packets crossing a network, a switch learning addresses, a firewall checking its rules. A plain-English explanation sits beside each scene.

It combines two references:
- **Protocol Explorer** (https://protocol-explorer-alpha.vercel.app) for *how a concept page works*: a scripted, step-by-step simulation, a live explanation panel, an event log, and an inspector that explains every field.
- **TryHackMe** for *how content is structured*: topics grouped into tracks, a beginner-friendly classroom voice, a hook and objectives up front, one idea per step, and a recap that points to the next lesson.

**Who it's for:** beginners and career-changers preparing for IT certifications (CompTIA A+, Network+, Security+, CySA+, CCNA, eventually OSCP) or roles (Helpdesk Tier 1/2, SOC Analyst, Data Analyst). The launch track, Networking Concepts, is the foundation every one of those builds on.

**Why simulations:** reading that "a switch learns MAC addresses" is forgettable. Watching its table fill in as frames arrive is not.

## 2. Goals

1. Launch with a Home page, a Networking Concepts track page, and **19 lessons** (owner), listed in §8.
2. Every lesson can be completed in **15 minutes or less**, ideally 10 (owner). This is enforced at build time (§7.4).
3. Every lesson is **content data played by shared scene engines**. Adding a lesson means adding a content file. It must not need new engine code unless the lesson introduces a genuinely new kind of scene.
4. The architecture is ready for future tracks (owner): How the Web Works, Cryptography, Privilege Escalation, Threat & Vulnerability Management, and AI Concepts (AI, ML, Neural Networks, Deep Learning, LLMs, Tokenization, RAG, Agents & Tools, MCP Orchestration, Guiding Principles & Ethics). None of these is built at launch, but nothing in the design should block them (§6.4).
5. Works well on desktop, works on phones, has light and dark themes, and is accessible (§10).
6. Returning visitors can see what they've finished and pick up where they left off, in the same browser, with no sign-in (owner; §10.5).

## 3. Non-goals (v1)

- **Accounts, sign-in, personalization, or any server-side state** (owner).
- **Gamification** of any kind: points, XP, streaks, leaderboards, badges, flags, certificates (owner).
- Real virtual machines, real terminals, or anything that touches a live network. Everything is scripted simulation.
- Payments or premium content.
- Tracks other than Networking Concepts.
- Burp Suite, which is excluded entirely (owner).
- Progress that follows a visitor across devices or browsers, or anything else that would need an account. Progress lives only in the visitor's browser (§10.5).
- Translations. English only at launch (designer's call).
- A content-management UI. Lessons live as files in the repository.
- Site search. Nineteen lessons don't need it yet (designer's call).

## 4. Anti-goals: what would make this a failure even if it works

- **Lessons that run long or turn into walls of text.** The 15-minute ceiling is a hard limit, not a target.
- **Technically wrong scenes.** Wrong header values, impossible port numbers, or misleading simplifications that a Network+ candidate would later have to unlearn. Simplifying is fine; being wrong is not. Where a value would differ in real life, mark it as an example (§6.2, "E.G." tags).
- **A clone of Protocol Explorer.** Borrow its ideas (the layout pattern, step-driven playback, the inspector) but not its look: not its colors, its all-monospace Iosevka type, its isometric artwork, or its copy. That work belongs to its author (Dilum Sanjaya). TechConcepts needs its own identity (§9).
- **Feeling like a game.** The tone is a calm classroom or lab, not an arcade.
- **One-off lesson code** that bypasses the engines. If a lesson needs something the engines can't do, extend the engine.

## 5. Constraints and stack

| Area | Decision |
|---|---|
| Site type | Fully static. No backend, no database. (owner: informational, no sign-in) |
| Framework | **Astro**, with **React** islands for interactive scenes, written in **TypeScript** (designer's call) |
| Hosting | **Cloudflare** (owner): Cloudflare Pages, or Workers static assets if that is what Cloudflare currently recommends for new static sites (builder checks at setup) |
| Domain | **techconcepts.app**, registered by the owner through **Cloudflare Registrar** (owner). `.app` domains only work over HTTPS (the whole TLD is on browsers' HSTS preload list). Cloudflare provides HTTPS automatically, but nothing may assume plain HTTP, including local preview links shared with others. Until the domain is connected, the site lives on its free Cloudflare address. |
| Analytics | Cloudflare Web Analytics, which is cookieless, so no consent banner is needed (designer's call; drop it if unwanted) |
| Browser storage | Theme preference and learning progress (owner), kept only in the visitor's browser (§10.5). Every read and write is wrapped so the site works fully if storage is blocked, full, or cleared. |
| Example network data | Use documentation and private ranges only: IPv4 `192.0.2.0/24`, `198.51.100.0/24` and `203.0.113.0/24` (RFC 5737) for "public" hosts; RFC 1918 ranges for private networks; MAC addresses `00:00:5E:00:53:xx` (RFC 7042) unless a lesson specifically teaches vendor prefixes. Well-known public resolvers such as `8.8.8.8` may appear by name. |
| Repository | The project folder is not yet a git repository. The builder initializes one (with the owner's OK) and connects it to Cloudflare Pages. The owner handles the Cloudflare account steps. |

## 6. Architecture

### 6.1 Content hierarchy and naming (designer's call)

- **Lesson:** one concept, 10–15 minutes, built around one scene. Examples: "DNS", "Subnetting".
- **Track:** an ordered set of lessons on one topic, split into **parts**. Example: Networking Concepts, which has 6 parts and 19 lessons.
- **Cert / role tags:** each lesson lists which goals it supports (e.g. Network+, CCNA, A+, Security+, Helpdesk, SOC Analyst). The Home page's "Preparing for…" chips filter the track page by tag. Curated multi-track **paths** (e.g. "SOC Analyst: lessons from 4 tracks") are deferred until there is more than one track. The data model includes tags now so paths can be added later without reworking content.
- Tags stay at the certification level. **No exam objective numbers in v1** (e.g. "Network+ 1.4"), because a wrong mapping is worse than none (designer's call).

### 6.2 The scene model (shared by all engines)

A lesson's scene is described in data:

- **Actors:** the things on screen. Devices (laptop, phone, switch, router, server, DNS server, firewall, proxy, load balancer, VPN gateway, Wi-Fi access point, "the internet" cloud) each have a label and addresses.
- **Links:** connections between actors, each wired, wireless, or tunnel.
- **Timeline:** an ordered list of **events**, grouped into **steps**. An event is something that visibly happens: a message travels, a table row is added or changes, a rule matches, a value changes.
- **Inspectables:** anything the learner can click for a detailed explanation, such as a packet, a table row, a rule, or a field. Every inspectable field has a **value**, a **one-line plain-English explanation**, and an optional **example flag** ("E.G." means the value differs in real captures).
- **Playback:** the engine plays a step's events in order, then pauses at the step boundary. Controls are play/pause, next step, previous step, replay and speed (0.5×, 1×, 2×). Going backwards re-derives state from the start of the timeline, so there is no hidden state.

### 6.3 Scene types needed for launch

**Flow.** Actors connected by links, with messages travelling between them.
- *Network view:* the topology, with message chips (a label plus a color for the message kind) animated along the links.
- *Sequence view:* lifelines per actor, with labeled arrows in time order.
- *Layers view:* a sender's stack and a receiver's stack, side by side, showing a message gaining a header at each layer on the way down and losing them on the way up. Used by OSI Model, Packets and VPN (a packet wrapped inside another).
- *Compare mode:* two lanes playing the same scenario differently, side by side. Used by TCP vs UDP and by "with vs without a proxy".
- *Packet inspector:* opening a message shows a bar of bytes per layer, a collapsible field tree with explanations, and a raw hex/ASCII view where it makes sense. Bytes the lesson can't show (encrypted or random) are marked as such.

**Device table.** A Flow scene with a **focal device's internal table** shown alongside, updating live as events pass. New rows appear, changed values highlight, and the matched row or rule is marked. Tables needed at launch: switch MAC table, ARP cache, routing table, DHCP lease table, NAT translation table, listening-ports table, firewall rule list (top-down matching), load-balancer pool (members, health, connection counts). **Built as an extension of the Flow engine, not a separate one.**

**Playground.** Controls (sliders, text inputs, toggles) bound to a live visualization, with no message traffic. Used by IP Address (decimal ↔ binary octets, private/public/special ranges, validity) and Subnetting (prefix slider; network/host bits; network, broadcast, first and last host; host count; a "same subnet?" checker for two addresses). Steps still exist: each step sets the playground to a preset state and narrates it. The **Try it** step hands the controls to the learner.

All subnet and binary math must be computed, not written by hand into content, and must be unit-tested.

### 6.4 Future scene types (not built at launch; the data model must not rule them out)

| Scene | What it does | Future lessons |
|---|---|---|
| Terminal | A scripted shell that recognizes the commands a lesson teaches and prints realistic output | nmap, Linux/Windows CLI, Privilege Escalation, Cisco IOS config |
| Transform | Input changes stage by stage | Encoding, hashing, encryption, Tokenization, embeddings |
| Playground (extended) | Charts and diagrams driven by controls | ML training, neural networks, LLM temperature |
| Queue | Items to sort, score and act on | Vulnerability management, SOC alerts, helpdesk tickets |
| Decision | Choices with visible consequences | AI ethics and guiding principles, incident response |

Note that RAG, Agents & Tools and MCP Orchestration fit the existing **Flow** engine: components pass messages, and the inspector decodes a prompt, a tool call, or a JSON-RPC message field by field.

## 7. Lessons

### 7.1 Lesson template (designer's call)

| Section | Budget | What it is |
|---|---|---|
| Overview | ≤ 80-word hook + concept card | The lesson's starting state. A real-world framing or analogy, the concept's name and full name, a one-paragraph summary, and a fact table (e.g. OSI layer, ports, transport, defined in which RFC). The scene shows its starting picture. |
| Steps | 4–6 steps, each ≤ 120 words | Each step pairs one visible event (or a short burst of events) in the scene with its narrative, an optional event card (what moved, from → to, summary), and 2–4 key facts. |
| Try it | 1 step | One change the learner makes, then watches the result (examples in §8). There is no scoring; the lesson explains what happened and why. |
| Check yourself | 2–3 questions | Single-choice or true/false. Choosing an answer immediately shows whether it's right and a one- or two-sentence explanation. **Nothing is scored or saved.** |
| Recap | 3 takeaways | Plus the "Relevant for" cert tags, a link to the next lesson, and references (RFCs or official docs). |

### 7.2 Voice

TryHackMe's best qualities: second person, warm, confident and reassuring ("Don't worry about the jargon yet"). Analogy-first, then the precise term. One new idea per step. Name the real-world job context where it fits ("A helpdesk tech sees this when…"). No fake urgency, no jokes at the learner's expense, no gamified language ("Mission complete!").

### 7.3 Content authorship (designer's call)

The builder drafts all 19 lessons from this design. The owner reviews each one for accuracy and tone before launch. Every lesson cites its references (RFCs or vendor docs) in its content file.

### 7.4 Content file model

Each lesson is one content file validated against a schema at build time. A lesson that fails validation fails the build.

- **Meta:** slug, title, subtitle, track, part, order, level, OSI layers (for Networking), cert tags, one-line summary, facts, references.
- **Overview:** hook and concept card.
- **Scene:** type plus definition (actors, links, timeline, inspectables, or playground config).
- **Steps:** title, subtitle, narrative, the timeline range or preset it plays, facts, optional event card.
- **Try it:** prompt, the control(s) the learner gets, and for each possible choice the scene variant to play and the explanation.
- **Check yourself:** questions, each with options, correct answer and explanation.
- **Recap:** takeaways and next lesson.

**Time estimate (computed, never hand-entered).** Total words ÷ 200 words per minute, plus 0.5 min per step, 2 min for Try it, and 1 min for Check yourself, rounded up. The build **fails above 15 minutes** and **warns above 12**. The builder may tune the constants if real reading tests disagree, but not the ceiling.

## 8. Launch catalog: Networking Concepts (19 lessons)

The concepts were chosen by the owner, and the order is the designer's call. Each lesson **depends** only on ideas from earlier lessons. A lesson may *mention* a later concept by name with a pointer ("more on this in lesson 13, DNS") as long as it still makes sense without it. Lesson 1 (OSI Model) is the exception by nature: it previews the whole track, so it describes later concepts in plain language ("the street address", "the door number") rather than by their technical names.

| # | Part | Lesson | Scene | What the learner watches | Try it |
|---|---|---|---|---|---|
| 1 | The big picture | OSI Model | Flow (layers) | A message wrapped layer by layer, sent, then unwrapped | "Break" one layer (unplugged cable, wrong MAC, wrong IP, closed port) and see where delivery stops |
| 2 | The big picture | Packets | Flow (layers + network) | A file split into packets that travel and are put back in order | Change the file size and watch the packet count change |
| 3 | Addresses & the local network | IP Address | Playground | An address in decimal and binary; public vs private vs special | Type any IPv4 address and see its binary form, type and validity |
| 4 | Addresses & the local network | MAC Address | Flow | A frame on a shared home Wi-Fi network: every device hears it, and only the one whose MAC matches keeps it; the address's two halves explained (no switch yet, which comes next) | Send to one device's MAC vs the broadcast address and see which devices keep it |
| 5 | Addresses & the local network | Switch | Device table (MAC table) | The switch flooding at first, then learning which device is on which port | Move a laptop to another port, or clear the table, and watch it relearn |
| 6 | Addresses & the local network | ARP | Device table (ARP cache) | "Who has 192.168.1.1?" sent to all; one reply; the cache fills | Send again with a full cache (no broadcast), then after clearing it |
| 7 | Getting between networks | Subnetting | Playground | The mask splitting an address into network and host bits | Slide the prefix (/16 to /30); check whether two addresses share a subnet |
| 8 | Getting between networks | Router | Device table (routing table) | A packet hop by hop; the routing table choosing each next hop; the default gateway | Remove a route or the default gateway and watch the packet get dropped |
| 9 | Getting between networks | DHCP | Device table (lease table) | A new laptop asking for and receiving its address, mask, gateway and DNS server (Discover, Offer, Request, Acknowledge) | Shrink the address pool to one and connect a second device |
| 10 | Talking across the internet | Ports | Device table (listening ports) | Connections arriving at a server's ports and reaching the right service; common ports | Open or close a port, then try connecting on 22, 80, 443 and 3389 |
| 11 | Talking across the internet | TCP/UDP | Flow (compare) | TCP's handshake, acknowledgements and resends vs UDP's fire-and-forget | Drop a packet in both lanes: TCP resends it, UDP loses it |
| 12 | Talking across the internet | NAT | Device table (NAT table) | The router rewriting private address:port pairs into its one public address | Add a second laptop visiting the same site and watch the table assign a new public port |
| 13 | Talking across the internet | DNS | Flow | A name resolved via the resolver, root, .com and authoritative servers; then caching | Look the name up again (answered from cache), then mistype it (no such domain) |
| 14 | The web | HTTP/HTTPS | Flow | A request and response, with method, path, headers and status decoded | Change the path or method (404, 405); switch HTTP ↔ HTTPS and see what the inspector can still read |
| 15 | The web | TLS | Flow | The handshake, the certificate check and key agreement, then unreadable data | Present an expired or wrong-name certificate and watch the browser refuse it |
| 16 | Protecting & scaling traffic | Firewalls | Device table (rule list) | Packets checked against rules top to bottom: allowed or dropped | Add or reorder a rule and send test traffic |
| 17 | Protecting & scaling traffic | Proxies | Flow (compare) | What the server sees with and without a proxy; forward vs reverse proxy | Switch between forward and reverse proxy and compare what the server logs |
| 18 | Protecting & scaling traffic | Load Balancers | Device table (pool) | Requests spread across servers; health checks | Take a server offline; switch round-robin ↔ least connections |
| 19 | Protecting & scaling traffic | VPN | Flow (layers + network) | A packet wrapped in a tunnel on café Wi-Fi | Toggle the VPN and compare what an eavesdropper on the Wi-Fi can see |

Cert/role tags per lesson are drafted with the content and reviewed by the owner.

**Three pilot lessons** exercise all three scene types and most engine features, so the builder should build them first and use them to prove the engines before writing the rest: **DHCP** (Flow + table), **Subnetting** (Playground) and **Firewalls** (rule list plus Try it with rule editing).

## 9. Visual identity (designer's call; specifics left to the builder)

- **Name:** **TechConcepts**, at **techconcepts.app** (owner). Write it as one word with a capital T and a capital C.
- **Feel:** a calm, technical classroom or lab. Dark by default, with an equally finished light theme and a toggle. Flat panels, thin borders, generous spacing, nothing flashy.
- **Type:** a readable **sans-serif for prose** (lessons carry up to ~1,200 words, more than Protocol Explorer) and a **monospace for data** (addresses, packets, tables, ports). Both must be open-source. Uppercase, letter-spaced labels for panel titles are fine.
- **Color:** defined as semantic tokens, each with **one meaning across every scene in every track**: request, response, handshake/control, broadcast, allowed/success, blocked/error, encrypted, selected/active. Both themes must meet WCAG AA contrast. **Color is never the only signal**; it is always paired with labels or shapes.
- **Illustrations:** A consistent, original SVG device icon set, theme-aware. No isometric artwork copied or traced from Protocol Explorer.
- **Motion:** purposeful only. Messages travel along links, changed table rows pulse once, and views crossfade. With "reduce motion" on, messages jump straight to their destination and there are no camera moves.

## 10. Pages

### 10.1 Home `/`
- **Hero:** a one-sentence promise (copy left to the builder, e.g. "See how technology works, one short lesson at a time") and a primary button to start Networking Concepts at lesson 1.
- **Continue where you left off:** shown only when this browser has saved progress. It names the last lesson and step ("Continue: DNS · step 3 of 6") and the track's progress ("7 of 19 complete"). For returning visitors it becomes the primary action, ahead of the start button.
- **Tracks:** a card for Networking Concepts (19 lessons, total time, level: Beginner, plus "7 of 19 complete" when there's saved progress) linking to the track page, plus **"Coming soon"** cards (not clickable) for How the Web Works, Cryptography, AI Concepts, Privilege Escalation, and Threat & Vulnerability Management (designer's call: this signals the roadmap).
- **"Preparing for…" chips:** the cert/role tags that have lessons. Each links to the track page filtered by that tag.
- **How a lesson works:** three small panels, *Watch → Try → Check*, each with one line of explanation.
- Footer: about, source/credits, theme toggle.

### 10.2 Track page `/networking`
- Title, a description, and stats (lessons, total time, level).
- The six parts in order, each listing its lessons: number, title, one-line summary, minutes, cert tags, and a finished or in-progress marker from saved progress.
- A progress line ("7 of 19 complete", with a segmented bar of one segment per lesson) and a **Reset progress** link that asks for confirmation.
- Filter chips by cert tag, reflected in the URL (`?for=network-plus`) so Home can link to them.

### 10.3 Lesson page `/networking/<slug>`

**Desktop (≥ 1200 px):** one screen with no page scroll, like Protocol Explorer.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ TechConcepts │ Networking › DNS · Lesson 13 of 19 │ ▮▮▮▯▯▯ │ OSI L7 │ ☀☾ │
├──────────────┬──────────────────────────────────────┬─────────────────────┤
│ LESSON       │  [Network | Sequence | …] view toggle │ OVERVIEW / STEP N   │
│ ○ Overview   │                                      │  title, narrative,  │
│ ● 1 Ask      │            SCENE CANVAS              │  event card, facts  │
│ ○ 2 Root     │   (or the inspector when an item     │                     │
│ ○ …          │    is opened)                        │  Try it controls /  │
│ ○ Try it     │                                      │  Check questions    │
│ ○ Check      ├──────────────────────────────────────┴─────────────────────┤
│ ○ Recap      │ EVENT LOG  legend…           [0.5×|1×|2×] [‹] [▶] [›] [↻]  │
│ ─────────    │ #  time  from → to  kind  summary  size                    │
│ All lessons ▸│                                                            │
└──────────────┴────────────────────────────────────────────────────────────┘
```

- **Top bar:** logo (→ Home), breadcrumb, lesson position, step progress segments, a context chip (the OSI layer for Networking lessons, where relevant), theme toggle.
- **Left, lesson outline:** Overview, each step, Try it, Check yourself, Recap. The current item is marked and any item can be clicked to jump there. Below it, a collapsible list of all lessons in the track, grouped by part, with finished and in-progress markers.
- **Center, scene canvas:** the view toggle shows only the views the lesson's scene supports. Opening an inspectable replaces the canvas with the inspector, which has its own close button; Esc also closes it.
- **Right, explanation panel:** shows the Overview (hook and concept card) or the current step (narrative, event card, facts). During Try it it holds the controls and the outcome explanation. During Check yourself it holds the questions. During Recap it holds the takeaways, references and the next-lesson button. The panel scrolls internally if its content is taller than the screen; the page itself does not scroll.
- **Bottom, event log:** a real HTML table of the events so far. The columns depend on the scene type (Flow: #, time, from, to, kind, summary, size; Device table adds the table change). Clicking a row opens the inspector. Playground lessons replace the log with a compact "current values" readout. Playback controls sit in the log's header.
- **Deep links:** `?step=<n>` opens a lesson at a given step (designer's call).
- **Keyboard:** Space plays or pauses, → and ← move between steps, Esc closes the inspector.

**Tablet (768–1199 px):** two columns (canvas, explanation), with the outline in a drawer and the log below.
**Phone (< 768 px):** stacked in the order top bar → canvas → explanation → log, with the outline in a drawer and a **sticky bottom playback bar**. The canvas height is clamped so the explanation is visible without much scrolling.

### 10.4 Other pages
- `/about`: what TechConcepts is, how lessons are made, credits (including inspiration from Protocol Explorer and TryHackMe, named as inspiration only), and a plain statement that progress is saved only in this browser and never sent anywhere, with a **Reset progress** button.
- A 404 page with links to Home and the track.

### 10.5 Learning progress (owner: tracked without sign-in; details are designer's calls)

**What's saved, per browser:**
- For each lesson: its status (*not started*, *in progress*, *finished*), the furthest step reached, and when it was last opened.
- The last lesson opened, which powers "Continue where you left off".
- The theme choice.
- **Not saved:** answers to Check yourself questions, Try it choices, or anything else. There is still no scoring.

**Rules:**
- A lesson becomes **in progress** when the learner moves past the Overview, and **finished** when they reach the Recap. Jumping straight to the Recap from the outline also counts: the site trusts the learner, and nothing is being graded.
- Opening a lesson always starts at the Overview. If there's a saved step, the Overview shows a **"Resume at step 3"** button rather than jumping automatically, so returning learners can choose to re-watch from the start. A `?step=` deep link takes priority over saved progress.
- A finished lesson stays finished if it is opened again. Its Overview shows a "Finished" marker instead of the resume button.

**Where it shows:** the Home "Continue" card and track card (§10.1), the track page markers, progress line and Reset (§10.2), the lesson page's "All lessons" list (§10.3), and About (§10.4).

**Storage (for the builder):**
- One versioned record in `localStorage` (e.g. key `techconcepts:v1`), holding the lesson records keyed by lesson slug.
- Every read and write is wrapped. If storage is unavailable (private browsing, blocked, full), the site works normally and the progress features simply don't appear.
- Saved data for a lesson slug that no longer exists is ignored. A saved step beyond a lesson's current step count is clamped to its last step. An unknown version is discarded rather than guessed at.
- Other open tabs pick up changes through the browser's `storage` event.
- Pages are static HTML, and progress is filled in after load. Space for progress elements is reserved so the page doesn't jump when they appear.
- Nothing is sent anywhere, so no consent banner is needed. About states this plainly.

## 11. Accessibility and performance

- WCAG 2.2 AA in both themes. Visible focus. Everything works by keyboard.
- The step narrative is the scene's text equivalent and is announced politely (`aria-live`) when the step changes. The event log is a real table. Inspector trees are navigable lists.
- Respect `prefers-reduced-motion` and `prefers-color-scheme` (a manual toggle overrides).
- A lesson page should become interactive quickly on a mid-range phone. Only the scene and its engine are hydrated; the rest is static HTML. A rough budget is under ~200 KB of compressed JavaScript per lesson page (designer's call; the builder may adjust with reason).
- Each lesson page has its own title, description and share image for linking.

## 12. Quality bar: what "done" means for launch

1. Home, the track page, all 19 lessons, About and 404 are live on Cloudflare Pages.
2. Every lesson plays end to end (Overview → steps → Try it → Check → Recap) on desktop and phone, in both themes, with keyboard only, with reduced motion, and with browser storage blocked.
3. Every lesson passes schema validation and the 15-minute time check.
4. The owner has reviewed every lesson for accuracy and tone.
5. Tests:
   - Engine unit tests: timeline playback and stepping backwards, table updates, rule matching, NAT/ARP/switch table logic, and all subnet/binary math.
   - Progress store tests: saving and resuming; blocked or full storage (the site still works); unknown lesson slugs ignored; saved steps clamped when a lesson's step count changes; unknown versions discarded; reset.
   - Content validation in the build.
   - An end-to-end smoke test that opens every lesson and steps through it without errors.

## 13. Left to the builder

- Exact fonts, palette values, icon style and logo, within §9.
- Engine internals: SVG vs canvas, animation approach, state management.
- The content file format (e.g. MDX with front matter, or YAML plus Markdown) and folder layout, within §7.4.
- Home and About copy.
- Build order beyond "engines plus the three pilot lessons first".
- Whether `/networking` is the final track slug.
