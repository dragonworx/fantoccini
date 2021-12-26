import { Action } from "./action";

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
  canToggle?: boolean;
  label: string;
  value?: any;
  icon?: string;
  items?: MenuItem[];
  action?: Action;
};

export class MenuItem {
  private _isEnabled: boolean;
  private _isChecked: boolean;
  private _canToggle: boolean;
  label: string;
  value?: any;
  icon?: string;
  items?: MenuItem[];
  action?: Action;

  constructor(opts: MenuItemOptions) {
    const {
      isChecked = false,
      isEnabled = true,
      canToggle = false,
      label,
      value,
      icon,
      items,
      action,
    } = opts;
    this.action = action;
    this.isEnabled = isEnabled;
    this.isChecked = isChecked;
    this.canToggle = canToggle;
    this.label = label;
    this.value = value;
    this.icon = icon;
    this.items = items;
  }

  get hasAction() {
    return !!this.action;
  }

  get isEnabled() {
    return this.hasAction ? this.action.isEnabled : this._isEnabled;
  }

  set isEnabled(value: boolean) {
    if (this.hasAction) {
      this._isEnabled = value;
      this.action.isEnabled = value;
    }
    this._isEnabled = value;
  }

  get isChecked() {
    return this.hasAction ? this.action.isChecked : this._isChecked;
  }

  set isChecked(value: boolean) {
    if (this.hasAction) {
      this._isChecked = value;
      this.action.isChecked = value;
    }
    this._isChecked = value;
  }

  get canToggle() {
    return this.hasAction ? this.action.canToggle : this._canToggle;
  }

  set canToggle(value: boolean) {
    if (this.hasAction) {
      this._canToggle = value;
      this.action.canToggle = value;
    }
    this._canToggle = value;
  }

  get isSeparator() {
    return this.label === "-";
  }

  get isItem() {
    return !this.isSeparator;
  }

  get isInteractive() {
    return !!(this.isEnabled && this.isItem);
  }

  get hasSubMenu() {
    return !!(this.items && this.items.length > 0);
  }

  get hasShortcut() {
    return !!(this.hasAction && this.action.hotkey);
  }

  get hasIcon() {
    return !!(this.icon || this.canToggle || this.isChecked);
  }

  get hasIteractiveSubMenu() {
    if (!this.isInteractive || !this.hasSubMenu) {
      return false;
    } else {
      return this.items.some((item) => item.isInteractive);
    }
  }

  get printShortcut() {
    return this.hasShortcut ? this.action.printShortcut : "";
  }

  execute() {
    if (this.hasAction) {
      this.action.execute();
    }
  }
}

export const separator = new MenuItem({ label: "-" });

export function item(opts: MenuItemOptions) {
  return new MenuItem(opts);
}
