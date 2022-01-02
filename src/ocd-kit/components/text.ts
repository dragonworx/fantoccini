import { Control, BaseProps, html, css, BaseControl } from '../core';

export type Props = BaseProps & {
  value: string;
  color: string;
  fontSize: number;
};

export class Text extends Control<HTMLSpanElement, Props>() {
  static defaultProps: Props = {
    ...BaseControl.defaultProps,
    value: '',
    color: '#bdbec0',
    fontSize: 12,
  };

  constructor(props?: Partial<Props>) {
    super({
      ...Text.defaultProps,
      ...props,
    });
  }

  protected template(): HTMLElement | string {
    return html`<span></span>`;
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
      this.element.value = this.value;
    }
  }
}
