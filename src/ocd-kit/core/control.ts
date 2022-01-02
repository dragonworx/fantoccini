import EventEmitter from 'eventemitter3';
import { dataAttr, px, parseHTML, html, css, idPrefix } from '.';
import {
  DynamicStyleSheet,
  CSSRuleNode,
  cssRule,
  CSSRuleKey,
} from './stylesheet';
import { Element } from './element';

let id: number = 0;

export interface BaseProps {
  tag?: string;
  visible: boolean;
}

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
  RootElement extends HTMLElement = HTMLElement,
  Props extends Record<string, any> = BaseProps,
  Events extends BaseEvents<Props> = BaseEvents<Props>
> {
  private _isMounted: boolean;
  protected readonly _id: number;
  protected readonly props: Props;
  protected readonly element: Element<RootElement>;
  protected readonly styleSheet: DynamicStyleSheet;
  protected readonly children: AnyBaseControl[];
  protected parent?: AnyBaseControl;
  protected emitter: EventEmitter;

  static controlById: Map<string, BaseControl<any, any, any>> = new Map();

  static defaultProps: BaseProps = {
    visible: true,
  };

  static defaultStyle: CSSRuleNode = css`
    & {
      box-sizing: border-box;
    }
  `;

  constructor(props: Partial<Props> = {}, parent?: BaseControl<any>) {
    this._id = id++;
    BaseControl.controlById.set(this.id, this);
    this._isMounted = false;
    this.children = [];
    this.emitter = new EventEmitter();

    const propsWithDefaults = {
      ...BaseControl.defaultProps,
      ...props,
    } as unknown as Props;

    this.props = propsWithDefaults;

    this.styleSheet = this.createStyleSheet();
    this.element = this.createElement();
    this.bindGettersSetters();
    this.bindDomEvents();
    this.init();
    this.setInitialState();
    this.emit('init');

    if (parent) {
      parent.add(this);
    }
  }

  private createElement() {
    const { props } = this;
    const template = this.template();
    const isHtmlTemplate = typeof template === 'string';
    const element = (
      isHtmlTemplate ? parseHTML<RootElement>(template) : template
    ) as RootElement;
    if (element === null) {
      throw new Error('Existing element not found');
    }
    element.setAttribute(dataAttr('control'), this.type);

    if (isHtmlTemplate) {
      const idAttr = dataAttr('id');
      const nodes = element.querySelectorAll(`template[${idAttr}]`);
      nodes.forEach((node) => {
        const id = node.getAttribute(idAttr)!;
        const control = BaseControl.controlById.get(id);
        if (control && control.element) {
          node.replaceWith(control.element.node);
        }
      });
    } else {
      this._isMounted = true;
    }

    if (props.tag) {
      element.setAttribute(dataAttr('tag'), props.tag);
    }

    element.className = this.styleSheet.className;

    return new Element(element);
  }

  private createStyleSheet() {
    const defaultStyle = BaseControl.defaultStyle;
    let rootCssNode = this.style();
    if (rootCssNode !== defaultStyle) {
      rootCssNode.css(
        defaultStyle.selector,
        defaultStyle.rules,
        ...defaultStyle.children
      );
    }

    return new DynamicStyleSheet(this.id, rootCssNode);
  }

  private bindGettersSetters() {
    Object.keys(this.props).forEach((key) => {
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
      this.element.node.addEventListener(eventName, (e) => {
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

  protected template(): string | HTMLElement {
    return html`<div></div>`;
  }

  protected style(): CSSRuleNode {
    return BaseControl.defaultStyle;
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

  protected getContainer(control: AnyBaseControl): string | undefined {
    return;
  }

  get type() {
    return (this as any).__proto__.constructor.name;
  }

  get id() {
    return `${idPrefix()}${this.type}-${this._id}`;
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
      containerElement.appendChild(this.element.node);
      this._isMounted = true;
      this.emit('mount', containerElement);
    } else {
      throw new Error('Cannot mount to null element');
    }
    return this;
  }

  unmount(dispose?: boolean) {
    const element = this.element;
    const containerElement = element.node.parentElement;
    if (containerElement !== null) {
      containerElement.removeChild(element.node);
      if (dispose) {
        BaseControl.controlById.delete(this.id);
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

  css(selector?: string) {
    return selector ? this.styleSheet.select(selector) : this.styleSheet.root;
  }

  select(selector: string) {
    const element = this.element.node.querySelector(selector);
    if (element) {
      return new Element(element as HTMLElement);
    }
    return null;
  }

  selectAll(selector: string) {
    return Array.from(this.element.node.querySelectorAll(selector)).map(
      (element) => new Element(element as HTMLElement)
    );
  }

  tag<T extends BaseControl<any, any, any>>(tagName: string): T {
    const selector = `[${dataAttr('tag')}="${tagName}"]`;
    const element = this.select(selector);
    if (!element) {
      throw new Error(`Control with tag "${tagName}" not found`);
    }
    return BaseControl.controlById.get(element.attr('class')!) as T;
  }

  add(control: AnyBaseControl, containerClassName?: string) {
    let element: HTMLElement = this.element.node;
    if (!containerClassName) {
      containerClassName = this.getContainer(control);
    }
    if (containerClassName) {
      const containerElement = this.select(containerClassName);
      if (containerElement) {
        element = containerElement.node;
      }
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

  off<T extends Events, K extends keyof T>(eventName: K, handler: T[K]) {
    this.emitter.off(String(eventName), handler as any);
    return this;
  }
}

export function Control<
  Element extends HTMLElement,
  Props = BaseProps,
  Events extends BaseEvents<Props> = BaseEvents<Props>,
  SubClass = {}
>(
  subclass: unknown = BaseControl
): {
  new (props?: Props): BaseControl<Element, Props, Events> &
    Omit<SubClass, 'element'> &
    Props;
} {
  return subclass as {
    new (props?: Props): BaseControl<Element, Props, Events> &
      Omit<SubClass, 'element'> &
      Props;
  };
}
