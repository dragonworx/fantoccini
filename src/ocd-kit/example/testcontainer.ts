import { html } from '../core';
import { Container } from './container';
import { Text } from './text';

export class TestContainer extends Container {
  text?: Text;

  protected template() {
    return html`<div><p ref="text">hi</p><p ref="test"></div></div>`;
  }

  protected init() {
    const text = (this.text = new Text({ value: 'Test!', tag: 'inner text' }));
    this.add(text);
  }
}
