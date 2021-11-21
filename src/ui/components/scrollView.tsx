/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode, useRef, useState, useEffect, MouseEvent } from 'react';
import { reset } from './theme';
import { ScrollBar } from './scrollBar';
import { getProps } from '../util';

export const scrollSize = 25;

export interface Props {
  children?: ReactNode;
  width?: number;
  height?: number;
}

export const defaultProps: Props = {};

export const style =
  (availableWidth: number, availableHeight: number) =>
  ({}: Props) => {
    return css`
      ${reset}
      width: 100%;
      height: 100%;
      position: relative;
      outline: 1px solid red;
      /* padding-right: ${scrollSize}px;
      padding-bottom: ${scrollSize}px; */

      .scroll-content {
        width: ${width}px;
        height: ${height ? `${height}px` : 'auto'};
        outline: 1px solid green;
        overflow: hidden;
      }
    `;
  };

export function ScrollView(props: Props) {
  const allProps = getProps(props, defaultProps);
  const { children, width, height } = allProps;
  const [availableWidth, setAvailableWidth] = useState(0);
  const [availableHeight, setAvailableHeight] = useState(0);
  const css = style(availableWidth, availableHeight)(allProps);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setAvailableWidth(Math.round(rect.width));
    }
  }, [ref.current, availableWidth]);

  return (
    <div ref={ref} css={css} className="scrollview">
      <div className="scroll-content">{ref.current ? children : null}</div>
    </div>
  );
}
