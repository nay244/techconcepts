# D10: a scene map for the other eleven Networking lessons

For each Networking Concepts lesson not yet written, this file gives three things:

- which built figure could carry it, or what new figure or panel it needs;
- its card art;
- a rough size for the figure work alone.

The lessons' words are not part of this. Each lesson still goes through analyst, author and fact-checker, and its designer unit decides the story.

## What exists

| Figure | Its parts | Its panels |
|---|---|---|
| net-map | laptop, your router, resolver, provider, routers a to d; plates by layer (web, names, mail, files, host, call) | table |
| dhcp | laptop, router, phone, broadcast ring | lease table |
| subnet | laptop, printer, PC, router, provider | bits board |
| firewall | visitor, admin, firewall, web | rules and connections |
| osi | two stacks | labels |

Two more things are already built:

- **The sequence view**, on any figure with parties.
- **The table panel**, which after D10 can show:
  - a changing owner (`replace` with `by`);
  - candidate rows;
  - a no-match row.

**Sizes:**
- small: lesson data and at most one new cue;
- medium: a new panel, or new parts on an existing figure;
- large: a new figure and driver, or a new driver ability.

## The eleven

| # | Lesson | Catalogue scene | Carried by | Card art (a spot, 528 × 372, one lit part) | Size |
|---|---|---|---|---|---|
| 2 | Packets | Flow (layers + network) | **New ability on net-map.** Several tags on the map at once, numbered, taking different ways (the a to d mesh already gives two ways), and arriving out of order. A reassembly tray on the laptop puts them back in order; it could extend the existing `tray` cue. Wrapping is not needed here, since OSI Model covers it. | A file block cut into four numbered slabs, one lit and in flight | large |
| 3 | IP Address | Playground | **Subnetting's bits board** (`panel: bits`) for the decimal and binary form. A new **address-kind panel** (public, private, special) beside it. No map needed: the subnet figure's home devices can carry the addresses. The "type any address" tool is the Playground's, not the scene's. | An address plate: four octet tiles, one lit, with its bits engraved below | medium |
| 4 | MAC Address | Flow | **dhcp figure**, since its laptop, router and phone already share one Wi-Fi with a broadcast ring. It needs one or two more home devices, and each device's "keeps it / ignores it" light (the phone's "hears and ignores" exists). No switch, as the catalogue says. | A network card with its address split into two halves, the maker's half lit | medium |
| 5 | Switch | Device table (MAC table) | **A new switch figure**: one switch with four to six ports, a device on each, and flooding as a fan of tags. The **table panel** is the MAC table (port, MAC; `add` and `update` exist). Moving a laptop to another port needs a cable re-plug cue. | A switch box with a row of ports, one port's light lit | large |
| 6 | ARP | Device table (ARP cache) | **net-map's home** (laptop and your router) plus the **table panel** as the ARP cache. What is IP's ARP step ("WHO HAS?" / "IS AT") is already drawn on it. The broadcast is a tag to the router alone; showing "sent to all" needs a ring at home, which the dhcp figure has. If the story needs a third home device, use the **dhcp figure** instead. | A loud-hailer cone over two small devices, one answering with a lit card | small (net-map) to medium (dhcp with a cache panel) |
| 10 | Ports | Device table (listening ports) | **net-map** with a web or host plate (`tcp:web`, `ssh:host` and so on, which show "· port N" already), plus the **table panel** as listening ports. A closed port is a `match` with key '' (the D10 no-match row) and a message whose outcome is `blocked`. | A server face with a row of numbered sockets, one lit | small to medium |
| 11 | TCP/UDP | Flow (compare) | **Cheapest:** net-map with `tcp:web`, then `udp:call`, in turn (What is TCP and What is UDP exist), with the sequence view. **What the catalogue's "drop in both lanes" needs:** a **new compare mode**, two lanes playing side by side. | Two lanes, one with a lit acknowledgement coming back and one without | medium (in turn) or large (compare mode) |
| 12 | NAT | Device table (NAT table) | **net-map** as is: your router's callout already shows inside and outside addresses, and What is IP shows the swap. The **table panel** is the NAT table (inside address:port, outside port). A second laptop needs a second home device on net-map, or use the **dhcp figure**'s phone. | Your router with two address tags, inside and out, the outside one lit | small (one laptop) to medium (a second device) |
| 18 | Proxies | Flow (compare) | **New parts on net-map:** a proxy place on the way. A forward proxy is at home or at the provider; a reverse proxy is in front of the web plate. The comparison needs the **compare mode** (TCP/UDP's) or two scenes in turn, plus a "what the server logs" panel (a table). | A go-between box with two cables, the outgoing one lit and its return address swapped | large |
| 19 | Load Balancers | Device table (pool) | **A new figure**: one balancer in front of a pool of three or four servers, each with a health light. The **table panel** is the pool (server, health, connections). Taking a server offline is an `update` with `miss`. | A balancer fanning out to three servers, one route lit | large |
| 20 | VPN | Flow (layers + network) | **A new tunnel figure**, or new parts on net-map: café Wi-Fi in place of the home plate, an eavesdropper, and a tunnel drawn along the existing cables to a VPN server. Its wrapping view is the osi figure's labels panel (one header around another). | A sealed tube along a cable, a packet inside it lit | large |

## Notes

- **Reuse the D10 parts.**
  - The changing by-line suits ARP (whose cache), NAT and Ports.
  - The no-match row suits Ports (a closed port) and Switch (an unknown MAC, then a flood).
  - Candidate rows suit any lesson that must show "several match, one wins".
- **Compare mode** is the one new ability that two lessons share: TCP/UDP and Proxies. Design it once, for TCP/UDP, before either is written.
- **A home with more devices** is wanted by MAC Address, ARP and NAT. The dhcp figure already draws three devices on one Wi-Fi. Adding a fourth there is cheaper than adding devices to net-map's home plate.
- **Card art.** Every one of these is a spot. None of them is a How the Internet Works lesson, so none takes a name tile.
