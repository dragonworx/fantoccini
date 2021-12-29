import EventEmitter from 'eventemitter3';
import { DynamicStyleSheet, CSSRuleNode, css, CSSRuleKey } from './stylesheet';
import { Element } from './element';

export { css };

export function px(value: string | number) {
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

export type K<Props> = keyof Props;
export type V<Props> = Props[keyof Props];

/**
 * BaseControl
 */
export abstract class BaseControl<
  Props extends Record<string, any>,
  RootElement extends HTMLElement
> extends EventEmitter {
  protected readonly _id: number;
  protected readonly props: Props;
  protected readonly element: RootElement;
  protected readonly elementRef: Element;
  protected readonly styleSheet: DynamicStyleSheet;
  protected readonly children: BaseControl<any, any>[];
  protected parent?: BaseControl<any, any>;
  isMounted: boolean;

  private static parseHTML<T>(html: string): T {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild as unknown as T;
  }

  constructor(props: Props) {
    super();
    this._id = id++;
    this.isMounted = false;
    const propsWithDefaults = {
      ...defaultProps,
      ...props,
    };
    this.props = propsWithDefaults;
    const { html, style } = this.template();
    this.element = BaseControl.parseHTML<RootElement>(html);
    this.element.setAttribute('data-id', this.id);
    this.elementRef = new Element(this.element);
    style.css(
      defaultStyle.selector,
      defaultStyle.rules,
      ...defaultStyle.children
    );
    this.styleSheet = new DynamicStyleSheet(this.id, style);
    this.element.className = this.styleSheet.className;
    this.children = [];

    this.selectAll('[data-ref]').forEach((node) =>
      node.setAttribute(
        'data-ref-id',
        `${this.id}-${node.getAttribute('data-ref')}`
      )
    );

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
    Object.keys(props).forEach((key) => {
      const value = props[key] as V<Props>;
      if (styleSheet.isCssProperty(key)) {
        const cssValue = this.convertPropToCssValue(key, value);
        const selector = this.cssSelectorForPropUpdate(key);
        this.css(selector).set(key as CSSRuleKey, cssValue);
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
        this.emit(eventName, e);
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

  protected abstract template(): { html: string; style: CSSRuleNode };

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

  get id() {
    return `arena-ctrl-${this._id}`;
  }

  mount(containerElement: HTMLElement | null) {
    if (containerElement) {
      containerElement.appendChild(this.element);
      this.isMounted = true;
      this.emit('mount', containerElement);
    } else {
      throw new Error('Cannot mount to null element');
    }
    return this;
  }

  unmount() {
    const element = this.element;
    const containerElement = element.parentElement;
    if (containerElement !== null) {
      containerElement.removeChild(element);
      if (this.styleSheet) {
        this.styleSheet.dispose();
      }
      this.isMounted = false;
      this.emit('unmount', containerElement);
      this.children.forEach((child) => child.unmount());
    } else {
      throw new Error('Cannot unmount from null parent');
    }
    return this;
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

  refElement(refName: string) {
    const element = this.ref(refName);
    return new Element(element);
  }

  addClass(cssClassName: string) {
    this.element.classList.add(cssClassName);
    return this;
  }

  removeClass(cssClassName: string) {
    this.element.classList.remove(cssClassName);
    return this;
  }

  hasClass(cssClassName: string) {
    return this.element.classList.contains(cssClassName);
  }

  add(control: BaseControl<any, any>, refName?: string) {
    let element: HTMLElement = this.element;
    if (refName) {
      element = this.ref(refName);
    }
    control.mount(element);
    control.parent = this;
    this.children.push(control);
    return this;
  }

  remove(control: BaseControl<any, any>) {
    delete control.parent;
    const index = this.children.indexOf(control);
    this.children.splice(index, 1);
    control.unmount();
    return this;
  }
}

export const Control = BaseControl as unknown as {
  new <Props extends Record<string, any>, RootElement extends HTMLElement>(
    props: Props
  ): BaseControl<Props, RootElement> & Props & BaseProps;
};
