import { Command } from "./shortcuts";

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
