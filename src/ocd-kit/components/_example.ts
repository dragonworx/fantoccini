import { Control, html, css } from '../core';
import { Row } from '.';
import { Text } from '.';
import { Label } from '.';

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
    this.add(new Row().add(new Text({ value: 'Text' })));
    this.add(new Row().add(label));
    label.text = 'abc';
  }
}
