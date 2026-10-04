import { GenericTempCache } from '../src/temp-cache';

describe('GenericTempCache', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('set_defaultExpire_shouldExpireAfter200ms', () => {
    const cache = new GenericTempCache();
    cache.set('key', 'value');
    jest.advanceTimersByTime(199);
    expect(cache.get('key')).toBe('value');
    jest.advanceTimersByTime(1);
    expect(cache.get('key')).toBeUndefined();
  });

  test('set_customExpire_shouldOverrideDefault', () => {
    const cache = new GenericTempCache(100);
    cache.set('key', 'value', 500);
    jest.advanceTimersByTime(499);
    expect(cache.get('key')).toBe('value');
    jest.advanceTimersByTime(1);
    expect(cache.get('key')).toBeUndefined();
  });

  test('set_nonPositiveExpire_shouldNeverExpire', () => {
    const cache = new GenericTempCache(0);
    cache.set('default', 1);
    cache.set('explicit', 2, -1);
    jest.advanceTimersByTime(60_000);
    expect(cache.get('default')).toBe(1);
    expect(cache.get('explicit')).toBe(2);
  });

  test('set_expireAboveTimerLimit_shouldThrowError', () => {
    const cache = new GenericTempCache();
    expect(() => cache.set('key', 'value', 2 ** 31)).toThrow(RangeError);
    expect(cache.get('key')).toBeUndefined();
    expect(() => cache.set('key', 'value', 2 ** 31 - 1)).not.toThrow();
  });

  test('set_existingKey_shouldRestartTimeout', () => {
    const cache = new GenericTempCache(100);
    cache.set('key', 'first');
    jest.advanceTimersByTime(80);
    cache.set('key', 'second');
    jest.advanceTimersByTime(80);
    expect(cache.get('key')).toBe('second');
    jest.advanceTimersByTime(20);
    expect(cache.get('key')).toBeUndefined();
  });

  test('expire_shouldRemoveImmediatelyAndClearTimer', () => {
    const cache = new GenericTempCache(100);
    cache.set('key', 'value');
    cache.expire('key');
    expect(cache.get('key')).toBeUndefined();
    expect(jest.getTimerCount()).toBe(0);
  });

  test('clear_shouldRemoveAllEntriesAndTimers', () => {
    const cache = new GenericTempCache(100);
    cache.set('a', 1);
    cache.set('b', 2, 0);
    cache.clear();
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
    expect(jest.getTimerCount()).toBe(0);
  });
});
