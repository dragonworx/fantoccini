/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  margin?: number;
};

export const defaultProps: Props = {
  spacing: 3,
  margin: 3,
  direction: 'horizontal',
};

export const cssStyle = (props: Props) => {
  const { spacing, margin, direction } = props;
  return css`
    display: flex;
    flex-direction: ${direction === 'horizontal' ? 'row' : 'column'};
    flex-wrap: nowrap;
    padding: ${margin}px;
    justify-content: center;
    align-items: center;

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
  const { children } = props;
  return (
    <div css={cssStyle(props)} className="box-layout">
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
