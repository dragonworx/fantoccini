export interface RadioGroupOption {
  label: string;
  value: any;
}

export type Position = "left" | "right" | "top" | "bottom";

export type Align = "start" | "center" | "end";

export type Justify = "start" | "center" | "end";

export type Direction = "horizontal" | "vertical";

export function isNumber(key: string) {
  return !isNaN(parseFloat(key));
}

const keyRegex = /[a-zA-Z]/;

export function isLetter(key: string) {
  return !!key.match(keyRegex);
}

export function isSpecialKey(key: string) {
  return key.length > 0;
}

export function isSymbol(key: string) {
  return !isNumber(key) && !isLetter(key) && !isSpecialKey(key);
}

export function isAlphaNumeric(key: string) {
  return isNumber(key) || isLetter(key);
}
