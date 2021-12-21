import hotkeys from "hotkeys-js";
import EventEmitter from "eventemitter3";

export type CommandHandler = () => void;

export class Command extends EventEmitter {
  isEnabled: boolean = true;
  isChecked: boolean = false;
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
        this.execute();
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

export function cmd(handler: CommandHandler, hotkey: string) {
  return new Command(handler, hotkey);
}
