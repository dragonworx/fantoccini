// import { Property, PropertyType } from 'src/core/animation/property';
import Timecode from 'timecode-boss';
import { Ticker } from 'src/core/animation/ticker';
import hub from 'src/core/hub';

export class Timeline {
  ticker: Ticker;
  timecode: Timecode;

  constructor(fps: number) {
    this.ticker = new Ticker(fps);
    this.timecode = new Timecode(0, fps);
  }

  setFps(fps: number) {
    if (this.ticker.isRunning) {
      this.ticker.stop();
    }
    this.ticker = new Ticker(fps);
    this.timecode = new Timecode(0, fps);
  }

  tick(deltaMs: number, frameIndex: number) {}
}
