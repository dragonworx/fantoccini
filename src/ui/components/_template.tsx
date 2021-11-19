/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode, useRef, useState, useEffect, MouseEvent } from 'react';
import { reset } from './theme';
import { init } from '../util';

export interface Props {}

export const defaultProps: Props = {};

export const style = ({}: Props) => {
  return css`
    ${reset}
  `;
};

export function ScrollBar(props: Props) {
  const [{}, css] = init(props, defaultProps, style);

  return <div css={css} className="component"></div>;
}
