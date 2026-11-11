```json fact-check
{
  "slug": "what-is-udp",
  "base": "338e66ef8078428738a4828c3c5bd6791f3e867803571ba8ad090613a06e8bd0",
  "hash": "f7c8ad1916f094d100a6ca0c98838e5fc738a48bd1faeaf6d2dda62a31425992",
  "checked": "2026-11-11",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "units[0].steps[3].deep[0] (step \"two-way-datagrams\", Go deeper)": "✅"
  },
  "sources": [
    { "id": "rfc-4787", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-4961", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-768", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-8085", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-8445", "current": true, "checked": "2026-11-11" }
  ],
  "quotes": {
    "checked": "2026-11-11",
    "count": 12,
    "digest": "73c6e05d544f07c03dc0fc04fe951eb87ee2a9dde862c0ab1fed902302de5499",
    "files": {
      "rfc-4961": "96746d264f4d9dd4aa410a08905e91bb5897b7784147a55d0da08945862880a3",
      "rfc-768": "7dc8880e1ecef9c3f9da0db4b876a16e96bfa4f0953cc9d977d414f8f680c2f0",
      "rfc-8085": "9fc8fa172098ef296040c6e3708d56ff5941fdeda3faf4071c58c68059629f3c",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "rfc-8445": "60bb913e8c8b2007f284105eef2faa2ea7e359dd4b73d7992557b3b11180065e"
    }
  }
}
```

# Re-check: What is UDP

One item judged, in its place under the step "Two-Way Datagrams", whose narrative (each side sends to the other's address and port and listens on its own) the paragraph extends without contradiction.

### units[0].steps[3].deep[0] (step "two-way-datagrams", Go deeper) — ✅

The paragraph makes four claims, each checked against the cited sections in this run.

Claim 1: The server can reply from the port it was sent to, back to the port the packets came from, as symmetric RTP recommends, and UDP does not require it.

- `rfc-4961` §3
  > A device supports symmetric RTP if it selects, communicates, and uses
  > IP addresses and port numbers such that, when receiving a
  > bidirectional RTP media stream on UDP port "A" and IP address "a", it
  > also transmits RTP media for that stream from the same source UDP
  > port "A" and IP address "a".
- Note: RFC 4961 is the document that defines symmetric RTP and symmetric RTCP; it is a Best Current Practice and is neither obsoleted nor updated. When both ends follow it, the server sends from the port it receives on (16384) and the laptop receives on the port it sends from (50900), which is exactly the reply path the lesson describes.
- `rfc-4961` §4
  > For these reasons, it is RECOMMENDED that symmetric RTP and symmetric
  > RTCP always be used for bidirectional RTP media streams.
- `rfc-4961` §1
  > However, UDP is not inherently bidirectional and UDP does not require
  > using the same port for sending and receiving bidirectional traffic.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port
  > of the sending process, and may be assumed to be the port to which a
  > reply should be addressed in the absence of any other information.
- Note: RFC 768 defines the UDP header fields; its wording ("may be assumed", "optional") agrees that replying to the source port is permitted, not required. A second independent document (RFC 768) confirms the reply-to-source-port point alongside RFC 4961.

Claim 2: The home router keeps state for the pair for a while, which lets replies back in through NAT.

- `rfc-8085` §3.5
  > Per-flow state is typically created when the first packet
  > crosses from the interior to the exterior, and while the state is
  > present, NATs and firewalls will forward return traffic.
- `rfc-4787` §4.3
  > The mapping timer is defined as the time a mapping will stay active
  > without packets traversing the NAT.

Claim 3: The standard says at least two minutes, except for some well-known destination ports.

- `rfc-4787` §4.3
  > REQ-5: A NAT UDP mapping timer MUST NOT expire in less than two
  > minutes, unless REQ-5a applies.
- `rfc-4787` §4.3
  > For specific destination ports in the well-known port range
  > (ports 0-1023), a NAT MAY have shorter UDP mapping timers that
  > are specific to the IANA-registered application running over
  > that specific destination port.
- `rfc-8085` §3.5
  > NATs
  > require a state timeout of 2 minutes or longer [RFC4787].
- Note: the exception is worded as the source words it (shorter timers permitted only for certain well-known destination ports), so no condition is dropped. RFC 4787's updates (RFC 6888, RFC 7857) were read for its timer requirement; neither changes the two-minute minimum.

Claim 4: During silences a call app may send small keep-alive packets to keep the path open.

- `rfc-8085` §3.5
  > Such specialized applications MAY
  > send periodic keep-alive messages to attempt to refresh middlebox
  > state (e.g., [RFC7675]).
- `rfc-8445` §11
  > An agent MUST send a keepalive on each candidate pair that is used
  > for sending data if no packet has been sent on that pair in the last
  > Tr seconds.
- `rfc-8445` §11
  > It SHOULD contain the FINGERPRINT attribute to aid in
  > demultiplexing, but it SHOULD NOT contain any other attributes.
- Note: RFC 8085 limits keep-alives to specialized applications such as media, and RFC 8445 sends them only when a pair has been quiet, so "during silences" and "may" match the sources; a STUN Binding Indication carrying at most one attribute supports "small".

- Note: currency, checked 2026-11-11 on each RFC Editor info page. RFC 768 is not obsoleted (updated by RFC 9868, transport options, which does not touch the source-port meaning); RFC 4961 is not obsoleted or updated; RFC 8085 is not obsoleted (updated by RFC 8899, PMTU discovery, unrelated to keep-alives or NAT state); RFC 4787 is not obsoleted (updated by RFC 6888 and RFC 7857, neither changing REQ-5); RFC 8445 is not obsoleted (updated by RFC 8863, ICE PAC, which does not change keepalives).

## Sources

- `rfc-4787`: RFC Editor info page lists it as a Best Current Practice, not obsoleted; updates RFC 6888 and RFC 7857 read for the mapping timer. Checked 2026-11-11.
- `rfc-4961`: RFC Editor info page lists it as a Best Current Practice, not obsoleted or updated. Checked 2026-11-11.
- `rfc-768`: RFC Editor info page lists it as an Internet Standard, not obsoleted; updated only by RFC 9868. Checked 2026-11-11.
- `rfc-8085`: RFC Editor info page lists it as a Best Current Practice, not obsoleted; updated only by RFC 8899. Checked 2026-11-11.
- `rfc-8445`: RFC Editor info page lists it as Standards Track, not obsoleted; updated only by RFC 8863. Checked 2026-11-11.
