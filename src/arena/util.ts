export function create<T>(elementName: string): T {
  return document.createElement(elementName) as unknown as T;
}

export function div() {
  return create<HTMLDivElement>("div");
}
