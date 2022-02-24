import { base64Img } from './test-image';

import {
  BinaryWriter,
  BinaryReader,
  base64ToBlob,
  downloadBlob,
} from './core/serialisation';

export function blobToImg(blob: Blob, x: number, y: number) {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.style.cssText = `position:absolute;top:${y}px;left:${x}px;`;
  img.src = url;
  document.body.appendChild(img);
}

const blob = base64ToBlob(base64Img, 'image/gif');
blobToImg(blob, 0, 0);

const arrayBuffer = new ArrayBuffer(4);
const view = new DataView(arrayBuffer);
view.setUint8(0, 1);
view.setUint8(1, 2);
view.setUint8(2, 3);
view.setUint8(3, 4);

const writer = new BinaryWriter();

writer.writeNumber(10100);
writer.writeNumber(1000.5);
writer.writeNumber(-3000000);
writer.writeString('foobar');
writer.writeBoolean(true);
writer.writeBoolean(false);
writer.writeBlob(blob);
writer.writeArrayBuffer(arrayBuffer);
writer.writeNumber(123.456);
writer.writeBoolean(true);
writer.writeNumber(-1);
writer.writeString('foobar2');

writer.toBase64().then(base64 => {
  console.log('base64!', base64);
  const reader = new BinaryReader();
  reader.fromBase64(base64).then(() => {
    console.log(reader.readNumber());
    console.log(reader.readNumber());
    console.log(reader.readNumber());
    console.log(reader.readString());
    console.log(reader.readBoolean());
    console.log(reader.readBoolean());
    const blob = reader.readBlob();
    blobToImg(blob, 0, 500);
    const buffer = reader.readArrayBuffer();
    const view = new DataView(buffer);
    console.log(
      view.getUint8(0),
      view.getUint8(1),
      view.getUint8(2),
      view.getUint8(3)
    );
    console.log(reader.readNumber(2));
    console.log(reader.readBoolean());
    console.log(reader.readNumber());
    console.log(reader.readString());
  });
});

writer.toBlob().then(() => {
  // downloadBlob(blob, 'test.dat');
});
