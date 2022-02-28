// import { Property, PropertyType } from 'src/core/animation/property';
import Timecode from 'timecode-boss';
import { Ticker } from 'src/core/animation/ticker';
import hub from 'src/core/hub';

export class Timeline {
  ticker: Ticker;
  timecode: Timecode;

  constructor(fps: number) {
    const ticker = (this.ticker = new Ticker(this, fps));
    this.timecode = new Timecode(0, fps);

    hub
      .on('transport.play', () => ticker.start())
      .on('transport.pause', () => {
        if (ticker.isRunning) {
          ticker.pause();
        } else {
          ticker.resume();
        }
      })
      .on('transport.stop', () => ticker.stop())
      .on('transport.rewind', () => ticker.rewind());
  }

  setFps(fps: number) {
    this.ticker.setFPS(fps);
    this.timecode = new Timecode(0, fps);
  }

  onTick() {
    const { ticker, timecode } = this;
    timecode.setFrames(ticker.frame);
    const { hours, minutes, seconds, frames } = timecode;
    hub.emit('frame.tick', hours, minutes, seconds, frames);
  }
}
