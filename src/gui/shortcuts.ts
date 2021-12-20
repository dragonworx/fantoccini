import EventEmitter from "eventemitter3";

export interface KeyBindings {
  control?: boolean;
  shift?: boolean;
  option?: boolean;
  command?: boolean;
}

// todo: register callbacks, listen globally, execut handler if key combination triggered

export interface Command {
  bindings: KeyBindings;
  handler: () => void;
}

export function cmd(handler: () => void, bindings: KeyBindings = {}): Command {
  return { bindings, handler };
}
