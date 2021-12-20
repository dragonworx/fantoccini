import EventEmitter from "eventemitter3";

// todo: register callbacks, listen globally, execut handler if key combination triggered

export interface Command {
  bindings?: string[];
  handler: () => void;
}

export function cmd(handler: () => void, bindings?: string[]): Command {
  return { bindings, handler };
}
