import { css } from '../core';
import { Text } from './text';

export class TestText extends Text {
  protected template(): string | HTMLElement {
    return document.getElementById('test')!;
  }

  protected style() {
    return super.style().append(
      css`
        & {
          border: 1px solid black;
        }
      `
    );
  }
}
