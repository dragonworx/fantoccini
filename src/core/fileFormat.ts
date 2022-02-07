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

/** Writer... */

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

  private assertUint16 = (value: number) =>
    this.assertBounds('UInt16', 0, 65535, value);

  private assertInt32 = (value: number) =>
    this.assertBounds('Int32', -2147483648, 2147483647, value);

  private assertUint32 = (value: number) =>
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

  private write(
    View: { new (buffer: ArrayBuffer): TypedArray },
    value: any,
    byteSize: number
  ) {
    const buffer = new ArrayBuffer(byteSize);
    const view = new View(buffer);
    view[0] = value;
    this.buffer.push(buffer);
  }

  writeInt8(value: number) {
    this.assertInt8(value);
    this.write(Int8Array, value, 1);
  }

  writeUint8(value: number) {
    this.assertUint8(value);
    this.write(Uint8Array, value, 1);
  }

  writeUint8Clamped(value: number) {
    this.assertUint8Clamped(value);
    this.write(Uint8ClampedArray, value, 1);
  }

  writeInt16(value: number) {
    this.assertInt16(value);
    this.write(Int16Array, value, 2);
  }

  writeUint16(value: number) {
    this.assertUint16(value);
    this.write(Uint16Array, value, 2);
  }

  writeInt32(value: number) {
    this.assertInt32(value);
    this.write(Int32Array, value, 4);
  }

  writeUint32(value: number) {
    this.assertUint32(value);
    this.write(Uint32Array, value, 4);
  }

  writeFloat32(value: number) {
    this.assertFloat32(value);
    this.write(Float32Array, value, 4);
  }

  writeFloat64(value: number) {
    this.assertFloat64(value);
    this.write(Float64Array, value, 8);
  }

  writeBigInt64(value: number) {
    this.assertBigInt64(value);
    this.write(BigInt64Array, value, 8);
  }

  writeBigUint64(value: number) {
    this.assertBigUint64(value);
    this.write(BigUint64Array, value, 8);
  }

  writeString(value: string) {
    if (value.length > 65535) {
      throw new Error(
        `Maximum string size exceeded: ${value.length} (max equals 65535)`
      );
    }
    this.writeUint16(value.length);
    this._writeString(value);
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

/** Reader... */

class FileFormatReader {
  buffer: ArrayBuffer;
  byteOffset: number;

  constructor() {
    this.byteOffset = 0;
  }

  private read<T extends number | bigint>(
    View: {
      new (buffer: ArrayBuffer, byteOffset: number, length: number): TypedArray;
    },
    byteSize: number
  ) {
    console.log('@', this.byteOffset);
    const view = new View(this.buffer, this.byteOffset, 1);
    this.byteOffset += byteSize;
    return view[0] as T;
  }

  readInt8 = () => this.read<number>(Int8Array, 1);
  readUint8 = () => this.read<number>(Uint8Array, 1);
  readUint8Clamped = () => this.read<number>(Uint8ClampedArray, 1);
  readInt16 = () => this.read<number>(Int16Array, 2);
  readUint16 = () => this.read<number>(Uint16Array, 2);
  readInt32 = () => this.read<number>(Int32Array, 4);
  readUint32 = () => this.read<number>(Uint32Array, 4);
  readFloat32 = () => this.read<number>(Float32Array, 4);
  readFloat64 = () => this.read<number>(Float64Array, 8);
  readBigInt64 = () => this.read<bigint>(BigInt64Array, 8);
  readBigUint64 = () => this.read<bigint>(BigUint64Array, 8);

  readString() {
    const length = this.readUint16();
    const view = new Uint16Array(this.buffer, this.byteOffset, length);
    const string = String.fromCharCode.apply(null, view);
    this.byteOffset += length * 2;
    return string;
  }

  async fromBlob(blob: Blob) {
    const buffer = await new Response(blob).arrayBuffer();
    this.buffer = buffer;
  }

  async fromBase64(base64: string) {
    const blob = base64ToBlob(base64);
    return this.fromBlob(blob);
  }
}

/** Test... */

const writer = new FileFormatWriter();
writer.writeFloat32(10000.102);
writer.writeFloat32(101.103);
writer.writeString('hello');
writer.writeUint16(1000);
writer.writeUint16(2000);
writer.writeUint8(255);
writer.writeUint8(126);
writer.writeUint16(1);
writer.writeString('hello2');

const onMouseDown = e => {
  writer.toDownloadLink('file.dat');
  document.body.removeEventListener('mousedown', onMouseDown);
};
document.body.addEventListener('mousedown', onMouseDown);

writer.toBase64().then(base64 => {
  console.log('base64', base64);
  const reader = new FileFormatReader();
  reader.fromBase64(base64).then(() => {
    console.log(reader.readFloat32().toFixed(3));
    console.log(reader.readFloat32().toFixed(3));
    console.log(reader.readString());
    console.log(reader.readUint16());
    console.log(reader.readUint16());
    console.log(reader.readUint8());
    console.log(reader.readUint8());
    console.log(reader.readUint16());
    console.log(reader.readString());
  });
});
