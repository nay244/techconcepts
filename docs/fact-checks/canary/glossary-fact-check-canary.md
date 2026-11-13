```json fact-check
{
  "slug": "glossary/fact-check-canary",
  "hash": "693053b92d2b8de12185d2917ebced8b0850537d341de7fee1d03df3ce72ae6c",
  "checked": "2026-11-13",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "entry \"dhcp\": names": "❌",
    "entry \"dhcp\": statement \"dhcp-1\"": "✅",
    "entry \"dhcp\": statement \"dhcp-2\"": "✅",
    "entry \"discover\": names": "✅",
    "entry \"discover\": statement \"discover-1\"": "✅",
    "entry \"discover\": lessons": "✅",
    "entry \"lease\": names": "✅",
    "entry \"lease\": statement \"lease-1\"": "❌",
    "entry \"offer\": names": "✅",
    "entry \"offer\": statement \"offer-1\"": "✅",
    "entry \"offer\": lessons": "❌",
    "entry \"request\": names": "✅",
    "entry \"request\", sense \"dhcp\": label": "✅",
    "entry \"request\", sense \"dhcp\": statement \"request-dhcp-1\"": "⚠️",
    "entry \"request\", sense \"http\": label": "✅",
    "entry \"request\", sense \"http\": statement \"request-http-1\"": "✅",
    "entry \"request\", sense \"http\": statement \"request-http-2\"": "❌"
  },
  "sources": [
    { "id": "rfc-2131", "current": true, "checked": "2026-11-13" },
    { "id": "rfc-2616", "current": false, "checked": "2026-11-13", "note": "Obsoleted by RFCs 7230 to 7235, which RFC 9110 and its companions have in turn obsoleted." },
    { "id": "rfc-9110", "current": true, "checked": "2026-11-13" }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-13",
    "count": 11,
    "digest": "ba378d63587ac2fe2345862fa25bdc8812562e1d2e3fd0d15fcc311b0b8a6a79",
    "files": {
      "rfc-2131": "a043b705785b81762505ded4cf71d61392b2b1da2b4ce1e32c13bc984de5f4a5",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "rfc-2616": "10211d2885196b97b1c78e1672f3f68ae97c294596ef2b7fd890cbd30a3427bf"
    }
  },
  "items": {
    "entry \"dhcp\": names": "1e19683f69133905d78ba5cc265aec057ed376caee607f11b0434140793ba370",
    "entry \"dhcp\": statement \"dhcp-1\"": "7efb25d6199bf82a87a8cf37d4eb9fbedcc223704f91f8a503c10e1573fe23e3",
    "entry \"dhcp\": statement \"dhcp-2\"": "89c6dbb585bce3ac7888253cec35cd26606abf9f32aa1fc3f1f825dc1211c413",
    "entry \"discover\": names": "7fbf779cfe06e8c29ad1987a361cefb4942934503b7305a35f405f9c787bfee2",
    "entry \"discover\": statement \"discover-1\"": "d3665a309ae37e519413ee19e92116b2d62598cbc7b8241143a9f35641746d32",
    "entry \"discover\": lessons": "0671951a804952e6c4307ba2cae552041af532f14422f0de8459e3f85c9fa16a",
    "entry \"lease\": names": "9027bbcefd92b79f122062a8ebcff286cc3c7a699d0df5fdfb3de9f54b0f34a6",
    "entry \"lease\": statement \"lease-1\"": "18ddcf7b4e17a8171f83ec1c0ccb568f3290a9ae1fa2d080584beec939617b83",
    "entry \"offer\": names": "49d11f65f372942e76486a7142610b1889b6a83ff06d94916a5ed0022abb971a",
    "entry \"offer\": statement \"offer-1\"": "c8d2260e126199a96544d19ffbf935ad3b2b00ea57b3330c44bef61ad7a6aeed",
    "entry \"offer\": lessons": "575e2e2ff18e51e3de3d121c4791e16e39c99b7281708e12b93ba1cb11e17b13",
    "entry \"request\": names": "133e8cd733ff9e99cde5418205a08fee65d5822fb18f92079c745fbbe83e2f4f",
    "entry \"request\", sense \"dhcp\": label": "839e409643d149ce64ba73e13b9ef4303255f2fe39f3d1814b3e313cf0bd73a5",
    "entry \"request\", sense \"dhcp\": statement \"request-dhcp-1\"": "e7f389641f8ecb3361ee63f1721030bd3b1f13bdb08f5177e619e647ef6e21b6",
    "entry \"request\", sense \"http\": label": "44db078db20c441b7bae7fc30272af7195071d6c330b8a907156788dcf921ba1",
    "entry \"request\", sense \"http\": statement \"request-http-1\"": "60157d03c62832608f1e0eeaa5c8c1a4141d66865aeee50851ba1ebd1d062f6d",
    "entry \"request\", sense \"http\": statement \"request-http-2\"": "0c60e14a94a31b82291e707a26b5d033c649bb88ba4aa68284a951876a0655ba"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: glossary/fact-check-canary

Checked 2026-11-13 by claude-opus-5-5 against the plain-text RFCs from www.rfc-editor.org and their RFC Editor info pages.

## Claims

### entry "dhcp": statement "dhcp-1" — ✅

The Dynamic Host Configuration Protocol (DHCP) provides configuration parameters to Internet hosts.

- `rfc-2131` §1
  > The Dynamic Host Configuration Protocol (DHCP) provides configuration
  > parameters to Internet hosts.
- Note: RFC 2131 is the defining standard of DHCP for IPv4: it specifies the protocol, its messages and its procedures. The marker is right.
- Note: Current. RFC 2131 is Standards Track and not obsoleted; it is updated by RFCs 3396, 4361, 5494 and 6842, none of which changes this sentence.

### entry "dhcp": statement "dhcp-2" — ✅

DHCP messages travel over UDP: a client's messages go to the server port, 67, and a server's go to the client port, 68.

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol. DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67), and DHCP
  > messages from a server to a client are sent to the 'DHCP client' port
  > (68).
- Note: RFC 2131 defines how DHCP messages are sent, including the transport and the two port numbers. The marker is right.
- Note: Current, as above; none of the updating RFCs changes the ports.

### entry "discover": statement "discover-1" — ✅

A client looking for an address broadcasts a discover message, DHCPDISCOVER, to find the servers that can give it one.

- `rfc-2131` §3.1
  > The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the DHCPDISCOVER message and the exchange that allocates an address. The marker is right.
- Note: "servers that can give it one" puts "available servers" in plain words; the section is about allocating a network address, so the reading holds.
- Note: Current, as above.

### entry "lease": statement "lease-1" — ❌

A DHCP server always lends an address, as a lease, for exactly 24 hours.

- `rfc-2131` §1
  > In "dynamic allocation", DHCP assigns an IP address to a
  > client for a limited period of time (or until the client explicitly
  > relinquishes the address).
- `rfc-2131` §1
  > In "automatic allocation", DHCP assigns a permanent IP address to a
  > client.
- Note: Current, as above.
- Note: Wrong. The cited section gives no fixed length for a lease, let alone 24 hours, and "always" is contradicted by the same section: automatic allocation gives a permanent address, and manual allocation only conveys an address an administrator assigned. A beginner would believe every lease lasts exactly a day.

### entry "offer": statement "offer-1" — ✅

Each server that receives a discover message may answer with an offer message, DHCPOFFER, that holds an address it can give.

- `rfc-2131` §3.1
  > Each server may respond with a DHCPOFFER message that includes an
  > available network address in the 'yiaddr' field
- Note: RFC 2131 defines the DHCPOFFER message. The marker is right.
- Note: Current, as above.

### entry "request", sense "dhcp": statement "request-dhcp-1" — ⚠️

After choosing one offer, the client broadcasts a request message, DHCPREQUEST, asking for the offered address.

- `rfc-2131` §3.1
  > The client chooses one server from which to request configuration
  > parameters, based on the configuration parameters offered in the
  > DHCPOFFER messages. The client broadcasts a DHCPREQUEST message
- `rfc-2131` §3.1
  > The 'requested IP address' option MUST be set to the value of 'yiaddr' in the
  > DHCPOFFER message from the server.
- Note: Current, as above.
- Note: Not confirmed. Neither citation carries the defining-standard marker, so the claim needs two independent sources that each state it. Only RFC 2131 §3.1 does. The second citation, RFC 9110 §9.3.1, is the HTTP GET method and says nothing about DHCP, so it cannot be the second source. The claim itself is true; the fix is to mark RFC 2131 §3.1 as the defining standard and drop the RFC 9110 citation.

### entry "request", sense "http": statement "request-http-1" — ✅

A GET request asks for a current representation of the resource it names.

- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- Note: RFC 9110 is the current document that defines HTTP's method semantics, GET among them. The marker is right.
- Note: The claim leaves out "selected" and says "the resource it names" for the target resource; a fair beginner's reading.
- Note: Current. RFC 9110 is an Internet Standard and the RFC Editor lists it as neither obsoleted nor updated.

### entry "request", sense "http": statement "request-http-2" — ❌

GET is the method a browser uses to fetch a page.

- `rfc-2616` §9.3
  > The GET method means retrieve whatever information (in the form of an
  > entity) is identified by the Request-URI.
- Note: Not current. The RFC Editor lists RFC 2616 as obsoleted by RFCs 7230 to 7235, and RFC 9110 has since obsoleted those.
- Note: Wrong marker. The citation is marked as the defining standard, but an obsoleted RFC is no longer the document that defines GET; RFC 9110 §9.3.1 is. The section also says nothing about browsers, so the claim's browser part rests only on reading the retrieval sentence loosely. The claim is true in the ordinary case; the fix is to cite RFC 9110 §9.3.1 as the defining standard.

## Names, labels and ties

### entry "dhcp": names — ❌

- Note: "DHCP" and "Dynamic Host Configuration Protocol" are both given by statement dhcp-1. "Dynamic Host Control Protocol" is given by no statement and is a wrong expansion of the acronym: no cited section names the protocol that way, and a beginner would learn a false full name.

### entry "discover": names — ✅

- Note: Statement discover-1 gives both "discover" (a discover message) and "DHCPDISCOVER" as names of this message.

### entry "discover": lessons — ✅

- Note: The lesson term "DHCPDISCOVER", with the idea "Looking for a server", names the same message as this entry, and the idea agrees with the definition.

### entry "lease": names — ✅

- Note: Statement lease-1 uses "a lease" for the thing this entry names. That statement fails on its own (above), but the name itself is the right one.

### entry "offer": names — ✅

- Note: Statement offer-1 gives both "offer" (an offer message) and "DHCPOFFER" as names of this message.

### entry "offer": lessons — ❌

- Note: The tied lesson term is "Dynamic Host Configuration Protocol (DHCP)", with the idea "Giving devices their network settings". It names the whole protocol, not the offer message this entry defines, so the tie joins two different things.

### entry "request": names — ✅

- Note: "Request" is used by both senses' statements: request-dhcp-1 (a request message) and request-http-1 (a GET request).

### entry "request", sense "dhcp": label — ✅

- Note: The label "In DHCP" matches the sense, whose statement is about the DHCPREQUEST message.

### entry "request", sense "http": label — ✅

- Note: The label "In HTTP" matches the sense, whose statements are about the HTTP GET method.

## Sources

- `rfc-2131`: current. The RFC Editor info page lists it as Standards Track, not obsoleted, updated by RFCs 3396, 4361, 5494 and 6842; none of those changes the parts cited here. Checked 2026-11-13.
- `rfc-2616`: not current. The RFC Editor info page lists it as obsoleted by RFCs 7230, 7231, 7232, 7233, 7234 and 7235. Checked 2026-11-13.
- `rfc-9110`: current. The RFC Editor info page lists no RFC that obsoletes or updates it. Checked 2026-11-13.

## Limit overrides

None.
