import {
  Control,
  BaseProps,
  baseDefaultProps,
  cssRule,
  html,
  css,
} from '../core';

export type Props = BaseProps & {
  width: string | number;
  height: string | number;
  backgroundColor: string;
};

export const defaultProps: Props = {
  ...baseDefaultProps,
  width: 'auto',
  height: 'auto',
  backgroundColor: 'green',
};

export class Container extends Control<Props, HTMLDivElement>() {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      tag: props?.tag || 'notag',
      ...props,
    });
  }

  protected template() {
    return html`<div><p ref="foo">hi</p></div>`;
  }

  protected style() {
    return css`
      div {
        background-color: blue;
        border: 1px solid red;

        &:hover {
          border-style: dashed;
        }

        p {
          color: white;
        }

        p:hover {
          color: blue;
        }
      }
    `;
  }

  protected init() {
    if (this._id === 0) {
      this.ref('foo').attr('found', '');
    }
  }
}
