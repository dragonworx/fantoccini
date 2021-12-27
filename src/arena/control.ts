import EventEmitter from 'eventemitter3';
import { element, findStyleSheet } from './util';

export type MountEvents = 'mount' | 'unmount';
export type MouseEvents = 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout';
export type KeyboardEvents = 'keydown' | 'keyup';
export type BaseEvents = MountEvents | MouseEvents | KeyboardEvents;
export type Handler = (...args: any[]) => any;

export abstract class BaseControl<
  Props extends Record<string, any>,
  RootElement extends HTMLElement,
  Events extends string
> {
  protected props: Props;
  protected element: RootElement;
  protected notifier: EventEmitter;
  protected className: string;
  protected styleSheet: CSSStyleSheet | null;

  constructor(props: Props) {
    this.props = props;

    Object.keys(props).forEach((key) =>
      Object.defineProperty(this, key, {
        get: () => this.props[key],
        set: (value: Props[keyof Props]) => {
          (this.props as Record<string, any>)[key] = value;
          if (this.onPropChange(key, value) !== false) {
            const { cssStyleDeclaration } = this;
            if (
              cssStyleDeclaration &&
              (cssStyleDeclaration as any)[key] !== ''
            ) {
              (cssStyleDeclaration as any)[key] = value;
            }
          }
          return this;
        },
      })
    );

    this.notifier = new EventEmitter();
    const html = this.renderHTML();
    const className = this.renderStyle();
    this.element = element<RootElement>(html);
    this.className = className;
    this.element.className = className;
    this.styleSheet = findStyleSheet(className);
    this.bindDomEvents();
    this.init();
  }

  protected onPropChange(key: string, value: any): false | void {}

  protected updateStyle(key: string, value: string) {
    const { cssStyleDeclaration } = this;
    if (cssStyleDeclaration) {
      (cssStyleDeclaration as any)[key] = value;
    }
  }

  protected abstract renderHTML(): string;
  protected abstract renderStyle(): string;

  protected init() {}

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

  protected bindDomEvents() {
    this.bindDomEvent('mousedown', 'onMouseDown');
    this.bindDomEvent('mouseup', 'onMouseUp');
    this.bindDomEvent('mouseover', 'onMouseOver');
    this.bindDomEvent('mouseout', 'onMouseOut');
    this.bindDomEvent('keydown', 'onKeyDown');
    this.bindDomEvent('keyup', 'onKeyUp');
  }

  protected bindDomEvent(eventName: string, selfHandlerKey: string) {
    this.element.addEventListener(eventName, (e) => {
      ((this as any)[selfHandlerKey] as any)(e);
      this.notifier.emit(eventName, e);
    });
  }

  protected onMount(element: HTMLElement) {}
  protected onUnMount() {}
  protected onMouseDown(e: MouseEvent) {}
  protected onMouseUp(e: MouseEvent) {}
  protected onMouseOver(e: MouseEvent) {}
  protected onMouseOut(e: MouseEvent) {}
  protected onKeyDown(e: KeyboardEvent) {}
  protected onKeyUp(e: KeyboardEvent) {}

  on(eventName: Events, handler: Handler) {
    this.notifier.on(eventName, handler);
    return this;
  }

  off(eventName: Events, handler: Handler) {
    this.notifier.off(eventName, handler);
    return this;
  }

  append(control: BaseControl<any, any, any>) {
    this.element.appendChild(control.element);
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

export const Control = BaseControl as {
  new <
    Props extends Record<string, any>,
    RootElement extends HTMLElement,
    Events extends string
  >(
    props: Props
  ): BaseControl<Props, RootElement, Events> & Props;
};
