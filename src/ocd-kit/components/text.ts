import { Control, BaseProps, baseDefaultProps, cssRule, K, V } from '../core';

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

  protected getHtml() {
    return '<span></span>';
  }

  protected getStyle() {
    return cssRule('span', {
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
