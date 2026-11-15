# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, and job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62.

# Job 12: Networking Concepts' batch 1, ARP, NAT and Ports

**Status: the owner's go is given** (2026-11-14, direction 2.52): "For this batch skip the mockup and request for my approval to start build. Based on router your proposal and build out was good enough we can skip if possible." The job goes on without another go; the owner sees the three lessons built and checked.

## Result (2026-11-14)

ARP (`/networking/arp`), Ports (`/networking/ports`) and NAT (`/networking/nat`) are live on `revamp` (`7bf4377`), each passed by a fresh fact-checker: ARP all 91 on its first full check; Ports 92 of 94, then a re-check of the 2 Overview lines that dropped "TCP"; NAT 90 of 91 twice (a different item each time, each a citation or a qualifier), then a re-check of 7. Networking Concepts lists 20 stops, 12 ready. The batch used **3.36 million** subagent tokens of growth with the scout (estimate 3.3 to 4.7; stop 5.0): content 2.41 (ARP 0.66, Ports 0.77, NAT 0.97), the three scenes and card arts 0.70 (designer, two reviews, one builder), the scout 0.24. `team.md` (job 12) has the units, the totals and what to do differently. Errata for the owner: D11's E1–E9 (`prototypes/d11-cases.md`) and the rulings in §11 of `prototypes/d11-batch-1.md`; Ports' ruling 5 changed (`cite()` refuses a per-number IANA search address, so port numbers rest on RFC 9110, RFC 4253, Microsoft and Cloudflare).

## Inputs

| | |
|---|---|
| **The job** | Batch 1 of the eleven new Networking lessons proposed at the end of job 11: **ARP** (`arp`, stop 6), **Ports** (`ports`, stop 10), **NAT** (`nat`, stop 12), each on Router's path (handbook §7) with this batch's differences (decision 2). |
| **Done means** | The three lessons are merged into `revamp`, each passed by a fresh fact-checker (`npm run fact-check -- <slug> --check` prints `Report OK`); Networking lists 20 stops, 12 ready; on `revamp`, `npm test`, `npm run build` and the full `npm run e2e` pass with only the known failure `e2e/glossary.spec.ts:143`. The owner gets the three lessons, the cost and the errata. Nothing pushed. |
| **Budget** | The estimate below, 3.3 to 4.6 million subagent tokens of growth; stops at 1.6 million for any one lesson's content and 5.0 million for the batch (the scout included). |
| **References** | `prototypes/s14-batch-1-facts.md` (this job's scout); `prototypes/d10-scene-map.md` (rows ARP, Ports, NAT, and its notes on reusing D10's parts); `prototypes/d10-router.md` and `d10-cases.md` (the last scene spec and its cases); `.superpowers/analysis/router/report.md` (the shape of a new lesson's outline); `src/content/lessons/router.ts` (the shape to write to); `docs/content-model.md` §3 and §8; handbook §4, §6a and §7. |

## What the scout found (S14)

- **Where they sit.** ARP is stop 6 (part "Addresses & the local network"), Ports 10 and NAT 12 ("Talking across the internet"); all planned, no file. A lesson is ready when its file exists. A ready Networking lesson with no card entry makes the build throw (`src/lib/figures.ts:29`).
- **Documents.** ARP: RFC 826, RFC 5227, RFC 1122, RFC 894, RFC 9542 and Microsoft's and Cisco's ARP pages are registered; IEEE 802.3 is not. NAT: RFC 3022, RFC 4787, RFC 1918, RFC 5508 are registered; RFC 2663 and RFC 6146 are not, and no vendor NAT page is. Ports: the IANA registry, RFC 6335, RFC 9293, RFC 768, RFC 1122 are registered; no vendor port page is. Allowed hosts include Cloudflare, Cisco, Microsoft and Palo Alto; no Mozilla host.
- **What they must agree with.** ARP: What is IP's ARP step ("Who has 192.168.1.1?", the router's reply 00:00:5E:00:53:01, the broadcast to ff:ff:ff:ff:ff:ff, "keeps the answer in its ARP cache for a short while"). NAT: What is IP's "NAT and Forwarding" step (the swap to 198.51.100.23, the three private ranges, "port address translation… told apart by port numbers in the NAT table", "can't start a conversation, unless a port is forwarded"), Router's deep-nat line, What is UDP's "remembers that pair for a while". Ports: every checked port line (TCP 80/443/22/25 and ephemeral ports, UDP 53/67/68/123/161/443, DNS, HTTP, HTTPS, TLS, DHCP, Firewalls' 443/22/23, FTP, SMTP, IMAP, POP3, SSH). The example data (192.168.1.100, 192.168.1.1, 198.51.100.23, 203.0.113.80, MACs in the RFC 9542 range) is reused.
- **Scenes.** `net-map` has the ARP broadcast ring at home, the router's inside/outside callout, `· port N` server plates, the `drop` and `hide` cues; the table panel has a by-line, candidates, the no-match row. The `dhcp` figure draws laptop, phone and router on one Wi-Fi. Card art is a spot in `spots.ts`, tested against its prototype by reading the file.
- **Counts.** Eleven unit specs and `e2e/site.spec.ts` count 9 ready lessons, 19 checked reports, the Up next chain and "Lessons 18 to 20 are coming soon" (S14 §5); `e2e/lesson.spec.ts:34` lists one-view scenes.
- **Collisions.** `sources.ts` and `sources.test.ts` ends, `spots.ts`, `figures.ts`, `figures.test.ts`, the count tests, and `net-map` if a lesson adds a part.

## Decisions in this plan

1. **The three run side by side on Router's path.** For each lesson: the analyst's outline (with its rulings and documents registered), the scene and card art, the spec review, the build, the author on its own branch, the continued analyst's read, a fresh full check (a targeted re-check after a near-pass). Three heavy agents at a time.
2. **No clickable prototype, no design gate (the owner, 2.52, this batch only).** The `designer` decides the three scenes and card arts in one unit, D11, and writes one spec, `prototypes/d11-batch-1.md`, with each spot's SVG saved as its own file (`prototypes/d11-<slug>-spot.svg`) and any new figure part's SVG beside it. The designer looks at each SVG in the browser at both themes, and the scenes at 375 and 1440 on the built site where it can. The build starts after the spec review, without the owner.
3. **One designer, one spec review, one builder for all three scenes.** The scenes share `net-map`, the table panel, `spots.ts` and `figures.ts`; one writer for those files avoids three-way collisions. B13 builds every part, cue and spot the three scenes need on `job12/batch`, with a test-only fixture per scene, as B12 did.
4. **Copy, never redraw** (job 11). Each spot and figure part is copied from the spec's SVG and pinned by a test that reads the `.svg` file tag for tag; the build review checks it the same way.
5. **Two publishers for a Learn part many items trace to** (job 11). Each analyst gives the lead, every term and every fact that several items trace to two publishers before the check (an RFC and a vendor's or IANA's page, or two RFCs), registering what is missing on an allowed host.
6. **The authors start while B13 is reviewed** (job 11). Each author writes on `lesson/<slug>`, branched from `job12/batch` once B13 reports its build done; review fixes are merged into the lesson branches.
7. **Agreement with checked words.** Each new lesson agrees with What is IP, Router and every checked port line; no checked lesson's words change. A line at odds that cannot be settled by changing the new lesson stops the work.
8. **The counts move once.** After the three lessons are merged into `job12/batch`, B13b (the B13 builder, continued) moves every count S14 §5 lists to 12 ready, adds `e2e/arp.spec.ts`, `nat.spec.ts`, `ports.spec.ts` on `router.spec.ts`'s model, and the one-view list.
9. **No glossary ties** (2.48); the new lessons' terms join the glossary when it resumes.
10. **One known failure** in the full `npm run e2e`: `e2e/glossary.spec.ts:143`, held by the owner.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S14 | scout | scout (Haiku) | Sizes, documents, agreement, scene parts, count tests, collisions. Done (`prototypes/s14-batch-1-facts.md`). | Every fact has a `path:line`. |
| L19-a, L20-a, L21-a | content | analyst (Opus), one a lesson | The outlines of ARP (L19), Ports (L20), NAT (L21) in `.superpowers/analysis/<slug>/report.md`, sources beside it; the Watch story on built figures, what to agree with, what not to claim, the OSI badge, documents to register; two publishers for shared Learn parts. | Every passage found by script. |
| L19-r, L20-r, L21-r | content | orchestrator | Rulings in each report; every new document registered on `job12/batch` in one commit. | `npm test` passes. |
| D11 | design | designer (Opus 5.5) | The three scenes and card arts: `prototypes/d11-batch-1.md` and `d11-<slug>-spot.svg` (decision 2). | The spec names every part, cue, panel row and step for each scene, with the outline's backing; each SVG looked at in both themes. |
| B13 spec | build | reviewer (Opus) | Holes and attack cases for D11's spec; saved as `prototypes/d11-cases.md`. | Holes with one right answer closed as errata. |
| B13 | build | builder (Sonnet) | What the three scenes need on `job12/batch`: parts, cues, panel abilities, spots, `figures.ts`, fixtures. | Each case a test; spots equal to their `.svg` tag for tag; `npm test`; build in budget. |
| B13 review | build | reviewer (Opus) | The build against the spec, its SVGs and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| L19-b, L20-b, L21-b | content | author (Sonnet), one a lesson | `src/content/lessons/<slug>.ts` on `lesson/<slug>`, written once from the outline. | The sheet prints; `astro check` clean; development tests fail only on the missing report and the counts. |
| L19-p, L20-p, L21-p | content | the lesson's analyst, continued | The read before the check; the author applies it. | Numbered rulings, applied. |
| L19-c, L20-c, L21-c | content | a fresh fact-checker (Opus) a lesson | The check; a targeted re-check after a near-pass. | `--check` prints `Report OK`. |
| B13b | build | B13's builder, continued (Sonnet) | Decision 8, after the three lessons are merged into `job12/batch`. | `npm test`; the three lesson specs, `site.spec.ts`, `lesson.spec.ts` at 375 and 1440. |
| F12 | end | orchestrator | `job12/batch` into `revamp`; the full `npm run e2e`; ledger, direction row, the owner's result. | `npm test`, `npm run build`, full e2e on `revamp`. |

Order: the three outlines together; rulings and the registry commit; D11; B13's spec review; B13; the three authors while B13 is reviewed; the reads; the checks; each lesson merged into `job12/batch` when it passes; B13b; F12. Worktrees under `.superpowers/wt/` (`job12`, `arp`, `nat`, `ports`), E2E ports 4481 to 4484.

## Estimate

From job 11: a new lesson's content 0.84 million; a scene on a built figure, with card art, 0.90 million including its spec review and build review. Three scenes share one designer, one spec review and one builder.

| Part | Growth, roughly |
|---|---|
| Three outlines and reads (L19 to L21 a, p) | 0.9 to 1.2 million |
| Three authors | 0.6 to 0.8 million |
| Three checks, and a re-check allowance | 0.5 to 0.8 million |
| D11: three scenes and card arts | 0.25 to 0.45 million |
| B13: spec review, build, build review | 0.6 to 0.95 million |
| B13b: counts and lesson specs | 0.15 to 0.25 million |
| **After S14** | **3.0 to 4.45 million** |

S14 spent 240,824. With it, 3.3 to 4.7 million, inside the proposal's 3.5 to 4.2 at its middle.

## When the work stops for the owner

- One lesson's content (its a, b, p, c units) past 1.6 million tokens of growth without an all-pass; the batch past 5.0 million.
- A claim that fails three checks; a Watch story no allowed source backs.
- A new host that is not the publisher's own; a source readable only after a sign-in.
- A line at odds with a checked lesson that changing the new lesson cannot settle.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports. Everything else the orchestrator decides, records in the direction document, and reports with the job's result.

## What could go wrong

- **Beginner words that outrun the RFCs.** "ARP asks everyone", "NAT is a firewall", "a port is a physical socket", "each port belongs to one program". The outline lists what not to claim; the reads catch the rest.
- **NAT's two-laptop story** needs a second home device: on `net-map` that is a new part, on the `dhcp` figure a new panel. D11 decides; the spec review sizes it.
- **Ports' story at the server** (a closed port, a refused connection) may need an outcome `net-map` does not show; RFC 9293's reset is the backing.
- **Three branches meet** at `sources.ts`, the counts and the spots. Decision 3 gives the shared files one writer; registry entries are committed once before the authors start.
- **The orchestrator's context grows.** Hand-backs of 150 words or fewer; reports read only where a ruling is needed.

## After this job

- Batches 2 to 4 of the eleven (job 11's proposal, at 84cef62), each through the design gate unless the owner says otherwise.
- The glossary when the owner resumes it, with the new lessons' ties.
- The revamp goes live (the owner's).
