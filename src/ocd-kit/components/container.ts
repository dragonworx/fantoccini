import {
  Control,
  BaseProps,
  defaultProps as baseDefaultProps,
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

  protected html() {
    return '<div><p ref="foo">hi</p></div>';
  }

  protected style() {
    return css(
      'div',
      {
        backgroundColor: 'blue',
        border: '1px solid red',
      },
      css('&:hover', {
        borderStyle: 'dashed',
      }),
      css('p', {
        color: 'white',
      }),
      css('p:hover', {
        color: 'blue',
      })
    );
  }

  protected init() {
    if (this._id === 0) {
      this.refElement('foo').attr('found', '');
    }
  }
}
