import { BaseProps, Control, css } from '../core';

export type Props = BaseProps & {
  width: string | number;
  height: string | number;
  backgroundColor: string;
};

export const defaultProps: Partial<Props> = {
  width: '100%',
  height: '100%',
  backgroundColor: 'green',
};

export class Container extends Control<Props, HTMLDivElement> {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected template() {
    return {
      html: '<div><p data-ref="foo">hi</p></div>',

      style: css(
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
      ),
    };
  }

  protected init() {
    if (this._id === 0) {
      this.refElement('foo').attr('found', '');
    }
  }
}
