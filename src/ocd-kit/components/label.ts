import { Text } from '.';
import { Control, BaseProps, html, css, BaseControl } from '../core';

export type Props = BaseProps & {
  text: string;
};

export class Label extends Control<HTMLLabelElement, Props>() {
  static defaultProps: Props = {
    ...BaseControl.defaultProps,
    text: 'LabelText',
  };

  constructor(props?: Partial<Props>) {
    super({
      ...Label.defaultProps,
      ...props,
    });
  }

  protected template() {
    return html`<label
      >${new Text({ tag: 'text', value: this.props.text })}
      <div class="content" slot></div>
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
