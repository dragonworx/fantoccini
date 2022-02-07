import { base64ToBlob, TypedArray } from './fileFormat-util';

export class FileFormatReader {
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
