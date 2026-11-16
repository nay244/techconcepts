# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6.

# Job 16: Networking Concepts' batch 4, Proxies and VPN

**Status: planned (2026-11-16, direction 2.74), waiting for the owner's go on this plan.** The owner's go for the job: "Continue with Batch 4" (2.73).

## Inputs

| | |
|---|---|
| **The job** | Batch 4, the track's last two new lessons: **Proxies** (`proxies`, stop 18) and **VPN** (`vpn`, stop 20, the track's last), on job 14's path (handbook §4 and §7) with the design gate. |
| **Done means** | The owner has approved D15; both lessons are merged into `revamp`, each passed by a fresh fact-checker (`npm run fact-check -- <slug> --check` prints `Report OK`); Networking lists 20 of 20 ready, the site 30 lessons and 30 reports; on `revamp`, `npm test`, `npm run build`, CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) and, because the track is finished, the full `npm run e2e` (2.61) pass, with only the known `e2e/glossary.spec.ts:143` failing. The ledger and a direction row are written; the owner gets the two lessons, the cost and the errata. Nothing pushed. |
| **Budget** | 3.2 to 4.2 million subagent tokens of growth with the scout (estimate below); stops at 1.6 million for one lesson's content and **4.2 million for the batch**. |
| **References** | `prototypes/s18-batch-4-facts.md` (this job's scout); `prototypes/d10-scene-map.md` rows 18 and 20 and its notes; `prototypes/d13-*.md` and their cases (the last scene specs, patches and errata); `.superpowers/analysis/load-balancers/report.md` (the last outline, and the one that passed its first check); `src/content/lessons/load-balancers.ts` (the shape to write to); `docs/content-model.md` §2, §3 and §8; handbook §4, §6a and §7. |

## What the scout found (S18)

- **Where they sit.** Proxies is stop 18 (between Firewalls and Load Balancers), VPN stop 20, the last of the track and of the part "Protecting & scaling traffic" (`networking.ts:78, :80`). Once ready, Up next runs firewalls → proxies → load-balancers → vpn, and VPN's end row reads "the last lesson of this track" with "Back to the track": that branch already exists and is tested for What is TLS, the tour's last (`Explanation.tsx:223-234`, `e2e/site.spec.ts:751-753`).
- **Documents.** RFC 9110 (intermediaries §3.7, Via §7.6.3, CONNECT §9.3.6), RFC 9111 (caching), NIST SP 800-77r1 ("Guide to IPsec VPNs"), RFC 2003 (IP in IP), Microsoft's SSTP overview and Azure's network best practices are registered. Not registered: RFC 7239 (Forwarded), RFC 4301, 4303, 7296 and 3948 (IPsec, ESP, IKEv2, NAT traversal), any "what is a proxy", "reverse proxy", CDN or "what is a VPN" page. WireGuard and OpenVPN have no allowed host. 358 entries.
- **Agreement.** No checked lesson or glossary entry says proxy, reverse proxy, CONNECT, X-Forwarded-For, CDN or IPsec in prose. Firewalls says "Admin logins from outside are safer through a VPN." (`firewalls.ts:348`); What is SSH mentions a SOCKS proxy (`what-is-ssh.ts:1046`); the glossary's Encryption and decapsulation entries (`security.ts:249, 259`; `layers.ts:284`) and What is HTTPS's postcard and locked box (`what-is-https.ts:166`). **Load Balancers never says "proxy", by test** (`load-balancers.test.ts:65-68`). Example data: the laptop `192.168.1.100`, `example.net` at `203.0.113.80`, `techconcepts.app` at `198.51.100.7`, the stranger `192.0.2.66`.
- **Scenes.** Seven figure kinds. **net-map has no compare or two-lane mode**: TCP/UDP was built in turn with one table for both lanes. Its slot `NE` is drawn and still free; `park`/`unpark` and `via` exist. The `labels` panel is a row of chips and cannot show one header wrapped in another. No proxy, tunnel, café, eavesdropper or VPN server is drawn anywhere; the only padlock is in the laptop's address bar.
- **Counts.** 18 of 20 ready, 28 lessons, 28 reports, `NO_SEQUENCE` with eleven slugs, the Up next chain, "Lesson 20 is coming soon." on Load Balancers, `track.test.ts:30-32` pinning Proxies as not ready (S18 §5).
- **Budgets.** Lesson JavaScript 108.0 KB of 200 (one shared chunk); the Networking track page 196.6 KB of 250 KB of HTML, so two more card spots fit, and the build's budget check watches it.
- **E2E after job 15.** `playToEnd` now waits for "Play all", `playButton` is `.cbtn--alt`, `nextButton` is `.cbtn--go` ("Next step" or "Next lesson"), `replayButton` is new; nothing exported was removed. `e2e/load-balancers.spec.ts` is the form for a new lesson's spec.

## Decisions in this plan

1. **Job 14's path, two side by side.** For each lesson: the analyst's outline; the orchestrator's rulings and every new document registered on `job16/batch` in one commit before any author starts; the design; the analysts' read of the prototype's words; the owner's gate; the spec review; the build; the author on its own branch once its scene is built; the continued analyst's read; a fresh full check (a targeted re-check after a near-pass).
2. **Each lesson is a Watch story of about five steps.** No playground is built.
3. **No compare mode.** Direction 2.58 left net-map's two-lane compare mode for Proxies; TCP/UDP was built in turn, with one table for both lanes, and passed. Proxies does the same: the same request told **in turn** (straight to the site, then through a proxy), with a table of what the site sees. A two-lane mode would change net-map's one-ride loop under every net-map lesson for one lesson's benefit. This settles 2.58; the owner can overrule it at this plan.
4. **One designer unit, D15, in two parts, side by side** (job 14's way, none compacting): D15a Proxies, D15b VPN, each `prototypes/d15-<slug>.html` (clickable, step by step, 375 and 1440, both themes, its card spot on Networking's route) and `prototypes/d15-<slug>.md` (spec, each spot and new part as its own `.svg`, a patch whose output is those files). D15a's patch applies first; a hunk in a shared list keeps every entry. `prototypes/d15-batch-4.html`, written by the orchestrator, frames both for the gate. One variant a scene; a second only where the designer finds a real fork. **Only what the lessons need is drawn**: each designer is told the scope is the scene and the card art, nothing else on the page (job 15's lesson).
5. **The scenes, reuse first.**
   - **Proxies on `net-map`**: a proxy place on the way (slot `NE` is free), a forward proxy between the laptop and the site, then a reverse proxy in front of the web plate, with a `table` of what each side sees (the address the site sees; who can read what). Whether the proxy reads an HTTPS request or only passes it through (CONNECT) is the analyst's ruling first, not the designer's.
   - **VPN**: a café's Wi-Fi with someone listening, a tunnel to a VPN server, and the request leaving the server as before. The designer first tries net-map (a VPN plate, the stranger's plate as the listener, the tunnel drawn along the existing cables) and draws a new `tunnel` figure only if net-map cannot show it, saying why. The wrapping (one packet inside another) uses the `table` or `labels` panel where they can show it; a nested panel only if neither can, saying why.
   - Card art: two spots, copied from the spec's SVG and tested tag for tag.
6. **The prototype's words go to the analysts before the gate** (job 13, E12); the designer applies their rulings before the owner sees them. **A scene's legend and every label on it is traced like a step's words** (job 14: Switch's "Frame for everyone").
7. **What each lesson must not overclaim**, given to its analyst in the first brief:
   - *Proxies:* a forward proxy acts for the client, a reverse proxy for the server (RFC 9110 §3.7 calls the reverse kind a gateway); "a proxy hides you" (the proxy itself sees whom you talk to, and headers such as Forwarded or X-Forwarded-For can pass your address on); "a proxy encrypts" (it does not; through a proxy, HTTPS usually passes as a CONNECT tunnel the proxy cannot read, unless the organisation inspects TLS); caching only of what a response allows (RFC 9111). Proxies comes before Load Balancers: it may say a reverse proxy can spread requests over servers, but nothing that makes every load balancer a proxy (Load Balancers' Azure balancer passes connections through, and that lesson never says "proxy").
   - *VPN:* it protects traffic between the device and the VPN server only, not beyond it (HTTPS still matters); the VPN provider can see what the café could; "a VPN makes you anonymous" and "a VPN stops all tracking" are not taught; remote access and site to site; IPsec (RFC 4301, 4303, 7296) as the defining documents; TLS-based VPNs only where two publishers state them; WireGuard and OpenVPN only if two allowed publishers name them (their own sites are not allowed hosts, and a new host that is not the publisher's own stops for the owner). VPN must agree with Firewalls' "Admin logins from outside are safer through a VPN." and with What is HTTPS's padlock.
8. **One spec review a part, side by side; one builder a part, one after another** on `job16/batch` (B18a Proxies, then B18b VPN), so a shared file has one writer at a time; one build review a unit. The spec review marks each attack case that only a real browser can try, and that case becomes an end-to-end test (job 15). A builder keeps a progress file in parts. **Only the orchestrator numbers errata.** A build fix that is exactly what the reviewer named goes to a Haiku `builder` (Sonnet if it fails).
9. **The read before the check** keeps job 14's widened checks, and tests each half of a claim and each list item against two publishers, and each label and legend of the scene against the traces. A check fix that adds a citation to a list the checker names is made by the orchestrator with a script, shown in the ledger, not by an agent (job 14). **When a named fix touches a lead, the pattern or a fact most items trace to, a full check follows, not a re-check** (job 14).
10. **Agreement with checked words.** No checked lesson's or glossary entry's words change. A line at odds that changing the new lesson cannot settle stops the work. No glossary ties (2.48).
11. **The counts move once (B19, Haiku builder).** After both lessons are merged into `job16/batch`: 20 of 20 ready, 30 lessons, 30 reports, the Up next chain (firewalls → proxies → load-balancers → vpn, VPN the track's last), `NO_SEQUENCE`, `e2e/proxies.spec.ts` and `e2e/vpn.spec.ts` in the form of `e2e/load-balancers.spec.ts` with the helpers as they stand after job 15. Estimate 0.25 to 0.3 million (job 14's B16).
12. **Branches and ports.** `job16/batch` in `.superpowers/wt/job16` (E2E port 4481); `lesson/proxies` and `lesson/vpn` in `.superpowers/wt/proxies` and `.superpowers/wt/vpn` (4482, 4483); the designers on `design/d15-proxies` and `design/d15-vpn` (4484, 4485). `node_modules` linked into each.
13. **The track's end.** After F16's merge, the full `npm run e2e` runs once in the background on `revamp` (about 30 minutes; 2.61). **Held for the owner, untouched:** Subnetting's bits board at 1440, DHCP's RFC 3927 `#abstract` citation, the net-map lessons' missing no-JavaScript fallback, the paused glossary.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S18 | scout | scout (Haiku) | Positions, documents, agreement, scenes, counts, e2e helpers, budgets, collisions. Done (`prototypes/s18-batch-4-facts.md`). | Every fact has a `path:line`. |
| L28-a, L29-a | content | analyst (Opus), one a lesson | The outlines of Proxies (L28) and VPN (L29) in `.superpowers/analysis/<slug>/report.md`: ideas with sources, the Watch story on decision 5's scene, agreement lines, what not to claim (decision 7), the badge, documents to register. | Every passage found by script. |
| L28-r, L29-r | content | orchestrator | Rulings in each report; every new document and host registered on `job16/batch` in one commit. | `npm test` passes. |
| D15a, D15b | design | designer (Opus 5.5), one a scene | Decisions 4 to 6. | Each scene's steps traced to the outline; each SVG and prototype looked at in both themes at 375 and 1440. |
| L28-w, L29-w | content | the lesson's analyst, continued | The prototype's fact-stating words, legends and labels included. | Rulings applied by the designer. |
| **Gate** | design | **the owner** | Approves D15 (or sends it back). | The owner's words, recorded. |
| B18a spec, B18b spec | build | reviewer (Opus), one a spec | Holes and attack cases, `prototypes/d15-<slug>-cases.md`, browser-only cases marked. | Holes with one answer closed as errata, numbered by the orchestrator. |
| B18a, B18b | build | builder (Sonnet), one after another | Each applies its spec's Appendix A (a, then b), its parts, cues, validator rules, spot, `figures.ts` line and a fixture. | Each case a test; the spot equal to its `.svg`; `npm test`; build in budget; every existing net-map duration unchanged. |
| B18 review | build | reviewer (Opus), one a unit | The build against the spec, the prototype, the SVGs and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| L28-b, L29-b | content | author (Sonnet), one a lesson | `src/content/lessons/<slug>.ts` on `lesson/<slug>`, from the outline and the fixture. | The sheet prints; `astro check` clean; development tests fail only on the missing report and the counts. |
| L28-p, L29-p | content | the lesson's analyst, continued | The read before the check (decision 9). | Numbered rulings, applied. |
| L28-c, L29-c | content | a fresh fact-checker (Opus) a lesson | The check; a targeted re-check after a near-pass, a full one after a fix to a lead or the pattern. | `--check` prints `Report OK`. |
| B19 | build | builder (Haiku) | Decision 11. | `npm test`; the two new specs, `site.spec.ts`, `lesson.spec.ts` at d1440-dark and phone. |
| F16 | end | orchestrator | `job16/batch` into `revamp`; CI's end-to-end pass; the full `npm run e2e`; the ledger, the direction row, the owner's result. | `npm test`, `npm run build`, CI's e2e and the full e2e on `revamp`. |

Order: both outlines; rulings and the registry commit; D15a and D15b together; the prototype words read; **the gate**; both spec reviews; B18a, then B18b, each lesson's author starting once its scene is built; the build reviews; the reads; the checks; each lesson merged into `job16/batch` as it passes; B19; F16. At most three heavy agents at once.

## Estimate

From job 14 (5.93 million for three lessons; content 0.71 to 1.14 million a lesson; a designer 0.19 to 0.29 million; a spec review about 0.21 million; a builder 0.23 to 0.29 million; a build review 0.10 to 0.13 million). Both scenes may reuse net-map, but VPN's tunnel may need a new figure.

| Part | Growth, roughly |
|---|---|
| Two outlines, the prototype words and the reads | 0.65 to 0.75 million |
| Two authors | 0.4 to 0.46 million |
| Two checks, and a re-check or second check allowance | 0.3 to 0.75 million |
| D15: two designers | 0.4 to 0.58 million |
| B18: two spec reviews, two builds, two build reviews | 0.85 to 1.05 million |
| B19: counts and lesson specs (Haiku) | 0.25 to 0.3 million |
| **After S18** | **2.9 to 3.9 million** |

S18 spent 266,140. With it, **3.2 to 4.2 million**. **The batch stop is 4.2 million**: job 14's 6.0 million for three lessons is 4.0 million for two, plus the parts that do not shrink with one lesson fewer (the scout and the counts, about 0.2 million more than their share).

## When the work stops for the owner

- **This plan**, now.
- **The design gate**, after D15 and the prototype words' read.
- One lesson's content past 1.6 million tokens of growth without an all-pass; the batch past 4.2 million.
- A claim that fails three checks; a Watch story no allowed source backs.
- A new host that is not the publisher's own; a source readable only after a sign-in.
- A line at odds with a checked lesson or glossary entry that changing the new lesson cannot settle.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **Beginner words that outrun the sources.** "A proxy hides who you are", "a VPN makes you anonymous", "a VPN encrypts everything" (only to the VPN server), "a proxy reads your HTTPS" (not without inspection), "reverse proxy and load balancer are the same" (Load Balancers says neither). The outlines list what not to claim; the reads catch the rest.
- **VPN protocols without an allowed host.** WireGuard and OpenVPN publish on their own sites; IPsec rests on RFCs and NIST. A VPN lesson that needs a named product goes to two allowed publishers or leaves the name out.
- **Wrapping on a row of chips.** The `labels` panel cannot nest; the table may say it in words instead. A new panel is drawn only if neither can.
- **net-map grows again.** Every existing net-map lesson's timing stays byte for byte (job 14's build checked 416 durations; the spec review names it again).
- **Two branches meet** at `sources.ts`, `net-map`'s parts and layers, the spots and the counts. One writer for shared files; registry entries committed once before the authors start.
- **The track page's HTML** (196.6 KB of 250) gains two card spots; the budget check catches a breach.
- **The full end-to-end run** takes about 30 minutes and must not share the main folder with another run.

## After this job

- The track's one report of changed sentences is not needed for new lessons (there were no words to keep); the owner gets the two lessons and the result.
- The glossary when the owner resumes it, with the new lessons' ties; CompTIA A+ (direction §3).
- Deploying `revamp` (the owner's).
