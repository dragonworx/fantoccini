import EventEmitter from 'eventemitter3';
import { dataAttr, px, parseHTML, html } from '.';
import {
  DynamicStyleSheet,
  CSSRuleNode,
  cssRule,
  CSSRuleKey,
} from './stylesheet';
import { Element } from './element';
import { join, parseCss } from './template';

let id: number = 0;

export interface BaseProps {
  tag?: string;
  visible: boolean;
}

export const baseDefaultProps: BaseProps = {
  visible: true,
};

export const defaultStyle = cssRule('&', {
  boxSizing: 'border-box',
});

export type K<Props> = keyof Props;
export type V<Props> = Props[keyof Props];
export type AnyBaseControl = BaseControl<any, any, any>;

export type BasicEventHandler = () => any;
export type MouseEventHandler = (event: MouseEvent) => any;
export type KeyboardEventHandler = (event: MouseEvent) => any;

export type BaseEvents<Props> = {
  mount: (containerElement: HTMLElement) => any;
  unmount: (containerElement: HTMLElement, dispose: boolean) => any;
  update: (props: Props) => any;
  init: BasicEventHandler;
  dispose: BasicEventHandler;
  mousedown: MouseEventHandler;
  mouseup: MouseEventHandler;
  mouseover: MouseEventHandler;
  mouseout: MouseEventHandler;
  click: MouseEventHandler;
  keydown: KeyboardEventHandler;
  keyup: KeyboardEventHandler;
};

/**
 * BaseControl
 */
export abstract class BaseControl<
  Props extends Record<string, any>,
  RootElement extends HTMLElement = HTMLDivElement,
  Events extends BaseEvents<Props> = BaseEvents<Props>
> {
  private _isMounted: boolean;
  protected readonly _id: number;
  protected readonly props: Props;
  protected readonly element: RootElement;
  protected readonly elementRef: Element;
  protected readonly styleSheet: DynamicStyleSheet;
  protected readonly children: AnyBaseControl[];
  protected parent?: AnyBaseControl;
  protected emitter: EventEmitter;

  constructor(props: Partial<Props>) {
    this._id = id++;
    this._isMounted = false;
    this.children = [];
    this.emitter = new EventEmitter();

    const propsWithDefaults = {
      ...baseDefaultProps,
      ...props,
    } as unknown as Props;
    this.props = propsWithDefaults;

    const html = this.getHtml();
    this.element = parseHTML<RootElement>(html);
    this.element.setAttribute(dataAttr('control'), this.type);
    this.elementRef = new Element(this.element);

    let rootCssNode = this.getStyle();
    if (rootCssNode !== defaultStyle) {
      rootCssNode.css(
        defaultStyle.selector,
        defaultStyle.rules,
        ...defaultStyle.children
      );
    }

    this.styleSheet = new DynamicStyleSheet(this.id, rootCssNode);
    this.element.className = this.styleSheet.className;

    if (propsWithDefaults.tag) {
      this.element.setAttribute(dataAttr('tag'), propsWithDefaults.tag);
      this.styleSheet.element.setAttribute(
        dataAttr('tag'),
        propsWithDefaults.tag
      );
    }

    this.element.querySelectorAll('[ref]').forEach((node) => {
      const refName = node.getAttribute('ref')!;
      node.removeAttribute('ref');
      node.setAttribute(dataAttr('ref'), `${this.id}-${refName}`);
    });

    Object.keys(propsWithDefaults).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.props[key],
        set: (value: V<Props>) => {
          (this.props as Record<string, any>)[key] = value;
          const props: Partial<Props> = {};
          props[key as K<Props>] = value;
          this.updateProps(props);
          return this;
        },
      });
    });

    this.bindDomEvents();
    this.init();
    this.setInitialState();
    this.emit('init');
  }

  private updateProps(props: Partial<Props>) {
    const { styleSheet } = this;
    if ('visible' in props) {
      styleSheet.root.set('display', props.visible ? '' : 'none');
    }
    Object.keys(props).forEach((k) => {
      const key = k as K<Props>;
      const value = props[key as K<Props>] as V<Props>;
      if (styleSheet.isCssProperty(k)) {
        const cssValue = this.convertPropToCssValue(key, value);
        const selector = this.cssSelectorForPropUpdate(key);
        this.selectCss(selector).set(key as CSSRuleKey, String(cssValue));
      }
      this.onUpdate(key, value);
      this.emit('update', props);
    });
  }

  private setInitialState() {
    this.updateProps(this.props);
  }

  private bindDomEvents() {
    this.domEvents.forEach((eventName) => {
      this.element.addEventListener(eventName, (e) => {
        this.emit(eventName as keyof Events, e);
      });
    });
  }

  protected get rootCss() {
    return this.styleSheet.root;
  }

  protected get domEvents(): string[] {
    return [
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'click',
      'keydown',
      'keyup',
    ];
  }

  protected getHtml(): string {
    return html`<div></div>`;
  }

  protected getStyle(): CSSRuleNode {
    return defaultStyle;
  }

  protected onUpdate(key: K<Props>, value: V<Props>) {}

  protected convertPropToCssValue(key: K<Props>, value: V<Props>) {
    if (typeof value === 'number') {
      return px(value);
    }
    return value;
  }

  protected cssSelectorForPropUpdate(propKkeyey: K<Props>) {
    return '&';
  }

  protected init() {}

  protected emit<T extends Events, K extends keyof T>(
    eventName: K,
    ...args: any[]
  ) {
    this.emitter.emit(String(eventName), ...args);
    return this;
  }

  get type() {
    return (this as any).__proto__.constructor.name.toLowerCase();
  }

  get id() {
    return `ocdk-${this.type}-${this._id}`;
  }

  get isMounted() {
    return this._isMounted;
  }

  get<T extends Props, K extends keyof T>(key: K): T[K] {
    return (this.props as any)[key];
  }

  set(propKey: K<Props>, value: V<Props>) {
    this.props[propKey] = value;
    const props: Partial<Props> = {};
    props[propKey] = value;
    this.updateProps(props);
    return this;
  }

  getElement() {
    return this.element;
  }

  mount(containerElement: HTMLElement | null) {
    if (containerElement) {
      containerElement.appendChild(this.element);
      this._isMounted = true;
      this.emit('mount', containerElement);
    } else {
      throw new Error('Cannot mount to null element');
    }
    return this;
  }

  unmount(dispose?: boolean) {
    const element = this.element;
    const containerElement = element.parentElement;
    if (containerElement !== null) {
      containerElement.removeChild(element);
      if (dispose) {
        if (this.styleSheet) {
          this.styleSheet.dispose();
        }
        this.emit('dispose');
      }
      this._isMounted = false;
      this.emit('unmount', containerElement, dispose);
      this.children.forEach((child) => child.unmount(dispose));
    } else {
      throw new Error('Cannot unmount from null parent');
    }
    return this;
  }

  selectCss(selector?: string) {
    return selector ? this.styleSheet.select(selector) : this.styleSheet.root;
  }

  select(selector: string) {
    return this.element.querySelector(selector);
  }

  selectAll(selector: string) {
    return this.element.querySelectorAll(selector);
  }

  ref(refName: string) {
    const selector = `[${dataAttr('ref')}="${this.id}-${refName}"]`;
    const element = this.select(`.${this.id} ${selector}`);
    if (!element) {
      throw new Error(`Element with ref "${refName}" not found`);
    }
    return element as HTMLElement;
  }

  refElement(refName: string) {
    const element = this.ref(refName);
    return new Element(element);
  }

  add(control: AnyBaseControl, refName?: string) {
    let element: HTMLElement = this.element;
    if (refName) {
      element = this.ref(refName);
    }
    control.mount(element);
    control.parent = this;
    this.children.push(control);
    return this;
  }

  remove(control: AnyBaseControl) {
    delete control.parent;
    const index = this.children.indexOf(control);
    this.children.splice(index, 1);
    control.unmount();
    return this;
  }

  on<T extends Events, K extends keyof T>(eventName: K, handler: T[K]) {
    this.emitter.on(String(eventName), handler as any);
    return this;
  }

  ff<T extends Events, K extends keyof T>(eventName: K, handler: T[K]) {
    this.emitter.off(String(eventName), handler as any);
    return this;
  }
}

export function Control<
  Props,
  Element extends HTMLElement,
  Events extends BaseEvents<Props> = BaseEvents<Props>,
  SubClass = {}
>(
  subclass: unknown = BaseControl
): {
  new (props: Props): BaseControl<Props, Element, Events> &
    Omit<SubClass, 'element'> &
    Props;
} {
  return subclass as {
    new (props: Props): BaseControl<Props, Element, Events> &
      Omit<SubClass, 'element'> &
      Props;
  };
}
