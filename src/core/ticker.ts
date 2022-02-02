import { EventEmitter } from "eventemitter3";

export enum TickerEvent {
  Tick = "tick",
}

export class Ticker extends EventEmitter {
  private fps: number;
  private frameIndex: number = 0;
  private startTime: number = -1;
  private msPerFrame: number = 0;
  private timeoutId?: number;
  private expectedNextFrameTime: number = 0;
  private lastDelta: number = 0;

  constructor(fps: number = 24) {
    super();
    this.fps = fps;
  }

  get frameRate() {
    return this.fps;
  }

  get frameCount() {
    return this.frameIndex;
  }

  private clearTimeout() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  private tick = () => {
    const { expectedNextFrameTime, frameIndex: _frameIndex, msPerFrame } = this;
    const now = Date.now();
    const delta = (this.lastDelta = now - expectedNextFrameTime);
    this.emit(TickerEvent.Tick, _frameIndex + 1);
    this.frameIndex++;
    const adjustedMsPerFrame = msPerFrame - delta;
    this.expectedNextFrameTime = now + adjustedMsPerFrame;
    this.timeoutId = window.setTimeout(this.tick, adjustedMsPerFrame);
  };

  setFps(fps: number) {
    this.fps = fps;
    this.clearTimeout();
  }

  start() {
    this.clearTimeout();
    this.msPerFrame = 1000 / this.fps;
    this.frameIndex = 0;
    this.resume();
  }

  pause() {
    this.clearTimeout();
  }

  resume() {
    this.startTime = Date.now();
    this.msPerFrame = 1000 / this.fps;
    this.expectedNextFrameTime = this.startTime;
    this.tick();
  }

  stop() {
    this.clearTimeout();
    this.frameIndex = 0;
  }
}
