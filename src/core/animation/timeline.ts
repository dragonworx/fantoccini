import Timecode from 'timecode-boss';
import { Ticker } from 'src/core/animation/ticker';
import hub from 'src/core/hub';

(window as any).Timecode = Timecode;

export class Timeline {
  ticker: Ticker;
  timecode: Timecode;

  constructor(fps: number) {
    const ticker = (this.ticker = new Ticker(this, fps));
    this.timecode = new Timecode(0, fps);

    hub
      .on('transport.play', this.onTransportPlay)
      .on('transport.pause', this.onTransportPause)
      .on('transport.stop', this.onTransportStop);
  }

  onTransportPlay = () => this.ticker.start();
  onTransportPause = () => {
    if (this.ticker.isRunning) {
      this.ticker.pause();
    } else {
      this.ticker.resume();
    }
  };
  onTransportStop = () => this.stop();

  stop() {
    this.ticker.stop();
    this.timecode = new Timecode(0, this.ticker.fps);
  }

  close() {
    hub
      .off('transport.play', this.onTransportPlay)
      .off('transport.pause', this.onTransportPause)
      .off('transport.stop', this.onTransportStop);
  }

  setFps(fps: number) {
    this.ticker.setFPS(fps);
    this.timecode = new Timecode(0, fps);
  }

  onTick() {
    const { timecode } = this;
    this.timecode = timecode.add({ frames: 1 });
    const { hours, minutes, seconds, frames } = timecode;
    hub.emit('frame.tick', hours, minutes, seconds, frames);
  }
}
