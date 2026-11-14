# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, and job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb.

**Status: the owner said go on 2026-11-14, sharing the four tour lessons** ("Go, share them"), which approved the nine decisions below, decision 2 accepted (direction 2.49).

## Inputs

| | |
|---|---|
| **The job** | Job 11: **Networking Concepts' first new lesson, as a pilot** (handbook §7), and the track made ready for the rest. The owner, 2026-11-14: "Let's circle back to the glossary at another time. Now let's finish the Networking Concepts lessons." (direction 2.48). No lesson has yet been written new under the cited method, so the first one is a pilot that measures the path, as Phase 4 began. |
| **Done means** | Router (decision 1) is live on `/networking/router`: written from an analyst's outline, its scene and card art approved by the owner at the design gate and built to that design, passed by a fresh fact-checker (`npm run fact-check -- router --check` prints `Report OK`). If the owner accepts decision 2, Networking Concepts lists the four checked tour lessons it shares. On `revamp`, `npm test`, `npm run build` and the full `npm run e2e` pass, with one known exception (decision 8). The owner gets the lesson, its measured cost, the scene map for the other eleven lessons, and the plan for them. |
| **Budget** | Not set by the owner. The estimate is 2.0 to 3.4 million subagent tokens of growth after the go (below); the stops are under "When the work stops for the owner". |
| **References** | `prototypes/s13-networking-facts.md` (this job's scout); `docs/content-model.md` §3 and §8; handbook §3, §4, §6a and §7; `src/content/lessons/dhcp.ts`, `firewalls.ts` (checked Networking lessons: the shape to write to); `src/content/lessons/what-is-ip.ts` (its routing steps, which Router must agree with); the launch catalogue, `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md` §8 (one row a lesson); direction §6 and §7 (the look, the Lesson page). |

## What the scout found (S13, `prototypes/s13-networking-facts.md`)

- **The track:** 19 lessons in six parts; 4 are live and checked (OSI Model 1, Subnetting 7, DHCP 9, Firewalls 16), **15 have no file**. A lesson with no file shows as "Not ready yet" on the track page and has no page (a 404). No draft, outline or claim sheet exists for any of the 15; each has one row in the launch catalogue.
- **Overlap.** Four catalogue rows tell the story a checked tour lesson already tells: DNS (resolver, root, `.com`, authoritative, caching) is What is DNS; TLS (handshake, certificate check, key agreement) is What is TLS; HTTP/HTTPS is What is HTTP and What is HTTPS; TCP/UDP's two halves are What is TCP and What is UDP, though its catalogue row is a side-by-side comparison neither tells. Switch, Proxies, Load Balancers and VPN have no tour lesson; the other seven touch steps of What is IP, What is DHCP or What is TCP.
- **One lesson, two tracks, is already supported.** `registry.ts` builds each track's entries from the lesson files; a lesson listed by two tracks gets a page in each, its canonical URL in the first track that lists it (`homeOf`, `registry.ts:363`; How the Internet Works is first). The tour's titles are "DNS", "HTTP", "HTTPS" and "TLS/SSL", which read as Networking's own. About's "lessons ready" is a plain sum across tracks (`about.astro:31`) and would count a shared lesson twice.
- **Scenes.** Five figures are built (`dhcp`, `subnet`, `firewall`, `net-map`, `osi`); the catalogue's "Device table" and "Playground" kinds are not. `net-map` already draws routers (`a` to `d`) between a laptop and the servers, and a `table` panel exists (DHCP's lease table). A live lesson needs a card figure in `src/lib/figures.ts` or the build throws (`figures.ts:24`), so every new lesson needs card art too.
- **Sources.** Most defining documents are registered (RFC 1812 for routers, RFC 826 ARP, RFC 3022 NAT, the IANA port registry, RFC 1034/1035, RFC 9293, RFC 768). Not registered: IEEE 802 / 802.3 / 802.1D / 802.1Q (no `ieee` source exists yet), RFC 2663, RFC 4301, RFC 2818. Load balancers and proxies rest on vendor pages and RFC 9110.
- **Tests that count the track:** `registry.test.ts:41-77` (19 slugs, titles, numbers), `reports.unchanged.test.ts:21` (18 lesson reports), `tracks-page.test.ts:26-28`, `track.test.ts:28`, `LessonConsole.test.tsx` ("of 19"), and `e2e/site.spec.ts` (`'4 of 19 lessons ready'`, 15 "Not ready yet", 19 squares, at `:263-267`, `:522-529`, `:580-609`, `:695`, `:720-767`, `:924`). The end-to-end specs find ready lessons from the track pages (`e2e/global-setup.ts`).
- **Glossary.** New lessons' terms would tie to entries (`router`, `routing-decision`, `forwarding`, `default-gateway` exist); no test requires a tie.

## Decisions in this plan (the go approves them)

1. **The pilot is Router** (lesson 8, "Getting between networks"). Its defining standard is registered (RFC 1812, with RFC 791 and RFC 1122), so the pilot measures the new-lesson path without first opening a new kind of source (IEEE, which MAC Address and Switch need). `net-map` already draws routers between a laptop and servers and a `table` panel exists, so its scene (a packet hop by hop, the routing table choosing each next hop, the default gateway) is a design problem on parts the code already has, not a new figure; the scene map (decision 4) measures what new figures cost. Its subject is in the checked What is IP (steps "Routing Decision" and "Return Routing") and in the glossary (`router`, `routing-decision`, `forwarding`, `default-gateway`), so the pilot also proves a new lesson can be made to agree with checked words. Not chosen: Packets (lesson 2, next in order) needs a new figure, so its pilot would mix two unknowns; ARP and NAT are close seconds and go in the first batch.
2. **Networking Concepts shares the four tour lessons that tell its catalogue's story, instead of writing them again.** The track lists `what-is-dns` ("DNS") where `dns` was, `what-is-tls` ("TLS/SSL") where `tls` was, and `what-is-http` ("HTTP") and `what-is-https` ("HTTPS") where `http-https` was: 20 stops, 8 of them live, **11 left to write after the pilot**. Why: each is already cited and checked against the same documents a new lesson would cite, at the same track limits (the tour inherits Networking's); a second lesson on one subject costs about 1 million tokens and must agree with the first forever (the two DHCP lessons already differ in their verbs, S13 §C). What is lost: Networking's versions could have gone further than the tour's; nothing in those four catalogue rows asks for more than the tour lessons show. TCP/UDP stays a new lesson: its point, the two side by side, is a story neither tour lesson tells. A shared lesson's canonical page stays in the tour. Not chosen, and the owner's to pick instead: write all three as new lessons (about 3 to 4.5 million tokens more, 14 left after the pilot).
3. **A new lesson's analyst report is an outline** (handbook §7): every idea the lesson will teach a beginner, each with its source, section and quoted passage; the Watch story (four to six steps, each backed); what it must agree with in checked lessons and glossary entries; the OSI badge's backing; and what a beginner lesson should not claim. The author writes from it once, then the continued analyst's read and a fresh check run as in Phase 4 (handbook §4). There are no words to keep, so the end-of-track report of changed sentences does not apply; the owner reads the lesson itself.
4. **Design first, one gate.** After the outline, `designer` draws Router's scene (each Watch step on the figure, the routing table panel) and its card art, at 375 and 1440, as a prototype in `prototypes/d10-router.html` with its spec; two variants at most. In the same unit, at small cost, a one-page **scene map** for the other eleven lessons (`prototypes/d10-scene-map.md`): which figure each can use, which need a new figure or panel, and what card art each needs. The scene map is for the next plan's estimate, not for approval. The owner approves D10; the scene's design is then frozen.
5. **Build before the author writes.** A Watch step's events must fit the figure's parts (`define.ts` `checkUnit`), so the builder (B12) adds what Router's scene needs (parts, driver, panel, card art, `figures.ts`) against the approved spec, and the author writes on top of it. Spec review first, for both build units.
6. **No glossary ties in this job.** The glossary is paused (2.48); Router's Learn terms tie to the existing entries when it resumes. Router's words must still agree with those entries' definitions; a line at odds stops the work, as in job 10.
7. **The counts move.** B11 (decision 2) and B12 update every test S13 §F lists, and About counts a shared lesson once.
8. **One known failure.** `e2e/glossary.spec.ts:141` (the Glossary page's end at 375) is red on `revamp` and held by the owner (2.48). The job's full `npm run e2e` is done when that is its only failure; nothing in this job touches the glossary.
9. **The job stops after the pilot.** The owner gets Router, its measured cost, the scene map and the plan for the other eleven (three a batch, a session each, design gate a batch), and says go on that.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S13 | scout | scout (Haiku) | Size of the work, overlap, sources, tests. Done (`prototypes/s13-networking-facts.md`). | Every fact has a `path:line`. |
| B11 | build | builder (Sonnet); reviewer (Opus) for the spec and the build | Decision 2: Networking lists `what-is-dns`, `what-is-tls`, `what-is-http`, `what-is-https` in place of `dns`, `tls`, `http-https`; About counts a lesson once; every count test S13 §F names updated. Spec: decision 2 and this row; cases saved here after the spec review. Only if the owner accepts decision 2. | `npm test`, `npm run build`; `/networking/dns` is gone and `/networking/what-is-dns` renders with its canonical at `/how-the-internet-works/what-is-dns`; the track page shows 20 stops, 8 ready; About's "lessons ready" is 18; `e2e/site.spec.ts`, `e2e/lesson.spec.ts` pass. |
| L18-a | pilot | analyst (Opus) | Router's outline (decision 3), in `.superpowers/analysis/router/report.md`, sources saved beside it. | Every passage found by script in its saved source; the agreement list against What is IP and the four glossary entries. |
| L18-r | pilot | orchestrator | Rulings in the report; Router's new documents registered on its branch. | `npm test` passes. |
| D10 | design | designer (Opus, the orchestrator's model) | Router's scene and card art, 375 and 1440, both themes; the scene map (decision 4). | Both widths looked at in the browser; the spec names every figure part, cue and panel row a step uses. **Design gate: the owner approves.** |
| B12 | build | builder (Sonnet); reviewer (Opus) for the spec and the build | What the approved scene needs in code: figure parts, driver, the table panel's rows, card art, `figures.ts`. Spec: D10's; cases in `prototypes/d10-cases.md`. | Each attack case a test; the prototype matched at 375 and 1440; `npm test`; build review PASS. |
| L18-b | pilot | author (Sonnet) | `src/content/lessons/router.ts`, written once from the outline on B12's branch. | `npm run fact-check -- router` prints the sheet; `npx astro check` clean; `npx vitest run --mode development` fails only on Router's missing report. |
| L18-p | pilot | Router's analyst, continued | The read before the check; the author applies it. | Numbered rulings with exact words and citations, applied. |
| L18-c | pilot | a fresh fact-checker (Opus) | The check; a targeted re-check after a near-pass. | `npm run fact-check -- router --check` prints `Report OK`. |
| F11 | end | orchestrator | Merge into `revamp`; the full `npm run e2e`; the ledger's totals and "What to do differently next time"; the direction rows; the next plan for the owner. | `npm test`, `npm run build`, full e2e (decision 8) on `revamp`; counts in `team.md`. |

Order: at the go, B11's spec review and L18-a start together (different files). B11 builds and merges while the outline is written. D10 starts from the outline and its rulings, then the job stops at the design gate. After the owner approves: B12's spec review, B12, L18-b on B12's branch, L18-p, L18-c, F11. Each in its own worktree under `.superpowers/wt/`, E2E ports from 4481.

## Estimate

Phase 4's lessons cost 0.74 to 1.23 million tokens of growth each, half of it the analyst's; a new lesson's analyst must find what to teach rather than check what is there, and its author writes rather than edits. Design and build units are taken from job 9 (D9 and B8) and job 10 (B10).

| Part | Growth, roughly |
|---|---|
| B11: spec review, Sonnet build, build review | 0.35 to 0.6 million |
| L18-a, L18-p: the outline and the read | 0.4 to 0.65 million |
| D10: Router's scene and card art, the scene map | 0.4 to 0.7 million |
| B12: spec review, Sonnet build, build review | 0.4 to 0.8 million |
| L18-b: the author | 0.25 to 0.35 million |
| L18-c: the check, and a re-check allowance | 0.15 to 0.3 million |
| **After the go** | **2.0 to 3.4 million** |

S13 spent 336,994 before the go. Without decision 2, B11 does not run (0.35 to 0.6 million less in this job, about 3 to 4.5 million more for the track). The orchestrator's own tokens are not counted, as in every job.

For a sense of the whole track (not approved by this go): eleven new lessons at 0.8 to 1.3 million each is 9 to 14 million, plus figures and card art the scene map will size, perhaps 3 to 6 million; four batches of three. The pilot replaces these guesses with measured numbers before anyone says go on them.

## When the work stops for the owner

- **The go on this plan**, with decision 2 (sharing four tour lessons) accepted or not.
- **The design gate** on D10.
- Router past **1.6 million** tokens of growth for its content units (L18-a, -b, -p, -c) without an all-pass; the job past **3.8 million**.
- A claim that fails three checks; a Watch step whose story no allowed source backs.
- A line of Router at odds with What is IP or a glossary definition that cannot be settled by changing Router.
- A new host that is not the publisher's own.
- **The pilot's end** (decision 9).
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports. Everything else the orchestrator decides, records in the direction document, and reports with the job's result.

## What could go wrong

- **A beginner's routing story says more than RFC 1812 does.** "The router picks the best path", "every router knows the whole map", "longest match always wins" are the general words a check fails. The outline lists what each step may say before anyone draws it, and the scene follows the outline.
- **The scene outruns the outline.** A designer can draw a hop the sources do not back. D10's spec names the outline's backing for every step; the spec review checks it.
- **`net-map` cannot show a routing table** without new parts. Then B12 is larger than estimated; the spec review sizes it before the build.
- **Router disagrees with What is IP.** The analyst lists every line of What is IP and the glossary on routing first; Router is changed to agree, What is IP's words are not (they are checked).
- **A shared lesson shows twice in the end-to-end run.** `global-setup.ts` finds lessons from both track pages; B11's spec review checks the run does not test one lesson twice, or accepts it.
- **The known glossary failure hides a new one.** F11 compares the e2e failures by name with decision 8's one.
- **The orchestrator's context grows.** One session for this job; little read; hand-backs of 150 words or fewer.

## After this job

- The other eleven lessons, three a batch, a session a batch, each batch's scenes through the design gate together (the next plan, from the pilot's numbers and D10's scene map).
- The glossary when the owner resumes it: batch 4 (`remote`, `mail`), F10, the page's end at 375, and the new lessons' ties.
- The revamp goes live (the owner's).
- Held, for the owner to reopen: the standalone Practice page and its missed list (D6, D7); About's sources box; the registry addresses that moved; the code for lessons of several units; exporting saved progress; objective mappings' own fact-check path.

## Not in this plan

- Any change to a checked lesson's words, including What is IP and the four shared tour lessons.
- Any glossary entry, tie or page change.
- A new layout for the Lesson page or the track page: only Router's scene and card art are new.
- Copying another site's text or art; a source host that is not a publisher's own.
- Anything that leaves this machine.

## B11: the spec review's holes, errata and cases (2026-11-14)

The reviewer (Opus) found nine holes; each has one right answer, ruled by the orchestrator as errata:

- **E1 (hole 1, card art).** A shared lesson's card shows the same art on every track: `lessonFigure` chooses by the lesson's home track (`homeOf`, How the Internet Works for the four), not the page's, as `src/lib/figures.ts:1` already states ("every page that shows a lesson shows the same figure"). So Networking's route shows the tour's name tiles for DNS, HTTP, HTTPS and TLS/SSL beside its spot art. Nothing new is drawn; D10 looks at the route at 375 and 1440, and if the mix reads badly that goes into D10 for the owner.
- **E2 (hole 2).** `e2e/visual.spec.ts:100` and `:103` name tests and screenshots by `lesson.path`, not the slug, so a lesson found on two track pages runs under each without "duplicate test title". `lesson.spec.ts` already names by path and runs the 4 more lessons (22).
- **E3 (hole 3).** Numbers and order: DNS 13 (in "Talking across the internet", where `dns` was), HTTP 14, HTTPS 15, TLS/SSL 16 (in "The web"), Firewalls 17 … VPN 20. Ready: 1, 7, 9, 13, 14, 15, 16, 17.
- **E4 (hole 4).** About's "lessons ready" counts distinct slugs, as `lessonCheckCounts` does (`src/lib/checked.ts:12`): 18. Its test asserts the distinct count, never the old sum.
- **E5 (hole 5).** The Glossary's "Described in" line is derived from `tracksOf`, so entries tied to the four lessons will name both tracks. True and derived; no report goes stale (group sheets hold no tracks). Accepted, tested, and reported to the owner (the glossary is paused, but nothing in it is edited).
- **E6 (hole 6).** Progress is keyed by slug, so a shared lesson finished in one track is done in both (the existing design, `registry.test.ts:319`). Stated and tested.
- **E7 (hole 7).** `what-is-http.ts:233` "The TCP lesson looks at it closely." shows under `/networking/` too; it is true site-wide (the tour's TCP lesson) and checked words do not change. Accepted, reported to the owner.
- **E8 (hole 8).** `/networking/dns`, `/networking/tls`, `/networking/http-https` return 404; no redirect is added (they were never built).
- **E9 (hole 9).** The stale comments go: `networking.ts:4` ("19 lessons"), `src/lib/home.ts:210`, `src/lib/hub.ts:77`.

### Attack cases (each a test)

*Unit tests and the build*
- `registry.test.ts:41-77`: 20 slugs in order; titles exactly `DNS`, `HTTP`, `HTTPS`, `TLS/SSL`.
- Networking's ready slugs and numbers: osi-model 1, subnetting 7, dhcp 9, what-is-dns 13, what-is-http 14, what-is-https 15, what-is-tls 16, firewalls 17.
- `tracksOf('what-is-dns')` is `['how-the-internet-works', 'networking']` (red if the track order flips).
- `neighbors(getEntries('networking'), 'dhcp').next.url` is `/networking/what-is-dns`; Networking's `what-is-tls` has next `firewalls`; the tour's `what-is-tls` has next `null`.
- `lessonFigure('networking', <DNS entry>)` does not throw and equals the tour's tile.
- `checkListings` fixture: a lesson listed by two tracks keeps an override only one of them needs; an override neither needs throws, naming both tracks (`registry.ts:204`).
- `lessonCheckCounts()` is `{ checked: 18, total: 18 }`; the glossary's `readyLessons()` has 18 entries.
- `reports.unchanged.test.ts:21` stays at 18 (no report added).
- `check-budgets` passes with the 4 more pages; `/networking` HTML stays under 250 KB.
- `tracks-page.test.ts:26-28`: 20 entries, 8 known. `LessonConsole.test.tsx:162`, `:444`: 20.
- `about-page.test.ts:52`: the distinct count (18).

*End to end*
- `lesson.spec.ts:275`: on `/networking/what-is-dns`, `link[rel=canonical]` and `og:url` are `https://techconcepts.app/how-the-internet-works/what-is-dns`; the tour's copy the same; `/networking/dhcp` keeps its own; `og:image` the default on both.
- `site.spec.ts:580-594`: 20 stops, 8 ready, 12 not ready; ready titles in order OSI Model, Subnetting, DHCP, DNS, HTTP, HTTPS, TLS/SSL, Firewalls; DNS's `h3 a` links to `/networking/what-is-dns`.
- Strip "0 of 20 lessons done · 8 ready" at `:522`, `:609`, `:729`, `:742`; 20 squares at `:529`; 20 stops at `:695`, `:924`.
- Home (`:263`, `:736`, `:765`): `['14 lessons', '8 of 20 lessons ready']`, 20 `.leg__run i`, 8 with `[data-ready]`.
- About: the `.stats` "lessons ready" value is `18` (a new check in `site.spec.ts`).
- A shared lesson under `/networking/`: "Lesson 13 of 20" (the tour's copy "6 of 14"), the console's "All 20 lessons", the track link to `/networking`; Networking's TLS/SSL's Up next is Firewalls at `/networking/firewalls`, the tour's TLS/SSL ends "the last lesson of this track"; `/networking/dhcp`'s Up next is DNS at `/networking/what-is-dns`, with art; `/networking/firewalls` ends "Lessons 18 to 20 are coming soon."; `/networking/{dns,tls,http-https}` return 404.
- Progress (near `site.spec.ts:720`): finish `/how-the-internet-works/what-is-dns`, then `/networking` reads "1 of 20 lessons done · 8 ready" and DNS's stop shows Done; opening `/networking/what-is-dns` stores `lastTrack: 'networking'`.
- `npx playwright test --list` reports no "duplicate test title"; `global-setup.ts` finds 22 lessons.
- `e2e/glossary.spec.ts:65` area: `#root-server .gl-row--tracks` reads "Described in How the Internet Works, Networking Concepts"; `#ping` stays tour-only.
