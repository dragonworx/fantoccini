const letterRegex = /[a-zA-Z]/;
const numericInputRegex = /[\-.]/;
const generalInputRegex =
  /Tab|Escape|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Ctrl/;

export function isGeneralInputKey(key: string) {
  return !!key.match(generalInputRegex);
}

export function isDeleteKey(key: string) {
  return key === "Delete" || key === "Backspace";
}

export function isIncrementKey(key: string) {
  return key === "ArrowUp" || key === "ArrowRight";
}

export function isDecrementKey(key: string) {
  return key === "ArrowDown" || key === "ArrowLeft";
}

export function isArrowKey(key: string) {
  return isIncrementKey(key) || isDecrementKey(key);
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