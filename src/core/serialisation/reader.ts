// import { base64ToBlob } from '.';
// import {
//   ByteSize,
//   DataTypeName,
//   GetTypeMethods,
//   isHeaderNumeric,
//   headerDataTypeName,
//   Header,
//   HeaderName,
// } from './common';

// type Token = {
//   type: number;
//   value: any;
// };

// export class Reader {
//   depth: number = 0;
//   buffer: ArrayBuffer = new ArrayBuffer(0);
//   view: DataView = new DataView(this.buffer);
//   byteOffset: number = 0;
//   littleEndian: boolean = true;
//   log: {} = {};
//   stack: Token[];

//   private debug(value: string, byteOffset: number = this.byteOffset) {
//     this.log[byteOffset] = value;
//     console.log([this.byteOffset, value]);
//   }

//   private reset() {
//     this.depth = 0;
//     this.byteOffset = 0;
//     this.buffer = new ArrayBuffer(0);
//     this.view = new DataView(this.buffer);
//     this.log = {};
//     this.stack = [];
//   }

//   private advanceByteOffset(type: HeaderName) {
//     const byteSize = ByteSize[type];
//     this.byteOffset += byteSize;
//   }

//   private readString() {
//     const byteOffset = this.byteOffset;
//     const size = this.readInt16();
//     this.debug(`string{${size}}`, byteOffset);
//     let str = '';
//     for (var i = 0; i < size; i++) {
//       const byteOffset = this.byteOffset;
//       const charCode = this.view.getUint16(
//         this.byteOffset + i * 2,
//         this.littleEndian
//       );
//       this.debug(
//         `string[${i}]: ${charCode} "${String.fromCharCode(charCode)}"`,
//         byteOffset
//       );
//       str += String.fromCharCode(charCode);
//     }
//     this.byteOffset += size * 2;
//     return str;
//   }

//   private readNumericType(
//     dataViewMethod: (byteOffset: number, littleEndian?: boolean) => number,
//     type: DataTypeName
//   ) {
//     const value = dataViewMethod.call(
//       this.view,
//       this.byteOffset,
//       this.littleEndian
//     );
//     this.debug(`${type} = ${value}`);
//     this.advanceByteOffset(type);
//     return value;
//   }

//   private readInt8 = () => this.readNumericType(this.view.getInt8, 'Int8');
//   private readInt16 = () => this.readNumericType(this.view.getInt16, 'Int16');

//   async parse(blobOrBase64: Blob | string) {
//     this.reset();

//     if (blobOrBase64 instanceof Blob) {
//       this.buffer = await new Response(blobOrBase64).arrayBuffer();
//     } else {
//       const blob = base64ToBlob(blobOrBase64);
//       return this.parse(blob);
//     }

//     this.view = new DataView(this.buffer);

//     for (let i = 0; i < 3; i++) {
//       this.debug(`---- BEGIN: ${i} ----`);

//       const headerTypeIndex = this.readInt8();
//       const headerTypeName = headerDataTypeName(headerTypeIndex);

//       const token: Token = {
//         type: headerTypeIndex,
//         value: null,
//       };

//       if (isHeaderNumeric(headerTypeIndex)) {
//         const method = GetTypeMethods[headerTypeName];
//         token.value = this.readNumericType(
//           this.view[method],
//           headerTypeName as DataTypeName
//         );
//       } else if (headerTypeName === 'String') {
//         token.value = this.readString();
//       }

//       this.stack.push(token);
//     }

//     console.log(
//       'STACK:',
//       this.stack.map(token => ((token as any).type = Header[token.type]))
//     );

//     console.table(this.log);
//   }
// }
export default 1;
