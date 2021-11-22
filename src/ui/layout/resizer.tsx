/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { ReactElement, useEffect, useRef } from 'react';
import { forceUpdate } from '../hooks';

export interface HasExplicitSize {
  width: number;
  height: number;
}

export interface Props {
  children: ReactElement<HasExplicitSize>;
}

export const style = () => css`
  box-sizing: border-box;
  outline: 1px solid cyan;
  width: 100%;
  height: 100%;
`;

export function Resizer({ children }: Props) {
  const css = style();
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const size = sizeRef.current;
  const refresh = forceUpdate();

  useEffect(() => {
    const current = ref.current;
    if (current) {
      const onResize = (entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => console.log('target!', entry));
        size.width = current.offsetWidth;
        size.height = current.offsetHeight;
        console.log(size);
        // refresh();
      };
      const observer = new ResizeObserver(onResize);
      observer.observe(current);
      return () => {
        observer.disconnect();
      };
    }
  }, [ref.current]);

  return (
    <div ref={ref} css={css} className="resizer">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const props =
            size.width !== 0 ? { width: size.width, height: size.height } : {};
          console.log(props);
          return React.cloneElement(child, props);
        }
        return child;
      })}
    </div>
  );
}
