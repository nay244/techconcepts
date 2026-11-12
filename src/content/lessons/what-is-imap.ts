import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * IMAP, lesson 11 of How the Internet Works’ 14. Your letters are in your mailbox at mail.example.net as the part
 * starts, and they stay there: its tray is lit throughout (the mockup’s hold0, as the scene’s start). The app logs in
 * over TLS on port 993, opens the inbox, reads Sam’s letter and marks it \Seen on the server, then waits with IDLE
 * until a new letter reaches the server from the internet and the server says so. The internet’s party stands at
 * 198.51.100.88, the address that letter is delivered from, and stands in for the sender’s mail server.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-apps.mjs), changed only where a source
 * does not state them. The addresses (RFC 1918 and RFC 5737), the client's own port, the two letters' sizes (4.2 KB for
 * Sam's, whose literal {4203} is the same number, and 1.2 MB for Jo's with photos), the names and subjects, and the
 * times in the log are example data, and the scene's events carry them beside the claims they trace to. No other
 * message size is shown: no source states one. The analogy (the post office box and the filing cabinet) cites nothing.
 * No source places IMAP at an OSI layer, so the badge spans. The page on the laptop's screen is words, because the
 * letter the story fetches is words and the letter with photos is only listed.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 9051 defines IMAP4rev2, so its citations are the defining standard. */
const imap = (section: string) => rfc('rfc-9051', section, true);
/** RFC 8314 defines Implicit TLS for mail access, RFC 9293 TCP, RFC 9846 TLS 1.3, RFC 6066 the server name extension. */
const tls = (section: string) => rfc('rfc-8314', section, true);

const IMAP_ABSTRACT = cite('rfc-9051', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc9051.html#abstract', defining: true });
const IMAP_CHANGES = cite('rfc-9051', 'Appendix E', { url: 'https://www.rfc-editor.org/rfc/rfc9051.html#appendix-E', defining: true });

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const MS_IMAPPOP_URL = 'https://support.microsoft.com/en-us/outlook/what-are-imap-and-pop';
const MS_IMAPPOP = vendor('microsoft-imap-pop', MS_IMAPPOP_URL, 'What are IMAP and POP?', 'IMAP%20is%20the%20recommended%20method');

const MS_EXCHANGE_URL = 'https://learn.microsoft.com/en-us/exchange/clients/pop3-and-imap4/pop3-and-imap4';
const MS_EXCHANGE_STAYS = vendor(
  'microsoft-exchange-pop-imap',
  MS_EXCHANGE_URL,
  'Overview of POP3 and IMAP4 functionality',
  'By%20default%2C%20copies%20of%20downloaded%20messages%20remain%20on%20the%20email%20server',
);
const MS_EXCHANGE_SENT = vendor(
  'microsoft-exchange-pop-imap',
  MS_EXCHANGE_URL,
  'Overview of POP3 and IMAP4 functionality',
  'Can%20synchronize%20messages%20from%20multiple%20folders',
);
const MS_EXCHANGE_FOLDER = vendor(
  'microsoft-exchange-pop-imap',
  MS_EXCHANGE_URL,
  'Overview of POP3 and IMAP4 functionality',
  'Can%20only%20download%20messages%20from%20a%20single%20folder',
);
const MS_EXCHANGE_IDLE = vendor(
  'microsoft-exchange-pop-imap',
  MS_EXCHANGE_URL,
  'POP3 and IMAP4 applications and settings',
  'If%20the%20application%20and%20server%20both%20support%20the%20IMAP4%20IDLE%20command',
);

const MS_OUTLOOK = vendor(
  'microsoft-outlook-com-settings',
  'https://support.microsoft.com/en-us/outlook/pop-imap-and-smtp-settings-for-outlook-com',
  'POP, IMAP, and SMTP settings for Outlook.com',
  'Outlook.com%20requires%20the%20use%20of%20Modern%20Auth',
);
const GOOGLE_OAUTH = vendor(
  'google-lsa-oauth',
  'https://knowledge.workspace.google.com/admin/sync/transition-from-less-secure-apps-to-oauth',
  'Transition from less secure apps to OAuth',
  'CalDAV%2C%20CardDAV%2C%20IMAP%2C%20SMTP%2C%20and%20POP%20will%20no%20longer%20work',
);
const GOOGLE_SENT = vendor(
  'google-gmail-imap-settings',
  'https://support.google.com/mail/answer/78892',
  'Sending',
  'Sent%20messages%20are%20automatically%20copied',
);
const GOOGLE_STORAGE = vendor(
  'google-storage',
  'https://support.google.com/googleone/answer/9312312',
  'What counts towards your storage quota',
  'Gmail%20messages%20and%20attachments',
);

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50972';
const MAIL = '203.0.113.70:993';

const inbox: TableDef = {
  id: 'inbox',
  title: 'Your inbox, on the server',
  by: 'the same from every device',
  columns: [
    { key: 'number', label: '#' },
    { key: 'from', label: 'From', prose: true },
    { key: 'subject', label: 'Subject', prose: true },
    { key: 'flags', label: 'Flags', prose: true },
  ],
  keyColumn: 'number',
  initialRows: [],
  empty: 'Not opened yet. The app hasn’t looked in the inbox.',
};

const mockup = messagesFor(inbox);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-imap',
  title: 'IMAP',
  subtitle: 'Email kept in sync',
  level: 'beginner',
  certTags: [],
  summary:
    'IMAP leaves your mail on the server and lets every device look at the same mailbox. Read a message on your phone and it shows as read on your laptop too.',
  figure: 'net-map',
  backing: {
    traces: ['term-imap', 'fact-stays', 'why-2', 'fact-seen'],
  },
  units: [
    {
      id: 'imap',
      name: 'IMAP',
      fullName: 'Internet Message Access Protocol',
      purpose: 'Email kept in sync',
      group: 'app',
      osi: 'spans',
      backing: { traces: ['term-imap', 'fact-stays'] },
      scene: {
        title: 'Your mail stays on the server, in sync',
        views: ['network', 'sequence'],
        layers: ['imap:mail'],
        labels: { laptop: 'Checking mail', url: 'Mail' },
        start: [{ cue: 'tray', arg: 'mail on' }],
        panel: { type: 'table', table: inbox },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'mail', label: 'Your mailbox', addr: '203.0.113.70' },
          { place: 'c', label: 'The internet', addr: '198.51.100.88' },
        ],
        backing: {
          traces: ['term-imap', 'term-folders', 'fact-stays', 'fact-delivery', 'why-2', 'fact-seen'],
        },
      },
      overview: {
        hook: 'IMAP leaves your mail on the server and lets every device look at the same mailbox. Read a message on your phone and it shows as read on your laptop too.',
        hookBacking: {
          traces: ['term-imap', 'fact-stays', 'why-2', 'fact-seen'],
        },
        description:
          'POP3 is like emptying a post office box and carrying everything home. IMAP is like a filing cabinet kept at the post office that you can look into from anywhere: your letters stay in their folders, and any note you make on one, such as “read”, is there for every visit. Here your mail app opens your inbox at mail.example.net.',
        backing: { analogy: true },
        facts: [
          {
            label: 'Used for',
            value: 'reading mail that stays on the server',
            backing: { traces: ['term-imap', 'fact-stays'] },
          },
          {
            label: 'Ports',
            value: '143, or 993 with TLS',
            backing: { traces: ['fact-ports'] },
          },
          {
            label: 'Keeps',
            value: 'folders and read marks on the server',
            backing: { traces: ['term-folders', 'term-flag', 'fact-seen'] },
          },
          {
            label: 'New mail',
            value: 'IDLE: the server says when it arrives',
            backing: { traces: ['term-idle', 'fact-idle'] },
          },
          {
            label: 'This example',
            value: 'your inbox at mail.example.net',
            backing: { example: true },
          },
        ],
      },
      steps: [
        {
          id: 'tls-connection',
          title: 'TLS Connection',
          sub: 'Connect safely',
          narrative:
            'Your mail app connects to your mailbox at mail.example.net, this time with IMAP, on port **993**: IMAP with the seal on from the start. The same TCP hello, the same TLS seal. This time the letters will stay where they are, on the server.',
          deep: [
            {
              text: 'IMAP uses port 143 in plain text, upgradable with STARTTLS, or 993 with TLS from the start (implicit TLS).',
              cite: [imap('2.1'), imap('6.2.1'), tls('2'), tls('3'), tls('3.2')],
            },
            {
              text: 'An app can keep its IMAP connection open while it runs, so the server can tell it about new mail at once (IDLE).',
              cite: [imap('6.3.13')],
            },
          ],
          facts: [
            {
              label: 'To',
              value: 'mail.example.net, 203.0.113.70',
              backing: { example: true },
            },
            {
              label: 'Port',
              value: '993: TLS from the start',
              backing: { traces: ['fact-ports', 'fact-rides'] },
            },
            {
              label: 'Plain version',
              value: 'port 143',
              backing: { traces: ['fact-ports'] },
            },
            {
              label: 'Mail stays',
              value: 'on the server',
              backing: { traces: ['fact-stays'] },
            },
          ],
          events: [
            ...msgOf('fact-rides', 'fact-ports', 'term-imap')({
              tag: 'SYN',
              from: 'laptop',
              to: 'mail',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.000s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Hello, can we talk?',
              info: 'SYN',
            }),
            ...msgOf('fact-rides', 'fact-ports', 'term-imap')({
              tag: 'SYN-ACK',
              from: 'mail',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '0.028s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes, I hear you.',
              info: 'SYN-ACK',
            }),
            ...msgOf('fact-rides', 'fact-ports', 'term-imap')({
              tag: 'ACK',
              from: 'laptop',
              to: 'mail',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.028s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Connected.',
              info: 'ACK',
              st: 'Connecting',
              conn: ['open', 'laptop>mail'],
            }),
            ...msgOf('fact-rides', 'fact-tls', 'fact-ports')({
              tag: 'TLS HELLO',
              from: 'laptop',
              to: 'mail',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.029s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Let’s seal this line. Here’s what I can do.',
              info: 'TLS ClientHello, SNI mail.example.net',
            }),
            ...msgOf('fact-rides', 'fact-tls', 'fact-ports')({
              tag: 'TLS HELLO',
              from: 'mail',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.061s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'Agreed. Here’s my certificate, to prove I’m mail.example.net.',
              info: 'TLS ServerHello, certificate, finished',
              st: 'Connected, sealed',
              known: true,
              conn: ['seal', 'laptop>mail'],
            }),
          ],
          backing: {
            traces: ['fact-ports', 'fact-rides', 'fact-tls', 'term-imap', 'fact-stays'],
          },
        },
        {
          id: 'authentication',
          title: 'Authentication',
          sub: 'Log in',
          narrative:
            'The server greets you with *** OK**. Your app logs in with **LOGIN**, your name and password, inside the seal. Notice the short label at the start of the command, a1. That’s a **tag**. IMAP lets an app send several commands at once, and each command’s final reply comes back with the matching tag, so the app knows which answer is which.',
          deep: [
            {
              text: 'Replies starting with * are untagged: extra information on the way.',
              cite: [imap('2.2.2')],
            },
            {
              text: 'The final reply carries the command’s tag and OK, NO or BAD.',
              cite: [imap('2.2.2')],
            },
            {
              text: 'AUTHENTICATE with a SASL mechanism (PLAIN, or one that carries an OAuth sign-in token) is often used instead of LOGIN, and CAPABILITY lists what the server supports.',
              cite: [imap('6.2.2'), imap('6.1.1'), MS_OUTLOOK, GOOGLE_OAUTH],
            },
          ],
          facts: [
            {
              label: 'Greeting',
              value: '* OK IMAP4rev2 ready',
              backing: { traces: ['fact-replies'] },
            },
            {
              label: 'Log in',
              value: 'a1 LOGIN alex@example.net ••••••',
              backing: { traces: ['fact-login', 'term-tag'] },
            },
            {
              label: 'Reply',
              value: 'a1 OK',
              backing: { traces: ['fact-replies', 'term-tag'] },
            },
            {
              label: 'Tags',
              value: 'match each command’s final reply to it',
              backing: { traces: ['term-tag', 'fact-replies'] },
            },
          ],
          events: [
            ...msgOf('fact-replies', 'fact-rides', 'term-imap')({
              tag: '* OK',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              time: '0.090s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '* OK: ready when you are.',
              info: '* OK IMAP4rev2 server ready',
            }),
            ...msgOf('fact-login', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'LOGIN',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              time: '0.091s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'a1: log me in as alex@example.net, with my password.',
              info: 'a1 LOGIN alex@example.net (password, inside TLS)',
            }),
            ...msgOf('fact-replies', 'fact-login', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'a1 OK',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.152s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'a1 OK: you’re logged in.',
              info: 'a1 OK LOGIN completed',
              st: 'Logged in',
              known: true,
            }),
          ],
          backing: {
            traces: ['fact-replies', 'fact-login', 'term-tag', 'pattern'],
          },
        },
        {
          id: 'folder-selection',
          title: 'Folder Selection',
          sub: 'Open a folder',
          narrative:
            'Unlike POP3, IMAP knows about **folders**: Inbox, Sent, Archive and any you make. Your app opens the inbox with **SELECT INBOX**. The server answers: 2 letters. Then the app asks for the headers, who each is from and what it’s about, to show the list. The letters themselves stay on the server.',
          deep: [
            {
              text: 'SELECT also returns the folder’s flags and its UIDVALIDITY.',
              cite: [imap('6.3.2')],
            },
            {
              text: 'Every message has a UID that doesn’t change, so apps can sync efficiently.',
              cite: [imap('2.3.1.1')],
            },
            {
              text: 'LIST shows the folders, and EXAMINE opens one read-only.',
              cite: [imap('6.3.9'), imap('6.3.3')],
            },
            {
              text: 'Standard flags are \\Seen, \\Answered, \\Flagged, \\Deleted and \\Draft.',
              cite: [imap('2.3.2')],
            },
          ],
          facts: [
            {
              label: 'Command',
              value: 'a2 SELECT INBOX',
              backing: { traces: ['term-select', 'term-tag', 'term-folders'] },
            },
            {
              label: 'Answer',
              value: '2 letters (* 2 EXISTS)',
              backing: { traces: ['fact-exists'] },
            },
            {
              label: 'Then',
              value: 'a3 FETCH 1:2 (FLAGS ENVELOPE)',
              backing: { traces: ['term-fetch', 'fact-fetch', 'term-tag'] },
            },
            {
              label: 'Folders',
              value: 'Inbox, Sent, Archive, your own',
              backing: { traces: ['term-folders'] },
            },
          ],
          events: [
            ...msgOf('term-select', 'term-tag', 'term-folders', 'fact-rides', 'term-imap')({
              tag: 'SELECT',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              time: '0.153s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'a2: open the inbox.',
              info: 'a2 SELECT INBOX',
            }),
            ...msgOf('fact-exists', 'fact-replies', 'term-select', 'term-tag', 'fact-rides', 'term-imap')({
              tag: '2 EXISTS',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              time: '0.181s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '* 2 EXISTS: 2 letters in the inbox.',
              info: '* 2 EXISTS, a2 OK',
            }),
            ...msgOf('term-fetch', 'fact-fetch', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'FETCH 1:2',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.182s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'a3: for letters 1 and 2, who from, the subject, and the flags.',
              info: 'a3 FETCH 1:2 (FLAGS ENVELOPE)',
            }),
            ...msgOf('fact-fetch', 'fact-seen', 'fact-exists', 'fact-replies', 'term-flag', 'term-fetch', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'HEADERS',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              time: '0.214s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'Letter 1 from news@example.com, read. Letter 2 from sam@example.org, unread.',
              info: '* 1 FETCH, * 2 FETCH, a3 OK',
              st: '2 letters, 1 unread',
              known: true,
              rows: [
                { key: 'm1', cells: ['1', 'news@example.com', 'This week’s tips', '\\Seen'] },
                { key: 'm2', cells: ['2', 'sam@example.org', 'Re: Saturday?', 'unread'] },
              ],
            }),
          ],
          backing: {
            traces: ['term-folders', 'term-select', 'fact-exists', 'term-fetch', 'fact-fetch', 'fact-seen', 'fact-replies', 'fact-stays'],
          },
        },
        {
          id: 'fetch-and-flag',
          title: 'Fetch and Flag',
          sub: 'Read one, mark it read',
          narrative:
            'You click Sam’s letter. The app fetches it with **FETCH** and shows it on your screen, but nothing is moved or deleted: the server still has it. Then the app sets a **flag** on the server, **\\Seen**, meaning read. Because the mark is on the server, your phone will show the letter as read too.',
          deep: [
            {
              text: 'BODY.PEEK[] fetches a message without setting \\Seen; BODY[] sets it automatically.',
              cite: [imap('6.4.5')],
            },
            {
              text: 'STORE changes flags: +FLAGS adds one, -FLAGS removes one.',
              cite: [imap('6.4.6')],
            },
            {
              text: 'Deleting takes two steps: set \\Deleted, then EXPUNGE.',
              cite: [imap('2.3.2'), imap('6.4.3')],
            },
            {
              text: 'Moving to another folder is MOVE.',
              cite: [imap('6.4.8')],
            },
          ],
          facts: [
            {
              label: 'Fetch',
              value: 'a4 FETCH 2 BODY.PEEK[]',
              backing: { traces: ['term-fetch', 'fact-fetch', 'term-tag'] },
            },
            {
              label: 'Mark read',
              value: 'a5 STORE 2 +FLAGS (\\Seen)',
              backing: { traces: ['term-store', 'fact-seen', 'term-tag'] },
            },
            {
              label: 'The letter',
              value: 'stays on the server',
              backing: { traces: ['fact-stays'] },
            },
            {
              label: 'Other devices',
              value: 'see it as read',
              backing: { traces: ['why-2', 'fact-seen'] },
            },
          ],
          events: [
            ...msgOf('term-fetch', 'fact-fetch', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'FETCH 2',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              time: '4.210s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'a4: send me letter 2, the whole thing.',
              info: 'a4 FETCH 2 BODY.PEEK[]',
            }),
            ...msgOf('fact-fetch', 'fact-replies', 'term-fetch', 'term-tag', 'fact-stays', 'fact-rides', 'term-imap')({
              tag: 'LETTER',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              time: '4.247s',
              src: MAIL,
              dst: LAPTOP,
              size: '4.2 KB',
              sum: 'Here’s letter 2: “Re: Saturday?”, from sam@example.org.',
              info: '* 2 FETCH BODY[] {4203}, a4 OK',
              st: 'Reading Sam’s letter',
              known: true,
              page: 'text',
            }),
            ...msgOf('term-store', 'fact-seen', 'term-flag', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'STORE \\SEEN',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              time: '4.248s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'a5: mark letter 2 as read.',
              info: 'a5 STORE 2 +FLAGS (\\Seen)',
            }),
            ...msgOf('fact-seen', 'fact-replies', 'term-flag', 'why-2', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'a5 OK',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '4.276s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'a5 OK: letter 2 is marked read, here on the server.',
              info: '* 2 FETCH (FLAGS (\\Seen)), a5 OK',
              st: 'Marked read on the server',
              known: true,
              rows: [{ key: 'm2', cells: ['2', 'sam@example.org', 'Re: Saturday?', '\\Seen'] }],
            }),
          ],
          backing: {
            traces: ['term-fetch', 'fact-fetch', 'term-store', 'fact-seen', 'term-flag', 'why-2', 'fact-stays'],
          },
        },
        {
          id: 'idle-push',
          title: 'IDLE Push',
          sub: 'Wait for new mail',
          narrative:
            'Instead of asking “anything new?” every few minutes, your app sends **IDLE**: “tell me when something changes.” The line stays open and quiet. When a new letter reaches the server, the server tells your app straight away: “* 3 EXISTS”, there are now 3. Your app ends the wait with DONE and fetches the new letter’s headers. That’s **push**: new mail shows up within seconds.',
          deep: [
            {
              text: 'A server may log off a quiet app after 30 minutes or more, so apps restart IDLE at least every 29 minutes.',
              cite: [imap('6.3.13'), imap('5.4')],
            },
            {
              text: 'IDLE watches one folder per connection.',
              cite: [imap('6.3.13'), imap('6.3.2')],
            },
          ],
          facts: [
            {
              label: 'Command',
              value: 'a6 IDLE',
              backing: { traces: ['term-idle', 'fact-idle', 'term-tag'] },
            },
            {
              label: 'Server says',
              value: '* 3 EXISTS',
              backing: { traces: ['fact-idle', 'fact-exists'] },
            },
            {
              label: 'Then',
              value: 'DONE, then a7 FETCH 3',
              backing: { traces: ['fact-idle', 'fact-fetch', 'term-tag'] },
            },
            {
              label: 'Restarted',
              value: 'about every 29 minutes',
              backing: { traces: ['fact-idle'] },
            },
          ],
          events: [
            ...msgOf('term-idle', 'fact-idle', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'IDLE',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              time: '4.300s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'a6: tell me when something changes.',
              info: 'a6 IDLE',
            }),
            ...msgOf('fact-idle', 'term-idle', 'fact-rides', 'term-imap')({
              tag: '+ IDLING',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '4.328s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'OK, I’ll tell you.',
              info: '+ idling',
              st: 'Waiting for new mail',
              known: true,
            }),
            ...msgOf('fact-delivery')({
              tag: 'SMTP',
              from: 'c',
              to: 'mail',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '62.4s',
              src: '198.51.100.88:43211',
              dst: '203.0.113.70:25',
              size: '1.2 MB',
              sum: 'Meanwhile a new letter reaches the server, from jo@example.org.',
              info: 'SMTP delivery: new message for alex@example.net',
            }),
            ...msgOf('fact-idle', 'fact-exists', 'term-idle', 'fact-rides', 'term-imap')({
              tag: '3 EXISTS',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              time: '62.5s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '* 3 EXISTS: something changed. There are now 3 letters.',
              info: '* 3 EXISTS',
              st: 'New mail',
            }),
            ...msgOf('fact-idle', 'term-idle', 'fact-rides', 'term-imap')({
              tag: 'DONE',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '62.5s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Done waiting.',
              info: 'DONE',
            }),
            ...msgOf('fact-idle', 'fact-replies', 'term-idle', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'a6 OK',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '62.5s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'a6 OK: stopped waiting.',
              info: 'a6 OK IDLE terminated',
            }),
            ...msgOf('term-fetch', 'fact-fetch', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'FETCH 3',
              from: 'laptop',
              to: 'mail',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '62.5s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'a7: who’s letter 3 from, and what’s it about?',
              info: 'a7 FETCH 3 (FLAGS ENVELOPE)',
            }),
            ...msgOf('fact-fetch', 'fact-seen', 'fact-exists', 'fact-replies', 'term-flag', 'term-fetch', 'term-tag', 'fact-rides', 'term-imap')({
              tag: 'HEADERS',
              from: 'mail',
              to: 'laptop',
              proto: 'IMAP',
              via: 'TCP',
              kind: 'response',
              time: '62.6s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: 'Letter 3 from jo@example.org: “Photos from Saturday”, unread.',
              info: '* 3 FETCH, a7 OK',
              st: '3 letters, 1 unread',
              done: true,
              rows: [{ key: 'm3', cells: ['3', 'jo@example.org', 'Photos from Saturday', 'unread'] }],
            }),
          ],
          backing: {
            traces: ['term-idle', 'fact-idle', 'fact-delivery', 'fact-exists', 'fact-fetch', 'fact-replies', 'fact-seen'],
          },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'IMAP keeps your mailbox on the server and lets your app look into it: open a folder, read a letter, mark it, and hear about new mail the moment it arrives.',
            cite: [IMAP_ABSTRACT, imap('6.3.2'), imap('6.4.5'), imap('6.4.6'), imap('6.3.13')],
          },
        ],
        terms: [
          {
            id: 'term-imap',
            idea: 'Reading mail that stays on the server',
            name: 'IMAP',
            cite: [IMAP_ABSTRACT],
          },
          {
            id: 'term-tag',
            idea: 'The label on each command, matched in its reply',
            name: 'Tag',
            cite: [imap('2.2.1'), imap('2.2.2')],
          },
          {
            id: 'term-folders',
            idea: 'Inbox, Sent, Archive',
            name: 'Folders (mailboxes)',
            cite: [IMAP_ABSTRACT, imap('5.1'), imap('7.3.1')],
          },
          {
            id: 'term-select',
            idea: 'Open a folder',
            name: 'SELECT',
            cite: [imap('6.3.2')],
          },
          {
            id: 'term-fetch',
            idea: 'Get letters, or just their headers',
            name: 'FETCH',
            cite: [imap('6.4.5')],
          },
          {
            id: 'term-flag',
            idea: 'A mark such as read or flagged, kept on the server',
            name: 'Flag',
            cite: [imap('2.3.2')],
          },
          {
            id: 'term-store',
            idea: 'Change a flag',
            name: 'STORE',
            cite: [imap('6.4.6')],
          },
          {
            id: 'term-idle',
            idea: '“Tell me when something changes”',
            name: 'IDLE',
            cite: [imap('6.3.13')],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['LOGIN', 'SELECT', 'FETCH', 'STORE', 'IDLE'],
          note: 'Every IMAP session goes roughly this way, and nothing is deleted unless you ask.',
          cite: [imap('3.1'), imap('3.2'), imap('2.3.2'), imap('6.4.3')],
        },
        why: [
          {
            id: 'why-1',
            text: 'With IMAP, the server holds the one true copy of your mailbox.',
            cite: [IMAP_ABSTRACT, MS_EXCHANGE_STAYS],
          },
          {
            id: 'why-2',
            text: 'Every device shows the same folders, the same letters and the same read marks, and losing your laptop doesn’t lose your mail.',
            cite: [IMAP_ABSTRACT, imap('2.3.2'), MS_EXCHANGE_STAYS, MS_IMAPPOP],
          },
        ],
        deep: [
          {
            id: 'deep-version',
            text: 'IMAP4rev2 (RFC 9051) is the current version.',
            cite: [IMAP_ABSTRACT, IMAP_CHANGES],
          },
          {
            id: 'deep-sync',
            text: 'Apps keep a local copy and sync changes using UIDs and, where the server offers them, CONDSTORE and QRESYNC.',
            cite: [IMAP_ABSTRACT, imap('2.3.1.1'), rfc('rfc-7162', '1', true)],
          },
          {
            id: 'deep-sending',
            text: 'Mail is still sent with SMTP; IMAP can keep a copy in your Sent folder.',
            cite: [IMAP_ABSTRACT, imap('7.3.1'), imap('6.3.12'), rfc('rfc-6409', '1'), MS_EXCHANGE_SENT, GOOGLE_SENT],
          },
          {
            id: 'deep-storage',
            text: 'Because it stays on the server, your mail counts against your storage there.',
            cite: [rfc('rfc-9208', '5.1', true), GOOGLE_STORAGE],
          },
        ],
        facts: [
          {
            id: 'fact-ports',
            label: 'Ports',
            value: '143, 993 with TLS',
            cite: [imap('2.1'), tls('3.2'), IANA_PORTS],
          },
          {
            id: 'fact-commands',
            label: 'Commands',
            value: 'LOGIN, SELECT, FETCH, STORE, SEARCH, IDLE',
            cite: [imap('6.2.3'), imap('6.3.2'), imap('6.4.5'), imap('6.4.6'), imap('6.4.4'), imap('6.3.13')],
          },
          {
            id: 'fact-stays',
            label: 'Mail stays',
            value: 'on the server',
            cite: [IMAP_ABSTRACT, MS_EXCHANGE_STAYS],
          },
          {
            id: 'fact-versus',
            label: 'Versus POP3',
            value: 'many devices, one mailbox; POP3 reads one folder, usually the inbox',
            cite: [IMAP_ABSTRACT, imap('5.2'), rfc('rfc-1939', '1', true), MS_IMAPPOP, MS_EXCHANGE_FOLDER],
          },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 9051',
            cite: [IMAP_ABSTRACT],
          },
          {
            id: 'fact-rides',
            label: 'Rides on',
            value:
              'TCP, opened with the three-way handshake (SYN, SYN-ACK, ACK); on port 993 TLS seals the line first, and every IMAP message then travels inside TLS on that TCP connection',
            cite: [imap('2.1'), rfc('rfc-9293', '3.5', true), tls('3.2')],
          },
          {
            id: 'fact-tls',
            label: 'Sealing the line',
            value:
              'the app’s ClientHello names the server (SNI); the server answers with its ServerHello, its certificate and Finished, and the app checks the certificate is for that name',
            cite: [tls('3.2'), rfc('rfc-9846', '2', true), rfc('rfc-6066', '3', true), imap('11.1')],
          },
          {
            id: 'fact-replies',
            label: 'Replies',
            value: 'lines starting * are untagged, like the greeting * OK; the final one carries the command’s tag and OK, NO or BAD',
            cite: [imap('2.2.2'), imap('7.1.1')],
          },
          {
            id: 'fact-login',
            label: 'Logging in',
            value: 'LOGIN sends your name and password, so it is used only inside TLS; AUTHENTICATE is the other way',
            cite: [imap('6.2.3'), imap('6.2.2'), tls('3.2')],
          },
          {
            id: 'fact-exists',
            label: 'EXISTS',
            value: 'how many letters the open folder holds: sent after SELECT, and again when new mail arrives',
            cite: [imap('7.4.1'), imap('6.3.2')],
          },
          {
            id: 'fact-fetch',
            label: 'FETCH can ask for',
            value:
              'FLAGS; ENVELOPE (who it’s from, the subject); BODY.PEEK[], the whole letter without marking it read, which comes back as BODY[] with its length in braces',
            cite: [imap('6.4.5'), imap('7.5.2'), imap('4.3')],
          },
          {
            id: 'fact-seen',
            label: 'Read mark',
            value: 'the \\Seen flag; STORE +FLAGS (\\Seen) adds it, and the server answers with the letter’s new flags',
            cite: [imap('2.3.2'), imap('6.4.6')],
          },
          {
            id: 'fact-idle',
            label: 'While idling',
            value:
              'the server answers +, sends news such as * 3 EXISTS, and stops when the app sends DONE; apps restart IDLE at least every 29 minutes',
            cite: [imap('6.3.13'), imap('7.6')],
          },
          {
            id: 'fact-delivery',
            label: 'New mail arrives by',
            value: 'SMTP over TCP, on port 25, from other mail servers; the server puts it in your mailbox for IMAP to read',
            cite: [rfc('rfc-5321', '2.3.10', true), rfc('rfc-5321', '4.5.4.2', true), imap('5.2'), IANA_PORTS],
          },
        ],
      },
      practice: [
        {
          id: 'phone-shows',
          prompt: 'You read a letter on your laptop with IMAP. What does your phone show?',
          options: [
            {
              text: 'The same letter, marked read.',
              feedback: 'Right. The \\Seen flag is on the server, so every device sees it.',
              cite: [imap('2.3.2')],
            },
            {
              text: 'Nothing: the letter was downloaded and deleted.',
              feedback: 'Not quite. That’s POP3. IMAP leaves the letter on the server.',
              cite: [rfc('rfc-1939', '1', true), IMAP_ABSTRACT, MS_EXCHANGE_STAYS],
            },
            {
              text: 'The letter, still unread.',
              feedback: 'Not quite. The read mark is kept on the server, so the phone sees it too.',
              cite: [imap('2.3.2')],
            },
          ],
          answer: 0,
        },
        {
          id: 'idle',
          prompt: 'What does IDLE do?',
          options: [
            {
              text: 'Closes the connection to save power.',
              feedback: 'Not quite. The connection stays open. IDLE asks the server to speak up when something changes.',
              cite: [imap('6.3.13')],
            },
            {
              text: 'Asks the server to say as soon as something changes.',
              feedback: 'Yes. That’s how new mail appears within seconds.',
              cite: [imap('6.3.13'), MS_EXCHANGE_IDLE],
            },
            {
              text: 'Deletes letters you haven’t opened.',
              feedback: 'Not quite. IMAP never deletes unless your app asks, with \\Deleted and EXPUNGE.',
              cite: [imap('6.4.3'), imap('2.3.2')],
            },
          ],
          answer: 1,
        },
      ],
    },
  ],
});
