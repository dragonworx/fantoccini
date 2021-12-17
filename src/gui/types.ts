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
  enabled?: boolean;
  value?: any;
  icon?: string;
  shortcut?: string;
};

export type MenuPosition = "dropdown" | "popout";

export type MenuTrigger = "mousedown" | "mouseup" | "mouseover";

export interface MenuBarItem {
  label: string;
  menu: MenuItem[];
}
