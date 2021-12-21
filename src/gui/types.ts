import hotkeys from "hotkeys-js";
import EventEmitter from "eventemitter3";

export type Position = "left" | "right" | "top" | "bottom";

export type Align = "start" | "center" | "end";

export type Justify = "start" | "center" | "end";

export type Direction = "horizontal" | "vertical";

export interface RadioGroupOption {
  label: string;
  value: any;
}

export interface ButtonGroupOption {
  name: string;
  label?: string;
  icon?: string;
  tip?: string;
}

export type MenuItem = {
  label: string;
  isEnabled?: boolean;
  value?: any;
  icon?: string;
  items?: MenuItem[];
  command?: Command;
};

export type MenuPosition = "dropdown" | "popout";

export type MenuTrigger = "mousedown" | "mouseup";

export interface MenuBarItem {
  label: string;
  items: MenuItem[];
}

export const separator: MenuItem = { label: "-" };

export interface MenuStackItem {
  isActive: boolean;
  setHoverIndex: (index: number) => void;
  getHoverIndex: () => number;
  hasCurrentSubMenu: () => boolean;
  getCurrentItem: () => MenuItem;
  getItems: () => MenuItem[];
  containsEvent: (e: MouseEvent) => boolean;
}

export type onSelectHandler = (item: MenuItem) => void;

export function item(
  opts: Omit<MenuItem, "command">,
  handler?: CommandHandler,
  bindings?: string[]
): MenuItem {
  const item: MenuItem = {
    ...opts,
  };
  if (handler) {
    const command = shortcut({ handler, bindings });
    item.command = command;
  }
  return item;
}

export type CommandHandler = (command: Command) => void;

export interface Command {
  isEnabled: boolean;
  isChecked: boolean;
  bindings?: string[];
  handler: CommandHandler;
}

export function shortcut<T>(opts: {
  isEnabled?: boolean;
  isChecked?: boolean;
  handler: CommandHandler;
  bindings?: string[];
}): Command {
  const { isEnabled = true, isChecked = false, handler, bindings } = opts;
  const command: Command = { isChecked, isEnabled, handler, bindings };
  hotkeys(bindings.join(","), (event, _handler) => {
    event.preventDefault();
    if (command.isEnabled) {
      pubSub.emit("command", command);
      handler(command);
    }
  });
  return command;
}

export const pubSub = new EventEmitter();
