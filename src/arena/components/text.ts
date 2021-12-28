import { Control, BaseEvents, css, size } from '../core';

export type Events = BaseEvents | 'foo';

export interface Props {
  text: string;
  color: string;
  fontSize: number;
}

export const defaultProps: Props = {
  text: '',
  color: '#bdbec0',
  fontSize: 12,
};

export class Text extends Control<Props, HTMLDivElement, Events> {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected $html() {
    return '<span></span>';
  }

  protected $style() {
    return css('span', {
      textShadow: '1px 1px 1px #080808',
      display: 'inline-block',
      whiteSpace: 'nowrap',
    });
  }

  protected onPropChange(key: string, value: any) {
    if (key === 'text') {
      this.refElement.value = value;
    } else if (key === 'color') {
      this.rootCss.set(key, value);
    }
  }
}
