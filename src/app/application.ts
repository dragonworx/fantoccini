import { EventEmitter } from "eventemitter3";
import { Project } from "../core/project";
import { Hub, Event } from "./eventHub";

export const screenWidth = document.documentElement.clientWidth;
export const screenHeight = document.documentElement.clientHeight;

export class Application extends EventEmitter {
  project: Project;

  constructor() {
    super();

    Hub.on(Event.Project_New, (opts) => {
      this.project = new Project(opts);
    });
  }
}

const app = new Application();

export default app;
