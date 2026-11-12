```json fact-check
{
  "slug": "what-is-imap",
  "base": "0d8f485b47261e288491d447d2380315b52219aa3886d8176cb3516dd83d6d36",
  "hash": "8862f56236c8bd2a249e94aca0bc5d33ed2b732dfb570d57f82ea97c894ede11",
  "checked": "2026-11-12",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].overview.facts[2] (Overview fact \"Keeps\")": "✅",
    "units[0].steps[4] (step \"idle-push\")": "✅",
    "units[0].learn.facts[14] (\"fact-name\")": "✅",
    "units[0].learn.facts[15] (\"fact-push\")": "✅",
    "units[0].practice[0].prompt (question \"phone-shows\")": "✅",
    "units[0].practice[1].prompt (question \"idle\")": "✅"
  },
  "sources": [
    { "id": "google-gmail-imap-settings", "current": true, "checked": "2026-11-12" },
    { "id": "microsoft-exchange-pop-imap", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-5550", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-9051", "current": true, "checked": "2026-11-12" }
  ],
  "quotes": {
    "checked": "2026-11-12",
    "count": 6,
    "digest": "fce3800e756722ab98cf4aeb2f03d2ed6c1a08f4a17a63cb04466ef825a714c7",
    "files": {
      "rfc-9051": "acf52a50eb748ea21b5ffdcb31c761d3fbba6242d53d4f53c2555de039c5c3cf",
      "microsoft-exchange-pop-imap": "9ea29704c654dca09cba291f3cc52fd7cdba3a42163375eb3fad99ad62ca1e3a",
      "google-gmail-imap-settings": "7a007556c6b2d31e6e661f9e52583f8f804f8cf1cfc76d6432da80963e2516aa",
      "rfc-5550": "6576fe340607aac2af38424c4d2a114dd744b9ae3d1e03d3288f0c4888cd6b51"
    }
  }
}
```

# Fact-check re-check: what-is-imap

A targeted re-check of the 9 items the re-check sheet lists. Every other item is outside this report.

## Claims

### units[0].learn.facts[14] ("fact-name") — ✅

Stands for: Internet Message Access Protocol.

- `rfc-9051` §Abstract
  > The Internet Message Access Protocol Version 4rev2 (IMAP4rev2) allows
  > a client to access and manipulate electronic mail messages on a
  > server.
- Note: RFC 9051 is the defining standard for IMAP (version 4rev2), and its abstract gives the protocol's full name. The lesson's expansion leaves out the version suffix, which is not part of what the letters stand for.
- Note: RFC 9051 is a Proposed Standard, not obsoleted and not updated by any later RFC (RFC Editor metadata, checked 2026-11-12).

### units[0].learn.facts[15] ("fact-push") — ✅

Push, not polling: without IDLE an app polls, asking the server for new mail every few minutes; with IDLE the server pushes news to the app as it happens.

- `rfc-9051` §6.3.13
  > Without the IDLE command, a client would need to poll the server for
  > changes to the selected mailbox (new mail, deletions, and flag
  > changes).  It's often more desirable to have the server transmit
  > updates to the client in real time.
- Note: RFC 9051 defines the IDLE command and its behaviour, so it is the defining standard for both halves of the claim (polling without it, real-time updates with it).
- `microsoft-exchange-pop-imap` §POP3 and IMAP4 applications and settings
  > The application connects to the email server periodically to send messages and to download any new messages.
- `microsoft-exchange-pop-imap` §POP3 and IMAP4 applications and settings
  > If the application and server both support the IMAP4 IDLE command, users can send and receive messages in near real time
- `google-gmail-imap-settings` §Choose your IMAP email client settings for Gmail
  > Check for new messages every 10 minutes.
- `rfc-5550` §5.4.2
  > Lemonade and TCP provide for long-lived idle connections between the
  > client and mail store, allowing the server to push notifications
  > within IMAP.
- Note: Microsoft's page and RFC 9051 are independent, and each states both the periodic check and the near-real-time updates with IDLE. Google's recommended Thunderbird setting gives a concrete polling interval of ten minutes, which "every few minutes" states loosely.
- Note: True for a beginner. The claim leaves out that an app without IDLE may also check only at start-up or by hand, and that other push methods exist (NOTIFY, or out-of-band wake-ups, as RFC 5550 describes); the ordinary case is as stated.
- Note: RFC 5550 is a Proposed Standard, not obsoleted or updated. The Microsoft and Google pages are live and describe current products, checked 2026-11-12.

## Traced, example, analogy and unbacked parts

### title — ✅

"IMAP" makes no claim beyond the lesson.

### units[0].name — ✅

"IMAP" makes no claim beyond the lesson.

### units[0].backing (the unit's full name and purpose) — ✅

- Note: The full name traces to fact-name. "Email kept in sync" traces to fact-stays, why-2 (every device shows the same folders, letters and read marks) and deep-sync (apps sync changes); it adds nothing beyond them.

### units[0].overview.facts[2] (Overview fact "Keeps") — ✅

- Note: Folders trace to term-folders and lead-1 (the mailbox is kept on the server); read marks kept on the server trace to term-flag and fact-seen. Nothing is added.

### units[0].steps[4] (step "idle-push") — ✅

- Note: Asking every few minutes traces to fact-push; IDLE as "tell me when something changes" to term-idle; the wait staying open until DONE to fact-idle; "* 3 EXISTS" meaning there are now three letters to fact-idle and fact-exists; fetching the new letter's headers to fact-fetch (ENVELOPE) and term-fetch; push and mail showing up promptly to fact-push and lead-1 ("the moment it arrives"). "Within seconds" is looser than what those parts say, not more. In its place after the fetch-and-flag step, the count of three follows the two letters SELECT reported, so the walk-through stays in order.

### units[0].practice[0].prompt (question "phone-shows") — ✅

- Note: The premise (reading a letter on a laptop with IMAP) is sound, and the question rests on why-2 and the fetch-and-flag step.

### units[0].practice[1].prompt (question "idle") — ✅

- Note: No premise beyond IDLE existing, which the lesson teaches.

## Sources

- `rfc-9051`: fetched as plain text from rfc-editor.org; RFC Editor metadata lists it as a Proposed Standard with no obsoleting or updating RFC. Checked 2026-11-12.
- `rfc-5550`: fetched as plain text from rfc-editor.org; Proposed Standard, no obsoleting or updating RFC. Checked 2026-11-12.
- `microsoft-exchange-pop-imap`: fetched from learn.microsoft.com; live, documents POP3 and IMAP4 in current Exchange Server. Checked 2026-11-12.
- `google-gmail-imap-settings`: fetched from support.google.com; live Gmail Help page with current client settings. Checked 2026-11-12.

## Limit overrides

None in a re-check (the overrides are the full check's).
