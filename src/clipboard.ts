/**
 * Copy text to the clipboard using the async Clipboard API.
 * @param text the text to copy.
 * @throws if the Clipboard API is unavailable (it requires a secure context in a browser), or the browser rejects the write,
 * e.g. when it isn't triggered by a user action.
 */
export async function copyToClipboard(text: string): Promise<void> {
  // navigator is undefined during server-side rendering, and Node's navigator has no clipboard.
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard API is unavailable, it requires a secure context (https or localhost)');
  }
  await navigator.clipboard.writeText(text);
}
