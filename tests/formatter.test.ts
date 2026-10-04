import { formatDuration } from '../src/formatter';

describe('formatDuration', () => {
  test.each([
    [0, '0s'],
    [45, '45s'],
    [120, '2m'],
    [3600, '1h'],
    [3661, '1h 1m 1s'],
    [10890, '3h 1m 30s'],
    [90000, '25h'],
    [59.9, '59s'],
  ])('formatDuration(%p) => %p', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  test.each([-1, NaN, Infinity])('formatDuration(%p)_invalid_shouldThrowError', (seconds) => {
    expect(() => formatDuration(seconds)).toThrow(RangeError);
  });
});
