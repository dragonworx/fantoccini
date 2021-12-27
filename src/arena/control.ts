import EventEmitter from 'eventemitter3';
import { element } from './util';

export type MountEvents = 'mount' | 'unmount';
export type MouseEvents = 'mousedown';
export type BaseEvents = MountEvents | MouseEvents;
export type Handler = (...args: any[]) => any;

export abstract class Control<
  Props,
  RootElement extends HTMLElement,
  Events extends BaseEvents
> {
  protected element: RootElement;
  protected notifier: EventEmitter;
  protected className: string;
  protected styleSheet: CSSStyleSheet | null;

  constructor(protected readonly props: Props) {
    this.notifier = new EventEmitter();
    this.element = element<RootElement>(this.html());
    this.className = this.style();
    this.element.className = this.className;
    this.styleSheet = this.findStyleSheet();
    this.bindEvents();
    this.element.setAttribute('data-control-base', '');
    this.controlType().forEach((controlType) =>
      this.element.setAttribute(`data-control-${controlType}`, '')
    );
  }

  protected abstract html(): string;
  protected abstract style(): string;
  protected abstract controlType(): string[];

  on(eventName: Events, handler: Handler) {
    this.notifier.on(eventName, handler);
    return this;
  }

  protected bindEvent(eventName: string, selfHandlerKey: string) {
    this.element.addEventListener(eventName, (e) => {
      ((this as any)[selfHandlerKey] as any)(e);
      this.notifier.emit(eventName, e);
    });
  }

  protected bindEvents() {
    this.bindEvent('mousedown', 'onMouseDown');
  }

  protected onMount(element: HTMLElement) {}
  protected onMouseDown(e: MouseEvent) {}

  append(control: Control<any, any, any>) {
    this.element.appendChild(control.element);
  }

  set<T>(key: keyof Props, value: Props[keyof Props]) {
    this.props[key] = value;
    this.updateStyles(key as string, value);
  }

  findStyleSheet() {
    //document.head.querySelectorAll('[data-emotion]')[0].sheet.cssRules[0].selectorText
    //document.head.querySelectorAll('[data-emotion]')[0].sheet.cssRules[0].style.backgroundColor
    const nodes = document.head.querySelectorAll('[data-emotion]');
    for (let i = 0; i < nodes.length; i++) {
      const sheet = (nodes[i] as HTMLStyleElement).sheet;
      const rule = sheet?.cssRules[0];
      if (!(rule instanceof CSSStyleRule)) {
        continue;
      }
      if (rule.selectorText === `.${this.className}`) {
        return sheet;
      }
    }
    return null;
  }

  protected updateStyles(key: string, value: any) {}

  updateStyle(key: string, value: string) {
    const sheet = this.styleSheet;
    if (sheet) {
      const dec = (sheet.cssRules[0] as CSSStyleRule).style;
      (dec as any)[key] = value;
    }
  }

  install(element: HTMLElement) {
    element.appendChild(this.element);
    this.onMount(element);
    this.notifier.emit('mount', element);
  }
}
