import hotkeys from "hotkeys-js";
import EventEmitter from "eventemitter3";

export type CommandHandler = () => void;

export class Command extends EventEmitter {
  isEnabled: boolean = true;
  isChecked: boolean = false;
  canToggle: boolean = false;
  hotkey?: string;
  handler: CommandHandler;

  static notifications = new EventEmitter();

  constructor(handler: CommandHandler, shortcut?: string) {
    super();
    this.handler = handler;
    this.hotkey = shortcut;
    this.register();
  }

  register() {
    if (this.hotkey) {
      hotkeys(this.hotkey, (event, _handler) => {
        event.preventDefault();
        if (this.canToggle) {
          this.isChecked = !this.isChecked;
          if (this.isChecked) {
            this.execute();
          } else {
            Command.notifications.emit("uncheck", this);
          }
        } else {
          this.execute();
        }
      });
    }
  }

  unregister() {
    if (this.hotkey) {
      hotkeys.unbind(this.hotkey);
    }
  }

  execute() {
    if (this.isEnabled) {
      this.handler();
      Command.notifications.emit("execute", this);
    }
  }
}

export function cmd(
  handler: CommandHandler,
  hotkey: string,
  opts: { isEnabled?: boolean; isChecked?: boolean; canToggle?: boolean } = {}
) {
  const command = new Command(handler, hotkey);
  typeof opts.isEnabled === "boolean"
    ? (command.isEnabled = opts.isEnabled)
    : void 0;
  typeof opts.isChecked === "boolean"
    ? (command.isChecked = opts.isChecked)
    : void 0;
  typeof opts.canToggle === "boolean"
    ? (command.canToggle = opts.canToggle)
    : void 0;
  return command;
}
