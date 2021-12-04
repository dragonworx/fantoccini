export interface RadioGroupOption {
  label: string;
  value: any;
}

export type Position = "left" | "right" | "top" | "bottom";

export type Align = "start" | "center" | "end";

export type Justify = "start" | "center" | "end";

export type Direction = "horizontal" | "vertical";

export interface MenuOption {
  enabled?: boolean;
  text: string;
  value?: any;
  icon?: string;
  shortcut?: string;
}
