/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode, useRef, useState, useEffect } from 'react';
import { buttonBg, reset } from './theme';
import { ScrollBar } from './scrollBar';
import { getProps } from '../util';
import { forceUpdate } from '../hooks';

export const scrollSize = 20;

export interface Props {
  children?: ReactNode;
  width?: number;
  height: number;
  scrollBars?: 'both' | 'horizontal' | 'vertical';
}

export const defaultProps: Props = {
  width: 0,
  height: 0,
  scrollBars: 'both',
};

export const style =
  (
    width: number,
    height: number,
    viewWidth: number,
    viewHeight: number,
    contentWidth: number,
    contentHeight: number,
    xValue: number,
    yValue: number
  ) =>
  ({ scrollBars }: Props) => {
    const pViewWidth = width > 0 ? width : viewWidth - scrollSize;
    const pViewHeight = height > 0 ? height : viewHeight - scrollSize;
    const innerHLength = contentWidth - pViewWidth;
    const innerVLength = contentHeight - pViewHeight;
    const xPos = innerHLength * xValue * -1;
    const xyos = innerVLength * yValue * -1;
    const hScrollEnabled = pViewWidth < contentWidth;
    const vScrollEnabled = pViewHeight < contentHeight;
    const containerWidth =
      width > 0
        ? `${width + (scrollBars !== 'horizontal' ? scrollSize : 0)}px`
        : '100%';
    const containerHeight =
      height > 0
        ? `${height + (scrollBars !== 'vertical' ? scrollSize : 0)}px`
        : '100%';

    return css`
      ${reset}
      ${buttonBg(true, true, 0)}
      position: relative;
      width: ${containerWidth};
      height: ${containerHeight};
      min-width: 50px;

      .view {
        position: relative;
        width: ${viewWidth === 0 ? '100%' : `${pViewWidth}px`};
        height: ${viewHeight === 0 ? '100%' : `${pViewHeight}px`};
        overflow: hidden;
        display: flex;
        justify-content: ${hScrollEnabled ? 'start' : 'center'};
        align-items: ${vScrollEnabled ? 'start' : 'center'};

        .content {
          width: ${`${contentWidth}px`};
          height: ${`${contentHeight}px`};
          position: relative;
          left: ${xPos}px;
          top: ${xyos}px;
        }
      }

      .scrollbar.horizontal {
        position: absolute;
        bottom: 0;
        left: 0;
        width: calc(100% - ${scrollBars !== 'horizontal' ? scrollSize : 0}px);
      }

      .scrollbar.vertical {
        position: absolute;
        top: 0;
        right: 0;
        height: calc(100% - ${scrollBars !== 'vertical' ? scrollSize : 0}px);
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
    `;
  };

export function ScrollView(props: Props) {
  const allProps = getProps(props, defaultProps);
  const { children, width, height, scrollBars } = allProps;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentSizeRef = useRef({ width: 0, height: 0 });
  const viewSizeRef = useRef({ width, height });
  const valueRef = useRef({ x: 0, y: 0 });

  const contentSize = contentSizeRef.current;
  const viewSize = viewSizeRef.current;
  const value = valueRef.current;

  const isHScrollEnabled = () =>
    viewSize.width - scrollSize < contentSize.width;

  const isVScrollEnabled = () =>
    viewSize.height - scrollSize < contentSize.height;

  const css = style(
    width,
    height,
    viewSize.width,
    viewSize.height,
    contentSize.width,
    contentSize.height,
    value.x,
    value.y
  )(allProps);

  const refresh = forceUpdate();

  /** detect content size */
  useEffect(() => {
    const container = containerRef.current;
    if (container && contentSize.width === 0) {
      const content = containerRef.current.querySelector(
        '.content *'
      ) as HTMLElement;
      if (content) {
        contentSize.width = content.offsetWidth;
        contentSize.height = content.offsetHeight;
        refresh();
      }
    }
  });

  const onResize = () => {
    if (width > 0) {
      return;
    }
    const container = containerRef.current;
    if (container) {
      if (viewSize.width !== container.offsetWidth) {
        viewSize.width = container.offsetWidth;
        if (!isHScrollEnabled()) {
          value.x = 0;
        }
        refresh();
      }
      if (viewSize.height !== container.offsetHeight) {
        viewSize.height = container.offsetHeight;
        if (!isVScrollEnabled()) {
          value.y = 0;
        }
        refresh();
      }
    }
  };

  const [observer] = useState<ResizeObserver>(new ResizeObserver(onResize));

  /** observe resizes on container */
  useEffect(() => {
    const container = containerRef.current;
    if (container && container.offsetWidth > 0) {
      observer.observe(container);
      onResize();
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [containerRef.current]);

  const onWheelHandler = (e: WheelEvent) => {
    const { deltaX, deltaY } = e;
    e.preventDefault();
    if (deltaX !== 0 && scrollBars !== 'vertical') {
      const pViewWidth = viewSize.width - scrollSize;
      const innerHLength = contentSize.width - pViewWidth;
      value.x =
        Math.max(Math.min(innerHLength * value.x + deltaX, innerHLength), 0) /
        innerHLength;
      refresh();
    } else if (deltaY !== 0 && scrollBars !== 'horizontal') {
      const pViewHeight = viewSize.height - scrollSize;
      const innerVLength = contentSize.height - pViewHeight;
      value.y =
        Math.max(Math.min(innerVLength * value.y + deltaY, innerVLength), 0) /
        innerVLength;
      refresh();
    }
  };

  /** handle onWheel with passive listener */
  useEffect(() => {
    containerRef.current &&
      containerRef.current.addEventListener('wheel', onWheelHandler, {
        passive: false,
      });
    return () => {
      containerRef.current &&
        containerRef.current.removeEventListener('wheel', onWheelHandler);
    };
  }, [containerRef.current]);

  const onHChange = (newValue: number) => {
    value.x = newValue;
    refresh();
  };

  const onVChange = (newValue: number) => {
    value.y = newValue;
    refresh();
  };

  return (
    <div ref={containerRef} css={css} className="scrollview">
      <div className="view">
        <div className="content">{viewSize.width > 0 ? children : null}</div>
      </div>
      {scrollBars !== 'vertical' ? (
        <ScrollBar
          direction="horizontal"
          enabled={isHScrollEnabled()}
          totalRange={contentSize.width}
          visibleRange={viewSize.width - scrollSize}
          value={value.x}
          thickness={scrollSize}
          onChange={onHChange}
        />
      ) : null}
      {scrollBars !== 'horizontal' ? (
        <ScrollBar
          direction="vertical"
          enabled={isVScrollEnabled()}
          totalRange={contentSize.height}
          visibleRange={viewSize.height - scrollSize}
          value={value.y}
          thickness={scrollSize}
          onChange={onVChange}
        />
      ) : null}
      {scrollBars === 'both' ? <div className="corner"></div> : null}
    </div>
  );
}
