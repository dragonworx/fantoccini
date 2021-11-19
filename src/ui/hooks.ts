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
  };

  return onMouseDown;
}
