```json fact-check
{
  "slug": "what-is-tls",
  "base": "c25ffde03ca74415c397b32f4f7ba38ed6ab0f809695c9d0f5d79b7a6af3283c",
  "hash": "d918612efc67adc12abc7768ade67832c2a1bcf98b5e729a2b8d19f060ea4143",
  "checked": "2026-11-12",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "units[0].steps[1] (step \"serverhello\")": "✅"
  },
  "sources": [],
  "quotes": {
    "checked": "2026-11-12",
    "count": 0,
    "digest": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
    "files": {}
  }
}
```

# Re-check: what-is-tls

One item to judge: the ServerHello Watch step, a traced item. It cites nothing of its own, so it is judged against the Learn parts it traces to (term-serverhello, term-suite, term-shared, fact-kx, fact-fs, fact-keys, fact-handshake, fact-records, term-keyshare, fact-secret) and in its place between the ClientHello and Certificate Verification steps.

### units[0].steps[1] (step "serverhello") — ✅

- Note: The title and the subtitle repeat the ServerHello term and its idea word for word.
- Note: "The server answers with a ServerHello" is stated by the handshake fact. "Picks TLS 1.3 and one cipher suite" puts in a step's words the ServerHello term's idea (what will be used), answering the ClientHello's offer of versions and cipher suites, in the handshake the lesson describes as TLS 1.3's; it adds no value or name the Learn parts lack.
- Note: "Sends its own key share" follows from the key-share term (the public half sent across) and the shared-secret fact (each side combines its own secret half with the other's public half).
- Note: The sentence on the shared secret repeats the shared-secret fact and term. "It never crossed the network, so nobody watching can work it out" joins with "so" two things the shared-secret fact joins with "and"; read after the previous sentence (the secret is made from a secret half each side keeps), it does not give a beginner a false cause, so it passes as a simplification.
- Note: "After this message, everything the server sends is encrypted" rests on the handshake fact's statement that everything after the key exchange is encrypted, the ServerHello carrying the server's half of that exchange. It no longer says the ServerHello itself is encrypted, which was the full check's finding.
- Note: In place, the step follows the ClientHello (which sends the client's key share and offers suites) and comes before the certificate, CertificateVerify and Finished steps, the order the handshake fact gives. The lesson stays true and in order.

## Sources

None: the judged item cites no source.
