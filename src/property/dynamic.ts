import { Channel, Timeline } from '../timeline';

export abstract class DynamicProperty<T> {
  private key: string;
  private defaultValue: T;
  private forcedValue: T;
  private timeline: Timeline;
  public channel: Channel<T>;

  constructor (key: string, defaultValue: T, timeline: Timeline) {
    this.key = key;
    this.defaultValue = defaultValue;
    this.forcedValue = undefined;
    this.timeline = timeline;
    this.channel = new Channel<T>(this);
    timeline.addChannel<T>(this.channel);
  }

  get value (): T  {
    if (!this.timeline) {
      throw new Error('Dynamic properties require timelines. Set the properties timeline then try again.')
    } else {
      if (typeof this.forcedValue !== 'undefined') {
        return this.forcedValue;
      }
      const timeMs = this.timeline.timeMs;
      return this.channel.isEmpty || !this.channel.hasKeyframeForTime(timeMs)
        ? this.defaultValue
        : this.channel.valueAtMs(timeMs);
    }
  }

  set value (value: T) {
    this.forcedValue = value;
  }
}