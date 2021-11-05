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
