/** Seconds as shown in the log and on sequence arrows: three decimals and an `s`, such as `0.024s`. */
export function formatTime(seconds: number): string {
  return `${seconds.toFixed(3)}s`;
}

/** A size in bytes: `342 B` below 1024, otherwise kilobytes to one decimal, such as `12.8 KB`. */
export function formatBytes(n: number): string {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;
}
