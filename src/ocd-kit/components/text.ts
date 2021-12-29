import {
  Control,
  BaseProps,
  defaultProps as baseDefaultProps,
  css,
  K,
  V,
} from '../core';

export type Props = BaseProps & {
  value: string;
  color: string;
  fontSize: number;
};

export const defaultProps: Props = {
  ...baseDefaultProps,
  value: '',
  color: '#bdbec0',
  fontSize: 12,
};

export class Text extends Control<Props, HTMLSpanElement>() {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      visible: true,
      ...props,
    });
  }

  protected html() {
    return '<span></span>';
  }

  protected style() {
    return css('span', {
      textShadow: '1px 1px 1px #080808',
      display: 'inline-block',
      whiteSpace: 'nowrap',
    });
  }

  protected onUpdate(key: string) {
    if (key === 'value') {
      this.elementRef.value = this.value;
    }
  }
}
