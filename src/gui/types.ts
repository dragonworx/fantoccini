export interface RadioGroupOption {
  label: string;
  value: any;
}

export interface ButtonGroupOption {
  icon: string;
  name: string;
  tip?: string;
}

export type Position = "left" | "right" | "top" | "bottom";

export type Align = "start" | "center" | "end";

export type Justify = "start" | "center" | "end";

export type Direction = "horizontal" | "vertical";

export type MenuItem = {
  label: string;
  enabled?: boolean;
  value?: any;
  icon?: string;
  shortcut?: string;
};

export type MenuPosition = "dropdown" | "popout";

export type MenuTrigger = "mousedown" | "mouseup";
