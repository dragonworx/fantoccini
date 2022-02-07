export default 123;

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays

class FileFormatWriter {
  buffer: ArrayBuffer[];

  constructor() {
    this.buffer = [];
  }

  private assertBounds(type: string, min: number, max: number, value: number) {
    if (value < min || value > max) {
      throw new Error(
        `${type} out of range: ${value} (expected ${min} to ${max})`
      );
    }
  }

  private assertInt8 = (value: number) =>
    this.assertBounds('Int8', -128, 127, value);

  private assertUint8 = (value: number) =>
    this.assertBounds('Uint8', 0, 255, value);

  private assertUint8Clamped = (value: number) =>
    this.assertBounds('Uint8Clamped', 0, 255, value);

  private assertInt16 = (value: number) =>
    this.assertBounds('Int16', -32768, 32767, value);

  private assertUInt16 = (value: number) =>
    this.assertBounds('UInt16', -128, 127, value);

  private assertInt32 = (value: number) =>
    this.assertBounds('Int32', -2147483648, 2147483647, value);

  private assertUInt32 = (value: number) =>
    this.assertBounds('UInt32', 0, 4294967295, value);

  private assertFloat32 = (value: number) =>
    this.assertBounds('Float32', -3.4e38, 3.4e38, value); // 1.2E-38 is the min positive number

  private assertFloat64 = (value: number) =>
    this.assertBounds('Float64', -128, 127, value); // 5E-324 is the min positive number

  private assertBigInt64 = (value: number) =>
    this.assertBounds('BigInt64', -2 ^ 63, 2 ^ (63 - 1), value);

  private assertBigUint64 = (value: number) =>
    this.assertBounds('BigUint64', 0, 2 ^ (64 - 1), value);

  private _writeString(value: string) {
    const buffer = stringToArrayBuffer(value);
    this.buffer.push(buffer);
  }

  private _write(
    View: { new (buffer: ArrayBuffer): TypedArray },
    value: any,
    byteSize: number
  ) {
    const buffer = new ArrayBuffer(byteSize);
    const view = new View(buffer);
    view[0] = value;
    this.buffer.push(buffer);
  }

  private writeInt8(value: number) {
    this.assertInt8(value);
    this._write(Int8Array, value, 1);
  }

  private _writeUInt8(value: number) {
    const buffer = new ArrayBuffer(1);
    const view = new Uint8Array(buffer);
    view[0] = value;
    this.buffer.push(buffer);
  }

  private _writeUInt16(value: number) {
    const buffer = new ArrayBuffer(2);
    const view = new Uint16Array(buffer);
    view[0] = value;
    this.buffer.push(buffer);
  }

  writeString(label: string, value: string) {
    this._writeString(label);
    this._writeUInt16(value.length);
    this._writeString(value);
  }

  writeUInt8(label: string, value: number) {
    this._writeString(label);
    this._writeUInt8(value);
  }

  writeUInt16(label: string, value: number) {
    this._writeString(label);
    this._writeUInt16(value);
  }

  toBlob() {
    const blob = new Blob(this.buffer, { type: 'application/octet-stream' });
    return blob;
  }

  async toBase64(includeHeader: boolean = false) {
    const base64 = await blobToBase64(this.toBlob());
    return includeHeader ? base64 : base64.split(',')[1];
  }

  toDownloadLink(filename: string, triggerDownload: boolean = true) {
    const blobUrl = URL.createObjectURL(this.toBlob());
    var link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.innerHTML = filename;
    if (triggerDownload) {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    return link;
  }
}

class FileFormatReader {
  buffer: ArrayBuffer;
  byteOffset: number;

  constructor() {
    this.byteOffset = 0;
  }

  private assertLabel(name: string) {
    const view = new Uint16Array(this.buffer, this.byteOffset, name.length);
    const string = String.fromCharCode.apply(null, view);
    if (string !== name) {
      throw new Error(
        `Unexpected label value. Expected "${name}" but received "${string}"`
      );
    }
    console.log(string + ':');
    this.byteOffset += name.length * 2;
  }

  private _readUInt8() {
    const view = new Uint8Array(this.buffer, this.byteOffset, 1);
    this.byteOffset += 1;
    return view[0];
  }

  private _readUInt16() {
    const view = new Uint16Array(this.buffer, this.byteOffset, 2);
    this.byteOffset += 2;
    return view[0];
  }

  async fromBlob(blob: Blob) {
    const buffer = await new Response(blob).arrayBuffer();
    this.buffer = buffer;
  }

  async fromBase64(base64: string) {
    const blob = base64ToBlob(base64);
    return this.fromBlob(blob);
  }

  readUInt8(label: string) {
    this.assertLabel(label);
    return this._readUInt8();
  }

  readUInt16(label: string) {
    this.assertLabel(label);
    return this._readUInt16();
  }

  readString(label: string) {
    this.assertLabel(label);
    const length = this._readUInt16();
    const view = new Uint16Array(this.buffer, this.byteOffset, length);
    const string = String.fromCharCode.apply(null, view);
    this.byteOffset += length * 2;
    return string;
  }
}

const writer = new FileFormatWriter();
writer.writeString('title', 'hello');
writer.writeUInt16('uint16', 1000);
writer.writeUInt8('uint8', 255);

const onMouseDown = e => {
  writer.toDownloadLink('file.dat');
  document.body.removeEventListener('mousedown', onMouseDown);
};
document.body.addEventListener('mousedown', onMouseDown);

writer.toBase64().then(base64 => {
  console.log('base64', base64);
  const reader = new FileFormatReader();
  reader.fromBase64(base64).then(() => {
    console.log(reader.readString('title'));
    console.log(reader.readUInt16('uint16'));
    console.log(reader.readUInt8('uint8'));
  });
});

function blobToBase64(blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.toString());
    reader.readAsDataURL(blob);
  });
}

const base64ToBlob = (
  b64Data,
  contentType = 'application/octet-stream',
  sliceSize = 512
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

function stringToArrayBuffer(str: string) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function createDownloadLink(blob: Blob, name: string) {
  const blobUrl = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  link.innerHTML = name;
  return link;
}
