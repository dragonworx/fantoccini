import { Control, BaseEvents } from './control';
import { css } from '@emotion/css';
import { size } from './util';

export interface Props {
  width: string | number;
  height: string | number;
  backgroundColor: string;
}

export const defaultProps: Props = {
  width: '100%',
  height: '100%',
  backgroundColor: 'transprent',
};

export class Container extends Control<Props, HTMLDivElement, BaseEvents> {
  constructor(props: Partial<Props> = {}) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected html() {
    return `<div></div>`;
  }

  protected style() {
    const { width, height } = this.props;
    return css`
      width: ${size(width)};
      height: ${size(height)};
      background-color: blue;
    `;
  }

  protected controlType(): string[] {
    return ['container'];
  }

  protected updateStyles(key: string, value: string) {
    this.updateStyle(key, size(value));
  }
}
