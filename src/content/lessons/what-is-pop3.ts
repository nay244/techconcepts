import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * POP3, lesson 10 of How the Internet Works’ 14. Two letters are waiting in your mailbox at mail.example.net as
 * the part starts, so its tray is lit from the Overview on (the mockup’s hold0, as the scene’s start). Your mail app
 * connects over TLS on port 995, logs in, counts and lists the letters, downloads both and marks them for deleting.
 * At QUIT the server deletes them, the tray goes dark, and the letters live only on the laptop.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-apps.mjs), changed only where a source
 * does not state them. RFC 1939 defines POP3, so its citations are marked as the defining standard, as are the
 * other RFCs for what each one defines; no vendor page is. The addresses (RFC 1918 and RFC 5737), the laptop’s port,
 * the login name, the two letters and their sizes, and the clock times are example data. No other message size is
 * shown: no source states one. The post office box (Overview description) is an analogy and cites nothing. No source
 * places POP3 at an OSI layer, so the badge spans.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 1939 defines POP3, so its citations are the defining standard. */
const pop = (section: string) => rfc('rfc-1939', section, true);

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

const abstractOf = (source: string, number: string, defining = false) =>
  cite(source, 'Abstract', { url: `https://www.rfc-editor.org/rfc/rfc${number}.html#abstract`, ...(defining ? { defining: true as const } : {}) });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const MS_IMAP_POP_URL = 'https://support.microsoft.com/en-us/outlook/what-are-imap-and-pop';
const msImapPop = (section: string, text: string) => vendor('microsoft-imap-pop', MS_IMAP_POP_URL, section, text);
const MS_POP_DELETES = msImapPop('POP', 'POP%20works%20by%20contacting');
const MS_POP_DEVICE = msImapPop('POP', 'If%20you%20try%20to%20access%20your%20email%20from%20a%20different%20device');
const MS_SEVERAL = msImapPop('What are IMAP and POP?', 'IMAP%20is%20the%20recommended%20method');

const GMAIL_POP_URL = 'https://support.google.com/mail/answer/7104828';
const GMAIL_STEP_1 = 'Step 1: Make sure POP is the best way to read your emails';
const GMAIL_SINGLE = vendor('google-gmail-pop', GMAIL_POP_URL, GMAIL_STEP_1, 'POP%20can%20only%20be%20used%20for%20a%20single%20computer');
const GMAIL_MULTIPLE = vendor('google-gmail-pop', GMAIL_POP_URL, GMAIL_STEP_1, 'IMAP%20can%20be%20used%20across%20multiple%20devices');
const GMAIL_LEAVE = vendor('google-gmail-pop', GMAIL_POP_URL, 'Step 2: Change your POP settings', 'Leave%20a%20copy%20of%20messages%20on%20the%20server');

const OUTLOOK_URL = 'https://support.microsoft.com/en-us/outlook/pop-imap-and-smtp-settings-for-outlook-com';
const OUTLOOK_HEADING = 'POP, IMAP, and SMTP settings for Outlook.com';
const OUTLOOK_OAUTH = vendor('microsoft-outlook-com-settings', OUTLOOK_URL, OUTLOOK_HEADING, 'Outlook.com%20requires%20the%20use%20of%20Modern%20Auth');
const OUTLOOK_APP_PASSWORD = vendor('microsoft-outlook-com-settings', OUTLOOK_URL, OUTLOOK_HEADING, 'you%20may%20need%20an%20app%20password');

const GOOGLE_OAUTH_URL = 'https://knowledge.workspace.google.com/admin/sync/transition-from-less-secure-apps-to-oauth';
const GOOGLE_OAUTH_KEY = vendor('google-lsa-oauth', GOOGLE_OAUTH_URL, 'What you need to do', 'OAuth%20allows%20apps%20to%20access%20accounts');
const GOOGLE_OAUTH_NO_PASSWORD = vendor('google-lsa-oauth', GOOGLE_OAUTH_URL, 'Transition from less secure apps to OAuth', 'You%20will%20no%20longer%20use%20a%20password');
const GOOGLE_OAUTH_POP = vendor('google-lsa-oauth', GOOGLE_OAUTH_URL, 'Timeline for transition', 'will%20no%20longer%20work%20with%20legacy');
const GOOGLE_APP_PASSWORD = vendor(
  'google-app-passwords',
  'https://support.google.com/accounts/answer/185833',
  'Sign in with app passwords',
  'An%20app%20password%20is%20a%2016-digit',
);

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50950';
const MAIL = '203.0.113.70:995';

const mailbox: TableDef = {
  id: 'mailbox',
  title: 'Your mailbox on the server',
  by: 'as POP3 sees it',
  columns: [
    { key: 'letter', label: 'Letter' },
    { key: 'size', label: 'Size' },
    { key: 'status', label: 'Status', prose: true },
  ],
  keyColumn: 'letter',
  initialRows: [],
  empty: 'Not checked yet. The app hasn’t asked what’s there.',
};

const mockup = messagesFor(mailbox);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

/** Every POP3 message after the seal travels inside TLS on port 995, over the TCP connection. */
const INSIDE = ['fact-tls', 'fact-ports'];

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-pop3',
  title: 'POP3',
  subtitle: 'Downloading email',
  level: 'beginner',
  certTags: [],
  summary:
    'POP3 collects your mail the simple way: log in, download everything that’s waiting, and usually delete it from the server. The mail then lives only on the device that collected it.',
  figure: 'net-map',
  backing: { traces: ['term-pop3', 'lead-1', 'pattern', 'fact-device'] },
  units: [
    {
      id: 'pop3',
      name: 'POP3',
      fullName: 'Post Office Protocol, version 3',
      purpose: 'Downloading email',
      group: 'app',
      osi: 'spans',
      backing: { traces: ['term-pop3', 'fact-defined'] },
      scene: {
        title: 'Your mail app empties the mailbox onto your laptop',
        views: ['network', 'sequence'],
        layers: ['pop3:mail'],
        labels: { laptop: 'Checking mail', url: 'Mail' },
        start: [{ cue: 'tray', arg: 'mail on' }],
        panel: { type: 'table', table: mailbox },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'mail', label: 'Your mailbox', addr: '203.0.113.70' },
        ],
        backing: { traces: ['term-pop3', 'lead-1', 'term-stat', 'fact-mailbox', 'fact-ports'] },
      },
      overview: {
        hook: 'POP3 collects your mail the simple way: log in, download everything that’s waiting, and usually delete it from the server. The mail then lives only on the device that collected it.',
        hookBacking: { traces: ['lead-1', 'pattern', 'fact-device'] },
        description:
          'It’s like a post office box. You go to the box, take everything out and carry it home, and the box is empty behind you. If you check the box again from somewhere else, there’s nothing there. Here your mail app collects two letters from your mailbox at mail.example.net.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'downloading mail from your mailbox', backing: { traces: ['term-pop3'] } },
          { label: 'Ports', value: '110, or 995 with TLS', backing: { traces: ['fact-ports'] } },
          { label: 'Commands', value: 'USER, PASS, STAT, RETR, DELE, QUIT', backing: { traces: ['fact-commands'] } },
          { label: 'Mail stays on the server?', value: 'usually not', backing: { traces: ['lead-1', 'pattern'] } },
          { label: 'This example', value: '2 letters at mail.example.net', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'tls-connection',
          title: 'TLS Connection',
          sub: 'Connect safely',
          narrative:
            'Your mail app opens a line to your mailbox at mail.example.net, where two letters are waiting. First the TCP hello, then TLS seals the line, so your password and your mail can’t be read on the way. Port **995** is POP3 with the seal on from the very start.',
          deep: [
            {
              text: 'POP3 uses port 110 in plain text, which can be upgraded with the STLS command, or port 995 with TLS from the start (implicit TLS).',
              cite: [pop('3'), rfc('rfc-2595', '4', true), rfc('rfc-8314', '3'), rfc('rfc-8314', '2', true), rfc('rfc-8314', '3.1', true)],
            },
            {
              text: 'Plain port 110 sends your password readably, so the mail standards tell providers to phase it out.',
              cite: [pop('13'), rfc('rfc-8314', '4', true), rfc('rfc-8314', '4.1', true)],
            },
          ],
          facts: [
            { label: 'To', value: 'mail.example.net, 203.0.113.70', backing: { example: true } },
            { label: 'Port', value: '995: TLS from the start', backing: { traces: ['fact-ports', 'fact-connection'] } },
            { label: 'Plain version', value: 'port 110', backing: { traces: ['fact-ports'] } },
            { label: 'Waiting', value: '2 letters', backing: { example: true } },
          ],
          events: [
            ...msgOf('fact-connection', 'fact-ports')({
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
            ...msgOf('fact-connection', 'fact-ports')({
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
            ...msgOf('fact-connection', 'fact-ports')({
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
            ...msgOf('fact-connection', 'fact-tls', 'fact-ports')({
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
            ...msgOf('fact-connection', 'fact-tls', 'fact-ports')({
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
          backing: { traces: ['term-pop3', 'fact-connection', 'fact-tls', 'fact-ports'] },
        },
        {
          id: 'authentication',
          title: 'Authentication',
          sub: 'Log in',
          narrative:
            'The server greets you with **+OK**. POP3 replies are that simple: +OK when something worked, -ERR when it didn’t. Your app logs in with two commands, **USER** with your name and **PASS** with your password. Both cross inside the seal. “+OK, logged in.”',
          deep: [
            {
              text: 'USER and PASS send the password as it is, so they’re only safe inside TLS.',
              cite: [pop('13'), rfc('rfc-8314', '3.1', true), rfc('rfc-8314', '1', true)],
            },
            {
              text: 'APOP and AUTH (SASL) are alternatives, and big providers often want an app password or a sign-in token (OAuth) instead.',
              cite: [
                pop('4'),
                rfc('rfc-5034', '4', true),
                OUTLOOK_OAUTH,
                OUTLOOK_APP_PASSWORD,
                GOOGLE_OAUTH_KEY,
                GOOGLE_OAUTH_NO_PASSWORD,
                GOOGLE_OAUTH_POP,
                GOOGLE_APP_PASSWORD,
              ],
            },
            {
              text: 'While you’re logged in, the server locks the mailbox so another app can’t change it at the same time.',
              cite: [pop('4')],
            },
          ],
          facts: [
            { label: 'Greeting', value: '+OK POP3 ready', backing: { traces: ['term-status', 'fact-connection'] } },
            { label: 'Log in', value: 'USER alex@example.net, PASS ••••••', backing: { traces: ['term-login'] } },
            { label: 'Replies', value: '+OK or -ERR', backing: { traces: ['term-status'] } },
            { label: 'Mailbox', value: 'locked while you’re in', backing: { traces: ['deep-states'] } },
          ],
          events: [
            ...msgOf('term-status', 'fact-connection', ...INSIDE)({
              tag: '+OK',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              time: '0.090s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: ready when you are.',
              info: '+OK POP3 server ready',
            }),
            ...msgOf('term-login', ...INSIDE)({
              tag: 'USER',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              time: '0.091s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'My name is alex@example.net.',
              info: 'USER alex@example.net',
            }),
            ...msgOf('term-status', 'term-login', ...INSIDE)({
              tag: '+OK',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.120s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: and your password?',
              info: '+OK send PASS',
            }),
            ...msgOf('term-login', ...INSIDE)({
              tag: 'PASS',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              time: '0.121s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'My password, inside the seal.',
              info: 'PASS (password, inside TLS)',
            }),
            ...msgOf('term-status', 'term-login', 'deep-states', ...INSIDE)({
              tag: '+OK',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.168s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: you’re logged in.',
              info: '+OK logged in, mailbox locked',
              st: 'Logged in',
              known: true,
            }),
          ],
          backing: { traces: ['term-status', 'term-login', 'fact-tls', 'fact-connection', 'deep-states'] },
        },
        {
          id: 'mailbox-status',
          title: 'Mailbox Status',
          sub: 'What’s waiting?',
          narrative:
            'Your app asks what’s there with **STAT**: “+OK 2 22528”, two letters, 22 KB in all. Then **LIST** gives each letter’s number and size. To POP3 the mailbox is a simple numbered pile, 1 and 2, with no folders.',
          deep: [
            {
              text: 'UIDL gives each message an ID that stays the same between visits, so an app that leaves mail on the server can skip letters it already has.',
              cite: [pop('7'), pop('8')],
            },
            {
              text: 'TOP fetches a message’s headers and its first few lines.',
              cite: [pop('7')],
            },
            {
              text: 'There are no folders: POP3 only sees the inbox.',
              cite: [pop('8')],
            },
          ],
          facts: [
            { label: 'STAT', value: '+OK 2 22528', backing: { traces: ['term-stat', 'term-status'] } },
            { label: 'LIST', value: '1: 4.1 KB, 2: 18 KB', backing: { traces: ['term-stat'] } },
            { label: 'Folders', value: 'none, only the inbox', backing: { traces: ['fact-mailbox'] } },
            { label: 'IDs', value: 'UIDL', backing: { traces: ['fact-mailbox'] } },
          ],
          events: [
            ...msgOf('term-stat', ...INSIDE)({
              tag: 'STAT',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              time: '0.169s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'How many letters, and how big?',
              info: 'STAT',
            }),
            ...msgOf('term-stat', 'term-status', ...INSIDE)({
              tag: '+OK 2',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              time: '0.198s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: 2 letters, 22 KB in all.',
              info: '+OK 2 22528',
            }),
            ...msgOf('term-stat', ...INSIDE)({
              tag: 'LIST',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.199s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'List them, please.',
              info: 'LIST',
            }),
            ...msgOf('term-stat', 'term-status', 'fact-mailbox', ...INSIDE)({
              tag: '+OK',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.227s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: letter 1 is 4.1 KB, letter 2 is 18 KB.',
              info: '+OK 2 messages: 1 4203, 2 18325',
              st: '2 letters waiting',
              known: true,
              rows: [
                { key: 'm1', cells: ['1', '4.1 KB', 'On the server'] },
                { key: 'm2', cells: ['2', '18 KB', 'On the server'] },
              ],
            }),
          ],
          backing: { traces: ['term-stat', 'term-status', 'fact-mailbox'] },
        },
        {
          id: 'message-retrieval',
          title: 'Message Retrieval',
          sub: 'Download it',
          narrative:
            'Your app downloads each letter with **RETR**, short for retrieve: RETR 1, then RETR 2. Each comes back whole, headers and text, and your app saves it on the laptop. From now on you can read them with no internet at all, because they live on your laptop.',
          deep: [
            {
              text: 'RETR returns the whole message, ending with a line holding a single dot, like SMTP’s DATA.',
              cite: [pop('3'), pop('5'), rfc('rfc-5321', '4.1.1.4', true)],
            },
            {
              text: 'Apps set to “leave a copy on the server” stop here and never delete, using UIDL to remember what they already have.',
              cite: [pop('8'), pop('7'), GMAIL_LEAVE],
            },
          ],
          facts: [
            { label: 'Command', value: 'RETR 1, RETR 2', backing: { traces: ['term-retr'] } },
            { label: 'Comes back', value: 'the whole letter, headers and text', backing: { traces: ['term-retr', 'fact-retr'] } },
            { label: 'Saved', value: 'on the laptop', backing: { traces: ['lead-1', 'fact-device'] } },
            { label: 'Ends with', value: 'a line with just a dot', backing: { traces: ['fact-retr'] } },
          ],
          events: [
            ...msgOf('term-retr', ...INSIDE)({
              tag: 'RETR 1',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              time: '0.228s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Send me letter 1.',
              info: 'RETR 1',
            }),
            ...msgOf('term-retr', 'fact-retr', 'term-status', ...INSIDE)({
              tag: 'LETTER 1',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              time: '0.262s',
              src: MAIL,
              dst: LAPTOP,
              size: '4.1 KB',
              sum: '+OK: here’s letter 1, “Re: Saturday?”, from sam@example.org.',
              info: '+OK 4203 octets, then the message',
              page: 'text',
              rows: [{ key: 'm1', cells: ['1', '4.1 KB', 'Downloaded'] }],
            }),
            ...msgOf('term-retr', ...INSIDE)({
              tag: 'RETR 2',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.263s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Send me letter 2.',
              info: 'RETR 2',
            }),
            ...msgOf('term-retr', 'fact-retr', 'term-status', ...INSIDE)({
              tag: 'LETTER 2',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              time: '0.305s',
              src: MAIL,
              dst: LAPTOP,
              size: '18 KB',
              sum: '+OK: here’s letter 2, a newsletter with a picture inside.',
              info: '+OK 18325 octets, then the message',
              st: '2 letters downloaded',
              known: true,
              page: 'full',
              rows: [{ key: 'm2', cells: ['2', '18 KB', 'Downloaded'] }],
            }),
          ],
          backing: { traces: ['term-retr', 'fact-retr', 'lead-1', 'fact-device', 'why-2'] },
        },
        {
          id: 'delete-and-quit',
          title: 'Delete and Quit',
          sub: 'Delete and leave',
          narrative:
            'Now your app marks both letters for deletion with **DELE** 1 and DELE 2, then says goodbye with **QUIT**. The server deletes them only at QUIT, so a dropped line never loses mail. The mailbox is empty, and your letters exist only on this laptop. Check your mail on your phone and they won’t be there. That’s the big difference from IMAP, next.',
          deep: [
            {
              text: 'DELE only marks a message, and RSET unmarks everything.',
              cite: [pop('5')],
            },
            {
              text: 'The deleting happens in POP3’s update state, after QUIT.',
              cite: [pop('6')],
            },
            {
              text: 'That’s why POP3 suits one device and IMAP suits several.',
              cite: [MS_SEVERAL, GMAIL_MULTIPLE, GMAIL_SINGLE],
            },
          ],
          facts: [
            { label: 'Mark', value: 'DELE 1, DELE 2', backing: { traces: ['term-dele'] } },
            { label: 'Then', value: 'QUIT: deleted for real', backing: { traces: ['term-quit', 'deep-states'] } },
            { label: 'Server now', value: 'empty', backing: { traces: ['term-quit'] } },
            { label: 'Letters live', value: 'only on this laptop', backing: { traces: ['fact-device'] } },
          ],
          events: [
            ...msgOf('term-dele', ...INSIDE)({
              tag: 'DELE 1',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.306s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Mark letter 1 for deleting.',
              info: 'DELE 1',
            }),
            ...msgOf('term-dele', 'term-status', ...INSIDE)({
              tag: '+OK',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.334s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: letter 1 marked.',
              info: '+OK message 1 deleted',
              rows: [{ key: 'm1', cells: ['1', '4.1 KB', 'Marked for deleting'] }],
            }),
            ...msgOf('term-dele', ...INSIDE)({
              tag: 'DELE 2',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.335s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Mark letter 2 for deleting.',
              info: 'DELE 2',
            }),
            ...msgOf('term-dele', 'term-status', ...INSIDE)({
              tag: '+OK',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.363s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: letter 2 marked.',
              info: '+OK message 2 deleted',
              rows: [{ key: 'm2', cells: ['2', '18 KB', 'Marked for deleting'] }],
            }),
            ...msgOf('term-quit', ...INSIDE)({
              tag: 'QUIT',
              from: 'laptop',
              to: 'mail',
              proto: 'POP3',
              via: 'TCP',
              kind: 'request',
              time: '0.364s',
              src: LAPTOP,
              dst: MAIL,
              size: '—',
              sum: 'Goodbye.',
              info: 'QUIT',
            }),
            ...msgOf('term-quit', 'term-status', 'deep-states', 'fact-device', ...INSIDE)({
              tag: '+OK BYE',
              from: 'mail',
              to: 'laptop',
              proto: 'POP3',
              via: 'TCP',
              kind: 'response',
              time: '0.392s',
              src: MAIL,
              dst: LAPTOP,
              size: '—',
              sum: '+OK: letters deleted. Goodbye.',
              info: '+OK 2 messages deleted, signing off',
              st: 'Mail on this laptop only',
              done: true,
              conn: ['close', 'laptop>mail'],
              hold: { mail: false },
              rows: [
                { key: 'm1', cells: ['1', '4.1 KB', 'Deleted'] },
                { key: 'm2', cells: ['2', '18 KB', 'Deleted'] },
              ],
            }),
          ],
          backing: { traces: ['term-dele', 'term-quit', 'deep-states', 'fact-device', 'why-3'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'POP3 empties the mailbox onto your laptop: log in, see what’s there, download it, delete it, leave.',
            cite: [pop('1'), pop('3')],
          },
        ],
        terms: [
          { id: 'term-pop3', idea: 'Collecting mail from your mailbox', name: 'POP3', cite: [pop('1')] },
          { id: 'term-status', idea: 'It worked, or it didn’t', name: '+OK, -ERR', cite: [pop('3')] },
          { id: 'term-login', idea: 'Log in', name: 'USER, PASS', cite: [pop('7')] },
          { id: 'term-stat', idea: 'How many, how big?', name: 'STAT, LIST', cite: [pop('5')] },
          {
            id: 'term-retr',
            idea: 'Retrieve one, whole: headers, text and any pictures inside it',
            name: 'RETR',
            cite: [pop('5'), pop('1'), rfc('rfc-5322', '2.1', true), rfc('rfc-2046', '5.1', true), rfc('rfc-2046', '4.2', true)],
          },
          { id: 'term-dele', idea: 'Mark one for deleting', name: 'DELE', cite: [pop('5')] },
          { id: 'term-quit', idea: 'Leave, and delete what’s marked', name: 'QUIT', cite: [pop('6')] },
        ],
        pattern: {
          id: 'pattern',
          names: ['USER', 'PASS', 'STAT', 'RETR', 'DELE', 'QUIT'],
          note: 'A POP3 visit normally goes this way. The mailbox ends up on one device.',
          cite: [pop('1'), pop('3'), pop('9'), MS_POP_DELETES, MS_POP_DEVICE, GMAIL_SINGLE],
        },
        why: [
          {
            id: 'why-1',
            text: 'POP3 is simple and light on the server: each letter is stored once, on your device.',
            cite: [pop('7'), pop('1')],
          },
          {
            id: 'why-2',
            text: 'That suited the days of dial-up and one computer each: connect, collect the mail, then read it offline.',
            cite: [pop('1'), GMAIL_SINGLE],
          },
          {
            id: 'why-3',
            text: 'With a phone, a laptop and a tablet, you want the same mailbox everywhere, which is what IMAP does.',
            cite: [MS_SEVERAL, GMAIL_MULTIPLE, abstractOf('rfc-9051', '9051', true)],
          },
        ],
        deep: [
          {
            id: 'deep-states',
            text: 'A POP3 session moves through three states: authorization (USER, PASS; once you’re in, the server locks the mailbox), transaction (STAT, LIST, RETR, DELE, RSET, NOOP) and update (after QUIT, when deletions happen and the server closes the connection; if the line drops before QUIT, nothing is deleted). Sending mail isn’t POP3’s job at all; that’s SMTP.',
            cite: [pop('3'), pop('4'), pop('6'), pop('9'), pop('2'), rfc('rfc-6409', '1', true)],
          },
        ],
        facts: [
          { id: 'fact-ports', label: 'Ports', value: '110, 995 with TLS', cite: [pop('3'), rfc('rfc-8314', '3.1', true), IANA_PORTS] },
          { id: 'fact-commands', label: 'Commands', value: 'USER, PASS, STAT, LIST, RETR, DELE, QUIT', cite: [pop('9')] },
          { id: 'fact-device', label: 'Mail ends up', value: 'on one device', cite: [MS_POP_DEVICE, GMAIL_SINGLE] },
          {
            id: 'fact-sending',
            label: 'Sending',
            value: 'not POP3: that’s SMTP',
            cite: [pop('2'), rfc('rfc-6409', '1', true)],
          },
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 1939, Post Office Protocol, version 3', cite: [pop('1')] },
          {
            id: 'fact-connection',
            label: 'Connection',
            value:
              'TCP first (hello, hello back, OK: SYN, SYN-ACK, ACK), carried by IP; on port 995 TLS seals the line straight away, then the server greets with +OK',
            cite: [pop('3'), rfc('rfc-9293', '3.5', true), rfc('rfc-9293', '2.2', true), rfc('rfc-8314', '3.1', true)],
          },
          {
            id: 'fact-tls',
            label: 'TLS on port 995',
            value:
              'the app’s hello (ClientHello) offers the ways it can seal the line and names the server (SNI); the server answers with its hello (ServerHello), its certificate and Finished, and the app checks the certificate’s name; then every POP3 message travels inside TLS, on the TCP connection, where nobody on the way can read it',
            cite: [rfc('rfc-8314', '3.1', true), rfc('rfc-9846', '1', true), rfc('rfc-9846', '2', true), rfc('rfc-6066', '3', true), rfc('rfc-7817', '3', true)],
          },
          {
            id: 'fact-mailbox',
            label: 'The mailbox',
            value: 'one inbox, a numbered list of letters with sizes: no folders; UIDL gives each letter an ID that lasts between visits',
            cite: [pop('4'), pop('8'), pop('7')],
          },
          {
            id: 'fact-retr',
            label: 'Each letter comes back',
            value: 'after +OK and its size in octets, whole, headers then text, ending with a line holding just a dot',
            cite: [pop('5'), pop('3'), rfc('rfc-5322', '2.1', true)],
          },
        ],
      },
      practice: [
        {
          id: 'phone-inbox',
          prompt: 'You collect mail with POP3 on your laptop, then open your phone. What’s in the phone’s inbox?',
          options: [
            {
              text: 'The same letters, marked read.',
              feedback: 'Not quite. That’s IMAP. POP3 downloaded the letters and deleted them from the server.',
              cite: [rfc('rfc-9051', '2.3.2', true), abstractOf('rfc-9051', '9051', true), pop('1'), pop('6')],
            },
            {
              text: 'Nothing: they were downloaded and deleted from the server.',
              feedback: 'Right. They live only on the laptop now.',
              cite: [MS_POP_DEVICE, pop('6')],
            },
            {
              text: 'A copy of every letter you’ve ever had.',
              feedback: 'Not quite. The server deleted them at QUIT, so there’s nothing for the phone to fetch.',
              cite: [pop('6')],
            },
          ],
          answer: 1,
        },
        {
          id: 'when-deleted',
          prompt: 'When does the server actually delete a letter marked with DELE?',
          options: [
            {
              text: 'When you QUIT.',
              feedback: 'Yes. If the line drops before QUIT, nothing is deleted.',
              cite: [pop('6')],
            },
            {
              text: 'Straight away.',
              feedback: 'Not quite. DELE only marks it. The deleting happens at QUIT, so a dropped line never loses mail.',
              cite: [pop('5'), pop('6')],
            },
            {
              text: 'After 30 days.',
              feedback: 'Not quite. POP3 deletes at QUIT, as soon as you leave.',
              cite: [pop('6')],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
