/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode, useRef, useState, useEffect } from 'react';
import { reset } from './theme';
import { ScrollBar } from './scrollBar';
import { getProps } from '../util';
import { forceUpdate, useProp } from '../hooks';

export const scrollSize = 20;

export interface Props {
  children?: ReactNode;
  width: number;
  height: number;
}

export const defaultProps: Props = {
  width: 0,
  height: 0,
};

export const style =
  (
    contentWidth: number,
    contentHeight: number,
    xValue: number,
    yValue: number
  ) =>
  ({ width, height }: Props) => {
    const innerHLength = contentWidth - width;
    const innerVLength = contentHeight - height;
    const xPos = innerHLength * xValue * -1;
    const xyos = innerVLength * yValue * -1;
    return css`
      ${reset}
      position: relative;
      /* outline: 1px solid red; */
      overflow: hidden;
      width: ${width + scrollSize}px;
      height: ${height + scrollSize}px;

      .view {
        position: relative;
        width: ${`${width}px`};
        height: ${`${height}px`};
        /* outline: 1px solid cyan; */
        overflow: hidden;

        .content {
          width: ${`${contentWidth}px`};
          height: ${`${contentHeight}px`};
          /* outline: 1px solid blue; */
          position: relative;
          left: ${xPos}px;
          top: ${xyos}px;
        }
      }

      .corner {
        background-color: #282d34;
        position: absolute;
        right: 0;
        bottom: 0;
        width: ${scrollSize}px;
        height: ${scrollSize}px;
        border-top: 1px solid #444;
        border-left: 1px solid #444;
      }

      .scrollbar.vertical {
        position: absolute;
        top: 0;
        right: 0;
        height: calc(100% - ${scrollSize}px);
      }

      .scrollbar.horizontal {
        position: absolute;
        bottom: 0;
        left: 0;
        width: calc(100% - ${scrollSize}px);
      }
    `;
  };

export function ScrollView(props: Props) {
  const allProps = getProps(props, defaultProps);
  const { children, width, height } = allProps;

  const contentSizeRef = useRef({ width: 0, height: 0 });
  const valueRef = useRef({ x: 0, y: 0 });
  const contentSize = contentSizeRef.current;
  const value = valueRef.current;

  const css = style(
    contentSize.width,
    contentSize.height,
    value.x,
    value.y
  )(allProps);
  const ref = useRef<HTMLDivElement>(null);
  const refresh = forceUpdate();

  useEffect(() => {
    if (ref.current && contentSize.width === 0) {
      const element = ref.current.querySelector('.content *') as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        const size = { width: element.offsetWidth, height: rect.height };
        contentSize.width = element.offsetWidth;
        contentSize.height = rect.height;
        refresh();
      }
    }
  });

  const onWheelHandler = (e: WheelEvent) => {
    const { deltaX, deltaY, deltaZ } = e;
    e.preventDefault();
    if (deltaY !== 0) {
      const innerLength = contentSize.height - height;
      value.y =
        Math.max(Math.min(innerLength * value.y + deltaY, innerLength), 0) /
        innerLength;
      refresh();
    } else if (deltaX !== 0) {
      const innerLength = contentSize.width - width;
      value.x =
        Math.max(Math.min(innerLength * value.x + deltaX, innerLength), 0) /
        innerLength;
      refresh();
    }
  };

  useEffect(() => {
    ref.current &&
      ref.current.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => {
      ref.current && ref.current.removeEventListener('wheel', onWheelHandler);
    };
  }, [ref.current]);

  const onHChange = (newValue: number) => {
    value.x = newValue;
    refresh();
  };

  const onVChange = (newValue: number) => {
    value.y = newValue;
    refresh();
  };

  return (
    <div ref={ref} css={css} className="scrollview">
      <div className="view">
        <div className="content">{children}</div>
      </div>
      <ScrollBar
        direction="horizontal"
        totalRange={contentSize.width}
        visibleRange={width}
        value={value.x}
        thickness={scrollSize}
        onChange={onHChange}
      />
      <ScrollBar
        direction="vertical"
        totalRange={contentSize.height}
        visibleRange={height}
        value={value.y}
        thickness={scrollSize}
        onChange={onVChange}
      />
      <div className="corner"></div>
    </div>
  );
}
