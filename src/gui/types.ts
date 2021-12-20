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
  isChecked?: boolean;
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
  handler?: () => void,
  bindings?: string[]
): MenuItem {
  const command = handler ? cmd(handler, bindings) : undefined;
  const item = {
    ...opts,
    command,
  };
  if (command) {
    command.item = item;
  }
  return item;
}

export interface Command {
  bindings?: string[];
  handler: () => void;
  item?: MenuItem;
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

export const pubSub = new EventEmitter();
