import { Channel, Timeline } from '../timeline';
import { DynamicPropertyTarget } from './target';

export abstract class DynamicProperty<T> {
  private target: DynamicPropertyTarget;
  private key: string;
  private defaultValue: T;
  private forcedValue: T;
  private timeline: Timeline;
  public channel: Channel<T>;

  constructor (target: any, key: string, defaultValue: T, timeline: Timeline) {
    this.target = target;
    this.key = key;
    this.defaultValue = defaultValue;
    this.forcedValue = undefined;
    this.timeline = timeline;
    this.channel = new Channel<T>(this);
  }

  get value (): T  {
    if (!this.timeline) {
      throw new Error('Dynamic properties require timelines. Set the properties timeline then try again.')
    } else {
      if (typeof this.forcedValue !== 'undefined') {
        return this.forcedValue;
      }
      const timeMs = this.timeline.elapsedTime;
      return this.channel.isEmpty || !this.channel.hasKeyframeForTime(timeMs)
        ? this.defaultValue
        : this.channel.valueAtMs(timeMs);
    }
  }

  set value (value: T) {
    const oldValue = this.value;
    this.forcedValue = value;
    this.target.onChange(this.key, value, oldValue);
  }
}