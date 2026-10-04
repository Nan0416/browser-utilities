import { getPreference, setPreference } from '../src/preferences-store';

describe('preferences store', () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('setPreference_thenGetPreference_shouldRoundTrip', () => {
    expect(setPreference('theme', { dark: true })).toBe(true);
    expect(getPreference('theme', { dark: false })).toEqual({ dark: true });
  });

  test('getPreference_falsyValue_shouldNotUseDefault', () => {
    setPreference('count', 0);
    expect(getPreference('count', 10)).toBe(0);
  });

  test('getPreference_missingKey_shouldReturnDefault', () => {
    expect(getPreference('missing', 'default')).toBe('default');
  });

  test.each(['not json', '"no envelope"', 'null', '{"other":1}'])('getPreference_corruptedData(%p)_shouldReturnDefault', (raw) => {
    localStorage.setItem('key', raw);
    expect(getPreference('key', 'default')).toBe('default');
  });

  test('getPreference_storageThrows_shouldReturnDefault', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(getPreference('key', 'default')).toBe('default');
  });

  test('setPreference_storageThrows_shouldReturnFalse', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(setPreference('key', 'value')).toBe(false);
  });
});
