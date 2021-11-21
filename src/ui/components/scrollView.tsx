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

export const scrollSize = 25;

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
  (contentWidth: number, contentHeight: number) =>
  ({ viewWidth, viewHeight }: Props) => {
    return css`
      ${reset}
      position: relative;
      /* outline: 1px solid red; */
      overflow: hidden;
      width: ${viewWidth + scrollSize}px;
      height: ${viewHeight + scrollSize}px;

      .scroll-view {
        position: relative;
        width: ${`${viewWidth}px`};
        height: ${`${viewHeight}px`};
        outline: 1px solid cyan;
        overflow: hidden;

        .scroll-content {
          width: ${`${contentWidth}px`};
          height: ${`${contentHeight}px`};
          outline: 1px solid blue;
          position: relative;
        }
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
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const { children, viewWidth, viewHeight } = allProps;

  const css = style(contentSize.width, contentSize.height)(allProps);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && contentSize.width === 0) {
      const element = ref.current.querySelector(
        '.scroll-content *'
      ) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        const size = { width: element.offsetWidth, height: rect.height };
        setContentSize(size);
        console.log('size!', size);
      }
    }
  });

  return (
    <div ref={ref} css={css} className="scrollview">
      <div className="scroll-view">
        <div className="scroll-content">{children}</div>
      </div>
      <ScrollBar
        direction="vertical"
        totalRange={contentSize.height}
        visibleRange={viewHeight}
        value={0}
        thickness={scrollSize}
      />
      <ScrollBar
        direction="horizontal"
        totalRange={contentSize.width}
        visibleRange={viewWidth}
        value={0}
        thickness={scrollSize}
      />
    </div>
  );
}
