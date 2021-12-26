import hotkeys from "hotkeys-js";
import EventEmitter from "eventemitter3";

export type ActionHandler = () => void;

export class Action extends EventEmitter {
  isEnabled: boolean = true;
  isChecked: boolean = false;
  canToggle: boolean = false;
  hotkey?: string;
  handler: ActionHandler;

  static notifications = new EventEmitter();

  constructor(handler: ActionHandler, shortcut?: string) {
    super();
    this.handler = handler;
    this.hotkey = shortcut;
    this.register();
  }

  get printShortcut() {
    return this.hotkey
      .split("+")
      .map((part) => part[0].toUpperCase() + part.substring(1))
      .join(" ");
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
      if (this.canToggle) {
        this.isChecked = !this.isChecked;
      }
      this.handler();
      Action.notifications.emit("execute", this);
    }
  }
}

export function action(
  handler: ActionHandler,
  hotkey: string,
  opts: { isEnabled?: boolean; isChecked?: boolean; canToggle?: boolean } = {}
) {
  const action = new Action(handler, hotkey);
  typeof opts.isEnabled === "boolean"
    ? (action.isEnabled = opts.isEnabled)
    : void 0;
  typeof opts.isChecked === "boolean"
    ? (action.isChecked = opts.isChecked)
    : void 0;
  typeof opts.canToggle === "boolean"
    ? (action.canToggle = opts.canToggle)
    : void 0;
  return action;
}
