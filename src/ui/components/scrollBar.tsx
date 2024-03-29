/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  useRef,
  useState,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { reset, buttonBg } from './theme';
import { init } from '../util';
import { useDrag, useLongPressWithDelta } from '../hooks';

export type Direction = 'horizontal' | 'vertical';

export interface Props {
  enabled?: boolean;
  direction?: Direction;
  thickness?: number;
  totalRange: number;
  visibleRange: number;
  value: number;
  pageSize?: number;
  length?: number;
  onChange?: (value: number) => void;
}

export const defaultProps: Props = {
  enabled: true,
  direction: 'horizontal',
  thickness: 15,
  length: 15,
  totalRange: 1,
  visibleRange: 1,
  value: 0,
  pageSize: 0.1,
};

export const style = ({ enabled, direction, thickness, length }: Props) => {
  const angle = direction === 'horizontal' ? 180 : 90;

  return css`
    ${reset}
    ${buttonBg(enabled, true, angle)}
    position: relative;
    width: ${direction === 'horizontal' ? '100%' : `${thickness}px`};
    height: ${direction === 'horizontal' ? `${thickness}px` : '100%'};
    min-width: ${direction === 'horizontal' ? `${length}px` : `${thickness}px`};
    min-height: ${direction === 'horizontal'
      ? `${thickness}px`
      : `${length}px`};

    .track {
      position: absolute;
      width: 100%;
      height: 100%;

      .thumb {
        border-radius: 2px;
        position: absolute;
        ${buttonBg(enabled, false, 0, enabled ? '#555' : '#424652')}
        top: 0;
        width: 0;
        height: 0;
        border: ${enabled ? `1px outset #6e6e6e` : `1px outset #555555`};

        &:hover {
          ${enabled ? buttonBg(enabled, false, 0, '#616161') : ''}
        }

        &:active {
          ${enabled ? buttonBg(enabled, true, 180, '#666') : ''}
        }
      }
    }
  `;
};

export function ScrollBar(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [
    {
      enabled,
      direction,
      value,
      pageSize,
      visibleRange,
      totalRange,
      thickness,
      onChange,
    },
    css,
  ] = init(props, defaultProps, style);

  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => setCurrentValue(value), [value]);

  const getSizeInfo = () => {
    const track = trackRef.current!;
    const thumb = thumbRef.current!;
    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const trackLength =
      direction === 'horizontal' ? trackRect.width : trackRect.height;
    const thumbRatio = visibleRange / totalRange;
    const thumbLength = Math.min(
      Math.max(trackLength * thumbRatio, thickness),
      trackLength
    );
    const innerLength = trackLength - thumbLength;
    const thumbPosition = innerLength * currentValue;

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
        direction === 'vertical' ? `${thumbLength}px` : '100%';
    }
  }, [thumbRef.current, currentValue, totalRange, visibleRange]);

  const onThumbMouseDownHandler = useDrag(
    (deltaX: number, deltaY: number, startX: number, startY: number) => {
      if (!enabled) {
        return;
      }
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
        setCurrentValue(value);
        onChange && onChange(value);
      }
    },
    thumbRef
  );

  const onTrackMouseDown = (
    e: ReactMouseEvent,
    currentValue: number,
    previousDelta: number
  ): [number, number] => {
    if (!enabled) {
      return [0, 0];
    }
    const { thumbRect } = getSizeInfo();
    const x = e.clientX;
    const y = e.clientY;
    let value: number = currentValue;
    if (direction === 'horizontal') {
      if (x < thumbRect.left) {
        value = Math.max(currentValue - pageSize, 0);
      } else if (x > thumbRect.right) {
        value = Math.min(currentValue + pageSize, 1);
      }
    } else if (direction === 'vertical') {
      if (y < thumbRect.top) {
        value = Math.max(currentValue - pageSize, 0);
      } else if (y > thumbRect.bottom) {
        value = Math.min(currentValue + pageSize, 1);
      }
    }
    let delta = currentValue - value;
    if (
      delta === 0 ||
      (delta < 0 && previousDelta > 0) ||
      (delta > 0 && previousDelta < 0)
    ) {
      value = currentValue;
      delta = previousDelta;
    } else {
      setCurrentValue(value);
      onChange && onChange(value);
    }
    return [value, delta];
  };

  const onTrackMouseDownHandler = useLongPressWithDelta(
    onTrackMouseDown,
    currentValue
  );

  return (
    <div ref={containerRef} css={css} className={`scrollbar ${direction}`}>
      <div
        ref={trackRef}
        className="track"
        onMouseDown={onTrackMouseDownHandler}
      >
        {enabled ? (
          <div
            ref={thumbRef}
            className="thumb"
            onMouseDown={onThumbMouseDownHandler}
          ></div>
        ) : null}
      </div>
    </div>
  );
}
