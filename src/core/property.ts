export class Property<T> {
  defaultValue: T;
  data: Map<number, T>;
  frameOffset: number;

  constructor(defaultValue: T) {
    this.defaultValue = defaultValue;
    this.data = new Map();
    this.frameOffset = 0;
  }

  get isEmpty() {
    return this.data.size === 0;
  }

  get(frameIndex: number = 0): T {
    if (frameIndex === 0) {
      return this.defaultValue;
    }
    const value = this.data.get(frameIndex);
    if (value !== undefined) {
      return value;
    } else {
      const index = this.getFrame(frameIndex);
      return index === 0 ? this.defaultValue : this.data.get(index)!;
    }
  }

  getFrame(frameIndex: number): number {
    if (this.data.has(frameIndex)) {
      return frameIndex;
    }
    for (let index = frameIndex - 1; index > 0; index--) {
      if (this.data.has(index)) {
        return index;
      }
    }
    return 0;
  }

  set(frameIndex: number, value: T): Property<T> {
    this.data.set(frameIndex, value);
    return this;
  }
}
