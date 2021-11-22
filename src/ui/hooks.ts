import {
  Dispatch,
  MouseEvent as ReactMouseEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

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

export function useLongPressWithScaling(
  onIncrement: (e: ReactMouseEvent, value: number) => void,
  initialIncrementMinor: number,
  initialIncrementMajor: number = initialIncrementMinor
) {
  const onMouseDown = (e: ReactMouseEvent) => {
    const onMouseUpHandler = () => {
      window.removeEventListener('mouseup', onMouseUpHandler);
      clearTimeout(timeout);
      clearInterval(interval);
    };

    window.addEventListener('mouseup', onMouseUpHandler);

    let value = e.shiftKey ? initialIncrementMajor : initialIncrementMinor;

    onIncrement(e, value);

    let interval: number;
    let delay = longPressInitialInterval;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        delay = Math.max(0, delay * longPressIntervalFactor);
        value = value * longPressIncrementFactor;
        onIncrement(e, value);
      }, Math.round(delay));
    }, longPressInitialDelay);
  };

  return onMouseDown;
}

export function useLongPressWithDelta(
  onIncrement: (
    e: ReactMouseEvent,
    currentValue: number,
    delta: number
  ) => [number, number],
  currentValue: number
) {
  const onMouseDown = (e: ReactMouseEvent) => {
    const onMouseUpHandler = () => {
      window.removeEventListener('mouseup', onMouseUpHandler);
      clearTimeout(timeout);
      clearInterval(interval);
    };

    window.addEventListener('mouseup', onMouseUpHandler);

    let value = currentValue;
    let delta = 0;

    onIncrement(e, value, delta);

    let interval: number;
    let delay = longPressInitialInterval;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        delay = Math.max(0, delay * longPressIntervalFactor);
        [value, delta] = onIncrement(e, value, delta);
      }, Math.round(delay));
    }, longPressInitialDelay);
  };

  return onMouseDown;
}

export function useProp<T>(prop: T): [T, Dispatch<SetStateAction<T>>] {
  const [getter, setter] = useState(prop);
  useEffect(() => setter(prop), [prop]);
  return [getter, setter];
}

export function forceUpdate() {
  const [_, refresher] = useState(0);
  return () => refresher(Date.now() + Math.random());
}
