import {
  getNumericType,
  Token,
  byteSize,
  stringByteLength,
  tokens,
  log,
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
      size: stringByteLength(key),
    });

    // this.tokens.push({
    //   type: 'String',
    //   value: key,
    //   size: stringByteLength(key),
    // });
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
  }

  async writeNode(value: any) {
    if (value instanceof Blob) {
      /** Blob */
      const buffer = await new Response(value).arrayBuffer();

      this.tokens.push({
        type: 'Blob',
        value: buffer,
        size: buffer.byteLength,
      });
    } else if (value instanceof ArrayBuffer) {
      /** ArrayBuffer */

      this.tokens.push({
        type: 'ArrayBuffer',
        value,
        size: value.byteLength,
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
          size: 2 + value.length * 2, // size(uint16) + chars
        });
      } else if (typeof value === 'boolean') {
        /** Boolean */
        this.tokens.push({ type: 'Boolean', value, size: 1 });
      }
    }
  }

  toArrayBuffer() {
    const byteLength = this.tokens.reduce(
      (prev, curr) => prev + (curr.size || 0) + 1,
      0
    );

    log(`Writing tokens for ${byteLength} bytes total size`);

    console.table(this.tokens);

    const buffer = new WriteBuffer(byteLength);

    this.tokens.forEach(token => {
      const { type, value } = token;

      try {
        // write token header..
        const header = tokens.indexOf(type);
        buffer.writeUint8(header);

        if (type === '_key') {
          buffer.writeString(value);
        } else if (type === 'String') {
          buffer.writeString(value);
        } else if (type === 'Int8') {
          buffer.writeInt8(value);
        } else if (type === 'Uint8') {
          buffer.writeUint8(value);
        } else if (type === 'Int16') {
          buffer.writeInt16(value);
        } else if (type === 'Boolean') {
          buffer.writeInt8(value ? 1 : 0);
        } else if (type === 'ArrayBuffer') {
          buffer.writeArrayBuffer(value);
        } else if (type === 'Blob') {
          buffer.writeArrayBuffer(value);
        }
      } catch (e) {
        console.error(e);
      }
    });

    log(`WriteBuffer log`);
    console.table(buffer.log);

    return buffer.buffer;
  }

  toBlob(type: string = 'application/octet-stream') {
    return new Blob([this.toArrayBuffer()], {
      type,
    });
  }
}
