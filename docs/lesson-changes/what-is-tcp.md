# What is TCP: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 22 sources (it listed one, RFC 9293, before) and passed its fact-check on 2026-11-11, all 123 items. The check ran under the owner's rule of 2026-11-11: a sentence that is true for a beginner stays word for word, even where the source is more exact, and only what would leave a beginner believing something false was changed. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-tcp.ts`), it has 11 corrections, 3 removals, 17 additions and 2 rewordings; the last sections list what is word for word as before and what the checker passed as a simplification.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own.

## The changes to look at first

1. **The hook no longer says the internet breaks the data up, or that TCP numbers pieces.** TCP cuts the data into segments and sends each in an IP datagram; the network only carries them. And TCP numbers every byte, as the lesson's own step 2 says. (Corrections 1 and 2.)
2. **Waiting for an ACK is longer than a round trip, and TIME-WAIT is 4 minutes.** The original said "about one round trip" and "up to about a minute". By the standard the timer is at least 1 second (this example's round trip is 32 ms), and TIME-WAIT is twice a 2-minute segment lifetime. (Corrections 4 and 8.)
3. **The animation no longer draws the finished page on the laptop.** The last step-5 message used to put the page's words and pictures on the laptop. In this story the browser asked for one thing, the page itself, and a page's pictures are fetched with requests of their own, so nothing here shows them arriving. The status "Page complete" stays. (Removal 3.)
4. **No message size is shown.** The log's Size column was 74 B, 66 B, 186 B, 1.5 KB and so on. No source states a size, and a number in a log reads as a fact about the protocol, so all 14 are now a dash. (Removal 2.)
5. **One duplicate ACK is explained.** The story resends after one duplicate ACK, but the old Go deeper said three are needed. The lesson now says today's TCPs also use time (RACK), so one duplicate ACK with its SACK is enough. (Addition 16.)
6. **"Used for" and the closing description.** "Anything that must arrive whole" and "web pages, email and file transfers all ride on TCP" left out HTTP/3, which runs over QUIC on UDP and which the HTTP and UDP lessons teach. (Correction 3, removal 1.)

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Overview hook and lesson summary (first sentence) | The internet breaks everything into small pieces and makes no promises about them. | The internet carries everything in small pieces and makes no promises about them. | RFC 9293 §3.7 (TCP does the segmenting) and §2.2 (each segment is sent as an IP datagram); RFC 791 §1.4 (IP gives no reliability). |
| 2 | Overview hook and lesson summary (last sentence) | …it numbers every piece, checks what arrived… | …it numbers every byte, checks what arrived… | RFC 9293 §3.4 ("every octet of data sent over a TCP connection has a sequence number"). The lesson's step 2 already says bytes. |
| 3 | Overview fact Used for | anything that must arrive whole: pages, email, files | things that must arrive whole: web pages (except over HTTP/3), email, files | RFC 9114 §1 and RFC 9000 §1 (HTTP/3 runs over QUIC, on UDP); RFC 9110 §4.3.2, RFC 9112 §9, RFC 5321 §4.5.4.2, RFC 959 §8 (web, email and files over TCP). |
| 4 | Step 2 fact Waits for an ACK | about one round trip | longer than a round trip (by the standard, at least 1 second) | RFC 6298 §2 (the timer is rounded up to 1 second); RFC 8985 §1.1. |
| 5 | Step 4 fact Also | the server sends a little slower for a while | the server sends slower for a while | RFC 8985 §1.1 (the window is halved); RFC 9438 §4.6 (cut to 0.7 in CUBIC). That is more than "a little". |
| 6 | Step 5 fact To the browser | all at once, in order | all 4380 bytes, in order | RFC 9293 §3.10.7.4 and §3.9.1.3: TCP holds only what comes after a gap; in-order data can go on as it arrives. |
| 7 | Step 5 Go deeper, third sentence | Retransmission costs about one extra round trip, which is why lossy networks feel slow even when nothing is actually lost for good. | Retransmission costs about one extra round trip, and loss also makes TCP slow down, which is why lossy networks are slow even when nothing is lost for good. | RFC 8985 §1.1 (recovery can take one round trip with SACK); RFC 2018 §1 (losses hurt throughput); RFC 5681 §3.2 (a reduced window after loss). No source says the resend's round trip alone is why lossy networks are slow. |
| 8 | Step 6 fact Afterwards | TIME-WAIT, up to about a minute | TIME-WAIT, twice the 2-minute segment lifetime (4 minutes by the standard) | RFC 9293 §3.4.2 (MSL is taken to be 2 minutes) and §3.10.7.4 (the 2 MSL timeout). |
| 9 | Learn pattern note | Every TCP connection goes this way. The middle three repeat for as long as data flows. | A TCP connection goes this way, though Retransmit comes only when a piece is lost, and an RST can end it abruptly instead. The middle three repeat for as long as data flows. | RFC 9293 §3.5, §3.4, §3.8, §3.6. "Every" ruled out a close by RST, which the lesson teaches. |
| 10 | Learn Go deeper, last sentence | …flags (SYN, ACK, FIN, RST, PSH, URG), window and checksum. | …flags (such as SYN, ACK, FIN and RST), window and checksum. | RFC 9293 §3.1 (eight control bits: CWR, ECE, URG, ACK, PSH, RST, SYN, FIN). The list read as complete. |
| 11 | Learn fact label | Flags | Some flags | RFC 9293 §3.1; the same fault as 10. |

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Overview description, last sentence | "Web pages, email and file transfers all ride on TCP." | It sat under an analogy, which cites nothing, and "all" ruled out HTTP/3. The idea is now Learn's "Used for" fact. |
| 2 | The log's Size column, all 14 messages (SYN, SYN-ACK, ACK, BYTES 1–120, ACK 121, PIECE 1, PIECE 2, PIECE 3, ACK 1461, PIECE 2 again, ACK 4381, FIN, FIN-ACK, ACK) | 74 B, 74 B, 66 B, 186 B, 66 B, 1.5 KB ×3, 78 B, 1.5 KB, 66 B, 66 B ×3; now shown as — | A size reads as a claim about the protocol and no source states one. The times, addresses and ports stay as example data. |
| 3 | Step 5, the message ACK 4381: the page cue | The laptop's screen drawing the page's words and pictures when the last ACK is sent | Only the page's own bytes were requested and delivered. No source lets this lesson show the pictures (they are fetched by requests of their own), and the HTML Standard's drawing rules belong to the HTTP lesson. The status "Page complete" and the table stay. |

## Added

New statements, terms, facts or sentences, with why each was needed. The 15 new Learn facts are the parts the Watch steps and the Overview trace to; the old Learn did not state these ideas.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact Rides on | IP; each segment is sent inside an IP datagram | The "over IP" under every message traces to it (RFC 9293 §2.2). |
| 2 | Learn fact Used for | things that must arrive whole: web pages (except over HTTP/3), email, files | The Overview fact and "a page" in the scene trace to it (RFC 9110 §4.3.2; RFC 9112 §9; RFC 5321 §4.5.4.2; RFC 959 §8; RFC 8085 §3.3; RFC 9293 §2.2; RFC 9114 §1; RFC 9000 §1). |
| 3 | Learn fact Promises | every byte, in order, once | The Overview fact traces to it (RFC 9293 §2.2, §3.4). |
| 4 | Learn fact Pieces | segments, usually up to 1460 bytes of data | The Overview fact, step 3 and the table trace to it (RFC 9293 §3.7.1; Microsoft Azure TCP/IP tuning, "An interface with an MTU of 1,500 has an MSS of 1,460"). |
| 5 | Learn fact OSI layer | 4, transport | Backs the Overview fact and the badge (Cloudflare Network Layers; Microsoft Azure Load Balancer; no standard places TCP in the OSI model). |
| 6 | Learn fact The network | carries pieces and makes no promises: a piece can be lost, arrive twice or come out of order | The hook and PIECE 3 trace to it (RFC 791 §1.4; RFC 9293 §3.8; RFC 8085 §3.3; RFC 5681 §3.2). |
| 7 | Learn fact Opens with | a three-way handshake (SYN, SYN-ACK, ACK), which sets up a connection, an agreed two-way line; data is handed over only after it, one round trip later | Step 1's messages, "Costs" fact and "connection" trace to it (RFC 9293 §3.5, §4, §2.2; RFC 7413 §1: "adds one RTT"). |
| 8 | Learn fact Starting numbers | Each side’s starting number is chosen in the handshake and is hard to guess; the example shows it as 0. The SYN uses that number up, so the first byte of data is number 1, and an ACK names the next byte expected. | "seq 0", "ack 1", "seq 1", "ACK 121" and every byte range trace to it (RFC 9293 §3.1, §3.4, §3.4.1). |
| 9 | Learn fact No ACK in time | when the sender’s timer runs out it sends the piece again; the timer is longer than a round trip, by the standard at least 1 second | Step 2's two facts trace to it (RFC 6298 §2; RFC 8985 §1.1; RFC 9293 §3.10.8). |
| 10 | Learn fact A lost piece | can be lost on the way, perhaps dropped by a busy router whose queue is full. That’s normal, not a fault: TCP takes it as a sign of a crowded network. | Step 3, the lost piece and the legend "Lost on the way" trace to it (RFC 7567 §2; RFC 9293 §3.8; RFC 5681 §3; RFC 2914 §6.1). |
| 11 | Learn fact Held pieces | TCP delivers bytes in order, so when one piece is lost, the data behind it waits until it is sent again. | "held", "out of order" and "all 4380 bytes, in order" trace to it (RFC 9293 §2.2, §3.10.7.4). |
| 12 | Learn fact Fast resend | Three duplicate ACKs make the sender resend at once instead of waiting for its timer (fast retransmit). Today’s TCPs also use time: once a piece sent later has arrived, an earlier piece still missing a short while after is treated as lost and sent again (RACK). So here one duplicate ACK with its SACK is enough. | Explains why the story resends after one duplicate ACK (RFC 5681 §3.2; RFC 8985 §1, §3.1, §3.3.1, Acknowledgments). |
| 13 | Learn fact Retransmission | costs about one extra round trip, and loss also makes TCP slow down, which is why lossy networks are slow even when nothing is lost for good. | Step 5's "Extra time" traces to it (RFC 8985 §1.1; RFC 2018 §1; RFC 5681 §3.2). |
| 14 | Learn fact Closing | each direction closes on its own: each side sends a FIN (“no more data from me”) and the other ACKs it, often four messages; a side can send its ACK with its own FIN (FIN-ACK), making three. An RST ends a connection at once. | FIN-ACK, the close cue and step 6's facts trace to it (RFC 9293 §3.6.1, §3.6, §3.10.7.4, §3.1, §3.8). |
| 15 | Learn fact TIME-WAIT | twice the 2-minute segment lifetime (4 minutes by the standard) | Step 6's fact traces to it (RFC 9293 §3.4.2, §3.10.7.4). |
| 16 | Step 4 Go deeper | "Today’s TCPs also use time (RACK): a piece still missing a short while after a later one arrived counts as lost, so here one duplicate ACK is enough." | The story resends after one duplicate ACK; the old sentence alone said three (RFC 8985 §1, §3.3.1, Acknowledgments). |
| 17 | Learn, Sources list | 22 sources instead of one | Every cited claim lists its source at the foot of Learn. |

## Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Step 2 message BYTES 1–120, Info | seq 1, 120 bytes (GET /) | seq 1, 120 bytes (the page request) |
| 2 | Learn fact Defined in | RFC 9293 | RFC 9293, Transmission Control Protocol |

## Unchanged

Word for word as the original: the title ("TCP"), the full name, the purpose ("Delivery you can count on"), the level and group; the OSI badge (layer 4, now cited to Cloudflare and Microsoft Azure, since no standard places TCP in the OSI model); the scene's title, labels (Wants a page, example.net), table (title, columns, empty text), legend and two parties; all six step titles and subtitles, in the same order; all six narratives; the first two sentences of the overview description (the numbered postcards, an analogy); Overview facts Starts with, Promises, Pieces, OSI layer and This example; steps 1 to 6's facts From, To, Messages, Costs, Request, ACK, No ACK in time, Piece 1, Piece 2, Piece 3, Segment size, ACK, SACK, Means, Resent, ACK, Extra time, Messages, Each direction and Abrupt end; all 14 messages, in the same order, with their tags, addresses, ports, times, summaries, statuses, table rows and log lines (apart from the sizes and the one Info line above); Go deeper in steps 1, 2, 3, 4 (apart from the added sentence) and 6, and the first two sentences of step 5's; Learn's lead, its eight terms, the pattern's five names, the why, and the Go deeper sentences on speed, flow control and congestion control (now three paragraphs of Learn's Go deeper, the same words) and on the header size; Learn facts Header, Common ports and Versus UDP; both Practice prompts, their ids, the three options and feedback of each, and the right answers (the second, then the first).

## What the checker passed as a simplification

The checker passed these under the owner's rule: each is true in the ordinary case, and its report's notes say what it leaves out or loosens. They stay as written. The first is the one to read.

1. **Step 4 says the laptop "already sent ACK 1461", but the animation has no row for it.** The Go deeper sentence "After piece 1 the laptop had already sent ACK 1461" (and the narrative's "the same ACK number it sent after piece 1") follows from the numbers, but the event log shows no message for that first ACK. The checker called it a gap in the animation, not a false statement. A delayed-ACK receiver may also hold that ACK briefly.
2. **"Random" starting number.** The standard builds it from a clock plus a secret pseudorandom function, not pure chance; "random" is the beginner's word for "unpredictable". Starting the example's data at 1 is labelled as a simplification.
3. **"Routers drop packets when their queues are full. That's normal."** Leaves out that routers with active queue management may drop a little before a queue is full.
4. **"Flow control".** No cited text uses the words "the window is flow control" in one sentence; the name is joined to the window by RFC 9293 §3.8.6 and §3.9.1.4 together.
5. **"Retransmission costs about one extra round trip".** This is the fast-recovery case the lesson shows; a loss caught only by the timer costs at least the timer, which the lesson teaches elsewhere.
6. **"A short while" in the RACK sentence** stands for about a round trip plus a reordering window.
7. **TIME-WAIT.** Step 6's Go deeper calls the wait "a short while" and gives one of its two reasons (in case the last ACK was lost; the other is keeping old segments out of a new connection). The 4 minutes can be shortened on some systems.
8. **A duplicate ACK** ("something's missing") leaves out that network reordering or copying can also cause one.
9. **The pattern note:** "Retransmit comes only when a piece is lost" leaves out the rarer resend when only an ACK was lost or late.
10. **"Every app would have to notice lost pieces" (Learn why)** means every app that needs its data whole and has no reliable transport under it, as RFC 8085 puts it.
11. **"Congestion control ... so everyone shares the network fairly"** is looser than the sources' "reasonably equitably among similarly situated flows".
12. **The header list** leaves out the data offset, urgent pointer and options; "such as" allows it. "20–60 bytes" is 20 plus at most 40 bytes of options, worked out from two documents.
13. **"Pieces: usually up to 1460 bytes".** "Usually" covers IPv6 (1440) and options that trim a segment slightly.
14. **"Versus UDP: nothing goes missing"** holds while the connection lives; if it fails, TCP reports the failure.
15. **The handshake's "one round trip before any data"** leaves out TCP Fast Open (RFC 7413, Experimental), which can deliver data during the handshake. It rests on RFC 7413 §1 for the words "one RTT".
16. **The close:** the order (laptop FIN, server FIN with ACK, laptop ACK) is allowed by the standard, whose Figure 12 shows four segments; the ACK and FIN may share one segment.
17. **Practice, "It encrypts the connection."** The feedback is right for the ordinary web case; it leaves out IPsec and QUIC's built-in encryption.
18. **The analogy** numbers cards where TCP numbers bytes; the lesson says so itself in step 2.
19. **Example data:** the addresses, example.net, the client's port, the times, the 120-byte request and the page's 4380 bytes in three pieces are example values.
20. **The OSI badge** rests on two vendors' pages (Cloudflare and Microsoft), because no standard places TCP at an OSI layer.

## Counts

The counts at the top were made by a script that counts the numbered rows in each section above (11 corrections, 3 removals, 17 additions, 2 rewordings), and the sources by the lesson's cited list on the claim sheet (22) against the one reference of the original.
