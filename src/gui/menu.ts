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
    const {
      isChecked = false,
      isEnabled = true,
      label,
      value,
      icon,
      items,
      command,
    } = opts;
    this.command = command;
    this.isEnabled = isEnabled;
    this.isChecked = isChecked;
    this.label = label;
    this.value = value;
    this.icon = icon;
    this.items = items;
  }

  get hasCommand() {
    return !!this.command;
  }

  get isEnabled() {
    return this.hasCommand ? this.command.isEnabled : this._isEnabled;
  }

  set isEnabled(value: boolean) {
    if (this.hasCommand) {
      this.command.isEnabled = value;
    }
    this._isEnabled = value;
  }

  get isChecked() {
    return this.hasCommand ? this.command.isChecked : this._isChecked;
  }

  set isChecked(value: boolean) {
    if (this.hasCommand) {
      this.command.isChecked = value;
    }
    this._isChecked = value;
  }

  get isSeparator() {
    return this.label === "-";
  }

  get isItem() {
    return !this.isSeparator;
  }

  get isInteractive() {
    return this.isEnabled && this.isItem;
  }

  get hasSubMenu() {
    return this.items && this.items.length > 0;
  }

  get hasShortcut() {
    return this.hasCommand && !!this.command.hotkey;
  }

  get hasIcon() {
    return !!this.icon;
  }

  get hasIteractiveSubMenu() {
    if (!this.isInteractive || !this.hasSubMenu) {
      return false;
    } else {
      return this.items.some((item) => item.isInteractive);
    }
  }

  get formatShortcut() {
    return this.command.hotkey;
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
