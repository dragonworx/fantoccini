import { Control, BaseEvents, html, css } from '../core';
import {
  Container,
  defaultProps as baseDefaultProps,
  Props as BaseProps,
} from './container';

export type Props = BaseProps & {
  title: string;
};

export const defaultProps: Props = {
  ...baseDefaultProps,
  title: 'Title',
};

export class TestContainer2 extends Control<
  Props,
  HTMLDivElement,
  BaseEvents<Props> & { foo: (foo: string) => boolean }
>(Container) {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected template() {
    return html`<div><h1 ref="title"></h1></div>`;
  }

  protected style() {
    return super.style().append(
      css`
        & {
          transition: background-color 1s;
        }
      `
    );
  }

  protected init() {
    this.ref('title').value = this.title;
  }
}
