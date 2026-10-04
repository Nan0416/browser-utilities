type Timer = ReturnType<typeof setTimeout>;

// setTimeout fires almost immediately for delays that don't fit in a 32-bit signed integer.
const MAX_EXPIRE = 2 ** 31 - 1;

/**
 * An in-memory key-value cache whose entries are removed after a timeout.
 */
export class GenericTempCache {
  private readonly defaultExpire: number;
  private readonly tempCache = new Map<string, unknown>();
  private readonly keyToTimeout = new Map<string, Timer>();

  /**
   * @param defaultExpire default time to live in milliseconds, defaults to 200. Entries never expire if it is <= 0.
   */
  constructor(defaultExpire = 200) {
    this.defaultExpire = defaultExpire;
  }

  /**
   * Set a value, replacing any existing value and restarting its timeout.
   * @param expire time to live in milliseconds, defaults to the cache's default. The entry never expires if it is <= 0.
   * @throws RangeError if expire is greater than 2^31 - 1 (about 24.8 days).
   */
  set<T>(key: string, value: T, expire = this.defaultExpire): void {
    if (expire > MAX_EXPIRE) {
      throw new RangeError(`expire ${expire} is greater than the maximum ${MAX_EXPIRE} ms`);
    }
    this.clearTimer(key);
    this.tempCache.set(key, value);

    if (expire > 0) {
      this.keyToTimeout.set(
        key,
        setTimeout(() => this.expire(key), expire),
      );
    }
  }

  get<T>(key: string): T | undefined {
    return this.tempCache.get(key) as T | undefined;
  }

  /**
   * Remove an entry immediately.
   */
  expire(key: string): void {
    this.clearTimer(key);
    this.tempCache.delete(key);
  }

  clear(): void {
    this.keyToTimeout.forEach((timer) => clearTimeout(timer));
    this.keyToTimeout.clear();
    this.tempCache.clear();
  }

  private clearTimer(key: string): void {
    const timer = this.keyToTimeout.get(key);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.keyToTimeout.delete(key);
    }
  }
}
