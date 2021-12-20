import hotkeys from "hotkeys-js";
import EventEmitter from "eventemitter3";

export interface Command {
  bindings?: string[];
  handler: () => void;
}

export function cmd(handler: () => void, bindings: string[] = []): Command {
  const command = { bindings, handler };
  hotkeys(bindings.join(","), (event, _handler) => {
    event.preventDefault();
    pubSub.emit("command", command);
    handler();
  });
  return command;
}

class PubSub extends EventEmitter {}

export const pubSub = new PubSub();
