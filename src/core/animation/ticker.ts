import hub from 'src/core/hub';

export class Ticker {
  private fps: number;
  private startTime: number = -1;
  private msPerFrame: number = 0;
  private timeoutId?: number;
  private expectedNextFrameTime: number = 0;

  isRunning: boolean = false;
  frame: number = 0;
  elapsed: number = 0;

  constructor(fps: number = 24) {
    this.fps = fps;
    this.msPerFrame = 1000 / this.fps;
  }

  private clearTimeout() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  private tick = () => {
    const {
      expectedNextFrameTime,
      startTime,
      frame: frameIndex,
      msPerFrame,
    } = this;
    const now = Date.now();
    const quantiseOffset = now - expectedNextFrameTime;
    const adjustedMsPerFrame = msPerFrame - quantiseOffset;
    this.expectedNextFrameTime = now + adjustedMsPerFrame;
    this.elapsed = now - startTime;
    hub.emit('frame.tick', this.elapsed, frameIndex);
    this.frame++;
    this.timeoutId = window.setTimeout(this.tick, adjustedMsPerFrame);
  };

  start() {
    this.clearTimeout();
    this.frame = 0;
    this.resume();
  }

  pause() {
    this.clearTimeout();
    this.isRunning = false;
  }

  resume() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.msPerFrame = 1000 / this.fps;
    this.expectedNextFrameTime = this.startTime;
    this.tick();
  }

  stop() {
    this.clearTimeout();
    this.frame = 0;
    this.isRunning = false;
  }
}
