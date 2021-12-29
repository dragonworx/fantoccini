import { Container } from './container';
import { Text } from './text';

export interface Props {
  width: string | number;
  height: string | number;
  backgroundColor: string;
}

export const defaultProps: Props = {
  width: '100%',
  height: '100%',
  backgroundColor: 'green',
};

export class TestContainer extends Container {
  text?: Text;

  protected template() {
    const { style } = super.template();
    return {
      html: '<div><p data-ref="foo">hi</p><p data-ref="test"></div></div>',

      style,
    };
  }

  protected init() {
    const text = (this.text = new Text({ value: 'Test!' }));
    this.add(text, 'test');
  }
}
