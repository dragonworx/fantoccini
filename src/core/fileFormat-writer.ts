import {
  stringToArrayBuffer,
  TypedArray,
  blobToBase64,
  ArrayType,
} from './fileFormat-util';

type FormatItem = {
  buffer: ArrayBuffer;
  type: ArrayType;
};

export class FileFormatWriter {
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
