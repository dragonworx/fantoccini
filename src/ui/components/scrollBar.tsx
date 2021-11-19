/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  useRef,
  useState,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { reset, buttonBg, borderRadius } from './theme';
import { init } from '../util';
import { useDrag } from '../hooks';

export type Direction = 'horizontal' | 'vertical';

export const minSize = 200;
export const minThumbLength = 5;

export interface Props {
  direction?: Direction;
  thickness?: number;
  outerSize: number;
  innerSize: number;
  value: number;
  pageSize?: number;
  onChange?: (value: number) => void;
}

export const defaultProps: Props = {
  direction: 'horizontal',
  thickness: 15,
  outerSize: 1,
  innerSize: 1,
  value: 0,
  pageSize: 0.1,
};

export const style = ({ direction, thickness: size }: Props) => {
  return css`
    ${reset}
    ${buttonBg(true, true, direction === 'horizontal' ? 180 : 90)}
    position: relative;
    width: ${direction === 'horizontal' ? '100%' : `${size}px`};
    height: ${direction === 'horizontal' ? `${size}px` : '100%'};
    min-width: ${direction === 'horizontal' ? `${minSize}px` : `${size}px`};
    min-height: ${direction === 'horizontal' ? `${size}px` : `${minSize}px`};

    .track {
      position: absolute;
      width: 100%;
      height: 100%;

      .thumb {
        ${borderRadius}
        position: absolute;
        background-color: rgba(255, 255, 255, 0.3);
        top: 0;
        width: 0;
        height: 0;
      }
    }
  `;
};

export function ScrollBar(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [{ direction, value, pageSize, innerSize, outerSize, onChange }, css] =
    init(props, defaultProps, style);

  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => setCurrentValue(value), [value]);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (thumb) {
      const { thumbLength, thumbPosition } = getSizeInfo();
      if (direction === 'horizontal') {
        thumb.style.left = `${thumbPosition}px`;
      } else if (direction === 'vertical') {
        thumb.style.top = `${thumbPosition}px`;
      }
      thumb.style.width =
        direction === 'horizontal' ? `${thumbLength}px` : '100%';
      thumb.style.height =
        direction === 'horizontal' ? '100%' : `${thumbLength}px`;
    }
  }, [thumbRef.current, currentValue]);

  const onThumbMouseDownHandler = useDrag(
    (deltaX: number, deltaY: number, startX: number, startY: number) => {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (track && thumb) {
        let value: number = 0;
        const { innerLength, thumbLength, trackLength } = getSizeInfo();
        let position: number = 0;
        if (direction === 'horizontal') {
          position = Math.min(
            Math.max(startX + deltaX, 0),
            trackLength - thumbLength
          );
          thumb.style.left = `${position}px`;
        } else {
          position = Math.min(
            Math.max(startY + deltaY, 0),
            trackLength - thumbLength
          );
          thumb.style.top = `${position}px`;
        }
        value = position / innerLength;
        onChange(value);
      }
    },
    thumbRef
  );

  const getSizeInfo = () => {
    const track = trackRef.current!;
    const thumb = thumbRef.current!;
    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const trackLength =
      direction === 'horizontal' ? trackRect.width : trackRect.height;
    const thumbRatio = innerSize / outerSize;
    const innerLength = trackLength * thumbRatio;
    const thumbPosition = innerLength * currentValue;
    const thumbLength = trackLength * thumbRatio;

    return {
      trackRect,
      thumbRect,
      trackLength,
      thumbRatio,
      innerLength,
      thumbLength,
      thumbPosition,
    };
  };

  const onTrackMouseDown = (e: ReactMouseEvent) => {
    const { trackRect, thumbRect } = getSizeInfo();
    const x = e.clientX - trackRect.left;
    const y = e.clientY - trackRect.top;
    if (direction === 'horizontal') {
      if (x < thumbRect.left - trackRect.left) {
        const val = Math.min(currentValue - pageSize, 1);
        setCurrentValue(val);
      } else {
        const val = Math.max(currentValue + pageSize, 0);
        setCurrentValue(val);
      }
    } else if (direction === 'vertical') {
      if (y < thumbRect.top - trackRect.top) {
        setCurrentValue(Math.max(currentValue - pageSize, 0));
      } else {
        setCurrentValue(Math.min(currentValue + pageSize, 1));
      }
    }
  };

  return (
    <div ref={containerRef} css={css} className="scrollbar">
      <div ref={trackRef} className="track" onMouseDown={onTrackMouseDown}>
        <div
          ref={thumbRef}
          className="thumb"
          onMouseDown={onThumbMouseDownHandler}
        ></div>
      </div>
    </div>
  );
}
