import EventEmitter from 'eventemitter3';
import { dataAttr, px, parseHTML } from '.';
import { DynamicStyleSheet, CSSRuleNode, css, CSSRuleKey } from './stylesheet';
import { Element } from './element';

let id: number = 0;

export interface BaseProps {
  tag?: string;
  visible: boolean;
}

export const baseDefaultProps: BaseProps = {
  visible: true,
};

export const defaultStyle = css('&', {
  boxSizing: 'border-box',
});

export type K<Props> = keyof Props;
export type V<Props> = Props[keyof Props];
export type AnyBaseControl = BaseControl<any, any, any>;

export type BaseEvents = {
  mount: void;
  unmount: void;
  update: void;
  init: void;
  dispose: void;
  mousedown: void;
  mouseup: void;
  mouseover: void;
  mouseout: void;
  click: void;
  keydown: void;
  keyup: void;
};

/**
 * BaseControl
 */
export abstract class BaseControl<
  Props extends Record<string, any>,
  RootElement extends HTMLElement = HTMLDivElement,
  Events extends BaseEvents = BaseEvents
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

    const html = this.html();
    this.element = parseHTML<RootElement>(html);
    this.element.setAttribute(dataAttr('control'), this.type);
    this.elementRef = new Element(this.element);

    let rootCssNode = this.style();
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
      console.log('TAG', this.id, propsWithDefaults.tag);
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
        this.css(selector).set(key as CSSRuleKey, String(cssValue));
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

  protected html(): string {
    return '<div></div>';
  }

  protected style(): CSSRuleNode {
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

  protected emit(eventName: keyof Events, ...args: any[]) {
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
      console.log('mount', this.id);
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
      console.log('unmount', this.id);
      this.children.forEach((child) => child.unmount(dispose));
    } else {
      throw new Error('Cannot unmount from null parent');
    }
    return this;
  }

  css(selector?: string) {
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

  on(eventName: keyof Events, handler: (...args: any[]) => any) {
    this.emitter.on(String(eventName), handler.bind(this));
    return this;
  }

  off(eventName: keyof Events, handler: (...args: any[]) => any) {
    this.emitter.off(String(eventName), handler);
    return this;
  }
}

export function Control<
  Props,
  Element extends HTMLElement,
  Events extends BaseEvents = BaseEvents,
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