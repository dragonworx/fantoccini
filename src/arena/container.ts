import { Control, BaseEvents } from './control';
import { css } from '@emotion/css';
import { size } from './util';

export interface Props {
  width: string | number;
  height: string | number;
}

export const defaultProps: Props = {
  width: '100%',
  height: '100%',
};

export class Container extends Control<Props, HTMLDivElement, BaseEvents> {
  constructor(props: Props = defaultProps) {
    super(props);
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
    if (key === 'width') {
      this.updateStyle(key, size(value));
    }
  }
}
