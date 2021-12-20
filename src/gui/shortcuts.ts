import hotkeys from "hotkeys-js";

export interface Command {
  bindings?: string[];
  handler: () => void;
}

export function cmd(handler: () => void, bindings: string[] = []): Command {
  const command = { bindings, handler };
  hotkeys(bindings.join(","), (event, _handler) => {
    event.preventDefault();
    handler();
  });
  return command;
}
