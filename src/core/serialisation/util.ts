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

export function selectLocalFile() {
  const div = document.createElement('div');
  div.style.cssText = `position:absolute;z-index:1;overflow:hidden`;
  div.innerHTML = `<button>Select File<input type="file" /></button>`;
  const input = div.querySelector('input');
  input.style.cssText = `position:absolute;left:-1000px`;
  div.addEventListener('click', () => input.click());
  document.body.appendChild(div);
  return new Promise(resolve => {
    input.addEventListener('input', e => {
      const file = (e.currentTarget as HTMLInputElement).files[0];
      resolve(file);
    });
  });
}
