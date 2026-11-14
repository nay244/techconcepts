import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * The glossary group web (job 10, batch 3): ten entries on how a browser asks for a page and what comes back.
 * Written from the analyst's report and the orchestrator's rulings in it. A citation is marked defining only where
 * the document defines the thing the statement is about: RFC 9110, RFC 9112, RFC 3986 and WHATWG's URL and HTML
 * Standards here; never RFC 4949, RFC 8555 or a vendor's page.
 */

const d = (source: string, section: string) => cite(source, section, { defining: true });
const rfc = (source: string, section: string) => cite(source, section);

const R9110_ABSTRACT = cite('rfc-9110', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc9110.html#abstract', defining: true });

/** RFC 4949 is a glossary with no section anchors, so a section is cited by the page its entry is on. */
const R4949 = 'https://www.rfc-editor.org/rfc/rfc4949.html';
const r4949 = (page: number) => cite('rfc-4949', '4', { url: `${R4949}#page-${page}` });

const HTML = 'https://html.spec.whatwg.org/index.html';
const html = (section: string, fragment: string) => cite('whatwg-html', section, { url: `${HTML}#${fragment}`, defining: true });
const URL_STANDARD = 'https://url.spec.whatwg.org/index.html';
const URL_REPRESENTATION = cite('whatwg-url', '4.1', { url: `${URL_STANDARD}#url-representation`, defining: true });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });
const EDGE_FIRST = 'https://support.microsoft.com/en-us/edge/secure-your-web-browsing-with-https-first-mode-in-microsoft-edge';
const EDGE_HTTP = vendor('microsoft-edge-https-first', EDGE_FIRST, 'What are HTTP and HTTPS?', 'What%20are%20HTTP%20and%20HTTPS');
const EDGE_SECURE = 'https://support.microsoft.com/en-us/edge/securely-browse-the-web-in-microsoft-edge';
const EDGE_ICON = vendor('microsoft-edge-secure', EDGE_SECURE, 'Verify the connection icon in the address bar', 'Verify%20the%20connection%20icon%20in%20the%20address%20bar');
const CHROME_SECURE = 'https://support.google.com/chrome/answer/95617';
const CHROME_SYMBOLS = vendor('google-chrome-secure', CHROME_SECURE, 'What each security symbol means', 'What%20each%20security%20symbol%20means');
const CF_MIXED = vendor(
  'cloudflare-mixed-content',
  'https://developers.cloudflare.com/ssl/troubleshooting/mixed-content-errors/',
  'Mixed content errors',
  'Mixed%20content%20errors',
);

export default defineGlossaryGroup({
  id: 'web',
  entries: [
    {
      id: 'http',
      term: 'HTTP',
      also: ['Hypertext Transfer Protocol'],
      definition: [
        {
          id: 'http-1',
          text: 'HTTP, the Hypertext Transfer Protocol, is the main protocol of the World Wide Web: the one a browser uses to talk to web servers.',
          cite: [R9110_ABSTRACT, d('rfc-9110', '1.2'), EDGE_HTTP],
        },
        {
          id: 'http-2',
          text: 'It works by request and response: a client sends a request, and the server answers with a response that carries a status code.',
          cite: [d('rfc-9110', '1.1'), d('rfc-9110', '3.4')],
        },
        {
          id: 'http-3',
          text: 'It is stateless: each request can be understood on its own.',
          cite: [d('rfc-9110', '3.3')],
        },
      ],
    },
    {
      id: 'client',
      term: 'Client',
      definition: [
        {
          id: 'client-1',
          text: 'A client is the side that asks: a program that requests a service from another, the server, and uses the answer.',
          cite: [r4949(66), d('rfc-9110', '3.3')],
        },
        {
          id: 'client-2',
          text: 'On the web, the most familiar client is a browser sending HTTP requests to web servers.',
          cite: [d('rfc-9110', '3.5'), r4949(41)],
        },
        {
          id: 'client-3',
          text: 'Client and server are roles: the same program can be a client on one connection and a server on another.',
          cite: [d('rfc-9110', '3.3'), r4949(66)],
        },
      ],
      lessons: [{ lesson: 'what-is-http', term: 'term-client' }],
    },
    {
      id: 'url',
      term: 'URL',
      also: ['Uniform Resource Locator', 'Web address'],
      definition: [
        {
          id: 'url-1',
          text: 'A URL, or Uniform Resource Locator, is a web address: it identifies a resource, such as a page or file, and says how to reach it.',
          cite: [d('rfc-3986', '1.1.3'), EDGE_HTTP, r4949(327)],
        },
        {
          id: 'url-2',
          text: 'It has parts: a scheme such as https, a host with an optional port, a path, and sometimes a query and a fragment.',
          cite: [d('rfc-3986', '3'), d('rfc-3986', '3.2'), URL_REPRESENTATION, d('rfc-9110', '4.2')],
        },
      ],
      lessons: [{ lesson: 'what-is-http', term: 'term-url' }],
    },
    {
      id: 'path',
      term: 'Path',
      definition: [
        {
          id: 'path-1',
          text: 'In a URL, the path is the part after the host, such as /docs/page.html, that says which resource on that server is meant.',
          cite: [d('rfc-3986', '3.3'), d('rfc-3986', '3'), cite('whatwg-url', '4.1', { url: `${URL_STANDARD}#url-representation` })],
        },
        {
          id: 'path-2',
          text: 'It is usually names separated by slashes, and it ends at the first ? or #.',
          cite: [d('rfc-3986', '3.3')],
        },
        {
          id: 'path-3',
          text: 'In an HTTP request, the client sends the path, with any query, to the server.',
          cite: [d('rfc-9112', '3.2.1'), d('rfc-9110', '4.2.1')],
        },
      ],
      lessons: [{ lesson: 'what-is-http', term: 'term-path' }],
    },
    {
      id: 'method',
      term: 'Method',
      also: ['Request method'],
      definition: [
        {
          id: 'method-1',
          text: 'A method, or request method, is the part of an HTTP request that says what the client wants done with the resource it names, such as GET to fetch a copy.',
          cite: [d('rfc-9110', '9.1'), d('rfc-9110', '9.3.1')],
        },
        {
          id: 'method-2',
          text: 'Other standard methods include HEAD, POST, PUT and DELETE; POST sends data for the server to process.',
          cite: [d('rfc-9110', '9.1'), d('rfc-9110', '9.3.3')],
        },
        {
          id: 'method-3',
          text: 'Method names are case-sensitive and by convention written in capitals.',
          cite: [d('rfc-9110', '9.1')],
        },
      ],
      lessons: [{ lesson: 'what-is-http', term: 'term-method' }],
    },
    {
      id: 'status-code',
      term: 'Status code',
      definition: [
        {
          id: 'status-code-1',
          text: 'A status code is the three-digit number in an HTTP response that says how the request went, such as 200 (OK) or 404 (Not Found).',
          cite: [d('rfc-9110', '15'), d('rfc-9110', '15.3.1'), d('rfc-9110', '15.5.5')],
        },
        {
          id: 'status-code-2',
          text: 'Its first digit gives the class: 1xx informational, 2xx successful, 3xx redirection, 4xx a client error, 5xx a server error.',
          cite: [d('rfc-9110', '15')],
        },
      ],
      lessons: [{ lesson: 'what-is-http', term: 'term-status' }],
    },
    {
      id: 'html',
      term: 'HTML',
      also: ['Hypertext Markup Language'],
      definition: [
        {
          id: 'html-1',
          text: 'HTML, the Hypertext Markup Language, is the web’s core markup language: the text that describes the structure of a web page.',
          cite: [
            html('1.3', 'background'),
            r4949(145),
            cite('nist-sp800-41r1', 'Appendix B', { url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf#page=45' }),
          ],
        },
        {
          id: 'html-2',
          text: 'A page is written as a tree of elements and text, each element marked by tags such as <body> and </body>.',
          cite: [html('1.10', 'a-quick-introduction-to-html')],
        },
        {
          id: 'html-3',
          text: 'Elements can link to other pages and files, which makes it hypertext.',
          cite: [html('1.10', 'a-quick-introduction-to-html'), r4949(145)],
        },
      ],
      lessons: [
        { lesson: 'what-is-http', term: 'term-html' },
        { lesson: 'what-is-https', term: 'term-html' },
      ],
    },
    {
      id: 'rendering',
      term: 'Rendering',
      definition: [
        {
          id: 'rendering-1',
          text: 'Rendering is how a browser presents a web page: it draws each element of the page’s HTML so that it shows the reader what that element means.',
          cite: [html('15', 'rendering'), html('15.1', 'introduction-17'), html('1.10', 'a-quick-introduction-to-html')],
        },
        {
          id: 'rendering-2',
          text: 'How the page looks comes from its CSS style sheets, which describe how to present it.',
          cite: [html('4.6.8.23', 'link-type-stylesheet'), html('15.1', 'introduction-17')],
        },
      ],
      lessons: [{ lesson: 'what-is-http', term: 'term-rendering' }],
    },
    {
      id: 'https',
      term: 'HTTPS',
      also: ['Hypertext Transfer Protocol Secure'],
      definition: [
        {
          id: 'https-1',
          text: 'HTTPS, the Hypertext Transfer Protocol Secure, is HTTP sent over a connection secured with TLS.',
          cite: [d('rfc-9110', '4.2'), d('rfc-9110', '4.2.2'), d('rfc-9112', '9.7'), EDGE_HTTP],
        },
        {
          id: 'https-2',
          text: 'Secured means the server has proved it acts for the name in the address, and the messages are kept confidential and protected from changes on the way.',
          cite: [d('rfc-9110', '4.2.2')],
        },
        {
          id: 'https-3',
          text: 'An https URL uses port 443 unless it names another port.',
          cite: [d('rfc-9110', '4.2.2')],
        },
      ],
      lessons: [{ lesson: 'what-is-https', term: 'term-https' }],
    },
    {
      id: 'padlock',
      term: 'Padlock',
      definition: [
        {
          id: 'padlock-1',
          text: 'The padlock is the lock icon that browsers such as Microsoft Edge show by the address of a site reached over HTTPS.',
          cite: [EDGE_HTTP, CF_MIXED],
        },
        {
          id: 'padlock-2',
          text: 'It means the connection uses HTTPS and the site’s certificate is valid, so what is sent can’t be intercepted.',
          cite: [EDGE_ICON, CF_MIXED, EDGE_HTTP],
        },
        {
          id: 'padlock-3',
          text: 'It does not prove a site is trustworthy: sites with valid certificates can have a poor reputation.',
          cite: [EDGE_ICON, CHROME_SYMBOLS, rfc('rfc-8555', '1')],
        },
      ],
      lessons: [{ lesson: 'what-is-https', term: 'term-padlock' }],
    },
  ],
});
