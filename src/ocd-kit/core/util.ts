export const dataAttr = (attribute: string) => `data-ocdk-${attribute}`;

export function px(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}

export function parseHTML<T>(html: string): T {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.firstElementChild as unknown as T;
}
