import { copyToClipboard } from '../src/clipboard';

describe('copyToClipboard', () => {
  const writeText = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('copyToClipboard_clipboardApiAvailable_shouldWriteText', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    writeText.mockResolvedValue(undefined);
    await copyToClipboard('hello');
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  test('copyToClipboard_writeRejected_shouldThrowError', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    writeText.mockRejectedValue(new Error('NotAllowedError'));
    await expect(copyToClipboard('hello')).rejects.toThrow('NotAllowedError');
  });

  test('copyToClipboard_clipboardApiUnavailable_shouldThrowError', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    await expect(copyToClipboard('hello')).rejects.toThrow('Clipboard API is unavailable');
  });

  test('copyToClipboard_noNavigator_shouldThrowError', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')!;
    Object.defineProperty(globalThis, 'navigator', { value: undefined, configurable: true });
    try {
      await expect(copyToClipboard('hello')).rejects.toThrow('Clipboard API is unavailable');
    } finally {
      Object.defineProperty(globalThis, 'navigator', descriptor);
    }
  });
});
