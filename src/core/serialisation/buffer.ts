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

  constructor(byteLength: number, littleEndian?: boolean) {
    this.byteOffset = 0;
    this.buffer = new ArrayBuffer(byteLength);
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

  protected readLog(token: Token, value?: any) {
    this.debug.push({
      operation: 'read',
      byteOffset: this.byteOffset,
      token,
      value,
    });
  }

  get log() {
    return this.debug;
  }
}

export class WriteBuffer extends Buffer {
  writeString(value: string) {
    // write string length as uint16
    const l = value.length;
    this.writeLog('Uint16', `strLen ${l}`);
    this.view.setInt16(this.byteOffset, l, this.littleEndian);
    this.byteOffset += 2;

    // write each char as uint16
    for (var i = 0; i < l; i++) {
      const charCode = value.charCodeAt(i);
      this.writeLog('Uint16', `strChar ${l}`);
      this.view.setUint16(this.byteOffset + i * 2, charCode, this.littleEndian);
    }

    this.byteOffset += l * 2;
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
    new Uint8Array(this.buffer, this.byteOffset).set(new Uint8Array(value));
    this.byteOffset += value.byteLength;
  }
}
