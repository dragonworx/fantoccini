import { Control } from './control';
import { css } from '@emotion/css';

export interface Props {
  width: string;
  height: string;
  backgroundColor: string;
}

export const defaultProps: Props = {
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
};

export class Container extends Control<Props, HTMLDivElement> {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected render() {
    const { width, height, backgroundColor } = this.props;
    return {
      html: `<div></div>`,
      style: css`
        width: ${width};
        height: ${height};
        background-color: ${backgroundColor};
      `,
    };
  }
}
