export interface Shortcut {
  control?: boolean;
  shift?: boolean;
  option?: boolean;
  command?: boolean;
  handler: () => void;
  isDisabled?: boolean;
}

// todo: register callbacks, listen globally, execut handler if key combination triggered
