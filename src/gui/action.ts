import hotkeys from 'hotkeys-js';
import EventEmitter from 'eventemitter3';
import hub, { EditorEvent } from 'src/core/hub';

export type ActionHandler = () => void;

export const isMac = () =>
  window.navigator.platform.toLowerCase().indexOf('mac') === 0;

export class Action<T extends string = undefined> {
  isEnabled: boolean = true;
  isChecked: boolean = false;
  canToggle: boolean = false;
  hotkey?: string;
  handler: ActionHandler | Event;

  static notifications = new EventEmitter();

  constructor(handler: ActionHandler | T, shortcut?: string) {
    this.handler = handler;
    this.hotkey = shortcut;
    this.register();
  }

  get printShortcut() {
    return this.hotkey
      .split('+')
      .map(part => part[0].toUpperCase() + part.substring(1))
      .join(' ');
  }

  register() {
    if (this.hotkey) {
      hotkeys(this.hotkey, (event, _handler) => {
        event.preventDefault();
        this.execute();
        return false;
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
      if (typeof this.handler === 'function') {
        this.handler();
      } else {
        hub.emit(this.handler);
      }
      Action.notifications.emit('execute', this);
    }
  }
}

export function action(
  handler: ActionHandler | Event,
  hotkey: string,
  opts: { isEnabled?: boolean; isChecked?: boolean; canToggle?: boolean } = {}
) {
  const action = new Action(handler, hotkey);
  typeof opts.isEnabled === 'boolean'
    ? (action.isEnabled = opts.isEnabled)
    : void 0;
  typeof opts.isChecked === 'boolean'
    ? (action.isChecked = opts.isChecked)
    : void 0;
  typeof opts.canToggle === 'boolean'
    ? (action.canToggle = opts.canToggle)
    : void 0;
  return action;
}
