# What is UDP: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 31 sources (it cited one, RFC 768, before) and passed its fact-check on 2026-11-11. Compared with the lesson as it was before the move (`8f00d72:src/content/lessons/what-is-udp.ts`), it has 34 corrections (28, plus 6 in Practice), 15 removals, 20 additions and 9 rewordings; the last section lists what is word for word as before.

Source names are the ones the lesson's Sources list shows. "G.114" is ITU-T G.114, "G.711 App. I" is ITU-T G.711 Appendix I, and section numbers are the RFC's own.

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Subtitle (and the purpose line on the Overview) | Quick, no checking | Quick, no guarantees | RFC 768, Introduction: "delivery and duplicate protection are not guaranteed". UDP does have a checksum, so "no checking" was too strong. |
| 2 | Overview hook and lesson summary | …That sounds careless, but for live things like calls, games and lookups, late is as bad as lost, so speed wins. | …That sounds careless, but in a live call, late is as bad as lost, so speed wins. Even a quick lookup gains, with no setup to wait for. | G.114 Annex A.3 (a late packet is discarded and its speech is lost for the decoder); RFC 8836 §1; RFC 8834 §6.1. No source says late equals lost for games or lookups. RFC 8085 §1 (no connection set-up). |
| 3 | Overview description | TCP is like recorded delivery: signed for, and sent again if it goes missing. UDP is like a walkie-talkie. You just speak, and if a word crackles you carry on rather than go back. Here your laptop is in a voice call through a voice server, sending a small packet of sound every 20 milliseconds. | UDP is like a walkie-talkie. You just speak, and if a word crackles you carry on rather than go back. TCP is more like a phone call where you ask “got that?” and repeat anything the other side missed. | An analogy, so it cites nothing. A real recorded-delivery service does not resend a lost item, so the comparison was false of TCP's picture. |
| 4 | Step 1 narrative | Each packet is a **datagram**, a self-contained message with an address on it, like a postcard. | Each packet is a **datagram**, a message that travels on its own, like a postcard. | RFC 791 §1.4 (each datagram is an independent entity); RFC 768 Introduction. "Self-contained" and "address on it" are in no cited section. |
| 5 | Step 1 Go deeper | …Voice apps add a small header of their own inside, usually RTP, with a sequence number and a timestamp, so the receiver can put packets in order and play them on time. | …The call app can add a small header of its own inside, such as RTP, with a sequence number and a timestamp, so the receiver can put packets in order and play them on time. | RFC 3550 §1, §2.1, §5.1; RFC 3551 §4.1. They say RTP is typically run over UDP, not that voice apps usually use it. |
| 6 | Step 2 narrative | …The voice server never says “got it”, and the laptop never waits to hear. A steady flow like this is a **stream** of datagrams, and because nothing waits, your voice stays close to live. | …UDP sends no “got it” for any of them, and the laptop never waits to hear. A steady flow of datagrams like this is just what a call sends, and because nothing waits, the packets keep coming. | RFC 768; RFC 8085 §3.3. RTCP reports do come back from the server, and "close to live" is stated nowhere. |
| 7 | Step 2 Go deeper | Fifty packets a second of 20 ms Opus audio comes to roughly 30 to 70 kbit/s with headers. Real-time apps care most about latency, and about jitter, how much the delay varies. The receiver keeps a small jitter buffer, often 20 to 60 ms, to smooth out uneven arrivals. | Fifty packets a second is what a packet every 20 ms comes to. Real-time apps care about latency, and about jitter, how much the delay varies. The receiver keeps a jitter buffer for uneven arrivals, and discards a packet that arrives too late for it. | G.114 Annex A.3; RFC 3611 §4.7 (packets "discarded by the receiving jitter buffer"); RFC 3550 §6.4.1 (jitter). The bitrate, "most" and "20 to 60 ms" are stated nowhere. |
| 8 | Step 2 fact | Replies: none | Replies: no “got it” for each packet | RTCP reports (RFC 3550 §6) do reply; only a per-packet "got it" is absent. |
| 9 | Step 3 narrative | …With TCP, everything would stop until it was sent again. With UDP, nobody notices at this level: there’s no ACK to miss, so nothing is resent. … Resending wouldn’t help anyway. By the time a copy arrived, that moment of the call would be long gone. | …With TCP, the data behind it would wait until it was sent again. With UDP, nobody resends it: there’s no ACK to miss, and resending is left to the app. … A resend would only help if it arrived in time. | RFC 9293 §2.2 and RFC 9114 §1.1 (TCP delivers in order, so what follows a loss waits); RFC 8085 §3.3; RFC 8834 §6.1 (a resend can help if it arrives in time). |
| 10 | Step 3 Go deeper | UDP has no retransmission at all; a loss only shows up as a gap in the app’s own sequence numbers. Around 1% loss is barely heard in a call, and above about 5% it starts to break up. UDP also doesn’t slow down when the network is crowded, so apps have to do their own congestion control. | UDP has no retransmission at all. A call app can see a loss as a gap in its sequence numbers, and in RTCP reports. UDP also has no congestion control, so an app that doesn’t use a congestion-controlled transport has to control its own sending rate. | RFC 8085 §1, §3.1, §3.3; RFC 3550 §2.1, §6.4.1; RFC 3551 §4.1. "Only" was too strong, and the 1% and 5% figures are in no source. |
| 11 | Step 3 fact | Packet 6: arrives on time | Packet 6: sent next, 20 ms later | RFC 3551 §4.2 (20 ms packets). "On time" was a story outcome no source states. |
| 12 | Step 3 event VOICE 6 | The next 20 milliseconds, on time. Nobody resends packet 5. | The next 20 milliseconds, sent as usual. Nobody resends packet 5. | Same reason as the fact above. |
| 13 | Step 4 narrative | …with no handshake and no checking. The two directions are completely separate. Each side simply sends to the other’s address and port… | …with no handshake and no guarantee. Each side simply sends to the other’s address and port… | RFC 768 Fields (a reply may be addressed to the source port). "Completely separate" is stated nowhere. |
| 14 | Step 4 Go deeper | The server sends from the port you sent to (16384) back to the port you sent from (50900). Your home router remembers that pair for a short while, often 30 to 120 seconds for UDP, which is how replies get back in through NAT. During silences, apps send small keep-alive packets to keep that way in open. | A call app’s server can send from the port you sent to (16384) back to the port you sent from (50900), as symmetric RTP recommends; UDP itself doesn’t require it. Your home router remembers that pair for a while, which is how replies get back in through NAT. The standard says at least two minutes, except for some well-known destination ports. During silences, a call app may send small keep-alive packets to keep that way open. | RFC 4961 §1, §3, §4 (symmetric RTP; UDP does not require the same port); RFC 4787 §4.3 (NAT timers at least two minutes, REQ-5 and REQ-5a); RFC 8085 §3.5; RFC 8445 §11 (keep-alives). "30 to 120 seconds" contradicts REQ-5. |
| 15 | Step 4 fact | Your router remembers: the port pair for about a minute | Your router remembers: the port pair, for a while | RFC 4787 §4.3. "About a minute" is below the standard's two minutes. |
| 16 | Step 5 narrative | …the app filled the 20-millisecond gap left by packet 5 by blending the sound around it, too short to notice. … here switching to a sturdier, slightly lower quality. Choosing how to cope is the app’s job, and that’s the whole idea of UDP. | …the app filled the 20-millisecond gap left by packet 5 with sound made from what it had just heard, blended into the next packet. … here adapting its encoding. Choosing how to cope is the app’s job. | G.711 App. I §I.2.7 (the fill continues the earlier sound and is mixed with the real signal); RFC 6716 §4.4; RFC 3550 §6 (adaptive encodings). "Too short to notice" is stated only conditionally. |
| 17 | Step 5 Go deeper | Filling a gap is packet loss concealment. RTCP receiver reports carry loss, jitter and round-trip time, and apps respond by lowering the bitrate or adding forward error correction, extra data that can rebuild a lost packet. Some apps want full reliability over UDP and build it themselves: QUIC, under HTTP/3, has its own ACKs and resending. | Filling a gap is packet loss concealment. RTCP receiver reports carry the fraction of packets lost and the jitter, and the sender can work out the round-trip time from them. The sender may change its transmissions based on them, for example its encoding. Some apps want full reliability over UDP and build it themselves: QUIC has its own acknowledgments and resending. | G.711 App. I §I.1, §I.2.7; RFC 6716 §4.4; RFC 3550 §6, §6.4.1; RFC 9000 §13. The cited reports do not mention bitrate or forward error correction. |
| 18 | Step 5 fact | Report: RTCP: loss, jitter, delay | Report: RTCP: how well the packets arrived | RFC 3550 §6. |
| 19 | Step 5 fact | The app’s fix: lower bitrate, error correction | The app’s fix: adapts, for example its encoding | RFC 3550 §6 ("adaptive encodings"). |
| 20 | Step 5 event REPORT | RTCP receiver report: 1 of 6 lost, jitter 4 ms (size 84 B) | RTCP report: 1 of 6 lost (size —) | RFC 3550 §6.4: a site that has just sent data sends a sender report, so "receiver report" was wrong for this server. The jitter figure and the size are not worked out from any source. |
| 21 | Step 5 event VOICE 7 | Your voice at a sturdier setting, with a little extra to rebuild losses. / RTP over UDP, seq 7, lower bitrate with error correction (size 172 B) | Your voice with an adapted encoding. / RTP over UDP, seq 7, adapted encoding (size —) | RFC 3550 §6. 172 B is the plain G.711 packet, which an adapted encoding no longer is. |
| 22 | Learn lead | UDP sent your voice with no setup and no checking. When a packet was lost, the app, not UDP, decided what to do. | UDP sent your voice with no setup first, no guarantee that it arrived, and no promise to keep the packets in order. When a packet was lost, perhaps dropped by a busy router, UDP did not send it again, as TCP would have. The app, not UDP, decided what to do. | RFC 768 Introduction; RFC 8085 §1, §3.3; RFC 1122 §4.1.1; RFC 9293 §3.8.1; RFC 7567 §2 and RFC 5681 §3 (drops under congestion). |
| 23 | Learn term Datagram | One self-contained message | One message that travels on its own | RFC 791 §1.4; RFC 768 Introduction. |
| 24 | Learn why | For a call, a game or a quick lookup, waiting is worse than losing a little. UDP adds almost nothing on top of IP, so it’s as fast as the network allows, and each app decides how much checking it needs. | In a call, each bit of sound has its moment to be played. A packet that arrives after its moment is thrown away, just as if it had been lost, so a resend only helps if it arrives in time. Late is as bad as lost. A quick lookup gains in another way: UDP has no setup to wait for. It adds almost nothing on top of IP, and each app decides how much checking it needs. | G.114 Annex A.3; RFC 8836 §1; RFC 8834 §6.1; RFC 1122 §4.1.1; RFC 8085 §1; RFC 1035 §4.2.1. "As fast as the network allows" and the games claim are in no source. |
| 25 | Learn Go deeper | Compared with TCP: no handshake, no ordering, no ACKs, no flow or congestion control, and an 8-byte header instead of 20 or more. UDP can also send one packet to many machines at once (broadcast and multicast), which TCP can’t; DHCP relies on that. Well-known UDP ports: 53 DNS, 67 and 68 DHCP, 123 NTP, 161 SNMP, 443 QUIC. | The UDP header is four 2-byte fields: source port, destination port, length and checksum. TCP’s header also has sequence and acknowledgment numbers and a window; UDP’s has none. / UDP can send one message to many machines (broadcast and multicast), which TCP can’t; DHCP’s first message is a broadcast. / Some apps build reliability over UDP themselves: QUIC has its own acknowledgments and resending. / In a G.711 call, 8,000 one-byte samples a second make 160 bytes in 20 ms; the 12-byte RTP header makes each packet 172 bytes, before the UDP header. | RFC 768 Fields; RFC 9293 §3.1, §3.9.1.1; RFC 1122 §4.1.1; RFC 8085 §4; RFC 2131 §3.1; RFC 9000 §13; RFC 3551 §4.5.14, §4.5, §6; RFC 3550 §5.1. RFC 9293 never states "20 bytes". |
| 26 | Learn fact Gives | ports and a checksum, nothing more | ports and a checksum, with optional extras | RFC 1122 §4.1.1; RFC 9868, Abstract (UDP transport options now exist). |
| 27 | Learn fact Ports | 53 DNS, 67/68 DHCP, 123 NTP, 443 QUIC | 53 DNS, 67/68 DHCP, 123 NTP, 161 SNMP, 443 HTTP/3 (over QUIC) | IANA port registry; RFC 1035 §4.2.1; RFC 2131 §4.1; RFC 3417 §3.2; RFC 9308 §8; RFC 9312 §3.1. The default HTTP/3 port is UDP 443; QUIC itself has no fixed port. |
| 28 | Learn fact Versus TCP | faster, but nothing is checked | no setup, but no guarantee | RFC 8085 §1; RFC 768 Introduction. |

Practice corrections are counted here too, since the feedback is part of what a reader sees:

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| P1 | Question 1, option "Sends it again." | Not quite. UDP never resends. A late copy would be no use in a live call anyway. | Not quite. UDP never resends, and in a live call a resend only helps if it arrives in time. | RFC 8834 §6.1; RFC 8836 §1; G.114 Annex A.3. |
| P2 | Question 1, option "Nothing. The app copes with the gap." | Right. UDP doesn’t notice; the call app fills the gap or adjusts. | Right. UDP doesn’t resend; the call app deals with the gap or adjusts. | RFC 8085 §3.3; RFC 1122 §4.1.1; RFC 3550 §6. |
| P3 | Question 2 prompt | Why do calls and games use UDP instead of TCP? | Why do calls use UDP instead of TCP? | No source says why games choose UDP. |
| P4 | Question 2, option "Late is as bad as lost, and UDP never waits." | Yes. No handshake and no resending keeps things close to live. | Yes. A late packet is useless, and UDP has no handshake and no resending to wait for. | G.114 Annex A.3; RFC 8836 §1; RFC 8834 §6.1; RFC 8085 §1, §3.3; RFC 1122 §4.1.1; RFC 768 Introduction. |
| P5 | Question 2, option "UDP is encrypted." | Not quite. UDP has no encryption of its own. Apps add it if they need it. | Not quite. UDP does not provide communications security. Apps that need it use other protocols. | RFC 8085 §6; RFC 1122 §4.1.1. |
| P6 | Question 2, option "UDP never loses packets." | Not quite. UDP packets get lost like any others. UDP just doesn’t resend them. | Not quite. UDP does not guarantee delivery, and it doesn’t resend what is lost. | RFC 768 Introduction; RFC 8085 §3.3. |

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Overview "Used for" | "video" (calls, video, games, DNS, DHCP) | The only source for live video is RFC 3550 §1, and nothing in Learn states it; G.114 states late-is-lost only for speech. |
| 2 | Hook, summary, Learn why, Practice | "games" as a reason for UDP | No source says games choose UDP because late data is useless. |
| 3 | Overview description | "Here your laptop is in a voice call through a voice server, sending a small packet of sound every 20 milliseconds." | The description is now only an analogy; the same facts are in the Overview facts and the scene title. |
| 4 | Step 2 Go deeper | "roughly 30 to 70 kbit/s with headers" and "often 20 to 60 ms" | No source states either figure. |
| 5 | Step 3 Go deeper | "Around 1% loss is barely heard in a call, and above about 5% it starts to break up." | No source states these figures; one source says some codecs need loss well under 1%. |
| 6 | Step 3 fact | "Barely heard: up to about 1% loss" | Same reason. |
| 7 | Step 3 narrative | "Resending wouldn’t help anyway. By the time a copy arrived, that moment of the call would be long gone." | Says a resend is always too late; RFC 8834 §6.1 says it can help when it arrives in time. |
| 8 | Step 4 narrative | "The two directions are completely separate." | Stated by no source. |
| 9 | Step 5 narrative | "too short to notice" and "that’s the whole idea of UDP" | G.711 App. I says a short gap "may be inaudible" only on conditions; the second is opinion. |
| 10 | Step 5 Go deeper | Forward error correction and lowering the bitrate; "under HTTP/3" | The cited RTCP sections do not mention them. |
| 11 | Step 5 event REPORT | "jitter 4 ms" and the "84 B" size | Numbers no cited statement gives. |
| 12 | Learn Go deeper | "no ordering, no ACKs, no flow or congestion control" as a list, and "an 8-byte header instead of 20 or more" | The TCP header size is stated nowhere; the rest is now said in the lead, Step 3 and the header comparison. |
| 13 | Learn Go deeper | The port list as a paragraph | The Ports fact already states it with its citations. |
| 14 | Learn fact Ports | "443 QUIC" | Replaced by "443 HTTP/3 (over QUIC)" (see Corrections 27). |
| 15 | Step 2 narrative | "A steady flow like this is a **stream** of datagrams" | "Stream" as a term is stated by no source; the sentence now says what a call sends. |

## Added

New statements, terms, facts or sentences, with why each was needed.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn lead | "…and no promise to keep the packets in order." | The Overview says "no order"; a Learn statement has to state it. |
| 2 | Learn lead | "perhaps dropped by a busy router" (also in Step 3) | Step 3 says it; now cited to RFC 7567 §2 and RFC 5681 §3. |
| 3 | Learn lead | A third statement: "A call app sends its sound in small chunks, say 20 milliseconds each, one chunk to a packet. It can add a small header of its own, such as RTP, with a sequence number and a timestamp, so the receiver can spot gaps, put packets in order and play them on time." | Step 1 to Step 5 trace to it for the 20 ms chunks and the RTP header. |
| 4 | Learn why | "A call app also keeps a jitter buffer at the receiver. A packet that arrives too late for its place in the buffer is discarded." | The "Smoothing" fact needs a Learn statement. |
| 5 | Learn why | "TCP delivers bytes in order, so when one packet is lost, the data behind it waits until it is sent again. UDP holds nothing back: packet 6 reaches the app as it arrives." | Step 3 says it; head-of-line waiting needed a cited statement. |
| 6 | Learn Go deeper | "In a G.711 call, 8,000 one-byte samples a second make 160 bytes in 20 ms; the 12-byte RTP header makes each packet 172 bytes, before the UDP header." | The log's 172 B is worked out from it. |
| 7 | Learn Go deeper | "TCP’s header also has sequence and acknowledgment numbers and a window; UDP’s has none." | Makes the "no sequence number, no ACK" comparison cited. |
| 8 | Learn Go deeper | "DHCP’s first message is a broadcast." | Replaces "DHCP relies on that" with what RFC 2131 §3.1 states. |
| 9 | Learn Go deeper | "Some apps build reliability over UDP themselves: QUIC has its own acknowledgments and resending." | Step 5 fact "Reliable over UDP" traces to it. |
| 10 | Learn fact | Layer: transport, in the internet model | NIST SP 800-77r1 §2.1 and RFC 1122 §4 place UDP in the internet model's transport layer, which the OSI layer fact is not. |
| 11 | Learn fact | OSI layer: 4, transport | Backs the OSI badge, from Cloudflare's "4 Transport layer: TCP/UDP" row and Azure's pages (see Unchanged for the badge itself). |
| 12 | Learn fact | Online games: Xbox multiplayer has used UDP 3074 | Backs "online games" in "Used for", from the Microsoft GDK page and the IANA registry. |
| 13 | Learn fact | A router’s memory: a UDP port pair, at least two minutes by the standard, except for some well-known ports | Step 4's router fact traces to it (RFC 4787 §4.3, RFC 8085 §3.5). |
| 14 | Step 2 Go deeper | "…and discards a packet that arrives too late for it." | The jitter buffer's discard is now stated (G.114 Annex A.3; RFC 3611 §4.7). |
| 15 | Step 3 narrative | "…the data behind it would wait…" and "A resend would only help if it arrived in time." | Cited as above (Corrections 9). |
| 16 | Step 4 Go deeper | "…as symmetric RTP recommends; UDP itself doesn’t require it." and "The standard says at least two minutes, except for some well-known destination ports." | RFC 4961 §1, §3, §4 and RFC 4787 §4.3 state them. |
| 17 | Step 3 Go deeper | "A call app can see a loss as a gap in its sequence numbers, and in RTCP reports." | Replaces "only" with what RFC 3550 §2.1, §6.4.1 and RFC 3551 §4.1 state. |
| 18 | Learn terms | Jitter and Loss concealment carry longer ideas: "Covering a gap with sound made from what came before, blended into the next packet"; Report (RTCP): "…which the sender can use to adapt its encoding" | The Watch steps trace to these words (G.711 App. I §I.1, §I.2.7; RFC 6716 §4.4; RFC 3550 §6). |
| 19 | Learn, Sources list | 31 sources instead of one | Every cited claim lists its source at the foot of Learn. |
| 20 | Overview "Used for" | "online games" in place of "games" | Said only as a use, backed by the Learn fact above. |

## Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Scene title | Your voice goes out in small packets, unchecked | Your voice goes out in small packets, no promises |
| 2 | Step 2 fact | Matters most: low delay, steady timing | Matters: low delay, steady timing |
| 3 | Learn fact Defined in | RFC 768 | RFC 768, User Datagram Protocol |
| 4 | Step 4 events (log times) | 0.104s, 0.124s, 0.144s | 0.120s, 0.140s, 0.160s |
| 5 | Step 5 event REPORT (log time) | 0.160s | 0.180s |
| 6 | Step 5 event VOICE 7 (log time) | 0.180s | 0.200s |
| 7 | Learn term Loss concealment idea | Covering a gap so you don’t hear it | Covering a gap with sound made from what came before, blended into the next packet |
| 8 | Learn term Report (RTCP) idea | The app’s own note about how it went | The app’s own note about how it went, which the sender can use to adapt its encoding |
| 9 | Step 4 Go deeper (last sentence) | During silences, apps send small keep-alive packets to keep that way in open. | During silences, a call app may send small keep-alive packets to keep that way open. |

The log times are example data; they are now all multiples of the 20 ms packet interval.

## Unchanged

Word for word as the original: the title ("UDP"), the full name (User Datagram Protocol) and the level; the OSI badge (layer 4, now cited to Cloudflare and Microsoft Azure); the scene's labels (In a call with Sam, Call), the table (title, columns, empty text), the legend and both parties; all five step titles and subtitles; Overview facts Starts with, Promises, Header, OSI layer and This example; Step 1's first Go deeper sentences, its four facts and its event; Step 2's Rate and Smoothing facts and its three events; Step 3's Packet 5 and Who notices facts, its VOICE 5 event and the status lines; Step 4's From, To and Same rules facts; Step 5's Gap filled by and Reliable over UDP facts, the table row "Lost, gap filled by Sam’s app" and the status line "Call adjusted"; Learn terms Connectionless, Port, No retransmission and Jitter; the pattern (its four names and its note); the Learn fact Header; both Practice answers (the third option of question 1, the first of question 2), question 1's prompt, its option "Pauses the call until it arrives." with its feedback, and the texts of question 2's options.
