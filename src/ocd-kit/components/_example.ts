import { Control, html, css } from '../core';
import { Text } from '.';

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
    this.add(new Text({ value: 'Text' }));
  }
}
