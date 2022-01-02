import { Text } from '.';
import { Control, BaseProps, html, css, BaseControl } from '../core';

export type Props = BaseProps & {
  text: string;
};

export const defaultProps: Props = {
  ...BaseControl.defaultProps,
  text: 'LabelText',
};

export class Label extends Control<HTMLLabelElement, Props>() {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected getContainer() {
    return '.content';
  }

  protected template() {
    return html`<label
      >${new Text({ tag: 'text', value: this.props.text })}
      <div class="content"></div>
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
