import { Keyframe } from './index';
import { DynamicProperty } from '../property';

export class Channel<T> {
  private property: DynamicProperty<T>;
  private keyframes: Keyframe<T>[];

  constructor (property: DynamicProperty<T>) {
    this.property = property;
    this.keyframes = [];
  }

  addKeyframe (timeMs: number, value: T) {
    const keyframe = new Keyframe<T>(timeMs, value);
    const { keyframes } = this;
    keyframes.push(keyframe);
    keyframe.linkPrev(keyframes[keyframes.length - 2]);
  }

  valueAtMs (timeMs: number): T {
    const { keyframes } = this;
    const l = keyframes.length;
    for (let i = l - 1; i >= 0; i--) {
      const keyframe = keyframes[i];
      if (keyframe.timeMs <= timeMs) {
        return keyframe.value;
      }
    }
  }
}