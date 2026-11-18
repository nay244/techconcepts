import { useEffect, useState } from 'react';

/**
 * Whether a media query matches, after the island has mounted. The server and the first render say false (no window),
 * so a page that picks its markup by this agrees with the server's and changes once, as it mounts.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const list = window.matchMedia?.(query);
    if (!list) return;
    const settle = () => setMatches(list.matches);
    settle();
    list.addEventListener('change', settle);
    return () => list.removeEventListener('change', settle);
  }, [query]);
  return matches;
}
