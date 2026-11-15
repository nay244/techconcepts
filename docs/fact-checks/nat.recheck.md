```json fact-check
{
  "slug": "nat",
  "base": "090b91ac1dbc64a3950e035a9fe3d05b650ceff807ce7193708dcc92a6f348e1",
  "hash": "449a0068aaabfa8ab291284c5815d4bde9d20786d40158871cc146fb20ea7d1f",
  "checked": "2026-11-14",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].overview.facts[4] (Overview fact \"Defined in\")": "✅",
    "units[0].learn.facts[0] (\"fact-defined\")": "✅",
    "units[0].practice[0].prompt (question \"told-apart\")": "✅",
    "units[0].practice[1].prompt (question \"knock\")": "✅",
    "units[0].practice[2].prompt (question \"not-a-firewall\")": "✅"
  },
  "sources": [
    { "id": "rfc-3022", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-4787", "current": true, "checked": "2026-11-14" }
  ],
  "quotes": {
    "checked": "2026-11-14",
    "count": 3,
    "digest": "5c2a1de6f21ee3525a308c1136983664dda27585c91c519248cf4fd49576c688",
    "files": {
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405"
    }
  }
}
```

# Fact-check re-check: nat

A targeted re-check of the seven items the re-check sheet lists. Every other item keeps the full check's verdict.

## Claims

### units[0].learn.facts[0] ("fact-defined") — ✅

Defined in: "RFC 3022, Traditional NAT; its terms are in RFC 2663"

- `rfc-3022` §Abstract
  > Together, these two operations, referred to as traditional NAT, provide a mechanism to
  > connect a realm with private addresses to an external realm with
  > globally unique registered addresses.
- `rfc-4787` §3
  > Readers are urged to refer to [RFC2663] for information on NAT
  > taxonomy and terminology.  Traditional NAT is the most common type of
  > NAT device deployed.  Readers may refer to [RFC3022] for detailed
  > information on traditional NAT.
- `rfc-3022` §1
  > Definition of terms such as "Address Realm", "Transparent Routing",
  > "TU Ports", "ALG" and others, used throughout the document, may be
  > found in [NAT-TERM].
- Note: RFC 3022's own reference list names [NAT-TERM] as RFC 2663, "IP Network Address Translator (NAT) Terminology and Considerations".
- Note: Confirmed by two independent documents. RFC 3022 describes Basic NAT and NAPT together under the name traditional NAT (its title is "Traditional NAT"), and RFC 4787 §3 sends readers to RFC 3022 for traditional NAT; for the terms, RFC 3022 §1 and RFC 4787 §3 both point to RFC 2663.
- Note: Passed as true for a beginner. RFC 3022 is an Informational RFC, not a Standards Track one, and it extends the earlier RFC 1631 (which it obsoletes); "defined in" says this loosely, and it is the document the later NAT RFCs point to for traditional NAT.
- Note: Currency. The RFC Editor's index lists RFC 3022 as Informational, obsoleting RFC 1631, and neither obsoleted nor updated. RFC 4787 (BCP 127) is not obsoleted; it is updated by RFC 6888 (requirements for carrier-grade NATs) and RFC 7857 (clarified NAT44 requirements). I read both updates' abstracts and terminology sections: both still take their NAT terms from RFC 2663, and RFC 7857 refers to RFC 3022 for NAPT, so the claim still holds. Checked 2026-11-14.

## Traced, example and analogy parts, and unbacked items

- `title` — ✅. "NAT" names the lesson's topic and makes no claim.
- `units[0].name` — ✅. "NAT" names the unit and makes no claim.
- `units[0].overview.facts[4] (Overview fact "Defined in")` — ✅. "RFC 3022, with its terms in RFC 2663" repeats fact-defined and adds nothing; it sits last in the Overview's facts, after the four facts about how NAT behaves, which reads in order.
- `units[0].practice[0].prompt (question "told-apart")` — ✅. Two home devices reaching one site through the router's one public address is what lead-1, why-2 and fact-same-site teach; example.net is example data; no false premise.
- `units[0].practice[1].prompt (question "knock")` — ✅. An unsolicited connection from outside with no forwarded port is the case fact-outside and term-port-forwarding teach; no false premise.
- `units[0].practice[2].prompt (question "not-a-firewall")` — ✅. A plain question about what deep-firewall teaches; it presumes nothing false.

## Sources

- `rfc-3022` — RFC 3022, Traditional NAT. Fetched as text from rfc-editor.org. The RFC Editor's index lists it as Informational, obsoleting RFC 1631, with no later RFC obsoleting or updating it: current. Checked 2026-11-14.
- `rfc-4787` — RFC 4787, NAT behavioural requirements for unicast UDP. Fetched as text from rfc-editor.org. The RFC Editor's index lists it as Best Current Practice (BCP 127), updated by RFC 6888 and RFC 7857 and not obsoleted; the updates leave the cited terminology section's pointers standing: current. Checked 2026-11-14.

## Limit overrides

Not part of a re-check; the full check's overrides stand.
