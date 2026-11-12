import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * FTP, lesson 12 of How the Internet Works’ 14. Commands go on the control connection to port 21, in plain text,
 * password included. After PASV the laptop opens a second, data connection to port 50000, drawn dashed just above
 * the first; report.pdf crosses on it, and closing it marks the end of the file. QUIT closes the control line too.
 * The table marks the password and the file, as the mockup does: look here. Its mark says "exposed".
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-apps.mjs), changed only where a source
 * does not state them. RFC 959 defines FTP, and the other RFCs its extensions, so their citations are marked as the
 * defining standard where the claim is about the thing each defines; no vendor page is. The addresses (RFC 1918 and
 * RFC 5737), the example names, the user name and password, the clock times, the clients’ own ports, the server’s
 * data port and the file’s size are example data. No protocol message size is shown: no source states one. The
 * warehouse comparison (Overview description) is an analogy and cites nothing.
 */

// ---------------------------------------------------------------- citations

const RFC959 = 'https://www.rfc-editor.org/rfc/rfc959.html';
/** RFC 959’s html has ids for sections 1 to 8 only, so a subsection is cited by the page its passage starts on. */
const d959 = (section: string, page: number) => cite('rfc-959', `${section}, page ${page}`, { url: `${RFC959}#page-${page}`, defining: true });
/** Sections 1, 2 and 8 of RFC 959 have ids of their own. */
const d959s = (section: string) => cite('rfc-959', section, { defining: true });
/** A numbered section of an RFC that defines what the claim is about, so it is cited as the defining standard. */
const d = (source: string, section: string) => cite(source, section, { defining: true });
/** A numbered section of an RFC that only mentions or explains it. */
const r = (source: string, section: string) => cite(source, section);
/** An RFC without section ids is cited by a text fragment that starts in the section. */
const rfcText = (source: string, number: number, section: string, text: string) =>
  cite(source, section, { url: `https://www.rfc-editor.org/rfc/rfc${number}.html#:~:text=${text}` });

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

/** A vendor’s page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const R959_INTRO = cite('rfc-959', 'Status of this Memo', { url: `${RFC959}#:~:text=official%20specification%20of%20the%20File%20Transfer%20Protocol`, defining: true });
const R2577_PLAIN = r('rfc-2577', '6');
const R2577_PASS = r('rfc-2577', '5');
const R2228_PLAIN = r('rfc-2228', '1');

const MS_FTPS_URL = 'https://learn.microsoft.com/en-us/azure/app-service/deploy-ftp';
const MS_FTPS = vendor('microsoft-app-service-ftp', MS_FTPS_URL, 'Enforce FTPS', 'FTPS%20is%20a%20more%20secure%20form%20of%20FTP');
const MS_FTPS_PORTS = vendor('microsoft-app-service-ftp', MS_FTPS_URL, 'FAQ', 'If%20you%20connect%20with%20explicit%20encryption');
const MS_FW_URL = 'https://learn.microsoft.com/en-us/iis/publish/using-the-ftp-service/configuring-ftp-firewall-settings-in-iis-7';
const MS_FW = (text: string) => vendor('microsoft-iis-ftp-firewall', MS_FW_URL, 'More Information about Working with Firewalls', text);
const MS_FW_ACTIVE = MS_FW('Active%20Data%20Connections');
const MS_FW_PASSIVE = MS_FW('Passive%20Data%20Connections');
const MS_FW_HARD = MS_FW('It%20is%20often%20challenging');
const MS_FW_FILTERS = MS_FW('Some%20firewalls%20try%20to%20remedy');
const MS_FW_RANGE = vendor('microsoft-iis-ftp-firewall', MS_FW_URL, 'Step 1', 'The%20valid%20range%20for%20ports');
const MS_AZURE_SFTP = vendor(
  'microsoft-azure-sftp',
  'https://learn.microsoft.com/en-us/azure/storage/blobs/secure-file-transfer-protocol-support',
  'Overview',
  'Now%2C%20with%20SFTP%20support',
);
const MS_SFTP_CONNECTOR = vendor('microsoft-sftp-connector', 'https://learn.microsoft.com/en-us/connectors/sftpwithssh/', 'SFTP - SSH', 'SFTP%20(SSH%20File%20Transfer%20Protocol)%20is%20a%20network%20protocol');
const MS_ANON = vendor(
  'microsoft-iis-ftp-anonymous',
  'https://learn.microsoft.com/en-us/iis/configuration/system.applicationhost/sites/sitedefaults/ftpserver/security/authentication/anonymousauthentication',
  'Overview',
  'Anonymous%20users%20will%20typically%20log%20in',
);
const MS_PXE = vendor(
  'microsoft-pxe-winpe',
  'https://learn.microsoft.com/en-us/windows/deployment/configure-a-pxe-server-to-load-windows-pe',
  'Prerequisites',
  'A%20PXE%20server',
);
const CF_FTP_URL = 'https://developers.cloudflare.com/spectrum/about/ftp/';
const CF_FTP_OPERATES = vendor('cloudflare-spectrum-ftp', CF_FTP_URL, 'How FTP Operates', 'There%20are%20two%20ways%20in%20which%20client%20and%20server');
const CF_FTP_EPSV = vendor('cloudflare-spectrum-ftp', CF_FTP_URL, 'How FTP Operates', 'Alternatively%2C%20more%20modern%20FTP%20server%20software');
const CF_FTP_SFTP = vendor('cloudflare-spectrum-ftp', CF_FTP_URL, 'SFTP', 'Unlike%20FTP%20or%20FTPS');
const CF_GLOSSARY_SFTP = vendor('cloudflare-spectrum-glossary', 'https://developers.cloudflare.com/spectrum/glossary/', 'SFTP', 'A%20secure%20file%20transfer%20protocol');
const GOOGLE_SFTP = vendor('google-merchant-sftp', 'https://support.google.com/merchants/answer/13813117', 'How to submit product data sources using SFTP', 'SFTP%20stands%20for%20SSH%20File%20Transfer%20Protocol');
const CISCO_CHANNELS = vendor(
  'cisco-asa-inspect-basic',
  'https://www.cisco.com/c/en/us/td/docs/security/asa/asa924/configuration/firewall/asa-924-firewall-config/inspect-basic.html',
  'FTP Inspection Overview',
  'The%20channels%20are%20allocated%20in%20response',
);
const CISCO_ENGINES = vendor(
  'cisco-asa-inspect-overview',
  'https://www.cisco.com/c/en/us/td/docs/security/asa/asa924/configuration/firewall/asa-924-firewall-config/inspect-overview.html',
  'Application Layer Protocol Inspection',
  'Inspection%20engines%20are%20required',
);
const CISCO_TFTP = vendor(
  'cisco-router-upgrade',
  'https://www.cisco.com/c/en/us/support/docs/routers/3800-series-integrated-services-routers/49044-sw-upgrade-proc-ram.html',
  'Background Information',
  'The%20most%20commonly%20used%20protocol',
);
const R1579_NEW = rfcText('rfc-1579', 1579, 'Overview and Rational', 'A%20new%20connection%20is%20used');
const R1579_PASV = rfcText('rfc-1579', 1579, 'Overview and Rational', 'If%2C%20on%20the%20other%20hand%2C%20clients%20use%20the%20PASV');
const R1579_ACTIVE = rfcText('rfc-1579', 1579, 'Overview and Rational', 'By%20default%2C%20this%20connection%20is%20set%20up%20by%20an%20active%20open');
const R1579_OPEN = rfcText('rfc-1579', 1579, 'Overview and Rational', 'If%20the%20client%20sends%20a%20PASV%20command');

const PALO_URL = 'https://www.paloaltonetworks.com/cyberpedia/what-is-layer-7';
const PALO_L7_FTP = vendor('paloalto-layer-7', PALO_URL, 'How does Layer 7 handle different application protocols?', 'FTP%20for%20file%20transfers');
const PALO_L7_DEF = vendor('paloalto-layer-7', PALO_URL, 'What Is Layer 7?', 'Layer%207%20is%20the%20application%20layer');
const CF_SSH_L7 = vendor(
  'cloudflare-ssh',
  'https://www.cloudflare.com/learning/access-management/what-is-ssh/',
  'How does SSH contrast with other protocols for tunneling?',
  'like%20HTTP%2C%20FTP%2C%20and%20SMTP',
);

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50961';
const FILES = '203.0.113.21:21';
const LAPTOP_DATA = '192.168.1.100:50962';
const FILES_DATA = '203.0.113.21:50000';

const readable: TableDef = {
  id: 'readable',
  title: 'What someone watching can read',
  by: 'FTP has no seal',
  columns: [
    { key: 'message', label: 'Message' },
    { key: 'reads', label: 'They can read', prose: true },
  ],
  keyColumn: 'message',
  markLabel: 'exposed',
  initialRows: [],
  empty: 'Nothing yet. Nothing has been sent.',
};

const mockup = messagesFor(readable);

/** The mockup's message, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-ftp',
  title: 'FTP',
  subtitle: 'Moving files',
  level: 'beginner',
  certTags: [],
  summary:
    'FTP is one of the oldest internet protocols, made for moving files between computers. It uses two lines, one for commands and one for the file, and it sends everything as plain text, passwords included.',
  figure: 'net-map',
  backing: { traces: ['why-1', 'lead-1', 'term-plain'] },
  units: [
    {
      id: 'ftp',
      name: 'FTP',
      fullName: 'File Transfer Protocol',
      purpose: 'Moving files',
      group: 'app',
      // No standard puts FTP at an OSI layer (RFC 959 predates the model), so the badge rests on two vendors’ own pages.
      osi: { layers: [7], cite: [PALO_L7_FTP, PALO_L7_DEF, CF_SSH_L7] },
      backing: { traces: ['fact-name', 'fact-defined', 'why-1', 'lead-1'] },
      scene: {
        title: 'One line for commands, another for the file',
        views: ['network', 'sequence'],
        layers: ['ftp:files'],
        labels: { laptop: 'Uploading report.pdf', url: 'Files' },
        start: [],
        panel: { type: 'table', table: readable },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'files', label: 'File server', addr: '203.0.113.21' },
        ],
        backing: { traces: ['lead-1', 'term-control', 'term-data', 'term-port', 'term-plain'] },
      },
      overview: {
        hook: 'FTP is one of the oldest internet protocols, made for moving files between computers. It uses two lines, one for commands and one for the file, and it sends everything as plain text, passwords included.',
        hookBacking: { traces: ['why-1', 'lead-1', 'term-plain'] },
        description:
          'It’s like phoning a warehouse to arrange a delivery. You talk on the phone, “I’m sending a box, which door?”, and the box goes in through a separate loading door. FTP works the same way: one connection for talking and another for each file. Here you upload report.pdf to files.example.net.',
        backing: { traces: ['term-control', 'term-data', 'fact-each-file'] },
        facts: [
          { label: 'Used for', value: 'moving files to and from servers', backing: { traces: ['why-1', 'term-stor'] } },
          { label: 'Ports', value: '21 for commands, another for each file', backing: { traces: ['term-port', 'fact-each-file'] } },
          { label: 'Modes', value: 'passive (usual) and active', backing: { traces: ['fact-modes'] } },
          { label: 'Encrypted?', value: 'no; use SFTP or FTPS', backing: { traces: ['fact-encrypted', 'fact-safer'] } },
          { label: 'OSI layer', value: '7, application', backing: { traces: ['fact-osi'] } },
          { label: 'This example', value: 'report.pdf to files.example.net', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'control-connection',
          title: 'Control Connection',
          sub: 'Open the command line',
          narrative:
            'Your file app connects to the file server on **port 21**. After the usual TCP hello, the server greets you: “220, ready.” This first connection is the **control connection**. Commands and replies travel on it as short lines of plain text, but no files ever do.',
          deep: [
            {
              text: 'FTP replies use three-digit codes like SMTP’s: 1xx started, 2xx done, 3xx need more, 4xx try later, 5xx failed.',
              cite: [d959('4.2', 37), r('rfc-5321', '4.2.1')],
            },
            {
              text: 'The control connection stays open for the whole session.',
              cite: [d959('2.3', 9)],
            },
          ],
          facts: [
            { label: 'To', value: 'files.example.net, 203.0.113.21', backing: { example: true } },
            { label: 'Port', value: '21', backing: { traces: ['term-port'] } },
            { label: 'Carries', value: 'commands and replies only', backing: { traces: ['term-control', 'term-data'] } },
            { label: 'Greeting', value: '220 ready', backing: { traces: ['deep-1', 'term-control'] } },
          ],
          events: [
            ...msgOf('fact-tcp', 'term-port')({
              tag: 'SYN',
              from: 'laptop',
              to: 'files',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.000s',
              src: LAPTOP,
              dst: FILES,
              size: '—',
              sum: 'Hello, can we talk?',
              info: 'SYN',
            }),
            ...msgOf('fact-tcp', 'term-port')({
              tag: 'SYN-ACK',
              from: 'files',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '0.026s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes, I hear you.',
              info: 'SYN-ACK',
            }),
            ...msgOf('fact-tcp', 'term-port', 'term-control')({
              tag: 'ACK',
              from: 'laptop',
              to: 'files',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.026s',
              src: LAPTOP,
              dst: FILES,
              size: '—',
              sum: 'Connected.',
              info: 'ACK',
              st: 'Connecting',
              conn: ['open', 'laptop>files'],
            }),
            ...msgOf('deep-1', 'term-control', 'term-port', 'fact-tcp')({
              tag: '220',
              from: 'files',
              to: 'laptop',
              proto: 'FTP',
              via: 'TCP',
              kind: 'response',
              time: '0.055s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: '220: files.example.net, ready.',
              info: '220 files.example.net FTP server ready',
              st: 'Connected',
              known: true,
              rows: [{ key: '220', cells: ['Greeting', 'the server’s name and software'] }],
            }),
          ],
          backing: { traces: ['term-port', 'fact-tcp', 'deep-1', 'term-control', 'term-data', 'term-plain'] },
        },
        {
          id: 'plaintext-login',
          title: 'Plaintext Login',
          sub: 'Log in, in plain sight',
          narrative:
            'Your app logs in: **USER** alex, then **PASS** and the password. The server replies 230, you’re in. The trouble is that FTP has no seal. Your name and password cross the network as **plain text**, readable by anyone on the way. Look at the table under the map.',
          deep: [
            {
              text: '331 means “user name OK, now the password”; 230 means logged in; 530 means the login failed.',
              cite: [d959('4.2.1', 40)],
            },
            {
              text: 'Anonymous FTP accepts the user anonymous with any password.',
              cite: [rfcText('rfc-1635', 1635, 'What is Anonymous FTP?', 'Traditionally%2C%20this%20special'), MS_ANON],
            },
            {
              text: 'FTPS adds TLS to FTP (AUTH TLS).',
              cite: [d('rfc-4217', '3'), d('rfc-4217', '4.2')],
            },
            {
              text: 'SFTP is a different protocol altogether, which runs inside SSH on port 22.',
              cite: [MS_SFTP_CONNECTOR, CF_GLOSSARY_SFTP, MS_AZURE_SFTP, CF_FTP_SFTP, r('rfc-4253', '4.1')],
            },
          ],
          facts: [
            { label: 'Commands', value: 'USER alex, PASS sunflower7', backing: { traces: ['term-login'] } },
            { label: 'Replies', value: '331 need password, 230 logged in', backing: { traces: ['deep-1'] } },
            { label: 'Sealed?', value: 'no: plain text', backing: { traces: ['fact-encrypted', 'term-plain'] } },
            { label: 'Safer', value: 'SFTP or FTPS', backing: { traces: ['fact-safer'] } },
          ],
          events: [
            ...msgOf('term-login', 'term-plain', 'term-port', 'fact-tcp')({
              tag: 'USER',
              from: 'laptop',
              to: 'files',
              proto: 'FTP',
              via: 'TCP',
              kind: 'request',
              time: '0.056s',
              src: LAPTOP,
              dst: FILES,
              size: '—',
              sum: 'USER alex.',
              info: 'USER alex',
              rows: [{ key: 'user', cells: ['USER', 'your user name: alex'] }],
            }),
            ...msgOf('deep-1', 'term-login', 'term-port', 'fact-tcp')({
              tag: '331',
              from: 'files',
              to: 'laptop',
              proto: 'FTP',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.082s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: '331: OK, now your password.',
              info: '331 Password required for alex',
            }),
            ...msgOf('term-login', 'term-plain', 'term-port', 'fact-tcp')({
              tag: 'PASS',
              from: 'laptop',
              to: 'files',
              proto: 'FTP',
              via: 'TCP',
              kind: 'request',
              time: '0.083s',
              src: LAPTOP,
              dst: FILES,
              size: '—',
              sum: 'PASS sunflower7. In plain text, for anyone on the way to read.',
              info: 'PASS sunflower7',
              rows: [{ key: 'pass', cells: ['PASS', 'your password: sunflower7'], miss: true }],
            }),
            ...msgOf('deep-1', 'fact-encrypted', 'term-login', 'term-port', 'fact-tcp')({
              tag: '230',
              from: 'files',
              to: 'laptop',
              proto: 'FTP',
              via: 'TCP',
              kind: 'response',
              time: '0.121s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: '230: you’re logged in.',
              info: '230 User alex logged in',
              st: 'Logged in, not sealed',
              known: true,
            }),
          ],
          backing: { traces: ['term-login', 'deep-1', 'term-plain', 'lead-1', 'fact-encrypted', 'fact-safer'] },
        },
        {
          id: 'passive-mode',
          title: 'Passive Mode',
          sub: '“Connect to me here”',
          narrative:
            'Files don’t travel on the command line: each one gets a line of its own. Your app sends **PASV**: “passive mode, please. Tell me where to connect for the data.” The server answers with an address and a port: 203.0.113.21, port 50000. That’s **passive mode**. The laptop makes the second connection itself, which works through home routers.',
          deep: [
            {
              text: 'The 227 reply spells the port as two numbers: (203,0,113,21,195,80) means port 195 × 256 + 80 = 50000.',
              cite: [d959('4.2.1', 40), d959('4.1.2', 28)],
            },
            {
              text: 'In active mode (the PORT command), the server connects back to the client instead, which NAT and firewalls usually block.',
              cite: [d959('3.2', 18), R1579_ACTIVE, CF_FTP_OPERATES],
            },
            {
              text: 'EPSV is the modern form, and works with IPv6.',
              cite: [d('rfc-2428', '1'), d('rfc-2428', '3'), CF_FTP_EPSV],
            },
          ],
          facts: [
            { label: 'Command', value: 'PASV', backing: { traces: ['term-pasv'] } },
            { label: 'Reply', value: '227 (203,0,113,21,195,80)', backing: { traces: ['fact-codes', 'term-pasv'] } },
            { label: 'Means', value: 'connect to port 50000', backing: { traces: ['fact-codes', 'term-pasv'] } },
            { label: 'Active mode', value: 'the server connects to you, often blocked', backing: { traces: ['fact-modes'] } },
          ],
          events: [
            ...msgOf('term-pasv', 'term-port', 'fact-tcp')({
              tag: 'PASV',
              from: 'laptop',
              to: 'files',
              proto: 'FTP',
              via: 'TCP',
              kind: 'request',
              time: '0.122s',
              src: LAPTOP,
              dst: FILES,
              size: '—',
              sum: 'Passive mode, please. Where do I connect for the data?',
              info: 'PASV',
            }),
            ...msgOf('deep-1', 'fact-codes', 'term-pasv', 'term-port', 'fact-tcp')({
              tag: '227',
              from: 'files',
              to: 'laptop',
              proto: 'FTP',
              via: 'TCP',
              kind: 'response',
              time: '0.148s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: '227: connect to me at 203.0.113.21, port 50000.',
              info: '227 Entering Passive Mode (203,0,113,21,195,80)',
              st: 'Data port 50000',
              known: true,
              rows: [{ key: '227', cells: ['227 reply', 'the data port, 50000'] }],
            }),
          ],
          backing: { traces: ['fact-each-file', 'term-pasv', 'fact-codes', 'fact-modes', 'term-control', 'term-data'] },
        },
        {
          id: 'data-connection',
          title: 'Data Connection',
          sub: 'A second line for the file',
          narrative:
            'The laptop opens a second TCP connection, this time to port 50000: the **data connection**. Now there are two lines between you and the server, one for talking and one for the file. Then, on the command line, your app says **STOR report.pdf**, store this file, and the server answers 150: ready, send it.',
          deep: [
            {
              text: 'Each file, and each directory listing (LIST), gets a data connection of its own, opened and closed every time.',
              cite: [CISCO_CHANNELS, d959('4.1.3', 32), R1579_NEW, d959('3.3', 19)],
            },
            {
              text: 'TYPE I (binary) or TYPE A (text) is set first; binary sends the bytes exactly as they are.',
              cite: [d959('4.1.2', 28), d959('4.1.2', 27), d959('3.1.1.3', 12), d('rfc-3659', '5.1')],
            },
            {
              text: 'RETR downloads a file and STOR uploads one.',
              cite: [d959('4.1.3', 30)],
            },
          ],
          facts: [
            { label: 'Data line', value: '192.168.1.100:50962 to 203.0.113.21:50000', backing: { traces: ['term-data', 'fact-tcp', 'fact-codes'] } },
            { label: 'Command', value: 'STOR report.pdf', backing: { traces: ['term-stor'] } },
            { label: 'Reply', value: '150: opening the data connection', backing: { traces: ['deep-1'] } },
            { label: 'Lines open', value: 'two', backing: { traces: ['lead-1', 'term-data'] } },
          ],
          events: [
            ...msgOf('fact-tcp', 'term-data', 'fact-codes')({
              tag: 'SYN',
              from: 'laptop',
              to: 'files',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.149s',
              src: LAPTOP_DATA,
              dst: FILES_DATA,
              size: '—',
              sum: 'Hello, can we talk?',
              info: 'SYN',
            }),
            ...msgOf('fact-tcp', 'term-data', 'fact-codes')({
              tag: 'SYN-ACK',
              from: 'files',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '0.175s',
              src: FILES_DATA,
              dst: LAPTOP_DATA,
              size: '—',
              sum: 'Yes, I hear you.',
              info: 'SYN-ACK',
            }),
            ...msgOf('fact-tcp', 'term-data', 'fact-codes', 'lead-1')({
              tag: 'ACK',
              from: 'laptop',
              to: 'files',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.175s',
              src: LAPTOP_DATA,
              dst: FILES_DATA,
              size: '—',
              sum: 'Connected.',
              info: 'ACK',
              st: 'Two lines open',
              known: true,
              conn: ['open', 'laptop>files', 'data'],
            }),
            ...msgOf('term-stor', 'term-port', 'fact-tcp')({
              tag: 'STOR',
              from: 'laptop',
              to: 'files',
              proto: 'FTP',
              via: 'TCP',
              kind: 'request',
              time: '0.176s',
              src: LAPTOP,
              dst: FILES,
              size: '—',
              sum: 'STOR report.pdf: here comes a file.',
              info: 'STOR report.pdf',
              rows: [{ key: 'stor', cells: ['STOR', 'the file’s name: report.pdf'] }],
            }),
            ...msgOf('deep-1', 'term-stor', 'term-port', 'fact-tcp')({
              tag: '150',
              from: 'files',
              to: 'laptop',
              proto: 'FTP',
              via: 'TCP',
              kind: 'response',
              time: '0.202s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: '150: OK, send it on the data line.',
              info: '150 Opening data connection for report.pdf',
              st: 'Ready to send',
            }),
          ],
          backing: { traces: ['term-data', 'fact-tcp', 'lead-1', 'term-stor', 'deep-1', 'term-port', 'fact-codes'] },
        },
        {
          id: 'file-transfer',
          title: 'File Transfer',
          sub: 'The file comes across',
          narrative:
            'The file goes over the data connection: 2.4 MB, in many TCP pieces, shown on the map as one tag. When the last byte is sent, the laptop closes the data connection, and that closing is how the server knows the file is complete. On the command line the server confirms: “226, transfer complete.” Like the password, the whole file crossed as readable data.',
          deep: [
            {
              text: 'In stream mode, closing the data connection marks the end of the file.',
              cite: [d959('3.3', 19), d959('3.4.1', 21)],
            },
            {
              text: 'REST lets an interrupted transfer carry on from a byte offset.',
              cite: [d('rfc-3659', '5.1'), d('rfc-3659', '5.2')],
            },
            {
              text: 'The server keeps your current directory (CWD, PWD) on the control connection.',
              cite: [d959('4.1.1', 26), d959('4.1.3', 32)],
            },
          ],
          facts: [
            { label: 'Sent', value: 'report.pdf, 2.4 MB', backing: { example: true } },
            { label: 'End of file', value: 'the data connection closes', backing: { traces: ['fact-each-file'] } },
            { label: 'Reply', value: '226 transfer complete', backing: { traces: ['deep-1'] } },
            { label: 'Readable on the way', value: 'yes, all of it', backing: { traces: ['term-plain', 'lead-1'] } },
          ],
          events: [
            ...msgOf('term-data', 'term-plain', 'fact-tcp', 'fact-each-file')({
              tag: 'FILE',
              from: 'laptop',
              to: 'files',
              proto: 'FTP',
              via: 'TCP',
              kind: 'request',
              time: '0.203s',
              src: LAPTOP_DATA,
              dst: FILES_DATA,
              size: '2.4 MB',
              sum: 'report.pdf, all 2.4 MB of it, on the data line.',
              info: 'Data connection: report.pdf, 2.4 MB',
              st: 'Uploading',
              rows: [{ key: 'file', cells: ['The file', 'all of report.pdf'], miss: true }],
            }),
            ...msgOf('fact-tcp', 'fact-each-file', 'term-data')({
              tag: 'FIN',
              from: 'laptop',
              to: 'files',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '1.142s',
              src: LAPTOP_DATA,
              dst: FILES_DATA,
              size: '—',
              sum: 'That’s everything: closing the data line.',
              info: 'FIN: data connection closed',
              conn: ['close', 'laptop>files', 'data'],
            }),
            ...msgOf('deep-1', 'term-control', 'term-port', 'fact-tcp')({
              tag: '226',
              from: 'files',
              to: 'laptop',
              proto: 'FTP',
              via: 'TCP',
              kind: 'response',
              time: '1.170s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: '226: transfer complete.',
              info: '226 Transfer complete',
              st: 'report.pdf uploaded',
              known: true,
            }),
          ],
          backing: { traces: ['term-data', 'fact-tcp', 'fact-each-file', 'deep-1', 'term-plain', 'lead-1', 'term-control'] },
        },
        {
          id: 'session-close',
          title: 'Session Close',
          sub: 'Hang up',
          narrative:
            'Your app says **QUIT**, the server replies 221, goodbye, and the control connection closes too. A safer choice today is **SFTP**, which does the same job inside a sealed SSH connection. Where FTP is still used, the advice is to switch to FTPS or SFTP, so nothing crosses in plain text.',
          deep: [
            {
              text: 'SFTP (the SSH File Transfer Protocol, port 22) is a separate protocol from FTP, built on SSH.',
              cite: [MS_AZURE_SFTP, GOOGLE_SFTP, MS_SFTP_CONNECTOR, CF_GLOSSARY_SFTP, CF_FTP_SFTP, r('rfc-4253', '4.1')],
            },
            {
              text: 'FTPS is FTP with TLS, on port 21 with AUTH TLS, or 990 with TLS from the start.',
              cite: [d('rfc-4217', '4'), IANA_PORTS, MS_FTPS_PORTS],
            },
            {
              text: 'TFTP (UDP 69) is a tiny protocol of its own, with no login, used to load software onto devices over the network.',
              cite: [d('rfc-1350', '1'), d('rfc-1350', '4'), IANA_PORTS, CISCO_TFTP, MS_PXE],
            },
          ],
          facts: [
            { label: 'Command', value: 'QUIT', backing: { traces: ['pattern', 'deep-1'] } },
            { label: 'Reply', value: '221 goodbye', backing: { traces: ['deep-1'] } },
            { label: 'Use instead', value: 'SFTP (port 22) or FTPS', backing: { traces: ['fact-safer', 'term-sftp'] } },
            { label: 'Cousin', value: 'TFTP, UDP 69', backing: { traces: ['fact-tftp'] } },
          ],
          events: [
            ...msgOf('pattern', 'deep-1', 'term-control', 'term-port', 'fact-tcp')({
              tag: 'QUIT',
              from: 'laptop',
              to: 'files',
              proto: 'FTP',
              via: 'TCP',
              kind: 'request',
              time: '1.171s',
              src: LAPTOP,
              dst: FILES,
              size: '—',
              sum: 'Goodbye.',
              info: 'QUIT',
            }),
            ...msgOf('deep-1', 'term-control', 'term-port', 'fact-tcp')({
              tag: '221',
              from: 'files',
              to: 'laptop',
              proto: 'FTP',
              via: 'TCP',
              kind: 'response',
              time: '1.197s',
              src: FILES,
              dst: LAPTOP,
              size: '—',
              sum: '221: goodbye.',
              info: '221 Goodbye',
              st: 'Done',
              done: true,
              conn: ['close', 'laptop>files'],
            }),
          ],
          backing: { traces: ['pattern', 'deep-1', 'term-control', 'fact-safer', 'term-sftp', 'term-plain'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'FTP talks on one line and moves files on another, and everything on both, the password included, is plain text.',
            cite: [d959('2.2', 4), R2577_PLAIN, R2228_PLAIN, MS_FTPS],
          },
        ],
        terms: [
          { id: 'term-control', idea: 'The line for commands and replies', name: 'Control connection', cite: [d959('2.2', 4)] },
          { id: 'term-port', idea: 'The door for commands', name: 'Port 21', cite: [d959s('8'), IANA_PORTS] },
          { id: 'term-login', idea: 'Log in', name: 'USER, PASS', cite: [d959('4.1.1', 25), d959('4.1.1', 26)] },
          {
            id: 'term-pasv',
            idea: '“Tell me where to connect for the data”',
            name: 'Passive mode (PASV)',
            cite: [d959('4.1.2', 28)],
          },
          { id: 'term-data', idea: 'The separate line for a file', name: 'Data connection', cite: [d959('2.2', 4), d959('4.1.3', 29)] },
          { id: 'term-stor', idea: 'Upload a file, or download one', name: 'STOR, RETR', cite: [d959('4.1.3', 30)] },
          { id: 'term-plain', idea: 'Readable by anyone on the way', name: 'Plain text', cite: [R2577_PLAIN, R2577_PASS, R2228_PLAIN, MS_FTPS] },
          {
            id: 'term-sftp',
            idea: 'File transfer inside a sealed SSH connection',
            name: 'SFTP',
            cite: [MS_SFTP_CONNECTOR, CF_GLOSSARY_SFTP, GOOGLE_SFTP],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Control Connection', 'Login', 'PASV', 'Data Connection', 'Transfer', 'QUIT'],
          note: 'Every FTP transfer goes this way: commands on one line, the file on a second.',
          cite: [d959('2.2', 4), d959('4.1.1', 25), d959('4.1.2', 28), d959('4.1.3', 29), d959('4.1.3', 30), d959('4.1.1', 27)],
        },
        why: [
          {
            id: 'why-1',
            text: 'FTP was first built in the 1970s, to move files between computers on the ARPANET.',
            cite: [d959('2.1', 2)],
          },
          {
            id: 'why-2',
            text: 'It’s worth knowing for two reasons: its two-line design, and as the classic lesson in why plain text and passwords don’t mix.',
            cite: [d959('2.2', 4), R2228_PLAIN, R2577_PASS],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'Codes worth knowing: 220 ready, 331 need password, 230 logged in, 227 passive, 150 opening data connection, 226 transfer complete, 221 goodbye, 530 not logged in.',
            cite: [d959('4.2.1', 40), d959('4.2.1', 41)],
          },
          {
            id: 'deep-2',
            text: 'Active mode sends data from the server’s port 20.',
            cite: [d959('5.2', 44), d959s('8'), IANA_PORTS, MS_FW_ACTIVE],
          },
          {
            id: 'deep-3',
            text: 'FTP’s extra data connections are hard for firewalls, which need FTP helpers to open the right ports.',
            cite: [MS_FW_HARD, MS_FW_FILTERS, CISCO_ENGINES],
          },
        ],
        facts: [
          {
            id: 'fact-ports',
            label: 'Ports',
            value: '21 control, 20 active data, a high port for passive',
            cite: [d959s('8'), d959('5.2', 44), IANA_PORTS, MS_FW_RANGE, R1579_OPEN],
          },
          {
            id: 'fact-codes',
            label: 'Codes',
            value: '220, 331, 230, 227, 150, 226, 221; in 227 the port is the fifth number × 256 + the sixth',
            cite: [d959('4.2.1', 40), d959('4.2.1', 41), d959('4.1.2', 28)],
          },
          { id: 'fact-encrypted', label: 'Encrypted?', value: 'no', cite: [R2577_PLAIN, R2228_PLAIN, MS_FTPS] },
          {
            id: 'fact-safer',
            label: 'Safer',
            value: 'SFTP (22), FTPS (990)',
            cite: [MS_FTPS, GOOGLE_SFTP, MS_AZURE_SFTP, IANA_PORTS, d('rfc-4217', '3')],
          },
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 959', cite: [d959s('1')] },
          {
            id: 'fact-tcp',
            label: 'Runs on',
            value: 'TCP, inside IP: each connection opens with a handshake of three messages (SYN, SYN-ACK, ACK), carries the data in pieces, and closes with FIN',
            cite: [d959s('8'), d('rfc-9293', '3.5'), d('rfc-9293', '2.2'), d('rfc-9293', '3.1')],
          },
          {
            id: 'fact-modes',
            label: 'Modes',
            value: 'passive (usual): the client opens the data connection, which gets through home routers; active: the server connects back from port 20, often blocked',
            cite: [d959('4.1.2', 28), d959('5.2', 44), R1579_PASV, R1579_ACTIVE, MS_FW_PASSIVE, CF_FTP_OPERATES],
          },
          {
            id: 'fact-each-file',
            label: 'Each file',
            value: 'gets a data connection of its own, and the sender closes it to mark the end of the file',
            cite: [d959('3.3', 19), d959('3.4.1', 21), R1579_NEW, CISCO_CHANNELS],
          },
          {
            id: 'fact-tftp',
            label: 'Cousin',
            value: 'TFTP: a tiny separate protocol on UDP port 69, with no login',
            cite: [d('rfc-1350', '1'), d('rfc-1350', '4'), IANA_PORTS],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '7, application', cite: [PALO_L7_FTP, PALO_L7_DEF, CF_SSH_L7] },
          { id: 'fact-name', label: 'Stands for', value: 'File Transfer Protocol', cite: [R959_INTRO] },
        ],
      },
      practice: [
        {
          id: 'second-connection',
          prompt: 'Why does FTP open a second connection?',
          options: [
            {
              text: 'In case the first one fails.',
              feedback: 'Not quite. The second one isn’t a spare. It carries the file, while the first carries the commands.',
              cite: [d959('2.2', 4), d959('4.1.3', 29)],
            },
            {
              text: 'Commands go on one line and each file on another.',
              feedback: 'Right. The control connection talks; the data connection carries the file.',
              cite: [d959('2.2', 4), d959('3.3', 19), R1579_NEW],
            },
            {
              text: 'To encrypt the file.',
              feedback: 'Not quite. Neither FTP line is encrypted.',
              cite: [R2577_PLAIN, R2228_PLAIN, MS_FTPS],
            },
          ],
          answer: 1,
        },
        {
          id: 'wifi-login',
          prompt: 'Someone on the same Wi-Fi watches your FTP login. What can they read?',
          options: [
            {
              text: 'Your user name and your password.',
              feedback: 'Yes. FTP sends both as plain text. That’s why SFTP and FTPS are the safer choices.',
              cite: [R2577_PASS, R2228_PLAIN, R2577_PLAIN, MS_FTPS, GOOGLE_SFTP],
            },
            {
              text: 'Only that you used FTP.',
              feedback: 'Not quite. With no seal, they can read everything, the password included.',
              cite: [R2577_PLAIN, R2228_PLAIN, MS_FTPS],
            },
            {
              text: 'Nothing: FTP passwords are hidden.',
              feedback: 'Not quite. FTP has no encryption. The password crosses as plain text.',
              cite: [R2577_PASS, R2228_PLAIN, d959('4.1.1', 26), MS_FTPS],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
