```json fact-check
{
  "slug": "proxies",
  "base": "4247ed6a908dc6be79da665546d0df7ee26d44693fec54432ef79f66d3b803cf",
  "hash": "8b2bf58e87a7c5d1344c43ca85aa4c6aa8b5baead616d395ae47e64d03748876",
  "checked": "2026-11-16",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].steps[2] (step \"tunnel\")": "✅",
    "units[0].steps[2].facts[3] (step \"tunnel\", fact \"A proxy\")": "⚠️",
    "units[0].learn.facts[3] (\"fact-not-sealed\")": "✅",
    "units[0].practice[0].prompt (question \"who-sees\")": "✅",
    "units[0].practice[1].prompt (question \"reverse\")": "✅"
  },
  "sources": [
    { "id": "paloalto-proxy-server", "current": true, "checked": "2026-11-16" },
    { "id": "rfc-9110", "current": true, "checked": "2026-11-16" },
    { "id": "rfc-9846", "current": true, "checked": "2026-11-16" }
  ],
  "quotes": {
    "checked": "2026-11-16",
    "count": 4,
    "digest": "ec0789bafc100e1d38db83ffb71225a4158a542c1e3d4375c6d07e46725ab0de",
    "files": {
      "paloalto-proxy-server": "74db85fa64ed909dcb30747f767ca58f90cd67990b0b2a7c640c955d81a37973",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "rfc-9846": "b1bee06a814f92ca4677c85b97519be53869b2bf8edc79ade955fb51c0402b17"
    }
  }
}
```

# Fact-check re-check: proxies

## Claims

### units[0].learn.facts[3] ("fact-not-sealed") — ✅

"Does a proxy encrypt? not by itself; over HTTPS the seal is your browser's and the site's"

- `paloalto-proxy-server` §What does a proxy server do?
  > Proxies are used for privacy, access control, and performance optimization—but do not encrypt traffic by default.
- `paloalto-proxy-server` §What are the limitations of proxy servers?
  > Basic proxies don't encrypt traffic, exposing data on public or untrusted networks.
- `rfc-9110` §9.3.6
  > The CONNECT method requests that the recipient establish a tunnel to
  > the destination origin server identified by the request target and,
  > if successful, thereafter restrict its behavior to blind forwarding
  > of data, in both directions, until the tunnel is closed.  Tunnels are
  > commonly used to create an end-to-end virtual connection, through one
  > or more proxies, which can then be secured using TLS
- Note: RFC 9110 defines HTTP's semantics, including intermediaries and the CONNECT method; it is the defining standard for how a proxy relays a tunnel without taking part in its security, which the endpoints add over TLS.
- `rfc-9846` §1
  > Confidentiality: Data sent over the channel after establishment is
  > only visible to the endpoints.
- Note: RFC 9846 defines TLS 1.3 and its security properties, here that the protected data is visible only to the two endpoints.
- Note: Two independent sources: the Palo Alto Networks explainer and RFC 9110 each say a proxy adds no encryption of its own (the vendor directly, the RFC by restricting a tunnelling proxy to blind forwarding); RFC 9110 and RFC 9846 place the seal at the two ends.
- Note: True for a beginner. "Not by itself" leaves room for the cases the lesson teaches elsewhere: a TLS-terminating reverse proxy holds the site's own certificate, so it carries the site's side of the seal, and an inspecting proxy (Go deeper) shows a certificate of its own on devices set up to trust it. The vendor page also mentions that enterprise proxies can terminate TLS for inspection, which agrees with the Go deeper part.
- Note: Currency: RFC 9110 (Internet Standard) and RFC 9846 (Standards Track, obsoletes RFC 8446) are not listed as obsoleted on the RFC Editor's pages; the Palo Alto page is live and describes current practice. Checked 2026-11-16.

### units[0].steps[2].facts[3] (step "tunnel", fact "A proxy") — ⚠️

"A proxy: doesn't encrypt: the seal is your browser's and the site's"

- Note: It traces to fact-not-sealed, which now reads "not by itself"; this step fact drops that qualifier and keeps the flat statement that a proxy does not encrypt, under the general label "A proxy".
- Note: That says more than its Learn part, and it contradicts the lesson's own later step "passed-on", where the reverse proxy seals the page for you, and the TLS-termination term and the inspection Go deeper, where a proxy does seal traffic.
- Note: What is wrong: the flat "doesn't encrypt" goes beyond fact-not-sealed ("not by itself") and conflicts with what the lesson teaches about reverse proxies; it should carry the same qualifier (for example "doesn't encrypt by itself") or name the tunnel case.

## Traced, example, analogy and unbacked parts

### title — ✅

- Note: "Proxies" names the lesson's subject and makes no claim.

### units[0].name — ✅

- Note: "Proxy" names the unit's subject and makes no claim.

### units[0].steps[2] (step "tunnel") — ✅

- Note: Each sentence traces: the browser sealing the line with the site and then sending its request (fact-connect, fact-https), the proxy passing sealed bytes without reading them (term-tunnel, fact-connect), the site seeing the proxy's address rather than yours (fact-sees, lead-1), and the proxy knowing your address and the site's name from the CONNECT (fact-knows, fact-connect). 203.0.113.30 is RFC 5737 example data, the proxy's address set in the step before. Nothing in it conflicts with the changed fact-not-sealed.

### units[0].practice[0].prompt (question "who-sees") — ✅

- Note: The prompt describes a forward proxy used for an HTTPS site, a setup the lesson teaches (fact-connect, fact-setup); no false premise.

### units[0].practice[1].prompt (question "reverse") — ✅

- Note: A reverse proxy in front of a site's web server is what lead-2 and term-reverse teach; the question has no false premise.

## Sources

- `paloalto-proxy-server`: fetched from paloaltonetworks.com (HTTP 200); a live vendor explainer page describing current practice. Checked 2026-11-16.
- `rfc-9110`: fetched from rfc-editor.org; Internet Standards Track; the RFC Editor's page lists no RFC obsoleting or updating it. Checked 2026-11-16.
- `rfc-9846`: fetched from rfc-editor.org; Internet Standards Track, obsoletes RFC 8446; the RFC Editor's page lists no RFC obsoleting it. Checked 2026-11-16.
