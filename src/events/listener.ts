import { EventSource } from './source';

export interface EventListener<T> {
  receiveEvent (event: T): void;
}