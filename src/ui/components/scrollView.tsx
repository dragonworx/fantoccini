/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  MouseEvent,
} from 'react';
import { reset } from './theme';
import { ScrollBar } from './scrollBar';
import { getProps } from '../util';
import { useProp } from '../hooks';

export const scrollSize = 20;

export interface Props {
  children?: ReactNode;
  viewWidth: number;
  viewHeight: number;
}

export const defaultProps: Props = {
  viewWidth: 0,
  viewHeight: 0,
};

export const style =
  (
    contentWidth: number,
    contentHeight: number,
    originX: number,
    originY: number
  ) =>
  ({ viewWidth, viewHeight }: Props) => {
    return css`
      ${reset}
      position: relative;
      /* outline: 1px solid red; */
      overflow: hidden;
      width: ${viewWidth + scrollSize}px;
      height: ${viewHeight + scrollSize}px;

      .view {
        position: relative;
        width: ${`${viewWidth}px`};
        height: ${`${viewHeight}px`};
        /* outline: 1px solid cyan; */
        overflow: hidden;

        .content {
          width: ${`${contentWidth}px`};
          height: ${`${contentHeight}px`};
          /* outline: 1px solid blue; */
          position: relative;
          left: ${originX}px;
          top: ${originY}px;
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
  const { children, viewWidth, viewHeight } = allProps;

  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [originX, setOriginX] = useProp(0);
  const [originY, setOriginY] = useProp(0);

  const css = style(
    contentSize.width,
    contentSize.height,
    originX,
    originY
  )(allProps);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && contentSize.width === 0) {
      const element = ref.current.querySelector('.content *') as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        const size = { width: element.offsetWidth, height: rect.height };
        setContentSize(size);
      }
    }
  });

  const onVScrollBarChange = (value: number) => {
    setOriginY((contentSize.height - viewHeight) * value * -1);
  };

  const onHScrollBarChange = (value: number) => {
    setOriginX((contentSize.width - viewWidth) * value * -1);
  };

  const onWheelHandler = (e: WheelEvent) => {
    console.log('!wheel');
    e.preventDefault();
  };

  useEffect(() => {
    console.log('bind');
    ref.current &&
      ref.current.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => {
      console.log('unbind');
      ref.current && ref.current.removeEventListener('wheel', onWheelHandler);
    };
  }, [ref.current]);

  return (
    <div ref={ref} css={css} className="scrollview">
      <div className="view">
        <div className="content">{children}</div>
      </div>
      <ScrollBar
        direction="vertical"
        totalRange={contentSize.height}
        visibleRange={viewHeight}
        value={0}
        thickness={scrollSize}
        onChange={onVScrollBarChange}
      />
      <ScrollBar
        direction="horizontal"
        totalRange={contentSize.width}
        visibleRange={viewWidth}
        value={0}
        thickness={scrollSize}
        onChange={onHScrollBarChange}
      />
      <div className="corner"></div>
    </div>
  );
}
