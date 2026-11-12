```json fact-check
{
  "slug": "fact-check-canary",
  "hash": "d596a10e930a1efe5956be6d5fd847eaa0241d2b49300c3ee793030cabc14d4b",
  "checked": "2026-11-11",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].osi": "✅",
    "backing (the lesson's subtitle and summary)": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].scene.backing (the scene)": "✅",
    "units[0].overview.hookBacking (the Overview hook)": "✅",
    "units[0].overview.backing (the Overview description)": "✅",
    "units[0].overview.facts[0] (Overview fact \"Example address\")": "✅",
    "units[0].steps[0] (step \"discover\")": "✅",
    "units[0].steps[0].facts[0] (step \"discover\", fact \"Message\")": "✅",
    "units[0].steps[0].facts[1] (step \"discover\", fact \"To port\")": "✅",
    "units[0].steps[0].events[0] (event \"m1\")": "✅",
    "units[0].steps[1] (step \"offer\")": "✅",
    "units[0].steps[1].facts[0] (step \"offer\", fact \"Offered address\")": "✅",
    "units[0].steps[1].facts[1] (step \"offer\", fact \"Lease time\")": "⚠️",
    "units[0].steps[1].events[0] (event \"m2\")": "✅",
    "units[0].steps[0].deep[0] (step \"discover\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"offer\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.lead[2] (\"lead-3\")": "❌",
    "units[0].learn.terms[0] (\"term-dhcp\")": "✅",
    "units[0].learn.terms[1] (\"term-1\")": "✅",
    "units[0].learn.terms[2] (\"term-2\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "❌",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-1\")": "✅",
    "units[0].learn.facts[1] (\"fact-2\")": "✅",
    "units[0].learn.facts[2] (\"fact-3\")": "❌",
    "units[0].practice[0].options[0] (question \"q1\")": "✅",
    "units[0].practice[0].options[1] (question \"q1\")": "❌",
    "units[0].practice[0].prompt (question \"q1\")": "✅"
  },
  "sources": [
    { "id": "microsoft-dhcp", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-2131", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-2616", "current": false, "checked": "2026-11-11", "note": "Obsoleted by RFC 7230 to 7235, which RFC 9110 and its companions in turn replace." },
    { "id": "rfc-9110", "current": true, "checked": "2026-11-11" }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-11",
    "count": 21,
    "digest": "60c2437182a26af3640b367e74d89248a892dfe6e469e04f1c0a8d89d3b7063f",
    "files": {
      "rfc-2131": "a043b705785b81762505ded4cf71d61392b2b1da2b4ce1e32c13bc984de5f4a5",
      "microsoft-dhcp": "f8e81ba8570e0b624102fd3fe30664ec2e9ce9d8a8a639c3c966941992a5cfc1",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "rfc-2616": "10211d2885196b97b1c78e1672f3f68ae97c294596ef2b7fd890cbd30a3427bf"
    }
  },
  "items": {
    "title": "e424879dad48e80ce332f183d973c710b3929df206bf0c2347381add4c6f5326",
    "units[0].name": "73571337af6dbc06d87da831bd0221b5c7df07d4c20ddbba20aeaf983e434ec7",
    "units[0].osi": "17c8769f2b58beff9273753a44012a077e731b61b24948a7d59567552df0492d",
    "backing (the lesson's subtitle and summary)": "4472974321aecdb96944f7ef9056927a4aa76745563c7ab9e9068e574a94c444",
    "units[0].backing (the unit's full name and purpose)": "6efc362fd857a899810bb46c2fbafb4b07de06cbaf6470973269daf6ed09e49e",
    "units[0].scene.backing (the scene)": "921a5c94268e03bf3cc48f17dcc5285c48180a00c50052929be065b2d0a25d0d",
    "units[0].overview.hookBacking (the Overview hook)": "efd01a6b0c5de79ae089cf1e4651d42550aed7531ca255bfec39f9bc8e6075a0",
    "units[0].overview.backing (the Overview description)": "03758b9b72bfd346590977237900ea976e1d8916b229581c295cc32f9a180916",
    "units[0].overview.facts[0] (Overview fact \"Example address\")": "ca9618ee120722e8b4ba0301425b98f33f247961f72720995a6eec5142c050ef",
    "units[0].steps[0] (step \"discover\")": "d0cb6061a38ae125a05055be75dd6dde78e5cff33aaf6f9c468d3a4b87cd4660",
    "units[0].steps[0].facts[0] (step \"discover\", fact \"Message\")": "b639826bb3df65695adeff51a28e53e0fa080facc749017251f9dc93239f9c48",
    "units[0].steps[0].facts[1] (step \"discover\", fact \"To port\")": "c231b12f0bd6381ce8fe9c69da466b09827d54f42146f32aa096555ee473366d",
    "units[0].steps[0].events[0] (event \"m1\")": "e812dca536e5bd642cd1e987ae0faddc17df6b8013eb9ce1dc1e99627eae6f62",
    "units[0].steps[1] (step \"offer\")": "a29778e6bb5cd06292d65e635c134ee537f3e4f39bdfce9279b0af24fd208393",
    "units[0].steps[1].facts[0] (step \"offer\", fact \"Offered address\")": "6860423db19efca4cb6995341d4f6fd4722a08b0f09293bded3f895b5c6c2f34",
    "units[0].steps[1].facts[1] (step \"offer\", fact \"Lease time\")": "fa9872736f477be1a1083ad0549a3dff35d846b3a351bd7d4a7142fa8eb92895",
    "units[0].steps[1].events[0] (event \"m2\")": "74ef5883d86d1356536613fc588bc7c2359a4d103d52e299e1d2187e563f7419",
    "units[0].steps[0].deep[0] (step \"discover\", Go deeper)": "d70eb00dcb0eef6c3086f2db5dd06c0d40b46e9a8e6680723639f1d01129d862",
    "units[0].steps[1].deep[0] (step \"offer\", Go deeper)": "cab5b91d5842106a28e897c44ff1133a129312789c0896a6dd0bc78fd76db620",
    "units[0].learn.lead[0] (\"lead-1\")": "f6234173785bc954214c5e1e95ce4cb779a6a8cea6385825882f420fe8c19ae1",
    "units[0].learn.lead[1] (\"lead-2\")": "0c7e1653155e5b55a5cc2852062aec8a5667aa2b80610a7a71a3513af105e6e8",
    "units[0].learn.lead[2] (\"lead-3\")": "225131b596ccb6aaf2084151a6d8f7da3a55849b677a0718f8b7681a29b54974",
    "units[0].learn.terms[0] (\"term-dhcp\")": "6bf7c897be9ec1f9149b96fa55cf5f453723d7c6741aa8d7332791396873de87",
    "units[0].learn.terms[1] (\"term-1\")": "9df6bf3967ad4ed76a8ed3d350fbe1f9af3122a516c511dc87dd8b302b2c1f44",
    "units[0].learn.terms[2] (\"term-2\")": "ba38d4b47adaeaeb519fe5dde660a485f99f6a06a98d636ec40377a0e17fd352",
    "units[0].learn.pattern (\"pattern\")": "805e6ea9614de743afd2769d6fe4aa2e45bf3aa7d8cc9178240ca31b13de9aff",
    "units[0].learn.why[0] (\"why-1\")": "e64f6b44ed8b50846da72a3633c87d439b187fd1074f244c0a681c2c0d2938d4",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "59c5bc8fbf3d655543d3d537b82cd50e6cb5a5b53fd2a6712848cce932f60de5",
    "units[0].learn.facts[0] (\"fact-1\")": "5711ded05435be486df8e366bfdd1710a1e6e4e7d46bd9130ee595fb4ee894d3",
    "units[0].learn.facts[1] (\"fact-2\")": "fba95f319640c0145914546fd0167d498b58501089603b895fd672ba0ab9a779",
    "units[0].learn.facts[2] (\"fact-3\")": "2a669f700675fa9d4a8e4bcb3d7ac8b9abe9df012c259929327fdb09ec2604ec",
    "units[0].practice[0].options[0] (question \"q1\")": "e9bc25e5a9524f06aae561e5bc48199f3a0611dd70ee083d9682ee2ea43ab100",
    "units[0].practice[0].options[1] (question \"q1\")": "1ba47764b9fa7168f4d8028b09fe130cc60ae6eb7b7ad9696c19cd7aeb484ecd",
    "units[0].practice[0].prompt (question \"q1\")": "e06f717a967709ed7776961b8a768dcd7f2abf980cc82728f3e6bfc05be1f8a7"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: fact-check-canary

Checked 2026-11-11 by claude-opus-5-5. Every source was fetched from its publisher in this run: the three RFCs as plain text from rfc-editor.org, the Microsoft Learn page as HTML from learn.microsoft.com.

## Claims

### units[0].osi — ✅

Badge: spans.

- Note: An OSI badge of "spans" cites nothing. None of the four sources met in this run places DHCP at a single OSI layer. RFC 2131 §4.1 says DHCP is carried over UDP, which names its transport, not a layer for DHCP itself. Nothing contradicts the badge.

### units[0].steps[0].deep[0] (step "discover", Go deeper) — ✅

"The DHCPDISCOVER goes to UDP port 67, the DHCP server port."

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.  DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67)
- Note: RFC 2131 defines DHCP, including the ports its messages are sent to. It is a Standards Track RFC, not obsoleted; its four updates (RFC 3396, 4361, 5494, 6842) concern options, client identifiers and IANA guidelines, not the ports.

### units[0].steps[1].deep[0] (step "offer", Go deeper) — ✅

"The DHCPOFFER goes to UDP port 68, the DHCP client port."

- `rfc-2131` §4.1
  > DHCP messages from a server to a client are sent to the 'DHCP client' port
  > (68).
- Note: RFC 2131 defines the DHCP ports. Current, as above.
- Note: Leaves out the relay case: when a relay agent forwarded the request, the server sends its reply to the relay agent's server port instead. The ordinary case on one subnet is as stated.

### units[0].learn.lead[0] ("lead-1") — ✅

"A device with no address broadcasts a DHCPDISCOVER message on its local network to find a DHCP server."

- `rfc-2131` §3.1
  > 1. The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the DHCP messages and the exchange for allocating a new address. Section 3.1 is that exchange; the device has no address yet, and a client that already knows its address takes the shorter path of §3.2. Current, as above.

### units[0].learn.lead[1] ("lead-2") — ✅

"Each DHCP server that gets it may answer with a DHCPOFFER, which holds an address it can lend."

- `rfc-2131` §3.1
  > 2. Each server may respond with a DHCPOFFER message that includes an
  > available network address in the 'yiaddr' field
- Note: RFC 2131 defines the DHCPOFFER message. "Lend" is an everyday word for the lease the RFC describes. Current, as above.

### units[0].learn.lead[2] ("lead-3") — ❌

"A DHCP server always offers a lease of 24 hours."

- `rfc-2131` §3.1
  > The DHCPDISCOVER message MAY include options that suggest
  > values for the network address and lease duration.
- `microsoft-dhcp` §Why use DHCP?
  > The lease duration, or the length of time for which the IP address can be used before a lease renewal is required.
- Note: Neither source states a fixed lease of 24 hours. RFC 2131 lets the client suggest a lease duration, and Microsoft lists the lease duration among the settings an administrator stores on the server, so the length varies.
- Note: What is wrong: no cited section states a 24-hour lease, and "always" with a fixed number would teach a beginner that lease length is fixed, which both sources contradict.

### units[0].learn.terms[0] ("term-dhcp") — ✅

"Dynamic Host Configuration Protocol (DHCP)": giving devices their network settings.

- `rfc-2131` §1
  > The Dynamic Host Configuration Protocol (DHCP) provides configuration
  > parameters to Internet hosts.
- Note: RFC 2131 defines DHCP and gives its full name. "Network settings" puts "configuration parameters" in a beginner's words. Current, as above.

### units[0].learn.terms[1] ("term-1") — ✅

"DHCPDISCOVER": looking for a server.

- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the DHCPDISCOVER message. Current, as above.

### units[0].learn.terms[2] ("term-2") — ✅

"DHCPOFFER": a server's offer of an address.

- `rfc-2131` §3.1
  > DHCPOFFER    -  Server to client in response to DHCPDISCOVER with
  > offer of configuration parameters.
- Note: RFC 2131 defines the DHCPOFFER message; step 2 of the same section says the offer includes an available network address. Current, as above.

### units[0].learn.pattern ("pattern") — ✅

"DHCP Discover", then "DHCP Offer": the device looks for a server first; a server then offers an address.

- `rfc-2131` §3.1
  > 1. The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-2131` §3.1
  > 2. Each server may respond with a DHCPOFFER message that includes an
  > available network address
- Note: RFC 2131 defines the order of the exchange. Current, as above.

### units[0].learn.why[0] ("why-1") — ❌

"The client broadcasts its DHCPDISCOVER on its local physical subnet."

- `rfc-2131` §3.1
  > 1. The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- Note: The claim is true and RFC 2131 states it, but this citation is not marked as a defining standard, and the second citation is about the HTTP GET method, not DHCP.
- Note: What is wrong: the cited RFC 9110 §9.3.1 does not state the claim at all, so the claim also lacks a second independent source.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

"DHCP runs over UDP. Messages from a client to a server go to port 67, and messages from a server to a client go to port 68."

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.  DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67), and DHCP
  > messages from a server to a client are sent to the 'DHCP client' port
  > (68).
- Note: RFC 2131 defines the transport and ports of DHCP. Current, as above.
- Note: Leaves out the relay case, where the server's reply goes to the relay agent's server port.

### units[0].learn.facts[0] ("fact-1") — ✅

DHCP server port: UDP 67.

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.  DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67)
- Note: RFC 2131 defines the DHCP server port. Current, as above.

### units[0].learn.facts[1] ("fact-2") — ✅

Getting a new address: DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, then DHCPACK.

- `rfc-2131` §3.1
  > The client broadcasts a DHCPREQUEST message
  > that MUST include the 'server identifier' option to indicate which
  > server it has selected
- `rfc-2131` §3.1
  > The server selected in the DHCPREQUEST message commits the
  > binding for the client to persistent storage and responds with a
  > DHCPACK message
- Note: RFC 2131 defines the exchange for allocating a new address; its steps 1 and 2 (quoted under lead-1 and lead-2) send the DHCPDISCOVER and DHCPOFFER, and steps 3 and 4 send the DHCPREQUEST and DHCPACK. Current, as above.
- Note: Leaves out the failure paths (DHCPNAK, DHCPDECLINE).

### units[0].learn.facts[2] ("fact-3") — ❌

HTTP/1.1: defines the GET method.

- `rfc-2616` §9.3
  > The GET method means retrieve whatever information (in the form of an
  > entity) is identified by the Request-URI.
- Note: RFC 2616 is obsoleted (by RFC 7230 to 7235, themselves since replaced by RFC 9110 and its companions). The current document that defines the GET method is RFC 9110, HTTP Semantics, which defines it for every HTTP version rather than for HTTP/1.1 alone.
- Note: What is wrong: the defining-standard marker is on an obsoleted document that no longer defines GET, and the source is not current.

### units[0].practice[0].options[0] (question "q1") — ✅

"DHCPDISCOVER" (the right answer). Feedback: "Right. A device with no address broadcasts a DHCPDISCOVER to find a DHCP server."

- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the DHCPDISCOVER message. The option is correctly the answer, and the feedback matches lead-1. Current, as above.

### units[0].practice[0].options[1] (question "q1") — ❌

"HTTPS" (not the answer). Feedback: "Not quite. HTTPS uses TCP port 443."

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.
- Note: The option is correctly marked not the answer, but RFC 2131 §4.1 is about DHCP's transport and ports; it says nothing about HTTPS or port 443, and its defining-standard marker is wrong for this claim.
- Note: What is wrong: the cited section does not state the feedback's claim at all, and the marker names a document that does not define HTTPS's port.

## Traced, example, analogy and unbacked parts

- `title` — ✅ "DHCP canary" makes no claim beyond the lesson.
- `units[0].name` — ✅
- `backing (the lesson's subtitle and summary)` — ✅ says only what lead-1 and lead-2 say.
- `units[0].backing (the unit's full name and purpose)` — ✅ the full name is term-dhcp's; the purpose repeats lead-1 and lead-2.
- `units[0].scene.backing (the scene)` — ✅ a laptop and a DHCP server, with broadcast and reply in the legend, as lead-1 and lead-2 describe.
- `units[0].overview.hookBacking (the Overview hook)` — ✅ calling out in a room and getting an offer from whoever can matches a broadcast answered by offers; it does not mislead.
- `units[0].overview.backing (the Overview description)` — ✅
- `units[0].overview.facts[0] (Overview fact "Example address")` — ✅ 192.0.2.10 is in the RFC 5737 documentation range.
- `units[0].steps[0] (step "discover")` — ✅
- `units[0].steps[0].facts[0] (step "discover", fact "Message")` — ✅
- `units[0].steps[0].facts[1] (step "discover", fact "To port")` — ✅ UDP 67 is stated by deep-1 and fact-1.
- `units[0].steps[0].events[0] (event "m1")` — ✅
- `units[0].steps[1] (step "offer")` — ✅
- `units[0].steps[1].facts[0] (step "offer", fact "Offered address")` — ✅ 192.0.2.10 is RFC 5737 example data.
- `units[0].steps[1].facts[1] (step "offer", fact "Lease time")` — ⚠️ it traces to fact-2, which names the four messages and says nothing about lease time; "8 days" is a value no traced part states.
- `units[0].steps[1].events[0] (event "m2")` — ✅
- `units[0].practice[0].prompt (question "q1")` — ✅ no false premise; it matches lead-1.

## Sources

- `microsoft-dhcp` — live on learn.microsoft.com, last updated 2025-05-13, applies to Windows Server 2016 to 2025: a current product. Checked 2026-11-11.
- `rfc-2131` — the RFC Editor's info page lists it as not obsoleted; updated by RFC 3396, 4361, 5494 and 6842, none of which changes the messages, the exchange or the ports used here. Checked 2026-11-11.
- `rfc-2616` — not current: the RFC Editor's info page lists it as obsoleted by RFC 7230 to 7235. Checked 2026-11-11.
- `rfc-9110` — the RFC Editor's info page lists it as not obsoleted. Checked 2026-11-11.

## Limit overrides

None.
