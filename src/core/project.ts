import { Ticker, TickerEvent } from './ticker';
import { Scene } from './scene';
import { Property } from './Property';

export interface ProjectOptions {
  fps: number;
}

export const defaultProjectOptions: ProjectOptions = {
  fps: 24,
};

export class Project {
  ticker: Ticker;
  scenes: Scene[];
  currentScene: Property<Scene>;

  constructor(opts: ProjectOptions) {
    const ticker = (this.ticker = new Ticker(
      opts.fps || defaultProjectOptions.fps
    ));
    ticker.on(TickerEvent.Tick, this.onTick);
    const defaultScene = new Scene();
    this.scenes = [defaultScene];
    this.currentScene = new Property(defaultScene);
  }

  onTick = (frameIndex: number) => {
    this.currentScene.get(frameIndex).tick(frameIndex);
  };
}
