/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode, useRef, useState, useEffect, MouseEvent } from 'react';
import { reset } from './theme';
import { init } from '../util';

export type Direction = 'horizontal' | 'vertical';

export interface Props {
  direction?: Direction;
  size?: number;
  outerSize: number;
  innerSize: number;
  offset: number;
}

export const defaultProps: Props = {
  direction: 'horizontal',
  size: 20,
  outerSize: 1,
  innerSize: 1,
  offset: 0,
};

export const style = ({
  direction,
  size,
  outerSize,
  innerSize,
  offset,
}: Props) => {
  const thumbSize = (innerSize / outerSize) * 100;
  return css`
    ${reset}
    background-color: #333;
    position: relative;
    width: ${direction === 'horizontal' ? '100%' : `${size}px`};
    height: ${direction === 'horizontal' ? `${size}px` : '100%'};

    .thumb {
      position: absolute;
      background-color: #666;
      border: 1px solid red;
      left: ${offset * 100}%;
      top: 0;
      width: ${direction === 'horizontal' ? `${thumbSize}%` : '100%'};
      height: ${direction === 'horizontal' ? '100%' : `${thumbSize}px`};
    }
  `;
};

export function ScrollBar(props: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [{}, css] = init(props, defaultProps, style);

  return (
    <div css={css} className="scrollbar" ref={ref}>
      <div className="thumb"></div>
    </div>
  );
}
