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
    const { keyframes } = this;
    if (keyframes.length > 0) {
      if (timeMs < keyframes[keyframes.length - 1].timeMs) {
        throw new Error('Keyframes must be in time order, cannot add keyframe with time before last keyframe');
      }
    }
    const keyframe = new Keyframe<T>(timeMs, value);
    keyframes.push(keyframe);
    if (keyframes.length > 1) {
      keyframe.linkPrev(keyframes[keyframes.length - 2]);
    }
  }
  
  valueAtMs (timeMs: number): T {
    const keyframe = this.getKeyframeForTime(timeMs);
    if (keyframe) {
      return keyframe.value;
    }
  }

  getKeyframeForTime (timeMs: number): Keyframe<T> {
    const { keyframes } = this;
    const l = keyframes.length;
    for (let i = 0; i < l; i++) {
      const keyframe = keyframes[i];
      if (keyframe.isLast) {
        return keyframe;
      } else if (timeMs >= keyframe.timeMs && timeMs < keyframe.nextKeyframe.timeMs) {
        return keyframe;
      }
    }
  }

  get isEmpty () {
    return !this.keyframes.length;
  }

  hasKeyframeForTime (timeMs: number): boolean {
    return this.keyframes[0].timeMs <= timeMs;
  }
}