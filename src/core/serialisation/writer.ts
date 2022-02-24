import { ByteSize, FormatTypeName, getNumericType, Header } from './common';

type Element = {
  key: string;
  type: FormatTypeName | '{}' | '[]' | 'pop';
  value?: any;
  size?: number;
};

export class Writer<T extends Record<string, any>> {
  depth: number = 0;
  stack: Element[];
  byteOffset: number = 0;
  buffer: ArrayBuffer;
  view: DataView;
  littleEndian: boolean = true;

  constructor(readonly doc: T) {
    this.stack = [];
  }

  async parse() {
    for (let [key, value] of Object.entries(this.doc)) {
      await this.writeNode(key, value);
    }
    console.log(this.stack);
  }

  private async writeNode(key: string, value: any) {
    this.depth++;

    if (value instanceof Blob) {
      // Blob
      console.log('.'.padStart(this.depth, '.') + key + ': <BLOB>');
      const buffer = await new Response(value).arrayBuffer();
      this.stack.push({
        key,
        type: 'Blob',
        value: buffer,
        size: buffer.byteLength,
      });
    } else if (value instanceof ArrayBuffer) {
      // ArrayBuffer
      console.log('.'.padStart(this.depth, '.') + key + ': <ARRAY_BUFFER>');
      this.stack.push({
        key,
        type: 'ArrayBuffer',
        value,
        size: value.byteLength,
      });
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        // Array
        console.log('.'.padStart(this.depth, '.') + key + '[]');
        this.stack.push({ key, type: '[]', size: value.length });
        for (const [index, item] of value.entries()) {
          await this.writeNode(`${index}`, item);
        }
        this.stack.push({ key, type: 'pop' });
      } else {
        // Object
        const entries = Object.entries(value);
        console.log('.'.padStart(this.depth, '.') + key + '{}');
        this.stack.push({ key, type: '{}', size: entries.length });
        for (let [subkey, subvalue] of entries) {
          await this.writeNode(subkey, subvalue);
        }
        this.stack.push({ key, type: 'pop' });
      }
    } else {
      // Value
      console.log('.'.padStart(this.depth, '.') + key + ':', value);
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
          size: value.length * 2,
        });
      } else if (typeof value === 'boolean') {
        // Boolean
        this.stack.push({ key, type: 'Boolean', value, size: 1 });
      }
    }

    this.depth--;
  }

  get bufferSize() {
    return this.stack.reduce(
      (prev, curr) => prev + this.getElementByteSize(curr),
      0
    );
  }

  getElementByteSize({ key, size }: Element) {
    // headerByte + strLen + key + valueSize
    return 1 + 2 + key.length * 2 + (size || 0);
  }

  advanceByteOffset(type: FormatTypeName) {
    const byteSize = ByteSize[type];
    this.byteOffset += byteSize;
  }

  writeString(value: string) {
    const l = value.length;
    this.view.setInt16(this.byteOffset, l);
    this.byteOffset += 2;
    for (var i = 0; i < l; i++) {
      this.view.setUint16(
        this.byteOffset + i * 2,
        value.charCodeAt(i),
        this.littleEndian
      );
    }
    this.byteOffset += value.length * 2;
  }

  writeInt8(value: number) {
    this.view.setInt8(this.byteOffset, value);
    this.advanceByteOffset('Int8');
  }

  writeInt16(value: number) {
    this.view.setInt16(this.byteOffset, value);
    this.advanceByteOffset('Int16');
  }

  writeArrayBuffer(value: ArrayBuffer) {
    new Uint8Array(this.buffer, this.byteOffset).set(new Uint8Array(value));
    this.byteOffset += value.byteLength;
  }

  toArrayBuffer() {
    const size = this.bufferSize;
    console.log('Creating array buffer size ', size);
    this.buffer = new ArrayBuffer(size);
    this.view = new DataView(this.buffer);

    this.stack.forEach(({ key, type, size, value }) => {
      // write header..
      const headerByte = Header[type];
      this.writeInt8(headerByte);

      // write key
      this.writeString(key);

      // write value
      if (type === 'String') {
        this.writeString(value);
      } else if (type === 'Int8') {
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

    console.log(this.buffer);
    return this.buffer;
  }

  toBlob(type: string = 'application/octet-stream') {
    return new Blob([this.toArrayBuffer()], {
      type,
    });
  }
}
