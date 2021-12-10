export interface RadioGroupOption {
  label: string;
  value: any;
}

export type Position = "left" | "right" | "top" | "bottom";

export type Align = "start" | "center" | "end";

export type Justify = "start" | "center" | "end";

export type Direction = "horizontal" | "vertical";

export type MenuOption =
  | {
      enabled?: boolean;
      label: string;
      value?: any;
      icon?: string;
      shortcut?: string;
    }
  | string;

export type MenuPosition = "dropdown" | "popout";

export type MenuTrigger = "mousedown" | "mouseup" | "mouseover";
