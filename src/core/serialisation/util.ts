export enum BinaryType {
  Number = 1,
  String = 2,
  Boolean = 3,
  Blob = 4,
  ArrayBuffer = 5,
}

export type BinaryItem = {
  type: BinaryType;
  buffer: ArrayBuffer;
  blob?: Blob;
};

export function blobToBase64(blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.toString());
    reader.readAsDataURL(blob);
  });
}

export const base64ToBlob = (
  b64Data: string,
  contentType: string = 'application/octet-stream',
  sliceSize: number = 512
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export function downloadBlob(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.innerHTML = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
  return link;
}
