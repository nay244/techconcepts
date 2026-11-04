/**
 * A page's absolute address on the live site, without a trailing slash (except
 * the home page). The site links to slash-less addresses and Cloudflare serves
 * them directly (`html_handling` in wrangler.jsonc), while Astro reports
 * directory pages with a trailing slash, such as `/networking/`.
 */
export function canonicalUrl(pathname: string, base: string | URL): string {
  const path = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
  return new URL(path, base).href;
}
