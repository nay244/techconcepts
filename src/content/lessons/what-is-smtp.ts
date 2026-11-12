import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * SMTP, lesson 9 of How the Internet Works’ 14. Alex’s mail app hands a letter to Alex’s own mail server over a
 * sealed line, logging in first. That server looks up who takes mail for example.org, then hands the letter to
 * Sam’s mail server, where it waits in Sam’s mailbox.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols.mjs), changed only where a source does
 * not state them. RFC 5321 defines SMTP, and the other RFCs its extensions, so their citations are marked as the
 * defining standard where the claim is about the thing each defines; no vendor page is. The addresses (RFC 1918 and
 * RFC 5737), the example names, the clock times, the clients’ own ports and the letter’s size are example data. No
 * protocol message size is shown: no source states one. The post-office comparison (Overview description) is an
 * analogy and cites nothing.
 */

// ---------------------------------------------------------------- citations

/** A numbered section of an RFC that defines what the claim is about, so it is cited as the defining standard. */
const d = (source: string, section: string) => cite(source, section, { defining: true });
/** A numbered section of an RFC that only mentions or explains it. */
const r = (source: string, section: string) => cite(source, section);
/** An RFC’s abstract has no numbered section, so it is cited by the fragment of its heading. */
const abstractOf = (source: string, number: number, defining = false) =>
  cite(source, 'Abstract', { url: `https://www.rfc-editor.org/rfc/rfc${number}.html#abstract`, ...(defining ? { defining: true as const } : {}) });

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

/** A vendor’s page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const GOOGLE_OAUTH = vendor(
  'google-lsa-oauth',
  'https://knowledge.workspace.google.com/admin/sync/transition-from-less-secure-apps-to-oauth',
  'Transition from less secure apps to OAuth',
  'Starting%20March%2014%2C%202025',
);
const GOOGLE_APP = vendor('google-app-passwords', 'https://support.google.com/accounts/answer/185833', 'Sign in with app passwords', 'An%20app%20password%20is%20a%2016-digit%20passcode');
const MS_OUTLOOK_URL = 'https://support.microsoft.com/en-us/outlook/pop-imap-and-smtp-settings-for-outlook-com';
const MS_OUTLOOK_OAUTH = vendor('microsoft-outlook-com-settings', MS_OUTLOOK_URL, 'POP, IMAP, and SMTP settings for Outlook.com', 'Outlook.com%20requires%20the%20use%20of%20Modern%20Auth');
const MS_OUTLOOK_APP = vendor('microsoft-outlook-com-settings', MS_OUTLOOK_URL, 'POP, IMAP, and SMTP settings for Outlook.com', 'you%20may%20need%20an%20app%20password');
const MS_OUTLOOK_OUT = vendor('microsoft-outlook-com-settings', MS_OUTLOOK_URL, 'POP, IMAP, and SMTP settings for Outlook.com', 'Incoming%20and%20outgoing%20servers%20are%20the%20same');
const MS_APP = vendor(
  'microsoft-app-passwords',
  'https://support.microsoft.com/en-us/account-billing/how-to-get-and-use-app-passwords-5896ed9b-4263-e681-128a-a6f2979a7944',
  'How to get and use app passwords',
  'An%20app%20password%20is%20a%20long%2C%20randomly%20generated%20password',
);
const MS_AZURE = vendor(
  'microsoft-azure-outbound-smtp',
  'https://learn.microsoft.com/en-us/azure/virtual-network/troubleshoot-outbound-smtp-connectivity',
  'All other subscription types',
  'The%20Azure%20platform%20blocks%20outbound%20SMTP%20connections%20on%20TCP%20port%2025',
);
const PALO_URL = 'https://www.paloaltonetworks.com/cyberpedia/what-is-layer-7';
const PALO_L7_SMTP = vendor('paloalto-layer-7', PALO_URL, 'How does Layer 7 handle different application protocols?', 'SMTP%20for%20email');
const PALO_L7_DEF = vendor('paloalto-layer-7', PALO_URL, 'What Is Layer 7?', 'Layer%207%20is%20the%20application%20layer');
const CF_URL = 'https://www.cloudflare.com/learning/ddos/what-is-layer-7/';
const CF_L7_SMTP = vendor('cloudflare-layer-7', CF_URL, 'What does layer 7 do?', 'some%20of%20the%20main%20protocols%20used%20are%20HTTP%20and%20SMTP');

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50733';
const OUT = '203.0.113.60:465';
const OUT_RELAY = '203.0.113.60:43120';
const IN = '198.51.100.88:25';

const trip: TableDef = {
  id: 'trip',
  title: 'The letter’s trip',
  by: 'one handover at a time',
  columns: [
    { key: 'leg', label: 'Leg' },
    { key: 'from', label: 'From', prose: true },
    { key: 'to', label: 'To', prose: true },
    { key: 'result', label: 'Result' },
  ],
  keyColumn: 'leg',
  initialRows: [],
  empty: 'Not sent yet. The letter is still on the laptop.',
};

const mockup = messagesFor(trip);

/** The mockup's message, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-smtp',
  title: 'SMTP',
  subtitle: 'Sending email',
  level: 'beginner',
  certTags: [],
  summary:
    'When you press Send, your email doesn’t go straight to your friend. It goes to your mail server, which finds your friend’s mail server and hands it over. SMTP is the language of both handovers, and you can read most of it: short commands and numbered replies.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'term-outgoing', 'term-mx', 'term-reply', 'fact-commands'] },
  units: [
    {
      id: 'smtp',
      name: 'SMTP',
      fullName: 'Simple Mail Transfer Protocol',
      purpose: 'Sending email',
      group: 'app',
      // No standard puts SMTP at an OSI layer (RFC 5321 speaks of transport over TCP only), so the badge rests on two
      // vendors’ own explainer pages.
      osi: { layers: [7], cite: [PALO_L7_SMTP, PALO_L7_DEF, CF_L7_SMTP] },
      backing: { traces: ['fact-defined', 'lead-1', 'fact-commands'] },
      scene: {
        title: 'Your letter goes to your mail server, then to Sam’s',
        views: ['network', 'sequence'],
        layers: ['smtp:out', 'smtp:in'],
        labels: { laptop: 'Sending to sam@example.org', url: 'Mail' },
        start: [],
        panel: { type: 'table', table: trip },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'resolver', label: 'DNS resolver', addr: '192.0.2.53' },
          { place: 'out', label: 'Your mail server', addr: '203.0.113.60' },
          { place: 'in', label: 'Sam’s mail server', addr: '198.51.100.88' },
        ],
        backing: { traces: ['lead-1', 'term-outgoing', 'term-mx', 'fact-relay', 'fact-mx'] },
      },
      overview: {
        hook: 'When you press Send, your email doesn’t go straight to your friend. It goes to your mail server, which finds your friend’s mail server and hands it over. SMTP is the language of both handovers, and you can read most of it: short commands and numbered replies.',
        hookBacking: { traces: ['lead-1', 'term-outgoing', 'term-mx', 'term-reply', 'fact-commands'] },
        description:
          'It works like the post. You drop the letter at your local post office, which looks up where the address is and passes it to the post office there. Here, alex@example.net writes to sam@example.org: two servers, two handovers.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'sending email, and passing it between servers', backing: { traces: ['lead-1', 'why-2'] } },
          { label: 'Ports', value: '465 or 587 from your app; 25 between servers', backing: { traces: ['fact-ports'] } },
          { label: 'Replies', value: '3-digit codes: 2xx good, 3xx go on, 4xx try later, 5xx no', backing: { traces: ['term-reply', 'fact-codes'] } },
          { label: 'Finds the next server with', value: 'a DNS MX record', backing: { traces: ['term-mx', 'fact-mx'] } },
          { label: 'OSI layer', value: '7, application', backing: { traces: ['fact-osi'] } },
          { label: 'This example', value: 'alex@example.net to sam@example.org', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'tcp-and-tls-handshake',
          title: 'TCP and TLS Handshake',
          sub: 'A sealed line to your mail server',
          narrative:
            'Your mail app opens a line to your own mail server, smtp.example.net. First the usual TCP hello. Then the two set up encryption, so your password and your letter can’t be read on the way. That seal is **TLS**, and the port they meet on, 465, is one of the ports for **sending mail from an app**.',
          deep: [
            {
              text: 'Port 465 starts TLS straight away (implicit TLS).',
              cite: [d('rfc-8314', '2'), d('rfc-8314', '3.3')],
            },
            {
              text: 'Port 587 starts in plain text and upgrades with the STARTTLS command.',
              cite: [d('rfc-8314', '3'), d('rfc-3207', '4')],
            },
            {
              text: 'Both are for submission, mail coming from a person’s app.',
              cite: [d('rfc-8314', '3.3'), d('rfc-6409', '3.1')],
            },
            {
              text: 'Port 25 is for servers passing mail on, and many networks block it going out, to stop spam. The TLS/SSL lesson covers the handshake.',
              cite: [d('rfc-8314', '7.3'), d('rfc-5321', '4.5.4.2'), d('rfc-6409', '1'), MS_AZURE],
            },
          ],
          facts: [
            { label: 'To', value: 'smtp.example.net, 203.0.113.60', backing: { example: true } },
            { label: 'Port', value: '465: TLS from the start', backing: { traces: ['fact-ports', 'fact-implicit'] } },
            { label: 'Messages', value: 'SYN, SYN-ACK, ACK, then TLS hellos', backing: { traces: ['fact-tcp', 'fact-tls'] } },
            { label: 'Why sealed', value: 'your password crosses next', backing: { traces: ['fact-plain'] } },
          ],
          events: [
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'SYN',
              from: 'laptop',
              to: 'out',
              proto: 'TCP',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.000s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'Hello, can we talk?',
              info: 'SYN',
              st: 'Connecting',
            }),
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'SYN-ACK',
              from: 'out',
              to: 'laptop',
              proto: 'TCP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.030s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes, I hear you.',
              info: 'SYN-ACK',
            }),
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'ACK',
              from: 'laptop',
              to: 'out',
              proto: 'TCP',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.030s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'Connected.',
              info: 'ACK',
              conn: ['open', 'laptop>out'],
            }),
            ...msgOf(
              'fact-tls',
              'fact-rides',
              'fact-ports',
              'fact-implicit',
            )({
              tag: 'TLS HELLO',
              from: 'laptop',
              to: 'out',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.031s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'Let’s seal this line. Here’s what I can do.',
              info: 'TLS ClientHello',
            }),
            ...msgOf(
              'fact-tls',
              'fact-rides',
              'fact-ports',
              'fact-implicit',
            )({
              tag: 'TLS HELLO',
              from: 'out',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.064s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: 'Agreed. Here’s my ID card, my certificate, to prove I’m smtp.example.net.',
              info: 'TLS ServerHello, certificate, finished',
              st: 'Connected, sealed',
              known: true,
              conn: ['seal', 'laptop>out'],
            }),
          ],
          backing: { traces: ['term-outgoing', 'fact-tcp', 'fact-tls', 'fact-ports', 'fact-plain'] },
        },
        {
          id: 'ehlo-and-authentication',
          title: 'EHLO and Authentication',
          sub: 'Say hello, then log in',
          narrative:
            'The server speaks first: “220, ready.” Every reply starts with a three-digit **reply code**, and a 2 in front means good. Your app says hello with **EHLO**, and the server lists what it can do. Then your app logs in with **AUTH**, so the server knows you may send as alex@example.net. “235, you’re in.”',
          deep: [
            {
              text: 'EHLO (extended hello) replaced the older HELO; the 250 reply lists extensions such as SIZE, PIPELINING and AUTH PLAIN.',
              cite: [d('rfc-5321', '2.2.1'), d('rfc-5321', '2.2.2'), d('rfc-2920', '2'), d('rfc-4954', '3'), d('rfc-1870', '3')],
            },
            {
              text: 'AUTH PLAIN sends the username and password, which is why the line was sealed first.',
              cite: [d('rfc-4616', '2'), d('rfc-4616', '1'), d('rfc-4954', '4')],
            },
            {
              text: 'Many apps use an app password or a sign-in token instead of your real password.',
              cite: [GOOGLE_OAUTH, GOOGLE_APP, MS_OUTLOOK_OAUTH, MS_OUTLOOK_APP, MS_APP],
            },
          ],
          facts: [
            { label: 'Greeting', value: '220 smtp.example.net ready', backing: { traces: ['deep-codes', 'term-reply', 'fact-greeting'] } },
            { label: 'Hello', value: 'EHLO [192.168.1.100]', backing: { traces: ['term-ehlo', 'fact-ehlo-name'] } },
            { label: 'Log in', value: 'AUTH PLAIN, then 235', backing: { traces: ['term-auth', 'fact-plain', 'deep-codes'] } },
            { label: 'Codes', value: '220 ready, 250 OK, 235 logged in', backing: { traces: ['deep-codes'] } },
          ],
          events: [
            ...msgOf(
              'deep-codes',
              'term-reply',
              'fact-rides',
              'fact-ports',
            )({
              tag: '220',
              from: 'out',
              to: 'laptop',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              time: '0.098s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: '220: smtp.example.net, ready when you are.',
              info: '220 smtp.example.net ready',
            }),
            ...msgOf(
              'term-ehlo',
              'fact-ehlo-name',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'EHLO',
              from: 'laptop',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.099s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'Hello, I’m Alex’s laptop.',
              info: 'EHLO [192.168.1.100]',
            }),
            ...msgOf(
              'term-ehlo',
              'term-auth',
              'fact-plain',
              'fact-pipelining',
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '250',
              from: 'out',
              to: 'laptop',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.130s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: '250: hello. I can do AUTH and PIPELINING.',
              info: '250-smtp.example.net, AUTH PLAIN, PIPELINING',
            }),
            ...msgOf(
              'term-auth',
              'fact-plain',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'AUTH',
              from: 'laptop',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.131s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'Logging in as alex@example.net, with my password.',
              info: 'AUTH PLAIN (credentials, inside TLS)',
            }),
            ...msgOf(
              'term-auth',
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '235',
              from: 'out',
              to: 'laptop',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              time: '0.190s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: '235: you’re logged in.',
              info: '235 Authentication successful',
              st: 'Logged in',
              known: true,
            }),
          ],
          backing: { traces: ['deep-codes', 'term-reply', 'fact-codes', 'term-ehlo', 'term-auth', 'fact-plain', 'fact-greeting'] },
        },
        {
          id: 'message-submission',
          title: 'Message Submission',
          sub: 'The envelope first, then the letter',
          narrative:
            'Like a paper letter, an email has an envelope and a letter inside. The app gives the envelope first: **MAIL FROM** alex@example.net, then **RCPT TO** sam@example.org. Then **DATA**, the server says “go ahead”, and the app sends the letter: subject, other headers and text. “250, queued.” Your mail server has it now, and your app’s part is done.',
          deep: [
            {
              text: 'The envelope (MAIL FROM, RCPT TO) is what servers deliver by.',
              cite: [r('rfc-5598', '4.1.1'), d('rfc-5321', '2.3.1')],
            },
            {
              text: 'The From: and To: you see are headers inside the letter and can be different, which is how forged senders work; SPF, DKIM and DMARC check for that.',
              cite: [d('rfc-5321', '7.2'), d('rfc-5321', '7.1'), d('rfc-9989', '1'), abstractOf('rfc-7208', 7208, true), abstractOf('rfc-6376', 6376, true)],
            },
            {
              text: 'The letter ends with a line holding a single dot, and 354 means “start sending, end with a dot”.',
              cite: [d('rfc-5321', '4.1.1.4'), d('rfc-5321', '4.2.3')],
            },
          ],
          facts: [
            { label: 'Envelope', value: 'MAIL FROM, RCPT TO', backing: { traces: ['term-envelope'] } },
            { label: 'Letter', value: 'DATA, 354, then the text', backing: { traces: ['term-data', 'deep-codes'] } },
            { label: 'Ends with', value: 'a line with just a dot', backing: { traces: ['fact-end'] } },
            { label: 'Result', value: '250 queued', backing: { traces: ['fact-250', 'deep-codes'] } },
          ],
          events: [
            ...msgOf(
              'term-envelope',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'MAIL FROM',
              from: 'laptop',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.191s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'This is from alex@example.net.',
              info: 'MAIL FROM:<alex@example.net>',
              st: 'Sending the letter',
            }),
            ...msgOf(
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '250',
              from: 'out',
              to: 'laptop',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.221s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: '250: OK.',
              info: '250 OK',
            }),
            ...msgOf(
              'term-envelope',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'RCPT TO',
              from: 'laptop',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.222s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'It’s for sam@example.org.',
              info: 'RCPT TO:<sam@example.org>',
            }),
            ...msgOf(
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '250',
              from: 'out',
              to: 'laptop',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.252s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: '250: OK.',
              info: '250 OK',
            }),
            ...msgOf(
              'term-data',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'DATA',
              from: 'laptop',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.253s',
              src: LAPTOP,
              dst: OUT,
              size: '—',
              sum: 'Here comes the letter.',
              info: 'DATA',
            }),
            ...msgOf(
              'deep-codes',
              'term-data',
              'fact-end',
              'fact-rides',
              'fact-ports',
            )({
              tag: '354',
              from: 'out',
              to: 'laptop',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.283s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: '354: go ahead. End with a line holding just a dot.',
              info: '354 Start mail input',
            }),
            ...msgOf(
              'term-data',
              'fact-end',
              'fact-content',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'LETTER',
              from: 'laptop',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.284s',
              src: LAPTOP,
              dst: OUT,
              size: '3.2 KB',
              sum: 'Subject: Saturday? Hi Sam, are we still on for Saturday? …',
              info: 'Headers and body, ending with “.”',
            }),
            ...msgOf(
              'fact-250',
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '250 QUEUED',
              from: 'out',
              to: 'laptop',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              time: '0.341s',
              src: OUT,
              dst: LAPTOP,
              size: '—',
              sum: '250: got it. It’s queued for delivery.',
              info: '250 OK: queued as 4F2A91',
              st: 'Sent. Your server has it',
              done: true,
              hold: { out: true },
              rows: [{ key: 'leg1', cells: ['1', 'Your laptop', 'smtp.example.net', '250 queued'] }],
            }),
          ],
          backing: { traces: ['term-envelope', 'term-data', 'deep-codes', 'fact-250', 'fact-content'] },
        },
        {
          id: 'mx-lookup',
          title: 'MX Lookup',
          sub: 'Ask DNS for example.org’s mail server',
          narrative:
            'Your mail server looks at the address: sam@**example.org**. To find who takes mail for example.org, it asks DNS for a special record, the **MX record**, short for mail exchanger. The answer: “Mail for example.org goes to mx.example.org, at 198.51.100.88.”',
          deep: [
            {
              text: 'A domain can list several MX records with priorities: senders try the lowest number first and fall back to the others.',
              cite: [d('rfc-5321', '5.1'), d('rfc-1035', '3.3.9')],
            },
            {
              text: 'If there’s no MX record at all, senders try the domain’s A record.',
              cite: [d('rfc-5321', '5.1')],
            },
          ],
          facts: [
            { label: 'Question', value: 'the MX record for example.org', backing: { traces: ['term-mx', 'fact-mx'] } },
            { label: 'Answer', value: 'mx.example.org, priority 10', backing: { traces: ['term-mx', 'fact-mx'] } },
            { label: 'Its address', value: '198.51.100.88', backing: { example: true } },
            { label: 'No MX?', value: 'try the domain’s A record', backing: { traces: ['fact-mx'] } },
          ],
          events: [
            ...msgOf(
              'term-mx',
              'fact-mx',
            )({
              tag: 'MX QUERY',
              from: 'out',
              to: 'resolver',
              proto: 'DNS',
              via: 'UDP',
              kind: 'request',
              time: '0.402s',
              src: '203.0.113.60:39014',
              dst: '192.0.2.53:53',
              size: '—',
              sum: 'Which server takes mail for example.org?',
              info: 'Query: MX example.org',
            }),
            ...msgOf(
              'term-mx',
              'fact-mx',
            )({
              tag: 'MX ANSWER',
              from: 'resolver',
              to: 'out',
              proto: 'DNS',
              via: 'UDP',
              kind: 'response',
              time: '0.421s',
              src: '192.0.2.53:53',
              dst: '203.0.113.60:39014',
              size: '—',
              sum: 'mx.example.org, at 198.51.100.88.',
              info: 'Response: MX 10 mx.example.org, A 198.51.100.88',
              rows: [{ key: 'mx', cells: ['Lookup', 'smtp.example.net', 'DNS resolver', 'MX: mx.example.org'] }],
            }),
          ],
          backing: { traces: ['term-mx', 'fact-mx'] },
        },
        {
          id: 'server-relay-and-starttls',
          title: 'Server Relay and STARTTLS',
          sub: 'Post office to post office',
          narrative:
            'Now your mail server connects to Sam’s, on port 25, the port servers use between themselves. The same TCP hello, the same 220 greeting, the same EHLO. Port 25 starts unsealed, so your server asks to switch encryption on with **STARTTLS**, and the two do a TLS handshake before the letter crosses.',
          deep: [
            {
              text: 'STARTTLS upgrades a plain connection to TLS.',
              cite: [d('rfc-8314', '3'), d('rfc-3207', '4')],
            },
            {
              text: 'Between servers it’s opportunistic: if the other side doesn’t offer it, many servers send in plain text anyway.',
              cite: [d('rfc-8461', '1'), d('rfc-7672', '1.1'), d('rfc-3207', '4')],
            },
            {
              text: 'MTA-STS and DANE let a domain insist on TLS.',
              cite: [abstractOf('rfc-8461', 8461, true), d('rfc-7672', '1')],
            },
            {
              text: 'There’s no AUTH here: Sam’s server accepts mail for its own users from anyone, then filters it.',
              cite: [d('rfc-6409', '1'), d('rfc-6409', '3.2'), d('rfc-9989', '1'), r('rfc-5598', '2.2.4')],
            },
          ],
          facts: [
            { label: 'To', value: 'mx.example.org, 198.51.100.88', backing: { example: true } },
            { label: 'Port', value: '25, server to server', backing: { traces: ['fact-ports'] } },
            { label: 'Seal', value: 'STARTTLS, then TLS', backing: { traces: ['term-starttls', 'fact-tls'] } },
            { label: 'No login', value: 'it accepts mail for its own users', backing: { traces: ['fact-relay'] } },
          ],
          events: [
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'SYN',
              from: 'out',
              to: 'in',
              proto: 'TCP',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.422s',
              src: OUT_RELAY,
              dst: IN,
              size: '—',
              sum: 'Hello, can we talk?',
              info: 'SYN',
            }),
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'SYN-ACK',
              from: 'in',
              to: 'out',
              proto: 'TCP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.468s',
              src: IN,
              dst: OUT_RELAY,
              size: '—',
              sum: 'Yes, I hear you.',
              info: 'SYN-ACK',
            }),
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'ACK',
              from: 'out',
              to: 'in',
              proto: 'TCP',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.468s',
              src: OUT_RELAY,
              dst: IN,
              size: '—',
              sum: 'Connected.',
              info: 'ACK',
              conn: ['open', 'out>in'],
            }),
            ...msgOf(
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '220',
              from: 'in',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              time: '0.515s',
              src: IN,
              dst: OUT_RELAY,
              size: '—',
              sum: '220: mx.example.org, ready.',
              info: '220 mx.example.org ready',
            }),
            ...msgOf(
              'term-ehlo',
              'fact-ehlo-name',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'EHLO',
              from: 'out',
              to: 'in',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.516s',
              src: OUT_RELAY,
              dst: IN,
              size: '—',
              sum: 'Hello, I’m smtp.example.net.',
              info: 'EHLO smtp.example.net',
            }),
            ...msgOf(
              'term-ehlo',
              'term-starttls',
              'fact-pipelining',
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '250',
              from: 'in',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.562s',
              src: IN,
              dst: OUT_RELAY,
              size: '—',
              sum: '250: hello. I can do STARTTLS and PIPELINING.',
              info: '250-mx.example.org, STARTTLS, PIPELINING',
            }),
            ...msgOf(
              'term-starttls',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'STARTTLS',
              from: 'out',
              to: 'in',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.563s',
              src: OUT_RELAY,
              dst: IN,
              size: '—',
              sum: 'Let’s seal this line before I go on.',
              info: 'STARTTLS',
            }),
            ...msgOf(
              'term-starttls',
              'deep-codes',
              'fact-rides',
              'fact-ports',
            )({
              tag: '220',
              from: 'in',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.609s',
              src: IN,
              dst: OUT_RELAY,
              size: '—',
              sum: '220: go ahead.',
              info: '220 Ready to start TLS',
            }),
            ...msgOf(
              'fact-tls',
              'term-starttls',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'TLS HELLO',
              from: 'out',
              to: 'in',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.610s',
              src: OUT_RELAY,
              dst: IN,
              size: '—',
              sum: 'Here’s what I can do.',
              info: 'TLS ClientHello',
            }),
            ...msgOf(
              'fact-tls',
              'term-starttls',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'TLS HELLO',
              from: 'in',
              to: 'out',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.658s',
              src: IN,
              dst: OUT_RELAY,
              size: '—',
              sum: 'Agreed. Here’s my certificate for mx.example.org.',
              info: 'TLS ServerHello, certificate, finished',
              conn: ['seal', 'out>in'],
            }),
          ],
          backing: {
            traces: ['fact-ports', 'fact-tcp', 'deep-codes', 'term-ehlo', 'term-starttls', 'fact-tls', 'fact-relay'],
          },
        },
        {
          id: 'message-delivery',
          title: 'Message Delivery',
          sub: 'Envelope, letter, 250',
          narrative:
            'Your server hands the letter over the same way your app did: envelope, then letter. After the seal it says EHLO again, as the rules ask. Then it sends MAIL FROM, RCPT TO and DATA together to save time, and gets three replies back at once. “250, delivered.” The letter now waits in Sam’s mailbox until Sam’s app collects it, which is the job of POP3 and IMAP.',
          deep: [
            {
              text: 'Sending several commands without waiting for each reply is PIPELINING, offered in the EHLO reply.',
              cite: [d('rfc-2920', '3'), d('rfc-2920', '3.1')],
            },
            {
              text: 'Every server adds a Received: line to the letter’s headers, so you can trace its path.',
              cite: [d('rfc-5321', '4.4'), d('rfc-5321', '3.7.2')],
            },
            {
              text: 'If delivery fails for good (5xx), your server sends you a bounce; if it’s temporary (4xx), it keeps trying for a few days.',
              cite: [d('rfc-5321', '3.6.3'), d('rfc-5321', '4.2.5'), d('rfc-5321', '4.5.4.1')],
            },
          ],
          facts: [
            { label: 'Sent together', value: 'MAIL FROM, RCPT TO, DATA', backing: { traces: ['fact-pipelining', 'term-envelope', 'term-data'] } },
            { label: 'Replies', value: '250, 250, 354', backing: { traces: ['deep-codes', 'fact-pipelining'] } },
            { label: 'Result', value: '250: in Sam’s mailbox', backing: { traces: ['fact-250', 'why-3'] } },
            { label: 'Collected later by', value: 'POP3 or IMAP', backing: { traces: ['why-3'] } },
          ],
          events: [
            ...msgOf(
              'term-envelope',
              'term-data',
              'fact-pipelining',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'ENVELOPE',
              from: 'out',
              to: 'in',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.706s',
              src: OUT_RELAY,
              dst: IN,
              size: '—',
              sum: 'From alex@example.net, for sam@example.org, and here comes the letter.',
              info: 'MAIL FROM, RCPT TO, DATA (pipelined)',
            }),
            ...msgOf(
              'deep-codes',
              'fact-pipelining',
              'fact-rides',
              'fact-ports',
            )({
              tag: '250 250 354',
              from: 'in',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.752s',
              src: IN,
              dst: OUT_RELAY,
              size: '—',
              sum: '250 OK, 250 OK, 354 go ahead.',
              info: '250 OK, 250 OK, 354 Start mail input',
            }),
            ...msgOf(
              'term-data',
              'fact-end',
              'fact-content',
              'fact-received',
              'fact-rides',
              'fact-ports',
            )({
              tag: 'LETTER',
              from: 'out',
              to: 'in',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'request',
              time: '0.753s',
              src: OUT_RELAY,
              dst: IN,
              size: '3.4 KB',
              sum: 'The letter, with one more Received: line on top.',
              info: 'Headers and body, ending with “.”',
              hold: { out: false },
            }),
            ...msgOf(
              'fact-250',
              'deep-codes',
              'why-3',
              'fact-rides',
              'fact-ports',
            )({
              tag: '250',
              from: 'in',
              to: 'out',
              proto: 'SMTP',
              via: 'TCP',
              kind: 'response',
              time: '0.811s',
              src: IN,
              dst: OUT_RELAY,
              size: '—',
              sum: '250: delivered to Sam’s mailbox.',
              info: '250 OK: delivered',
              hold: { in: true },
              rows: [{ key: 'leg2', cells: ['2', 'smtp.example.net', 'mx.example.org', '250 delivered'] }],
            }),
          ],
          backing: {
            traces: ['fact-ehlo-again', 'fact-pipelining', 'term-envelope', 'term-data', 'deep-codes', 'fact-250', 'why-3', 'fact-received'],
          },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'Two handovers in the same short language: your app to your server, then your server to Sam’s.',
            cite: [d('rfc-6409', '1'), d('rfc-5321', '2.1')],
          },
        ],
        terms: [
          {
            id: 'term-outgoing',
            idea: 'Your post office for sending',
            name: 'Outgoing mail server',
            cite: [d('rfc-8314', '2'), d('rfc-6409', '2.1'), MS_OUTLOOK_OUT],
          },
          { id: 'term-ehlo', idea: 'The hello that starts the talk', name: 'EHLO', cite: [d('rfc-5321', '3.2')] },
          { id: 'term-auth', idea: 'Proving you may send', name: 'AUTH', cite: [d('rfc-4954', '1'), d('rfc-6409', '3.3')] },
          {
            id: 'term-envelope',
            idea: 'The envelope: who from, who to',
            name: 'MAIL FROM, RCPT TO',
            cite: [d('rfc-5321', '3.3'), d('rfc-5321', '2.3.1')],
          },
          { id: 'term-data', idea: 'The letter itself', name: 'DATA', cite: [d('rfc-5321', '3.3')] },
          {
            id: 'term-reply',
            idea: 'The three-digit answer to each command',
            name: 'Reply code',
            cite: [d('rfc-5321', '4.2'), d('rfc-5321', '2.4')],
          },
          {
            id: 'term-mx',
            idea: '“Which server takes their mail?”',
            name: 'MX record',
            cite: [d('rfc-5321', '5.1'), d('rfc-1035', '3.3.9'), d('rfc-5321', '1.1')],
          },
          {
            id: 'term-starttls',
            idea: 'Switching a plain line to a sealed one',
            name: 'STARTTLS',
            cite: [d('rfc-8314', '3'), d('rfc-3207', '4')],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['EHLO', 'MAIL FROM', 'RCPT TO', 'DATA', '250'],
          note: 'Every handover goes this way, app to server or server to server.',
          cite: [d('rfc-5321', '4.1.4'), d('rfc-5321', '3.3'), d('rfc-6409', '3.1')],
        },
        why: [
          {
            id: 'why-1',
            text: 'Because every mail server speaks SMTP, anyone can email anyone, whatever app or provider each of you uses.',
            cite: [r('rfc-5598', '1.1'), d('rfc-8314', '7.3')],
          },
          {
            id: 'why-2',
            text: 'SMTP only sends, though.',
            cite: [r('rfc-6409', '2.1'), d('rfc-5321', '1.1')],
          },
          {
            id: 'why-3',
            text: 'Collecting mail from your mailbox is a different job, done by POP3 or IMAP.',
            cite: [r('rfc-6409', '2.1'), d('rfc-5321', '2.3.10'), d('rfc-1939', '1'), abstractOf('rfc-9051', 9051, true)],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'On its own, SMTP doesn’t check who a letter is really from.',
            cite: [d('rfc-5321', '7.1'), r('rfc-7208', '1')],
          },
          {
            id: 'deep-2',
            text: 'SPF lists the servers allowed to send for a domain, DKIM signs each letter, and DMARC says what to do when those checks fail.',
            cite: [d('rfc-7208', '1'), abstractOf('rfc-6376', 6376, true), abstractOf('rfc-9989', 9989, true)],
          },
          {
            id: 'deep-codes',
            text: 'Codes worth knowing: 220 ready, 221 bye, 235 logged in, 250 OK, 354 send the letter, 421 try later, 550 no such mailbox.',
            cite: [d('rfc-5321', '4.2.3'), d('rfc-4954', '6'), d('rfc-5321', '4.2.1')],
          },
        ],
        facts: [
          {
            id: 'fact-ports',
            label: 'Ports',
            value: '25 between servers, 587 (STARTTLS) and 465 (TLS) from apps',
            cite: [d('rfc-8314', '3.3'), d('rfc-8314', '7.3'), IANA_PORTS],
          },
          {
            id: 'fact-commands',
            label: 'Commands',
            value: 'EHLO, AUTH, MAIL FROM, RCPT TO, DATA, QUIT',
            cite: [d('rfc-5321', '4.1.1.1'), d('rfc-5321', '3.3'), d('rfc-5321', '4.1.1.10'), d('rfc-4954', '3')],
          },
          {
            id: 'fact-codes',
            label: 'Codes',
            value: '2xx done, 3xx go on, 4xx try later, 5xx failed',
            cite: [d('rfc-5321', '4.2.1')],
          },
          {
            id: 'fact-checks',
            label: 'Checks',
            value: 'SPF, DKIM, DMARC',
            cite: [d('rfc-7208', '1'), abstractOf('rfc-6376', 6376, true), abstractOf('rfc-9989', 9989, true)],
          },
          {
            id: 'fact-greeting',
            label: 'Who speaks first',
            value: 'the server, with its 220 greeting',
            cite: [d('rfc-5321', '3.1')],
          },
          {
            id: 'fact-content',
            label: 'The letter',
            value: 'headers such as Subject, From and To, then the body',
            cite: [d('rfc-5321', '2.3.1'), d('rfc-5321', '3.3')],
          },
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 5321', cite: [d('rfc-5321', '1.2')] },
          {
            id: 'fact-tcp',
            label: 'TCP connection',
            value: 'opened by a handshake of three messages (SYN, SYN-ACK, ACK)',
            cite: [d('rfc-9293', '3.5')],
          },
          {
            id: 'fact-rides',
            label: 'SMTP rides on',
            value: 'TCP; from an app, inside TLS',
            cite: [d('rfc-5321', '1.1'), d('rfc-5321', '4.5.4.2'), d('rfc-8314', '3.3')],
          },
          {
            id: 'fact-implicit',
            label: 'Port 465',
            value: 'TLS starts as soon as the connection opens (implicit TLS)',
            cite: [d('rfc-8314', '2'), d('rfc-8314', '3.3')],
          },
          {
            id: 'fact-tls',
            label: 'TLS seal',
            value:
              'a handshake: the ClientHello says what the app can do; the server answers with ServerHello, its certificate and Finished, and the app checks the certificate’s name; after it, everything is encrypted',
            cite: [d('rfc-9846', '2'), d('rfc-9846', '1'), d('rfc-8314', '3.3'), d('rfc-3207', '4.1'), d('rfc-7817', '3')],
          },
          {
            id: 'fact-plain',
            label: 'Logging in',
            value: 'AUTH PLAIN sends the name and password as they are, so it belongs inside TLS',
            cite: [d('rfc-4616', '2'), d('rfc-4616', '1'), d('rfc-4954', '4')],
          },
          {
            id: 'fact-ehlo-name',
            label: 'Name in EHLO',
            value: 'the sender’s own name, or its address in square brackets when it has no name',
            cite: [d('rfc-5321', '2.3.5'), d('rfc-5321', '4.1.1.1'), d('rfc-5321', '4.1.3')],
          },
          {
            id: 'fact-end',
            label: 'Letter ends with',
            value: 'a line holding a single dot (354 asks for it)',
            cite: [d('rfc-5321', '4.1.1.4'), d('rfc-5321', '4.2.3')],
          },
          {
            id: 'fact-250',
            label: '250 after the letter',
            value: 'the server has taken the letter: it delivers it, or tells you if it can’t',
            cite: [d('rfc-5321', '4.1.1.4'), d('rfc-5321', '4.2.5')],
          },
          {
            id: 'fact-mx',
            label: 'MX (mail exchanger) lookup',
            value:
              'a DNS question to a resolver, usually by UDP to port 53; the answer names the mail server with a priority (lowest first), often with its address; with no MX record, senders use the domain’s own address (its A record)',
            cite: [d('rfc-5321', '5.1'), d('rfc-1035', '3.3.9'), d('rfc-1035', '4.2.1'), d('rfc-5321', '1.1'), d('rfc-1035', '2.1')],
          },
          {
            id: 'fact-pipelining',
            label: 'PIPELINING',
            value: 'sending several commands without waiting for each reply, once the EHLO reply offers it',
            cite: [d('rfc-2920', '3'), d('rfc-2920', '3.1')],
          },
          {
            id: 'fact-ehlo-again',
            label: 'After STARTTLS',
            value: 'the talk starts over, so the sender says EHLO again',
            cite: [d('rfc-3207', '4.2')],
          },
          {
            id: 'fact-received',
            label: 'Received:',
            value: 'each server that takes the letter adds a line at the top of its headers',
            cite: [d('rfc-5321', '4.4')],
          },
          {
            id: 'fact-relay',
            label: 'Between servers',
            value: 'no login: a server takes mail for its own users, then filters it',
            cite: [d('rfc-6409', '1'), d('rfc-6409', '3.2'), d('rfc-9989', '1'), r('rfc-5598', '2.2.4')],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '7, application', cite: [PALO_L7_SMTP, PALO_L7_DEF, CF_L7_SMTP] },
        ],
      },
      practice: [
        {
          id: 'find-server',
          prompt: 'How does smtp.example.net find where to deliver mail for sam@example.org?',
          options: [
            {
              text: 'It asks DNS for example.org’s MX record.',
              feedback: 'Right. The MX record names the server that takes example.org’s mail.',
              cite: [d('rfc-5321', '5.1'), d('rfc-1035', '3.3.9')],
            },
            {
              text: 'It sends a copy to every mail server.',
              feedback: 'Not quite. It sends to one server, the one DNS names in example.org’s MX record.',
              cite: [d('rfc-5321', '5.1'), d('rfc-1035', '3.3.9')],
            },
            {
              text: 'Sam’s app tells it.',
              feedback: 'Not quite. Sam’s app isn’t involved yet. Your server finds Sam’s server through DNS, with the MX record.',
              cite: [d('rfc-5321', '5.1'), d('rfc-5321', '2.3.10'), r('rfc-6409', '2.1')],
            },
          ],
          answer: 0,
        },
        {
          id: 'queued',
          prompt: 'Your server replied “250 queued”. What does that mean?',
          options: [
            {
              text: 'Sam has read the letter.',
              feedback: 'Not quite. SMTP never knows whether anyone has read a letter. 250 queued only means your server took it.',
              cite: [r('rfc-5598', '4.1'), d('rfc-5321', '4.1.1.4')],
            },
            {
              text: 'Your mail server has the letter and will deliver it.',
              feedback: 'Yes. Your app’s part is done; your server takes it from there.',
              cite: [d('rfc-5321', '4.1.1.4'), d('rfc-6409', '2.1')],
            },
            {
              text: 'It failed and is coming back to you.',
              feedback: 'Not quite. Failures start with 4 or 5. A 2 in front means it worked.',
              cite: [d('rfc-5321', '4.2.1')],
            },
          ],
          answer: 1,
        },
      ],
    },
  ],
});
