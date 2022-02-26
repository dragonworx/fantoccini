import { Action } from "../gui/action";
import { MenuBarItem, MenuItem, separator } from "../gui/menu";
import { Hub, Event } from "./eventHub";

const save = new MenuItem({
  label: "Save",
  isEnabled: false,
  action: new Action(Event.Project_Save, "Ctrl+S"),
});

Hub.on(Event.Project_Init, () => (save.isEnabled = true));

const fileMenu: MenuItem[] = [
  new MenuItem({
    label: "New Project",
    action: new Action(Event.Project_New, "Ctrl+N"),
  }),
  separator,
  new MenuItem({
    label: "Open Project",
    action: new Action(Event.Project_Open, "Ctrl+O"),
  }),
  separator,
  save,
];

const menubar: MenuBarItem[] = [{ label: "File", items: fileMenu }];

export default menubar;
