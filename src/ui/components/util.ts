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
