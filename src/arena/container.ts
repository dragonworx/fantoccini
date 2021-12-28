import { Control, BaseEvents } from './control';
import { css } from './stylesheet';
import { size } from './util';

export type Events = BaseEvents | 'foo';

export interface Props {
  visible: boolean;
  width: string | number;
  height: string | number;
  backgroundColor: string;
}

export class Container extends Control<Props, HTMLDivElement, Events> {
  constructor(props?: Partial<Props>) {
    super({
      visible: true,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      ...props,
    });
  }

  protected $template() {
    return '<div><p data-ref="foo">hi</p></div>';
  }

  protected $style() {
    return css(
      'div',
      {
        backgroundColor: 'blue',
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
    if (this.id === 0) {
      this.ref('foo').setAttribute('found', '');
    }
  }

  protected onPropChange(key: string, value: any) {
    if (key === 'width' || key === 'height') {
      this.css('div').set(key, size(value));
    } else if (key === 'visible') {
      this.css('div').set('display', value ? '' : 'none');
    } else if (key === 'backgroundColor') {
      this.css('div').set(key, value);
    }
  }
}
