```json fact-check
{
  "slug": "mac-address",
  "base": "7d5139870ace289a9c46bda91abddbf810637c6ef7a6bcb1e9b282558992fc92",
  "hash": "c83f473e8cb536e1d1b7b6eb049039db69c9466ea039c1d7a562b9583c8fe193",
  "checked": "2026-11-15",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].overview.hookBacking (the Overview hook)": "✅",
    "units[0].learn.why[0] (\"why-1\")": "✅",
    "units[0].practice[2].options[0] (question \"first-half\")": "✅",
    "units[0].practice[2].options[1] (question \"first-half\")": "✅",
    "units[0].practice[2].options[2] (question \"first-half\")": "✅",
    "units[0].practice[0].prompt (question \"one-device\")": "✅",
    "units[0].practice[1].prompt (question \"everyone\")": "✅",
    "units[0].practice[2].prompt (question \"first-half\")": "✅"
  },
  "sources": [
    { "id": "cisco-arp-config", "current": true, "checked": "2026-11-15" },
    { "id": "ieee-ra-faq", "current": true, "checked": "2026-11-15" },
    { "id": "microsoft-ndis-packet-filter", "current": true, "checked": "2026-11-15" },
    { "id": "microsoft-wifi-connect", "current": true, "checked": "2026-11-15" },
    { "id": "paloalto-layer-7", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-9542", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-9724", "current": true, "checked": "2026-11-15" }
  ],
  "quotes": {
    "checked": "2026-11-15",
    "count": 20,
    "digest": "93c06ae786434ed6872dae74df96ca37db1894c4fa3f7d0a69b591d866666220",
    "files": {
      "rfc-9724": "b0ad27b88fe2c18981558885cff56b523539a5d69784a5188887ab0fbb06095e",
      "rfc-9542": "5c52f6cb6aacb1dea947a206bc8775ec8aaed52d74b92c600f1b1166d5c3c0f1",
      "paloalto-layer-7": "250a77fb33e8e5791318cef0d3c9b517d6798fa85cd9c5c30b415943203ba4e9",
      "cisco-arp-config": "3784327ea1adf9076e9a1c4643519a8e0e4bdb80342d4cdc5895b0fbb326ffc9",
      "microsoft-ndis-packet-filter": "aa5a72fd08c543643b6f9b62e7214dff13e82374d841ca85c153ff0e0e76dff4",
      "ieee-ra-faq": "8d414d8c9ec3982eb866707049b8dd1785b5cda922373a29c37c5c347e88ddf3",
      "microsoft-wifi-connect": "79a22edf6d1f895bfce2371982ac3a0e4b2f4e0ec18589f6e5a87a241f1d0d24"
    }
  }
}
```

# Fact-check re-check: MAC Address

A targeted re-check of the 11 items the re-check sheet lists, against the base full check. All 11 are ✅.

## Claims

### units[0].learn.why[0] ("why-1") — ✅

"Many devices share one Wi-Fi and hear every frame, so each frame has to say which device it's for."

- `rfc-9724` §2.1
  > Wi-Fi interfaces have an L2 address
  > (also referred to as a MAC address) that can be seen by anybody who
  > can receive the radio signal transmitted by the network interface.
- `rfc-9724` §2.2
  > when a device uses this MAC address over a shared
  > medium to transmit data -- especially over the air
- `rfc-9724` §2.2
  > Once associated to a given Access Point (AP), the MAC address is
  > used in frame transmission and reception, as one of the addresses
  > used in the unicast address fields of an IEEE 802.11 frame.
- `rfc-9542` §3
  > Figure 2 shows the
  > simplest case where the EtherType of the protocol data in the
  > frame appears immediately after the destination and source MAC
  > addresses.
- `paloalto-layer-7` §Meet the Layers of the OSI Model
  > This layer structures raw bits from the physical layer into data frames and manages node-to-node communication through physical addresses (MAC addresses).
- `cisco-arp-config` §Layer 2 and Layer 3 Addressing
  > Layer 2 addresses are used for local transmissions between devices that are directly connected.
- `microsoft-ndis-packet-filter` §Remarks
  > Directed packets contain a destination address equal to the station address of the NIC.
- `microsoft-ndis-packet-filter` §Remarks
  > the protocol driver continues to receive packets even if the sending network node does not direct them to it.
- Note: Shared medium and hearing others' frames: RFC 9724 says a Wi-Fi interface's address can be seen by anyone who receives its radio signal, over a shared medium; Microsoft's NDIS page (a second publisher) says a network card receives packets that were not directed to it, which promiscuous mode passes up. Each frame naming its destination: RFC 9542 (the destination MAC address leads the frame), RFC 9724 (the unicast address fields of an 802.11 frame) and Microsoft (a directed packet carries the card's own address as its destination), with Cisco and Palo Alto saying layer 2 addresses carry local, node-to-node delivery.
- Note: True for a beginner. "Hear every frame" is said loosely: it means every device in radio range on that channel, and on a protected network the payload is encrypted although the addresses are still readable. Neither point would leave a beginner believing something false.
- Note: Currency: RFC 9724 (Informational, March 2025) and RFC 9542 (BCP 141, April 2024) are neither obsoleted nor updated; the three vendor pages are live and describe current products.

### units[0].practice[2].options[0] (question "first-half") — ✅

Option "Which organization the IEEE Registration Authority gave that block of addresses to." (right: true). Feedback: "Right. It's an OUI. On a real card it's usually the maker's; this one is IANA's, which sets some of its addresses aside for examples."

- `rfc-9724` §2.1
  > Organizationally Unique Identifier (OUI):  The first three octets in
  > transmission order, which identify the organization that issued
  > the identifier.
- `rfc-9724` §2.1
  > A universally administered address is uniquely assigned to a device
  > by its manufacturer.
- `ieee-ra-faq` §What is an Organizationally Unique Identifier (OUI)?
  > An OUI is a 24-bit globally unique assigned number referenced by various standards. (An OUI is assigned with a MA-L identifier block.) It can be used to identify an organization/company where a globally unique identifier is needed.
- `rfc-9542` §1.3
  > The Organizationally Unique Identifier (OUI) 00-00-5E has been
  > assigned to IANA by the IEEE Registration Authority.
- `rfc-9542` §1.3
  > there are documentation code points under the IANA OUI specified
  > below.
- Note: Defining standard: RFC 9542 is the current BCP that defines IANA's use of its OUI, 00-00-5E, including the MAC address values set aside for documentation (its §2.1.4 lists 00-00-5E-00-53-00 to 00-00-5E-00-53-FF for unicast, which covers the prompt's address).
- Note: The first half naming the organization the IEEE RA gave a block to is stated by RFC 9724 and by the IEEE RA's own FAQ, and RFC 9542 states the IEEE RA's assignment of this OUI to IANA. "Usually the maker's" rests on RFC 9724's statement that a universally administered address is assigned by the maker, and agrees with the IEEE answer that the OUI's organization numbers each interface.
- Note: True for a beginner: "IANA sets aside" is loose (the IETF set the values aside in RFC 9542, under IANA's OUI); it would not mislead.
- Note: Currency: RFC 9724 and RFC 9542 are not obsoleted or updated; the IEEE RA FAQ is live.

### units[0].practice[2].options[1] (question "first-half") — ✅

Option "Which Wi-Fi network the laptop is on." (right: false). Feedback: "Not quite. The first half is an organization's number from the IEEE."

- `rfc-9724` §2.1
  > Organizationally Unique Identifier (OUI):  The first three octets in
  > transmission order, which identify the organization that issued
  > the identifier.
- `ieee-ra-faq` §What is an Organizationally Unique Identifier (OUI)?
  > An OUI is a 24-bit globally unique assigned number referenced by various standards. (An OUI is assigned with a MA-L identifier block.) It can be used to identify an organization/company where a globally unique identifier is needed.
- Note: The option is rightly marked wrong: both sources say the first half identifies an organization, not a network. "From the IEEE" is the IEEE Registration Authority's own FAQ describing the OUI as the number it assigns with an MA-L block.
- Note: Currency: RFC 9724 is not obsoleted or updated; the IEEE RA FAQ is live.

### units[0].practice[2].options[2] (question "first-half") — ✅

Option "Nothing: the whole address is random." (right: false). Feedback: "Not quite. A card's own address has two halves, the organization's and the card's. A device can use a randomized one instead, but this is the card's own."

- `rfc-9724` §2.1
  > Most physical devices are provided with a
  > universally administered address, which is composed of two parts:
- `rfc-9724` §2.1
  > Network Interface Controller (NIC) Specific:  The following three
  > octets, which are assigned by the organization that manufactured
  > the NIC, in such a way that the resulting MAC address is globally
  > unique.
- `ieee-ra-faq` §What is an Organizationally Unique Identifier (OUI)?
  > The OUI is usually concatenated with other bits that are assigned by that organization in order to make a globally unique EUI-48 or EUI-64.
- `rfc-9724` §2.2
  > One way to address this privacy concern is by using randomly
  > generated MAC addresses.
- `microsoft-wifi-connect` §Random hardware addresses
  > If your Wi-Fi hardware supports it, you can turn on random hardware addresses to make it harder for people to track you when your device scans for networks and connects.
- Note: Two halves, the organization's and the card's: RFC 9724 and the IEEE RA FAQ. A device may use a randomized address instead: RFC 9724 and Microsoft (a second publisher). "This is the card's own" is right for the prompt's address: its first byte, 00, has the local bit clear, which RFC 9724 §2.1's figure marks as a universally administered address.
- Note: True for a beginner: "two halves" is the ordinary case (an MA-L block); smaller blocks split the address differently, which the lesson's own Go deeper says.
- Note: Currency: RFC 9724 is not obsoleted or updated; the IEEE RA FAQ and Microsoft's Windows Wi-Fi help page are live and describe current Windows.

## Traced, example, analogy and unbacked parts

### title — ✅

"MAC Address": names the lesson's topic and makes no claim.

### units[0].name — ✅

"MAC address": makes no claim.

### units[0].backing (the unit's full name and purpose) — ✅

The full name follows term-mac and fact-name; the purpose (saying which device a frame is for) follows why-1 and term-frame. Nothing added.

### units[0].overview.hookBacking (the Overview hook) — ✅

Each statement traces: shared Wi-Fi and every device in range hearing each frame (why-1, fact-hear); each frame naming its destination by MAC address (term-frame, why-1); the hardware number of a network card (term-mac); kept by the addressed device and ignored by the others (fact-keep); the exception for frames sent to everyone (term-broadcast). The phone, laptop and TV are only examples of the many devices why-1 names.

### units[0].practice[0].prompt (question "one-device") — ✅

The phone's address, 00:00:5E:00:53:11, is in the documentation range. The premise (a router frame for the phone, the TV on the same Wi-Fi) is sound, and the question rests on lead-1 and fact-keep.

### units[0].practice[1].prompt (question "everyone") — ✅

ff:ff:ff:ff:ff:ff is the broadcast address the lesson teaches (term-broadcast, fact-broadcast). No false premise.

### units[0].practice[2].prompt (question "first-half") — ✅

00:00:5E:00:53:10 is in the documentation range, and its first three pairs, 00:00:5E, are the first half as fact-halves defines it. No false premise.

## Sources

- `rfc-9724`: the RFC Editor's metadata lists RFC 9724 (Informational, March 2025) with nothing obsoleting or updating it. Current, checked 2026-11-15.
- `rfc-9542`: the RFC Editor's metadata lists RFC 9542 (BCP, April 2024; it obsoletes RFC 7042) with nothing obsoleting or updating it. Current, checked 2026-11-15.
- `ieee-ra-faq`: the IEEE Registration Authority's FAQ page is live on standards.ieee.org. Current, checked 2026-11-15.
- `microsoft-ndis-packet-filter`: the Microsoft Learn page for OID_GEN_CURRENT_PACKET_FILTER is live and documents current Windows drivers (NDIS 6.0 and later). Current, checked 2026-11-15.
- `microsoft-wifi-connect`: the Microsoft Support Windows Wi-Fi page is live, and its random hardware addresses section describes current Windows settings. Current, checked 2026-11-15.
- `cisco-arp-config`: the Cisco IOS XE 17.x ARP configuration guide is live and covers a current release train. Current, checked 2026-11-15.
- `paloalto-layer-7`: the Palo Alto Networks Cyberpedia page is live and describes the OSI model as currently taught. Current, checked 2026-11-15.
