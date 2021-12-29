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
    }
  }
}
