import { EventListener } from './listener';

export class EventSource<T> {
  private listeners: EventListener<T>[];

  constructor () {
    this.listeners = [];
  }

  addListener (target: any): EventSource<T> {
    this.listeners.push(target);
    return this;
  }

  removeListener (target: any): EventSource<T> {
    const index = this.listeners.indexOf(target);
    if (index) {
      this.listeners.splice(index, 1);
    }
    return this;
  }

  emit (event: T): EventSource<T> {
    const { listeners } = this;
    const l = listeners.length;
    for (let i = 0; i < l; i++) {
      const target = listeners[i];
      target.receiveEvent(event);
    }
    return this;
  }
}