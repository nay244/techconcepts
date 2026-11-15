# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, and job 12's (batch 1: ARP, Ports, NAT) at 77c72a8.

# Job 13: Networking Concepts' batch 2, IP Address, MAC Address and TCP/UDP

**Status: the owner's go is given** (2026-11-15, direction 2.57): "Let's start the next batch of lessons. Start a new session". It covers batch 2 as job 11's plan proposed it (at 84cef62, "Proposed next"). **The design gate stays** (2.52 skipped it for batch 1 only): the designer's three scenes and card arts come to the owner as a clickable prototype and spec, and nothing is built until the owner approves them. The outlines and the design go ahead without another go.

## Inputs

| | |
|---|---|
| **The job** | Batch 2 of the new Networking lessons: **IP Address** (`ip-address`, stop 3), **MAC Address** (`mac-address`, stop 4), **TCP/UDP** (`tcp-udp`, stop 11), each on job 12's path (handbook §4 and §7), with a design gate. |
| **Done means** | The owner has approved D12; the three lessons are merged into `revamp`, each passed by a fresh fact-checker (`npm run fact-check -- <slug> --check` prints `Report OK`); Networking lists 20 stops, 15 ready; on `revamp`, `npm test`, `npm run build` and the full `npm run e2e` pass with only the known failure `e2e/glossary.spec.ts:143`. The owner gets the three lessons, the cost and the errata. Nothing pushed. |
| **Budget** | The estimate below, 3.2 to 4.6 million subagent tokens of growth with the scout; stops at 1.6 million for any one lesson's content and 6.0 million for the batch. |
| **References** | `prototypes/s15-batch-2-facts.md` (this job's scout); `prototypes/d10-scene-map.md` rows 3, 4 and 11 and its notes; `prototypes/d11-batch-1.md` and `d11-cases.md` (the last scene spec, its patch and its cases); `prototypes/d10-router.html` (the last clickable prototype); `.superpowers/analysis/nat/report.md` (the shape of a new lesson's outline); `src/content/lessons/arp.ts` (the shape to write to); `docs/content-model.md` §2, §3 and §8; handbook §4, §6a and §7. |

## What the scout found (S15)

- **Where they sit.** IP Address is stop 3 and MAC Address 4 ("Addresses & the local network"), TCP/UDP 11 ("Talking across the internet"); no file. Ready means the file exists; a ready Networking lesson with no `FIGURES` entry makes the build throw (`src/lib/figures.ts:32`). Once ready, Up next runs osi-model → ip-address → mac-address → arp and ports → tcp-udp → nat.
- **Documents.** IP Address: RFC 791, 8200, 1918, 5737, 3927, 4632, 950, 1122 and IANA's IP parameters are registered; RFC 6890 (special-purpose registries) and RFC 4291 (IPv6 addressing) are not. MAC Address: RFC 9542, RFC 9724 (randomized MACs), RFC 826 and RFC 894 are registered; **no IEEE document is** (no `kind: 'ieee'` entry); `standards.ieee.org` and `ieeexplore.ieee.org` are allowed for `ieee`; `regauth.standards.ieee.org` is not. TCP/UDP: RFC 9293, 768, 1122, 8085, 5681, 6298 and others are registered; no vendor page compares the two.
- **What they must agree with.** What is IP (private ranges `10/8, 172.16/12, 192.168/16`; IPv6 `2001:db8::80`; "a hardware number built into every network card"; the broadcast to `ff:ff:ff:ff:ff:ff`), DHCP ("The phone … ignores the shout"; "the phone knows the Offer isn't for it"), ARP, NAT's private-address lines, Subnetting's network and broadcast addresses, What is TCP (the handshake, ACKs, the resend of piece 2), What is UDP ("no handshake", "8 bytes", "UDP has no retransmission at all"). No checked lesson names an OUI, a registration authority or a maker's half. Example data in use: 192.168.1.100/.1/.101, 198.51.100.23, 203.0.113.80 and .90, MACs `00:00:5E:00:53:01/10/11` (RFC 9542 §2.1.4).
- **Scenes.** The bits board (`panel: bits`, Subnetting) exists; panels are `table`, `rules`, `bits`, `labels`; no address-kind panel. The `dhcp` figure draws laptop, router with its lease table, and phone on one Wi-Fi, with the ring and the phone's "Hears it, ignores it". `net-map` has `tcp:web` and `udp:call` with the sequence view. **No compare mode** (two lanes) exists.
- **Counts.** About 25 places in eight unit tests and `e2e/site.spec.ts` count 12 ready of 20, 22 lessons and 22 reports, the Up next chain and `NO_SEQUENCE` (S15 §5).
- **Collisions.** `sources.ts` and `sources.test.ts` ends, `figures.ts`, `spots.ts`, `figures.test.ts`, the count tests, and any shared figure or panel file.

## Decisions in this plan

1. **Job 12's path, three side by side.** For each lesson: the analyst's outline (rulings, documents registered in one commit), the designer's scene and card art, the owner's design gate, the spec review, the build, the author on its own branch while the build is reviewed, the continued analyst's read, a fresh full check (a targeted re-check after a near-pass).
2. **One designer unit, D12, with a clickable prototype** (the gate is back, 2.57). `prototypes/d12-batch-2.html` shows the three scenes step by step at 375 and 1440 in both themes, with the three card spots on Networking's route; `prototypes/d12-batch-2.md` is the spec, every spot and new part saved as its own `.svg`, and a patch whose output is those files (job 12's way, which passed its first build review). One variant a scene; a second only where the designer finds a real fork, at most two.
3. **The scenes as job 11 proposed them, reuse first.** IP Address on the subnet figure's home devices with the bits board, plus whatever shows public, private and special (a new panel only where the existing `table` or `labels` panel cannot tell it; the designer says why). MAC Address on the `dhcp` figure with one or two more home devices and each device's keeps/ignores light. **TCP/UDP: TCP, then UDP, in turn on `net-map`** (`tcp:web`, `udp:call`), with a drop in each; the two-lane compare mode is not built in this batch: the go named "in turn", and compare mode is designed once when Proxies needs it (batch 4).
4. **One spec review, one builder for every shared file** (`net-map`, the `dhcp` figure, panels, `spots.ts`, `figures.ts`), on `job13/batch` with a test-only fixture per scene; spots and parts copied from the spec's SVGs and tested tag for tag.
5. **MAC Address's IEEE documents.** The analyst looks first for what the IEEE publishes free on `standards.ieee.org` (the Registration Authority's pages and its guidelines for EUI-48 and OUI) and IEEE 802's free copy on `ieeexplore.ieee.org`. A page on `regauth.standards.ieee.org` is the publisher's own host and may be added; a document readable only after a sign-in comes to the owner, with what a free publisher page could back instead.
6. **Two publishers, and no absolutes, for a Learn part many items trace to** (job 12). The read before the check looks for "every", "only", a single range or one number in the facts most items trace to.
7. **Analysts get private scratch folders** (`.superpowers/analysis/<slug>/scratch/`), and check that `cite()` accepts a citation form before proposing it (it refuses a `url` whose query differs from the document's).
8. **Agreement with checked words.** No checked lesson's words change. A line at odds that changing the new lesson cannot settle stops the work. What is IP's "a hardware number built into every network card" stays; MAC Address may add randomized addresses (RFC 9724) only in words that do not contradict it.
9. **The counts move once.** After the three lessons are merged into `job13/batch`, B14b (B14's builder, continued) moves every count S15 §5 lists to 15 ready, 25 lessons and 25 reports, adds `e2e/{ip-address,mac-address,tcp-udp}.spec.ts` on `e2e/batch1.ts`, and `NO_SEQUENCE` where a scene has one view.
10. **No glossary ties** (2.48). **One known failure** in the full e2e: `e2e/glossary.spec.ts:143`.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S15 | scout | scout (Haiku) | Sizes, documents, agreement, scene parts, count tests, collisions. Done (`prototypes/s15-batch-2-facts.md`). | Every fact has a `path:line`. |
| L22-a, L23-a, L24-a | content | analyst (Opus), one a lesson | The outlines of IP Address (L22), MAC Address (L23), TCP/UDP (L24) in `.superpowers/analysis/<slug>/report.md`: ideas with sources, the Watch story on the scene decision 3 names, agreement lines, what not to claim, the badge, documents to register. | Every passage found by script. |
| L22-r, L23-r, L24-r | content | orchestrator | Rulings in each report; every new document registered on `job13/batch` in one commit. | `npm test` passes. |
| D12 | design | designer (Opus 5.5) | Decision 2: prototype, spec, SVGs, patch. | Each scene's steps traced to the outline; each SVG and the prototype looked at in both themes at 375 and 1440. |
| **Gate** | design | **the owner** | Approves D12 (or sends it back). | The owner's words, recorded. |
| B14 spec | build | reviewer (Opus) | Holes and attack cases for D12; `prototypes/d12-cases.md`. | Holes with one right answer closed as errata. |
| B14 | build | builder (Sonnet) | What the three scenes need on `job13/batch`: parts, cues, panel, spots, `figures.ts`, fixtures. | Each case a test; spots equal to their `.svg`; `npm test`; build in budget. |
| B14 review | build | reviewer (Opus) | The build against the spec, the prototype, its SVGs and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| L22-b, L23-b, L24-b | content | author (Sonnet), one a lesson | `src/content/lessons/<slug>.ts` on `lesson/<slug>`, from the outline. | The sheet prints; `astro check` clean; development tests fail only on the missing report and the counts. |
| L22-p, L23-p, L24-p | content | the lesson's analyst, continued | The read before the check (decision 6). | Numbered rulings, applied. |
| L22-c, L23-c, L24-c | content | a fresh fact-checker (Opus) a lesson | The check; a targeted re-check after a near-pass. | `--check` prints `Report OK`. |
| B14b | build | B14's builder, continued (Sonnet) | Decision 9. | `npm test`; the three lesson specs, `site.spec.ts`, `lesson.spec.ts` at 375 and 1440. |
| F13 | end | orchestrator | `job13/batch` into `revamp`; the full `npm run e2e` (`E2E_PORT=4485`); ledger, direction row, the owner's result. | `npm test`, `npm run build`, full e2e on `revamp`. |

Order: the three outlines together; rulings and the registry commit; D12; **the gate**; B14's spec review; B14; the authors while B14 is reviewed; the reads; the checks; each lesson merged into `job13/batch` as it passes; B14b; F13. Worktrees under `.superpowers/wt/` (`job13`, `ip-address`, `mac-address`, `tcp-udp`), E2E ports 4481 to 4484.

## Estimate

From job 12: a new lesson's content 0.66 to 0.97 million; three scenes on built figures 0.70 million (no prototype). This batch adds a clickable prototype, new parts on the `dhcp` figure, and perhaps a new panel.

| Part | Growth, roughly |
|---|---|
| Three outlines and reads | 0.9 to 1.2 million |
| Three authors | 0.6 to 0.8 million |
| Three checks, and a re-check allowance | 0.5 to 0.8 million |
| D12: three scenes, card arts, prototype | 0.2 to 0.4 million |
| B14: spec review, build, build review | 0.65 to 1.0 million |
| B14b: counts and lesson specs | 0.15 to 0.2 million |
| **After S15** | **3.0 to 4.4 million** |

S15 spent 218,411. With it, 3.2 to 4.6 million, under job 11's proposal of 4.5 to 5.5, because job 12's batch came in at 3.36.

## When the work stops for the owner

- **The design gate**, after D12.
- One lesson's content past 1.6 million tokens of growth without an all-pass; the batch past 6.0 million.
- A claim that fails three checks; a Watch story no allowed source backs.
- A new host that is not the publisher's own; a source readable only after a sign-in (IEEE's standards may be; decision 5).
- A line at odds with a checked lesson that changing the new lesson cannot settle.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports. Everything else the orchestrator decides, records in the direction document, and reports with the job's result.

## What could go wrong

- **Beginner words that outrun the standards.** "A MAC address is burned in and never changes" (RFC 9724), "every device has one IP address", "private addresses are not on the internet" vs NAT's words, "UDP is unreliable so it is worse", "TCP guarantees delivery" (it guarantees ordered delivery or an error). The outlines list what not to claim; the reads catch the rest.
- **IEEE behind a sign-in.** Decision 5; RFC 9542 §2 and the Registration Authority's free pages may carry most of MAC Address.
- **IP Address's "special" kind** needs RFC 6890's registries (IANA's special-purpose address registry on `www.iana.org`); a long list tempts a "these are all of them" absolute.
- **TCP/UDP repeats two checked lessons.** It must say nothing new about either protocol that What is TCP or What is UDP contradicts, and its point is the comparison.
- **Three branches meet** at `sources.ts`, the counts and the spots. One writer for shared files; registry entries committed once before the authors start.

## After this job

- Batches 3 and 4 (Switch, Load Balancers, Packets; Proxies, VPN), each through the design gate unless the owner says otherwise; compare mode is designed with Proxies.
- The glossary when the owner resumes it, with the new lessons' ties.
- Deploying `revamp` (the owner's): `main` is at `3eab7e6`, before job 12.

## Result (2026-11-15)

Done. IP Address, MAC Address and TCP/UDP are cited, checked and merged into `revamp` (`04adb3a`); Networking lists 15 of 20 ready. `npm test` 2,042 passed; build 37 pages in budget; full `npm run e2e` 1,697 passed, only the known `glossary.spec.ts:143` failed (d1440-dark and d1440-light). Cost 4,520,985 tokens of subagent growth with the scout, inside the estimate, near its top: content 2.74 million (IP 0.73, MAC 1.19, TCP/UDP 0.82), the three scenes with the prototype 1.56 million (the designer 0.72 against 0.2 to 0.4). Errata E1 to E12 in `prototypes/d12-cases.md`. Ledger in `team.md`, direction 2.62.
