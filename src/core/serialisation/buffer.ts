import {
  Token,
  byteSize,
  getDataTypeMethods,
  setDataTypeMethods,
} from './common';

export interface LogItem {
  operation: 'read' | 'write';
  byteOffset: number;
  token: Token;
  value?: any;
}

export abstract class Buffer {
  byteOffset: number;
  buffer: ArrayBuffer;
  view: DataView;
  littleEndian: boolean;

  debug: LogItem[];

  constructor(
    bufferOrByteLength: ArrayBuffer | number,
    littleEndian?: boolean
  ) {
    this.byteOffset = 0;
    this.buffer =
      bufferOrByteLength instanceof ArrayBuffer
        ? bufferOrByteLength
        : new ArrayBuffer(bufferOrByteLength);
    this.view = new DataView(this.buffer);

    this.debug = [];
  }

  protected moveByteOffset(type: Token) {
    const byteLength = byteSize[type];
    this.byteOffset += byteLength;
  }

  protected writeLog(token: Token, value?: any) {
    this.debug.push({
      operation: 'write',
      byteOffset: this.byteOffset,
      token,
      value,
    });
  }

  protected readLog(token: Token, value?: any, byteOffset?: number) {
    this.debug.push({
      operation: 'read',
      byteOffset: byteOffset || this.byteOffset,
      token,
      value,
    });
  }

  get log() {
    return this.debug;
  }

  get length() {
    return this.buffer.byteLength;
  }

  get array() {
    return this.buffer;
  }

  get isEOF() {
    return this.byteOffset >= this.length;
  }
}

export class WriteBuffer extends Buffer {
  writeString(value: string) {
    // write string length as uint16
    const l = value.length;
    this.writeLog('Uint16', `strLen = ${l} "${value}"`);
    this.view.setInt16(this.byteOffset, l, this.littleEndian);
    this.byteOffset += 2;

    // write each char as uint16
    const startByteOffset = this.byteOffset;
    for (var i = 0; i < l; i++) {
      const charCode = value.charCodeAt(i);
      this.writeLog('Uint16', `strChar[${i}] = ${charCode} "${value[i]}"`);
      this.view.setUint16(startByteOffset + i * 2, charCode, this.littleEndian);
      this.byteOffset += 2;
    }
  }

  writeNumericType(token: Token, value: number) {
    this.writeLog(token, value);
    const dataViewMethod = this.view[setDataTypeMethods[token]];
    dataViewMethod.call(this.view, this.byteOffset, value, this.littleEndian);

    this.moveByteOffset(token);
  }

  writeInt8 = (value: number) => this.writeNumericType('Int8', value);
  writeUint8 = (value: number) => this.writeNumericType('Uint8', value);
  writeInt16 = (value: number) => this.writeNumericType('Int16', value);
  writeUint16 = (value: number) => this.writeNumericType('Uint16', value);
  writeInt32 = (value: number) => this.writeNumericType('Int32', value);
  writeUint32 = (value: number) => this.writeNumericType('Uint32', value);
  writeFloat32 = (value: number) => this.writeNumericType('Float32', value);
  writeFloat64 = (value: number) => this.writeNumericType('Float64', value);
  writeBigInt64 = (value: number) => this.writeNumericType('BigInt64', value);
  writeBigUint64 = (value: number) => this.writeNumericType('BigUint64', value);

  writeArrayBuffer(value: ArrayBuffer) {
    this.writeInt16(value.byteLength);
    new Uint8Array(this.buffer, this.byteOffset).set(new Uint8Array(value));
    this.byteOffset += value.byteLength;
  }
}

export class ReadBuffer extends Buffer {
  readString() {
    const size = this.readInt16();
    // this.readLog('Uint16', `strLen = ${size}`, this.byteOffset - 2);

    let str = '';
    const startByteOffset = this.byteOffset;
    for (var i = 0; i < size; i++) {
      const charCode = this.view.getUint16(
        startByteOffset + i * 2,
        this.littleEndian
      );
      const char = String.fromCharCode(charCode);
      str += char;
      this.byteOffset += 2;
      this.readLog(
        'Uint16',
        `strChar[${i}] = ${charCode} "${char}"`,
        this.byteOffset - 2
      );
    }
    return str;
  }

  readNumericType(token: Token) {
    const dataViewMethod = this.view[getDataTypeMethods[token]];
    const value = dataViewMethod.call(
      this.view,
      this.byteOffset,
      this.littleEndian
    );

    this.readLog(token, value);
    this.moveByteOffset(token);

    return value;
  }

  readInt8 = () => this.readNumericType('Int8');
  readUint8 = () => this.readNumericType('Uint8');
  readInt16 = () => this.readNumericType('Int16');
  readUint16 = () => this.readNumericType('Uint16');
  readInt32 = () => this.readNumericType('Int32');
  readUint32 = () => this.readNumericType('Uint32');
  readFloat32 = () => this.readNumericType('Float32');
  readFloat64 = () => this.readNumericType('Float64');
  readBigInt64 = () => this.readNumericType('BigInt64');
  readBigUint64 = () => this.readNumericType('BigUint64');

  readArrayBuffer() {
    const byteLength = this.readInt16();
    const buffer = this.buffer.slice(
      this.byteOffset,
      this.byteOffset + byteLength
    );
    this.byteOffset += byteLength;
    return buffer;
  }
}
