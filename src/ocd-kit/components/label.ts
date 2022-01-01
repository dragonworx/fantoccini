import { Control, BaseProps, baseDefaultProps, html, css } from '../core';

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

export class Label extends Control<HTMLSpanElement, Props>() {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      visible: true,
      ...props,
    });
  }

  protected template(): HTMLElement | string {
    return html`<label></label>`;
  }

  protected style() {
    return css`
      span {
        text-shadow: 1px 1px 1px #080808;
        display: inline-block;
        white-space: nowrap;
      }
    `;
  }

  protected onUpdate(key: string) {
    if (key === 'value') {
      this.ref().value = this.value;
    }
  }
}
