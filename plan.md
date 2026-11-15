# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282.

# Job 14: Networking Concepts' batch 3, Packets, Switch and Load Balancers

**Status: D13 approved by the owner (2026-11-15, "Approve D13", direction 2.66); the build is under way.** **The owner's go is given** (2026-11-15, direction 2.63 and 2.64): "Start batch 3" in job 13's session, then "Go" on this plan. The design gate stays: the three scenes and card arts come to the owner as clickable prototypes with their spec, and nothing is built until the owner approves them. The outlines and the design go ahead without another go.

## Inputs

| | |
|---|---|
| **The job** | Batch 3 of the new Networking lessons: **Packets** (`packets`, stop 2), **Switch** (`switch`, stop 5), **Load Balancers** (`load-balancers`, stop 19), each on job 13's path (handbook §4 and §7), with the design gate. |
| **Done means** | The owner has approved D13; the three lessons are merged into `revamp`, each passed by a fresh fact-checker (`npm run fact-check -- <slug> --check` prints `Report OK`); Networking lists 20 stops, 18 ready; on `revamp`, `npm test`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass, with only the known `e2e/glossary.spec.ts:143` failing if it runs. The full `npm run e2e` is not run: it runs after batch 4, the track's last, and before a deploy (2.61). The owner gets the three lessons, the cost and the errata. Nothing pushed. |
| **Budget** | The estimate below, 4.3 to 6.0 million subagent tokens of growth with the scout; stops at 1.6 million for any one lesson's content and 6.0 million for the batch. |
| **References** | `prototypes/s16-batch-3-facts.md` (this job's scout); `prototypes/d10-scene-map.md` rows 2, 5 and 19 and its notes; `prototypes/d12-batch-2.md` and `d12-cases.md` (the last scene spec, its patch, its errata and cases); `prototypes/d12-batch-2.html` (the last clickable prototype); `.superpowers/analysis/tcp-udp/report.md` (a new lesson's outline); `src/content/lessons/mac-address.ts` (the shape to write to); `docs/content-model.md` §2, §3 and §8; handbook §4, §6a and §7. |

## What the scout found (S16)

- **Where they sit.** Packets is stop 2 ("The big picture", after OSI Model), Switch stop 5 ("Addresses & the local network", between MAC Address and ARP), Load Balancers stop 19 ("Protecting & scaling traffic", between Proxies and VPN, both not ready). No file exists. Once ready, Up next runs osi-model → packets → ip-address → mac-address → switch → arp, and firewalls → load-balancers, whose end reads "Lesson 20 is coming soon."
- **Documents.** Packets: RFC 791, 8200, 1122, 9293, 768, 1191, 1812 are registered; RFC 8900, 8201, 4821, 2991 and 2992 (ECMP) are not, and no "what is a packet" page is. Switch: **no switching standard and no MAC-learning or flooding source is registered**; the only IEEE entries are job 13's RA guidelines, RA FAQ and the IEEE 802-2024 page; 802.1Q and 802.3 are not. Load Balancers: Microsoft's Azure Load Balancer, Application Gateway and Traffic Manager pages and Cloudflare's load-balancing "Proxy status" page are registered; AWS, NGINX, HAProxy and F5 are not, and none of their hosts is allowed. Allowed vendor hosts include `learn.microsoft.com`, `developers.cloudflare.com`, `www.cloudflare.com`, `www.cisco.com`, `docs.cloud.google.com`.
- **What they must agree with.** No checked lesson or glossary entry speaks of a switch, a hub, a MAC table, flooding, a pool, health checks or a reverse proxy. Packets must agree with the glossary's Packet, Frame, Segment and Datagram (`glossary-groups/packets.ts:116-176`: "an IP header followed by data"; "a fragment of one that was split"; "may arrive … out of order or not at all"), OSI Model's segment/datagram/packet/frame line (`osi-model.ts:603`) and "IP itself guarantees no delivery" (`:314`), What is TCP's segments and out-of-order buffer (`what-is-tcp.ts:382-389`), and TCP/UDP's "PIECE 1..3". Switch must agree with MAC Address (Wi-Fi: every device in range hears every frame, `mac-address.ts:417, :522`) and ARP. Reuse: MACs `00:00:5E:00:53:01/10/11/12`, `192.168.1.100`, `203.0.113.80`, example.net.
- **Scenes.** Five figure kinds (`dhcp`, `subnet`, `firewall`, `net-map`, `osi`); a new kind touches `types.ts`, `schema.ts:37`, `scenes/index.ts`, `drivers/index.ts`, `parts.ts` and their tests (`parts.test.ts:7`, `index.test.ts:10`). **No switch, hub or pool is drawn anywhere**; net-map draws racks on its server plates. **net-map moves one tag at a time** (`net-map.ts:373`, "only one rides at a time"; the driver awaits each event), with no numbering but the tag's words; slot `NE` is drawn and unused. The `table` panel has `add`, `update` with `miss`, `match`, the no-match row, `keyColumn`, `markLabel`. The `dhcp` figure's ring and verdicts draw one tag and one ring per event, no copies. All five drivers ship in the shared console chunk; drawings stay out of the page.
- **Counts.** About 30 places count 15 ready of 20, 25 lessons, 25 reports, the Up next chain, "Lessons 18 to 20 are coming soon", `NO_SEQUENCE`; `track.test.ts:30` pins Packets as not ready (S16 §5).
- **Budgets.** Lesson HTML under 250 KB gzipped (TCP/UDP 132 KB, the biggest); lesson JavaScript under 200 KB, with every driver in the shared chunk: two new drivers add to every lesson page.
- **Collisions.** `sources.ts` and its test's id list, `SOURCE_HOSTS`, `figures.ts`, `spots.ts`, `figures.test.ts`, `parts.ts`, `types.ts`, `schema.ts:37`, the drivers' index, the count tests.

## Decisions in this plan

1. **Job 13's path, three side by side.** For each lesson: the analyst's outline; the orchestrator's rulings and every new document registered on `job14/batch` in one commit before any author starts; the design; the owner's gate; the spec review; the build; the author on its own branch while the build is reviewed; the continued analyst's read; a fresh full check (a targeted re-check after a near-pass).
2. **Every lesson is a Watch story of about five steps.** The catalogue's playgrounds (change the file size, re-plug a laptop, switch round-robin to least connections) are not built, as in batches 1 and 2; a step can show what a playground would.
3. **One designer unit, D13, in three parts so no designer compacts** (job 13's designer reached 0.72 million with two compactions). D13a Packets, D13b Switch, D13c Load Balancers, each a fresh `designer` working side by side: `prototypes/d13-<slug>.html` (clickable, step by step, 375 and 1440, both themes, its card spot on Networking's route) and `prototypes/d13-<slug>.md` (spec, each spot and new part as its own `.svg`, and a patch whose output is those files, job 12's way). The patches are applied in the order a, b, c; a hunk in a shared list keeps every part's entry. `prototypes/d13-batch-3.html`, written by the orchestrator, frames the three for the gate. One variant a scene; a second only where the designer finds a real fork.
4. **The scenes, reuse first.**
   - **Packets on `net-map`**, with the new ability job 11 named: several numbered tags on the map at once, arriving out of order, and a tray at the receiver that puts them back in order (the `tray` cue grown). Whether they take different ways through the a-to-d mesh is the analyst's ruling first (decision 7), not the designer's.
   - **Switch on a new `switch` figure**: one switch, four to six ports with a wired device on each, flooding as a fan of copies, the `table` panel as the MAC table (port, MAC) with the no-match row for an unknown address. A wired switch cannot be drawn honestly on the `dhcp` figure's Wi-Fi, where every device hears every frame.
   - **Load Balancers**: a balancer in front of a pool of three servers, each with a health light, the `table` panel as the pool; a server going down is an `update` with `miss`. The designer first tries net-map's server plates (slot `NE` is drawn and free) and draws a new `pool` figure only if net-map cannot show it, saying why.
   - Card art: three spots, copied from the spec's SVG and tested tag for tag.
5. **The prototype's words go to the analysts before the gate** (job 13, E12). When D13's parts are done, each lesson's analyst (continued) reads its scene's words that state a fact: step lines, tags, table cells, labels. The designer applies the rulings before the owner sees the prototypes.
6. **One spec review and one builder for every shared file** (`net-map`, the new figure or figures and their drivers, panels, `spots.ts`, `figures.ts`, `parts.ts`, `types.ts`, `schema.ts`), on `job14/batch`, with a test-only fixture per scene. The builder keeps a progress file in parts so a compaction or a stop loses nothing. **Only the orchestrator numbers errata**; a builder, designer or reviewer proposes, the orchestrator numbers.
7. **What each lesson must not overclaim**, given to its analyst in the first brief:
   - *Packets:* who splits the data (TCP into segments, each in an IP packet, as OSI Model and the glossary say; IP fragmentation is something else and is rare); "packets take different routes" is true of IP's datagram service but routers usually keep one connection on one path (ECMP, RFC 2991 and 2992), so the scene shows it only as the analyst rules it; out-of-order arrival and its repair by TCP agree with What is TCP.
   - *Switch:* IEEE 802.1Q (which absorbed 802.1D) defines learning and flooding; it is likely behind IEEE's sign-in, as 802.3 was. The analyst looks first for IEEE's free standard page (registered as kind `ieee`) and two publishers on allowed hosts (Cisco, Cloudflare); a source readable only after a sign-in comes to the owner. Switch must not contradict MAC Address's Wi-Fi (a switch is wired; on Wi-Fi every device in range hears).
   - *Load Balancers:* no standard defines one, so every claim needs two publishers, and a product's detail (round robin, least connections, a 5-tuple hash, health probes) is said only where two publishers state it. Allowed hosts first (`learn.microsoft.com`, `developers.cloudflare.com`, `www.cloudflare.com`, `docs.cloud.google.com`, `www.cisco.com`); a new host only when it is the publisher's own and no listed host states the idea. Proxies (batch 4) comes before it on the route but after it in time: Load Balancers says nothing about proxies that a beginner would need that lesson for.
8. **The read before the check, widened** (job 13): it tests every `defining: true` against what the document actually defines, every Go deeper sentence for two publishers, and the absolutes ("every", "only", one range, one number) in the facts most items trace to. Added to `docs/briefs/analyst-read-before-check.md` in this plan's commit.
9. **Analysts get private scratch folders** (`.superpowers/analysis/<slug>/scratch/`) and check that `cite()` accepts a citation form before proposing it.
10. **Agreement with checked words.** No checked lesson's or glossary entry's words change. A line at odds that changing the new lesson cannot settle stops the work.
11. **One model lower where job 13 said so.** An author's fix that is exactly what the checker named (a citation added, a marker removed, a few words) goes to a Haiku `author`. The counts (B16) go to a Haiku `builder`, with the `e2e` specs following `e2e/batch2.ts`; if it fails, Sonnet.
12. **The counts move once.** After the three lessons are merged into `job14/batch`, B16 moves every count S16 §5 lists to 18 ready, 28 lessons and 28 reports, adds `e2e/{packets,switch,load-balancers}.spec.ts`, and sets `NO_SEQUENCE`.
13. **No glossary ties** (2.48). **Held for the owner from job 13, untouched:** Subnetting's bits board scrolling at 1440, DHCP's RFC 3927 `#abstract` citation, the net-map lessons' no-JavaScript fallback.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S16 | scout | scout (Haiku) | Sizes, documents, agreement, scene parts, counts, collisions. Done (`prototypes/s16-batch-3-facts.md`). | Every fact has a `path:line`. |
| L25-a, L26-a, L27-a | content | analyst (Opus), one a lesson | The outlines of Packets (L25), Switch (L26), Load Balancers (L27) in `.superpowers/analysis/<slug>/report.md`: ideas with sources, the Watch story on decision 4's scene, agreement lines, what not to claim (decision 7), the badge, documents to register. | Every passage found by script. |
| L25-r, L26-r, L27-r | content | orchestrator | Rulings in each report; every new document and host registered on `job14/batch` in one commit. | `npm test` passes. |
| D13a, D13b, D13c | design | designer (Opus 5.5), one a scene | Decision 3. | Each scene's steps traced to the outline; each SVG and prototype looked at in both themes at 375 and 1440. |
| L25-w, L26-w, L27-w | content | the lesson's analyst, continued | Decision 5: the prototype's words. | Rulings applied by the designer. |
| **Gate** | design | **the owner** | Approves D13 (or sends it back). | The owner's words, recorded. |
| B15a spec, B15b spec, B15c spec | build | reviewer (Opus), one a spec, side by side | Holes and attack cases for `d13-packets.md`, `d13-switch.md`, `d13-load-balancers.md`; `prototypes/d13-<slug>-cases.md`. | Holes with one right answer closed as errata, numbered by the orchestrator. |
| B15a, B15b, B15c | build | builder (Sonnet), one a scene, **one after another** on `job14/batch` | B15a Packets (the net-map `park`/`unpark` and `via`), B15b Switch (the `switch` figure), B15c Load Balancers (the `pool` figure): each applies its spec's Appendix A in order a, b, c, adds its cues, validator rules, spot, `figures.ts` line and a fixture. One builder at a time, so one writer for each shared file; three fresh builders so none compacts (as D13). | Each case a test; the spot equal to its `.svg`; `npm test`; build in budget. |
| B15 review | build | reviewer (Opus) | The build against the specs, the prototypes, the SVGs and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| L25-b, L26-b, L27-b | content | author (Sonnet), one a lesson | `src/content/lessons/<slug>.ts` on `lesson/<slug>`, from the outline and the fixture. | The sheet prints; `astro check` clean; development tests fail only on the missing report and the counts. |
| L25-p, L26-p, L27-p | content | the lesson's analyst, continued | The read before the check (decision 8). | Numbered rulings, applied. |
| L25-c, L26-c, L27-c | content | a fresh fact-checker (Opus) a lesson | The check; a targeted re-check after a near-pass. | `--check` prints `Report OK`. |
| B16 | build | builder (Haiku) | Decision 12. | `npm test`; the three new specs, `site.spec.ts`, `lesson.spec.ts` at d1440-dark and phone. |
| F14 | end | orchestrator | `job14/batch` into `revamp`; CI's end-to-end pass; ledger, direction row, the owner's result. | `npm test`, `npm run build`, CI's e2e pass on `revamp`. |

Order: the three outlines together; rulings and the registry commit; D13's three parts together; the prototype words read; **the gate**; the three spec reviews; B15a, B15b, B15c in turn, each lesson's author starting once its scene is built; one build review of the three; the reads; the checks; each lesson merged into `job14/batch` as it passes; B16; F14. At most three heavy agents at once. Worktrees under `.superpowers/wt/` (`job14`, `packets`, `switch`, `load-balancers`), E2E ports 4481 to 4484.

## Estimate

From job 13: a new lesson's content 0.73 to 1.19 million; three scenes with a clickable prototype 1.56 million, on figures that existed. This batch draws one or two new figures and teaches net-map a new ability, and Load Balancers rests on vendors alone.

| Part | Growth, roughly |
|---|---|
| Three outlines, the prototype words and the reads | 1.1 to 1.5 million |
| Three authors | 0.55 to 0.7 million |
| Three checks, and a re-check allowance | 0.5 to 0.9 million |
| D13: three designers | 0.75 to 1.05 million |
| B15: spec review, build, build review | 1.05 to 1.5 million |
| B16: counts and lesson specs | 0.05 to 0.15 million |
| **After S16** | **4.0 to 5.8 million** |

S16 spent 272,572. With it, **4.3 to 6.0 million**, under job 11's proposal of 5.5 to 7.0. The top meets the 6.0 million stop: if the batch nears it, the work stops for the owner as below.

## When the work stops for the owner

- **This plan**, now.
- **The design gate**, after D13 and the prototype words' read.
- One lesson's content past 1.6 million tokens of growth without an all-pass; the batch past 6.0 million.
- A claim that fails three checks; a Watch story no allowed source backs.
- A new host that is not the publisher's own; a source readable only after a sign-in (IEEE 802.1Q may be; decision 7).
- A line at odds with a checked lesson or glossary entry that changing the new lesson cannot settle.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports. Everything else the orchestrator decides, records in the direction document, and reports with the job's result.

## What could go wrong

- **Beginner words that outrun the sources.** "Each packet takes its own route", "a file is cut into packets by IP", "a switch sends a frame only to the right port" (it floods an unknown address), "a hub and a switch are the same", "a load balancer takes turns" (Azure's hashes the connection), "a dead server is skipped at once" (a probe must fail first). The outlines list what not to claim; the reads catch the rest.
- **IEEE behind a sign-in.** Switch may rest on Cisco and Cloudflare pages with IEEE's free standard page; if learning or flooding has no second publisher, it comes to the owner.
- **Load Balancers on vendors alone.** Each product says it its own way; a Learn part many items trace to needs two publishers and no absolutes.
- **The new net-map ability.** Several tags at once changes the driver's one-at-a-time loop: every existing net-map lesson's timing must stay byte for byte (job 13's review checked durations; the spec review names it again).
- **Two new drivers in the shared chunk.** Every lesson page loads them; the build's budget check catches a breach, and the spec review asks whether a driver can stay small.
- **Three branches meet** at `sources.ts`, the counts and the spots. One writer for shared files; registry entries committed once before the authors start.

## After this job

- Batch 4 (Proxies, VPN), the track's last, through the design gate unless the owner says otherwise; compare mode is designed with Proxies. Then the full `npm run e2e`.
- The glossary when the owner resumes it, with the new lessons' ties.
- Deploying `revamp` (the owner's): `main` is at `3eab7e6`, before job 12.
