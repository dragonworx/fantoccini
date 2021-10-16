import { EventEmitter } from 'eventemitter3';

export interface FrameInfo {
  fps: number;
  frameCount: number;
  delta: number;
}

export class Ticker extends EventEmitter {
  private _fps: number;
  private _frameCount: number = 0;
  private startTime: number = -1;
  private msPerFrame: number = 0;
  private timeoutId?: number;
  private expectedNextFrameTime: number = 0;

  constructor(fps: number = 24) {
    super();
    this._fps = fps;
  }

  get fps() {
    return this._fps;
  }

  get frameCount() {
    return this._frameCount;
  }

  private clearTimeout() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  private tick = () => {
    const { expectedNextFrameTime, _fps, _frameCount, msPerFrame } = this;
    const now = Date.now();
    const delta = now - expectedNextFrameTime;
    this.emit('tick', {
      fps: _fps,
      frameCount: _frameCount,
      delta,
    } as FrameInfo);
    this._frameCount++;
    const adjustedMsPerFrame = msPerFrame - delta;
    this.expectedNextFrameTime = now + adjustedMsPerFrame;
    this.timeoutId = window.setTimeout(this.tick, adjustedMsPerFrame);
  };

  setFps(fps: number) {
    this._fps = fps;
    this.clearTimeout();
  }

  start() {
    this.clearTimeout();
    this.msPerFrame = 1000 / this._fps;
    this._frameCount = 0;
    this.resume();
  }

  pause() {
    this.clearTimeout();
  }

  resume() {
    this.startTime = Date.now();
    this.msPerFrame = 1000 / this._fps;
    this.expectedNextFrameTime = this.startTime;
    this.tick();
  }

  stop() {
    this.clearTimeout();
    this._frameCount = 0;
  }
}
