export function blobToImg(blob: Blob, x: number, y: number) {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.style.cssText = `position:absolute;top:${y}px;left:${x}px;`;
  img.src = url;
  document.body.appendChild(img);
}

import { base64Img } from './test-image';
import { DataWriter } from './core/serialisation/writer';
import { DataReader } from './core/serialisation/reader';
import {
  base64ToBlob,
  downloadBlob,
  selectLocalFile,
} from './core/serialisation';

const blob = base64ToBlob(base64Img, 'image/gif');
blobToImg(blob, 0, 0);

const arrayBuffer = new ArrayBuffer(4);
const view = new DataView(arrayBuffer);
view.setUint8(0, 1);
view.setUint8(1, 2);
view.setUint8(2, 3);
view.setUint8(3, 4);

const doc = {
  n: null,
  a: 'x',
  x: 123,
  foo: [null, 'bar'],
  y: true,
  z: false,
  w: ['a', 'b', { c: false, d: [1, 2, [3, null]] }],
  p: blob,
  d: {
    b: {
      a: true,
    },
  },
  k: arrayBuffer,
  f: 1000,
};

console.log(doc);

selectLocalFile().then(file => {
  const reader = new DataReader();
  reader.deserialise(file as Blob).then(obj => {
    console.log(obj);
    blobToImg(obj.p, 0, 300);
  });
});

// const writer = new Writer();
// writer.serialise(doc).then(() => {
//   const blob = writer.toBlob();
//   const reader = new Reader();
//   reader.deserialise(blob).then(obj => {
//     console.log(obj);
//     blobToImg(obj.p, 0, 300);
//   });
//   // downloadBlob(blob, 'test.dat');
// });
