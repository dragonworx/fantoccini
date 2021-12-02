const letterRegex = /[a-zA-Z]/;
const numericInputRegex = /[\-.]/;
const generalInputRegex =
  /Tab|Escape|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Backspace|Delete/;

export function isGeneralInputKey(key: string) {
  return !!key.match(generalInputRegex);
}

export function isNumeric(key: string) {
  return !isNaN(parseFloat(key));
}

export function isNumericInput(key: string) {
  return !!key.match(numericInputRegex) || isNumeric(key);
}

export function isLetter(key: string) {
  return !!key.match(letterRegex);
}

export function isSpecialKey(key: string) {
  return key.length > 0;
}

export function isSymbol(key: string) {
  return !isNumeric(key) && !isLetter(key) && !isSpecialKey(key);
}

export function isAlphaNumeric(key: string) {
  return isNumeric(key) || isLetter(key);
}
