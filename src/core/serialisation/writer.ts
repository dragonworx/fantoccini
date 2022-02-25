import {
  ByteSize,
  DataTypeName,
  FormatTypeName,
  getNumericType,
  Header,
} from './common';

type Token = {
  key: string | null;
  type: FormatTypeName | '{}' | '[]' | 'pop';
  value?: any;
  size?: number;
};

export class Writer {
  depth: number = 0;
  stack: Token[] = [];
  byteOffset: number = 0;
  buffer: ArrayBuffer = new ArrayBuffer(0);
  view: DataView = new DataView(this.buffer);
  littleEndian: boolean = true;
  log: {} = {};

  private debug(value: string) {
    this.log[this.byteOffset] = value;
    console.log([this.byteOffset, value]);
  }

  private reset() {
    this.stack.length = 0;
    this.depth = 0;
    this.byteOffset = 0;
    this.buffer = new ArrayBuffer(0);
    this.view = new DataView(this.buffer);
    this.log = {};
  }

  private advanceByteOffset(type: FormatTypeName) {
    const byteSize = ByteSize[type];
    this.byteOffset += byteSize;
  }

  private writeString(value: string) {
    const l = value.length;
    this.debug(`string{${l}}`);
    this.view.setInt16(this.byteOffset, l, this.littleEndian);
    this.byteOffset += 2;
    for (var i = 0; i < l; i++) {
      this.debug(`char[${i}]: ${value.charCodeAt(i)} "${value[i]}"`);
      this.view.setUint16(
        this.byteOffset + i * 2,
        value.charCodeAt(i),
        this.littleEndian
      );
    }
    this.byteOffset += l * 2;
  }

  private writeNumericType(
    value: number,
    dataViewMethod: (
      byteOffset: number,
      value: number,
      littleEndian?: boolean
    ) => void,
    type: DataTypeName
  ) {
    this.debug(`${type} = ${value}`);
    dataViewMethod.call(this.view, this.byteOffset, value, this.littleEndian);
    this.advanceByteOffset(type);
  }

  private writeInt8 = (value: number) =>
    this.writeNumericType(value, this.view.setInt8, 'Int8');
  private writeInt16 = (value: number) =>
    this.writeNumericType(value, this.view.setInt16, 'Int16');

  private writeArrayBuffer(value: ArrayBuffer) {
    new Uint8Array(this.buffer, this.byteOffset).set(new Uint8Array(value));
    this.byteOffset += value.byteLength;
  }

  private async writeNode(key: string, value: any) {
    this.depth++;

    if (value instanceof Blob) {
      // Blob
      const buffer = await new Response(value).arrayBuffer();

      this.stack.push({
        key,
        type: 'Blob',
        value: buffer,
        size: buffer.byteLength,
      });
    } else if (value instanceof ArrayBuffer) {
      // ArrayBuffer

      this.stack.push({
        key,
        type: 'ArrayBuffer',
        value,
        size: value.byteLength,
      });
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        // Array
        this.stack.push({ key, type: '[]', size: 0 });

        for (const [index, item] of value.entries()) {
          await this.writeNode(null, item);
        }

        this.stack.push({ key: null, type: 'pop' });
      } else {
        // Object
        const entries = Object.entries(value);
        this.stack.push({ key, type: '{}', size: 0 });

        for (let [subkey, subvalue] of entries) {
          await this.writeNode(subkey, subvalue);
        }

        this.stack.push({ key: null, type: 'pop' });
      }
    } else {
      // Value
      if (typeof value === 'number') {
        // Number
        const type = getNumericType(value);
        const byteSize = ByteSize[type];
        this.stack.push({ key, type, value, size: byteSize });
      } else if (typeof value === 'string') {
        // String
        this.stack.push({
          key,
          type: 'String',
          value,
          size: 2 + value.length * 2, // size(uint16) + chars
        });
      } else if (typeof value === 'boolean') {
        // Boolean
        this.stack.push({ key, type: 'Boolean', value, size: 1 });
      }
    }

    this.depth--;
  }

  private getElementByteSize({ key, size }: Token) {
    // headerByte + strLen + key + valueSize
    return 1 + (typeof key === 'string' ? 2 + key.length * 2 : 0) + (size || 0);
  }

  private get bufferSize() {
    // each element byte size
    return this.stack.reduce(
      (prev, curr) => prev + this.getElementByteSize(curr),
      0
    );
  }

  async parse(doc: Record<string, any>) {
    this.reset();
    for (let [key, value] of Object.entries(doc)) {
      await this.writeNode(key, value);
    }
  }

  toArrayBuffer() {
    const size = this.bufferSize;

    this.buffer = new ArrayBuffer(size);
    this.view = new DataView(this.buffer);

    console.log('STACK:', this.stack, size);

    this.stack.forEach((element, i) => {
      const { key, type, value } = element;
      this.debug(`---- BEGIN: ${i} "${key}" ----`);

      // write header..
      const headerByte = Header.indexOf(type);
      this.writeInt8(headerByte);

      if (typeof key === 'string') {
        // write key
        this.writeString(key);
      }

      // write value
      if (type === 'String') {
        this.writeString(value);
      } else if (type === 'Int8') {
        // TODO all numeric types
        this.writeInt8(value);
      } else if (type === 'Int16') {
        this.writeInt16(value);
      } else if (type === '[]' || type === '{}' || type === 'pop') {
      } else if (type === 'Boolean') {
        this.writeInt8(value ? 1 : 0);
      } else if (type === 'ArrayBuffer') {
        this.writeArrayBuffer(value);
      } else if (type === 'Blob') {
        this.writeArrayBuffer(value);
      }
    });

    console.table(this.log);

    return this.buffer;
  }

  toBlob(type: string = 'application/octet-stream') {
    return new Blob([this.toArrayBuffer()], {
      type,
    });
  }
}
