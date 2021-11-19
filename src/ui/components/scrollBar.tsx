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
        position: absolute;
        background-color: #666;
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
  const thumbRef = useRef<HTMLDivElement>(null);

  const [{ direction, value, onChange }, css] = init(
    props,
    defaultProps,
    style
  );

  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);

  const onDrag = (
    deltaX: number,
    deltaY: number,
    startX: number,
    startY: number
  ) => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (track && thumb) {
      let value: number = 0;
      const { innerLength } = getSizeInfo();
      let position: number = 0;
      if (direction === 'horizontal') {
        position = Math.min(Math.max(startX + deltaX, 0), innerLength);
        thumb.style.left = `${position}px`;
      } else {
        position = Math.min(Math.max(startY + deltaY, 0), innerLength);
        thumb.style.top = `${position}px`;
      }
      value = position / innerLength;
      onChange(value);
    }
  };

  const onThumbMouseDownHandler = useDrag(onDrag, thumbRef);

  const getSizeInfo = () => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    let trackLength: number = 0;
    let thumbLength: number = 0;
    let thumbPosition: number = 0;
    if (track && thumb) {
      const trackRect = track.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      trackLength =
        direction === 'horizontal' ? trackRect.width : trackRect.height;
      thumbLength =
        direction === 'horizontal' ? thumbRect.width : thumbRect.height;
      thumbPosition =
        direction === 'horizontal'
          ? parseFloat(thumb.style.left)
          : parseFloat(thumb.style.top);
    }
    const innerLength = trackLength - thumbLength;

    return { trackLength, thumbLength, innerLength, thumbPosition };
  };

  useEffect(() => {
    const thumb = thumbRef.current;
    if (thumb) {
      const { trackLength, thumbLength } = getSizeInfo();
      const thumbPosition = Math.min(
        Math.max(Math.round(trackLength * currentValue - thumbLength * 0.5), 0),
        trackLength - thumbLength
      );
      if (direction === 'horizontal') {
        thumb.style.left = `${thumbPosition}px`;
      } else {
        console.log({ trackLength, currentValue, thumbLength });
        thumb.style.top = `${thumbPosition}px`;
      }
      thumb.style.visibility = 'visible';
    }
  });

  // TODO: replace thumb with pushbutton, add two pushbuttons before and after thumb for paging buttons
  // move long press functionality from NumericInput into own hook

  return (
    <div ref={containerRef} css={css} className="scrollbar">
      <div ref={trackRef} className="track">
        <div
          ref={thumbRef}
          className="thumb"
          onMouseDown={onThumbMouseDownHandler}
        ></div>
      </div>
    </div>
  );
}
