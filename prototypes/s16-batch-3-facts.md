# S16: Networking Concepts' batch 3, Packets, Switch and Load Balancers (job 14, 2026-11-15)

The scout's report (Haiku), on `revamp` at `a783282`, saved by the orchestrator as written (the scout's own rules let it write no file). Paths are repo-relative. Evidence is path:line. Nothing was edited.

Repo root is the checkout folder. Paths are repo-relative. Nothing was edited, built or run. `dist/` was read, not rebuilt. Facts marked "(S15)" are from `prototypes/s15-batch-2-facts.md` and were not re-read this session.

## Summary

- Networking has 15 ready lessons of 20 now: osi-model, ip-address, mac-address, arp, subnetting, router, dhcp, ports, tcp-udp, nat, what-is-dns, what-is-http, what-is-https, what-is-tls, firewalls. The files are in `src/content/lessons/`, and the track lists all 20 at `src/content/tracks/networking.ts:31-80`.
- The three new stops are Packets (stop 2, `networking.ts:32`), Switch (stop 5, `networking.ts:41`) and Load Balancers (stop 19, `networking.ts:79`). Proxies (18, `:78`) and VPN (20, `:80`) stay planned. Once the three ship: 18 ready of 20.
- Sources: 335 registry entries (`grep -c "^    id: "`). Three are kind `ieee`, all added by job 13: `ieee-eui-guidelines` (`sources.ts:2991`), `ieee-ra-faq` (`:2999`), `ieee-802-2024` (`:3007`). No IEEE 802.3, 802.1D or 802.1Q entry exists.
- No switching or bridging standard and no MAC-learning or flooding source is registered. The only switch-related vendor page is Cisco's Dynamic ARP Inspection (`cisco-dai`, `sources.ts:1304`).
- Packet documents registered: RFC 791, 8200, 1122, 9293, 768, 1191, 1812, 792, 826, 894. Not registered: RFC 8201, 8900, 4821, 7098, 2991, 2992, 7042. No "what is a packet" page is registered.
- Load-balancer documents registered: Azure Load Balancer (`sources.ts:457`), Azure Application Gateway (`:625`), Azure Traffic Manager (`:1094`), Azure SNAT and inbound NAT (`:2958`, `:2966`), Cloudflare load-balancing proxy status (`:775`). Not registered: AWS, Google Cloud load balancing, NGINX, HAProxy, F5, Palo Alto and Cisco load-balancer pages.
- No load-balancer vendor host is in `SOURCE_HOSTS` (`sources.ts:31-77`). The allowed vendor hosts include `learn.microsoft.com` and `docs.cloud.google.com`, but not `cloud.google.com`.
- No checked lesson or glossary group speaks of a switch, a hub, a MAC table, flooding, a server pool, health checks or a reverse proxy. `mac-address.ts` has no "switch" line. The "no switch" choice appears only in `prototypes/d10-scene-map.md:40` and the catalogue.
- The scene has five figure kinds. No drawing of a switch, a hub or a pool exists. Web and mail server plates draw racks (`src/art/scenes/net-map.ts:263-265`).
- Lesson 14 changes the count-based tests. Current values are 15 ready, 25 lessons and 25 reports. `e2e/lesson.spec.ts:34` `NO_SEQUENCE` has eight slugs, including `ip-address` and `mac-address`. The e2e Up next chain (`e2e/site.spec.ts:744-754`) will change when Packets and Switch become ready.

## 1 Track position

Track file: `src/content/tracks/networking.ts`. Stop numbers run across parts (`registry.ts`, `number: entries.length + 1`, S15 gave `:82`).

- **Packets**: stop 2, part `big-picture` ("The big picture", part block at `:28-29`), lesson line `:32`. Before it is osi-model (stop 1, `:31`). After it is ip-address (stop 3, `:39`).
- **Switch**: stop 5, part `local-network` ("Addresses & the local network", `:36-37`), lesson line `:41`. Before it is mac-address (stop 4, `:40`). After it is arp (stop 6, `:42`).
- **Load Balancers**: stop 19, part `protect-scale` ("Protecting & scaling traffic", lessons at `:78-80`), lesson line `:79`. Before it is proxies (stop 18, `:78`). After it is vpn (stop 20, `:80`).
- Ready now, by stop: osi-model 1, ip-address 3, mac-address 4, arp 6, subnetting 7, router 8, dhcp 9, ports 10, tcp-udp 11, nat 12, what-is-dns 13, what-is-http 14, what-is-https 15, what-is-tls 16, firewalls 17. The files are `src/content/lessons/<slug>.ts` (`ls`).
- Test that pins the 15 ready pairs: `src/content/registry.test.ts:394-396`.

**Up next chain.** `neighbors()` returns the nearest available entry before and after (`src/content/registry.ts`, `neighbors`, S15 gave `:113-125`). The lesson page's end row shows Up next only when `next` exists (`src/lesson/Explanation.tsx:205-228`).

- Now: osi-model → ip-address (packets not ready); mac-address → arp; ports → nat (tcp-udp is ready, so ports → tcp-udp; tcp-udp → nat); firewalls → none, with the "Lessons 18 to 20 are coming soon" text (`Explanation.tsx:157-170`).
- Pinned now at `src/content/registry.test.ts:391-392`: dhcp → ports, what-is-tls → firewalls.
- After the three ship (derived from the track order and the rule above): osi-model → packets → ip-address → mac-address → switch → arp → subnetting → router → dhcp → ports → tcp-udp → nat → what-is-dns → what-is-http → what-is-https → what-is-tls → firewalls → load-balancers → end (vpn is planned, so `nextPlanned` is true).
- Firewalls would then show Up next "Load Balancers" instead of the "coming soon" line. Load Balancers would show "Lesson 20 is coming soon." (`comingSoon`, `Explanation.tsx:157-170`, when `after === 1`).

**Coming-soon text.** `src/lesson/Explanation.tsx:157-170` (`comingSoon(number, total)`) reads "Lessons N+1 to total are coming soon" or "Lesson total is coming soon". It is shown only when there is no next ready lesson (`Explanation.tsx:225-229`). Asserted at `src/lesson/Explanation.test.tsx:223` and `src/lesson/LessonConsole.test.tsx:324`.

**Catalogue rows**, `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md`:
- `:153` (stop 2): "| 2 | The big picture | Packets | Flow (layers + network) | A file split into packets that travel and are put back in order | Change the file size and watch the packet count change |"
- `:156` (stop 5): "| 5 | Addresses & the local network | Switch | Device table (MAC table) | The switch flooding at first, then learning which device is on which port | Move a laptop to another port, or clear the table, and watch it relearn |"
- `:169` (load balancers, catalogue number 18): "| 18 | Protecting & scaling traffic | Load Balancers | Device table (pool) | Requests spread across servers; health checks | Take a server offline; switch round-robin ↔ least connections |"
- The catalogue's Load Balancers is 18 and the track's is 19. The catalogue's VPN is 19 (`:170`), the track's is 20.

**Scene-map rows and notes**, `prototypes/d10-scene-map.md`:
- Row 2, Packets (`:38`): "**New ability on net-map.** Several tags on the map at once, numbered, taking different ways (the a to d mesh already gives two ways), and arriving out of order. A reassembly tray on the laptop puts them back in order; it could extend the existing `tray` cue. Wrapping is not needed here, since OSI Model covers it. | A file block cut into four numbered slabs, one lit and in flight | large |"
- Row 4, MAC Address (`:40`): "**dhcp figure**, since its laptop, router and phone already share one Wi-Fi with a broadcast ring. It needs one or two more home devices, and each device's 'keeps it / ignores it' light (the phone's 'hears and ignores' exists). No switch, as the catalogue says."
- Row 5, Switch (`:41`): "**A new switch figure**: one switch with four to six ports, a device on each, and flooding as a fan of tags. The **table panel** is the MAC table (port, MAC; `add` and `update` exist). Moving a laptop to another port needs a cable re-plug cue. | A switch box with a row of ports, one port's light lit | large |"
- Row 18 (Proxies, `:46`) and row 19 (Load Balancers, `:47`): "**A new figure**: one balancer in front of a pool of three or four servers, each with a health light. The **table panel** is the pool (server, health, connections). Taking a server offline is an `update` with `miss`. | A balancer fanning out to three servers, one route lit | large |". Row 19 is Load Balancers here; the catalogue says 18.
- Ability list `:27`: "a no-match row."
- Notes `:54`: "The no-match row suits Ports (a closed port) and Switch (an unknown MAC, then a flood)."
- Notes `:56`: "**Compare mode** is the one new ability that two lessons share: TCP/UDP and Proxies."
- Notes `:57`: "**A home with more devices** is wanted by MAC Address, ARP and NAT. The dhcp figure already draws three devices on one Wi-Fi."
- Row 10 (Ports, `:43`) and row 11 (TCP/UDP) are not part of the three, so they are not quoted here.

## 2 Documents

### 2a Registered entries that bear on the topic

Each line gives id, kind, title or short name, and `sources.ts` line of the id.

**Switching, bridging, MAC learning and flooding**
- `rfc-894` (rfc, `:1140`): "A Standard for the Transmission of IP Datagrams over Ethernet Networks".
- `rfc-826` (rfc, `:1132`): "An Ethernet Address Resolution Protocol…".
- `ieee-eui-guidelines` (ieee, `:2991`): EUI, OUI and CID guidelines (PDF).
- `ieee-ra-faq` (ieee, `:2999`): "IEEE Registration Authority FAQs".
- `ieee-802-2024` (ieee, `:3007`): "IEEE 802-2024 page".
- `cisco-dai` (vendor, `:1304`): "Configuring Dynamic ARP Inspection" on Catalyst 9300 switches.
- `cisco-what-is-routing` (vendor, `:2771`). `router.ts:62` cites it under the heading "What are switches and routers?".
- `cisco-how-router-works` (vendor, `:2763`).
- `rfc-9542` (rfc, `:2693`) and `rfc-9724` (rfc, `:1238`), MAC-address documents.
- Not registered: IEEE 802, 802.3, 802.1D, 802.1Q; RFC 7042 (`grep -c "id: 'rfc-7042'"` = 0).

**Packets**
- `rfc-791` (rfc, `:335`): "Internet Protocol". Section anchors use `{n}` (`:341`).
- `rfc-8200` (rfc, `:1123`): IPv6.
- `rfc-1122` (rfc, `:213`): "Requirements for Internet Hosts – Communication Layers".
- `rfc-9293` (rfc, `:308`): TCP.
- `rfc-768` (rfc, `:255`): UDP.
- `rfc-1191` (rfc, `:1471`): "Path MTU Discovery".
- `rfc-1812` (rfc, `:1166`): "Requirements for IP Version 4 Routers".
- `rfc-792` (rfc, `:1256`): ICMP.
- `rfc-6890` (rfc, `:2974`): special-purpose addresses.
- `rfc-2663` (rfc, `:2924`): NAT terminology.
- Not registered: RFC 8201, RFC 8900, RFC 4821, RFC 7098, RFC 2991, RFC 2992 (each `grep -c` = 0). RFC 793 is not registered either.
- "What is a packet" pages: none. Nearest: `cloudflare-network-layer` (`:2827`, "What is the network layer?"), `cloudflare-layer-7` (`:1767`), `paloalto-layer-7` (`:1759`), `microsoft-osi` (`:229`). `microsoft-ndis-packet-filter` (`:3015`) is a Windows driver page.

**Load balancing (every title or URL with "load" or "balanc")**
- `microsoft-azure-lb` (vendor, `:457`): "What is Azure Load Balancer?" (`:460`). Its URL is `learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview`.
- `microsoft-app-gateway` (vendor, `:625`): "What is Azure Application Gateway?".
- `microsoft-traffic-manager` (vendor, `:1094`): "How Azure Traffic Manager Works".
- `microsoft-azure-snat` (vendor, `:2958`) and `microsoft-azure-inbound-nat` (vendor, `:2966`): both Azure load-balancer docs URLs.
- `cloudflare-lb-proxy-modes` (vendor, `:775`): "Proxy status" (URL under `developers.cloudflare.com/load-balancing/`).
- Not registered: AWS, Google Cloud Load Balancing, NGINX, HAProxy, F5, Palo Alto and Cisco load-balancer pages, RFC 2991, RFC 2992, RFC 7098, and any ECMP document (`grep -n -i "ecmp"` finds nothing).

### 2b Allowed hosts

`src/content/sources.ts:31-77`, `SOURCE_HOSTS: Record<SourceKind, readonly string[]>`:
- `rfc` (`:32`): `['www.rfc-editor.org', 'datatracker.ietf.org']`
- `ieee` (`:33`): `['standards.ieee.org', 'ieeexplore.ieee.org']`
- `iana` (`:36`): `['www.iana.org', 'www.internic.net']`
- `itu` (`:39`): `['www.itu.int']`
- `standards-body` (`:44`): the three WHATWG hosts
- `government` (`:46`) and `security-reference` (`:48`): `[]`
- `internet-registry` (`:51`): `['www.icann.org']`
- `community` (`:57`): `['canonical.com', 'www.baeldung.com']`
- `vendor` (`:61-74`): `learn.microsoft.com`, `www.cisco.com`, `developers.cloudflare.com`, `docs.paloaltonetworks.com` (`:61`); `support.microsoft.com`, `support.google.com`, `letsencrypt.org` (`:62`); `www.cloudflare.com` (`:65`); `www.paloaltonetworks.com`, `knowledge.workspace.google.com` (`:68`); `man.openbsd.org` (`:71`); `docs.cloud.google.com` (`:74`)
- `cert-objectives` (`:76`): comptia and cisco learning hosts.

Load-balancer vendor hosts from the list in the task:
- Not allowed: `aws.amazon.com`, `docs.aws.amazon.com`, `cloud.google.com`, `nginx.org`, `docs.nginx.com`, `www.haproxy.com`, `docs.haproxy.org`, `www.f5.com`. None appears in `SOURCE_HOSTS`.
- Allowed: `learn.microsoft.com` (`:61`), `docs.cloud.google.com` (`:74`), `developers.cloudflare.com` (`:61`).

The check's messages, in `defineSources` (`sources.ts:176-182`, S15 gave these lines): "no host is allowed yet for <kind>; add <host>, if it is the publisher's own, to SOURCE_HOSTS in the change that first cites it" and "<host> is not an allowed host for <kind> (allowed: …)". `"No wildcards."` is at `:30`.

### 2c Entry shape, and `defining`

Schema: `sourceEntrySchema` (`sources.ts:79-89`): `id` (slug), `kind` (one of `SOURCE_KINDS`), `short` (no ": "), `title`, `publisher`, `url` (https), optional `anchor` (the url plus `#…{n}`), optional `version` (required for `cert-objectives`).

`ieee` example, `sources.ts:2991-2996`:
```
    id: 'ieee-eui-guidelines',
    kind: 'ieee',
    short: 'IEEE RA EUI guidelines',
    title: 'Guidelines for Use of Extended Unique Identifier (EUI), Organizationally Unique Identifier (OUI), and Company ID (CID)',
    publisher: 'IEEE Registration Authority',
    url: 'https://standards.ieee.org/wp-content/uploads/import/documents/tutorials/eui.pdf',
```
Vendor example, `sources.ts:456-462`: `id: 'microsoft-azure-lb'`, `kind: 'vendor'`, `short: 'Microsoft Azure'`, `title: 'What is Azure Load Balancer?'`, `publisher: 'Microsoft'`, `url: 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview'`.

`defining` is not a registry field. It is a flag on a citation: `cite(source, section, { url?, defining? })` (`docs/content-model.md:56`). Its meaning, `docs/content-model.md:72`: "Mark a citation `defining: true` when its source is the current document that defines the thing the claim describes: its message format, a field, a value, a procedure, or a layer. A field's exact size, for example, is defined only in its own RFC. A claim with a defining-standard citation may rest on that one source." The check is in `src/content/cited.ts:114-119`. Examples: `what-is-udp.ts:13` ("RFC 768 defines UDP, so its citations are marked as the defining standard") and `arp.ts:30`.

## 3 What each must agree with

Quotes are verbatim. Lines are path:line.

### mac-address.ts (the lesson already covers frames on a shared Wi-Fi)
- `:6-8`: "A home Wi-Fi with a router, a laptop, a phone and a TV. The laptop sends a frame to the router: every device in range hears it, and only the router, whose MAC address is on it, keeps it. The laptop's own address splits into two halves, an organization's number (the OUI) and the number of one card."
- `:9`: "router sends a frame to everyone (ff:ff:ff:ff:ff:ff): every device keeps it."
- `:40-42`: `FAQ = 'ieee-ra-faq'`, `FAQ_OUI` = "What is an Organizationally Unique Identifier (OUI)?" (the OUI is cited here).
- `:84`: `MAC = { router: '00:00:5E:00:53:01', laptop: '00:00:5E:00:53:10', phone: '00:00:5E:00:53:11', tv: '00:00:5E:00:53:12' }`.
- `:147`: "Every device hears the frame: the router, the phone and the TV."
- `:164`: `info: 'Frame to ff:ff:ff:ff:ff:ff (everyone)'`.
- `:417`: "Many devices share one Wi-Fi and hear every frame, so each frame has to say which device it's for."
- `:463`: "each packet travels in a frame, such as a Wi-Fi or Ethernet frame, that names the MAC address it's for and the one it's from".
- `:522`: "Wi-Fi is radio, so every device in range hears the frame. The TV just doesn't keep it."
- Not found in this file: "switch", "hub", "flood", "MAC table", "forwarding".

### arp.ts
- `:7-10`: "The laptop has a packet for example.net, so its next stop is the router, and to put the packet in a frame it needs the router's MAC address."
- `:16`: "No standard places ARP at an OSI…"
- `:129`: `destination: 'ff:ff:ff:ff:ff:ff'`.
- `:262`: `{ label: 'Sent to', value: 'everyone: ff:ff:ff:ff:ff:ff', … }`.
- `:427`: "On your own network, devices deliver frames by MAC address, so an IP address alone isn't enough to send."
- `:479`: "each IP packet travels in a frame, such as an Ethernet frame, addressed to the next device's MAC address".

### osi-model.ts
- `:281`: "TCP, which is reliable and also puts data back in order and controls its flow, and UDP, a connectionless "datagram" service."
- `:288`: `{ label: 'Can', value: 'split the data into pieces and keep them in order', … }`.
- `:314`: "IP itself guarantees no delivery: data may arrive out of order or not at all".
- `:603`: "A **segment** is a TCP header followed by application data. An IP **datagram** is an IP header followed by transport data; it travels as one **packet**, or as several when fragmented. A **frame** is a link-layer header followed by a packet."

### what-is-ip.ts
- `:344`: "The private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16."
- No "fragment", "MTU", "switch" or "frame" line outside citations in this file.

### what-is-tcp.ts
- `:144`: `value: 'a three-way handshake'`.
- `:154`: `value: 'segments, usually up to 1460 bytes of data'`.
- `:382`: "The server sends the page back in three pieces of 1460 bytes, called **segments**. Piece 1 arrives. Piece 2 is dropped on the way, perhaps by a busy router."
- `:385`: "Routers drop packets when their queues are full. That's normal, not a fault."
- `:389`: "The receiver keeps out-of-order segments in a buffer…"

### what-is-udp.ts
- `:144`: `{ label: 'Starts with', value: 'nothing: no handshake', … }`.
- `:280`: "UDP has no retransmission at all."

### tcp-udp.ts (already in the checked set)
- `:7-10`: "Your browser fetches a page from example.net over TCP: a handshake first, then three pieces; piece 2 is lost, piece 3 waits… Sam's packet 2 is lost, nobody sends it again…"
- `:74-77`: `LAPTOP = '192.168.1.100'`, `WEB = '203.0.113.80'`, `VOICE = '203.0.113.90'`, `DASH = '—'`.
- `:188-240`: tag labels: `'PIECE 1'` (`:188`), `'PIECE 2'` (`:200`, `:240`), `'PIECE 3'` (`:212`), `'SYN'` (`:139`), `'ACK'` (`:162`).
- `:203`: "Piece 2 is lost on the way, perhaps dropped by a busy router."
- `:298`: "Sam's packet 2 is lost on the way, perhaps dropped by a busy router."

### router.ts
- `:24`: "RFC 1812 sets the requirements for IPv4 routers, so it defines what a router does with a packet."
- `:62`: `const CISCO_L3 = vendor('cisco-what-is-routing', 'What are switches and routers?', …)`. This is the only "switch" word in the file.
- `:131-132`: "Router a has no route for 192.0.2.77, not even a default route, so it drops the packet."
- `:392`: "Before passing the packet on, a router finds the link-layer address of the next hop and puts the packet in a new frame for that link."

### dhcp.ts
- `:100-106`: `LAPTOP_MAC = '00:00:5E:00:53:10'`, `PHONE_MAC = '00:00:5E:00:53:11'`, `NO_ADDRESS = '0.0.0.0'`, `EVERYONE = '255.255.255.255'`, `ROUTER_IP = '192.168.1.1'`, `LAPTOP_IP = '192.168.1.100'`.
- `:258`: `{ label: 'MAC destination', value: 'ff:ff:ff:ff:ff:ff (everyone)', … }`.
- `:568`: "the broadcast goes to the hardware address ff:ff:ff:ff:ff:ff, which means everyone".
- `:381` (what-is-dhcp, S15 rewrote lines) and `:526` (dhcp): "the Wi-Fi router is the DHCP server, with a pool of addresses to lend". The word "pool" appears here and in `what-is-dhcp.ts:851`.

### ip-address.ts
- `:104-108`: `LAPTOP = '192.168.1.10'`, `PRINTER = '192.168.1.20'`, `ROUTER_INSIDE = '192.168.1.1'`, `ROUTER_LINK = '203.0.113.6'`, `DASH = '—'`.
- `:70-71`: Cloudflare network-layers and Microsoft OSI constants (the badge sources).

### firewalls.ts, what-is-http.ts, what-is-https.ts, what-is-dns.ts, what-is-tls.ts, ports.ts, nat.ts, subnetting.ts
- `firewalls.ts:75` (a citation's wording, quoted by the lesson): "These firewalls scrutinize each packet of data".
- `firewalls.ts:565`: "A packet filter reads addresses and ports (layers 3 and 4)…".
- `what-is-http.ts:658`: "HTTP/2 sends the same meaning as binary frames".
- `what-is-https.ts:219`: "…which many browsers and phones can switch on." (verb "switch", not a device).
- `nat.ts:293`, `nat.ts:451`, `nat.ts:484` (S15 quotes, not re-read): private-address lines.
- `what-is-icmp.ts:613`: "Firewalls often block ICMP, but blocking type 3 code 4 breaks path MTU discovery." This is the only MTU line in the checked lessons (`grep -rn "MTU"` finds only this and `what-is-icmp.ts:82, :606`).
- No checked lesson or glossary group mentions "reassembly", "reassemble", or "load balancer", "server pool", "health check", "reverse proxy", "hub", "MAC table", "forwarding table" or "flooding". `grep -rn -i` over `src/content/lessons/*.ts` and `src/content/glossary-groups/*.ts` finds only: `what-is-tcp.ts:186` "SYN flood" (an attack), `what-is-dhcp.ts:797` "Servers hand out addresses from a pool (a scope)", and `tcp-udp.ts:59` (the Azure link).

### Glossary: `src/content/glossary-groups/packets.ts` (job 10, batch 1, 12 terms)
- `:116` (Frame): "A frame is the unit of data that a link layer protocol, such as Ethernet, sends: a link-layer header followed by a packet."
- `:121`: "A router takes the packet out of the frame it arrived in and sends it on in a new frame for the next link."
- `:132` (Packet): "A packet is the unit of data at IP's layer: an IP header followed by data."
- `:137`: "It may be a whole IP datagram, or a fragment of one that was split to cross a network that only takes smaller packets."
- `:149` (Segment): "A segment is the unit of data TCP sends: a TCP header followed by application data."
- `:154`: "TCP splits an application's stream of bytes into segments, and each segment travels inside an IP datagram."
- `:166` (Datagram): "A datagram is a message that travels on its own: the network handles each one separately, with no connection set up first."
- `:176`: "Delivery is not guaranteed: a datagram may arrive damaged, duplicated, out of order or not at all."
- `:237-241` (Forwarding): "Forwarding is what a router does with a packet that is not addressed to it…"
- Terms in the group: Protocol data unit, Header, Frame, Packet, Segment, Datagram, IP, IP header, Router, Forwarding, Routing decision, ICMP. No term named Switch, Bridge, MAC table, Flooding, Fragmentation or Load balancer.
- `src/content/glossary-groups/layers.ts` holds the OSI and layer terms (`:67-288`).

### Example data already in use (reuse list)

- MACs: `00:00:5E:00:53:01` router (`mac-address.ts:84`, `arp.ts`, `dhcp.ts`), `…:10` laptop (`mac-address.ts:84`, `dhcp.ts:100`), `…:11` phone (`mac-address.ts:84`, `dhcp.ts:101`), `…:12` TV (`mac-address.ts:84`, new in `mac-address.ts:14-15`), `ff:ff:ff:ff:ff:ff` broadcast.
- Private IPs: `192.168.1.100` laptop (`dhcp.ts:106`, `tcp-udp.ts:74`), `192.168.1.1` router (`dhcp.ts:105`), `192.168.1.101` phone (`src/art/scenes/net-map-layers.ts:66`, `NET_MAP_PHONE_ADDR`).
- Public IPs: `203.0.113.80` example.net web (`tcp-udp.ts:75`, `net-map-layers.ts`), `203.0.113.90` voice server (`tcp-udp.ts:76`, `net-map-layers.ts:106`), `198.51.100.7` techconcepts.app (`net-map-layers.ts:104`), `192.0.2.77` unrouted destination (`router.ts:70`), `203.0.113.21` and `203.0.113.22` (files and ssh hosts, `net-map-layers.ts`).
- Names: example.net, TECHCONCEPTS.APP (`net-map-layers.ts:104`), CALL.EXAMPLE.NET (`:106`), SMTP.EXAMPLE.NET (`smtp:out`), MX.EXAMPLE.ORG (`smtp:in`), EXAMPLE.NET.
- Ports: 80 and 443 (`net-map-layers.ts`), 53 (DNS, `what-is-dns.ts`), 67 and 68 (DHCP, `what-is-dhcp.ts`), 993 and 995 (mailboxes, `net-map-layers.ts`).

## 4 Scene parts

### (a) Figures: list, files and line counts

- `src/lib/figures.ts:7-19`: `FIGURES` map (lesson slug → card spot) for osi-model, subnetting, dhcp, firewalls, router, arp, ports, nat, ip-address, mac-address, tcp-udp. The file is 37 lines. `:24-30` gives How the Internet Works lessons a name tile. `:32` throws if a ready lesson has no figure.
- `src/art/scenes/types.ts:2`: `export type FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map' | 'osi';`
- `src/content/schema.ts:37`: `figureIdSchema = z.enum(['dhcp', 'subnet', 'firewall', 'net-map', 'osi'] satisfies FigureId[])`. Lesson field `figure: figureIdSchema` at `schema.ts:411`.
- `src/art/scenes/index.ts`: `DRAW: Record<FigureId, () => DrawnFigure>` maps each id to its drawer (dhcp, subnet, firewall, net-map, osi).
- `src/scenes/drivers/index.ts`: `DRIVERS: Record<FigureId, DriverModule>`.
- `src/art/scenes/parts.ts:11-82`: `FIGURE_PARTS` (places, cues, args, layers, board, start) per figure.
- Figure files and line counts:
  - `src/art/scenes/dhcp.ts` 284; `src/art/scenes/dhcp-frames.ts` 12
  - `src/art/scenes/subnet.ts` 293; `src/art/scenes/firewall.ts` 256; `src/art/scenes/osi.ts` 169; `src/art/scenes/osi-stacks.ts` 30
  - `src/art/scenes/net-map.ts` 497; `src/art/scenes/net-map-layers.ts` 166
  - `src/art/scenes/parts.ts` 82; `src/art/scenes/types.ts` 30; `src/art/scenes/index.ts` 20
  - Drivers: `src/scenes/drivers/dhcp.ts` 279, `net-map.ts` 553, `subnet.ts` 324, `firewall.ts` 432, `osi.ts` 217.
- Card spots: `src/art/figures/spots.ts` 366 lines (see (f)).

How a new figure kind is added. Two commits show the pattern:
- `de40b96` ("feat: DHCP in the new console") touched: `src/art/figures/figures.test.ts`, `src/art/scenes/{dhcp.css, dhcp.test.ts, dhcp.ts, index.ts, parts.ts}`, `src/scenes/drivers/{dhcp.test.ts, dhcp.ts, index.ts}`, `src/test/figure-hash.ts`, and the DHCP lesson files.
- `ed6711f` ("feat: Subnetting as a Watch lesson with the bits board") touched: `src/art/scenes/{index.ts, parts.ts, subnet.css, subnet.test.ts, subnet.ts}`, `src/lesson/ScenePanel.tsx`, `src/lesson/panels/UnitPanel.tsx`, `src/scenes/drivers/{index.ts, subnet.ts, subnet.test.ts}`, `src/content/helpers/subnet-events.ts`, `src/content/test-fixtures.ts`, `src/test/lesson-references.ts`, `src/content/registry.test.ts`, and lesson tests.
- Neither commit changed `src/content/schema.ts` (`git show --stat de40b96 ed6711f`).
- Validators and tests that name the figure list:
  - `src/art/scenes/parts.test.ts:7`: `expect(Object.keys(FIGURE_PARTS).sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet'])`. This must change for a new kind.
  - `src/art/scenes/index.test.ts:10`: the same five ids.
  - `src/content/define.ts:323`: `parts: FIGURE_PARTS[l.figure]`.
  - `src/content/define.ts:255-275`: the net-map-only validator (phone and layers).
  - `src/content/test-fixtures.ts:434`: `figure: figureIdSchema`.
  - `src/art/figures/figures.test.ts:56-80`: the hash table `EXPECTED`.

### (b) The `table` panel

- Event fields, `src/content/schema.ts:197-219` (`tableEventSchema`): `op` (`:201`: `'add' | 'update' | 'remove' | 'match' | 'clear' | 'replace'`), `row`, `rows`, `key` (may be `''` for a `match` that found nothing), `keys` (a `match` with at least two candidates), `by` (a `replace` names whose table it is now), `miss` (`:219`, an `add` or `update` marks the row it leaves), `summary`.
- Table definition, `schema.ts:228-265`: `columns` (a `prose` flag and `width`), `keyColumn` (`:249`), `hiddenKey` (for UDP's voice packets), `markLabel` (`:257`: "The word a marked row says… FTP's 'exposed'"), `initialRows`, `empty`.
- Engine, `src/engine/tables.ts`: `TableState` (`:30-43`) with `highlight`, `missed`, `by`, `candidates`, `matches`, `noMatch` (`:35-40`); `applyTableEvent` (`:56`); `add`/`update` marking (`:59-61`); `match` (`:84`); `noMatch` set when `e.key === ''` (`:123`).
- Panel, `src/lesson/panels/TablePanel.tsx`: `markLabel` (`:34`), key lookup (`:65-66`), the no-match row (`:96-101`).
- Example: `src/content/lessons/mac-address.ts:89-99`, the `frames` table ("Who keeps the frame", `keyColumn: 'mac'` at `:98`, columns device, MAC address, "This frame"). Its events at `:130-134` set "Sent it" / "Hears it" with `replace`.
- Other tables: `ports.ts:98` (`keyColumn: 'port'`), `router.ts:79` (`'network'`), `nat.ts:89` (`'out'`), `arp.ts:89` (`'ip'`), `dhcp.ts:198` (`'ip'`).

### (c) `net-map`

- **Several tags at once: no.** Each message has one tag element, chosen by its label length: `tags = Array.from({ length: NET_MAP_TAG_MAX }, …)` (`src/art/scenes/net-map.ts:457`; driver `src/scenes/drivers/net-map.ts:219`, `tagFor` at `:256`). `NET_MAP_TAG_MAX = 16` (`src/art/scenes/net-map-layers.ts:54`). The drawing's comment says "one for each length, as only one rides at a time" (`net-map.ts:373`).
- **Messages play one after another**: the driver's `play` (`drivers/net-map.ts:423`) awaits each event's animation (`:467`, `:474`, `:490`).
- **Numbering: none in the figure.** A tag shows the event's `tag` text (`messageEventSchema`, `schema.ts:147`: "The words on the moving tag."). Lessons write numbers into the text: `'PIECE 1'`, `'PIECE 2'`, `'PIECE 3'` (`tcp-udp.ts:188, :200, :212`).
- **Routes, mesh (a to d)**: internet routers `N = { isp, a, b, c, d }` (`net-map.ts:44`). Cables `LINKS = [isp-a, isp-b, isp-d, a-b, b-c, b-d, c-d]` (`net-map.ts:45`). `hops()` finds the shortest path between two routers (`:~220-230`). `routesOf` builds every ordered pair of places (`net-map.ts:466-480`). A route with no path throws `no route ${from} → ${to}` (`:243`).
- **Places**: `NET_MAP_BASE_PLACES = ['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd', 'phone']` (`net-map-layers.ts:60`). No switch place. `NET_MAP_ROUTERS = ['isp', 'a', 'b', 'c', 'd']` (`:69`). Places are allowed through `FIGURE_PARTS['net-map'].places` (`parts.ts:45`).
- **`tray` cue**: "`tray <site> <on|off>`: a letter waiting on a mail server's tray, or gone from it (it leaves as it is sent)" (`src/scenes/drivers/net-map.ts:24`). Parsed at `:90` and `:306-309`. Lit on a site's `holds` map (`:344`). "A letter leaves its tray as it is sent, not when it lands" (`:450-452`).
- **`show phone`**: `NET_MAP_OPTIONAL = ['phone']` (`net-map-layers.ts:63`). `show` is a cue (`parts.ts:59`), and its arg list is `NET_MAP_OPTIONAL` (`parts.ts:61`). The phone sits on the home plate (`src/art/scenes/net-map.ts:42`, "The phone, lying on the table at home in front of the router").
- **Sequence view**: `src/scenes/SequenceView.tsx` (`ROW_H = 42`, `:24`); the lesson's `views` (`schema.ts:300`, S15); the view switch in `src/lesson/ScenePanel.tsx` (S15: `:22`, `:65`, `:134-138`). `e2e/lesson.spec.ts:34` `NO_SEQUENCE` lists the lessons with no sequence view.
- **Slot letters**: server plates use `SLOT` `E`, `SE`, `N` (`net-map-layers.ts:15` is the type `'E' | 'SE' | 'N'`). Uses: `E` (most layers, e.g. `:80`, `:87`), `SE` (`smtp:in`, `:132`), `N` (`nat:stranger`, `:147`; `tcp-udp:voice`, `:157`). The drawing's `SLOT` also defines `NE` (`src/art/scenes/net-map.ts:38`), but no layer uses it and the type does not allow it. So `NE` is free in the drawing and not allowed in the data.

### (d) The `dhcp` figure: `frames` start, ring and verdict lights (job 13)

- The frames start is `start: [{ cue: 'frames' }]` (`src/content/lessons/mac-address.ts:213`). The figure's `FIGURE_PARTS.dhcp` has `cues: { frames: 'flag' }`, the `tv` place, and `start: true` (`parts.ts:12`).
- `src/scenes/drivers/dhcp.ts:15-17`: "A scene that starts with the `frames` cue (MAC Address) shows the same plate as a home Wi-Fi with a TV in place of the lease board. Every frame there rings out from whoever sends it, each device says what it did with the frame in the air (a verdict beside its MAC address)…"
- Verdict words, `dhcp.ts` driver (`:46`): `{ 'Sent it': 'sent', 'Hears it': 'hears', 'Keeps it': 'keeps', 'Ignores it': 'ignores' }`.
- MAC keys, `:43`: router `…:01`, laptop `…:10`, phone `…:11`, tv `…:12`.
- Tags, `:75`: `['discover', 'offer', 'request', 'ack', 'renew', 'frame', 'to-all']`, so a `to-all` tag exists.
- Ring from the sender in the frames setup, `:202-211`: `const spreads = event.kind === 'broadcast' || frames;` and the ring is placed at `ringAt[from]`.
- Lights and verdicts: `lightsOf` (`:95`) lights the laptop, phone, tv and router LEDs; `verdict()` (`:169`) writes a word in `dh-v-<place>`.
- Phone ignore light, `:24` ("which lights up and ignores it") and `:59` (`dh-ignore`).
- Drawing: `dhcp.ts:17` "The broadcast ring's widest radius"; ring element `:173`.
- Whether a flood could be drawn: the driver draws one tag per event and one ring origin per event (`:202-211`, `:219`). It has no code for several tags or copies at once. The frames table has one row per device and one verdict cell per device.

### (e) Drawings of a switch, a hub, a server rack or a pool

- Switch, hub, pool, balancer: none in `src/art/` or `prototypes/` (grep for "switch", "hub", "rack", "pool", "balancer" finds only UI words, the `switches/lan` URL, and comments).
- Racks: `src/art/scenes/net-map.ts:169` `function rack(R, i)`; `:263` "A web server: two racks at the back, the page on its dock."; `:265` draws two rack boxes. The mail plate's callout "points at the top of its rack" (`src/art/scenes/net-map-layers.ts:39`, `anchorTop` at `:40`, used at `:127`).
- Mail server box: `src/art/scenes/net-map.ts:319` (a box with two slots and an LED).
- Network card drawing: `prototypes/d12-mac-address-spot.svg`.

### (f) Card spots

- `src/art/figures/spots.ts`: `SPOTS` (`:360`) = `['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp']`. `DRAW` (`:363`). The spot functions: `routerSpot` (`:183`), `arpSpot` (`:212`), `portsSpot` (`:248`), `natSpot` (`:270`), `ipSpot` (`:292`), `macSpot` (`:309`), `tcpUdpSpot` (`:338`). Each returns `figure(...)`.
- Test: `src/art/figures/figures.test.ts`. `EXPECTED` (`:56`) holds SHA-256 hashes, with IP, MAC and TCP/UDP pinned at `:79`. `test('the figures match the mockups')` (`:86`). `test.each` for D12 at `:141-146`: `expect` each spot against `prototypes/d12-<kind>-spot.svg` (`d12-ip-address-spot.svg`, `d12-mac-address-spot.svg`, `d12-tcp-udp-spot.svg`): one lit part, the lights, the words, and the `viewBox`.
- A new card kind needs: a `SPOTS` entry, a `DRAW` entry, a spot function, an `EXPECTED` hash, a `prototypes/d12-*` style `.svg` for its test, and a `FIGURES` line in `src/lib/figures.ts:7-19` (or a name tile).

## 5 Tests that count ready lessons or stops

Current values as read this session. "(S15)" marks an earlier value not re-read.

Unit tests:
- `src/content/registry.test.ts:391-392`: dhcp → ports; what-is-tls → firewalls.
- `src/content/registry.test.ts:394-396`: the 15 ready `[slug, number]` pairs (`osi-model 1, ip-address 3, mac-address 4, arp 6, subnetting 7, router 8, dhcp 9, ports 10, tcp-udp 11, nat 12, what-is-dns 13, what-is-http 14, what-is-https 15, what-is-tls 16, firewalls 17`, the rest of the line not re-read).
- `src/lib/tracks-page.test.ts:26` `entries` 20; `:28` `known` **15**; `:30` the slots (art1, art3, art4 …, art17) built from `art${e.number}`.
- `src/lib/track.test.ts:19-24`: ready per part `[1, 3, 3, 4, 3, 1]` (lessons per part `[2, 4, 3, 4, 3, 4]`, with `packets` at stop 2 in part 1); `:28-29`: 20 numbers and the 15 ready titles; `:30`: `expect(all[1]).toEqual({ ready: false, key: 'packets', n: '02', title: 'Packets' })`. This line fails once Packets is ready.
- `src/lib/home.test.ts:127-128`: "Home says 14 lessons and 15 of 20 lessons ready" (`['14 lessons', '15 of 20 lessons ready']`).
- `src/lib/checked.test.ts:7-8`: `{ checked: 25, total: 25 }`, "the four lessons Networking shares with the tour count once: 25 ready, 25 checked".
- `src/lib/glossary-site.test.ts:6-7`: `lessons` length 25 and 25 distinct.
- `src/scripts/about-page.test.ts:38-43`: "lessons ready" is the distinct count, `'25'`.
- `src/content/factcheck/reports.unchanged.test.ts:20-22`: "there are twenty-five lesson reports and ten re-checks" (`25` and `10`).
- `src/lesson/Explanation.test.tsx:215-231` and `src/lesson/LessonConsole.test.tsx:314-324`: "Lessons 18 to 20 are coming soon." (`:223`, `:324`); `Explanation.test.tsx:231` asserts no "for now" or "coming soon" at a track's end.
- `src/components/hub/TrackRoute.test.tsx:75` (S15): `entries.length - ready.length`.

E2E specs:
- `e2e/support.ts:15-30`: `LESSONS_ENV`, `readyLessons()` (dynamic, from the global setup), `requireLessons`.
- `e2e/site.spec.ts:263`: `['14 lessons', '15 of 20 lessons ready']`; `:265` tour `toHaveCount(14)`; `:267` networking `toHaveCount(15)`.
- `e2e/site.spec.ts:522`: test name "0 of 20 lessons done · 15 ready"; `:527`: that strip text.
- `e2e/site.spec.ts:580`: "Networking lists 20 stops in its parts, 5 Not ready yet…"; `:593`: `readyStops(page)` `toHaveCount(15)`; `:594`: the 15 titles; `:599`: soon stops "Not ready yet".
- `e2e/site.spec.ts:612`: "0 of 20 lessons done · 15 ready"; `:618-620`: "Lessons not ready yet stay on the route…".
- `e2e/site.spec.ts:650-653`: tour "0 of 14"; closing line.
- `e2e/site.spec.ts:699`: `readyStops` `toHaveCount(NETWORKING_LESSONS.length)`.
- `e2e/site.spec.ts:723-725`: About "lessons ready" `'25'`.
- `e2e/site.spec.ts:729-735`: "Lesson 13 of 20" (dns), "All 20 lessons", "Lesson 6 of 14" (tour).
- `e2e/site.spec.ts:738-754`: the Up next test. Pairs asserted at `:740` (subnetting → router), `:742` (dhcp → ports), `:744` (`[['osi-model', 'ip-address', /IP Address/], ['ip-address', 'mac-address', …], ['mac-address', 'arp', /ARP/], ['ports', 'tcp-udp', /TCP\/UDP/], ['tcp-ud…` continuing to nat), `:749` (what-is-tls → firewalls), `:751-752` (the tour copy has no firewalls link), `:754` (`'Lessons 18 to 20 are coming soon.'` on firewalls).
- `e2e/site.spec.ts:767`, `:775-806`: "1 of 20 lessons done · 15 ready" (strip); `:791` `['14 lessons', '15 of 20 lessons ready']`; `:800` the first ready lesson not done.
- `e2e/lesson.spec.ts:34`: `NO_SEQUENCE = new Set(['subnetting', 'osi-model', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address'])` (eight). Used at `:75`, `:186-198`. Not in the set: tcp-udp (it has a sequence view) and the three new lessons (not yet written).
- `e2e/batch2.ts`: `:2` imports `DESKTOP, PHONE, playToEnd, RUN_TIMEOUT` from `./batch1`; `:5` re-exports them and `checkCard, onlyInDesktopDark`; defines `Watched` (`:8-16`) and `watch()` (`:18-…`) for the three D12 lessons' page checks.
- `e2e/ip-address.spec.ts:2`, `e2e/mac-address.spec.ts:2`, `e2e/tcp-udp.spec.ts:2`: import `checkCard, DESKTOP, onlyInDesktopDark, playWatched, RUN_TIMEOUT` from `./batch2` (mac also `PHONE, playToEnd`; ip also `checkPhoneTab`).
- What these share: `batch2.ts` builds on `batch1.ts` and exports the same helpers. `arp`, `nat`, `ports` and `subnetting` specs import `./batch1` directly (`e2e/arp.spec.ts:2`, `e2e/nat.spec.ts:2`, `e2e/ports.spec.ts:2`, `e2e/subnetting.spec.ts:2`).
- `e2e/tcp-udp.spec.ts:30`: `.tpanel tbody tr` `toHaveCount(3)`; `:33` `.nm-conn` count 1; `:38` dropped log rows 2.
- `e2e/mac-address.spec.ts:50`: "the built page already draws the frames setup, so with JavaScript off…".

## 6 Collision points

Files that three lesson branches and one scene builder would all touch:
- `src/content/sources.ts`: entries are appended after `microsoft-azure-inbound-nat` (`:2966`) and before `microsoft-ndis-packet-filter` (`:3015`). The file is 3059 lines; the list in `src/content/sources.test.ts:236` (`expect(Object.keys(SOURCES)).toEqual([`) holds every id in order.
- `src/content/sources.ts:31-77` (`SOURCE_HOSTS`): a load-balancer vendor host would go here.
- `src/lib/figures.ts:7-19` (`FIGURES`): one line per card.
- `src/art/figures/spots.ts:360` (`SPOTS`), `:363` (`DRAW`), and new functions after `natSpot` (`:270`).
- `src/art/figures/figures.test.ts:56-80` (`EXPECTED`), `:141-146` (`test.each`, D12).
- `src/art/scenes/parts.ts:11-82` (`FIGURE_PARTS`), `src/art/scenes/parts.test.ts:7`, `src/art/scenes/index.test.ts:10`, `src/content/schema.ts:37`, `src/art/scenes/types.ts:2`.
- `src/art/scenes/net-map-layers.ts` (layer keys, `NET_MAP_LAYERS` at `:88-…`; test `src/art/scenes/net-map-layers.test.ts:8` and `:74`), `src/art/scenes/net-map.ts` (drawing; `SLOT` at `:38`), `src/scenes/drivers/net-map.ts` (cues; `:24` doc).
- `src/content/registry.test.ts:41-45` (`SLUGS`, already lists the three), `:391-396` (ready pairs).
- Count tests: `src/lib/track.test.ts:16-30`, `src/lib/tracks-page.test.ts:26-30`, `src/lib/home.test.ts:127-128`, `src/lib/checked.test.ts:7`, `src/lib/glossary-site.test.ts:6-7`, `src/scripts/about-page.test.ts:38-43`, `src/content/factcheck/reports.unchanged.test.ts:20-22`, `src/lesson/Explanation.test.tsx:215-231`, `src/lesson/LessonConsole.test.tsx:314-324`.
- `e2e/site.spec.ts` (`:263-267`, `:522-527`, `:580-612`, `:723-735`, `:738-754`, `:791-807`) and `e2e/lesson.spec.ts:34` (`NO_SEQUENCE`).
- Shared test fixture: `src/content/test-fixtures.ts` (`:9`, `:434`), used by many factcheck tests through `vi.mock('…/parts')`.
- Shared engine and panels, if a new panel or cue is added: `src/engine/tables.ts`, `src/lesson/panels/TablePanel.tsx`, `src/scenes/driver.ts`, `src/scenes/ScenePanel` (`src/lesson/ScenePanel.tsx:7`).

Not collisions: `src/content/lessons/<slug>.ts`, `docs/fact-checks/<slug>.md`, `src/content/glossary-groups/packets.ts` (already exists and is a shared glossary group, so a new term touches it).

## 7 Sizes

Line counts (`wc -l`):
- `src/content/lessons/tcp-udp.ts`: 726
- `src/content/lessons/mac-address.ts`: 575
- `src/content/lessons/arp.ts`: 580
- `src/content/lessons/router.ts`: 645 (S15 listed 645 as a baseline)
- `src/art/scenes/net-map.ts`: 497
- `src/art/scenes/net-map-layers.ts`: 166
- `src/art/scenes/dhcp.ts`: 284 (figure); `src/scenes/drivers/dhcp.ts`: 279 (driver)
- `src/art/figures/spots.ts`: 366
- `src/lib/figures.ts`: 37
- `src/art/scenes/parts.ts`: 82
- `src/art/scenes/index.ts`: 20

Page budget script: `scripts/check-budgets.mjs`, run by `npm run build` (`package.json:11`) and as `npm run budgets` (`package.json:17`).
- `scripts/check-budgets.mjs:2-3`: "every page's HTML is at most 250 KB gzipped; on every lesson page, the JavaScript it loads is at most 200 KB gzipped in all."
- `scripts/check-budgets.mjs:17`: `BUDGETS = { html: 250_000, lessonJs: 200_000 }` (bytes, gzip, 1 KB = 1,000 bytes).

Build output `dist/` exists (`dist/networking/`, `dist/_astro/`, dated Nov 15 14:05). It was not rebuilt. It holds ip-address, mac-address, tcp-udp, arp and others. It does not hold packets, switch or load-balancers yet.
- Raw sizes of Networking pages (`dist/networking/<slug>/index.html`): arp 1,202,417 bytes; tcp-udp 1,199,806; what-is-tls 1,180,100; ports 1,152,105; router 1,156,874.
- Gzip (`gzip -c | wc -c`, same method as the budget script's default level): arp 130,535; tcp-udp 132,477; ip-address 58,942; mac-address 49,338. Under the 250,000 HTML budget.
- Lesson JS: `dist/_astro/LessonConsole.CVqsaP6v.js` 90,798 bytes raw, 28,804 gzip; `dist/_astro/client.Cd-EeyjT.js` 212,836 raw, 65,840 gzip. The budget script counts the JS a page loads, following imports; the total per page was not computed here.

Figure code bundling:
- The figure's SVG is drawn at build time for each lesson page: `src/pages/[track]/[lesson].astro:38` `const drawn = drawFigure(lesson.figure);`, so each lesson's figure markup sits in its own HTML.
- The drivers are not per page. `src/lesson/LessonConsole.tsx:12` and `src/lesson/ScenePanel.tsx:7` import `DRIVERS` from `src/scenes/drivers`, so all five drivers are in the shared lesson console chunk.
- The drawing modules that the drivers import (`net-map.ts`, `dhcp.ts`, `osi.ts`, `firewall.ts`, `subnet.ts`, via `parts.ts` and `net-map-layers.ts`) are kept out of the page by type-only imports (`src/scenes/drivers/net-map.ts:2`, "Only types from the drawing module: its code is for the build, and stays out of the page.").
- Card spots (`src/lib/figures.ts`) are drawn for the track pages, not per lesson page.

## Not found

- IEEE 802.3, 802.1D, 802.1Q, IEEE 802 switching, MAC learning or flooding documents: no entry (`grep -n "802\.1\|802\.3" src/content/sources.ts`). Only `ieee-802-2024` (`sources.ts:3007`) and the RA pages are registered.
- RFC 8201, RFC 8900, RFC 4821, RFC 7098, RFC 2991, RFC 2992, RFC 7042, RFC 793, RFC 4291, RFC 8981, RFC 4941: no entry (`grep -c "id: 'rfc-NNNN'"` = 0 for each).
- "What is a packet" pages from Cloudflare, Cisco, Palo Alto or other vendors: none (titles and URLs checked).
- AWS, Google Cloud Load Balancing, NGINX, HAProxy, F5, Palo Alto load balancer, Cisco load balancer pages: none registered, and none of their hosts is allowed.
- ECMP documents: none.
- Switch, hub, MAC table, flooding, load balancer, server pool, health check, reverse proxy, reassembly: none in `src/content/lessons/*.ts` or `src/content/glossary-groups/*.ts`, except the citation title at `router.ts:62` and "SYN flood" at `what-is-tcp.ts:186`.
- "no switch" statement in `mac-address.ts`: none. It appears only in `prototypes/d10-scene-map.md:40` and the catalogue (`:155` "no switch yet, which comes next").
- Switch, hub, pool or balancer drawings in `src/art/` or `prototypes/`: none.
- A multi-tag or numbered-tag ability on net-map: none. Tags are one per label length (`src/art/scenes/net-map.ts:457`, `net-map-layers.ts:54`).
- Compare mode or two lanes: none in `src/content/schema.ts`, `src/engine` or `src/lesson` (S15).
- Lesson or figure files for `packets`, `switch`, `load-balancers`, `proxies`, `vpn`: none in `src/content/lessons/` or `FIGURES` (`src/lib/figures.ts:7-19`).
- Fragmentation or MTU wording in `what-is-ip.ts`, `what-is-tcp.ts` (only "segments"), `what-is-udp.ts` (none), `tcp-udp.ts` (none): the only MTU lines are `what-is-icmp.ts:82, :606, :613`.

Searched: `src/content/sources.ts` and its test, `src/content/lessons/*.ts`, `src/content/glossary-groups/*.ts`, `src/content/tracks/networking.ts`, `src/content/registry.ts` and its test, `src/lib/*.test.ts`, `src/lesson/*`, `src/art/scenes/*`, `src/art/figures/*`, `src/scenes/drivers/*`, `src/engine/tables.ts`, `e2e/*.ts`, `docs/fact-checks/`, `docs/lesson-changes/`, `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md`, `prototypes/d10-scene-map.md`, `prototypes/*.svg`, `prototypes/*.html`, `scripts/check-budgets.mjs`, `dist/`.