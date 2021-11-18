/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { getCss } from '../util';

export interface Props {
  width?: number;
  height?: number;
}

export const defaultProps: Props = {
  width: 50,
  height: 20,
};

export const style = ({ width, height }: Props) => css`
  display: inline-block;
  width: ${width}px;
  height: ${height}px;
`;

export function Spacer(props: Props) {
  const css = getCss(style, props, defaultProps);
  return <div css={css} className="spacer"></div>;
}
