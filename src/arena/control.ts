import EventEmitter from 'eventemitter3';

import { element, findStyleSheet } from './util';

export type MountEvents = 'mount' | 'unmount';
export type MouseEvents = 'mousedown';
export type BaseEvents = MountEvents | MouseEvents;
export type Handler = (...args: any[]) => any;

export abstract class Control<
  Props,
  RootElement extends HTMLElement,
  Events extends BaseEvents = BaseEvents
> {
  protected element: RootElement;
  protected notifier: EventEmitter;
  protected className: string;
  protected styleSheet: CSSStyleSheet | null;

  constructor(protected readonly props: Props) {
    this.notifier = new EventEmitter();
    const { html, style: className } = this.render();
    this.element = element<RootElement>(html);
    this.className = className;
    this.element.className = className;
    this.styleSheet = findStyleSheet(className);
    this.bindEvents();
  }

  protected abstract render(): { html: string; style: string };

  protected get cssStyleDeclaration() {
    const sheet = this.styleSheet;
    if (sheet) {
      const rule = sheet.cssRules.item(0);
      if (rule instanceof CSSStyleRule) {
        return rule.style;
      }
    }
    return null;
  }

  protected bindEvents() {
    this.bindEvent('mousedown', 'onMouseDown');
    this.bindEvent('mouseup', 'onMouseUp');
    this.bindEvent('mousedown', 'onMouseDown');
    this.bindEvent('mousedown', 'onMouseDown');
  }

  protected bindEvent(eventName: string, selfHandlerKey: string) {
    this.element.addEventListener(eventName, (e) => {
      ((this as any)[selfHandlerKey] as any)(e);
      this.notifier.emit(eventName, e);
    });
  }

  protected onMount(element: HTMLElement) {}
  protected onUnMount() {}
  protected onMouseDown(e: MouseEvent) {}

  on(eventName: Events, handler: Handler) {
    this.notifier.on(eventName, handler);
    return this;
  }

  off(eventName: Events, handler: Handler) {
    this.notifier.off(eventName, handler);
    return this;
  }

  append(control: Control<any, any, any>) {
    this.element.appendChild(control.element);
  }

  set<T>(key: keyof Props, value: Props[keyof Props]) {
    this.props[key] = value;
    const { cssStyleDeclaration } = this;
    const cssKey = String(key);
    if (
      cssStyleDeclaration &&
      cssStyleDeclaration.getPropertyValue(cssKey) !== ''
    ) {
      cssStyleDeclaration.setProperty(cssKey, String(value));
    }
    return this;
  }

  mount(element: HTMLElement | null) {
    if (element) {
      element.appendChild(this.element);
      this.onMount(element);
      this.notifier.emit('mount', element);
    } else {
      throw new Error('Cannot mount to null element');
    }
  }

  unmount() {
    const element = this.element;
    if (element.parentElement !== null) {
      element.parentElement.removeChild(element);
      if (this.styleSheet) {
        const styleElement = this.styleSheet.ownerNode!;
        document.head.removeChild(styleElement);
      }
      this.onUnMount();
      this.notifier.emit('unmount');
    } else {
      throw new Error('Cannot unmount from null parent');
    }
  }
}
