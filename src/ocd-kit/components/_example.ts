import { Control, html, css, setDataAttr, setIdPrefix } from '../core';
import { Row } from '.';
import { Text } from '.';
import { Label } from '.';

setDataAttr();
setIdPrefix();

export class Example extends Control<HTMLSpanElement>() {
  protected template(): HTMLElement | string {
    return html`<div></div>`;
  }

  protected style() {
    return css`
      & {
        height: 100%;
      }
    `;
  }

  init() {
    const label = new Label();
    const text = new Text({ value: 'contentText!' });
    label.add(text);
    this.add(new Row().add(new Text({ value: 'Text' })));
    this.add(new Row().add(label));
    label.text = 'labelText!';
  }
}
