import hub from 'src/core/hub';

export class Ticker {
  private _isRunning: boolean = false;
  private fps: number;
  private frameIndex: number = 0;
  private startTime: number = -1;
  private msPerFrame: number = 0;
  private timeoutId?: number;
  private expectedNextFrameTime: number = 0;
  private lastDelta: number = 0;

  constructor(fps: number = 24) {
    this.fps = fps;
    this.msPerFrame = 1000 / this.fps;
  }

  get frameRate() {
    return this.fps;
  }

  get frameCount() {
    return this.frameIndex;
  }

  get isRunning() {
    return this._isRunning;
  }

  private clearTimeout() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  private tick = () => {
    const { expectedNextFrameTime, startTime, frameIndex, msPerFrame } = this;
    const now = Date.now();
    const delta = (this.lastDelta = now - expectedNextFrameTime);
    const adjustedMsPerFrame = msPerFrame - delta;
    this.expectedNextFrameTime = now + adjustedMsPerFrame;
    hub.emit('frame.tick', now - startTime, frameIndex);
    this.frameIndex++;
    this.timeoutId = window.setTimeout(this.tick, adjustedMsPerFrame);
  };

  setFps(fps: number) {
    this.fps = fps;
    this.msPerFrame = 1000 / this.fps;
    this.clearTimeout();
  }

  start() {
    this.clearTimeout();
    this.frameIndex = 0;
    this.resume();
  }

  pause() {
    this.clearTimeout();
    this._isRunning = false;
  }

  resume() {
    this._isRunning = true;
    this.startTime = Date.now();
    this.msPerFrame = 1000 / this.fps;
    this.expectedNextFrameTime = this.startTime;
    this.tick();
  }

  stop() {
    this.clearTimeout();
    this.frameIndex = 0;
    this._isRunning = false;
  }
}
