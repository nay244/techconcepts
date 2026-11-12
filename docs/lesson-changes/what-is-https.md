# What is HTTPS: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 41 sources (it listed two, RFC 2818 and RFC 9110, before) and passed its fact-check on 2026-11-11. The check ran under your rule of 2026-11-11: a sentence that is true for a beginner stays as written, even where a source is more exact, and only what would leave a beginner believing something false is changed. The first full check passed 114 of 118 items; the other four were all imprecise (none wrong) and all said what someone watching the network can see, resting on one document that named only the server's address. Two more RFCs (8404 and 9065) were added for them, and the second full check passed all 118 items, with 219 quoted passages found in the 41 sources. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-https.ts`), it has 16 corrections, 12 removals, 21 additions and 2 rewordings; the last sections list what the checker passed with a note and what is word for word as before.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; "HTML Standard" and "Fetch Standard" are WHATWG's, cited by the heading's number; vendor pages are cited by the page's own heading.

## The changes to look at first

1. **You type `https://techconcepts.app`.** Step 1 used to say you type `techconcepts.app` and the browser makes it `https://techconcepts.app/`. No standard says a browser turns a bare name into a scheme (and the leading browser tries HTTPS first anyway), so the reader now types the whole address. (Correction 1.)
2. **The page is drawn when the stylesheet arrives.** The original drew the page's words as soon as the HTML arrived. The HTML Standard holds drawing back while a stylesheet linked before the body is loading, and this page's stylesheet arrives in step 6. The "Drawing the page" status and the page's words moved from the HTML's reply to the stylesheet's reply (the HTML's now says "Reading the page"). The original's last cue drew the page with pictures; this lesson fetches none, so it now shows the page's words only. No step or event was added, removed or reordered. (Corrections 8, 9 and 13.)
3. **TLS 1.3 now means RFC 9846, and the key exchange has a post-quantum half.** RFC 8446 is obsolete, replaced by RFC 9846, and "usually X25519" is no longer the ordinary case: browsers pair it with ML-KEM by default. (Corrections 4, 5 and 15.)
4. **The padlock is "many browsers", and a ticket skips the certificate.** Chrome, the most-used browser, shows a different icon, so "the browser shows a padlock" became "many browsers show". A resumed handshake takes the same round trip and skips only the certificate, and a ticket may last less than a day. (Corrections 10, 11 and 14.)
5. **Nine message sizes became a dash.** 75 B, 91 B, 74 B, 74 B, 66 B, 517 B, 4.3 KB, 74 B and 250 B read as facts about the protocol and no source states them; a browser's ClientHello alone is 1,216 bytes now. The sizes of the example's own request and files (437 B, 18 KB, 420 B, 6 KB) stay. (Removals 3 to 11.)
6. **Plain-text HTTP is HTTP/1.1.** Over TLS a browser often speaks HTTP/2, so step 5 now says "plain-text HTTP/1.1". (Correction 6.)

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 1 narrative (first two sentences) | You type techconcepts.app and press Enter. The browser makes it **https://techconcepts.app/**. | You type **https://techconcepts.app** and press Enter. | No standard says a browser turns a bare name into a scheme. RFC 9110 §4.2.2 defines the https scheme. |
| 2 | Step 1 Go deeper | Browsers now try https:// first. | Some browsers upgrade http:// to https:// when they can, by default or as a setting. | Microsoft Edge HTTPS-First Mode (What is HTTPS-First Mode?; Manage HTTPS-First Mode in Microsoft Edge): on by default in Edge. Chrome Help, Manage Advanced security settings: Chrome does it only when you turn it on. |
| 3 | Step 3 Go deeper | …and port 443 alone says it’s almost certainly HTTPS. | …and port 443 is the port reserved for HTTPS. | RFC 9110 §4.2.2; IANA ports. RFC 9308 §8 and RFC 9312 §3.1 warn that a port alone does not name the application (UDP 443 carries other QUIC applications too). |
| 4 | Step 4 Go deeper | The key exchange is usually X25519. | The key exchange is usually X25519, which browsers now pair with ML-KEM, a post-quantum method. | RFC 10024 Abstract and §2; Cloudflare PQC support (default in Chrome 131+, Firefox 132+, Safari 26+). |
| 5 | Step 4 fact Shared key made by | X25519 key exchange | X25519 with ML-KEM | Same as 4: plain X25519 is no longer the ordinary case. |
| 6 | Step 5 narrative | …in the same plain-text HTTP as before… | …in the same plain-text HTTP/1.1 as before… | RFC 9114 §1.1 and RFC 9110 §1.2: HTTP/1.1 is the plain-text version; over TLS a browser often negotiates HTTP/2. |
| 7 | Step 5 fact A watcher sees | sizes and timing only | sizes and timing, not the contents | "Only" ruled out the addresses and the site's name, which this lesson teaches. RFC 9846 §1 and Appendix F.3; RFC 9849 §1. |
| 8 | Step 5, the HTML reply: status | Drawing the page | Reading the page | HTML Standard §4.6.8.23, §3.1.6, §8.1.7.3: drawing waits for a stylesheet linked before the body. |
| 9 | Step 5, the HTML reply: page cue | The page's words appear when the HTML arrives | No page cue | Same as 8: the page's words move to the stylesheet's reply. |
| 10 | Step 6 narrative | …and the browser shows a small **padlock** by the address. | …and many browsers show a small **padlock** by the address. | Microsoft Edge secure browsing (Verify the connection icon in the address bar) and Cloudflare mixed content errors show a padlock; Chrome Help (What each security symbol means) shows other symbols. |
| 11 | Step 6 narrative (last sentence) | Last, the server hands over a **session ticket**, so a visit tomorrow can skip most of the handshake. | Last, the server hands over a **session ticket**, so a later visit can skip the certificate part of the handshake. | RFC 9846 §2.2 (a resumed handshake sends no Certificate); §4.7.1 (a ticket lasts at most seven days and a server may treat it as valid for less). |
| 12 | Step 6 Go deeper | …in date and issued for this exact name… | …in date and issued for this name… | RFC 9525 §6.3: a wildcard certificate matches a name without being issued for that exact name. |
| 13 | Step 6, the stylesheet reply: page cue | The whole page appears, pictures included | The page's words appear | HTML Standard §4.6.8.23, §3.1.6, §8.1.7.3 (the page is drawn when the stylesheet arrives). This lesson fetches no picture, so there is nothing to draw beyond the words. |
| 14 | Step 6, the ticket event: summary | Here’s a ticket. Show it next time and we can skip most of the handshake. | Here’s a ticket. Show it next time and we can skip the certificate. | RFC 9846 §2.2, as 11. |
| 15 | Learn fact Defined in | RFC 9110, RFC 8446 | RFC 9110, RFC 9846 | RFC 9846 Abstract: it obsoletes RFC 8446 (TLS 1.3). RFC 9110 §4.2.2 defines the https scheme. |
| 16 | Overview fact Used for | almost every website, and most apps | web pages, and apps that talk to servers | RFC 9110 §1.2, §3.5; RFC 9114 §1; Microsoft Edge secure browsing (What are HTTP and HTTPS?). No allowed source gives a share of sites or apps on HTTPS. |

The two Practice questions needed no change: their prompts, options, feedback and right answers are as before, and each option now cites its sources.

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Step 6 Go deeper | "(a settings icon in some newer browsers)" | No source states it in text; "many browsers" in the narrative already covers other icons. |
| 2 | Learn Go deeper | the word "Free" in "Free authorities such as Let’s Encrypt issue certificates automatically (ACME)." | Only Let's Encrypt's own pages say it, and one publisher is not enough. RFC 8555 §1 and Let's Encrypt's How It Works state the rest. |
| 3 | Step 2 event LOOKUP, size | 75 B | A size reads as a claim about the protocol and no source states it. Shown as a dash. |
| 4 | Step 2 event ANSWER, size | 91 B | Same. |
| 5 | Step 3 event SYN, size | 74 B | Same. |
| 6 | Step 3 event SYN-ACK, size | 74 B | Same. |
| 7 | Step 3 event ACK, size | 66 B | Same. |
| 8 | Step 4 event CLIENT HELLO, size | 517 B | Wrong today: a browser's ClientHello carries a 1,216-byte X25519MLKEM768 share alone (RFC 10024 §4.1). Shown as a dash. |
| 9 | Step 4 event SERVER HELLO, size | 4.3 KB | Depends on the certificate chain and key share; no source states it. |
| 10 | Step 4 event FINISHED, size | 74 B | No source states it. |
| 11 | Step 6 event TICKET, size | 250 B | No source states it. |
| 12 | Unit references | RFC 2818: HTTP Over TLS; RFC 9110: HTTP Semantics | RFC 2818 is obsolete (replaced by RFC 9110). The cited shape writes no reference list; the Sources list is built from the citations (see Added). |

## Added

New in the lesson, so every Watch part has a Learn statement to trace to.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact Port | before: 443. After: 443 (the default for https; plain HTTP: 80) | Step 3 says "instead of 80" (RFC 9110 §4.2.2, §4.2.1; IANA ports). |
| 2 | Learn fact Is | before: HTTP over TLS. After: HTTP over TLS: every HTTP message goes as TLS application data | The "On the wire" fact and the encrypted events show it (RFC 9112 §9.7; RFC 9110 §4.2.2). |
| 3 | Learn fact Watchers still see | before: addresses, the site’s name (SNI), sizes. After: addresses and ports, the site’s name (SNI), sizes and timing | Step 3 shows ports and step 5 teaches timing (RFC 8404 §3.1.1; RFC 9065 §1, §2.3.2; RFC 9293 §3.1; RFC 9110 §4.3.3; RFC 9849 §1; RFC 6066 §3; RFC 9846 §1, Appendix F.3). |
| 4 | Learn term HTML | The text that describes the page | "with the HTML" in step 5 (HTML Standard §1.3, §1.10). Terms 8 to 9. |
| 5 | Learn fact Used for | web pages, and apps that talk to servers | Overview "Used for" (RFC 9110 §1.2, §3.5; RFC 9114 §1; Microsoft Edge). |
| 6 | Learn fact OSI layer | 7, application | Backs the badge: Microsoft Application Gateway and Cloudflare load balancing (no standard places HTTPS in the OSI model). |
| 7 | Learn fact DNS resolution | a resolver turns a name into an IP address, which can take from milliseconds to seconds; UDP to port 53 is the recommended way to send a query, such as one for an A record | Step 2 and its events (RFC 1034 §5.1, §5.2.1; RFC 1035 §3.2.2, §4.2.1; RFC 9499 §6; RFC 9110 §4.3.2). Same words as What is HTTP. |
| 8 | Learn fact Plain DNS | not encrypted, so the name you look up shows; DoH (port 443) or DoT (port 853) can hide it | Step 2's "isn't sealed" and its events (RFC 9076 §5.1, §1; RFC 8484 §1, §8.1; RFC 7858 §3.1; Cloudflare 1.1.1.1 encryption). |
| 9 | Learn fact TCP connection | opened by a handshake of three messages (SYN, SYN-ACK, ACK); HTTP/1.1 keeps it open for more requests by default | Step 3 (RFC 9293 §3.5; RFC 9112 §9.3). |
| 10 | Learn fact Rides on | TCP, which rides on IP (HTTP/3: QUIC, on UDP) | "via IP" on the TCP events (RFC 9112 §9; RFC 9293 §2.2; RFC 9114 §1; RFC 9000 §1). |
| 11 | Learn fact TLS 1.3 handshake | runs on the TCP connection: the ClientHello offers locks (cipher suites) and a key share; the server answers with ServerHello, its certificate, CertificateVerify and Finished; the client’s Finished ends it; it costs one round trip, and everything after the key exchange is encrypted | Step 4 and its events (RFC 9846 Abstract, §2, §4.2.1, §2.3; RFC 9112 §9.7; RFC 9001 §1). |
| 12 | Learn fact Key exchange | usually X25519, which browsers now pair with ML-KEM, a post-quantum method | Step 4's key fact (RFC 10024 Abstract, §2; Cloudflare PQC support). |
| 13 | Learn fact Inside the seal | the same HTTP as before (in HTTP/1.1, plain text), such as GET / HTTP/1.1 and a 200 OK reply | Step 5 (RFC 9112 §9.7, §3; RFC 9110 §15.3.1, §1.2; RFC 9114 §1.1). |
| 14 | Learn fact Content-Type | names a file’s media type, such as text/html, text/css or image/png | The info lines "text/html" and "text/css" (RFC 9110 §8.3; IANA Media Types). Same words as What is HTTP. |
| 15 | Learn fact Other files | a page names more files, such as a stylesheet (how it looks) and images; each one the browser hasn’t saved is fetched with its own GET | "GET /style.css" in step 6 (HTML Standard §4.6.8.23, §4.8.3; Fetch Standard §2.2.5; RFC 9110 §9.3.1; RFC 9111 §4.2). |
| 16 | Learn fact Records | each is encrypted and checked (AES-128-GCM, AES-256-GCM or ChaCha20-Poly1305); one altered on the way ends the connection | Step 5's "Cipher" fact and the "change would be caught" line (RFC 9846 §5.2, §9.1). |
| 17 | Learn fact Drawing | Drawing waits for a stylesheet the page links to before its body begins, if it applies to this screen, until it has loaded or failed, or a timeout passes. | The moved page cue (HTML Standard §4.6.8.23, §3.1.6, §8.1.7.3). Same words as What is HTTP. |
| 18 | Learn fact Session ticket | after the handshake the server may send a ticket (NewSessionTicket); a later visit can resume with it, skip the certificate, and even send its first request at once (0-RTT) | Step 6's ticket (RFC 9846 §2.2, §4.7.1, §2.3). |
| 19 | Learn fact Certificates last | a few months (90 days is common), then they’re renewed | Step 6's fact (Cloudflare certificate validity; Let's Encrypt FAQ; RFC 5280 §3.1). |
| 20 | Learn fact Padlock does not mean | the site is safe or honest: scam sites can have valid certificates too | Step 6's "Doesn't mean" fact (Microsoft Edge secure browsing; RFC 8555 §1). |
| 21 | Learn, Sources list | 41 sources instead of two | Every cited claim lists its source at the foot of Learn. |

## Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Step 5 Go deeper | Each TLS record carries the encrypted HTTP plus an authentication tag (AES-GCM or ChaCha20-Poly1305). | Each TLS record carries the encrypted HTTP, sealed with a check that catches any change (AES-GCM or ChaCha20-Poly1305). (No allowed source names the "tag"; RFC 9846 §5.2, §9.1 state the idea.) |
| 2 | Learn term name | HTTPS | HTTPS (HTTP Secure) (RFC 9110 §4.2, Table 2; Microsoft Edge: the name spelt out, so the full name on the Overview traces to a Learn part) |

## Passed with a note

The checker passed these as true in the ordinary case, and noted what each leaves out or loosens. They are simplifications, kept word for word under your rule.

- **`techconcepts.app` is this site's own name, with a made-up address.** The lesson says "techconcepts.app is 198.51.100.7", which is not what a real lookup returns; 198.51.100.7 is a documentation address (RFC 5737), and the other addresses are private or documentation addresses too. The checker marked the example items as example data. What is HTTP uses `example.net` instead.
- The OSI badge (layer 7) rests on two vendors' pages, because no standard places HTTPS in the OSI model.
- "Many sites also send an HSTS header" uses "many" loosely, and "always use HTTPS" leaves out that a policy lasts only for its stated time. The preload list is per browser.
- The browser upgrade to https:// is on by default in Edge and a setting in Chrome; the sentence says "by default or as a setting".
- Plain DNS: UDP is the usual way to send a query, though TCP support is required too (RFC 7766). Encrypted DNS "which many browsers and phones can switch on" is loosely counted; in Chrome it is already on in automatic mode.
- The TLS handshake descriptions leave out EncryptedExtensions in the server's flight; "lock" and "ID" are everyday words for the algorithms and the authentication. "Certificate authority" is the everyday form of RFC 5280's "certification authority".
- "The key exchange is usually X25519": the hybrid default is stated by Cloudflare's page and X25519's wide use by RFC 10024.
- Encryption: AES-CCM suites also exist and are left out. "Stops" a change means it is detected, as the lesson says elsewhere.
- The padlock: Chrome shows a different icon, and a blocked insecure request can leave the padlock in place; "only when" holds wherever a padlock is shown.
- A certificate chain is described with one intermediate; RFC 5280 allows none or several. A wrong name, an expired certificate or an unknown signer gives a warning page in the ordinary case, though no source lists the three by name.
- "A few months" leaves out longer paid certificates and Let's Encrypt's optional six-day ones.
- The café Wi-Fi, provider and router examples are everyday words for "on the path"; the sources do not list them.
- Practice, question 1: "which site you went to" is true in the ordinary case and leaves out that Encrypted Client Hello and encrypted DNS can hide the name; the lesson teaches both elsewhere.
- "HTTP Secure" is a short form of the registered name "Hypertext Transfer Protocol Secure".
- The "Used for" fact speaks of HTTP; HTTPS is HTTP secured, so it is used for the same things.

## Unchanged

Word for word as the original: the title ("HTTPS"), the full name ("HTTP Secure"), the purpose ("Web pages, sealed"), the level and group; the OSI badge (layer 7, now cited to Microsoft Azure and Cloudflare); the scene's title, labels (Wants techconcepts.app, techconcepts.app), table (title, columns, empty text), legend and three parties; all six step titles and subtitles; the Overview hook and its postcard-and-box description (an analogy); Overview facts Port, Is, Proves the site with, OSI layer and This example; every step's status and idle lines; every Watch fact not listed above; all 13 events, in the same order, with their tags, addresses, ports, times, summaries and log lines (apart from the sizes, the one status and the three changes above); the three greetings of the TCP handshake (an analogy); Learn's lead ("HTTPS is HTTP with one extra job before the asking: seal the line. After that the conversation is the same, but only the two ends can read it.", which Home quotes), the other seven terms, the pattern's four names and note, Learn's why, and the Go deeper paragraphs apart from "Free"; both Practice prompts, their ids, the three options of each, every feedback line and the right answers (the second option of the first question, the first of the second).

## Counts

The counts at the top were made by a script that counts the table rows under each heading above (16 corrections, 12 removals, 21 additions, 2 rewordings); the Passed with a note and Unchanged lists are not rows. The sources are the 41 on the lesson's claim sheet, against the two references of the original.
