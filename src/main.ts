import App from './app/App.svelte';
import { Application } from './app/application';
import { FileFormatReader } from './core/fileFormat-reader';
import './core/fileFormat-writer';
import { FileFormatWriter } from './core/fileFormat-writer';

const app = new App({
  target: document.body,
  props: {},
});

new Application();

export default app;

const writer = new FileFormatWriter();
// writer.writeFloat32(10000.102);
// writer.writeFloat32(101.103);
writer.writeUint8(123);
writer.writeString('hello');
writer.writeUint16(1000);
writer.writeUint16(2000);
writer.writeUint8(255);
writer.writeUint8(126);
writer.writeUint16(1);
writer.writeString('hello2');

const onMouseDown = e => {
  writer.toDownloadLink('file.dat');
  document.body.removeEventListener('mousedown', onMouseDown);
};
document.body.addEventListener('mousedown', onMouseDown);

writer.toBase64().then(base64 => {
  console.log('base64', base64);
  const reader = new FileFormatReader();
  reader.fromBase64(base64).then(() => {
    // console.log(reader.readFloat32().toFixed(3));
    // console.log(reader.readFloat32().toFixed(3));
    console.log(reader.readUint8());
    console.log(reader.readString());
    console.log(reader.readUint16());
    console.log(reader.readUint16());
    console.log(reader.readUint8());
    console.log(reader.readUint8());
    console.log(reader.readUint16());
    console.log(reader.readString());
  });
});
