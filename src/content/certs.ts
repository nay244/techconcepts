/**
 * The cert and role tags a lesson can be "relevant for". The keys are also the
 * `?for=` values on the track page, so changing one changes a public URL.
 */
export const CERT_TAGS = {
  'a-plus': 'CompTIA A+',
  'network-plus': 'CompTIA Network+',
  'security-plus': 'CompTIA Security+',
  'cysa-plus': 'CompTIA CySA+',
  ccna: 'Cisco CCNA',
  helpdesk: 'Helpdesk',
  'soc-analyst': 'SOC Analyst',
} as const;

export type CertTag = keyof typeof CERT_TAGS;

/** The tag keys as a non-empty tuple, for `z.enum`. */
export const CERT_TAG_IDS = Object.keys(CERT_TAGS) as [CertTag, ...CertTag[]];
