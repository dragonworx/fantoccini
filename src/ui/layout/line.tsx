/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { getCss } from '../util';

export interface Props {
  direction?: 'horizontal' | 'vertical';
  size?: number;
}

export const defaultProps: Props = {
  direction: 'vertical',
  size: 2,
};

export const style = ({ direction, size }: Props) => css`
  display: inline-block;
  width: ${direction === 'vertical' ? `${size}px` : '100%'};
  height: ${direction === 'horizontal' ? `${size}px` : '100%'};
  background: #666;
`;

export function Line(props: Props) {
  const css = getCss(style, props, defaultProps);
  return <div css={css} className="spacer"></div>;
}
