/**
 * Read a value saved by {@link setPreference}.
 * Returns `defaultValue` when the key is missing, the stored data is corrupted, or localStorage is unavailable.
 */
export function getPreference<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && typeof parsed === 'object' && 'data' in parsed) {
        return parsed.data as T;
      }
    }
  } catch {
    // Fall back to the default value below.
  }
  return defaultValue;
}

/**
 * Save a JSON-serializable value to localStorage.
 * @returns false if the value couldn't be saved, e.g. localStorage is full or disabled.
 */
export function setPreference<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify({ data }));
    return true;
  } catch {
    return false;
  }
}
