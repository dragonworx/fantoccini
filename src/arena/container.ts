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

  protected createTemplate() {
    return '<div><p>hi</p></div>';
  }

  protected createStyle() {
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

  onPropChange(key: string, value: any) {
    const { styleSheet } = this;
    if (key === 'width' || key === 'height') {
      this.css('div').set(key, size(value));
    } else if (key === 'visible') {
      this.css('div').set('display', value ? '' : 'none');
    } else if (key === 'backgroundColor') {
      this.css('div').set(key, value);
    }
  }
}
