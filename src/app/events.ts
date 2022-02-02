import EventEmitter from "eventemitter3";

const events = new EventEmitter();

export enum AppEvent {
  ShowNewDialog = "showNewDialog",
  CreateNewProject = "createNewProject",
}

export { events };
