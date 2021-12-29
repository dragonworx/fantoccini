import { Control, css, K, V } from '../core';

export interface Props {
  value: string;
  color: string;
  fontSize: number;
}

export const defaultProps: Props = {
  value: '',
  color: '#bdbec0',
  fontSize: 12,
};

export class Text extends Control<Props, HTMLDivElement> {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected template() {
    return {
      html: '<span></span>',

      style: css('span', {
        textShadow: '1px 1px 1px #080808',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }),
    };
  }

  protected onUpdate(key: K<Props>, value: V<Props>) {
    if (key === 'value') {
      this.elementRef.value = String(value);
    }
  }
}
