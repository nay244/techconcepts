```json fact-check
{
  "slug": "what-is-ssh",
  "base": "cf771f8ac78ed7869a5341cc0e36dda485a2dc99324758bbb800325f853c5776",
  "hash": "f216f740ea67b03b6681ff77892f2b8321e530e042ff752a4cd8e9073c737909",
  "checked": "2026-11-12",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "units[0].osi": "✅",
    "units[0].steps[1].deep[0] (step \"algorithm-negotiation\", Go deeper)": "✅"
  },
  "sources": [
    { "id": "baeldung-ssh-intro", "current": true, "checked": "2026-11-12" },
    { "id": "cisco-ssh-configure", "current": true, "checked": "2026-11-12" },
    { "id": "cloudflare-ssh", "current": true, "checked": "2026-11-12" },
    { "id": "iana-ssh-parameters", "current": true, "checked": "2026-11-12" },
    { "id": "openbsd-man-ssh-config", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-10042", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-4253", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-5647", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-8709", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-9941", "current": true, "checked": "2026-11-12" }
  ],
  "quotes": {
    "checked": "2026-11-12",
    "count": 20,
    "digest": "64917e533b39fd467c3d1f67ab448bb8dfdf8e8d46931b9cb4478a589a7f07b1",
    "files": {
      "cloudflare-ssh": "319bdb8fdd68442fc11a54f061c9048404f27e497395a1264734a2380f3f7e5c",
      "baeldung-ssh-intro": "19a26e7772944f430357a73e16e9510c22416c395d650d9a637870eb5aebee60",
      "rfc-4253": "b471173305154f6c66facffcf7a4a25fc5c32765cb30542120be6c20a88f1ed3",
      "rfc-9941": "91b16505e6ab7a0dc676ebed94d8f984a73a3cfecffa8c45101c245953571cd5",
      "rfc-10042": "c874dfaa7414d90123c398c7a0575ed922f0d01131c0ed79edee146c33ac539c",
      "openbsd-man-ssh-config": "27b86744bdf4423258f63169042e114a3376e34d7ace5dbce6034483356d79ea",
      "rfc-8709": "ea4aa3a8feec6bd5b1cc7847a6d08cd0afae49d12220cac1e2c39bc72c29fd3d",
      "cisco-ssh-configure": "6aac60f00dd0868fd44895c826ef70c270e9efbb39ff54661c0ba82bbcdde0f7",
      "iana-ssh-parameters": "c706673094b77183e7a7cc15d75d26b7e16beb6c7d9dfb4277052610df0c3773",
      "rfc-5647": "a0ee7571f0fa4a2bda1819a2057cf9f83277b90b0fe6cab91be216dfb177aabd"
    }
  }
}
```

# Re-check: What is SSH

Two items judged: the OSI badge, and the Go deeper paragraph of the step "algorithm-negotiation", read in its place under the step's narrative.

## Claims

### units[0].osi — ✅

The badge places SSH at layer 7.

- `cloudflare-ssh` §How does SSH contrast with other protocols for tunneling?
  > SSH's exact OSI layer is not strictly defined, but most sources describe it as a layer 7/application layer protocol, like HTTP, FTP, and SMTP.
- `baeldung-ssh-intro` §2. What Is Secure Shell?
  > It is an application layer protocol that is in the 7th layer of the Open Systems Interconnection (OSI) network model.
- Note: Two independent sources (a vendor explainer by Cloudflare and a community tutorial by a different author on Baeldung) each put SSH at layer 7. Cloudflare adds that the layer is not strictly defined; a single layer-7 badge is the ordinary description and nothing cited contradicts it. The project's settled rule allows a badge to rest on such pages when no standard places the protocol.
- Note: Both pages were live on 2026-11-12 (Baeldung's page shows an update in April 2026) and describe current practice. Both were read in the browser after the command line got a bot check.

### units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper) — ✅

"The main kinds chosen are key exchange (here sntrup761x25519-sha512, which mixes X25519 with a post-quantum method; a newer choice, mlkem768x25519-sha256, pairs X25519 with ML-KEM), host key type (ssh-ed25519), cipher (chacha20-poly1305@openssh.com or aes256-gcm) and MAC, which AES-GCM builds in. Compression is usually none."

- `rfc-4253` §7.1
  > name-list kex_algorithms
  > name-list server_host_key_algorithms
  > name-list encryption_algorithms_client_to_server
- `rfc-4253` §7.1
  > name-list mac_algorithms_client_to_server
- `rfc-4253` §7.1
  > name-list compression_algorithms_client_to_server
- Note: RFC 4253 §7.1 defines the KEXINIT message and its name-lists: key exchange, host key, encryption, MAC and compression, which are the kinds the paragraph names (it leaves out the optional language lists, an allowed simplification).
- `rfc-9941` §1
  > This document specifies a hybrid construction using both sntrup761
  > and X25519
- `rfc-9941` §1
  > Streamlined NTRU Prime [NTRUPrimePQCS] [NTRUPrime] [NTRUPrimeWeb]
  > provides post-quantum small lattice-based key-encapsulation
  > mechanisms.
- Note: RFC 9941 defines the key exchange method sntrup761x25519-sha512, a hybrid of a post-quantum method and X25519.
- `rfc-10042` §2.3.3
  > mlkem768x25519-sha256 defines that the traditional client and server
  > public keys C_PK1 and S_PK1 belong to the Curve25519 curve [RFC7748].
- `rfc-10042` §2.3.3
  > The post-quantum C_PK2 and S_CT2 represent ML-KEM-768 public key and
  > ciphertext from the client and server
- Note: RFC 10042 defines the method mlkem768x25519-sha256, pairing X25519 (Curve25519) with ML-KEM-768. It is the higher-numbered, later RFC, and OpenSSH's current default list puts it first, so "a newer choice" holds.
- `openbsd-man-ssh-config` §DESCRIPTION
  > mlkem768x25519-sha256,
  > sntrup761x25519-sha512,sntrup761x25519-sha512@openssh.com,
- `rfc-8709` §1
  > This document describes the method implemented by OpenSSH and others
  > and formalizes the use of the name "ssh-ed25519".
- Note: RFC 8709 defines the public key algorithm (host key type) ssh-ed25519.
- `openbsd-man-ssh-config` §DESCRIPTION
  > chacha20-poly1305@openssh.com,
  > aes128-gcm@openssh.com,aes256-gcm@openssh.com,
- `cisco-ssh-configure` §Debug and Show Commands
  > Encryption Algorithms:chacha20-poly1305@openssh.com,aes128-gcm@openssh.com,aes256-gcm@openssh.com,aes128-gcm,aes256-gcm,aes128-ctr,aes192-ctr,aes256-ctr
- `iana-ssh-parameters` §Encryption Algorithm Names
  > AEAD_AES_256_GCM Section 6.2
- `rfc-5647` §6.2
  > AEAD_AES_256_GCM is specified in Section 5.2 of [RFC5116].
- Note: RFC 5647 defines AES-GCM for the SSH transport, AEAD_AES_256_GCM in §6.2. The name "aes256-gcm" appears as such in Cisco's cipher list; OpenSSH spells it aes256-gcm@openssh.com and the IANA registry AEAD_AES_256_GCM. For a beginner the shorter name names the same cipher and is one a real device offers.
- `rfc-5647` §5.1
  > If AES-GCM is selected as the encryption algorithm for a given
  > tunnel, AES-GCM MUST also be selected as the Message Authentication
  > Code (MAC) algorithm.
- `rfc-5647` §5.1
  > Because an AEAD
  > algorithm such as AES-GCM uses the encryption key to provide both
  > confidentiality and data integrity, the integrity key is not used
  > with AES-GCM.
- `cisco-ssh-configure` §SSH Client Debug (Linux/macOS)
  > debug1: kex: server->client cipher: aes128-gcm@openssh.com MAC: <implicit> compression: none
- Note: RFC 5647 §5.1 defines how AES-GCM takes the MAC's place in SSH. The paragraph says only that AES-GCM builds the MAC in; that chacha20-poly1305@openssh.com does so too is left out, which does not make the sentence false.
- `rfc-4253` §6.2
  > none     REQUIRED        no compression
- `openbsd-man-ssh-config` §DESCRIPTION
  > Specifies whether to use compression. The argument must be
  > yes or no (the default).
- Note: "Compression is usually none" is backed by OpenSSH's default (off), Cisco's debug output and RFC 4253, where "none" is the required method.
- Note: The paragraph sits after the step's narrative on KEXINIT and preference lists; it names what those lists choose, so the step is still true and in order.
- Note: Currency. RFC 4253 is not obsoleted; its updates (among them RFC 8709 and others on key exchange and RSA/SHA-2) add or retire algorithms and do not change the negotiated kinds. RFC 5647, RFC 8709, RFC 9941 and RFC 10042 are not obsoleted. OpenSSH's manual and Cisco's page are live and describe current products.

## Traced, example, analogy and unbacked parts

None in this re-check.

## Sources

- `baeldung-ssh-intro`: live, read in the browser, updated April 2026; describes current practice. Checked 2026-11-12.
- `cisco-ssh-configure`: live on cisco.com, describes current IOS and OpenSSH client output. Checked 2026-11-12.
- `cloudflare-ssh`: live Learning Center explainer, read in the browser. Checked 2026-11-12.
- `iana-ssh-parameters`: the live registry (XML form), last updated 2026-09-08. Checked 2026-11-12.
- `openbsd-man-ssh-config`: live current OpenSSH manual page. Checked 2026-11-12.
- `rfc-10042`: the RFC Editor's info page lists no obsoleting RFC. Checked 2026-11-12.
- `rfc-4253`: Standards Track, not obsoleted; updated by seven RFCs, none of which changes what the claim says. Checked 2026-11-12.
- `rfc-5647`: not obsoleted. Checked 2026-11-12.
- `rfc-8709`: Standards Track, not obsoleted. Checked 2026-11-12.
- `rfc-9941`: not obsoleted. Checked 2026-11-12.
