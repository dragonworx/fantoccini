export const dataAttr = (attribute: string) => `data-ocdk-${attribute}`;

export function px(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}
