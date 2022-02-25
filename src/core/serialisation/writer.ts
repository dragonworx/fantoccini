import {
  getNumericType,
  Token,
  byteSize,
  stringByteLength,
  tokens,
  log,
  isTokenNumeric,
  SIZE_BYTES,
} from './common';
import { WriteBuffer } from './buffer';

type WriteToken = {
  type: Token;
  value?: any;
  size?: number;
};

export class Writer {
  tokens: WriteToken[] = [];

  writeKey(key: string) {
    this.tokens.push({
      type: '_key',
      value: key,
      size: 1 + stringByteLength(key),
    });
  }

  async parse(obj: Record<string, any> | Array<any>) {
    const isArray = Array.isArray(obj);

    if (isArray) {
      this.tokens.push({
        type: '_pushArr',
      });
    } else {
      this.tokens.push({
        type: '_pushObj',
      });
    }

    for (let [key, value] of Object.entries(obj)) {
      if (!isArray) {
        this.writeKey(key);
      }
      await this.writeNode(value);
    }

    this.tokens.push({
      type: '_pop',
    });

    this.tokens.push({
      type: '_eof',
    });
  }

  async writeNode(value: any) {
    if (value instanceof Blob) {
      /** Blob */
      const buffer = await new Response(value).arrayBuffer();

      this.tokens.push({
        type: 'Blob',
        value: buffer,
        size: buffer.byteLength + SIZE_BYTES,
      });
    } else if (value instanceof ArrayBuffer) {
      /** ArrayBuffer */

      this.tokens.push({
        type: 'ArrayBuffer',
        value,
        size: value.byteLength + SIZE_BYTES,
      });
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        /** Array */
        this.tokens.push({ type: '_pushArr' });

        for (const [, item] of value.entries()) {
          await this.writeNode(item);
        }

        this.tokens.push({ type: '_pop' });
      } else {
        /** Object */
        const entries = Object.entries(value);
        this.tokens.push({ type: '_pushObj' });

        for (let [subkey, subvalue] of entries) {
          this.writeKey(subkey);

          await this.writeNode(subvalue);
        }

        this.tokens.push({ type: '_pop' });
      }
    } else {
      /** Primitive Values */
      if (typeof value === 'number') {
        /** Number */
        const type = getNumericType(value);
        const byteLength = byteSize[type];
        this.tokens.push({ type, value, size: byteLength });
      } else if (typeof value === 'string') {
        /** String */
        this.tokens.push({
          type: 'String',
          value,
          size: SIZE_BYTES + value.length * 2,
        });
      } else if (typeof value === 'boolean') {
        /** Boolean */
        this.tokens.push({ type: 'Boolean', value, size: 1 });
      }
    }
  }

  toArrayBuffer() {
    const byteLength =
      this.tokens.reduce((prev, curr) => prev + (curr.size || 0) + 1, 0) +
      SIZE_BYTES;

    log(`Writing tokens for ${byteLength} bytes total size`);
    console.table(this.tokens);

    const buffer = new WriteBuffer(byteLength);

    this.tokens.forEach(token => {
      const { type, value } = token;

      try {
        const header = tokens.indexOf(type);
        buffer.writeUint8(header);

        if (type === '_key') {
          buffer.writeString(value);
        } else if (type === 'String') {
          buffer.writeString(value);
        } else if (isTokenNumeric(type)) {
          buffer.writeNumericType(type, value);
        } else if (type === 'Boolean') {
          buffer.writeBoolean(value);
        } else if (type === 'ArrayBuffer' || type === 'Blob') {
          buffer.writeArrayBuffer(value);
        }
      } catch (e) {
        console.error(e);
        console.error('Byteoffset: ' + buffer.byteOffset);
      }
    });

    log(`WriteBuffer log [${buffer.log.length}]`);
    console.table(buffer.log);

    return buffer.array;
  }

  toBlob(type: string = 'application/octet-stream') {
    return new Blob([this.toArrayBuffer()], {
      type,
    });
  }
}
