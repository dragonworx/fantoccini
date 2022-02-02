import { Ticker, TickerEvent } from "./ticker";
import { Scene } from "./scene";
import { Property } from "./property";

export interface ProjectOptions {
  title: string;
  fps: number;
}

export const defaultProjectOptions: ProjectOptions = {
  title: "Untitled",
  fps: 24,
};

export class Project {
  title: string;
  ticker: Ticker;
  scenes: Scene[];
  currentScene: Property<Scene>;

  constructor(opts: ProjectOptions) {
    this.title = opts.title || defaultProjectOptions.title;

    const ticker = (this.ticker = new Ticker(
      opts.fps || defaultProjectOptions.fps
    ));

    ticker.on(TickerEvent.Tick, this.onTick);

    const defaultScene = new Scene();
    this.scenes = [defaultScene];

    this.currentScene = new Property(defaultScene);
  }

  get fps() {
    return this.ticker.frameRate;
  }

  onTick = (frameIndex: number) => {
    // this.currentScene.get(frameIndex).tick(frameIndex);
  };
}
