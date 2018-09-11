import { Channel, Timeline } from '../timeline';

export abstract class DynamicProperty<T> {
  private target: any;
  private key: string;
  private defaultValue: T;
  private timeline: Timeline;
  private channel: Channel<T>;

  constructor (target: any, key: string, defaultValue: T) {
    this.target = target;
    this.key = key;
    this.defaultValue = defaultValue;
    this.timeline = null;
    this.channel = new Channel<T>(this);
  }

  get value (): T  {
    if (!this.timeline) {
      throw new Error('Dynamic properties require timelines. Set the properties timeline then try again.')
    } else {
      return this.channel.valueAtMs(this.timeline.elapsedMs);
    }
  }
}