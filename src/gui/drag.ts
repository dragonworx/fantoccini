import EventEmitter from "eventemitter3";

export class Dragger<T> extends EventEmitter {
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  startValue: T;

  onStartDrag = (e: MouseEvent) => {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;
      this.emit("dragmove", {
        dragger: this,
        deltaX,
        deltaY,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      this.emit("dragcomplete");
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const setStartValue = (value: T) => (this.startValue = value);
    this.emit("dragstart", setStartValue);
  };
}
