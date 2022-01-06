export function drag(
  onDragMove: (deltaX: number, deltaY: number) => void,
  onDragDone: () => void
) {
  let dragInfo: {
    isDragging: boolean;
    startX: number;
    startY: number;
  } = { isDragging: false, startX: 0, startY: 0 };

  const onStartDrag = (e: MouseEvent) => {
    dragInfo.isDragging = true;
    dragInfo.startX = e.clientX;
    dragInfo.startY = e.clientY;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragInfo.startX;
      const deltaY = e.clientY - dragInfo.startY;
      onDragMove(deltaX, deltaY);
    };

    const onMouseUp = () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      onDragDone();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return {
    onStartDrag,
  };
}
