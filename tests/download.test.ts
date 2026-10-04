import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { downloadJson, downloadJsonZip } from '../src/download';

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

const mockSaveAs = saveAs as jest.MockedFunction<typeof saveAs>;

function readBlob(blob: Blob): Promise<string> {
  // jsdom's Blob doesn't implement text().
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });
}

describe('download', () => {
  afterEach(() => {
    mockSaveAs.mockReset();
  });

  test('downloadJson_shouldSaveSortedPrettyJson', async () => {
    downloadJson({ filename: 'data.json', content: { b: 1, a: 2 } });

    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [blob, filename] = mockSaveAs.mock.calls[0]!;
    expect(filename).toBe('data.json');
    expect((blob as Blob).type).toBe('application/json');
    expect(await readBlob(blob as Blob)).toBe('{\n  "a": 2,\n  "b": 1\n}');
  });

  test('downloadJson_unserializableContent_shouldThrowError', () => {
    expect(() => downloadJson({ filename: 'data.json', content: undefined })).toThrow('content of data.json is not JSON-serializable');
    expect(mockSaveAs).not.toHaveBeenCalled();
  });

  test('downloadJsonZip_shouldSaveZipWithAllFiles', async () => {
    await downloadJsonZip('export.zip', [
      { filename: 'a.json', content: [1, 2] },
      { filename: 'b.json', content: { key: 'value' } },
    ]);

    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [blob, filename] = mockSaveAs.mock.calls[0]!;
    expect(filename).toBe('export.zip');
    const zip = await JSZip.loadAsync(await readBlobAsArrayBuffer(blob as Blob));
    expect(Object.keys(zip.files).sort()).toEqual(['a.json', 'b.json']);
    expect(await zip.file('b.json')!.async('string')).toBe('{\n  "key": "value"\n}');
  });

  test('downloadJsonZip_duplicatedFilenames_shouldThrowError', async () => {
    await expect(
      downloadJsonZip('export.zip', [
        { filename: 'a.json', content: 1 },
        { filename: 'a.json', content: 2 },
      ]),
    ).rejects.toThrow('duplicated filename a.json');
    expect(mockSaveAs).not.toHaveBeenCalled();
  });
});

function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(blob);
  });
}
