export class Element {
  constructor(readonly element: HTMLElement) {}

  get value() {
    const { element } = this;
    if ('value' in element) {
      return (element as any).value;
    } else {
      return element.innerText;
    }
  }

  set value(value: string) {
    const { element } = this;
    if ('value' in element) {
      (element as any).value = value;
    } else {
      element.innerHTML = value;
    }
  }

  attr(key: string, value?: string) {
    const { element } = this;
    if (value === undefined) {
      return element.getAttribute(key);
    } else {
      element.setAttribute(key, value);
      return this;
    }
  }

  add(element: HTMLElement) {
    this.element.appendChild(element);
    return this;
  }

  remove(element: HTMLElement) {
    this.element.removeChild(element);
    return this;
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
}
