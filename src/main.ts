// import App from './app/App.svelte';
// import { Application } from './app/application';

// const app = new App({
//   target: document.body,
//   props: {},
// });

// new Application();

// export default app;

// import './test-serialisation';

export const foo = 1;

// const buffer = new ArrayBuffer(12);

// const writer = new DataView(buffer);
// writer.setInt8(0, 100);
// writer.setFloat32(1, 1000);

// const reader = new DataView(buffer);
// console.log(reader.getInt8(0));
// console.log(reader.getFloat32(1));

export function blobToImg(blob: Blob, x: number, y: number) {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.style.cssText = `position:absolute;top:${y}px;left:${x}px;`;
  img.src = url;
  document.body.appendChild(img);
}

import { base64Img } from './test-image';
import { Writer } from './core/serialisation/writer';
import { Reader } from './core/serialisation/reader';
import { base64ToBlob, downloadBlob } from './core/serialisation';

const blob = base64ToBlob(base64Img, 'image/gif');
blobToImg(blob, 0, 0);

const arrayBuffer = new ArrayBuffer(4);
const view = new DataView(arrayBuffer);
view.setUint8(0, 1);
view.setUint8(1, 2);
view.setUint8(2, 3);
view.setUint8(3, 4);

const doc = {
  x: 1,
  // y: ['a', 'b', { c: false, blob }],
  // z: {
  //   b: {
  //     a: true,
  //   },
  // },
  // k: arrayBuffer,
  // w: 1000,
};

const writer = new Writer();
console.log('---------------- WRITE');
writer.parse(doc).then(() => {
  // writer.toArrayBuffer();
  const blob = writer.toBlob();
  const reader = new Reader();
  console.log('---------------- READ');
  reader.parse(blob).then(parsedDoc => {});
  // downloadBlob(blob, 'test.dat');
});
