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
  text: string;
};

export const defaultProps: Props = {
  ...baseDefaultProps,
  text: 'LabelText',
};

export class Label extends Control<HTMLLabelElement, Props>() {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected template(): HTMLElement | string {
    return html`<label
      >${new Text({ tag: 'text', value: this.props.text })}</label
    >`;
  }

  protected style() {
    return css`
      label {
        display: flex;
      }
    `;
  }

  protected onUpdate(key: string, value: any) {
    if (key === 'text') {
      this.tag<Text>('text').value = value;
    }
  }
}
