import { CSSRuleKey } from './cssRules';

let id: number = 0;

export class DynamicStyleSheet {
  element: HTMLStyleElement;
  id: number;

  constructor(readonly schema: CSSDefinition) {
    this.id = id++;
    const element = (this.element = document.createElement('style'));
    element.setAttribute(this.className, '');
    document.getElementsByTagName('head')[0].appendChild(element);
    this.parse(schema);
  }

  get sheet() {
    return this.element.sheet!;
  }

  get rules() {
    return this.sheet.cssRules;
  }

  get className() {
    return `style-${this.id}`;
  }

  parse(schema: CSSDefinition, selectorPrefix?: string) {
    const { element, className } = this;
    const { selector, rules, children } = schema;
    const cssText = Object.keys(rules)
      .map((key) => `${key}: ${rules[key as CSSRuleKey]}`)
      .join(';');
    const ruleText = `${selectorPrefix ? selectorPrefix + ' ' : ''}${selector}${
      selectorPrefix ? '' : `.${className}`
    } {${cssText}}`;
    const ruleIndex = this.sheet.insertRule(ruleText);
    const html = `${element.innerHTML}\n${ruleText}`.trim();
    element.innerHTML = html;
    children.forEach((childSchema) =>
      this.parse(
        childSchema,
        selectorPrefix
          ? `${selectorPrefix} ${selector}`
          : `${selector}.${className}`
      )
    );
  }

  get(selector: string) {
    const {
      schema: { children },
    } = this;
    debugger;
    for (let i = 0; i < children.length; i++) {
      if (children[i].selector === selector) {
        return children[i];
      }
    }
  }
}

export class CSSDefinition {
  constructor(
    readonly selector: string,
    readonly rules: { [Property in CSSRuleKey]?: string },
    readonly children: CSSDefinition[]
  ) {}

  get(selector: string) {
    const { children } = this;
    for (let i = 0; i < children.length; i++) {
      if (children[i].selector === selector) {
        return children[i];
      }
    }
  }
}

export function css(
  selector: string,
  rules: { [Property in CSSRuleKey]?: string },
  ...children: CSSDefinition[]
) {
  return new CSSDefinition(selector, rules, [...children]);
}
