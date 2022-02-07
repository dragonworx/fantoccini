import { Hub, Event } from 'src/app/eventHub';

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
    const { expectedNextFrameTime, frameIndex, msPerFrame } = this;
    const now = Date.now();
    const delta = (this.lastDelta = now - expectedNextFrameTime);
    const adjustedMsPerFrame = msPerFrame - delta;
    this.expectedNextFrameTime = now + adjustedMsPerFrame;
    Hub.emit(Event.Transport_Tick, frameIndex);
    this.frameIndex++;
    this.timeoutId = window.setTimeout(this.tick, adjustedMsPerFrame);
  };

  setFps(fps: number) {
    this.fps = fps;
    this.msPerFrame = 1000 / this.fps;
    Hub.emit(Event.Transport_FPS_Change, this.fps);
    this.clearTimeout();
  }

  start() {
    this.clearTimeout();
    this.frameIndex = 0;
    Hub.emit(Event.Transport_Start);
    this.resume();
  }

  pause() {
    this.clearTimeout();
    this._isRunning = false;
    Hub.emit(Event.Transport_Pause);
  }

  resume() {
    this._isRunning = true;
    this.startTime = Date.now();
    this.msPerFrame = 1000 / this.fps;
    this.expectedNextFrameTime = this.startTime;
    Hub.emit(Event.Transport_Resume);
    this.tick();
  }

  stop() {
    this.clearTimeout();
    this.frameIndex = 0;
    this._isRunning = false;
    Hub.emit(Event.Transport_Stop);
  }
}
