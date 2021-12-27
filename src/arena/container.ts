import { Control, BaseEvents } from './control';
import { css } from '@emotion/css';

export type Events = BaseEvents | 'foo';

export interface Props {
  visible: boolean;
  width: string;
  height: string;
  backgroundColor: string;
}

export class Container extends Control<Props, HTMLDivElement, Events> {
  constructor(props?: Partial<Props>) {
    super({
      visible: true,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      ...props,
    });
  }

  protected renderHTML() {
    return '<div></div>';
  }

  protected renderStyle() {
    const { visible, width, height, backgroundColor } = this.props;
    return css`
      width: ${width};
      height: ${height};
      background-color: ${backgroundColor};
    `;
  }

  onPropChange(key: string, value: any) {
    if (key === 'visible') {
      this.updateStyle('height', value ? '20px' : '50px');
      return false;
    }
  }
}
