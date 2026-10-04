/**
 * Format a duration in seconds as a short human-readable string.
 * e.g. 0 => '0s', 120 => '2m', 10890 => '3h 1m 30s', 90000 => '25h'
 * Fractional seconds are truncated.
 * @param seconds duration in seconds, must be a non-negative finite number.
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new RangeError(`invalid duration ${seconds}`);
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.length > 0 ? parts.join(' ') : '0s';
}
