import EventEmitter from 'eventemitter3';
import { DynamicStyleSheet, CSSRuleNode } from './stylesheet';
import { element } from './util';

export { CSSRuleNode };

export type MountEvents = 'mount' | 'unmount';
export type MouseEvents = 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout';
export type KeyboardEvents = 'keydown' | 'keyup';
export type BaseEvents = MountEvents | MouseEvents | KeyboardEvents;
export type Handler = (...args: any[]) => any;

let id: number = 0;

export abstract class BaseControl<
  Props extends Record<string, any>,
  RootElement extends HTMLElement,
  Events extends string
> {
  protected id: number;
  protected props: Props;
  protected element: RootElement;
  protected styleSheet: DynamicStyleSheet;
  protected notifier: EventEmitter;

  constructor(props: Props) {
    this.id = id++;
    this.props = props;
    this.notifier = new EventEmitter();
    this.element = element<RootElement>(this.$template());
    this.element.setAttribute('id', `control-${this.id}`);
    this.styleSheet = new DynamicStyleSheet(this.$style());
    this.element.className = this.styleSheet.className;

    Object.keys(props).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.props[key],
        set: (value: Props[keyof Props]) => {
          (this.props as Record<string, any>)[key] = value;
          this.onPropChange && this.onPropChange(key, value);
          return this;
        },
      });
    });

    if (this.onPropChange) {
      Object.keys(props).forEach(
        (key) =>
          this.onPropChange &&
          this.onPropChange(key, (this as Props[keyof Props])[key])
      );
    }

    this.bindDomEvents();
    this.init && this.init();
  }

  protected onPropChange?(key: string, value: any): void;

  protected css(selector: string) {
    return this.styleSheet.select(selector);
  }

  protected select(selector: string) {
    return this.element.querySelector(selector);
  }

  protected selectAll(selector: string) {
    return this.element.querySelectorAll(selector);
  }

  protected ref(refName: string) {
    const element = this.select(`#control-${this.id} [data-ref="${refName}"]`);
    if (!element) {
      throw new Error(`Element with ref "${refName}" not found`);
    }
    return element as HTMLElement;
  }

  protected abstract $template(): string;
  protected abstract $style(): CSSRuleNode;
  protected init?(): void;

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
        this.styleSheet.dispose();
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
