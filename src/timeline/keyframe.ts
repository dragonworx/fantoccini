export class Keyframe<T> {
  public timeMs: number;
  public value: T;
  public nextKeyframe: Keyframe<T>;
  public prevKeyframe: Keyframe<T>;

  constructor (timeMs: number, value: T) {
    this.timeMs = timeMs;
    this.value = value;
  }

  linkPrev (prevKeyframe: Keyframe<T>) {
    this.prevKeyframe = prevKeyframe;
    this.prevKeyframe.nextKeyframe = this;
  }
}