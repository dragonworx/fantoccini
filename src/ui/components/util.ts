import { SerializedStyles } from '@emotion/react';
import { useEffect, useState } from 'react';

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

export function blink(element: HTMLElement) {}

function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
