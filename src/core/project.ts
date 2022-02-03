import { Ticker } from "src/core/ticker";
import { Scene } from "src/core/scene";
import { Hub } from "src/app/eventHub";
import Renderer from "src/core/renderer";

export interface ProjectSettings {
  title: string;
  fps: number;
  width: number;
  height: number;
}

export const defaultProjectSettings: ProjectSettings = {
  title: "Untitled",
  fps: 24,
  width: 640,
  height: 480,
};

export class Project {
  settings: ProjectSettings;
  ticker: Ticker;
  scenes: Scene[];
  currentScene: Scene;
  renderer: Renderer;

  constructor(settings: ProjectSettings) {
    this.settings = settings;

    const ticker = (this.ticker = new Ticker(settings.fps));

    const defaultScene = new Scene(this);
    this.scenes = [defaultScene];

    this.currentScene = defaultScene;

    this.renderer = new Renderer(this);
  }

  get fps() {
    return this.ticker.frameRate;
  }
}
