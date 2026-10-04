import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import stableStringify from 'json-stable-stringify';

export interface JsonFile {
  readonly filename: string;
  /**
   * Any JSON-serializable value. Object keys are sorted so the output is deterministic.
   */
  readonly content: unknown;
}

function toJson(file: JsonFile): string {
  const json = stableStringify(file.content, { space: 2 });
  if (json === undefined) {
    throw new TypeError(`content of ${file.filename} is not JSON-serializable`);
  }
  return json;
}

/**
 * Download a value as a pretty-printed JSON file.
 */
export function downloadJson(file: JsonFile): void {
  const blob = new Blob([toJson(file)], { type: 'application/json' });
  saveAs(blob, file.filename);
}

/**
 * Download several values as JSON files bundled into one zip archive.
 * @param filename name of the zip archive, e.g. 'export.zip'.
 * @param files files to put in the archive.
 * @throws if two files have the same filename.
 */
export async function downloadJsonZip(filename: string, files: readonly JsonFile[]): Promise<void> {
  const zip = new JSZip();
  files.forEach((file) => {
    if (zip.file(file.filename) !== null) {
      throw new Error(`duplicated filename ${file.filename}`);
    }
    zip.file(file.filename, toJson(file));
  });
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, filename);
}
