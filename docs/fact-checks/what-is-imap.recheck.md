```json fact-check
{
  "slug": "what-is-imap",
  "base": "0d8f485b47261e288491d447d2380315b52219aa3886d8176cb3516dd83d6d36",
  "hash": "48b72c4d5b1f8da1adcc4d62f5c8f7dd1aa007f59f7f0c1610eb7a153df454cf",
  "checked": "2026-11-12",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].backing (the unit's full name and purpose)": "⚠️",
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
    "count": 5,
    "digest": "e80e2b2ceed9f0a622d6604ae551ed0f7b8a2b267c81986e80b3c27e28083058",
    "files": {
      "rfc-9051": "acf52a50eb748ea21b5ffdcb31c761d3fbba6242d53d4f53c2555de039c5c3cf",
      "microsoft-exchange-pop-imap": "9ea29704c654dca09cba291f3cc52fd7cdba3a42163375eb3fad99ad62ca1e3a",
      "google-gmail-imap-settings": "52f52c2acbce4198eada02c46cc7aa1c695819cf7f2ea26492ebd3eccb09ec19",
      "rfc-5550": "6576fe340607aac2af38424c4d2a114dd744b9ae3d1e03d3288f0c4888cd6b51"
    }
  }
}
```

# Fact-check re-check: what-is-imap

Targeted re-check of the nine items the re-check sheet lists. Everything else on the lesson is outside this report.

## Claims

### units[0].learn.facts[14] ("fact-name") — ✅

Stands for: Internet Message Access Protocol.

- `rfc-9051` §Abstract
  > The Internet Message Access Protocol Version 4rev2 (IMAP4rev2) allows
  > a client to access and manipulate electronic mail messages on a
  > server.
- Note: RFC 9051 is the document that defines IMAP4rev2, the current version of the protocol, and so defines its name; the abstract spells the name out in full. The lesson's label leaves off the version number, which is the ordinary way to name the protocol.
- Note: RFC 9051 is a Proposed Standard on the Standards Track; the RFC Editor lists it as neither obsoleted nor updated (checked 2026-11-12).

### units[0].learn.facts[15] ("fact-push") — ✅

Push, not polling: without IDLE an app polls, asking the server for new mail every few minutes; with IDLE the server pushes news to the app as it happens.

- `rfc-9051` §6.3.13
  > Without the IDLE command, a client would need to poll the server for
  > changes to the selected mailbox (new mail, deletions, and flag
  > changes).  It's often more desirable to have the server transmit
  > updates to the client in real time.
- `microsoft-exchange-pop-imap` §POP3 and IMAP4 applications and settings
  > The application connects to the email server periodically to send messages and to download any new messages.
- `google-gmail-imap-settings` §Choose your IMAP email client settings for Gmail
  > Check for new messages every 10 minutes.
- `rfc-5550` §5.4.2
  > Lemonade and TCP provide for long-lived idle connections between the
  > client and mail store, allowing the server to push notifications
  > within IMAP.
- Note: RFC 9051 defines the IDLE command and states both halves of the claim: without IDLE the client polls, and with it the server sends updates in real time. RFC 5550 is a second standard that names this server push.
- Note: the interval "every few minutes" is not in RFC 9051; it is confirmed by two independent vendor pages (Microsoft's Exchange page describes mail apps checking on a set number of minutes, and Google's Gmail page has Thunderbird check every 10 minutes).
- Note: true for a beginner. It leaves out that an app may also check only when opened or by hand, and other push mechanisms such as NOTIFY; polling on a timer is the ordinary case without IDLE.
- Note: RFC 9051 and RFC 5550 are not obsoleted (RFC Editor, 2026-11-12); the Microsoft and Google pages are live and describe current products (Exchange Server 2016 and 2019; Gmail with Thunderbird).

## Traced, example and analogy parts, and unbacked items

### units[0].backing (the unit's full name and purpose) — ⚠️

- Note: the full name traces to fact-name. The purpose, that IMAP keeps email in sync, is not stated by any part on its Traces line: term-imap and fact-stays say only that mail stays on the server, and fact-name gives the name. The lesson teaches syncing elsewhere (why-2's same folders, letters and read marks on every device; deep-sync), so adding why-2 (or deep-sync) to this item's traces, or rewording the purpose to what its traces say, would fix it.

### units[0].overview.facts[2] (Overview fact "Keeps") — ✅

- Note: folders trace to term-folders and lead-1 (the mailbox kept on the server); read marks kept on the server trace to term-flag and fact-seen. In its place between "Ports" and "New mail", the Overview list still reads true and in order.

### units[0].steps[4] (step "idle-push") — ✅

- Note: each statement traces. Polling every few minutes and push come from fact-push; IDLE's meaning from term-idle; the new letter reaching the server from fact-delivery; the * 3 EXISTS news and ending with DONE from fact-idle; EXISTS as the folder's count from fact-exists; fetching the new letter's header details from fact-fetch (ENVELOPE). "Within seconds" says loosely what lead-1 and fact-push say (the moment it arrives, as it happens). As the last step after Fetch and Flag, and following step 2's two letters, the count of 3 is consistent.

### title — ✅

### units[0].name — ✅

### units[0].practice[0].prompt (question "phone-shows") — ✅

- Note: no false premise; reading on one device with IMAP is what the lesson teaches.

### units[0].practice[1].prompt (question "idle") — ✅

## Sources

- `rfc-9051`: fetched from rfc-editor.org as plain text; the RFC Editor's record lists it as a Proposed Standard, obsoleting RFC 3501, with no obsoleting or updating RFC. Current. Checked 2026-11-12.
- `rfc-5550`: fetched from rfc-editor.org as plain text; the RFC Editor's record lists it as a Proposed Standard, obsoleting RFC 4550, with no obsoleting or updating RFC. Current. Checked 2026-11-12.
- `microsoft-exchange-pop-imap`: fetched from learn.microsoft.com; live, Microsoft's own documentation for POP3 and IMAP4 in current Exchange Server. Current. Checked 2026-11-12.
- `google-gmail-imap-settings`: fetched from support.google.com; live, Google's own help page for Gmail's IMAP client settings. Current. Checked 2026-11-12.

## Limit overrides

Not part of a re-check; the full check's overrides stand.
