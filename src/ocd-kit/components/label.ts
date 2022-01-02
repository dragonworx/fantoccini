import { Text } from '.';
import {
  Control,
  BaseProps,
  baseDefaultProps,
  html,
  css,
  BaseControl,
} from '../core';

export type Props = BaseProps & {
  content?: BaseControl;
};

export const defaultProps: Props = {
  ...baseDefaultProps,
};

export class Label extends Control<HTMLLabelElement, Props>() {
  text: Text;

  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
    this.text = new Text();
  }

  protected template(): HTMLElement | string {
    return html`<label></label>`;
  }

  protected style() {
    return css`
      label {
        display: flex;
      }
    `;
  }

  protected onUpdate(key: string) {}
}
