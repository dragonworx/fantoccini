import { Control, BaseEvents, css, size } from '../core/';

export type Events = BaseEvents | 'foo';

export interface Props {
  width: string | number;
  height: string | number;
  backgroundColor: string;
}

export const defaultProps: Props = {
  width: '100%',
  height: '100%',
  backgroundColor: 'green',
};

export class Container extends Control<Props, HTMLDivElement, Events> {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected $html() {
    return '<div><p data-ref="foo">hi</p></div>';
  }

  protected $style() {
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
      this.refAsElement('foo').attr('found', '');
    }
  }

  protected onPropChange(key: string, value: any) {
    if (key === 'width' || key === 'height') {
      this.css('div').set(key, size(value));
    } else if (key === 'backgroundColor') {
      this.css('div').set(key, value);
    }
  }
}
