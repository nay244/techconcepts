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
      "note": "Obsoleted: the RFC Editor info page says 'This RFC is now obsolete, see RFC 7230, RFC 7231, RFC 7232, RFC 7233, RFC 7234, RFC 7235'; RFC 9110 in turn obsoletes RFCs 7231, 7232, 7233, 7235 and portions of 7230."
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

# Fact-check: fact-check-canary

Checked 2026-11-08 by claude-opus-5-5, from the claim sheet only. Every source was fetched from its publisher in this run: RFCs as plain text from rfc-editor.org, their RFC Editor info pages, and the Microsoft Learn page as HTML from learn.microsoft.com.

Verdicts: 29 ✅, 1 ⚠️, 4 ❌. The lesson does not pass.

## 1. Claims

### `units[0].osi`: "spans" — ✅

- No citations; checked by the "spans" rule. None of the allowed sources met in this run (RFC 2131 and the four RFCs that update it, the Microsoft Learn DHCP page, RFC 2616, RFC 9110) puts DHCP at a single OSI layer. RFC 2131 mentions layers only when describing what DHCP touches (for example "the network layer parameters" in §1.4 and the "link-layer destination address" in §4.1). The Microsoft page calls DHCP "a client/server protocol" and names no layer.
- Currency: see the sources section.

### `units[0].steps[0].deep[0]`: "The DHCPDISCOVER goes to UDP port 67, the DHCP server port." — ✅

- RFC 2131 §4.1 (defining standard: RFC 2131 defines DHCP's messages, its transport and its ports): "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67)". DHCPDISCOVER is a client message (§3.1 Table 2: "Client broadcast to locate available servers.").
- Currency: RFC 2131 is not obsoleted; its updates (RFC 3396, 4361, 5494, 6842) do not change the ports.

### `units[0].steps[1].deep[0]`: "The DHCPOFFER goes to UDP port 68, the DHCP client port." — ✅

- RFC 2131 §4.1 (defining standard: DHCP ports): "DHCP messages from a server to a client are sent to the 'DHCP client' port (68)." DHCPOFFER is a server-to-client message (§3.1 Table 2: "Server to client in response to DHCPDISCOVER with offer of configuration parameters.").
- Note: when a relay agent is used, §4.1 says the server sends to the relay's port 67; the claim is about delivery to the client, which matches the quoted rule.
- Currency: as above.

### `units[0].learn.lead[0]` ("lead-1"): "A device with no address broadcasts a DHCPDISCOVER message on its local network to find a DHCP server." — ✅

- RFC 2131 §3.1 (defining standard: the DHCP address-allocation exchange): "The client broadcasts a DHCPDISCOVER message on its local physical subnet." Table 2: "DHCPDISCOVER -  Client broadcast to locate available servers." The section is for a client without an address: "If the client already knows its address, some steps may be omitted".
- Currency: as above.

### `units[0].learn.lead[1]` ("lead-2"): "Each DHCP server that gets it may answer with a DHCPOFFER, which holds an address it can lend." — ✅

- RFC 2131 §3.1 (defining standard: the DHCP exchange): "Each server may respond with a DHCPOFFER message that includes an available network address in the 'yiaddr' field". "Lend" is a fair beginner word for a lease.
- Currency: as above.

### `units[0].learn.lead[2]` ("lead-3"): "A DHCP server always offers a lease of 24 hours." — ❌

- RFC 2131 §3.1: does not state it. It says lease length can vary: "The DHCPDISCOVER message MAY include options that suggest values for the network address and lease duration."
- Microsoft Learn, Why use DHCP?: does not state it. It treats lease length as a stored setting: "The lease duration, or the length of time for which the IP address can be used before a lease renewal is required."
- Currency: both sources current.
- Wrong: neither cited section states a fixed 24-hour lease, and the "always" is false. Lease length is a server setting, and the client can suggest one.

### `units[0].learn.terms[0]` ("term-dhcp"): idea "Giving devices their network settings", name "Dynamic Host Configuration Protocol (DHCP)" — ✅

- RFC 2131 §1 (defining standard: RFC 2131 defines DHCP and its name): "The Dynamic Host Configuration Protocol (DHCP) provides configuration parameters to Internet hosts."
- Currency: as above.

### `units[0].learn.terms[1]` ("term-1"): idea "Looking for a server", name "DHCPDISCOVER" — ✅

- RFC 2131 §3.1 (defining standard: the DHCP message types): "DHCPDISCOVER -  Client broadcast to locate available servers."
- Currency: as above.

### `units[0].learn.terms[2]` ("term-2"): idea "A server's offer of an address", name "DHCPOFFER" — ✅

- RFC 2131 §3.1 (defining standard: the DHCP message types): "DHCPOFFER    -  Server to client in response to DHCPDISCOVER with offer of configuration parameters." and "Each server may respond with a DHCPOFFER message that includes an available network address".
- Currency: as above.

### `units[0].learn.pattern` ("pattern"): "DHCP Discover", "DHCP Offer"; "The device looks for a server first; a server then offers an address." — ✅

- RFC 2131 §3.1 (defining standard: the order of the DHCP exchange): step 1, "The client broadcasts a DHCPDISCOVER message on its local physical subnet."; step 2, "Each server may respond with a DHCPOFFER message that includes an available network address".
- Currency: as above.

### `units[0].learn.why[0]` ("why-1"): "The client broadcasts its DHCPDISCOVER on its local physical subnet." — ❌

- RFC 2131 §3.1: "The client broadcasts a DHCPDISCOVER message on its local physical subnet." (Not marked as a defining standard.)
- RFC 9110 §9.3.1: does not state it. The section defines the HTTP GET method ("The GET method requests transfer of a current selected representation for the target resource.") and says nothing about DHCP.
- Currency: both sources current.
- Wrong: the second citation does not state the claim at all, so the two-source rule fails. The claim itself is true, but this citation is unrelated.

### `units[0].learn.deep[0]` ("deep-1"): "DHCP runs over UDP. Messages from a client to a server go to port 67, and messages from a server to a client go to port 68." — ✅

- RFC 2131 §4.1 (defining standard: DHCP transport and ports): "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67), and DHCP messages from a server to a client are sent to the 'DHCP client' port (68)."
- Currency: as above.

### `units[0].learn.facts[0]` ("fact-1"): "DHCP server port": "UDP 67" — ✅

- RFC 2131 §4.1 (defining standard: DHCP ports): "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67)".
- Currency: as above.

### `units[0].learn.facts[1]` ("fact-2"): "Getting a new address": "DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, then DHCPACK" — ✅

- RFC 2131 §3.1 (defining standard: the address-allocation exchange): Figure 3, "Timeline diagram of messages exchanged between DHCP client and servers when allocating a new network address", shows DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, DHCPACK in that order. Step 4: "The server selected in the DHCPREQUEST message commits the binding for the client to persistent storage and responds with a DHCPACK message".
- Currency: as above.

### `units[0].learn.facts[2]` ("fact-3"): "HTTP/1.1": "Defines the GET method" — ⚠️

- RFC 2616 §9.3 (marked defining standard): "The GET method means retrieve whatever information (in the form of an entity) is identified by the Request-URI." RFC 2616 did define GET for HTTP/1.1, but it is obsolete, so it is not the current defining document.
- Currency: RFC 2616 is obsolete. The RFC Editor says "This RFC is now obsolete, see RFC 7230, RFC 7231, RFC 7232, RFC 7233, RFC 7234, RFC 7235." Today GET is defined in RFC 9110 §9.3.1, HTTP Semantics, which "defines aspects of the protocol that are shared by all versions" (RFC 9110 abstract).
- Imprecise: rests on an obsolete source. Saying HTTP/1.1 defines GET follows the old RFC 2616 layout. Today GET belongs to HTTP Semantics, which every HTTP version shares.

### `units[0].practice[0].options[0]` (question "q1"): "DHCPDISCOVER" (right: true); feedback "Right. A device with no address broadcasts a DHCPDISCOVER to find a DHCP server." — ✅

- RFC 2131 §3.1 (defining standard: DHCP message types and exchange): "The client broadcasts a DHCPDISCOVER message on its local physical subnet." and "DHCPDISCOVER -  Client broadcast to locate available servers." It is the correct answer, and the feedback is correct.
- Currency: as above.

### `units[0].practice[0].options[1]` (question "q1"): "HTTPS" (right: false); feedback "Not quite. HTTPS uses TCP port 443." — ❌

- RFC 2131 §4.1 (marked defining standard): does not state it. The section covers DHCP's construction, transport and ports (67 and 68) and says nothing about HTTPS or port 443.
- Currency: RFC 2131 is current.
- Wrong: the cited section does not state the feedback's claim, and the defining-standard marker is wrong because RFC 2131 does not define HTTPS or its port.

## 2. Traced, example, analogy and unbacked parts

- `title` ("DHCP canary"), unbacked: ✅. It makes no claim.
- `units[0].name` ("DHCP"), unbacked: ✅.
- `backing` (subtitle and summary), traced to lead-1 and lead-2: ✅.
- `units[0].backing` (full name and purpose), traced to term-dhcp, lead-1 and lead-2: ✅.
- `units[0].scene.backing`, traced to lead-1 and lead-2: ✅. A laptop and a DHCP server on a local network, with a broadcast and a reply, add nothing beyond those parts. The `place: "router"` value is read as a layout slot. The reader sees the label "DHCP server".
- `units[0].overview.hookBacking`, analogy: ✅. Calling out to a whole room and getting an offer from whoever can help matches a broadcast that any server may answer.
- `units[0].overview.backing`, traced to lead-1 and lead-2: ✅.
- `units[0].overview.facts[0]` ("Example address" 192.0.2.10), example: ✅. The address is in RFC 5737's 192.0.2.0/24.
- `units[0].steps[0]` (step "discover"), traced to lead-1: ✅.
- `units[0].steps[0].facts[0]` ("Message": DHCPDISCOVER), traced to term-1: ✅.
- `units[0].steps[0].facts[1]` ("To port": UDP 67), traced to lead-1, deep-1 and fact-1: ✅.
- `units[0].steps[0].events[0]` (event "m1"), traced to lead-1: ✅.
- `units[0].steps[1]` (step "offer"), traced to lead-2: ✅.
- `units[0].steps[1].facts[0]` ("Offered address" 192.0.2.10), example: ✅. The address is in RFC 5737's 192.0.2.0/24.
- `units[0].steps[1].facts[1]` ("Lease time": "8 days"), traced to fact-2: ❌. fact-2 lists only the four message names and states no lease time. The value "8 days" appears in no Learn part, and it contradicts lead-3's "24 hours". A Watch fact may not add a value.
- `units[0].steps[1].events[0]` (event "m2"), traced to lead-2: ✅.
- `units[0].practice[0].prompt`, unbacked: ✅. It is backed by lead-1 and has no false premise.

## 3. Sources

- `microsoft-dhcp`: Microsoft Learn, "What is Dynamic Host Configuration Protocol (DHCP) Server in Windows Server?", fetched from learn.microsoft.com (HTTP 200). This is Microsoft's own documentation, not a blog, Q&A or community page. It applies to Windows Server 2025, 2022, 2019 and 2016, and the page says "Last updated on 2025-05-13". The `#why-use-dhcp` anchor exists. Current. Checked 2026-11-08.
- `rfc-2131`: RFC 2131, Dynamic Host Configuration Protocol, Draft Standard. The RFC Editor info page shows no obsoleting RFC and says "This RFC was updated, see RFC 3396, RFC 4361, RFC 5494, RFC 6842." I read those updates' abstracts. They cover repeated options (3396), client-identifier format (4361), ARP number allocation (5494) and returning the client identifier (6842). None changes the ports, the DISCOVER/OFFER exchange or lease handling relied on here. Current. Checked 2026-11-08.
- `rfc-2616`: RFC 2616, HTTP/1.1. The RFC Editor info page says "This RFC is now obsolete, see RFC 7230, RFC 7231, RFC 7232, RFC 7233, RFC 7234, RFC 7235." Not current. Checked 2026-11-08.
- `rfc-9110`: RFC 9110, HTTP Semantics, STD 97, Internet Standard. The RFC Editor info page shows no obsoleting or updating RFC. Current. Checked 2026-11-08. It is cited only by why-1, where the cited section is unrelated to the claim.

## 4. Limit overrides

None.
