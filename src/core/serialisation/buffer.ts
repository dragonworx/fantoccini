import { Token, byteSize } from './common';

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

  writeNumericType(
    value: number,
    dataViewMethod: (
      byteOffset: number,
      value: number,
      littleEndian?: boolean
    ) => void,
    token: Token
  ) {
    this.writeLog(token, value);
    dataViewMethod.call(this.view, this.byteOffset, value, this.littleEndian);

    this.moveByteOffset(token);
  }

  writeInt8 = (value: number) =>
    this.writeNumericType(value, this.view.setInt8, 'Int8');

  writeUint8 = (value: number) =>
    this.writeNumericType(value, this.view.setUint8, 'Uint8');

  writeInt16 = (value: number) =>
    this.writeNumericType(value, this.view.setInt16, 'Int16');

  writeArrayBuffer(value: ArrayBuffer) {
    this.writeInt16(value.byteLength);
    new Uint8Array(this.buffer, this.byteOffset).set(new Uint8Array(value));
    this.byteOffset += value.byteLength;
  }
}

export class ReadBuffer extends Buffer {
  readString() {
    const size = this.readInt16();
    this.readLog('Uint16', `strLen = ${size}`, this.byteOffset - 2);

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

  readNumericType(
    dataViewMethod: (byteOffset: number, littleEndian?: boolean) => number,
    token: Token
  ) {
    const value = dataViewMethod.call(
      this.view,
      this.byteOffset,
      this.littleEndian
    );

    this.readLog(token, value);
    this.moveByteOffset(token);

    return value;
  }

  readInt8 = () => this.readNumericType(this.view.getInt8, 'Int8');

  readUint8 = () => this.readNumericType(this.view.getUint8, 'Uint8');

  readInt16 = () => this.readNumericType(this.view.getInt16, 'Int16');

  // TODO: read array buffer, with length uint16 first 2 bytes
}
