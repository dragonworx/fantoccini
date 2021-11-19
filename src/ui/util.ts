import { SerializedStyles } from '@emotion/react';

export function getProps<Props>(
  props: Props,
  defaultProps: Props
): Required<Props> {
  return {
    ...defaultProps,
    ...props,
  } as Required<Props>;
}

export function getCss<Props>(
  style: (props: Required<Props>) => SerializedStyles,
  props: Props,
  defaultProps: Props
) {
  return style(getProps(props, defaultProps));
}

export function init<Props>(
  props: Props,
  defaultProps: Props,
  style?: (props: Required<Props>) => SerializedStyles
): [Required<Props>, SerializedStyles | undefined] {
  const requiredProps = {
    ...defaultProps,
    ...props,
  } as Required<Props>;
  return [requiredProps, style ? style(requiredProps) : undefined];
}

export function multiFire(
  fn: (done: () => void) => void,
  repeat: number,
  delay: number
) {
  return new Promise((resolve) => {
    let times = 0;
    const fire = () => {
      const done = () => {
        times++;
        if (times < repeat) {
          setTimeout(fire, delay);
        } else {
          resolve(undefined);
        }
      };
      fn(done);
    };
    fire();
  });
}

export function findFirstParent(element: HTMLElement, nodeName: string) {
  let node: HTMLElement | null = element;
  while (node) {
    if (node.nodeName === nodeName) {
      return node;
    }
    node = node.parentElement;
  }
}
