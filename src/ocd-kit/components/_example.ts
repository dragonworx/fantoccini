import { Control, BaseProps, baseDefaultProps, html, css } from '../core';

export class Text extends Control<Props, HTMLSpanElement>() {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      visible: true,
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
      this.ref().value = this.value;
    }
  }
}
