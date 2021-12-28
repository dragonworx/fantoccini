import { DynamicStyleSheet, CSSRuleNode, css } from './stylesheet';
import { Element } from './element';

export { css };

export type MountEvents = 'mount' | 'unmount';
export type MouseEvents = 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout';
export type KeyboardEvents = 'keydown' | 'keyup';
export type BaseEvents = MountEvents | MouseEvents | KeyboardEvents;
export type Handler = (...args: any[]) => any;

export function size(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}

let id: number = 0;

export interface BaseProps {
  visible: boolean;
}

export const defaultProps: BaseProps = {
  visible: true,
};

export const defaultStyle = css('&', {
  boxSizing: 'border-box',
});

export abstract class BaseControl<
  Props extends Record<string, any>,
  RootElement extends HTMLElement,
  Events extends string
> {
  protected _id: number;
  protected props: Props;
  protected element: RootElement;
  protected refElement: Element;
  protected styleSheet: DynamicStyleSheet;
  protected handlers: Map<string, Handler[]>;

  static html<T>(html: string): T {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild as unknown as T;
  }

  constructor(props: Props) {
    this._id = id++;
    const propsWithDefaults = {
      ...defaultProps,
      ...props,
    };
    this.props = propsWithDefaults;
    this.handlers = new Map();
    this.element = BaseControl.html<RootElement>(this.$html());
    this.element.setAttribute('data-id', this.id);
    this.refElement = new Element(this.element);
    const style = this.$style();
    style.css(
      defaultStyle.selector,
      defaultStyle.rules,
      ...defaultStyle.children
    );
    this.styleSheet = new DynamicStyleSheet(this.id, style);
    this.element.className = this.styleSheet.className;

    this.selectAll('[data-ref]').forEach((node) =>
      node.setAttribute(
        'data-ref-id',
        `${this.id}-${node.getAttribute('data-ref')}`
      )
    );

    Object.keys(propsWithDefaults).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.props[key],
        set: (value: Props[keyof Props]) => {
          (this.props as Record<string, any>)[key] = value;
          this.propChange(key, value);
          return this;
        },
      });
    });

    Object.keys(propsWithDefaults).forEach((key) =>
      this.propChange(key, (this as Props[keyof Props])[key])
    );

    this.bindDomEvents();
    this.init && this.init();
  }

  private propChange(key: string, value: any) {
    const root = this.styleSheet.root;
    if (key === 'visible') {
      root.set('display', value ? '' : 'none');
    }
    this.onPropChange(key, value);
  }

  protected get rootCss() {
    return this.styleSheet.root;
  }

  protected onPropChange(key: string, value: any) {}

  protected abstract $html(): string;
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
      this.emit(eventName, e);
    });
  }

  protected emit(eventName: string, ...data: any[]) {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => handler(eventName, ...data));
    }
  }

  protected onMount(containerElement: HTMLElement) {}
  protected onUnMount(containerElement: HTMLElement) {}
  protected onMouseDown(e: MouseEvent) {}
  protected onMouseUp(e: MouseEvent) {}
  protected onMouseOver(e: MouseEvent) {}
  protected onMouseOut(e: MouseEvent) {}
  protected onKeyDown(e: KeyboardEvent) {}
  protected onKeyUp(e: KeyboardEvent) {}

  get id() {
    return `arena-ctrl-${this._id}`;
  }

  on(eventName: Events, handler: Handler) {
    if (!this.handlers.get(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
    return this;
  }

  off(eventName: Events, handler: Handler) {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
    return this;
  }

  mount(containerElement: HTMLElement | null) {
    if (containerElement) {
      containerElement.appendChild(this.element);
      this.onMount(containerElement);
      this.emit('mount', containerElement);
    } else {
      throw new Error('Cannot mount to null element');
    }
  }

  unmount() {
    const element = this.element;
    const containerElement = element.parentElement;
    if (containerElement !== null) {
      containerElement.removeChild(element);
      if (this.styleSheet) {
        this.styleSheet.dispose();
      }
      this.onUnMount(containerElement);
      this.emit('unmount', containerElement);
    } else {
      throw new Error('Cannot unmount from null parent');
    }
  }

  css(selector: string) {
    return this.styleSheet.select(selector);
  }

  select(selector: string) {
    return this.element.querySelector(selector);
  }

  selectAll(selector: string) {
    return this.element.querySelectorAll(selector);
  }

  ref(refName: string) {
    const selector = `[data-ref-id="${this.id}-${refName}"]`;
    const element = this.select(`[data-id="${this.id}"] ${selector}`);
    if (!element) {
      throw new Error(`Element with ref "${refName}" not found`);
    }
    return element as HTMLElement;
  }

  refAsElement(refName: string) {
    const element = this.ref(refName);
    return new Element(element);
  }

  addClass(cssClassName: string) {
    this.element.classList.add(cssClassName);
  }

  removeClass(cssClassName: string) {
    this.element.classList.remove(cssClassName);
  }

  hasClass(cssClassName: string) {
    return this.element.classList.contains(cssClassName);
  }
}

export const Control = BaseControl as unknown as {
  new <
    Props extends Record<string, any>,
    RootElement extends HTMLElement,
    Events extends string
  >(
    props: Props
  ): BaseControl<Props, RootElement, Events> & Props & BaseProps;
};
