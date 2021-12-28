export function element<T>(html: string): T {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.firstElementChild as unknown as T;
}

export function size(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}

export function randomRgb() {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}
