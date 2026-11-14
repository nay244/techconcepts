# S13 scout: facts for finishing Networking Concepts

Repo on branch `revamp`, read only except this file. Paths are repo-relative. Written in parts: A first, then B to H appended.

Current state, verified: `src/content/legacy.ts` no longer exists and `LEGACY_LESSONS` is referenced nowhere in `src/`, `e2e/` or `scripts/`. So the four ready networking lessons (`osi-model`, `dhcp`, `subnetting`, `firewalls`) are all in the cited shape (`defineLesson`), each with a fact-check report in `docs/fact-checks/`. The older `prototypes/s9-batch-5-facts.md` describes them as legacy; that is out of date.

## A. The track today

Track order and parts: `src/content/tracks/networking.ts:31-79` (19 slugs, 6 parts; part list at lines 31-79 in the `parts:` array).

Ready (lesson file present, in `src/content/lessons/`): `osi-model` (position 1), `subnetting` (7), `dhcp` (9), `firewalls` (16). The lesson files are `src/content/lessons/osi-model.ts`, `subnetting.ts`, `dhcp.ts`, `firewalls.ts`.

Not ready (no file): packets 2, ip-address 3, mac-address 4, switch 5, arp 6, router 8, ports 10, tcp-udp 11, nat 12, dns 13, http-https 14, tls 15, proxies 17, load-balancers 18, vpn 19. Each is "none" in `src/content/lessons/`.

How the code decides ready vs not:
- `src/content/registry.ts` `buildEntries` (lines 59-101): one entry per planned slug in track order, numbered from 1 across parts. `const lesson = Object.hasOwn(lessons, planned.slug) ? lessons[planned.slug] : undefined;` then `lesson === undefined ? { available: false, ...base } : { available: true, ... url: \`/${track.id}/${planned.slug}\`, canonical: ... }` (the ternary is at lines 87-89).
- `lessons` is `lessonsBySlug` built by `lessonsFromModules` (`registry.ts:140`) from `import.meta.glob('./lessons/*.ts')` (`registry.ts:221-225`). "Ready" is therefore purely "a file exists in `src/content/lessons/` with a default export of `defineLesson`". A file without a passing report fails the build (`checkFactCheckReports`, `registry.ts`, refused in production and tests, warned in `astro dev`).
- `src/content/registry.ts` `neighbors()` (lines 113-125): prev/next skip unavailable entries; `nextPlanned` is true when the entry right after is unavailable. `nextPlanned` is consumed only by `src/content/registry.test.ts` and `registry.ts` (grep of `src` and `e2e`); no page reads it.

Per-surface treatment of a planned slug:
- Lesson URL `/networking/<slug>/`: `src/pages/[track]/[lesson].astro:15-19` `getStaticPaths` emits pages only for `entries.filter((entry) => entry.available)`. A planned slug gets no page, so the request falls through to `src/pages/404.astro` ("Error 404" / "That page isn't here", `404.astro` body). It is a 404, not a placeholder. `astro.config.mjs` has no redirect for planned slugs (only `/networking/how-the-internet-works`, `astro.config.mjs:10`).
- Track page `/networking/`: `src/pages/[track]/index.astro` builds the route from `trackParts()` (`src/lib/track.ts`, `SoonLesson` at `track.ts:24`, `if (!entry.available) return { ready: false, key: entry.key, n: two(entry.number), title: entry.title }` at `track.ts:78`). `src/components/hub/TrackRoute.tsx:60-71` renders `SoonStop` (defined at `TrackRoute.tsx:81-83`) for those: a `stop stop--soon` tile labelled `STATUS_WORDS['not-ready']` = "Not ready yet" (`src/lib/hub.ts:13`). No link. Each planned lesson is listed by number and title.
- Track page footer line: `src/pages/[track]/index.astro:44` (`someNotReady`) and `:89-90` (`route__end`): "Lessons not ready yet stay on the route, so you can see what is coming." when `someNotReady`.
- Track page strip caption: `src/lib/hub.ts` `stripWords` (lines 78-84): "`${done} of ${total} lessons done · ${readyCount} ready`" when some are not ready (so networking reads "N of 19 lessons done · 4 ready" today). Squares: `stripStates` (`hub.ts:69-75`): a planned entry is `''` (blank).
- Tracks page `/tracks`: `src/pages/tracks.astro` uses `trackCards()` (`src/lib/tracks-page.ts`). Networking is a ready card (`ready: true`, href `/networking`), its panel from `TrackPanelProgress`. The Tracks page does not list individual planned lessons; that is `TrackRoute` only. `src/lib/tracks-page.ts:10` `TRACK_COVERS` maps `networking` to cover `networking`.
- Home "So far N of M": Home shows the fact-check sentence from `factCheckSentence(checks.checked, checks.total)` (`src/pages/index.astro:23-24`, `src/lib/about.ts:25-31`). `checks` is `lessonCheckCounts()` (`src/lib/checked.ts:11-15`): `total` counts distinct AVAILABLE slugs across all tracks, `checked` counts those with `checkedOn(slug) !== null`. So a planned lesson is not in M, and a ready one counts toward N only once its report is dated.
- Home track stop: `src/lib/home.ts` `homeStops()` (lines 222-238; the `count` string at line 234): `count: available === planned ? \`${planned} lessons\` : \`${available} of ${planned} lessons ready\``, with `available` and `planned` from `trackTotals(getEntries(track.id))` (`registry.ts` `trackTotals`: `planned` = all entries, `available` = ready entries). Networking therefore reads "4 of 19 lessons ready" on Home (`src/lib/home.ts:210` doc comment gives this exact example).
- Home's track leg count: `src/pages/index.astro:282-288` draws one `<i>` per planned lesson with `data-ready` for ready ones (`stop.lessons.planned`, `stop.lessons.ready`).
- About: `src/pages/about.astro:30-31`: `tracksPlanned = tracks.length + plannedTracks.length + comingSoonTracks.length` (2 + 1 + 4 = 7 today), `lessonsReady = trackTotals(tracks.flatMap((t) => getEntries(t.id))).available` (a plain sum across tracks, not de-duplicated). Rendered at `about.astro:62-63` as "tracks planned" and "lessons ready". About's fact-check sentence: same `factCheckSentence` (`about.astro:38-40`).
- Sitemap: none. `astro.config.mjs` has no sitemap integration (its only integration is `react()`, `astro.config.mjs:8`). `public/` holds `_headers`, `favicon.svg`, `og-default.png` only; no `sitemap*.xml` or `robots.txt`. The only other site-wide file is the canonical link on each lesson, `canonical: /${homeOf(slug)}/${slug}` (`registry.ts` `buildEntries`), which exists only for ready lessons.
- Next/previous lesson links, in the lesson page: `src/pages/[track]/[lesson].astro` passes `next: neighbors(entries, entry.slug).next` (skips planned); `src/lesson/Explanation.tsx:157-170` (`comingSoon(number, total)`) prints after the last ready lesson of a run: "That's the whole lesson, and the last ready one for now. Lessons 17 to 19 are coming soon." (`Explanation.tsx:223-233`); the last lesson of the track (`number === total`) prints "That's the whole lesson, and the last lesson of this track." Today the ready chain is: osi-model (1) → subnetting (7) → dhcp (9) → firewalls (16). So osi-model's next is subnetting, subnetting's prev is osi-model, dhcp's prev is subnetting, firewalls's prev is dhcp, firewalls' end row says "Lessons 17 to 19 are coming soon." (number 16, total 19).
- Lesson counts shown on a lesson page: `total={entries.length}` (`[lesson].astro`) = 19 for networking.
- Cross-track line: `src/pages/[track]/index.astro` `CROSS_LINKS` (lines ~17-24) is unaffected by planned slugs.

Not found in A: any sitemap, any "coming soon" lesson page, any redirect for planned slugs.

Current counts that follow from A (checked against the code, not a live build): planned 19, ready 4 (`osi-model` 1, `subnetting` 7, `dhcp` 9, `firewalls` 16). Home's track stop reads "4 of 19 lessons ready" (`src/lib/home.ts:234`); the strip reads "0 of 19 lessons done · 4 ready" (`src/lib/hub.ts:78-84`). Home's fact-check sentence: with all 18 ready lessons dated (14 tour, 4 networking), `lessonCheckCounts()` gives checked = total = 18 (`src/lib/checked.ts:11-15`), so `factCheckSentence` returns its "Every lesson has also been through an independent check…" branch (`src/lib/about.ts:26-27`). About: "lessons ready" = 18 (`src/pages/about.astro:31`, a sum over both tracks, not de-duplicated), "tracks planned" = 7 (`about.astro:30`).

`dist/` (git-ignored, from the last build present in the checkout) holds `dist/networking/{dhcp,firewalls,osi-model,subnetting}/index.html` and `dist/networking/how-the-internet-works/` (the redirect), with no `packets` folder, plus `dist/404.html`. It has no sitemap file.

## B. What exists for the 15 unwritten lessons

Searched: `docs/` (all of it, including `docs/superpowers/specs` and `plans`), `.superpowers/` (`original/`, `revamp/`, `track-report/`, `analysis/`, `briefs/`, `wt/`), `git log --all` for exact paths, and comments in `src/`, `e2e/`.

Result: no lesson file, outline, fact-check report, change list or claim sheet exists for any of the 15 (`git log --all --name-only` shows no `src/content/lessons/<slug>.ts`, `docs/fact-checks/<slug>.md` or `docs/lesson-changes/<slug>.md` for them). The only written material is the launch catalogue and a few pointers.

Launch catalogue, one row each (`docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md`):
- packets, line 153: "| 2 | The big picture | Packets | Flow (layers + network) | A file split into packets that travel and are put back in order | Change the file size and watch the packet count change |"
- ip-address, line 154: "| 3 | … | IP Address | Playground | An address in decimal and binary; public vs private vs special | Type any IPv4 address and see its binary form, type and validity |"
- mac-address, line 155: "| 4 | … | MAC Address | Flow | A frame on a shared home Wi-Fi network: every device hears it, and only the one whose MAC matches keeps it; …"
- switch, line 156: "| 5 | … | Switch | Device table (MAC table) | The switch flooding at first, then learning which device is on which port |"
- arp, line 157: "| 6 | … | ARP | Device table (ARP cache) | \"Who has 192.168.1.1?\" sent to all; one reply; the cache fills |"
- router, line 159: "| 8 | … | Router | Device table (routing table) | A packet hop by hop; the routing table choosing each next hop; the default gateway |"
- ports, line 161: "| 10 | … | Ports | Device table (listening ports) | Connections arriving at a server's ports and reaching the right service; common ports |"
- tcp-udp, line 162: "| 11 | … | TCP/UDP | Flow (compare) | TCP's handshake, acknowledgements and resends vs UDP's fire-and-forget |"
- nat, line 163: "| 12 | … | NAT | Device table (NAT table) | The router rewriting private address:port pairs into its one public address |"
- dns, line 164: "| 13 | … | DNS | Flow | A name resolved via the resolver, root, .com and authoritative servers; then caching |"
- http-https, line 165: "| 14 | The web | HTTP/HTTPS | Flow | A request and response, with method, path, headers and status decoded |"
- tls, line 166: "| 15 | The web | TLS | Flow | The handshake, the certificate check and key agreement, then unreadable data |"
- proxies, line 168: "| 17 | … | Proxies | Flow (compare) | What the server sees with and without a proxy; forward vs reverse proxy |"
- load-balancers, line 169: "| 18 | … | Load Balancers | Device table (pool) | Requests spread across servers; health checks |"
- vpn, line 170: "| 19 | … | VPN | Flow (layers + network) | A packet wrapped in a tunnel on café Wi-Fi |"

Other written material:
- Scene kinds, launch spec `:87-96`: line 90 "Used by OSI Model, Packets and VPN (a packet wrapped inside another)." line 91 "Used by TCP vs UDP and by \"with vs without a proxy\"." line 94 "Tables needed at launch: switch MAC table, ARP cache, routing table, DHCP lease table, NAT translation table, listening-ports table, firewall rule list (top-down matching), load-balancer pool". Line 96: Playground "Used by IP Address … and Subnetting".
- Launch spec `:275`: "Engine unit tests: … NAT/ARP/switch table logic, and all subnet/binary math."
- `docs/superpowers/specs/2026-11-08-osi-model-lesson-design.md:17`: "Later lessons cover those (Packets, IP Address, TCP/UDP)."
- `docs/superpowers/specs/2026-11-08-how-the-internet-works-track-design.md:60`: "Part 1, 'The big picture', keeps OSI Model and Packets, both coming soon."
- `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md:148`: a lesson may mention a later concept "with a pointer ('more on this in lesson 13, DNS')" (a rule, not a draft).
- `src/content/sources.ts:200`: "The OSI Model lesson brought these entries; later lessons add theirs."
- `src/content/tracks/networking.ts:4`: "Titles and order follow the launch catalog (launch spec §8): 19 lessons."
- `src/art/figures/spots.ts:105`, `:125`, `:141`: "// ---------- Lesson 08, Subnetting …", "Lesson 10, DHCP …", "Lesson 17, Firewalls …" (old numbers; the track has Subnetting 7, DHCP 9, Firewalls 16). `spots.ts:169` "Lesson 01, OSI Model" is correct.
- `src/art/scenes/net-map.ts:197`: "// The routers themselves, by their names in N: a message can stop on top of one (traceroute, NAT)."
- `docs/research/2026-11-03-reference-research.md:206`: a reference site's list, "Network Fundamentals | What is Networking? · Intro to LAN · OSI Model · Packets & Frames · Extending Your Network" (not this site's plan).
- `.superpowers/revamp/l2a-analyst-report.md:300`: a source row "| microsoft-azure-lb-options | vendor | Microsoft | Load Balancing Options (Azure Architecture Center) | https://lea…" (a candidate source for load balancers, from a what-is-http analysis; not registered).
- `.superpowers/track-report/firewalls.md:24` (old text, before job 8): "…admin logins are often allowed from a VPN’s addresses instead (lesson 19)." The ready `firewalls.ts:348` now reads "Admin logins from outside are safer through a VPN." with no lesson pointer (team.md job 8, L15-b: "both pointers cut").
- Not drafts: `src/content/helpers/packets.ts` existed (added `3ccb85b`, `cd24bc4`) and was removed with DHCP's packet frames in `ef77bbe` (job 8). `src/content/lessons/networking/how-the-internet-works/{dns,tls}.ts` and `src/content/lessons/how-the-internet-works/{dns,tls}.ts` are the tour's pre-split files (`git log --all -- src/content/lessons/how-the-internet-works/dns.ts`), now `what-is-dns.ts` and `what-is-tls.ts`.
- Glossary material (not lessons): `.superpowers/analysis/glossary-packets/report.md` and `docs/fact-checks/glossary/packets.md` cover the `packets` glossary group (`src/content/glossary-groups/packets.ts`).

## C. Overlap with checked lessons

Checked tour lessons (all in `docs/fact-checks/`, 14 full reports; `src/content/tracks/how-the-internet-works.ts`). Where each of the 15 subjects appears:

| Networking lesson | Checked tour lesson(s) on the subject | Evidence |
|---|---|---|
| packets | what-is-ip (step "One packet, passed from router to router") ; what-is-tcp (segments), what-is-udp (datagrams) | `what-is-ip.ts:145`; `what-is-tcp.ts:811` (`term-segment`); `what-is-udp.ts:503` (`term-datagram`) |
| ip-address | what-is-ip, what-is-dhcp, what-is-http | `what-is-ip.ts:587` "A prefix such as 192.168.1.0/24 names a whole network; the Subnetting lesson goes further."; `what-is-dhcp.ts` (lease of an address), `what-is-http.ts:169` "To send anything, the browser needs the server’s number, its **IP address**." |
| mac-address | what-is-ip (step "ARP Resolution") ; what-is-dhcp | `what-is-ip.ts:213` "…They use each other’s **MAC address**, a hardware number built into every network card."; `what-is-ip.ts:511` (`term-mac`); `what-is-dhcp.ts:317` "…carries the laptop’s MAC address so the server can tell clients apart." |
| switch | none | no `switch` or `Switch` in `src/content/lessons/what-is-*.ts` (grep) |
| arp | what-is-ip (step "ARP Resolution"), what-is-icmp, what-is-dhcp | `what-is-ip.ts:210` (step title), `:516` (`term-arp`); `what-is-icmp.ts:609` "…the machine with ARP and had no answer."; `what-is-dhcp.ts:531` "…an ARP probe for their new address…" |
| router | what-is-ip (steps "Routing Decision", "Return Routing") | `what-is-ip.ts:180`, `:415`; `what-is-ip.ts:499` (`term-routing`) |
| ports | what-is-tcp, what-is-udp, what-is-https, what-is-ftp | `what-is-tcp.ts:164` "a page from example.net, port 80"; `what-is-udp.ts:509` (`term-port`); `what-is-https.ts:678` (`term-port`); `what-is-ftp.ts:716` (`term-port`, "Port 21") |
| tcp-udp | what-is-tcp and what-is-udp (the two halves of the comparison) | `what-is-tcp.ts:172` "Three-Way Handshake", `:379` "Packet Loss", `:584` "Retransmission"; `what-is-udp.ts:123` "Your voice goes out in small packets, no promises", `:154` "Connectionless Send", `:274` "Packet Loss, No Retransmission" |
| nat | what-is-ip | `what-is-ip.ts:338` step "NAT and Forwarding"; `what-is-ip.ts:525` (`term-nat`) |
| dns | what-is-dns (whole lesson); what-is-http (step "DNS Resolution") | `what-is-dns.ts:121` "The resolver asks its way down the name"; steps at `:187`, `:257`, `:354`, `:437`, `:529`; `what-is-http.ts:166` |
| http-https | what-is-http and what-is-https (both whole lessons) | `what-is-http.ts:103` "Your browser asks a web server for a page"; `what-is-https.ts:148` "The same asking and answering, sealed on the way" |
| tls | what-is-tls (whole lesson, title "TLS/SSL"); what-is-https (step "TLS Handshake") | `what-is-tls.ts:143` "The handshake that seals a line, step by step"; `what-is-https.ts:380` |
| proxies | none; what-is-ssh mentions a proxy in passing | `what-is-ssh.ts:1046` "…or as a SOCKS proxy (ssh -D)…" |
| load-balancers | none as a topic; what-is-tcp and what-is-udp cite Microsoft's Azure Load Balancer for layer 4 | `what-is-udp.ts:54` `AZURE_L4`, used at `:118` and `:613`; `what-is-tcp.ts:35` `MS_LB` |
| vpn | none as a topic; what-is-tls mentions VPNs | `what-is-tls.ts:601` "HTTPS, secure email, VPNs and many other apps borrow it instead of inventing their own." `what-is-tls.ts:63` (a URL text fragment, "…an%20SSTP-based%20VPN%20connection", not prose) |

Ready lessons that touch the 15 subjects: `firewalls.ts:340` "(the Subnetting lesson covers the slash)" and `firewalls.ts:348` "Admin logins from outside are safer through a VPN." (no lesson pointer).

DHCP and `what-is-dhcp` (job 8's agreement, as the repo records it):
- `docs/lesson-changes/networking-dhcp-subnetting-firewalls.md:3` says the three lessons "moved to the cited shape" and that "every lesson on the site is cited and checked". It does not state a required agreement with the tour lesson.
- `team.md:403` (analyst L7-a) says the tour DHCP report "lists what Networking's DHCP lesson will have to agree with (its section 6)". That section is not in the repo (`.superpowers/revamp/` has no such report).
- `team.md:625` (scout S9) lists "DHCP's four differences from What is DHCP" in `prototypes/s9-batch-5-facts.md:216-240` (written before job 8).
- Current wording, as of this read: `dhcp.ts:502` "it asks any server at 87.5% of the lease, called T2" vs `what-is-dhcp.ts:617` "the client broadcasts to any server at T2, seven-eighths of the lease" (values agree, verbs differ). `dhcp.ts:519` "the device may give itself a 169.254.x.x address, which only reaches its neighbours" (cites RFC 3927) vs `what-is-dhcp.ts:276` "it gives itself a link-local address in 169.254.0.0/16" (cites RFC 3927 and Microsoft). Offer: `dhcp.ts:544` "sent straight to the laptop at the offered address, or broadcast" vs `what-is-dhcp.ts:388` "Servers may broadcast the Offer or send it straight to the client’s MAC." Relay: only the tour (`what-is-dhcp.ts:321`, `:801-802`).
- Pointers: `what-is-dhcp.ts:10` (comment) "…and the Networking lesson how it works." `what-is-dhcp.ts:184` and `:224` "Networking Concepts has a DHCP lesson that goes further." `dhcp.ts` has no pointer back (grep "Internet Works", "what-is": 0 hits).
- Shared unit id: `how-the-internet-works.test.ts:146-155` asserts both DHCP lessons use unit id `dhcp`, "deliberate".

Glossary entries for each main term (names, group file; `src/content/glossary-groups/`; index in scratch file, entry ids verified):
- packets: `packet`, `frame`, `protocol-data-unit`, `segment`, `datagram`, `router`, `ip-header` (`packets.ts`).
- ip-address: `ip-address` (`pilot.ts`, ties `dhcp`, `what-is-dhcp`, `what-is-http`, `what-is-ip`).
- mac-address: `mac-address` (`leases.ts`, tie `what-is-ip`).
- switch: none.
- arp: `arp` (`leases.ts`, tie `what-is-ip`).
- router: `router` (`packets.ts`, untied); `routing-decision`, `forwarding` (`packets.ts`, tied to `what-is-ip`).
- ports: `port` (`filtering.ts`, ties `firewalls` and `what-is-udp`).
- tcp-udp: `tcp`, `udp` (`transport.ts`, untied); `three-way-handshake`, `sequence-number`, `retransmission`, `connectionless` (tied to tour lessons).
- nat: `nat` (`filtering.ts`, tie `what-is-ip`).
- dns: `dns`, `name-server` (`naming.ts`, untied); `dns-resolver`, `root-server`, `top-level-domain`, `referral`, `authoritative-server`, `a-record`, `dns-cache` (`naming.ts`, tied to `what-is-dns`).
- http-https: `http`, `https` (`web.ts`; `https` tied to `what-is-https`).
- tls: `tls` (`security.ts`, untied); `tls-handshake`, `certificate`, `certificate-authority` (tied to `what-is-https`/`what-is-tls`).
- proxies: none.
- load-balancers: none.
- vpn: none.

## D. Sources

Registered in `src/content/sources.ts` (296 `id:` lines; a regex parse read 292 of them, and the counts below are from that parse: 153 rfc, 112 vendor, 12 iana, 6 nist, 3 itu, 3 standards-body, 2 community, 1 internet-registry). No entry has `kind: 'ieee'` (grep), though `sources.ts:16` allows the kind. Searched with exact ids.

- packets: `rfc-791` (Internet Protocol), `rfc-768` (UDP), `rfc-1122` (Requirements for Internet Hosts), `itu-x200` (basic reference model; defines PDU), `rfc-894` (IP over Ethernet), `rfc-9293` (TCP).
- ip-address: `rfc-791`, `rfc-1918` (Address Allocation for Private Internets), `rfc-5737` (documentation blocks), `rfc-4632` (CIDR), `rfc-8200` (IPv6), `rfc-1122`.
- mac-address: `rfc-826` (48-bit Ethernet address), `rfc-894`, `rfc-9542` (IANA considerations for IEEE 802 parameters), `rfc-9724` (randomized MAC addresses). Not registered: IEEE 802 / IEEE 802.3 (Ethernet) itself.
- switch: vendor only: `cisco-dai` ("Configuring Dynamic ARP Inspection", on Catalyst 9300 switches), `cisco-ssh-configure`. Not registered: IEEE 802.1D / 802.1Q (MAC bridging), the defining standard.
- arp: `rfc-826` (defining), `rfc-5227` (IPv4 address conflict detection), `rfc-3927` (link-local), `microsoft-arp`, `cisco-dai`.
- router: `rfc-1812` (Requirements for IPv4 Routers), `rfc-791`, `rfc-1122`; vendor `cisco-route-command`, `microsoft-route`, `cisco-router-upgrade`.
- ports: `iana-ports` (Port Numbers registry), `rfc-6335` (port registry procedures), `rfc-9293`, `rfc-768`.
- tcp-udp: `rfc-9293` (TCP), `rfc-768` (UDP), `rfc-8085` (UDP usage guidelines), `rfc-9868` (UDP transport options), `rfc-5681` (TCP congestion control), `rfc-2018` (SACK).
- nat: `rfc-3022` (Traditional NAT), `rfc-4787` (NAT behaviour for UDP), `rfc-1918`, `rfc-8445` (ICE, NAT traversal). Not registered: RFC 2663 (NAT terminology).
- dns: `rfc-1034`, `rfc-1035` (defining), `rfc-9499` (DNS terminology), `rfc-7766` (DNS over TCP), `rfc-8484` (DoH), `rfc-7858` (DoT), `rfc-8767`, `iana-root-servers`, `icann-rssac-faq`.
- http-https: `rfc-9110` (HTTP semantics), `rfc-9111`, `rfc-9112`, `rfc-9113`, `rfc-9114`, `rfc-3986` (URI), `rfc-6797` (HSTS), `rfc-6265` (cookies). Not registered: RFC 2818 (HTTP over TLS, the https:// definition).
- tls: `rfc-9846` (TLS 1.3), `rfc-5280` (X.509 certificates), `rfc-6066` (SNI and extensions), `rfc-9525` (service identity), `rfc-9325` (TLS recommendations), `nist-sp800-52r2`. Not registered: RFC 5246 (TLS 1.2), RFC 8446 (the earlier TLS 1.3 RFC).
- proxies: `rfc-9110` (HTTP, which defines intermediaries), `rfc-5625` (DNS proxy guidelines); vendor `cloudflare-lb-proxy-modes` ("Proxy status"). No proxy-specific standard is registered beyond these.
- load-balancers: no IETF document. Vendor: `microsoft-azure-lb` ("What is Azure Load Balancer?"), `microsoft-app-gateway`, `microsoft-traffic-manager`, `cloudflare-lb-proxy-modes`. Not registered: `microsoft-azure-lb-options` (only in `.superpowers/revamp/l2a-analyst-report.md:300`).
- vpn: `nist-sp800-77r1` ("Guide to IPsec VPNs"). Not registered: RFC 4301 (the IPsec architecture).

Already registered since s9 (`prototypes/s9-batch-5-facts.md` said they were not): `rfc-950`, `rfc-3021`, `rfc-5737`, `rfc-2644`, `rfc-919`, `nist-sp800-41r1` (job 8, `docs/direction.md:64`).

## E. The shape of a Networking Concepts lesson

Top-level fields (lesson object, `src/content/lessons/*.ts`, all `defineLesson`):

| Field | osi-model | dhcp | subnetting | firewalls |
|---|---|---|---|---|
| file lines (test lines) | 673 (429) | 652 (101) | 1275 (406) | 686 (377) |
| level / certTags | beginner; `a-plus`, `network-plus`, `ccna` (`:112-113`) | beginner; `a-plus`, `network-plus`, `ccna`, `helpdesk` (`:169-170`) | beginner; `network-plus`, `ccna` (`:187-188`) | beginner; `network-plus`, `security-plus`, `ccna`, `soc-analyst` (`:154-155`) |
| figure | `'osi'` (`:115`) | `'dhcp'` (`:173`) | `'subnet'` (`:191`) | `'firewall'` (`:157`) |
| units | 1 | 1 | 1 | 1 |
| steps (Watch) | 10 (`:179`-`:614`; titles at `:182`-`:462`) | 5 | 6 | 6 |
| scene views | `['network']` (`:135`) | `['network','sequence']` (`:185`) | `['network']` (`:203`) | `['network','sequence']` (`:169`) |
| scene panel | `{type:'labels'}` (`:136`) | table (`:186`) | `{type:'bits'}` (`:204`) | rules + conns (`:170`) |
| overrides | `steps` max 10, reason at `:116-121` | none | none | none |
| backing | `backing: { traces: [...] }` (`:123`) | `backing: { traces: [...] }` (`:174`) | `traces(...)` (`:192`) | `backing: {...}` (`:158`) |

Claim-sheet items (from `docs/fact-checks/<slug>.md`):
- osi-model: 127 verdicts, all ✅ (`checked` 2026-11-08, `checker` claude-opus-5-5). The report has no `items` block.
- dhcp: 92 items, 92 ✅ (2026-11-12). 47 `###` claim headings.
- subnetting: 107 items, 107 ✅ (2026-11-12). 45 headings.
- firewalls: 106 items; 105 ✅ on the full check, one ⚠️ (`units[0].steps[0].deep[3]`, "rule-evaluation", Go deeper), then the targeted re-check `docs/fact-checks/firewalls.recheck.md` passes it (1 of 1). 53 headings in the full report.
- Sources (the `sources` block of each report, the ids listed): osi-model 6, dhcp 16, subnetting 17, firewalls 30 (`docs/lesson-changes/networking-dhcp-subnetting-firewalls.md:11-13` table, "16 (2)", "17 (2)", "30 (1)" with the "was" counts).
- Distinct source ids cited in the lesson file: osi-model 6, subnetting 8, firewalls 11 (grep of `cite('…')` and `d('…')`; dhcp uses wrappers, so its count is from the report).

Figure and scene kinds available (code):
- Figure ids: `figureIdSchema` `src/content/schema.ts:37`: `dhcp`, `subnet`, `firewall`, `net-map`, `osi`. `FigureId` in `src/art/scenes/types.ts:2`. Parts per figure: `src/art/scenes/parts.ts:10-…`.
- Drawers: `src/art/scenes/index.ts:18` (`drawFigure`), files `dhcp.ts`, `subnet.ts`, `firewall.ts`, `net-map.ts`, `osi.ts`. Drivers: `src/scenes/drivers/{dhcp,subnet,firewall,net-map,osi}.ts`. Sequence view: `src/scenes/SequenceView.tsx`.
- Places (nodes) per figure (`parts.ts`): dhcp `laptop, router, phone`; subnet `laptop, printer, pc, router, provider`; firewall `visitor, admin, firewall, web`; osi `laptop, router, server`; net-map `laptop, router, resolver, isp, a, b, c, d` plus each plate's sites (`net-map-layers.ts:50`).
- Net-map plates (node kinds): `ServerPlate` `kind: 'web' | 'host' | 'mail' | 'names'` (`src/art/scenes/net-map-layers.ts:28-38`). Net-map layers (14 keys, all tour protocols): `http:web` … `tls:web` (`net-map-layers.ts:84-112`). None for the 15.
- Cues per figure (`parts.ts`): net-map `status, conn, page, lock, tray, status-known, status-done, addr, url`; subnet `glow, focus, one-net, cut, link, pulse, ring, route, busy`; firewall `rules`; osi `layer, peer`; dhcp none.
- Links: the schema has no link type. Routes: OSI `laptop>router`, `router>server` (`src/art/scenes/osi-stacks.ts:9`); net-map routes are computed (`net-map.ts`). The launch spec's "wired, wireless, or tunnel" (`launch spec:80`) is not in code.
- Packet kinds: `packetSchema` (`schema.ts:99`) has layers and fields; message kinds `request, response, control, broadcast, encrypted` (`schema.ts:34`); message outcomes `delivered, dropped, blocked` (`schema.ts:150`); carrier `over` (`schema.ts:~158`).
- Event types: `message`, `note`, `table` (`schema.ts:217`); table ops `add, update, remove, match, clear, replace` (`schema.ts:200`); table miss mark (`schema.ts:~210`).
- Panels: `table`, `rules`, `bits`, `labels` (`schema.ts:258-263`). Log legend kinds: messages plus `blocked, dropped, change, note` (`schema.ts:281`).
- Card art: `SPOTS` `watch, learn, practice, subnet, dhcp, firewall, osi` (`src/art/figures/spots.ts:182`); `FIGURES` in `src/lib/figures.ts:7-12` maps only the four networking slugs; any other ready networking lesson throws "has no figure for its card" (`src/lib/figures.ts:24`).
- Catalogue scene kinds not in code: "Device table" and "Playground" are not figure ids (the launch spec, `:94-96`); the built figures are the five above.

Track limits (`src/content/tracks/networking.ts:15-25`): steps 4–6; factsPerStep 2–4; practiceQuestions 2–3; optionsPerQuestion 2–4; learnTerms 3–10; patternNames 2–6; narrativeWords 120; hookWords 80; deepWords 90. Inherited by the tour (`how-the-internet-works.ts:16`).

What a new networking lesson must have, as the code checks it:
1. A file `src/content/lessons/<slug>.ts` whose default export is `defineLesson({…})`, slug equal to the file name (`registry.ts:140-170`, `lessonsFromModules`), title equal to the track's title (`registry.ts:59-101`, `buildEntries`).
2. `figure` in `figureIdSchema` (`schema.ts:37`); `certTags` from `CERT_TAG_IDS` (`schema.ts:35`).
3. Exactly one unit (`cited.ts:169-172`, Rule 1); no written `references` (Rule 2, `cited.ts:175`).
4. Every Learn lead, term, pattern, why, fact, Go deeper paragraph and Practice option cites (Rule 3, `cited.ts:181`); each cited claim has two independent sources or a defining standard (Rule 4, `cited.ts:190`).
5. OSI badge: `osi: { layers: [...], cite }` or `'spans'` (Rule 5, `cited.ts:201`).
6. Every Watch and scene part has a backing (Rule 6, `cited.ts:207`).
7. Learn ids unique; traces name cited Learn parts of the same lesson (Rule 7).
8. Citations only from `SOURCES` and of a source kind that may back content (Rule 8, `cited.ts:253`).
9. No "lesson N" text (Rule 9, `cited.ts:261`); `define.ts:369-371` lists the same rules.
10. Structure: unique unit, step, question and event ids; scene events fit `FIGURE_PARTS` (`define.ts:273-321`, `checkUnit`); answers index in range.
11. Limits of the track (`limits.ts`, `checkLimits`, `define` via `registry.ts:59-101`); an override needs a one-line reason ≤160 characters (`limits.ts:~40-60`, `overrideSchema`).
12. The card figure entry in `src/lib/figures.ts` (see above), and the glossary ties (section G).
13. A passing fact-check report in `docs/fact-checks/<slug>.md` (gate; section H).

## F. Tests and pages that rest on the track's shape or counts

Counts that are hard-coded for networking (real content unless noted):
- `src/content/registry.test.ts:41-47` `SLUGS` (the 19 slugs in order); `:50-56` "the networking track has 19 lessons in order, OSI Model first" (`expect(e.map((x) => x.slug)).toEqual(SLUGS)`, numbers 1–19 at `:53-54`); `:63-77` parts and the 19 titles; `:213` `getEntries('networking')` length 19; `:194-200` `trackTotals` 0/19 and 2/19 (fixture entries).
- `registry.test.ts:58-61` lesson numbers subnetting 7, dhcp 9, firewalls 16.
- `src/lib/track.test.ts:28` 19 numbers `01`–`19`; `:51-59` real `subnetting` key and `/networking/subnetting` URL; `:13-14` real DHCP and SUBNETTING lessons.
- `src/lib/tracks-page.test.ts:26` `card.entries` length 19; `:28` `Object.keys(card.known)` length 4 (real ready lessons).
- `src/lib/hub.test.ts:99-102` fixture (`ready()` ×4 and `notReady()` ×15) asserts "1 of 19 lessons done · 4 ready" (fixture, not real content).
- `src/lib/home.test.ts:122` Home stops titles; `:126-132` count formula against real `trackTotals`.
- `src/lib/about.test.ts:47-58` `sourceRows` for the real DHCP lesson's 16 sources (RFC 2131 first, `:49`).
- `src/lib/checked.test.ts:12-19` real `osi-model` stamp and sources.
- `src/lib/checked.counts.test.ts:8-13` real `osi-model` report date.
- `src/content/factcheck/reports.unchanged.test.ts:21-22` "there are eighteen lesson reports and six re-checks", `toHaveLength(18)` and `(6)` (one more lesson with a report breaks it).
- `src/content/tracks/how-the-internet-works.test.ts:741-747` every Subnetting title in the tour's sentences must be a networking entry title.
- `src/content/tracks/how-the-internet-works.test.ts:135` networking entries do not contain the tour's slug; `:144-155` real `dhcp` and `what-is-dhcp` shapes.
- `src/content/lessons/subnetting.test.ts:49` real `subnetting` entry `number: 7, available: true`; `:223-227` titles of the lessons the subnetting text points to are networking titles.
- `src/lib/url.test.ts:9-15` canonical URLs for `/networking/dhcp/` and `/networking/subnetting` (strings only).
- `src/scripts/about-page.test.ts:33-39` About's "lessons ready" equals the summed available count (generic).
- Unit tests with fixture lessons in the real networking track (the 19-slug list applies): `src/components/hub/TrackPanelProgress.test.tsx:17-20, 24, 51` (fixture `dhcp`, `firewalls`); `src/components/progress-islands.test.tsx:19-27, 76` (fixture; `networking/subnetting` progress key); `src/lesson/LessonConsole.test.tsx:30-31, 49` (fixture `dhcp`, `firewalls` in `buildEntries(networkingTrack…)`), `:162` "Lesson 9 of 19", `:444-452` "All 19 lessons"; `src/content/test-fixtures.ts:491-…` `FIXTURE_LIMITS` copies networking's limits.
- Real ready lessons as samples in unit tests: `src/components/hub/TrackRoute.test.tsx:17-22, 89-158` (real `osi-model`, real networking entries); `src/components/hub/TrackSide.test.tsx:13-17, 40, 81` (real `osi-model`); `src/lesson/Explanation.test.tsx:105-110` (real `osi-model`, `getEntries('networking')`); `src/lesson/Practice.test.tsx:83`, `src/lesson/sourceNumbers.test.ts:6` (real `osi-model`); `src/lesson/announce.test.ts`, `src/lesson/panels/RulesPanel.test.tsx`, `src/lesson/panels/UnitPanel.test.tsx`, `src/scenes/SequenceView.test.tsx`, `src/scenes/drivers/{dhcp,firewall,subnet}.test.ts` (real lesson content for the four ready lessons; not counts).
- `src/content/factcheck/recheck.real.test.ts:12-39` real `osi-model` through the fact-check CLI.
- `src/content/define.test.ts:202` comment only.
- `src/progress/useProgress.test.tsx:11` `known = { 'dhcp': 8, 'arp': 6 }` (`arp` is a planned, not ready, slug used as a key); `src/progress/store.test.ts` (95 hits, `dhcp` as the sample key, e.g. `:55-58`).
- `scripts/check-budgets.test.mjs:69-102, 146-152, 244-252`: fixture pages `networking/dhcp/index.html`, `networking/subnetting/index.html` (names only).

E2E specs (real build; `e2e/global-setup.ts` discovers ready lessons from the track pages, so no list is hard-coded there; `e2e/support.ts:3-30`):
- `e2e/site.spec.ts:263` `'14 lessons', '4 of 19 lessons ready'`; `:266` 19 segments; `:267` 4 ready segments; `:263`/`:281` Home's "So far" regex (accepts both forms).
- `e2e/site.spec.ts:522-527` Tracks: strip reads "0 of 19 lessons done · 4 ready" and "0 of 14 lessons done".
- `e2e/site.spec.ts:529` 19 strip squares for networking.
- `e2e/site.spec.ts:580-594` "Networking lists 19 stops in its parts, 15 Not ready yet, OSI Model first ready with Start": `routeStops` 19, `readyStops` 4, `soonStops` 15, first ready stop "OSI Model".
- `e2e/site.spec.ts:609` strip "0 of 19 lessons done · 4 ready"; `:695`, `:924` `routeStops` 19 (`?for=network-plus`, and "every lesson is listed").
- `e2e/site.spec.ts:720-767` "finishing DHCP shows ✓ Done…": `:729` "1 of 19 lessons done · 4 ready", `:736` `['14 lessons', '4 of 19 lessons ready']`, `:742` "1 of 19…", `:765` "4 of 19 lessons ready", `:767`, `:831`.
- `e2e/site.spec.ts:533-552` the first networking lesson (`NETWORKING_LESSONS[0]`) is the Start target; `:294-316` DHCP and OSI Model open pages; `:45` `OSI_PATH = '/networking/osi-model'`; `:80` `/networking/dhcp` in the page list.
- `e2e/site.spec.ts:650` "Ready for more? Networking Concepts goes deeper." (tour track page).
- `e2e/lesson.spec.ts:34` `NO_SEQUENCE = new Set(['subnetting', 'osi-model'])`; `:277-278` canonical for `/networking/dhcp`; `:292-374` DHCP, OSI, firewalls checks.
- `e2e/reading.spec.ts:48-61` (`osi-model`, `dhcp`), `:184-294` (`dhcp`), `:258` (`dhcp` and `firewalls` panels).
- `e2e/tablet.spec.ts:13` `DHCP = '/networking/dhcp'`; `:234` `/networking/firewalls?step=2`; `:343` and `:384` `/networking/osi-model`, `/networking/subnetting`, `/networking/firewalls`.
- `e2e/glossary.spec.ts:65` `#ip-address .gl-row--tracks` "Described in How the Internet Works, Networking Concepts" (depends on the `dhcp:term-ip` tie).
- `e2e/support.ts:48` the track path `/networking`.

Not found: any test that hard-codes the slugs of the 15 unwritten lessons as ready, or a list of ready slugs for networking outside the e2e discovery in `global-setup.ts`. `src/content/registry.test.ts:31-37` is the only list of all 19.

## G. Glossary ties

- Mechanism: a glossary entry or sense carries `lessons: [{ lesson, term }]` (`src/content/glossary-group.ts:25`, `:32`). The Learn term id must be one term of that lesson (`src/content/registry.ts:265-288`, `checkGlossaryTies`, rules 13 and 14; the messages at `:272-283`). It runs at build and in tests (`registry.ts:327`, `checkGlossaryTiesOrWarn(GLOSSARY_GROUPS, lessonsBySlug)`; dev only warns).
- Page: `src/lib/glossary.ts:180-191` builds `lessonMap["<lesson>/<term>"]`; `src/lib/glossary.ts:242-245` `definitionsFor(lessonMap, slug)`; the lesson page passes it at `src/pages/[track]/[lesson].astro:57`.
- Ties to the four ready networking lessons (entry level, from the index in the scratch file): 31 entries carry at least one tie to `dhcp`, `subnetting`, `firewalls` or `osi-model` (`leases.ts` for `dhcp`: `discover`, `offer`, `request`, `lease`, `broadcast`, `ack` via `transport.ts`, `ip-address` via `pilot.ts`; `subnets.ts` for `subnetting`: `subnet`, `subnet-mask`, `prefix-length`, `network-portion`, `host-portion`, `network-address`, `broadcast-address`, `borrowing-bits`, `point-to-point-link`, `default-gateway`; `filtering.ts` for `firewalls`: `firewall`, `firewall-rule`, `first-match`, `default-deny`, `stateful`, `shadowed-rule`, `port`, `source-address`; `layers.ts` for `osi-model`: `layer`, `peer-layer`, `encapsulation`, `decapsulation`, `header`).
- Entries tied to no lesson (25 of 105): `destination-address`, `private-address`, `public-address`, `osi-model`, the seven OSI layer entries, `dhcp`, `dns`, `name-server`, `protocol-data-unit`, `frame`, `packet`, `ip`, `router`, `icmp`, `tls`, `bit`, `tcp`, `udp`, `http` (`src/content/glossary-groups/*.ts`).
- Tests on ties: `src/content/registry.glossary.test.ts:24-62` (rules 13 and 14; fixtures), `:66-72` (refuse in build and tests, warn in dev); `src/lib/glossary.test.ts:184-215` (tracks of a tie; a tie to a missing or not-ready lesson throws at `:203-211`); `src/lib/glossary.test.ts:280-297` (lessonMap keys: `what-is-dns/term-1`); `src/lesson/definitions.no-script.test.ts:30-31` (ICMP's definitions ≥ 8).
- No test asserts that every ready lesson has a tie or counts tied lessons. `e2e/glossary.spec.ts:62-66` asserts "Described in" text for `ping`, `ip-address`, `ttl`.

## H. The new-lesson path (`docs/content-model.md` §3 and §8; handbook §7)

- §3: a lesson is `src/content/lessons/<slug>.ts`, `defineLesson` default export, one unit, no written references, cites from `SOURCES` only; every Learn part, Go deeper paragraph and Practice option cites; two independent sources or a defining standard per cited part; OSI badge cited or `'spans'`; Watch and scene parts carry a backing; ten strict rules (`content-model.md:81-170`).
- §3 limits (the "Limits" paragraph, before `content-model.md` line 171): each track sets ranges and ceilings; a lesson leaves one with an override and a one-line reason of at most 160 characters; an unused override fails the build.
- §8 flow: (1) write it in the cited shape; (2) `npm run fact-check -- <slug>` prints the claim sheet and hash; (3) dispatch a fresh `fact-checker` with the slug only; it writes `docs/fact-checks/<slug>.md` and runs the quote check; (4) the build reads the report (the gate); (5) fix and re-check until every item passes. A full check is required unless the last full check was a near-pass (at most 3 items not ✅ and none ❌) and no more than 12 items would be judged; then a targeted re-check is allowed.
- Handbook §7 (`docs/orchestrator-handbook.md:100`): "there are no words to keep, so the analyst's report is an outline of what to teach with its sources, and the author writes from it"; anything new on screen goes to `designer` and the owner's design gate.
- Blocks to a build (gate, `src/content/factcheck/gate.ts`; the build calls at `registry.ts:320-328`, refusal at `registry.ts:309`): no report; a report with a non-✅ verdict; a missing or stale `quotes` record; hash mismatch after an edit; a cited source not listed or not current; a report with no cited lesson; a cited lesson whose title or slug differs from the track (`registry.ts:59-101`); a limit breach (`limits.ts`); a ready lesson with no card figure (`src/lib/figures.ts:24`); a glossary tie to a missing term (`registry.ts:265`).
- Not checked by code: an outline or a claim sheet before writing (the claim sheet exists only after the file exists).
- Track: `src/content/tracks/networking.ts`; `tracks/index.ts` lists the tracks.

Scout S13, 2026-11-14. Read-only except this file.
