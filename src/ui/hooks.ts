import { MouseEvent as ReactMouseEvent, RefObject } from 'react';

export type onDragHandler = (
  xDelta: number,
  yDelta: number,
  startX: number,
  startY: number
) => void;

export function useDrag(onDrag: onDragHandler, ref: RefObject<HTMLElement>) {
  const onMouseDown = (e: ReactMouseEvent) => {
    let dragStartX = e.clientX;
    let dragStartY = e.clientY;
    const startX = ref.current ? parseFloat(ref.current.style.left) : 0;
    const startY = ref.current ? parseFloat(ref.current.style.top) : 0;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX - dragStartX;
      const y = e.clientY - dragStartY;
      onDrag(x, y, startX, startY);
    };

    const onMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    e.stopPropagation();
  };

  return onMouseDown;
}

export const longPressInitialDelay = 250;
export const longPressInitialInterval = 150;
export const longPressIntervalFactor = 0.9;
export const longPressIncrementFactor = 1.1;

export function useLongPress(
  initialIncrementMinor: number,
  initialIncrementMajor: number,
  onIncrement: (value: number) => void
) {
  const onMouseDown = (e: ReactMouseEvent) => {
    const onMouseUpHandler = () => {
      window.removeEventListener('mouseup', onMouseUpHandler);
      clearTimeout(timeout);
      clearInterval(interval);
    };

    window.addEventListener('mouseup', onMouseUpHandler);

    let value = e.shiftKey ? initialIncrementMajor : initialIncrementMinor;

    onIncrement(value);

    let interval: number;
    let delay = longPressInitialInterval;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        delay = Math.max(0, delay * longPressIntervalFactor);
        value = value * longPressIncrementFactor;
        onIncrement(value);
      }, Math.round(delay));
    }, longPressInitialDelay);
  };

  return onMouseDown;
}
