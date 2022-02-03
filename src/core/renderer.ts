import * as PIXI from "pixi.js";
import { Project } from "./project";

export default class Renderer {
  project: Project;
  pixi: PIXI.Application;

  constructor(project: Project) {
    this.project = project;

    this.pixi = new PIXI.Application({
      width: project.settings.width,
      height: project.settings.height,
      backgroundColor: 0x000000,
    });
  }

  get view() {
    return this.pixi.renderer.view;
  }
}
