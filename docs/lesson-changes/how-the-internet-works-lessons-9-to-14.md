# How the Internet Works, lessons 9 to 14: every changed sentence

The last six lessons of the track moved to the cited shape on 2026-11-12, in two batches: What is SMTP, What is POP3 and What is IMAP, then What is FTP, What is SSH and What is TLS. Moving a lesson means tying each claim to the source section that states it and changing any sentence a source does not support. Each lesson then passed a fact-check by a fresh checker under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, and only what would leave a beginner believing something false is changed.

This is the one report for the six (direction 2.29). The earlier eight lessons each have a list of their own in this folder. Each lesson's author wrote its section below right after its lesson passed; a script then looked for every quoted "before" in the lesson's file as it was (commit `b18acd9`) and every "after" in the file as it passed. All were found. Seven cells are the authors' own descriptions and not quotes (a label with its value, "gained", a note on the page cue), and were read by hand.

## The six at a glance

| Lesson | Fact-check | Items | Sources (was) | Corrections | Removed | Added | Reworded |
|---|---|---|---|---|---|---|---|
| What is SMTP | 142 of 145 on the first full check, then all 9 re-checked | 147 | 28 (1) | 9 | 12 | 19 | 0 |
| What is POP3 | all 113 on the first full check | 113 | 19 (1) | 5 | 4 | 8 | 3 |
| What is IMAP | 116 of 119, then 8 of 9 re-checked, then all 9 | 121 | 18 (1) | 14 | 3 | 13 | 2 |
| What is FTP | 121 of 122, then all 122 on a second full check | 122 | 28 (1) | 9 | 1 | 9 | 0 |
| What is SSH | 135 of 137, then both re-checked | 137 | 32 (2) | 19 | 3 | 17 | 6 |
| What is TLS | 119 of 120, then the one re-checked | 120 | 34 (1) | 19 | 2 | 22 | 1 |

The counts are each author's, and they do not count alike: one author files a widened Learn part as an addition and another as a rewording. "Removed" counts a lesson's message sizes as one row. Most additions are new Learn facts, added so that everything the Watch tab shows is stated by a Learn part: the lessons' Watch words were kept and Learn grew to carry them.

No check found a claim that was wrong. Every item a check held back was imprecise: a Watch part that said something small no Learn part stated, a port in a sentence but not in its cited section, and three that changed what a reader is told (below).

## What a reader will notice

1. **Three marks on the figure changed, and no step or event did.** What is IMAP draws the fetched letter as words only (the letter the story fetches has no picture). What is TLS no longer draws the page when the reply to its one request arrives, as What is TCP does not. What is SSH no longer adds a picture to the terminal when `ls` answers. What is POP3 keeps both its cues: its second letter is now "a newsletter with a picture inside", so Home's sample still holds.
2. **Message sizes are dashes.** No source states the size of a SYN or a ClientHello, and a number in a log reads as a fact about the protocol. A letter's, a file's or a page's own size stays as example data.
3. **OSI badges.** What is SMTP, What is FTP and What is SSH show layer 7, each on two publishers' pages. What is POP3, What is IMAP and What is TLS span layers, and their Overview fact "OSI layer" is cut: no two publishers place them at one layer.
4. **What is TLS agrees with What is HTTPS.** The key exchange is "X25519 with ML-KEM" in both, and TLS 1.3 is cited as RFC 9846, which made RFC 8446 obsolete in July 2026.
5. **Three corrections the checks themselves made:** What is FTP's "Safer: SFTP (22), FTPS (990)" became "SFTP (22), FTPS (21 with AUTH TLS, or 990)", since standard FTPS starts on port 21; What is TLS's "From this message on, everything the server sends is already encrypted" became "After this message, everything the server sends is encrypted", since the ServerHello itself is not; and What is SSH's sentence on the built-in integrity check now names only the cipher its sources state it of.

## Sites added to the allowed list

`www.paloaltonetworks.com` (Palo Alto's explainer pages) and `knowledge.workspace.google.com` (Google's Workspace help, where its old help pages now redirect) with batch 3; `man.openbsd.org` (OpenSSH's own manual pages) and `www.baeldung.com` (a community tutorial site: its "Introduction to SSH" is the second publisher, beside Cloudflare, that places SSH at layer 7) with batch 4. The reasons are in `docs/direction.md`, decisions 2.31 and 2.32.

## For the owner to know

None of these stopped the work, and none is a fault a check found.

1. **What is SSH shows the key exchange OpenSSH 9.9 chose first** (`sntrup761x25519-sha512`, now RFC 9941), with the example's version moved from 9.6 to 9.9 to match. Current OpenSSH picks a newer one first (`mlkem768x25519-sha256`), which the lesson names in a Go deeper. Moving the whole story to it would change a table cell and several log lines.
2. **"Telnet sent everything, passwords included, as plain text" lost "passwords included".** The only page that states the password by name is an archived page for a retired product. The sentence now reads "Telnet and rlogin, which were far less safe: Telnet sent everything as plain text".
3. **The shared-secret explanation in What is SSH and What is TLS describes the X25519 half** of a hybrid key exchange. The post-quantum half works differently (one side's share travels encrypted). Both checkers passed it as true for a beginner.
4. **"SSL is its old name" stays** in What is TLS's full name. Strictly SSL was the earlier protocol that TLS replaced; the lesson says its versions are retired.
5. **What the checkers passed as a simplification** is listed under each lesson, about 420 notes in all. The orchestrator read them: each says what a general word leaves out (an optional command, a rarer mode, an exception a standard allows). None gives a wrong cause, number, name or order.

## What is SMTP

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 28 sources (it listed one, RFC 5321, before) and passed its fact-check on 2026-11-12: 142 of 145 items on the first full check, then a targeted re-check of 9 items (the 3 it found imprecise and the items that trace to them), all of which passed. The OSI badge stays at layer 7 and now rests on two vendors’ own explainer pages (Palo Alto Networks and Cloudflare), because no standard places SMTP at an OSI layer. The check ran under the owner’s rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-smtp.ts`), it has 9 corrections, 12 removals, 19 additions and 0 rewordings; the last sections list what the checker passed as a simplification.

Source names are the ones the lesson’s Sources list shows. Section numbers are the RFC’s own; a vendor page has none, so it is cited by its heading.

### The changes to look at first

1. **Step 6 now says the sender says EHLO again.** After STARTTLS the standard has the client start over with EHLO, and it may send its commands together only once that reply offers it. The old sentence also called DATA an envelope line, which it is not. No event was added; one sentence says it. (Corrections 7 and 8.)
2. **The laptop’s hello is `EHLO [192.168.1.100]`, not `EHLO laptop`.** SMTP does not allow a bare nickname there; a host with no name gives its address in brackets. The summary “Hello, I’m Alex’s laptop.” stays. (Corrections 3 and 4.)
3. **“AUTH PLAIN LOGIN” became “AUTH PLAIN”.** LOGIN is no standard mechanism; IANA’s registry marks it obsolete. (Corrections 1, 5 and 6.)
4. **“Designed when the internet was small and trusting” is gone.** No allowed source gives that cause, so the sentence says only that SMTP doesn’t check who a letter is really from. (Correction 9.)
5. **“Many home networks” became “many networks”.** The standard says “many sites” and the one provider page is a cloud platform. (Correction 2.)
6. **The log shows no message size except the two letters’ own.** A size reads as a fact about the protocol and no source states one, so 32 sizes are now a dash. (Removal 12.)
7. **Names no Learn part gives are out of the log:** ESMTP, SNI, the enhanced status codes (2.1.0 and the like) and <CRLF>. (Removals 2 to 11.)
8. **The sentence about the mail server’s own resolver is cut.** No allowed source says what mail servers usually do for DNS. (Removal 1.)
9. **Eighteen new Learn facts** state the TCP and TLS handshakes, the greeting, the letter’s parts, PIPELINING, the name check and the rest, so each Watch item has a Learn part to trace to. (Additions 1 to 18.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 2 Go deeper | EHLO (extended hello) replaced the older HELO; the 250 reply lists extensions such as SIZE, PIPELINING and AUTH PLAIN LOGIN. | EHLO (extended hello) replaced the older HELO; the 250 reply lists extensions such as SIZE, PIPELINING and AUTH PLAIN. | RFC 4954 §3 (the AUTH keyword lists the SASL mechanisms); RFC 2920 §2; RFC 1870 §3. LOGIN is no standard mechanism: IANA’s SASL registry marks it OBSOLETE. |
| 2 | Step 1 Go deeper | Port 25 is for servers passing mail on, and many home networks block it going out, to stop spam. | Port 25 is for servers passing mail on, and many networks block it going out, to stop spam. | RFC 6409 §1 (“many sites now prohibit outbound traffic on the standard SMTP port”); Azure outbound SMTP (All other subscription types). No allowed source speaks of home networks. |
| 3 | Step 2 fact Hello | EHLO laptop | EHLO [192.168.1.100] | RFC 5321 §2.3.5, §4.1.1.1 and §4.1.3: the name in EHLO must be a host name, or an address in brackets when the host has no name. “laptop” is neither. |
| 4 | Step 2 message EHLO, info | EHLO laptop | EHLO [192.168.1.100] | As correction 3. |
| 5 | Step 2 message 250, summary | 250: hello. I can do AUTH, PIPELINING, SIZE. | 250: hello. I can do AUTH and PIPELINING. | No Learn part names SIZE; the info line already listed only these two (RFC 2920 §2; RFC 4954 §3). |
| 6 | Step 2 message 250, info | 250-smtp.example.net, AUTH PLAIN LOGIN, PIPELINING | 250-smtp.example.net, AUTH PLAIN, PIPELINING | As correction 1: LOGIN is no standard mechanism. |
| 7 | Step 6 narrative | This time it sends the three envelope lines together to save time, and gets three replies back at once. | After the seal it says EHLO again, as the rules ask. Then it sends MAIL FROM, RCPT TO and DATA together to save time, and gets three replies back at once. | DATA is not part of the envelope (RFC 5321 §2.3.1), and after STARTTLS the client sends EHLO again before anything else (RFC 3207 §4.2); it may pipeline only once that EHLO reply offers PIPELINING (RFC 2920 §3, §3.1). No event was added. |
| 8 | Step 6 fact, label and value | MAIL FROM, RCPT TO, DATA, sent together | Sent together | As correction 7: the fact was labelled “Envelope” and so called DATA part of the envelope. Now the label is “Sent together” and the value “MAIL FROM, RCPT TO, DATA”. |
| 9 | Learn Go deeper | SMTP was designed when the internet was small and trusting, so on its own it doesn’t check who a letter is really from. | On its own, SMTP doesn’t check who a letter is really from. | RFC 5321 §7.1; RFC 7208 §1. No allowed source gives the cause (“small and trusting”). |

### Removed

Said in the original, gone now. The Before column is the original’s own text.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Step 4 Go deeper, last sentence | Mail servers usually have a resolver of their own; this map shares one to keep things simple. | No allowed source says what mail servers usually do for DNS, and without it the second half has nothing to explain. |
| 2 | Step 1 message TLS HELLO, info | TLS ClientHello, SNI smtp.example.net | “SNI” is a name no Learn part gives, and RFC 8314 §4.4 does not assume every mail client sends it. Now “TLS ClientHello”. |
| 3 | Step 2 message 220, info | 220 smtp.example.net ESMTP ready | “ESMTP” is a name no Learn part gives; the text after the code is free (RFC 5321 §4.2). Now “220 smtp.example.net ready”. |
| 4 | Step 5 message 220, info | 220 mx.example.org ESMTP | As removal 3. Now “220 mx.example.org ready”. |
| 5 | Step 2 message 235, info | 235 2.7.0 Authentication successful | Enhanced status codes (2.7.0, 2.1.0, 2.1.5, 2.0.0) are a name no Learn part gives, and a server attaches them only when it offers ENHANCEDSTATUSCODES, which this story’s servers never do (RFC 2034 §3). Now “235 Authentication successful”. |
| 6 | Step 3 message 250 (MAIL FROM), info | 250 2.1.0 OK | As removal 5. Now “250 OK”. |
| 7 | Step 3 message 250 (RCPT TO), info | 250 2.1.5 OK | As removal 5. Now “250 OK”. |
| 8 | Step 3 message 250 QUEUED, info | 250 2.0.0 OK: queued as 4F2A91 | As removal 5. Now “250 OK: queued as 4F2A91”. |
| 9 | Step 5 message 220 (after STARTTLS), info | 220 2.0.0 Ready to start TLS | As removal 5. Now “220 Ready to start TLS”, RFC 3207 §4’s own words. |
| 10 | Step 6 message 250 (delivered), info | 250 2.0.0 OK: delivered | As removal 5. Now “250 OK: delivered”. |
| 11 | Step 3 message 354, info | 354 Start mail input; end with <CRLF>.<CRLF> | “<CRLF>” is a name no Learn part gives. Now “354 Start mail input”, as the pipelined reply already reads; the summary still says to end with a line holding just a dot. |
| 12 | The log’s Size column, 32 messages | 74 B, 74 B, 66 B, 517 B, 4.1 KB, 62 B, 46 B, 164 B, 88 B, 54 B, 52 B, 40 B, 50 B, 40 B, 38 B, 62 B, 58 B, 68 B, 112 B, 74 B, 74 B, 66 B, 58 B, 52 B, 148 B, 42 B, 48 B, 517 B, 3.8 KB, 124 B, 96 B, 56 B | No source states a size; each is now shown as —. The two letters’ own sizes (3.2 KB and 3.4 KB) stay as example data. |

### Added

New statements and facts, with why each was needed. The new Learn facts are the parts the Watch steps trace to; the old Learn did not state these ideas.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact Who speaks first | the server, with its 220 greeting | Step 2’s “The server speaks first” is an order, and no Learn part stated it. (RFC 5321 §3.1) |
| 2 | Learn fact The letter | headers such as Subject, From and To, then the body | The narrative’s “subject, other headers and text” and the letter messages’ “Headers and body” name headers and a body. (RFC 5321 §2.3.1 and §3.3) |
| 3 | Learn fact TCP connection | opened by a handshake of three messages (SYN, SYN-ACK, ACK) | The SYN, SYN-ACK and ACK messages and the status “Connecting” trace to it. (RFC 9293 §3.5) |
| 4 | Learn fact SMTP rides on | TCP; from an app, inside TLS | The log’s Protocol and carrier cells (SMTP, TCP) and “inside TLS” trace to it. (RFC 5321 §1.1 and §4.5.4.2; RFC 8314 §3.3) |
| 5 | Learn fact Port 465 | TLS starts as soon as the connection opens (implicit TLS) | Step 1’s fact “465: TLS from the start” and the two TLS hello messages trace to it. (RFC 8314 §2 and §3.3) |
| 6 | Learn fact TLS seal | a handshake: the ClientHello says what the app can do; the server answers with ServerHello, its certificate and Finished, and the app checks the certificate’s name; after it, everything is encrypted | The ClientHello, ServerHello, certificate and Finished messages and the status “Connected, sealed” trace to it. (RFC 9846 §1 and §2; RFC 8314 §3.3; RFC 3207 §4.1; RFC 7817 §3) |
| 7 | Learn fact Logging in | AUTH PLAIN sends the name and password as they are, so it belongs inside TLS | “Your password crosses next”, AUTH PLAIN and “credentials, inside TLS” trace to it. (RFC 4616 §1 and §2; RFC 4954 §4) |
| 8 | Learn fact Name in EHLO | the sender’s own name, or its address in square brackets when it has no name | The EHLO fact and the two EHLO messages show a name or an address in brackets. (RFC 5321 §2.3.5, §4.1.1.1 and §4.1.3) |
| 9 | Learn fact Letter ends with | a line holding a single dot (354 asks for it) | The dot line in step 3’s facts, the 354 reply and the letter messages trace to it. (RFC 5321 §4.1.1.4 and §4.2.3) |
| 10 | Learn fact 250 after the letter | the server has taken the letter: it delivers it, or tells you if it can’t | “250 queued”, the 250 after the letter and “in Sam’s mailbox” trace to it. (RFC 5321 §4.1.1.4 and §4.2.5) |
| 11 | Learn fact MX (mail exchanger) lookup | a DNS question to a resolver, usually by UDP to port 53; the answer names the mail server with a priority (lowest first), often with its address; with no MX record, senders use the domain’s own address (its A record) | The MX query and answer (DNS, UDP, port 53, the resolver, the A record, priority) trace to it. (RFC 5321 §1.1 and §5.1; RFC 1035 §2.1, §3.3.9 and §4.2.1) |
| 12 | Learn fact PIPELINING | sending several commands without waiting for each reply, once the EHLO reply offers it | Step 6’s “sent together”, the pipelined messages and the PIPELINING offered in the EHLO replies trace to it. (RFC 2920 §3 and §3.1) |
| 13 | Learn fact After STARTTLS | the talk starts over, so the sender says EHLO again | The new sentence in step 6, “After the seal it says EHLO again”, traces to it. (RFC 3207 §4.2) |
| 14 | Learn fact Received: | each server that takes the letter adds a line at the top of its headers | The letter message’s “one more Received: line on top” traces to it. (RFC 5321 §4.4) |
| 15 | Learn fact Between servers | no login: a server takes mail for its own users, then filters it | Step 5’s “No login” fact and its no-AUTH line trace to it. (RFC 6409 §1 and §3.2; RFC 9989 §1; RFC 5598 §2.2.4) |
| 16 | Learn fact OSI layer | 7, application | The Overview fact “OSI layer: 7, application” and the badge need a Learn part to trace to. (Palo Alto Networks, What Is Layer 7?; Cloudflare, What is layer 7?) |
| 17 | Learn fact Stands for | Simple Mail Transfer Protocol | The unit’s full name needed a Learn part that states it. (RFC 5321 §1.1) |
| 18 | Learn fact Reply to EHLO | the server lists what it can do | Step 2’s “the server lists what it can do” needed a Learn part that states it. (RFC 5321 §3.2) |
| 19 | Learn, Sources list | 28 sources instead of one | Every cited claim lists its source at the foot of Learn. |

### Reworded, same meaning

None. Word for word as the original: the title, full name and purpose; the scene, its table and both trays’ cues; all six step titles; every message in the same order; the hook, the post-office comparison, both questions with their options and feedback; and every other sentence, now shown as short paragraphs, one idea each, so that each cites its own sources.

### What the checker passed as a simplification

These are the `Note:` lines of the passing reports (the first full check, and the re-check for the three items it judged again) on items they passed. Each is true in the ordinary case and stays as written.

1. **units[0].osi — ✅**: Two independent vendors (Palo Alto Networks and Cloudflare) each place SMTP at layer 7; no allowed source met in this run places it elsewhere. Both pages are live explainer pages.
2. **units[0].steps[0].deep[0] (step "tcp-and-tls-handshake", Go deeper) — ✅**: RFC 8314 defines implicit TLS and the submissions service on port 465; it is a Proposed Standard, not obsoleted (updated only by RFC 8997, which deprecates TLS 1.1 and does not touch this).
3. **units[0].steps[0].deep[2] (step "tcp-and-tls-handshake", Go deeper) — ✅**: RFC 6409 defines message submission and port 587; RFC 8314 defines the submissions port 465. Both current (RFC 6409 is updated by RFC 8314, which adds port 465 and keeps 587 for submission).
4. **units[0].steps[0].deep[2] (step "tcp-and-tls-handshake", Go deeper) — ✅**: "a person's app" is the everyday word for the Message User Agent that submits mail.
5. **units[0].steps[0].deep[3] (step "tcp-and-tls-handshake", Go deeper) — ✅**: RFC 5321 defines SMTP relay on port 25; RFC 6409 states the outbound block and its spam reason, and Microsoft's live Azure page confirms the practice independently. The closing sentence is a pointer to another lesson, not a claim about networks.
6. **units[0].steps[1].deep[0] (step "ehlo-and-authentication", Go deeper) — ✅**: RFC 5321 defines EHLO and the extension model; RFCs 2920, 4954 and 1870 define the PIPELINING, AUTH and SIZE keywords. All current.
7. **units[0].steps[1].deep[0] (step "ehlo-and-authentication", Go deeper) — ✅**: Leaves out that servers must still accept HELO as a fallback; true for a beginner.
8. **units[0].steps[1].deep[1] (step "ehlo-and-authentication", Go deeper) — ✅**: RFC 4616 defines the PLAIN mechanism; RFC 4954 defines SMTP AUTH. Both current (RFC 4616 is updated only by RFC 8996 on TLS versions).
9. **units[0].steps[1].deep[2] (step "ehlo-and-authentication", Go deeper) — ✅**: Google and Microsoft are independent publishers; each states both the OAuth sign-in and the app-password route. "Sign-in token" is the everyday word for OAuth.
10. **units[0].steps[2].deep[0] (step "message-submission", Go deeper) — ✅**: RFC 5321 defines the SMTP envelope; RFC 5598 (Informational, not obsoleted) is the IETF mail architecture.
11. **units[0].steps[2].deep[1] (step "message-submission", Go deeper) — ✅**: RFC 5321 defines envelope and headers; RFCs 7208, 6376 and 9989 define SPF, DKIM and DMARC. All current; RFC 9989 obsoletes RFC 7489.
12. **units[0].steps[2].deep[1] (step "message-submission", Go deeper) — ✅**: "Check for that" is loose: SPF checks the envelope domain, DKIM a signature, and DMARC ties them to the visible From domain. Together they are the forged-sender checks; true for a beginner.
13. **units[0].steps[2].deep[2] (step "message-submission", Go deeper) — ✅**: RFC 5321 defines DATA and reply 354. RFC 5321 is not obsoleted (updated only by RFC 7504, on codes 521 and 556).
14. **units[0].steps[3].deep[0] (step "mx-lookup", Go deeper) — ✅**: RFC 1035 defines the MX record format; RFC 5321 §5.1 defines how senders use it, including trying each address in order until one succeeds. Both current.
15. **units[0].steps[3].deep[1] (step "mx-lookup", Go deeper) — ✅**: RFC 5321 defines this "implicit MX" rule. It leaves out that the host's IPv6 (AAAA) address counts too; true for a beginner.
16. **units[0].steps[4].deep[0] (step "server-relay-and-starttls", Go deeper) — ✅**: RFC 3207 defines STARTTLS for SMTP; current (updated only by RFC 7817).
17. **units[0].steps[4].deep[1] (step "server-relay-and-starttls", Go deeper) — ✅**: RFCs 3207, 7672 and 8461 are the current standards for server-to-server TLS.
18. **units[0].steps[4].deep[2] (step "server-relay-and-starttls", Go deeper) — ✅**: RFC 8461 defines MTA-STS; RFC 7672 defines DANE for SMTP. Both current.
19. **units[0].steps[4].deep[3] (step "server-relay-and-starttls", Go deeper) — ✅**: RFC 6409 defines the split between authenticated submission and unauthenticated relay. "From anyone" leaves out that receivers may refuse senders with a poor reputation; true in the ordinary case.
20. **units[0].steps[5].deep[0] (step "message-delivery", Go deeper) — ✅**: RFC 2920 defines PIPELINING; it is an Internet Standard and not obsoleted.
21. **units[0].steps[5].deep[1] (step "message-delivery", Go deeper) — ✅**: RFC 5321 defines the Received trace field.
22. **units[0].steps[5].deep[2] (step "message-delivery", Go deeper) — ✅**: RFC 5321 defines queuing, retry and non-delivery notices. Leaves out that a bounce also follows when retries finally give up; true for a beginner.
23. **units[0].learn.lead[0] ("lead-1") — ✅**: RFC 5321 defines SMTP transfer; RFC 6409 defines submission over SMTP. "Short language" is a small describing word.
24. **units[0].learn.terms[0] ("term-outgoing") — ✅**: RFCs 8314 and 6409 define the submission server; Microsoft's page shows "outgoing server" is the everyday name for it.
25. **units[0].learn.terms[1] ("term-ehlo") — ✅**: RFC 5321 defines EHLO. The server's 220 greeting comes first; the lesson teaches that elsewhere, and EHLO is the client's opening command.
26. **units[0].learn.terms[2] ("term-auth") — ✅**: RFC 4954 defines AUTH; RFC 6409 defines authorized submission.
27. **units[0].learn.terms[3] ("term-envelope") — ✅**: RFC 5321 defines the envelope and the MAIL and RCPT commands.
28. **units[0].learn.terms[4] ("term-data") — ✅**: RFC 5321 defines DATA.
29. **units[0].learn.terms[5] ("term-reply") — ✅**: RFC 5321 defines SMTP replies.
30. **units[0].learn.terms[6] ("term-mx") — ✅**: RFC 1035 defines the MX record; RFC 5321 its use for mail. RFC 1035 has many updates, none of which changes MX.
31. **units[0].learn.terms[7] ("term-starttls") — ✅**: RFC 3207 defines STARTTLS.
32. **units[0].learn.pattern ("pattern") — ✅**: RFC 5321 defines the command order; RFC 6409 says submission uses the same ESMTP. The app-to-server handover adds AUTH, which the lesson teaches; the core pattern holds for both.
33. **units[0].learn.why[0] ("why-1") — ✅**: Two independent IETF documents: RFC 5598 states the any-to-any interoperability between mail servers, RFC 8314 that the server-to-server (MX) infrastructure is SMTP on port 25. "Every mail server" means servers on the open Internet, the ordinary case.
34. **units[0].learn.why[1] ("why-2") — ✅**: RFC 5321 defines SMTP as a transfer protocol. "Only sends" means it does not fetch mail from a mailbox; true for a beginner.
35. **units[0].learn.why[2] ("why-3") — ✅**: RFC 1939 defines POP3 (current, updated by RFCs 1957, 2449, 6186, 8314); RFC 9051 defines IMAP4rev2 (current). Leaves out webmail and vendor-specific access APIs; true in the ordinary case.
36. **units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅**: RFC 5321 defines SMTP and states this itself; RFC 7208 is an independent second standard. "On its own" sets aside the AUTH extension the lesson teaches, which proves the submitting account, not the letter's sender.
37. **units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅**: RFCs 7208, 6376 and 9989 define SPF, DKIM and DMARC. RFC 9989 is the current DMARC (it obsoletes RFC 7489). Leaves out DMARC's alignment rule and that receivers may ignore the policy; true for a beginner.
38. **units[0].learn.deep[2] ("deep-codes", Learn's Go deeper) — ✅**: RFC 5321 defines the reply codes and RFC 4954 code 235. 421 is a 4yz code, so "try later" fits its class. "550 no such mailbox" names its most common meaning and leaves out policy refusals; true for a beginner.
39. **units[0].learn.facts[0] ("fact-ports") — ✅**: The IANA registry is the defining assignment of ports; it lists smtp on 25, submissions on 465 and submission on 587. Registry updated 2026-11-10.
40. **units[0].learn.facts[1] ("fact-commands") — ✅**: RFC 5321 defines EHLO, MAIL, RCPT, DATA and QUIT; RFC 4954 defines AUTH.
41. **units[0].learn.facts[2] ("fact-codes") — ✅**: RFC 5321 defines the four reply classes.
42. **units[0].learn.facts[3] ("fact-checks") — ✅**: Each RFC defines its check; all current.
43. **units[0].learn.facts[4] ("fact-greeting") — ✅**: RFC 5321 defines session start; the same section names the 220 code of the greeting. On port 465 the TLS handshake comes first, then the SMTP greeting, as the lesson shows.
44. **units[0].learn.facts[5] ("fact-content") — ✅**: RFC 5321 defines the content's two parts.
45. **units[0].learn.facts[6] ("fact-defined") — ✅**: RFC 5321 is the current SMTP specification. The RFC Editor lists it as not obsoleted; a successor is still an Internet-Draft (the IANA registry already cites it for port 25, which does not make it a standard).
46. **units[0].learn.facts[7] ("fact-tcp") — ✅**: RFC 9293 defines TCP (current Internet Standard); the figure in the same section shows the SYN, SYN-and-ACK, ACK exchange.
47. **units[0].learn.facts[8] ("fact-rides") — ✅**: On port 587 the app reaches TLS through STARTTLS; either way submission runs inside TLS in current practice (RFC 8314 deprecates cleartext submission).
48. **units[0].learn.facts[9] ("fact-implicit") — ✅**: RFC 8314 defines implicit TLS and port 465 for submission.
49. **units[0].learn.facts[10] ("fact-tls") — ✅**: RFC 9846 (July 2026) is the current TLS 1.3 and obsoletes RFC 8446; §2 also lists Certificate and Finished among the server's messages. RFC 7817 defines the email certificate-name check. Leaves out the client's own Finished message; true for a beginner.
50. **units[0].learn.facts[11] ("fact-plain") — ✅**: RFC 4616 defines PLAIN. The SMTP form base64-encodes the string, which is not encryption, so "as they are" is true for a beginner.
51. **units[0].learn.facts[12] ("fact-ehlo-name") — ✅**: RFC 5321 defines the EHLO argument and address literals.
52. **units[0].learn.facts[13] ("fact-end") — ✅**: RFC 5321 defines the end-of-data mark and reply 354.
53. **units[0].learn.facts[14] ("fact-250") — ✅**: RFC 5321 defines the hand-off of responsibility at 250.
54. **units[0].learn.facts[15] ("fact-mx") — ✅**: RFC 1035 defines DNS transport, the resolver and MX; RFC 5321 §5.1 states lowest-preference-first and the implicit MX. The A record stands for the host's address (an IPv6 AAAA address counts too); true for a beginner.
55. **units[0].learn.facts[16] ("fact-pipelining") — ✅**: RFC 2920 defines PIPELINING.
56. **units[0].learn.facts[17] ("fact-ehlo-again") — ✅**: RFC 3207 defines STARTTLS and this reset.
57. **units[0].learn.facts[18] ("fact-received") — ✅**: RFC 5321 defines the Received trace field.
58. **units[0].learn.facts[19] ("fact-relay") — ✅**: RFC 6409 defines the split between authenticated submission and unauthenticated relay.
59. **units[0].learn.facts[20] ("fact-osi") — ✅**: Two independent vendor explainer pages, both live.
60. **units[0].practice[0].options[0] (question "find-server") — ✅**: Correctly marked right; RFCs 5321 and 1035 define this lookup.
61. **units[0].practice[0].options[1] (question "find-server") — ✅**: Correctly marked wrong. With several MX records the sender still delivers to one, trying others only on failure; the feedback is true for a beginner.
62. **units[0].practice[0].options[2] (question "find-server") — ✅**: Correctly marked wrong; the recipient's app acts only after delivery.
63. **units[0].practice[1].options[0] (question "queued") — ✅**: Correctly marked wrong. Read notices are separate messages from the reader's app, outside SMTP.
64. **units[0].practice[1].options[1] (question "queued") — ✅**: Correctly marked right. "Will deliver it" leaves out the bounce if delivery fails, which the lesson teaches elsewhere.
65. **units[0].practice[1].options[2] (question "queued") — ✅**: Correctly marked wrong.
66. **units[0].steps[0].deep[1] (step "tcp-and-tls-handshake", Go deeper) — ✅**: RFC 3207 defines the STARTTLS command for SMTP (§4, with §4.3 on the submission port); RFC 8314 is the current standards-track document that sets how TLS is used for mail submission, placing STARTTLS on port 587 and implicit TLS on port 465. RFC 8314 and RFC 3207 are separate RFCs, so the claim is also confirmed by two independent sources.
67. **units[0].steps[0].deep[1] (step "tcp-and-tls-handshake", Go deeper) — ✅**: the claim leaves out that RFC 8314 now prefers implicit TLS (port 465) and that STARTTLS can fail with a 454 reply; it is true in the ordinary case, and the neighbouring Go deeper lines cover port 465. In its place between the port 465 line and "Both are for submission", the list still reads true and in order.
68. **units[0].steps[0].deep[1] (step "tcp-and-tls-handshake", Go deeper) — ✅**: RFC 8314 (updated by RFC 8997, on TLS 1.1 only) and RFC 3207 (updated by RFC 7817, on certificate name checks) are not obsoleted; neither update changes this claim.
69. **units[0].learn.facts[21] ("fact-name") — ✅**: RFC 5321 is the current document that defines SMTP, and it gives the protocol's full name. It is not obsoleted; its one update (RFC 7504) adds reply codes and does not touch the name.
70. **units[0].learn.facts[22] ("fact-ehlo-reply") — ✅**: RFC 5321 defines the EHLO command and the reply it asks for.
71. **units[0].learn.facts[22] ("fact-ehlo-reply") — ✅**: "what it can do" is an everyday wording for the service extensions the server supports; the HELO fallback for old systems is left out. True in the ordinary case.

### Counts

9 corrections, 12 removals, 19 additions and 0 rewordings, counted from the numbered rows of the tables above (the Size column is one row). The sources are the claim sheet’s list (28) against the one reference of the original. The lesson passed all 145 items; the sheet now has 147, the last two being the new facts the re-check judged.

## What is POP3

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 19 sources (it listed one, RFC 1939, before) and passed its fact-check on 2026-11-12, all 113 items, on its first full check. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-pop3.ts`), it has 5 corrections, 4 removals, 8 additions and 3 rewordings; the last sections list what the checker passed as a simplification.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; a vendor page has none, so it is cited by its heading.

### The changes to look at first

1. **"Most providers turn port 110 off" is gone.** No allowed source counts providers. The standard says providers should phase cleartext out, and the sentence now says so. (Correction 1.)
2. **XOAUTH2 is no longer named.** Only one allowed vendor page names it. The sentence says "an app password or a sign-in token (OAuth) instead", which Google and Microsoft both state. (Correction 2.)
3. **"Every POP3 visit goes this way" became "normally".** The lesson itself teaches APOP and AUTH, and apps that leave a copy and never send DELE. (Correction 3.)
4. **Letter 2 now says it has a picture inside.** The page on the laptop drew a picture that the story never mentioned. The summary says it, and the RETR term now covers a picture inside the letter. (Correction 5, addition 6.)
5. **No message size is shown, except the two letters' own.** A size in a log reads as a fact about the protocol, and no source states one. The 22 other sizes are now a dash. (Removal 4.)
6. **The OSI badge now spans, and the "OSI layer: 7, application" fact is cut.** No allowed source places POP3 at an OSI layer. (Removals 2 and 3.)
7. **"No read or unread" is cut.** It rested on an absence from the command list, and RFC 1939 §8 itself speaks of servers keeping mail "both read and unread". (Removal 1.)
8. **Four new Learn facts and three widened parts** state the TCP and TLS handshake, the mailbox, the RETR reply and the lock, so each Watch item has a Learn part to trace to. (Additions 1 to 7.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 1 Go deeper | Plain port 110 sends your password readably, so most providers turn it off. | Plain port 110 sends your password readably, so the mail standards tell providers to phase it out. | RFC 1939 §13; RFC 8314 §4 and §4.1 ("MSPs SHOULD deprecate the use of cleartext"). No allowed source counts providers. |
| 2 | Step 2 Go deeper | APOP and AUTH (SASL) are alternatives, and big providers often want an app password or a sign-in token (XOAUTH2). | APOP and AUTH (SASL) are alternatives, and big providers often want an app password or a sign-in token (OAuth) instead. | RFC 1939 §4; RFC 5034 §4; Outlook.com settings; Google Workspace OAuth transition (What you need to do; Timeline for transition); Google app passwords. XOAUTH2 is on one allowed host only. |
| 3 | Learn pattern note | Every POP3 visit goes this way. The mailbox ends up on one device. | A POP3 visit normally goes this way. The mailbox ends up on one device. | RFC 1939 §1 ("normally, mail is downloaded and then deleted"), §3, §9. "Every" ruled out APOP, AUTH and apps that leave a copy. |
| 4 | Step 3 Go deeper | TOP fetches just a message’s headers. | TOP fetches a message’s headers and its first few lines. | RFC 1939 §7 (TOP sends the headers, the blank line and the number of body lines asked for). |
| 5 | Step 4 message LETTER 2, summary | +OK: here’s letter 2, a newsletter. | +OK: here’s letter 2, a newsletter with a picture inside. | The page cue on this message draws a picture the story never said was in the letter. RFC 2046 §5.1 and §4.2; RFC 5322 §2.1. Both page cues stay where they were. |

### Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Step 3 narrative, last sentence | To POP3 the mailbox is a simple numbered pile, 1 and 2, with no folders and no read or unread. (now ends "…with no folders.") | It rested on an absence from RFC 1939 §9's command list, and §8 speaks of mail kept "both read and unread". The Learn fact now says "no folders" only. |
| 2 | Overview fact | OSI layer: 7, application | No allowed source places POP3 at an OSI layer. |
| 3 | OSI badge | Layer 7 (now: spans) | As removal 2. Nothing is cited for the badge. |
| 4 | The log's Size column, 22 messages | 74 B, 74 B, 66 B, 517 B, 4.1 KB (the TLS reply), and 38, 30, 40, 30, 40, 26, 40, 26, 52, 28, 28, 28, 40, 28, 40, 26, 40 B; now shown as — | No source states a size. The two letters' own sizes (4.1 KB and 18 KB, matching the example LIST) stay as example data. |

### Added

New statements, terms and facts, with why each was needed. The new Learn facts are the parts the Watch steps trace to; the old Learn did not state these ideas.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact Connection | TCP first (hello, hello back, OK: SYN, SYN-ACK, ACK), carried by IP; on port 995 TLS seals the line straight away, then the server greets with +OK | The TCP messages, "via IP", the greeting and "sealed" trace to it (RFC 1939 §3; RFC 9293 §3.5 and §2.2; RFC 8314 §3.1). |
| 2 | Learn fact TLS on port 995 | the app’s hello (ClientHello) offers the ways it can seal the line and names the server (SNI); the server answers with its hello (ServerHello), its certificate and Finished, and the app checks the certificate’s name; then every POP3 message travels inside TLS, on the TCP connection, where nobody on the way can read it | The two TLS messages and every POP3 message after them trace to it (RFC 8314 §3.1; RFC 9846 §1 and §2; RFC 6066 §3; RFC 7817 §3). |
| 3 | Learn fact The mailbox | one inbox, a numbered list of letters with sizes: no folders; UIDL gives each letter an ID that lasts between visits | Step 3's facts and the table trace to it (RFC 1939 §4, §7, §8). |
| 4 | Learn fact Each letter comes back | after +OK and its size in octets, whole, headers then text, ending with a line holding just a dot | The letters' replies and "Ends with" trace to it (RFC 1939 §3 and §5; RFC 5322 §2.1). |
| 5 | Learn Go deeper, first sentence, widened | A POP3 session moves through three states: authorization (USER, PASS; once you’re in, the server locks the mailbox), transaction (STAT, LIST, RETR, DELE, RSET, NOOP) and update (after QUIT, when deletions happen and the server closes the connection; if the line drops before QUIT, nothing is deleted). (was: "…update (after QUIT, when deletions happen).") | The lock, the closing connection and "a dropped line never loses mail" trace to it (RFC 1939 §4 and §6). |
| 6 | Learn term RETR, widened | Retrieve one, whole: headers, text and any pictures inside it (was: "Download one") | Covers the picture in letter 2 and "short for retrieve" (RFC 1939 §1 and §5; RFC 5322 §2.1; RFC 2046 §5.1 and §4.2). |
| 7 | Learn why, second sentence, widened | That suited the days of dial-up and one computer each: connect, collect the mail, then read it offline. (was: "That suited the days of dial-up and one computer each.") | Step 4's "read them with no internet at all" traces to it (RFC 1939 §1; Gmail POP, Step 1). |
| 8 | Learn, Sources list | 19 sources instead of one | Every cited claim lists its source at the foot of Learn. |

### Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Step 1 Go deeper | POP3 uses port 110 in plain text, which can be upgraded with the STLS command, or port 995 with TLS from the start (POP3S). | POP3 uses port 110 in plain text, which can be upgraded with the STLS command, or port 995 with TLS from the start (implicit TLS). |
| 2 | Step 2 fact Log in | USER alex, PASS •••••• | USER alex@example.net, PASS •••••• |
| 3 | Learn fact Defined in | RFC 1939 | RFC 1939, Post Office Protocol, version 3 |

Word for word as the original: the title, full name and purpose; the scene, its table and both page cues (`text` on letter 1, `full` on letter 2); all five step titles; every message in the same order; and every other sentence, now shown as short paragraphs, one idea each, so that each cites its own sources.

### What the checker passed as a simplification

These are the `Note:` lines of the passing report on items it passed. Each is true in the ordinary case and stays as written.

1. **units[0].osi — ✅**: The badge says POP3 spans layers and cites nothing of its own. None of the sources fetched for this lesson (RFC 1939, RFC 2595, RFC 5034, RFC 8314, the IANA port registry, the Microsoft and Google pages and the other cited RFCs) places POP3 at a single OSI layer, so nothing contradicts the spanning badge.
2. **units[0].steps[0].deep[0] (step "tls-connection", Go deeper) — ✅**: RFC 1939 defines POP3 and its port 110; RFC 2595 defines the STLS command; RFC 8314 defines Implicit TLS and port 995 for POP3. All are Standards Track and none is obsoleted; RFC 1939 and RFC 2595 are updated by RFC 8314 (and RFC 2595 by RFC 7817 and RFC 4616), which keep STLS and add the Implicit TLS port, so the claim still holds.
3. **units[0].steps[0].deep[1] (step "tls-connection", Go deeper) — ✅**: RFC 1939 defines the PASS command and states its security property; RFC 8314 is the current Standards Track document defining TLS practice for mail access. It says to phase out cleartext service, not port 110 when it is upgraded with STLS; the claim says "plain port 110", which is the cleartext case. RFC 8314 is updated only by RFC 8997 (TLS 1.1 deprecation), which does not change this.
4. **units[0].steps[1].deep[0] (step "authentication", Go deeper) — ✅**: RFC 1939 defines USER and PASS; RFC 8314 defines how POP3 runs inside TLS. Both current.
5. **units[0].steps[1].deep[1] (step "authentication", Go deeper) — ✅**: RFC 1939 defines APOP; RFC 5034 defines the POP3 AUTH command (it obsoletes RFC 1734 and is not obsoleted). The provider part is confirmed by two independent publishers, Microsoft and Google, whose pages are live and describe current practice. The claim leaves out that Google discourages app passwords in favour of "Sign in with Google", and that APOP rests on MD5; neither makes the sentence false for a beginner.
6. **units[0].steps[1].deep[2] (step "authentication", Go deeper) — ✅**: RFC 1939 defines the AUTHORIZATION state and this lock; current (not obsoleted).
7. **units[0].steps[1].deep[2] (step "authentication", Go deeper) — ✅**: The RFC says the lock is taken "as necessary"; the claim states the ordinary case.
8. **units[0].steps[2].deep[0] (step "mailbox-status", Go deeper) — ✅**: RFC 1939 defines UIDL; current. UIDL is an optional command; the claim leaves that out, and "skip letters it already has" puts the RFC's semi-permanent-repository use in a beginner's words.
9. **units[0].steps[2].deep[1] (step "mailbox-status", Go deeper) — ✅**: RFC 1939 defines TOP; current. TOP is optional and the client names how many lines; "first few lines" says that loosely.
10. **units[0].steps[2].deep[2] (step "mailbox-status", Go deeper) — ✅**: RFC 1939 defines POP3's single maildrop; current. "Inbox" is the everyday word for the RFC's maildrop.
11. **units[0].steps[3].deep[0] (step "message-retrieval", Go deeper) — ✅**: RFC 1939 defines RETR and the multi-line ending; RFC 5321 defines SMTP's DATA command. RFC 5321 is not obsoleted; its only update, RFC 7504, adds reply codes and does not touch DATA.
12. **units[0].steps[3].deep[1] (step "message-retrieval", Go deeper) — ✅**: RFC 1939 defines UIDL and DELE; current. Google's help page is live. Some apps also offer to remove the server copy later (after some days, or when you delete locally); the claim leaves that option out, which does not mislead in the ordinary case.
13. **units[0].steps[4].deep[0] (step "delete-and-quit", Go deeper) — ✅**: RFC 1939 defines DELE and RSET; current.
14. **units[0].steps[4].deep[1] (step "delete-and-quit", Go deeper) — ✅**: RFC 1939 defines the UPDATE state; current.
15. **units[0].steps[4].deep[2] (step "delete-and-quit", Go deeper) — ✅**: Two independent publishers (Microsoft and Google); both pages are live and describe current practice.
16. **units[0].learn.lead[0] ("lead-1") — ✅**: RFC 1939 (STD 53) defines POP3 and is not obsoleted. "Empties the mailbox" is the ordinary case the RFC calls normal; leaving a copy on the server is the exception, taught elsewhere in the lesson.
17. **units[0].learn.terms[0] ("term-pop3") — ✅**: RFC 1939 defines POP3; current.
18. **units[0].learn.terms[1] ("term-status") — ✅**: RFC 1939 defines the status indicators; current.
19. **units[0].learn.terms[2] ("term-login") — ✅**: RFC 1939 defines USER and PASS; current.
20. **units[0].learn.terms[3] ("term-stat") — ✅**: RFC 1939 defines STAT and LIST; current.
21. **units[0].learn.terms[4] ("term-retr") — ✅**: RFC 1939 defines RETR; RFC 5322 defines the message format (headers, then body); RFC 2046 defines the multipart and image media types that carry a picture inside a message. None is obsoleted; RFC 5322's update (RFC 6854) and RFC 2046's updates do not touch these sections.
22. **units[0].learn.terms[5] ("term-dele") — ✅**: RFC 1939 defines DELE; current.
23. **units[0].learn.terms[6] ("term-quit") — ✅**: RFC 1939 defines QUIT; current. QUIT given before logging in deletes nothing, but then nothing is marked either.
24. **units[0].learn.pattern ("pattern") — ✅**: RFC 1939 defines the commands and the session; Microsoft and Google confirm the one-device outcome independently. All current and live. "Normally" keeps the exception (leaving a copy) open.
25. **units[0].learn.why[0] ("why-1") — ✅**: RFC 1939 defines POP3's design; current. "Light on the server" and "stored once, on your device" put the RFC's simple-server design and download-then-delete in a beginner's words, for the ordinary case.
26. **units[0].learn.why[1] ("why-2") — ✅**: RFC 1939 states the problem POP3 was designed for; Google's page is live. "Dial-up" is the everyday word for the RFC's intermittently connected personal computer.
27. **units[0].learn.why[2] ("why-3") — ✅**: RFC 9051 defines IMAP4rev2 and is not obsoleted; the Microsoft and Google pages are live.
28. **units[0].learn.deep[0] ("deep-states", Learn's Go deeper) — ✅**: RFC 1939 defines the three states and their commands (§9 also lists LIST, RETR, DELE, NOOP and RSET for the TRANSACTION state, and §6 says the server closes the TCP connection after QUIT); RFC 6409 defines message submission over SMTP. RFC 6409 is updated by RFC 8314, which adds the Implicit TLS port and leaves submission over SMTP as it is. Both current.
29. **units[0].learn.deep[0] ("deep-states", Learn's Go deeper) — ✅**: RFC 1939 §8 lets a site delete mail by its own policy outside the protocol; the claim, about the protocol, leaves that out.
30. **units[0].learn.facts[0] ("fact-ports") — ✅**: The IANA registry is the defining record of port assignments; its live XML (updated 2026-11-10) lists pop3 on TCP 110 ("Post Office Protocol - Version 3") and pop3s on TCP 995 (the passage above, with reference RFC 8314).
31. **units[0].learn.facts[1] ("fact-commands") — ✅**: RFC 1939 defines the command set; current. The fact lists the main commands and leaves out NOOP, RSET and the optional ones.
32. **units[0].learn.facts[2] ("fact-device") — ✅**: Two independent vendor pages, both live and current. Leaving a copy on the server is the exception, taught elsewhere in the lesson.
33. **units[0].learn.facts[3] ("fact-sending") — ✅**: RFC 1939 defines POP3's scope; RFC 6409 defines message submission. Both current.
34. **units[0].learn.facts[4] ("fact-defined") — ✅**: RFC 1939 (STD 53) defines POP3 and is not obsoleted; its updates (RFC 1957, RFC 2449, RFC 6186, RFC 8314) extend it.
35. **units[0].learn.facts[5] ("fact-connection") — ✅**: RFC 9293 defines TCP and its three-way handshake (its Figure 6 shows SYN, SYN-ACK, ACK) and is not obsoleted; RFC 8314 defines Implicit TLS for POP3; RFC 1939 defines the greeting.
36. **units[0].learn.facts[6] ("fact-tls") — ✅**: RFC 9846 (TLS 1.3, July 2026, obsoletes RFC 8446) defines the handshake; its §2 also shows the server's ServerHello, Certificate and Finished. RFC 6066 defines SNI (updated by RFC 9846 only for OCSP, not SNI); RFC 7817 defines the mail client's name check; RFC 8314 defines POP3 inside TLS. All current.
37. **units[0].learn.facts[6] ("fact-tls") — ✅**: The fact leaves out EncryptedExtensions, CertificateVerify and the client's own Finished, and SNI is optional in the standard though ordinary; a simplification that is not false.
38. **units[0].learn.facts[7] ("fact-mailbox") — ✅**: RFC 1939 defines the maildrop's numbering and UIDL; current.
39. **units[0].learn.facts[8] ("fact-retr") — ✅**: RFC 1939 defines RETR; RFC 5322 defines the message format. Both current.
40. **units[0].learn.facts[8] ("fact-retr") — ✅**: The size after +OK is what RFC 1939's own examples show; the RFC does not require it (its listed reply is "+OK message follows"). Not false for a beginner.
41. **units[0].practice[0].options[0] (question "phone-inbox") — ✅**: RFC 9051 defines IMAP and its \Seen flag kept on the server; RFC 1939 defines POP3's deletion. Both current. The option is wrong for POP3 and the feedback says so correctly.
42. **units[0].practice[0].options[1] (question "phone-inbox") — ✅**: RFC 1939 defines the deletion at QUIT; the Microsoft page is live. The right answer and its feedback hold for the lesson's scenario (download and delete).
43. **units[0].practice[0].options[2] (question "phone-inbox") — ✅**: RFC 1939 defines QUIT; current. The option is wrong and the feedback says why.
44. **units[0].practice[1].options[0] (question "when-deleted") — ✅**: RFC 1939 defines the UPDATE state; current.
45. **units[0].practice[1].options[1] (question "when-deleted") — ✅**: RFC 1939 defines DELE and the UPDATE state; current. The option is wrong and the feedback says why.
46. **units[0].practice[1].options[2] (question "when-deleted") — ✅**: RFC 1939 defines QUIT; current. A site may also delete old mail by its own policy (RFC 1939 §8), but that is outside the protocol and is not what the question asks about a letter marked with DELE.
47. **units[0].scene.backing (the scene) — ✅**: Addresses are RFC 1918 (192.168.1.100) and RFC 5737 (203.0.113.70) example values.
48. **units[0].steps[0].events[0] (event "m1") — ✅**: The log's client port (50950) and times are illustrative values; the addresses are RFC 1918 and RFC 5737 example addresses.
49. **units[0].steps[3].events[2] (event "mailbox-3") — ✅**: "Downloaded" shows what happened in this session (RETR sent the letter); it does not claim the server keeps a lasting record of it.

### Counts

5 corrections, 4 removals, 8 additions and 3 rewordings, counted from the numbered rows of the tables above. The sources are the claim sheet's list (19) against the one reference of the original. The report passed all 113 items.

## What is IMAP

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 18 sources (it listed one, RFC 9051, before) and passed its fact-check on 2026-11-12: 116 of 119 items on the first full check, with three imprecise (all traced items that said more than their Learn parts), and all nine re-checked items on the second re-check. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-imap.ts`), it has 14 corrections, 3 removals, 13 additions and 2 rewordings; the last sections list what the checker passed as a simplification and the counts. Its Go-deeper blocks and "why" are now split into one sentence per paragraph; the words are the same.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; a vendor page has none, so it is cited by its heading.

### The changes to look at first

1. **The figure now draws the fetched letter as words only.** In step 4, when Sam's letter arrives, the laptop's screen used to draw its words and a picture. Nothing in the story says Sam's letter has a picture (it is 4,203 octets); the photos are in Jo's letter, and only its headers are fetched. This is the one mark on the figure that changed. (Correction 14.)
2. **SELECT no longer says "1 unread".** The server's answer to SELECT gives the number of letters, not how many are unread, and the `[UNSEEN 2]` code in the log is deprecated in IMAP4rev2. The step text, the fact and both lines of the log now say "2 letters"; the app learns which is unread from the flags it fetches next. (Corrections 5 to 8.)
3. **"Each reply comes back with the matching tag" now says "each command's final reply".** The greeting and `* 2 EXISTS` carry no tag, and the lesson shows them. (Corrections 2 and 4.)
4. **IDLE: "servers end an IDLE after about 30 minutes" became "may log off a quiet app after 30 minutes or more".** The standard allows it and sets 30 minutes as the least; apps restart IDLE at least every 29 minutes. The Restarted fact now says "at least". (Corrections 9 and 10.)
5. **The OSI badge now spans, and "OSI layer: 7, application" is cut.** No allowed source places IMAP at an OSI layer. (Correction 13, Removal 1.)
6. **XOAUTH2 is no longer named.** One vendor names it. The sentence says "one that carries an OAuth sign-in token", which Microsoft and Google both state. (Correction 3.)
7. **"IMAP only saves a copy in Sent" and "unlike POP3" on storage are gone.** Gmail copies sent mail itself, and POP3 mail counts against storage while it is on the server. (Corrections 11 and 12.)
8. **"Phones often rely on the provider's own push service" is cut,** and "many apps keep one IMAP connection open" now says what the standard says. (Removal 2, Correction 1.)
9. **No message size is shown, except the two letters' own.** The 22 other sizes (a 74 B SYN, a 26 B DONE) are now a dash: no source states one, and DONE plus its line end is 6 octets, not 26. (Removal 3.)
10. **Eleven new Learn facts** state the TCP and TLS set-up, the replies, logging in, EXISTS, FETCH, the read mark, IDLE, delivery by SMTP, the full name and push against polling, so every Watch step has a Learn part to trace to. (Additions 1 to 11.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.


| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 1 Go deeper, second sentence | Many apps keep one IMAP connection open the whole time they’re running. | An app can keep its IMAP connection open while it runs, so the server can tell it about new mail at once (IDLE). | RFC 9051 §6.3.13 (IDLE: the command stays active and the server may send updates at any time). No allowed source says what many apps do, and what apps do needs two publishers. |
| 2 | Step 2 narrative, last sentence | IMAP lets an app send several commands at once, and each reply comes back with the matching tag, so the app knows which answer is which. | IMAP lets an app send several commands at once, and each command’s final reply comes back with the matching tag, so the app knows which answer is which. | RFC 9051 §2.2.2 and §5.5. Replies that start with * (the greeting, `* 2 EXISTS`) carry no tag; only a command’s completion reply does. The lesson itself shows the untagged ones. |
| 3 | Step 2 Go deeper, last sentence | AUTHENTICATE with a SASL mechanism (PLAIN, XOAUTH2) is often used instead of LOGIN, and CAPABILITY lists what the server supports. | AUTHENTICATE with a SASL mechanism (PLAIN, or one that carries an OAuth sign-in token) is often used instead of LOGIN, and CAPABILITY lists what the server supports. | RFC 9051 §6.2.2 (AUTHENTICATE, SASL, PLAIN) and §6.1.1 (CAPABILITY); Microsoft Outlook.com settings ("requires the use of Modern Auth / OAuth2"); Google Workspace OAuth transition (IMAP will no longer work with legacy passwords). XOAUTH2 is named by one publisher only. |
| 4 | Step 2 fact Tags | match each reply to its command | match each command’s final reply to it | RFC 9051 §2.2.2, as correction 2. |
| 5 | Step 3 narrative, third sentence | The server answers: 2 letters, 1 unread. | The server answers: 2 letters. | RFC 9051 §7.4.1 (EXISTS gives the number of messages) and §6.3.2 (the replies SELECT must send). SELECT's answer does not say how many are unread: the `[UNSEEN]` code is deprecated in IMAP4rev2 (Appendix E) and in IMAP4rev1 gave the number of the first unseen letter, never a count. The app learns it from the flags it fetches next. |
| 6 | Step 3 fact Answer | 2 letters, 1 unread | 2 letters (* 2 EXISTS) | RFC 9051 §7.4.1, as correction 5. |
| 7 | Step 3 message `2 EXISTS`, summary | * 2 EXISTS: 2 letters in the inbox, 1 unread. | * 2 EXISTS: 2 letters in the inbox. | RFC 9051 §7.4.1, as correction 5. |
| 8 | Step 3 message `2 EXISTS`, info | * 2 EXISTS, * OK [UNSEEN 2], a2 OK | * 2 EXISTS, a2 OK | RFC 9051 Appendix E ("UNSEEN response code on SELECT/EXAMINE is now deprecated"); the lesson names IMAP4rev2. §7.4.1 and §2.2.2 for the rest. |
| 9 | Step 5 Go deeper, first sentence | Servers end an IDLE after about 30 minutes, so apps restart it every 29 minutes or so. | A server may log off a quiet app after 30 minutes or more, so apps restart IDLE at least every 29 minutes. | RFC 9051 §6.3.13 (a server "MAY log the client off" after its inactivity timeout; clients are advised to reissue IDLE at least every 29 minutes) and §5.4 (the timer must be at least 30 minutes). The old sentence made a permission a rule, and "about 30" allowed less. |
| 10 | Step 5 fact Restarted | about every 29 minutes | at least every 29 minutes | RFC 9051 §6.3.13, as correction 9. |
| 11 | Learn Go deeper, third sentence | Mail is still sent with SMTP; IMAP only saves a copy in Sent. | Mail is still sent with SMTP; IMAP can keep a copy in your Sent folder. | RFC 9051 §7.3.1 (some servers put sent messages in \Sent themselves) and §6.3.12 (APPEND); Microsoft Exchange POP3 and IMAP4 (Overview); Gmail IMAP settings (Sending: Gmail copies sent mail itself). |
| 12 | Learn Go deeper, last sentence | The mail counts against your storage on the server, unlike POP3. | Because it stays on the server, your mail counts against your storage there. | RFC 9208 §5.1 (STORAGE is the space the mailboxes use) and Google storage (What counts towards your storage quota). "Unlike POP3" was misleading: POP3 mail counts while it is on the server, and many POP3 apps keep copies there (Microsoft Exchange, Overview). |
| 13 | The OSI badge | osiLayers: [7] | osi: 'spans' | No allowed source places IMAP at an OSI layer. Cloudflare calls it an application-layer protocol without naming OSI, and Microsoft places it in the TCP/IP application layer and says it does not cover OSI. The owner's badge rule (as What is DHCP) is to span. See also Removed 1. |
| 14 | Step 4 message LETTER, page cue | page: 'full' | page: 'text' | RFC 9051 §6.4.5 (`BODY[]` is the whole message) and §4.3 (`{4203}` is its length). The story fetches only Sam's letter, 4,203 octets, and nothing says it has a picture; the photos are in Jo's letter, of which only the headers are fetched. So the laptop's screen draws the letter's words only. |


### Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Overview fact "OSI layer" | 7, application | No source places IMAP at an OSI layer; the badge now spans (Correction 13). |
| 2 | Step 5 Go deeper, last sentence | Phones often rely on the provider’s own push service instead, to save battery. | No allowed source states what phones and providers do, and that needs two publishers. |
| 3 | The log's Size column, 22 of its 24 messages | 74 B, 74 B, 66 B, 517 B, 4.1 KB, 52 B, 56 B, 40 B, 34 B, 212 B, 48 B, 960 B, 40 B, 44 B, 64 B, 28 B, 30 B, 36 B, 26 B, 40 B, 44 B, 480 B; now shown as — | No source states a size, and a size in a log reads as a fact about the protocol. The two letters' sizes stay as example data: 4.2 KB (Sam's, whose `{4203}` is the same number) and 1.2 MB (Jo's, with photos). |

### Added

New statements, terms and facts, with why each was needed. The new Learn facts are the parts the Watch steps and the Overview trace to; the old Learn did not state these ideas. Each cites the section named.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact "Rides on" | TCP, opened with the three-way handshake (SYN, SYN-ACK, ACK); on port 993 TLS seals the line first, and every IMAP message then travels inside TLS on that TCP connection | The log's TCP rows, port 993 and "over TCP" had no Learn part. RFC 9051 §2.1, RFC 9293 §3.5, RFC 8314 §3.2. |
| 2 | Learn fact "Sealing the line" | the app’s ClientHello names the server (SNI); the server answers with its ServerHello, its certificate and Finished, and the app checks the certificate is for that name | The two TLS hello rows. RFC 8314 §3.2, RFC 9846 §2, RFC 6066 §3, RFC 9051 §11.1. |
| 3 | Learn fact "Replies" | lines starting * are untagged, like the greeting * OK; the final one carries the command’s tag and OK, NO or BAD, so an app with several commands in progress knows which answer is which | The greeting, the tags and `a1 OK`. RFC 9051 §2.2.2, §7.1.1, §5.5. |
| 4 | Learn fact "Logging in" | LOGIN sends your name and password, so it is used only inside TLS; AUTHENTICATE is the other way | The LOGIN row. RFC 9051 §6.2.3, §6.2.2, RFC 8314 §3.2. |
| 5 | Learn fact "EXISTS" | how many letters the open folder holds: sent after SELECT, and again when new mail arrives | The `* 2 EXISTS` and `* 3 EXISTS` rows. RFC 9051 §7.4.1, §6.3.2. |
| 6 | Learn fact "FETCH can ask for" | FLAGS; ENVELOPE (who it’s from, the subject); BODY.PEEK[], the whole letter without marking it read, which comes back as BODY[] with its length in braces | The three FETCH commands and their replies. RFC 9051 §6.4.5, §7.5.2, §4.3. |
| 7 | Learn fact "Read mark" | the \Seen flag; STORE +FLAGS (\Seen) adds it, and the server answers with the letter’s new flags | The STORE command, its reply and the Flags column. RFC 9051 §2.3.2, §6.4.6. |
| 8 | Learn fact "While idling" | the server answers +, sends news such as * 3 EXISTS, and stops when the app sends DONE; apps restart IDLE at least every 29 minutes | The IDLE rows and the Restarted fact. RFC 9051 §6.3.13, §7.6. |
| 9 | Learn fact "New mail arrives by" | SMTP over TCP, on port 25, from other mail servers; the server puts it in your mailbox for IMAP to read | The SMTP delivery in step 5 and the party "The internet". RFC 5321 §2.3.10 and §4.5.4.2, RFC 9051 §5.2, IANA ports. |
| 10 | Learn fact "Stands for" | Internet Message Access Protocol | The unit's full name was in no Learn part. RFC 9051 Abstract. |
| 11 | Learn fact "Push, not polling" | without IDLE an app polls, asking the server for new mail every few minutes; with IDLE the server pushes news to the app as it happens | Step 5 says "every few minutes" and "push". RFC 9051 §6.3.13; Microsoft Exchange POP3 and IMAP4 (POP3 and IMAP4 applications and settings); Gmail IMAP settings; RFC 5550 §5.4.2 for the word "push". |
| 12 | Learn fact "Versus POP3" | "many devices, one mailbox" gained "; POP3 reads just one folder" | Step 3 says "Unlike POP3, IMAP knows about folders" and no Learn part stated the POP3 side. RFC 1939 §1 and Microsoft Exchange POP3 and IMAP4 (Overview). |
| 13 | Learn term "Folders (mailboxes)" | "Inbox, Sent, Archive" gained ", your own" | Step 3's "any you make" and its fact "Folders" say it. RFC 9051 Abstract (creating mailboxes), §5.1, §7.3.1. |

### Reworded, same meaning

The words changed, the claim did not.


| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 1 Go deeper, first sentence | IMAP uses port 143 in plain text, upgradable with STARTTLS, or 993 with TLS from the start (IMAPS). | IMAP uses port 143 in plain text, upgradable with STARTTLS, or 993 with TLS from the start (implicit TLS). | RFC 9051 §2.1 and §6.2.1; RFC 8314 §2 (the name "Implicit TLS"), §3 and §3.2. The RFC's own name for port 993. |
| 2 | Step 2 fact Log in | a1 LOGIN alex •••••• | a1 LOGIN alex@example.net •••••• | Example data. The log's LOGIN message already used alex@example.net; the fact now matches it. Form from RFC 9051 §6.2.3. |


### What the checker passed as a simplification

Every `Note:` line of the passing reports (`docs/fact-checks/what-is-imap.md` and `what-is-imap.recheck.md`), on an item it passed, with the item. The three items the full check marked imprecise are judged again in the re-check, so their notes are the second list. One note, that RFC 9051 defines IMAP4rev2 and is current, is on 47 items; it is given once.


**Currency note, on 47 items:** "RFC 9051 defines IMAP4rev2, the current version of IMAP; it is an Internet Standards Track RFC, obsoletes RFC 3501, and the RFC Editor lists it as neither obsoleted nor updated (checked 2026-11-12)."

Items: `units[0].steps[0].deep[1] (step "tls-connection", Go deeper)`; `units[0].steps[1].deep[0] (step "authentication", Go deeper)`; `units[0].steps[1].deep[1] (step "authentication", Go deeper)`; `units[0].steps[1].deep[2] (step "authentication", Go deeper)`; `units[0].steps[2].deep[0] (step "folder-selection", Go deeper)`; `units[0].steps[2].deep[1] (step "folder-selection", Go deeper)`; `units[0].steps[2].deep[2] (step "folder-selection", Go deeper)`; `units[0].steps[2].deep[3] (step "folder-selection", Go deeper)`; `units[0].steps[3].deep[0] (step "fetch-and-flag", Go deeper)`; `units[0].steps[3].deep[1] (step "fetch-and-flag", Go deeper)`; `units[0].steps[3].deep[2] (step "fetch-and-flag", Go deeper)`; `units[0].steps[3].deep[3] (step "fetch-and-flag", Go deeper)`; `units[0].steps[4].deep[0] (step "idle-push", Go deeper)`; `units[0].steps[4].deep[1] (step "idle-push", Go deeper)`; `units[0].learn.lead[0] ("lead-1")`; `units[0].learn.terms[0] ("term-imap")`; `units[0].learn.terms[1] ("term-tag")`; `units[0].learn.terms[2] ("term-folders")`; `units[0].learn.terms[3] ("term-select")`; `units[0].learn.terms[4] ("term-fetch")`; `units[0].learn.terms[5] ("term-flag")`; `units[0].learn.terms[6] ("term-store")`; `units[0].learn.terms[7] ("term-idle")`; `units[0].learn.pattern ("pattern")`; `units[0].learn.why[0] ("why-1")`; `units[0].learn.why[1] ("why-2")`; `units[0].learn.deep[0] ("deep-version", Learn's Go deeper)`; `units[0].learn.deep[1] ("deep-sync", Learn's Go deeper)`; `units[0].learn.deep[2] ("deep-sending", Learn's Go deeper)`; `units[0].learn.facts[0] ("fact-ports")`; `units[0].learn.facts[1] ("fact-commands")`; `units[0].learn.facts[2] ("fact-stays")`; `units[0].learn.facts[3] ("fact-versus")`; `units[0].learn.facts[4] ("fact-defined")`; `units[0].learn.facts[5] ("fact-rides")`; `units[0].learn.facts[7] ("fact-replies")`; `units[0].learn.facts[8] ("fact-login")`; `units[0].learn.facts[9] ("fact-exists")`; `units[0].learn.facts[10] ("fact-fetch")`; `units[0].learn.facts[11] ("fact-seen")`; `units[0].learn.facts[12] ("fact-idle")`; `units[0].practice[0].options[0] (question "phone-shows")`; `units[0].practice[0].options[1] (question "phone-shows")`; `units[0].practice[0].options[2] (question "phone-shows")`; `units[0].practice[1].options[0] (question "idle")`; `units[0].practice[1].options[1] (question "idle")`; `units[0].practice[1].options[2] (question "idle")`.

**First full check, the other notes** (a note that begins with the currency sentence keeps only what follows it):

| Item | Note |
|---|---|
| `units[0].osi` | the badge says the topic spans layers, and the item cites nothing. No source fetched in this run (RFC 9051, RFC 8314, RFC 9293, RFC 9846, RFC 6066, RFC 5321, RFC 1939, RFC 6409, RFC 7162, RFC 9208, the IANA registry, the Microsoft and Google pages) places IMAP at a single OSI layer, so the spanning badge stands under the OSI badge rule. |
| `units[0].steps[0].deep[0] (step "tls-connection", Go deeper)` | RFC 9051 defines the IMAP ports and the STARTTLS command; RFC 8314 defines Implicit TLS for IMAP on port 993. RFC 8314 is not obsoleted; its one update (RFC 8997, deprecating TLS 1.1) does not touch ports. |
| `units[0].steps[0].deep[1] (step "tls-connection", Go deeper)` | the RFC frames this as the IDLE command staying active rather than as keeping the connection open; the claim says the same in plain words. |
| `units[0].steps[1].deep[0] (step "authentication", Go deeper)` | "extra information on the way" is a loose word for server data and status responses that do not complete a command. |
| `units[0].steps[1].deep[2] (step "authentication", Go deeper)` | (currency) It defines AUTHENTICATE, LOGIN and CAPABILITY, and requires AUTH=PLAIN. |
| `units[0].steps[1].deep[2] (step "authentication", Go deeper)` | the OAuth part rests on Microsoft and Google, which each require OAuth for IMAP on their services; the RFC itself names SASL mechanisms generally. |
| `units[0].steps[2].deep[0] (step "folder-selection", Go deeper)` | (currency) It defines the SELECT command and its required responses. |
| `units[0].steps[2].deep[1] (step "folder-selection", Go deeper)` | the RFC allows a UID to change between sessions in rare cases, detectable through UIDVALIDITY; the claim leaves out that exception. |
| `units[0].steps[2].deep[3] (step "folder-selection", Go deeper)` | the list leaves out \Recent, which RFC 9051 marks deprecated. |
| `units[0].steps[3].deep[1] (step "fetch-and-flag", Go deeper)` | +FLAGS and -FLAGS take a list of flags, not only one; "adds one" is a loose simplification. |
| `units[0].steps[3].deep[2] (step "fetch-and-flag", Go deeper)` | leaves out other routes (MOVE to a Trash folder, UID EXPUNGE); the two-step model is the protocol's own. |
| `units[0].steps[4].deep[1] (step "idle-push", Go deeper)` | IDLE reports changes to the selected mailbox, and only one mailbox can be selected per connection. |
| `units[0].learn.terms[2] ("term-folders")` | Sent and Archive are special-use mailbox roles a server may offer; the RFC says a server MAY include them. |
| `units[0].learn.terms[4] ("term-fetch")` | "just their headers" is loose for ENVELOPE or header sections. |
| `units[0].learn.terms[5] ("term-flag")` | flags may also be session-only; the ordinary read and flagged marks are permanent and seen by later sessions. |
| `units[0].learn.pattern ("pattern")` | "roughly this way" covers sessions that use AUTHENTICATE instead of LOGIN. "Nothing is deleted unless you ask" holds for the protocol: removal needs \Deleted then EXPUNGE from a client; server-side retention policies are outside IMAP. |
| `units[0].learn.why[0] ("why-1")` | apps also keep local copies (taught in "deep-sync"); "the one true copy" is a loose phrase for the server holding the authoritative mailbox. |
| `units[0].learn.deep[0] ("deep-version", Learn's Go deeper)` | many servers still speak IMAP4rev1 too; the claim is about the current standard. |
| `units[0].learn.deep[1] ("deep-sync", Learn's Go deeper)` | RFC 7162 defines CONDSTORE and QRESYNC; it is Standards Track and not obsoleted. |
| `units[0].learn.deep[2] ("deep-sending", Learn's Go deeper)` | RFC 6409 is not obsoleted; its update RFC 8314 adds TLS and does not change that submission uses SMTP. |
| `units[0].learn.deep[3] ("deep-storage", Learn's Go deeper)` | RFC 9208 defines the IMAP QUOTA extension and its STORAGE resource; not every server sets a quota, which the claim leaves out. Google's storage page confirms independently. |
| `units[0].learn.facts[0] ("fact-ports")` | the IANA registry is the defining registry for port assignments; the live registry lists imap on 143 and imaps on 993. |
| `units[0].learn.facts[3] ("fact-versus")` | RFC 1939 defines POP3 and is not obsoleted. "Just one folder" is the ordinary case; Microsoft says usually the Inbox. |
| `units[0].learn.facts[5] ("fact-rides")` | RFC 9293 defines TCP and its three-way handshake; it is not obsoleted. |
| `units[0].learn.facts[6] ("fact-tls")` | RFC 9846 defines TLS 1.3 (it obsoletes RFC 8446 and is not obsoleted); RFC 6066 defines the server_name (SNI) extension and is not obsoleted; RFC 9051 defines the IMAP client's hostname check. |
| `units[0].learn.facts[6] ("fact-tls")` | the summary leaves out EncryptedExtensions, CertificateVerify and the client's own Finished, and SNI is optional in the RFC though ordinary in practice. |
| `units[0].learn.facts[8] ("fact-login")` | "only inside TLS" is loose: the RFC also allows another protection against password snooping, and it ranks LOGIN as a last resort after AUTHENTICATE. |
| `units[0].learn.facts[10] ("fact-fetch")` | the RFC calls BODY.PEEK[] an alternate form of BODY[] and lists only BODY[...] among FETCH response items; a body string may also be sent quoted, but a whole letter is ordinarily sent as a literal with its length in braces. |
| `units[0].learn.facts[13] ("fact-delivery")` | RFC 5321 defines SMTP and is not obsoleted (updated only by RFC 7504, on reply codes); the IANA registry assigns smtp port 25. |
| `units[0].learn.facts[13] ("fact-delivery")` | mail between users of one provider may be delivered internally; the claim gives the ordinary case. |
| `units[0].practice[0].options[1] (question "phone-shows")` | POP3 apps can be set to leave copies; "that's POP3" describes its default. |
| `units[0].practice[1].options[2] (question "idle")` | "never" holds for the protocol; another of your apps can also delete, and server retention rules sit outside IMAP. |

**Second list, the re-check:**

| Item | Note |
|---|---|
| `units[0].learn.facts[14] ("fact-name")` | RFC 9051 is the defining standard for IMAP (version 4rev2), and its abstract gives the protocol's full name. The lesson's expansion leaves out the version suffix, which is not part of what the letters stand for. |
| `units[0].learn.facts[14] ("fact-name")` | RFC 9051 is a Proposed Standard, not obsoleted and not updated by any later RFC (RFC Editor metadata, checked 2026-11-12). |
| `units[0].learn.facts[15] ("fact-push")` | RFC 9051 defines the IDLE command and its behaviour, so it is the defining standard for both halves of the claim (polling without it, real-time updates with it). |
| `units[0].learn.facts[15] ("fact-push")` | Microsoft's page and RFC 9051 are independent, and each states both the periodic check and the near-real-time updates with IDLE. Google's recommended Thunderbird setting gives a concrete polling interval of ten minutes, which "every few minutes" states loosely. |
| `units[0].learn.facts[15] ("fact-push")` | True for a beginner. The claim leaves out that an app without IDLE may also check only at start-up or by hand, and that other push methods exist (NOTIFY, or out-of-band wake-ups, as RFC 5550 describes); the ordinary case is as stated. |
| `units[0].learn.facts[15] ("fact-push")` | RFC 5550 is a Proposed Standard, not obsoleted or updated. The Microsoft and Google pages are live and describe current products, checked 2026-11-12. |
| `units[0].backing (the unit's full name and purpose)` | The full name traces to fact-name. "Email kept in sync" traces to fact-stays, why-2 (every device shows the same folders, letters and read marks) and deep-sync (apps sync changes); it adds nothing beyond them. |
| `units[0].overview.facts[2] (Overview fact "Keeps")` | Folders trace to term-folders and lead-1 (the mailbox is kept on the server); read marks kept on the server trace to term-flag and fact-seen. Nothing is added. |
| `units[0].steps[4] (step "idle-push")` | Asking every few minutes traces to fact-push; IDLE as "tell me when something changes" to term-idle; the wait staying open until DONE to fact-idle; "* 3 EXISTS" meaning there are now three letters to fact-idle and fact-exists; fetching the new letter's headers to fact-fetch (ENVELOPE) and term-fetch; push and mail showing up promptly to fact-push and lead-1 ("the moment it arrives"). "Within seconds" is looser than what those parts say, not more. In its place after the fetch-and-flag step, the count of three follows the two letters SELECT reported, so the walk-through stays in order. |
| `units[0].practice[0].prompt (question "phone-shows")` | The premise (reading a letter on a laptop with IMAP) is sound, and the question rests on why-2 and the fetch-and-flag step. |
| `units[0].practice[1].prompt (question "idle")` | No premise beyond IDLE existing, which the lesson teaches. |


### Counts

- Sources: 18 now, one (RFC 9051) before. Items on the claim sheet: 121 now.
- Corrections: 14. Removed: 3 (one of them 22 sizes). Added: 13. Reworded, same meaning: 2.
- Word for word as before: every other sentence, including the two Practice questions and their answers, the step titles, the scene, the party labels and the Overview hook (the changes to the Learn parts above are all additions or the corrections listed).

## What is FTP

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 28 sources (it listed one, RFC 959, before) and passed its fact-check on 2026-11-12: 121 of 122 items on the first full check, with one imprecise (the Learn fact “Safer”, which gave FTPS only its port 990), and all 122 on the second full check. The check ran under the owner’s rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-ftp.ts`), it has 9 corrections, 1 removal (19 message sizes), 9 additions (6 new Learn facts and 3 widened Learn parts) and no rewordings; the last sections list what the checker passed as a simplification and the counts. Its Go-deeper blocks and “why” are now split into one sentence per paragraph; the words are the same. The shape did not change: the six steps, every event, the table and its six rows, the four connection cues, the scene and both questions are as they were.

Source names are the ones the lesson’s Sources list shows. Section numbers are the RFC’s own; RFC 959’s subsections are cited by the page they start on, since its web page has anchors only for sections 1 to 8. A vendor page has no section numbers, so it is cited by its heading.

### The changes to look at first

1. **“Safer” now says FTPS’s standard port is 21.** The old fact, “SFTP (22), FTPS (990)”, left a beginner thinking FTPS always uses 990. RFC 4217 starts the session on the normal control port, 21, and moves to TLS with AUTH TLS; 990 is only the kind that is sealed from the start. The first check marked it imprecise; it now reads “SFTP (22), FTPS (21 with AUTH TLS, or 990)” and passed the second check. (Correction 9.)
2. **“Today most people use SFTP instead” is gone.** No source counts users, and none says SFTP uses one connection. Step 6 now says SFTP is “a safer choice today” and that, where FTP is still used, the advice is to switch to FTPS or SFTP. The Practice feedback no longer says SFTP “replaced” FTP. (Corrections 3, 4 and 8.)
3. **SFTP “shares nothing with FTP” and TFTP is “a tiny version” are corrected.** SFTP is a separate protocol built on SSH; TFTP is a tiny protocol of its own, not a version of FTP. (Corrections 5 and 6.)
4. **“Built for a small, trusting network, and for decades the standard way” is cut.** The lesson now says FTP is one of the oldest internet protocols, first built in the 1970s to move files between computers on the ARPANET. (Correction 7.)
5. **The log no longer says “BINARY mode”, and the file crosses in “many” TCP pieces, not “thousands”.** The story sends no TYPE command, and 2.4 MB is about 1,650 pieces. (Corrections 1 and 2.)
6. **No message size is shown, except the file’s own 2.4 MB.** The 19 other sizes (a 74 B SYN, a 12 B USER) are now a dash: no source states one. (Removed 1.)
7. **The OSI badge stays at layer 7, now cited.** Palo Alto Networks and Cloudflare each place FTP at the application layer; no standard does, so the badge rests on those two pages. The Overview fact “OSI layer: 7, application” stays. (Added 8.)
8. **The 220 row still says “the server’s name and software”, and now a Learn part states it.** The Learn codes sentence says the greeting often carries the server’s name and software, and that 221 closes the control connection. (Added 1.)
9. **Six new Learn facts** state the TCP set-up, the modes, one data connection per file, TFTP, the OSI layer and the full name, so every Watch step has a Learn part to trace to. (Added 4 to 9.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 4 message 150, log line | 150 Opening BINARY mode data connection for report.pdf | 150 Opening data connection for report.pdf | RFC 959 §4.2.1, page 41 (150 is “File status okay; about to open data connection”). “BINARY mode” names a transfer type no Learn part states, and the story sends no TYPE command. |
| 2 | Step 5 narrative, first sentence | The file goes over the data connection: 2.4 MB, in thousands of TCP pieces, shown on the map as one tag. | The file goes over the data connection: 2.4 MB, in many TCP pieces, shown on the map as one tag. | RFC 9293 §2.2 (the byte stream goes in TCP segments). 2.4 MB is about 1,650 full segments, not thousands. |
| 3 | Step 6 narrative, second sentence | Today most people use **SFTP** instead, which does the same job through one sealed SSH connection. | A safer choice today is **SFTP**, which does the same job inside a sealed SSH connection. | Microsoft SFTP-SSH connector (SFTP is an extension of SSH 2.0), Cloudflare Spectrum glossary (SFTP uses SSH for encryption), Google Merchant Center (SFTP is encrypted). No allowed source counts how many people use it, and none says it uses one connection. |
| 4 | Step 6 narrative, third sentence | FTP still turns up on old systems and in exam questions, mostly as the example of what not to send in plain text. | Where FTP is still used, the advice is to switch to FTPS or SFTP, so nothing crosses in plain text. | Microsoft App Service, Enforce FTPS (“To disable unencrypted FTP”), RFC 2577 §6 (use strong encryption whenever possible), Google Merchant Center. No source says where FTP still turns up. |
| 5 | Step 6 Go deeper, SFTP | SFTP (the SSH File Transfer Protocol, port 22) shares nothing with FTP but its purpose. | SFTP (the SSH File Transfer Protocol, port 22) is a separate protocol from FTP, built on SSH. | Microsoft Azure Blob Storage and SFTP-SSH connector, Google Merchant Center, Cloudflare Spectrum. “Shares nothing” has no source; two publishers state that SFTP is its own protocol built on SSH. |
| 6 | Step 6 Go deeper, TFTP | TFTP (UDP 69) is a tiny version with no login, used to load network devices. | TFTP (UDP 69) is a tiny protocol of its own, with no login, used to load software onto devices over the network. | RFC 1350 §1 (TFTP is a protocol of its own, with no user authentication) and §4 (port 69); Cisco router upgrade page and Microsoft PXE page for the use. TFTP is not a version of FTP. |
| 7 | Learn why, first sentence | FTP was built in the 1970s for a small, trusting network, and for decades it was the standard way to move files. | FTP is one of the oldest internet protocols: it was first built in the 1970s, to move files between computers on the ARPANET. | RFC 959 §2.1, page 2 (first proposals in 1971; “a protocol for file transfer between HOSTs on the ARPANET”). No source says “small, trusting” or “for decades the standard way”. The first sentence of the Overview hook, “one of the oldest internet protocols”, is now stated here. |
| 8 | Practice “wifi-login”, option 1 feedback | Yes. FTP sends both as plain text. That’s why SFTP replaced it. | Yes. FTP sends both as plain text. That’s why SFTP and FTPS are the safer choices. | Microsoft App Service, Enforce FTPS; Google Merchant Center. No source says SFTP replaced FTP. |
| 9 | Learn fact “Safer” (put right by the first check) | SFTP (22), FTPS (990) | SFTP (22), FTPS (21 with AUTH TLS, or 990) | RFC 4217 §3, §4.1 and §16 (an FTPS session starts on the normal control port, 21, and the client asks for TLS with AUTH TLS); IANA registry (990 is “ftps”, TLS from the start); Microsoft App Service FAQ (explicit encryption on 21, implicit on 990). The checker marked the old value imprecise on the first check: standard FTPS starts on port 21, and 990 is only the kind sealed from the start. The second check passed it. |

### Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | The log’s Size column, 19 of its 20 messages | 74 B, 74 B, 66 B, 52 B (step 1); 12 B, 34 B, 18 B, 30 B (step 2); 6 B, 50 B (step 3); 74 B, 74 B, 66 B, 18 B, 54 B (step 4); 66 B, 24 B (step 5); 6 B, 14 B (step 6); now shown as — | No source states a size, and a size in a log reads as a fact about the protocol. “USER alex” with its line end is 11 bytes and “PASS sunflower7” is 17, so two of the old sizes did not even match the example. The file’s own 2.4 MB stays as example data. |

### Added

New statements, terms and facts, and Learn parts widened so a Watch part could trace to them, with why each was needed. Each cites the sections named. A dash in Before means the part is new.

| # | Where | Before | After | Why it was needed |
|---|---|---|---|---|
| 1 | Learn deep paragraph (widened) | Codes worth knowing: 220 ready, 331 need password, 230 logged in, 227 passive, 150 opening data connection, 226 transfer complete, 221 goodbye, 530 not logged in. | Codes worth knowing: 220 ready, often with the server’s name and software in its text, 331 need password, 230 logged in, 227 passive, 150 opening data connection, 226 transfer complete, 221 goodbye, closing the control connection, 530 not logged in. | The Watch row “the server’s name and software” (step 1) and “the control connection closes too” (step 6) had no Learn part. RFC 959 §4.2 page 35 (reply text is server-dependent) and §4.2.1 page 40 (221 closes the control connection); Cisco ASA FTP inspection and Microsoft IIS FTP messages (the default greeting banner shows version or server type). |
| 2 | Learn fact “Codes” (widened) | 220, 331, 230, 227, 150, 226, 221 | 220, 331, 230, 227, 150, 226, 221; in 227 the port is the fifth number × 256 + the sixth | The step 3 fact “Means: connect to port 50000” decodes the 227 reply, which only the step’s Go deeper stated. RFC 959 §4.1.2 page 28 and §4.2.1 page 40. |
| 3 | Learn term “SFTP” (widened) | File transfer inside SSH | File transfer inside a sealed SSH connection | Step 6 now says “inside a sealed SSH connection”. Microsoft SFTP-SSH connector, Cloudflare Spectrum glossary, Google Merchant Center. |
| 4 | Learn fact “Runs on” | — | TCP, inside IP: each connection opens with a handshake of three messages (SYN, SYN-ACK, ACK), carries the data in pieces, and closes with FIN | The log’s TCP rows, the SYN, SYN-ACK, ACK and FIN messages and “FTP via TCP” had no Learn part. RFC 959 §8, RFC 1579 (a secondary TCP connection for files), RFC 9293 §3.5, §2.2 and §3.1. |
| 5 | Learn fact “Modes” | — | passive (usual): the client opens the data connection, which gets through home routers; active: the server connects back from port 20, often blocked | Step 3’s “works through home routers” and the Overview fact “Modes” had no Learn part. RFC 959 §4.1.2 and §5.2, §8; RFC 1579; Microsoft IIS FTP firewall settings; Cloudflare Spectrum FTP. |
| 6 | Learn fact “Each file” | — | gets a data connection of its own, and the sender closes it to mark the end of the file | “Another for each file”, the end of the file and the FIN message had no Learn part. RFC 959 §3.3 and §3.4.1; RFC 1579; Cisco ASA FTP inspection. |
| 7 | Learn fact “Cousin” | — | TFTP: a tiny separate protocol on UDP port 69, with no login | Step 6’s fact “Cousin: TFTP, UDP 69” had no Learn part. RFC 1350 §1 and §4; IANA registry. |
| 8 | Learn fact “OSI layer” | — | 7, application | The Overview fact “OSI layer: 7, application” stays, so it needs a Learn part to trace to. Palo Alto Networks (two sections) and Cloudflare’s What is SSH? place FTP at layer 7; no standard does, so the badge rests on two vendors’ pages, as the owner’s rule allows. None is marked defining. |
| 9 | Learn fact “Stands for” | — | File Transfer Protocol | The unit’s full name was in no Learn part. RFC 959, Status of this Memo (“the official specification of the File Transfer Protocol”). |

### Reworded, same meaning

None. Every sentence that changed is a correction above, and every other sentence is word for word as before.

### What the checker passed as a simplification

Every `Note:` line of the passing report (`docs/fact-checks/what-is-ftp.md`, the second full check) on an item it passed, with the item. The notes written when the first check marked the Learn fact “Safer” imprecise are not here; the second check’s note on it is.

| Item | Note |
|---|---|
| `units[0].osi` | Two vendors, on different sites, each place FTP at the application layer, layer 7. No standard places it; the owner's rule lets the badge rest on two vendors' pages. Both pages are live explainers. |
| `units[0].steps[0].deep[0] (step "control-connection", Go deeper)` | RFC 959 defines FTP's reply codes. The five-value list starts on page 37 and its last entry, 5yz, sits at the top of page 38, in the same section 4.2. |
| `units[0].steps[0].deep[0] (step "control-connection", Go deeper)` | The short glosses ("started", "done", "need more", "try later", "failed") are everyday words for the five classes. RFC 5321 adds that SMTP has no 1yz class; "like SMTP's" still holds for the shared three-digit design. |
| `units[0].steps[0].deep[0] (step "control-connection", Go deeper)` | RFC 959 is an Internet Standard, not obsoleted. Its six updating RFCs (2228, 2640, 2773, 3659, 5797, 7151) add commands and options and leave the reply classes as they are. RFC 5321 is not obsoleted; RFC 7504 updates it with two SMTP codes only. |
| `units[0].steps[0].deep[1] (step "control-connection", Go deeper)` | RFC 959 is the defining standard for the FTP control connection and its lifetime. |
| `units[0].steps[0].deep[1] (step "control-connection", Go deeper)` | It leaves out the case of a dropped connection or a server timeout; in the ordinary case the line stays up until the user quits. |
| `units[0].steps[1].deep[0] (step "plaintext-login", Go deeper)` | RFC 959 defines these reply codes. "The login failed" is an everyday reading of "not logged in", which is the reply to a rejected login. |
| `units[0].steps[1].deep[1] (step "plaintext-login", Go deeper)` | Two independent sources (an RFC and Microsoft's IIS documentation). The claim leaves out that some sites ask for an e-mail address, and that IIS also accepts the user name "ftp"; true in the ordinary case. |
| `units[0].steps[1].deep[1] (step "plaintext-login", Go deeper)` | RFC 1635 is not obsoleted. The IIS page is live and IIS's FTP service is a current Windows Server feature. |
| `units[0].steps[1].deep[2] (step "plaintext-login", Go deeper)` | RFC 4217 is the defining standard for securing FTP with TLS through the AUTH TLS command. It does not use the name "FTPS"; that is the everyday name for this, used by Microsoft's and Cloudflare's pages elsewhere on this sheet. |
| `units[0].steps[1].deep[2] (step "plaintext-login", Go deeper)` | RFC 4217 is not obsoleted. RFC 8996 updates it only to retire TLS 1.0 and 1.1, which does not touch the claim. |
| `units[0].steps[1].deep[3] (step "plaintext-login", Go deeper)` | Microsoft and Cloudflare each describe SFTP as its own protocol built on SSH; port 22 is SSH's normal port (RFC 4253, with Microsoft and Cloudflare). A server may listen on another port (Google's uses its own), which the claim leaves out. |
| `units[0].steps[1].deep[3] (step "plaintext-login", Go deeper)` | RFC 4253 is not obsoleted; its seven updates change algorithms, not the port. |
| `units[0].steps[2].deep[0] (step "passive-mode", Go deeper)` | RFC 959 defines the 227 reply and the h1..p2 format. A 16-bit port split into two 8-bit fields, high field first, gives p1 × 256 + p2; 195 × 256 + 80 = 50000 is correct. The address 203.0.113.21 is an RFC 5737 example address. |
| `units[0].steps[2].deep[1] (step "passive-mode", Go deeper)` | RFC 959 defines how the server opens the data connection; RFC 1579 and Cloudflare each state that this server-to-client connection runs into firewalls and NAT. "Usually block" is a loose word for "does not work well" and "in general cannot permit"; true in the ordinary case. |
| `units[0].steps[2].deep[1] (step "passive-mode", Go deeper)` | RFC 1579 is Informational and not obsoleted. |
| `units[0].steps[2].deep[2] (step "passive-mode", Go deeper)` | RFC 2428 is the defining standard for EPSV, the extended passive command made for IPv6. It is a Proposed Standard and not obsoleted. |
| `units[0].steps[3].deep[0] (step "data-connection", Go deeper)` | RFC 959 defines LIST and the stream-mode close; Cisco and RFC 1579 state one connection per transfer. The claim leaves out block and compressed modes, which can reuse a connection but are rare. |
| `units[0].steps[3].deep[1] (step "data-connection", Go deeper)` | RFC 959 defines TYPE and its codes; RFC 3659 (which updates it, and is not obsoleted) states that image type keeps the file byte for byte. The claim leaves out that TYPE is optional (ASCII is the default) and the rare padding case; true in the ordinary case. |
| `units[0].steps[3].deep[2] (step "data-connection", Go deeper)` | RFC 959 defines RETR (the first passage) and STOR (the second). "Downloads" and "uploads" are the everyday words, seen from the client. |
| `units[0].steps[4].deep[0] (step "file-transfer", Go deeper)` | RFC 959 defines stream mode and its end-of-file rule. |
| `units[0].steps[4].deep[1] (step "file-transfer", Go deeper)` | RFC 3659 is the defining standard for REST in stream mode. It is a Proposed Standard and not obsoleted. |
| `units[0].steps[4].deep[2] (step "file-transfer", Go deeper)` | RFC 959 defines CWD and PWD. The server holds the working directory for the session that the control connection carries, and the reply to PWD comes back on that line. "On the control connection" is a loose way to say "for this session"; it would not mislead. |
| `units[0].steps[5].deep[0] (step "session-close", Go deeper)` | Google, Microsoft and Cloudflare are independent publishers. Port 22 is the usual SSH port; Google's own server uses another, which the claim's ordinary case leaves out. |
| `units[0].steps[5].deep[1] (step "session-close", Go deeper)` | RFC 4217 defines explicit FTPS on port 21; the IANA registry assigns port 990 to the service "ftps", FTP control over TLS/SSL. Microsoft confirms both ports. |
| `units[0].steps[5].deep[2] (step "session-close", Go deeper)` | RFC 1350 is the defining standard for TFTP (UDP, port 69, no login). Its seven updates add options and do not add a login. The uses are confirmed by two vendors, Cisco and Microsoft. |
| `units[0].learn.lead[0] ("lead-1")` | RFC 959 defines the two connections. RFC 2577 and RFC 2228 each state that FTP sends everything unencrypted. "Plain text" means unencrypted and readable, which is what the sources say. Both RFCs are not obsoleted. |
| `units[0].learn.terms[0] ("term-control")` | RFC 959 defines the control connection. |
| `units[0].learn.terms[1] ("term-port")` | RFC 959 defines the control port; the live IANA registry lists "ftp" on port 21, tcp, with the description quoted and RFC 959 as its reference. |
| `units[0].learn.terms[2] ("term-login")` | RFC 959 defines USER and PASS. |
| `units[0].learn.terms[3] ("term-pasv")` | RFC 959 defines PASV. |
| `units[0].learn.terms[4] ("term-data")` | RFC 959 defines the data connection. The sentence crosses from page 29 to page 30. |
| `units[0].learn.terms[5] ("term-stor")` | RFC 959 defines RETR (the first passage, the download) and STOR (the second, the upload). |
| `units[0].learn.terms[6] ("term-plain")` | Two independent RFCs state it. "Anyone on the way" is a loose word for anyone who can watch the network path. |
| `units[0].learn.terms[7] ("term-sftp")` | Three vendors (Microsoft, Cloudflare, Google) agree. "Sealed" is the lesson's everyday word for encrypted. |
| `units[0].learn.pattern ("pattern")` | RFC 959 defines each step. The "every" is defined after the colon (commands on one line, the file on a second), which holds for every transfer, active or passive. The PASV step is the passive flow the lesson shows; the lesson also teaches active mode, and the note does not deny it. |
| `units[0].learn.why[0] ("why-1")` | RFC 959's history section is the defining record. "One of the oldest internet protocols" is a loose summary of a protocol first proposed in 1971 for the ARPANET. |
| `units[0].learn.why[1] ("why-2")` | The facts (two connections; cleartext passwords are a risk) are stated by RFC 959 and by two other RFCs. "Worth knowing" and "classic lesson" are the lesson's framing, not a claim of fact. |
| `units[0].learn.deep[0] ("deep-1", Learn's Go deeper)` | RFC 959 defines every code here. The note on the greeting is confirmed by two vendors: Cisco says the banner carries version information by default, and Microsoft says the default banner gives away the server type. "Often" fits: the banner can be changed or hidden. |
| `units[0].learn.deep[1] ("deep-2", Learn's Go deeper)` | RFC 959 defines the server's default data port as L-1 with L=21, which is port 20; IANA lists "ftp-data" on port 20; Microsoft confirms it. |
| `units[0].learn.deep[2] ("deep-3", Learn's Go deeper)` | Microsoft and Cisco, two vendors, agree. The claim leaves out the other fix, a fixed passive port range opened by hand; true in the ordinary case. |
| `units[0].learn.facts[0] ("fact-ports")` | RFC 959 and IANA define 21 and 20. "A high port" for passive is Microsoft's 1024 to 65535 range with RFC 1579's random port, in a beginner's words. |
| `units[0].learn.facts[1] ("fact-codes")` | RFC 959 defines all seven codes (221, 226, 230 and 331 are quoted under deep-1, on the same page 40). The 16-bit port in two 8-bit fields, high field first, is p1 × 256 + p2. |
| `units[0].learn.facts[2] ("fact-encrypted")` | Plain FTP; the extensions that add encryption (FTPS) are taught as the safer choice. |
| `units[0].learn.facts[3] ("fact-safer")` | RFC 4217 defines FTPS on port 21 with AUTH TLS; IANA assigns 990 to "ftps". SFTP on 22 is confirmed by Microsoft and Cloudflare, and its encryption by Google and Microsoft. |
| `units[0].learn.facts[4] ("fact-defined")` | RFC 959 is FTP's defining standard (Internet Standard, STD 9), not obsoleted; the memo's own status line names it the official specification. Its updates extend it without replacing it. |
| `units[0].learn.facts[5] ("fact-tcp")` | RFC 9293 is TCP's defining standard (Internet Standard, not obsoleted). The last passage is its meaning for the FIN bit; closing in full is in section 3.6, not cited, but the FIN meaning carries the claim. Both FTP connections run on TCP per RFC 959 and RFC 1579. |
| `units[0].learn.facts[6] ("fact-modes")` | RFC 959 defines both modes; RFC 1579, Microsoft and Cloudflare confirm which one gets through. "Usual" rests on Microsoft saying active is no longer the default or recommended; "home routers" is an everyday word for NAT and packet filters. True in the ordinary case. |
| `units[0].learn.facts[7] ("fact-each-file")` | RFC 959 defines the stream-mode close. Stream mode is the default; the rarer block and compressed modes are left out. |
| `units[0].learn.facts[8] ("fact-tftp")` | RFC 1350 is TFTP's defining standard (Internet Standard, not obsoleted); IANA lists "tftp" on port 69. |
| `units[0].learn.facts[9] ("fact-osi")` | Two vendors, Palo Alto Networks and Cloudflare, place FTP at layer 7. |
| `units[0].learn.facts[10] ("fact-name")` | RFC 959 is the defining standard and gives the name. |
| `units[0].practice[0].options[0] (question "second-connection")` | Wrong, as marked; the feedback matches RFC 959's roles for the two connections. |
| `units[0].practice[0].options[1] (question "second-connection")` | Right, as marked. |
| `units[0].practice[0].options[2] (question "second-connection")` | Wrong, as marked; plain FTP encrypts neither line. |
| `units[0].practice[1].options[0] (question "wifi-login")` | Right, as marked. |
| `units[0].practice[1].options[1] (question "wifi-login")` | Wrong, as marked. |
| `units[0].practice[1].options[2] (question "wifi-login")` | Wrong, as marked. RFC 959 only suggests the client hide the password on the user's own screen, which is not hiding it on the network. |

### Counts

- Sources: 28 now, one (RFC 959) before. Items on the claim sheet: 122 now.
- Corrections: 9. Removed: 1 (19 sizes). Added: 9 (6 new Learn facts, 3 widened Learn parts). Reworded, same meaning: 0.
- Word for word as before: every other sentence, including the two Practice questions and their other options, the six step titles, the scene, the party labels, the Overview hook and description, the table and its rows, and the four connection cues. The old `references` list (RFC 959) is replaced by RFC 959’s citations.

## What is SSH

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 32 sources (it listed two, RFC 4251 and RFC 4253, before) and passed its fact-check on 2026-11-12: 135 of 137 items on the first full check, then a targeted re-check of the 2 imprecise items (the OSI badge and one sentence in step 2’s Go deeper), both of which passed. The check ran under the owner’s rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-ssh.ts`), it has 19 corrections, 3 removals, 17 additions and 6 rewordings; the last sections list what the checker passed as a simplification.

Source names are the ones the lesson’s Sources list shows. Section numbers are the RFC’s own; a vendor page has none, so it is cited by its heading.

### The changes to look at first

1. **The Telnet sentence now reads “Before SSH, people used Telnet and rlogin, which were far less safe: Telnet sent everything as plain text.”** The old words said both sent everything, passwords included, as plain text. “Far less safe” rests on RFC 4251 and NISTIR 7966; “Telnet sent everything as plain text” on NIST SP 800-123 and Cloudflare. “Passwords included” went because the only page that says it is an archived Microsoft page for a retired product, which is not a current source, and no source says any of it of rlogin. (Correction 15.)
2. **The figure no longer adds a picture to the terminal when `ls` answers.** The old story drew the page’s picture square there; `ls` returned three words of text. The line of text at the prompt stays. (Removal 2.)
3. **The OSI badge is layer 7, now on Cloudflare’s and Baeldung’s pages.** It had been layer 7 with no source. No standard places SSH at an OSI layer; Cloudflare says most sources call it a layer 7 protocol and Baeldung puts it in the 7th layer. The separate Overview fact “OSI layer” is gone. (Rewording 4, Removal 1.)
4. **The example’s OpenSSH moved from 9.6 to 9.9, and one clause names the newer key exchange.** OpenSSH 9.9 is the release whose first choice is the plain name `sntrup761x25519-sha512` that the table shows; two 9.6 peers would have agreed on the name with `@openssh.com`. Step 2’s Go deeper now adds “a newer choice, mlkem768x25519-sha256, pairs X25519 with ML-KEM” and does not call it a default. (Rewordings 1 to 3, Addition 2.)
5. **One sentence was narrowed by the check: “and MAC, which AES-GCM builds in.”** It had said “which those ciphers build in”; no cited source says ChaCha20-Poly1305 carries its own check, so the sentence now says it of AES-GCM only. (Correction 6.)
6. **Step 4 now says the laptop first asks for the login service and the server accepts.** The standard has this step between NEWKEYS and the login; the story skipped it. No event was added. (Addition 1.)
7. **The log shows no message size.** A size reads as a fact about the protocol and no source states one, so 25 sizes are now a dash. (Removal 3.)
8. **Several absolutes with no source are gone:** “most servers”, “nearly every server”, “scanners”, “43 characters”, “36 to 100 bytes”, “for years”, “keys can’t be guessed”, “logging in as root”, “the moment you press it”. (Corrections 1, 3, 8, 9, 11, 12, 16, 18, 19.)
9. **Fifteen new Learn facts** state the TCP handshake, the version line, the choice of tools, the host key, the seal, the key login, the session, typing, the messages and the rest, so each Watch item has a Learn part to trace to. (Additions 3 to 17.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Overview hook (and the lesson summary, which repeats it) | It’s how most servers are run. | It’s a standard way to log in to servers from afar. | RFC 4251 §1; Microsoft, OpenSSH for Windows overview. No source counts servers. |
| 2 | Step 1 Go deeper | SSH-1 is long obsolete and insecure. | SSH-1, the older version, was never a written standard and is much weaker. | RFC 4253 §5; Cisco, Configure SSH Version 2; NISTIR 7966 §3.1. No two sources call it “long obsolete”. |
| 3 | Step 1 Go deeper | Scanners read this banner to see which software and version a server runs. | The line is sent before anything is sealed, so anyone watching can read which software a server runs. | RFC 4253 §4.2 and §6.3; Cisco, SSH Client Debug. No source names scanners. |
| 4 | Step 2 narrative | No choice is sent back: both work it out the same way. | Both sides work it out the same way. | RFC 4253 §7.1 gives the rule both sides apply and no message that announces the choice. |
| 5 | Step 2 fact “Sent by” | both sides at once | both sides | RFC 4253 §7.1 (each side sends its list as key exchange begins). No source says “at once”. |
| 6 | Step 2 Go deeper | Four kinds of algorithm are chosen: key exchange (here sntrup761x25519-sha512, which mixes X25519 with a post-quantum method), host key type (ssh-ed25519), cipher (chacha20-poly1305@openssh.com or aes256-gcm) and MAC, which those ciphers build in. | The main kinds chosen are key exchange (here sntrup761x25519-sha512, which mixes X25519 with a post-quantum method; a newer choice, mlkem768x25519-sha256, pairs X25519 with ML-KEM), host key type (ssh-ed25519), cipher (chacha20-poly1305@openssh.com or aes256-gcm) and MAC, which AES-GCM builds in. | RFC 4253 §7.1 (the lists also hold compression, so “four” was wrong); RFC 10042 §2.3.3 for the newer method; RFC 5647 §5.1 and Cisco’s client debug for the built-in MAC (AES-GCM only: no cited source says it of ChaCha20-Poly1305, which the first check found). |
| 7 | Step 3 Go deeper | If a server’s host key ever changes, ssh stops with a loud warning, because that’s exactly what an attacker in the middle would look like. | If a server’s host key ever changes, ssh warns you loudly, because that’s exactly what an attacker in the middle would look like. | RFC 4251 §9.3.4 asks for a warning; OpenSSH ssh(1), AUTHENTICATION. Refusing to connect is OpenSSH’s own default, one publisher. |
| 8 | Step 3 Go deeper | Fingerprints look like SHA256: followed by 43 characters. | Fingerprints look like SHA256: followed by a long string of characters. | Microsoft, Get started with OpenSSH; Cisco, SSH Client Debug. No source gives the length. |
| 9 | Step 4 Go deeper | Passwords also work, inside the seal, but keys can’t be guessed, and a passphrase can protect the private key. | Passwords also work, inside the seal, but keys are safer, and a passphrase can protect the private key. | Microsoft, Azure SSH keys in detail; RFC 4251 §9.4.5. “Can’t be guessed” is stronger than either. |
| 10 | Step 5 Go deeper | Channel types include session (a shell or one command), direct-tcpip (port forwarding, ssh -L) and forwarded-tcpip (ssh -R). | Channel types include session (a shell or one command), direct-tcpip (forwarding a port from your side) and forwarded-tcpip (forwarding a port from the server’s side). | RFC 4254 §6, §6.1, §7.2. The -L and -R flags are OpenSSH’s own, one publisher. |
| 11 | Step 6 narrative | Each key goes to the server the moment you press it, in its own small sealed packet, and the server sends the letter back so it appears on your screen. | Each key goes to the server as you type it, in its own small sealed packet, and the server sends the letter back so it appears on your screen. | RFC 4253 §5.3; OpenSSH ssh_config (ObscureKeystrokeTiming: newer OpenSSH sends keystrokes on a short beat). No source says “the moment”. |
| 12 | Step 6 Go deeper | Each keystroke packet is about 36 to 100 bytes on the wire. | Each keystroke packet is mostly wrapping: the smallest SSH packet is about 28 bytes. | RFC 4253 §5.3. No source gives the 36 to 100 range. |
| 13 | Step 6 Go deeper | Because the timing between keystrokes can leak a little information, newer OpenSSH sends extra fake keystroke packets to hide it. | Because the size and timing of packets can leak a little information, SSH software can send dummy packets to hide it. | RFC 4251 §9.3.9; OpenSSH ssh_config (ObscureKeystrokeTiming). |
| 14 | Step 6 Go deeper | Typing exit closes the channel, and the connection closes when no channels are left. | When the shell ends, the server reports how it ended and closes the channel. | RFC 4254 §6.10. No source names exit or says the connection closes with its last channel. |
| 15 | Learn why, first sentence | Before SSH, people used Telnet and rlogin, which sent everything, passwords included, as plain text. | Before SSH, people used Telnet and rlogin, which were far less safe: Telnet sent everything as plain text. | “Far less safe”: RFC 4251 §4.1 and NISTIR 7966 §3. “Telnet sent everything as plain text”: NIST SP 800-123 §6.5 and Cloudflare, What is SSH?. “Passwords included” went because the only sources that say it are an archived Microsoft page for a retired product (not current) and an inference from NIST, and no source says it of rlogin. |
| 16 | Learn why, third sentence | Nearly every server on the internet is run through it. | Administrators use it to manage remote machines, from servers to routers. | Microsoft, OpenSSH for Windows overview; NISTIR 7966 §3; Cisco, Configure SSH. No source counts servers. |
| 17 | Learn Go deeper | One connection can also forward ports (ssh -L, -R, and -D for a SOCKS proxy) and copy files (scp, sftp). | One connection can also forward ports, either way or as a SOCKS proxy (ssh -D), and copy files (scp, sftp). | RFC 4254 §7.2; Microsoft HDInsight tunnel and OpenSSH ssh(1) for -D. The -L and -R flags are OpenSSH’s own, one publisher. |
| 18 | Learn Go deeper | On servers you run, turn off password logins and logging in as root. | On servers you run, use keys and turn off password logins. | Microsoft, Azure SSH keys in detail; OpenSSH sshd_config; RFC 4251 §9.4.5. Turning off root logins has one publisher. |
| 19 | Practice, question 1, option 3 feedback | Not quite. A host key stays the same for years. A change is worth a warning. | Not quite. A host key stays the same from one visit to the next, and your laptop compares it each time. A change is worth a warning. | RFC 4251 §4.1; Microsoft, Azure SSH quick steps. No source gives a span of years. |

### Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Overview fact “OSI layer” | `OSI layer`: `7, application` | The badge carries the layer now, with its two sources (see Reworded 3), so the fact has no Learn part to trace to. |
| 2 | Step 6 figure, the OUTPUT message | `page: 'full'` | The cue added a picture to the terminal when `ls` answered. `ls` returned three words of text, and nothing in the story is a picture. The `text` cue on the prompt stays. |
| 3 | The log, every message’s Size | `size: '74 B'`, `size: '74 B'`, `size: '66 B'`, `size: '21 B'`, `size: '21 B'`, `size: '1.5 KB'`, `size: '1.1 KB'`, `size: '1.2 KB'`, `size: '1.4 KB'`, `size: '16 B'`, `size: '16 B'`, `size: '96 B'`, `size: '84 B'`, `size: '180 B'`, `size: '16 B'`, `size: '48 B'`, `size: '36 B'`, `size: '120 B'`, `size: '64 B'`, `size: '36 B'`, `size: '36 B'`, `size: '36 B'`, `size: '36 B'`, `size: '36 B'`, `size: '92 B'` | No source states the size of any message, and each reads as a fact about the protocol. All 25 are now a dash. |

### Added

New in the lesson, and not a change to a sentence the original had.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 4 Go deeper (new first sentence) | — | First the laptop asks for the login service, and the server accepts. | RFC 4253 §10. The story went from NEWKEYS to the login without it; no event was added. |
| 2 | Step 2 Go deeper (a clause inside the corrected sentence) | — | a newer choice, mlkem768x25519-sha256, pairs X25519 with ML-KEM | RFC 10042 §2.3.3. The lesson does not call it a default. |
| 3 | Learn fact “TCP connection” | — | opened by a handshake of three messages (SYN, SYN-ACK, ACK) | RFC 9293 §3.5. New, so each Watch item has a Learn part to trace to. |
| 4 | Learn fact “SSH rides on” | — | TCP; the server listens on port 22 | RFC 4253 §4.1; RFC 4251 §1. New, so each Watch item has a Learn part to trace to. |
| 5 | Learn fact “Choosing tools” | — | each side sends its list of what it can use, best first, as key exchange begins; both then take the first item on the client’s list that the server also has | RFC 4253 §7.1, §4.2. New, so each Watch item has a Learn part to trace to. |
| 6 | Learn fact “In this example” | — | key exchange sntrup761x25519-sha512 (X25519 with a post-quantum method), host key and login key ssh-ed25519, cipher chacha20-poly1305 | RFC 9941 §1; RFC 8709 §1; RFC 4252 §7; IANA SSH parameters; Cisco show ip ssh. New, so each Watch item has a Learn part to trace to. |
| 7 | Learn fact “Host key” | — | the server sends it in its key exchange reply and signs the exchange with it; your laptop checks it against its list of known servers (~/.ssh/known_hosts), and the first time asks you to check the key’s fingerprint | RFC 4253 §8; RFC 4251 §4.1; Microsoft and Cisco. New, so each Watch item has a Learn part to trace to. |
| 8 | Learn fact “Seal starts” | — | when both sides have sent NEWKEYS, at the end of the key exchange; from then on every message is encrypted and checked with the new keys | RFC 4253 §7.3, §6.3, §6.4, §4.2. New, so each Watch item has a Learn part to trace to. |
| 9 | Learn fact “Key login” | — | the laptop asks whether its public key is allowed, then sends a signature made with its private key over the session ID, and the server checks it; the server finds the allowed keys in ~/.ssh/authorized_keys, and the private key itself never crosses | RFC 4252 §7; RFC 4253 §7.2; Microsoft and OpenSSH manuals. New, so each Watch item has a Learn part to trace to. |
| 10 | Learn fact “Session” | — | opened as a channel, which each side knows by a number, here 0 (one connection carries many channels at once); pty-req asks for a terminal (such as 80 by 24), then shell starts one; output comes back as CHANNEL_DATA | RFC 4254 §5, §6.1, §6.2, §6.5, §6.6. New, so each Watch item has a Learn part to trace to. |
| 11 | Learn fact “Typing” | — | each key goes as you type, as one byte in its own small sealed packet, and the server’s terminal echoes it back; a watcher can see only the size and timing of the packets | RFC 4253 §5.3, §6.3; RFC 4254 §6.2, §8; RFC 4251 §9.3.9; OpenSSH ssh_config. New, so each Watch item has a Learn part to trace to. |
| 12 | Learn fact “Messages” | — | KEXINIT; KEX_ECDH_INIT and KEX_ECDH_REPLY, which carry each side’s temporary public key; NEWKEYS; USERAUTH_REQUEST, USERAUTH_PK_OK and USERAUTH_SUCCESS; CHANNEL_OPEN, CHANNEL_OPEN_CONFIRMATION, CHANNEL_REQUEST and CHANNEL_DATA | RFC 4253 §7.1, §7.3; RFC 9941 §3; RFC 4252 §5.3, §7; RFC 4254 §5.1, §6.2, §6.6. New, so each Watch item has a Learn part to trace to. |
| 13 | Learn fact “Stands for” | — | Secure Shell | RFC 4251 §1. New, so each Watch item has a Learn part to trace to. |
| 14 | Learn fact “Purpose” | — | secure remote login: typing commands on another computer over a line that others on the way can’t read or change | RFC 4251 §1; RFC 4254 §1; NISTIR 7966 §3. New, so each Watch item has a Learn part to trace to. |
| 15 | Learn fact “Shared secret” | — | each side combines the other’s public key with its own private one and gets the same secret, which never crosses the network | RFC 4253 §8; RFC 9941 §3; RFC 7748 §6.1. New, so each Watch item has a Learn part to trace to. |
| 16 | Learn fact “The ssh command” | — | ssh user@host connects and logs you in on the named computer | Microsoft, Cisco and OpenSSH ssh(1). New, so each Watch item has a Learn part to trace to. |
| 17 | Learn fact “Version line” | — | one line of text that each side sends once the TCP connection is open: SSH-2.0, then the name and version of its software (here OpenSSH_9.9) | RFC 4253 §4.2; Cisco client debug; OpenSSH ssh_config. New, so each Watch item has a Learn part to trace to. |

### Reworded, same meaning

The words changed and the meaning did not, or the change only makes the part state what the step already said.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 1 Go deeper | The line is SSH-protoversion-softwareversion, here SSH-2.0-OpenSSH_9.6 on both sides. | The line is SSH-protoversion-softwareversion, here SSH-2.0-OpenSSH_9.9 on both sides. | Example data. OpenSSH 9.9 is the release whose first key-exchange choice is the plain name the lesson shows (sntrup761x25519-sha512); RFC 9941 §3 says earlier releases used the name with @openssh.com. |
| 2 | Step 1 fact “Both say” | SSH-2.0-OpenSSH_9.6 | SSH-2.0-OpenSSH_9.9 | As above. |
| 3 | Step 1 messages (laptop), info | SSH-2.0-OpenSSH_9.6 | SSH-2.0-OpenSSH_9.9 | As above. The server’s reply changes the same way. |
| 4 | OSI badge | osiLayers: [7], | osi: { layers: [7], cite: [CF_OSI, BAELDUNG_OSI] }, | Layer 7 was uncited. It now rests on Cloudflare (“most sources describe it as a layer 7/application layer protocol”) and Baeldung (“an application layer protocol that is in the 7th layer”). No standard places SSH at an OSI layer. |
| 5 | Learn term “Version exchange”, idea | Both sides say which version they speak | Both sides say which version and which software they run | RFC 4253 §4.2. Widened so the term states what the step’s “then the software’s name” shows. |
| 6 | Learn term “Key exchange”, idea | The same secret, made on both sides | The same secret, made on both sides, never sent | RFC 4253 §8; RFC 9941 §3; RFC 7748 §6.1. Widened so the term states what the step says. |

### What the checker passed as a simplification

Every `Note:` line of the passing reports on an item that passed, with the item. The two items the first check marked imprecise (the OSI badge and step 2’s Go deeper) are given by the re-check’s notes.

1. `units[0].steps[0].deep[0] (step "version-exchange", Go deeper)`: RFC 4253 §4.2 is the defining standard for the identification string's format. The claim leaves out the optional comments field and the closing CR LF.
2. `units[0].steps[0].deep[0] (step "version-exchange", Go deeper)`: RFC 4253 is not obsoleted (updated by RFCs 6668, 8268, 8308, 8332, 8709, 8758 and 9142, none of which changes the identification string). OpenSSH_9.9 is the lesson's example value.
3. `units[0].steps[0].deep[1] (step "version-exchange", Go deeper)`: RFC 4253, the defining standard for SSH protocol versions, states the 1.x versions were never formally documented. Cisco and NIST independently confirm that SSH-1 is much weaker.
4. `units[0].steps[0].deep[1] (step "version-exchange", Go deeper)`: All three sources are current (RFC not obsoleted; Cisco page updated July 2026; NISTIR 7966 final, not withdrawn).
5. `units[0].steps[0].deep[2] (step "version-exchange", Go deeper)`: RFC 4253 defines the order: the identification line comes before key exchange, and encryption is agreed only during key exchange, so the line goes unencrypted. The Cisco debug output shows a client reading the server's software name from it.
6. `units[0].steps[2].deep[0] (step "key-exchange-and-host-key-check", Go deeper)`: RFC 9941 defines sntrup761x25519-sha512; RFC 4253 §8 defines SSH's Diffie-Hellman exchange. "Works like Diffie-Hellman" is true for the X25519 half; the post-quantum half is a key encapsulation rather than Diffie-Hellman, which the claim's "post-quantum method" leaves unexplained.
7. `units[0].steps[2].deep[1] (step "key-exchange-and-host-key-check", Go deeper)`: Two independent sources (the IETF architecture RFC and OpenSSH's manual). The claim does not say a change always means an attack, only that it is what an attack would look like; RFC 4251 §9.3.4 sets the warning in exactly that man-in-the-middle case.
8. `units[0].steps[2].deep[2] (step "key-exchange-and-host-key-check", Go deeper)`: Two independent vendors show the SHA256: form. Older clients showed MD5 fingerprints, which the claim leaves out.
9. `units[0].steps[2].deep[3] (step "key-exchange-and-host-key-check", Go deeper)`: RFC 4253 is the defining standard for the exchange hash and session identifier. The host key signs H during key exchange (§8), and the login signature covers it again.
10. `units[0].steps[3].deep[0] (step "public-key-authentication", Go deeper)`: RFC 4253 §10 defines the service request; the login service is named ssh-userauth there.
11. `units[0].steps[3].deep[1] (step "public-key-authentication", Go deeper)`: RFC 4252 defines the check; the file name is OpenSSH's default, confirmed by OpenSSH's manuals and Microsoft independently. The claim leaves out authorized_keys2 and the Windows administrators' file.
12. `units[0].steps[3].deep[2] (step "public-key-authentication", Go deeper)`: RFC 4252 §7 defines the signed data, whose first field is the session identifier; RFC 4253 and RFC 4252 state the identifier is unique to the connection, so the signature does not fit another session.
13. `units[0].steps[3].deep[3] (step "public-key-authentication", Go deeper)`: Each part is confirmed: passwords inside the encryption (RFC 4252, defining), keys safer (RFC 4251 and Microsoft), passphrases protecting the private key (RFC 4252 and RFC 4251).
14. `units[0].steps[3].deep[4] (step "public-key-authentication", Go deeper)`: RFC 9987 (Standards Track, May 2026, not obsoleted) defines the SSH agent protocol.
15. `units[0].steps[4].deep[0] (step "channel-open", Go deeper)`: RFC 4254 defines the channel types session, forwarded-tcpip (remote forwarding, from the server's side) and direct-tcpip (local forwarding, from the client's side). The list leaves out x11 and leaves "session" at a shell or one command, leaving out subsystems.
16. `units[0].steps[4].deep[1] (step "channel-open", Go deeper)`: RFC 4254 defines the pty-req, env, shell, exec and subsystem requests; OpenSSH and Microsoft confirm SFTP as the usual subsystem.
17. `units[0].steps[4].deep[2] (step "channel-open", Go deeper)`: RFC 4254 is the defining standard for channels and their windows.
18. `units[0].steps[5].deep[0] (step "interactive-session", Go deeper)`: RFC 4253 defines the binary packet; "about 28 bytes" follows its own wording. With today's ciphers a one-byte keystroke packet is somewhat larger, which only strengthens "mostly wrapping".
19. `units[0].steps[5].deep[1] (step "interactive-session", Go deeper)`: Two independent sources (IETF and OpenSSH). OpenSSH does this by default today.
20. `units[0].steps[5].deep[2] (step "interactive-session", Go deeper)`: RFC 4254 defines exit-status. Reporting it is recommended rather than required, which the claim leaves out.
21. `units[0].learn.lead[0] ("lead-1")`: The three defining RFCs state each stage. "Every keystroke" is the lesson's interactive session carried as channel data.
22. `units[0].learn.terms[0] ("term-version")`: RFC 4253 defines the identification string.
23. `units[0].learn.terms[1] ("term-kexinit")`: RFC 4253 defines SSH_MSG_KEXINIT.
24. `units[0].learn.terms[2] ("term-kex")`: RFC 4253 and RFC 9941 define the exchanges; RFC 7748 (IRTF, Informational, not obsoleted) confirms both sides compute the same X25519 secret. The final secret K is never sent; the post-quantum half of the hybrid sends its share only in encapsulated form, which the term simplifies.
25. `units[0].learn.terms[3] ("term-hostkey")`: RFC 4251 defines host keys. "Permanent" is loose: host keys are long-lived and can be replaced, which the term leaves out.
26. `units[0].learn.terms[4] ("term-knownhosts")`: RFC 4251 defines the local database; Microsoft and Cisco independently confirm its file name. "Servers you've checked" is loose: the file holds every server you accepted, whether or not you compared the fingerprint.
27. `units[0].learn.terms[5] ("term-keypair")`: RFC 4252 defines publickey authentication; two Microsoft pages confirm where each half lives.
28. `units[0].learn.terms[6] ("term-channel")`: RFC 4254 defines channels.
29. `units[0].learn.terms[7] ("term-shell")`: RFC 4254 defines the shell request; Microsoft calls it the command shell. "Reads your commands" is the everyday meaning of a command shell.
30. `units[0].learn.pattern ("pattern")`: The defining RFCs fix this order. "From the key exchange onward" is loose: encryption starts as key exchange ends, with NEWKEYS.
31. `units[0].learn.why[0] ("why-1")`: IETF, NIST and Cloudflare confirm it independently. The claim leaves out rsh and rcp.
32. `units[0].learn.why[1] ("why-2")`: The defining RFCs state each part. A key may still have a passphrase, which is not a login password.
33. `units[0].learn.why[2] ("why-3")`: Microsoft, NIST and Cisco confirm it independently.
34. `units[0].learn.deep[0] ("deep-1", Learn's Go deeper)`: RFC 4251 defines the three-part architecture; RFCs 4253, 4252, 4256 and 4254 define each part named. The authentication list leaves out hostbased.
35. `units[0].learn.deep[1] ("deep-2", Learn's Go deeper)`: Forwarding both ways is defined in RFC 4254; SOCKS through ssh -D is in OpenSSH's manual and Microsoft's tunnel page; file copying is confirmed by Microsoft, OpenSSH and NIST.
36. `units[0].learn.deep[2] ("deep-3", Learn's Go deeper)`: The advice is confirmed by Microsoft and the IETF; OpenSSH shows password logins are on unless turned off.
37. `units[0].learn.facts[0] ("fact-port")`: IANA's live registry is the defining record of the assignment.
38. `units[0].learn.facts[1] ("fact-replaced")`: IANA defines Telnet's port 23; RFC 4251 and NIST confirm SSH replaced Telnet and rlogin.
39. `units[0].learn.facts[2] ("fact-logins")`: RFC 4252 defines both methods. The fact leaves out keyboard-interactive and hostbased.
40. `units[0].learn.facts[3] ("fact-also")`: RFC 4254 defines port forwarding; SFTP and scp are confirmed by Microsoft, OpenSSH and NIST.
41. `units[0].learn.facts[4] ("fact-defined")`: RFCs 4251 to 4254 are the documents that define SSH-2, none obsoleted. Later RFCs update them (8308, 8332, 8709, 9142 and others), which the fact leaves out.
42. `units[0].learn.facts[5] ("fact-tcp")`: RFC 9293 (Internet Standard, STD 7, not obsoleted) defines TCP's handshake.
43. `units[0].learn.facts[6] ("fact-rides")`: RFC 4253 and RFC 4251 define it. Other carriers are possible, which the fact leaves out.
44. `units[0].learn.facts[7] ("fact-choice")`: RFC 4253 defines the rule. Key-exchange and host-key choices carry extra conditions and a matching-guess shortcut, which the fact leaves out.
45. `units[0].learn.facts[8] ("fact-algorithms")`: RFC 9941 and RFC 8709 define the key exchange and key type; IANA's live registry lists all three names. Current OpenSSH puts mlkem768x25519-sha256 first; the lesson labels its values as one example and names that newer choice in its Go deeper.
46. `units[0].learn.facts[9] ("fact-hostkey")`: RFC 4253 §8 defines the reply carrying and signing with the host key; Microsoft and Cisco independently show the known_hosts check and the first-time fingerprint prompt.
47. `units[0].learn.facts[10] ("fact-newkeys")`: RFC 4253 defines it. Strictly each direction switches after its own NEWKEYS; "when both sides have sent" is the ordinary outcome.
48. `units[0].learn.facts[11] ("fact-keylogin")`: RFC 4252 defines the query then signature; the file and the private key staying home are confirmed by OpenSSH and Microsoft. A client may skip the query, which the fact leaves out.
49. `units[0].learn.facts[12] ("fact-session")`: RFC 4254 defines all of it; its pty-req example sizes are 80 characters and 24 rows. Channel 0 is the example's number.
50. `units[0].learn.facts[13] ("fact-typing")`: The defining RFCs state one-byte packets, terminal echo and full encryption; RFC 4251 and OpenSSH confirm what a watcher can still learn. Current OpenSSH sends keystrokes on a short fixed tick and adds fake packets by default, which the fact leaves out; a watcher also still sees the addresses and ports.
51. `units[0].learn.facts[14] ("fact-messages")`: Every name is defined in RFCs 4253, 4252, 4254 or 9941 (USERAUTH_REQUEST and USERAUTH_PK_OK in RFC 4252 §7). The list leaves out the service request and other messages.
52. `units[0].learn.facts[15] ("fact-name")`: RFC 4251 defines the name.
53. `units[0].learn.facts[16] ("fact-purpose")`: "Can't read or change" puts confidentiality and integrity (RFC 4251 §1) in everyday words; integrity detects changes rather than preventing them.
54. `units[0].learn.facts[17] ("fact-secret")`: True for the X25519 exchange, defined in RFC 4253 and RFC 9941 and shown in RFC 7748. The post-quantum half of the example's hybrid is an encapsulation, where the server's share travels encrypted; the final secret is never sent. The fact simplifies that half.
55. `units[0].learn.facts[18] ("fact-command")`: OpenSSH, Microsoft and Cisco confirm it independently.
56. `units[0].learn.facts[19] ("fact-version")`: RFC 4253 defines the line. A server may send other text lines before it, which the fact leaves out. OpenSSH_9.9 is the example's value.
57. `units[0].practice[0].options[0] (question "host-key-changed")`: Right answer, and the feedback is correct; "might" in the prompt allows for a legitimate key change.
58. `units[0].practice[0].options[1] (question "host-key-changed")`: Wrong answer, and the feedback is correct: the host key identifies the server; an expired password is signalled differently.
59. `units[0].practice[0].options[2] (question "host-key-changed")`: Wrong answer, and the feedback is correct.
60. `units[0].practice[1].options[0] (question "what-crosses")`: Wrong answer, and the feedback is correct.
61. `units[0].practice[1].options[1] (question "what-crosses")`: Right answer, and the feedback is correct.
62. `units[0].practice[1].options[2] (question "what-crosses")`: Wrong answer, and the feedback is correct for the ordinary key login. A server may demand a password as well, which the feedback leaves out.
63. `units[0].osi`: Two independent sources (a vendor explainer by Cloudflare and a community tutorial by a different author on Baeldung) each put SSH at layer 7. Cloudflare adds that the layer is not strictly defined; a single layer-7 badge is the ordinary description and nothing cited contradicts it. The project's settled rule allows a badge to rest on such pages when no standard places the protocol.
64. `units[0].osi`: Both pages were live on 2026-11-12 (Baeldung's page shows an update in April 2026) and describe current practice. Both were read in the browser after the command line got a bot check.
65. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: RFC 4253 §7.1 defines the KEXINIT message and its name-lists: key exchange, host key, encryption, MAC and compression, which are the kinds the paragraph names (it leaves out the optional language lists, an allowed simplification).
66. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: RFC 9941 defines the key exchange method sntrup761x25519-sha512, a hybrid of a post-quantum method and X25519.
67. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: RFC 10042 defines the method mlkem768x25519-sha256, pairing X25519 (Curve25519) with ML-KEM-768. It is the higher-numbered, later RFC, and OpenSSH's current default list puts it first, so "a newer choice" holds.
68. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: RFC 8709 defines the public key algorithm (host key type) ssh-ed25519.
69. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: RFC 5647 defines AES-GCM for the SSH transport, AEAD_AES_256_GCM in §6.2. The name "aes256-gcm" appears as such in Cisco's cipher list; OpenSSH spells it aes256-gcm@openssh.com and the IANA registry AEAD_AES_256_GCM. For a beginner the shorter name names the same cipher and is one a real device offers.
70. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: RFC 5647 §5.1 defines how AES-GCM takes the MAC's place in SSH. The paragraph says only that AES-GCM builds the MAC in; that chacha20-poly1305@openssh.com does so too is left out, which does not make the sentence false.
71. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: "Compression is usually none" is backed by OpenSSH's default (off), Cisco's debug output and RFC 4253, where "none" is the required method.
72. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: The paragraph sits after the step's narrative on KEXINIT and preference lists; it names what those lists choose, so the step is still true and in order.
73. `units[0].steps[1].deep[0] (step "algorithm-negotiation", Go deeper)`: Currency. RFC 4253 is not obsoleted; its updates (among them RFC 8709 and others on key exchange and RSA/SHA-2) add or retire algorithms and do not change the negotiated kinds. RFC 5647, RFC 8709, RFC 9941 and RFC 10042 are not obsoleted. OpenSSH's manual and Cisco's page are live and describe current products.

### Counts

19 corrections, 3 removals (the 25 sizes are one row), 17 additions and 6 rewordings, counted from the numbered rows of the tables above. The sources are the lesson page’s list (32, with the page added for the badge after the first check) against the two references of the original. The lesson passed all 137 items; 73 notes are listed above.

## What is TLS

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 34 sources (it listed one, RFC 8446, before; that RFC is obsolete, and RFC 9846 replaces it) and passed its fact-check on 2026-11-12: 119 of 120 items on the first full check, with one imprecise (a step narrative that read as if the ServerHello itself were encrypted), and that one item on the re-check. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-tls.ts`), it has 19 corrections, 2 removals, 22 additions and 1 rewording; the last sections list what the checker passed as a simplification and the counts. Its Go-deeper blocks are now split into paragraphs, and the Learn "why" into one sentence per statement; the words are the same except where a table below says so.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; a vendor page has none, so it is cited by its heading, and a NIST document by the page of its PDF.

### The changes to look at first

1. **The figure no longer draws the page when the reply arrives.** In step 5, when the 18 KB reply comes back, the laptop's screen used to draw the page's words and a picture. This story fetches only one page, `GET /`, and never a stylesheet or a picture, and a browser draws a page's words only after a stylesheet it links to has loaded; so nothing is drawn. The status "Page received, sealed" stays. This is the one mark on the figure that changed. (Correction 17.)
2. **The key exchange is now "X25519 with ML-KEM", to agree with What is HTTPS.** Both lessons show the same browser and the same server. Browsers now put the post-quantum hybrid X25519MLKEM768 first by default, so "usually X25519 first" was no longer the ordinary case. The step 1 and step 2 Go deeper paragraphs, the Key share and Key exchange facts, both log lines and the table's "Key exchange" row change. (Corrections 1 to 7.)
3. **TLS 1.3 is now cited as RFC 9846, and "Defined in" says so.** RFC 9846 (July 2026) obsoletes RFC 8446. Nothing the lesson teaches changed in substance; the section numbers did. (Correction 15.)
4. **"From this message on, everything the server sends is already encrypted" became "After this message, everything the server sends is encrypted."** The check corrected it: read plainly, the old sentence included the ServerHello itself, which is sent unencrypted; RFC 9846 §1.3 says only the messages after it are encrypted. (Correction 8.)
5. **The OSI badge now spans.** No allowed source places TLS at an OSI layer: Microsoft, NIST and RFC 9846 place it between TCP and the application, which the Overview fact "Sits: between TCP and the app" already says. (Correction 16.)
6. **No message size is shown, except the example's own request and page.** Eight sizes (a 517 B ClientHello, a 74 B Finished) are now a dash: no source states one, and a browser's hybrid key share alone is 1,216 bytes. The 437 B request and the 18 KB page stay as example data. (Removal 1.)
7. **"Every TLS connection starts this way" now says "Every full handshake".** A resumed connection, which this lesson teaches, skips the certificate; tickets and key updates also come after Finished. (Correction 12.)
8. **The Certificate Transparency clause no longer says the browser checks the logs.** No allowed source says that; the sentence now says certificates are recorded in public logs where anyone can spot one issued by mistake. (Correction 9.)
9. **"Most apps" is now "many apps"** (twice): no source counts a majority. (Corrections 10 and 13.)
10. **Twenty-two new Learn facts** state the handshake, what TLS runs on, the HTTP inside, the name in plain view, forward secrecy, the keys, the certificate checks, the records, 0-RTT, close_notify, the full name and the purpose, so every Watch step has a Learn part to trace to. (Additions 1 to 22.)

### Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.


| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 1 Go deeper, third sentence | The supported groups list the key-exchange methods, usually X25519 first; newer browsers add a post-quantum hybrid (X25519MLKEM768). | The supported groups list the key-exchange methods. Browsers now put a post-quantum hybrid first: X25519 with ML-KEM, named X25519MLKEM768. | RFC 9846 §4.3.7 (the supported groups list); RFC 10024 Abstract and §2 (X25519MLKEM768 combines ML-KEM with X25519); Cloudflare PQC support, Browsers (the hybrid is the default in Chrome 131+, Edge, Firefox, Safari). |
| 2 | Step 1 fact Key share | the X25519 public half | the public half, for X25519 with ML-KEM | The same sources as correction 1, through the Learn fact "Key exchange". |
| 3 | Step 1 message CLIENT HELLO, info | ClientHello: TLS 1.3, 3 cipher suites, SNI techconcepts.app, key share X25519 | ClientHello: TLS 1.3, 3 cipher suites, SNI techconcepts.app, key share X25519 with ML-KEM | As correction 1. "3 cipher suites" is this example's own count and stays. |
| 4 | Step 2 Go deeper, first sentence | This is elliptic-curve Diffie-Hellman, X25519 here. | This is elliptic-curve Diffie-Hellman, X25519, paired here with ML-KEM, a post-quantum method. | RFC 9846 §7.4.2 (the X25519 calculation); RFC 10024 Abstract and §2; Cloudflare PQC support, Browsers. |
| 5 | Step 2 fact Key exchange | X25519 | X25519 with ML-KEM | As correction 1. |
| 6 | Step 2 message SERVER HELLO, info | ServerHello: TLS 1.3, TLS_AES_128_GCM_SHA256, key share X25519 | ServerHello: TLS 1.3, TLS_AES_128_GCM_SHA256, key share X25519 with ML-KEM | As correction 1. |
| 7 | Step 2 message SERVER HELLO, table row | ['Key exchange', 'X25519'] | ['Key exchange', 'X25519 with ML-KEM'] | As correction 1. A test held the old cell; it changes with the lesson. |
| 8 | Step 2 narrative, last sentence | From this message on, everything the server sends is already encrypted. | After this message, everything the server sends is encrypted. | RFC 9846 §1.3 (all handshake messages after the ServerHello are encrypted). The ServerHello itself is not. The first check marked the old sentence imprecise. |
| 9 | Step 3 Go deeper, third sentence | The browser also checks the certificate hasn’t been revoked and appears in public Certificate Transparency logs. | The browser also checks the certificate hasn’t been revoked, and certificates are recorded in public Certificate Transparency logs, where anyone can spot one issued by mistake. | RFC 5280 §6.1.3 and NIST SP 800-52r2 §4.2.2 (revocation is checked); RFC 9162 Abstract and NIST SP 800-52r2 §3.4.2.15 (certificates are logged publicly so anyone can audit them). No allowed source says the browser checks the logs. |
| 10 | Overview fact Used by | HTTPS, secure email, most apps | HTTPS, secure email, many apps | RFC 9325 §1, RFC 9112 §9.7, RFC 8314 §1. No allowed source gives a share of apps. |
| 11 | Step 5 Go deeper, first sentence | Each message is sealed in a TLS record of up to 16 KB with AEAD (here AES-128-GCM), which encrypts and authenticates in one go. | Each message is sealed in one or more TLS records of up to 16 KB, with AEAD (here AES-128-GCM), which encrypts and authenticates in one go. | RFC 9846 §5.1 (data is split into records of 2^14 bytes or less, and a message may span several). The story's own 18 KB reply needs two records. |
| 12 | Learn pattern note | Every TLS connection starts this way. After Finished, it’s application data until close_notify. | Every full handshake starts this way; a resumed one skips the certificate. After Finished, the app’s data goes sealed until close_notify. | RFC 9846 §2.2 (a resumed connection sends no Certificate), §4.7 (other messages follow the main handshake), §4.5.3 and §6.1. |
| 13 | Learn why, second sentence | HTTPS, secure email, VPNs and most apps borrow it instead of inventing their own. | HTTPS, secure email, VPNs and many other apps borrow it instead of inventing their own. | RFC 9325 §1, NIST SP 800-77r1 §8.2, NIST SP 800-52r2 §1, Microsoft MS-SSTP Overview. As correction 10. |
| 14 | Practice, certificate question, option "That the line is encrypted." feedback | Not quite. The key exchange does the encrypting. The certificate proves identity. | Not quite. The keys from the key exchange do the encrypting. The certificate proves identity. | RFC 9846 §1 (the record protocol uses the parameters the handshake sets up to protect traffic). The old cause was wrong: the key exchange makes the keys, and the record protocol encrypts with them. |
| 15 | Learn fact Defined in | RFC 8446 | RFC 9846 | RFC 9846 Abstract: it obsoletes RFC 8446, which specified TLS 1.3. |
| 16 | The OSI badge | osiLayers: [6] | osi: 'spans' | No allowed source places TLS at an OSI layer. RFC 9846 never uses the OSI model; Microsoft's TLS protocol page and NIST SP 800-52r2 §1 place it between TCP and the application. |
| 17 | Step 5 message ENCRYPTED (the 18 KB reply), page cue | page: 'full' | (no page cue; the status "Page received, sealed" stays) | HTML Standard §4.6.8.23 and §3.1.6 (drawing waits for a linked stylesheet) and What is HTTPS's Learn fact "Other files" (each other file is fetched with its own GET). This story fetches no stylesheet and no picture. |
| 18 | Overview fact SSL | the old name; every SSL version is retired | the old name; SSL 2.0 and 3.0 are retired | RFC 9846 Appendix E.5 and RFC 8996 Abstract. The Learn fact "Retired" lists SSL 2.0 and 3.0 (and TLS 1.0 and 1.1); "every SSL version" said more than the sources list. |
| 19 | Step 5 narrative, second sentence | Here the browser’s HTTP request goes out as **application data**: encrypted with the shared key, plus a tag that proves it wasn’t changed. | Here the browser’s HTTP request goes out as **application data**: encrypted with keys made from the shared secret, and checked so that any change shows. | RFC 9846 §7.3 (the traffic keys are derived from the secret) and §5.2 (AEAD protection; a record that fails to decrypt ends the connection). "A tag" named a part no Learn part states, and the encryption does not use the shared secret itself. |

### Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | The log's Size column, 8 of its 10 messages | size: '517 B'; size: '122 B'; size: '2.9 KB'; size: '264 B'; size: '74 B'; size: '24 B'; now shown as a dash (size: '—') | No source states a size, and a size in a log reads as a fact about the protocol. A browser's hybrid key share alone is 1,216 bytes (RFC 10024 §4.1), so 517 B was wrong, and 264 B is not an ECDSA signature message either. The two figures of the example itself stay as example data: the 437 B request and the 18 KB page. The 74 B (twice) and 24 B (twice) are in two messages each. |
| 2 | The lesson's own reference list | label: 'RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3' | The cited shape builds each lesson's source list from its citations, and RFC 8446 is obsolete (RFC 9846 replaces it). The Sources list now has 34 documents. |

### Added

New statements, terms and facts, with why each was needed. The new Learn facts are the parts the Watch steps and the Overview trace to; the old Learn did not state these ideas. Each cites the section named.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact "TLS 1.3 handshake" | runs on the TCP connection: the ClientHello offers locks (cipher suites) and a key share; the server answers with ServerHello, its certificate, CertificateVerify and Finished; the client’s Finished ends it; it costs one round trip, and everything after the key exchange is encrypted | The handshake as the steps tell it, in What is HTTPS's own words. RFC 9846 Abstract, §2, §4.2.1, §2.3; RFC 9112 §9.7; RFC 9001 §1. |
| 2 | Learn fact "Runs on" | a TCP connection already opened by TCP’s three-way handshake; TLS sits between TCP and the app, and when it is done, TCP closes the connection (FIN) | The TCP rows, "between TCP and the app" and the closing TCP FIN had no Learn part. RFC 9846 §1; NIST SP 800-52r2 §1; Microsoft TLS protocol; RFC 9293 §3.5, §3.1, §3.6. |
| 3 | Learn fact "Here, inside the seal" | HTTPS: the browser’s HTTP, such as GET / and a 200 OK reply, sent as TLS application data on TCP port 443 | The request, the reply and port 443 in the log. RFC 9112 §9.7, §3; RFC 9110 §4.2.2, §15.3.1; the IANA port registry. |
| 4 | Learn fact "Used by" | HTTPS, secure email, VPNs and many other apps | The Overview fact and the hook. RFC 9325 §1, RFC 9112 §9.7, RFC 8314 §1, NIST SP 800-77r1 §8.2, Microsoft MS-SSTP Overview. |
| 5 | Learn fact "Name (SNI)" | the ClientHello names the site in plain text, so one server can hold certificates for many sites | The site's name in step 1 and the log. RFC 9849 §1, RFC 6066 §3, RFC 9846 §4.5.1.2. |
| 6 | Learn fact "Key exchange" | usually X25519, which browsers now pair with ML-KEM, a post-quantum method (together named X25519MLKEM768) | The key shares and the corrected key exchange. RFC 10024 Abstract and §2; Cloudflare PQC support. |
| 7 | Learn fact "Forward secrecy" | fresh key shares for every connection, so a private key stolen later can’t unlock recorded traffic | Step 2's fact. RFC 9846 §4.3.8 and Appendix F.1. |
| 8 | Learn fact "Keys" | derived from the shared secret with HKDF, separate for each direction | Step 2's Go deeper and the corrected step 5 sentence. RFC 9846 §7.3 and Appendix F.1.1; RFC 5869 Abstract. |
| 9 | Learn fact "Certificate checks" | the name matches, the dates are valid, the signatures lead back to a CA the browser trusts, and it hasn’t been revoked | Step 3's checks and the log rows that carry the ticks. RFC 9525 §6.3; RFC 5280 §6.1, §6.1.3; RFC 9846 Appendix C.2; NIST SP 800-52r2 §4.2.2. |
| 10 | Learn fact "Chain" | the site’s certificate is signed by an intermediate, which is signed by a root certificate the browser or system already trusts | "An intermediate CA, under a trusted root". What is HTTPS's words. RFC 5280 §3.2, §6.1; RFC 9846 §4.5.1; Chrome help, Resolve security and connection issues. |
| 11 | Learn fact "CertificateVerify" | the server’s signature over the whole handshake with its certificate’s private key (such as ecdsa_secp256r1_sha256), proving the certificate is its own | Step 3's last sentence and the log's CertificateVerify. RFC 9846 §4.5.2, §4.3.3. |
| 12 | Learn fact "Round trips" | one for a TLS 1.3 handshake; TLS 1.2 took two | Step 4's fact "one (TLS 1.2 took two)". RFC 9846 §2.3; Microsoft SQL Server TLS 1.3; Palo Alto TLS handshake. |
| 13 | Learn fact "Records" | each up to 16 KB, encrypted and checked with AEAD (AES-128-GCM, AES-256-GCM or ChaCha20-Poly1305) and numbered, so none can be replayed or reordered; one altered on the way ends the connection | Step 5's facts. RFC 9846 §5.1, §5.2, §5.3, §9.1, Appendix F.2; RFC 5116 §5.1. |
| 14 | Learn fact "0-RTT" | a resumed connection may send data in its first message, but that data can be replayed | Step 4's Go deeper. RFC 9846 §2.3, §2.2. |
| 15 | Learn fact "close_notify" | each side says it has finished sending, so a cut-off connection can’t pass for a complete one (a truncation attack); other alerts report errors | Step 6. RFC 9846 §6.1, §6; RFC 6176 §2. |
| 16 | Learn fact "Stands for" | Transport Layer Security; SSL (Secure Sockets Layer) is its old name | The unit's full name was in no Learn part. RFC 9846 Abstract; NIST SP 800-77r1 §8.2; Microsoft App Service certificates; Palo Alto TLS certificate; NIST SP 800-52r2 §1.1. |
| 17 | Learn fact "Purpose" | the seal itself: a secure channel between two ends, private and unchanged, with the server’s identity checked | The unit's purpose line was in no Learn part. RFC 9846 §1. |
| 18 | Learn fact "ClientHello carries" | the TLS versions the browser speaks, its cipher suites, a random number, and a key share made fresh for this connection, for the method it guesses the server will pick; a wrong guess costs a HelloRetryRequest and another round trip | Step 1 names the versions, the random number and the guess. RFC 9846 §2, §4.3.8, §4.2.1. |
| 19 | Learn fact "Shared secret" | each side combines its own secret half with the other’s public half; the secret itself never crosses the network, and nobody watching can work it out | Step 2: "It never crossed the network, so nobody watching can work it out." RFC 7748 §6.1; RFC 9846 Appendix F.1. |
| 20 | Learn fact "Why a certificate" | the key exchange alone doesn’t show who is on the other end: without a checked certificate, an impostor in the middle could do the same maths | Step 3 opens "Anyone could do the key maths, an impostor included." RFC 9846 Appendix C.5; Microsoft App Service certificates, Frequently asked questions. |
| 21 | Learn fact "Certificate message" | the server sends its own certificate first, then the one that signed it (here the intermediate’s); the root, which the browser already holds, can be left out | The log's "chain of 2". RFC 9846 §4.5.1. |
| 22 | Learn fact "Finished" | a code (an HMAC) over every handshake message so far, made with a key from the handshake; each side checks the other’s, and if it doesn’t match, the connection ends | Step 4: Finished as a code, and the codes that must match. RFC 9846 §2, §4.5, §4.5.3. |

### Reworded, same meaning

The words changed, the claim did not.


| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Step 3 narrative, third sentence | The browser checks three things: the name matches, the dates are valid, and the signatures lead back to a CA it already trusts. | The browser checks that the name matches, the dates are valid, and the signatures lead back to a CA it already trusts. | RFC 9525 §6.3, RFC 5280 §6.1.3 and §6.1. The Learn fact "Certificate checks" lists four checks (revocation too), so "three things" read as the whole list. The three named are still the ones the step names. |

### What the checker passed as a simplification

Every `Note:` line of the passing reports (`docs/fact-checks/what-is-tls.md` and `what-is-tls.recheck.md`), on an item it passed, with the item. The one item the full check marked imprecise (the ServerHello step) is judged again in the re-check, so its notes are the second list. Notes shared by several items are given once. Many notes only say which RFC defines the thing; they are kept so that none is left out.

**On the first full check (76 notes):**

- `units[0].osi`: The badge says TLS spans layers. None of the allowed sources I read puts TLS at one OSI layer. Microsoft's TLS protocol page places TLS between the application protocol layer and the TCP/IP layer and says it works between the application and transport layers. NIST SP 800-52r2 §1 says TLS runs on top of TCP, with application protocols above it. The scope note in NIST SP 800-52r2 §1.2 says the guide covers the "transport layer" part of the network stack. That is the internet stack's wording, not an OSI placement, and §1 of the same guide puts TLS between TCP and the application. RFC 9846 §1 says higher-level protocols layer on top of TLS. None of these is a single-layer OSI placement.
- `units[0].steps[0].deep[0] (step "clienthello", Go deeper)`: The table in RFC 9846 Appendix B.4 lists exactly five suites, TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_AES_128_CCM_SHA256 and TLS_AES_128_CCM_8_SHA256. RFC 9846 is the current TLS 1.3 standard and defines these values.
- `units[0].steps[0].deep[0] (step "clienthello", Go deeper)`: RFC 6066 §3 defines the server_name extension (SNI).
- `units[0].steps[0].deep[0] (step "clienthello", Go deeper)`: RFC 9846 §4.3.7 defines the supported_groups extension.
- `units[0].steps[0].deep[0] (step "clienthello", Go deeper)`: RFC 10024 (Standards Track, August 2026) defines the X25519MLKEM768 group and its name.
- `units[0].steps[0].deep[0] (step "clienthello", Go deeper)`: The browser part rests on Cloudflare's list, which says the hybrid is the default in Chrome, Edge, Firefox and Safari, and on RFC 10024 §2, which says it is widely deployed. Cloudflare says "default", and the lesson's "put first" means the same for a beginner. "Unencrypted" leaves out Encrypted Client Hello (RFC 9849), a newer option that is not yet the ordinary case.
- `units[0].steps[0].deep[0] (step "clienthello", Go deeper)`: All cited RFCs are current: none is obsoleted on its RFC Editor info page.
- `units[0].steps[1].deep[0] (step "serverhello", Go deeper)`: RFC 9846 §7.4.2 defines the elliptic-curve Diffie-Hellman calculation TLS 1.3 uses with X25519.
- `units[0].steps[1].deep[0] (step "serverhello", Go deeper)`: RFC 9846 §F.1 also says that a long-term key compromised after the handshake does not compromise the session key, as long as the session keys have been erased. That matches "steals the server's private key later".
- `units[0].steps[1].deep[0] (step "serverhello", Go deeper)`: RFC 9846 §7.3 defines how each side's traffic keys are calculated.
- `units[0].steps[1].deep[0] (step "serverhello", Go deeper)`: RFC 5869 defines HKDF.
- `units[0].steps[1].deep[0] (step "serverhello", Go deeper)`: RFC 9846 §4.2.1 defines this negotiation step. §4.3.8 adds that asking the server to pick a group comes "at the cost of an additional round trip".
- `units[0].steps[1].deep[0] (step "serverhello", Go deeper)`: "Paired with ML-KEM" simplifies: the ML-KEM half is a key encapsulation, not Diffie-Hellman. The lesson calls it "a post-quantum method" and does not say it is Diffie-Hellman, so nothing false is taught. All cited RFCs are current.
- `units[0].steps[2].deep[0] (step "certificate-verification", Go deeper)`: RFC 9846 §4.5.1 defines the Certificate message and its chain.
- `units[0].steps[2].deep[0] (step "certificate-verification", Go deeper)`: RFC 5280 §6.1 defines path validation from a trust anchor.
- `units[0].steps[2].deep[0] (step "certificate-verification", Go deeper)`: RFC 5280 §6.1.3 defines the per-certificate checks, revocation among them.
- `units[0].steps[2].deep[0] (step "certificate-verification", Go deeper)`: RFC 9162 defines Certificate Transparency and is the current CT RFC (it obsoletes RFC 6962).
- `units[0].steps[2].deep[0] (step "certificate-verification", Go deeper)`: Loosely put: a chain can hold more than one intermediate, and a self-signed certificate becomes trusted if its owner installs it in the trust store (RFC 6797 §11.3 describes this). Neither is the ordinary case for a public site. Browsers check revocation in different ways. NIST requires a client to check, and RFC 5280 makes it part of path validation. All sources are current.
- `units[0].steps[3].deep[0] (step "handshake-finished", Go deeper)`: RFC 9846 §4.5.3 defines the Finished message.
- `units[0].steps[3].deep[0] (step "handshake-finished", Go deeper)`: All of these sections are in RFC 9846, the current TLS 1.3 standard, which defines each message. "A resumed connection" is the common case of the PSK that §2.3 names.
- `units[0].steps[4].deep[0] (step "encrypted-application-data", Go deeper)`: RFC 9846 defines the record layer, AEAD protection, sequence numbers and KeyUpdate. 2^14 bytes is 16 KB. The sequence number is implicit, not sent, and padding can hide a record's true length. Both are details the claim may leave out.
- `units[0].steps[5].deep[0] (step "close-notify", Go deeper)`: RFC 9846 §6 defines the alert format. In TLS 1.3 the level is kept as a legacy field, and its meaning comes from the alert type.
- `units[0].steps[5].deep[0] (step "close-notify", Go deeper)`: §6.2 also lists handshake_failure and decrypt_error among the error alerts.
- `units[0].steps[5].deep[0] (step "close-notify", Go deeper)`: RFC 6176 is updated by RFC 8996, which does not change its account of SSL 2.0. All sources are current.
- `units[0].learn.lead[0] ("lead-1")`: RFC 9846 defines the handshake. Microsoft's page independently confirms the one round trip.
- `units[0].learn.terms[0] ("term-clienthello")`: RFC 9846 defines the ClientHello. Calling it "Here's what I can do" is an everyday gloss on "offered" options.
- `units[0].learn.terms[1] ("term-serverhello")`: RFC 9846 defines the ServerHello.
- `units[0].learn.terms[2] ("term-suite")`: RFC 9846 Appendix B.4 defines TLS 1.3 cipher suites. "A set of methods for the lock" is an everyday rendering of the algorithm pair.
- `units[0].learn.terms[3] ("term-keyshare")`: RFC 9846 defines the key_share extension. For the ML-KEM half, the server's share is a ciphertext rather than a public key. That detail does not change what a beginner takes away.
- `units[0].learn.terms[4] ("term-shared")`: Two independent RFCs. RFC 7748 is an Informational IRTF RFC and is not obsoleted.
- `units[0].learn.terms[5] ("term-cert")`: RFC 5280 defines the Internet X.509 certificate profile. It is not obsoleted, and its updates do not change this. "The site's ID" is an everyday word for the subject binding.
- `units[0].learn.terms[6] ("term-ca")`: Two independent RFCs.
- `units[0].learn.terms[7] ("term-finished")`: RFC 9846 defines the Finished message.
- `units[0].learn.terms[8] ("term-close")`: RFC 9846 defines close_notify.
- `units[0].learn.pattern ("pattern")`: RFC 9846 defines the flow. Figure 1 in §2 shows ClientHello, ServerHello, Certificate, CertificateVerify, Finished, then Application Data. The pattern leaves out EncryptedExtensions and CertificateVerify, and full handshakes that don't use certificates (raw public keys), which is allowed.
- `units[0].learn.why[0] ("why-1")`: RFC 9846 defines TLS and states these three properties. "Any app" matches its "TLS is application protocol independent".
- `units[0].learn.why[1] ("why-2")`: HTTPS and email: RFC 9325 and NIST SP 800-52r2. VPNs: NIST SP 800-77r1 and Microsoft's SSTP specification, which says the SSTP tunnel runs over SSL/TLS. Each part has two independent sources. RFC 9325 is updated by RFC 9852 and RFC 10015, which leave §1 as it is.
- `units[0].learn.deep[0] ("deep-1", Learn's Go deeper)`: Three independent sources. RFC 6176 and RFC 7568 are updated by RFC 8996 but are not obsoleted.
- `units[0].learn.deep[1] ("deep-2", Learn's Go deeper)`: RFC 9846 §1.3 lists what TLS 1.3 changed.
- `units[0].learn.deep[1] ("deep-2", Learn's Go deeper)`: RFC 9846 Appendix E.5 sets the RC4 ban for every version. §1.3 adds that TLS 1.3 kept only AEAD algorithms. Dates: 1999 (RFC 9325, RFC 9846), 2008 (RFC 8996, RFC 9325), 2018 (RFC 8996, RFC 9325). The claim leaves out TLS 1.1 (2006), which is allowed.
- `units[0].learn.deep[2] ("deep-3", Learn's Go deeper)`: Two vendors' pages. Palo Alto says the term is still widely used. Microsoft's page gives the old name and still titles itself "TLS/SSL certificates". Both pages are live explainers or documentation.
- `units[0].learn.deep[3] ("deep-4", Learn's Go deeper)`: RFC 9846 defines the CertificateRequest. Two vendors name it mTLS.
- `units[0].learn.facts[0] ("fact-current")`: RFC 9846 (July 2026) defines TLS 1.3 and obsoletes RFC 8446.
- `units[0].learn.facts[1] ("fact-retired")`: RFC 9846 Appendix E.5 sets the rule that none of these may be negotiated.
- `units[0].learn.facts[2] ("fact-gives")`: RFC 9846 §1 defines TLS's goals, authentication among them (quoted under why-1).
- `units[0].learn.facts[3] ("fact-certs")`: RFC 9846 defines which certificates TLS uses. RFC 5280 defines the X.509 profile.
- `units[0].learn.facts[4] ("fact-defined")`: RFC 9846 is the current definition of TLS 1.3. Its info page lists no RFC that obsoletes it.
- `units[0].learn.facts[5] ("fact-handshake")`: RFC 9846 §2 also lists the server's Certificate, CertificateVerify and Finished, and says everything after the key-exchange phase is encrypted (quoted under lead-1). The claim leaves out EncryptedExtensions and QUIC, where TLS 1.3 runs over UDP (RFC 9001). Over HTTPS on TCP, as here, it holds.
- `units[0].learn.facts[6] ("fact-runs-on")`: RFC 9293 defines TCP's handshake and FIN. NIST and Microsoft independently place TLS on TCP, below the application. The claim leaves out QUIC.
- `units[0].learn.facts[7] ("fact-inside")`: The IANA registry (updated 2026-11-10) lists https on TCP port 443. RFC 9110 and RFC 9112 define HTTPS and HTTP/1.1.
- `units[0].learn.facts[8] ("fact-used")`: RFC 8314 (updated by RFC 8997, not obsoleted) defines TLS for email submission and access. Each use has two independent sources.
- `units[0].learn.facts[9] ("fact-sni")`: RFC 6066 §3 defines SNI and is updated by RFC 9846 and RFC 9325, which leave this as it is. "In plain text" leaves out Encrypted Client Hello, which is not yet the ordinary case.
- `units[0].learn.facts[10] ("fact-kx")`: RFC 10024 defines X25519MLKEM768. "Usually X25519" rests on RFC 10024's "widely deployed". The browser default rests on Cloudflare's list (Chrome, Edge, Firefox, Safari), backed by RFC 10024.
- `units[0].learn.facts[11] ("fact-fs")`: RFC 9846 §4.3.8 defines the key share rules.
- `units[0].learn.facts[12] ("fact-keys")`: RFC 9846 §7.3 defines the per-direction traffic keys. RFC 5869 defines HKDF.
- `units[0].learn.facts[13] ("fact-checks")`: RFC 9525 (current; it obsoletes RFC 6125) defines how a TLS client matches the name.
- `units[0].learn.facts[13] ("fact-checks")`: RFC 5280 §6.1 defines path validation.
- `units[0].learn.facts[14] ("fact-chain")`: RFC 9846 §4.5.1 defines the chain order. RFC 5280 and Chrome's help page independently describe a chain ending at a trusted root that the browser or the system holds. A chain may hold more than one intermediate. One intermediate is the ordinary case.
- `units[0].learn.facts[15] ("fact-certverify")`: RFC 9846 defines CertificateVerify and its signature schemes. §4.5.2 also says the signature covers the transcript hash of the handshake so far.
- `units[0].learn.facts[16] ("fact-rtt")`: Two independent vendors state both numbers. RFC 9846 names the ordinary handshake "1-RTT".
- `units[0].learn.facts[17] ("fact-records")`: RFC 9846 defines the record layer. RFC 5116 defines the AES-GCM AEAD. The claim leaves out the two rarely used CCM suites.
- `units[0].learn.facts[18] ("fact-0rtt")`: RFC 9846 defines 0-RTT. An external PSK can also carry 0-RTT, a rarer case the claim leaves out.
- `units[0].learn.facts[19] ("fact-trunc")`: RFC 9846 §6 defines alerts.
- `units[0].learn.facts[20] ("fact-stands")`: Calling SSL "its old name" is loose: SSL was the earlier protocol that TLS replaced. The lesson also says SSL's versions are retired, so a beginner is not misled.
- `units[0].learn.facts[21] ("fact-purpose")`: RFC 9846 §1 defines TLS's goal and lists confidentiality, integrity and server authentication.
- `units[0].learn.facts[22] ("fact-hello")`: RFC 9846 defines the ClientHello. §4.3.8 also forbids reusing a key share across connections.
- `units[0].learn.facts[23] ("fact-secret")`: Two independent RFCs. This is the Diffie-Hellman half. With ML-KEM, the server's part travels as a ciphertext that only the client can open, so the beginner's picture still holds.
- `units[0].learn.facts[24] ("fact-why-cert")`: RFC 9846 Appendix C.5 says what happens without certificate validation.
- `units[0].learn.facts[25] ("fact-sent")`: RFC 9846 §4.5.1 defines the Certificate message.
- `units[0].learn.facts[26] ("fact-finished")`: RFC 9846 defines Finished. §4.5.3 shows that the MAC is an HMAC.
- `units[0].practice[0].options[0] (question "same-secret")`: The option is wrong, and the feedback rightly says so. Only the public values are sent, and both sides compute the key.
- `units[0].practice[0].options[1] (question "same-secret")`: This is the right answer, and the feedback is correct.
- **On 2 items** (`units[0].practice[0].options[2] (question "same-secret")`; `units[0].practice[1].options[1] (question "certificate-proves")`): The option is wrong, and the feedback is correct.
- `units[0].practice[1].options[0] (question "certificate-proves")`: RFC 5280 defines the certificate binding. This is the right answer, and the feedback is correct.
- `units[0].practice[1].options[2] (question "certificate-proves")`: The option is wrong, and the feedback is correct. The keys come from the key exchange, and the certificate authenticates.

**On the re-check (6 notes):**

- `units[0].steps[1] (step "serverhello")`: The title and the subtitle repeat the ServerHello term and its idea word for word.
- `units[0].steps[1] (step "serverhello")`: "The server answers with a ServerHello" is stated by the handshake fact. "Picks TLS 1.3 and one cipher suite" puts in a step's words the ServerHello term's idea (what will be used), answering the ClientHello's offer of versions and cipher suites, in the handshake the lesson describes as TLS 1.3's; it adds no value or name the Learn parts lack.
- `units[0].steps[1] (step "serverhello")`: "Sends its own key share" follows from the key-share term (the public half sent across) and the shared-secret fact (each side combines its own secret half with the other's public half).
- `units[0].steps[1] (step "serverhello")`: The sentence on the shared secret repeats the shared-secret fact and term. "It never crossed the network, so nobody watching can work it out" joins with "so" two things the shared-secret fact joins with "and"; read after the previous sentence (the secret is made from a secret half each side keeps), it does not give a beginner a false cause, so it passes as a simplification.
- `units[0].steps[1] (step "serverhello")`: "After this message, everything the server sends is encrypted" rests on the handshake fact's statement that everything after the key exchange is encrypted, the ServerHello carrying the server's half of that exchange. It no longer says the ServerHello itself is encrypted, which was the full check's finding.
- `units[0].steps[1] (step "serverhello")`: In place, the step follows the ClientHello (which sends the client's key share and offers suites) and comes before the certificate, CertificateVerify and Finished steps, the order the handshake fact gives. The lesson stays true and in order.

### Counts

- Sources: 34 now, one (RFC 8446) before. Items on the claim sheet: 120 now.
- Corrections: 19. Removed: 2 (one of them 8 sizes). Added: 22. Reworded, same meaning: 1.
- Word for word as before: every other sentence, including the Overview hook, the description, the step titles, the table's other cells, the scene, the party labels, the other Go-deeper sentences and the two Practice questions with their other answers (the changes to the Learn parts above are all additions or the corrections listed).
