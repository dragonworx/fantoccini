/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';
import { reset } from '../components/theme';

export type Direction = 'horizontal' | 'vertical';
export type Alignment = 'start' | 'center' | 'end';
export type Justification =
  | 'start'
  | 'center'
  | 'end'
  | 'space-evenly'
  | 'space-around';

export type Props = {
  children?: ReactNode;
  direction?: Direction;
  reversed?: boolean;
  spacing?: number;
  margin?: number;
  align?: Alignment;
  justify?: Justification;
  width?: number;
  height?: number;
};

export const defaultProps: Props = {
  spacing: 3,
  margin: 3,
  direction: 'horizontal',
  reversed: false,
  align: 'start',
  justify: 'center',
};

export const cssStyle = (props: Props) => {
  const {
    spacing,
    margin,
    direction,
    reversed,
    align,
    justify,
    width,
    height,
  } = props;
  return css`
    ${reset}
    display: flex;
    flex-direction: ${direction === 'horizontal'
      ? reversed
        ? 'row-reverse'
        : 'row'
      : reversed
      ? 'column-reverse'
      : 'column'};
    flex-wrap: nowrap;
    padding: ${margin}px;
    align-items: ${align};
    justify-content: ${justify};
    width: ${width ? `${width}px` : '100%'};
    height: ${height ? `${height}px` : '100%'};
    position: relative;

    & > * {
      margin: ${spacing}px;
    }
  `;
};

export function BoxLayout(props: Props) {
  props = {
    ...defaultProps,
    ...props,
  };

  const { children, direction, reversed, align, justify } = props;
  return (
    <div
      css={cssStyle(props)}
      className="boxlayout"
      data-direction={direction}
      data-reversed={reversed}
      data-align={align}
      data-justify={justify}
    >
      {children}
    </div>
  );
}

export function HBoxLayout(props: Props) {
  props = {
    ...defaultProps,
    ...props,
  };
  const { children } = props;
  return (
    <BoxLayout {...props} direction="horizontal">
      {children}
    </BoxLayout>
  );
}

export function VBoxLayout(props: Props) {
  props = {
    ...defaultProps,
    ...props,
  };
  const { children } = props;
  return (
    <BoxLayout {...props} direction="vertical">
      {children}
    </BoxLayout>
  );
}
