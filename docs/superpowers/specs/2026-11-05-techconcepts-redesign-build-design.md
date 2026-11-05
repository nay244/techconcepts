# TechConcepts: Building the Redesign into the Site, Design

- **Date:** 2026-11-05
- **Status:** Approved by the owner, 2026-11-05 ("Approved, commit the doc and write build plan")
- **Builds on:** `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md` (the launch spec). Everything in the launch spec still holds unless this document changes it. §3 lists every change.
- **Reference mockups:** see §4. They are the visual and behavioural source of truth for this build.

As in the launch spec, **(owner)** marks a decision the project owner made, and **(designer's call)** marks one made while writing this design. The owner can override any designer's call.

---

## 1. Intent

The site live on Cloudflare (main, commit `40abd4b`) is the first version: three pilot lessons in a plain console. On 2026-11-04 the owner said it felt bland and lacked identity, and asked for a redesign (owner). The redesign was worked out as HTML mockups, page by page, and the owner approved them. This build turns those mockups into the real Astro site and deploys it, so the live site looks and behaves like the mockups.

**Why it matters:** the owner wants one consistent, distinctive picture language across the site (detailed isometric figures with one lit part), lessons that start in plain words, and a site that reads as a calm, technical classroom.

## 2. Goals

1. Rebuild Home, the Networking track page and the lesson console to match the approved mockups (§4) in both themes at desktop widths.
2. Ship four ready lessons in the new console (owner, 2026-11-05: "update all the necessary home, track and lessons to their appropriate values"):
   - **1 How the Internet Works:** new, covering 14 protocols.
   - **8 Subnetting:** rewritten with a new scene.
   - **10 DHCP:** restyled, with Try removed.
   - **17 Firewalls:** rewritten in the new console from `firewalls-v1.html`, which was mocked up first (owner, 2026-11-05: "mockup the firewall and about before the build") and approved the same day.
3. Grow the Networking track from 19 to **20 lessons**, with How the Internet Works as lesson 1 (owner, 2026-11-05). The other 16 lessons stay "Coming soon".
4. Replace the flat scene drawings with the **Anatomy kit figures in the lumen finish** (owner, 2026-11-05), drawn at build time.
5. Keep what already works: static output, progress saved only in the browser, the theme toggle, reduced motion, keyboard use, accessible tables, analytics switch, Cloudflare deployment.
6. Deploy the result to the existing Cloudflare preview, with the owner approving the push (§10).

## 3. What changes from the launch spec

| Area | Launch spec | Now | Source |
|---|---|---|---|
| Look | Not Protocol Explorer's colours or isometric artwork | Navy "living blueprint" in dark mode, blueprint-on-paper in light, marigold "you are here" accent; detailed isometric figures. Art stays original: never copied or traced | owner, 2026-11-04 |
| Type | Open-source sans and mono (IBM Plex shipped) | **Atkinson Hyperlegible Next** for prose, **Atkinson Hyperlegible Mono** for data | owner, 2026-11-04 |
| Illustrations | A flat SVG device icon set | Anatomy kit figures, lumen finish: charcoal solids, fine light edges, one gradient-lit part per figure in our blue (`--lit-a #a8e8ff`, `--lit-b #2f7bff`), a soft glow pool, dashed orbit rings, a rounded plate with corner screws and one engraved label. **No film grain.** Figures stay charcoal in both themes | owner, 2026-11-05 |
| Lesson flow | Overview, Steps, Try it, Check yourself, Recap | **Overview, Watch** (the steps), **Learn, Practice**. Try is gone everywhere | owner, 2026-11-04 |
| Voice | Analogy first, then the term | Beginner-first: the everyday idea, then the term. Exam-level detail sits in a closed **Go deeper** section | owner, 2026-11-04/05 |
| Watch step titles | Free text | Title Case technical terms (for example "DNS Resolution", "TCP Connection"). Plain words go in the sub line, and Learn's pattern box uses the same names | owner, 2026-11-05 |
| Playback | Play/pause, previous, next, replay, three speeds | One speed button that cycles 0.5×, 1×, 1.5×, 2× (default 1×). **Play runs every Watch step** from the current one to the last, holding about 2.6 s between steps, then shows Pause, then Replay. Moving by hand stops the run | owner, 2026-11-05 |
| Track size | 19 lessons | 20 lessons; How the Internet Works is lesson 1 and every later lesson moves up one | owner, 2026-11-05 |
| Lesson length | Hard 15-minute limit for every lesson | Lesson 1 is exempt (owner: "Do not worry about length for this lesson"). It works out at **96 min across 14 protocols**. Every other lesson keeps the 15-minute limit. See §7.5 | owner, 2026-11-05 |
| Translations | English only | Still English only. A 15-language menu was mocked up and set aside for later | owner, 2026-11-05 |
| Screen sizes | Desktop, tablet and phone layouts | **Desktop only for now** (about 1280 to 1440 px, checked up to 1920). Phone and tablet layouts get their own pass later. Don't break small screens on purpose: keep layouts fluid | owner, 2026-11-05 |
| Subnetting scene | Playground with a prefix slider | A Watch scene: an office cut into four subnets, with "the address in bits" board and a working-out log (§7.2) | designer's call, built in the mockup the owner accepted |
| Home hero | "See how technology works…" | "See how technology **really works.**" over the How the Web Works animation (§6.1) | owner asked for the animation and a site-wide headline; wording designer's call, approved with home-v6 |

## 4. The reference mockups

The mockups live in the main checkout at `.superpowers/brainstorm/2830-1793891117/content/`. That folder is git-ignored, so **a git worktree does not contain it**: read it from the main checkout's path. Each file is a self-contained HTML page that opens in any browser. A small "Mockup only" box on some pages switches between first-visit and returning-visitor states and scrubs animations; it is not part of the design.

| Page | Mockup | Status |
|---|---|---|
| Home | `home-v6.html` | Approved 2026-11-05 ("Looks good"). Lesson numbers updated to 20 the same day |
| Networking track | `track-v2.html` | Approved 2026-11-05 ("Looks great"). Updated to 20 lessons, with How the Internet Works ready, the same day |
| DHCP lesson (the console) | `lesson-v3.html` | Approved 2026-11-05 ("Looks great"). Lesson 10 of 20 since the same day |
| How the Internet Works | `internet-v2.html` | Approved 2026-11-05 ("Looks good, move on") |
| Subnetting | `subnet-v1.html` | Owner moved on to the build without asking for changes (my reading; see §12) |
| Firewalls | `firewalls-v1.html` | Approved 2026-11-05 ("Approved") |
| About | `about-v1.html` | Approved 2026-11-05 ("Approved") |
| Track covers | `illustrations-v3.html` | All six approved 2026-11-05 |
| Small figures | `spots-check-v2.html` | Approved with home-v5 |

The figures and pages were generated by Node scripts in `.superpowers/brainstorm/2830-1793891117/figs/`. They import the Anatomy kit from `../anatomy-src/repo/kit/` (MIT licence, by Ryan, github.com/wheresryan22/anatomy). The scripts are the best record of the geometry, routes, timings and words:

- **Shared:** `common.mjs` (camera, plate, helpers) and `lumen-assets.mjs` (the finish CSS and gradient defs).
- **Covers and small figures:** `covers.mjs` and `spots.mjs`.
- **Home hero:** `hero-web.mjs`.
- **DHCP:** `dhcp-scene.mjs` (scene) and `lesson3.mjs` (page). The words come from `lesson-console-v2.html`.
- **Subnetting:** `subnet-scene.mjs` (scene), `subnet-lesson.mjs` (words and events) and `lesson-subnet.mjs` (page). The page checks every number when it builds.
- **How the Internet Works:** `net-map.mjs` (map), `proto-kit.mjs` (shared helpers) and `lesson-internet2.mjs` (page). The words and messages are in `protocols.mjs` (HTTP, DNS, TCP, SMTP), `protocols-core.mjs` (HTTPS, UDP, IP, DHCP, ICMP) and `protocols-apps.mjs` (POP3, IMAP, FTP, SSH, TLS/SSL).
- **Firewalls:** `firewall-scene.mjs` (scene), `firewall-lesson.mjs` (words, rules and events) and `lesson-firewall.mjs` (page, built from `lesson-v3.html`). The page re-runs every rule check when it builds and stops if a decision changes.
- **About:** `about.mjs` (built from `track-v2.html`'s header, footer and tokens).
- **Lesson lengths:** `minutes.mjs` (§7.5).

They are reference material, not site code: port what they do into the site's own TypeScript, tested.

## 5. Visual identity

- **Tokens:** the mockups' CSS custom properties are the palette, for both themes. They cover the site tokens (`--bg`, `--card`, `--ink`, `--ink-strong`, `--muted`, `--line`, `--line-strong`, `--accent`, `--here`, `--allowed`, `--focus`, and the hero tokens) and the figure tokens (`--lit-a`, `--lit-b`, `--pool`, `--fig-bg`, `--fig-line`, `--halo`). They replace `src/styles/tokens.ts` values. Keep the launch spec's rule: every colour has one meaning, both themes meet WCAG AA, and colour is never the only signal. The existing token contrast test stays.
- **Colour meanings** (designer's call, from the builder check):
  - **Marigold (`--here`)** keeps one meaning: you are here, or current. That covers the current lesson or step, the progress fill and the "You are here" pill.
  - **Lost, dropped and denied things** use the launch spec's **blocked** colour, a red: lost packets, their drop marks and trails, their log rows, and Firewalls' DENY. The approved Firewalls figure already shows DENY in red.
  - **Change from the lesson 1 mockup:** it marks lost packets and cache misses in marigold. In the build, lost packets turn red. A cache miss isn't an error, so it gets a neutral style with a "miss" label.
  - **The eight semantic tokens stay:** request, response, control, broadcast, allowed, blocked, encrypted, selected. The builder sets the four the mockups don't define (control, blocked, encrypted, selected) to new values in the new palette, AA in both themes. The token test keeps requiring them.
- **Fixed-meaning lights:** some lights keep their colours whatever the accent: alarm red, crack severity red, orange or yellow, then green once patched (owner, 2026-11-05).
- **Type:** Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono, self-hosted, as IBM Plex is today (designer's call; the mockups load them from Google Fonts only for convenience).
- **Motion:** as in the mockups. Messages travel as lit tags along cables. Broadcasts spread as rings of light on the floor. Changed rows pulse once. Figures draw in once. With reduced motion, everything jumps to its end state and the home hero shows its last frame with a "Play it" button.

## 6. Pages

### 6.1 Home `/` (mockup `home-v6.html`)

- **Header:** logo, Tracks, How it works, About, the theme button and "Start learning".
- **Hero:**
  - Headline "See how technology / really works." The second line is in the accent colour.
  - Lede: "Short, visual lessons on networks, the web, security and AI. Watch each idea happen one step at a time, explained in plain words."
  - The eyebrow "Free visual lessons, no sign-up" and two buttons.
  - On the right is the How the Web Works figure: the shuttle carries "GET /" to the server, the server's lights flicker, it rides back with "200 OK", and the page draws block by block.
  - A caption card follows four plain-words steps and ends "That request and reply are called HTTP." It has Pause, Play and Replay.
  - The animation starts when the hero comes into view, plays once, and stops.
- **Exams strip:** "Each lesson shows which exams and jobs it helps with" over the six tags. Each tag links to the track page filtered by that tag, as the launch spec's chips did (designer's call).
- **Why it works:** three cards. The big one has a sample of the DHCP message log.
- **How a lesson works:** Watch, Learn, Practice on a timeline, each with its small figure.
- **Tracks:** six cards with the approved covers.
  - The Networking card reads "4 of 20 lessons ready, 124 min" (the sum of the ready lessons' minutes, computed), or "n of 20 done, m in progress" with a segment bar for a returning visitor.
  - The other five cards are "Coming soon".
- **Returning visitor:** the primary button becomes "Continue <lesson>" and the eyebrow says where they are, from saved progress. This is the launch spec's §10.1 rule in the new look.
- **Footer:** as in the mockup.

### 6.2 Track page `/networking` (mockup `track-v2.html`)

- **Hero:**
  - Breadcrumb, then "Track 1 · Beginner", the title and the description.
  - Stats: 20 lessons planned, 4 ready now, minutes in all. All are computed from the content.
  - "Start with How the Internet Works", or "Continue <lesson>" for a returning visitor.
  - "Every lesson: Watch › Learn › Practice".
  - The Networking cover sits on the right and animates when clicked.
- **Left column:** Your progress, with "n of 20 complete", a 20-segment bar and Clear my progress (asks for confirmation). Below it, the six parts with their ready counts.
- **Main column:**
  - Exam filter chips, reflected in the URL as `?for=<tag>`.
  - The six parts. A ready lesson is a card: its figure, "Lesson NN", the title, a one-line sub, a summary, its minutes, its exam tags, and the Watch / Learn / Practice progress for a returning visitor.
  - A coming-soon lesson is a compact row.
  - How the Internet Works also shows a "14 protocols" chip.
- **Lesson 1's thumbnail** is the retired v5 home hero (home, the internet and a web server), still, with its labels removed. It's a stand-in until lesson 1 gets its own small figure (designer's call).

### 6.3 Lesson console `/networking/<slug>` (mockups `lesson-v3.html`, `subnet-v1.html`, `internet-v2.html`)

One screen with no page scroll, as in the launch spec, laid out as in the mockups.

- **Top bar:**
  - Logo; breadcrumb with "Lesson N of 20" and step segments; the OSI layer chip.
  - Track progress: a 20-place bar where the current lesson is marigold and ready lessons are outlined, with "n of 20 complete".
  - The Light/Dark switch.
  - The top bar shows "Step n of N" only, never the step title, because long titles overflowed at 1280 px. The approved DHCP mockup still shows its titles there; the build uses "Step n of N" for every lesson (designer's call).
- **Left, outline:** "This lesson" lists Overview, each Watch step (technical title plus a plain sub line), Learn and Practice. "All 20 lessons" opens the track list.
- **Centre, scene:** the lesson's figure with its title, plus the Network / Sequence toggle in lessons where messages travel between places. Subnetting hides it (§12).
- **Below the scene:** an optional panel that belongs to the lesson:
  - DHCP: the router's lease table.
  - Firewalls: the rule list.
  - Subnetting: "The address in bits".
  - How the Internet Works: the protocol's own table, or none.
- **Right, explanation:**
  - **Overview:** the hook and fact table.
  - **Watch step:** a kicker, title, narration with the terms in bold, a closed Go deeper and the facts.
  - **Learn:** "What happened and why".
    - A lead.
    - Terms as "idea → name" pairs.
    - A pattern box naming the steps with the Watch titles' technical terms.
    - Why it matters, a closed Go deeper and facts.
  - **Practice:** unscored questions with immediate feedback. Nothing is saved.
  - **End row:** "Next ready lesson: <title>, lesson N" and a button.
- **Bottom, log:** a real table whose columns depend on the lesson:
  - packet log for DHCP and How the Internet Works;
  - "Firewall log" (Source, Destination, Service, Decision, In plain words) for Firewalls;
  - "Working" (Worked out, Value, Prefix, In plain words) for Subnetting.
  - Playback controls sit in its header.
  - Log rows are not clickable: the **packet inspector is dropped** for now (owner, 2026-11-05). It may come back in a later update, so keep packet data in the content where it is cheap to keep, but ship no inspector UI.
- **Kept from the launch spec:** keyboard (Space, ← and →), `?step=` deep links, the polite live region for step text, and the no-scroll layout at desktop sizes.

### 6.4 About, 404

- **About:** built from its mockup, `about-v1.html` (approved 2026-11-05). The live page still describes "something to try", a recap and "15 minutes or less"; the mockup's words replace it. The words and layout are my call, reviewed with the mockup:
  - **Hero:** "Watch it happen, then learn its name.", a lede, three stats (tracks planned 6, lessons ready 4, accounts needed 0, computed where they can be), the Watch › Learn › Practice line, and the How the Web Works cover, still.
  - **Body:** an "On this page" list on the left that marks the section in view, then five sections: What TechConcepts is (with the five coming tracks by name); How a lesson works (three cards with the Watch, Learn and Practice figures, then a note that most lessons take 15 minutes or less while lesson 1 runs about 96 minutes across 14 short protocols); Where the facts come from (Sources, with DHCP's two RFCs as the example, and the exam tags); Credits (the live page's Protocol Explorer and TryHackMe wording, plus the Anatomy kit under its MIT licence and the Atkinson Hyperlegible type); Your progress stays with you (a small table of what is kept where, the analytics sentence only when analytics is on, as now, and Reset progress with the live site's confirm steps and wording).
- **404:** no mockup (designer's call): restyle it with the new tokens, type, header and footer, and keep its links. The owner reviews it in the build.

## 7. Lessons in this build

### 7.1 How the Internet Works (lesson 1, new)

- **The 14 protocols, in Protocol Explorer's order** (owner): HTTP, HTTPS, TCP, UDP, IP, DNS, DHCP, ICMP, SMTP, POP3, IMAP, FTP, SSH and TLS/SSL. We take only the structure and order. The words, examples and figures are ours (owner).
- **Each protocol** has its own Overview, Watch steps (5 or 6, 78 in all), Learn with a pattern box, and Practice with 2 questions. The text is final in the mockup data files (§4).
- **One network map** for every protocol: home, the internet (five routers) and the DNS resolver stay put. Each protocol adds its own server plates as swappable layers (slots E and SE; kinds web, names, mail and host).
  - The map uses one fixed frame, so it doesn't resize between protocols.
  - Map titles stay under about 51 characters.
- **Effects:**
  - a lost packet with a marigold drop mark;
  - a broadcast ring across the home plate;
  - a waiting letter on a mail tray;
  - an open connection that stays lit and glows brighter once TLS seals it;
  - FTP's dashed data line above the control line;
  - a padlock in the laptop's address bar;
  - routers that light up when a message stops there (traceroute, NAT).
- **Outline:** 14 one-line protocol rows with All, Core, Apps and Security filters. The current protocol opens to show its parts.
- **Progress** (designer's call):
  - In progress once the learner passes the first Overview.
  - The furthest protocol and step are saved, and "Resume" names them.
  - Finished on reaching the last protocol's Practice.
- **Overlap with DHCP:** the DHCP protocol section overlaps lesson 10. Sorting that out is deferred (owner).

### 7.2 Subnetting (lesson 8, rewritten)

- **Scene:** one office plate with four team pads (Sales, Design, Servers, Guest Wi-Fi), each with a switch (an access point for guests). The office router and the provider's router stand at the back on a /30 link.
  - A lit line runs round the floor while it is one /24, then round each pad once it is cut into /26s.
  - Broadcast rings cover the whole floor, or stop at one pad's edge.
  - Tags ride the cables: local delivery, via the router, and across the link.
- **"The address in bits" board:** up to three 32-bit rows (the address, the mask, then the network, the broadcast or a compared address). A marigold line marks where the network part ends, and borrowed bits are underlined.
- **Steps:** six Watch steps with 17 events. Their technical titles were my call for a new lesson: Network and Host Portions, Subnet Mask, Network and Broadcast Addresses, Borrowing Bits, Local vs. Remote Delivery, Point-to-Point Subnet.
- **Numbers:** every number shown must be **computed by `src/engine/net`** and checked at build time, never typed into content. This is the launch spec's rule, and the mockup's build already re-checks every number. The old playground (`src/scenes/playground/subnet`) is removed once nothing uses it.

### 7.3 DHCP (lesson 10, restyled)

- **Scene:** one home Wi-Fi plate. The router stands at the back with its lease table, the laptop on the left and the phone overhearing on the right. The message is a lit tag on a dotted arc, and a broadcast is a ring of light.
- **Steps:** 5 Watch steps; the words are as in `lesson-v3.html`.
- **Learn:** includes the DORA pattern box.
- **Practice:** 3 questions. Try is removed.
- **Step titles** switch to technical terms like the other lessons (owner, 2026-11-05: "Adjust the DHCP lesson as needed"). `lesson-v3.html` is rebuilt with them, with "Step n of 5" in the top bar and a Sources list in Learn's Go deeper.

### 7.4 Firewalls (lesson 17, rewritten)

Mocked up first, then built (owner). Drawn in `firewalls-v1.html` and approved on 2026-11-05.

- **Scene:** one plate split by a wall with a gate. Outside ("THE INTERNET"): the visitor's laptop at 203.0.113.50 and the admin's at 198.51.100.7. Inside ("OFFICE"): the web server at 10.0.0.10. The gate has a boom with two arms and a light bar; a standing board on the wall shows the rule list, three rows, top down.
  - A visit rides the cable to the gate as a lit tag ("HTTPS 443", "SSH 22", "TELNET 23"), waits while the board checks each rule in turn, then either the arms lift and it rides in to the server, or the trail turns red and a stop mark pops at the gate.
  - Tags past the gate are drawn behind the wall (a mask), so they never cross the boom.
  - Lights that mean allow and deny keep fixed colours in both themes (green #3ddc7c, red #ff4f4f); the page's DENY text uses the blocked red, and the row being checked is marigold.
- **Rules** (`firewall-lesson.mjs`): 1 allow TCP 443 from any ("Website (HTTPS)"); 2 allow TCP 22 from 198.51.100.7/32 ("Admin login (SSH)"); 3 deny everything ("Block everything else"). First match wins.
- **Steps** (6 Watch steps, 7 events): Rule Evaluation (HTTPS allowed by rule 1), First-Match Rule (the visitor's SSH denied by rule 3), Source Filtering (the admin's SSH allowed by rule 2), Default Deny (Telnet denied by rule 3), Stateful Inspection (the server's reply passes as a known connection), Rule Shadowing (the list is reordered with Block everything else first, and the next HTTPS visit is denied by rule 1).
- **Below the scene:** the rule list as a table (#, Action, Port, Source, For, Check). The Check column shows "Doesn't fit", "Fits → allow" or "Fits → deny" as the firewall reads down. Under it, "Connections it remembers" holds one chip per allowed visit, which the reply checks against.
- **Log:** "Firewall log" with Source, Destination, Service, Decision and In plain words.
- **Sequence view:** lifelines for Visitor, Admin, Firewall and Web server. Denied visits stop at the firewall with a ✕; the rule change is a note across the firewall. The names stay fixed while the rows scroll at full size.
- **Learn:** 8 terms (Firewall, Rule, Port, Source, First match, Default deny, Stateful, Shadowed rule), a pattern box (Rule Evaluation › First-Match Rule › Default Deny › Stateful Inspection), and NIST SP 800-41 Rev. 1 under Sources.
- **Practice:** 3 questions (port 8080 and default deny; allow 22 above deny 22; why the reply got out). The answers name rules by their name, not their number, because the list is reordered by then.
- **Checks:** the build re-runs first-match for every event and stops if a decision or a step's "Result" fact disagrees, as Subnetting's numbers do.

### 7.5 Content model and lesson length

- **The schema changes to Watch > Learn > Practice:**
  - `tryIt` goes away and `check` becomes `practice`.
  - `recap` gives way to `learn`: `lead`, `terms` (idea → name pairs), `pattern` (names plus a note), `why`, `deep` and `facts`.
  - Each step gains `deep` (Go deeper) next to `facts`.
- **Lesson 1** needs a level between lesson and step: its 14 protocols. Each has its own overview, steps, learn and practice. The exact shape is the builder's call.
- **References stay required** (designer's call, from the builder check), as the launch spec's §7.3 asks. In lesson 1 each protocol has its own.
  - They appear as a short "Sources" list at the end of Learn's Go deeper, so the approved look doesn't change while Go deeper is closed.
  - The builder drafts them from the RFCs and docs the fact rows already name ("Defined in: RFC …"), and the owner reviews them with the built lessons.
- **Track data:** `src/content/tracks/networking.ts` becomes 20 lessons, with `how-the-internet-works` first in "The big picture" (the slug is a designer's call).
- **Minutes, computed** (designer's call, the launch formula without Try): words read ÷ 200, plus 0.5 per Watch step, plus 1 for Practice, rounded up.
  - Words read: the overview hook and description, every step's narration, Learn's lead, terms, pattern note and why, and every question with its options and feedback.
  - Go deeper and fact tables aren't counted.
  - Lesson 1 counts half a minute of Practice per protocol.
  - Results from the mockup text: **How the Internet Works 96, Subnetting 10, DHCP 8, Firewalls 10**, so 124 in all. Home, the track page and About use these numbers.
- **The limit:** the 15-minute limit stays for every lesson except lesson 1. For lesson 1 it applies to each protocol instead, so each protocol is capped at 15 minutes (designer's call; they run about 5 to 9). Cards show lesson 1 as "96 min" plus "14 protocols".

## 8. Figures: how they get into the site

This is a designer's call; the builder can change the details with reason.

- **Vendor the kit:** copy the Anatomy kit into the repository with its MIT licence (for example `src/art/kit/`), as the illustration notes require when the art ships. Use only the parts the figures need.
- **Draw at build time:** figures are drawn in Astro/TypeScript and land in the HTML as inline SVG. Nothing draws at runtime.
- **Animate at runtime:** the page script only moves named parts and toggles classes. Parts are found by `data-part` or ids. Routes are worked out at build time as screen-space paths.
- **Ids:** every copy of a figure on a page gets unique ids.
- **One camera and one plate size for the family:** the covers and small figures share the 224×148 plate. Scenes fit their own frames to the plate plus its callouts.
- **Callouts:** they sit off the plate so they read in both themes.
- **Page weight** (designer's call): measured **compressed**, every page's HTML stays under about **250 KB gzipped** on first load. The approved mockups already fit: Home is 152 KB, the track page 124 KB, and lesson 1 231 KB with all 14 server layers inline. The two new mockups fit too: Firewalls is 43 KB and About 63 KB. So inline SVG stays everywhere, and engraved text stays live text.
  - Loading lesson 1's layers on demand, or sharing repeated parts with `<symbol>` and `<use>`, is optional. Do it only if a page goes over the budget.
  - The launch spec's JavaScript budget stays.
- **Engines:** keep the timeline engine's rule that going backwards re-derives state from the start, and extend it for the new playback (§3). The new figures replace the old Network view drawing. The packet inspector (`src/scenes/inspector`, `useInspector`) is removed (owner). The Sequence view stays (§12): it is drawn from the same events as the Network view.

## 9. Progress, accessibility, performance

- **Progress:** unchanged from the launch spec §10.5, except:
  - a lesson is **finished** when the learner reaches Practice;
  - lesson 1 follows §7.1;
  - the storage key version goes up only if the saved shape changes.
- **Accessibility:** unchanged from the launch spec §11, at desktop sizes.
  - Every figure has an `aria-label`.
  - The home hero's caption is announced politely.
  - The bits board and the log are real tables or labelled lists.
- **Small screens:** not designed in this build (owner). They must still load and scroll without errors.

## 10. Working and deploying

- **Branch:** the build happens on a feature branch in a worktree (designer's call). Nothing is merged into `main` or pushed without the owner's explicit OK each time (owner).
- **Deploy:** Cloudflare Workers Builds deploys `main` to the preview. Once the owner approves the merge and push, the preview updates, which brings Cloudflare up to date with the redesign (owner asked, 2026-11-05).
- **Domain:** connecting `techconcepts.app` is still a later step.

## 11. Done means

1. Home, the track page, the four lessons, About and 404 match their mockups at 1280×800, 1366×768, 1440×900 and 1920×1080, in both themes, with no sideways scroll.
2. Every ready lesson plays end to end (Overview → Watch → Learn → Practice) by mouse and by keyboard, with reduced motion, and with browser storage blocked.
3. Every number in Subnetting is computed and tested. Every lesson passes schema validation, and every lesson except lesson 1 passes the 15-minute check (lesson 1 passes per protocol).
4. Unit tests and the end-to-end smoke test are updated for the new structure and pass. Removed features (Try, the subnet playground, the packet inspector) have no dead code or tests left.
5. The owner has reviewed the built pages and approved the push.

## 12. Open questions for the owner

None are open. Answered on 2026-11-05:

- **Packet inspector:** dropped for now (owner, §6.3).
- **Firewalls and About:** mocked up before the build (owner), then approved ("Approved", §6.4, §7.4).
- **DHCP step titles:** technical terms (owner, §7.3).
- **Sequence view:** kept. It is drawn from the same events the Network view plays, so it needs no art of its own, and it fits every lesson where messages travel between places: lesson 1's 14 protocols, DHCP, Firewalls, and most lessons still to come. Subnetting, whose Watch is about the address itself, hides the toggle. The owner approved `firewalls-v1.html` with a working toggle in it without choosing keep or remove, so keeping it is my reading of that approval.
- **Subnetting:** I'm treating `subnet-v1.html` as approved, because the owner moved on to the build without asking for changes.

## 13. Left to the builder

- Component structure, file layout, and how the kit is wrapped for TypeScript.
- How lesson 1's protocol level appears in the schema.
- Whether lesson 1 loads its server layers on demand (only needed if a page goes over the §8 budget).
- How the playback engine is extended.
- Test layout, and the exact visual checks used to compare the build with the mockups.
- Build order. Suggested: tokens, fonts and the figure pipeline; the console and schema; DHCP (it proves the console); Subnetting; How the Internet Works; Home; the track page; About and 404; Firewalls last.
