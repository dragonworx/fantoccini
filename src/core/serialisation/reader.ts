import { base64ToBlob } from '.';
import { ReadBuffer } from './buffer';
import { log, Token, tokenValue } from './common';

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
        const type = tokenValue(buffer.readUint8());
        const token: ReadToken = {
          type,
        };
        this.tokens.push(token);

        if (type === '_key') {
          token.value = buffer.readString();
        }

        if (c >= 2) {
          break;
        }
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
