```json fact-check
{
  "slug": "glossary/web",
  "base": "7b642fa94c59afd2b963d8dfa7ed500269e43c2e56dd2075673d2fefb9277256",
  "hash": "60da00c747fed197ed67fcde45d45a72daeb594fa8db9f48147e9d7ec8fd8ca2",
  "checked": "2026-11-14",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "entry \"html\": names": "✅",
    "entry \"html\": statement \"html-1\"": "✅",
    "entry \"html\": statement \"html-2\"": "✅",
    "entry \"html\": statement \"html-3\"": "✅",
    "entry \"html\": lessons": "✅"
  },
  "sources": [
    { "id": "nist-sp800-41r1", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-4949", "current": true, "checked": "2026-11-14" },
    { "id": "whatwg-html", "current": true, "checked": "2026-11-14" }
  ],
  "quotes": {
    "checked": "2026-11-14",
    "count": 6,
    "digest": "92b752044ddf1b6e30cf3dfd0dac142968fe1002b2752037067a1c06e3735532",
    "files": {
      "whatwg-html": "ad8adbe54f0e61a79fb513069d172b6a31a4753f002ab7054a6de0d8447ab24c",
      "rfc-4949": "32d1e3837ae5a7d2e99a63f43c6fea3dd350ffc6ac55b3aaadad250546ad7f87",
      "nist-sp800-41r1": "3e8d6457bc4c7af73b417e71003f13c1ce1a3b38be3ab1eea9c4ad143f0cdfc6"
    }
  }
}
```

# Re-check: glossary group `web`

A targeted re-check of the entry `html`, judged whole (its names, its three statements and its lesson tie). Every source was fetched in this run from the publisher's own site.

## The claims

### entry "html": statement "html-1" — ✅

"HTML, the Hypertext Markup Language, is the web's core markup language: the text that describes the structure of a web page." (place 1)

- `whatwg-html` §1.3
  > HTML is the World Wide Web's core markup language.
- `rfc-4949` §4
  > $ Hypertext Markup Language (HTML)
  > (I) A platform-independent system of syntax and semantics (RFC
  > 1866) for adding characters to data files (particularly text
  > files) to represent the data's structure and to point to related
  > data, thus creating hypertext for use in the World Wide Web
- `nist-sp800-41r1` §Appendix B
  > HTML Hypertext Markup Language
- Note: the WHATWG HTML Standard is the Living Standard that defines the HTML language itself (its elements, syntax and parsing); its §1.3 states the core-markup-language part. It does not spell out the full name, so the full name rests on two independent sources: the RFC 4949 glossary entry and the NIST acronym list (different publishers, different documents).
- Note: the structure part is stated by RFC 4949 (adding characters to text to represent its structure, for the Web) and is in line with the defining standard, which describes HTML as a language for describing documents.
- Note: "the text that describes" is a loose, everyday way of saying markup; it leaves out that HTML also describes applications and other documents, not only pages. True for a beginner.
- Note: currency. The HTML Standard is a WHATWG Living Standard, last updated 14 November 2026. RFC 4949 is Informational, obsoletes RFC 2828, and the RFC Editor lists it as neither obsoleted nor updated; its entry cites RFC 1866, an old HTML spec, but the claim itself describes current practice. NIST SP 800-41 Rev. 1 is Final (September 2009) and CSRC does not mark it withdrawn or superseded.

### entry "html": statement "html-2" — ✅

"A page is written as a tree of elements and text, each element marked by tags such as <body> and </body>." (place 2)

- `whatwg-html` §1.10
  > HTML documents consist of a tree of elements and text. Each element is denoted in the source by
  > a start tag, such as "<body>", and
  > an end tag, such as "</body>".
- Note: defining standard. The WHATWG HTML Standard defines HTML's syntax: its elements and their start and end tags.
- Note: it leaves out that some start and end tags may be omitted and implied by other tags, and that the tree is what a browser builds from the nested source. True for a beginner.
- Note: currency as for html-1.

### entry "html": statement "html-3" — ✅

"Elements can link to other pages and files, which makes it hypertext." (place 3)

- `whatwg-html` §1.10
  > In the example below, there
  > is a hyperlink, formed using the a element and its href attribute:
- `rfc-4949` §4
  > $ hypertext
  > (I) A computer document, or part of a document, that contains
  > hyperlinks to other documents; i.e., text that contains active
  > pointers to other text. Usually written in HTML and accessed using
  > a web browser.
- Note: defining standard for the link part. The WHATWG HTML Standard defines the a element and its href attribute, which form a hyperlink. RFC 4949 independently states that a document holding hyperlinks to other documents is hypertext, and (in its HTML entry, quoted under html-1) that HTML points to related data and so creates hypertext.
- Note: "pages and files" is an everyday wording of the sources' "other documents" and "related data". True for a beginner.
- Note: currency as for html-1.

## Names, labels and ties

### entry "html": names — ✅

- Note: both names shown, "HTML" and "Hypertext Markup Language", are given as names of this thing by the entry's own statement html-1, whose cited sources (RFC 4949 and NIST SP 800-41r1) give the full name with the abbreviation.

### entry "html": lessons — ✅

- Note: the lesson term `term-html` in `what-is-http` and in `what-is-https` names HTML, the same thing in the same sense. Its idea line, that HTML is the text that describes the page, is plainer than the definition and does not contradict it.

## Sources

- `whatwg-html`: the HTML Standard, fetched from html.spec.whatwg.org; a WHATWG Living Standard, last updated 14 November 2026. Current. Checked 2026-11-14.
- `rfc-4949`: fetched as text from rfc-editor.org; the RFC Editor's record lists no RFC that obsoletes or updates it. Current. Checked 2026-11-14.
- `nist-sp800-41r1`: the PDF fetched from nvlpubs.nist.gov; the CSRC page lists it as Final, published September 2009, and does not mark it withdrawn or superseded. Current. Checked 2026-11-14.
