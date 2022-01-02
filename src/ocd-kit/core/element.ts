export class Element<T extends HTMLElement> {
  constructor(readonly node: T) {}

  get value() {
    const { node } = this;
    if ('value' in node) {
      return (node as any).value;
    } else {
      return node.innerText;
    }
  }

  set value(value: string) {
    const { node } = this;
    if ('value' in node) {
      (node as any).value = value;
    } else {
      node.innerHTML = value;
    }
  }

  get bounds() {
    return this.node.getBoundingClientRect();
  }

  attr(key: string) {
    const { node } = this;
    return node.getAttribute(key);
  }

  setAttr(key: string, value: string) {
    const { node } = this;
    node.setAttribute(key, value);
    return this;
  }

  add(node: T) {
    this.node.appendChild(node);
    return this;
  }

  remove(node: T) {
    this.node.removeChild(node);
    return this;
  }

  addClass(cssClassName: string) {
    this.node.classList.add(cssClassName);
    return this;
  }

  removeClass(cssClassName: string) {
    this.node.classList.remove(cssClassName);
    return this;
  }

  hasClass(cssClassName: string) {
    return this.node.classList.contains(cssClassName);
  }
}
