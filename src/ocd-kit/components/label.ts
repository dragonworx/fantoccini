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

  get defaultRefTarget() {
    return 'content';
  }

  protected template() {
    return html`<label
      >${new Text({ tag: 'text', value: this.props.text })}
      <div ref="content"></div>
    </label>`;
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
