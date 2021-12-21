import { Command } from "./command";

export type MenuPosition = "dropdown" | "popout";

export type MenuTrigger = "mousedown" | "mouseup";

export interface MenuBarItem {
  label: string;
  items: MenuItem[];
}

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

export type MenuItemOptions = {
  isChecked?: boolean;
  isEnabled?: boolean;
  label: string;
  value?: any;
  icon?: string;
  items?: MenuItem[];
  command?: Command;
};

export class MenuItem {
  private _isEnabled: boolean;
  private _isChecked: boolean;
  label: string;
  value?: any;
  icon?: string;
  items?: MenuItem[];
  command?: Command;

  constructor(opts: MenuItemOptions) {
    const { isChecked, isEnabled, label, value, icon, items, command } = opts;
    this._isEnabled = isEnabled;
    this._isChecked = isChecked;
    this.label = label;
    this.value = value;
    this.icon = icon;
    this.items = items;
    this.command = command;
  }

  get hasCommand() {
    return !!this.command;
  }

  get isEnabled() {
    return this.hasCommand ? this.command.isEnabled : this._isEnabled;
  }

  get isChecked() {
    return this.hasCommand ? this.command.isChecked : this._isChecked;
  }

  get isSeparator() {
    return this.label !== "-";
  }

  get isItem() {
    return !this.isSeparator;
  }

  get isEnabledItem() {
    return this.isEnabled && this.isItem;
  }

  get hasSubMenu() {
    return this.items && this.items.length > 0;
  }

  execute() {
    if (this.hasCommand) {
      this.command.execute();
    }
  }
}

export const separator = new MenuItem({ label: "-" });

export function item(opts: MenuItemOptions) {
  return new MenuItem(opts);
}
