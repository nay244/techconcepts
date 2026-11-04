/**
 * Cloudflare Web Analytics: cookieless page-view counts, loaded only when the
 * build was given a token (PUBLIC_CF_WEB_ANALYTICS_TOKEN). Without a token the
 * site carries no analytics script at all.
 */
export interface AnalyticsBeacon {
  src: string;
  defer: true;
  /** The attribute value Cloudflare's snippet reads: a JSON object holding the token. */
  'data-cf-beacon': string;
}

export function analyticsBeacon(token: string | undefined): AnalyticsBeacon | null {
  const trimmed = token?.trim();
  if (!trimmed) return null;
  return {
    src: 'https://static.cloudflareinsights.com/beacon.min.js',
    defer: true,
    // JSON.stringify escapes quotes; Astro escapes the attribute value when it renders.
    'data-cf-beacon': JSON.stringify({ token: trimmed }),
  };
}

/** The build-time token, shared by the layout (script) and the About page (sentence). */
export const analyticsToken: string | undefined = import.meta.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN;
