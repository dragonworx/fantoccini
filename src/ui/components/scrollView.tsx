/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode, useRef, useState, useEffect, MouseEvent } from 'react';
import { reset } from './theme';
import { ScrollBar } from './scrollBar';
import { getProps } from '../util';

export const scrollSize = 25;

export interface Props {
  children?: ReactNode;
  viewWidth?: number;
  viewHeight?: number;
}

export const defaultProps: Props = {
  viewWidth: 100,
  viewHeight: 100,
};

export const style =
  (viewWidth: number, viewHeight: number) =>
  ({}: Props) => {
    console.log('style!', viewWidth, viewHeight);
    return css`
      ${reset}
      width: ${`${viewWidth + scrollSize}px`};
      height: ${`${viewHeight + scrollSize}px`};
      position: relative;
      outline: 1px solid red;
      overflow: hidden;

      .scroll-content {
        position: relative;
        width: ${`${viewWidth}px`};
        height: ${`${viewHeight}px`};
        outline: 1px solid cyan;
      }

      .scrollbar.horizontal {
        position: absolute;
        bottom: ${-scrollSize}px;
        left: 0;
        right: ${scrollSize}px;
      }
    `;
  };

export function ScrollView(props: Props) {
  const allProps = getProps(props, defaultProps);
  const {
    children,
    viewWidth: defaultViewWidth,
    viewHeight: defaultViewHeight,
  } = allProps;

  const [viewWidth, setViewWidth] = useState(defaultViewWidth);
  const [viewHeight, setViewHeight] = useState(defaultViewHeight);
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setViewWidth(defaultViewWidth);
    setViewHeight(defaultViewHeight);
  }, [defaultViewWidth, defaultViewHeight]);

  const css = style(viewWidth, viewHeight)(allProps);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const content = container.querySelector('.scroll-content *')!;
      debugger;
      const contentRect = content.getBoundingClientRect();
      if (contentWidth === 0 || contentHeight === 0) {
        console.log('calc!', contentRect.width, contentRect.height);
        setContentWidth(contentRect.width);
        setContentHeight(contentRect.height);
      }
    }
  }, [ref.current, children]);

  return (
    <div ref={ref} css={css} className="scrollview">
      <div className="scroll-content">
        {children}
        <ScrollBar
          direction="horizontal"
          totalRange={contentWidth}
          visibleRange={viewWidth}
          value={0}
          thickness={scrollSize}
        />
      </div>
    </div>
  );
}
