import { Control, css } from '../core';
import {
  Container,
  defaultProps as baseDefaultProps,
  Props as BaseProps,
} from './container';

export type Props = BaseProps & {
  title: string;
};

export const defaultProps: Props = {
  ...baseDefaultProps,
  title: 'Title',
};

export class TestContainer2 extends Control<Props, HTMLDivElement>(Container) {
  constructor(props?: Partial<Props>) {
    super({
      ...defaultProps,
      ...props,
    });
  }

  protected html() {
    return '<div><h1 ref="title"></h1></div>';
  }

  protected style() {
    const rule = super.style()!;
    rule.css('&', {
      transition: 'background-color 1s',
    });
    return rule;
  }

  protected init() {
    this.refElement('title').value = this.title;
  }
}
