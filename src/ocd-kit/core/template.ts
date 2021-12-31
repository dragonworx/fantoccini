import { CSSRuleKey, CSSRuleNode } from '.';

export function html(strings: TemplateStringsArray, ...args: any[]) {
  return join(strings, args);
}

export function css(strings: TemplateStringsArray, ...args: any[]) {
  const cssText = join(strings, args);
  return parseCss(cssText);
}

export function join(strings: TemplateStringsArray, args: any[]) {
  return strings
    .map((str, i) => str + (args[i] ? args[i] : ''))
    .join('')
    .trim();
}

type ParseInfo = {
  index: number;
};

export function parseCss(cssText: string) {
  if (!isCssBalanced(cssText)) {
    throw new Error(
      'Unbalanced CSS text, check opening and closing brackets match'
    );
  }
  return parseRule(cssText, { index: 0 });
}

function parseRule(cssText: string, info: ParseInfo) {
  const selector = parseUntil(cssText, info, '{');
  const node = new CSSRuleNode(selector, {}, []);
  parseNext(cssText, info, node);
  return node;
}

function parseNext(cssText: string, info: ParseInfo, node: CSSRuleNode) {
  const nextChar = whichIsNext(cssText, info.index, [';', '{', '}']);
  const isNode = nextChar === '{';
  const isCloseNode = nextChar === '}';
  if (isCloseNode) {
    parseUntil(cssText, info, '}');
    return;
  }
  if (isNode) {
    const subNode = parseRule(cssText, info);
    node.children.push(subNode);
    parseNext(cssText, info, node);
  } else {
    const [ruleKey, value] = parseUntil(cssText, info, ';').split(':');
    if (!value) {
      throw 'Invalid chunk';
    }
    node.rules[ruleKey.trim() as CSSRuleKey] = value.trim();
    parseNext(cssText, info, node);
  }
}

function parseUntil(
  text: string,
  info: ParseInfo,
  terminatingChar: string
): string {
  let value: string = '';
  for (let i = info.index; i < text.length; i++) {
    const char = text[i];
    if (char === terminatingChar) {
      info.index = Math.min(i + 1, text.length);
      return value.trim();
    }
    value += text[i];
  }
  info.index = text.length;
  return value.trim();
}

function whichIsNext(text: string, startIndex: number, chars: string[]) {
  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];
    if (chars.indexOf(char) > -1) {
      return char;
    }
  }
  return null;
}

function isCssBalanced(cssText: string) {
  let openBrackets: number = 0;
  let closeBrackets: number = 0;
  for (let i = 0; i < cssText.length; i++) {
    const char = cssText[i];
    if (char === '{') {
      openBrackets++;
    } else if (char === '}') {
      closeBrackets++;
    }
  }
  return openBrackets === closeBrackets;
}