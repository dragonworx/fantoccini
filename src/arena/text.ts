import { Control, BaseEvents } from './control';

export interface Props {
  text?: string;
  color?: string;
}

export const defaultProps: Props = {};

export class Text extends Control<Props, HTMLSpanElement, BaseEvents> {
  constructor(props: Props = defaultProps) {
    super(props);
  }

  protected html() {
    return `<span>${this.props.text}</span>`;
  }

  protected style() {
    return '';
  }

  protected controlType(): string[] {
    return ['container'];
  }
}
