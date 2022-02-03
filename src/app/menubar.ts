import { Action } from "../gui/action";
import { MenuBarItem, MenuItem, separator } from "../gui/menu";
import app from "./application";
import { Hub, Event } from "./eventHub";

const fileMenu: MenuItem[] = [
  new MenuItem({
    label: "New Project",
    action: new Action(() => {
      Hub.emit(Event.Dialog_Show_New);
    }, "Ctrl+N"),
  }),
  separator,
  new MenuItem({
    label: "Open Project",
    action: new Action(() => {}, "Ctrl+O"),
  }),
  separator,
  new MenuItem({
    label: "Save",
    isEnabled: false,
    action: new Action(() => {}, "Ctrl+S"),
  }),
  new MenuItem({
    label: "Save As...",
    isEnabled: false,
    action: new Action(() => {}, "Ctrl+Shift+S"),
  }),
];

const menubar: MenuBarItem[] = [{ label: "File", items: fileMenu }];

export default menubar;
