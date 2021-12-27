export function element<T>(html: string): T {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.firstElementChild as unknown as T;
}

export function size(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}

export function findStyleSheet(className: string) {
  //document.head.querySelectorAll('[data-emotion]')[0].sheet.cssRules[0].selectorText
  //document.head.querySelectorAll('[data-emotion]')[0].sheet.cssRules[0].style.backgroundColor
  const nodes = document.head.querySelectorAll('[data-emotion]');
  for (let i = 0; i < nodes.length; i++) {
    const sheet = (nodes[i] as HTMLStyleElement).sheet;
    const rule = sheet?.cssRules[0];
    if (!(rule instanceof CSSStyleRule)) {
      continue;
    }
    if (rule.selectorText === `.${className}`) {
      return sheet;
    }
  }
  return null;
}

export function randomRgb() {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}
