```json fact-check
{
  "slug": "ip-address",
  "base": "6be2931f47b29d8645baf70d02cace1e566e371dcde9601de272e65616735ed6",
  "hash": "36a5255b33d9859968b0dd369dcbccde800cae0144bc720ab0741c6c8a116f75",
  "checked": "2026-11-15",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].overview.backing (the Overview description)": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].practice[0].prompt (question \"which-private\")": "✅",
    "units[0].practice[1].prompt (question \"not-an-address\")": "✅"
  },
  "sources": [
    { "id": "iana-ipv4-special", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-1122", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-1918", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-2663", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-3927", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-5737", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-6890", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-919", "current": true, "checked": "2026-11-15" }
  ],
  "quotes": {
    "checked": "2026-11-15",
    "count": 10,
    "digest": "2b0da5f5488e78631a453b7ec3e0fe925d9568a99467cf0210c126b5dd647f34",
    "files": {
      "rfc-1918": "56c43465298772bc4d899923f1785b7b7bf8dd2c9f2f9a53422800ddc5cf9337",
      "rfc-2663": "5da63886f46cc12237a23faebfb4f9037eb8da8375837041228f29cd1a251681",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-919": "37d6bdb202cd4336e0922b862dbcff0516cd0d7cfa5219d0109e16545b1df64e",
      "rfc-3927": "8f267f455dc791ca9c63b8a4ff6a9abeb61f6cfbfc288b29483c593fe4cb90e6",
      "rfc-5737": "9d16217614a74a9b064eff900e5cd07a525793cf8227dca1267100e880f0c410",
      "rfc-6890": "ce738958287c710cb52016741114cbd4ba9c0b01a8db43adac7e0b7daa28dd3c",
      "iana-ipv4-special": "a8e8cbcf92ca21e1cf62ddd39cb48e420014dc530a608e0bcd8e007e9b2548ea"
    }
  }
}
```

# Fact-check re-check: IP Address

A targeted re-check of the six items the sheet lists, after the pattern note was changed to say "Six of the kinds". Every other item stands on the full check.

## Claims

### units[0].learn.pattern ("pattern") — ✅

The pattern names six kinds (Private, Public, Loopback, Limited broadcast, Link-local, Documentation), with the note "Six of the kinds of IPv4 address this lesson meets. IANA’s list of special-purpose blocks has more."

- `rfc-1918` §3
  > The Internet Assigned Numbers Authority (IANA) has reserved the
  > following three blocks of the IP address space for private internets:
- Note: RFC 1918 is the document that defines the private-use blocks (10/8, 172.16/12, 192.168/16), and IANA's registry cites it for each. It also names the other side of the split: hosts that are not private are public.
- `rfc-1918` §3
  > All other hosts will be public and will use globally unique address
  > space assigned by an Internet Registry.
- `rfc-2663` §2.7
  > A Global or Public Network is an address realm with unique network
  > addresses assigned by Internet Assigned Numbers Authority (IANA) or
  > an equivalent address registry.
- Note: "Public" is confirmed by two independent documents, RFC 1918 and RFC 2663.
- `rfc-1122` §3.2.1.3
  > Limited broadcast. It MUST NOT be used as a source
  > address.
- `rfc-1122` §3.2.1.3
  > Internal host loopback address. Addresses of this form
  > MUST NOT appear outside a host.
- Note: RFC 1122 §3.2.1.3 defines the special address forms {-1,-1} (limited broadcast) and {127, any} (loopback); IANA's registry cites this section for the loopback block.
- `rfc-919` §7
  > The address 255.255.255.255 denotes a broadcast on a local hardware
  > network, which must not be forwarded.
- Note: RFC 919 §7 defines the limited broadcast address; IANA's registry cites this section for 255.255.255.255/32.
- `rfc-3927` §1
  > This document describes a method by which a host may automatically
  > configure an interface with an IPv4 address in the 169.254/16 prefix
  > that is valid for Link-Local communication on that interface.
- Note: RFC 3927 defines IPv4 link-local addressing in 169.254/16; IANA's registry cites it for that block.
- `rfc-5737` §3
  > The blocks 192.0.2.0/24 (TEST-NET-1), 198.51.100.0/24 (TEST-NET-2),
  > and 203.0.113.0/24 (TEST-NET-3) are provided for use in
  > documentation.
- Note: RFC 5737 defines the three documentation blocks.
- `rfc-6890` §1
  > Specifically, this
  > memo instructs IANA to record all special-purpose address blocks in
  > the aforementioned registries.
- Note: RFC 6890 defines the special-purpose address registries and what they hold; it is the defining document for "IANA’s list of special-purpose blocks".
- `iana-ipv4-special` §Registry table: 203.0.113.0/24 Documentation (TEST-NET-3)
  > 203.0.113.0/24 Documentation (TEST-NET-3) [RFC 5737]
- Note: The live registry lists many blocks beyond the lesson's kinds (for example Shared Address Space, Benchmarking, Reserved and the "this network" block), so "has more" holds. The note now says "Six of the kinds", which is true: the lesson also meets 0.0.0.0, a seventh kind, in its facts.
- Note: Currency. None of RFC 1918, 2663, 1122, 919, 3927, 5737 or 6890 is listed as obsoleted on its RFC Editor info page. RFC 1918's one update (RFC 6761) concerns domain names; RFC 1122's updates concern TCP, ICMP, MPLS and the IPv4 ID field, not §3.2.1.3's address forms; RFC 6890's update (RFC 8190) changes registry fields, not these blocks. The IANA registry is live (last updated 2025-10-09) and lists every block named here.

## Traced, example, analogy and unbacked items

- `title` — ✅. "IP Address" names the lesson's subject and makes no claim.
- `units[0].name` — ✅. "IP Address" makes no claim.
- `units[0].overview.backing (the Overview description)` — ✅. "Says where a device is" repeats term-ip; "in decimal or in bits" repeats term-dotted (dotted decimal) and term-binary (32 ones and zeros); "private, public or special" repeats lead-2's three groups. It adds nothing beyond the parts it traces to.
- `units[0].practice[0].prompt (question "which-private")` — ✅. Asks which option is private; the lesson teaches the private ranges, and the prompt carries no false premise.
- `units[0].practice[1].prompt (question "not-an-address")` — ✅. Asks which option cannot be an IPv4 address; the lesson teaches that each of the four numbers runs from 0 to 255, so some strings cannot be one. No false premise.

## Sources

- `iana-ipv4-special` — live registry at iana.org, fetched in TXT and XML form, last updated 2025-10-09. Current. Checked 2026-11-15.
- `rfc-1122` — Internet Standard; info page lists no obsoleting RFC; updates do not touch §3.2.1.3's address forms. Current. Checked 2026-11-15.
- `rfc-1918` — BCP 5; not obsoleted; updated only by RFC 6761 (domain names). Current. Checked 2026-11-15.
- `rfc-2663` — Informational; not obsoleted or updated. Current. Checked 2026-11-15.
- `rfc-3927` — Proposed Standard; not obsoleted or updated. Current. Checked 2026-11-15.
- `rfc-5737` — Informational; not obsoleted or updated. Current. Checked 2026-11-15.
- `rfc-6890` — BCP 153; not obsoleted; updated by RFC 8190 (registry fields only). Current. Checked 2026-11-15.
- `rfc-919` — not obsoleted or updated; still cited by IANA for the limited broadcast block. Current. Checked 2026-11-15.

## Limit overrides

Not part of a re-check (the full check's overrides stand).
