/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  direction: 'horizontal' | 'vertical';
  spacing?: number;
  margin?: number;
};

export const defaultProps: Props = {
  spacing: 5,
  margin: 5,
  direction: 'horizontal',
};

export const cssStyle = (props: Props) => {
  const { spacing, direction, margin } = props;
  return css`
    display: flex;
    flex-direction: ${direction === 'horizontal' ? 'row' : 'column'};
    flex-wrap: nowrap;

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
    <div css={cssStyle(props)} className="flow-layout">
      {children}
    </div>
  );
}
