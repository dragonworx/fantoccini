import { SupportedType, BinaryType, BinaryItem, blobToBase64 } from './util';

export class BinaryWriter {
  buffer: BinaryItem[];
  header: number[];
  littleEndian: boolean;

  constructor() {
    this.buffer = [];
    this.header = [];
    this.littleEndian = true;
  }

  writeNumber(value: number) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, value, this.littleEndian);
    this.buffer.push({
      type: BinaryType.Number,
      buffer,
    });
  }

  writeString(value: string) {
    const buffer = new ArrayBuffer(value.length * 2);
    const view = new DataView(buffer);
    for (var i = 0, strLen = value.length; i < strLen; i++) {
      view.setUint16(i * 2, value.charCodeAt(i), this.littleEndian);
    }
    this.buffer.push({
      type: BinaryType.String,
      buffer,
    });
  }

  writeBoolean(value: boolean) {
    const buffer = new ArrayBuffer(1);
    const view = new DataView(buffer);
    view.setUint8(0, value ? 1 : 0);
    this.buffer.push({
      type: BinaryType.Boolean,
      buffer,
    });
  }

  writeBlob(value: Blob) {
    this.buffer.push({
      type: BinaryType.Blob,
      buffer: new ArrayBuffer(0),
      blob: value,
    });
    this.writeString(value.type);
  }

  writeArrayBuffer(value: ArrayBuffer) {
    this.buffer.push({
      type: BinaryType.ArrayBuffer,
      buffer: value,
    });
  }

  async toBlob() {
    const arrayBuffer = await this.toArrayBuffer();
    const blob = new Blob([arrayBuffer], {
      type: 'application/octet-stream',
    });
    return blob;
  }

  async toArrayBuffer() {
    // convert blobs to arraybuffer
    for (let i = 0; i < this.buffer.length; i++) {
      const item = this.buffer[i];
      if (item.type === BinaryType.Blob && item.blob) {
        const buffer = await new Response(item.blob).arrayBuffer();
        item.buffer = buffer;
      }
    }

    // get buffer size
    const bufferSize = this.buffer.reduce((value, item) => {
      const type = item.type;
      const val = value + item.buffer.byteLength;
      return type === BinaryType.String ||
        type === BinaryType.Blob ||
        type === BinaryType.ArrayBuffer
        ? 4 + val
        : val;
    }, 0);

    const buffer = new ArrayBuffer(bufferSize);
    const destView = new DataView(buffer);
    let offset = 0;

    this.buffer.forEach((item, j) => {
      const itemBuffer = item.buffer;
      const type = item.type;

      // write length before string, blob or arraybuffer
      if (
        type === BinaryType.String ||
        type === BinaryType.Blob ||
        type === BinaryType.ArrayBuffer
      ) {
        let length: number = 0;
        if (type === BinaryType.String) {
          length = itemBuffer.byteLength / 2;
        } else {
          length = itemBuffer.byteLength;
        }
        destView.setUint32(offset, length, this.littleEndian);
        offset += 4;
      }

      // copy item src buffer to dest buffer
      const srcView = new DataView(itemBuffer);
      for (let i = 0; i < itemBuffer.byteLength; i++) {
        const val = srcView.getUint8(i);
        destView.setUint8(offset + i, val);
      }

      offset += itemBuffer.byteLength;
    });

    return buffer;
  }

  async toBase64(includeHeader: boolean = false) {
    const blob = await this.toBlob();
    const base64 = await blobToBase64(blob);
    return includeHeader ? base64 : base64.split(',')[1];
  }
}
