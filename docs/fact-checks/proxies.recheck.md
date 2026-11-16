```json fact-check
{
  "slug": "proxies",
  "base": "4247ed6a908dc6be79da665546d0df7ee26d44693fec54432ef79f66d3b803cf",
  "hash": "f4aff599fc2ed839913e42882f08ce1eea8a82026aa82c4b780dad7c037d5c28",
  "checked": "2026-11-16",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].steps[2] (step \"tunnel\")": "✅",
    "units[0].steps[2].facts[3] (step \"tunnel\", fact \"A proxy\")": "✅",
    "units[0].learn.facts[3] (\"fact-not-sealed\")": "✅",
    "units[0].practice[0].options[0] (question \"who-sees\")": "✅",
    "units[0].practice[0].options[1] (question \"who-sees\")": "✅",
    "units[0].practice[0].options[2] (question \"who-sees\")": "✅",
    "units[0].practice[0].prompt (question \"who-sees\")": "✅",
    "units[0].practice[1].prompt (question \"reverse\")": "✅"
  },
  "sources": [
    { "id": "cloudflare-http-headers", "current": true, "checked": "2026-11-16" },
    { "id": "paloalto-proxy-server", "current": true, "checked": "2026-11-16" },
    { "id": "rfc-7239", "current": true, "checked": "2026-11-16" },
    { "id": "rfc-9110", "current": true, "checked": "2026-11-16" },
    { "id": "rfc-9846", "current": true, "checked": "2026-11-16" }
  ],
  "quotes": {
    "checked": "2026-11-16",
    "count": 17,
    "digest": "4060bfd945da60035216f49e2c85c801fc0d2ce41eb115ed137a6ad67e3f74bd",
    "files": {
      "paloalto-proxy-server": "b2b7bbe427cbc375877a366204b858c7654e03db7aa2708fb5dd85d54a750744",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "rfc-9846": "b1bee06a814f92ca4677c85b97519be53869b2bf8edc79ade955fb51c0402b17",
      "rfc-7239": "f15c45c9e079684bc4284d041be63285923962448cb0d8540d54106c68c2a40d",
      "cloudflare-http-headers": "ecff2daf246839988c95c390e8645c2ef7bb046643e20fd45ea4b02601999859"
    }
  }
}
```

# Fact-check re-check: Proxies

Targeted re-check of the 10 items the re-check sheet lists. Context parts were read, not judged.

## Claims

### units[0].learn.facts[3] ("fact-not-sealed") — ✅

"Does a proxy encrypt? not by itself; over HTTPS the seal is your browser's and the site's"

- `paloalto-proxy-server` §What does a proxy server do?
  > Proxies are used for privacy, access control, and performance optimization—but do not encrypt traffic by default.
- `paloalto-proxy-server` §What are the limitations of proxy servers?
  > Basic proxies don't encrypt traffic, exposing data on public or untrusted networks.
- `rfc-9110` §9.3.6
  > Tunnels are
  > commonly used to create an end-to-end virtual connection, through one
  > or more proxies, which can then be secured using TLS
- Note: RFC 9110 §9.3.6 defines the CONNECT method and the tunnel it opens; it places the TLS protection on the end-to-end connection through the proxy, not in the proxy.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
- Note: RFC 9846 defines TLS 1.3; its §1 states that the secure channel is between the two endpoints.
- Note: "not by itself" now matches the vendor's "by default" and leaves room for proxies reached over TLS and for a reverse proxy that holds the site's certificate (which the lesson teaches separately, acting as the site's end). Confirmed by the vendor page and RFC 9110, independent.
- Note: RFC 9110 (Internet Standard) and RFC 9846 are not obsoleted or updated; the Palo Alto page is live, checked 2026-11-16.

### units[0].practice[0].options[0] (question "who-sees") — ✅

"The site sees the proxy's address. The proxy sees the site's name, but can't read your request." (right; feedback agrees)

- `rfc-9110` §9.3.6
  > CONNECT uses a special form of request target, unique to this method,
  > consisting of only the host and port number of the tunnel
  > destination
- Note: RFC 9110 defines CONNECT: the proxy is given the site's name and port, and then forwards blindly.
- `rfc-7239` §1
  > these proxies make the requests appear as if
  > they originated from the proxy's IP address
- `paloalto-proxy-server` §How do proxy servers hide IP addresses?
  > Thus, the destination server sees the proxy's IP address, not the user's, effectively masking the original IP address.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
- Note: The site seeing the proxy's address is confirmed by RFC 7239 and the Palo Alto page; the name in the CONNECT by RFC 9110 (defining); the sealed request by RFC 9846 (defining). Leaves out proxies set up to open HTTPS, which the lesson's Go deeper covers.
- Note: All four sources current, checked 2026-11-16.

### units[0].practice[0].options[1] (question "who-sees") — ✅

"The proxy encrypts your request, so no one can tell which site you visit." (wrong; feedback: a proxy doesn't encrypt by itself, the seal is HTTPS's, and the proxy sees which site you asked for)

- `paloalto-proxy-server` §What does a proxy server do?
  > Proxies are used for privacy, access control, and performance optimization—but do not encrypt traffic by default.
- `paloalto-proxy-server` §What are the limitations of proxy servers?
  > Basic proxies don't encrypt traffic, exposing data on public or untrusted networks.
- `rfc-9110` §9.3.6
  > The CONNECT method requests that the recipient establish a tunnel to
  > the destination origin server identified by the request target
- Note: RFC 9110 defines CONNECT, whose request target names the destination, so the proxy knows the site.
- `rfc-9846` §1
  > The primary goal of TLS is to provide a secure channel between two
  > communicating peers
- Note: RFC 9846 defines TLS; the seal is between the two peers. The option is correctly marked wrong.
- Note: All sources current, checked 2026-11-16.

### units[0].practice[0].options[2] (question "who-sees") — ✅

"The site still sees your home's address." (wrong; feedback: the site's connection comes from the proxy; yours only reaches it if a proxy writes it in a header, and a tunnel can't)

- `rfc-7239` §1
  > Thus, to restore the desired functionality when a proxy is in
  > use, a way of disclosing the original information at the HTTP level
  > is needed.
- `paloalto-proxy-server` §How do proxy servers hide IP addresses?
  > Thus, the destination server sees the proxy's IP address, not the user's
- `rfc-7239` §4
  > Information
  > passed in this header field can be, for example, the source IP
  > address of the request
- Note: RFC 7239 defines the Forwarded header field, the standard header for passing the client's address.
- `rfc-9110` §3.7
  > A "tunnel" acts as a blind relay between two connections without
  > changing the messages.
- Note: RFC 9110 defines HTTP intermediaries, tunnel included: a tunnel does not change messages, so it adds no header.
- `cloudflare-http-headers` §X-Forwarded-For
  > X-Forwarded-For maintains proxy server and original visitor IP addresses.
- Note: The "only" leaves out rarer leaks (a misconfigured proxy, or the browser revealing the address itself); in the ordinary case a header is the way the address passes on.
- Note: All sources current, checked 2026-11-16.

## Traced, example, analogy and unbacked parts

### units[0].steps[2] (step "tunnel") — ✅

- Note: Traces term-tunnel, fact-connect, fact-https, fact-sees, fact-knows, fact-not-sealed and lead-1; the address 203.0.113.30 is RFC 5737 example data set up in the step before. Says nothing beyond them, and follows the CONNECT step in order.

### units[0].steps[2].facts[3] (step "tunnel", fact "A proxy") — ✅

- Note: Repeats fact-not-sealed; the step is about an HTTPS tunnel, so dropping "over HTTPS" adds nothing.

### title — ✅

- Note: "Proxies" names the lesson's topic; no claim.

### units[0].name — ✅

- Note: "Proxy" names the unit's topic; no claim.

### units[0].practice[0].prompt (question "who-sees") — ✅

- Note: No false premise; forward proxy and HTTPS are taught in Learn.

### units[0].practice[1].prompt (question "reverse") — ✅

- Note: A reverse proxy in front of a site's server is taught in lead-2 and term-reverse; no false premise.

## Sources

- `cloudflare-http-headers`: vendor documentation, live, describes the current product; checked 2026-11-16.
- `paloalto-proxy-server`: vendor explainer page (Cyberpedia), live, describes current practice; checked 2026-11-16.
- `rfc-7239`: Proposed Standard, not obsoleted or updated per the RFC Editor's metadata; checked 2026-11-16.
- `rfc-9110`: Internet Standard, not obsoleted or updated; checked 2026-11-16.
- `rfc-9846`: TLS 1.3, Proposed Standard (July 2026, obsoletes RFC 8446), not obsoleted or updated; checked 2026-11-16.
