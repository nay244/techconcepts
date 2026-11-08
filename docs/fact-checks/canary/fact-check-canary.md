```json fact-check
{
  "slug": "fact-check-canary",
  "hash": "a4fce5f286736b6a7296ee7764ce271c4471ddf9b83a44e5a0d658be9e18d8fd",
  "checked": "2026-11-08",
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
    "units[0].steps[1].facts[1] (step \"offer\", fact \"Lease time\")": "❌",
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
    "units[0].learn.facts[2] (\"fact-3\")": "⚠️",
    "units[0].practice[0].options[0] (question \"q1\")": "✅",
    "units[0].practice[0].options[1] (question \"q1\")": "❌",
    "units[0].practice[0].prompt (question \"q1\")": "✅"
  },
  "sources": [
    {
      "id": "microsoft-dhcp",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "rfc-2131",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "rfc-2616",
      "current": false,
      "checked": "2026-11-08",
      "note": "Obsoleted by RFCs 7230-7235 (RFC Editor info page); RFC 9110 in turn obsoletes 7230-7233 and 7235. GET is now defined in RFC 9110 §9.3.1."
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-08"
    }
  ],
  "overrides": []
}
```

# Fact-check report: fact-check-canary

Checked 2026-11-08 by claude-opus-5-5. Every source was fetched from its publisher in this run, and every cited section was read in this run.

Verdicts: 29 ✅, 1 ⚠️, 4 ❌ (34 items).

## 1. Claims (kinds `claim` and `osi`)

### units[0].osi: ✅

Content: `"spans"`. No citations.

- Checked every allowed source met in this run (RFC 2131, Microsoft Learn DHCP page, RFC 2616, RFC 9110). None places DHCP at a single OSI layer. RFC 2131 says only that "DHCP uses UDP as its transport protocol" (§4.1), and the Microsoft page calls DHCP "a client/server protocol", with no layer named.
- Currency: see sources below.

### units[0].steps[0].deep[0] (step "discover", Go deeper): ✅

Text: "The DHCPDISCOVER goes to UDP port 67, the DHCP server port."

- RFC 2131 §4.1 (defining standard: RFC 2131 defines the DHCP client-server protocol, its UDP transport and its port numbers): "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67)". DHCPDISCOVER is a client message (§3.1 Table 2: "Client broadcast to locate available servers.").
- Currency: RFC 2131 is not obsoleted. Its updates (RFC 3396, 4361, 5494, 6842) were read and do not change the ports.

### units[0].steps[1].deep[0] (step "offer", Go deeper): ✅

Text: "The DHCPOFFER goes to UDP port 68, the DHCP client port."

- RFC 2131 §4.1 (defining standard: the DHCP ports): "DHCP messages from a server to a client are sent to the 'DHCP client' port (68)." DHCPOFFER is a server-to-client message (§3.1 Table 2: "Server to client in response to DHCPDISCOVER").
- Note: when a relay agent is involved, §4.1 says the server sends return messages "to the 'DHCP server' port on the BOOTP relay agent". That hop goes to a relay, not to the client, and this step shows a server on the same local network, so the claim as worded holds.
- Currency: as above.

### units[0].learn.lead[0] ("lead-1"): ✅

Text: "A device with no address **broadcasts** a DHCPDISCOVER message on its local network to find a DHCP server."

- RFC 2131 §3.1 (defining standard: the DHCP message exchange for allocating a network address, including DHCPDISCOVER): "The client broadcasts a DHCPDISCOVER message on its local physical subnet." Table 2: "DHCPDISCOVER -  Client broadcast to locate available servers." §3.1 is the procedure for allocating a new address ("If the client already knows its address, some steps may be omitted"), which supports "with no address".
- Currency: RFC 2131 is current. Its updates do not touch this.

### units[0].learn.lead[1] ("lead-2"): ✅

Text: "Each DHCP server that gets it may answer with a **DHCPOFFER**, which holds an address it can lend."

- RFC 2131 §3.1 (defining standard: the DHCPOFFER message and its role): "Each server may respond with a DHCPOFFER message that includes an available network address in the 'yiaddr' field". "Lend" is a fair beginner word for an address that may be leased.
- Currency: as above.

### units[0].learn.lead[2] ("lead-3"): ❌

Text: "A DHCP server always offers a lease of 24 hours."

- RFC 2131 §3.1 (not marked defining): does not state it. It says the opposite of a fixed length: "The DHCPDISCOVER message MAY include options that suggest values for the network address and lease duration." The section never mentions 24 hours.
- Microsoft Learn, "Why use DHCP?": does not state it. The server's database includes "The lease duration, or the length of time for which the IP address can be used before a lease renewal is required", that is, an administrator-set value. No fixed length is given.
- Currency: both sources are current.
- **What is wrong:** the claim is false (lease length is configurable, and the client may suggest one), and neither cited section states it.

### units[0].learn.terms[0] ("term-dhcp"): ✅

Content: name "Dynamic Host Configuration Protocol (DHCP)", idea "Giving devices their network settings".

- RFC 2131 §1 (defining standard: RFC 2131 defines DHCP itself): "The Dynamic Host Configuration Protocol (DHCP) provides configuration parameters to Internet hosts."
- Currency: as above.

### units[0].learn.terms[1] ("term-1"): ✅

Content: name "DHCPDISCOVER", idea "Looking for a server".

- RFC 2131 §3.1 (defining standard: the DHCPDISCOVER message): "DHCPDISCOVER -  Client broadcast to locate available servers."
- Currency: as above.

### units[0].learn.terms[2] ("term-2"): ✅

Content: name "DHCPOFFER", idea "A server’s offer of an address".

- RFC 2131 §3.1 (defining standard: the DHCPOFFER message): "DHCPOFFER    -  Server to client in response to DHCPDISCOVER with offer of configuration parameters." Step 2: "a DHCPOFFER message that includes an available network address in the 'yiaddr' field".
- Currency: as above.

### units[0].learn.pattern ("pattern"): ✅

Content: names "DHCP Discover", "DHCP Offer"; note "The device looks for a server first; a server then offers an address."

- RFC 2131 §3.1 (defining standard: the order of the DHCP allocation exchange): "1. The client broadcasts a DHCPDISCOVER message on its local physical subnet." and "2. Each server may respond with a DHCPOFFER message that includes an available network address".
- Currency: as above.

### units[0].learn.why[0] ("why-1"): ❌

Text: "The client broadcasts its DHCPDISCOVER on its local physical subnet."

- RFC 2131 §3.1 (not marked defining): "The client broadcasts a DHCPDISCOVER message on its local physical subnet." This states the claim.
- RFC 9110 §9.3.1: does not state it. The section is about the HTTP GET method: "The GET method requests transfer of a current selected representation for the target resource." It says nothing about DHCP.
- Currency: both RFCs are current.
- **What is wrong:** the second citation, RFC 9110 §9.3.1 (HTTP GET), does not state the claim at all, so the claim also lacks the second independent source it needs (the RFC 2131 citation is not marked as a defining standard). The claim itself is true.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper): ✅

Text: "DHCP runs over UDP. Messages from a client to a server go to port 67, and messages from a server to a client go to port 68."

- RFC 2131 §4.1 (defining standard: DHCP's transport and ports): "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67), and DHCP messages from a server to a client are sent to the 'DHCP client' port (68)."
- Currency: as above. RFC 3396 deletes one other sentence of §4.1 (about options appearing only once). It does not touch this passage.

### units[0].learn.facts[0] ("fact-1"): ✅

Content: "DHCP server port" = "UDP 67".

- RFC 2131 §4.1 (defining standard: the DHCP server port): "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67)".
- Currency: as above.

### units[0].learn.facts[1] ("fact-2"): ✅

Content: "Getting a new address" = "DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, then DHCPACK".

- RFC 2131 §3.1 (defining standard: the exchange for allocating a new network address): steps 1 to 4 give the order, with "The client broadcasts a DHCPREQUEST message" (step 3) and "The server selected in the DHCPREQUEST message ... responds with a DHCPACK message" (step 4), after DHCPDISCOVER (step 1) and DHCPOFFER (step 2).
- Currency: as above. RFC 4361 removes "'chaddr' or" wording from §3.1 items 4 and 6, which does not change the message order.

### units[0].learn.facts[2] ("fact-3"): ⚠️

Content: "HTTP/1.1" = "Defines the GET method".

- RFC 2616 §9.3 (marked defining standard): "The GET method means retrieve whatever information (in the form of an entity) is identified by the Request-URI." RFC 2616 is titled "Hypertext Transfer Protocol -- HTTP/1.1".
- Currency: the RFC Editor lists RFC 2616 as obsoleted by RFC 7230, 7231, 7232, 7233, 7234 and 7235. RFC 9110 in turn obsoletes RFC 7230 to 7233 and 7235 (RFC 9110's info page). The current definition of GET is RFC 9110 §9.3.1, "HTTP Semantics", which is not specific to HTTP/1.1.
- **What is wrong:** the only citation is obsoleted, so it is not the current document that defines GET, and the claim describes a superseded arrangement. GET is now defined in version-independent HTTP Semantics (RFC 9110), not in an HTTP/1.1 specification.

### units[0].practice[0].options[0] (question "q1"): ✅

Content: text "DHCPDISCOVER", right: true, feedback "Right. A device with no address broadcasts a DHCPDISCOVER to find a DHCP server."

- RFC 2131 §3.1 (defining standard: the DHCPDISCOVER message): "The client broadcasts a DHCPDISCOVER message on its local physical subnet." Table 2: "Client broadcast to locate available servers." It is the right answer, and the feedback correctly says so.
- Currency: as above.

### units[0].practice[0].options[1] (question "q1"): ❌

Content: text "HTTPS", right: false, feedback "Not quite. HTTPS uses TCP port 443."

- RFC 2131 §4.1 (marked defining standard): does not state it. The section defines DHCP's own UDP ports 67 and 68 and never mentions HTTPS, TCP or port 443. A search of the whole RFC finds neither "HTTPS" nor "443".
- Currency: RFC 2131 is current.
- **What is wrong:** the cited section does not state the feedback's claim ("HTTPS uses TCP port 443"), and the defining-standard marker is wrong: RFC 2131 does not define HTTPS or its port. ("Not quite" correctly marks the option as wrong, but its claim is unsupported.)

## 2. Traced, example and analogy parts, and unbacked items

| Key | Kind | Verdict | Note |
| --- | --- | --- | --- |
| `title` | unbacked | ✅ | "DHCP canary" makes no factual claim. |
| `units[0].name` | unbacked | ✅ | "DHCP" names the topic. |
| `backing (the lesson's subtitle and summary)` | traced | ✅ | Restates lead-1 and lead-2. |
| `units[0].backing (the unit's full name and purpose)` | traced | ✅ | Full name from term-dhcp, purpose from lead-1 and lead-2. |
| `units[0].scene.backing (the scene)` | traced | ✅ | A laptop and a DHCP server on a local network, a broadcast and a reply: all in lead-1 and lead-2. No addresses or extra claims. |
| `units[0].overview.hookBacking (the Overview hook)` | analogy | ✅ | Calling out to a room, with whoever can answering with an offer, matches a broadcast DISCOVER and possible OFFERs. Not misleading. |
| `units[0].overview.backing (the Overview description)` | traced | ✅ | Restates lead-1 and lead-2. |
| `units[0].overview.facts[0] (Overview fact "Example address")` | example | ✅ | 192.0.2.10 is in RFC 5737's 192.0.2.0/24. |
| `units[0].steps[0] (step "discover")` | traced | ✅ | Restates lead-1. |
| `units[0].steps[0].facts[0] (step "discover", fact "Message")` | traced | ✅ | DHCPDISCOVER is named in term-1. |
| `units[0].steps[0].facts[1] (step "discover", fact "To port")` | traced | ✅ | UDP 67 is stated in deep-1 and fact-1. |
| `units[0].steps[0].events[0] (event "m1")` | traced | ✅ | Laptop broadcasts to look for a DHCP server: lead-1. |
| `units[0].steps[1] (step "offer")` | traced | ✅ | Restates lead-2 for the one server in the scene. |
| `units[0].steps[1].facts[0] (step "offer", fact "Offered address")` | example | ✅ | 192.0.2.10 is in RFC 5737's 192.0.2.0/24. |
| `units[0].steps[1].facts[1] (step "offer", fact "Lease time")` | traced | ❌ | **"8 days" is stated nowhere in fact-2, which it traces (fact-2 lists only the four messages), nor in any other Learn part.** It adds a value the lesson's cited parts do not state, and it contradicts lead-3's "24 hours". |
| `units[0].steps[1].events[0] (event "m2")` | traced | ✅ | Server offers the laptop an address: lead-2. |
| `units[0].practice[0].prompt (question "q1")` | unbacked | ✅ | No claim beyond lead-1, and no false premise. |

## 3. Sources

| Id | Current | Checked | How |
| --- | --- | --- | --- |
| `rfc-2131` | yes | 2026-11-08 | Fetched rfc2131.txt and the HTML page from rfc-editor.org. The info page (rfc-editor.org/info/rfc2131) lists no "Obsoleted by". It lists updates by RFC 4361, 5494, 6842 and 3396. Each was fetched and its changes to RFC 2131 read: client identifiers (4361, 6842), ARP and hardware-type IANA rules (5494), and option concatenation in §4.1 (3396). None changes the message exchange, broadcast or ports that these claims rely on. Cited anchors #section-1, #section-3.1 and #section-4.1 exist. |
| `rfc-9110` | yes | 2026-11-08 | Fetched rfc9110.txt and the HTML page. The info page lists no "Obsoleted by" and no "Updated by". It obsoletes RFC 7230 to 7233, 7235, 2818, 7538, 7615 and 7694. Anchor #section-9.3.1 exists. |
| `rfc-2616` | **no** | 2026-11-08 | Fetched rfc2616.txt and the HTML page. The info page lists "Obsoleted by (6) RFC 7230 ... RFC 7235". RFC 9110 in turn obsoletes 7230 to 7233 and 7235. |
| `microsoft-dhcp` | yes | 2026-11-08 | Fetched from learn.microsoft.com (HTTP 200). This is Microsoft's own product documentation, an allowed vendor. Last updated 2025-05-13. It applies to Windows Server 2025, 2022, 2019 and 2016, all current products. The #why-use-dhcp section exists. |

## 4. Limit overrides

None.
