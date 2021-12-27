export function element<T>(html: string): T {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.firstElementChild as unknown as T;
}

export function size(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}
