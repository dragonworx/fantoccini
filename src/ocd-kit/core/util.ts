let attrPrefix = 'data-ocdk-';
let _idPrefix = 'ocdk-';

export const setDataAttr = (prefix: string = '') => (attrPrefix = prefix);

export const dataAttr = (attribute: string) => `${attrPrefix}${attribute}`;

export const setIdPrefix = (prefix: string = '') => (_idPrefix = prefix);

export const idPrefix = () => _idPrefix;

export function px(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`;
}
