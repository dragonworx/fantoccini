import { base64ToBlob } from '.';
import { ReadBuffer } from './buffer';
import { isTokenNumeric, log, Token, tokenValue } from './common';

type ReadToken = {
  type: Token;
  value?: any;
};

export class Reader {
  tokens: ReadToken[] = [];

  async parse(blobOrBase64: Blob | string) {
    let buffer: ReadBuffer;

    if (blobOrBase64 instanceof Blob) {
      const arrayBuffer = await new Response(blobOrBase64).arrayBuffer();
      buffer = new ReadBuffer(arrayBuffer);
    } else {
      const blob = base64ToBlob(blobOrBase64);
      return this.parse(blob);
    }

    log(`Reading tokens from ${buffer.length} bytes total size`);
    let c = 0;

    while (!buffer.isEOF) {
      c++;

      try {
        const token = tokenValue(buffer.readUint8());
        const readToken: ReadToken = {
          type: token,
        };
        this.tokens.push(readToken);

        if (token === '_key') {
          readToken.value = buffer.readString();
        } else if (token === 'String') {
          readToken.value = buffer.readString();
        } else if (token === 'Int8') {
          readToken.value = buffer.readInt8();
        } else if (token === 'Uint8') {
          readToken.value = buffer.readUint8();
        } else if (token === 'Int16') {
          readToken.value = buffer.readInt16();
        }

        // if (c >= 10) {
        //   break;
        // }
      } catch (e) {
        console.log(e);
        break;
      }
    }

    console.table(this.tokens);

    log(`ReadBuffer log`);
    console.table(buffer.log);
  }
}
