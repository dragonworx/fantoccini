type Listener<T> = (T) => void;

export class EventSource<T> {
  private listeners: Listener<T>[];

  constructor () {
    this.listeners = [];
  }

  addListener (target: Listener<T>): EventSource<T> {
    this.listeners.push(target);
    return this;
  }

  removeListener (target: Listener<T>): EventSource<T> {
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
      target(event);
    }
    return this;
  }
}