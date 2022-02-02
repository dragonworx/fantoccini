import { EventEmitter } from "eventemitter3";
import { Project } from "../core/project";
import { Action } from "../gui/action";
import { MenuBarItem, MenuItem, separator } from "../gui/menu";
import { events, AppEvent } from "./events";
import db from "./db";

export class Application extends EventEmitter {
  project: Project;

  constructor() {
    super();

    events.on(AppEvent.CreateNewProject, (opts) => {
      this.project = new Project(opts);
      db.projects
        .add({
          title: this.project.title,
          fps: this.project.fps,
        })
        .then((id) => {
          console.log(`Project id ${id}`);
        });
    });
  }

  open(file: string) {
    console.log(file);
  }

  get screenWidth() {
    return document.documentElement.clientWidth;
  }

  get screenHeight() {
    return document.documentElement.clientHeight;
  }

  // async showOpenDialog() {
  //   alert("!");
  // }

  exit() {
    process.exit();
  }
}

const app = new Application();

export default app;

const fileMenu: MenuItem[] = [
  new MenuItem({
    label: "New Project",
    action: new Action(() => {
      events.emit(AppEvent.ShowNewDialog);
    }, "Ctrl+N,Command+N"),
  }),
  separator,
  new MenuItem({
    label: "Open Project",
    action: new Action(() => {
      // app.showOpenDialog().then((result: string) => {
      //   app.open(result);
      // });
    }, "Ctrl+O,Command+O"),
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
  separator,
  new MenuItem({
    label: "Exit",
    action: new Action(() => {
      app.exit();
    }, "Ctrl+Q"),
  }),
];

export const menuBar: MenuBarItem[] = [{ label: "File", items: fileMenu }];
