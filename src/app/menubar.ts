import { Action } from "../gui/action";
import { MenuBarItem, MenuItem, separator } from "../gui/menu";
import app from "./application";
import { Hub, Event } from "./eventHub";

const save = new MenuItem({
  label: "Save",
  isEnabled: false,
  action: new Action(() => {}, "Ctrl+S"),
});

Hub.on(Event.Project_Init, () => {
  save.isEnabled = true;
});

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
    action: new Action(() => {
      app.saveProject();
    }, "Ctrl+O"),
  }),
  separator,
  save,
];

const menubar: MenuBarItem[] = [{ label: "File", items: fileMenu }];

export default menubar;
