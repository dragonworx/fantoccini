import EventEmitter from 'eventemitter3';
import { DynamicStyleSheet, CSSRuleNode, css, CSSRuleKey } from './stylesheet';
import { Element } from './element';
import { Text } from '../components/text';

export { css };

export function px(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}

const fn = <T extends unknown, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};

let id: number = 0;

export interface BaseProps {
  tag?: string;
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
export abstract class Control<
  Props extends BaseProps,
  RootElement extends HTMLElement
> extends EventEmitter {
  protected readonly _id: number;
  protected readonly props: Props;
  protected readonly element: RootElement;
  protected readonly elementRef: Element;
  protected readonly styleSheet: DynamicStyleSheet;
  protected readonly children: Control<any, any>[];
  protected parent?: Control<any, any>;
  isMounted: boolean;

  private static parseHTML<T>(html: string): T {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild as unknown as T;
  }

  constructor(props: Partial<Props>) {
    super();
    this._id = id++;
    this.isMounted = false;
    const propsWithDefaults = {
      ...defaultProps,
      ...props,
    } as unknown as Props;
    this.props = propsWithDefaults;
    const { html, style } = this.template();
    this.element = Control.parseHTML<RootElement>(html);
    this.element.setAttribute('data-id', this.id);
    if (propsWithDefaults.tag) {
      this.element.setAttribute('data-tag', propsWithDefaults.tag);
    }
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

    // Object.keys(propsWithDefaults).forEach((key) => {
    //   Object.defineProperty(this, key, {
    //     get: () => this.props[key],
    //     set: (value: V<Props>) => {
    //       (this.props as Record<string, any>)[key] = value;
    //       const props: Partial<Props> = {};
    //       props[key as K<Props>] = value;
    //       this.updateProps(props);
    //       return this;
    //     },
    //   });
    // });

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
    return `ocdkit-ctrl-${this._id}`;
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

  mount(containerElement: HTMLElement | null) {
    if (containerElement) {
      containerElement.appendChild(this.element);
      this.isMounted = true;
      this.emit('mount', containerElement);
      console.log('mount', this.id);
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
      console.log('unmount', this.id);
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

  add(control: Control<any, any>, refName?: string) {
    let element: HTMLElement = this.element;
    if (refName) {
      element = this.ref(refName);
    }
    control.mount(element);
    control.parent = this;
    this.children.push(control);
    return this;
  }

  remove(control: Control<any, any>) {
    delete control.parent;
    const index = this.children.indexOf(control);
    this.children.splice(index, 1);
    control.unmount();
    return this;
  }
}

// export const Control = BaseControl as unknown as {
//   new <Props extends Record<string, any>, RootElement extends HTMLElement>(
//     props: Props
//   ): BaseControl<Props, RootElement> & Props & BaseProps;
// };

// export function Wrapper<Props, Class>(
//   cls: unknown
// ): {
//   new (props: Props): Class & Props;
// } {
//   return cls as unknown as {
//     new (props: Props): Class & Props;
//   };
// }

export function WithBase<Props, Element extends HTMLElement, SubClass = {}>(
  cls: unknown = Base
): {
  new (props: Props): Base<Props, Element> & Omit<SubClass, 'element'> & Props;
} {
  return cls as {
    new (props: Props): Base<Props, Element> &
      Omit<SubClass, 'element'> &
      Props;
  };
}

export type PropsBase = {
  id: string;
};

export type SubProps = PropsBase & {
  subA: string;
  subB?: number;
};

export type SubProps1 = SubProps & {
  subC: boolean;
};

export class Base<Props extends Record<string, any>, E extends HTMLElement> {
  element: E;
  props: Props;

  constructor(props: Props) {
    this.element = {} as any;
    this.props = props;
    Object.keys(props).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => props[key as any],
        set: (value: V<Props>) => {
          (this.props as Record<string, any>)[key] = value;
        },
      });
    });
  }

  getElement(): E {
    return this.element as E;
  }

  baseMethod() {
    return 'baseMethod';
  }
}

export class Sub extends WithBase<SubProps, HTMLDivElement>() {
  constructor(props: Partial<SubProps>) {
    super({
      id: 'foo',
      subA: 's',
      subB: 4,
      ...props,
    });
  }

  subMethod() {
    return 'subMethod';
  }
}

export class Sub1 extends WithBase<SubProps1, HTMLLabelElement, Sub>(Sub) {
  constructor(props: Partial<SubProps>) {
    super({
      id: 'foo',
      subA: 's',
      subB: 4,
      subC: false,
      ...props,
    });
  }

  sub1Method() {
    return 'sub1Method';
  }
}

const sub = new Sub({ id: 'a' });
sub.getElement();
sub.baseMethod();
sub.subMethod();
const subEl = sub.element;
const subId = sub.id;
const subA = sub.subA;
const subB = sub.subB;

const sub1 = new Sub1({ id: 'b' });
sub1.getElement();
sub1.baseMethod();
sub1.subMethod();
sub1.sub1Method();
const sub1El = sub1.element;
const sub1Id = sub1.id;
const sub1SubA = sub1.subA;
const sub1SubB = sub1.subB;
const sub1SubC = sub1.subC;

(window as any).sub = sub;
(window as any).sub1 = sub1;
