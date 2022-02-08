import { SupportedType, BinaryType, base64ToBlob } from './util';

export class BinaryReader {
  buffer: ArrayBuffer;
  offset: number;
  littleEndian: boolean;

  constructor() {
    this.offset = 0;
    this.littleEndian = true;
  }

  private readLengthHeader() {
    let view = new DataView(this.buffer, this.offset, 4);
    const length = view.getUint32(0, this.littleEndian);
    this.offset += 4;
    return length;
  }

  readNumber(precision: number = -1) {
    const view = new DataView(this.buffer, this.offset, 4);
    this.offset += 4;
    const value = view.getFloat32(0, this.littleEndian);
    return precision === -1 ? value : value.toFixed(precision);
  }

  readString() {
    const length = this.readLengthHeader();
    let view = new DataView(this.buffer, this.offset, length * 2);
    let str = '';
    for (var i = 0; i < length; i++) {
      const charCode = view.getUint16(i * 2, this.littleEndian);
      str += String.fromCharCode(charCode);
    }
    this.offset += length * 2;
    return str;
  }

  readBoolean() {
    const view = new DataView(this.buffer, this.offset, 1);
    this.offset += 1;
    return view.getUint8(0) === 1 ? true : false;
  }

  readBlob() {
    const length = this.readLengthHeader();
    const buffer = this.buffer.slice(this.offset, this.offset + length);
    this.offset += buffer.byteLength;
    const type = this.readString();
    const blob = new Blob([buffer], { type });
    console.log(blob);
    return blob;
  }

  readArrayBuffer() {
    const length = this.readLengthHeader();
    const buffer = this.buffer.slice(this.offset, this.offset + length);
    this.offset += buffer.byteLength;
    return buffer;
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
