/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  ReactNode,
  useRef,
  useState,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { reset } from './theme';
import { init } from '../util';

export type Direction = 'horizontal' | 'vertical';

export interface Props {
  direction?: Direction;
  thickness?: number;
  outerSize: number;
  innerSize: number;
  value: number;
  onChange?: (value: number) => void;
}

export const defaultProps: Props = {
  direction: 'horizontal',
  thickness: 20,
  outerSize: 1,
  innerSize: 1,
  value: 0,
};

export const style = ({
  direction,
  thickness: size,
  outerSize,
  innerSize,
  value: offset,
}: Props) => {
  const thumbSize = (innerSize / outerSize) * 100;
  return css`
    ${reset}
    background-color: #333;
    position: relative;
    width: ${direction === 'horizontal' ? '100%' : `${size}px`};
    height: ${direction === 'horizontal' ? `${size}px` : '100%'};

    .track {
      position: relative;
      width: 100%;
      height: 100%;

      .thumb {
        position: absolute;
        background-color: #666;
        border: 1px solid red;
        top: 0;
        width: ${direction === 'horizontal' ? `${thumbSize}%` : '100%'};
        height: ${direction === 'horizontal' ? '100%' : `${thumbSize}px`};
        visibility: hidden;
      }
    }
  `;
};

export function ScrollBar(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [{ direction, value, onChange }, css] = init(
    props,
    defaultProps,
    style
  );

  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (dragStart) {
      window.addEventListener('mousemove', onMouseMove);
    }
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const thumb = track.querySelector('.thumb') as HTMLElement;
    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const trackLength =
      direction === 'horizontal' ? trackRect.width : trackRect.height;
    const thumbLength =
      direction === 'horizontal' ? thumbRect.width : thumbRect.height;
    const thumbOffset = Math.min(
      Math.max(Math.round(trackLength * currentValue - thumbLength * 0.5), 0),
      trackLength - thumbLength
    );
    track.style.left = `${thumbOffset}px`;
    thumb.style.visibility = 'visible';
  });

  const onThumbMouseDownHandler = (e: ReactMouseEvent) => {
    window.addEventListener('mouseup', onMouseUp);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onMouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragStart) {
      const x = e.clientX - dragStart.x;
      const y = e.clientY - dragStart.y;
      console.log(x, y);
    }
  };

  return (
    <div css={css} className="scrollbar" ref={containerRef}>
      <div className="track" ref={trackRef}>
        <div className="thumb" onMouseDown={onThumbMouseDownHandler}></div>
      </div>
    </div>
  );
}
