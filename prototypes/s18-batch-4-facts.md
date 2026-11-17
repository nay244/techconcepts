# S18: Networking Concepts' batch 4, Proxies and VPN (job 16, 2026-11-16)

The scout's report (Haiku), saved by the orchestrator from its transcript as written. Repo root is the checkout folder, branch `revamp` at `070cce6`, working tree clean. Paths below are repo-relative to that root. Nothing was edited, built, installed or sent. `dist/` was read, and `node scripts/check-budgets.mjs` was run against it (read-only). Untracked cached source texts are under `.superpowers/analysis/`.

## Summary

- Current state: 18 of 20 Networking lessons ready (OSI Model, Packets, IP Address, MAC Address, Switch, ARP, Subnetting, Router, DHCP, Ports, TCP/UDP, NAT, DNS, HTTP, HTTPS, TLS, Firewalls, Load Balancers). 28 lessons ready across both tracks, 28 full fact-check reports, 12 re-check reports. Source: `src/content/registry.test.ts:396-398`, `src/lib/home.test.ts:128-129`, `e2e/site.spec.ts:724-726`, `src/content/factcheck/reports.unchanged.test.ts:21`.
- Proxies is stop 18 and VPN is stop 20, both still planned. VPN is the last stop of Networking.
- The S16 numbers are stale: S16 said 15 ready, 25 lessons, 25 reports and 335 sources. Now they are 18, 28, 28 and 358 (see "Changes since S16" at the end).
- No checked lesson or glossary group contains prose on proxies, reverse or forward proxies, CONNECT, X-Forwarded-For, CDN, IPsec or a VPN protocol. The only VPN prose is one sentence in Firewalls. The only "tunnel" prose is one glossary sentence.
- Sources: no registry entry for RFC 7239, RFC 4301, 4303, 7296, 3948, 4026, 2637, WireGuard, OpenVPN or NIST SP 800-113. The registry does hold RFC 9110, NIST SP 800-77r1 ("Guide to IPsec VPNs") and several vendor pages.
- Scenes: the `net-map` figure has no compare or two-lane mode. `NE` is unused. The only drawn padlock is on the laptop. No proxy, tunnel, café, eavesdropper or VPN server is drawn.

## 1 Track position

**Lines in the track file** (`src/content/tracks/networking.ts`):
- Packets: `:32` (stop 2). Part `big-picture`, "The big picture" (`:28-29`). Neighbours: OSI Model (stop 1, `:31`) and IP Address (stop 3, `:39`).
- Switch: `:41` (stop 5). Part `local-network`, "Addresses & the local network" (`:36-37`). Neighbours: MAC Address (stop 4, `:40`) and ARP (stop 6, `:42`).
- Firewalls: `:77` (stop 17).
- Proxies: `:78` (stop 18). Part `protect-scale`, "Protecting & scaling traffic" (block `:73-82`). Neighbours: Firewalls (17) and Load Balancers (19).
- Load Balancers: `:79` (stop 19). Neighbours: Proxies (18) and VPN (20).
- VPN: `:80` (stop 20, the last line of the part and of the track). Neighbours: Load Balancers (19) and nothing after.
- Stop numbers come from registry order: `src/content/registry.ts:82` (`number: entries.length + 1`).
- Track description: `networking.ts:4` says "20 lessons".

**`neighbors()`** (`src/content/registry.ts:113-125`): returns the nearest available entry before and after. `nextPlanned` is true only when the following entry exists and is not available (`:123-124`). For stop 20 the following entry is undefined, so the result is `{ prev: <nearest ready before>, next: null, nextPlanned: false }`. The test pins the VPN-only case: `src/content/registry.test.ts:178-179`.

**Load Balancers' end row now.** The lesson is stop 19. No ready entry follows it, so the end row is the `else` branch of `EndRow` (`src/lesson/Explanation.tsx:189`, branch at `:215-238`):
- The text is "That's the whole lesson, and the last ready one for now." (`Explanation.tsx:225-227`), then `comingSoon(number, total)` (`:228`).
- `comingSoon` is at `Explanation.tsx:157-170`. With one lesson left it returns " Lesson {total} is coming soon." (`:161-165`). Here that is "Lesson 20 is coming soon."
- `total` comes from `src/pages/[track]/[lesson].astro:56` (`total={entries.length}`). `number` is `entry.number`.
- Pinned by: `e2e/site.spec.ts:758` ("Lesson 20 is coming soon."). Unit: `src/lesson/Explanation.test.tsx:222-223` and `src/lesson/LessonConsole.test.tsx:326-327`.
- Firewalls (stop 17) currently shows "Up next" for Load Balancers, because Proxies is not ready: `e2e/site.spec.ts:754-756`.

**The last lesson of a track, when it is ready** (VPN, once ready, is stop 20 of 20):
- `Explanation.tsx:223-225`: when `number === total`, the text is "That’s the whole lesson, and the last lesson of this track." No "coming soon" text.
- The button is "Back to the track" (`Explanation.tsx:232-234`).
- Already handled, in code and tests: the same branch runs for How the Internet Works' last lesson, What is TLS (stop 14 of 14, `src/content/tracks/how-the-internet-works.ts:64`). Unit: `src/lesson/Explanation.test.tsx:227-231`. E2E: `e2e/site.spec.ts:751-753` (`/how-the-internet-works/what-is-tls?step=99` shows "the last lesson of this track" and no Firewalls link). Registry: `src/content/registry.test.ts:395` (`neighbors(tour, 'what-is-tls').next` is null).
- Nothing in the code special-cases a Networking last lesson. The branch depends only on `number === total`.

## 2 Documents

**Registry size:** 358 entries (`grep -c "^    id: " src/content/sources.ts` = 358; the same count for `    kind: `). The registry is `src/content/sources.ts`.

**Allowed hosts:** `SOURCE_HOSTS` is at `src/content/sources.ts:31-77`. Exact hosts only, no wildcards (`:30`).
- `rfc` `:32`: www.rfc-editor.org, datatracker.ietf.org
- `ieee` `:33`: standards.ieee.org, ieeexplore.ieee.org
- `iana` `:36`: www.iana.org, www.internic.net
- `nist` `:37`: csrc.nist.gov, nvlpubs.nist.gov, www.nist.gov
- `itu` `:39`: www.itu.int
- `standards-body` `:44`: html.spec.whatwg.org, url.spec.whatwg.org, fetch.spec.whatwg.org
- `government` `:46` and `security-reference` `:48`: empty
- `internet-registry` `:51`: www.icann.org
- `community` `:57`: canonical.com, www.baeldung.com
- `vendor` `:60-74`: learn.microsoft.com, www.cisco.com, developers.cloudflare.com, docs.paloaltonetworks.com, support.microsoft.com, support.google.com, letsencrypt.org, www.cloudflare.com, www.paloaltonetworks.com, knowledge.workspace.google.com, man.openbsd.org, docs.cloud.google.com
- `cert-objectives` `:76`: www.comptia.org, partners.comptia.org, learningnetwork.cisco.com

Not allowed: any proxy or VPN vendor page outside the list above. That includes docs.nginx.com, aws.amazon.com, cloud.google.com, and the NIST and IETF hosts only where the kind matches. Allowed for a new `vendor` page: the list above.

**Entries a Proxies lesson might use** (id, kind, URL, `id:` line):
- `rfc-9110` HTTP Semantics, `https://www.rfc-editor.org/rfc/rfc9110.html`, anchor `#section-{n}`, `:510`. The entry has no section list. Lessons cite only §4.2.1 (`load-balancers.ts:86`, `packets.ts:549`) and §4.2.2 (`firewalls.ts:265`).
- `rfc-9111` HTTP Caching, `:519`. `rfc-9112` HTTP/1.1, `:528`. `rfc-9113` HTTP/2, `:537`. `rfc-9114` HTTP/3, `:386`.
- `rfc-6797` HSTS, `:643`. `rfc-3986` URI, `:564`. `rfc-6066` TLS SNI, `:661`.
- `rfc-5625` "DNS Proxy Implementation Guidelines", `:1002`.
- `cloudflare-lb-proxy-modes` (vendor, title "Proxy status"), `https://developers.cloudflare.com/load-balancing/understand-basics/proxy-modes/`, `:775`.
- `cloudflare-layer-7` "What is layer 7?", `https://www.cloudflare.com/learning/ddos/what-is-layer-7/`, `:1767`. `paloalto-layer-7` "What Is Layer 7?", `https://www.paloaltonetworks.com/cyberpedia/what-is-layer-7`, `:1759`.
- `cloudflare-spectrum-glossary` "Glossary (Spectrum docs)", `https://developers.cloudflare.com/spectrum/glossary/`, `:2025`.
- `cloudflare-network-layers` "Network Layers", `:449`. `cloudflare-network-layer` `:2827`. `cloudflare-network-switch` `:3154`.
- `microsoft-app-gateway` `:625` and `microsoft-app-gateway-how` `:3186` ("How an application gateway works").
- `microsoft-network-settings` "Essential Network Settings and Tasks in Windows", `:1406`. The title does not name a proxy.
- `microsoft-osi` `:229`. `cisco-cef-load-balancing` `:3080`.
- Google: `google-chrome-secure` `:807`, `google-chrome-always-secure` `:815`, `google-lb-overview` `:3226` (docs.cloud.google.com). No Google proxy page is registered.
- Not registered: RFC 7239 (Forwarded), X-Forwarded-For, CONNECT, Via, any "what is a proxy", "reverse proxy", "forward proxy" or CDN page, and any Microsoft or Google proxy-settings page. `grep` for "cdn", "proxy" in titles: the only hits are `:775` and `:1005` above.
- Cached text with the sections: `.superpowers/analysis/glossary-packets/sources/rfc9110.txt` holds §3.7 "Intermediaries" (line 863: "There are three common forms of HTTP "intermediary": proxy, gateway, and tunnel."), §7.6.3 "Via" (line 2664) and §9.3.6 "CONNECT" (line 4259). It is untracked and not registered. A lesson citing these needs an entry in `sources.ts`, which the registry does not yet have.

**Entries a VPN lesson might use:**
- `nist-sp800-77r1` (kind `nist`), "Guide to IPsec VPNs", `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf`, no anchor, `:221`. Its helper in the glossary is `nist77` (`src/content/glossary-groups/security.ts:32`). The glossary's Encryption entry cites it (`security.ts:249, 254`). A cached copy is `.superpowers/analysis/glossary-packets/sources/nist-sp800-77r1.txt`.
- `rfc-2003` "IP Encapsulation within IP", `:245`, anchor `#section-{n}`. Cited by the glossary for decapsulation (`src/content/glossary-groups/layers.ts:275`).
- `rfc-8085` "UDP Usage Guidelines", `:263`. The layers glossary cites its §3.1.11 as `R8085_TUNNEL` (`layers.ts:60`).
- `cisco-ipip-decap` "IP-in-IP Decapsulation", `:237`. The Cisco URL is also a constant in `src/content/lessons/osi-model.ts:43`.
- `microsoft-azure-network-best-practices` "Azure network security best practices", `:2603`. Cited by Firewalls for "Point-to-site VPN is more secure than direct RDP or SSH connections" (`src/content/lessons/firewalls.ts:101`).
- `microsoft-hdinsight-ssh-tunnel` "Use SSH tunneling to access Azure HDInsight", `:2228`.
- `microsoft-ms-sstp` "[MS-SSTP]: Overview", `:2429`. Its short name is "Microsoft MS-SSTP"; the title does not name a VPN.
- TLS and IPsec-adjacent: `rfc-9846` TLS 1.3, `:634`; `rfc-9849` TLS Encrypted Client Hello, `:652`; `rfc-9325` TLS/DTLS recommendations, `:2355`; `rfc-9001` Using TLS to Secure QUIC, `:715`; `rfc-6066` SNI, `:661`.
- Not registered: RFC 4301, 4303, 7296, 3948, 4026, 2637 and 2616 (each `grep -c "rfc-NNNN'"` = 0); WireGuard; OpenVPN; NIST SP 800-113; any "What is a VPN" page; any IPsec or VPN page other than NIST 800-77r1.

**Defining flag:** `cite(source, section, { defining: true })`. The rule is at `docs/content-model.md:72`. Defining citations already in use: `load-balancers.ts:86` (RFC 9110 §4.2.1) and `packets.ts:549`.

## 3 Agreement

**Proxy.** No prose in any checked lesson or glossary group. Hits:
- `src/content/lessons/load-balancers.test.ts:65-68`: "the lesson never says proxy, nor least connections" (test: `expect(words).not.toMatch(/proxy|least connection/i)`).
- `src/content/lessons/what-is-ssh.ts:1046`: "One connection can also forward ports, either way or as a SOCKS proxy (ssh -D), and copy files (scp, sftp)." This is prose.
- Citation titles only: `ports.ts:78-79` ("Cloudflare's proxy"); `what-is-https.ts:52-55` (`CF_PROXY`, `cloudflare-lb-proxy-modes`).
- Proxy ARP: `src/content/lessons/arp.ts:55` defines `CISCO_PROXY` (Cisco's "Proxy ARP", citing RFC 1027). It is cited at `arp.ts:498`, `:555` and `:572`, for "Reaches ... only your own network" and "ARP stays on your own network". The lesson's prose does not say "proxy".

**Reverse proxy, forward proxy, CONNECT, X-Forwarded-For, CDN.** None in any checked lesson or glossary group.

**Via.** No prose. The net-map `via` field (`src/content/schema.ts:155-156`, "the tag rides from → via → to as one ride") is a message field, not prose. `define.ts:382-` checks it. A fixture line says "via the default gateway" (`src/content/router-fixture.ts:62`).

**Gateway.**
- `src/content/glossary-groups/packets.ts:232` (`router-3`): "Older documents call routers gateways."
- `src/content/glossary-groups/leases.ts:305`: "A default gateway is the router a device sends packets to when their destination is not on its own network."
- `src/content/lessons/arp.ts:252`: "the packet’s next stop is the **default gateway**, your router, 192.168.1.1."
- `src/content/lessons/router.ts:142`: "a default route to the gateway."

**Tunnel.**
- `src/content/glossary-groups/layers.ts:284` (decapsulation): "A router does it to the frames it receives; a tunnel’s far end, to recover the original packet."
- `layers.ts:9` (header): the tunnel "outer header" is one of the places RFC 2003 is marked defining.
- `layers.ts:275` cites RFC 2003 and RFC 8085 §3.1.11.

**VPN.**
- `src/content/lessons/firewalls.ts:348`: "Admin logins from outside are safer through a VPN." Cited `NIST_SERVER_SECURITY` (`firewalls.ts:62`: SP 800-123 §6.5) and `MS_VPN` (`:101`).
- `src/content/lessons/firewalls.test.ts:287-293`: `TOPIC` maps the lesson slug `vpn` to the word "VPN" for a sentence that names a lesson.

**IPsec.** No prose in any lesson or glossary group. Only the source title at `sources.ts:224` ("Guide to IPsec VPNs").

**Encryption in transit.**
- `src/content/glossary-groups/security.ts:249`: "Encryption turns readable data into a scrambled form that hides its meaning, using a key."
- `security.ts:259`: "TLS and SSH encrypt what they carry, so that only the two ends of the connection can read it." Cited `rfc-9846` §1 and `rfc-4253` §1.
- `src/content/lessons/what-is-https.ts:166`: "Think of a postcard and a locked box. With plain HTTP, every router on the way could read your postcard, and even rewrite it. With HTTPS, your browser and the site first agree on a..."
- `what-is-https.ts:216`: "Notice that this question isn’t sealed. Anyone watching the netw..." (the DNS question).
- `what-is-tls.ts:160`: "Imagine two strangers who must agree on a secret code while shouting across a crowded room..."
- `src/content/glossary-groups/web.ts:248` (Padlock): "It means the connection uses HTTPS and the site’s certificate is valid, so what is sent can’t be intercepted."

**CDN.** None.

**Caching.**
- `src/content/glossary-groups/naming.ts:230` (DNS cache): "A DNS cache holds answers a resolver has already received, so it can answer again without asking name servers."
- `src/content/lessons/arp.ts:8-10`: ARP cache, "It looks in its ARP cache (empty)..."

**What `load-balancers.ts` says or avoids about proxies.**
- Avoids the word. The lesson's prose uses "load balancer", "pool", "balancer", "health check".
- Header `:13-14`: "No standard defines a load balancer, so every claim rests on passages of two publishers among Microsoft, Cloudflare and Google, and none is marked defining. The one defining citation is RFC 9110 section 4.2.1 for "web pages over HTTP, to port 80"."
- Cites Cloudflare's proxy page for "Layer 7 load balancing" (`:68`, `CF_L7`) and "Layer 4 load balancing" (`:70`), but no prose says "proxy".
- Badge value: "4 or 7, depending on the balancer" (`load-balancers.ts:276` and `:539`). The OSI badge is `OSI_4_7` (`:88`).
- Example addresses: balancer `203.0.113.80:80` (`:93`); servers A, B, C `10.0.0.11`, `10.0.0.12`, `10.0.0.13` (`:94`); readers `198.51.100.23` (`:174`), `198.51.100.41` (`:179`), `192.0.2.25` (`:181`). The header says the log's addresses and ports are example data (RFC 5737 and RFC 1918, `:15`). The domain is example.net (`:7`).

**Example data the Proxies or VPN lesson must agree with:**
- `what-is-https.ts:99-101` and `:156-158`: laptop `192.168.1.100:50812`, DNS resolver `192.0.2.53`, web server `198.51.100.7:443`. Name: `techconcepts.app` (`:151`, `:183`), 19 uses of the name in that file.
- `what-is-tls.ts:95-96`: laptop `192.168.1.100:50877`, web `198.51.100.7:443`. Name: `techconcepts.app` (`:146`, `:168`). 14 uses.
- `nat.ts:77-78`: public address `198.51.100.23`, web `203.0.113.80` (example.net). `nat.ts:159` and `:374`: a stranger at `192.0.2.66`. Laptop `192.168.1.100`, router inside `192.168.1.1` (`:484`). example.net appears 15 times in `nat.ts`.
- `firewalls.ts:168`: web server `10.0.0.10`, visitor `203.0.113.50` (`:273`), admin `198.51.100.7` (`:337`, `:353`). Note that `198.51.100.7` is the admin in Firewalls and the HTTPS web server in what-is-https and what-is-tls.
- `packets.ts:77`: web `203.0.113.80:80`. `ports.ts`, `router.ts`, `packets.ts` and `load-balancers.ts` use example.net (4 to 5 times each).
- `src/art/scenes/net-map-layers.ts:57` laptop `192.168.1.100`; `:66` phone `192.168.1.101`; `:109` `http:web` "EXAMPLE.NET" `203.0.113.80 · port 80`; `:110` `https:web` "TECHCONCEPTS.APP" `198.51.100.7 · port 443`; `:159` stranger `192.0.2.66`; `:170` voice `203.0.113.90 · port 16384`.
- Switch MACs: `src/art/scenes/switch-parts.ts:8-11`: `00:00:5E:00:53:01` (router), `:10` (laptop `…10`), `:11` (TV `…12`), `:12` (printer `…13`). These are the MAC Address lesson's example addresses (`:6`).

## 4 Scenes

**Figure kinds: seven** (S16 said five; the code has seven).
- `src/art/scenes/types.ts:3`: `FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map' | 'osi' | 'switch' | 'pool'`.
- `FigureParts` interface: `types.ts:5-28`.
- `src/content/schema.ts:36-37`: `figureIdSchema = z.enum([...seven...])`, kept in step by `src/art/scenes/parts.test.ts`.
- `src/art/scenes/index.ts:11-19`: `DRAW` (one drawer per figure); `:22` `drawFigure`.
- `src/scenes/drivers/index.ts:12-20`: `DRIVERS` (one driver per figure). Drivers live in `src/scenes/drivers/`, not in `src/art/scenes/`. There is no `src/art/scenes/drivers` folder.
- `src/art/scenes/parts.ts:12-111`: `FIGURE_PARTS`. Entries: dhcp `:14`, subnet `:15-32`, firewall `:33-41`, net-map `:42-71`, osi `:72-86`, switch `:90-98`, pool `:99-110`.
- `src/art/figures/spots.ts:438` (`SPOTS`) and `:441` (`DRAW`) hold the card spots. `src/lib/figures.ts:6-21` maps each lesson to its card spot.

**net-map, after job 14.**
- **Places** (`src/art/scenes/net-map-layers.ts`). Base places at `:60`: laptop, router, resolver, isp, a, b, c, d, phone. Plus the plate sites from `NET_MAP_LAYERS` (`:108-171`, 17 layer entries): web, call, root, tld, auth, out, in, mail, files, host, server, stranger, voice. Total 22, counted from the code and not run.
- **Plates.** One `ServerPlate` per layer entry (`:108-171`). Slot type `:15`: `'E' | 'SE' | 'N'`. E is used by web, host, mail, names and `smtp:out` (`:126-135`). SE only by `smtp:in` (`:136-144`). N by `nat:stranger` (`:151-160`) and `tcp-udp:voice` (`:161-171`).
- **Slots and NE.** `src/art/scenes/net-map.ts:44` defines a `NE` slot (`{ x: -30, y: -200, w: 64, d: 54, r: 7 }`) and the comment at `:43` says "NE and SE for two smaller ones". No layer uses NE, and `ServerPlate.slot` excludes it (`net-map-layers.ts:15`). NE is free.
- **Cues** (`src/art/scenes/parts.ts:47-65`): status, conn, page, lock (flag), tray, status-known (flag), status-done (flag), addr, url, drop, hide, show, park, unpark. Fourteen names. Args at `:66`: `drop` takes the routers, `hide` takes resolver, `show` takes phone. `via` is not a cue: it is the message field at `src/content/schema.ts:155-156`, handled at `src/scenes/drivers/net-map.ts:132-135`.
- **park and unpark.** `park <place> <bay> <TAG>` and `unpark laptop` (`src/scenes/drivers/net-map.ts:29-32`). Bays (`net-map-layers.ts:74-75`): laptop 4, web 4, and isp, a, b, c, d 1 each.
- **Tags at once.** The map draws 16 tag shapes (`NET_MAP_TAG_MAX = 16`, `net-map-layers.ts:54`; `net-map.ts:473`), one per label length. The drawing comment says "one for each length, as only one rides at a time" (`net-map.ts:389`). Parked copies are separate and unlit (`src/scenes/drivers/net-map.ts:391-412`).
- **Compare or two-lane mode.** None. `grep -w` for compare, lane, two-lane across `src/art`, `src/scenes`, `src/lesson` and `src/content` (non-test) found nothing for a mode. TCP/UDP was built in turn: `src/content/lessons/tcp-udp.ts:8-11` ("the steps run TCP first, then UDP, in turn ... one table, 'What your laptop got', shows both lanes"). The two-lane drawing is the TCP/UDP card spot only (`src/art/figures/spots.ts:336-357`: "Two lanes on one plate..."). D10 row 11 and row 18 planned a compare mode (`prototypes/d10-scene-map.md:44`, `:46`); the notes at `:56` say "Design it once, for TCP/UDP". `docs/direction.md:85` (decision 2.58) says "the two-lane compare mode left for Proxies (batch 4)".
- **Padlock.** Drawn on the laptop's screen (`src/art/scenes/net-map.ts:85-109`, `nm-hold-lock` at `:106`). The driver describes the `lock` cue as "the padlock in the laptop's address bar" (`src/scenes/drivers/net-map.ts:23`).

**osi figure's labels panel.** Stacks three layers of blocks (`src/art/scenes/osi-stacks.ts:6`, `OSI_STACKS`). The `labels` panel is a strip of chips, one per header, outermost first, then a "data" chip (`src/lesson/panels/LabelsPanel.tsx:33-48`, `labels-row`). Its data is `messageLabelsSchema` (`src/content/schema.ts:126-134`): `list`, a strictly increasing set of layers 2 to 7, plus an optional `mark`. It cannot show one header wrapped around another: it is a row of chips, not a nest.

**pool figure (job 14).** `src/art/scenes/pool.ts:1-9` and `src/art/scenes/pool-parts.ts:4-19`. Three readers' laptops in front (laptop, reader2, reader3). A balancer in the middle. Servers A, B, C behind, each cabled to the balancer, with two health lamps on the front and a stack of up to four request chips (`POOL_CHIPS = 4`, `pool-parts.ts:10`). The driver rides tags along the cables (`src/scenes/drivers/pool.ts`).

**Drawings of proxy, tunnel, café, eavesdropper, padlock, VPN server.**
- Padlock: yes (above).
- Proxy, tunnel, café, eavesdropper, VPN server: none. `grep -i` for proxy, tunnel, café/cafe, eavesdrop, VPN and rack across `src/art` and `src/scenes` (non-test) finds only the words "pool" (glow), "rack" (server racks at `net-map.ts:175-281`), "switch" (in comments) and "lock".
- The net-map voice server (`net-map.ts:344-353`) and "Someone else" at 192.0.2.66 (`net-map-layers.ts:151-160`) are the nearest figures to an outside party.
- Cables are drawn as tubes (`src/art/common.ts`, `tubePieces`). They are not tunnels.

## 5 Counts

**18 ready.** `src/content/registry.test.ts:396-398` (the 18-item list). `src/lib/home.test.ts:128-129` ("18 of 20 lessons ready"). `src/lib/track.test.ts:29` (ready titles). `src/scripts/about-page.test.ts:39` (comment "18 ready in Networking, 14 in the tour, 4 shared"). `e2e/site.spec.ts:264` ("18 of 20 lessons ready"); `:523`, `:528`, `:613` (strip "0 of 20 lessons done · 18 ready"); `:771`, `:788`, `:801` ("1 of 20 … 18 ready"); `:820`, `:826` ("0 of 20 … 18 ready"); `:891` ("2 of 20 … 18 ready"); `:795` and `:824` ("18 of 20 lessons ready").

**28 lessons.** `src/scripts/about-page.test.ts:42` (`'28'`). `e2e/site.spec.ts:724-726` ("About counts a lesson two tracks list once: 28 lessons ready"). `src/lib/checked.test.ts:7-8` (`{ checked: 28, total: 28 }`). `src/content/factcheck/reports.unchanged.test.ts:21` (`toHaveLength(28)`).

**28 reports.** `docs/fact-checks/*.md` (not `.recheck`): 28 files. Pinned by `reports.unchanged.test.ts:21` and `checked.test.ts:7`.

**Re-checks.** 12 files `docs/fact-checks/*.recheck.md` (firewalls, ip-address, mac-address, nat, packets, ports, switch, what-is-imap, what-is-smtp, what-is-ssh, what-is-tls, what-is-udp). Not pinned by a count in a test.

**Up next chain (unit).** `src/content/registry.test.ts:392` (dhcp → ports), `:393` (what-is-tls → firewalls), `:394` (firewalls → load-balancers), `:395` (tour's what-is-tls → null), `:396-398` (the 18 ready with numbers), `:178-179` (VPN-only case).

**Up next chain (e2e).** `e2e/site.spec.ts:739-759`: `:741` (subnetting → router), `:742` (dhcp → ports), `:744-745` (osi-model → packets → ip-address → mac-address → switch → arp; ports → tcp-udp → nat), `:751-753` (tour's what-is-tls is last), `:754-758` (firewalls → load-balancers, and LB's "Lesson 20 is coming soon.").

**NO_SEQUENCE.** `e2e/lesson.spec.ts:34`: 11 slugs (subnetting, osi-model, router, arp, ports, nat, ip-address, mac-address, packets, switch, load-balancers). Used at `:76`, `:190`, `:196`. S16 said eight; the code now has eleven.

**Proxies or VPN pinned as not ready.** `src/lib/track.test.ts:30-32` (Proxies, stop 18, `ready: false`). `e2e/site.spec.ts:754` (comment "Proxies (18) is not ready").

**VPN.** `src/content/registry.test.ts:50-56` (SLUGS includes `proxies`, `vpn`), `:79` (`vpn` is number 20, partTitle "Protecting & scaling traffic"), `:178-179` (VPN as the only ready lesson).

**Coming-soon text.** `src/lesson/Explanation.tsx:157-170` (comingSoon), `:223-229` (EndRow); `e2e/site.spec.ts:758`; `src/lesson/Explanation.test.tsx:222-223` ("Lessons 18 to 20 are coming soon.") and `:230-231`; `src/lesson/LessonConsole.test.tsx:326-327`. The other "coming soon" hits are tracks (`src/content/tracks/index.ts:40`), not lessons.

**Home and About prose.** `src/lib/home.ts:210` (comment "8 of 20 lessons ready"); `src/lib/about.ts:21` (comment with "1 of 18"). Both are comments.

## 6 E2E helpers after job 15 (B17)

**Helper functions (one line each).**
- `e2e/support.ts`: `playButton` (`:102`, the Play all / Pause button, now `.cbtn--alt`); `replayButton` (`:104`, new, the replay icon); `nextButton` (`:106`, the orange forward button, "Next step" or "Next lesson"); `speedButton` (`:107`); `viewSwitch` (`:108`); `logRows` (`:110`); `position` (`:131`, reads kicker and state); `moveBy` (`:159`, acts then waits for the next position); `pressKey` (`:169`, arrow key with focus dropped); `setSpeed` (`:179`); `stepCount` (`:185`); `expectLessonShape` (`:194`); `open` (`:62`); `hydrated` (`:57`); `collectErrors` (`:71`); `pageOverflow` (`:89`); `figureSnapshot` (`:242`); `clippingContainers` (`:221`); `readyLessons` (`:27`); `lessonCard` (`:40`).
- `e2e/batch1.ts`: `playToEnd` (`:25`, plays at 2× from the Overview until the button reads "Play all"); `watchPanel` (`:46`); `checkPhoneTable` (`:71`); `checkCard` (`:85`); `tableTab` (`:21`); `figure` (`:22`); `watched` (`:68`).
- `e2e/batch2.ts`: `watch` (`:22`); `watchedNow` (`:48`); `playWatched` (`:51`); `checkPhoneTab` (`:61`).
- `e2e/lesson.spec.ts` (local): `behaviourOnly` (`:44`); `unitCount` (`:48`); `playAll` (`:53`, B17's rename of `playToReplay`; plays all of the current unit at 2× and waits for "Play all", `:57`); `overflowAt` (`:62`).

**What B17 changed** (`git diff bc70815 HEAD -- e2e`; bc70815 is job 14's "done" commit):
- Renamed: `playToReplay` → `playAll` (`e2e/lesson.spec.ts`, local, not exported). The end label changed from "Replay" to "Play all".
- Selectors changed: `playButton` `.cbtn--play` → `.cbtn--alt` (`support.ts:102`); `nextButton` from role button "Next step" to `.cbtn--go` (`support.ts:106`).
- Semantics changed, names kept: `playToEnd` now waits for "Play all" (`batch1.ts:29`, was "Replay"); `position().atEnd` now means the forward button reads "Next lesson" (`support.ts:153`, was "Next step" disabled).
- Added: `replayButton` (`support.ts:104`).
- Nothing exported from `support.ts`, `batch1.ts` or `batch2.ts` was removed.

**`e2e/load-balancers.spec.ts`** (207 lines). Imports: `checkCard`, `DESKTOP`, `PHONE`, `playToEnd`, `RUN_TIMEOUT`, `watchPanel`, `watched` from `./batch1`; `collectErrors`, `hydrated`, `lessonCard`, `open`, `pageOverflow`, `playButton` from `./support`; `spot` from `../src/art/figures/spots`. Local helpers: `ariaOf` (`:16`), `pool` (`:17`), `watchStage` (`:24`), `stageSeen` (`:44`), `watchUnhealthy` (`:59`), `unhealthySeen` (`:86`), `paint` (`:89`). Seven tests: E1 `:96` (stage size at 1440, log ends with 19 rows), E2 `:118` (375 width), E3 `:138` (reduced motion ends on "Play all", changed by B17 from "Replay"), E4 `:149` (lamps in both themes), E5 `:175` (stop 19 card), E6 `:186` (no-JS, in `describe` at `:183`), E7 `:196` (labelled figure).

**`e2e/packets.spec.ts`** (126 lines). Imports: `checkCard`, `DESKTOP`, `PHONE`, `playToEnd`, `tableTab`, `watchPanel`, `watched` from `./batch1`; `open`, `pageOverflow` from `./support`; `spot`. Local helpers: `ariaOf` (`:15`), `watchSideways` (`:22`), `watchContrast` (`:40`), `contrastSeen` (`:72`), `sidewaysSeen` (`:73`). Four tests: 21a `:76`, 21b `:100`, 19a `:114`, 22a `:121`. Packets.spec.ts is unchanged by B17.

**Commits touching `e2e/`, newest first** (`git log --oneline -15 -- e2e/`): 5c7f079, c295f9a, ec2f356, 685a507, 0c73c0a, 561cd61, 96d5e23, b8ce7a8, 0ffd37a, 278b775, c0bf1e9, 66f0aca, cf0e665, 4443088, c6f27a8.

## 7 Budgets

- Check: `scripts/check-budgets.mjs:17` (`BUDGETS = { html: 250_000, lessonJs: 200_000 }`, gzipped bytes). Lesson page: `/<track>/<lesson>` (`:80-81`). JS = every script the page runs, each file once (`:4-5`).
- Run: `package.json:11` (`build` = `astro check && astro build && node scripts/check-budgets.mjs`); `package.json:17` (`budgets`).
- Latest measured in `team.md`: lesson JavaScript 108.0 KB of 200 (`team.md:915`, B15c, job 14). F15 (`team.md:961`): "build clean, 40 pages in budget".
- Measured now from `dist/` (not rebuilt; `dist/` last written 2026-11-15 21:06): `node scripts/check-budgets.mjs` prints "Every page is within budget (40 pages)." Lesson JS is 108.0 KB on every lesson page (one shared bundle). Lesson HTML (gzipped): packets 123.8 KB, switch 64.7 KB, load-balancers 48.2 KB, firewalls 63.5 KB, tcp-udp 133.0 KB (the largest), what-is-tls 129.2 KB. The Networking track page `/networking/` has HTML 196.6 KB, against 250 KB, leaving about 53 KB. Two new card spots on that page are the headroom question for this batch.

## 8 Collisions

Files two lesson branches would both touch:
- `src/content/sources.ts`: one registry (`:31-77` hosts; entries to 3242). Hosts: a new vendor host joins `SOURCE_HOSTS` in the change that first cites it (`sources.ts:30`).
- `src/content/glossary-groups/*.ts`: shared groups (`layers.ts` has the tunnel prose; `security.ts` encryption; `packets.ts` gateway). A glossary tie `{ lesson, term }` must name a ready lesson (`src/lib/glossary.ts:155`).
- `src/content/tracks/networking.ts`: already has both lines (`:78`, `:80`). Counts are not in this file.
- `src/art/figures/spots.ts`: `SPOTS` (`:438`) and `DRAW` (`:441`). A card spot is needed for each lesson. `src/lib/figures.ts:6-21` maps each lesson's card. `src/lib/figures.test.ts:38` lists eight slugs (switch is not in that list).
- `src/art/scenes/net-map-layers.ts` (places, plates, bays), `parts.ts` (cues), `net-map.ts` (SLOT), `src/scenes/drivers/net-map.ts`. A new plate or cue touches all four, plus `src/scenes/drivers/net-map.test.ts` and `src/scenes/drivers/net-map.packets.test.ts`.
- A new figure would touch `types.ts`, `schema.ts:37`, `scenes/index.ts`, `drivers/index.ts`, `parts.ts`, and `parts.test.ts`.
- `src/content/batch3-fixtures.ts`, `batch2-fixtures.ts`, `test-fixtures.ts:493` (`FIXTURE_LIMITS`).
- `src/content/define.pool.test.ts` and `src/art/scenes/pool.test.ts` (job 14's tests).
- Counts: `registry.test.ts` (`:47`, `:50`, `:75`, `:79`, `:178-179`, `:391-398`), `src/lib/track.test.ts:28-33`, `src/lib/home.test.ts:128-129`, `src/scripts/about-page.test.ts:39-42`, `src/lib/checked.test.ts:7-8`, `src/content/factcheck/reports.unchanged.test.ts:21`.
- E2E: `e2e/lesson.spec.ts:34` (NO_SEQUENCE), `e2e/site.spec.ts:264-891` (counts and the Up next chain), and the new lessons' own spec files.
- `docs/fact-checks/` (one report per lesson) and `docs/lesson-changes/`.

## 9 Fact-check tooling

- `package.json:18`: `"fact-check": "node scripts/fact-check.mjs"`.
- Commands (`scripts/fact-check.mjs:4-16`):
  - `npm run fact-check -- <slug>`: the claim sheet, then "Write your report to: <path>" (`src/content/factcheck/cli.ts:192`).
  - `-- <slug> --check`: "Report OK: <path>" or the issues.
  - `-- <slug> --quotes <folder>`: looks for every quoted passage in the folder's `.txt`, `.html` or `.xml` files.
  - `-- <slug> --stamp`: writes the items record into a full report that predates it.
  - `-- <slug> --recheck`: the re-check sheet (`cli.ts:167`). `--recheck --check` runs the gate on the pair.
- The report: `docs/fact-checks/<slug>.md`, with a fenced `json fact-check` block (`docs/content-model.md:282`). The re-check: `docs/fact-checks/<slug>.recheck.md` (`cli.ts:170`, `docs/content-model.md` §8).
- The gate reads every `docs/fact-checks/*.md` (`cli.ts:73`). Glossary groups use `docs/fact-checks/glossary/<id>.md` (`docs/content-model.md:339`).
- Existing reports for the batch-3 lessons: `docs/fact-checks/packets.md`, `packets.recheck.md`, `switch.md`, `switch.recheck.md`, `load-balancers.md`.
- Proxies and VPN have no reports yet.

## Changes since S16 (facts that moved)

- Ready: 15 → 18 (Packets, Switch and Load Balancers shipped in job 14, `team.md:926-927`).
- Lessons ready across both tracks: 25 → 28. Reports: 25 → 28. Re-checks: 12.
- Sources: 335 → 358.
- Figure kinds: S16 said five; there are seven (`types.ts:3`).
- NO_SEQUENCE: eight → eleven slugs.
- e2e: `playButton`, `nextButton`, `playToEnd` and the End label are all changed by B17 (section 6).
- Card spots: `spots.ts` lists 17 kinds (`:438`); `figures.test.ts:38` lists eight.

## Not found

- Compare or two-lane mode in any scene driver, figure or lesson (grep `compare`, `lane`, `two-lane` across `src/art`, `src/scenes`, `src/lesson`, `src/content`, non-test).
- Registry entries for RFC 7239, RFC 4301, 4303, 7296, 3948, 4026, 2637, 2616, WireGuard, OpenVPN, NIST SP 800-113, any "what is a VPN" or "what is a proxy" page, any CDN page, any X-Forwarded-For, CONNECT or Via source (`src/content/sources.ts`).
- Prose in checked lessons or glossary groups on: reverse proxy, forward proxy, CONNECT, X-Forwarded-For, Via (except the net-map field), CDN, IPsec, VPN protocols. The one VPN sentence is `firewalls.ts:348`.
- Drawings of a proxy, tunnel, café, eavesdropper, VPN server in `src/art/` or `src/scenes/` (padlock is the only one).
- Any `src/art/scenes/drivers/` folder (drivers are in `src/scenes/drivers/`).
- Any test that pins Proxies' or VPN's content (only the ready/not-ready and the numbers above).
- A "What is a packet" source (S16 noted none either).
