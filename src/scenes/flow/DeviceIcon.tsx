import type { ReactNode } from 'react';
import type { ActorKind } from '../../content/schema';

/**
 * One original line drawing per kind of device, on a 48 px grid with a 1.5 px
 * stroke. Everything is drawn with `currentColor`, so the icon takes its colour
 * from the surrounding text and follows the theme. Dots are zero-length strokes
 * with round caps.
 */
const ICONS: Record<ActorKind, ReactNode> = {
  laptop: (
    <>
      <rect x="9" y="10" width="30" height="21" rx="2" />
      <path d="M4 37h40l-2.5 3.5h-35z" />
    </>
  ),
  phone: (
    <>
      <rect x="14" y="4" width="20" height="40" rx="3.5" />
      <path d="M21 8.5h6M22 39.5h4" />
    </>
  ),
  switch: (
    <>
      <rect x="4" y="11" width="40" height="16" rx="2" />
      <path d="M10 17h5v6h-5zM18 17h5v6h-5zM26 17h5v6h-5zM34 17h5v6h-5z" />
      <path d="M14 34h20M17.5 30.5L14 34l3.5 3.5M30.5 30.5L34 34l-3.5 3.5" />
    </>
  ),
  router: (
    <>
      <circle cx="24" cy="24" r="10" />
      <path d="M24 14V4M20.5 7.5L24 4l3.5 3.5M24 34v10M20.5 40.5L24 44l3.5-3.5M14 24H4M7.5 20.5L4 24l3.5 3.5M34 24h10M40.5 20.5L44 24l-3.5 3.5" />
    </>
  ),
  server: (
    <>
      <rect x="7" y="5" width="34" height="11" rx="2" />
      <rect x="7" y="18.5" width="34" height="11" rx="2" />
      <rect x="7" y="32" width="34" height="11" rx="2" />
      <path d="M13 10.5h.01M13 24h.01M13 37.5h.01M24 10.5h11M24 24h11M24 37.5h11" />
    </>
  ),
  'dns-server': (
    <>
      <circle cx="24" cy="13" r="9" />
      <path d="M15 13h18M24 22v8" />
      <ellipse cx="24" cy="13" rx="4" ry="9" />
      <rect x="7" y="30" width="34" height="12" rx="2" />
      <path d="M13 36h.01M24 36h11" />
    </>
  ),
  firewall: (
    <>
      <rect x="5" y="8" width="38" height="32" rx="2" />
      <path d="M5 18.7h38M5 29.3h38M17 8v10.7M31 8v10.7M10 18.7v10.6M24 18.7v10.6M38 18.7v10.6M17 29.3V40M31 29.3V40" />
    </>
  ),
  proxy: (
    <>
      <rect x="16" y="12" width="16" height="24" rx="3" />
      <circle cx="24" cy="24" r="3" />
      <path d="M3 24h13M12.5 20.5L16 24l-3.5 3.5M32 24h13M41.5 20.5L45 24l-3.5 3.5" />
    </>
  ),
  'load-balancer': (
    <>
      <circle cx="8" cy="24" r="4" />
      <path d="M12 24h8M20 10v28M20 10h8M20 24h8M20 38h8" />
      <rect x="28" y="5.5" width="14" height="9" rx="1.5" />
      <rect x="28" y="19.5" width="14" height="9" rx="1.5" />
      <rect x="28" y="33.5" width="14" height="9" rx="1.5" />
    </>
  ),
  'vpn-gateway': (
    <>
      <rect x="10" y="21" width="28" height="21" rx="3" />
      <path d="M16 21v-5a8 8 0 0 1 16 0v5" />
      <circle cx="24" cy="30" r="2.5" />
      <path d="M24 32.5V37" />
    </>
  ),
  'access-point': (
    <>
      <rect x="9" y="33" width="30" height="9" rx="2" />
      <path d="M15 37.5h.01M21 37.5h.01" />
      <circle cx="24" cy="27" r="1.6" />
      <path d="M19.8 22.8a6 6 0 0 1 8.4 0M15.5 18.5a12 12 0 0 1 17 0M11.3 14.3a18 18 0 0 1 25.4 0" />
    </>
  ),
  internet: <path d="M14 36a8 8 0 0 1-1-15.9 11 11 0 0 1 21.2 1.9A7 7 0 0 1 34 36z" />,
};

export function DeviceIcon({ kind }: { kind: ActorKind }) {
  return (
    <svg
      className="device-icon"
      viewBox="0 0 48 48"
      width={48}
      height={48}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[kind]}
    </svg>
  );
}

export default DeviceIcon;
